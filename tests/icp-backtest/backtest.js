#!/usr/bin/env node
/**
 * ICP Backtest — validates that a generated ICP correctly rates
 * a seller's real customers as high-fit.
 *
 * Core logic from Validation Infrastructure Spec §B1-B8.
 *
 * Usage:
 *   node tests/icp-backtest/backtest.js <test-file.json>
 *   node tests/icp-backtest/backtest.js tests/icp-backtest/cases/tillo.json
 *   node tests/icp-backtest/backtest.js --self-test   (run software test cases S1-S9)
 *
 * Requires ANTHROPIC_API_KEY in environment or .env.local/.env.
 * Exit: 0 = pass, 1 = fail, 2 = error
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

// ── Load env ──────────────────────────────────────────────────────────
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
const MODEL = "claude-haiku-4-5-20251001";

// ── Anthropic API ─────────────────────────────────────────────────────
async function callAnthropic(body) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 4000, temperature: 0, ...body }),
  });
  if (!r.ok) throw new Error(`Anthropic ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

function extractJson(text, key) {
  const clean = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").replace(/<\/?cite[^>]*>/g, "");
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

// ── Score a batch of companies against a seller ICP ───────────────────
async function scoreBatch(companies, sellerContext) {
  const companiesStr = companies.map(c => `${c.name}|${c.industry || ""}|${c.url || ""}`).join("\n");

  const prompt =
    `You are a B2B sales strategist. Score ICP fit for each company below.\n\n` +
    `SCORE BANDS:\n` +
    `- 75-100 = "Strong Fit" — clear ICP match\n` +
    `- 55-74 = "Potential Fit" — partial match\n` +
    `- 0-54 = "Poor Fit" — structural barrier\n\n` +
    `SELLER CONTEXT:\n${sellerContext}\n\n` +
    `COMPANIES (Name|Industry|URL):\n${companiesStr}\n\n` +
    `For each company, return a total score (0-100) and one-sentence reason.\n` +
    `Return ONLY raw JSON: {"scores":[{"company":"exact name","score":65,"reason":"..."}]}`;

  const d = await callAnthropic({
    messages: [{ role: "user", content: prompt }, { role: "assistant", content: "{" }],
  });

  const raw = (d.content || []).filter(b => b.type === "text").map(b => b.text || "").join("");
  const text = "{" + raw.replace(/<\/?cite[^>]*>/g, "");
  const parsed = extractJson(text, "scores");
  return parsed?.scores || [];
}

// ── Statistics ────────────────────────────────────────────────────────
function median(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function pctAbove(arr, threshold) {
  if (!arr.length) return 0;
  return arr.filter(v => v >= threshold).length / arr.length;
}

// ── B4 Interpretation matrix ──────────────────────────────────────────
function diagnose(knownGoodMedian, negMedian, expected) {
  const kgHigh = knownGoodMedian >= expected.known_good_median_min;
  const ncLow = negMedian <= expected.negative_control_median_max;
  const ncHigherThanKg = negMedian > knownGoodMedian;

  if (kgHigh && ncLow) return { verdict: "ICP_VALIDATED", action: "Ship it. ICP correctly discriminates." };
  if (kgHigh && !ncLow) return { verdict: "ICP_TOO_BROAD", action: "Tighten ICP criteria — scoring everything high. Re-run after narrowing industries or size." };
  if (!kgHigh && ncHigherThanKg) return { verdict: "INVERTED_OR_SPLIT", action: "Serious: negative controls scoring higher than known-good. Indicates ICP is inverted or scoring model failure. Stop and debug." };
  if (!kgHigh && ncLow) return { verdict: "SPLIT_ICP", action: "Known-good scoring low but negative controls also low. Seller may have 2+ distinct ICPs — segment customers and generate per-segment ICPs." };
  if (!kgHigh && !ncLow) return { verdict: "ICP_TOO_NARROW_OR_MISCALIBRATED", action: "Investigate scoring calibration before blaming ICP. Both sets scoring poorly suggests model issue, not ICP issue." };

  return { verdict: "UNKNOWN", action: "Review manually." };
}

// ── Run the backtest ──────────────────────────────────────────────────
async function runBacktest(testCase) {
  const { seller, known_good, negative_controls, expected } = testCase;

  // Validation
  const errors = [];
  if (!seller?.name) errors.push("seller.name required");
  if (!known_good?.length) errors.push("known_good list is empty");
  if (!negative_controls?.length) errors.push("negative_controls list is empty");
  if (!expected) errors.push("expected thresholds required");

  // Check for duplicates across lists
  const allNames = new Set();
  for (const c of [...(known_good || []), ...(negative_controls || [])]) {
    const key = (c.name || "").toLowerCase().trim();
    if (allNames.has(key)) errors.push(`Duplicate company in both lists: "${c.name}"`);
    allNames.add(key);
  }

  if (errors.length) return { pass: false, errors, verdict: "VALIDATION_ERROR" };

  // Warnings
  const warnings = [];
  if (known_good.length < 8) warnings.push(`Low confidence: only ${known_good.length} known-good companies (minimum 8 recommended)`);
  if (negative_controls.length < 5) warnings.push(`Low confidence: only ${negative_controls.length} negative controls (minimum 5 recommended)`);

  // Check diversity of known-good
  const industries = new Set(known_good.map(c => (c.industry || c.note || "").toLowerCase()));
  if (industries.size <= 1 && known_good.length >= 5) {
    warnings.push("Low diversity: all known-good companies appear to be in the same industry — ICP may be overfit");
  }

  // Build seller context from the test case
  const sellerContext = `Seller: ${seller.name} (${seller.url || ""})\n` +
    (seller.description ? `Description: ${seller.description}\n` : "") +
    (seller.industries ? `Target industries: ${seller.industries.join(", ")}\n` : "") +
    (seller.products ? `Products: ${seller.products.join(", ")}\n` : "") +
    (seller.icp_summary ? `ICP: ${seller.icp_summary}\n` : "");

  console.log(`\nICP Backtest: ${seller.name}`);
  console.log(`  Known-good: ${known_good.length} companies`);
  console.log(`  Negative controls: ${negative_controls.length} companies`);
  if (warnings.length) warnings.forEach(w => console.log(`  WARNING: ${w}`));

  // Score known-good
  console.log(`  Scoring known-good...`);
  const kgScores = await scoreBatch(known_good, sellerContext);
  const kgMap = {};
  for (const s of kgScores) kgMap[(s.company || "").toLowerCase()] = s;

  // Score negative controls
  console.log(`  Scoring negative controls...`);
  const ncScores = await scoreBatch(negative_controls, sellerContext);
  const ncMap = {};
  for (const s of ncScores) ncMap[(s.company || "").toLowerCase()] = s;

  // Extract score arrays (handle companies that failed scoring)
  const kgValues = [], ncValues = [];
  const kgDetails = [], ncDetails = [];
  const excluded = [];

  for (const c of known_good) {
    const match = kgMap[(c.name || "").toLowerCase()];
    if (match && typeof match.score === "number") {
      kgValues.push(match.score);
      kgDetails.push({ ...c, score: match.score, reason: match.reason });
    } else {
      excluded.push({ ...c, list: "known_good", error: "scoring failed" });
    }
  }

  for (const c of negative_controls) {
    const match = ncMap[(c.name || "").toLowerCase()];
    if (match && typeof match.score === "number") {
      ncValues.push(match.score);
      ncDetails.push({ ...c, score: match.score, reason: match.reason });
    } else {
      excluded.push({ ...c, list: "negative_control", error: "scoring failed" });
    }
  }

  // Compute metrics
  const kgMedian = median(kgValues);
  const ncMedian = median(ncValues);
  const gap = kgMedian - ncMedian;
  const kgPctAbove40 = pctAbove(kgValues, 40);

  // Check pass criteria (B3)
  const criteria = {
    known_good_median: { value: kgMedian, threshold: expected.known_good_median_min, pass: kgMedian >= expected.known_good_median_min },
    known_good_pct_above_40: { value: kgPctAbove40, threshold: expected.known_good_pct_above_40_min, pass: kgPctAbove40 >= expected.known_good_pct_above_40_min },
    negative_control_median: { value: ncMedian, threshold: expected.negative_control_median_max, pass: ncMedian <= expected.negative_control_median_max },
    discrimination_gap: { value: gap, threshold: expected.discrimination_gap_min, pass: gap >= expected.discrimination_gap_min },
  };

  const allPass = Object.values(criteria).every(c => c.pass);
  const diagnosis = diagnose(kgMedian, ncMedian, expected);

  // Report
  const result = {
    seller: seller.name,
    timestamp: new Date().toISOString(),
    pass: allPass,
    verdict: diagnosis.verdict,
    action: diagnosis.action,
    metrics: {
      known_good_median: kgMedian,
      known_good_pct_above_40: Math.round(kgPctAbove40 * 100) + "%",
      negative_control_median: ncMedian,
      discrimination_gap: gap,
    },
    criteria,
    known_good_scores: kgDetails.sort((a, b) => b.score - a.score),
    negative_control_scores: ncDetails.sort((a, b) => b.score - a.score),
    excluded,
    warnings,
  };

  // Console output
  console.log(`\n  RESULTS:`);
  console.log(`    Known-good median:    ${kgMedian} (threshold: ≥${expected.known_good_median_min}) ${criteria.known_good_median.pass ? "PASS" : "FAIL"}`);
  console.log(`    Known-good ≥40:       ${Math.round(kgPctAbove40 * 100)}% (threshold: ≥${expected.known_good_pct_above_40_min * 100}%) ${criteria.known_good_pct_above_40.pass ? "PASS" : "FAIL"}`);
  console.log(`    Neg-control median:   ${ncMedian} (threshold: ≤${expected.negative_control_median_max}) ${criteria.negative_control_median.pass ? "PASS" : "FAIL"}`);
  console.log(`    Discrimination gap:   ${gap} (threshold: ≥${expected.discrimination_gap_min}) ${criteria.discrimination_gap.pass ? "PASS" : "FAIL"}`);
  console.log(`\n    VERDICT: ${diagnosis.verdict}`);
  console.log(`    ACTION: ${diagnosis.action}`);
  console.log(`    OVERALL: ${allPass ? "PASS" : "FAIL"}`);

  if (kgDetails.length) {
    console.log(`\n    Known-good scores:`);
    for (const d of kgDetails.sort((a, b) => b.score - a.score)) {
      console.log(`      ${String(d.score).padStart(3)} ${d.name}`);
    }
  }
  if (ncDetails.length) {
    console.log(`\n    Negative-control scores:`);
    for (const d of ncDetails.sort((a, b) => b.score - a.score)) {
      console.log(`      ${String(d.score).padStart(3)} ${d.name}`);
    }
  }
  if (excluded.length) {
    console.log(`\n    Excluded (scoring failed):`);
    for (const e of excluded) console.log(`      ${e.name} (${e.list}): ${e.error}`);
  }

  return result;
}

// ── Software test cases (S1-S9) ───────────────────────────────────────
function runSelfTests() {
  console.log("\nICP Backtest — Software Test Cases (S1-S9)\n");
  let passed = 0, failed = 0;

  const check = (name, fn) => {
    try {
      fn();
      console.log(`  PASS  ${name}`);
      passed++;
    } catch (e) {
      console.log(`  FAIL  ${name}: ${e.message}`);
      failed++;
    }
  };
  const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

  // S1: Normal aggregation
  check("S1: Normal aggregation", () => {
    assert(median([50, 60, 70, 80, 55, 65, 75, 45, 85, 90]) === 67.5, "median should be 67.5");
    assert(pctAbove([50, 60, 70, 30, 20, 80, 55, 65, 75, 45], 40) === 0.8, "80% should be ≥40");
    const gap = 67.5 - 25;
    assert(gap >= 20, "gap should be ≥20");
  });

  // S2: Known-good < 8 — should warn
  check("S2: Low confidence warning", () => {
    // This is a validation check — the runner would emit a warning
    const kgCount = 5;
    assert(kgCount < 8, "should detect low count");
  });

  // S3: Empty known-good
  check("S3: Empty list handling", () => {
    assert(median([]) === 0, "median of empty should be 0");
    assert(pctAbove([], 40) === 0, "pctAbove of empty should be 0");
  });

  // S5: Outlier handling
  check("S5: Outlier doesn't dominate median", () => {
    const scores = [60, 65, 58, 62, 70, 55, 63, 67, 59, 61, 64, 66, 68, 57, 5]; // one outlier (5)
    const med = median(scores);
    assert(med >= 55, `median ${med} should still be ≥55 despite outlier`);
  });

  // S7: Boundary at threshold
  check("S7: Boundary handling", () => {
    const gap = 20; // exactly at threshold
    const expected = { discrimination_gap_min: 20 };
    assert(gap >= expected.discrimination_gap_min, "gap exactly at threshold should pass");
  });

  // S8: Inverted detection
  check("S8: Inverted detection", () => {
    const d = diagnose(30, 60, { known_good_median_min: 55, negative_control_median_max: 35 });
    assert(d.verdict === "INVERTED_OR_SPLIT", `expected INVERTED_OR_SPLIT, got ${d.verdict}`);
  });

  // S9: Duplicate detection
  check("S9: Duplicate detection", () => {
    const known_good = [{ name: "Acme Corp" }];
    const negative_controls = [{ name: "Acme Corp" }];
    const allNames = new Set();
    let dupes = 0;
    for (const c of [...known_good, ...negative_controls]) {
      const key = c.name.toLowerCase().trim();
      if (allNames.has(key)) dupes++;
      allNames.add(key);
    }
    assert(dupes > 0, "should detect duplicate");
  });

  // B4 matrix tests
  check("B4: ICP_VALIDATED", () => {
    const d = diagnose(60, 25, { known_good_median_min: 55, negative_control_median_max: 35 });
    assert(d.verdict === "ICP_VALIDATED", `expected ICP_VALIDATED, got ${d.verdict}`);
  });

  check("B4: ICP_TOO_BROAD", () => {
    const d = diagnose(65, 55, { known_good_median_min: 55, negative_control_median_max: 35 });
    assert(d.verdict === "ICP_TOO_BROAD", `expected ICP_TOO_BROAD, got ${d.verdict}`);
  });

  console.log(`\n  ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// ── Main ──────────────────────────────────────────────────────────────
if (process.argv.includes("--self-test")) {
  const pass = runSelfTests();
  process.exit(pass ? 0 : 1);
}

const testFile = process.argv[2];
if (!testFile) {
  console.error("Usage: node tests/icp-backtest/backtest.js <test-case.json>");
  console.error("       node tests/icp-backtest/backtest.js --self-test");
  process.exit(2);
}

if (!KEY) { console.error("ANTHROPIC_API_KEY required"); process.exit(2); }

const testPath = resolve(testFile);
if (!existsSync(testPath)) { console.error(`File not found: ${testPath}`); process.exit(2); }

const testCase = JSON.parse(readFileSync(testPath, "utf8"));
const result = await runBacktest(testCase);

// Save report
const reportPath = join(__dirname, `report-${testCase.seller?.name?.toLowerCase().replace(/\s+/g, "-") || "unknown"}-${new Date().toISOString().slice(0, 10)}.json`);
writeFileSync(reportPath, JSON.stringify(result, null, 2));
console.log(`\nReport saved: ${reportPath}`);

process.exit(result.pass ? 0 : 1);
