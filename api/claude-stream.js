import { guard, MODEL_FALLBACK } from "./_guard.js";

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
  res.end();
}
