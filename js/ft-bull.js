/* ============================================================
 *  RALLY — the Fantasy Trader bull, as a controllable character.
 *
 *  Builds a rigged SVG (every moving part is a named <g> that
 *  css/ft-bull.css animates) and wraps it in a small controller:
 *
 *      const bull = FTBull.create({ size: 96, facing: 'right' });
 *      bull.mount(document.body);
 *      bull.say('Ready?', { ms: 2600 });
 *      bull.react('correct');
 *      bull.setState('think');
 *
 *  He is decorative and inert: pointer-events are off throughout,
 *  and he never steals focus from an exercise.
 * ============================================================ */
(function (global) {
    'use strict';

    const C = {
        green:   '#5CB88A', greenD: '#3E8C65', greenL: '#7BD3A6',
        honey:   '#E0A24C', honeyD: '#B37C33',
        red:     '#D9645C',
        ink:     '#F4EEE6', dark: '#14100E', darker: '#0C0A08',
        muzzle:  '#8FD9B2',
        horn:    '#F3E4C4', hornD: '#C49A5E',   // warm ivory, darker at the root
        blush:   '#F0907E',
        greenBk: '#2F6B4C',                       // far-side legs, in shadow
        hoof:    '#E2BE84', hoofD: '#B48C54',   // honey keratin — warmer, and still reads on the dark ground
    };

    /* ── shared paint ─────────────────────────────────────────
       Gradients live in ONE hidden <svg> on the page rather than inside
       each rig. A gradient defined inside a rig that is display:none
       (a Rally switched off) stops painting for every other rig that
       points at it; a page-level block never hides. */
    const DEFS = '' +
        '<radialGradient id="rgBody" cx="0.38" cy="0.3" r="0.8">' +
          '<stop offset="0" stop-color="#9BE2BC"/><stop offset="0.45" stop-color="#5FBC8D"/>' +
          '<stop offset="1" stop-color="#2F7553"/></radialGradient>' +
        '<radialGradient id="rgSkull" cx="0.42" cy="0.28" r="0.85">' +
          '<stop offset="0" stop-color="#A4E6C3"/><stop offset="0.5" stop-color="#63C091"/>' +
          '<stop offset="1" stop-color="#357E5B"/></radialGradient>' +
        '<radialGradient id="rgMuzzle" cx="0.45" cy="0.3" r="0.8">' +
          '<stop offset="0" stop-color="#D8F4E4"/><stop offset="0.6" stop-color="#A9E2C4"/>' +
          '<stop offset="1" stop-color="#77BD98"/></radialGradient>' +
        '<linearGradient id="rgLegF" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="#5BB287"/><stop offset="1" stop-color="#357A58"/></linearGradient>' +
        '<linearGradient id="rgLegB" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="#3B7F5E"/><stop offset="1" stop-color="#265A41"/></linearGradient>' +
        '<linearGradient id="rgHorn" x1="0" y1="1" x2="0.3" y2="0">' +
          '<stop offset="0" stop-color="#B98F57"/><stop offset="0.45" stop-color="#EBD7AE"/>' +
          '<stop offset="1" stop-color="#FFF6E2"/></linearGradient>' +
        '<linearGradient id="rgHoof" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#EDCB91"/><stop offset="1" stop-color="#A67C45"/></linearGradient>' +
        '<radialGradient id="rgEye" cx="0.4" cy="0.35" r="0.75">' +
          '<stop offset="0" stop-color="#FFFFFF"/><stop offset="0.75" stop-color="#F1ECE4"/>' +
          '<stop offset="1" stop-color="#C9D6CE"/></radialGradient>' +
        '<radialGradient id="rgIris" cx="0.5" cy="0.4" r="0.6">' +
          '<stop offset="0" stop-color="#8A5A2B"/><stop offset="0.7" stop-color="#4A2E17"/>' +
          '<stop offset="1" stop-color="#22140A"/></radialGradient>' +
        '<radialGradient id="rgEar" cx="0.5" cy="0.5" r="0.6">' +
          '<stop offset="0" stop-color="#F2B2A2"/><stop offset="1" stop-color="#C98472"/></radialGradient>' +
        '<radialGradient id="rgTuft" cx="0.4" cy="0.3" r="0.8">' +
          '<stop offset="0" stop-color="#F2C27A"/><stop offset="1" stop-color="#B37C33"/></radialGradient>';
    function ensureDefs() {
        if (typeof document === 'undefined' || document.getElementById('ftBullDefs')) return;
        const host = document.body || document.documentElement;
        if (!host) return;
        const div = document.createElement('div');
        div.innerHTML = '<svg id="ftBullDefs" width="0" height="0" aria-hidden="true" focusable="false" ' +
            'style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none">' +
            '<defs>' + DEFS + '</defs></svg>';
        host.appendChild(div.firstChild);
    }
    const U = id => 'url(#' + id + ')';

    /* ── the rig ──────────────────────────────────────────────
       Drawn once as a string. IDs matter: the stylesheet targets
       them directly, and transform-origins are declared there, so
       every moving part keeps the geometry it has always had —
       only the paint changed. Light comes from the upper left:
       gradients, a rim of light along the top, contact shadow
       where the head meets the chest, catchlights in the eyes. */
    function rigSVG() {
        ensureDefs();
        return '' +
        '<svg class="bull-rig is-idle" viewBox="34 22 148 148" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +

          /* ---- tail: a tapering switch ending in a honey tuft ---- */
          '<g id="bTail">' +
            '<path d="M143 110c15 1 24 11 23 24" stroke="#357E5B" stroke-width="6.5" stroke-linecap="round" fill="none"/>' +
            '<path d="M143 110c14 1 22 10 22 22" stroke="#6CC697" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.55"/>' +
            '<path d="M166 131c6 1 9 6 8 11 2 3 0 8-4 8-2 3-8 3-10 0-4-1-5-6-2-9-1-5 3-10 8-10z" fill="' + U('rgTuft') + '"/>' +
            '<path d="M163 138c1 3 3 6 6 7" stroke="#8F6124" stroke-width="1.3" fill="none" opacity="0.6"/>' +
          '</g>' +

          /* ---- back legs (far side, in the body's shadow) ---- */
          '<g id="bLegBL">' +
            '<rect x="111" y="122" width="13" height="34" rx="6.5" fill="' + U('rgLegB') + '" stroke="#1B3F2E" stroke-width="1.2"/>' +
            '<path d="M110.5 146h14v6.5a4.5 4.5 0 0 1-4.5 4.5h-5a4.5 4.5 0 0 1-4.5-4.5z" fill="#B58A52" stroke="#6E5230" stroke-width="1"/>' +
            '<path d="M117.5 148.5v8" stroke="#6E5230" stroke-width="1" opacity="0.7"/>' +
          '</g>' +
          '<g id="bLegBR">' +
            '<rect x="126" y="122" width="13" height="34" rx="6.5" fill="' + U('rgLegB') + '" stroke="#1B3F2E" stroke-width="1.2"/>' +
            '<path d="M125.5 146h14v6.5a4.5 4.5 0 0 1-4.5 4.5h-5a4.5 4.5 0 0 1-4.5-4.5z" fill="#B58A52" stroke="#6E5230" stroke-width="1"/>' +
            '<path d="M132.5 148.5v8" stroke="#6E5230" stroke-width="1" opacity="0.7"/>' +
          '</g>' +

          /* ---- body: a bull's barrel with a shoulder hump ---- */
          '<g id="bBody">' +
            '<path d="M66 116c0-17 13-28 30-30 8-6 22-7 32-2 13 5 21 16 20 30 0 15-14 26-40 27-27 1-42-9-42-25z" fill="' + U('rgBody') + '" stroke="#1F4A36" stroke-width="1.4"/>' +
            /* rim light along the back */
            '<path d="M98 88c9-6 22-6 31-1 8 4 14 10 17 18" stroke="#C8F2DA" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.55"/>' +
            /* underside in shadow (it used to be a pale band that read as painted over the legs) */
            '<path d="M76 128c10 9 42 11 62 0-8 9-20 13-32 13s-24-4-30-13z" fill="#1F4A36" opacity="0.28"/>' +
            /* fur texture: a few short strokes on the flank */
            '<path d="M124 104l4 3M130 111l4 2M121 114l3 3M113 99l3 3" stroke="#357E5B" stroke-width="1.4" stroke-linecap="round" opacity="0.35"/>' +
            /* contact shadow where the head sits on the chest */
            '<ellipse cx="100" cy="121" rx="25" ry="7" fill="#1F4E37" opacity="0.35"/>' +
          '</g>' +

          /* ---- front legs ---- */
          '<g id="bLegFL">' +
            '<rect x="77" y="126" width="14" height="34" rx="7" fill="' + U('rgLegF') + '" stroke="#1F4A36" stroke-width="1.3"/>' +
            '<path d="M80.5 131v14" stroke="#A8E8C6" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>' +
            '<path d="M76.5 149h15v7a5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5z" fill="' + U('rgHoof') + '" stroke="#7A5A33" stroke-width="1.1"/>' +
            '<path d="M84 152v9" stroke="#7A5A33" stroke-width="1.1" opacity="0.75"/>' +
            '<path d="M79.5 151.5h3" stroke="#FFF1D6" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>' +
          '</g>' +
          '<g id="bLegFR">' +
            '<rect x="94" y="126" width="14" height="34" rx="7" fill="' + U('rgLegF') + '" stroke="#1F4A36" stroke-width="1.3"/>' +
            '<path d="M97.5 131v14" stroke="#A8E8C6" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>' +
            '<path d="M93.5 149h15v7a5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5z" fill="' + U('rgHoof') + '" stroke="#7A5A33" stroke-width="1.1"/>' +
            '<path d="M101 152v9" stroke="#7A5A33" stroke-width="1.1" opacity="0.75"/>' +
            '<path d="M96.5 151.5h3" stroke="#FFF1D6" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>' +
          '</g>' +

          /* ---- head ---- */
          '<g id="bHeadGrp">' +

            /* A cartoon head: about 9% bigger than the body wants, grown from the
               chin so the neck line stays put. The scale lives on an inner group,
               because the stylesheet owns #bHeadGrp's own transform. */
            '<g transform="translate(100 122) scale(1.09) translate(-100 -122)">' +

            /* horns: tapered, ivory at the tip, darker ridged root */
            '<path d="M73 63c-12-3-20-12-19-22 1-6 6-9 11-7-4 2-6 6-5 10 1 7 8 11 16 12z" fill="' + U('rgHorn') + '"/>' +
            '<path d="M127 63c12-3 20-12 19-22-1-6-6-9-11-7 4 2 6 6 5 10-1 7-8 11-16 12z" fill="' + U('rgHorn') + '"/>' +
            '<path d="M63 56l3-3M60 51l4-2M136 53l3 3M139 49l-3-2" stroke="#9C7640" stroke-width="1.1" stroke-linecap="round" opacity="0.35"/>' +
            '<path d="M57 42c0-3 2-6 5-7" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.7"/>' +

            /* ears: green outside, warm pink inside */
            '<g id="bEarL"><ellipse cx="60" cy="68" rx="15.5" ry="10" fill="#4A9E75" stroke="#1F4A36" stroke-width="1.2" transform="rotate(-20 60 68)"/>' +
              '<ellipse cx="62" cy="68.5" rx="9" ry="5.2" fill="' + U('rgEar') + '" transform="rotate(-20 62 68)"/></g>' +
            '<g id="bEarR"><ellipse cx="140" cy="68" rx="15.5" ry="10" fill="#3F8E68" stroke="#1F4A36" stroke-width="1.2" transform="rotate(20 140 68)"/>' +
              '<ellipse cx="138" cy="68.5" rx="9" ry="5.2" fill="' + U('rgEar') + '" transform="rotate(20 138 68)"/></g>' +

            /* skull */
            '<path d="M70 78c0-17 13-28 30-28s30 11 30 28v14c0 20-13 32-30 32s-30-12-30-32z" fill="' + U('rgSkull') + '" stroke="#1F4A36" stroke-width="1.4"/>' +
            '<path d="M78 60c6-6 14-9 22-9" stroke="#D2F5E2" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.6"/>' +

            /* forelock: a honey tuft between the horns */
            '<path d="M88 55c2-8 7-12 12-12-2 3-1 5 1 6 1-4 5-7 9-6-2 2-2 5 0 7 3-1 6 0 7 2-5 1-8 4-10 6-6-3-13-4-19-3z" fill="' + U('rgTuft') + '"/>' +
            '<path d="M97 49c1 2 1 4 0 6M104 49c0 2 0 4-1 6" stroke="#8F6124" stroke-width="1.1" stroke-linecap="round" fill="none" opacity="0.55"/>' +

            /* muzzle, with a wet-nose sheen */
            '<ellipse cx="100" cy="107" rx="23.5" ry="16.5" fill="' + U('rgMuzzle') + '"/>' +
            '<ellipse cx="94" cy="97.5" rx="9" ry="3" fill="#FFFFFF" opacity="0.45"/>' +
            '<path d="M89 97.5c1.5-2.6 4.8-2.6 5.4 0.4 0.4 2.4-1.8 4.6-3.8 4.2-1.8-0.4-2.6-2.6-1.6-4.6z" fill="#1E2A23" opacity="0.8"/>' +
            '<path d="M111 97.5c-1.5-2.6-4.8-2.6-5.4 0.4-0.4 2.4 1.8 4.6 3.8 4.2 1.8-0.4 2.6-2.6 1.6-4.6z" fill="#1E2A23" opacity="0.8"/>' +

            /* nose ring: gold, with a highlight */
            '<circle cx="100" cy="107" r="5.2" stroke="#C88E3C" stroke-width="2.6" fill="none"/>' +
            '<path d="M96 104.5a5 5 0 0 1 4-2.5" stroke="#FFE3A8" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
            '<circle cx="100" cy="102" r="1.5" fill="#8F6124"/>' +

            /* mouth shapes — one visible at a time, all below the ring */
            '<g id="bMouthGrp">' +
              '<path class="mouth m-smile on" d="M88.5 114.5q11.5 10 23 0M87 113.2q1.2 1.8 2.6 1.6M113 113.2q-1.2 1.8-2.6 1.6" stroke="#1E2A23" stroke-width="3" stroke-linecap="round" fill="none"/>' +
              '<path class="mouth m-grin" d="M87 113q13 13 26 0q-13 5-26 0" fill="#2A1712"/>' +
              '<path class="mouth m-frown" d="M90 119q10-8 20 0" stroke="#1E2A23" stroke-width="3" stroke-linecap="round" fill="none"/>' +
              '<ellipse class="mouth m-o" cx="100" cy="116" rx="5" ry="6" fill="#2A1712"/>' +
              '<path class="mouth m-flat" d="M91 116h18" stroke="#1E2A23" stroke-width="3" stroke-linecap="round"/>' +
            '</g>' +

            /* cheeks */
            '<ellipse cx="74" cy="104" rx="5.5" ry="3.4" fill="' + C.blush + '" opacity="0.55"/>' +
            '<ellipse cx="126" cy="104" rx="5.5" ry="3.4" fill="' + C.blush + '" opacity="0.55"/>' +

            /* eyes: shaded whites, brown irises, two catchlights each */
            '<ellipse cx="82" cy="88" rx="11" ry="12.2" fill="' + U('rgEye') + '" stroke="#1F4A36" stroke-width="1"/>' +
            '<ellipse cx="118" cy="88" rx="11" ry="12.2" fill="' + U('rgEye') + '" stroke="#1F4A36" stroke-width="1"/>' +
            '<g id="bPupils">' +
              '<circle cx="83" cy="89.5" r="7.4" fill="' + U('rgIris') + '"/>' +
              '<circle cx="119" cy="89.5" r="7.4" fill="' + U('rgIris') + '"/>' +
              '<circle cx="83" cy="90" r="3.8" fill="#0B0705"/>' +
              '<circle cx="119" cy="90" r="3.8" fill="#0B0705"/>' +
              '<circle cx="86" cy="86.2" r="2.7" fill="#FFFFFF"/>' +
              '<circle cx="122" cy="86.2" r="2.7" fill="#FFFFFF"/>' +
              '<circle cx="80.4" cy="92.8" r="1.2" fill="#FFFFFF" opacity="0.85"/>' +
              '<circle cx="116.4" cy="92.8" r="1.2" fill="#FFFFFF" opacity="0.85"/>' +
            '</g>' +
            /* upper-lid shadow so the eyes sit IN the head */
            '<path d="M71.5 83c2-5.5 6.5-8 10.5-8s8.5 2.5 10.5 8" stroke="#2F7553" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.55"/>' +
            '<path d="M107.5 83c2-5.5 6.5-8 10.5-8s8.5 2.5 10.5 8" stroke="#2F7553" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.55"/>' +
            '<g id="bEyeLidL" class="blinkable">' +
              '<ellipse cx="82" cy="88" rx="11.7" ry="12.9" fill="#5DB98B"/></g>' +
            '<g id="bEyeLidR" class="blinkable">' +
              '<ellipse cx="118" cy="88" rx="11.7" ry="12.9" fill="#5AB688"/></g>' +

            /* brows */
            '<g id="bBrowL"><path d="M73 75.5q9-6 19-2.5" stroke="#285E45" stroke-width="4.6" stroke-linecap="round" fill="none"/></g>' +
            '<g id="bBrowR"><path d="M127 75.5q-9-6-19-2.5" stroke="#285E45" stroke-width="4.6" stroke-linecap="round" fill="none"/></g>' +
            '</g>' +
          '</g>' +
        '</svg>';
    }

    /* ── dialogue banks ───────────────────────────────────────
       Written so he sounds encouraging without being saccharine,
       and never claims a wrong answer was "nearly right". */
    const LINES = {
        greet: [
            "Right. Let's go.",
            "Morning.",
            "Back again. Good.",
            "Nothing here costs you anything. Swing away.",
            "Ready when you are.",
        ],
        correct: [
            "That's the one.",
            "Correct.",
            "Yep.",
            "Got it.",
            "That one catches people out.",
            "Straight through.",
        ],
        streak3: [
            "Three straight.",
            "You're on a run.",
            "Three. Keep going.",
        ],
        streak5: [
            "Five in a row. You're cooking.",
            "Five straight. Alright then.",
        ],
        wrong: [
            "No. Read the reason.",
            "Nope.",
            "Missed it. Worth a second look.",
            "Not that one.",
        ],
        heartLow: [
            "One heart left. Slow down.",
            "Last heart. Read it properly.",
        ],
        think: [
            "Take your time.",
            "No clock on this.",
            "Have a proper think.",
        ],
        complete: [
            "Done. Well played.",
            "That's the lesson.",
            "Finished. Good one.",
        ],
        perfect: [
            "Not one wrong. Show-off.",
            "Clean sweep.",
            "100%. Take it.",
        ],
        idle: [
            "Still there?",
            "Whenever you're ready.",
            "I'll wait.",
        ],
    };

    function pick(arr, avoid) {
        if (!arr || !arr.length) return '';
        if (arr.length === 1) return arr[0];
        let v = arr[Math.floor(Math.random() * arr.length)];
        let guard = 0;
        while (v === avoid && guard++ < 6) v = arr[Math.floor(Math.random() * arr.length)];
        return v;
    }

    const MOUTHS = ['m-smile', 'm-grin', 'm-frown', 'm-o', 'm-flat'];

    /* ── controller ───────────────────────────────────────── */
    function Bull(opts) {
        opts = opts || {};
        this.size = opts.size || 96;
        this.facing = opts.facing || 'right';   // which side the bubble sits
        this.dock = opts.dock !== false;
        this.typewriter = opts.typewriter !== false;

        this.el = document.createElement('div');
        this.el.className = (this.dock ? 'bull-dock ' : 'bull-stage ') +
                            (this.facing === 'right' ? 'left' : 'right');

        this.holder = document.createElement('div');
        this.holder.className = 'bull-holder';
        this.holder.innerHTML = rigSVG() + '<span class="bull-shadow"></span>';

        this.bubble = document.createElement('div');
        this.bubble.className = 'bull-bubble';

        this.el.appendChild(this.holder);
        this.el.appendChild(this.bubble);

        this.rig = this.holder.querySelector('.bull-rig');
        // docked bulls are sized by the stylesheet (which also handles the
        // phone breakpoint) — an inline size here would override all of that
        if (!this.dock) {
            this.rig.style.width = this.size + 'px';
            this.rig.style.height = this.size + 'px';
        }

        this.state = 'idle';
        this._sayTimer = null;
        this._typeTimer = null;
        this._stateTimer = null;
        this._last = {};
        this._reduced = global.matchMedia &&
            global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    Bull.prototype.mount = function (parent) {
        (parent || document.body).appendChild(this.el);
        return this;
    };
    Bull.prototype.destroy = function () {
        clearTimeout(this._sayTimer); clearTimeout(this._stateTimer);
        clearInterval(this._typeTimer);
        if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
    };

    /* Z's only exist while he's asleep — built and torn down with the state
       so no other state carries a stray animation. */
    Bull.prototype._zzz = function (on) {
        const existing = this.holder.querySelector('.bull-zzz');
        if (existing) existing.remove();
        if (!on) return;
        const box = document.createElement('span');
        box.className = 'bull-zzz';
        box.innerHTML = '<i class="bull-z">Z</i><i class="bull-z">Z</i><i class="bull-z">Z</i>';
        this.holder.appendChild(box);
    };

    Bull.prototype.mouth = function (name) {
        MOUTHS.forEach(m => {
            const n = this.rig.querySelector('.' + m);
            if (n) n.classList.toggle('on', m === name);
        });
        return this;
    };

    /* Set a state. Transient states fall back to idle by themselves so
       the caller never has to remember to reset him. */
    Bull.prototype.setState = function (name, holdMs) {
        clearTimeout(this._stateTimer);
        const all = ['idle', 'happy', 'cheer', 'sad', 'think', 'wave', 'walk', 'worry', 'sleep', 'graze'];
        all.forEach(s => this.rig.classList.remove('is-' + s));
        // reflow so a repeated state re-triggers its animation
        void this.rig.offsetWidth;
        this.rig.classList.add('is-' + name);
        this.state = name;
        this._zzz(name === 'sleep');

        const MOUTH_FOR = {
            idle: 'm-smile', happy: 'm-grin', cheer: 'm-grin', sad: 'm-frown',
            think: 'm-flat', wave: 'm-grin', walk: 'm-smile', worry: 'm-o', sleep: 'm-flat',
            graze: 'm-flat',
        };
        this.mouth(MOUTH_FOR[name] || 'm-smile');

        const AUTO = { happy: 1500, cheer: 1900, worry: 900, wave: 2600 };
        if (AUTO[name] && !holdMs) {
            this._stateTimer = setTimeout(() => this.setState('idle'), AUTO[name]);
        } else if (holdMs) {
            this._stateTimer = setTimeout(() => this.setState('idle'), holdMs);
        }
        return this;
    };

    /* Speak. Types the text out unless reduced-motion is on. */
    Bull.prototype.say = function (text, o) {
        o = o || {};
        if (!text) return this;
        clearTimeout(this._sayTimer);
        clearInterval(this._typeTimer);

        this.bubble.className = 'bull-bubble show' + (o.tone ? ' ' + o.tone : '');
        this.el.classList.add('talking');

        if (this.typewriter && !this._reduced && text.length < 90) {
            this.bubble.innerHTML = '<span class="said"></span><span class="cursor"></span>';
            const said = this.bubble.querySelector('.said');
            let i = 0;
            this._typeTimer = setInterval(() => {
                said.textContent = text.slice(0, ++i);
                if (i >= text.length) {
                    clearInterval(this._typeTimer);
                    const cur = this.bubble.querySelector('.cursor');
                    if (cur) cur.remove();
                }
            }, 18);
        } else {
            this.bubble.textContent = text;
        }

        const ms = o.ms || Math.max(1900, Math.min(6000, text.length * 62));
        this._sayTimer = setTimeout(() => this.hush(), ms);
        return this;
    };

    Bull.prototype.hush = function () {
        clearInterval(this._typeTimer);
        this.bubble.classList.remove('show');
        this.el.classList.remove('talking');
        return this;
    };

    /* One call the lesson engine can make for each event. */
    Bull.prototype.react = function (event, data) {
        data = data || {};
        switch (event) {
            case 'greet':
                this.setState('wave');
                this.say(pick(LINES.greet, this._last.greet), { ms: 3000 });
                this._last.greet = this.bubble.textContent;
                break;

            case 'correct': {
                const streak = data.streak || 0;
                if (streak >= 5) {
                    this.setState('cheer');
                    this.say(pick(LINES.streak5), { tone: 'ok', ms: 2600 });
                } else if (streak === 3) {
                    this.setState('happy');
                    this.say(pick(LINES.streak3), { tone: 'ok', ms: 2400 });
                } else {
                    this.setState('happy');
                    const line = pick(LINES.correct, this._last.correct);
                    this._last.correct = line;
                    this.say(line, { tone: 'ok', ms: 2000 });
                }
                break;
            }

            case 'wrong':
                if (data.hearts === 1) {
                    this.setState('worry');
                    this.say(pick(LINES.heartLow), { tone: 'no', ms: 2800 });
                } else {
                    this.setState('sad', 1600);
                    const line = pick(LINES.wrong, this._last.wrong);
                    this._last.wrong = line;
                    this.say(line, { tone: 'no', ms: 2400 });
                }
                break;

            case 'think':
                this.setState('think');
                if (data.speak) this.say(pick(LINES.think), { ms: 2200 });
                break;

            case 'complete':
                this.setState('cheer', 2600);
                this.say(pick(data.perfect ? LINES.perfect : LINES.complete), { tone: 'ok', ms: 3600 });
                break;

            case 'idle':
                this.setState('idle');
                this.say(pick(LINES.idle), { ms: 2200 });
                break;

            case 'sleep':
                this.setState('sleep');
                this.hush();
                break;

            default:
                this.setState('idle');
        }
        return this;
    };

    Bull.prototype.lift = function (on) {
        this.el.classList.toggle('lifted', !!on);
        return this;
    };
    Bull.prototype.hide = function () { this.el.classList.add('hidden'); return this; };
    Bull.prototype.show = function () { this.el.classList.remove('hidden'); return this; };

    global.FTBull = {
        create(opts) { return new Bull(opts); },
        rigSVG,
        LINES,
    };
})(typeof window !== 'undefined' ? window : this);
