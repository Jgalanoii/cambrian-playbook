#!/usr/bin/env node
/**
 * Golden-Set Regression Harness — automated fact-checking for briefs.
 *
 * Generates a p1 (overview) brief for each sentinel company, then checks
 * extracted facts against verified ground truth and runs structural invariants.
 *
 * Usage:
 *   node tests/golden-set/run.js              # lite: 5 companies x1
 *   node tests/golden-set/run.js --full       # full: 5 companies x3
 *   node tests/golden-set/run.js --json       # machine-readable output
 *
 * Requires ANTHROPIC_API_KEY in environment or .env.local/.env.
 * Exit: 0 = all pass, 1 = regression(s) found.
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runMatch } from "./lib/match.js";
import { extractNumber } from "./lib/match.js";
import { runInvariant } from "./lib/invariants.js";
import { extractAllFacts, briefToText } from "./lib/extract-facts.js";

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
if (!KEY) { console.error("ANTHROPIC_API_KEY required"); process.exit(1); }

const IS_FULL = process.argv.includes("--full");
const JSON_OUT = process.argv.includes("--json");
const RUNS_PER_COMPANY = IS_FULL ? 3 : 1;
const MODEL = "claude-haiku-4-5-20251001";

// ── Load ground truth ─────────────────────────────────────────────────
const companiesPath = join(__dirname, "companies.json");
const goldenSet = JSON.parse(readFileSync(companiesPath, "utf8"));

// ── Anthropic API helper ──────────────────────────────────────────────
async function callAnthropic(body) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 2000, temperature: 0, ...body }),
  });
  if (!r.ok) {
    const err = await r.text().catch(() => "");
    throw new Error(`Anthropic ${r.status}: ${err.slice(0, 200)}`);
  }
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

// ── Cross-run consistency check ──────────────────────────────────────
// Fields to check for numeric stability across runs, with max allowed spread (%).
const CONSISTENCY_FIELDS = [
  { key: "revenue",       briefField: "revenue",       label: "Revenue",        spreadPct: 25 },
  { key: "employeeCount", briefField: "employeeCount", label: "Employee count",  spreadPct: 30 },
];

/**
 * Compare numeric fields across multiple brief runs for the same company.
 * Returns an array of { field, pass, detail } results.
 * Only checks fields that produced parseable numbers in ALL runs.
 *
 * @param {Array<object>} briefs — array of brief JSON objects (nulls filtered out)
 * @returns {Array<{field: string, pass: boolean, detail: string}>}
 */
function checkCrossRunConsistency(briefs) {
  if (briefs.length < 3) return [];

  const results = [];

  for (const { key, briefField, label, spreadPct } of CONSISTENCY_FIELDS) {
    const values = briefs.map(b => {
      const raw = b[briefField];
      return raw ? extractNumber(raw) : NaN;
    });

    // Only check if ALL runs produced a parseable number
    if (values.some(v => isNaN(v))) {
      results.push({
        field: `consistency:${key}`,
        pass: true,
        detail: `${label} — skipped (not parseable in all ${briefs.length} runs)`,
      });
      continue;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    // Avoid divide-by-zero on zero values
    if (min === 0 && max === 0) {
      results.push({ field: `consistency:${key}`, pass: true, detail: `${label} — all zeros` });
      continue;
    }

    const mid = (min + max) / 2;
    const spread = ((max - min) / mid) * 100;
    const pass = spread <= spreadPct;

    const fmt = v => v.toLocaleString();
    results.push({
      field: `consistency:${key}`,
      pass,
      detail: pass
        ? `${label} — spread ${spread.toFixed(1)}% across ${briefs.length} runs (threshold ${spreadPct}%) [${values.map(fmt).join(", ")}]`
        : `${label} — EXCESSIVE spread ${spread.toFixed(1)}% (threshold ${spreadPct}%) [${values.map(fmt).join(", ")}]`,
    });
  }

  return results;
}

// ── Generate a p1-equivalent brief for a company ──────────────────────
async function generateBrief(company) {
  const co = company.name;
  const url = company.url;

  const prompt =
    `Sales brief about TARGET PROSPECT "${co}" (${url}).\n` +
    `IDENTITY: Research ONLY the company at https://${url}. Do NOT mix facts from different companies with similar names.\n\n` +
    `ACCURACY: NEVER invent facts about ${co}. No fabricated revenue, employee counts, executives, products, partnerships, or acquisitions. If unknown, use an empty string.\n` +
    `EMPTY FIELD RULE: If a fact is unknown, return an EMPTY STRING "". NEVER return "Not found", "Not specified", "Not available", "N/A", "Unknown".\n` +
    `REVENUE: Always report FULL-YEAR (annual) revenue, NOT quarterly. Look for "FY", "full year", "annual revenue" or "total revenue" for the most recent fiscal year. Use the SAME number format every time — e.g., always "$23.9B" not sometimes "$23,900M".\n` +
    `EMPLOYEE COUNT: Report the company's OWN employee headcount. NOT platform users, customers served, or partner network size. For BaaS/platform companies, this is the company's staff. Use the MOST COMMON figure from your search results — if 3 sources say ~215,000 and 1 says ~400,000, use ~215,000. Consistency across runs is critical.\n` +
    `PUBLIC/PRIVATE: Only say "Public" and include a ticker if the company is CURRENTLY publicly listed as of today. If the company was acquired, taken private, or delisted, say "Private" — do NOT mention former tickers or exchanges.\n` +
    `CONSISTENCY: This test runs multiple times for the same company. Your answers MUST be stable — use the most authoritative source (SEC filings, company website, annual report) rather than news articles that may quote different figures.\n\n` +
    `Search for "${co}" to get current information, then return ONLY raw JSON for the company overview:\n` +
    `{"companySnapshot":"3-4 sentences: what ${co} does, market position, recent moves.",` +
    `"revenue":"ANNUAL full-year revenue, e.g. $2.4B (FY2024) — empty if unknown",` +
    `"publicPrivate":"'Public (NYSE: TICKER)' ONLY if currently listed today, otherwise 'Private' or 'Private (PE-backed)' or 'Private (acquired by X)' or 'Member-owned'",` +
    `"employeeCount":"Company's OWN headcount, e.g. ~200,000 — NOT platform users. Empty if unknown.",` +
    `"headquarters":"City, State",` +
    `"founded":"Year — empty if unknown",` +
    `"website":"${url}",` +
    `"fundingProfile":"Ownership structure",` +
    `"competitors":["Competitor 1","Competitor 2","Competitor 3"],` +
    `"keyExecutives":[{"name":"Full Name","title":"CEO"}]}`;

  const d = await callAnthropic({
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 2 }],
    messages: [{ role: "user", content: prompt }],
  });

  // Extract text blocks (skip tool_use and web_search_tool_result), strip citation tags
  const textBlocks = (d.content || []).filter(b => b.type === "text").map(b => (b.text || "").replace(/<\/?cite[^>]*>/g, ""));
  for (let i = textBlocks.length - 1; i >= 0; i--) {
    const parsed = extractJson(textBlocks[i], "companySnapshot");
    if (parsed) return parsed;
  }
  // Fallback: join all text and try
  const raw = textBlocks.join("").replace(/<\/?cite[^>]*>/g, "").trim();
  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  if (first >= 0 && last > first) {
    try { return JSON.parse(raw.slice(first, last + 1)); } catch {}
  }
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────
const results = [];
let totalFacts = 0, passedFacts = 0, failedFacts = 0;
let totalInvariants = 0, passedInvariants = 0, failedInvariants = 0;
let totalConsistency = 0, passedConsistency = 0, failedConsistency = 0;

console.log(`\nGolden-Set Regression Harness — ${IS_FULL ? "FULL" : "LITE"} mode`);
console.log(`${goldenSet.companies.length} companies × ${RUNS_PER_COMPANY} run(s)\n`);

for (const company of goldenSet.companies) {
  const companyResults = { id: company.id, name: company.name, runs: [] };

  for (let run = 0; run < RUNS_PER_COMPANY; run++) {
    if (!JSON_OUT) process.stdout.write(`  ${company.name} (run ${run + 1}/${RUNS_PER_COMPANY})...`);

    let brief;
    try {
      brief = await generateBrief(company);
    } catch (e) {
      if (!JSON_OUT) console.log(` ERROR: ${e.message}`);
      companyResults.runs.push({ run: run + 1, error: e.message, facts: [], invariants: [] });
      continue;
    }

    if (!brief) {
      if (!JSON_OUT) console.log(" ERROR: null brief (parse failure)");
      companyResults.runs.push({ run: run + 1, error: "null brief", facts: [], invariants: [] });
      continue;
    }

    // Check facts
    const facts = extractAllFacts(company, brief);
    const factResults = facts.map(f => {
      const result = runMatch(f.match, f.actual, f.expected, f.options);
      totalFacts++;
      if (result.pass) passedFacts++;
      else failedFacts++;
      return { field: f.field, tier: f.tier, pass: result.pass, detail: result.detail };
    });

    // Check forbidden strings (entity confusion)
    if (company.forbidden_strings?.length) {
      const absResult = runMatch("absence", briefToText(brief), null, { forbidden_strings: company.forbidden_strings });
      totalFacts++;
      if (absResult.pass) passedFacts++;
      else failedFacts++;
      factResults.push({ field: "_forbidden_strings", tier: 1, pass: absResult.pass, detail: absResult.detail });
    }

    // Check invariants
    const invariantResults = (company.invariants || []).map(name => {
      const result = runInvariant(name, brief, company);
      totalInvariants++;
      if (result.pass) passedInvariants++;
      else failedInvariants++;
      return { name, pass: result.pass, detail: result.detail };
    });

    const runResult = {
      run: run + 1,
      _brief: brief, // retained for cross-run consistency; stripped from JSON output
      facts: factResults,
      invariants: invariantResults,
      factsPass: factResults.filter(f => f.pass).length,
      factsTotal: factResults.length,
      invariantsPass: invariantResults.filter(i => i.pass).length,
      invariantsTotal: invariantResults.length,
    };

    companyResults.runs.push(runResult);

    if (!JSON_OUT) {
      const fStr = `facts ${runResult.factsPass}/${runResult.factsTotal}`;
      const iStr = `invariants ${runResult.invariantsPass}/${runResult.invariantsTotal}`;
      const failures = [...factResults.filter(f => !f.pass), ...invariantResults.filter(i => !i.pass)];
      if (failures.length === 0) {
        console.log(` PASS (${fStr}, ${iStr})`);
      } else {
        console.log(` FAIL (${fStr}, ${iStr})`);
        for (const f of failures) {
          console.log(`    FAIL  ${f.field || f.name}: ${f.detail}`);
        }
      }
    }
  }

  // ── Cross-run consistency (full mode only, 3+ valid briefs) ────────
  if (IS_FULL) {
    // Collect briefs from successful runs (stored during run loop)
    const validBriefs = companyResults.runs
      .filter(r => r._brief)
      .map(r => r._brief);

    const consistency = checkCrossRunConsistency(validBriefs);
    companyResults.consistency = consistency;

    for (const c of consistency) {
      totalConsistency++;
      if (c.pass) passedConsistency++;
      else failedConsistency++;
    }

    if (!JSON_OUT && consistency.length > 0) {
      const cPass = consistency.filter(c => c.pass).length;
      const cTotal = consistency.length;
      const cFails = consistency.filter(c => !c.pass);
      if (cFails.length === 0) {
        console.log(`    Cross-run consistency: ${cPass}/${cTotal} PASS`);
      } else {
        console.log(`    Cross-run consistency: ${cPass}/${cTotal} (${cFails.length} FAIL)`);
        for (const f of cFails) {
          console.log(`      FAIL  ${f.detail}`);
        }
      }
    }
  }

  results.push(companyResults);
}

// ── Report ────────────────────────────────────────────────────────────
const totalFailures = failedFacts + failedInvariants + failedConsistency;

// Strip _brief from run results before serialization (trade-secret / payload bloat)
for (const c of results) {
  for (const r of c.runs) {
    delete r._brief;
  }
}

if (JSON_OUT) {
  const report = {
    mode: IS_FULL ? "full" : "lite",
    timestamp: new Date().toISOString(),
    summary: {
      totalFacts, passedFacts, failedFacts,
      totalInvariants, passedInvariants, failedInvariants,
      ...(IS_FULL ? { totalConsistency, passedConsistency, failedConsistency } : {}),
    },
    companies: results,
  };
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`SUMMARY: ${passedFacts + passedInvariants + passedConsistency} passed, ${totalFailures} failed`);
  console.log(`  Facts:       ${passedFacts}/${totalFacts} passed`);
  console.log(`  Invariants:  ${passedInvariants}/${totalInvariants} passed`);
  if (IS_FULL) {
    console.log(`  Consistency: ${passedConsistency}/${totalConsistency} passed`);
  }
  console.log(`${"=".repeat(60)}`);

  if (totalFailures > 0) {
    console.log(`\nFAILURES:`);
    for (const c of results) {
      // Per-run failures (facts + invariants)
      for (const r of c.runs) {
        const failures = [...(r.facts || []).filter(f => !f.pass), ...(r.invariants || []).filter(i => !i.pass)];
        if (failures.length) {
          console.log(`  ${c.name} (run ${r.run}):`);
          for (const f of failures) {
            console.log(`    ${f.field || f.name}: ${f.detail}`);
          }
        }
      }
      // Cross-run consistency failures
      const cFails = (c.consistency || []).filter(c => !c.pass);
      if (cFails.length) {
        console.log(`  ${c.name} (cross-run consistency):`);
        for (const f of cFails) {
          console.log(`    ${f.field}: ${f.detail}`);
        }
      }
    }
  }
}

// Save report to file
try {
  const reportPath = join(__dirname, "reports", `report-${IS_FULL ? "full" : "lite"}-${new Date().toISOString().slice(0, 10)}.json`);
  const report = {
    mode: IS_FULL ? "full" : "lite",
    timestamp: new Date().toISOString(),
    summary: {
      totalFacts, passedFacts, failedFacts,
      totalInvariants, passedInvariants, failedInvariants,
      ...(IS_FULL ? { totalConsistency, passedConsistency, failedConsistency } : {}),
    },
    companies: results,
  };
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  if (!JSON_OUT) console.log(`\nReport saved: ${reportPath}`);
} catch {}

process.exit(totalFailures > 0 ? 1 : 0);
