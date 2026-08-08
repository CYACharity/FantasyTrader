# Stocks League — Backend Setup Walkthrough

This turns your placeholder game into a real app with accounts, saved
portfolios, working trades, quizzes, and leagues — all powered by Supabase.
No separate server to run: the site talks to Supabase directly from the browser,
and a scraper keeps live stock prices flowing.

Follow the steps in order. It takes about 15 minutes.

---

## What I've already built for you

| File | What it does |
|------|--------------|
| `supabase-schema.sql` | Every database table + security rules. You run this once. |
| `js/supabase-config.js` | Where you paste your 2 public keys. |
| `js/sl.js` | The shared "brain" — login, portfolio, trades, quizzes, leagues, prices. |
| `supabase/functions/scrape-prices/index.ts` | The stock-price scraper (runs on Supabase). |
| `signup.html` | Now does **real** login & signup. |

You only touch Steps 1–4 below. The rest is me wiring your pages to `js/sl.js`.

---

## Step 1 — Create your Supabase project (if you haven't)

1. Go to **supabase.com** → sign in → **New project**.
2. Give it a name, pick a strong database password, choose a region near you.
3. Wait ~2 minutes for it to finish provisioning.

## Step 2 — Create the database

1. In your project, open **SQL Editor** (left sidebar) → **New query**.
2. Open `supabase-schema.sql` from this folder, copy **all** of it, paste it in.
3. Click **Run**. You should see "Success. No rows returned."

That created every table (profiles, portfolios, trades, watchlist,
lesson_progress, quiz_results, leagues, league_members, stock_prices) plus the
security rules that keep each player's data private, and an automatic trigger
that gives every new signup a profile and a starting **$10,000**.

## Step 3 — Get your 2 public keys and paste them in

1. Go to **Project Settings → API**.
2. Copy these two values:
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **anon / public** key (a long string)
3. Open `js/supabase-config.js` and paste them in:

```js
window.SUPABASE_URL      = "https://abcd1234.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOi...your-anon-key...";
```

> ⚠️ **Never** paste the `service_role` key into any file in this folder. It's a
> secret. The anon key is meant to live in browser code — your data is protected
> by the security rules from Step 2, not by hiding the key.

## Step 4 — Turn signups on

By default Supabase requires email confirmation. For testing, you can turn it off
so accounts work instantly:

- **Authentication → Providers → Email** → turn **Confirm email** off (optional,
  for testing). Turn it back on before you go live.

**Test it:** open `signup.html`, create an account, and you should land on the
onboarding flow. In Supabase, **Table Editor → portfolios** should show a new row
with `cash = 10000`. 🎉 That's your backend working.

---

## Step 5 — The stock price scraper

Live prices come from a small scraper that runs **on Supabase's servers** (so no
CORS errors, no API key). It pulls quotes from Yahoo Finance and stores them in
the `stock_prices` table; your pages read from there.

**Deploy it once:**

```bash
npm i -g supabase                 # install the Supabase CLI
supabase login                    # opens your browser to authorize
supabase link --project-ref <your-ref>   # <your-ref> is in your project URL
supabase functions deploy scrape-prices --no-verify-jwt
```

**Run it once to fill the table:**

```bash
curl https://<your-ref>.functions.supabase.co/scrape-prices
```

Check **Table Editor → stock_prices** — you should see ~30 stocks with prices.

**Keep it fresh automatically** (runs every 5 minutes during-ish market hours).
In the SQL Editor, run this once (replace the ref and anon key):

```sql
-- enable the scheduler + http extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'refresh-prices',
  '*/5 * * * *',
  $$ select net.http_get(
       url := 'https://<your-ref>.functions.supabase.co/scrape-prices'
     ); $$
);
```

> Don't want to use the CLI? You can also paste the function's code into
> **Edge Functions → Deploy a new function** in the Supabase dashboard.

---

## Step 6 — The rest of the pages (my job)

With Steps 1–5 done, I wire your existing pages to `js/sl.js`. Each keeps its
current look; I only swap the placeholder logic for real calls:

- **Trading** (`trading.html`) — real buy/sell that spends real cash and saves
  positions + a trade log.
- **Portfolio** (`portfolio.html`) — shows your actual holdings and live value.
- **Quizzes / lessons** (`beginner-module-*.html`, etc.) — save scores and mark
  modules complete per user.
- **Leagues** (`create-league.html`, `league.html`, `your-league.html`) — create
  a league, share a join code, and see live standings.

Everything falls back to local storage until your keys are in, so nothing ever
looks broken while you set up.
