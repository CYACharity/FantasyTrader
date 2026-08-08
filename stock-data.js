// Stock Data Service - Enhanced for TradingView-style interface
class StockDataService {
    constructor() {
        this.comprehensiveStocks = [
            { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
            { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
            { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary' },
            { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
            { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
            { symbol: 'BRK.A', name: 'Berkshire Hathaway Inc.', sector: 'Financial' },
            { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
            { symbol: 'V', name: 'Visa Inc.', sector: 'Financial' },
            { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial' },
            { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples' },
            { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
            { symbol: 'HD', name: 'The Home Depot Inc.', sector: 'Consumer Discretionary' },
            { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial' },
            { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services' },
            { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financial' },
            { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
            { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
            { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
            { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
            { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
            { symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare' },
            { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Staples' },
            { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples' },
            { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.', sector: 'Healthcare' },
            { symbol: 'COST', name: 'Costco Wholesale Corporation', sector: 'Consumer Staples' },
            { symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology' },
            { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
            { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples' },
            { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare' },
            { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial' },
            { symbol: 'LLY', name: 'Eli Lilly and Company', sector: 'Healthcare' },
            { symbol: 'ACN', name: 'Accenture plc', sector: 'Technology' },
            { symbol: 'TXN', name: 'Texas Instruments Inc.', sector: 'Technology' },
            { symbol: 'QCOM', name: 'QUALCOMM Inc.', sector: 'Technology' },
            { symbol: 'HON', name: 'Honeywell International Inc.', sector: 'Industrials' },
            { symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology' },
            { symbol: 'IBM', name: 'International Business Machines Corp.', sector: 'Technology' },
            { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', sector: 'Technology' },
            { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology' },
            { symbol: 'CMCSA', name: 'Comcast Corporation', sector: 'Communication Services' },
            { symbol: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services' },
            { symbol: 'T', name: 'AT&T Inc.', sector: 'Communication Services' },
            { symbol: 'UPS', name: 'United Parcel Service Inc.', sector: 'Industrials' },
            { symbol: 'RTX', name: 'Raytheon Technologies Corporation', sector: 'Industrials' },
            { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', sector: 'ETF' },
            { symbol: 'QQQ', name: 'Invesco QQQ Trust', sector: 'ETF' },
            { symbol: 'IWM', name: 'iShares Russell 2000 ETF', sector: 'ETF' },
            { symbol: 'GLD', name: 'SPDR Gold Shares', sector: 'ETF' },
            { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', sector: 'ETF' },
            { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', sector: 'ETF' },
            { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', sector: 'ETF' },
            { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', sector: 'ETF' }
        ];

        this.basePrices = {
            'AAPL': 175.50, 'MSFT': 380.25, 'GOOGL': 140.80, 'AMZN': 145.20, 'TSLA': 245.60,
            'META': 330.40, 'NVDA': 485.90, 'BRK.A': 520000, 'JNJ': 165.30, 'V': 250.75,
            'JPM': 170.45, 'PG': 155.80, 'UNH': 520.60, 'HD': 320.90, 'MA': 420.30,
            'DIS': 95.40, 'PYPL': 60.20, 'ADBE': 580.75, 'CRM': 240.50, 'NFLX': 485.30,
            'INTC': 45.80, 'PFE': 28.90, 'ABT': 105.60, 'KO': 58.40, 'PEP': 165.70,
            'TMO': 520.80, 'COST': 680.90, 'AVGO': 850.40, 'ABBV': 145.30, 'WMT': 165.80,
            'MRK': 105.90, 'BAC': 35.60, 'LLY': 580.40, 'ACN': 320.75, 'TXN': 165.90,
            'QCOM': 125.60, 'HON': 195.40, 'ORCL': 120.80, 'IBM': 165.30, 'AMD': 125.40,
            'CSCO': 48.90, 'CMCSA': 42.60, 'VZ': 33.80, 'T': 16.40, 'UPS': 165.70,
            'RTX': 85.30, 'SPY': 450.60, 'QQQ': 380.40, 'IWM': 185.90, 'GLD': 195.80,
            'TLT': 95.40, 'VTI': 235.60, 'VEA': 48.90, 'VWO': 42.30
        };
    }

    // Search stocks with comprehensive results
    async searchStocks(query) {
        const q = (query || '').trim();
        if (!q) return [];
        const upperQuery = q.toUpperCase();

        // Local quick-matches first (instant). Prefix matches lead — typing "AP"
        // suggests AAPL/APP/APO-style completions before fuzzy matches.
        const starts = this.comprehensiveStocks.filter(st => st.symbol.startsWith(upperQuery));
        const nameStarts = this.comprehensiveStocks.filter(st =>
            !st.symbol.startsWith(upperQuery) && st.name.toUpperCase().startsWith(upperQuery));
        const fuzzy = this.comprehensiveStocks.filter(st =>
            !st.symbol.startsWith(upperQuery) && !st.name.toUpperCase().startsWith(upperQuery) &&
            (st.symbol.includes(upperQuery) || st.name.toUpperCase().includes(upperQuery)));
        starts.sort((a, b) => a.symbol.length - b.symbol.length || a.symbol.localeCompare(b.symbol));
        let results = starts.concat(nameStarts, fuzzy).slice(0, 10);

        // Enrich with Yahoo's full universe (any US ticker), but NEVER let it
        // slow the dropdown: if Yahoo doesn't answer within 2.5s, show local
        // matches immediately.
        try {
            const j = await Promise.race([
                this.fetchYahoo('/v1/finance/search?q=' + encodeURIComponent(q), 2200),
                new Promise(res => setTimeout(() => res(null), 2500)),
            ]);
            const quotes = (j && j.quotes) || [];
            const extra = quotes
                .filter(x => x.symbol && (x.quoteType === 'EQUITY' || x.quoteType === 'ETF'))
                .map(x => ({ symbol: x.symbol, name: x.shortname || x.longname || x.symbol, sector: x.sector || 'Other' }));
            const seen = new Set(results.map(r => r.symbol));
            for (const e of extra) { if (!seen.has(e.symbol)) { results.push(e); seen.add(e.symbol); } }
        } catch (e) { /* keep local results if Yahoo is momentarily unreachable */ }

        // keep prefix completions on top after Yahoo enrichment too
        results.sort((a, b) => {
            const ap = a.symbol.startsWith(upperQuery) ? 0 : 1;
            const bp = b.symbol.startsWith(upperQuery) ? 0 : 1;
            return ap - bp || (ap === 0 ? a.symbol.length - b.symbol.length : 0);
        });
        return results.slice(0, 12);
    }

    // Get comprehensive search results (fallback)
    getComprehensiveSearchResults(query) {
        const upperQuery = query.toUpperCase();
        return this.comprehensiveStocks.filter(stock => 
            stock.symbol.includes(upperQuery) || 
            stock.name.toUpperCase().includes(upperQuery)
        ).slice(0, 10);
    }

    // Fetch JSON from Yahoo Finance through a CORS proxy (works in-browser).
    // Every request has a hard timeout so a slow/blocked proxy can NEVER hang
    // search, quotes, or charts — we fail fast and fall back instead.
    async fetchYahoo(path, timeoutMs = 3500) {
        const target = 'https://query1.finance.yahoo.com' + path;

        // 1) PRIMARY: our own Supabase market-data function — server-side,
        //    reliable, no public proxies involved.
        try {
            const base = (typeof window !== 'undefined' && window.SUPABASE_URL &&
                          !String(window.SUPABASE_URL).includes('YOUR_PROJECT')) ? window.SUPABASE_URL : null;
            if (base) {
                let qs = null;
                let m = path.match(/^\/v8\/finance\/chart\/([^?]+)\?range=([^&]+)&interval=([^&]+)/);
                if (m) qs = 'symbol=' + m[1] + '&range=' + m[2] + '&interval=' + m[3];
                if (!qs) {
                    m = path.match(/^\/v1\/finance\/search\?q=([^&]*)(?:&newsCount=(\d+))?(?:&quotesCount=(\d+))?/);
                    if (m) qs = 'type=search&q=' + m[1] + (m[2] != null ? '&newsCount=' + m[2] : '') + (m[3] != null ? '&quotesCount=' + m[3] : '');
                }
                if (qs) {
                    const ctrl = new AbortController();
                    const t = setTimeout(() => ctrl.abort(), timeoutMs);
                    const res = await fetch(base + '/functions/v1/market-data?' + qs, {
                        headers: { apikey: window.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + window.SUPABASE_ANON_KEY },
                        signal: ctrl.signal
                    });
                    clearTimeout(t);
                    if (res.ok) {
                        const json = await res.json();
                        if (json && (json.chart || json.quotes || json.news)) return json;
                    }
                }
            }
        } catch (e) { /* fall through to public proxies */ }

        const proxies = [
            (u) => 'https://corsproxy.io/?url=' + encodeURIComponent(u),
            (u) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
            (u) => 'https://thingproxy.freeboard.io/fetch/' + u,
        ];
        for (const wrap of proxies) {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), timeoutMs);
            try {
                const res = await fetch(wrap(target), { headers: { 'Accept': 'application/json' }, signal: ctrl.signal });
                clearTimeout(timer);
                if (!res.ok) continue;
                const json = await res.json();
                if (json && (json.chart || json.quoteResponse || json.quotes || json.news)) return json;
            } catch (e) { clearTimeout(timer); /* try next proxy */ }
        }
        return null;
    }

    // Get stock quote — REAL data from Yahoo (via proxy), then the Supabase
    // price cache, then a simulated value as a last resort so nothing breaks.
    async getStockQuote(symbol) {
        const stock = this.comprehensiveStocks.find(s => s.symbol === symbol) ||
                      { symbol: symbol, name: symbol, sector: 'Other' };

        // 1) LIVE Yahoo Finance data (fast timeout; cache fallback below).
        try {
            const j = await this.fetchYahoo('/v8/finance/chart/' + encodeURIComponent(symbol) + '?range=1d&interval=5m', 2500);
            const r = j && j.chart && j.chart.result && j.chart.result[0];
            const meta = r && r.meta;
            if (meta && meta.regularMarketPrice != null) {
                const price = Number(meta.regularMarketPrice);
                const prev = Number(meta.chartPreviousClose != null ? meta.chartPreviousClose : (meta.previousClose != null ? meta.previousClose : price));
                const change = price - prev;
                return {
                    symbol: symbol,
                    name: meta.shortName || meta.longName || stock.name,
                    price: price,
                    change: change,
                    changePercent: prev ? (change / prev) * 100 : 0,
                    volume: meta.regularMarketVolume || 0,
                    marketCap: 0, pe: 0, dividend: 0,
                    high52w: meta.fiftyTwoWeekHigh, low52w: meta.fiftyTwoWeekLow,
                    sector: stock.sector,
                    isLive: true
                };
            }
        } catch (e) { /* fall through */ }

        // 2) Supabase price cache (if the scraper is deployed).
        if (typeof window !== 'undefined' && window.SL && window.SL.configured) {
            try {
                const live = await window.SL.getPrice(symbol);
                if (live && live.price != null) {
                    return {
                        symbol: symbol, name: live.name || stock.name,
                        price: Number(live.price), change: Number(live.change || 0),
                        changePercent: Number(live.change_pct || 0),
                        volume: 0, marketCap: 0, pe: 0, dividend: 0,
                        sector: stock.sector, isLive: true
                    };
                }
            } catch (e) { /* fall through */ }
        }

        // 3) Last resort: simulated price so the UI still works offline.
        const basePrice = this.basePrices[symbol] || 100;
        const change = (Math.random() - 0.5) * basePrice * 0.02;
        const price = basePrice + change;
        return {
            symbol: symbol, name: stock.name, price: price, change: change,
            changePercent: (change / basePrice) * 100,
            volume: Math.floor(Math.random() * 10000000) + 1000000,
            marketCap: 0, pe: 0, dividend: 0, sector: stock.sector, isLive: false
        };
    }

    // Get mock data (fallback)
    getMockData(symbol) {
        const stock = this.comprehensiveStocks.find(s => s.symbol === symbol);
        if (!stock) {
            return {
                symbol: symbol,
                name: 'Unknown Company',
                price: 100,
                change: 0,
                changePercent: 0,
                volume: 1000000,
                marketCap: 10000000000,
                pe: 15,
                dividend: 2,
                sector: 'Unknown'
            };
        }

        const basePrice = this.basePrices[symbol] || 100;
        const change = (Math.random() - 0.5) * basePrice * 0.02;
        const price = basePrice + change;
        const changePercent = (change / basePrice) * 100;

        return {
            symbol: symbol,
            name: stock.name,
            price: price,
            change: change,
            changePercent: changePercent,
            volume: Math.floor(Math.random() * 10000000) + 1000000,
            marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
            pe: (Math.random() * 50) + 10,
            dividend: Math.random() * 5,
            sector: stock.sector
        };
    }

    // Generate realistic historical data
    generateHistoricalData(symbol, period = '1M') {
        const basePrice = this.basePrices[symbol] || 100;
        const days = this.getDaysForPeriod(period);
        const data = [];
        
        let currentPrice = basePrice;
        const volatility = 0.015; // 1.5% daily volatility
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Generate OHLC data
            const dailyChange = (Math.random() - 0.5) * currentPrice * volatility;
            const open = currentPrice;
            const close = currentPrice + dailyChange;
            const high = Math.max(open, close) + Math.random() * currentPrice * 0.01;
            const low = Math.min(open, close) - Math.random() * currentPrice * 0.01;
            
            data.push({
                time: Math.floor(date.getTime() / 1000),
                open: open,
                high: high,
                low: low,
                close: close
            });
            
            currentPrice = close;
        }
        
        return data;
    }

    // Get historical data — REAL OHLC candles from Yahoo (via proxy).
    async getHistoricalData(symbol, period = '1M') {
        const map = {
            '1D': ['1d', '5m'], '1W': ['5d', '30m'], '1M': ['1mo', '1d'],
            '3M': ['3mo', '1d'], '1Y': ['1y', '1wk'], 'ALL': ['5y', '1mo']
        };
        const [range, interval] = map[period] || ['1mo', '1d'];
        try {
            const j = await this.fetchYahoo('/v8/finance/chart/' + encodeURIComponent(symbol) +
                '?range=' + range + '&interval=' + interval);
            const r = j && j.chart && j.chart.result && j.chart.result[0];
            const ts = r && r.timestamp;
            const q = r && r.indicators && r.indicators.quote && r.indicators.quote[0];
            if (ts && q) {
                const out = [];
                for (let i = 0; i < ts.length; i++) {
                    if (q.close[i] == null) continue;
                    out.push({
                        time: ts[i],
                        open: q.open[i] != null ? q.open[i] : q.close[i],
                        high: q.high[i] != null ? q.high[i] : q.close[i],
                        low: q.low[i] != null ? q.low[i] : q.close[i],
                        close: q.close[i]
                    });
                }
                if (out.length > 1) { out._real = true; return out; }   // tagged: genuine market data
            }
        } catch (error) { /* fall through to simulated */ }
        return this.generateHistoricalData(symbol, period);   // NOT tagged _real — charts that must be honest can skip it
    }

    // Get mock historical data (fallback)
    getMockHistoricalData(symbol) {
        return this.generateHistoricalData(symbol, '1M');
    }

    // Helper function to get days for period
    getDaysForPeriod(period) {
        switch (period) {
            case '1D': return 1;
            case '1W': return 7;
            case '1M': return 30;
            case '3M': return 90;
            case '1Y': return 365;
            case 'ALL': return 1095; // 3 years
            default: return 30;
        }
    }

    // Live quotes for a list of symbols -> { SYM: {price, change, change_pct, name} }
    async getQuotes(symbols) {
        const out = {};
        await Promise.all((symbols || []).map(async (sym) => {
            try {
                const q = await this.getStockQuote(sym);
                out[sym] = { price: q.price, change: q.change, change_pct: q.changePercent, name: q.name };
            } catch (e) { /* skip */ }
        }));
        return out;
    }

    // Get all stocks for watchlist
    getAllStocks() {
        return this.comprehensiveStocks;
    }

    // Get popular stocks
    getPopularStocks() {
        const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'SPY', 'QQQ'];
        return this.comprehensiveStocks.filter(stock => popularSymbols.includes(stock.symbol));
    }
}

// Initialize the service
const stockDataService = new StockDataService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StockDataService;
} 