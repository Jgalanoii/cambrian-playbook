---
title: "ICP — Payments Playbook"
parent: "ICP & Customer Fit Knowledge Base"
industry: payments
tags: [icp, payments, card-networks, acquiring, processing, issuing, ach, rtp]
last_updated: 2026-04-20
---

# ICP — Payments Playbook

> Vertical playbook for companies selling payments infrastructure, processing, acquiring, issuing, or adjacent services. Sibling to the FinTech playbook.

## 1. Why payments deserves its own playbook

Payments shares regulatory DNA with fintech but has unique structural features:

- **Multi-sided market**: merchants, issuers, acquirers, networks, processors, gateways, ISOs, ISVs, PayFacs, facilitators — each a distinct buyer persona and often a distinct ICP.
- **Margin-sensitive by design**: basis points matter; pricing is the primary lever in many deals.
- **Network-gated**: Visa/Mastercard/Amex/Discover operating rules control what's possible, and compliance with them is a gate.
- **Regulated but fragmented**: Durbin, Dodd-Frank, PCI-DSS, Nacha, state money transmitter laws, CFPB Reg E/Z, OCC/FDIC guidance for bank partners, evolving CFPB Section 1033 rules.
- **Unit economics dominate messaging**: "save X bps per transaction" is the lingua franca.

The ICP question "who is our customer?" always includes *where in the payments value chain they sit*.

## 2. The payments value chain (ICP requires locating yourself and your buyer)

Stylized flow for card payments:

```
Cardholder → Issuer (bank/program) → Card Network (Visa/MC/Amex/Discover)
         → Acquirer (merchant bank) → Processor → Gateway → Merchant
                                            ↕
                                         (PayFac / ISO / ISV)
```

For ACH, the flow is different:

```
Originator → ODFI (bank) → ACH Operator (Fed/EPN) → RDFI (bank) → Receiver
```

For RTP/FedNow: similar to ACH but instant settlement through FedNow or TCH RTP.

**Your ICP depends on which of the above your buyer is.** Selling to an issuer is nothing like selling to a merchant. Selling to a PayFac is nothing like selling to an ISO. Explicitly name the node.

## 3. Buyer archetypes by value-chain position

Each node has a distinct buying committee and pain set. Most common buyer types and their hallmarks:

**Merchants (direct-to-merchant sellers):**
- Buyer: CFO, COO, Head of Finance, Head of E-commerce, VP Retail.
- Pain: processing cost, fraud/chargebacks, integration complexity, multi-currency, failed transactions.
- Sales cycle: 30–120 days for mid-market; 6–18 months for enterprise/national.

**ISVs / Vertical SaaS embedding payments (PayFac-as-a-Service buyers):**
- Buyer: CEO, CPO, VP Product.
- Pain: revenue share vs. cost of building, compliance burden, customer experience.
- Sales cycle: strategic; 6–12 months.

**PayFacs / Facilitators:**
- Buyer: COO, Head of Payments, Chief Risk Officer.
- Pain: underwriting speed, risk exposure, sub-merchant KYC, processor concentration.
- Sales cycle: 3–9 months; gated by sponsor relationships.

**ISOs / agents:**
- Buyer: Owner/President (often founder-operator), Head of Sales.
- Pain: residual protection, portfolio attrition, uplift tools, boarding speed.
- Sales cycle: 30–90 days; relationship-driven.

**Processors / Gateways:**
- Buyer: Head of Product, CTO.
- Pain: differentiation, vertical expansion, token portability, orchestration.
- Sales cycle: long; platform-level decisions.

**Issuing buyers (programs, neobanks, reward programs):**
- Buyer: Head of Card Program, CPO, COO.
- Pain: issuer processor choice, program manager selection, interchange optimization, disputes/chargebacks handling, card benefits.
- Sales cycle: 6–18 months; sponsor-bank-gated.

**Banks / FIs (as payments buyers):**
- Buyer: Head of Payments, EVP Retail Banking, EVP Commercial Banking, CIO.
- Pain: core-imposed constraints, modernization (FedNow/RTP/ISO 20022), competitive pressure from neobanks, small-business-customer retention.
- Sales cycle: 9–24 months; exam-season-sensitive.

## 4. Trigger events in payments

Highest-leverage compelling events:

- **Interchange plus / IC+ pricing renegotiation** — merchant wants to move off blended pricing.
- **PCI scope expansion** — new compliance requirement, new payment type, new integration.
- **Chargeback ratio threshold breach** — approaching Visa/MC monitoring program thresholds (VAMP, VDMP, MATCH).
- **Processor outage or sunset** — incumbent failure drives re-platforming.
- **New payment rail adoption** — enabling FedNow/RTP, stablecoin settlement, BNPL.
- **Card program launch or migration** — issuing-side trigger; usually 12-month window.
- **Sponsor bank change** — BaaS/program manager switch forces stack re-papering.
- **Network rule change** — new Visa/MC mandate (e.g., tokenization, 3DS2, token vault requirements).
- **Regulatory change** — Durbin expansion (credit cards), CCCA, Section 1033, CFPB enforcement action.
- **Volume threshold crossed** — triggering new pricing tier, new risk posture, or new processor capacity.
- **Geographic expansion** — new country/currency requires new acquirer or processor relationship.

## 5. Positioning — unique-attribute categories

Where payments differentiation lives:

- **Pricing transparency & structure** — IC+, flat, tiered, or flat-plus; ability to price by card type.
- **Network reach & rail coverage** — Visa/MC/Amex/Discover, ACH, wire, RTP/FedNow, international rails, local APMs.
- **Approval / auth rates** — bps improvement on authorization is quantifiable and high-leverage.
- **Chargeback / dispute handling** — automation, Reg E/Z compliance, RDR/CDRN participation.
- **Fraud tooling & risk sharing** — integrated fraud, risk-share models (liability shift).
- **Integration model** — hosted, iframe, API, SDK, token portability.
- **Orchestration** — ability to route transactions across processors for redundancy and optimization.
- **Reconciliation & reporting** — exception-only reporting, GL-ready exports, ASC 606 support.
- **Certifications & network memberships** — PCI Level 1, Visa/MC Principal Membership, Nacha Preferred Partner.
- **Settlement economics** — speed, currency, FX spread, holdbacks.

If you can't express your differentiation in basis points, failed-transaction reduction, or time-to-certify improvement, it probably won't move a payments buyer.

## 6. Pricing & model patterns

Standard structures:

- **Interchange Plus (IC+)** — interchange cost + fixed bps markup + per-transaction fee. Transparent; enterprise default.
- **Blended / flat-rate** — single rate regardless of card type (Stripe/Square standard). SMB-friendly, margin-opaque.
- **Tiered** — qualified / mid-qualified / non-qualified rates. Legacy, viewed skeptically.
- **Subscription / interchange-optimized** — monthly fee + interchange pass-through. Popular for high-volume merchants.
- **Revenue share** — common for ISOs, ISVs, and PayFac-as-a-Service deals.
- **Platform / SaaS fees plus per-transaction** — for orchestration, fraud, issuing platforms.
- **Minimum commitments & ramps** — standard above SMB.

Payments buyers are exceptionally price-sophisticated. Pricing strategy *is* ICP strategy: your pricing model determines which buyers you can win.

## 7. Compliance / regulatory overlay (as seller)

To credibly sell into payments, you typically need:

- **PCI-DSS** — Level appropriate to volume; Level 1 for most processor-adjacent products.
- **SOC 2 Type II**.
- **Network certifications** — Visa/MC PFAC/aggregator registration, 3DS2 certification, tokenization/token vault certification.
- **BSA/AML program** (if touching customer funds) — with documented KYC/CIP, sanctions screening, SAR processes.
- **State money transmitter licenses** (if applicable) or an agent-of-payee / BaaS exemption structure.
- **EMV / terminal certifications** (if face-to-face).
- **Nacha Preferred Partner / ODFI relationship** (for ACH).

These aren't just sales collateral — they're hard ICP filters. Missing a network cert disqualifies entire buyer tiers regardless of product quality.

## 8. Archetypal ICP slices

**A — "Mid-market e-commerce merchant, interchange-rich"**
$50M–$500M online GMV, predominantly card-not-present, multi-geography, currently on flat-rate processor, authorization rates visibly below benchmark, new VP Finance or CFO hired in last 12 months. Trigger: board-mandated margin expansion, failed processor migration, or fraud spike.

**B — "Vertical SaaS company considering embedded payments"**
$25M–$100M ARR, 100+ customers processing recurring or transactional payments, has Head of Product champion, considering embedded payments for revenue diversification, lacks in-house payments expertise. Trigger: competitor embed launch, board pressure for new revenue streams.

**C — "Community bank modernizing commercial payments"**
$1B–$10B in assets, commercial deposits concentration, has Head of Treasury Management or similar title, core contract renewal within 24 months, publicly stated RTP/FedNow initiative. Trigger: CEO mandate, competitive pressure from regional/national banks, or corporate customer attrition.

**D — "Program manager / neobank rebuild"**
Existing card program with 100k+ active cardholders, currently on legacy issuer processor (Galileo/Marqeta/iCard/PayCore), pain around customization speed, interchange optimization, or program economics. Trigger: sponsor bank change, M&A, or strategic product expansion.

## 9. Common failure modes

- **Pitching capability without pricing context.** "Faster, more features" loses if pricing is wrong for the buyer's volume profile.
- **Ignoring the sponsor/processor relationship.** The incumbent relationship is often contractually sticky (residuals, portfolio ownership, liquidated damages).
- **Underestimating certification timelines.** Network certs can take 6+ months; product is not sellable until done.
- **Conflating merchant-facing and FI-facing ICPs.** Different buyers, different cycles, different collateral.
- **Ignoring risk holdbacks and reserves.** Buyers model reserve structure into effective cost; you must too.
- **Assuming "disruption" framing works.** Payments buyers are usually incumbent-trained and skeptical of disruption narratives.
- **Missing the portfolio conversion reality.** Migrating a merchant portfolio is operationally painful; pricing and onboarding must make the pain worth it.

## 10. Resources

**News / analysis:**
- *Payments Dive*, *PYMNTS*, *The Paypers*, *Finextra*.
- *Digital Transactions* magazine.
- *The Green Sheet* (ISO-focused).
- *Payments Journal* (PaymentsJournal).
- Glenbrook Partners *Payments Views* (expert commentary).

**Analyst coverage:**
- Aite-Novarica / Datos Insights.
- Mercator Advisory Group / Datos.
- Javelin Strategy & Research.
- Cornerstone Advisors.
- Forrester (payments coverage).

**Data:**
- Nilson Report (subscription; definitive network data).
- Federal Reserve Payments Study (triennial).
- Nacha ACH volume statistics.
- McKinsey Global Payments Report (annual).
- BIS CPMI statistics (international).

**Events:**
Money 20/20, ETA TRANSACT, Retail Payments Conference (Fed), Nacha Smarter Faster Payments, Seamless (UK/Middle East/Asia), FinovateSpring/Fall, MPC (Merchant Payments Conference), Payments Canada Summit.

**Trade associations & rule-makers:**
Nacha, ETA, Secure Payments Partnership, U.S. Faster Payments Council, The Clearing House, Federal Reserve Financial Services, Visa Business Solutions, Mastercard Data & Services.

**Communities:**
PaymentsOps community, Pavilion (payments subvertical), various ETA member groups, PCI Security Standards Council participant community.
