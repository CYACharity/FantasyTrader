// ============================================================
//  market-data (UPDATED) — adds analyst rating DISTRIBUTION
//  Paste this over the existing "market-data" edge function in
//  Supabase → Edge Functions → market-data → index.ts → Deploy.
//  Everything else behaves exactly as before:
//    ?symbol=AAPL&range=1mo&interval=1d   → Yahoo chart JSON
//    ?type=search&q=apple                 → Yahoo search JSON (quotes + news)
//    ?type=rating&symbol=AAPL             → { rating, analysts, target, dist }
//  NEW: "dist" = { strongBuy, buy, hold, sell, strongSell } counts.
// ============================================================

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getCrumb(): Promise<{ cookie: string; crumb: string } | null> {
  try {
    const r1 = await fetch("https://fc.yahoo.com/", { headers: { "User-Agent": UA } });
    const cookie = r1.headers.get("set-cookie")?.split(";")[0] ?? "";
    if (!cookie) return null;
    const r2 = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
      headers: { "User-Agent": UA, Cookie: cookie },
    });
    const crumb = (await r2.text()).trim();
    if (!crumb || crumb.includes("{")) return null;
    return { cookie, crumb };
  } catch (_e) {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "chart";
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  try {
    // ---- search (quotes + news) ----
    if (type === "search") {
      const q = url.searchParams.get("q") ?? "";
      const r = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&newsCount=10&quotesCount=8`,
        { headers: { "User-Agent": UA } },
      );
      return json(await r.json(), r.status);
    }

    // ---- BATCH quotes: ?type=quotes&symbols=AAPL,MSFT,... (up to 100) ----
    if (type === "quotes") {
      const symbols = (url.searchParams.get("symbols") ?? "")
        .split(",").map((s) => s.trim()).filter(Boolean).slice(0, 100);
      if (!symbols.length) return json({}, 200);
      const auth = await getCrumb();
      if (!auth) return json({ error: "crumb unavailable" }, 502);
      const r = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols.join(","))}&crumb=${encodeURIComponent(auth.crumb)}`,
        { headers: { "User-Agent": UA, Cookie: auth.cookie } },
      );
      const data = await r.json();
      const out: Record<string, unknown> = {};
      for (const q of data?.quoteResponse?.result ?? []) {
        out[q.symbol] = {
          price: q.regularMarketPrice ?? null,
          change_pct: q.regularMarketChangePercent ?? null,
        };
      }
      return json(out);
    }

    // ---- analyst rating + target + DISTRIBUTION ----
    if (type === "rating") {
      const symbol = url.searchParams.get("symbol") ?? "";
      const auth = await getCrumb();
      if (!auth) return json({ error: "crumb unavailable" }, 502);
      const r = await fetch(
        `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}` +
          `?modules=financialData,recommendationTrend&crumb=${encodeURIComponent(auth.crumb)}`,
        { headers: { "User-Agent": UA, Cookie: auth.cookie } },
      );
      const data = await r.json();
      const res = data?.quoteSummary?.result?.[0];
      const fin = res?.financialData;
      const trend = res?.recommendationTrend?.trend?.find((t: { period: string }) => t.period === "0m") ??
        res?.recommendationTrend?.trend?.[0];
      return json({
        rating: fin?.recommendationKey ?? null,
        analysts: fin?.numberOfAnalystOpinions?.raw ?? null,
        target: fin?.targetMeanPrice?.raw ?? null,
        dist: trend
          ? {
            strongBuy: trend.strongBuy ?? 0,
            buy: trend.buy ?? 0,
            hold: trend.hold ?? 0,
            sell: trend.sell ?? 0,
            strongSell: trend.strongSell ?? 0,
          }
          : null,
      });
    }

    // ---- default: chart proxy ----
    const symbol = url.searchParams.get("symbol") ?? "AAPL";
    const range = url.searchParams.get("range") ?? "1mo";
    const interval = url.searchParams.get("interval") ?? "1d";
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`,
      { headers: { "User-Agent": UA } },
    );
    return json(await r.json(), r.status);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
