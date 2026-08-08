-- ============================================================
--  FantasyTrader — draft upgrades (safe to run more than once)
--  1) Solo drafts allowed (great for testing a league by yourself)
--  2) Weekly starting lineup support (11 of your 18 picks active)
--  3) Capital allocation columns (if you haven't run the other file)
-- ============================================================

-- ---- allocation + league settings columns (idempotent) ----
alter table public.leagues
  add column if not exists starting_capital numeric not null default 100000;
alter table public.leagues
  add column if not exists duration_weeks integer not null default 4;
alter table public.league_picks
  add column if not exists shares numeric not null default 0;
alter table public.league_picks
  add column if not exists active boolean not null default false;

-- players may update their own picks (shares + lineup)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'league_picks'
      and policyname = 'update own picks'
  ) then
    create policy "update own picks" on public.league_picks
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- ---- start_draft: allow a solo league (1+ players) ----
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

  -- make sure the owner is always a member (self-heal)
  insert into public.league_members (league_id, user_id)
    values (p_league, v_league.owner_id)
    on conflict do nothing;

  select array_agg(user_id order by random())
    into v_order
    from public.league_members
   where league_id = p_league;

  -- CHANGED: one player is enough (solo test drafts)
  if v_order is null or array_length(v_order, 1) < 1 then
    raise exception 'Need at least 1 player to start';
  end if;

  for i in 1 .. array_length(v_order, 1) loop
    update public.league_members
       set draft_position = i - 1
     where league_id = p_league and user_id = v_order[i];
  end loop;

  update public.leagues
     set draft_order = v_order,
         current_pick = 0,
         status = 'drafting'
   where id = p_league
   returning * into v_league;

  return v_league;
end;
$$;

grant execute on function public.start_draft(uuid) to authenticated;
