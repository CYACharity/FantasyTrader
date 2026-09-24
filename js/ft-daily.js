/* ============================================================
   FANTASYTRADER — daily close (shared logic, no DOM)
   ------------------------------------------------------------
   Every page that wants to say "you beat your opponent today"
   needs the same three facts: what time it is in New York, who
   the opponent is this week, and what each lineup was worth at
   the open versus now. This module owns all three so the pages
   agree with each other and, more importantly, with the server.

   Two sources of truth are mirrored here and must not drift:

     - the week clock in your-league.html (weekInfo): 24h prep,
       then repeating cycles of 6 days live + 24h transfer
     - the matchup pairing in supabase-schema-settlement.sql
       (ft_settle_league): the circle method over leagues.draft_order

   Snapshots of lineup value live in localStorage, per league, per
   ET calendar day. "Base" is the first value this browser saw
   today, "latest" is the most recent, and "closed" freezes the
   day's percentages once the 4pm bell has rung. This is a
   device-local approximation of a true open-to-close move: if the
   page is first opened at 2pm, the base is the 2pm value. Callers
   should treat it as such and not overstate it.

   Usage:
       var w   = FTDaily.weekOf(DRAFT.league, DRAFT.picks);
       var opp = FTDaily.opponentOf(DRAFT.league.draft_order, w.week, me);
       FTDaily.snapshot(DRAFT.id, { [me]: v1, [opp]: v2 });
       FTDaily.close(DRAFT.id);
       var r   = FTDaily.result(DRAFT.id, me, opp);
   ============================================================ */
(function (w) {
  if (w.FTDaily) return;                         // already installed

  var DAY_MS   = 86400000;
  var PREP_MS  = 24 * 3600000;                   // research window after the draft
  var LIVE_MS  = 6 * DAY_MS;                     // scoring days per week
  var CYCLE_MS = 7 * DAY_MS;                     // live + transfer window
  var CLOSE_MIN = 16 * 60;                       // 4:00pm ET, in minutes from midnight
  var KEY_PREFIX = 'ftDaily_';

  /* ── New York clock ─────────────────────────────────────────
     Same construction as marketOpen() on the league page: format
     the instant in America/New_York, then parse it back so the
     Date's local getters (getDay, getHours) read as ET wall time.
     It is a wall-clock Date, not an instant, so never compare it
     against Date.now(). If Intl lacks the zone we fall back to
     the browser's own clock rather than throwing. */
  function toET(d) {
    var src = d == null ? new Date() : (d instanceof Date ? d : new Date(d));
    try {
      return new Date(src.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    } catch (e) {
      return new Date(src.getTime());
    }
  }
  function etNow() { return toET(); }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* d is an instant (Date or ms); omit it for "now". Passing the
     result of etNow() back in would shift it a second time, so
     callers with an ET wall-clock Date should read its fields
     directly instead. */
  function dayKey(d) {
    var et = toET(d);
    return et.getFullYear() + '-' + pad2(et.getMonth() + 1) + '-' + pad2(et.getDate());
  }
  function isWeekday(d) {
    var day = toET(d).getDay();
    return day >= 1 && day <= 5;
  }
  function isAfterClose(d) {
    var et = toET(d);
    var day = et.getDay();
    if (day < 1 || day > 5) return false;
    return et.getHours() * 60 + et.getMinutes() >= CLOSE_MIN;
  }

  /* ── week clock ─────────────────────────────────────────────
     Mirrors weekInfo() on the league page. The anchor is the
     later of season_start (or created_at) and the last pick,
     because some older leagues had season_start backfilled to
     creation time, which would skip the prep window entirely.
     Note the server's ft_week_live_end uses season_start alone;
     for leagues where the two differ, the page and this module
     follow the page. nowMs is only for tests. */
  function weekOf(league, picks, nowMs) {
    var L = league || {};
    var stamped = new Date(L.season_start || L.created_at || Date.now()).getTime();
    var lastPick = 0;
    (picks || []).forEach(function (p) {
      var t = p && p.created_at ? new Date(p.created_at).getTime() : 0;
      if (t > lastPick) lastPick = t;
    });
    var start = Math.max(stamped, lastPick);
    var liveAt = start + PREP_MS;
    var now = nowMs == null ? Date.now() : nowMs;
    var totalWeeks = Number(L.duration_weeks) || 4;

    if (now < liveAt) {
      return { week: 1, phase: 'prep', liveAt: liveAt, endsAt: liveAt, totalWeeks: totalWeeks, over: false };
    }
    var elapsed = now - liveAt;
    var rawWeek = Math.floor(elapsed / CYCLE_MS) + 1;
    var week = Math.min(totalWeeks, Math.max(1, rawWeek));
    var within = elapsed % CYCLE_MS;
    var over = rawWeek > totalWeeks;
    if (within < LIVE_MS) {
      return { week: week, phase: 'live', liveAt: liveAt,
               endsAt: liveAt + (rawWeek - 1) * CYCLE_MS + LIVE_MS, totalWeeks: totalWeeks, over: over };
    }
    return { week: week, phase: 'closed', liveAt: liveAt,
             endsAt: liveAt + rawWeek * CYCLE_MS, totalWeeks: totalWeeks, over: over };
  }

  /* ── matchups ───────────────────────────────────────────────
     Circle method, identical to ft_settle_league: seat 1 stays
     put, everyone else rotates one place per week, then seat i
     plays seat n-1-i. An odd league gets a null seat for the bye.

     Pass leagues.draft_order here. The league page's own
     roundRobin() is fed DRAFT.members in whatever order the
     members query returned them, which is not guaranteed to be
     the draft order. When those orders differ, the page shows a
     fixture the server will never settle. Money follows the
     server, so this module follows the server. */
  function pairs(draftOrder, week) {
    var a = Array.isArray(draftOrder) ? draftOrder.slice() : [];
    if (!a.length) return [];
    if (a.length % 2) a.push(null);
    var n = a.length;
    var wk = Math.max(1, Math.floor(Number(week) || 1));
    var rot = (wk - 1) % Math.max(1, n - 1);
    var head = a[0], rest = a.slice(1);
    for (var i = 0; i < rot; i++) rest.unshift(rest.pop());
    var order = [head].concat(rest);
    var out = [];
    for (var j = 0; j < n / 2; j++) out.push([order[j], order[n - 1 - j]]);
    return out;
  }
  function opponentOf(draftOrder, week, meId) {
    if (!meId) return null;
    var ps = pairs(draftOrder, week);
    for (var i = 0; i < ps.length; i++) {
      if (ps[i][0] === meId) return ps[i][1] == null ? null : ps[i][1];
      if (ps[i][1] === meId) return ps[i][0] == null ? null : ps[i][0];
    }
    return null;
  }

  /* ── lineup valuation ───────────────────────────────────────
     cash + shares marked to the live price, falling back to the
     price at pick and then cost basis, which is the same ladder
     ft_member_value uses (its coalesce order is price, cost_basis,
     price_at_pick; the two fallbacks are the same number for
     every pick saved by the current allocation flow).

     Only active picks count, so the daily result reflects the
     lineup the player actually started. A member who never set a
     lineup has no active picks; scoring them at cash alone would
     hand every opponent a free win, so they are valued on all
     their picks instead. Returns null when there is nothing to
     price, so callers can show a dash instead of a fake zero. */
  function lineupValue(uid, picks, prices, cash) {
    var mine = (picks || []).filter(function (p) {
      return p && p.user_id === uid && (Number(p.shares) || 0) > 0;
    });
    var active = mine.filter(function (p) { return !!p.active; });
    var rows = active.length ? active : mine;
    if (!rows.length) return null;
    var px = prices || {};
    var total = 0, priced = 0;
    rows.forEach(function (p) {
      var rec = px[p.symbol];
      var price = rec && rec.price != null ? Number(rec.price) : 0;
      if (!(price > 0)) price = Number(p.price_at_pick) || Number(p.cost_basis) || 0;
      if (price > 0) {
        priced++;
        total += (Number(p.shares) || 0) * price;
      }
    });
    if (!priced) return null;
    return (Number(cash) || 0) + total;
  }

  /* True only when every symbol the member holds has a live,
     non-stale quote. A stale quote contributes no movement, so a
     "today" figure built on one is quietly wrong; pages should
     check this before labelling a number as today's. */
  function fresh(uid, picks, prices) {
    var px = prices || {};
    var held = (picks || []).filter(function (p) {
      return p && p.user_id === uid && (Number(p.shares) || 0) > 0;
    });
    if (!held.length) return false;
    for (var i = 0; i < held.length; i++) {
      var rec = px[held[i].symbol];
      if (!rec || rec.price == null || rec.stale === true) return false;
    }
    return true;
  }

  /* ── snapshot store ─────────────────────────────────────────
     localStorage can throw (private mode, disabled storage, quota).
     A per-session memory map keeps the module working in that
     case; the numbers just do not survive a reload. */
  var MEM = Object.create(null);
  function keyFor(leagueId) { return KEY_PREFIX + String(leagueId == null ? '' : leagueId); }
  function load(leagueId) {
    var k = keyFor(leagueId);
    var raw = null;
    try { raw = w.localStorage ? w.localStorage.getItem(k) : null; } catch (e) { raw = null; }
    if (raw == null && MEM[k]) raw = MEM[k];
    if (!raw) return null;
    try {
      var rec = JSON.parse(raw);
      if (!rec || typeof rec !== 'object') return null;
      rec.base = rec.base && typeof rec.base === 'object' ? rec.base : {};
      rec.latest = rec.latest && typeof rec.latest === 'object' ? rec.latest : {};
      rec.closed = rec.closed && typeof rec.closed === 'object' ? rec.closed : null;
      return rec;
    } catch (e) { return null; }
  }
  function save(leagueId, rec) {
    var k = keyFor(leagueId);
    var raw = JSON.stringify(rec);
    MEM[k] = raw;
    try { if (w.localStorage) w.localStorage.setItem(k, raw); } catch (e) { /* memory copy still holds it */ }
    return rec;
  }
  function clear(leagueId) {
    var k = keyFor(leagueId);
    delete MEM[k];
    try { if (w.localStorage) w.localStorage.removeItem(k); } catch (e) { /* nothing to undo */ }
  }
  function numeric(v) {
    var n = Number(v);
    return v != null && isFinite(n) ? n : null;
  }

  /* Record today's values. On a new ET day the base resets to
     whatever was passed in; on the same day, uids seen for the
     first time are added to the base and everyone's latest is
     refreshed. Non-numeric values are ignored rather than stored,
     so a member whose prices have not loaded yet does not get a
     base of NaN. */
  function snapshot(leagueId, values) {
    var today = dayKey();
    var vals = values && typeof values === 'object' ? values : {};
    var rec = load(leagueId);
    if (!rec || rec.day !== today) {
      rec = { day: today, base: {}, latest: {}, closed: null };
    }
    Object.keys(vals).forEach(function (uid) {
      var v = numeric(vals[uid]);
      if (v == null) return;
      if (!(uid in rec.base)) rec.base[uid] = v;
      rec.latest[uid] = v;
    });
    return save(leagueId, rec);
  }

  function pctOf(base, latest) {
    var b = numeric(base), l = numeric(latest);
    if (b == null || l == null || b === 0) return null;
    return (l - b) / b * 100;
  }
  function dailyPct(leagueId, uid) {
    var rec = load(leagueId);
    if (!rec) return null;
    return pctOf(rec.base[uid], rec.latest[uid]);
  }

  /* Freeze today's percentages once the bell has rung. Runs
     safely on every render: it does nothing before 4pm, nothing
     on a weekend, nothing for yesterday's record, and nothing if
     it has already run. Prices can keep drifting after hours, so
     freezing at the first sighting after close is what keeps
     "today's result" from changing under the player's feet. */
  function close(leagueId) {
    var rec = load(leagueId);
    if (!rec) return null;
    if (rec.closed || rec.day !== dayKey() || !isAfterClose()) return rec;
    var closed = {};
    Object.keys(rec.latest).forEach(function (uid) {
      var p = pctOf(rec.base[uid], rec.latest[uid]);
      if (p != null) closed[uid] = p;
    });
    rec.closed = closed;
    return save(leagueId, rec);
  }

  /* Head-to-head for one day. final is true when the figures come
     from the frozen close; before that they are live and will
     move. Returns null when either side has no number, so the
     caller does not declare a winner over a blank. */
  function result(leagueId, meId, oppId) {
    var rec = load(leagueId);
    if (!rec || !meId || !oppId) return null;
    var fin = !!rec.closed;
    var mine = fin ? numeric(rec.closed[meId]) : pctOf(rec.base[meId], rec.latest[meId]);
    var theirs = fin ? numeric(rec.closed[oppId]) : pctOf(rec.base[oppId], rec.latest[oppId]);
    if (mine == null || theirs == null) return null;
    var tie = Math.abs(mine - theirs) < 1e-9;
    return { day: rec.day, mine: mine, theirs: theirs, won: !tie && mine > theirs, tie: tie, final: fin };
  }

  /* '+1.24%' or '−0.40%' with a real minus sign, which the page's
     mono font renders at the same width as the plus. Zero keeps
     the plus, matching the league standings table. */
  function fmt(pct) {
    var n = numeric(pct);
    if (n == null) return '—';
    var abs = Math.abs(n).toFixed(2);
    if (abs === '0.00') n = 0;                    // -0.001 should not print as −0.00
    return (n < 0 ? '−' : '+') + abs + '%';
  }

  /* ── self-test ──────────────────────────────────────────────
     Run FTDaily._selfTest() from the console. It checks the
     pairing against hand-worked circle-method results, the ET
     close rule against fixed instants (1 Sep 2026 is a Tuesday in
     EDT, so 20:00Z is 16:00 ET), the week clock, and one full
     snapshot/close/result cycle under a throwaway league id. */
  function _selfTest() {
    var failures = [];
    function eq(name, got, want) {
      var g = JSON.stringify(got), wnt = JSON.stringify(want);
      if (g !== wnt) failures.push(name + ': got ' + g + ', want ' + wnt);
    }

    // pairing: fixed head, rotating tail, seat i vs seat n-1-i
    eq('pairs w1', pairs(['a', 'b', 'c', 'd'], 1), [['a', 'd'], ['b', 'c']]);
    eq('pairs w2', pairs(['a', 'b', 'c', 'd'], 2), [['a', 'c'], ['d', 'b']]);
    eq('pairs w3', pairs(['a', 'b', 'c', 'd'], 3), [['a', 'b'], ['c', 'd']]);
    eq('pairs w4 wraps to w1', pairs(['a', 'b', 'c', 'd'], 4), pairs(['a', 'b', 'c', 'd'], 1));
    eq('pairs odd bye', pairs(['a', 'b', 'c'], 1), [['a', null], ['b', 'c']]);
    eq('pairs empty', pairs([], 1), []);
    eq('opponent w2 of b', opponentOf(['a', 'b', 'c', 'd'], 2, 'b'), 'd');
    eq('opponent bye', opponentOf(['a', 'b', 'c'], 1, 'a'), null);
    eq('opponent unknown', opponentOf(['a', 'b'], 1, 'zz'), null);

    // the bell
    eq('4pm ET Tuesday is after close', isAfterClose(new Date('2026-09-01T20:00:00Z')), true);
    eq('3:59pm ET Tuesday is not', isAfterClose(new Date('2026-09-01T19:59:00Z')), false);
    eq('4pm ET Saturday is not', isAfterClose(new Date('2026-09-05T20:00:00Z')), false);
    eq('Tuesday is a weekday', isWeekday(new Date('2026-09-01T20:00:00Z')), true);
    eq('Saturday is not', isWeekday(new Date('2026-09-05T20:00:00Z')), false);
    eq('dayKey in ET', dayKey(new Date('2026-09-02T02:30:00Z')), '2026-09-01');   // 10:30pm ET the night before
    eq('fmt +', fmt(1.2345), '+1.23%');
    eq('fmt −', fmt(-0.4), '−0.40%');
    eq('fmt zero', fmt(-0.001), '+0.00%');
    eq('fmt null', fmt(null), '—');

    // the week clock, driven by a fixed "now"
    var t0 = Date.parse('2026-08-01T00:00:00Z');
    var lg = { season_start: new Date(t0).toISOString(), duration_weeks: 4 };
    eq('prep', weekOf(lg, [], t0 + 3600000).phase, 'prep');
    eq('live w1', [weekOf(lg, [], t0 + PREP_MS + 3600000).week, weekOf(lg, [], t0 + PREP_MS + 3600000).phase], [1, 'live']);
    eq('closed w1', [weekOf(lg, [], t0 + PREP_MS + LIVE_MS + 3600000).week, weekOf(lg, [], t0 + PREP_MS + LIVE_MS + 3600000).phase], [1, 'closed']);
    eq('live w2', [weekOf(lg, [], t0 + PREP_MS + CYCLE_MS + 3600000).week, weekOf(lg, [], t0 + PREP_MS + CYCLE_MS + 3600000).phase], [2, 'live']);
    eq('clamped after season', weekOf(lg, [], t0 + PREP_MS + 9 * CYCLE_MS).week, 4);
    eq('over after season', weekOf(lg, [], t0 + PREP_MS + 9 * CYCLE_MS).over, true);
    var late = [{ created_at: new Date(t0 + 2 * DAY_MS).toISOString() }];
    eq('last pick moves liveAt', weekOf(lg, late, t0).liveAt, t0 + 2 * DAY_MS + PREP_MS);

    // valuation
    var picks = [
      { user_id: 'u1', symbol: 'AAA', shares: 10, active: true,  price_at_pick: 10, cost_basis: 10 },
      { user_id: 'u1', symbol: 'BBB', shares: 5,  active: false, price_at_pick: 20, cost_basis: 20 },
      { user_id: 'u2', symbol: 'CCC', shares: 2,  active: false, price_at_pick: 50, cost_basis: 50 },
    ];
    var prices = { AAA: { price: 12 }, BBB: { price: 22 }, CCC: { price: null } };
    eq('value: active only', lineupValue('u1', picks, prices, 100), 100 + 10 * 12);
    eq('value: no lineup falls back to all picks', lineupValue('u2', picks, prices, 0), 2 * 50);
    eq('value: nobody', lineupValue('u3', picks, prices, 100), null);
    eq('fresh u1', fresh('u1', picks, prices), true);
    eq('fresh u2 (no price)', fresh('u2', picks, prices), false);
    eq('fresh stale', fresh('u1', picks, { AAA: { price: 12, stale: true }, BBB: { price: 22 } }), false);

    // one day in the store
    var id = '_selftest_' + Date.now();
    try {
      clear(id);
      var r1 = snapshot(id, { u1: 1000, u2: 2000 });
      eq('snapshot day', r1.day, dayKey());
      eq('snapshot base', r1.base, { u1: 1000, u2: 2000 });
      var r2 = snapshot(id, { u1: 1010, u2: 1980, u3: 500, u4: 'nope' });
      eq('base keeps first sighting', r2.base, { u1: 1000, u2: 2000, u3: 500 });
      eq('latest merges', r2.latest, { u1: 1010, u2: 1980, u3: 500 });
      eq('closed still open', r2.closed, null);
      eq('pct u1', Number(dailyPct(id, 'u1').toFixed(4)), 1);
      eq('pct u2', Number(dailyPct(id, 'u2').toFixed(4)), -1);
      eq('pct unknown', dailyPct(id, 'u9'), null);
      var res = result(id, 'u1', 'u2');
      eq('result won', res && res.won, true);
      eq('result not final', res && res.final, false);
      eq('result missing side', result(id, 'u1', 'u9'), null);
      var rc = close(id);
      eq('close matches the bell', !!rc.closed, isAfterClose());
    } catch (e) {
      failures.push('store: ' + (e && e.message ? e.message : e));
    } finally {
      clear(id);
    }

    return { ok: failures.length === 0, failures: failures };
  }

  w.FTDaily = {
    etNow: etNow,
    dayKey: dayKey,
    isWeekday: isWeekday,
    isAfterClose: isAfterClose,
    weekOf: weekOf,
    pairs: pairs,
    opponentOf: opponentOf,
    lineupValue: lineupValue,
    fresh: fresh,
    snapshot: snapshot,
    dailyPct: dailyPct,
    close: close,
    result: result,
    fmt: fmt,
    _selfTest: _selfTest
  };
})(typeof window !== 'undefined' ? window : globalThis);
