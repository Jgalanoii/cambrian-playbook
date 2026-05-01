// src/data/b2bSalesKnowledge.js
//
// B2B Sales Process, Value Creation, and Sales Org Design.
// Cross-cutting layer — applies to ALL B2B prospects.
// Covers: pipeline architecture, value creation frameworks,
// sales org design, channel economics, motion differences.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const B2B_SALES_INJECTION = `
B2B SALES & VALUE CREATION CONTEXT (cross-cutting — apply to ALL B2B prospects):

PIPELINE ARCHITECTURE: Sequential stages (Awareness → Interest → Consideration → Evaluation → Negotiation → Close). Pipeline coverage 3-5x quota is leading indicator. Deal progression shaped by: ICP fit at entry, discovery rigor, champion presence, buying committee alignment (5-11 stakeholders in enterprise).

VALUE CREATION: Three layers — product value (what it does), process value (discipline it enables), outcome value (measurable end-state). Most selling confuses these. Value hypotheses: "[Customer] could [outcome] worth $[X], by [mechanism], using [solution]." Companies undercapture 20-40% by pricing on competitor benchmarks rather than buyer value.

SALES ORG DESIGN: SDRs own prospecting/qualification (activity quotas). AEs own discovery through close (bookings/ARR quotas). CSMs own adoption/expansion (NRR quotas). Comp plans incentivize behavior: bookings-based → aggressive discounting; ARR-based → healthier outcomes. Productivity = pipeline coverage × stage conversion × cycle time × win rate × quota attainment distribution.

MOTION DIFFERENCES:
- Enterprise (>$100K ACV): 8-15 stakeholders, 9-18 months, value-based selling + business cases. Land-small beats transformation pitch.
- Mid-market ($20-100K): 4-9 months, champion development critical, clear ROI required.
- SMB ($5-20K): PLG or inside sales, 4-12 weeks, self-serve viable.
Each has different CAC tolerances and payback requirements.

CHANNEL ECONOMICS: Partners don't sell your product — they sell their outcome. Reseller 20-35% margin, referral 5-15%. A well-enabled partner at $500K/30% margin = $350K contribution at zero CAC — more capital-efficient than direct at scale. Enablement > recruitment.

REVOPS: Connects marketing pipeline + sales conversion + CS retention into one machine. Failures show as: pipeline that doesn't convert, reps and finance reporting different numbers, unclear channel economics, late customer health metrics.

DIAGNOSTIC: Sales motion diagnosed through ICP fit, pipeline coverage, stage conversion, cycle time, win rate variance, ASP trend, discount rate, and NRR. Most prospects fail 5+ of these.
`;

export const B2B_SALES_DISCOVERY = `
B2B SALES DISCOVERY (apply to ANY B2B prospect):
- Walk me through the last 5 deals you closed — at what point in the funnel was the outcome actually determined?
- When you lose, is it competitive, no-decision, or scope misalignment? What's the split?
- What percentage of year-2 revenue comes from expansion vs original deal? Trend?
- What happens between close and first value realization — how long is that gap?
- Rank your company: create → communicate → capture → sustain value. Where do you leak most?
`;
