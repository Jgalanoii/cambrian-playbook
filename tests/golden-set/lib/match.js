/**
 * match.js — Golden-set fact-matching rules.
 * Pure Node, zero dependencies.
 *
 * Each rule takes (actual, expected, options) and returns { pass, detail }.
 */

/** Normalize whitespace and case for comparison */
const norm = s => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();

/** Extract a number from a string like "$182.4B", "~2.1M", "318,512", "$681 billion" */
function extractNumber(s) {
  if (typeof s === "number") return s;
  if (!s) return NaN;
  const str = String(s).replace(/,/g, "").trim();

  // Handle "$182.4B" / "$6.9B" / "$681 billion" patterns
  const billionMatch = str.match(/([\d.]+)\s*(billion|bn|b)\b/i);
  if (billionMatch) return parseFloat(billionMatch[1]) * 1e9;

  const trillionMatch = str.match(/([\d.]+)\s*(trillion|tn|t)\b/i);
  if (trillionMatch) return parseFloat(trillionMatch[1]) * 1e12;

  const millionMatch = str.match(/([\d.]+)\s*(million|mn|m)\b/i);
  if (millionMatch) return parseFloat(millionMatch[1]) * 1e6;

  const thousandMatch = str.match(/([\d.]+)\s*(thousand|k)\b/i);
  if (thousandMatch) return parseFloat(thousandMatch[1]) * 1e3;

  // Plain number: "318512", "~10,140", "$45.5"
  const plain = str.replace(/[^0-9.]/g, "");
  return plain ? parseFloat(plain) : NaN;
}

const rules = {
  /** Normalized string equality */
  exact(actual, expected) {
    const pass = norm(actual) === norm(expected);
    return { pass, detail: pass ? "exact match" : `expected "${expected}", got "${actual}"` };
  },

  /** Generated value contains the ground-truth value (case-insensitive) */
  fuzzy_contains(actual, expected) {
    const pass = norm(actual).includes(norm(expected));
    return { pass, detail: pass ? `contains "${expected}"` : `"${expected}" not found in "${String(actual).slice(0, 100)}"` };
  },

  /** City/state match tolerant of abbreviations and formatting */
  fuzzy_location(actual, expected) {
    const a = norm(actual);
    const e = norm(expected);
    // Direct containment
    if (a.includes(e)) return { pass: true, detail: `contains "${expected}"` };
    // Common abbreviations
    const abbrevs = {
      "new york": ["nyc", "ny", "new york city", "manhattan"],
      "san francisco": ["sf", "san fran"],
      "san antonio": ["sa", "san antonio"],
      "bentonville": ["bentonville"],
      "los angeles": ["la", "l.a."],
    };
    const variants = abbrevs[e] || [];
    const pass = variants.some(v => a.includes(v));
    return { pass, detail: pass ? `location match via abbreviation` : `"${expected}" not found in "${String(actual).slice(0, 100)}"` };
  },

  /** Within tolerance_pct of ground truth */
  numeric_tolerance(actual, expected, { tolerance_pct = 10 } = {}) {
    const aNum = extractNumber(actual);
    const eNum = typeof expected === "number" ? expected : extractNumber(expected);
    if (isNaN(aNum) || isNaN(eNum)) {
      return { pass: false, detail: `could not parse numbers: actual="${actual}" (${aNum}), expected=${eNum}` };
    }
    const pctDiff = Math.abs(aNum - eNum) / eNum * 100;
    const pass = pctDiff <= tolerance_pct;
    return { pass, detail: `${aNum.toLocaleString()} vs ${eNum.toLocaleString()} (${pctDiff.toFixed(1)}% diff, threshold ${tolerance_pct}%)` };
  },

  /** Value falls within [min, max] */
  range_membership(actual, _expected, { min, max } = {}) {
    const aNum = extractNumber(actual);
    if (isNaN(aNum)) return { pass: false, detail: `could not parse number from "${actual}"` };
    const pass = aNum >= (min || 0) && aNum <= (max || Infinity);
    return { pass, detail: `${aNum} in [${min}, ${max}]: ${pass}` };
  },

  /** Value is one of an accepted-answers array */
  set_membership(actual, _expected, { accepted = [] } = {}) {
    const a = norm(actual);
    const pass = accepted.some(opt => a.includes(norm(opt)));
    return { pass, detail: pass ? `matched accepted set` : `"${actual}" not in [${accepted.join(", ")}]` };
  },

  /** Brief does NOT contain any forbidden strings */
  absence(briefText, _expected, { forbidden_strings = [] } = {}) {
    const text = norm(briefText);
    const found = forbidden_strings.filter(f => text.includes(norm(f)));
    const pass = found.length === 0;
    return { pass, detail: pass ? "no forbidden strings found" : `FOUND forbidden: ${found.join(", ")}` };
  },
};

/**
 * Run a single match rule.
 * @param {string} ruleName — key from the rules object
 * @param {*} actual — the value from the brief
 * @param {*} expected — the ground-truth value
 * @param {object} options — rule-specific options (tolerance_pct, accepted, forbidden_strings, etc.)
 * @returns {{ pass: boolean, detail: string }}
 */
export function runMatch(ruleName, actual, expected, options = {}) {
  const fn = rules[ruleName];
  if (!fn) return { pass: false, detail: `unknown match rule: ${ruleName}` };
  try {
    return fn(actual, expected, options);
  } catch (e) {
    return { pass: false, detail: `match error: ${e.message}` };
  }
}

export { extractNumber };
