// src/data/medicalPaymentsKnowledge.js
//
// Version: 1.1.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// Medical & Healthcare Payments knowledge layer.
// Covers: RCM (revenue cycle management), patient billing, health plan
// payments, provider compensation, CMS MA supplemental benefits, SSBCI,
// flex cards, filtered-spend Visa/MC prepaid, SNAP/EBT, GusNIP nutrition
// incentives, food-as-medicine via Medicaid 1115 waivers, benefit
// utilization, health plan stack, PBMs, TPAs, HSA/FSA/LSA, and the
// intersection of payments + healthcare + incentives.
//
// This layer sits at the junction of three Cambrian competence areas:
// payments mechanics (BHN/Tango heritage), digital incentives, and
// healthcare GTM. The filtered-spend prepaid card is the rail that
// connects them — architecturally the same pattern Joe operated at BHN.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   MedPAC: https://www.medpac.gov/document/june-2025-report-to-the-congress/
//   CMS Final Rules: https://www.cms.gov/medicare/regulations-guidance/final-rules
//   CMS Star Ratings: https://www.cms.gov/medicare/quality/star-ratings
//   USDA/FNS SNAP: https://www.fns.usda.gov/snap/
//   USDA GusNIP: https://www.nifa.usda.gov/grants/programs/hunger-food-security-programs/gus-schumacher-nutrition-incentive-program
//   IRS Notices (HSA/FSA limits): https://www.irs.gov/newsroom
//   FTC PBM Reports: https://www.ftc.gov/reports/pharmacy-benefit-managers
//   Health Affairs Scholar (Hanson et al. 2024): https://academic.oup.com/healthaffairsscholar/
//   Science (2025 MA dental/vision/hearing): https://www.science.org/
//   KFF Medicare Advantage: https://www.kff.org/medicare/
//   ATI Advisory (D-SNP flex card): https://atiadvisory.com/
//   Sequoia Consulting (LSA benchmarks): https://www.sequoia.com/
//   Compt (LSA benchmark report): https://www.compt.io/
//   Wakely Actuarial (Star Ratings): https://www.wakely.com/
//   McKinsey (MA Star Ratings): https://www.mckinsey.com/industries/healthcare/
//   CBO (PBM Reform Act score): https://www.cbo.gov/
//   Crunchbase (vendor financials): https://www.crunchbase.com/
//   PitchBook (vendor financials): https://pitchbook.com/
//   NHS England (Social Prescribing): https://www.england.nhs.uk/personalisedcare/social-prescribing/
//   Singapore HPB: https://www.healthhub.sg/programmes/healthy-365
//   German SGB V / GKV-Spitzenverband: https://www.gkv-spitzenverband.de/
//   WEX Inc Investor Relations: https://www.wexinc.com/investors/
//   HealthEquity Investor Relations: https://ir.healthequity.com/
//   NASHP (state PBM legislation tracker): https://nashp.org/rx/
//   Federal Register (EBSA PBM rule): https://www.federalregister.gov/
//   Becker's Hospital Review: https://www.beckershospitalreview.com/
//   HFMA (Healthcare Financial Management Association): https://www.hfma.org/
//   Grand View Research, US RCM Market (2025): grandviewresearch.com
//   Advisory Board / Optum Advisory: https://www.advisory.com/

export const MEDICAL_PAYMENTS_INJECTION = `
MEDICAL & HEALTHCARE PAYMENTS CONTEXT (use when target or seller is at the intersection of payments, healthcare benefits, supplemental benefits, flex cards, SNAP/EBT, food-as-medicine, RCM, patient billing, or health plan administration):

=== 1. SNAPSHOT & MARKET SIZING ===
- US healthcare spending: ~$4.8T in 2024 (~18% of GDP), projected to exceed $7T by 2032 [verified 05/2026, CMS National Health Expenditure data]. Healthcare payments infrastructure processes a meaningful fraction of this spend.
- Revenue Cycle Management (RCM) market: ~$150-175B US market including in-house operations and outsourced services [verified 05/2026, Grand View Research / HFMA]. Outsourced RCM is ~$50-60B and growing at 10-12% CAGR as provider organizations seek operational efficiency.
- Patient out-of-pocket spending: ~$440B annually in the US including copays, coinsurance, deductibles, and non-covered services [verified 05/2026, CMS NHE / KFF]. Patient financial responsibility has grown 2-3x faster than wages over the past decade.
- MA supplemental benefits: ~$337B over last 10 years, $67B in 2024 alone [verified 05/2026, MedPAC June 2025]. Over 99% of MA plans offer at least one supplemental benefit; median 23 per plan [verified 05/2026, KFF].
- HSA/FSA market: ~$115B+ in HSA assets under management; ~33M HSA accounts [verified 05/2026, HealthEquity IR / Devenir]. FSA market: ~$30B+ annual employer contributions.
- Health plan payments volume: commercial + Medicare + Medicaid claims processing exceeds $3T annually [verified 05/2026, CMS / industry estimates].
THE CONNECTING RAIL: The filtered-spend Visa/Mastercard prepaid card is the dominant mechanism through which MA supplemental benefits, Medicaid HRSN services, employer FSA/HSA dollars, and food-as-medicine programs flow to consumers. MCC restrictions, real-time basket-level validation, and UPC-level filtering enforce benefit rules at point of sale. BHN's Hawk Marketplace, Tango Card's reward-redemption rails, and the broader prepaid network are direct architectural cousins of this stack.

=== 2. DISTINCT DYNAMICS ===
HEALTHCARE PAYMENTS ARE NOT ONE MARKET — FOUR DISTINCT FLOWS:
Flow 1 — PAYER-TO-PROVIDER: Health plans (commercial, Medicare, Medicaid) paying providers for services rendered. Claims adjudication, remittance, and settlement. ERA/EFT (Electronic Remittance Advice / Electronic Funds Transfer) is the standard. Change Healthcare (Optum) processes ~15B+ transactions annually [verified 05/2026, Optum / Change Healthcare].
Flow 2 — PATIENT-TO-PROVIDER: Patient out-of-pocket payments (copays, deductibles, coinsurance, self-pay). This is the most fragmented and friction-filled flow. Statement-based, often paper, with average collection rates of 50-70% on patient-owed balances [verified 05/2026, HFMA / Advisory Board]. Digital patient payment platforms are the fastest-growing sub-segment.
Flow 3 — EMPLOYER/PLAN-TO-CONSUMER (benefit delivery): HSA/FSA/HRA/LSA/flex card benefit delivery, supplemental benefit administration. Filtered-spend prepaid cards, claims reimbursement, and direct payment to providers. This is where Cambrian's BHN/Tango heritage connects most directly.
Flow 4 — GOVERNMENT-TO-CONSUMER (public benefits): SNAP/EBT, GusNIP nutrition incentives, Medicaid 1115 waiver services, Social Security payments. EBT processing infrastructure, benefit verification, and eligibility determination.

PROVIDER COMPENSATION IS SHIFTING FROM FFS TO VALUE:
- Fee-for-service (FFS) still dominates: ~60% of provider revenue, but declining [verified 05/2026, HFMA / McKinsey]. FFS creates volume incentives — more procedures = more revenue.
- Value-based care (VBC) models growing: shared savings (MSSP), bundled payments, capitation, ACO REACH. ~40% of provider revenue now involves some form of value-based arrangement [verified 05/2026, HFMA / CMS]. VBC shifts financial risk to providers and creates demand for population health analytics, care coordination, and cost management tools.
- The FFS-to-VBC transition directly impacts payment flows: VBC requires prospective/capitated payment infrastructure instead of retrospective claims-based payment. Providers in VBC arrangements need fundamentally different revenue cycle capabilities.

=== 3. SUB-CATEGORIZATION ===
HEALTHCARE PAYMENT SUB-SEGMENTS:
A. REVENUE CYCLE MANAGEMENT (RCM): patient registration, eligibility verification, charge capture, coding (ICD-10, CPT, HCPCS), claims submission, denial management, payment posting, collections, and reporting. The end-to-end administrative process by which providers get paid.
B. CLAIMS CLEARINGHOUSE / EDI: electronic data interchange for claims submission and remittance between providers and payers. Change Healthcare (Optum) and Availity are the dominant platforms.
C. PATIENT FINANCIAL ENGAGEMENT: price transparency, cost estimation, financial assistance screening, payment plans, digital billing, and patient payment processing.
D. HEALTH PLAN PAYMENT ADMINISTRATION: claims adjudication, provider payment, member cost-sharing calculation, COB (coordination of benefits), and subrogation.
E. SUPPLEMENTAL BENEFITS / FLEX CARDS: MA supplemental benefit administration, filtered-spend card management, real-time POS authorization, utilization tracking.
F. HSA/FSA/HRA/LSA ADMINISTRATION: account custodianship, claims adjudication, card issuance, investment management, and employer benefit administration.
G. PBM / PHARMACY PAYMENTS: prescription benefit management, pharmacy claims adjudication, rebate negotiation, specialty pharmacy, and 340B program administration.
H. GOVERNMENT BENEFITS / EBT: SNAP/EBT processing, WIC, GusNIP nutrition incentives, Medicaid eligibility systems.

=== 4. NAMED COMPANIES (15-20 reference firms) ===
RCM / Revenue Cycle:
- Waystar: PE-backed (EQT Partners), ~$700M+ revenue [verified 05/2026, PitchBook / press reports]. Dominant mid-market RCM platform. IPO filed 2024. Comprehensive claims management, denial prevention, patient payments.
- R1 RCM (NASDAQ: RCM): ~$2.3B revenue [verified 05/2026, R1 RCM 10-K]. End-to-end RCM outsourcing for large health systems. Acquired Cloudmed (2022) for analytics. TowerBrook/New Mountain Capital take-private ($8.9B) completed 2024 [verified 05/2026, press reports].
- Ensemble Health Partners: PE-backed (Golden Gate Capital), acquired by Bon Secours Mercy Health partner. Mid-market RCM outsourcing. ~$1B+ revenue [verified 05/2026, PitchBook].
- Athenahealth: PE-backed (Hellman & Friedman / Bain Capital), ~$1.7B revenue [verified 05/2026, PitchBook]. Cloud-based RCM + EHR for ambulatory practices. Network effect from ~160,000+ providers on platform.
- nThrive / FinThrive: merged entity (TransUnion Healthcare + Recondo + MedeAnalytics), PE-backed (Clearlake Capital). Revenue integrity and patient access solutions [verified 05/2026, PitchBook].

Claims / EDI:
- Change Healthcare (Optum): acquired by UnitedHealth Group for $13B (2022) [verified 05/2026, UHG filings]. Largest US claims clearinghouse, processing 15B+ transactions/year. The Feb 2024 cyberattack disrupted healthcare payments nationwide — a watershed event for healthcare cybersecurity [verified 05/2026, Becker's / CMS].
- Availity: joint venture (Anthem/Elevance + Health Care Service Corporation). Claims clearinghouse and revenue cycle portal. ~700,000+ providers connected [verified 05/2026, Availity].

Patient Payments:
- InstaMed (J.P. Morgan): healthcare payment network connecting providers, payers, and consumers. Acquired by JP Morgan (2019). Processes $300B+ in healthcare payments [verified 05/2026, JPMorgan / InstaMed].
- Cedar: patient financial engagement platform. $350M+ raised (Andreessen Horowitz) [verified 05/2026, Crunchbase]. Digital billing, price estimation, payment plans.
- Flywire (NASDAQ: FLYW): cross-industry payments with healthcare vertical. ~$400M revenue [verified 05/2026, Flywire 10-K].

Supplemental Benefits / Flex Cards:
- NationsBenefits: General Atlantic-backed. Basket-level adjudication for MA supplemental benefits. ~$200M est. revenue [verified 05/2026, PitchBook].
- Solutran (Optum/UHG): Healthy Benefits+ platform, S3 platform (55,000+ stores) [verified 05/2026, Solutran].
- Soda Health: Lightspeed/Define-backed. Smart Benefits cards with item-level filtering. $94.2M raised [verified 05/2026, Crunchbase].

HSA/FSA:
- HealthEquity (NASDAQ: HQY): largest standalone HSA custodian, ~$30B assets, ~17M accounts [verified 05/2026, HealthEquity IR].
- WEX (NYSE: WEX): benefits administration + fleet payments. 350+ payroll/HRIS partners, 225+ insurance carriers [verified 05/2026, WEX IR].

Pricing Transparency:
- Zelis: PE-backed (Parthenon Capital / Bain Capital), ~$1B+ revenue [verified 05/2026, PitchBook]. Network management, claims cost optimization, and payment integrity for payers.
- MultiPlan (NYSE: MPLN): ~$1B revenue [verified 05/2026, MultiPlan 10-K]. Analytics-driven cost management and payment integrity. Serves payers and TPAs.
- CoverMyMeds (McKesson): electronic prior authorization and medication access. Part of McKesson's RxTS segment [verified 05/2026, McKesson filings]. Connects prescribers, pharmacies, and payers.

=== 5. REGULATORY OVERLAY ===
CMS REGULATORY FRAMEWORK:
- Medicare Advantage plans receive federal rebate dollars for supplemental benefits — ~$337B over last 10 years, $67B in 2024 alone [verified 05/2026, MedPAC June 2025].
- Two authorities: (1) Primarily Health Related Supplemental Benefits (broadened 2018/2019) and (2) SSBCI (Special Supplemental Benefits for the Chronically Ill, authorized by Bipartisan Budget Act 2018) — requires "reasonable expectation of improving health or overall function."
- CMS-4205-F (CY2025 Final Rule): mandated real-time POS verification for debit cards administering supplemental benefits.
- CY2027 Final Rule (April 2, 2026): rolled back consumer protections (rescinded mid-year unused benefits notification, did NOT ban flex card marketing) but RETAINED technology mandates (real-time POS verification, SSBCI evidence standards). Regulatory direction: loosening on consumer protections, retaining infrastructure mandates — operator-favorable for vendor ecosystem.
- VBID model terminated end of 2025 — plans that built food-as-medicine through VBID must reconfigure under SSBCI or other authority.

PRICE TRANSPARENCY:
- Hospital Price Transparency Rule (CMS, effective 2021): requires hospitals to publish machine-readable files of negotiated rates. Compliance has been slow — only ~35% of hospitals were fully compliant by mid-2025 [verified 05/2026, Patient Rights Advocate / CMS]. CMS increased penalties in 2024 (up to $5,500/day for large hospitals).
- No Surprises Act (effective 2022): protects patients from surprise out-of-network bills for emergency services and certain scheduled care. Created the Independent Dispute Resolution (IDR) process for payer-provider payment disputes. IDR volume overwhelmed the system — over 490,000 disputes filed in the first 18 months [verified 05/2026, CMS / HHS].
- Transparency in Coverage Rule (CMS/DOL/Treasury): requires commercial health plans to publish machine-readable files of negotiated rates and out-of-network allowed amounts. Phased implementation 2022-2024.

PBM TRANSPARENCY LEGISLATION:
- CVS Caremark, Express Scripts (Cigna), OptumRx (UHG) control ~80% of U.S. Rx claims [verified 05/2026, FTC].
- Active federal bills: S.526 Pharmacy Benefit Manager Transparency Act 2025, S.1339 PBM Reform Act (CBO scored: $1.9B revenue increase over 2025-2034) [verified 05/2026, CBO]. EBSA proposed rule (Jan 30, 2026) "Improving Transparency Into PBM Fee Disclosure."
- All 50 states have enacted some form of PBM regulation; ~20 spread-pricing prohibitions; ~15 rebate-pass-through requirements [verified 05/2026, NASHP].

HIPAA / CYBERSECURITY:
- The Change Healthcare breach (Feb 2024) was the largest healthcare data breach in US history, affecting 100M+ individuals [verified 05/2026, HHS / Becker's]. It triggered congressional hearings, CMS emergency payment provisions, and an industry-wide reassessment of third-party cybersecurity risk.
- HIPAA Security Rule update proposed (2024-2025): includes new requirements for encryption, MFA, network segmentation, and incident response. Would significantly increase compliance burden for healthcare payment entities.

=== 6. TECHNOLOGY STACK ===
FILTERED-SPEND TECHNOLOGY (three architectures):
1. MCC-Level Filtering (loosest): restricts to approved merchant categories. Cheapest but allows any spend at in-MCC merchants.
2. IIAS/SIGIS Lists (mid-resolution): industry-standard FSA/HSA-eligible products at SKU level. Legacy architecture; doesn't handle per-plan MA benefit variation.
3. Real-Time Basket-Level Adjudication (highest resolution): UPC/department-level filtering dynamically authorizing per basket. NationsBenefits Basket Analyzer Service (BAS), Solutran S3 platform (55,000+ stores), Soda Health Smart Benefits — this is now the technology floor.

RCM TECHNOLOGY STACK:
- Practice management / billing: the operational core for physician practices. athenahealth, eClinicalWorks, NextGen, AdvancedMD for ambulatory; Epic, Cerner (Oracle Health), MEDITECH for hospital/health system.
- Claims scrubbing / editing: pre-submission claim validation against payer rules. Waystar, Optum (ClaimCheck), Quadax, RelayHealth.
- Denial management: workflow, analytics, and automation for claim denials. Denials represent 5-10% of gross charges and cost $25-50 per rework [verified 05/2026, HFMA]. Denial rates have increased 20%+ over the past 3 years [verified 05/2026, Advisory Board].
- Patient payment platforms: Cedar, PayGround, VisitPay (Waystar), Patientco (Waystar), Collectly, Simplee (Waystar). Consumer-grade UX applied to healthcare billing.
- AI in RCM: coding automation (Fathom, Nym Health, AGS Health), prior authorization automation (Olive, CoverMyMeds, Cohere Health), denial prediction, and payment estimation. AI-assisted coding is the highest-ROI automation use case in RCM [verified 05/2026, HFMA / Becker's].

HEALTH PLAN & BENEFIT ADMINISTRATION STACK:
- MA carriers: UnitedHealthcare (~30% MA enrollment; Optum handles supplemental benefits admin), Humana, Aetna/CVS, Anthem/Elevance, Centene, Kaiser, Cigna [verified 05/2026, CMS enrollment data / KFF].
- TPAs: WEX, Discovery Benefits, Ameriflex, Inspira, Lively, Bend Financial. Economics: PEPM admin fees + per-transaction fees + interchange + HSA interest income.
- Benefits admin platforms: Workday, ADP, Rippling, Gusto, Paycom, Paylocity (employer HRIS); Empyrean, Businessolver, Benefitfocus/Voya, bswift/Aon (large-employer enrollment).

=== 7. ICP PATTERNS ===
- HIGHEST FIT: filtered-spend card vendors (NationsBenefits, Soda Health, Solutran competitors). Direct architectural overlap with BHN rails — MCC filtering, basket adjudication, issuing-bank relationships.
- HIGH FIT: MA plan supplemental benefits administrators. Multi-stakeholder GTM (plan sponsors, retail networks, CMS compliance).
- HIGH FIT: mid-market RCM companies ($50M-$500M revenue) investing in AI-driven coding, denial management, or patient financial engagement. Active buyers with accessible decision-makers.
- MODERATE FIT: food-as-medicine operators (Medicaid 1115 / SSBCI delivery). Federal routing risk creates strategic GTM pivot demand.
- MODERATE FIT: TPA / benefits administration platforms modernizing filtered-spend. HSA/FSA rail modernization.
- MODERATE FIT: patient payment platform vendors scaling enterprise sales. Complex payer-provider-patient three-sided market dynamics.
- LOW FIT: national MA carriers (UHG, Humana, CVS/Aetna). Massive internal teams, procurement fortress.
- LOW FIT: PBMs (CVS Caremark, Express Scripts, OptumRx). Vertically integrated, distinct Rx rail.
- POOR FIT: standalone HSA custodians (HealthEquity, Fidelity HSA). Commodity product, scale-driven.

=== 8. BUYING COMMITTEE ===
For RCM / Provider-Side:
- CFO / VP Revenue Cycle: owns the revenue cycle P&L. Primary economic buyer for RCM technology and outsourcing.
- CIO / Chief Digital Officer: IT infrastructure, EHR integration, cybersecurity. Technical approval authority.
- VP Patient Financial Services / Patient Access: front-end revenue cycle (registration, eligibility, financial counseling). Owns patient financial experience.
- Chief Medical Officer (CMO): clinical coding accuracy, clinical documentation improvement (CDI), quality measures. Involved when AI-assisted coding or clinical workflow changes are proposed.

For Payer / Plan-Side:
- VP Medicare / VP Government Programs: owns MA plan strategy including supplemental benefits.
- Chief Medical Officer / Medical Director: clinical validation of SSBCI benefits, quality measure impact.
- VP Member Experience: flex card utilization, member engagement, CAHPS scores.
- VP IT / Chief Technology Officer: integration, data, platform selection.

For Benefits Administration:
- VP Benefits / Total Rewards (employer buyers): HR decision-maker for HSA/FSA/LSA platform selection.
- CFO / VP Finance: cost management, contribution strategy, fiduciary obligations (HSA).
- Benefits broker / consultant: influential intermediary for employer-side buying decisions. Mercer, Aon, WTW, Lockton, and regional brokers drive a significant percentage of TPA selection.

=== 9. TRIGGER EVENTS ===
- CMS final rule publication (annual, typically spring): creates compliance investment urgency
- Star Ratings release (October annually): plans falling below 4.0 face QBP loss, driving supplemental benefits and engagement investment
- Health plan RFP cycle (typically Q2-Q3 for following plan year): supplemental benefits vendor selection
- EHR migration or upgrade (Epic, Oracle Health): creates integration windows for RCM and payment platforms
- Change Healthcare-type cybersecurity event: drives third-party risk assessment and vendor diversification
- Hospital Price Transparency enforcement actions: drive investment in chargemaster management and price estimation tools
- Denial rate spike: when denials exceed 10% of gross charges, RCM investment becomes urgent
- Patient payment collection rate decline: triggers evaluation of digital billing and patient engagement platforms
- Value-based care contract expansion: creates demand for population health analytics and prospective payment capabilities
- Benefits broker recommendation or RFP: brokers drive significant employer-side platform selection
- Open enrollment cycle (Q4 for commercial; Oct-Dec for Medicare): peak season for benefits administration platform evaluation
- State Medicaid 1115 waiver approval or renewal: creates implementation demand for food-as-medicine and HRSN programs
- EBSA PBM fee-disclosure rule compliance deadline: creates new obligations for TPAs serving self-funded ERISA plans

=== 10. FAILURE MODES ===
- Conflating healthcare payments sub-segments: RCM, patient billing, claims clearinghouse, supplemental benefits administration, and HSA/FSA are distinct markets with different buyers, different technology, and different competitive sets. A pitch that conflates them loses credibility immediately.
- Ignoring the Change Healthcare breach context: any healthcare payments conversation in 2025-2026 will include cybersecurity as a top concern. Failing to address third-party risk, redundancy, and data protection is a disqualifier.
- Underestimating regulatory complexity: CMS rules change annually; HIPAA enforcement is intensifying; PBM legislation is actively evolving. Generic "compliance" positioning without demonstrating specific regulatory knowledge (Star Ratings, SSBCI evidence standards, price transparency) signals superficiality.
- Treating the hospital CFO like a technology buyer: hospital CFOs care about net revenue, days in A/R, and cost-to-collect — not technology features. Frame RCM technology in financial performance terms.
- Assuming MA supplemental benefits growth is guaranteed: OTC benefit penetration declined from 88% to 79% under margin pressure [verified 05/2026, KFF]. Plans can and do cut supplemental benefits when Star Ratings or rebate economics deteriorate.
- Ignoring the broker channel for employer benefits: for HSA/FSA/LSA platforms, benefits brokers and consultants influence 60-70% of employer buying decisions [verified 05/2026, HFMA / industry estimates]. Going direct-to-employer without a broker strategy is inefficient.
- Presenting 1115 waiver programs as stable: federal matching-fund risk has materially increased since the March 2025 CMS guidance rescission. State-level FIM programs are under review. Do not present food-as-medicine as a stable growth vector without caveatting federal policy risk.
- Missing the patient-as-payer shift: with average deductibles exceeding $1,500 for commercial plans [verified 05/2026, KFF], patients are functionally payers for a significant portion of their healthcare costs. Healthcare payments solutions must address the consumer experience, not just the payer-provider B2B flow.

=== 11. GTM IMPLICATIONS ===
- The filtered-spend supplemental-benefits stack is structurally identical to the BHN/Tango branded-payments-network stack Joe operated. Vertical specifics differ (clinical coverage rules, CMS authority frameworks, dual-agency benefit treatment) but rails, issuing-bank relationships, merchant acceptance economics, and technology architecture are direct cousins.
- RCM is a relationship-driven sale: health system CIOs and CFOs rely on peer references, KLAS ratings, and consultant recommendations (Advisory Board, Gartner). Cold outbound is low-conversion; event-based and referral-based motions work.
- The patient payment segment is the most accessible for new market entrants: shorter sales cycles (3-6 months), smaller initial deal sizes ($50K-$200K ACV), and high buyer receptivity to modern UX. Land-and-expand from patient payments into broader RCM.
- HSA/FSA + LSA + flex card vendor consolidation is the macro structural trend: WEX, Inspira, and Optum Financial are simultaneously HSA/FSA admins, LSA admins, AND bidding for filtered-spend administration. Single-card, single-app, single-platform consolidation thesis cuts across all account types.
- Star Ratings QBP economics create direct ROI path for outcomes-driven supplemental benefits. Plans driving flex card utilization through care-gap-closure linkage have measurable Star Ratings benefits — the QBP economics make this a $600M-$1B+ annual lever industry-wide [verified 05/2026, Wakely Actuarial / McKinsey].
- Conference circuit matters: HFMA ANI (Annual National Institute), HIMSS, AHIP, RISE (MA-specific), and America's Health Insurance Plans conferences are where buyers evaluate and decide. KLAS ratings are the healthcare equivalent of Gartner MQ — being rated is a prerequisite for enterprise sales.
- The cybersecurity conversation is now a buying criterion, not a checkbox: post-Change Healthcare, healthcare payment vendors must demonstrate SOC 2 Type II, HITRUST certification, business continuity / redundancy architecture, and incident response capability to win enterprise deals.

HSA/FSA ARCHITECTURE (the ancestor of filtered-spend):
Every basket-level adjudication mechanic in MA flex cards traces back to employer-sponsored CDH accounts. Section 213(d) defines eligible "medical care" expenses. Section 223 governs HSAs. Section 125 governs cafeteria plans (FSA umbrella).
2026 limits (IRS Notice 2026-5): HSA self-only $4,400, HSA family $8,750, HSA catch-up (55+) $1,000, FSA $3,400 [verified 05/2026, IRS]. HDHP minimum deductible $1,650/$3,300; OOP max $8,500/$17,000 [verified 05/2026, IRS]. OBBBA (2025) expanded HSA eligibility — bronze and catastrophic ACA Exchange plans now HDHP-eligible after Dec 31, 2025; Direct Primary Care fees now 213(d) eligible from HSA.
IIAS (Inventory Information Approval System) is the IRS-sanctioned standard allowing non-healthcare merchants to accept FSA/HRA debit cards. SIGIS (Special Interest Group for IIAS Standards) publishes the Eligible Product List monthly — SKU-level identification of 213(d)-eligible items. The 90% Rule allows pharmacies/medical-supply retailers to accept cards without full IIAS infrastructure. HSA funds are individually owned, portable, roll over indefinitely. FSAs subject to use-it-or-lose-it (carryover up to $680 in 2026 [verified 05/2026, IRS] OR grace period up to 2.5 months — not both).
HSA/FSA admin "Big 4-5": HealthEquity (~$30B assets, ~17M accounts [verified 05/2026, HealthEquity IR]), Optum Financial (UHG captive), WEX (NYSE: WEX, 350+ payroll/HRIS partners [verified 05/2026, WEX IR]), Inspira Financial, Lively.

LIFESTYLE SPENDING ACCOUNTS (LSA) — fastest-growing employer-funded benefit:
Post-tax employer-funded accounts — NOT tax-advantaged. Employer defines eligible expenses, contribution, carry-forward rules. Reimbursement is taxable income to employee. Adoption: 10% of companies offer LSA (doubled since 2024) [verified 05/2026, Sequoia]; 48% of full-time-office employers expect to offer within next year [verified 05/2026, Compt]. Common funding: $500-$2,000/EE/year. Vendors: WEX (enterprise), Forma (mid-market/tech), Compt (27 categories), Holisticly, Fringe, Inspira, Benepass.

MA STAR RATINGS & QUALITY BONUS PAYMENT DYNAMICS:
Star Ratings drive MA plan economics more than any other single factor. ACA Section 3201 provides 4+ star plans with 5% benchmark bonus. More than 58% of MA plans earned less than 4.0 stars for 2024 [verified 05/2026, CMS Star Ratings]. 2025 Star Ratings: 40% of MA-PDs (209 contracts) earned 4+ stars — a 12-percentage-point single-year decline (largest in program history) [verified 05/2026, CMS Star Ratings]. Health Equity Index (HEI) replaces Reward Factor starting 2027 Star Ratings — plans serving D-SNP/dual-eligible populations get structural advantage. The supplemental benefits / flex card / engagement infrastructure is DIRECTLY LOAD-BEARING on Star Ratings [verified 05/2026, Wakely Actuarial / McKinsey].

OUTCOMES-LINKED CARD DESIGN (three architectures):
1. Care-Gap Closure: card reload contingent on preventive screening, wellness visit, medication adherence — improves Star Ratings while driving engagement.
2. SDOH-Aligned Spend Steering: filtering pre-restricted to clinical condition (diabetes-aligned grocery, heart-healthy for CHF, renal-diet for ESRD).
3. Behavioral Reinforcement Loops: real-time push notifications at point of purchase — same mechanism as Tango Card reward redemption.

SNAP/EBT & NUTRITION INCENTIVES:
- SNAP: ~41M Americans [verified 05/2026, USDA/FNS], state-operated EBT cards. EBT online purchasing operational in all 50 states as of 2025.
- GusNIP (Gus Schumacher Nutrition Incentive Program, 2018 Farm Bill): federal grants for fruit/vegetable purchase subsidies for SNAP participants — typically 1:1 dollar match.
- EBT processors: Conduent, FIS, Solutran/WEX ($340M acquisition 2022) [verified 05/2026, WEX IR].

FOOD AS MEDICINE — MEDICAID 1115 WAIVERS:
- CMS approved 10 state waivers expanding Food as Medicine by Nov 2024; 19 approved or pending addressing nutrition overall [verified 05/2026, Hanson et al. 2024, Health Affairs Scholar].
- FIM service categories: medically tailored meals (9 of 10 waivers), medically supportive groceries (8), produce prescriptions (7), medically supportive meals (7), medically tailored groceries (6).
- CRITICAL 2025 REVERSAL: CMS rescinded guidance on Health-Related Social Needs (March 2025) and is reviewing 1115 waivers. Federal matching-fund risk has materially increased.

INTERNATIONAL PREVENTIVE-CARE INCENTIVE BENCHMARKS:
- UK NHS Social Prescribing: GPs refer to Link Workers who connect patients to community-based support. Permanent ARRS funding mechanism [verified 05/2026, NHS England].
- Singapore HPB Healthy 365: 1M+ app downloads, 80%+ engagement rates in National Steps Challenge. Multi-redemption-rail architecture [verified 05/2026, HPB Singapore].
- Germany Bonusprogramm: Section 65a SGB V. ~95 statutory health insurance funds, cash bonuses (EUR 100-200/year) for preventive screenings [verified 05/2026, GKV-Spitzenverband].
- Cross-country lessons: (1) Stable funding > reward richness. (2) Non-financial mechanisms work. (3) Wearable integration is the engagement multiplier. (4) Multi-rail architecture increases stickiness vs single-rail.

VENDOR FINANCIAL PROFILES (pre-engagement diligence):
NationsBenefits: founded 2015, ~2,500 employees, $328M total raised, General Atlantic majority [verified 05/2026, Crunchbase/PitchBook]. Est. revenue ~$200M, est. valuation ~$640M. 11+ major retail integrations 2025-2026 (Walgreens, Dollar General, H Mart). Strategic position: exit or scaling event 2026-2027.
Solutran: founded 1982, acquired by UHG Jan 2021. Healthy Benefits+ (consumer brand), S3 platform (55K+ stores). Captive; insulated from M&A.
Soda Health: founded 2020, $94.2M raised (Lightspeed, Define Ventures). Most likely candidate for acquisition or Series C 2026-2027 [verified 05/2026, Crunchbase].

=== 12. CROSS-REFERENCES ===
- digitalIncentivesPlatformsKnowledge.js: the filtered-spend supplemental-benefits card architecture is structurally identical to digital incentives platform economics. Layer these together for targets at the intersection (flex card vendors, benefit delivery platforms).
- rewardsIncentivesKnowledge.js: care-gap closure incentive design, wellness reward programs, and outcomes-linked card design are rewards/incentives patterns applied to healthcare.
- paymentsKnowledge.js: payment rail infrastructure, interchange economics, and card-issuing relationships that underlie healthcare payment flows.
- fintechKnowledge.js: embedded finance, BaaS, and API-first payment platforms that are entering healthcare adjacently.
- charitableGivingKnowledge.js: the COTF/IGCC relationship vector connects to MA supplemental benefits — card-issuance, real-time adjudication, and benefit-utilization analytics are operationally the same patterns.
- insuranceKnowledge.js: health plan economics, carrier dynamics, and regulatory frameworks that drive supplemental benefits investment decisions.
- healthcareSaasKnowledge.js: healthcare SaaS platforms (EHR, PM, telehealth) that are RCM adjacencies and potential integration partners.

M&A OUTLOOK:
NationsBenefits is the most likely 2026-2027 strategic event. General Atlantic hold period approaching 4-5 years. Likely strategic buyers: UHG/Optum, Humana, CVS, Elevance — or PE roll-up. Soda Health is the most likely follow-on event 2027-2028. Solutran (UHG captive) and InComm Healthcare (subsidiary) are structurally insulated. In RCM, R1 RCM's take-private ($8.9B, TowerBrook/New Mountain, 2024) signals continued PE interest in RCM consolidation. Waystar's IPO filing indicates a potential public-market exit path for PE-backed RCM [verified 05/2026, PitchBook / press reports].

CROSS-AGENCY BENEFIT PROTECTION (2024-2025):
- USDA/FNS (Dec 2024): MA supplemental benefits excluded from SNAP income determination.
- CMS (Jan 2025): flex cards are not cash benefits.
- HUD (Jan/Mar 2025): flex card amounts count for rental assistance only when actually used for rent/utilities.
- Operator implication: cross-agency coordination supports broader flex-card adoption for dual-eligible (D-SNP) populations without disqualifying members from SNAP or Section 8. 91% of D-SNP plans offered a flex card in 2025 [verified 05/2026, ATI Advisory].

CAMBRIAN'S EDGE: The filtered-spend supplemental-benefits stack is structurally identical to the BHN/Tango branded-payments-network stack Joe operated. The COTF/IGCC relationship vector takes sharper shape here — card-issuance, real-time adjudication, and benefit-utilization analytics for MA supplemental benefits are operationally the same patterns COTF and IGCC operators run for charitable giving and corporate incentive programs.

KNOWN TRAPS (data staleness, misinterpretation risks — review every quarterly sweep):
1. IRS HSA/FSA/HDHP limits change EVERY calendar year. The 2026 figures will be wrong by January 2027. Always re-verify against the latest IRS Revenue Procedure or Notice before citing in a brief.
2. CMS Star Ratings cut points shift annually (October release). The Tukey methodology, guardrails, and court-ordered recalculations mean year-over-year comparisons are NOT apples-to-apples. Never extrapolate trends from two adjacent years.
3. Medicaid 1115 waiver status is VOLATILE. The March 2025 CMS guidance rescission and ongoing reviews mean any state-level FIM program could lose federal matching funds between quarterly sweeps. Verify individual state waiver status before citing.
4. SNAP participation (~41M) fluctuates with economic conditions and policy (pandemic-era expansions expired). Can swing 5-10M in a single year. Cite the most recent USDA monthly participation report.
5. MA supplemental benefit penetration rates (OTC at 79%, D-SNP flex card at 91%) are PLAN-YEAR figures that reset each October. Mid-year amendments and Star Ratings-driven benefit cuts can make last year's number materially wrong.
6. Vendor financials (NationsBenefits ~$200M rev, ~$640M valuation; Soda Health $94.2M raised) are ESTIMATED from Crunchbase/PitchBook. Private companies do not disclose — treat as directional. M&A events can make these obsolete overnight.
7. PBM market share (~80% Big 3) is shifting as transparency-focused alternatives gain share. Re-verify after any federal PBM bill passes.
8. GusNIP funding depends on Farm Bill reauthorization. A lapse or restructuring could eliminate the entire nutrition incentive grant pipeline.
9. Cross-agency benefit protection rulings (USDA/HUD/CMS 2024-2025) are GUIDANCE, not statute. A new administration can reverse without notice.
10. LSA adoption figures (10% of companies, 48% expect to offer) are survey-based from Sequoia and Compt — small sample sizes, self-selected respondents, vendor-sponsored. Treat as directional market signal.
11. International benchmarks (NHS Social Prescribing, Singapore HPB, Germany Bonusprogramm) are structural comparisons only — do NOT cite engagement rates as evidence of achievable US rates.
12. The "food as medicine" umbrella conflates 5 distinct service categories with different evidence bases, cost structures, and reimbursement routes. Never treat FIM as a monolith.
`;

export const MEDICAL_PAYMENTS_SCORING = {
  highFitSegments: [
    { segment: "Filtered-spend card vendors (NationsBenefits, Soda Health, Solutran competitors)", avgFit: "88-95%", reason: "Direct architectural overlap with BHN rails — MCC filtering, basket adjudication, issuing-bank relationships. GTM complexity (MA plan sales, CMS compliance, retail integration) matches Cambrian" },
    { segment: "MA plan supplemental benefits administrators", avgFit: "80-88%", reason: "Multi-stakeholder GTM (plan sponsors, retail networks, CMS compliance); same filtered-spend technology stack" },
    { segment: "Mid-market RCM companies ($50M-$500M revenue) investing in AI and patient engagement", avgFit: "75-85%", reason: "Active buyers with accessible decision-makers; AI coding and denial management are high-ROI investment areas; complex multi-stakeholder GTM" },
    { segment: "Food-as-medicine operators (Medicaid 1115 / SSBCI delivery)", avgFit: "75-85%", reason: "Federal routing risk (1115 reversal) creates strategic GTM pivot demand; nutrition incentive economics familiar from rewards domain" },
    { segment: "TPA / benefits administration platforms modernizing filtered-spend", avgFit: "72-82%", reason: "WEX white-label backbone; HSA/FSA rail modernization; real-time adjudication infrastructure gap" },
    { segment: "Patient financial engagement platforms", avgFit: "70-80%", reason: "Consumer-grade UX applied to healthcare billing; shorter sales cycles; land-and-expand into broader RCM" },
    { segment: "SNAP/EBT nutrition incentive technology (GusNIP grantees, EBT processors)", avgFit: "65-75%", reason: "Federal program tech modernization; EBT-to-digital integration; incentive design expertise from rewards domain" },
    { segment: "LSA-first platforms and multi-account benefits admins", avgFit: "68-78%", reason: "Fastest-growing employer benefit account; low regulatory complexity; land-and-expand into HSA/FSA/flex card adjacency" },
  ],
  highFrictionSegments: [
    { segment: "National MA carriers (UHG, Humana, CVS/Aetna)", avgFit: "10-20%", reason: "Massive internal teams (Optum handles in-house); procurement fortress; 12-18 month cycles" },
    { segment: "PBMs (CVS Caremark, Express Scripts, OptumRx)", avgFit: "8-15%", reason: "Vertically integrated with carriers; distinct Rx rail from supplemental benefits; regulatory sensitivity" },
    { segment: "Standalone HSA custodians (HealthEquity, Fidelity HSA)", avgFit: "20-30%", reason: "Commodity product; scale-driven; limited consulting leverage; IRS rule-constrained" },
    { segment: "Large integrated health systems with internal RCM teams (Epic-native)", avgFit: "15-25%", reason: "Build-not-buy preference; Epic-centric workflows resist third-party tools; 12+ month procurement" },
  ],
};

export const MEDICAL_PAYMENTS_DISCOVERY = `
MEDICAL & HEALTHCARE PAYMENTS DISCOVERY (use when prospect operates at the intersection of payments, healthcare benefits, flex cards, RCM, patient billing, or food-as-medicine):

REALITY:
- Walk me through how benefit dollars flow from the plan sponsor through your platform to the point of sale — what are the authorization checkpoints?
- What level of filtering do you operate at today — MCC, IIAS/SIGIS, or real-time basket-level? What's the gap between where you are and the CY2025 POS verification mandate?
- How many MA plan contracts are you operating across, and what's your retail partner footprint by store count?
- What percentage of your business is D-SNP vs standard MA vs Medicaid managed care vs employer-funded benefits?

RCM-SPECIFIC REALITY:
- What does your revenue cycle look like end-to-end — in-house, outsourced, or hybrid? Who are your current vendors for claims, coding, denials, and patient payments?
- What is your current denial rate, and how has it trended over the past 12 months? What are the top denial categories?
- How are you handling the patient-as-payer shift — what percentage of your net revenue is patient-owed, and what's your collection rate on that balance?

IMPACT:
- Where is benefit utilization lowest in your book — which benefit categories and which enrollee segments?
- How exposed are you to the federal Medicaid 1115 posture reversal? What percentage of revenue depends on federal matching funds for food-as-medicine programs?
- What's your competitive moat — retail exclusivity, basket adjudication technology, outcomes analytics, or plan-sponsor relationships?
- How does your unit economics work — per-member-per-month, per-transaction, interchange, or hybrid? What's the margin structure?
- What is the revenue impact of your current denial rate? What would a 2-point improvement in initial clean-claim rate mean in dollars?

VISION:
- How are you thinking about the vendor consolidation thesis? Are you a consolidator or a target?
- What does outcomes-linked card design look like in your product roadmap — care-gap closure triggers, SDOH-aligned filtering, behavioral reinforcement?
- How are you positioning for the CY2028 rulemaking cycle — what do you expect CMS to tighten or loosen?
- How are you incorporating AI into your revenue cycle — coding automation, denial prediction, patient payment optimization?

ENTRY POINTS:
- Who is the buyer on the plan-sponsor side — Chief Medical Officer, VP of Medicare, Head of Supplemental Benefits, or procurement?
- For provider-side RCM: who owns the revenue cycle P&L — CFO, VP Revenue Cycle, CIO?
- How does the retail integration process work — who negotiates merchant acceptance, and what's the timeline from agreement to live POS authorization?

ROUTE:
- If you could solve one thing in your GTM this year — plan acquisition velocity, retail network expansion, outcomes measurement, or regulatory positioning — what would it be?
- How are you thinking about the SNAP/EBT nutrition incentive adjacency — is that a growth vector or a distraction from core MA business?
- What would a GTM advisor need to understand about CMS regulatory dynamics that isn't obvious from the outside?
`;
