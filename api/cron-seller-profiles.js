// api/cron-seller-profiles.js
//
// Weekly batch job to aggregate seller intelligence into seller_profiles.
// Computes: total briefs, prospects scored, deals advanced/DQ'd, avg fit scores,
// ICP characteristics, and prediction accuracy.
//
// Triggered by Vercel Cron: Monday 9 AM UTC (4 AM EST) — after data-refresh.

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return res.status(500).json({ error: "Cron not configured" });
  if (req.headers.authorization !== `Bearer ${cronSecret}`) return res.status(401).json({ error: "Unauthorized" });

  if (!SB_KEY || !SB_URL) return res.status(500).json({ error: "Not configured" });

  const headers = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };
  const stats = { orgsProcessed: 0, errors: [] };

  try {
    // Get all orgs with a seller_url
    const orgsRes = await fetch(`${SB_URL}/rest/v1/orgs?seller_url=neq.&seller_url=not.is.null&select=id,seller_url,name,icp`, { headers });
    if (!orgsRes.ok) return res.status(500).json({ error: "Failed to fetch orgs" });
    const orgs = await orgsRes.json();

    for (const org of orgs) {
      try {
        // Count briefs
        const briefsRes = await fetch(`${SB_URL}/rest/v1/account_outputs?org_id=eq.${org.id}&output_type=eq.brief&is_latest=eq.true&select=id`, { headers });
        const briefs = briefsRes.ok ? await briefsRes.json() : [];

        // Count fit scores
        const scoresRes = await fetch(`${SB_URL}/rest/v1/account_outputs?org_id=eq.${org.id}&output_type=eq.fit_score&is_latest=eq.true&select=fit_score,fit_label`, { headers });
        const scores = scoresRes.ok ? await scoresRes.json() : [];

        // Count prospect events
        const eventsRes = await fetch(`${SB_URL}/rest/v1/prospect_events?org_id=eq.${org.id}&select=event_type`, { headers });
        const events = eventsRes.ok ? await eventsRes.json() : [];

        const advanced = events.filter(e => e.event_type === "advanced").length;
        const dqd = events.filter(e => e.event_type === "disqualified").length;
        const advancedScores = scores.filter(s => s.fit_label === "Strong Fit").map(s => s.fit_score).filter(Boolean);
        const dqScores = scores.filter(s => s.fit_score && s.fit_score < 55).map(s => s.fit_score);

        // Extract ICP characteristics
        const icp = org.icp?.icp || org.icp || {};
        const primaryIndustries = icp.industries || [];
        const companySizeTarget = icp.companySize || "";
        const lobCount = (icp.linesOfBusiness || []).length;
        const namedCustomerCount = (icp.customerExamples || []).length + (icp.namedCustomerProfiles || []).length;

        // Check prediction accuracy (from model_accuracy_log)
        const accuracyRes = await fetch(`${SB_URL}/rest/v1/model_accuracy_log?seller_url=eq.${encodeURIComponent(org.seller_url)}&select=predicted,actual`, { headers });
        const predictions = accuracyRes.ok ? await accuracyRes.json() : [];
        const correct = predictions.filter(p => p.predicted === p.actual).length;
        const predictionAccuracy = predictions.length >= 3 ? Math.round((correct / predictions.length) * 100) : null;

        // Upsert seller_profile
        await fetch(`${SB_URL}/rest/v1/seller_profiles?org_id=eq.${org.id}`, {
          method: "DELETE", headers: { ...headers, Prefer: "return=minimal" },
        });
        await fetch(`${SB_URL}/rest/v1/seller_profiles`, {
          method: "POST",
          headers: { ...headers, Prefer: "return=minimal" },
          body: JSON.stringify({
            org_id: org.id,
            seller_url: org.seller_url,
            market_category: org.icp?.marketCategory || "",
            seller_stage: icp.salesCycle || "",
            total_briefs: briefs.length,
            total_prospects_scored: scores.length,
            total_deals_advanced: advanced,
            total_deals_dq: dqd,
            avg_fit_score_advanced: advancedScores.length ? Math.round(advancedScores.reduce((a, b) => a + b, 0) / advancedScores.length) : null,
            avg_fit_score_dq: dqScores.length ? Math.round(dqScores.reduce((a, b) => a + b, 0) / dqScores.length) : null,
            primary_industries: primaryIndustries,
            company_size_target: companySizeTarget,
            lob_count: lobCount,
            named_customer_count: namedCustomerCount,
            prediction_accuracy: predictionAccuracy,
            last_calibrated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });

        stats.orgsProcessed++;
      } catch (e) {
        stats.errors.push({ org: org.seller_url, error: e.message });
      }
    }

    console.log(`[cron-seller-profiles] Processed ${stats.orgsProcessed}/${orgs.length} orgs, ${stats.errors.length} errors`);
    return res.json({ ok: true, ...stats, timestamp: new Date().toISOString() });
  } catch (e) {
    console.error("[cron-seller-profiles] Error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
