// src/data/investorIntelligenceKnowledge.js
//
// Investor Intelligence — cross-cutting layer for PE, VC, family
// office, and strategic acquirer conversations. Covers due diligence,
// portfolio GTM, market mapping, value creation, LP reporting.
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
Every $1 of incremental EBITDA at 8-12x multiple = $8-12M of enterprise value. Value creation plans typically target: revenue growth (organic + M&A), margin expansion (operating leverage, cost discipline), and multiple expansion (quality of earnings, recurring revenue mix, customer diversification). Post-close first 100 days are critical — establish baseline, identify quick wins, build operating cadence.

AI AS VALUE CREATION LEVER: 70% of PE firms mandate AI adoption in portcos within 18 months. Position AI as defensive (margin expansion via automation) or offensive (growth and new revenue). Clarify which AI investments move specific KPIs investors care about.

INVESTOR EMPATHY: Translate capabilities into the language and metrics of the INVESTOR, not just the operator. Value proposition must resonate at board level. PE operating partners are the most undervalued referral source — win one portco engagement, unlock cross-portfolio expansion.

GTM IMPLICATIONS: The engagement path into investor-owned companies is through the operating partner or value creation team, not the portco CEO directly. Speak EBITDA and multiple expansion, not marketing jargon. Frame every recommendation as "this improvement is worth $X in incremental EBITDA at Yx multiple = $Z of enterprise value."
`;

export const INVESTOR_INTELLIGENCE_DISCOVERY = `
INVESTOR INTELLIGENCE DISCOVERY (use when buyer is PE, VC, family office, or evaluating companies):

- What capital structure governs this company? What's the dominant metric your board/sponsor measures — EBITDA growth, NRR, profitability, or exit readiness?
- How is your sponsor thinking about value creation over the next 18-24 months? What's the maximum payback period for discretionary initiatives?
- How is AI investment positioned at board level — defensive (margin protection) or offensive (growth driver)? Where does it rank on the value creation plan?
- What specific KPIs or narratives do you need to prove for the next LP update, investor day, or exit preparation?
- If your sponsor owns other portfolio companies in this space, have they invested in similar initiatives? What was cost, payback, and competitive impact?
`;
