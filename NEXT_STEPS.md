# Stocks League — Next Steps

You've got a working backend. This adds live stock prices, the snake-draft
leagues, and then puts the whole thing online so anyone can play.

Do these in order.

---

## Step 1 — Run the new database update (2 min)

I added tables/functions for the snake draft and a watchlist improvement.

1. Supabase → **SQL Editor → New query**.
2. Open **`supabase-schema-update.sql`**, copy all of it, paste, **Run**.
   (You'll get the same "destructive operations" warning as before — it's the
   `drop ... if exists` safety lines. Click **Run query**.)

This adds the `league_picks` table, draft state, the race-safe `make_pick` /
`start_draft` functions, and turns on realtime so drafts update live.

---

## Step 2 — Turn on live stock prices (the scraper)

Right now prices are simulated. This makes them real, pulled from Yahoo Finance
by a small function that runs on Supabase (no command line, no API key).

### 2a. Create the function
1. Supabase → **Edge Functions** (left sidebar) → **Deploy a new function** →
   **Via Editor** (or "Create a new function").
2. Name it exactly **`scrape-prices`**.
3. Delete the sample code and paste in the contents of
   **`supabase/functions/scrape-prices/index.ts`** from your folder.
4. Click **Deploy**.

### 2b. Run it once to fill the price table
- On the function's page click **"Invoke"/"Send request"** (a plain GET is fine), **or**
- open this URL in your browser (replace nothing — it's your project):
  `https://qhzplhbtspwjajluuulp.functions.supabase.co/scrape-prices`

Then check **Table Editor → stock_prices** — you should see ~30 stocks with
real prices. Trading and the draft now show live numbers.

### 2b-2. Deploy the news function (for stock research)
Same steps as the price scraper, one more function:
1. Supabase → **Edge Functions → Deploy a new function → Via Editor**.
2. Name it exactly **`stock-news`**.
3. Paste the contents of `supabase/functions/stock-news/index.ts`, click **Deploy**.

Now when you search a stock on the trading page, the Research panel fills with
that stock's latest headlines. (Until it's deployed, the panel shows a link to
Yahoo Finance instead.)

### 2c. Keep prices fresh automatically
In **SQL Editor**, run this once:

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'refresh-prices',
  '*/5 * * * *',
  $$ select net.http_get(
       url := 'https://qhzplhbtspwjajluuulp.functions.supabase.co/scrape-prices'
     ); $$
);
```

That refreshes prices every 5 minutes.

---

## Step 3 — Test everything

**Trading & watchlist (1 account):**
1. Open `trading.html`, search a stock, buy a few shares.
2. Open `portfolio.html` — the position shows with a live value.
3. Open `watchlist.html` → **Add Stock** → type a ticker (e.g. `MSFT`). It saves;
   reload the page and it's still there.

**Snake draft (needs 2 players — use two browsers or a normal + incognito window,
each signed into a different account):**
1. Account A: `create-league.html` → fill it in → **Create League**. You land in
   the draft room (a **lobby** with a join code).
2. Account B: `league.html` → **Join League → Enter Code** → paste the code. B
   appears in A's lobby instantly.
3. Account A (host): **Start Draft**. Players take turns (snake order:
   1-2-2-1…). It's enforced server-side, so no one can pick out of turn or grab
   the same stock twice.
4. When every roster is full it flips to **Standings**, which update live with
   the market.

If anything errors, tell me the exact message and I'll fix it.

---

## Step 4 — Put it online so people can play on the web

Your site is plain files + Supabase, so hosting is free and takes minutes.
Easiest option is **Netlify Drop**:

1. Go to **app.netlify.com/drop**.
2. Drag your **`Stocks League HTMLs copy 3`** folder onto the page.
3. It uploads and gives you a live URL like `random-name.netlify.app`. Done —
   that link works for anyone, and Supabase keeps working because your keys are
   in the files.
   - Set `index.html` as the entry (Netlify does this automatically).

(Vercel and Cloudflare Pages work the same way and are also free. If you want
auto-updates when you change files, we can connect a GitHub repo later.)

### Buy a domain and connect it (~$10–12/year)
1. Buy a domain at **Cloudflare** (cheapest, at-cost) or **Namecheap** —
   e.g. `stocksleague.com`.
2. In Netlify: **Site settings → Domain management → Add a custom domain** →
   type your domain.
3. Netlify shows you DNS records (or nameservers). Add them at your registrar.
   It goes live (with free HTTPS) usually within an hour.

I can walk you through this step-by-step on screen whenever you're ready.

---

## Quick security note
Before you share the site publicly, in Supabase go to **Authentication →
Providers → Email** and turn **Confirm email back ON** so people verify their
address. Your data is safe either way (the security rules lock each player to
their own rows), but confirmation stops fake signups.
