/* ============================================================
 *  FT LESSON ENGINE
 *
 *  Plays one lesson: a queue of exercises, hearts, XP, a feedback
 *  bar, and a completion screen. Nine exercise types, all driven
 *  from plain data in ft-curriculum.js so writing a new lesson is
 *  writing an array, never HTML.
 *
 *      choice     pick one of N (optionally illustrated)
 *      truefalse  a claim to judge
 *      match      tap pairs until the board clears
 *      order      drag steps into sequence
 *      build      assemble a sentence from a word bank
 *      fill       drop a word into a gap
 *      sort       drag items into labelled buckets
 *      slider     estimate a number on a scale
 *      chart      read a drawn chart and answer
 *
 *  Wrong answers cost a heart and are re-queued at the back, so a
 *  lesson is only finished when everything in it has been answered
 *  correctly at least once.
 * ============================================================ */
(function (global) {
    'use strict';

    const STORE = 'ftAcademy';
    const MAX_HEARTS = 5;
    const HEART_REFILL_MS = 25 * 60 * 1000;    // one heart back every 25 min

    /* ── persistent state ─────────────────────────────────── */
    function blank() {
        return {
            xp: 0,
            gems: 0,
            hearts: MAX_HEARTS,
            heartsAt: Date.now(),
            streak: 0,
            lastDay: null,
            lessons: {},          // id -> { crowns, best, done }
        };
    }
    function load() {
        try {
            const s = JSON.parse(localStorage.getItem(STORE) || 'null');
            if (!s || typeof s !== 'object') return blank();
            return Object.assign(blank(), s);
        } catch (e) { return blank(); }
    }
    function save(s) {
        try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {}
    }

    // Hearts regenerate on a clock. Compute lazily rather than with a timer
    // so it keeps working while the tab is closed.
    function syncHearts(s) {
        if (s.hearts >= MAX_HEARTS) { s.heartsAt = Date.now(); return s; }
        const elapsed = Date.now() - (s.heartsAt || Date.now());
        const gained = Math.floor(elapsed / HEART_REFILL_MS);
        if (gained > 0) {
            s.hearts = Math.min(MAX_HEARTS, s.hearts + gained);
            s.heartsAt = s.hearts >= MAX_HEARTS ? Date.now() : (s.heartsAt + gained * HEART_REFILL_MS);
        }
        return s;
    }

    function dayKey(d) {
        d = d || new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
               '-' + String(d.getDate()).padStart(2, '0');
    }
    function touchStreak(s) {
        const today = dayKey();
        if (s.lastDay === today) return s;
        const y = new Date(); y.setDate(y.getDate() - 1);
        let intact = s.lastDay === dayKey(y);
        // a held streak freeze absorbs the missed day before the reset lands
        if (!intact && global.FTProgress && global.FTProgress.protectStreak()) {
            const fresh = load();
            s.freezes = fresh.freezes;
            intact = true;
        }
        s.streak = intact ? (s.streak || 0) + 1 : 1;
        s.lastDay = today;
        return s;
    }

    /* ── small helpers ────────────────────────────────────── */
    const el = (tag, cls, html) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html != null) n.innerHTML = html;
        return n;
    };
    const esc = (s) => String(s).replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const shuffle = (a) => {
        const r = a.slice();
        for (let i = r.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [r[i], r[j]] = [r[j], r[i]];
        }
        return r;
    };
    const LETTERS = 'ABCDEFGH';

    /* ============================================================
     *  ENGINE
     * ============================================================ */
    /* ── variety ──────────────────────────────────────────
       The 60 course lessons are generated from the module pages, and
       every question in them is "pick one of three" — 255 of 255.
       Played back to back, that is a quiz, not a game.

       This reshapes some of them at load time, using nothing but the
       author's own question and answers, so no fact is invented:

         build   the correct answer, as a word bank to assemble,
                 salted with a few words from the wrong answers
         judge   the question, one proposed answer (right or one of
                 the wrong ones), and you call it Right or Wrong
         choice  the rest stay as they were

       Order is shuffled too. A new mix every play, so a replay is not
       the same four clicks. Hand-written lessons already vary and are
       left exactly as written. */
    const clean = w => String(w).toLowerCase().replace(/[^a-z0-9%$]/g, '');
    function vary(list) {
        if (!list.length || !list.every(e => e.type === 'choice' && e.options && e.options.length > 1)) {
            return list.slice();
        }
        const out = shuffle(list.slice()).map(e => Object.assign({}, e));
        // choose which become what: at most ~a third each, never all of one
        const buildable = out.map((e, i) => {
            const right = e.options.find(o => o.correct);
            if (!right) return -1;
            const t = right.text.trim(), n = t.split(/\s+/).length;
            // only answers that read as a sentence: building "85% stocks, 10% bonds"
            // out of tiles is a number puzzle, not a lesson
            return n >= 4 && n <= 10 && !/[0-9()\[\]$%]/.test(t) ? i : -1;
        }).filter(i => i >= 0);
        const nBuild = Math.min(buildable.length, Math.max(1, Math.round(out.length / 3)));
        const toBuild = new Set(shuffle(buildable).slice(0, nBuild));
        const rest = out.map((_, i) => i).filter(i => !toBuild.has(i));
        const nJudge = Math.max(1, Math.round(out.length / 3));
        const toJudge = new Set(shuffle(rest).slice(0, Math.min(nJudge, rest.length - 1)));

        return out.map((e, i) => {
            const right = e.options.find(o => o.correct);
            if (!right) return e;
            if (toBuild.has(i)) {
                const answer = right.text.trim().split(/\s+/);
                const have = new Set(answer.map(clean));
                const pool = [];
                e.options.filter(o => !o.correct).forEach(o => o.text.trim().split(/\s+/).forEach(w => {
                    const c = clean(w);
                    if (c.length >= 4 && !have.has(c) && !pool.some(p => clean(p) === c)) pool.push(w.replace(/[.,;:]+$/, ''));
                }));
                return {
                    type: 'build', prompt: e.prompt, art: e.art, note: 'Build the answer',
                    words: answer.concat(shuffle(pool).slice(0, 3)), answer,
                    why: e.why || '', whyWrong: 'The answer is “' + right.text + '”.',
                    xp: e.xp, _from: 'choice',
                };
            }
            if (toJudge.has(i)) {
                const wrong = e.options.filter(o => !o.correct);
                const showRight = Math.random() < 0.45 || !wrong.length;
                const shown = showRight ? right : wrong[Math.floor(Math.random() * wrong.length)];
                return {
                    type: 'judge', prompt: e.prompt, art: e.art,
                    claim: shown.text, isTrue: showRight,
                    whyRight: e.why || (showRight ? 'That’s the one.' : 'Right — the answer is “' + right.text + '”.'),
                    whyWrong: showRight ? 'It was right. ' + (e.why || '') : 'That one was wrong. The answer is “' + right.text + '”.',
                    xp: e.xp, _from: 'choice',
                };
            }
            return e;
        });
    }

    function Engine(opts) {
        this.lesson = opts.lesson;
        this.mount = opts.mount;
        this.onExit = opts.onExit || function () {};
        this.state = syncHearts(load());

        this.queue = this.lesson.practice ? this.lesson.exercises.slice() : vary(this.lesson.exercises);
        this.total = this.queue.length;
        this.done = 0;
        this.rightFirstTry = 0;
        this.attempts = 0;
        this.startedAt = Date.now();
        this.current = null;
        this.checked = false;
        this.answer = null;

        // combo = consecutive correct answers within this lesson
        this.combo = 0;
        this.bestCombo = 0;
        this.idleTimer = null;
        // snapshot so the completion screen can report XP earned in THIS
        // lesson rather than a number derived from the running total
        this.xpAtStart = this.state.xp;

        // teach cards: shown before any exercise, so nobody is quizzed on
        // something the lesson didn't just show them
        /* A lesson may carry its own cards — the 60 generated courses do,
           since theirs come out of the module pages rather than the hand
           written TEACH table. */
        this.teach = this.lesson.practice ? null
            : (this.lesson.teach && this.lesson.teach.length ? this.lesson.teach
               : (global.FTTeach ? global.FTTeach.for(this.lesson.id) : null));
        this.teachAt = 0;
    }

    Engine.prototype.start = function () {
        if (this.state.hearts <= 0) { this.renderNoHearts(); return; }
        this.renderChrome();
        this.spawnBull();
        if (this.teach && this.teach.length) {
            this.renderTeach();
        } else {
            this.next();
        }
    };

    /* ── teach cards ──────────────────────────────────────────
       One idea per card. No hearts, no XP, no wrong answers —
       this is the part where the lesson holds your hand. */
    Engine.prototype.renderTeach = function () {
        const card = this.teach[this.teachAt];
        if (!card) { this.next(); return; }

        this.stage.innerHTML = '';
        const box = el('div', 'lx-ex lx-teach');
        box.innerHTML =
            '<div class="lx-teach-dots">' +
                this.teach.map((_, i) =>
                    '<i class="' + (i === this.teachAt ? 'on' : i < this.teachAt ? 'done' : '') + '"></i>'
                ).join('') +
            '</div>' +
            '<div class="lx-teach-art">' + (global.FTArt ? global.FTArt.get(card.art) : '') + '</div>' +
            '<h2 class="lx-teach-title lx-display">' + esc(card.title) + '</h2>' +
            '<p class="lx-teach-text">' + esc(card.text) + '</p>';

        const btn = el('button', 'lx-btn primary wide',
            this.teachAt + 1 < this.teach.length ? 'Next' : 'Start the exercises');
        btn.style.marginTop = '1.6rem';
        btn.onclick = () => {
            if (J()) J().sfx.tap();
            this.teachAt++;
            if (this.teachAt < this.teach.length) this.renderTeach();
            else {
                if (this.bull) this.bull.say('Now you. Same ideas, your answers.', { ms: 2600 });
                this.next();
            }
        };
        box.appendChild(btn);
        this.stage.appendChild(box);

        if (this.bull) this.teachAside();
        if (this.teachAt === 0 && this.bull) {
            setTimeout(() => this.bull && this.bull.say('Quick read first — then I quiz you.', { ms: 2800 }), 900);
        }
    };

    /* ── badge toasts ─────────────────────────────────────── */
    Engine.prototype.toastBadges = function (badges) {
        if (!badges || !badges.length) return;
        badges.forEach((b, i) => {
            setTimeout(() => {
                const t = el('div', 'lx-toast');
                t.innerHTML =
                    '<span class="lx-toast-art">' + (global.FTArt ? global.FTArt.node(b.art, 30) : '') + '</span>' +
                    '<span><b>Achievement</b>' + esc(b.name) + '</span>';
                // several at once used to land on the same spot and cover each other
                t.style.top = (16 + document.querySelectorAll('.lx-toast').length * 72) + 'px';
                document.body.appendChild(t);
                if (J()) J().sfx.pop();
                setTimeout(() => t.classList.add('show'), 30);
                setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3400);
            }, i * 900);
        });
    };

    /* The bull is optional: if ft-bull.js isn't on the page the engine
       carries on without him rather than throwing. */
    /* Mentoring is opt-out, and the switch lives on the Academy. Every
       call on `this.bull` below is already guarded, so when he is off the
       lesson simply runs without him — no second code path to keep. */
    Engine.prototype.mentorOn = function () {
        try { return localStorage.getItem('ftRallyMentor') !== '0'; } catch (e) { return true; }
    };

    Engine.prototype.spawnBull = function () {
        if (!global.FTBull || !this.mentorOn()) return;
        this.bull = global.FTBull.create({ size: 86, facing: 'right' });
        this.bull.mount(document.body);
        setTimeout(() => this.bull && this.bull.react('greet'), 550);
        this.armIdleNudge();
    };

    /* What he says while a concept card is up. Short, and not every card —
       a mascot that comments on everything stops being worth reading. The
       card itself does the teaching; he is the one walking you through it. */
    const ASIDES = [
        "This one's worth knowing.", "Read that twice.", "Simple, but people get it wrong.",
        "Still with me?", "That's the bit that matters.", "Nothing tricky here.",
        "This comes up again later.", "Slow down on this one.",
    ];
    Engine.prototype.teachAside = function () {
        if (!this.bull || this.teachAt === 0) return;
        if (Math.random() < 0.45) return;             // often he just watches
        const line = ASIDES[Math.floor(Math.random() * ASIDES.length)];
        if (line === this._lastAside) return;
        this._lastAside = line;
        this.bull.setState(Math.random() < 0.5 ? 'think' : 'happy', 1800);
        setTimeout(() => this.bull && this.bull.say(line, { ms: 2400 }), 700);
    };

    /* If someone stares at an exercise for a long time he offers a word.
       Reset on any interaction so he never talks over you. */
    Engine.prototype.armIdleNudge = function () {
        clearTimeout(this.idleTimer);
        if (!this.bull) return;
        this.idleTimer = setTimeout(() => {
            if (this.checked || !this.bull) return;
            this.bull.react('think', { speak: true });
            this.idleTimer = setTimeout(() => {
                if (!this.checked && this.bull) this.bull.react('idle');
            }, 26000);
        }, 22000);
    };

    const J = () => global.FTJuice;

    /* The engine and FTProgress share one localStorage doc. The engine
       holds its copy in memory for a whole lesson, so writing that copy
       back verbatim would wipe anything progression wrote in between
       (mistakes, daily XP, badges, chests). Persist by merging: only the
       fields the engine owns are taken from memory; everything else is
       whatever is freshest on disk. */
    Engine.prototype.persist = function () {
        const fresh = load();
        ['xp', 'gems', 'hearts', 'heartsAt', 'streak', 'lastDay'].forEach(k => {
            if (this.state[k] !== undefined) fresh[k] = this.state[k];
        });
        fresh.lessons = Object.assign({}, fresh.lessons, this.state.lessons);
        save(fresh);
    };

    Engine.prototype.renderChrome = function () {
        this.mount.innerHTML = '';

        const bar = el('div', 'lx-topbar');
        const exit = el('button', 'lx-exit', '&times;');
        exit.setAttribute('aria-label', 'Leave lesson');
        exit.onclick = () => this.confirmExit();

        const seg = el('div', 'lx-segbar');
        this.segs = [];
        for (let i = 0; i < this.total; i++) {
            const s = el('div', 'lx-seg', '<i></i>');
            seg.appendChild(s); this.segs.push(s);
        }

        const hearts = el('div', 'lx-hearts');
        this.heartNodes = [];
        for (let i = 0; i < MAX_HEARTS; i++) {
            const h = el('span', 'lx-heart',
                '<svg viewBox="0 0 24 24" fill="#D9645C"><path d="M12 21S3 14.5 3 8.6A5 5 0 0 1 12 5.9 5 5 0 0 1 21 8.6C21 14.5 12 21 12 21z"/></svg>');
            hearts.appendChild(h); this.heartNodes.push(h);
        }

        /* Rally toggle, in the lesson chrome so he can be sent away from
           inside a course rather than only from the Academy. Same key the
           Academy switch writes, so the two always agree. */
        const mentor = el('button', 'lx-exit lx-mentor');
        mentor.setAttribute('aria-label', 'Toggle Rally');
        const paintMentor = () => {
            const on = this.mentorOn();
            mentor.classList.toggle('off', !on);
            mentor.title = on ? 'Rally is mentoring — tap to turn off'
                              : 'Rally is off — tap to bring him back';
            mentor.innerHTML = global.FTBull ? global.FTBull.rigSVG() : '';
            const rig = mentor.querySelector('.bull-rig');
            if (rig) rig.setAttribute('class', 'bull-rig is-idle');
        };
        mentor.onclick = () => {
            const next = !this.mentorOn();
            try { localStorage.setItem('ftRallyMentor', next ? '1' : '0'); } catch (e) {}
            paintMentor();
            if (next) { if (!this.bull) { this.spawnBull(); } }
            else if (this.bull) { this.bull.destroy(); this.bull = null; }
            if (J()) J().sfx[next ? 'pop' : 'tap']();
        };
        paintMentor();

        // sound toggle — off is remembered, and audio never starts
        // until the first real gesture anyway
        const snd = el('button', 'lx-exit lx-sound');
        snd.setAttribute('aria-label', 'Toggle sound');
        const paintSnd = () => {
            const m = J() ? J().muted() : true;
            snd.innerHTML = m
                ? '<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">' +
                  '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9l5 5m0-5l-5 5" stroke="currentColor" ' +
                  'stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
                : '<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">' +
                  '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" ' +
                  'stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        };
        snd.onclick = () => {
            if (!J()) return;
            J().setMuted(!J().muted());
            paintSnd();
            if (!J().muted()) { J().unlock(); J().sfx.tap(); }
        };
        paintSnd();

        bar.appendChild(exit); bar.appendChild(seg); bar.appendChild(hearts);
        bar.appendChild(mentor); bar.appendChild(snd);
        this.mount.appendChild(bar);

        this.stage = el('div', 'lx-stage');
        this.mount.appendChild(this.stage);

        this.fb = el('div', 'lx-feedback');
        this.fb.innerHTML =
            '<div class="lx-fb-inner">' +
              '<div class="lx-fb-icon"></div>' +
              '<div class="lx-fb-text"><div class="lx-fb-title"></div><div class="lx-fb-why"></div></div>' +
              '<button class="lx-btn primary lx-fb-btn">Continue</button>' +
            '</div>';
        document.body.appendChild(this.fb);
        this.fb.querySelector('.lx-fb-btn').onclick = () => this.advance();

        this.paintHearts();
    };

    Engine.prototype.paintHearts = function () {
        if (!this.heartNodes) return;
        this.heartNodes.forEach((h, i) => h.classList.toggle('gone', i >= this.state.hearts));
    };

    Engine.prototype.paintProgress = function () {
        if (!this.segs) return;
        this.segs.forEach((s, i) => {
            s.classList.toggle('done', i < this.done);
            s.classList.toggle('current', i === this.done);
        });
    };

    Engine.prototype.confirmExit = function () {
        if (this.done === 0 || confirm('Leave now and you lose progress in this lesson. Sure?')) {
            this.cleanup(); this.onExit();
        }
    };

    Engine.prototype.cleanup = function () {
        clearTimeout(this.idleTimer);
        if (this.fb && this.fb.parentNode) this.fb.parentNode.removeChild(this.fb);
        if (this.bull) { this.bull.destroy(); this.bull = null; }
    };

    /* ── the loop ─────────────────────────────────────────── */
    Engine.prototype.next = function () {
        this.checked = false;
        this.answer = null;
        this.fb.classList.remove('show', 'ok', 'no');
        this.paintProgress();

        if (!this.queue.length) { this.complete(); return; }

        this.current = this.queue.shift();
        this.stage.innerHTML = '';

        const box = el('div', 'lx-ex');
        const ex = this.current;

        if (ex.art && global.FTArt) {
            const art = el('div', 'lx-art', global.FTArt.get(ex.art));
            box.appendChild(art);
        }

        box.appendChild(el('h2', 'lx-prompt lx-display', esc(ex.prompt)));
        if (ex.note) box.appendChild(el('p', 'lx-subprompt', esc(ex.note)));

        const body = el('div', 'lx-body');
        box.appendChild(body);
        this.stage.appendChild(box);

        const build = this['build_' + ex.type];
        if (typeof build !== 'function') {
            body.appendChild(el('p', 'lx-subprompt', 'Unsupported exercise type: ' + esc(ex.type)));
            this.checkBtn = null;
            return;
        }
        build.call(this, ex, body);

        // every type gets the same Check button unless it self-checks
        if (!ex._selfCheck) {
            const btn = el('button', 'lx-btn primary wide', 'Check');
            btn.style.marginTop = '1.6rem';
            btn.disabled = true;
            btn.onclick = () => this.check();
            this.checkBtn = btn;
            this.stage.appendChild(btn);
        } else {
            this.checkBtn = null;
        }
    };

    Engine.prototype.ready = function (on) {
        if (this.checkBtn) this.checkBtn.disabled = !on;
    };

    /* ── exercise builders ────────────────────────────────── */

    Engine.prototype.build_choice = function (ex, body) {
        const opts = ex.shuffle === false ? ex.options.slice() : shuffle(ex.options);
        const visual = opts.some(o => o.art);
        const wrap = el('div', 'lx-choices' + (visual ? ' grid2' : ''));
        opts.forEach((o, i) => {
            const b = el('button', 'lx-choice' + (visual ? ' visual' : ''));
            if (visual && o.art && global.FTArt) {
                b.innerHTML = global.FTArt.get(o.art) + '<span>' + esc(o.text) + '</span>';
            } else {
                b.innerHTML = '<span class="lx-key">' + LETTERS[i] + '</span><span>' + esc(o.text) + '</span>';
            }
            b.onclick = () => {
                if (this.checked) return;
                wrap.querySelectorAll('.lx-choice').forEach(c => c.classList.remove('picked'));
                b.classList.add('picked');
                this.answer = o;
                this.ready(true);
            };
            wrap.appendChild(b);
        });
        body.appendChild(wrap);
        this._choiceWrap = wrap;
    };

    Engine.prototype.build_truefalse = function (ex, body) {
        ex.options = [{ text: 'True', correct: !!ex.isTrue }, { text: 'False', correct: !ex.isTrue }];
        ex.shuffle = false;
        this.build_choice(ex, body);
    };

    /* judge: one proposed answer to the question, called Right or Wrong */
    Engine.prototype.build_judge = function (ex, body) {
        const card = el('div', 'lx-judge');
        card.innerHTML = '<span class="lx-judge-k">Is this the answer?</span><p></p>';
        card.querySelector('p').textContent = '“' + ex.claim + '”';
        body.appendChild(card);
        ex.options = [
            { text: 'Right', correct: !!ex.isTrue,  why: ex.isTrue ? ex.whyRight : ex.whyWrong },
            { text: 'Wrong', correct: !ex.isTrue,   why: ex.isTrue ? ex.whyWrong : ex.whyRight },
        ];
        ex.shuffle = false;
        this.build_choice(ex, body);
        if (this._choiceWrap) this._choiceWrap.classList.add('lx-judge-btns');
    };

    Engine.prototype.build_match = function (ex, body) {
        ex._selfCheck = true;
        const left = shuffle(ex.pairs.map((p, i) => ({ t: p[0], i })));
        const right = shuffle(ex.pairs.map((p, i) => ({ t: p[1], i })));
        const grid = el('div', 'lx-match');
        let sel = null, cleared = 0;

        const mk = (item, side) => {
            const t = el('button', 'lx-tile', esc(item.t));
            t.dataset.i = item.i; t.dataset.side = side;
            t.onclick = () => {
                if (t.classList.contains('done')) return;
                if (!sel) { sel = t; t.classList.add('sel'); return; }
                if (sel === t) { sel.classList.remove('sel'); sel = null; return; }
                if (sel.dataset.side === side) {           // same column, move the selection
                    sel.classList.remove('sel'); sel = t; t.classList.add('sel'); return;
                }
                if (sel.dataset.i === t.dataset.i) {
                    sel.classList.remove('sel'); sel.classList.add('done'); t.classList.add('done');
                    sel = null; cleared++;
                    if (cleared === ex.pairs.length) {
                        this.answer = { correct: true };
                        this.grade(true, ex.why || 'All matched.');
                    }
                } else {
                    const a = sel, b = t;
                    a.classList.add('miss'); b.classList.add('miss');
                    setTimeout(() => { a.classList.remove('miss', 'sel'); b.classList.remove('miss'); }, 420);
                    sel = null;
                    this.answer = { correct: false };
                    this.grade(false, ex.whyWrong || 'Not a pair. Look again at what each term actually describes.');
                }
            };
            return t;
        };
        // interleave so columns line up visually
        for (let i = 0; i < ex.pairs.length; i++) {
            grid.appendChild(mk(left[i], 'l'));
            grid.appendChild(mk(right[i], 'r'));
        }
        body.appendChild(grid);
    };

    Engine.prototype.build_order = function (ex, body) {
        const list = el('div', 'lx-order');
        let items = shuffle(ex.steps.map((s, i) => ({ text: s, correct: i })));
        // guarantee it doesn't start already solved
        if (items.every((it, i) => it.correct === i) && items.length > 1) items.reverse();

        const paint = () => {
            list.innerHTML = '';
            items.forEach((it, idx) => {
                const row = el('div', 'lx-step');
                row.draggable = true;
                row.innerHTML = '<span class="lx-step-n">' + (idx + 1) + '</span>' +
                                '<span>' + esc(it.text) + '</span><span class="lx-grip">⋮⋮</span>';
                row.ondragstart = e => { row.classList.add('dragging'); e.dataTransfer.setData('text/plain', String(idx)); };
                row.ondragend = () => row.classList.remove('dragging');
                row.ondragover = e => { e.preventDefault(); row.classList.add('over'); };
                row.ondragleave = () => row.classList.remove('over');
                row.ondrop = e => {
                    e.preventDefault(); row.classList.remove('over');
                    const from = Number(e.dataTransfer.getData('text/plain'));
                    if (Number.isNaN(from) || from === idx) return;
                    const moved = items.splice(from, 1)[0];
                    items.splice(idx, 0, moved);
                    paint(); this.answer = items; this.ready(true);
                };
                // tap-friendly fallback: buttons to nudge up/down
                row.onclick = () => {
                    if (idx === 0) return;
                    const moved = items.splice(idx, 1)[0];
                    items.splice(idx - 1, 0, moved);
                    paint(); this.answer = items; this.ready(true);
                };
                list.appendChild(row);
            });
        };
        paint();
        body.appendChild(list);
        body.appendChild(el('p', 'lx-subprompt',
            'Drag to reorder — or tap a row to move it up one.'));
        this.answer = items;
        this.ready(true);
    };

    Engine.prototype.build_build = function (ex, body) {
        const answerLine = el('div', 'lx-answer-line');
        const bank = el('div', 'lx-bank');
        const chosen = [];
        const words = shuffle(ex.words.slice());

        const repaint = () => {
            answerLine.innerHTML = '';
            chosen.forEach((w, i) => {
                const t = el('button', 'lx-word in-answer', esc(w));
                t.onclick = () => { chosen.splice(i, 1); repaint(); };
                answerLine.appendChild(t);
            });
            bank.querySelectorAll('.lx-word').forEach(node => {
                const used = chosen.filter(c => c === node.dataset.w).length;
                const avail = words.filter(w => w === node.dataset.w).length;
                node.classList.toggle('used', used >= avail);
            });
            this.answer = chosen.slice();
            this.ready(chosen.length > 0);
        };

        words.forEach(w => {
            const t = el('button', 'lx-word', esc(w));
            t.dataset.w = w;
            t.onclick = () => { if (!t.classList.contains('used')) { chosen.push(w); repaint(); } };
            bank.appendChild(t);
        });

        body.appendChild(answerLine);
        body.appendChild(bank);
        repaint();
    };

    Engine.prototype.build_fill = function (ex, body) {
        const parts = ex.sentence.split('___');
        const line = el('div', 'lx-answer-line');
        line.style.borderBottom = 'none';
        line.style.fontSize = '1.05rem';
        line.style.lineHeight = '2.1';

        let picked = null;
        const gap = el('span', 'lx-word in-answer', '_____');
        gap.style.minWidth = '90px';
        gap.style.textAlign = 'center';
        gap.onclick = () => { if (picked) { picked = null; gap.textContent = '_____'; repaint(); } };

        line.appendChild(el('span', '', esc(parts[0] || '')));
        line.appendChild(gap);
        line.appendChild(el('span', '', esc(parts[1] || '')));

        const bank = el('div', 'lx-bank');
        const repaint = () => {
            bank.querySelectorAll('.lx-word').forEach(n => n.classList.toggle('used', picked === n.dataset.w));
            this.answer = picked;
            this.ready(!!picked);
        };
        shuffle(ex.options.slice()).forEach(w => {
            const t = el('button', 'lx-word', esc(w));
            t.dataset.w = w;
            t.onclick = () => { picked = w; gap.textContent = w; repaint(); };
            bank.appendChild(t);
        });

        body.appendChild(line);
        body.appendChild(bank);
        repaint();
    };

    Engine.prototype.build_sort = function (ex, body) {
        const buckets = el('div', 'lx-buckets');
        buckets.style.gridTemplateColumns = 'repeat(' + Math.min(ex.buckets.length, 2) + ', 1fr)';
        const placed = {};      // item -> bucket index

        const pool = el('div', 'lx-pool');
        const items = shuffle(ex.items.slice());

        const mkChip = (it) => {
            const c = el('div', 'lx-chip', esc(it.text));
            c.draggable = true; c.dataset.text = it.text;
            c.ondragstart = e => { c.classList.add('dragging'); e.dataTransfer.setData('text/plain', it.text); };
            c.ondragend = () => c.classList.remove('dragging');
            // tap fallback: cycle through buckets
            c.onclick = () => {
                const cur = placed[it.text];
                const nextIdx = cur == null ? 0 : (cur + 1 >= ex.buckets.length ? null : cur + 1);
                if (nextIdx == null) { delete placed[it.text]; } else { placed[it.text] = nextIdx; }
                repaint();
            };
            return c;
        };

        const repaint = () => {
            buckets.innerHTML = '';
            ex.buckets.forEach((b, bi) => {
                const box = el('div', 'lx-bucket');
                box.innerHTML = '<div class="lx-bucket-title">' + esc(b) + '</div>';
                const holder = el('div', 'lx-bucket-items');
                items.filter(it => placed[it.text] === bi).forEach(it => holder.appendChild(mkChip(it)));
                box.appendChild(holder);
                box.ondragover = e => { e.preventDefault(); box.classList.add('over'); };
                box.ondragleave = () => box.classList.remove('over');
                box.ondrop = e => {
                    e.preventDefault(); box.classList.remove('over');
                    const t = e.dataTransfer.getData('text/plain');
                    if (t) { placed[t] = bi; repaint(); }
                };
                buckets.appendChild(box);
            });
            pool.innerHTML = '';
            const left = items.filter(it => placed[it.text] == null);
            if (!left.length) pool.appendChild(el('span', 'lx-bucket-title', 'All sorted'));
            left.forEach(it => pool.appendChild(mkChip(it)));
            this.answer = placed;
            this.ready(left.length === 0);
        };

        pool.ondragover = e => e.preventDefault();
        pool.ondrop = e => {
            e.preventDefault();
            const t = e.dataTransfer.getData('text/plain');
            if (t) { delete placed[t]; repaint(); }
        };

        body.appendChild(buckets);
        body.appendChild(pool);
        body.appendChild(el('p', 'lx-subprompt', 'Drag each one into a box — or tap it to move it along.'));
        repaint();
    };

    Engine.prototype.build_slider = function (ex, body) {
        const w = el('div', 'lx-slider-wrap');
        const val = el('div', 'lx-slider-val');
        const input = el('input', 'lx-slider');
        input.type = 'range';
        input.min = ex.min; input.max = ex.max; input.step = ex.step || 1;
        input.value = ex.start != null ? ex.start : Math.round((ex.min + ex.max) / 2);

        const fmt = v => (ex.prefix || '') + Number(v).toLocaleString() + (ex.suffix || '');
        const paint = () => {
            val.textContent = fmt(input.value);
            const pct = ((input.value - ex.min) / (ex.max - ex.min)) * 100;
            input.style.background =
                'linear-gradient(90deg, #5CB88A 0%, #5CB88A ' + pct + '%, rgba(255,255,255,0.09) ' + pct + '%)';
            this.answer = Number(input.value);
            this.ready(true);
        };
        input.oninput = paint;

        const scale = el('div', 'lx-slider-scale',
            '<span>' + fmt(ex.min) + '</span><span>' + fmt(ex.max) + '</span>');

        w.appendChild(val); w.appendChild(input); w.appendChild(scale);
        body.appendChild(w);
        paint();
    };

    Engine.prototype.build_chart = function (ex, body) {
        const box = el('div', 'lx-chart');
        box.innerHTML = this.drawChart(ex.chart);
        if (ex.chart.caption) box.appendChild(el('div', 'lx-chart-cap', esc(ex.chart.caption)));
        body.appendChild(box);
        this.build_choice(ex, body);
    };

    // A tiny chart renderer so lessons can pose "read this" questions
    // without shipping a charting library.
    Engine.prototype.drawChart = function (c) {
        const W = 560, H = 190, P = 16;
        const series = c.series || [];
        const all = series.flat();
        const min = Math.min.apply(null, all), max = Math.max.apply(null, all);
        const rng = (max - min) || 1;
        const x = (i, n) => P + (i / Math.max(1, n - 1)) * (W - P * 2);
        const y = v => H - P - ((v - min) / rng) * (H - P * 2);

        let out = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">';
        // gridlines
        for (let g = 0; g <= 3; g++) {
            const gy = P + (g / 3) * (H - P * 2);
            out += '<line x1="' + P + '" y1="' + gy + '" x2="' + (W - P) + '" y2="' + gy +
                   '" stroke="rgba(236,226,214,0.07)" stroke-width="1"/>';
        }
        const palette = ['#5CB88A', '#E0A24C', '#9DB8D2', '#A98BD0'];
        series.forEach((s, si) => {
            const pts = s.map((v, i) => x(i, s.length).toFixed(1) + ',' + y(v).toFixed(1)).join(' ');
            out += '<polyline points="' + pts + '" fill="none" stroke="' + palette[si % 4] +
                   '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
        });
        if (c.marker != null && series[0]) {
            const s = series[0], i = c.marker;
            out += '<circle cx="' + x(i, s.length) + '" cy="' + y(s[i]) + '" r="6" fill="#F4EEE6"/>';
        }
        out += '</svg>';
        return out;
    };

    /* ── grading ──────────────────────────────────────────── */
    Engine.prototype.check = function () {
        if (this.checked) return;
        const ex = this.current;
        let ok = false, why = ex.why || '';

        switch (ex.type) {
            case 'choice':
            case 'truefalse':
            case 'judge':
            case 'chart':
                ok = !!(this.answer && this.answer.correct);
                why = (this.answer && this.answer.why) || (ok ? (ex.why || '') : (ex.whyWrong || ex.why || ''));
                this.paintChoices(ok);
                break;
            case 'order':
                ok = (this.answer || []).every((it, i) => it.correct === i);
                why = ok ? (ex.why || '') : (ex.whyWrong || 'Not the right sequence yet.');
                break;
            case 'build':
                ok = (this.answer || []).join(' ').toLowerCase().trim() ===
                     ex.answer.join(' ').toLowerCase().trim();
                why = ok ? (ex.why || '') : (ex.whyWrong || 'The right sentence is: “' + ex.answer.join(' ') + '”.');
                break;
            case 'fill':
                ok = String(this.answer || '').toLowerCase() === String(ex.answer).toLowerCase();
                why = ok ? (ex.why || '') : (ex.whyWrong || 'It should read “' + ex.answer + '”.');
                break;
            case 'sort':
                ok = ex.items.every(it => ex.buckets[this.answer[it.text]] === it.bucket);
                why = ok ? (ex.why || '') : (ex.whyWrong || 'Some of those are in the wrong box.');
                break;
            case 'slider': {
                const tol = ex.tolerance != null ? ex.tolerance : 0;
                ok = Math.abs(Number(this.answer) - Number(ex.answer)) <= tol;
                why = ok ? (ex.why || '')
                         : (ex.whyWrong || 'The answer was ' + (ex.prefix || '') + ex.answer + (ex.suffix || '') + '.');
                break;
            }
            default:
                ok = false;
        }
        this.grade(ok, why);
    };

    Engine.prototype.paintChoices = function (ok) {
        if (!this._choiceWrap) return;
        this._choiceWrap.querySelectorAll('.lx-choice').forEach(c => c.classList.add('locked'));
        const picked = this._choiceWrap.querySelector('.lx-choice.picked');
        if (picked) picked.classList.add(ok ? 'right' : 'wrong');
    };

    Engine.prototype.grade = function (ok, why) {
        this.checked = true;
        this.attempts++;
        clearTimeout(this.idleTimer);
        if (this.checkBtn) this.checkBtn.disabled = true;

        const juice = J();
        // fire effects from wherever the answer physically is, so the
        // burst comes out of the thing the player just touched
        const anchor = this.stage.querySelector('.lx-choice.picked, .lx-choice.right, .lx-choice.wrong')
                    || this.stage.querySelector('.lx-body') || this.stage;
        const pt = juice ? juice.centreOf(anchor) : { x: 0, y: 0 };

        if (ok) {
            if (!this.current._retry) this.rightFirstTry++;
            this.done++;
            this.combo++;
            this.bestCombo = Math.max(this.bestCombo, this.combo);

            // XP scales with the combo, so a clean run is worth chasing
            const base = this.current.xp || 10;
            const mult = Math.min(3, 1 + (this.combo - 1) * 0.25);
            const gain = Math.round(base * mult);
            this.state.xp += gain;

            // in practice mode a correct answer retires the mistake it came from
            if (this.lesson.practice && this.current._mistakeRef && global.FTProgress) {
                global.FTProgress.clearMistake(
                    this.current._mistakeRef.lesson, this.current._mistakeRef.prompt);
            }

            if (juice) {
                juice.sfx.correct();
                if (this.combo >= 3) juice.sfx.combo(this.combo);
                juice.ring(pt.x, pt.y, '#5CB88A');
                juice.burst(pt.x, pt.y, { count: this.combo >= 5 ? 22 : 14, spread: 100 });
                juice.floatText(pt.x, pt.y - 20, '+' + gain + ' XP', { color: '#5CB88A' });
                if (this.combo >= 3) {
                    juice.floatText(innerWidth / 2, innerHeight * 0.3,
                        'COMBO ×' + this.combo, { color: '#E0A24C', size: 1.15, duration: 1050 });
                }
            } else {
                this.popXp(gain);
            }
            if (this.bull) this.bull.react('correct', { streak: this.combo });

        } else {
            // first-try misses go to the mistakes bank so the academy can
            // offer a practice round built from exactly what you got wrong
            if (!this.current._retry && !this.lesson.practice && global.FTProgress) {
                global.FTProgress.recordMistake(this.lesson.id, this.current.prompt);
            }
            this.combo = 0;
            this.state.hearts = Math.max(0, this.state.hearts - 1);
            const h = this.heartNodes && this.heartNodes[this.state.hearts];
            if (h) { h.classList.add('pulse'); setTimeout(() => h.classList.remove('pulse'), 500); }
            this.paintHearts();

            if (juice) {
                juice.sfx.wrong();
                juice.sfx.heart();
                juice.shake(7);
            }
            if (this.bull) this.bull.react('wrong', { hearts: this.state.hearts });

            // send it to the back of the queue — the lesson isn't done
            // until everything has been answered right at least once
            const again = Object.assign({}, this.current, { _retry: true });
            this.queue.push(again);
        }
        this.persist();
        if (this.bull) this.bull.lift(true);

        this.fb.classList.add('show', ok ? 'ok' : 'no');
        this.fb.querySelector('.lx-fb-icon').textContent = ok ? '✓' : '✕';
        this.fb.querySelector('.lx-fb-title').textContent = ok
            ? pick(['Nice.', 'Correct.', 'That\'s it.', 'Exactly.', 'Got it.'])
            : 'Not quite';
        this.fb.querySelector('.lx-fb-why').innerHTML = why ? esc(why) : '';
        this.fb.querySelector('.lx-fb-btn').textContent =
            this.queue.length ? 'Continue' : 'Finish';
        this.paintProgress();
    };

    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

    Engine.prototype.popXp = function (n) {
        const p = el('div', 'lx-xp-pop', '+' + n + ' XP');
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1150);
    };

    Engine.prototype.advance = function () {
        if (this.bull) this.bull.lift(false);
        if (J()) J().sfx.tap();
        if (this.state.hearts <= 0) { this.cleanup(); this.renderNoHearts(); return; }
        this.next();
        this.armIdleNudge();
    };

    /* ── endings ──────────────────────────────────────────── */
    Engine.prototype.complete = function () {
        const secs = Math.round((Date.now() - this.startedAt) / 1000);
        const acc = this.attempts ? Math.round((this.rightFirstTry / this.total) * 100) : 0;

        const s = touchStreak(this.state);
        // practice rounds don't earn crowns or gems — they clear mistakes,
        // and the XP from each answer is reward enough
        if (!this.lesson.practice) {
            const rec = s.lessons[this.lesson.id] || { crowns: 0, best: 0 };
            rec.crowns = Math.min(3, (rec.crowns || 0) + 1);
            rec.best = Math.max(rec.best || 0, acc);
            rec.combo = Math.max(rec.combo || 0, this.bestCombo);
            rec.done = true;
            s.lessons[this.lesson.id] = rec;
            s.gems = (s.gems || 0) + 5;
        }
        this.persist();

        const earned = this.state.xp - this.xpAtStart;

        // progression hooks: daily goal, then achievements
        let dailyMet = false;
        let newBadges = [];
        if (global.FTProgress) {
            const d = global.FTProgress.addDailyXp(earned);
            dailyMet = d.justMet;
            newBadges = global.FTProgress.checkBadges();
        }

        // keep the bull for the celebration, so cleanup can't take him
        const bull = this.bull;
        this.bull = null;
        this.cleanup();

        this.mount.innerHTML = '';
        const art = global.FTArt ? global.FTArt.get(acc === 100 ? 'trophy' : 'check') : '';
        const box = el('div', 'lx-complete');
        box.innerHTML =
            '<div class="lx-complete-art">' + art + '</div>' +
            '<h2 class="lx-display">' + (acc === 100 ? 'Flawless' : 'Lesson complete') + '</h2>' +
            '<p class="lx-sub">' + esc(this.lesson.title) + '</p>' +
            '<div class="lx-stats">' +
              '<div class="lx-stat xp"><b>+' + earned + '</b><span>XP</span></div>' +
              '<div class="lx-stat acc"><b>' + acc + '%</b><span>Accuracy</span></div>' +
              '<div class="lx-stat time"><b>' + fmtTime(secs) + '</b><span>Time</span></div>' +
            '</div>' +
            (this.bestCombo >= 3
                ? '<p class="lx-sub" style="margin-top:-1rem">Best combo ×' + this.bestCombo + '</p>' : '');
        const cont = el('button', 'lx-btn primary wide', 'Continue');
        cont.onclick = () => { if (bull) bull.destroy(); this.onExit(); };
        box.appendChild(cont);
        this.mount.appendChild(box);

        const juice = J();
        if (juice) {
            juice.sfx.complete();
            juice.confetti({ count: acc === 100 ? 110 : 70 });
            if (acc === 100) setTimeout(() => juice.sfx.levelUp(), 620);
            if (dailyMet) setTimeout(() => {
                juice.floatText(innerWidth / 2, innerHeight * 0.22, 'DAILY GOAL MET',
                    { color: '#E0A24C', size: 1.3, duration: 1600 });
                juice.sfx.levelUp();
            }, 900);
        }
        if (bull) {
            bull.lift(false);
            bull.react('complete', { perfect: acc === 100 });
        }
        this.toastBadges(newBadges);
    };

    function fmtTime(s) {
        const m = Math.floor(s / 60), r = s % 60;
        return m ? (m + ':' + String(r).padStart(2, '0')) : (r + 's');
    }

    Engine.prototype.renderNoHearts = function () {
        this.mount.innerHTML = '';
        const s = syncHearts(load());
        const waitMs = Math.max(0, HEART_REFILL_MS - (Date.now() - (s.heartsAt || Date.now())));
        const mins = Math.ceil(waitMs / 60000);
        const box = el('div', 'lx-nohearts');
        box.innerHTML =
            (global.FTArt ? global.FTArt.get('brokenheart') : '') +
            '<h2 class="lx-display">Out of hearts</h2>' +
            '<p>You get one back every 25 minutes — next one in about ' + mins + ' minute' + (mins === 1 ? '' : 's') +
            '. Or go practise on the trading floor, where nothing is at stake.</p>';
        const a = el('a', 'lx-btn primary wide', 'Back to the path');
        a.href = 'academy.html';
        const b = el('a', 'lx-btn ghost wide', 'Practice trading instead');
        b.href = 'practice.html'; b.style.marginTop = '0.7rem';
        box.appendChild(a); box.appendChild(b);
        this.mount.appendChild(box);
    };

    /* ── public surface ───────────────────────────────────── */
    global.FTLesson = {
        Engine,
        load, save, syncHearts, touchStreak, dayKey,
        MAX_HEARTS, HEART_REFILL_MS, STORE,
        reset() { try { localStorage.removeItem(STORE); } catch (e) {} },
    };
})(typeof window !== 'undefined' ? window : this);
