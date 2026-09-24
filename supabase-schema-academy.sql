-- ============================================================
--  FANTASYTRADER — the Academy score in league standings
--  ------------------------------------------------------------
--  Play 06 asks for the daily question's score to appear in the
--  league standings "as a separate column". The daily question is
--  answered on the device (js/ft-daily-q.js keeps its ledger in
--  localStorage), which is fine for one player and useless for a
--  standings table — nobody can see anybody else's.
--
--  This table is the shared half: one row per player, holding only
--  what the standings need to print. The device stays the source of
--  truth for the ledger; this is the published scoreline.
--
--  Run ONCE in the Supabase SQL editor (Dashboard -> SQL) as the
--  project owner. Idempotent: re-running it changes nothing.
-- ============================================================

create table if not exists public.academy_scores (
    user_id      uuid primary key references auth.users (id) on delete cascade,
    correct      int  not null default 0,     -- lifetime correct answers
    answered     int  not null default 0,     -- lifetime questions answered
    streak       int  not null default 0,     -- current consecutive-correct run
    best_streak  int  not null default 0,
    updated_at   timestamptz not null default now()
);

alter table public.academy_scores enable row level security;

-- Everyone signed in can read the scores: that is the whole point of a
-- standings column. Only the owner can write their own row.
drop policy if exists academy_scores_read  on public.academy_scores;
drop policy if exists academy_scores_write on public.academy_scores;
drop policy if exists academy_scores_edit  on public.academy_scores;

create policy academy_scores_read on public.academy_scores
    for select to authenticated using (true);

create policy academy_scores_write on public.academy_scores
    for insert to authenticated with check (auth.uid() = user_id);

create policy academy_scores_edit on public.academy_scores
    for update to authenticated using (auth.uid() = user_id)
                                 with check (auth.uid() = user_id);

-- ------------------------------------------------------------
--  A client cannot be trusted to only ever move its score upward,
--  but it also has no reason to lie about a quiz. The one thing
--  worth enforcing is that a row never goes backwards, which keeps
--  a stale tab from overwriting a fresher device.
-- ------------------------------------------------------------
create or replace function public.publish_academy_score(
    p_correct int, p_answered int, p_streak int, p_best int
) returns public.academy_scores
language plpgsql security definer set search_path = public as $$
declare v_row public.academy_scores;
begin
    if auth.uid() is null then
        raise exception 'not signed in';
    end if;

    insert into public.academy_scores as a
        (user_id, correct, answered, streak, best_streak, updated_at)
    values
        (auth.uid(), greatest(p_correct, 0), greatest(p_answered, 0),
         greatest(p_streak, 0), greatest(p_best, 0), now())
    on conflict (user_id) do update set
        correct     = greatest(a.correct,  excluded.correct),
        answered    = greatest(a.answered, excluded.answered),
        streak      = excluded.streak,                      -- a streak can legitimately reset to 0
        best_streak = greatest(a.best_streak, excluded.best_streak),
        updated_at  = now()
    returning * into v_row;

    return v_row;
end;
$$;

grant execute on function public.publish_academy_score(int, int, int, int) to authenticated;
