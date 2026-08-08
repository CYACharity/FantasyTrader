# Stocks League — Production Readiness Checklist

Everything below is either **already done** ✅ or a **short step you do** ▶ before
putting the site on the web. Follow the ▶ steps in order and it won't bug out.

---

## What's already wired ✅

- **Every app page is connected to Supabase.** All 43 app pages load the shared
  client (`js/sl.js`); the 3 non-app pages (landing, schema helper, raw data
  demo) intentionally don't.
- **Auth guard on 40 gated pages** (`js/guard.js`). If someone isn't logged in,
  they're sent to the login page automatically — no more fake demo data leaking
  into a real account. Public pages (landing, signup, onboarding) stay open.
- **Login remembers where you were headed** — get bounced to login, and after
  signing in you land back on the page you wanted.
- **One shared session** across the whole site (Supabase stores it), so logging
  in once works everywhere.
- **Real data flow:** trades save cash + positions to your account; the
  portfolio and trading pages read the same source; leagues update in real time;
  quiz scores save per user.

---

## Do these before you deploy ▶

### 1. Database (once)
- Run `supabase-schema.sql` and `supabase-schema-update.sql` in the SQL Editor
  if you haven't. (You've already done these.) ✅

### 2. Turn on email confirmation
- Supabase → **Authentication → Providers → Email** → turn **Confirm email ON**.
  (You can keep it off only while testing.)

### 3. Deploy the two data functions (for reliable live data)
The app currently pulls live prices/news in-browser through public proxies —
fine for testing, but proxies can rate-limit. For production, deploy these so the
data comes from your own server:
- `supabase/functions/scrape-prices` → deploy as **scrape-prices**
- `supabase/functions/stock-news` → deploy as **stock-news**
(Dashboard → Edge Functions → Deploy a new function → Via Editor → paste → Deploy.
Full steps in `NEXT_STEPS.md`.)

### 4. Put the folder online (free)
- **app.netlify.com/drop** → drag your `Stocks League HTMLs copy 3` folder on.
  You get a live `something.netlify.app` URL. (Vercel / Cloudflare Pages work too.)

### 5. ⚠️ Point Supabase at your live URL (the #1 thing people forget)
Once you have your web address (netlify URL or your custom domain):
- Supabase → **Authentication → URL Configuration**:
  - Set **Site URL** to your live address (e.g. `https://stocksleague.com`).
  - Add it under **Redirect URLs** too.
- Without this, confirmation and password-reset **emails point to the wrong place**
  and login breaks in production. This is the most common deploy bug.

### 6. Buy a domain (optional, ~$10–12/yr)
- Cloudflare or Namecheap → add it as a custom domain in Netlify → done (free HTTPS).
- Then redo step 5 with the custom domain.

---

## Good to know

- **Your keys are safe to ship.** The `sb_publishable_` key in
  `js/supabase-config.js` is meant to live in browser code; your data is
  protected by the Row Level Security rules, not by hiding the key. Never put the
  `service_role`/secret key in these files.
- **A few things stay on the device on purpose** (tutorial-seen flag, small UI
  preferences). Those aren't account data and won't cause problems.
- **If you ever see "Connect Supabase…"** on a page, it means the keys in
  `js/supabase-config.js` got cleared — just paste them back.
