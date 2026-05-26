// src/data/smbMidmarketKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// SMB & Mid-Market cross-cutting knowledge layer.
// Covers: segment definitions, buying patterns by company size,
// PE-backed company dynamics, discovery calibration, information
// asymmetry, embedded finance posture, trigger events,
// owner-operator dynamics, channel selling, referral-driven adoption.
//
// This is NOT a vertical — it's a SIZE layer that modifies how
// every vertical's intelligence should be calibrated. A bank
// with 200 employees buys differently than one with 20,000.
//
// SOURCES:
// - National Center for the Middle Market (NCMM), Ohio State Fisher
// - SBA Office of Advocacy (SMB count / share of businesses)
// - GTIA (CompTIA) 2025, SMB tech buying behavior
// - GF Data (PE mid-market valuation multiples, H1 2025)
// - Bain Global PE Report 2025 (PE dry powder, deal dynamics)
// - Embedded finance market projections (Lightyear Capital / Bain)
// - US Census Bureau Annual Business Survey 2024
// - SCORE / Guidant Financial Small Business Survey 2025
// - OpenView SaaS Benchmarks 2025
// - Cambrian operator knowledge (segment definitions, buying patterns)
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const SMB_MIDMARKET_INJECTION = `
---
title: "SMB & Mid-Market — Knowledge Layer"
type: cross_cutting_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_b2b_sales_knowledge.md
  - cambrian_investor_intelligence.md
  - cambrian_compliance_knowledge.md
  - cambrian_approval_gates_knowledge_layer.md
tags: [SMB, mid-market, owner-operator, channel-selling, referral, PLG, PE-backed, procurement, founder-led, cash-flow]
last_updated: 2026-05-21
status: production
confidence: high (NCMM, SBA, GTIA/CompTIA, GF Data, Bain, Census Bureau, Cambrian operator knowledge)
---

# SMB & Mid-Market — Knowledge Layer

> **Working thesis.** The ~33.2M small businesses and ~200,000 mid-market firms in the U.S. represent a $10T+ revenue segment that buys technology fundamentally differently from enterprise. The core distinction is not size but *buyer complexity*: a 50-person SaaS with a procurement function buys more like enterprise, while a 500-person manufacturer with a single CFO deciding everything buys more like SMB. For Cambrian's seller-users, the SMB/mid-market calibration changes everything — discovery questions, pricing presentation, contract structure, reference selling, and the timeline between first contact and close. Getting the segment wrong means misaligning the entire GTM motion.

> **What makes this segment distinct as a sales target.** In enterprise, the sale is won by navigating the buying committee. In SMB, the sale is won or lost in the first 5 minutes based on whether the seller respects the buyer's time, understands their cash-flow reality, and can demonstrate value without a 90-day POC. Mid-market sits in between — formal enough to have stakeholders, informal enough that a strong champion can pull a deal through. The unifying truth: speed, simplicity, and proof from peers matter more than features, customization, or analyst reports. These buyers don't read Gartner. They read G2 reviews, ask their accountant, and check Reddit.

---

## Table of Contents

1. [Snapshot and market sizing](#1-snapshot-and-market-sizing)
2. [What makes this distinct as a sales target](#2-what-makes-this-distinct-as-a-sales-target)
3. [Sub-categorization](#3-sub-categorization)
4. [Major companies serving SMB/mid-market](#4-major-companies-serving-smbmid-market)
5. [Regulatory overlay](#5-regulatory-overlay)
6. [Technology stack](#6-technology-stack)
7. [ICP patterns](#7-icp-patterns)
8. [Buying committee](#8-buying-committee)
9. [Trigger events](#9-trigger-events)
10. [Common failure modes](#10-common-failure-modes)
11. [GTM implications](#11-gtm-implications)
12. [Cross-references](#12-cross-references)

---

## 1. Snapshot and market sizing

| Metric | Value |
|---|---|
| Total U.S. small businesses | ~33.2M (99.9% of all U.S. businesses) [verified 05/2026, SBA Office of Advocacy] |
| SMBs with employees | ~6.1M (the rest are non-employer / sole proprietor) [verified 05/2026, SBA Office of Advocacy] |
| U.S. mid-market firms ($10M-$1B revenue) | ~200,000 [verified 05/2026, NCMM] |
| Mid-market collective revenue | $10T+ (~1/3 of private sector GDP) [verified 05/2026, NCMM Middle Market Indicator] |
| Mid-market employees | 48M [verified 05/2026, NCMM] |
| Mid-market revenue growth (2025) | 10.7% YoY (down from 12.9% peak) [verified 05/2026, NCMM Middle Market Indicator Q4 2025] |
| Mid-market employment growth (2025) | 7.3% [verified 05/2026, NCMM] |
| SMB IT spending growth | 9.8% [verified 05/2026, GTIA/CompTIA IT Industry Outlook 2025] |
| SMB annual tech spend range | $25K-$1M for 2/3 of SMBs [verified 05/2026, GTIA 2025] |
| SMB top concern | Inflation, economic uncertainty, trade policy, talent, cybersecurity [verified 05/2026, NCMM / SCORE 2025] |
| Mid-market PE M&A average multiple | ~7.0x EV/EBITDA (lower mid-market) [verified 05/2026, GF Data H1 2025] |

### Headline dynamics (use these in conversation)

- **If U.S. mid-market were a standalone economy, it would be the 5th largest in the world** [verified 05/2026, NCMM] — this reframes "mid-market" from "too small for enterprise" to "the backbone of the economy"
- **80%+ of SMB tech evaluation happens online before any vendor contact** [verified 05/2026, GTIA 2025] — reps are NOT the primary channel; content, reviews, and peer recommendations drive selection
- **54% of mid-market companies added headcount in mid-2025** [verified 05/2026, NCMM] — hiring = buying; new headcount creates tooling demand
- **87% of SMBs considering integrated financial software** [verified 05/2026, Sage SMB Finance Survey 2025] — finance is the most active SMB buying category
- **$111B embedded finance revenue in 2024, projected $1.4T opportunity** [verified 05/2026, Lightyear Capital / Bain 2024] — SMBs are both buyers and distributors of embedded financial services

---

## 2. What makes this distinct as a sales target

Three dynamics shape every SMB/mid-market sale:

**1. The owner-operator IS the decision-maker, budget holder, AND user.** In enterprise, you sell to a committee. In SMB, you sell to one person who will both sign the check and use the product daily. This collapses the entire buying process into a single relationship — but it also means one bad interaction kills the deal. There is no "escalation path" when the founder says no.

**2. Cash flow sensitivity overrides feature comparison.** An SMB owner evaluating a $500/month tool is not comparing features to competitors. They're comparing that $500 to hiring a part-time employee, to their rent increase, to their quarterly tax payment. Every dollar is personal money to an owner-operator. Pricing transparency, monthly billing, and easy cancellation are not nice-to-haves — they're prerequisites. Multi-year contracts and hidden fees are deal-killers.

**3. Speed beats features, every time.** An SMB owner who can see value in a free trial within 48 hours will buy. An SMB owner who needs a 30-day POC, three demo calls, and a custom implementation plan will ghost you. The winning formula: sign up in 5 minutes, see value in 48 hours, go live in 2 weeks. Enterprise-grade onboarding processes repel SMB buyers.

---

## 3. Sub-categorization

| Segment | Revenue | Employees | Decision pattern | Cycle length |
|---|---|---|---|---|
| **Micro / sole proprietor** | <$1M | 0-10 | Owner decides alone; impulse-buy capable | Minutes to days |
| **Small business (SMB)** | $1M-$10M | 10-100 | Owner + maybe 1 trusted advisor (accountant, office manager) | Days to weeks |
| **Lower mid-market** | $10M-$50M | 100-300 | Function-head decisions, CFO sign-off on $10K+ | 3-6 months |
| **Core mid-market** | $50M-$500M | 300-1,000 | VP + cross-functional + CFO, 3-7 stakeholders | 4-8 months |
| **Upper mid-market** | $500M-$1B+ | 1,000-2,500 | Buying committees, formal procurement, C-suite sponsorship | 6-12 months |
| **Enterprise** | $1B+ | 2,500+ | 6-25 stakeholder committees, 6.5 month average (up from 4.9 in 2019) | 6-18 months [verified 05/2026, Gartner Future of Sales 2025] |

### Sub-segments by ownership type

| Ownership | Buying behavior | Key dynamic |
|---|---|---|
| **Founder-led / bootstrapped** | Cash-conscious, relationship-driven, loyal when earned | Will pay premium for vendors who understand their business |
| **VC-backed** | Growth-focused, willing to spend for speed, metrics-oriented | Growth rate > profitability; NRR and ARR growth are the metrics |
| **PE-backed** | EBITDA-driven, initiative-based, 100-day plan urgency | Operating partner may influence; portfolio-wide solutions preferred |
| **Family-owned / multi-generational** | Conservative, relationship-first, slow to change | Referral from trusted advisor (accountant, attorney, banker) is the entry point |
| **Franchise** | Constrained by franchisor-approved vendor lists | Must sell to franchisee AND navigate franchisor approval |

### Sub-segments by industry vertical

- **Professional services** (law, accounting, consulting): Relationship-driven, partner-model buying, billable-hour sensitivity
- **Trades / field services** (HVAC, plumbing, electrical, construction): Mobile-first, crew management, job costing
- **Retail / e-commerce**: Omnichannel, inventory, POS integration, seasonal cash flow
- **Healthcare practices**: Compliance-heavy, patient data, insurance billing
- **Restaurants / hospitality**: High turnover, thin margins, POS-centric
- **Manufacturing**: MRP/ERP-dependent, long purchasing cycles, quality management

---

## 4. Major companies serving SMB/mid-market

### Horizontal SMB platforms

| Company | Focus | Key facts |
|---|---|---|
| **Gusto** | Payroll, HR, benefits for SMB | 300K+ businesses; strongest in sub-100 employee companies; the default SMB payroll platform for startups [verified 05/2026, Gusto company data] |
| **Rippling** | Unified HR, IT, finance platform | $13.4B valuation (2024); fastest-growing SMB/mid-market platform; "employee system of record" positioning; aggressive enterprise push [verified 05/2026, Rippling funding data / Forbes] |
| **Squarespace** | Website, e-commerce, scheduling | Went private via Permira acquisition (2024); 4.6M+ subscribers; dominant in creative/professional services SMB [verified 05/2026, Squarespace / Permira press release] |
| **Shopify** | E-commerce platform | $8.9B revenue (2025); 4.7M+ merchants globally; expanding into B2B and enterprise; Shopify POS for physical retail [verified 05/2026, Shopify 10-K 2025] |
| **Intuit (QuickBooks)** | Accounting, payroll, payments | 7.2M+ QuickBooks Online subscribers; the de facto SMB financial operating system [verified 05/2026, Intuit 10-K FY2025] |

### Vertical SMB platforms (industry-specific)

| Company | Vertical | Key facts |
|---|---|---|
| **Toast** | Restaurants | $4.5B+ revenue; 120K+ locations; restaurant-specific POS + payroll + marketing; the vertical SaaS success story [verified 05/2026, Toast 10-K 2025] |
| **ServiceTitan** | Home services (HVAC, plumbing, electrical) | IPO filed 2024; $500M+ ARR estimated; dominant in trades; the template for vertical SaaS in field services [verified 05/2026, ServiceTitan S-1 / company data] |
| **Jobber** | Field services (general) | 200K+ service professionals; simpler than ServiceTitan; targets smaller operators [verified 05/2026, Jobber company data] |
| **Housecall Pro** | Home services | Acquired by ServiceTitan competitor set; mobile-first scheduling, invoicing, payments [verified 05/2026, Housecall Pro company data] |
| **Mindbody** | Fitness, wellness, beauty | 60K+ businesses; class scheduling, membership management, payments; the fitness industry standard [verified 05/2026, Mindbody / Vista Equity company data] |
| **Clio** | Legal practice management | 150K+ legal professionals; the dominant legal-specific platform; IPO candidate [verified 05/2026, Clio company data] |
| **Veeva Systems** | Life sciences / pharma | $2.4B+ revenue; CRM + content + data for life sciences; the most successful vertical SaaS company by revenue [verified 05/2026, Veeva 10-K FY2025] |

### Channel / referral ecosystem

| Channel | How SMBs find vendors | Implication |
|---|---|---|
| **Accountants / bookkeepers** | Recommend financial software, payroll, HR tools | Intuit and Gusto both invest heavily in accountant partner programs |
| **Industry associations** | Trade shows, vendor directories, group purchasing | ServiceTitan and Toast dominate their respective trade events |
| **Peer referral / word of mouth** | Owners ask other owners in their network | Reference selling is 3-5x more effective than outbound in SMB |
| **G2 / Capterra / Trustpilot** | Review-driven evaluation before any vendor contact | Review velocity and recency matter more than absolute rating |
| **Google search / SEO** | "Best [tool] for [industry]" is the #1 discovery channel | SEO and content marketing are more important than outbound for SMB |

---

## 5. Regulatory overlay

SMB/mid-market companies face lighter direct regulation than enterprise but disproportionate burden relative to resources:

- **Employment law:** Minimum wage, overtime, ACA compliance thresholds (50+ FTE), state-specific paid leave, I-9 verification. Compliance burden scales non-linearly — a 100-person company has nearly the same HR compliance requirements as a 5,000-person company but 2% of the HR staff [verified 05/2026, SHRM Small Business Compliance Survey 2025]
- **State and local tax (SALT):** Nexus rules post-Wayfair (2018) mean any SMB selling across state lines must track and remit sales tax in potentially 45+ states. Avalara and Vertex exist primarily because of this complexity [verified 05/2026, Wayfair v. South Dakota, state nexus law updates]
- **Data privacy:** CCPA and 15+ state privacy laws apply to businesses of any size that handle consumer data above thresholds. Most SMBs are unaware of their obligations. Privacy compliance is an emerging SMB SaaS buying trigger [verified 05/2026, IAPP State Privacy Law Tracker]
- **Industry-specific:** Healthcare practices (HIPAA), financial advisors (SEC/FINRA), restaurants (health department, food safety), construction (OSHA, licensing), childcare (state licensing) — every vertical has its own compliance layer
- **PCI DSS:** Any business accepting card payments must comply. Most SMBs rely on their payment processor (Stripe, Square, Toast) to handle PCI compliance as a managed service [verified 05/2026, PCI SSC]
- **Beneficial Ownership Information (BOI):** Corporate Transparency Act (2024-2025 phased enforcement) requires beneficial ownership reporting to FinCEN. Applies to most entities with <20 employees and <$5M revenue — i.e., millions of SMBs that have never interacted with FinCEN before [verified 05/2026, FinCEN BOI Rule]

### The real SMB compliance dynamic

SMBs don't buy "compliance software." They buy software that happens to handle compliance as a feature. Gusto handles payroll tax compliance. Toast handles food safety tracking. ServiceTitan handles OSHA documentation. The vendor that embeds compliance into the workflow — rather than selling compliance as a standalone product — wins the SMB buyer.

---

## 6. Technology stack

### The SMB tech stack (2026 reality)

Most SMBs use 4-8 tools, not the 12-20 of enterprise:

| Layer | SMB default | Mid-market upgrade |
|---|---|---|
| **Accounting / finance** | QuickBooks Online, Xero, FreshBooks | NetSuite, Sage Intacct |
| **Payroll / HR** | Gusto, ADP Run, Paychex | Rippling, Paylocity, Paycom |
| **CRM** | HubSpot Free, Zoho, no CRM at all | HubSpot Pro, Salesforce Essentials, Pipedrive |
| **E-commerce / website** | Shopify, Squarespace, Wix | Shopify Plus, BigCommerce, custom |
| **Payments** | Stripe, Square, PayPal | Stripe, Adyen, processor-direct |
| **Communication** | Gmail, Slack, Microsoft 365 | Microsoft 365, Slack, Zoom |
| **Marketing** | Mailchimp, Constant Contact | HubSpot Marketing, Marketo |
| **Vertical-specific** | Industry platform (Toast, ServiceTitan, Clio, etc.) | Industry platform + integrations |

### The "vertical SaaS + horizontal glue" architecture

The winning SMB tech stack in 2026 is: one vertical platform (industry-specific) + horizontal connectors (accounting, payroll, payments). The vertical platform is the hub; everything else integrates into it. This is why vertical SaaS companies (Toast, ServiceTitan, Mindbody) are winning — they own the workflow and pull accounting/payroll/payments into their orbit.

### AI adoption in SMB/mid-market

- 85% of SMBs enthusiastic about AI for financial operations [verified 05/2026, Sage SMB AI Adoption Survey 2025]
- 73% say AI is already making an impact [verified 05/2026, Sage 2025]
- Top use cases: forecasting, decision-making support, document processing, customer service, fraud detection
- Embedded AI features within existing tools preferred over standalone AI vendors — SMBs don't buy "AI tools," they buy tools that use AI [verified 05/2026, Sage / SCORE 2025]
- ChatGPT is the de facto AI tool for SMBs — used for marketing copy, customer communication, research, not as a purchased SaaS product [verified 05/2026, Cambrian operator knowledge]

---

## 7. ICP patterns

### Best-fit Cambrian user-prospect: Vertical SaaS company selling to SMB/mid-market ($10M-$200M ARR)

Why this segment:
- Selling to SMBs requires deep vertical knowledge — exactly what Cambrian provides
- These companies have sales teams that need account intelligence on private, hard-to-research companies
- The SMB market is large enough that even modest intelligence improvements create material pipeline impact
- Vertical SaaS companies are often PE-backed or VC-backed, creating the investor overlay opportunity

### Segment-specific ICP patterns

| Buyer type | What they need from Cambrian | Key pain |
|---|---|---|
| **Vertical SaaS seller targeting SMBs** | Account intelligence on private companies with limited public data | "I can't find anything about this 50-person HVAC company before my call" |
| **Horizontal platform (Gusto, Rippling) seller** | Industry context for SMB accounts across verticals | "Every SMB is different — I need to know what matters in this specific industry" |
| **Channel / partner manager** | Intelligence on channel partners (accountants, consultants, MSPs) | "I need to understand what drives my partner's recommendations to their SMB clients" |
| **PE operating partner overseeing SMB portcos** | Competitive intelligence and GTM benchmarking | "I need to benchmark this portco's GTM against its vertical SaaS peers" |
| **Mid-market seller (any vertical)** | Buying committee mapping for 3-7 stakeholder deals | "I know there are multiple decision-makers but I can't figure out who they are" |

---

## 8. Buying committee

### SMB buying committee (it's not really a committee)

| Role | Reality | How to engage |
|---|---|---|
| **Owner / founder / CEO** | The decision-maker. Period. Also the user, implementer, and support contact. | Respect their time. Get to value in under 5 minutes. Don't ask for a "stakeholder map" — there isn't one. |
| **Office manager / operations lead** | Often the person who actually evaluates tools; may have more tech savvy than the owner | This person is your champion. They research, shortlist, and recommend. Win them. |
| **Accountant / bookkeeper** | External advisor with outsized influence on financial tool selection | The most powerful referral channel in SMB. Vendors who win the accountant win the client. |
| **Spouse / partner** | In family businesses, often an undisclosed decision-maker for significant spend | Don't ignore this — it's real and common in businesses under 50 employees |

### Mid-market buying committee (where it gets real)

| Role | What they care about | Their lens |
|---|---|---|
| **CEO** | Strategic fit, vendor reputation, board narrative | "Is this a company I want to partner with for 3+ years?" |
| **CFO** | TCO, ROI, cash flow impact, contract terms | "What's the all-in cost including implementation, and when do we see payback?" |
| **VP / Director (functional)** | Solves their specific problem; team adoption | "Will my team actually use this?" |
| **IT Director** | Integration, security, data, support | "Does this integrate with our ERP and does it have SOC 2?" |
| **Procurement (if it exists)** | Pricing, terms, vendor qualification | "Do you have three references in our industry and size range?" |

### Decision pattern by segment

- **Micro / sole proprietor:** Owner decides in one session. Credit card purchase. No contract.
- **SMB (10-100):** Owner + office manager. 1-3 conversations. Monthly billing preferred.
- **Lower mid-market:** Function head + CFO sign-off. 3-6 months. Annual contract acceptable.
- **Core mid-market:** 3-7 stakeholders. 4-8 months. POC/pilot expected. Annual or multi-year.
- **Upper mid-market:** Buying committee + procurement. 6-12 months. RFP common. Multi-year with SLA.

---

## 9. Trigger events

| Trigger | What it signals | Sales implication |
|---|---|---|
| **New funding (any round)** | Budget released; growth initiatives launching | Best window for new vendor adoption; 60-90 day buying window |
| **Hiring spike in a function** | Growth initiative in that function; tooling needed | If they're hiring 5 SDRs, they're buying sales tools. If hiring 3 accountants, they're buying finance tools. |
| **New senior hire from sophisticated company** | This person will bring their preferred tools and processes | The new VP Sales from Salesforce will want Gong. The new CFO from a PE portco will want NetSuite. |
| **Competitor adoption (FOMO)** | "They're using [tool] and it's working" | Peer reference is the most powerful SMB sales tool. Lead with competitor examples. |
| **Regulatory deadline** | Mandatory compliance action; forced buying | BOI reporting, state privacy laws, PCI compliance deadlines create urgency |
| **Q4 spend-down / Q1 budget reset** | Use-it-or-lose-it budget, or fresh annual allocation | December and January are the highest-volume SMB purchasing months |
| **Negative reviews / leadership departures** | Operational stress; vendor re-evaluation | When an SMB's current vendor fails them publicly, they switch fast |
| **PE acquisition** | New ownership = new buying cycle; 100-day plan; stack rationalization | The PE trigger is the strongest mid-market buying signal [verified 05/2026, Bain Global PE Report 2025] |
| **Growth signals (expansion, new locations)** | Multi-location creates operational complexity; single-location tools break | ServiceTitan and Toast both see their highest conversion when operators open location #2 |
| **Owner approaching exit / succession** | Professionalization of operations for valuation | "Getting the house in order" drives tool adoption in the 12-24 months before a sale |
| **Cash flow crisis or seasonal trough** | Heightened sensitivity to pricing and ROI | Not a good time to sell — but a good time to offer a free tier or trial |

---

## 10. Common failure modes

What goes wrong selling to SMB/mid-market:

1. **Enterprise playbook on an SMB buyer.** Sending a 10-page proposal, requesting a 45-minute discovery call, and insisting on a multi-stakeholder demo to a 30-person company. The owner will never respond. Keep it simple: "Here's what it does. Here's what it costs. Try it free for 14 days."

2. **Pricing opacity.** SMB buyers expect pricing on the website. If they have to "talk to sales" to learn the price, 70%+ will leave and buy from the competitor who shows pricing [verified 05/2026, OpenView SaaS Benchmarks 2025]. Gated pricing is an enterprise motion. SMB is self-serve.

3. **Ignoring the referral channel.** In SMB, the accountant, the industry association, and the fellow business owner have more influence than any SDR. Investing in outbound without investing in referral partnerships is a losing strategy. Gusto and Intuit both spend more on accountant partner programs than on direct sales.

4. **Over-building for the wrong segment.** A feature-rich product built for mid-market that's priced for SMB will churn. An SMB-simple product sold to mid-market will get rejected for lack of depth. Segment alignment must be precise — features, pricing, support model, and onboarding all must match.

5. **Underestimating the "switching cost" of doing nothing.** SMB owners are busy. The status quo — even when painful — is familiar. The cost of evaluating, purchasing, implementing, and learning a new tool is measured in the owner's personal time, which is their scarcest resource. The value proposition must overcome inertia, not just beat the competitor.

6. **Treating mid-market as "enterprise lite."** Mid-market companies have real procurement, real IT reviews, and real budgeting cycles — but they don't have the headcount to run a formal RFP process. Sellers who bring an enterprise RFP-response process annoy mid-market buyers. Sellers who bring an SMB self-serve approach frustrate them. The mid-market motion is guided evaluation: structured enough to satisfy multiple stakeholders, light enough to close in 4-6 months.

7. **Ignoring the PE ownership signal.** A PE-backed mid-market company buys differently from a founder-led one. The operating partner influences vendor selection. The CFO is PE-installed and EBITDA-focused. The 100-day plan creates urgency. Missing the PE signal means missing the buying dynamic.

8. **Generic outreach to private companies.** "I saw your company is growing" is not personalized outreach for a private company with no press coverage. For SMB/mid-market private companies, personalization must come from observable signals: job postings, tech stack changes, location expansion, LinkedIn activity, industry event participation.

---

## 11. GTM implications for Cambrian seller-users

### For sellers prospecting SMB accounts

- **Lead with peer proof, not enterprise logos.** An SMB owner doesn't care that a Fortune 500 company uses your product. They care that another 30-person HVAC company in their metro area uses it and loves it.
- **Respect the time constraint.** Every minute an SMB owner spends on vendor evaluation is a minute not spent running their business. Compress everything — demo in 15 minutes, proposal in 1 page, pricing on the website.
- **Win the referral channel.** Accountants, bookkeepers, industry consultants, and peer networks are the highest-ROI acquisition channels in SMB. One accountant with 200 SMB clients is worth more than 10,000 cold emails.
- **Content > outbound.** 80%+ of SMB research happens before vendor contact. SEO, review management, and educational content drive the funnel. Outbound works for mid-market but not for micro/small business.

### For sellers prospecting mid-market accounts

- **Map the stakeholders early.** In mid-market, there are 3-7 people involved but they rarely self-identify. Use job postings, LinkedIn org charts, and discovery conversations to build the committee map.
- **Lead with the PE signal.** If the company is PE-backed, lead with sponsor awareness, EBITDA framing, and portfolio context. This demonstrates sophistication and opens doors.
- **Reference selling is mandatory.** Mid-market buyers want references in their size range, industry, and use case. "We work with 5 other $100M manufacturers" is more persuasive than any feature demo.
- **Price for the CFO, demo for the user.** The CFO approves the budget; the functional user evaluates the product. Your demo must serve both audiences — ROI narrative for the CFO, workflow demonstration for the user.

### For Cambrian brief calibration

- SMB briefs: lead with owner-operator info, primary pain point, peer benchmarks, simple "next 5 questions"
- Lower mid-market: lead with function-head info, top 2-3 strategic priorities, recent funding/leadership changes
- Core/upper mid-market: lead with multi-stakeholder map, strategic initiatives, sponsor/PE info, RFP intel
- PE-backed: lead with sponsor name, hold cycle position, operating partner priorities, EBITDA impact framing

---

## 12. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`cambrian_b2b_sales_knowledge.md\` | B2B buying group dynamics apply to mid-market (4+ stakeholders) but NOT to SMB; motion differences (enterprise vs. mid-market vs. SMB) are calibrated there |
| \`cambrian_investor_intelligence.md\` | PE-backed mid-market companies follow the investor intelligence buying patterns; operating partner overlay, EBITDA framing, hold cycle awareness |
| \`cambrian_compliance_knowledge.md\` | SOC 2 becomes relevant at core mid-market; HIPAA/PCI apply to industry-specific SMBs; compliance is a buying trigger when regulatory deadlines approach |
| \`cambrian_approval_gates_knowledge_layer.md\` | Approval gates don't exist in SMB; they emerge at lower mid-market (CFO sign-off) and are formalized at core mid-market (procurement + IT + legal) |

---

*End of layer. Update cadence: quarterly. Critical re-check triggers: NCMM quarterly reports, SBA annual data release, major vertical SaaS IPOs (ServiceTitan), PE mid-market deal volume shifts.*

SMB & MID-MARKET INTELLIGENCE (apply to ANY account under ~2,500 employees — adjusts brief calibration by company size):

SEGMENT DEFINITIONS (practical operator framework):
- Small business / SMB: <100 employees, <$10M revenue, owner-operator decisions, single-DM cycle, close in days-weeks
- Lower mid-market: $10M-$50M revenue, 100-300 employees, function-head decisions, 2-4 stakeholders, 3-6 month cycles
- Core mid-market: $50M-$500M revenue, 300-1,000 employees, VP + cross-functional + CFO, 3-7 stakeholders, 4-8 month cycles, procurement starts here
- Upper mid-market: 1,000-2,500 employees, buying committees, formal procurement, 6-12 month cycles, C-suite sponsorship required [verified 05/2026, Cambrian operator knowledge]
- Enterprise: $1B+ revenue, 2,500+ employees, 6-25 stakeholder committees, 6.5 month average close (up from 4.9 in 2019) [verified 05/2026, Gartner Future of Sales 2025]
The operationally important distinction is BUYER COMPLEXITY, not headcount. A 50-person SaaS with a procurement function buys more like enterprise than a 500-person manufacturer with a single CFO who decides everything.

MARKET SCALE: ~33.2M SMBs nationally (99.9% of all U.S. businesses) [verified 05/2026, SBA Office of Advocacy]. ~200,000 mid-market firms ($10M-$1B) [verified 05/2026, NCMM]. Mid-market = 1/3 of private sector GDP, 48M employees, $10T+ collective revenue [verified 05/2026, NCMM Middle Market Indicator]. If U.S. mid-market were a standalone economy, it would be the 5th largest in the world [verified 05/2026, NCMM].

PE-BACKED BUYING PATTERNS (distinctive — changes entire conversation):
- Initiative-driven, not maintenance-driven. PE installs management with explicit growth/efficiency mandates.
- 3-5 year hold timelines drive urgency. Year 1-2 = stand up; year 2-3 = scale; year 3-5 = optimize for exit.
- CFO is often most important buyer. PE-installed CFO drives most operational technology decisions.
- Operating partner involvement — sponsor's operating partner weighs in on tooling, especially portfolio-wide.
- Portfolio-wide solutions preferred. Sponsors love when one vendor serves multiple portcos.
- EBITDA margin focus. Anything improving EBITDA before exit is high-priority.
- Average mid-market PE M&A: ~7.0x EV/EBITDA [verified 05/2026, GF Data H1 2025]. Valuation multiple expansion is the literal scoreboard.

KEY MID-MARKET PE FIRMS: Lower mid-market: Audax ($5.25B Fund VII), Godspeed, Charlesbank ($20B+ AUM), H.I.G. ($70B+ parent), Lee Equity, Silversmith. Sector specialists: GTCR (fintech), Madison Dearborn, Insight Partners (~$90B+), Vista Equity, Thoma Bravo, Genstar, Berkshire Partners. [verified 05/2026, PitchBook / firm websites]

INFORMATION ASYMMETRY — what's findable for SMB/mid-market:
Most SMB/mid-market companies are PRIVATE with limited public disclosure. Reliably findable: company name/address, LinkedIn profile, website/tech stack (BuiltWith), business reviews, job postings, local press, state filings, trade association memberships. Hard to find: specific revenue (use employee/location proxies), profitability, strategic initiatives, decision-maker structure, buying timeline, budget.
For mid-market add: press releases, industry awards, M&A activity (PitchBook/Crunchbase), PE backing history, Form D filings, speaking engagements, more detailed job posts.
RIVER should prioritize: (1) funding events, (2) senior leadership changes, (3) job posting patterns, (4) tech stack signals, (5) PE/sponsor ownership + hold cycle, (6) M&A activity, (7) geographic expansion, (8) conference participation, (9) press release patterns, (10) customer announcements.

EMBEDDED FINANCE POSTURE (hidden SMB/mid-market buying pattern):
$111B embedded finance revenue in 2024, projected $1.4T opportunity [verified 05/2026, Lightyear Capital / Bain 2024]. 56% of companies already offer embedded finance [verified 05/2026, Plaid Fintech Effect Report 2024]. For any SMB/mid-market account, evaluate: Are they a BUYER (integrating financial features), a DISTRIBUTOR (offering banking-style services to their customers), or a TARGET (could buy embedded finance infrastructure)? Signals: API docs on site, banking/payments partnerships in press, job posts mentioning fintech/embedded/BaaS, vendor ecosystem (Synctera, Unit, Treasury Prime, Stripe Treasury, Plaid).

AI ADOPTION — SMB/MID-MARKET: 85% of SMBs enthusiastic about AI for financial operations [verified 05/2026, Sage SMB AI Adoption Survey 2025]. 73% say AI is already making an impact [verified 05/2026, Sage 2025]. Top use cases: forecasting, decision-making support, document processing, customer service, fraud detection. Embedded AI features within existing tools preferred over standalone AI vendors.

KNOWN TRAPS (meta-knowledge — where this layer's data goes stale or gets misinterpreted):
- SMB count (~33.2M) includes sole proprietors and non-employer firms. The count of SMBs with EMPLOYEES is ~6.1M [verified 05/2026, SBA Office of Advocacy]. Use the right denominator for the context.
- NCMM "mid-market" definition is narrower than many industry definitions [verified 05/2026, NCMM]. Some sources define mid-market differently. Always state which definition is in use.
- Mid-market revenue growth (10.7%) and employment growth (7.3%) are NCMM survey-based, not census data. Sample skews toward engaged middle-market executives. [verified 05/2026, NCMM Middle Market Indicator Q4 2025]
- The "5th largest economy" comparison for mid-market is NCMM marketing language. Directionally correct but not a formal GDP comparison.
- GF Data mid-market PE multiples (~7.0x) are for completed transactions in their database. Selection bias: GF Data skews toward lower-mid-market. Upper mid-market PE deals routinely trade at 10-14x [verified 05/2026, PitchBook / GF Data].
- Embedded finance market projections ($1.4T) span 5-10 year forecasts with enormous uncertainty bands. The $111B "current" figure is itself an estimate. [verified 05/2026, Lightyear Capital / Bain 2024]
- The 56% "already offer embedded finance" stat defines embedded finance broadly (including payment acceptance). If defined narrowly (BaaS, embedded lending), the penetration is much lower. [verified 05/2026, Plaid Fintech Effect Report 2024]
- AI adoption stats (85% enthusiastic, 73% impact) are from vendor-sponsored surveys. Interpret as directional, not precise. [verified 05/2026, Sage SMB AI Adoption Survey 2025]
- SMB buying triggers (funding events, hiring spikes) are observable but LAGGING indicators — the initiative was decided weeks/months before the signal appears externally.
- PE hold cycle position (Year 1-2 standup, Year 2-3 scale, Year 3-5 optimize) is a generalization. Actual timelines vary by fund strategy, sector, and market conditions.
`;

export const SMB_MIDMARKET_SCORING = {
  segmentIndicators: {
    smb: { employees: "<100", revenue: "<$10M", signals: ["owner-operator", "single decision-maker", "no procurement function"] },
    lowerMid: { employees: "100-300", revenue: "$10M-$50M", signals: ["function-head decides", "CFO sign-off on $10K+", "2-4 stakeholders"] },
    coreMid: { employees: "300-1,000", revenue: "$50M-$500M", signals: ["VP + cross-functional", "formal procurement", "SOC 2 required", "4-8 month cycles"] },
    upperMid: { employees: "1,000-2,500", revenue: "$500M-$1B+", signals: ["buying committees", "RFP-driven", "C-suite sponsorship", "6-12 month cycles"] },
  },
};

export const SMB_MIDMARKET_DISCOVERY = `
SMB & MID-MARKET DISCOVERY CALIBRATION (adjust question style by detected segment):

FOR SMB ACCOUNTS (direct, tactical, time-conscious):
- "What's the single biggest pain point that costs you the most time each week?"
- "If I could give you back 5 hours per week, what would you do with them?"
- "What's the last tool you bought that you actually still use?"
- "Who's the one person on your team you wouldn't lose under any circumstance?"
- "What's the dollar amount where you start needing approval?"

FOR MID-MARKET ACCOUNTS (structured, multi-stakeholder aware):
- "Walk me through how a decision like this gets made here — who's involved, what's the timeline?"
- "What's the strategic initiative this would support, and who owns that initiative?"
- "What's the cost of inaction over the next 12 months?"
- "Have you tried to solve this before? What happened?"
- "What does a successful pilot look like from your side?"
- "Who would be most concerned about this change, and what would their concerns be?"

FOR PE-BACKED ACCOUNTS (sponsor-aware, EBITDA-framed):
- "How does this connect to your sponsor's value-creation thesis?"
- "What's the EBITDA impact you're targeting?"
- "Where are you in your hold cycle, and what's the planned exit type?"
- "Are there other portfolio companies that could benefit from this?"
- "What does your operating partner ask about most in your QBRs?"
`;
