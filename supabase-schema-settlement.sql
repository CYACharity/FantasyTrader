-- ============================================================
--  FANTASYTRADER — weekly settlement + capital transfer
--
--  Run this ONCE in the Supabase SQL editor. It is safe to re-run.
--
--  What it does
--    • extends league_weeks with the settlement bookkeeping
--    • ft_settle_league(league)   — decides every finished week's matchups,
--                                   credits winners, opens a debt on losers
--    • ft_pay_week_debt(week)     — the loser confirms after selling
--    • ft_auto_liquidate(week)    — pro-rata sell to cover a missed deadline
--    • ft_settle_all()            — what the scheduled function calls
--
--  The week cycle mirrors the client exactly:
--    season_start → 24h PREP → [ 6d LIVE → 24h TRANSFER ] × duration_weeks
-- ============================================================

-- ---------- 1. bookkeeping columns ----------
alter table public.league_weeks add column if not exists winner_value numeric;
alter table public.league_weeks add column if not exists loser_value  numeric;
alter table public.league_weeks add column if not exists debt_status  text not null default 'pending';
alter table public.league_weeks add column if not exists due_at       timestamptz;
alter table public.league_weeks add column if not exists resolved_at  timestamptz;
alter table public.league_weeks add column if not exists seen_by      uuid[] not null default '{}';

-- 'pending' = loser still owes it, 'paid' = settled by hand,
-- 'auto' = we liquidated for them, 'none' = bye week / tie
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'league_weeks_debt_status_ck') then
    alter table public.league_weeks add constraint league_weeks_debt_status_ck
      check (debt_status in ('pending','paid','auto','none'));
  end if;
end $$;

create index if not exists league_weeks_pending_idx
  on public.league_weeks (debt_status, due_at) where debt_status = 'pending';


-- ---------- 2. helpers ----------

-- Live value of a member: spendable cash + every share marked to market.
create or replace function public.ft_member_value(p_league uuid, p_user uuid)
returns numeric
language sql stable security definer set search_path = public
as $$
  select coalesce(m.cash, 0) + coalesce((
    select sum(p.shares * coalesce(sp.price, p.cost_basis, p.price_at_pick, 0))
    from public.league_picks p
    left join public.stock_prices sp on sp.symbol = p.symbol
    where p.league_id = p_league and p.user_id = p_user
  ), 0)
  from public.league_members m
  where m.league_id = p_league and m.user_id = p_user;
$$;

-- When does week w stop scoring, and when is its transfer window up?
create or replace function public.ft_week_live_end(p_start timestamptz, p_week int)
returns timestamptz language sql immutable as $$
  select p_start + interval '24 hours' + ((p_week - 1) * interval '7 days') + interval '6 days';
$$;

create or replace function public.ft_week_due(p_start timestamptz, p_week int)
returns timestamptz language sql immutable as $$
  select p_start + interval '24 hours' + (p_week * interval '7 days');
$$;


-- ---------- 3. settle every finished week of one league ----------
create or replace function public.ft_settle_league(p_league uuid)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  v_lg      public.leagues;
  v_ids     uuid[];
  v_rest    uuid[];
  v_ord     uuid[];
  v_n       int;
  v_rot     int;
  v_week    int;
  v_i       int;
  v_a       uuid;
  v_b       uuid;
  v_va      numeric;
  v_vb      numeric;
  v_win     uuid;
  v_lose    uuid;
  v_amt     numeric;
  v_made    int := 0;
begin
  select * into v_lg from public.leagues where id = p_league;
  if not found or v_lg.status <> 'active' or v_lg.season_start is null then
    return 0;
  end if;

  -- Players may nudge their OWN league (so results land the moment they open
  -- the page); the scheduler runs with no auth.uid() and skips this check.
  if auth.uid() is not null and not exists (
       select 1 from public.league_members
        where league_id = p_league and user_id = auth.uid()) then
    raise exception 'Not a member of this league';
  end if;

  v_amt := round(coalesce(v_lg.starting_capital, 100000)
                 * coalesce(v_lg.capital_transfer_pct, 5) / 100.0, 2);

  -- Seat order is the draft order, so matchups are reproducible.
  select coalesce(v_lg.draft_order, '{}'::uuid[]) into v_ids;
  if array_length(v_ids, 1) is null or array_length(v_ids, 1) < 2 then
    return 0;
  end if;

  for v_week in 1 .. coalesce(v_lg.duration_weeks, 4) loop
    -- only weeks that have actually finished scoring
    exit when now() < public.ft_week_live_end(v_lg.season_start, v_week);

    -- circle method, identical to the client's roundRobin()
    v_ord := v_ids;
    v_n := array_length(v_ord, 1);
    if v_n % 2 = 1 then
      v_ord := v_ord || null::uuid;
      v_n := v_n + 1;
    end if;
    v_rot := (v_week - 1) % greatest(1, v_n - 1);
    v_rest := v_ord[2:v_n];
    for v_i in 1 .. v_rot loop
      v_rest := array_prepend(v_rest[array_length(v_rest,1)],
                              v_rest[1:array_length(v_rest,1) - 1]);
    end loop;
    v_ord := array_prepend(v_ord[1], v_rest);

    for v_i in 1 .. (v_n / 2) loop
      v_a := v_ord[v_i];
      v_b := v_ord[v_n + 1 - v_i];
      continue when v_a is null or v_b is null;              -- bye week

      -- already settled? leave it alone (this function is idempotent)
      if exists (select 1 from public.league_weeks
                 where league_id = p_league and week = v_week
                   and (winner_id in (v_a, v_b) or loser_id in (v_a, v_b))) then
        continue;
      end if;

      v_va := public.ft_member_value(p_league, v_a);
      v_vb := public.ft_member_value(p_league, v_b);

      if v_va = v_vb then
        -- a draw moves no capital, but we still record the fixture
        insert into public.league_weeks
          (league_id, week, winner_id, loser_id, transfer_amt,
           winner_value, loser_value, debt_status, due_at)
        values (p_league, v_week, v_a, v_b, 0, v_va, v_vb, 'none',
                public.ft_week_due(v_lg.season_start, v_week))
        on conflict do nothing;
        v_made := v_made + 1;
        continue;
      end if;

      if v_va > v_vb then v_win := v_a; v_lose := v_b; else v_win := v_b; v_lose := v_a; end if;

      insert into public.league_weeks
        (league_id, week, winner_id, loser_id, transfer_amt,
         winner_value, loser_value, debt_status, due_at)
      values (p_league, v_week, v_win, v_lose, v_amt,
              greatest(v_va, v_vb), least(v_va, v_vb), 'pending',
              public.ft_week_due(v_lg.season_start, v_week))
      on conflict do nothing;

      -- The winner is paid immediately; the loser owes it and gets the
      -- transfer window to raise the cash however they like.
      update public.league_members
         set cash = cash + v_amt
       where league_id = p_league and user_id = v_win;

      v_made := v_made + 1;
    end loop;
  end loop;

  -- Season finished? close the league out.
  if now() >= public.ft_week_due(v_lg.season_start, coalesce(v_lg.duration_weeks, 4)) then
    update public.leagues set status = 'complete' where id = p_league and status = 'active';
  end if;

  return v_made;
end $$;


-- ---------- 4. the loser pays up by hand ----------
create or replace function public.ft_pay_week_debt(p_league uuid, p_week int)
returns numeric
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.league_weeks;
  v_cash numeric;
begin
  select * into v_row from public.league_weeks
   where league_id = p_league and week = p_week and loser_id = v_uid
   for update;
  if not found then raise exception 'No debt for you in week %', p_week; end if;
  if v_row.debt_status <> 'pending' then return 0; end if;

  select cash into v_cash from public.league_members
   where league_id = p_league and user_id = v_uid for update;

  if v_cash < v_row.transfer_amt then
    raise exception 'Sell more first — you need $% in cash and hold $%',
      round(v_row.transfer_amt, 2), round(v_cash, 2);
  end if;

  update public.league_members set cash = cash - v_row.transfer_amt
   where league_id = p_league and user_id = v_uid;

  update public.league_weeks
     set debt_status = 'paid', resolved_at = now()
   where id = v_row.id;

  return v_row.transfer_amt;
end $$;


-- ---------- 5. deadline passed: take it pro-rata ----------
-- Sells the same fraction of every holding, so nobody's roster gets
-- lopsided by the collection. Runs as the scheduler, not as a user.
create or replace function public.ft_auto_liquidate(p_league uuid, p_week int)
returns numeric
language plpgsql security definer set search_path = public
as $$
declare
  v_row   public.league_weeks;
  v_cash  numeric;
  v_hold  numeric;
  v_short numeric;
  v_frac  numeric;
begin
  select * into v_row from public.league_weeks
   where league_id = p_league and week = p_week for update;
  if not found or v_row.debt_status <> 'pending' then return 0; end if;

  select cash into v_cash from public.league_members
   where league_id = p_league and user_id = v_row.loser_id for update;

  v_short := v_row.transfer_amt - coalesce(v_cash, 0);

  if v_short > 0 then
    select coalesce(sum(p.shares * coalesce(sp.price, p.cost_basis, p.price_at_pick, 0)), 0)
      into v_hold
      from public.league_picks p
      left join public.stock_prices sp on sp.symbol = p.symbol
     where p.league_id = p_league and p.user_id = v_row.loser_id;

    if v_hold <= 0 then
      -- nothing left to sell; wipe what cash there is and call it square
      update public.league_members set cash = 0
       where league_id = p_league and user_id = v_row.loser_id;
      update public.league_weeks set debt_status = 'auto', resolved_at = now() where id = v_row.id;
      return coalesce(v_cash, 0);
    end if;

    v_frac := least(1.0, v_short / v_hold);

    update public.league_picks p
       set shares = round(p.shares * (1 - v_frac), 4)
     where p.league_id = p_league and p.user_id = v_row.loser_id and p.shares > 0;

    update public.league_members
       set cash = coalesce(cash, 0) + (v_hold * v_frac)
     where league_id = p_league and user_id = v_row.loser_id;
  end if;

  update public.league_members
     set cash = greatest(0, cash - v_row.transfer_amt)
   where league_id = p_league and user_id = v_row.loser_id;

  update public.league_weeks
     set debt_status = 'auto', resolved_at = now()
   where id = v_row.id;

  return v_row.transfer_amt;
end $$;


-- ---------- 6. one call for the scheduler ----------
create or replace function public.ft_settle_all()
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_lg     record;
  v_settled int := 0;
  v_auto    int := 0;
begin
  for v_lg in select id from public.leagues where status = 'active' and season_start is not null loop
    v_settled := v_settled + coalesce(public.ft_settle_league(v_lg.id), 0);
  end loop;

  for v_lg in
    select league_id, week from public.league_weeks
     where debt_status = 'pending' and due_at is not null and due_at <= now()
  loop
    perform public.ft_auto_liquidate(v_lg.league_id, v_lg.week);
    v_auto := v_auto + 1;
  end loop;

  return jsonb_build_object('settled', v_settled, 'auto_liquidated', v_auto, 'at', now());
end $$;


-- ---------- 7. mark a result as seen (so the popup fires once) ----------
create or replace function public.ft_ack_week(p_league uuid, p_week int)
returns void
language plpgsql security definer set search_path = public
as $$
declare v_uid uuid := auth.uid();
begin
  update public.league_weeks
     set seen_by = case when v_uid = any(seen_by) then seen_by else seen_by || v_uid end
   where league_id = p_league and week = p_week
     and (winner_id = v_uid or loser_id = v_uid);
end $$;


-- ---------- 8. permissions ----------
-- Postgres hands EXECUTE to PUBLIC on every new function, so lock the
-- collection routines down first and only hand back what players need.
-- Supabase's default privileges grant EXECUTE to anon/authenticated on every
-- new function in public, so revoking from PUBLIC alone is NOT enough — the
-- roles must be named explicitly or any logged-in user can force a collection.
revoke execute on function public.ft_auto_liquidate(uuid, int) from public, anon, authenticated;
revoke execute on function public.ft_settle_all()              from public, anon, authenticated;

grant execute on function public.ft_settle_league(uuid)        to authenticated;
grant execute on function public.ft_pay_week_debt(uuid, int)   to authenticated;
grant execute on function public.ft_ack_week(uuid, int)        to authenticated;
grant execute on function public.ft_member_value(uuid, uuid)   to authenticated;
