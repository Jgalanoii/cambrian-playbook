// src/data/negotiationFrameworks.js
// Negotiation and influence frameworks applied to B2B sales
// Stage mapping and injection strings: src/data/prompts/negotiationInjections.js
// Last updated: April 15, 2026

export const FRAMEWORK_STAGE_MAP = {
  S3_Accounts:      ["artOfWar", "intelligentInvestor"],
  S4_AccountReview: ["intelligentInvestor"],
  S5_Brief:         ["cialdini", "artOfWar", "challenger"],
  S6_Hypothesis:    ["jolt", "cialdini", "camp", "fisherUry"],
  S7_InCall:        ["voss", "crucialConversations", "fisherUry"],
  S8_PostCall:      ["fisherUry", "negotiationGenius", "intelligentInvestor"],
};

export const VOSS_TACTICS = {
  name: "Never Split the Difference — Chris Voss (FBI)",
  stage: "S7 In-Call",
  description: "Hostage negotiation techniques adapted for B2B sales",
  tactics: [
    {
      name: "Tactical Empathy",
      definition: "Understand and articulate the other side's perspective before advancing your own",
      salesApplication: "Reflect back exactly what the prospect said about their pain — word for word.",
      example: "It sounds like your team is spending 30+ hours a week on manual reconciliation and it's creating real pressure heading into Q3.",
      stage: "reality"
    },
    {
      name: "Mirroring",
      definition: "Repeat the last 1-3 words someone said as a question to encourage elaboration",
      salesApplication: "When a prospect says something important, mirror it back. They will almost always expand.",
      example: "Prospect: 'We've tried to fix this before.' You: '...tried to fix it before?'",
      stage: "reality"
    },
    {
      name: "Labeling",
      definition: "Identify and name the emotion or dynamic you're observing",
      salesApplication: "Name the hesitation, frustration, or concern you sense — it defuses it and builds trust",
      example: "'It seems like there's some concern about whether this would actually stick this time.' Then go silent.",
      stage: "impact"
    },
    {
      name: "Calibrated Questions",
      definition: "Open-ended 'How' and 'What' questions that give the other side the illusion of control",
      salesApplication: "Never ask yes/no questions in discovery. Always 'How' or 'What'.",
      examples: [
        "What does success look like for your team in 90 days?",
        "How does this decision typically get made here?",
        "What would need to be true for you to move forward?",
        "How would that affect your Q4 numbers?",
        "What's the biggest risk you see with staying with your current approach?"
      ],
      stage: "vision"
    },
    {
      name: "Accusation Audit",
      definition: "List every negative thing the prospect might think about you before they say it",
      salesApplication: "Start difficult conversations by naming the elephants in the room",
      example: "'You're probably thinking this is going to be another vendor pitch that doesn't understand your business. Fair.'",
      stage: "entryPoints"
    },
    {
      name: "No-Oriented Questions",
      definition: "Ask questions designed to get a 'No' — it makes prospects feel safe and in control",
      salesApplication: "Instead of 'Is now a good time?' ask 'Is now a bad time?'",
      examples: [
        "Is this a ridiculous idea?",
        "Have you given up on solving this?",
        "Is it crazy to think we could get this done by Q3?"
      ],
      stage: "route"
    }
  ]
};

export const FISHER_URY = {
  name: "Getting to Yes — Fisher & Ury (Harvard)",
  stage: "S7 In-Call + S8 Post-Call",
  description: "Principled negotiation for win-win outcomes",
  tactics: [
    {
      name: "Separate People from Problem",
      salesApplication: "When a prospect pushes back hard, acknowledge their perspective before defending your position",
      example: "'I completely understand why you'd see it that way. Let's look at the data together.'"
    },
    {
      name: "Focus on Interests Not Positions",
      salesApplication: "When a prospect says 'we need 40% discount' — that's a position. The interest is budget pressure or risk reduction.",
      example: "'Help me understand what's driving that number — is it budget ceiling, or is it about managing risk on a new vendor?'"
    },
    {
      name: "Invent Options for Mutual Gain",
      salesApplication: "When stuck on price or scope: phased rollout, pilot, success-based pricing",
      example: "'What if we started with just the compliance module at $30K, and you had 60 days to see results before committing to the full platform?'"
    },
    {
      name: "BATNA",
      salesApplication: "Your BATNA is other deals in pipeline. Prospect's BATNA is status quo or a competitor. Make the cost of inaction vivid.",
    },
    {
      name: "Objective Criteria",
      salesApplication: "When price is challenged, reference benchmarks not feelings",
      example: "'Gartner puts the average spend for this category at $85K for your company size — we're below that.'"
    }
  ]
};

export const CIALDINI_PRINCIPLES = {
  name: "Influence — Robert Cialdini",
  stage: "S5 Brief + S6 Hypothesis",
  description: "Six psychological principles that drive agreement",
  principles: [
    { name: "Reciprocity", salesApplication: "Give value before asking for anything — insight, benchmark, case study unprompted" },
    { name: "Commitment & Consistency", salesApplication: "Get small yeses early. Each agreement makes the next easier." },
    { name: "Social Proof", salesApplication: "Name similar companies who solved this same problem. Specificity matters." },
    { name: "Authority", salesApplication: "Establish expertise early — data, specific industry knowledge, named clients" },
    { name: "Liking", salesApplication: "Find genuine common ground. Mirror their language and pace." },
    { name: "Scarcity", salesApplication: "Real deadlines only — regulatory dates, budget cycles, competitive threat. Never fake urgency." }
  ]
};

export const ART_OF_WAR_SALES = {
  name: "The Art of War — Sun Tzu (adapted for B2B sales)",
  stage: "S3 Fit Scoring + S5 Brief",
  description: "Ancient military strategy applied to competitive selling",
  principles: [
    { principle: "Know yourself and know your enemy", salesApplication: "Before every call: know your BATNA, their BATNA, their alternatives, their budget cycle, your own weaknesses" },
    { principle: "Supreme excellence: subdue without fighting", salesApplication: "Win by making the status quo untenable — don't attack competitors directly" },
    { principle: "Be like water — adapt to the terrain", salesApplication: "Match pitch to buyer's Moore adoption profile. Innovator=vision. Early Majority=proof and risk reduction." },
    { principle: "Foreknowledge from people, not spirits", salesApplication: "Live intelligence beats any brief. What did you learn in the last 48 hours about this account?" },
    { principle: "Attack where unprepared", salesApplication: "Find the underserved stakeholder. Go around the gatekeeper to the person who feels the pain daily." },
    { principle: "Speed is the essence of war", salesApplication: "Long sales cycles kill deals. Compress with pilots, phased starts, small first wins." }
  ]
};

export const INTELLIGENT_INVESTOR_SALES = {
  name: "The Intelligent Investor — Benjamin Graham (adapted)",
  stage: "S4 Account Review + S8 Post-Call",
  description: "Value investing principles applied to deal qualification",
  principles: [
    { name: "Margin of Safety", salesApplication: "Only pursue deals where value delivered is 3-5x the price. If you can't show that math, don't pitch." },
    { name: "Mr. Market", salesApplication: "Prospects' stated budget is emotional. Help them see the rational value case separately from price." },
    { name: "Investment vs Speculation", salesApplication: "Position your solution as an investment with compounding returns, not a cost to minimize." },
    { name: "Know What You Own", salesApplication: "Disqualify fast if the prospect doesn't understand the problem you solve. Education is a long cycle." }
  ]
};

export const CRUCIAL_CONVERSATIONS = {
  name: "Crucial Conversations — Patterson, Grenny, McMillan, Switzler",
  stage: "S7 In-Call",
  description: "Managing high-stakes, emotionally charged discussions",
  tactics: [
    { name: "Start with Heart", salesApplication: "Before a difficult call: write down the ONE outcome you want. Don't let emotion change it mid-call." },
    {
      name: "Watch for Safety Issues",
      signals: ["Long pauses", "Short clipped answers", "Sudden aggression", "Topic changes"],
      salesApplication: "If prospect goes quiet or gets aggressive, step out of content and restore safety first",
      response: "Name what you're observing: 'It seems like I may have said something that didn't land right — can we step back?'"
    },
    { name: "STATE My Path", salesApplication: "Share facts, Tell your story, Ask for their path, Talk tentatively, Encourage testing" },
    { name: "Explore Their Path", salesApplication: "Ask, Mirror, Paraphrase, Prime — understand before being understood. Most reps respond too fast." }
  ]
};

export const JOLT_EFFECT = {
  name: "JOLT Effect — Dixon & McKenna",
  stage: "S6 Hypothesis",
  description: "Indecision kills 40-60% of B2B deals. FOMU (Fear of Messing Up) beats FOMO.",
  steps: [
    { letter: "J", action: "Judge the indecision", description: "Name the FOMU explicitly — 'It sounds like the risk of getting this wrong is scarier than not solving it'" },
    { letter: "O", action: "Offer your recommendation", description: "Give ONE clear POV — not options. Options create indecision." },
    { letter: "L", action: "Limit the exploration", description: "Narrow scope to make decision smaller — 'Let's start with just X'" },
    { letter: "T", action: "Take risk off the table", description: "Pilot, SLA, phased rollout, reference customer, money-back" }
  ]
};

export const CAMP_NEGOTIATION = {
  name: "Start with No — Jim Camp",
  stage: "S6 Hypothesis",
  description: "System of decisions, not emotions — the buyer should feel in control by saying No before they say Yes",
  tactics: [
    { name: "Mission & Purpose", salesApplication: "Define the mission for THEIR world, not yours. Your pitch should describe their problem, not your product." },
    { name: "Let Them Say No", salesApplication: "Give permission to say no early: 'If this doesn't make sense for you, just say so — no hard feelings.' Paradoxically increases trust and engagement." },
    { name: "No Neediness", salesApplication: "Never show that you need the deal. Neediness kills deals faster than price. Have a full pipeline — or act like you do." },
    { name: "Decisions, Not Emotions", salesApplication: "When a prospect gets emotional (excited or anxious), slow down. Decisions made from emotion reverse. Guide them back to logic." },
    { name: "Blank Slate", salesApplication: "Ask questions you already know the answer to. Let them tell you their problem — they'll own the solution more when it comes from their mouth." }
  ]
};

export const NEGOTIATION_GENIUS = {
  name: "Negotiation Genius — Deepak Malhotra & Max Bazerman (Harvard)",
  stage: "S8 Post-Call",
  description: "Systematic negotiation for complex, multi-party B2B deals",
  tactics: [
    { name: "Investigative Negotiation", salesApplication: "Before negotiating terms, investigate their constraints. The prospect's demands often hide flexible constraints you can solve creatively." },
    { name: "ZOPA Mapping", salesApplication: "Map the Zone of Possible Agreement: what's the least you'd accept, what's the most they'd pay? If no overlap exists, restructure the deal (phased, pilot, success-based)." },
    { name: "Contingency Contracts", salesApplication: "When you disagree on projections: 'If we hit X metric in 90 days, the full contract activates. If not, you walk.' Eliminates risk objections." },
    { name: "Post-Settlement Settlement", salesApplication: "After reaching agreement, ask: 'Is there a way to make this even better for both of us?' Often surfaces creative value neither side considered." },
    { name: "Acknowledge Their Constraints", salesApplication: "Don't fight procurement. Say: 'I understand you need to show the board 3 bids. Let me help you build the comparison so ours looks fair, not rigged.'" }
  ]
};

export const CHALLENGER_FRAMEWORK = {
  name: "Challenger Customer — CEB/Gartner",
  stage: "S5 Brief",
  mobilizer: {
    definition: "Only 13% of stakeholders are Mobilizers — they ask how to make it happen",
    identify: "They ask 'how do we make this happen?' not 'interesting, let me think about it'",
    notMobilizers: ["Talkers — share info but can't move deals", "Blockers — actively oppose change"],
    talkerTactics: "Talkers are friendly but lack authority. Use them for intel gathering, NOT as champions. Ask: 'Who else needs to be convinced?' to identify the real Mobilizer.",
    blockerTactics: "Blockers fear change or loss of control. Don't fight them — reframe your solution as protecting their domain: 'This actually strengthens your team's position by...'",
  },
  teachingAngle: "Challenge a widely-held assumption about their industry using data or a case study they haven't seen"
};

export const ALL_FRAMEWORKS = {
  voss: VOSS_TACTICS,
  fisherUry: FISHER_URY,
  cialdini: CIALDINI_PRINCIPLES,
  artOfWar: ART_OF_WAR_SALES,
  intelligentInvestor: INTELLIGENT_INVESTOR_SALES,
  crucialConversations: CRUCIAL_CONVERSATIONS,
  jolt: JOLT_EFFECT,
  challenger: CHALLENGER_FRAMEWORK,
  camp: CAMP_NEGOTIATION,
  negotiationGenius: NEGOTIATION_GENIUS,
};
