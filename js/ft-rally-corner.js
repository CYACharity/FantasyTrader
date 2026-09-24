/* ============================================================
 *  RALLY, IN THE CORNER.
 *
 *  Drop-in for the pages that have no obvious place to put him:
 *
 *      <script src="js/ft-rally-corner.js"></script>
 *
 *  Mounts a small fixed Rally bottom-right with the chat panel
 *  behind him, and gets out of the way of everything else — he
 *  is position:fixed, so no host layout moves.
 *
 *  He is silent here. On a page built around something else, a
 *  mascot volunteering facts every twenty seconds is noise; he
 *  waits to be asked. Pages that want him talking (practice,
 *  trading) mount FTRallyWidget themselves instead.
 * ============================================================ */
(function (global) {
    'use strict';
    if (global.__ftRallyCorner) return;          // never twice on one page
    global.__ftRallyCorner = true;

    const HIDE = 'ftRallyCornerHidden';

    function boot() {
        // never double up with a page that already places him
        if (document.querySelector('.pf-hero-bull, .rally-panel, .pf-rally, .ft-rally')) return;
        if (!global.FTBull || !global.FTRallyWidget) return;
        try { if (localStorage.getItem(HIDE) === '1') return; } catch (e) {}

        const host = document.createElement('div');
        host.className = 'rc-corner';
        document.body.appendChild(host);
        // rc-corner-click: the disc is the button
        host.setAttribute('title', 'Ask Rally');
        host.addEventListener('click', e => {
            if (e.target.closest && e.target.closest('.bull-holder')) return;   // the bull already opens it
            if (global.FTRallyChat) FTRallyChat.open();
        });

        FTRallyWidget.mount({
            el: host,
            greet: false,
            chatter: false,
            context: function () {
                /* Whatever this page's own store knows. Every field is
                   optional and the chat copes with all of them missing. */
                let d = {};
                try { d = JSON.parse(localStorage.getItem('portfolioData') || '{}'); } catch (e) {}
                const held = [].concat.apply([], Object.values(d.stocks || {}));
                const cash = Number(d.cash);
                return {
                    start: 10000,
                    cash: isFinite(cash) ? cash : null,
                    positions: held.length,
                    symbols: held.map(function (h) { return h.symbol; }),
                };
            },
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else { boot(); }
})(typeof window !== 'undefined' ? window : this);
