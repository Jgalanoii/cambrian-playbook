// src/data/negotiationFrameworks.js
// Negotiation and influence frameworks applied to B2B sales
// Referenced in: In-Call navigator, Brief generation, Post-Call synthesis

export const VOSS_TACTICS = {
  name: "Never Split the Difference — Chris Voss (FBI)",
  description: "Hostage negotiation techniques adapted for B2B sales",
  tactics: [
    {
      name: "Tactical Empathy",
      definition: "Understand and articulate the other side's perspective before advancing your own",
      salesApplication: "Before presenting your solution, reflect back exactly what the prospect said about their pain. Word for word.",
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
      name: "The Accusation Audit",
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
    },
    {
      name: "Deadline and Anchoring",
      definition: "Use extreme anchors to shift the midpoint of negotiation in your favor",
      salesApplication: "Never be the first to name a number. When you must, anchor high with a range.",
      example: "Our engagements typically run between $80K-$150K depending on scope — let's figure out where you fit.",
      stage: "route"
    }
  ]
};

export const FISHER_URY = {
  name: "Getting to Yes — Fisher & Ury (Harvard)",
  description: "Principled negotiation for win-win outcomes",
  tactics: [
    {
      name: "Separate People from Problem",
      definition: "Attack the problem, not the person. Protect the relationship while solving the issue.",
      salesApplication: "When a prospect pushes back hard, acknowledge their perspective before defending your position",
      example: "'I completely understand why you'd see it that way. Let's look at the data together.'"
    },
    {
      name: "Focus on Interests Not Positions",
      definition: "Dig beneath stated positions to find the underlying interests driving them",
      salesApplication: "When a prospect says 'we need a 40% discount' — that's a position. The interest is probably budget pressure or risk reduction.",
      example: "'Help me understand what's driving that number — is it budget ceiling, or is it about managing risk on a new vendor?'"
    },
    {
      name: "Invent Options for Mutual Gain",
      definition: "Brainstorm multiple options before deciding. Expand the pie before dividing it.",
      salesApplication: "When stuck on price or scope, invent new options: phased rollout, pilot, success-based pricing",
      example: "'What if we started with just the compliance module at $30K, and you had 60 days to see results before committing to the full platform?'"
    },
    {
      name: "BATNA — Best Alternative to Negotiated Agreement",
      definition: "Know your walkaway point. Strengthen your BATNA before negotiating.",
      salesApplication: "Your BATNA is other deals in pipeline. Prospect's BATNA is status quo or a competitor. Know both.",
      example: "If their BATNA is 'do nothing', make the cost of inaction vivid and measurable."
    },
    {
      name: "Insist on Objective Criteria",
      definition: "Use external standards (market rates, benchmarks, industry data) to resolve disagreements",
      salesApplication: "When price is challenged, reference benchmarks not feelings",
      example: "'Gartner puts the average spend for this category at $85K for your company size — we're below that.'"
    }
  ]
};

export const CIALDINI_PRINCIPLES = {
  name: "Influence — Robert Cialdini",
  description: "Six psychological principles that drive agreement",
  principles: [
    {
      name: "Reciprocity",
      definition: "People feel obligated to return favors",
      salesApplication: "Give value before asking for anything. Share an insight, a benchmark, a relevant case study — unprompted.",
      briefHook: "Lead with a free insight specific to their business before asking for time or money"
    },
    {
      name: "Commitment & Consistency",
      definition: "People want to be consistent with their past statements and commitments",
      salesApplication: "Get small yeses early. Each agreement makes the next easier.",
      briefHook: "Start with 'would you agree that [obvious truth about their industry]?' before your main pitch"
    },
    {
      name: "Social Proof",
      definition: "People follow the actions of others in uncertain situations",
      salesApplication: "Name similar companies who solved this same problem with you. Specificity matters.",
      briefHook: "Lead with a named customer in their exact industry and size bracket"
    },
    {
      name: "Authority",
      definition: "People defer to credible experts",
      salesApplication: "Establish expertise early — data, specific industry knowledge, named clients",
      briefHook: "Open with a precise statistic about their industry that most people don't know"
    },
    {
      name: "Liking",
      definition: "People agree with people they like and who are similar to them",
      salesApplication: "Find genuine common ground. Mirror their language and pace.",
      briefHook: "Reference something specific about their company that shows you did real research"
    },
    {
      name: "Scarcity",
      definition: "People want what is rare or becoming unavailable",
      salesApplication: "Real deadlines and constraints — not fake urgency. Regulatory deadlines, contract windows, competitive threat.",
      briefHook: "Frame the window: 'Companies that solved this before [regulatory date] had 3x better outcomes'"
    }
  ]
};

export const ART_OF_WAR_SALES = {
  name: "The Art of War — Sun Tzu (adapted for B2B sales)",
  description: "Ancient strategy applied to competitive sales",
  principles: [
    {
      chapter: "Laying Plans",
      principle: "Know yourself and know your enemy",
      salesApplication: "Before every call: know your BATNA, their BATNA, their alternatives, their budget cycle, and your own weaknesses",
      briefHook: "watchOuts section — flag where competitors are entrenched and what to avoid"
    },
    {
      chapter: "Attack by Stratagem",
      principle: "Supreme excellence: subdue the enemy without fighting",
      salesApplication: "Win by making the status quo untenable, not by attacking competitors directly",
      briefHook: "Make the cost of inaction so vivid that switching is the obvious choice"
    },
    {
      chapter: "Tactical Positioning",
      principle: "Be like water — adapt your form to the terrain",
      salesApplication: "Match your pitch to the buyer's adoption profile. Innovator = vision. Early Majority = proof and risk reduction.",
      briefHook: "Moore adoption profile determines your entire approach"
    },
    {
      chapter: "The Use of Intelligence",
      principle: "Foreknowledge cannot be elicited from spirits — it must be obtained from people",
      salesApplication: "Live intelligence beats any brief. What did you learn in the last 48 hours about this account?",
      briefHook: "recentSignals section — treat as battlefield intelligence, act on it immediately"
    },
    {
      chapter: "Weaknesses and Strengths",
      principle: "Attack where the enemy is unprepared, appear where you are not expected",
      salesApplication: "Find the underserved stakeholder. Go around the gatekeeper to the person who feels the pain daily.",
      briefHook: "keyContacts section — the VP/Director, not the C-suite, is your entry point"
    },
    {
      chapter: "Waging War",
      principle: "Avoid prolonged campaigns. Speed is the essence of war.",
      salesApplication: "Long sales cycles kill deals. Compress timelines with pilots, phased starts, and small first wins.",
      briefHook: "Route stage: always recommend the smallest possible first step that creates momentum"
    }
  ]
};

export const INTELLIGENT_INVESTOR_SALES = {
  name: "The Intelligent Investor — Benjamin Graham (adapted)",
  description: "Value investing principles applied to deal qualification",
  principles: [
    {
      name: "Margin of Safety",
      definition: "Only invest when price is significantly below intrinsic value",
      salesApplication: "Only pursue deals where the value you deliver is 3-5x the price. If you can't show that math, don't pitch.",
      stage: "impact"
    },
    {
      name: "Mr. Market",
      definition: "Market price is emotional, intrinsic value is rational",
      salesApplication: "Prospects' stated budget is emotional. Help them see the rational value case separately from the price discussion.",
      stage: "vision"
    },
    {
      name: "Long-term vs Speculation",
      definition: "Investment is about long-term value. Speculation is about short-term price.",
      salesApplication: "Position your solution as an investment with compounding returns, not a cost to be minimized.",
      stage: "route"
    },
    {
      name: "Know What You Own",
      definition: "Never buy what you don't understand",
      salesApplication: "Disqualify fast if the prospect doesn't understand the problem you solve. Education is a long cycle.",
      stage: "reality"
    }
  ]
};

export const CRUCIAL_CONVERSATIONS = {
  name: "Crucial Conversations — Patterson, Grenny, McMillan, Switzler",
  description: "Managing high-stakes, emotionally charged discussions",
  tactics: [
    {
      name: "Start with Heart",
      definition: "Know what you really want from this conversation before it starts",
      salesApplication: "Before a difficult call: write down the ONE outcome you want. Don't let emotion change it mid-call.",
    },
    {
      name: "Watch for Safety Issues",
      definition: "When people feel unsafe they go to silence or violence",
      salesApplication: "If a prospect goes quiet or gets aggressive, step out of the content and restore safety first",
      signals: ["Long pauses", "Short clipped answers", "Sudden aggression", "Topic changes"],
      response: "Name what you're observing: 'It seems like I may have said something that didn't land right — can we step back?'"
    },
    {
      name: "STATE My Path",
      definition: "Share facts, Tell your story, Ask for their path, Talk tentatively, Encourage testing",
      salesApplication: "When delivering bad news or difficult feedback to a prospect",
      example: "'The data shows your current approach costs $2M/year in rework. That's what I'm seeing — what's your read on that number?'"
    },
    {
      name: "Explore Their Path",
      definition: "Ask, Mirror, Paraphrase, Prime — understand before being understood",
      salesApplication: "When a prospect gives an objection, explore it fully before responding. Most reps respond too fast.",
    }
  ]
};

export const ALL_FRAMEWORKS = {
  voss: VOSS_TACTICS,
  fisherUry: FISHER_URY,
  cialdini: CIALDINI_PRINCIPLES,
  artOfWar: ART_OF_WAR_SALES,
  intelligentInvestor: INTELLIGENT_INVESTOR_SALES,
  crucialConversations: CRUCIAL_CONVERSATIONS
};
