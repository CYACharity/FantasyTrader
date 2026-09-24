/* ============================================================
 *  BACK — every back arrow goes to the screen you actually came
 *  from.
 *
 *  A route stack for this tab lives in sessionStorage. Each page
 *  pushes itself on arrival; arriving at the page just below the
 *  top counts as going back and pops instead, so the browser's own
 *  Back button, an in-app back link and a plain link to the parent
 *  all keep the stack honest. (history.back() alone ping-pongs:
 *  league room → Back → leagues → Back → league room again.)
 *
 *  The menu (dashboard) is the root and resets the stack; the
 *  landing and sign-up pages clear it. A back link with data-back
 *  goes to the previous entry, or to its own href when you arrived
 *  cold (bookmark, new tab, shared link).
 * ============================================================ */
(function () {
    'use strict';
    const KEY = 'ftNavStack';
    const clean = (u) => {
        try {
            const x = new URL(u, location.href);
            ['v', 'a', 'b', 'x', 'n', 'z'].forEach(k => x.searchParams.delete(k));   // cache-busters are not places
            return x.pathname.split('/').pop() + (x.search || '');
        } catch (e) { return String(u || ''); }
    };
    const here = clean(location.href);
    const file = here.split('?')[0];
    let st = [];
    try { st = JSON.parse(sessionStorage.getItem(KEY) || '[]') || []; } catch (e) { st = []; }

    if (/^(dashboard\.html)$/.test(file)) st = [here];
    else if (!file || /^(index|signup|login)\.html$/.test(file)) st = [];
    else if (st[st.length - 1] === here) { /* a reload */ }
    else if (st[st.length - 2] === here) st.pop();            // came back
    else {
        const at = st.lastIndexOf(here);
        if (at >= 0 && st.length - at <= 4) st = st.slice(0, at + 1);   // a short loop back to somewhere recent
        else st.push(here);
    }
    if (st.length > 40) st = st.slice(-40);
    try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}

    window.FTBack = {
        previous: () => st.length > 1 ? st[st.length - 2] : null,
        go(fallback) { location.href = this.previous() || fallback || 'dashboard.html'; },
    };

    document.addEventListener('click', function (e) {
        const a = e.target.closest && e.target.closest('[data-back]');
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
        const prev = window.FTBack.previous();
        if (!prev) return;                      // arrived cold: the link's own href
        e.preventDefault();
        location.href = prev;
    }, true);
})();
