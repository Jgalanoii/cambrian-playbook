// src/data/bankingKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// U.S. Banking & Capital Markets knowledge layer.
// Covers: G-SIBs, regionals, community banks, credit unions, PE/VC,
// private credit, hard money, family offices, neobanks, BaaS,
// payments, consumer credit, BNPL, digital incentives, crypto,
// insurance, and regulatory backdrop.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   FDIC Quarterly Banking Profile Q4 2025:
//     fdic.gov/analysis/quarterly-banking-profile
//   NCUA Credit Union Data:
//     ncua.gov/analysis
//   Federal Reserve (Fedwire, FedNow, Regulation II):
//     federalreserve.gov/paymentsystems
//   Nacha (ACH network rules & data):
//     nacha.org
//   The Clearing House (RTP network):
//     theclearinghouse.org/payment-systems/rtp
//   OCC Interpretive Letters (crypto/stablecoin guidance):
//     occ.gov/topics/charters-and-licensing/interpretations-and-actions
//   CFPB (Section 1033 / Open Banking):
//     consumerfinance.gov/rules-policy
//   Preqin / PitchBook (Private Capital AUM):
//     preqin.com / pitchbook.com
//   FedFis / S&P Global (BaaS market sizing):
//     spglobal.com/marketintelligence
//   Jefferies (M&A outlook):
//     jefferies.com/insights
//   Investment Company Institute (Money Market Funds):
//     ici.org/research/stats

export const BANKING_INDUSTRY_INJECTION = `
U.S. BANKING & CAPITAL MARKETS CONTEXT (use when target or seller is in banking, financial services, lending, PE, VC, credit, wealth management, or fintech):

MARKET SNAPSHOT (FDIC QBP Q4 2025 — canonical industry baseline):
- **4,336 FDIC-insured banks** (down 43 in Q4 2025 alone: 36 mergers, 4 sold to nonbanks, 2 liquidations, 1 new). Consolidation accelerating. [verified 05/2026, FDIC QBP Q4 2025]
- Top 4 (JPM $4.43T, BAC $3.4T, C $2.4T, WFC $2.0T) hold ~$11T combined — more than the next 4,000+. [verified 05/2026, FDIC QBP Q4 2025]
- ~4,411 credit unions, ~$2.3T assets. Navy Federal alone: $192B, 15M members. [verified 05/2026, NCUA]
- **Industry net income 2025: $295.6B** (up 10.2% YoY). ROA: 1.20% (up 8bps). [verified 05/2026, FDIC QBP Q4 2025]
- **Industry NIM Q4 2025: 3.39%** — highest since 2019. Community bank NIM: 3.77% (highest since 2018). [verified 05/2026, FDIC QBP Q4 2025]
- NIM driver: cost of funds decreased faster than yield on earning assets. ALCO discipline is the differentiator.
- **Loan growth Q4 2025: +5.9% annual** — fastest in 11 quarters. Led by NDFI loans, credit cards, CRE, C&I. [verified 05/2026, FDIC QBP Q4 2025]
- **60 banks on FDIC problem list** (1.4%). DIF balance: $153.9B, reserve ratio 1.42%. [verified 05/2026, FDIC QBP Q4 2025]
- **Unrealized securities losses: $337.1B** (Q3 2025) — lowest since Q1 2022, still elevated. [verified 05/2026, FDIC QBP Q4 2025]
- Private credit AUM: ~$2.5T, growing. PE "Big Five" (Blackstone, Apollo, KKR, Ares, Carlyle): ~$3.5T combined AUM. [verified 05/2026, Preqin/PitchBook]
- BaaS market: $35-45B globally, projected $75-90B by 2030-2031. [verified 05/2026, S&P Global Market Intelligence]

DEPOSIT DYNAMICS (THE most important story):
- **Noninterest-bearing deposits down 30%+ since March 2022** — structural deposit-mix shift. Only 57% of banks report noninterest-bearing deposit increases. [verified 05/2026, FDIC QBP Q4 2025]
- **Money market fund assets hit $7.02T** in mid-2025 — record high. Mid-2022 to Q2 2023: MMFs received $777B+ from bank deposit migration. This is the structural ceiling on bank deposit-pricing power. [verified 05/2026, Investment Company Institute]
- Interest-bearing deposits +3.7% YoY through March 2025. ~80% of banks reported deposit increases Q1 2025. [verified 05/2026, FDIC QBP Q4 2025]
- Deposit beta is structurally higher — customers more rate-sensitive with better digital alternatives.
- Brokered deposits under increased FDIC scrutiny — higher cost, community banks managing carefully.
- Benchmarks: Huntington (deposit beta discipline + 15bps NIM expansion), Wintrust (~30% noninterest-bearing share), U.S. Bank (61bps cost of funds). [verified 05/2026, Company Earnings Reports]

KEY STRUCTURAL THEMES:
- "Bank vs non-bank" line has dissolved at product level. Apollo extends credit. Stripe holds deposits. Apple issues cards. SoFi has a charter.
- Deposit franchise quality is the #1 strategic question post-SVB/First Republic.
- Middle-market lending moving off bank balance sheets into private credit (Ares, Golub, Blue Owl).
- Every institution running 5-10 generations of vendor systems — tech stack rationalization is constant.
- Cost-to-serve compression from digital competitors is universal.

BANKING TIERS:
- G-SIBs (8): JPM, BAC, C, WFC, GS, MS, BK, STT — dominant but rarely buy from boutique consultants directly.
- Super-regionals ($100B-$700B): USB, PNC, Truist, Capital One, Citizens, Fifth Third, KeyCorp, M&T, Regions, Huntington — SWEET SPOT for GTM consulting. [verified 05/2026, FDIC QBP Q4 2025]
- Community banks (<$10B): ~4,000 banks. Relationship-driven, increasingly serving as BaaS sponsor banks. [verified 05/2026, FDIC QBP Q4 2025]
- Credit unions: mission-driven, committee-governed, slower decisions. Digital experience gap is biggest strategic risk.

PRIVATE CAPITAL:
- PE mega-funds: Blackstone, Apollo, KKR, Ares, Carlyle. Middle-market: Audax, GTCR, Genstar, Vista, Thoma Bravo.
- VC: a16z, Sequoia, Tiger, Insight, General Catalyst, Thrive — top-tier funds increasingly backing fintech and AI infrastructure.
- Private credit: Blue Owl, Golub, HPS (BlackRock), Antares, Monroe. Asset-based finance (ABF) is fastest-growing sub-segment.
- Hard money / business purpose lending: Kiavi, RCN Capital, Lima One, Genesis (GS). Rates 9-13%, LTV 65-75%. [verified 05/2026, Industry Surveys]
- Family offices: 4,500+ SFOs in US, $5T+ AUM. RIA aggregators (Focus, Mercer, Hightower, Mariner) backed by PE. [verified 05/2026, Preqin/PitchBook]

FINTECH/BAAS:
- Neobanks: Chime (~38M users), Cash App (~57M MAU), SoFi (chartered), Mercury, Brex, Ramp, Rho. [verified 05/2026, Company Disclosures]
- BaaS middleware: Unit, Synctera, Treasury Prime, Stripe Treasury, Increase.
- Issuer processors: Galileo (SoFi), Marqeta, Lithic, Highnote.
- Post-Synapse regulatory reset: sponsor bank scrutiny dramatically higher. Bar for BaaS programs has risen.
- Vertical SaaS + embedded finance is the dominant structural trend.

DIGITAL INCENTIVES (Cambrian core competency):
- Blackhawk Network (BHN/Tango), InComm, Tremendous, Giftbit, Reward Gateway — B2B rewards-as-a-service.
- B2B incentives growing faster than consumer: research, recognition, partner programs, sales SPIFFs.
- Card-linked offers scaling through bank channels (Cardlytics, Augeo).
- Embedded loyalty: vertical SaaS platforms building rewards as features.

PAYMENT RAILS STACK:
- ACH: ~31B transactions/year, ~$80T value. Same-day ACH limit $1M. Nacha fraud monitoring Phase 1 effective March 20, 2026 (large originators), Phase 2 June 19, 2026 (all non-consumer originators). New PAYROLL and PURCHASE labels enable receiving-bank anomaly detection. [verified 05/2026, Nacha]
- Wire: Fedwire ~$1.1 quadrillion/year (RTGS in central bank money). CHIPS ~$1.8T/day (~50 banks). Fedwire expanding to 22hrs/day, 6 days/week, 365 days. [verified 05/2026, Federal Reserve]
- Card Networks: Visa, Mastercard (pure networks), AmEx, Discover (network + issuer). Credit interchange 1.4-3.5%. 2024 swipe fees totaled $38.7B. [verified 05/2026, Nilson Report]
- RTP (The Clearing House): ~1,000+ FIs, reaches 70-90% of DDAs. 2024: 343M transactions, $246B (94% YoY growth). Limit raised to $10M Feb 2025. Average payment $719. [verified 05/2026, The Clearing House]
- FedNow (Federal Reserve): 1,500+ FIs (40% of DDAs reachable). Q4 2024 value: $20B (1,500x growth from Q4 2023). Community banks/CUs = 95% of participants. Average payment ~$22K. [verified 05/2026, Federal Reserve]
- **58% of FIs enabling instant payments do so through BOTH RTP AND FedNow** — multi-rail is now norm. RTP and FedNow are NOT interoperable. [verified 05/2026, Federal Reserve/The Clearing House]
- 90% of consumers prefer instant disbursements when offered; 94% satisfaction rate. [verified 05/2026, Federal Reserve Payments Study]
- P2P: Zelle (2,300+ FIs, bank-owned), Venmo (PayPal), Cash App (Block). [verified 05/2026, Early Warning Services]

GENIUS ACT — STABLECOINS (enacted July 18, 2025 — most consequential FS legislation since Dodd-Frank):
Three issuer pathways: (1) Subsidiary of Insured Depository Institution (IDI) — apply to primary federal banking agency; (2) Federal Qualified PPSI — regulated by OCC (Tether, Circle/USDC, PayPal/PYUSD); (3) State Qualified PPSI — ≤$10B outstanding, state regime must be certified "substantially similar" by SCRC. [verified 05/2026, GENIUS Act Enacted Text]
Core requirements: 1:1 reserve backing (cash, demand deposits, T-bills ≤93 days, repos); monthly attestations; >$50B issuers require audited annual financials; NO interest/yield to holders; BSA/AML applies; NOT securities or commodities under federal law; restricted to issuance/redemption/reserve management activities; does NOT alter Fed master account eligibility. OCC NPRM March 2026; FDIC NPRM April 2026 (comments due June 9, 2026); most regulations must be final by July 18, 2026. [verified 05/2026, GENIUS Act Enacted Text/OCC/FDIC]
Operator implication: banks evaluating stablecoin issuance (Pathway 1) need economics modeling — application, capital/liquidity, core integration, FDIC deposit treatment. Banks can also hold reserves for nonbank issuers (per OCC IL 1172/1183). Tokenized deposits are the legally distinct alternative (FDIC-insured, on distributed ledger).

OCC CRYPTO INTERPRETIVE LETTERS (2025 reset):
IL 1170 (2020): banks may provide crypto custody. IL 1172 (2020): banks may hold stablecoin reserves. IL 1174 (2021): banks may act as DLT nodes.
IL 1179 (2021): REQUIRED supervisory non-objection — effectively chilled bank crypto for 3+ years.
IL 1183 (March 2025): RESCINDED IL 1179 — banks may engage in crypto activities WITHOUT supervisory non-objection. Withdrew two interagency joint statements on crypto risks.
IL 1184 (May 2025): banks may buy/sell crypto at customer direction; may outsource to third parties.
IL 1186 (Nov 2025): banks may hold crypto on balance sheet for network fees (gas fees).
SAB 121 (SEC, 2022) → SAB 122 (Jan 2025): rescinded balance-sheet requirement for crypto custody. Major operational unlock for traditional bank custody.
Cross-agency April 2025: jointly withdrew 2023 crypto-risk joint statements. July 2025: new joint guidance on risk management (not risk prohibition).

SECTION 1033 OPEN BANKING (saga):
Oct 2024: CFPB final rule (Biden). Same day: bank plaintiffs sue. May 2025: CFPB seeks to vacate its own rule. July 2025: reverses course, requests stay for new rulemaking. Aug 2025: ANPR issued. Sept 2025: JPMorgan-Plaid data-sharing deal with paid pricing structure — paid bank-to-fintech data sharing is becoming the equilibrium. Nov 2025: court vacates/postpones. Dec 2025: CFPB signals interim final rules. Original June 2026 effective date not happening. CFPB structurally constrained (OBBBA $249M budget cap, OLC funding limitations). [verified 05/2026, CFPB/Court Filings]

REGULATION II / DURBIN VACATUR (August 7, 2025):
Corner Post v. Fed: District court vacated Regulation II entirely — Fed exceeded authority by including fixed costs/fraud losses in cap (Durbin requires only incremental costs); one-size-fits-all cap violated transaction-specific statutory language; Loper Bright (post-Chevron) invoked. Court STAYED vacatur pending appeal to 8th Circuit. Banks/networks continue operating under $0.21 + 5bps + $0.01. Proposed 2023 NPRM would have cut to $0.144 + 4bps + $0.013 (~28% reduction). DOJ Visa debit antitrust lawsuit (Sept 2024) ongoing. CCCA (credit card Durbin) reintroduced but not advanced. [verified 05/2026, Federal Reserve/Court Filings]

BANK M&A — 2025-2028 CONSOLIDATION WINDOW:
Jefferies projects window open through 2028 presidential election. Notable: Santander-Webster $12.23B (third-biggest US bank deal since 2010, Santander rises to 19th-largest bank). SoFi +11.8% assets sequentially Q4 2025 (highest among top 50). LendingClub rebranded to "Happen Bank." Buyer drivers: scale economies, deposit diversification, tech/compliance cost sharing. Seller drivers: tech investment pressure, compliance ratchet, margin pressure, aging boards/succession. Regulatory environment more permissive under current administration. [verified 05/2026, Jefferies/S&P Global]

REGULATORY:
- OCC: national banks. Fed: BHCs. FDIC: insured banks. NCUA: credit unions. CFPB: consumer products (severely constrained 2025-2026).
- Basel III endgame substantially softened. Bank M&A window open through 2028.
- Synapse aftermath: BaaS/sponsor bank compliance bar dramatically higher.
- FinCEN: BSA/AML, SAR/CTR, beneficial ownership. OFAC: sanctions. SEC Chair: Paul Atkins.
- Key voices: Jonathan V. Gould (OCC, confirmed late 2025), Travis Hill (Acting FDIC Chair), Christopher Waller (Fed Governor).

CAMBRIAN ENGAGEMENT VECTORS FOR BANKS:
1. Stablecoin readiness diagnostics (GENIUS Act Pathway 1 economics, reserve infrastructure, product strategy)
2. Real-time payments strategy for community banks (~7,000 institutions still haven't adopted FedNow/RTP) [verified 05/2026, Federal Reserve]
3. Bank-fintech partnership evaluation (post-Synapse third-party-risk-management frameworks)
4. Crypto custody go-to-market for regional banks (build-vs-buy: Anchorage, BitGo, Fireblocks, Coinbase Custody)
5. Reg II contingency planning for $10B+ banks (model status quo vs $0.144 cap vs full vacatur scenarios) [verified 05/2026, Federal Reserve/Court Filings]
6. Deposit acquisition and cost-of-funds optimization ($7T MMF overhang, 30%+ NIB decline) [verified 05/2026, FDIC QBP Q4 2025/ICI]

KNOWN TRAPS (meta-knowledge about where banking data fails):
- G-SIB and super-regional asset totals change quarterly — always fetch live for a specific bank
- PE/VC AUM figures are self-reported and vary by source (Preqin vs PitchBook vs firm claims)
- BaaS regulatory landscape is in active flux post-Synapse — any "current status" claim decays within months
- Mutual/member-owned institutions (credit unions, USAA) have limited public financial data — caveat figures
- Deposit flight data is lag-reported (FDIC QBP is ~3 months behind) — don't present as real-time
- Stablecoin legislation (GENIUS Act) has multiple versions — verify enacted vs pending
`;

export const BANKING_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Community/regional banks evaluating stablecoin readiness ($1B-$50B assets)", avgFit: "80-90%", reason: "GENIUS Act Pathway 1 creates new engagement vector; Cambrian's payment-rails operator credibility is uniquely differentiating" },
    { segment: "Digital incentives/rewards platforms", avgFit: "80-90%", reason: "Cambrian's BHN background is directly credible — bullseye ICP" },
    { segment: "BaaS/embedded fintech providers ($5-500M revenue)", avgFit: "75-85%", reason: "Direct domain overlap with Cambrian's payments + incentives expertise" },
    { segment: "Regional banks launching crypto custody or digital-asset services", avgFit: "75-85%", reason: "2025 OCC letter reset + SAB 122 + GENIUS Act = clear path; architecturally similar to BHN branded payments programs" },
    { segment: "PE-backed fintech portfolio companies", avgFit: "70-80%", reason: "Growth-pressured, typically understaffed on GTM, PE operating partners value consultants" },
    { segment: "Community banks adopting real-time payments (RTP/FedNow)", avgFit: "68-78%", reason: "~7,000 institutions still haven't adopted; vendor selection + product strategy + fraud-control implementation" },
    { segment: "Credit unions building member acquisition programs", avgFit: "60-70%", reason: "Rewards/incentives expertise + digital experience gap = real fit" },
  ],
  highFrictionSegments: [
    { segment: "G-SIB / money center banks (JPM, BAC, C, WFC)", avgFit: "5-15%", reason: "Enterprise procurement fortress; rarely buy from sub-$10M boutiques" },
    { segment: "Hedge funds", avgFit: "5-10%", reason: "Almost no GTM consulting buyers" },
    { segment: "Pure DeFi protocols (no TradFi bridge)", avgFit: "10-20%", reason: "Different operating logic, not core competency" },
    { segment: "Wealth management broker-dealer infrastructure", avgFit: "15-25%", reason: "Saturated; specialized firms entrenched" },
  ],
};

export const BANKING_DISCOVERY_INJECTION = `
BANKING & FINANCIAL SERVICES DISCOVERY (use when prospect is in banking, fintech, payments, lending, or capital markets):

REALITY stage — understand their operation:
- How is your revenue split across NII, fee income, interchange, and noninterest? How is NIM trending?
- What's your deposit mix — noninterest-bearing vs. interest-bearing? How has it shifted since 2022?
- Walk me through your payment rails stack — ACH, wire, card, RTP, FedNow. Which are you on? Send-and-receive or receive-only?
- How is your technology vendor ecosystem structured — who's your core processor (Fiserv/Jack Henry/FIS)? When is the next contract refresh cycle?
- What's your current relationship architecture with fintech partners — BaaS, embedded finance, API integrations?

IMPACT stage — quantify the pain:
- What's your cost of funds and how does it compare to peer group? Where are you losing deposits to?
- How are you modeling the Reg II contingency — what happens to interchange revenue under each Corner Post outcome scenario?
- Where's the biggest gap between where your digital banking experience is and where it needs to be?
- How exposed are you to a single fintech partner, BaaS relationship, or technology vendor?
- What's the deposit-acquisition CAC by channel — branch, digital, broker, wholesale?

VISION stage — what does success look like:
- How is leadership thinking about stablecoin issuance or reserve custody under the GENIUS Act? Is there a board-level position?
- What's your posture on crypto custody — evaluating build, buy, or partner? Who's driving that conversation internally?
- What does your real-time payments product roadmap look like for the next 18 months? Consumer-facing, corporate, or both?
- How are you thinking about the deposit franchise for the next 3-5 years — organic growth, acquisition, or digital-first transformation?

ENTRY POINTS — who decides:
- Who owns the bank's payment strategy — Head of Treasury Management, CTO, COO, or Chief Digital Officer?
- Is there a PE operating partner, activist, or board member influencing digital/fintech investments?
- Who controls the budget — annual capex cycle or rolling allocation? Is there a board meeting that creates a decision window?
- For stablecoin/crypto: who is leading the regulatory-readiness assessment — General Counsel, Chief Risk Officer, or an external advisor?
`;
