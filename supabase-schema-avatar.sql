-- Avatars: lets league mates see each other's avatar.
-- Run once in the Supabase SQL editor. The app works without it (avatars stay on each device).
alter table public.profiles add column if not exists avatar text;
