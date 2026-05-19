/**
 * extract-facts.js — Pull atomic facts from a brief JSON object.
 * Maps brief fields to the fact schema used in companies.json.
 *
 * Each extractor returns a string value that can be compared against ground truth.
 */

/** Strip web_search citation tags from text */
const stripCites = s => typeof s === "string" ? s.replace(/<\/?cite[^>]*>/g, "").trim() : (s || "");

const extractors = {
  /** Industry — from companySnapshot or Apollo enrichment */
  industry(brief) {
    return stripCites(brief.companySnapshot);
  },

  /** Ownership type — from publicPrivate field */
  ownership_type(brief) {
    return stripCites(brief.publicPrivate);
  },

  /** HQ location — from headquarters field */
  hq_location(brief) {
    return stripCites(brief.headquarters);
  },

  /** Revenue — from revenue field */
  revenue(brief) {
    return stripCites(brief.revenue);
  },

  /** Employee count — from employeeCount field */
  employee_count(brief) {
    return stripCites(brief.employeeCount);
  },

  /** Founded year — from founded field */
  founded(brief) {
    return stripCites(brief.founded);
  },

  /** Stock ticker — from publicPrivate field (contains ticker if public) */
  ticker(brief) {
    return stripCites(brief.publicPrivate);
  },
};

/**
 * Extract a single fact value from the brief.
 * @param {string} field — the fact field name (from companies.json)
 * @param {object} brief — the full brief JSON
 * @returns {string} — the extracted value
 */
export function extractFact(field, brief) {
  const fn = extractors[field];
  if (!fn) return "";
  try {
    return fn(brief);
  } catch {
    return "";
  }
}

/**
 * Extract all facts for a company from the brief, matched against the
 * company's fact definitions.
 * @param {object} company — the company entry from companies.json
 * @param {object} brief — the full brief JSON
 * @returns {Array<{field, expected, actual, match, options}>}
 */
export function extractAllFacts(company, brief) {
  return (company.facts || []).map(fact => {
    const actual = extractFact(fact.field, brief);
    return {
      field: fact.field,
      tier: fact.tier,
      expected: fact.value,
      actual,
      match: fact.match,
      options: {
        tolerance_pct: fact.tolerance_pct,
        accepted: fact.accepted,
        min: fact.min,
        max: fact.max,
      },
    };
  });
}

/**
 * Get the full brief text as a single string (for absence/entity-confusion checks).
 * Strips citation tags so they don't interfere with matching.
 */
export function briefToText(brief) {
  return JSON.stringify(brief).replace(/<\/?cite[^>]*>/g, "");
}
