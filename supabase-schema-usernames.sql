-- ============================================================
--  STOCKS LEAGUE — schema UPDATE #3: unique usernames
--  • usernames are globally unique (case kept, uniqueness enforced)
--  • display names (username/full_name) become publicly readable,
--    so league lobbies & standings show real names
--  • signup trigger now saves the chosen username
--  Safe to re-run.
-- ============================================================

alter table public.profiles drop constraint if exists profiles_username_key;
alter table public.profiles add constraint profiles_username_key unique (username);

drop policy if exists "own profile" on public.profiles;
drop policy if exists "read profiles" on public.profiles;
create policy "read profiles" on public.profiles for select using (true);
drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, username)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name',''),
          nullif(new.raw_user_meta_data->>'username',''))
  on conflict (id) do nothing;
  insert into public.portfolios (user_id, cash, positions)
  values (new.id, 10000, '{}'::jsonb)
  on conflict (user_id) do nothing;
  return new;
end;
$$;
