// src/data/investorIntelligenceKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// Investor Intelligence — cross-cutting layer for PE, VC, family
// office, and strategic acquirer conversations. Covers: how PE/VC
// ownership changes buying behavior, fund mandates, portfolio
// operating models, board dynamics, due diligence, value creation,
// LP reporting, exit preparation.
//
// SOURCES:
// - Cambridge Associates US PE Index (1,700 funds, $1.6T, June 2025)
// - Cambridge Associates US VC Index (2,699 funds, $591B)
// - PitchBook / Morningstar Evergreen Fund Indexes (late 2025)
// - PitchBook Annual PE Breakdown 2025
// - Bloomberg, July 2025 (GTCR/BHN reporting)
// - Bain Global PE Report 2025 (PE dry powder, deal dynamics)
// - Bain PE Operating Partners Survey 2025
// - GF Data (PE mid-market valuation multiples, H1 2025)
// - Preqin Global Private Equity Report 2025
// - Tracxn / PitchBook (transaction tracking, April 2026)
// - Gartner (agentic AI prediction, 2025)
// - FTI Consulting (healthcare PE/VC investment data)
// - SEC filings, press releases (Inspire Brands IPO, Brookfield/Oaktree)
// - Cambrian operator knowledge (PE portfolio sales dynamics)
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const INVESTOR_INTELLIGENCE_INJECTION = `
---
title: "Investor Intelligence — Knowledge Layer"
type: cross_cutting_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_b2b_sales_knowledge.md
  - cambrian_smb_midmarket_knowledge.md
  - cambrian_compliance_knowledge.md
  - cambrian_approval_gates_knowledge_layer.md
tags: [PE, VC, private-equity, venture-capital, family-office, strategic-acquirer, EBITDA, multiple-expansion, portfolio-ops, operating-partner, 100-day-plan, exit-prep]
last_updated: 2026-05-21
status: production
confidence: high (Cambridge Associates, PitchBook, Bain, GF Data, Preqin, Bloomberg, SEC filings, Cambrian operator knowledge)
---

# Investor Intelligence — Knowledge Layer

> **Working thesis.** PE and VC ownership fundamentally changes how companies buy technology, services, and consulting. A PE-backed company does not buy like a founder-led company — the decision calculus shifts from "does this solve my problem" to "does this improve EBITDA before our exit." With $3.6T+ in PE dry powder and PE accounting for ~40% of global M&A by value, the investor-owned company is not a niche buyer segment — it is an increasingly dominant portion of the B2B addressable market. For Cambrian's seller-users, recognizing the investor overlay (PE sponsor, hold cycle position, operating partner priorities, value creation thesis) is the difference between a relevant conversation and a wasted one. The operating partner is the most undervalued referral source in B2B — win one portco engagement, unlock cross-portfolio expansion.

> **What makes this segment distinct as a sales target.** Investor-owned companies operate on borrowed time. PE hold periods average 5.6 years [verified 05/2026, Bain Global PE Report 2025], and every initiative is evaluated against the exit timeline. A product that delivers ROI in 18 months is compelling for a Year 1-2 portco; that same product is irrelevant for a Year 4-5 portco preparing to exit. The 100-day plan post-acquisition creates a concentrated buying window that is the highest-leverage trigger event in B2B. And the operating partner — not the portco CEO — is increasingly the person who decides which vendors get access to the portfolio.

---

## Table of Contents

1. [Snapshot and market sizing](#1-snapshot-and-market-sizing)
2. [What makes this distinct as a sales target](#2-what-makes-this-distinct-as-a-sales-target)
3. [Sub-categorization](#3-sub-categorization)
4. [Major firms](#4-major-firms)
5. [Regulatory overlay](#5-regulatory-overlay)
6. [Technology stack and operating model](#6-technology-stack-and-operating-model)
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
| Global PE dry powder | $3.6T+ [verified 05/2026, Bain Global PE Report 2025] |
| PE share of global M&A by value | ~40% [verified 05/2026, PitchBook Annual PE Breakdown 2025] |
| North American M&A (2025) | $2.65T (second-best year after 2021) [verified 05/2026, Dealogic / Bloomberg] |
| Mega-buyout count (2025) | 13 (up from 6 in 2024) [verified 05/2026, Bain Global PE Report 2025] |
| Cambridge US PE Index (1H 2025) | +3.9% net return; growth equity outperformed buyouts (4.9% vs 3.6%) [verified 05/2026, Cambridge Associates June 2025] |
| Cambridge US VC Index (1H 2025) | +6.4%, extending recovery [verified 05/2026, Cambridge Associates June 2025] |
| PE distributions vs. calls (1H 2025) | $78.9B distributed vs. $67.6B called — net positive [verified 05/2026, Cambridge Associates] |
| Average PE hold period | 5.6 years (lengthening) [verified 05/2026, Bain Global PE Report 2025] |
| Mid-market PE M&A multiple | ~7.0x EV/EBITDA (lower mid), 10-14x (upper mid) [verified 05/2026, GF Data / PitchBook] |
| PE premium over strategic buyers | ~3 turns of EBITDA [verified 05/2026, GF Data / PitchBook] |
| PE firms mandating AI in portcos | 70% within 18 months [verified 05/2026, Bain PE Operating Partners Survey 2025] |
| VC sector allocation | IT 48%, healthcare 26%, industrials 11% = 85% of invested capital [verified 05/2026, Cambridge Associates] |

### Headline dynamics (use these in conversation)

- **The 2025-2026 transition is fortress-building consolidation, not land grabs** — PE sponsors are deploying capital into platform acquisitions with clear add-on strategies, not speculative growth bets [verified 05/2026, Bain Global PE Report 2025]
- **PE pays ~3 turns more than strategic buyers** — operator-led platforms with proven unit economics command premium multiples [verified 05/2026, GF Data / PitchBook]
- **AI is now the dominant M&A thesis driver across every sector** — acquirers in fintech, healthcare, loyalty, and CRE are using M&A to acquire AI capability rather than build it [verified 05/2026, PitchBook / Bain]
- **Fund managers distributed MORE capital than called in 1H 2025** — the "PE LPs need exits" narrative has empirical backing; sponsors are actively monetizing maturing portfolios [verified 05/2026, Cambridge Associates]
- **VC 2022 vintage at +8.6%** — strongest signal the valuation reset is past trough [verified 05/2026, Cambridge Associates]
- **PitchBook/Morningstar launched Evergreen Fund Indexes in late 2025** — the rise of evergreen vehicles is the structural product innovation reshaping LP access to PE/VC [verified 05/2026, PitchBook / Morningstar]

---

## 2. What makes this distinct as a sales target

Three dynamics shape every sale to an investor-owned company:

**1. The 100-day plan post-acquisition is the most concentrated buying window in B2B.** When a PE firm acquires a company, the new management team has roughly 100 days to establish baselines, identify quick wins, and build an operating cadence. During this window, every vendor relationship is re-evaluated, every tool in the stack is scrutinized, and new operating partners are receptive to pitches that align with the value creation plan. After the 100-day window closes, the operating cadence is set and new vendor adoption slows dramatically.

**2. EBITDA is the universal language.** Every conversation, every proposal, every value proposition must translate to EBITDA impact. "This tool saves 10 hours per week" means nothing. "This tool saves 10 hours per week across your 50-person team, which at a fully-loaded cost of $75/hour represents $1.95M in annual labor productivity — at your 12x multiple, that's $23.4M of enterprise value creation" means everything. PE operators think in enterprise value math at all times.

**3. The operating partner is the real decision-maker for portfolio-wide initiatives.** The portco CEO manages day-to-day operations. But the PE firm's operating partner (or value creation team) decides which initiatives get resources, which vendors get preferred status, and which tools are deployed across the portfolio. A vendor that wins one portco but never engages the operating partner has a customer. A vendor that wins the operating partner has access to the entire portfolio.

---

## 3. Sub-categorization

| Investor type | Hold period | Primary metric | Decision-maker | Buying behavior |
|---|---|---|---|---|
| **Buyout PE (large cap)** | 4-7 years | EBITDA multiple expansion | Operating partner / CFO | 100-day plan; preferred vendor lists; portfolio-wide deals |
| **Growth equity** | 3-6 years | Revenue growth rate + path to profitability | CEO / CRO with board input | Growth capital deployed into GTM; more willing to experiment |
| **Lower mid-market PE** | 4-6 years | EBITDA margin improvement | PE-installed CFO / COO | Hands-on; operating partner deeply involved; cost-conscious |
| **Venture capital (Series A-C)** | 5-10 years to liquidity | ARR growth rate, NRR, CAC payback | CEO / CRO | Growth > profitability; willing to spend aggressively on tools that drive growth metrics |
| **Late-stage VC / pre-IPO** | 1-3 years to IPO | Revenue predictability, unit economics, governance | CFO / COO | Preparing for public-market scrutiny; governance and compliance tooling becomes urgent |
| **Family office** | Multi-decade | Capital preservation + modest growth | Family member / trusted advisor | Relationship-driven; conservative; values alignment matters as much as ROI |
| **Strategic acquirer** | Permanent (integration) | Synergy realization (revenue + cost) | Integration lead / BU GM | 12-24 month integration plan; vendor decisions driven by acquirer's existing stack |
| **SPAC / de-SPAC** | Variable | Path to profitability post-merger | CFO / board | Often in distress; governance and financial reporting tooling urgent |

### Fund lifecycle and portco buying windows

| Fund year | Phase | Portco buying behavior |
|---|---|---|
| **Year 0-1** | Acquisition + 100-day plan | Highest buying velocity; every vendor relationship re-evaluated |
| **Year 1-2** | Stand up / build | New initiatives launched; platform investments made; operational tooling purchased |
| **Year 2-3** | Scale | Growth-oriented purchases; GTM expansion; data and analytics investments |
| **Year 3-4** | Optimize | Margin improvement; vendor consolidation; cost reduction |
| **Year 4-5+** | Exit preparation | Governance, compliance, reporting tooling; no new long-term commitments; focus on "quality of earnings" narrative |

---

## 4. Major firms

### Large-cap buyout

| Firm | AUM | Key characteristics | Relevant verticals |
|---|---|---|---|
| **Thoma Bravo** | $140B+ [verified 05/2026, Thoma Bravo website] | Software-focused; aggressive operational playbook; stack consolidation across portcos | Enterprise software, cybersecurity, fintech |
| **Vista Equity Partners** | $100B+ [verified 05/2026, Vista Equity website] | Software-only; Vista Consulting Group is the most structured operating framework in PE; acquired Salesloft (2024) | Enterprise software, data/analytics |
| **Silver Lake** | $102B+ [verified 05/2026, Silver Lake website] | Technology-focused; larger deals; Virtu, Dell, Airbnb track record | Technology infrastructure, fintech |
| **Francisco Partners** | $45B+ [verified 05/2026, Francisco Partners website] | Mid-to-large tech buyouts; sector specialist | Technology, healthcare IT |
| **Insight Partners** | $90B+ [verified 05/2026, Insight Partners website] | Growth equity + buyout; massive portfolio (500+ companies); ScaleUp operating platform | Software, data, fintech |
| **General Atlantic** | $84B+ [verified 05/2026, General Atlantic website] | Global growth equity; long hold periods; sector diversified | Technology, healthcare, financial services, consumer |
| **Warburg Pincus** | $80B+ [verified 05/2026, Warburg Pincus website] | Growth-oriented; multi-sector; known for financial services and healthcare | Financial services, healthcare, technology, industrial |
| **Hellman & Friedman** | $100B+ [verified 05/2026, H&F website] | Software and services; known for large transactions; Hub International, Verint | Software, insurance, financial services |
| **Bain Capital Tech Opportunities** | Part of $185B+ Bain Capital platform [verified 05/2026, Bain Capital website] | Technology-focused fund within Bain Capital; leverages Bain consulting relationship | Enterprise software, fintech |

### Lower mid-market and sector specialists

| Firm | AUM / Focus | Key characteristics |
|---|---|---|
| **Audax Group** | $5.25B Fund VII [verified 05/2026, PitchBook] | Lower mid-market; strong add-on strategy; 150+ add-on acquisitions |
| **GTCR** | $40B+ [verified 05/2026, GTCR website] | Fintech specialist; BHN (Blackhawk Network) $4-5B deal in advanced talks [verified 05/2026, Bloomberg] |
| **Charlesbank Capital** | $20B+ AUM [verified 05/2026, Charlesbank website] | Lower mid to mid-market; services and technology |
| **H.I.G. Capital** | $70B+ parent [verified 05/2026, H.I.G. website] | Multi-strategy; deep lower mid-market presence |
| **Genstar Capital** | $45B+ [verified 05/2026, Genstar website] | Financial services, healthcare, industrial technology specialist |
| **Berkshire Partners** | $20B+ [verified 05/2026, Berkshire Partners website] | Mid-market; consumer, business services, communications |
| **Madison Dearborn** | $28B+ [verified 05/2026, MDP website] | Mid-market; financial services, TMT, healthcare |
| **Silversmith Capital** | $3.5B+ [verified 05/2026, Silversmith website] | Growth equity for bootstrapped technology companies |

### Key investor archetypes by vertical

- **Fintech/Payments:** GTCR ($40B+, BHN $4-5B), Silver Lake, Blackstone, Centerbridge ($2.0B MeridianLink), Clearlake ($4.1B D&B), FTV Capital [verified 05/2026, PitchBook / press releases]
- **QSR/Franchise:** Roark Capital (~$37B AUM, 23 chains), Blackstone (Jersey Mike's $8B), Bain Capital, Apollo (Qdoba), JAB Holding [verified 05/2026, Bloomberg / Roark website]
- **Healthcare:** New Mountain Capital, Audax PE, Innovaccer ($275M), Cardinal Health, SPRIG Equity. PE/VC in healthcare IT surged 219% to $16.9B in 2024 [verified 05/2026, FTI Consulting]
- **Real Estate:** Blackstone ($42B equity since early 2024), Brookfield ($1T+ AUM), KKR, Starwood, Apollo. $957B CRE loan maturities in 2025 [verified 05/2026, MSCI Real Assets / Blackstone Q4 2024 earnings / Brookfield filings]
- **Charitable/DAFs:** DAF Research Collaborative replaced NPT as canonical source. GoFundMe entered DAF market. OBBBA 0.5% AGI floor reshapes donor behavior [verified 05/2026, OBBBA legislative text 2025]

---

## 5. Regulatory overlay

Investor-owned companies operate under multiple layers of regulatory oversight that affect buying behavior:

- **SEC reporting (public PE/VC firms):** Apollo, Blackstone, KKR, Ares, and other publicly listed alternative managers face quarterly reporting requirements that create transparency about fund performance and deployment. Their portco strategies are partially visible through SEC filings. [verified 05/2026, SEC EDGAR]
- **LP reporting and fiduciary duty:** PE fund managers owe fiduciary duties to their LPs. Every investment decision, including vendor selection for portcos, is ultimately accountable to LP returns. This creates a "value creation must be measurable" requirement for any vendor selling into the portfolio. [verified 05/2026, Preqin]
- **Anti-trust / HSR Act:** Large PE acquisitions require Hart-Scott-Rodino filing. The FTC under the current administration has been more scrutinizing of PE "roll-up" strategies. This affects how sponsors structure add-on acquisitions and can create delays that affect portco buying timelines. [verified 05/2026, FTC press releases / HSR Act]
- **CFIUS (cross-border):** PE firms with foreign LP capital or acquiring companies with U.S. government contracts face CFIUS review. This is increasingly relevant for technology and healthcare deals. [verified 05/2026, CFIUS Annual Report 2025]
- **Tax (carried interest, fund structure):** Changes to carried interest taxation affect fund economics and indirectly affect portco EBITDA targets. The carried interest debate is perennial and affects sponsor behavior around exit timing. [verified 05/2026, IRS / Congressional Budget Office]
- **Industry-specific regulation flows through:** A PE firm acquiring a healthcare IT company inherits HIPAA obligations. A PE firm acquiring a fintech inherits PCI DSS and state MTL requirements. The portco's regulatory burden becomes the sponsor's problem — and compliance tooling becomes a priority post-acquisition. [verified 05/2026, Cambrian operator knowledge]

### The real regulatory dynamic for sellers

The regulatory overlay on PE-backed companies creates TWO selling opportunities:
1. **Compliance as a post-acquisition priority.** New PE ownership means new governance requirements, new audit expectations, and new compliance tooling needs. SOC 2, ISO 27001, HIPAA, and FedRAMP certifications are often part of the value creation plan because they unlock enterprise sales for the portco.
2. **Exit preparation drives compliance investment.** A portco preparing for exit needs "quality of earnings" reporting, clean governance, and defensible compliance posture. This creates a buying window 12-24 months before the exit target date.

---

## 6. Technology stack and operating model

### The PE operating model (how sponsors create value)

Every PE value creation plan has three levers:
1. **Revenue growth** (organic + M&A): New markets, new products, new customers, add-on acquisitions
2. **Margin expansion** (operating leverage + cost discipline): Headcount optimization, vendor consolidation, process automation
3. **Multiple expansion** (quality of earnings narrative): Recurring revenue mix, customer diversification, brand/category positioning

### Technology decisions in PE-backed companies

| Phase | Technology priority | Typical purchases |
|---|---|---|
| **100-day plan** | Establish data infrastructure and reporting | ERP (NetSuite), BI (Tableau/Power BI), CRM cleanup (Salesforce/HubSpot) |
| **Year 1: Stand up** | Build go-to-market infrastructure | Sales engagement, conversation intelligence, marketing automation, website rebuild |
| **Year 2: Scale** | Invest in growth and analytics | Revenue intelligence, intent data, customer success platform, advanced analytics |
| **Year 3: Optimize** | Consolidate and automate | Stack consolidation, AI automation, vendor management, procurement platform |
| **Year 4-5: Exit prep** | Governance and compliance | GRC platform, SOC 2 certification, financial reporting, data room preparation |

### Operating partner technology influence

The PE operating partner or value creation team increasingly maintains a **preferred vendor list** — tools that have proven effective across the portfolio. Common patterns:
- **CRM standardization:** Vista portcos often standardize on Salesforce; growth equity portcos may prefer HubSpot [verified 05/2026, Cambrian operator knowledge]
- **BI standardization:** Most PE platforms standardize on Tableau or Power BI for consistent LP reporting
- **ERP preference:** NetSuite is the default mid-market PE ERP; SAP or Oracle for larger portcos
- **Security baseline:** SOC 2 is typically required within 12-18 months of acquisition for software portcos

### AI in PE portfolios (the 2026 mandate)

70% of PE firms mandate AI adoption in portcos within 18 months [verified 05/2026, Bain PE Operating Partners Survey 2025]. The AI mandate is creating a distinct buying pattern:
- **Defensive AI (margin expansion):** Automating back-office functions, customer support, content creation — measured in headcount avoidance and cost per transaction
- **Offensive AI (growth):** AI-powered sales tools, personalization, product features — measured in revenue lift and NRR improvement
- **BUT:** Gartner predicts >40% of agentic AI projects canceled by 2027 [verified 05/2026, Gartner 2025 Hype Cycle]; only ~130 of thousands of "AI agent" vendors have actual agentic functionality [verified 05/2026, Gartner Agentic AI Market Analysis 2025]. PE operating partners are increasingly skeptical of AI claims and demand proof of measurable KPI impact before deployment.

---

## 7. ICP patterns

### Best-fit Cambrian user-prospect: PE portco in Year 1-2 of hold cycle ($50M-$500M revenue)

Why this segment:
- Highest buying velocity: 100-day plan + value creation initiatives drive rapid vendor selection
- Budget exists: the sponsor provides growth capital specifically for operational improvements
- The EBITDA framing makes ROI conversations concrete and quantifiable
- Operating partner influence creates portfolio expansion opportunity (one portco → many)
- Information available: PE deals are tracked by PitchBook, press releases, and SEC filings — making targeting easier than founder-led private companies

### Segment-specific ICP patterns

| Investor type | Best Cambrian use case | Key pain |
|---|---|---|
| **PE portco (Year 1-2)** | Account intelligence for new sales team being built post-acquisition | "We just acquired this company and need to rebuild GTM from scratch" |
| **PE operating partner** | Portfolio-wide competitive intelligence and GTM benchmarking | "I need consistent account intelligence across 12 portcos in different verticals" |
| **Growth equity portco** | Sales acceleration for companies scaling from $20M to $100M ARR | "We raised $100M and need to 5x pipeline this year" |
| **VC-backed startup (Series B-C)** | Building first enterprise sales motion | "We have PLG working but need to sell to mid-market and enterprise" |
| **Pre-IPO company** | Governance, competitive positioning, and analyst-ready metrics | "We IPO in 18 months and need our GTM story bulletproof" |
| **Strategic acquirer / corp dev** | Target evaluation and competitive intelligence | "We're evaluating 5 acquisition targets in adjacent markets" |

---

## 8. Buying committee

### PE portco buying committee

| Role | Who appoints them | What they care about | Their lens |
|---|---|---|---|
| **CEO / President** | PE sponsor (often replaced post-acquisition) | Growth, execution, board narrative | "Does this support the story I'm telling the board?" |
| **CFO** | PE sponsor (almost always replaced) | EBITDA impact, cash flow, capital efficiency | "What's the payback period, and does this improve our quality of earnings?" |
| **CRO / VP Sales** | CEO (often a sponsor-recommended hire) | Pipeline, bookings, rep productivity | "Will this help my new team ramp faster?" |
| **COO** | PE sponsor or CEO | Operations, integration, efficiency | "Does this reduce complexity or add to it?" |
| **Operating partner** | PE firm (not at portco) | Portfolio-wide consistency, value creation KPIs | "Can I deploy this across 5 portcos? What's the aggregate EBITDA impact?" |
| **IT / CTO** | Retained or replaced | Integration, security, scalability | "Will this work with the stack we're building post-acquisition?" |
| **Board (PE partners)** | GP committee | Fund-level returns, exit readiness | "Does this investment move us closer to exit at target multiple?" |

### Decision patterns by investor type

- **Buyout PE portco:** Operating partner + CFO are the power center. CEO executes. Board approves material spend ($100K+). Decision in 4-8 weeks during 100-day plan, 3-6 months otherwise.
- **Growth equity portco:** CEO + CRO are the power center. Board visibility but less operational control. Decision in 4-12 weeks.
- **VC-backed:** CEO decides with CRO/VP Sales input. Board informed, not involved in vendor decisions under $50K. Decision in 2-6 weeks.
- **Family office portco:** Family member or trusted advisor + CEO. Relationship-driven; decision in 6-12 weeks.
- **Strategic acquirer (corp dev):** Corp dev lead + BU GM + integration lead. Decision tied to M&A timeline; 2-6 months.

**Critical insight:** In PE, the operating partner is the kingmaker. They don't sign contracts, but they recommend vendors, set strategy, and influence budget allocation. Engaging the operating partner directly is the highest-leverage motion for portfolio-wide expansion.

---

## 9. Trigger events

| Trigger | What it signals | Sales implication |
|---|---|---|
| **PE acquisition announced** | 100-day plan imminent; every vendor relationship in play | The #1 trigger event; engage within 30 days of announcement |
| **Operating partner hire at PE firm** | New operating focus; potential vendor re-evaluation | Track PE firm leadership announcements on LinkedIn and press |
| **Portco C-suite change** | New leader brings preferred tools; buying window opens | New CFO = new ERP evaluation; new CRO = new sales stack evaluation |
| **Add-on acquisition by portco** | Integration initiative; tooling spend to unify operations | Integration creates technology needs across every function |
| **Fund raise by PE firm** | New dry powder; new deployment cycle; new acquisitions coming | Signals which firms are about to buy — position before the deals close |
| **LP/board meeting cadence** | Quarterly reviews drive initiative urgency | Budget and initiative decisions cluster around board cycles |
| **Exit process initiated** | 12-24 months of governance, compliance, and reporting investment | Compliance, financial reporting, and data room preparation tools see demand |
| **Portco earnings miss / underperformance** | Operating partner intervention; cost restructuring; vendor consolidation | Not ideal for new vendor adoption but opportunity for "we replace 3 tools at lower cost" |
| **PE firm portfolio day / annual meeting** | Cross-portfolio visibility; operating partner receptive to portfolio-wide pitches | Time your outreach to follow portfolio day agendas |
| **Sector-specific M&A wave** | Signals which verticals PE is deploying capital into | Healthcare IT, fintech, cybersecurity, and infrastructure software are 2025-2026 hot sectors |

---

## 10. Common failure modes

What goes wrong selling into investor-owned companies:

1. **Pitching the portco CEO without acknowledging the sponsor.** The CEO of a PE-backed company is not a fully autonomous buyer. They operate within a value creation plan set by the sponsor. Pitching without referencing the PE ownership, the hold cycle position, or the value creation thesis signals ignorance of the buyer's actual decision-making context.

2. **Speaking features instead of EBITDA.** "Our platform has 50+ integrations" is a feature. "Our platform reduces your sales cycle by 15%, which at your $200M revenue and 25% margin creates $7.5M in incremental EBITDA — at 10x, that's $75M of enterprise value" is a PE conversation. Every value prop must translate to the PE math.

3. **Ignoring the operating partner.** Vendors who win one portco but never engage the operating partner cap their opportunity at that single company. The operating partner controls access to 10-50 portcos. The portfolio expansion motion — one win to many — requires deliberately building the operating partner relationship.

4. **Mis-timing the hold cycle.** Selling a 3-year transformation initiative to a Year 4 portco preparing for exit is a waste of time. Selling a quick-win productivity tool to a Year 1 portco is high-leverage. Mis-timing creates misalignment between your product's time-to-value and the portco's remaining hold period.

5. **Assuming all PE is the same.** Thoma Bravo's software operating playbook is fundamentally different from Roark Capital's franchise roll-up strategy, which is fundamentally different from General Atlantic's growth equity approach. Each firm has a distinct thesis, operating model, and value creation framework. "I sell to PE-backed companies" is not a strategy. "I sell to Thoma Bravo portcos in Year 1-2 of their software optimization cycle" is.

6. **Pricing for enterprise when the portco has PE cost discipline.** PE-backed companies scrutinize every dollar of spend against EBITDA impact. Enterprise pricing that works for a public company with a generous IT budget will face CFO resistance at a PE portco where every $100K of cost is $100K less EBITDA. Pricing must account for PE cost consciousness.

7. **Failing to frame as exit preparation.** For Year 3-5 portcos, the most compelling frame is not "this helps you grow" but "this makes your business more attractive to acquirers." Revenue quality, governance maturity, compliance posture, and data infrastructure all affect exit multiples. Vendors who frame their value as exit-enablement gain access to a budget line that's protected even during cost-cutting.

8. **Not tracking transactions.** PE deals are public information (PitchBook, Bloomberg, press releases). Vendors who don't track PE transactions in their ICP verticals are leaving the highest-leverage trigger events undetected. Set up alerts for every PE firm that acquires companies in your market.

---

## 11. GTM implications for Cambrian seller-users

### For sellers prospecting PE portcos

- **Lead with sponsor awareness.** "I noticed [company] was acquired by [PE firm] in [date]. Based on [firm's] typical value creation playbook, you're probably in the [phase] of your hold cycle..." This opening signals sophistication and gets meetings.
- **Frame everything in EBITDA terms.** Every recommendation, every proposal, every ROI model must convert to EBITDA impact at the portco's estimated multiple. This is non-negotiable for PE conversations.
- **Target the 100-day window.** Set up PitchBook or Bloomberg alerts for PE acquisitions in your ICP verticals. Engage within 30 days of deal announcement. The 100-day plan buying window is the highest-conversion trigger event in B2B.
- **Build the operating partner relationship.** After winning a portco, proactively reach out to the PE firm's operating partner. Share the results. Propose a portfolio briefing. The operating partner's endorsement is worth 10 portco cold calls.
- **Reference across the portfolio.** PE operating partners talk to each other within the firm. "We work with 3 of your portcos and deliver $X aggregate EBITDA impact" is the portfolio expansion pitch.

### For sellers selling to investors directly

- **Due diligence as a use case.** PE firms evaluating acquisitions need competitive intelligence, market mapping, and target company analysis. Cambrian's account intelligence is directly applicable to pre-LOI diligence.
- **Portfolio benchmarking.** Operating partners want to compare portco GTM performance against peers. Cambrian can provide the competitive context that makes portfolio reviews actionable.
- **LP reporting support.** Value creation narratives for LP updates benefit from market intelligence and competitive positioning data. Frame Cambrian as a tool that improves the quality of the portco growth story.

### Tracked transactions (live as of May 2026)

- **GTCR / Blackhawk Network:** STILL IN ADVANCED TALKS, NO CLOSE. July 2025 Bloomberg reports of $4-5B, owners seeking >$5B. No binding agreement as of April 2026 per Tracxn/PitchBook. IPO option remains alive. [verified 05/2026, Bloomberg / Tracxn / PitchBook]
- **Inspire Brands IPO (Roark Capital):** FORMAL PROCESS UNDERWAY. Banks selected April 2026: JPMorgan Chase and Bank of America (lead), Barclays, Goldman Sachs, Morgan Stanley (support). 2025 financials: $33.4B global sales, 33,300+ restaurants, 60 markets, 2,800+ franchisees. [verified 05/2026, SEC filings / Bloomberg]
- **Brookfield / Oaktree:** ANNOUNCED, PENDING CLOSE. Brookfield acquiring remaining ~26% interest to take Oaktree private under 100% ownership. Alt-manager consolidation template. [verified 05/2026, Brookfield corporate filings / Preqin]

---

## 12. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`cambrian_b2b_sales_knowledge.md\` | PE portcos selling B2B products follow the sales motion and pipeline architecture patterns — but with EBITDA overlay on every metric |
| \`cambrian_smb_midmarket_knowledge.md\` | Lower mid-market PE acquisitions follow the PE-backed buying patterns in that layer; operating partner dynamics apply to portcos in the $10M-$500M range |
| \`cambrian_compliance_knowledge.md\` | SOC 2, HIPAA, FedRAMP certifications are often part of the PE value creation plan — compliance tooling is a post-acquisition priority |
| \`cambrian_approval_gates_knowledge_layer.md\` | PE portcos have distinct approval gates: operating partner endorsement, board approval for material spend, CFO sign-off on EBITDA-impacting purchases |

---

*End of layer. Update cadence: quarterly. Critical re-check triggers: Cambridge Associates quarterly PE/VC index updates, Bain Global PE Report (annual), major PE fund raises, tracked transaction status changes (GTCR/BHN, Inspire Brands IPO, Brookfield/Oaktree).*

PE/VC PERFORMANCE BENCHMARKS (Q2 2026 REFRESH — Cambridge Associates & PitchBook):
Cambridge Associates US PE Index (1,700 funds, $1.6T value as of June 2025): 1H 2025 return +3.9% (low single-digit quarterly). Growth equity outperformed buyouts (4.9% vs 3.6%). US VC Index (2,699 funds, $591B): +6.4% (extending recovery). Fund managers distributed MORE capital than called ($78.9B out vs $67.6B in) — the "PE LPs need exits" narrative has empirical backing. 2018-2021 vintages dominated distributions, confirming sponsors are actively monetizing maturing portfolios. VC 2022 vintage at +8.6% — strongest signal the valuation reset is past trough. VC sector allocation: IT 48%, healthcare 26%, industrials 11% = 85% of invested capital. [verified 05/2026, Cambridge Associates US PE/VC Index June 2025]

VALUATION CONTEXT: Fintech multiples 5-15x (from 20-40x in 2021) [verified 05/2026, PitchBook Fintech Analyst Note]. All-cash transactions returning as debt financing reopens, but earn-outs standard for bridging gaps. Pre-planned divestitures baked into deal structures for antitrust (Global Payments/Worldpay as template). Capability-driven deals dominate: fraud prevention, identity verification, embedded finance, AI platforms.

REGULATORY CYCLE: OBBBA (2025) is the largest cross-vertical tax-policy shock. GENIUS Act (July 2025) settled stablecoin framework. DORA (Jan 2025, EU) and MiCA (transitional through mid-2026) reshaping European fintech compliance. PACE Act and Fed "skinny account" debate are live 2026 fintech files. Trump administration pro-competition executive orders structurally pro-M&A.

KNOWN TRAPS (meta-knowledge — where this vertical's data goes stale or gets misinterpreted):
- GTCR/BHN deal: "advanced talks" since July 2025, NO binding agreement as of May 2026. Do NOT state as closed. Verify before every use.
- Inspire Brands IPO: formal process underway but not priced. Banks selected != IPO completed. Do not cite a valuation until pricing.
- Brookfield/Oaktree: announced but pending close. Do not state as completed unless confirmed.
- PE dry powder ($3.6T) is a global aggregate from multiple data providers with different methodologies. Bain, PitchBook, and Preqin all report slightly different numbers. [verified 05/2026, Bain Global PE Report 2025]
- "PE pays ~3 turns more" is a market-wide average. Sector-specific premiums vary dramatically (healthcare > fintech > industrials). [verified 05/2026, GF Data / PitchBook]
- Cambridge Associates PE/VC index returns are NET of fees and carry. Gross returns are materially higher — do not confuse the two.
- The "70% of PE firms mandate AI adoption" stat is from a survey of operating partners, not a census. Selection bias likely inflates the number. [verified 05/2026, Bain PE Operating Partners Survey 2025]
- Gartner's ">40% agentic AI projects canceled by 2027" is a PREDICTION, not a measurement [verified 05/2026, Gartner]. Treat as directional forecast.
- Fintech multiple compression (20-40x to 5-15x) is a range across subsectors. Payments infrastructure trades higher than consumer fintech. [verified 05/2026, PitchBook Fintech Analyst Note]
- CRE loan maturity wall ($957B) is a 2025 figure that shifts quarterly as extensions and refinancings occur. Confirm current figure before using. [verified 05/2026, MSCI Real Assets]
- PitchBook flagged potential 2026 IPOs (SpaceX, OpenAI, Anthropic) — these are analyst speculation, not confirmed filings.
`;

export const INVESTOR_INTELLIGENCE_DISCOVERY = `
INVESTOR INTELLIGENCE DISCOVERY (use when buyer is PE, VC, family office, or evaluating companies):

- What capital structure governs this company? What's the dominant metric your board/sponsor measures — EBITDA growth, NRR, profitability, or exit readiness?
- How is your sponsor thinking about value creation over the next 18-24 months? What's the maximum payback period for discretionary initiatives?
- How is AI investment positioned at board level — defensive (margin protection) or offensive (growth driver)? Where does it rank on the value creation plan?
- What specific KPIs or narratives do you need to prove for the next LP update, investor day, or exit preparation?
- If your sponsor owns other portfolio companies in this space, have they invested in similar initiatives? What was cost, payback, and competitive impact?
`;
