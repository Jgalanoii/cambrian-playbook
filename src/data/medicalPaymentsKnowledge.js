// src/data/medicalPaymentsKnowledge.js
//
// Medical & Healthcare Payments knowledge layer.
// Covers: CMS MA supplemental benefits, SSBCI, flex cards, filtered-spend
// Visa/MC prepaid, SNAP/EBT, GusNIP nutrition incentives, food-as-medicine
// via Medicaid 1115 waivers, benefit utilization, health plan stack,
// PBMs, TPAs, and the intersection of payments + healthcare + incentives.
//
// This layer sits at the junction of three Cambrian competence areas:
// payments mechanics (BHN/Tango heritage), digital incentives, and
// healthcare GTM. The filtered-spend prepaid card is the rail that
// connects them — architecturally the same pattern Joe operated at BHN.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const MEDICAL_PAYMENTS_INJECTION = `
MEDICAL & HEALTHCARE PAYMENTS CONTEXT (use when target or seller is at the intersection of payments, healthcare benefits, supplemental benefits, flex cards, SNAP/EBT, food-as-medicine, or health plan administration):

THE CONNECTING RAIL: The filtered-spend Visa/Mastercard prepaid card is the dominant mechanism through which MA supplemental benefits, Medicaid HRSN services, employer FSA/HSA dollars, and food-as-medicine programs flow to consumers. MCC restrictions, real-time basket-level validation, and UPC-level filtering enforce benefit rules at point of sale. BHN's Hawk Marketplace, Tango Card's reward-redemption rails, and the broader prepaid network are direct architectural cousins of this stack.

CMS REGULATORY FRAMEWORK:
- Medicare Advantage plans receive federal rebate dollars for supplemental benefits — ~$337B over last 10 years, $67B in 2024 alone (MedPAC June 2025). Over 99% of MA plans offer at least one supplemental benefit; median 23 per plan.
- Two authorities: (1) Primarily Health Related Supplemental Benefits (broadened 2018/2019) and (2) SSBCI (Special Supplemental Benefits for the Chronically Ill, authorized by Bipartisan Budget Act 2018) — requires "reasonable expectation of improving health or overall function."
- CMS-4205-F (CY2025 Final Rule): mandated real-time POS verification for debit cards administering supplemental benefits — electronically link cards to plan-covered items through real-time point-of-sale verification. This is what drives all current investment in basket-level adjudication tech.
- CY2027 Final Rule (April 2, 2026): rolled back consumer protections (rescinded mid-year unused benefits notification, did NOT ban flex card marketing) but RETAINED technology mandates (real-time POS verification, SSBCI evidence standards). Regulatory direction: loosening on consumer protections, retaining infrastructure mandates — operator-favorable for vendor ecosystem.
- VBID model terminated end of 2025 — plans that built food-as-medicine through VBID must reconfigure under SSBCI or other authority.
- CMS canonical framing: "A plan debit card is not a covered benefit but rather, a mechanism by which an MA plan may provide payment for covered benefits" — positions card as claims-payment mechanism, not independent benefit.

FILTERED-SPEND TECHNOLOGY (three architectures):
1. MCC-Level Filtering (loosest): restricts to approved merchant categories. Cheapest but allows any spend at in-MCC merchants.
2. IIAS/SIGIS Lists (mid-resolution): industry-standard FSA/HSA-eligible products at SKU level. Legacy architecture; doesn't handle per-plan MA benefit variation.
3. Real-Time Basket-Level Adjudication (highest resolution): UPC/department-level filtering dynamically authorizing per basket. NationsBenefits Basket Analyzer Service (BAS), Solutran S3 platform (55,000+ stores), Soda Health Smart Benefits — this is now the technology floor.

CROSS-AGENCY BENEFIT PROTECTION (2024-2025):
- USDA/FNS (Dec 2024): MA supplemental benefits excluded from SNAP income determination.
- CMS (Jan 2025): flex cards are not cash benefits.
- HUD (Jan/Mar 2025): flex card amounts count for rental assistance only when actually used for rent/utilities.
- Operator implication: cross-agency coordination supports broader flex-card adoption for dual-eligible (D-SNP) populations without disqualifying members from SNAP or Section 8. 91% of D-SNP plans offered a flex card in 2025 — highest-penetration segment.

UTILIZATION TRENDS:
- 79% of MA enrollees in plans offering OTC benefits in 2025, down from 88% in 2024 — first material decline in years. Plan cost pressures from 2024 Star Ratings adjustments.
- MedPAC has flagged for three consecutive years that policymakers lack good information about whether supplemental benefits provide value.
- Science (2025): "Medicare Advantage Beneficiaries Show No Increase in Dental, Vision, or Hearing Care Access" — most-cited counterevidence on supplemental benefits translating to actual care.

SNAP/EBT & NUTRITION INCENTIVES:
- SNAP: ~41M Americans, USDA/FNS administered, state-operated EBT cards. Eligible: staple groceries. Excluded: prepared hot foods, alcohol, tobacco, supplements.
- EBT online purchasing operational in all 50 states as of 2025.
- GusNIP (Gus Schumacher Nutrition Incentive Program, 2018 Farm Bill): federal grants for fruit/vegetable purchase subsidies for SNAP participants — typically 1:1 dollar match at farmers markets and grocery stores. Peer-reviewed evidence: increases F&V purchasing and consumption, reduces diet-related chronic disease, improves food security.
- State programs: Massachusetts HIP (dollar-for-dollar match), California F&V EBT Pilot, Oklahoma Food is Medicine Act (SB 806, signed 2025).
- EBT processors: Conduent, FIS, Solutran/WEX ($340M acquisition 2022).

FOOD AS MEDICINE — MEDICAID 1115 WAIVERS:
- CMS approved 10 state waivers expanding Food as Medicine by Nov 2024; 19 approved or pending addressing nutrition overall (Hanson et al. 2024, Health Affairs Scholar). 11 submitted/approved since 2021.
- FIM service categories: medically tailored meals (9 of 10 waivers), medically supportive groceries (8), produce prescriptions (7), medically supportive meals (7), medically tailored groceries (6).
- CRITICAL 2025 REVERSAL: CMS rescinded guidance on Health-Related Social Needs (March 2025) and is reviewing 1115 waivers. Six of eight states named in review currently implement FIM programs. Federal matching-fund risk has materially increased. State-level activity (Oklahoma SB 806, Massachusetts expansion) partially offsets.
- Reimbursement: capitated MA plans (SSBCI route, plan absorbs cost), Medicaid MCO (PMPM or per-episode), direct grants (GusNIP, philanthropy).

OUTCOMES-LINKED CARD DESIGN (three architectures):
1. Care-Gap Closure: card reload contingent on preventive screening, wellness visit, medication adherence — improves Star Ratings while driving engagement.
2. SDOH-Aligned Spend Steering: filtering pre-restricted to clinical condition (diabetes-aligned grocery, heart-healthy for CHF, renal-diet for ESRD).
3. Behavioral Reinforcement Loops: real-time push notifications at point of purchase — same mechanism as Tango Card reward redemption. Immediate gratification at redemption moment is the activation event, not enrollment.
- Strong evidence: nutrition incentives increase F&V purchasing; produce prescriptions improve diet quality; medically tailored meals reduce readmissions (CHF, T2 diabetes).
- Weak evidence: long-run outcomes from MA SSBCI filtered-spend cards underdocumented; data lags and plans rarely publish granular outcome data.

VENDOR MAP:
Tier 1 (direct MA plan contracts at scale): NationsBenefits (Glenn Parker MD; Basket Analyzer Service; Wakefern/Food City/Giant Eagle/Kinney integrations; General Atlantic majority owner since 2022), Solutran (Optum/UHG; Healthy Benefits+ platform; S3 platform; 55,000+ stores; 10 of top 14 healthcare providers), InComm Healthcare (broad prepaid/benefit card), Soda Health (Smart Benefits cards; item-level filtering; MA OTC, FIM, Medicaid 1115).
Tier 2: WEX, HealthEquity (largest standalone HSA custodian), Inspira Financial, Optum Financial, Lively, Fidelity HSA, Ameriflex.
Card-issuing: Bancorp Bank (dominant MA flex card issuer), Pathward (broader prepaid), Stride Bank (fintech programs).
Networks: Mastercard stronger in MA flex card subsegment; Visa stronger in employer-funded restricted-merchant benefit cards.

HEALTH PLAN & BENEFIT ADMINISTRATION STACK:
- MA carriers: UnitedHealthcare (~30% MA enrollment; Optum handles supplemental benefits admin), Humana (heavily MA/D-SNP), Aetna/CVS (retail-pharmacy integration), Anthem/Elevance (uses NationsBenefits for OTC), Centene (Medicaid/D-SNP focused), Kaiser (integrated; less reliant on third-party vendors), Cigna (growing MA).
- PBMs: CVS Caremark, Express Scripts (Cigna), OptumRx (UHG) — ~80% of U.S. Rx claim processing. PBM transparency legislation actively debated 2024-2026.
- TPAs: WEX (largest white-label TPA infra), Discovery Benefits, Ameriflex, Inspira, Lively, Bend Financial. Economics: PEPM admin fees + per-transaction fees + interchange + HSA interest income.
- Benefits admin platforms: Workday, ADP, Rippling, Gusto, Paycom, Paylocity (employer HRIS); Empyrean, Businessolver, Benefitfocus/Voya, bswift/Aon (large-employer enrollment).

MACRO TRENDS:
- CMS loosening consumer protections while retaining technology infrastructure mandates
- Cross-agency coordination (USDA/HUD/CMS) supports flex-card adoption for dual eligibles
- Federal Medicaid 1115 posture reversed — FIM waivers under heightened scrutiny
- OTC benefit penetration declined (88% → 79%) under MA margin pressure
- D-SNP is highest-penetration flex-card segment at 91%
- Real-time basket-level adjudication is now the floor, not differentiator
- Vendor consolidation likely — 4 Tier 1 operators; at least one probable PE acquisition target 2026-2027
- General Atlantic's NationsBenefits position is the most important capital signal in the layer

HSA/FSA ARCHITECTURE (the ancestor of filtered-spend):
Every basket-level adjudication mechanic in MA flex cards traces back to employer-sponsored CDH accounts. Section 213(d) defines eligible "medical care" expenses. Section 223 governs HSAs. Section 125 governs cafeteria plans (FSA umbrella).

2026 limits (IRS Notice 2026-5): HSA self-only $4,400, HSA family $8,750, HSA catch-up (55+) $1,000, FSA $3,400. HDHP minimum deductible $1,650/$3,300; OOP max $8,500/$17,000. OBBBA (2025) expanded HSA eligibility — bronze and catastrophic ACA Exchange plans now HDHP-eligible after Dec 31, 2025; Direct Primary Care fees now 213(d) eligible from HSA.

IIAS (Inventory Information Approval System) is the IRS-sanctioned standard allowing non-healthcare merchants to accept FSA/HRA debit cards. SIGIS (Special Interest Group for IIAS Standards) publishes the Eligible Product List monthly — SKU-level identification of 213(d)-eligible items. The 90% Rule allows pharmacies/medical-supply retailers to accept cards without full IIAS infrastructure. HSA funds are individually owned, portable, roll over indefinitely. FSAs subject to use-it-or-lose-it (carryover up to $680 in 2026 OR grace period up to 2.5 months — not both).

HSA/FSA admin "Big 4-5": HealthEquity (~$30B assets, ~17M accounts, NASDAQ: HQY), Optum Financial (UHG captive), WEX (NYSE: WEX, 350+ payroll/HRIS partners, 225+ insurance carriers), Inspira Financial, Lively. Revenue model: PEPM admin fees ($2-7/EE/month HSA; $4-12 bundled) + interchange (~1-1.5% of card spending) + interest income on cash balances + investment fees (25-50bps AUM).

LIFESTYLE SPENDING ACCOUNTS (LSA) — fastest-growing employer-funded benefit:
Post-tax employer-funded accounts — NOT tax-advantaged. Employer defines eligible expenses, contribution, carry-forward rules. Reimbursement is taxable income to employee. Adoption: 10% of companies offer LSA (doubled since 2024 per Sequoia); 48% of full-time-office employers expect to offer within next year. Tech at 41% adoption; non-tech sectors (59%) now outpacing tech in net new adoption. Common funding: $500-$2,000/EE/year. Categories: physical wellness (gym, fitness), financial wellness (student loans, financial planning), emotional wellness (retreats, meditation). Vendors: WEX (enterprise), Forma (mid-market/tech, $500K+ client savings), Compt (27 categories, benchmark report is most-cited), Holisticly, Fringe, Inspira, Fidelity, Benepass. LSAs are the natural land-and-expand entry for any employer-side benefits admin relationship — low regulatory complexity (post-tax) means fast implementation.

MA STAR RATINGS & QUALITY BONUS PAYMENT DYNAMICS:
Star Ratings drive MA plan economics more than any other single factor. ACA Section 3201 provides 4+ star plans with 5% benchmark bonus (doubled in qualifying counties). More than 58% of MA plans earned less than 4.0 stars for 2024. CMS rates MA-PD contracts on up to 40 measures (HEDIS clinical quality, CAHPS member experience at 4x weight, HOS outcomes, PQA pharmacy measures, CMS admin measures).

THE TUKEY METHODOLOGY SHOCK: Tukey outlier deletion (finalized CY2021, first implemented Oct 2023 for 2024 ratings) removes statistical outliers using IQR, tightening cut points and RAISING the bar for higher ratings. Impact: $600-700M QBP decline (Wakely actuarial), $800M annual revenue impact (McKinsey). CMS lost both SCAN Health Plan v. HHS and Elevance Health v. HHS in 2024 — court required recalculation using actual 2023 cut points. Result: 60+ MA contracts from 40 insurers gained half a star; 13 insurers reached 4-star QBP threshold. Guardrails limit year-over-year cut point movement to 5 percentage points.

2025 Star Ratings: 40% of MA-PDs (209 contracts) earned 4+ stars; 62% of enrollment-weighted 4+ star coverage — a 12-percentage-point single-year decline (largest in program history). 6 of 7 5-star MA-PD contracts include D-SNP plan benefit packages — D-SNP is the highest-performing segment. Non-profits more frequently earn higher ratings than for-profits (persistent multi-year pattern).

Health Equity Index (HEI) replaces Reward Factor starting 2027 Star Ratings — plans serving D-SNP/dual-eligible populations get structural advantage. This is a positive feedback loop for the filtered-spend ecosystem. The supplemental benefits / flex card / engagement infrastructure is DIRECTLY LOAD-BEARING on Star Ratings. Plans driving flex card utilization through care-gap-closure linkage have measurable Star Ratings benefits — the QBP economics make this a $600M-$1B+ annual lever industry-wide.

VENDOR FINANCIAL PROFILES (pre-engagement diligence):
NationsBenefits: founded 2015, Plantation FL, CEO Glenn Parker MD, ~2,500 employees. $328M total raised. General Atlantic (majority position since 2022), BPEA PE, Denali Growth Partners, Monroe Capital, Pritzker Organization. Est. revenue ~$200M, est. valuation ~$640M. 7 acquisitions including CareCar (medical transport, Sept 2025). 11+ major retail integrations 2025-2026 (Walgreens, Dollar General, H Mart, Wakefern banners, Food City, Giant Eagle). Strategic position: clearly positioned for exit or scaling event 2026-2027 — GA hold period approaching 4-5 year mark. Likely strategic buyers: UHG/Optum, Humana, CVS, Elevance — or PE roll-up.

Solutran: founded 1982, Plymouth MN, 172 employees. Acquired by UnitedHealth Group Jan 2021 (now Optum Financial). Revenue/margin not separately disclosed. Healthy Benefits+ (consumer brand), S3 platform (55K+ stores), Healthy Savings (zero cost to plans — brand-funded). Captive; insulated from M&A wave.

Soda Health: founded 2020, San Francisco, 11-50 employees. $94.2M raised across 4 rounds (Lightspeed, Define Ventures, Qiming). $50M Series B Dec 2024. Smart Benefits card with item-level filtering. Most likely candidate for strategic acquisition or Series C in 2026-2027.

InComm Healthcare: subsidiary of InComm Payments (private, Atlanta, founded 1992, CEO Brooks Smith). Parent is one of world's largest prepaid/gift card processors. Healthcare division-specific financials not disclosed. Most likely: continued organic growth within parent structure.

M&A OUTLOOK: NationsBenefits is the most likely 2026-2027 strategic event. Soda Health is the most likely follow-on event 2027-2028. Solutran (UHG captive) and InComm Healthcare (subsidiary) are structurally insulated.

PBM TRANSPARENCY LEGISLATION:
CVS Caremark, Express Scripts (Cigna), OptumRx (UHG) control ~80% of U.S. Rx claims. CVS Caremark alone: 34%. Vertical integration: CVS owns pharmacy + PBM + Aetna; UHG owns OptumRx + UHC + Optum Health; Cigna owns Express Scripts + insurer.

FTC interim reports (July 2024, Jan 2025) documented: Big 3 steer patients to affiliated pharmacies; PBMs negotiate rebate contracts restricting access to lower-cost generics; spread pricing and rebate retention materially increase costs. FTC enforcement complaints filed against major PBMs over insulin rebate practices.

Active federal bills: S.526 Pharmacy Benefit Manager Transparency Act 2025 (Grassley/Cantwell — mandates rebate/fee/spread reporting, safe harbor for 100% pass-through), S.891 Bipartisan Health Care Act (stalled — Scott objected), S.1339 PBM Reform Act (CBO scored: $1.9B revenue increase over 2025-2034). EBSA proposed rule (Jan 30, 2026) "Improving Transparency Into PBM Fee Disclosure" — the most operationally significant 2026 development, applies to self-funded ERISA plans regardless of legislation passage. 564 comments received. All 50 states have enacted some form of PBM regulation; ~20 spread-pricing prohibitions; ~15 rebate-pass-through requirements.

Direction: some federal PBM transparency reform WILL pass — question is timing. Transparency-focused PBMs gaining share (Rightway, Cost Plus Drug Company/Mark Cuban, Capital Rx, Navitus). Captive PBM economics will compress.

INTERNATIONAL PREVENTIVE-CARE INCENTIVE BENCHMARKS:
UK NHS Social Prescribing: GPs refer to Social Prescribing Link Workers who connect patients to community-based support (arts, nature, volunteering, exercise). 20% of GP consultations involve non-clinical needs. Peer-reviewed evidence (4.1M responders, 2018-2023 GPPS): associated with improved outcomes for targeted populations AND overall patient experience. Permanent ARRS funding mechanism (not time-limited like U.S. 1115 waivers).

Singapore HPB Healthy 365: 1M+ app downloads. Healthpoints for steps, meal logging, screenings, challenges. Redeemable for eVouchers, transit credits (SimplyGo), community donations. 80%+ engagement rates in National Steps Challenge. Multi-redemption-rail architecture (3 rails vs U.S. single-rail flex card) drives higher utilization. Fitbit and Apple Watch integration.

Germany Bonusprogramm: Section 65a SGB V. ~95 statutory health insurance funds serving ~73M members. Cash bonuses (EUR 100-200/year), premium reductions, or targeted goods/services for preventive screenings, vaccinations, fitness. Statutory cap on bonus richness prevents race-to-bottom — 20+ year stable framework. Closest U.S. analog is MA SSBCI but with cap U.S. lacks.

Cross-country lessons: (1) Stable funding architecture matters more than reward richness — Germany's lowest individual rewards but highest sustainability. (2) Non-financial mechanisms work — UK SP produces measurable outcomes without direct financial payment. (3) Wearable integration is the engagement multiplier — Singapore's 80%+ rates. (4) Multi-redemption-rail architecture increases stickiness vs single-rail U.S. flex cards.

CAMBRIAN'S EDGE: The filtered-spend supplemental-benefits stack is structurally identical to the BHN/Tango branded-payments-network stack Joe operated. Vertical specifics differ (clinical coverage rules, CMS authority frameworks, dual-agency benefit treatment) but rails, issuing-bank relationships, merchant acceptance economics, and technology architecture are direct cousins. The COTF/IGCC relationship vector takes sharper shape here — card-issuance, real-time adjudication, and benefit-utilization analytics for MA supplemental benefits are operationally the same patterns COTF and IGCC operators run for charitable giving and corporate incentive programs. Singapore's HPB redemption-rail architecture and Germany's Bonusprogramm operate on the same fundamental pattern as the COTF/IGCC networks. The international references strengthen the cross-vertical knowledge bridge.

HSA/FSA + LSA + flex card vendor consolidation is the macro structural trend: WEX, Inspira, and Optum Financial are simultaneously HSA/FSA admins, LSA admins, AND bidding for filtered-spend administration. Single-card, single-app, single-platform consolidation thesis cuts across all account types. Star Ratings QBP economics ($600M-$1B+ annual lever) create direct ROI path for outcomes-driven supplemental benefits. PBM legislation (EBSA fee-disclosure rule) creates new obligations for TPAs serving self-funded ERISA plans regardless of congressional action.
`;

export const MEDICAL_PAYMENTS_SCORING = {
  highFitSegments: [
    { segment: "Filtered-spend card vendors (NationsBenefits, Soda Health, Solutran competitors)", avgFit: "88-95%", reason: "Direct architectural overlap with BHN rails — MCC filtering, basket adjudication, issuing-bank relationships. GTM complexity (MA plan sales, CMS compliance, retail integration) matches Cambrian" },
    { segment: "MA plan supplemental benefits administrators", avgFit: "80-88%", reason: "Multi-stakeholder GTM (plan sponsors, retail networks, CMS compliance); same filtered-spend technology stack" },
    { segment: "Food-as-medicine operators (Medicaid 1115 / SSBCI delivery)", avgFit: "75-85%", reason: "Federal routing risk (1115 reversal) creates strategic GTM pivot demand; nutrition incentive economics familiar from rewards domain" },
    { segment: "TPA / benefits administration platforms modernizing filtered-spend", avgFit: "72-82%", reason: "WEX white-label backbone; HSA/FSA rail modernization; real-time adjudication infrastructure gap" },
    { segment: "SNAP/EBT nutrition incentive technology (GusNIP grantees, EBT processors)", avgFit: "65-75%", reason: "Federal program tech modernization; EBT-to-digital integration; incentive design expertise from rewards domain" },
    { segment: "LSA-first platforms and multi-account benefits admins", avgFit: "68-78%", reason: "Fastest-growing employer benefit account; low regulatory complexity; land-and-expand into HSA/FSA/flex card adjacency" },
    { segment: "Mid-market TPAs modernizing real-time adjudication (WEX white-label tier)", avgFit: "65-75%", reason: "HSA/FSA/LSA consolidation pressure; single-card platform thesis; EBSA PBM disclosure creating new obligations" },
  ],
  highFrictionSegments: [
    { segment: "National MA carriers (UHG, Humana, CVS/Aetna)", avgFit: "10-20%", reason: "Massive internal teams (Optum handles in-house); procurement fortress; 12-18 month cycles" },
    { segment: "PBMs (CVS Caremark, Express Scripts, OptumRx)", avgFit: "8-15%", reason: "Vertically integrated with carriers; distinct Rx rail from supplemental benefits; regulatory sensitivity" },
    { segment: "Standalone HSA custodians (HealthEquity, Fidelity HSA)", avgFit: "20-30%", reason: "Commodity product; scale-driven; limited consulting leverage; IRS rule-constrained" },
  ],
};

export const MEDICAL_PAYMENTS_DISCOVERY = `
MEDICAL & HEALTHCARE PAYMENTS DISCOVERY (use when prospect operates at the intersection of payments, healthcare benefits, flex cards, or food-as-medicine):

REALITY:
- Walk me through how benefit dollars flow from the plan sponsor through your platform to the point of sale — what are the authorization checkpoints?
- What level of filtering do you operate at today — MCC, IIAS/SIGIS, or real-time basket-level? What's the gap between where you are and the CY2025 POS verification mandate?
- How many MA plan contracts are you operating across, and what's your retail partner footprint by store count?
- What percentage of your business is D-SNP vs standard MA vs Medicaid managed care vs employer-funded benefits?

IMPACT:
- Where is benefit utilization lowest in your book — which benefit categories and which enrollee segments? What are you doing about it now that the mid-year notification requirement was rescinded?
- How exposed are you to the federal Medicaid 1115 posture reversal? What percentage of revenue depends on federal matching funds for food-as-medicine programs?
- What's your competitive moat — retail exclusivity, basket adjudication technology, outcomes analytics, or plan-sponsor relationships?
- How does your unit economics work — per-member-per-month, per-transaction, interchange, or hybrid? What's the margin structure?

VISION:
- How are you thinking about the vendor consolidation thesis? Are you a consolidator or a target?
- What does outcomes-linked card design look like in your product roadmap — care-gap closure triggers, SDOH-aligned filtering, behavioral reinforcement?
- How are you positioning for the CY2028 rulemaking cycle — what do you expect CMS to tighten or loosen?

ENTRY POINTS:
- Who is the buyer on the plan-sponsor side — Chief Medical Officer, VP of Medicare, Head of Supplemental Benefits, or procurement?
- How does the retail integration process work — who negotiates merchant acceptance, and what's the timeline from agreement to live POS authorization?
- What role does the card-issuing bank relationship play in your business — are you locked into one issuer or multi-bank?

ROUTE:
- If you could solve one thing in your GTM this year — plan acquisition velocity, retail network expansion, outcomes measurement, or regulatory positioning — what would it be?
- How are you thinking about the SNAP/EBT nutrition incentive adjacency — is that a growth vector or a distraction from core MA business?
- What would a GTM advisor need to understand about CMS regulatory dynamics that isn't obvious from the outside?

HSA/FSA/LSA-SPECIFIC (when prospect is in benefits administration):
- How many account types do you administer today — HSA, FSA, HRA, LSA, COBRA? What's the single-card/single-app integration story?
- What's your IIAS/SIGIS implementation maturity — full basket-level or MCC-only?
- How are you positioning for the OBBBA HSA eligibility expansion — bronze/catastrophic ACA plans now HDHP-eligible?
- Are you seeing LSA adoption accelerate? What's the employer pull-through from LSA into your HSA/FSA book?
- What's your revenue mix — PEPM admin fees vs interchange vs interest income vs investment fees?

STAR RATINGS-SPECIFIC (when prospect is plan-side or vendor selling to plans):
- How did the Tukey methodology change hit your plan clients' Star Ratings? How many crossed below the 4-star QBP threshold?
- How are you linking supplemental benefit utilization to care-gap closure for Star Ratings improvement?
- What's your D-SNP plan client concentration? Are you modeling the Health Equity Index advantage for 2027 ratings?

PBM-ADJACENT (when prospect touches pharmacy or employer benefits):
- How exposed are you to the EBSA PBM fee-disclosure rule for self-funded ERISA plans? What's your disclosure infrastructure readiness?
- Are you seeing employer demand shift toward transparency-focused PBM alternatives?
`;
