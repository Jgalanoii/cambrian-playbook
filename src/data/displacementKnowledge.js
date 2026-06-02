// src/data/displacementKnowledge.js — Incumbent Displacement Playbook
//
// Consolidated knowledge for unseating competitors and winning their customers.
// Injected into: hypothesis (Route stage), post-call routing, discovery (Entry Points),
// and competitive intel analysis.
//
// Philosophy: displacement is NOT about being better on features. It's about timing,
// champions, switching costs, and proof points that make change feel safe.

export const DISPLACEMENT_PLAYBOOK = {
  summary: "Displacement is a timing game. The best product loses to the entrenched incumbent unless you catch the right window. Find the window, arm the champion, and make switching feel safe.",

  // ── WHEN TO DISPLACE vs. LAND ADJACENT ──
  strategyFramework: {
    displaceWhen: [
      "Contract renewal within 6 months — procurement window is open, incumbent must re-compete",
      "Incumbent had a public failure — outage, data breach, compliance violation, missed SLA",
      "New leadership (CIO/CTO/VP) with mandate to modernize — they WANT to make changes",
      "M&A event — acquiring company forces platform consolidation, incumbent relationships disrupted",
      "Incumbent sunset or EOL announced — customers MUST move, urgency is external",
      "Regulatory change — new compliance requirement the incumbent can't meet (e.g., EU AI Act, CMMC)",
      "Budget event — new fiscal year, new budget allocation, unspent capital at quarter end",
      "Champion frustration surfaced — someone inside has been documenting problems and building a case",
    ],
    landAdjacentWhen: [
      "Incumbent deeply embedded — 3+ year deployment, 100+ integrations, team built around it",
      "No internal champion pushing for change — you'd be creating demand, not capturing it",
      "Buyer just completed a major implementation (<12 months ago) — appetite for change is zero",
      "Incumbent relationship is personal — founder-to-founder, board connection, golf buddy",
      "Switching costs exceed 2x the annual contract value — the math doesn't work yet",
      "The buyer is in a regulated industry with a compliance audit in the next 6 months — they won't touch anything",
    ],
    adjacentStrategy: "Find the gap the incumbent doesn't serve well and own it. Start with a team, department, or use case they've neglected. Prove value there. Expand when the main contract comes up for renewal.",
  },

  // ── TACTICAL PLAYBOOK BY SCENARIO ──
  tactics: {
    contractRenewal: {
      timing: "Engage 4-6 months before renewal. By the time the RFP drops, the incumbent has already shaped requirements.",
      approach: [
        "Research the contract cycle — government: annual FY; enterprise: typically 3-year with auto-renew",
        "Get to the procurement team BEFORE the RFP is written",
        "Position as 'we're not asking you to switch — we're asking you to evaluate what's changed since you last looked'",
        "Provide a competitive comparison the buyer can use internally to justify the evaluation",
        "Offer a no-cost pilot alongside the incumbent — reduces risk to zero for the buyer",
      ],
      championQuestion: "Who in the org has been frustrated with the current solution but hasn't had the political capital to push for change?",
    },
    incumbentFailure: {
      timing: "Move within 30 days of the failure. The window closes fast — organizational memory is short.",
      approach: [
        "Lead with empathy, not opportunism — 'we heard about [incident], that must have been stressful'",
        "Offer a rapid assessment: 'we can show you in 30 minutes whether you're exposed to the same risk with your current setup'",
        "Frame as risk mitigation, not replacement — 'let's make sure this can't happen again'",
        "Have a case study ready of a similar company that switched after a similar incident",
        "NEVER badmouth the incumbent — the buyer chose them, and criticizing their judgment kills trust",
      ],
      championQuestion: "Who was on the hook when it failed? That person has the most motivation to ensure it doesn't happen again.",
    },
    newLeadership: {
      timing: "Engage within the first 90 days of the new leader's tenure. After that, they've inherited the stack and it's 'theirs.'",
      approach: [
        "New leaders want quick wins to establish credibility — offer one",
        "Frame as 'here's what companies like yours are doing in 2026' — they don't know the current state",
        "Position your solution as part of THEIR modernization narrative",
        "Offer executive-level peer connections — 'our customer [similar company] did exactly this when their new VP started'",
        "Give them ammunition: data they can present to the board in their first QBR",
      ],
      championQuestion: "The new leader IS the champion. But who's their trusted advisor internally? Get to that person.",
    },
    pilotLandExpand: {
      timing: "Anytime the buyer isn't ready for a full switch but acknowledges a gap.",
      approach: [
        "Scope the smallest meaningful slice that proves the thesis in 30 days",
        "Pick a team or department the incumbent underserves",
        "Define success criteria upfront — 'if we hit X in 30 days, we expand to Y'",
        "Make the pilot cost-free or nominal — the goal is proof, not revenue",
        "Document everything — the pilot becomes the internal case study for the full deployment",
      ],
      championQuestion: "Who owns the team or use case where the incumbent falls short?",
    },
  },

  // ── SWITCHING COST ANALYSIS BY VERTICAL ──
  switchingCosts: {
    banking: {
      level: "High",
      factors: "Regulatory approval (OCC/FDIC), data migration, compliance re-certification, core banking integration, customer notification requirements",
      timeline: "12-18 months minimum for core systems, 3-6 months for point solutions",
      mitigation: "Phase rollout by business unit; parallel run; regulatory pre-approval; data migration services included",
    },
    healthcare: {
      level: "Very High",
      factors: "HIPAA BAA execution, HL7/FHIR integration, clinical workflow retraining, EHR interoperability, patient data migration",
      timeline: "18-24 months for clinical systems, 6-12 months for administrative",
      mitigation: "Start with non-clinical use case; offer HIPAA compliance guarantee; include training budget",
    },
    insurance: {
      level: "High",
      factors: "Policy administration migration, actuarial model re-certification, state regulatory filings, agent system retraining",
      timeline: "12-18 months for core, 6 months for distribution/agent tools",
      mitigation: "Agent-facing tools first (lower risk); include state filing support; phased book migration",
    },
    retail: {
      level: "Medium",
      factors: "POS migration 18-24mo, loyalty program data migration, gift card float obligations, store-by-store rollout",
      timeline: "3-6 months for back-office, 12-24 months for POS",
      mitigation: "Pilot in 5-10 stores; parallel run with old system; loyalty points portability guarantee",
    },
    technology: {
      level: "Medium-Low",
      factors: "API integration remapping, data export/import, team retraining, workflow automation rebuild",
      timeline: "1-3 months for SaaS tools, 3-6 months for infrastructure",
      mitigation: "Migration toolkit; API compatibility layer; dedicated CSM for first 90 days",
    },
    government: {
      level: "Very High",
      factors: "FAR/DFARS compliance, FedRAMP authorization, ATO process, IDIQ/BPA vehicle alignment, protest risk",
      timeline: "6-24 months depending on contract vehicle",
      mitigation: "Existing contract vehicle (GSA, SEWP, OASIS+); FedRAMP authorized before approach; incumbent protest strategy",
    },
  },

  // ── CHAMPION IDENTIFICATION ──
  championProfile: {
    definition: "The person who says 'how do we make this happen?' not 'let me think about it.' They have organizational capital, personal motivation, and access to the economic buyer.",
    identifySignals: [
      "Asked about implementation timeline (they're already thinking past the decision)",
      "Shared internal pain unprompted (they've been building a case)",
      "Named other stakeholders who need to be involved (they know the buying process)",
      "Asked 'can you send me something I can share with my team?' (they want ammunition)",
      "Mentioned a specific deadline or event driving urgency (they have a window)",
      "Volunteered what the incumbent does poorly (they've been taking notes)",
    ],
    notAChampion: [
      "Says 'interesting, let me think about it' (evaluator, not advocate)",
      "Asks only about features and pricing (comparison shopper, not champion)",
      "Can't name the economic buyer or decision process (doesn't have organizational access)",
      "Has no personal stake in the outcome (won't fight for it internally)",
    ],
    equipThem: "Give the champion the internal business case they need to sell upward. This means: ROI calculator, competitive comparison, implementation timeline, risk mitigation plan, and a reference customer they can call directly.",
  },

  // ── PROOF POINT FRAMING ──
  proofFraming: {
    rule: "Never say 'companies switched FROM [competitor].' Say 'companies like yours chose us BECAUSE [specific outcome].' The first frames the competitor as the protagonist. The second frames the BUYER's outcome as the protagonist.",
    templates: [
      "'[Customer] was spending [X hours/dollars] on [workaround]. After deploying [our product], they [specific measurable outcome] in [timeframe].'",
      "'When [similar company] evaluated their options, the deciding factor was [specific differentiator]. Here's what they told us 90 days in: [quote].'",
      "'We've worked with [N] companies in [their industry] who faced the same decision. The pattern we see is [insight about what triggers the switch].'",
    ],
    avoid: [
      "'[Competitor] can't do X' — the buyer chose them; you're questioning their judgment",
      "'We're better because...' — better is subjective; specific outcomes are not",
      "'Everyone's switching to us' — sounds desperate, not confident",
      "Feature-by-feature comparison charts — the incumbent always has more checkmarks on paper",
    ],
  },

  // ── DISCOVERY QUESTIONS FOR DISPLACEMENT ──
  discoveryQuestions: {
    entryPoints: [
      "When does your current contract come up for renewal? (timing)",
      "If you could change one thing about how [process] works today, what would it be? (pain)",
      "Who else in the org has an opinion on this? (buying committee)",
      "What would need to be true for you to seriously evaluate alternatives? (threshold)",
      "Has anything changed in the last 6 months that made this more urgent? (trigger event)",
    ],
    route: [
      "What does the decision process look like for something like this? (procurement path)",
      "Have you evaluated alternatives before? What happened? (switching history)",
      "If we could prove [specific outcome] in a 30-day pilot, would that be enough to justify a deeper conversation? (commitment test)",
      "Who would need to sign off? (economic buyer identification)",
    ],
  },
};

// Compact injection for prompts (hypothesis Route stage, post-call routing)
export const DISPLACEMENT_INJECTION = `DISPLACEMENT INTELLIGENCE: ${DISPLACEMENT_PLAYBOOK.summary}
DISPLACE when: ${DISPLACEMENT_PLAYBOOK.strategyFramework.displaceWhen.slice(0,4).join("; ")}.
LAND ADJACENT when: ${DISPLACEMENT_PLAYBOOK.strategyFramework.landAdjacentWhen.slice(0,3).join("; ")}.
CHAMPION SIGNALS: ${DISPLACEMENT_PLAYBOOK.championProfile.identifySignals.slice(0,3).join("; ")}.
PROOF FRAMING: ${DISPLACEMENT_PLAYBOOK.proofFraming.rule}`;

// Discovery injection for Entry Points + Route stages
export const DISPLACEMENT_DISCOVERY = `DISPLACEMENT DISCOVERY:
Entry Points: ${DISPLACEMENT_PLAYBOOK.discoveryQuestions.entryPoints.slice(0,3).join(" | ")}
Route: ${DISPLACEMENT_PLAYBOOK.discoveryQuestions.route.slice(0,2).join(" | ")}`;
