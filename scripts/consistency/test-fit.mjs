#!/usr/bin/env node
// scripts/consistency/test-fit.mjs
//
// Companion to test-icp.mjs. Measures fit-score consistency for the
// (seller, account) pairs that matter:
//   - Loads each seller's most recent ICP from results/<seller>/run-1.json
//   - Picks 25 sample accounts from src/data/sampleAccounts.js
//   - Runs the SAME scoreFit prompt the live app uses, N times per seller
//   - Reports per-(seller, account) score variance + label drift
//
// Usage:
//   node scripts/consistency/test-fit.mjs            # N=3, all sellers from sellers.json
//   N=5 node scripts/consistency/test-fit.mjs        # more iterations
//
// Cost: ~$0.05 per scoring batch. With 8 sellers × 3 runs × 2 batches
// (25 accounts in batches of 20) = ~48 calls = ~$2.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const RESULTS_DIR = path.join(__dirname, "results");
const SELLERS_PATH = path.join(__dirname, "sellers.json");
const SAMPLE_PATH = path.join(ROOT, "src", "data", "sampleAccounts.js");

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
  console.error("ERROR: ANTHROPIC_API_KEY not found");
  process.exit(1);
}

const MODEL = "claude-haiku-4-5-20251001";
const N = parseInt(process.env.N || "3", 10);

// ── Load 25 representative sample accounts ──────────────────────────────────
function loadSamples() {
  const raw = fs.readFileSync(SAMPLE_PATH, "utf8");
  // Extract everything between [ and ]; eval-style parse is unsafe but this
  // file is local and we're parsing a known shape. Use Function to scope.
  const match = raw.match(/SAMPLE_ROWS\s*=\s*\[([\s\S]*)\];/);
  if (!match) throw new Error("Couldn't find SAMPLE_ROWS in sampleAccounts.js");
  const arr = new Function(`return [${match[1]}];`)();
  return arr;
}

// Pick a 25-account cross-section spanning industries (2-3 from each
// likely-fit cohort for the digital-rewards space).
function pickTwentyFive(samples) {
  const want = {
    "Banking": 3,
    "Insurance": 3,
    "Health Insurance": 2,
    "Healthcare Providers": 2,
    "Retail & E-commerce": 4,
    "Consumer Goods": 3,
    "Technology / SaaS": 3,
    "Hospitality & Travel": 3,
    "Manufacturing": 1,
    "Professional Services": 1,
  };
  const out = [];
  const counts = {};
  for (const row of samples) {
    const n = want[row.industry] || 0;
    counts[row.industry] = counts[row.industry] || 0;
    if (counts[row.industry] < n) {
      out.push(row);
      counts[row.industry]++;
    }
  }
  return out;
}

// ── Anthropic call ──────────────────────────────────────────────────────────
async function callAI(prompt) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 2500,
          temperature: 0,
          messages: [
            { role: "user", content: prompt },
            { role: "assistant", content: "{" },
          ],
        }),
      });
      const d = await r.json();
      if (d.error) {
        const t = d.error.type;
        if ((t === "overloaded_error" || t === "rate_limit_error") && attempt < 2) {
          const wait = t === "overloaded_error" ? [2000, 5000][attempt] : 15000;
          console.warn(`  [${t}] retrying in ${wait/1000}s`);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        console.warn(`  [api error]`, JSON.stringify(d.error).slice(0,200));
        return { error: d.error };
      }
      const raw = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
      if (!raw) {
        console.warn(`  [empty response] content blocks:`, JSON.stringify(d.content||[]).slice(0,200));
        return null;
      }
      const text = raw.startsWith("{") ? raw : "{" + raw;
      const last = text.lastIndexOf("}");
      if (last <= 0) {
        console.warn(`  [no JSON braces] preview:`, text.slice(0,160));
        return null;
      }
      try { return JSON.parse(text.slice(0, last + 1)); }
      catch (e) {
        console.warn(`  [parse fail] ${e.message} preview:`, text.slice(0,160));
        return null;
      }
    } catch (e) {
      console.warn("fetch error:", e.message);
      if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

// ── Build the same scoreFit prompt the live app uses ────────────────────────
function buildScorePrompt(seller, icp, accounts) {
  const sellerCtx = `Seller: ${seller.url}`;
  const icpContext = icp?.icp
    ? `\nSELLER ICP: Target industries: ${(icp.icp.industries||[]).join(", ")} | Size: ${icp.icp.companySize||"any"} | Buyer: ${(icp.icp.buyerPersonas||[]).join(", ")} | Disqualifiers: ${(icp.icp.disqualifiers||[]).join(", ")}`
    : "";
  const companies = accounts.map(m => `${m.company}|${m.industry||"Unknown"}|${m.company_url||""}`).join("\n");
  return `You are a B2B sales strategist. Score ICP fit for each company below.

━━━ SCORE (0-100, single integer) ━━━
Band mapping — score MUST match label:
  75-100 → "Strong Fit"     — clear ICP match, buyer accessible, reasonable cycle
  50-74  → "Potential Fit"  — partial match, needs specific angle or workaround
   0-49  → "Poor Fit"        — structural barrier (wrong size, industry, procurement, incumbent lock)

━━━ INTERNAL SIGNALS (use to decide score — do NOT mention in 'reason') ━━━
High-friction industries (score 5-25): heavy manufacturing, aerospace/defense prime contractors, telecom incumbents, energy utilities, mass-market retail >100K employees, top-5 US banks.
Underserved high-fit segments (score 60-80): large private insurance/finance, private professional services, regional/community banks, healthcare IT, CPG personal care.
Ownership adjustments: VC-backed +5 · PE-backed = cost/margin-driven buyer · Private +5 vs equivalent public peer.
Size penalty: >200K employees and seller is early-stage (Seed/Series A) = procurement barrier, -15.
Funding signal: target raised <12 months ago = active buying window +8.

━━━ OUTPUT LANGUAGE RULES ━━━
- 'label' MUST be exactly one of: "Strong Fit" | "Potential Fit" | "Poor Fit". No variations.
- 'reason' is ONE plain-English sentence. No "tier", "wall", "band", "bucket".
- Do not include the score number inside the reason.

SELLER: ${sellerCtx.slice(0, 300)}${icpContext}

For orgSize: provide approximate employee count range.

COMPANIES (Name|Industry|URL):
${companies}

Return ONLY raw JSON, start with {:
{"scores":[{"company":"exact name","score":85,"label":"Strong Fit","reason":"...","orgSize":"~200K employees","ownership":"Public","ownershipType":"public"}]}`;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const { sellers } = JSON.parse(fs.readFileSync(SELLERS_PATH, "utf8"));
  const allSamples = loadSamples();
  const targets = pickTwentyFive(allSamples);

  console.log(`\n━━━ Fit-score consistency test ━━━`);
  console.log(`Sellers: ${sellers.length} | Accounts: ${targets.length} | Runs/seller: ${N}`);
  console.log(`Estimated cost: ~$${(sellers.length * N * 2 * 0.04).toFixed(2)}\n`);

  let totalIn = 0, totalOut = 0;
  const report = { sellers: [] };

  for (const seller of sellers) {
    const sellerSlug = seller.url.replace(/[^a-z0-9]/gi, "_");
    const icpPath = path.join(RESULTS_DIR, sellerSlug, "run-1.json");
    if (!fs.existsSync(icpPath)) {
      console.log(`─── ${seller.url} — SKIP (no ICP at ${icpPath})`);
      continue;
    }
    const icpRun = JSON.parse(fs.readFileSync(icpPath, "utf8"));
    const icp = icpRun.icp;
    if (!icp?.icp) {
      console.log(`─── ${seller.url} — SKIP (ICP unusable: ${JSON.stringify(icp).slice(0,80)})`);
      continue;
    }
    console.log(`\n─── ${seller.url} ───`);
    console.log(`    ICP: ${icp.marketCategory||"?"} → industries: ${(icp.icp.industries||[]).slice(0,3).join(", ")}`);

    const fitDir = path.join(RESULTS_DIR, sellerSlug, "fit");
    fs.mkdirSync(fitDir, { recursive: true });

    // Per-account score arrays across N runs
    const scoresByCompany = {};
    targets.forEach(t => { scoresByCompany[t.company] = []; });

    for (let run = 1; run <= N; run++) {
      process.stdout.write(`  run ${run}/${N}...`);
      // Score in batches of 20 — same as live app
      const batches = [];
      for (let i = 0; i < targets.length; i += 20) batches.push(targets.slice(i, i + 20));
      const allScores = [];
      for (const batch of batches) {
        const result = await callAI(buildScorePrompt(seller, icp, batch));
        if (result?.scores) allScores.push(...result.scores);
      }
      console.log(` ok (${allScores.length}/${targets.length} scored)`);
      // Record into per-company arrays
      allScores.forEach(s => {
        if (scoresByCompany[s.company]) {
          scoresByCompany[s.company].push({ score: s.score, label: s.label, reason: s.reason });
        }
      });
      fs.writeFileSync(path.join(fitDir, `run-${run}.json`), JSON.stringify(allScores, null, 2));
    }

    // Analyze per-(seller, account) consistency
    const perAccount = targets.map(t => {
      const runs = scoresByCompany[t.company] || [];
      if (runs.length < 2) return { company: t.company, industry: t.industry, runs: runs.length, status: "insufficient", labels: [], scores: [] };
      const scores = runs.map(r => r.score).filter(n => typeof n === "number");
      const labels = runs.map(r => r.label).filter(Boolean);
      if (!scores.length) return { company: t.company, industry: t.industry, runs: runs.length, status: "no scores", labels: [...new Set(labels)], scores: [] };
      const min = Math.min(...scores), max = Math.max(...scores);
      const mean = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const labelStable = new Set(labels).size === 1;
      return {
        company: t.company,
        industry: t.industry,
        runs: runs.length,
        scores, mean, spread: max - min,
        labelStable, labels: [...new Set(labels)],
      };
    });

    const stable    = perAccount.filter(a => a.labelStable && a.spread <= 5).length;
    const wobbly    = perAccount.filter(a => a.labelStable && a.spread > 5 && a.spread <= 15).length;
    const unstable  = perAccount.filter(a => a.labels && (!a.labelStable || a.spread > 15)).length;
    const missing   = perAccount.filter(a => a.status).length;

    console.log(`  ✓ STABLE     (label same, score spread ≤5):  ${stable}/${targets.length}`);
    console.log(`  ~ WOBBLY     (label same, spread 6-15):       ${wobbly}/${targets.length}`);
    console.log(`  ✗ UNSTABLE   (label flips OR spread >15):     ${unstable}/${targets.length}`);

    if (missing > 0) {
      console.log(`  ⚠ ${missing} accounts had no usable scores (API may have returned different shape)`);
    }
    if (unstable > 0) {
      console.log(`  Unstable accounts:`);
      perAccount.filter(a => !a.status && (!a.labelStable || a.spread > 15)).slice(0, 5).forEach(a => {
        console.log(`    · ${a.company} (${a.industry}) → scores ${JSON.stringify(a.scores)}, labels [${(a.labels||[]).join("|")}]`);
      });
    }

    report.sellers.push({
      url: seller.url,
      icpCategory: icp.marketCategory,
      summary: { stable, wobbly, unstable, total: targets.length },
      perAccount,
    });
  }

  fs.writeFileSync(path.join(RESULTS_DIR, "fit-report.json"), JSON.stringify(report, null, 2));
  console.log(`\n━━━ Done ━━━`);
  console.log(`Report: ${path.relative(ROOT, path.join(RESULTS_DIR, "fit-report.json"))}`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
