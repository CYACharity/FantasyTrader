-- ============================================================
--  FantasyTrader — Team Manager accounting (safe to run twice)
--  1) All columns the post-draft flow needs
--  2) set_position: buy/sell at CURRENT price, weighted-avg cost,
--     cash debited/credited, server-side overspend protection
--  3) Repairs legacy rows where shares were saved without ever
--     debiting cash (the "$200k on the leaderboard" bug)
-- ============================================================

-- ---- columns (idempotent) ----
alter table public.league_members add column if not exists deployed    boolean not null default false;
alter table public.league_members add column if not exists capital_adj numeric  not null default 0;
alter table public.league_members add column if not exists cash_adj    numeric  not null default 0;
alter table public.league_picks   add column if not exists cost_basis  numeric;
alter table public.league_picks   add column if not exists shares      numeric  not null default 0;
alter table public.league_picks   add column if not exists active      boolean  not null default false;
alter table public.leagues        add column if not exists capital_transfer_pct integer not null default 5;
alter table public.leagues        add column if not exists season_start timestamptz;
alter table public.leagues        add column if not exists starting_capital numeric not null default 100000;
alter table public.leagues        add column if not exists duration_weeks integer not null default 4;

-- members may update their own row (deployed flag)
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='league_members'
                 and policyname='update own membership') then
    create policy "update own membership" on public.league_members
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- ---- week results table (steal + capital transfer log) ----
create table if not exists public.league_weeks (
  id            uuid primary key default gen_random_uuid(),
  league_id     uuid not null references public.leagues(id) on delete cascade,
  week          integer not null,
  winner_id     uuid not null,
  loser_id      uuid not null,
  stolen_symbol text,
  transfer_amt  numeric not null default 0,
  created_at    timestamptz not null default now(),
  unique (league_id, week, winner_id, loser_id)
);
alter table public.league_weeks enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='league_weeks'
                 and policyname='read league weeks') then
    create policy "read league weeks" on public.league_weeks for select using (true);
  end if;
end $$;

-- ---- set_position: the ONLY way shares change ----
create or replace function public.set_position(
  p_league uuid, p_symbol text, p_shares numeric, p_price numeric
) returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_uid    uuid := auth.uid();
  v_pick   public.league_picks;
  v_member public.league_members;
  v_league public.leagues;
  v_delta  numeric;          -- +buy / −sell, in shares
  v_cash   numeric;
begin
  if v_uid is null then raise exception 'Sign in first'; end if;
  if p_shares is null or p_shares < 0 then raise exception 'Invalid share count'; end if;
  if p_price is null or p_price <= 0 then raise exception 'No live price for %', p_symbol; end if;

  select * into v_league from public.leagues where id = p_league;
  if v_league is null then raise exception 'League not found'; end if;

  select * into v_pick from public.league_picks
   where league_id = p_league and user_id = v_uid and symbol = p_symbol
   for update;
  if v_pick is null then raise exception 'You did not draft %', p_symbol; end if;

  select * into v_member from public.league_members
   where league_id = p_league and user_id = v_uid
   for update;
  if v_member is null then raise exception 'Not a member of this league'; end if;

  -- heal legacy rows in-flight: cost basis defaults to draft price
  if v_pick.cost_basis is null then v_pick.cost_basis := v_pick.price_at_pick; end if;

  v_delta := p_shares - coalesce(v_pick.shares, 0);
  v_cash  := v_league.starting_capital + v_member.capital_adj + v_member.cash_adj;

  if v_delta > 0 then
    -- BUY at the current price; server refuses overspend
    if v_delta * p_price > v_cash + 0.01 then
      raise exception 'Insufficient cash: need $% but you have $%',
        round(v_delta * p_price, 2), round(v_cash, 2);
    end if;
    update public.league_picks set
      shares     = p_shares,
      -- weighted-average cost basis across old + new shares
      cost_basis = case when p_shares = 0 then null
        else round(((coalesce(v_pick.shares,0) * coalesce(v_pick.cost_basis, p_price))
                    + (v_delta * p_price)) / p_shares, 6) end
      where league_id = p_league and user_id = v_uid and symbol = p_symbol;
    update public.league_members set cash_adj = cash_adj - v_delta * p_price
      where league_id = p_league and user_id = v_uid;
  elsif v_delta < 0 then
    -- SELL at the current price; realized P/L flows into cash
    update public.league_picks set
      shares     = p_shares,
      cost_basis = case when p_shares = 0 then null else v_pick.cost_basis end
      where league_id = p_league and user_id = v_uid and symbol = p_symbol;
    update public.league_members set cash_adj = cash_adj + (-v_delta) * p_price
      where league_id = p_league and user_id = v_uid;
  end if;
end;
$$;
grant execute on function public.set_position(uuid, text, numeric, numeric) to authenticated;

-- ---- REPAIR legacy data ----
-- cost_basis was never written for early allocations
update public.league_picks
   set cost_basis = price_at_pick
 where shares > 0 and cost_basis is null;

-- shares were saved without debiting cash → member looks ~2x rich.
-- Only touches members whose cash was never adjusted at all.
update public.league_members m
   set cash_adj = - (
     select coalesce(sum(p.shares * coalesce(p.cost_basis, p.price_at_pick, 0)), 0)
       from public.league_picks p
      where p.league_id = m.league_id and p.user_id = m.user_id
   )
 where m.cash_adj = 0
   and exists (select 1 from public.league_picks p
                where p.league_id = m.league_id and p.user_id = m.user_id
                  and p.shares > 0);

-- season_start defaults to when the league went active
update public.leagues set season_start = created_at where season_start is null;

-- ---- player-to-player trades ----
create table if not exists public.league_trades (
  id          uuid primary key default gen_random_uuid(),
  league_id   uuid not null references public.leagues(id) on delete cascade,
  from_user   uuid not null,
  to_user     uuid not null,
  give_symbol text not null,
  get_symbol  text not null,
  status      text not null default 'pending',
  created_at  timestamptz not null default now()
);
alter table public.league_trades enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='league_trades' and policyname='read trades') then
    create policy "read trades" on public.league_trades for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='league_trades' and policyname='propose trades') then
    create policy "propose trades" on public.league_trades for insert with check (auth.uid() = from_user);
  end if;
end $$;

-- Accept/decline: both positions cash out at market, then the stocks swap teams.
create or replace function public.respond_league_trade(
  p_trade uuid, p_accept boolean, p_give_price numeric, p_get_price numeric
) returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_t    public.league_trades;
  v_give public.league_picks;
  v_get  public.league_picks;
begin
  select * into v_t from public.league_trades where id = p_trade for update;
  if v_t is null then raise exception 'Trade not found'; end if;
  if v_t.status <> 'pending' then raise exception 'Trade already settled'; end if;
  if auth.uid() <> v_t.to_user then raise exception 'Only the recipient can respond'; end if;

  if not p_accept then
    update public.league_trades set status = 'declined' where id = p_trade;
    return;
  end if;
  if p_give_price is null or p_give_price <= 0 or p_get_price is null or p_get_price <= 0 then
    raise exception 'Live prices required to settle a trade';
  end if;

  select * into v_give from public.league_picks
   where league_id = v_t.league_id and user_id = v_t.from_user and symbol = v_t.give_symbol for update;
  select * into v_get from public.league_picks
   where league_id = v_t.league_id and user_id = v_t.to_user and symbol = v_t.get_symbol for update;
  if v_give is null or v_get is null then raise exception 'A stock in this trade changed hands already'; end if;

  -- cash out both positions to their current owners at market
  update public.league_members set cash_adj = cash_adj + coalesce(v_give.shares, 0) * p_give_price
   where league_id = v_t.league_id and user_id = v_t.from_user;
  update public.league_members set cash_adj = cash_adj + coalesce(v_get.shares, 0) * p_get_price
   where league_id = v_t.league_id and user_id = v_t.to_user;

  -- swap the stocks (fresh, unallocated, benched on their new teams)
  update public.league_picks set user_id = v_t.to_user, shares = 0, cost_basis = null, active = false
   where league_id = v_t.league_id and user_id = v_t.from_user and symbol = v_t.give_symbol;
  update public.league_picks set user_id = v_t.from_user, shares = 0, cost_basis = null, active = false
   where league_id = v_t.league_id and user_id = v_t.to_user and symbol = v_t.get_symbol;

  update public.league_trades set status = 'accepted' where id = p_trade;
end;
$$;
grant execute on function public.respond_league_trade(uuid, boolean, numeric, numeric) to authenticated;
