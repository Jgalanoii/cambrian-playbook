#!/usr/bin/env node
/**
 * Diagnose fit score variance — runs the same company scoring N times
 * and reports per-dimension stability.
 *
 * Usage: node scripts/diagnose-fit-variance.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const name of [".env.local", ".env"]) {
  const p = join(ROOT, name);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1);
      process.env[m[1]] = val;
    }
  }
}

const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { console.error("ANTHROPIC_API_KEY required"); process.exit(1); }

const MODEL = "claude-haiku-4-5-20251001";
const RUNS = 5;

// ── Config: seller and target ─────────────────────────────────────────
const SELLER = {
  name: "Tango Card",
  url: "tangocard.com",
  description: "Digital Rewards & Incentive Payments Platform",
  industries: ["Technology / SaaS", "Education", "Real Estate", "Professional Services"],
  companySize: "500-4,999 employees",
  customers: ["Uber", "Toyota", "Airbnb", "Samsung"],
  competitors: ["Status quo / do nothing", "Tremendous", "Rybbon", "Giftbit", "BHN Rewards"],
};

const TARGET = {
  name: "Duolingo",
  industry: "Education / EdTech",
  url: "duolingo.com",
};

async function callAnthropic(body) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 2000, temperature: 0, ...body }),
  });
  if (!r.ok) throw new Error(`Anthropic ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

function extractJson(text) {
  const clean = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").replace(/<\/?cite[^>]*>/g, "");
  const first = clean.indexOf("{");
  const last = clean.lastIndexOf("}");
  if (first < 0 || last <= first) return null;
  try { return JSON.parse(clean.slice(first, last + 1)); } catch { return null; }
}

const prompt =
  `You are a sales strategist scoring ICP fit. Use THREE dimensions with FIXED-POINT scoring.\n` +
  `CRITICAL: Scores must be DETERMINISTIC. Use the fixed-point tables below.\n\n` +
  `━━━ DIMENSION 1: ICP ALIGNMENT (40 points max) ━━━\n` +
  `STEP A — INDUSTRY: Seller's target industries: [${SELLER.industries.join(", ")}]\n` +
  `  32 = target's industry IS one of the seller's target industries\n` +
  `  26 = DIFFERENT industry but shares buyer persona or problem domain\n` +
  `  20 = no meaningful industry connection\n` +
  `  10 = HIGH-FRICTION INDUSTRY\n\n` +
  `STEP B — SIZE: Seller's target: ${SELLER.companySize}\n` +
  `  +5 = SAME bracket | +2 = ONE bracket away | +0 = 2+ brackets away\n\n` +
  `STEP C — OWNERSHIP: +3 = VC/PE-backed | +1 = private | +0 = public\n\n` +
  `dim1 = Step A + Step B + Step C (clamp 0-40)\n\n` +
  `━━━ DIMENSION 2: CUSTOMER SIMILARITY (30 points max) ━━━\n` +
  `Seller's EXISTING CUSTOMERS: ${SELLER.customers.join(", ")}.\n` +
  `  27 = same industry AND similar size as a named customer\n` +
  `  17 = same industry, different size\n` +
  `  10 = different industry but similar buyer persona\n` +
  `   3 = no meaningful similarity\n\n` +
  `━━━ DIMENSION 3: COMPETITIVE LANDSCAPE (30 points max) ━━━\n` +
  `  26 = you can name the SPECIFIC competitor the target uses from this list: ${SELLER.competitors.join(", ")}\n` +
  `  20 = DEFAULT (uncertain, no known incumbent, or vendor not in list)\n` +
  `  10 = deep platform incumbent with documented deployment\n\n` +
  `TOTAL = dim1 + dim2 + dim3. Return dim1, dim2, dim3 separately.\n` +
  `ALSO return stepA, stepB, stepC values so we can see your work.\n\n` +
  `SELLER: ${SELLER.name} (${SELLER.description}) | ${SELLER.url}\n\n` +
  `COMPANY: ${TARGET.name}|${TARGET.industry}|${TARGET.url}\n\n` +
  `Return ONLY raw JSON:\n` +
  `{"company":"${TARGET.name}","stepA":32,"stepB":5,"stepC":0,"dim1":37,"dim2":27,"dim3":20,"total":84,"reason":"...","customerSimilarity":"...","incumbentRisk":"..."}`;

console.log(`\nFit Score Variance Diagnostic`);
console.log(`Seller: ${SELLER.name} | Target: ${TARGET.name}`);
console.log(`Running ${RUNS} times...\n`);

const results = [];

for (let i = 0; i < RUNS; i++) {
  process.stdout.write(`  Run ${i + 1}/${RUNS}...`);
  try {
    const d = await callAnthropic({
      messages: [{ role: "user", content: prompt }, { role: "assistant", content: "{" }],
    });
    const raw = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const parsed = extractJson("{" + raw);
    if (parsed) {
      const total = (parsed.dim1 || 0) + (parsed.dim2 || 0) + (parsed.dim3 || 0);
      results.push({ ...parsed, total });
      console.log(` dim1=${parsed.dim1} (A=${parsed.stepA} B=${parsed.stepB} C=${parsed.stepC}) dim2=${parsed.dim2} dim3=${parsed.dim3} → TOTAL=${total}`);
    } else {
      console.log(` PARSE FAILED`);
      results.push(null);
    }
  } catch (e) {
    console.log(` ERROR: ${e.message}`);
    results.push(null);
  }
}

// ── Analysis ──────────────────────────────────────────────────────────
const valid = results.filter(Boolean);
if (valid.length < 2) { console.log("\nNot enough results to analyze."); process.exit(1); }

console.log(`\n${"=".repeat(60)}`);
console.log("ANALYSIS");
console.log("=".repeat(60));

const stats = (arr, field) => {
  const vals = arr.map(r => r[field]).filter(v => typeof v === "number");
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const unique = [...new Set(vals)];
  return { min, max, avg: avg.toFixed(1), spread: max - min, unique, stable: unique.length === 1 };
};

for (const field of ["stepA", "stepB", "stepC", "dim1", "dim2", "dim3", "total"]) {
  const s = stats(valid, field);
  const icon = s.stable ? "STABLE" : `VARIANCE ${s.spread}pts`;
  console.log(`  ${field.padEnd(8)} ${s.unique.join(", ").padEnd(20)} [${s.min}-${s.max}] avg=${s.avg} → ${icon}`);
}

const totalSpread = stats(valid, "total").spread;
if (totalSpread === 0) {
  console.log(`\nVERDICT: STABLE — ${valid[0].total}/100 every run. No variance.`);
} else if (totalSpread <= 5) {
  console.log(`\nVERDICT: MINOR VARIANCE — ${totalSpread}pt spread. Acceptable.`);
} else {
  console.log(`\nVERDICT: UNSTABLE — ${totalSpread}pt spread. Needs fixing.`);
  // Identify the swinging dimension
  const dims = ["dim1", "dim2", "dim3"];
  const worst = dims.reduce((a, b) => stats(valid, a).spread > stats(valid, b).spread ? a : b);
  console.log(`  Worst dimension: ${worst} (${stats(valid, worst).spread}pt spread)`);
}

// Show reasons for variance context
console.log(`\nReasons:`);
valid.forEach((r, i) => console.log(`  Run ${i + 1}: "${(r.reason || "").slice(0, 120)}"`));
console.log(`\nCustomer similarity:`);
valid.forEach((r, i) => console.log(`  Run ${i + 1}: "${(r.customerSimilarity || "").slice(0, 120)}"`));
console.log(`\nIncumbent risk:`);
valid.forEach((r, i) => console.log(`  Run ${i + 1}: "${(r.incumbentRisk || "").slice(0, 120)}"`));
