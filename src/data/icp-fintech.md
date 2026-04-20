---
title: "ICP — FinTech Playbook"
parent: "ICP & Customer Fit Knowledge Base"
industry: fintech
tags: [icp, fintech, banking, embedded-finance, baas, lending, regulated]
last_updated: 2026-04-20
---

# ICP — FinTech Playbook

> Vertical playbook for fintech sellers. Complements the core knowledge base and extends Part 3 of the core doc.

## 1. First question: which fintech are you?

"Fintech" is six industries in a trenchcoat. Before defining ICP, disambiguate:

- **Banking-as-a-Service (BaaS) / embedded finance** — sells infrastructure to non-banks who want to embed financial products.
- **Neobanks / digital banks / challenger banks** — consumer or SMB-facing deposit and card products.
- **Lending** — consumer, SMB, commercial; originators vs. servicers vs. capital markets enablers.
- **Wealth / investment platforms** — B2C direct, B2B2C RIA tech, institutional asset management tech.
- **Insurtech** — underwriting, distribution, claims; P&C vs. life vs. health.
- **RegTech / compliance** — KYC, AML, fraud, sanctions, transaction monitoring, regulatory reporting.
- **Capital markets / data** — trading infrastructure, data providers, research platforms.
- **CFO / B2B finance ops tools** — AP/AR automation, treasury, spend management, close tools, FP&A.
- **Crypto / digital assets** — exchanges, custody, stablecoin infrastructure, DeFi enablement.

Each has different buyers, sales cycles, regulatory overlays, and ICPs. A "fintech ICP framework" that treats these as one is useless. The rest of this doc focuses on **B2B and B2B2X fintech** selling to banks, fintechs, or non-financial companies embedding finance.

## 2. ICP patterns that work in fintech

Layers that matter beyond standard B2B:

- **Regulatory posture** (as buyer): what regulatory regime do they operate under? Bank (OCC/FDIC/NCUA/state)? Fintech with sponsor-bank relationship? Unregulated embedder? Non-bank financial institution (e.g., money transmitter)?
- **Program maturity**: do they already run a financial product, or are they launching one? Existing programs buy to replace; new programs buy to stand up.
- **Volume profile**: transactions/month, payment volume, accounts on file, AUM. This dictates pricing tier and technical requirements more than headcount.
- **Risk appetite**: conservative (community bank) vs. aggressive (growth-stage neobank) → very different buying timelines and reference expectations.
- **Technology posture**: core banking stack (Jack Henry, FIS, Fiserv, newer cores like Finxact/Mambu); engineering maturity; API consumer vs. vendor-managed.
- **Compelling triggers**: see Section 4.

## 3. The fintech buying committee

Larger, slower, and more blocker-heavy than generic B2B SaaS. Minimum roster:

- **Economic buyer** — CFO, Head of Payments/Banking, VP Finance Ops, Chief Risk Officer (for risk/compliance products).
- **Champion** — product owner, senior ops lead, or payments operations manager.
- **Technical evaluator** — engineering lead with payments or banking domain fluency.
- **Risk & Compliance** — Chief Compliance Officer, BSA Officer, Fraud Ops. **Frequent deal killer.**
- **Legal & Regulatory** — in-house or outside counsel; reviews for BSA/AML, state money transmitter exposure, data residency, Reg E/Z/CC, Nacha, Durbin, PSD2/SCA.
- **Security** — SOC 2, pen tests, SIG Lite / SIG Core questionnaires, architecture review.
- **Procurement / Vendor Management** — third-party risk management (TPRM); critical at banks and regulated institutions.
- **Internal Audit** — present at banks and large fintechs for control mapping.
- **Sponsor bank** (if applicable) — for fintech-to-fintech sales where a sponsor bank relationship is involved, their approval can gate the deal.

**Practical consequence:** a fintech "ICP" that lists only the economic buyer ignores the people who actually kill deals. A working ICP includes a blocker-persona map with disqualifying criteria.

## 4. Trigger events in fintech

In-market urgency tends to come from:

- **Regulatory action** — exam finding, MRA (Matter Requiring Attention), consent order, new rule (e.g., Section 1033 open banking, CRA modernization). Named deadline forces purchase.
- **Incumbent vendor failure** — outage (Evolve, Synapse-style), sunset, M&A-driven price increase, service deterioration.
- **Volume threshold crossed** — outgrowing a processor's limits, triggering new settlement structure.
- **Launch of new product or rail** — adding RTP/FedNow, launching a card program, new lending product, new geo.
- **Fraud / loss event** — chargeback spike, synthetic fraud incident, ATO wave → forces risk-tool purchase.
- **Sponsor bank change** — fintech loses or adds a sponsor bank; everything upstream gets re-papered.
- **Audit / SOX / ASC 606 issue** — forces GL-ready reporting and reconciliation tooling.
- **Funding round or M&A** — new capital triggers stack modernization; acquisition forces integration decisions.
- **Executive hire** — new Head of Risk, CCO, Head of Payments (first 6 months).

Rule: in fintech, a compelling event is almost always *externally imposed*. Internal "we'd like this" never moves on timeline. Find the external clock.

## 5. Positioning — unique-attribute categories

For fintech, differentiation typically lives in:

- **Licensing / network membership** — money transmitter licenses, card network sponsorship, ACH originator status, Fedwire/FedNow connectivity, RTP participation, Visa/Mastercard principal membership.
- **Certifications** — PCI Level 1, Nacha Preferred Partner, ISO 20022 readiness, SOC 2 Type II.
- **Sponsor bank relationships** — named, stable, multi-bank if possible (reduces single-point-of-failure concern post-Synapse).
- **Settlement speed / economics** — same-day ACH, RTP, instant, stablecoin rails; FX spreads for cross-border.
- **Programmable primitives** — API completeness, webhook reliability, SDK maturity, sandbox quality.
- **Dispute / chargeback handling** — automated, Reg E timeline-compliant.
- **Reconciliation / reporting** — GL-ready outputs, audit trails, ASC 606 support.
- **Regulatory-ready posture** — sample exam answers, MRA-response playbooks, TPRM documentation kit.

If none of your "unique attributes" live in this list, your fintech positioning is probably commoditized and price-competitive.

## 6. Pricing & model patterns

Fintech buyers understand and expect hybrid pricing:

- **Platform fee + per-transaction** — near-universal for payments and BaaS.
- **Basis points (bps)** on volume — common for lending, FX, and card programs.
- **Interchange sharing** — for BaaS and card programs, revenue share on interchange is a deal mechanic.
- **Implementation / integration fees** — one-time, often substantial for banks and regulated buyers.
- **Committed minimums** — monthly or annual floors.
- **Tiered volume pricing** — standard above SMB.

Fintech buyers are unusually price-sophisticated and will negotiate on multiple axes (platform fee, per-txn, revenue share, minimums, ramp). A rigid pricing page is a disadvantage above mid-market.

## 7. Regulatory / compliance overlay (as seller)

To close fintech deals, you typically need:

- **SOC 2 Type II** — baseline.
- **PCI-DSS** (Level appropriate to volume) — for payments-adjacent.
- **ISO 27001** — frequently required for bank buyers.
- **Third-party risk management (TPRM) documentation kit** — SIG Lite minimum; often SIG Core; often custom bank questionnaires.
- **BCP / DR documentation** — tested, with RTO/RPO stated.
- **Model risk / fairness documentation** (if AI/ML is used) — SR 11-7 alignment for bank buyers.
- **Financial strength / insurance** — E&O, cyber, sometimes D&O.

The compliance kit is an ICP filter in both directions: buyers filter you out for missing items, and you should filter buyers by whether your kit matches their minimum bar. A Series A fintech selling to a top-20 US bank with only SOC 2 Type I will lose the deal no matter how good the product.

## 8. Archetypal ICP slices for fintech sellers

**A — "Series B/C neobank needing a fraud/risk layer"**
US-based challenger bank or fintech, Series B/C, 100k–2M active accounts, actively experiencing synthetic fraud or ATO issues, with a newly-hired Chief Risk or Fraud Ops lead (first 6 months), sponsor-bank relationship stable, willing to integrate new vendor within the quarter. Trigger: fraud incident, sponsor-bank pressure, or examination finding.

**B — "Community bank modernization"**
US community bank, $500M–$5B in assets, recent CEO or COO change, currently on Jack Henry/FIS/Fiserv core, has publicly stated digital transformation initiative, retail-deposit-focused, has named CIO with >2 years remaining tenure. Trigger: core contract renewal within 24 months, competitive pressure, or board-mandated digital strategy.

**C — "Non-financial company launching embedded finance"**
Vertical SaaS company, $25M+ ARR, 100+ customers with recurring payment flows, has CPO who has advocated for embedded finance in last 12 months, has engineering capacity for API integration, operates in a vertical where payment/banking embed creates clear unit economics (marketplaces, logistics, construction, healthcare). Trigger: strategic plan update, revenue diversification pressure, or competitor embedded-finance launch.

**D — "Mid-market CFO tools buyer (B2B fintech)"**
US mid-market, $100M–$1B revenue, recently hired CFO or Controller (first 12 months), currently on NetSuite/Sage Intacct/QuickBooks Enterprise, has outgrown their accounting stack's native capabilities in [AP automation / expense management / treasury / FP&A], evidence of private equity ownership or IPO preparation. Trigger: new CFO, audit cycle, PE platform rollup, or readiness for exit.

## 9. Common failure modes

- **Treating "fintech" as a single market.** Subdivision is required before ICP work begins.
- **Ignoring sponsor bank dynamics.** A deal can be killed by a sponsor bank you never met.
- **Underestimating security review timeline.** Enterprise bank security reviews are 4–9 months. Price this into the sales cycle.
- **Naming features, not regulatory posture.** Fintech buyers filter on compliance before features.
- **Missing the compelling-event lens.** Without an external clock (regulatory, contractual, volume-driven), fintech deals slip indefinitely.
- **Under-resourcing reference calls.** Fintech is a reference-driven market; good logos + great references > great product alone.
- **Underestimating TPRM cost.** A bank TPRM cycle can cost $50k+ of internal time. Price and prioritize accordingly.

## 10. Resources

**Newsletters / analysts:**
- *Fintech Takes* (Alex Johnson) — most rigorous US fintech analyst writing.
- *Fintech Business Weekly* (Jason Mikula) — BaaS/bank-fintech partnership focus.
- *Net Interest* (Marc Rubinstein) — financial services, including fintech.
- *Not Boring* (Packy McCormick) — strategy-heavy fintech deep dives.
- *Moves in Banking/Fintech* (Ron Shevlin) — Forbes column.
- *This Week in Fintech* — news digest.
- *Payments Dive*, *PYMNTS*, *The Paypers* — industry news.
- *a16z Fintech* — thesis-level writing.

**Research / data:**
- CB Insights fintech reports & market maps.
- McKinsey Global Payments Report (annual).
- Federal Reserve Payments Study (triennial).
- Aite-Novarica / Datos Insights (analyst reports).
- Nacha statistics (ACH volume).
- Cornerstone Advisors, Celent, Forrester — analyst coverage of FI buyers.

**Trade associations:**
Nacha, Electronic Transactions Association (ETA), American Bankers Association (ABA), Independent Community Bankers of America (ICBA), Conference of State Bank Supervisors (CSBS), CFPB, FFIEC.

**Events:**
Money 20/20, Fintech Meetup, Finovate, American Banker conferences, NACHA Payments, Bank Director events, ICBA Live.

**Communities:**
Pavilion (fintech subvertical), Alloy Labs (community bank innovation network), Bank Innovation, Fintech Sandbox.
