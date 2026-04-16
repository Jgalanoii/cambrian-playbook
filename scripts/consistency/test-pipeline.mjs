#!/usr/bin/env node
// scripts/consistency/test-pipeline.mjs
//
// Hypothesis + Discovery-Question consistency tests. Both depend on
// the brief, so we use the brief from results/brief/<slug>/run-1.json
// as fixed input — this isolates the hypothesis/discovery generation
// from any brief-level drift.
//
// Skipped: post-call routing and solution-fit. Both depend on RIVER
// answer capture from a live call, which we don't have synthetic data
// for. They'd need a separate test that generates fake call notes
// then runs the routing prompts.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const RESULTS_DIR = path.join(__dirname, "results");
const SELLERS_PATH = path.join(__dirname, "sellers.json");

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

async function callAI(prompt, maxTok=900) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01"},
        body: JSON.stringify({
          model: MODEL, max_tokens: maxTok, temperature: 0,
          messages: [{role:"user",content:prompt},{role:"assistant",content:"{"}],
        }),
      });
      const d = await r.json();
      if (d.error) {
        const t = d.error.type;
        if ((t==="overloaded_error"||t==="rate_limit_error") && attempt < 2) {
          await new Promise(r => setTimeout(r, t==="overloaded_error" ? [2000,5000][attempt] : 15000));
          continue;
        }
        return { error: d.error };
      }
      const raw = (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      if (!raw) return null;
      const text = raw.startsWith("{") ? raw : "{" + raw;
      const last = text.lastIndexOf("}");
      try { return JSON.parse(text.slice(0, last+1)); } catch { return null; }
    } catch { if (attempt<2) await new Promise(r=>setTimeout(r,2000)); }
  }
  return null;
}

function buildHypothesisPrompt({ co, sellerUrl, brief }) {
  return `You are a senior B2B sales strategist. Build a RIVER hypothesis for a deal between ${sellerUrl} and ${co}.
Brief context:
- Snapshot: ${(brief.snapshot||"").slice(0,300)}
- Strategic theme: ${(brief.strategicTheme||"").slice(0,200)}
- Opening angle: ${brief.openingAngle||""}
- Products: ${(brief.products||[]).join(", ")}

Return ONLY raw JSON:
{"reality":"1-2 sentences on current state","impact":"1-2 sentences on cost of inaction","vision":"1-2 sentences on success","entryPoints":"1-2 sentences on decision-makers","route":"1-2 sentences on fastest path"}`;
}

function buildDiscoveryPrompt({ co, sellerUrl, brief }) {
  return `Generate 2 discovery questions per RIVER stage for a sales call between ${sellerUrl} and ${co}.
Context: ${(brief.snapshot||"").slice(0,200)} | Products: ${(brief.products||[]).join(", ")}

Return ONLY raw JSON. 2 questions per stage:
{"reality":[{"q":"Question 1?"},{"q":"Question 2?"}],"impact":[{"q":""},{"q":""}],"vision":[{"q":""},{"q":""}],"entryPoints":[{"q":""},{"q":""}],"route":[{"q":""},{"q":""}]}`;
}

function listBriefScenarios() {
  const briefDir = path.join(RESULTS_DIR, "brief");
  if (!fs.existsSync(briefDir)) return [];
  return fs.readdirSync(briefDir).map(slug => {
    const briefRun1 = path.join(briefDir, slug, "run-1.json");
    if (!fs.existsSync(briefRun1)) return null;
    const brief = JSON.parse(fs.readFileSync(briefRun1, "utf8"));
    const [sellerSlug, ...accountParts] = slug.split("__");
    return { slug, sellerSlug, accountSlug: accountParts.join("__"), brief };
  }).filter(Boolean);
}

async function main() {
  const { sellers } = JSON.parse(fs.readFileSync(SELLERS_PATH, "utf8"));
  const sellerByslug = Object.fromEntries(sellers.map(s => [s.url.replace(/[^a-z0-9]/gi,"_"), s]));
  const scenarios = listBriefScenarios();
  if (!scenarios.length) {
    console.error("No brief results found. Run test-brief.mjs first.");
    process.exit(1);
  }

  console.log(`\n━━━ Hypothesis + Discovery consistency test ━━━`);
  console.log(`Scenarios: ${scenarios.length} | Runs each: ${N} | Per scenario: ${N*2} calls (1 hyp + 1 disc per run)\n`);

  const report = { hypothesis: [], discovery: [] };

  for (const sc of scenarios) {
    const seller = sellerByslug[sc.sellerSlug];
    if (!seller) { console.warn(`unknown seller slug: ${sc.sellerSlug}`); continue; }
    const co = sc.accountSlug.replace(/_/g, " ").replace(/\s+/g," ").trim();
    console.log(`\n─── ${seller.url} → ${co} ───`);
    const dir = path.join(RESULTS_DIR, "pipeline", sc.slug);
    fs.mkdirSync(dir, { recursive: true });

    // Hypothesis
    const hRuns = [];
    for (let i = 1; i <= N; i++) {
      process.stdout.write(`  hyp ${i}/${N}...`);
      const result = await callAI(buildHypothesisPrompt({ co, sellerUrl: seller.url, brief: sc.brief }), 900);
      console.log(result ? " ok" : " FAIL");
      if (result) hRuns.push(result);
      fs.writeFileSync(path.join(dir, `hyp-${i}.json`), JSON.stringify(result, null, 2));
    }
    if (hRuns.length >= 2) {
      const fields = ["reality","impact","vision","entryPoints","route"];
      const drift = {};
      fields.forEach(f => {
        const vals = hRuns.map(r => (r[f]||"").trim());
        drift[f] = { unique: new Set(vals).size, sample: vals[0]?.slice(0,80)||"" };
      });
      const stable = Object.values(drift).filter(d=>d.unique===1).length;
      console.log(`  hyp: ${stable}/${fields.length} stable`);
      report.hypothesis.push({ scenario: sc.slug, stable, total: fields.length, drift });
    }

    // Discovery
    const dRuns = [];
    for (let i = 1; i <= N; i++) {
      process.stdout.write(`  disc ${i}/${N}...`);
      const result = await callAI(buildDiscoveryPrompt({ co, sellerUrl: seller.url, brief: sc.brief }), 1400);
      console.log(result ? " ok" : " FAIL");
      if (result) dRuns.push(result);
      fs.writeFileSync(path.join(dir, `disc-${i}.json`), JSON.stringify(result, null, 2));
    }
    if (dRuns.length >= 2) {
      const stages = ["reality","impact","vision","entryPoints","route"];
      const drift = {};
      stages.forEach(s => {
        // Compare flattened question sets per stage
        const sets = dRuns.map(r => JSON.stringify(((r[s]||[]).map(q=>q?.q||"").filter(Boolean).sort())));
        drift[s] = { unique: new Set(sets).size, sample: ((dRuns[0][s]||[])[0]?.q||"").slice(0,80) };
      });
      const stable = Object.values(drift).filter(d=>d.unique===1).length;
      console.log(`  disc: ${stable}/${stages.length} stable`);
      report.discovery.push({ scenario: sc.slug, stable, total: stages.length, drift });
    }
  }

  fs.writeFileSync(path.join(RESULTS_DIR, "pipeline-report.json"), JSON.stringify(report, null, 2));
  console.log(`\n━━━ Done ━━━`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
