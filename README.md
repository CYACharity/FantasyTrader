# FantasyTrader

Fantasy sports, but for the stock market. Draft real stocks with friends in a live
snake draft, allocate your capital, set a weekly lineup, and climb the leaderboard —
scored on real market prices.

**Live site:** _add your Netlify URL here_

## What's inside

| Area | What it does |
|---|---|
| **Trading floor** | Search any US ticker, real Yahoo Finance prices, line/candlestick charts, live analyst ratings, buy & sell |
| **Portfolio** | Real holdings, performance chart from your first trade, sector allocation, weekly report |
| **Leagues** | Create/join with a code, 18-round live snake draft with a 30-second pick clock, capital allocation, weekly lineups, live standings |
| **Learning Hub** | 54 modules across three pathways with quizzes, worked examples, and cited sources |
| **Practice** | Risk-free trading with real market data |

## Tech

- Plain HTML/CSS/JS — no build step, no framework
- [Supabase](https://supabase.com) for auth, Postgres (with row-level security), realtime, and edge functions
- Yahoo Finance data via Supabase edge functions (`market-data`, `quick-responder`, `hyper-worker`)

## Running it yourself

1. Clone the repo.
2. Create a Supabase project.
3. Run the SQL files in the Supabase SQL editor, in order:
   - `supabase-schema.sql`
   - `supabase-schema-update.sql`
   - `supabase-schema-usernames.sql`
   - `supabase-schema-draft.sql`
4. Put your project URL and **publishable (anon)** key in `js/supabase-config.js`.
   These two values are safe in browser code — your data is protected by RLS.
   Never commit the `service_role` key.
5. Deploy the edge functions from `supabase-market-data-UPDATED.ts` (and the price
   scraper / news functions) in the Supabase dashboard.
6. Open `index.html`, or deploy the folder to any static host.

## Deploying

Any static host works. Netlify: drag the folder in, or connect this repo — no build
command, publish directory is the repo root. Afterwards, add your live URL to
Supabase → Authentication → URL Configuration → Site URL.

## League rules

18 stocks drafted per player (11 in play each week), snake draft order, one owner per
stock, host-set starting capital, no shorting and no day trading. Highest portfolio
return at season's end wins.
