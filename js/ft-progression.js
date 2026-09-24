/* ============================================================
 *  FT PROGRESSION — levels, daily goals, achievements, chests,
 *  streak freezes and the mistakes bank.
 *
 *  Pure logic over one localStorage document. No DOM. Everything
 *  visual reads from here; nothing here reads from the page.
 *
 *  Document shape (key 'ftAcademy', shared with the engine):
 *    xp, gems, hearts, heartsAt, streak, lastDay, lessons{}
 *  plus what this module adds:
 *    daily     { day, xp, goal }
 *    freezes   number of streak freezes held
 *    frozeOn   last day a freeze was consumed
 *    chests    { unitId: true } opened chests
 *    badges    { id: timestamp } earned achievements
 *    mistakes  [ { lesson, prompt, at } ] first-try misses
 * ============================================================ */
(function (global) {
    'use strict';

    const STORE = 'ftAcademy';
    const DAILY_GOAL_DEFAULT = 50;
    const FREEZE_COST = 200;
    const MISTAKES_MAX = 60;

    /* ── document access (shares the engine's key) ─────────── */
    function load() {
        let s;
        try { s = JSON.parse(localStorage.getItem(STORE) || 'null') || {}; }
        catch (e) { s = {}; }
        // engine fields
        if (typeof s.xp !== 'number') s.xp = 0;
        if (typeof s.gems !== 'number') s.gems = 0;
        if (typeof s.streak !== 'number') s.streak = 0;
        if (!s.lessons) s.lessons = {};
        // progression fields
        if (!s.daily) s.daily = { day: null, xp: 0, goal: DAILY_GOAL_DEFAULT };
        if (typeof s.freezes !== 'number') s.freezes = 0;
        if (!s.chests) s.chests = {};
        if (!s.badges) s.badges = {};
        if (!s.mistakes) s.mistakes = [];
        return s;
    }
    function save(s) {
        try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {}
    }
    function dayKey(d) {
        d = d || new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
               '-' + String(d.getDate()).padStart(2, '0');
    }

    /* ── levels ────────────────────────────────────────────────
       Total XP needed to REACH level n. Gentle curve: early levels
       come fast (the hook), later ones stretch out. */
    function xpForLevel(n) {
        if (n <= 1) return 0;
        return Math.round(60 * Math.pow(n - 1, 1.45) + 40 * (n - 1));
    }
    const TITLES = [
        'Newcomer',        // 1
        'Intern',          // 2
        'Junior Analyst',  // 3
        'Analyst',         // 4
        'Associate',       // 5
        'Senior Associate',// 6
        'Trader',          // 7
        'Senior Trader',   // 8
        'Desk Head',       // 9
        'Portfolio Manager',   // 10
        'Senior PM',       // 11
        'Partner',         // 12
        'Fund Manager',    // 13
        'Rainmaker',       // 14
        'Market Legend',   // 15
    ];
    function levelFromXp(xp) {
        let n = 1;
        while (xpForLevel(n + 1) <= xp && n < 60) n++;
        const floor = xpForLevel(n);
        const ceil = xpForLevel(n + 1);
        return {
            level: n,
            title: TITLES[Math.min(n - 1, TITLES.length - 1)],
            into: xp - floor,
            span: ceil - floor,
            pct: Math.min(1, (xp - floor) / Math.max(1, ceil - floor)),
            next: ceil,
        };
    }

    /* ── daily goal ────────────────────────────────────────── */
    function daily(s) {
        s = s || load();
        const today = dayKey();
        if (s.daily.day !== today) {
            s.daily.day = today;
            s.daily.xp = 0;
            save(s);
        }
        return {
            xp: s.daily.xp,
            goal: s.daily.goal || DAILY_GOAL_DEFAULT,
            pct: Math.min(1, s.daily.xp / (s.daily.goal || DAILY_GOAL_DEFAULT)),
            met: s.daily.xp >= (s.daily.goal || DAILY_GOAL_DEFAULT),
        };
    }
    function addDailyXp(amount) {
        const s = load();
        const today = dayKey();
        if (s.daily.day !== today) { s.daily.day = today; s.daily.xp = 0; }
        const before = s.daily.xp;
        s.daily.xp += amount;
        save(s);
        const goal = s.daily.goal || DAILY_GOAL_DEFAULT;
        return { justMet: before < goal && s.daily.xp >= goal, state: daily(s) };
    }

    /* ── streak freezes ────────────────────────────────────────
       Bought with gems, consumed automatically: if the streak WOULD
       reset because a day was missed, a freeze is spent instead and
       the streak survives. Checked lazily whenever the doc loads. */
    function buyFreeze() {
        const s = load();
        if (s.gems < FREEZE_COST) return { ok: false, reason: 'Not enough gems' };
        if (s.freezes >= 2) return { ok: false, reason: 'You can hold at most 2' };
        s.gems -= FREEZE_COST;
        s.freezes += 1;
        save(s);
        return { ok: true, state: s };
    }
    function protectStreak() {
        // called before the engine's touchStreak would zero it
        const s = load();
        if (!s.lastDay) return false;
        const today = dayKey();
        if (s.lastDay === today) return false;
        const y = new Date(); y.setDate(y.getDate() - 1);
        if (s.lastDay === dayKey(y)) return false;      // streak intact anyway
        if (s.freezes > 0) {
            s.freezes -= 1;
            s.frozeOn = today;
            s.lastDay = dayKey(y);                       // pretend yesterday happened
            save(s);
            return true;
        }
        return false;
    }

    /* ── chests ────────────────────────────────────────────────
       One per unit, opened when every lesson in the unit is done.
       Contents are deterministic-ish: gems always, a freeze
       sometimes, so a chest is never a disappointment. */
    function chestFor(unit, s) {
        // callers may hand in a doc loaded by the engine, which doesn't
        // carry the progression fields — normalise rather than trust it
        s = s || load();
        const lessons = s.lessons || {};
        const chests = s.chests || {};
        const done = unit.lessons.every(l => lessons[l.id] && lessons[l.id].done);
        return {
            unitId: unit.id,
            unlocked: done,
            opened: !!chests[unit.id],
        };
    }
    function openChest(unit) {
        const s = load();
        const st = chestFor(unit, s);
        if (!st.unlocked || st.opened) return { ok: false };
        const gems = 40 + unit.lessons.length * 10;
        const freeze = unit.id.endsWith('2') || unit.id.endsWith('4'); // every other unit
        s.gems += gems;
        if (freeze && s.freezes < 2) s.freezes += 1;
        s.chests[unit.id] = true;
        save(s);
        return { ok: true, gems, freeze: freeze && s.freezes <= 2 };
    }

    /* ── achievements ──────────────────────────────────────── */
    const BADGES = [
        { id: 'first',    art: 'star',     name: 'First steps',     test: s => Object.values(s.lessons).some(l => l.done) },
        { id: 'perfect',  art: 'trophy',   name: 'Flawless',        test: s => Object.values(s.lessons).some(l => (l.best || 0) >= 100) },
        { id: 'combo5',   art: 'streak',   name: 'On fire',         test: s => Object.values(s.lessons).some(l => (l.combo || 0) >= 5) },
        { id: 'xp500',    art: 'gem',      name: 'Half a grand',    test: s => s.xp >= 500 },
        { id: 'xp2000',   art: 'compound', name: 'Compounding',     test: s => s.xp >= 2000 },
        { id: 'streak3',  art: 'clock',    name: 'Three days',      test: s => s.streak >= 3 },
        { id: 'streak7',  art: 'shield',   name: 'A full week',     test: s => s.streak >= 7 },
        { id: 'unit1',    art: 'check',    name: 'Unit one down',   test: (s, cur) => unitDone(s, cur, 0) },
        { id: 'halfway',  art: 'balance',  name: 'Halfway there',   test: (s, cur) => doneCount(s) >= Math.ceil(totalLessons(cur) / 2) },
        { id: 'allDone',  art: 'trophy',   name: 'The whole path',  test: (s, cur) => doneCount(s) >= totalLessons(cur) },
        { id: 'cleanup',  art: 'target',   name: 'Cleaned up',      test: s => s.badges._hadMistakes && s.mistakes.length === 0 },
        { id: 'daily',    art: 'candles',  name: 'Goal met',        test: s => s.daily && s.daily.xp >= (s.daily.goal || DAILY_GOAL_DEFAULT) },
    ];
    function doneCount(s) { return Object.values(s.lessons).filter(l => l.done).length; }
    function totalLessons(cur) { return cur ? cur.allLessons().length : 999; }
    function unitDone(s, cur, idx) {
        if (!cur || !cur.UNITS[idx]) return false;
        return cur.UNITS[idx].lessons.every(l => s.lessons[l.id] && s.lessons[l.id].done);
    }

    /* Evaluate all badges; returns any newly earned. */
    function checkBadges() {
        const s = load();
        const cur = global.FTCurriculum || null;
        const fresh = [];
        BADGES.forEach(b => {
            if (s.badges[b.id]) return;
            let ok = false;
            try { ok = b.test(s, cur); } catch (e) {}
            if (ok) { s.badges[b.id] = Date.now(); fresh.push(b); }
        });
        if (fresh.length) save(s);
        return fresh;
    }
    function badgeList() {
        const s = load();
        return BADGES.map(b => ({
            id: b.id, art: b.art, name: b.name,
            earned: !!s.badges[b.id],
            at: s.badges[b.id] || null,
        }));
    }

    /* ── mistakes bank ─────────────────────────────────────────
       Stores POINTERS (lesson id + prompt), never exercise bodies,
       so practice always rebuilds from the live curriculum and can
       never serve stale content. */
    function recordMistake(lessonId, prompt) {
        const s = load();
        if (s.mistakes.some(m => m.lesson === lessonId && m.prompt === prompt)) return;
        s.mistakes.push({ lesson: lessonId, prompt, at: Date.now() });
        if (s.mistakes.length > MISTAKES_MAX) s.mistakes = s.mistakes.slice(-MISTAKES_MAX);
        s.badges._hadMistakes = true;
        save(s);
    }
    function clearMistake(lessonId, prompt) {
        const s = load();
        s.mistakes = s.mistakes.filter(m => !(m.lesson === lessonId && m.prompt === prompt));
        save(s);
    }
    function mistakes() { return load().mistakes.slice(); }

    /* Build a synthetic practice lesson from the bank. */
    function practiceLesson(limit) {
        const cur = global.FTCurriculum;
        if (!cur) return null;
        const bank = mistakes();
        if (!bank.length) return null;
        const exercises = [];
        bank.slice(0, limit || 8).forEach(m => {
            const l = cur.lessonById(m.lesson);
            if (!l) return;
            const ex = l.exercises.find(e => e.prompt === m.prompt);
            if (ex) exercises.push(Object.assign({}, ex, { _mistakeRef: m }));
        });
        if (!exercises.length) return null;
        return {
            id: '_practice',
            title: 'Practice your misses',
            blurb: 'The ones that got you',
            icon: 'target',
            practice: true,
            exercises,
        };
    }

    global.FTProgress = {
        load, save, dayKey,
        xpForLevel, levelFromXp, TITLES,
        daily, addDailyXp, DAILY_GOAL_DEFAULT,
        buyFreeze, protectStreak, FREEZE_COST,
        chestFor, openChest,
        checkBadges, badgeList, BADGES,
        recordMistake, clearMistake, mistakes, practiceLesson,
    };
})(typeof window !== 'undefined' ? window : this);
