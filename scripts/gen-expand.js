// Expands Investing + Alternatives tracks to 6 modules per level (18 each),
// regenerates all module pages + path pages in level order.
// Run: node scripts/gen-expand.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { modulePage, pathPage, TRACKS } = require('./gen-modules.js');

const S = (t, b) => [t, b];
const Q = (q, o, c) => [q, o, c];

const ADD = {
  investing: {
    Beginner: [
      { title: 'Setting Goals & Knowing Your Risk Tolerance', sections: [
        S('Money needs a job description', `Before buying anything, name what the money is for and when you need it. A house down payment in 3 years cannot ride the stock market's swings; retirement money in 2055 absolutely should. Short-horizon money belongs in safe, boring places; long-horizon money can afford volatility because it has time to recover. Most investing mistakes are really mismatches between the money's timeline and the asset's behavior.`),
        S('Risk tolerance is discovered, not declared', `Everyone is aggressive in a bull market. Your true risk tolerance is how you behaved the last time your account fell 20% — did you buy, hold, or panic-sell? Build a portfolio you can hold through the worst year it will plausibly have. An "optimal" allocation you abandon in a crash performs far worse than a modest one you keep.`),
        S('The emergency fund comes first', `Three to six months of expenses in cash is not dead money — it is what prevents forced selling. Investors without a cash buffer end up liquidating stocks at the bottom to fix a transmission or cover rent between jobs. The emergency fund's return is measured in disasters avoided, and it lets every other dollar stay invested through storms.`)],
        example: 'Two friends both invest $20,000. One needs it for a wedding in 18 months and loses 15% in a correction — a real loss, forced out at the bottom. The other needs it in 25 years; the same dip is a non-event. Same portfolio, opposite outcomes — the timeline was the risk.',
        quiz: [Q('Money needed within ~3 years belongs mostly in…', ['Growth stocks', 'Safe, stable assets', 'Crypto'], 1),
               Q('Your real risk tolerance is best revealed by…', ['A questionnaire', 'How you acted in the last 20% drop', 'Your salary'], 1),
               Q('The emergency fund exists mainly to…', ['Earn high returns', 'Prevent forced selling during emergencies', 'Pay taxes'], 1)] },
      { title: 'Retirement Accounts & the Free Money', sections: [
        S('The 401(k) match is a 100% return', `If your employer matches contributions, every dollar you put in up to the match instantly doubles. No investment on Earth reliably beats that. Contributing below the match threshold is refusing free salary. Capture the full match before doing anything else with investable money.`),
        S('Roth vs. Traditional in one paragraph', `Traditional accounts deduct taxes now and tax withdrawals later; Roth accounts tax you now and never again. Rough rule: if you expect higher tax rates in retirement than today (young, early-career), Roth wins; if you are in peak earning years, Traditional's upfront deduction often wins. Either massively beats a plain taxable account for long-term money.`),
        S('The quiet cost of cashing out', `Withdrawing retirement money early usually triggers taxes plus a 10% penalty — and worse, it amputates decades of compounding. A $10,000 early withdrawal at 30 isn't $10,000; it is roughly $100,000 missing at 65. Rollovers (moving accounts between jobs properly) avoid all of this; cash-outs are how retirements quietly get smaller.`)],
        example: 'Salary $60,000 with a 4% match: contributing $2,400 gets another $2,400 free — an instant 100% gain, before any market growth. Skipping the match for ten years costs about $24,000 in contributions and roughly $60,000+ in lost compounded value.',
        quiz: [Q('An employer match is effectively…', ['A loan', 'An instant 100% return', 'A gimmick'], 1),
               Q('A Roth account means…', ['Tax break now, taxed later', 'Taxed now, tax-free forever after', 'No taxes ever'], 1),
               Q('Cashing out a 401(k) early usually costs…', ['Nothing', 'Taxes plus a 10% penalty plus lost compounding', 'A small paperwork fee'], 1)] },
      { title: 'Bonds & Fixed Income Basics', sections: [
        S('A bond is a loan with a schedule', `Buy a bond and you are the lender: the issuer pays fixed interest (the coupon) and returns your principal at maturity. Governments issue the safest bonds; corporations pay more to compensate for default risk. The steadiness of those payments is why bonds calm a portfolio that stocks shake.`),
        S('The seesaw: rates up, prices down', `Bond prices move opposite to interest rates. If you hold a 3% bond and new bonds pay 5%, nobody wants yours at full price — it must sell at a discount. Longer-maturity bonds swing harder on this seesaw. This is why 2022 punished bondholders: rates rocketed, and long bonds fell like stocks.`),
        S('What bonds are for', `Bonds rarely make you rich; they keep you invested. Their job is ballast — dampening crashes so you never sell stocks at the bottom. The classic 60/40 stock/bond portfolio survives because the 40 lets people sleep. As your goal date approaches, shifting toward bonds converts market luck into locked-in outcomes.`)],
        example: 'You own a $1,000 bond paying 3%. Rates jump to 5%. A buyer can get $50/year elsewhere, so your $30/year bond only sells for roughly $800 — hold to maturity and you still get your $1,000 back, but selling early realizes the loss.',
        quiz: [Q('A bond is essentially…', ['Company ownership', 'A loan you make in exchange for interest', 'A savings account'], 1),
               Q('When interest rates rise, existing bond prices…', ['Rise', 'Fall', 'Stay fixed'], 1),
               Q('The main job of bonds in a portfolio is…', ['Maximum growth', 'Stability that keeps you invested', 'Tax evasion'], 1)] },
      { title: 'Behavioral Traps Every New Investor Falls Into', sections: [
        S('Chasing what already went up', `Performance chasing is buying last year's winner right before it becomes this year's loser. Funds and stocks that topped the charts attract floods of money at exactly the wrong moment. The market's history is littered with investors who bought tech in 2000, houses in 2007, and meme stocks in 2021 — because the chart looked amazing behind them.`),
        S('Loss aversion and the refusal to sell', `Losses hurt about twice as much as gains feel good, so investors hold losers hoping to "get back to even" — anchoring to a price the market has forgotten. The stock does not know you own it. The only question is whether it is the best use of that money today; "back to even" is an emotion, not a strategy.`),
        S('Checking the account every day', `The more often you look, the more losses you see: daily, stocks are down almost half the time; over 20-year windows, they have essentially never been. Frequent checking triggers frequent tinkering, and tinkering compounds into underperformance. Automate contributions, review quarterly, and let boredom do the compounding.`)],
        example: 'From 2000-2020 the average equity fund returned ~6%/yr — but the average fund INVESTOR earned closer to 4%, purely from buying after rallies and selling after drops. The behavior gap cost more than fees ever did.',
        quiz: [Q('Performance chasing means…', ['Buying assets after big runs, near their peak', 'Rebalancing yearly', 'Buying quality cheap'], 0),
               Q('"Waiting to get back to even" is…', ['Sound strategy', 'Anchoring — an emotional bias', 'Required by brokers'], 1),
               Q('Checking your portfolio daily mostly produces…', ['Better decisions', 'More perceived losses and more harmful tinkering', 'Higher returns'], 1)] },
    ],
    Intermediate: [
      { title: 'Growth vs. Value Investing', sections: [
        S('Two lenses on the same market', `Growth investors pay premium prices for companies expanding quickly, betting tomorrow's profits justify today's multiple. Value investors buy unloved companies below their intrinsic worth, betting the market's mood is wrong. Both work; both endure long stretches of looking foolish. The 2010s belonged to growth; value dominated the 2000s. Owning both prevents the decade from choosing for you.`),
        S('The P/E tells you which you own', `A P/E far above the market (say 40+) means the price already assumes years of flawless growth — miss once and the multiple collapses. A single-digit P/E means the market expects decline; your bet is that it is temporary. Neither number is good or bad alone: valuation only means something next to the company's actual trajectory.`),
        S('GARP: the sensible middle', `"Growth at a reasonable price" hunts for compounders that are neither hyped nor broken — steady growers at fair multiples. The PEG ratio (P/E divided by growth rate) is its rough tool: near 1 suggests price and growth are balanced. Most great long-term holdings spent years as GARP stocks before anyone called them obvious.`)],
        example: 'In 2000, Cisco (growth darling, P/E ~120) fell 85% over two years while boring Berkshire rose. In 2015-2021 the reverse: value trailed while growth tripled. Same investors, same market — different decade, different winner.',
        quiz: [Q('Value investing bets primarily that…', ['Fast growers keep growing', 'The market has mispriced an unloved business', 'Rates fall'], 1),
               Q('A P/E of 45 implies…', ['The stock is guaranteed to rise', 'Years of strong growth are already priced in', 'The company is dying'], 1),
               Q('A PEG ratio near 1 suggests…', ['Overvaluation', 'Price and growth roughly balanced', 'Bankruptcy risk'], 1)] },
      { title: 'Moats: Durable Competitive Advantage', sections: [
        S('Why moats matter more than growth', `High profits attract competitors like blood attracts sharks; the only question is whether the company can defend them. A moat is that defense. Without one, today's fat margins are tomorrow's price war. With one, profits persist long enough for compounding to do something extraordinary.`),
        S('The five classic moats', `Brands let companies charge more for the same thing (Coca-Cola). Network effects make products stronger with each user (Visa, marketplaces). Switching costs trap customers productively (banking software, Apple's ecosystem). Cost advantages let one player profitably undercut everyone (Costco). Regulatory licenses simply exclude competition (rating agencies, utilities). Great businesses often stack several.`),
        S('Testing a moat with numbers', `Stories lie; returns on capital don't. A genuine moat shows up as return on invested capital consistently above ~15% for a decade, stable-or-rising gross margins, and market share that survives recessions. If the "moat" never appears in the numbers, it is marketing.`)],
        example: 'Visa earns ~50% operating margins year after year — competitors would love that, but every new card network faces the chicken-and-egg of needing both millions of cardholders AND millions of merchants on day one. That network effect IS the profit.',
        quiz: [Q('A moat exists to…', ['Grow revenue faster', 'Defend high profits from competition', 'Reduce taxes'], 1),
               Q('Which is a network-effect business?', ['A wheat farm', 'A payments network that grows stronger with each user', 'A single restaurant'], 1),
               Q('The numeric fingerprint of a real moat is…', ['A high stock price', 'Consistently high return on invested capital', 'Large ad spending'], 1)] },
      { title: 'Position Sizing & Rebalancing Discipline', sections: [
        S('How much of any one thing', `Sizing beats picking. A brilliant stock at 40% of your portfolio can still ruin you on one bad earnings call; a mediocre one at 2% cannot. Common guardrails: no single stock above 5-10%, no single sector above 25%. The goal is a portfolio where you can be wrong — because eventually you will be.`),
        S('Drift is silent risk creep', `Win big in one holding and it quietly becomes your portfolio. Investors who never trimmed their tech winners entered 2022 with double their intended risk — the market did their allocating for them. Check weights, not just returns: the portfolio you have is rarely the one you designed.`),
        S('Rebalancing rules that actually get followed', `Pick a trigger — yearly on your birthday, or whenever an asset drifts 5 points from target — and obey it mechanically. In taxable accounts, rebalance with new contributions instead of selling to avoid tax drag. The magic is not the math; it is that a rule executes when your emotions would not.`)],
        example: 'A 60/40 portfolio left alone from 2012-2021 drifted to roughly 80/20 — then 2022 hit the "conservative" investor with a growth portfolio’s losses. An annual rebalance would have trimmed stocks eight years in a row and cushioned the fall.',
        quiz: [Q('Position sizing exists so that…', ['Winners get bigger', 'No single mistake can ruin the account', 'Brokers earn commissions'], 1),
               Q('Portfolio drift means…', ['Prices moving your weights away from plan', 'Slow order execution', 'Dividend reinvestment'], 0),
               Q('In taxable accounts, the tax-smart rebalance uses…', ['Frequent selling', 'New contributions directed to underweight assets', 'Options'], 1)] },
      { title: 'Economic Cycles & Sector Rotation', sections: [
        S('The four seasons of the economy', `Expansions run for years; recessions arrive fast and rude. Early cycle favors banks and consumer discretionary as credit flows; mid-cycle lifts industrials and tech; late cycle rewards energy and materials as inflation firms; recessions crown the boring — utilities, healthcare, staples — because people pay the electric bill in any economy.`),
        S('The yield curve as a weather vane', `When 10-year bonds pay LESS than 2-year bonds — an "inverted" curve — markets are betting on rate cuts ahead, historically a recession warning with a long fuse. It is not a trading trigger; it is a reminder to check your ballast before the storm that may come.`),
        S('What long-term investors do with all this', `Mostly: nothing dramatic. Cycle awareness is for expectations, not wholesale portfolio surgery — the people who sold everything at every warning missed entire bull markets. Reasonable uses: tilting new contributions toward beaten-down sectors, and refusing to extrapolate the current season forever.`)],
        example: 'In 2022’s late-cycle inflation, energy rose 59% while tech fell 33%. By 2023 the rotation flipped completely. Anyone who "learned the lesson" of 2022 and went all-energy missed tech’s 50%+ rebound — seasons change.',
        quiz: [Q('Classic recession-resistant sectors include…', ['Utilities, healthcare, consumer staples', 'Luxury goods and airlines', 'Crypto miners'], 0),
               Q('An inverted yield curve historically signals…', ['Guaranteed boom', 'Elevated recession risk ahead', 'Nothing'], 1),
               Q('The long-term investor’s best use of cycle knowledge is…', ['All-in sector bets', 'Tempered expectations and modest tilts', 'Daily trading'], 1)] },
    ],
    Advanced: [
      { title: 'DCF in Practice: Valuing a Real Business', sections: [
        S('The three inputs that matter', `Every discounted cash flow model reduces to: how much cash the business generates, how fast that grows, and what discount rate reflects the risk. Small changes in growth or discount assumptions swing the answer wildly — which is why a DCF is a thinking tool, not an oracle. Its real value is forcing you to state your assumptions out loud.`),
        S('Terminal value: where models go to lie', `Most of a DCF's answer hides in the "terminal value" — the assumed worth of all cash flows beyond year ten. Aggressive terminal growth assumptions can justify any price. Sanity checks: terminal growth should not exceed GDP growth (~2-3%), and the implied exit multiple should look like a real company's, not a fantasy.`),
        S('Reverse DCF: the professional shortcut', `Instead of guessing the future, run it backward: what growth does today's price already assume? If a stock's price implies 25% annual growth for 15 years, you now know the bar. Sometimes the market's embedded assumption is obviously too pessimistic — that gap is where value investors live.`)],
        example: 'A company generates $100M free cash flow. At 10% discount and 3% terminal growth, it is worth ~$1.4B. Nudge growth to 5% and it “becomes” $2B; use 8% discount and $2.9B. Same company, three answers — the assumptions ARE the valuation.',
        quiz: [Q('A DCF values a company as…', ['Its book value', 'The discounted sum of its future cash flows', 'Last year’s revenue times ten'], 1),
               Q('Terminal value is dangerous because…', ['It is illegal', 'Most of the answer hides in far-future assumptions', 'It ignores cash'], 1),
               Q('A reverse DCF asks…', ['What growth the current price already implies', 'What the CEO predicts', 'What the Fed will do'], 0)] },
      { title: 'Special Situations: Spinoffs, Arbitrage & Buybacks', sections: [
        S('Why spinoffs beat the market', `When a conglomerate hands shareholders a division as a new company, forced selling follows — index funds and institutions dump shares the mandate doesn't allow. That mechanical selling creates bargains unrelated to business quality, and newly liberated management finally runs the unit for itself. Studies repeatedly find spinoffs outperforming for years after separation.`),
        S('Merger arbitrage without a hedge fund', `After a cash acquisition is announced, the target trades slightly below deal price; the gap compensates for collapse risk. Individuals rarely need to play the spread, but must understand it: if you own a target, most of your upside arrived on announcement day — holding to closing earns pennies while risking the whole premium.`),
        S('Buyback quality analysis', `A buyback is only as smart as the price paid. Companies that repurchase steadily through downturns compound owners' stakes beautifully; those that buy at peaks with borrowed money destroy value with shareholders' own cash. Check: is share count actually falling over five years, and were the purchases made below today's price?`)],
        example: 'PayPal spun off from eBay in 2015 at ~$36. Freed to chase digital payments alone, it hit $300 by 2021 — while investors who kept only the parent watched eBay roughly double. Focus has a price tag.',
        quiz: [Q('Spinoffs often outperform partly because…', ['They advertise more', 'Mechanical forced selling creates cheap entry prices', 'They pay huge dividends'], 1),
               Q('After a cash deal is announced, the target’s remaining upside is usually…', ['Huge', 'Small — the spread to deal price', 'Unlimited'], 1),
               Q('A high-quality buyback program…', ['Buys most at market peaks', 'Shrinks share count at sensible prices over years', 'Uses maximum debt'], 1)] },
      { title: 'International Investing & Currency Risk', sections: [
        S('The home-bias tax', `Americans hold ~80% US stocks though the US is ~60% of world markets; investors everywhere overweight home. Decades alternate leadership: international crushed the US in the 2000s, then the reverse. Global diversification is not about predicting the winner — it is about refusing to bet everything on one country's decade.`),
        S('Currency: the return inside the return', `Owning a Japanese stock means owning yen too. A 10% Tokyo rally with a 10% yen slide nets an American nothing. Currency swings usually wash out over decades, but they dominate short windows. Hedged funds remove the currency ride for a fee; unhedged funds accept it as extra diversification.`),
        S('Emerging markets: higher ceiling, lower floor', `Faster GDP growth does not automatically become shareholder returns — dilution, governance, and politics take their cut, which is why China's boom coexisted with mediocre index returns. Emerging markets earn a slice of a portfolio for their valuations and diversification, sized so a lost decade there is an annoyance, not a tragedy.`)],
        example: 'From 2000-2009 the S&P 500 returned roughly ZERO ("the lost decade") while emerging markets tripled. From 2010-2020, the S&P tripled while EM went sideways. A 70/30 blend never looked brilliant — and never looked broken.',
        quiz: [Q('Home bias means…', ['Overweighting your own country’s stocks', 'Buying real estate', 'Avoiding bonds'], 0),
               Q('An unhedged foreign stock position exposes you to…', ['Only the stock', 'The stock plus its currency', 'Neither'], 1),
               Q('Fast GDP growth in a country guarantees…', ['High stock returns', 'Nothing — dilution and governance intervene', 'Currency gains'], 1)] },
      { title: 'Building an Income Portfolio', sections: [
        S('Yield is a menu, not a number', `Income can come from dividend stocks, REITs, bonds, covered-call funds, and preferreds — each with different risk. The discipline is refusing to reach: when something yields 11% in a 4% world, the market is telling you the payout, the principal, or both are in danger. Sustainable income portfolios blend moderate yields from several sources.`),
        S('Dividend growth beats high yield', `A 2% yield growing 10% yearly doubles your income in 7 years and usually rides a healthy business; a static 8% yield often decays. Over 20+ years, dividend GROWERS have beaten high-yielders with less drama. Income investing done well is really quality investing that pays you along the way.`),
        S('Sequence risk and the income bridge', `Retiring into a crash is the nightmare: selling depressed shares for living expenses locks in losses permanently. Income portfolios blunt this — dividends and coupons arrive without selling anything. Pairing 1-2 years of cash with reliable income streams lets equities recover on their own schedule.`)],
        example: 'In 2008-09, dividends of the S&P fell ~20% while prices fell ~55%. A retiree living on dividends took a painful income cut; a retiree selling shares for income sold at half price — and never got those shares back.',
        quiz: [Q('An 11% yield in a 4% world usually signals…', ['A generous management', 'Market-priced danger to the payout or principal', 'A sure thing'], 1),
               Q('Over decades, the stronger income strategy has been…', ['Highest current yield', 'Dividend growth from quality businesses', 'Monthly lottery tickets'], 1),
               Q('Sequence risk is…', ['Bad luck ordering of returns when withdrawing', 'A bond term', 'A tax form'], 0)] },
    ],
  },
  alternatives: {
    Beginner: [
      { title: 'Stablecoins & the Plumbing of Crypto', sections: [
        S('Dollars that live on-chain', `Stablecoins are crypto tokens pegged 1:1 to the dollar, backed (ideally) by real reserves of cash and Treasuries. They exist so traders can move dollars at blockchain speed — settling in seconds, 24/7, across borders. They are the plumbing of the entire crypto economy, moving trillions a year.`),
        S('Not all pegs are equal', `Reserve-backed coins (like the majors) publish audits of their holdings. Algorithmic stablecoins tried to hold the peg with code and incentives instead of assets — and Terra/UST's $40B collapse in 2022 showed how that ends. Rule: if the peg's backing can't be simply explained, the "stable" is marketing.`),
        S('What beginners actually use them for', `Parking profits between trades without exiting to a bank, moving money between exchanges, and earning interest in regulated products. The risks are the issuer (are reserves real?) and the platform holding them (exchanges fail). Stablecoins are a tool, not an investment — they are designed to NOT go up.`)],
        example: 'During a crypto crash, a trader sells Bitcoin into a stablecoin in 10 seconds at 2 a.m. Sunday — impossible in banking hours — then buys back a week later 20% lower. The stablecoin earned nothing; it just held the line.',
        quiz: [Q('A stablecoin is designed to…', ['Grow 10x', 'Hold a fixed $1 value', 'Replace stocks'], 1),
               Q('Terra/UST collapsed because…', ['Hackers', 'Its peg relied on code and incentives, not real reserves', 'Regulators banned it'], 1),
               Q('Stablecoins are best understood as…', ['An investment', 'Plumbing — a tool for moving dollars on-chain', 'A retirement plan'], 1)] },
      { title: 'Fractional Real Estate & Crowdfunding', sections: [
        S('Property ownership without the property', `Platforms now sell fractional slices of rental homes and commercial buildings for as little as $100. You get proportional rent and appreciation without tenants, toilets, or a mortgage application. It is real exposure — with the critical difference that someone else controls the asset.`),
        S('Read the liquidity fine print', `Unlike a REIT you can sell in one click, crowdfunded real estate often locks money for 3-7 years, with redemption "windows" that can close in stressed markets — exactly when you might want out. Several major platforms froze withdrawals in 2020 and 2022. Illiquidity is the price of entry; only commit money with a matching timeline.`),
        S('Fees and alignment', `Platforms earn origination fees, management fees, and promote fees — often 2-4% a year all-in, quietly consuming a third of returns. Prefer structures where sponsors invest their own money alongside yours and earn most of their upside only after you hit a preferred return.`)],
        example: 'A $500 slice of a rental duplex pays ~$30/year in distributions (6%) plus appreciation at sale. The same $500 in a public REIT ETF yields ~4% but can be sold in seconds. The extra 2% is the paycheck for giving up the exit.',
        quiz: [Q('Fractional real estate platforms offer…', ['Free houses', 'Small ownership slices with rent and appreciation', 'Guaranteed returns'], 1),
               Q('The biggest structural drawback versus REITs is…', ['Taxes', 'Illiquidity — money can be locked for years', 'No income'], 1),
               Q('Good sponsor alignment means…', ['High fees upfront', 'Sponsors co-invest and profit mainly after you do', 'Anonymous management'], 1)] },
      { title: 'Collectibles: Art, Watches & Cards', sections: [
        S('Passion assets with price tags', `Art, watches, wine, sneakers, and trading cards have all minted spectacular headlines — a LeBron card selling for $5M, Rolexes doubling in a year. These are "passion assets": part investment, part hobby. The collector who loves the object wins either way; the pure speculator owns an illiquid bet on fashion.`),
        S('The brutal economics under the romance', `Spreads are enormous — auction houses take 15-25%, authentication costs money, storage and insurance never stop, and there is no dividend while you wait. A collectible must appreciate ~30% just to break even against those frictions. Prices also swing with rich people's liquidity: the 2022 watch crash tracked the crypto crash almost tick for tick.`),
        S('If you still want in', `Buy the best example you can afford of something with decades of collector history — blue-chip, not fads. Condition and provenance dominate value. Fractional platforms now offer slices of famous art, converting the hobby into something closer to a (still illiquid) security. Keep the whole category to low single digits of a portfolio.`)],
        example: 'A Rolex Daytona bought for $14,000 in 2020 peaked near $50,000 in early 2022, then fell to ~$28,000 by 2023. The owner who loved wearing it did fine either way; the flipper who bought the top with a loan did not.',
        quiz: [Q('Collectibles must appreciate substantially just to overcome…', ['Inflation only', 'Spreads, storage, insurance, and authentication costs', 'Nothing'], 1),
               Q('Collectible prices are highly sensitive to…', ['Weather', 'The liquidity and mood of wealthy buyers', 'GDP revisions'], 1),
               Q('The wisest collectible strategy is…', ['Chasing this year’s fad', 'Blue-chip items with long collector history, sized small', 'Using leverage'], 1)] },
      { title: 'Gold vs. Bitcoin: The Store-of-Value Debate', sections: [
        S('The case for the old rock', `Gold has 4,000 years of trust, near-zero correlation with stocks, central banks as permanent buyers, and no dependence on electricity or code. In every modern crisis — 2008, 2020, 2022 — gold held or rose while risk assets fell. Its weakness: it compounds nothing and can drift for decades.`),
        S('The case for the new code', `Bitcoin offers absolute scarcity (21M forever), portability across borders in seconds, and immunity from any single government's printing press. Its adoption curve resembles gold ETF adoption in the 2000s — with regulated spot ETFs now welcoming institutions. Its weakness: 70-80% drawdowns and a 15-year track record versus four millennia.`),
        S('The grown-up answer', `They solve overlapping problems for different generations and risk appetites. Portfolio data says small allocations to either — or both — improved risk-adjusted returns over the past decade. What breaks portfolios is treating either as a conviction lottery ticket instead of measured insurance against monetary mischief.`)],
        example: 'In 2022 both "inflation hedges" were tested: gold finished roughly flat while Bitcoin fell 64%. In 2020 both rose — gold +25%, Bitcoin +300%. Different assets, different tempers, same underlying worry about paper money.',
        quiz: [Q('Gold’s core weakness as an asset is…', ['It rusts', 'It produces no cash flow and can stagnate for decades', 'Central banks hate it'], 1),
               Q('Bitcoin’s scarcity comes from…', ['Mining difficulty announcements', 'A hard 21 million coin cap in the protocol', 'Government treaties'], 1),
               Q('The evidence-based approach to both is…', ['All-in on one', 'Small, measured allocations as monetary insurance', 'Avoiding both forever'], 1)] },
    ],
    Intermediate: [
      { title: 'Ethereum & Smart-Contract Platforms', sections: [
        S('A world computer, not a coin', `Ethereum's token is a claim on a platform where code executes automatically — lending, exchanges, and tokenized assets run without companies behind them. Demand for block space is demand for ETH, since every transaction burns fees. Valuing ETH is closer to valuing a toll road than valuing digital gold.`),
        S('The competitive landscape', `Rivals (Solana and others) compete on speed and cost; Ethereum competes on security and the deepest developer ecosystem, pushing scale onto "Layer 2" networks that settle back to the main chain. Platform crypto is a technology bet with winner-take-most dynamics — diversification across leaders beats guessing the single winner.`),
        S('Staking: yield with strings', `Locking ETH to secure the network earns ~3-4% yield paid in ETH — real protocol revenue, not marketing. The strings: validator risks, occasional lockups, and taxes on rewards. Staking through major exchanges adds counterparty risk for convenience; running your own validator trades convenience for control.`)],
        example: 'In 2021’s NFT mania, Ethereum burned so much in fees that ETH supply briefly shrank while usage soared — the toll road was full. In the 2022 bust, fees collapsed 90% and so did the price. Usage IS the fundamental.',
        quiz: [Q('ETH’s value is most tied to…', ['Its logo', 'Demand for computation and fees on its network', 'Gold reserves'], 1),
               Q('Layer 2 networks exist to…', ['Replace Ethereum', 'Scale transactions cheaply while settling to the main chain', 'Mine Bitcoin'], 1),
               Q('Staking yield originates from…', ['Nothing — it’s fake', 'Protocol rewards and fees for securing the network', 'A hedge fund'], 1)] },
      { title: 'Rental Property Math, All the Way Down', sections: [
        S('The numbers that decide everything', `Serious landlords underwrite before they tour: the 1% rule screens (monthly rent ≥ 1% of price is promising), then NOI (rent minus ALL operating costs), cap rate (NOI/price), and cash-on-cash return (annual cash flow / cash invested). If the spreadsheet fails, the granite countertops do not matter.`),
        S('The expenses beginners forget', `Vacancy (budget 5-8%), repairs (5-10% of rent), capital expenditures — the roof and furnace fund (5-10%), property management (8-10% even if you self-manage today), insurance, taxes, and rising HOA fees. The 50% rule of thumb: operating expenses eventually eat about half of rent. Deals die honest deaths in this paragraph.`),
        S('Leverage and the BRRRR flywheel', `Buy, Rehab, Rent, Refinance, Repeat: force appreciation with renovations, then refinance to pull capital out and buy the next property. Executed well it compounds fast; executed at 2022 rates against 2021 prices it traps investors with negative cash flow. The flywheel spins both directions.`)],
        example: 'A $250,000 house rents for $2,100. Gross yield looks great — but 50% expenses leave ~$1,050 NOI monthly, and the $1,350 mortgage (20% down, 7%) means NEGATIVE $300/month. The same house at $180,000 cash-flows +$180. Price, not property, made the deal.',
        quiz: [Q('Cash-on-cash return measures…', ['Total property value growth', 'Annual cash flow against actual cash invested', 'Rent minus mortgage only'], 1),
               Q('The 50% rule warns that…', ['Half of tenants leave yearly', 'Operating expenses eventually consume ~half of rent', 'Prices fall 50%'], 1),
               Q('BRRRR investing fails most often when…', ['Paint colors are wrong', 'Refinance rates and prices move against the plan', 'Tenants pay early'], 1)] },
      { title: 'Analyzing REITs Like a Professional', sections: [
        S('Why earnings lie about REITs', `Accounting forces REITs to depreciate buildings that often appreciate, crushing reported earnings. The industry's real metric is FFO — funds from operations — which adds depreciation back. A REIT trading at "40x earnings" might be a modest 14x FFO. Screen with the right denominator or screen out every bargain.`),
        S('NAV: the liquidation lens', `Net asset value asks what the buildings would fetch sold today, minus debt. REITs swing from premiums to deep discounts versus NAV with sentiment; buying quality portfolios at 25% discounts to conservatively-marked NAV has been one of the sector's most reliable setups. The discount is the margin of safety.`),
        S('Sector is destiny', `"REITs" is not one bet: data centers and cell towers ride digital growth; industrial warehouses ride e-commerce; offices fight remote work; malls fight everything. Balance-sheet quality (debt maturities, fixed vs. floating) decides who survives rate spikes. Buy the property type's future, not the ticker's yield.`)],
        example: 'In 2023, office REITs traded at 50%+ discounts to stated NAV — the market calling the appraisals fiction — while data-center REITs commanded premiums. Same legal structure, opposite futures.',
        quiz: [Q('FFO exists because…', ['REITs hide profits', 'Depreciation makes REIT earnings misleadingly low', 'Taxes require it'], 1),
               Q('Buying below NAV means…', ['Paying less than the estimated value of the underlying properties', 'Buying below $10', 'Shorting'], 0),
               Q('The most important REIT differentiator is…', ['The logo', 'Property sector and balance-sheet quality', 'Dividend day of month'], 1)] },
      { title: 'Energy & Agriculture: Trading the Physical World', sections: [
        S('Oil: the world’s most political commodity', `Oil prices balance OPEC's discipline, US shale's flexibility, and demand's slow tides. Shale reshaped everything: when prices spike, drillers respond in months, capping rallies that once ran for years. Investors express views through producer equities (operational leverage) or futures-based funds (roll costs apply) — different vehicles, different risks.`),
        S('Natural gas and the weather casino', `Gas is regional and brutal — priced off pipelines, storage levels, and temperature forecasts. It can triple on a cold winter and collapse 80% on a mild one. LNG exports slowly link continental prices. For most portfolios, gas belongs inside diversified energy exposure, not as a standalone weather bet.`),
        S('Grains and the food cycle', `Corn, wheat, and soybeans ride planting decisions, weather, and geopolitics — Ukraine's invasion sent wheat limit-up for days. Farmland itself has quietly returned ~10% annually for decades (income plus appreciation) with low correlation to stocks, now accessible through specialized REITs and platforms.`)],
        example: 'In 2020 oil futures briefly went NEGATIVE — storage was full, and holders paid others to take delivery. Two years later oil topped $120. Physical constraints create swings equities rarely match.',
        quiz: [Q('US shale changed oil markets by…', ['Ending OPEC', 'Adding fast-responding supply that caps long rallies', 'Making oil scarce'], 1),
               Q('Natural gas prices are dominated by…', ['Fashion', 'Storage levels and weather', 'Stock buybacks'], 1),
               Q('Farmland’s investment appeal is…', ['Meme potential', 'Steady income plus appreciation, low stock correlation', 'Daily liquidity'], 1)] },
    ],
    Advanced: [
      { title: 'Hedge Fund Strategies, Demystified', sections: [
        S('The main flavors', `Long/short equity bets on winners against losers, aiming to profit in both directions. Global macro trades currencies, rates, and commodities on big-picture theses. Event-driven plays mergers and restructurings. Trend-following (managed futures) mechanically rides momentum across everything — and famously printed +20% in 2022 while stocks and bonds burned.`),
        S('The fee hurdle and the mediocre middle', `"2 and 20" means a fund must beat markets by several points just to match an index fund after fees. The industry's average has failed that test for two decades; the top decile has not. Access, unfortunately, correlates with already being rich — the best funds choose their investors.`),
        S('What individuals can copy', `The useful lesson is not the fees; it is the discipline: uncorrelated return streams stabilize portfolios. Liquid alternatives now package trend-following and market-neutral strategies into ETFs. A 5-10% sleeve of genuine diversifiers — not "hedge fund" branding — is the retail-sized version of the idea.`)],
        example: 'In 2022, the S&P fell 18%, bonds fell 13% — and trend-following funds rose ~20% by riding short bonds and long dollar/energy. One sleeve of "weird" saved balanced portfolios’ year.',
        quiz: [Q('Trend-following strategies profit by…', ['Predicting reversals', 'Riding persistent momentum in either direction', 'Holding cash'], 1),
               Q('The core problem with average hedge funds is…', ['Illegal trading', 'Fees consuming the edge', 'Too much liquidity'], 1),
               Q('The retail-appropriate takeaway is…', ['Pay 2-and-20 somewhere', 'A small sleeve of genuinely uncorrelated strategies', 'Day trading'], 1)] },
      { title: 'Infrastructure & Farmland: The Boring Fortunes', sections: [
        S('Toll roads, pipelines, and towers', `Infrastructure assets sell necessities under long contracts, frequently inflation-linked: toll roads escalate with CPI, utilities earn regulated returns, cell towers sign decade leases. The result is bond-like stability with equity-like growth — which is why pensions and sovereign funds hoard them.`),
        S('Farmland: 150 years of quiet compounding', `US farmland has delivered roughly 10% annual total returns over generations — rent from farmers plus appreciation of finite acres — with lower volatility than stocks and strength during inflations. It is the original "they aren't making more of it" asset. REITs and platforms now sell exposure by the acre.`),
        S('The catch: duration and politics', `These assets are rate-sensitive (their steady cash flows get discounted like bonds) and politically exposed — regulators set utility returns, and nothing attracts government attention like food and roads. 2022's rate spike marked listed infrastructure down sharply even as underlying cash flows grew. Buy for decades or not at all.`)],
        example: 'A cell-tower REIT signs 10-year leases with built-in 3% escalators to all three phone carriers on one tower — three rents, one structure, contractual growth. That single-tower economics, times 40,000 towers, is why towers minted one of the market’s best 20-year runs.',
        quiz: [Q('Infrastructure’s appeal is…', ['Meme volatility', 'Contracted, often inflation-linked cash flows from necessities', 'Zero regulation'], 1),
               Q('Farmland’s long-run return profile is…', ['Wildly volatile', 'Roughly 10% annually with low stock correlation', 'Negative'], 1),
               Q('The main risks to these assets are…', ['Fashion trends', 'Interest rates and political/regulatory intervention', 'Weather only'], 1)] },
      { title: 'Advanced Crypto Security & Self-Custody', sections: [
        S('The threat model comes first', `Exchange failure (FTX), phishing, SIM-swaps, malware, and $5-wrench coercion are different attacks needing different defenses. Small trading balances can live on major exchanges; life-changing amounts demand self-custody. Security is proportional: protect $500 like $500 and $500,000 like a vault.`),
        S('Hardware wallets and the seed phrase', `A hardware wallet keeps private keys in a chip that never touches the internet; transactions are signed inside the device. The 24-word seed phrase IS the money — anyone holding it owns everything, and losing it loses everything. Steel backups beat paper; photographs of it are how fortunes end up on hackers’ clouds.`),
        S('Multisig and inheritance', `Multisignature setups require 2-of-3 keys to move funds — no single theft, loss, or coercion event is fatal. Collaborative custody services hold one key while you hold two. The hard problem nobody plans: inheritance. Documented recovery instructions for family, tested once a year, separate crypto wealth from crypto tragedy.`)],
        example: 'FTX customers with coins on the exchange lost access to $8B overnight in 2022. Anyone holding the same coins in a $79 hardware wallet was completely unaffected — same asset, opposite outcome, custody was the whole difference.',
        quiz: [Q('A hardware wallet protects you by…', ['Higher interest', 'Keeping private keys offline and signing internally', 'Government insurance'], 1),
               Q('Whoever possesses your seed phrase…', ['Needs your password too', 'Owns your coins, full stop', 'Can only view balances'], 1),
               Q('A 2-of-3 multisig means…', ['Three passwords', 'Any two of three keys authorize — no single point of failure', 'Triple fees'], 1)] },
      { title: 'Risk Parity & Modern Multi-Asset Design', sections: [
        S('The 60/40 illusion', `A 60/40 portfolio's RISK is ~90% stocks — bonds are too calm to matter at those weights. Risk parity rebalances by risk contribution instead of dollars: each asset class (stocks, bonds, commodities, gold) contributes similar volatility, often with modest leverage on the calm assets. The result historically: similar returns, smaller heart attacks.`),
        S('When the all-weather idea fails', `Risk parity's kryptonite is everything falling together — 2022's inflation shock hit levered bonds AND stocks, handing these funds their worst year. No allocation is weatherproof; the honest claim is fewer catastrophic scenarios, not zero. Inflation-linked assets earned their permanent seat that year.`),
        S('A practical all-weather sketch', `A retail approximation needs no leverage: ~35% global stocks, 30% bonds across maturities, 15% inflation-linked bonds, 10% gold, 10% commodities/real assets. Backtested across five decades it never had a truly ruinous year — and never a spectacular one. That trade — clipping both tails — is the entire point.`)],
        example: 'In 2008, a 60/40 portfolio fell ~22%; a risk-parity allocation fell ~4% as bonds and gold offset the equity crash. In 2022 the tables turned and both fell double digits. Diversification is a probability tilt, not a promise.',
        quiz: [Q('The hidden problem with 60/40 is…', ['Too many bonds', 'Nearly all the RISK still comes from stocks', 'Illegal leverage'], 1),
               Q('Risk parity allocates by…', ['Dollar amounts', 'Each asset’s contribution to portfolio risk', 'Alphabetical order'], 1),
               Q('2022 proved that risk parity…', ['Never loses', 'Can fail when inflation sinks stocks and bonds together', 'Beats everything always'], 1)] },
    ],
  },
};

// Merge additions into TRACKS in level order: [B existing..B new..I existing..I new..A existing..A new]
for (const key of Object.keys(ADD)) {
  const t = TRACKS[key];
  const byLevel = { Beginner: [], Intermediate: [], Advanced: [] };
  t.modules.forEach(m => byLevel[m.level].push(m));
  for (const lvl of Object.keys(ADD[key])) {
    ADD[key][lvl].forEach(m => byLevel[lvl].push(Object.assign({ level: lvl }, m)));
  }
  t.modules = [].concat(byLevel.Beginner, byLevel.Intermediate, byLevel.Advanced);
}

const EX_CSS = `        .example-box { background: rgba(236, 226, 214, 0.04); border: 1px solid rgba(224, 162, 76, 0.12); border-radius: 10px; padding: 1.5rem; margin: 1.8rem 0; }
        .example-label { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--accent); margin-bottom: 0.6rem; }
        .example-box p { font-size: 0.95rem; margin-bottom: 0; }
`;
// Old examples for the original 12 modules (kept)
const OLDEX = {
"investing-module-old-0":"You invest $200/month from age 22. At 8% average returns you cross $700,000 by 60 — and over $520,000 of it is growth, not deposits. Start at 32 instead and you end near $300,000.",
"investing-module-old-1":"An investor puts $10,000 into an S&P 500 ETF with a 0.03% fee versus an active fund charging 1%. Same 8% return for 30 years: ~$97,000 versus ~$74,000. The only difference was the fee.",
"investing-module-old-2":"Company A reports $2B net income but cash from operations of -$400M. Company B reports $1B income with $1.4B operating cash. B is the healthier business despite the smaller headline.",
"investing-module-old-3":"Two retailers both earn $5 per share. One trades at $60 (P/E 12), the other at $150 (P/E 30). Unless the second grows far faster, you pay 2.5x more for the same dollar of earnings.",
"investing-module-old-4":"A stock yields 9% while paying out 110% of earnings. Six months later the dividend is halved and the stock drops 30% — the classic yield trap.",
"investing-module-old-5":"Company X trades at $80; an acquirer announces a $100 cash offer; X jumps to $97. The $3 gap is deal risk — arbitrageurs earn it by betting the deal closes.",
"alternatives-module-old-0":"A 60/40 portfolio fell ~17% in 2022. The same portfolio with 10% in gold and commodities fell ~13% — the alternatives sleeve cushioned a year when stocks AND bonds dropped.",
"alternatives-module-old-1":"3% of a $50,000 portfolio ($1,500) goes into Bitcoin. An 80% crash costs $1,200 — survivable. A 10x run adds $13,500. Sizing made both outcomes acceptable in advance.",
"alternatives-module-old-2":"A $300,000 rental earns $15,000 net — a 5% cap rate. With mortgages at 7%, borrowing to buy it loses money monthly; the deal only works at a lower price or higher rent.",
"alternatives-module-old-3":"In 2022 the S&P fell 18% and bonds fell 13% — while a broad commodity index rose 16%. One allocation turned a brutal year into a manageable one.",
"alternatives-module-old-4":"A VC fund invests $1M in each of 20 startups. Twelve die, seven return ~1x, one returns 60x. Fund result: $87M on $20M — the entire profit from one company.",
"alternatives-module-old-5":"Yearly rebalancing between stocks and bonds+gold forced buying near the 2020 bottom and trimming near the 2021 top — automatic buy-low sell-high with zero forecasting.",
};
// map old examples by original title order
const OLD_TITLES = {
  investing: ['Why Long-Term Investing Works','Index Funds & Diversification','Reading Financial Statements','Valuation: What a Company Is Worth','Dividends, Buybacks & Quality','M&A and Corporate Actions'],
  alternatives: ['What Are Alternative Investments?','Crypto Fundamentals','Real Estate & REITs','Commodities & Gold','Private Equity & Venture Capital','Building a Multi-Asset Portfolio'],
};

let count = 0;
for (const [key, track] of Object.entries(TRACKS)) {
  track.modules.forEach((mod, i) => {
    const file = key + '-module-' + (i + 1) + '.html';
    let html = modulePage(key, track, mod, i);
    // inject example + section-card styling
    let ex = mod.example;
    if (!ex) {
      const oi = OLD_TITLES[key].indexOf(mod.title);
      if (oi >= 0) ex = OLDEX[key + '-module-old-' + oi];
    }
    html = html.replace('.quiz-section {', EX_CSS + '        .quiz-section {');
    if (ex) html = html.replace('<div class="quiz-section">',
      '<div class="example-box"><div class="example-label">Worked Example</div><p>' + ex + '</p></div>\n\n        <div class="quiz-section">');
    fs.writeFileSync(path.join(ROOT, file), html);
    count++;
  });
  fs.writeFileSync(path.join(ROOT, key + '-path.html'), pathPage(key, track));
  count++;
}
console.log('Regenerated ' + count + ' pages (18 modules per track + path pages).');
