-- ============================================================
--  STOCKS LEAGUE — schema UPDATE #2
--  Adds: snake-draft leagues + a watchlist improvement.
--  Run this ONCE in Supabase (SQL Editor), after the first schema.
--  Safe to re-run.
-- ============================================================

-- ---------- watchlist: remember the price when a stock was added
alter table public.watchlist
  add column if not exists price_when_added numeric;

-- ---------- leagues: snake-draft state ----------------------
alter table public.leagues
  add column if not exists roster_size  int  not null default 6,   -- stocks per player = rounds
  add column if not exists max_players  int  not null default 8,
  add column if not exists status       text not null default 'lobby', -- lobby | drafting | active | complete
  add column if not exists draft_order  uuid[] not null default '{}',
  add column if not exists current_pick int  not null default 0;

-- ---------- league_members: seat in the draft ---------------
alter table public.league_members
  add column if not exists draft_position int;

-- ---------- league_picks: one row per drafted stock ---------
create table if not exists public.league_picks (
  id           bigint generated always as identity primary key,
  league_id    uuid not null references public.leagues(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  symbol       text not null,
  pick_number  int  not null,           -- 0-based overall draft order
  round        int  not null,
  price_at_pick numeric,
  created_at   timestamptz not null default now(),
  unique (league_id, symbol),           -- each stock drafted at most once
  unique (league_id, pick_number)
);
create index if not exists league_picks_idx on public.league_picks(league_id, pick_number);

alter table public.league_picks enable row level security;
drop policy if exists "read picks" on public.league_picks;
create policy "read picks" on public.league_picks
  for select using (auth.role() = 'authenticated');
-- inserts happen only through the make_pick() function below (security definer),
-- so we intentionally do NOT add a direct insert policy.

-- ============================================================
--  START DRAFT  — owner randomizes the order and opens the draft
-- ============================================================
create or replace function public.start_draft(p_league uuid)
returns public.leagues
language plpgsql
security definer set search_path = public
as $$
declare
  v_league public.leagues;
  v_order  uuid[];
  i int;
begin
  select * into v_league from public.leagues where id = p_league;
  if v_league is null then raise exception 'League not found'; end if;
  if v_league.owner_id <> auth.uid() then raise exception 'Only the owner can start the draft'; end if;
  if v_league.status <> 'lobby' then raise exception 'Draft already started'; end if;

  -- randomize member order
  select array_agg(user_id order by random())
    into v_order
    from public.league_members
   where league_id = p_league;

  if v_order is null or array_length(v_order,1) < 2 then
    raise exception 'Need at least 2 players to start';
  end if;

  -- record each member's seat
  for i in 1 .. array_length(v_order,1) loop
    update public.league_members
       set draft_position = i - 1
     where league_id = p_league and user_id = v_order[i];
  end loop;

  update public.leagues
     set draft_order = v_order,
         status = 'drafting',
         current_pick = 0
   where id = p_league
   returning * into v_league;

  return v_league;
end;
$$;

-- ============================================================
--  MAKE PICK  — validates turn + uniqueness, records the pick,
--  advances the snake, and finishes the draft when full.
-- ============================================================
create or replace function public.make_pick(p_league uuid, p_symbol text)
returns public.leagues
language plpgsql
security definer set search_path = public
as $$
declare
  v_league public.leagues;
  v_n int;
  v_round int;
  v_pos int;
  v_seat int;
  v_turn uuid;
  v_price numeric;
begin
  select * into v_league from public.leagues where id = p_league for update;
  if v_league is null then raise exception 'League not found'; end if;
  if v_league.status <> 'drafting' then raise exception 'Draft is not active'; end if;

  v_n := array_length(v_league.draft_order, 1);
  v_round := v_league.current_pick / v_n;          -- integer division
  v_pos   := v_league.current_pick % v_n;
  -- snake: even rounds go forward, odd rounds reverse
  if v_round % 2 = 0 then v_seat := v_pos; else v_seat := v_n - 1 - v_pos; end if;
  v_turn := v_league.draft_order[v_seat + 1];       -- arrays are 1-based

  if v_turn <> auth.uid() then raise exception 'Not your turn'; end if;

  if exists (select 1 from public.league_picks
             where league_id = p_league and symbol = upper(p_symbol)) then
    raise exception 'That stock is already taken';
  end if;

  select price into v_price from public.stock_prices where symbol = upper(p_symbol);

  insert into public.league_picks (league_id, user_id, symbol, pick_number, round, price_at_pick)
    values (p_league, auth.uid(), upper(p_symbol), v_league.current_pick, v_round, v_price);

  update public.leagues
     set current_pick = current_pick + 1,
         status = case when current_pick + 1 >= v_n * roster_size then 'active' else 'drafting' end
   where id = p_league
   returning * into v_league;

  return v_league;
end;
$$;

grant execute on function public.start_draft(uuid) to authenticated;
grant execute on function public.make_pick(uuid, text) to authenticated;

-- ============================================================
--  REALTIME — let the draft room update live for every player.
--  Adds these tables to Supabase's realtime publication.
-- ============================================================
do $$
begin
  begin alter publication supabase_realtime add table public.leagues; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.league_picks; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.league_members; exception when duplicate_object then null; end;
end $$;
