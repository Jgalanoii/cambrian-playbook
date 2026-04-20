#!/usr/bin/env node
// Quick smoke test: run p1 (overview) with web_search for a well-known company
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const name of [".env.local", ".env"]) {
  const p = path.join(ROOT, name);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1);
      process.env[m[1]] = val;  // always override — shell env may be stale
    }
  }
}

const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { console.error("No ANTHROPIC_API_KEY"); process.exit(1); }

async function call(body) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 2000, temperature: 0, ...body }),
  });
  return r.json();
}

function extractJson(text, key) {
  const clean = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
  const anchor = clean.indexOf(`"${key}"`);
  if (anchor === -1) return null;
  let start = anchor;
  while (start > 0 && clean[start] !== "{") start--;
  if (clean[start] !== "{") return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < clean.length; i++) {
    const ch = clean[i];
    if (esc) { esc = false; continue; }
    if (ch === "\\") { esc = true; continue; }
    if (inStr) { if (ch === '"') inStr = false; continue; }
    if (ch === '"') { inStr = true; continue; }
    if (ch === "{") depth++;
    if (ch === "}") { depth--; if (depth === 0) { try { return JSON.parse(clean.slice(start, i + 1)); } catch { return null; } } }
  }
  return null;
}

const TARGETS = ["Walmart", "State Farm", "Deloitte", "Stripe"];

async function testP1(company) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`P1 OVERVIEW: ${company}`);
  console.log("=".repeat(60));
  const d = await call({
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 1 }],
    messages: [{ role: "user", content:
      `Sales brief about TARGET PROSPECT "${company}" for seller at tillo.io.\n` +
      `RULE: All fields describe ${company} NOT the seller. ASCII only. Empty string if unknown.\n` +
      `ACCURACY: NEVER invent facts. Use training knowledge confidently for well-known companies.\n\n` +
      `Search for "${company}" to get current, accurate company data.\n\n` +
      `Return ONLY raw JSON:\n` +
      `{"companySnapshot":"3-4 sentences: what they do, market position, recent moves","revenue":"most recent","publicPrivate":"","employeeCount":"","headquarters":"","founded":"","website":"","linkedIn":"","fundingProfile":"","competitors":["","",""],"watchOuts":["Procurement risk","Incumbent risk","Stage credibility"]}`
    }],
  });
  if (d.error) { console.log("ERROR:", JSON.stringify(d.error)); return null; }
  const texts = (d.content || []).filter(b => b.type === "text").map(b => b.text || "");
  let parsed = null;
  for (let i = texts.length - 1; i >= 0 && !parsed; i--) {
    parsed = extractJson(texts[i], "companySnapshot");
  }
  if (!parsed) {
    const raw = texts.join("").trim();
    try { parsed = JSON.parse(raw.startsWith("{") ? raw : "{" + raw); } catch {}
  }
  if (parsed) {
    console.log("companySnapshot:", (parsed.companySnapshot || "").slice(0, 200));
    console.log("revenue:", parsed.revenue);
    console.log("publicPrivate:", parsed.publicPrivate);
    console.log("employeeCount:", parsed.employeeCount);
    console.log("headquarters:", parsed.headquarters);
    console.log("competitors:", JSON.stringify(parsed.competitors));
    console.log("watchOuts:", JSON.stringify((parsed.watchOuts || []).map(w => w.slice(0, 60))));
    const filled = Object.entries(parsed).filter(([k, v]) => v && (typeof v === "string" ? v.trim() : Array.isArray(v) ? v.filter(Boolean).length : true)).length;
    console.log(`\nFIELDS FILLED: ${filled}/${Object.keys(parsed).length}`);
  } else {
    console.log("PARSE FAILED. Raw:", texts[texts.length - 1]?.slice(0, 300));
  }
  return parsed;
}

console.log("Brief P1 Smoke Test — testing with web_search");
console.log("Targets:", TARGETS.join(", "));

for (const t of TARGETS) {
  await testP1(t);
}
console.log("\nDone.");
