/* ============================================================
 *  REWARDS — trading pays out.
 *
 *  Every trade that goes through earns XP on the same ledger as
 *  the Academy, so it moves your level (and the avatar styles a
 *  level unlocks). Bonuses for a first trade ever, the first
 *  trade of the day, and buying into a sector you didn't hold.
 *  A trading-day streak and trade-count milestones sit on top.
 *
 *      FTRewards.trade({ symbol, side, sector, newSector })
 *
 *  One reward card at a time, top centre, gone in a few seconds:
 *  a new trade replaces the card rather than stacking on it.
 * ============================================================ */
(function (global) {
    'use strict';
    const KEY = 'ftTradeStats';
    const MILESTONES = [1, 5, 10, 25, 50, 100];
    const dk = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } };
    const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };

    function addXp(n) {
        const P = global.FTProgress;
        if (!P) return null;
        const s = P.load(), before = P.levelFromXp(s.xp || 0);
        s.xp = (Number(s.xp) || 0) + n;
        P.save(s);
        try { P.addDailyXp && P.addDailyXp(n); } catch (e) {}
        return { before, after: P.levelFromXp(s.xp) };
    }

    const CSS = `
    .ftr { position: fixed; left: 50%; top: 18px; z-index: 9500; width: min(380px, calc(100vw - 24px)); transform: translate(-50%, calc(-100% - 40px));
        transition: transform 0.45s cubic-bezier(0.2,0.9,0.3,1.2); padding: 14px 16px 12px; border-radius: 16px; color: #F4EEE6; font-family: 'Inter', sans-serif;
        background: linear-gradient(165deg, #2C261F, #19150F); border: 1px solid rgba(240,184,101,0.45); border-bottom: 5px solid #8A5E24; box-shadow: 0 22px 50px rgba(0,0,0,0.55); }
    .ftr.on { transform: translate(-50%, 0); }
    .ftr-top { display: flex; align-items: center; gap: 12px; }
    .ftr-xp { font: 900 2.4rem/1 'Barlow Condensed', 'Inter', sans-serif; font-style: italic; color: #F0B865; }
    .ftr-t { font: 900 1.25rem/1.05 'Barlow Condensed', 'Inter', sans-serif; font-style: italic; text-transform: uppercase; }
    .ftr-s { font: 700 0.74rem 'Inter', sans-serif; color: rgba(244,238,230,0.6); margin-top: 2px; }
    .ftr-list { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 9px; }
    .ftr-list span { padding: 2px 8px; transform: skewX(-10deg); background: rgba(244,238,230,0.07); font: 800 0.7rem 'Inter', sans-serif; }
    .ftr-list span b { color: #F0B865; }
    .ftr-bar { height: 6px; margin-top: 10px; background: rgba(244,238,230,0.1); transform: skewX(-14deg); overflow: hidden; }
    .ftr-bar i { display: block; height: 100%; background: linear-gradient(90deg, #5CB88A, #F0B865); transition: width 0.9s cubic-bezier(0.2,0.9,0.25,1) 0.25s; }
    .ftr-lv { margin-top: 8px; padding: 6px 9px; transform: skewX(-10deg); background: #5CB88A; color: #0E0B09; font: 900 1rem 'Barlow Condensed', sans-serif; font-style: italic; text-transform: uppercase; }
    @media (prefers-reduced-motion: reduce) { .ftr { transition: none; } }
    `;
    let card = null, hideT = null;
    function show(o) {
        if (!document.getElementById('ftrStyle')) { const st = document.createElement('style'); st.id = 'ftrStyle'; st.textContent = CSS; document.head.appendChild(st); }
        if (card) card.remove();
        clearTimeout(hideT);
        card = document.createElement('div');
        card.className = 'ftr'; card.setAttribute('role', 'status');
        const from = o.lv ? (o.lv.before.pct * 100) : 0, to = o.lv ? (o.lv.after.level > o.lv.before.level ? 100 : o.lv.after.pct * 100) : 0;
        card.innerHTML = '<div class="ftr-top"><span class="ftr-xp">+' + o.xp + '</span><div><div class="ftr-t"></div><div class="ftr-s"></div></div></div>' +
            '<div class="ftr-list">' + o.lines.map(l => '<span>' + l + '</span>').join('') + '</div>' +
            (o.lv ? '<div class="ftr-bar"><i style="width:' + from.toFixed(1) + '%"></i></div>' : '') +
            (o.levelUp ? '<div class="ftr-lv"></div>' : '');
        card.querySelector('.ftr-t').textContent = o.title;
        card.querySelector('.ftr-s').textContent = o.sub;
        if (o.levelUp) card.querySelector('.ftr-lv').textContent = o.levelUp;
        document.body.appendChild(card);
        // a timer, not animation frames: frames don't run in a tab the browser reports hidden
        const el = card;
        setTimeout(() => {
            el.classList.add('on');
            const bar = el.querySelector('.ftr-bar i'); if (bar) bar.style.width = to.toFixed(1) + '%';
        }, 40);
        card.onclick = () => { card.classList.remove('on'); };
        hideT = setTimeout(() => { if (card) card.classList.remove('on'); }, o.levelUp ? 5200 : 3600);
        try {
            if (global.FTJuice) {
                (o.levelUp ? FTJuice.sfx.levelUp : FTJuice.sfx.pop)();
                if (o.big && FTJuice.burst) FTJuice.burst(innerWidth / 2, 70, { count: 22, spread: 120 });
            }
        } catch (e) {}
    }

    function trade(t) {
        t = t || {};
        const s = load(), now = new Date(), today = dk(now);
        const y = new Date(now); y.setDate(now.getDate() - 1);
        const firstEver = !s.count;
        const firstToday = s.lastDay !== today;
        if (firstToday) { s.streak = s.lastDay === dk(y) ? (s.streak || 0) + 1 : 1; s.lastDay = today; }
        s.count = (s.count || 0) + 1;
        s.sectors = s.sectors || [];
        const newSector = t.side === 'buy' && t.sector && !s.sectors.includes(t.sector);
        if (newSector) s.sectors.push(t.sector);
        save(s);

        let xp = 15; const lines = ['Trade <b>+15</b>'];
        if (firstEver) { xp += 50; lines.push('First trade ever <b>+50</b>'); }
        else if (firstToday) { xp += 10; lines.push('First trade today <b>+10</b>'); }
        if (newSector && !firstEver) { xp += 20; lines.push('New sector: ' + t.sector + ' <b>+20</b>'); }
        if ((s.streak || 0) >= 2) { const b = Math.min(30, s.streak * 5); xp += b; lines.push(s.streak + '-day streak <b>+' + b + '</b>'); }
        const milestone = MILESTONES.includes(s.count) && s.count > 1 ? s.count : 0;
        if (milestone) { xp += 25; lines.push(milestone + ' trades <b>+25</b>'); }

        const lv = addXp(xp);
        const levelUp = lv && lv.after.level > lv.before.level
            ? 'Level up! Level ' + lv.after.level + ' · ' + lv.after.title + (global.FTAvatar ? ' — check your new avatar styles' : '')
            : '';
        const verb = t.side === 'sell' ? 'Sold' : 'Bought';
        show({
            xp, lines, lv, levelUp, big: firstEver || !!milestone || !!levelUp,
            title: firstEver ? 'First trade!' : milestone ? milestone + ' trades!' : verb + ' ' + (t.shares ? t.shares + ' ' : '') + (t.symbol || ''),
            sub: lv ? 'Level ' + lv.after.level + ' · ' + (lv.after.span - lv.after.into) + ' XP to the next' : 'Nice trade',
        });
        return { xp, stats: s };
    }

    global.FTRewards = { trade, stats: load };
})(typeof window !== 'undefined' ? window : this);
