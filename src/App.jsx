import { useState, useCallback, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #FAFAF8; color: #1a1a18; }
.serif { font-family: 'Lora', serif; }

.app { min-height: 100vh; display: flex; flex-direction: column; }

.header { background: #fff; border-bottom: 1px solid #E8E6DF; padding: 0 32px; height: 58px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 200; flex-shrink: 0; }
.logo { font-family: 'Lora', serif; font-size: 17px; color: #1a1a18; letter-spacing: -0.3px; }
.logo span { color: #8B6F47; }
.stepper { display: flex; align-items: center; gap: 0; }
.step-item { display: flex; align-items: center; gap: 7px; padding: 0 12px; font-size: 11px; font-weight: 500; color: #aaa; letter-spacing: 0.4px; text-transform: uppercase; cursor: default; white-space: nowrap; }
.step-item.active { color: #1a1a18; }
.step-item.done { color: #8B6F47; cursor: pointer; }
.step-num { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; }
.step-item.done .step-num { background: #8B6F47; border-color: #8B6F47; color: #fff; }
.step-item.active .step-num { background: #1a1a18; border-color: #1a1a18; color: #fff; }
.step-div { width: 20px; height: 1px; background: #E8E6DF; }

.page { max-width: 860px; margin: 0 auto; padding: 40px 32px 72px; width: 100%; }
.page-title { font-family: 'Lora', serif; font-size: 26px; font-weight: 500; color: #1a1a18; margin-bottom: 6px; }
.page-sub { font-size: 14px; color: #777; line-height: 1.65; margin-bottom: 36px; }

.upload-zone { border: 1.5px dashed #C8C4BB; border-radius: 12px; padding: 48px 32px; text-align: center; cursor: pointer; transition: all 0.2s; background: #fff; }
.upload-zone:hover, .upload-zone.drag { border-color: #8B6F47; background: #FAF8F4; }
.upload-icon { font-size: 32px; margin-bottom: 14px; color: #C8C4BB; }
.upload-label { font-family: 'Lora', serif; font-size: 15px; color: #1a1a18; margin-bottom: 6px; }
.upload-hint { font-size: 13px; color: #999; margin-bottom: 20px; }

.btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; border: none; line-height: 1; }
.btn:disabled { opacity: 0.4; cursor: default; }
.btn-primary { background: #1a1a18; color: #fff; }
.btn-primary:hover:not(:disabled) { background: #333; }
.btn-secondary { background: transparent; border: 1.5px solid #C8C4BB; color: #1a1a18; }
.btn-secondary:hover:not(:disabled) { border-color: #8B6F47; color: #8B6F47; }
.btn-gold { background: #8B6F47; color: #fff; }
.btn-gold:hover:not(:disabled) { background: #7A6040; }
.btn-green { background: #2E6B2E; color: #fff; }
.btn-green:hover:not(:disabled) { background: #245424; }
.btn-lg { padding: 12px 24px; font-size: 14px; }
.btn-sm { padding: 6px 12px; font-size: 12px; }

.card { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.card-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; margin-bottom: 14px; }

.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.field-row { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.field-label .req { color: #8B6F47; }
select, input[type=text], textarea { width: 100%; padding: 8px 11px; border: 1px solid #E8E6DF; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1a1a18; background: #FAFAF8; appearance: none; outline: none; transition: border-color 0.15s; resize: vertical; }
select:focus, input[type=text]:focus, textarea:focus { border-color: #8B6F47; background: #fff; }

.preview-table-wrap { overflow-x: auto; }
.preview-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.preview-table th { background: #F5F3EE; padding: 7px 10px; text-align: left; font-weight: 600; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; white-space: nowrap; }
.preview-table td { padding: 7px 10px; border-top: 1px solid #F0EDE6; color: #333; white-space: nowrap; }

.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
.summary-stat { background: #fff; border: 1px solid #E8E6DF; border-radius: 10px; padding: 16px; text-align: center; }
.summary-num { font-family: 'Lora', serif; font-size: 26px; color: #8B6F47; margin-bottom: 3px; }
.summary-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.4px; }

.cohort-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 28px; }
.cohort-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 12px; padding: 18px; cursor: pointer; transition: all 0.18s; }
.cohort-card:hover { border-color: #8B6F47; }
.cohort-card.selected { border-color: #8B6F47; background: #FAF8F4; }
.cohort-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; margin-right: 7px; flex-shrink: 0; }
.cohort-name { font-family: 'Lora', serif; font-size: 14px; font-weight: 500; margin-bottom: 3px; display: flex; align-items: center; }
.cohort-size { font-size: 11px; color: #999; margin-bottom: 10px; }
.cohort-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
.tag { font-size: 10px; padding: 2px 9px; border-radius: 20px; font-weight: 600; }
.tag-ind { background: #EEF2F8; color: #3A5A8C; }
.tag-size { background: #F3EDE6; color: #7A5C30; }
.tag-src { background: #EEF5EE; color: #2E6B2E; }
.tag-out { background: #F5EEF5; color: #6B3A7A; }
.cohort-stat { font-size: 11px; color: #777; }
.cohort-stat strong { color: #1a1a18; }

.outcome-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.outcome-tile { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 10px; padding: 14px; cursor: pointer; transition: all 0.18s; }
.outcome-tile:hover { border-color: #8B6F47; }
.outcome-tile.selected { border-color: #8B6F47; background: #FAF8F4; }
.outcome-icon { font-size: 18px; margin-bottom: 6px; }
.outcome-title { font-size: 12px; font-weight: 600; margin-bottom: 3px; }
.outcome-sub { font-size: 11px; color: #999; line-height: 1.4; }

.notice { background: #F8F6F1; border: 1px solid #E8E6DF; border-radius: 9px; padding: 13px 16px; font-size: 12px; color: #777; line-height: 1.6; margin-bottom: 20px; }
.notice strong { color: #1a1a18; }

.actions-row { display: flex; gap: 10px; margin-top: 28px; align-items: center; }

/* ── LIVE CALL LAYOUT ── */
.call-layout { display: flex; flex: 1; height: calc(100vh - 58px); overflow: hidden; }

.call-left { width: 52%; border-right: 1px solid #E8E6DF; display: flex; flex-direction: column; background: #fff; overflow: hidden; }
.call-right { width: 48%; display: flex; flex-direction: column; background: #FAFAF8; overflow: hidden; }

.call-panel-header { padding: 14px 20px; border-bottom: 1px solid #E8E6DF; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: #fff; }
.call-panel-title { font-family: 'Lora', serif; font-size: 14px; font-weight: 500; }
.call-panel-body { flex: 1; overflow-y: auto; padding: 16px 20px; }

.stage-tabs { display: flex; overflow-x: auto; border-bottom: 1px solid #E8E6DF; background: #FAFAF8; flex-shrink: 0; }
.stage-tab { padding: 9px 14px; font-size: 11px; font-weight: 500; cursor: pointer; color: #999; border-bottom: 2px solid transparent; white-space: nowrap; background: none; border-top: none; border-left: none; border-right: none; border-bottom: 2px solid transparent; transition: all 0.15s; }
.stage-tab:hover { color: #1a1a18; }
.stage-tab.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #fff; }
.stage-tab.completed { color: #2E6B2E; }

/* Decision tree nodes */
.tree-stage { margin-bottom: 8px; }
.tree-stage-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #999; margin-bottom: 8px; padding: 8px 0 0; }

.node { border: 1px solid #E8E6DF; border-radius: 10px; background: #fff; margin-bottom: 8px; overflow: hidden; transition: all 0.2s; }
.node.active { border-color: #8B6F47; box-shadow: 0 0 0 2px rgba(139,111,71,0.1); }
.node.completed { border-color: #2E6B2E; background: #F4FAF4; }
.node.dimmed { opacity: 0.45; }

.node-header { padding: 11px 14px; display: flex; align-items: flex-start; gap: 10px; }
.node-icon { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
.node-icon.q { background: #1a1a18; color: #fff; }
.node-icon.done { background: #2E6B2E; color: #fff; }
.node-icon.act { background: #8B6F47; color: #fff; }
.node-q { font-size: 13px; font-weight: 500; color: #1a1a18; line-height: 1.4; }
.node-answer { font-size: 12px; color: #2E6B2E; font-weight: 500; margin-top: 3px; }

.node-branches { padding: 0 14px 12px; display: flex; flex-direction: column; gap: 6px; }
.branch-btn { display: flex; gap: 10px; align-items: flex-start; padding: 9px 12px; border-radius: 8px; border: 1px solid #E8E6DF; background: #FAFAF8; cursor: pointer; text-align: left; width: 100%; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
.branch-btn:hover { border-color: #8B6F47; background: #FAF8F4; }
.branch-if { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: #8B6F47; min-width: 26px; padding-top: 2px; flex-shrink: 0; }
.branch-text { font-size: 12px; color: #333; line-height: 1.45; }
.branch-action { font-size: 11px; color: #8B6F47; font-weight: 500; margin-top: 2px; }

.talk-box { background: #F8F6F1; border-left: 3px solid #8B6F47; border-radius: 0 8px 8px 0; padding: 11px 14px; margin: 10px 14px 12px; }
.talk-box-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 5px; }
.talk-box-text { font-size: 12px; color: #555; line-height: 1.6; font-style: italic; }

.action-node { padding: 12px 14px; background: #F8F6F1; border-radius: 10px; border: 1px solid #E8E6DF; margin-bottom: 8px; }
.action-node-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 8px; }
.action-list { display: flex; flex-direction: column; gap: 6px; }
.action-item { display: flex; gap: 9px; align-items: flex-start; font-size: 12px; color: #333; line-height: 1.45; }
.action-num { width: 18px; height: 18px; border-radius: 50%; background: #1a1a18; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

.obj-list { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.obj-item { border: 1px solid #E8E6DF; border-radius: 8px; overflow: hidden; background: #fff; }
.obj-q-btn { display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; cursor: pointer; font-size: 12px; font-weight: 500; width: 100%; text-align: left; background: none; border: none; font-family: 'DM Sans', sans-serif; color: #1a1a18; }
.obj-a-text { padding: 0 12px 9px; font-size: 12px; color: #555; line-height: 1.5; font-style: italic; border-top: 1px solid #F0EDE6; padding-top: 8px; }

/* ── RIGHT PANEL TABS ── */
.right-tabs { display: flex; border-bottom: 1px solid #E8E6DF; background: #fff; flex-shrink: 0; }
.right-tab { padding: 10px 16px; font-size: 12px; font-weight: 500; cursor: pointer; color: #999; border-bottom: 2px solid transparent; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
.right-tab:hover { color: #1a1a18; }
.right-tab.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #FAFAF8; }

/* Call Prep */
.prep-search { display: flex; gap: 8px; margin-bottom: 14px; }
.prep-search input { flex: 1; }

.intel-section { margin-bottom: 16px; }
.intel-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.intel-dot { width: 6px; height: 6px; border-radius: 50%; background: #8B6F47; }
.intel-item { background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 12px; margin-bottom: 6px; }
.intel-headline { font-size: 12px; font-weight: 500; color: #1a1a18; margin-bottom: 3px; line-height: 1.4; }
.intel-meta { font-size: 11px; color: #999; }
.intel-contact { display: flex; gap: 10px; align-items: flex-start; }
.intel-avatar { width: 34px; height: 34px; border-radius: 50%; background: #E8E6DF; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #555; flex-shrink: 0; }
.intel-contact-info { flex: 1; }
.intel-contact-name { font-size: 12px; font-weight: 600; color: #1a1a18; }
.intel-contact-title { font-size: 11px; color: #777; }
.intel-contact-signal { font-size: 11px; color: #8B6F47; margin-top: 3px; font-style: italic; }

.loading-pulse { display: flex; flex-direction: column; gap: 8px; padding: 8px 0; }
.pulse-line { height: 12px; background: linear-gradient(90deg, #F0EDE6 25%, #E8E4DC 50%, #F0EDE6 75%); background-size: 200% 100%; border-radius: 6px; animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* Notes */
.notes-area { width: 100%; min-height: 120px; font-size: 13px; padding: 10px; border-radius: 8px; border: 1px solid #E8E6DF; background: #fff; }
.notes-meta { font-size: 11px; color: #999; margin-top: 6px; }
.timestamp { font-size: 10px; color: #aaa; }

/* Post-call */
.post-call-section { margin-bottom: 20px; }
.post-call-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 8px; }
.post-call-content { background: #fff; border: 1px solid #E8E6DF; border-radius: 9px; padding: 14px; font-size: 13px; color: #333; line-height: 1.65; white-space: pre-wrap; }
.copy-btn { font-size: 11px; color: #8B6F47; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; font-weight: 500; padding: 0; }
.copy-btn:hover { text-decoration: underline; }

/* Live indicator */
.live-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #2E6B2E; background: #EEF5EE; padding: 3px 10px; border-radius: 20px; }
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: #2E6B2E; animation: blink 1.2s ease-in-out infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.progress-bar { height: 3px; background: #E8E6DF; border-radius: 2px; margin-bottom: 14px; }
.progress-fill { height: 100%; border-radius: 2px; background: #8B6F47; transition: width 0.3s; }

.divider { height: 1px; background: #E8E6DF; margin: 20px 0; }

.scroll-anchor { height: 1px; }
`;

// ── DATA / LOGIC ──────────────────────────────────────────────────────────────

const COHORT_COLORS = ["#8B6F47", "#4A7A9B", "#6B8E6B", "#9B6B8E", "#7A7A4A"];

const OUTCOMES = [
  { id: "revenue", icon: "↑", title: "Revenue Growth", sub: "Pipeline, new logos, upsell" },
  { id: "efficiency", icon: "⟳", title: "Operational Efficiency", sub: "Automation, cost reduction" },
  { id: "retention", icon: "◎", title: "Customer Retention", sub: "Churn reduction, loyalty" },
  { id: "workforce", icon: "✦", title: "Workforce Management", sub: "Payroll, HR ops" },
  { id: "ai", icon: "◈", title: "Data & AI Adoption", sub: "Analytics, AI tooling" },
  { id: "transformation", icon: "◇", title: "Strategic Transformation", sub: "Org change, M&A" },
];

const SAMPLE_ROWS = [
  { company: "Axiom Health", industry: "Healthcare", acv: "$85,000", lead_source: "Trade Show", close_date: "2024-03-15", product: "Analytics Platform", outcome: "reduce customer churn" },
  { company: "Vertix Payments", industry: "Fintech", acv: "$220,000", lead_source: "Direct Outreach", close_date: "2024-01-22", product: "Revenue Intelligence", outcome: "grow revenue" },
  { company: "Mediform Inc", industry: "Healthcare", acv: "$42,000", lead_source: "SEO", close_date: "2024-05-01", product: "Process Automation", outcome: "increase efficiency" },
  { company: "ClearPay Corp", industry: "Fintech", acv: "$310,000", lead_source: "Referral", close_date: "2024-02-10", product: "Enterprise Suite", outcome: "scale revenue" },
  { company: "Luminus Wellness", industry: "Health & Wellness", acv: "$18,000", lead_source: "SEO", close_date: "2024-06-01", product: "Engagement Tool", outcome: "improve retention" },
  { company: "Trellis Markets", industry: "Market Research", acv: "$55,000", lead_source: "AI / ChatGPT", close_date: "2024-04-12", product: "Data Platform", outcome: "data & AI adoption" },
  { company: "Parity Financial", industry: "Fintech", acv: "$180,000", lead_source: "Trade Show", close_date: "2024-03-28", product: "Payroll Intelligence", outcome: "manage payroll" },
  { company: "OrionCare", industry: "Healthcare", acv: "$95,000", lead_source: "Referral", close_date: "2024-05-19", product: "Analytics Platform", outcome: "reduce churn" },
  { company: "Summit Rewards", industry: "Digital Rewards", acv: "$67,000", lead_source: "Direct Outreach", close_date: "2024-01-30", product: "Incentive Engine", outcome: "customer acquisition" },
  { company: "NovaPay", industry: "Fintech", acv: "$245,000", lead_source: "Referral", close_date: "2024-02-28", product: "Enterprise Suite", outcome: "scale revenue pipeline" },
  { company: "BrightPath HR", industry: "HR Tech", acv: "$33,000", lead_source: "SEO", close_date: "2024-04-05", product: "Workforce Tool", outcome: "manage payroll effectively" },
  { company: "Helix Analytics", industry: "Market Research", acv: "$78,000", lead_source: "AI / ChatGPT", close_date: "2024-06-10", product: "Data Platform", outcome: "AI adoption" },
];

function parseACV(v) {
  if (!v) return 0;
  const n = parseFloat(v.toString().replace(/[$,]/g, "").replace(/k$/i, "000"));
  return isNaN(n) ? 0 : n;
}
function labelACV(v) {
  if (v === 0) return "Unknown";
  if (v < 25000) return "SMB (<$25K)";
  if (v < 100000) return "Mid-Market ($25K–$100K)";
  return "Enterprise ($100K+)";
}
function getOutcomeTheme(row, mapping) {
  const get = (k) => (mapping[k] ? (row[mapping[k]] || "") : "").toString().toLowerCase();
  const txt = get("outcome") + get("product");
  if (/revenue|growth|sales|pipeline/.test(txt)) return "Revenue Growth";
  if (/efficien|automat|process|cost/.test(txt)) return "Operational Efficiency";
  if (/churn|retain|loyal/.test(txt)) return "Customer Retention";
  if (/payroll|hr|employ|workforce/.test(txt)) return "Workforce Management";
  if (/ai|ml|data|analytic/.test(txt)) return "Data & AI Adoption";
  return "Strategic Transformation";
}

function buildCohorts(rows, mapping) {
  if (!rows.length) return [];
  const get = (row, key) => (mapping[key] ? (row[mapping[key]] || "") : "").toString().trim();
  const groups = {};
  rows.forEach(row => {
    const acv = parseACV(get(row, "acv"));
    const band = labelACV(acv);
    const ind = get(row, "industry") || "Other";
    const src = get(row, "lead_source") || "Direct";
    const outcome = getOutcomeTheme(row, mapping);
    const key = band;
    if (!groups[key]) groups[key] = [];
    groups[key].push({ row, ind, acv, band, src, outcome, company: get(row, "company") });
  });
  return Object.entries(groups)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 5)
    .map(([name, members], i) => {
      const topInd = [...new Set(members.map(m => m.ind))].slice(0, 3);
      const topSrc = [...new Set(members.map(m => m.src))].slice(0, 2);
      const topOut = [...new Set(members.map(m => m.outcome))].slice(0, 2);
      const acvs = members.filter(m => m.acv > 0);
      const avgACV = acvs.length ? Math.round(acvs.reduce((s, m) => s + m.acv, 0) / acvs.length) : 0;
      return { id: i, name, color: COHORT_COLORS[i], size: members.length, pct: Math.round(members.length / rows.length * 100), avgACV, topInd, topSrc, topOut, members };
    });
}

function buildTree(cohort, outcomes) {
  const isEnt = cohort.avgACV >= 100000;
  const isSMB = cohort.avgACV < 25000 && cohort.avgACV > 0;
  const pOut = outcomes[0] || cohort.topOut[0] || "Revenue Growth";
  const cycle = isEnt ? "90–120 days" : isSMB ? "14–30 days" : "30–60 days";

  const stages = [
    {
      id: "qual", name: "Qualification", time: isEnt ? "Wk 1–2" : "Day 1–3",
      nodes: [
        {
          id: "q1", type: "decision",
          q: "Does this prospect meet your ICP criteria?",
          talkTrack: `"Before we get into what we do — what's driving urgency around ${pOut.toLowerCase()} right now, and what have you already tried?"`,
          actions: ["Confirm budget authority and org structure", "Identify compelling event — what happens if they do nothing in 90 days?", `Map lead source: this cohort is primarily driven by ${cohort.topSrc.join(", ")}`],
          branches: [
            { label: "Yes — clear ICP fit", action: "→ Move to Discovery", next: "disc" },
            { label: "Partial — some fit, gaps present", action: "→ Nurture sequence, 30-day follow-up", next: "nurture" },
            { label: "No — not a fit", action: "→ Disqualify with grace, route to marketing", next: "disq" },
          ]
        },
      ]
    },
    {
      id: "disc", name: "Discovery", time: isEnt ? "Wk 2–4" : "Day 3–10",
      nodes: [
        {
          id: "d1", type: "decision",
          q: "Did you surface a quantifiable pain with a clear owner?",
          talkTrack: `"Walk me through what breaks down when it comes to ${pOut.toLowerCase()}. When that breaks down, what's the downstream cost to the business?"`,
          actions: ["Run 60-min structured discovery: current state → desired state → gap → cost of gap", `Quantify the pain: what does failing at ${pOut.toLowerCase()} cost per quarter?`, "Identify champion vs. economic buyer — are they the same person?", "Document desired outcomes in their exact words — use verbatim in proposal"],
          branches: [
            { label: "Yes — clear pain, clear owner", action: "→ Build value hypothesis, prep demo", next: "sol" },
            { label: "Unclear — need more info", action: "→ Run second discovery, loop in CFO or RevOps", next: "disc" },
            { label: "No pain identified", action: "→ No deal. Return to nurture.", next: "nurture" },
          ]
        },
      ]
    },
    {
      id: "sol", name: "Solution Alignment", time: isEnt ? "Wk 4–6" : "Day 10–20",
      nodes: [
        {
          id: "s1", type: "decision",
          q: "Is the champion actively selling this internally?",
          talkTrack: `"Based on what you told me, the core problem is [restate in their words]. What I want to show you today is specifically how we address that — not everything we do, just what matters to your situation."`,
          actions: [isEnt ? "Conduct scoped Proof of Value (POV) — document success criteria upfront" : "Run time-boxed pilot (2–3 weeks) with clear success metrics", "Present before/after narrative — their world today vs. with your solution", "Get verbal gate: 'If we can show X by Y date, do we have a deal?'", "Map competitive alternatives they're evaluating"],
          branches: [
            { label: "Yes — champion is selling internally", action: "→ Equip with internal business case template", next: "prop" },
            { label: "Passive — not yet mobilized", action: "→ Schedule stakeholder alignment meeting", next: "sol" },
            { label: "No internal access", action: "→ Escalate: request executive sponsor call", next: "sol" },
          ]
        },
      ]
    },
    {
      id: "prop", name: "Proposal & Negotiation", time: isEnt ? "Wk 6–10" : "Day 20–28",
      nodes: [
        {
          id: "p1", type: "decision",
          q: "Do you have verbal commitment from the economic buyer?",
          talkTrack: `"I've built this specifically around what you told me matters. The investment reflects the scope of what you're trying to achieve. Let me walk you through the logic — not just the price."`,
          actions: ["Lead with their outcomes on page 1 — their words, not yours", `Present 3-tier pricing: anchor high, make mid-tier obvious. Target: ~$${cohort.avgACV > 0 ? cohort.avgACV.toLocaleString() : "TBD"}`, isEnt ? "Include multi-year option with meaningful discount" : "Include fast-start incentive tied to signature date", "Walk the proposal live — never send and wait"],
          branches: [
            { label: "Yes — verbal commit from economic buyer", action: "→ Move to contract, set signature date", next: "close" },
            { label: "Stalled — no movement", action: "→ Surface the real objection. Bring in executive sponsor.", next: "prop" },
            { label: "Competitor risk", action: "→ Re-anchor on unique value. Ask: what would it take?", next: "prop" },
          ]
        },
      ]
    },
    {
      id: "close", name: "Close & Contract", time: isEnt ? "Wk 10–12" : "Day 28–35",
      nodes: [
        {
          id: "c1", type: "decision",
          q: "Is the onboarding handoff complete before signing?",
          talkTrack: `"Let's talk about what happens on Day 1. I want you to feel like you made the right call the moment you sign — not like you're waiting to see if we deliver."`,
          actions: ["Send contract within 24 hours of verbal close", "Know your legal walk-aways before redlines start", "Introduce CSM before ink dries — warm, not cold", "Confirm first milestone: what does success look like at Day 30?"],
          branches: [
            { label: "Yes — CSM named, kickoff scheduled", action: "→ Closed-won. Begin expansion planning at Day 90.", next: "onboard" },
            { label: "No CSM assigned yet", action: "→ Critical gap. Do not close without a named CSM.", next: "close" },
          ]
        },
      ]
    },
    {
      id: "onboard", name: "Onboarding", time: isEnt ? "Days 1–60" : "Days 1–21",
      nodes: [
        {
          id: "o1", type: "decision",
          q: "Has the customer hit their first value milestone?",
          talkTrack: `"Our goal in the next 30 days: we want you to feel like this was the most obvious decision you made all year. Here's exactly how we'll do that."`,
          actions: [`Define first value milestone in writing: "We will have achieved ${pOut.toLowerCase()} when [measurable thing] happens by [date]"`, "Formal kickoff with all stakeholders — not just the champion", "Weekly check-ins for first 4 weeks, no exceptions", "Identify expansion signal: what behavior signals readiness for more?"],
          branches: [
            { label: "Yes — milestone achieved", action: "→ Expansion conversation. Introduce adjacent use case.", next: "expand" },
            { label: "On track", action: "→ Continue weekly cadence. Surface success story.", next: "onboard" },
            { label: "At risk", action: "→ Escalate immediately. Executive sponsor call within 48 hrs.", next: "rescue" },
          ]
        },
      ]
    },
  ];
  return { cycle, stages, pOut };
}

// ── AI CALL PREP ──────────────────────────────────────────────────────────────

async function fetchCallPrep(company, industry, outcome) {
  const prompt = `You are a B2B sales intelligence analyst. Generate a realistic, detailed call prep brief for a sales rep about to call "${company}" (industry: ${industry || "unknown"}, desired outcome: ${outcome || "revenue growth"}).

Return ONLY valid JSON, no markdown, no explanation. Format:
{
  "summary": "2-sentence company overview",
  "headlines": [
    {"title": "headline text", "date": "Month YYYY", "signal": "why this matters for the call"},
    {"title": "headline text", "date": "Month YYYY", "signal": "why this matters for the call"},
    {"title": "headline text", "date": "Month YYYY", "signal": "why this matters for the call"}
  ],
  "jobs": [
    {"title": "job title", "dept": "department", "signal": "what this hiring signal means"},
    {"title": "job title", "dept": "department", "signal": "what this hiring signal means"}
  ],
  "competitors": ["Competitor A", "Competitor B", "Competitor C"],
  "contacts": [
    {"name": "Full Name", "title": "VP of Revenue", "initials": "FN", "linkedinSignal": "Recently posted about scaling outbound — strong champion signal", "talkingPoint": "Reference their post on [topic]"},
    {"name": "Full Name", "title": "CFO", "initials": "FN", "linkedinSignal": "Commented on cost reduction article", "talkingPoint": "Lead with ROI framing"},
    {"name": "Full Name", "title": "Head of Operations", "initials": "FN", "linkedinSignal": "Shared article on process automation", "talkingPoint": "Efficiency angle resonates"}
  ],
  "openingHook": "One sharp, specific opening line for this call based on a recent signal"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}

async function generatePostCall(company, cohortName, outcomes, treeState, notes) {
  const decisions = Object.entries(treeState).map(([nodeId, choice]) => `${nodeId}: ${choice}`).join(", ");
  const prompt = `You are a sales coach. Generate a post-call summary and follow-up email for a B2B sales rep.

Company: ${company}
Cohort: ${cohortName}
Outcomes discussed: ${outcomes.join(", ")}
Decision path taken: ${decisions || "Qualification stage"}
Rep notes: ${notes || "No notes captured"}

Return ONLY valid JSON:
{
  "summary": "3-4 sentence call summary covering what was discussed, key signals heard, and current deal status",
  "nextSteps": ["Next step 1", "Next step 2", "Next step 3"],
  "dealRisk": "Low / Medium / High — one sentence explanation",
  "emailSubject": "Follow-up email subject line",
  "emailBody": "Full follow-up email body (5-7 sentences, professional, outcome-focused, with a specific CTA and proposed next meeting time placeholder)"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState(1);
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({ company: "", industry: "", acv: "", lead_source: "", close_date: "", product: "", outcome: "" });
  const [fileName, setFileName] = useState("");
  const [drag, setDrag] = useState(false);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);

  // Live call state
  const [callCompany, setCallCompany] = useState("");
  const [activeStage, setActiveStage] = useState(0);
  const [treeState, setTreeState] = useState({});
  const [expandedObjs, setExpandedObjs] = useState({});
  const [rightTab, setRightTab] = useState("prep");
  const [notes, setNotes] = useState("");
  const [noteTimestamps, setNoteTimestamps] = useState([]);

  // Call prep state
  const [prepSearch, setPrepSearch] = useState("");
  const [prepData, setPrepData] = useState(null);
  const [prepLoading, setPrepLoading] = useState(false);

  // Post-call
  const [postCall, setPostCall] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const fileRef = useRef();
  const notesRef = useRef();
  const bottomRef = useRef();

  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    const hdrs = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    const data = lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
      const obj = {};
      hdrs.forEach((h, i) => obj[h] = vals[i] || "");
      return obj;
    }).filter(r => Object.values(r).some(v => v));
    setHeaders(hdrs);
    setRows(data);
    const am = { ...mapping };
    const n = s => s.toLowerCase().replace(/[\s_]/g, "");
    hdrs.forEach(h => {
      const hn = n(h);
      if (hn.includes("company") || hn.includes("account")) am.company = h;
      if (hn.includes("industry") || hn.includes("vertical")) am.industry = h;
      if (hn.includes("acv") || hn.includes("deal") || hn.includes("amount") || hn.includes("value")) am.acv = h;
      if (hn.includes("lead") || hn.includes("source") || hn.includes("channel")) am.lead_source = h;
      if (hn.includes("close") || hn.includes("date")) am.close_date = h;
      if (hn.includes("product") || hn.includes("solution")) am.product = h;
      if (hn.includes("outcome") || hn.includes("goal")) am.outcome = h;
    });
    setMapping(am);
  };

  const loadSample = () => {
    const hdrs = Object.keys(SAMPLE_ROWS[0]);
    setHeaders(hdrs);
    setRows(SAMPLE_ROWS);
    setFileName("sample_crm_export.csv");
    const m = {};
    hdrs.forEach(h => m[h] = h);
    setMapping(m);
  };

  const onFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => parseCSV(e.target.result);
    reader.readAsText(file);
  };

  const handleDrop = useCallback(e => {
    e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]);
  }, []);

  const goToCohorts = () => {
    const built = buildCohorts(rows, mapping);
    setCohorts(built);
    setSelectedCohort(built[0] || null);
    setStep(2);
  };

  const goToOutcomes = () => {
    if (selectedCohort) {
      setSelectedOutcomes(selectedCohort.topOut.slice(0, 2));
      setStep(3);
    }
  };

  const goToCall = () => {
    setActiveStage(0);
    setTreeState({});
    setNotes("");
    setPostCall(null);
    setPrepData(null);
    setRightTab("prep");
    if (selectedCohort && mapping.company) {
      const firstCompany = selectedCohort.members[0]?.row[mapping.company] || "";
      setPrepSearch(firstCompany);
      setCallCompany(firstCompany);
    }
    setStep(4);
  };

  const runPrep = async (company) => {
    if (!company.trim()) return;
    setCallCompany(company);
    setPrepLoading(true);
    setPrepData(null);
    const ind = selectedCohort?.topInd[0] || "";
    const out = selectedOutcomes[0] || "";
    const data = await fetchCallPrep(company, ind, out);
    setPrepData(data);
    setPrepLoading(false);
  };

  const pickBranch = (nodeId, branchLabel, nextStage) => {
    setTreeState(s => ({ ...s, [nodeId]: branchLabel }));
    const stageIds = ["qual", "disc", "sol", "prop", "close", "onboard", "expand", "rescue", "nurture", "disq"];
    const validStages = ["qual", "disc", "sol", "prop", "close", "onboard"];
    if (validStages.includes(nextStage)) {
      const idx = validStages.indexOf(nextStage);
      if (idx > activeStage) setActiveStage(idx);
    }
  };

  const runPostCall = async () => {
    setPostLoading(true);
    setRightTab("post");
    const data = await generatePostCall(
      callCompany || "the prospect",
      selectedCohort?.name || "",
      selectedOutcomes,
      treeState,
      notes
    );
    setPostCall(data);
    setPostLoading(false);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const tree = selectedCohort ? buildTree(selectedCohort, selectedOutcomes) : null;
  const STEPS = ["Import Data", "Cohort Analysis", "Outcome Mapping", "Live Call Mode"];
  const stageIds = ["qual", "disc", "sol", "prop", "close", "onboard"];

  const completedStages = new Set(
    Object.keys(treeState).map(nodeId => {
      for (const [si, s] of tree?.stages.entries() || []) {
        if (s.nodes.some(n => n.id === nodeId)) return si;
      }
      return -1;
    }).filter(i => i >= 0)
  );

  const progress = tree ? Math.round((completedStages.size / tree.stages.length) * 100) : 0;

  return (
    <>
      <style>{FONTS}{css}</style>
      <div className="app">
        <header className="header">
          <div className="logo serif">Cambrian <span>Catalyst</span></div>
          <div className="stepper">
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && <div className="step-div" />}
                <div className={`step-item ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}
                  onClick={() => { if (step > i + 1) setStep(i + 1); }}>
                  <div className="step-num">{step > i + 1 ? "✓" : i + 1}</div>
                  {s}
                </div>
              </div>
            ))}
          </div>
          {step === 4 && (
            <div className="live-badge">
              <div className="live-dot" />
              Live Call
            </div>
          )}
          {step !== 4 && <div style={{ width: 120 }} />}
        </header>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="page">
            <div className="page-title serif">Import Customer Data</div>
            <div className="page-sub">Upload a CRM export to begin cohort analysis. Auto-detects field mappings from Salesforce, HubSpot, or custom CSV exports.</div>
            <div className={`upload-zone ${drag ? "drag" : ""}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}>
              <div className="upload-icon">↑</div>
              <div className="upload-label serif">{fileName || "Drop your CSV file here"}</div>
              <div className="upload-hint">{rows.length > 0 ? `${rows.length} records loaded` : "Salesforce · HubSpot · Custom CRM"}</div>
              <button className="btn btn-secondary" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>Browse File</button>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => onFile(e.target.files[0])} />
            </div>
            <div style={{ textAlign: "center", margin: "14px 0", color: "#ccc", fontSize: "12px" }}>— or —</div>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <button className="btn btn-secondary" onClick={loadSample}>Load Sample Data (12 accounts)</button>
            </div>
            {rows.length > 0 && (<>
              <div className="card">
                <div className="card-title serif">Map Your Fields</div>
                <div className="field-grid">
                  {[
                    { key: "company", label: "Company / Account", req: true },
                    { key: "industry", label: "Industry / Vertical", req: true },
                    { key: "acv", label: "Deal Size / ACV", req: true },
                    { key: "lead_source", label: "Lead Source", req: true },
                    { key: "close_date", label: "Close Date" },
                    { key: "product", label: "Product / Solution" },
                    { key: "outcome", label: "Customer Outcome / Use Case" },
                  ].map(f => (
                    <div className="field-row" key={f.key}>
                      <div className="field-label">{f.label} {f.req && <span className="req">*</span>}</div>
                      <select value={mapping[f.key]} onChange={e => setMapping(m => ({ ...m, [f.key]: e.target.value }))}>
                        <option value="">— not mapped —</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-title serif">Data Preview <span style={{ fontFamily: "DM Sans", fontSize: "12px", fontWeight: 400, color: "#999" }}>(first 5 rows)</span></div>
                <div className="preview-table-wrap">
                  <table className="preview-table">
                    <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>{rows.slice(0, 5).map((r, i) => <tr key={i}>{headers.map(h => <td key={h}>{r[h]}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              </div>
              <div className="actions-row">
                <button className="btn btn-primary btn-lg" onClick={goToCohorts}>Build Cohorts →</button>
              </div>
            </>)}
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="page">
            <div className="page-title serif">Customer Cohort Analysis</div>
            <div className="page-sub">{rows.length} accounts segmented into {cohorts.length} cohorts. Select a cohort to build its outcome map and live call playbook.</div>
            <div className="summary-grid">
              <div className="summary-stat"><div className="summary-num serif">{rows.length}</div><div className="summary-label">Total Accounts</div></div>
              <div className="summary-stat"><div className="summary-num serif">{cohorts.length}</div><div className="summary-label">Cohorts</div></div>
              <div className="summary-stat">
                <div className="summary-num serif">${Math.round(rows.reduce((s, r) => s + parseACV(mapping.acv ? r[mapping.acv] : "0"), 0) / 1000)}K</div>
                <div className="summary-label">Total Pipeline ACV</div>
              </div>
            </div>
            <div className="cohort-grid">
              {cohorts.map(c => (
                <div key={c.id} className={`cohort-card ${selectedCohort?.id === c.id ? "selected" : ""}`} onClick={() => setSelectedCohort(c)}>
                  <div className="cohort-name"><span className="cohort-dot" style={{ background: c.color }} />{c.name}</div>
                  <div className="cohort-size">{c.size} accounts · {c.pct}% of base</div>
                  <div className="cohort-tags">
                    {c.topInd.map(t => <span key={t} className="tag tag-ind">{t}</span>)}
                    {c.avgACV > 0 && <span className="tag tag-size">${(c.avgACV / 1000).toFixed(0)}K avg</span>}
                    {c.topSrc.map(t => <span key={t} className="tag tag-src">{t}</span>)}
                  </div>
                  <div className="cohort-tags">{c.topOut.map(t => <span key={t} className="tag tag-out">{t}</span>)}</div>
                  <div className="cohort-stat">Avg ACV: <strong>${c.avgACV > 0 ? c.avgACV.toLocaleString() : "Unknown"}</strong></div>
                </div>
              ))}
            </div>
            <div className="actions-row">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={goToOutcomes} disabled={!selectedCohort}>Map Outcomes →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && selectedCohort && (
          <div className="page">
            <div className="page-title serif">Outcome Mapping</div>
            <div className="page-sub">Select the desired outcomes for <strong>{selectedCohort.name}</strong>. These tailor talk tracks, objection handling, and decision gates in the live call mode.</div>
            <div className="notice"><strong>Outcome-agnostic · Industry-agnostic.</strong> The playbook framework works across all verticals. Outcomes customize the language and priority signals — not the sales motion.</div>
            <div className="outcome-grid">
              {OUTCOMES.map(o => (
                <div key={o.id} className={`outcome-tile ${selectedOutcomes.includes(o.title) ? "selected" : ""}`} onClick={() => setSelectedOutcomes(p => p.includes(o.title) ? p.filter(x => x !== o.title) : [...p, o.title])}>
                  <div className="outcome-icon">{o.icon}</div>
                  <div className="outcome-title">{o.title}</div>
                  <div className="outcome-sub">{o.sub}</div>
                </div>
              ))}
            </div>
            <div className="actions-row">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-green btn-lg" onClick={goToCall} disabled={selectedOutcomes.length === 0}>
                Start Live Call Mode →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: LIVE CALL ── */}
        {step === 4 && selectedCohort && tree && (
          <div className="call-layout">

            {/* LEFT: Decision Tree */}
            <div className="call-left">
              <div className="call-panel-header">
                <div>
                  <div className="call-panel-title serif">Live Call Playbook</div>
                  <div style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}>
                    {selectedCohort.name} · {tree.cycle} cycle · {selectedOutcomes[0]}
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setStep(3)}>← Setup</button>
              </div>

              <div className="stage-tabs">
                {tree.stages.map((s, i) => (
                  <button key={s.id} className={`stage-tab ${activeStage === i ? "active" : ""} ${completedStages.has(i) ? "completed" : ""}`}
                    onClick={() => setActiveStage(i)}>
                    {completedStages.has(i) ? "✓ " : ""}{s.name}
                  </button>
                ))}
              </div>

              <div className="call-panel-body">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>

                {tree.stages.map((stage, si) => si === activeStage && (
                  <div key={stage.id}>
                    <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", marginBottom: "12px" }}>
                      Stage {si + 1} of {tree.stages.length} · {stage.time}
                    </div>

                    {/* Actions first */}
                    <div className="action-node">
                      <div className="action-node-label">Pre-Call / On-Call Actions</div>
                      <div className="action-list">
                        {stage.nodes[0].actions.map((a, i) => (
                          <div key={i} className="action-item">
                            <div className="action-num">{i + 1}</div>
                            <div>{a}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Talk Track */}
                    <div className="talk-box">
                      <div className="talk-box-label">Talk Track</div>
                      <div className="talk-box-text">{stage.nodes[0].talkTrack}</div>
                    </div>

                    {/* Decision gate */}
                    {stage.nodes.map(node => (
                      <div key={node.id} className={`node ${treeState[node.id] ? "completed" : "active"}`}>
                        <div className="node-header">
                          <div className={`node-icon ${treeState[node.id] ? "done" : "q"}`}>
                            {treeState[node.id] ? "✓" : "?"}
                          </div>
                          <div>
                            <div className="node-q">{node.q}</div>
                            {treeState[node.id] && (
                              <div className="node-answer">→ {treeState[node.id]}</div>
                            )}
                          </div>
                        </div>
                        {!treeState[node.id] && (
                          <div className="node-branches">
                            {node.branches.map((b, bi) => (
                              <button key={bi} className="branch-btn" onClick={() => pickBranch(node.id, b.label, b.next)}>
                                <div className="branch-if">{bi === 0 ? "Yes" : bi === 1 ? "Partial" : "No"}</div>
                                <div>
                                  <div className="branch-text">{b.label}</div>
                                  <div className="branch-action">{b.action}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {treeState[node.id] && (
                          <div style={{ padding: "0 14px 10px" }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setTreeState(s => { const ns = { ...s }; delete ns[node.id]; return ns; })}>
                              Undo
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Objections */}
                    <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", margin: "14px 0 8px" }}>
                      Objection Handling
                    </div>
                    <div className="obj-list">
                      {[
                        { q: "We're not looking right now", a: `"Most of our best customers said the same. What would need to change for ${tree.pOut.toLowerCase()} to become a priority?"` },
                        { q: "We don't have budget", a: `"Let's table that. If we found a clear ROI path to ${tree.pOut.toLowerCase()}, would leadership prioritize it next cycle?"` },
                        { q: "We're evaluating other vendors", a: `"That's fair. What criteria matter most? Tell me what a win looks like and I'll make sure we're competing on the right ground."` },
                        { q: "We need to involve IT / Legal", a: `"Absolutely — who's the right person to include? Better to get them in early than have them become a blocker later."` },
                      ].map((o, i) => (
                        <div key={i} className="obj-item">
                          <button className="obj-q-btn" onClick={() => setExpandedObjs(s => ({ ...s, [`${si}-${i}`]: !s[`${si}-${i}`] }))}>
                            "{o.q}"
                            <span style={{ color: "#aaa", fontSize: "14px" }}>{expandedObjs[`${si}-${i}`] ? "−" : "+"}</span>
                          </button>
                          {expandedObjs[`${si}-${i}`] && <div className="obj-a-text">{o.a}</div>}
                        </div>
                      ))}
                    </div>

                    {/* Stage nav */}
                    <div style={{ display: "flex", gap: "8px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #E8E6DF" }}>
                      {si > 0 && <button className="btn btn-secondary btn-sm" onClick={() => setActiveStage(si - 1)}>← Prev Stage</button>}
                      {si < tree.stages.length - 1 && (
                        <button className="btn btn-gold btn-sm" onClick={() => setActiveStage(si + 1)}>
                          Next: {tree.stages[si + 1].name} →
                        </button>
                      )}
                      {si === tree.stages.length - 1 && (
                        <button className="btn btn-green btn-sm" onClick={runPostCall} disabled={postLoading}>
                          {postLoading ? "Generating..." : "End Call & Generate Summary"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* End call button visible at bottom of any stage */}
                {activeStage < tree.stages.length - 1 && (
                  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #F0EDE6" }}>
                    <button className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={runPostCall} disabled={postLoading}>
                      {postLoading ? "Generating..." : "End Call Early & Generate Summary"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Prep + Notes + Post-call */}
            <div className="call-right">
              <div className="right-tabs">
                {[["prep", "Call Prep"], ["notes", "Notes"], ["post", "Post-Call"]].map(([id, label]) => (
                  <button key={id} className={`right-tab ${rightTab === id ? "active" : ""}`} onClick={() => setRightTab(id)}>
                    {label}
                    {id === "post" && postCall && " ✓"}
                  </button>
                ))}
              </div>

              <div className="call-panel-body">

                {/* PREP TAB */}
                {rightTab === "prep" && (
                  <>
                    <div className="prep-search">
                      <input
                        type="text"
                        placeholder="Company name..."
                        value={prepSearch}
                        onChange={e => setPrepSearch(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && runPrep(prepSearch)}
                      />
                      <button className="btn btn-gold btn-sm" onClick={() => runPrep(prepSearch)} disabled={prepLoading}>
                        {prepLoading ? "..." : "Research"}
                      </button>
                    </div>

                    {/* Quick-pick from cohort */}
                    {selectedCohort?.members.length > 0 && (
                      <div style={{ marginBottom: "14px" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", marginBottom: "6px" }}>
                          From your cohort
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {selectedCohort.members.slice(0, 6).map((m, i) => {
                            const co = mapping.company ? m.row[mapping.company] : m.company;
                            return (
                              <button key={i} className="btn btn-secondary btn-sm" onClick={() => { setPrepSearch(co); runPrep(co); }}>
                                {co}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {prepLoading && (
                      <div className="loading-pulse">
                        {[80, 60, 90, 50, 70, 40, 85].map((w, i) => (
                          <div key={i} className="pulse-line" style={{ width: `${w}%`, animationDelay: `${i * 0.12}s` }} />
                        ))}
                      </div>
                    )}

                    {prepData && !prepLoading && (
                      <>
                        {/* Opening hook */}
                        <div className="talk-box" style={{ marginBottom: "16px" }}>
                          <div className="talk-box-label">Recommended Opening Hook</div>
                          <div className="talk-box-text">{prepData.openingHook}</div>
                        </div>

                        {/* Summary */}
                        <div className="intel-section">
                          <div className="intel-label"><div className="intel-dot" />Company Overview</div>
                          <div className="intel-item">
                            <div style={{ fontSize: "12px", color: "#333", lineHeight: 1.6 }}>{prepData.summary}</div>
                          </div>
                        </div>

                        {/* Headlines */}
                        <div className="intel-section">
                          <div className="intel-label"><div className="intel-dot" />Recent News & Signals</div>
                          {prepData.headlines?.map((h, i) => (
                            <div key={i} className="intel-item">
                              <div className="intel-headline">{h.title}</div>
                              <div className="intel-meta">{h.date} · {h.signal}</div>
                            </div>
                          ))}
                        </div>

                        {/* Jobs */}
                        <div className="intel-section">
                          <div className="intel-label"><div className="intel-dot" />Active Job Postings</div>
                          {prepData.jobs?.map((j, i) => (
                            <div key={i} className="intel-item">
                              <div className="intel-headline">{j.title} <span style={{ color: "#aaa", fontWeight: 400 }}>· {j.dept}</span></div>
                              <div className="intel-meta">{j.signal}</div>
                            </div>
                          ))}
                        </div>

                        {/* Competitors */}
                        <div className="intel-section">
                          <div className="intel-label"><div className="intel-dot" />Likely Competitors in Eval</div>
                          <div className="intel-item">
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                              {prepData.competitors?.map((c, i) => (
                                <span key={i} className="tag tag-ind" style={{ fontSize: "11px" }}>{c}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Key Contacts */}
                        <div className="intel-section">
                          <div className="intel-label"><div className="intel-dot" />Key Contacts</div>
                          {prepData.contacts?.map((c, i) => (
                            <div key={i} className="intel-item">
                              <div className="intel-contact">
                                <div className="intel-avatar">{c.initials}</div>
                                <div className="intel-contact-info">
                                  <div className="intel-contact-name">{c.name}</div>
                                  <div className="intel-contact-title">{c.title}</div>
                                  <div className="intel-contact-signal">{c.linkedinSignal}</div>
                                  <div style={{ fontSize: "11px", color: "#8B6F47", marginTop: "2px", fontWeight: 500 }}>
                                    → {c.talkingPoint}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {!prepData && !prepLoading && (
                      <div style={{ textAlign: "center", padding: "40px 20px", color: "#bbb" }}>
                        <div style={{ fontSize: "28px", marginBottom: "10px" }}>◎</div>
                        <div style={{ fontSize: "13px" }}>Enter a company name to generate<br />AI-powered call prep intelligence</div>
                      </div>
                    )}
                  </>
                )}

                {/* NOTES TAB */}
                {rightTab === "notes" && (
                  <>
                    <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", marginBottom: "10px" }}>
                      Call Notes
                    </div>
                    <textarea
                      ref={notesRef}
                      className="notes-area"
                      placeholder="Type notes here as you go... Use [Tab] to add a timestamp."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                          const pos = e.target.selectionStart;
                          const before = notes.slice(0, pos);
                          const after = notes.slice(pos);
                          setNotes(before + `\n[${ts}] ` + after);
                        }
                      }}
                      style={{ minHeight: "300px" }}
                    />
                    <div className="notes-meta">Press Tab to insert a timestamp · Notes are included in the post-call summary</div>

                    <div className="divider" />

                    <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", marginBottom: "10px" }}>
                      Current Stage: {tree.stages[activeStage]?.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#777", lineHeight: 1.6 }}>
                      Decisions logged this call: {Object.keys(treeState).length} of {tree.stages.reduce((s, st) => s + st.nodes.length, 0)} gates
                    </div>
                    {Object.entries(treeState).map(([k, v]) => (
                      <div key={k} style={{ fontSize: "11px", color: "#555", padding: "6px 0", borderBottom: "1px solid #F0EDE6" }}>
                        <span style={{ color: "#aaa" }}>{k}</span> → {v}
                      </div>
                    ))}
                  </>
                )}

                {/* POST-CALL TAB */}
                {rightTab === "post" && (
                  <>
                    {postLoading && (
                      <div>
                        <div style={{ fontSize: "13px", color: "#777", marginBottom: "14px" }}>Generating call summary and follow-up email...</div>
                        <div className="loading-pulse">
                          {[85, 60, 75, 50, 90, 40, 70].map((w, i) => (
                            <div key={i} className="pulse-line" style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {!postCall && !postLoading && (
                      <div style={{ textAlign: "center", padding: "40px 20px", color: "#bbb" }}>
                        <div style={{ fontSize: "28px", marginBottom: "10px" }}>◇</div>
                        <div style={{ fontSize: "13px" }}>Post-call summary and follow-up<br />email will appear here when you<br />end the call session.</div>
                        <button className="btn btn-secondary btn-sm" style={{ marginTop: "16px" }} onClick={runPostCall}>
                          Generate Now
                        </button>
                      </div>
                    )}

                    {postCall && !postLoading && (
                      <>
                        <div className="post-call-section">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <div className="post-call-label">Call Summary</div>
                            <button className="copy-btn" onClick={() => copyText(postCall.summary, "summary")}>
                              {copied === "summary" ? "Copied ✓" : "Copy"}
                            </button>
                          </div>
                          <div className="post-call-content">{postCall.summary}</div>
                        </div>

                        <div className="post-call-section">
                          <div className="post-call-label">Next Steps</div>
                          <div className="post-call-content">
                            {postCall.nextSteps?.map((s, i) => `${i + 1}. ${s}`).join("\n")}
                          </div>
                        </div>

                        <div className="post-call-section">
                          <div className="post-call-label">Deal Risk</div>
                          <div className="post-call-content">{postCall.dealRisk}</div>
                        </div>

                        <div className="post-call-section">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <div className="post-call-label">Follow-Up Email</div>
                            <button className="copy-btn" onClick={() => copyText(`Subject: ${postCall.emailSubject}\n\n${postCall.emailBody}`, "email")}>
                              {copied === "email" ? "Copied ✓" : "Copy Email"}
                            </button>
                          </div>
                          <div className="post-call-content" style={{ fontSize: "12px" }}>
                            <div style={{ fontWeight: 600, marginBottom: "8px", color: "#1a1a18" }}>Subject: {postCall.emailSubject}</div>
                            {postCall.emailBody}
                          </div>
                        </div>

                        <div className="actions-row" style={{ marginTop: "16px" }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => { setPostCall(null); runPostCall(); }}>
                            Regenerate
                          </button>
                          <button className="btn btn-primary btn-sm" onClick={() => { setStep(2); setSelectedCohort(null); }}>
                            New Call
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
