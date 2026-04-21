"""
Cross-source identity resolution
================================

Scans every row in the `companies` table and groups them into real-world
entities using two stages:

  1. Hard-key merging. Two records that share any deterministic identifier
     (EIN, FDIC cert, RSSD ID, CIK, LEI, NPI, UEI, NMLS ID, etc.) are declared
     the same entity. Safe. Zero false positives.

  2. Name+state+city merging. After stage 1, records that share a normalized
     name AND state AND city are merged. Catches the common case where the
     same bank appears in FDIC and in SEC with no shared ID on the SEC row.

Result:
  - Every row in `companies` gets stamped with a canonical `entity_id`
  - `resolved_entities` table populated with one row per real-world entity,
    carrying a merged view of identifiers, canonical name, and source count

Usage:
    python resolve.py              # run against default DB path
    python resolve.py --stats      # just print current resolution stats
    python resolve.py --dry-run    # show what would change without writing

The algorithm is O(n) with union-find. Handles ~1M records in under a minute
on commodity hardware.
"""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
import uuid
from collections import defaultdict
from pathlib import Path

DB = Path(__file__).parent / "data" / "knowledge_layer.sqlite"

# Hard identifier keys (checked left-to-right in preference order)
HARD_KEYS = [
    "lei", "cik", "ein", "fdic_cert", "rssd_id", "ncua_charter",
    "nmls_id", "fincen_msb", "npi", "uei_sam", "duns", "fdic_uninumbr",
    "cage_code", "ticker",
]

# Canonical-source preference: when merging, take canonical name/address from highest-priority source
SOURCE_PRIORITY = {
    "fdic_institutions": 1,
    "ncua_call_report": 2,
    "sec_company_tickers": 3,
    "cms_npi": 4,
    "sam_entities": 5,
    "fincen_msb": 6,
    "dol_form5500": 7,
    "irs_eo_bmf": 8,
    "fdic_locations": 9,
    "gleif_lei": 10,
    "sba_ppp": 11,
    "cfpb_complaints": 12,
}

# Mergeable type groups. Records with types from the same group can be merged
# via name+state+city match. Types NOT in any group can't be soft-merged.
# "financial_services" is intentionally placed in the banking/cu/msb groups
# because CFPB complaint rows carry that generic type.
MERGEABLE_TYPE_GROUPS = [
    {"bank", "public_company", "bank_branch", "financial_services"},
    {"credit_union", "public_company", "financial_services"},
    {"healthcare_org", "nonprofit", "employer"},
    {"money_services_business", "public_company", "financial_services"},
    {"employer", "public_company", "government_contractor"},
]

# Types that can merge with anything (intentionally generic)
UNIVERSAL_TYPES = {"financial_services"}

# ---------------------------------------------------------------------------
# Name normalization
# ---------------------------------------------------------------------------

STATE_PARENTHETICAL = re.compile(r"\s*/[a-z ]{1,10}/\s*$", re.IGNORECASE)

# First pass — match dotted/spaced legal abbreviations BEFORE stripping punctuation,
# since "N.A." and "P.C." fall apart if we kill dots first.
DOTTED_SUFFIX = re.compile(
    r"\b("
    r"n\.?\s*a\.?|"                 # N.A., N A, NA
    r"p\.?\s*c\.?|"                 # P.C., P C
    r"p\.?\s*l\.?\s*c\.?|"          # P.L.C.
    r"l\.?\s*l\.?\s*c\.?|"          # L.L.C.
    r"l\.?\s*l\.?\s*p\.?|"          # L.L.P.
    r"l\.?\s*p\.?|"                 # L.P.
    r"f\.?\s*s\.?\s*b\.?|"          # F.S.B.
    r"d\.?\s*b\.?\s*a\.?|"          # d/b/a
    r"u\.?\s*s\.?\s*a\.?"           # USA
    r")\b",
    re.IGNORECASE,
)

# Second pass — word-level legal suffixes that survive after punctuation removal
LEGAL_SUFFIX = re.compile(
    r"\b("
    r"incorporated|inc|llc|ltd|limited|corp|corporation|"
    r"company|co|plc|lp|llp|pllc|pc|sa|nv|ag|"
    r"bancshares|bancorp|bankshares|holdings|holding|group|"
    r"the|fsb|federal|national|association|bank|trust"
    r")\b\.?",
    re.IGNORECASE,
)

PUNCT = re.compile(r"[,./&\-'\"\(\)\\]+")
WS = re.compile(r"\s+")


def normalize_name(name: str) -> str:
    if not name:
        return ""
    n = name.lower()
    n = STATE_PARENTHETICAL.sub("", n)
    # Pass 1: dotted abbreviations while punctuation still intact
    n = DOTTED_SUFFIX.sub(" ", n)
    # Pass 2: strip remaining punctuation
    n = PUNCT.sub(" ", n)
    # Pass 3: word-level suffixes
    n = LEGAL_SUFFIX.sub(" ", n)
    # Pass 4: a second LEGAL_SUFFIX pass catches tokens that were previously glued together
    n = LEGAL_SUFFIX.sub(" ", n)
    n = WS.sub(" ", n).strip()
    return n


def types_mergeable(type_a: str | None, type_b: str | None) -> bool:
    if not type_a or not type_b or type_a == type_b:
        return True
    if type_a in UNIVERSAL_TYPES or type_b in UNIVERSAL_TYPES:
        return True
    for group in MERGEABLE_TYPE_GROUPS:
        if type_a in group and type_b in group:
            return True
    return False


# ---------------------------------------------------------------------------
# Union-Find
# ---------------------------------------------------------------------------

class UnionFind:
    __slots__ = ("parent", "size")

    def __init__(self):
        self.parent: dict = {}
        self.size: dict = {}

    def add(self, x):
        if x not in self.parent:
            self.parent[x] = x
            self.size[x] = 1

    def find(self, x):
        self.add(x)
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        # path compression
        while self.parent[x] != root:
            self.parent[x], x = root, self.parent[x]
        return root

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return
        # union by size
        if self.size[rx] < self.size[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        self.size[rx] += self.size[ry]

    def groups(self) -> dict:
        g = defaultdict(list)
        for x in self.parent:
            g[self.find(x)].append(x)
        return g


# ---------------------------------------------------------------------------
# Resolution
# ---------------------------------------------------------------------------

def resolve(db_path: Path = DB, dry_run: bool = False) -> dict:
    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row

    rows = con.execute("""
        SELECT source_id, source_record_id, name, entity_type,
               state, city, identifiers, verticals
        FROM companies
    """).fetchall()

    if not rows:
        print("No rows in companies table. Run `python ingest.py --priority 1` first.")
        return {"entities": 0, "records": 0}

    print(f"Loaded {len(rows):,} source records")

    uf = UnionFind()
    hard_key_index: dict = defaultdict(list)
    name_state_city_index: dict = defaultdict(list)
    # Keep denormalized record info in-memory for fast merge decisions
    rec_info: dict = {}

    for r in rows:
        rec_id = (r["source_id"], r["source_record_id"])
        uf.add(rec_id)
        try:
            ids = json.loads(r["identifiers"] or "{}")
        except json.JSONDecodeError:
            ids = {}
        rec_info[rec_id] = {
            "name": r["name"],
            "entity_type": r["entity_type"],
            "state": r["state"],
            "city": r["city"],
            "identifiers": ids,
            "verticals": r["verticals"] or "",
        }

        for key in HARD_KEYS:
            val = ids.get(key)
            if val and str(val).strip() and str(val).strip().lower() != "none":
                hard_key_index[f"{key}={str(val).strip().upper()}"].append(rec_id)

        norm = normalize_name(r["name"] or "")
        if norm and r["state"] and r["city"]:
            key = (norm, r["state"].upper(), r["city"].upper())
            name_state_city_index[key].append(rec_id)

    # Stage 1: hard-key merging
    hard_merges = 0
    for key, recs in hard_key_index.items():
        if len(recs) > 1:
            anchor = recs[0]
            for rec in recs[1:]:
                if uf.find(anchor) != uf.find(rec):
                    uf.union(anchor, rec)
                    hard_merges += 1
    print(f"Stage 1: {hard_merges:,} hard-key merges across {len(hard_key_index):,} unique IDs")

    # Stage 2: name+state+city merging (with type compatibility check)
    soft_merges = 0
    skipped_types = 0
    for (norm, _st, _city), recs in name_state_city_index.items():
        if len(recs) < 2 or not norm:
            continue
        # Merge compatible records within this group
        for i in range(len(recs)):
            for j in range(i + 1, len(recs)):
                a, b = recs[i], recs[j]
                if uf.find(a) == uf.find(b):
                    continue
                if not types_mergeable(rec_info[a]["entity_type"], rec_info[b]["entity_type"]):
                    skipped_types += 1
                    continue
                uf.union(a, b)
                soft_merges += 1
    print(f"Stage 2: {soft_merges:,} name+state+city merges ({skipped_types:,} skipped on type mismatch)")

    # Build canonical entity records
    groups = uf.groups()
    print(f"Result: {len(groups):,} canonical entities from {len(rows):,} source records")

    entity_rows = []
    company_updates = []

    for root, members in groups.items():
        # Stable entity ID derived from root's (source, record) pair
        entity_id = f"cc-{uuid.uuid5(uuid.NAMESPACE_DNS, f'{root[0]}::{root[1]}').hex[:16]}"

        # Merge all identifiers across members
        merged_ids = {}
        all_verticals = set()
        all_sources = set()
        for m in members:
            info = rec_info[m]
            for k, v in info["identifiers"].items():
                if v and not merged_ids.get(k):
                    merged_ids[k] = v
            if info["verticals"]:
                all_verticals.update(v for v in info["verticals"].split(",") if v)
            all_sources.add(m[0])

        # Canonical fields from highest-priority source
        ranked = sorted(members, key=lambda m: SOURCE_PRIORITY.get(m[0], 99))
        canonical = rec_info[ranked[0]]

        # Confidence: 1.0 if 3+ sources confirm, 0.9 if 2, 0.75 if 1 source but hard key present,
        # 0.6 if 1 source and name-only
        if len(all_sources) >= 3:
            conf = 1.0
        elif len(all_sources) == 2:
            conf = 0.9
        elif merged_ids:
            conf = 0.75
        else:
            conf = 0.6

        entity_rows.append((
            entity_id,
            canonical["name"],
            canonical["entity_type"],
            canonical["state"],
            canonical["city"],
            json.dumps(merged_ids),
            ",".join(sorted(all_verticals)),
            len(all_sources),
            conf,
            None,  # first_seen (would need min(last_seen))
            None,  # last_seen (would need max(last_seen))
        ))
        for m in members:
            company_updates.append((entity_id, m[0], m[1]))

    if dry_run:
        print(f"\n[dry-run] Would write {len(entity_rows):,} entities and update {len(company_updates):,} records")
        return {"entities": len(entity_rows), "records": len(company_updates)}

    print("Writing resolved_entities table ...")
    con.execute("DELETE FROM resolved_entities")
    con.executemany(
        "INSERT INTO resolved_entities VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        entity_rows,
    )
    print("Stamping entity_id on companies ...")
    con.executemany(
        "UPDATE companies SET entity_id=? WHERE source_id=? AND source_record_id=?",
        company_updates,
    )
    con.commit()

    # Stats
    print("\nCross-source coverage (entities confirmed by N distinct sources):")
    for source_count, count in con.execute("""
        SELECT source_count, COUNT(*)
        FROM resolved_entities
        GROUP BY source_count
        ORDER BY source_count DESC
    """).fetchall():
        print(f"  {source_count} source(s): {count:,} entities")

    print("\nTop 10 entities confirmed by the most sources:")
    for name, sc, state, ids in con.execute("""
        SELECT canonical_name, source_count, primary_state, identifiers
        FROM resolved_entities
        ORDER BY source_count DESC, canonical_name
        LIMIT 10
    """).fetchall():
        try:
            id_keys = ",".join(sorted(json.loads(ids or "{}").keys()))
        except Exception:
            id_keys = ""
        print(f"  [{sc} sources] {name} ({state})  ids: {id_keys}")

    con.close()
    return {"entities": len(entity_rows), "records": len(company_updates)}


def print_stats(db_path: Path = DB) -> None:
    con = sqlite3.connect(db_path)
    rows = con.execute("SELECT COUNT(*) FROM companies").fetchone()[0]
    entities = con.execute("SELECT COUNT(*) FROM resolved_entities").fetchone()[0]
    resolved = con.execute("SELECT COUNT(*) FROM companies WHERE entity_id IS NOT NULL").fetchone()[0]
    print(f"companies:          {rows:,} source records")
    print(f"  resolved:         {resolved:,} ({100*resolved/rows:.1f}%)" if rows else "  (empty)")
    print(f"resolved_entities:  {entities:,} canonical entities")
    if entities:
        ratio = rows / entities
        print(f"  compression:      {ratio:.2f}x (avg source records per entity)")
    con.close()


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--stats", action="store_true", help="print current resolution stats and exit")
    p.add_argument("--dry-run", action="store_true", help="compute resolution without writing")
    p.add_argument("--db", default=str(DB), help="path to knowledge_layer.sqlite")
    args = p.parse_args()

    db_path = Path(args.db)
    if not db_path.exists():
        print(f"DB not found at {db_path}. Run `python ingest.py --priority 1` first.")
        return

    if args.stats:
        print_stats(db_path)
    else:
        resolve(db_path, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
