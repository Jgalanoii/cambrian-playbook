"""
Knowledge layer query API
=========================

Thin helper library that your app / playbook calls to pull entities out of the
resolved knowledge layer. Handles:
  - name search (fuzzy, respects normalization used during resolution)
  - identifier lookup (by EIN, CIK, FDIC cert, etc.)
  - vertical / geography / size filters
  - entity hydration (returns merged view across all source records)

Designed to be small enough to embed directly or expose via a tool-calling
interface (e.g. as an MCP server, a FastAPI endpoint, or Claude tool use).

Usage:
    from query import KnowledgeLayer
    kl = KnowledgeLayer("./data/knowledge_layer.sqlite")

    # Find by name
    entities = kl.search_by_name("JPMorgan Chase", state="NY")

    # Find by any identifier
    entity = kl.find_by_identifier("fdic_cert", "628")

    # Hydrate full multi-source view
    detail = kl.hydrate(entity["entity_id"])

    # ICP-style filter
    wa_banks = kl.list_entities(
        entity_type="bank",
        state="WA",
        min_assets_usd=1_000_000_000,
    )

Also runnable as a CLI for quick exploration:
    python query.py search "wells fargo"
    python query.py id fdic_cert 3511
    python query.py list --entity-type bank --state WA
"""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path
from typing import Any

# Reuse name normalization from resolve.py so CLI queries match resolution
from resolve import normalize_name

DEFAULT_DB = Path(__file__).parent / "data" / "knowledge_layer.sqlite"


class KnowledgeLayer:
    def __init__(self, db_path: str | Path = DEFAULT_DB):
        self.db_path = Path(db_path)
        self.con = sqlite3.connect(self.db_path)
        self.con.row_factory = sqlite3.Row

    # --- search -------------------------------------------------------------

    def search_by_name(self, name: str, state: str | None = None, limit: int = 20) -> list[dict]:
        """Name search against resolved_entities. Falls back to LIKE if normalized
        match fails (useful for partial names)."""
        norm = normalize_name(name)
        params: list[Any] = []
        sql = """
            SELECT entity_id, canonical_name, entity_type, primary_state,
                   primary_city, identifiers, vertical_tags, source_count, confidence
            FROM resolved_entities
            WHERE 1=1
        """
        if state:
            sql += " AND primary_state = ?"
            params.append(state.upper())

        # Try normalized-name match via LIKE on canonical_name
        like_term = f"%{name}%"
        sql_like = sql + " AND canonical_name LIKE ? COLLATE NOCASE ORDER BY source_count DESC, canonical_name LIMIT ?"
        rows = self.con.execute(sql_like, [*params, like_term, limit]).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def find_by_identifier(self, key: str, value: str) -> dict | None:
        """Look up a resolved entity by any hard identifier (ein, cik, fdic_cert, etc.)."""
        # Stored as JSON in the identifiers column; use LIKE as a cheap filter
        val_str = str(value).strip()
        pattern = f'%"{key}": "{val_str}"%'
        # Also try unquoted numeric form
        pattern_num = f'%"{key}": {val_str}%'
        row = self.con.execute("""
            SELECT entity_id, canonical_name, entity_type, primary_state,
                   primary_city, identifiers, vertical_tags, source_count, confidence
            FROM resolved_entities
            WHERE identifiers LIKE ? OR identifiers LIKE ?
            LIMIT 1
        """, (pattern, pattern_num)).fetchone()
        return self._row_to_dict(row) if row else None

    def hydrate(self, entity_id: str) -> dict:
        """Return the canonical entity plus all source records that merge into it."""
        entity_row = self.con.execute("""
            SELECT * FROM resolved_entities WHERE entity_id = ?
        """, (entity_id,)).fetchone()
        if not entity_row:
            return {}

        entity = self._row_to_dict(entity_row)
        source_rows = self.con.execute("""
            SELECT source_id, source_record_id, name, entity_type, state, city, zip,
                   website, phone, employees, assets_usd, revenue_usd, status, last_seen, raw
            FROM companies
            WHERE entity_id = ?
        """, (entity_id,)).fetchall()
        entity["source_records"] = [dict(r) for r in source_rows]

        # Attach any financial snapshots linked via source_record_id matches
        snaps = self.con.execute("""
            SELECT fs.source_id, fs.source_record_id, fs.period_end, fs.metrics
            FROM financial_snapshots fs
            JOIN companies c
              ON c.source_id = fs.source_id
             AND c.source_record_id = fs.source_record_id
            WHERE c.entity_id = ?
            ORDER BY fs.period_end DESC
        """, (entity_id,)).fetchall()
        entity["financial_snapshots"] = [
            {**dict(s), "metrics": json.loads(s["metrics"])} for s in snaps
        ]
        return entity

    # --- list / filter ------------------------------------------------------

    def list_entities(
        self,
        entity_type: str | None = None,
        state: str | None = None,
        vertical: str | None = None,
        min_employees: int | None = None,
        min_assets_usd: float | None = None,
        limit: int = 100,
    ) -> list[dict]:
        """Filter resolved entities by common ICP criteria. Note assets/employees
        come from the best source record linked to each entity."""
        where = ["re.entity_id IS NOT NULL"]
        params: list[Any] = []
        if entity_type:
            where.append("re.entity_type = ?")
            params.append(entity_type)
        if state:
            where.append("re.primary_state = ?")
            params.append(state.upper())
        if vertical:
            where.append("re.vertical_tags LIKE ?")
            params.append(f"%{vertical}%")

        # Join to companies to get size metrics. Aggregate MAX so we pick up
        # whichever source had the employees/assets value.
        sql = f"""
            SELECT
              re.entity_id, re.canonical_name, re.entity_type, re.primary_state,
              re.primary_city, re.identifiers, re.vertical_tags,
              re.source_count, re.confidence,
              MAX(c.employees) AS employees,
              MAX(c.assets_usd) AS assets_usd,
              MAX(c.revenue_usd) AS revenue_usd
            FROM resolved_entities re
            LEFT JOIN companies c ON c.entity_id = re.entity_id
            WHERE {" AND ".join(where)}
            GROUP BY re.entity_id
        """
        having = []
        if min_employees is not None:
            having.append("employees >= ?")
            params.append(min_employees)
        if min_assets_usd is not None:
            having.append("assets_usd >= ?")
            params.append(min_assets_usd)
        if having:
            sql += " HAVING " + " AND ".join(having)
        sql += " ORDER BY re.source_count DESC, assets_usd DESC NULLS LAST LIMIT ?"
        params.append(limit)

        return [dict(r) for r in self.con.execute(sql, params).fetchall()]

    # --- aggregates / TAM ---------------------------------------------------

    def get_aggregate(self, naics: str | None = None, state_fips: str | None = None,
                      year: str | None = None) -> list[dict]:
        """Query Census SUSB / CBP aggregate stats for TAM sizing."""
        where = []
        params: list[Any] = []
        if naics:
            where.append("dimensions LIKE ?")
            params.append(f'%"naics": "{naics}"%')
        if state_fips:
            where.append("dimensions LIKE ?")
            params.append(f'%"state_fips": "{state_fips}"%')
        if year:
            where.append("dimensions LIKE ?")
            params.append(f'%"year": "{year}"%')
        sql = "SELECT source_id, stat_id, dimensions, metrics FROM aggregate_stats"
        if where:
            sql += " WHERE " + " AND ".join(where)
        sql += " LIMIT 200"
        return [
            {
                "source_id": r["source_id"],
                "stat_id": r["stat_id"],
                "dimensions": json.loads(r["dimensions"]),
                "metrics": json.loads(r["metrics"]),
            }
            for r in self.con.execute(sql, params).fetchall()
        ]

    # --- helpers ------------------------------------------------------------

    def _row_to_dict(self, row: sqlite3.Row | None) -> dict:
        if row is None:
            return {}
        d = dict(row)
        if "identifiers" in d and isinstance(d["identifiers"], str):
            try:
                d["identifiers"] = json.loads(d["identifiers"])
            except json.JSONDecodeError:
                pass
        if "vertical_tags" in d and isinstance(d["vertical_tags"], str):
            d["vertical_tags"] = [v for v in d["vertical_tags"].split(",") if v]
        return d

    def close(self):
        self.con.close()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    s_search = sub.add_parser("search", help="search by name")
    s_search.add_argument("name")
    s_search.add_argument("--state")
    s_search.add_argument("--limit", type=int, default=20)

    s_id = sub.add_parser("id", help="find by identifier")
    s_id.add_argument("key")
    s_id.add_argument("value")

    s_hydrate = sub.add_parser("hydrate", help="show full entity detail")
    s_hydrate.add_argument("entity_id")

    s_list = sub.add_parser("list", help="filter entities")
    s_list.add_argument("--entity-type")
    s_list.add_argument("--state")
    s_list.add_argument("--vertical")
    s_list.add_argument("--min-employees", type=int)
    s_list.add_argument("--min-assets-usd", type=float)
    s_list.add_argument("--limit", type=int, default=50)

    args = p.parse_args()
    kl = KnowledgeLayer()

    if args.cmd == "search":
        results = kl.search_by_name(args.name, state=args.state, limit=args.limit)
        for r in results:
            ids = r.get("identifiers") or {}
            id_str = ",".join(f"{k}={v}" for k, v in ids.items())
            print(f"{r['entity_id']}  {r['canonical_name']}  ({r.get('primary_state')})  "
                  f"sources={r['source_count']}  ids=[{id_str}]")

    elif args.cmd == "id":
        result = kl.find_by_identifier(args.key, args.value)
        if result:
            print(json.dumps(result, indent=2, default=str))
        else:
            print("No match")

    elif args.cmd == "hydrate":
        print(json.dumps(kl.hydrate(args.entity_id), indent=2, default=str))

    elif args.cmd == "list":
        results = kl.list_entities(
            entity_type=args.entity_type,
            state=args.state,
            vertical=args.vertical,
            min_employees=args.min_employees,
            min_assets_usd=args.min_assets_usd,
            limit=args.limit,
        )
        print(f"{len(results)} results")
        for r in results:
            size = ""
            if r.get("employees"):
                size += f" emp={r['employees']}"
            if r.get("assets_usd"):
                size += f" assets=${r['assets_usd']/1e9:.1f}B"
            print(f"{r['entity_id']}  {r['canonical_name']}  ({r.get('primary_state')})  "
                  f"type={r['entity_type']}{size}")

    kl.close()


if __name__ == "__main__":
    main()
