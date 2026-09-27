// Rally's brain: a Supabase Edge Function that lets the mascot answer
// anything in his own voice, using the player's live numbers.
//
// Deploy:   supabase functions deploy rally-chat
// Secret:   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// Optional: supabase secrets set RALLY_MODEL=claude-sonnet-5   (default: claude-haiku-4-5-20251001)
//
// The browser sends { question, history, context }. Only signed-in players
// can call it (Supabase checks the session token before this code runs).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const SYSTEM = `You are Rally, the mint-green bull mascot of Fantasy Trader: a game where friends draft real stocks,
trade with pretend money at real prices, and learn investing through short courses.

How you talk: warm, quick, a little playful, like a friend who works on a trading desk. Plain words.
Short answers: 2 to 4 sentences, under 90 words, no headings, no bullet lists unless asked.

Rules you never break:
- Never tell the player to buy, sell or hold a specific stock, and never predict prices. Explain how to think
  about it instead, and say you don't pick stocks.
- This is a game with pretend money. If someone asks for real financial advice, say you're a game mascot,
  not a financial adviser, and point them to learning the concept.
- Use the numbers in CONTEXT when they're relevant (their account, today's moves, the stock on screen).
  Never invent numbers that aren't there.
- If you don't know, say so in one line.
- App help: Practice is a $10,000 practice account (first to +50% wins $25). Play is leagues: snake draft,
  weekly head-to-head matchups, best return wins, the loser pays a % of capital. Learn has courses and the
  Academy (XP, hearts, streaks, boss lessons). Portfolio shows your rank from Bronze to Legend (+50%).`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "Rally's brain isn't configured (ANTHROPIC_API_KEY missing)." }, 503);

  let body: { question?: string; history?: { w: string; t: string }[]; context?: unknown };
  try { body = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  const question = String(body.question || "").trim().slice(0, 800);
  if (!question) return json({ error: "Empty question" }, 400);

  // last few turns, merged so roles alternate and the list ends on the player
  const turns: { role: "user" | "assistant"; content: string }[] = [];
  for (const m of (body.history || []).slice(-10)) {
    const role = m && m.w === "me" ? "user" : "assistant";
    const content = String((m && m.t) || "").slice(0, 800);
    if (!content) continue;
    if (turns.length && turns[turns.length - 1].role === role) turns[turns.length - 1].content += "\n" + content;
    else turns.push({ role, content });
  }
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (turns.length && turns[turns.length - 1].role === "user") turns.pop();
  turns.push({ role: "user", content: question });

  const context = JSON.stringify(body.context ?? {}).slice(0, 2500);
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("RALLY_MODEL") || "claude-haiku-4-5-20251001",
      max_tokens: 320,
      system: SYSTEM + "\n\nCONTEXT (live, from the page the player is on):\n" + context,
      messages: turns,
    }),
  });
  if (!r.ok) return json({ error: "Rally couldn't think right now (" + r.status + ")." }, 502);
  const data = await r.json();
  const reply = (data.content || []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("\n").trim();
  return json({ reply });
});
