// ============================================================
//  FANTASYTRADER — weekly settlement runner
//
//  Calls ft_settle_all(), which:
//    • decides every finished week's matchups and pays the winners
//    • auto-liquidates from anyone whose transfer window has expired
//
//  This has to run on a schedule rather than in the browser: the
//  deadline must bite whether or not a player ever opens the app,
//  and two people loading the page at once must not both collect.
//
//  DEPLOY:   paste as the function's index.ts, Deploy.
//  SCHEDULE: every 10 minutes is plenty (the windows are hours long).
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase.rpc("ft_settle_all");
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, result: data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
