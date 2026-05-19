/**
 * invariants.js — Structural integrity checks for briefs.
 * These test properties that must hold regardless of specific values.
 * Catches Tier-3 failures (contradictions, entity confusion, placeholders).
 *
 * Each invariant: (brief, company) => { pass, detail }
 */

const PLACEHOLDER_PATTERNS = [
  /\[placeholder\]/i, /\[tbd\]/i, /\[to be determined\]/i,
  /\[verify\]/i, /\[unsupported/i, /\[research needed/i,
  /not found/i, /not specified/i, /not available/i,
  /unable to (find|determine|verify|search)/i,
];

const invariants = {
  /**
   * exec_consistency — CEO named identically across sections.
   * Direct regression test for the Caruso/Ucuzoglu bug.
   */
  exec_consistency(brief) {
    const ceo = (brief.keyExecutives || []).find(e =>
      e?.title && /\bceo\b/i.test(e.title) && e.name
    );
    if (!ceo) return { pass: true, detail: "no CEO in executives — skipped" };

    const ceoName = ceo.name.toLowerCase();
    const textFields = [
      brief.companySnapshot,
      brief.strategicTheme,
      brief.elevatorPitch,
      brief.openingAngle,
      brief.sellerOpportunity,
      brief.publicSentiment?.onlineSentiment,
      brief.publicSentiment?.employeeScore,
      brief.financialDeepDive?.earningsInsight,
      brief.financialDeepDive?.capitalPriorities,
    ].filter(Boolean);

    // Look for "CEO [Name]" patterns that don't match
    const conflicts = [];
    for (const text of textFields) {
      const mentions = text.match(/(?:CEO|chief executive officer)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi) || [];
      for (const m of mentions) {
        const name = m.replace(/CEO|chief executive officer/gi, "").trim().toLowerCase();
        if (name && !ceoName.includes(name.split(" ").pop()) && name !== ceoName) {
          conflicts.push(m.trim());
        }
      }
    }

    if (conflicts.length > 0) {
      return { pass: false, detail: `CEO conflict: executives says "${ceo.name}" but text mentions: ${conflicts.join(", ")}` };
    }
    return { pass: true, detail: `CEO "${ceo.name}" consistent across sections` };
  },

  /**
   * no_placeholders — no placeholder text in any field.
   */
  no_placeholders(brief) {
    const found = [];
    const check = (val, path) => {
      if (typeof val === "string" && val.length > 0) {
        for (const pat of PLACEHOLDER_PATTERNS) {
          if (pat.test(val)) {
            found.push(`${path}: "${val.slice(0, 80)}"`);
            break;
          }
        }
      } else if (Array.isArray(val)) {
        val.forEach((item, i) => check(item, `${path}[${i}]`));
      } else if (val && typeof val === "object") {
        for (const [k, v] of Object.entries(val)) {
          if (k.startsWith("_")) continue; // skip internal fields
          check(v, `${path}.${k}`);
        }
      }
    };
    check(brief, "brief");

    if (found.length > 0) {
      return { pass: false, detail: `${found.length} placeholder(s) found: ${found.slice(0, 3).join("; ")}` };
    }
    return { pass: true, detail: "no placeholders found" };
  },

  /**
   * no_entity_confusion — forbidden strings absent from the entire brief.
   * Used for disambiguation traps (Apollo.io vs Apollo Global).
   */
  no_entity_confusion(brief, company) {
    const forbidden = company.forbidden_strings || [];
    if (!forbidden.length) return { pass: true, detail: "no forbidden strings configured" };

    const allText = JSON.stringify(brief).toLowerCase();
    const found = forbidden.filter(f => allText.includes(f.toLowerCase()));

    if (found.length > 0) {
      return { pass: false, detail: `ENTITY CONFUSION: found forbidden strings: ${found.join(", ")}` };
    }
    return { pass: true, detail: `none of ${forbidden.length} forbidden strings found` };
  },

  /**
   * revenue_consistency — revenue figure consistent across p1 and p9.
   */
  revenue_consistency(brief) {
    const p1Rev = brief.revenue;
    const p9Rev = brief.financialDeepDive?.revenueTrend;
    if (!p1Rev || !p9Rev) return { pass: true, detail: "one or both revenue fields empty — skipped" };

    // Extract the first dollar figure from each
    const extractFirst = (s) => {
      const m = String(s).match(/\$[\d.,]+\s*(billion|trillion|million|bn|tn|[BTM])?/i);
      return m ? m[0] : null;
    };
    const r1 = extractFirst(p1Rev);
    const r9 = extractFirst(p9Rev);
    if (!r1 || !r9) return { pass: true, detail: "could not extract figures for comparison — skipped" };

    // Rough check: first few significant digits should match
    const digits = (s) => s.replace(/[^0-9.]/g, "").slice(0, 4);
    const pass = digits(r1) === digits(r9);
    return { pass, detail: pass ? `revenue consistent: ${r1} ~ ${r9}` : `revenue mismatch: overview="${r1}" vs financials="${r9}"` };
  },

  /**
   * data_confidence_present — for data-scarce targets, brief should show
   * a data-confidence caveat or low/medium confidence.
   */
  data_confidence_present(brief, company) {
    if (company.category !== "data-scarce-private") {
      return { pass: true, detail: "not a data-scarce target — skipped" };
    }
    const hasConfidence = brief._dataConfidence && brief._dataConfidence !== "high";
    const hasCaveat = (brief.companySnapshot || "").toLowerCase().includes("limited") ||
                      (brief.companySnapshot || "").toLowerCase().includes("data") ||
                      (brief.companySnapshot || "").toLowerCase().includes("private");
    const pass = hasConfidence || hasCaveat;
    return { pass, detail: pass ? `data-scarce caveat present (confidence: ${brief._dataConfidence})` : "data-scarce target but no confidence caveat" };
  },
};

/**
 * Run a named invariant check.
 * @param {string} name — key from the invariants object
 * @param {object} brief — the full brief JSON
 * @param {object} company — the company entry from companies.json
 * @returns {{ pass: boolean, detail: string }}
 */
export function runInvariant(name, brief, company) {
  const fn = invariants[name];
  if (!fn) return { pass: false, detail: `unknown invariant: ${name}` };
  try {
    return fn(brief, company);
  } catch (e) {
    return { pass: false, detail: `invariant error: ${e.message}` };
  }
}
