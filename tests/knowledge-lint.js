#!/usr/bin/env node
/**
 * knowledge-lint.js — static analysis for Cambrian Catalyst knowledge layers.
 *
 * Zero LLM cost. Zero npm dependencies (pure Node built-ins).
 * Enforces the Knowledge Layer Anti-Hallucination Standard.
 *
 * Checks:
 *   1. schema            — vertical files export *_INJECTION (+ SCORING + DISCOVERY)
 *   2. citation          — quantitative claims in INJECTION strings carry [verified ...]
 *   3. tier3             — named individuals baked into static INJECTION strings
 *   4. sources           — every file with INJECTION content has a SOURCES block
 *   5. keyword-collision — a keyword appears in 2+ layers (mis-routing risk)
 *   6. keyword-ambiguous — a keyword is a common ambiguous word
 *
 * Usage:  node tests/knowledge-lint.js [--json]
 * Exit:   0 = no hard errors (warnings/notices allowed) · 1 = hard error(s)
 *
 * Requires ESM context ("type":"module" in package.json — standard for Vite).
 * Place at tests/knowledge-lint.js; run from the repo root.
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

// ─────────────────────────── config ───────────────────────────
const CONFIG_PATH = resolve('tests/knowledge-lint.config.json');
const DEFAULTS = {
  knowledgeDir: 'src/data',
  // full standard: must export *_INJECTION, *_SCORING_CONTEXT, *_DISCOVERY_INJECTION
  verticalFiles: [
    'rewardsIncentivesKnowledge.js', 'paymentsKnowledge.js', 'bankingKnowledge.js',
    'fintechKnowledge.js', 'baasKnowledge.js', 'healthcareSaasKnowledge.js',
    'medicalPaymentsKnowledge.js', 'realEstateKnowledge.js', 'aiMlKnowledge.js',
    'qsrKnowledge.js', 'charitableGivingKnowledge.js', 'accountingFinanceKnowledge.js',
    'smbMidmarketKnowledge.js', 'insuranceKnowledge.js'
  ],
  // INJECTION required; SCORING/DISCOVERY optional
  partialVerticalFiles: [
    'b2bSalesKnowledge.js', 'okrKpiKnowledge.js', 'investorIntelligenceKnowledge.js'
  ],
  // schema check skipped (different shapes by design)
  exemptFiles: [
    'complianceKnowledge.js', 'verticalPlaybooks.js', 'advancedKnowledge.js',
    'icpFitKnowledge.js', 'negotiationFrameworks.js', 'riverFramework.js',
    'outcomes.js', 'rfpSources.js', 'sampleAccounts.js'
  ]
};
const config = existsSync(CONFIG_PATH)
  ? { ...DEFAULTS, ...JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) }
  : DEFAULTS;

const JSON_OUT = process.argv.includes('--json');
const findings = [];
const add = (severity, file, line, rule, message) =>
  findings.push({ severity, file, line, rule, message });

// ─────────────────────────── detectors ───────────────────────────
// Citation check: flag UNDATED CYCLICAL claims, not durable benchmarks.
// High precision by design — a noisy linter gets ignored. A line is flagged
// only when it is very likely a Tier-2 cyclical fact lacking a date:
//   - a large (billion/trillion-scale) money figure, OR
//   - a CAGR, OR
//   - a "NN% of <noun>" population statistic, OR
//   - any magnitude figure co-occurring with an explicit year.
// Definitional benchmarks ("NRR >120% = exceptional", "Enterprise = >$100K
// ACV", scorecard weights "(10%)") deliberately do NOT trip the check.
const HAS_YEAR = /\b20[1-3]\d\b/;
const HAS_MAGNITUDE = /\$\s?\d|\b\d[\d,]*\.?\d*\s?(billion|trillion|million|bn|tn)\b|\b\d{1,3}(\.\d+)?\s?%|\b\d+(\.\d+)?x\b/i;
const LARGE_MONEY = /(\$\s?\d[\d.,\-]*\s?(billion|trillion|bn|tn|[BT])\b)|(\b\d[\d.,\-]*\s?(billion|trillion)\b)/i;
const PCT_OF = /\b\d{1,3}(\.\d+)?%\s+of\b/i;
const HAS_CAGR = /\bCAGR\b/i;

function isUndatedCyclicalClaim(line) {
  if (/\[verified/i.test(line)) return false;
  if (LARGE_MONEY.test(line)) return true;
  if (HAS_CAGR.test(line)) return true;
  if (PCT_OF.test(line)) return true;
  if (HAS_YEAR.test(line) && HAS_MAGNITUDE.test(line)) return true;
  return false;
}
// Tight patterns for a NAMED INDIVIDUAL next to a leadership role.
// Pattern 2 ("CEO Jane Smith") is the workhorse — caught the real leaks.
// Patterns 1 & 3 require an attribution shape ("by X Y" / "X Y, ROLE of")
// so that role-lists ("...Treasury Management, CTO, COO...") don't false-hit.
const TIER3 = [
  /\b(led|headed|founded|co-founded)\s+by\s+[A-Z][a-z]+\s+[A-Z][a-z]+/,
  /\b(CEO|CFO|CTO|CIO|COO|CMO|CRO|CHRO|CISO)\s+[A-Z][a-z]+\s+[A-Z][a-z]+/,
  /[A-Z][a-z]+\s+[A-Z][a-z]+,\s+(the\s+)?(current\s+)?(CEO|CFO|CTO|CIO|COO|CMO|CRO|CHRO|CISO|Chairman|President)\s+of\b/i
];
const COMMON_STOPWORDS = new Set([
  'fund', 'funds', 'unit', 'units', 'developer', 'lp', 'cre', 'platform',
  'solution', 'solutions', 'data', 'digital', 'tech', 'growth', 'partner',
  'partners', 'service', 'services', 'enterprise', 'global', 'network',
  'capital', 'finance', 'software', 'cloud', 'system', 'systems'
]);

// ─────────────────────────── helpers ───────────────────────────
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (entry.endsWith('.js')) out.push(p);
  }
  return out;
}

// Returns line ranges (1-indexed, inclusive) of every *_INJECTION template literal.
function findInjectionRanges(text) {
  const ranges = [];
  const re = /export\s+const\s+(\w*INJECTION\w*)\s*=\s*`/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const open = re.lastIndex;
    let i = open;
    while (i < text.length && !(text[i] === '`' && text[i - 1] !== '\\')) i++;
    ranges.push({
      name: m[1],
      startLine: text.slice(0, open).split('\n').length,
      endLine: text.slice(0, i).split('\n').length
    });
    re.lastIndex = i + 1;
  }
  return ranges;
}
const inRanges = (ln, ranges) => ranges.some(r => ln >= r.startLine && ln <= r.endLine);

// Recursively collect arrays found at any `keywords` key.
function collectKeywords(value, acc, depth = 0) {
  if (!value || depth > 5 || typeof value !== 'object' || Array.isArray(value)) return;
  for (const [k, v] of Object.entries(value)) {
    if (k === 'keywords' && Array.isArray(v)) {
      v.filter(x => typeof x === 'string').forEach(x => acc.push(x));
    } else {
      collectKeywords(v, acc, depth + 1);
    }
  }
}
const snippet = s => {
  const t = s.trim().replace(/\s+/g, ' ');
  return t.length > 90 ? t.slice(0, 90) + '...' : t;
};

// ─────────────────────────── main ───────────────────────────
const knowledgeDir = resolve(config.knowledgeDir);
if (!existsSync(knowledgeDir)) {
  console.error(`knowledge-lint: directory not found: ${config.knowledgeDir}`);
  process.exit(1);
}

const files = walk(knowledgeDir);
const keywordIndex = new Map(); // keyword -> Set(file)

for (const abs of files) {
  const rel = relative(process.cwd(), abs);
  const name = abs.split('/').pop();
  const text = readFileSync(abs, 'utf8');

  // --- import the module (needed for schema + keyword checks) ---
  const isVertical = config.verticalFiles.includes(name);
  const isPartial = config.partialVerticalFiles.includes(name);
  const isExempt = config.exemptFiles.includes(name);
  let mod = null;
  try {
    mod = await import(pathToFileURL(abs).href);
  } catch (e) {
    // Exempt files (complianceKnowledge.js uses Vite JSON import) get a warning;
    // vertical/partial files that fail to import are hard errors.
    const sev = isExempt ? 'warn' : 'error';
    add(sev, rel, 0, 'parse', `file fails to import: ${e.message}`);
    // Do NOT skip the file — text-based checks (citation, tier3, sources)
    // don't need the module and should still run.
  }
  const exportNames = mod ? Object.keys(mod) : [];
  if (mod && (isVertical || isPartial)) {
    const inj = exportNames.some(n => n.includes('INJECTION'));
    const scoring = exportNames.some(n => n.includes('SCORING'));
    const disc = exportNames.some(n => n.includes('DISCOVERY'));
    if (!inj) add('error', rel, 0, 'schema', 'knowledge file exports no *_INJECTION constant');
    if (isVertical && !scoring) add('warn', rel, 0, 'schema', 'missing *_SCORING_CONTEXT export');
    if (isVertical && !disc) add('warn', rel, 0, 'schema', 'missing *_DISCOVERY_INJECTION export');
  } else if (!isExempt && name.endsWith('Knowledge.js')) {
    add('info', rel, 0, 'classify', 'unclassified *Knowledge.js file — add it to knowledge-lint.config.json');
  }

  // --- line-level checks (only inside *_INJECTION literals) ---
  const ranges = findInjectionRanges(text);
  const lines = text.split('\n');
  if (ranges.length > 0) {
    // 4. sources block
    if (!/SOURCES/i.test(lines.slice(0, 60).join('\n'))) {
      add('warn', rel, 0, 'sources', 'no SOURCES comment block found in file header');
    }
    lines.forEach((lineText, idx) => {
      const ln = idx + 1;
      if (!inRanges(ln, ranges)) return;
      // 2. citation
      if (isUndatedCyclicalClaim(lineText)) {
        add('warn', rel, ln, 'citation',
          `quantitative claim without a [verified MM/YYYY, Source] tag: "${snippet(lineText)}"`);
      }
      // 3. tier-3 leakage
      if (TIER3.some(re => re.test(lineText))) {
        add('warn', rel, ln, 'tier3',
          `possible Tier-3 fact (named individual) in a static layer: "${snippet(lineText)}"`);
      }
    });
  }

  // --- keyword collection ---
  const kws = [];
  for (const v of Object.values(mod || {})) collectKeywords(v, kws);
  for (const kw of kws) {
    const key = kw.toLowerCase().trim();
    if (!keywordIndex.has(key)) keywordIndex.set(key, new Set());
    keywordIndex.get(key).add(rel);
  }
}

// --- 5 & 6. keyword collisions + ambiguous keywords ---
for (const [kw, fileSet] of [...keywordIndex.entries()].sort()) {
  if (fileSet.size > 1) {
    add('warn', '(cross-file)', 0, 'keyword-collision',
      `keyword "${kw}" appears in ${fileSet.size} files: ${[...fileSet].join(', ')}`);
  }
  if (COMMON_STOPWORDS.has(kw)) {
    add('warn', '(keywords)', 0, 'keyword-ambiguous',
      `keyword "${kw}" is a common ambiguous term — risks cross-vertical false matches`);
  }
}

// ─────────────────────────── report ───────────────────────────
if (JSON_OUT) {
  console.log(JSON.stringify(findings, null, 2));
} else {
  const byFile = {};
  for (const f of findings) (byFile[f.file] ??= []).push(f);
  console.log(`\nCambrian Knowledge Lint — ${files.length} files scanned\n`);
  const rank = { error: 0, warn: 1, info: 2 };
  for (const file of Object.keys(byFile).sort()) {
    console.log(file);
    for (const f of byFile[file].sort((a, b) => rank[a.severity] - rank[b.severity] || a.line - b.line)) {
      const tag = f.severity.toUpperCase().padEnd(5);
      const loc = (f.line ? `L${f.line}` : '').padEnd(6);
      console.log(`  ${tag} ${loc} ${f.rule}: ${f.message}`);
    }
    console.log('');
  }
}
const errors = findings.filter(f => f.severity === 'error').length;
const warns = findings.filter(f => f.severity === 'warn').length;
const infos = findings.filter(f => f.severity === 'info').length;
if (!JSON_OUT) {
  const byRule = {};
  for (const f of findings) byRule[f.rule] = (byRule[f.rule] || 0) + 1;
  const breakdown = Object.entries(byRule).sort((a, b) => b[1] - a[1])
    .map(([r, n]) => `${r} ${n}`).join('  ·  ');
  if (breakdown) console.log(`By rule:  ${breakdown}`);
}
console.log(`Summary: ${errors} error(s), ${warns} warning(s), ${infos} notice(s)`);
process.exit(errors > 0 ? 1 : 0);
