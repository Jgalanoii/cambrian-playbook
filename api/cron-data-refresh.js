// api/cron-data-refresh.js
//
// Weekly data freshness check — flags stale RFPs, briefs, and data.
// Triggered by Vercel Cron every Monday at 8 AM UTC (3 AM EST).
//
// Actions:
//   1. Mark RFP results with past deadlines as expired
//   2. Flag briefs > 30 days old in account_outputs
//   3. Log freshness stats for monitoring

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return res.status(500).json({ error: "Cron not configured" });
  if (req.headers.authorization !== `Bearer ${cronSecret}`) return res.status(401).json({ error: "Unauthorized" });

  if (!SB_KEY || !SB_URL) return res.status(500).json({ error: "Not configured" });

  const headers = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };
  const stats = { expiredRfps: 0, staleBriefs: 0, errors: [] };

  try {
    // 1. Mark RFPs with past deadlines as expired
    const today = new Date().toISOString().slice(0, 10);
    const rfpRes = await fetch(`${SB_URL}/rest/v1/rfp_intel_signals?deadline=lt.${today}&user_dismissed=eq.false&select=id`, {
      headers,
    });
    if (rfpRes.ok) {
      const expiredRfps = await rfpRes.json();
      stats.expiredRfps = expiredRfps.length;
      if (expiredRfps.length > 0) {
        // Batch mark as dismissed (deadline passed)
        const ids = expiredRfps.map(r => r.id);
        for (let i = 0; i < ids.length; i += 50) {
          const batch = ids.slice(i, i + 50);
          await fetch(`${SB_URL}/rest/v1/rfp_intel_signals?id=in.(${batch.join(",")})`, {
            method: "PATCH",
            headers: { ...headers, Prefer: "return=minimal" },
            body: JSON.stringify({ user_dismissed: true }),
          });
        }
      }
    }

    // 2. Count stale briefs (> 30 days old)
    const cutoff = new Date(Date.now() - 30 * 86400000).toISOString();
    const briefRes = await fetch(`${SB_URL}/rest/v1/account_outputs?output_type=eq.brief&is_latest=eq.true&created_at=lt.${cutoff}&select=id`, {
      headers,
    });
    if (briefRes.ok) {
      const staleBriefs = await briefRes.json();
      stats.staleBriefs = staleBriefs.length;
    }

    // 3. Clean up orphan orgs (no members) — prevents accumulation over time
    stats.orphanOrgs = 0;
    try {
      const orphanRes = await fetch(`${SB_URL}/rest/v1/rpc/cleanup_orphan_orgs`, {
        method: "POST",
        headers,
        body: "{}",
      });
      if (orphanRes.ok) {
        const result = await orphanRes.json();
        stats.orphanOrgs = result?.deleted || 0;
      }
    } catch { /* non-critical — orphan cleanup can fail silently */ }

    console.log(`[cron-data-refresh] Complete: ${stats.expiredRfps} expired RFPs, ${stats.staleBriefs} stale briefs, ${stats.orphanOrgs} orphan orgs cleaned`);
    return res.json({ ok: true, ...stats, timestamp: new Date().toISOString() });
  } catch (e) {
    console.error("[cron-data-refresh] Error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
