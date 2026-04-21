import { guard, MODEL_FALLBACK } from "./_guard.js";
import { extractUserId, checkOrgUsage, incrementUsage } from "./_usage.js";

export const config = { maxDuration: 120 };

const ANTHROPIC_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": process.env.ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
};

async function callAnthropic(body) {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: ANTHROPIC_HEADERS,
    body: JSON.stringify(body),
  });
}

export default async function handler(req, res) {
  const body = guard(req, res, { stream: true });
  if (!body) return;

  // Usage limit enforcement — same as api/claude.js
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

  // Server-side fallback on 529 — same behavior as api/claude.js. Has to
  // happen BEFORE we start writing the SSE stream to the client; once we
  // start streaming we can't switch models mid-flight.
  if (response.status === 529 && MODEL_FALLBACK[body.model]) {
    const fallbackModel = MODEL_FALLBACK[body.model];
    console.log(`[fallback-stream] ${body.model} -> ${fallbackModel} (529 from Anthropic)`);
    response = await callAnthropic({ ...body, model: fallbackModel });
    res.setHeader("x-fallback-model", fallbackModel);
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(decoder.decode(value));
  }

  // Increment usage after successful stream
  if (usageOrgId) {
    incrementUsage(usageOrgId).catch(() => {});
  }

  res.end();
}
