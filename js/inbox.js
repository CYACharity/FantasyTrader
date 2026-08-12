/* ============================================================
   FANTASYTRADER — one source of truth for the inbox
;
   The dashboard badge used to read a number that mail.html had
   written to localStorage the last time you happened to open it.
   Never opened the inbox, or opened it a week ago, and the badge
   showed a figure with nothing behind it.

   Both pages now build the same list from the same rules here, so
   the count on the dashboard is always what you'd actually find
   inside.
   ============================================================ */
(function (global) {
  const DISMISS_KEY = "mailDismissed";

  // Key on something that does NOT move with the market. Prices used to be
  // part of this, so a cleared message reappeared on the next quote tick.
  const keyOf = (i) => (i.key || i.type + "|" + i.title).slice(0, 140);

  function dismissed() {
    try {
      return new Set(JSON.parse(localStorage.getItem(DISMISS_KEY) || "[]"));
    } catch (e) {
      return new Set();
    }
  }
  function saveDismissed(set) {
    try {
      localStorage.setItem(DISMISS_KEY, JSON.stringify([...set].slice(-400)));
    } catch (e) {}
  }

  const DAILY_FACTS = [
    ["The S&P 500 has returned about 10% a year since 1957", "That average hides a lot: single years have swung from −37% to +38%. The average only shows up if you stay in."],
    ["Warren Buffett earned most of his fortune after turning 50", "Not because he got better at picking stocks. Because compounding needs decades to do its heavy lifting."],
    ["The rule of 72", "Divide 72 by your annual return to get the years it takes to double. At 8%, that is nine years."],
    ["Missing the ten best days costs you half your return", "And the best days cluster right next to the worst ones, which is why selling in a panic hurts twice."],
    ["Diversification is the only free lunch in investing", "Harry Markowitz’s line. Spreading across uncorrelated assets lowers risk without lowering expected return."],
    ["The average investor trails the funds they own", "Because they buy after a run and sell after a drop. The fund returns 9%, the investor gets 6%."],
    ["Fees compound too", "A 1% annual fee eats roughly a quarter of your ending balance over 30 years."],
    ["Half of all stocks lose money over their lifetime", "Index returns come from a small handful of enormous winners. That is the case for owning the whole haystack."],
    ["Bear markets are shorter than bull markets", "The average bear runs under a year and a half. The average bull runs several years."],
    ["Dollar-cost averaging removes the timing question", "Buy on a schedule and you accept the average price instead of betting on the bottom."],
    ["Cash is a position", "Sitting out is a bet that prices fall. Inflation charges you rent for holding that bet."],
    ["Volatility is not the same as risk", "A price that swings is uncomfortable. Permanent loss of capital is the thing that actually hurts."],
    ["Earnings drive prices over the long run", "Over a decade, returns track profit growth. Over a week, they track mood."],
    ["Rebalancing forces you to sell high and buy low", "Trimming what ran and topping up what lagged does mechanically what discipline struggles to do."],
  ];

  function dailyFact() {
    const day = Math.floor(Date.now() / 86400000);
    const f = DAILY_FACTS[day % DAILY_FACTS.length];
    return {
      type: "news", key: "fact|" + day, icon: "brand", fa: "fa-lightbulb",
      brand: true,                       // wears the FantasyTrader mark
      title: "Daily fact",               // the subject is the subject
      desc: f[0] + " — " + f[1],
      time: "Today", link: "learn.html",
    };
  }

  const esc = (s) => String(s || "").replace(/</g, "&lt;");

  /* Build every message the player should currently see. Nothing invented:
     each item comes from a real position, a real headline or a real league. */
  async function build(SL, opts) {
    const o = opts || {};
    const items = [dailyFact()];
    if (!SL || !SL.configured) return items;

    try {
      const pf = await SL.loadPortfolio();
      const syms = Object.keys(pf.stocks || {});
      if (syms.length) {
        const quotes = await SL.getLiveQuotes(syms.slice(0, 8));
        const today = new Date().toDateString();
        for (const sym of Object.keys(quotes)) {
          const q = quotes[sym], pos = pf.stocks[sym];
          if (!q || q.price == null || !pos) continue;
          const pct = Number(q.change_pct) || 0;
          const pl = (q.price - (pos.avgPrice || q.price)) * pos.shares;
          if (Math.abs(pct) >= 1) {
            items.push({
              type: "portfolio", key: "move|" + sym + "|" + today,
              icon: pct >= 0 ? "up" : "down",
              fa: pct >= 0 ? "fa-arrow-trend-up" : "fa-arrow-trend-down",
              title: sym + " " + (pct >= 0 ? "jumped" : "fell") + " " + Math.abs(pct).toFixed(1) + "% today",
              desc: "Now $" + q.price.toFixed(2) + " · your " + pos.shares + " share" +
                    (pos.shares === 1 ? "" : "s") + " are " +
                    (pl >= 0 ? "up $" + pl.toFixed(2) : "down $" + Math.abs(pl).toFixed(2)) + " overall.",
              time: "Today", link: "trading.html?symbol=" + sym,
            });
          }
          items.push({
            type: "portfolio", key: "pos|" + sym + "|" + today,
            icon: pl >= 0 ? "up" : "down", fa: "fa-briefcase",
            title: "Position update: " + sym,
            desc: pos.shares + " shares · avg cost $" + (pos.avgPrice || 0).toFixed(2) +
                  " · last $" + q.price.toFixed(2) + " (" +
                  (pl >= 0 ? "+" : "−") + "$" + Math.abs(pl).toFixed(2) + ")",
            time: "Today", link: "portfolio.html",
          });
        }

        if (o.withNews !== false) {
          for (const sym of syms.slice(0, 3)) {
            try {
              const news = await SL.getStockNews(sym);
              (news || []).slice(0, 2).forEach((n) =>
                items.push({
                  type: "news", key: "news|" + (n.link || n.title),
                  icon: "news", fa: "fa-newspaper",
                  title: esc(n.title), desc: sym + " · " + (n.source || "Yahoo Finance"),
                  time: n.pubDate ? new Date(n.pubDate).toLocaleDateString() : "Recent",
                  link: n.link,
                }));
            } catch (e) { /* skip this symbol */ }
          }
        }
      }

      const leagues = await SL.myLeagues();
      const me = await SL.currentUser();
      for (const row of leagues || []) {
        const l = row.leagues;
        if (!l) continue;
        if (l.status === "lobby") {
          items.push({
            type: "league", key: "lobby|" + l.id, icon: "lg", fa: "fa-users",
            title: "“" + esc(l.name) + "” is waiting to draft",
            desc: "Share code " + l.join_code + " with friends — the draft starts when the host begins.",
            time: "League", link: "your-league.html?league=" + l.id,
          });
        } else if (l.status === "drafting") {
          items.push({
            type: "league", key: "drafting|" + l.id, icon: "lg", fa: "fa-bolt",
            title: "Draft in progress in “" + esc(l.name) + "”",
            desc: "Get in there — picks are happening right now.",
            time: "League", link: "your-league.html?league=" + l.id,
          });
        } else {
          try {
            const standings = await SL.leagueStandings(l.id);
            const idx = standings.findIndex((s) => s.user_id === (me && me.id));
            if (idx >= 0) {
              const s = standings[idx];
              items.push({
                type: "league", key: "rank|" + l.id + "|" + new Date().toDateString(),
                icon: idx === 0 ? "up" : "lg", fa: idx === 0 ? "fa-trophy" : "fa-ranking-star",
                title: (idx === 0 ? "You lead “" : "You are #" + (idx + 1) + " in “") + esc(l.name) + "”",
                desc: "Roster value $" + s.value.toFixed(2) + " · return " +
                      (s.returnPct >= 0 ? "+" : "") + s.returnPct.toFixed(2) + "%",
                time: "League", link: "your-league.html?league=" + l.id,
              });
            }
          } catch (e) { /* skip this league */ }
        }
      }
    } catch (e) { /* return whatever we managed to gather */ }

    return items;
  }

  /* What the badge should say: messages you can still see, right now. */
  async function unread(SL) {
    const gone = dismissed();
    // Skip the news fetch — it's slow and doesn't change the count materially.
    const items = await build(SL, { withNews: false });
    return items.filter((i) => !gone.has(keyOf(i))).length;
  }

  global.FTInbox = { build, unread, keyOf, dismissed, saveDismissed, dailyFact, DAILY_FACTS };
})(window);
