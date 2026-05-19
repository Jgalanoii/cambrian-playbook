// src/data/investorIntelligenceKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// Investor Intelligence — cross-cutting layer for PE, VC, family
// office, and strategic acquirer conversations. Covers due diligence,
// portfolio GTM, market mapping, value creation, LP reporting.
//
// SOURCES:
// - Cambridge Associates US PE Index (1,700 funds, $1.6T, June 2025)
// - Cambridge Associates US VC Index (2,699 funds, $591B)
// - PitchBook / Morningstar Evergreen Fund Indexes (late 2025)
// - Bloomberg, July 2025 (GTCR/BHN reporting)
// - Tracxn / PitchBook (transaction tracking, April 2026)
// - Gartner (agentic AI prediction, 2025)
// - FTI Consulting (healthcare PE/VC investment data)
// - Private Equity Wire (GTCR/BHN deal reporting)
// - SEC filings, press releases (Inspire Brands IPO, Brookfield/Oaktree)
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const INVESTOR_INTELLIGENCE_INJECTION = `
INVESTOR INTELLIGENCE CONTEXT (use when buyer is PE, VC, family office, strategic acquirer, or investor evaluating companies):

INVESTOR USE CASES FOR CAMBRIAN:
- Pre-LOI due diligence: competitive intelligence, capital map, investor archetype profiling, comparable multiples and deal structures
- Portfolio company GTM: benchmark portco go-to-market against peer companies and capital landscape. Unlock hidden value: recurring revenue mix, unit economics reframing, customer concentration risk, competitive positioning
- Market mapping: consolidation patterns, PE buyer concentration, strategic acquirer postures, deal flow velocity within verticals
- Investor reporting: EBITDA bridges, MOIC/IRR trajectories, comparative proof from peer portcos, AI/operational mandate execution

CAPITAL STRUCTURE DETERMINES EVERYTHING:
- PE: 3-7 year hold, EBITDA × multiple = enterprise value, value creation plan with 100-day milestones, operating partner drives GTM decisions
- VC: growth rate > profitability, NRR and ARR growth rate are primary metrics, board influence through lead partner
- Public: earnings predictability, same-store-sales / revenue growth narrative for analysts, activist defense considerations
- Family office / founder: multi-decade horizon, values alignment, relationship-driven, brand preservation
- Strategic acquirer: synergy thesis, integration timeline, revenue synergy vs cost synergy framing

VALUE CREATION ARCHITECTURE:
Every $1 of incremental EBITDA at 8-12x multiple = $8-12M of enterprise value [verified 05/2026, standard PE valuation math]. Value creation plans typically target: revenue growth (organic + M&A), margin expansion (operating leverage, cost discipline), and multiple expansion (quality of earnings, recurring revenue mix, customer diversification). Post-close first 100 days are critical — establish baseline, identify quick wins, build operating cadence.

CROSS-VERTICAL CAPITAL LANDSCAPE (Q2 2026 REFRESH):
The 2025-2026 transition is the most coherent capital-deployment moment since 2021, but structured differently — fortress-building consolidation, not land grabs. PE holds $3.6T+ in dry powder globally [verified 05/2026, Bain Global PE Report 2025] and accounts for ~40% of global M&A activity by value [verified 05/2026, PitchBook Annual PE Breakdown 2025]. PE pays ~3 turns of EBITDA more than strategic buyers [verified 05/2026, GF Data / PitchBook] — a tailwind for operator-led platforms with proven unit economics. North American M&A reached $2.65T in 2025 (second-best year after 2021) [verified 05/2026, Dealogic / Bloomberg]. Mega-buyout count more than doubled from 6 (2024) to 13 (2025) [verified 05/2026, Bain Global PE Report 2025].

AI IS NOW THE DOMINANT M&A THESIS DRIVER across every sector — acquirers in fintech, healthcare, loyalty, and CRE are using M&A to acquire AI capability rather than build it. This reframes Cambrian's positioning: readiness to be acquired (not just to grow) is a credible engagement angle for late-stage clients.

KEY INVESTOR ARCHETYPES BY VERTICAL:
- Fintech/Payments: GTCR ($40B+ AUM [verified 05/2026, GTCR website], BHN $4-5B), Silver Lake, Blackstone, Centerbridge ($2.0B MeridianLink) [verified 05/2026, Centerbridge press release], Clearlake ($4.1B D&B) [verified 05/2026, PitchBook], FTV Capital (former Tango backer — directly relevant to Joe's BHN history)
- QSR/Franchise: Roark Capital (~$37B AUM, 23 chains) [verified 05/2026, Roark Capital website], Blackstone (Jersey Mike's $8B) [verified 05/2026, Bloomberg], Bain Capital, Apollo (Qdoba), JAB Holding
- Healthcare: New Mountain Capital, Audax PE, Innovaccer ($275M) [verified 05/2026, Crunchbase], Cardinal Health, SPRIG Equity. PE/VC in healthcare IT surged 219% to $16.9B in 2024 [verified 05/2026, FTI Consulting]
- Real Estate: Blackstone ($42B equity since early 2024) [verified 05/2026, Blackstone Q4 2024 earnings], Brookfield ($1T+ AUM) [verified 05/2026, Brookfield corporate filings], KKR, Starwood, Apollo. $957B CRE loan maturities in 2025 [verified 05/2026, MSCI Real Assets]
- Charitable/DAFs: DAF Research Collaborative replaced NPT as canonical source. GoFundMe entered DAF market. OBBBA 0.5% AGI floor reshapes donor behavior [verified 05/2026, OBBBA legislative text 2025]

VALUATION CONTEXT: Fintech multiples 5-15x (from 20-40x in 2021) [verified 05/2026, PitchBook Fintech Analyst Note]. All-cash transactions returning as debt financing reopens, but earn-outs standard for bridging gaps. Pre-planned divestitures baked into deal structures for antitrust (Global Payments/Worldpay as template). Capability-driven deals dominate: fraud prevention, identity verification, embedded finance, AI platforms.

REGULATORY CYCLE: OBBBA (2025) is the largest cross-vertical tax-policy shock. GENIUS Act (July 2025) settled stablecoin framework. DORA (Jan 2025, EU) and MiCA (transitional through mid-2026) reshaping European fintech compliance. PACE Act and Fed "skinny account" debate are live 2026 fintech files. Trump administration pro-competition executive orders structurally pro-M&A.

ENGAGEMENT TARGETING: Clients positioning for a 2026-2028 exit window are the highest-value ICP. PE premium multiples + AI as acquisition thesis + valuation comp resets = receptive market. Cambrian engagements that frame revenue architecture work as exit preparation (not just growth) are pricing into this cycle. Grant Thornton compliance pedigree is a genuine differentiator in healthcare and financial services specifically.

AI AS VALUE CREATION LEVER: 70% of PE firms mandate AI adoption in portcos within 18 months [verified 05/2026, Bain PE Operating Partners Survey 2025]. Position AI as defensive (margin expansion via automation) or offensive (growth and new revenue). Clarify which AI investments move specific KPIs investors care about. BUT: Gartner predicts >40% of agentic AI projects canceled by 2027 [verified 05/2026, Gartner 2025 Hype Cycle] — only ~130 of thousands of "AI agent" vendors have actual agentic functionality [verified 05/2026, Gartner Agentic AI Market Analysis 2025]. Distinguish real AI capability from marketing claims in any diligence context.

INVESTOR EMPATHY: Translate capabilities into the language and metrics of the INVESTOR, not just the operator. Value proposition must resonate at board level. PE operating partners are the most undervalued referral source — win one portco engagement, unlock cross-portfolio expansion.

PE/VC PERFORMANCE BENCHMARKS (Q2 2026 REFRESH — Cambridge Associates & PitchBook):
Cambridge Associates US PE Index (1,700 funds, $1.6T value as of June 2025): 1H 2025 return +3.9% (low single-digit quarterly). Growth equity outperformed buyouts (4.9% vs 3.6%). US VC Index (2,699 funds, $591B): +6.4% (extending recovery). Fund managers distributed MORE capital than called ($78.9B out vs $67.6B in) — the "PE LPs need exits" narrative has empirical backing. 2018-2021 vintages dominated distributions, confirming sponsors are actively monetizing maturing portfolios. VC 2022 vintage at +8.6% — strongest signal the valuation reset is past trough. VC sector allocation: IT 48%, healthcare 26%, industrials 11% = 85% of invested capital. [verified 05/2026, Cambridge Associates US PE/VC Index June 2025]

PitchBook: Morningstar PitchBook US Evergreen Fund Indexes launched late 2025 — first comprehensive benchmark for non-traded evergreen private market funds. The rise of evergreen vehicles is the structural product innovation reshaping LP access to PE/VC. PitchBook analyst note flags potential 2026 IPOs of SpaceX, OpenAI, and Anthropic for VC liquidity implications. [verified 05/2026, PitchBook / Morningstar]

TRACKED TRANSACTIONS (live as of May 2026):
- GTCR / Blackhawk Network: STILL IN ADVANCED TALKS, NO CLOSE. July 2025 Bloomberg reports of $4-5B, owners seeking >$5B. No binding agreement as of April 2026 per Tracxn/PitchBook. IPO option remains alive. Longer-than-typical timeline suggests valuation friction or diligence complexity. [verified 05/2026, Bloomberg / Tracxn / PitchBook]
- Inspire Brands IPO (Roark Capital): FORMAL PROCESS UNDERWAY. Banks selected April 2026: JPMorgan Chase and Bank of America (lead), Barclays, Goldman Sachs, Morgan Stanley (support). 2025 financials: $33.4B global sales, 33,300+ restaurants, 60 markets, 2,800+ franchisees. Most significant PE-to-public franchise exit since pre-pandemic — pricing and multiple will reset franchise-platform comps. [verified 05/2026, SEC filings / Bloomberg]
- Brookfield / Oaktree: ANNOUNCED, PENDING CLOSE. Brookfield acquiring remaining ~26% interest to take Oaktree private under 100% ownership. Alt-manager consolidation template — private credit now $2.5T market, specialist managers increasingly likely targets. [verified 05/2026, Brookfield corporate filings / Preqin]

GTM IMPLICATIONS: The engagement path into investor-owned companies is through the operating partner or value creation team, not the portco CEO directly. Speak EBITDA and multiple expansion, not marketing jargon. Frame every recommendation as "this improvement is worth $X in incremental EBITDA at Yx multiple = $Z of enterprise value."

KNOWN TRAPS (meta-knowledge — where this vertical's data goes stale or gets misinterpreted):
- GTCR/BHN deal: "advanced talks" since July 2025, NO binding agreement as of May 2026. Do NOT state as closed. Verify before every use.
- Inspire Brands IPO: formal process underway but not priced. Banks selected != IPO completed. Do not cite a valuation until pricing.
- Brookfield/Oaktree: announced but pending close. Do not state as completed unless confirmed.
- PE dry powder ($3.6T) is a global aggregate from multiple data providers with different methodologies. Bain, PitchBook, and Preqin all report slightly different numbers.
- "PE pays ~3 turns more" is a market-wide average. Sector-specific premiums vary dramatically (healthcare > fintech > industrials).
- Cambridge Associates PE/VC index returns are NET of fees and carry. Gross returns are materially higher — do not confuse the two.
- The "70% of PE firms mandate AI adoption" stat is from a survey of operating partners, not a census. Selection bias likely inflates the number. [verified 05/2026, Bain PE Operating Partners Survey 2025]
- Gartner's ">40% agentic AI projects canceled by 2027" is a PREDICTION, not a measurement. Treat as directional forecast.
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
