#!/usr/bin/env node
// scripts/variance-test.mjs
//
// Fit score variance test — calls the same scoring prompt N times
// against the same companies and reports per-company variance.
//
// Usage: node scripts/variance-test.mjs
//
// Requires ANTHROPIC_API_KEY in .env.local

import { readFileSync } from "fs";

// Load API key — try .env.test (Vercel-pulled) first, then .env.local
let API_KEY;
for (const f of [".env.production", ".env.test", ".env.local"]) {
  try {
    const envFile = readFileSync(new URL("../" + f, import.meta.url), "utf8");
    // Try non-VITE key first (server key), then VITE key
    const serverKey = envFile.match(/^ANTHROPIC_API_KEY="(sk-[^"]+)"/m)?.[1];
    const viteKey = envFile.match(/VITE_ANTHROPIC_API_KEY="(sk-[^"]+)"/m)?.[1];
    API_KEY = serverKey || viteKey || API_KEY;
    if (API_KEY) break;
  } catch {}
}
if (!API_KEY) { console.error("Missing ANTHROPIC_API_KEY"); process.exit(1); }

const ITERATIONS = 3;
const MODEL = "claude-haiku-4-5-20251001";

// ── Test companies (from ragnerock session) ──
const COMPANIES = [
  "Bloomberg|Technology / SaaS|",
  "PwC|Professional Services|",
  "KPMG|Professional Services|",
  "Deloitte|Professional Services|",
  "Citadel|Fintech|",
  "UBS|Banking|",
  "DRW|Fintech|",
  "Citi|Banking|",
  "Barclays|Banking|",
  "Optiver|Fintech|",
  "Upstart|Fintech|",
  "Humana|Healthcare|",
  "Anthem|Healthcare|",
  "Zillow|Real Estate|",
  "Qualcomm|Technology / SaaS|",
];

// ── Seller context (will be overridden if ICP data is passed) ──
let SELLER_CTX = "Ragnerock (Enterprise Data Intelligence & Research Automation) — research intelligence platform that consolidates ad-hoc AI pipelines into a single system for extracting, structuring, and analyzing large volumes of unstructured data at scale. Serves data-driven enterprises in finance, healthcare, legal, and pharmaceuticals.";
let ICP_CONTEXT = `
SELLER ICP: Target industries: Finance, Professional Services | Size: 500-4,999 employees | Buyer: CTO, VP Engineering, Head of Data | Disqualifiers: No cloud data warehouse; No data governance framework; Research team <10 FTE; Strong internal build bias with dedicated data engineering capacity
KNOWN CUSTOMER ANALOGUES: (none — early-stage with limited public references)
SELLER DIFFERENTIATORS: Purpose-built for research intelligence workflows; Native cloud warehouse integration (Snowflake, BigQuery, Databricks); Queryable data creation with SQL and semantic search; Traceable validated results with audit trail (HIPAA, SOC 2, ISO 27001)
COMPETITIVE ALTERNATIVES: Status quo / do nothing; Build in-house; Palantir Foundry; Alteryx; Apache Airflow + custom Python`;

// Check for ICP override file
try {
  const icpFile = readFileSync(new URL("./variance-icp.json", import.meta.url), "utf8");
  const icp = JSON.parse(icpFile);
  if (icp.sellerName) SELLER_CTX = `${icp.sellerName} (${icp.marketCategory || "unknown category"}) — ${icp.sellerDescription || ""}`;
  if (icp.icp) {
    ICP_CONTEXT = `\nSELLER ICP: Target industries: ${(icp.icp.industries || []).join(", ")} | Size: ${icp.icp.companySize || "any"} | Buyer: ${(icp.icp.buyerPersonas || []).map(p => typeof p === "object" ? p.title : p).join(", ")} | Disqualifiers: ${(icp.icp.disqualifiers || []).join(", ")}`;
    if (icp.icp.customerExamples?.length) ICP_CONTEXT += `\nKNOWN CUSTOMER ANALOGUES: ${icp.icp.customerExamples.join(", ")}`;
    if (icp.icp.uniqueDifferentiators?.length) ICP_CONTEXT += `\nSELLER DIFFERENTIATORS: ${icp.icp.uniqueDifferentiators.join(" · ")}`;
  }
  console.log("Loaded ICP from variance-icp.json");
} catch { /* use defaults */ }

// ── Build the same prompt the app uses (fixed-point scoring) ──
function buildPrompt(companies) {
  return `You are a sales strategist scoring ICP fit. Use THREE dimensions with FIXED-POINT scoring.
CRITICAL: Scores must be DETERMINISTIC. For the same company, the same inputs must produce the same score every time. Use the fixed-point tables below — do NOT interpolate or use judgment within ranges.

━━━ DIMENSION 1: ICP ALIGNMENT (40 points max) ━━━
Pick dim1 using this 3-step lookup. Do NOT do arithmetic — just pick the value from each row.

STEP A — INDUSTRY: Seller's target industries: [Finance, Professional Services]
  Pick ONE:
  32 = target's industry IS one of the seller's target industries, or a direct sub-segment (e.g. "Fintech" matches "Finance")
  26 = target is in a DIFFERENT industry but shares the same buyer persona or problem domain
  20 = no meaningful industry connection
  10 = HIGH-FRICTION INDUSTRY
  RULE: sub-sectors always match their parent. Fintech=Finance. HealthIT=Healthcare. AdTech=Media.

STEP B — SIZE: Seller's target: 500-4,999 employees | Brackets: 1-49 | 50-499 | 500-4,999 | 5,000-49,999 | 50,000+
  Add to your Step A value:
  +5 = target is in the SAME bracket as seller's ICP
  +2 = target is ONE bracket away (adjacent)
  +0 = target is 2+ brackets away

STEP C — OWNERSHIP:
  Add to your Step A+B value:
  +3 = VC-backed or PE-backed
  +1 = private
  +0 = public

dim1 = Step A + Step B + Step C (clamp to 0-40)
IMPORTANT: Step A dominates. Most dim1 scores should be one of: 35-40 (industry match + size match), 28-33 (industry match + size mismatch), 23-27 (adjacent industry), or 20-22 (no match).

━━━ DIMENSION 2: CUSTOMER SIMILARITY (30 points max) ━━━
No named customers available — score this dimension at 15 (fixed neutral) for ALL targets.

━━━ DIMENSION 3: COMPETITIVE LANDSCAPE (30 points max) ━━━
Score using EXACTLY these fixed values based on VERIFIABLE knowledge only:
  26 = you can name the SPECIFIC competitor product the target uses AND that competitor is in the seller's competitive alternatives list below
  20 = DEFAULT — use this for ALL other cases, including: no known incumbent, uncertain, probable but unverified, or the target uses a vendor NOT in the seller's competitive alternatives list
  10 = target has a PUBLICLY DOCUMENTED enterprise-wide deployment of a deep platform incumbent (e.g. Palantir Foundry, SAP, Oracle) with multi-year contract — only score 10 if you can cite the specific deployment
CONSISTENCY RULE: Score 26 ONLY if you can name "Company X uses [specific product from competitive list above]." If you cannot complete that sentence with certainty, score 20. This is the #1 rule for reducing score variance.

━━━ TOTAL SCORE = dim1 + dim2 + dim3 (max 100) ━━━
Band mapping:
  75-100 → "Strong Fit"
  55-74  → "Potential Fit"
   0-54  → "Poor Fit"

━━━ OUTPUT RULES ━━━
- Return THREE separate dimension scores (dim1, dim2, dim3).
- Each dimension score MUST be one of the fixed values above.
- NEVER invent facts.

SELLER: ${SELLER_CTX}
${ICP_CONTEXT}

COMPANIES (Name|Industry|URL):
${companies}

Return ONLY raw JSON, start with {:
{"scores":[{"company":"exact name","dim1":0,"dim2":0,"dim3":0}]}`;
}

async function callClaude(prompt) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      temperature: 0,
      system: "You are a JSON API. Output only valid JSON.",
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: "{" },
      ],
    }),
  });
  const d = await r.json();
  if (d.error) { console.error("API error:", d.error); return null; }
  const raw = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
  const jsonStr = raw.startsWith("{") ? raw : "{" + raw;
  try { return JSON.parse(jsonStr); } catch { console.error("JSON parse failed:", raw.slice(0, 200)); return null; }
}

// ── Run test ──
async function run() {
  console.log(`\n═══ FIT SCORE VARIANCE TEST ═══`);
  console.log(`Model: ${MODEL} | Temperature: 0 | Iterations: ${ITERATIONS}`);
  console.log(`Companies: ${COMPANIES.length} | Seller: ${SELLER_CTX.slice(0, 80)}...\n`);

  const companiesStr = COMPANIES.join("\n");
  const allResults = {}; // company → [{dim1, dim2, dim3, total}, ...]

  for (let i = 0; i < ITERATIONS; i++) {
    console.log(`  Run ${i + 1}/${ITERATIONS}...`);
    const result = await callClaude(buildPrompt(companiesStr));
    if (!result?.scores) { console.error(`  Run ${i + 1} failed — no scores returned`); continue; }

    result.scores.forEach(s => {
      const d1 = Math.max(0, Math.min(40, Number(s.dim1) || 0));
      const d2 = Math.max(0, Math.min(30, Number(s.dim2) || 0));
      const d3 = Math.max(0, Math.min(30, Number(s.dim3) || 0));
      const total = d1 + d2 + d3;
      if (!allResults[s.company]) allResults[s.company] = [];
      allResults[s.company].push({ dim1: d1, dim2: d2, dim3: d3, total, run: i + 1 });
    });

    // Small delay between runs to avoid rate limits
    if (i < ITERATIONS - 1) await new Promise(r => setTimeout(r, 2000));
  }

  // ── Analyze variance ──
  console.log(`\n═══ RESULTS ═══\n`);
  console.log(`${"Company".padEnd(15)} | ${"Scores".padEnd(20)} | Var | ${"Dim1".padEnd(12)} | ${"Dim2".padEnd(12)} | ${"Dim3".padEnd(12)} | Label Flip?`);
  console.log("─".repeat(105));

  let totalVariance = 0;
  let companiesWithVariance = 0;
  let labelFlips = 0;
  const issues = [];

  Object.entries(allResults)
    .sort((a, b) => {
      const varA = Math.max(...a[1].map(r => r.total)) - Math.min(...a[1].map(r => r.total));
      const varB = Math.max(...b[1].map(r => r.total)) - Math.min(...b[1].map(r => r.total));
      return varB - varA;
    })
    .forEach(([company, runs]) => {
      if (runs.length < 2) return;

      const totals = runs.map(r => r.total);
      const d1s = runs.map(r => r.dim1);
      const d2s = runs.map(r => r.dim2);
      const d3s = runs.map(r => r.dim3);

      const variance = Math.max(...totals) - Math.min(...totals);
      const d1var = Math.max(...d1s) - Math.min(...d1s);
      const d2var = Math.max(...d2s) - Math.min(...d2s);
      const d3var = Math.max(...d3s) - Math.min(...d3s);

      const labels = totals.map(t => t >= 75 ? "Strong" : t >= 55 ? "Potential" : "Poor");
      const hasFlip = new Set(labels).size > 1;

      totalVariance += variance;
      if (variance > 0) companiesWithVariance++;
      if (hasFlip) labelFlips++;

      const flag = variance > 5 ? " ⚠️" : variance > 0 ? " ·" : " ✓";
      console.log(
        `${company.padEnd(15)} | ${totals.join(", ").padEnd(20)} | ${String(variance).padEnd(3)} | ${d1s.join(",").padEnd(12)} | ${d2s.join(",").padEnd(12)} | ${d3s.join(",").padEnd(12)} | ${hasFlip ? "YES ⚠️" : "no"}${flag}`
      );

      if (variance > 5) {
        // Identify which dimension caused the variance
        const maxDimVar = Math.max(d1var, d2var, d3var);
        const culprit = maxDimVar === d1var ? "Dim1 (ICP Alignment)" : maxDimVar === d2var ? "Dim2 (Customer Similarity)" : "Dim3 (Competitive Landscape)";
        issues.push({ company, variance, culprit, d1var, d2var, d3var, totals, hasFlip });
      }
    });

  const companyCount = Object.keys(allResults).filter(k => allResults[k].length >= 2).length;
  const avgVariance = companyCount > 0 ? (totalVariance / companyCount).toFixed(1) : 0;

  console.log("─".repeat(105));
  console.log(`\n═══ SUMMARY ═══`);
  console.log(`  Companies tested:    ${companyCount}`);
  console.log(`  Avg variance:        ${avgVariance} points`);
  console.log(`  Companies w/ var>0:  ${companiesWithVariance} (${companyCount > 0 ? Math.round(companiesWithVariance / companyCount * 100) : 0}%)`);
  console.log(`  Companies w/ var>5:  ${issues.length}`);
  console.log(`  Label flips:         ${labelFlips}`);

  if (issues.length > 0) {
    console.log(`\n═══ ROOT CAUSES (variance > 5 points) ═══`);
    issues.forEach(i => {
      console.log(`  ${i.company}: ${i.variance}pt swing (${i.totals.join(" → ")})`);
      console.log(`    Primary cause: ${i.culprit} (${Math.max(i.d1var, i.d2var, i.d3var)}pt swing)`);
      console.log(`    Dim breakdown: D1±${i.d1var}  D2±${i.d2var}  D3±${i.d3var}`);
      if (i.hasFlip) console.log(`    ⚠️  LABEL FLIP — score crossed a band boundary`);
    });
  }

  console.log(`\n═══ DONE ═══\n`);
}

run().catch(console.error);
