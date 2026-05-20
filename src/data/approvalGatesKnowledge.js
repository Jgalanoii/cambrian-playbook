// src/data/approvalGatesKnowledge.js
//
// Approval Gates, Steering Committees & Deal Desk Review — cross-cutting
// knowledge layer for enterprise procurement governance.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_APPROVAL_GATES (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural, durable) only.
//   - No Tier 3 facts (no named current execs, no company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Version: 1.0.0, verified 2026-05-20.
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   Gartner, Technology Acquisition Behaviors Survey (2025):
//     gartner.com/en/sales/insights/buying-groups
//   Forrester, B2B Buying Study — The New Committee-Driven Purchase (2025):
//     forrester.com/research/b2b-buying-study
//   MEDDPICC framework (Andy Whyte, "MEDDICC" Cuvio Press):
//     meddicc.com
//   Challenger Inc., The Challenger Customer (Brent Adamson, CEB/Gartner):
//     challengerinc.com
//   IETF-style RFC governance model (structural):
//     ietf.org/standards/process
//   McKinsey & Co., "How B2B Decision Making Is Changing" (2024):
//     mckinsey.com/capabilities/growth-marketing-and-sales
//   Corporate Executive Board / Gartner, "The New B2B Buying Journey" (2024-2025):
//     gartner.com/en/sales
//
// -- KNOWN TRAPS --
//   - Committee composition varies widely even within the same industry.
//     Never assume a specific company's committee structure — always discover.
//   - Delegation of Authority (DoA) thresholds are company-specific.
//     The ranges here are structural archetypes, not absolute rules.
//   - "Steering Committee" can mean entirely different bodies at different
//     orgs — some are advisory, some have veto power, some are rubber stamps.
//     Always qualify the committee's actual authority.
//   - Security review timelines are lengthening industry-wide (SOC 2, pen
//     test, DPIA). Never promise a timeline — discover the org's actual SLA.
//   - Board-level approval thresholds have dropped post-2022 (tighter
//     governance). Do not assume legacy thresholds still apply.

// -- APPROVAL GATES CROSS-CUTTING INJECTION --
// Injected whenever the target account is mid-to-enterprise scale and the
// brief needs gate-aware sequencing, champion enablement, or MAP construction.

export const APPROVAL_GATES_INJECTION = `
APPROVAL GATES, STEERING COMMITTEES & DEAL DESK — CROSS-CUTTING CONTEXT
(use when the target is mid-market or enterprise with formal procurement governance):

§1 — THE 7 FUNCTIONAL FAMILIES OF APPROVAL BODIES (structural):
Every enterprise procurement routes through some subset of these 7 families.
The seller must map which ones are active for THIS deal, in THIS org.

| Family                   | Typical Body                       | What It Gates                                | Typical Cadence       |
|--------------------------|------------------------------------|----------------------------------------------|-----------------------|
| 1. FINANCIAL             | CFO / Finance Committee / Board    | Budget allocation, CapEx vs OpEx, ROI case   | Quarterly or ad-hoc   |
| 2. TECHNOLOGY            | Architecture Review Board (ARB)    | Stack fit, integration risk, scalability     | Bi-weekly or monthly  |
| 3. SECURITY & PRIVACY    | CISO / Security Review Board       | SOC 2, pen test, DPIA, data residency        | Per-vendor (triggered)|
| 4. PROCUREMENT / VENDOR  | Procurement / Vendor Mgmt Office   | Contract terms, commercial negotiation, SLA  | Per-deal              |
| 5. LEGAL & COMPLIANCE    | Legal / Compliance Committee       | Regulatory, IP, liability, DPA               | Per-deal              |
| 6. BUSINESS / DOMAIN     | Steering Committee / Sponsor Group | Strategic alignment, use-case priority        | Monthly or quarterly  |
| 7. EXECUTIVE / BOARD     | C-Suite / Board Sub-Committee      | Threshold-based: large deals, strategic bets | Quarterly (scheduled) |

KEY INSIGHT: Families 1-5 are evaluative (they can BLOCK). Family 6 is directional
(it PRIORITIZES). Family 7 is ratifying (it APPROVES or ESCALATES). Sellers must
thread all blocking families before reaching ratification.

§2 — THE UNIVERSAL GATING LIFECYCLE (structural — 5 stages):
Regardless of org size, enterprise procurement follows this pattern:

STAGE 1 — NEED RECOGNITION & SPONSOR ALIGNMENT
  - A business sponsor identifies the need and secures directional support.
  - Output: Informal mandate, sometimes a "request to explore."
  - Seller action: Qualify the sponsor's authority and budget ownership.

STAGE 2 — REQUIREMENTS & EVALUATION
  - Cross-functional evaluation team forms (the "buying group").
  - Technical, security, and compliance reviews begin in parallel.
  - Output: Shortlist, evaluation scorecards, proof-of-concept results.
  - Seller action: Multi-thread into every evaluating family. Provide
    artifacts proactively (security questionnaires, architecture diagrams,
    reference customers).

STAGE 3 — BUSINESS CASE & COMMERCIAL NEGOTIATION
  - Finance builds or validates the ROI / TCO model.
  - Procurement negotiates terms, pricing, SLAs.
  - Output: Business case document, red-lined contract.
  - Seller action: Arm the champion with the business case. Anticipate
    procurement's playbook (discount demands, multi-year pressure, benchmarking).

STAGE 4 — APPROVAL CIRCUIT
  - The deal routes through the required approval bodies in sequence or parallel.
  - Each body applies its gate criteria and either approves, requests changes,
    or blocks. A SINGLE BLOCK resets the circuit to the blocking gate.
  - Output: Signed approvals (often a routing sheet or digital workflow).
  - Seller action: Track the circuit. Know which gates have cleared, which
    are pending. Coach the champion through each gate's objection pattern.

STAGE 5 — EXECUTION & POST-APPROVAL
  - Contract signing, PO issuance, onboarding, kick-off.
  - Output: Executed contract, PO, implementation plan.
  - Seller action: Ensure continuity — the champion must stay engaged
    through implementation to prevent "buyer's remorse" or re-scoping.

§3 — DELEGATION OF AUTHORITY (DoA) THRESHOLDS (structural archetype):
Enterprises define spend thresholds that determine which approval level is required.
These are ORG-SPECIFIC — always discover the actual thresholds. Typical structure:

| Spend Level          | Typical Approval Required                    | Cycle Impact        |
|----------------------|----------------------------------------------|---------------------|
| <$25K                | Manager / Director (single signer)           | Days to 1-2 weeks   |
| $25K–$100K           | VP + Procurement review                      | 2-6 weeks           |
| $100K–$500K          | SVP/C-level + full procurement + legal       | 1-3 months          |
| $500K–$1M            | C-suite + steering committee + board notify  | 2-4 months          |
| >$1M                 | Board or board sub-committee approval        | 3-6+ months         |

IMPORTANT: Post-2022, many enterprises LOWERED these thresholds (tighter governance).
A deal that was VP-level in 2021 may now require C-suite sign-off. Always verify.

§4 — VERTICAL QUICK-REFERENCE MATRIX (structural):
Different industries weight different gate families more heavily.

| Vertical              | Heaviest Gates                         | Unique Gate                          |
|-----------------------|----------------------------------------|--------------------------------------|
| Financial Services    | Security, Compliance, Legal            | Regulatory / OCC / FDIC review       |
| Healthcare            | Security (HIPAA), Compliance, Legal    | Clinical safety / IRB review          |
| Government / Public   | Procurement (formal RFP), Legal        | FedRAMP / StateRAMP authorization     |
| Insurance             | Security, Compliance, Actuarial        | State DOI regulatory review           |
| Technology / SaaS     | Architecture (ARB), Security           | SOC 2 / ISO 27001 attestation        |
| Manufacturing         | Financial (CapEx), Business steering   | EHS / safety review                  |
| Retail / CPG          | Financial, Procurement                 | Category management review            |
| Education             | Procurement (bid process), Legal       | Faculty / academic senate review      |

§5 — MULTI-THREADING: MINIMUM VIABLE THREAD MAP (structural):
For any deal >$100K, the seller MUST have threads into at least:
  1. CHAMPION — the internal advocate who owns the business case.
  2. ECONOMIC BUYER — the person with budget authority at the deal's DoA level.
  3. TECHNICAL EVALUATOR — the person running the ARB / technical review.
  4. SECURITY / COMPLIANCE CONTACT — the gatekeeper for security review.
  5. PROCUREMENT LEAD — the commercial negotiator.
Missing ANY of these threads means the seller has a blind spot in the approval circuit.
For deals >$500K, add: EXECUTIVE SPONSOR (C-level) + LEGAL REVIEWER.

§6 — KEY ARTIFACTS REQUIRED ACROSS GATES (structural):
Proactively providing these artifacts accelerates gate clearance:
  - Security: SOC 2 Type II report, penetration test summary, data flow diagram,
    completed SIG/CAIQ questionnaire, DPIA (where GDPR applies), BAA (healthcare).
  - Technical: Architecture diagram, API documentation, integration runbook,
    scalability / performance benchmarks, disaster recovery / RTO-RPO.
  - Financial: ROI model (with customer-validated assumptions), TCO comparison,
    pricing proposal with options, payment terms.
  - Legal: DPA (data processing agreement), MSA red-line, SLA with penalties,
    insurance certificates, IP / indemnification terms.
  - Business: Executive summary / business case, reference customers (same
    vertical + same scale), implementation timeline, success metrics / KPIs.

§7 — CHAMPION ENABLEMENT ESSENTIALS (structural):
The champion must be EQUIPPED to sell internally through each gate:
  - Give them a 1-page executive summary they can forward without editing.
  - Build the business case WITH them (not FOR them) — they own the numbers.
  - Prepare gate-specific objection responses:
    * Finance: "What's the payback period?" → pre-built ROI model.
    * Security: "Are you SOC 2 compliant?" → attestation letter + report.
    * ARB: "How does this fit our stack?" → integration architecture diagram.
    * Procurement: "Can we benchmark this?" → competitive comparison (honest).
    * Legal: "What about data residency?" → DPA + data flow diagram.
  - Coach them on committee dynamics: who is the likely objector? What is
    that person's historical concern pattern? Pre-wire the response.
  - After each gate: debrief with the champion. What was asked? What was
    the sentiment? What is the next gate's likely objection?

§8 — ANTI-PATTERNS THAT KILL DEALS AT GATES (structural):
  1. SINGLE-THREADED SELLING: relying on one contact to navigate all gates.
     When that person is on PTO, changes roles, or loses political capital,
     the deal stalls with no recovery path.
  2. SECURITY SURPRISE: reaching Stage 4 without having started the security
     review. Security reviews take 4-12 weeks. If they start at Stage 4,
     they ADD 4-12 weeks to close.
  3. MISSING THE COMMITTEE CYCLE: most steering committees and boards meet on
     fixed cadences (monthly, quarterly). Miss the cycle window and the deal
     waits for the next one. A Q4 deal that misses the December board meeting
     may not close until February.
  4. CHAMPION WITHOUT AUTHORITY: the champion is enthusiastic but lacks the
     organizational standing to drive the business case through gates.
     The deal generates activity but never converts.
  5. PROCUREMENT AMBUSH: the champion promised "procurement is a formality"
     but procurement introduces new requirements, competitive benchmarks, or
     discount demands that reset negotiations.
  6. SCOPE CREEP AT GATE: a committee member adds requirements or use cases
     during the approval circuit, expanding scope and resetting evaluation.
  7. NO BUSINESS CASE DOCUMENT: the champion is selling on excitement, not
     economics. Finance rejects because there is no written ROI case.

§9 — RIVER FRAMEWORK MAPPING TO GATING LIFECYCLE (structural):
Each RIVER stage maps to specific gating activities:

REALITY → Gate DISCOVERY
  - Map which of the 7 families are active for this deal.
  - Identify the DoA threshold and required approval level.
  - Discover committee cadences and upcoming meeting dates.
  - Assess: has the prospect started any evaluative gates already?

IMPACT → Gate JUSTIFICATION
  - Quantify the cost of the problem in terms each gate cares about:
    * Finance gate: revenue impact, cost savings, payback period.
    * Security gate: risk reduction, compliance gap closure.
    * ARB gate: technical debt reduction, integration cost avoidance.
  - Build the business case that will survive every gate's scrutiny.

VISION → Gate-Aware FUTURE STATE
  - Frame the vision in terms that resonate with each approval body.
  - Finance sees ROI. ARB sees architectural fit. Security sees risk posture.
  - The champion presents ONE vision but MULTIPLE framings.

ENTRY → Gate THREADING
  - Identify and engage the key contact in each active gate family.
  - Start security and compliance reviews EARLY (they are long-pole).
  - Provide artifacts proactively — do not wait to be asked.

ROUTE → Gate-Sequenced MUTUAL ACTION PLAN (MAP)
  - Build the MAP backwards from the target close date.
  - Account for committee cadences (monthly board = hard constraint).
  - Sequence: technical + security reviews in parallel → business case →
    procurement → approval circuit → executive/board ratification.
  - Every MAP milestone is keyed to a specific gate clearance.
`;

// -- APPROVAL GATES DISCOVERY QUESTIONS --
// Injected into discovery question generation when the account is mid-market
// or enterprise and gate mapping is relevant. Organized by RIVER stage.

export const APPROVAL_GATES_DISCOVERY = `
APPROVAL GATES DISCOVERY ANGLES (use when the prospect is mid-market or enterprise with formal procurement governance):

REALITY stage — map the gate landscape:
- Which committees or review boards evaluate vendor decisions at your company?
- What's the approval threshold for a commitment this size — does it stay at VP level or escalate to C-suite / board?
- How is your procurement team structured — do they run competitive benchmarks, or review deals the business brings forward?
- Is there a formal Architecture Review Board or technical evaluation process?
- What does your security review look like for new vendors — SOC 2 requirement, pen test, DPIA?
- How many people are typically involved in a decision of this scale?
- Are there upcoming committee meeting dates we should be aware of?

IMPACT stage — quantify gate friction:
- What happens when a deal misses a committee cycle — how long until the next window?
- How long does your security review typically take from submission to clearance?
- What's the longest a procurement negotiation has taken for a deal this size?
- When was the last time a vendor deal stalled at a gate — what caused it?
- How much does a delayed vendor decision cost in terms of the problem persisting?
- What percentage of evaluated vendors actually make it through your full approval circuit?

VISION stage — gate-aware future framing:
- If we could proactively address every review board's requirements upfront, how would that change your timeline?
- What would it look like if your team could present a fully pre-vetted business case at the next steering committee?
- How would having a pre-completed security package (SOC 2, DPA, architecture diagram) affect your confidence in timeline?
- If we built the ROI model together so it passes finance scrutiny on the first pass, would that change the internal conversation?

ENTRY stage — who to engage at each gate:
- Who owns the budget decision for this initiative — and is that the same person who signs off, or does it escalate?
- Who runs the security / compliance review, and can we engage them directly to start early?
- Is there a procurement lead assigned yet, and what's the best way to introduce ourselves?
- Who on the Architecture Review Board would evaluate our technical fit?
- Is there a steering committee sponsor who is championing this initiative?
- Who is the most likely objector in the approval circuit, and what is their typical concern?

ROUTE stage — MAP construction keyed to gate sequencing:
- What's your target timeline for having this decision made — and is there a business event driving that date?
- Can we map out the approval sequence together — which gates run in parallel, which are sequential?
- When is the next board / steering committee meeting where this could be presented?
- What artifacts do you need from us to clear security review — can we start that submission this week?
- Would it help if we provided a pre-built business case template aligned to how your finance team evaluates investments?
- What's the fastest a deal of this size has moved through your approval process, and what made that possible?
`;

// -- APPROVAL GATES SCORING CONTEXT --
// Calibrates ICP fit scoring when gate complexity affects deal viability.
// Used to adjust cycle-time estimates and fit confidence.

export const APPROVAL_GATES_SCORING = {
  highFrictionGates: [
    { pattern: "Board-level approval required (deal > org's board threshold)", impact: "Adds 1-3 months; must align to quarterly board cadence", fitAdjustment: "Extend cycle estimate +60-90 days" },
    { pattern: "FedRAMP / StateRAMP authorization required (government)", impact: "6-18 month authorization process if not already held", fitAdjustment: "If seller lacks FedRAMP, likely DQ for federal deals" },
    { pattern: "Multi-entity approval (parent company + subsidiary sign-off)", impact: "Dual approval circuits; 2x the gate threading", fitAdjustment: "Extend cycle estimate +30-60 days" },
    { pattern: "Formal RFP / competitive bid process required", impact: "Structured timeline, limited seller access to evaluators", fitAdjustment: "Lower win probability unless seller shaped the RFP" },
    { pattern: "Security review with no SOC 2 Type II (seller gap)", impact: "Seller must complete SOC 2 audit first (3-6 months)", fitAdjustment: "Potential DQ if prospect requires SOC 2 and seller lacks it" },
    { pattern: "Union or works council consultation required", impact: "Labor review adds 2-8 weeks depending on jurisdiction", fitAdjustment: "Extend cycle estimate +30-60 days" },
    { pattern: "Regulatory pre-approval required (financial services, healthcare)", impact: "Regulator review is outside both parties' control", fitAdjustment: "Extend cycle estimate +60-120 days; high uncertainty" },
  ],
  gateAccelerators: [
    { signal: "Champion is a C-level or SVP with direct budget authority", impact: "Can collapse multiple approval layers; fewer gates required" },
    { signal: "Existing vendor relationship / contract expansion (not new vendor)", impact: "Bypasses security re-review and procurement onboarding in many orgs" },
    { signal: "Pre-approved vendor list / preferred vendor status", impact: "Procurement gate is streamlined; security review may be waived or abbreviated" },
    { signal: "Seller has completed SOC 2 Type II + relevant compliance certifications", impact: "Security gate clears in days instead of weeks" },
    { signal: "Urgent business event driving timeline (regulatory deadline, system EOL, competitive threat)", impact: "Compresses all gates; committees may schedule ad-hoc sessions" },
    { signal: "Small initial deal under DoA threshold with expansion path", impact: "Single-signer approval; fast close; land-and-expand" },
    { signal: "Procurement-friendly commercial terms (standard MSA, flexible payment)", impact: "Reduces procurement negotiation from weeks to days" },
    { signal: "Champion has successfully sponsored similar purchases before", impact: "Knows the internal playbook; can sequence gates optimally" },
  ],
  keySignals: {
    positive: [
      "Prospect has named a project sponsor with budget authority",
      "Security review has already started or prospect requests security artifacts proactively",
      "Prospect shares internal timeline with specific committee meeting dates",
      "Champion is building the business case and asks for ROI inputs",
      "Procurement is engaged early (not introduced as a blocker late)",
      "Multiple stakeholders from different gate families attend demos or calls",
      "Prospect asks about implementation timeline (thinking past the purchase decision)",
      "Existing customer expanding scope (reduced gate friction)",
      "Champion has executive sponsor backing the initiative",
    ],
    negative: [
      "Single-threaded — only one contact, no access to other gate stakeholders",
      "Champion cannot articulate the approval process or does not know the DoA threshold",
      "No business case document exists and champion resists building one",
      "Security review has not started and close date is <60 days away",
      "Procurement has not been engaged and champion says 'procurement is just a formality'",
      "Committee meeting cadence is quarterly and next meeting is >8 weeks out",
      "Prospect declines to share internal approval timeline or stakeholder map",
      "Champion lacks organizational standing (junior title, new to role, no executive sponsor)",
      "Multiple competing priorities — this initiative is not in the top 3 for the steering committee",
      "Prior vendor evaluation failed at a gate — unresolved objections from that attempt",
    ],
  },
};
