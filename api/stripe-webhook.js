// api/stripe-webhook.js
//
// Stripe webhook handler — automatically upgrades org plan/limits
// after successful checkout. Handles:
// - checkout.session.completed (initial subscription)
// - customer.subscription.updated (plan changes)
// - customer.subscription.deleted (cancellation)

import { createHmac } from "crypto";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

// Plan config — same as checkout.js
const PLAN_LIMITS = {
  starter:    { run_limit: 25,   max_run_limit: 5 },
  pro:        { run_limit: 100,  max_run_limit: 20 },
  team:       { run_limit: 250,  max_run_limit: 50 },
  enterprise: { run_limit: 1000, max_run_limit: 200 },
};

// Stripe sends raw body — need to verify signature
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function verifyStripeSignature(rawBody, signature) {
  if (!STRIPE_WEBHOOK_SECRET) return true; // Skip in dev
  const elements = signature.split(",").reduce((acc, part) => {
    const [key, val] = part.split("=");
    acc[key] = val;
    return acc;
  }, {});
  const timestamp = elements.t;
  const expectedSig = elements.v1;
  if (!timestamp || !expectedSig) return false;

  const payload = `${timestamp}.${rawBody}`;
  const computed = createHmac("sha256", STRIPE_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return computed === expectedSig;
}

async function updateOrg(orgId, planId) {
  if (!orgId || !planId || !PLAN_LIMITS[planId]) return;
  const limits = PLAN_LIMITS[planId];

  await fetch(`${SB_URL}/rest/v1/orgs?id=eq.${orgId}`, {
    method: "PATCH",
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      plan: "paid",
      run_limit: limits.run_limit,
      max_run_limit: limits.max_run_limit,
      run_count: 0, // Reset on upgrade
    }),
  });

  console.log(`[stripe] Upgraded org ${orgId} to ${planId}: ${limits.run_limit} runs, ${limits.max_run_limit} max`);
}

async function downgradeOrg(orgId) {
  if (!orgId) return;

  await fetch(`${SB_URL}/rest/v1/orgs?id=eq.${orgId}`, {
    method: "PATCH",
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      plan: "trial",
      run_limit: 3,
      max_run_limit: 0,
    }),
  });

  console.log(`[stripe] Downgraded org ${orgId} to trial`);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await getRawBody(req);
  const signature = req.headers["stripe-signature"];

  if (!verifyStripeSignature(rawBody.toString(), signature)) {
    console.warn("[stripe] Invalid webhook signature");
    return res.status(400).json({ error: "Invalid signature" });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orgId = session.metadata?.org_id;
        const planId = session.metadata?.plan_id;
        console.log(`[stripe] Checkout completed: org=${orgId}, plan=${planId}`);
        await updateOrg(orgId, planId);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const orgId = sub.metadata?.org_id;
        const planId = sub.metadata?.plan_id;
        if (sub.status === "active" && orgId && planId) {
          console.log(`[stripe] Subscription updated: org=${orgId}, plan=${planId}`);
          await updateOrg(orgId, planId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const orgId = sub.metadata?.org_id;
        console.log(`[stripe] Subscription cancelled: org=${orgId}`);
        await downgradeOrg(orgId);
        break;
      }

      default:
        // Ignore other event types
        break;
    }
  } catch (e) {
    console.error("[stripe] Webhook processing error:", e.message);
    return res.status(500).json({ error: "Processing failed" });
  }

  res.json({ received: true });
}
