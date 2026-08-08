-- ============================================================
--  STOCKS LEAGUE  —  Supabase schema
--  Run this ONCE in your Supabase project:
--    Dashboard  ->  SQL Editor  ->  New query  ->  paste  ->  Run
--  Safe to re-run: everything uses "if not exists" / "or replace".
-- ============================================================

-- ---------- 1. PROFILES (one row per user) ------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- ---------- 2. PORTFOLIO (the user's main trading account) ---
-- positions is stored as JSON so it maps 1:1 to the app's
-- in-memory portfolio object: { "AAPL": { symbol, shares, avgPrice, totalCost }, ... }
create table if not exists public.portfolios (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  cash        numeric not null default 10000,
  positions   jsonb   not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ---------- 3. TRADES (immutable log of every buy / sell) ----
create table if not exists public.trades (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  symbol      text not null,
  side        text not null check (side in ('buy','sell')),
  shares      numeric not null,
  price       numeric not null,
  league_id   uuid,               -- null = personal account
  created_at  timestamptz not null default now()
);
create index if not exists trades_user_idx on public.trades(user_id, created_at desc);

-- ---------- 4. WATCHLIST -------------------------------------
create table if not exists public.watchlist (
  user_id     uuid not null references auth.users(id) on delete cascade,
  symbol      text not null,
  added_at    timestamptz not null default now(),
  primary key (user_id, symbol)
);

-- ---------- 5. LESSON PROGRESS -------------------------------
create table if not exists public.lesson_progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  module_id   text not null,     -- e.g. 'beginner-module-1'
  completed   boolean not null default false,
  progress    int not null default 0,   -- 0-100
  updated_at  timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- ---------- 6. QUIZ RESULTS ----------------------------------
create table if not exists public.quiz_results (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  module_id   text not null,
  score       int not null,
  total       int not null,
  taken_at    timestamptz not null default now()
);
create index if not exists quiz_user_idx on public.quiz_results(user_id, module_id);

-- ---------- 7. LEAGUES ---------------------------------------
create table if not exists public.leagues (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  owner_id      uuid not null references auth.users(id) on delete cascade,
  join_code     text unique not null,
  starting_cash numeric not null default 10000,
  created_at    timestamptz not null default now()
);

-- ---------- 8. LEAGUE MEMBERS (independent account per league)
create table if not exists public.league_members (
  league_id   uuid not null references public.leagues(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  cash        numeric not null default 10000,
  positions   jsonb   not null default '{}'::jsonb,
  joined_at   timestamptz not null default now(),
  primary key (league_id, user_id)
);

-- ---------- 9. STOCK PRICES (cache filled by the scraper) ----
create table if not exists public.stock_prices (
  symbol       text primary key,
  name         text,
  price        numeric,
  change       numeric,
  change_pct   numeric,
  prev_close   numeric,
  updated_at   timestamptz not null default now()
);

-- ============================================================
--  ROW LEVEL SECURITY
--  Every table is locked down: a logged-in user can only touch
--  their OWN rows. Leagues are readable by their members.
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.portfolios      enable row level security;
alter table public.trades          enable row level security;
alter table public.watchlist       enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_results    enable row level security;
alter table public.leagues         enable row level security;
alter table public.league_members  enable row level security;

-- profiles: owner can read/write own row
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- portfolios
drop policy if exists "own portfolio" on public.portfolios;
create policy "own portfolio" on public.portfolios
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- trades
drop policy if exists "own trades" on public.trades;
create policy "own trades" on public.trades
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- watchlist
drop policy if exists "own watchlist" on public.watchlist;
create policy "own watchlist" on public.watchlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- lesson_progress
drop policy if exists "own progress" on public.lesson_progress;
create policy "own progress" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- quiz_results
drop policy if exists "own quizzes" on public.quiz_results;
create policy "own quizzes" on public.quiz_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- leagues: any authenticated user can read (to browse/join) and create;
-- only the owner can update/delete.
drop policy if exists "read leagues" on public.leagues;
create policy "read leagues" on public.leagues
  for select using (auth.role() = 'authenticated');
drop policy if exists "create leagues" on public.leagues;
create policy "create leagues" on public.leagues
  for insert with check (auth.uid() = owner_id);
drop policy if exists "manage own leagues" on public.leagues;
create policy "manage own leagues" on public.leagues
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "delete own leagues" on public.leagues;
create policy "delete own leagues" on public.leagues
  for delete using (auth.uid() = owner_id);

-- stock_prices: readable by everyone (public market data);
-- only the scraper (service role) writes, which bypasses RLS.
alter table public.stock_prices enable row level security;
drop policy if exists "read prices" on public.stock_prices;
create policy "read prices" on public.stock_prices
  for select using (true);

-- league_members: a user manages only their own membership row
drop policy if exists "read memberships" on public.league_members;
create policy "read memberships" on public.league_members
  for select using (auth.role() = 'authenticated');
drop policy if exists "own membership" on public.league_members;
create policy "own membership" on public.league_members
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
--  AUTO-PROVISION: when a new user signs up, create their
--  profile + starting $10,000 portfolio automatically.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
    on conflict (id) do nothing;
  insert into public.portfolios (user_id, cash, positions)
    values (new.id, 10000, '{}'::jsonb)
    on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
