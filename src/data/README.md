# US Business Data - Free Knowledge Layer

A self-contained ingestion + resolution kit for feeding free, publicly available US business data into Cambrian Catalyst's GTM knowledge layer. Pulls from 14 free government/nonprofit sources, normalizes them into a unified schema, and runs cross-source identity resolution so your app sees one canonical entity per real-world business instead of a bunch of disconnected rows.

## What's in here

| File | Purpose |
|---|---|
| `sources_manifest.json` | The catalog. Describes every source — endpoints, schemas, update cadence, vertical mapping, and which handlers are implemented. This is what your app/LLM reads to know what data exists. |
| `ingest.py` | Pulls data from each source into SQLite. 14 handlers implemented covering all priority-1 and most priority-2 sources. |
| `resolve.py` | Cross-source identity resolution. Merges records that represent the same real-world entity using hard identifiers (EIN, FDIC cert, CIK, LEI…) and normalized name+state+city matching. |
| `query.py` | App-facing query API. Library + CLI for searching, hydrating, and filtering entities. |
| `requirements.txt` | Just `requests`. Everything else is stdlib. |
| `VERTICAL_MAPPING.md` | Which sources cover which Cambrian Catalyst ICPs. |
| `samples/` | Seed data pulled at generation time. |

## Architecture

```
  Source APIs / bulk files
         │
         ▼
   ┌────────────┐
   │  ingest.py │  — per-source handlers, one per manifest entry
   └─────┬──────┘
         │ writes
         ▼
   ┌─────────────────────────────────────────────┐
   │  data/knowledge_layer.sqlite                │
   │  ┌─────────────┐  ┌──────────────────────┐  │
   │  │  companies  │  │  financial_snapshots │  │
   │  │  (per-rec)  │  │  (time-series)       │  │
   │  └──────┬──────┘  └──────────────────────┘  │
   │         │         ┌──────────────────────┐  │
   │         │         │  aggregate_stats     │  │
   │         │         │  (Census TAM data)   │  │
   │         │         └──────────────────────┘  │
   └─────────┼───────────────────────────────────┘
             │ read by
             ▼
      ┌────────────┐
      │ resolve.py │  — union-find merge across sources
      └─────┬──────┘
            │ writes
            ▼
   ┌────────────────────┐
   │ resolved_entities  │  — one row per real-world business
   │ + entity_id stamps │
   └─────────┬──────────┘
             │ read by
             ▼
      ┌────────────┐
      │  query.py  │  — your app / playbook calls this
      └────────────┘
```

## Sources (14 implemented, 9 documented)

**Banking / fintech / payments** (direct Cambrian Catalyst ICP match):
- ✅ FDIC BankFind Institutions (~4,500 banks)
- ✅ FDIC BankFind Locations (~85,000 branches)
- ✅ FDIC Call Reports (1,100+ quarterly financial metrics per bank, loaded into `financial_snapshots`)
- ✅ NCUA Call Reports (~4,600 credit unions)
- ✅ FinCEN MSB Registrants (~25,000 money services businesses)
- ✅ CFPB Consumer Complaints (pain signal per institution)
- ✅ SEC EDGAR Company Tickers (~10,000 public companies)
- 📋 FFIEC Call Reports, NMLS Consumer Access — documented, handlers TBD

**Broad US business:**
- ✅ SBA PPP Loan Data (~11.4M SMB records)
- ✅ SAM.gov Entities (~700K federal contractors, needs free API key)
- ✅ GLEIF LEI Index (~2.5M global legal entities, filtered to US)
- ✅ Census SUSB (TAM aggregate stats → `aggregate_stats` table)
- 📋 Census CBP, BLS QCEW, USAspending — documented, handlers TBD

**Health / wellness B2B:**
- ✅ CMS NPI Registry (~7M healthcare providers)
- ✅ DOL Form 5500 (~600K employers with benefit plans — the buyer side of health B2B)
- 📋 FDA Establishment Registration — documented

**Nonprofit:**
- ✅ IRS Exempt Organizations Master File (~1.8M nonprofits)
- 📋 IRS Form 990, ProPublica Nonprofit Explorer — documented

**Corporate identity:**
- 📋 OpenCorporates — documented (commercial license required at scale)

Run `python ingest.py --list` to see the current status table with handler types per source.

## Quickstart

```bash
pip install -r requirements.txt

# 1. See what's available
python ingest.py --list

# 2. Pull the highest-priority sources (~10 min, all API-based)
python ingest.py --priority 1

# 3. Build the cross-source entity resolution graph (~1 min for priority-1 data)
python resolve.py

# 4. Query it
python query.py search "jpmorgan"
python query.py id fdic_cert 628
python query.py list --entity-type bank --state WA --min-assets-usd 1000000000
```

After step 3 you have `data/knowledge_layer.sqlite` with:
- `companies` — every source record, stamped with a canonical `entity_id`
- `resolved_entities` — one row per real-world business with merged identifiers
- `financial_snapshots` — quarterly bank call report metrics (if you pulled `fdic_financial`)
- `aggregate_stats` — Census TAM data (if you pulled `census_susb`)

## Identity resolution — what it buys you

Without resolution, your playbook sees JPMorgan Chase as (at least) 4 different rows:
- `fdic_institutions:628` — the insured bank entity
- `fdic_locations:99999` — one of its branches
- `sec_company_tickers:0000019617` — the public filer
- `cfpb_complaints:JPMORGAN CHASE BANK N A` — the complaint-tagged company

With resolution, all 4 collapse into one `entity_id` with a unified identifier set: `{fdic_cert, rssd_id, cik, ticker, fdic_uninumbr}` — so your playbook can reason over "the full picture of this account" in one query instead of doing joins on fuzzy names.

**Two-stage algorithm:**
1. **Hard-key merging** (deterministic, zero false positives): any two records sharing a real identifier (EIN, FDIC cert, RSSD ID, CIK, LEI, NPI, UEI, NMLS, FinCEN MSB) are the same entity. Handled via union-find.
2. **Name + state + city merging** with entity-type compatibility checks: records with the same normalized name in the same city are merged only if their entity types are compatible (banks can merge with public companies, but not with nonprofit foundations that happen to share a name).

**Confidence scoring** on each resolved entity:
- `1.0` — confirmed by 3+ distinct sources
- `0.9` — confirmed by 2 sources
- `0.75` — single source but hard identifier present
- `0.6` — single source, name-match only

## Query patterns for your app

```python
from query import KnowledgeLayer
kl = KnowledgeLayer("./data/knowledge_layer.sqlite")

# Find entities by name
kl.search_by_name("JPMorgan Chase", state="OH")

# Lookup by any hard identifier — works across EIN, CIK, FDIC cert, RSSD, LEI, NPI, UEI…
kl.find_by_identifier("fdic_cert", "628")
kl.find_by_identifier("cik", "0000019617")

# Hydrate full multi-source view for an entity (returns canonical + all source rows + snapshots)
kl.hydrate("cc-a11d2889f019542c")

# ICP-style filters
wa_banks = kl.list_entities(
    entity_type="bank",
    state="WA",
    min_assets_usd=1_000_000_000,
)

# TAM sizing from Census aggregates
kl.get_aggregate(naics="522110", state_fips="53", year="2021")
```

## Configuration for large bulk sources

Some handlers need env vars because they ship as rotating monthly archives or require free API keys:

```bash
# Required user-agent for SEC
export KL_USER_AGENT="Cambrian Catalyst GTM joe@cambriancatalyst.com"

# NCUA quarterly archive URL (rotates each quarter)
export NCUA_QUARTER_URL="https://www.ncua.gov/files/publications/analysis/call-report-data-2025-q4.zip"

# SAM.gov API key (free registration at api.sam.gov)
export SAM_API_KEY="your-key-here"

# Census API key (free at api.census.gov/data/key_signup.html)
export CENSUS_API_KEY="your-key-here"
export CENSUS_SUSB_YEAR="2021"

# Pre-downloaded bulk files (these are 1-8 GB each)
export PPP_DATA_DIR="/path/to/ppp/csvs/"
export NPI_CSV_PATH="/path/to/npidata_pfile_20260301-20260307.csv"
export FORM5500_CSV_PATH="/path/to/f_5500_2024_latest.csv"

# FDIC call-report period (YYYYMMDD, e.g. 20251231). Default = most recent.
export FDIC_PERIOD="20251231"
```

## Refresh cadence

| Source | Recommended rerun |
|---|---|
| FDIC, NCUA, FFIEC call reports | Quarterly |
| CFPB complaints, SEC submissions | Weekly |
| SAM.gov, USAspending, FinCEN MSB | Monthly |
| IRS BMF, CMS NPI, IRS 990 | Monthly |
| DOL 5500, Census, BLS QCEW | Annual |
| SBA PPP | Static (historical) |

Ingestion is idempotent — re-running replaces records by `(source_id, source_record_id)` primary key. Re-run resolution any time after a fresh pull.

## Extending

To add a source:
1. Add an entry to `sources_manifest.json`.
2. Add a handler in `ingest.py` — decorate with `@handler(id)` for company records, `@snapshot_handler(id)` for time-series financials, or `@aggregate_handler(id)` for TAM-style stats.
3. Add the handler type to the source's `handler_implemented` array in the manifest.
4. Run `python ingest.py --source your_new_source` then `python resolve.py`.

The manifest is intentionally self-describing so an LLM agent with tool access can read it, understand what sources exist, and know which tables to query for a given prospect research task.

## Verified behavior

End-to-end smoke test in this build confirms:

| Test case | Expected | Result |
|---|---|---|
| JPMorgan Chase in FDIC + SEC + FDIC locations + CFPB | All 4 merge → 1 entity with 5 identifiers | ✅ conf 1.0 |
| Wells Fargo Bank (Sioux Falls) vs Wells Fargo & Co (San Francisco) | Stay separate (different subsidiaries, different cities) | ✅ 2 entities |
| First National Bank of Omaha vs First National Bank Foundation | Stay separate (bank vs nonprofit type mismatch) | ✅ 2 entities |
| Hard-key merge via shared RSSD_ID across FDIC institutions and FDIC locations | Merge regardless of name differences | ✅ |

## What this doesn't do

- **No contact data.** Free government sources give firmographic + financial + regulatory depth but not named decision-maker emails/phones. That's the enrichment layer (Clay, Apollo, PDL). The knowledge layer tells your playbook *which accounts matter and why*; the enrichment layer tells you *who to contact there*.
- **No intent data.** CFPB complaint counts are the closest free intent-adjacent signal included. For buyer intent, pair with Bombora / G2 / web scrape.
- **No private-company revenue.** Pair with PPP loan amount (rough revenue proxy) + DOL 5500 participant count (employee proxy) + Form 990 for nonprofits.
- **Doesn't scrape Secretary of State filings.** OpenCorporates aggregates these but free tier is non-commercial only. For commercial use at scale you'd either pay them or build 50 per-state scrapers.
