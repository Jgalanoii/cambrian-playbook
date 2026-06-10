# Cambrian Catalyst — Knowledge Layer Inventory

**Version:** June 2026 | **Total:** 45 files | **Size:** 1.5MB

---

## What Knowledge Layers Are

Knowledge layers (KLs) are proprietary intelligence files that give Cambrian deep vertical expertise. They're NOT prompts — they're structured data loaded server-side and injected into prompts based on the prospect's industry. A brief for a banking prospect gets banking-specific discovery questions, scoring contexts, and competitive intelligence. A brief for a cannabis company gets 280E tax awareness and state regulatory knowledge.

---

## Full Inventory

### Vertical-Specific (27 layers)

| # | Layer | File | Size | Industry Coverage |
|---|-------|------|------|------------------|
| 1 | Accounting & Finance | accountingFinanceKnowledge.js | 37KB | Audit firms, tax advisory, CFO services |
| 2 | AI / ML | aiMlKnowledge.js | 46KB | AI platforms, ML ops, data science |
| 3 | BaaS / Sponsor Banking | baasKnowledge.js | 45KB | Banking-as-a-Service, fintech partnerships |
| 4 | Banking | bankingKnowledge.js | 32KB | Commercial, retail, investment banking |
| 5 | Cannabis | cannabisKnowledge.js | 34KB | Multi-state operators, dispensaries, compliance |
| 6 | Charitable Giving | charitableGivingKnowledge.js | 50KB | Nonprofits, donor engagement, grants |
| 7 | Compliance / RegTech | complianceKnowledge.js | 42KB | AML, KYC, regulatory reporting |
| 8 | Crypto / Stablecoin | cryptoStablecoinKnowledge.js | 33KB | Exchanges, DeFi, stablecoin infrastructure |
| 9 | Cybersecurity | cybersecurityKnowledge.js | 44KB | Endpoint, SASE, SOC, threat detection |
| 10 | Digital Incentives | digitalIncentivesPlatformsKnowledge.js | 47KB | Gift cards, rewards platforms, prepaid |
| 11 | Education | educationKnowledge.js | 45KB | EdTech, university partnerships, LMS |
| 12 | Energy & Utilities | energyKnowledge.js | 44KB | Renewables, grid, oil & gas, utilities |
| 13 | Fintech | fintechKnowledge.js | 40KB | Payments, lending, neobanks |
| 14 | Gaming / Sports Betting | gamingKnowledge.js | 33KB | iGaming, sports betting, responsible gaming |
| 15 | Government / SLED | governmentKnowledge.js | 38KB | Federal, state, local, education procurement |
| 16 | Healthcare SaaS | healthcareSaasKnowledge.js | 42KB | EHR, clinical, revenue cycle, HIPAA |
| 17 | HR Tech | hrTechKnowledge.js | 38KB | HCM, payroll, benefits, workforce analytics |
| 18 | Insurance | insuranceKnowledge.js | 36KB | P&C, life, health, agent enablement |
| 19 | Manufacturing | manufacturingKnowledge.js | 33KB | Industrial ops, supply chain, automation |
| 20 | Medical Payments | medicalPaymentsKnowledge.js | 44KB | Flex cards, supplemental benefits, OTC |
| 21 | Payments | paymentsKnowledge.js | 31KB | Card issuing, processing, merchant services |
| 22 | Prediction Markets | predictionMarketsKnowledge.js | 29KB | Event contracts, regulated exchanges |
| 23 | Professional Services | professionalServicesKnowledge.js | 40KB | Consulting, advisory, managed services |
| 24 | QSR / Restaurants | qsrKnowledge.js | 37KB | Quick service, casual dining, food tech |
| 25 | Real Estate | realEstateKnowledge.js | 35KB | REIT, proptech, commercial, residential |
| 26 | Retail | retailKnowledge.js | 32KB | E-commerce, omnichannel, loyalty, POS |
| 27 | Rewards / Incentives | rewardsIncentivesKnowledge.js | 39KB | Employee recognition, loyalty, incentive programs |

### Cross-Vertical / Methodology (18 layers)

| # | Layer | File | Size | Purpose |
|---|-------|------|------|---------|
| 28 | Advanced Sales | advancedKnowledge.js | 30KB | Advanced methodology (Challenger, JOLT, Voss) |
| 29 | Approval Gates | approvalGatesKnowledge.js | 22KB | Procurement process intelligence |
| 30 | B2B Sales Core | b2bSalesKnowledge.js | 37KB | Foundational B2B sales intelligence |
| 31 | Displacement | displacementKnowledge.js | 12KB | Incumbent unseating playbook |
| 32 | Executive Perspectives | executivePerspectivesKnowledge.js | 48KB | C-suite framing by role |
| 33 | ICP Fit | icpFitKnowledge.js | 21KB | Scoring calibration |
| 34 | Investor Intelligence | investorIntelligenceKnowledge.js | 38KB | PE, VC, board dynamics |
| 35 | Negotiation | negotiationFrameworks.js | 16KB | Tactical negotiation |
| 36 | OKR / KPI | okrKpiKnowledge.js | 38KB | Outcome mapping by function |
| 37 | PE Holdco | peHoldcoKnowledge.js | 40KB | Private equity portfolio companies |
| 38 | Pre-RFP Signals | preRfpSignalKnowledge.js | 43KB | Buying signals before formal procurement |
| 39 | RFP Procurement | rfpProcurementKnowledge.js | 45KB | Government + commercial procurement |
| 40 | RFP Sources | rfpSources.js | 11KB | Procurement portal database |
| 41 | RIVER Framework | riverFramework.js | 8KB | Proprietary qualification methodology |
| 42 | SMB / Mid-Market | smbMidmarketKnowledge.js | 38KB | Size-specific sales motions |
| 43 | Vertical Playbooks | verticalPlaybooks.js | 52KB | Cross-vertical tactics |
| 44 | Sample Accounts | sampleAccounts.js | 40KB | 150 accounts across 37 industries |
| 45 | Outcomes | outcomes.js | 2KB | Outcome templates |

---

## How Knowledge Layers Are Selected

1. When a brief fires, the prospect's industry is matched against KL tags
2. **Tier 1 match** (primary vertical): Full KL injected into prompts (~3-5KB per call)
3. **Tier 2 match** (adjacent vertical): Summary injection only (~500 bytes)
4. Cross-vertical layers (B2B sales, executive perspectives, displacement) inject into every call

This 2-tier system keeps prompt size manageable while providing deep vertical context where it matters.
