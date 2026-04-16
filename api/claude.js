import { guard, MODEL_FALLBACK } from "./_guard.js";

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
    // Tag the response body too so downstream callers/loggers can see it
    // without parsing headers. Non-breaking: clients ignore unknown keys.
    data._fallbackModel = MODEL_FALLBACK[body.model];
  }
  res.status(response.status).json(data);
}
