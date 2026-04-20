# Knowledge Layer — Cambrian Catalyst RIVER Playbook

**Version:** v108-security-perf
**Last updated:** 2026-04-20
**Served from:** `/api/knowledge.js` (JWT-authenticated, not in client bundle)

---

## 1. Negotiation & Sales Frameworks (13 total)

### 1a. Voss — Never Split the Difference (FBI)
**Stage:** In-Call (S7), Discovery, Hypothesis
**Tactics:**
| Tactic | Definition | Sales Application |
|--------|-----------|-------------------|
| Tactical Empathy | Understand and articulate the other side's perspective before advancing your own | Reflect back exactly what the prospect said about their pain — word for word |
| Mirroring | Repeat the last 1-3 words someone said as a question | When a prospect says something important, mirror it back. They will almost always expand |
| Labeling | Identify and name the emotion or dynamic you're observing | "It seems like there's some concern about whether this would actually stick this time." Then go silent |
| Calibrated Questions | Open-ended 'How' and 'What' questions | Never ask yes/no questions in discovery. Examples: "What does success look like?", "How does this decision typically get made?", "What's the biggest risk you see?" |
| Accusation Audit | List every negative thing the prospect might think about you before they say it | "You're probably thinking this is another vendor pitch that doesn't understand your business. Fair." |
| No-Oriented Questions | Ask questions designed to get a 'No' — makes prospects feel safe | "Is this a ridiculous idea?", "Have you given up on solving this?", "Is it crazy to think we could get this done by Q3?" |

**Prompt injection:**
```
VOSS (Never Split the Difference — FBI):
- ALL questions start with "How" or "What" — never yes/no
- Tactical empathy: name their emotion before advancing agenda
- Mirror: repeat last 3 words as question to get elaboration
- Label: "It seems like..." or "It sounds like..." to diffuse tension
- Accusation Audit: name their objections before they raise them
- No-oriented: "Is now a bad time?" not "Is now a good time?"
```

### 1b. Fisher/Ury — Getting to Yes (Harvard)
**Stage:** Post-Call (S8), Hypothesis, SA Review, Transcript Analysis
**Tactics:**
| Tactic | Sales Application |
|--------|-------------------|
| Separate People from Problem | When a prospect pushes back, acknowledge their perspective before defending |
| Focus on Interests Not Positions | "Help me understand what's driving that number — is it budget ceiling, or risk reduction?" |
| Invent Options for Mutual Gain | Phased rollout, pilot, success-based pricing when stuck |
| BATNA | Make cost of status quo vivid and measurable |
| Objective Criteria | Reference benchmarks: "Gartner puts average spend at $85K for your size — we're below that" |

**Prompt injection:**
```
FISHER/URY (Getting to Yes — Harvard):
- Separate people from problem
- Surface interests not positions: "What is driving that number?"
- BATNA: make cost of status quo vivid and measurable
- Objective criteria: use benchmarks to resolve price disputes
- Invent options: pilot, phased, success-based when stuck
```

### 1c. Cialdini — Influence
**Stage:** Brief p3, Hypothesis
**Principles:**
| Principle | Sales Application |
|-----------|-------------------|
| Reciprocity | Give value before asking — insight, benchmark, case study unprompted |
| Commitment & Consistency | Get small yeses early. Each agreement makes the next easier |
| Social Proof | Name similar companies who solved this same problem. Specificity matters |
| Authority | Establish expertise early — data, specific industry knowledge, named clients |
| Liking | Find genuine common ground. Mirror their language and pace |
| Scarcity | Real deadlines only — regulatory dates, budget cycles, competitive threat. Never fake urgency |

**Prompt injection:**
```
CIALDINI (Influence):
- Reciprocity: give specific insight before asking for anything
- Social Proof: name similar company (same industry + size) who solved this
- Authority: open with precise stat most people in their industry don't know
- Commitment: get small yeses early
- Scarcity: use REAL deadlines only — regulatory, budget cycle, competitive
```

### 1d. Sun Tzu — Art of War (adapted for sales)
**Stage:** Fit Scoring (S3), Brief (S5), Hypothesis
**Principles:**
| Principle | Sales Application |
|-----------|-------------------|
| Know yourself and know your enemy | Before every call: know your BATNA, their BATNA, their alternatives, their budget cycle |
| Supreme excellence: subdue without fighting | Win by making status quo untenable — don't attack competitors directly |
| Be like water — adapt to terrain | Match pitch to buyer's Moore adoption profile |
| Foreknowledge from people, not spirits | Live intelligence beats any brief |
| Attack where unprepared | Find the underserved stakeholder, go around the gatekeeper |
| Speed is the essence of war | Long sales cycles kill deals. Compress with pilots, phased starts |

**Prompt injection:**
```
SUN TZU (Art of War):
- Know yourself and your enemy before every call
- Make status quo untenable — do not attack competitors directly
- Adapt to their Moore adoption profile — be like water
- Find the underserved stakeholder, not the gatekeeper
- Recommend smallest possible first step — speed kills deals
```

### 1e. JOLT Effect — Dixon & McKenna
**Stage:** Hypothesis (Route), Talk Tracks
**Core insight:** Indecision kills 40-60% of B2B deals. FOMU (Fear of Messing Up) beats FOMO.
| Step | Action | Description |
|------|--------|-------------|
| J | Judge the indecision | Name the FOMU explicitly: "It sounds like the risk of getting this wrong is scarier than not solving it" |
| O | Offer your recommendation | Give ONE clear POV — not options. Options create indecision |
| L | Limit the exploration | Narrow scope to make decision smaller: "Let's start with just X" |
| T | Take risk off the table | Pilot, SLA, phased rollout, reference customer, money-back |

### 1f. Challenger Customer — CEB/Gartner
**Stage:** Brief p3, Hypothesis
- **Mobilizer definition:** Only 13% of stakeholders are Mobilizers — they ask "how do we make this happen?"
- **Identify:** They ask 'how do we make this happen?' not 'interesting, let me think about it'
- **Not Mobilizers:** Talkers (share info but can't move deals), Blockers (actively oppose change)
- **Teaching angle:** Challenge a widely-held assumption about their industry using data or a case study they haven't seen

### 1g. Graham — Intelligent Investor (adapted)
**Stage:** Post-Call (S8), SA Review (S9), Transcript Analysis
| Principle | Sales Application |
|-----------|-------------------|
| Margin of Safety | Only pursue deals where value delivered is 3-5x the price |
| Mr. Market | Prospects' stated budget is emotional. Help them see rational value case |
| Investment vs Speculation | Position solution as investment with compounding returns |
| Know What You Own | Disqualify fast if prospect doesn't understand the problem you solve |

**Prompt injection:**
```
GRAHAM (Intelligent Investor — adapted):
- Margin of safety: only pursue deals where value is 3-5x the price
- Separate value case from price discussion
- Position as investment with compounding returns
- Disqualify fast if prospect does not understand the problem you solve
```

### 1h. Crucial Conversations — Patterson, Grenny, McMillan, Switzler
**Stage:** Discovery, In-Call (S7)
| Tactic | Application |
|--------|-------------|
| Start with Heart | Before a difficult call: write down the ONE outcome you want |
| Watch for Safety Issues | Signals: long pauses, short clipped answers, sudden aggression, topic changes |
| STATE My Path | Share facts, Tell story, Ask their path, Talk tentatively, Encourage testing |
| Explore Their Path | Ask, Mirror, Paraphrase, Prime — understand before being understood |

**Safety response:** "It seems like I may have said something that didn't land right — can we step back?"

### 1i. Mom Test — Fitzpatrick
**Stage:** Discovery, Talk Tracks
- Ask about PAST BEHAVIOR and REAL PROBLEMS
- Never about your product or hypothetical futures
- "How did you handle this last quarter?" not "Would you use a tool that...?"

### 1j. Ellis 40% Rule
**Stage:** Discovery, Fit Scoring
- Must-have test: "If you had to go back to how you handled this 18 months ago, what would that mean?"
- If <40% of team would be "very disappointed" → nice-to-have, not must-have
- Critical disqualifying signal

### 1k. Dunford — Obviously Awesome
**Stage:** Brief p4, Solution Mapping
- Market Category positioning
- Competitive Alternatives identification
- Unique Differentiators — what you do that no one else can

### 1l. Osterwalder — Value Proposition Canvas
**Stage:** Brief p4, Solution Mapping
- Job-to-be-done mapping (Functional, Emotional, Social)
- Pain identification and relief
- Gain creation and measurement

### 1m. DMAIC (Six Sigma)
**Stage:** SA Review (S9), In-Call (S7), Hypothesis
| Stage | RIVER Mapping | Meaning |
|-------|--------------|---------|
| Define | Reality | Identify the problem |
| Measure | Reality | Quantify current state |
| Analyze | Impact | Root cause analysis |
| Improve | Vision | Implement solution |
| Control | Route | Sustain and scale |

---

## 2. Fit Scoring Heuristics

### 2a. High-Friction Industries (early-stage sellers score poorly)
*Source: ~4,600 YC companies x 1,150 enterprise targets*

| Industry | Avg Fit % | Reason |
|----------|-----------|--------|
| Heavy Manufacturing / Automotive | 5.9% | Unionized workforce, entrenched ERP |
| Aerospace & Defense Prime | 5.8% | ITAR, security clearance, FedRAMP required |
| Telecom Incumbents | 6.1% | Unionized, 5-deep incumbent stack |
| Energy — Oil & Gas | 11.3% | Culture mismatch, union risk |
| Energy — Utilities | 13.4% | Unionized, regulatory lock-in |
| Mass-Market Retail >100K employees | 13.6% | Hardened procurement, low tolerance for novelty |
| Top-5 US Banks | 12.6% | Deep incumbents, RFP-gated procurement |

### 2b. High-Fit Segments (underserved by startups)

| Industry | Avg Fit % | Examples |
|----------|-----------|----------|
| Large Private Insurance/Finance | 65.2% | State Farm, TIAA, Nationwide |
| Large Private Tech/Data/Media | 64.5% | Bloomberg, Valve, SAS |
| Large Private Professional Services | 63.3% | Deloitte US, EY, KPMG |
| Insurance (P&C / Life / Specialty) | 62.5% | Allstate, Progressive, Travelers |
| CPG — Personal Care / Beauty | 61.9% | P&G, Kimberly-Clark, Estee Lauder |
| Regional / Community Banks | 59.5% | 85 Fortune-1000 targets, widely ignored |
| Healthcare IT / Digital Health | 54.9% | — |

### 2c. Stage Thresholds

| Seller Stage | Avg Fit % | Note |
|-------------|-----------|------|
| Seed | 23.7% | Zero viable direct enterprise paths |
| Series A | 33.6% | Niche targeting only |
| Series B | 41.8% | Departmental landing only |
| Series C | 49.0% | First real enterprise traction |
| Series D+ | 55.6% | Full enterprise motion viable |

### 2d. Buying Signals

**Positive:**
- Recent funding <12 months = 18-month buying window (+8pts)
- PE acquisition <18 months = cost mandate + 60-90 day budget cycle
- Private vs public equivalent (+5-8pts)
- Hiring "Digital Transformation" = Early Majority
- Hiring "Innovation/R&D" = Early Adopter

**Negative:**
- >200K employees and seller is Seed/Series A = procurement barrier (-15pts)
- >50% union/hourly workforce (-20pts)

### 2e. Scoring Dimensions

| Dimension | Weight | Criteria |
|-----------|--------|----------|
| ICP Alignment | 40% | Industry match, size, ownership, stage compatibility |
| Customer Similarity | 30% | How similar to seller's named customers |
| Competitive Landscape | 30% | Incumbent vendor, switching cost, displacement opportunity |

### 2f. Score Bands

| Score | Label | Meaning |
|-------|-------|---------|
| 75-100 | Strong Fit | Clear ICP match, buyer accessible, reasonable cycle |
| 55-74 | Potential Fit | Partial match, needs specific angle |
| 0-54 | Poor Fit | Structural barrier (wrong size, industry, incumbent lock) |

---

## 3. ICP Framework & Enums

### 3a. ICP Frameworks Applied
| Framework | Elements Used |
|-----------|-------------|
| Revella | Priority Initiative, Success Factors, Perceived Barriers, Decision Criteria, Buyer Journey |
| Osterwalder | Functional/Emotional/Social Jobs, Pains, Gains |
| Dunford | Market Category, Competitive Alternatives, Unique Differentiators |
| Moore | Innovators, Early Adopters, Early Majority, Late Majority |
| Weinberg | 19 traction channels ranked by buyer profile |

### 3b. Anchored Enum Buckets (prevents drift between runs)
| Field | Options |
|-------|---------|
| Company Size | 1-49 employees, 50-499, 500-4,999, 5,000-49,999, 50,000+ |
| Revenue Range | <$10M, $10M-$100M, $100M-$1B, $1B-$10B, $10B+ |
| Deal Size | <$10K ACV, $10K-$50K, $50K-$250K, $250K-$1M, $1M+ |
| Sales Cycle | <30 days, 30-60, 60-90, 90-180, 180+ |
| Adoption Profile | Innovator, Early Adopter, Early Majority, Late Majority |
| Ownership Types | VC-backed private, PE-backed private, Public, Privately-held, Bootstrapped |
| Geographies | North America, EMEA, APAC, LATAM, Global |

---

## 4. RFP Intelligence Sources

### 4a. USA
| Source | URL | Coverage | Signal Value |
|--------|-----|----------|-------------|
| SAM.gov | sam.gov | All federal opportunities >$25K | HIGH |
| FPDS-NG | fpds.gov | All awarded federal contracts since 1993 | HIGH |
| USASpending.gov | usaspending.gov | All federal spending — contracts, grants, loans | HIGH |
| DemandStar | demandstar.com | State, local, municipal RFPs — all 50 states | MED |

### 4b. Europe
| Source | URL | Coverage | Signal Value |
|--------|-----|----------|-------------|
| TED — Tenders Electronic Daily | ted.europa.eu | All EU+EEA — 27 countries, ~700 notices/day | HIGH |
| Find a Tender (UK) | find-tender.service.gov.uk | UK public sector post-Brexit | HIGH |
| Contracts Finder (UK) | contractsfinder.service.gov.uk | UK contracts >10K/25K | MED-HIGH |

### 4c. Latin America
| Source | URL | Coverage |
|--------|-----|----------|
| CompraNet (Mexico) | compranet.hacienda.gob.mx | Mexican federal procurement |
| Mercado Publico (Chile) | mercadopublico.cl | Chilean public procurement |
| SEACE (Peru) | seace.gob.pe | Peruvian public procurement |
| SICE (Colombia) | colombiacompra.gov.co | Colombian procurement |
| UNOPS | unops.org | UN-funded projects |

### 4d. Asia Pacific
| Source | URL | Coverage |
|--------|-----|----------|
| AusTender (Australia) | tenders.gov.au | Australian federal procurement |
| GeBIZ (Singapore) | gebiz.gov.sg | Singapore government |
| GETS (New Zealand) | gets.govt.nz | NZ government |
| MERX (Canada) | merx.com | Canadian federal + provincial |

### 4e. Global / Multilateral
| Source | URL | Coverage |
|--------|-----|----------|
| World Bank | projects.worldbank.org | $50B+/year globally |
| UNGM | ungm.org | All UN agency procurement |
| IFC / ADB / IDB | ifc.org | Development finance |
| RFPMart | rfpmart.com | Global aggregator |

### 4f. NAICS Codes (USA — SAM.gov)
| Category | Codes |
|----------|-------|
| Fintech/Payments | 522320, 522390, 523130, 523999 |
| SaaS/Software | 511210, 541511, 541512, 541519 |
| AI/ML | 541715, 541511, 541512 |
| Data Analytics | 541511, 541519, 518210 |
| Compliance/RegTech | 541611, 541690, 522320 |
| Digital Rewards | 541613, 541810, 454111 |
| Healthcare IT | 621111, 621610, 541512 |
| HR/Workforce | 561311, 541612, 561320 |

### 4g. CPV Codes (EU — TED)
| Category | Codes |
|----------|-------|
| Fintech/Payments | 66000000, 66100000, 66110000, 72000000 |
| Digital Rewards/Incentives | 79342200, 79342300, 72212000 |
| SaaS/Software | 72000000, 72200000, 72260000, 48000000 |
| AI/ML | 72212000, 72316000, 48311000 |
| Data Analytics | 72316000, 72300000, 72322000 |
| Compliance/RegTech | 79100000, 72316000, 66171000 |
| Healthcare IT | 72000000, 85000000, 72212000 |
| HR/Workforce | 79600000, 72512000, 79212000 |

---

## 5. Universal Business Imperatives

Every company universally wants these — injected as baseline context even when not explicitly stated by the user.

| ID | Icon | Title | Sub |
|----|------|-------|-----|
| grow | chart | Grow | Revenue, new logos, market share, pipeline |
| expand | globe | Expand | Existing customers, new geos, new segments |
| comply | scales | Stay Compliant | Regulatory mandates, audit readiness, risk reduction |
| fraud | lock | Reduce Fraud & Risk | Financial exposure, trust protection, data integrity |
| investors | briefcase | Appease Investors | IRR, EBITDA, multiples, board narrative |
| cx | heart | Make Customers Happy | NPS, CSAT, retention, loyalty, churn reduction |
| efficiency | cycle | Operational Efficiency | Automation, cost reduction, process improvement |
| workforce | star | Workforce & Talent | HR ops, engagement, retention |
| ai | diamond | Data & AI Adoption | Analytics, AI tooling, automation |
| brand | star | Brand & Marketing | Awareness, loyalty, demand generation |
| cost | minus | Cost Reduction | Overhead, vendor consolidation, margin improvement |
| innovation | diamond | Innovation & Product | New product lines, R&D, speed to market |
| transform | diamond | Strategic Transformation | Org change, M&A integration, modernization |

---

## 6. RIVER Framework (In-Call Structure)

| Stage | Letter | Sub | Gates | Discovery Prompts |
|-------|--------|-----|-------|-------------------|
| Reality | R | Current state — where are they broken? | Current handling (5 options), Urgency (6 options), Must-have test (4 options) | Core pain (verbatim), What they've tried |
| Impact | I | What does this cost them? | Cost quantified (4 options), Who feels pain (6 options) | Measurable cost of inaction, Softer costs |
| Vision | V | What does success look like? | Can articulate 90-day success (4 options), Internal champion (4 options) | Success at Day 30/90/Year 1, Champion detail |
| Entry Points | E | Who decides, who influences? | Economic buyer (4 options), Threading count (5 options), Decision process (5 options) | Buying committee map, Decision timeline |
| Route | R | Fastest path to yes | Honest deal assessment (5 options), Biggest risk (7 options) | Single most important next step, Onboarding vision |

Each stage also includes:
- Talk track (opening line)
- 2 objection handlers with suggested responses
- 2 AI-generated sales discovery questions (framework-tagged)
- 2 AI-generated architecture discovery questions (SA lens-tagged)

---

## 7. Proof Pack Rules (9 rules)

These rules are injected into every prompt that uses the seller proof pack:

1. Cite a SPECIFIC named customer whenever you claim "we've done this before." Never invent customer names.
2. Use unique differentiators to justify "why us" — never assert generic capabilities.
3. Frame outcomes using success factors — concrete, measurable, the customer's language.
4. Quote from uploaded docs verbatim when they contain relevant proof.
5. Use ONLY products from the catalog — do NOT invent product names.
6. If you cannot ground a claim, flag as "[unsupported — verify with seller]".
7. Customer should feel deeply understood — everyone wins with measurable outcomes.
8. NEVER INVENT STATISTICS ABOUT THE SELLER. No fabricated customer counts, revenue, market share. Only cite verified numbers. Describe qualitatively if no number available.
9. NEVER INVENT FACTS ABOUT THE TARGET COMPANY. No fabricated revenue, employees, executives, products, partnerships. Use empty string for genuinely unknown facts.

---

## 8. Architecture Discovery Frameworks (SA Track)

| Framework | Focus | Questions Target |
|-----------|-------|-----------------|
| Rajput | Business-to-digital alignment | Does the solution map to a real business outcome? |
| McSweeney | Stakeholder alignment | Who configures, owns budget, can veto? |
| Richards/Ford | Architecture quality attributes | Scalability, security, observability, maintainability |
| Fowler | Integration patterns | Point-to-point, hub-and-spoke, event-driven |
| DMAIC maturity | Operational curve | Where are they on Define/Measure/Analyze/Improve/Control? |
| Pilot scoping | Smallest proof | 30-day meaningful slice |
| Adjacent-system risk | Coexistence | What tools need to coexist, replace, or hand off? |

---

## 9. Segment-Specific Selling Notes

| Segment | Key Notes |
|---------|-----------|
| Private Insurance (State Farm, Allstate) | Relationship first, compliance confidence before features, reference check culture, no artificial urgency |
| Regional Banks (US Bank, PNC, Truist) | Regulatory fluency required (BSA/AML/OCC), pilot-friendly, IT+InfoSec are hidden veto players |
| Private Professional Services (Deloitte, EY) | They know selling — be precise, focus on making THEIR delivery better, partner-level buy-in needed |
| Large Private Tech (Bloomberg, SAS) | Technical depth expected, security posture upfront, fast decisions if champion is right level |
| PE Seller + SMB | Vertical SaaS PE + matched SMB vertical = 95% fit. Healthcare practices + Insurance agencies are top verticals. MSP channel preferred for <250-employee accounts |

---

## 10. Qualification Signals

- Referral/partner deals close 30%+ higher
- Funding <12 months = 18-month buying window
- Single-threaded prospect = 3x churn risk
- SMB: 30-45 day cycles
- Mid-market: 60-90 day cycles
- Enterprise: 90-180 day cycles
- Ellis 40% must-have test is the critical qualifier
- Gartner: buyers spend only 17% of time with vendors
