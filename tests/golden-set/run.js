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

// ── Generate a p1-equivalent brief for a company ──────────────────────
async function generateBrief(company) {
  const co = company.name;
  const url = company.url;

  const prompt =
    `Sales brief about TARGET PROSPECT "${co}" (${url}).\n` +
    `IDENTITY: Research ONLY the company at https://${url}. Do NOT mix facts from different companies with similar names.\n\n` +
    `ACCURACY: NEVER invent facts about ${co}. No fabricated revenue, employee counts, executives, products, partnerships, or acquisitions. If unknown, use an empty string.\n` +
    `EMPTY FIELD RULE: If a fact is unknown, return an EMPTY STRING "". NEVER return "Not found", "Not specified", "Not available", "N/A", "Unknown".\n\n` +
    `Search for "${co}" to get current information, then return ONLY raw JSON for the company overview:\n` +
    `{"companySnapshot":"3-4 sentences: what ${co} does, market position, recent moves.",` +
    `"revenue":"e.g. $2.4B (FY2024) — empty if unknown",` +
    `"publicPrivate":"'Public (NYSE: TICKER)' if currently listed, otherwise 'Private' or 'Private (PE-backed)' or 'Private (acquired by X)' or 'Member-owned'",` +
    `"employeeCount":"e.g. ~200,000 — empty if unknown",` +
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

  results.push(companyResults);
}

// ── Report ────────────────────────────────────────────────────────────
const totalFailures = failedFacts + failedInvariants;

if (JSON_OUT) {
  const report = {
    mode: IS_FULL ? "full" : "lite",
    timestamp: new Date().toISOString(),
    summary: { totalFacts, passedFacts, failedFacts, totalInvariants, passedInvariants, failedInvariants },
    companies: results,
  };
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`SUMMARY: ${passedFacts + passedInvariants} passed, ${totalFailures} failed`);
  console.log(`  Facts:      ${passedFacts}/${totalFacts} passed`);
  console.log(`  Invariants: ${passedInvariants}/${totalInvariants} passed`);
  console.log(`${"=".repeat(60)}`);

  if (totalFailures > 0) {
    console.log(`\nFAILURES:`);
    for (const c of results) {
      for (const r of c.runs) {
        const failures = [...(r.facts || []).filter(f => !f.pass), ...(r.invariants || []).filter(i => !i.pass)];
        if (failures.length) {
          console.log(`  ${c.name} (run ${r.run}):`);
          for (const f of failures) {
            console.log(`    ${f.field || f.name}: ${f.detail}`);
          }
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
    summary: { totalFacts, passedFacts, failedFacts, totalInvariants, passedInvariants, failedInvariants },
    companies: results,
  };
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  if (!JSON_OUT) console.log(`\nReport saved: ${reportPath}`);
} catch {}

process.exit(totalFailures > 0 ? 1 : 0);
