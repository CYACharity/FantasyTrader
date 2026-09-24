/* ============================================================
 *  FT CURRICULUM — the academy's content.
 *
 *  Pure data. Every lesson is an array of exercises the engine
 *  knows how to render, so adding a lesson never means writing
 *  markup. Shape:
 *
 *    { id, title, blurb, icon, exercises: [ ... ] }
 *
 *  Exercise shapes:
 *    choice     { type, prompt, options:[{text,correct,why?,art?}], why, whyWrong }
 *    truefalse  { type, prompt, isTrue, why, whyWrong }
 *    match      { type, prompt, pairs:[[a,b],...], why }
 *    order      { type, prompt, steps:[...in correct order], why }
 *    build      { type, prompt, words:[...], answer:[...], why }
 *    fill       { type, prompt, sentence:'a ___ b', options:[...], answer, why }
 *    sort       { type, prompt, buckets:[...], items:[{text,bucket}], why }
 *    slider     { type, prompt, min,max,step,answer,tolerance,prefix,suffix, why }
 *    chart      { type, prompt, chart:{series:[[...]],caption,marker}, options:[...] }
 *
 *  Every claim in here is meant to be defensible. Where a number
 *  is a long-run average it is described as one, not as a promise.
 * ============================================================ */
(function (global) {
    'use strict';

    const UNITS = [

    /* ══════════════════════════════════════════════════════
     *  UNIT 1 — What a market actually is
     * ════════════════════════════════════════════════════ */
    {
        id: 'u1',
        title: 'What a market is',
        blurb: 'Who is on the other side, and why they are there',
        color: ['#5CB88A', '#3E8C65'],
        lessons: [
            {
                id: 'u1l1',
                title: 'Two sides of a trade',
                blurb: 'Every trade needs someone who disagrees with you',
                icon: 'market',
                exercises: [
                    {
                        type: 'choice', art: 'market',
                        prompt: 'What is a financial market for?',
                        options: [
                            { text: 'Connecting people with spare money to people who need it', correct: true },
                            { text: 'Making sure share prices rise over time' },
                            { text: 'Setting how much profit a company is allowed to make' },
                            { text: 'Storing money safely, like a bank vault' },
                        ],
                        why: 'That is the whole job. Savers have capital and want a return; companies and governments need capital and will pay for it. The market is the meeting place.',
                        whyWrong: 'A market has no opinion about prices going up. It just matches people who have capital with people who want it.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'For you to buy a share, somebody else has to be selling that exact share.',
                        isTrue: true,
                        why: 'Always. Every trade has two sides, and the person on the other side thinks selling was the smart move. That is worth remembering before you feel clever about a purchase.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match each player to what they want',
                        pairs: [
                            ['Investor', 'Has capital, wants a return on it'],
                            ['Company', 'Needs capital, will sell ownership for it'],
                            ['Exchange', 'Runs the venue where the two meet'],
                            ['Broker', 'Carries your order to the exchange'],
                        ],
                        why: 'Four roles, four different motives. Confusing them is how people end up thinking the exchange is on their side.',
                    },
                    {
                        type: 'choice',
                        prompt: 'A company sells new shares to the public for the first time. What is that called?',
                        options: [
                            { text: 'An IPO — initial public offering', correct: true },
                            { text: 'A dividend' },
                            { text: 'A short sale' },
                            { text: 'A stock split' },
                        ],
                        why: 'The company gets cash, the buyers get ownership. After that day the shares change hands between investors and the company gets nothing more from those trades.',
                    },
                    {
                        type: 'fill',
                        prompt: 'Complete the sentence',
                        sentence: 'When you buy a share on the exchange, your money goes to the ___, not to the company.',
                        options: ['previous owner', 'company', 'exchange', 'government'],
                        answer: 'previous owner',
                        why: 'A surprise to most people. Buying Apple stock does not fund Apple — it pays whoever sold it to you. Companies only raise money when they issue new shares.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Who needs capital, and who supplies it?',
                        buckets: ['Supplies capital', 'Needs capital'],
                        items: [
                            { text: 'A retiree with savings', bucket: 'Supplies capital' },
                            { text: 'A pension fund', bucket: 'Supplies capital' },
                            { text: 'You, buying a share', bucket: 'Supplies capital' },
                            { text: 'A startup building a factory', bucket: 'Needs capital' },
                            { text: 'A government funding a bridge', bucket: 'Needs capital' },
                            { text: 'An airline buying planes', bucket: 'Needs capital' },
                        ],
                        why: 'Capital flows from people who have more than they need right now to people who can put it to work.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'The stock market is closed on weekends, so nothing that happens on a Saturday can affect prices.',
                        isTrue: false,
                        why: 'News does not wait for the opening bell. It piles up over the weekend and shows up all at once in Monday\'s opening price — which is why gaps happen.',
                    },
                    {
                        type: 'choice',
                        prompt: 'Two investors look at the same company and the same numbers. One buys, one sells. Who is wrong?',
                        options: [
                            { text: 'Neither, necessarily — they can have different time horizons and needs', correct: true },
                            { text: 'The seller, since stocks rise long term' },
                            { text: 'The buyer, since someone is dumping it' },
                            { text: 'Whichever one has less money' },
                        ],
                        why: 'A seller might need cash for a house. A buyer might have thirty years. Same facts, different situations, both rational.',
                    },
                ],
            },
            {
                id: 'u1l2',
                title: 'Price is a vote count',
                blurb: 'Where the number on the screen comes from',
                icon: 'supply',
                exercises: [
                    {
                        type: 'choice', art: 'supply',
                        prompt: 'What sets the price of a share at this exact moment?',
                        options: [
                            { text: 'The highest price a buyer will pay meeting the lowest a seller will take', correct: true },
                            { text: 'The company\'s accountants' },
                            { text: 'The exchange, each morning' },
                            { text: 'A government regulator' },
                        ],
                        why: 'Price is just the last place buyers and sellers agreed. Nobody sets it. It is the score of an argument that never ends.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match the order-book terms',
                        pairs: [
                            ['Bid', 'The best price a buyer is offering'],
                            ['Ask', 'The best price a seller will accept'],
                            ['Spread', 'The gap between those two'],
                            ['Volume', 'How many shares actually changed hands'],
                        ],
                        why: 'A narrow spread and heavy volume means a liquid stock — easy to get in and out of without moving the price against yourself.',
                    },
                    {
                        type: 'slider',
                        prompt: 'A stock is bid at $49.90 and asked at $50.10. What is the spread, in cents?',
                        min: 0, max: 100, step: 5, start: 50,
                        answer: 20, tolerance: 0, suffix: '¢',
                        why: '$50.10 minus $49.90 is 20 cents. That gap is what you pay for the convenience of trading right now, and it is why frequent trading quietly bleeds money.',
                        whyWrong: 'Ask minus bid: $50.10 − $49.90 = $0.20, or 20 cents.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'If a stock has very low volume, a single large order can move its price a long way.',
                        isTrue: true,
                        why: 'Thin markets are jumpy. With few sellers nearby, a big buyer has to keep reaching for higher prices to fill the order.',
                    },
                    {
                        type: 'chart',
                        prompt: 'Which day had the biggest single-day fall?',
                        chart: {
                            series: [[100, 104, 103, 108, 96, 99, 101, 106]],
                            caption: 'Closing price, eight sessions',
                        },
                        options: [
                            { text: 'Day 5 — it dropped from 108 to 96', correct: true },
                            { text: 'Day 3' },
                            { text: 'Day 7' },
                            { text: 'Day 2' },
                        ],
                        why: 'From 108 down to 96 is a fall of about 11%. Nothing else on the chart comes close.',
                    },
                    {
                        type: 'order',
                        prompt: 'Put these in order, from first to last, when you place a market order',
                        steps: [
                            'You tap Buy in the app',
                            'Your broker routes the order',
                            'The exchange matches you with a seller',
                            'The trade settles and the shares are yours',
                        ],
                        why: 'It feels instant, but four things happen. Settlement is the slow part — in the US it is one business day after the trade.',
                    },
                    {
                        type: 'choice',
                        prompt: 'A stock closed at $50 yesterday and opens at $44 today, with no trades in between. Why?',
                        options: [
                            { text: 'News came out overnight and everyone repriced before the open', correct: true },
                            { text: 'The exchange lowered the price' },
                            { text: 'Somebody sold a very large block at 3am' },
                            { text: 'It is a mistake and will be reversed' },
                        ],
                        why: 'Gaps are information arriving while the market is shut. The price never traded between $50 and $44 — it simply reopened somewhere else.',
                    },
                    {
                        type: 'fill',
                        prompt: 'Complete the sentence',
                        sentence: 'A market order fills immediately at whatever price is available; a ___ order only fills at your price or better.',
                        options: ['limit', 'stop', 'day', 'block'],
                        answer: 'limit',
                        why: 'A limit order protects your price but may never fill. A market order guarantees the fill but not the price. Pick your risk.',
                    },
                ],
            },
            {
                id: 'u1l3',
                title: 'Owning a slice',
                blurb: 'What a share certificate actually entitles you to',
                icon: 'diversify',
                exercises: [
                    {
                        type: 'choice', art: 'wallet',
                        prompt: 'You own one share of a company with 1,000,000 shares outstanding. What do you own?',
                        options: [
                            { text: 'One millionth of the company', correct: true },
                            { text: 'A loan to the company that it must repay' },
                            { text: 'A right to a fixed annual payment' },
                            { text: 'A share of its bank account you can withdraw' },
                        ],
                        why: 'Ownership, not a loan. You own a genuine slice of everything the business owns and earns — proportional, and very small.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Which rights come with common stock?',
                        buckets: ['You get this', 'You do not'],
                        items: [
                            { text: 'A vote on board members', bucket: 'You get this' },
                            { text: 'A share of profits if a dividend is paid', bucket: 'You get this' },
                            { text: 'A claim on assets if the company is wound up', bucket: 'You get this' },
                            { text: 'Guaranteed repayment of what you paid', bucket: 'You do not' },
                            { text: 'A say in daily operations', bucket: 'You do not' },
                            { text: 'Free products from the company', bucket: 'You do not' },
                        ],
                        why: 'Shareholders hire the board and share in profits. They do not run the company and are not owed their money back.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'If a company goes bankrupt, shareholders are paid before bondholders.',
                        isTrue: false,
                        why: 'It is the opposite, and it matters enormously. Lenders are paid first, then preferred shareholders, then common shareholders get whatever is left — which is usually nothing.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match each term to its meaning',
                        pairs: [
                            ['Shares outstanding', 'How many slices the company has issued'],
                            ['Market cap', 'Share price × shares outstanding'],
                            ['Dividend', 'Cash paid out to shareholders'],
                            ['Buyback', 'Company buying its own shares back'],
                        ],
                        why: 'Market cap is what the market says the whole company is worth. Share price alone tells you nothing about size.',
                    },
                    {
                        type: 'slider',
                        prompt: 'A company has 40 million shares at $25 each. What is its market cap, in millions?',
                        min: 0, max: 2000, step: 50, start: 1000,
                        answer: 1000, tolerance: 0, prefix: '$', suffix: 'M',
                        why: '40 million × $25 = $1 billion. This is the number that tells you whether you are looking at a corner shop or a giant.',
                        whyWrong: 'Multiply shares by price: 40,000,000 × $25 = $1,000,000,000, so $1,000M.',
                    },
                    {
                        type: 'choice',
                        prompt: 'Company A trades at $500 a share, Company B at $5. Which is bigger?',
                        options: [
                            { text: 'Impossible to say without knowing the share count', correct: true },
                            { text: 'Company A, clearly' },
                            { text: 'Company B, because cheap shares mean more of them' },
                            { text: 'They are the same size' },
                        ],
                        why: 'Share price is arbitrary — it depends entirely on how many slices the pie was cut into. Only market cap tells you size.',
                    },
                    {
                        type: 'build',
                        prompt: 'Build the definition',
                        words: ['Market', 'cap', 'is', 'share', 'price', 'times', 'shares', 'outstanding'],
                        answer: ['Market', 'cap', 'is', 'share', 'price', 'times', 'shares', 'outstanding'],
                        why: 'Commit that one to memory. It is the single most useful number for sizing up a company at a glance.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'A stock split makes the company more valuable.',
                        isTrue: false,
                        why: 'Cutting a pizza into more slices does not give you more pizza. Twice as many shares at half the price is the same company, the same market cap.',
                    },
                ],
            },
            {
                id: 'u1l4',
                title: 'Unit 1 checkpoint',
                blurb: 'Everything so far, mixed together',
                icon: 'target',
                exercises: [
                    {
                        type: 'choice', art: 'target',
                        prompt: 'Which of these does buying a share on the exchange actually do?',
                        options: [
                            { text: 'Transfers ownership from another investor to you', correct: true },
                            { text: 'Gives the company cash to spend' },
                            { text: 'Lends the company money at interest' },
                            { text: 'Reserves you a dividend' },
                        ],
                        why: 'Secondary market trades move ownership between investors. The company is not part of it.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Sort these facts',
                        buckets: ['True', 'False'],
                        items: [
                            { text: 'Every trade has a buyer and a seller', bucket: 'True' },
                            { text: 'Market cap = price × share count', bucket: 'True' },
                            { text: 'Bondholders rank above shareholders in bankruptcy', bucket: 'True' },
                            { text: 'A high share price means a big company', bucket: 'False' },
                            { text: 'A stock split creates value', bucket: 'False' },
                            { text: 'The exchange sets the daily price', bucket: 'False' },
                        ],
                        why: 'The three false ones are the most common beginner mistakes. Getting them straight puts you ahead of most people at the pub.',
                    },
                    {
                        type: 'slider',
                        prompt: 'A stock is bid $19.95, asked $20.05. What does it cost you, in cents, to buy and immediately sell one share?',
                        min: 0, max: 60, step: 5, start: 30,
                        answer: 10, tolerance: 0, suffix: '¢',
                        why: 'You buy at the ask ($20.05) and sell at the bid ($19.95): 10 cents gone before the price moves at all. Do that a hundred times and the spread is your biggest expense.',
                        whyWrong: 'Buy at the ask, sell at the bid. $20.05 − $19.95 = 10 cents.',
                    },
                    {
                        type: 'match',
                        prompt: 'Final matching round',
                        pairs: [
                            ['IPO', 'First public sale of shares'],
                            ['Spread', 'Gap between bid and ask'],
                            ['Liquidity', 'How easily you can trade without moving price'],
                            ['Gap', 'Price jump between one close and the next open'],
                        ],
                        why: 'Four words you will now hear constantly and actually understand.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'Because someone sold you the share, they must know something you do not.',
                        isTrue: false,
                        why: 'Sometimes, but usually not. They may be retiring, rebalancing, or paying a tax bill. Assuming every seller is smarter than you is as wrong as assuming none of them are.',
                    },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════
     *  UNIT 2 — Stocks, bonds and everything else
     * ════════════════════════════════════════════════════ */
    {
        id: 'u2',
        title: 'Stocks and bonds',
        blurb: 'Ownership versus lending, and why the difference decides everything',
        color: ['#9DB8D2', '#5E7C9A'],
        lessons: [
            {
                id: 'u2l1',
                title: 'Own it or lend to it',
                blurb: 'The one distinction the rest of finance is built on',
                icon: 'bond',
                exercises: [
                    {
                        type: 'choice', art: 'bond',
                        prompt: 'You buy a corporate bond. What have you done?',
                        options: [
                            { text: 'Lent the company money in exchange for interest', correct: true },
                            { text: 'Bought a slice of ownership' },
                            { text: 'Bought the right to buy shares later' },
                            { text: 'Insured yourself against the company failing' },
                        ],
                        why: 'A bond is a loan with paperwork. You are a lender, not an owner, and lenders get paid first.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Ownership or lending?',
                        buckets: ['Ownership', 'Lending'],
                        items: [
                            { text: 'Common stock', bucket: 'Ownership' },
                            { text: 'Preferred stock', bucket: 'Ownership' },
                            { text: 'Corporate bond', bucket: 'Lending' },
                            { text: 'Government bond', bucket: 'Lending' },
                            { text: 'Savings account', bucket: 'Lending' },
                            { text: 'Equity in a startup', bucket: 'Ownership' },
                        ],
                        why: 'A savings account catches people out — you are lending money to a bank, which is why deposit insurance exists.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match the bond terms',
                        pairs: [
                            ['Principal', 'The amount lent, repaid at the end'],
                            ['Coupon', 'The interest payment'],
                            ['Maturity', 'The date you get the principal back'],
                            ['Yield', 'Your actual return at the price you paid'],
                        ],
                        why: 'Coupon is fixed at issue. Yield moves with the price you pay — buy a bond cheaply and your yield is higher than its coupon.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'When interest rates rise, the price of existing bonds falls.',
                        isTrue: true,
                        why: 'Why would anyone pay full price for your 3% bond when new ones pay 5%? They would not — so yours has to get cheaper. This is the single most important mechanic in bond investing.',
                    },
                    {
                        type: 'choice',
                        prompt: 'Which usually has more upside — and more risk of total loss?',
                        options: [
                            { text: 'Stock, because the payoff is unlimited but you rank last', correct: true },
                            { text: 'Bonds, because interest compounds' },
                            { text: 'They are identical in risk' },
                            { text: 'Neither can lose all its value' },
                        ],
                        why: 'A bond can at best pay what it promised. A stock can multiply many times over — or go to zero, since shareholders are last in the queue.',
                    },
                    {
                        type: 'fill',
                        prompt: 'Complete the sentence',
                        sentence: 'A bondholder is a ___, so they get paid before any shareholder sees a penny.',
                        options: ['creditor', 'partner', 'director', 'regulator'],
                        answer: 'creditor',
                        why: 'Creditors sit at the front of the queue. That priority is exactly what you are buying when you accept a lower expected return.',
                    },
                    {
                        type: 'slider',
                        prompt: 'You buy a $1,000 bond with a 5% coupon. How much interest do you receive each year?',
                        min: 0, max: 200, step: 5, start: 100,
                        answer: 50, tolerance: 0, prefix: '$',
                        why: '5% of $1,000 is $50 a year, usually paid in two instalments of $25.',
                        whyWrong: 'The coupon is a percentage of the principal: 5% × $1,000 = $50.',
                    },
                ],
            },
            {
                id: 'u2l2',
                title: 'Funds and ETFs',
                blurb: 'Buying a whole basket in one trade',
                icon: 'diversify',
                exercises: [
                    {
                        type: 'choice', art: 'diversify',
                        prompt: 'What is an index fund?',
                        options: [
                            { text: 'A fund that simply holds everything in an index, in the same proportions', correct: true },
                            { text: 'A fund run by a manager picking winners' },
                            { text: 'A fund that guarantees the index return' },
                            { text: 'A fund that only holds the best-performing stock' },
                        ],
                        why: 'No stock picking, no forecasting. It buys the haystack instead of hunting the needle, which is why it costs so little to run.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'Over long periods, most actively managed funds fail to beat their benchmark index after fees.',
                        isTrue: true,
                        why: 'This shows up year after year in the SPIVA scorecards. Skill exists, but fees are certain and outperformance is not.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match the fund terms',
                        pairs: [
                            ['ETF', 'A fund that trades on an exchange like a stock'],
                            ['Expense ratio', 'The annual fee, as a percent of assets'],
                            ['Index', 'A defined list of holdings, like the S&P 500'],
                            ['Diversification', 'Spreading money so one failure cannot ruin you'],
                        ],
                        why: 'Expense ratio is the number to check first. It is small, certain, and compounds against you every single year.',
                    },
                    {
                        type: 'slider',
                        prompt: 'Two funds hold the same thing. One charges 0.05%, the other 1.00%. On $10,000, what is the yearly fee difference in dollars?',
                        min: 0, max: 300, step: 5, start: 150,
                        answer: 95, tolerance: 5, prefix: '$',
                        why: '$100 versus $5, so $95 a year. Small on day one; over thirty years of compounding, it is a serious amount of money.',
                        whyWrong: '1.00% of $10,000 is $100; 0.05% is $5. The gap is $95 a year.',
                    },
                    {
                        type: 'choice',
                        prompt: 'You own an S&P 500 index fund. One of the 500 companies goes bankrupt. What happens to you?',
                        options: [
                            { text: 'You lose that small slice; the other 499 carry on', correct: true },
                            { text: 'The whole fund is wiped out' },
                            { text: 'You are forced to sell' },
                            { text: 'Nothing, funds are insured against this' },
                        ],
                        why: 'This is diversification doing its only job: making sure no single failure can take you out of the game.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Which of these reduce risk, and which just add cost?',
                        buckets: ['Reduces risk', 'Mostly adds cost'],
                        items: [
                            { text: 'Holding 500 companies not 1', bucket: 'Reduces risk' },
                            { text: 'Spreading across industries', bucket: 'Reduces risk' },
                            { text: 'Owning both stocks and bonds', bucket: 'Reduces risk' },
                            { text: 'Trading in and out weekly', bucket: 'Mostly adds cost' },
                            { text: 'Paying 1% for a stock picker', bucket: 'Mostly adds cost' },
                            { text: 'Owning ten funds that hold the same stocks', bucket: 'Mostly adds cost' },
                        ],
                        why: 'That last one is the trap. Ten overlapping funds is not diversification, it is the same bet with more paperwork.',
                    },
                    {
                        type: 'build',
                        prompt: 'Build the rule',
                        words: ['Fees', 'are', 'certain', 'returns', 'are', 'not'],
                        answer: ['Fees', 'are', 'certain', 'returns', 'are', 'not'],
                        why: 'The most reliable way to improve your long-run return is to stop paying for things that do not deliver.',
                    },
                ],
            },
            {
                id: 'u2l3',
                title: 'Unit 2 checkpoint',
                blurb: 'Ownership, lending and baskets',
                icon: 'check',
                exercises: [
                    {
                        type: 'sort',
                        prompt: 'Sort by who gets paid first if the company fails',
                        buckets: ['Paid earlier', 'Paid later'],
                        items: [
                            { text: 'Bondholders', bucket: 'Paid earlier' },
                            { text: 'Employees owed wages', bucket: 'Paid earlier' },
                            { text: 'Preferred shareholders', bucket: 'Paid later' },
                            { text: 'Common shareholders', bucket: 'Paid later' },
                        ],
                        why: 'The queue is the whole reason bonds are safer and stocks pay more. Risk and position in the queue are the same conversation.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'An ETF and an index fund can hold exactly the same thing and differ mainly in how you buy them.',
                        isTrue: true,
                        why: 'An ETF trades through the day like a stock; a traditional index fund prices once at the close. The underlying basket can be identical.',
                    },
                    {
                        type: 'choice',
                        prompt: 'Rates rise sharply. Which of your holdings most likely falls in price?',
                        options: [
                            { text: 'Your long-dated bonds', correct: true },
                            { text: 'Your cash' },
                            { text: 'Nothing — rates only affect banks' },
                            { text: 'Only foreign holdings' },
                        ],
                        why: 'The longer a bond has to run, the more its price has to fall to compete with new higher-paying bonds.',
                    },
                    {
                        type: 'slider',
                        prompt: 'Roughly how many US-listed stocks and ETFs are in FantasyTrader\'s universe?',
                        min: 500, max: 9000, step: 500, start: 3000,
                        answer: 5000, tolerance: 500,
                        why: 'About 5,000 — the full listed market, not a curated shortlist. Your draft board is the real thing.',
                        whyWrong: 'It is around 5,000 tickers.',
                    },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════
     *  UNIT 3 — Price versus value
     * ════════════════════════════════════════════════════ */
    {
        id: 'u3',
        title: 'Price versus value',
        blurb: 'Why a $3 stock can be expensive and a $900 one cheap',
        color: ['#E0A24C', '#B37C33'],
        lessons: [
            {
                id: 'u3l1',
                title: 'What you pay for a dollar of profit',
                blurb: 'The P/E ratio, and what it does not tell you',
                icon: 'scale',
                exercises: [
                    {
                        type: 'choice', art: 'scale',
                        prompt: 'A company earns $2 per share and trades at $40. What is its P/E ratio?',
                        options: [
                            { text: '20', correct: true },
                            { text: '2' },
                            { text: '80' },
                            { text: '0.05' },
                        ],
                        why: 'Price divided by earnings: $40 ÷ $2 = 20. You are paying $20 for each $1 of annual profit.',
                    },
                    {
                        type: 'fill',
                        prompt: 'Complete the sentence',
                        sentence: 'A high P/E means investors expect earnings to ___ in the future.',
                        options: ['grow', 'shrink', 'stay flat', 'disappear'],
                        answer: 'grow',
                        why: 'Nobody pays 60× today\'s profit for a business they think is finished. A high multiple is a forecast — and forecasts can be wrong.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'A low P/E always means a stock is a bargain.',
                        isTrue: false,
                        why: 'Sometimes it means the market expects earnings to collapse. Cheap-looking companies in dying industries are called value traps for good reason.',
                    },
                    {
                        type: 'slider',
                        prompt: 'A company trades at $60 with a P/E of 15. What are its earnings per share?',
                        min: 0, max: 20, step: 1, start: 10,
                        answer: 4, tolerance: 0, prefix: '$',
                        why: 'Rearrange it: EPS = price ÷ P/E = $60 ÷ 15 = $4.',
                        whyWrong: 'Price ÷ P/E gives EPS: $60 ÷ 15 = $4.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match each ratio to what it compares',
                        pairs: [
                            ['P/E', 'Price against annual profit'],
                            ['Dividend yield', 'Annual dividend against price'],
                            ['P/B', 'Price against book value'],
                            ['Market cap', 'Price against nothing — it is total size'],
                        ],
                        why: 'Every ratio is a comparison. Knowing what sits on each side stops you comparing things that do not belong together.',
                    },
                    {
                        type: 'choice',
                        prompt: 'Which comparison is actually useful?',
                        options: [
                            { text: 'A bank\'s P/E against other banks', correct: true },
                            { text: 'A bank\'s P/E against a biotech startup' },
                            { text: 'A share price against another share price' },
                            { text: 'This year\'s price against last year\'s price' },
                        ],
                        why: 'Multiples only mean something inside an industry. Comparing a utility to a software company tells you about the industries, not the companies.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Does this tell you about size, or about how expensive it is?',
                        buckets: ['Size', 'How expensive'],
                        items: [
                            { text: 'Market cap', bucket: 'Size' },
                            { text: 'Revenue', bucket: 'Size' },
                            { text: 'P/E ratio', bucket: 'How expensive' },
                            { text: 'Dividend yield', bucket: 'How expensive' },
                            { text: 'Share price alone', bucket: 'Size' },
                        ],
                        why: 'Share price alone is the odd one out — it genuinely tells you almost nothing on its own, which is why it sits awkwardly here.',
                    },
                ],
            },
            {
                id: 'u3l2',
                title: 'Why prices move',
                blurb: 'Expectations, not news',
                icon: 'growth',
                exercises: [
                    {
                        type: 'choice', art: 'growth',
                        prompt: 'A company reports record profits and the stock falls 8%. How?',
                        options: [
                            { text: 'The profits were record-breaking but below what the market expected', correct: true },
                            { text: 'Record profits always cause selling' },
                            { text: 'The exchange made an error' },
                            { text: 'It is impossible for that to happen' },
                        ],
                        why: 'Prices already contain expectations. What moves them is the difference between what happened and what was assumed — not whether the news was good.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'By the time you read good news in a headline, the price has usually already moved.',
                        isTrue: true,
                        why: 'Widely known information is already in the price. That is the practical version of market efficiency, and it is why trading on headlines rarely works.',
                    },
                    {
                        type: 'chart',
                        prompt: 'Earnings were announced on the marked day. What most likely happened?',
                        chart: {
                            series: [[50, 51, 50, 52, 51, 62, 63, 61]],
                            caption: 'Price around an earnings announcement',
                            marker: 5,
                        },
                        options: [
                            { text: 'Results beat expectations, and the price reset higher', correct: true },
                            { text: 'The company issued more shares' },
                            { text: 'A dividend was paid' },
                            { text: 'The stock split' },
                        ],
                        why: 'A sharp step up that holds is the signature of a genuine surprise being priced in — the market moved to a new level, it did not drift there.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Would this move a share price?',
                        buckets: ['Likely moves it', 'Probably already priced in'],
                        items: [
                            { text: 'A surprise CEO resignation', bucket: 'Likely moves it' },
                            { text: 'An unexpected earnings miss', bucket: 'Likely moves it' },
                            { text: 'A well-telegraphed product launch', bucket: 'Probably already priced in' },
                            { text: 'A rate decision everyone predicted', bucket: 'Probably already priced in' },
                            { text: 'A surprise lawsuit', bucket: 'Likely moves it' },
                        ],
                        why: 'Surprise is the active ingredient. Expected news is already in the number on the screen.',
                    },
                    {
                        type: 'build',
                        prompt: 'Build the principle',
                        words: ['Prices', 'move', 'on', 'surprises', 'not', 'on', 'news'],
                        answer: ['Prices', 'move', 'on', 'surprises', 'not', 'on', 'news'],
                        why: 'Keep this one close. It explains almost every "but the news was good!" moment you will ever have.',
                    },
                    {
                        type: 'choice',
                        prompt: 'Over a single day, how predictable is a given stock\'s direction?',
                        options: [
                            { text: 'Close to a coin flip', correct: true },
                            { text: 'Highly predictable from chart patterns' },
                            { text: 'Predictable if you read enough news' },
                            { text: 'Always follows the previous day' },
                        ],
                        why: 'Short horizons are dominated by noise. The longer your horizon, the more the actual business performance shows through.',
                    },
                ],
            },
            {
                id: 'u3l3',
                title: 'Unit 3 checkpoint',
                blurb: 'Valuation and expectations',
                icon: 'check',
                exercises: [
                    {
                        type: 'slider',
                        prompt: 'A stock is $75 with EPS of $3. What is its P/E?',
                        min: 0, max: 60, step: 1, start: 30,
                        answer: 25, tolerance: 0,
                        why: '$75 ÷ $3 = 25.',
                        whyWrong: 'Price ÷ EPS: $75 ÷ $3 = 25.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'Two companies with the same share price are equally valuable.',
                        isTrue: false,
                        why: 'Share price without share count is meaningless. Market cap is the comparison you want.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match the idea to the sentence that captures it',
                        pairs: [
                            ['Value trap', 'Cheap for a reason, and getting cheaper'],
                            ['Priced in', 'Everyone already knows, so it is in the number'],
                            ['Surprise', 'The gap between expectation and reality'],
                            ['Multiple', 'What you pay per dollar of something'],
                        ],
                        why: 'Four ideas that between them explain most day-to-day price behaviour.',
                    },
                    {
                        type: 'choice',
                        prompt: 'What is the most honest thing you can say about tomorrow\'s price?',
                        options: [
                            { text: 'It is roughly a coin flip, and that is fine', correct: true },
                            { text: 'It will follow today\'s trend' },
                            { text: 'It depends on the chart pattern' },
                            { text: 'It will revert to the average' },
                        ],
                        why: 'Accepting this is what frees you to focus on the things that actually compound: business quality, costs, and time.',
                    },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════
     *  UNIT 4 — Risk, and what it actually costs
     * ════════════════════════════════════════════════════ */
    {
        id: 'u4',
        title: 'Risk and ruin',
        blurb: 'Volatility, drawdowns, and the maths that never forgives',
        color: ['#D9645C', '#A6443D'],
        lessons: [
            {
                id: 'u4l1',
                title: 'The recovery problem',
                blurb: 'Why a 50% loss needs a 100% gain',
                icon: 'warning',
                exercises: [
                    {
                        type: 'choice', art: 'warning',
                        prompt: 'You lose 50%. What gain do you need just to get back to even?',
                        options: [
                            { text: '100%', correct: true },
                            { text: '50%' },
                            { text: '75%' },
                            { text: '25%' },
                        ],
                        why: '$100 falls to $50. Getting from $50 back to $100 is a double. Losses and gains are not symmetrical, and that asymmetry is the whole argument for not blowing up.',
                    },
                    {
                        type: 'slider',
                        prompt: 'You lose 20%. What percentage gain gets you back to even?',
                        min: 0, max: 60, step: 5, start: 30,
                        answer: 25, tolerance: 0, suffix: '%',
                        why: '$100 → $80. To get from $80 back to $100 you need $20 on a base of $80, which is 25%.',
                        whyWrong: 'From $80 you need $20, and $20 ÷ $80 = 25%.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'A portfolio that gains 50% then loses 50% ends up where it started.',
                        isTrue: false,
                        why: '$100 → $150 → $75. You are down 25%. Percentages do not cancel, because the second one applies to a bigger number.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Which of these can actually take you to zero?',
                        buckets: ['Can go to zero', 'Cannot go to zero'],
                        items: [
                            { text: 'A single company\'s stock', bucket: 'Can go to zero' },
                            { text: 'A leveraged bet', bucket: 'Can go to zero' },
                            { text: 'A broad index fund', bucket: 'Cannot go to zero' },
                            { text: 'A government bond of a stable country', bucket: 'Cannot go to zero' },
                        ],
                        why: 'Individual companies fail all the time. For a broad index to hit zero, every company in it would have to fail at once.',
                    },
                    {
                        type: 'choice',
                        prompt: 'What does "drawdown" measure?',
                        options: [
                            { text: 'The fall from a peak to the low that follows it', correct: true },
                            { text: 'How much you withdrew this year' },
                            { text: 'Your annual return' },
                            { text: 'The fee your broker charges' },
                        ],
                        why: 'Drawdown is the pain measure. Average return tells you where you ended; drawdown tells you what you had to sit through to get there.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match the risk words',
                        pairs: [
                            ['Volatility', 'How much the price bounces around'],
                            ['Drawdown', 'Peak to trough fall'],
                            ['Concentration', 'Too much in one thing'],
                            ['Leverage', 'Using borrowed money to size up'],
                        ],
                        why: 'Volatility is discomfort. Concentration and leverage are the two that actually end accounts.',
                    },
                ],
            },
            {
                id: 'u4l2',
                title: 'Don\'t put it all on one',
                blurb: 'Diversification, and its limits',
                icon: 'shield',
                exercises: [
                    {
                        type: 'choice', art: 'shield',
                        prompt: 'What does diversification actually protect you from?',
                        options: [
                            { text: 'One company\'s specific disaster ruining you', correct: true },
                            { text: 'The whole market falling' },
                            { text: 'Ever losing money' },
                            { text: 'Inflation' },
                        ],
                        why: 'It removes company-specific risk. It cannot remove market risk — in a crash, most things fall together, and that is the risk you are paid to take.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'Owning thirty stocks that are all software companies is well diversified.',
                        isTrue: false,
                        why: 'Thirty bets on one industry is one bet wearing a disguise. Real diversification spreads across things that do not move together.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Company-specific risk, or market-wide risk?',
                        buckets: ['Company-specific', 'Market-wide'],
                        items: [
                            { text: 'A factory fire', bucket: 'Company-specific' },
                            { text: 'A failed drug trial', bucket: 'Company-specific' },
                            { text: 'Accounting fraud', bucket: 'Company-specific' },
                            { text: 'A rise in interest rates', bucket: 'Market-wide' },
                            { text: 'A recession', bucket: 'Market-wide' },
                            { text: 'A global pandemic', bucket: 'Market-wide' },
                        ],
                        why: 'Only the left column can be diversified away. The right column is the price of admission for owning risky assets at all.',
                    },
                    {
                        type: 'slider',
                        prompt: 'You put your whole $10,000 into one stock and it falls 40%. How much is left?',
                        min: 0, max: 10000, step: 500, start: 5000,
                        answer: 6000, tolerance: 0, prefix: '$',
                        why: 'A 40% fall leaves 60%: $6,000. Had that been one of fourteen equal positions, the same disaster would have cost you under 3% of the portfolio.',
                        whyWrong: '$10,000 × 0.60 = $6,000.',
                    },
                    {
                        type: 'choice',
                        prompt: 'In FantasyTrader a roster is 14 stocks. Why not 1?',
                        options: [
                            { text: 'So one bad pick cannot decide your whole season', correct: true },
                            { text: 'To make the draft take longer' },
                            { text: 'Because exchanges require it' },
                            { text: 'To increase fees' },
                        ],
                        why: 'Fourteen slots forces the same discipline real portfolios need: enough spread that a single mistake is survivable.',
                    },
                    {
                        type: 'build',
                        prompt: 'Build the rule',
                        words: ['Diversify', 'the', 'risks', 'you', 'are', 'not', 'paid', 'to', 'take'],
                        answer: ['Diversify', 'the', 'risks', 'you', 'are', 'not', 'paid', 'to', 'take'],
                        why: 'You are compensated for market risk. You are not compensated for betting everything on one ticker.',
                    },
                ],
            },
            {
                id: 'u4l3',
                title: 'Unit 4 checkpoint',
                blurb: 'The maths of not blowing up',
                icon: 'check',
                exercises: [
                    {
                        type: 'slider',
                        prompt: 'You lose 75%. What gain do you need to recover?',
                        min: 0, max: 500, step: 25, start: 200,
                        answer: 300, tolerance: 0, suffix: '%',
                        why: '$100 → $25. Getting back to $100 from $25 is a quadruple: a 300% gain. This is why deep losses are so hard to undo.',
                        whyWrong: 'From $25 you need $75 more, and $75 ÷ $25 = 300%.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'Diversification lowers your expected return to zero.',
                        isTrue: false,
                        why: 'It lowers the variance around your outcome, not the expected return of the market itself. That is close to the only free lunch in finance.',
                    },
                    {
                        type: 'choice',
                        prompt: 'Which portfolio is most likely to survive a bad decade?',
                        options: [
                            { text: 'Spread across industries and asset types, no leverage', correct: true },
                            { text: 'All in on the best performer of last year' },
                            { text: 'Borrowed money in three hot stocks' },
                            { text: 'Whatever is most talked about online' },
                        ],
                        why: 'Surviving is the prerequisite for compounding. Everything else is optional.',
                    },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════
     *  UNIT 5 — Reading a chart honestly
     * ════════════════════════════════════════════════════ */
    {
        id: 'u5',
        title: 'Reading charts',
        blurb: 'What a chart can tell you, and the much longer list of what it cannot',
        color: ['#A98BD0', '#7A5EA8'],
        lessons: [
            {
                id: 'u5l1',
                title: 'Candles and lines',
                blurb: 'Four numbers in every candle',
                icon: 'candles',
                exercises: [
                    {
                        type: 'choice', art: 'candles',
                        prompt: 'A single candlestick shows four prices. Which four?',
                        options: [
                            { text: 'Open, high, low, close', correct: true },
                            { text: 'Bid, ask, spread, volume' },
                            { text: 'Yesterday, today, tomorrow, average' },
                            { text: 'Buy, sell, hold, target' },
                        ],
                        why: 'The body spans open to close, the wicks reach the high and low. Four numbers, one shape.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'A long upper wick means the price went higher during the session but did not stay there.',
                        isTrue: true,
                        why: 'Buyers pushed it up, sellers pushed it back. The wick is the record of an argument the sellers won.',
                    },
                    {
                        type: 'chart',
                        prompt: 'Between day 1 and day 8, what did this stock do overall?',
                        chart: {
                            series: [[80, 96, 88, 101, 92, 105, 97, 110]],
                            caption: 'Eight sessions, closing prices',
                        },
                        options: [
                            { text: 'Rose overall, with sharp pullbacks along the way', correct: true },
                            { text: 'Fell steadily' },
                            { text: 'Went nowhere' },
                            { text: 'Rose in a straight line' },
                        ],
                        why: '80 to 110 is up about 38%, but it gave back ground four separate times. Almost nothing rises in a straight line, and expecting it to is how people panic at the first dip.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match the chart terms',
                        pairs: [
                            ['Support', 'A level where buyers have repeatedly stepped in'],
                            ['Resistance', 'A level where sellers have repeatedly appeared'],
                            ['Trend', 'The general direction over a period'],
                            ['Volume', 'How much actually traded'],
                        ],
                        why: 'These describe what already happened. None of them promise what happens next.',
                    },
                    {
                        type: 'choice',
                        prompt: 'The same stock looks like a disaster on a 1-day chart and a triumph on a 5-year chart. Which is true?',
                        options: [
                            { text: 'Both — the timeframe you pick decides the story you see', correct: true },
                            { text: 'The 1-day chart, it is more current' },
                            { text: 'The 5-year chart, it has more data' },
                            { text: 'Neither, charts are unreliable' },
                        ],
                        why: 'This is the most quietly manipulative thing about charts. Always check what window you are being shown before you draw a conclusion.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Can a chart tell you this?',
                        buckets: ['A chart shows this', 'A chart cannot show this'],
                        items: [
                            { text: 'What the price did last month', bucket: 'A chart shows this' },
                            { text: 'How volatile it has been', bucket: 'A chart shows this' },
                            { text: 'Where it will be next month', bucket: 'A chart cannot show this' },
                            { text: 'Whether the business is any good', bucket: 'A chart cannot show this' },
                            { text: 'Whether management is honest', bucket: 'A chart cannot show this' },
                        ],
                        why: 'A chart is a history book, not a crystal ball. Everything in the right column requires reading about the actual business.',
                    },
                ],
            },
            {
                id: 'u5l2',
                title: 'Ways a chart lies',
                blurb: 'Axes, windows and survivors',
                icon: 'risk',
                exercises: [
                    {
                        type: 'choice', art: 'risk',
                        prompt: 'A chart\'s y-axis starts at $98 instead of $0, and the line looks like a cliff. What is going on?',
                        options: [
                            { text: 'A truncated axis exaggerates a small move', correct: true },
                            { text: 'The stock genuinely collapsed' },
                            { text: 'It is a data error' },
                            { text: 'The axis makes no difference' },
                        ],
                        why: 'A move from $100 to $99 can be made to look catastrophic by zooming the axis. Always read the numbers on the side, not the shape.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'A chart of "the ten best stocks of the last decade" tells you what to buy now.',
                        isTrue: false,
                        why: 'That is survivorship bias. You are looking at the winners precisely because they won. The same screen a decade ago would have listed different names.',
                    },
                    {
                        type: 'match',
                        prompt: 'Match the trap to what it does',
                        pairs: [
                            ['Truncated axis', 'Makes small moves look enormous'],
                            ['Cherry-picked window', 'Starts at whatever date proves the point'],
                            ['Survivorship bias', 'Shows only the ones that made it'],
                            ['Log vs linear', 'Changes how growth appears over long spans'],
                        ],
                        why: 'None of these are lies exactly. They are choices — and the person choosing usually wants something from you.',
                    },
                    {
                        type: 'chart',
                        prompt: 'Two funds, same decade. Which statement is fair?',
                        chart: {
                            series: [
                                [100, 108, 118, 112, 130, 141, 138, 155],
                                [100, 126, 96, 140, 88, 150, 92, 158],
                            ],
                            caption: 'Green: steady fund. Honey: volatile fund. Both end near the same place.',
                        },
                        options: [
                            { text: 'They ended similarly, but the second was far harder to hold', correct: true },
                            { text: 'The second fund is clearly better' },
                            { text: 'The first fund lost money' },
                            { text: 'They are identical investments' },
                        ],
                        why: 'Same destination, very different journey. Most people sell the honey line somewhere near the bottom of one of those dips and never see the recovery.',
                    },
                    {
                        type: 'build',
                        prompt: 'Build the warning',
                        words: ['Past', 'performance', 'is', 'not', 'a', 'promise'],
                        answer: ['Past', 'performance', 'is', 'not', 'a', 'promise'],
                        why: 'It is on every fund document for a reason. The reason is that it is true.',
                    },
                ],
            },
            {
                id: 'u5l3',
                title: 'Unit 5 checkpoint',
                blurb: 'Charts, honestly read',
                icon: 'check',
                exercises: [
                    {
                        type: 'chart',
                        prompt: 'What is the largest drawdown on this chart, roughly?',
                        chart: {
                            series: [[100, 120, 140, 130, 84, 92, 110, 125]],
                            caption: 'Peak at 140, trough after',
                        },
                        options: [
                            { text: 'About 40% — from 140 down to 84', correct: true },
                            { text: 'About 16%' },
                            { text: 'About 60%' },
                            { text: 'There is no drawdown' },
                        ],
                        why: '140 to 84 is a fall of 56, and 56 ÷ 140 = 40%. Note it needed a 67% gain from the low just to reach the old peak.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'A line going up and to the right proves the business is healthy.',
                        isTrue: false,
                        why: 'Price can rise on hype alone, and healthy businesses can have terrible years. The chart and the business are related, but they are not the same thing.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Fair presentation, or misleading?',
                        buckets: ['Fair', 'Misleading'],
                        items: [
                            { text: 'Axis starting at zero', bucket: 'Fair' },
                            { text: 'Showing the full available history', bucket: 'Fair' },
                            { text: 'Starting the chart at the exact bottom', bucket: 'Misleading' },
                            { text: 'Only showing funds that still exist', bucket: 'Misleading' },
                        ],
                        why: 'When someone shows you a chart, the first question is always: why did they choose that window?',
                    },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════
     *  UNIT 6 — Behaviour, the part that actually decides it
     * ════════════════════════════════════════════════════ */
    {
        id: 'u6',
        title: 'Your own worst enemy',
        blurb: 'The behaviour gap, and how to close it',
        color: ['#5CB88A', '#E0A24C'],
        lessons: [
            {
                id: 'u6l1',
                title: 'Time in, not timing',
                blurb: 'Why compounding rewards sitting still',
                icon: 'compound',
                exercises: [
                    {
                        type: 'choice', art: 'compound',
                        prompt: 'What does compounding mean?',
                        options: [
                            { text: 'Returns earning returns of their own', correct: true },
                            { text: 'Adding more money every month' },
                            { text: 'Trading more frequently' },
                            { text: 'Reducing your fees' },
                        ],
                        why: 'Year one earns on your money. Year twenty earns on your money plus nineteen years of accumulated gains. That curve is why starting early beats being clever.',
                    },
                    {
                        type: 'slider',
                        prompt: '$1,000 growing at 10% a year. Roughly how many years to double?',
                        min: 1, max: 20, step: 1, start: 10,
                        answer: 7, tolerance: 1, suffix: ' yrs',
                        why: 'The rule of 72: divide 72 by the rate. 72 ÷ 10 ≈ 7.2 years. A handy piece of mental arithmetic.',
                        whyWrong: 'Rule of 72: 72 ÷ 10 ≈ 7 years.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'Missing just the ten best days in a decade barely affects your return.',
                        isTrue: false,
                        why: 'It affects it dramatically. The best days cluster near the worst ones, so people who sell during panics tend to miss the rebound — which is where a large share of long-run returns lives.',
                    },
                    {
                        type: 'order',
                        prompt: 'Order these from most reliable to least reliable as a way to build wealth',
                        steps: [
                            'Save consistently over decades',
                            'Keep costs low',
                            'Stay invested through downturns',
                            'Pick individual winning stocks',
                        ],
                        why: 'The first three are within your control and work almost every time. The fourth is the one everyone talks about, and the least dependable.',
                    },
                    {
                        type: 'choice',
                        prompt: 'Which costs more over thirty years?',
                        options: [
                            { text: 'A 1% annual fee, quietly, every year', correct: true },
                            { text: 'One bad year of −20%' },
                            { text: 'A single missed opportunity' },
                            { text: 'Paying a $10 trade commission' },
                        ],
                        why: 'A bad year is loud and recoverable. A 1% fee is silent and permanent, and over thirty years it can consume a quarter of your final balance.',
                    },
                ],
            },
            {
                id: 'u6l2',
                title: 'The mistakes everyone makes',
                blurb: 'Naming them makes them easier to spot',
                icon: 'brokenheart',
                exercises: [
                    {
                        type: 'match',
                        prompt: 'Match the bias to the behaviour',
                        pairs: [
                            ['Loss aversion', 'Holding a loser to avoid admitting it'],
                            ['Recency bias', 'Assuming the last few months continue'],
                            ['Confirmation bias', 'Only reading what agrees with you'],
                            ['Herding', 'Buying because everyone else is'],
                        ],
                        why: 'You will not eliminate these. But naming one while it is happening is usually enough to slow you down.',
                    },
                    {
                        type: 'choice',
                        prompt: 'A stock you own drops 30%. What is the most useful question?',
                        options: [
                            { text: '"Has anything changed about the business?"', correct: true },
                            { text: '"When will it get back to what I paid?"' },
                            { text: '"How much do I need to double down to break even?"' },
                            { text: '"What is everyone saying online?"' },
                        ],
                        why: 'The price you paid is a fact about your past, not about the company. The market does not know or care what your entry price was.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'Selling a winner and holding a loser is a well-documented pattern in real investor behaviour.',
                        isTrue: true,
                        why: 'It is called the disposition effect. Booking a gain feels like being right; booking a loss feels like being wrong — so people do the first and postpone the second.',
                    },
                    {
                        type: 'sort',
                        prompt: 'Process or impulse?',
                        buckets: ['Process', 'Impulse'],
                        items: [
                            { text: 'Deciding your allocation in advance', bucket: 'Process' },
                            { text: 'Rebalancing on a schedule', bucket: 'Process' },
                            { text: 'Writing down why you bought', bucket: 'Process' },
                            { text: 'Buying after a big green day', bucket: 'Impulse' },
                            { text: 'Selling everything during a crash', bucket: 'Impulse' },
                            { text: 'Copying a stranger online', bucket: 'Impulse' },
                        ],
                        why: 'Nothing in the left column requires being smart. It requires deciding once, calmly, and then not renegotiating with yourself at the worst moment.',
                    },
                    {
                        type: 'build',
                        prompt: 'Build the idea',
                        words: ['The', 'market', 'does', 'not', 'know', 'what', 'you', 'paid'],
                        answer: ['The', 'market', 'does', 'not', 'know', 'what', 'you', 'paid'],
                        why: 'Your cost basis is invisible to everyone else. Decisions should rest on what a thing is worth now, not on getting even.',
                    },
                    {
                        type: 'choice',
                        prompt: 'What is the "behaviour gap"?',
                        options: [
                            { text: 'The difference between a fund\'s return and what its investors actually earned', correct: true },
                            { text: 'The spread between bid and ask' },
                            { text: 'The gap between two chart points' },
                            { text: 'The fee a broker charges' },
                        ],
                        why: 'Investors routinely earn less than the funds they own, because they buy after rises and sell after falls. The gap is self-inflicted, and it is the easiest one to fix.',
                    },
                ],
            },
            {
                id: 'u6l3',
                title: 'Final checkpoint',
                blurb: 'Everything, mixed',
                icon: 'trophy',
                exercises: [
                    {
                        type: 'choice', art: 'trophy',
                        prompt: 'Of these, which is most within your control?',
                        options: [
                            { text: 'What you pay in fees and how often you trade', correct: true },
                            { text: 'Next year\'s market return' },
                            { text: 'Which stock will lead the decade' },
                            { text: 'When the next recession starts' },
                        ],
                        why: 'Spend your energy where you have influence. The rest is weather.',
                    },
                    {
                        type: 'slider',
                        prompt: 'Rule of 72: at 8% a year, roughly how many years to double your money?',
                        min: 1, max: 24, step: 1, start: 12,
                        answer: 9, tolerance: 1, suffix: ' yrs',
                        why: '72 ÷ 8 = 9 years.',
                        whyWrong: '72 ÷ 8 = 9.',
                    },
                    {
                        type: 'sort',
                        prompt: 'One last sort — helps or hurts long-run returns?',
                        buckets: ['Helps', 'Hurts'],
                        items: [
                            { text: 'Low fees', bucket: 'Helps' },
                            { text: 'Broad diversification', bucket: 'Helps' },
                            { text: 'A long time horizon', bucket: 'Helps' },
                            { text: 'Frequent trading', bucket: 'Hurts' },
                            { text: 'Concentration in one hot name', bucket: 'Hurts' },
                            { text: 'Selling in a panic', bucket: 'Hurts' },
                        ],
                        why: 'Six items. The three on the left are boring, free, and available to everyone — which is exactly why they work.',
                    },
                    {
                        type: 'truefalse',
                        prompt: 'FantasyTrader uses real market prices, but no real money is ever at risk.',
                        isTrue: true,
                        why: 'Real prices, real consequences to your decisions, zero financial risk. That is the whole point of practising here first.',
                    },
                ],
            },
        ],
    },

    ];

    /* ── flatten helpers the pages use ─────────────────────── */
    function allLessons() {
        const out = [];
        UNITS.forEach(u => u.lessons.forEach((l, i) =>
            out.push(Object.assign({ unitId: u.id, unitTitle: u.title, index: i }, l))));
        return out;
    }
    function lessonById(id) {
        return allLessons().find(l => l.id === id) || null;
    }
    function stats() {
        const ls = allLessons();
        return {
            units: UNITS.length,
            lessons: ls.length,
            exercises: ls.reduce((a, l) => a + l.exercises.length, 0),
        };
    }

    global.FTCurriculum = { UNITS, allLessons, lessonById, stats };
})(typeof window !== 'undefined' ? window : this);
