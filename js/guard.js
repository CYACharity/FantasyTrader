/* ============================================================
 *  STOCKS LEAGUE — auth guard (v2)
 *  Uses the LOCALLY stored session (no network call), so a flaky
 *  connection can never bounce a signed-in user to the login
 *  page. Redirects only when Supabase is configured and there is
 *  genuinely no session on this device.
 * ============================================================ */
(async function () {
  try {
    if (!window.SL || !SL.configured) return;      // demo mode → allow
    const { data } = await SL.client.auth.getSession();   // local read only
    if (!data || !data.session) {
      try {
        const dest = location.pathname.split("/").pop() + location.search;
        sessionStorage.setItem("sl_after_login", dest);
      } catch (e) { /* ignore */ }
      location.replace("signup.html");
    }
  } catch (e) {
    // On any unexpected error, do NOT lock the user out.
    console.warn("Auth guard skipped:", e);
  }
})();
