-- Capital allocation support (run once in the Supabase SQL editor).
-- Nothing here deletes or modifies existing data — it only ADDS
-- two columns and a permission rule if they don't exist yet.

alter table public.leagues
  add column if not exists starting_capital numeric not null default 100000;

alter table public.league_picks
  add column if not exists shares numeric not null default 0;

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

-- League duration (safe to re-run)
alter table public.leagues
  add column if not exists duration_weeks integer not null default 4;
