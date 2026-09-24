/* ============================================================
 *  LEVEL SELECT — rebuilds a course path page's module cards as
 *  game stages. Reads what the page already lists (titles, the
 *  four topics, which module each card opens) and paints real
 *  progress over it: lesson progress from the account, stars and
 *  XP from the quiz runs banked in ftGamify.
 * ============================================================ */
(function () {
    'use strict';
    const grids = document.querySelectorAll('.modules-grid');
    if (!grids.length) return;
    document.body.classList.add('ftl');

    const STAR = '<svg viewBox="0 0 24 24"><path class="CLS" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>';
    const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    // the accent: the first band's colour
    const firstLevel = document.querySelector('.level');
    if (firstLevel) {
        const acc = getComputedStyle(firstLevel).getPropertyValue('--primary').trim();
        if (acc) document.body.style.setProperty('--acc', acc);
    }
    const h1 = document.querySelector('.wrap h1');
    if (h1) h1.classList.add('ft-screen-title');

    // read the page's own cards once
    const bands = [...grids].map(grid => ({
        grid,
        level: grid.closest('.level'),
        stages: [...grid.querySelectorAll('.module-card')].map(card => ({
            id: card.dataset.module,
            href: (card.getAttribute('onclick') || '').replace(/^.*href='([^']+)'.*$/, '$1') || (card.dataset.module + '.html'),
            num: (card.querySelector('.module-number') || {}).textContent || '',
            title: (card.querySelector('.module-title') || {}).textContent || '',
            topics: [...card.querySelectorAll('.module-features li')].map(li => li.textContent.trim()),
            bonus: card.classList.contains('gold'),
        })),
    }));
    const all = bands.flatMap(b => b.stages);

    let sum = null;
    if (h1) {
        sum = document.createElement('div');
        sum.className = 'ftl-sum';
        h1.insertAdjacentElement('afterend', sum);
    }

    function paint(progress) {
        let game = {};
        try { game = JSON.parse(localStorage.getItem('ftGamify') || '{}'); } catch (e) {}
        const info = s => {
            const rec = progress[s.id] || {}, g = game[s.id] || {};
            const done = !!rec.completed;
            const pct = done ? 100 : Math.max(0, Math.min(99, Math.round(Number(rec.progress) || 0)));
            const score = g.total ? g.correct / g.total : 0;
            const stars = !g.total ? (done ? 1 : 0) : score >= 0.9 ? 3 : score >= 0.7 ? 2 : score > 0 ? 1 : 0;
            return { done, pct, stars, xp: Number(g.xp) || 0 };
        };
        const byId = {}; all.forEach(s => { byId[s.id] = info(s); });
        const nextId = (all.find(s => !byId[s.id].done) || {}).id;

        bands.forEach(band => {
            band.grid.classList.add('ftl-grid');
            if (band.level) {
                const c = getComputedStyle(band.level).getPropertyValue('--primary').trim();
                if (c) band.level.style.setProperty('--acc', c);
            }
            band.grid.innerHTML = '';
            band.stages.forEach((s, i) => {
                const st = byId[s.id];
                const cls = st.done ? 'cleared' : s.id === nextId ? 'next' : st.pct > 0 ? 'started' : '';
                const a = document.createElement('a');
                a.className = 'ftl-card ' + cls + (s.bonus ? ' bonus' : '');
                a.href = s.href;
                a.style.setProperty('--i', i);
                const state = st.done ? '<span class="ftl-state done">Cleared</span>'
                    : s.id === nextId ? '<span class="ftl-state next">' + (st.pct ? 'Continue' : 'Next up') + '</span>'
                    : st.pct ? '<span class="ftl-state prog">' + st.pct + '%</span>' : '';
                const lit = st.done ? 4 : Math.floor(st.pct / 25);
                a.innerHTML =
                    '<span class="ftl-num">' + esc(String(s.num).padStart(2, '0')) + '</span>' +
                    '<div class="ftl-top"><span class="ftl-tag">' + (s.bonus ? 'Bonus stage' : 'Stage ' + esc(s.num)) + '</span>' + state + '</div>' +
                    '<h3 class="ftl-title">' + esc(s.title) + '</h3>' +
                    '<ul class="ftl-obj">' + s.topics.map((t, k) => '<li class="' + (k < lit ? 'lit' : '') + '">' + esc(t) + '</li>').join('') + '</ul>' +
                    '<div class="ftl-foot">' +
                        '<span class="ftl-stars" title="Best quiz run">' + [0, 1, 2].map(k => STAR.replace('CLS', k < st.stars ? 'on' : 'off')).join('') + '</span>' +
                        (st.xp ? '<span class="ftl-xp"><b>' + st.xp + '</b> XP</span>' : '') +
                        '<span class="ftl-play"><span>' + (st.done ? 'Replay' : st.pct ? 'Continue' : 'Play') + '</span></span>' +
                    '</div>' +
                    (st.pct && !st.done ? '<i class="ftl-bar" style="width:' + st.pct + '%"></i>' : '');
                band.grid.appendChild(a);
            });
            const t = band.level && band.level.querySelector('.level-title');
            if (t) {
                const n = band.stages.filter(s => byId[s.id].done).length;
                t.innerHTML = esc(t.textContent.replace(/\s*\d+\s*\/\s*\d+.*$/, '')) + '<small>' + n + ' / ' + band.stages.length + ' cleared</small>';
            }
        });

        if (sum) {
            const cleared = all.filter(s => byId[s.id].done).length;
            const stars = all.reduce((a, s) => a + byId[s.id].stars, 0);
            const xp = all.reduce((a, s) => a + byId[s.id].xp, 0);
            sum.innerHTML =
                '<span class="ftl-sum-count"><b>' + cleared + '</b> / ' + all.length + ' stages cleared</span>' +
                (all.length <= 8 ? '<span class="ftl-segs">' + all.map(s => {
                    const st = byId[s.id];
                    return st.done ? '<i class="on"></i>' : st.pct ? '<i class="part" style="--p:' + st.pct + '%"></i>' : '<i></i>';
                }).join('') + '</span>' : '') +
                '<span class="ftl-chip">' + STAR.replace('CLS', 'on').replace('<svg', '<svg style="fill:#F0B865"') + '<span>' + stars + ' / ' + all.length * 3 + '</span></span>' +
                '<span class="ftl-chip"><span>' + xp + ' XP banked</span></span>';
        }
    }

    paint({});
    (async function () {
        for (let i = 0; i < 30 && !(window.SL && SL.getLessonProgress); i++) await new Promise(r => setTimeout(r, 100));
        try { if (window.SL && SL.getLessonProgress) paint(await SL.getLessonProgress() || {}); } catch (e) {}
    })();
})();
