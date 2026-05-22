// cryptoStablecoinKnowledge.js
// Auto-generated from crypto_stablecoin_knowledge_layer.md
// High-risk / regulated industry knowledge layer

export const CRYPTO_STABLECOIN_PLAYBOOK = {
  name: "Cryptocurrency & Stablecoin",
  keywords: [
      "cryptocurrency",
      "crypto",
      "stablecoin",
      "USDC",
      "USDT",
      "Circle",
      "Tether",
      "Coinbase",
      "Kraken",
      "DeFi",
      "custody",
      "on-ramp",
      "off-ramp",
      "GENIUS Act",
      "MiCA",
      "blockchain",
      "digital assets",
      "web3",
      "bitcoin",
      "ethereum",
      "crypto payments",
      "stablecoin payments"
  ],
  personas: [
      "CEO",
      "CFO",
      "CTO",
      "Head of Treasury",
      "Chief Compliance Officer",
      "Head of Payments",
      "VP Engineering",
      "General Counsel",
      "CISO",
      "Head of Institutional Sales",
      "VP Product"
  ],
  discovery: [
    "What regulatory or licensing constraints shape your vendor selection process?",
    "How do you currently handle compliance reporting and audit trails?",
    "What's your relationship with your banking/payments partners — is that stable?",
    "How do you evaluate new technology vendors given your regulatory environment?",
    "What's the biggest operational pain point that existing vendors can't solve because of your industry?",
  ],
  disqualifiers: [
      "No understanding of regulatory environment",
      "Treating this like a mainstream vertical",
      "No compliance posture or certifications"
  ],
  triggerEvents: [
      "New regulatory framework or rule change",
      "Banking relationship loss or gain",
      "State expansion or new market entry",
      "PE/VC funding round",
      "Compliance audit finding"
  ],
  compliance: [],
  usps: [],
  layerContent: `---
title: "Cryptocurrency & Stablecoin — Knowledge Layer"
type: vertical_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_payment_rails_and_disbursements.md
  - cambrian_investor_intelligence.md
  - cambrian_b2b_sales_value_creation.md
  - cambrian_approval_gates_knowledge_layer.md
  - cambrian_fintech_knowledge_layer.md
tags: [crypto, cryptocurrency, stablecoin, GENIUS-Act, MiCA, USDC, USDT, Circle, Tether, Coinbase, Kraken, custody, DeFi, B2B-payments, embedded-finance, on-off-ramp, treasury, regulated-industry]
last_updated: 2026-05-22
status: production
confidence: high (GENIUS Act July 18 2025; April 2026 Treasury/FDIC/FinCEN rules; Coinbase Q1 2026 8-K; Bloomberg/Artemis stablecoin volume data)
---

# Cryptocurrency & Stablecoin — Knowledge Layer

> **Working thesis.** Crypto entered 2026 with the most dramatic regulatory clarity in its 17-year history. The GENIUS Act (signed July 18, 2025) is the first comprehensive U.S. federal framework for stablecoins. Treasury, FDIC, and FinCEN dropped implementing rules across an eight-day window in April 2026. **The total stablecoin market crossed $321B in April 2026, with stablecoins processing ~$46T in transaction volume in 2025 — more than 20x PayPal's volume and approaching 3x Visa's.** The institutional rails are arriving in real time: Coinbase Q1 2026 reported $294B assets on platform, $5.2T trailing twelve-month trading volume, and #1 U.S. spot trading market share. Meta restarted crypto creator payments via Circle/Stripe; Western Union announced USDPT on Solana; Visa is piloting USDC settlement; Stripe's Bridge won USDH issuance on Hyperliquid. **This is no longer an emerging vertical — it's becoming financial infrastructure. The sales-relevant story is the institutional and B2B layer, not retail trading.**

> **What makes crypto distinct.** Crypto is the only vertical where (a) the underlying asset class has 24/7/365 global price discovery, (b) self-custody is technically possible (unlike traditional finance), (c) settlement is on-chain and final within minutes rather than T+1/T+2, (d) the regulatory perimeter is being actively drawn for the first time, (e) stablecoins now compete directly with correspondent banking and card networks on cross-border payments, and (f) every adjacent fintech is being asked by their board whether they need a crypto strategy. The vertical splits cleanly into two very different sub-industries: (1) the speculative trading and DeFi layer (volatile, retail-skewed, regulated-by-enforcement-with-clarity-arriving), and (2) the stablecoin-and-payments infrastructure layer (rapidly institutionalizing, GENIUS Act-regulated, B2B-skewed).

---

## Table of Contents

1. [Snapshot and market sizing](#1-snapshot-and-market-sizing)
2. [What makes crypto distinct as a sales target](#2-what-makes-crypto-distinct-as-a-sales-target)
3. [Sub-categorization — the two crypto industries](#3-sub-categorization--the-two-crypto-industries)
4. [Stablecoin landscape](#4-stablecoin-landscape)
5. [Exchanges, custody, and institutional infrastructure](#5-exchanges-custody-and-institutional-infrastructure)
6. [Regulatory overlay](#6-regulatory-overlay)
7. [B2B and corporate use cases](#7-b2b-and-corporate-use-cases)
8. [ICP patterns by buyer type](#8-icp-patterns-by-buyer-type)
9. [Buying committee and decision dynamics](#9-buying-committee-and-decision-dynamics)
10. [Trigger events](#10-trigger-events)
11. [Common failure modes](#11-common-failure-modes)
12. [GTM implications for Cambrian seller-users](#12-gtm-implications-for-cambrian-seller-users)
13. [Cross-references to sister layers](#13-cross-references-to-sister-layers)

---

## 1. Snapshot and market sizing

| Metric | Value |
|---|---|
| Total crypto market cap (peak 2025) | $4T+ briefly after GENIUS Act signing |
| Total stablecoin market cap (April 2026) | $321B record high |
| USDT (Tether) circulating supply | $189.6B (April 29, 2026) |
| USDC (Circle) circulating supply | $77.6B (April 29, 2026) |
| Combined USDT + USDC share | ~80% of stablecoin market |
| Stablecoin transaction volume (2025) | ~$33–46T (Bloomberg/Artemis Analytics estimates) — multiple of PayPal and approaching Visa scale |
| Coinbase assets on platform (Q1 2026) | $294B |
| Coinbase trailing 12-month trading volume | $5.2T |
| Coinbase U.S. spot trading market share | #1 |
| Monthly crypto card volume (March 2026) | $607M (all-time high) |
| USDC market cap during Q1 2026 | $80B supply at peak |
| Average USDC held in Coinbase products Q1 2026 | $19B |

### Headline industry dynamics

- **The GENIUS Act bifurcates the stablecoin market** into compliant ("permitted payment stablecoins") and non-compliant. USDC built for it; Tether is restructuring to comply or risk losing U.S. access.
- **Stablecoins have moved from speculation to payments infrastructure.** Meta paying creators in USDC (Colombia, Philippines), Western Union planning USDPT, Visa settling in USDC, Interactive Brokers enabling USDC brokerage funding.
- **Crypto card volume hit $607M in March 2026** — a new all-time high. The on-ramp is real.
- **Bitcoin ETFs (approved Jan 2024) and Ethereum ETFs (approved July 2024)** have changed institutional access permanently. Coinbase custody backs most of these ETFs.
- **MiCA in Europe (in force 2024)** is the parallel EU regulatory framework; USDT exited regulated EU platforms over compliance gaps.
- **U.S. crypto firms pursuing bank charters** — Circle, BitGo, Coinbase, Paxos all in process. This is the institutional-rail-completion story.

---

## 2. What makes crypto distinct as a sales target

**1. Two very different industries hiding under one ticker.** Stablecoin payments infrastructure is a regulated B2B fintech vertical. Spot crypto trading and DeFi are a retail-skewed, volatility-driven, less-clearly-regulated vertical. A seller targeting a treasury team at Stripe to use stablecoin settlement has nothing in common with a seller targeting a retail crypto exchange. **Always ask which crypto you're selling into.**

**2. The buyers are increasingly traditional fintech and corporate buyers.** As crypto matures, the buyer profile shifts. Five years ago, crypto buyers were token-treasury-managing crypto-native companies. Today the buyers are also: Meta (paying creators in USDC), Stripe (acquiring Bridge to issue USDH), Visa (piloting USDC settlement), Western Union (launching USDPT), Interactive Brokers (enabling USDC funding), JPMorgan (partnering with Coinbase). The CFO, Treasurer, and Head of Payments roles at traditional companies are now the buyers — not crypto-native CTOs.

**3. Regulation is finally crystallizing — that changes the buying calculus.** Pre-GENIUS Act, every crypto purchase carried a "will this still be legal in 18 months" overhang. Post-GENIUS Act for stablecoins, post-Trump-administration-CFTC-shift for derivatives and prediction markets, post-multiple-bank-charters-in-process for custody — the regulatory perimeter is being drawn. Buyers can now build durable plans. **The new sales objection isn't "is this legal?" — it's "are you compliant under [GENIUS/MiCA/state MTL]?"**

---

## 3. Sub-categorization — the two crypto industries

### Industry 1: Speculative trading, DeFi, and tokens

| Sub-category | Examples | Buyer profile |
|---|---|---|
| Centralized crypto exchanges (CEX) | Coinbase, Kraken, Gemini, Binance.US, Crypto.com, Bitstamp, Bullish | Treasury, compliance, fintech infra buyers |
| Decentralized exchanges (DEX) | Uniswap, dYdX, Curve, PancakeSwap | Crypto-native protocols / DAOs |
| DeFi protocols | Aave, Compound, MakerDAO/Sky, Lido | Token holders / DAOs / yield-seekers |
| NFT marketplaces | OpenSea, Blur, Magic Eden | Largely receded as a sales-relevant vertical |
| Layer 1 / Layer 2 chains | Ethereum, Solana, Polygon, Base, Arbitrum, Hyperliquid | Foundation entities, validator businesses |
| Wallets (self-custody) | MetaMask, Phantom, Coinbase Wallet, Rabby | End-user; rarely a B2B sale target |
| Crypto trading firms / market makers | Jump, Wintermute, GSR, B2C2, Cumberland (DRW) | Treasury, OTC liquidity buyers |
| Crypto hedge funds / asset managers | Pantera, Paradigm, Multicoin, BitGo, Galaxy | Capital allocators |

### Industry 2: Stablecoin and payments infrastructure (the B2B-relevant layer)

| Sub-category | Examples | Buyer profile |
|---|---|---|
| Stablecoin issuers | Circle (USDC, EURC), Tether (USDT), Paxos (PYUSD, USDG, RLUSD-adjacent), Ripple (RLUSD), Fiserv (FIUSD), MakerDAO/Sky (USDS/DAI) | Compliance, regulatory affairs, treasury, banking partners |
| Custody / institutional | Coinbase Custody, BitGo, Anchorage Digital, Fireblocks, Copper, Hex Trust | Fund admins, broker-dealers, RIAs, corporate treasuries |
| On/off ramps | Stripe (incl. Bridge), MoonPay, Ramp, Transak, Banxa | Fintech platforms embedding crypto |
| B2B payment rails | Stripe (USDC payouts), Circle Mint, Bridge, Conduit, Mesh, Sphere | CFO, Treasurer, Head of Payments at global corporates |
| Crypto cards (issuance) | Coinbase Card, Crypto.com Card, BitPay Card, Bybit Card | Cardholder programs |
| Crypto treasury management | Fireblocks, BitGo, Anchorage, MakersPlace, Wallet-as-a-Service providers | CFO, Treasurer at crypto-native companies |
| Compliance / chain analytics | Chainalysis, TRM Labs, Elliptic, Crystal Intelligence | BSA officers, compliance teams |
| Tax and accounting | TaxBit, Bitwave, Coinbase Prime tax exports | CFOs, accountants |
| Crypto/web3 services | Alchemy, QuickNode, Infura, Moralis | Developer/devrel; B2B SaaS pattern |

**The institutional-B2B subset of Industry 2 is the highest-value sales target.** That's where revenue is consolidating, where buyers behave like sophisticated fintech buyers, and where the GENIUS Act regulatory clarity is creating new procurement budgets.

---

## 4. Stablecoin landscape

### The dominant issuers

| Stablecoin | Issuer | Circulating supply (Apr 2026) | Regulatory posture | Notes |
|---|---|---|---|---|
| **USDT (Tether)** | Tether Holdings | $189.6B | Not U.S.-based; historically less transparent; complying or losing U.S. access | Still dominant by market cap but losing share; exited regulated EU platforms under MiCA |
| **USDC (Circle)** | Circle Internet Financial (NYSE: CRCL) | $77.6B | **GENIUS Act compliant; MiCA compliant; French banking license; Deloitte-attested monthly** | Only major stablecoin compliant in both U.S. and EU; Meta picked USDC for creator payments via Stripe |
| **PYUSD** | Paxos, issued for PayPal | ~$1B | Paxos-issued; NY DFS regulated; PYUSD interop with Fiserv FIUSD | Mainstream-payments brand; 3.7% yield offer Q4 2025 to drive adoption |
| **RLUSD** | Ripple | ~$200M+ growing | NY DFS-regulated | Ripple's payments-targeted stablecoin |
| **DAI/USDS (Sky)** | MakerDAO / Sky Protocol | ~$5B | Decentralized; over-collateralized | Crypto-native, not centrally issued |
| **FIUSD** | Fiserv | New issuance | Compliant; interop with PYUSD | Banking-fintech-issued stablecoin |
| **USDH** | Stripe Bridge | New issuance on Hyperliquid | Permitted under GENIUS Act framing | Won competitive bid on Hyperliquid DeFi platform |
| **USDPT** | Western Union (planned 2026) | Pre-launch | Compliant | Solana-based; remittance-focused |
| **EURC** | Circle | Growing | MiCA-compliant euro stablecoin | Filling vacuum left by USDT EU exit |

### Why GENIUS Act matters

- **1:1 reserves required** in high-quality liquid assets (cash, short-term Treasuries)
- **Ban on issuer-paid yield** on the stablecoin balance itself (does NOT apply to third-party DeFi or exchange yield products)
- **Federal registration** for "permitted payment stablecoins"
- **Monthly attestations and audits**
- **State-level regulatory pathway** also exists; the Treasury's April 3, 2026 proposed rule established principles for state regulatory equivalence
- **Effective compliance deadline:** July 18, 2026 (one year from signing)
- **Result:** USDC is the institutional default. USDT remains dominant by volume but is structurally disadvantaged in the U.S. institutional channel.

### Stablecoin use cases driving B2B adoption

- **Cross-border B2B payments** — remittance, supplier payments, payroll for international contractors. Stripe, Bridge, Conduit, Sphere all serve this
- **Creator and gig payouts** — Meta/Stripe/USDC pilot (Colombia, Philippines) is the marquee example; faster and cheaper than ACH/wire/SWIFT in many corridors
- **Treasury management for crypto-native companies** — Fireblocks, BitGo, Anchorage host operational and treasury stablecoin balances
- **Exchange settlement** — major exchanges settle internally and externally in stablecoins
- **DeFi liquidity** — stablecoins are the dominant collateral and trading pair in DeFi
- **Card programs** — stablecoin-backed cards (Coinbase Card, Crypto.com Card) saw record $607M monthly volume in March 2026
- **Brokerage funding** — Interactive Brokers enabled USDC funding via zerohash with PYUSD and RLUSD planned
- **Merchant acceptance** — early-stage but growing; mostly via on-off-ramp processors

---

## 5. Exchanges, custody, and institutional infrastructure

### Centralized exchanges (CEX) by relevance

| Exchange | Status | Notable |
|---|---|---|
| **Coinbase (NASDAQ: COIN)** | Public; #1 U.S. spot share | $294B assets on platform Q1 2026; $5.2T TTM volume; pursuing bank charter; primary custodian for most Bitcoin ETFs; institutional product Coinbase Prime |
| **Kraken** | Private; pre-IPO | Strong derivatives via Kraken Pro and Kraken Futures; deep liquidity; institutional yield products |
| **Gemini** | Private; pre-IPO (filed) | Tyler/Cameron Winklevoss; institutional-focused; NY DFS-regulated; high-compliance posture |
| **Binance.US** | Private; restricted services | The U.S. subsidiary of Binance global; ongoing regulatory issues |
| **Crypto.com** | Private | Card programs; strong consumer brand; expanding prediction-market adjacency |
| **Bitstamp** | Acquired by Robinhood (announced 2024) | Older exchange; European strength |
| **Bullish** | Public | Block.one's institutional exchange |
| **OKX, Bybit, Bitget** | Offshore | Not U.S.-regulated; institutional adoption growing |

### Institutional custody and infrastructure

| Provider | Position |
|---|---|
| **Coinbase Custody** | Custodies most U.S. spot Bitcoin and Ethereum ETF assets |
| **BitGo** | Pursuing bank charter; one of the original institutional custodians; large clearing role |
| **Anchorage Digital** | OCC-chartered national trust bank (since 2021) — the original federally-regulated crypto bank |
| **Fireblocks** | Wallet infrastructure and MPC custody for crypto-native and increasingly traditional finance |
| **Copper** | Institutional custody, UK-based |
| **Hex Trust** | Asia-focused institutional custody |
| **Komainu** | JV (Nomura, CoinShares, Ledger); institutional custody |
| **Paxos** | Stablecoin and tokenization infrastructure; PYUSD issuer; NY DFS-regulated |

### On/off ramps and payment infrastructure

| Provider | Position |
|---|---|
| **Stripe / Bridge** | Stripe acquired Bridge (stablecoin issuance) Oct 2024 for ~$1.1B; now positioned as B2B crypto payments + USDH issuance on Hyperliquid |
| **Circle Mint** | Direct issuance and redemption of USDC for institutional clients |
| **MoonPay** | Consumer fiat-to-crypto on-ramp; embedded in many wallets and exchanges |
| **Ramp** | EU-strong fiat on-ramp |
| **Transak** | On-ramp focused on developer integration |
| **Banxa** | Public; on-ramp focused on global compliance |
| **Mesh** | Aggregator API for connecting to multiple exchanges and custody |
| **Sphere** | B2B stablecoin payment APIs |
| **Conduit** | B2B cross-border via stablecoin rails |

---

## 6. Regulatory overlay

### Federal U.S. layer

- **GENIUS Act (Public Law signed July 18, 2025)** — first comprehensive U.S. federal stablecoin law. Sets 1:1 reserve, no-issuer-yield, attestation, registration requirements. Implementation rules due July 18, 2026.
- **April 2026 Treasury / FDIC / FinCEN rulemaking** — eight-day burst of proposed rules in April 2026 to implement GENIUS Act. Treasury's April 3 rule established state regulatory equivalence principles.
- **OCC** — has been active in proposed rulemaking; February 2026 proposed rules for stablecoins in banking system
- **SEC** — historically aggressive on tokens-as-securities; the Trump-era SEC has dropped multiple cases; Coinbase, Binance enforcement actions paused or dropped
- **CFTC** — jurisdiction over commodities-defined crypto (Bitcoin, Ether) and derivatives; February 2025 leadership change shifted to permissive stance; withdrew event-contract ban proposals
- **FinCEN** — Bank Secrecy Act, AML, KYC obligations
- **IRS** — crypto is property for tax purposes; gains/losses on every transaction
- **State money transmitter licensing** — every state has MTL requirements; NY DFS BitLicense is the strictest
- **Bitcoin / Ethereum ETFs** — approved Jan 2024 and July 2024 respectively; Coinbase Custody backs most

### EU layer

- **MiCA (Markets in Crypto-Assets Regulation)** — in force 2024; comprehensive EU framework. Stablecoin issuers must hold reserves; non-MiCA stablecoins delisted from regulated EU platforms (USDT effectively exited regulated EU venues)
- **EURC** filling the EU-stablecoin vacuum

### Other jurisdictions

- **U.K.** — Financial Services and Markets Act 2023; FCA registering crypto firms
- **Singapore** — MAS regulations; major crypto hub
- **Hong Kong** — re-opening to retail crypto under licensing regime
- **Dubai / UAE** — VARA regulator; crypto-friendly jurisdiction
- **Switzerland** — long-established FINMA framework

### Key compliance dimensions for a B2B buyer to evaluate any crypto vendor

- KYC / KYB procedures
- AML / sanctions screening
- Chain analytics provider (Chainalysis / TRM / Elliptic)
- Custody segregation (qualified custodian vs. omnibus)
- SOC 2 / ISO 27001
- State MTL coverage
- BitLicense if NY operations
- Bank charter status (or partner bank)

---

## 7. B2B and corporate use cases

The institutional/B2B sales-relevant use cases (this is where the money is, sales-wise):

### Cross-border B2B payments (the biggest by volume)

- Replacing SWIFT correspondent banking for supplier payments, especially to emerging markets
- 1–24 hour settlement vs. 1–5 days
- Fees typically 50–95% lower than traditional rails for the same corridor
- Stripe Bridge, Conduit, Sphere are the merchant-side platforms; Circle Mint provides the issuance/redemption rail
- Adopter examples: Meta (creator payments), Western Union (USDPT remittance), undisclosed Tier 1 fintechs

### Creator and gig payouts

- Meta paying creators in USDC via Stripe — pilot launched April 2026 in Colombia and the Philippines
- Tremendous, Runa, Tango layer (see digital incentives knowledge layer) increasingly integrating stablecoin options
- Faster, cheaper, more reliable than ACH/Wise/PayPal in many corridors

### Treasury management

- Crypto-native companies hold operating treasury in stablecoins
- Increasingly, public companies hold some Bitcoin (MicroStrategy/Strategy, Tesla, Block) as treasury asset
- Fireblocks, BitGo, Anchorage are the primary infrastructure layer

### Yield and DeFi (for sophisticated treasury)

- Stablecoin deposits earning yield via Coinbase, Kraken, or DeFi protocols
- Institutional DeFi platforms (Aave Arc, Maple, Goldfinch, Centrifuge) for KYC-gated yield

### Tokenization of real-world assets (emerging)

- BlackRock BUIDL (tokenized Treasury fund) — leading example
- Franklin Templeton OnChain U.S. Government Money Fund
- Tokenized real estate, private credit, art
- The "RWA" thesis is one of the strongest 2026 narratives

### Card programs

- Crypto.com Card, Coinbase Card, BitPay Card — load with crypto/stablecoin, spend in fiat at point of sale
- $607M monthly volume March 2026 record
- Adopted by 5M+ U.S. users

### Brokerage and capital markets

- Interactive Brokers enabled USDC brokerage funding (via zerohash) — extending to PYUSD, RLUSD
- Bitcoin/Ethereum spot ETF flow (Coinbase Custody backs ~$60B+)
- Crypto IPOs (Circle IPO completed; Gemini, Kraken pre-IPO)

### Merchant acceptance

- BitPay, Coinbase Commerce, Stripe-via-Bridge enable merchant acceptance of stablecoin payments
- Mostly mid-to-long-tail merchants in regions with strained banking access
- Growing slowly in U.S. and EU; faster in LatAm, parts of Asia, Africa

---

## 8. ICP patterns by buyer type

### Best-fit Cambrian user-prospect: B2B fintech / payments-adjacent companies

These are the buyers driving 2026 crypto B2B sales:
- **Global payment platforms** (Stripe, Adyen, Checkout.com, Worldpay, Fiserv) evaluating stablecoin settlement rails
- **Cross-border payment companies** (Western Union, Remitly, Wise) facing stablecoin disintermediation
- **Treasury management software** (Modern Treasury, Trovata, Kyriba) adding stablecoin support
- **Embedded finance platforms** (Bond, Unit, Synctera, Treasury Prime) considering stablecoin rails
- **Banking-as-a-service providers** (Highnote, Galileo, Marqeta) evaluating crypto card programs
- **Compliance/risk software** (Chainalysis, TRM, Elliptic) — the gold-standard buyer for any chain-analytics product
- **Crypto-native fintechs** (Coinbase, Kraken, Gemini, Anchorage, Fireblocks, BitGo) themselves as buyers of any institutional-grade B2B tool
- **Corporate treasury teams** at companies adding crypto exposure (Strategy/MicroStrategy, Block, Tesla, increasingly traditional Fortune 500)
- **CFO suites** at companies paying global contractors / creators

### Medium fit

- **Crypto custody and infrastructure providers** as buyers of operational tooling
- **Web3 development companies** (Alchemy, QuickNode, Infura customers)
- **Asset managers and hedge funds** with crypto exposure
- **Crypto trading firms / market makers**

### Lower fit (harder sale)

- **DeFi protocols / DAOs** — diffuse decision-making, token-holder governance
- **NFT marketplaces** — receded as a high-revenue segment
- **Pure-retail-trading exchanges** — buyer is consumer-product PM, not enterprise

### Buyer profile

- Title: CFO, Treasurer, Head of Payments, Head of Crypto, Chief Compliance Officer, BSA Officer, Head of Treasury Operations, Director of Product (Payments)
- Pain articulation: cross-border friction, FX cost, settlement delay, custody risk, compliance reporting burden, integration complexity, vendor concentration
- Buying behavior: sophisticated; expects regulatory specifics in first call; comfortable evaluating technical architecture; multi-vendor evaluation (1 incumbent + 2 challengers typical); 3–9 month sales cycle for material spend
- Budget: increasing; GENIUS Act and ETF flows unlock new corporate treasury budgets

---

## 9. Buying committee and decision dynamics

| Role | What they care about |
|---|---|
| **CFO / Treasurer** | Capital efficiency, liquidity, FX cost, treasury yield, regulatory compliance, audit-readiness |
| **Head of Payments / Chief Payments Officer** | Cost per transaction, corridor coverage, settlement speed, reliability |
| **Chief Compliance Officer / BSA Officer** | KYC/KYB, AML screening, sanctions, SAR filings, regulatory reporting |
| **Chief Information Security Officer** | Custody risk, key management, SOC 2, ISO 27001, penetration testing |
| **Chief Risk Officer** | Counterparty risk, depeg risk, smart-contract risk, regulatory enforcement risk |
| **Head of Product** | Customer-facing UX, integration complexity, API documentation |
| **General Counsel / Head of Legal** | Regulatory posture, licensing, contract structure, indemnification |
| **CIO/CTO** | Architecture, custody architecture (MPC, multisig, HSM), key management, observability |
| **Board / Risk Committee** | For institutions: explicit crypto-risk approval; sometimes mandatory pre-decision |

### Decision pattern

- Crypto-native company: tighter committee, faster cycle
- Traditional financial institution: very wide committee, slow cycle, multiple board sub-committees
- B2B fintech / payments: CFO + Head of Payments + CCO is the core triad; CISO for custody architecture

### Critical observation

For traditional financial institutions, **crypto integration is still a discretionary CEO/Board-level approval** even in 2026. A bank approving a stablecoin settlement rail for treasury operations is a different kind of decision than a normal payments-vendor upgrade. Cambrian's seller-users should map the actual approval gate.

---

## 10. Trigger events

| Trigger | Implication |
|---|---|
| **GENIUS Act compliance deadline (July 18, 2026)** | Issuers and platforms must be compliant; major procurement cycle for compliance tooling, custody, attestation services |
| **Treasury / FDIC / FinCEN final rules (post-April 2026 proposals)** | Specific operational rules drive vendor selection |
| **Bank charter approvals** for Circle, Coinbase, BitGo, Paxos | Significant institutional credibility shift |
| **Major TradFi crypto product launch** (e.g., Meta USDC payments expansion; Western Union USDPT) | Adjacent buyers reconsidering |
| **State BitLicense or MTL action** | Operator must respond |
| **MiCA enforcement action in EU** | EU operations adjustment |
| **Major crypto firm IPO** (Kraken, Gemini pre-IPO) | New compliance and governance buyers |
| **Bitcoin/Ethereum ETF flow surges** | Custody-side capacity buys |
| **Stablecoin depeg event** | Risk-management buying triggered industry-wide |
| **Major exchange or custody breach** | Custody-vendor rotation triggered |

---

## 11. Common failure modes

1. **Treating retail crypto and institutional B2B crypto as the same market.** Completely different buyers, different pain, different sales cycles. Cambrian's seller-users must precisely identify which.
2. **Pitching "crypto" without understanding which crypto.** A stablecoin settlement product is not the same as a token-trading product is not the same as a custody product is not the same as a tax-reporting product.
3. **Stale regulatory framing.** The GENIUS Act changed the conversation in July 2025. Anyone pitching "regulatory uncertainty" as the dominant concern is 12 months behind.
4. **Assuming all stablecoins are equivalent.** USDC, USDT, PYUSD, DAI/USDS, EURC each have different regulatory status, different reserves, different jurisdictional reach. Buyers care which.
5. **Not knowing your vendor's bank charter / MTL status.** Sophisticated buyers ask this in the first 20 minutes. Not knowing the answer ends the sale.
6. **Pitching custody to a company that already custodies internally.** Many institutional crypto buyers self-custody via Fireblocks/BitGo and don't want a third-party custodian. Discovery first.
7. **Ignoring the chain.** Solana vs. Ethereum vs. Base vs. Polygon vs. Hyperliquid actually matters for use case (cost, throughput, ecosystem). Buyers test for chain fluency.
8. **Underestimating the compliance burden.** Even sophisticated crypto-native buyers care about Chainalysis or TRM integration, sanctions screening, OFAC compliance, and SAR/CTR equivalents.

---

## 12. GTM implications for Cambrian seller-users

### What sellers into crypto B2B need to do

- **Sub-categorize the ICP precisely.** Identify whether the prospect is a stablecoin issuer, a custody provider, a B2B payments platform, a TradFi institution adding crypto, a crypto-native exchange, or a CFO-side corporate buyer
- **Speak to regulatory specifics.** GENIUS Act, MiCA, OCC bulletins, NY DFS BitLicense, state MTLs, FATF Travel Rule. Not knowing these in 2026 is disqualifying.
- **Reference adjacent fintech vocabulary.** Treasury management, FX, correspondent banking, interchange, settlement, on/off-ramp. Crypto B2B is a fintech vertical, not a tech vertical.
- **Calibrate to the regulatory clock.** July 18, 2026 GENIUS Act compliance deadline is the dominant procurement-pulling event.

### What sellers *at* crypto companies need

- Account briefs that reflect the buyer's current crypto posture — early-adopter, mid-stage, or skeptical
- Investor intelligence overlay — public crypto companies (Coinbase, Circle, Galaxy, Marathon, Riot, Block, Strategy/MicroStrategy) have different boardroom dynamics than venture-funded crypto-native companies
- Compliance and regulatory layer in every brief

### Cross-vertical lift for Cambrian

- **Fintech / payments layer** — direct overlap; stablecoin rails compete with correspondent banking and card networks
- **Digital incentives** — Runa, Tremendous integrating stablecoin payouts; the digital incentives knowledge layer cross-pollinates here
- **Investor intelligence** — the public crypto companies (Coinbase, Circle) have unique investor stories; specialty crypto VCs (Paradigm, a16z crypto, Variant, Pantera, Multicoin) operate as a distinct sub-archetype
- **Approval gates** — the multi-stakeholder buying committee in TradFi-going-crypto is a textbook case for the approval-gates methodology

### Joe's positioning note

Crypto in 2026 is a fintech vertical, not a tech vertical. The buyer profile, pain language, and decision dynamics are closer to a B2B payments product (which is Joe's home ground from BHN/Tango) than to a SaaS product. The same "regulated payments + cross-border + treasury" muscle Joe built selling digital incentives into procurement organizations is exactly the right muscle for selling crypto B2B in 2026.

---

## 13. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`cambrian_payment_rails_and_disbursements.md\` | Stablecoin rails compete with ACH, SWIFT, Wise, PayPal Payouts; same buyer/use-case framework |
| \`cambrian_investor_intelligence.md\` | Crypto VC archetype (Paradigm, a16z crypto, Variant, Pantera, Multicoin); public crypto company governance |
| \`cambrian_b2b_sales_value_creation.md\` | Institutional-fintech selling motion applies directly |
| \`cambrian_approval_gates_knowledge_layer.md\` | TradFi-going-crypto involves the widest approval-gate committee of any modern B2B sale |
| \`cambrian_fintech_knowledge_layer.md\` | Crypto is now a sub-domain of fintech; vocabulary, buyer titles, and compliance cross-apply |
| \`cambrian_b2b_incentive_platform_economics.md\` | Stablecoin-based payouts directly compete with traditional incentive economics |

---

*End of layer. Update cadence: monthly given regulatory volatility. Critical re-check triggers: GENIUS Act final implementation rules (July 2026), bank charter approvals (Circle/Coinbase/BitGo/Paxos), major regulatory enforcement actions, stablecoin depeg events.*
`,
};

// Required exports for knowledge-lint vertical file schema
export const CRYPTO_STABLECOIN_INJECTION = CRYPTO_STABLECOIN_PLAYBOOK.layerContent;
export const CRYPTO_STABLECOIN_SCORING = CRYPTO_STABLECOIN_PLAYBOOK.keywords.join(", ");
export const CRYPTO_STABLECOIN_DISCOVERY = CRYPTO_STABLECOIN_PLAYBOOK.discovery.join("\n");
