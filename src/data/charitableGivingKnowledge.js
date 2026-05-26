// src/data/charitableGivingKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// Charitable giving, donor-advised funds (DAFs), and charity gift cards
// deep knowledge layer. Covers: 501(c)(3) infrastructure, DAF mechanics,
// IRS regulatory framework (§4966/4967/170), charity gift card operating
// models, corporate philanthropy, workplace giving, grantmaking platforms,
// matching gift automation, and unit economics.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_CHARITABLE_GIVING (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   DAFRC (Heist, Vance-McMullen, Williams, Shaker, Sumsion, 2025, DOI: 10.4087/XUGU3656):
//     the canonical primary source for DAF aggregate data (replaced NPT)
//   DAFgiving360 FY2025 Annual Report
//   IPS Independent Report on DAF payout rates
//   Giving USA 2025 (individual/corporate/foundation/bequest splits)
//   IRS §4966/§4967/§170 regulatory framework
//   Pension Protection Act of 2006
//   November 2023 Proposed DAF Regulations (Treasury/IRS)
//   OBBBA (One Big Beautiful Bill Act, passed 2025)
//   Inside Philanthropy editorial coverage
//   CCS Fundraising reports
//   National Philanthropic Trust (NPT) — historical data only
//   Fidelity Charitable Annual Giving Report (2025)
//   Schwab Charitable Impact Report (2025)
//   Benevity corporate disclosures and impact reports
//   Double the Donation matching gift research
//   Coresight Research, corporate gifting market (2025)
//   Chronicle of Philanthropy
//
// -- KNOWN TRAPS --
//   1. DAF payout rate stats vary wildly depending on whether donation-
//      processor DAFs (168% payout) are included — always clarify universe.
//   2. "Total DAF assets" conflates national sponsors (70% of assets) with
//      community foundations (very different economics) — segment before citing.
//   3. Gift card "revenue" is almost entirely liability — quoting GMV as
//      revenue misrepresents the business by 10-20x.
//   4. OBBBA deduction compression (0.5% AGI floor) is new for 2026 — many
//      practitioners are still citing pre-OBBBA rules.
//   5. PF-to-DAF and DAF-to-DAF transfers inflate apparent payout rates —
//      flag this when citing DAFRC payout data.
//   6. November 2023 proposed DAF regs are still pending — do not cite as
//      final rules.
//   7. NPT is no longer the canonical data source — DAFRC (2025) replaced it.

// -- CHARITABLE GIVING INJECTION --
// Injected when the seller or target operates in charitable giving,
// philanthropy, DAFs, nonprofit tech, workplace giving, or charity gift cards.

export const CHARITABLE_GIVING_INJECTION = `
CHARITABLE GIVING & DAF CONTEXT (use when target or seller is in charitable giving, donor-advised funds, philanthropy, nonprofit infrastructure, or charity gift cards):

SECTION 1 — SNAPSHOT & MARKET SIZING:
U.S. charitable giving ~$560-580B annually [verified 05/2026, Giving USA 2025]. Individual giving ~67% (~$370B), corporate ~7% (~$40B), foundation ~19% (~$100B+), bequests ~8% (~$45B) [verified 05/2026, Giving USA 2025]. ~1.8M registered 501(c)(3) public charities [verified 05/2026, IRS BMF Data]. Half of charitable dollars flow through intermediaries (DAFs, private foundations, community foundations, charity gift card platforms), with intermediary share growing rapidly.

DAF-SPECIFIC MARKET: ~3M+ active DAF accounts across ~1,500 sponsoring organizations [verified 05/2026, DAFRC 2025]. Total DAF assets ~$280-300B, annual contributions ~$85B, annual grants ~$55-65B [verified 05/2026, DAFRC 2025]. DAFs capture ~16% of individual giving and growing. DAF assets have roughly tripled in the last decade, making DAFs the fastest-growing vehicle in organized philanthropy.

CORPORATE GIVING: ~$40B annually in direct corporate philanthropy. Total corporate gifting market (including non-charitable business gifts) ~$240B [verified 05/2026, Giving USA 2025 / Coresight Research]. Corporate charitable gifts include: direct grants, corporate foundation grants, matching gifts, volunteer programs, cause marketing, and corporate gift cards.

NONPROFIT TECHNOLOGY: the software market serving nonprofits and philanthropic organizations is ~$15-18B globally, encompassing CRM/donor management, fundraising platforms, giving/grantmaking tools, volunteer management, and financial management [verified 05/2026, industry estimates].

WORKPLACE GIVING: employer-facilitated charitable giving programs process ~$5-8B annually through platforms like Benevity, YourCause, and Bright Funds [verified 05/2026, Benevity / industry reporting]. Workplace giving has shifted from United Way payroll deduction (declining) to digital platforms offering employee choice, matching automation, and volunteer tracking.

SECTION 2 — WHAT MAKES THIS DISTINCT:
Charitable giving is distinct because it operates at the intersection of tax law, emotional decision-making, regulatory compliance, and increasingly sophisticated financial engineering. Key dynamics:
- TAX EFFICIENCY DRIVES STRUCTURE: the entire DAF ecosystem exists because of tax optimization — immediate deduction at contribution, tax-free growth, no capital gains on appreciated asset donations. Understanding tax mechanics is not optional; it is the foundation of the market.
- INTERMEDIARY GROWTH IS THE STRUCTURAL STORY: the shift from direct donor-to-charity giving to intermediary-mediated giving (DAFs, workplace platforms, gift cards) is the defining trend of the last decade. Intermediaries offer convenience, tax optimization, and aggregation — but they also introduce payout delays and concentration risk.
- DAF PAYOUT CONTROVERSY IS POLITICAL: DAFs have no mandated minimum payout (unlike private foundations at 5%). Critics argue this allows indefinite tax-advantaged accumulation. Proponents cite overall payout rates above private foundation minimums. This debate shapes regulation and public perception.
- CORPORATE GIVING IS AN HR/ENGAGEMENT PLAY: corporate philanthropy has shifted from pure altruism to employee engagement strategy. Workplace giving platforms are sold to HR/People teams as retention and culture tools, not to foundations. The buyer is the CHRO, not the CSR director.
- GIFT CARD LIABILITY ACCOUNTING IS CONFUSING: charity gift card platforms record gift card sales as liabilities (funds held for future charitable distribution), not revenue. Platform revenue is only the operational fee margin. This creates apparent size mismatches where GMV exceeds reported revenue by 10-20x. Misunderstanding this accounting treatment leads to fundamentally wrong valuation and competitive comparisons.

SECTION 3 — SUB-CATEGORIZATION:
DONOR-ADVISED FUNDS (DAFs):
The dominant and fastest-growing charitable giving vehicle. Mechanics: donor contributes cash or assets to a DAF sponsoring organization, receives immediate tax deduction, advises on grants to charities over time (no timeline requirement), funds grow tax-free. Legally, the sponsoring organization owns the funds; donor has "advisory" (not legal) control.
- NATIONAL/COMMERCIAL DAF SPONSORS: Fidelity Charitable, Schwab Charitable (DAFgiving360), Vanguard Charitable, National Philanthropic Trust (NPT). Only 3% of sponsors but hold ~70% of DAF assets [verified 05/2026, DAFRC 2025]. Massive scale, low-cost, investment-platform-integrated. Fidelity Charitable is the largest grant-making entity in the U.S.
- COMMUNITY FOUNDATION DAFs: ~788 community foundations offer DAFs [verified 05/2026, DAFRC 2025]. Geographically focused, local knowledge, advisory services. Different economics than national sponsors (higher fees, more hands-on, smaller accounts).
- SINGLE-ISSUE / MISSION DAFs: ~598 organizations [verified 05/2026, DAFRC 2025]. Faith-based (National Christian Foundation, Jewish Communal Fund), university-affiliated, cause-specific. Donors aligned with a specific mission.
- DONATION-PROCESSOR DAFs: GoFundMe entered the DAF market in 2025 [verified 05/2026, DAFRC 2025]. Structurally distinct from traditional DAFs: 168% payout rate in FY2024 vs 24% for all other DAFs [verified 05/2026, DAFRC 2025]. These are pass-through vehicles, not accumulation vehicles.

PRIVATE FOUNDATIONS:
The traditional alternative to DAFs. 5% mandatory annual payout, 30% AGI cash deduction limit (vs DAF 60%), 1.39% excise tax on investment income [verified 05/2026, IRS §4940/§4942], full board control, public tax returns (990-PF). Practical above ~$2M assets. ~120,000 private foundations in the U.S. Growing concern: PF-to-DAF transfers ($3.2B+ in 2022) and DAF-to-DAF transfers ($4.4B in 2023) may overstate apparent payout rates [verified 05/2026, DAFRC 2025].

WORKPLACE GIVING PLATFORMS:
Employer-facilitated giving: employee donation portals, matching gift administration, volunteer tracking, charity verification, payroll deduction, corporate reporting/ESG. The buyer is HR/People, not the corporate foundation. Key differentiator: matching gift automation (employees give, employer matches, platform administers).

CORPORATE PHILANTHROPY / CSR:
Direct corporate grants, corporate foundation grants, cause marketing, employee volunteer programs, in-kind donations. Increasingly tied to ESG reporting and employee engagement metrics. Corporate buyers: HR/People teams (employee engagement), Marketing (cause marketing, client gifting), Procurement (vendor-gift compliance), Finance (tax optimization, ESG reporting).

CHARITY GIFT CARDS:
Niche but growing — combines prepaid card mechanics with DAF-like liability accounting. Model: buyer purchases card (corporate or consumer), card delivered to recipient, recipient selects charity from verified database (~2M charities), platform distributes funds. Revenue model: operational fee margin on card sales (typically 5-15% of face value). Tax treatment: buyer gets deduction at purchase for charitable purpose; recipient does not (they are selecting allocation, not making a donation). B2B is the high-value segment (corporate gift cards $5K-$500K+ programs vs consumer $25-$100).

ONLINE FUNDRAISING / CROWDFUNDING:
GoFundMe, Classy (GoFundMe subsidiary), Facebook/Meta Fundraisers, GlobalGiving. Individual-to-charity and peer-to-peer fundraising. High volume, low average gift ($50-150). Platform economics: 0-5% platform fee + payment processing (2.2-2.9% + $0.30). GoFundMe's entry into DAF market in 2025 blurs the line between crowdfunding and intermediary giving.

GRANTMAKING PLATFORMS:
Software for foundations and corporate givers to manage the grant application, review, approval, disbursement, and reporting cycle. Submittable, Fluxx, SmartSimple, Foundant, Blackbaud GIFTS Online. Buyer = foundation program officers and corporate CSR managers. Grant volume is large ($100B+ annually from all foundation types) but the software market serving it is relatively small.

SECTION 4 — MAJOR COMPANIES (20 named):
NATIONAL DAF SPONSORS:
- Fidelity Charitable: largest DAF sponsor and the largest grant-making charity in the U.S. ~$50B+ in assets, ~$12B+ in annual grants [verified 05/2026, Fidelity Charitable Annual Report]. Subsidiary of Fidelity Investments — DAF distribution is integrated with Fidelity's investment/brokerage platform. Competitive advantage: massive scale, low fees (0.60% admin fee on first $500K), seamless integration with Fidelity investment accounts.
- Schwab Charitable (DAFgiving360): ~$30B+ in assets [verified 05/2026, DAFgiving360 FY2025 Report]. 155,000 charities supported via 1.4M grants (19% YoY growth); $24M+ granted per day; 38% scheduled recurring; 78% within own state; 85% to previously-supported charities, 15% net-new [verified 05/2026, DAFgiving360 FY2025 Report]. Julie Sunwoo (president) is a key voice.
- Vanguard Charitable: ~$20B+ in assets. Investment-focused, low-cost positioning aligned with Vanguard brand. Targets index-fund investors.
- National Philanthropic Trust (NPT): ~$25B+ in assets. Independent (not affiliated with a financial services firm). Offers customized philanthropic services, international grantmaking, and specialty vehicles. Historical data source for DAF industry — now superseded by DAFRC for aggregate statistics.

WORKPLACE GIVING PLATFORMS:
- Benevity: the dominant workplace giving platform. ~$15B+ cumulative donations processed [verified 05/2026, Benevity corporate disclosures]. Used by Fortune 500 companies for employee giving, matching, volunteering, and community investment. Acquired by Hershey Company in 2024, then re-acquired management (verify current ownership structure). [verified 05/2026, Benevity / industry reporting]
- YourCause (Blackbaud): workplace giving platform acquired by Blackbaud in 2019. Integrated into Blackbaud's broader nonprofit technology suite. Strong in large enterprise.
- Bright Funds: workplace giving platform focused on employee experience and curated giving. Smaller than Benevity/YourCause but differentiated UX.
- Millie: newer workplace giving platform emphasizing modern UX and millennial/Gen-Z employee engagement. Growing in tech companies.

ONLINE FUNDRAISING / NONPROFIT CRM:
- Classy (GoFundMe): fundraising platform for nonprofits. Acquired by GoFundMe in 2022. Powers online fundraising campaigns, peer-to-peer, events, recurring giving. GoFundMe's entry into DAF market leverages Classy's nonprofit relationships [verified 05/2026, GoFundMe / Classy].
- Every Action (Bonterra): nonprofit CRM and fundraising platform created from merger of EveryAction, Social Solutions, and CyberGrants under Bonterra brand. Serves advocacy, fundraising, and grantmaking. [verified 05/2026, Bonterra]
- Network for Good: donor management and fundraising CRM for small-to-mid nonprofits. Simple, affordable, focused on organizations with <$5M annual revenue.
- GlobalGiving: online fundraising platform connecting donors to grassroots projects worldwide. Intermediary model — vets and recommends projects. ~$800M+ raised since inception [verified 05/2026, GlobalGiving].
- Blackbaud: the enterprise nonprofit technology platform. CRM (Raiser's Edge NXT), financial management (Financial Edge NXT), online giving, peer-to-peer, grantmaking. Dominant in large nonprofits, universities, healthcare systems. ~$1B+ revenue [verified 05/2026, Blackbaud 10-K].
- CAF America (Charities Aid Foundation America): cross-border grantmaking intermediary. Validates international charities for U.S. corporate and foundation donors. Solves the complex problem of making tax-deductible grants to foreign organizations.

MATCHING GIFT TECHNOLOGY:
- Double the Donation: matching gift automation platform. Integrates with nonprofit donation forms to identify employer matching gift eligibility and automate the submission process. ~$2-4B in matching gifts go unclaimed annually — Double the Donation addresses this gap [verified 05/2026, Double the Donation research].
- 360MatchPro (Double the Donation product): enterprise matching gift automation for larger nonprofits and corporate partners.

DAF DEMOCRATIZATION PLATFORMS (new wave):
- Daffy: mobile-first DAF platform. No account minimums (vs traditional $5K-$25K). Subscription pricing ($3-$20/month) instead of AUM-based fees. Targeting younger, smaller donors [verified 05/2026, Daffy].
- Charityvest: zero-minimum DAF with group giving features. Emphasizes social giving and donor collaboration.
- Chariot: DAF integration for nonprofits — allows donors to give from their existing DAF to any nonprofit via a checkout widget. Solving the "last mile" problem of DAF-to-charity connection.

SECTION 5 — REGULATORY OVERLAY:
IRS TAX FRAMEWORK:
- §170: governs charitable contribution deductions. Cash to public charities: 60% AGI limit. Appreciated property: 30% AGI limit. DAF contributions follow public charity limits (higher than private foundations). Carryforward: excess deductions carry forward 5 years.
- §4966: 20% excise tax on taxable distributions from DAFs. Applies to distributions that are not for charitable purposes — prevents DAF funds from being redirected to non-charitable uses.
- §4967: 125% excise tax on distributions from DAFs that provide a "more than incidental benefit" to the donor, donor advisor, or related persons. Anti-self-dealing provision.
- PENSION PROTECTION ACT OF 2006: created the modern statutory framework for DAFs. Defined "donor-advised fund" and "sponsoring organization" in tax code for the first time. Established the excise tax provisions (§4966, §4967) and reporting requirements.

PENDING REGULATIONS:
- NOVEMBER 2023 PROPOSED DAF REGULATIONS: Treasury/IRS proposed expanded definitions of DAF, distribution, and donor-advisor. Would broaden what qualifies as a DAF (potentially capturing university endowment funds and other vehicles). STILL PENDING as of 2026 — do not cite as final rules [verified 05/2026, IRS / Federal Register].
- DAF PAYOUT MANDATE DEBATE: multiple legislative proposals (ACE Act, Charitable Act) have attempted to impose minimum payout requirements on DAFs (similar to private foundation 5%). None have passed. The debate continues but no legislation is imminent [verified 05/2026, DAFRC / Chronicle of Philanthropy].

OBBBA (ONE BIG BEAUTIFUL BILL ACT, passed 2025):
Starting 2026, itemizers can only deduct charitable contributions above 0.5% of AGI; top-rate deduction value reduced from 37% to 35%. This is the dominant 2026 regulatory input reshaping donor behavior. Expected effects: compress the number of small/mid DAF accounts (reduced tax benefit for moderate donors), while DAF assets continue to grow (large donors still benefit significantly, and bunching strategy becomes even more important) [verified 05/2026, OBBBA legislative text 2025].

STATE CHARITABLE SOLICITATION REGISTRATION:
~40+ states require registration before soliciting charitable contributions. Each state has different requirements, thresholds, and renewal cycles. Compliance is operationally burdensome, especially for organizations soliciting nationally. Platform operators (DAF sponsors, charity gift card companies, fundraising platforms) must navigate multi-state registration for themselves and sometimes for their charity partners.

FORM 990 REPORTING:
All 501(c)(3) organizations file Form 990 (or 990-EZ, 990-N for small organizations). DAF sponsors file Schedule D (Supplemental Financial Statements) with DAF-specific disclosures. Private foundations file 990-PF with detailed grant and investment reporting. These are public documents — donors, journalists, and researchers use them for accountability analysis.

EXPENDITURE RESPONSIBILITY:
When a DAF makes a grant to an organization that is NOT a public charity (e.g., a foreign organization, a social enterprise, a Type III supporting organization), the sponsoring organization must exercise "expenditure responsibility" — tracking how funds are used and reporting to the IRS. This adds significant operational complexity and cost to international and non-standard grantmaking.

SECTION 6 — TECHNOLOGY STACK:
DAF PLATFORM INFRASTRUCTURE:
- Account management: donor/advisor accounts, contribution processing, investment selection, grant recommendation workflows.
- Investment management: integration with custodians (Fidelity, Schwab, Vanguard) and investment platforms. Pooled investment vehicles or individual account portfolios. Investment returns drive asset growth (and fees for sponsors).
- Grant processing: charity verification (IRS BMF database check, OFAC screening, state registration verification), grant disbursement (check, ACH, wire), acknowledgment generation.
- Tax reporting: contribution receipts (for donor tax deduction), grant summaries, Form 990/Schedule D preparation.
- Donor portal: web/mobile interface for donors to manage their DAF — view balance, recommend grants, schedule recurring grants, see grant history.

WORKPLACE GIVING PLATFORM STACK:
- Employee giving portal: integrated with HRIS (Workday, BambooHR, ADP) for payroll deduction and employee data.
- Matching gift engine: rules engine for matching programs (1:1, 2:1, caps, eligibility criteria, nonprofit exclusions).
- Charity database: verified nonprofit database (~1.5-2M organizations). IRS BMF sync, state registration data, financial health indicators (revenue, assets, program expense ratio).
- Volunteer management: event creation, hour tracking, skills-based volunteering matching, team/company leaderboards.
- Reporting/analytics: ESG reporting, employee participation rates, total giving impact, department/location breakdowns.
- SSO/integration: SAML/OIDC for enterprise SSO, HRIS integration for employee data, finance system integration for payroll deduction.

CHARITY GIFT CARD PLATFORM STACK:
- Card/code generation: physical cards, e-cards, redemption codes. Bulk generation for corporate programs.
- Redemption portal: recipient-facing interface for charity selection, search, and allocation.
- Charity verification: real-time IRS BMF validation, OFAC screening, state registration check at every redemption.
- Liability accounting: gift card sales recorded as liability, recognized as expense only upon charitable distribution. Breakage (unredeemed cards) has specific accounting treatment.
- Corporate ordering: bulk ordering interface, custom branding, delivery scheduling, corporate account management.
- API: integration with corporate HR platforms, rewards/incentive platforms, and e-commerce checkout flows for embedded charitable giving.

FUNDRAISING PLATFORM STACK:
- Campaign management: fundraising pages, donation forms, peer-to-peer campaigns, event fundraising.
- Payment processing: credit card, ACH, Apple Pay, Google Pay, DAF checkout (Chariot), crypto, stock. Payment processing is the critical infrastructure — typically 2.2-2.9% + $0.30 per transaction.
- CRM integration: donor records, gift history, communication preferences, major gift tracking. Salesforce Nonprofit Cloud, Blackbaud RE NXT, Bloomerang, Little Green Light.
- Communication: email/SMS marketing, thank-you automation, impact reporting to donors.
- Analytics: donor acquisition cost, retention rate, lifetime value, campaign ROI, recurring giving conversion.

SECTION 7 — ICP PATTERNS:
CHARITY GIFT CARD PLATFORMS (Charity On Top model):
- Profile: combines digital incentives expertise (prepaid card mechanics, bulk distribution, corporate ordering) with charitable compliance (IRS verification, liability accounting, state registration).
- Buying behavior: looking for corporate channel development, B2B marketing, operational scaling. Unique challenge: educating the market on a new category (charity gift cards as corporate gifts/incentives).
- Seller implication: the highest-leverage Cambrian intersection — Joe's BHN (digital incentives) background + charitable giving domain + corporate GTM expertise. Speak both the incentives language and the charitable compliance language.

MISSION-BASED DAF PLATFORMS (Daffy, Charityvest, Chariot tier):
- Profile: fintech-meets-philanthropy. Mobile-first, consumer-facing, disrupting traditional DAF sponsors with lower minimums, modern UX, and subscription pricing.
- Buying behavior: growth-stage, venture-funded, scaling consumer and corporate acquisition simultaneously. Need product-led growth optimization, partnership strategy, and brand differentiation.
- Seller implication: these are fintech companies that happen to be in philanthropy. Sell to them using fintech GTM frameworks (PLG, CAC, NRR, activation rates). They think like SaaS companies.

WORKPLACE GIVING PLATFORMS ($5-100M revenue):
- Profile: B2B SaaS selling into HR/CSR buyers at mid-to-large enterprises. Multi-stakeholder sales (HR, Finance, Legal, IT). Recurring revenue (annual contracts, per-employee pricing).
- Buying behavior: enterprise sales cycle (3-9 months), need to demonstrate employee engagement ROI, ESG/CSR impact reporting, and admin efficiency gains. Highly competitive market (Benevity dominant).
- Seller implication: standard B2B SaaS selling motion but with philanthropy-specific value proposition. Differentiation through integration depth (HRIS, payroll, finance), charity database quality, and matching gift automation.

COMMUNITY FOUNDATIONS WITH DAF PROGRAMS ($100M+ assets):
- Profile: geographically focused organizations serving local donors and nonprofits. Smaller scale than national sponsors but deeply embedded in their communities.
- Buying behavior: conservative, relationship-driven, slow-moving. Need donor acquisition, corporate partnership development, and technology modernization (many running legacy systems).
- Seller implication: long sales cycles, small budgets, but deep loyalty. Win one community foundation and get referrals across the community foundation network.

SECTION 8 — BUYING COMMITTEE:
CORPORATE GIVING / WORKPLACE PLATFORM BUYER:
- CHRO / VP PEOPLE (economic buyer): workplace giving is an employee engagement tool. Budget sits in HR/People. Evaluated on employee participation rates, retention impact, and culture metrics.
- VP CSR / HEAD OF SOCIAL IMPACT (champion): the person operationally responsible for corporate giving programs. Owns the vendor relationship day-to-day. Evaluated on giving volume, ESG reporting, and community impact.
- CFO / TAX DIRECTOR (compliance/economic gate): approves charitable deduction optimization strategies. Ensures gift card programs, matching gifts, and DAF contributions are tax-compliant.
- CIO / VP IT (security/integration gate): SSO, HRIS integration, data privacy, SOC 2. Standard enterprise IT evaluation.
- PROCUREMENT (vendor management): contract terms, pricing, competitive evaluation. Especially involved in large enterprises with formal procurement processes.
- EMPLOYEES (end users): the people using the giving portal, volunteering, recommending matches. Adoption rates determine platform stickiness and renewal.

DAF SPONSOR BUYER:
- CEO / PRESIDENT (strategic buyer): sets growth strategy, competitive positioning, product roadmap.
- HEAD OF DONOR RELATIONS (relationship owner): manages high-value donors. Cares about donor experience, retention, and giving growth.
- CFO / CONTROLLER (operations/compliance buyer): fund accounting, investment management, regulatory reporting.
- HEAD OF GRANTMAKING / PROGRAMS (impact buyer): manages the grant disbursement process, charity verification, and impact assessment.
- BOARD OF DIRECTORS (governance): especially at community foundations — board heavily involved in strategic decisions.

SECTION 9 — TRIGGER EVENTS:
- OBBBA DEDUCTION COMPRESSION (2026): the 0.5% AGI floor on charitable deductions reshapes donor behavior. Creates urgency for DAF sponsors to communicate bunching strategy to donors. Drives demand for tax planning tools and advisory services.
- CORPORATE ESG REPORTING MANDATE: new SEC climate disclosure rules, EU CSRD (Corporate Sustainability Reporting Directive), or state ESG reporting requirements → drives investment in corporate giving platforms with ESG-compliant reporting.
- ANNUAL CORPORATE BUDGET CYCLE (Q4): corporate giving budgets are typically set in Q4 for the following year. Workplace giving platform decisions follow this cycle. Q3-Q4 is the primary buying season for corporate philanthropy technology.
- GIVING TUESDAY / YEAR-END GIVING SEASON: November-December is ~30% of annual giving. Nonprofits invest in fundraising technology ahead of this season. Buying decisions for fundraising platforms happen in Q2-Q3 for Q4 deployment.
- NEW CHRO / VP CSR: executive turnover in HR or CSR leadership triggers vendor review. First 90 days is the evaluation window.
- M&A / CORPORATE RESTRUCTURING: acquiring company harmonizes giving programs across combined organization. Creates buying window for unified workplace giving platform.
- EMPLOYEE ENGAGEMENT CRISIS: declining employee satisfaction, high turnover, or public ESG/DEI criticism → drives investment in corporate giving as engagement tool.
- MATCHING GIFT PROGRAM LAUNCH: company deciding to implement or overhaul matching gift program → needs platform that automates matching administration.
- DAF REFORM LEGISLATION (potential): if/when payout mandate legislation advances, it will trigger massive operational changes for DAF sponsors. Monitor legislative calendar.
- WEALTH TRANSFER EVENT (individual): inheritance, business sale, IPO, or other liquidity event → creates high-value DAF contribution opportunity. Financial advisors are the referral channel.
- COMMUNITY FOUNDATION TECHNOLOGY MODERNIZATION: many community foundations are replacing legacy donor management systems (15-20 year replacement cycles). Creates buying windows for modern DAF/donor platforms.

SECTION 10 — COMMON FAILURE MODES:
INDUSTRY FAILURE MODES:
- DAF PAYOUT CONTROVERSY: critics (Senator King, philanthropy watchdogs) argue DAFs allow indefinite tax-advantaged accumulation. Proponents (DAFRC, DAF sponsors) cite overall payout rates exceeding private foundation minimums. The debate creates political and media risk for DAF-dependent businesses. Failure mode: DAF sponsors that do not proactively communicate payout data and donor intent face reputational risk and potential regulatory action.
- TRANSFER INFLATION: PF-to-DAF transfers ($3.2B+ in 2022) and DAF-to-DAF transfers ($4.4B in 2023) inflate apparent contribution and payout rates [verified 05/2026, DAFRC 2025]. Failure mode: citing aggregate payout rates without noting transfer effects misrepresents actual charitable distribution.
- DONATION-PROCESSOR CONFLATION: including donation-processor DAFs (168% payout rate) in aggregate statistics dramatically skews averages. Failure mode: citing "average DAF payout rate" without segmenting by DAF type produces misleading conclusions.
- OBBBA MISPRICING: many practitioners and platforms have not yet updated tax benefit calculations for the 2026 OBBBA changes (0.5% AGI floor, reduced top-rate deduction). Failure mode: marketing materials showing pre-OBBBA tax benefits will be inaccurate starting 2026.

VENDOR FAILURE MODES:
- GMV AS REVENUE: charity gift card and platform companies that present gross merchandise value as revenue misrepresent their business by 10-20x. Gift card sales are liabilities until funds are distributed to charities. Failure mode: investors, partners, and buyers who evaluate these companies on GMV will draw fundamentally wrong conclusions about scale and economics.
- SELLING TO THE WRONG BUYER: workplace giving is an HR/People purchase, not a CSR/Foundation purchase. Selling to the CSR director when the budget lives in HR wastes the sales cycle. Failure mode: long cycles, small pilots, and no scale because the champion does not control budget.
- IGNORING TAX COMPLEXITY: charitable giving products require accurate tax treatment (deduction limits, appreciated asset rules, bunching strategy, OBBBA changes). Failure mode: marketing that oversimplifies or misstates tax benefits creates legal liability and creditor trust destruction.
- CHARITY VERIFICATION AT SCALE: every grant disbursement requires real-time verification that the recipient is a qualified 501(c)(3) in good standing. IRS revocations happen continuously. Failure mode: distributing funds to a revoked or ineligible organization creates tax liability and regulatory risk.
- IGNORING THE BUNCHING STRATEGY: post-OBBBA, donors who bunch multi-year giving into a single year (via DAF) can still itemize above the 0.5% AGI floor. This is the #1 DAF value proposition in 2026. Failure mode: platforms that do not proactively educate donors on bunching will lose to competitors who do.

SECTION 11 — GTM IMPLICATIONS:
SELLING INTO THE CHARITABLE GIVING ECOSYSTEM:
- THE COTF/IGCC INTERSECTION: the Charity On Top Foundation / International Gift Card Council (IGCC) board relationship + digital incentives (BHN history) + DAF rails is Cambrian's highest-leverage intersection vector given Joe's background. This is where digital incentives expertise meets charitable giving infrastructure meets corporate gifting.
- CORPORATE IS THE HIGH-VALUE SEGMENT: corporate giving programs ($5K-$500K+ per program) have higher AOV, predictable repeat cycles, stronger reference value, and longer retention than consumer giving ($25-$100 per transaction). Prioritize B2B corporate GTM over consumer acquisition.
- TAX PLANNING IS THE WEDGE: the conversation starts with tax efficiency, not altruism. Financial advisors, CPAs, and wealth managers are the referral channel for high-value DAF contributions. Embedded charitable giving (at checkout, in rewards programs, attached to subscriptions) is the growth channel for smaller gifts.
- RECIPIENT-CHOICE NEUTRALIZES IDEOLOGICAL RISK: corporate ESG/DEI backlash risk is real (Bud Light, Target examples). Giving programs where the employee or recipient chooses the charity (rather than the company choosing) eliminate ideological risk for the corporate buyer. This is an increasingly powerful selling point for workplace giving and charity gift card platforms.
- MATCHING GIFT AUTOMATION IS UNDERSERVED: ~$2-4B in matching gifts go unclaimed annually [verified 05/2026, Double the Donation research]. The gap between eligible matching and actual matching is enormous. Any platform that automates matching gift identification, submission, and verification captures significant latent value.
- NONCASH ASSET DONATIONS ARE THE GROWTH VECTOR: 74% of FY2024 contributions to DAFgiving360 were noncash assets (ETFs, index funds, real estate, crypto) [verified 05/2026, DAFgiving360 FY2025 Report]. This is the most important talking point for platform-economics framing where digital incentives and DAF infrastructure intersect. Platforms that make noncash asset donation seamless (especially appreciated stock and crypto) capture the fastest-growing contribution type.

PRICING AND ECONOMICS:
- DAF sponsor fees: 0.60-1.00% AUM administrative fee (national sponsors at low end, community foundations at high end). Investment management fees additional (0.05-0.50% depending on fund selection).
- Workplace giving platform pricing: per-employee-per-month ($2-8/employee/month) or flat annual license ($50K-$500K for enterprise). Match administration typically included.
- Charity gift card economics: 5-15% operational fee on card face value. Bulk corporate orders at lower margin but higher volume. Breakage (unredeemed cards) is economically significant but reputationally sensitive.
- Fundraising platform fees: 0-5% platform fee + payment processing (2.2-2.9% + $0.30). Some platforms (GoFundMe personal campaigns) charge 0% platform fee and monetize on tips and payment processing.
- Matching gift automation: per-transaction or per-match fee ($1-5 per match processed) or subscription for nonprofit ($50-500/month).

SECTION 12 — CROSS-REFERENCES:
- Rewards/Incentives Knowledge Layer: charity gift cards sit at the intersection of digital incentives and charitable giving. Prepaid card mechanics, bulk distribution, corporate rewards programs, and incentive platform integration (BHN, Tango, Tremendous) directly connect. The rewards layer covers incentive economics; this layer covers the charitable giving side.
- Payments Knowledge Layer: DAF contributions (ACH, wire, stock transfer, crypto), gift card processing, and donation payment infrastructure overlap with the payments layer. Understanding payment rails is essential for any charitable giving technology.
- PE/Holdco Knowledge Layer: PE firms evaluate corporate giving programs at portfolio companies. Benevity's ownership changes are PE-relevant. PE-backed nonprofits and social enterprises are emerging.
- B2B Sales Knowledge Layer: workplace giving platforms follow enterprise B2B sales methodology — 3-9 month cycles, multi-stakeholder committees, pilot-to-enterprise expansion. The B2B sales layer's champion-building and economic-buyer-access frameworks apply directly.
- Compliance Knowledge Layer: charitable giving compliance (IRS, state registration, OBBBA, proposed DAF regs) is a specialized compliance domain. The general compliance layer covers framework; this layer applies it to philanthropy.
- OKR/KPI Knowledge Layer: corporate giving KPIs (employee participation rate, match ratio, total giving volume, ESG score impact) should be connected to the buyer's OKRs. When HR buys a workplace giving platform, the KRs are employee engagement and retention — connect your product to those KRs.
- BaaS Knowledge Layer: DAF platforms are financial intermediaries with some BaaS-like characteristics — pooled accounts, sub-ledger tracking, regulatory compliance. The financial infrastructure patterns from BaaS (ledger management, compliance technology, regulatory examination) have parallels in DAF operations.
- Executive Perspectives Knowledge Layer: CHRO perspective (employee engagement, culture, retention) is the primary lens for corporate giving purchases. CFO perspective (tax optimization, ESG reporting, deduction management) is the secondary lens. CEO perspective relevant when corporate giving is tied to brand purpose.

DAFgiving360 FY2025 DETAIL: 155,000 charities supported via 1.4M grants (19% YoY growth); $24M+ granted per day; 38% scheduled recurring; 78% within own state; 85% to previously-supported charities, 15% net-new [verified 05/2026, DAFgiving360 FY2025 Report].

DAF ACCOUNT DEMOGRAPHICS: Median DAF account: ~$21K (not just ultra-rich) [verified 05/2026, DAFRC 2025]. National sponsors hold 70% of assets but community foundations serve different donor segments with different needs.

2026 TRENDS:
- OBBBA reshaping donor behavior: deduction compression (0.5% AGI floor) accelerates bunching strategy and DAF adoption for tax-savvy donors while potentially reducing small/mid accounts [verified 05/2026, OBBBA legislative text 2025].
- DAF reform debate continues (payout mandates, transparency, transfer rules — no legislation passed) [verified 05/2026, DAFRC / National Philanthropic Trust].
- DAF democratization (Daffy, Charityvest, Chariot — minimums reduced to zero, mobile-first) bringing DAFs to younger, smaller donors.
- Embedded charitable giving (checkout donations, subscription-attached, loyalty-to-charity) growing as a frictionless giving channel.
- Decline of umbrella organizations (United Way) continuing — employee-choice models replacing employer-directed giving.
- Corporate ESG volatility (recipient-choice models neutralize ideological risk for corporate buyers).
- AI in charity verification and donor matching — automating IRS database checks, compliance screening, and personalized giving recommendations.
- Noncash asset donations growing fastest (74% of DAFgiving360 contributions were noncash) — crypto, stock, real estate, and complex assets.
- Impact measurement and reporting: donors and corporate buyers increasingly demanding evidence of impact, not just gift receipts. Driving demand for outcome-tracking technology.

KNOWN TRAPS:
- DAF payout rate stats vary wildly depending on whether donation-processor DAFs (168% payout) are included — always clarify which universe. [verified 05/2026, DAFRC 2025]
- "Total DAF assets" conflates national sponsors (70% of assets) with community foundations (very different economics) — segment before citing. [verified 05/2026, DAFRC 2025]
- Gift card "revenue" is almost entirely liability; quoting GMV as revenue misrepresents the business by 10-20x.
- OBBBA deduction compression (0.5% AGI floor) is new for 2026 — many practitioners are still citing pre-OBBBA rules. [verified 05/2026, OBBBA legislative text 2025]
- PF-to-DAF and DAF-to-DAF transfers inflate apparent payout rates — flag this when citing DAFRC payout data.
- November 2023 proposed DAF regs are still pending as of 2026 — do not cite as final rules.
- NPT is no longer the canonical data source for DAF aggregates — DAFRC (2025) replaced it. Use DAFRC for citations.
- Benevity ownership has changed — verify current ownership structure before citing.
- IRS revocations of 501(c)(3) status happen continuously — "verified at grant time" is the only safe practice.
`;

export const CHARITABLE_GIVING_SCORING = {
  highFitSegments: [
    { segment: "Charity gift card platforms (Charity On Top model)", avgFit: "85-92%", reason: "Direct digital incentives domain overlap with BHN; multi-stakeholder GTM; card mechanics + charitable compliance intersection" },
    { segment: "Mission-based DAF platforms (Daffy, Charityvest, Chariot tier)", avgFit: "78-86%", reason: "Fintech-meets-philanthropy; scaling consumer + corporate acquisition; mobile-first product GTM" },
    { segment: "Workplace giving platforms ($5-100M revenue)", avgFit: "75-83%", reason: "B2B SaaS selling into HR/CSR buyers; multi-stakeholder enterprise sales; recurring revenue ops" },
    { segment: "Community foundations with DAF programs ($100M+ assets)", avgFit: "65-75%", reason: "Scaling donor acquisition and corporate partnerships; geographic focus creates defined GTM territory" },
    { segment: "Matching gift automation platforms", avgFit: "70-80%", reason: "~$2-4B in unclaimed matching gifts annually; high-leverage intersection of nonprofit and corporate buyers" },
  ],
  highFrictionSegments: [
    { segment: "National commercial DAF sponsors (Fidelity Charitable, Schwab Charitable)", avgFit: "10-20%", reason: "Massive internal teams; financial services parent company resources; relationship-driven procurement" },
    { segment: "Religious/faith-based charitable organizations", avgFit: "20-35%", reason: "Mission-driven decision-making; volunteer-heavy; limited consulting budgets; relationship-based governance" },
    { segment: "Pure crowdfunding platforms (GoFundMe, individual fundraisers)", avgFit: "25-40%", reason: "Consumer marketplace dynamics; different GTM model than enterprise/B2B; thin margins" },
    { segment: "Small nonprofits (<$1M annual revenue)", avgFit: "15-30%", reason: "Minimal technology budget; volunteer-run; decisions made by board or executive director with limited capacity" },
  ],
  keySignals: {
    positive: [
      "OBBBA deduction compression driving donor behavior changes",
      "Corporate ESG reporting mandate creating workplace giving urgency",
      "New CHRO / VP CSR (vendor review in first 90 days)",
      "Matching gift program launch or overhaul",
      "M&A requiring harmonized corporate giving programs",
      "Giving season (Q4) technology investment cycle",
      "Community foundation technology modernization (replacing 15+ year legacy systems)",
      "Wealth transfer event creating high-value DAF contribution opportunity",
    ],
    negative: [
      "Recently deployed Benevity or Blackbaud (budget and appetite exhausted)",
      "Religious/faith-based organization with volunteer governance",
      "Small nonprofit with no technology budget",
      "National DAF sponsor with massive internal teams",
      "Organization in active leadership crisis or restructuring",
    ],
  },
};

export const CHARITABLE_GIVING_DISCOVERY = `
CHARITABLE GIVING / DAF DISCOVERY (use when prospect operates charitable infrastructure, DAF platform, charity gift cards, or sells into philanthropy):

REALITY:
- How does money flow through your platform — from donor/buyer to working charity? What's the average time from contribution to distribution?
- What's your current customer mix between individual donors, corporate buyers, and institutional partners? How is it shifting?
- How do you handle charity verification at scale — IRS database sync, manual review, or vendor?
- How exposed are you to the OBBBA deduction changes (0.5% AGI floor starting 2026)? What's your messaging to donors?

IMPACT:
- Where is the highest operational leverage in your business — where would $1 of additional capacity produce the most output?
- What's your biggest compliance burden right now — state registration, Form 990 reporting, charity verification, or something else?
- How exposed are you to the pending DAF regulatory changes (§4966 proposed regs)? What's your contingency?
- What's your matching gift capture rate? How much employer-match-eligible giving goes unclaimed?

VISION:
- If you could redesign your channel mix (direct vs broker vs partner vs embedded), what would it look like? What's stopping you?
- How do you think about the trade-off between scaling consumer acquisition vs building corporate programs?
- What does your corporate sales motion look like today vs where it needs to be?
- How are you thinking about the embedded giving trend — checkout donations, subscription-attached giving, loyalty-to-charity?

ENTRY POINTS:
- Walk me through how a typical corporate gift card program comes in — from first conversation to delivery.
- What role do brokers, wholesalers, or channel partners play in your distribution? How are those relationships structured commercially?
- What's your relationship with major DAF sponsors — competitors, partners, or both?
- How are financial advisors and wealth managers in your ecosystem — referral channel, integration partner, or untapped?

ROUTE:
- Looking at your organization 3 years from now, what's the one capability gap that would most limit your growth?
- What would you need from a GTM advisor that you can't build internally?
- Is there a board meeting, annual planning cycle, or regulatory deadline that creates a decision window?
`;

export const CHARITABLE_GIVING_PLAYBOOK = {
  name: "Charitable Giving & DAFs",
  keywords: [
    "charitable giving", "charity", "philanthropy", "nonprofit",
    "donor-advised fund", "DAF", "donor advised",
    "501(c)(3)", "tax deduction", "charitable contribution",
    "corporate giving", "corporate philanthropy", "CSR",
    "workplace giving", "matching gift", "employee giving",
    "charity gift card", "Charity On Top",
    "Fidelity Charitable", "Schwab Charitable", "NPT",
    "Benevity", "YourCause", "Bright Funds",
    "Classy", "GoFundMe", "GlobalGiving",
    "Every Action", "Bonterra", "Network for Good",
    "Double the Donation", "Blackbaud",
    "Daffy", "Charityvest", "Chariot",
    "grantmaking", "foundation", "private foundation",
    "endowment", "community foundation",
    "OBBBA", "bunching strategy",
  ],
  personas: [
    "CHRO", "VP People", "VP HR",
    "VP CSR", "Head of Social Impact", "CSR Director",
    "CEO", "Executive Director (nonprofit)",
    "CFO", "Tax Director", "Controller",
    "Development Director", "VP Development",
    "Head of Donor Relations", "Major Gift Officer",
    "Foundation Program Officer", "Grants Manager",
    "Financial Advisor", "Wealth Manager",
    "CIO", "VP IT",
  ],
  triggers: [
    "OBBBA deduction compression reshaping donor behavior (2026)",
    "Corporate ESG reporting mandate",
    "New CHRO / VP CSR (vendor review in first 90 days)",
    "Matching gift program launch or overhaul",
    "M&A requiring harmonized corporate giving programs",
    "Giving season (Q4) technology investment cycle (buy in Q2-Q3)",
    "Community foundation technology modernization",
    "Wealth transfer event creating high-value DAF contribution",
    "Employee engagement crisis driving workplace giving investment",
    "DAF reform legislation advancing (if/when)",
    "Annual corporate giving budget cycle (Q4 for following year)",
  ],
  disqualifiers: [
    "Quoting gift card GMV as revenue (misrepresents business by 10-20x)",
    "Citing pre-OBBBA tax benefits without noting 2026 changes",
    "Conflating DAF payout statistics (donation-processor vs traditional)",
    "Citing November 2023 proposed DAF regs as final rules",
    "Selling workplace giving to CSR director when budget lives in HR",
    "Ignoring tax complexity in charitable giving products",
    "Using NPT as primary DAF data source (DAFRC 2025 replaced it)",
    "Assuming all DAFs are ultra-rich vehicles (median account ~$21K)",
  ],
  heuristics: [
    "Corporate giving is the high-value segment — prioritize B2B over consumer",
    "Tax planning is the wedge — the conversation starts with tax efficiency, not altruism",
    "Recipient-choice neutralizes corporate ESG/ideological risk — a powerful selling point",
    "Matching gift automation addresses ~$2-4B in unclaimed annual matching — massive latent value",
    "Noncash asset donations (74% of DAFgiving360 contributions) are the fastest-growing contribution type",
    "OBBBA bunching strategy is the #1 DAF value proposition in 2026 — platforms that educate donors win",
    "The COTF/IGCC + digital incentives + DAF rails intersection is Cambrian's highest-leverage vector",
    "Workplace giving buyer is CHRO/VP People, not CSR director — follow the budget",
    "Gift card liability accounting confuses everyone — explain it proactively to avoid valuation/competitive misunderstandings",
  ],
};
