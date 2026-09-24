/* ============================================================
 *  FT TEACH — concept cards shown before a lesson's exercises.
 *
 *  The hand-holding layer: nobody is quizzed on something the
 *  lesson didn't just show them. Two or three cards per lesson,
 *  each one idea, minimal words. Keyed by lesson id and merged
 *  by the engine at load, so the curriculum stays pure data.
 * ============================================================ */
(function (global) {
    'use strict';

    const TEACH = {

        /* ── Unit 1 ── */
        u1l1: [
            { art: 'market', title: 'A market is a meeting place',
              text: 'People with spare money meet people who need it. That is the entire idea.' },
            { art: 'balance', title: 'Every trade has two sides',
              text: 'For you to buy, someone must sell. They think selling is smart. You think buying is. One of you learns something.' },
            { art: 'wallet', title: 'Your money goes to the seller',
              text: 'Buying a share pays the previous owner — not the company. Companies only get money when they issue new shares.' },
        ],
        u1l2: [
            { art: 'supply', title: 'Price is an agreement',
              text: 'The last price where a buyer and a seller shook hands. Nobody sets it. It just happens, thousands of times a minute.' },
            { art: 'scale', title: 'Bid, ask, spread',
              text: 'Bid: best buyer. Ask: best seller. The gap between them is the spread — the cost of trading right now.' },
        ],
        u1l3: [
            { art: 'diversify', title: 'A share is a slice',
              text: 'Own 1 of 1,000,000 shares and you own one millionth of everything the company has and earns.' },
            { art: 'compound', title: 'Size = price × count',
              text: 'Share price alone means nothing. Market cap — price times share count — is what tells you how big a company is.' },
        ],
        u1l4: [
            { art: 'target', title: 'Checkpoint',
              text: 'Everything from this unit, mixed together. No new ideas — just proving you own the old ones.' },
        ],

        /* ── Unit 2 ── */
        u2l1: [
            { art: 'bond', title: 'Own it, or lend to it',
              text: 'A stock makes you an owner. A bond makes you a lender. Owners can win big and lose everything. Lenders get paid first.' },
            { art: 'clock', title: 'Rates move bond prices',
              text: 'When new bonds pay 5%, nobody pays full price for your old 3% one. Rates up, existing bond prices down.' },
        ],
        u2l2: [
            { art: 'diversify', title: 'Buy the haystack',
              text: 'An index fund holds everything in the index. No picking, no forecasting — which is why it costs almost nothing.' },
            { art: 'scale', title: 'Fees are certain',
              text: 'Returns are a hope. Fees are a promise. Over decades, a 1% fee quietly eats a quarter of your ending balance.' },
        ],
        u2l3: [
            { art: 'check', title: 'Checkpoint',
              text: 'Ownership, lending, and baskets. Prove it.' },
        ],

        /* ── Unit 3 ── */
        u3l1: [
            { art: 'scale', title: 'P/E: the price of profit',
              text: 'Price ÷ earnings per share. A P/E of 20 means you pay $20 for each $1 of yearly profit.' },
            { art: 'warning', title: 'Cheap can be a trap',
              text: 'A low P/E sometimes means a bargain — and sometimes means the market expects profits to collapse.' },
        ],
        u3l2: [
            { art: 'growth', title: 'Surprises move prices',
              text: 'Expectations are already in the price. Only the gap between expected and actual moves it. Good news can still mean a fall.' },
            { art: 'clock', title: 'Headlines are late',
              text: 'By the time you read it, the market has too. Trading on public news is racing people who finished an hour ago.' },
        ],
        u3l3: [
            { art: 'check', title: 'Checkpoint',
              text: 'Valuation and expectations. Show me.' },
        ],

        /* ── Unit 4 ── */
        u4l1: [
            { art: 'warning', title: 'Losses are heavier than gains',
              text: 'Lose 50% and you need +100% just to get back. The deeper the hole, the steeper the climb out.' },
            { art: 'risk', title: 'Drawdown is the pain measure',
              text: 'The fall from a peak to the low after it. Returns tell you where you ended. Drawdown tells you what you survived.' },
        ],
        u4l2: [
            { art: 'shield', title: 'Diversification, the free lunch',
              text: 'Spreading across things that do not move together removes company-specific disasters. It cannot remove market risk — nothing can.' },
            { art: 'diversify', title: '30 tech stocks is 1 bet',
              text: 'Real spread means different industries and asset types — not thirty flavours of the same thing.' },
        ],
        u4l3: [
            { art: 'check', title: 'Checkpoint',
              text: 'The maths of not blowing up.' },
        ],

        /* ── Unit 5 ── */
        u5l1: [
            { art: 'candles', title: 'Four prices per candle',
              text: 'Open, high, low, close. The body is open-to-close; the wicks reach the extremes.' },
            { art: 'growth', title: 'Charts are history books',
              text: 'They show what happened, brilliantly. They do not show what happens next. Nothing does.' },
        ],
        u5l2: [
            { art: 'risk', title: 'Axes can lie',
              text: 'Start the y-axis at $98 and a 1% dip looks like a cliff. Read the numbers, not the shape.' },
            { art: 'warning', title: 'Survivors look brilliant',
              text: '“Top 10 stocks of the decade” is a list of lottery winners. It cannot tell you the next ten.' },
        ],
        u5l3: [
            { art: 'check', title: 'Checkpoint',
              text: 'Charts, read honestly.' },
        ],

        /* ── Unit 6 ── */
        u6l1: [
            { art: 'compound', title: 'Returns earn returns',
              text: 'Year 20 earns on your money plus 19 years of gains. Time in the market beats timing it — mathematically.' },
            { art: 'clock', title: 'Rule of 72',
              text: '72 ÷ rate ≈ years to double. At 8%, about 9 years. Do it in your head, impress precisely no one.' },
        ],
        u6l2: [
            { art: 'brokenheart', title: 'You are the biggest risk',
              text: 'Buying high because it feels safe, selling low because it feels urgent. The gap that behaviour creates is self-inflicted.' },
            { art: 'target', title: 'The market ignores your entry',
              text: 'What you paid is invisible to everyone else. Decide based on what it is worth now.' },
        ],
        u6l3: [
            { art: 'trophy', title: 'Final checkpoint',
              text: 'Everything. Mixed. Go.' },
        ],
    };

    global.FTTeach = {
        for(lessonId) { return TEACH[lessonId] || null; },
        TEACH,
    };
})(typeof window !== 'undefined' ? window : this);
