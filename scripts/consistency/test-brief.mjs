#!/usr/bin/env node
// scripts/consistency/test-brief.mjs
//
// Brief consistency test. For each seller, picks the strongest-fit
// account from the fit-report, then runs the same 5-micro-call brief
// pipeline N times to measure field-level drift.
//
// Tests the structured fields that matter for sales: companySnapshot,
// executives names+titles, strategicTheme, openingAngle, solutionMapping
// products, key contacts. Narrative drift in long fields is expected
// and reported separately.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const RESULTS_DIR = path.join(__dirname, "results");
const SELLERS_PATH = path.join(__dirname, "sellers.json");
const SAMPLE_PATH = path.join(ROOT, "src", "data", "sampleAccounts.js");
const FIT_REPORT = path.join(RESULTS_DIR, "fit-report.json");

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
if (!API_KEY) { console.error("ERROR: ANTHROPIC_API_KEY not found"); process.exit(1); }

const MODEL = "claude-haiku-4-5-20251001";
const N = parseInt(process.env.N || "3", 10);

function loadSamples() {
  const raw = fs.readFileSync(SAMPLE_PATH, "utf8");
  const m = raw.match(/SAMPLE_ROWS\s*=\s*\[([\s\S]*)\];/);
  if (!m) throw new Error("No SAMPLE_ROWS");
  return new Function(`return [${m[1]}];`)();
}

async function callAI(prompt, maxTok=2000) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type":"application/json", "x-api-key":API_KEY, "anthropic-version":"2023-06-01" },
        body: JSON.stringify({
          model: MODEL, max_tokens: maxTok, temperature: 0,
          messages: [
            { role:"user", content: prompt },
            { role:"assistant", content: "{" },
          ],
        }),
      });
      const d = await r.json();
      if (d.error) {
        const t = d.error.type;
        if ((t==="overloaded_error"||t==="rate_limit_error") && attempt < 2) {
          const w = t==="overloaded_error" ? [2000,5000][attempt] : 15000;
          await new Promise(r => setTimeout(r, w));
          continue;
        }
        return { error: d.error };
      }
      const raw = (d.content||[]).filter(b => b.type==="text").map(b => b.text).join("").trim();
      if (!raw) return null;
      const text = raw.startsWith("{") ? raw : "{" + raw;
      const last = text.lastIndexOf("}");
      try { return JSON.parse(text.slice(0, last+1)); } catch { return null; }
    } catch (e) {
      if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

// Mirror the live generateBrief base context (App.jsx ~line 437)
function baseCtx({ co, sellerUrl }) {
  return `B2B sales brief about TARGET PROSPECT "${co}" for seller at ${sellerUrl}.\n`
       + `RULE: All fields describe ${co} NOT the seller. ASCII only. Empty string if unknown, never "N/A".\n`
       + `CONSISTENCY: Return EXACTLY the structure shown — same field names, same array lengths.\n\n`
       + `SELLER CONTEXT: ${sellerUrl}\n`
       + `DEAL: Target outcome research\n\n`;
}

// Run all 5 micro-calls in parallel like the live app (excluding p5
// web_search since results vary based on what's indexed at fetch time)
async function runBrief({ seller, account }) {
  const co = account.company;
  const base = baseCtx({ co, sellerUrl: seller.url });
  const p1 = callAI(base + `Return ONLY raw JSON for the company overview:
{"companySnapshot":"3-4 sentences",`+
`"revenue":"e.g. $2.4B","publicPrivate":"e.g. Public (NYSE:MCD)","employeeCount":"e.g. ~200K",`+
`"headquarters":"City, State","founded":"Year","website":"domain.com",`+
`"competitors":["A","B","C"]}`, 1200);
  const p2 = callAI(base + `Return ONLY raw JSON for the 3 key executives at ${co}:
{"keyExecutives":[`+
`{"name":"REQUIRED real CEO name","title":"CEO","background":"1 sentence"},`+
`{"name":"REQUIRED real CFO or COO name","title":"exact title","background":"1 sentence"},`+
`{"name":"REQUIRED real CHRO or CPO name","title":"exact title","background":"1 sentence"}]}`, 800);
  const p3 = callAI(base + `Return ONLY raw JSON for strategy:
{"strategicTheme":"2-3 sentences on ${co}'s direction",`+
`"openingAngle":"1-2 sharp sentences a rep would say in cold outreach"}`, 800);
  const p4 = callAI(base + `Return ONLY raw JSON for solution mapping (seller is ${seller.url}):
{"solutionMapping":[`+
`{"product":"Specific ${seller.url} offering","fit":"Job-to-be-done"},`+
`{"product":"Second offering","fit":""},`+
`{"product":"Third offering","fit":""}]}`, 1000);
  const [r1, r2, r3, r4] = await Promise.all([p1, p2, p3, p4]);
  return {
    snapshot: r1?.companySnapshot || "",
    revenue: r1?.revenue || "",
    publicPrivate: r1?.publicPrivate || "",
    employees: r1?.employeeCount || "",
    headquarters: r1?.headquarters || "",
    competitors: r1?.competitors || [],
    executives: (r2?.keyExecutives||[]).map(e => `${e.name||""}|${e.title||""}`),
    strategicTheme: r3?.strategicTheme || "",
    openingAngle: r3?.openingAngle || "",
    products: (r4?.solutionMapping||[]).filter(s => s?.product).map(s => s.product),
  };
}

// Pick the strongest-fit account per seller from fit-report.json. Falls
// back to any sample account if no fit data exists for that seller.
function pickAccountForSeller(sellerUrl, fitReport, samples) {
  const slug = sellerUrl.replace(/[^a-z0-9]/gi, "_");
  const sellerFit = (fitReport.sellers||[]).find(s => s.url === sellerUrl);
  if (sellerFit) {
    // Best Strong-Fit, fall back to any with score data
    const ranked = (sellerFit.perAccount||[])
      .filter(a => a.scores && a.scores.length > 0)
      .map(a => ({ ...a, mean: a.mean || Math.round(a.scores.reduce((x,y)=>x+y,0)/a.scores.length) }))
      .sort((a, b) => b.mean - a.mean);
    if (ranked[0]) {
      const sample = samples.find(s => s.company === ranked[0].company);
      if (sample) return sample;
    }
  }
  // Fallback
  return samples.find(s => s.industry === "Banking") || samples[0];
}

async function main() {
  const { sellers } = JSON.parse(fs.readFileSync(SELLERS_PATH, "utf8"));
  const fitReport = fs.existsSync(FIT_REPORT) ? JSON.parse(fs.readFileSync(FIT_REPORT,"utf8")) : { sellers:[] };
  const samples = loadSamples();

  console.log(`\n━━━ Brief consistency test ━━━`);
  console.log(`Sellers: ${sellers.length} | Runs/scenario: ${N} | Per run: 4 micro-calls in parallel`);
  console.log(`Estimated cost: ~$${(sellers.length * N * 4 * 0.01).toFixed(2)}\n`);

  const report = { scenarios: [] };

  for (const seller of sellers) {
    const account = pickAccountForSeller(seller.url, fitReport, samples);
    console.log(`\n─── ${seller.url} → ${account.company} (${account.industry}) ───`);
    const slug = seller.url.replace(/[^a-z0-9]/gi,"_") + "__" + account.company.replace(/[^a-z0-9]/gi,"_");
    const dir = path.join(RESULTS_DIR, "brief", slug);
    fs.mkdirSync(dir, { recursive: true });

    const runs = [];
    for (let i = 1; i <= N; i++) {
      process.stdout.write(`  run ${i}/${N}...`);
      const t0 = Date.now();
      const result = await runBrief({ seller, account });
      const ms = Date.now() - t0;
      console.log(` ok (${ms}ms)`);
      fs.writeFileSync(path.join(dir, `run-${i}.json`), JSON.stringify(result, null, 2));
      runs.push(result);
    }

    // Consistency analysis
    const fields = ["snapshot","revenue","publicPrivate","employees","headquarters","strategicTheme","openingAngle"];
    const arrayFields = { competitors: "competitors", executives: "executives", products: "products" };

    const fieldDrift = {};
    fields.forEach(f => {
      const vals = runs.map(r => (r[f]||"").trim());
      const unique = new Set(vals).size;
      fieldDrift[f] = { unique, sampleA: vals[0]?.slice(0,80) || "", sampleB: vals[1]?.slice(0,80) || "" };
    });
    Object.entries(arrayFields).forEach(([k]) => {
      // Compare arrays as Sets so order doesn't break stability
      const sets = runs.map(r => JSON.stringify([...new Set(r[k]||[])].sort()));
      const unique = new Set(sets).size;
      const sampleA = (runs[0][k]||[]).slice(0,3).join(", ");
      fieldDrift[k] = { unique, sampleA, sampleB: (runs[1]?.[k]||[]).slice(0,3).join(", ") };
    });

    const stable = Object.values(fieldDrift).filter(f => f.unique === 1).length;
    const total  = Object.keys(fieldDrift).length;
    console.log(`  ${stable}/${total} fields stable`);
    Object.entries(fieldDrift).filter(([_,d])=>d.unique>1).forEach(([k,d])=>{
      console.log(`    drift · ${k}: ${d.unique}/${runs.length} unique`);
      console.log(`      a: ${d.sampleA}`);
      console.log(`      b: ${d.sampleB}`);
    });

    report.scenarios.push({ seller: seller.url, account: account.company, industry: account.industry, runs: runs.length, fieldDrift, stable, total });
  }

  fs.writeFileSync(path.join(RESULTS_DIR, "brief-report.json"), JSON.stringify(report, null, 2));
  console.log(`\n━━━ Done ━━━`);
  console.log(`Report: ${path.relative(ROOT, path.join(RESULTS_DIR, "brief-report.json"))}`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
