import { useState, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #FAFAF8; color: #1a1a18; min-height: 100vh; }

.app { min-height: 100vh; display: flex; flex-direction: column; }

/* HEADER */
.header { background: #fff; border-bottom: 1px solid #E8E6DF; padding: 0 32px; height: 58px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 200; }
.logo { font-family: 'Lora', serif; font-size: 17px; color: #1a1a18; }
.logo span { color: #8B6F47; }
.phase-nav { display: flex; align-items: center; gap: 0; }
.phase-item { display: flex; align-items: center; gap: 7px; padding: 0 14px; font-size: 11px; font-weight: 600; color: #bbb; letter-spacing: 0.5px; text-transform: uppercase; cursor: default; white-space: nowrap; transition: color 0.2s; }
.phase-item.active { color: #1a1a18; }
.phase-item.done { color: #8B6F47; cursor: pointer; }
.phase-item.done:hover { color: #7A6040; }
.phase-num { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; transition: all 0.2s; }
.phase-item.done .phase-num { background: #8B6F47; border-color: #8B6F47; color: #fff; }
.phase-item.active .phase-num { background: #1a1a18; border-color: #1a1a18; color: #fff; }
.phase-div { width: 28px; height: 1px; background: #E8E6DF; }
.header-right { display: flex; align-items: center; gap: 10px; }
.live-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #2E6B2E; background: #EEF5EE; padding: 3px 10px; border-radius: 20px; }
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: #2E6B2E; animation: blink 1.2s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* LAYOUT */
.page { max-width: 920px; margin: 0 auto; padding: 40px 32px 80px; width: 100%; }
.page-title { font-family: 'Lora', serif; font-size: 26px; font-weight: 500; margin-bottom: 6px; }
.page-sub { font-size: 14px; color: #777; line-height: 1.65; margin-bottom: 36px; max-width: 600px; }

/* RIVER BADGE */
.river-badge { display: inline-flex; align-items: center; gap: 6px; background: #1a1a18; border-radius: 8px; padding: 6px 14px; margin-bottom: 32px; }
.river-letter { font-family: 'Lora', serif; font-size: 13px; font-weight: 600; color: #8B6F47; }
.river-sep { color: #444; font-size: 11px; }
.river-word { font-size: 11px; color: rgba(255,255,255,0.5); }

/* CARDS */
.card { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 22px; margin-bottom: 16px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; }
.card-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 10px; border-radius: 20px; }
.badge-r { background: #FDE8E8; color: #9B2C2C; }
.badge-i { background: #FEF3E2; color: #92540A; }
.badge-v { background: #EEF5EE; color: #276227; }
.badge-e { background: #EEF2F8; color: #3A5A8C; }
.badge-r2 { background: #F5EEF5; color: #6B3A7A; }
.badge-prep { background: #F3EDE6; color: #7A5C30; }

/* FORM ELEMENTS */
.field-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.field-label .req { color: #8B6F47; }
input[type=text], select, textarea { width: 100%; padding: 9px 12px; border: 1px solid #E8E6DF; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1a1a18; background: #FAFAF8; outline: none; transition: border-color 0.15s; resize: vertical; }
input[type=text]:focus, select:focus, textarea:focus { border-color: #8B6F47; background: #fff; }
.field-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

/* BUTTONS */
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; border: none; line-height: 1; white-space: nowrap; }
.btn:disabled { opacity: 0.4; cursor: default; }
.btn-primary { background: #1a1a18; color: #fff; }
.btn-primary:hover:not(:disabled) { background: #333; }
.btn-secondary { background: transparent; border: 1.5px solid #C8C4BB; color: #1a1a18; }
.btn-secondary:hover:not(:disabled) { border-color: #8B6F47; color: #8B6F47; }
.btn-gold { background: #8B6F47; color: #fff; }
.btn-gold:hover:not(:disabled) { background: #7A6040; }
.btn-green { background: #2E6B2E; color: #fff; }
.btn-green:hover:not(:disabled) { background: #245424; }
.btn-lg { padding: 13px 26px; font-size: 14px; }
.btn-sm { padding: 6px 13px; font-size: 12px; }
.actions-row { display: flex; gap: 10px; margin-top: 28px; align-items: center; flex-wrap: wrap; }

/* RIVER STAGE NAVIGATOR */
.river-nav { display: flex; gap: 0; margin-bottom: 0; border-bottom: 1px solid #E8E6DF; background: #FAFAF8; overflow-x: auto; flex-shrink: 0; }
.river-tab { padding: 11px 16px; font-size: 11px; font-weight: 600; cursor: pointer; color: #bbb; border-bottom: 2px solid transparent; white-space: nowrap; background: none; border-top: none; border-left: none; border-right: none; border-bottom: 2px solid transparent; transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; }
.river-tab:hover { color: #1a1a18; }
.river-tab.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #fff; }
.river-tab.filled { color: #2E6B2E; }
.river-tab.filled.active { color: #8B6F47; }
.fill-dot { width: 6px; height: 6px; border-radius: 50%; background: #2E6B2E; flex-shrink: 0; }

/* SPLIT LAYOUT FOR IN-CALL */
.call-layout { display: flex; flex: 1; height: calc(100vh - 58px); overflow: hidden; }
.call-left { width: 55%; border-right: 1px solid #E8E6DF; display: flex; flex-direction: column; background: #fff; overflow: hidden; }
.call-right { width: 45%; display: flex; flex-direction: column; background: #FAFAF8; overflow: hidden; }
.panel-header { padding: 14px 20px; border-bottom: 1px solid #E8E6DF; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: #fff; }
.panel-title { font-family: 'Lora', serif; font-size: 14px; font-weight: 500; }
.panel-body { flex: 1; overflow-y: auto; padding: 18px 20px; }

/* RIVER SECTION */
.river-section { margin-bottom: 6px; }
.river-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.river-icon { width: 32px; height: 32px; border-radius: 8px; background: #1a1a18; display: flex; align-items: center; justify-content: center; font-family: 'Lora', serif; font-size: 15px; font-weight: 600; color: #8B6F47; flex-shrink: 0; }
.river-section-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; }
.river-section-sub { font-size: 12px; color: #777; margin-top: 1px; }

/* GATE QUESTIONS */
.gate { background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 10px; padding: 14px; margin-bottom: 10px; }
.gate.answered { border-color: #2E6B2E; background: #F4FAF4; }
.gate-q { font-size: 13px; font-weight: 500; color: #1a1a18; margin-bottom: 10px; line-height: 1.4; }
.gate-options { display: flex; flex-direction: column; gap: 6px; }
.gate-option { display: flex; gap: 10px; align-items: center; padding: 8px 12px; border-radius: 7px; border: 1px solid #E8E6DF; background: #fff; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #333; text-align: left; }
.gate-option:hover { border-color: #8B6F47; background: #FAF8F4; }
.gate-option.selected { border-color: #2E6B2E; background: #EEF5EE; color: #2E6B2E; font-weight: 500; }
.gate-answer { font-size: 12px; color: #2E6B2E; font-weight: 500; margin-top: 6px; display: flex; align-items: center; gap: 6px; }

/* DISCOVERY FIELDS */
.discovery-field { margin-bottom: 12px; }
.discovery-prompt { font-size: 12px; font-weight: 600; color: #555; margin-bottom: 5px; font-style: italic; }
.discovery-hint { font-size: 11px; color: #aaa; margin-top: 4px; }

/* CONFIDENCE METER */
.confidence-bar-wrap { margin-bottom: 16px; }
.confidence-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.confidence-text { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.confidence-score { font-family: 'Lora', serif; font-size: 20px; font-weight: 500; }
.confidence-track { height: 6px; background: #E8E6DF; border-radius: 3px; overflow: hidden; }
.confidence-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease, background 0.5s ease; }

/* RIGHT PANEL TABS */
.right-tabs { display: flex; border-bottom: 1px solid #E8E6DF; background: #fff; flex-shrink: 0; }
.right-tab { padding: 10px 14px; font-size: 11px; font-weight: 600; cursor: pointer; color: #999; border-bottom: 2px solid transparent; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.4px; }
.right-tab:hover { color: #1a1a18; }
.right-tab.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #FAFAF8; }

/* HYPOTHESIS CARDS */
.hypothesis-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 9px; padding: 13px 14px; margin-bottom: 8px; }
.hypothesis-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 4px; }
.hypothesis-text { font-size: 12px; color: #333; line-height: 1.55; }

/* TALK TRACKS */
.talk-box { background: #F8F6F1; border-left: 3px solid #8B6F47; border-radius: 0 8px 8px 0; padding: 12px 14px; margin-bottom: 12px; }
.talk-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 5px; }
.talk-text { font-size: 12px; color: #555; line-height: 1.6; font-style: italic; }

/* OBJECTIONS */
.obj-item { border: 1px solid #E8E6DF; border-radius: 8px; overflow: hidden; background: #fff; margin-bottom: 6px; }
.obj-q-btn { display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; cursor: pointer; font-size: 12px; font-weight: 500; width: 100%; text-align: left; background: none; border: none; font-family: 'DM Sans', sans-serif; color: #1a1a18; }
.obj-a-text { padding: 8px 12px 10px; font-size: 12px; color: #555; line-height: 1.55; font-style: italic; border-top: 1px solid #F0EDE6; }

/* LOADING */
.loading-pulse { display: flex; flex-direction: column; gap: 8px; padding: 4px 0; }
.pulse-line { height: 11px; background: #F0EDE6; border-radius: 6px; animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%{opacity:1} 50%{opacity:0.4} 100%{opacity:1} }

/* POST CALL */
.post-section { margin-bottom: 20px; }
.post-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
.post-content { background: #fff; border: 1px solid #E8E6DF; border-radius: 9px; padding: 14px; font-size: 13px; color: #333; line-height: 1.65; white-space: pre-wrap; }
.copy-btn { font-size: 11px; color: #8B6F47; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; padding: 0; }
.copy-btn:hover { text-decoration: underline; }

/* DEAL ROUTING */
.routing-card { border-radius: 10px; padding: 18px 20px; margin-bottom: 16px; border: 1.5px solid; }
.route-fast { background: #EEF5EE; border-color: #2E6B2E; }
.route-nurture { background: #FEF3E2; border-color: #BA7517; }
.route-disq { background: #FDE8E8; border-color: #9B2C2C; }
.route-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.route-fast .route-label { color: #2E6B2E; }
.route-nurture .route-label { color: #92540A; }
.route-disq .route-label { color: #9B2C2C; }
.route-title { font-family: 'Lora', serif; font-size: 16px; font-weight: 500; margin-bottom: 6px; }
.route-desc { font-size: 12px; color: #555; line-height: 1.55; }

/* SUMMARY */
.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
.summary-stat { background: #fff; border: 1px solid #E8E6DF; border-radius: 10px; padding: 14px; text-align: center; }
.summary-num { font-family: 'Lora', serif; font-size: 24px; color: #8B6F47; margin-bottom: 2px; }
.summary-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.4px; }

.divider { height: 1px; background: #E8E6DF; margin: 20px 0; }
.notice { background: #F8F6F1; border: 1px solid #E8E6DF; border-radius: 9px; padding: 12px 16px; font-size: 12px; color: #777; line-height: 1.6; margin-bottom: 18px; }
.notice strong { color: #1a1a18; }
.scroll-anchor { height: 1px; }
`;

// ── RIVER FRAMEWORK DATA ──────────────────────────────────────────────────────

const RIVER_STAGES = [
  {
    id: "R1", letter: "R", label: "Reality",
    sub: "Current state — where are they broken?",
    badge: "badge-r",
    color: "#9B2C2C",
    gates: [
      { id: "r1_current", q: "How is the prospect handling this problem today?", options: ["Manual / spreadsheets / no system", "Legacy tool they've outgrown", "Patchwork of multiple vendors", "Competitor solution that's underperforming", "No process at all"] },
      { id: "r1_urgency", q: "What's driving urgency to solve this now?", options: ["Executive mandate / top-down pressure", "Recent failure or incident", "Growth has exposed the gap", "Competitive pressure", "Budget cycle opening up", "No clear urgency yet"] },
    ],
    discoveryPrompts: [
      { id: "r_pain", label: "In their own words, what is the core pain?", hint: "Capture exact language — use verbatim in proposal" },
      { id: "r_tried", label: "What have they already tried? Why did it fail?", hint: "Understand the graveyard before pitching your solution" },
    ],
    talkTrack: '"Before we get into what we do, I want to understand where you are today. Walk me through what happens right now when [problem area] comes up — what does that process actually look like?"',
    objections: [
      { q: "We already have something in place", a: '"That\'s helpful. What\'s working well about it — and where does it still fall short? I want to understand the gap before assuming we\'re a fit."' },
      { q: "We\'re not sure this is a priority right now", a: '"Understood. What would need to change for it to become one? Is there an event or timeline that would accelerate the decision?"' },
    ]
  },
  {
    id: "I", letter: "I", label: "Impact",
    sub: "What does this cost them — in dollars, time, people?",
    badge: "badge-i",
    color: "#92540A",
    gates: [
      { id: "i_cost", q: "Have they quantified the cost of this problem?", options: ["Yes — they have hard numbers", "Partial — they have a sense but not exact", "No — they haven\'t calculated it", "They don\'t think it\'s costing them much"] },
      { id: "i_owner", q: "Who feels this pain most acutely?", options: ["C-Suite / Executive team", "Revenue / Sales leadership", "Operations / HR leadership", "Finance / CFO", "End users / frontline employees", "Multiple stakeholders equally"] },
    ],
    discoveryPrompts: [
      { id: "i_dollars", label: "What is the measurable cost of inaction? (revenue, time, headcount, churn)", hint: "Push for a number. Even a rough estimate is better than nothing." },
      { id: "i_softer", label: "What are the softer costs? (morale, reputation, missed opportunity)", hint: "These often matter more to champions than hard numbers" },
    ],
    talkTrack: '"I want to understand what this is actually costing you — not just in process pain, but in real dollars. When [problem] happens, what\'s the downstream impact? Have you ever tried to put a number on it?"',
    objections: [
      { q: "We don\'t really know what it\'s costing us", a: '"Let\'s build that together. If we look at [headcount × time lost], or [churn rate × ACV], what does that math look like? I\'d rather you own that number than have me tell you."' },
      { q: "The cost seems manageable", a: '"What would make it unmanageable? At what point does this become a problem you can\'t ignore? I want to understand your threshold."' },
    ]
  },
  {
    id: "V", letter: "V", label: "Vision",
    sub: "What does success look like — and who owns it?",
    badge: "badge-v",
    color: "#276227",
    gates: [
      { id: "v_outcome", q: "Can they articulate what success looks like in 90 days?", options: ["Yes — very specific and measurable", "Somewhat — directional but not specific", "No — they haven\'t defined it yet", "They have different definitions across stakeholders"] },
      { id: "v_champion", q: "Is there a clear internal champion who will sell this upward?", options: ["Yes — identified and motivated", "Potential champion — needs equipping", "No champion identified yet", "Multiple potential champions"] },
    ],
    discoveryPrompts: [
      { id: "v_success", label: "In their words: what does a win look like at Day 30, Day 90, Year 1?", hint: "This becomes your proposal headline — use their exact language" },
      { id: "v_champion_detail", label: "Who is the internal champion? What do they personally win if this succeeds?", hint: "Champions need a personal win, not just an organizational one" },
    ],
    talkTrack: '"Let\'s talk about what success looks like on your end. If we\'re sitting here 90 days after you sign and everything has gone perfectly — what has changed? What can you point to and say that\'s working?"',
    objections: [
      { q: "We\'re not sure what success looks like yet", a: '"That\'s actually the most important thing we can figure out together before you sign anything. Can we spend 10 minutes defining that — because your answer will tell me whether we\'re the right fit."' },
      { q: "Different stakeholders want different things", a: '"That\'s common. Who has the final say on what success means? And is there a shared outcome everyone can agree on, even if the details differ?"' },
    ]
  },
  {
    id: "E", letter: "E", label: "Entry Points",
    sub: "Who decides, who influences, and what triggers a yes?",
    badge: "badge-e",
    color: "#3A5A8C",
    gates: [
      { id: "e_buyer", q: "Have you identified the economic buyer?", options: ["Yes — met them or confirmed identity", "Probable — know the role, not confirmed", "No — working through layers", "Unclear org structure"] },
      { id: "e_process", q: "What does their decision process look like?", options: ["Clear — defined steps and timeline", "Informal — champion can move it", "Committee / consensus required", "RFP or formal procurement process", "Unknown"] },
    ],
    discoveryPrompts: [
      { id: "e_stakeholders", label: "Map the buying committee: who approves, who influences, who can kill it?", hint: "Name every stakeholder you know. Flag the ones you haven't met." },
      { id: "e_timeline", label: "What is the realistic decision timeline? Is there a forcing function?", hint: "Budget cycle, renewal date, board review, product launch — find the date" },
    ],
    talkTrack: '"I want to make sure I understand how you make decisions like this. Walk me through what the process looks like from here — who else needs to be involved, and what would need to be true for you to move forward?"',
    objections: [
      { q: "We need to get more people involved", a: '"Absolutely — who are the right people? I\'d rather get them in early than have them become a blocker. Can we set up a 30-minute call with that group this week?"' },
      { q: "This will go through procurement", a: '"Understood. What does that process typically look like, and what\'s the timeline? I want to make sure we have everything they need ready before it hits their queue."' },
    ]
  },
  {
    id: "R2", letter: "R", label: "Route",
    sub: "Fastest path to yes — and a successful Day 1",
    badge: "badge-r2",
    color: "#6B3A7A",
    gates: [
      { id: "r2_fit", q: "Based on everything you\'ve heard — what is your honest deal assessment?", options: ["Strong fit — ready to advance", "Good fit — a few gaps to close", "Uncertain — need more discovery", "Weak fit — misalignment on key criteria", "Not a fit — should not advance"] },
      { id: "r2_blocker", q: "What is the single biggest risk to this deal?", options: ["No internal champion", "Budget not confirmed", "Competitor entrenched", "Timeline mismatch", "Stakeholder misalignment", "Technical / compliance barrier", "No compelling event"] },
    ],
    discoveryPrompts: [
      { id: "r2_next", label: "What is the single most important next step to move this deal forward?", hint: "Be specific — a named action, a named person, a named date" },
      { id: "r2_onboard", label: "What does a successful onboarding look like for them? What would make them feel great about saying yes?", hint: "This becomes your close framing and your CSM handoff brief" },
    ],
    talkTrack: '"Based on what you\'ve shared with me today, I have a clear picture of where you are and what you\'re trying to achieve. Here\'s what I think the right path looks like — and here\'s what I need from you to make it happen quickly and painlessly."',
    objections: [
      { q: "We\'re not ready to move forward yet", a: '"I hear you. What would need to change — or what would need to be true — for you to feel ready? I want to understand whether this is a timing issue or something more fundamental."' },
      { q: "We need to think about it", a: '"Of course. What specifically do you need to think through? If I can help you work through that now, it might save us both a few weeks."' },
    ]
  },
];

// ── AI CALLS ──────────────────────────────────────────────────────────────────

async function callAI(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch { return null; }
}

async function generatePrepBrief(prep) {
  return callAI(`You are a senior B2B sales strategist. Generate a pre-call intelligence brief for a digital rewards/incentives sales rep.

Company: ${prep.company}
Industry: ${prep.industry}
Role of contact: ${prep.contactRole}
Deal size estimate: ${prep.acvEstimate}
Lead source: ${prep.leadSource}
Known pain / context: ${prep.knownContext || "None provided"}

Return ONLY valid JSON:
{
  "companySnapshot": "2 sentence company overview relevant to a digital rewards sale",
  "riverHypothesis": {
    "reality": "What reality/current state do we expect to find?",
    "impact": "What impact/cost do we expect this problem is creating?",
    "vision": "What vision of success is this buyer likely holding?",
    "entryPoints": "Who likely makes this decision and how?",
    "route": "What is the likely fastest path to close based on company profile?"
  },
  "solutionHypothesis": "Which product/solution angle is most likely to resonate and why — 2 sentences",
  "openingAngle": "One sharp, specific opening question tailored to this company and role",
  "watchOuts": ["Watch-out 1", "Watch-out 2", "Watch-out 3"],
  "keyContacts": [
    {"name": "Likely Name", "title": "Title", "initials": "XX", "angle": "How to engage this person"},
    {"name": "Likely Name", "title": "Title", "initials": "XX", "angle": "How to engage this person"}
  ],
  "competitors": ["Competitor A", "Competitor B"],
  "recentSignals": ["Recent news/signal 1 relevant to the sale", "Recent news/signal 2"]
}`);
}

async function generatePostCall(prep, riverData, gateAnswers, confidence) {
  const riverSummary = RIVER_STAGES.map(s => {
    const gates = s.gates.map(g => `${g.q}: ${gateAnswers[g.id] || "Not answered"}`).join("; ");
    const discovery = s.discoveryPrompts.map(p => `${p.label}: ${riverData[p.id] || "Not captured"}`).join("; ");
    return `${s.label}: ${gates} | ${discovery}`;
  }).join("\n");

  return callAI(`You are a senior sales coach reviewing a completed discovery call using the RIVER framework.

Company: ${prep.company}
Industry: ${prep.industry}
Contact: ${prep.contactRole}
Deal size estimate: ${prep.acvEstimate}
Deal confidence score: ${confidence}%

RIVER Capture:
${riverSummary}

Return ONLY valid JSON:
{
  "callSummary": "3-4 sentence narrative summary of what was learned on this call",
  "riverScorecard": {
    "reality": "What was confirmed or learned about their current state",
    "impact": "What cost/impact was surfaced",
    "vision": "What success looks like in their words",
    "entryPoints": "What was learned about the buying process",
    "route": "Recommended next move and why"
  },
  "dealRoute": "FAST_TRACK or NURTURE or DISQUALIFY",
  "dealRouteReason": "One sentence explaining the routing decision",
  "dealRisk": "The single biggest risk to this deal closing",
  "nextSteps": ["Specific next step 1 with owner and date", "Specific next step 2", "Specific next step 3"],
  "crmNote": "CRM-ready deal note — 4-5 sentences covering current state, pain, vision, decision process, and recommended next action",
  "emailSubject": "Follow-up email subject line",
  "emailBody": "Full follow-up email — professional, outcome-focused, references specific things discussed, ends with a clear CTA and proposed meeting time"
}`);
}

// ── CONFIDENCE SCORE ──────────────────────────────────────────────────────────

function calcConfidence(gateAnswers, riverData) {
  const positiveGates = {
    r1_urgency: ["Executive mandate / top-down pressure", "Recent failure or incident", "Budget cycle opening up"],
    i_cost: ["Yes — they have hard numbers", "Partial — they have a sense but not exact"],
    v_outcome: ["Yes — very specific and measurable", "Somewhat — directional but not specific"],
    v_champion: ["Yes — identified and motivated", "Potential champion — needs equipping"],
    e_buyer: ["Yes — met them or confirmed identity", "Probable — know the role, not confirmed"],
    e_process: ["Clear — defined steps and timeline", "Informal — champion can move it"],
    r2_fit: ["Strong fit — ready to advance", "Good fit — a few gaps to close"],
  };
  let score = 20;
  Object.entries(positiveGates).forEach(([gateId, positives]) => {
    if (positives.includes(gateAnswers[gateId])) score += 10;
    else if (gateAnswers[gateId]) score += 3;
  });
  const filledDiscovery = RIVER_STAGES.flatMap(s => s.discoveryPrompts).filter(p => riverData[p.id]?.trim().length > 10).length;
  score += filledDiscovery * 4;
  return Math.min(score, 98);
}

function confidenceColor(score) {
  if (score >= 75) return "#2E6B2E";
  if (score >= 50) return "#BA7517";
  return "#9B2C2C";
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function RiverBadge() {
  const items = [
    { l: "R", w: "Reality" }, { l: "I", w: "Impact" }, { l: "V", w: "Vision" },
    { l: "E", w: "Entry Points" }, { l: "R", w: "Route" }
  ];
  return (
    <div className="river-badge">
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {i > 0 && <span className="river-sep">·</span>}
          <span className="river-letter">{item.l}</span>
          <span className="river-word">{item.w}</span>
        </span>
      ))}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState(1);

  // Phase 1 state
  const [prep, setPrep] = useState({ company: "", industry: "", contactRole: "", acvEstimate: "", leadSource: "", knownContext: "" });
  const [prepBrief, setPrepBrief] = useState(null);
  const [prepLoading, setPrepLoading] = useState(false);

  // Phase 2 state
  const [activeRiver, setActiveRiver] = useState(0);
  const [gateAnswers, setGateAnswers] = useState({});
  const [riverData, setRiverData] = useState({});
  const [expandedObjs, setExpandedObjs] = useState({});
  const [rightTab, setRightTab] = useState("hypothesis");

  // Phase 3 state
  const [postCall, setPostCall] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const confidence = calcConfidence(gateAnswers, riverData);

  const runPrep = async () => {
    if (!prep.company || !prep.industry) return;
    setPrepLoading(true);
    const brief = await generatePrepBrief(prep);
    setPrepBrief(brief);
    setPrepLoading(false);
  };

  const runPostCall = async () => {
    setPostLoading(true);
    const result = await generatePostCall(prep, riverData, gateAnswers, confidence);
    setPostCall(result);
    setPostLoading(false);
    setPhase(3);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const isFilled = (stage) => stage.gates.some(g => gateAnswers[g.id]) || stage.discoveryPrompts.some(p => riverData[p.id]?.trim());

  const PHASES = ["Pre-Call Prep", "In-Call Navigator", "Post-Call Route"];

  const routeClass = postCall?.dealRoute === "FAST_TRACK" ? "route-fast" : postCall?.dealRoute === "NURTURE" ? "route-nurture" : "route-disq";
  const routeLabel = postCall?.dealRoute === "FAST_TRACK" ? "Fast Track →" : postCall?.dealRoute === "NURTURE" ? "Nurture" : "Disqualify";

  return (
    <>
      <style>{FONTS}{css}</style>
      <div className="app">
        <header className="header">
          <div className="logo">Cambrian <span>Catalyst</span> <span style={{ fontFamily: "DM Sans", fontSize: 13, color: "#aaa", fontWeight: 400 }}>· RIVER</span></div>
          <div className="phase-nav">
            {PHASES.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && <div className="phase-div" />}
                <div className={`phase-item ${phase === i + 1 ? "active" : phase > i + 1 ? "done" : ""}`}
                  onClick={() => { if (phase > i + 1) setPhase(i + 1); }}>
                  <div className="phase-num">{phase > i + 1 ? "✓" : i + 1}</div>
                  {p}
                </div>
              </div>
            ))}
          </div>
          <div className="header-right">
            {phase === 2 && <div className="live-badge"><div className="live-dot" />Live Call</div>}
            {phase !== 2 && <div style={{ width: 80 }} />}
          </div>
        </header>

        {/* ── PHASE 1: PRE-CALL PREP ── */}
        {phase === 1 && (
          <div className="page">
            <div className="page-title" style={{ fontFamily: "Lora, serif" }}>Pre-Call Preparation</div>
            <div className="page-sub">Build a complete intelligence brief before you pick up the phone. The RIVER framework gives you a hypothesis for every stage of the conversation.</div>
            <RiverBadge />

            <div className="card">
              <div className="card-header">
                <div className="card-title" style={{ fontFamily: "Lora, serif" }}>Prospect Details</div>
                <div className={`card-badge badge-prep`}>Step 1</div>
              </div>
              <div className="field-grid-2">
                {[
                  { key: "company", label: "Company Name", req: true, placeholder: "e.g. Waste Management Inc" },
                  { key: "industry", label: "Industry / Vertical", req: true, placeholder: "e.g. Large Employer" },
                  { key: "contactRole", label: "Primary Contact Role", req: true, placeholder: "e.g. VP Total Rewards" },
                  { key: "acvEstimate", label: "Estimated Deal Size", placeholder: "e.g. $85,000" },
                  { key: "leadSource", label: "Lead Source", placeholder: "e.g. Trade Show, Referral" },
                ].map(f => (
                  <div className="field-row" key={f.key}>
                    <div className="field-label">{f.label} {f.req && <span className="req">*</span>}</div>
                    <input type="text" placeholder={f.placeholder} value={prep[f.key]} onChange={e => setPrep(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div className="field-row">
                <div className="field-label">Known Context / Intel</div>
                <textarea rows={3} placeholder="Anything you already know — recent news, referral notes, trigger events, prior conversations..." value={prep.knownContext} onChange={e => setPrep(p => ({ ...p, knownContext: e.target.value }))} />
              </div>
            </div>

            <div className="actions-row">
              <button className="btn btn-gold btn-lg" onClick={runPrep} disabled={prepLoading || !prep.company || !prep.industry || !prep.contactRole}>
                {prepLoading ? "Generating Brief..." : "Generate RIVER Brief →"}
              </button>
            </div>

            {prepLoading && (
              <div className="card" style={{ marginTop: 20 }}>
                <div className="loading-pulse">
                  {[75, 55, 85, 45, 70, 60, 80, 50].map((w, i) => (
                    <div key={i} className="pulse-line" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            )}

            {prepBrief && !prepLoading && (
              <>
                <div className="divider" />

                <div className="card">
                  <div className="card-header">
                    <div className="card-title" style={{ fontFamily: "Lora, serif" }}>Company Snapshot</div>
                    <div className="card-badge badge-prep">AI Brief</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#444", lineHeight: 1.65, marginBottom: 16 }}>{prepBrief.companySnapshot}</div>
                  {prepBrief.recentSignals?.length > 0 && (
                    <>
                      <div className="field-label" style={{ marginBottom: 8 }}>Recent Signals</div>
                      {prepBrief.recentSignals.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#8B6F47", flexShrink: 0, marginTop: 5 }} />
                          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{s}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="card">
                  <div className="card-header">
                    <div className="card-title" style={{ fontFamily: "Lora, serif" }}>RIVER Hypothesis</div>
                    <div className="card-badge badge-prep">Pre-Call</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa", marginBottom: 14 }}>Your hypothesis before the call. Use In-Call Navigator to validate or update each stage.</div>
                  {prepBrief.riverHypothesis && RIVER_STAGES.map((stage, i) => {
                    const keys = ["reality", "impact", "vision", "entryPoints", "route"];
                    return (
                      <div key={i} className="hypothesis-card">
                        <div className="hypothesis-label">{stage.letter} — {stage.label}</div>
                        <div className="hypothesis-text">{prepBrief.riverHypothesis[keys[i]]}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="card">
                  <div className="card-header">
                    <div className="card-title" style={{ fontFamily: "Lora, serif" }}>Solution Hypothesis & Opening</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#444", lineHeight: 1.65, marginBottom: 16 }}>{prepBrief.solutionHypothesis}</div>
                  <div className="talk-box">
                    <div className="talk-label">Recommended Opening Question</div>
                    <div className="talk-text">{prepBrief.openingAngle}</div>
                  </div>
                </div>

                <div className="field-grid-2" style={{ gap: 14, marginBottom: 16 }}>
                  <div className="card" style={{ margin: 0 }}>
                    <div className="card-title" style={{ fontFamily: "Lora, serif", marginBottom: 12, fontSize: 14 }}>Key Contacts</div>
                    {prepBrief.keyContacts?.map((c, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E8E6DF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#666", flexShrink: 0 }}>{c.initials}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "#777" }}>{c.title}</div>
                          <div style={{ fontSize: 11, color: "#8B6F47", marginTop: 2, fontStyle: "italic" }}>{c.angle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{ margin: 0 }}>
                    <div className="card-title" style={{ fontFamily: "Lora, serif", marginBottom: 12, fontSize: 14 }}>Watch-Outs</div>
                    {prepBrief.watchOuts?.map((w, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#9B2C2C", flexShrink: 0, marginTop: 5 }} />
                        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{w}</div>
                      </div>
                    ))}
                    {prepBrief.competitors?.length > 0 && (
                      <>
                        <div className="field-label" style={{ marginTop: 14, marginBottom: 8 }}>Likely Competitors</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {prepBrief.competitors.map((c, i) => (
                            <span key={i} style={{ fontSize: 11, background: "#EEF2F8", color: "#3A5A8C", padding: "2px 9px", borderRadius: 20, fontWeight: 600 }}>{c}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="actions-row">
                  <button className="btn btn-green btn-lg" onClick={() => setPhase(2)}>
                    Start In-Call Navigator →
                  </button>
                  <button className="btn btn-secondary" onClick={runPrep}>Regenerate Brief</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── PHASE 2: IN-CALL NAVIGATOR ── */}
        {phase === 2 && (
          <div className="call-layout">
            {/* LEFT: RIVER Navigator */}
            <div className="call-left">
              <div className="panel-header">
                <div>
                  <div className="panel-title" style={{ fontFamily: "Lora, serif" }}>
                    {prep.company || "In-Call"} · RIVER Navigator
                  </div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                    {prep.contactRole} · {prep.industry}
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setPhase(1)}>← Prep</button>
              </div>

              <div className="river-nav">
                {RIVER_STAGES.map((s, i) => (
                  <button key={s.id} className={`river-tab ${activeRiver === i ? "active" : ""} ${isFilled(s) ? "filled" : ""}`}
                    onClick={() => setActiveRiver(i)}>
                    {isFilled(s) && <div className="fill-dot" />}
                    {s.letter} — {s.label}
                  </button>
                ))}
              </div>

              <div className="panel-body">
                {/* Confidence meter */}
                <div className="confidence-bar-wrap">
                  <div className="confidence-label">
                    <div className="confidence-text">Deal Confidence</div>
                    <div className="confidence-score" style={{ color: confidenceColor(confidence) }}>{confidence}%</div>
                  </div>
                  <div className="confidence-track">
                    <div className="confidence-fill" style={{ width: `${confidence}%`, background: confidenceColor(confidence) }} />
                  </div>
                </div>

                {RIVER_STAGES.map((stage, si) => si === activeRiver && (
                  <div key={stage.id}>
                    <div className="river-header">
                      <div className="river-icon">{stage.letter}</div>
                      <div>
                        <div className="river-section-title" style={{ fontFamily: "Lora, serif" }}>{stage.label}</div>
                        <div className="river-section-sub">{stage.sub}</div>
                      </div>
                    </div>

                    {/* Gate questions */}
                    {stage.gates.map((gate, gi) => (
                      <div key={gate.id} className={`gate ${gateAnswers[gate.id] ? "answered" : ""}`}>
                        <div className="gate-q">{gate.q}</div>
                        {!gateAnswers[gate.id] ? (
                          <div className="gate-options">
                            {gate.options.map((opt, oi) => (
                              <button key={oi} className="gate-option" onClick={() => setGateAnswers(a => ({ ...a, [gate.id]: opt }))}>
                                <span style={{ fontSize: 10, color: "#aaa", minWidth: 14 }}>{String.fromCharCode(65 + oi)}</span>
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="gate-answer">
                            ✓ {gateAnswers[gate.id]}
                            <button className="btn-secondary btn-sm" style={{ marginLeft: "auto", fontSize: 10, padding: "3px 8px", borderRadius: 6, border: "1px solid #E8E6DF", background: "transparent", cursor: "pointer", color: "#999", fontFamily: "DM Sans" }}
                              onClick={() => setGateAnswers(a => { const n = { ...a }; delete n[gate.id]; return n; })}>
                              Undo
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Discovery fields */}
                    <div style={{ marginTop: 14 }}>
                      <div className="field-label" style={{ marginBottom: 10 }}>Discovery Capture</div>
                      {stage.discoveryPrompts.map(prompt => (
                        <div key={prompt.id} className="discovery-field">
                          <div className="discovery-prompt">{prompt.label}</div>
                          <textarea rows={3} placeholder="Capture what you're hearing..." value={riverData[prompt.id] || ""} onChange={e => setRiverData(d => ({ ...d, [prompt.id]: e.target.value }))} />
                          <div className="discovery-hint">{prompt.hint}</div>
                        </div>
                      ))}
                    </div>

                    {/* Talk track */}
                    <div className="talk-box" style={{ marginTop: 14 }}>
                      <div className="talk-label">Talk Track</div>
                      <div className="talk-text">{stage.talkTrack}</div>
                    </div>

                    {/* Objections */}
                    <div style={{ marginTop: 12 }}>
                      <div className="field-label" style={{ marginBottom: 8 }}>Objection Handling</div>
                      {stage.objections.map((o, oi) => (
                        <div key={oi} className="obj-item">
                          <button className="obj-q-btn" onClick={() => setExpandedObjs(s => ({ ...s, [`${si}-${oi}`]: !s[`${si}-${oi}`] }))}>
                            "{o.q}"
                            <span style={{ color: "#aaa" }}>{expandedObjs[`${si}-${oi}`] ? "−" : "+"}</span>
                          </button>
                          {expandedObjs[`${si}-${oi}`] && <div className="obj-a-text">{o.a}</div>}
                        </div>
                      ))}
                    </div>

                    {/* Stage nav */}
                    <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 16, borderTop: "1px solid #E8E6DF" }}>
                      {si > 0 && <button className="btn btn-secondary btn-sm" onClick={() => setActiveRiver(si - 1)}>← {RIVER_STAGES[si - 1].label}</button>}
                      {si < RIVER_STAGES.length - 1 && (
                        <button className="btn btn-gold btn-sm" onClick={() => setActiveRiver(si + 1)}>
                          {RIVER_STAGES[si + 1].label} →
                        </button>
                      )}
                      {si === RIVER_STAGES.length - 1 && (
                        <button className="btn btn-green btn-sm" onClick={runPostCall} disabled={postLoading}>
                          {postLoading ? "Generating Route..." : "End Call & Generate Route →"}
                        </button>
                      )}
                    </div>
                    {si < RIVER_STAGES.length - 1 && (
                      <div style={{ marginTop: 12 }}>
                        <button className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={runPostCall} disabled={postLoading}>
                          {postLoading ? "Generating..." : "End Call Early & Generate Route"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="call-right">
              <div className="right-tabs">
                {[["hypothesis", "Hypothesis"], ["prep", "Prep Brief"], ["notes", "Notes"]].map(([id, label]) => (
                  <button key={id} className={`right-tab ${rightTab === id ? "active" : ""}`} onClick={() => setRightTab(id)}>{label}</button>
                ))}
              </div>
              <div className="panel-body">

                {/* HYPOTHESIS TAB */}
                {rightTab === "hypothesis" && prepBrief && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", marginBottom: 12 }}>
                      Pre-Call RIVER Hypothesis
                    </div>
                    {RIVER_STAGES.map((stage, i) => {
                      const keys = ["reality", "impact", "vision", "entryPoints", "route"];
                      const isActive = activeRiver === i;
                      return (
                        <div key={i} className="hypothesis-card" style={{ borderColor: isActive ? "#8B6F47" : "#E8E6DF", cursor: "pointer" }} onClick={() => setActiveRiver(i)}>
                          <div className="hypothesis-label">{stage.letter} — {stage.label} {isFilled(stage) ? "✓" : ""}</div>
                          <div className="hypothesis-text">{prepBrief.riverHypothesis?.[keys[i]] || "—"}</div>
                          {riverData[stage.discoveryPrompts[0]?.id] && (
                            <div style={{ marginTop: 8, fontSize: 11, color: "#2E6B2E", borderTop: "1px solid #E8E6DF", paddingTop: 6 }}>
                              Captured: "{riverData[stage.discoveryPrompts[0].id].slice(0, 80)}{riverData[stage.discoveryPrompts[0].id].length > 80 ? "..." : ""}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", marginBottom: 8 }}>Solution Hypothesis</div>
                      <div className="hypothesis-card">
                        <div className="hypothesis-text">{prepBrief.solutionHypothesis}</div>
                      </div>
                    </div>
                  </>
                )}
                {rightTab === "hypothesis" && !prepBrief && (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#bbb" }}>
                    <div style={{ fontSize: 13 }}>No prep brief generated.<br />Go back to Pre-Call Prep to build one.</div>
                    <button className="btn btn-secondary btn-sm" style={{ marginTop: 16 }} onClick={() => setPhase(1)}>← Go to Prep</button>
                  </div>
                )}

                {/* PREP TAB */}
                {rightTab === "prep" && prepBrief && (
                  <>
                    <div className="talk-box" style={{ marginBottom: 16 }}>
                      <div className="talk-label">Opening Angle</div>
                      <div className="talk-text">{prepBrief.openingAngle}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", marginBottom: 10 }}>Key Contacts</div>
                    {prepBrief.keyContacts?.map((c, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, background: "#fff", border: "1px solid #E8E6DF", borderRadius: 9, padding: "10px 12px" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E8E6DF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#666", flexShrink: 0 }}>{c.initials}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name} · {c.title}</div>
                          <div style={{ fontSize: 11, color: "#8B6F47", fontStyle: "italic", marginTop: 2 }}>{c.angle}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", margin: "16px 0 10px" }}>Watch-Outs</div>
                    {prepBrief.watchOuts?.map((w, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#9B2C2C", flexShrink: 0, marginTop: 5 }} />
                        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{w}</div>
                      </div>
                    ))}
                  </>
                )}
                {rightTab === "prep" && !prepBrief && (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#bbb" }}>
                    <div style={{ fontSize: 13 }}>No prep brief available.<br />Complete Pre-Call Prep first.</div>
                  </div>
                )}

                {/* NOTES TAB */}
                {rightTab === "notes" && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", marginBottom: 10 }}>Call Notes</div>
                    <textarea style={{ width: "100%", minHeight: 280, padding: 10, border: "1px solid #E8E6DF", borderRadius: 8, fontSize: 13, fontFamily: "DM Sans", background: "#fff", resize: "vertical" }}
                      placeholder="Free-form notes... press Tab to add a timestamp"
                      onKeyDown={e => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                          const el = e.target;
                          const before = el.value.slice(0, el.selectionStart);
                          const after = el.value.slice(el.selectionStart);
                          el.value = before + `\n[${ts}] ` + after;
                        }
                      }}
                    />
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>Tab = timestamp · Notes feed into post-call summary</div>
                    <div className="divider" />
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#aaa", marginBottom: 10 }}>Gates Logged</div>
                    {Object.keys(gateAnswers).length === 0 && <div style={{ fontSize: 12, color: "#bbb" }}>No gates answered yet</div>}
                    {Object.entries(gateAnswers).map(([k, v]) => (
                      <div key={k} style={{ fontSize: 11, color: "#555", padding: "5px 0", borderBottom: "1px solid #F0EDE6" }}>
                        <span style={{ color: "#aaa" }}>{k}</span> → {v}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── PHASE 3: POST-CALL ROUTE ── */}
        {phase === 3 && (
          <div className="page">
            <div className="page-title" style={{ fontFamily: "Lora, serif" }}>Post-Call Route</div>
            <div className="page-sub">AI synthesis of your RIVER capture — deal routing, next steps, CRM note, and follow-up email.</div>

            {postLoading && (
              <div className="card">
                <div style={{ fontSize: 13, color: "#777", marginBottom: 14 }}>Synthesizing your RIVER capture and generating deal route...</div>
                <div className="loading-pulse">
                  {[80, 55, 90, 45, 70, 60, 85].map((w, i) => (
                    <div key={i} className="pulse-line" style={{ width: `${w}%`, animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
              </div>
            )}

            {postCall && !postLoading && (
              <>
                <div className="summary-grid">
                  <div className="summary-stat"><div className="summary-num" style={{ fontFamily: "Lora, serif" }}>{confidence}%</div><div className="summary-label">Deal Confidence</div></div>
                  <div className="summary-stat"><div className="summary-num" style={{ fontFamily: "Lora, serif", fontSize: 16, paddingTop: 4 }}>{routeLabel}</div><div className="summary-label">Deal Route</div></div>
                  <div className="summary-stat"><div className="summary-num" style={{ fontFamily: "Lora, serif" }}>{prep.acvEstimate || "—"}</div><div className="summary-label">Deal Size</div></div>
                </div>

                {/* Routing decision */}
                <div className={`routing-card ${routeClass}`}>
                  <div className="route-label">Deal Route</div>
                  <div className="route-title" style={{ fontFamily: "Lora, serif" }}>{routeLabel}</div>
                  <div className="route-desc">{postCall.dealRouteReason}</div>
                  {postCall.dealRisk && <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>⚠ Top risk: {postCall.dealRisk}</div>}
                </div>

                {/* RIVER Scorecard */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title" style={{ fontFamily: "Lora, serif" }}>RIVER Scorecard</div>
                    <div className="card-badge badge-prep">Post-Call</div>
                  </div>
                  {postCall.riverScorecard && RIVER_STAGES.map((stage, i) => {
                    const keys = ["reality", "impact", "vision", "entryPoints", "route"];
                    return (
                      <div key={i} className="hypothesis-card">
                        <div className="hypothesis-label">{stage.letter} — {stage.label}</div>
                        <div className="hypothesis-text">{postCall.riverScorecard[keys[i]]}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Next steps */}
                <div className="post-section">
                  <div className="post-label">Recommended Next Steps</div>
                  <div className="post-content">
                    {postCall.nextSteps?.map((s, i) => `${i + 1}. ${s}`).join("\n")}
                  </div>
                </div>

                {/* CRM Note */}
                <div className="post-section">
                  <div className="post-label">
                    CRM-Ready Deal Note
                    <button className="copy-btn" onClick={() => copyText(postCall.crmNote, "crm")}>
                      {copied === "crm" ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <div className="post-content">{postCall.crmNote}</div>
                </div>

                {/* Call summary */}
                <div className="post-section">
                  <div className="post-label">
                    Call Summary
                    <button className="copy-btn" onClick={() => copyText(postCall.callSummary, "summary")}>
                      {copied === "summary" ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <div className="post-content">{postCall.callSummary}</div>
                </div>

                {/* Follow-up email */}
                <div className="post-section">
                  <div className="post-label">
                    Follow-Up Email
                    <button className="copy-btn" onClick={() => copyText(`Subject: ${postCall.emailSubject}\n\n${postCall.emailBody}`, "email")}>
                      {copied === "email" ? "Copied ✓" : "Copy Email"}
                    </button>
                  </div>
                  <div className="post-content" style={{ fontSize: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 10, color: "#1a1a18" }}>Subject: {postCall.emailSubject}</div>
                    {postCall.emailBody}
                  </div>
                </div>

                <div className="actions-row">
                  <button className="btn btn-secondary" onClick={() => setPhase(2)}>← Back to Call</button>
                  <button className="btn btn-gold" onClick={() => { setPostCall(null); setPostLoading(true); generatePostCall(prep, riverData, gateAnswers, confidence).then(r => { setPostCall(r); setPostLoading(false); }); }}>
                    Regenerate
                  </button>
                  <button className="btn btn-primary" onClick={() => {
                    setPhase(1); setPrepBrief(null); setGateAnswers({}); setRiverData({});
                    setPostCall(null); setPrep({ company: "", industry: "", contactRole: "", acvEstimate: "", leadSource: "", knownContext: "" });
                  }}>
                    New Call
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
