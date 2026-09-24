/* ============================================================
 *  FT GAMIFY — turns a module from an essay into a run.
 *
 *  Drop-in. Include it on any module page and it will:
 *    1. Lift the questions out of the quiz block at the bottom and
 *       deal them out as CHECKPOINTS between sections, so you answer
 *       as you read instead of after 1,800 words.
 *    2. Put a sticky HUD on screen: XP, a streak counter, and a bar
 *       that fills with reading progress.
 *    3. Award XP with a combo multiplier for consecutive correct
 *       answers, and bank the total per module in localStorage.
 *    4. Show a run summary at the end — score, best streak, XP earned.
 *
 *  It reads the page's EXISTING markup, so no module content has to be
 *  rewritten and the original checkQuiz() keeps working untouched.
 * ============================================================ */
(function () {
    'use strict';

    const KEY = 'ftGamify';
    const BASE_XP = 20;          // per correct answer
    const STREAK_STEP = 0.5;     // each consecutive correct adds 50%
    const MAX_MULT = 3;

    const moduleId = (location.pathname.split('/').pop() || 'module').replace('.html', '');

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
    }
    function save(state) {
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }
    function totalXp() {
        const s = load();
        return Object.values(s).reduce((a, m) => a + (Number(m && m.xp) || 0), 0);
    }

    // ── run state ────────────────────────────────────────────────
    let xp = 0, streak = 0, bestStreak = 0, correct = 0, answered = 0, totalQ = 0;

    // ── HUD ──────────────────────────────────────────────────────
    function buildHud() {
        const hud = document.createElement('div');
        hud.className = 'ftg-hud';
        hud.innerHTML =
            '<div class="ftg-hud-bar"><i id="ftgBar"></i></div>' +
            '<div class="ftg-hud-row">' +
              '<span class="ftg-chip ftg-xp"><b id="ftgXp">0</b> XP</span>' +
              '<span class="ftg-chip ftg-streak" id="ftgStreakChip"><b id="ftgStreak">0</b>&times; streak</span>' +
              '<span class="ftg-chip ftg-prog"><b id="ftgDone">0</b>/<span id="ftgTotal">0</span></span>' +
            '</div>';
        document.body.appendChild(hud);

        // reading progress drives the bar
        const bar = document.getElementById('ftgBar');
        const onScroll = () => {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            const pct = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0;
            bar.style.width = pct.toFixed(1) + '%';
        };
        addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function paintHud() {
        const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
        set('ftgXp', xp);
        set('ftgStreak', streak);
        set('ftgDone', answered);
        const chip = document.getElementById('ftgStreakChip');
        if (chip) chip.classList.toggle('hot', streak >= 2);
    }

    function floatXp(node, amount, good) {
        const f = document.createElement('span');
        f.className = 'ftg-float ' + (good ? 'good' : 'bad');
        f.textContent = (good ? '+' : '') + amount + (good ? ' XP' : '');
        node.appendChild(f);
        setTimeout(() => f.remove(), 1200);
    }

    // ── deal the questions out through the article ───────────────
    function distribute() {
        const article = document.querySelector('article.article') || document.querySelector('article');
        const quizSection = document.querySelector('.quiz-section');
        if (!article || !quizSection) return false;

        const questions = Array.from(quizSection.querySelectorAll('.quiz-q'));
        totalQ = questions.length;
        if (!totalQ) return false;

        // Anchor points: the h2s that break the article into sections.
        // Skip the first one so nobody gets quizzed before reading anything.
        const heads = Array.from(article.querySelectorAll('h2'))
            .filter(h => !quizSection.contains(h));
        const anchors = heads.slice(1);
        if (!anchors.length) return false;

        // Spread the questions as evenly as the headings allow.
        const step = Math.max(1, Math.floor(anchors.length / totalQ));
        questions.forEach((q, i) => {
            const anchor = anchors[Math.min(anchors.length - 1, i * step)];
            if (!anchor) return;

            const cp = document.createElement('div');
            cp.className = 'ftg-checkpoint';
            cp.innerHTML = '<div class="ftg-cp-head">' +
                '<span class="ftg-cp-tag">Checkpoint ' + (i + 1) + ' of ' + totalQ + '</span>' +
                '<span class="ftg-cp-xp">+' + BASE_XP + ' XP</span></div>';
            anchor.parentNode.insertBefore(cp, anchor);
            cp.appendChild(q);           // move, not copy
            q.classList.add('ftg-live');
        });

        // The old quiz block is now empty of questions — repurpose it.
        quizSection.classList.add('ftg-spent');
        return true;
    }

    // ── scoring, layered on top of the page's own checkQuiz ──────
    function hookScoring() {
        const original = window.checkQuiz;
        if (typeof original !== 'function') return;

        window.checkQuiz = function (num, el, isCorrect) {
            const q = el && el.closest ? el.closest('.quiz-q') : null;
            const fresh = q && !q.dataset.ftgDone;

            original.apply(this, arguments);      // keep the page's own behaviour

            if (!fresh) return;
            q.dataset.ftgDone = '1';
            answered++;

            if (isCorrect) {
                correct++;
                streak++;
                bestStreak = Math.max(bestStreak, streak);
                const mult = Math.min(MAX_MULT, 1 + (streak - 1) * STREAK_STEP);
                const gained = Math.round(BASE_XP * mult);
                xp += gained;
                floatXp(el, gained, true);
                const cp = q.closest('.ftg-checkpoint');
                if (cp) cp.classList.add('cleared');
            } else {
                streak = 0;
                floatXp(el, 'Streak lost', false);
            }

            paintHud();
            bank();
            if (answered === totalQ) setTimeout(summary, 700);
        };
    }

    function bank() {
        const s = load();
        const prev = s[moduleId] || {};
        // keep the best run, never let a re-read reduce banked XP
        s[moduleId] = {
            xp: Math.max(Number(prev.xp) || 0, xp),
            best: Math.max(Number(prev.best) || 0, bestStreak),
            correct: Math.max(Number(prev.correct) || 0, correct),
            total: totalQ,
            at: Date.now(),
        };
        save(s);
    }

    // ── end-of-run summary ───────────────────────────────────────
    function summary() {
        const host = document.querySelector('.quiz-section') || document.querySelector('article');
        if (!host || document.querySelector('.ftg-summary')) return;
        const pct = totalQ ? Math.round((correct / totalQ) * 100) : 0;
        const rank = pct === 100 ? 'Perfect run' : pct >= 75 ? 'Strong' : pct >= 50 ? 'Getting there' : 'Worth a re-read';

        const box = document.createElement('div');
        box.className = 'ftg-summary';
        box.innerHTML =
            '<div class="ftg-sum-rank">' + rank + '</div>' +
            '<div class="ftg-sum-grid">' +
              '<div><b>' + correct + '/' + totalQ + '</b><span>correct</span></div>' +
              '<div><b>' + bestStreak + '&times;</b><span>best streak</span></div>' +
              '<div><b>' + xp + '</b><span>XP earned</span></div>' +
              '<div><b>' + totalXp() + '</b><span>XP total</span></div>' +
            '</div>' +
            '<a class="ftg-sum-next" href="learn.html">Back to the academy</a>';
        host.appendChild(box);
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /* ── Interactive widgets ─────────────────────────────────────
       Self-contained on purpose. Module content varies enormously
       (some have bar charts and flow diagrams, some are pure prose),
       so anything derived from the markup would work on a handful of
       pages and break on the rest. These two teach ideas that are
       true in every module and hook into the same XP/streak system. */

    function award(amount, node, label) {
        xp += amount;
        floatXp(node, amount, true);
        paintHud();
        bank();
    }

    // 1. Predict the move — commit to a direction before the reveal.
    function predictWidget() {
        const w = document.createElement('div');
        w.className = 'ftg-widget';

        // deterministic-ish series so the answer isn't arbitrary noise
        const up = Math.random() > 0.5;
        const pts = [];
        let v = 100;
        for (let i = 0; i < 14; i++) { v += (Math.random() - 0.45) * 3; pts.push(v); }
        const next = v + (up ? 1 : -1) * (2 + Math.random() * 3);

        /* One scale for every point INCLUDING the hidden next close, and one
           x-step for the whole series. Scaling the two lines separately made
           the reveal redraw the entire history on a different scale, so the
           continuation appeared as a second line running across the chart
           instead of carrying on from where the first stopped. */
        const all = pts.concat([next]);
        const min = Math.min(...all), max = Math.max(...all), rng = (max - min) || 1;
        const stepX = 300 / (all.length - 1);
        const X = i => (i * stepX).toFixed(1);
        const Y = n => (70 - ((n - min) / rng) * 60).toFixed(1);
        const basePts = pts.map((n, i) => X(i) + ',' + Y(n)).join(' ');
        // the reveal is only the final segment: last known close -> next close
        const lastI = pts.length - 1;
        const revealPts = X(lastI) + ',' + Y(pts[lastI]) + ' ' + X(lastI + 1) + ',' + Y(next);
        const splitX = X(lastI);

        w.innerHTML =
            '<div class="ftg-w-head"><span class="ftg-w-tag">Read the tape</span>' +
            '<span class="ftg-w-xp">+15 XP</span></div>' +
            '<p class="ftg-w-q">Fourteen sessions of a stock. Where does the next close land?</p>' +
            '<svg class="ftg-w-chart" viewBox="0 0 320 80" preserveAspectRatio="none">' +
              '<polyline points="' + basePts + '" fill="none" stroke="#5CB88A" stroke-width="2"/>' +
              '<line class="ftg-w-split" x1="' + splitX + '" y1="0" x2="' + splitX + '" y2="80"/>' +
              '<polyline class="ftg-w-reveal" points="' + revealPts + '" fill="none" stroke="#E0A24C" stroke-width="2.5"/>' +
            '</svg>' +
            '<div class="ftg-w-btns">' +
              '<button class="ftg-w-btn" data-dir="up">Higher</button>' +
              '<button class="ftg-w-btn" data-dir="down">Lower</button>' +
            '</div>' +
            '<div class="ftg-w-fb"></div>';

        const fb = w.querySelector('.ftg-w-fb');
        w.querySelectorAll('.ftg-w-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (w.dataset.done) return;
                w.dataset.done = '1';
                const right = (btn.dataset.dir === 'up') === up;
                w.classList.add('revealed', right ? 'ok' : 'no');
                w.querySelectorAll('.ftg-w-btn').forEach(b => b.disabled = true);
                if (right) {
                    award(15, btn);
                    fb.textContent = 'Right this time. Now the honest part: over one session that was a coin flip, ' +
                        'and no chart pattern changes those odds. Edge comes from what a business is worth, not from guessing the next tick.';
                } else {
                    fb.textContent = 'Wrong — and that is the lesson. A single session is close to a coin flip. ' +
                        'If short-horizon guessing felt like skill, this is the reminder that it is not.';
                }
                fb.classList.add('show');
            });
        });
        return w;
    }

    // 2. Risk dial — the return/drawdown tradeoff, felt rather than read.
    function riskWidget() {
        const w = document.createElement('div');
        w.className = 'ftg-widget';
        w.innerHTML =
            '<div class="ftg-w-head"><span class="ftg-w-tag">Find your mix</span>' +
            '<span class="ftg-w-xp">+15 XP</span></div>' +
            '<p class="ftg-w-q">Drag the split between stocks and bonds. Watch what you gain — and what it costs you in a bad year.</p>' +
            '<input class="ftg-w-range" type="range" min="0" max="100" value="60" step="5">' +
            '<div class="ftg-w-mix"><b class="ftg-mx-s">60%</b> stocks &nbsp;/&nbsp; <b class="ftg-mx-b">40%</b> bonds</div>' +
            '<div class="ftg-w-stats">' +
              '<div><span>Long-run return</span><b class="ftg-st-r"></b></div>' +
              '<div><span>Worst year</span><b class="ftg-st-d"></b></div>' +
            '</div>' +
            '<div class="ftg-w-fb"></div>';

        const range = w.querySelector('.ftg-w-range');
        const fb = w.querySelector('.ftg-w-fb');
        const paint = () => {
            const s = Number(range.value), b = 100 - s;
            // rough long-run US figures: equities ~10% with ~-37% worst year,
            // investment-grade bonds ~5% with ~-13%. Blended linearly.
            const ret = (s / 100) * 10 + (b / 100) * 5;
            const worst = (s / 100) * -37 + (b / 100) * -13;
            w.querySelector('.ftg-mx-s').textContent = s + '%';
            w.querySelector('.ftg-mx-b').textContent = b + '%';
            w.querySelector('.ftg-st-r').textContent = ret.toFixed(1) + '%';
            w.querySelector('.ftg-st-d').textContent = worst.toFixed(0) + '%';
            w.querySelector('.ftg-st-d').style.color = worst < -25 ? '#D9645C' : worst < -18 ? '#E0A24C' : '#5CB88A';
            range.style.background =
                'linear-gradient(90deg, #5CB88A 0%, #5CB88A ' + s + '%, rgba(255,255,255,0.09) ' + s + '%)';
        };
        range.addEventListener('input', paint);
        range.addEventListener('change', () => {
            if (w.dataset.done) return;
            w.dataset.done = '1';
            award(15, w.querySelector('.ftg-w-mix'));
            fb.textContent = 'There is no correct answer here — only a trade you are willing to live with. ' +
                'More stocks buys return and charges you volatility. The mix you can hold through the worst year is the one that works.';
            fb.classList.add('show');
        });
        paint();
        return w;
    }

    function placeWidgets() {
        const article = document.querySelector('article.article') || document.querySelector('article');
        if (!article) return;
        const heads = Array.from(article.querySelectorAll('h2'))
            .filter(h => !h.closest('.quiz-section'));
        if (heads.length < 3) return;

        // one about a third in, one about three-quarters in
        const spots = [heads[Math.floor(heads.length * 0.34)], heads[Math.floor(heads.length * 0.72)]];
        const widgets = [predictWidget(), riskWidget()];
        spots.forEach((h, i) => {
            if (!h || !widgets[i]) return;
            if (h.previousElementSibling && h.previousElementSibling.classList.contains('ftg-checkpoint')) {
                h.parentNode.insertBefore(widgets[i], h.previousElementSibling);
            } else {
                h.parentNode.insertBefore(widgets[i], h);
            }
        });
    }

    function init() {
        if (!document.querySelector('.quiz-section')) return;   // not a module page
        const ok = distribute();
        if (!ok) return;
        placeWidgets();
        buildHud();
        document.getElementById('ftgTotal').textContent = totalQ;
        hookScoring();
        paintHud();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
