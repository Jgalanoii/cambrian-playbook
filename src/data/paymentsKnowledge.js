// src/data/paymentsKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// Deep payments industry knowledge layer — ISOs, acquiring banks, payment
// processing, networks, card economics, PayFac/embedded payments, cross-border,
// B2B payments, and recent market events (Nov 2025 - May 2026).
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_PAYMENTS (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   Nilson Report — https://nilsonreport.com (acquiring rankings, volume data)
//   Federal Reserve Payments Study — https://www.federalreserve.gov/paymentsystems/fr-payments-study.htm
//   Federal Reserve Biennial Report (Dec 2025) — https://www.federalreserve.gov/paymentsystems.htm
//   Federal Reserve Diary of Consumer Payment Choice (2025) — https://www.clevelandfed.org/en/newsroom-and-events/publications/diary-of-consumer-payment-choice.aspx
//   FedNow Service Data — https://www.frbservices.org/financial-services/fednow
//   The Clearing House (RTP Network) — https://www.theclearinghouse.org/payment-systems/rtp
//   Citizens Financial Group Instant Payments Survey (2025)
//   Association for Financial Professionals (AFP) Payments Fraud Survey (2025) — https://www.afponline.org
//   Stripe Annual Letter / Press Releases — https://stripe.com/newsroom
//   Adyen Earnings Reports — https://www.adyen.com/investor-relations
//   McKinsey Global Payments Report — https://www.mckinsey.com/industries/financial-services/our-insights/global-payments-report
//   Visa / Mastercard Published Interchange Schedules — https://usa.visa.com/support/merchant/library/visa-merchant-data-standards-manual.html
//   BIS Annual Economic Report (2025) — https://www.bis.org/publ/arpdf/ar2025e.htm
//   BIS Papers No. 167 (Cerutti, Chen & Hengge 2024) — https://www.bis.org/publ/bppdf/bispap167.htm
//   BIS Papers No. 159 (2024 CBDC Survey) — https://www.bis.org/publ/bppdf/bispap159.htm
//   CPMI 2025-2027 Work Programme — https://www.bis.org/cpmi/
//   IMF Stablecoins Paper (2025) — https://www.imf.org
//   S&P Global Market Intelligence (M&A data) — https://www.spglobal.com/marketintelligence
//   GENIUS Act (Public Law, signed Jul 2025)
//   Credit Card Competition Act (CCCA) bill text (reintroduced Jan 2026)
//   PACE Act bill text (introduced June 2025)
//   PayFac industry benchmarks — Infinicept, Payrix, Finix whitepapers
//   Nuvei, Checkout.com, Marqeta, TSYS investor filings and press releases

// ── PAYMENTS INDUSTRY INJECTION ─────────────────────────────────────────
// Injected into prompts when the seller or target operates in payments,
// fintech, banking, or card-related verticals. Provides grounding for
// fit scoring, brief generation, and discovery questions.

export const PAYMENTS_INDUSTRY_INJECTION = `
PAYMENTS INDUSTRY CONTEXT (use when the target or seller is in payments, fintech, card processing, banking, or merchant services):

---

## 1. Snapshot and market sizing

| Metric | Value |
|---|---|
| U.S. total card payments volume (2023) | 100.7B debit + general-use prepaid transactions, $4.7T value [verified 05/2026, Federal Reserve Biennial Report Dec 2025] |
| U.S. card interchange (2023) | $34.12B (3.9% annual growth since 2021) [verified 05/2026, Federal Reserve Biennial Report] |
| U.S. credit card swipe fees (2024) | $38.7B total [verified 05/2026, Nilson Report] |
| Global payments revenue | ~$2.4T by 2028 (McKinsey projection) [verified 05/2026, McKinsey Global Payments Report] |
| U.S. e-commerce payment volume | ~$1.19T (2025) [verified 05/2026, US Commerce Dept] |
| Real-time payments penetration | ~15% of FIs on FedNow/RTP; ~85% greenfield [verified 05/2026, Federal Reserve] |
| B2B payments TAM (US) | ~$25T annually; ~50% still check-based [verified 05/2026, AFP Payments Fraud Survey 2025] |
| Consumer payments per month | 48 per consumer; cash stable at ~7/month [verified 05/2026, Fed Diary of Consumer Payment Choice 2025] |
| Stripe TPV (2025) | $1.9T (+34% YoY) [verified 05/2026, Stripe Annual Letter] |
| PayFac setup cost | ~$500K-$1M + $50M+ volume to break even [verified 05/2026, Finix/Infinicept Whitepapers] |

---

## 2. What makes payments distinct as a sales target

**1. The four-party model governs all card economics.** Cardholder -> Issuer (card-issuing bank) -> Network (Visa/MC) -> Acquirer (merchant's bank) -> Merchant. Interchange flows from acquirer to issuer. The merchant funds it. AmEx and Discover operate three-party (issuer + network + acquirer in one). Every pricing conversation, competitive dynamic, and regulatory action references this model.

**2. Software is eating payments distribution.** ~85% of merchants now choose payments with their software [verified 05/2026, McKinsey Global Payments]. ISO direct-sales is a shrinking channel. Vertical SaaS + embedded payments is the durable model. Anything enabling vertical SaaS (PFaaS, fraud/risk, compliance, embedded lending, rewards/incentives layered into software) is structurally favored.

**3. Interchange economics are the center of gravity.** Interchange is the single largest cost component for merchants and the single largest revenue driver for issuers. Every regulatory action (Durbin, CCCA), every competitive shift (Capital One + Discover), and every technology innovation (A2A payments, stablecoins) is ultimately a fight over who captures the interchange margin.

**4. State-level licensing fragments the market.** Money Transmitter Licenses (MTLs) are required in most states for non-bank payment providers. Obtaining MTLs in all 50 states costs $1-3M and takes 12-24 months. This creates a durable moat for licensed incumbents and a barrier for startups.

---

## 3. Sub-categorization — who operates in payments

| Sub-category | Description | Key players |
|---|---|---|
| **Card networks** | Set interchange, provide authorization/clearing/settlement infrastructure | Visa, Mastercard, AmEx, Discover (now Capital One) |
| **Merchant acquiring** | Underwrite and board merchants for card acceptance | Chase, Fiserv, Worldpay/GP, Wells Fargo, Stripe, Adyen, Toast |
| **Issuer processing** | Process transactions for card-issuing banks | TSYS (Global Payments), FIS, Fiserv, Marqeta, Galileo |
| **ISOs (Independent Sales Organizations)** | Third-party merchant sales and servicing | Thousands; consolidating via PE roll-ups |
| **PayFac / embedded payments** | SaaS platforms that bundle payments | Stripe Connect, Adyen for Platforms, Finix, Rainforest, PayPal/Braintree |
| **Payment gateways** | Route transactions from e-commerce to processor | Stripe, Braintree, Authorize.net, Checkout.com |
| **Real-time payments** | Instant A2A value transfer | FedNow, RTP (TCH), Zelle (EWS) |
| **B2B payments** | Commercial payment automation, AP/AR | Bill.com, Corpay, Coupa Pay, Bottomline, Payoneer, Tipalti |
| **Cross-border payments** | International remittance and commercial flows | Wise, Remitly, Western Union, WorldRemit, Nuvei, dLocal |
| **Fraud and risk** | Transaction monitoring, chargeback, identity | Sift, Forter, Riskified, Featurespace, Socure, Sardine |
| **Crypto/stablecoin rails** | Blockchain-based value transfer | Circle (USDC), Tether (USDT), PayPal (PYUSD), Stripe (stablecoin) |

---

## 4. Named companies — the operator landscape (15-20)

| Company | Type | Scale | Why they matter |
|---|---|---|---|
| **Visa** | Card network | $15T+ annual volume | Dominant global network; Visa Intelligent Commerce (agentic) [verified 05/2026, Visa Press Release] |
| **Mastercard** | Card network | $9T+ annual volume | #2 network; Mastercard Agent Pay for agentic commerce [verified 05/2026, MC Press Release] |
| **American Express** | Network + issuer | ~$1.5T billed business | Three-party model; premium segment; higher interchange |
| **Stripe** | Acquiring / platform | $1.9T TPV (+34% YoY) [verified 05/2026, Stripe Annual Letter] | Tech-led acquiring leader; Stripe Connect dominant PFaaS |
| **Adyen** | Acquiring / platform | EUR 2.36B net rev [verified 05/2026, Adyen Earnings] | First top-10 US acquirer; enterprise-focused; single-platform architecture |
| **Fiserv / Clover** | Acquiring + core banking | ~$20B+ revenue | Stock down ~73% from peak; class action over Clover force-migration [verified 05/2026, S&P Global / SEC] |
| **Block (Square)** | Acquiring / ecosystem | ~$22B revenue | Square (SMB POS), Cash App (~57M MAU), Afterpay (BNPL) |
| **PayPal / Braintree** | Payments platform | ~$30B revenue | Braintree large-merchant volume; Venmo consumer; PYUSD stablecoin |
| **Worldpay / Global Payments** | Acquiring (merged) | ~$3.7T volume, ~94B txns [verified 05/2026, S&P Global] | Merged Jan 2026 ($24.25B) — largest pure-play acquiring deal ever |
| **FIS** | Issuer processing + banking | ~$9.5B+ revenue | Post-Worldpay carve-out; IDP segment; banking solutions |
| **TSYS (Global Payments)** | Issuer processing | Part of GP post-merge | Top-3 issuer processor; now embedded in Global Payments |
| **Nuvei** | Payment technology | ~$1B+ revenue | Gaming, crypto, and high-risk vertical specialist; global coverage |
| **Checkout.com** | Payment gateway / acquiring | Private; $1B+ revenue est. | Enterprise e-commerce focus; European roots; expanding US |
| **Marqeta** | Issuer processing / BIN sponsor | ~$600M+ revenue | Modern card issuing platform; powers DoorDash, Instacart, Block, Klarna [verified 05/2026, Marqeta Filings] |
| **Toast** | Vertical SaaS + payments | ~$4B+ revenue | Restaurant-dominant; top-10 US acquirer by volume; GPV $140B+ [verified 05/2026, Toast Earnings] |

---

## 5. Regulatory overlay — the dominant constraint

### Key regulatory frameworks

| Regulation | Scope | Impact |
|---|---|---|
| **Durbin Amendment (Reg II)** | Caps debit interchange for $10B+ issuers at ~$0.22/txn; mandates dual-network routing. Corner Post v. Fed vacated entire Reg II (Aug 2025); STAYED pending 8th Circuit appeal. [verified 05/2026, Federal Reserve] | Economics of regulated debit are in flux |
| **CCCA (Credit Card Competition Act)** | Reintroduced Jan 2026; would require $100B+ issuers to enable 2+ unaffiliated networks on credit cards. Bipartisan support + presidential endorsement but stalled. [verified 05/2026, CCCA Bill Text] | Structural threat to Visa/MC credit interchange |
| **PCI DSS v4.0.1** | Current security standard for cardholder data. Mandatory compliance since March 2025. [verified 05/2026, PCI SSC] | Non-compliance = fines, breach liability, loss of acceptance |
| **State MTLs** | Money Transmitter Licenses required in most states for non-bank payment providers. 50-state coverage costs $1-3M, 12-24 months. | Creates barrier to entry and moat for licensed incumbents |
| **GENIUS Act (Jul 2025)** | First federal stablecoin framework. OCC NPRM Feb 2026. Stablecoins projected ~3% of USD payments in 2026, 10% by 2031. [verified 05/2026, GENIUS Act / McKinsey] | Opens bank stablecoin issuance; regulates nonbank issuers |
| **PACE Act (June 2025)** | Would expand fintech access to FedACH and FedNow. Fed "skinny account" proposal (Dec 2025) is the active regulatory file. | Could reshape payment rail access |
| **UIGEA** | Unlawful Internet Gambling Enforcement Act — restricts payment processing for illegal online gambling | Relevant for gaming/high-risk merchant underwriting |

### Cross-border regulatory

- BIS 2025 Annual Report: stablecoins perform poorly against three tests for monetary mainstay (singleness, elasticity, integrity). Tokenisation favorable; stablecoins guarded. [verified 05/2026, BIS Annual Report 2025]
- BIS Papers No. 167: ~$8T annually in DeFi-mediated illicit cross-border payments [verified 05/2026, BIS Papers No. 167]
- BIS Papers No. 159: 91% of 93 central banks (85) exploring retail/wholesale CBDCs. Over 1 in 3 accelerated CBDC work due to stablecoin developments. [verified 05/2026, BIS Papers No. 159]
- CPMI 2025-2027: programmable settlement, FPS interlinkages, harmonized ISO 20022, persistent identifiers, programmatic sanctions screening.
- IMF Stablecoins Paper (2025): stablecoins still require intermediaries adding end-to-end costs. On/off-ramp and FX settlement costs must be factored in. [verified 05/2026, IMF]

---

## 6. Technology stack — payment infrastructure

### Acquiring / processing architecture

- **Gateway:** routes transaction data from merchant to processor (Stripe, Braintree, Authorize.net, Checkout.com)
- **Processor:** handles authorization, clearing, settlement. Front-end processor (auth) vs. back-end processor (settlement). Many acquirers now vertically integrated.
- **Network switch:** Visa/MC/Amex/Discover authorization and clearing networks; debit networks (STAR, NYCE, Pulse, Accel) for PIN debit routing
- **Settlement:** acquirer settles funds to merchant (T+1 or T+2 standard; instant settlement emerging as competitive feature)

### Embedded payments / PayFac stack

- PayFac holds one master MID, onboards sub-merchants, takes liability. PayFac captures 3-6x the economics of an ISO residual [verified 05/2026, Infinicept/Payrix Benchmarks].
- **PayFac-as-a-Service (PFaaS):** Stripe Connect, Adyen for Platforms, Finix, Rainforest — platform brands the experience, partner handles compliance/settlement.
- PFaaS is the default for vertical SaaS — full PayFac costs ~$500K-$1M setup + $50M+ volume to break even.
- Sub-merchant underwriting, KYC, and ongoing monitoring are the compliance obligations.

### Real-time payments infrastructure

- **FedNow:** 1,400+ participants (July 2025); transaction limit raised to $10M (Sept 2025). Use cases: instant payroll, auto-loan disbursements, digital wallet defunding, insurance payouts, merchant refunds. [verified 05/2026, FedNow Service Data]
- **RTP:** 481 banks/CUs reaching 65% of US checking accounts [verified 05/2026, TCH]. Two-rail strategy (RTP + FedNow) is new default. ~85% of US banks/CUs still have not adopted any instant-payment solution — addressable greenfield.
- 73% of surveyed businesses report using instant payments [verified 05/2026, Citizens Financial Group Survey 2025].
- 91% of businesses still using paper checks; checks remain the most fraud-affected payment type [verified 05/2026, AFP Payments Fraud Survey 2025].
- Use case maturation order: payroll -> loan disbursements -> wallet funding -> insurance payouts -> bill pay/RFP.

### B2B payments technology

- **AP/AR automation:** Bill.com, Corpay (formerly FLEETCOR), Coupa Pay, Tipalti, Bottomline, Payoneer
- **Virtual cards:** growing rapidly for B2B; interchange rebate economics drive adoption; Mastercard/Visa pushing commercial card volume
- **Cross-border B2B:** Wise Business, Payoneer, Nuvei, dLocal (LatAm specialist), Airwallex
- ~$25T in annual US B2B payments; ~50% still check-based — massive digitization opportunity [verified 05/2026, AFP]

### Agentic commerce (2026 emerging category)

- Visa Intelligent Commerce (100+ partners, live production) [verified 05/2026, Visa Press Release]
- Mastercard Agent Pay (agentic tokens with scoped credentials)
- Stripe Shared Payment Tokens
- Networks embedding as trust layer for AI agent transactions

---

## 7. Payment economics deep dive

### Interchange structure

- U.S. average interchange: ~1.80%. Card-present: ~1.70%. Card-not-present: ~1.90%. [verified 05/2026, Visa/MC Published Interchange Schedules]
- Regulated debit: ~$0.22 flat (Durbin). Premium rewards credit: 2.10-2.40%+. Commercial: 2.20-2.80%+.
- Network assessments: ~0.13-0.15% + per-txn fees [verified 05/2026, Visa/MC Published Fee Schedules]
- Pricing models: Interchange-Plus (transparent, mid-market+), Tiered (opaque, legacy ISO), Flat-Rate (Square/Stripe simplicity)
- On a $100 Visa rewards credit txn: issuer gets ~$2.10 (interchange), network gets ~$0.14 (assessments), processor gets ~$0.30 (markup), merchant pays ~$2.54. [verified 05/2026, derived from Visa Interchange + Assessment Schedules]

### ISO economics

ISOs are third-party sales entities sponsored by acquiring banks. Three models:
- **Referral/Sub-ISO:** earns residuals, no registration
- **Registered Sales-only ISO:** 50-70% rev-share on spread [verified 05/2026, Cambrian operator knowledge]
- **Full-Liability ISO:** owns portfolio, highest margin/risk/exit value

ISOs being squeezed by: software-led distribution, direct merchant products (Stripe/Square self-serve), margin compression (effective rates down from 3.5%+ to 2.6-2.9%) [verified 05/2026, Nilson Report].

---

## 8. ICP patterns by payment company type

### Best-fit Cambrian user-prospect: Vertical SaaS with embedded payments

Why this segment:
- Software-led distribution is dominant; payments attach-rate drives valuation
- GTM complexity matches Cambrian's advisory capability
- Embedded payments creates constant need for fraud, compliance, rewards, and incentive layering
- Fast-growing; PE/VC-backed; active buyer of GTM consulting

### Strong-fit adjacent segments

- **PayFac-as-a-Service providers** — enabling the structural shift; durable demand from ISV/SaaS platforms
- **Regional banks with ISO/acquiring units** — under pressure to modernize or divest; active M&A targets
- **Full-liability ISOs with vertical expertise** — valuable portfolios but model under structural pressure; PE roll-up targets
- **B2B payments platforms (AP/AR automation)** — large TAM, competitive market, GTM differentiation matters

### Lower-fit segments

- **Top-5 US acquirers (Chase, Fiserv, GP/Worldpay)** — procurement fortress; 12-18 month cycles; internal solutions
- **Visa/Mastercard (networks)** — closed vendor ecosystems; regulatory sensitivity; extreme procurement
- **Generalist ISO portfolios without vertical focus** — margin compression; no software moat; declining merchant adds

---

## 9. Buying committee and decision dynamics

| Role | What they care about | Their lens |
|---|---|---|
| **Head of Payments / VP Merchant Services** | Payment strategy, P&L, merchant economics | "What's the revenue impact? Does this improve take-rate or retention?" |
| **CTO / VP Engineering** | Platform architecture, gateway, API integration, scalability | "How does this integrate? What's the API surface? Latency impact?" |
| **CFO / VP Finance** | Interchange optimization, take-rate, settlement, working capital | "What's the net revenue impact after interchange pass-through?" |
| **Chief Risk Officer** | Underwriting, fraud, compliance, PCI, AML | "What's the risk exposure? How does this affect our loss rate?" |
| **Head of Partnerships / BD** | ISV relationships, PayFac partnerships, channel strategy | "Does this make our platform more attractive to ISVs?" |
| **Head of Product** | Merchant/consumer UX, feature roadmap, competitive positioning | "Does this differentiate our product vs. Stripe/Adyen/Toast?" |
| **General Counsel** | MTL compliance, network rules, contract structure, IP | "Are we compliant in every state? Does this trigger new licensing?" |
| **VP Sales / Head of ISO Channel** | Revenue growth, merchant acquisition, portfolio economics | "Will this help my ISOs/sales team close more deals?" |

### Decision pattern

- Vertical SaaS with embedded payments: CTO + Head of Payments + CFO. 60-120 day cycle.
- Full-liability ISO: Owner/CEO + CFO. 30-90 day cycle. Relationship-driven.
- Regional bank acquiring unit: Head of Merchant Services + CIO + CFO + Risk. 90-180 days.
- Top-5 acquirers: Full procurement. RFP. Security review. 6-18 months.

---

## 10. Trigger events

| Trigger | What it signals | Sales implication |
|---|---|---|
| **ISV/SaaS evaluating PayFac or PFaaS** | Embedded payments investment cycle | Advisory on build vs. buy, PFaaS partner selection |
| **Merchant acquiring unit under strategic review/divestiture** | M&A advisory and vendor displacement | Active buyer for transition consulting |
| **Durbin/CCCA regulatory movement** | Interchange economics changing | Contingency planning, pricing model advisory |
| **New state legalization (gaming, cannabis)** | New high-risk merchant verticals opening | Underwriting, compliance, and specialized processing demand |
| **Fiserv/Clover merchant displacement** | ~200K merchants in transition [verified 05/2026, Class Action / SEC] | Active window for competing acquirers and ISOs |
| **Stablecoin / A2A payment infrastructure investment** | Alternative rail adoption | Strategy advisory on rail diversification |
| **Core banking contract renewal** | Adjacent payments technology review | Payments modernization bundled with core conversion |
| **Agentic commerce pilot** | AI agent transaction infrastructure | Token management, credentialing, trust-layer advisory |
| **Cross-border expansion** | International payment complexity | Multi-currency, FX, compliance advisory |
| **PE roll-up of ISO portfolio** | Consolidation and platform standardization | Technology integration, margin optimization |

---

## 11. Common failure modes

1. **Treating payments as a single market.** Acquiring, issuing, processing, networks, B2B, cross-border, and embedded payments are distinct sub-verticals with different economics, buyers, and competitive dynamics.
2. **Confusing revenue and TPV.** A processor's "volume" is total payment volume processed; revenue is the take-rate on that volume. Stripe processes $1.9T but its revenue is a fraction. Always clarify which metric.
3. **Ignoring interchange pass-through.** Most merchant payment costs are interchange (non-negotiable) + assessments + processor markup. Only the markup is competitive. Quoting "savings" without understanding interchange structure is amateur.
4. **Pitching "lower rates" without vertical specificity.** Interchange varies by MCC, card type, card-present vs. card-not-present, and processing method. A restaurant's interchange profile differs entirely from an e-commerce company.
5. **Missing the PCI compliance requirement.** Any vendor touching cardholder data must be PCI DSS compliant. v4.0.1 is current; non-compliance is a deal-breaker. [verified 05/2026, PCI SSC]
6. **Underestimating state licensing.** MTLs are required for non-bank payment providers in most states. Operating without proper licensing is a regulatory violation and a disqualifier.
7. **Assuming check displacement is easy.** 91% of businesses still use checks. [verified 05/2026, AFP] B2B payment habits are deeply embedded in AP/AR workflows, ERP systems, and vendor relationships.
8. **Discounting agentic commerce as hype.** Visa (100+ partners, production) and Mastercard are building infrastructure. This is real and will reshape merchant acceptance architecture.
9. **Stale interchange rates.** Visa and MC update schedules twice per year (April and October). Any cached rate decays fast. [verified 05/2026, Visa/MC Published Schedules]

---

## 12. GTM implications for Cambrian seller-users

### Recent market events (Nov 2025 - May 2026)

- **Global Payments + Worldpay closed Jan 2026 ($24.25B)** — largest pure-play acquiring deal ever. GP divested Issuer Solutions to FIS for $13.5B. Combined: ~6M merchant locations, ~$3.7T volume, ~94B txns. [verified 05/2026, S&P Global / Company Press Releases]
- **Capital One + Discover:** Debit migration to Discover Network complete Q1 2026. Credit card origination on Discover began Feb 2026. Cap One now a vertically integrated triopoly member. Brex acquisition closed Apr 2026. [verified 05/2026, Company Press Releases]
- **Fiserv/Clover crisis:** Stock down ~73% from peak. Class action over force-migration of ~200K merchants. Clover GPV growth collapsed. [verified 05/2026, S&P Global / SEC]
- **PENN/ESPN BET wound down** — implications for gaming payments processors (Nuvei, Worldpay).

### Structural thesis

Software is eating payments distribution. ~85% of merchants choose payments with their software. ISO direct-sales is shrinking. Vertical SaaS + embedded payments is the durable model. Anything enabling vertical SaaS — PFaaS, fraud/risk, compliance, embedded lending, rewards/incentives layered into software — is structurally favored.

### Cambrian engagement vectors

1. **Embedded payments advisory** — ISV/SaaS platforms evaluating PayFac, PFaaS, or referral models
2. **ISO portfolio optimization** — PE-backed roll-ups rationalizing technology and pricing
3. **Interchange optimization** — mid-market merchants leaving money on the table
4. **Real-time payments strategy** — ~85% of FIs still greenfield for FedNow/RTP
5. **Cross-border payments architecture** — multi-rail (card, A2A, stablecoin) strategy for international flows
6. **Agentic commerce readiness** — Visa/MC infrastructure adoption for AI agent transactions

---

## 13. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`bankingKnowledge.js\` | Core banking, deposit franchise, FedNow/RTP adoption, bank-owned acquiring |
| \`cryptoStablecoinKnowledge.js\` | Stablecoin payment rails, GENIUS Act, tokenized deposits |
| \`retailKnowledge.js\` | Merchant POS, omnichannel payments, retail media, loyalty + payments intersection |
| \`gamingKnowledge.js\` | Gaming payments stack (Nuvei, Sightline, Worldpay gaming), high-risk underwriting |
| \`cannabisKnowledge.js\` | Cannabis payments (ACH, closed-loop, PIN debit workarounds) |
| \`digitalIncentivesPlatformsKnowledge.js\` | Rewards/incentives embedded in payment flows; card-linked offers |
| \`fintechKnowledge.js\` | Neobank and challenger payments products competing with traditional acquiring |

---

*End of layer. Update cadence: quarterly aligned with Visa/MC interchange schedule updates (April, October). Critical re-check triggers: Durbin 8th Circuit ruling, CCCA legislative movement, Visa/MC interchange schedule updates, major acquiring M&A, FedNow participant count milestones, PCI DSS updates.*
`;

// ── PAYMENTS SCORING CONTEXT ────────────────────────────────────────────
// Used to calibrate ICP fit scoring when target/seller is payments-adjacent.

export const PAYMENTS_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Vertical SaaS with embedded payments", avgFit: "75-85%", reason: "Software-led distribution is dominant; payments attach-rate drives valuation; GTM complexity matches Cambrian" },
    { segment: "PayFac-as-a-Service providers", avgFit: "70-80%", reason: "Enabling the structural shift; durable demand from ISV/SaaS platforms" },
    { segment: "Regional banks with ISO/acquiring units", avgFit: "60-70%", reason: "Under pressure to modernize or divest; active M&A targets" },
    { segment: "Full-liability ISOs with vertical expertise", avgFit: "55-65%", reason: "Valuable portfolios but model under structural pressure; PE roll-up targets" },
    { segment: "B2B payments platforms (AP/AR automation)", avgFit: "60-70%", reason: "Large TAM (~$25T); competitive market; GTM differentiation critical" },
    { segment: "Cross-border payment specialists", avgFit: "55-65%", reason: "Multi-rail complexity; regulatory overlay; fast-growing segment" },
  ],
  highFrictionSegments: [
    { segment: "Top-5 U.S. acquirers (Chase, Fiserv, GP/Worldpay)", avgFit: "10-20%", reason: "Procurement fortress; 12-18 month cycles; internal solutions" },
    { segment: "Visa/Mastercard (networks)", avgFit: "5-15%", reason: "Closed vendor ecosystems; regulatory sensitivity; extreme procurement" },
    { segment: "Generalist ISO portfolios without vertical focus", avgFit: "20-30%", reason: "Margin compression; no software moat; declining merchant adds" },
  ],
  keySignals: {
    positive: [
      "Merchant acquiring unit under strategic review or divestiture",
      "ISV/SaaS platform evaluating PayFac or PFaaS",
      "Bank exploring embedded payments or BaaS partnerships",
      "Company building agentic commerce capabilities",
      "Stablecoin or A2A payment infrastructure investment",
      "Cross-border expansion into new markets",
      "PE acquisition of ISO portfolio or payments company",
      "Core banking contract renewal opening payments review",
    ],
    negative: [
      "Locked into long-term processor contract (3+ years remaining)",
      "Legacy tiered pricing with high non-qualified surcharges",
      "No software differentiation — payments-only value prop",
      "Regulatory enforcement action pending",
      "Operating without required MTLs in key states",
    ],
  },
};

// ── PAYMENTS DISCOVERY QUESTIONS ────────────────────────────────────────
// Injected into discovery question generation for payments-vertical accounts.

export const PAYMENTS_DISCOVERY_INJECTION = `
PAYMENTS-SPECIFIC DISCOVERY ANGLES (use when the prospect is in payments, acquiring, processing, or fintech):

REALITY stage questions to explore:
- What's your current merchant acquiring setup — direct bank relationship, ISO, or platform-embedded?
- How are you handling PayFac/sub-merchant onboarding today — registered, PFaaS partner, or referral?
- What's your interchange optimization strategy — IC+, tiered, flat-rate, or surcharge/cash-discount?
- How exposed are you to CCCA routing mandates if they pass? Do you have a dual-network credit strategy?
- Walk me through your payment rails — card, ACH, real-time, cross-border. Which are you on and which are you evaluating?

IMPACT stage questions to quantify:
- What's your effective take-rate after interchange and assessments? How has it trended over 24 months?
- How much merchant attrition are you seeing to vertical SaaS platforms that bundle payments?
- What's the revenue impact of the Durbin-exempt vs. regulated debit split in your portfolio?
- How much are you spending on PCI compliance, fraud, and chargeback management annually?
- What does cross-border FX and settlement cost your business on international transactions?

VISION stage questions to frame the future:
- If you could redesign your payments distribution from scratch, would you go ISO, PayFac, or embedded?
- What's your strategy for agentic commerce — AI agents initiating transactions on behalf of customers?
- How are you thinking about stablecoin/A2A rails as alternatives to card-based settlement?
- What role do real-time payments (FedNow/RTP) play in your product roadmap?

ENTRY POINTS — who owns what:
- Head of Payments / VP Merchant Services (strategy + P&L)
- CTO / VP Engineering (platform, gateway, API integration)
- CFO / VP Finance (interchange optimization, take-rate, settlement)
- Chief Risk Officer (underwriting, fraud, compliance, PCI)
- Head of Partnerships / BD (ISV relationships, PayFac partnerships)
`;
