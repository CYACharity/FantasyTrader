/* ============================================================
 *  RALLY, ON A MODULE.
 *
 *      <script src="js/ft-rally-module.js"></script>
 *
 *  The general chat knows thirty things — P/E, ETFs, your own
 *  account. A module on DCF or the capital stack asks about
 *  things it has never heard of, so on its own he would mostly
 *  say "don't know". Here he reads the page first.
 *
 *  At load nothing happens but a bull in the corner. The first
 *  time he is asked something, the article is indexed: each <h2>
 *  section with its paragraphs, list items, table rows and
 *  captions; every bolded term with the sentence that defines
 *  it; and every quiz question with its answer and explanation.
 *
 *  From that he can:
 *    · sum the module up, section by section
 *    · explain whichever section you are scrolled to
 *    · define any bolded term, quoting the module
 *    · find the passage that answers a free question
 *    · scroll you to the part he just quoted, and light it up
 *    · quiz you on the module's own questions, grade you, and
 *      point at the section that covers anything you miss
 *    · react — once, briefly — when you answer a checkpoint
 *
 *  He never writes an answer of his own. Everything he says is
 *  quoted from the page or from the module's quiz, so he cannot
 *  be wrong in a way the module is not. When the page has
 *  nothing, he falls back to the general knowledge base, and
 *  past that he says he doesn't know.
 * ============================================================ */
(function (global) {
    'use strict';
    const doc = global.document;
    const article = doc && doc.querySelector('article.article');
    if (!article || global.__ftRallyModule) return;
    global.__ftRallyModule = true;
    global.__ftRallyCorner = true;           // this page places him; the corner script stands down

    /* ── text ────────────────────────────────────────────────── */
    const clean = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
    const STOP = new Set((
        'a an the of to in on for and or but is are was were be been being it its this that these those what ' +
        'which who whom how why when where do does did doing done can could should would will with about as at by ' +
        'from into than then there their they them you your i me my we our us so if not no yes explain tell define ' +
        'definition meaning mean means rally please whats thing things something get got just really very more most ' +
        'some any one also like module lesson section page here say says said happen happens work works way ' +
        'kind sort go goes going make makes use used using show ' +
        'read reading pick picking choose choosing learn understand know find figure need want start ' +
        'both either matter matters important difference between each other versus vs'
    ).split(' '));
    const stem = w => w.length > 4
        ? w.replace(/ies$/, 'y').replace(/sses$/, 'ss').replace(/([^s])s$/, '$1').replace(/(ing|ed)$/, '')
        : (w.length === 4 && /[^s]s$/.test(w) ? w.slice(0, 3) : w);
    function terms(s) {
        return clean(s).toLowerCase()
            .replace(/[^a-z0-9%$.\-\s]/g, ' ')
            .replace(/\.(\s|$)/g, ' ')
            .split(/\s+/)
            .filter(x => x.length > 1 && !STOP.has(x))
            .map(stem)
            .filter(x => x.length > 1 && !STOP.has(x));
    }
    // decimals ("$1.0B", "3.5%") never end a sentence: a break needs a space after the stop
    const CUT = String.fromCharCode(1);
    function sentencesOf(text) {
        return clean(text)
            .replace(/([.!?]["”’)]*)\s+(?=[A-Z0-9“"(])/g, '$1' + CUT)
            .split(CUT).map(clean).filter(Boolean);
    }
    const clip = (s, max) => {
        max = max || 420;
        if (s.length <= max) return s;
        const cut = s.lastIndexOf(' ', max - 1);
        return s.slice(0, cut > 40 ? cut : max) + '…';
    };
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const LETTERS = 'ABCDEF';

    /* ── the index ───────────────────────────────────────────── */
    // anything that is not the module's own prose
    const SKIP = '.quiz-q, .quiz-section, .quiz-opts, .ftg-checkpoint, .ftg-summary, .ftg-widget, .ftg-hud, ' +
                 '.legal-note, .article-meta, .module-label, .article-title, svg, script, style, .rm-skip';
    let IDX = null;

    function index() {
        if (IDX) return IDX;
        const titleEl = article.querySelector('.article-title');
        const title = clean(titleEl && titleEl.textContent) || 'this module';

        const sections = [];
        let cur = { name: title, head: titleEl, paras: [], intro: true };
        sections.push(cur);

        article.querySelectorAll('h2, p, li, tr, .fig-cap, .figure-caption').forEach(n => {
            if (n.closest(SKIP)) return;
            if (n.tagName === 'H2') {
                cur = { name: clean(n.textContent), head: n, paras: [] };
                sections.push(cur);
                return;
            }
            if (n.tagName === 'P' && n.closest('li, td, th')) return;
            if (n.tagName === 'TR' && n.closest('thead')) return;
            let text = n.tagName === 'TR'
                ? Array.from(n.children).map(c => clean(c.textContent)).filter(Boolean).join(' — ')
                : clean(n.textContent);
            if (text.length < 24) return;
            const box = n.closest('.key-box, .example-box');
            const lab = box && box.querySelector('.example-label');
            if (lab && box.querySelector('p') === n) text = clean(lab.textContent) + ': ' + text;
            cur.paras.push({ text, el: n, sec: cur, w: new Set(terms(text)) });
        });

        const secs = sections.filter(s => s.paras.length);
        const paras = [].concat.apply([], secs.map(s => s.paras));
        const df = new Map();
        paras.forEach(p => p.w.forEach(k => df.set(k, (df.get(k) || 0) + 1)));
        const N = Math.max(1, paras.length);
        const idf = k => Math.log(1 + N / (df.get(k) || 0.5));

        // bolded terms, each with the sentence the module defines it in
        const gloss = [], seen = new Set();
        article.querySelectorAll('b, strong').forEach(b => {
            if (b.closest(SKIP)) return;
            const term = clean(b.textContent).replace(/[:.,;]+$/, '');
            const key = term.toLowerCase();
            if (term.length < 3 || term.length > 48 || seen.has(key)) return;
            if (/^(step|note|tip|example|warning)\b/i.test(term) || /^[\d$%.,\s×x+\-–]+$/.test(term)) return;
            const para = paras.find(p => p.el === b || p.el.contains(b));
            if (!para) return;
            const sents = sentencesOf(para.text);
            let i = sents.findIndex(s => s.toLowerCase().indexOf(key) >= 0);
            if (i < 0) i = 0;
            let def = sents[i] || para.text;
            if (def.length < 110 && sents[i + 1]) def += ' ' + sents[i + 1];
            seen.add(key);
            gloss.push({ term, key, k: terms(term), def, para, el: para.el });
        });

        const quiz = Array.from(doc.querySelectorAll('.quiz-q')).map((q, i) => {
            const pEl = q.querySelector('p');
            const optEls = Array.from(q.querySelectorAll('.quiz-opt'));
            return {
                el: q, n: i + 1, optEls,
                prompt: clean(pEl && pEl.textContent).replace(/^\d+[.)]\s*/, ''),
                options: optEls.map(o => clean(o.textContent)),
                correct: optEls.findIndex(o => /\btrue\b/.test(o.getAttribute('onclick') || '')),
                why: clean(q.dataset.why || ''),
            };
        }).filter(q => q.prompt && q.options.length > 1 && q.correct >= 0);

        IDX = { title, secs, paras, idf, gloss, quiz };
        return IDX;
    }

    /* the section whose heading is the last one above the reading line */
    function currentSection() {
        const I = index();
        const line = global.innerHeight * 0.42;
        let best = I.secs[0];
        I.secs.forEach(s => { if (s.head && s.head.getBoundingClientRect().top < line) best = s; });
        return best;
    }

    /* ── finding the passage ─────────────────────────────────── */
    /* Scored as a share of the question, not as a raw total. A raw IDF sum
       depends on how many paragraphs the module has — a nine-paragraph module
       produces small numbers and a forty-paragraph one large ones — so a
       fixed threshold was too strict on short modules and too loose on long
       ones. The ratio is the same scale everywhere: 1.0 means every word of
       the question, weighted by how specific it is, is in the passage. */
    function retrieve(q, pool) {
        const I = index();
        const qs = Array.from(new Set(terms(q)));
        if (!qs.length) return null;
        const total = qs.reduce((a, k) => a + I.idf(k), 0) || 1;
        // the question's most specific word — the one a real answer cannot leave out
        /* Chosen only among words the module actually uses. A word it never
           mentions has the highest IDF of all, so picking from every word made
           "how do I pick a discount rate" hinge on "pick" and reject the DCF
           paragraph that answers it. If the module uses none of the words,
           there is no key and nothing here counts as an answer. */
        const present = qs.filter(k => I.paras.some(p => p.w.has(k)));
        const key = present.sort((a, b) => I.idf(b) - I.idf(a))[0] || null;
        const headTerms = new Map();
        const has = (p, k) => {
            if (!headTerms.has(p.sec)) headTerms.set(p.sec, new Set(p.sec.intro ? [] : terms(p.sec.name)));
            if (p.w.has(k) || headTerms.get(p.sec).has(k)) return true;
            if (k.length < 5) return false;
            for (const w of p.w) if (w.length >= 5 && (w.indexOf(k) === 0 || k.indexOf(w) === 0)) return true;
            return false;
        };
        let best = null, top = 0, bestHits = 0;
        (pool || I.paras).forEach(p => {
            let s = 0, hits = 0;
            qs.forEach(k => {
                if (p.w.has(k)) { s += I.idf(k); hits++; return; }
                if (k.length < 5) return;
                for (const w of p.w) {
                    if (w.length >= 5 && (w.indexOf(k) === 0 || k.indexOf(w) === 0)) { s += I.idf(k) * 0.7; hits++; return; }
                }
            });
            if (!hits) return;
            let r = s / total;
            r /= 1 + p.text.length / 4000;            // a slight preference for the tighter passage
            /* A heading naming the subject is strong evidence — but not the module
               title, which names everything. This used to be clamped at 1.0, so a
               one-word question like "volume" scored every matching paragraph a
               perfect 1 and the boost changed nothing; the Key Takeaways line won
               on length alone over the section actually called "Volume". */
            if (!p.sec.intro && terms(p.sec.name).some(k => qs.indexOf(k) >= 0)) r *= 1.5;
            // a takeaways section restates the module; the section that teaches it is the better answer
            if (/^(key )?takeaways?$|^summary$|^recap$/i.test(p.sec.name)) r *= 0.8;
            if (r > top) { top = r; best = p; bestHits = hits; }
        });
        /* "How do I read volume" on a module that never mentions volume used to
           come back with the one paragraph that said "read". A passage that
           leaves out the question's most specific word is not an answer. */
        return best ? { para: best, score: top, hits: bestHits, terms: qs.length, hasKey: !!key && has(best, key) } : null;
    }

    /* For "what is X" when X is not a bolded term: look for the sentence that
       defines it. A sentence scores for the specific words of X it contains,
       doubles when one of them is followed closely by a defining verb, and
       gains when its section's heading names X. "What is a call option?" on
       Options Basics used to return an in-the-money example; this finds "A
       call gives the right to buy". */
    const DEF_VERB = /^[^.;:]{0,40}?\b(is|are|was|means|mean|gives|give|lets|let|refers to|represents|measures|describes|tells|shows)\b/;
    function defineFromText(phrase) {
        const I = index();
        const pk = Array.from(new Set(terms(phrase)));
        if (!pk.length) return null;
        const total = pk.reduce((a, k) => a + I.idf(k), 0) || 1;
        let best = null, top = 0;
        I.paras.forEach(p => {
            const headHit = !p.sec.intro && terms(p.sec.name).some(k => pk.some(x => k.indexOf(x) === 0 || x.indexOf(k) === 0));
            sentencesOf(p.text).forEach(sent => {
                const low = sent.toLowerCase();
                const words = terms(sent);
                let sc = 0, firstAt = -1;
                pk.forEach(k => {
                    const w = words.find(x => x === k || (k.length >= 4 && (x.indexOf(k) === 0 || k.indexOf(x) === 0)));
                    if (!w) return;
                    sc += I.idf(k);
                    const at = low.search(new RegExp('\\b' + k.replace(/[^\w]/g, '')));
                    if (at >= 0 && (firstAt < 0 || at < firstAt)) firstAt = at;
                });
                if (!sc) return;
                let r = sc / total;
                if (firstAt >= 0 && DEF_VERB.test(low.slice(firstAt))) r *= 2;
                if (firstAt >= 0 && firstAt < 30) r *= 1.2;       // the subject of the sentence, not an aside
                if (headHit) r *= 1.4;
                r /= 1 + sent.length / 600;
                if (r > top) { top = r; best = { sent, para: p }; }
            });
        });
        if (!best || top < 0.9) return null;
        cite(best.para.el);
        const sents = sentencesOf(best.para.text);
        const i = sents.indexOf(best.sent);
        let text = best.sent;
        if (text.length < 110 && sents[i + 1]) text += ' ' + sents[i + 1];
        return {
            text: 'From "' + best.para.sec.name + '":\n' + clip(text, 460),
            follow: ['Show me where', 'Explain this section', 'Quiz me'],
        };
    }

    function snippet(para, q, max) {
        const want = new Set(terms(q));
        const sents = sentencesOf(para.text);
        if (sents.length <= 2) return clip(para.text, max);
        let bi = 0, bs = -1;
        sents.forEach((s, i) => {
            const k = terms(s).filter(x => want.has(x)).length;
            if (k > bs) { bs = k; bi = i; }
        });
        let out = sents[bi];
        if (out.length < 150 && sents[bi + 1]) out += ' ' + sents[bi + 1];
        return clip(out, max);
    }

    /* ── conversation state ──────────────────────────────────── */
    const S = { lastEl: null, pending: null, asked: new Set(), right: 0, tried: 0, missed: null };
    const cite = el => { if (el) S.lastEl = el; };

    function passage(r, q) {
        cite(r.para.el);
        return {
            text: 'This module covers that in "' + r.para.sec.name + '":\n' + snippet(r.para, q, 440),
            follow: ['Show me where', 'Quiz me'],
        };
    }

    function summary() {
        const I = index();
        const parts = I.secs.filter(s => !s.intro).slice(0, 7);
        const list = parts.length ? parts : I.secs.slice(0, 5);
        const lines = list.map(s => '• ' + s.name + ': ' + clip(sentencesOf(s.paras[0].text)[0] || '', 130));
        const n = I.quiz.length;
        return {
            text: '"' + I.title + '" in ' + list.length + (list.length === 1 ? ' part' : ' parts') + ':\n' +
                  lines.join('\n') +
                  (n ? '\n\nThere are ' + n + ' questions at the checkpoints. Say "quiz me" and I\'ll ask them first.' : ''),
            follow: ['Quiz me', 'Explain this section', termChip(null)].filter(Boolean),
        };
    }

    function explainSection(simpler) {
        const I = index();
        const sec = currentSection();
        if (!sec) return null;
        const lead = sentencesOf(sec.paras[0].text);
        let text;
        if (simpler) {
            // the shortest real sentence in the section is usually the thesis
            const all = [].concat.apply([], sec.paras.slice(0, 3).map(p => sentencesOf(p.text)))
                .filter(s => s.length > 40);
            all.sort((a, b) => a.length - b.length);
            text = all[0] || lead[0];
        } else {
            text = lead.slice(0, 2).join(' ');
            if (sec.paras[1] && text.length < 260) text += ' ' + (sentencesOf(sec.paras[1].text)[0] || '');
        }
        cite(sec.head || sec.paras[0].el);
        const near = I.gloss.filter(g => g.para.sec === sec).slice(0, 2).map(g => 'Explain ' + g.term);
        const head = sec.intro ? 'The opening, in short: '
                   : simpler ? 'The core of "' + sec.name + '" in one line: '
                   : 'You\'re on "' + sec.name + '". The short version: ';
        return { text: head + clip(text, 460), follow: near.concat(['Quiz me']).slice(0, 3) };
    }

    function lookup(phrase) {
        const I = index();
        const p = clean(phrase).toLowerCase().replace(/^(an?|the)\s+/, '').replace(/[?.!]+$/, '');
        if (p.length < 2) return null;
        const pk = terms(p);
        let hit = I.gloss.find(g => g.key === p) ||
                  I.gloss.find(g => g.key.length >= 4 && (g.key.indexOf(p) >= 0 || p.indexOf(g.key) >= 0));
        if (!hit && pk.length) {
            let bs = 0;
            I.gloss.forEach(g => {
                const k = g.k.filter(x => pk.indexOf(x) >= 0).length / Math.max(g.k.length, pk.length);
                if (k > bs) { bs = k; hit = g; }
            });
            if (bs < 0.5) hit = null;
        }
        if (!hit) return null;
        cite(hit.el);
        const sib = I.gloss.filter(g => g !== hit && g.para.sec === hit.para.sec).slice(0, 1).map(g => 'Explain ' + g.term);
        return {
            text: hit.term.charAt(0).toUpperCase() + hit.term.slice(1) + ', straight from "' + hit.para.sec.name + '":\n' + clip(hit.def, 460),
            follow: ['Show me where'].concat(sib, ['Quiz me']).slice(0, 3),
        };
    }

    function termChip(sec) {
        const g = index().gloss.find(x => !sec || x.para.sec === sec);
        return g ? 'Explain ' + g.term : null;
    }

    function showMe() {
        const el = S.lastEl;
        if (!el) return null;
        setTimeout(() => { if (global.FTRallyChat) FTRallyChat.close(); }, 650);
        setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.remove('rm-flash');
            void el.offsetWidth;                          // restart the animation if it is already lit
            el.classList.add('rm-flash');
            setTimeout(() => el.classList.remove('rm-flash'), 2600);
        }, 900);
        return { text: 'There — scrolling you to it now.', follow: ['Explain this section', 'Quiz me'] };
    }

    /* ── quizzing ────────────────────────────────────────────── */
    function nextQuestion() {
        const I = index();
        if (!I.quiz.length) {
            return { text: 'This one has no questions for me to ask. Want the summary instead?', follow: ['Sum up this module'] };
        }
        let q = I.quiz.find(x => !S.asked.has(x.n) && !x.optEls.some(o => o.classList.contains('disabled'))) ||
                I.quiz.find(x => !S.asked.has(x.n));
        if (!q) { S.asked.clear(); q = I.quiz[0]; }
        S.asked.add(q.n);
        S.pending = q;
        return {
            text: 'Question ' + q.n + ' of ' + I.quiz.length + ': ' + q.prompt + '\n\n' +
                  q.options.map((o, i) => LETTERS[i] + ')  ' + o).join('\n') + '\n\nAnswer with the letter.',
            follow: q.options.slice(0, 3).map((_, i) => LETTERS[i]),
        };
    }

    function parseChoice(text, q) {
        const t = clean(text).toLowerCase();
        let m = t.match(/^(?:option\s+|answer\s+|it'?s\s+|i think\s+|i'?d say\s+)?\(?([a-f])\)?[.!]?$/);
        if (m) { const i = 'abcdef'.indexOf(m[1]); return i < q.options.length ? i : -1; }
        m = t.match(/^([1-6])[.)]?$/);
        if (m) { const i = +m[1] - 1; return i < q.options.length ? i : -1; }
        return q.options.findIndex(o => o.toLowerCase() === t);
    }

    function grade(q, idx) {
        S.pending = null;
        S.tried++;
        const ok = idx === q.correct;
        if (ok) S.right++;
        const right = LETTERS[q.correct] + ') ' + q.options[q.correct];
        const r = retrieve(q.prompt + ' ' + q.options[q.correct]);
        if (r) cite(r.para.el);
        const tally = '\nThat\'s ' + S.right + ' of ' + S.tried + ' with me.';
        if (ok) {
            react('happy');
            return { text: 'Right, ' + right + '.' + (q.why ? ' ' + q.why : '') + tally, follow: ['Quiz me', 'Explain this section'] };
        }
        S.missed = q;
        react('worry');
        return {
            text: 'Not that one. It\'s ' + right + '.' + (q.why ? ' ' + q.why : '') +
                  (r ? '\nThe module covers it in "' + r.para.sec.name + '".' : '') + tally,
            follow: (r ? ['Show me where'] : []).concat(['Quiz me', 'Sum up this module']).slice(0, 3),
        };
    }

    function explainMissed() {
        const q = S.missed;
        if (!q) return null;
        const right = LETTERS[q.correct] + ') ' + q.options[q.correct];
        const r = retrieve(q.prompt + ' ' + q.options[q.correct]);
        if (r) cite(r.para.el);
        return {
            text: 'The one you missed: "' + clip(q.prompt, 150) + '"\nThe answer is ' + right + '.' +
                  (q.why ? ' ' + q.why : '') +
                  (r ? '\n\nFrom "' + r.para.sec.name + '": ' + snippet(r.para, q.prompt + ' ' + q.options[q.correct], 340) : ''),
            follow: (r ? ['Show me where'] : []).concat(['Quiz me']).slice(0, 3),
        };
    }

    /* ── the extension ───────────────────────────────────────── */
    const RE = {
        quiz:    /\b(quiz|test)\s+me\b|practice question|ask me (a |another )?question|another one|next question|^quiz\b/,
        show:    /\b(show me( where)?|take me (there|to it)|where (is|was) (that|it)|scroll (me )?to (it|that))\b/,
        missed:  /(one|question) i (missed|got wrong)|why (was|am) i wrong|explain (my )?mistake|explain the one i missed/,
        summary: /summar|recap|tl;?dr|key (points|ideas|takeaways)|sum (it |this |the module |this module )?up|overview|what(?:'|’)?s this (module|lesson|page|about)|what is this (module|lesson|page) about|main points?|big picture/,
        section: /this section|explain (this|that|it)\b|what am i reading|where am i|break (this|it) down|simpler|plain english|eli5|dumb it down|i don'?t (get|understand) (this|it)|confus/,
        simpler: /simpler|plain english|eli5|dumb/,
        personal: /how am i doing|\bmy (holdings|positions|stocks|account|portfolio|cash|balance|money)\b|what do i (own|hold)|real money|buying power|why am i (down|losing)|^(hi|hey|hello|yo|sup|thanks|thank you|cheers)\b/,
        whatIs:  /^(?:so\s+)?(?:what|who)(?:'s|’s|\s+is|\s+are|\s+was|\s+does|\s+do)\s+(?:an?\s+|the\s+)?(.+?)(?:\s+mean)?\s*\??$/,
        define:  /^(?:define|definition of|meaning of|explain|what does)\s+(?:an?\s+|the\s+)?(.+?)(?:\s+mean)?\s*\??$/,
    };

    const ext = {
        scope: 'module:' + (global.location.pathname.split('/').pop() || 'module'),

        answer(raw) {
            const text = clean(raw);
            const t = text.toLowerCase();
            if (S.pending) {
                const i = parseChoice(text, S.pending);
                if (i >= 0) return grade(S.pending, i);
                if (/^(skip|next|pass)\b/.test(t)) { S.pending = null; return nextQuestion(); }
                S.pending = null;                       // they moved on; so does he
            }
            if (RE.quiz.test(t)) return nextQuestion();
            if (RE.show.test(t)) return showMe() || { text: 'Ask me about something first and I\'ll take you to it.', follow: ['Explain this section'] };
            if (RE.missed.test(t)) return explainMissed() || { text: 'You haven\'t missed one yet. Want a question?', follow: ['Quiz me'] };
            if (RE.summary.test(t)) return summary();
            if (RE.section.test(t)) return explainSection(RE.simpler.test(t));
            const m = t.match(RE.whatIs) || t.match(RE.define);
            if (m) {
                const hit = lookup(m[1]) || defineFromText(m[1]);
                if (hit) return hit;
            }
            if (RE.personal.test(t)) return null;      // their own account: the general chat knows that
            const r = retrieve(text);
            if (!r) return null;
            /* Two matched words is a real match. One word alone is only trusted
               when the general chat has nothing of its own to say — otherwise
               "what is a P/E ratio" on a module that happens to say "ratio"
               once would be answered with the wrong paragraph. The reverse
               also held before this: "how do I pick a discount rate" on the
               DCF module went to a generic stock-picking answer because the
               word "pick" matched it. */
            const kb = global.FTRallyChat && FTRallyChat.answerFor ? FTRallyChat.answerFor(text) : null;
            if (r.hasKey && (r.hits >= 2 ? r.score >= 0.3 : (!kb && r.score >= 0.5))) return passage(r, text);
            return null;                                // let the general knowledge base try
        },

        fallback(raw) {
            const r = retrieve(raw);
            return r && r.hasKey && r.score >= 0.2 ? passage(r, raw) : null;
        },

        suggestions() {
            if (S.missed) return ['Explain the one I missed', 'Quiz me', 'Sum up this module'];
            return ['Explain this section', termChip(currentSection()) || 'Sum up this module', 'Quiz me'];
        },

        greet() {
            return 'I\'ve read "' + index().title + '" all the way through. Ask me about any term, number or ' +
                   'section in it, or say "quiz me" and I\'ll test you before the checkpoints do.';
        },
    };

    /* ── on the page ─────────────────────────────────────────── */
    let bull = null, lastLine = 0, finished = false;
    function react(state) { if (bull) { try { bull.setState(state, 1800); } catch (e) {} } }
    function sayOnce(text, state, tone) {
        if (!bull || (global.FTRallyChat && FTRallyChat.isOpen())) return;
        const now = Date.now();
        if (now - lastLine < 8000) return;            // never a running commentary
        lastLine = now;
        try { bull.setState(state || 'happy', 2200); bull.say(text, { ms: 4400, tone }); } catch (e) {}
    }

    const RIGHT = ["That's the one.", 'Right. Keep going.', 'Nailed it.'];
    const WRONG = ["Close. Tap me and I'll walk you through that one.",
                   "Not that one. Ask me why and I'll show you the part that covers it."];

    function watchCheckpoints() {
        // capture phase runs before the option's own onclick marks it, so read the result a beat later
        doc.addEventListener('click', e => {
            const opt = e.target.closest && e.target.closest('.quiz-opt');
            if (!opt) return;
            setTimeout(() => {
                const qEl = opt.closest('.quiz-q');
                if (!qEl) return;
                if (opt.classList.contains('correct')) sayOnce(pick(RIGHT), 'happy', 'ok');
                else if (opt.classList.contains('wrong')) {
                    const q = index().quiz.find(x => x.el === qEl);
                    if (q) S.missed = q;
                    sayOnce(pick(WRONG), 'worry', 'no');
                }
            }, 60);
        }, true);

        global.addEventListener('scroll', () => {
            if (finished) return;
            const h = doc.documentElement;
            if (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) < 0.93) return;
            finished = true;
            if (index().quiz.length) sayOnce("That's the whole module. Want me to quiz you on it?", 'cheer', 'ok');
        }, { passive: true });
    }

    function mount() {
        if (!global.FTBull || !global.FTRallyWidget || !global.FTRallyChat) return;

        const style = doc.createElement('style');
        style.textContent =
            '.rm-flash{animation:rmFlash 2.5s ease both;border-radius:8px}' +
            '@keyframes rmFlash{0%{box-shadow:0 0 0 0 rgba(92,184,138,0);background-color:transparent}' +
            '12%{box-shadow:0 0 0 7px rgba(92,184,138,.30);background-color:rgba(92,184,138,.10)}' +
            '72%{box-shadow:0 0 0 7px rgba(92,184,138,.18);background-color:rgba(92,184,138,.07)}' +
            '100%{box-shadow:0 0 0 0 rgba(92,184,138,0);background-color:transparent}}' +
            /* on a narrow window he would sit on the Next button; give the footer room */
            '@media (max-width:1180px){.module-footer{padding-bottom:9rem!important}}' +
            '@media (prefers-reduced-motion:reduce){.rm-flash{animation:none;outline:2px solid rgba(92,184,138,.6);outline-offset:4px}}';
        doc.head.appendChild(style);

        FTRallyChat.extend(ext);

        const host = doc.createElement('div');
        host.className = 'rc-corner rm-corner';
        doc.body.appendChild(host);
        // rc-corner-click: the disc is the button
        host.setAttribute('title', 'Ask Rally');
        host.addEventListener('click', e => {
            if (e.target.closest && e.target.closest('.bull-holder')) return;   // the bull already opens it
            if (global.FTRallyChat) FTRallyChat.open();
        });
        bull = FTRallyWidget.mount({
            el: host,
            chatter: false,
            greet: ["I've read this one. Tap me if anything's unclear."],
            context: () => ({ module: index().title }),
        });
        watchCheckpoints();
    }

    global.FTRallyModule = { index, answer: t => ext.answer(t), fallback: t => ext.fallback(t), state: S, ext };

    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount);
    else mount();
})(typeof window !== 'undefined' ? window : this);
