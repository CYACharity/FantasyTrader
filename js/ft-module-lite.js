/* ============================================================
 *  MODULE PAGES, simpler.
 *
 *      <script src="js/ft-module-lite.js"></script>   (after ft-gamify.js)
 *
 *  A module used to open under three stacked bars — an XP strip,
 *  a sticky header, and a level pill repeating what the header
 *  said — before a single word of the lesson. Now:
 *
 *    · one bar: back link on the left, XP / streak / checkpoints
 *      on the right, reading progress as a thin line under it
 *    · no repeated level pill
 *    · under the title, "In this module": the sections as a short
 *      list you can jump through, so you see the whole shape of
 *      the lesson before you start and can find your place again
 *
 *  Nothing in the lesson text changes.
 * ============================================================ */
(function () {
    'use strict';
    const doc = document;

    const css = doc.createElement('style');
    css.textContent = `
        body { padding-top: 0 !important; }
        .ftg-hud { top: auto !important; bottom: auto !important; position: fixed !important;
                   left: 0; right: 0; top: 0 !important; height: 3px; background: none !important;
                   border: 0 !important; backdrop-filter: none !important; z-index: 120 !important; }
        .ftg-hud .ftg-hud-row { display: none !important; }
        .ftg-hud .ftg-hud-bar { height: 3px; background: transparent; }
        .mod-header { top: 0 !important; padding: 0.7rem 1.5rem !important; }
        .mod-header-inner { gap: 1rem; }
        .mod-header-meta { display: none !important; }
        .ml-chips { display: flex; align-items: center; gap: 0.4rem; }
        .ml-chips .ftg-chip { margin: 0 !important; }
        .ml-where { font: 700 0.72rem 'Inter', sans-serif; color: rgba(236,226,214,0.45); margin-right: 0.35rem; white-space: nowrap; }
        .article > .module-label { display: none !important; }
        .ml-toc {
            margin: 1.4rem 0 0.4rem; padding: 0.95rem 1.1rem;
            border: 1px solid rgba(236,226,214,0.10); border-radius: 14px;
            background: rgba(255,255,255,0.02);
        }
        .ml-toc-k { display: block; font: 800 0.62rem 'Inter', sans-serif; letter-spacing: 0.14em;
                    text-transform: uppercase; color: rgba(236,226,214,0.45); margin-bottom: 0.55rem; }
        .ml-toc ol { margin: 0; padding: 0; list-style: none; counter-reset: ml; display: grid; gap: 0.15rem; }
        .ml-toc li { counter-increment: ml; }
        .ml-toc a { display: flex; align-items: baseline; gap: 0.6rem; padding: 0.3rem 0.4rem; border-radius: 8px;
                    color: #D9D0C5; text-decoration: none; font: 600 0.92rem 'Inter', sans-serif;
                    transition: background 0.15s ease, color 0.15s ease; }
        .ml-toc a::before { content: counter(ml); flex: 0 0 1.4rem; height: 1.4rem; border-radius: 50%;
                    display: grid; place-items: center; font: 800 0.66rem 'Inter', sans-serif;
                    background: rgba(92,184,138,0.14); color: #7BD3A6; }
        .ml-toc a:hover { background: rgba(255,255,255,0.04); color: #F4EEE6; }
        .ml-toc a.here { color: #F4EEE6; }
        .ml-toc a.here::before { background: #5CB88A; color: #0C1A13; }
        .article h2 { scroll-margin-top: 80px; }
    `;
    doc.head.appendChild(css);

    function run() {
        const inner = doc.querySelector('.mod-header-inner');
        const row = doc.querySelector('.ftg-hud .ftg-hud-row');
        const meta = doc.querySelector('.mod-header-meta');
        if (inner && row) {
            const box = doc.createElement('div');
            box.className = 'ml-chips';
            if (meta) {
                const m = meta.textContent.match(/(\d+)\s+OF\s+(\d+)/i);
                if (m) { const w = doc.createElement('span'); w.className = 'ml-where'; w.textContent = m[1] + ' of ' + m[2]; box.appendChild(w); }
            }
            while (row.firstChild) box.appendChild(row.firstChild);     // moved: the ids stay unique and keep updating
            inner.appendChild(box);
        }

        const article = doc.querySelector('article.article');
        const meta2 = article && article.querySelector('.article-meta');
        if (!article || !meta2) return;
        const heads = [...article.querySelectorAll('h2')].filter(h =>
            !h.closest('.quiz-section, .ftg-checkpoint, .quiz-q, .ftg-summary') && h.textContent.trim());
        if (heads.length < 2) return;
        const toc = doc.createElement('nav');
        toc.className = 'ml-toc';
        toc.setAttribute('aria-label', 'In this module');
        toc.innerHTML = '<span class="ml-toc-k">In this module</span><ol></ol>';
        const ol = toc.querySelector('ol');
        const links = heads.map((h, i) => {
            if (!h.id) h.id = 'sec-' + (i + 1);
            const li = doc.createElement('li');
            const a = doc.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent.trim();
            a.addEventListener('click', e => {
                e.preventDefault();
                const top = h.getBoundingClientRect().top + scrollY - 76;
                const from = scrollY;
                scrollTo({ top, behavior: 'smooth' });
                // some browsers and embedded views ignore smooth scrolling; don't leave the click dead
                setTimeout(() => { if (Math.abs(scrollY - from) < 2 && Math.abs(top - from) > 2) scrollTo(0, top); }, 350);
            });
            li.appendChild(a); ol.appendChild(li);
            return a;
        });
        meta2.insertAdjacentElement('afterend', toc);

        // the section you are in is lit
        const mark = () => {
            let at = 0;
            heads.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * 0.35) at = i; });
            links.forEach((a, i) => a.classList.toggle('here', i === at));
        };
        addEventListener('scroll', mark, { passive: true });
        mark();
    }
    // after ft-gamify has built its HUD and checkpoints
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', () => setTimeout(run, 0));
    else setTimeout(run, 0);
})();
