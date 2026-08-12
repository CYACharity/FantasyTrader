/* ============================================================
 *  STOCKS LEAGUE — shared client (auth + data)
 *  One global object:  window.SL
 *
 *  Load order on any page that needs data:
 *    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *    <script src="js/supabase-config.js"></script>
 *    <script src="js/sl.js"></script>
 *
 *  DESIGN: every data call works even when Supabase is not yet
 *  configured or the user is signed out — it transparently falls
 *  back to localStorage. So the site never breaks; once keys are
 *  added and a user logs in, the SAME calls persist to the cloud.
 * ============================================================ */
(function () {
  const cfg = {
    url: window.SUPABASE_URL,
    key: window.SUPABASE_ANON_KEY,
  };

  const configured =
    cfg.url && cfg.key &&
    !cfg.url.includes("YOUR_PROJECT_URL") &&
    !cfg.key.includes("YOUR_ANON_PUBLIC_KEY") &&
    typeof window.supabase !== "undefined";

  const client = configured
    ? window.supabase.createClient(cfg.url, cfg.key)
    : null;

  // ---- local fallback helpers -------------------------------
  const ls = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  const SL = {
    configured,
    client,
    _user: null,

    /* -------------------- AUTH -------------------- */
    async currentUser() {
      if (!configured) return null;
      // Prefer the locally stored session (fast, works offline)…
      try {
        const { data } = await client.auth.getSession();
        if (data && data.session && data.session.user) {
          this._user = data.session.user;
          return this._user;
        }
      } catch (e) { /* fall through */ }
      // …fall back to a network check.
      try {
        const { data } = await client.auth.getUser();
        this._user = (data && data.user) || null;
      } catch (e) { this._user = null; }
      return this._user;
    },

    async signUp(email, password, fullName) {
      return this.signUpFull(email, password, fullName, null);
    },

    async signUpFull(email, password, fullName, username) {
      if (!configured) throw new Error("Supabase not configured yet.");
      const { data, error } = await client.auth.signUp({
        email, password,
        options: { data: { full_name: fullName || "", username: username || "" } },
      });
      if (error) throw error;
      return data;
    },

    async signIn(email, password) {
      if (!configured) throw new Error("Supabase not configured yet.");
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this._user = data.user;
      return data;
    },

    async signOut() {
      if (configured) await client.auth.signOut();
      this._user = null;
    },

    /* Redirect to signup if not authenticated (call on gated pages). */
    async requireAuth(redirect = "signup.html") {
      if (!configured) return null;            // demo mode: allow through
      const user = await this.currentUser();
      if (!user) { window.location.href = redirect; return null; }
      return user;
    },

    /* -------------------- PORTFOLIO -------------------- */
    // Portfolio shape used across the app:
    //   { cash: number, stocks: { SYM: {symbol,shares,avgPrice,totalCost} } }
    async loadPortfolio() {
      const fallback = ls.get("portfolio", { cash: 10000, stocks: {} });
      if (!configured) return fallback;
      const user = await this.currentUser();
      if (!user) return fallback;

      const { data, error } = await client
        .from("portfolios")
        .select("cash, positions")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error || !data) return fallback;
      return { cash: Number(data.cash), stocks: data.positions || {} };
    },

    async savePortfolio(portfolio) {
      ls.set("portfolio", portfolio);          // always keep a local mirror
      if (!configured) return;
      const user = await this.currentUser();
      if (!user) return;
      await client.from("portfolios").upsert({
        user_id: user.id,
        cash: portfolio.cash,
        positions: portfolio.stocks,
        updated_at: new Date().toISOString(),
      });
    },

    async logTrade(symbol, side, shares, price, leagueId = null) {
      /* Mirror locally FIRST, always. This used to return early whenever there
         was no signed-in user, so a logged-out player's trades were recorded
         nowhere at all — the portfolio page then read an empty history and
         concluded they had never traded, hiding real holdings. */
      const row = { symbol, side, shares, price, league_id: leagueId,
                    created_at: new Date().toISOString() };
      try { ls.set("trades", [row, ...ls.get("trades", [])].slice(0, 200)); } catch {}
      if (!configured) return;
      const user = await this.currentUser();
      if (!user) return;
      await client.from("trades").insert({
        user_id: user.id, symbol, side, shares, price, league_id: leagueId,
      });
    },

    async recentTrades(limit = 25) {
      if (!configured) return ls.get("trades", []).slice(0, limit);
      const user = await this.currentUser();
      // Signed out is not the same as "no trades" — fall back to the local log.
      if (!user) return ls.get("trades", []).slice(0, limit);
      const { data } = await client
        .from("trades").select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);
      return data || [];
    },

    /* -------------------- WATCHLIST -------------------- */
    async getWatchlist() {
      if (!configured) return ls.get("watchlist", []);
      const user = await this.currentUser();
      if (!user) return [];
      const { data } = await client.from("watchlist").select("symbol").eq("user_id", user.id);
      return (data || []).map((r) => r.symbol);
    },

    async addToWatchlist(symbol) {
      if (!configured) {
        const w = ls.get("watchlist", []); if (!w.includes(symbol)) w.push(symbol); ls.set("watchlist", w); return;
      }
      const user = await this.currentUser(); if (!user) return;
      const live = await this.getPrice(symbol);
      await client.from("watchlist").upsert({
        user_id: user.id, symbol,
        price_when_added: live && live.price != null ? live.price : null,
      });
    },

    // Full watchlist rows (symbol, price_when_added, added_at)
    async getWatchlistDetailed() {
      if (!configured) return (ls.get("watchlist", [])).map((s) => ({ symbol: s }));
      const user = await this.currentUser(); if (!user) return [];
      const { data } = await client.from("watchlist")
        .select("symbol, price_when_added, added_at")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });
      return data || [];
    },

    async removeFromWatchlist(symbol) {
      if (!configured) {
        ls.set("watchlist", ls.get("watchlist", []).filter((s) => s !== symbol)); return;
      }
      const user = await this.currentUser(); if (!user) return;
      await client.from("watchlist").delete().eq("user_id", user.id).eq("symbol", symbol);
    },

    /* -------------------- LESSONS & QUIZZES -------------------- */
    async getLessonProgress() {
      if (!configured) return ls.get("lessonProgress", {});
      const user = await this.currentUser(); if (!user) return {};
      const { data } = await client.from("lesson_progress").select("*").eq("user_id", user.id);
      const map = {};
      (data || []).forEach((r) => (map[r.module_id] = r));
      return map;
    },

    async saveLessonProgress(moduleId, progress, completed) {
      if (!configured) {
        const m = ls.get("lessonProgress", {}); m[moduleId] = { module_id: moduleId, progress, completed }; ls.set("lessonProgress", m); return;
      }
      const user = await this.currentUser(); if (!user) return;
      await client.from("lesson_progress").upsert({
        user_id: user.id, module_id: moduleId, progress, completed,
        updated_at: new Date().toISOString(),
      });
    },

    async saveQuizResult(moduleId, score, total) {
      if (!configured) {
        const q = ls.get("quizResults", []); q.push({ module_id: moduleId, score, total, taken_at: Date.now() }); ls.set("quizResults", q); return;
      }
      const user = await this.currentUser(); if (!user) return;
      await client.from("quiz_results").insert({ user_id: user.id, module_id: moduleId, score, total });
      // mark the module complete when they pass (>= 70%)
      if (total > 0 && score / total >= 0.7) {
        await this.saveLessonProgress(moduleId, 100, true);
      }
    },

    /* -------------------- MARKET DATA -------------------- */
    // Reads the price cache filled by the scraper Edge Function, and quietly
    // re-runs the scraper when the cache is older than 10 minutes — so prices
    // keep themselves fresh whenever anyone uses the app (no cron required).
    _refreshFired: false,
    _maybeRefreshPrices(rows) {
      if (this._refreshFired || !rows || !rows.length) return;
      const newest = Math.max(...rows.map((r) => new Date(r.updated_at || 0).getTime()));
      if (Date.now() - newest > 10 * 60 * 1000) {
        this._refreshFired = true;
        try {
          // Fire-and-forget: the scraper runs server-side; we don't need the response.
          fetch(cfg.url + "/functions/v1/quick-responder", {
            method: "POST", mode: "no-cors",
            headers: { apikey: cfg.key, Authorization: "Bearer " + cfg.key },
          }).catch(() => {});
        } catch (e) { /* ignore */ }
      }
    },

    async getPrices(symbols = null) {
      if (!configured) return {};
      let q = client.from("stock_prices").select("*");
      if (symbols && symbols.length) q = q.in("symbol", symbols);
      const { data } = await q;
      const map = {};
      (data || []).forEach((r) => (map[r.symbol] = r));
      this._maybeRefreshPrices(data);
      return map;
    },

    async getPrice(symbol) {
      const map = await this.getPrices([symbol]);
      return map[symbol] || null;
    },

    // Live quotes for ANY symbol — even ones the scraper has never seen.
    // 1) start from the stock_prices cache, 2) fill every gap straight from
    // Yahoo via the market-data Edge Function, 3) remember answers for 5 min
    // so dragging sliders doesn't re-hit the network.
    _liveCache: {},
    async getLiveQuotes(symbols = []) {
      const want = [...new Set(symbols.filter(Boolean))];
      if (!want.length) return {};
      const map = configured ? await this.getPrices(want) : {};
      const now = Date.now();
      const missing = want.filter((s) => {
        if (map[s] && map[s].price != null) return false;
        const c = this._liveCache[s];
        if (c && now - c.at < 5 * 60 * 1000) { map[s] = c; return false; }
        return true;
      });
      if (missing.length && configured) {
        // FAST PATH: one batch call covers up to 100 symbols at once.
        // Smaller chunks: the upstream quote endpoint silently truncates long
        // symbol lists, which looked exactly like "this ticker has no price".
        for (let i = 0; i < missing.length; i += 40) {
          const chunk = missing.slice(i, i + 40);
          try {
            const r = await fetch(
              cfg.url + "/functions/v1/market-data?type=quotes&symbols=" + encodeURIComponent(chunk.join(",")),
              { headers: { apikey: cfg.key, Authorization: "Bearer " + cfg.key } },
            );
            if (!r.ok) continue;   // a rate-limited chunk must not abandon the rest
            const j = await r.json();
            chunk.forEach((s) => {
              const q = j && j[s];
              if (q && q.price != null) {
                const rec = { symbol: s, price: Number(q.price), change_pct: q.change_pct != null ? Number(q.change_pct) : null, at: Date.now(), source: "yahoo-batch" };
                this._liveCache[s] = rec; map[s] = rec;
              }
            });
          } catch (e) { /* this chunk only; keep going */ }
        }
      }
      const still = want.filter((s) => !(map[s] && map[s].price != null));
      if (still.length && configured) {
        const fetchOne = async (sym) => {
          try {
            const r = await fetch(
              cfg.url + "/functions/v1/market-data?symbol=" + encodeURIComponent(sym) + "&range=5d&interval=1d",
              { headers: { apikey: cfg.key, Authorization: "Bearer " + cfg.key } },
            );
            const j = await r.json();
            const meta = j && j.chart && j.chart.result && j.chart.result[0] && j.chart.result[0].meta;
            if (!meta || meta.regularMarketPrice == null) return;
            const prev = Number(meta.chartPreviousClose ?? meta.previousClose) || null;
            const price = Number(meta.regularMarketPrice);
            const q = {
              symbol: sym, price,
              change_pct: prev ? ((price - prev) / prev) * 100 : null,
              at: Date.now(), source: "yahoo-live",
            };
            this._liveCache[sym] = q;
            map[sym] = q;
          } catch (e) { /* leave missing */ }
        };
        // Per-symbol rescue for whatever the batch missed. The old cap of 18
        // silently abandoned the rest of the request, and the caller had
        // already marked them all as "tried", so they never came back.
        const cap = still.slice(0, 120);
        for (let i = 0; i < cap.length; i += 8) {
          await Promise.all(cap.slice(i, i + 8).map(fetchOne));
        }
      }
      return map;
    },

    // Relevant news headlines for a symbol. Tries the Edge Function first,
    // then falls back to fetching Yahoo's RSS in-browser via a CORS proxy, so
    // news works even before the function is deployed.
    async getStockNews(symbol) {
      if (configured) {
        // The news function is deployed under the name "hyper-worker"
        // (Supabase's generated name); try it first, then the canonical name.
        for (const fnName of ["hyper-worker", "stock-news"]) {
          try {
            const { data, error } = await client.functions.invoke(fnName, { body: { symbol } });
            if (!error && data && data.items && data.items.length) return data.items;
          } catch (e) { /* try next */ }
        }
      }
      const rss = "https://feeds.finance.yahoo.com/rss/2.0/headline?s=" +
        encodeURIComponent(symbol) + "&region=US&lang=en-US";
      const proxies = [
        (u) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
        (u) => "https://corsproxy.io/?url=" + encodeURIComponent(u),
      ];
      for (const wrap of proxies) {
        try {
          const res = await fetch(wrap(rss));
          if (!res.ok) continue;
          const xml = await res.text();
          const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 10).map((m) => {
            const b = m[1];
            const g = (t) => {
              const mm = b.match(new RegExp("<" + t + ">([\\s\\S]*?)</" + t + ">", "i"));
              return mm ? mm[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
            };
            return { title: g("title"), link: g("link"), pubDate: g("pubDate"), source: "Yahoo Finance" };
          }).filter((i) => i.title && i.link);
          if (items.length) return items;
        } catch (e) { /* try next proxy */ }
      }
      return [];
    },

    /* -------------------- LEAGUES (snake draft) -------------------- */
    async createLeague(name, rosterSize = 14, maxPlayers = 8, startingCapital = 100000, durationWeeks = 4, transferPct = 5, draftAt = null) {
      if (!configured) throw new Error("Connect Supabase to create real leagues — add your keys in js/supabase-config.js.");
      const user = await this.currentUser();
      if (!user) throw new Error("You need to be signed in to create a league.");

      // Try a few times in case a random join code collides.
      let data = null, lastError = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const code = Math.random().toString(36).slice(2, 8).toUpperCase();
        let res = await client.from("leagues")
          .insert(Object.assign({
            name, owner_id: user.id, join_code: code,
            roster_size: rosterSize, max_players: maxPlayers, status: "lobby",
            starting_capital: startingCapital, duration_weeks: durationWeeks,
            capital_transfer_pct: transferPct,
          }, draftAt ? { draft_at: draftAt } : {}))
          .select().single();
        // Older schemas may not have duration_weeks yet — retry without it.
        if (res.error && /draft_at/.test(res.error.message || "")) {
          res = await client.from("leagues")
            .insert({
              name, owner_id: user.id, join_code: code,
              roster_size: rosterSize, max_players: maxPlayers, status: "lobby",
              starting_capital: startingCapital, duration_weeks: durationWeeks,
              capital_transfer_pct: transferPct,
            })
            .select().single();
        }
        if (res.error && /(duration_weeks|capital_transfer_pct)/.test(res.error.message || "")) {
          res = await client.from("leagues")
            .insert({
              name, owner_id: user.id, join_code: code,
              roster_size: rosterSize, max_players: maxPlayers, status: "lobby",
              starting_capital: startingCapital,
            })
            .select().single();
        }
        // Older schemas may not have starting_capital yet — retry without it.
        if (res.error && /starting_capital/.test(res.error.message || "")) {
          res = await client.from("leagues")
            .insert({
              name, owner_id: user.id, join_code: code,
              roster_size: rosterSize, max_players: maxPlayers, status: "lobby",
            })
            .select().single();
        }
        if (!res.error) { data = res.data; break; }
        lastError = res.error;
        // 23505 = unique_violation (join_code taken) → retry with a new code
        if (res.error.code !== "23505") break;
      }
      if (!data) {
        throw new Error((lastError && lastError.message) ||
          "Could not create the league. Make sure you ran supabase-schema-update.sql.");
      }

      const memberRes = await client.from("league_members")
        .insert({ league_id: data.id, user_id: user.id });
      if (memberRes.error) throw new Error(memberRes.error.message || "League made, but couldn't add you as a member.");
      return data;
    },

    async joinLeague(joinCode) {
      if (!configured) throw new Error("Connect Supabase to join leagues.");
      const user = await this.requireAuth(); if (!user) return null;
      const { data: league, error } = await client.from("leagues")
        .select("*").eq("join_code", joinCode.toUpperCase()).maybeSingle();
      if (error || !league) throw new Error("League not found — check the code.");
      if (league.status !== "lobby") throw new Error("That league's draft has already started.");
      await client.from("league_members").upsert({ league_id: league.id, user_id: user.id });
      return league;
    },

    async myLeagues() {
      if (!configured) return [];
      const user = await this.currentUser(); if (!user) return [];
      const { data } = await client.from("league_members")
        .select("league_id, leagues(id, name, join_code, owner_id, roster_size, max_players, status)")
        .eq("user_id", user.id);
      return data || [];
    },

    async getLeague(leagueId) {
      if (!configured) return null;
      const { data } = await client.from("leagues").select("*").eq("id", leagueId).maybeSingle();
      return data;
    },

    async getLeagueMembers(leagueId) {
      if (!configured) return [];
      // Try the joined query first; if the profiles relationship isn't
      // available (join error -> null data), fall back to two plain queries
      // so members NEVER silently vanish.
      // IMPORTANT: select * so deployed/cash_adj/capital_adj come through —
      // a narrow column list here is what made Team Manager "un-unlock".
      const joined = await client.from("league_members")
        .select("*, profiles(username, full_name)")
        .eq("league_id", leagueId);
      if (!joined.error && joined.data) return joined.data;
      console.warn("league_members join failed, using fallback:", joined.error && joined.error.message);
      const plain = await client.from("league_members")
        .select("*")
        .eq("league_id", leagueId);
      const rows = plain.data || [];
      if (!rows.length) return rows;
      try {
        const ids = rows.map((r) => r.user_id);
        const { data: profs } = await client.from("profiles")
          .select("id, username, full_name").in("id", ids);
        const byId = {};
        (profs || []).forEach((p) => (byId[p.id] = p));
        rows.forEach((r) => (r.profiles = byId[r.user_id] || null));
      } catch (e) { /* names fall back to "Player" */ }
      return rows;
    },

    async getPicks(leagueId) {
      if (!configured) return [];
      const { data } = await client.from("league_picks")
        .select("*").eq("league_id", leagueId).order("pick_number", { ascending: true });
      return data || [];
    },

    async startDraft(leagueId) {
      const { data, error } = await client.rpc("start_draft", { p_league: leagueId });
      if (error) throw error;
      return data;
    },

    async makePick(leagueId, symbol) {
      const { data, error } = await client.rpc("make_pick", { p_league: leagueId, p_symbol: symbol });
      if (error) throw error;
      return data;
    },

    // Given a league row, work out whose turn it is (returns the user_id) and
    // the current round — mirrors the snake logic in the DB function.
    whoseTurn(league) {
      const order = league.draft_order || [];
      const n = order.length;
      if (!n || league.status !== "drafting") return null;
      const round = Math.floor(league.current_pick / n);
      const pos = league.current_pick % n;
      const seat = round % 2 === 0 ? pos : n - 1 - pos;
      return { userId: order[seat], round, seat, pickNumber: league.current_pick };
    },

    // Live standings: each member's roster value using current prices.
    // ── weekly settlement ───────────────────────────────────────────
    // Nudge the server to settle any finished week. It's idempotent and
    // the scheduled function is the real backstop, so calling it on page
    // load just means results appear promptly for whoever is looking.
    async settleLeague(leagueId) {
      if (!configured) return 0;
      const { data, error } = await client.rpc("ft_settle_league", { p_league: leagueId });
      if (error) { console.warn("settle", error.message); return 0; }
      return data || 0;
    },

    // Every week result I'm party to, newest first.
    async myWeekResults(leagueId) {
      if (!configured) return [];
      const user = await this.currentUser();
      if (!user) return [];
      const { data } = await client
        .from("league_weeks")
        .select("*")
        .eq("league_id", leagueId)
        .order("week", { ascending: false });
      return (data || []).filter((r) => r.winner_id === user.id || r.loser_id === user.id);
    },

    async allWeekResults(leagueId) {
      if (!configured) return [];
      const { data } = await client
        .from("league_weeks").select("*").eq("league_id", leagueId)
        .order("week", { ascending: false });
      return data || [];
    },

    // The loser confirms once they've raised the cash. Throws with a
    // readable message if they still haven't sold enough.
    async payWeekDebt(leagueId, week) {
      const { data, error } = await client.rpc("ft_pay_week_debt", {
        p_league: leagueId, p_week: week,
      });
      if (error) throw new Error(error.message);
      return data;
    },

    async ackWeek(leagueId, week) {
      if (!configured) return;
      await client.rpc("ft_ack_week", { p_league: leagueId, p_week: week }).catch(() => {});
    },

    async leagueStandings(leagueId) {
      if (!configured) return [];
      const [members, picks] = await Promise.all([
        this.getLeagueMembers(leagueId),
        this.getPicks(leagueId),
      ]);
      const symbols = [...new Set(picks.map((p) => p.symbol))];
      const prices = symbols.length ? await this.getPrices(symbols) : {};
      return members.map((m) => {
        const roster = picks.filter((p) => p.user_id === m.user_id);
        const allocated = roster.some((p) => Number(p.shares) > 0);
        let value = 0, cost = 0;
        roster.forEach((p) => {
          const live = prices[p.symbol];
          const cur = live && live.price != null ? Number(live.price) : Number(p.price_at_pick || 0);
          const qty = allocated ? Number(p.shares) || 0 : 1;   // legacy leagues: 1 share per pick
          value += cur * qty;
          cost += Number(p.price_at_pick || cur) * qty;
        });
        const ret = cost > 0 ? ((value - cost) / cost) * 100 : 0;
        return {
          user_id: m.user_id,
          name: (m.profiles && (m.profiles.full_name || m.profiles.username)) || "Player",
          roster: roster.map((p) => p.symbol),
          value, cost, returnPct: ret, allocated,
        };
      }).sort((a, b) => b.returnPct - a.returnPct);
    },

    // Buy/sell a drafted position at the CURRENT price. The DB keeps cash and
    // average cost honest (see set_position in supabase-schema-trades.sql).
    async setAllocation(leagueId, symbol, shares, price) {
      const user = await this.currentUser();
      if (!user) throw new Error("Sign in first.");
      let px = Number(price);
      if (!(px > 0)) {
        const map = await this.getPrices([symbol]).catch(() => ({}));
        px = map[symbol] && map[symbol].price != null ? Number(map[symbol].price) : 0;
      }
      if (!(px > 0)) throw new Error("No live price for " + symbol + " right now — try again in a moment.");
      const { error } = await client.rpc("set_position", {
        p_league: leagueId, p_symbol: symbol, p_shares: shares, p_price: px,
      });
      if (error) {
        if (/set_position/.test(error.message || "")) {
          throw new Error("Run supabase-schema-trades.sql in Supabase to enable trading.");
        }
        throw new Error(error.message);
      }
      return true;
    },

    // Realtime: call cb() whenever this league's row or picks change.
    subscribeLeague(leagueId, cb) {
      if (!configured) return { unsubscribe() {} };
      const ch = client
        .channel("league-" + leagueId)
        .on("postgres_changes",
          { event: "*", schema: "public", table: "leagues", filter: "id=eq." + leagueId }, cb)
        .on("postgres_changes",
          { event: "*", schema: "public", table: "league_picks", filter: "league_id=eq." + leagueId }, cb)
        .on("postgres_changes",
          { event: "*", schema: "public", table: "league_members", filter: "league_id=eq." + leagueId }, cb)
        .subscribe();
      return ch;
    },
  };

  window.SL = SL;
})();
