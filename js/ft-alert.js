/* ============================================================
   FANTASYTRADER — in-game notifications
   ------------------------------------------------------------
   The browser's alert() is a grey system box with a stark "This
   page says" header. It stops everything, it can't be styled,
   and it looks nothing like the rest of the product.

   This replaces it. window.alert is swapped for a toast that
   matches the app, and because the toast doesn't block, the
   page keeps breathing behind it.

   Every existing alert('…') call site is upgraded for free —
   the kind of notice is worked out from the wording, so a
   filled order gets the celebratory treatment and "Insufficient
   funds" gets a warning, with no changes at the call site.

   Richer notices can be raised directly:
       FT.notify({ kind:'trade', side:'buy', ticker:'YEXT', shares:500 })
       FT.notify({ kind:'error', message:'Could not save allocation' })
   ============================================================ */
(function (w, d) {
  if (w.FT && w.FT.notify) return;               // already installed

  var HOST_ID = 'ft-note-host';
  var CSS_ID  = 'ft-note-css';
  var HOLD    = { success: 3200, trade: 4200, info: 3400, error: 5200 };
  var recent  = Object.create(null);             // message -> timestamp

  /* ── the look ───────────────────────────────────────────── */
  var CSS = [
    '#' + HOST_ID + '{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);',
      'z-index:2147483000;display:flex;flex-direction:column;align-items:center;gap:10px;',
      'pointer-events:none;width:max-content;max-width:min(92vw,460px);}',

    '.ft-note{pointer-events:auto;position:relative;width:100%;box-sizing:border-box;',
      'display:flex;align-items:flex-start;gap:13px;padding:14px 44px 14px 15px;',
      'background:linear-gradient(168deg,#2A2521 0%,#211C18 100%);',
      'border:1px solid rgba(236,226,214,0.13);border-radius:14px;',
      'box-shadow:0 18px 40px rgba(0,0,0,.5),0 2px 0 rgba(255,255,255,.03) inset;',
      'font-family:Inter,system-ui,-apple-system,sans-serif;color:#F4EEE6;overflow:hidden;',
      'animation:ftNoteIn .34s cubic-bezier(.2,.9,.28,1.3) both;}',
    '.ft-note.ft-out{animation:ftNoteOut .22s ease-in forwards;}',

    /* the accent hairline along the top edge carries the colour */
    '.ft-note::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;',
      'background:var(--ft-c);}',

    /* icon disc */
    '.ft-note-ico{flex:0 0 auto;width:34px;height:34px;border-radius:10px;position:relative;',
      'display:flex;align-items:center;justify-content:center;',
      'background:color-mix(in srgb,var(--ft-c) 15%,transparent);color:var(--ft-c);}',
    '.ft-note-ico svg{width:18px;height:18px;display:block;}',
    /* one ring, once — a small acknowledgement, not a light show */
    '.ft-note-ico::after{content:"";position:absolute;inset:0;border-radius:10px;',
      'border:2px solid var(--ft-c);opacity:.7;animation:ftRing .7s ease-out forwards;}',

    '.ft-note-body{min-width:0;flex:1;padding-top:1px;}',
    '.ft-note-kick{font:700 .58rem Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;',
      'color:var(--ft-c);margin-bottom:3px;}',
    '.ft-note-msg{font:500 .88rem/1.45 Inter,sans-serif;color:#E8DCCB;overflow-wrap:anywhere;}',

    /* the order line: ticker + share count, in the game\'s numerals */
    '.ft-note-fill{display:flex;align-items:baseline;gap:8px;margin-top:5px;}',
    '.ft-note-qty{font:800 1.32rem Poppins,Inter,sans-serif;color:var(--ft-c);line-height:1;',
      'font-variant-numeric:tabular-nums;letter-spacing:-.01em;}',
    '.ft-note-tick{font:700 .82rem Inter,sans-serif;letter-spacing:.08em;color:#F4EEE6;}',
    '.ft-note-unit{font:600 .64rem Inter,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#8b8279;}',

    '.ft-note-x{position:absolute;top:9px;right:9px;width:24px;height:24px;padding:0;',
      'display:flex;align-items:center;justify-content:center;cursor:pointer;',
      'background:none;border:none;border-radius:7px;color:#7d746a;line-height:0;}',
    '.ft-note-x:hover{background:rgba(236,226,214,.09);color:#F4EEE6;}',
    '.ft-note-x svg{width:12px;height:12px;}',

    /* how long you have left, drawn rather than guessed at */
    '.ft-note-bar{position:absolute;left:0;bottom:0;height:2px;width:100%;',
      'background:var(--ft-c);opacity:.32;transform-origin:left center;',
      'animation:ftBar linear forwards;}',

    '@keyframes ftNoteIn{from{opacity:0;transform:translateY(14px) scale(.96);}',
      'to{opacity:1;transform:none;}}',
    '@keyframes ftNoteOut{to{opacity:0;transform:translateY(6px) scale(.98);}}',
    '@keyframes ftRing{from{transform:scale(1);opacity:.7;}to{transform:scale(1.5);opacity:0;}}',
    '@keyframes ftBar{from{transform:scaleX(1);}to{transform:scaleX(0);}}',

    '@media (max-width:520px){#' + HOST_ID + '{bottom:14px;max-width:94vw;}',
      '.ft-note{padding:12px 40px 12px 13px;gap:11px;}',
      '.ft-note-ico{width:30px;height:30px;border-radius:9px;}}',

    /* respect the system setting rather than animating regardless */
    '@media (prefers-reduced-motion:reduce){',
      '.ft-note,.ft-note-ico::after{animation-duration:.01s!important;}',
      '.ft-note-bar{display:none;}}'
  ].join('');

  var ICONS = {
    trade:   '<path d="M3 17l6-6 4 4 8-8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h6v6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    sell:    '<path d="M3 7l6 6 4-4 8 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 17h6v-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    success: '<path d="M4 12.5l5.2 5L20 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    error:   '<path d="M12 7v6.5" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><circle cx="12" cy="17.4" r="1.35" fill="currentColor"/><path d="M12 2.6l9.6 17.2H2.4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    info:    '<circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="7.4" r="1.3" fill="currentColor"/>'
  };

  var TONE = {
    trade:   { c: '#5CB88A', kick: 'Order filled' },
    sell:    { c: '#E0A24C', kick: 'Order filled' },
    success: { c: '#5CB88A', kick: 'Done' },
    error:   { c: '#D9645C', kick: 'Hold on' },
    info:    { c: '#9DB8D2', kick: 'Heads up'  }
  };

  function css() {
    if (d.getElementById(CSS_ID)) return;
    var s = d.createElement('style');
    s.id = CSS_ID; s.textContent = CSS;
    (d.head || d.documentElement).appendChild(s);
  }
  function host() {
    var h = d.getElementById(HOST_ID);
    if (!h) {
      h = d.createElement('div');
      h.id = HOST_ID;
      h.setAttribute('aria-live', 'polite');
      d.body.appendChild(h);
    }
    return h;
  }
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  /* ── work out what a plain alert() string actually is ──────
     Order matters: the trouble patterns are checked before the
     cheerful ones, because "Could not claim the prize" contains
     a perfectly happy-looking word.                          */
  function classify(text) {
    var t = String(text || '');
    var fill = t.match(/successfully\s+(bought|sold)\s+([\d,.]+)\s+shares?\s+of\s+([A-Z.\-]{1,8})/i);
    if (fill) {
      return {
        kind: fill[1].toLowerCase() === 'sold' ? 'sell' : 'trade',
        side: fill[1].toLowerCase(),
        shares: fill[2],
        ticker: fill[3].toUpperCase()
      };
    }
    if (/\b(insufficient|not enough|only hold|nothing left|could not|couldn't|failed|invalid|unable|no live price|denied|already|locked|full|must|please|need to|only the host|first\.)/i.test(t))
      return { kind: 'error' };
    if (/\b(success|successfully|submitted|unlocked|complete|completed|saved|sent|welcome|congrat)/i.test(t))
      return { kind: 'success' };
    return { kind: 'info' };
  }

  function dismiss(el) {
    if (!el || el.dataset.going) return;
    el.dataset.going = '1';
    el.classList.add('ft-out');
    setTimeout(function () { el.remove(); }, 240);
  }

  function notify(opt) {
    opt = opt || {};
    if (typeof opt === 'string') opt = { message: opt };
    css();

    var kind = opt.kind || 'info';
    if (kind === 'trade' && opt.side === 'sell') kind = 'sell';
    var tone = TONE[kind] || TONE.info;
    var isFill = (kind === 'trade' || kind === 'sell');

    var el = d.createElement('div');
    el.className = 'ft-note';
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    el.style.setProperty('--ft-c', opt.color || tone.c);

    var kick = esc(opt.title || tone.kick);
    var msg  = opt.message;
    if (isFill && !msg) {
      // Keyed off `kind`, not `side`. classify() hands back the verb it found
      // in the sentence — "sold" — which never equalled the 'sell' this was
      // comparing against, so every sale claimed to have been a purchase.
      msg = (kind === 'sell' ? 'Sold from' : 'Added to') + ' your portfolio.';
    }

    var html =
      '<span class="ft-note-ico"><svg viewBox="0 0 24 24" aria-hidden="true">' +
        (ICONS[kind] || ICONS.info) + '</svg></span>' +
      '<div class="ft-note-body">' +
        '<div class="ft-note-kick">' + kick + '</div>';

    if (isFill && opt.ticker) {
      html +=
        '<div class="ft-note-fill">' +
          '<span class="ft-note-qty">' + esc(opt.shares) + '</span>' +
          '<span class="ft-note-unit">' +
            (String(opt.shares) === '1' ? 'share' : 'shares') + '</span>' +
          '<span class="ft-note-tick">' + esc(opt.ticker) + '</span>' +
        '</div>';
      if (msg) html += '<div class="ft-note-msg" style="margin-top:4px">' + esc(msg) + '</div>';
    } else {
      html += '<div class="ft-note-msg">' + esc(msg) + '</div>';
    }

    html +=
      '</div>' +
      '<button class="ft-note-x" aria-label="Dismiss">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
        'stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';

    var hold = opt.hold != null ? opt.hold : (HOLD[kind] || 3400);
    if (hold) html += '<span class="ft-note-bar" style="animation-duration:' + hold + 'ms"></span>';

    el.innerHTML = html;
    el.querySelector('.ft-note-x').addEventListener('click', function () { dismiss(el); });

    var h = host();
    h.appendChild(el);

    // Never let a burst of messages bury the screen. This has to iterate a
    // fixed snapshot: dismiss() only *starts* the exit animation and removes
    // the node ~240ms later, so a `while (children.length > 3)` spun forever
    // waiting for a count that couldn't drop until the loop released the
    // thread — and took the page down with it.
    var kids = Array.prototype.slice.call(h.children);
    for (var i = 0; i < kids.length - 3; i++) dismiss(kids[i]);

    if (hold) {
      var timer = setTimeout(function () { dismiss(el); }, hold);
      // pause the countdown while it's being read
      el.addEventListener('mouseenter', function () {
        clearTimeout(timer);
        var bar = el.querySelector('.ft-note-bar');
        if (bar) bar.style.animationPlayState = 'paused';
      });
      el.addEventListener('mouseleave', function () {
        var bar = el.querySelector('.ft-note-bar');
        if (bar) bar.style.animationPlayState = 'running';
        timer = setTimeout(function () { dismiss(el); }, 1400);
      });
    }
    return el;
  }

  /* ── the alert() replacement ───────────────────────────────
     Same one-argument signature, so no call site has to change.
     Returns undefined like the original. It does NOT block, but
     nothing in the app relied on that (no alert is followed by a
     navigation or a confirm).                                */
  function ftAlert(text) {
    var msg = (text == null) ? '' : String(text);
    if (!msg.trim()) return;

    // A double-fired handler shouldn't stack two identical cards.
    var now = Date.now();
    if (recent[msg] && now - recent[msg] < 1200) return;
    recent[msg] = now;

    var c = classify(msg);
    notify({
      kind: c.kind, side: c.side, ticker: c.ticker, shares: c.shares,
      message: c.ticker ? null : msg
    });
  }

  w.FT = w.FT || {};
  w.FT.notify  = notify;
  w.FT.alert   = ftAlert;
  w.FT.success = function (m, o) { return notify(Object.assign({ kind: 'success', message: m }, o || {})); };
  w.FT.error   = function (m, o) { return notify(Object.assign({ kind: 'error',   message: m }, o || {})); };
  w.FT.info    = function (m, o) { return notify(Object.assign({ kind: 'info',    message: m }, o || {})); };
  w.FT.nativeAlert = w.alert.bind(w);

  w.alert = ftAlert;
})(window, document);
