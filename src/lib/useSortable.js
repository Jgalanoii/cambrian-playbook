// src/lib/useSortable.js — Reusable sorting hook + SortHeader component for table columns
import { useState, useCallback, useMemo } from "react";

/**
 * Parse a value that might be a formatted number string (e.g., "1,200", "2.5K", "1.2M", "3B")
 * into a raw number for comparison. Returns NaN if not parseable.
 */
function parseNumericValue(v) {
  if (typeof v === "number") return v;
  if (!v || typeof v !== "string") return NaN;
  const s = v.replace(/,/g, "").trim();
  const suffixMatch = s.match(/^([\d.]+)\s*([KkMmBbTt])$/);
  if (suffixMatch) {
    const num = parseFloat(suffixMatch[1]);
    const suffix = suffixMatch[2].toUpperCase();
    if (suffix === "K") return num * 1e3;
    if (suffix === "M") return num * 1e6;
    if (suffix === "B") return num * 1e9;
    if (suffix === "T") return num * 1e12;
  }
  const parsed = parseFloat(s);
  return isNaN(parsed) ? NaN : parsed;
}

/**
 * useSortable — manages sort state and returns a sorted copy of data.
 *
 * @param {Array} rows — the data array to sort
 * @param {Object} [opts] — options
 * @param {string} [opts.defaultKey] — initial sort column key
 * @param {string} [opts.defaultDir] — initial direction ("asc"|"desc"), default "asc"
 * @param {Object} [opts.dateKeys] — set of keys that should be sorted as dates, e.g. { updated_at: true }
 * @param {Object} [opts.numericKeys] — set of keys that should be sorted as numbers (with suffix parsing)
 * @returns {{ sorted, sortKey, sortDir, onSort }}
 */
export function useSortable(rows, opts = {}) {
  const [sortKey, setSortKey] = useState(opts.defaultKey || null);
  const [sortDir, setSortDir] = useState(opts.defaultDir || "asc");

  const onSort = useCallback((key) => {
    setSortKey(prev => {
      if (prev === key) {
        setSortDir(d => d === "asc" ? "desc" : "asc");
        return key;
      }
      setSortDir("asc");
      return key;
    });
  }, []);

  const dateKeys = opts.dateKeys || {};
  const numericKeys = opts.numericKeys || {};

  const sorted = useMemo(() => {
    if (!sortKey || !rows || rows.length === 0) return rows || [];
    return [...rows].sort((a, b) => {
      let av = typeof a === "object" ? a[sortKey] : a;
      let bv = typeof b === "object" ? b[sortKey] : b;

      // Nulls/undefined always go to the end regardless of direction
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      // Date columns
      if (dateKeys[sortKey] || /date|login|created|updated|active/i.test(sortKey)) {
        const da = new Date(av), db = new Date(bv);
        const ta = isNaN(da) ? 0 : da.getTime();
        const tb = isNaN(db) ? 0 : db.getTime();
        return sortDir === "asc" ? ta - tb : tb - ta;
      }

      // Explicit numeric keys or auto-detect numbers
      if (numericKeys[sortKey] || (typeof av === "number" && typeof bv === "number")) {
        const na = typeof av === "number" ? av : parseNumericValue(String(av));
        const nb = typeof bv === "number" ? bv : parseNumericValue(String(bv));
        if (!isNaN(na) && !isNaN(nb)) return sortDir === "asc" ? na - nb : nb - na;
      }

      // Try numeric parse for string values that look like numbers
      if (typeof av === "string" && typeof bv === "string") {
        const na = parseNumericValue(av);
        const nb = parseNumericValue(bv);
        if (!isNaN(na) && !isNaN(nb)) return sortDir === "asc" ? na - nb : nb - na;
      }

      // String comparison
      const sa = String(av).toLowerCase();
      const sb = String(bv).toLowerCase();
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }, [rows, sortKey, sortDir, dateKeys, numericKeys]);

  return { sorted, sortKey, sortDir, onSort };
}
