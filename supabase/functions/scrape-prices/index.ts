// ============================================================
//  STOCKS LEAGUE — Stock price scraper (Supabase Edge Function)
//
//  Pulls live quotes from Yahoo Finance's v8 chart endpoint (one
//  request per symbol — the old multi-symbol v7 endpoint now
//  returns 401). No API key needed. Upserts into stock_prices.
//
//  DEPLOY: paste as a function's index.ts, Deploy.
//  RUN:    click "Test"/Invoke, or hit its URL on a schedule.
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SYMBOLS = [
  "AAPL","MSFT","GOOGL","AMZN","TSLA","META","NVDA","NFLX","AMD","INTC",
  "JPM","BAC","V","MA","DIS","KO","PEP","WMT","HD","MCD",
  "JNJ","PFE","UNH","XOM","CVX","BA","NKE","SBUX","PYPL","CRM",
];

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

async function fetchQuote(symbol: string) {
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/" +
    encodeURIComponent(symbol) + "?range=1d&interval=1d";
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" } });
  if (!res.ok) return null;
  const json = await res.json();
  const r = json?.chart?.result?.[0];
  const meta = r?.meta;
  if (!meta || meta.regularMarketPrice == null) return null;
  const price = Number(meta.regularMarketPrice);
  const prev = Number(meta.chartPreviousClose ?? meta.previousClose ?? price);
  const change = price - prev;
  return {
    symbol,
    name: meta.shortName || meta.longName || symbol,
    price,
    change,
    change_pct: prev ? (change / prev) * 100 : 0,
    prev_close: prev,
    updated_at: new Date().toISOString(),
  };
}

Deno.serve(async () => {
  try {
    const rows: any[] = [];
    // Fetch sequentially (gentle on Yahoo). ~30 quick requests.
    for (const sym of SYMBOLS) {
      try {
        const q = await fetchQuote(sym);
        if (q) rows.push(q);
      } catch (_) { /* skip this symbol */ }
    }
    if (rows.length === 0) throw new Error("No quotes fetched");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await supabase.from("stock_prices").upsert(rows);
    if (error) throw error;

    return new Response(
      JSON.stringify({ ok: true, updated: rows.length, at: new Date().toISOString() }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
