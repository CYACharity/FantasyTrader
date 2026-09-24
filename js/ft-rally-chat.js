/* ============================================================
 *  RALLY CHAT — the mentor panel.
 *
 *      FTRallyChat.init({ context: () => ({ ... }) });
 *      FTRallyChat.open();          // or click the bull / the button
 *
 *  He answers from a local knowledge base rather than a model:
 *  no key to leak, no request to fail, no bill, and it works with
 *  the network off. Every answer is a function of the question AND
 *  whatever context the host page hands over, so "how am I doing"
 *  gets a real number off the real portfolio rather than a shrug.
 *
 *  Two rules baked in and not negotiable:
 *    · he never tells anyone what to buy or sell. He explains how
 *      to think about it and says plainly that he won't pick.
 *    · he never claims a wrong answer was nearly right.
 *
 *  Swapping in a real model later means replacing answerFor() and
 *  nothing else — the transcript, the panel and the context feed
 *  all stay as they are.
 * ============================================================ */
(function (global) {
    'use strict';

    const STORE = 'ftRallyChat';
    const MAX_KEPT = 40;

    /* ── context ──────────────────────────────────────────────
       Host pages hand over whatever they know. Everything here is
       optional; each answer copes with it being absent. */
    let getContext = () => ({});

    /* ── page extensions ──────────────────────────────────────
       A page that knows something the knowledge base does not — a
       module's own text, say — registers an extension. Extensions
       are asked first with answer(), the KB second, and anything an
       extension offers as fallback() only after both have passed.
       Each may also supply suggestions() and greet(), and a `scope`
       that keeps its transcript separate from the rest of the site.
       Every call is guarded: a broken extension cannot break him. */
    const EXT = [];
    function normHit(r) {
        return r && r.text ? { text: String(r.text), follow: Array.isArray(r.follow) ? r.follow : [] } : null;
    }
    function fromExt(fn, arg) {
        for (const x of EXT) {
            try { const r = normHit(typeof x[fn] === 'function' ? x[fn](arg) : null); if (r) return r; } catch (e) {}
        }
        return null;
    }
    function storeKey() {
        const x = EXT.find(e => e && e.scope);
        return x ? STORE + ':' + x.scope : STORE;
    }
    function ctx() {
        try { return getContext() || {}; } catch (e) { return {}; }
    }

    const money = n => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
    const signed = n => (n < 0 ? '-' : '+') + money(n);
    // "+4.2%" / "−1.1%" — a real minus sign, not a hyphen
    const pctStr = n => (Number(n) < 0 ? '\u2212' : '+') + Math.abs(Number(n)).toFixed(1) + '%';

    /* ── the knowledge base ───────────────────────────────────
       Each entry scores itself against the question. Highest score
       wins. `keys` are the words that must show up; `weight` lifts
       an entry over a rival that shares vocabulary with it.

       Answers are written the way a person on a desk talks: short
       sentences, a real number where one exists, and no throat
       clearing. Nothing opens with "Great question".  */
    const KB = [

        /* ---- where am I, what do I do ---- */
        {
            id: 'start',
            keys: ['where do i start', 'what do i do', 'how do i start', 'getting started',
                   'what now', 'first', 'begin', 'new here', 'help me start'],
            weight: 1.2,
            answer() {
                const c = ctx();
                const held = (c.positions | 0);
                if (!held) {
                    return "Open Live Trading, search a company you actually use, and buy one share. " +
                           "That's it. You learn more from owning one share of something than from reading about ten.";
                }
                return "You've already got " + held + (held === 1 ? ' position' : ' positions') +
                       ". Next useful thing: open Portfolio Builder and look at what you own as a whole " +
                       "rather than one ticker at a time. Most people are far less spread out than they think.";
            },
            follow: ['How am I doing?', 'What is diversification?'],
        },
        {
            id: 'thispage',
            keys: ['this page', 'what is this', 'practice floor', 'what is practice',
                   'why practice', 'what am i looking at'],
            answer() {
                return "The practice floor. Real prices, fake money — you start with $10,000 that isn't real. " +
                       "Two doors: Live Trading to buy and sell, Portfolio Builder to see what you own. " +
                       "Nothing you do here touches an actual bank account.";
            },
            follow: ['Where do I start?', 'Is this real money?'],
        },
        {
            id: 'realmoney',
            keys: ['real money', 'actual money', 'is it real', 'lose real', 'my own money', 'is this fake'],
            answer: () => "None of it's real. The prices are, the money isn't. You can lose the whole " +
                          "$10,000 and the only cost is finding out you'd have lost it for real.",
        },

        /* ---- their own book ---- */
        {
            id: 'howamidoing',
            keys: ['how am i doing', 'my performance', 'am i up', 'am i down', 'my returns',
                   'how is my portfolio', 'my pnl', 'p and l', 'how am i'],
            weight: 1.3,
            answer() {
                const c = ctx();
                if (c.total == null) return "I can't see your account from here. Open the practice floor and ask me again.";
                const pnl = c.pnl || 0;
                const pct = c.start ? (pnl / c.start) * 100 : 0;
                if (!c.positions) {
                    return "Flat — you're holding " + money(c.cash) + " in cash and nothing else. " +
                           "Nothing to judge yet.";
                }
                const head = "Account's at " + money(c.total) + ", so you're " + signed(pnl) +
                             " (" + (pct >= 0 ? '+' : '') + pct.toFixed(1) + "%) since you started.";
                let tail = '';
                if (pnl > 0) tail = " Worth asking whether that was the pick or just the market going up.";
                else if (pnl < 0) tail = " Normal. The question isn't whether you're down, it's whether you know why.";
                const top = c.movers && c.movers.length ? c.movers[0] : null;
                if (top && top.symbol && top.change_pct != null && isFinite(Number(top.change_pct))) {
                    tail += " Biggest mover today: " + top.symbol + ' ' + pctStr(top.change_pct) + '.';
                }
                return head + tail;
            },
            follow: ['What do I own?', 'Why am I down?'],
        },
        {
            id: 'whatdoiown',
            keys: ['what do i own', 'my holdings', 'my positions', 'my stocks', 'what am i holding'],
            answer() {
                const c = ctx();
                if (!c.positions) return "Nothing yet. All " + money(c.cash || 10000) + " of it is sitting in cash.";
                const names = (c.symbols || []).slice(0, 8).join(', ');
                return c.positions + (c.positions === 1 ? ' position' : ' positions') +
                       (names ? ': ' + names + '.' : '.') +
                       ' Portfolio Builder breaks it down properly.';
            },
        },
        {
            id: 'movers',
            keys: ['what moved', 'biggest mover', 'what happened today', 'what moved today',
                   'anything move', 'movers', 'what went up', 'what went down'],
            weight: 1.3,
            answer() {
                const c = ctx();
                const list = Array.isArray(c.movers) ? c.movers.filter(m =>
                    m && m.symbol && m.change_pct != null && isFinite(Number(m.change_pct))) : [];
                if (!list.length) return "I can't see today's moves from here. Open the practice floor and ask again.";
                const line = list.slice(0, 3).map(m => m.symbol + ' ' + pctStr(m.change_pct)).join(', ') + '.';
                const big = Math.abs(Number(list[0].change_pct)) >= 5;
                return line + (big ? " That first one is a real move. Worth knowing why."
                                   : " Nothing dramatic. That's most days.");
            },
            follow: ['How am I doing?', 'What is volatility?'],
        },
        {
            id: 'whydown',
            keys: ['why am i down', 'why did i lose', 'losing money', 'why am i losing', 'went down'],
            answer: () => "Usually one of three things. You bought a lot of one thing and it moved. You bought " +
                          "several things that all move together, which is the same mistake wearing a costume. " +
                          "Or the whole market dropped and you're fine. Check which before you change anything.",
            follow: ['What is diversification?', 'What is volatility?'],
        },

        /* ---- the "just tell me what to buy" wall ---- */
        {
            id: 'whatbuy',
            keys: ['what should i buy', 'what stock', 'should i buy', 'should i sell', 'best stock',
                   'what to invest', 'pick me', 'give me a stock', 'good buy', 'is it a good time',
                   'recommend', 'hot stock', 'what do you think of'],
            weight: 1.6,
            answer: () => "I don't pick. Not being coy — I'm a cartoon bull in a simulator and picking for you " +
                          "would teach you nothing.\n\nWhat I'll do is give you the questions: what does this " +
                          "company actually sell, who pays them, would you still want it if the price fell 30% " +
                          "tomorrow. If you can't answer the first two, the third one answers itself.",
            follow: ['How do I research a stock?', 'What is a P/E ratio?'],
        },
        {
            id: 'research',
            keys: ['how do i research', 'how to research', 'what to look for', 'how do i pick',
                   'how do i choose', 'due diligence', 'analyse', 'analyze'],
            answer: () => "Start with the business, not the chart. What do they sell, who buys it, and is that " +
                          "growing. Then the price: what are you paying per dollar of earnings, and is that high " +
                          "or low for this kind of company.\n\nThe chart tells you what other people have already " +
                          "decided. It doesn't tell you whether they were right.",
            follow: ['What is a P/E ratio?', 'What is market cap?'],
        },

        /* ---- vocabulary ---- */
        {
            id: 'pe',
            keys: ['p/e', 'pe ratio', 'price to earnings', 'price earnings', 'earnings ratio'],
            weight: 1.4,
            answer: () => "Price divided by earnings per share. A P/E of 25 means you're paying $25 for every $1 " +
                          "the company earns in a year.\n\nHigh isn't automatically bad — it usually means people " +
                          "expect the earnings to grow. Low isn't automatically a bargain either; sometimes it " +
                          "means everyone's expecting the earnings to shrink.",
            follow: ['What is market cap?', 'What are earnings?'],
        },
        {
            id: 'marketcap',
            keys: ['market cap', 'marketcap', 'how big is the company', 'company size'],
            answer: () => "Share price times the number of shares. It's what the market says the whole company " +
                          "is worth.\n\nIt's also why share price alone tells you nothing about size. A $10 stock " +
                          "with 10 billion shares is a much bigger company than a $900 stock with a million.",
        },
        {
            id: 'dividend',
            keys: ['dividend', 'dividends', 'yield', 'pay me'],
            answer: () => "Cash the company hands to shareholders, usually every quarter. A 3% yield means you get " +
                          "about $3 a year for every $100 you've got in it.\n\nIt isn't free money — the share price " +
                          "drops by roughly the dividend on the day it's paid. What it is, is a company saying it " +
                          "has more cash than it has ideas.",
        },
        {
            id: 'diversify',
            keys: ['diversif', 'spread out', 'too concentrated', 'concentration', 'all in one',
                   'how many stocks', 'eggs in one basket'],
            weight: 1.2,
            answer() {
                const c = ctx();
                const n = c.positions | 0;
                const base = "Owning things that don't all fall on the same day. Not just owning more things — " +
                             "ten tech companies is one bet typed out ten times.";
                if (n === 0) return base;
                if (n === 1) return base + "\n\nYou're holding one position, so right now your account is that " +
                                           "company's share price with extra steps.";
                if (n < 5) return base + "\n\nYou've got " + n + ". Worth checking whether they're in different " +
                                         "industries or just different logos.";
                return base + "\n\nYou've got " + n + " positions, which is a reasonable spread if they're not " +
                              "all in the same sector.";
            },
            follow: ['What is a sector?', 'How am I doing?'],
        },
        {
            id: 'volatility',
            keys: ['volatil', 'risky', 'what is risk', 'how risky', 'swings', 'beta'],
            answer: () => "How much the price jumps around. High volatility means big moves in both directions — " +
                          "it's not the same thing as losing money, though it's the thing that makes people sell " +
                          "at the bottom.\n\nBeta is the version measured against the whole market. Beta of 1.5 " +
                          "means it tends to move half again as hard as the index, up and down.",
        },
        {
            id: 'bullbear',
            keys: ['bull market', 'bear market', 'bull or bear', 'bullish', 'bearish', 'what is a bull'],
            answer: () => "Bull means prices rising and people optimistic. Bear means falling and people scared. " +
                          "The usual line is a bear market starts at a 20% drop from the high.\n\nI'm a bull. " +
                          "I'm aware that's a bias.",
        },
        {
            id: 'orders',
            keys: ['market order', 'limit order', 'order type', 'stop loss', 'what is a limit',
                   'how do i buy', 'place an order'],
            answer: () => "A market order buys now at whatever the price is. A limit order says \"only at $X or " +
                          "better\" and waits.\n\nMarket orders get filled. Limit orders get the price you wanted, " +
                          "or nothing. On a big liquid company the difference is pennies. On a thin one it isn't.",
            follow: ['What is the bid-ask spread?'],
        },
        {
            id: 'spread',
            keys: ['bid ask', 'bid-ask', 'spread', 'bid and ask'],
            answer: () => "The bid is the most anyone will pay right now. The ask is the least anyone will sell " +
                          "for. The gap between them is the spread, and it's a cost you pay on the way in and " +
                          "again on the way out.\n\nOn Apple it's a cent. On something nobody trades it can be " +
                          "several percent, which is a hole you start the trade already inside.",
        },
        {
            id: 'etf',
            keys: ['etf', 'index fund', 'index', 's&p', 'sp500', 'mutual fund', 'what is an index'],
            answer: () => "One thing you buy that holds hundreds of others. An S&P 500 fund is a slice of the 500 " +
                          "biggest US companies in one ticker.\n\nIt's the boring answer and it beats most " +
                          "professionals over fifteen years. That's not a slogan, it's the measured result.",
        },
        {
            id: 'short',
            keys: ['short selling', 'shorting', 'short a stock', 'bet against'],
            answer: () => "Borrowing shares, selling them, and hoping to buy them back cheaper. You keep the " +
                          "difference.\n\nThe catch is the arithmetic. Buying something can only lose you what you " +
                          "put in. Shorting can lose you more than that, because there's no ceiling on how high a " +
                          "price can go.",
        },
        {
            id: 'compound',
            keys: ['compound', 'compounding', 'interest', 'long term', 'over time', 'how long'],
            answer: () => "Returns earning returns. $10,000 at 8% is $10,800 after a year — but it's about " +
                          "$21,600 after ten, because the growth starts growing.\n\nIt's why time in the market " +
                          "beats timing it, and why the boring part is the part that works.",
        },
        {
            id: 'earnings',
            keys: ['earnings', 'eps', 'profit', 'revenue', 'quarterly'],
            answer: () => "What the company actually made. Revenue is money in the door; earnings are what's left " +
                          "after costs. EPS splits that across every share.\n\nCompanies report every three months, " +
                          "and the price usually moves on the gap between what they earned and what people expected " +
                          "— not on whether the number was good.",
        },
        {
            id: 'sector',
            keys: ['sector', 'industry', 'what sector'],
            answer: () => "The bucket a company sits in — tech, healthcare, energy, and so on. Companies in the " +
                          "same sector tend to move together, which is the whole reason the label matters. " +
                          "Five sectors is a portfolio. Five tech stocks is a mood.",
        },
        {
            id: 'ticker',
            keys: ['ticker', 'symbol', 'what does aapl', 'abbreviation'],
            answer: () => "The short code a company trades under. AAPL is Apple, MSFT is Microsoft. That's all it " +
                          "is — a name short enough to fit on a screen from 1975.",
        },
        {
            id: 'cash',
            keys: ['cash', 'buying power', 'how much money', 'how much do i have', 'balance'],
            answer() {
                const c = ctx();
                if (c.cash == null) return "Can't see your balance from here.";
                return "You've got " + money(c.cash) + " in cash" +
                       (c.positions ? " and " + money(c.total - c.cash) + " tied up in " + c.positions +
                                      (c.positions === 1 ? ' position.' : ' positions.')
                                    : ", all of it unspent.");
            },
        },
        {
            id: 'timing',
            keys: ['when should i buy', 'timing', 'time the market', 'wait for a dip', 'best time',
                   'is now a good time'],
            // outranks the "what should I buy" wall: "when should i buy" is
            // the longer, more specific phrase and deserves the timing answer
            weight: 1.7,
            answer: () => "Nobody knows. That's not modesty, it's the finding — miss the ten best days in twenty " +
                          "years and you cut your return roughly in half, and those days mostly happen in the " +
                          "middle of the scary bits.\n\nWaiting for a dip is a bet that you'll recognise the " +
                          "bottom when you're standing in it. Most people don't.",
        },
        {
            id: 'daytrading',
            keys: ['day trading', 'day trade', 'scalp', 'trade every day', 'make money fast', 'get rich'],
            answer: () => "Studies keep landing in the same place: something like 95% of day traders lose money " +
                          "over time. Not because they're stupid — because costs and spreads compound against you " +
                          "as reliably as returns compound for you.\n\nPractise it here if you want. That's what " +
                          "the fake money is for.",
        },
        {
            id: 'lost',
            keys: ['i lost everything', 'blew up', 'lost it all', 'wiped out', 'zero'],
            answer: () => "Good. Cheapest tuition you'll ever pay.\n\nGo back and look at what the account was " +
                          "doing right before it went. It's almost always position size — one bet big enough that " +
                          "being wrong once mattered.",
        },

        /* ---- about him ---- */
        {
            id: 'whoareyou',
            keys: ['who are you', 'what are you', 'your name', 'about you', 'are you ai', 'are you a bot',
                   'are you real'],
            answer: () => "Rally. I'm the bull. I know a fixed set of things about markets and about whatever's " +
                          "in your account, and I'll say so when a question lands outside that.\n\nNot a person, " +
                          "not a licensed anything.",
        },
        {
            id: 'thanks',
            keys: ['thanks', 'thank you', 'cheers', 'appreciate', 'nice one'],
            answer: () => "Any time.",
        },
        {
            id: 'hello',
            keys: ['hi', 'hey', 'hello', 'yo', 'sup', 'morning'],
            answer: () => "Hey. Ask me something.",
        },
    ];

    /* Score a question against one entry. Longer key phrases count for
       more, so "market cap" beats a bare "market" hit elsewhere. */
    function scoreEntry(q, entry) {
        let best = 0;
        entry.keys.forEach(k => {
            if (q.indexOf(k) === -1) return;
            // whole-word-ish bonus stops "pe" matching inside "expensive"
            const isShort = k.length <= 3;
            if (isShort && !new RegExp('\\b' + k.replace(/[^\w]/g, '\\$&') + '\\b').test(q)) return;
            best = Math.max(best, k.length);
        });
        return best * (entry.weight || 1);
    }

    function answerFor(raw) {
        const q = ' ' + String(raw || '').toLowerCase().replace(/[^\w\s/&-]/g, ' ').replace(/\s+/g, ' ') + ' ';
        let winner = null, top = 0;
        KB.forEach(e => {
            const s = scoreEntry(q, e);
            if (s > top) { top = s; winner = e; }
        });
        if (!winner || top < 2) return null;
        const text = typeof winner.answer === 'function' ? winner.answer() : winner.answer;
        return { text: text, follow: winner.follow || [] };
    }

    /* When nothing matches, say so plainly and point somewhere real.
       Inventing an answer is the one thing that would make him useless. */
    const MISSES = [
        "Don't know that one. I cover the basics — how the market works, what the jargon means, and whatever's " +
        "in your account. Try me on one of those, or the Academy goes deeper than I do.",
        "That's outside what I know. Ask me about a term, or about your own numbers, and I'll be more use.",
        "No idea. I'd rather say that than make something up.",
    ];
    let missAt = 0;

    /* ── transcript ───────────────────────────────────────── */
    function loadLog() {
        try { return JSON.parse(localStorage.getItem(storeKey()) || '[]') || []; } catch (e) { return []; }
    }
    function saveLog(log) {
        try { localStorage.setItem(storeKey(), JSON.stringify(log.slice(-MAX_KEPT))); } catch (e) {}
    }

    /* ── panel ────────────────────────────────────────────── */
    let el = null, listEl = null, inputEl = null, chipsEl = null, open = false;

    const OPENERS = [
        'Where do I start?',
        'How am I doing?',
        'What is a P/E ratio?',
        'What should I buy?',
    ];

    function build() {
        if (el) return el;
        el = document.createElement('div');
        el.className = 'rc-back';
        el.innerHTML =
            '<aside class="rc-panel" role="dialog" aria-label="Chat with Rally">' +
              '<header class="rc-head">' +
                '<span class="rc-head-bull"></span>' +
                '<span class="rc-head-txt"><b>Rally</b><i>Ask me anything</i></span>' +
                '<button class="rc-close" aria-label="Close">&#10005;</button>' +
              '</header>' +
              '<div class="rc-log" id="rcLog"></div>' +
              '<div class="rc-chips" id="rcChips"></div>' +
              '<form class="rc-form">' +
                '<input class="rc-input" id="rcInput" type="text" autocomplete="off" ' +
                       'placeholder="Ask Rally something…" maxlength="200">' +
                '<button class="rc-send" type="submit" aria-label="Send">' +
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
                       'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13"/>' +
                       '<path d="m12 5 7 7-7 7"/></svg>' +
                '</button>' +
              '</form>' +
            '</aside>';
        document.body.appendChild(el);

        listEl  = el.querySelector('#rcLog');
        inputEl = el.querySelector('#rcInput');
        chipsEl = el.querySelector('#rcChips');

        // a small, still Rally in the header — no animation loop running
        // behind a panel that is closed most of the time
        const slot = el.querySelector('.rc-head-bull');
        if (global.FTBull) {
            slot.innerHTML = global.FTBull.rigSVG();
            slot.querySelector('.bull-rig').setAttribute('class', 'bull-rig is-idle');
        }

        el.querySelector('.rc-close').onclick = close;
        el.addEventListener('click', e => { if (e.target === el) close(); });
        el.querySelector('.rc-form').addEventListener('submit', e => {
            e.preventDefault();
            send(inputEl.value);
        });
        // Implicit form submission on Enter is standard, but it is also the
        // first thing to go missing inside an embedded webview. Belt as well
        // as braces — send() is idempotent on an empty box.
        inputEl.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(inputEl.value); }
        });
        addEventListener('keydown', e => { if (e.key === 'Escape' && open) close(); });
        return el;
    }

    function bubble(who, text, animate) {
        const row = document.createElement('div');
        row.className = 'rc-msg ' + who + (animate ? ' in' : '');
        // textContent, then linebreaks — never innerHTML with user input
        text.split('\n').forEach((line, i) => {
            if (i) row.appendChild(document.createElement('br'));
            row.appendChild(document.createTextNode(line));
        });
        listEl.appendChild(row);
        listEl.scrollTop = listEl.scrollHeight;
        return row;
    }

    function paintChips(list) {
        chipsEl.innerHTML = '';
        (list || []).slice(0, 3).forEach(q => {
            const b = document.createElement('button');
            b.className = 'rc-chip';
            b.textContent = q;
            b.onclick = () => send(q);
            chipsEl.appendChild(b);
        });
    }

    /* He "thinks" for a beat before answering. Instant replies read as a
       lookup table, which is what this is — but the beat is also how long
       it takes to read the question you just typed. */
    function send(text) {
        text = String(text || '').trim();
        if (!text) return;
        inputEl.value = '';
        bubble('me', text, true);

        const log = loadLog();
        log.push({ w: 'me', t: text });

        paintChips([]);
        const wait = document.createElement('div');
        wait.className = 'rc-msg rally rc-typing';
        wait.innerHTML = '<i></i><i></i><i></i>';
        listEl.appendChild(wait);
        listEl.scrollTop = listEl.scrollHeight;

        if (global.FTJuice) FTJuice.sfx.tap();

        setTimeout(() => {
            wait.remove();
            const hit = fromExt('answer', text) || answerFor(text) || fromExt('fallback', text);
            const reply = hit ? hit.text : MISSES[missAt++ % MISSES.length];
            bubble('rally', reply, true);
            paintChips(hit && hit.follow.length ? hit.follow : suggestions());
            log.push({ w: 'rally', t: reply });
            saveLog(log);
            if (global.FTJuice) FTJuice.sfx.pop();
        }, 420 + Math.min(700, text.length * 12));
    }

    /* Openers adapt to what the page can see, so the first thing he
       offers is worth tapping. */
    function suggestions() {
        for (const x of EXT) {
            try { const l = typeof x.suggestions === 'function' && x.suggestions(); if (l && l.length) return l.slice(0, 3); } catch (e) {}
        }
        const c = ctx();
        const out = [];
        if (c.positions) { out.push('How am I doing?', 'What do I own?'); }
        else { out.push('Where do I start?'); }
        out.push('What is a P/E ratio?', 'What should I buy?', 'What is diversification?');
        return out.filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
    }

    function greet() {
        for (const x of EXT) {
            try { const g = typeof x.greet === 'function' && x.greet(); if (g) return String(g); } catch (e) {}
        }
        const c = ctx();
        if (c.positions) {
            return "You've got " + c.positions + (c.positions === 1 ? ' position' : ' positions') +
                   " open. Ask me about them, or about anything you've seen a word for and not a meaning.";
        }
        return "Ask me anything about this place, or about a word you've seen and can't pin down. " +
               "I'll tell you when I don't know.";
    }

    function openPanel() {
        build();
        if (open) return;
        open = true;
        document.body.classList.add('rc-open');
        el.classList.add('open');

        if (!listEl.childElementCount) {
            const log = loadLog();
            if (log.length) {
                log.forEach(m => bubble(m.w, m.t, false));
            } else {
                bubble('rally', greet(), false);
            }
            paintChips(suggestions());
        }
        setTimeout(() => inputEl.focus(), 260);
        if (global.FTJuice) { FTJuice.unlock(); FTJuice.sfx.pop(); }
    }

    function close() {
        if (!open) return;
        open = false;
        el.classList.remove('open');
        document.body.classList.remove('rc-open');
    }

    function reset() {
        try { localStorage.removeItem(storeKey()); } catch (e) {}
        if (listEl) listEl.innerHTML = '';
    }

    global.FTRallyChat = {
        init(opts) {
            opts = opts || {};
            if (typeof opts.context === 'function') getContext = opts.context;
            build();
            return this;
        },
        open: openPanel,
        extend(x) { if (x && EXT.indexOf(x) < 0) EXT.push(x); return this; },
        ask(text) { openPanel(); send(text); },
        close,
        toggle() { open ? close() : openPanel(); },
        reset,
        isOpen() { return open; },
        answerFor,        // exported so the KB can be tested without the DOM
    };
})(typeof window !== 'undefined' ? window : this);
