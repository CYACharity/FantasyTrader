/* ============================================================
 *  THE PRACTICE FLOOR — a lit trading room, drawn on a canvas.
 *
 *      <canvas class="ft-scene" aria-hidden="true"></canvas>
 *
 *  The same room the CSS version sketched — a floor grid running
 *  to a horizon, a rising chart above it, a tape along the bottom
 *  — but rendered properly, in one canvas, back to front:
 *
 *    1. the sky: a dark gradient lifting toward the horizon, and
 *       three soft washes of colour drifting slowly across it
 *    2. a skyline of candlesticks sitting on the horizon, scrolling
 *       left, with a faint reflection on the floor
 *    3. the horizon itself: a bright seam with a bloom that bleeds
 *       up into the sky and down onto the floor
 *    4. motes of light rising off the floor, twinkling as they go
 *    5. a true perspective floor — lines converging on the
 *       vanishing point, running toward you, fading with depth
 *    6. the hero chart: drawn in once on arrival with a glowing
 *       head, then steady — the last price ticks, and nothing pulses:
 *       no travelling light, no ring, no breathing horizon
 *       runs along the line every few seconds, and the line is
 *       reflected in the floor
 *    7. an amber tape along the bottom, looping seamlessly
 *    8. a vignette and a whisper of film grain, cached, which is
 *       what keeps the big gradients from banding
 *
 *  Everything static is painted once per resize into offscreen
 *  layers; each frame only draws what moves. Glow is built from
 *  layered strokes under 'lighter' rather than shadowBlur, which
 *  is far cheaper at full-screen size.
 *
 *  One clock drives it. rAF when the page is visible; an interval
 *  only if rAF never runs (some embedded views report themselves
 *  hidden while on screen). Every frame is a pure function of the
 *  elapsed time, so two sources calling in at once just redraw the
 *  same picture — nothing double-steps. Reduced motion gets one
 *  finished still frame.
 * ============================================================ */
(function (global) {
    'use strict';

    const SAGE = [92, 184, 138], MINT = [123, 211, 166], HONEY = [224, 162, 76], RED = [217, 100, 92];
    const rgba = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a <= 0 ? 0 : a >= 1 ? 1 : a.toFixed(4)) + ')';
    const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
    const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
    const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const TAU = Math.PI * 2;

    function rng(seed) {
        return function () {
            seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    // a soft round wash, rendered once and scaled up — a radial gradient
    // redrawn full-screen every frame costs far more than a stretched image
    function blob(color, alpha) {
        const c = document.createElement('canvas');
        c.width = c.height = 256;
        const g = c.getContext('2d');
        const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        gr.addColorStop(0, rgba(color, alpha));
        gr.addColorStop(0.45, rgba(color, alpha * 0.36));
        gr.addColorStop(1, rgba(color, 0));
        g.fillStyle = gr;
        g.fillRect(0, 0, 256, 256);
        return c;
    }

    function start(canvas, opts) {
        opts = opts || {};
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return null;
        const reduced = !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
        const rand = rng(opts.seed != null ? opts.seed : (Date.now() % 2147483647));

        let w = 0, h = 0, dpr = 1, horizon = 0, vpX = 0;
        let bg = null, fg = null, vGrad = null, vGlow = null;
        const nebA = blob(SAGE, 0.24), nebB = blob(HONEY, 0.17), nebC = blob(MINT, 0.10);

        /* ── the hero chart ─────────────────────────────────────
           A walk pulled toward a rising curve, so it always reads as
           a bull run while still looking like a price rather than a
           drawing of one. Values are heights, 0..1 within its band. */
        const HN = 64, HEAD = HN - 1;
        const heroBase = (function () {
            const a = [];
            let v = 0.16;
            for (let i = 0; i < HN; i++) {
                const k = i / (HN - 1);
                const trend = 0.10 + 0.74 * Math.pow(k, 1.2);
                v += (rand() - 0.5) * 0.14;
                v = v * 0.58 + trend * 0.42;
                a.push(clamp(v, 0.03, 0.97));
            }
            for (let pass = 0; pass < 2; pass++) {
                for (let i = 1; i < HN - 1; i++) a[i] = (a[i - 1] + 2 * a[i] + a[i + 1]) / 4;
            }
            return a;
        })();
        const heroV = heroBase.slice();
        const tick = { from: heroV[HEAD], to: heroV[HEAD], t0: 0, next: 3.6, done: true };
        let heroPath = null, heroFill = null, samples = [], heroLen = 0;
        /* The area under the chart is painted into its own layer and faded at
           both ends. Filled straight onto the canvas it ended in a hard
           vertical edge under the head, running down to the horizon — the
           polygon has to close somewhere, and closing it in view showed. */
        const fillLayer = document.createElement('canvas');
        const fillCtx = fillLayer.getContext('2d');

        function heroPoint(i) {
            const top = h * 0.15, bot = h * 0.50;
            // the head stops short of the right edge so its light is always on screen
            return [-w * 0.02 + w * 0.95 * (i / (HN - 1)), bot - (bot - top) * heroV[i]];
        }

        function buildHero() {
            const P = [];
            for (let i = 0; i < HN; i++) P.push(heroPoint(i));
            const path = new Path2D();
            path.moveTo(P[0][0], P[0][1]);
            const S = [[P[0][0], P[0][1], 0]];
            let L = 0;
            for (let i = 0; i < HN - 1; i++) {
                const p0 = P[i ? i - 1 : 0], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2 < HN ? i + 2 : HN - 1];
                const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
                const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
                path.bezierCurveTo(c1x, c1y, c2x, c2y, p2[0], p2[1]);
                // sample the curve so a distance along it can be turned into a point
                let px = p1[0], py = p1[1];
                for (let s = 1; s <= 8; s++) {
                    const t = s / 8, m = 1 - t;
                    const x = m * m * m * p1[0] + 3 * m * m * t * c1x + 3 * m * t * t * c2x + t * t * t * p2[0];
                    const y = m * m * m * p1[1] + 3 * m * m * t * c1y + 3 * m * t * t * c2y + t * t * t * p2[1];
                    L += Math.hypot(x - px, y - py);
                    S.push([x, y, L]);
                    px = x; py = y;
                }
            }
            heroPath = path; samples = S; heroLen = L;
            const f = new Path2D(path);
            f.lineTo(P[HN - 1][0], horizon);
            f.lineTo(P[0][0], horizon);
            f.closePath();
            heroFill = f;
            paintFill(P[0][0], P[HN - 1][0]);
        }

        function paintFill(x0, x1) {
            const W = Math.max(1, Math.round(w * dpr)), H = Math.max(1, Math.round(h * dpr));
            if (fillLayer.width !== W || fillLayer.height !== H) { fillLayer.width = W; fillLayer.height = H; }
            const g = fillCtx;
            g.setTransform(1, 0, 0, 1, 0, 0);
            g.globalCompositeOperation = 'source-over';
            g.clearRect(0, 0, W, H);
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
            const v = g.createLinearGradient(0, h * 0.15, 0, horizon);
            v.addColorStop(0, rgba(SAGE, 0.32));
            v.addColorStop(0.6, rgba(SAGE, 0.08));
            v.addColorStop(1, rgba(SAGE, 0));
            g.fillStyle = v;
            g.fill(heroFill);
            // keep only the middle: fade in from the left, out before the head
            g.globalCompositeOperation = 'destination-in';
            const span = Math.max(1, x1 - x0);
            const m = g.createLinearGradient(x0, 0, x1, 0);
            m.addColorStop(0, 'rgba(0,0,0,0)');
            m.addColorStop(0.14, 'rgba(0,0,0,1)');
            m.addColorStop(Math.max(0.15, 1 - (w * 0.16) / span), 'rgba(0,0,0,1)');
            m.addColorStop(1, 'rgba(0,0,0,0)');
            g.fillStyle = m;
            g.fillRect(0, 0, w, h);
            g.globalCompositeOperation = 'source-over';
        }

        function atLen(d) {
            const S = samples;
            if (!S.length) return [0, 0];
            if (d <= 0) return [S[0][0], S[0][1]];
            if (d >= heroLen) { const e = S[S.length - 1]; return [e[0], e[1]]; }
            let lo = 0, hi = S.length - 1;
            while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m][2] < d) lo = m; else hi = m; }
            const a = S[lo], b = S[hi], k = (d - a[2]) / ((b[2] - a[2]) || 1);
            return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
        }

        /* ── the skyline ────────────────────────────────────────
           170 candles on a seamless loop: the tail of the walk is eased
           back to its head, so the wrap never shows a step. */
        const CW = 16, LOOP = CW * 170;
        const candles = (function () {
            const n = LOOP / CW, vals = [];
            let v = 0.5;
            for (let i = 0; i < n; i++) {
                v += (rand() - 0.5) * 0.18;
                v += (0.5 - v) * 0.07;
                vals.push(clamp(v, 0.06, 0.96));
            }
            for (let i = 0; i < 28; i++) {
                const k = i / 27;
                vals[n - 28 + i] = vals[n - 28 + i] * (1 - k) + vals[0] * k;
            }
            return vals.map((c, i) => {
                const o = vals[(i - 1 + n) % n];
                return {
                    x: i * CW, o, c,
                    hi: clamp(Math.max(o, c) + rand() * 0.08, 0, 1),
                    lo: clamp(Math.min(o, c) - rand() * 0.08, 0, 1),
                };
            });
        })();

        /* ── the motes ──────────────────────────────────────────── */
        let motes = [];
        function spawn(m, anywhere) {
            m.x = rand() * w;
            m.y = anywhere ? rand() * horizon : horizon - rand() * h * 0.05;
            m.vy = 5 + rand() * 13;
            m.vx = (rand() - 0.5) * 4;
            m.r = 0.5 + rand() * 1.4;
            m.ph = rand() * TAU;
            m.sp = 1.2 + rand() * 2.2;
            const k = rand();
            m.c = k < 0.14 ? HONEY : k < 0.55 ? MINT : SAGE;
            m.a = 0.32 + rand() * 0.55;
            return m;
        }

        /* ── the tape: a sum of whole-number harmonics loops for free ── */
        const TAPE = [[1, 0.20], [2, 0.12], [3, 0.08], [5, 0.05], [9, 0.03], [14, 0.018]]
            .map(([k, a]) => [k, a, rand() * TAU]);
        function tapeAt(u) {
            let v = 0.5;
            for (const [k, a, p] of TAPE) v += a * Math.sin(TAU * k * u + p);
            return clamp(v, 0, 1);
        }

        /* ── cached layers ──────────────────────────────────────── */
        function layer() {
            const c = document.createElement('canvas');
            c.width = Math.max(1, Math.round(w * dpr));
            c.height = Math.max(1, Math.round(h * dpr));
            const g = c.getContext('2d');
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
            return [c, g];
        }

        function paintBg() {
            const [c, g] = layer();
            const hz = horizon / h;
            const base = g.createLinearGradient(0, 0, 0, h);
            base.addColorStop(0, '#0c0a08');
            base.addColorStop(hz * 0.72, '#14100e');
            base.addColorStop(hz, '#1b1713');
            base.addColorStop(Math.min(1, hz + 0.015), '#13100d');
            base.addColorStop(1, '#0b0907');
            g.fillStyle = base;
            g.fillRect(0, 0, w, h);
            // the sky lifts toward the horizon
            g.save();
            g.translate(vpX, horizon);
            g.scale(w * 0.62, h * 0.52);
            const sky = g.createRadialGradient(0, 0, 0, 0, 0, 1);
            sky.addColorStop(0, rgba(SAGE, 0.13));
            sky.addColorStop(0.5, rgba(SAGE, 0.04));
            sky.addColorStop(1, rgba(SAGE, 0));
            g.fillStyle = sky;
            g.fillRect(-1, -1, 2, 1);
            g.restore();
            return c;
        }

        function paintFg() {
            const [c, g] = layer();
            g.save();
            g.translate(w / 2, h * 0.46);
            g.scale(w * 0.74, h * 0.80);
            const v = g.createRadialGradient(0, 0, 0.32, 0, 0, 1);
            v.addColorStop(0, 'rgba(6,5,4,0)');
            v.addColorStop(1, 'rgba(6,5,4,0.66)');
            g.fillStyle = v;
            g.fillRect(-2, -2, 4, 4);
            g.restore();
            const b = g.createLinearGradient(0, h * 0.74, 0, h);
            b.addColorStop(0, 'rgba(11,9,7,0)');
            b.addColorStop(1, 'rgba(11,9,7,0.5)');
            g.fillStyle = b;
            g.fillRect(0, h * 0.74, w, h * 0.26);
            // grain, split light and dark so it adds texture without lifting the blacks
            const n = document.createElement('canvas');
            n.width = n.height = 160;
            const nx = n.getContext('2d');
            const img = nx.createImageData(160, 160);
            for (let i = 0; i < img.data.length; i += 4) {
                const light = rand() < 0.5;
                img.data[i] = img.data[i + 1] = img.data[i + 2] = light ? 255 : 0;
                img.data[i + 3] = (rand() * 9) | 0;
            }
            nx.putImageData(img, 0, 0);
            g.fillStyle = g.createPattern(n, 'repeat');
            g.fillRect(0, 0, w, h);
            return c;
        }

        function resize() {
            const cw = canvas.clientWidth, ch = canvas.clientHeight;
            if (!cw || !ch) return false;
            dpr = Math.min(opts.maxDpr || 1.5, global.devicePixelRatio || 1);
            w = cw; h = ch;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            horizon = Math.round(h * 0.60);
            vpX = w / 2;
            bg = paintBg();
            fg = paintFg();
            vGrad = ctx.createLinearGradient(0, horizon, 0, h);
            vGrad.addColorStop(0, rgba(SAGE, 0));
            vGrad.addColorStop(0.16, rgba(SAGE, 0.09));
            vGrad.addColorStop(0.7, rgba(SAGE, 0.28));
            vGrad.addColorStop(1, rgba(SAGE, 0.36));
            vGlow = ctx.createLinearGradient(0, horizon, 0, h);
            vGlow.addColorStop(0, rgba(SAGE, 0));
            vGlow.addColorStop(0.5, rgba(SAGE, 0.03));
            vGlow.addColorStop(1, rgba(SAGE, 0.065));
            buildHero();
            const want = Math.round(clamp(w * h / 17000, 48, 160));
            while (motes.length < want) motes.push(spawn({}, true));
            motes.length = want;
            return true;
        }

        /* ── drawing ────────────────────────────────────────────── */
        function ellipse(cx, cy, rx, ry, col, a, upOnly) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(rx, ry);
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
            g.addColorStop(0, rgba(col, a));
            g.addColorStop(1, rgba(col, 0));
            ctx.fillStyle = g;
            ctx.fillRect(-1, -1, 2, upOnly ? 1 : 2);
            ctx.restore();
        }

        function glowDot(x, y, r, col, a) {
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, rgba(col, a));
            g.addColorStop(1, rgba(col, 0));
            ctx.fillStyle = g;
            ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }

        function drawSky(t) {
            ctx.globalCompositeOperation = 'lighter';
            const R = Math.max(w, h);
            let x = w * 0.16 + Math.sin(t / 34) * w * 0.05, y = h * 0.10 + Math.cos(t / 29) * h * 0.05;
            ctx.drawImage(nebA, x - R * 0.55, y - R * 0.55, R * 1.1, R * 1.1);
            x = w * 0.88 + Math.sin(t / 41 + 2) * w * 0.05; y = h * 0.86 + Math.cos(t / 37) * h * 0.04;
            ctx.drawImage(nebB, x - R * 0.48, y - R * 0.48, R * 0.96, R * 0.96);
            x = w * 0.62 + Math.sin(t / 53 + 4) * w * 0.08; y = h * 0.30;
            ctx.drawImage(nebC, x - R * 0.38, y - R * 0.38, R * 0.76, R * 0.76);
            ctx.globalCompositeOperation = 'source-over';
        }

        function drawSkyline(t) {
            const H = h * 0.17, base = horizon - 3;
            const off = (t * 7) % LOOP;
            const bw = CW * 0.54, bx = (CW - bw) / 2;
            for (let rep = 0; rep * LOOP - off < w + CW; rep++) {
                for (let i = 0; i < candles.length; i++) {
                    const cd = candles[i];
                    const x = cd.x - off + rep * LOOP;
                    if (x < -CW || x > w + CW) continue;
                    const edge = smooth(0, w * 0.14, x) * smooth(w, w * 0.86, x);
                    if (edge < 0.01) continue;
                    const col = cd.c >= cd.o ? SAGE : RED;
                    const yO = base - cd.o * H, yC = base - cd.c * H;
                    const yH = base - cd.hi * H, yL = base - cd.lo * H;
                    const top = Math.min(yO, yC), hgt = Math.max(1, Math.abs(yC - yO));
                    ctx.fillStyle = rgba(col, 0.28 * edge);
                    ctx.fillRect(x + CW / 2 - 0.5, yH, 1, yL - yH);
                    ctx.fillStyle = rgba(col, 0.21 * edge);
                    ctx.fillRect(x + bx, top, bw, hgt);
                    ctx.fillStyle = rgba(col, 0.58 * edge);
                    ctx.fillRect(x + bx, top, bw, 1);
                    // its reflection, squashed into the floor
                    const dBot = base - (top + hgt);
                    ctx.fillStyle = rgba(col, 0.075 * edge);
                    ctx.fillRect(x + bx, horizon + 3 + dBot * 0.35, bw, hgt * 0.35);
                }
            }
        }

        /* Faint price levels behind the chart, with their values at the left
           edge. They are what make the sky read as a chart area rather than
           an empty gradient, and they stay far enough back to never compete
           with the content. */
        function drawLevels() {
            const top = h * 0.15, bot = h * 0.50, n = 4;
            ctx.save();
            ctx.setLineDash([2, 7]);
            ctx.lineWidth = 1;
            ctx.font = '600 10px Inter, system-ui, sans-serif';
            ctx.textBaseline = 'middle';
            for (let i = 0; i <= n; i++) {
                const y = bot - (bot - top) * (i / n);
                const g = ctx.createLinearGradient(0, 0, w, 0);
                g.addColorStop(0, rgba(SAGE, 0));
                g.addColorStop(0.08, rgba(SAGE, 0.09));
                g.addColorStop(0.92, rgba(SAGE, 0.09));
                g.addColorStop(1, rgba(SAGE, 0));
                ctx.strokeStyle = g;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
                ctx.fillStyle = rgba(SAGE, 0.26);
                ctx.fillText('$' + (9000 + i * 1500).toLocaleString('en-US'), 22, y - 8);
            }
            ctx.restore();
        }

        function drawHorizon(t) {
            const b = 1;   // steady: the horizon used to breathe, which read as pulsing
            ctx.globalCompositeOperation = 'lighter';
            ellipse(vpX, horizon, w * 0.56, h * 0.25, SAGE, 0.07 * b, true);     // bleeding up into the sky
            ellipse(vpX, horizon, w * 0.46, h * 0.045, MINT, 0.24 * b, false);   // the bloom on the seam
            const g = ctx.createLinearGradient(0, 0, w, 0);
            g.addColorStop(0, rgba(SAGE, 0));
            g.addColorStop(0.16, rgba(SAGE, 0.05));
            g.addColorStop(0.5, rgba(MINT, 0.95 * b));
            g.addColorStop(0.84, rgba(SAGE, 0.05));
            g.addColorStop(1, rgba(SAGE, 0));
            ctx.fillStyle = g;
            ctx.fillRect(0, horizon - 0.75, w, 1.5);
            ctx.globalCompositeOperation = 'source-over';
        }

        function drawMotes(t, dt) {
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < motes.length; i++) {
                const m = motes[i];
                if (dt) {
                    m.y -= m.vy * dt;
                    m.x += m.vx * dt;
                    if (m.y < -6 || m.x < -6 || m.x > w + 6) spawn(m, false);
                }
                const life = smooth(-4, h * 0.14, m.y) * smooth(horizon + 2, horizon - h * 0.10, m.y);
                const a = m.a * life * (0.55 + 0.45 * Math.sin(t * m.sp + m.ph));
                if (a < 0.01) continue;
                ctx.fillStyle = rgba(m.c, a * 0.16);
                ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 3.4, 0, TAU); ctx.fill();
                ctx.fillStyle = rgba(m.c, a);
                ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, TAU); ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        function revealAt(t) { return reduced ? 1 : easeInOut(clamp((t - 0.3) / 2.6, 0, 1)); }
        function dash(rv) {
            if (rv >= 1) ctx.setLineDash([]);
            else ctx.setLineDash([heroLen * rv, heroLen * 2]);
            ctx.lineDashOffset = 0;
        }

        /* A world-space floor: a line at depth z sits at horizon + K / z.
           Moving every line toward you by the same z each second is what
           makes the spacing open up as they approach, the way a real
           floor does — no easing curve fakes that as well. */
        function drawFloor(t, rv) {
            const fh = h - horizon, K = fh * 1.1, zFar = 30;
            const off = reduced ? 0.35 : (t * 0.9) % 1;
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, horizon + 1, w, fh);
            ctx.clip();

            ctx.globalCompositeOperation = 'lighter';
            ellipse(vpX, horizon, w * 0.6, fh * 0.9, SAGE, 0.055, false);
            ctx.globalCompositeOperation = 'source-over';

            ctx.lineWidth = 1;
            for (let i = 0; i < 64; i++) {
                const z = 1 + i - off;
                if (z > zFar) break;
                if (z < 0.5) continue;
                const y = horizon + K / z;
                if (y > h + 1) continue;
                const d = (y - horizon) / fh;
                const a = 0.36 * smooth(0.012, 0.3, d) * (0.5 + 0.5 * d);
                if (a < 0.004) continue;
                ctx.strokeStyle = rgba(SAGE, a);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            const zB = K / fh, gx = w * 0.085;
            const N = Math.ceil((w / 2) / (gx / zB)) + 3;
            ctx.beginPath();
            for (let i = -N; i <= N; i++) {
                ctx.moveTo(vpX + i * gx / zFar, horizon + K / zFar);
                ctx.lineTo(vpX + i * gx / zB, h);
            }
            ctx.strokeStyle = vGrad;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = vGlow;
            ctx.lineWidth = 4;
            ctx.stroke();

            // the chart, reflected in the floor
            if (rv > 0) {
                ctx.save();
                ctx.transform(1, 0, 0, -0.42, 0, horizon * 1.42);
                const rg = ctx.createLinearGradient(0, horizon, 0, h * 0.14);
                rg.addColorStop(0, rgba(MINT, 0.15));
                rg.addColorStop(1, rgba(MINT, 0));
                ctx.strokeStyle = rg;
                ctx.lineWidth = 7;
                dash(rv);
                ctx.stroke(heroPath);
                ctx.setLineDash([]);
                ctx.restore();
            }
            ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
        }

        // the head of the chart ticks like a live price once it has arrived
        function tickHead(t) {
            /* The tip used to tick like a live price, nudging the end of the
               line every couple of seconds. It read as a wiggle, so the line
               is drawn once and then holds still. */
            return;
            if (reduced || revealAt(t) < 1) return;
            if (t >= tick.next) {
                tick.from = heroV[HEAD];
                tick.to = clamp(heroBase[HEAD] + (rand() - 0.45) * 0.10, 0.05, 0.99);
                tick.t0 = t;
                tick.next = t + 1.3 + rand() * 1.4;
                tick.done = false;
            }
            if (tick.done) return;
            const k = clamp((t - tick.t0) / 0.7, 0, 1);
            const v = tick.from + (tick.to - tick.from) * easeInOut(k);
            const dv = v - heroBase[HEAD];
            heroV[HEAD] = v;
            heroV[HEAD - 1] = heroBase[HEAD - 1] + dv * 0.45;
            heroV[HEAD - 2] = heroBase[HEAD - 2] + dv * 0.15;
            buildHero();
            if (k >= 1) tick.done = true;
        }

        function drawHero(t) {
            const rv = revealAt(t);
            if (rv <= 0) return;
            const head = atLen(heroLen * rv);

            const fillA = reduced ? 1 : smooth(1.6, 3.4, t);
            if (fillA > 0) {
                ctx.save();
                if (rv < 1) { ctx.beginPath(); ctx.rect(0, 0, head[0], h); ctx.clip(); }
                ctx.globalAlpha = fillA;
                ctx.drawImage(fillLayer, 0, 0, w, h);
                ctx.restore();
            }

            const sg = ctx.createLinearGradient(0, 0, w * 0.93, 0);
            sg.addColorStop(0, rgba(SAGE, 0));
            sg.addColorStop(0.10, rgba(SAGE, 0.55));
            sg.addColorStop(0.75, rgba(SAGE, 0.95));
            sg.addColorStop(1, rgba(MINT, 1));
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = sg;
            ctx.globalCompositeOperation = 'lighter';
            const passes = [[20, 0.055], [10, 0.11], [4.2, 0.34]];
            for (let i = 0; i < passes.length; i++) {
                ctx.globalAlpha = passes[i][1];
                ctx.lineWidth = passes[i][0];
                dash(rv);
                ctx.stroke(heroPath);
            }
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = 2.2;
            dash(rv);
            ctx.stroke(heroPath);
            ctx.setLineDash([]);

            ctx.globalCompositeOperation = 'lighter';
            // the head
            glowDot(head[0], head[1], 32, MINT, 0.30);
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#F4EEE6';
            ctx.beginPath();
            ctx.arc(head[0], head[1], 3.4, 0, TAU);
            ctx.fill();
        }

        function drawTape(t) {
            const top = h * 0.84, bot = h * 0.975, span = w * 2.4;
            const shift = reduced ? 0 : t / 80;
            const path = new Path2D();
            let first = true;
            for (let x = -6; x <= w + 6; x += 6) {
                const u = ((x / span + shift) % 1 + 1) % 1;
                const y = bot - (bot - top) * tapeAt(u);
                if (first) { path.moveTo(x, y); first = false; } else path.lineTo(x, y);
            }
            const fill = new Path2D(path);
            fill.lineTo(w + 6, h);
            fill.lineTo(-6, h);
            fill.closePath();
            const fgd = ctx.createLinearGradient(0, top, 0, h);
            fgd.addColorStop(0, rgba(HONEY, 0.085));
            fgd.addColorStop(1, rgba(HONEY, 0));
            ctx.fillStyle = fgd;
            ctx.fill(fill);
            const eg = ctx.createLinearGradient(0, 0, w, 0);
            eg.addColorStop(0, rgba(HONEY, 0));
            eg.addColorStop(0.14, rgba(HONEY, 0.5));
            eg.addColorStop(0.86, rgba(HONEY, 0.5));
            eg.addColorStop(1, rgba(HONEY, 0));
            ctx.strokeStyle = eg;
            ctx.lineJoin = 'round';
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.14;
            ctx.lineWidth = 7;
            ctx.stroke(path);
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1.5;
            ctx.stroke(path);
            ctx.globalCompositeOperation = 'source-over';
        }

        function render(t, dt) {
            if (!w && !resize()) return;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
            ctx.drawImage(bg, 0, 0, w, h);
            drawSky(t);
            drawLevels();
            drawSkyline(t);
            drawHorizon(t);
            drawMotes(t, dt);
            tickHead(t);
            drawFloor(t, revealAt(t));
            drawHero(t);
            drawTape(t);
            ctx.drawImage(fg, 0, 0, w, h);
            frames++;
        }

        /* ── one clock ──────────────────────────────────────────── */
        let t0 = 0, prevT = 0, last = 0, raf = 0, timer = 0, running = false, rafSeen = false, frames = 0;
        function frame(now) {
            const t = (now - t0) / 1000;
            const dt = prevT ? clamp(t - prevT, 0, 0.1) : 0;
            prevT = Math.max(prevT, t);
            last = now;
            render(t, dt);
        }
        function loop(now) {
            if (!running) return;
            rafSeen = true;
            frame(now);
            raf = global.requestAnimationFrame(loop);
        }

        const ro = global.ResizeObserver ? new ResizeObserver(() => {
            if (resize()) render(reduced ? 6 : prevT || 0, 0);
        }) : null;
        if (ro) ro.observe(canvas);
        else global.addEventListener('resize', () => { if (resize()) render(prevT || 0, 0); });

        resize();
        t0 = (global.performance || Date).now();
        if (reduced) {
            render(6, 0);
        } else {
            running = true;
            raf = global.requestAnimationFrame(loop);
            timer = setInterval(() => {
                if (!running) return;
                // a genuinely hidden tab stops rAF too; don't keep drawing it in the background
                if (rafSeen && document.visibilityState === 'hidden') return;
                const now = (global.performance || Date).now();
                if (now - last > 120) frame(now);
            }, 50);
        }

        return {
            stop() {
                running = false;
                global.cancelAnimationFrame(raf);
                clearInterval(timer);
                if (ro) ro.disconnect();
            },
            _state() {
                return { w, h, dpr, horizon, heroLen: Math.round(heroLen), motes: motes.length, frames, t: +prevT.toFixed(2) };
            },
            _renderAt(t) { render(t, 0); },
        };
    }

    function auto() {
        const el = document.querySelector('canvas.ft-scene');
        if (el) global.FTPracticeScene.instance = start(el);
    }
    global.FTPracticeScene = { start, instance: null };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto);
    else auto();
})(typeof window !== 'undefined' ? window : this);
