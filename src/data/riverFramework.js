// RIVER Framework — Cambrian Catalyst proprietary sales discovery methodology.
// Reality → Impact → Vision → Entry Points → Route
// Each stage maps to a phase of the sales conversation, from diagnosis (R)
// through quantification (I), future-state painting (V), stakeholder mapping (E),
// to deal routing and next steps (R). Gates qualify the deal at each stage.
// Discovery prompts capture intel in the prospect's own words.

export const RIVER_STAGES = [
  {id:"R1",letter:"R",label:"Reality",sub:"Current state — where are they broken?",
    gates:[
      {id:"r1_current",q:"How is the prospect handling this problem today?",options:["Manual / spreadsheets / no system","Legacy tool they've outgrown","Patchwork of multiple vendors","Competitor solution underperforming","No process at all"]},
      {id:"r1_urgency",q:"What's driving urgency to solve this now?",options:["Executive mandate / top-down pressure","Recent failure or incident","Growth has exposed the gap","Competitive pressure","Budget cycle opening up","No clear urgency yet"]},
      {id:"r1_mustHave",q:"Must-have or nice-to-have? (Ellis 40% Rule)",options:["Must-have — they'd be very disappointed without a solution","Strong preference — would find workarounds","Nice-to-have — helpful but not urgent","Unclear — needs more discovery"]},
    ],
    discovery:[
      {id:"r_pain",label:"In their own words, what is the core pain?",hint:"Capture exact language — use verbatim in proposal"},
      {id:"r_tried",label:"What have they already tried? Why did it fail?",hint:"Understand the graveyard before pitching"},
    ],
    talkTrack:'"Before I share anything about us — help me understand what this looks like for your team today. Walk me through it."',
    objections:[
      {q:"We already have something in place",a:'"What\'s working well — and where does it fall short? I want to understand the gap before assuming we\'re a fit."'},
      {q:"Not sure this is a priority",a:'"What would need to change for it to become one? Is there an event or timeline that would accelerate things?"'},
    ]},
  {id:"I",letter:"I",label:"Impact",sub:"What does this cost them — in dollars, time, people?",
    gates:[
      {id:"i_cost",q:"Have they quantified the cost of this problem?",options:["Yes — hard numbers","Partial — sense of it but not exact","No — haven't calculated it","Don't think it's costing much"]},
      {id:"i_owner",q:"Who feels this pain most acutely?",options:["C-Suite / Executive","Revenue / Sales leadership","Operations / HR leadership","Finance / CFO","End users / frontline","Multiple stakeholders equally"]},
    ],
    discovery:[
      {id:"i_dollars",label:"Measurable cost of inaction? (revenue, time, headcount, churn)",hint:"Push for a number — even rough is better than nothing"},
      {id:"i_softer",label:"Softer costs? (morale, reputation, missed opportunity)",hint:"These often matter more to champions than hard numbers"},
    ],
    talkTrack:'"When this breaks down, what actually happens downstream? Has anyone put a number on it yet?"',
    objections:[
      {q:"We don't know what it's costing us",a:'"Let\'s build that together. Headcount × time lost — what does that math look like?"'},
      {q:"The cost seems manageable",a:'"What would make it unmanageable? What\'s your threshold?"'},
    ]},
  {id:"V",letter:"V",label:"Vision",sub:"What does success look like — and who owns it?",
    gates:[
      {id:"v_outcome",q:"Can they articulate success in 90 days?",options:["Yes — specific and measurable","Somewhat — directional not specific","No — not defined yet","Different definitions across stakeholders"]},
      {id:"v_champion",q:"Is there a clear internal champion?",options:["Yes — identified and motivated","Potential — needs equipping","No champion yet","Multiple potential champions"]},
    ],
    discovery:[
      {id:"v_success",label:"In their words: what does a win look like at Day 30, 90, Year 1?",hint:"This becomes your proposal headline — use their exact language"},
      {id:"v_champion_detail",label:"Who is the champion? What do they personally win if this succeeds?",hint:"Champions need a personal win, not just an organizational one"},
    ],
    talkTrack:'"If this were working the way it should — what would that look like for your team week to week?"',
    objections:[
      {q:"Not sure what success looks like",a:'"That\'s the most important thing to define before you sign anything. Can we spend 10 minutes on that?"'},
      {q:"Different stakeholders want different things",a:'"Who has final say on what success means? Is there a shared outcome everyone agrees on?"'},
    ]},
  {id:"E",letter:"E",label:"Entry Points",sub:"Who decides, who influences, what triggers a yes?",
    gates:[
      {id:"e_buyer",q:"Have you identified the economic buyer?",options:["Yes — met or confirmed","Probable — know the role","No — working through layers","Unclear org structure"]},
      {id:"e_threading",q:"How many stakeholders are engaged? (Churn predictor)",options:["3-5 — ideal range","1-2 — single-threaded (high churn risk)","6-7 — manageable with named champion","8+ without named owner — low close probability","Unknown"]},
      {id:"e_process",q:"What does their decision process look like?",options:["Clear — defined steps and timeline","Informal — champion can move it","Committee / consensus required","RFP or formal procurement","Unknown"]},
    ],
    discovery:[
      {id:"e_stakeholders",label:"Map the buying committee: who approves, influences, can kill it?",hint:"Name every stakeholder — flag the ones you haven't met"},
      {id:"e_timeline",label:"Realistic decision timeline? Is there a forcing function?",hint:"Budget cycle, renewal date, board review — find the date"},
    ],
    talkTrack:'"Who else feels this the most? And how do decisions like this typically get made here?"',
    objections:[
      {q:"Need to get more people involved",a:'"Who are the right people? I\'d rather get them in early. Can we set up a 30-min call this week?"'},
      {q:"This will go through procurement",a:'"What does that process look like? I want to make sure we have everything they need ready."'},
    ]},
  {id:"R2",letter:"R",label:"Route",sub:"Fastest path to yes — and a successful Day 1",
    gates:[
      {id:"r2_fit",q:"Your honest deal assessment?",options:["Strong fit — ready to advance","Good fit — a few gaps","Uncertain — need more discovery","Weak fit — misalignment","Not a fit"]},
      {id:"r2_blocker",q:"Single biggest risk to this deal?",options:["No internal champion","Budget not confirmed","Competitor entrenched","Timeline mismatch","Stakeholder misalignment","Technical / compliance barrier","No compelling event"]},
    ],
    discovery:[
      {id:"r2_next",label:"Single most important next step?",hint:"Named action + named person + named date"},
      {id:"r2_onboard",label:"What does a successful onboarding look like for them?",hint:"This becomes your close framing and CSM handoff brief"},
    ],
    talkTrack:'"Based on what you\'ve shared, here\'s what I\'d suggest as a starting point — does that feel right from where you sit?"',
    objections:[
      {q:"Not ready to move forward",a:'"What would need to change? Is this timing or something more fundamental?"'},
      {q:"Need to think about it",a:'"What specifically? If I can help you work through it now, it might save us both a few weeks."'},
    ]},
];
