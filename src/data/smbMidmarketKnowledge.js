// src/data/smbMidmarketKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// SMB & Mid-Market cross-cutting knowledge layer.
// Covers: segment definitions, buying patterns by company size,
// PE-backed company dynamics, discovery calibration, information
// asymmetry, embedded finance posture, trigger events.
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
// - Cambrian operator knowledge (segment definitions, buying patterns)
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const SMB_MIDMARKET_INJECTION = `
SMB & MID-MARKET INTELLIGENCE (apply to ANY account under ~2,500 employees or ~$1B revenue — adjusts brief calibration by company size):

SEGMENT DEFINITIONS (practical operator framework):
- Small business / SMB: <100 employees, <$10M revenue, owner-operator decisions, single-DM cycle, close in days-weeks
- Lower mid-market: $10M-$50M revenue, 100-300 employees, function-head decisions, 2-4 stakeholders, 3-6 month cycles
- Core mid-market: $50M-$500M revenue, 300-1,000 employees, VP + cross-functional + CFO, 3-7 stakeholders, 4-8 month cycles, procurement starts here
- Upper mid-market: $500M-$1B+ revenue, 1,000-2,500 employees, buying committees, formal procurement, 6-12 month cycles, C-suite sponsorship required
- Enterprise: $1B+ revenue, 2,500+ employees, 6-25 stakeholder committees, 6.5 month average close (up from 4.9 in 2019) [verified 05/2026, Gartner Future of Sales 2025]
The operationally important distinction is BUYER COMPLEXITY, not headcount. A 50-person SaaS with a procurement function buys more like enterprise than a 500-person manufacturer with a single CFO who decides everything.

MARKET SCALE: ~33.2M SMBs nationally (99.9% of all U.S. businesses) [verified 05/2026, SBA Office of Advocacy]. ~200,000 mid-market firms ($10M-$1B) [verified 05/2026, NCMM]. Mid-market = 1/3 of private sector GDP, 48M employees, $10T+ collective revenue [verified 05/2026, NCMM Middle Market Indicator]. If U.S. mid-market were a standalone economy, it would be the 5th largest in the world [verified 05/2026, NCMM].

MID-MARKET 2025 PERFORMANCE: Revenue growth 10.7% YoY (down from 12.9% peak) [verified 05/2026, NCMM Middle Market Indicator Q4 2025]. Employment growth 7.3% [verified 05/2026, NCMM]. Top concerns: inflation, economic uncertainty, trade policy, talent, cybersecurity. 54% added headcount in mid-2025 [verified 05/2026, NCMM]. IT spending growth 9.8% for SMBs [verified 05/2026, GTIA/CompTIA IT Industry Outlook 2025]. 2/3 of SMBs spend $25K-$1M on tech annually [verified 05/2026, GTIA 2025].

SMB BUYING PATTERNS:
- Owner-operator IS the decision-maker, budget holder, AND user. Single-stakeholder, days-to-weeks.
- 80%+ of SMB tech evaluation happens online before any vendor contact [verified 05/2026, GTIA 2025]. Reps are NOT the primary channel.
- Peer reviews drive selection (G2, Capterra, Trustpilot, Reddit, industry forums).
- Free trial / freemium expected. Self-service onboarding preferred. Price transparency expected.
- Annual contracts tolerated; multi-year resisted.
- SMB pain by function: Finance (87% considering integrated financial software) [verified 05/2026, Sage SMB Finance Survey 2025], HR (payroll/benefits simplification), Sales (CRM/lead gen consolidation), IT (cybersecurity #1), Operations (workflow automation).

SMB BUYING TRIGGERS (highest-leverage signals):
New funding, hiring spike in a function, new senior hire from sophisticated company, competitor adoption (FOMO), regulatory deadline, Q4 spend-down / Q1 budget reset, negative reviews or leadership departures, growth signals (expansion, new locations).

MID-MARKET BUYING SHIFTS (what changes as companies grow):
1. Multiple stakeholders enter buying committee (1-2 SMB → 3-7 core mid-market)
2. Procurement becomes a real function (vendor management, pricing negotiation)
3. Security/IT review becomes table stakes (SOC 2, DPA, pen testing)
4. Legal becomes real friction (outside counsel billing hourly slows contracts)
5. Multi-year contracts become possible
6. Reference calls become essential
7. POCs/pilots become part of the process
8. Average mid-market SaaS contract: $25K-$250K ARR [verified 05/2026, Cambrian operator knowledge]

MID-MARKET TRIGGER EVENTS:
PE acquisition/recap (new ownership = new buying cycle), C-suite hire from larger/PE-backed company, Series C+ fundraising, acquisition of another company, geographic expansion, earnings call with specific initiatives, job posts revealing initiative-level hiring, tech stack changes, office expansion, compliance deadline, customer concentration shift, industry M&A wave.

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

SEGMENT-AWARE BRIEF CALIBRATION:
- SMB briefs: lead with owner-operator info, primary pain point, peer benchmarks, simple "next 5 questions"
- Lower mid-market: lead with function-head info, top 2-3 strategic priorities, recent funding/leadership changes
- Core/upper mid-market: lead with multi-stakeholder map, strategic initiatives, sponsor/PE info, RFP intel
- PE-backed: lead with sponsor name, hold cycle position, operating partner priorities, EBITDA impact framing

KNOWN TRAPS (meta-knowledge — where this layer's data goes stale or gets misinterpreted):
- SMB count (~33.2M) includes sole proprietors and non-employer firms. The count of SMBs with EMPLOYEES is ~6.1M. Use the right denominator for the context.
- NCMM "mid-market" definition ($10M-$1B revenue) is narrower than many industry definitions. Some sources define mid-market as $50M-$1B. Always state which definition is in use.
- Mid-market revenue growth (10.7%) and employment growth (7.3%) are NCMM survey-based, not census data. Sample skews toward engaged middle-market executives. [verified 05/2026, NCMM Middle Market Indicator Q4 2025]
- The "5th largest economy" comparison for mid-market is NCMM marketing language. Directionally correct but not a formal GDP comparison.
- GF Data mid-market PE multiples (~7.0x) are for completed transactions in their database. Selection bias: GF Data skews toward lower-mid-market. Upper mid-market PE deals routinely trade at 10-14x.
- Embedded finance market projections ($1.4T) span 5-10 year forecasts with enormous uncertainty bands. The $111B "current" figure is itself an estimate. [verified 05/2026, Lightyear Capital / Bain 2024]
- The 56% "already offer embedded finance" stat defines embedded finance broadly (including payment acceptance). If defined narrowly (BaaS, embedded lending), the penetration is much lower. [verified 05/2026, Plaid Fintech Effect Report 2024]
- AI adoption stats (85% enthusiastic, 73% impact) are from vendor-sponsored surveys. Interpret as directional, not precise.
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
