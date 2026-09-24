/* ============================================================
 *  RALLY WIDGET — one line to put him on a page.
 *
 *      FTRallyWidget.mount({
 *          el: document.getElementById('rallySlot'),
 *          launcher: true,
 *          context: () => ({ cash, total, pnl, positions, symbols }),
 *          observe: () => Promise<{ symbol, change_pct } | null>,   // optional
 *      });
 *
 *  `observe` lets a page hand him one thing worth noticing about the
 *  user's own holdings — today's biggest mover. If it resolves to a
 *  move of 2% or more he opens with that instead of a fact. The page
 *  is responsible for only passing a fresh quote: he says "today",
 *  so a stale price must come back as null.
 *
 *  Handles the parts every page repeats: build the bull, make him
 *  and the button open the chat, keep him talking occasionally
 *  without talking over himself, and hand the chat panel whatever
 *  the page knows about the account.
 *
 *  It does NOT own his size. The page's stylesheet does — the
 *  controller writes width/height inline for an undocked bull and
 *  an inline style beats a stylesheet, so this clears them.
 *
 *  The dashboard does not use this: he walks along a headline
 *  there, which shares none of this behaviour.
 * ============================================================ */
(function (global) {
    'use strict';

    /* The house facts. Written to be said out loud, not printed under
       a heading — he is the one delivering them. */
    const FACTS = [
        "About 95% of day traders lose money over time. That's not a warning, it's the base rate.",
        "Only about 1 in 3 adults can pass a basic financial literacy test. That's a low bar.",
        "Miss the ten best market days in twenty years and you halve your return.",
        "The S&P 500 has never lost money over any twenty-year stretch. Not once.",
        "The average investor does worse than the funds they own. Buying high, selling low.",
        "Nearly 60% of Americans couldn't cover a surprise $1,000 bill.",
        "A dollar in the S&P in 1980 is over $100 now. That's compounding, not picking.",
        "Over fifteen years, about 90% of professional managers fail to beat the index.",
        "A 2x levered position is wiped out by a 50% drop. Leverage cuts both ways.",
        "People who check daily trade more and earn less than people who check monthly.",
        "Inflation at 3% halves what your money buys in about 24 years.",
        "Some of the best accounts on record belonged to people who forgot they had them.",
    ];

    const NUDGES = [
        "Stuck on a word? Ask me.",
        "I'll explain anything on this page. Just ask.",
        "Ask me how you're doing and I'll actually tell you.",
    ];

    function shuffled(a) {
        const out = a.slice();
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    }
    const pick = a => a[Math.floor(Math.random() * a.length)];

    const LAUNCHER =
        '<span class="dot"></span>Chat with Rally';

    function mount(opts) {
        opts = opts || {};
        const host = opts.el;
        if (!host || !global.FTBull) return null;

        const bull = FTBull.create({ dock: false, facing: opts.facing || 'left' });
        const stage = document.createElement('div');
        host.appendChild(stage);
        bull.mount(stage);

        // let the page's CSS own his size (see the header note)
        bull.rig.style.width = '';
        bull.rig.style.height = '';

        /* ── the chat ─────────────────────────────────────────── */
        if (global.FTRallyChat) {
            FTRallyChat.init({ context: opts.context || (() => ({})) });
        }
        const open = () => {
            if (global.FTJuice) FTJuice.sfx.tap();
            if (global.FTRallyChat) FTRallyChat.open();
        };

        // he is the obvious thing to click on a page with a bull on it
        const holder = stage.querySelector('.bull-holder');
        if (holder) {
            holder.setAttribute('role', 'button');
            holder.setAttribute('tabindex', '0');
            holder.setAttribute('aria-label', 'Chat with Rally');
            holder.addEventListener('click', open);
            holder.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
        }

        let launcher = null;
        if (opts.launcher !== false) {
            launcher = document.createElement('button');
            launcher.type = 'button';
            launcher.className = 'rc-launch';
            launcher.innerHTML = LAUNCHER;
            launcher.addEventListener('click', open);
            host.appendChild(launcher);
        }

        /* ── ambient talk ─────────────────────────────────────────
           One scheduler owns the bubble. It stays quiet while the
           chat is open, while he is already mid-sentence, and for a
           few seconds after the user does anything — otherwise a
           fact lands on top of whatever they just triggered. */
        let lastPoke = 0;
        ['pointerdown', 'keydown'].forEach(ev =>
            addEventListener(ev, () => { lastPoke = performance.now(); }, { passive: true }));

        bull.poke = () => { lastPoke = performance.now(); };

        const GREET_MS = 3400;
        let greetedAt = 0;
        if (opts.greet !== false) {
            bull.setState('walk');
            setTimeout(() => {
                bull.setState('wave');
                greetedAt = performance.now();
                bull.say(pick(opts.greet || ["Ask me anything on this page."]), { ms: GREET_MS });
            }, 900);
        }

        /* ── one observation ──────────────────────────────────────
           If the page can tell him what moved, he says it once, ~2.2s
           after the hello has cleared so he doesn't talk over himself,
           and the fact rotation waits its turn. */
        if (typeof opts.observe === 'function') {
            Promise.resolve().then(() => opts.observe()).then(top => {
                if (!top || top.change_pct == null || !top.symbol) return;
                const pct = Number(top.change_pct);
                if (!isFinite(pct) || Math.abs(pct) < 2) return;
                const notBefore = (greetedAt || performance.now()) + (opts.greet !== false ? GREET_MS : 0) + 2200;
                setTimeout(() => {
                    bull.setState(pct >= 0 ? 'happy' : 'worry');
                    bull.say(top.symbol + ' is ' + (pct >= 0 ? 'up ' : 'down ') + Math.abs(pct).toFixed(1) +
                             '% today and you own it.', { tone: pct >= 0 ? 'ok' : 'no', ms: 4200 });
                    lastPoke = performance.now();
                }, Math.max(0, notBefore - performance.now()));
            }).catch(() => { /* nothing to notice; the facts carry on */ });
        }

        if (opts.chatter !== false) {
            let queue = shuffled(opts.facts || FACTS), at = 0, turn = 0;
            const speak = () => {
                if (global.FTRallyChat && FTRallyChat.isOpen()) return;
                if (bull.bubble.classList.contains('show')) return;
                if (performance.now() - lastPoke < 5000) return;
                if (++turn % 5 === 0) {
                    bull.setState('happy');
                    bull.say(pick(NUDGES), { ms: 4000 });
                    return;
                }
                if (at >= queue.length) { queue = shuffled(opts.facts || FACTS); at = 0; }
                bull.setState('think', 2200);
                bull.say(queue[at++], { ms: 7500 });
            };
            setTimeout(speak, opts.firstDelay || 11000);
            setInterval(speak, opts.every || 19000);
        }

        /* ── where the bubble goes ────────────────────────────────
           Anchored in the page, his bubble opened over whatever happened
           to be beside him: the rail's panel heading on the terminal, the
           article on a module page. It is moved to <body> as a fixed box
           and placed here instead.

           The rules, in order: take the side of him with more room, stay
           inside the window, and if the box would sit on a heading, slide
           it up or down until it doesn't. Nothing in the page can clip it
           and nothing in the page moves because of it.

           A page that already places it itself (the portfolio does) keeps
           its own placer — this stands down. */
        if (opts.freeBubble !== false && !global.pfPlaceBubble) {
            placeBubbleFreely(stage, bull, opts.bubbleSide);
        }

        bull.launcher = launcher;
        return bull;
    }


    /* Headings and panel titles are the things it must not cover: they are
       what tells you where you are. Body text can take a bubble over it for
       a few seconds; a title cannot. */
    const PROTECT = '.rally-panel-head, .portfolio-title, .metrics-title, .movers-title, ' +
                    '.research-title, .trading-title, .article-title, .section-title, h1, h2';
    const GAP = 12, EDGE = 10;

    function placeBubbleFreely(stage, bull, side) {
        const doc = document;
        let bubble = null, home = null;

        function adopt() {
            const b = (bubble && bubble.isConnected) ? bubble : stage.querySelector('.bull-bubble');
            if (!b) return null;
            if (b !== bubble) { bubble = b; home = b.parentElement; }
            if (b.parentElement !== doc.body) doc.body.appendChild(b);
            // inline, because the bull rewrites the element's className when he speaks
            b.style.position = 'fixed';
            b.style.right = 'auto';
            b.style.maxWidth = '250px';
            b.style.width = '250px';
            b.style.transform = 'none';
            b.style.zIndex = '130';
            return b;
        }

        function hits(x, y, w, h) {
            const list = doc.querySelectorAll(PROTECT);
            for (let i = 0; i < list.length; i++) {
                const r = list[i].getBoundingClientRect();
                if (r.width < 4 || r.height < 4) continue;
                if (r.bottom < 0 || r.top > innerHeight) continue;
                if (x < r.right && x + w > r.left && y < r.bottom && y + h > r.top) return true;
            }
            return false;
        }

        function place() {
            const b = adopt();
            const rig = stage.querySelector('.bull-rig') || stage.querySelector('.bull-holder');
            if (!b || !rig) return;
            const r = rig.getBoundingClientRect();
            const w = b.offsetWidth, h = b.offsetHeight;
            if (!w || !h) return;

            // a page can ask for it under him, when both sides of him are
            // numbers you are reading (the trade screen's portfolio card)
            if (side === 'below') {
                b.style.left = Math.round(Math.max(EDGE, Math.min(r.right - w, innerWidth - w - EDGE))) + 'px';
                b.style.top = Math.round(Math.max(EDGE, Math.min(r.bottom + 4, innerHeight - h - EDGE))) + 'px';
                return;
            }

            // the side of him with more room
            const roomRight = innerWidth - r.right, roomLeft = r.left;
            let x = roomRight >= w + GAP + EDGE || roomRight > roomLeft
                ? r.right + GAP
                : r.left - GAP - w;
            x = Math.max(EDGE, Math.min(x, innerWidth - w - EDGE));

            // centred on him, then nudged off any heading it lands on
            const mid = r.top + r.height / 2 - h / 2;
            const clamp = v => Math.max(EDGE, Math.min(v, innerHeight - h - EDGE));
            let y = clamp(mid);
            if (hits(x, y, w, h)) {
                const tries = [r.bottom + GAP, r.top - GAP - h, mid - h * 0.7, mid + h * 0.7];
                for (let i = 0; i < tries.length; i++) {
                    const t = clamp(tries[i]);
                    if (!hits(x, t, w, h)) { y = t; break; }
                }
            }
            b.style.left = Math.round(x) + 'px';
            b.style.top = Math.round(y) + 'px';
        }

        new MutationObserver(place).observe(stage, {
            childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'],
        });
        addEventListener('resize', place);
        addEventListener('scroll', place, { passive: true });
        setInterval(place, 300);
        place();
        bull.placeBubble = place;
    }

    global.FTRallyWidget = { mount, FACTS, NUDGES };
})(typeof window !== 'undefined' ? window : this);
