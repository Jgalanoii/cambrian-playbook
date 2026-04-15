#!/usr/bin/env node
// scripts/consistency/test-icp.mjs
//
// Runs the two-phase ICP generator N times per seller and reports drift
// across runs — field-by-field. Designed to catch the "different ICP each
// time" problem (employee size, revenue range, industries, etc.).
//
// Usage:
//   node scripts/consistency/test-icp.mjs           # N=5, all sellers
//   N=3 node scripts/consistency/test-icp.mjs       # N=3
//   SELLER=gong.io node scripts/consistency/test-icp.mjs  # one seller
//
// Reads ANTHROPIC_API_KEY from .env.local (or env). Calls Anthropic directly
// — no /api proxy needed, no dev server required.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const OUT_DIR = path.join(__dirname, "results");
const SELLERS_PATH = path.join(__dirname, "sellers.json");

// ── Load ANTHROPIC_API_KEY from .env.local ───────────────────────────────────
function loadEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY not found in env or .env.local");
  process.exit(1);
}

const MODEL = "claude-haiku-4-5-20251001";
const N = parseInt(process.env.N || "5", 10);
const SELLER_FILTER = process.env.SELLER || null;

// ── Anthropic API call ───────────────────────────────────────────────────────
async function anthropic({ prompt, maxTokens, assistantPrefill = "{" }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      temperature: 0,
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: assistantPrefill },
      ],
    }),
  });
  const d = await res.json();
  if (d.error) {
    console.error("API error:", d.error);
    return { raw: "", usage: null, error: d.error };
  }
  const raw = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
  return { raw: assistantPrefill + raw, usage: d.usage || null };
}

function parseJSON(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

// ── ICP generator (ports buildSellerICP from App.jsx:1693) ───────────────────
async function generateICP(sellerUrl, sellerStage) {
  const url = sellerUrl.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Phase 1 — research (no web_search tool, so just training-knowledge recall at temp:0)
  const researchPrompt =
    `Search for information about the B2B company at ${url}:\n` +
    `1. What do they sell? Who are their target customers?\n` +
    `2. Look for: customer case studies, testimonials, customer logos, pricing tiers, partner pages\n` +
    `3. Look for: job postings mentioning target industries or company sizes\n` +
    `4. Any known enterprise customers, verticals served, or use cases\n` +
    `Return ONLY raw JSON, start with {:\n` +
    `{"companyName":"","tagline":"","products":["product 1","product 2"],"targetCustomers":"who they sell to in plain language","knownCustomers":["logo 1","logo 2","logo 3"],"industries":["vertical 1","vertical 2","vertical 3"],"companySize":"typical customer size","pricingHint":"any pricing signals found","useCases":["use case 1","use case 2"],"competitors":["competitor 1","competitor 2"]}`;

  const r1 = await anthropic({ prompt: researchPrompt, maxTokens: 800 });
  const researchCtx = r1.raw.slice(0, 1500);

  // Phase 2 — anchored schema with enum buckets for numeric/categorical fields
  const icpPrompt =
    `You are a senior B2B ICP strategist. Build the Ideal Customer Profile for the seller at: ${url}.\n` +
    (researchCtx ? `RESEARCH:\n${researchCtx.slice(0, 800)}\n\n` : "") +
    `Seller stage: ${sellerStage || "unknown"}. Be specific and confident — no placeholders.\n\n` +
    `CRITICAL — CONSISTENCY RULES:\n` +
    `- For fields marked "PICK ONE" below, return ONLY the chosen value verbatim. No extra words, no custom ranges, no parentheticals.\n` +
    `- Be deterministic. If a buyer fits two buckets, pick the one matching the MEDIAN customer, not the widest range.\n\n` +
    `Return ONLY raw JSON starting with {:\n` +
    `{"sellerName":"",` +
    `"sellerDescription":"2 sentences on what they sell",` +
    `"marketCategory":"specific category in 2-5 words",` +
    `"icp":{` +
    `"industries":["Primary","Second","Third"],` +
    `"companySize":"PICK ONE: 1-49 employees | 50-499 employees | 500-4,999 employees | 5,000-49,999 employees | 50,000+ employees",` +
    `"revenueRange":"PICK ONE: <$10M | $10M-$100M | $100M-$1B | $1B-$10B | $10B+",` +
    `"ownershipTypes":["PICK 1-2 FROM: VC-backed private | PE-backed private | Public | Privately-held (family/founder) | Bootstrapped"],` +
    `"geographies":["Primary region: North America | EMEA | APAC | LATAM | Global"],` +
    `"adoptionProfile":"PICK ONE: Innovator | Early Adopter | Early Majority | Late Majority",` +
    `"buyerPersonas":["Economic buyer role","Champion role","Technical evaluator role"],` +
    `"priorityInitiative":"what triggers them to act NOW in 1-2 sentences",` +
    `"successFactors":"what winning looks like in 1-2 sentences",` +
    `"perceivedBarriers":"top objections in 1-2 sentences",` +
    `"decisionCriteria":"top 2-3 evaluation factors",` +
    `"buyerJourney":"awareness to decision in 1 sentence",` +
    `"customerJobs":["Functional job","Emotional job","Social job"],` +
    `"topPains":["Pain 1","Pain 2","Pain 3"],` +
    `"topGains":["Gain 1","Gain 2","Gain 3"],` +
    `"competitiveAlternatives":["Status quo","Competitor","Build in-house"],` +
    `"uniqueDifferentiators":["Differentiator 1","Differentiator 2"],` +
    `"disqualifiers":["Not a fit: 1","Not a fit: 2"],` +
    `"techSignals":["Signal 1","Signal 2"],` +
    `"tractionChannels":["Channel 1","Channel 2","Channel 3"],` +
    `"dealSize":"PICK ONE: <$10K ACV | $10K-$50K ACV | $50K-$250K ACV | $250K-$1M ACV | $1M+ ACV",` +
    `"salesCycle":"PICK ONE: <30 days | 30-60 days | 60-90 days | 90-180 days | 180+ days",` +
    `"customerExamples":["Customer 1","Customer 2","Customer 3"]}}`;

  const r2 = await anthropic({ prompt: icpPrompt, maxTokens: 6000 });
  const parsed = parseJSON(r2.raw);

  return {
    icp: parsed,
    phase1Raw: r1.raw,
    phase2Raw: r2.raw,
    usage: {
      phase1: r1.usage,
      phase2: r2.usage,
    },
  };
}

// ── Drift analysis ───────────────────────────────────────────────────────────
// For each ICP field, across N runs, compute:
//   - unique value count (1 = perfect consistency; N = fully unstable)
//   - for numeric range strings ("500-10K employees", "$50M-$2B"): extract
//     min/max bounds and report spread
function uniqueCount(arr) {
  return new Set(arr.map(v => JSON.stringify(v))).size;
}

function parseRange(s) {
  if (!s || typeof s !== "string") return null;
  // Normalize: lowercase, strip commas
  const norm = s.toLowerCase().replace(/,/g, "");
  // Match pairs of numbers with optional K/M/B suffix
  const nums = [...norm.matchAll(/(\d+(?:\.\d+)?)\s*([kmb])?/g)].map(m => {
    let n = parseFloat(m[1]);
    const suf = m[2];
    if (suf === "k") n *= 1e3;
    else if (suf === "m") n *= 1e6;
    else if (suf === "b") n *= 1e9;
    return n;
  });
  if (nums.length < 1) return null;
  if (nums.length === 1) return { min: nums[0], max: nums[0] };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

function analyzeField(runs, fieldPath) {
  const values = runs.map(r => {
    let v = r.icp;
    for (const k of fieldPath.split(".")) v = v?.[k];
    return v;
  });
  const validCount = values.filter(v => v !== undefined && v !== null).length;
  if (validCount === 0) return { missing: true };

  const unique = uniqueCount(values);
  const result = {
    unique,
    totalRuns: values.length,
    drift: unique === 1 ? "STABLE" : unique === values.length ? "FULLY UNSTABLE" : "PARTIAL",
    sample: values.slice(0, 3),
  };

  // For known numeric-range fields, also compute bound drift
  if (["icp.companySize", "icp.revenueRange", "icp.dealSize", "icp.salesCycle"].includes(fieldPath)) {
    const ranges = values.map(parseRange).filter(Boolean);
    if (ranges.length >= 2) {
      const mins = ranges.map(r => r.min);
      const maxs = ranges.map(r => r.max);
      result.boundDrift = {
        minSpread: Math.max(...mins) - Math.min(...mins),
        maxSpread: Math.max(...maxs) - Math.min(...maxs),
        minRange: [Math.min(...mins), Math.max(...mins)],
        maxRange: [Math.min(...maxs), Math.max(...maxs)],
      };
    }
  }

  return result;
}

const TRACKED_FIELDS = [
  "sellerName",
  "marketCategory",
  "icp.industries",
  "icp.companySize",
  "icp.revenueRange",
  "icp.ownershipTypes",
  "icp.geographies",
  "icp.adoptionProfile",
  "icp.buyerPersonas",
  "icp.priorityInitiative",
  "icp.topPains",
  "icp.topGains",
  "icp.competitiveAlternatives",
  "icp.uniqueDifferentiators",
  "icp.disqualifiers",
  "icp.techSignals",
  "icp.tractionChannels",
  "icp.dealSize",
  "icp.salesCycle",
  "icp.customerExamples",
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const { sellers } = JSON.parse(fs.readFileSync(SELLERS_PATH, "utf8"));
  const selected = SELLER_FILTER
    ? sellers.filter(s => s.url.includes(SELLER_FILTER))
    : sellers;

  if (!selected.length) {
    console.error(`No sellers match filter "${SELLER_FILTER}"`);
    process.exit(1);
  }

  console.log(`\n━━━ ICP Consistency Test ━━━`);
  console.log(`Sellers: ${selected.length} × Runs each: ${N} = ${selected.length * N} ICP generations`);
  console.log(`Est. cost: ~$${(selected.length * N * 0.035).toFixed(2)} (Haiku 4.5)\n`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const report = { startedAt: new Date().toISOString(), sellers: [] };
  let totalInputTokens = 0, totalOutputTokens = 0;

  for (const seller of selected) {
    console.log(`\n─── ${seller.url} (${seller.stage}) ───`);
    const sellerDir = path.join(OUT_DIR, seller.url.replace(/[^a-z0-9]/gi, "_"));
    fs.mkdirSync(sellerDir, { recursive: true });

    const runs = [];
    for (let i = 1; i <= N; i++) {
      process.stdout.write(`  run ${i}/${N}... `);
      const t0 = Date.now();
      const result = await generateICP(seller.url, seller.stage);
      const ms = Date.now() - t0;

      if (result.icp) {
        runs.push(result);
        console.log(`ok (${ms}ms)`);
      } else {
        console.log(`FAILED — JSON parse error, run excluded from analysis`);
      }

      // Track usage
      if (result.usage?.phase1) {
        totalInputTokens += result.usage.phase1.input_tokens || 0;
        totalOutputTokens += result.usage.phase1.output_tokens || 0;
      }
      if (result.usage?.phase2) {
        totalInputTokens += result.usage.phase2.input_tokens || 0;
        totalOutputTokens += result.usage.phase2.output_tokens || 0;
      }

      // Save raw result
      fs.writeFileSync(
        path.join(sellerDir, `run-${i}.json`),
        JSON.stringify(result, null, 2)
      );
    }

    if (runs.length < 2) {
      console.log(`  ⚠ Skipping analysis: only ${runs.length} successful run(s)`);
      continue;
    }

    // Analyze drift per field
    const fieldReport = {};
    for (const field of TRACKED_FIELDS) {
      fieldReport[field] = analyzeField(runs, field);
    }

    report.sellers.push({
      url: seller.url,
      stage: seller.stage,
      successfulRuns: runs.length,
      fieldDrift: fieldReport,
    });

    // Print summary for this seller
    console.log(`\n  Drift summary for ${seller.url}:`);
    const unstable = Object.entries(fieldReport)
      .filter(([, v]) => !v.missing && v.drift !== "STABLE")
      .sort(([, a], [, b]) => b.unique - a.unique);
    const stable = Object.entries(fieldReport).filter(([, v]) => !v.missing && v.drift === "STABLE").length;
    console.log(`    ✓ STABLE: ${stable} fields`);
    console.log(`    ✗ UNSTABLE: ${unstable.length} fields`);
    for (const [field, data] of unstable) {
      const bd = data.boundDrift;
      const extra = bd
        ? `  | min spread: ${bd.minRange[0]}–${bd.minRange[1]}, max spread: ${bd.maxRange[0]}–${bd.maxRange[1]}`
        : "";
      console.log(`      ${data.unique}/${data.totalRuns} unique  ${field}${extra}`);
    }
  }

  report.finishedAt = new Date().toISOString();
  report.tokenUsage = { input: totalInputTokens, output: totalOutputTokens };
  // Haiku 4.5 pricing: $1/MTok input, $5/MTok output
  report.estimatedCost = ((totalInputTokens * 1 + totalOutputTokens * 5) / 1e6).toFixed(4);

  fs.writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));

  console.log(`\n\n━━━ Overall ━━━`);
  console.log(`Total input tokens:  ${totalInputTokens.toLocaleString()}`);
  console.log(`Total output tokens: ${totalOutputTokens.toLocaleString()}`);
  console.log(`Estimated cost:      $${report.estimatedCost}`);
  console.log(`\nFull report:   ${path.relative(ROOT, path.join(OUT_DIR, "report.json"))}`);
  console.log(`Raw runs:      ${path.relative(ROOT, OUT_DIR)}/<seller>/run-*.json\n`);
}

main().catch(e => {
  console.error("Fatal:", e);
  process.exit(1);
});
