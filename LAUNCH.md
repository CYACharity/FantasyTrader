# Fantasy Trader — Launch Guide

Everything needed to take this folder live at a public URL with a working backend.
Run the Terminal commands from inside this folder.

---

## Part 1 — Put the code on GitHub (once, ~5 min)

### 1a. Create the repo
Go to <https://github.com/new>
- **Repository name:** `fantasytrader`
- **Public**
- Do **not** tick "Add a README" (the repo must start empty)
- Click **Create repository**

### 1b. Push the site

Open Terminal and paste this block, replacing `YOURNAME` with your GitHub username:

```bash
cd ~/Desktop/"Stocks League HTMLs copy 3"

# clear a stale lock left by an interrupted commit (harmless if it doesn't exist)
rm -f .git/index.lock

git checkout main
git add -A
git commit -m "Fantasy Trader — launch"
git remote add origin https://github.com/YOURNAME/fantasytrader.git
git push -u origin main
```

A browser window may open asking you to sign in to GitHub. Approve it.

**If `git checkout main` complains about unsaved changes**, run:
```bash
git stash && git checkout main && git stash pop
```

**If `git remote add` says "remote origin already exists"**, run this instead:
```bash
git remote set-url origin https://github.com/YOURNAME/fantasytrader.git
git push -u origin main
```

---

## Part 2 — Turn on GitHub Pages (~2 min)

1. On your repo page: **Settings** → **Pages** (left sidebar)
2. Under *Build and deployment* → *Source*: choose **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)** → **Save**
4. Wait ~60 seconds, refresh. A green banner shows your live URL:
   `https://YOURNAME.github.io/fantasytrader/`

Open it. The landing page should load with the demo button working.

---

## Part 3 — Point your domain at it (~10 min + DNS wait)

### 3a. Tell GitHub the domain
Repo → **Settings** → **Pages** → **Custom domain** → type `yourdomain.com` → **Save**.
(This auto-creates a `CNAME` file in your repo — leave it alone.)

### 3b. Set DNS at your registrar (Wix, Namecheap, Cloudflare…)
Find **Manage DNS records** for the domain, then:

**Delete** any existing A records for `@` that the registrar pre-filled (they point at their own servers).

**Add four A records** — host `@`, pointing to:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Add one CNAME record** — host `www`, value `YOURNAME.github.io`

> Decline every offer to "connect this domain to a website builder" or buy hosting.
> You own the name; the site lives free on GitHub.

### 3c. Lock it down
DNS takes 15 min – a few hours. When GitHub Pages shows a green check next to your
domain, tick **Enforce HTTPS**. Done — your site is public and encrypted.

---

## Part 4 — Make the backend work on the live URL (IMPORTANT)

The database and market-data function are already deployed and working. But Supabase
needs to know your new address, or **signup emails will point to the wrong place**.

### 4a. Set the site URL
<https://supabase.com/dashboard> → your project → **Authentication** → **URL Configuration**

**Site URL** (no trailing slash, no leading spaces):

```
https://fantasytrader.co
```

**Redirect URLs** — one per line. The `/**` wildcards are required so any page
in the app is a valid landing spot after login. Paste with NO leading spaces:

```
https://fantasytrader.co/**
https://www.fantasytrader.co/**
https://cyacharity.github.io/FantasyTrader/**
```

Then **Save**.

### 4b. Choose how signup works
**Authentication** → **Sign In / Providers** → **Email**

- *Confirm email* **ON** = users must click a link in their inbox before playing.
  Safer, but adds friction and needs the Site URL above to be correct.
- *Confirm email* **OFF** = instant signup, best for testing with friends.

Pick one and stick with it. If friends report "I never got the email," check spam —
Supabase's built-in mailer is rate-limited (a few per hour) and is meant for testing.
For real volume you'd connect a proper email service later (Resend, SendGrid).

### 4c. Confirm the database is ready
**SQL Editor** → paste the entire contents of `supabase-schema-manager.sql` from this
folder → **Run**. It's safe to run repeatedly — it only adds what's missing.

You should see "Success. No rows returned."

### 4d. Keep prices fresh
The `market-data` edge function is deployed and live (verified working). If you also
run the price-cache scraper, make sure its schedule is enabled under
**Database** → **Cron jobs** (or whatever schedule you set up). The app falls back to
live per-symbol fetches if the cache is cold, so prices work either way.

---

## Part 5 — The launch checklist

Open your live URL and confirm, in order:

- [ ] Landing page loads, demo lightbox plays
- [ ] **Sign up** with a real email → lands on the survey → then the dashboard
- [ ] Dashboard shows your username and live ticker prices
- [ ] **Create a league** → you get a 6-character join code
- [ ] Open the join code in a private window with a second account → it joins
- [ ] **Start the draft** → prices appear on the board → picks register for both players
- [ ] After the draft: Your Team → sliders → **Deploy Capital** → Team Manager appears
- [ ] Overview shows **$100,000** total capital and a ticking prep clock
- [ ] Trades tab → propose a trade → the other account can Accept

If any step fails, the browser console (⌥⌘I → Console) shows the reason — send me
the red text and I'll fix it.

---

## Part 6 — Updating the site forever after

Every time you want changes to go live:

```bash
cd ~/Desktop/"Stocks League HTMLs copy 3"
git add -A
git commit -m "what changed"
git push
```

Visitors see the new version about a minute later. That's the whole workflow —
edit here, push, live.

---

## Safety notes

- The Supabase key in `js/supabase-config.js` is the **publishable** key. It is
  designed to be public and is safe in the repo. Row-Level Security is what protects
  your data.
- **Never** put the `service_role` key in any file in this folder. It bypasses all
  security. (Verified: it is not in here.)
- The repo is public — anyone can read the code. That's normal and fine.
