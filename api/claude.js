import { guard, MODEL_FALLBACK, checkGuestLimit, incrementGuestUsage, getGuestRemaining } from "./_guard.js";
import { extractUserId, checkOrgUsage, incrementUsage, incrementMaxUsage, logTokenUsage } from "./_usage.js";

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

  // Guest usage limit — 2 calls total
  if (req._isGuest) {
    const xff = req.headers["x-forwarded-for"];
    const ip = req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim()
             || (xff ? xff.split(",").pop().trim() : "")
             || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
    if (!checkGuestLimit(ip)) {
      return res.status(402).json({
        error: { type: "guest_limit_exceeded", message: "You've used your 3 free runs. Create a free account to continue." },
        guest_remaining: 0,
      });
    }
    incrementGuestUsage(ip);
    const remaining = getGuestRemaining(ip);
    res.setHeader("x-guest-remaining", String(remaining));
  }

  // Usage limit enforcement for billable runs.
  // x-billable-run: "1" = standard run (Haiku)
  // x-billable-max: "1" = Max run (Opus) — also counts as a standard run
  const isBillable = req.headers["x-billable-run"] === "1";
  const isBillableMax = req.headers["x-billable-max"] === "1";
  let usageOrgId = null;
  let isMaxRun = false;

  if (isBillable || isBillableMax) {
    const userId = extractUserId(req);
    if (userId) {
      const usage = await checkOrgUsage(userId, { isMax: isBillableMax });
      if (!usage.allowed) {
        const errType = usage.reason === "max_not_available" ? "max_not_available"
          : usage.reason === "max_limit_exceeded" ? "max_limit_exceeded"
          : "usage_limit_exceeded";
        return res.status(402).json({
          error: { type: errType, message: usage.message || `Plan limit reached` },
          run_count: usage.run_count,
          run_limit: usage.run_limit,
          max_run_count: usage.max_run_count,
          max_run_limit: usage.max_run_limit,
        });
      }
      usageOrgId = usage.org_id;
      isMaxRun = isBillableMax;
    }
  }

  let response = await callAnthropic(body);
  let usedFallback = false;

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

  // Log token usage for cost tracking
  if (response.status >= 200 && response.status < 300 && data.usage) {
    const userId = extractUserId(req);
    const webSearches = (data.content || []).filter(b => b.type === "web_search_tool_result").length;
    logTokenUsage({
      userId,
      orgId: usageOrgId,
      model: data.model || body.model,
      inputTokens: (data.usage.input_tokens || 0) + (data.usage.cache_creation_input_tokens || 0) + (data.usage.cache_read_input_tokens || 0),
      outputTokens: data.usage.output_tokens || 0,
      webSearches,
      endpoint: "claude",
    });
  }

  // Increment usage after successful response
  if (usageOrgId && response.status >= 200 && response.status < 300) {
    if (isMaxRun) {
      incrementMaxUsage(usageOrgId).catch(() => {});
    } else {
      incrementUsage(usageOrgId).catch(() => {});
    }
  }

  res.status(response.status).json(data);
}
