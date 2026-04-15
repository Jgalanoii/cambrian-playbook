import React, { useState, useCallback, useRef, useEffect } from "react";
import { OUTCOMES } from "./data/outcomes.js";
import { RIVER_STAGES } from "./data/riverFramework.js";
import { SAMPLE_ROWS } from "./data/sampleAccounts.js";
import S9SolutionFit from "./stages/S9_SolutionFit.jsx";
import "./App.css";


const SB_URL=import.meta.env.VITE_SUPABASE_URL;
const SB_KEY=import.meta.env.VITE_SUPABASE_ANON_KEY;
async function sbAuth(path,body){const r=await fetch(SB_URL+'/auth/v1/'+path,{method:'POST',headers:{'apikey':SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});return r.json();}
async function sbGetUser(token){const r=await fetch(SB_URL+'/auth/v1/user',{headers:{'apikey':SB_KEY,'Authorization':'Bearer '+token}});return r.ok?r.json():null;}
async function sbSessions(method,path,token,body){const r=await fetch(SB_URL+'/rest/v1/'+path,{method,headers:{'apikey':SB_KEY,'Authorization':'Bearer '+token,'Content-Type':'application/json','Prefer':'return=representation'},body:body?JSON.stringify(body):undefined});const t=await r.text();return t?JSON.parse(t):null;}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const COHORT_COLORS = ["#8B6F47","#4A7A9B","#6B8E6B","#9B6B8E","#7A7A4A","#C87533","#1B3A6B","#2E6B2E","#9B2C2C","#6B3A7A","#BA7517","#3A6B6B","#6B4A9B","#A84A4A","#4A9B7A"];

// ── UNIVERSAL BUSINESS IMPERATIVES ─────────────────────────────────────────
// Every company — regardless of industry, size, or stage — is always working on these.
// Use these to anchor discovery, solution mapping, and hypothesis framing.

// The 6 universal imperatives every company shares — used for pre-selecting baseline outcomes


const BLANK_BRIEF = {
  companySnapshot:"",sellerSnapshot:"",
  revenue:"",publicPrivate:"",employeeCount:"",headquarters:"",founded:"",website:"",linkedIn:"",
  keyExecutives:[],recentHeadlines:[],
  openRoles:{summary:"",roles:[]},
  solutionMapping:[{product:"",imperativeServed:"",buyerRole:"",jobToBeDone:"",painRelieved:"",gainCreated:"",challengerInsight:"",joltRiskRemover:"",fit:""},{product:"",imperativeServed:"",buyerRole:"",jobToBeDone:"",painRelieved:"",gainCreated:"",challengerInsight:"",joltRiskRemover:"",fit:""},{product:"",imperativeServed:"",buyerRole:"",jobToBeDone:"",painRelieved:"",gainCreated:"",challengerInsight:"",joltRiskRemover:"",fit:""}],
  mobilizer:{description:"",identifyingBehavior:"",teachingAngle:""},
  caseStudies:[],
  openingAngle:"",watchOuts:["","",""],
  keyContacts:[{name:"",title:"",initials:"?",angle:""},{name:"",title:"",initials:"?",angle:""}],
  competitors:[],recentSignals:["","",""],
  fundingProfile:"",strategicTheme:"",growthSignals:[],sellerOpportunity:"",
  publicSentiment:{bbbRating:"",bbbAccredited:null,standoutReview:{text:"",source:"",sentiment:""},onlineSentiment:"",sentimentSummary:""},
};

const RKEYS = ["reality","impact","vision","entryPoints","route"];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function parseACV(v){if(!v)return 0;const n=parseFloat(v.toString().replace(/[$,]/g,"").replace(/k$/i,"000"));return isNaN(n)?0:n;}
// Cohorts now based on org size, not ACV
function labelOrgSize(row,mapping){
  const emp = ((mapping.employees&&row[mapping.employees])||"").toString().toLowerCase();
  const ind = ((mapping.industry&&row[mapping.industry])||"").toString();
  if(emp){
    const n=parseFloat(emp.replace(/[^0-9.]/g,""));
    if(!isNaN(n)){
      if(n<500)   return"Small Org (<500 employees)";
      if(n<5000)  return"Mid-Size (500–5K employees)";
      if(n<50000) return"Large Org (5K–50K employees)";
      return"Enterprise (50K+ employees)";
    }
  }
  // Fall back to industry signals if no employee data
  const indLow=ind.toLowerCase();
  if(indLow.includes("university")||indLow.includes("higher ed")) return"Mid-Size (500–5K employees)";
  return"Unknown Size";
}
function labelACV(v){if(v===0)return"Unknown";if(v<25000)return"SMB (<$25K)";if(v<100000)return"Mid-Market ($25K–$100K)";return"Enterprise ($100K+)";}
function getOutcomeTheme(row,mapping){
  const get=k=>(mapping[k]?(row[mapping[k]]||""):"").toString().toLowerCase();
  const txt=get("outcome")+get("product");
  if(/revenue|growth|sales|pipeline/.test(txt))return"Revenue Growth";
  if(/efficien|automat|process|cost/.test(txt))return"Operational Efficiency";
  if(/churn|retain|loyal/.test(txt))return"Customer Retention";
  if(/payroll|hr|employ|workforce/.test(txt))return"Workforce Management";
  if(/ai|ml|data|analytic/.test(txt))return"Data & AI Adoption";
  return"Strategic Transformation";
}
// Cohorts group accounts by industry. Hard-cap at MAX_COHORTS so the UI
// stays readable on imports with long-tail industry distributions — if
// more distinct industries exist, the top (MAX_COHORTS - 1) are kept as
// named cohorts and everything else rolls into a single "Other" cohort.
// No account is ever dropped. ACV is captured on the Account Review step
// as a salesperson input, not as a row attribute, so cohorts don't track it.
const MAX_COHORTS = 10;
function buildCohorts(rows,mapping){
  if(!rows.length) return [];
  const get=(row,key)=>(mapping[key]?(row[mapping[key]]||""):"").toString().trim();
  const groups={};
  rows.forEach(row=>{
    const ind      = get(row,"industry") || "Other",
          band     = ind,
          src      = get(row,"lead_source") || "Direct",
          outcome  = getOutcomeTheme(row,mapping),
          company  = get(row,"company"),
          product  = get(row,"product"),
          company_url   = get(row,"company_url") || "",
          employees     = get(row,"employees")   || "",
          publicPrivate = get(row,"public_private") || "",
          geography     = get(row,"geography") || "";
    if(!groups[band]) groups[band]=[];
    groups[band].push({row,ind,band,src,outcome,company,product,company_url,employees,publicPrivate,geography});
  });
  const entries = Object.entries(groups).sort(([,a],[,b])=>b.length-a.length);
  const makeCohort = (name, members, i) => ({
    id: i,
    name,
    color: COHORT_COLORS[i % COHORT_COLORS.length],
    size: members.length,
    pct: Math.round(members.length / rows.length * 100),
    topInd: [...new Set(members.map(m=>m.ind))].slice(0,3),
    topSrc: [...new Set(members.map(m=>m.src))].slice(0,2),
    topOut: [...new Set(members.map(m=>m.outcome))].slice(0,2),
    members,
  });
  if(entries.length <= MAX_COHORTS){
    return entries.map(([name,members],i)=>makeCohort(name,members,i));
  }
  const named = entries.slice(0, MAX_COHORTS - 1);
  const rest  = entries.slice(MAX_COHORTS - 1).flatMap(([,members])=>members);
  return [
    ...named.map(([name,members],i)=>makeCohort(name,members,i)),
    makeCohort("Other", rest, MAX_COHORTS - 1),
  ];
}
function calcConfidence(gateAnswers,riverData){
  const positive={
    r1_urgency:["Executive mandate / top-down pressure","Recent failure or incident","Budget cycle opening up"],
    i_cost:["Yes — hard numbers","Partial — sense of it but not exact"],
    v_outcome:["Yes — specific and measurable","Somewhat — directional not specific"],
    v_champion:["Yes — identified and motivated","Potential — needs equipping"],
    e_buyer:["Yes — met or confirmed","Probable — know the role"],
    e_process:["Clear — defined steps and timeline","Informal — champion can move it"],
    r2_fit:["Strong fit — ready to advance","Good fit — a few gaps"],
  };
  let score=20;
  Object.entries(positive).forEach(([gid,pos])=>{if(pos.includes(gateAnswers[gid]))score+=10;else if(gateAnswers[gid])score+=3;});
  const filled=RIVER_STAGES.flatMap(s=>s.discovery).filter(p=>riverData[p.id]?.trim().length>10).length;
  score+=filled*4;return Math.min(score,98);
}
function confColor(s){return s>=75?"var(--green)":s>=50?"var(--amber)":"var(--red)";}

// NOTE: No browser-side Anthropic client. All Claude calls route through
// the serverless proxies at /api/claude and /api/claude-stream — they hold
// ANTHROPIC_API_KEY server-side. Do NOT re-introduce VITE_ANTHROPIC_*; it
// would inline the key into the browser bundle.

function extractJSON(text){
  try{
    const clean=text.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
    try{return JSON.parse(clean);}catch{
      const m=clean.match(/\{[\s\S]*\}/);
      return m?JSON.parse(m[0]):null;
    }
  }catch{return null;}
}

// ── SINGLE-CALL BRIEF GENERATION: web search + synthesis in one request ────────
// Claude searches the web AND returns structured JSON in a single API call.
// This avoids the two-step coordination problem entirely.
// ── WEB SEARCH: recent news + jobs only (1 call, max 3 searches) ──────────────
// ── SAFE JSON PARSER ─────────────────────────────────────────────────────────
function safeParseJSON(text){
  try{return JSON.parse(text);}catch{}
  const s=text.replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/[\u2013\u2014]/g,"-").replace(/[\u2026]/g,"...").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,"");
  // Also strip trailing commas before arrays/objects close
  const noTrailing = s.replace(/,\s*([}\]])/g,"$1");
  try{return JSON.parse(noTrailing);}catch{}
  let out="",inStr=false,esc=false;
  for(let i=0;i<s.length;i++){
    const ch=s[i];
    if(esc){out+=ch;esc=false;continue;}
    if(ch==="\\"){out+=ch;esc=true;continue;}
    if(inStr){
      if(ch==="\n"){out+="\\n";continue;}
      if(ch==="\r"){out+="\\r";continue;}
      if(ch==='"'){
        let j=i+1;
        while(j<s.length){if("\n\r \t".includes(s[j])){j++;continue;}if(s[j]==="\\"){j+=2;continue;}break;}
        const nxt=j<s.length?s[j]:"";
        if(nxt===","||nxt==="}"||nxt==="]"||nxt===":"||nxt===""){inStr=false;out+=ch;}
        else out+='\\"';
        continue;
      }
      out+=ch;
    }else{if(ch==='"'){inStr=true;out+=ch;}else out+=ch;}
  }
  try{return JSON.parse(out);}catch(e){console.error("JSON repair failed:",e.message);return null;}
}


// ── PLAIN AI CALL — JSON synthesis from research ──────────────────────────────

async function streamAI(prompt, onChunk, maxTok=2000) {
  const response = await fetch('/api/claude-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTok,
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: '{' }
      ],
    }),
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '{';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const event = JSON.parse(data);
        if (event.type === 'content_block_delta' && event.delta?.text) {
          fullText += event.delta.text;
          onChunk(fullText);
        }
      } catch {}
    }
  }
  try {
    const cleaned = fullText.trim();
    const lastBrace = cleaned.lastIndexOf('}');
    return JSON.parse(lastBrace > 0 ? cleaned.slice(0, lastBrace+1) : cleaned);
  } catch { return null; }
}

async function callAI(prompt){
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  for(let attempt=0; attempt<3; attempt++){
    try{
      const r = await fetch("/api/claude",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:5500,
          temperature:0,
          system:"You are a JSON API. Output only valid JSON. Use only ASCII punctuation — no curly quotes, no em-dashes.",
          messages:[
            {role:"user",content:prompt},
            {role:"assistant",content:"{"},
          ],
        }),
      });
      const d = await r.json();
      if(d.error){
        if(d.error.type==="rate_limit_error"){
          console.warn("callAI rate limit, waiting 15s... attempt", attempt+1);
          await sleep(15000);
          continue;
        }
        console.error("callAI error:",d.error);
        return null;
      }
      const raw=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      if(!raw) return null;
      // If model already included the opening {, don't double up
      const text = raw.startsWith("{") ? raw : "{" + raw;
      console.log("callAI response chars:", text.length, "preview:", text.slice(0,80));

      const last = text.lastIndexOf("}");
      if(last<=0) return null;

      const candidate = text.slice(0, last+1);

      // Try 1: direct parse
      try{return JSON.parse(candidate);}catch{}

      // Try 2: unicode-only sanitize + trailing comma removal
      const sanitized = candidate
        .replace(/[\u2018\u2019]/g,"'")
        .replace(/[\u201C\u201D]/g,'"')
        .replace(/[\u2013\u2014]/g,"-")
        .replace(/[\u2026]/g,"...")
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,"")
        .replace(/,\s*([}\]])/g,"$1"); // strip trailing commas
      try{return JSON.parse(sanitized);}catch{}

      // Try 3: full character-by-character JSON repair
      // - Escapes unescaped double quotes INSIDE string values
      // - Escapes raw newlines only inside strings (structural newlines left as-is)
      // - Correct peek-ahead that skips escape sequences
      const repairJSON = s => {
        let out="", inStr=false, esc=false;
        for(let i=0;i<s.length;i++){
          const ch=s[i];
          if(esc){out+=ch;esc=false;continue;}
          if(ch==="\\"){out+=ch;esc=true;continue;}
          if(inStr){
            if(ch==="\n"){out+="\\n";continue;} // raw newline inside string → escape
            if(ch==="\r"){out+="\\r";continue;}
            if(ch==="\t"){out+="\\t";continue;}
            if(ch==='"'){
              // Peek ahead past whitespace+escape-seqs to classify this quote
              let j=i+1;
              while(j<s.length){
                if(s[j]==="\n"||s[j]==="\r"||s[j]===" "||s[j]==="\t"){j++;continue;}
                if(s[j]==="\\"){j+=2;continue;} // skip escape sequence
                break;
              }
              const nxt=j<s.length?s[j]:"";
              if(nxt===","||nxt==="}"||nxt==="]"||nxt===":"||nxt===""){
                inStr=false;out+=ch; // legitimate closing quote
              }else{
                out+='\\"'; // interior quote — escape it
              }
              continue;
            }
            out+=ch;
          }else{
            if(ch==='"'){inStr=true;out+=ch;continue;}
            out+=ch;
          }
        }
        return out;
      };
      try{return JSON.parse(repairJSON(sanitized));}catch(e){
        console.error("JSON repair failed:",e.message,"pos:",e.message.match(/\d+/)?.[0]);
        console.log("Sample:",sanitized.slice(Math.max(0,parseInt(e.message.match(/\d+/)?.[0]||0)-80),parseInt(e.message.match(/\d+/)?.[0]||0)+80));
      }

      return null;
    }catch(e){console.error("callAI fetch error:",e);return null;}
  }
  return null;
}

// ── GENERATE BRIEF ────────────────────────────────────────────────────────────
// generateBrief is NON-ASYNC so it returns skeleton + raw promises
// immediately. pickAccount (the only caller) then renders the skeleton
// right away and merges each micro-result as it resolves — no blocking
// wait for p1. This cuts time-to-first-paint from ~3-5s to instant.
function generateBrief(member, sellerUrl, sellerDocs, products, selectedCohort, selectedOutcomes, productPageUrl, onStatus, productUrls=[]){
  const co  = member.company;
  const url = member.company_url || co;

  const activeProductUrls = productUrls.filter(u=>u.url.trim()).map(u=>u.url.trim());
  const sellerCtx = sellerDocs.length>0
    ? "SELLER DOCS:\n"+sellerDocs.map(d=>d.label+": "+d.content.slice(0,400)).join("\n")
    : "Seller: "+sellerUrl+(activeProductUrls.length?" | Pages: "+activeProductUrls.join(", "):"");
  const prodCtx = products.filter(p=>p.name.trim()).length>0
    ? "\nPRODUCTS: "+products.filter(p=>p.name.trim()).map(p=>p.name+(p.description?" - "+p.description.slice(0,60):"")).join("; ")
    : "";
  // Every company always wants these — inject as baseline context even if not explicitly selected
  const activeOutcomes = selectedOutcomes?.length>0
    ? selectedOutcomes
    : ["Revenue growth","Customer satisfaction","Compliance","Fraud reduction","Investor returns","Market expansion"];
  const dealCtx = `${selectedCohort?.name||""} | Industry: ${member.ind||""} | Outcomes: ${activeOutcomes.join(", ")}`;
  const universalCtx = `ASSUME: Every company universally wants to grow revenue, expand markets, stay compliant, reduce fraud/risk, satisfy investors, and make customers happy. Frame all briefs through these lenses even when not explicitly stated.\n`+`GARTNER BUYING REALITY: Buyers spend only 17% of their time with vendors. The seller must use that time to demonstrate they already understand the buyer's industry, challenge a widely-held assumption, and make the next step obvious and small. Score accounts on how much they NEED this insight, not just whether they could use the product.`;

  // Base context injected into every prompt
  const base =
    `B2B sales brief about TARGET PROSPECT "${co}" for seller at ${sellerUrl}.\n`+
    `RULE: All fields describe ${co} NOT the seller. ASCII only. Empty string if unknown, never "N/A".\n`+
    `CONSISTENCY: Return EXACTLY the structure shown — same field names, same array lengths.\n`+
    `${universalCtx}\n`+
    `SIGNAL HEURISTICS: Funding <12 months = 18-month buying window; PE acquisition <18 months = cost mandate + 60-90 day budget cycle; hiring "Digital Transformation" = Early Majority; "Innovation/R&D" = Early Adopter; Glassdoor <3.5 = operational pain present.\n`+`SELLER STAGE AWARENESS: Seller is unknown stage. `+`SCENARIO INTELLIGENCE (plain-language categories — do NOT echo these labels in output): `+`If target is in a structurally-difficult industry (heavy manufacturing, aerospace/defense prime contractors, telecom incumbents, energy/utilities, mass-market retail with >100K employees, top-5 US banks): flag as near-impossible for a direct startup sale regardless of stage. `+`If target is a large PRIVATE company in insurance, professional services, or tech (e.g. Bloomberg, SAS, Valve): highlight as a high-fit underserved segment — fast cycles, few incumbents at the table. `+`If target is a regional bank (NOT JPMorgan/BofA/Wells/Citi/Goldman): strong opportunity — underserved by early-stage vendors, pilot-friendly culture. `+`If seller is Seed/Series A: startup-to-F1000 direct sales hover at 23-33% fit — recommend partner/channel motion as primary route. `+`If seller is Series D+: ~35% of F1000 scenarios are strong fit — full enterprise motion viable. `+`CPG split: HPC/Beauty (P&G, Kimberly-Clark) ~62% fit — YES; Food/Beverage (PepsiCo, Kraft) ~49% — departmental only. `+`If target has high union exposure (automotive, aviation, heavy manufacturing): scope explicitly to the knowledge-worker segment.\n`+
    `SELLER CONTEXT (reference only):\n${sellerCtx}${prodCtx}\n`+
    `DEAL: ${dealCtx}\n\n`;

  onStatus("Researching "+co+"...");

  // ── 5 MICRO-CALLS fire simultaneously, each with a tiny schema ───────────
  // User sees the overview card the moment the fastest resolves (~2s)

  // MICRO 1: Company overview card — smallest schema, shows first (streamed)
  const p1 = streamAI(base+
    `Return ONLY raw JSON (start with {) for the company overview:\n`+
    `{"companySnapshot":"3-4 sentences: what ${co} does, revenue scale, employees, HQ, strategic direction",`+
    `"revenue":"e.g. $2.4B (FY2024)","publicPrivate":"e.g. Public (NYSE:MCD)","employeeCount":"e.g. ~200,000",`+
    `"headquarters":"City, State","founded":"Year","website":"domain.com","linkedIn":"linkedin.com/company/name",`+
    `"fundingProfile":"Ownership: PE firm + year acquired, or Series + total raised + lead investor, or Public exchange+ticker",`+
    `"competitors":["Competitor 1","Competitor 2","Competitor 3"],`+
    `"watchOuts":["PROCUREMENT RISK: Structurally-difficult industries include heavy manufacturing, aerospace/defense prime, telecom incumbents, oil/gas, utilities, mass-market retail with >100K employees, and the top-5 US banks. If this target falls in one of those, direct startup sales are near-impossible regardless of the seller's stage — flag and recommend a partner/channel path or scope down to a specific business unit.","INCUMBENT RISK: which Oracle/SAP/Workday/Amex/Salesforce relationship are we displacing or landing adjacent to? Adjacent is almost always the right first motion. Series A-B sellers cannot displace deep incumbents.","STAGE CREDIBILITY: Seed/Series A selling to >50K-employee companies averages 23-33% fit. Series C+ is usually required for meaningful enterprise traction. PE-acquired sellers have a trust advantage."]}`,
    ()=>{}, 1800
  );

  // MICRO 2: Executives — fires simultaneously, merges when ready (streamed)
  const p2 = streamAI(base+
    `Return ONLY raw JSON (start with {) for the 3 key executives at ${co}:\n`+
    `{"keyExecutives":[`+
    `{"name":"REQUIRED real current CEO name","title":"CEO","initials":"XX","background":"Prior role in 1 sentence","angle":"Board mandate and what they are measured on. 2 sentences."},`+
    `{"name":"REQUIRED real current CHRO or CPO name","title":"exact title","initials":"XX","background":"HR/people focus 1 sentence","angle":"What winning looks like for them personally. 2 sentences."},`+
    `{"name":"REQUIRED real current CFO or COO name","title":"exact title","initials":"XX","background":"Financial/ops focus 1 sentence","angle":"How they evaluate spend decisions. 2 sentences."}],`+
    `"sellerSnapshot":"2 sentences on seller most relevant offerings for ${co}"}`,
    ()=>{}, 1800
  );

  // MICRO 3: Strategy + opening angle — shows after execs (streamed)
  const p3 = streamAI(base+
    `Return ONLY raw JSON (start with {) for strategy and seller angle:\n`+
    `{"strategicTheme":"2-3 sentences on ${co} current strategic direction and priorities",`+
    `"sellerOpportunity":"2-3 sentences: why ${sellerUrl} is well-positioned right now for ${co} — the why-you-why-now",`+
    `"openingAngle":"1-2 sharp sentences referencing something real about ${co}. Reframe an assumption. Sounds human not scripted.",`+
    `"publicSentiment":{`+`"onlineSentiment":"2-3 sentences synthesizing what customers, employees, and media say about ${co} right now. Be specific — name sources and tone.",`+`"glassdoorRating":"Glassdoor employer rating as a number e.g. 3.8 — or empty if unknown",`+`"g2Rating":"G2 product rating as a number e.g. 4.2 out of 5 — or empty if not a software company",`+`"npsSignal":"Estimated NPS signal: if you know ${co} publishes NPS or CSAT data, cite it. Otherwise describe customer loyalty signals (high churn, vocal advocates, renewal rates mentioned in press)",`+`"trustpilotRating":"Trustpilot score as a number if known — or empty",`+`"employeeScore":"Glassdoor CEO approval % or Indeed rating if known — signals culture and operational health",`+`"standoutReview":{"text":"Most revealing customer or employee quote or paraphrase — something a seller would want to know","source":"G2 / Glassdoor / Trustpilot / analyst / press","sentiment":"positive or negative"},`+`"salesAngle":"1 sentence: how the seller should use this sentiment context in the discovery conversation"}}`,
    ()=>{}, 2200
  );

  // MICRO 4: Solution mapping + contacts — shows after strategy (streamed)
  const p4 = streamAI(base+
    `Return ONLY raw JSON (start with {) for solution fit and contacts:\n`+
    `Apply Dunford (Obviously Awesome) positioning and Osterwalder (Value Proposition Canvas) to map seller solutions to ${co}.\n`+`ASSUME ${co} universally wants to: grow revenue, expand, stay compliant, reduce fraud/risk, satisfy investors, and make customers happy.\n`+`For each solution: (1) which universal imperative does it serve? (2) what job does it do? (3) what pain does it relieve? (4) what gain does it create?\n`+`{"solutionMapping":[`+
    `{"product":"Specific ${sellerUrl} offering","fit":"Job-to-be-done it performs (Osterwalder) → specific pain it relieves → gain it creates for ${co}. Grounded in a real signal."},`+
    `{"product":"Second offering if applicable","fit":""},`+
    `{"product":"Third offering if applicable","fit":""}],`+
    `"caseStudies":[{"title":"Relevant case study or named customer","customer":"","relevance":"Why relevant to ${co}"},{"title":"","customer":"","relevance":""}],`+
    `"keyContacts":[{"name":"VP/Director NOT C-suite — real name if known","title":"Full title","initials":"XX","angle":"Why they feel this pain daily and how to reach them"},{"name":"","title":"","initials":"","angle":""}],`+
    `"techStack":{"crm":"if known","erp":"if known","hris":"if known","marketing":"if known","payments":"if known","analytics":"if known","infrastructure":"if known","other":[]},`+
    `"processMaturity":{"dmiacStage":"Define|Measure|Analyze|Improve|Control","maturityNote":"1 sentence: where they are and what it means for seller entry","processGaps":["Gap 1","Gap 2"]}}`,
    ()=>{}, 2400
  );

  // MICRO 5: Live search — headlines, roles, signals
  const p5 = (async()=>{
    try{
      const prompt =
        `Search for recent information about "${co}":\n`+
        `1. News from 2024-2025: headlines, M&A, leadership changes, funding\n`+
        `2. Ratings and sentiment: search Glassdoor, G2, Trustpilot, and any published NPS or CSAT data for "${co}"\n`+
        `3. Open roles on their careers page\n`+
        `4. Growth signals or buying indicators\n`+
        `Return ONLY raw JSON (start with {):\n`+
        `{"recentHeadlines":[{"headline":"Headline + source + date","relevance":"Why it matters for a sale"},{"headline":"","relevance":""},{"headline":"","relevance":""}],`+
        `"openRoles":{"summary":"What hiring pattern reveals about priorities","roles":[{"title":"","dept":"","signal":""},{"title":"","dept":"","signal":""},{"title":"","dept":"","signal":""}]},`+
        `"recentSignals":["Most actionable buying signal","Second","Third"],`+
        `"growthSignals":["Growth indicator with evidence","Second"],`+
        `"workforceProfile":{"knowledgeWorkerPct":"estimated % of salaried/knowledge workers vs hourly","unionizedPct":"estimated % unionized if known","remotePolicy":"remote/hybrid/in-office","avgTenure":"if findable"},`+
        `"cultureProfile":{"coreValues":"2-3 stated company values","communicationStyle":"formal/informal","decisionMaking":"top-down/consensus/distributed","sellerLanguageHint":"the vocabulary and tone this company responds to"},`+
        `"incumbentVendors":{"hrSystem":"e.g. Workday/SAP/Oracle","financeSystem":"e.g. SAP/NetSuite","crmSystem":"e.g. Salesforce/Dynamics","cardProvider":"e.g. Amex/Citi"},`+
        `"sentimentScores":{"glassdoorRating":"rating found or empty","g2Rating":"rating found or empty","trustpilotRating":"rating found or empty","npsSignal":"any NPS or CSAT data found or sentiment description","standoutReview":{"text":"best quote found","source":"source","sentiment":"positive or negative"}},`+
        `"companySnapshot":"Updated 2-3 sentence snapshot with any new facts"}`;
      const r = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:1800,
          temperature:0,
          tools:[{type:"web_search_20250305",name:"web_search",max_uses:1}],
          messages:[{role:"user",content:prompt},{role:"assistant",content:"{"}],
        }),
      });
      const d=await r.json();
      if(d.error) return null;
      const raw=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      return safeParseJSON(raw.startsWith("{")?raw:"{"+raw);
    }catch(e){console.warn("Live search failed:",e.message);return null;}
  })();

  // Skeleton returned instantly. pickAccount renders it, then merges
  // each micro-result as its promise resolves. No await here.
  const skeleton = {
    ...BLANK_BRIEF,
    companySnapshot: `Researching ${co}...`,
    _loadingSections: {overview:true, executives:true, strategy:true, solutions:true, live:true},
  };

  // Per-section merger functions, applied via setBrief(prev => merger(prev))
  const mergeOverview = (r1) => (prev) => {
    if (!prev) return prev;
    if (!r1 || typeof r1 !== "object") {
      return {...prev, _error: (prev._error || "Brief generation partial — Overview failed. Try Regenerate."),
              _loadingSections: {...(prev._loadingSections||{}), overview:false}};
    }
    return {...prev, ...r1,
            _loadingSections: {...(prev._loadingSections||{}), overview:false}};
  };
  const mergeExecs = (r2) => (prev) => {
    if (!prev) return prev;
    const next = {...prev, _loadingSections: {...(prev._loadingSections||{}), executives:false}};
    if (r2?.keyExecutives?.length) next.keyExecutives = r2.keyExecutives;
    if (r2?.sellerSnapshot) next.sellerSnapshot = r2.sellerSnapshot;
    return next;
  };
  const mergeStrategy = (r3) => (prev) => {
    if (!prev) return prev;
    const next = {...prev, _loadingSections: {...(prev._loadingSections||{}), strategy:false}};
    if (r3?.strategicTheme) next.strategicTheme = r3.strategicTheme;
    if (r3?.sellerOpportunity) next.sellerOpportunity = r3.sellerOpportunity;
    if (r3?.openingAngle) next.openingAngle = r3.openingAngle;
    if (r3?.publicSentiment?.onlineSentiment || r3?.publicSentiment?.glassdoorRating) {
      next.publicSentiment = {...next.publicSentiment, ...r3.publicSentiment};
    }
    return next;
  };
  const mergeSolutions = (r4) => (prev) => {
    if (!prev) return prev;
    const next = {...prev, _loadingSections: {...(prev._loadingSections||{}), solutions:false}};
    if (r4?.solutionMapping?.some(s=>s?.product)) next.solutionMapping = r4.solutionMapping;
    if (r4?.caseStudies?.some(c=>c?.title)) next.caseStudies = r4.caseStudies;
    if (r4?.keyContacts?.some(c=>c?.name||c?.title)) next.keyContacts = r4.keyContacts;
    if (r4?.techStack) next.techStack = r4.techStack;
    if (r4?.processMaturity?.dmiacStage) next.processMaturity = r4.processMaturity;
    return next;
  };
  const mergeLive = (r5) => (prev) => {
    if (!prev) return prev;
    const next = {...prev, _loadingSections: {...(prev._loadingSections||{}), live:false}};
    if (!r5) return next;
    const errorWords = ["unable","cannot","search failed","not available","web search"];
    const cleanHL = (r5.recentHeadlines||[]).filter(h => {
      const t = (h?.headline||"").toLowerCase();
      return h?.headline && h.headline.length > 10 && !errorWords.some(w=>t.includes(w));
    });
    if (cleanHL.length) next.recentHeadlines = cleanHL;
    if (r5.openRoles?.summary) next.openRoles = r5.openRoles;
    if (r5.recentSignals?.some(s=>s)) next.recentSignals = r5.recentSignals;
    if (r5.growthSignals?.some(s=>s)) next.growthSignals = r5.growthSignals;
    const snapOk = r5.companySnapshot?.length > 50 && !errorWords.some(w=>r5.companySnapshot.toLowerCase().includes(w));
    if (snapOk) next.companySnapshot = r5.companySnapshot;
    if (r5.workforceProfile) next.workforceProfile = r5.workforceProfile;
    if (r5.cultureProfile) next.cultureProfile = r5.cultureProfile;
    if (r5.incumbentVendors) next.incumbentVendors = r5.incumbentVendors;
    if (r5.sentimentScores) {
      const ss = r5.sentimentScores;
      next.publicSentiment = {...next.publicSentiment,
        glassdoorRating: ss.glassdoorRating || next.publicSentiment?.glassdoorRating || "",
        g2Rating: ss.g2Rating || "",
        trustpilotRating: ss.trustpilotRating || "",
        npsSignal: ss.npsSignal || "",
        employeeScore: ss.employeeScore || "",
        standoutReview: ss.standoutReview?.text ? ss.standoutReview : next.publicSentiment?.standoutReview || {},
      };
    }
    return next;
  };

  return {
    skeleton,
    mergers: {
      overview:  p1.then(mergeOverview).catch(e => mergeOverview(null)),
      executives:p2.then(mergeExecs).catch(e => mergeExecs(null)),
      strategy:  p3.then(mergeStrategy).catch(e => mergeStrategy(null)),
      solutions: p4.then(mergeSolutions).catch(e => mergeSolutions(null)),
      live:      p5.then(mergeLive).catch(e => mergeLive(null)),
    },
    allDone: Promise.allSettled([p1,p2,p3,p4,p5]),
  };
}


function exportToExcel(brief,gateAnswers,riverData,postCall,account,cohort,outcomes,sellerUrl,confidence){
  const ts=new Date().toISOString().slice(0,10);
  const co=account?.company||"Account";
  const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const H="font-family:Arial;font-size:11pt;font-weight:bold;background:#1a1a18;color:#ffffff;padding:5px 8px;";
  const C="font-family:Arial;font-size:10pt;padding:5px 8px;vertical-align:top;";
  const S="font-family:Arial;font-size:10pt;font-weight:bold;color:#8B6F47;padding:5px 8px;";
  const mkRow=(cells,isHeader)=>'<tr>'+(Array.isArray(cells)?cells:[cells]).map((c,i)=>'<td style="'+(isHeader&&i===0?H:typeof c==="string"&&c&&c===c.toUpperCase()&&i===0&&c.length>2&&!/[a-z]/.test(c)?S:C)+'">'+esc(c)+'</td>').join('')+'</tr>';
  const mkSheet=(name,rows)=>{
    let t=`<table x:Name="${esc(name)}"><tbody>`;
    rows.forEach(r=>t+=mkRow(r,false));
    return t+`</tbody></table>`;
  };

  const sheets=[
    {name:"Account Overview",rows:[
      ["ACCOUNT OVERVIEW",""],["",""],
      ["Company",co],["Industry",account?.ind||""],["Deal Size (ACV)",account?.acv>0?"$"+account.acv.toLocaleString():""],
      ["Lead Source",account?.src||""],["Website",account?.company_url||""],
      ["Cohort",cohort?.name||""],["Target Outcomes",outcomes.join(", ")],
      ["Selling Org",sellerUrl||""],["Deal Confidence",`${confidence}%`],
      ["",""],["COMPANY SNAPSHOT",""],["",brief?.companySnapshot||""],
      ["",""],["STRATEGIC THEME",""],["",brief?.strategicTheme||""],
      ["",""],["WHY YOU · WHY NOW (Seller Opportunity)",""],["",brief?.sellerOpportunity||""],
      ["",""],["FUNDING PROFILE",""],["",brief?.fundingProfile||""],
      ["",""],["INVESTORS & CAP TABLE",""],
      ...(brief?.investorProfile||[]).filter(Boolean).map((inv,i)=>[`Investor ${i+1}`,inv]),
      ["",""],["LEADERSHIP TEAM","","",""],
      ["Name","Title","Background","Engagement Angle"],
      ...(brief?.leadershipTeam||[]).filter(l=>l?.name).map(l=>[l.name||"",l.title||"",l.background||"",l.angle||""]),
      ["",""],["RECENT HEADLINES",""],
      ...(brief?.recentHeadlines||[]).filter(Boolean).map((h,i)=>[`Headline ${i+1}`,h]),
      ["",""],["M&A & STRATEGIC ACTIVITY",""],["",brief?.maActivity||""],
      ["",""],["NEW PRODUCTS & LAUNCHES",""],
      ...(brief?.productLaunches||[]).filter(Boolean).map((p,i)=>[`Launch ${i+1}`,p]),
      ["",""],["CUSTOMER WINS & GROWTH",""],
      ...(brief?.customerWins||[]).filter(Boolean).map((w,i)=>[`Win ${i+1}`,w]),
      ["",""],["GROWTH SIGNALS",""],
      ...(brief?.growthSignals||[]).filter(Boolean).map((g,i)=>[`Signal ${i+1}`,g]),
      ["",""],["HIRING SIGNALS",""],
      ...(brief?.hiringSignals||[]).filter(Boolean).map((h,i)=>[`Signal ${i+1}`,h]),
      ["",""],["TOP BUYING SIGNALS",""],
      ...(brief?.recentSignals||[]).filter(Boolean).map((s,i)=>[`Signal ${i+1}`,s]),
    ]},
    {name:"RIVER Brief",rows:[
      ["RIVER BRIEF — PRE-CALL HYPOTHESIS",""],["",""],
      ["STAGE","HYPOTHESIS"],
      ...RIVER_STAGES.map((s,i)=>[`${s.letter} — ${s.label}`,brief?.riverHypothesis?.[RKEYS[i]]||""]),
      ["",""],["OPENING ANGLE",""],["",brief?.openingAngle||""],
      ["",""],["RECENT SIGNALS",""],
      ...(brief?.recentSignals||[]).filter(Boolean).map((s,i)=>[`Signal ${i+1}`,s]),
    ]},
    {name:"Solution Mapping",rows:[
      ["SOLUTION MAPPING",""],["",""],
      ["PRODUCT / SERVICE","FIT RATIONALE"],
      ...(brief?.solutionMapping||[]).filter(s=>s?.product).map(s=>[s.product,s.fit]),
      ["",""],["LIKELY COMPETITORS",""],
      ...(brief?.competitors||[]).filter(Boolean).map(c=>[c,""]),
      ["",""],["KEY CONTACTS","TITLE","ENGAGEMENT ANGLE"],
      ...(brief?.keyContacts||[]).filter(c=>c?.name).map(c=>[c.name,c.title,c.angle]),
      ["",""],["WATCH-OUTS",""],
      ...(brief?.watchOuts||[]).filter(Boolean).map(w=>[w,""]),
    ]},
    {name:"Discovery Capture",rows:[
      ["DISCOVERY CAPTURE","",""],["","",""],
      ["STAGE","GATE QUESTION","ANSWER CAPTURED"],
      ...RIVER_STAGES.flatMap(s=>s.gates.map(g=>[s.label,g.q,gateAnswers[g.id]||"—"])),
      ["","",""],["STAGE","DISCOVERY PROMPT","REP NOTES"],
      ...RIVER_STAGES.flatMap(s=>s.discovery.map(p=>[s.label,p.label,riverData[p.id]||"—"])),
    ]},
    {name:"RIVER Scorecard",rows:[
      ["RIVER SCORECARD","",""],["","",""],
      ["STAGE","PRE-CALL HYPOTHESIS","POST-CALL FINDING"],
      ...RIVER_STAGES.map((s,i)=>[`${s.letter} — ${s.label}`,brief?.riverHypothesis?.[RKEYS[i]]||"",postCall?.riverScorecard?.[RKEYS[i]]||"Not yet completed"]),
    ]},
    {name:"Post-Call Route",rows:[
      ["POST-CALL ROUTE",""],["",""],
      ["DEAL ROUTE",postCall?.dealRoute||"Not yet generated"],
      ["ROUTE REASON",postCall?.dealRouteReason||""],
      ["TOP RISK",postCall?.dealRisk||""],
      ["DEAL CONFIDENCE",`${confidence}%`],
      ["",""],["CALL SUMMARY",""],["",postCall?.callSummary||""],
      ["",""],["NEXT STEPS",""],
      ...(postCall?.nextSteps||[]).map((s,i)=>[`${i+1}.`,s]),
      ["",""],["CRM NOTE",""],["",postCall?.crmNote||""],
      ["",""],["FOLLOW-UP EMAIL",""],
      ["Subject",postCall?.emailSubject||""],["Body",postCall?.emailBody||""],
    ]},
    {name:"CRM Upload",rows:[
      ["Company","Industry","ACV","Lead Source","Cohort","Target Outcomes","Deal Confidence","Deal Route","Top Risk","R — Reality","I — Impact","V — Vision","E — Entry Points","R — Route","Next Step 1","Next Step 2","Next Step 3","Follow-Up Subject","CRM Note"],
      [co,account?.ind||"",account?.acv>0?account.acv:"",account?.src||"",cohort?.name||"",outcomes.join("; "),`${confidence}%`,postCall?.dealRoute||"",postCall?.dealRisk||"",brief?.riverHypothesis?.reality||"",brief?.riverHypothesis?.impact||"",brief?.riverHypothesis?.vision||"",brief?.riverHypothesis?.entryPoints||"",brief?.riverHypothesis?.route||"",postCall?.nextSteps?.[0]||"",postCall?.nextSteps?.[1]||"",postCall?.nextSteps?.[2]||"",postCall?.emailSubject||"",postCall?.crmNote||""],
    ]},
  ];

  let html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>`;
  sheets.forEach(s=>{html+=`<x:ExcelWorksheet><x:Name>${esc(s.name)}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>`;});
  html+=`</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>`;
  sheets.forEach(s=>{html+=mkSheet(s.name,s.rows);});
  html+=`</body></html>`;

  const blob=new Blob([html],{type:"application/vnd.ms-excel;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=`RIVER_${co.replace(/\s+/g,"_")}_${ts}.xls`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── BRIEF LOADER ─────────────────────────────────────────────────────────────
const LOADER_QUIPS = [
  "Doing the homework you definitely weren't going to do...",
  "Figuring out what keeps their CFO up at night...",
  "Reading the 10-K so you look like a genius...",
  "Making you the most dangerous person in the room...",
  "Finding the angle they didn't know they had...",
  "Connecting dots across the org chart...",
  "Building your unfair advantage...",
  "Translating their problems into your opportunity...",
  "Turning public intel into private insight...",
  "Triangulating their priorities...",
  "Reverse-engineering their buying criteria...",
  "Mapping their world to your solutions...",
  "Becoming an expert in 30 seconds...",
  "Surfacing the signal buried in the noise...",
  "Crafting the brief they didn't know they needed...",
  "Almost there — this is the good part...",
  "Preparing your strongest opening...",
  "Making sure you walk in ready...",
];
function BriefLoader({ company, status }) {
  const [quip, setQuip] = useState(LOADER_QUIPS[Math.floor(Math.random()*LOADER_QUIPS.length)]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuip(LOADER_QUIPS[Math.floor(Math.random()*LOADER_QUIPS.length)]);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="load-box">
      <div className="load-status">
        <div className="load-spin"/>
        <span>{status || "Starting..."}</span>
      </div>
      <div style={{height:3,background:"var(--tan-3)",borderRadius:2,overflow:"hidden",margin:"14px 0"}}>
        <div style={{height:"100%",background:"linear-gradient(90deg,var(--tan-0),var(--navy),var(--green),var(--tan-0))",backgroundSize:"300% 100%",animation:"shimmer 2.5s linear infinite",borderRadius:2}}/>
      </div>
      <div style={{
        fontSize:12,color:"var(--tan-0)",textAlign:"center",fontStyle:"italic",
        transition:"opacity 0.3s",opacity:fade?1:0,minHeight:20,
      }}>
        {quip}
      </div>
      <div style={{fontSize:10,color:"#bbb",textAlign:"center",marginTop:8}}>
        Researching {company}...
      </div>
    </div>
  );
}

// ── AUTH / PASSWORD GATE ──────────────────────────────────────────────────────
// AuthShell is at module scope (NOT inside PasswordGate) so its component
// identity is stable across keystroke re-renders. Defining it inside
// PasswordGate caused React to unmount the form on every character typed —
// manifesting as password-field focus jumping back to the email field.
function AuthShell({ children }) {
  return (
    <div className="app">
      <header className="header">
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          <div className="logo">Cambrian <span>Catalyst</span></div>
          <div style={{fontSize:9,letterSpacing:"0.7px",color:"var(--ink-3)",fontWeight:700,textTransform:"uppercase"}}>
            Reality · Impact · Vision · Entry · Route
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,color:"var(--tan-0)",letterSpacing:"0.5px",textTransform:"uppercase"}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"var(--tan-0)"}}/>
          Private Beta
        </div>
      </header>
      {children}
      <footer className="footer">© 2026 Cambrian Catalyst LLC · Seattle, WA</footer>
    </div>
  );
}

function PasswordGate({ onAuth }) {
  const[mode,setMode]=React.useState("signup");
  const[email,setEmail]=React.useState("");
  const[pw,setPw]=React.useState("");
  const[first,setFirst]=React.useState("");
  const[last,setLast]=React.useState("");
  const[err,setErr]=React.useState("");
  const[loading,setLoading]=React.useState(false);
  const[verifying,setVerifying]=React.useState(false);
  const[guestOk,setGuestOk]=React.useState(false);

  React.useEffect(()=>{
    // Clear any legacy password-gate session data
    sessionStorage.removeItem('cambrian_auth');
    const token=localStorage.getItem('sb_token');
    if(token){
      sbGetUser(token).then(u=>{
        if(u?.id){
          onAuth(u,token); // valid token — skip gate
        } else {
          localStorage.removeItem('sb_token'); // stale — clear and show form
        }
      });
    }
  },[]);

  if(guestOk){onAuth(null,'');return null;}

  const submit=async()=>{
    setErr("");setLoading(true);
    if(mode==="signup"){
      const d=await sbAuth('signup',{email,password:pw,data:{first_name:first,last_name:last,full_name:first+' '+last}});
      if(d.access_token){localStorage.setItem('sb_token',d.access_token);onAuth(d.user,d.access_token);}
      else if(d.id){setVerifying(true);}
      else setErr(d.msg||d.error_description||'Sign up failed');
    } else {
      const d=await sbAuth('token?grant_type=password',{email,password:pw});
      if(d.access_token){localStorage.setItem('sb_token',d.access_token);onAuth(d.user,d.access_token);}
      else setErr(d.error_description||'Incorrect email or password');
    }
    setLoading(false);
  };

  if(verifying) return (
    <AuthShell>
      <div className="page" style={{maxWidth:520,paddingTop:48}}>
        <div className="card" style={{textAlign:"center",padding:"36px 28px"}}>
          <div style={{fontSize:38,marginBottom:12}}>📬</div>
          <div className="page-title" style={{marginBottom:8}}>Check your email</div>
          <div className="page-sub" style={{margin:"0 auto 20px"}}>
            We sent a verification link to <strong style={{color:"var(--ink-0)"}}>{email}</strong>. Click it, then come back and sign in.
          </div>
          <button className="btn btn-secondary" onClick={()=>{setVerifying(false);setMode("signin");}}>← Back to Sign In</button>
        </div>
      </div>
    </AuthShell>
  );

  return (
    <AuthShell>
      <div className="page" style={{maxWidth:480,paddingTop:48}}>
        <div className="page-title">
          {mode==="signup" ? "Create your account" : "Welcome back"}
        </div>
        <div className="page-sub">
          {mode==="signup"
            ? "Start building account briefs, RIVER hypotheses, and post-call routing in minutes. Free during the private beta."
            : "Sign in to continue your sales intelligence work."}
        </div>

        <div className="card" style={{padding:22}}>
          <div className="pw-tabs" role="tablist" style={{marginBottom:18}}>
            {[["signup","Create Account"],["signin","Sign In"]].map(([m,label])=>(
              <button key={m} role="tab" aria-selected={mode===m}
                className={`pw-tab ${mode===m?"active":""}`}
                onClick={()=>{setMode(m);setErr("");}}>
                {label}
              </button>
            ))}
          </div>

          {mode==="signup" && (
            <div className="field-grid-2" style={{marginBottom:10}}>
              <input placeholder="First name" value={first} onChange={e=>setFirst(e.target.value)} autoFocus/>
              <input placeholder="Last name"  value={last}  onChange={e=>setLast(e.target.value)}/>
            </div>
          )}
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} autoFocus={mode==="signin"} onKeyDown={e=>e.key==="Enter"&&pw&&submit()} style={{marginBottom:10}}/>
          <input type="password" placeholder={mode==="signup"?"Password (8+ characters)":"Password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{marginBottom:10}}/>

          {err && <div className="pw-error">{err}</div>}

          <button className="btn btn-primary btn-lg"
            style={{width:"100%",justifyContent:"center",opacity:loading?0.7:1,marginTop:4}}
            onClick={submit}
            disabled={loading||!email||!pw||(mode==="signup"&&(!first||!last))}>
            {loading ? (mode==="signup"?"Creating account…":"Signing in…") : (mode==="signup"?"Create Account →":"Sign In →")}
          </button>
        </div>

        <div style={{textAlign:"center",marginTop:16}}>
          <button className="pw-guest" onClick={()=>setGuestOk(true)}>
            Continue as guest · work won't be saved
          </button>
        </div>
      </div>
    </AuthShell>
  );
}

// ── PIE CHART COMPONENT ───────────────────────────────────────────────────────

function PieChart({data, size=120}){
  // data: [{label, value, color}]
  const total = data.reduce((s,d)=>s+d.value,0);
  if(!total) return null;
  const r = size/2 - 4;
  const cx = size/2, cy = size/2;
  let angle = -Math.PI/2;
  const slices = data.map(d=>{
    const pct = d.value/total;
    const a0 = angle, a1 = angle + pct*2*Math.PI;
    angle = a1;
    return {...d, pct, a0, a1};
  });
  const arc = (a0,a1,r)=>{
    const x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0);
    const x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
    const large = a1-a0>Math.PI?1:0;
    return `M${cx},${cy} L${x0},${y0} A${r},${r},0,${large},1,${x1},${y1} Z`;
  };
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      {slices.map((s,i)=>(
        <path key={i} d={arc(s.a0,s.a1,r)} fill={s.color} stroke="#fff" strokeWidth={1.5}/>
      ))}
      <circle cx={cx} cy={cy} r={r*0.42} fill="#fff"/>
    </svg>
  );
}

// ── COHORT DRILL-DOWN COMPONENT ───────────────────────────────────────────────

function CohortDrillDown({cohort, selected, onSelect, onPickAccount, fitScores = {}, fitScoring = false}){
  const [open, setOpen] = useState(selected);
  useEffect(()=>{if(selected)setOpen(true);},[selected]);

  // Compute breakdowns
  const count = (members, key) => {
    const map = {};
    members.forEach(m=>{ const v=m[key]||"Unknown"; map[v]=(map[v]||0)+1; });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).map(([label,value])=>({label,value}));
  };
  const indCounts  = count(cohort.members,"ind");
  const srcCounts  = count(cohort.members,"src");
  const ppCounts   = count(cohort.members,"publicPrivate");
  const geoCounts  = count(cohort.members,"geography");
  const empBands   = (()=>{
    const bands={"<500":0,"500–5K":0,"5K–50K":0,"50K+":0,"Unknown":0};
    cohort.members.forEach(m=>{
      const raw=(m.employees||"").replace(/[^0-9]/g,"");
      const n=parseInt(raw)||0;
      if(!n||!m.employees) bands["Unknown"]++;
      else if(n<500)   bands["<500"]++;
      else if(n<5000)  bands["500–5K"]++;
      else if(n<50000) bands["5K–50K"]++;
      else             bands["50K+"]++;
    });
    return Object.entries(bands).filter(([,v])=>v>0).map(([label,value])=>({label,value}));
  })();

  const hasPP     = cohort.members.some(m=>m.publicPrivate);
  const hasGeo    = cohort.members.some(m=>m.geography);
  const hasEmp    = cohort.members.some(m=>m.employees);

  const IND_COLORS = ["#4A7A9B","#6B8E6B","#9B6B8E","#7A7A4A","#8B6F47","#4A6B8E","#6B4A6B"];
  const SRC_COLORS = ["#2E6B2E","#8B6F47","#1B3A6B","#6B3A3A","#3A6B6B","#6B6B3A"];
  const PP_COLORS  = ["#1B3A6B","#2E6B2E","#8B6F47","#9B2C2C","#6B3A7A"];
  const GEO_COLORS = ["#2E6B2E","#1B3A6B","#8B6F47","#9B2C2C"];
  const EMP_COLORS = ["#4A7A9B","#6B8E6B","#9B6B8E","#7A7A4A","#aaa"];

  const MiniPie = ({title, data, colors}) => data.length<2?null:(
    <div className="pie-card">
      <div className="pie-title">{title}</div>
      <div className="pie-wrap">
        <PieChart size={90} data={data.slice(0,6).map((d,i)=>({...d,color:colors[i%colors.length]}))}/>
        <div className="pie-legend">
          {data.slice(0,5).map((d,i)=>(
            <div key={i} className="pie-legend-item">
              <div className="pie-legend-dot" style={{background:colors[i%colors.length]}}/>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:80}}>{d.label}</span>
              <span className="pie-legend-val">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return(
    <div className={`cohort-drill ${selected?"":""}`}>
      <div className={`cohort-drill-hdr ${open?"open":""}`}
        onClick={()=>{setOpen(o=>!o);onSelect();}}>
        <div className="cohort-drill-left">
          <div className="cohort-drill-dot" style={{background:cohort.color}}/>
          <div>
            <div className="cohort-drill-name">{cohort.name}</div>
            <div className="cohort-drill-meta">{cohort.size} accounts · {cohort.pct}% of base</div>
          </div>
        </div>
        <div className="cohort-drill-right">
          <div className="cohort-drill-acv">{cohort.size} account{cohort.size!==1?"s":""}</div>
          <div className="cohort-drill-toggle">{open?"▲ Collapse":"▼ Drill Down"}</div>
        </div>
      </div>

      {open&&(
        <div className="cohort-drill-body">
          {/* Breakdown charts — only shown if data present */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,margin:"12px 0"}}>
            <MiniPie title="By Industry"    data={indCounts}  colors={IND_COLORS}/>
            {hasPP&&<MiniPie title="Public vs Private" data={ppCounts}   colors={PP_COLORS}/>}
            {hasGeo&&<MiniPie title="Domestic vs International" data={geoCounts} colors={GEO_COLORS}/>}
            {hasEmp&&<MiniPie title="Org Size (Employees)" data={empBands} colors={EMP_COLORS}/>}
            <MiniPie title="By Lead Source" data={srcCounts}  colors={SRC_COLORS}/>
          </div>

          {/* Account table */}
          <table className="cohort-member-table">
            <thead>
              <tr>
                <th>Company</th><th>Industry</th><th>Org Size</th><th>Ownership</th><th>Geography</th><th>Fit Check</th><th></th>
              </tr>
            </thead>
            <tbody>
              {cohort.members.sort((a,b)=>{
                const sa=fitScores[a.company]?.score??50;
                const sb=fitScores[b.company]?.score??50;
                return sb-sa;
              }).map((m,i)=>(
                <tr key={i} style={{cursor:"pointer"}} onClick={()=>onPickAccount&&onPickAccount(m)}>
                  <td style={{fontWeight:600,color:"var(--ink-0)"}}>
                    {m.company}
                    {m.company_url&&<div style={{fontSize:11,color:"#aaa",fontWeight:400}}>🌐 {m.company_url}</div>}
                  </td>
                  <td style={{color:"#555"}}>{m.ind||"—"}</td>
                  <td style={{color:"#555",fontSize:12}}>{m.employees||"—"}</td>
                  <td style={{fontSize:12}}>
                    {m.publicPrivate?(()=>{
                      const ot=(fitScores[m.company]?.ownershipType)||"";
                      const c=ot==="public"?"var(--navy)":ot==="pe"?"#6B3A3A":ot==="vc"?"var(--green)":"#555";
                      const bg=ot==="public"?"var(--navy-bg)":ot==="pe"?"var(--red-bg)":ot==="vc"?"var(--green-bg)":"var(--bg-0)";
                      return<span style={{background:bg,color:c,border:"1px solid "+c+"44",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{m.publicPrivate}</span>;
                    })():"—"}
                  </td>
                  <td style={{color:"#555",fontSize:12}}>{m.geography||"—"}</td>
                  <td>{fitScores&&fitScores[m.company]?(
                    <div style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:12,
                      background:fitScores[m.company].bg,color:fitScores[m.company].color,
                      border:"1px solid "+fitScores[m.company].color+"44",whiteSpace:"nowrap",display:"inline-block"}}
                      title={fitScores[m.company].reason}>
                      {fitScores[m.company].score}% · {fitScores[m.company].label}
                    </div>
                  ):fitScoring?<span style={{fontSize:11,color:"#aaa"}}>scoring…</span>:"—"}</td>
                  <td><button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();onPickAccount&&onPickAccount(m);}}>Research →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── RIVER FIELD CARD — Quick Summary + Expand (must be a component, not inline) ──
function RiverFieldCard({fieldKey, label, icon, sub, color, value, onChange}){
  const [expanded, setExpanded] = useState(false);
  const full = typeof value === "string" ? value : (value ? String(value) : "");
  const sentEnd = full.search(/[.!?]\s/);
  const summary = sentEnd>0&&sentEnd<180 ? full.slice(0,sentEnd+1) : full.slice(0,160)+(full.length>160?"...":"");
  const needsExpand = full.length > summary.length+2;
  return(
    <div className="bb" style={{marginBottom:10,borderLeft:"3px solid "+color,borderRadius:10}}>
      <div className="bb-hdr" style={{paddingBottom:6}}>
        <div style={{fontSize:18,lineHeight:1}}>{icon}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Lora,serif",fontSize:14,fontWeight:600,color:"var(--ink-0)"}}>{label}</div>
          <div style={{fontSize:11,color:"#999",marginTop:1}}>{sub}</div>
        </div>
        {needsExpand&&(
          <button onClick={()=>setExpanded(e=>!e)}
            style={{fontSize:11,color:color,fontWeight:600,border:"none",cursor:"pointer",padding:"3px 10px",borderRadius:6,background:color+"22",flexShrink:0}}>
            {expanded?"Collapse ▲":"Expand ▼"}
          </button>
        )}
      </div>
      <div className="bb-body" style={{paddingTop:0}}>
        {!expanded?(
          <div style={{fontSize:14,color:"#333",lineHeight:1.65}}>
            {summary}
            {needsExpand&&(
              <button onClick={()=>setExpanded(true)}
                style={{fontSize:11,color:color,fontWeight:600,background:"none",border:"none",cursor:"pointer",marginLeft:8}}>
                read more
              </button>
            )}
          </div>
        ):(
          <EF value={full} onChange={onChange} placeholder={"Click to edit "+label+"..."}/>
        )}
      </div>
    </div>
  );
}


// ── EDITABLE FIELD ────────────────────────────────────────────────────────────

function EF({value,onChange,single=false,placeholder="Click to edit..."}){
  const[editing,setEditing]=useState(false);
  const[val,setVal]=useState(value||"");
  useEffect(()=>setVal(value||""),[value]);
  const commit=()=>{setEditing(false);if(val!=(value||""))onChange(val);};
  if(editing){
    return single
      ?<input type="text" className="ef-input" value={val} onChange={e=>setVal(e.target.value)} onBlur={commit} onKeyDown={e=>e.key==="Enter"&&commit()} autoFocus/>
      :<textarea className="ef-input ef-input-multi" value={val} onChange={e=>setVal(e.target.value)} onBlur={commit} autoFocus/>;
  }
  return(
    <div className="ef-wrap" onClick={()=>setEditing(true)}>
      <div className="ef-hint">Edit</div>
      <div className={`ef-display${!val?" ef-empty":""}`}>{val||placeholder}</div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

// ── ERROR BOUNDARY — catches render errors so blank page never happens ────────
class ErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={hasError:false,error:null};}
  static getDerivedStateFromError(e){return{hasError:true,error:e};}
  componentDidCatch(e,info){console.error("Render error:",e,info);}
  render(){
    if(this.state.hasError){
      return(
        <div style={{padding:40,maxWidth:600,margin:"60px auto",fontFamily:"DM Sans,sans-serif"}}>
          <div style={{background:"var(--red-bg)",border:"1px solid var(--red)",borderRadius:12,padding:24}}>
            <div style={{fontSize:16,fontWeight:700,color:"var(--red)",marginBottom:8}}>Render Error</div>
            <div style={{fontSize:13,color:"#555",marginBottom:16}}>{this.state.error?.message||"Unknown error"}</div>
            <button onClick={()=>this.setState({hasError:false,error:null})}
              style={{background:"var(--ink-0)",color:"#fff",border:"none",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13}}>
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


export default function App(){
  const[authed,setAuthed]=useState(false);
  const[sbUser,setSbUser]=useState(null);
  const[sbToken,setSbToken]=useState('');

  // Clear legacy session data on first load
  useEffect(()=>{ sessionStorage.removeItem('cambrian_auth'); },[]);
  const[showSavePrompt,setShowSavePrompt]=useState(false);
  const[savedSessions,setSavedSessions]=useState([]);
  const[currentSessionId,setCurrentSessionId]=useState(null);
  const[sessionName,setSessionName]=useState('');
  const[showSessions,setShowSessions]=useState(false);
  const[saveStatus,setSaveStatus]=useState('');

  // ── SESSION HELPERS (localStorage fallback for guest mode) ──────────────
  const STORAGE_KEY = "cambrian_session_v1";
  const clearSession = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch{}
    setCurrentSessionId(null); setSessionName('');
    setSellerUrl(''); setSellerInput(''); setBrief(null); setRiverHypo(null);
    setCohorts([]); setRows([]); setSelectedAccount(null); setPostCall(null);
    setSolutionFit(null); setNotes(''); setGateAnswers({}); setRiverData({});
    setStep(0);
  };
  const lastSaved = () => null; // reserved for future use
  const _step_unused = null; // placeholder
  const[_step,_setStep]=useState(0);
  const step=_step;
  const setStep=(n)=>{_setStep(n);window.scrollTo({top:0,behavior:"smooth"});};
  const[sellerUrl,setSellerUrl]=useState("");
  const[sellerInput,setSellerInput]=useState("");
  const[sellerStage,setSellerStage]=useState(""); // Bootstrapped/Series A/B/C/D+/PE-Backed/Public
  const[productPageUrl,setProductPageUrl]=useState(""); // kept for backward compat
  const[productUrls,setProductUrls]=useState([{url:"",label:""}]); // up to 5
  const[urlScanStatus,setUrlScanStatus]=useState(""); // "scanning"|"found"|"none"|""
  const[urlScanConfirmed,setUrlScanConfirmed]=useState(false);
  const[sellerICP,setSellerICP]=useState(null); // built from seller URL
  const[icpLoading,setIcpLoading]=useState(false);
  const[icpTab,setIcpTab]=useState("icp"); // "icp" | "rfp"
  const[rfpData,setRfpData]=useState({open:[],closed:[],loading:false,error:null});
  const[rfpFilter,setRfpFilter]=useState("all"); // "all" | "private" | "government"
  const[rows,setRows]=useState([]);
  const[headers,setHeaders]=useState([]);
  const[mapping,setMapping]=useState({company:"",industry:"",acv:"0",lead_source:"",close_date:"",product:"",outcome:"",company_url:"",employees:"",public_private:"",geography:""});
  const[fileName,setFileName]=useState("");
  const[drag,setDrag]=useState(false);
  const[importMode,setImportMode]=useState("csv");
  const[dealValue,setDealValue]=useState(""); // e.g. "$10,000 – $50,000"
  const[dealClassification,setDealClassification]=useState(""); // "Top-Line Revenue" etc // "csv" | "quick"
  const[quickEntries,setQuickEntries]=useState([{name:"",url:""}]);
  const[fitScores,setFitScores]=useState({}); // {company: {score, label, reason, color}}
  const[fitScoring,setFitScoring]=useState(false);
  const[cohorts,setCohorts]=useState([]);
  const[selectedCohort,setSelectedCohort]=useState(null);
  const[selectedOutcomes,setSelectedOutcomes]=useState([]);
  const[customOutcome,setCustomOutcome]=useState(""); // free-form outcome
  const[selectedAccount,setSelectedAccount]=useState(null);
  const[accountQueue,setAccountQueue]=useState([]); // multi-select queue, up to 5
  const[queueIdx,setQueueIdx]=useState(0); // which account in queue we're on

  // Brief state — always an object or null; never undefined
  const[brief,setBrief]=useState(null);
  const[briefLoading,setBriefLoading]=useState(false);
  const[briefStatus,setBriefStatus]=useState("");
  const[briefError,setBriefError]=useState("");
  const[riverHypo,setRiverHypo]=useState(null);
  const[riverHypoLoading,setRiverHypoLoading]=useState(false);
  const[discoveryQs,setDiscoveryQs]=useState(null); // product-specific discovery questions
  const[solutionFit,setSolutionFit]=useState(null); // post-call SA review
  const[solutionFitLoading,setSolutionFitLoading]=useState(false);
  const[contactRole,setContactRole]=useState("");

  const[activeRiver,setActiveRiver]=useState(0);
  const[gateAnswers,setGateAnswers]=useState({});
  const[gateNotes,setGateNotes]=useState({}); // notes under each gate
  const[riverData,setRiverData]=useState({});
  const[expandedObjs,setExpandedObjs]=useState({});
  const[rightTab,setRightTab]=useState("brief");
  const[notes,setNotes]=useState("");
  const[postCall,setPostCall]=useState(null);
  const[postLoading,setPostLoading]=useState(false);
  const[copied,setCopied]=useState("");
  const[sellerDocs,setSellerDocs]=useState([]); // [{name, label, content}]
  const[docDrag,setDocDrag]=useState(false);
  const[products,setProducts]=useState([]); // [{id, name, description, category}]
  const[prodDocDrag,setProdDocDrag]=useState(false);
  const fileRef=useRef();
  const docRef=useRef();
  const prodDocRef=useRef();
  const confidence=calcConfidence(gateAnswers,riverData);

  // ── Deep-clone updater for brief ──
  // Uses explicit field keys to avoid dot-path bugs entirely
  const patchBrief=(updater)=>{
    setBrief(prev=>{
      if(!prev)return prev;
      const next=JSON.parse(JSON.stringify(prev));
      updater(next);
      return next;
    });
  };

  // ── Seller doc ingestion ──
  const DOC_LABELS = {
    "pitch":"Pitch Deck","deck":"Pitch Deck","overview":"Product Overview","product":"Product Overview",
    "case":"Case Study","study":"Case Study","training":"Training","playbook":"Playbook",
    "use":"Use Cases","guide":"Guide","brief":"Brief","one":"One-Pager","pager":"One-Pager",
  };
  const guessLabel = name => {
    const low = name.toLowerCase();
    for(const[k,v] of Object.entries(DOC_LABELS)) if(low.includes(k)) return v;
    return "Reference Doc";
  };

  const readDocFile = file => new Promise(resolve=>{
    const reader = new FileReader();
    const name = file.name;
    const ext = name.split(".").pop().toLowerCase();
    // For binary formats we attempt text extraction; FileReader gives raw text for txt/md/csv
    reader.onload = e => {
      let content = "";
      try{
        content = e.target.result || "";
        // Strip null bytes and obvious binary garbage; keep printable ASCII + common unicode
        content = content.replace(/[\x00-\x08\x0b\x0e-\x1f\x7f-\x9f]/g,"")
          .replace(/[^\x09\x0a\x0d\x20-\uFFFF]/g,"")
          .slice(0, 12000); // cap at 12K chars per doc to manage token budget
      }catch(e){content="";}
      resolve({name, label:guessLabel(name), content, ext});
    };
    reader.onerror = ()=>resolve({name, label:guessLabel(name), content:"[Could not read file]", ext});
    // Read as text — works well for txt, md, csv, html; gives partial content for pdf/docx
    reader.readAsText(file);
  });

  const handleDocFiles = async files => {
    const arr = Array.from(files).slice(0,6); // max 6 docs
    const results = await Promise.all(arr.map(readDocFile));
    setSellerDocs(prev=>{
      const existing = new Set(prev.map(d=>d.name));
      const fresh = results.filter(r=>!existing.has(r.name)&&r.content.trim().length>20);
      return [...prev, ...fresh].slice(0,6);
    });
  };

  // ── Product/solution catalog management ──────────────────────────────────────
  const addProduct = () => setProducts(prev=>[...prev,{id:Date.now(),name:"",description:"",category:""}]);
  const removeProduct = id => setProducts(prev=>prev.filter(p=>p.id!==id));
  const updateProduct = (id,field,val) => setProducts(prev=>prev.map(p=>p.id===id?{...p,[field]:val}:p));

  const parseProductDoc = async file => {
    const doc = await readDocFile(file);
    if(!doc.content) return;
    const text = doc.content;
    // Try splitting on numbered list, "Product:" headers, or double-newlines
    const sections = text.split(/(?=\n\d+[\.\)]\s|\nProduct:|\nSolution:|\nService:|\n#{1,3}\s)/i)
      .map(s=>s.trim()).filter(s=>s.length>15).slice(0,16);
    if(sections.length>1){
      const newProds = sections.map((s,i)=>{
        const lines = s.split("\n").filter(Boolean);
        const name = lines[0].replace(/^\d+[\.\)]\s*/,"").replace(/^#+\s*/,"").replace(/^(Product|Solution|Service):\s*/i,"").slice(0,80).trim();
        const description = lines.slice(1).join(" ").replace(/\s+/g," ").slice(0,300).trim();
        return {id:Date.now()+i, name, description, category:""};
      }).filter(p=>p.name.length>2);
      setProducts(prev=>[...prev,...newProds].slice(0,20));
    } else {
      setProducts(prev=>[...prev,{id:Date.now(),name:doc.name.replace(/\.[^.]+$/,"").replace(/[-_]/g," "),description:text.slice(0,400),category:""}].slice(0,20));
    }
  };

  const parseCSV=text=>{
    const lines=text.trim().split(/\r?\n/);
    const hdrs=lines[0].split(",").map(h=>h.trim().replace(/^"|"$/g,""));
    const data=lines.slice(1).map(line=>{
      const vals=line.split(",").map(v=>v.trim().replace(/^"|"$/g,""));
      const obj={};hdrs.forEach((h,i)=>obj[h]=vals[i]||"");return obj;
    }).filter(r=>Object.values(r).some(v=>v));
    setHeaders(hdrs);setRows(data);
    const am={...mapping};const n=s=>s.toLowerCase().replace(/[\s_]/g,"");
    hdrs.forEach(h=>{
      const hn=n(h);
      if(hn.includes("company")||hn.includes("account"))am.company=h;
      if(hn.includes("industry")||hn.includes("vertical"))am.industry=h;
      if(hn.includes("acv")||hn.includes("deal")||hn.includes("amount")||hn.includes("value"))am.acv=h;
      if(hn.includes("lead")||hn.includes("source")||hn.includes("channel"))am.lead_source=h;
      if(hn.includes("close")||hn.includes("date"))am.close_date=h;
      if(hn.includes("product")||hn.includes("solution"))am.product=h;
      if(hn.includes("outcome")||hn.includes("goal"))am.outcome=h;
      if(hn.includes("url")||hn.includes("website")||hn.includes("web"))am.company_url=h;
      if(hn.includes("employee")||hn.includes("headcount")||hn.includes("staff"))am.employees=h;
      if(hn.includes("public")||hn.includes("private")||hn.includes("ownership"))am.public_private=h;
      if(hn.includes("geo")||hn.includes("domestic")||hn.includes("international")||hn.includes("region"))am.geography=h;
    });
    setMapping(am);
  };

  const loadSample=()=>{
    const hdrs=Object.keys(SAMPLE_ROWS[0]);
    setHeaders(hdrs);setRows(SAMPLE_ROWS);setFileName(`sample_${SAMPLE_ROWS.length}_accounts.csv`);
    const m={};hdrs.forEach(h=>m[h]=h);setMapping(m);
  };
  const onFile=file=>{if(!file)return;setFileName(file.name);const r=new FileReader();r.onload=e=>parseCSV(e.target.result);r.readAsText(file);};
  const handleDrop=useCallback(e=>{e.preventDefault();setDrag(false);onFile(e.dataTransfer.files[0]);},[]);
  // ── FIT SCORING — batch evaluates all accounts against seller profile ────
  const scoreFit = async(members, sellerCtx) => {
    if(!members?.length) return;
    setFitScoring(true);
    const icpContext = sellerICP?.icp
      ? `\nSELLER ICP: Target industries: ${(sellerICP.icp.industries||[]).join(", ")} | Size: ${sellerICP.icp.companySize||"any"} | Buyer: ${(sellerICP.icp.buyerPersonas||[]).join(", ")} | Disqualifiers: ${(sellerICP.icp.disqualifiers||[]).join(", ")}`
      : "";

    // v107: batches are now dispatched in PARALLEL with Promise.all, and
    // each batch updates state as soon as it resolves (progressive). With
    // 100 rows at BATCH=20 this is 5 concurrent Haiku calls; total wall
    // time drops from ~5x to ~1x a single call (~3-5s) and the user sees
    // scores fill in live instead of a silent 20-second wait.
    const BATCH = 20;
    const batches = [];
    for (let i = 0; i < members.length; i += BATCH) batches.push(members.slice(i, i + BATCH));

    const scoreBatch = async (batch) => {
      const companies = batch.map(m => `${m.company}|${m.ind||"Unknown industry"}|${m.company_url||""}`).join("\n");
      const prompt =
        `You are a B2B sales strategist. Score ICP fit for each company below.\n\n`+
        `━━━ SCORE (0-100, single integer) ━━━\n`+
        `Band mapping — score MUST match label:\n`+
        `  75-100 → "Strong Fit"     — clear ICP match, buyer accessible, reasonable cycle\n`+
        `  50-74  → "Potential Fit"  — partial match, needs specific angle or workaround\n`+
        `   0-49  → "Poor Fit"        — structural barrier (wrong size, industry, procurement, incumbent lock)\n\n`+
        `━━━ INTERNAL SIGNALS (use to decide score — do NOT mention in 'reason') ━━━\n`+
        `High-friction industries (score 5-25): heavy manufacturing, aerospace/defense prime contractors, telecom incumbents, energy utilities, mass-market retail >100K employees, top-5 US banks.\n`+
        `Underserved high-fit segments (score 60-80): large private insurance/finance, private professional services, regional/community banks, healthcare IT, CPG personal care.\n`+
        `Ownership adjustments: VC-backed +5 · PE-backed = cost/margin-driven buyer · Private company +5 vs equivalent public peer.\n`+
        `Size penalty: >200K employees and seller is early-stage (Seed/Series A) = procurement barrier, -15.\n`+
        `Funding signal: target raised <12 months ago = active buying window +8.\n\n`+
        `━━━ OUTPUT LANGUAGE RULES ━━━\n`+
        `- 'label' MUST be exactly one of: "Strong Fit" | "Potential Fit" | "Poor Fit". No variations, no extra words.\n`+
        `- 'reason' is ONE plain-English sentence. Say WHY in terms the seller can act on (industry match, buyer size, ownership, incumbent risk, funding window). \n`+
        `- Do NOT use the words "tier", "wall", "band", or "bucket" in 'reason'. Those are internal labels only.\n`+
        `- Do not include the score number inside the reason.\n\n`+
        `SELLER: ${sellerCtx.slice(0,300)}\n${icpContext}\n\n`+
        `For orgSize: provide approximate employee count range (e.g. "~200K", "5K-10K", "500-1K").\n\n`+
        `COMPANIES (Name|Industry|URL):\n${companies}\n\n`+
        `Return ONLY raw JSON, start with {:\n`+
        `{"scores":[{"company":"exact name","score":85,"label":"Strong Fit","reason":"Matches fintech ICP and ~500 employee target size","orgSize":"~200K employees","ownership":"Public (NYSE:MCD)","ownershipType":"public"},`+
        `{"company":"","score":40,"label":"Poor Fit","reason":"","orgSize":"500-1K employees","ownership":"PE-backed (Thoma Bravo)","ownershipType":"pe"},`+
        `{"company":"","score":60,"label":"Potential Fit","reason":"","orgSize":"~5K employees","ownership":"Series C ($180M, Sequoia)","ownershipType":"vc"}]}`;

      const result = await callAI(prompt);
      if (!result?.scores) return;

      // Client-side label normalizer. The prompt instructs "Strong Fit" |
      // "Potential Fit" | "Poor Fit" only, but Haiku occasionally leaks
      // variants like "Tier 1 Fit" or "Good Fit" or "High Fit". Coerce
      // everything to one of the three canonical labels based on the
      // numeric score — single source of truth.
      const canonicalLabel = (score) => score >= 75 ? "Strong Fit" : score >= 50 ? "Potential Fit" : "Poor Fit";
      // Also strip "tier"/"wall"/"band"/"bucket" from reason text if the
      // model leaked it anyway — those are internal scoring terminology
      // we don't want the seller to see.
      const cleanReason = (r) => (r || "")
        .replace(/\b(tier\s*\d+|the\s+wall|band\s*\d+|bucket\s*\d+)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      const map = {};
      const memberUpdates = {};
      result.scores.forEach(s => {
        const color       = s.score>=75?"var(--green)":s.score>=50?"var(--amber)":"var(--red)";
        const bg          = s.score>=75?"var(--green-bg)":s.score>=50?"var(--amber-bg)":"var(--red-bg)";
        const ownerColor  = s.ownershipType==="public"?"var(--navy)":s.ownershipType==="pe"?"#6B3A3A":s.ownershipType==="vc"?"var(--green)":"#555";
        map[s.company]             = {
          ...s,
          label: canonicalLabel(s.score),
          reason: cleanReason(s.reason),
          color, bg, ownerColor,
          adoptionProfile: s.adoptionProfile || "",
        };
        memberUpdates[s.company]   = { orgSize: s.orgSize||"", ownership: s.ownership||"", ownershipType: s.ownershipType||"" };
      });

      // Progressive state update — merge this batch's results so the table
      // fills in as batches return rather than waiting for all batches.
      setFitScores(prev => ({ ...prev, ...map }));
      setCohorts(prev => prev.map(c => ({
        ...c,
        members: c.members.map(m => memberUpdates[m.company]
          ? { ...m,
              employees:     m.employees     || memberUpdates[m.company].orgSize,
              publicPrivate: m.publicPrivate || memberUpdates[m.company].ownership }
          : m)
      })));
    };

    await Promise.all(batches.map(scoreBatch));
    setFitScoring(false);
  };


  // ── FETCH RFP INTEL ──────────────────────────────────────────────────────
  // Shared brace-walking JSON extractor. Robust to narration before/after
  // the JSON and to markdown code fences.
  const extractJsonWithKey = (text, anchorKey) => {
    const clean = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
    const anchor = clean.indexOf(`"${anchorKey}"`);
    if (anchor === -1) return null;
    let start = anchor;
    while (start > 0 && clean[start] !== "{") start--;
    if (clean[start] !== "{") return null;
    let depth = 0, inStr = false, esc = false;
    for (let i = start; i < clean.length; i++) {
      const ch = clean[i];
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          try { return JSON.parse(clean.slice(start, i + 1)); }
          catch { return null; }
        }
      }
    }
    return null;
  };

  // RFP cache: keyed by (user, seller URL, marketCategory, RFP schema
  // version). Cache TTL is implicit — the seller URL and marketCategory
  // pin the scope; a Regenerate ICP will naturally produce a new key.
  const RFP_CACHE_VERSION = "v2";
  const rfpCacheKey = () => {
    const userScope = sbUser?.id || "guest";
    const url = (sellerUrl||"").toLowerCase().replace(/^https?:\/\//,"").replace(/\/$/,"");
    const cat = (sellerICP?.marketCategory||"").toLowerCase().replace(/\s+/g,"-").slice(0,40);
    return `rfp:${RFP_CACHE_VERSION}:${userScope}:${url}:${cat}`;
  };

  // Split into two parallel calls (open + closed). Each has its own
  // web_search budget and its own prompt so the model can focus. Results
  // render as each settles rather than waiting for both.
  const fetchRFPIntel = async ({ forceRefresh = false } = {}) => {
    if (!sellerICP?.icp) return;

    // Cache hit — instant return with live data.
    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(rfpCacheKey());
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.open || parsed?.closed) {
            setRfpData({ open: parsed.open || [], closed: parsed.closed || [], loading: false, error: null });
            return;
          }
        }
      } catch {}
    }

    setRfpData({ open: [], closed: [], loading: true, error: null });

    // Pull rich ICP context — the RFP search quality is gated on how
    // well the prompt tells Haiku WHO to look for. Previously we passed
    // only industries + category; now we feed the full decision profile.
    const icp = sellerICP.icp || {};
    const industries   = (icp.industries || []).filter(Boolean);
    const category     = sellerICP.marketCategory || "";
    const buyers       = (icp.buyerPersonas || []).filter(Boolean);
    const size         = icp.companySize || "";
    const geo          = (icp.geographies || []).filter(Boolean);
    const trigger      = icp.priorityInitiative || "";
    const disqual      = (icp.disqualifiers || []).filter(Boolean);
    const deal         = icp.dealSize || "";
    const competitors  = (icp.competitiveAlternatives || []).filter(Boolean);
    const differ       = (icp.uniqueDifferentiators || []).filter(Boolean);

    const fixGov = r => ({ ...r, isGovernment: r.isGovernment === true || r.isGovernment === "true" });

    const buildPrompt = (kind) => {
      const isOpen = kind === "open";
      return `You are a procurement intelligence analyst helping a B2B seller find relevant RFPs. Use web_search with SPECIFIC queries. ${isOpen ? "Focus on ACTIVE (open) opportunities posted in the last 90 days." : "Focus on AWARDED (closed) contracts from the last 18 months that reveal incumbent vendors."}

━━━ SELLER PROFILE ━━━
URL: ${sellerUrl}
Market category: ${category}
What makes them different: ${differ.slice(0,2).join(" · ") || "—"}
They commonly displace: ${competitors.slice(0,2).join(" · ") || "—"}

━━━ THEIR IDEAL BUYER (this is who's posting relevant RFPs) ━━━
Industries:       ${industries.join(", ") || "—"}
Buyer size:       ${size || "—"}
Typical deal:     ${deal || "—"}
Geographies:      ${geo.join(", ") || "North America"}
Buyer personas:   ${buyers.join(", ") || "—"}
Priority trigger: ${trigger || "—"}
Exclusions:       ${disqual.slice(0,3).join(" · ") || "—"}

━━━ SEARCH STRATEGY (use 2-3 of these query patterns) ━━━
${isOpen ? `
  - site:sam.gov "${category || industries[0] || "RFP"}" 2025
  - "${industries[0] || "fintech"}" RFP 2025 "${buyers[0] || "CFO"}"
  - ${category || industries[0] || "software"} procurement Ariba OR Coupa 2025
  - site:ted.europa.eu ${industries[0] || "software"} 2025
  - "${trigger.split(" ").slice(0,4).join(" ") || industries[0]}" RFP request for proposal
` : `
  - site:usaspending.gov ${category || industries[0]} contract 2024 OR 2025
  - site:fpds.gov ${industries[0] || category} awarded 2024 OR 2025
  - "${competitors[0] || category}" contract awarded 2024 OR 2025
  - ${industries[0] || "SaaS"} "contract award" press release 2024 OR 2025
  - "${buyers[0] || "CIO"}" selects vendor ${category || industries[0]} 2024 OR 2025
`}

━━━ SOURCES ━━━
PRIVATE / COMMERCIAL (set isGovernment: false):
  - Ariba Discovery, Coupa Compass, Jaggaer, SAP Fieldglass
  - Fortune 500 corporate procurement portals (e.g. jpmorgan.com/procurement)
  - Industry marketplaces (GHX healthcare, SIG for manufacturing)
  - Press releases announcing vendor selections / RFP awards
GOVERNMENT (set isGovernment: true):
  - USA: SAM.gov (active), FPDS-NG / USAspending.gov (awarded)
  - EU: TED Europa (ted.europa.eu)
  - Multilateral: World Bank, UNGM (un.org/ungm), ADB, IDB
  - State/Local: DemandStar, state procurement portals

━━━ OUTPUT ━━━
Return 4-6 ${isOpen ? "active opportunities" : "recent awards"}, roughly balanced between private and government.

DATA INTEGRITY:
  - Only include RFPs you can VERIFY via web_search. Do not invent titles, buyers, values, or vendor names.
  ${!isOpen ? "- If awarded vendor cannot be verified, leave \"awardedTo\" empty. Do not guess.\n  " : ""}- Every row MUST include the isGovernment boolean.
  - Include the source URL in the "url" field when available — this is how the user verifies your work.
  - relevanceReason should cite ONE specific element of the seller profile above (e.g. "matches their Financial Services focus and ~$250K deal size").
  - Do NOT return RFPs that match any item in Exclusions.

Return ONLY raw JSON (no prose). The outer key MUST be "rows":
${isOpen
  ? `{"rows":[{"title":"RFP title","buyer":"Buyer","country":"USA","source":"SAM.gov or Ariba etc","isGovernment":true,"value":"$500K-$2M","deadline":"YYYY-MM-DD","relevanceScore":85,"relevanceReason":"Why this matches the seller profile above","naicsOrCpv":"522320","cohort":"Financial Services","url":"https://..."}]}`
  : `{"rows":[{"title":"Contract title","buyer":"Buyer","country":"USA","source":"FPDS-NG or press URL","isGovernment":true,"awardedTo":"Vendor or empty string","value":"$1.2M","awardDate":"YYYY-MM-DD","relevanceScore":78,"relevanceReason":"Why relevant","cohort":"Financial Services","url":"https://..."}]}`
}`;
    };

    const fetchClass = async (kind) => {
      try {
        const r = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 2500,
            tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 2 }],
            messages: [{ role: "user", content: buildPrompt(kind) }],
          }),
        });
        const d = await r.json();
        if (d.error) return { kind, error: d.error.message || "API error" };

        const textBlocks = (d.content || []).filter(b => b.type === "text").map(b => b.text || "");
        let parsed = null;
        for (let i = textBlocks.length - 1; i >= 0 && !parsed; i--) {
          parsed = extractJsonWithKey(textBlocks[i], "rows");
        }
        if (!parsed) {
          console.warn(`RFP ${kind} parse failed. Content:`, d.content);
          return { kind, error: `Couldn't parse ${kind} response` };
        }
        return { kind, rows: (parsed.rows || []).map(fixGov) };
      } catch (e) {
        console.warn(`RFP ${kind} fetch failed:`, e);
        return { kind, error: e.message };
      }
    };

    // Launch both in parallel. Each settle updates its section of state
    // so the user sees partial results as they arrive.
    const openP = fetchClass("open");
    const closedP = fetchClass("closed");

    openP.then(res => {
      if (res.rows) setRfpData(prev => ({ ...prev, open: res.rows }));
      else if (res.error) setRfpData(prev => ({ ...prev, error: prev.error ? `${prev.error} · Open: ${res.error}` : `Open RFPs: ${res.error}` }));
    });
    closedP.then(res => {
      if (res.rows) setRfpData(prev => ({ ...prev, closed: res.rows }));
      else if (res.error) setRfpData(prev => ({ ...prev, error: prev.error ? `${prev.error} · Closed: ${res.error}` : `Closed RFPs: ${res.error}` }));
    });

    const [openRes, closedRes] = await Promise.all([openP, closedP]);
    setRfpData(prev => ({ ...prev, loading: false }));

    // Cache only if we got at least one successful class.
    if (openRes.rows || closedRes.rows) {
      try {
        localStorage.setItem(rfpCacheKey(), JSON.stringify({
          open: openRes.rows || [],
          closed: closedRes.rows || [],
        }));
      } catch {}
    }
  };

  // Auto-fire RFP fetch as soon as the ICP becomes available. Keyed by a
  // stable ICP signature so a Regenerate-ICP will correctly retrigger
  // (with forceRefresh) and bypass whatever stale data is still in state.
  // Previously the guard included "&& !rfpData.open.length" which meant
  // the effect would skip forever after the first result — a regenerated
  // ICP would render against the old RFP data until the user clicked
  // Refresh. Fixed.
  const icpSignature = sellerICP?.icp
    ? `${sellerICP.sellerName||""}|${sellerICP.marketCategory||""}|${(sellerICP.icp.industries||[]).join(",")}|${sellerICP.icp.companySize||""}`
    : "";
  const lastIcpSigRef = React.useRef("");
  React.useEffect(() => {
    if (!icpSignature) return;
    // Signature unchanged — ICP hasn't really changed in a way that
    // warrants a refetch. (Handles StrictMode double-invoke too.)
    if (icpSignature === lastIcpSigRef.current) return;
    const wasFirstLoad = lastIcpSigRef.current === "";
    lastIcpSigRef.current = icpSignature;
    // First load: check localStorage cache; ICP regeneration: bypass
    // cache (old RFP data no longer matches the regenerated ICP).
    fetchRFPIntel({ forceRefresh: !wasFirstLoad });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icpSignature]);

  // ── BUILD SELLER ICP FROM URL ────────────────────────────────────────────
  // Fires when seller URL is entered. Uses training knowledge + web search
  // to understand who this seller actually sells to.
  // localStorage cache for ICPs — keyed by user + normalized URL.
  // Goal: consistency. Once an ICP is built for a seller, reuse it forever
  // unless user explicitly regenerates. Kills drift between sessions.
  //
  // User scope: two users sharing the same browser (kiosk, family machine)
  // must NOT see each other's cached ICPs. Key includes sbUser.id (or
  // "guest" for not-logged-in). Bump ICP_CACHE_VERSION if the ICP schema
  // changes — old entries fall through to regeneration.
  const ICP_CACHE_VERSION = "v2";
  const icpCacheKey = (u) => {
    const userScope = sbUser?.id || "guest";
    const normalizedUrl = u.toLowerCase().replace(/^https?:\/\//,"").replace(/\/$/,"");
    return `icp:${ICP_CACHE_VERSION}:${userScope}:${normalizedUrl}`;
  };

  const buildSellerICP = async(rawUrl, {forceRefresh=false}={}) => {
    const url = rawUrl.trim().replace(/^https?:\/\//,"").replace(/\/$/,"");

    // Cache hit — instant, deterministic
    if(!forceRefresh){
      try{
        const cached = localStorage.getItem(icpCacheKey(url));
        if(cached){
          const parsed = JSON.parse(cached);
          if(parsed?.sellerName||parsed?.icp){ setSellerICP(parsed); return; }
        }
      }catch{}
    }

    setIcpLoading(true);

    // Phase 1 — research (training-knowledge recall, no web_search tool yet)
    const researchPrompt =
      `You are researching the B2B company at https://${url} to inform an Ideal Customer Profile build.\n`+
      `Use the web_search tool to find the company's actual website, press mentions, LinkedIn, and customer logos.\n`+
      `Search queries to try:\n`+
      `1. "${url}" products OR solutions — what they sell and to whom\n`+
      `2. "${url}" customers OR case studies — named customer logos\n`+
      `3. site:${url} careers OR jobs — reveals target industries and company sizes they serve\n`+
      `After searching, return ONLY raw JSON (no prose, no commentary):\n`+
      `{"companyName":"","tagline":"","products":["product 1","product 2"],"targetCustomers":"who they sell to in plain language","knownCustomers":["logo 1","logo 2","logo 3"],"industries":["vertical 1","vertical 2","vertical 3"],"companySize":"typical customer size","pricingHint":"any pricing signals found","useCases":["use case 1","use case 2"],"competitors":["competitor 1","competitor 2"]}`;

    // Phase 1 uses web_search — critical for obscure sellers Haiku wouldn't
    // know from training data (tested: Tillo.com, Cambrian, Savvi all failed
    // without live search). No assistant-prefill because tool-use responses
    // can't start with a forced "{" token.
    let researchCtx = "";
    try{
      const r1 = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:2000,
          temperature:0,
          tools:[{type:"web_search_20250305",name:"web_search",max_uses:1}],
          messages:[{role:"user",content:researchPrompt}],
        }),
      });
      const d1 = await r1.json();
      if(!d1.error){
        const raw1 = (d1.content||[])
          .filter(b=>b.type==="text"||b.type==="tool_result")
          .map(b=>b.type==="text"?b.text:(b.content?.[0]?.text||""))
          .join(" ").trim();
        researchCtx = raw1.slice(0,2000);
      }
    }catch(e){ console.warn("ICP research failed:",e.message); }

    // Phase 2 — build full ICP.
    // Numeric/categorical fields are ANCHORED to fixed enums below. The model
    // MUST pick one of the listed values verbatim — no free-form ranges.
    // This is what kills "500-10K vs 1K-50K" drift between runs.
    const icpPrompt =
      `You are a senior B2B ICP strategist. Build the Ideal Customer Profile for the seller at: ${url}.\n`+
      (researchCtx?`RESEARCH:\n${researchCtx.slice(0,800)}\n\n`:"")+
      `Seller stage: ${sellerStage||"unknown"}. Be specific and confident — no placeholders.\n\n`+
      `CRITICAL — CONSISTENCY RULES:\n`+
      `- For fields marked "PICK ONE" below, return ONLY the chosen value verbatim. No extra words, no custom ranges, no parentheticals.\n`+
      `- Be deterministic. If a buyer fits two buckets, pick the one matching the MEDIAN customer, not the widest range.\n\n`+
      `Return ONLY raw JSON starting with {:\n`+
      `{"sellerName":"",`+
      `"sellerDescription":"2 sentences on what they sell",`+
      `"marketCategory":"specific category in 2-5 words",`+
      `"icp":{`+
      `"industries":["Primary","Second","Third"],`+
      `"companySize":"PICK ONE: 1-49 employees | 50-499 employees | 500-4,999 employees | 5,000-49,999 employees | 50,000+ employees",`+
      `"revenueRange":"PICK ONE: <$10M | $10M-$100M | $100M-$1B | $1B-$10B | $10B+",`+
      `"ownershipTypes":["PICK 1-2 FROM: VC-backed private | PE-backed private | Public | Privately-held (family/founder) | Bootstrapped"],`+
      `"geographies":["Primary region: North America | EMEA | APAC | LATAM | Global"],`+
      `"adoptionProfile":"PICK ONE: Innovator | Early Adopter | Early Majority | Late Majority",`+
      `"buyerPersonas":["Economic buyer role","Champion role","Technical evaluator role"],`+
      `"priorityInitiative":"what triggers them to act NOW in 1-2 sentences",`+
      `"successFactors":"what winning looks like in 1-2 sentences",`+
      `"perceivedBarriers":"top objections in 1-2 sentences",`+
      `"decisionCriteria":"top 2-3 evaluation factors",`+
      `"buyerJourney":"awareness to decision in 1 sentence",`+
      `"customerJobs":["Functional job","Emotional job","Social job"],`+
      `"topPains":["Pain 1","Pain 2","Pain 3"],`+
      `"topGains":["Gain 1","Gain 2","Gain 3"],`+
      `"competitiveAlternatives":["Status quo","Competitor","Build in-house"],`+
      `"uniqueDifferentiators":["Differentiator 1","Differentiator 2"],`+
      `"disqualifiers":["Not a fit: 1","Not a fit: 2"],`+
      `"techSignals":["Signal 1","Signal 2"],`+
      `"tractionChannels":["Channel 1","Channel 2","Channel 3"],`+
      `"dealSize":"PICK ONE: <$10K ACV | $10K-$50K ACV | $50K-$250K ACV | $250K-$1M ACV | $1M+ ACV",`+
      `"salesCycle":"PICK ONE: <30 days | 30-60 days | 60-90 days | 90-180 days | 180+ days",`+
      `"customerExamples":["Customer 1","Customer 2","Customer 3"]}}`;

    try{
      const r2 = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:6000,
          temperature:0,
          messages:[
            {role:"user",content:icpPrompt},
            {role:"assistant",content:"{"},
          ],
        }),
      });
      const d2 = await r2.json();
      if(d2.error){ console.warn("ICP phase 2 error:",d2.error); setIcpLoading(false); return; }
      const raw=(d2.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      const jsonStr = raw.startsWith("{")? raw : "{"+raw;
      const m = jsonStr.match(/\{[\s\S]*\}/);
      if(m){
        try{
          const parsed = JSON.parse(m[0]);
          if(parsed.sellerName||parsed.icp){
            setSellerICP(parsed);
            // Only cache if the ICP is usable. "Unknown" / "Unable to determine"
            // means web_search + training data both failed — don't persist that
            // failure forever; let the next session retry. Also catches the
            // case where model echoes the "PICK ONE: ..." instruction verbatim.
            const badPattern = /unknown|unable to determine|insufficient data|n\/a|PICK ONE/i;
            const core = [parsed.marketCategory, parsed.icp?.companySize, parsed.icp?.revenueRange, parsed.icp?.dealSize];
            const usable = core.every(v => typeof v === "string" && v.length > 0 && !badPattern.test(v));
            if(usable){
              try{ localStorage.setItem(icpCacheKey(url), JSON.stringify(parsed)); }catch{}
            } else {
              console.warn("ICP built but not cached (contains Unknown/placeholder values) — will retry on next load");
            }
          }
        }catch(e){ console.warn("ICP JSON parse failed:",e.message,raw.slice(0,200)); }
      }
    }catch(e){ console.warn("ICP build phase 2 failed:",e.message); }
    setIcpLoading(false);
  };

  // Session restore is handled by Supabase (restoreSession fn) or guest localStorage below

  // ── SCAN SELLER URL FOR PRODUCT PAGES ────────────────────────────────────
  const scanSellerUrl = async(rawUrl) => {
    if(!rawUrl.trim()) return;
    const url = rawUrl.trim().replace(/^https?:\/\//,"").replace(/\/$/,"");
    setUrlScanStatus("scanning");
    setUrlScanConfirmed(false);

    const baseUrl = "https://"+url;
    const prompt =
      `Search for the website ${baseUrl} and identify its product, solution, and service pages.\n\n`+
      `Look specifically for pages in navigation menus labeled: Solutions, Use Cases, Services, Platform, Products, Catalog, Features, Industries, By Role, By Team.\n\n`+
      `Search queries to try:\n`+
      `1. site:${url} solutions OR products OR services OR platform\n`+
      `2. "${url}" product pages OR solution pages\n`+
      `3. ${baseUrl}/solutions OR ${baseUrl}/products OR ${baseUrl}/platform\n\n`+
      `Find 3-5 specific product or solution pages with their full URLs. Exclude: /about, /blog, /careers, /contact, /pricing, /login, /news.\n\n`+
      `Return ONLY raw JSON (no markdown, no backticks):\n`+
      `{"pages":[{"url":"https://full-url-here","label":"Product or Solution Name"},{"url":"","label":""},{"url":"","label":""}]}`;

    try{
      // Step 1: fetch the homepage content directly
      const fetchR = await fetch("/api/claude",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:2000,
          temperature:0,
          messages:[{role:"user",content:prompt},{role:"assistant",content:"{"}],
        }),
      });
      const d = await fetchR.json();
      if(d.error){console.warn("Scan error:",d.error);setUrlScanStatus("none");return;}

      // Extract all text blocks (web_search returns tool results + text)
      const allText = (d.content||[])
        .filter(b=>b.type==="text"||b.type==="tool_result")
        .map(b=>b.type==="text"?b.text:(b.content?.[0]?.text||""))
        .join(" ");

      // Extract any JSON block in the response
      const jsonMatch = allText.match(/\{[\s\S]*"pages"[\s\S]*\}/);
      let parsed = null;
      if(jsonMatch){
        try{ parsed = JSON.parse(jsonMatch[0]); }catch{}
      }
      if(!parsed){
        // Try finding URLs directly via regex as fallback
        const urlMatches = [...allText.matchAll(/https?:\/\/[^\s"'<>]+\/[^\s"'<>]{3,}/g)]
          .map(m=>m[0])
          .filter(u=>!u.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|ttf)$/i))
          .filter(u=>!u.match(/(blog|news|careers|jobs|about|contact|login|signup|privacy|terms|press|investor)/i))
          .filter(u=>u.includes(url))
          .slice(0,5);
        if(urlMatches.length>0){
          parsed = {pages: urlMatches.map(u=>({url:u,label:u.split("/").pop().replace(/-/g," ")}))};
        }
      }

      const pages=(parsed?.pages||[]).filter(p=>p?.url&&p.url.startsWith("http")).slice(0,5);
      console.log("URL scan found pages:", pages.length, pages);
      if(pages.length>0){
        setProductUrls(pages.map(p=>({url:p.url,label:p.label||""})));
        setUrlScanStatus("found");
      } else {
        setUrlScanStatus("none");
      }
    }catch(e){
      console.warn("URL scan failed:",e.message);
      setUrlScanStatus("none");
    }
  };

  // ── SUPABASE SESSION SAVE/LOAD ────────────────────────────────────────────
  const getSessionSnap=()=>({sellerUrl,sellerInput,productUrls,sellerICP,products,sellerDocs:sellerDocs.map(d=>({...d,content:d.content.slice(0,500)})),rows,headers,mapping,fileName,importMode,cohorts,selectedCohort,fitScores,accountQueue,selectedAccount,selectedOutcomes,dealValue,dealClassification,brief,riverHypo,gateAnswers,riverData,notes,postCall,solutionFit,contactRole});

  const loadSessions=async()=>{
    if(!sbUser||!sbToken) return;
    const rows=await sbSessions('GET',`sessions?user_id=eq.${sbUser.id}&order=updated_at.desc&limit=20`,sbToken);
    if(rows) setSavedSessions(rows);
  };

  const saveSession=async()=>{
    if(!sbUser||!sbToken){setShowSavePrompt(true);return;}
    setSaveStatus('saving');
    const nm=sessionName||sellerUrl||'Session '+new Date().toLocaleDateString();
    const data=getSessionSnap();
    // Upsert user record
    await sbSessions('POST','users?on_conflict=id',sbToken,{id:sbUser.id,email:sbUser.email,name:sbUser.user_metadata?.full_name||sbUser.email,role:'rep'});
    if(currentSessionId){
      await sbSessions('PATCH',`sessions?id=eq.${currentSessionId}`,sbToken,{name:nm,seller_url:sellerUrl,data});
    } else {
      const res=await sbSessions('POST','sessions',sbToken,{user_id:sbUser.id,name:nm,seller_url:sellerUrl,data});
      if(res?.[0]?.id){setCurrentSessionId(res[0].id);setSessionName(nm);}
    }
    setSaveStatus('saved');setTimeout(()=>setSaveStatus(''),3000);
    loadSessions();
  };

  const restoreSession=(s)=>{
    const d=s.data;setCurrentSessionId(s.id);setSessionName(s.name);
    if(d.sellerUrl){setSellerUrl(d.sellerUrl);setSellerInput(d.sellerUrl);}
    if(d.productUrls?.length) setProductUrls(d.productUrls);
    if(d.sellerICP) setSellerICP(d.sellerICP);
    if(d.products?.length) setProducts(d.products);
    if(d.rows?.length){setRows(d.rows);setHeaders(d.headers||[]);setMapping(d.mapping||{});setFileName(d.fileName||'');}
    if(d.cohorts?.length){setCohorts(d.cohorts);}
    if(d.selectedCohort) setSelectedCohort(d.selectedCohort);
    if(d.fitScores) setFitScores(d.fitScores);
    if(d.accountQueue?.length) setAccountQueue(d.accountQueue);
    if(d.selectedAccount) setSelectedAccount(d.selectedAccount);
    if(d.selectedOutcomes?.length) setSelectedOutcomes(d.selectedOutcomes);
    if(d.dealValue) setDealValue(d.dealValue);
    if(d.brief) setBrief(d.brief);
    if(d.riverHypo) setRiverHypo(d.riverHypo);
    if(d.gateAnswers) setGateAnswers(d.gateAnswers);
    if(d.riverData) setRiverData(d.riverData);
    if(d.notes) setNotes(d.notes);
    if(d.postCall) setPostCall(d.postCall);
    if(d.solutionFit) setSolutionFit(d.solutionFit);
    setShowSessions(false);setStep(d.sellerUrl?1:0);
  };

  const deleteSession=async(id)=>{
    await sbSessions('DELETE',`sessions?id=eq.${id}`,sbToken);
    if(id===currentSessionId) setCurrentSessionId(null);
    loadSessions();
  };

  React.useEffect(()=>{if(sbUser&&sbToken) loadSessions();},[sbUser]);

  // Build ICP whenever sellerUrl is set but ICP not yet loaded
  useEffect(()=>{
    if(sellerUrl&&!sellerICP&&!icpLoading) buildSellerICP(sellerUrl);
  },[sellerUrl]);

  // Pre-fetch: kick off ICP build 900ms after the user stops typing a
  // URL on the setup page — so by the time they reach the ICP step the
  // data is already loading (or cached from a prior session). Only fires
  // if the input LOOKS like a URL (prevents premature runs on partial
  // input like "gon" or "cambrian"). Cache hit is instant so retyping
  // an already-seen URL costs nothing.
  useEffect(() => {
    const url = (sellerInput || "").trim();
    if (!url || sellerICP || icpLoading) return;
    if (!/\.(com|io|ai|org|net|app|co|dev|so|gov|edu|xyz|us|uk|de|fr|eu)($|\/)/i.test(url)) return;
    const t = setTimeout(() => {
      if (!sellerICP && !icpLoading) buildSellerICP(url);
    }, 900);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerInput]);

  const goToCohorts=()=>{
    const b=buildCohorts(rows,mapping);
    setCohorts(b);
    setSelectedCohort(b[0]||null);
    setStep(3);
    // Score all members in background
    const allMembers=b.flatMap(c=>c.members);
    const sellerCtxF=sellerDocs.length>0
      ? sellerDocs.map(d=>d.label+": "+d.content.slice(0,400)).join(" | ")
      : sellerUrl+(productUrls.filter(u=>u.url).map(u=>u.url).join(" | ")??" ");
    scoreFit(allMembers, sellerCtxF);
  };

  const goToQuickBrief=()=>{
    const entries=quickEntries.filter(e=>e.name.trim());
    if(!entries.length) return;
    // Build synthetic rows + a single cohort
    const syntheticRows=entries.map(e=>({
      company:e.name.trim(),
      company_url:e.url.trim(),
      industry:"",acv:"0",lead_source:"Quick Entry",outcome:"",
    }));
    const syntheticMapping={company:"company",industry:"industry",acv:"0",lead_source:"lead_source",company_url:"company_url",outcome:"outcome",close_date:"",product:""};
    setRows(syntheticRows);
    setMapping(syntheticMapping);
    setHeaders(["company","company_url","industry","acv","lead_source","outcome"]);
    // Build a single cohort with all entries
    const cohort={id:"qe",name:"Quick Entry",color:"var(--tan-0)",size:entries.length,pct:100,avgACV:0,topInd:[],topSrc:["Quick Entry"],topOut:[],
      members:entries.map(e=>({company:e.name.trim(),company_url:e.url.trim(),ind:"",acv:0,src:"Quick Entry",outcome:""}))};
    setCohorts([cohort]);
    setSelectedCohort(cohort);
    setSelectedOutcomes([]);
    setStep(3); // Skip straight to account selection
    // Score in background
    const sellerCtx2=sellerDocs.length>0
      ? sellerDocs.map(d=>d.label+": "+d.content.slice(0,400)).join(" | ")
      : sellerUrl+(productUrls.filter(u=>u.url).map(u=>u.url).join(" | ")??" ");
    scoreFit(cohort.members, sellerCtx2);
  };
  const goToOutcomes=()=>{
    if(selectedCohort){
      // Start with the 6 universal imperatives + any cohort-specific outcomes
      const universal=OUTCOMES.filter(o=>UNIVERSAL_IMPERATIVES.includes(o.id)).map(o=>o.title);
      const cohortSpecific=selectedCohort.topOut.slice(0,2);
      const combined=[...new Set([...cohortSpecific,...universal])].slice(0,6);
      setSelectedOutcomes(combined);
      setStep(4);
    }
  };

  const pickAccount = async member => {
    setSelectedAccount(member);
    setBriefLoading(true);
    setBriefError("");
    setBriefStatus("Researching " + member.company + "...");
    setGateAnswers({}); setGateNotes({}); setRiverData({}); setDiscoveryQs(null);
    setDealValue(""); setDealClassification(""); setNotes(""); setPostCall(null);
    setContactRole(""); setCustomOutcome("");
    setStep(5);

    // generateBrief is now synchronous — returns skeleton + per-section
    // merger promises. Paint the skeleton INSTANTLY, then each section
    // fills in as its Haiku call returns.
    const { skeleton, mergers, allDone } = generateBrief(
      member, sellerUrl, sellerDocs, products,
      selectedCohort, selectedOutcomes, productPageUrl,
      (msg) => setBriefStatus(msg),
      productUrls
    );
    setBrief(skeleton);
    setBriefLoading(false);  // skeleton counts as "loaded" — sections show their own inline progress
    setBriefStatus("");

    // Wire each section's merger to fire as it resolves.
    Object.values(mergers).forEach(m => {
      m.then(updater => { if (typeof updater === "function") setBrief(prev => updater(prev)); });
    });

    // Buildhypothesis + discovery questions depend on the full brief, so
    // wait for all sections to settle before kicking them off.
    allDone.then(() => {
      setBrief(current => {
        if (current?._error) setBriefError(current._error);
        return current;
      });
      // Use a microtask to read the freshest brief state.
      setTimeout(() => {
        setBrief(current => {
          if (current) {
            Promise.resolve().then(() => buildRiverHypo(current, member));
            Promise.resolve().then(() => generateDiscoveryQs(current, member));
          }
          return current;
        });
      }, 0);
    });
  };

  // ── BUILD RIVER HYPOTHESIS (background, after brief) ─────────────────────
  const buildRiverHypo = async(briefData, member) => {
    if(!briefData) return;
    setRiverHypoLoading(true);
    setRiverHypo(null);

    const co = member.company;
    const snapshot = (briefData.companySnapshot || "").slice(0,350);
    const theme = (briefData.strategicTheme || "").slice(0,250);
    const signals = (briefData.recentSignals||[]).join("; ").slice(0,200);
    const headlines = (briefData.recentHeadlines||[]).map(h=>h?.headline||h||"").filter(Boolean).join("; ").slice(0,200);
    const opportunity = (briefData.sellerOpportunity || "").slice(0,200);

    // Seller context — this is what determines what the hypothesis can actually propose
    const activeProductUrls = productUrls.filter(u=>u.url.trim()).map(u=>u.url.trim());
    const sellerCtx = sellerDocs.length>0
      ? sellerDocs.map(d=>d.label+": "+d.content.slice(0,400)).join(" | ")
      : "Seller: "+sellerUrl+(activeProductUrls.length?" | Pages: "+activeProductUrls.join(", "):"");
    const productsCtx = products.filter(p=>p.name.trim()).length>0
      ? products.filter(p=>p.name.trim()).map(p=>p.name+(p.description?" — "+p.description.slice(0,80):"")).join("; ")
      : "";
    const mappedSolutions = (briefData.solutionMapping||[]).filter(s=>s?.product)
      .map(s=>s.product+": "+s.fit).join("\n").slice(0,400);

    const prompt =
      "You are a senior B2B sales strategist. Build a RIVER hypothesis that helps a seller at " + sellerUrl + " win a deal with " + co + ".\n\n" +
      "CRITICAL CONSTRAINT: Only reference what the SELLER delivers. Zero generic consulting.\n" +
      "TONE: Write like a seasoned consultant, not a chatbot. Short sentences. No buzzwords — never use 'leverage', 'synergy', 'holistic', 'robust', 'unlock', 'empower'. talkTracks must be 1-2 sentences — Mom Test grounded: past behavior and real problems, never hypothetical future intent.\n" +
      "BUYER EXPERIENCE FRAMEWORK (Gartner 2023 — 1,700 buyers): Buyers spend only 17% of time with vendors. Every interaction must create value they can't get from online research. The rep who wins: (1) already knows their industry, (2) challenges their thinking without arrogance, (3) shows proof from similar companies, (4) makes the next step obvious and small, (5) asks about their world not their product.\n" +
      "JOLT EFFECT (Dixon/McKenna): Indecision kills 40-60% of deals. FOMU > FOMO. Route: J=Judge indecision, O=One clear recommendation, L=Limit scope, T=Take risk off table (pilot/SLA/phased).\n" +
      "VOSS: Calibrated How/What questions only. Tactical empathy — name emotion before agenda. Accusation Audit: name objections before they raise them.\n" +
      "FISHER/URY: Surface interests not positions. When price comes up ask what is driving that number. Always have pilot/phased option ready.\n" +
      "SUN TZU: Know competitive alternatives before call. Find underserved stakeholder not gatekeeper. Recommend smallest first step.\n" +
      "CIALDINI: Social proof from exact industry. Authority via specific data. Real scarcity only — regulatory deadlines, budget cycles.\n" +
      "CHALLENGER CUSTOMER (CEB/Gartner): Identify the MOBILIZER — not the Talker or Blocker. Only 13% of stakeholders are Mobilizers. They ask 'how do we make this happen?'. Teach an insight to the ORGANIZATION through the Mobilizer. The teaching angle must challenge a widely-held assumption about their industry.\n" +
      "QUALIFICATION SIGNALS: referral/partner deals close 30%+ higher; funding <12 months = 18-month buying window; single-threaded prospect = 3x churn risk; SMB 30-45 day cycles, Mid-market 60-90, Enterprise 90-180; Ellis 40% must-have test is the critical qualifier.\n" +
      "SEGMENT-SPECIFIC SELLING NOTES (apply whichever matches this account):\n" +
      "- Private Insurance (State Farm/Allstate/Nationwide): relationship first, compliance confidence before features, reference check culture, no artificial urgency\n" +
      "- Regional Banks (US Bank/PNC/Truist): regulatory fluency required (BSA/AML/OCC), pilot-friendly, IT+InfoSec are hidden veto players\n" +
      "- Private Professional Services (Deloitte/EY/KPMG): they know selling — be precise, focus on making THEIR delivery better, partner-level buy-in needed\n" +
      "- Large Private Tech (Bloomberg/SAS/Valve): technical depth expected, security posture upfront, fast decisions if champion is right level\n" +
      "PE SELLER SMB DYNAMICS (3,366 scenarios): Vertical SaaS PE + matched SMB vertical = 95% fit. High-EBITDA PE → SMB new logos = 51% avg fit — recommend Route stage focuses on expansion of existing base. Healthcare practices and Insurance agencies are top PE SMB verticals. Wealth Mgmt/RIA (64.9% avg) is underserved by most PE sellers. MSP channel preferred over direct for high-EBITDA PE targeting <250-employee accounts.\n\n" +
      "UNIVERSAL ASSUMPTION: Every company wants to grow, expand, stay compliant, reduce fraud/risk, satisfy investors, and make customers happy. Ground every RIVER stage in which of these six this seller can directly address for " + co + ".\n" +
      "SELLER STAGE: " + (sellerStage||"not specified") + ". Adjust the Route stage accordingly: Series A → recommend channel/partner motion or innovation arm; Series B/C → departmental landing; Series D+/PE/Public → full enterprise motion.\n" +
      "SELLER (" + sellerUrl + ") CONTEXT:\n" + sellerCtx + "\n" +
      (productsCtx?"SELLER PRODUCTS/SERVICES: "+productsCtx+"\n":"") +
      "\nPROSPECT: " + co + " | Industry: " + (member.ind||"") + "\n" +
      "SNAPSHOT: " + snapshot + "\n" +
      "STRATEGIC THEME: " + theme + "\n" +
      "BUYING SIGNALS: " + signals + "\n" +
      "RECENT NEWS: " + headlines + "\n" +
      "SELLER OPPORTUNITY (pre-built): " + opportunity + "\n" +
      "SOLUTION MAPPING (pre-built):\n" + mappedSolutions + "\n\n" +
      "BUILD THE RIVER HYPOTHESIS:\n" +
      "Every field grounded in what " + sellerUrl + " sells. No stray consulting.\n" +
      "DMAIC: Reality=Define+Measure, Impact=Analyze, Vision=Improve, Route=Control.\n" +
      "Return ONLY raw JSON, ASCII punctuation only:\n" +
      JSON.stringify({
        reality:"2-3 sentences: the specific current-state problem "+co+" has that "+sellerUrl+" can solve. Include ONE real signal (hiring, news, Glassdoor, funding). No fluff.",
        impact:"What this problem is costing "+co+" in real business terms. One number or consequence if possible. Short and visceral — something the economic buyer feels.",
        vision:"Success in "+co+"'s words — not a product feature list. 1-2 sentences. Specific, measurable, tied to their stated business outcomes.",
        entryPoints:"The Mobilizer profile at "+co+" — NOT just any stakeholder. Who asks 'how do we make this happen?'. Name the type, title, and what they personally win.",
        route:"JOLT-structured next step: (1) name the indecision risk explicitly, (2) give ONE clear recommendation — not options, (3) scope it small — pilot or workshop, (4) state how you take risk off the table. Stage-appropriate: Series A=partner/innovation arm, B/C=departmental pilot, D+=full enterprise.",
        openingAngle:"2 sentences max. Challenge a widely-held assumption about "+co+"'s industry. Reference something real. Human, provocative, not scripted.",
        challengerInsight:"The insight you teach the ORGANIZATION through the Mobilizer — one assumption their industry holds that "+sellerUrl+" can disprove with data or a case study.",
        joltPlan:{
          judgeIndecision:"1 sentence: how to name the FOMU (fear of messing up) that is slowing this deal",
          recommendation:"Your specific single-POV recommendation for "+co+" — not options",
          limitExploration:"How to narrow the scope to make the decision smaller and easier",
          takeRiskOff:"Specific pilot scope, SLA, reference customer, or phased rollout that removes their risk",
        },
        talkTracks:[
          {stage:"Opening",line:"1-2 natural sentences. Teach the Challenger insight about "+co+"'s industry. Make them lean in."},
          {stage:"Discovery (Mom Test)",line:"One short question about their PAST BEHAVIOR around this problem — not about the future or our product. Use their language."},
          {stage:"Impact (Ellis Test)",line:"One question that tests if this is a must-have: 'If you had to go back to [old way] tomorrow, what would that mean for [specific team/metric]?'"},
          {stage:"Vision",line:"One sentence. What good looks like in their words — specific and measurable, not a product feature."},
          {stage:"Route (JOLT)",line:"Name the decision clearly and offer one specific recommendation: 'Based on what you've told me, I'd recommend starting with [specific pilot]. Here's why...'"},
        ],
      });

    const result = await callAI(prompt);
    if(result){
      setRiverHypo(result);
    } else {
      // callAI failed — set a placeholder so the page still renders
      setRiverHypo({
        reality:"Could not generate — click to edit manually.",
        impact:"",vision:"",entryPoints:"",route:"",
        openingAngle:"",talkTracks:[],
      });
    }
    setRiverHypoLoading(false);
  };

  // ── GENERATE PRODUCT-SPECIFIC DISCOVERY QUESTIONS ───────────────────────
  // Informed by: seller products, prospect context, 5 listening frameworks
  // Fires after brief completes, alongside hypothesis build
  const generateDiscoveryQs = async(briefData, member) => {
    if(!briefData||discoveryQs) return;
    const co = member.company;
    const products_ctx = (briefData.solutionMapping||[]).filter(s=>s?.product).map(s=>s.product+": "+s.fit).join("; ");
    const seller = sellerUrl;
    const snapshot = (briefData.companySnapshot||"").slice(0,300);
    const theme = (briefData.strategicTheme||"").slice(0,200);

    const prompt =
      `You are a senior B2B discovery coach trained in customer development and product-market fit validation.\n`+`UNIVERSAL TRUTH: Every company — regardless of industry — universally wants to grow, expand, stay compliant, reduce fraud/risk, satisfy investors, and make customers happy. Root discovery questions in which of these six the seller can address. Every question should ultimately connect to one or more of these imperatives.\n`+`Apply Mom Test (Fitzpatrick): ask about their PAST BEHAVIOR and REAL PROBLEMS, never about your product or hypothetical futures.
Apply Voss (Never Split the Difference): calibrated questions ONLY — every question starts with "How" or "What", never yes/no. Use mirroring and labeling to surface emotion.
Apply Fisher/Ury: surface interests not positions. "What's driving that?" not "Do you want X?"
Apply Cialdini: use social proof ("companies like yours...") and authority ("the data shows...") naturally.
Apply Sun Tzu: know their terrain — ask about the competitive landscape and who else they're talking to.
Apply Crucial Conversations: watch for safety signals. If they go quiet, ask "It seems like something I said didn't land — what's your read?"
\n`+`Apply Blank customer development: validate the problem EXISTS and MATTERS before mentioning solutions.\n`+`Apply Olsen PMF Pyramid: questions should surface Target Customer fit → Underserved Need → Value Prop resonance.\n`+`Apply Sean Ellis 40% Rule: include at least one question that tests if this is a must-have (not nice-to-have). E.g. "If you had to go back to how you handled this 18 months ago, what would that mean for your team?"\n`+`Apply churn-inverse signals: ask who owns this problem (single-threaded = risk), how many stakeholders are involved, and whether there is executive sponsorship.\n`+
      `Frameworks you apply: Gap Selling, Challenger Sale, plus the following listening principles:\n`+
      `- Active Listening (Heather Younger): listen for what is NOT said; reflect back what you hear\n`+
      `- Just Listen (Mark Goulston): make the other person feel heard before advancing your agenda\n`+
      `- How to Know a Person (David Brooks): witness their reality with openness; ask about their world not your product\n`+
      `- We Need to Talk (Celeste Headlee): no multitasking, no assumptions, be present and curious\n`+
      `- The Charisma Myth (Olivia Fox Cabane): project presence, power, and warmth — make them feel seen\n\n`+
      `SELLER: ${seller} | PRODUCTS: ${products_ctx}\n`+
      `PROSPECT: ${co} | SNAPSHOT: ${snapshot} | STRATEGIC THEME: ${theme}\n\n`+
      `Generate 2 discovery questions per RIVER stage. Each question must be:\n`+
      `- 1 sentence max — something a rep says naturally mid-conversation\n`+
      `- Tied directly to what the seller sells, not generic consulting\n`+
      `- Curious and human in tone, not clinical or scripted\n\n`+
      `Also name the listening principle behind each question so the rep knows WHY they're asking it.\n\n`+
      `Return ONLY raw JSON, start with {:\n`+
      `{"reality":[{"q":"Question?","framework":"Active Listening - reflect their reality back","intent":"Why this question works"}],"impact":[{"q":"","framework":"","intent":""}],"vision":[{"q":"","framework":"","intent":""}],"entryPoints":[{"q":"","framework":"","intent":""}],"route":[{"q":"","framework":"","intent":""}]}`;

    const result = await callAI(prompt);
    if(result) setDiscoveryQs(result);
  };

  // ── SOLUTION ARCHITECTURE REVIEW ──────────────────────────────────────────
  // Fired after post-call. Uses call capture to re-evaluate solution fit
  // with SA rigor: business requirements → architecture → fit mapping.
  // Frameworks: Rajput (biz→digital), McSweeney (stakeholder alignment),
  // Richards/Ford (architecture attributes), Fowler (integration patterns)
  const buildSolutionFit = async() => {
    if(!brief||!postCall) return;
    setSolutionFitLoading(true);

    const solutions = (brief.solutionMapping||[]).filter(s=>s?.product).map(s=>s.product+": "+s.fit).join("\n");
    const riverCapture = RIVER_STAGES.map(s=>{
      const gates = s.gates.map(g=>`${g.q}: ${gateAnswers[g.id]||"Not answered"}`).join("; ");
      const disc  = s.discovery.map(p=>`${p.label}: ${riverData[p.id]||"Not captured"}`).join("; ");
      return `${s.label}: ${gates} | ${disc}`;
    }).join("\n");

    const prompt =
      `You are a senior Solution Architect evaluating product-to-customer fit after a discovery call.\n\n`+
      `COMPANY: ${selectedAccount?.company} | Industry: ${selectedAccount?.ind||"Unknown"}\n`+
      `OUTCOMES SOUGHT: ${selectedOutcomes.join(", ")||"Not defined"}\n`+
      `DEAL CONFIDENCE: ${confidence}%\n`+
      `DEAL ROUTE: ${postCall?.dealRoute||"Unknown"}\n\n`+
      `SELLER SOLUTIONS MAPPED PRE-CALL:\n${solutions}\n\n`+
      `DISCOVERY CAPTURE (what we actually heard):\n${riverCapture}\n\n`+
      `CALL NOTES:\n${notes||"None"}\n\n`+
      `POST-CALL SUMMARY: ${postCall?.callSummary||""}\n\n`+
      `Apply Solution Architecture principles:\n`+
      `- Rajput: align their business proposition to the digital solution — does what we sell map to what they need to BUILD?\n`+
      `- McSweeney: assess stakeholder alignment — do the right people see the value?\n`+
      `- Richards/Ford: evaluate architecture fit attributes — scalability, reliability, maintainability, security fit\n`+
      `- Fowler: flag integration complexity — what patterns does connecting to their stack require?\n`+
      `- Shrivastav: identify AI/ML, cloud-native, or legacy modernization signals — which products fit best?\n`+
      `Apply PMF qualification signals from research data:\n`+
      `- Sean Ellis 40% Rule: would >40% of this team say "very disappointed" if the solution went away? Score overallPMFSignal accordingly\n`+
      `- Churn risk flags: single stakeholder champion, evaluation team >7 without named owner, no dedicated use case owner = flag in architectureGaps\n`+
      `- Must-have test: if the problem they described would persist without a solution, that is Strong PMF; if it is a nice-to-have workflow improvement, that is Weak PMF\n\n`+
      `Return ONLY raw JSON, start with {:\n`+
      `{"dmiacStage":"Define or Measure or Analyze or Improve or Control",`+`"adoptionProfile":"Innovator or Early Adopter or Early Majority or Late Majority",`+`"adoptionImplication":"1 sentence: what their adoption profile means for messaging, proof points, and sales approach",`+`"pmfAssessment":{"targetCustomerFit":"Strong/Partial/Weak — is this genuinely the ICP?","underservedNeedFit":"Strong/Partial/Weak — is the need real and unmet?","valuePropositionFit":"Strong/Partial/Weak — does our value prop land clearly?","overallPMFSignal":"Strong/Emerging/Weak — overall PMF signal from this discovery"},`+`"dmiacRationale":"Why this stage, and what it means for the selling approach and timing",`+`"entryStrategy":"Given their DMAIC stage: Quick Win Pilot, Diagnostic Workshop, Full Deployment, or Expansion and Scale - and why",`+`"confirmedSolutions":[{"product":"solution name","fitScore":85,"fitLabel":"Strong Fit","businessAlignment":"How it maps to their stated business need","architectureNotes":"Integration complexity, scale requirements, tech stack considerations","implementationPhase":"Phase 1 (Immediate) or Phase 2 (3-6mo) or Phase 3 (6-12mo)","risks":"Specific technical or organizational risks"}],`+
      `"revisedSolutions":[{"product":"solution that needs re-evaluation","change":"Upgraded/Downgraded/Removed","reason":"Why it changed based on what we learned"}],`+
      `"architectureGaps":[{"gap":"What the customer needs that we didn't fully address","recommendation":"How to bridge it — our product, partnership, or configuration"}],`+
      `"implementationRoadmap":"2-3 sentence recommended phasing: what to implement first and why, framed around their desired outcomes",`+
      `"integrationComplexity":"Low / Medium / High with 1-sentence explanation",`+
      `"successMetrics":["Specific measurable outcome 1 tied to their stated goals","Metric 2","Metric 3"],`+
      `"saRecommendation":"Senior SA perspective: given everything we know, what is the single most important thing to get right in the proposal to win this deal?"}`;

    const result = await callAI(prompt);
    setSolutionFit(result||{
      confirmedSolutions:[],revisedSolutions:[],architectureGaps:[],
      implementationRoadmap:"Unable to generate — review discovery notes and try again.",
      integrationComplexity:"Unknown",successMetrics:[],
      saRecommendation:"Insufficient discovery data captured.",
    });
    setSolutionFitLoading(false);
  };

  const runPostCall=async()=>{
    setPostLoading(true);
    const riverSummary=RIVER_STAGES.map(s=>{
      const gates=s.gates.map(g=>`${g.q}: ${gateAnswers[g.id]||"Not answered"}`).join("; ");
      const disc=s.discovery.map(p=>`${p.label}: ${riverData[p.id]||"Not captured"}`).join("; ");
      return`${s.label}: ${gates} | ${disc}`;
    }).join("\n");

    const result=await callAI(
      `Senior sales coach reviewing a RIVER framework discovery call.

Company: ${selectedAccount?.company} | Industry: ${selectedAccount?.ind} | Role: ${contactRole||"Unknown"} | ACV: ${selectedAccount?.acv>0?"$"+selectedAccount.acv.toLocaleString():"Unknown"} | Confidence: ${confidence}%
Cohort: ${selectedCohort?.name} | Outcomes: ${selectedOutcomes.join(", ")}
Solutions: ${(brief?.solutionMapping||[]).filter(s=>s?.product).map(s=>s.product).join(", ")||"Unknown"}

RIVER Capture:
${riverSummary}

Notes: ${notes||"None"}

Return ONLY valid JSON:
{
  "callSummary": "3-4 sentence narrative of what was learned",
  "riverScorecard": {
    "reality": "What was confirmed about current state",
    "impact": "What cost or impact was surfaced",
    "vision": "What success looks like in their words",
    "entryPoints": "What was learned about buying process",
    "route": "Recommended next move and why"
  },
  "dealRoute": "FAST_TRACK or NURTURE or DISQUALIFY",
  "dealRouteReason": "One sentence explaining the routing decision",
  "dealRisk": "Single biggest risk to this deal",
  "nextSteps": ["Step 1 with owner and date", "Step 2", "Step 3"],
  "crmNote": "CRM-ready note — 4-5 sentences covering state, pain, vision, process, next action",
  "emailSubject": "Follow-up email subject line",
  "emailBody": "Full follow-up email — professional, outcome-focused, references specific things discussed, clear CTA"
}`
    );

    setPostCall(result||{callSummary:"Unable to generate synthesis. Review your discovery notes and try again.",riverScorecard:{reality:"",impact:"",vision:"",entryPoints:"",route:""},dealRoute:"NURTURE",dealRouteReason:"Insufficient data captured to route definitively.",dealRisk:"Incomplete discovery",nextSteps:["Schedule follow-up call","Share relevant case study","Confirm economic buyer"],crmNote:"Call completed. Review notes for next steps.",emailSubject:"Following up — "+(selectedAccount?.company||""),emailBody:"Hi,\n\nThank you for your time today. I'll follow up with next steps shortly.\n\nBest,"});
    setPostLoading(false);
    setStep(8);
  };

  const copyText=(t,k)=>{navigator.clipboard.writeText(t).then(()=>{setCopied(k);setTimeout(()=>setCopied(""),2000);});};
  const isFilled=s=>s.gates.some(g=>gateAnswers[g.id])||s.discovery.some(p=>riverData[p.id]?.trim());
  // ── CUSTOMER-FACING POST-CALL BRIEF ─────────────────────────────────────
  const escHtml=(s)=>(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");

  const showCustomerBrief=()=>{
    const co = selectedAccount?.company||"";
    const date = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
    const sellerName = escHtml(sbUser?.user_metadata?.full_name||sbUser?.email||sellerUrl||"");
    const solutions = (brief?.solutionMapping||[]).filter(s=>s?.product).slice(0,4);
    const outcomes = (selectedOutcomes||[]).join(", ");
    const callSummary = escHtml(postCall?.callSummary||"");
    const nextSteps = postCall?.nextSteps||[];
    // Split next steps: steps with "you" / customer-named action → their side; rest → seller
    const sellerSteps = nextSteps.filter((_,i)=>i%2===0).slice(0,3);
    const customerSteps = nextSteps.filter((_,i)=>i%2!==0).slice(0,3);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Call Summary — ${co}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #fff; color: #1a1a18; }
  @page { size: A4; margin: 18mm 18mm 14mm; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }

  .page { max-width: 720px; margin: 0 auto; padding: 40px 44px; }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #1a1a18; }
  .header-left h1 { font-family: 'Lora', serif; font-size: 26px; font-weight: 700; color: #1a1a18; margin-bottom: 4px; }
  .header-left .sub { font-size: 13px; color: #8B6F47; font-weight: 600; letter-spacing: 0.3px; }
  .header-right { text-align: right; font-size: 12px; color: #777; line-height: 1.8; }
  .header-right strong { color: #1a1a18; font-weight: 600; }

  /* Section */
  .section { margin-bottom: 24px; }
  .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #8B6F47; margin-bottom: 10px; }
  .section-body { font-size: 14px; line-height: 1.7; color: #333; }

  /* Summary box */
  .summary-box { background: #F8F6F1; border-left: 3px solid var(--tan-0); border-radius: 0 8px 8px 0; padding: 14px 16px; font-size: 14px; line-height: 1.7; color: #333; }

  /* Solutions */
  .solutions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .solution-card { background: #F8F6F1; border-radius: 8px; padding: 12px 14px; }
  .solution-name { font-size: 13px; font-weight: 700; color: #1a1a18; margin-bottom: 4px; }
  .solution-fit { font-size: 12px; color: #555; line-height: 1.5; }

  /* Next steps */
  .steps-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .steps-col { }
  .steps-col-title { font-size: 12px; font-weight: 700; color: #fff; background: #1a1a18; border-radius: 6px; padding: 5px 12px; margin-bottom: 10px; display: inline-block; }
  .steps-col-title.theirs { background: #2E6B2E; }
  .step-item { display: flex; gap: 8px; margin-bottom: 8px; align-items: flex-start; }
  .step-num { width: 20px; height: 20px; border-radius: 50%; background: #1a1a18; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .step-num.green { background: #2E6B2E; }
  .step-text { font-size: 13px; color: #333; line-height: 1.5; }

  /* Footer */
  .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid var(--line-0); display: flex; justify-content: space-between; align-items: center; }
  .footer-left { font-size: 11px; color: #aaa; }
  .footer-right { font-size: 11px; color: #aaa; }
  .footer-brand { font-family: 'Lora', serif; font-weight: 700; color: #1a1a18; font-size: 12px; }
  .footer-brand span { color: #8B6F47; }

  /* Divider */
  .divider { height: 1px; background: #E8E6DF; margin: 20px 0; }

  /* Outcomes pill */
  .outcomes { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .outcome-pill { background: #EEF5EE; color: #2E6B2E; border: 1px solid #2E6B2E44; border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 600; }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <h1>Discovery Call Summary</h1>
      <div class="sub">${co} · Confidential</div>
    </div>
    <div class="header-right">
      <div><strong>Date:</strong> ${date}</div>
      <div><strong>Prepared by:</strong> ${sellerName}</div>
      <div><strong>Account:</strong> ${co}</div>
    </div>
  </div>

  <!-- Call Summary -->
  <div class="section">
    <div class="section-title">Call Summary</div>
    <div class="summary-box">${callSummary||"Summary of discovery call and key findings."}</div>
  </div>

  ${outcomes?'<div class="section"><div class="section-title">Target Outcomes Discussed</div><div class="outcomes">'+selectedOutcomes.map(o=>'<span class="outcome-pill">'+o+'</span>').join("")+'</div></div>':""}

  ${solutions.length?'<div class="section"><div class="section-title">Solutions Reviewed</div><div class="solutions">'+solutions.map(s=>'<div class="solution-card"><div class="solution-name">'+s.product+'</div><div class="solution-fit">'+(s.fit?.split(".")[0]||"")+'</div></div>').join("")+'</div></div>':""}

  <div class="divider"></div>

  <!-- Next Steps -->
  <div class="section">
    <div class="section-title">Agreed Next Steps</div>
    <div class="steps-grid">
      <div class="steps-col">
        <div class="steps-col-title">We Will</div>
        ${(sellerSteps.length?sellerSteps:nextSteps.slice(0,3)).map((s,i)=>'<div class="step-item"><div class="step-num">'+(i+1)+'</div><div class="step-text">'+s+'</div></div>').join('')}
      </div>
      <div class="steps-col">
        <div class="steps-col-title theirs">You Will</div>
        ${customerSteps.length?customerSteps.map((s,i)=>'<div class="step-item"><div class="step-num green">'+(i+1)+'</div><div class="step-text">'+s+'</div></div>').join(''):'<div class="step-item"><div class="step-num green">1</div><div class="step-text">Review the proposed solutions and share any questions or feedback</div></div><div class="step-item"><div class="step-num green">2</div><div class="step-text">Confirm stakeholders who should be involved in next conversation</div></div>'}
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">Prepared for ${co} · ${date}</div>
    <div class="footer-right">
      <span class="footer-brand">Cambrian <span>Catalyst</span></span>
    </div>
  </div>

</div>
<script>
  // Auto-open print dialog after fonts load
  window.addEventListener('load', () => setTimeout(() => window.print(), 800));
</script>
</body>
</html>`;

    const win = window.open("","_blank","width=900,height=1100");
    if(win){
      // Use srcdoc via blob URL instead of document.write (safer)
      const blob = new Blob([html],{type:"text/html"});
      const url = URL.createObjectURL(blob);
      win.location.href = url;
      setTimeout(()=>URL.revokeObjectURL(url), 10000);
    }
  };

  const doExport=()=>{
    // Scroll to top so print starts from beginning of current step
    window.scrollTo(0,0);
    setTimeout(()=>window.print(), 150);
  };

  const STEPS=["Session","ICP & RFPs","Import","Accounts","Account Review","Brief","Hypothesis","In-Call","Post-Call","Solution Fit"];
  const routeClass=postCall?.dealRoute==="FAST_TRACK"?"route-fast":postCall?.dealRoute==="NURTURE"?"route-nurture":"route-disq";
  const routeLabel=postCall?.dealRoute==="FAST_TRACK"?"Fast Track →":postCall?.dealRoute==="NURTURE"?"Nurture":"Disqualify";

  if(!authed) return <PasswordGate onAuth={(u,tok)=>{setAuthed(true);setSbUser(u);setSbToken(tok);}}/>;

  return(
    <>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            <div className="logo">Cambrian <span>Catalyst</span></div>
            <div style={{fontSize:9,letterSpacing:"0.7px",color:"var(--ink-3)",fontWeight:700,textTransform:"uppercase"}}>
              Reality · Impact · Vision · Entry · Route
            </div>
          </div>
          <div className="stepper" aria-label="Workflow progress">
            {STEPS.map((s,i)=>{
              const canNav = (()=>{
                if(i===step) return false;
                if(i===0) return true;
                if(i===1) return !!sellerUrl;
                if(i===2) return !!sellerUrl;
                if(i===3) return cohorts.length>0;
                if(i===4) return cohorts.length>0;
                if(i===5) return !!brief;
                if(i===6) return !!brief;
                if(i===7) return !!riverHypo;
                if(i===8) return !!postCall;
                if(i===9) return !!solutionFit;
                return step>i;
              })();
              const state = step===i ? "active" : step>i ? "done" : "";
              const railState = step>i ? "done" : step===i ? "active" : "";
              return(
                <React.Fragment key={i}>
                  {i>0 && <div className={`step-rail ${railState}`} aria-hidden="true"/>}
                  <button
                    type="button"
                    className={`step-item ${state}`}
                    disabled={!canNav && step!==i}
                    onClick={()=>canNav&&setStep(i)}
                    aria-current={step===i?"step":undefined}
                    title={canNav?`Go to ${s}`:step===i?`Current step: ${s}`:"Complete earlier steps first"}>
                    <div className="step-num">{step>i?"✓":i+1}</div>
                    <div className="step-label">{s}</div>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {step===7&&<div className="live-badge"><div className="live-dot"/>Live Call</div>}
            {step>0&&(
              <button onClick={saveSession}
                style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:8,cursor:"pointer",
                  border:"1.5px solid "+(sbUser?"var(--green)":"var(--amber)"),
                  background:saveStatus==="saved"?"var(--green-bg)":sbUser?"#fff":"var(--amber-bg)",
                  color:sbUser?(saveStatus==="saved"?"var(--green)":"var(--green)"):"#7A5010"}}>
                {!sbUser?"🔒 Save":saveStatus==="saving"?"⏳":saveStatus==="saved"?"✓":"💾"} {saveStatus==="saved"?"Saved":"Save"}
              </button>
            )}
            {sbUser&&<button onClick={()=>{loadSessions();setShowSessions(s=>!s);}}
              style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:8,border:"1.5px solid var(--line-0)",background:"#fff",color:"#555",cursor:"pointer"}}>
              📂 {savedSessions.length>0?savedSessions.length+" Sessions":"Sessions"}
            </button>}
            {sbUser&&<button onClick={()=>{localStorage.removeItem('sb_token');window.location.reload();}}
              style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:8,border:"1.5px solid var(--line-0)",background:"#fff",color:"#aaa",cursor:"pointer"}}>
              {sbUser.user_metadata?.first_name||sbUser.email?.split('@')[0]} · Sign out
            </button>}
          </div>
        </header>

        {/* GUEST BANNER */}
        {!sbUser&&step>0&&(
          <div style={{background:"var(--amber-bg)",borderBottom:"1px solid #BA751744",padding:"7px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div style={{fontSize:12,color:"#7A5010"}}>👤 <strong>Guest mode</strong> — your work is not being saved.</div>
            <button onClick={()=>{setAuthed(false);}}
              style={{fontSize:12,fontWeight:700,padding:"4px 14px",borderRadius:8,background:"var(--ink-0)",color:"#fff",border:"none",cursor:"pointer"}}>
              Create Free Account
            </button>
          </div>
        )}

        {/* SAVE PROMPT */}
        {showSavePrompt&&(
          <>
            <div onClick={()=>setShowSavePrompt(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:2000}}/>
            <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"#fff",borderRadius:16,padding:"36px 40px",maxWidth:380,width:"90%",zIndex:2001,textAlign:"center",boxShadow:"0 8px 48px rgba(0,0,0,0.15)"}}>
              <div style={{fontSize:28,marginBottom:12}}>💾</div>
              <div style={{fontFamily:"Lora,serif",fontSize:18,fontWeight:700,marginBottom:8}}>Save your work</div>
              <div style={{fontSize:14,color:"#555",lineHeight:1.7,marginBottom:24}}>Create a free account to save sessions and pick up where you left off.</div>
              <button onClick={()=>{setShowSavePrompt(false);setAuthed(false);}}
                style={{width:"100%",padding:"13px 0",borderRadius:10,background:"var(--ink-0)",color:"#fff",fontFamily:"DM Sans,sans-serif",fontSize:15,fontWeight:700,border:"none",cursor:"pointer",marginBottom:10}}>
                Create Free Account →
              </button>
              <button onClick={()=>setShowSavePrompt(false)}
                style={{width:"100%",padding:"11px 0",borderRadius:10,background:"#fff",color:"#777",fontFamily:"DM Sans,sans-serif",fontSize:14,border:"1.5px solid var(--line-0)",cursor:"pointer"}}>
                Maybe later
              </button>
            </div>
          </>
        )}

        {/* SESSIONS DRAWER */}
        {showSessions&&sbUser&&(
          <>
            <div onClick={()=>setShowSessions(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.2)",zIndex:999}}/>
            <div style={{position:"fixed",top:0,right:0,height:"100vh",width:320,background:"#fff",boxShadow:"-4px 0 24px rgba(0,0,0,0.12)",zIndex:1000,display:"flex",flexDirection:"column"}}>
              <div style={{padding:"18px 18px 12px",borderBottom:"1px solid var(--line-0)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:"Lora,serif",fontSize:15,fontWeight:700}}>Saved Sessions</div>
                  <div style={{fontSize:11,color:"#aaa"}}>{sbUser.email}</div>
                </div>
                <button onClick={()=>setShowSessions(false)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#aaa"}}>✕</button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:10}}>
                {savedSessions.length===0&&<div style={{textAlign:"center",color:"#aaa",fontSize:13,padding:"32px 0"}}>No saved sessions yet.</div>}
                {savedSessions.map(s=>(
                  <div key={s.id} onClick={()=>restoreSession(s)}
                    style={{padding:"10px 12px",borderRadius:10,border:"1.5px solid "+(s.id===currentSessionId?"var(--ink-0)":"var(--line-0)"),background:s.id===currentSessionId?"var(--bg-1)":"#fff",marginBottom:8,cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                        <div style={{fontSize:11,color:"var(--tan-0)"}}>{s.seller_url}</div>
                        <div style={{fontSize:10,color:"#aaa"}}>{new Date(s.updated_at).toLocaleDateString()}</div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();deleteSession(s.id);}} style={{background:"none",border:"none",color:"#ccc",cursor:"pointer",fontSize:14}}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:12,borderTop:"1px solid var(--line-0)"}}>
                <input value={sessionName} onChange={e=>setSessionName(e.target.value)} placeholder={sellerUrl||"Session name..."} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid var(--line-0)",fontSize:13,marginBottom:8,boxSizing:"border-box"}}/>
                <button onClick={saveSession} style={{width:"100%",padding:"10px",borderRadius:8,background:"var(--ink-0)",color:"#fff",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:700,border:"none",cursor:"pointer"}}>
                  {saveStatus==="saving"?"Saving...":saveStatus==="saved"?"✓ Saved":"Save Session"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* SESSION BAR */}
        {step>0&&sellerUrl&&(
          <div className="session-bar">
            <span>Selling org:</span><span className="session-url">{sellerUrl}</span>
            {products.filter(p=>p.name.trim()).length>0&&(
              <span style={{fontSize:10,color:"var(--tan-0)",fontWeight:600}}>
                {products.filter(p=>p.name.trim()).length} product{products.filter(p=>p.name.trim()).length>1?"s":""} loaded
              </span>
            )}
            {productPageUrl&&(
            <span style={{fontSize:10,color:"var(--tan-0)",display:"flex",alignItems:"center",gap:4}}>
              🔗 {productPageUrl.replace(/^https?:\/\//,"").slice(0,30)}
            </span>
          )}
          {sellerDocs.length>0&&(
              <>{sellerDocs.map((d,i)=>(
                <div key={i} className="session-doc-chip">📄 {d.label}</div>
              ))}</>
            )}
            {sellerICP?.icp?.industries?.length>0&&(
              <span style={{fontSize:10,color:"var(--purple)",fontWeight:600,background:"var(--purple-bg)",border:"1px solid #6B3A7A44",borderRadius:10,padding:"2px 8px"}}>
                ICP: {sellerICP.icp.industries.slice(0,2).join(", ")}
              </span>
            )}
            {selectedCohort&&<><span>·</span><span>Cohort: <strong>{selectedCohort.name}</strong></span></>}
            {selectedAccount&&<><span>·</span><span>Account: <strong>{selectedAccount.company}</strong></span></>}
            <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
              {lastSaved()&&(
                <span style={{fontSize:9,color:"#aaa",fontStyle:"italic"}}>
                  💾 Saved {lastSaved()}
                </span>
              )}
              <label style={{fontSize:10,color:"var(--tan-0)",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                <input type="file" accept=".pdf,.docx,.doc,.txt,.md,.pptx,.csv" multiple style={{display:"none"}} onChange={e=>{handleDocFiles(e.target.files);e.target.value="";}}/>
                + Add Docs
              </label>
              {sellerDocs.length>0&&<span style={{fontSize:10,color:"#aaa"}}>{sellerDocs.length} doc{sellerDocs.length>1?"s":""}</span>}
              <button style={{fontSize:10,color:"var(--red)",fontWeight:600,background:"none",border:"1px solid #9B2C2C44",borderRadius:6,padding:"2px 8px",cursor:"pointer"}}
                onClick={()=>{if(window.confirm("Clear session and start over?")){clearSession();window.location.reload();}}}>
                ✕ New Session
              </button>
            </span>
          </div>
        )}

        {/* ── STEP 0: SESSION SETUP ── */}
        {step===0&&(
          <div style={{padding:"40px 28px"}}>
            <div className="setup-card" style={{maxWidth:580}}>
              <div className="setup-logo" style={{fontSize:26}}>Cambrian <span>Catalyst</span></div>
              <div style={{fontFamily:"Lora,serif",fontSize:13,color:"var(--tan-0)",textAlign:"center",marginBottom:8,fontStyle:"italic",letterSpacing:"0.3px"}}>Revenue Playbook Engine · RIVER Framework</div>
              <div style={{textAlign:"center",marginBottom:10}}>
                <span style={{display:"inline-block",background:"var(--green)",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 12px",borderRadius:20,letterSpacing:"0.4px",textTransform:"uppercase"}}>Private Beta</span>
              </div>
              <div style={{textAlign:"center",marginBottom:24,padding:"0 8px"}}>
                <div style={{fontSize:17,fontWeight:600,color:"var(--ink-0)",lineHeight:1.5,marginBottom:8,fontFamily:"Lora,serif"}}>Be the most informed seller in the room.</div>
                <div style={{fontSize:14,color:"#666",lineHeight:1.7}}>Walk into every call knowing exactly what keeps your prospect up at night — their strategy, gaps, hiring signals, and the precise angle that opens doors. Powered by live research and five proven sales frameworks.</div>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:24,flexWrap:"wrap"}}>
                {[["⚡","Brief in seconds"],["🎯","5 sales frameworks"],["🔍","Live web research"],["📋","RIVER hypothesis"]].map(([icon,label])=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#777"}}>
                    <span style={{fontSize:15}}>{icon}</span><span>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{height:1,background:"var(--line-0)",marginBottom:20}}/>

              {/* Seller URL */}
              <div className="field-row">
                <div className="field-label">Your Organization's Website <span className="req">*</span></div>
                <div className="setup-url-bar">
                  <div className="setup-url-label">Seller URL</div>
                  <input className="setup-url-input" type="text" placeholder="e.g. yourcompany.com"
                    value={sellerInput} onChange={e=>{setSellerInput(e.target.value);setUrlScanStatus("");setUrlScanConfirmed(false);}}
                    onKeyDown={e=>{if(e.key==="Enter"&&sellerInput.trim()&&!sellerDocs.length){setSellerUrl(sellerInput.trim());setStep(1);}}}
                    onBlur={()=>{
                    if(sellerInput.trim()&&!urlScanConfirmed&&urlScanStatus!=="scanning") scanSellerUrl(sellerInput.trim());
                    if(sellerInput.trim()&&!sellerICP&&!icpLoading) buildSellerICP(sellerInput.trim());
                  }}
                />
                </div>

                {/* Seller Stage */}
                <div style={{marginTop:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>Your Funding Stage</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {["Bootstrapped","Series A","Series B","Series C","Series D+","PE-Backed","Public"].map(stage=>(
                      <button key={stage} onClick={()=>setSellerStage(stage)}
                        style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid "+(sellerStage===stage?"var(--ink-0)":"var(--line-0)"),
                          background:sellerStage===stage?"var(--ink-0)":"#fff",color:sellerStage===stage?"#fff":"#555",
                          fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.13s"}}>
                        {stage}
                      </button>
                    ))}
                  </div>
                  {sellerStage&&(
                    <div style={{fontSize:11,color:"var(--tan-0)",marginTop:6}}>
                      {sellerStage==="Series A"&&"💡 Tip: Land in innovation arms or sub-divisions of large enterprises — not enterprise-wide. Channel through partners where possible."}
                      {sellerStage==="Series B"&&"💡 Tip: Departmental landing is your best motion. Find the pain closest to your sweet spot and prove ROI there first."}
                      {(sellerStage==="Series C"||sellerStage==="Series D+")&&"💡 Tip: You have enough logos and proof points for enterprise. Lead with case studies and SLA commitments."}
                      {sellerStage==="PE-Backed"&&"💡 Tip (3,366 PE scenarios): Your stability is your moat vs. VC-backed competitors. If EBITDA mandate: focus on mid-market expansion not SMB new logos. If SMB growth mandate: vertical match is everything — vertical SaaS PE + matched SMB vertical = 95% fit. MSP channel is best PE route to SMB at scale."}
                      {sellerStage==="Public"&&"💡 Tip: Financial transparency is a procurement advantage. Share your public financials proactively."}
                      {sellerStage==="Bootstrapped"&&"💡 Tip: No investor pressure = flexibility on pricing and contract structure. Use this as a feature."}
                    </div>
                  )}
                </div>
                <div style={{fontSize:11,color:"#aaa",marginTop:6}}>Claude will research your products and services to map them to each prospect's needs. Stored for the entire session.</div>
              </div>

              {/* Divider */}
              <div style={{height:1,background:"var(--line-0)",margin:"18px 0 16px"}}/>

              {/* Internal doc upload */}
              <div className="field-row" style={{marginBottom:0}}>
                <div className="field-label" style={{marginBottom:8}}>
                  Internal Sales Materials
                  <span style={{color:"#aaa",fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:11,marginLeft:6}}>(optional — strongly recommended)</span>
                </div>
                <div
                  className={`doc-upload-zone ${docDrag?"drag":""}`}
                  onDragOver={e=>{e.preventDefault();setDocDrag(true);}}
                  onDragLeave={()=>setDocDrag(false)}
                  onDrop={e=>{e.preventDefault();setDocDrag(false);handleDocFiles(e.dataTransfer.files);}}
                  onClick={()=>docRef.current.click()}>
                  <div className="doc-upload-icon">📂</div>
                  <div className="doc-upload-text">
                    <div className="doc-upload-title">Drop files or click to upload</div>
                    <div className="doc-upload-hint">Pitch decks · Product overviews · Case studies · Training docs · Use cases · One-pagers</div>
                    <div className="doc-upload-hint" style={{marginTop:3}}>PDF, DOCX, TXT, MD — up to 6 files</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{flexShrink:0}} onClick={e=>{e.stopPropagation();docRef.current.click();}}>Add Files</button>
                  <input ref={docRef} type="file" accept=".pdf,.docx,.doc,.txt,.md,.pptx,.csv" multiple style={{display:"none"}}
                    onChange={e=>{handleDocFiles(e.target.files);e.target.value="";}}/>
                </div>

                {sellerDocs.length>0&&(
                  <div className="doc-chips" style={{marginTop:10}}>
                    {sellerDocs.map((d,i)=>(
                      <div key={i} className="doc-chip">
                        <span style={{fontSize:11}}>📄</span>
                        <span className="doc-chip-label">{d.label}</span>
                        <span className="doc-chip-name">{d.name}</span>
                        <span className="doc-chip-x" onClick={e=>{e.stopPropagation();setSellerDocs(prev=>prev.filter((_,j)=>j!==i));}} title="Remove">✕</span>
                      </div>
                    ))}
                  </div>
                )}

                {sellerDocs.length>0&&(
                  <div style={{fontSize:11,color:"var(--green)",marginTop:8,display:"flex",alignItems:"center",gap:5}}>
                    <span>✓</span> {sellerDocs.length} document{sellerDocs.length>1?"s":""} loaded — Claude will use {sellerDocs.length>1?"these":"this"} as the primary source for product and solution context.
                  </div>
                )}
              </div>

              {/* Product / Solution URLs — up to 5, auto-scanned */}
              <div className="field-row" style={{marginBottom:0}}>
                <div className="field-label" style={{marginBottom:4}}>
                  Product &amp; Solution URLs
                  <span style={{color:"#aaa",fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:11,marginLeft:6}}>(optional · up to 5)</span>
                </div>

                {/* Scanning state */}
                {urlScanStatus==="scanning"&&(
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"var(--bg-0)",borderRadius:8,marginBottom:10}}>
                    <div className="load-spin" style={{width:14,height:14,borderWidth:2}}/>
                    <span style={{fontSize:13,color:"var(--tan-0)"}}>Scanning {sellerInput} for product pages...</span>
                  </div>
                )}

                {/* Found pages — confirm prompt */}
                {urlScanStatus==="found"&&!urlScanConfirmed&&(
                  <div style={{background:"var(--green-bg)",border:"1.5px solid var(--green)",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--green)",marginBottom:8}}>
                      🔍 Found {productUrls.filter(u=>u.url).length} product page{productUrls.filter(u=>u.url).length!==1?"s":""}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                      {productUrls.filter(u=>u.url).map((u,i)=>(
                        <div key={i} style={{fontSize:12,color:"#333",display:"flex",alignItems:"center",gap:6}}>
                          <span style={{color:"var(--green)",fontSize:14}}>🔗</span>
                          <span style={{fontWeight:600,color:"var(--green)",marginRight:4}}>{u.label||"Page "+(i+1)}</span>
                          <span style={{color:"#777",fontFamily:"monospace",fontSize:11}}>{u.url.replace(/^https?:\/\//,"").slice(0,50)}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--ink-0)",marginBottom:10}}>Are these the right product pages?</div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="btn btn-green btn-sm" onClick={()=>setUrlScanConfirmed(true)}>
                        ✓ Yes, looks right
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={()=>{setProductUrls([{url:"",label:""}]);setUrlScanStatus("");}}>
                        ✕ Clear, I'll add manually
                      </button>
                    </div>
                  </div>
                )}

                {/* Manual URL list — shown when confirmed or manually editing */}
                {(urlScanStatus===""||urlScanStatus==="none"||urlScanConfirmed)&&(
                  <>
                    {urlScanStatus==="none"&&(
                      <div style={{fontSize:12,color:"#aaa",marginBottom:8}}>No product pages found automatically — add them below.</div>
                    )}
                    {urlScanConfirmed&&(
                      <div style={{fontSize:12,color:"var(--green)",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
                        ✓ Product pages confirmed — you can edit or add more below.
                      </div>
                    )}
                    {!urlScanConfirmed&&urlScanStatus===""&&(
                      <div style={{fontSize:11,color:"#aaa",marginBottom:8}}>Add a URL for each product or service line. Claude will reference these for solution mapping.</div>
                    )}
                    {productUrls.map((item,i)=>(
                      <div key={i} style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
                        <div className="setup-url-bar" style={{flex:1,marginBottom:0}}>
                          <div className="setup-url-label" style={{minWidth:60,fontSize:9}}>{item.label||(i===0?"Primary":"Product "+(i+1))}</div>
                          <input
                            className="setup-url-input"
                            type="text"
                            placeholder={i===0?"yourcompany.com/products":"yourcompany.com/service-2"}
                            value={item.url}
                            onChange={e=>setProductUrls(p=>p.map((x,j)=>j===i?{...x,url:e.target.value}:x))}
                            onKeyDown={e=>{if(e.key==="Enter"&&i===productUrls.length-1&&productUrls.length<5)
                              setProductUrls(p=>[...p,{url:"",label:""}]);}}
                          />
                          {item.url&&(
                            <span style={{fontSize:10,color:"var(--tan-0)",cursor:"pointer",flexShrink:0}}
                              onClick={()=>setProductUrls(p=>p.length>1?p.filter((_,j)=>j!==i):[{url:"",label:""}])}>✕</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {productUrls.length<5&&(
                      <button className="btn btn-secondary btn-sm" style={{marginTop:2}}
                        onClick={()=>setProductUrls(p=>[...p,{url:"",label:""}])}>
                        + Add URL
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Divider */}
              <div style={{height:1,background:"var(--line-0)",margin:"20px 0 16px"}}/>

              {/* Product / Solution Catalog */}
              <div className="field-row" style={{marginBottom:0}}>
                <div className="field-label" style={{marginBottom:8}}>
                  Products &amp; Solutions Catalog
                  <span style={{color:"#aaa",fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:11,marginLeft:6}}>(optional — drives curated recommendations)</span>
                </div>
                <div style={{fontSize:11,color:"#777",marginBottom:10,lineHeight:1.5}}>
                  Add your products or services so Claude can recommend the right fit for each prospect based on live research. Upload a product sheet or add them manually.
                </div>

                {/* Upload product doc */}
                <div
                  className={`doc-upload-zone ${prodDocDrag?"drag":""}`}
                  style={{marginBottom:10}}
                  onDragOver={e=>{e.preventDefault();setProdDocDrag(true);}}
                  onDragLeave={()=>setProdDocDrag(false)}
                  onDrop={e=>{e.preventDefault();setProdDocDrag(false);Array.from(e.dataTransfer.files).forEach(parseProductDoc);}}
                  onClick={()=>prodDocRef.current.click()}>
                  <div className="doc-upload-icon">📋</div>
                  <div className="doc-upload-text">
                    <div className="doc-upload-title">Import product sheet</div>
                    <div className="doc-upload-hint">Upload a product overview, solution brief, or pricing sheet — Claude extracts each product automatically</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{flexShrink:0}} onClick={e=>{e.stopPropagation();prodDocRef.current.click();}}>Upload</button>
                  <input ref={prodDocRef} type="file" accept=".pdf,.docx,.doc,.txt,.md,.csv" multiple style={{display:"none"}}
                    onChange={e=>{Array.from(e.target.files).forEach(parseProductDoc);e.target.value="";}}/>
                </div>

                {/* Manual product entries */}
                {products.map((p,i)=>(
                  <div key={p.id} className="prod-entry">
                    <div className="prod-num">{i+1}</div>
                    <div className="prod-fields">
                      <input className="prod-name-input" type="text" placeholder="Product / Solution name..."
                        value={p.name} onChange={e=>updateProduct(p.id,"name",e.target.value)}/>
                      <textarea className="prod-desc-input" placeholder="Brief description, key use cases, differentiators, ideal customer profile..."
                        value={p.description} onChange={e=>updateProduct(p.id,"description",e.target.value)} rows={2}/>
                    </div>
                    <button className="prod-remove" onClick={()=>removeProduct(p.id)} title="Remove">✕</button>
                  </div>
                ))}

                <button className="btn btn-secondary btn-sm" style={{marginTop:6}} onClick={addProduct}>
                  + Add Product / Solution
                </button>

                {products.filter(p=>p.name.trim()).length>0&&(
                  <div style={{fontSize:11,color:"var(--green)",marginTop:8,display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                    <span>✓</span>
                    {products.filter(p=>p.name.trim()).map((p,i)=>(
                      <span key={i} className="prod-chip"><span className="prod-chip-dot"/>{p.name}</span>
                    ))}
                    <span style={{color:"#aaa"}}>— Claude will match these to each prospect</span>
                  </div>
                )}
              </div>

              {/* ICP builds in background — reviewed on next step */}
              {icpLoading&&!sellerICP&&(
                <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#aaa",padding:"8px 0",marginTop:8}}>
                  <div className="load-spin" style={{width:12,height:12,borderWidth:2}}/> Building your ICP in the background...
                </div>
              )}
              {sellerICP&&!icpLoading&&(
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--green)",padding:"6px 0",marginTop:8}}>
                  <span>✓</span> ICP ready — you'll review it on the next step
                </div>
              )}
              {false&&(
                <div style={{marginTop:16}}>
                  <div style={{height:1,background:"var(--line-0)",marginBottom:16}}/>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--ink-0)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:10}}>
                    Your ICP — {sellerICP?.sellerName||sellerInput}
                  </div>
                  {icpLoading&&!sellerICP&&(
                    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#aaa",padding:"8px 0"}}>
                      <div className="load-spin" style={{width:12,height:12,borderWidth:2}}/> Building your ICP...
                    </div>
                  )}
                  {sellerICP?.icp&&(
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {sellerICP.sellerDescription&&(
                        <div style={{fontSize:13,color:"#555",lineHeight:1.6,fontStyle:"italic"}}>"{sellerICP.sellerDescription}"</div>
                      )}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        {sellerICP.icp.industries?.length>0&&(
                          <div style={{background:"var(--bg-0)",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Target Industries</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                              {sellerICP.icp.industries.map((ind,i)=>(
                                <span key={i} style={{fontSize:11,background:"var(--line-0)",borderRadius:10,padding:"2px 8px",color:"#555"}}>{ind}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {sellerICP.icp.buyerPersonas?.length>0&&(
                          <div style={{background:"var(--bg-0)",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Buyer Personas</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                              {sellerICP.icp.buyerPersonas.slice(0,3).map((p,i)=>(
                                <span key={i} style={{fontSize:11,background:"var(--navy-bg)",borderRadius:10,padding:"2px 8px",color:"var(--navy)"}}>{p}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {(sellerICP.icp.companySize||sellerICP.icp.dealSize)&&(
                          <div style={{background:"var(--bg-0)",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"var(--green)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>Sweet Spot</div>
                            {sellerICP.icp.companySize&&<div style={{fontSize:12,color:"#333"}}>{sellerICP.icp.companySize}</div>}
                            {sellerICP.icp.dealSize&&<div style={{fontSize:11,color:"#777",marginTop:2}}>{sellerICP.icp.dealSize}</div>}
                          </div>
                        )}
                        {sellerICP.icp.disqualifiers?.length>0&&(
                          <div style={{background:"var(--red-bg)",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"var(--red)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Not a Fit</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                              {sellerICP.icp.disqualifiers.slice(0,2).map((d,i)=>(
                                <span key={i} style={{fontSize:11,background:"var(--red-bg)",borderRadius:10,padding:"2px 8px",color:"var(--red)"}}>{d}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {sellerICP.icp.painPoints?.length>0&&(
                        <div style={{background:"var(--bg-0)",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--purple)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Top Pains We Solve</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                            {(sellerICP.icp.topPains||sellerICP.icp.painPoints||[]).filter(Boolean).map((p,i)=>(
                              <span key={i} style={{fontSize:11,background:"var(--purple-bg)",border:"1px solid #6B3A7A44",borderRadius:10,padding:"2px 8px",color:"var(--purple)"}}>{p}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {sellerICP.icp.priorityInitiative&&(
                        <div style={{background:"var(--amber-bg)",border:"1px solid #BA751744",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--amber)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>⚡ Trigger to Buy (Revella)</div>
                          <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{sellerICP.icp.priorityInitiative}</div>
                        </div>
                      )}
                      {sellerICP.icp.perceivedBarriers&&(
                        <div style={{background:"var(--red-bg)",border:"1px solid #9B2C2C44",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--red)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>🚧 Perceived Barriers (Revella)</div>
                          <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{sellerICP.icp.perceivedBarriers}</div>
                        </div>
                      )}
                      {sellerICP.icp.adoptionProfile&&(
                        <div style={{background:"var(--navy-bg)",border:"1px solid #1B3A6B44",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>📊 Buyer Adoption Profile</div>
                          <div style={{fontSize:12,color:"#555"}}>{sellerICP.icp.adoptionProfile}</div>
                        </div>
                      )}
                      {sellerICP.icp.uniqueDifferentiators?.filter(Boolean).length>0&&(
                        <div style={{background:"var(--green-bg)",border:"1px solid #2E6B2E44",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--green)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>✦ Why We Win (Dunford)</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                            {sellerICP.icp.uniqueDifferentiators.filter(Boolean).map((d,i)=>(
                              <span key={i} style={{fontSize:11,background:"#fff",border:"1px solid #2E6B2E44",borderRadius:10,padding:"2px 8px",color:"var(--green)"}}>{d}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {sellerICP.icp.customerExamples?.filter(Boolean).length>0&&(
                        <div style={{fontSize:12,color:"#aaa"}}>
                          Known customers: {sellerICP.icp.customerExamples.filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div style={{height:1,background:"var(--line-0)",margin:"20px 0"}}/>
              <button className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center"}}
                onClick={()=>{if(sellerInput.trim()){setSellerUrl(sellerInput.trim());setStep(1);}}}
                disabled={!sellerInput.trim()}>Start Session →</button>
            </div>
          </div>
        )}

        {/* ── STEP 1: ICP REVIEW ── */}
        {step===1&&(
          <div className="page">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:12}}>
              <div>
                <div className="page-title" style={{margin:0}}>
                  {icpTab==="icp"?"Your Ideal Customer Profile":"RFP Intelligence"}
                </div>
                <div className="page-sub" style={{marginBottom:0}}>
                  {icpTab==="icp"
                    ? <>Built from <strong>{sellerUrl}</strong> — review and edit before scoring accounts.</>
                    : <>Live RFP signals matched to your ICP — open opportunities and recent awards.</>}
                </div>
              </div>
              {sellerICP?.icp&&(
                <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                  <button
                    onClick={()=>{if(confirm("Regenerate ICP from scratch? The cached version will be replaced."))buildSellerICP(sellerUrl,{forceRefresh:true});}}
                    title="Force rebuild ICP (clears cache)"
                    style={{padding:"7px 12px",fontSize:12,fontWeight:600,border:"1.5px solid var(--line-0)",borderRadius:8,background:"#fff",color:"#555",cursor:"pointer"}}>
                    ↻ Regenerate
                  </button>
                  <div style={{display:"flex",gap:0,border:"1.5px solid var(--line-0)",borderRadius:8,overflow:"hidden"}}>
                    {[["icp","🎯 Your ICP"],["rfp","📡 RFP Intel"]].map(([tab,label])=>(
                      <button key={tab}
                        onClick={()=>setIcpTab(tab)}
                        style={{padding:"7px 16px",fontSize:12,fontWeight:700,border:"none",
                          background:icpTab===tab?"var(--ink-0)":"#fff",
                          color:icpTab===tab?"#fff":"#555",cursor:"pointer",transition:"all 0.15s",position:"relative"}}>
                        {label}
                        {tab==="rfp"&&rfpData.loading&&(
                          <span style={{marginLeft:6,display:"inline-block",width:6,height:6,borderRadius:"50%",background:"var(--amber)",animation:"blink 1.2s ease-in-out infinite"}}/>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {icpLoading&&!sellerICP&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"60px 0",textAlign:"center"}}>
                <div className="load-spin" style={{width:32,height:32,borderWidth:3}}/>
                <div style={{fontSize:15,color:"#555",fontWeight:500}}>Building your ICP for {sellerUrl}...</div>
                <div style={{fontSize:13,color:"#aaa"}}>Researching positioning, buyer personas, pain points, and channels</div>
              </div>
            )}

            {!sellerICP&&!icpLoading&&(
              <div style={{textAlign:"center",padding:"40px 0",color:"#aaa"}}>
                <div style={{fontSize:32,marginBottom:12}}>🔍</div>
                <div style={{fontSize:14,marginBottom:16}}>ICP not built yet</div>
                <button className="btn btn-primary" onClick={()=>buildSellerICP(sellerUrl)}>Build ICP Now</button>
              </div>
            )}

            {icpTab==="rfp"&&sellerICP?.icp&&(()=>{
              const hasData = rfpData.open.length > 0 || rfpData.closed.length > 0;
              const everything = [...rfpData.open, ...rfpData.closed];
              return (
              <div style={{marginTop:16}}>
                {/* Silent-loading first-state: only show the big spinner if we have
                    nothing to display yet. Once partial data arrives, switch to
                    inline section-level hints. */}
                {rfpData.loading && !hasData && (
                  <div style={{textAlign:"center",padding:"40px 0"}}>
                    <div className="load-spin" style={{width:28,height:28,borderWidth:3,margin:"0 auto 12px"}}/>
                    <div style={{fontSize:14,color:"#555"}}>Scanning RFP sources via live web search...</div>
                    <div style={{fontSize:12,color:"#aaa",marginTop:4}}>Private: Ariba · Coupa · press releases &nbsp;·&nbsp; Gov: SAM.gov · FPDS-NG · TED Europa</div>
                  </div>
                )}
                {rfpData.error && !rfpData.loading && (
                  <div style={{background:"var(--red-bg)",border:"1px solid var(--red)",borderRadius:"var(--r-md)",padding:12,fontSize:13,color:"var(--red)",marginBottom:12}}>
                    {rfpData.error}
                    <button className="btn btn-secondary btn-sm" style={{marginLeft:10}} onClick={()=>fetchRFPIntel({forceRefresh:true})}>↻ Retry</button>
                  </div>
                )}
                {!rfpData.loading && !rfpData.error && !hasData && (
                  <div style={{textAlign:"center",padding:"40px 0",color:"#aaa"}}>
                    <div style={{fontSize:32,marginBottom:8}}>📡</div>
                    <div style={{fontSize:14,marginBottom:12}}>No RFP data loaded yet</div>
                    <button className="btn btn-primary" onClick={()=>fetchRFPIntel({forceRefresh:true})}>Scan RFP Databases →</button>
                  </div>
                )}
                {hasData && (
                  <>
                    {/* Data-integrity disclaimer */}
                    <div style={{background:"var(--amber-bg)",border:"1px solid var(--amber)",borderRadius:"var(--r-md)",padding:"8px 12px",marginBottom:14,fontSize:12,color:"var(--tan-ink)",lineHeight:1.5}}>
                      <strong>Verify before acting.</strong> RFP data is AI-generated from live web search over public sources. Titles, values, and award details can drift from the source. Click through source URLs (when present) to confirm.
                    </div>

                    {/* Filter toggle — counts combined across open + closed */}
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                      <span style={{fontSize:12,fontWeight:700,color:"#555"}}>Show:</span>
                      {(()=>{
                        const privateCount = everything.filter(r=>r.isGovernment===false).length;
                        const govCount     = everything.filter(r=>r.isGovernment===true).length;
                        return [
                          ["all",        `All RFPs (${everything.length})`],
                          ["private",    `🏢 Private / Commercial (${privateCount})`],
                          ["government", `🏛 Government (${govCount})`],
                        ].map(([val,label])=>(
                          <button key={val} onClick={()=>setRfpFilter(val)}
                            style={{padding:"5px 12px",fontSize:11,fontWeight:700,borderRadius:20,border:"1.5px solid",
                              borderColor:rfpFilter===val?"var(--ink-0)":"var(--line-0)",
                              background:rfpFilter===val?"var(--ink-0)":"#fff",
                              color:rfpFilter===val?"#fff":"#555",cursor:"pointer"}}>
                            {label}
                          </button>
                        ));
                      })()}
                      <button className="btn btn-secondary btn-sm" style={{marginLeft:"auto"}} onClick={()=>fetchRFPIntel({forceRefresh:true})}>↻ Refresh</button>
                    </div>

                    {/* Open RFPs */}
                    <div style={{marginBottom:24}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                        <div style={{fontSize:13,fontWeight:700,color:"var(--ink-0)"}}>🟢 Open RFPs — Active Opportunities</div>
                        <div style={{fontSize:11,color:"#aaa"}}>({rfpData.open.filter(r=>rfpFilter==="all"||(rfpFilter==="government"&&r.isGovernment===true)||(rfpFilter==="private"&&r.isGovernment===false)).length} shown)</div>
                        {rfpData.loading && rfpData.open.length===0 && (
                          <span style={{fontSize:11,color:"var(--amber)",fontStyle:"italic"}}>⏳ still loading…</span>
                        )}
                      </div>
                      <div style={{overflowX:"auto",border:"1px solid var(--line-0)",borderRadius:8}}>
                        <table className="tbl">
                          <thead>
                            <tr>
                              <th>RFP Title</th>
                              <th>Buyer</th>
                              <th>Source</th>
                              <th>Value</th>
                              <th>Deadline</th>
                              <th>Cohort</th>
                              <th>Fit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rfpData.open.filter(r=>rfpFilter==="all"||(rfpFilter==="government"&&r.isGovernment===true)||(rfpFilter==="private"&&r.isGovernment===false)).sort((a,b)=>b.relevanceScore-a.relevanceScore).map((r,i)=>(
                              <tr key={i}>
                                <td style={{maxWidth:280}}>
                                  <div style={{fontWeight:600,fontSize:12,color:"var(--ink-0)",marginBottom:2}}>
                                    {r.url ? (
                                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{color:"var(--ink-0)",textDecoration:"none"}}>{r.title} ↗</a>
                                    ) : r.title}
                                  </div>
                                  <div style={{fontSize:11,color:"#aaa"}}>{r.relevanceReason}</div>
                                </td>
                                <td style={{fontSize:12}}>{r.buyer}<br/><span style={{fontSize:10,color:"#aaa"}}>{r.country}</span></td>
                                <td><span style={{fontSize:10,fontWeight:700,borderRadius:6,padding:"2px 6px",
                                  background:r.isGovernment?"var(--navy-bg)":"#F0FDF4",
                                  color:r.isGovernment?"var(--navy)":"#166534"}}>{r.source}</span></td>
                                <td style={{fontSize:12,fontWeight:600,color:"var(--green)",whiteSpace:"nowrap"}}>{r.value}</td>
                                <td style={{fontSize:11,color:"var(--amber)",whiteSpace:"nowrap"}}>{r.deadline}</td>
                                <td style={{fontSize:11}}>{r.cohort}</td>
                                <td>
                                  <div style={{fontSize:12,fontWeight:700,
                                    color:r.relevanceScore>=75?"var(--green)":r.relevanceScore>=50?"var(--amber)":"var(--red)"}}>
                                    {r.relevanceScore}%
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Closed RFPs — render section even while still loading, so a "still loading…" hint shows */}
                    {(rfpData.closed.length>0 || (rfpData.loading && rfpData.open.length>0)) && (
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                          <div style={{fontSize:13,fontWeight:700,color:"var(--ink-0)"}}>🔵 Closed RFPs — Last 18 Months (Incumbent Intel)</div>
                          {rfpData.closed.length>0 && <div style={{fontSize:11,color:"#aaa"}}>({rfpData.closed.length} awards)</div>}
                          {rfpData.loading && rfpData.closed.length===0 && (
                            <span style={{fontSize:11,color:"var(--amber)",fontStyle:"italic"}}>⏳ still loading…</span>
                          )}
                        </div>
                        {rfpData.closed.length===0 && rfpData.loading && (
                          <div style={{background:"var(--bg-1)",border:"1.5px dashed var(--line-2)",borderRadius:"var(--r-md)",padding:20,textAlign:"center",fontSize:12,color:"var(--ink-2)"}}>
                            Fetching historical awards from FPDS-NG, USAspending, and press releases…
                          </div>
                        )}
                        {rfpData.closed.length>0 && (<>
                        <div style={{overflowX:"auto",border:"1px solid var(--line-0)",borderRadius:8}}>
                          <table className="tbl">
                            <thead>
                              <tr>
                                <th>Contract</th>
                                <th>Buyer</th>
                                <th>Awarded To</th>
                                <th>Value</th>
                                <th>Date</th>
                                <th>Cohort</th>
                                <th>Fit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rfpData.closed.filter(r=>rfpFilter==="all"||(rfpFilter==="government"&&r.isGovernment===true)||(rfpFilter==="private"&&r.isGovernment===false)).sort((a,b)=>b.relevanceScore-a.relevanceScore).map((r,i)=>(
                                <tr key={i}>
                                  <td style={{maxWidth:240}}>
                                    <div style={{fontWeight:600,fontSize:12,color:"var(--ink-0)",marginBottom:2}}>
                                      {r.url ? (
                                        <a href={r.url} target="_blank" rel="noopener noreferrer" style={{color:"var(--ink-0)",textDecoration:"none"}}>{r.title} ↗</a>
                                      ) : r.title}
                                    </div>
                                    <div style={{fontSize:11,color:"#aaa"}}>{r.relevanceReason}</div>
                                  </td>
                                  <td style={{fontSize:12}}>{r.buyer}<br/><span style={{fontSize:10,color:"#aaa"}}>{r.country}</span></td>
                                  <td style={{fontSize:12,fontWeight:600,color:r.awardedTo?"var(--tan-0)":"var(--ink-3)",fontStyle:r.awardedTo?"normal":"italic"}}>
                                    {r.awardedTo || "— unverified"}
                                  </td>
                                  <td style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{r.value}</td>
                                  <td style={{fontSize:11,color:"#777",whiteSpace:"nowrap"}}>{r.awardDate}</td>
                                  <td style={{fontSize:11}}>{r.cohort}</td>
                                  <td>
                                    <div style={{fontSize:12,fontWeight:700,
                                      color:r.relevanceScore>=75?"var(--green)":r.relevanceScore>=50?"var(--amber)":"var(--red)"}}>
                                      {r.relevanceScore}%
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div style={{fontSize:11,color:"#aaa",marginTop:8,fontStyle:"italic",lineHeight:1.5}}>
                          💡 Awarded To = your displacement target or channel partner opportunity. "— unverified" means search couldn't confirm the vendor; click the title link and check the source (FPDS-NG / USAspending / TED) directly.
                        </div>
                        </>)}
                      </div>
                    )}
                  </>
                )}
              </div>
              );
            })()}

            {icpTab==="icp"&&sellerICP?.icp&&(
              <div style={{display:"flex",flexDirection:"column",gap:16}}>

                {/* Positioning */}
                <div className="bb">
                  <div className="bb-hdr">
                    <div className="bb-icon">🎯</div>
                    <div><div className="bb-title">Market Positioning</div></div>
                  </div>
                  <div className="bb-body" style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div>
                      <div className="field-label" style={{marginBottom:4}}>Seller Description</div>
                      <EF value={sellerICP.sellerDescription||""} onChange={v=>setSellerICP(p=>({...p,sellerDescription:v}))} placeholder="What this seller does and their core value prop"/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <div>
                        <div className="field-label" style={{marginBottom:4}}>Market Category</div>
                        <EF value={sellerICP.marketCategory||""} onChange={v=>setSellerICP(p=>({...p,marketCategory:v}))} placeholder="e.g. Employee Rewards Platform" single/>
                      </div>
                      <div>
                        <div className="field-label" style={{marginBottom:4}}>Adoption Profile (Moore)</div>
                        <EF value={sellerICP.icp.adoptionProfile||""} onChange={v=>setSellerICP(p=>({...p,icp:{...p.icp,adoptionProfile:v}}))} placeholder="e.g. Early Majority" single/>
                      </div>
                    </div>
                    <div>
                      <div className="field-label" style={{marginBottom:4}}>Why We Win — Unique Differentiators</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
                        {(sellerICP.icp.uniqueDifferentiators||[]).filter(Boolean).map((d,i)=>(
                          <span key={i} style={{background:"var(--green-bg)",border:"1px solid #2E6B2E44",borderRadius:20,padding:"3px 10px",fontSize:12,color:"var(--green)",display:"flex",alignItems:"center",gap:4}}>
                            {d}
                            <button onClick={()=>setSellerICP(p=>({...p,icp:{...p.icp,uniqueDifferentiators:p.icp.uniqueDifferentiators.filter((_,j)=>j!==i)}}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"var(--green)",padding:0}}>✕</button>
                          </span>
                        ))}
                      </div>
                      <div style={{fontSize:11,color:"#aaa"}}>Competitive alternatives: {(sellerICP.icp.competitiveAlternatives||[]).filter(Boolean).join(", ")||"—"}</div>
                    </div>
                  </div>
                </div>

                {/* Target Customer */}
                <div className="bb">
                  <div className="bb-hdr">
                    <div className="bb-icon">🏢</div>
                    <div><div className="bb-title">Target Customer Profile</div></div>
                  </div>
                  <div className="bb-body" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div>
                      <div className="field-label" style={{marginBottom:4}}>Target Industries</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
                        {(sellerICP.icp.industries||[]).map((ind,i)=>(
                          <span key={i} style={{background:"var(--line-0)",borderRadius:20,padding:"3px 10px",fontSize:12,color:"#555",display:"flex",alignItems:"center",gap:4}}>
                            {ind}
                            <button onClick={()=>setSellerICP(p=>({...p,icp:{...p.icp,industries:p.icp.industries.filter((_,j)=>j!==i)}}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#aaa",padding:0}}>✕</button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="field-label" style={{marginBottom:4}}>Company Size Sweet Spot</div>
                      <EF value={sellerICP.icp.companySize||""} onChange={v=>setSellerICP(p=>({...p,icp:{...p.icp,companySize:v}}))} placeholder="e.g. 500–10K employees" single/>
                    </div>
                    <div>
                      <div className="field-label" style={{marginBottom:4}}>Revenue Range</div>
                      <EF value={sellerICP.icp.revenueRange||""} onChange={v=>setSellerICP(p=>({...p,icp:{...p.icp,revenueRange:v}}))} placeholder="e.g. $50M–$2B" single/>
                    </div>
                    <div>
                      <div className="field-label" style={{marginBottom:4}}>Deal Size / ACV</div>
                      <EF value={sellerICP.icp.dealSize||""} onChange={v=>setSellerICP(p=>({...p,icp:{...p.icp,dealSize:v}}))} placeholder="e.g. $25K–$150K" single/>
                    </div>
                    <div>
                      <div className="field-label" style={{marginBottom:4}}>Not a Fit</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {(sellerICP.icp.disqualifiers||[]).filter(Boolean).map((d,i)=>(
                          <span key={i} style={{background:"var(--red-bg)",border:"1px solid #9B2C2C33",borderRadius:20,padding:"3px 10px",fontSize:12,color:"var(--red)"}}>{d}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="field-label" style={{marginBottom:4}}>Sales Cycle</div>
                      <EF value={sellerICP.icp.salesCycle||""} onChange={v=>setSellerICP(p=>({...p,icp:{...p.icp,salesCycle:v}}))} placeholder="e.g. 3–6 months" single/>
                    </div>
                  </div>
                </div>

                {/* Buyer Personas */}
                <div className="bb">
                  <div className="bb-hdr">
                    <div className="bb-icon">👤</div>
                    <div><div className="bb-title">Buyer Personas</div><div className="bb-sub">Economic buyer · Champion · Technical evaluator</div></div>
                  </div>
                  <div className="bb-body" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
                    {(sellerICP.icp.buyerPersonas||[]).filter(Boolean).map((p,i)=>(
                      <div key={i} style={{background:"var(--navy-bg)",border:"1px solid #1B3A6B33",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:20}}>{"💼👷🔧"[i]||"👤"}</span>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:"var(--navy)"}}>{p}</div>
                          <div style={{fontSize:10,color:"#aaa"}}>{["Economic Buyer","Champion / User","Technical Evaluator"][i]||"Stakeholder"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5 Rings of Buying Insight */}
                <div className="bb">
                  <div className="bb-hdr">
                    <div className="bb-icon">💡</div>
                    <div><div className="bb-title">Buying Insight Profile</div><div className="bb-sub">Why they buy, what stops them, how they decide</div></div>
                  </div>
                  <div className="bb-body" style={{display:"flex",flexDirection:"column",gap:12}}>
                    {[
                      {key:"priorityInitiative",label:"⚡ Ring 1 — Priority Initiative",sub:"What triggers them to act NOW",color:"var(--amber)",bg:"var(--amber-bg)"},
                      {key:"successFactors",label:"✓ Ring 2 — Success Factors",sub:"What winning looks like for them",color:"var(--green)",bg:"var(--green-bg)"},
                      {key:"perceivedBarriers",label:"🚧 Ring 3 — Perceived Barriers",sub:"What makes them hesitate or walk away",color:"var(--red)",bg:"var(--red-bg)"},
                      {key:"decisionCriteria",label:"⚖️ Ring 4 — Decision Criteria",sub:"How they evaluate and compare options",color:"var(--navy)",bg:"var(--navy-bg)"},
                      {key:"buyerJourney",label:"🗺 Ring 5 — Buyer Journey",sub:"How they move from awareness to decision",color:"var(--purple)",bg:"var(--purple-bg)"},
                    ].map(({key,label,sub,color,bg})=>(
                      <div key={key} style={{background:bg,border:"1px solid "+color+"33",borderRadius:10,padding:"12px 14px"}}>
                        <div style={{fontSize:11,fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:2}}>{label}</div>
                        <div style={{fontSize:10,color:"#aaa",marginBottom:8}}>{sub}</div>
                        <EF value={sellerICP.icp[key]||""} onChange={v=>setSellerICP(p=>({...p,icp:{...p.icp,[key]:v}}))} placeholder={sub}/>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Jobs + Pains + Gains */}
                <div className="bb">
                  <div className="bb-hdr">
                    <div className="bb-icon">🎯</div>
                    <div><div className="bb-title">Customer Profile</div></div>
                  </div>
                  <div className="bb-body" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div>
                      <div className="field-label" style={{marginBottom:6}}>Top Pains We Solve</div>
                      {(sellerICP.icp.topPains||[]).filter(Boolean).map((p,i)=>(
                        <div key={i} style={{fontSize:12,color:"#555",padding:"4px 0",borderBottom:"1px solid var(--tan-3)"}}>• {p}</div>
                      ))}
                    </div>
                    <div>
                      <div className="field-label" style={{marginBottom:6}}>Top Gains We Create</div>
                      {(sellerICP.icp.topGains||[]).filter(Boolean).map((g,i)=>(
                        <div key={i} style={{fontSize:12,color:"#555",padding:"4px 0",borderBottom:"1px solid var(--tan-3)"}}>• {g}</div>
                      ))}
                    </div>
                    <div style={{gridColumn:"1/-1"}}>
                      <div className="field-label" style={{marginBottom:6}}>Customer Jobs-to-be-Done</div>
                      {(sellerICP.icp.customerJobs||[]).filter(Boolean).map((j,i)=>(
                        <div key={i} style={{fontSize:12,color:"#555",padding:"4px 0",borderBottom:"1px solid var(--tan-3)"}}>
                          <span style={{fontSize:10,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",marginRight:6}}>{["Functional","Emotional","Social"][i]||""}</span>{j}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Channels + Customer Examples */}
                <div className="bb">
                  <div className="bb-hdr">
                    <div className="bb-icon">📡</div>
                    <div><div className="bb-title">Go-to-Market Channels</div></div>
                  </div>
                  <div className="bb-body">
                    <div style={{marginBottom:10}}>
                      <div className="field-label" style={{marginBottom:6}}>Best Channels to Reach This Buyer</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {(sellerICP.icp.tractionChannels||[]).filter(Boolean).map((c,i)=>(
                          <span key={i} style={{background:"var(--bg-0)",border:"1px solid var(--line-0)",borderRadius:20,padding:"3px 10px",fontSize:12,color:"#555"}}>{c}</span>
                        ))}
                      </div>
                    </div>
                    {(sellerICP.icp.customerExamples||[]).filter(Boolean).length>0&&(
                      <div>
                        <div className="field-label" style={{marginBottom:4}}>Known Customers</div>
                        <div style={{fontSize:12,color:"#777"}}>{(sellerICP.icp.customerExamples||[]).filter(Boolean).join(" · ")}</div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}



            {icpTab==="icp"&&(
            <div style={{display:"flex",justifyContent:"space-between",marginTop:16,paddingTop:16,borderTop:"1px solid var(--line-0)"}}>
              <button className="btn btn-secondary" onClick={()=>setStep(0)}>← Back</button>
              <button className="btn btn-primary btn-lg"
                onClick={()=>setStep(2)}
                disabled={!sellerICP&&!icpLoading}>
                {icpLoading&&!sellerICP?"Building ICP...":"Continue to Import →"}
              </button>
            </div>
            )}
            {icpTab==="rfp"&&(
            <div style={{display:"flex",justifyContent:"space-between",marginTop:16,paddingTop:16,borderTop:"1px solid var(--line-0)"}}>
              <button className="btn btn-secondary" onClick={()=>setIcpTab("icp")}>← Back to ICP</button>
              <button className="btn btn-primary btn-lg" onClick={()=>setStep(2)}>
                Continue to Import →
              </button>
            </div>
            )}
          </div>
        )}

        {/* ── STEP 2: IMPORT ── */}
        {step===2&&(
          <div className="page">
            <div className="page-title">Add Your Accounts</div>
            <div className="page-sub">Upload a CRM export, or type in companies directly — great for conferences, warm intros, or quick meeting prep.</div>

            {/* Mode switcher */}
            <div style={{display:"flex",gap:0,marginBottom:24,background:"var(--tan-3)",borderRadius:10,padding:3,width:"fit-content"}}>
              {[["csv","📂  Upload CSV"],["quick","⚡  Quick Entry"]].map(([mode,label])=>(
                <button key={mode} onClick={()=>setImportMode(mode)}
                  style={{padding:"8px 20px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                    background:importMode===mode?"#fff":"transparent",
                    color:importMode===mode?"var(--ink-0)":"#999",
                    boxShadow:importMode===mode?"0 1px 3px rgba(0,0,0,0.1)":"none",
                    transition:"all 0.15s"}}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── CSV Upload Mode ── */}
            {importMode==="csv"&&(
              <>
                <div className={`upload-zone ${drag?"drag":""}`}
                  onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={handleDrop}
                  onClick={()=>fileRef.current.click()}>
                  <div className="upload-label">{fileName||"Drop your CSV file here"}</div>
                  <div className="upload-hint">{rows.length>0?`${rows.length} records loaded`:"Salesforce · HubSpot · Custom CRM"}</div>
                  <button className="btn btn-secondary" onClick={e=>{e.stopPropagation();fileRef.current.click();}}>Browse File</button>
                  <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>onFile(e.target.files[0])}/>
                </div>
                <div style={{textAlign:"center",margin:"12px 0",color:"#ccc",fontSize:13}}>— or —</div>
                <div style={{textAlign:"center",marginBottom:22}}>
                  <button className="btn btn-secondary" onClick={()=>{
                    const hdrs=Object.keys(SAMPLE_ROWS[0]);
                    setHeaders(hdrs);setRows(SAMPLE_ROWS);setFileName(`sample_${SAMPLE_ROWS.length}_accounts.csv`);
                    const m={};hdrs.forEach(h=>m[h]=h);setMapping(m);
                    // Auto-advance after a tick so state settles
                    setTimeout(()=>{
                      const b=buildCohorts(SAMPLE_ROWS,Object.fromEntries(Object.keys(SAMPLE_ROWS[0]).map(h=>[h,h])));
                      if(b.length){
                        setCohorts(b);
                        const sel=b.find(c=>c.members.length>1)||b[0];
                        setSelectedCohort(sel);
                        const allSampleMembers = b.flatMap(c=>c.members);
                        scoreFit(allSampleMembers, sellerUrl);
                        setStep(3);
                      }
                    },50);
                  }}>Load Sample Data — {SAMPLE_ROWS.length} accounts</button>
                </div>
              </>
            )}

            {/* ── Quick Entry Mode ── */}
            {importMode==="quick"&&(
              <div>
                <div style={{background:"var(--bg-0)",border:"1px solid var(--line-0)",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{fontSize:18,flexShrink:0}}>💡</div>
                  <div style={{fontSize:13,color:"#555",lineHeight:1.6}}>
                    <strong>Website URLs give the best results.</strong> Paste any of: company website, LinkedIn company page, or just type the company name.
                    Name-only entries use training knowledge — great for well-known companies.
                  </div>
                </div>

                {quickEntries.map((entry,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"var(--ink-0)",color:"var(--tan-0)",fontFamily:"Lora,serif",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {i+1}
                    </div>
                    <input type="text" value={entry.name} placeholder="Company name"
                      style={{flex:"0 0 200px",fontSize:14}}
                      onChange={e=>setQuickEntries(prev=>prev.map((x,j)=>j===i?{...x,name:e.target.value}:x))}
                      onKeyDown={e=>{if(e.key==="Enter"&&i===quickEntries.length-1)setQuickEntries(p=>[...p,{name:"",url:""}]);}}
                    />
                    <input type="text" value={entry.url} placeholder="website.com or linkedin.com/company/..."
                      style={{flex:1,fontSize:14,color:"#555"}}
                      onChange={e=>setQuickEntries(prev=>prev.map((x,j)=>j===i?{...x,url:e.target.value}:x))}
                      onKeyDown={e=>{if(e.key==="Enter"&&i===quickEntries.length-1)setQuickEntries(p=>[...p,{name:"",url:""}]);}}
                    />
                    {quickEntries.length>1&&(
                      <button onClick={()=>setQuickEntries(p=>p.filter((_,j)=>j!==i))}
                        style={{background:"none",border:"none",color:"#ccc",cursor:"pointer",fontSize:18,padding:"0 4px",flexShrink:0}}>×</button>
                    )}
                  </div>
                ))}

                <div style={{display:"flex",gap:10,marginTop:4}}>
                  <button className="btn btn-secondary btn-sm"
                    onClick={()=>setQuickEntries(p=>[...p,{name:"",url:""}])}>
                    + Add Company
                  </button>
                  <button className="btn btn-secondary btn-sm"
                    onClick={()=>setQuickEntries([{name:"",url:""}])}>
                    Clear All
                  </button>
                </div>

                <div className="actions-row" style={{marginTop:24}}>
                  <button className="btn btn-primary btn-lg"
                    onClick={goToQuickBrief}
                    disabled={!quickEntries.some(e=>e.name.trim())}>
                    Research {quickEntries.filter(e=>e.name.trim()).length||""} {quickEntries.filter(e=>e.name.trim()).length===1?"Company":"Companies"} →
                  </button>
                </div>
              </div>
            )}
            {rows.length>0&&(
              <>
                <div className="card">
                  <div className="card-title">Map Your Fields</div>
                  <div className="field-grid-2">
                    {[{key:"company",label:"Company / Account",req:true},{key:"industry",label:"Industry / Vertical",req:true},{key:"lead_source",label:"Lead Source",req:true},{key:"company_url",label:"Company Website URL"},{key:"employees",label:"Employee Count"},{key:"public_private",label:"Public / Private"},{key:"geography",label:"Domestic / International"},{key:"close_date",label:"Close Date"},{key:"product",label:"Product / Solution"},{key:"outcome",label:"Customer Outcome"},].map(f=>(
                      <div className="field-row" key={f.key}>
                        <div className="field-label">{f.label} {f.req&&<span className="req">*</span>}</div>
                        <select value={mapping[f.key]} onChange={e=>setMapping(m=>({...m,[f.key]:e.target.value}))}>
                          <option value="">— not mapped —</option>
                          {headers.map(h=><option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">Preview</div>
                  <div className="tbl-wrap">
                    <table className="tbl">
                      <thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead>
                      <tbody>{rows.slice(0,4).map((r,i)=><tr key={i}>{headers.map(h=><td key={h}>{r[h]}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                </div>
                <div className="actions-row">
                  <button className="btn btn-primary btn-lg" onClick={goToCohorts}>Perform Account Analysis →</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 2: TARGET ACCOUNT REVIEW ── */}
        {step===3&&(
          <div className="page">
            <div className="page-title">Target Account Review</div>
            <div className="page-sub">All {rows.length} accounts ranked by fit. Click any account to start research — or scroll down for cohort analysis.</div>

            {/* ── ALL ACCOUNTS TABLE with Fit Check ── */}
            <div className="card" style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div>
                  <div className="card-title" style={{margin:0}}>All Accounts</div>
                  <div style={{fontSize:12,color:"#aaa",marginTop:2}}>Click to select · up to 5 accounts · numbered in priority order</div>
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  {fitScoring&&<div style={{fontSize:12,color:"var(--tan-0)"}}>⏳ Evaluating fit...</div>}
                  {Object.keys(fitScores).length>0&&!fitScoring&&<div style={{fontSize:12,color:"var(--green)"}}>✓ Fit scores ready</div>}
                  {accountQueue.length>0&&(
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={()=>setAccountQueue([])}>Clear</button>
                      <button className="btn btn-primary"
                        onClick={()=>{
                          if(accountQueue.length===1){
                            setSelectedCohort(accountQueue[0]._cohort);
                            setSelectedAccount(accountQueue[0]);
                            setSelectedOutcomes([]);
                            setStep(4);
                          } else {
                            setQueueIdx(0);
                            setSelectedCohort(accountQueue[0]._cohort);
                            setSelectedAccount(accountQueue[0]);
                            setSelectedOutcomes([]);
                            setStep(4);
                          }
                        }}>
                        Continue with {accountQueue.length} account{accountQueue.length>1?"s":""} →
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="tbl-wrap" style={{maxHeight:"480px",overflowY:"scroll",border:"1px solid var(--tan-3)",borderRadius:8}}>
                <table className="tbl" style={{fontSize:13}}>
                  <thead style={{position:"sticky",top:0,zIndex:10,background:"#fff"}}>
                    <tr>
                      <th>Company</th>
                      <th>Industry</th>
                      <th>Org Size</th>
                      <th>Ownership</th>
                      <th>Fit Check</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...cohorts.flatMap(c=>c.members.map(m=>({...m,_cohort:c})))].sort((a,b)=>{
                      const sa=fitScores[a.company]?.score??50;
                      const sb=fitScores[b.company]?.score??50;
                      return sb-sa;
                    }).map((m,i)=>{
                      const inQueue=accountQueue.some(q=>q.company===m.company);
                      const qPos=accountQueue.findIndex(q=>q.company===m.company);
                      return(
                        <tr key={i} style={{cursor:"pointer",background:inQueue?"var(--bg-1)":"",transition:"background 0.1s"}}
                          onClick={()=>setAccountQueue(prev=>{
                            if(prev.some(q=>q.company===m.company)) return prev.filter(q=>q.company!==m.company);
                            if(prev.length>=5) return prev;
                            return [...prev,{...m}];
                          })}>
                          <td style={{fontWeight:600,color:"var(--ink-0)"}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{width:20,height:20,borderRadius:4,border:"2px solid "+(inQueue?"var(--ink-0)":"#ddd"),background:inQueue?"var(--ink-0)":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,color:"var(--tan-0)",fontWeight:700}}>
                                {inQueue?qPos+1:""}
                              </div>
                              <div>
                                <div>{m.company}</div>
                                {m.company_url&&<div style={{fontSize:11,color:"#aaa",fontWeight:400}}>🌐 {m.company_url}</div>}
                              </div>
                            </div>
                          </td>
                          <td style={{color:"#555"}}>{m.ind||"—"}</td>
                          <td style={{color:"#555",fontSize:12}}>{m.employees||"—"}</td>
                          <td style={{fontSize:12}} onClick={e=>e.stopPropagation()}>
                            {(()=>{
                              const pp=fitScores[m.company]?.ownership||m.publicPrivate||"";
                              if(!pp) return <span style={{color:"#aaa"}}>—</span>;
                              const low=pp.toLowerCase();
                              const c=low.includes("public")?"var(--navy)":low.includes("pe-backed")||low.includes("pe backed")?"#6B3A3A":low.includes("vc")||low.includes("backed")?"var(--green)":low.includes("private")?"#555":"#555";
                              const bg=low.includes("public")?"var(--navy-bg)":low.includes("pe-backed")||low.includes("pe backed")?"var(--red-bg)":low.includes("vc")||low.includes("backed")?"var(--green-bg)":"var(--bg-0)";
                              return<span style={{background:bg,color:c,border:"1px solid "+c+"44",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{pp}</span>;
                            })()}
                          </td>
                          <td onClick={e=>e.stopPropagation()}>
                            {fitScores[m.company]?(
                              <div style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,background:fitScores[m.company].bg,color:fitScores[m.company].color,border:"1px solid "+fitScores[m.company].color+"44",display:"inline-block",whiteSpace:"nowrap"}}
                                title={fitScores[m.company].reason}>
                                {fitScores[m.company].score}% · {fitScores[m.company].label}
                              </div>
                            ):fitScoring?<span style={{fontSize:11,color:"#aaa"}}>scoring…</span>:<button className="btn btn-secondary btn-sm" onClick={e=>{e.stopPropagation();const allM=cohorts.flatMap(c=>c.members);const sCtx=sellerDocs.length>0?sellerDocs.map(d=>d.label+": "+d.content.slice(0,400)).join(" | "):sellerUrl;scoreFit(allM,sCtx);}}>Run fit check</button>}
                          </td>
                          <td onClick={e=>e.stopPropagation()}>
                            <button className="btn btn-primary btn-sm"
                              onClick={e=>{e.stopPropagation();setSelectedCohort(m._cohort);setSelectedAccount(m);setSelectedOutcomes([]);setStep(4);}}>
                              Review →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scroll cue */}
            <div style={{textAlign:"center",padding:"10px 0 20px",color:"#aaa",fontSize:13}}>
              ↓ Cohort analysis below
            </div>

            {/* Summary stats */}
            <div className="summary-grid">
              <div className="stat-card"><div className="stat-num">{rows.length}</div><div className="stat-label">Accounts</div></div>
              <div className="stat-card"><div className="stat-num">{cohorts.length}</div><div className="stat-label">Cohorts</div></div>
              <div className="stat-card"><div className="stat-num">{Object.keys(fitScores).length}</div><div className="stat-label">Scored</div></div>
            </div>

            {/* Overall pie charts */}
            <div className="cohort-chart-wrap">
              <div className="pie-card">
                <div className="pie-title">Accounts by Vertical</div>
                <div className="pie-wrap">
                  <PieChart size={100} data={cohorts.map(c=>({label:c.name,value:c.size,color:c.color}))}/>
                  <div className="pie-legend">
                    {cohorts.map((c,i)=>(
                      <div key={i} className="pie-legend-item">
                        <div className="pie-legend-dot" style={{background:c.color}}/>
                        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:110}}>{c.name}</span>
                        <span className="pie-legend-val">{c.size+" accts"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pie-card">
                <div className="pie-title">Accounts by Cohort</div>
                <div className="pie-wrap">
                  <PieChart size={100} data={cohorts.map(c=>({label:c.name,value:c.size,color:c.color}))}/>
                  <div className="pie-legend">
                    {cohorts.map((c,i)=>(
                      <div key={i} className="pie-legend-item">
                        <div className="pie-legend-dot" style={{background:c.color}}/>
                        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:110}}>{c.name}</span>
                        <span className="pie-legend-val">{c.size} · {c.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Drill-down cohort cards */}
            {cohorts.map(c=>(
              <CohortDrillDown
                key={c.id}
                cohort={c}
                selected={selectedCohort?.id===c.id}
                onSelect={()=>setSelectedCohort(c)}
                onPickAccount={m=>{setSelectedCohort(c);pickAccount(m);}}
                fitScores={fitScores}
                fitScoring={fitScoring}
              />
            ))}

            <div className="actions-row">
              <button className="btn btn-secondary" onClick={()=>setStep(2)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={()=>{if(selectedCohort){setSelectedOutcomes([]);setSelectedAccount(null);setStep(4);}}} disabled={!selectedCohort}>
                Select Account → {selectedCohort?`(${selectedCohort.name})`:""}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: ACCOUNT REVIEW — vertical stack, full-width ── */}
        {step===4&&selectedCohort&&(()=>{
          const accounts = (accountQueue.length>0 ? accountQueue : selectedCohort.members)
            .slice()
            .sort((a,b)=>(fitScores[b.company]?.score??50)-(fitScores[a.company]?.score??50));
          const sa = selectedAccount;
          const fs = sa ? fitScores[sa.company] : null;
          return (
          <div className="page" style={{maxWidth:960}}>
            {/* Title + prev/next */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,flexWrap:"wrap"}}>
              <div className="page-title" style={{margin:0,fontSize:24}}>
                {accountQueue.length>1 ? `Account ${queueIdx+1} of ${accountQueue.length}` : "Account Review"}
              </div>
              {accountQueue.length>1 && (
                <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
                  <button className="btn btn-secondary btn-sm" disabled={queueIdx===0}
                    onClick={()=>{setQueueIdx(i=>i-1);setSelectedAccount(accountQueue[queueIdx-1]);setSelectedOutcomes([]);}}>
                    ← Prev
                  </button>
                  <button className="btn btn-secondary btn-sm" disabled={queueIdx===accountQueue.length-1}
                    onClick={()=>{setQueueIdx(i=>i+1);setSelectedAccount(accountQueue[queueIdx+1]);setSelectedOutcomes([]);}}>
                    Next →
                  </button>
                </div>
              )}
            </div>
            <div className="page-sub" style={{marginBottom:14}}>
              {accountQueue.length>1 ? `${accountQueue.length} selected accounts · pick one to set up the brief.` : `${selectedCohort.name} · ${accounts.length} account${accounts.length===1?"":"s"}`}
            </div>

            {/* Account selector strip */}
            <div className="account-strip">
              {accounts.map((m,i)=>{
                const isSel = sa?.company===m.company;
                const sc = fitScores[m.company];
                return (
                  <button key={i} className={`account-chip ${isSel?"active":""}`}
                    onClick={()=>{setSelectedAccount(m);setSelectedOutcomes([]);}}>
                    <span className="account-chip-num">{i+1}</span>
                    <span>{m.company}</span>
                    {sc && (
                      <span style={{fontSize:11,fontWeight:700,padding:"1px 8px",borderRadius:"var(--r-pill)",
                        background:sc.bg,color:sc.color,border:"1px solid "+sc.color+"44"}}>
                        {sc.score}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {!sa && (
              <div style={{background:"var(--bg-1)",border:"1.5px dashed var(--line-2)",borderRadius:"var(--r-md)",padding:"28px 24px",textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:10}}>👆</div>
                <div style={{fontSize:14,fontWeight:600,color:"var(--ink-1)",marginBottom:4}}>Select an account to continue</div>
                <div style={{fontSize:12,color:"var(--ink-3)"}}>Choose from the strip above to set outcomes and build your brief.</div>
              </div>
            )}

            {sa && (<>
              {/* ── Account hero ── */}
              <div className="account-hero">
                <div className="account-hero-av">{sa.company.slice(0,2).toUpperCase()}</div>
                <div className="account-hero-body">
                  <div className="account-hero-name">{sa.company}</div>
                  <div className="account-hero-meta">
                    {sa.ind}
                    {sa.src && <> · {sa.src}</>}
                    {sa.company_url && <> · 🌐 {sa.company_url}</>}
                  </div>
                </div>
                {fs && (
                  <div style={{fontSize:13,fontWeight:700,padding:"5px 12px",borderRadius:"var(--r-pill)",
                    background:fs.bg,color:fs.color,border:"1px solid "+fs.color+"44",whiteSpace:"nowrap"}}>
                    {fs.score}% · {fs.label}
                  </div>
                )}
              </div>
              {fs?.reason && (
                <div className="card" style={{padding:"12px 16px",marginBottom:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--ink-2)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>Fit rationale</div>
                  <div style={{fontSize:13,color:"var(--ink-1)",lineHeight:1.55}}>{fs.reason}</div>
                </div>
              )}

              {/* ── ICP Match — horizontal grid ── */}
              {sellerICP?.icp && (
                <div className="card" style={{padding:"14px 16px",marginBottom:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:10}}>
                    ICP Match — {sellerICP.sellerName||sellerUrl}
                  </div>
                  <div className="icp-match-grid">
                    {sellerICP.icp.industries?.length>0 && (
                      <div>
                        <div className="icp-match-col-label" style={{color:"var(--ink-2)"}}>Target Industries</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                          {sellerICP.icp.industries.map((ind,i)=>{
                            const acctInd=(sa.ind||"").toLowerCase();
                            const match=acctInd&&(ind.toLowerCase().includes(acctInd.split(" ")[0])||acctInd.includes(ind.toLowerCase().split(" ")[0]));
                            return (
                              <span key={i} style={{fontSize:11,borderRadius:"var(--r-pill)",padding:"2px 9px",
                                background:match?"var(--green)":"var(--bg-2)",
                                color:match?"var(--surface)":"var(--ink-2)",fontWeight:match?700:500}}>
                                {match?"✓ ":""}{ind}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {sellerICP.icp.buyerPersonas?.filter(Boolean).length>0 && (
                      <div>
                        <div className="icp-match-col-label" style={{color:"var(--ink-2)"}}>Key Buyers</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                          {sellerICP.icp.buyerPersonas.filter(Boolean).map((p,i)=>(
                            <span key={i} style={{fontSize:11,background:"var(--navy-bg)",border:"1px solid "+"rgba(27,58,107,0.2)",borderRadius:"var(--r-pill)",padding:"2px 9px",color:"var(--navy)",fontWeight:500}}>{p}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {sellerICP.icp.priorityInitiative && (
                      <div>
                        <div className="icp-match-col-label" style={{color:"var(--amber)"}}>⚡ Trigger to Buy</div>
                        <div style={{fontSize:12,color:"var(--ink-1)",lineHeight:1.5}}>{sellerICP.icp.priorityInitiative}</div>
                      </div>
                    )}
                    {sellerICP.icp.perceivedBarriers && (
                      <div>
                        <div className="icp-match-col-label" style={{color:"var(--red)"}}>🚧 Watch For</div>
                        <div style={{fontSize:12,color:"var(--ink-1)",lineHeight:1.5}}>{sellerICP.icp.perceivedBarriers}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Deal + Outcomes — side by side ── */}
              <div className="card" style={{padding:"16px 18px"}}>
                <div className="deal-outcome-grid">
                  {/* Deal context column */}
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:"var(--ink-2)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:10}}>Deal Context</div>
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:700,color:"var(--ink-1)",marginBottom:4}}>Estimated Deal Value</div>
                      <select value={dealValue} onChange={e=>setDealValue(e.target.value)} style={{fontSize:13}}>
                        <option value="">— Select deal size —</option>
                        <option>Less than $5,000</option>
                        <option>$5,000 – $15,000</option>
                        <option>$15,000 – $50,000</option>
                        <option>$50,000 – $100,000</option>
                        <option>$100,000 – $250,000</option>
                        <option>$250,000 – $500,000</option>
                        <option>$500,000 – $1,000,000</option>
                        <option>$1,000,000+</option>
                      </select>
                    </div>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:"var(--ink-1)",marginBottom:4}}>Revenue Classification</div>
                      <select value={dealClassification} onChange={e=>setDealClassification(e.target.value)} style={{fontSize:13}}>
                        <option value="">— Select classification —</option>
                        <option>Top-Line Revenue (TCV)</option>
                        <option>Contribution Margin</option>
                        <option>Gross Profit</option>
                        <option>Net New ARR</option>
                        <option>Expansion Revenue</option>
                        <option>Professional Services</option>
                      </select>
                    </div>
                  </div>

                  {/* Outcomes column */}
                  <div>
                    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--ink-0)",textTransform:"uppercase",letterSpacing:"0.4px"}}>
                        Target Outcomes
                      </div>
                      <div style={{fontSize:10,color:"var(--ink-3)"}}>pick up to 3 · {selectedOutcomes.length}/3</div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:5,marginBottom:8}}>
                      {OUTCOMES.map(o=>{
                        const sel=selectedOutcomes.includes(o.title);
                        const disabled=!sel&&selectedOutcomes.length>=3;
                        return (
                          <div key={o.id}
                            onClick={()=>{if(disabled)return;setSelectedOutcomes(p=>p.includes(o.title)?p.filter(x=>x!==o.title):[...p,o.title]);}}
                            style={{display:"flex",alignItems:"center",gap:6,padding:"6px 9px",borderRadius:"var(--r-sm)",
                              border:"1.5px solid "+(sel?"var(--ink-0)":"var(--line-0)"),
                              background:sel?"var(--ink-0)":"var(--surface)",
                              cursor:disabled?"not-allowed":"pointer",
                              opacity:disabled?0.4:1,
                              transition:"all var(--t-fast) var(--ease)"}}>
                            <span style={{fontSize:13,flexShrink:0}}>{o.icon}</span>
                            <div style={{flex:1,fontSize:11,fontWeight:600,color:sel?"var(--surface)":"var(--ink-0)"}}>{o.title}</div>
                            {sel&&<div style={{fontSize:11,color:"var(--tan-0)"}}>✓</div>}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <input type="text" placeholder="Custom outcome…" value={customOutcome||""}
                        style={{flex:1,fontSize:12,padding:"6px 10px"}}
                        onChange={e=>setCustomOutcome&&setCustomOutcome(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){setSelectedOutcomes(p=>[...p,e.target.value.trim()]);e.target.value="";}}}
                      />
                      <button className="btn btn-secondary btn-sm"
                        onClick={()=>{const v=document.querySelector("input[placeholder=\"Custom outcome…\"]")?.value?.trim();if(v){setSelectedOutcomes(p=>[...p,v]);}}}>
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Build Brief CTA — full-width below grid */}
                <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid var(--line-1)"}}>
                  <button className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center"}}
                    disabled={selectedOutcomes.length===0}
                    onClick={()=>pickAccount(sa)}>
                    Build Brief → {selectedOutcomes.length>0 ? `(${selectedOutcomes.length} outcome${selectedOutcomes.length>1?"s":""})` : ""}
                  </button>
                  {selectedOutcomes.length===0 && (
                    <div style={{fontSize:11,color:"var(--ink-3)",textAlign:"center",marginTop:6}}>Select at least one outcome to continue</div>
                  )}
                </div>
              </div>
            </>)}
          </div>
          );
        })()}

        {/* ── STEP 4: RIVER BRIEF ── */}
        {step===5&&(
          <div className="page">
            <div className="page-title">RIVER Brief{selectedAccount?` — ${selectedAccount.company}`:""}</div>
            <div className="page-sub">
              {briefLoading?"Hang tight — live research in progress.":"All fields are editable — click any text to refine before your call."}
            </div>

            {/* Loading — research progress */}
            {briefLoading&&<BriefLoader company={selectedAccount?.company} status={briefStatus}/>}

            {/* Brief content — renders as soon as brief is set (not null) */}
            {brief&&(
              <>
                {briefError&&(
                  <div style={{background:"var(--red-bg)",border:"1.5px solid var(--red)",borderRadius:10,padding:"14px 16px",marginBottom:16}}>
                    <div style={{fontSize:12,fontWeight:700,color:"var(--red)",marginBottom:8}}>⚠ Research Error — Action Required</div>
                    <div style={{fontSize:11,color:"#7A2020",fontFamily:"monospace",background:"rgba(0,0,0,0.05)",padding:"8px 10px",borderRadius:6,marginBottom:10,wordBreak:"break-word",lineHeight:1.5}}>{briefError}</div>
                    <div style={{fontSize:10,color:"#7A2020",lineHeight:2}}>
                      <strong>Fix:</strong> Vercel → Project → Settings → Environment Variables<br/>
                      Add <code style={{background:"#f5c6c6",padding:"1px 6px",borderRadius:3}}>ANTHROPIC_API_KEY</code> = sk-ant-... key (no VITE_ prefix) → <strong>Redeploy</strong><br/>
                      Check browser DevTools (F12) Console for detailed error.<br/>
                      <em style={{color:"#aaa"}}>Brief below uses Claude training knowledge only — no live research.</em>
                    </div>
                  </div>
                )}
                {/* Action bar */}
                <div className="card">
                  <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:200}}>
                      <div className="field-label" style={{marginBottom:5}}>Primary Contact Role <span style={{color:"#aaa",fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:11,marginLeft:6}}>(optional)</span></div>
                      <input type="text" placeholder="e.g. VP Total Rewards, Head of People Ops..." value={contactRole} onChange={e=>setContactRole(e.target.value)}/>
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:20,flexWrap:"wrap"}}>
                      <button className="btn btn-navy" onClick={doExport}>🖨 Save as PDF</button>
                      <button className="btn btn-secondary" onClick={()=>pickAccount(selectedAccount)}>↻ Regenerate</button>
                      <button className="btn btn-green btn-lg" onClick={()=>{if(!riverHypo&&!riverHypoLoading&&brief)buildRiverHypo(brief,selectedAccount);setStep(6);}}>Review Hypothesis →</button>
                    </div>
                  </div>
                </div>

                {/* Company Snapshot */}
                <div className="bb">
                  <div className="bb-hdr">
                    <div className="bb-icon">◎</div>
                    <div><div className="bb-title">Company Overview</div><div className="bb-sub">Click any field to edit</div></div>
                  </div>
                  <div className="bb-body">
                    <EF value={brief.companySnapshot||""} onChange={v=>patchBrief(b=>{b.companySnapshot=v;})}/>

                    {/* Key facts 2x2 grid */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
                      <div>
                        <div className="field-label" style={{marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                          <span style={{background:"var(--green)",color:"#fff",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>REVENUE</span>Annual Revenue / ARR
                        </div>
                        <EF value={brief.revenue||""} onChange={v=>patchBrief(b=>{b.revenue=v;})} single placeholder="e.g. $18.8B annual revenue (FY2025)"/>
                      </div>
                      <div>
                        <div className="field-label" style={{marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                          <span style={{background:"var(--navy)",color:"#fff",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>OWNERSHIP</span>Public / Private
                        </div>
                        <EF value={brief.publicPrivate||""} onChange={v=>patchBrief(b=>{b.publicPrivate=v;})} single placeholder="e.g. Public (NYSE: ARMK)"/>
                      </div>
                      <div>
                        <div className="field-label" style={{marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                          <span style={{background:"var(--tan-0)",color:"#fff",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>EMPLOYEES</span>Employee Count
                        </div>
                        <EF value={brief.employeeCount||""} onChange={v=>patchBrief(b=>{b.employeeCount=v;})} single placeholder="e.g. ~270,000 globally"/>
                      </div>
                      <div>
                        <div className="field-label" style={{marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                          <span style={{background:"var(--purple)",color:"#fff",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>HQ</span>HQ · Founded
                        </div>
                        <EF value={(brief.headquarters||(brief.founded?" · Founded "+brief.founded:""))||""} onChange={v=>patchBrief(b=>{b.headquarters=v;})} single placeholder="e.g. Philadelphia, PA · Founded 1959"/>
                      </div>
                    </div>

                    {/* Website + LinkedIn */}
                    {(brief.website||brief.linkedIn)&&(
                      <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
                        {brief.website&&(
                          <a href={"https://"+brief.website.replace(/^https?:\/\//,"")} target="_blank" rel="noopener noreferrer"
                            style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--navy)",textDecoration:"none",background:"var(--navy-bg)",border:"1px solid #1B3A6B44",borderRadius:16,padding:"4px 12px",fontWeight:600}}>
                            🌐 {brief.website.replace(/^https?:\/\//,"")}
                          </a>
                        )}
                        {brief.linkedIn&&(
                          <a href={"https://"+brief.linkedIn.replace(/^https?:\/\//,"")} target="_blank" rel="noopener noreferrer"
                            style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#0a66c2",textDecoration:"none",background:"#e8f3fc",border:"1px solid #0a66c244",borderRadius:16,padding:"4px 12px",fontWeight:600}}>
                            in {brief.linkedIn.replace(/^https?:\/\//,"").replace(/^linkedin\.com\/company\//,"")}
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Funding Profile */}
                  {brief.fundingProfile&&(
                    <div style={{marginTop:10,padding:"12px 14px",background:"var(--bg-0)",border:"1px solid var(--line-0)",borderRadius:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                        <div className="field-label" style={{margin:0}}>Funding & Ownership</div>
                        {(()=>{
                          const fp=(brief.fundingProfile||"").toLowerCase();
                          const isPE=fp.includes("pe-backed")||fp.includes("private equity")||fp.includes("portfolio company")||fp.includes("acquired by");
                          const isSeries=fp.match(/series [a-e]/i);
                          const isPublic=fp.includes("nyse:")||fp.includes("nasdaq:")||fp.includes("public (");
                          const label=isPE?"🏦 PE-Backed":isSeries?"🚀 VC-Backed ("+isSeries[0]+")":isPublic?"📈 Public Company":null;
                          const lColor=isPE?"var(--red)":isSeries?"var(--green)":isPublic?"var(--navy)":"";
                          const lBg=isPE?"var(--red-bg)":isSeries?"var(--green-bg)":isPublic?"var(--navy-bg)":"";
                          const recent=fp.includes("2024")||fp.includes("2025")||fp.includes("2026")||fp.includes("recently");
                          return(<span style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                            {label&&<span style={{background:lBg,color:lColor,border:"1px solid "+lColor+"44",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{label}</span>}
                            {recent&&isSeries&&<span style={{background:"var(--green)",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>⚡ 18-mo buy window</span>}
                            {isPE&&<span style={{background:"var(--amber)",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>60-90 day budget cycle</span>}
                          </span>);
                        })()}
                      </div>
                      <EF value={brief.fundingProfile||""} onChange={v=>patchBrief(b=>{b.fundingProfile=v;})} placeholder="Ownership structure, funding history..."/>
                    </div>
                  )}
                </div>

                {/* Key Executives */}
                {(brief.keyExecutives||[]).filter(e=>e?.name).length>0&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:10}}>👤</div>
                      <div><div className="bb-title">Key Executives</div><div className="bb-sub">Executive Perspectives — click to edit</div></div>
                    </div>
                    <div className="bb-body" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                      {(brief.keyExecutives||[]).filter(e=>e?.name).map((ex,i)=>(
                        <div key={i} className="contact-row" style={{margin:0}}>
                          <div className="contact-av" style={{background:"#2C4A7A",color:"#fff",fontFamily:"Lora,serif",fontWeight:700,fontSize:11}}>{ex.initials||ex.name?.split(" ").map(w=>w[0]).join("").slice(0,2)||"?"}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:15,fontWeight:700,color:"var(--ink-0)"}}>{ex.name}</div>
                            <div style={{fontSize:13,color:"#777",marginBottom:4}}>{ex.title}</div>
                            {ex.background&&<div style={{fontSize:13,color:"#555",marginBottom:8,fontStyle:"italic"}}>{ex.background}</div>}
                            <div style={{fontSize:11,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>Executive Perspective</div>
                            <EF
                              value={(ex.angle||"").replace(/^Executive Perspective:\s*/i,"").replace(/^Executive Perspective\s*[-—:]\s*/i,"")}
                              onChange={v=>patchBrief(b=>{if(!b.keyExecutives)b.keyExecutives=[];b.keyExecutives[i]={...b.keyExecutives[i],angle:v};})}
                              placeholder="What personally drives them..."/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Headlines */}
                {(brief.recentHeadlines||[]).filter(h=>h?.headline||typeof h==="string").length>0&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:10}}>📰</div>
                      <div><div className="bb-title">Recent Headlines</div><div className="bb-sub">Notable news from 2024–2025</div></div>
                    </div>
                    <div className="bb-body" style={{display:"flex",flexDirection:"column",gap:8}}>
                      {(brief.recentHeadlines||[]).filter(h=>{
                        const txt=(typeof h==="string"?h:(h?.headline||"")).toLowerCase();
                        const isErr=["unable to retrieve","web search","domain-specific","cannot filter","search failed","not available"].some(p=>txt.includes(p));
                        return !isErr&&(h?.headline||typeof h==="string");
                      }).map((h,i)=>{
                        const headline = typeof h==="string"?h:(h.headline||"");
                        const relevance = typeof h==="object"?h.relevance:"";
                        return(
                          <div key={i} style={{padding:"8px 10px",background:"#FAFAF8",border:"1px solid var(--line-0)",borderRadius:7}}>
                            <div style={{display:"flex",gap:7,alignItems:"flex-start"}}>
                              <div style={{width:5,height:5,borderRadius:"50%",background:"var(--navy)",flexShrink:0,marginTop:5}}/>
                              <div style={{flex:1}}>
                                <div style={{fontSize:14,fontWeight:600,color:"var(--ink-0)",marginBottom:relevance?4:0}}>{headline}</div>
                                {relevance&&<div style={{fontSize:12,color:"var(--tan-0)",fontStyle:"italic",marginTop:2}}>{relevance}</div>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Open Positions */}
                {brief.openRoles&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:10}}>💼</div>
                      <div><div className="bb-title">Open Positions at {selectedAccount?.company||"Target"}</div><div className="bb-sub">Hiring signals reveal strategic priorities — interpret the pattern</div></div>
                    </div>
                    <div className="bb-body">
                      {brief.openRoles.summary&&(
                        <div style={{background:"var(--bg-1)",borderLeft:"4px solid var(--tan-0)",borderRadius:"0 10px 10px 0",padding:"14px 16px",marginBottom:14}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:6}}>
                            <div style={{fontSize:11,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.5px"}}>Strategic Interpretation</div>
                            {(()=>{
                              const txt=(brief.openRoles.summary+" "+(brief.openRoles.roles||[]).map(r=>r.title+" "+r.signal).join(" ")).toLowerCase();
                              const sig=txt.includes("digital transform")||txt.includes("innovation")||txt.includes("r&d")||txt.includes("emerging")?"🔵 Early Adopter":
                                txt.includes("process")||txt.includes("efficiency")||txt.includes("optimization")||txt.includes("cost reduction")?"⚪ Late Majority":
                                txt.includes("growth")||txt.includes("scale")||txt.includes("platform")||txt.includes("moderniz")?"🟢 Early Majority":null;
                              return sig?(
                                <div style={{display:"flex",alignItems:"center",gap:4,background:"var(--navy-bg)",border:"1px solid #1B3A6B33",borderRadius:20,padding:"2px 10px"}}>
                                  <span style={{fontSize:9,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:"0.3px"}}>LinkedIn Graph</span>
                                  <span style={{fontSize:11,fontWeight:700,color:"var(--navy)"}}>{sig}</span>
                                </div>
                              ):null;
                            })()}
                          </div>
                          <EF value={brief.openRoles.summary||""} onChange={v=>patchBrief(b=>{if(!b.openRoles)b.openRoles={};b.openRoles.summary=v;})}/>
                        </div>
                      )}
                      {(brief.openRoles.roles||[]).filter(r=>r?.title).length>0&&(
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {(brief.openRoles.roles||[]).filter(r=>r?.title).map((role,i)=>(
                            <div key={i} style={{padding:"12px 14px",background:"#fff",border:"1px solid var(--line-0)",borderRadius:10,marginBottom:2}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:role.signal?6:0}}>
                                <div style={{background:"var(--tan-3)",color:"var(--tan-ink)",borderRadius:5,padding:"3px 9px",fontSize:10,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,border:"1px solid #D4C4A8"}}>{role.dept||"Open"}</div>
                                <div style={{fontSize:14,fontWeight:700,color:"var(--ink-0)"}}>{role.title}</div>
                              </div>
                              {role.signal&&<div style={{fontSize:13,color:"#5A4A35",lineHeight:1.6,fontStyle:"italic",paddingLeft:2}}>→ {role.signal}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                      {(!brief.openRoles.roles||!brief.openRoles.roles.filter(r=>r?.title).length)&&(
                        <div style={{fontSize:12,color:"#aaa",fontStyle:"italic"}}>No open roles found — click to regenerate or edit manually.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Public Sentiment */}
                {brief.publicSentiment&&(brief.publicSentiment.onlineSentiment||brief.publicSentiment.standoutReview?.text||brief.publicSentiment.glassdoorRating)&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:11}}>💬</div>
                      <div><div className="bb-title">Market Sentiment</div><div className="bb-sub">Glassdoor · G2 · press · employee & customer voice</div></div>
                    </div>
                    <div className="bb-body">
                      {/* Score chips row */}
                      {(()=>{
                        const ps=brief.publicSentiment;
                        const scores=[
                          {label:"Glassdoor",val:ps.glassdoorRating,max:"/ 5.0",link:"glassdoor.com"},
                          {label:"G2",val:ps.g2Rating,max:"/ 5.0",link:"g2.com"},
                          {label:"Trustpilot",val:ps.trustpilotRating,max:"/ 5.0",link:"trustpilot.com"},
                          {label:"Employee Score",val:ps.employeeScore,max:"",link:""},
                        ].filter(s=>s.val&&s.val.trim());
                        return scores.length>0?(
                          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
                            {scores.map((s,i)=>{
                              const n=parseFloat(s.val);
                              const c=isNaN(n)?"var(--tan-0)":n>=4?"var(--green)":n>=3?"var(--amber)":"var(--red)";
                              const bg=isNaN(n)?"var(--bg-0)":n>=4?"var(--green-bg)":n>=3?"var(--amber-bg)":"var(--red-bg)";
                              return(
                                <div key={i} style={{background:bg,border:"1px solid "+c+"44",borderRadius:10,padding:"10px 14px",textAlign:"center",minWidth:80}}>
                                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:c,marginBottom:4}}>{s.label}</div>
                                  <div style={{fontFamily:"Lora,serif",fontSize:22,fontWeight:700,color:c,lineHeight:1}}>{s.val}</div>
                                  {s.max&&<div style={{fontSize:9,color:"#aaa",marginTop:3}}>{s.max}</div>}
                                </div>
                              );
                            })}
                          </div>
                        ):null;
                      })()}

                      {/* NPS / CSAT signal */}
                      {brief.publicSentiment.npsSignal&&(
                        <div style={{background:"var(--navy-bg)",border:"1px solid #1B3A6B33",borderRadius:8,padding:"10px 14px",marginBottom:12}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>📊 NPS / Customer Loyalty Signal</div>
                          <div style={{fontSize:13,color:"#333",lineHeight:1.6}}>{brief.publicSentiment.npsSignal}</div>
                        </div>
                      )}

                      {/* Online sentiment + Glassdoor legacy side by side */}
                      <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap",alignItems:"flex-start"}}>
                        {!brief.publicSentiment.glassdoorRating&&false&&(
                          <div style={{flex:1,minWidth:180}}>
                            <div className="field-label" style={{marginBottom:5}}>Online Sentiment</div>
                            <EF value={brief.publicSentiment.onlineSentiment||""} onChange={v=>patchBrief(b=>{if(!b.publicSentiment)b.publicSentiment={};b.publicSentiment.onlineSentiment=v;})} placeholder="What customers, employees, and communities are saying..."/>
                          </div>
                        )}
                      </div>
                      {/* Standout review */}
                      {brief.publicSentiment.standoutReview?.text&&(
                        <div style={{marginBottom:10}}>
                          {(()=>{const s=brief.publicSentiment.standoutReview;
                            const isPos=s.sentiment==="positive";
                            const borderColor=isPos?"var(--green)":"var(--red)";
                            return(
                            <div style={{background:"var(--bg-1)",borderLeft:"3px solid "+borderColor,borderRadius:"0 8px 8px 0",padding:"10px 13px"}}>
                              {s.source&&<div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:5,color:borderColor}}>
                                {isPos?"✓":""} {s.source}
                              </div>}
                              <div style={{fontSize:13,color:"#333",lineHeight:1.6,fontStyle:"italic"}}>"{s.text}"</div>
                            </div>
                          )})()}
                        </div>
                      )}
                      {/* Sales angle */}
                      {(brief.publicSentiment.salesAngle||brief.publicSentiment.sentimentSummary)&&(
                        <div style={{background:"var(--bg-0)",borderLeft:"3px solid var(--tan-0)",padding:"9px 12px",borderRadius:"0 7px 7px 0"}}>
                          <div className="field-label" style={{marginBottom:4}}>How to Use This</div>
                          <EF value={brief.publicSentiment.salesAngle||brief.publicSentiment.sentimentSummary||""} onChange={v=>patchBrief(b=>{if(!b.publicSentiment)b.publicSentiment={};b.publicSentiment.salesAngle=v;})} single placeholder="How to reference this in your conversation..."/>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Leadership Team — separate block */}
                {(brief.leadershipTeam||[]).filter(l=>l?.name).length>0&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon">👤</div>
                      <div><div className="bb-title">Leadership Team</div><div className="bb-sub">Real names from research — click angles to edit</div></div>
                    </div>
                    <div className="bb-body" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                      {(brief.leadershipTeam||[]).filter(l=>l?.name).map((l,i)=>(
                        <div key={i} className="contact-row" style={{margin:0}}>
                          <div className="contact-av" style={{background:"#2C4A7A",color:"#fff",fontSize:11,fontWeight:700}}>{l.initials||"?"}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:12,fontWeight:600,color:"var(--ink-0)"}}>{l.name}</div>
                            <div style={{fontSize:10,color:"#777",marginBottom:3}}>{l.title}</div>
                            {l.background&&<div style={{fontSize:10,color:"#aaa",fontStyle:"italic",marginBottom:3,lineHeight:1.4}}>{l.background}</div>}
                            <EF value={l.angle||""} onChange={v=>patchBrief(b=>{if(!b.leadershipTeam)b.leadershipTeam=[];b.leadershipTeam[i]={...b.leadershipTeam[i],angle:v};})} single placeholder="Engagement angle..."/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solution Mapping */}
                <div className="bb">
                  <div className="bb-hdr">
                    <div className="bb-icon">↑</div>
                    <div>
                      <div className="bb-title">Solution Mapping</div>
                      <div className="bb-sub">{brief.sellerSnapshot||`Your products mapped to ${selectedAccount?.company}`}</div>
                    </div>
                  </div>
                  <div className="bb-body">
                    {(brief.solutionMapping||[]).filter(item=>item?.product).map((item,i)=>(
                      <div key={i} style={{marginBottom:16,paddingBottom:16,borderBottom:i<((brief.solutionMapping||[]).filter(x=>x?.product).length-1)?"1px solid var(--tan-3)":"none"}}>
                        {/* Product header + imperative badge */}
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                          <div style={{background:"var(--tan-3)",color:"var(--tan-ink)",border:"1px solid #D4C4A8",fontFamily:"Lora,serif",fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:6,whiteSpace:"nowrap"}}>
                            {item.product}
                          </div>
                          {item.imperativeServed&&(
                            <div style={{fontSize:11,fontWeight:700,background:"var(--green-bg)",color:"var(--green)",border:"1px solid #2E6B2E44",borderRadius:20,padding:"2px 10px"}}>
                              {item.imperativeServed}
                            </div>
                          )}
                          {item.buyerRole&&(
                            <div style={{fontSize:11,fontWeight:600,background:"var(--navy-bg)",color:"var(--navy)",border:"1px solid #1B3A6B33",borderRadius:20,padding:"2px 10px"}}>
                              👤 {item.buyerRole}
                            </div>
                          )}
                        </div>
                        {/* Fit summary */}
                        <EF value={item.fit||""} onChange={v=>patchBrief(b=>{b.solutionMapping[i]={...b.solutionMapping[i],fit:v};})} placeholder="Why this fits..."/>
                        {/* Jobs, Pain, Gain grid */}
                        {(item.jobToBeDone||item.painRelieved||item.gainCreated)&&(
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:10}}>
                            {item.jobToBeDone&&(
                              <div style={{background:"var(--bg-0)",borderRadius:8,padding:"8px 10px"}}>
                                <div style={{fontSize:9,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>Job-to-be-Done</div>
                                <div style={{fontSize:12,color:"#333",lineHeight:1.5}}>{item.jobToBeDone}</div>
                              </div>
                            )}
                            {item.painRelieved&&(
                              <div style={{background:"#FDE8E844",borderRadius:8,padding:"8px 10px",border:"1px solid #9B2C2C22"}}>
                                <div style={{fontSize:9,fontWeight:700,color:"var(--red)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>Pain Relieved</div>
                                <div style={{fontSize:12,color:"#333",lineHeight:1.5}}>{item.painRelieved}</div>
                              </div>
                            )}
                            {item.gainCreated&&(
                              <div style={{background:"var(--green-bg)",borderRadius:8,padding:"8px 10px",border:"1px solid #2E6B2E22"}}>
                                <div style={{fontSize:9,fontWeight:700,color:"var(--green)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>Gain Created</div>
                                <div style={{fontSize:12,color:"#333",lineHeight:1.5}}>{item.gainCreated}</div>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Challenger insight */}
                        {item.challengerInsight&&(
                          <div style={{marginTop:8,background:"var(--ink-0)",borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"flex-start",gap:8}}>
                            <span style={{fontSize:11,color:"var(--tan-0)",fontWeight:700,flexShrink:0,marginTop:1}}>⚡</span>
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:2}}>Challenger Insight</div>
                              <div style={{fontSize:12,color:"#fff",lineHeight:1.5,fontStyle:"italic"}}>{item.challengerInsight}</div>
                            </div>
                          </div>
                        )}
                        {/* JOLT risk remover */}
                        {item.joltRiskRemover&&(
                          <div style={{marginTop:6,background:"var(--green-bg)",borderRadius:8,padding:"7px 10px",display:"flex",alignItems:"flex-start",gap:6}}>
                            <span style={{fontSize:11,flexShrink:0}}>🛡</span>
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"var(--green)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:2}}>Risk Remover (JOLT)</div>
                              <div style={{fontSize:12,color:"var(--green)",lineHeight:1.5}}>{item.joltRiskRemover}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Mobilizer Intelligence */}
                    {brief.mobilizer?.description&&(
                      <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid var(--line-0)"}}>
                        <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"var(--navy)",marginBottom:10}}>🎯 Mobilizer Intelligence (Challenger Customer)</div>
                        <div style={{background:"var(--navy-bg)",border:"1px solid #1B3A6B33",borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                          <div style={{fontSize:9,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>Who Moves Deals — Not Talkers or Blockers</div>
                          <div style={{fontSize:13,color:"#333",lineHeight:1.6,marginBottom:8}}>{brief.mobilizer.description}</div>
                          {brief.mobilizer.identifyingBehavior&&(
                            <div style={{marginBottom:8}}>
                              <div style={{fontSize:9,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>How to Spot Them in a Meeting</div>
                              <div style={{fontSize:12,color:"#555",lineHeight:1.5,fontStyle:"italic"}}>{brief.mobilizer.identifyingBehavior}</div>
                            </div>
                          )}
                          {brief.mobilizer.teachingAngle&&(
                            <div style={{background:"var(--ink-0)",borderRadius:7,padding:"8px 12px"}}>
                              <div style={{fontSize:9,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>⚡ Challenger Teaching Angle</div>
                              <div style={{fontSize:12,color:"#fff",lineHeight:1.5,fontStyle:"italic"}}>{brief.mobilizer.teachingAngle}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Relevant Case Studies */}
                    {(brief.caseStudies||[]).filter(c=>c?.title).length>0&&(
                      <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid var(--line-0)"}}>
                        <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"var(--tan-0)",marginBottom:10}}>Relevant Case Studies & Customers</div>
                        {(brief.caseStudies||[]).filter(c=>c?.title).map((cs,i)=>(
                          <div key={i} style={{display:"flex",gap:10,marginBottom:10,padding:"9px 12px",background:"var(--bg-1)",borderRadius:8,border:"1px solid var(--line-0)"}}>
                            <div style={{fontSize:18,lineHeight:1,flexShrink:0}}>📄</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:14,fontWeight:600,color:"var(--ink-0)",marginBottom:2}}>{cs.title}</div>
                              {cs.customer&&<div style={{fontSize:12,color:"var(--tan-0)",fontWeight:600,marginBottom:3}}>{cs.customer}</div>}
                              {cs.result&&(
                                <div style={{fontSize:12,fontWeight:700,color:"var(--green)",background:"var(--green-bg)",borderRadius:10,padding:"2px 8px",display:"inline-block",marginBottom:4}}>
                                  📊 {cs.result}
                                </div>
                              )}
                              <div style={{fontSize:13,color:"#555",lineHeight:1.5}}>{cs.relevance}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tech Stack & Integrations */}
                {brief.techStack&&Object.values(brief.techStack).some(v=>v&&v.toString().trim())&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:13}}>🔌</div>
                      <div><div className="bb-title">Tech Stack & Integrations</div><div className="bb-sub">Known SaaS platforms, tools, and systems in use</div></div>
                    </div>
                    <div className="bb-body">
                      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
                        {[
                          {key:"crm",label:"CRM"},
                          {key:"erp",label:"ERP"},
                          {key:"hris",label:"HRIS"},
                          {key:"marketing",label:"Marketing"},
                          {key:"payments",label:"Payments"},
                          {key:"ecommerce",label:"eCommerce"},
                          {key:"analytics",label:"Analytics"},
                          {key:"infrastructure",label:"Infra"},
                        ].filter(({key})=>brief.techStack[key]?.trim()).map(({key,label})=>(
                          <div key={key} style={{display:"flex",alignItems:"center",gap:6,background:"var(--tan-3)",border:"1px solid #D4C4A8",borderRadius:20,padding:"4px 12px"}}>
                            <span style={{fontSize:10,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.3px"}}>{label}</span>
                            <span style={{fontSize:13,fontWeight:600,color:"var(--ink-0)"}}>{brief.techStack[key]}</span>
                          </div>
                        ))}
                        {(brief.techStack.other||[]).filter(Boolean).map((t,i)=>(
                          <div key={i} style={{display:"flex",alignItems:"center",gap:6,background:"var(--bg-0)",border:"1px solid var(--line-0)",borderRadius:20,padding:"4px 12px"}}>
                            <span style={{fontSize:13,color:"#555"}}>{t}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{fontSize:11,color:"#aaa",marginTop:4}}>Used for solution mapping and integration complexity assessment</div>
                    </div>
                  </div>
                )}

                {/* Workforce & Culture Intelligence */}
                {(brief.workforceProfile?.knowledgeWorkerPct||brief.cultureProfile?.coreValues||brief.incumbentVendors?.hrSystem)&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:12}}>🏛</div>
                      <div><div className="bb-title">Culture, Workforce & Incumbents</div><div className="bb-sub">How they operate · who they are · what you're up against</div></div>
                    </div>
                    <div className="bb-body">
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        {/* Workforce */}
                        {(brief.workforceProfile?.knowledgeWorkerPct||brief.workforceProfile?.remotePolicy)&&(
                          <div style={{background:"var(--bg-0)",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>👥 Workforce</div>
                            {brief.workforceProfile.knowledgeWorkerPct&&<div style={{fontSize:12,color:"#333",marginBottom:3}}>Knowledge workers: <strong>{brief.workforceProfile.knowledgeWorkerPct}</strong></div>}
                            {brief.workforceProfile.unionizedPct&&<div style={{fontSize:12,color:"#333",marginBottom:3}}>Unionized: <strong style={{color:brief.workforceProfile.unionizedPct.includes("high")||parseFloat(brief.workforceProfile.unionizedPct)>30?"var(--red)":"#333"}}>{brief.workforceProfile.unionizedPct}</strong></div>}
                            {brief.workforceProfile.remotePolicy&&<div style={{fontSize:12,color:"#555"}}>{brief.workforceProfile.remotePolicy}</div>}
                            {brief.workforceProfile.avgTenure&&<div style={{fontSize:11,color:"#aaa",marginTop:3}}>Avg tenure: {brief.workforceProfile.avgTenure}</div>}
                          </div>
                        )}
                        {/* Culture */}
                        {brief.cultureProfile?.coreValues&&(
                          <div style={{background:"var(--bg-0)",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"var(--purple)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>🎭 Culture</div>
                            {brief.cultureProfile.coreValues&&<div style={{fontSize:12,color:"#333",marginBottom:4}}><strong>Values:</strong> {brief.cultureProfile.coreValues}</div>}
                            {brief.cultureProfile.communicationStyle&&<div style={{fontSize:12,color:"#555",marginBottom:2}}><strong>Style:</strong> {brief.cultureProfile.communicationStyle}</div>}
                            {brief.cultureProfile.sellerLanguageHint&&(
                              <div style={{marginTop:6,padding:"5px 8px",background:"var(--purple-bg)",borderRadius:6,fontSize:11,color:"var(--purple)",fontStyle:"italic"}}>
                                💬 {brief.cultureProfile.sellerLanguageHint}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Incumbents */}
                        {(brief.incumbentVendors?.hrSystem||brief.incumbentVendors?.financeSystem||brief.incumbentVendors?.crmSystem)&&(
                          <div style={{background:"#FDE8E833",border:"1px solid #9B2C2C33",borderRadius:8,padding:"10px 12px",gridColumn:"1/-1"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"var(--red)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>⚔️ Incumbent Vendors — Know What You're Displacing</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                              {[
                                {label:"HR/HCM",val:brief.incumbentVendors.hrSystem},
                                {label:"Finance/ERP",val:brief.incumbentVendors.financeSystem},
                                {label:"CRM",val:brief.incumbentVendors.crmSystem},
                                {label:"Cards",val:brief.incumbentVendors.cardProvider},
                              ].filter(x=>x.val).map((x,i)=>(
                                <div key={i} style={{display:"flex",alignItems:"center",gap:5,background:"#fff",border:"1px solid #9B2C2C33",borderRadius:20,padding:"3px 10px"}}>
                                  <span style={{fontSize:10,fontWeight:700,color:"var(--red)",textTransform:"uppercase"}}>{x.label}</span>
                                  <span style={{fontSize:12,fontWeight:700,color:"var(--ink-0)"}}>{x.val}</span>
                                </div>
                              ))}
                            </div>
                            <div style={{fontSize:11,color:"#777",marginTop:6,fontStyle:"italic"}}>Are you displacing or landing adjacent? "Adjacent" is almost always the right first motion.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Opening Angle */}
                <div className="bb">
                  <div className="bb-hdr"><div className="bb-icon">?</div><div><div className="bb-title">Opening Angle</div></div></div>
                  <div className="bb-body">
                    <div className="talk-box">
                      <div className="talk-lbl">Recommended Opening</div>
                      <EF value={brief.openingAngle||""} onChange={v=>patchBrief(b=>{b.openingAngle=v;})}/>
                    </div>
                  </div>
                </div>

                {/* DMAIC Process Maturity */}
                {brief.processMaturity?.dmiacStage&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:14}}>⚙️</div>
                      <div><div className="bb-title">Process Maturity</div><div className="bb-sub">DMAIC stage — where are they in their improvement cycle?</div></div>
                    </div>
                    <div className="bb-body">
                      <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
                        {(()=>{
                          const stages=["Define","Measure","Analyze","Improve","Control"];
                          const colors=["#9B2C2C","#BA7517","#1B3A6B","#2E6B2E","#6B3A7A"];
                          const activeIdx=stages.indexOf(brief.processMaturity.dmiacStage);
                          return stages.map((stage,i)=>(
                            <div key={stage} style={{display:"flex",alignItems:"center",gap:4}}>
                              {i>0&&<div style={{width:14,height:2,background:i<=activeIdx?colors[i]+"66":"var(--line-0)",borderRadius:1}}/>}
                              <div style={{padding:"4px 11px",borderRadius:20,fontSize:12,fontWeight:700,
                                background:i===activeIdx?colors[i]:i<activeIdx?colors[i]+"22":"var(--tan-3)",
                                color:i===activeIdx?"#fff":i<activeIdx?colors[i]:"#bbb",
                                border:"1.5px solid "+(i<=activeIdx?colors[i]:"var(--line-0)")}}>
                                {stage}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                      <EF value={brief.processMaturity.maturityNote||""} onChange={v=>patchBrief(b=>{if(!b.processMaturity)b.processMaturity={};b.processMaturity.maturityNote=v;})}/>
                      {(brief.processMaturity.processGaps||[]).filter(Boolean).length>0&&(
                        <div style={{marginTop:12}}>
                          <div style={{fontSize:11,fontWeight:700,color:"var(--amber)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Process Gaps</div>
                          {brief.processMaturity.processGaps.filter(Boolean).map((g,i)=>(
                            <div key={i} style={{display:"flex",gap:7,marginBottom:5}}>
                              <div style={{width:5,height:5,borderRadius:"50%",background:"var(--amber)",flexShrink:0,marginTop:6}}/>
                              <div style={{fontSize:13,color:"#555",lineHeight:1.5}}>{g}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contacts + Watch-outs */}
                <div className="field-grid-2" style={{gap:12,marginBottom:14}}>
                  <div className="bb" style={{margin:0}}>
                    <div className="bb-hdr">
                      <div><div className="bb-title" style={{fontSize:14}}>In-Roads</div>
                      <div className="bb-sub">Mid-level champions who feel the pain daily</div></div>
                    </div>
                    <div className="bb-body">
                      {(brief.keyContacts||[]).filter(c=>c?.name||c?.title).map((c,i)=>(
                        <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<((brief.keyContacts||[]).filter(x=>x?.name||x?.title).length-1)?"1px solid var(--tan-3)":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                            <div style={{width:30,height:30,borderRadius:"50%",background:"var(--green)",color:"#fff",fontFamily:"Lora,serif",fontWeight:700,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              {c.initials||"?"}
                            </div>
                            <div>
                              <div style={{fontSize:14,fontWeight:700,color:"var(--ink-0)"}}>{c.name||"Unknown"}</div>
                              <div style={{fontSize:12,color:"var(--green)",fontWeight:600}}>{c.title||""}</div>
                            </div>
                          </div>
                          <EF value={c.angle||""} onChange={v=>patchBrief(b=>{b.keyContacts[i]={...b.keyContacts[i],angle:v};})} placeholder="Why they feel this pain and how to reach them..."/>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bb" style={{margin:0}}>
                    <div className="bb-hdr"><div className="bb-title" style={{fontSize:12}}>Watch-Outs</div></div>
                    <div className="bb-body">
                      {(brief.watchOuts||[]).filter(Boolean).map((w,i)=>(
                        <div key={i} className="signal-row" style={{marginBottom:8}}>
                          <div className="sig-dot" style={{background:"var(--red)"}}/>
                          <div style={{flex:1}}>
                            <EF value={w||""} onChange={v=>patchBrief(b=>{b.watchOuts[i]=v;})} single/>
                          </div>
                        </div>
                      ))}
                      {(brief.competitors||[]).filter(Boolean).length>0&&(
                        <>
                          <div className="field-label" style={{marginTop:12,marginBottom:7}}>Likely Competitors</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                            {brief.competitors.filter(Boolean).map((c,i)=><span key={i} className="tag tag-ind">{c}</span>)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="actions-row">
                  <button className="btn btn-secondary" onClick={()=>setStep(4)}>← Accounts</button>
                  <button className="btn btn-secondary" onClick={()=>pickAccount(selectedAccount)}>↻ Regenerate</button>
                  <button className="btn btn-navy" onClick={doExport}>🖨 Save as PDF</button>
                  <button className="btn btn-green btn-lg" onClick={()=>{if(!riverHypo&&!riverHypoLoading&&brief)buildRiverHypo(brief,selectedAccount);setStep(6);}}>Review Hypothesis →</button>
                </div>
              </>
            )}

            {!briefLoading&&!brief&&(
              <div style={{textAlign:"center",padding:"48px 20px",color:"#bbb"}}>
                <div style={{fontSize:13,marginBottom:14}}>Select an account to generate a RIVER brief.</div>
                <button className="btn btn-secondary btn-sm" onClick={()=>setStep(4)}>← Select Account</button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 5: RIVER HYPOTHESIS ── */}
        {step===6&&(
          <ErrorBoundary><div className="page">
            <div className="page-title">RIVER Hypothesis — {selectedAccount?.company||"Account"}</div>
            <div className="page-sub">
              {riverHypoLoading
                ? "Building your hypothesis — usually ready before you finish reading the brief..."
                : riverHypo
                  ? "Your pre-call hypothesis is ready. Edit any field before going live."
                  : "Generate your RIVER hypothesis below."}
            </div>

            {/* Recommended Solutions — surface at top so rep is anchored.
                Uses the standard .bb + .sol-badge pattern so this card matches
                the Solution Mapping card on the Brief page (visual continuity
                as the rep moves from Brief -> Hypothesis). */}
            {(brief?.solutionMapping||[]).filter(s=>s?.product).length>0&&(
              <div className="bb" style={{marginBottom:16}}>
                <div className="bb-hdr">
                  <div className="bb-icon" style={{fontSize:14}}>🎯</div>
                  <div>
                    <div className="bb-title">Solutions You're Selling into {selectedAccount?.company}</div>
                    <div className="bb-sub">How each offering maps to what this account needs</div>
                  </div>
                </div>
                <div className="bb-body" style={{display:"flex",flexDirection:"column",gap:10}}>
                  {(brief.solutionMapping||[]).filter(s=>s?.product).map((s,i)=>(
                    <div key={i} className="solution-item">
                      <div className="sol-badge">{s.product}</div>
                      <div style={{fontSize:13,color:"var(--ink-1)",lineHeight:1.6}}>{s.fit}</div>
                    </div>
                  ))}
                  {brief?.openingAngle&&(
                    <div style={{marginTop:4,paddingTop:12,borderTop:"1px solid var(--line-1)"}}>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:5}}>Opening Angle</div>
                      <div style={{fontSize:13,color:"var(--ink-1)",lineHeight:1.6,fontStyle:"italic"}}>"{brief.openingAngle}"</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {riverHypoLoading&&(
              <div className="load-box" style={{marginBottom:20}}>
                <div className="load-status">
                  <div className="load-spin"/>
                  Building RIVER hypothesis...
                </div>
                <div style={{height:3,background:"var(--tan-3)",borderRadius:2,overflow:"hidden",marginTop:12}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,var(--tan-0),var(--navy),var(--green),var(--tan-0))",backgroundSize:"300% 100%",animation:"shimmer 2.5s linear infinite",borderRadius:2}}/>
                </div>
                <div style={{fontSize:11,color:"#aaa",textAlign:"center",marginTop:8}}>
                  This usually finishes before you're done reading the brief
                </div>
              </div>
            )}

            {riverHypo&&(
              <>
                {/* RIVER fields — Quick Summary + Expand */}
                {[
                  {key:"reality",    label:"R — Reality",      icon:"📍", sub:"Current state", color:"var(--navy)"},
                  {key:"impact",     label:"I — Impact",       icon:"💥", sub:"Cost of inaction", color:"var(--red)"},
                  {key:"vision",     label:"V — Vision",       icon:"🔭", sub:"What success looks like", color:"var(--green)"},
                  {key:"entryPoints",label:"E — Entry Points", icon:"🚪", sub:"Decision-makers", color:"var(--purple)"},
                  {key:"route",      label:"R — Route",        icon:"🗺", sub:"Fastest path to close", color:"var(--tan-0)"},
                ].map(({key,label,icon,sub,color})=>(
                  <RiverFieldCard
                    key={key}
                    fieldKey={key}
                    label={label}
                    icon={icon}
                    sub={sub}
                    color={color}
                    value={String(riverHypo[key]||"")}
                    onChange={v=>setRiverHypo(prev=>({...prev,[key]:v}))}
                  />
                ))}

                {/* Opening Angle */}
                <div className="bb" style={{marginBottom:10}}>
                  <div className="bb-hdr">
                    <div className="bb-icon" style={{fontSize:14}}>🎯</div>
                    <div><div className="bb-title">Opening Angle</div><div className="bb-sub">The insight that makes everything click</div></div>
                  </div>
                  <div className="bb-body">
                    <EF
                      value={riverHypo.openingAngle||""}
                      onChange={v=>setRiverHypo(prev=>({...prev,openingAngle:v}))}
                      placeholder="Click to edit opening angle..."
                    />
                  </div>
                </div>

                {/* Challenger Insight */}
                {riverHypo.challengerInsight&&(
                  <div className="bb" style={{marginBottom:10}}>
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:14}}>⚡</div>
                      <div><div className="bb-title">Challenger Insight</div><div className="bb-sub">The assumption to challenge — teach this to the organization through the Mobilizer</div></div>
                    </div>
                    <div className="bb-body">
                      <div style={{background:"var(--ink-0)",borderRadius:8,padding:"12px 16px"}}>
                        <div style={{fontSize:9,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>The Insight (Challenger Customer)</div>
                        <div style={{fontSize:14,color:"#fff",lineHeight:1.7,fontStyle:"italic"}}>"{riverHypo.challengerInsight}"</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* JOLT Plan */}
                {riverHypo.joltPlan&&(riverHypo.joltPlan.judgeIndecision||riverHypo.joltPlan.recommendation)&&(
                  <div className="bb" style={{marginBottom:10}}>
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:14}}>🛡</div>
                      <div><div className="bb-title">JOLT Plan — Overcoming Indecision</div><div className="bb-sub">Dixon & McKenna: indecision kills 40-60% of deals. FOMU beats FOMO.</div></div>
                    </div>
                    <div className="bb-body" style={{display:"flex",flexDirection:"column",gap:10}}>
                      {[
                        {key:"judgeIndecision",label:"J — Judge the Indecision",color:"var(--amber)",bg:"var(--amber-bg)",icon:"🔍"},
                        {key:"recommendation",label:"O — Offer Your Recommendation",color:"var(--green)",bg:"var(--green-bg)",icon:"🎯"},
                        {key:"limitExploration",label:"L — Limit the Exploration",color:"var(--navy)",bg:"var(--navy-bg)",icon:"🔬"},
                        {key:"takeRiskOff",label:"T — Take Risk Off the Table",color:"var(--purple)",bg:"var(--purple-bg)",icon:"🛡"},
                      ].map(({key,label,color,bg,icon})=>riverHypo.joltPlan[key]&&(
                        <div key={key} style={{background:bg,border:"1px solid "+color+"33",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>{icon} {label}</div>
                          <EF value={riverHypo.joltPlan[key]||""} onChange={v=>setRiverHypo(prev=>({...prev,joltPlan:{...prev.joltPlan,[key]:v}}))} single/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Talk Tracks */}
                {(riverHypo.talkTracks||[]).length>0&&(
                  <div className="bb" style={{marginBottom:10}}>
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:14}}>💬</div>
                      <div><div className="bb-title">Talk Tracks</div><div className="bb-sub">Stage-by-stage language — grounded in buyer experience research</div></div>
                    </div>
                    <div className="bb-body" style={{display:"flex",flexDirection:"column",gap:12}}>
                      {(riverHypo.talkTracks||[]).map((t,i)=>(
                        <div key={i} style={{borderLeft:"3px solid var(--tan-0)",paddingLeft:12}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>{t.stage}</div>
                          <EF
                            value={t.line||""}
                            onChange={v=>setRiverHypo(prev=>{
                              const tt=[...(prev.talkTracks||[])];
                              tt[i]={...tt[i],line:v};
                              return {...prev,talkTracks:tt};
                            })}
                            single
                            placeholder="Click to edit..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!riverHypo&&!riverHypoLoading&&(
              <div style={{background:"var(--bg-1)",border:"1.5px dashed #C8C4BB",borderRadius:12,padding:24,textAlign:"center",color:"#aaa",fontSize:13}}>
                Hypothesis not yet generated.
                <button className="btn btn-gold" style={{marginLeft:12}} onClick={()=>buildRiverHypo(brief,selectedAccount)}>
                  Build Hypothesis
                </button>
              </div>
            )}

            <div className="actions-row">
              <button className="btn btn-secondary" onClick={()=>setStep(5)}>← Back to Brief</button>
              <button className="btn btn-secondary" onClick={()=>buildRiverHypo(brief,selectedAccount)} disabled={riverHypoLoading}>
                ↻ Regenerate
              </button>
              <button className="btn btn-green btn-lg" onClick={()=>{setActiveRiver(0);setStep(7);}}>
                Start In-Call →
              </button>
            </div>
          </div></ErrorBoundary>
        )}

        {/* ── STEP 6: IN-CALL NAVIGATOR ── */}
        {step===7&&(
          <div className="incall-wrap">

            {/* Header */}
            <div className="incall-header">
              <div>
                <div className="incall-title">🎙 In-Call Navigator · {selectedAccount?.company}</div>
                <div className="incall-meta">{contactRole||selectedAccount?.ind} · {selectedCohort?.name} · RIVER Framework</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{fontFamily:"Lora,serif",fontSize:20,fontWeight:600,color:confColor(confidence)}}>{confidence}%</div>
                <div style={{fontSize:12,color:"#aaa"}}>confidence</div>
                <button className="btn btn-secondary btn-sm" onClick={()=>setStep(5)}>← Hypothesis</button>
                <button className="btn btn-green btn-sm" onClick={runPostCall} disabled={postLoading}>
                  {postLoading?"Routing...":"End Call →"}
                </button>
              </div>
            </div>

            {/* Confidence bar */}
            <div style={{height:4,background:"var(--tan-3)",borderRadius:2,marginBottom:24,overflow:"hidden"}}>
              <div style={{height:"100%",width:confidence+"%",background:confColor(confidence),borderRadius:2,transition:"width 0.4s"}}/>
            </div>

            {/* RIVER Stage Pills */}
            <div className="river-pills">
              {RIVER_STAGES.map((s,i)=>{
                const filled=isFilled(s);
                return(
                  <button key={s.id} className={`river-pill ${activeRiver===i?"active":""} ${filled&&activeRiver!==i?"filled":""}`}
                    onClick={()=>setActiveRiver(i)}>
                    {filled&&activeRiver!==i&&<div className="river-pill-dot"/>}
                    <span className="river-pill-letter">{s.letter}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="incall-grid">
              {/* LEFT: Active stage */}
              <div>
                {RIVER_STAGES.map((stage,si)=>si===activeRiver&&(
                  <div key={stage.id}>

                    {/* Stage header */}
                    <div className="stage-card">
                      <div className="stage-card-hdr">
                        <div className="stage-letter-big">{stage.letter}</div>
                        <div>
                          <div className="stage-name">{stage.label}</div>
                          <div className="stage-sub">{stage.sub}</div>
                        </div>
                      </div>

                      {/* Gate questions with horizontal choices + notes */}
                      {stage.gates.map((gate,gi)=>(
                        <div key={gate.id} className="gate-block">
                          <div className="gate-question">{gate.q}</div>
                          <div className="gate-choices">
                            {gate.options.map((opt,oi)=>(
                              <button key={oi}
                                className={`gate-choice ${gateAnswers[gate.id]===opt?"selected":""}`}
                                onClick={()=>setGateAnswers(a=>({...a,[gate.id]:gateAnswers[gate.id]===opt?undefined:opt}))}>
                                {opt}
                              </button>
                            ))}
                          </div>
                          <div className="gate-note-lbl">Your notes</div>
                          <textarea className="gate-note"
                            placeholder="What are you hearing? Capture exact language..."
                            value={gateNotes[gate.id]||""}
                            onChange={e=>setGateNotes(n=>({...n,[gate.id]:e.target.value}))}/>
                        </div>
                      ))}

                      {/* Stage nav */}
                      <div style={{display:"flex",gap:8,marginTop:16,paddingTop:14,borderTop:"1px solid var(--tan-3)"}}>
                        {si>0&&<button className="btn btn-secondary btn-sm" onClick={()=>setActiveRiver(si-1)}>← {RIVER_STAGES[si-1].label}</button>}
                        {si<RIVER_STAGES.length-1&&<button className="btn btn-gold btn-sm" onClick={()=>setActiveRiver(si+1)}>{RIVER_STAGES[si+1].label} →</button>}
                        {si===RIVER_STAGES.length-1&&<button className="btn btn-green btn-sm" onClick={runPostCall} disabled={postLoading}>{postLoading?"Routing...":"End Call & Route Deal →"}</button>}
                      </div>
                    </div>

                    {/* Discovery Questions — product-specific */}
                    <div className="stage-card">
                      <div style={{fontFamily:"Lora,serif",fontSize:15,fontWeight:600,marginBottom:16,color:"var(--ink-0)"}}>
                        🎯 Discovery Questions
                        <span style={{fontSize:11,fontWeight:400,color:"#999",marginLeft:8,fontFamily:"DM Sans,sans-serif"}}>product-specific · tailored to {selectedAccount?.company}</span>
                      </div>

                      {/* Static RIVER stage questions */}
                      {stage.discovery.map((prompt,pi)=>(
                        <div key={prompt.id} className="dq-block">
                          <div className="dq-framework">RIVER Discovery</div>
                          <div className="dq-question">"{prompt.label}"</div>
                          <div className="gate-note-lbl">What you're hearing</div>
                          <textarea className="dq-note"
                            placeholder={prompt.hint}
                            value={riverData[prompt.id]||""}
                            onChange={e=>setRiverData(d=>({...d,[prompt.id]:e.target.value}))}/>
                        </div>
                      ))}

                      {/* AI-generated product-specific questions */}
                      {discoveryQs&&(()=>{
                        const stageKey=["reality","impact","vision","entryPoints","route"][si];
                        const qs=discoveryQs[stageKey]||[];
                        return qs.filter(q=>q?.q).map((dq,qi)=>(
                          <div key={qi} className="dq-block" style={{borderLeftColor:"var(--navy)"}}>
                            <div className="dq-framework" style={{color:"var(--navy)"}}>{dq.framework||"Active Listening"}</div>
                            <div className="dq-question">"{dq.q}"</div>
                            {dq.intent&&<div style={{fontSize:11,color:"#777",marginBottom:8,fontStyle:"normal"}}>{dq.intent}</div>}
                            <div className="gate-note-lbl">What you're hearing</div>
                            <textarea className="dq-note"
                              placeholder="Capture their exact words..."
                              value={riverData["dq_"+si+"_"+qi]||""}
                              onChange={e=>setRiverData(d=>({...d,["dq_"+si+"_"+qi]:e.target.value}))}/>
                          </div>
                        ));
                      })()}

                      {!discoveryQs&&(
                        <div style={{fontSize:12,color:"#aaa",fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>
                          Generating product-specific questions...
                        </div>
                      )}
                    </div>

                    {/* Talk Track */}
                    <div style={{background:"var(--ink-0)",borderRadius:12,padding:"16px 18px",marginBottom:14}}>
                      <div style={{fontSize:11,fontWeight:700,color:"var(--tan-0)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>Talk Track</div>
                      <div style={{fontSize:14,color:"#fff",lineHeight:1.7,fontStyle:"italic"}}>{stage.talkTrack}</div>
                    </div>

                    {/* Objection Handling */}
                    <div className="stage-card">
                      <div style={{fontSize:13,fontWeight:700,color:"var(--red)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>⚡ Objection Handling</div>
                      {stage.objections.map((o,oi)=>(
                        <div key={oi} style={{marginBottom:10}}>
                          <button style={{width:"100%",textAlign:"left",padding:"10px 14px",borderRadius:8,border:"1px solid var(--line-0)",background:"var(--red-bg)",cursor:"pointer",fontSize:13,fontWeight:600,color:"var(--red)",fontFamily:"DM Sans,sans-serif"}}
                            onClick={()=>setExpandedObjs(s=>({...s,[si+"-"+oi]:!s[si+"-"+oi]}))}>
                            "{o.q}" <span style={{float:"right",color:"#bbb"}}>{expandedObjs[si+"-"+oi]?"▲":"▼"}</span>
                          </button>
                          {expandedObjs[si+"-"+oi]&&(
                            <div style={{padding:"10px 14px",background:"var(--bg-0)",borderRadius:"0 0 8px 8px",border:"1px solid var(--line-0)",borderTop:"none",fontSize:13,color:"#333",lineHeight:1.6,fontStyle:"italic"}}>
                              {o.a}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>

              {/* RIGHT: Reference sidebar */}
              <div>
                {/* Notes */}
                <div className="incall-sidebar" style={{marginBottom:14}}>
                  <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"var(--tan-0)",marginBottom:8}}>Call Notes</div>
                  <textarea style={{width:"100%",minHeight:160,padding:10,border:"1px solid var(--line-0)",borderRadius:8,fontSize:13,fontFamily:"DM Sans",background:"#FAFAF8",resize:"vertical"}}
                    placeholder="Free-form notes... Tab = timestamp"
                    value={notes} onChange={e=>setNotes(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Tab"){e.preventDefault();const ts=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});const el=e.target;const b=el.value.slice(0,el.selectionStart);const a=el.value.slice(el.selectionStart);el.value=b+"\n["+ts+"] "+a;setNotes(el.value);}}}/>
                  <div style={{fontSize:10,color:"#aaa",marginTop:4}}>Tab inserts timestamp · feeds post-call summary</div>
                </div>

                {/* Opening Angle */}
                {brief?.openingAngle&&(
                  <div className="incall-sidebar" style={{marginBottom:14,borderLeft:"3px solid var(--tan-0)"}}>
                    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"var(--tan-0)",marginBottom:6}}>Opening Angle</div>
                    <div style={{fontSize:13,color:"#333",lineHeight:1.6,fontStyle:"italic"}}>"{brief.openingAngle}"</div>
                  </div>
                )}

                {/* Solutions quick ref */}
                {(brief?.solutionMapping||[]).filter(s=>s?.product).length>0&&(
                  <div className="incall-sidebar" style={{marginBottom:14}}>
                    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"var(--navy)",marginBottom:8}}>Solutions</div>
                    {(brief.solutionMapping||[]).filter(s=>s?.product).map((s,i)=>(
                      <div key={i} style={{marginBottom:8,paddingBottom:8,borderBottom:i<(brief.solutionMapping.filter(x=>x?.product).length-1)?"1px solid var(--tan-3)":"none"}}>
                        <div style={{fontSize:12,fontWeight:700,color:"var(--ink-0)",marginBottom:2}}>{s.product}</div>
                        <div style={{fontSize:11,color:"#666",lineHeight:1.5}}>{s.fit}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Watch-outs */}
                {(brief?.watchOuts||[]).filter(Boolean).length>0&&(
                  <div className="incall-sidebar">
                    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"var(--red)",marginBottom:8}}>⚠ Watch-Outs</div>
                    {(brief.watchOuts||[]).filter(Boolean).map((w,i)=>(
                      <div key={i} style={{fontSize:12,color:"#555",paddingBottom:6,marginBottom:6,borderBottom:i<brief.watchOuts.filter(Boolean).length-1?"1px solid var(--tan-3)":"none",lineHeight:1.5}}>
                        {w}
                      </div>
                    ))}
                  </div>
                )}

                {brief?.processMaturity?.dmiacStage&&(
                  <div className="incall-sidebar" style={{marginTop:14}}>
                    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"var(--navy)",marginBottom:8}}>⚙️ DMAIC Stage</div>
                    <div style={{display:"flex",gap:3,marginBottom:8,flexWrap:"wrap"}}>
                      {(()=>{
                        const stages=["Define","Measure","Analyze","Improve","Control"];
                        const colors=["#9B2C2C","#BA7517","#1B3A6B","#2E6B2E","#6B3A7A"];
                        const ai=stages.indexOf(brief.processMaturity.dmiacStage);
                        return stages.map((s,i)=>(
                          <span key={s} style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,
                            background:i===ai?colors[i]:i<ai?colors[i]+"22":"var(--tan-3)",
                            color:i===ai?"#fff":i<ai?colors[i]:"#aaa",
                            border:"1px solid "+(i<=ai?colors[i]:"var(--line-0)")}}>
                            {s}
                          </span>
                        ));
                      })()}
                    </div>
                    <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{(brief.processMaturity.maturityNote||"").slice(0,120)}{(brief.processMaturity.maturityNote||"").length>120?"...":""}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 8: POST-CALL ── */}
        {/* ── STEP 7: POST-CALL ── */}
        {step===8&&(
          <div className="page">
            <div className="page-title">Post-Call Route</div>
            <div className="page-sub">RIVER synthesis for <strong>{selectedAccount?.company}</strong> — deal routing, next steps, CRM note, and follow-up email.</div>
            {postLoading&&(
              <div className="card">
                <div style={{fontSize:13,color:"#777",marginBottom:12}}>Synthesizing RIVER capture and generating deal route...</div>
                <div className="pulse-wrap">{[70,90,55,80,65,75,50].map((w,i)=><div key={i} className="pulse-line" style={{width:w+"%",animationDelay:(i*0.12)+"s"}}/>)}</div>              </div>
            )}
            {postCall&&!postLoading&&(
              <>
                <div className="summary-grid">
                  <div className="stat-card"><div className="stat-num" style={{color:confColor(confidence)}}>{confidence}%</div><div className="stat-label">Deal Confidence</div></div>
                  <div className="stat-card"><div className="stat-num" style={{fontSize:14,paddingTop:4}}>{routeLabel}</div><div className="stat-label">Deal Route</div></div>
                  <div className="stat-card"><div className="stat-num">{selectedAccount?.acv>0?"$"+selectedAccount.acv.toLocaleString():"—"}</div><div className="stat-label">Deal Size</div></div>
                </div>
                <div className={`route-card ${routeClass}`}>
                  <div className="route-lbl">Deal Route</div>
                  <div className="route-title">{routeLabel}</div>
                  <div className="route-desc">{postCall.dealRouteReason}</div>
                  {postCall.dealRisk&&<div style={{marginTop:7,fontSize:11,color:"#555"}}>⚠ Top risk: {postCall.dealRisk}</div>}
                </div>
                <div className="card">
                  <div className="card-title">RIVER Scorecard</div>
                  {postCall.riverScorecard&&RIVER_STAGES.map((stage,i)=>(
                    <div key={i} className="hyp-card" style={{cursor:"default"}}>
                      <div className="hyp-lbl">{stage.letter} — {stage.label}</div>
                      <div className="hyp-txt">{postCall.riverScorecard[RKEYS[i]]}</div>
                    </div>
                  ))}
                </div>
                <div className="post-sec"><div className="post-lbl">Next Steps</div><div className="post-content">{postCall.nextSteps?.map((s,i)=>(i+1)+". "+s).join("\n")}</div></div>
                <div className="post-sec"><div className="post-lbl">CRM Note <button className="copy-btn" onClick={()=>copyText(postCall.crmNote,"crm")}>{copied==="crm"?"Copied ✓":"Copy"}</button></div><div className="post-content">{postCall.crmNote}</div></div>
                <div className="post-sec"><div className="post-lbl">Call Summary <button className="copy-btn" onClick={()=>copyText(postCall.callSummary,"summary")}>{copied==="summary"?"Copied ✓":"Copy"}</button></div><div className="post-content">{postCall.callSummary}</div></div>
                <div className="post-sec">
                  <div className="post-lbl">Follow-Up Email <button className="copy-btn" onClick={()=>copyText("Subject: "+postCall.emailSubject+"\n\n"+postCall.emailBody,"email")}>{copied==="email"?"Copied ✓":"Copy Email"}</button></div>
                  <div className="post-content" style={{fontSize:12}}>
                    <div style={{fontWeight:600,marginBottom:9,color:"var(--ink-0)"}}>Subject: {postCall.emailSubject}</div>
                    {postCall.emailBody}
                  </div>
                </div>
                <div className="actions-row">
                  <button className="btn btn-secondary" onClick={()=>setStep(7)}>← Back to Call</button>
                  <button className="btn btn-navy" onClick={doExport}>🖨 Save as PDF</button>
                  <button className="btn btn-gold" onClick={showCustomerBrief} style={{display:"flex",alignItems:"center",gap:5}}>
                    📄 Download Customer Ready Call Summary
                  </button>
                  <button className="btn btn-gold" onClick={()=>{setPostCall(null);setPostLoading(true);setTimeout(runPostCall,100);}}>Regenerate</button>
                  <button className="btn btn-green btn-lg" onClick={()=>{buildSolutionFit();setStep(9);}}>
                    Solution Fit Review →
                  </button>
                  <button className="btn btn-primary" onClick={()=>{setStep(3);setSelectedAccount(null);setGateAnswers({});setRiverData({});setPostCall(null);setBrief(null);setNotes("");setContactRole("");}}>New Account</button>
                  <button className="btn btn-secondary" onClick={()=>{setStep(2);setCohorts([]);setSelectedCohort(null);setSelectedOutcomes([]);setSelectedAccount(null);setGateAnswers({});setRiverData({});setPostCall(null);setBrief(null);setNotes("");setRows([]);setHeaders([]);setFileName("");clearSession();}}>New Dataset</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 9: SOLUTION FIT REVIEW ── */}
        {step===9&&(
          <S9SolutionFit
            solutionFit={solutionFit}
            solutionFitLoading={solutionFitLoading}
            selectedAccount={selectedAccount}
            onRun={buildSolutionFit}
            onRegenerate={()=>{setSolutionFit(null);setSolutionFitLoading(true);setTimeout(buildSolutionFit,100);}}
            onBack={()=>setStep(8)}
            onExport={doExport}
            onNextAccount={()=>{setStep(3);setSelectedAccount(null);setGateAnswers({});setRiverData({});setPostCall(null);setSolutionFit(null);setBrief(null);setNotes("");setContactRole("");}}
          />
        )}

      </div>
      <footer className="footer">
        © 2026 Cambrian Catalyst LLC · Seattle, WA · All rights reserved
      </footer>
    </>
  );
}
