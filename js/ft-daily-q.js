/* ============================================================
 *  FT DAILY QUESTION — one course question per calendar day.
 *
 *  Picked deterministically from every choice exercise in
 *  FTCourses, so the same day shows the same question on every
 *  device. Answering is worth XP (30 right, 10 wrong), keeps its
 *  own streak, and records the day's result so league standings
 *  can show it as a column later.
 *
 *  Store key 'ftDailyQ':
 *    last        dayKey of the most recent answer
 *    answered    { [dayKey]: { correct, choice, at } }
 *    streak      consecutive days answered correctly
 *    bestStreak  highest streak reached
 *
 *  Pure logic plus one localStorage document. No DOM.
 * ============================================================ */
(function (global) {
    'use strict';

    const STORE = 'ftDailyQ';
    const XP_RIGHT = 30;
    const XP_WRONG = 10;
    const KEEP_DAYS = 370;

    /* ── store ─────────────────────────────────────────────── */
    function load() {
        let s = null;
        try { s = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { s = null; }
        if (!s || typeof s !== 'object') s = {};
        if (typeof s.last !== 'string') s.last = null;
        if (!s.answered || typeof s.answered !== 'object') s.answered = {};
        if (typeof s.streak !== 'number') s.streak = 0;
        if (typeof s.bestStreak !== 'number') s.bestStreak = 0;
        return s;
    }
    function save(s) {
        try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {}
    }

    /* ── days ──────────────────────────────────────────────── */
    function localDay(d) {
        d = d || new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
               '-' + String(d.getDate()).padStart(2, '0');
    }
    function today() {
        const P = global.FTProgress;
        if (P && typeof P.dayKey === 'function') {
            try { return P.dayKey(); } catch (e) {}
        }
        return localDay();
    }
    /* Shift a YYYY-MM-DD key by n days, in UTC so DST never bites. */
    function shiftDay(key, n) {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key || ''));
        if (!m) return null;
        const t = Date.UTC(+m[1], +m[2] - 1, +m[3]) + n * 86400000;
        const d = new Date(t);
        return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') +
               '-' + String(d.getUTCDate()).padStart(2, '0');
    }

    /* ── the question pool ─────────────────────────────────── */
    let pool = null;
    function questions() {
        if (pool) return pool;
        const C = global.FTCourses;
        if (!C || typeof C.allCourses !== 'function') return [];
        const out = [];
        let courses = [];
        try { courses = C.allCourses() || []; } catch (e) { courses = []; }
        courses.forEach(c => {
            (c.exercises || []).forEach((ex, i) => {
                if (!ex || ex.type !== 'choice') return;
                if (!Array.isArray(ex.options) || ex.options.length < 2) return;
                if (!ex.options.some(o => o && o.correct)) return;
                out.push({
                    courseId: c.id,
                    courseTitle: c.title,
                    track: c.track,
                    trackName: c.trackName || c.track,
                    exIndex: i,
                    art: ex.art || null,
                    prompt: ex.prompt,
                    options: ex.options.map(o => ({ text: o.text, correct: !!o.correct })),
                    why: ex.why || '',
                });
            });
        });
        pool = out;
        return pool;
    }

    /* FNV-1a, 32-bit. Small, stable, plenty for indexing a few hundred. */
    function hash(str) {
        let h = 0x811c9dc5;
        const s = String(str);
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 0x01000193) >>> 0;
        }
        return h >>> 0;
    }

    function pick(dayKey) {
        const q = questions();
        if (!q.length) return null;
        const key = dayKey || today();
        const idx = hash('ftDailyQ:' + key) % q.length;
        return Object.assign({ day: key, index: idx }, q[idx]);
    }

    /* ── status ────────────────────────────────────────────── */
    function status() {
        const s = load();
        const day = today();
        return {
            day,
            question: pick(day),
            answered: s.answered[day] || null,
            streak: s.streak,
            bestStreak: s.bestStreak,
            last: s.last,
        };
    }

    /* ── XP: mirror the engine (load, s.xp += n, save) ─────── */
    function awardXp(n) {
        const P = global.FTProgress;
        const L = global.FTLesson;
        let total = null;
        try {
            if (P && typeof P.load === 'function') {
                const s = P.load();
                s.xp = (typeof s.xp === 'number' ? s.xp : 0) + n;
                P.save(s);
                total = s.xp;
            } else if (L && typeof L.load === 'function') {
                const s = L.load();
                s.xp = (typeof s.xp === 'number' ? s.xp : 0) + n;
                L.save(s);
                total = s.xp;
            }
        } catch (e) {}
        let daily = null;
        try {
            if (P && typeof P.addDailyXp === 'function') daily = P.addDailyXp(n);
        } catch (e) {}
        return { total, daily };
    }

    /* ── answer ────────────────────────────────────────────── */
    function answer(choiceIdx) {
        const day = today();
        const q = pick(day);
        if (!q) return { ok: false, reason: 'no-question' };

        const s = load();
        if (s.answered[day]) {
            return { ok: false, reason: 'answered', record: s.answered[day], streak: s.streak };
        }
        const idx = Number(choiceIdx);
        if (!Number.isInteger(idx) || idx < 0 || idx >= q.options.length) {
            return { ok: false, reason: 'bad-choice' };
        }

        const correct = !!q.options[idx].correct;
        const correctIdx = q.options.findIndex(o => o.correct);

        // streak: consecutive days answered correctly; a wrong answer
        // or a missed day starts it over
        if (s.last !== shiftDay(day, -1)) s.streak = 0;
        s.streak = correct ? s.streak + 1 : 0;
        s.bestStreak = Math.max(s.bestStreak, s.streak);
        s.last = day;
        s.answered[day] = { correct, choice: idx, at: Date.now() };

        // keep the ledger bounded — about a year of days
        const keys = Object.keys(s.answered).sort();
        if (keys.length > KEEP_DAYS) {
            keys.slice(0, keys.length - KEEP_DAYS).forEach(k => { delete s.answered[k]; });
        }
        save(s);

        const gain = correct ? XP_RIGHT : XP_WRONG;
        const xp = awardXp(gain);

        return {
            ok: true,
            correct,
            choice: idx,
            correctIdx,
            why: q.why || '',
            streak: s.streak,
            bestStreak: s.bestStreak,
            xp: gain,
            xpTotal: xp.total,
            daily: xp.daily,
        };
    }

    /* Result for a given day (or today) — what a standings column reads. */
    function resultFor(dayKey) {
        const s = load();
        return s.answered[dayKey || today()] || null;
    }

    /* ── the published scoreline (play 06) ──────────────────
       The ledger above is this device's. `tally` reduces it to the
       four numbers a league standings column needs, and `publish`
       sends them if there is a server and somebody signed in. Both
       are safe to call from anywhere: with no Supabase, publish is
       a no-op and the Academy carries on exactly as before.

       The ledger is capped at KEEP_DAYS, so `correct` and `answered`
       count the window that is still on the device — the server
       keeps the high-water mark, which is what makes the number
       survive a trim, a new browser, or a cleared cache. */
    function tally() {
        const s = load();
        const days = Object.keys(s.answered);
        let correct = 0;
        days.forEach(function (d) { if (s.answered[d] && s.answered[d].correct) correct++; });
        return {
            correct: correct,
            answered: days.length,
            streak: s.streak,
            bestStreak: s.bestStreak,
        };
    }

    function publish() {
        const SL = global.SL;
        if (!SL || typeof SL.publishAcademyScore !== 'function') return Promise.resolve(null);
        try { return Promise.resolve(SL.publishAcademyScore(tally())).catch(function () { return null; }); }
        catch (e) { return Promise.resolve(null); }
    }

    global.FTDailyQ = {
        STORE, XP_RIGHT, XP_WRONG,
        load, save, today, shiftDay, hash,
        questions, pick, status, answer, resultFor,
        tally, publish,
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = global.FTDailyQ;
})(typeof window !== 'undefined' ? window : this);
