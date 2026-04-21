import { guard, MODEL_FALLBACK } from "./_guard.js";
import { extractUserId, checkOrgUsage, incrementUsage } from "./_usage.js";

const ANTHROPIC_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": process.env.ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-beta": "interleaved-thinking-2025-05-14",
};

async function callAnthropic(body) {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: ANTHROPIC_HEADERS,
    body: JSON.stringify(body),
  });
}

export default async function handler(req, res) {
  const body = guard(req, res, { stream: false });
  if (!body) return;

  // Usage limit enforcement for billable runs (brief generation).
  // Client sends x-billable-run: 1 on the first micro-call of each brief.
  let usageOrgId = null;
  if (req.headers["x-billable-run"] === "1") {
    const userId = extractUserId(req);
    if (userId) {
      const usage = await checkOrgUsage(userId);
      if (!usage.allowed) {
        return res.status(402).json({
          error: { type: "usage_limit_exceeded", message: `Plan limit reached (${usage.run_count}/${usage.run_limit} runs used)` },
          run_count: usage.run_count,
          run_limit: usage.run_limit,
        });
      }
      usageOrgId = usage.org_id;
    }
  }

  let response = await callAnthropic(body);
  let usedFallback = false;

  // Server-side fallback: on 529 (overloaded), retry once with the mapped
  // fallback model. Lets us stay operational through Haiku capacity blips
  // at the cost of ~3x token rate for that single request. Client sees
  // "x-fallback-model" response header and can surface that if desired.
  if (response.status === 529 && MODEL_FALLBACK[body.model]) {
    const fallbackModel = MODEL_FALLBACK[body.model];
    console.log(`[fallback] ${body.model} -> ${fallbackModel} (529 from Anthropic)`);
    response = await callAnthropic({ ...body, model: fallbackModel });
    usedFallback = true;
    res.setHeader("x-fallback-model", fallbackModel);
  }

  const data = await response.json();
  if (usedFallback) {
    data._fallbackModel = MODEL_FALLBACK[body.model];
  }

  // Increment usage counter after successful Anthropic response
  if (usageOrgId && response.status >= 200 && response.status < 300) {
    incrementUsage(usageOrgId).catch(() => {}); // fire-and-forget
  }

  res.status(response.status).json(data);
}
