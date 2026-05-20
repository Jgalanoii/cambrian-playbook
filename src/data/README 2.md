# US Business Data - Free Knowledge Layer

A self-contained ingestion kit for feeding free, publicly available US business data into Cambrian Catalyst's GTM knowledge layer. Built to run locally or on a server, then hand off a unified SQLite database (or per-source JSONL files) that your app consumes.

## What's in here

| File | Purpose |
|---|---|
| `sources_manifest.json` | The catalog. Describes every free source — endpoints, schemas, update cadence, vertical mapping. This is the file your app reads to know what data exists and how to reason about it. |
| `ingest.py` | Pulls data from each source and normalizes into a unified `Company` schema. |
| `requirements.txt` | Python deps (just `requests`). |
| `samples/sec_tickers_sample.json` | Seed sample of SEC EDGAR public company tickers (~10K US public entities), pulled at generation time. |

## Sources included

23 free sources across four groups. Priority 1 sources are the highest-value for Cambrian Catalyst's verticals and have working handlers in `ingest.py`; the rest are documented in the manifest and ready for you to add handlers as needed.

**Banking / fintech / payments** (direct match for Cambrian Catalyst ICPs):
- FDIC BankFind (institutions, locations, call reports) — every US bank
- NCUA Call Reports — every federally insured credit union
- FFIEC CDR — deeper bank call report data
- FinCEN MSB Registrants — money transmitters, processors, prepaid
- NMLS Consumer Access — state-licensed mortgage/MSB/consumer finance
- CFPB Complaint Database — pain signal per named institution
- SEC EDGAR Tickers + Submissions — all public companies

**Broad US business foundation:**
- Census SUSB, County Business Patterns — aggregate firm counts for TAM sizing
- BLS QCEW — establishment-level employment
- SBA PPP Loan Data — ~11M named SMB records (huge SMB foundation)
- SAM.gov Entities — federal contractor registrations
- USAspending.gov — federal awards to named recipients
- GLEIF LEI Index — global entity identifiers for hierarchy resolution

**Health / wellness B2B:**
- CMS NPI Registry — every healthcare provider org
- DOL Form 5500 — every employer with a benefits plan (employer-side buyer list)
- FDA Establishment Registration — regulated health supply side

**Nonprofit:**
- IRS EO Business Master File — 1.8M tax-exempt entities
- IRS Form 990 — nonprofit financial detail
- ProPublica Nonprofit Explorer — cleaner API wrapper around IRS data

**Corporate identity:**
- OpenCorporates — state filing aggregator (free tier with attribution)

## Quickstart

```bash
pip install -r requirements.txt

# See what's available and which sources have handlers implemented
python ingest.py --list

# Pull the highest-priority sources (fast ones, APIs only)
python ingest.py --priority 1

# Pull everything tagged with payments or banking
python ingest.py --verticals payments,banking

# Pull a single source
python ingest.py --source fdic_institutions
```

Results land in:
- `./data/knowledge_layer.sqlite` — unified queryable DB, one row per (source, record) pair
- `./data/<source_id>/raw/` — untouched source records as JSONL (audit trail)

## Some sources need configuration

A few sources require a download step because they ship as large archives with rotating URLs (a monthly IRS BMF, a quarterly NCUA zip). These handlers print a skip message with the env var they need:

```bash
# Example: NCUA quarterly call report archive
export NCUA_QUARTER_URL="https://www.ncua.gov/files/publications/analysis/call-report-data-2025-q4.zip"

# Example: SBA PPP (download the FOIA CSVs first)
export PPP_DATA_DIR="/path/to/downloaded/ppp/csvs"

# Example: CMS NPI bulk
export NPI_CSV_PATH="/path/to/npidata_pfile_20260301-20260307.csv"

# Example: DOL Form 5500
export FORM5500_CSV_PATH="/path/to/f_5500_2024_latest.csv"

# User agent for SEC (SEC requires identifying yourself)
export KL_USER_AGENT="Cambrian Catalyst GTM joe@cambriancatalyst.com"
```

## Data model

Every source is normalized to a common `Company` schema (see `sources_manifest.json` → `normalized_entity_schema`). Key identifiers stay in an `identifiers` JSON blob so you can resolve the same business across sources:

| Identifier | Source | Coverage |
|---|---|---|
| `fdic_cert` | FDIC | All US banks |
| `rssd_id` | Federal Reserve | All depository institutions |
| `ncua_charter` | NCUA | All credit unions |
| `nmls_id` | NMLS | State-licensed finance companies |
| `fincen_msb` | FinCEN | Money services businesses |
| `cik` | SEC | All SEC registrants |
| `ticker` | SEC | Public companies |
| `npi` | CMS | All healthcare providers |
| `ein` | IRS | Nonprofits, employers |
| `uei_sam` | SAM.gov | Federal contractors |
| `lei` | GLEIF | Entities with cross-border exposure |
| `duns` | D&B | (paid — reserved in schema for future enrichment) |

Same company, different views — the knowledge layer lets your app say "JPMorgan Chase is FDIC CERT 628, RSSD 852218, CIK 19617, LEI 8I5DZWZKVSZI1NUHU748," and reason across all of that.

## Using the knowledge layer in your app

The SQLite file is the simplest interface. Any Node/Python/Deno app can open it:

```sql
-- Banks over $1B in assets in Washington state
SELECT name, assets_usd, city, website
FROM companies
WHERE source_id = 'fdic_institutions'
  AND state = 'WA'
  AND assets_usd > 1000000000
ORDER BY assets_usd DESC;

-- All licensed money transmitters in a given state
SELECT name, city, raw
FROM companies
WHERE source_id = 'fincen_msb'
  AND state = 'CA';

-- Employer-side health benefits prospects with 100-500 participants
SELECT name, city, state, employees
FROM companies
WHERE source_id = 'dol_form5500'
  AND employees BETWEEN 100 AND 500
  AND state = 'WA';
```

For a playbook / LLM knowledge layer, you typically want to load the manifest as-is (your LLM tool calls read it to know what sources exist and how to query them), and either:

1. **Expose SQLite to tool-calling** (e.g. an MCP server that runs read-only queries) — best for agents.
2. **Re-materialize each source into your vector DB / Postgres** — best when you want enrichment and joins across sources.

Pattern 1 is faster to stand up; pattern 2 gives you better search quality and lets you layer enrichment signals (CFPB complaint counts, PPP loan size, Form 990 budgets) onto each entity profile.

## Refresh cadence

| Source type | Recommended rerun |
|---|---|
| FDIC, NCUA, FFIEC call reports | Quarterly |
| CFPB complaints, SEC submissions | Weekly |
| SAM.gov, USAspending | Monthly |
| IRS BMF, CMS NPI | Monthly |
| DOL 5500, Census, BLS QCEW, SBA PPP | Annual (PPP is frozen historical) |
| FinCEN MSB, NMLS | Monthly |

The ingest script is idempotent — running it again just replaces records by `(source_id, source_record_id)` primary key.

## What this doesn't do

- **No contact data.** Free government sources give you firmographic + financial detail but not named decision-maker contacts. That's the enrichment layer (Clay, Apollo, PDL). The knowledge layer feeds them the right accounts to enrich.
- **No intent signals.** Those come from web-scrape, G2, Bombora, etc. CFPB complaints are the closest free intent-adjacent signal.
- **No private-company financials.** For that, pair this with PPP loan size (rough revenue proxy) + DOL 5500 participant counts (employee proxy) + Form 990 for nonprofits.

## Extending

To add a new source:

1. Add an entry to `sources_manifest.json` following the existing schema.
2. Add a handler in `ingest.py` decorated with `@handler("source_id")` that yields `Company` records.
3. Run `python ingest.py --source your_new_source`.

The manifest is intentionally self-describing so that an LLM agent with tool access can read it and know which sources to pull for a given prospect research task.
