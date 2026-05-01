# Cambrian Catalyst — Platform Wireframe

**Product:** AI-Powered Sales Intelligence Platform
**URL:** cambriancatalyst.ai
**Version:** v4.28.26+
**Last Updated:** 2026-05-01

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CAMBRIAN CATALYST                            │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌────────────────┐  │
│  │  React   │──▶│  Vercel  │──▶│  Claude  │   │   Supabase     │  │
│  │  SPA     │   │  Edge    │   │  API     │   │  (Auth + DB)   │  │
│  │          │◀──│  (7 API  │◀──│  (Haiku/ │   │  ┌──────────┐  │  │
│  │ App.jsx  │   │  routes) │   │  Sonnet/ │   │  │ Users    │  │  │
│  │ ~10K LOC │   │          │   │  Opus)   │   │  │ Orgs     │  │  │
│  │          │   │          │   │          │   │  │ Sessions │  │  │
│  │ 4 comps  │   │ _guard   │   │ web_     │   │  │ Invites  │  │  │
│  │ 34 data  │   │ _usage   │   │ search   │   │  │ Usage    │  │  │
│  └──────────┘   └──────────┘   └──────────┘   │  └──────────┘  │  │
│                                                └────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              KNOWLEDGE LAYER (JWT-Protected)                 │   │
│  │  19 Verticals · 13 Compliance Frameworks · 10 Sales Methods │   │
│  │  10 Scoring Calibrations · 15 Vertical Playbooks             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## User Flow (10-Step Workflow)

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ 1.Session│──▶│ 2. ICP & │──▶│3. Import │──▶│4. Account│──▶│5. Account│
│   Setup  │   │   RFPs   │   │ Accounts │   │  Review  │   │  Detail  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
                                                                   │
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐         │
│10.Solution◀──│9. Post-  │◀──│ 8. In-   │◀──│ 7. Hypo- │◀──┌─────▼────┐
│   Fit    │   │   Call   │   │   Call   │   │  thesis  │   │ 6. Brief │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

---

## Global Navigation (Persistent Header)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CAMBRIAN CATALYST                                                       │
│                                                                         │
│ ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬────┐                            │
│ │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │ 10 │  Step Navigation Rail    │
│ │ ✓ │ ✓ │ ✓ │ ● │   │   │   │   │   │    │  (● = active, ✓ = done)  │
│ └───┴───┴───┴───┴───┴───┴───┴───┴───┴────┘                            │
│                                                                         │
│ [⚡ MAX]  [💾 Save]  [📋 Sessions]  [··· More ▾]  [Joe G · Sign out]  │
│                                                                         │
│ ┌───────────────────────────────────────────────────────────────────┐   │
│ │ Selling: acme.com · 3 products · ICP: Fintech, Payments · ...   │   │
│ └───────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

More Menu (···):
  ┌─────────────────────┐
  │ 🔍 Search (⌘K)      │
  │ 📁 Resources        │
  │ ★  Favorites (3)    │
  │ 📊 Reports          │
  │ 👥 Organization     │
  │ ✉  Contact Us       │
  │ 🌙 Dark Mode        │
  │ ⚙  Admin Dashboard  │
  └─────────────────────┘
```

---

## Step 1: Session Setup

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SESSION SETUP                                   │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Mode: ( ● Full Sales Session )  ( ○ Quick Brief )                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────┐  ┌──────────────────────────┐ │
│  │ SELLER WEBSITE                      │  │ ICP TARGETING            │ │
│  │                                     │  │                          │ │
│  │ ┌─────────────────────────────┐     │  │ Segment:  [Mid-Market ▾] │ │
│  │ │ https://acme.com           │     │  │                          │ │
│  │ └─────────────────────────────┘     │  │ Headcount: [100-500]     │ │
│  │                                     │  │            [500-1000]    │ │
│  │ Funding Stage: [Series B ▾]         │  │                          │ │
│  │                                     │  │ Revenue:   [$10M-$50M]   │ │
│  │                                     │  │            [$50M-$100M]  │ │
│  └─────────────────────────────────────┘  │                          │ │
│                                            │ Ownership: [PE-backed]   │ │
│  ┌─────────────────────────────────────┐  │            [VC-backed]   │ │
│  │ DOCUMENT UPLOADS                    │  │                          │ │
│  │                                     │  │ Geography: [USA]         │ │
│  │ ┌───────────────────────────────┐   │  │            [EMEA]        │ │
│  │ │  ┌──┐  Drag files here       │   │  │                          │ │
│  │ │  │📄│  or browse (up to 6)   │   │  │ Exclude:   [Crypto]      │ │
│  │ │  └──┘                        │   │  └──────────────────────────┘ │
│  │ └───────────────────────────────┘   │                               │
│  │                                     │  ┌──────────────────────────┐ │
│  │ PROOF POINTS                        │  │ PRODUCT URLS (up to 5)   │ │
│  │ ┌────────┐ ┌────────┐ ┌────────┐   │  │                          │ │
│  │ │Case    │ │ROI     │ │Awards  │   │  │ acme.com/product-a       │ │
│  │ │Studies │ │Metrics │ │        │   │  │ acme.com/pricing         │ │
│  │ └────────┘ └────────┘ └────────┘   │  │ [+ Add URL]              │ │
│  └─────────────────────────────────────┘  └──────────────────────────┘ │
│                                                                         │
│                        [▶ Scan & Build ICP]                             │
└─────────────────────────────────────────────────────────────────────────┘

Quick Brief Mode:
┌──────────────────────────────────────┐
│ Research any company:                │
│ ┌──────────────────────────────────┐ │
│ │ e.g., Salesforce, Nike           │ │
│ └──────────────────────────────────┘ │
│         [▶ Quick Brief]             │
└──────────────────────────────────────┘
```

---

## Step 2: ICP & RFPs

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       ICP & RFP INTELLIGENCE                            │
│                                                                         │
│  ┌─────────────────┬─────────────────┐                                 │
│  │ ( ● ICP )       │ ( ○ RFP Intel ) │  ← Tab switcher                │
│  └─────────────────┴─────────────────┘                                 │
│                                                                         │
│  ICP TAB:                                                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Confidence: ████████████░░ HIGH          [↻ Regenerate] [Export] │  │
│  │                                                                   │  │
│  │ ┌─────────────────────────────────────────────────────────────┐   │  │
│  │ │ Industries        │ Fintech, Payments, Banking              │   │  │
│  │ │ Company Size      │ 100-1,000 employees                     │   │  │
│  │ │ Buyer Personas    │ VP Sales, CRO, Head of Partnerships     │   │  │
│  │ │ Priority Init.    │ Revenue ops scaling, channel expansion   │   │  │
│  │ │ Pain Points       │ CAC inflation, compliance complexity    │   │  │
│  │ │ Channels          │ Direct, Partner, Embedded               │   │  │
│  │ └─────────────────────────────────────────────────────────────┘   │  │
│  │                                                                   │  │
│  │ ⚠ 3 edits applied — changes flow into scoring + briefs + disc.  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  RFP TAB:                                                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Filter: [All] [Private] [Government]                              │  │
│  │                                                                   │  │
│  │ OPEN RFPs                                                         │  │
│  │ ┌─────────────────────────────────────────────────────────────┐   │  │
│  │ │ 📋 Digital Payments Infrastructure Modernization            │   │  │
│  │ │    Buyer: Federal Reserve Bank · SAM.gov · $2.4M            │   │  │
│  │ │    Deadline: Jun 15 · Cohort Match: HIGH                    │   │  │
│  │ ├─────────────────────────────────────────────────────────────┤   │  │
│  │ │ 📋 Embedded Finance Platform RFP                            │   │  │
│  │ │    Buyer: PNC · Ariba · Est. $500K-$1M                      │   │  │
│  │ │    Deadline: Jul 30 · Cohort Match: MEDIUM                  │   │  │
│  │ └─────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step 3: Import Accounts

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        IMPORT ACCOUNTS                                  │
│                                                                         │
│  ┌───────────────────┬───────────────────┐                             │
│  │ ( ● CSV Upload )  │ ( ○ Quick Entry ) │                             │
│  └───────────────────┴───────────────────┘                             │
│                                                                         │
│  ┌─────────────────────────────────┐  ┌────────────────────────────┐   │
│  │ CSV UPLOAD                      │  │ BUILD TARGET LIST (AI)     │   │
│  │                                 │  │                            │   │
│  │ ┌─────────────────────────┐     │  │ Industries:                │   │
│  │ │   📄 Drop CSV here      │     │  │ ┌──────────────────────┐   │   │
│  │ │   or click to browse    │     │  │ │ Fintech              │   │   │
│  │ └─────────────────────────┘     │  │ │ Payments             │   │   │
│  │                                 │  │ └──────────────────────┘   │   │
│  │ [Load Sample Data]              │  │                            │   │
│  │                                 │  │ Headcount: [100-500 ▾]     │   │
│  │ Column Mapping:                 │  │ Revenue:   [$10M-$50M ▾]   │   │
│  │ Company → Company              │  │ Ownership: [PE-backed ▾]   │   │
│  │ Website → URL                   │  │                            │   │
│  │ Industry → Industry             │  │                            │   │
│  └─────────────────────────────────┘  │ [▶ Generate 20 Targets]   │   │
│                                        └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step 4: Account Review (List)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ACCOUNT REVIEW                                   │
│                                                                         │
│  ⚠ ICP updated — [Re-score all accounts]                              │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Company          │ Industry     │ Size  │ Own.    │ Fit  │ Act.  │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ ☑ Mercury        │ Fintech     │ 800  │ VC     │ 87%🟢│ ⚙ 🗑  │  │
│  │ ☑ Unit           │ BaaS        │ 350  │ VC     │ 82%🟢│ ⚙ 🗑  │  │
│  │ ☑ Toast          │ SaaS+Fin    │ 5200 │ Public │ 79%🟢│ ⚙ 🗑  │  │
│  │ ☐ Affirm         │ BNPL        │ 2100 │ Public │ 61%🟡│ ⚙ 🗑  │  │
│  │ ☐ Robinhood      │ Consumer    │ 3400 │ Public │ 38%🔴│ ⚙ 🗑  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ⚙ = Intel Adjustment (±20 pts)     🗑 = Disqualify                   │
│                                                                         │
│  Queue: Mercury, Unit, Toast (3 accounts)                              │
│  [▶ Continue with 3 accounts]        [Clear Queue]                     │
└─────────────────────────────────────────────────────────────────────────┘

Intel Adjustment Modal:          Disqualify Modal:
┌────────────────────────┐      ┌──────────────────────────┐
│ Adjust: Mercury        │      │ Disqualify: Robinhood    │
│                        │      │                          │
│ [-20][-15][-10][-5]    │      │ ○ Wrong industry         │
│ [+5][+10][+15][+20]    │      │ ○ Wrong size             │
│                        │      │ ○ Competitor              │
│ Reason:                │      │ ○ Already a customer      │
│ ┌────────────────────┐ │      │ ○ Bad timing             │
│ │ Know the CRO, warm │ │      │ ● Other: ___________     │
│ └────────────────────┘ │      │                          │
│ [Cancel]    [Save]     │      │ [Cancel]  [Disqualify]   │
└────────────────────────┘      └──────────────────────────┘
```

---

## Step 5: Account Detail

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ACCOUNT DETAIL — Mercury                         │
│                                                                         │
│  ┌───┬───┬───┐                                                         │
│  │ 1 │ 2 │ 3 │  Account selector (numbered chips w/ fit scores)       │
│  │87%│82%│79%│                                                         │
│  └───┴───┴───┘                                                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🏢 Mercury · Fintech · mercury.com                 FIT: 87% 🟢 │   │
│  │ Source: AI-generated · Intel: +10 (Know the CRO)                │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │ Reason: Strong ICP alignment — mid-market B2B fintech with     │   │
│  │ embedded banking, PE growth pressure, scaling sales org.        │   │
│  │                                                                 │   │
│  │ Similar to: [Named Customer] — same vertical, buyer persona     │   │
│  │ Incumbent Risk: Low — no known incumbent in rev ops category    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ICP MATCH GRID                                                  │   │
│  │                                                                 │   │
│  │ Target Industries:  ✓ Fintech  ✓ Banking  ○ Payments            │   │
│  │ Buyer Personas:     VP Sales · CRO · Head of Partnerships      │   │
│  │ Priority Initiative: Revenue ops scaling                        │   │
│  │ Headcount:          ~800 (matches 500-1000 target)              │   │
│  │ Revenue:            ~$150M (matches $100M-$500M target)         │   │
│  │ Ownership:          VC-backed (matches target)                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  OUTCOMES (select up to 3):                                            │
│  ☑ Grow Revenue  ☑ Expand Market  ☐ Reduce Risk  ☐ Improve CX        │
│  ☐ Efficiency    ☐ Comply         ☐ AI Adoption  ☐ Other: _____       │
│                                                                         │
│  [◀ Prev]                                   [▶ Go to Brief]            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step 6: Sales Brief

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ACME → Mercury                    [Contact Role ▾] [Export] [↻ Regen] │
│                                                                         │
│  ┌─ COMPANY SNAPSHOT ──────────────────────────────────── ★ ──────┐    │
│  │ Mercury is a B2B fintech platform providing banking services    │    │
│  │ to startups and SMBs. Founded 2017, ~800 employees...          │    │
│  │                                                                 │    │
│  │ 👥 ~800 employees  📈 ~$150M revenue  🏷 VC-backed             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─ EXECUTIVE LEADERSHIP ──────────────────────────────── ★ ──────┐    │
│  │ • Immad Akhund — CEO & Co-founder                               │    │
│  │   Former YC partner. Scaling from SMB to mid-market...          │    │
│  │ • Jason Zhang — CRO                                             │    │
│  │   Previously VP Sales at Brex. Enterprise motion builder...     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─ ELEVATOR PITCH ───────────────────────────────────── ★ ──────┐    │
│  │ "Mercury is scaling from founder-led sales to enterprise,       │    │
│  │ but their channel architecture hasn't caught up with their      │    │
│  │ product maturity. We help fintech platforms like Mercury..."    │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─ STRATEGIC ANALYSIS ─ ★ ┐  ┌─ FINANCIAL INTELLIGENCE ─ ★ ┐        │
│  │ Key themes:              │  │ Revenue: ~$150M (+40% YoY)   │        │
│  │ • Mid-market expansion   │  │ Gross margin: ~72%           │        │
│  │ • Banking-as-a-service   │  │ CAC payback: 14 months       │        │
│  │ • Compliance scaling     │  │ NRR: ~130%                   │        │
│  └──────────────────────────┘  └──────────────────────────────┘        │
│                                                                         │
│  ┌─ SOLUTION MAPPING ─────────────────────────────────── ★ ──────┐    │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐                        │    │
│  │ │Channel   │ │Revenue   │ │Partner   │  ← Solution badges     │    │
│  │ │Strategy  │ │Ops       │ │GTM       │                        │    │
│  │ │ HIGH FIT │ │ HIGH FIT │ │ MED FIT  │                        │    │
│  │ └──────────┘ └──────────┘ └──────────┘                        │    │
│  │                                                                │    │
│  │ Opening Angle: "Mercury's channel economics don't match       │    │
│  │ their product sophistication — we've solved this exact gap    │    │
│  │ for 3 similar fintech platforms..."                           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─ TEACHING INSIGHT ── ★ ┐  ┌─ JOLT (Remove Indecision) ── ★ ┐      │
│  │ "Most B2B fintechs      │  │ "The cost of waiting another   │      │
│  │ overinvest in product    │  │ quarter: 15-20% channel        │      │
│  │ and underinvest in       │  │ revenue leakage..."            │      │
│  │ channel architecture..." │  └────────────────────────────────┘      │
│  └──────────────────────────┘                                          │
│                                                                         │
│  ┌─ + More Sections (collapsible) ─────────────────────────────┐      │
│  │ ▸ Competitive Positioning                                    │      │
│  │ ▸ Board & Investors                                          │      │
│  │ ▸ Customer Proof                                             │      │
│  │ ▸ Financial Deep-Dive                                        │      │
│  │ ▸ Acquisition Signals                                        │      │
│  │ ▸ Hiring & Culture                                           │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                         │
│  All fields are click-to-edit (EF component). Changes tracked.         │
│                                                                         │
│  [◀ Back to Accounts]                      [▶ Review Hypothesis]       │
└─────────────────────────────────────────────────────────────────────────┘

Brief Generation (9 phases, progressive rendering):
  p1: Company Overview (web search + knowledge layer)
  p2: Executive Leadership (web search, cached)
  p3: Strategy & Positioning (AI synthesis)
  p4: Solutions & Contacts (AI + products context)
  p5: Live Signals (real-time web search)
  p6: Open Roles (dedicated search)
  p7: Financial Deep-Dive (AI synthesis)
  p8: Competitive Landscape (AI synthesis)
  p9: Acquisition Signals (AI synthesis)
```

---

## Step 7: RIVER Hypothesis

```
┌─────────────────────────────────────────────────────────────────────────┐
│  RIVER HYPOTHESIS — Mercury                              [↻ Regenerate]│
│                                                                         │
│  ┌─ RECOMMENDED SOLUTIONS ─────────────────────────────────────────┐   │
│  │ [Channel Strategy: HIGH] [Revenue Ops: HIGH] [Partner GTM: MED] │   │
│  │                                                                  │   │
│  │ Opening: "Mercury's product is enterprise-ready but their        │   │
│  │ channel architecture is Series A..."                             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ 📍 R — REALITY (Current State) ─────────────────────── ★ ────┐    │
│  │ Mercury currently relies on PLG + founder-led enterprise        │    │
│  │ outbound. No dedicated channel team. Partner revenue <5% of     │    │
│  │ total despite product-market fit with 200+ integration...       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─ 💥 I — IMPACT (Cost of Inaction) ────────────────────── ★ ────┐   │
│  │ Without channel architecture: $15-25M annual revenue leakage    │   │
│  │ from unstructured partnerships. Competitors (Brex, Ramp) are    │   │
│  │ building dedicated partner programs...                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ 🔭 V — VISION ────── ★ ┐  ┌─ 🚪 E — ENTRY POINTS ──── ★ ┐      │
│  │ 18 months: structured    │  │ Decision: CRO (Jason Zhang)   │      │
│  │ partner program driving  │  │ Champion: VP Partnerships     │      │
│  │ 25%+ of new revenue...   │  │ Blocker: CFO (budget cycle)   │      │
│  └──────────────────────────┘  └────────────────────────────────┘      │
│                                                                         │
│  ┌─ 🗺️ R — ROUTE (Path to Close) ───────────────────────── ★ ────┐   │
│  │ Phase 1: Channel audit (2 weeks, $15K)                          │   │
│  │ Phase 2: Partner program design (6 weeks, $45K)                 │   │
│  │ Phase 3: Launch + enablement (ongoing, $8K/mo)                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ CHALLENGER INSIGHT ─ ★ ┐  ┌─ JOLT PLAN ──────────── ★ ┐         │
│  │ "In our work with 12     │  │ Remove indecision:          │         │
│  │ fintech platforms, the   │  │ 1. Show competitor channel  │         │
│  │ #1 predictor of channel  │  │    investment data          │         │
│  │ success is..."           │  │ 2. Model revenue impact     │         │
│  └──────────────────────────┘  └─────────────────────────────┘         │
│                                                                         │
│  ┌─ DISCOVERY QUESTIONS ───────────────────────────────────────────┐   │
│  │ ┌─────────────────────────┬──────────────────────────────────┐  │   │
│  │ │ SALES TRACK             │ ARCHITECTURE TRACK               │  │   │
│  │ ├─────────────────────────┼──────────────────────────────────┤  │   │
│  │ │ R: "How are partner     │ R: "What's your current tech    │  │   │
│  │ │ deals sourced today?"   │ stack for partner attribution?" │  │   │
│  │ │                         │                                  │  │   │
│  │ │ I: "What's the revenue  │ I: "How do you measure partner  │  │   │
│  │ │ impact of unstructured  │ influence on deal velocity?"    │  │   │
│  │ │ channel relationships?" │                                  │  │   │
│  │ │                         │                                  │  │   │
│  │ │ V: "What does 'great'   │ V: "What integrations would    │  │   │
│  │ │ look like for channel   │ unlock the most partner value?" │  │   │
│  │ │ in 18 months?"          │                                  │  │   │
│  │ └─────────────────────────┴──────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [◀ Back to Brief]                              [▶ Go to In-Call]      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step 8: In-Call Navigator

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🎙 IN-CALL NAVIGATOR · Mercury          Confidence: 42% 🟡           │
│  Contact: Jason Zhang (CRO) · Fintech                                  │
│                                                                         │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░  42% confidence              │
│                                                                         │
│  ┌─────┬─────┬─────┬─────┬─────┐                                      │
│  │  R  │  I  │  V  │  E  │  R  │  ← RIVER Stage Pills                │
│  │ ●●  │ ●○  │ ○○  │ ○○  │ ○○  │  (filled/empty indicators)          │
│  └─────┴─────┴─────┴─────┴─────┘                                      │
│                                                                         │
│  ┌─ ACTIVE STAGE ──────────────────┐  ┌─ DISCOVERY QUESTIONS ───────┐  │
│  │                                  │  │                             │  │
│  │  ██╗                             │  │ 🎯 Tailored to Mercury     │  │
│  │  ██║  IMPACT                     │  │                             │  │
│  │  ██║  Cost of inaction           │  │ "What happens if channel    │  │
│  │  ██║                             │  │ remains unstructured for    │  │
│  │                                  │  │ another 2 quarters?"        │  │
│  │  GATE 1: Budget identified?      │  │                             │  │
│  │  [Yes] [Partial] [No] [Skip]     │  │ What you're hearing:        │  │
│  │                                  │  │ ┌─────────────────────────┐ │  │
│  │  Notes:                          │  │ │ "We know we're leaving  │ │  │
│  │  ┌────────────────────────────┐  │  │ │ money on the table but  │ │  │
│  │  │ CRO confirmed $50-75K     │  │  │ │ haven't quantified it"  │ │  │
│  │  │ budget available Q3...     │  │  │ └─────────────────────────┘ │  │
│  │  └────────────────────────────┘  │  │                             │  │
│  │                                  │  │ Expert note:                │  │
│  │  GATE 2: Timeline pressure?      │  │ ▸ "Push for specific $ —   │  │
│  │  [Yes] [Partial] [No] [Skip]     │  │    vague 'leaving money'   │  │
│  │                                  │  │    won't survive committee" │  │
│  │  Notes:                          │  │                             │  │
│  │  ┌────────────────────────────┐  │  │ [Next question ▸]          │  │
│  │  │                            │  │  │                             │  │
│  │  └────────────────────────────┘  │  │                             │  │
│  │                                  │  │                             │  │
│  │  [◀ Prev Stage]  [Next Stage ▶]  │  │                             │  │
│  └──────────────────────────────────┘  └─────────────────────────────┘  │
│                                                                         │
│  [◀ Back to Hypothesis]     [Export]     [End Call & Route Deal ▶]     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step 9: Post-Call Route

```
┌─────────────────────────────────────────────────────────────────────────┐
│  POST-CALL ROUTE — Mercury                                              │
│                                                                         │
│  ┌─ TRANSCRIPT (optional) ─────────────────────────────────────────┐   │
│  │ ┌───────────────────────────────────────────────────────────┐    │   │
│  │ │ Paste call transcript (Gong/Chorus/Otter format)...       │    │   │
│  │ └───────────────────────────────────────────────────────────┘    │   │
│  │ [📎 Upload .txt/.vtt/.srt]              [▶ Analyze Transcript]  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────┬──────────────────┬──────────────────┐            │
│  │ CONFIDENCE       │ DEAL ROUTE       │ DEAL SIZE        │            │
│  │                  │                  │                  │            │
│  │    72%           │  FAST TRACK      │   $60K ACV       │            │
│  │    🟢            │  🟢              │                  │            │
│  └──────────────────┴──────────────────┴──────────────────┘            │
│                                                                         │
│  ┌─ DEAL HEALTH BY RIVER STAGE ────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐                       │   │
│  │  │ R  │  │ I  │  │ V  │  │ E  │  │ R  │                       │   │
│  │  │85% │  │78% │  │65% │  │52% │  │70% │                       │   │
│  │  │ 🟢 │  │ 🟢 │  │ 🟡 │  │ 🟡 │  │ 🟢 │                       │   │
│  │  └────┘  └────┘  └────┘  └────┘  └────┘                       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ RIVER SCORECARD ───────────────────────────────────────────────┐   │
│  │ Stage     │ Pre-Call Hypothesis        │ Actual (from call)     │   │
│  │───────────┼───────────────────────────┼────────────────────────│   │
│  │ Reality   │ PLG + founder-led         │ Confirmed. Also have   │   │
│  │           │                           │ 2 channel managers...  │   │
│  │ Impact    │ $15-25M leakage           │ CRO estimates $20M+   │   │
│  │           │                           │ but no hard data...    │   │
│  │ Vision    │ 25%+ partner revenue      │ "Want 30% within 18   │   │
│  │           │                           │ months" — ambitious... │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ CALL SUMMARY ──── ★ ┐  ┌─ CRM NOTE ──────────── [Copy] ┐         │
│  │ "Strong discovery     │  │ Met with Jason Zhang (CRO).    │         │
│  │ call with Mercury     │  │ Budget: $50-75K Q3. Timeline:  │         │
│  │ CRO. Budget exists,   │  │ decision by Aug. Next: send    │         │
│  │ timeline is Q3..."    │  │ channel audit proposal...      │         │
│  └───────────────────────┘  └────────────────────────────────┘         │
│                                                                         │
│  ┌─ FOLLOW-UP EMAIL ─────────────────────────────── [Copy] ──────┐    │
│  │ Subject: Mercury + Cambrian — Channel Strategy Next Steps      │    │
│  │                                                                 │    │
│  │ Hi Jason,                                                       │    │
│  │                                                                 │    │
│  │ Great speaking today. Based on our conversation about           │    │
│  │ Mercury's channel architecture opportunity...                   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  [◀ Back to In-Call]                         [▶ Solution Fit Review]   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step 10: Solution Fit

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SOLUTION FIT REVIEW — Mercury                    [↻ Regen] [Export]   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Architecture-level fit analysis based on discovery capture       │  │
│  │                                                                  │  │
│  │ ┌─────────────┬──────────┬───────────────────────────────────┐  │  │
│  │ │ Solution    │ Fit      │ Assessment                        │  │  │
│  │ ├─────────────┼──────────┼───────────────────────────────────┤  │  │
│  │ │ Channel     │ 92% 🟢   │ Direct alignment with Mercury's   │  │  │
│  │ │ Strategy    │          │ stated need for structured...     │  │  │
│  │ ├─────────────┼──────────┼───────────────────────────────────┤  │  │
│  │ │ Revenue Ops │ 85% 🟢   │ Strong fit — current PLG motion   │  │  │
│  │ │             │          │ needs enterprise overlay...       │  │  │
│  │ ├─────────────┼──────────┼───────────────────────────────────┤  │  │
│  │ │ Partner GTM │ 67% 🟡   │ Moderate — CRO interested but    │  │  │
│  │ │             │          │ team capacity unclear...          │  │  │
│  │ └─────────────┴──────────┴───────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  [◀ Back to Post-Call]                         [▶ Next Account]        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Persistent Right Panel: Milton AI Coach

```
┌──────────────────────────────┐
│ 💬 Milton · Step 6 Context   │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🤖 Milton:               │ │
│ │ "That hypothesis looks   │ │
│ │ good but your Route is   │ │
│ │ missing the procurement  │ │
│ │ timeline. Mercury's      │ │
│ │ fiscal year ends in      │ │
│ │ September — if you don't │ │
│ │ get in the Q3 budget     │ │
│ │ cycle, you're waiting    │ │
│ │ until January."          │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 👤 You:                  │ │
│ │ "How should I handle the │ │
│ │ CFO blocker?"            │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🤖 Milton:               │ │
│ │ "You sure about that?    │ │
│ │ The CFO isn't the        │ │
│ │ blocker — it's the CRO   │ │
│ │ not having ROI data to   │ │
│ │ take upstairs. Build     │ │
│ │ the business case first."│ │
│ └──────────────────────────┘ │
│                              │
│ Milton has full session      │
│ context: ICP, brief, hypo,  │
│ discovery, gate answers      │
│                              │
│ ┌──────────────────────────┐ │
│ │ Ask Milton...         [▶]│ │
│ └──────────────────────────┘ │
└──────────────────────────────┘

Milton capabilities:
• Sales coaching & objection handling
• Deal strategy recommendations
• Framework application (RIVER, JOLT, Challenger)
• Scope-locked to GTM consulting (will redirect
  off-topic questions back to the app)
• Tim Robinson / ITYSL humor sprinkled in
```

---

## Admin Dashboard (SuperAdmin)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚙ ADMIN DASHBOARD                                       [× Close]    │
│                                                                         │
│  ┌──────┬────────┬──────────┬───────┬───────┬────────┬──────┬──────┐  │
│  │ Over │Pricing │Learnings │ Costs │ Users │Activity│Usage │ URLs │  │
│  │ view │        │          │       │       │        │      │      │  │
│  └──────┴────────┴──────────┴───────┴───────┴────────┴──────┴──────┘  │
│                                                                         │
│  OVERVIEW TAB:                                                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐              │
│  │ Users  │ │ Active │ │Sessions│ │ Tokens │ │  Orgs  │              │
│  │  47    │ │  12    │ │  234   │ │  1,847 │ │   8    │              │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘              │
│                                                                         │
│  PRICING TAB:                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Opus Usage Ratio: ████████░░░░░░ 75%                              │  │
│  │                                                                   │  │
│  │ Plan       │ Tokens/mo │ Max/mo │ Price  │ Margin                │  │
│  │ Trial      │    5      │   0    │  $0    │  —                    │  │
│  │ Starter    │   25      │   5    │  $49   │  62%                  │  │
│  │ Pro        │  100      │  20    │  $149  │  58%                  │  │
│  │ Team       │  250      │  50    │  $349  │  55%                  │  │
│  │ Enterprise │ 1000      │ 200    │ Custom │  —                    │  │
│  │                                                                   │  │
│  │ Revenue Projection:  10 users: $1,490/mo · 50: $7,450/mo         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  USERS TAB:                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ ┌────────────────────────────────────────────────────────────┐    │  │
│  │ │ 👤 Jane Smith · jane@acme.com                              │    │  │
│  │ │ Role: [rep ▾]  Org: [Acme Corp ▾]  Plan: [pro ▾]          │    │  │
│  │ │ Sessions: 12 · Last active: 2h ago · Tokens: 34/100       │    │  │
│  │ └────────────────────────────────────────────────────────────┘    │  │
│  │ ┌────────────────────────────────────────────────────────────┐    │  │
│  │ │ 👤 Bob Lee · bob@startup.io                                │    │  │
│  │ │ Role: [admin ▾]  Org: [Startup Inc ▾]  Plan: [starter ▾]  │    │  │
│  │ │ Sessions: 3 · Last active: 1d ago · Tokens: 8/25          │    │  │
│  │ └────────────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Organization Panel

```
┌──────────────────────────────────────┐
│  👥 Organization · Acme Corp  [×]    │
│                                      │
│  ┌────────┬──────────┬──────────┐    │
│  │Members │ Settings │ Sessions │    │
│  └────────┴──────────┴──────────┘    │
│                                      │
│  MEMBERS:                            │
│  ┌──────────────────────────────┐    │
│  │ 👤 Joe Galano · admin       │    │
│  │    12 sessions · Active now │    │
│  │                              │    │
│  │ 👤 Jane Smith · rep         │    │
│  │    8 sessions · 2h ago      │    │
│  │    [Change Role ▾] [Remove] │    │
│  │                              │    │
│  │ 👤 Pending: bob@co.com      │    │
│  │    Invited 2d ago · rep     │    │
│  │    [Resend] [Revoke]        │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Invite Team Member           │    │
│  │ Email: [________________]    │    │
│  │ Role:  [rep ▾]               │    │
│  │ [Send Invitation]            │    │
│  └──────────────────────────────┘    │
│                                      │
│  USAGE:                              │
│  Standard: ██████████░░ 34/100       │
│  Max:      ████░░░░░░░░  8/20        │
└──────────────────────────────────────┘
```

---

## Reports Panel

```
┌──────────────────────────────────────┐
│  📊 Reports · Acme Corp      [×]    │
│                                      │
│  ┌────────┬──────────┬─────┬─────┐  │
│  │Overview│ Sessions │Insi.│Usage│  │
│  └────────┴──────────┴─────┴─────┘  │
│                                      │
│  OVERVIEW:                           │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │Sessions│ │ Active │ │ Scored │   │
│  │  34    │ │   8    │ │  147   │   │
│  └────────┘ └────────┘ └────────┘   │
│                                      │
│  Deal Routing:                       │
│  ┌──────────────────────────────┐   │
│  │ 🟢 Fast Track:  42%          │   │
│  │ 🟡 Nurture:     38%          │   │
│  │ 🔴 Disqualify:  20%          │   │
│  └──────────────────────────────┘   │
│                                      │
│  INSIGHTS:                           │
│  Most corrected ICP fields:          │
│  1. Industries (23 edits)            │
│  2. Company Size (18 edits)          │
│  3. Buyer Personas (12 edits)        │
│                                      │
│  Intel adjustments applied: 34       │
│  Avg adjustment: +8.2 points        │
└──────────────────────────────────────┘
```

---

## Knowledge Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE LAYER (JWT-Protected)                       │
│                    Never in client bundle — fetched at runtime           │
│                                                                         │
│  ┌─ INDUSTRY VERTICALS (9 with scoring) ───────────────────────────┐   │
│  │                                                                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   │
│  │  │Payments  │ │Real      │ │Banking & │ │Healthcare│           │   │
│  │  │Processing│ │Estate    │ │Capital   │ │SaaS      │           │   │
│  │  │          │ │          │ │Markets   │ │          │           │   │
│  │  │ Injection│ │ Injection│ │ Injection│ │ Injection│           │   │
│  │  │ Scoring  │ │ Scoring  │ │ Scoring  │ │ Scoring  │           │   │
│  │  │ Discovery│ │ Discovery│ │ Discovery│ │ Discovery│           │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   │
│  │                                                                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   │
│  │  │AI/ML     │ │Fintech   │ │Rewards & │ │QSR /     │           │   │
│  │  │          │ │Deep      │ │Incentives│ │Restaurant│           │   │
│  │  │          │ │          │ │(Core)    │ │          │           │   │
│  │  │ Injection│ │ Injection│ │ Injection│ │ Injection│           │   │
│  │  │ Scoring  │ │ Scoring  │ │ Scoring  │ │ Scoring  │           │   │
│  │  │ Discovery│ │ Discovery│ │ Discovery│ │ Discovery│           │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   │
│  │                                                                  │   │
│  │  ┌──────────┐ ┌──────────┐                                      │   │
│  │  │BaaS /    │ │Charitable│                                      │   │
│  │  │Sponsor   │ │Giving /  │                                      │   │
│  │  │Banking   │ │DAFs      │                                      │   │
│  │  │ Injection│ │ Injection│                                      │   │
│  │  │ Scoring  │ │ Scoring  │                                      │   │
│  │  │ Discovery│ │ Discovery│                                      │   │
│  │  └──────────┘ └──────────┘                                      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ CROSS-CUTTING LAYERS (inject for all verticals) ───────────────┐   │
│  │  Accounting/Finance · B2B Sales · OKR/KPI · Investor Intel      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ COMPLIANCE (13 frameworks × 10 verticals) ─────────────────────┐   │
│  │  SOC 2 · ISO 27001 · FedRAMP · HIPAA · PCI DSS · GDPR          │   │
│  │  CCPA · OFAC · BSA/AML · UDAAP · Reg E · State MTL · FinCEN    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ VERTICAL PLAYBOOKS (15 verticals) ─────────────────────────────┐   │
│  │  AI · Cybersecurity · Fintech · Healthcare · Payments            │   │
│  │  Insurance · Real Estate · Legal · Martech · Education           │   │
│  │  Government · Manufacturing · Banking · QSR · Incentives         │   │
│  │  Each: keywords, personas, triggers, DQs, compliance, USPs      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ SALES FRAMEWORKS ─────────────────────────────────────────────┐    │
│  │  RIVER · JOLT · Challenger · Fisher-Ury · Voss · Cialdini       │   │
│  │  Graham · SPICED · Murphy RWAS · Dunford · Fitzpatrick          │   │
│  │  Moore Chasm · 6sense ABM · Laja CXL · Discovery Bank           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ SCORING & BATTLE CARDS ────────────────────────────────────────┐   │
│  │  Fit scoring rules · 5 archetype battle cards · Solution fit     │   │
│  │  Rep onboarding · QBR framework · Pricing negotiation            │   │
│  │  Post-sale expansion · Competitive injection                     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

Keyword-Based Activation:
  Each vertical has a keyword array + threshold.
  Layers activate when seller ICP or target industry matches.
  Example: "fintech" + "payments" → triggers Payments layer (2+ match)
  Cross-cutting layers inject unconditionally for all authenticated users.
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                                  │
│                                                                         │
│  ┌─ EDGE (Vercel) ─────────────────────────────────────────────────┐   │
│  │ • HSTS (max-age=63072000)                                       │   │
│  │ • X-Frame-Options: DENY                                         │   │
│  │ • CSP: default-src 'self' + whitelisted origins                 │   │
│  │ • Permissions-Policy: camera/mic/geo disabled                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ API (_guard.js) ───────────────────────────────────────────────┐   │
│  │ • JWT verification (HMAC-SHA256, issuer + expiry checks)        │   │
│  │ • Origin whitelist (cambriancatalyst.ai, localhost)              │   │
│  │ • Rate limiting: 60 req/min per IP                              │   │
│  │ • Input size cap: 50KB                                          │   │
│  │ • Tool whitelist: web_search only (max 3 uses)                  │   │
│  │ • Model whitelist: Haiku, Sonnet, Opus only                     │   │
│  │ • Guest mode: 3 lifetime calls per IP                           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ PROMPT SECURITY ───────────────────────────────────────────────┐   │
│  │ • sanitizeForPrompt(): NFKC normalization + 7 regex layers      │   │
│  │ • sanitizeWebResult(): Indirect injection prevention            │   │
│  │ • temperature: 0 + top_k: 1 (consistency enforcement)           │   │
│  │ • Milton scope lock (10 absolute rules)                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ DATA ISOLATION ────────────────────────────────────────────────┐   │
│  │ • Supabase RLS: org-scoped data access                          │   │
│  │ • Knowledge layer: JWT-gated, never bundled in client JS        │   │
│  │ • Guest mode: empty stubs (no proprietary data exposed)         │   │
│  │ • Service key: server-side only (billing, admin)                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Billing & Usage Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BILLING MODEL                                  │
│                                                                         │
│  Token = 1 AI interaction (brief generation, hypothesis, scoring)      │
│                                                                         │
│  ┌───────────┬──────────┬──────────┬─────────┬──────────────────────┐  │
│  │ Plan      │ Tokens   │ Max      │ Price   │ Target               │  │
│  │           │ /month   │ /month   │ /month  │                      │  │
│  ├───────────┼──────────┼──────────┼─────────┼──────────────────────┤  │
│  │ Trial     │    5     │    0     │  Free   │ Individual eval      │  │
│  │ Starter   │   25     │    5     │  $49    │ Solo AE              │  │
│  │ Pro       │  100     │   20     │  $149   │ Sales team (3-5)     │  │
│  │ Team      │  250     │   50     │  $349   │ Sales org (10+)      │  │
│  │ Enterprise│ 1000     │  200     │ Custom  │ Revenue org          │  │
│  └───────────┴──────────┴──────────┴─────────┴──────────────────────┘  │
│                                                                         │
│  Standard tokens: Haiku model (fast, cost-effective)                   │
│  Max tokens: Opus model (deeper analysis, premium)                     │
│                                                                         │
│  Cost basis per token (blended):                                       │
│  • Standard (Haiku): ~$0.08-0.15/token                                 │
│  • Max (Opus): ~$1.50-2.50/token                                       │
│  • Web searches: ~$0.01/search (included)                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│  FRONTEND          │  BACKEND           │  DATA & AUTH                  │
│                    │                    │                              │
│  React 19         │  Vercel Serverless │  Supabase (PostgreSQL)       │
│  Vite 6           │  Node.js runtime   │  JWT auth (ES256/HS256)      │
│  Single SPA       │  7 API routes      │  Row-Level Security          │
│  ~10K LOC         │  _guard middleware  │  6 tables                    │
│  4 components     │  _usage billing    │  3 SQL functions             │
│  Custom CSS       │                    │                              │
│  Lora + DM Sans   │                    │                              │
├────────────────────┼────────────────────┼──────────────────────────────┤
│  AI               │  KNOWLEDGE         │  SECURITY                    │
│                    │                    │                              │
│  Claude (Anthropic)│  34 data files     │  HSTS + CSP + X-Frame       │
│  Haiku (default)  │  18 verticals      │  Rate limiting (60/min)      │
│  Sonnet (fallback)│  13 compliance     │  Origin whitelist            │
│  Opus (Max tier)  │  15 playbooks      │  Input sanitization          │
│  web_search tool  │  10 sales methods  │  Prompt injection defense    │
│  9-phase gen      │  9 scoring calibs  │  Knowledge layer isolation   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Differentiators (Investor Pitch Points)

1. **Proprietary Knowledge Layer** — 18 industry verticals with calibrated scoring, discovery questions, and compliance mapping. Protected by JWT, never exposed to client.

2. **RIVER Framework** — Structured sales methodology (Reality → Impact → Vision → Entry Points → Route) with real-time in-call capture and AI-powered post-call routing.

3. **9-Phase Brief Generation** — Progressive rendering of company intelligence across overview, executives, strategy, solutions, live signals, roles, financials, competitive landscape, and M&A signals.

4. **Cross-Vertical Intelligence** — Keyword-based injection activates the right vertical knowledge automatically. A fintech company selling to healthcare gets BOTH fintech seller context AND healthcare buyer context.

5. **Milton AI Coach** — Persistent coaching panel with full session context, scope-locked to GTM consulting, with personality (Tim Robinson humor).

6. **Enterprise-Ready Security** — JWT auth, RLS, CSP, rate limiting, prompt injection defense, knowledge layer isolation. Fortune 100 CTO/CIO-grade.

7. **Tiered Pricing Model** — Free trial → Self-serve → Enterprise. Token-based usage with standard (Haiku) and premium (Opus) tiers. 55-65% gross margins.

---

*Document generated 2026-05-01 · Cambrian Catalyst LLC · Seattle, WA*
