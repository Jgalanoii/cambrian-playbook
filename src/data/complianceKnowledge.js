// src/data/complianceKnowledge.js
//
// Compliance awareness layer for sales enablement. NOT legal advice.
// 13 frameworks across 4 verticals with discovery questions, talking
// points, objection handling, trigger phrases, and handoff protocols.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Source: compliance-knowledge-layer.json (schema v1.0.0)

import data from "./compliance-knowledge-layer.json";

// ── Framework lookups ───────────────────────────────────────────────────

export const getFrameworkById = (id) =>
  data.frameworks.find(f => f.id === id);

export const getFrameworksForVertical = (verticalId, tier = null) => {
  const v = data.vertical_map[verticalId];
  if (!v) return [];
  const ids = tier === "primary" ? v.primary_frameworks
    : tier === "secondary" ? v.secondary_frameworks
    : tier === "adjacent" ? (v.adjacent_frameworks || [])
    : [...v.primary_frameworks, ...v.secondary_frameworks, ...(v.adjacent_frameworks || [])];
  return ids.map(getFrameworkById).filter(Boolean);
};

// ── Trigger phrase detection ────────────────────────────────────────────
// Scans free text (discovery notes, prospect descriptions) for compliance
// trigger phrases and returns matching frameworks.

export const detectFrameworksFromText = (text) => {
  if (!text) return [];
  const matches = new Set();
  const low = text.toLowerCase();
  data.frameworks.forEach(f => {
    (f.trigger_phrases || []).forEach(phrase => {
      if (low.includes(phrase.toLowerCase())) matches.add(f.id);
    });
  });
  return Array.from(matches).map(getFrameworkById).filter(Boolean);
};

// ── Vertical compliance map ─────────────────────────────────────────────

export const COMPLIANCE_VERTICAL_MAP = data.vertical_map;

// ── Handoff protocol ────────────────────────────────────────────────────

export const HANDOFF_PROTOCOL = data.handoff_protocol;

// ── Prompt injection builder ────────────────────────────────────────────
// Builds a compliance context string for injection into scoring, brief,
// hypothesis, and discovery prompts. Matches frameworks based on the
// seller's vertical and the target's industry.

const VERTICAL_KEYWORDS = {
  fintech_payments: ["fintech", "payment", "banking", "financial", "lending", "neobank", "processor", "acquiring", "interchange", "payfac", "iso ", "card program"],
  digital_rewards_incentives: ["incentive", "reward", "gift card", "recognition", "promo", "loyalty", "merchandise", "stored-value"],
  health_wellness_b2b: ["health", "wellness", "clinical", "hipaa", "healthcare", "medical", "patient", "pharma", "biotech", "telehealth"],
  market_research: ["research", "survey", "panel", "respondent", "insights", "analytics"],
};

export function buildComplianceInjection(sellerICP, targetIndustry) {
  const text = [
    sellerICP?.marketCategory,
    sellerICP?.sellerDescription,
    ...(sellerICP?.icp?.industries || []),
    targetIndustry,
  ].filter(Boolean).join(" ").toLowerCase();
  if (!text) return "";

  // Find matching verticals
  const matchedVerticals = [];
  for (const [vId, keywords] of Object.entries(VERTICAL_KEYWORDS)) {
    const hits = keywords.filter(kw => text.includes(kw));
    if (hits.length >= 1) matchedVerticals.push(vId);
  }
  if (!matchedVerticals.length) return "";

  // Collect unique primary frameworks from matched verticals
  const seen = new Set();
  const frameworks = [];
  for (const vId of matchedVerticals) {
    const primary = getFrameworksForVertical(vId, "primary");
    for (const f of primary) {
      if (!seen.has(f.id)) {
        seen.add(f.id);
        frameworks.push(f);
      }
    }
  }
  if (!frameworks.length) return "";

  // Build compact injection (keep under ~500 tokens for prompt efficiency)
  const parts = ["\nCOMPLIANCE AWARENESS (sales enablement — not legal advice):"];
  for (const f of frameworks.slice(0, 5)) {
    parts.push(`- ${f.name}: ${f.talking_points.what_reps_should_know.split(".").slice(0, 2).join(".")}.`);
  }
  parts.push("RULE: If compliance comes up in prospect conversation, position awareness confidently but escalate to SME for program design, audit scope, or legal interpretation.");
  return parts.join("\n") + "\n";
}

// ── Compliance discovery questions ──────────────────────────────────────
// Returns relevant discovery questions for frameworks matching the context.

export function getComplianceDiscoveryQuestions(sellerICP, targetIndustry) {
  const text = [
    sellerICP?.marketCategory,
    sellerICP?.sellerDescription,
    ...(sellerICP?.icp?.industries || []),
    targetIndustry,
  ].filter(Boolean).join(" ").toLowerCase();
  if (!text) return "";

  const matchedVerticals = [];
  for (const [vId, keywords] of Object.entries(VERTICAL_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) matchedVerticals.push(vId);
  }
  if (!matchedVerticals.length) return "";

  const seen = new Set();
  const questions = [];
  for (const vId of matchedVerticals) {
    const primary = getFrameworksForVertical(vId, "primary");
    for (const f of primary) {
      if (!seen.has(f.id) && f.discovery_questions?.length) {
        seen.add(f.id);
        questions.push(`${f.name}: ${f.discovery_questions[0]}`);
      }
    }
  }
  if (!questions.length) return "";
  return `\nCOMPLIANCE DISCOVERY (ask when relevant):\n${questions.slice(0, 4).map(q => `- ${q}`).join("\n")}\n`;
}

// ── Full data export for knowledge API ──────────────────────────────────
export const COMPLIANCE_FRAMEWORKS = data.frameworks;
export const COMPLIANCE_DISCLAIMER = data.disclaimer;
