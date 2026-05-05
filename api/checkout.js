// api/checkout.js
//
// Creates a Stripe Checkout session for plan upgrades.
// POST { priceId, planId } with JWT → returns checkout URL.

import { verifyJwt, decodeJwtPayload, isAllowedOrigin, checkRateLimit } from "./_guard.js";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.VITE_APP_URL || "https://www.cambriancatalyst.ai";
const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

// Plan config — maps planId to run limits
const PLAN_LIMITS = {
  starter:    { run_limit: 25,   max_run_limit: 5 },
  pro:        { run_limit: 100,  max_run_limit: 20 },
  team:       { run_limit: 250,  max_run_limit: 50 },
  enterprise: { run_limit: 1000, max_run_limit: 200 },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!STRIPE_SECRET) return res.status(500).json({ error: "Stripe not configured" });

  // Origin check
  const origin = req.headers.origin || req.headers.referer || "";
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });

  // Rate limiting
  const xff = req.headers["x-forwarded-for"];
  const ip = req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim()
           || (xff ? xff.split(",").pop().trim() : "")
           || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) return res.status(429).json({ error: "Too many requests" });

  // Auth
  if (!verifyJwt(req)) return res.status(401).json({ error: "Authentication required" });
  const authToken = (req.headers.authorization || "").slice(7);
  const payload = decodeJwtPayload(authToken);
  if (!payload?.sub) return res.status(401).json({ error: "Authentication required" });

  const { priceId, planId } = req.body || {};
  if (!priceId || !planId) return res.status(400).json({ error: "priceId and planId required" });
  if (!PLAN_LIMITS[planId]) return res.status(400).json({ error: "Invalid plan" });

  // Get user email and org
  let userEmail = "";
  let orgId = "";
  try {
    const userRes = await fetch(`${SB_URL}/rest/v1/users?id=eq.${payload.sub}&select=email,org_id`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    });
    const users = await userRes.json();
    userEmail = users?.[0]?.email || "";
    orgId = users?.[0]?.org_id || "";
  } catch {}

  try {
    // Create Stripe Checkout session
    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("payment_method_types[0]", "card");
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${APP_URL}?checkout=success&plan=${planId}`);
    params.append("cancel_url", `${APP_URL}?checkout=cancel`);
    if (userEmail) params.append("customer_email", userEmail);
    // Store metadata for webhook
    params.append("metadata[user_id]", payload.sub);
    params.append("metadata[org_id]", orgId);
    params.append("metadata[plan_id]", planId);
    params.append("subscription_data[metadata][user_id]", payload.sub);
    params.append("subscription_data[metadata][org_id]", orgId);
    params.append("subscription_data[metadata][plan_id]", planId);

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();
    if (session.error) return res.status(400).json({ error: session.error.message });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
