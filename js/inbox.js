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

      /* The +50% race lives here as well as on the menu chip: where you
         stand, and how far there is to go. Practice accounts start at
         $10,000; holdings are priced live where there is a quote. */
      try {
        const q0 = syms.length ? await SL.getLiveQuotes(syms) : {};
        let total = Number(pf.cash) || 0;
        syms.forEach((s) => { const pos = pf.stocks[s] || {}, r = q0[s];
          total += (r && r.price != null ? Number(r.price) : Number(pos.avgPrice || 0)) * (Number(pos.shares) || 0); });
        const ret = (total - 10000) / 10000 * 100;
        const sign = (ret >= 0 ? "+" : "\u2212") + Math.abs(ret).toFixed(2) + "%";
        items.push({
          type: "portfolio", key: "race|" + new Date().toDateString(),
          icon: ret >= 0 ? "up" : "down", fa: "fa-flag-checkered",
          title: ret >= 50 ? "You hit +50%. The $25 is yours" : "The +50% race: you're at " + sign,
          desc: ret >= 50 ? "Tell us in Feedback and we'll sort the prize." :
                !syms.length ? "Make your first practice trade to start climbing. First to +50% wins $25." :
                (50 - ret).toFixed(2) + " points to go. First practice account to +50% wins $25.",
          time: "Today", link: "practice.html",
        });
      } catch (e) { /* the race line is optional */ }

      if (syms.length) {
        // No cap on symbols: getLiveQuotes already batches forty at a time,
        // and the rally notice below has to see the whole book or it will
        // name the wrong stock as the day's biggest mover.
        const quotes = await SL.getLiveQuotes(syms);
        const today = new Date().toDateString();

        // Rally observation: the held stock that moved most today, if it
        // moved enough to be worth a line. Built before the per-symbol
        // notices so it leads the list. Only fresh rows qualify: a stale
        // row's change figure belongs to some earlier session.
        try {
          const live = syms.filter((s) => quotes[s] && quotes[s].price != null &&
                                          quotes[s].stale !== true && quotes[s].change_pct != null);
          let top = null;
          for (const s of live) {
            const pct = Number(quotes[s].change_pct);
            if (!isFinite(pct)) continue;
            if (!top || Math.abs(pct) > Math.abs(top.pct)) top = { sym: s, pct };
          }
          if (top && Math.abs(top.pct) >= 2) {
            const up = top.pct >= 0;
            items.push({
              type: "portfolio", key: "rally|move|" + top.sym + "|" + today,
              icon: up ? "up" : "down", rally: true,
              fa: up ? "fa-arrow-trend-up" : "fa-arrow-trend-down",
              title: top.sym + (up ? " is up " : " is down ") + Math.abs(top.pct).toFixed(1) + "% today and you own it",
              desc: "Rally: worth knowing why before you do anything about it.",
              time: "Today", link: "trading.html?symbol=" + top.sym,
            });
          }
        } catch (e) { /* the rally line is optional */ }

        for (const sym of Object.keys(quotes)) {
          const q = quotes[sym], pos = pf.stocks[sym];
          if (!q || q.price == null || !pos) continue;
          // A stale row is priced from some earlier day; nothing about it
          // can honestly be described as "today", so it gets no notice.
          if (q.stale === true) continue;
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

            const nameOf = (uid) => {
              const hit = (standings || []).find((s) => s.user_id === uid);
              return hit && hit.name ? hit.name : "your opponent";
            };
            const today = new Date().toDateString();

            // Daily close against this week's opponent.
            //
            // This used to read a snapshot the league page had written and
            // say nothing when there wasn't one — so the card only ever
            // appeared to someone who had already opened their league that
            // day, which is nobody. The inbox now takes the snapshot itself
            // from the same picks and prices the league page uses, so the
            // card shows up wherever the player checks first.
            if (l.status === "active" && me && global.FTDaily) {
              try {
                const D = global.FTDaily;
                const full = await SL.getLeague(l.id);
                if (full) {
                  const week = D.weekOf(full, []);
                  const oppId = D.opponentOf(full.draft_order || [], week.week, me.id);
                  if (oppId) {
                    // value both lineups at today's quotes and record them
                    const picks = await SL.getPicks(l.id).catch(() => []);
                    const syms = Array.from(new Set((picks || [])
                      .filter((p) => p && (p.user_id === me.id || p.user_id === oppId))
                      .map((p) => p.symbol)));
                    if (syms.length) {
                      const px = await SL.getPrices(syms).catch(() => ({}));
                      const members = await SL.getLeagueMembers(l.id).catch(() => []);
                      const cashOf = (uid) => {
                        const m = (members || []).find((x) => x.user_id === uid);
                        return m ? Number(m.cash || 0) : 0;
                      };
                      const vals = {};
                      [me.id, oppId].forEach((uid) => {
                        const v = D.lineupValue(uid, picks, px, cashOf(uid));
                        if (v != null) vals[uid] = v;
                      });
                      if (Object.keys(vals).length) {
                        D.snapshot(l.id, vals);
                        D.close(l.id);
                      }
                    }
                  }
                  const r = oppId ? D.result(l.id, me.id, oppId) : null;
                  if (r) {
                    const oppName = nameOf(oppId);
                    items.push({
                      type: "league", key: "day|" + l.id + "|" + today,
                      icon: r.won ? "up" : "down", fa: r.won ? "fa-arrow-trend-up" : "fa-arrow-trend-down",
                      title: (r.final ? (r.won ? "You beat " : "You lost to ")
                                      : (r.won ? "You are ahead of " : "You are behind ")) +
                             esc(oppName) + (r.final ? " today" : " today so far"),
                      desc: D.fmt(r.mine) + " to " + D.fmt(r.theirs) + " · “" + esc(l.name) + "”",
                      time: "Today", link: "your-league.html?league=" + l.id,
                    });
                  }
                }
              } catch (e) { /* no daily line for this league */ }
            }

            // Weekly settlements. Rows with debt_status "none" are draws
            // whose winner/loser ids are arbitrary, so they are skipped.
            if (me) {
              try {
                const weeks = await SL.myWeekResults(l.id).catch(() => []);
                for (const w of weeks || []) {
                  if (!w || w.debt_status === "none") continue;
                  const amt = Number(w.transfer_amt || 0).toFixed(0);
                  if (w.loser_id === me.id) {
                    const due = w.due_at ? new Date(w.due_at).toLocaleDateString() : "the deadline";
                    items.push({
                      type: "league", key: "forfeit|" + l.id + "|" + w.week,
                      icon: "down", fa: "fa-hand-holding-dollar",
                      title: "Week " + w.week + ": you lost to " + esc(nameOf(w.winner_id)) + " in “" + esc(l.name) + "”",
                      desc: "$" + amt + (w.debt_status === "pending" ? " owed — settle before " + due : " transferred") +
                            ". You wear the weekly-loser tag until you win one.",
                      time: "Week " + w.week, link: "your-league.html?league=" + l.id,
                    });
                  } else if (w.winner_id === me.id) {
                    items.push({
                      type: "league", key: "forfeit|" + l.id + "|" + w.week,
                      icon: "up", fa: "fa-sack-dollar",
                      title: "Week " + w.week + ": you beat " + esc(nameOf(w.loser_id)) + " in “" + esc(l.name) + "”",
                      desc: "+$" + amt + " collected.",
                      time: "Week " + w.week, link: "your-league.html?league=" + l.id,
                    });
                  }
                }
              } catch (e) { /* no settlement lines for this league */ }
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
