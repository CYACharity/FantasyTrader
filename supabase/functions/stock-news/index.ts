// ============================================================
//  STOCKS LEAGUE — Stock news (Supabase Edge Function)
//
//  Runs on Supabase's servers, so no CORS problems and no API
//  key. It pulls the latest headlines for a symbol from Yahoo
//  Finance's public RSS feed and returns them as JSON.
//
//  DEPLOY (dashboard, no CLI needed):
//    Supabase -> Edge Functions -> Deploy a new function -> Via Editor
//    Name it exactly:  stock-news
//    Paste this file, Deploy.
//
//  The trading page calls it automatically when you search a stock.
// ============================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function decode(s: string): string {
  return (s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .trim();
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp("<" + name + ">([\\s\\S]*?)<\\/" + name + ">", "i"));
  return m ? decode(m[1]) : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    let symbol = "";
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      symbol = (body.symbol || "").toString();
    } else {
      symbol = new URL(req.url).searchParams.get("symbol") || "";
    }
    symbol = symbol.trim().toUpperCase().replace(/[^A-Z0-9.\-]/g, "");
    if (!symbol) throw new Error("Missing symbol");

    const url = "https://feeds.finance.yahoo.com/rss/2.0/headline?s=" +
      encodeURIComponent(symbol) + "&region=US&lang=en-US";
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (StocksLeague)" } });
    if (!res.ok) throw new Error("Feed responded " + res.status);
    const xml = await res.text();

    const items = (xml.match(/<item>[\s\S]*?<\/item>/gi) || []).slice(0, 12).map((block) => ({
      title: tag(block, "title"),
      link: tag(block, "link"),
      pubDate: tag(block, "pubDate"),
      source: "Yahoo Finance",
    })).filter((i) => i.title && i.link);

    return new Response(JSON.stringify({ symbol, items }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ items: [], error: String(e) }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
