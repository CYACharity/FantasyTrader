// Generates the Master Course modules (master-module-1..6.html).
// Run: node scripts/gen-master.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const track = {
  name: 'Master Course', accent: '#E0A24C', key: 'master',
  tagline: 'The financial foundations behind everything — economics, credit, and money itself.',
  modules: [
    { level: 'Foundations', title: 'Economics: How Markets Set Prices',
      sections: [
        ['Supply, demand, and the price signal', `Every price you see is a negotiation between two curves. When more people want a thing than there is of it, price rises until enough buyers drop out; when supply floods in, price falls until buyers return. That's not just true of stocks — it's eggs, apartments, and airline seats. Prices are information: a rising price is the market shouting "make more of this," and a falling one says "stop." Once you read prices as signals instead of judgments, half of economics clicks into place.`],
        ['Incentives rule everything', `Economists assume people respond to incentives — and they're right often enough to bet on it. Tax something and you get less of it; subsidize it and you get more. Rent caps create apartment shortages; bonus targets create sandbagged forecasts. When a market behaves strangely, hunt for the incentive: someone, somewhere, is responding rationally to a rule you haven't noticed yet. This is the single most transferable idea in finance.`],
        ['Scarcity, trade-offs, and opportunity cost', `Economics is the study of scarcity: unlimited wants, limited stuff. Every choice therefore has an opportunity cost — the best alternative you gave up. A company that spends $1B on buybacks gave up $1B of factories; a student who studies finance gave up an evening of anything else. Investors who think in opportunity costs stop asking "is this good?" and start asking "is this better than my next-best option?" — which is the only question that ever matters in allocating money.`],
      ],
      quiz: [
        ['A rising price is best understood as…', ['A moral failure of sellers', 'A signal telling producers to make more', 'Proof of a bubble'], 1],
        ['Rent caps below market price typically cause…', ['More apartments', 'Shortages of apartments', 'No change'], 1],
        ['Opportunity cost means…', ['The sticker price of a choice', 'The value of the best alternative you gave up', 'The broker fee'], 1],
      ]},
    { level: 'Foundations', title: 'Macroeconomics: GDP, Inflation & the Fed',
      sections: [
        ['GDP: the economy’s scoreboard', `Gross Domestic Product totals everything a country produces in a year. When GDP grows ~2-3%, the U.S. economy is healthy; two negative quarters is the informal definition of recession. Markets care less about the level than the surprise — stocks move when growth comes in hotter or colder than forecast. Watch the direction and the revisions: the economy the headlines describe is usually two months old.`],
        ['Inflation: the silent tax', `Inflation is the rate at which money loses purchasing power. At 3% a year, prices double roughly every 24 years; at 8%, every 9. Mild inflation greases the economy; high inflation punishes savers and forces the response every investor fears — rate hikes. The CPI print each month is one of the few numbers that can move every asset on Earth in one minute.`],
        ['The Federal Reserve’s one big lever', `The Fed steers the economy mainly by setting the price of money — the federal funds rate. Cheap money spurs borrowing, hiring, and rising asset prices; expensive money cools all three. That's why markets hang on every Fed meeting: a quarter-point change ripples into mortgages, car loans, corporate debt, and the discount rate on every future cash flow. "Don't fight the Fed" survives as a saying because fighting it has bankrupted generations of traders.`],
      ],
      quiz: [
        ['The informal definition of a recession is…', ['One bad jobs report', 'Two consecutive quarters of shrinking GDP', 'A 10% market drop'], 1],
        ['At 8% inflation, prices double roughly every…', ['24 years', '9 years', '50 years'], 1],
        ['When the Fed raises rates, borrowing generally becomes…', ['Cheaper', 'More expensive', 'Unchanged'], 1],
      ]},
    { level: 'Core', title: 'Microeconomics: Firms, Elasticity & Competition',
      sections: [
        ['Elasticity: who can raise prices', `Elasticity measures how much demand falls when price rises. Insulin, cigarettes, and iPhones are inelastic — buyers pay up. Airline seats and generic cereal are elastic — raise prices and customers vanish. For investors this is gold: companies selling inelastic products (or products with no substitute) protect margins during inflation, which is exactly when everyone else's margins get crushed.`],
        ['Market structures and profit', `Profits depend on competition. In perfect competition (wheat farmers), profits get squeezed to nearly nothing. In oligopoly (airlines, telecoms), a few players tacitly avoid price wars. In monopoly-like positions (Google in search), pricing power is enormous until regulators arrive. Before buying any stock, name its market structure — it predicts margins better than last quarter's earnings do.`],
        ['Marginal thinking', `Firms don't ask "are we profitable?"; they ask "is the NEXT unit profitable?" A flight that's leaving anyway should sell its last empty seat for almost any price, because the marginal cost is a bag of pretzels. Software has near-zero marginal cost, which is why tech margins embarrass every industry that moves atoms instead of bits — and why investors pay premium multiples for code over concrete.`],
      ],
      quiz: [
        ['Inelastic demand means…', ['Buyers keep buying even when prices rise', 'Demand collapses on any price rise', 'Supply is fixed'], 0],
        ['Which structure typically has the strongest pricing power?', ['Perfect competition', 'A monopoly-like position', 'Commodity farming'], 1],
        ['Why do software companies have unusually high margins?', ['Government subsidies', 'Near-zero marginal cost per additional user', 'Cheap offices'], 1],
      ]},
    { level: 'Core', title: 'Real Estate Lending & Credit',
      sections: [
        ['How a mortgage actually works', `A mortgage is amortized: each payment is part interest, part principal, and early on it's nearly all interest. On a 30-year loan at 7%, you pay more in interest over the life of the loan than the house cost. Two numbers rule approval: loan-to-value (LTV — how much you borrowed vs. the home's worth) and debt-to-income (DTI — payments vs. paycheck). Lenders like LTV under 80% and DTI under 43%; cross those lines and rates climb or doors close.`],
        ['Credit scores and the price of trust', `A credit score is the market's estimate of whether you repay. The gap is expensive: a 760 borrower might get 6.5% while a 620 borrower pays 8%+ — on a $400k mortgage that's roughly $400 more every month for the same house. Payment history and utilization drive most of the score. In lending, trust is literally priced in basis points.`],
        ['2008: when lending standards died', `The financial crisis was a lending story. "Subprime" mortgages went to borrowers who couldn't repay, were bundled into securities rated AAA, and sold worldwide. When home prices dipped, defaults cascaded through every institution holding the paper. The lesson outlives the crisis: credit quality matters more than collateral prices, and any boom fueled by loosening lending standards ends the same way.`],
      ],
      quiz: [
        ['Early mortgage payments are mostly…', ['Principal', 'Interest', 'Property tax'], 1],
        ['LTV measures…', ['Loan size versus the property’s value', 'Monthly payment versus income', 'Interest versus principal'], 0],
        ['The core cause of the 2008 crisis was…', ['A stock market computer glitch', 'Collapsing lending standards packaged into AAA securities', 'Oil prices'], 1],
      ]},
    { level: 'Advanced', title: 'Corporate Finance & How Companies Raise Money',
      sections: [
        ['Debt versus equity', `Companies fund themselves two ways: borrow (debt) or sell ownership (equity). Debt is cheaper — interest is tax-deductible and lenders take less risk — but it must be repaid on schedule, and too much of it turns a bad quarter into bankruptcy. Equity never has to be repaid but dilutes every existing owner. The mix is the capital structure, and reading it tells you how fragile a company is before any headline does.`],
        ['IPOs, secondaries, and dilution', `An IPO sells shares to the public for the first time — the company gets cash, insiders get an exit, and you get a ticker. Later "secondary offerings" raise more cash by printing more shares, slicing the pie thinner for everyone holding. Watch share count over time: a company that grows earnings 50% but doubles its share count made each share poorer. Dilution is the quietest way shareholders lose money.`],
        ['WACC and the hurdle every project must clear', `A company's weighted average cost of capital blends what it pays lenders and what shareholders expect. It is the hurdle rate: projects earning above WACC create value; below it, they destroy value even if "profitable." This is why rate hikes quietly kill marginal projects economy-wide — the hurdle rises, and ideas that cleared 6% die at 9%. When you hear "cost of capital," think: the bar every corporate decision must beat.`],
      ],
      quiz: [
        ['Why is debt usually cheaper than equity?', ['Interest is tax-deductible and lenders bear less risk', 'Banks are generous', 'Equity pays interest too'], 0],
        ['A secondary offering typically…', ['Buys back shares', 'Dilutes existing shareholders by issuing new shares', 'Pays a special dividend'], 1],
        ['A project creates value when its return is…', ['Positive', 'Above the company’s cost of capital', 'Higher than last year’s'], 1],
      ]},
    { level: 'Advanced', title: 'Personal Finance: Taxes, Accounts & Compounding for You',
      sections: [
        ['The order of operations for your money', `Wealth-building has a boring, correct sequence: build a small emergency fund, capture any employer 401(k) match (an instant 100% return), kill high-interest debt (a guaranteed 25% "return" if it's credit cards), then max tax-advantaged accounts, then invest the rest in taxable accounts. People lose more money skipping steps in this list than they ever lose picking bad stocks.`],
        ['Tax-advantaged accounts are free money', `A Roth IRA grows and withdraws tax-free forever; a traditional 401(k) defers taxes until retirement. The difference compounds brutally: $10k a year for 30 years at 8% is ~$1.2M — and in a taxable account, decades of tax drag can cost six figures of that. The government literally offers investors a discount for using the right wrapper. Not taking it is voluntary.`],
        ['Capital gains and why holding wins twice', `Sell a winner within a year and the profit is taxed as ordinary income — up to 37%. Hold past one year and the long-term rate drops to 0-20%. Combine that with compounding and the patient investor wins twice: their money grows uninterrupted AND they hand less of it to the IRS. Frequent trading has to beat the market by several extra points a year just to break even with sitting still.`],
      ],
      quiz: [
        ['An employer 401(k) match is effectively…', ['A loan', 'An instant 100% return on the matched amount', 'A tax'], 1],
        ['A Roth IRA’s superpower is…', ['Unlimited contributions', 'Tax-free growth and withdrawals', 'Guaranteed returns'], 1],
        ['Holding an investment past one year usually…', ['Raises your tax rate', 'Lowers the tax rate on gains', 'Has no tax effect'], 1],
      ]},
  ],
};

module.exports={track};