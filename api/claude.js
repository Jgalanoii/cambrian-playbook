import { guard } from "./_guard.js";

export default async function handler(req, res) {
  const body = guard(req, res, { stream: false });
  if (!body) return; // guard already sent the response

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "interleaved-thinking-2025-05-14",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
