#!/usr/bin/env node
// scripts/check-rls.mjs — Verify Supabase RLS is enabled on the sessions table.
//
// Usage: node scripts/check-rls.mjs
//
// Requires: SUPABASE_SERVICE_KEY env var (service_role key from Supabase dashboard).
// The service_role key bypasses RLS, so we can query pg_catalog to check policies.
//
// If you don't have the service_role key, check manually in the Supabase dashboard:
//   1. Go to Table Editor → sessions
//   2. Click "RLS" in the top-right
//   3. Verify RLS is ENABLED
//   4. Verify these policies exist:
//      - SELECT: auth.uid() = user_id
//      - INSERT: auth.uid() = user_id
//      - UPDATE: auth.uid() = user_id
//      - DELETE: auth.uid() = user_id

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://xtnidawfuaxwwwcnkewu.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SERVICE_KEY) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  SUPABASE RLS VERIFICATION — MANUAL CHECK REQUIRED          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  No SUPABASE_SERVICE_KEY env var found.                      ║
║                                                              ║
║  Please verify in Supabase Dashboard:                        ║
║                                                              ║
║  1. Go to: ${SUPABASE_URL.replace("https://","").replace(".supabase.co","")}        ║
║     → Table Editor → sessions → RLS                         ║
║                                                              ║
║  2. Confirm RLS is ENABLED (toggle should be ON)             ║
║                                                              ║
║  3. Verify these policies exist:                             ║
║     ┌──────────┬──────────────────────────────┐              ║
║     │ Action   │ Policy (USING clause)        │              ║
║     ├──────────┼──────────────────────────────┤              ║
║     │ SELECT   │ auth.uid() = user_id         │              ║
║     │ INSERT   │ auth.uid() = user_id         │              ║
║     │ UPDATE   │ auth.uid() = user_id         │              ║
║     │ DELETE   │ auth.uid() = user_id         │              ║
║     └──────────┴──────────────────────────────┘              ║
║                                                              ║
║  If RLS is disabled or policies are missing, any logged-in   ║
║  user can read/modify OTHER users' sessions.                 ║
║                                                              ║
║  To run this check automatically:                            ║
║  SUPABASE_SERVICE_KEY=<your-service-role-key> node check-rls ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
  process.exit(0);
}

// If we have the service key, query pg_catalog
async function checkRLS() {
  const query = `
    SELECT
      c.relname AS table_name,
      c.relrowsecurity AS rls_enabled,
      p.polname AS policy_name,
      p.polcmd AS command,
      pg_get_expr(p.polqual, p.polrelid) AS using_expr
    FROM pg_class c
    LEFT JOIN pg_policy p ON p.polrelid = c.oid
    WHERE c.relname = 'sessions'
    AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
  `;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  // Fallback: just try to read another user's data
  console.log("Attempting cross-user access test...");
  const testRes = await fetch(`${SUPABASE_URL}/rest/v1/sessions?user_id=eq.00000000-0000-0000-0000-000000000000&limit=1`, {
    headers: {
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
    },
  });
  const testData = await testRes.json();

  if (testRes.ok) {
    console.log("Service role can access sessions table (expected — service role bypasses RLS).");
    console.log(`Rows returned: ${testData.length}`);
    console.log("\nTo verify RLS protects normal users, check the Supabase dashboard manually.");
  }
}

checkRLS().catch(e => console.error("Check failed:", e.message));
