/* ============================================================
 *  FT BACKDROP — a market chart, drawn behind the page.
 *
 *      <canvas class="ft-backdrop" aria-hidden="true"></canvas>
 *
 *  A graph grid, a jagged price line that scrolls right to left,
 *  a glow under it and a filled area beneath. Green while it is
 *  climbing, red while it is falling, and the run of colour lasts
 *  as long as the move does rather than flickering segment by
 *  segment.
 *
 *  What went wrong in the first version, and what fixes it here:
 *
 *   · It smoothed every point into a bezier, which made a lava
 *     lamp rather than a chart. The line is now a polyline with
 *     hard corners, and the walk carries a fast noise term on top
 *     of a slow trend so the corners are real, not decoration.
 *
 *   · It stroked one path per segment, each with its own alpha.
 *     Overlapping round caps at differing alpha is what the eye
 *     read as flicker along the line. Segments are now grouped
 *     into runs — consecutive moves the same direction are one
 *     path, one stroke, one colour.
 *
 *   · It faded the left edge by lowering alpha per segment, which
 *     banded. The fade is a CSS mask on the canvas now, applied
 *     once to the finished frame.
 *
 *   · It ran rAF and an interval together with a probe that could
 *     let both advance the same frame — a visible stutter. There
 *     is one clock now: whichever source ticks, it advances by
 *     real elapsed time and never twice for the same instant.
 * ============================================================ */
(function (global) {
    'use strict';

    var UP   = [ 92, 184, 138];      // sage
    var DOWN = [217, 100,  92];      // red

    function rgba(c, a) {
        return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
    }

    function start(canvas, opts) {
        opts = opts || {};
        var ctx = canvas.getContext('2d');
        if (!ctx) return null;

        var reduced = global.matchMedia &&
            global.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var STEP        = opts.step || 76;        // px between readings
        var MS_PER_STEP = opts.msPerStep || 1250; // how fast it scrolls
        var GRID        = opts.grid || 104;       // graph square, px
        var ALPHA       = opts.alpha == null ? 1 : opts.alpha;

        var w = 0, h = 0, dpr = 1, need = 0;
        var pts = [];        // 0..1, index 0 is the newest (right edge)
        var ghost = [];      // a second, slower line further back — depth, not detail
        var gTrend = 0;
        var trend = 0;       // slow component: where the market is going
        var phase = 0;       // 0..1 between readings
        var gridOff = 0;     // the grid scrolls with the line
        var raf = 0, timer = 0, last = 0, running = false;
        var beat = 0;   // radians, drives the head's pulse

        /* ── the walk ──────────────────────────────────────────
           A slow trend that persists for tens of readings, plus a
           fast shock on every reading. The trend is what makes runs
           long enough to read as a rally or a selloff; the shock is
           what makes the line jagged instead of a sine wave. */
        function nextPoint() {
            var prev = pts.length ? pts[0] : 0.5;
            trend += (Math.random() - 0.5) * 0.30;
            trend  = Math.max(-1, Math.min(1, trend * 0.96));   // long memory: slow swings
            /* Two things had to be true at once and only one constant each
               controls them, so these were measured rather than guessed:
                 · the shock stays about half the trend's reach, which keeps
                   runs ~3.4 readings long — jagged corners, legible moves.
                   Equal amounts make every reading reverse, and the line
                   reads as static instead of as a market.
                 · together they cover ~0.5 of the canvas height per screen
                   of readings, so the line actually climbs and falls
                   through the frame rather than hugging one band. */
            /* The shock is what made it jitter. At a fifth of the trend's reach
               the line still turns, but it turns on purpose rather than
               twitching every reading. */
            var shock = (Math.random() - 0.5) * 0.022;
            var v = prev + trend * 0.230 + shock;
            // reflect off the top and bottom rather than clamping flat
            if (v < 0.18) { v = 0.18 + (0.18 - v); trend =  Math.abs(trend); }
            if (v > 0.82) { v = 0.82 - (v - 0.82); trend = -Math.abs(trend); }
            return Math.max(0.12, Math.min(0.88, v));
        }

        /* The ghost drifts on its own, gentler walk and sits lower in the
           frame. It is never in focus; it is there so the front line has
           something to be in front of. */
        function nextGhost() {
            var prev = ghost.length ? ghost[0] : 0.42;
            gTrend += (Math.random() - 0.5) * 0.22;
            gTrend  = Math.max(-1, Math.min(1, gTrend * 0.965));
            var v = prev + gTrend * 0.16;
            if (v < 0.22) { v = 0.22 + (0.22 - v); gTrend =  Math.abs(gTrend); }
            if (v > 0.72) { v = 0.72 - (v - 0.72); gTrend = -Math.abs(gTrend); }
            return Math.max(0.16, Math.min(0.8, v));
        }

        function resize() {
            dpr = Math.min(2, global.devicePixelRatio || 1);
            w = canvas.clientWidth || canvas.offsetWidth || 0;
            h = canvas.clientHeight || canvas.offsetHeight || 0;
            if (!w || !h) return;
            canvas.width  = Math.max(1, Math.round(w * dpr));
            canvas.height = Math.max(1, Math.round(h * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            need = Math.ceil(w / STEP) + 4;
            while (pts.length < need) pts.push(nextPoint());
            if (pts.length > need + 2) pts.length = need + 2;
            while (ghost.length < need) ghost.push(nextGhost());
            if (ghost.length > need + 2) ghost.length = need + 2;
        }

        // screen position of reading i (0 = newest, at the right edge)
        function X(i) { return w - (i - phase) * STEP; }
        function Y(i) { return (1 - pts[i]) * h; }

        /* ── the graph paper ───────────────────────────────────
           Verticals scroll with the line so the chart reads as
           moving over a grid rather than the grid being wallpaper.
           Horizontals stay put: they are price levels. */
        function drawGrid() {
            ctx.lineWidth = 1;
            var gg = ctx.createLinearGradient(0, 0, w, 0);
            gg.addColorStop(0,    'rgba(236, 226, 214, 0)');
            gg.addColorStop(0.35, 'rgba(236, 226, 214, 0.05)');
            gg.addColorStop(1,    'rgba(236, 226, 214, 0.05)');
            ctx.strokeStyle = gg;
            ctx.beginPath();
            for (var y = h; y > 0; y -= GRID) {
                var py = Math.round(y) + 0.5;
                ctx.moveTo(0, py); ctx.lineTo(w, py);
            }
            var x0 = w - (gridOff % GRID);
            for (var x = x0; x > -GRID; x -= GRID) {
                var px = Math.round(x) + 0.5;
                ctx.moveTo(px, 0); ctx.lineTo(px, h);
            }
            ctx.stroke();
        }

        /* ── runs ──────────────────────────────────────────────
           Walk the readings and cut the line wherever the direction
           changes. Each run is one path, so a run has exactly one
           colour and no interior seams. Runs share their boundary
           point, which is what keeps the joins closed. */
        function runs() {
            var out = [], cur = null, i, dir;
            for (i = pts.length - 1; i > 0; i--) {
                // left to right: i is older (further left) than i-1
                dir = pts[i - 1] >= pts[i] ? 1 : -1;
                if (!cur || cur.dir !== dir) {
                    if (cur) out.push(cur);
                    cur = { dir: dir, idx: [i] };
                }
                cur.idx.push(i - 1);
            }
            if (cur) out.push(cur);
            return out;
        }

        function tracePath(idx) {
            ctx.beginPath();
            ctx.moveTo(X(idx[0]), Y(idx[0]));
            for (var k = 1; k < idx.length; k++) ctx.lineTo(X(idx[k]), Y(idx[k]));
        }

        function draw() {
            if (!w || !h) return;
            ctx.clearRect(0, 0, w, h);
            if (pts.length < 3) return;

            drawGrid();

            /* ── the ghost, first and furthest back ──────────────
               One flat colour, no glow, no fill. It only has to be
               something for the front line to sit in front of. */
            if (ghost.length > 2) {
                ctx.beginPath();
                ctx.moveTo(X(ghost.length - 1), (1 - ghost[ghost.length - 1]) * h);
                for (var gi = ghost.length - 2; gi >= 0; gi--) {
                    ctx.lineTo(X(gi), (1 - ghost[gi]) * h);
                }
                ctx.strokeStyle = rgba(UP, 0.10 * ALPHA);
                ctx.lineWidth = 1.5;
                ctx.lineJoin = 'round';
                ctx.stroke();
            }

            var rs = runs(), r, k, col;
            var head = pts[0] >= pts[1] ? UP : DOWN;

            /* The area under the whole line, drawn once so the fills of
               adjacent runs cannot seam against each other. Two stops near
               the top make the falloff quicker than a straight ramp, which
               keeps the middle of the page clear for the content. */
            ctx.beginPath();
            ctx.moveTo(X(pts.length - 1), h);
            for (k = pts.length - 1; k >= 0; k--) ctx.lineTo(X(k), Y(k));
            ctx.lineTo(X(0), h);
            ctx.closePath();
            var lift = ctx.createLinearGradient(0, 0, 0, h);
            lift.addColorStop(0,    rgba(head, 0.20 * ALPHA));
            lift.addColorStop(0.45, rgba(head, 0.05 * ALPHA));
            lift.addColorStop(1,    rgba(head, 0));
            ctx.fillStyle = lift;
            ctx.fill();

            ctx.lineJoin = 'round';     // a rounded corner reads calmer than a mitred one
            ctx.lineCap = 'round';

            /* Glow in two soft passes rather than one hard shadowBlur. A wide,
               very faint stroke plus a narrower brighter one gives a falloff
               that looks lit; a single blurred stroke looks smeared. */
            ctx.globalCompositeOperation = 'lighter';
            for (k = 0; k < rs.length; k++) {
                r = rs[k]; col = r.dir > 0 ? UP : DOWN;
                tracePath(r.idx);
                ctx.strokeStyle = rgba(col, 0.055 * ALPHA);
                ctx.lineWidth = 18;
                ctx.stroke();
            }
            for (k = 0; k < rs.length; k++) {
                r = rs[k]; col = r.dir > 0 ? UP : DOWN;
                tracePath(r.idx);
                ctx.strokeStyle = rgba(col, 0.14 * ALPHA);
                ctx.lineWidth = 7;
                ctx.stroke();
            }
            ctx.globalCompositeOperation = 'source-over';

            // the line itself
            for (k = 0; k < rs.length; k++) {
                r = rs[k]; col = r.dir > 0 ? UP : DOWN;
                tracePath(r.idx);
                ctx.strokeStyle = rgba(col, 0.92 * ALPHA);
                ctx.lineWidth = 2.2;
                ctx.stroke();
            }

            // the leading edge: a lit dot where the price is now, breathing
            var hx = X(0), hy = Y(0);
            var pulse = 0.5 + 0.5 * Math.sin(beat);
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath(); ctx.arc(hx, hy, 26, 0, Math.PI * 2);
            ctx.fillStyle = rgba(head, 0.05 * ALPHA); ctx.fill();
            ctx.beginPath(); ctx.arc(hx, hy, 11, 0, Math.PI * 2);
            ctx.fillStyle = rgba(head, 0.09 * ALPHA); ctx.fill();
            // a ring that expands and fades, so the head has a heartbeat
            ctx.beginPath(); ctx.arc(hx, hy, 5 + pulse * 13, 0, Math.PI * 2);
            ctx.strokeStyle = rgba(head, 0.30 * (1 - pulse) * ALPHA);
            ctx.lineWidth = 1.4; ctx.stroke();
            ctx.beginPath(); ctx.arc(hx, hy, 3.4, 0, Math.PI * 2);
            ctx.fillStyle = rgba(head, 0.95 * ALPHA); ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
        }

        /* ── one clock ─────────────────────────────────────────
           rAF when the document is visible, an interval when it is
           not (some embedded surfaces report hidden while on
           screen and never fire rAF at all). Both land here, and
           `last` guarantees a given instant advances the scroll
           exactly once however many sources call in. */
        function advance(now) {
            if (!last) { last = now; return; }
            var dt = now - last;
            if (dt <= 0) return;
            if (dt > 250) dt = 250;              // a backgrounded tab must not lurch
            last = now;
            beat += dt / 1000 * 1.5;
            phase += dt / MS_PER_STEP;
            gridOff += (dt / MS_PER_STEP) * STEP;
            while (phase >= 1) {
                phase -= 1;
                pts.unshift(nextPoint());
                if (pts.length > need + 2) pts.length = need + 2;
                ghost.unshift(nextGhost());
                if (ghost.length > need + 2) ghost.length = need + 2;
            }
            draw();
        }

        function frame(now) {
            if (!running) return;
            advance(now);
            raf = global.requestAnimationFrame(frame);
        }

        var ro = global.ResizeObserver
            ? new ResizeObserver(function () { resize(); draw(); })
            : null;
        if (ro) ro.observe(canvas);
        else global.addEventListener('resize', function () { resize(); draw(); });

        resize();
        if (reduced) { draw(); return { stop: function () { if (ro) ro.disconnect(); } }; }

        running = true;
        raf = global.requestAnimationFrame(frame);
        timer = setInterval(function () {
            if (!running) return;
            var now = (global.performance || Date).now();
            // only step in if rAF has gone quiet — otherwise this is a no-op
            if (now - last > 120) advance(now);
        }, 60);

        return {
            stop: function () {
                running = false;
                global.cancelAnimationFrame(raf);
                clearInterval(timer);
                if (ro) ro.disconnect();
            },
            _state: function () { return { w: w, h: h, pts: pts.length, phase: phase }; }
        };
    }

    function auto() {
        var el = document.querySelector('canvas.ft-backdrop');
        if (!el) return;
        var a = Number(el.dataset.alpha);
        global.FTBackdrop.instance = start(el, { alpha: isFinite(a) && a > 0 ? a : undefined });
    }

    global.FTBackdrop = { start: start, instance: null };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', auto);
    } else { auto(); }
})(typeof window !== 'undefined' ? window : this);
