# Cambrian Catalyst Vertical → Source Mapping

Quick reference showing which free sources cover each of Cambrian Catalyst's target verticals and what each gives you. Use this to pick which handlers to run first for a given client engagement.

## Fintech & Payments

Primary stack. These four sources together cover the entire regulated US payments and fintech universe for free:

| Source | What it gives you | Records |
|---|---|---|
| FDIC BankFind Institutions | Every US bank with assets, deposits, income, employees | ~4,500 |
| NCUA Call Reports | Every credit union with balance sheet + membership | ~4,600 |
| FinCEN MSB Registrants | Money transmitters, processors, prepaid, check cashers | ~25,000 |
| NMLS Consumer Access | State-licensed non-bank finance (mortgage, consumer finance) | ~250,000 |

**Enrichment layer:**
- **CFPB Complaints** — complaint counts per named institution = free pain signal for outreach triggers
- **SEC EDGAR** — public filings for the ~80 publicly traded fintechs/processors

**Example ICP query:** "Regional banks in the Pacific Northwest with $1B-$10B in assets and declining net income YoY" — fully answerable from FDIC call report fields alone.

## Rewards & Incentives (Blackhawk-adjacent)

The rewards/incentives space doesn't map cleanly to a single regulatory registry. Use a layered approach:

| Source | Coverage |
|---|---|
| FinCEN MSB (filtered to prepaid access providers) | Digital gift/prepaid issuers |
| SEC EDGAR (SIC 6099 + 7389) | Public incentives players |
| SBA PPP (NAICS 454110, 448190, 523910) | SMB gifting/incentive resellers |
| DOL Form 5500 (BUSINESS_CODE filter) | Employer-side buyers of incentive programs |

## Regional Banks & Credit Unions

| Source | Use for |
|---|---|
| FDIC BankFind Financial | Bank tier-1 capital, net interest margin, loan composition for targeting by bank size/profile |
| FFIEC CDR | Deeper historical detail — 10+ years of quarterly data |
| NCUA Call Reports | Credit union equivalent |
| CFPB Complaints | Complaint velocity by institution (product + issue taxonomy) |

## Payment Processors

| Source | Use for |
|---|---|
| FinCEN MSB | Foundation — every registered processor |
| NMLS | Additional state licensure detail |
| SEC EDGAR | Public processors (FIS, Fiserv, Global Payments, Toast, Block, Adyen US, etc.) |
| USAspending | Processors with federal government contracts |

## Health & Wellness B2B

**Provider side** (clinics, hospitals, digital health orgs):
- CMS NPI Registry — every healthcare organization with address and specialty codes
- FDA Establishment Registration — medical device, drug, food manufacturers

**Employer/buyer side** (HR, benefits):
- DOL Form 5500 — the single best free dataset for targeting mid-market employers. Includes plan sponsor name, EIN, participant count (employee proxy), plan assets, and third-party administrator. If your product sells to benefits buyers, start here.

## Market Research / Cross-Vertical SMB

| Source | Use for |
|---|---|
| Census SUSB | TAM sizing by NAICS × state × employee size |
| Census CBP (incl. ZIP Business Patterns) | Density maps down to ZIP |
| BLS QCEW | Employment + wages, establishment count |
| SBA PPP | Named SMBs with employee + revenue proxies (historical but still highest-volume free SMB list) |
| SAM.gov | Government contractors (diverse and minority-owned certifications available) |
| USAspending | Who's actually winning federal contracts |

## Cross-source identity resolution

When you ingest multiple sources, the same real-world company will appear in several. Key joins:

- **FDIC ↔ FFIEC**: share RSSD_ID for banks
- **FDIC/NCUA ↔ CFPB**: CFPB `company` name is fuzzy-matchable, no clean FK
- **SEC ↔ FDIC**: match on name + state for public bank holding companies
- **FinCEN MSB ↔ NMLS**: same entity often in both registries; match on legal name + address
- **DOL 5500 ↔ SAM.gov ↔ IRS BMF**: share EIN (clean join)
- **CMS NPI ↔ IRS BMF**: EIN if the provider is a nonprofit (common for hospitals)

The ingestion script preserves all available identifiers in the `identifiers` JSON blob so your app can build a resolution graph on top.

## Prioritization for first engagement

If you're standing this up for a new client with a fintech/payments ICP, run these in order:

1. `python ingest.py --source sec_company_tickers` (fast, gives you the public comp set)
2. `python ingest.py --source fdic_institutions` (fast API, ~5 min)
3. `python ingest.py --source fincen_msb` (fast, ~2 min)
4. `python ingest.py --source cfpb_complaints` (for pain signal enrichment)
5. NCUA + NMLS + SBA PPP as needed (require manual URL setup)

That gives you a defensible "entire US fintech/payments regulated universe" knowledge layer in under an hour, with no paid data dependencies.
