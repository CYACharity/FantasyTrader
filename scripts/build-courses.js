/* Build js/ft-courses.js from the 60 module pages.
 *
 * Everything it emits is lifted from the modules themselves — headings,
 * topic sentences, quiz questions and their data-why explanations. Nothing
 * is paraphrased, because the whole point is that Rally teaches the course
 * the user already wrote, not a re-description of it.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2];

const TRACKS = [
    { key: 'beginner',     name: 'Beginner',            color: ['#5CB88A', '#3E8C65'], n: 6 },
    { key: 'intermediate', name: 'Intermediate',        color: ['#E0A24C', '#B37C33'], n: 6 },
    { key: 'advanced',     name: 'Advanced',            color: ['#D9645C', '#A6443D'], n: 6 },
    { key: 'master',       name: 'Master',              color: ['#A98BD0', '#7B5FA6'], n: 6 },
    { key: 'investing',    name: 'Investing',           color: ['#9DB8D2', '#5C7691'], n: 18 },
    { key: 'alternatives', name: 'Alternatives',        color: ['#7BD3A6', '#3E8C65'], n: 18 },
];

/* ── html helpers ─────────────────────────────────────────── */
const ENT = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
    '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–', '&hellip;': '…',
    '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”',
    '&times;': '×', '&asymp;': '≈', '&ge;': '≥', '&le;': '≤',
    '&deg;': '°', '&plusmn;': '±', '&frac12;': '½', '&minus;': '−',
};
function text(html) {
    if (html == null) return '';
    let t = String(html)
        .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
        .replace(/<[^>]+>/g, ' ');
    t = t.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));
    Object.keys(ENT).forEach(k => { t = t.split(k).join(ENT[k]); });
    return t.replace(/\s+/g, ' ').trim();
}

/* First sentence or two, capped — the modules open each section with a
   topic sentence, which is exactly what a concept card wants. */
function lead(paragraph, cap = 190) {
    const t = text(paragraph);
    if (!t) return '';
    const parts = t.match(/[^.!?]+[.!?]+/g);
    if (!parts) return t.slice(0, cap);
    let out = parts[0].trim();
    if (out.length < 95 && parts[1]) out += ' ' + parts[1].trim();
    if (out.length > cap) {
        const cut = out.slice(0, cap);
        const back = cut.lastIndexOf(' ');
        out = (back > 60 ? cut.slice(0, back) : cut).replace(/[,;:\s]+$/, '') + '…';
    }
    return out;
}

/* ── art picker ───────────────────────────────────────────── */
const ART = [
    [/\b(bond|treasur|yield|coupon|fixed income|credit)\b/i, 'bond'],
    [/\b(divers|allocat|portfolio|spread|basket|index|etf)\b/i, 'diversify'],
    [/\b(risk|ruin|loss|drawdown|volatil|danger|leverage|margin)\b/i, 'risk'],
    [/\b(compound|long.?term|decade|time|growth|retire)\b/i, 'compound'],
    [/\b(dividend|payout|income|cash flow)\b/i, 'dividend'],
    [/\b(chart|candle|technical|pattern|trend|support|resistance)\b/i, 'candles'],
    [/\b(valuat|p\/e|price|multiple|worth|intrinsic|fair value)\b/i, 'scale'],
    [/\b(market|exchange|trading|liquid|order|broker)\b/i, 'market'],
    [/\b(supply|demand|buyer|seller|bid|ask)\b/i, 'supply'],
    [/\b(psycholog|bias|emotion|behavio|fear|greed|discipline|mistake)\b/i, 'warning'],
    [/\b(balance|weigh|tradeoff|trade-off|versus|compare)\b/i, 'balance'],
    [/\b(shield|hedge|protect|insur|safe|defen)\b/i, 'shield'],
    [/\b(clock|timing|when|horizon|patience|hold)\b/i, 'clock'],
    [/\b(earnings|profit|revenue|report|fundament|analys)\b/i, 'growth'],
    [/\b(wallet|money|cash|capital|save|fund)\b/i, 'wallet'],
    [/\b(goal|target|strateg|plan|objective)\b/i, 'target'],
];
function artFor(s) {
    for (const [re, key] of ART) if (re.test(s)) return key;
    return 'book';
}

/* ── one module ───────────────────────────────────────────── */
function parseModule(file, track, n) {
    const raw = fs.readFileSync(file, 'utf8');
    const body = raw.slice(raw.indexOf('<body'));

    const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(body);
    const title = h1 ? text(h1[1]) : (track.name + ' module ' + n);

    const subEl = /<p class="(?:lede|lead|subtitle|module-sub)"[^>]*>([\s\S]*?)<\/p>/i.exec(body);
    const blurb = subEl ? lead(subEl[1], 110) : '';

    /* ---- teach cards: each h2 plus the topic sentence under it ---- */
    const teach = [];
    const secRe = /<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2|<div class="quiz-section|$)/g;
    let m;
    while ((m = secRe.exec(body)) !== null) {
        const heading = text(m[1]);
        if (!heading || /check your understanding|key takeaway|summary|what.s next/i.test(heading)) continue;
        const pm = /<p[^>]*>([\s\S]*?)<\/p>/.exec(m[2]);
        const t = pm ? lead(pm[1]) : '';
        if (!t || t.length < 40) continue;
        teach.push({ art: artFor(heading + ' ' + t), title: heading, text: t });
    }

    /* ---- exercises: the module's own quiz ---- */
    const exercises = [];
    /* Split on the opening tag rather than matching to a terminator. The
       lookahead version needed something specific to follow the last
       question in a file, and roughly one question per module didn't have
       it — 61 of 255 were being dropped silently. */
    const chunks = body.split(/<div class="quiz-q"/).slice(1);
    for (const chunk of chunks) {
        const head = /^([^>]*)>/.exec(chunk);
        const attrs = head ? head[1] : '';
        const pm = /<p[^>]*>([\s\S]*?)<\/p>/.exec(chunk);
        if (!pm) continue;
        m = [null, attrs, pm[1], chunk];
        const whyM = /data-why="([^"]*)"/.exec(attrs);
        const prompt = text(m[2]).replace(/^\d+\.\s*/, '');
        const opts = [];
        const oRe = /<div class="quiz-opt"[^>]*onclick="checkQuiz\(\s*\d+\s*,\s*this\s*,\s*(true|false)\s*\)"[^>]*>([\s\S]*?)<\/div>/g;
        let o;
        while ((o = oRe.exec(m[3])) !== null) {
            const t = text(o[2]);
            if (t) opts.push(o[1] === 'true' ? { text: t, correct: true } : { text: t });
        }
        if (!prompt || opts.length < 2 || !opts.some(x => x.correct)) continue;
        const ex = { type: 'choice', art: artFor(prompt), prompt, options: opts };
        if (whyM) ex.why = text(whyM[1]);
        exercises.push(ex);
    }

    return { id: track.key + '-' + n, track: track.key, n, title, blurb, teach, exercises };
}

/* ── run ──────────────────────────────────────────────────── */
const out = [];
let totalTeach = 0, totalEx = 0, missingEx = [];
TRACKS.forEach(track => {
    const lessons = [];
    for (let i = 1; i <= track.n; i++) {
        const f = path.join(ROOT, track.key + '-module-' + i + '.html');
        if (!fs.existsSync(f)) { console.error('missing file', f); continue; }
        const L = parseModule(f, track, i);
        totalTeach += L.teach.length;
        totalEx += L.exercises.length;
        if (!L.exercises.length) missingEx.push(L.id);
        lessons.push(L);
    }
    out.push({ key: track.key, name: track.name, color: track.color, lessons });
});

const banner = `/* ============================================================
 *  FT COURSES — the 60 modules, as lessons Rally can teach.
 *
 *  GENERATED FILE. Rebuilt from the module pages themselves, so
 *  every concept card and every question below is the course
 *  author's own wording — headings, topic sentences, quiz items
 *  and their data-why explanations, lifted verbatim. Nothing here
 *  is paraphrased: Rally teaches this material, he does not
 *  restate it.
 *
 *  Regenerate with scripts/build-courses.js after editing any
 *  *-module-*.html. Hand edits here will be overwritten.
 *
 *  ${out.reduce((s, t) => s + t.lessons.length, 0)} modules · ${totalTeach} concept cards · ${totalEx} questions
 * ============================================================ */
(function (global) {
    'use strict';

    const TRACKS = `;

const tail = `;

    function allCourses() {
        return TRACKS.reduce((a, t) => a.concat(t.lessons.map(l =>
            Object.assign({ trackName: t.name, color: t.color }, l))), []);
    }
    function byId(id) { return allCourses().find(c => c.id === id) || null; }
    function track(key) { return TRACKS.find(t => t.key === key) || null; }
    function stats() {
        const all = allCourses();
        return {
            tracks: TRACKS.length,
            courses: all.length,
            cards: all.reduce((s, c) => s + c.teach.length, 0),
            questions: all.reduce((s, c) => s + c.exercises.length, 0),
        };
    }

    global.FTCourses = { TRACKS, allCourses, byId, track, stats };
})(typeof window !== 'undefined' ? window : this);
`;

fs.writeFileSync(path.join(ROOT, 'js/ft-courses.js'),
    banner + JSON.stringify(out, null, 4).replace(/\n/g, '\n    ') + tail);

console.log('tracks           :', out.length);
console.log('modules          :', out.reduce((s, t) => s + t.lessons.length, 0));
console.log('concept cards    :', totalTeach);
console.log('questions        :', totalEx);
console.log('modules w/o quiz :', missingEx.length ? missingEx.join(', ') : 'none');
out.forEach(t => {
    const c = t.lessons.reduce((s, l) => s + l.teach.length, 0);
    const q = t.lessons.reduce((s, l) => s + l.exercises.length, 0);
    console.log('  ' + t.key.padEnd(13), t.lessons.length + ' modules', String(c).padStart(4) + ' cards', String(q).padStart(4) + ' questions');
});
