-- ============================================================
--  FANTASYTRADER — draft as an event
--  ------------------------------------------------------------
--  What this enables (your-league.html):
--    * draft_at        — the scheduled draft time. create-league.html
--                        already sends it, but no schema defined the
--                        column, so sl.js silently retried the insert
--                        without it and the countdown never had a date.
--                        With the column present the lobby shows a
--                        "Draft starts in" clock and the host's browser
--                        auto-starts the draft at that moment.
--    * pick_started_at — when the current pick went on the clock. Every
--                        browser derives the same remaining seconds from
--                        it instead of each one counting 30s from the
--                        moment it happened to load the page.
--    * pick_seconds    — length of the pick clock (default 30).
--
--  Run this ONCE in the Supabase SQL editor (Dashboard → SQL) as the
--  project owner. It is idempotent: re-running it changes nothing.
-- ============================================================

alter table public.leagues add column if not exists draft_at timestamptz;
alter table public.leagues add column if not exists pick_started_at timestamptz;
alter table public.leagues add column if not exists pick_seconds int not null default 30;

-- ------------------------------------------------------------
--  Stamping the pick clock
--  ------------------------------------------------------------
--  pick_started_at only means something if the server sets it whenever
--  a pick goes on the clock. Two functions do that, and neither is
--  edited by this file — add the one-line change to each yourself:
--
--  1) start_draft — defined in supabase-schema-update.sql (~line 49)
--     and again, for solo leagues, in supabase-schema-draft.sql (~line
--     32); whichever you ran last is live. In its UPDATE that sets
--     status = 'drafting' and current_pick = 0, add one column:
--
--       -- update public.leagues set status = 'drafting', draft_order = v_order, current_pick = 0, pick_started_at = now() where id = p_league returning * into v_league;
--
--  2) make_pick — supabase-schema-update.sql (~line 133). In the UPDATE
--     that advances current_pick after the insert into league_picks, add
--     the same column:
--
--       -- update public.leagues set current_pick = current_pick + 1, pick_started_at = now(), status = case when current_pick + 1 >= v_n * roster_size then 'active' else 'drafting' end where id = p_league returning * into v_league;
--
--  Until those UPDATEs are in place the page falls back to its old
--  behaviour: a client-side 30-second clock that starts when each
--  browser first sees the pick. Nothing breaks either way.
-- ------------------------------------------------------------

-- Optional: let the realtime channel carry the new columns. The page
-- subscribes to public.leagues already; no publication change is needed
-- unless you restricted the publication to specific columns.
