// api/cron-reset-tokens.js
//
// Monthly token reset — resets run_count and max_run_count to 0 for all orgs.
// Triggered by Vercel Cron on the 1st of each month at midnight UTC.
//
// Security: requires CRON_SECRET header to prevent unauthorized calls.

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  // Only allow GET (Vercel Cron sends GET requests)
  if (req.method !== "GET") return res.status(405).end();

  // Verify the request is from Vercel Cron
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!SB_KEY || !SB_URL) {
    return res.status(500).json({ error: "Not configured" });
  }

  try {
    // Reset all org token counters to 0
    const response = await fetch(`${SB_URL}/rest/v1/orgs?run_count=gt.0`, {
      method: "PATCH",
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ run_count: 0, max_run_count: 0 }),
    });

    const updated = await response.json();
    const count = Array.isArray(updated) ? updated.length : 0;

    // Log the reset to api_usage_log for audit trail
    await fetch(`${SB_URL}/rest/v1/api_usage_log`, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: "system",
        model: "cron-monthly-reset",
        input_tokens: 0,
        output_tokens: 0,
        web_searches: 0,
        endpoint: "cron-reset-tokens",
      }),
    });

    console.log(`[cron] Monthly token reset: ${count} orgs reset to 0`);
    res.status(200).json({ ok: true, orgs_reset: count, timestamp: new Date().toISOString() });
  } catch (e) {
    console.error("[cron] Token reset failed:", e.message);
    res.status(500).json({ error: "Reset failed", message: e.message });
  }
}
