/* ============================================================
 *  AVATARS — who you are on the menu, your card and the table.
 *
 *  Three choices: a character, a frame and a backdrop. Your level
 *  (the same level as everywhere else, from the Academy XP)
 *  unlocks more of each, so levelling up changes how you look,
 *  not just a number. Saved on this device and, when the profiles
 *  table has an `avatar` column (supabase-schema-avatar.sql), on
 *  your account so league mates see it too.
 *
 *      FTAvatar.svg(choice, level, { size, tag })   -> markup
 *      FTAvatar.mine()                              -> this player's avatar markup
 *      FTAvatar.openPicker(onSave)                  -> the chooser
 * ============================================================ */
(function (global) {
    'use strict';
    const KEY = 'ftAvatar';

    /* ── characters: one flat, shaded style, face centred on (50,56) ── */
    const shine = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="1.5" fill="#fff"/>';
    const eyes = (lx, rx, y, r, c) => '<circle cx="' + lx + '" cy="' + y + '" r="' + r + '" fill="' + (c || '#16100C') + '"/>' +
        '<circle cx="' + rx + '" cy="' + y + '" r="' + r + '" fill="' + (c || '#16100C') + '"/>' + shine(lx + r * 0.35, y - r * 0.35) + shine(rx + r * 0.35, y - r * 0.35);
    const CHAR = {
        bull: { name: 'Rally', lvl: 1, art: () => {
            if (!global.FTBull) return '';
            // Rally himself, cropped to the head and shoulders, standing still
            // (the eyelids only open through the rig's animation, so a still Rally drops them)
            return FTBull.rigSVG()
                .replace(/<svg class="bull-rig[^"]*" viewBox="[^"]*"/, '<svg x="0" y="3" width="100" height="100" viewBox="30 18 140 140"')
                .replace(/<g id="bEyeLid[LR]" class="blinkable">[\s\S]*?<\/g>/g, '')
                .replace(/<(path|ellipse) class="mouth m-(grin|frown|o|flat)"[^>]*\/>/g, '');   // one mouth: the smile
        } },
        bear: { name: 'Bear', lvl: 1, art: () =>
            '<circle cx="27" cy="33" r="12" fill="#6E4428"/><circle cx="73" cy="33" r="12" fill="#6E4428"/>' +
            '<circle cx="27" cy="33" r="6" fill="#C98A5B"/><circle cx="73" cy="33" r="6" fill="#C98A5B"/>' +
            '<ellipse cx="50" cy="56" rx="31" ry="29" fill="url(#avBear)"/>' +
            '<ellipse cx="50" cy="68" rx="15" ry="12" fill="#E2B386"/>' +
            eyes(38, 62, 52, 3.8) + '<ellipse cx="50" cy="63" rx="5.5" ry="4" fill="#24160D"/>' +
            '<path d="M44 71 q6 5 12 0" stroke="#24160D" stroke-width="2.2" fill="none" stroke-linecap="round"/>' },
        fox: { name: 'Fox', lvl: 1, art: () =>
            '<path d="M20 20 L38 38 L24 50 Z" fill="#D8692E"/><path d="M80 20 L62 38 L76 50 Z" fill="#D8692E"/>' +
            '<path d="M24 26 L34 38 L27 44 Z" fill="#3A1F12"/><path d="M76 26 L66 38 L73 44 Z" fill="#3A1F12"/>' +
            '<path d="M18 46 Q50 22 82 46 Q80 72 50 88 Q20 72 18 46 Z" fill="url(#avFox)"/>' +
            '<path d="M24 56 Q38 60 50 88 Q30 78 24 56 Z M76 56 Q62 60 50 88 Q70 78 76 56 Z" fill="#FBEBDD"/>' +
            eyes(38, 62, 54, 3.6) + '<ellipse cx="50" cy="79" rx="4.6" ry="3.4" fill="#1E120B"/>' },
        panda: { name: 'Panda', lvl: 3, art: () =>
            '<circle cx="26" cy="32" r="11" fill="#1C1A1A"/><circle cx="74" cy="32" r="11" fill="#1C1A1A"/>' +
            '<ellipse cx="50" cy="56" rx="31" ry="29" fill="url(#avPanda)"/>' +
            '<ellipse cx="37" cy="53" rx="8" ry="10" fill="#1C1A1A" transform="rotate(-20 37 53)"/><ellipse cx="63" cy="53" rx="8" ry="10" fill="#1C1A1A" transform="rotate(20 63 53)"/>' +
            '<circle cx="38" cy="53" r="3" fill="#fff"/><circle cx="62" cy="53" r="3" fill="#fff"/><circle cx="38.6" cy="53.4" r="1.7" fill="#111"/><circle cx="61.4" cy="53.4" r="1.7" fill="#111"/>' +
            '<ellipse cx="50" cy="66" rx="5" ry="3.6" fill="#1C1A1A"/><path d="M45 72 q5 4 10 0" stroke="#1C1A1A" stroke-width="2" fill="none" stroke-linecap="round"/>' },
        owl: { name: 'Owl', lvl: 3, art: () =>
            '<path d="M24 24 L34 38 L22 40 Z M76 24 L66 38 L78 40 Z" fill="#5B3F7A"/>' +
            '<ellipse cx="50" cy="58" rx="30" ry="31" fill="url(#avOwl)"/>' +
            '<circle cx="38" cy="52" r="11" fill="#F6EEDB"/><circle cx="62" cy="52" r="11" fill="#F6EEDB"/>' +
            '<circle cx="38" cy="52" r="6.5" fill="#F0A93A"/><circle cx="62" cy="52" r="6.5" fill="#F0A93A"/>' +
            '<circle cx="38" cy="52" r="3.6" fill="#16100C"/><circle cx="62" cy="52" r="3.6" fill="#16100C"/>' + shine(39.4, 50.6) + shine(63.4, 50.6) +
            '<path d="M46 60 L54 60 L50 68 Z" fill="#E8A13A"/>' +
            '<path d="M34 74 q4 3 8 0 M46 77 q4 3 8 0 M58 74 q4 3 8 0" stroke="#C9B3E0" stroke-width="1.6" fill="none" opacity="0.7"/>' },
        wolf: { name: 'Wolf', lvl: 5, art: () =>
            '<path d="M20 16 L38 36 L22 46 Z M80 16 L62 36 L78 46 Z" fill="#5E6873"/>' +
            '<path d="M26 26 L34 36 L27 41 Z M74 26 L66 36 L73 41 Z" fill="#2C3137"/>' +
            '<path d="M20 44 Q50 22 80 44 Q82 66 66 78 L50 88 L34 78 Q18 66 20 44 Z" fill="url(#avWolf)"/>' +
            '<path d="M36 64 Q50 58 64 64 L58 82 L50 88 L42 82 Z" fill="#E4E7EA"/>' +
            eyes(38, 62, 52, 3.4, '#F2C14E') + '<circle cx="38" cy="52" r="1.6" fill="#16100C"/><circle cx="62" cy="52" r="1.6" fill="#16100C"/>' +
            '<ellipse cx="50" cy="70" rx="5" ry="3.6" fill="#1B1E22"/>' },
        cat: { name: 'Cat', lvl: 5, art: () =>
            '<path d="M22 20 L40 38 L22 48 Z M78 20 L60 38 L78 48 Z" fill="#3B3A40"/>' +
            '<path d="M26 28 L35 38 L26 43 Z M74 28 L65 38 L74 43 Z" fill="#E7A7A0"/>' +
            '<ellipse cx="50" cy="58" rx="31" ry="28" fill="url(#avCat)"/>' +
            '<ellipse cx="38" cy="54" rx="5" ry="6" fill="#8EE08A"/><ellipse cx="62" cy="54" rx="5" ry="6" fill="#8EE08A"/>' +
            '<ellipse cx="38" cy="54" rx="1.6" ry="5" fill="#111"/><ellipse cx="62" cy="54" rx="1.6" ry="5" fill="#111"/>' + shine(39.6, 51.6) + shine(63.6, 51.6) +
            '<path d="M47 64 L53 64 L50 68 Z" fill="#E7A7A0"/><path d="M50 68 q-4 5 -8 2 M50 68 q4 5 8 2" stroke="#1A191C" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
            '<path d="M22 64 L38 66 M22 70 L38 69 M78 64 L62 66 M78 70 L62 69" stroke="#CFCBD6" stroke-width="1.2" opacity="0.7"/>' },
        lion: { name: 'Lion', lvl: 8, art: () => {
            let mane = '';
            for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, x = 50 + Math.cos(a) * 32, y = 56 + Math.sin(a) * 32;
                mane += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="11" fill="' + (i % 2 ? '#B8651F' : '#CF7A26') + '"/>'; }
            return mane + '<circle cx="50" cy="56" r="30" fill="#B8651F"/>' +
                '<circle cx="31" cy="36" r="6" fill="#E8B862"/><circle cx="69" cy="36" r="6" fill="#E8B862"/>' +
                '<ellipse cx="50" cy="57" rx="24" ry="24" fill="url(#avLion)"/>' +
                '<ellipse cx="50" cy="69" rx="12" ry="9" fill="#F5DDB0"/>' +
                eyes(41, 59, 53, 3.4) + '<path d="M45 64 L55 64 L50 70 Z" fill="#5A2E16"/>' +
                '<path d="M50 70 q-4 5 -8 2 M50 70 q4 5 8 2" stroke="#5A2E16" stroke-width="1.8" fill="none" stroke-linecap="round"/>'; } },
        eagle: { name: 'Eagle', lvl: 10, art: () =>
            '<path d="M8 100 Q16 74 50 72 Q84 74 92 100 Z" fill="#5C3B22"/>' +
            '<path d="M26 50 Q28 24 50 22 Q72 24 74 50 Q74 72 50 78 Q26 72 26 50 Z" fill="url(#avEagle)"/>' +
            '<path d="M33 45 L46 49 M67 45 L54 49" stroke="#2A2420" stroke-width="3" stroke-linecap="round"/>' +
            eyes(40, 60, 52, 3.2, '#2A1D10') +
            '<path d="M42 58 Q50 54 58 58 Q60 66 52 72 Q52 66 46 64 Q42 62 42 58 Z" fill="#F2B233"/><path d="M52 72 Q56 66 58 60" stroke="#B87B12" stroke-width="1.4" fill="none"/>' },
    };

    const DEFS = '<radialGradient id="avBear" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#A36B42"/><stop offset="1" stop-color="#6A4125"/></radialGradient>' +
        '<radialGradient id="avFox" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#F08A43"/><stop offset="1" stop-color="#C2531E"/></radialGradient>' +
        '<radialGradient id="avPanda" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9D6D2"/></radialGradient>' +
        '<radialGradient id="avOwl" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#8A68AE"/><stop offset="1" stop-color="#523672"/></radialGradient>' +
        '<radialGradient id="avWolf" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#8C96A1"/><stop offset="1" stop-color="#58616B"/></radialGradient>' +
        '<radialGradient id="avCat" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#5C5A63"/><stop offset="1" stop-color="#34333A"/></radialGradient>' +
        '<radialGradient id="avLion" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#F2C572"/><stop offset="1" stop-color="#D99A45"/></radialGradient>' +
        '<radialGradient id="avEagle" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCD6CC"/></radialGradient>';

    /* ── frames: the style your level earns ── */
    const FRAMES = {
        plain:   { name: 'Plain',   lvl: 1,  stops: ['#5A5047', '#3A332C'] },
        bronze:  { name: 'Bronze',  lvl: 2,  stops: ['#E0A77A', '#8A5530'] },
        silver:  { name: 'Silver',  lvl: 4,  stops: ['#F2F5F8', '#8E99A4'] },
        gold:    { name: 'Gold',    lvl: 6,  stops: ['#FFE39A', '#C98E27'] },
        emerald: { name: 'Emerald', lvl: 9,  stops: ['#9CF0C4', '#1F8A57'] },
        diamond: { name: 'Diamond', lvl: 12, stops: ['#E4F2FF', '#7FA8FF'] },
        legend:  { name: 'Legend',  lvl: 15, stops: ['#F0907E', '#F0B865', '#7BD3A6', '#9DB8FF'] },
    };
    const BGS = {
        pine:   { name: 'Pine',   lvl: 1,  c: ['#27402F', '#101A14'] },
        ember:  { name: 'Ember',  lvl: 1,  c: ['#4A2A1A', '#1B100A'] },
        slate:  { name: 'Slate',  lvl: 1,  c: ['#2C3440', '#12161C'] },
        ocean:  { name: 'Ocean',  lvl: 3,  c: ['#1E4A66', '#0B1B26'] },
        grape:  { name: 'Grape',  lvl: 5,  c: ['#4A2E66', '#1A1026'] },
        sunset: { name: 'Sunset', lvl: 7,  c: ['#B4533A', '#3A1A20'] },
        vault:  { name: 'Vault',  lvl: 11, c: ['#8A6A1E', '#241A08'] },
    };

    function level() {
        try { return global.FTProgress ? FTProgress.levelFromXp(FTProgress.load().xp || 0).level : 1; } catch (e) { return 1; }
    }
    function bestFrame(lv) { let f = 'plain'; Object.keys(FRAMES).forEach(k => { if (FRAMES[k].lvl <= lv) f = k; }); return f; }
    function load() {
        let c = null; try { c = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
        return Object.assign({ a: 'bull', f: 'auto', b: 'pine' }, c || {});
    }
    // an item above your level falls back to what you have unlocked
    function resolve(choice, lv) {
        const c = Object.assign({ a: 'bull', f: 'auto', b: 'pine' }, choice || {});
        if (!CHAR[c.a] || CHAR[c.a].lvl > lv) c.a = 'bull';
        if (c.f === 'auto' || !FRAMES[c.f] || FRAMES[c.f].lvl > lv) c.f = bestFrame(lv);
        if (!BGS[c.b] || BGS[c.b].lvl > lv) c.b = 'pine';
        return c;
    }

    let uid = 0;
    function svg(choice, lv, o) {
        o = o || {};
        lv = lv || level();
        const c = resolve(choice, lv), id = 'av' + (++uid);
        const fr = FRAMES[c.f], bg = BGS[c.b];
        const frameStops = fr.stops.map((s, i) => '<stop offset="' + (i / Math.max(1, fr.stops.length - 1)) + '" stop-color="' + s + '"/>').join('');
        const ring = c.f === 'plain' ? 3 : 5;
        const tag = o.tag === false ? '' :
            '<g transform="translate(50 92)"><rect x="-17" y="-8" width="34" height="15" rx="3" transform="skewX(-12)" fill="url(#' + id + 'f)"/>' +
            '<text x="0" y="3.6" text-anchor="middle" font-family="Barlow Condensed, Inter, sans-serif" font-style="italic" font-weight="900" font-size="11" fill="#120E0B">LV ' + lv + '</text></g>';
        return '<svg class="ft-av' + (c.f === 'legend' ? ' legend' : '') + '" viewBox="0 0 100 104" width="' + (o.size || 56) + '" height="' + Math.round((o.size || 56) * 1.04) + '" aria-hidden="true">' +
            '<defs>' + DEFS +
              '<linearGradient id="' + id + 'f" x1="0" y1="0" x2="1" y2="1">' + frameStops + '</linearGradient>' +
              '<radialGradient id="' + id + 'b" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="' + bg.c[0] + '"/><stop offset="1" stop-color="' + bg.c[1] + '"/></radialGradient>' +
              '<clipPath id="' + id + 'c"><circle cx="50" cy="50" r="' + (46 - ring / 2) + '"/></clipPath>' +
            '</defs>' +
            '<circle cx="50" cy="50" r="46" fill="url(#' + id + 'b)"/>' +
            '<g clip-path="url(#' + id + 'c)">' + CHAR[c.a].art() + '</g>' +
            '<circle cx="50" cy="50" r="' + (46 - ring / 2) + '" fill="none" stroke="url(#' + id + 'f)" stroke-width="' + ring + '"/>' +
            (c.f === 'diamond' || c.f === 'legend' ? '<path d="M50 2 l3 5 l-3 5 l-3 -5 Z" fill="#fff" opacity="0.9"/>' : '') +
            tag + '</svg>';
    }

    function save(choice) {
        try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch (e) {}
        // on the account too, when the column exists; quietly local-only when it doesn't
        (async () => {
            try {
                if (!global.SL || !SL.configured) return;
                const u = await SL.currentUser(); if (!u) return;
                await SL.client.from('profiles').update({ avatar: JSON.stringify(choice) }).eq('id', u.id);
            } catch (e) {}
        })();
        try { global.dispatchEvent(new CustomEvent('ft:avatar', { detail: choice })); } catch (e) {}
    }

    /* ── the chooser ── */
    const CSS = `
    .avp-back { position: fixed; inset: 0; z-index: 9000; display: grid; place-items: center; background: rgba(8,6,5,0.72); backdrop-filter: blur(6px); }
    .avp { width: min(640px, calc(100vw - 24px)); max-height: calc(100vh - 24px); overflow: auto; padding: 22px; border-radius: 18px;
        background: linear-gradient(165deg, #2A241E, #17130F); border: 1px solid rgba(244,238,230,0.14); border-bottom: 5px solid #2F6B4C; color: #F4EEE6; font-family: 'Inter', sans-serif; }
    .avp-head { display: flex; align-items: center; gap: 18px; }
    .avp-head h3 { margin: 0; font: 900 2rem/1 'Barlow Condensed', sans-serif; font-style: italic; text-transform: uppercase; }
    .avp-tabs { display: flex; gap: 6px; margin: 16px 0 12px; }
    .avp-tab { padding: 0.4rem 0.95rem; transform: skewX(-12deg); cursor: pointer; border: 1px solid rgba(244,238,230,0.18); background: rgba(244,238,230,0.05); color: rgba(244,238,230,0.75); }
    .avp-tab span { display: inline-block; transform: skewX(12deg); font: 900 1rem 'Barlow Condensed', sans-serif; font-style: italic; text-transform: uppercase; }
    .avp-tab.on { background: #F0B865; border-color: #F0B865; color: #120E0B; }
    .avp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; }
    .avp-opt { position: relative; display: grid; justify-items: center; gap: 4px; padding: 10px 6px 8px; border-radius: 12px; cursor: pointer;
        background: rgba(244,238,230,0.04); border: 2px solid transparent; color: inherit; }
    .avp-opt:hover { background: rgba(244,238,230,0.08); }
    .avp-opt.on { border-color: #F0B865; background: rgba(240,184,101,0.10); }
    .avp-opt b { font: 800 0.72rem 'Inter', sans-serif; }
    .avp-opt.locked { cursor: not-allowed; }
    .avp-opt.locked svg { filter: grayscale(1) brightness(0.55); }
    .avp-opt.locked b { color: rgba(244,238,230,0.45); }
    .avp-lock { position: absolute; top: 6px; right: 6px; padding: 1px 6px; transform: skewX(-12deg); background: #3A332C; font: 800 0.6rem 'Inter', sans-serif; color: #F0B865; }
    .avp-foot { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    .avp-btn { padding: 0.5rem 1.2rem; transform: skewX(-12deg); cursor: pointer; border: 1px solid rgba(244,238,230,0.2); background: rgba(244,238,230,0.06); color: #F4EEE6; }
    .avp-btn span { display: inline-block; transform: skewX(12deg); font: 900 1.05rem 'Barlow Condensed', sans-serif; font-style: italic; text-transform: uppercase; }
    .avp-btn.go { background: #5CB88A; border-color: #5CB88A; color: #0E0B09; box-shadow: 0 3px 0 #2F6B4C; }
    .ft-av.legend { animation: ftAvGlow 3s ease-in-out infinite; }
    @keyframes ftAvGlow { 0%,100% { filter: drop-shadow(0 0 4px rgba(240,184,101,0.5)); } 50% { filter: drop-shadow(0 0 10px rgba(123,211,166,0.6)); } }
    `;
    function openPicker(onSave) {
        if (!document.getElementById('avpStyle')) { const s = document.createElement('style'); s.id = 'avpStyle'; s.textContent = CSS; document.head.appendChild(s); }
        const lv = level();
        let cur = resolve(load(), lv), tab = 'a';
        if (load().f === 'auto') cur.f = 'auto';
        const back = document.createElement('div'); back.className = 'avp-back';
        back.innerHTML = '<div class="avp" role="dialog" aria-label="Choose your avatar"><div class="avp-head"><span id="avpPrev"></span>' +
            '<div><h3>Your avatar</h3><div style="font:700 .8rem Inter;color:rgba(244,238,230,.6);margin-top:4px">Level ' + lv + '</div></div></div>' +
            '<div class="avp-tabs"><button class="avp-tab on" data-t="a"><span>Character</span></button><button class="avp-tab" data-t="f"><span>Frame</span></button><button class="avp-tab" data-t="b"><span>Backdrop</span></button></div>' +
            '<div class="avp-grid" id="avpGrid"></div>' +
            '<div class="avp-foot"><button class="avp-btn" data-x="cancel"><span>Cancel</span></button><button class="avp-btn go" data-x="save"><span>Save</span></button></div></div>';
        document.body.appendChild(back);
        const grid = back.querySelector('#avpGrid');
        function paint() {
            back.querySelector('#avpPrev').innerHTML = svg(cur, lv, { size: 92 });
            const src = tab === 'a' ? CHAR : tab === 'f' ? Object.assign({ auto: { name: 'Best unlocked', lvl: 1 } }, FRAMES) : BGS;
            grid.innerHTML = '';
            Object.keys(src).forEach(k => {
                const it = src[k], locked = it.lvl > lv;
                const preview = Object.assign({}, cur); preview[tab] = k;
                const b = document.createElement('button');
                b.className = 'avp-opt' + (cur[tab] === k ? ' on' : '') + (locked ? ' locked' : '');
                b.innerHTML = svg(locked ? Object.assign({}, cur, { [tab]: k }) : preview, Math.max(lv, it.lvl), { size: 64, tag: false }) +
                    '<b></b>' + (locked ? '<span class="avp-lock">LV ' + it.lvl + '</span>' : '');
                b.querySelector('b').textContent = it.name;
                b.onclick = () => { if (locked) return; cur[tab] = k; paint(); };
                grid.appendChild(b);
            });
        }
        back.addEventListener('click', e => {
            const t = e.target.closest('.avp-tab');
            if (t) { tab = t.dataset.t; back.querySelectorAll('.avp-tab').forEach(x => x.classList.toggle('on', x === t)); paint(); return; }
            const x = e.target.closest('[data-x]');
            if (x && x.dataset.x === 'save') { save(cur); back.remove(); if (onSave) onSave(cur); return; }
            if ((x && x.dataset.x === 'cancel') || e.target === back) back.remove();
        });
        paint();
    }

    // an avatar for another player, from what their profile stored (or Rally with their level)
    function forProfile(raw, lv, o) {
        let c = null; try { c = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) {}
        return svg(c || { a: 'bull' }, lv || 1, o);
    }

    global.FTAvatar = { svg, level, load, save, resolve, openPicker, forProfile, mine: (o) => svg(load(), level(), o), CHAR, FRAMES, BGS };
})(typeof window !== 'undefined' ? window : this);
