// lib/utils.js — Pure utility functions

export function parseACV(v){if(!v)return 0;const n=parseFloat(v.toString().replace(/[$,]/g,"").replace(/k$/i,"000"));return isNaN(n)?0:n;}

export function labelOrgSize(row,mapping){
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

export function labelACV(v){if(v===0)return"Unknown";if(v<25000)return"SMB (<$25K)";if(v<100000)return"Mid-Market ($25K–$100K)";return"Enterprise ($100K+)";}

export function getOutcomeTheme(row,mapping){
  const get=k=>(mapping[k]?(row[mapping[k]]||""):"").toString().toLowerCase();
  const txt=get("outcome")+get("product");
  if(/revenue|growth|sales|pipeline/.test(txt))return"Revenue Growth";
  if(/efficien|automat|process|cost/.test(txt))return"Operational Efficiency";
  if(/churn|retain|loyal/.test(txt))return"Customer Retention";
  if(/payroll|hr|employ|workforce/.test(txt))return"Workforce Management";
  if(/ai|ml|data|analytic/.test(txt))return"Data & AI Adoption";
  return"Strategic Transformation";
}

export function buildCohorts(rows,mapping){
  if(!rows.length)return[];
  const get=(row,key)=>(mapping[key]?(row[mapping[key]]||""):"").toString().trim();
  const groups={};
  rows.forEach(row=>{
    const acv=0, // ACV removed — reps assess deal size themselves
      ind=get(row,"industry")||"Other",
      // Band by industry vertical for meaningful cohorts
      band=ind||"Other",
      src=get(row,"lead_source")||"Direct",outcome=getOutcomeTheme(row,mapping),
      company=get(row,"company"),product=get(row,"product"),company_url=get(row,"company_url")||"",
      employees=get(row,"employees")||"",
      publicPrivate=get(row,"public_private")||"",
      geography=get(row,"geography")||"";
    if(!groups[band])groups[band]=[];
    groups[band].push({row,ind,acv,band,src,outcome,company,product,company_url,employees,publicPrivate,geography});
  });
  return Object.entries(groups).sort(([,a],[,b])=>b.length-a.length).slice(0,5)
    .map(([name,members],i)=>{
      const acvs=members.filter(m=>m.acv>0);
      return{id:i,name,color:COHORT_COLORS[i],size:members.length,
        pct:Math.round(members.length/rows.length*100),
        avgACV:acvs.length?Math.round(acvs.reduce((s,m)=>s+m.acv,0)/acvs.length):0,
        topInd:[...new Set(members.map(m=>m.ind))].slice(0,3),
        topSrc:[...new Set(members.map(m=>m.src))].slice(0,2),
        topOut:[...new Set(members.map(m=>m.outcome))].slice(0,2),members};
    });
}

export function calcConfidence(gateAnswers,riverData){
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

export function confColor(s){return s>=75?"#2E6B2E":s>=50?"#BA7517":"#9B2C2C";}

export function extractJSON(text){
  try{
    const clean=text.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
    try{return JSON.parse(clean);}catch{
      const m=clean.match(/\{[\s\S]*\}/);
      return m?JSON.parse(m[0]):null;
    }
  }catch{return null;}
}

export function safeParseJSON(text){
  try{return JSON.parse(text);}catch{}
  const s=text.replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/[\u2013\u2014]/g,"-").replace(/[\u2026]/g,"...").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,"");
  // Also strip trailing commas before arrays/objects close
  const noTrailing = s.replace(/,\s*([}
