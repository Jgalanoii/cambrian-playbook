// api/test-model.js — Diagnostic endpoint to test model availability
// GET /api/test-model?model=claude-opus-4-6
// Returns the exact Anthropic response or error. No guard, no proxy logic.
// DELETE THIS FILE after diagnosing the Opus issue.

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  // Temporary: auth via query param so we can test from browser
  if (req.query.key !== "cambrian-diag-2026") {
    return res.status(401).json({ error: "unauthorized — add ?key=cambrian-diag-2026" });
  }

  const model = req.query.model || "claude-opus-4-6";
  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    const start = Date.now();
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "interleaved-thinking-2025-05-14",
      },
      body: JSON.stringify({
        model,
        max_tokens: 50,
        temperature: 0,
        top_k: 1,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 1 }],
        messages: [{ role: "user", content: "What does neocurrency.com do? One sentence." }],
      }),
    });

    const elapsed = Date.now() - start;
    const data = await r.json();

    res.json({
      model,
      http_status: r.status,
      elapsed_ms: elapsed,
      anthropic_type: data.type,
      error: data.error || null,
      stop_reason: data.stop_reason || null,
      usage: data.usage || null,
      content_types: (data.content || []).map(b => b.type),
    });
  } catch (e) {
    res.json({ model, error: e.message, stack: e.stack?.split("\n").slice(0, 3) });
  }
}
