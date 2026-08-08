// Generates the Investing + Alternatives track module pages and path pages.
// Run: node scripts/gen-modules.js   (from the project root)
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const TRACKS = {
  investing: {
    name: 'Long-Term Investing', accent: '#E0A24C',
    tagline: 'Build wealth patiently — valuation, quality, and time in the market.',
    modules: [
      { level: 'Beginner', title: 'Why Long-Term Investing Works',
        sections: [
          ['The power of compounding', `Compounding is what happens when your returns start earning returns of their own. Invest $10,000 at 8% and you earn $800 in year one — but in year two you earn 8% on $10,800, and so on. Left alone for 30 years, that $10,000 becomes roughly $100,000 without a single additional deposit. The curve starts slow and bends upward violently: most of the money arrives in the final third of the journey. That is why the most valuable asset a long-term investor owns isn't a hot stock — it's time. Starting ten years earlier routinely beats picking better stocks ten years later.`],
          ['Time in the market beats timing the market', `It feels smart to wait for a crash before buying, but the data is brutal on market timers. Missing just the 10 best days in the S&P 500 over a 20-year stretch roughly cuts your total return in half — and those best days tend to cluster right next to the worst ones, when fear is highest. A long-term investor sidesteps the whole game: by staying invested through the noise, you're guaranteed to catch every recovery. Volatility becomes the price of admission rather than a reason to leave.`],
          ['Your real enemies: fees, taxes, and panic', `Long-term returns get eaten by three quiet forces. A 1% annual fee sounds tiny but consumes roughly a quarter of your wealth over 30 years. Frequent selling triggers taxes that compound against you. And panic — selling after a 30% drop — converts a temporary decline into a permanent loss. The playbook that survives all three: buy broadly, hold stubbornly, keep costs near zero, and automate your contributions so your emotions never get a vote.`],
        ],
        quiz: [
          ['What makes compounding so powerful over long periods?', ['Returns are guaranteed by the government', 'Your returns begin earning returns of their own', 'Stocks only go up in the long run'], 1],
          ['What happens if you miss the 10 best market days over 20 years?', ['Almost nothing — 10 days is trivial', 'Your total return is roughly cut in half', 'You avoid the 10 worst days automatically'], 1],
          ['Which is a real threat to long-term returns?', ['High annual fees', 'Market holidays', 'Dividend payments'], 0],
        ]},
      { level: 'Beginner', title: 'Index Funds & Diversification',
        sections: [
          ['Owning everything at once', `An index fund buys every company in a market index — the S&P 500 fund holds all 500 firms in one share. You stop betting on any single business and start betting on the economy itself. Historically that bet has paid about 10% a year before inflation, and it requires no stock-picking skill whatsoever. Warren Buffett has said most investors' best move is a low-cost index fund — advice he backed by winning a famous ten-year bet against a team of hedge funds.`],
          ['Why diversification is the only free lunch', `Any single company can go to zero — even giants like Enron, Lehman Brothers, and Kodak did. A basket of 500 cannot go to zero without the entire economy collapsing. Spreading money across many stocks removes the risk that one disaster ruins you, without lowering your expected return. That's why economists call diversification "the only free lunch in finance": less risk at no cost. Diversify further across bonds, international stocks, and other assets and the ride gets smoother still.`],
          ['Costs and dollar-cost averaging', `Two habits complete the system. First, watch the expense ratio — index funds charge as little as 0.03% a year, while active funds often charge 1% for worse average results. Second, invest a fixed amount on a schedule (say, monthly). This "dollar-cost averaging" automatically buys more shares when prices are low and fewer when they're high, removes the temptation to time the market, and turns investing into a boring background habit — exactly what it should be.`],
        ],
        quiz: [
          ['What does an S&P 500 index fund actually hold?', ['The 500 fastest-growing tech startups', 'All 500 companies in the index', 'A rotating selection picked by managers'], 1],
          ['Why is diversification called a "free lunch"?', ['It eliminates single-company disaster risk without lowering expected returns', 'It guarantees profits every year', 'Funds provide free meals to shareholders'], 0],
          ['What does dollar-cost averaging do?', ['Times the market bottom precisely', 'Buys more shares when prices are low and fewer when high, automatically', 'Averages the fees across brokers'], 1],
        ]},
      { level: 'Intermediate', title: 'Reading Financial Statements',
        sections: [
          ['The income statement: the story of a year', `The income statement shows what a company earned and spent over a period. Revenue sits on top; subtract the cost of making the product to get gross profit; subtract operating expenses to get operating income; subtract interest and taxes to reach net income — "the bottom line." Watch the margins: a company keeping 25 cents of profit per revenue dollar has pricing power; one keeping 2 cents is fragile. Rising revenue with shrinking margins often signals a business buying growth it can't afford.`],
          ['The balance sheet: a financial photograph', `The balance sheet is a snapshot of what the company owns (assets), owes (liabilities), and what's left for shareholders (equity). The key questions: How much cash is on hand? How much debt is due soon? A company with heavy short-term debt and little cash can be profitable on paper yet die of a cash crunch. Compare debt to equity — a debt-heavy balance sheet magnifies both good years and disasters.`],
          ['The cash flow statement: where truth lives', `Profits are an opinion; cash is a fact. Accounting rules let companies book revenue before money arrives, so net income can look healthy while the bank account drains. The cash flow statement cuts through this by tracking actual dollars: cash from operations (the core engine), investing (buying equipment, acquisitions), and financing (borrowing, buybacks, dividends). The single best health check: is cash from operations consistently positive and growing? Companies rarely fake cash for long.`],
        ],
        quiz: [
          ['Where do you find "the bottom line" (net income)?', ['The balance sheet', 'The income statement', 'The shareholder letter'], 1],
          ['Why can a profitable company still go bankrupt?', ['Profits are illegal to retain', 'It can run out of actual cash while booking paper profits', 'Bankruptcy is random'], 1],
          ['What is the strongest simple health check across statements?', ['Consistently positive, growing cash from operations', 'A famous CEO', 'A rising stock price'], 0],
        ]},
      { level: 'Intermediate', title: 'Valuation: What a Company Is Worth',
        sections: [
          ['Price is not value', `A $900 stock can be cheap and a $4 stock can be wildly expensive — what matters is the price relative to what the business earns. The P/E ratio (price divided by earnings per share) is the classic yardstick: paying a P/E of 20 means paying $20 for every $1 of annual profit. Fast growers deserve higher P/Es; shrinking firms deserve lower ones. Comparing a company's P/E to its own history and to close competitors tells you far more than the sticker price ever will.`],
          ['Discounted cash flow, the intuition', `A business is worth the sum of all the cash it will ever hand its owners, discounted back to today — because a dollar next year is worth less than a dollar now. That's a DCF. You don't need the spreadsheet to use the logic: value rises when future cash flows grow, and falls when interest rates rise (future dollars get discounted more heavily). This is exactly why high-growth stocks tumble hardest when rates climb — the math on their far-future profits gets punished.`],
          ['Margin of safety', `Every valuation is a guess built on assumptions, so great investors buy only when the price sits comfortably below their estimate of value — a buffer Benjamin Graham called the margin of safety. If you think a business is worth $100 a share, buying at $70 means you can be meaningfully wrong and still do fine. The discipline this enforces is the real prize: it forces patience, and it keeps you out of stocks priced for perfection.`],
        ],
        quiz: [
          ['A P/E of 20 means…', ['The stock costs $20', 'You pay $20 for each $1 of annual earnings', 'The company grows 20% a year'], 1],
          ['Why do high-growth stocks fall hardest when interest rates rise?', ['Their far-future cash flows get discounted more heavily', 'They have the most debt', 'Regulators target them'], 0],
          ['What is a margin of safety?', ['A stop-loss order', 'Buying well below your estimate of value to absorb errors', 'Insurance sold by brokers'], 1],
        ]},
      { level: 'Advanced', title: 'Dividends, Buybacks & Quality',
        sections: [
          ['Two ways companies pay you', `Mature companies return cash to shareholders two ways: dividends (cash in your account, taxed when received) and buybacks (the company repurchases its own shares, shrinking the share count so each remaining share owns more of the business). Neither is automatically better — buybacks create value only when shares are repurchased below their true worth; done at inflated prices they quietly destroy it. A steady, growing dividend is often the loudest honest signal a board can send about confidence in future cash flows.`],
          ['Spotting a quality business', `Quality shows up as a moat — a durable advantage competitors can't easily cross. Moats come in flavors: brands people pay extra for, network effects that strengthen with each user, switching costs that lock customers in, and scale that lets you underprice rivals. The numbers confirm the story: consistently high return on invested capital (ROIC above ~15%), fat gross margins, and low debt. A mediocre business at a bargain price usually loses to a great business at a fair price — time works for quality.`],
          ['Dividend traps and payout ratios', `A 9% dividend yield looks delicious and is usually a warning: the market expects a cut. Check the payout ratio — dividends as a share of earnings (or better, of free cash flow). Below 60% is generally sustainable; above 90% means the company is paying you with money it doesn't really have. The aristocrats — firms that have raised dividends for 25+ straight years — earned that streak with decades of discipline, which is exactly the quality signal you're hunting.`],
        ],
        quiz: [
          ['When do buybacks actually create value?', ['Always — fewer shares is always better', 'When shares are repurchased below their true worth', 'Only in bull markets'], 1],
          ['Which metric best confirms a durable "moat"?', ['Consistently high return on invested capital', 'A large headquarters', 'Frequent press releases'], 0],
          ['A 9% dividend yield with a 95% payout ratio most likely signals…', ['A generous, safe income stream', 'A coming dividend cut', 'Strong compounding ahead'], 1],
        ]},
      { level: 'Advanced', title: 'M&A and Corporate Actions',
        sections: [
          ['Why companies merge and acquire', `M&A is how companies buy growth they can't build. The acquirer pays a premium — typically 20-40% above the target's market price — betting that "synergies" (cost cuts, cross-selling, new markets) will justify it. History says the bet usually favors the target's shareholders: they pocket the premium immediately, while acquirers often overpay and spend years digesting. When a deal is announced, the target's stock jumps toward the offer price while the acquirer's frequently dips — the market grading the price paid in real time.`],
          ['The arbitrage gap and deal risk', `After an announcement, the target usually trades slightly below the offer price — say $98 against a $100 cash bid. That gap is the market pricing the risk the deal dies: regulators can block it, financing can collapse, shareholders can revolt. Merger arbitrageurs earn the spread by buying the target and waiting for closing. For regular investors the lesson is simpler: understand which side of a deal you own, what you're being offered (cash, stock, or a mix), and what happens to your shares if the deal breaks.`],
          ['Spinoffs, splits, and special situations', `Companies also reshape themselves without buying anyone. A spinoff hands shareholders shares of a division as a new independent company — and spinoffs have historically outperformed, because focused management beats conglomerate neglect. Stock splits change the share count but not the value (a pizza cut into more slices). Special dividends return one-time cash piles. Each of these "corporate actions" lands in your brokerage automatically; knowing what they mean keeps you from mistaking mechanics for magic.`],
        ],
        quiz: [
          ['Who usually captures most of the value in an acquisition?', ['The acquiring company', 'The target company’s shareholders, via the premium', 'Investment banks only'], 1],
          ['Why does a target trade slightly below the offer price before closing?', ['Brokers charge a handling fee', 'The market is pricing the risk the deal falls apart', 'Dividends are suspended'], 1],
          ['What is a spinoff?', ['A division distributed to shareholders as a new independent company', 'A type of stock split', 'A bankruptcy procedure'], 0],
        ]},
    ],
  },
  alternatives: {
    name: 'Alternative Investments', accent: '#D9645C',
    tagline: 'Beyond stocks — crypto, real estate, commodities, and private markets.',
    modules: [
      { level: 'Beginner', title: 'What Are Alternative Investments?',
        sections: [
          ['Beyond stocks and bonds', `"Alternatives" is the umbrella for everything outside public stocks and bonds: real estate, cryptocurrencies, commodities like gold and oil, private equity, venture capital, hedge funds, collectibles, and infrastructure. Institutions like Yale's endowment made the category famous by allocating half their portfolios to it. The appeal is twofold: some alts generate returns that don't move in lockstep with the stock market (diversification), and some offer exposure to growth the public market simply can't reach.`],
          ['The price of admission: liquidity and opacity', `Alternatives charge a toll. Many are illiquid — selling a building or a private-equity stake can take months or years, versus seconds for a stock. Pricing is murkier: without a live ticker, values are estimates, and fees run far higher than index funds. Fraud finds dark corners; the alternatives world has more of them. The rule of thumb: the harder something is to sell and the harder it is to price, the higher the return you should demand for holding it.`],
          ['How much belongs in a portfolio?', `For most individual investors, alternatives are a seasoning, not the meal — commonly 5-20% of a portfolio, added only after a diversified core of stocks and bonds exists. Start with the liquid, accessible versions: REITs for real estate, ETFs for gold and commodities, small positions in major cryptocurrencies. The goal isn't excitement; it's owning assets that zig when your stocks zag, so the whole portfolio rides out storms more smoothly.`],
        ],
        quiz: [
          ['Which of these is an alternative investment?', ['An S&P 500 index fund', 'A rental property', 'A savings account'], 1],
          ['What is the main trade-off of illiquid alternatives?', ['They can take months or years to sell, so you should demand higher returns', 'They are always safer than stocks', 'They are tax-free'], 0],
          ['A sensible alternatives allocation for most individuals is…', ['0% — they are always scams', 'Roughly 5-20%, after building a diversified core', '80% or more, like Yale'], 1],
        ]},
      { level: 'Beginner', title: 'Crypto Fundamentals',
        sections: [
          ['What a blockchain actually is', `A blockchain is a shared ledger no single party controls — thousands of computers hold identical copies and agree on every new entry. Bitcoin uses this to create digital scarcity: only 21 million coins will ever exist, enforced by math rather than a central bank. Ethereum extends the idea into a programmable platform where "smart contracts" execute automatically. Strip away the jargon and the innovation is trust without a middleman — value moving between strangers with no bank in the middle.`],
          ['Volatility, cycles, and position sizing', `Crypto's returns and risks are both extreme: Bitcoin has crashed more than 75% four separate times and still ranks among the best-performing assets of the past 15 years. The market moves in brutal boom-bust cycles, often tied to Bitcoin's four-year "halving" schedule. Nobody reliably times these swings. The practical defense is position sizing: hold only what you could watch fall 80% without flinching — for most people a low single-digit percent of the portfolio — and treat anything promising "guaranteed" crypto yield as a red flag.`],
          ['Custody: not your keys, not your coins', `Crypto has no fraud department and no password reset. Coins live at addresses controlled by private keys; whoever holds the keys owns the coins — hence the mantra "not your keys, not your coins." Exchanges can be hacked or collapse (FTX vaporized billions of customer funds in a week). Serious holders move long-term coins to hardware wallets they control. If you'd rather not manage keys, regulated spot ETFs now offer price exposure inside an ordinary brokerage account — a reasonable trade of purity for safety.`],
        ],
        quiz: [
          ['What enforces Bitcoin’s 21 million coin limit?', ['The US Federal Reserve', 'The protocol’s math, verified by thousands of computers', 'A vote among exchanges'], 1],
          ['What does "not your keys, not your coins" warn about?', ['Losing coins on exchanges you don’t control', 'Forgetting your brokerage password', 'High transaction fees'], 0],
          ['A sane approach to crypto position sizing is…', ['Going all-in during bull markets', 'A small allocation you could watch fall 80% without panic', 'Borrowing to buy more'], 1],
        ]},
      { level: 'Intermediate', title: 'Real Estate & REITs',
        sections: [
          ['Two doors into property', `You can own real estate directly — buying a rental house, collecting rent, fixing the roof — or indirectly through REITs (Real Estate Investment Trusts), companies that own portfolios of properties and trade like stocks. Direct ownership offers control and leverage but concentrates your wealth in one building in one zip code. REITs offer instant diversification across hundreds of properties, professional management, and the ability to sell in seconds. By law REITs must pay out 90% of taxable income as dividends, which is why they're income machines.`],
          ['Cap rates: real estate’s P/E ratio', `A property's cap rate is its annual net operating income divided by its price — a building earning $50,000 on a $1,000,000 price has a 5% cap rate. It's the inverse of a P/E: higher cap rate means cheaper (and usually riskier or slower-growing); lower means expensive-but-prized. Compare cap rates to mortgage rates and treasury yields: when you can borrow at 6% to buy a 5% cap rate, the math is fighting you. Great deals appear when cap rates sit well above your cost of money.`],
          ['Leverage: the double-edged sword', `Real estate's superpower is borrowed money. Put 20% down and a 5% rise in the property's value becomes a 25% gain on your cash — leverage multiplies returns. It multiplies losses identically: a 20% price drop erases your entire down payment. 2008 was this math at national scale. The stabilizer is cash flow: if rent covers the mortgage, taxes, and repairs with room to spare, you can ride out price dips indefinitely. Speculators who depend on prices rising are the ones who get carried out.`],
        ],
        quiz: [
          ['What must REITs do with at least 90% of taxable income?', ['Reinvest it in new buildings', 'Pay it to shareholders as dividends', 'Hold it as cash reserves'], 1],
          ['A building earns $50,000/year and costs $1,000,000. Its cap rate is…', ['5%', '20%', '0.5%'], 0],
          ['With 20% down, a 20% fall in property value means…', ['A 20% loss on your cash', 'Your entire down payment is wiped out', 'Nothing until you sell'], 1],
        ]},
      { level: 'Intermediate', title: 'Commodities & Gold',
        sections: [
          ['Why raw materials behave differently', `Commodities — oil, copper, wheat, gold — earn nothing and invent nothing; their prices ride pure supply and demand. That's exactly their value in a portfolio: they often rise when stocks and bonds fall together, especially during inflation shocks and supply crises. In 2022, while stocks and bonds both sank, commodities posted their best year in decades. They're not a compounding engine like equities — they're insurance that pays off in the scenarios that hurt everything else.`],
          ['Gold: four thousand years of trust', `Gold pays no dividend and builds no products, yet it has preserved purchasing power across centuries of collapsed currencies and fallen empires. It tends to shine when real interest rates go negative — when cash in the bank loses to inflation — and when trust in institutions wobbles. Central banks themselves hoard it by the ton. A 5-10% gold allocation historically smooths portfolio drawdowns. The efficient way in is a low-fee ETF; coins and bars carry dealer markups and storage headaches.`],
          ['Futures, contango, and why oil ETFs disappoint', `Most commodity investing runs through futures contracts — agreements to buy at a set price on a future date. Futures curves have a personality: when later months cost more than today ("contango"), funds that roll contracts forward bleed money every month, which is why some oil ETFs lost fortunes even while oil prices rose. The takeaway: broad, professionally managed commodity funds or gold ETFs are fine tools; single-commodity futures products deserve close reading of the fine print before a single dollar goes in.`],
        ],
        quiz: [
          ['What role do commodities best play in a portfolio?', ['A compounding growth engine', 'Insurance that pays off during inflation and supply shocks', 'A source of dividend income'], 1],
          ['When does gold historically perform best?', ['When real interest rates are negative and trust wobbles', 'When tech stocks rally', 'During deflationary booms'], 0],
          ['Why can an oil ETF lose money while oil prices rise?', ['Oil companies dilute shareholders', 'Rolling futures in contango bleeds value monthly', 'Refineries take a cut'], 1],
        ]},
      { level: 'Advanced', title: 'Private Equity & Venture Capital',
        sections: [
          ['How private markets work', `Private equity buys entire companies — often mature businesses, improved with new management and (heavily) with debt, then sold years later. Venture capital buys small stakes in young companies hoping one becomes the next giant. Both lock up investor money for 7-10 years in funds run by general partners who charge "2 and 20": 2% annually plus 20% of profits. Returns arrive in a J-curve — early years look negative as fees bite before the wins mature.`],
          ['The power law of venture returns', `Venture capital lives on outliers. In a typical portfolio of 20 startups, half die, a handful limp, and one or two return 50-100x — paying for everything else. This "power law" means the median startup investment loses money even in great funds. It's why VCs chase huge markets and founders with breakout potential rather than safe, modest businesses, and why angel investing with money you can't afford to lose is gambling wearing a fleece vest.`],
          ['What access looks like for individuals', `The best funds don't need your money — they're gated to institutions and the ultra-wealthy. Individuals still have doors: publicly traded PE firms (Blackstone, KKR) whose shares anyone can buy, business development companies (BDCs) that lend to private firms and pay fat dividends, and regulated crowdfunding platforms for startup stakes. Each carries the same warnings as the institutional version — long horizons, high fees, uneven quality — so they belong in the small, patient corner of a portfolio.`],
        ],
        quiz: [
          ['What does "2 and 20" mean?', ['2% annual fee plus 20% of profits', '2 partners and 20 employees', '2-year lockup, 20-year fund'], 0],
          ['The "power law" in venture capital means…', ['All startups return roughly the same', 'One or two huge winners pay for a portfolio of losers', 'Losses are legally capped'], 1],
          ['Which is a realistic private-markets door for individuals?', ['Demanding entry to a top fund', 'Shares of listed PE firms or BDCs', 'Calling founders directly'], 1],
        ]},
      { level: 'Advanced', title: 'Building a Multi-Asset Portfolio',
        sections: [
          ['Correlation is the whole game', `Diversification only works when assets move differently. Stocks and corporate bonds often fall together in a crisis; gold, managed futures, and certain real assets historically hold or rise. The magic number is correlation: combining assets with low or negative correlation lowers portfolio swings more than it lowers returns. This is why a dash of "boring" gold or trend-following strategies can make an aggressive portfolio calmer than a supposedly safe all-stock one.`],
          ['A framework for allocation', `One battle-tested skeleton: a global stock core (50-70%) for growth, bonds (15-30%) for stability, and alternatives (5-20%) split among real estate, gold or commodities, and — for the risk-tolerant — a sliver of crypto or private markets. Weight the core by your horizon: decades to go means more stocks; nearing the goal means more ballast. Write the allocation down. A plan on paper is what stops a 3 a.m. panic-sell in a crash.`],
          ['Rebalancing: selling high on autopilot', `Left alone, portfolios drift — a crypto boom or stock rally can silently double your risk. Rebalancing resets weights back to plan, typically once a year or when an asset drifts 5+ points from target. Mechanically, it forces you to trim what soared and add to what lagged — selling high and buying low without needing a single prediction. Studies credit disciplined rebalancing with meaningful added return over decades, all of it earned by ignoring your own excitement.`],
        ],
        quiz: [
          ['Diversification works best when assets are…', ['Highly correlated', 'Low or negatively correlated', 'All from the same sector'], 1],
          ['What is the main purpose of writing an allocation down?', ['Impressing your broker', 'Preventing emotional decisions during crashes', 'Tax documentation'], 1],
          ['What does rebalancing mechanically force you to do?', ['Trim winners and add to laggards — sell high, buy low', 'Chase the best performer', 'Hold more cash every year'], 0],
        ]},
    ],
  },
};

function moduleFile(track, i) { return `${track}-module-${i + 1}.html`; }


// Hands-on visual questions — one per module, rotated per track.
const AXIS = '<line x1="30" y1="10" x2="30" y2="105" stroke="rgba(236,226,214,0.25)"/><line x1="30" y1="105" x2="290" y2="105" stroke="rgba(236,226,214,0.25)"/>';
const VISUAL_QS = {
  investing: [
    { q: 'The chart shows $100 saved flat vs. invested at 8%. Which line is compounding?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<polyline points="30,95 290,70" fill="none" stroke="#B7ADA1" stroke-width="2" stroke-dasharray="5,4"/>' +
           '<path d="M30,95 Q160,88 230,55 T290,15" fill="none" stroke="#5cb88a" stroke-width="2.5"/>' +
           '<text x="240" y="30" fill="#5cb88a" font-size="11">Line B</text>' +
           '<text x="240" y="62" fill="#B7ADA1" font-size="11">Line A</text></svg>',
      opts: ['Line A — steady and straight', 'Line B — it accelerates as gains earn gains', 'Neither, both are linear'], correct: 1,
      why: 'Compound growth curves upward because each year of gains earns its own gains.' },
    { q: 'Two portfolios, same total money. Which is more diversified?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<rect x="55" y="20" width="34" height="85" fill="#D9645C" opacity="0.85"/><text x="52" y="118" fill="#B7ADA1" font-size="10">Portfolio A</text>' +
           '<rect x="160" y="65" width="18" height="40" fill="#5cb88a"/><rect x="184" y="60" width="18" height="45" fill="#5cb88a"/><rect x="208" y="70" width="18" height="35" fill="#5cb88a"/><rect x="232" y="62" width="18" height="43" fill="#5cb88a"/><rect x="256" y="68" width="18" height="37" fill="#5cb88a"/>' +
           '<text x="185" y="118" fill="#B7ADA1" font-size="10">Portfolio B</text></svg>',
      opts: ['Portfolio A — conviction in one stock', 'Portfolio B — spread across five holdings', 'They carry identical risk'], correct: 1,
      why: 'One bad earnings call can sink Portfolio A; no single mistake can sink Portfolio B.' },
    { q: 'Both companies earn $5 per share. Which is the cheaper price for each dollar of earnings?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<rect x="80" y="65" width="50" height="40" fill="#5cb88a"/><text x="80" y="58" fill="#F4EEE6" font-size="11">P/E 12</text><text x="80" y="118" fill="#B7ADA1" font-size="10">Stock A</text>' +
           '<rect x="190" y="20" width="50" height="85" fill="#E0A24C"/><text x="190" y="14" fill="#F4EEE6" font-size="11">P/E 30</text><text x="190" y="118" fill="#B7ADA1" font-size="10">Stock B</text></svg>',
      opts: ['Stock A — you pay $12 per $1 of earnings', 'Stock B — a higher bar is better', 'Impossible to compare'], correct: 0,
      why: 'P/E is the price of a dollar of earnings. Lower is cheaper — B is only worth it if it grows much faster.' },
    { q: 'This position fell 50%. What gain does it now need just to get back to even?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<polyline points="30,25 110,25 190,85" fill="none" stroke="#D9645C" stroke-width="2.5"/>' +
           '<polyline points="190,85 290,25" fill="none" stroke="#5cb88a" stroke-width="2" stroke-dasharray="5,4"/>' +
           '<text x="35" y="20" fill="#B7ADA1" font-size="10">$100</text><text x="168" y="100" fill="#D9645C" font-size="10">$50</text><text x="252" y="20" fill="#5cb88a" font-size="10">$100?</text></svg>',
      opts: ['50% — the same amount back', '100% — it must double from $50', '25% — losses recover faster'], correct: 1,
      why: 'Losses are asymmetric: from $50 back to $100 is a +100% climb. This is why risk control beats heroics.' },
  ],
  alternatives: [
    { q: 'Which line behaves like Bitcoin, and which like a savings bond?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<polyline points="30,70 70,30 110,90 150,40 190,100 230,35 290,60" fill="none" stroke="#E0A24C" stroke-width="2"/>' +
           '<polyline points="30,80 290,72" fill="none" stroke="#5cb88a" stroke-width="2.5"/>' +
           '<text x="245" y="30" fill="#E0A24C" font-size="11">Line A</text><text x="245" y="90" fill="#5cb88a" font-size="11">Line B</text></svg>',
      opts: ['A is the bond, B is Bitcoin', 'A is Bitcoin, B is the bond', 'Both are stablecoins'], correct: 1,
      why: 'Volatility is the giveaway — Bitcoin regularly swings more in a week than bonds do in a year.' },
    { q: 'In this crash, stocks (red) fell while gold (amber) held. What is gold doing for the portfolio?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<polyline points="30,35 90,45 150,80 210,95 290,90" fill="none" stroke="#D9645C" stroke-width="2.5"/>' +
           '<polyline points="30,75 90,72 150,60 210,55 290,50" fill="none" stroke="#E0A24C" stroke-width="2.5"/>' +
           '<text x="250" y="103" fill="#D9645C" font-size="10">Stocks</text><text x="255" y="42" fill="#E0A24C" font-size="10">Gold</text></svg>',
      opts: ['Nothing — it missed the rally', 'Diversifying — it zigged while stocks zagged', 'Adding leverage'], correct: 1,
      why: 'Low correlation is the whole point of alternatives: one sleeve holding firm cushions the crash.' },
    { q: 'A rental collects $2,000 rent with $1,000 of operating costs. What is the $1,000 left over called?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<rect x="70" y="20" width="60" height="85" fill="#5cb88a" opacity="0.9"/><text x="70" y="14" fill="#F4EEE6" font-size="10">Rent $2,000</text>' +
           '<rect x="180" y="63" width="60" height="42" fill="#D9645C" opacity="0.85"/><text x="172" y="56" fill="#F4EEE6" font-size="10">Costs $1,000</text></svg>',
      opts: ['Cap rate', 'Net operating income (NOI)', 'Amortization'], correct: 1,
      why: 'NOI = rent minus all operating expenses. Every serious real estate number is built on it.' },
    { q: 'Rank by how fast you could sell at a fair price. Which bar is private equity?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<rect x="45" y="25" width="40" height="80" fill="#5cb88a"/><text x="48" y="118" fill="#B7ADA1" font-size="10">Cash</text>' +
           '<rect x="105" y="45" width="40" height="60" fill="#5cb88a" opacity="0.75"/><text x="102" y="118" fill="#B7ADA1" font-size="10">Stocks</text>' +
           '<rect x="165" y="75" width="40" height="30" fill="#E0A24C"/><text x="158" y="118" fill="#B7ADA1" font-size="10">Property</text>' +
           '<rect x="225" y="95" width="40" height="10" fill="#D9645C"/><text x="230" y="118" fill="#B7ADA1" font-size="10">???</text></svg>',
      opts: ['The tallest bar — instant access', 'The shortest bar — money can be locked up for a decade', 'The amber bar'], correct: 1,
      why: 'PE funds lock capital for 7-10 years. Illiquidity is the price of entry — and part of the return.' },
  ],
  master: [
    { q: 'Supply and demand cross at the dot. What happens at that point?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<polyline points="50,20 270,100" fill="none" stroke="#D9645C" stroke-width="2"/>' +
           '<polyline points="50,100 270,20" fill="none" stroke="#5cb88a" stroke-width="2"/>' +
           '<circle cx="160" cy="60" r="5" fill="#E0A24C"/>' +
           '<text x="52" y="16" fill="#D9645C" font-size="10">Demand</text><text x="226" y="16" fill="#5cb88a" font-size="10">Supply</text></svg>',
      opts: ['A shortage forms', 'The market clears — buyers and sellers agree on price', 'The government sets the price'], correct: 1,
      why: 'The intersection is equilibrium: the one price where quantity supplied equals quantity demanded.' },
    { q: 'The Fed hikes rates (amber arrow). What happens to the price of existing bonds?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' +
           '<line x1="90" y1="95" x2="90" y2="30" stroke="#E0A24C" stroke-width="4"/><polygon points="80,38 90,20 100,38" fill="#E0A24C"/><text x="60" y="118" fill="#B7ADA1" font-size="11">Rates</text>' +
           '<line x1="210" y1="35" x2="210" y2="100" stroke="#D9645C" stroke-width="4"/><polygon points="200,92 210,110 220,92" fill="#D9645C"/><text x="178" y="126" fill="#B7ADA1" font-size="11">Bond prices?</text></svg>',
      opts: ['They rise together', 'They fall — old, lower coupons are worth less', 'Nothing changes'], correct: 1,
      why: 'The seesaw rule: nobody pays full price for a 3% bond when new ones pay 5%.' },
    { q: 'The yield curve is sloping down (short rates above long). Historically this warns of…',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' + AXIS +
           '<path d="M40,30 Q120,45 190,75 T290,95" fill="none" stroke="#D9645C" stroke-width="2.5"/>' +
           '<text x="38" y="22" fill="#B7ADA1" font-size="10">2yr yield</text><text x="238" y="88" fill="#B7ADA1" font-size="10">10yr yield</text></svg>',
      opts: ['A boom', 'A possible recession ahead', 'Higher stock dividends'], correct: 1,
      why: 'An inverted curve means markets expect rate cuts — the classic, if imperfect, recession warning.' },
    { q: 'The classic 50/30/20 budget. What does the green slice do?',
      svg: '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">' +
           '<rect x="30" y="45" width="130" height="40" fill="#B7ADA1" opacity="0.6"/><text x="70" y="70" fill="#1a1714" font-size="11" font-weight="bold">Needs 50%</text>' +
           '<rect x="160" y="45" width="78" height="40" fill="#E0A24C"/><text x="168" y="70" fill="#1a1714" font-size="11" font-weight="bold">Wants 30%</text>' +
           '<rect x="238" y="45" width="52" height="40" fill="#5cb88a"/><text x="243" y="70" fill="#1a1714" font-size="10" font-weight="bold">20%</text></svg>',
      opts: ['Rent and groceries', 'Entertainment', 'Saving and investing — it buys your future'], correct: 2,
      why: 'The 20% is the wealth-building slice: emergency fund, retirement accounts, and investments.' },
  ],
};


// ── Sources & deeper-dive content, matched to each module by title keywords ──
const REF_POOL = [
  [/compound|long-term investing works/i, ['Investopedia. <em>Compound Interest: Definition and How It Works.</em>', 'https://www.investopedia.com/terms/c/compoundinterest.asp']],
  [/index fund|diversif/i, ['Investopedia. <em>Index Fund: Definition and How to Invest.</em>', 'https://www.investopedia.com/terms/i/indexfund.asp']],
  [/diversif|multi-asset|allocation|parity/i, ['Investopedia. <em>Diversification: Definition as an Investing Strategy.</em>', 'https://www.investopedia.com/terms/d/diversification.asp']],
  [/risk tolerance|goals/i, ['Investor.gov (SEC). <em>Assessing Your Risk Tolerance.</em>', 'https://www.investor.gov/introduction-investing/getting-started/assessing-your-risk-tolerance']],
  [/retirement|401|free money/i, ['Investopedia. <em>What Is a 401(k) and How Does It Work?</em>', 'https://www.investopedia.com/terms/1/401kplan.asp']],
  [/bond|fixed income|yield/i, ['Investopedia. <em>Bond: Financial Meaning and How They Work.</em>', 'https://www.investopedia.com/terms/b/bond.asp']],
  [/behavioral|traps|psycholog/i, ['Investopedia. <em>Behavioral Finance: Biases and Emotions in Investing.</em>', 'https://www.investopedia.com/terms/b/behavioralfinance.asp']],
  [/financial statements/i, ['Investopedia. <em>Financial Statements: List, Types, and How to Read Them.</em>', 'https://www.investopedia.com/terms/f/financial-statements.asp']],
  [/valuation|worth|p\/e|dcf/i, ['Investopedia. <em>Price-to-Earnings (P/E) Ratio.</em>', 'https://www.investopedia.com/terms/p/price-earningsratio.asp']],
  [/dcf/i, ['Investopedia. <em>Discounted Cash Flow (DCF) Explained.</em>', 'https://www.investopedia.com/terms/d/dcf.asp']],
  [/growth vs|value investing/i, ['Investopedia. <em>Value Investing: How It Works.</em>', 'https://www.investopedia.com/terms/v/valueinvesting.asp']],
  [/moat/i, ['Investopedia. <em>Economic Moat: Meaning and Examples.</em>', 'https://www.investopedia.com/terms/e/economicmoat.asp']],
  [/rebalanc|position sizing/i, ['Investopedia. <em>Rebalancing: Definition and Why It Matters.</em>', 'https://www.investopedia.com/terms/r/rebalancing.asp']],
  [/cycle|sector rotation/i, ['Investopedia. <em>Business Cycle: What It Is and Its Phases.</em>', 'https://www.investopedia.com/terms/b/businesscycle.asp']],
  [/dividend|income portfolio|buyback/i, ['Investopedia. <em>Dividend: What It Is and How It Works.</em>', 'https://www.investopedia.com/terms/d/dividend.asp']],
  [/m&a|corporate actions|spinoff|arbitrage/i, ['Investopedia. <em>Mergers and Acquisitions (M&amp;A).</em>', 'https://www.investopedia.com/terms/m/mergersandacquisitions.asp']],
  [/international|currency/i, ['Investopedia. <em>Currency Risk: Definition and Examples.</em>', 'https://www.investopedia.com/terms/c/currencyrisk.asp']],
  [/crypto fundamentals|bitcoin|gold vs/i, ['Investopedia. <em>What Is Bitcoin? How to Buy, Mine, and Use It.</em>', 'https://www.investopedia.com/terms/b/bitcoin.asp']],
  [/stablecoin/i, ['Investopedia. <em>Stablecoins: Definition and How They Work.</em>', 'https://www.investopedia.com/terms/s/stablecoin.asp']],
  [/ethereum|smart-contract/i, ['Investopedia. <em>What Is Ethereum and How Does It Work?</em>', 'https://www.investopedia.com/terms/e/ethereum.asp']],
  [/reit|real estate|rental|fractional/i, ['Investopedia. <em>Real Estate Investment Trust (REIT).</em>', 'https://www.investopedia.com/terms/r/reit.asp']],
  [/commodit|energy|agriculture|gold/i, ['Investopedia. <em>Commodity: Definition and How It Works.</em>', 'https://www.investopedia.com/terms/c/commodity.asp']],
  [/private equity|venture/i, ['Investopedia. <em>Private Equity Explained.</em>', 'https://www.investopedia.com/terms/p/privateequity.asp']],
  [/hedge fund/i, ['Investopedia. <em>Hedge Fund: Definition and How They Work.</em>', 'https://www.investopedia.com/terms/h/hedgefund.asp']],
  [/collectible|art|watches/i, ['Investopedia. <em>Alternative Investment: Definition and Examples.</em>', 'https://www.investopedia.com/terms/a/alternative_investment.asp']],
  [/self-custody|security/i, ['Investopedia. <em>Cold Storage: What It Is and How It Works in Crypto.</em>', 'https://www.investopedia.com/terms/c/cold-storage.asp']],
  [/infrastructure|farmland/i, ['Investopedia. <em>Infrastructure Investments.</em>', 'https://www.investopedia.com/terms/i/infrastructure.asp']],
  [/alternative investments\?/i, ['Investopedia. <em>Alternative Investment: Definition and Examples.</em>', 'https://www.investopedia.com/terms/a/alternative_investment.asp']],
  [/econom|market|price/i, ['Investopedia. <em>Law of Supply and Demand.</em>', 'https://www.investopedia.com/terms/l/law-of-supply-demand.asp']],
];
const GENERIC_REF = ['U.S. Securities and Exchange Commission. <em>Introduction to Investing.</em> Investor.gov.', 'https://www.investor.gov/introduction-investing'];

function refsFor(title) {
  const hits = [];
  const seen = new Set();
  for (const [rx, ref] of REF_POOL) {
    if (rx.test(title) && !seen.has(ref[1])) { hits.push(ref); seen.add(ref[1]); }
    if (hits.length >= 3) break;
  }
  hits.push(GENERIC_REF);
  return hits.map(([txt, url]) =>
    `            <div class="source-item">${txt} <a href="${url}" target="_blank" rel="noopener">${url.replace('https://www.', '').replace('https://', '')}</a></div>`).join('\n');
}

// "Going deeper" paragraphs matched by title keywords, with track/level fallbacks.
const DEEPER = [
  [/long-term investing works/i, `Time in the market also changes your tax bill and your behavior. Long-term capital gains are taxed at far lower rates than short-term trades, and an investor who plans in decades stops reacting to headlines that will be forgotten in a month. The practical move: automate a monthly contribution, reinvest dividends, and treat crashes as scheduled sales rather than emergencies. Historically, every 20-year window in the S&amp;P 500 — including ones that started the day before the 1929 and 2008 crashes — ended positive.`],
  [/index fund/i, `The math behind indexing is brutal and simple: the market's return is the average of all investors' returns, so after fees the average active investor MUST underperform the index. That is not opinion — it is arithmetic, laid out in John Bogle's "Cost Matters Hypothesis." A 1% annual fee sounds tiny, but compounded over 40 years it consumes roughly a quarter of your final wealth. This is why index funds absorbed trillions of dollars in the past two decades.`],
  [/risk tolerance|goals/i, `A useful exercise is writing an investment policy statement — one page stating what the money is for, when you need it, your target allocation, and what you will do in a 30% drawdown (usually: nothing). Professionals use them because a plan written in calm weather is the only thing worth following in a storm. Revisit it when your life changes, not when the market does.`],
  [/retirement|free money/i, `Order of operations matters more than fund selection here: capture the full employer match first, then max an IRA (Roth if you're early-career), then return to the 401(k). One subtlety worth knowing: Roth contributions (not earnings) can be withdrawn penalty-free at any time, which makes a Roth IRA quietly double as a deep emergency reserve while it compounds tax-free.`],
  [/bond|fixed income/i, `Two numbers summarize any bond fund: duration and credit quality. Duration approximates how much the fund falls if rates rise 1% — a duration of 6 means roughly a 6% drop. Credit quality tells you how it behaves in a panic: Treasuries rally when stocks crash, while junk bonds crash alongside them. A "bond fund" that yields much more than Treasuries is taking one of those two risks; know which.`],
  [/behavioral|traps/i, `The most expensive bias may be action bias — the feeling that responding to news requires a trade. Fidelity's famous internal review found its best-performing accounts belonged to investors who had forgotten they had accounts. Build friction into your process: a 48-hour rule before any unplanned trade eliminates most mistakes without costing anything.`],
  [/financial statements/i, `The three statements check each other: net income from the income statement flows into the cash flow statement, and cash from the cash flow statement reconciles the balance sheet. When earnings grow but operating cash flow doesn't, someone is being creative — that divergence flagged Enron and WorldCom years before they collapsed. Always read the cash flow statement first; it is the hardest one to fake.`],
  [/valuation|worth/i, `Valuation multiples are shorthand for a DCF: a P/E of 20 quietly assumes years of specific growth and risk. Compare a company's multiple to its own history and to peers with similar growth, not to the whole market. And invert the ratio — a P/E of 20 is an "earnings yield" of 5%, which you can compare directly against bond yields to judge what you're being paid for the risk.`],
  [/growth vs|value/i, `The academic version of this debate is the "value premium" documented by Fama and French: over most long periods, cheap stocks have beaten expensive ones — but with decade-long stretches of the opposite, like 2010-2020. The lesson isn't to pick a side; it's that any style can underperform for longer than you can stay patient, which is the strongest argument for owning both.`],
  [/moat/i, `Moats erode, and the erosion is usually visible in gross margin before it hits the headlines. Kodak, Nokia, and Blockbuster all showed shrinking gross margins years before their stories broke. When you own a moat business, re-underwrite the moat annually: is return on capital still high? Is share still holding? A moat you stop checking is a story, not a thesis.`],
  [/position sizing|rebalanc/i, `A practical sizing rule from professional risk desks: size positions so no single-day headline can move your portfolio more than 1-2%. For a stock that routinely moves 10% on earnings, that caps the position near 15% — for a biotech that can gap 50%, near 3%. Sizing off the asset's volatility, not your conviction, is what lets you survive being wrong.`],
  [/cycle|rotation/i, `The cycle indicator with the best track record isn't the yield curve — it's your own behavior. Retail money floods in near tops and flees near bottoms with remarkable reliability, which is why fund flows are a contrarian signal. If everyone you know is suddenly talking about stocks, the cycle is late; if nobody wants to discuss them, it rarely is.`],
  [/dividend|income portfolio|buyback/i, `Check the payout ratio before trusting any dividend: dividends divided by free cash flow, not earnings. Below 60% usually survives a recession; above 80% is a promise the business may not keep. The "Dividend Aristocrats" — companies with 25+ consecutive years of increases — are a useful starting screen precisely because managements protect those streaks through downturns.`],
  [/m&a|corporate actions/i, `Study after study finds most acquirers overpay — the "winner's curse" — which is why the acquirer's stock usually dips on announcement while the target's jumps. As a shareholder, the questions are: is this deal paid in cheap stock or real cash, does it deepen the core business or bolt on a distraction, and did management promise "synergies" larger than the premium they paid? The last one almost never comes true.`],
  [/dcf in practice/i, `Professionals sanity-check every DCF three ways: the implied exit multiple (would a rational buyer pay that in year ten?), a sensitivity table (what happens at ±1% growth and discount), and the reverse DCF (what does today's price already assume?). If your model only works with a terminal growth rate above GDP, the model is telling you the stock is expensive — listen to it.`],
  [/spinoff|special situations|arbitrage/i, `Joel Greenblatt's "You Can Be a Stock Market Genius" remains the classic field guide here: the common thread in special situations is forced, price-insensitive selling by institutions that must sell for reasons unrelated to value. Your edge is simply being allowed to buy what they must dump. The trade-off is patience — these setups take quarters, not days, to close the gap.`],
  [/international|currency/i, `A cheap rule of thumb for global allocation: hold your home market at no more than double its world-index weight. For a U.S. investor that still means majority U.S., but with a permanent 25-35% international sleeve. Use unhedged funds for equities (currency adds diversification) and hedged for foreign bonds (currency swamps their small returns).`],
  [/alternative investments\?/i, `The honest test for any alternative: does it improve the portfolio, not just excite the owner? Ask three questions — does it zig when stocks zag (correlation), can I exit without losing a chunk to friction (liquidity), and do I understand what actually drives its return? An alternative that fails two of three belongs in the hobby budget, not the portfolio.`],
  [/crypto fundamentals/i, `Position sizing is the entire crypto playbook for most investors: small enough that an 80% drawdown is an annoyance, large enough that a 10x matters. History says both outcomes are live possibilities — Bitcoin has had four drawdowns beyond 75% and still compounded past every asset class over the same span. Volatility is the toll for the upside; pay only what you can afford.`],
  [/stablecoin/i, `Regulation is the swing factor here: U.S. and EU frameworks now require major issuers to hold audited reserves in cash and short Treasuries, which quietly turned the biggest stablecoins into some of the world's largest T-bill holders. The practical check before touching any stablecoin: monthly attestations, a big-four auditor, and redemptions honored 1:1 during past panics.`],
  [/fractional real estate/i, `Compare any fractional deal against the boring alternative: a public REIT ETF yielding ~4% with one-click liquidity. The fractional deal must beat that AFTER its 2-4% of stacked fees and its multi-year lockup, which means the underlying property needs to be genuinely exceptional — not just photogenic. Read the redemption terms twice; they only matter in bad markets, which is exactly when they get suspended.`],
  [/collectible/i, `Sotheby's and Christie's data shows blue-chip art returning roughly 7% annually over decades — respectable, but earned with 20%+ round-trip transaction costs, years of illiquidity, and enormous dispersion between pieces. The collectors who win financially are almost always the ones who bought what they loved and held for decades; the ones who lose bought what was hot.`],
  [/gold vs/i, `The portfolio-level evidence: adding 5-10% gold to a stock/bond mix has historically cut drawdowns without meaningfully denting returns, because gold's correlation to stocks sits near zero. Bitcoin's correlation has been higher and less stable — it often trades like a leveraged tech stock in risk-off moments. Treat the two as different tools, not substitutes.`],
  [/ethereum|smart-contract/i, `The metric professionals watch is fee revenue — the actual dollars users pay to use the network — which you can check live on public dashboards. A smart-contract platform with rising fees and rising active addresses is a growing toll road; one with an inflating token price but flat usage is a story. Valuing the token off usage keeps you out of most manias.`],
  [/rental property/i, `Two more numbers seasoned landlords insist on: DSCR (net operating income ÷ mortgage payment — lenders want 1.2+, meaning 20% cushion) and the true vacancy cost, which includes turnover repairs and the month of lost rent, not just empty days. And run every deal at today's rates plus 1% — if it only works with perfect financing, it doesn't work.`],
  [/reits like a professional/i, `Add two checks to FFO and NAV: debt maturity walls (a REIT refinancing half its debt into a rate spike gets crushed regardless of property quality) and same-store NOI growth, which strips out acquisitions and shows whether the existing buildings are actually earning more. Those four numbers together beat any headline yield.`],
  [/energy|agriculture/i, `Commodity futures funds carry a hidden cost worth understanding: roll yield. When far-month contracts cost more than near ones (contango), the fund loses money every month just maintaining its position — which is why some commodity ETFs lost money over stretches when the spot price rose. Producer equities sidestep the roll but add company-specific risk. Know which exposure you own.`],
  [/hedge fund/i, `The replication research is humbling: most hedge fund category returns can be approximated with cheap combinations of stock, bond, and currency exposures — the famous "alternative beta." What you cannot replicate is the top decile, and those funds are closed to new money. For everyone else, the liquid-alternatives ETF aisle gives 80% of the diversification story at 5% of the fee.`],
  [/infrastructure|farmland/i, `The NCREIF Farmland Index has recorded roughly 10-11% annual total returns over four decades with only three negative years — extraordinary consistency, driven by rent plus land appreciation. The catch is access: direct farmland requires scale, and listed vehicles trade with the stock market in the short run even when the underlying acres don't. Buy for the decade, not the quarter.`],
  [/self-custody|security/i, `A yearly security drill catches problems while they're cheap: verify your steel seed backup is where you left it and legible, send a small test transaction from cold storage, and confirm your inheritance instructions still name the right person. Most catastrophic losses in crypto are not hacks — they're owners locked out of their own money.`],
  [/risk parity|multi-asset/i, `The deeper idea is matching assets to economic seasons: stocks want growth, bonds want falling rates, inflation-linked bonds and commodities want rising prices, gold wants distrust. Build so that at least one sleeve is designed for whichever season arrives, and rebalance between them mechanically — the rebalancing itself becomes a small, reliable source of return.`],
];
const DEEPER_FALLBACK = {
  investing: `The compounding of good process matters more than any single decision. Write down why you bought, review quarterly against those reasons rather than the price, and let position sizing — never conviction — determine how much a mistake can cost you. Investors who survive long enough for compounding to work are the ones who made surviving the priority.`,
  alternatives: `Every alternative asset earns its place the same way: by behaving differently from stocks when it matters, at a cost you fully understand. Before adding any position here, write down the three numbers that would make you exit — a fee level, a drawdown, a lockup change. Alternatives punish improvisation more than any other corner of investing.`,
  master: `Each of these ideas compounds with the others: prices are signals, incentives drive behavior, and the cost of capital sets the bar every decision must clear. Revisit this module after finishing the pathway — the concepts read differently once you have seen them at work in markets.`,
};

function deeperFor(trackKey, title) {
  for (const [rx, text] of DEEPER) if (rx.test(title)) return text;
  return DEEPER_FALLBACK[trackKey] || DEEPER_FALLBACK.investing;
}

const LEVEL_COLORS = {
  Beginner: '#5cb88a', Foundations: '#5cb88a',
  Intermediate: '#e0a24c', Core: '#e0a24c',
  Advanced: '#d9645c',
};

function modulePage(trackKey, track, mod, i) {
  const next = i + 1 < track.modules.length ? moduleFile(trackKey, i + 1) : (trackKey === 'master' ? 'all-courses.html' : `${trackKey}-path.html`);
  const nextLabel = i + 1 < track.modules.length ? 'Next Module →' : 'Back to Courses →';
  const backHref = trackKey === 'master' ? 'all-courses.html' : `${trackKey}-path.html`;
  const lvlColor = LEVEL_COLORS[mod.level] || '#5cb88a';
  const words = mod.sections.reduce((n, s) => n + s[1].split(/\s+/).length, 0);
  const mins = Math.max(3, Math.round(words / 200));
  const qs = mod.quiz.map((q, qi) => {
    const opts = q[1].map((opt, oi) =>
      `                    <div class="quiz-opt" onclick="checkQuiz(${qi + 1}, this, ${oi === q[2]})">${opt}</div>`).join('\n');
    return `            <div class="quiz-q" id="q${qi + 1}">
                <p>${qi + 1}. ${q[0]}</p>
                <div class="quiz-opts">
${opts}
                </div>
                <div class="quiz-feedback" id="fb${qi + 1}"></div>
            </div>`;
  }).join('\n\n');

  const vqPool = VISUAL_QS[trackKey] || VISUAL_QS.investing;
  const vq = vqPool[i % vqPool.length];
  const vqNum = mod.quiz.length + 1;
  const vqHtml = `            <div class="quiz-q" id="q${vqNum}" data-why="${vq.why}">
                <p>${vqNum}. ${vq.q}</p>
                <div class="quiz-figure">${vq.svg}</div>
                <div class="quiz-opts">
${vq.opts.map((o, oi) => `                    <div class="quiz-opt" onclick="checkQuiz(${vqNum}, this, ${oi === vq.correct})">${o}</div>`).join('\n')}
                </div>
                <div class="quiz-feedback" id="fb${vqNum}"></div>
            </div>`;

  const sections = mod.sections.map(([h, body]) =>
    `        <h2>${h}</h2>
        <p>${body}</p>`).join('\n\n') + `

        <h2>Going deeper</h2>
        <p>${deeperFor(trackKey, mod.title)}</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mod.title} - Fantasy Trader</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/theme.css">
    <style>
        :root {
            --primary: #5cb88a;
            --accent: #e0a24c;
            --level: ${lvlColor};
            --background: #1a1714;
            --surface: #1e1a16;
            --surface-2: #241f1b;
            --border: #2a2420;
            --text-primary: #e8e8e8;
            --text-body: #c4c4c4;
            --text-muted: #888888;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--background);
            color: var(--text-primary);
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
        }

        .mod-header {
            background: rgba(20, 20, 20, 0.97);
            border-bottom: 1px solid var(--border);
            padding: 0.85rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .mod-header-inner {
            max-width: 820px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .back-link {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: opacity 0.2s;
        }
        .back-link:hover { opacity: 0.75; }
        .mod-header-meta {
            font-size: 0.72rem;
            color: var(--text-muted);
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            width: 0%;
            background: var(--level);
            z-index: 200;
            transition: width 0.15s linear;
        }

        .article {
            max-width: 720px;
            margin: 0 auto;
            padding: 3rem 1.5rem 5rem;
        }

        .module-label {
            display: inline-block;
            font-size: 0.62rem;
            font-weight: 700;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: var(--level);
            background: rgba(236, 226, 214, 0.08);
            border: 1px solid rgba(236, 226, 214, 0.18);
            padding: 5px 12px;
            border-radius: 4px;
            margin-bottom: 1.2rem;
        }

        .article-title {
            font-family: 'Lora', serif;
            font-size: 2.4rem;
            font-weight: 700;
            line-height: 1.2;
            color: #ffffff;
            margin-bottom: 0.8rem;
        }

        .article-meta {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border);
            margin-bottom: 2.5rem;
            font-size: 0.75rem;
            color: var(--text-muted);
        }
        .meta-item { display: flex; align-items: center; gap: 5px; }
        .meta-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--text-muted); }

        .article p {
            font-family: 'Lora', serif;
            font-size: 1.05rem;
            line-height: 1.85;
            color: var(--text-body);
            margin-bottom: 1.5rem;
        }

        .article h2 {
            font-family: 'Inter', sans-serif;
            font-size: 1.35rem;
            font-weight: 700;
            color: #ffffff;
            margin-top: 3rem;
            margin-bottom: 1rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
        }
        .article h2:first-of-type { margin-top: 0; padding-top: 0; border-top: none; }

        .sources {
            margin-top: 3.5rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
        }
        .sources h3 {
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 1rem;
            margin-top: 0;
            font-family: 'Inter', sans-serif;
        }
        .source-item {
            font-size: 0.82rem;
            color: var(--text-muted);
            line-height: 1.7;
            margin-bottom: 0.6rem;
            font-family: 'Inter', sans-serif;
        }
        .source-item a { color: #5cb88a; text-decoration: none; overflow-wrap: anywhere; }
        .source-item a:hover { text-decoration: underline; }
        .quiz-section {
            margin-top: 3.5rem;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 1.75rem;
        }
        .quiz-section h3 { font-family: 'Inter', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 0.3rem; color: #ffffff; }
        .quiz-subtitle { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem; font-family: 'Inter', sans-serif !important; }
        .quiz-q { margin-bottom: 1.75rem; }

        /* Quiz rework: lettered options, cleaner questions */
        .quiz-section h3 { font-family: 'Fraunces', Georgia, serif !important; font-size: 1.3rem !important; }
        .quiz-q { padding-top: 1.2rem; border-top: 1px solid rgba(236, 226, 214, 0.07); }
        .quiz-q:first-of-type { border-top: none; padding-top: 0; }
        .quiz-q > p { font-size: 1rem !important; }
        .quiz-opts { counter-reset: opt; }
        .quiz-opt { position: relative; padding-left: 2.9rem !important; counter-increment: opt; }
        .quiz-opt::before {
            content: counter(opt, upper-alpha);
            position: absolute; left: 0.7rem; top: 50%; transform: translateY(-50%);
            width: 1.45rem; height: 1.45rem; border: 1px solid rgba(236, 226, 214, 0.25);
            border-radius: 5px; display: flex; align-items: center; justify-content: center;
            font: 700 0.68rem 'Inter', sans-serif; color: #8a8178;
        }
        .quiz-opt:hover::before { border-color: rgba(236, 226, 214, 0.5); color: #F4EEE6; }
        .quiz-opt.correct::before { border-color: #5cb88a; color: #5cb88a; content: '✓'; }
        .quiz-opt.wrong::before { border-color: #d9645c; color: #d9645c; content: '✕'; }

        .quiz-figure {
            background: rgba(236, 226, 214, 0.03);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 0.8rem;
        }
        .quiz-figure svg { width: 100%; max-width: 430px; height: auto; display: block; margin: 0 auto; }
        .quiz-q p { font-family: 'Inter', sans-serif; font-weight: 600; margin-bottom: 0.7rem; font-size: 0.95rem; line-height: 1.5; color: var(--text-primary); }
        .quiz-opts { display: flex; flex-direction: column; gap: 0.5rem; }
        .quiz-opt { padding: 0.7rem 0.95rem; background: rgba(236,226,214,0.04); border: 1px solid rgba(236,226,214,0.1); border-radius: 10px; cursor: pointer; font-size: 0.9rem; transition: all 0.15s ease; }
        .quiz-opt:hover { border-color: rgba(236,226,214,0.25); }
        .quiz-opt.correct { border-color: #5cb88a; background: rgba(92,184,138,0.12); }
        .quiz-opt.wrong { border-color: #d9645c; background: rgba(217,100,92,0.12); }
        .quiz-opt.disabled { pointer-events: none; }
        .quiz-feedback { display: none; font-size: 0.82rem; margin-top: 0.5rem; font-family: 'Inter', sans-serif; }
        .quiz-feedback.show { display: block; }
        .quiz-feedback.right { color: #5cb88a; }
        .quiz-feedback.wrong-fb { color: #d9645c; }

        .module-footer { max-width: 720px; margin: 0 auto; padding: 0 1.5rem 4rem; display: flex; justify-content: space-between; align-items: center; }
        .footer-btn {
            display: inline-flex; align-items: center; gap: 8px; padding: 0.85rem 1.6rem;
            border-radius: 10px; font-size: 0.85rem; font-weight: 700; text-decoration: none;
            transition: all 0.2s ease; font-family: 'Inter', sans-serif; border: none; cursor: pointer;
        }
        .footer-btn-next { background: var(--primary); color: var(--background); }
        .footer-btn-next:hover { transform: translateY(-2px); box-shadow: 0 2px 10px rgba(0,0,0,0.18); }
        .footer-btn-back { background: rgba(255, 255, 255, 0.04); color: var(--text-muted); }
        .footer-btn-back:hover { background: rgba(255, 255, 255, 0.09); color: var(--text-primary); }
    </style>
</head>
<body>
    <div class="reading-progress" id="readingProgress"></div>
    <header class="mod-header">
        <div class="mod-header-inner">
            <a href="${backHref}" class="back-link">← ${track.name}</a>
            <span class="mod-header-meta">MODULE ${i + 1} OF ${track.modules.length} · ${mod.level.toUpperCase()}</span>
        </div>
    </header>

    <article class="article">
        <span class="module-label">${mod.level} · Module ${i + 1}</span>
        <h1 class="article-title">${mod.title}</h1>
        <div class="article-meta">
            <span class="meta-item">${track.name}</span>
            <span class="meta-dot"></span>
            <span class="meta-item">${mod.level}</span>
            <span class="meta-dot"></span>
            <span class="meta-item">${mins} min read</span>
        </div>

${sections}

        <div class="quiz-section">
            <h3>Check your understanding</h3>
            <p class="quiz-subtitle">${mod.quiz.length + 1} questions — the last one is hands-on. Your score saves to your account.</p>
${qs}

${vqHtml}
        </div>

        <div class="sources">
            <h3>Sources &amp; Further Reading</h3>
${refsFor(mod.title)}
        </div>
    </article>

    <div class="module-footer">
        <a href="${backHref}" class="footer-btn footer-btn-back">&larr; Back to Path</a>
        <a href="${next}" class="footer-btn footer-btn-next">${nextLabel}</a>
    </div>

    <script>
        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
            document.getElementById('readingProgress').style.width = Math.min(pct, 100) + '%';
        });
        function checkQuiz(num, el, isCorrect) {
            const q = document.getElementById('q' + num);
            const fb = document.getElementById('fb' + num);
            const opts = q.querySelectorAll('.quiz-opt');
            opts.forEach(o => { o.classList.add('disabled'); o.classList.remove('correct', 'wrong'); });
            const why = q.dataset.why ? ' ' + q.dataset.why : '';
            if (isCorrect) {
                el.classList.add('correct');
                fb.textContent = 'Correct.' + why;
                fb.className = 'quiz-feedback show right';
            } else {
                el.classList.add('wrong');
                opts.forEach(o => { if (o.getAttribute('onclick').includes('true')) o.classList.add('correct'); });
                fb.textContent = 'Not quite — the correct answer is highlighted.' + why;
                fb.className = 'quiz-feedback show wrong-fb';
            }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/supabase-config.js"></script>
    <script src="js/sl.js"></script>
    <script src="js/guard.js"></script>
    <script src="js/quiz.js"></script>
</body>
</html>
`;
}

function pathPage(trackKey, track) {
  const levels = [...new Set(track.modules.map(m => m.level))];
  const groups = levels.map(level => {
    const mods = track.modules.map((m, i) => ({ m, i })).filter(x => x.m.level === level);
    const cards = mods.map(({ m, i }) => {
      const file = moduleFile(trackKey, i);
      const feats = m.sections.map(s => `                        <li>${s[0]}</li>`).join('\n');
      const desc = (m.sections[0][1].split('. ')[0] + '.').slice(0, 140);
      return `                <div class="module-card lv-${level.toLowerCase()}" data-module="${trackKey}-module-${i + 1}" onclick="location.href='${file}'">
                    <div class="module-header">
                        <div class="module-number">${i + 1}</div>
                        <span class="module-status">Not Started</span>
                    </div>
                    <h3 class="module-title">${m.title}</h3>
                    <p class="module-description">${desc}</p>
                    <ul class="module-features">
${feats}
                    </ul>
                    <div class="module-progress">
                        <div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div>
                        <div class="progress-text">0% Complete</div>
                    </div>
                    <div class="module-actions">
                        <button class="module-btn start-btn">Begin Module</button>
                    </div>
                </div>`;
    }).join('\n\n');
    return `        <div class="level" id="level-${level.toLowerCase()}">
            <h2 class="level-title">${level}</h2>
            <div class="modules-grid">
${cards}
            </div>
        </div>`;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${track.name} - Fantasy Trader</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/theme.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --background: #1a1714; --text-primary: #f4eee6; --text-secondary: #b7ada1; }
        body { background: var(--background); color: var(--text-primary); font-family: 'Inter', system-ui, sans-serif; }
        .wrap { max-width: 1200px; margin: 0 auto; padding: 3rem 1.5rem 5rem; }
        .crumbs { margin-bottom: 2.5rem; }
        .kicker { color: ${track.accent}; font-size: .72rem; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; margin-bottom: .5rem; }
        h1 { font-size: 2.2rem; margin-bottom: .5rem; }
        .sub { color: var(--text-secondary); margin-bottom: 2.5rem; font-size: .98rem; }
        .level { margin-bottom: 3.5rem; }
        .level-title { font-size: 1.6rem; margin-bottom: 1.5rem; text-align: center; }
        #level-beginner .level-title, #level-foundations .level-title { color: #5cb88a; }
        #level-intermediate .level-title, #level-core .level-title { color: #E0A24C; }
        #level-advanced .level-title { color: #D9645C; }

        /* Verbatim card styles from the trading pathway (beginner-path.html),
           with the accent color scoped per level. */
        .level { --primary: #5cb88a; --secondary: #4a9e73; --primary-soft: rgba(92, 184, 138, 0.3); }
        #level-intermediate, #level-core { --primary: #e0a24c; --secondary: #d97706; --primary-soft: rgba(224, 162, 76, 0.3); }
        #level-advanced { --primary: #d9645c; --secondary: #dc2626; --primary-soft: rgba(217, 100, 92, 0.3); }

        .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .module-card {
            background: rgba(26, 26, 26, 0.95);
            border: 1px solid rgba(236, 226, 214, 0.2);
            border-radius: 16px;
            padding: 2rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        .module-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .module-card:hover::before {
            opacity: 1;
        }

        .module-card:hover {
            transform: translateY(-5px);
            border-color: var(--primary);
            box-shadow: 0 15px 35px rgba(236, 226, 214, 0.1);
        }

        .module-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
        }

        .module-number {
            width: 50px;
            height: 50px;
            background: var(--primary);
            color: var(--background);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.2rem;
        }

        .module-status {
            background: rgba(236, 226, 214, 0.1);
            color: var(--primary);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .module-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }

        .module-description {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .module-features {
            list-style: none;
            margin-bottom: 2rem;
        }

        .module-features li {
            color: var(--text-secondary);
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            padding-left: 1.5rem;
        }

        .module-features li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--primary);
            font-weight: bold;
        }

        .module-progress {
            margin-bottom: 1.5rem;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            border-radius: 4px;
            transition: width 0.3s ease;
        }

        .progress-text {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .module-actions {
            display: flex;
            gap: 1rem;
        }

        .module-btn {
            background: rgba(236, 226, 214, 0.1);
            color: var(--primary);
            border: 1px solid var(--primary-soft);
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 0.9rem;
            flex: 1;
        }

        .module-btn:hover {
            background: rgba(236, 226, 214, 0.2);
            transform: translateY(-2px);
        }

        .start-btn {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
        }

        .start-btn:hover {
            box-shadow: 0 2px 10px rgba(0,0,0,0.18);
        }

        .show-all { display: none; margin: -1.25rem 0 1.75rem; }
        .show-all a { color: var(--text-secondary); font: 600 .85rem 'Inter',sans-serif; text-decoration: none; }
        .show-all a:hover { color: var(--text-primary); }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="crumbs"><a href="learn.html" class="back-link">← Learning Hub</a></div>
        <div class="kicker">Learning Path</div>
        <h1>${track.name}</h1>
        <p class="sub">${track.tagline}</p>
        <div class="show-all" id="showAllRow"><a href="#" onclick="history.replaceState(null,'',location.pathname); applyLevelFilter(); return false;">← Show all levels</a></div>

${groups}
    </div>

    <script>
        // Show only the level in the URL hash (e.g. #beginner); otherwise show all.
        function applyLevelFilter() {
            const secs = Array.from(document.querySelectorAll('.level'));
            const h = location.hash.replace('#', '').toLowerCase();
            const row = document.getElementById('showAllRow');
            const active = secs.some(s => s.id === 'level-' + h);
            secs.forEach(s => { s.style.display = (!active || s.id === 'level-' + h) ? '' : 'none'; });
            // Single-level view matches the trading path pages: no level heading.
            document.querySelectorAll('.level-title').forEach(t => { t.style.display = active ? 'none' : ''; });
            if (row) row.style.display = active ? 'block' : 'none';
        }
        window.addEventListener('hashchange', applyLevelFilter);
        applyLevelFilter();
        // Open at the top — never scrolled down to the hash anchor.
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        setTimeout(() => window.scrollTo(0, 0), 0);
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/supabase-config.js"></script>
    <script src="js/sl.js"></script>
    <script src="js/guard.js"></script>
    <script>
        // Mark completed modules (from Supabase, falling back to local progress).
        (async () => {
            try {
                const progress = await SL.getLessonProgress();
                document.querySelectorAll('.module-card').forEach(card => {
                    const rec = progress[card.dataset.module];
                    if (rec && rec.completed) {
                        card.querySelector('.module-status').textContent = 'Completed';
                        card.querySelector('.module-status').classList.add('done');
                        card.querySelector('.progress-fill').style.width = '100%';
                        card.querySelector('.progress-text').textContent = '100% Complete';
                        card.querySelector('.module-btn').textContent = 'Review Module';
                    }
                });
            } catch (e) { /* fine */ }
        })();
    </script>
</body>
</html>
`;
}

if (require.main === module) {
let count = 0;
for (const [key, track] of Object.entries(TRACKS)) {
  track.modules.forEach((mod, i) => {
    fs.writeFileSync(path.join(ROOT, moduleFile(key, i)), modulePage(key, track, mod, i));
    count++;
  });
  fs.writeFileSync(path.join(ROOT, `${key}-path.html`), pathPage(key, track));
  count++;
}
console.log('Generated ' + count + ' pages.');
}

module.exports = { modulePage, pathPage, moduleFile, TRACKS };
