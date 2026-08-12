-- ============================================================
--  FANTASYTRADER — player feedback
--
--  Run this ONCE in the Supabase SQL editor. Safe to re-run.
--
--  What people type in the "Give feedback" box on the dashboard
--  lands here. Read it in Supabase → Table editor → feedback,
--  newest first.
-- ============================================================

create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  -- null when someone isn't signed in; the message still arrives
  user_id     uuid references auth.users(id) on delete set null,
  username    text,
  message     text not null check (char_length(btrim(message)) between 1 and 4000),
  page        text,
  user_agent  text
);

-- newest first is the only way this ever gets read
create index if not exists feedback_created_idx
  on public.feedback (created_at desc);

alter table public.feedback enable row level security;

-- ---------- who can write ----------
-- Anyone using the app may leave feedback, signed in or not. There's
-- nothing to gain by writing here and the check keeps empty rows out.
drop policy if exists feedback_insert on public.feedback;
create policy feedback_insert on public.feedback
  for insert to anon, authenticated
  with check (char_length(btrim(message)) > 0);

-- ---------- who can read ----------
-- Nobody, through the API. There is deliberately NO select policy, so
-- with RLS on, a select returns zero rows for anon and authenticated
-- even though the insert succeeded. The revoke is belt-and-braces in
-- case RLS is ever switched off by accident.
--
-- This matters: without it, one player could read every other player's
-- feedback — including anything they mentioned about their account.
revoke select, update, delete on public.feedback from anon, authenticated;

-- You read it as the owner in the Supabase dashboard, which bypasses
-- RLS, or from a server with the service_role key.
