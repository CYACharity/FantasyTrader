/* ============================================================
 *  FT JUICE — the feel layer.
 *
 *  Particles, confetti, screen shake, combo popups and sound.
 *
 *  Sound is synthesised with WebAudio rather than loaded from
 *  files: no network requests, no assets to ship, no licensing,
 *  and it can never 404. Every cue is a couple of oscillators
 *  with an envelope, which is all a UI blip ever needs to be.
 *
 *  Audio only starts after a real user gesture, because browsers
 *  block it otherwise — and because sound that starts by itself
 *  is obnoxious. Muted state persists.
 * ============================================================ */
(function (global) {
    'use strict';

    const MUTE_KEY = 'ftSoundMuted';

    /* ── sound ────────────────────────────────────────────── */
    let ctx = null;
    let unlocked = false;

    function muted() {
        try { return localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { return false; }
    }
    function setMuted(v) {
        try { localStorage.setItem(MUTE_KEY, v ? '1' : '0'); } catch (e) {}
    }

    function ensureCtx() {
        if (ctx) return ctx;
        const AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return null;
        try { ctx = new AC(); } catch (e) { return null; }
        return ctx;
    }

    // Browsers suspend audio until a gesture. Wire the unlock once.
    function unlock() {
        if (unlocked) return;
        const c = ensureCtx();
        if (!c) return;
        if (c.state === 'suspended') c.resume().catch(() => {});
        unlocked = true;
    }
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
        global.addEventListener(ev, unlock, { once: true, passive: true }));

    /* One note. type/freq/duration plus a simple ADSR-ish envelope. */
    function note(freq, dur, opts) {
        if (muted()) return;
        const c = ensureCtx();
        if (!c || c.state === 'suspended') return;
        opts = opts || {};
        const t0 = c.currentTime + (opts.delay || 0);
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = opts.type || 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        if (opts.glide) osc.frequency.exponentialRampToValueAtTime(
            Math.max(30, opts.glide), t0 + dur);

        const peak = (opts.gain != null ? opts.gain : 0.16);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        osc.connect(gain); gain.connect(c.destination);
        osc.start(t0); osc.stop(t0 + dur + 0.02);
    }

    /* Short bursts of filtered noise, for thuds and whooshes. */
    function noise(dur, opts) {
        if (muted()) return;
        const c = ensureCtx();
        if (!c || c.state === 'suspended') return;
        opts = opts || {};
        const frames = Math.floor(c.sampleRate * dur);
        const buf = c.createBuffer(1, frames, c.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < frames; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
        }
        const src = c.createBufferSource(); src.buffer = buf;
        const filt = c.createBiquadFilter();
        filt.type = opts.filter || 'lowpass';
        filt.frequency.value = opts.freq || 900;
        const gain = c.createGain();
        gain.gain.value = opts.gain != null ? opts.gain : 0.12;
        src.connect(filt); filt.connect(gain); gain.connect(c.destination);
        src.start();
    }

    const SFX = {
        correct() {
            note(523.25, 0.11, { type: 'triangle', gain: 0.14 });                 // C5
            note(659.25, 0.13, { type: 'triangle', gain: 0.13, delay: 0.075 });   // E5
            note(783.99, 0.20, { type: 'triangle', gain: 0.12, delay: 0.15 });    // G5
        },
        wrong() {
            note(196.00, 0.20, { type: 'sawtooth', gain: 0.09, glide: 130 });
            noise(0.14, { freq: 500, gain: 0.06 });
        },
        combo(n) {
            // each step of the combo climbs the scale
            const base = 523.25 * Math.pow(2, Math.min(n, 8) / 12);
            note(base, 0.09, { type: 'square', gain: 0.07 });
            note(base * 1.5, 0.12, { type: 'triangle', gain: 0.09, delay: 0.05 });
        },
        heart() {
            note(330, 0.16, { type: 'sine', gain: 0.11, glide: 190 });
        },
        tap() {
            note(760, 0.045, { type: 'sine', gain: 0.055 });
        },
        pop() {
            note(880, 0.06, { type: 'triangle', gain: 0.08, glide: 1200 });
        },
        complete() {
            [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
                note(f, 0.34, { type: 'triangle', gain: 0.13, delay: i * 0.11 }));
        },
        levelUp() {
            [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
                note(f, 0.4, { type: 'square', gain: 0.08, delay: i * 0.075 }));
        },
        whoosh() { noise(0.22, { freq: 1600, filter: 'highpass', gain: 0.05 }); },
    };

    /* ── particles ────────────────────────────────────────── */
    function layer() {
        let l = document.getElementById('ftJuiceLayer');
        if (!l) {
            l = document.createElement('div');
            l.id = 'ftJuiceLayer';
            l.style.cssText =
                'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
            document.body.appendChild(l);
        }
        return l;
    }

    const PALETTE = ['#5CB88A', '#E0A24C', '#9DB8D2', '#A98BD0', '#F4EEE6'];

    /* A burst of small shapes from a point — used on a correct answer. */
    function burst(x, y, opts) {
        opts = opts || {};
        const n = opts.count || 14;
        const host = layer();
        for (let i = 0; i < n; i++) {
            const p = document.createElement('i');
            const size = 5 + Math.random() * 7;
            const color = opts.color || PALETTE[Math.floor(Math.random() * PALETTE.length)];
            const round = Math.random() > 0.5;
            p.style.cssText =
                'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size +
                'px;background:' + color + ';border-radius:' + (round ? '50%' : '2px') +
                ';will-change:transform,opacity;';
            host.appendChild(p);

            const ang = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.7;
            const dist = (opts.spread || 90) * (0.55 + Math.random() * 0.75);
            const dx = Math.cos(ang) * dist;
            const dy = Math.sin(ang) * dist - (opts.lift || 26);
            const rot = (Math.random() - 0.5) * 540;

            p.animate([
                { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
                { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg) scale(0.4)', opacity: 0 },
            ], {
                duration: opts.duration || 760,
                easing: 'cubic-bezier(0.15, 0.7, 0.3, 1)',
                fill: 'forwards',
            }).onfinish = () => p.remove();
        }
    }

    /* Confetti falling from the top — used when a lesson completes. */
    function confetti(opts) {
        opts = opts || {};
        const host = layer();
        const n = opts.count || 70;
        for (let i = 0; i < n; i++) {
            const p = document.createElement('i');
            const w = 6 + Math.random() * 8;
            const h = 9 + Math.random() * 12;
            const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
            const startX = Math.random() * innerWidth;
            p.style.cssText =
                'position:absolute;left:' + startX + 'px;top:-30px;width:' + w + 'px;height:' + h +
                'px;background:' + color + ';border-radius:2px;will-change:transform,opacity;';
            host.appendChild(p);

            const drift = (Math.random() - 0.5) * 260;
            const spin = (Math.random() - 0.5) * 1400;
            const dur = 2100 + Math.random() * 1900;

            p.animate([
                { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
                { transform: 'translate(' + drift + 'px,' + (innerHeight + 80) + 'px) rotate(' + spin + 'deg)', opacity: 0.9 },
            ], { duration: dur, delay: Math.random() * 700, easing: 'cubic-bezier(0.3,0.5,0.6,1)', fill: 'forwards' })
             .onfinish = () => p.remove();
        }
    }

    /* Floating text, e.g. "+30 XP" or "COMBO x4". */
    function floatText(x, y, text, opts) {
        opts = opts || {};
        const host = layer();
        const n = document.createElement('div');
        n.textContent = text;
        n.style.cssText =
            'position:absolute;left:' + x + 'px;top:' + y + 'px;transform:translate(-50%,-50%);' +
            'font:800 ' + (opts.size || 1.5) + 'rem "Inter","Inter",sans-serif;' +
            'color:' + (opts.color || '#5CB88A') + ';text-shadow:0 3px 14px rgba(0,0,0,.55);' +
            'white-space:nowrap;will-change:transform,opacity;';
        host.appendChild(n);
        n.animate([
            { transform: 'translate(-50%,-50%) scale(0.6)', opacity: 0 },
            { transform: 'translate(-50%,-90%) scale(1.12)', opacity: 1, offset: 0.28 },
            { transform: 'translate(-50%,-115%) scale(1)', opacity: 1, offset: 0.62 },
            { transform: 'translate(-50%,-190%) scale(0.94)', opacity: 0 },
        ], { duration: opts.duration || 1250, easing: 'cubic-bezier(0.2,0.8,0.25,1)', fill: 'forwards' })
         .onfinish = () => n.remove();
    }

    /* Screen shake — deliberately small. Big shakes feel broken. */
    function shake(strength) {
        const s = strength || 6;
        const el = document.body;
        if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        el.animate([
            { transform: 'translate(0,0)' },
            { transform: 'translate(' + -s + 'px, ' + (s * 0.4) + 'px)' },
            { transform: 'translate(' + (s * 0.8) + 'px, ' + -(s * 0.3) + 'px)' },
            { transform: 'translate(' + -(s * 0.5) + 'px, 0)' },
            { transform: 'translate(0,0)' },
        ], { duration: 260, easing: 'ease-out' });
    }

    /* A ring that expands out of a point — good under a correct tap. */
    function ring(x, y, color) {
        const host = layer();
        const r = document.createElement('i');
        r.style.cssText =
            'position:absolute;left:' + x + 'px;top:' + y + 'px;width:20px;height:20px;' +
            'margin:-10px 0 0 -10px;border-radius:50%;border:3px solid ' + (color || '#5CB88A') + ';';
        host.appendChild(r);
        r.animate([
            { transform: 'scale(0.3)', opacity: 0.9 },
            { transform: 'scale(3.6)', opacity: 0 },
        ], { duration: 620, easing: 'cubic-bezier(0.2,0.7,0.3,1)', fill: 'forwards' })
         .onfinish = () => r.remove();
    }

    function centreOf(el) {
        if (!el || !el.getBoundingClientRect) return { x: innerWidth / 2, y: innerHeight / 2 };
        const b = el.getBoundingClientRect();
        return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    }

    global.FTJuice = {
        sfx: SFX, note, noise,
        burst, confetti, floatText, shake, ring, centreOf,
        muted, setMuted, unlock,
        palette: PALETTE,
    };
})(typeof window !== 'undefined' ? window : this);
