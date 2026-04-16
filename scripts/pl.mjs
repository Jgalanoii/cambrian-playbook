#!/usr/bin/env node
// scripts/pl.mjs — Cambrian Catalyst P&L scenario runner
//
// Usage:
//   node scripts/pl.mjs                     # all default scenarios
//   node scripts/pl.mjs --users=5000        # override active user count
//   node scripts/pl.mjs --plan=pro          # zoom into one plan
//   node scripts/pl.mjs --fallback=0.15     # adjust Sonnet fallback rate
//   node scripts/pl.mjs --haiku-mult=1.5    # what if Haiku price rises 50%?
//
// Edit ASSUMPTIONS below to model alternate scenarios. The doc at
// docs/cost-model.md should be re-derived when these change materially.

// ── ASSUMPTIONS ─────────────────────────────────────────────────────────────

const ANTHROPIC = {
  haiku: { input: 1.00, output: 5.00 },     // $/MTok
  sonnet:{ input: 3.00, output: 15.00 },    // $/MTok
  webSearch: 0.01,                          // $/search
};

// Per-stage token usage. `in` and `out` are PER CALL averages; `searches`
// is TOTAL searches across the whole stage (not per call).
//
// Numbers calibrated against the v107 consistency-test harness:
//   - ICP: 461,748 input + 48,845 output across 60 calls (30 runs × 2 calls)
//     => ~7,700 in + ~815 out per call, $0.012/call, $0.025/full ICP build.
//   - RFP intel: similar token profile, 2 calls per fetch, web_search-heavy.
//   - Brief: 5 micro-calls in parallel; each call ~1,500 in + ~1,200 out,
//     so per-brief is ~7,500 in + ~6,000 out total across 5 calls.
//   - Other stages: estimated from prompt/response shape; re-measure when
//     prompts change materially.
//
// NOTE: prior version of this script over-estimated by ~3x on Brief and
// double-counted web_search calls. If you measure new token data from the
// harness, update these numbers.
const STAGES = {
  icpBuild:        { calls: 2, in:  7700, out:   815, searches: 1 },
  rfpIntel:        { calls: 2, in:  6000, out:  1500, searches: 4 },
  brief:           { calls: 5, in:  1500, out:  1200, searches: 1 },
  hypothesis:      { calls: 1, in:  2000, out:  1000, searches: 0 },
  discovery:       { calls: 1, in:  2000, out:  1500, searches: 0 },
  fitBatch20:      { calls: 1, in:  1500, out:  2000, searches: 0 },
  postCall:        { calls: 1, in:  2500, out:  1500, searches: 0 },
  solutionFit:     { calls: 1, in:  3000, out:  3000, searches: 0 },
  findTargets:     { calls: 2, in:  2500, out:  2500, searches: 2 },
};

const FIXED = {
  vercelPro:    20,
  supabasePro:  25,
  domain:        1,
  // Add more as you take them on
};

const PERSONAS = {
  light: {
    label: "Light user (5 deals/mo)",
    monthly: {
      icpBuild: 1,
      fitBatch20: 3,        // ~50 accounts
      brief: 5, hypothesis: 5, discovery: 5, postCall: 5, solutionFit: 5,
      rfpIntel: 0, findTargets: 0,
    },
  },
  medium: {
    label: "Medium user (20 deals/mo)",
    monthly: {
      icpBuild: 1,
      fitBatch20: 20,       // ~200 accounts × 2 refreshes
      brief: 20, hypothesis: 20, discovery: 20, postCall: 20, solutionFit: 20,
      rfpIntel: 1, findTargets: 2,
    },
  },
  heavy: {
    label: "Heavy user (50 deals/mo)",
    monthly: {
      icpBuild: 2,
      fitBatch20: 100,      // ~500 accounts × 4 refreshes
      brief: 50, hypothesis: 50, discovery: 50, postCall: 50, solutionFit: 50,
      rfpIntel: 4, findTargets: 4,
    },
  },
  power: {
    label: "Power user (100+ deals, multi-product)",
    monthly: {
      icpBuild: 4,
      fitBatch20: 400,
      brief: 100, hypothesis: 100, discovery: 100, postCall: 100, solutionFit: 100,
      rfpIntel: 10, findTargets: 10,
    },
  },
};

const PLANS = [
  { name: "Free trial", price:  0, persona: "light" },
  { name: "Starter",    price: 39, persona: "light" },
  { name: "Pro",        price: 99, persona: "medium" },
  { name: "Team (per seat, 3-seat min)", price: 79, persona: "heavy" },
  { name: "Enterprise (per seat)", price:299, persona: "power" },
];

// ── CLI overrides ──────────────────────────────────────────────────────────

const args = Object.fromEntries(
  process.argv.slice(2).map(s => {
    const m = s.match(/^--([a-zA-Z-]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? "true"] : [s, "true"];
  })
);
const opts = {
  users:        Number(args.users || 1000),
  fallback:     Number(args.fallback || 0.05),
  haikuMult:    Number(args["haiku-mult"] || 1.0),
  sonnetMult:   Number(args["sonnet-mult"] || 1.0),
  planFilter:   args.plan || null,
  personaFilter:args.persona || null,
};

// ── COST FUNCTIONS ─────────────────────────────────────────────────────────

function stageCost(stage, { fallbackRate, haikuMult, sonnetMult }) {
  const haikuIn  = stage.in  * stage.calls / 1e6;
  const haikuOut = stage.out * stage.calls / 1e6;
  const haikuCost = haikuIn * ANTHROPIC.haiku.input * haikuMult
                  + haikuOut * ANTHROPIC.haiku.output * haikuMult;
  // When fallback fires, Sonnet is used instead of Haiku for that call. We
  // model fallbackRate as the FRACTION of total calls that fall over.
  // Effective cost = Haiku cost * (1 - rate) + Sonnet cost * rate.
  const sonnetCost = (haikuIn * ANTHROPIC.sonnet.input * sonnetMult
                   +  haikuOut * ANTHROPIC.sonnet.output * sonnetMult);
  const blendedTokenCost = haikuCost * (1 - fallbackRate) + sonnetCost * fallbackRate;
  // searches is total per stage, not per-call — don't multiply by stage.calls
  const searchCost = (stage.searches || 0) * ANTHROPIC.webSearch;
  return blendedTokenCost + searchCost;
}

function personaMonthlyCost(persona, env) {
  let total = 0;
  const breakdown = {};
  for (const [stageName, count] of Object.entries(persona.monthly)) {
    const stage = STAGES[stageName];
    if (!stage || !count) continue;
    const cost = stageCost(stage, env) * count;
    breakdown[stageName] = { count, cost };
    total += cost;
  }
  return { total, breakdown };
}

function fixedAllocation(users) {
  const total = Object.values(FIXED).reduce((a, b) => a + b, 0);
  return { totalFixed: total, perUser: users > 0 ? total / users : 0 };
}

// ── REPORT ─────────────────────────────────────────────────────────────────

const env = { fallbackRate: opts.fallback, haikuMult: opts.haikuMult, sonnetMult: opts.sonnetMult };
const fixed = fixedAllocation(opts.users);

console.log(`\n━━━ Cambrian Catalyst — P&L scenarios ━━━`);
console.log(`Active users:   ${opts.users.toLocaleString()}`);
console.log(`Sonnet fallback rate: ${(opts.fallback * 100).toFixed(0)}%`);
console.log(`Haiku price multiplier: ${opts.haikuMult.toFixed(2)}× | Sonnet: ${opts.sonnetMult.toFixed(2)}×`);
console.log(`Fixed cost: $${fixed.totalFixed}/mo (= $${fixed.perUser.toFixed(3)}/user at ${opts.users.toLocaleString()} users)\n`);

// Per-persona cost breakdown
console.log(`══ Variable cost per persona / month ══`);
for (const [key, persona] of Object.entries(PERSONAS)) {
  if (opts.personaFilter && opts.personaFilter !== key) continue;
  const { total, breakdown } = personaMonthlyCost(persona, env);
  console.log(`\n  ${persona.label}`);
  console.log(`  ─────────────────────────────────────────`);
  for (const [stageName, { count, cost }] of Object.entries(breakdown)) {
    console.log(`    ${stageName.padEnd(15)} × ${String(count).padStart(4)}  →  $${cost.toFixed(3)}`);
  }
  console.log(`    ─────────────────────────────────────`);
  console.log(`    TOTAL                  →  $${total.toFixed(2)}/mo`);
}

// Pricing-tier P&L
console.log(`\n══ Pricing tiers — gross margin per seat ══`);
console.log(`  ${"Plan".padEnd(38)}${"Price".padStart(8)}${"COGS".padStart(10)}${"Profit".padStart(10)}${"Margin".padStart(10)}`);
console.log(`  ${"-".repeat(76)}`);
for (const plan of PLANS) {
  if (opts.planFilter && opts.planFilter.toLowerCase() !== plan.name.toLowerCase().split(" ")[0]) continue;
  const persona = PERSONAS[plan.persona];
  const { total: variable } = personaMonthlyCost(persona, env);
  const cogs = variable + fixed.perUser;
  const profit = plan.price - cogs;
  const margin = plan.price > 0 ? (profit / plan.price * 100) : 0;
  console.log(
    `  ${plan.name.padEnd(38)}` +
    `$${plan.price.toFixed(0).padStart(6)}` +
    ` $${cogs.toFixed(2).padStart(7)}` +
    `${(profit >= 0 ? " " : "")}$${profit.toFixed(2).padStart(8)}` +
    `${plan.price > 0 ? margin.toFixed(0) + "%" : "n/a"}`.padStart(10)
  );
}

// Aggregate at scale
console.log(`\n══ Annual P&L at ${opts.users.toLocaleString()} users (mix-weighted) ══`);
// Assume mix: 40% Starter, 40% Pro, 15% Team, 5% Enterprise
const mix = { Starter: 0.40, Pro: 0.40, "Team (per seat, 3-seat min)": 0.15, "Enterprise (per seat)": 0.05 };
let annualRevenue = 0, annualCogs = 0;
for (const plan of PLANS) {
  const share = mix[plan.name];
  if (!share) continue;
  const seats = opts.users * share;
  const persona = PERSONAS[plan.persona];
  const { total: variable } = personaMonthlyCost(persona, env);
  const monthlyRev = seats * plan.price;
  const monthlyCogs = seats * variable;
  annualRevenue += monthlyRev * 12;
  annualCogs    += monthlyCogs * 12;
  console.log(`  ${plan.name.padEnd(38)} ${share*100}% × ${opts.users.toLocaleString()} = ${Math.round(seats).toLocaleString()} seats  →  $${(monthlyRev/1000).toFixed(1)}K/mo`);
}
const annualFixed = fixed.totalFixed * 12;
const annualProfit = annualRevenue - annualCogs - annualFixed;
console.log(`  ${"-".repeat(76)}`);
console.log(`  Annual revenue:       $${(annualRevenue/1000).toFixed(0)}K`);
console.log(`  Annual variable COGS: $${(annualCogs/1000).toFixed(0)}K`);
console.log(`  Annual fixed COGS:    $${(annualFixed/1000).toFixed(2)}K`);
console.log(`  Annual gross profit:  $${(annualProfit/1000).toFixed(0)}K`);
console.log(`  Gross margin:         ${(annualProfit / annualRevenue * 100).toFixed(0)}%`);

console.log(`\n━━━ Notes ━━━`);
console.log(`• Variable cost scales linearly with usage; gross margin holds across user counts.`);
console.log(`• Fixed cost ($${fixed.totalFixed}/mo) becomes negligible above ~500 users.`);
console.log(`• Above doesn't include: SOC2 (~$30K one-time), legal (~$5K), monitoring (~$50/mo at scale),`);
console.log(`  enrichment data (LinkedIn, Apollo etc — passed through to customer), CAC.`);
console.log(`• See docs/cost-model.md for the underlying assumptions.`);
console.log();
