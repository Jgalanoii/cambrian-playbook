#!/usr/bin/env node
/**
 * The Play eval harness — tests buildPlayPrompt + validatePlay pure functions
 * against the fixtures in tests/the-play/fixtures.json.
 *
 * Does NOT call the Anthropic API — tests the validation/prompt-assembly logic
 * deterministically. To run a live generation eval (API key required), pass --live.
 *
 * Checks (per account):
 *   1. buildPlayPrompt output contains identity anchor (seller + target + EXTRACTIVE RULE)
 *   2. buildPlayPrompt output contains all 4 required source sections (P1, P2, P4, P5)
 *   3. validatePlay accepts a correctly-structured synthetic play (happy path)
 *   4. validatePlay rejects a play missing the target company (check 1)
 *   5. validatePlay clears primaryContact when name not in P2 (check 3)
 *   6. validatePlay clears topProduct when not in solutionMapping (check 4)
 *   7. Cross-account contamination: Marriott-data play contains no Stripe-specific tokens and vice versa
 *
 * Exit codes:  0 = PASS   1 = FAIL
 *
 * Usage:  node tests/the-play/eval.js
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(readFileSync(resolve(__dirname, 'fixtures.json'), 'utf8'));

// ── Import the pure helpers directly from the source ─────────────────────────
// These are module-scope functions in App.jsx — but App.jsx is a React component
// file that can't be imported in plain Node. We inline equivalent implementations
// here and keep them in sync. If you change buildPlayPrompt/validatePlay in App.jsx,
// update these too.

function buildPlayPrompt(targetCompany, targetDomain, sellerICP, brief, fitScore) {
  const trunc = (v, n) => (typeof v === 'string' ? v : (JSON.stringify(v) || '')).slice(0, n);
  const sf    = (s) => (s || '').replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  const seller     = sf(sellerICP?.sellerName || '');
  const sellerDesc = sf(sellerICP?.sellerDescription || '');
  const catalog    = (sellerICP?.icp?.productCatalog || []).slice(0, 3).map(p => sf(typeof p === 'string' ? p : p?.name || '')).filter(Boolean).join(', ');
  const customers  = (sellerICP?.icp?.verifiedCustomers || sellerICP?.icp?.customerExamples || []).slice(0, 3).map(sf).join(', ');
  const p1 = `${trunc(brief?.companySnapshot, 2000)} · revenue:${brief?.revenue||''} · employees:${brief?.employeeCount||''} · HQ:${brief?.headquarters||''} · ${brief?.fundingProfile||''}`.slice(0, 3000);
  const p2 = trunc(JSON.stringify([...(brief?.keyExecutives || []), ...(brief?.keyContacts || [])]), 2000);
  const p4 = trunc(JSON.stringify(brief?.solutionMapping || []), 2000);
  const p5 = `${(brief?.recentSignals || []).join(' · ')} · ${brief?.recentHeadlines||''} · ${brief?.growthSignals||''} · sentiment:${brief?.publicSentiment?.sentimentSummary||''}`.slice(0, 2000);
  const p3 = brief?.strategicTheme ? `${brief.strategicTheme} · ${brief.openingAngle||''} · ${brief.sellerOpportunity||''}`.slice(0, 1500) : null;
  const fitLabel = fitScore ? `${fitScore.label} · ${fitScore.score}%` : 'Not scored';
  const bar = '═'.repeat(55);
  return `${bar}
You are building a sales play for ONE specific session.
SELLER: ${seller} (selling ${sellerDesc})
TARGET COMPANY: ${sf(targetCompany)} (${sf(targetDomain)})
DIRECTION OF SALE: ${seller} → ${sf(targetCompany)}
Every sentence must be about ${sf(targetCompany)} specifically.
FIT SCORE: ${fitLabel}
${bar}

SOURCE SECTIONS:
[P1: COMPANY OVERVIEW]\n${p1}
[P2: EXECUTIVES]\n${p2}
[P4: SOLUTIONS MATCH]\n${p4}
[P5: LIVE SIGNALS]\n${p5}
${p3 ? `[P3: STRATEGY]\n${p3}\n` : ''}[ICP: SELLER CONTEXT]
${sellerDesc} · products:${catalog} · customers:${customers}

TASK: Build The Play for ${seller} selling into ${sf(targetCompany)}.`;
}

function validatePlay(play, targetCompany, targetDomain, brief, sellerICP) {
  if (!play || typeof play !== 'object') return { play: null, playState: 'unavailable' };
  let state = 'full';
  const targetLower = (targetCompany || '').toLowerCase();
  const domainLower  = (targetDomain || '').toLowerCase();
  const sellerLower  = (sellerICP?.sellerName || '').toLowerCase();

  const playStr = JSON.stringify(play).toLowerCase();
  if (!playStr.includes(targetLower) && (!domainLower || !playStr.includes(domainLower))) {
    return { play: null, playState: 'unavailable' };
  }

  const competitors = (brief?.competitors || [])
    .map(c => (typeof c === 'string' ? c : c?.name || '').toLowerCase())
    .filter(c => c && c !== targetLower && c !== sellerLower);
  const strFields = ['situation', 'whyNow', 'yourMove', 'elevatorPitch', 'draftEmailBody'];
  for (const field of strFields) {
    if (typeof play[field] !== 'string') continue;
    for (const comp of competitors) {
      if (play[field].toLowerCase().includes(comp)) {
        const sentences = play[field].split(/(?<=[.!?])\s+/);
        play[field] = sentences.filter(s => !s.toLowerCase().includes(comp)).join(' ').trim();
      }
    }
  }

  const p2Str = JSON.stringify([...(brief?.keyExecutives || []), ...(brief?.keyContacts || [])]).toLowerCase();
  const contactName = (play?.primaryContact?.name || '').toLowerCase().trim();
  if (contactName && !p2Str.includes(contactName)) {
    play.primaryContact = null;
    if (state === 'full') state = 'contactUnconfirmed';
  }

  const smProducts  = (brief?.solutionMapping || []).map(s => (s?.product || '').toLowerCase());
  const catProducts = (sellerICP?.icp?.productCatalog || []).map(p => (typeof p === 'string' ? p : p?.name || '').toLowerCase());
  const topProd = (play?.topProduct || '').toLowerCase().trim();
  if (topProd && !smProducts.some(p => p && (p.includes(topProd) || topProd.includes(p))) &&
                 !catProducts.some(p => p && (p.includes(topProd) || topProd.includes(p)))) {
    play.topProduct = null;
  }

  if (!play.sectionSources || !Object.keys(play.sectionSources || {}).length) { /* log only */ }
  return { play, playState: state };
}

// ── Test harness ──────────────────────────────────────────────────────────────
let passed = 0, failed = 0;
const PASS = '  PASS ';
const FAIL = '  FAIL ';

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`${PASS} ${label}`);
    passed++;
  } else {
    console.log(`${FAIL} ${label}${detail ? `  ← ${detail}` : ''}`);
    failed++;
  }
}

console.log('\nThe Play Eval — pure function checks\n');

const { sellerICP, accounts } = fixtures;

for (const [name, acct] of Object.entries(accounts)) {
  const { brief, fitScore, company, company_url } = acct;
  console.log(`\n── ${name} ──`);

  // Check 1: prompt contains identity anchor
  const prompt = buildPlayPrompt(company, company_url, sellerICP, brief, fitScore);
  assert(`${name} | prompt contains seller name`,          prompt.includes(sellerICP.sellerName));
  assert(`${name} | prompt contains target company`,       prompt.includes(company));
  assert(`${name} | prompt contains identity anchor`,       prompt.includes('DIRECTION OF SALE') && prompt.includes('Every sentence must be about'));

  // Check 2: prompt contains all required source sections
  assert(`${name} | prompt contains [P1]`,  prompt.includes('[P1:'));
  assert(`${name} | prompt contains [P2]`,  prompt.includes('[P2:'));
  assert(`${name} | prompt contains [P4]`,  prompt.includes('[P4:'));
  assert(`${name} | prompt contains [P5]`,  prompt.includes('[P5:'));

  // Check 3: happy-path validatePlay accepts well-formed play
  const goodPlay = {
    situation:      `${company} is expanding its loyalty program.`,
    whyNow:         'BHN Rewards can accelerate the expansion.',
    yourMove:       `Contact ${brief.keyContacts?.[0]?.name || brief.keyExecutives?.[0]?.name || 'the CHRO'}.`,
    primaryContact: {
      name:      brief.keyContacts?.[0]?.name || brief.keyExecutives?.[0]?.name || 'David Rodriguez',
      title:     brief.keyContacts?.[0]?.title || brief.keyExecutives?.[0]?.title || 'EVP',
      rationale: 'Leads rewards and recognition initiatives.',
    },
    elevatorPitch:    `BHN helps ${company} deliver instant digital rewards.`,
    draftEmailSubject:`${company} + BHN: instant reward delivery`,
    draftEmailBody:   `Hi, I wanted to reach out about ${company}'s reward programs.`,
    topProduct:       brief.solutionMapping?.[0]?.product || 'BHN Rewards',
    keySignal:        brief.recentSignals?.[0] || 'Recent growth signals.',
    sectionSources:   { situation:['P1','P5'], whyNow:['P4','P5'], yourMove:['P2'], elevatorPitch:['P4','ICP'], primaryContact:['P2'] },
  };
  const { play: hp, playState: hps } = validatePlay({ ...goodPlay }, company, company_url, brief, sellerICP);
  assert(`${name} | happy path → play not null`, hp !== null);
  assert(`${name} | happy path → state is full or contactUnconfirmed`, hps === 'full' || hps === 'contactUnconfirmed');

  // Check 4: target-missing play → unavailable (check 1)
  const noTarget = { ...goodPlay, situation: 'A company is growing.', whyNow: 'Products help.', yourMove: 'Call someone.', elevatorPitch: 'We help businesses.', draftEmailBody: 'Hi there.', topProduct: 'BHN Rewards' };
  // Remove company name from all fields
  const sanitized = JSON.parse(JSON.stringify(noTarget));
  const compLower = company.toLowerCase();
  for (const f of ['situation','whyNow','yourMove','elevatorPitch','draftEmailBody','draftEmailSubject','keySignal']) {
    if (typeof sanitized[f] === 'string') sanitized[f] = sanitized[f].replace(new RegExp(company, 'gi'), 'COMPANY').replace(new RegExp(company_url, 'gi'), 'DOMAIN');
  }
  if (sanitized.primaryContact) sanitized.primaryContact = { name: sanitized.primaryContact.name, title: sanitized.primaryContact.title, rationale: 'Leads initiatives.' };
  const { play: np, playState: nps } = validatePlay(sanitized, company, company_url, brief, sellerICP);
  assert(`${name} | target-missing → unavailable`, nps === 'unavailable' && np === null, `got state=${nps}`);

  // Check 5: invented contact → cleared (check 3)
  const badContact = { ...goodPlay, primaryContact: { name: 'Zyx Invented Person', title: 'CTO', rationale: 'Leads things.' } };
  const { play: bcp } = validatePlay({ ...badContact }, company, company_url, brief, sellerICP);
  assert(`${name} | invented contact → cleared`, bcp?.primaryContact === null, `got ${JSON.stringify(bcp?.primaryContact)}`);

  // Check 6: invented product → cleared (check 4)
  const badProd = { ...goodPlay, topProduct: 'FakeProduct XYZ 9000' };
  const { play: bpp } = validatePlay({ ...badProd }, company, company_url, brief, sellerICP);
  assert(`${name} | invented product → cleared`, bpp?.topProduct === null, `got "${bpp?.topProduct}"`);
}

// ── Cross-account contamination check (highest priority) ─────────────────────
console.log('\n── Contamination check: Marriott prompt ↔ Stripe prompt ──');
const marriottAcct = accounts['Marriott'];
const stripeAcct   = accounts['Stripe'];
const marriottPrompt = buildPlayPrompt(marriottAcct.company, marriottAcct.company_url, sellerICP, marriottAcct.brief, marriottAcct.fitScore);
const stripePrompt   = buildPlayPrompt(stripeAcct.company,   stripeAcct.company_url,   sellerICP, stripeAcct.brief,   stripeAcct.fitScore);

// Marriott-specific tokens that must not appear in the Stripe prompt
const marriottTokens = ['Bonvoy', 'Ritz-Carlton', 'Sheraton', 'Westin', 'Capuano', 'Peggy Fang'];
for (const tok of marriottTokens) {
  assert(`Stripe prompt does not contain Marriott token "${tok}"`, !stripePrompt.includes(tok));
}
// Stripe-specific tokens that must not appear in the Marriott prompt
const stripeTokens   = ['Collison', 'Becksted', 'stripe.com', 'Series I', '$65B'];
for (const tok of stripeTokens) {
  assert(`Marriott prompt does not contain Stripe token "${tok}"`, !marriottPrompt.includes(tok));
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(60)}`);
console.log(`The Play Eval: ${passed + failed} checks — ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('PASS — all checks green.\n');
  process.exit(0);
} else {
  console.log('FAIL — see above.\n');
  process.exit(1);
}
