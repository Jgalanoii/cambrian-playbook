// src/data/b2bSalesKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// B2B Sales Process, Value Creation, and Sales Org Design.
// Cross-cutting layer — applies to ALL B2B prospects.
// Covers: pipeline architecture, value creation frameworks,
// sales org design, channel economics, motion differences.
//
// SOURCES:
// - Gartner May 2025 (buying group conflict, n=632)
// - Gartner June 2025 (rep-free buying preference)
// - Gartner Future of Sales 2025 (17% vendor time, 57% contact point)
// - Forrester 2024 Buyers Journey (n=11,352)
// - Forrester State of Business Buying 2024
// - Dixon & Adamson, The Challenger Sale (CEB/Gartner replications 2016, 2019)
// - McKinsey 2024 ($0.8T-$1.2T GenAI productivity estimate)
// - McKinsey Global B2B Pulse (n=3,942, 34 sectors)
// - Cambrian operator knowledge (pipeline, org design, channel economics)
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const B2B_SALES_INJECTION = `
B2B SALES & VALUE CREATION CONTEXT (cross-cutting — apply to ALL B2B prospects):

BUYING GROUP DYNAMICS (Q2 2026 REFRESH — credentialed research):
- 74% of buying teams demonstrate "unhealthy conflict" during the buying decision process (Gartner May 2025, n=632 B2B buyers). Buying groups that reach consensus are 2.5x more likely to report a high-quality deal.
- 61% of B2B buyers prefer an overall rep-free buying experience; 73% actively avoid vendors that send irrelevant outreach (Gartner June 2025).
- 92% of buyers start with at least one vendor in mind; 41% have a single preferred vendor before formal evaluation begins (Forrester 2024 Buyers Journey, n=11,352).
- 86% of B2B purchases stall at some point; 81% of buyers report dissatisfaction with their chosen provider post-purchase (Forrester State of Business Buying 2024).
- Buyers spend ~17% of total purchase journey time interacting with all potential vendors combined. Initial seller contact occurs at ~57% through the purchase process (Gartner Future of Sales 2025).
- 53% of B2B customer loyalty derives from the sales experience itself — outranks brand, product/service delivery, and value-to-price ratio (Dixon & Adamson, The Challenger Sale, with CEB/Gartner replications 2016 and 2019).
- Buying groups span 5-16 people across as many as 4 functions [verified 05/2026, Gartner 2025]; up to 22 in healthcare [verified 05/2026, FTI Consulting / HIMSS].
- The "champion" model is necessary but no longer sufficient. Insight-led reframing remains the highest-ROI seller behavior, particularly because 41-57% of buyers have already formed preferences before any seller contact.
- Gen AI estimated to add $0.8T-$1.2T incremental productivity in sales and marketing [verified 05/2026, McKinsey 2024]. 19% of B2B decision-makers actively implementing gen AI use cases; another 23% in process [verified 05/2026, McKinsey Global B2B Pulse, n=3,942 across 34 sectors].

PIPELINE ARCHITECTURE: Sequential stages (Awareness → Interest → Consideration → Evaluation → Negotiation → Close). Pipeline coverage 3-5x quota is leading indicator [verified 05/2026, Forrester / SiriusDecisions benchmark]. Deal progression shaped by: ICP fit at entry, discovery rigor, champion presence, buying committee consensus (not just alignment). The 17% total-vendor-time stat is the strongest argument against high-frequency outbound: most contact time is wasted because buyers have already narrowed.

VALUE CREATION: Three layers — product value (what it does), process value (discipline it enables), outcome value (measurable end-state). Most selling confuses these. Value hypotheses: "[Customer] could [outcome] worth $[X], by [mechanism], using [solution]." Companies undercapture 20-40% by pricing on competitor benchmarks rather than buyer value [verified 05/2026, Simon-Kucher & Partners pricing studies].

SALES ORG DESIGN: SDRs own prospecting/qualification (activity quotas). AEs own discovery through close (bookings/ARR quotas). CSMs own adoption/expansion (NRR quotas). Comp plans incentivize behavior: bookings-based → aggressive discounting; ARR-based → healthier outcomes. Productivity = pipeline coverage × stage conversion × cycle time × win rate × quota attainment distribution.

MOTION DIFFERENCES:
- Enterprise (>$100K ACV): 8-16 stakeholders, 9-18 months [verified 05/2026, Gartner Future of Sales 2025], value-based selling + business cases. Land-small beats transformation pitch. Consensus-building is the critical skill — 74% of teams have unhealthy conflict [verified 05/2026, Gartner May 2025].
- Mid-market ($20-100K): 4-9 months [verified 05/2026, Forrester 2024], champion development critical, clear ROI required.
- SMB ($5-20K): PLG or inside sales, 4-12 weeks [verified 05/2026, OpenView SaaS Benchmarks], self-serve viable.
Each has different CAC tolerances and payback requirements.

CHANNEL ECONOMICS: Partners don't sell your product — they sell their outcome. Reseller 20-35% margin, referral 5-15% [verified 05/2026, Forrester Channel Economics Report / Cambrian operator knowledge]. A well-enabled partner at $500K/30% margin = $350K contribution at zero CAC — more capital-efficient than direct at scale. Enablement > recruitment.

REVOPS: Connects marketing pipeline + sales conversion + CS retention into one machine. Failures show as: pipeline that doesn't convert, reps and finance reporting different numbers, unclear channel economics, late customer health metrics.

DIAGNOSTIC: Sales motion diagnosed through ICP fit, pipeline coverage, stage conversion, cycle time, win rate variance, ASP trend, discount rate, and NRR. Most prospects fail 5+ of these.

KNOWN TRAPS (meta-knowledge — where this layer's data goes stale or gets misinterpreted):
- The Gartner "74% unhealthy conflict" stat (n=632) is from a B2B buyer survey, not an observational study. Self-reported conflict levels may differ from actual behavior.
- "61% prefer rep-free buying" does NOT mean buyers want no human contact. It means they prefer self-directed research before engaging reps. Misusing this stat to justify eliminating sales teams is a common error.
- The Challenger Sale loyalty stat (53% from sales experience) is from original CEB research replicated in 2016 and 2019. The methodology has been debated — it measures stated preference, not revealed preference.
- Forrester's "92% start with a vendor in mind" and "86% of purchases stall" are from a large sample (n=11,352) but skew toward enterprise/mid-market buyers. SMB buying may not follow the same pattern.
- Pipeline coverage benchmarks (3-5x) vary dramatically by ACV, cycle length, and conversion rates. A 3x coverage ratio at $500K ACV is very different from 3x at $20K ACV.
- McKinsey's $0.8T-$1.2T GenAI productivity estimate is a TOTAL ADDRESSABLE IMPACT figure, not realized value. It assumes full adoption across all sales and marketing functions globally.
- The "19% actively implementing GenAI" stat is from a 2024 survey. This number is likely materially higher by mid-2026 — use as a floor, not current state.
- Channel economics (20-35% reseller margin) are averages. SaaS reseller margins are compressing as vendors push toward direct and marketplace distribution.
- Enterprise cycle lengths (9-18 months) are pre-COVID baselines that have been disrupted. Remote buying shortened some cycles but elongated others due to consensus-building friction.
- "Companies undercapture 20-40%" on pricing is from Simon-Kucher studies that sample their own client base — companies seeking pricing help are more likely to have pricing problems.
`;

export const B2B_SALES_DISCOVERY = `
B2B SALES DISCOVERY (apply to ANY B2B prospect):
- Walk me through the last 5 deals you closed — at what point in the funnel was the outcome actually determined?
- When you lose, is it competitive, no-decision, or scope misalignment? What's the split?
- What percentage of year-2 revenue comes from expansion vs original deal? Trend?
- What happens between close and first value realization — how long is that gap?
- Rank your company: create → communicate → capture → sustain value. Where do you leak most?
`;
