/* ============================================================
 *  TOURS — Rally shows you around.
 *
 *  The first time you reach the menu you get the full tour; the
 *  first time you open each main screen, a short one for that
 *  screen. Each runs once (remembered on this device). "Tutorial"
 *  on the menu replays everything; "Skip" ends the one you're in,
 *  "Turn off tips" ends them all.
 *
 *  A step whose target isn't on screen (hidden by state, a phone
 *  layout) is skipped rather than pointing at nothing.
 * ============================================================ */
(function () {
    'use strict';
    const OFF = 'ftTourOff', SEEN = 'ftTour:';
    const page = (location.pathname.split('/').pop() || 'index.html').replace(/^_p-/, '');
    const store = {
        get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
        del: k => { try { localStorage.removeItem(k); } catch (e) {} },
    };

    // the sign-up form's "Show me around" box, honoured once
    (function () {
        const pref = store.get('showTutorial');
        if (pref === 'false') store.set(OFF, '1');
        if (pref != null) store.del('showTutorial');
    })();

    const TOURS = {
        'dashboard.html': [
            { title: 'Welcome to Fantasy Trader', text: 'I’m Rally. Four quick things and you’re in.' },
            { sel: '.ow-menu', place: 'right', title: 'The menu', text: 'Play is leagues against friends. Practice is your own $10,000. Learn is courses. Portfolio is your rank.' },
            { sel: '.ow-player', place: 'bottom', title: 'You', text: 'Your avatar. Level up to unlock new characters and frames.' },
            { title: 'Make your first trade', text: 'Pretend money, real prices.',
              actions: [['Go to Practice', 'practice.html'], ['Look around', null]] },
        ],
        'practice.html': [
            { sel: '.pf-race', place: 'bottom', title: 'The race', text: 'First practice account to +50% wins $25.' },
        ],
        'trading.html': [
            { sel: '#symbolSearch', place: 'bottom', title: 'Find a stock', text: 'Search, pick your shares, then Buy or Sell.' },
        ],
        'portfolio.html': [
            { sel: '.pf-rank', place: 'right', title: 'Your rank', text: 'It climbs from Bronze to Legend as your return grows.' },
        ],
        'league.html': [
            { sel: '.lg-choice', place: 'bottom', title: 'Start here', text: 'Host a league and share the code, or join with a friend’s.' },
        ],
        'learn.html': [
            { sel: '.ac-promo', place: 'top', title: 'The Academy', text: 'Short lessons with XP, hearts and boss fights.' },
        ],
        'academy.html': [
            { sel: '.aw-stage', place: 'bottom', title: 'The map', text: 'Clear lessons to move down the road. Beat the boss to open the chest.' },
        ],
        'your-league.html': [
            { sel: '.sidebar-tabs', place: 'right', title: 'Your league', text: 'Team Manager is where you set your lineup and deploy your capital.' },
        ],
    };

    // Tours run once: the first time a new player opens the game. The menu
    // tour starts it; the one-line tips on other screens only appear in that
    // same first session (or right after choosing Tutorial on the menu).
    // Opening a screen for the first time weeks later shows nothing.
    const NEW_KEY = 'ftNewPlayer', SESSION_KEY = 'ftTourSession';
    const isNew = () => Number(store.get(NEW_KEY)) > 0;
    const inFirstSession = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) { return false; } };
    const markSession = () => { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {} };

    const CSS = `
    .ftt-block { position: fixed; inset: 0; z-index: 9990; background: transparent; }
    .ftt-dim { position: fixed; inset: 0; z-index: 9991; background: rgba(8,6,5,0.72); pointer-events: none; transition: opacity 0.25s ease; }
    .ftt-hole { position: fixed; z-index: 9992; border-radius: 14px; pointer-events: none;
        box-shadow: 0 0 0 9999px rgba(8,6,5,0.72), 0 0 0 2px #F0B865, 0 0 30px rgba(240,184,101,0.35);
        transition: left 0.35s cubic-bezier(0.2,0.9,0.3,1), top 0.35s cubic-bezier(0.2,0.9,0.3,1), width 0.35s cubic-bezier(0.2,0.9,0.3,1), height 0.35s cubic-bezier(0.2,0.9,0.3,1); }
    .ftt-card { position: fixed; z-index: 9993; width: min(340px, calc(100vw - 32px)); padding: 16px 18px 14px; border-radius: 16px;
        background: linear-gradient(165deg, #2A241E, #1A1612); border: 1px solid rgba(244,238,230,0.14); border-bottom: 4px solid #2F6B4C;
        box-shadow: 0 24px 60px rgba(0,0,0,0.55); color: #F4EEE6; font-family: 'Inter', system-ui, sans-serif;
        transition: left 0.35s cubic-bezier(0.2,0.9,0.3,1), top 0.35s cubic-bezier(0.2,0.9,0.3,1), opacity 0.2s ease; }
    .ftt-card.center { left: 50% !important; top: 50% !important; transform: translate(-50%, -50%); width: min(420px, calc(100vw - 32px)); text-align: center; }
    .ftt-top { display: flex; align-items: center; gap: 10px; }
    .ftt-card.center .ftt-top { flex-direction: column; }
    .ftt-rally { width: 56px; height: 56px; flex-shrink: 0; }
    .ftt-card.center .ftt-rally { width: 96px; height: 96px; }
    .ftt-rally .bull-rig { width: 100%; height: 100%; }
    .ftt-k { font: 800 0.66rem 'Inter', sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: #F0B865; }
    .ftt-t { margin: 2px 0 0; font: 900 1.55rem/1 'Barlow Condensed', 'Inter', sans-serif; font-style: italic; text-transform: uppercase; }
    .ftt-x { margin: 10px 0 0; font: 500 0.9rem/1.5 'Inter', sans-serif; color: rgba(244,238,230,0.85); }
    .ftt-foot { display: flex; align-items: center; gap: 8px; margin-top: 14px; }
    .ftt-card.center .ftt-foot { justify-content: center; flex-wrap: wrap; }
    .ftt-dots { display: flex; gap: 4px; margin-right: auto; }
    .ftt-card.center .ftt-dots { margin: 0 auto 4px; width: 100%; justify-content: center; }
    .ftt-dots i { width: 14px; height: 4px; transform: skewX(-18deg); background: rgba(244,238,230,0.14); }
    .ftt-dots i.on { background: #F0B865; }
    .ftt-btn { padding: 0.45rem 1rem; transform: skewX(-12deg); cursor: pointer; border: 1px solid rgba(244,238,230,0.2); background: rgba(244,238,230,0.06); color: #F4EEE6; }
    .ftt-btn span { display: inline-block; transform: skewX(12deg); font: 900 1rem 'Barlow Condensed', 'Inter', sans-serif; font-style: italic; text-transform: uppercase; letter-spacing: 0.04em; }
    .ftt-btn.go { background: #5CB88A; border-color: #5CB88A; color: #0E0B09; box-shadow: 0 3px 0 #2F6B4C; }
    .ftt-btn:hover { filter: brightness(1.08); }
    .ftt-skip { display: flex; justify-content: space-between; margin-top: 10px; }
    .ftt-skip button { background: none; border: 0; padding: 0; cursor: pointer; font: 600 0.72rem 'Inter', sans-serif; color: rgba(244,238,230,0.45); }
    .ftt-skip button:hover { color: #F4EEE6; }
    @media (prefers-reduced-motion: reduce) { .ftt-hole, .ftt-card { transition: none; } }
    `;

    let active = null;
    function visible(el) {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return false;
        const cs = getComputedStyle(el);
        return cs.visibility !== 'hidden' && cs.display !== 'none';   // opacity is ignored: a fade-in may still be running
    }

    function run(steps, key, onDone) {
        if (active) active.end(false);
        if (!document.getElementById('fttStyle')) {
            const st = document.createElement('style'); st.id = 'fttStyle'; st.textContent = CSS; document.head.appendChild(st);
        }
        const list = steps.filter(s => !s.sel || visible(document.querySelector(s.sel)));
        if (!list.length) return;
        let i = 0;
        const block = document.createElement('div'); block.className = 'ftt-block';
        const dim = document.createElement('div'); dim.className = 'ftt-dim';
        const hole = document.createElement('div'); hole.className = 'ftt-hole';
        const card = document.createElement('div'); card.className = 'ftt-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-live', 'polite');
        document.body.append(block, dim, hole, card);

        function place() {
            const s = list[i];
            const el = s.sel && document.querySelector(s.sel);
            if (!el) {
                hole.style.opacity = '0'; dim.style.opacity = '1';
                card.classList.add('center'); card.style.left = ''; card.style.top = '';
                return;
            }
            card.classList.remove('center'); dim.style.opacity = '0'; hole.style.opacity = '1';
            const r0 = el.getBoundingClientRect();
            if (r0.top < 0 || r0.bottom > innerHeight) { el.scrollIntoView({ block: 'center' }); }
            const r = el.getBoundingClientRect(), P = 8;
            hole.style.left = (r.left - P) + 'px'; hole.style.top = (r.top - P) + 'px';
            hole.style.width = (r.width + P * 2) + 'px'; hole.style.height = (r.height + P * 2) + 'px';
            const cw = card.offsetWidth, ch = card.offsetHeight, G = 18, E = 12;
            const room = { right: innerWidth - r.right, left: r.left, bottom: innerHeight - r.bottom, top: r.top };
            let side = s.place || 'bottom';
            const fits = sd => sd === 'right' ? room.right > cw + G + E : sd === 'left' ? room.left > cw + G + E : sd === 'bottom' ? room.bottom > ch + G + E : room.top > ch + G + E;
            if (!fits(side)) side = ['bottom', 'top', 'right', 'left'].sort((a, b) => room[b] - room[a])[0];
            let x, y;
            if (side === 'right') { x = r.right + G; y = r.top + r.height / 2 - ch / 2; }
            else if (side === 'left') { x = r.left - G - cw; y = r.top + r.height / 2 - ch / 2; }
            else if (side === 'top') { x = r.left + r.width / 2 - cw / 2; y = r.top - G - ch; }
            else { x = r.left + r.width / 2 - cw / 2; y = r.bottom + G; }
            card.style.left = Math.max(E, Math.min(x, innerWidth - cw - E)) + 'px';
            card.style.top = Math.max(E, Math.min(y, innerHeight - ch - E)) + 'px';
        }

        function paint() {
            const s = list[i], last = i === list.length - 1;
            const rig = window.FTBull ? FTBull.rigSVG() : '';
            const dots = list.length > 1 ? '<span class="ftt-dots">' + list.map((_, k) => '<i class="' + (k <= i ? 'on' : '') + '"></i>').join('') + '</span>' : '';
            const acts = s.actions
                ? s.actions.map((a, k) => '<button class="ftt-btn ' + (k === 0 ? 'go' : '') + '" data-go="' + (a[1] || '') + '"><span>' + a[0] + '</span></button>').join('')
                : (i > 0 ? '<button class="ftt-btn" data-act="back"><span>Back</span></button>' : '') +
                  '<button class="ftt-btn go" data-act="next"><span>' + (last ? 'Got it' : i === 0 && !s.sel ? 'Show me' : 'Next') + '</span></button>';
            card.innerHTML =
                '<div class="ftt-top"><span class="ftt-rally">' + rig + '</span><div><div class="ftt-k">' +
                (list.length > 1 ? 'Step ' + (i + 1) + ' of ' + list.length : 'Tip') + '</div><h3 class="ftt-t"></h3></div></div>' +
                '<p class="ftt-x"></p>' +
                '<div class="ftt-foot">' + dots + acts + '</div>' +
                (last && s.actions ? '' : '<div class="ftt-skip"><button data-act="skip">Skip tour</button><button data-act="off">Turn off tips</button></div>');
            card.querySelector('.ftt-t').textContent = s.title;
            card.querySelector('.ftt-x').textContent = s.text;
            place();
            requestAnimationFrame(place);
            const b = card.querySelector('.ftt-btn.go'); if (b) b.focus({ preventScroll: true });
        }

        function end(completed) {
            store.set(SEEN + key, '1');
            [block, dim, hole, card].forEach(n => n.remove());
            removeEventListener('resize', place); removeEventListener('keydown', keys, true);
            active = null;
            if (onDone) onDone(completed);
        }
        function keys(e) {
            if (e.key === 'Escape') { e.preventDefault(); end(false); }
            else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); next(); }
            else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); i--; paint(); }
        }
        function next() { if (i < list.length - 1) { i++; paint(); } else end(true); }
        card.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.dataset.go !== undefined) { end(true); if (b.dataset.go) location.href = b.dataset.go; return; }
            const a = b.dataset.act;
            if (a === 'next') next();
            else if (a === 'back') { i = Math.max(0, i - 1); paint(); }
            else if (a === 'skip') end(false);
            else if (a === 'off') { store.set(OFF, '1'); end(false); }
        });
        addEventListener('resize', place);
        addEventListener('keydown', keys, true);
        active = { end };
        paint();
    }

    const FTTour = {
        run,
        start(p) { const t = TOURS[p || page]; if (t) run(t, p || page); },
        replayAll() {
            Object.keys(TOURS).forEach(k => store.del(SEEN + k));
            store.del(OFF);
            markSession();                             // tips on the other screens, this session only
            this.start(page);
        },
    };
    window.FTTour = FTTour;

    // first visit: once the page has settled (data loaded, layout done)
    const firstOpen = page === 'dashboard.html' && isNew() && !store.get(SEEN + page);
    if (firstOpen) { markSession(); store.del(NEW_KEY); }       // the one and only first open
    const eligible = firstOpen || (page !== 'dashboard.html' && inFirstSession());
    if (TOURS[page] && eligible && !store.get(OFF) && !store.get(SEEN + page) && !/[?&]notour\b/.test(location.search)) {
        const go = () => setTimeout(() => { FTTour.start(page); }, page === 'dashboard.html' ? 900 : 1400);
        if (document.readyState === 'complete') go(); else addEventListener('load', go);
    }
})();
