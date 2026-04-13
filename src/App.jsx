import React, { useState, useCallback, useRef, useEffect } from "react";

const SB_URL=import.meta.env.VITE_SUPABASE_URL;
const SB_KEY=import.meta.env.VITE_SUPABASE_ANON_KEY;
async function sbAuth(path,body){const r=await fetch(SB_URL+'/auth/v1/'+path,{method:'POST',headers:{'apikey':SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});return r.json();}
async function sbGetUser(token){const r=await fetch(SB_URL+'/auth/v1/user',{headers:{'apikey':SB_KEY,'Authorization':'Bearer '+token}});return r.ok?r.json():null;}
async function sbSessions(method,path,token,body){const r=await fetch(SB_URL+'/rest/v1/'+path,{method,headers:{'apikey':SB_KEY,'Authorization':'Bearer '+token,'Content-Type':'application/json','Prefer':'return=representation'},body:body?JSON.stringify(body):undefined});const t=await r.text();return t?JSON.parse(t):null;}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #F7F6F2; color: #1a1a18; font-size: 15px; line-height: 1.6; }
.app { min-height: 100vh; display: flex; flex-direction: column; }

/* ── HEADER ──────────────────────────────────────────── */
.header { background: #fff; border-bottom: 1px solid #E8E6DF; padding: 0 24px; height: 52px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 200; flex-shrink: 0; gap: 12px; }
.logo { font-family: 'Lora', serif; font-size: 17px; font-weight: 700; color: #1a1a18; white-space: nowrap; letter-spacing: -0.2px; }
.logo span { color: #8B6F47; }
.stepper { display: flex; align-items: center; overflow-x: auto; gap: 0; }
.step-item { display: flex; align-items: center; gap: 5px; padding: 0 8px; font-size: 11px; font-weight: 700; color: #ccc; letter-spacing: 0.5px; text-transform: uppercase; cursor: default; white-space: nowrap; transition: color 0.15s; }
.step-item.active { color: #1a1a18; }
.step-item.done { color: #8B6F47; cursor: pointer; }
.step-item.done:hover { color: #7A6040; }
.step-num { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
.step-item.done .step-num { background: #8B6F47; border-color: #8B6F47; color: #fff; }
.step-item.active .step-num { background: #1a1a18; border-color: #1a1a18; color: #fff; }
.step-div { width: 12px; height: 1px; background: #E8E6DF; flex-shrink: 0; }
.live-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #2E6B2E; background: #EEF5EE; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.3px; }
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #2E6B2E; animation: blink 1.2s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1}50%{opacity:0.25} }

/* ── LAYOUT ──────────────────────────────────────────── */
.page { max-width: 860px; margin: 0 auto; padding: 32px 24px 64px; width: 100%; }
.page-title { font-family: 'Lora', serif; font-size: 26px; font-weight: 600; margin-bottom: 5px; color: #1a1a18; letter-spacing: -0.3px; }
.page-sub { font-size: 14px; color: #666; line-height: 1.65; margin-bottom: 24px; max-width: 560px; }
.footer { text-align: center; padding: 20px 24px; font-size: 11px; color: #bbb; border-top: 1px solid #E8E6DF; margin-top: auto; background: #fff; }

/* ── SESSION BAR ─────────────────────────────────────── */
.session-bar { background: #fff; border-bottom: 1px solid #E8E6DF; padding: 6px 24px; display: flex; align-items: center; gap: 12px; font-size: 12px; color: #888; flex-shrink: 0; flex-wrap: wrap; }
.session-url { color: #8B6F47; font-weight: 600; }

/* ── BUTTONS ─────────────────────────────────────────── */
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: none; line-height: 1.2; white-space: nowrap; }
.btn:disabled { opacity: 0.38; cursor: not-allowed; }
.btn-primary { background: #1a1a18; color: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
.btn-primary:hover:not(:disabled) { background: #2d2d2b; box-shadow: 0 3px 8px rgba(0,0,0,0.2); }
.btn-secondary { background: #fff; border: 1.5px solid #D4D0C8; color: #444; }
.btn-secondary:hover:not(:disabled) { border-color: #8B6F47; color: #8B6F47; background: #FAF8F4; }
.btn-gold { background: #8B6F47; color: #fff; box-shadow: 0 1px 4px rgba(139,111,71,0.25); }
.btn-gold:hover:not(:disabled) { background: #7A6040; }
.btn-green { background: #2E6B2E; color: #fff; box-shadow: 0 1px 4px rgba(46,107,46,0.25); }
.btn-green:hover:not(:disabled) { background: #245424; }
.btn-navy { background: #1B3A6B; color: #fff; box-shadow: 0 1px 4px rgba(27,58,107,0.25); }
.btn-navy:hover:not(:disabled) { background: #152d54; }
.btn-lg { padding: 11px 22px; font-size: 15px; }
.btn-sm { padding: 4px 10px; font-size: 12px; }
.actions-row { display: flex; gap: 8px; margin-top: 24px; align-items: center; flex-wrap: wrap; }

/* ── CARDS ───────────────────────────────────────────── */
.card { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 18px; margin-bottom: 12px; }
.card-title { font-family: 'Lora', serif; font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #1a1a18; }

/* ── FORMS ───────────────────────────────────────────── */
.field-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.field-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #888; }
.field-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
input[type=text], input[type=email], input[type=password], select, textarea { width: 100%; padding: 8px 11px; border: 1.5px solid #E8E6DF; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a18; background: #fff; outline: none; transition: border-color 0.15s; resize: vertical; -webkit-appearance: none; }
input[type=text]:focus, input[type=email]:focus, input[type=password]:focus, select:focus, textarea:focus { border-color: #8B6F47; background: #fff; box-shadow: 0 0 0 3px rgba(139,111,71,0.08); }
input[type=text]::placeholder, input[type=email]::placeholder, textarea::placeholder { color: #bbb; }

/* ── SETUP / AUTH ────────────────────────────────────── */
.setup-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 14px; padding: 28px; max-width: 500px; margin: 48px auto 0; }
.setup-logo { font-family: 'Lora', serif; font-size: 22px; color: #1a1a18; margin-bottom: 4px; text-align: center; }
.setup-logo span { color: #8B6F47; }
.setup-url-bar { display: flex; align-items: center; gap: 8px; background: #F7F6F2; border: 1.5px solid #E8E6DF; border-radius: 8px; padding: 3px 12px; margin-bottom: 8px; transition: border-color 0.15s; }
.setup-url-bar:focus-within { border-color: #8B6F47; background: #fff; }
.setup-url-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #aaa; white-space: nowrap; min-width: 72px; }
.setup-url-input { border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a18; outline: none; width: 100%; padding: 7px 0; }
.pw-gate { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #F7F6F2 0%, #EEF5EE 100%); }
.pw-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 16px; padding: 36px; width: 100%; max-width: 400px; }
.pw-logo { font-family: 'Lora', serif; font-size: 24px; color: #1a1a18; margin-bottom: 3px; }
.pw-logo span { color: #8B6F47; }
.pw-sub { font-size: 13px; color: #999; margin-bottom: 24px; }
.pw-input { width: 100%; padding: 10px 14px; border: 1.5px solid #E8E6DF; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; text-align: center; letter-spacing: 2px; margin-bottom: 10px; }
.pw-input:focus { border-color: #8B6F47; box-shadow: 0 0 0 3px rgba(139,111,71,0.08); }
.pw-error { font-size: 13px; color: #9B2C2C; margin-bottom: 8px; min-height: 18px; }

/* ── UPLOAD ──────────────────────────────────────────── */
.upload-zone { border: 1.5px dashed #C8C4BB; border-radius: 10px; padding: 32px 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: #fff; }
.upload-zone:hover, .upload-zone.drag { border-color: #8B6F47; background: #FAF8F4; }
.upload-label { font-family: 'Lora', serif; font-size: 16px; color: #1a1a18; margin-bottom: 4px; }
.upload-hint { font-size: 13px; color: #999; margin-bottom: 14px; }

/* ── TABLE ───────────────────────────────────────────── */
.tbl-wrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
.tbl th { background: #F5F3EE; padding: 7px 10px; text-align: left; font-weight: 700; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; white-space: nowrap; position: sticky; top: 0; }
.tbl td { padding: 7px 10px; border-top: 1px solid #F0EDE6; color: #333; }
.tbl tr:hover td { background: #FAF8F4; }

/* ── STATS ───────────────────────────────────────────── */
.summary-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 16px; }
.stat-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 10px; padding: 12px; text-align: center; }
.stat-num { font-family: 'Lora', serif; font-size: 26px; color: #8B6F47; margin-bottom: 1px; }
.stat-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.4px; }

/* ── COHORT ──────────────────────────────────────────── */
.cohort-chart-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.pie-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 10px; padding: 14px; }
.pie-title { font-family: 'Lora', serif; font-size: 13px; font-weight: 600; margin-bottom: 10px; color: #1a1a18; }
.pie-wrap { display: flex; align-items: center; gap: 12px; }
.pie-legend { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.pie-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #555; }
.pie-legend-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.pie-legend-val { margin-left: auto; font-weight: 700; color: #1a1a18; font-size: 11px; }
.cohort-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 8px; margin-bottom: 16px; }
.cohort-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 10px; padding: 13px 14px; cursor: pointer; transition: all 0.15s; }
.cohort-card:hover, .cohort-card.selected { border-color: #8B6F47; }
.cohort-card.selected { background: #FAF8F4; }
.cohort-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 6px; flex-shrink: 0; }
.cohort-name { font-family: 'Lora', serif; font-size: 14px; font-weight: 600; margin-bottom: 2px; display: flex; align-items: center; }
.cohort-size { font-size: 11px; color: #aaa; margin-bottom: 6px; }
.cohort-drill { background: #fff; border: 1px solid #E8E6DF; border-radius: 10px; overflow: hidden; margin-bottom: 10px; }
.cohort-drill-hdr { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid transparent; }
.cohort-drill-hdr:hover { background: #F7F6F2; }
.cohort-drill-hdr.open { border-bottom-color: #E8E6DF; }
.cohort-drill-left { display: flex; align-items: center; gap: 8px; }
.cohort-drill-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.cohort-drill-name { font-family: 'Lora', serif; font-size: 14px; font-weight: 600; }
.cohort-drill-meta { font-size: 12px; color: #999; margin-top: 1px; }
.cohort-drill-right { display: flex; align-items: center; gap: 10px; }
.cohort-drill-acv { font-family: 'Lora', serif; font-size: 15px; color: #8B6F47; }
.cohort-drill-toggle { font-size: 11px; color: #aaa; font-weight: 700; }
.cohort-drill-body { padding: 0 14px 12px; }
.cohort-member-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
.cohort-member-table th { background: #F5F3EE; padding: 5px 8px; text-align: left; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; color: #777; white-space: nowrap; }
.cohort-member-table td { padding: 6px 8px; border-top: 1px solid #F0EDE6; color: #333; }
.cohort-member-table tr:hover td { background: #FAF8F4; cursor: pointer; }

/* ── TAGS ────────────────────────────────────────────── */
.tag-row { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 5px; }
.tag { font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
.tag-ind { background: #EEF2F8; color: #3A5A8C; }
.tag-size { background: #F3EDE6; color: #7A5C30; }
.tag-src { background: #EEF5EE; color: #2E6B2E; }
.tag-out { background: #F5EEF5; color: #6B3A7A; }
.outcome-badge { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 8px; background: #F5EEF5; color: #6B3A7A; white-space: nowrap; }

/* ── ACCOUNT LIST ────────────────────────────────────── */
.account-list { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
.account-item { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 9px 12px; cursor: pointer; transition: all 0.12s; }
.account-item:hover, .account-item.selected { border-color: #1a1a18; background: #FAF8F4; }
.account-name { font-size: 15px; font-weight: 600; color: #1a1a18; }
.account-meta { font-size: 12px; color: #999; margin-top: 1px; }
.account-acv { font-size: 13px; font-weight: 700; color: #8B6F47; }

/* ── OUTCOMES ────────────────────────────────────────── */
.outcome-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; }
.outcome-tile { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.15s; }
.outcome-tile:hover, .outcome-tile.selected { border-color: #8B6F47; }
.outcome-tile.selected { background: #FAF8F4; }
.outcome-icon { font-size: 16px; margin-bottom: 4px; }
.outcome-title { font-size: 12px; font-weight: 700; margin-bottom: 1px; color: #1a1a18; }
.outcome-sub { font-size: 11px; color: #999; line-height: 1.4; }

/* ── BRIEF BLOCKS ────────────────────────────────────── */
.bb { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; overflow: hidden; margin-bottom: 10px; }
.bb-hdr { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #F7F6F2; border-bottom: 1px solid #E8E6DF; }
.bb-icon { width: 24px; height: 24px; border-radius: 6px; background: #1a1a18; display: flex; align-items: center; justify-content: center; font-family: 'Lora', serif; font-size: 12px; font-weight: 700; color: #8B6F47; flex-shrink: 0; }
.bb-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 600; color: #1a1a18; }
.bb-sub { font-size: 12px; color: #888; margin-top: 1px; }
.bb-body { padding: 12px 14px; }
.solution-item { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; }
.sol-badge { font-size: 12px; font-weight: 700; background: #F0EDE6; color: #7A5C30; border: 1px solid #D4C4A8; padding: 3px 10px; border-radius: 6px; white-space: nowrap; flex-shrink: 0; margin-top: 1px; font-family: 'Lora', serif; }
.signal-row { display: flex; gap: 7px; margin-bottom: 6px; align-items: flex-start; }
.sig-dot { width: 5px; height: 5px; border-radius: 50%; background: #8B6F47; flex-shrink: 0; margin-top: 5px; }
.contact-row { display: flex; gap: 10px; margin-bottom: 7px; background: #F7F6F2; border: 1px solid #E8E6DF; border-radius: 8px; padding: 9px 11px; align-items: flex-start; }
.contact-av { width: 28px; height: 28px; border-radius: 50%; background: #E8E6DF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #555; flex-shrink: 0; }

/* ── EDITABLE FIELDS ─────────────────────────────────── */
.ef-wrap { position: relative; }
.ef-wrap:hover .ef-hint { opacity: 1; }
.ef-hint { position: absolute; top: -14px; right: 2px; font-size: 9px; color: #8B6F47; font-weight: 700; opacity: 0; transition: opacity 0.15s; pointer-events: none; text-transform: uppercase; letter-spacing: 0.4px; }
.ef-display { font-size: 14px; color: #333; line-height: 1.65; padding: 5px 7px; border-radius: 6px; border: 1px solid transparent; transition: all 0.12s; min-height: 28px; cursor: text; }
.ef-display:hover { border-color: #E8E6DF; background: #F7F6F2; }
.ef-empty { color: #bbb; font-style: italic; }
.ef-input { font-size: 14px; color: #333; line-height: 1.65; padding: 5px 7px; border-radius: 6px; border: 1.5px solid #8B6F47; background: #fff; width: 100%; font-family: 'DM Sans', sans-serif; outline: none; box-shadow: 0 0 0 3px rgba(139,111,71,0.08); }
.ef-input-multi { min-height: 56px; resize: vertical; }

/* ── LOADING ─────────────────────────────────────────── */
.load-box { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 24px; margin-bottom: 12px; }
.load-status { font-size: 13px; color: #8B6F47; font-weight: 600; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
.load-spin { width: 14px; height: 14px; border: 2px solid #E8E6DF; border-top-color: #8B6F47; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.pulse-wrap { display: flex; flex-direction: column; gap: 6px; }
.pulse-line { height: 9px; background: #EDEBE6; border-radius: 4px; animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%{opacity:1}50%{opacity:0.35}100%{opacity:1} }

/* ── IN-CALL ─────────────────────────────────────────── */
.incall-wrap { max-width: 940px; margin: 0 auto; padding: 20px 24px 60px; width: 100%; }
.incall-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
.incall-title { font-family: 'Lora', serif; font-size: 18px; font-weight: 600; color: #1a1a18; }
.incall-meta { font-size: 12px; color: #999; margin-top: 1px; }
.river-pills { display: flex; gap: 6px; margin-bottom: 18px; flex-wrap: wrap; }
.river-pill { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 24px; border: 1.5px solid #E8E6DF; background: #fff; cursor: pointer; font-size: 12px; font-weight: 700; color: #999; transition: all 0.13s; white-space: nowrap; }
.river-pill:hover { border-color: #8B6F47; color: #8B6F47; }
.river-pill.active { background: #1a1a18; border-color: #1a1a18; color: #fff; }
.river-pill.filled { border-color: #2E6B2E; color: #2E6B2E; }
.river-pill.filled.active { background: #2E6B2E; border-color: #2E6B2E; color: #fff; }
.river-pill-letter { font-family: 'Lora', serif; font-size: 13px; font-weight: 700; }
.river-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: #2E6B2E; flex-shrink: 0; }
.stage-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 20px; margin-bottom: 12px; }
.stage-card-hdr { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.stage-letter-big { width: 40px; height: 40px; border-radius: 50%; background: #1a1a18; color: #8B6F47; font-family: 'Lora', serif; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stage-name { font-family: 'Lora', serif; font-size: 17px; font-weight: 600; color: #1a1a18; }
.stage-sub { font-size: 12px; color: #777; margin-top: 1px; }
.gate-block { margin-bottom: 16px; }
.gate-question { font-size: 14px; font-weight: 700; color: #1a1a18; margin-bottom: 10px; line-height: 1.4; }
.gate-choices { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.gate-choice { padding: 6px 13px; border-radius: 20px; border: 1.5px solid #E8E6DF; background: #F7F6F2; cursor: pointer; font-size: 12px; font-weight: 600; color: #555; transition: all 0.13s; font-family: 'DM Sans', sans-serif; }
.gate-choice:hover { border-color: #8B6F47; color: #8B6F47; background: #FAF8F4; }
.gate-choice.selected { background: #1a1a18; border-color: #1a1a18; color: #fff; }
.gate-note { width: 100%; padding: 8px 11px; border: 1px solid #E8E6DF; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #333; background: #F7F6F2; resize: vertical; min-height: 54px; outline: none; transition: border-color 0.13s; }
.gate-note:focus { border-color: #8B6F47; background: #fff; }
.gate-note-lbl { font-size: 10px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.dq-block { margin-bottom: 12px; background: #F7F6F2; border-radius: 10px; padding: 13px; border-left: 3px solid #8B6F47; }
.dq-framework { font-size: 10px; font-weight: 700; color: #8B6F47; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
.dq-question { font-size: 13px; font-weight: 600; color: #1a1a18; margin-bottom: 8px; line-height: 1.5; font-style: italic; }
.dq-note { width: 100%; padding: 7px 10px; border: 1px solid #E8E6DF; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; background: #fff; resize: vertical; min-height: 48px; outline: none; }
.dq-note:focus { border-color: #8B6F47; }
.incall-sidebar { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 14px; }
.conf-bar-wrap { margin-bottom: 14px; }
.conf-pct { font-family: 'Lora', serif; font-size: 26px; font-weight: 600; line-height: 1; }
.incall-grid { display: grid; grid-template-columns: 1fr 290px; gap: 16px; align-items: start; }
@media(max-width: 800px){ .incall-grid { grid-template-columns: 1fr; } }
.call-layout { display: flex; flex: 1; height: calc(100vh - 52px); overflow: hidden; }
.call-left { width: 55%; border-right: 1px solid #E8E6DF; display: flex; flex-direction: column; background: #fff; overflow: hidden; }
.call-right { width: 45%; display: flex; flex-direction: column; background: #F7F6F2; overflow: hidden; }
.panel-hdr { padding: 10px 16px; border-bottom: 1px solid #E8E6DF; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: #fff; }
.panel-title { font-family: 'Lora', serif; font-size: 14px; font-weight: 600; }
.panel-body { flex: 1; overflow-y: auto; padding: 14px 16px; }
.river-nav { display: flex; overflow-x: auto; border-bottom: 1px solid #E8E6DF; background: #F7F6F2; flex-shrink: 0; }
.r-tab { padding: 8px 12px; font-size: 11px; font-weight: 700; cursor: pointer; color: #bbb; border-bottom: 2px solid transparent; white-space: nowrap; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.13s; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 4px; }
.r-tab:hover { color: #1a1a18; }
.r-tab.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #fff; }
.fill-dot { width: 5px; height: 5px; border-radius: 50%; background: #2E6B2E; flex-shrink: 0; }
.gate { background: #F7F6F2; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px; margin-bottom: 7px; }
.gate.answered { border-color: #2E6B2E; background: #F2FAF2; }
.gate-q { font-size: 13px; font-weight: 600; color: #1a1a18; margin-bottom: 7px; line-height: 1.4; }
.gate-opts { display: flex; flex-direction: column; gap: 4px; }
.gate-opt { display: flex; gap: 8px; align-items: center; padding: 6px 10px; border-radius: 7px; border: 1px solid #E8E6DF; background: #fff; cursor: pointer; transition: all 0.13s; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #333; text-align: left; }
.gate-opt:hover { border-color: #8B6F47; background: #FAF8F4; }
.gate-ans { font-size: 12px; color: #2E6B2E; font-weight: 600; margin-top: 4px; display: flex; align-items: center; gap: 5px; }
.conf-wrap { margin-bottom: 12px; }
.conf-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.conf-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.conf-score { font-family: 'Lora', serif; font-size: 20px; font-weight: 600; }
.conf-track { height: 4px; background: #E8E6DF; border-radius: 2px; overflow: hidden; }
.conf-fill { height: 100%; border-radius: 2px; transition: width 0.5s, background 0.5s; }
.right-tabs { display: flex; border-bottom: 1px solid #E8E6DF; background: #fff; flex-shrink: 0; }
.rt { padding: 8px 12px; font-size: 11px; font-weight: 700; cursor: pointer; color: #999; border-bottom: 2px solid transparent; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.13s; white-space: nowrap; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.4px; }
.rt:hover { color: #1a1a18; }
.rt.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #F7F6F2; }
.talk-box { background: #F7F6F2; border-left: 3px solid #8B6F47; border-radius: 0 7px 7px 0; padding: 9px 12px; margin-bottom: 8px; }
.talk-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 3px; }
.talk-txt { font-size: 13px; color: #555; line-height: 1.6; font-style: italic; }
.obj-item { border: 1px solid #E8E6DF; border-radius: 7px; overflow: hidden; background: #fff; margin-bottom: 5px; }
.obj-btn { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; cursor: pointer; font-size: 13px; font-weight: 600; width: 100%; text-align: left; background: none; border: none; font-family: 'DM Sans', sans-serif; color: #1a1a18; }
.obj-ans { padding: 7px 10px 9px; font-size: 13px; color: #555; line-height: 1.5; font-style: italic; border-top: 1px solid #F0EDE6; }
.hyp-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 7px; padding: 9px 11px; margin-bottom: 5px; cursor: pointer; transition: border-color 0.13s; }
.hyp-card:hover { border-color: #8B6F47; }
.hyp-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 2px; }
.hyp-txt { font-size: 13px; color: #333; line-height: 1.5; }

/* ── POST-CALL ───────────────────────────────────────── */
.post-sec { margin-bottom: 16px; }
.post-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; }
.post-content { background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 12px; font-size: 14px; color: #333; line-height: 1.65; white-space: pre-wrap; }
.copy-btn { font-size: 11px; color: #8B6F47; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; font-weight: 700; padding: 0; }
.copy-btn:hover { text-decoration: underline; }
.route-card { border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; border: 1.5px solid; }
.route-fast { background: #EEF5EE; border-color: #2E6B2E; }
.route-nurture { background: #FEF3E2; border-color: #BA7517; }
.route-disq { background: #FDE8E8; border-color: #9B2C2C; }
.route-lbl { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
.route-fast .route-lbl { color: #2E6B2E; }
.route-nurture .route-lbl { color: #92540A; }
.route-disq .route-lbl { color: #9B2C2C; }
.route-title { font-family: 'Lora', serif; font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.route-desc { font-size: 13px; color: #555; line-height: 1.5; }

/* ── MISC ────────────────────────────────────────────── */
.notice { background: #F7F6F2; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 13px; font-size: 13px; color: #666; line-height: 1.6; margin-bottom: 12px; }
.notice strong { color: #1a1a18; }
.divider { height: 1px; background: #E8E6DF; margin: 14px 0; }
.r-icon { width: 22px; height: 22px; border-radius: 5px; background: #1a1a18; display: flex; align-items: center; justify-content: center; font-family: 'Lora', serif; font-size: 12px; font-weight: 700; color: #8B6F47; flex-shrink: 0; }
.doc-upload-zone { border: 1.5px dashed #C8C4BB; border-radius: 8px; padding: 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.15s; background: #fff; flex-wrap: wrap; }
.doc-upload-zone:hover, .doc-upload-zone.drag { border-color: #8B6F47; background: #FAF8F4; }
.doc-upload-icon { width: 30px; height: 30px; border-radius: 7px; background: #F0EDE6; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
.doc-upload-text { flex: 1; min-width: 140px; }
.doc-upload-title { font-size: 13px; font-weight: 600; color: #1a1a18; margin-bottom: 1px; }
.doc-upload-hint { font-size: 11px; color: #aaa; }
.doc-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.doc-chip { display: inline-flex; align-items: center; gap: 5px; background: #1a1a18; color: #C8A87A; padding: 3px 9px 3px 7px; border-radius: 20px; font-size: 11px; font-weight: 700; max-width: 200px; }
.doc-chip-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.doc-chip-x { cursor: pointer; color: #777; font-size: 12px; line-height: 1; flex-shrink: 0; }
.doc-chip-x:hover { color: #fff; }
.doc-chip-label { font-size: 9px; background: #333; color: #8B6F47; padding: 1px 4px; border-radius: 8px; white-space: nowrap; }
.session-doc-chip { display: inline-flex; align-items: center; gap: 4px; background: #F0EDE6; color: #7A5C30; padding: 2px 7px; border-radius: 10px; font-size: 11px; font-weight: 700; }
.prod-entry { display: flex; gap: 10px; padding: 9px 11px; background: #F7F6F2; border: 1px solid #E8E6DF; border-radius: 8px; margin-bottom: 6px; align-items: flex-start; }
.prod-num { width: 20px; height: 20px; border-radius: 50%; background: #1a1a18; color: #8B6F47; font-family: 'Lora', serif; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.prod-fields { flex: 1; display: flex; flex-direction: column; gap: 5px; }
.prod-name-input { font-size: 13px; font-weight: 600; padding: 5px 9px; border: 1px solid #E8E6DF; border-radius: 6px; background: #fff; font-family: 'DM Sans', sans-serif; color: #1a1a18; outline: none; }
.prod-name-input:focus { border-color: #8B6F47; }
.prod-desc-input { font-size: 12px; padding: 5px 9px; border: 1px solid #E8E6DF; border-radius: 6px; background: #fff; font-family: 'DM Sans', sans-serif; color: #555; outline: none; resize: vertical; min-height: 44px; }
.prod-desc-input:focus { border-color: #8B6F47; }
.prod-remove { font-size: 13px; color: #ccc; cursor: pointer; background: none; border: none; padding: 2px; line-height: 1; }
.prod-remove:hover { color: #9B2C2C; }
.prod-chip { display: inline-flex; align-items: center; gap: 4px; background: #F0EDE6; color: #7A5C30; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; margin: 2px; }
.prod-chip-dot { width: 4px; height: 4px; border-radius: 50%; background: #8B6F47; flex-shrink: 0; }

/* ── PRINT ───────────────────────────────────────────── */
@media print {
  @page { margin: 16mm 14mm; size: A4; }
  body { background: #fff !important; font-size: 12px !important; }
  .header, .session-bar, .footer, .actions-row, .incall-header, button, .btn, .river-pills, .stepper, [class*="load-"], .load-box { display: none !important; }
  .page { max-width: 100% !important; padding: 0 !important; }
  .bb { break-inside: avoid; border: 1px solid #ddd !important; margin-bottom: 10px !important; }
  .bb-hdr { background: #f5f5f5 !important; }
  .contact-row { break-inside: avoid; }
  .card { break-inside: avoid; }
  .incall-wrap { padding: 0 !important; }
  .incall-grid { grid-template-columns: 1fr !important; }
  .incall-sidebar { display: none !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
`;

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const COHORT_COLORS = ["#8B6F47","#4A7A9B","#6B8E6B","#9B6B8E","#7A7A4A"];

// ── UNIVERSAL BUSINESS IMPERATIVES ─────────────────────────────────────────
// Every company — regardless of industry, size, or stage — is always working on these.
// Use these to anchor discovery, solution mapping, and hypothesis framing.
const OUTCOMES = [
  // ── The Six Universal Imperatives ──
  {id:"grow",        icon:"📈", title:"Grow",                    sub:"Revenue, new logos, market share, pipeline — the universal mandate"},
  {id:"expand",      icon:"🌐", title:"Expand",                  sub:"Existing customers, new geos, new segments, platform adoption"},
  {id:"comply",      icon:"⚖️", title:"Stay Compliant",          sub:"Regulatory mandates, audit readiness, risk reduction, legal exposure"},
  {id:"fraud",       icon:"🔒", title:"Reduce Fraud & Risk",     sub:"Financial exposure, trust protection, data integrity, brand safety"},
  {id:"investors",   icon:"💼", title:"Appease Investors",       sub:"IRR, EBITDA, multiples, board narrative, PE/VC reporting"},
  {id:"cx",          icon:"❤️", title:"Make Customers Happy",    sub:"NPS, CSAT, retention, loyalty, churn reduction, customer lifetime value"},
  // ── Operational & Strategic ──
  {id:"efficiency",  icon:"↻",  title:"Operational Efficiency",  sub:"Automation, cost reduction, process improvement, headcount leverage"},
  {id:"workforce",   icon:"✦",  title:"Workforce & Talent",      sub:"HR ops, engagement, retention, performance management"},
  {id:"ai",          icon:"◇",  title:"Data & AI Adoption",      sub:"Analytics, AI tooling, automation, insight generation"},
  {id:"brand",       icon:"☆",  title:"Brand & Marketing",       sub:"Awareness, loyalty, campaign performance, demand generation"},
  {id:"cost",        icon:"-",  title:"Cost Reduction",          sub:"Overhead, vendor consolidation, margin improvement"},
  {id:"innovation",  icon:"◆",  title:"Innovation & Product",    sub:"New product lines, R&D, speed to market, competitive differentiation"},
  {id:"transform",   icon:"◇",  title:"Strategic Transformation",sub:"Org change, M&A integration, modernization, digital transformation"},
];

// The 6 universal imperatives every company shares — used for pre-selecting baseline outcomes
const UNIVERSAL_IMPERATIVES = ["grow","expand","comply","fraud","investors","cx"];

const SAMPLE_ROWS = [
  // ── Fortune 1000 / Public Enterprise ─────────────────────────────────────
  {company:"Nike Inc.",industry:"Consumer Goods / Apparel",acv:"280000",lead_source:"Outbound",outcome:"Digital transformation",company_url:"nike.com",employees:"~80,000",publicPrivate:"Public (NYSE: NKE)"},
  {company:"Target Corporation",industry:"Retail",acv:"320000",lead_source:"Partner",outcome:"Operational efficiency",company_url:"target.com",employees:"~400,000",publicPrivate:"Public (NYSE: TGT)"},
  {company:"Marriott International",industry:"Hospitality",acv:"240000",lead_source:"Conference",outcome:"Customer experience",company_url:"marriott.com",employees:"~120,000",publicPrivate:"Public (NASDAQ: MAR)"},
  {company:"Humana Inc.",industry:"Health Insurance",acv:"350000",lead_source:"Referral",outcome:"Member engagement",company_url:"humana.com",employees:"~60,000",publicPrivate:"Public (NYSE: HUM)"},
  {company:"Aflac",industry:"Supplemental Insurance",acv:"190000",lead_source:"Outbound",outcome:"Digital claims",company_url:"aflac.com",employees:"~10,000",publicPrivate:"Public (NYSE: AFL)"},
  // ── Large Private Companies ───────────────────────────────────────────────
  {company:"Cargill",industry:"Agriculture / Food",acv:"420000",lead_source:"Referral",outcome:"Supply chain efficiency",company_url:"cargill.com",employees:"~160,000",publicPrivate:"Private"},
  {company:"Publix Super Markets",industry:"Grocery Retail",acv:"260000",lead_source:"Partner",outcome:"Workforce productivity",company_url:"publix.com",employees:"~240,000",publicPrivate:"Private (Employee-owned)"},
  {company:"Fidelity Investments",industry:"Financial Services",acv:"310000",lead_source:"Conference",outcome:"Advisor enablement",company_url:"fidelity.com",employees:"~70,000",publicPrivate:"Private"},
  {company:"USAA",industry:"Insurance / Financial Services",acv:"380000",lead_source:"Referral",outcome:"Member retention",company_url:"usaa.com",employees:"~36,000",publicPrivate:"Private (Mutual)"},
  {company:"State Farm Insurance",industry:"Insurance",acv:"290000",lead_source:"Outbound",outcome:"Agent productivity",company_url:"statefarm.com",employees:"~54,000",publicPrivate:"Private (Mutual)"},
  // ── PE-Backed ─────────────────────────────────────────────────────────────
  {company:"AssuredPartners",industry:"Insurance Brokerage",acv:"95000",lead_source:"Partner",outcome:"Agency consolidation",company_url:"assuredpartners.com",employees:"~9,000",publicPrivate:"PE-Backed (GTCR)"},
  {company:"Acrisure",industry:"Insurance Agency",acv:"75000",lead_source:"Referral",outcome:"Tech-enabled growth",company_url:"acrisure.com",employees:"~17,000",publicPrivate:"PE-Backed"},
  {company:"LifeStance Health",industry:"Behavioral Health",acv:"85000",lead_source:"Outbound",outcome:"Clinical ops",company_url:"lifestance.com",employees:"~8,000",publicPrivate:"Public (NASDAQ: LFST)"},
  {company:"Confluent Medical",industry:"Medical Devices / Manufacturing",acv:"65000",lead_source:"Conference",outcome:"Compliance automation",company_url:"confluentmedical.com",employees:"~2,500",publicPrivate:"PE-Backed"},
  // ── Late-Stage / Pre-IPO Startups ─────────────────────────────────────────
  {company:"Rippling",industry:"HR / Workforce Management SaaS",acv:"55000",lead_source:"Outbound",outcome:"GTM expansion",company_url:"rippling.com",employees:"~3,000",publicPrivate:"VC-Backed (Series F)"},
  {company:"Brex",industry:"Fintech / Corporate Cards",acv:"48000",lead_source:"Referral",outcome:"Revenue acceleration",company_url:"brex.com",employees:"~1,200",publicPrivate:"VC-Backed (Series D)"},
  {company:"Plaid",industry:"Fintech / Open Banking",acv:"72000",lead_source:"Partner",outcome:"Partnership expansion",company_url:"plaid.com",employees:"~900",publicPrivate:"VC-Backed (Series D)"},
  {company:"Carta",industry:"Equity Management SaaS",acv:"60000",lead_source:"Conference",outcome:"Enterprise growth",company_url:"carta.com",employees:"~1,800",publicPrivate:"VC-Backed (Series G)"},
  {company:"Deel",industry:"Global Payroll / HR SaaS",acv:"90000",lead_source:"Outbound",outcome:"International expansion",company_url:"deel.com",employees:"~4,000",publicPrivate:"VC-Backed (Series D)"},
  // ── YC Alumni (Operating at Scale) ────────────────────────────────────────
  {company:"Gusto",industry:"SMB Payroll / HR",acv:"38000",lead_source:"Partner",outcome:"Partner channel growth",company_url:"gusto.com",employees:"~2,500",publicPrivate:"VC-Backed (YC W12)"},
  {company:"Airbase",industry:"Spend Management SaaS",acv:"42000",lead_source:"Referral",outcome:"Enterprise upmarket",company_url:"airbase.com",employees:"~400",publicPrivate:"VC-Backed (YC W18)"},
  {company:"Ramp",industry:"Fintech / Expense Management",acv:"50000",lead_source:"Outbound",outcome:"Expansion revenue",company_url:"ramp.com",employees:"~900",publicPrivate:"VC-Backed (YC S19)"},
  // ── Regional / Mid-Market ─────────────────────────────────────────────────
  {company:"First Business Financial",industry:"Regional Banking",acv:"140000",lead_source:"Referral",outcome:"Commercial lending growth",company_url:"firstbusiness.com",employees:"~700",publicPrivate:"Public (NASDAQ: FBIZ)"},
  {company:"Marcum LLP",industry:"Accounting / Advisory",acv:"70000",lead_source:"Conference",outcome:"Client portal modernization",company_url:"marcumllp.com",employees:"~4,500",publicPrivate:"Private"},
  {company:"Inland Empire Health Plan",industry:"Managed Care / Health Insurance",acv:"220000",lead_source:"Outbound",outcome:"Member services",company_url:"iehp.org",employees:"~3,000",publicPrivate:"Private (Non-profit)"},
];
const RIVER_STAGES = [
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
function buildCohorts(rows,mapping){
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
function confColor(s){return s>=75?"#2E6B2E":s>=50?"#BA7517":"#9B2C2C";}

// ── API CONSTANTS ─────────────────────────────────────────────────────────────
const API_URL = "https://api.anthropic.com/v1/messages";
const API_MODEL = "claude-sonnet-4-20250514";
const getHeaders = () => ({
  "Content-Type":"application/json",
  "x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,
  "anthropic-version":"2023-06-01",
  "anthropic-dangerous-direct-browser-access":"true",
});

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
async function generateBrief(member, sellerUrl, sellerDocs, products, selectedCohort, selectedOutcomes, productPageUrl, onStatus, productUrls=[]){
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
    `SIGNAL HEURISTICS: Funding <12 months = 18-month buying window; PE acquisition <18 months = cost mandate + 60-90 day budget cycle; hiring "Digital Transformation" = Early Majority; "Innovation/R&D" = Early Adopter; Glassdoor <3.5 = operational pain present.\n`+`SELLER STAGE AWARENESS: Seller is unknown stage. `+`SCENARIO INTELLIGENCE (6M+ permutations, 4,634 YC companies × 1,156 targets): `+`If target is in THE WALL (Automotive avg 5.9%, Aerospace/Defense 5.8%, Telecom 6.1%, Energy 11-13%, Mass Retail 13.6%, Tier 1 Banks 12.6%): flag as near-impossible for direct startup sale regardless of stage. `+`If target is Large Private (Insurance, Professional Services, Tech): highlight as TIER 1 — avg 63-65% fit, fastest deal cycles, most underserved by startups. `+`If target is Regional Bank (not JPM/BAC/WF): strong opportunity — 59.5% avg fit, 85 targets in Fortune 1000, widely ignored by YC-stage companies. `+`If seller is Seed/Series A: avg 23-33% fit against all Fortune 1000 — recommend partner/channel motion. `+`If seller is Series D+: 35% of Fortune 1000 scenarios are strong fit — full enterprise motion viable. `+`CPG split: HPC/Beauty (P&G, KC) = 61.9% avg — YES; Food/Beverage (PepsiCo, Kraft) = 49.0% — departmental only. `+`If target has high union exposure (Automotive, Aviation, Manufacturing): scope to knowledge workers explicitly.\n`+
    `SELLER CONTEXT (reference only):\n${sellerCtx}${prodCtx}\n`+
    `DEAL: ${dealCtx}\n\n`;

  onStatus("Researching "+co+"...");

  // ── 5 MICRO-CALLS fire simultaneously, each with a tiny schema ───────────
  // User sees the overview card the moment the fastest resolves (~2s)

  // MICRO 1: Company overview card — smallest schema, shows first
  const p1 = callAI(base+
    `Return ONLY raw JSON (start with {) for the company overview:\n`+
    `{"companySnapshot":"3-4 sentences: what ${co} does, revenue scale, employees, HQ, strategic direction",`+
    `"revenue":"e.g. $2.4B (FY2024)","publicPrivate":"e.g. Public (NYSE:MCD)","employeeCount":"e.g. ~200,000",`+
    `"headquarters":"City, State","founded":"Year","website":"domain.com","linkedIn":"linkedin.com/company/name",`+
    `"fundingProfile":"Ownership: PE firm + year acquired, or Series + total raised + lead investor, or Public exchange+ticker",`+
    `"competitors":["Competitor 1","Competitor 2","Competitor 3"],`+
    `"watchOuts":["PROCUREMENT RISK (from 6M-permutation analysis): The Wall industries are Automotive/Mfg (5.9% avg fit), Aerospace Defense Prime (5.8%), Telecom (6.1%), Energy Oil/Gas (11.3%), Energy Utilities (13.4%), Mass Market Retail Walmart/Target (13.6%), Tier 1 Banks JPM/BAC/WF (12.6%) — 100% poor-fit rate across all startup stages. Flag if this target is in these categories.","INCUMBENT RISK: which Oracle/SAP/Workday/Amex/Salesforce relationship are we displacing or landing adjacent to? Adjacent is almost always the right first motion. Series A-B cannot displace incumbents.","STAGE CREDIBILITY: Seed/Series A selling to >50K employee companies = avg 23-33% fit across all scenarios. Series C+ required for meaningful enterprise traction. PE-acquired seller has trust advantage."]}`
  );

  // MICRO 2: Executives — fires simultaneously, merges when ready
  const p2 = callAI(base+
    `Return ONLY raw JSON (start with {) for the 3 key executives at ${co}:\n`+
    `{"keyExecutives":[`+
    `{"name":"REQUIRED real current CEO name","title":"CEO","initials":"XX","background":"Prior role in 1 sentence","angle":"Board mandate and what they are measured on. 2 sentences."},`+
    `{"name":"REQUIRED real current CHRO or CPO name","title":"exact title","initials":"XX","background":"HR/people focus 1 sentence","angle":"What winning looks like for them personally. 2 sentences."},`+
    `{"name":"REQUIRED real current CFO or COO name","title":"exact title","initials":"XX","background":"Financial/ops focus 1 sentence","angle":"How they evaluate spend decisions. 2 sentences."}],`+
    `"sellerSnapshot":"2 sentences on seller most relevant offerings for ${co}"}`
  );

  // MICRO 3: Strategy + opening angle — shows after execs
  const p3 = callAI(base+
    `Return ONLY raw JSON (start with {) for strategy and seller angle:\n`+
    `{"strategicTheme":"2-3 sentences on ${co} current strategic direction and priorities",`+
    `"sellerOpportunity":"2-3 sentences: why ${sellerUrl} is well-positioned right now for ${co} — the why-you-why-now",`+
    `"openingAngle":"1-2 sharp sentences referencing something real about ${co}. Reframe an assumption. Sounds human not scripted.",`+
    `"publicSentiment":{`+`"onlineSentiment":"2-3 sentences synthesizing what customers, employees, and media say about ${co} right now. Be specific — name sources and tone.",`+`"glassdoorRating":"Glassdoor employer rating as a number e.g. 3.8 — or empty if unknown",`+`"g2Rating":"G2 product rating as a number e.g. 4.2 out of 5 — or empty if not a software company",`+`"npsSignal":"Estimated NPS signal: if you know ${co} publishes NPS or CSAT data, cite it. Otherwise describe customer loyalty signals (high churn, vocal advocates, renewal rates mentioned in press)",`+`"trustpilotRating":"Trustpilot score as a number if known — or empty",`+`"employeeScore":"Glassdoor CEO approval % or Indeed rating if known — signals culture and operational health",`+`"standoutReview":{"text":"Most revealing customer or employee quote or paraphrase — something a seller would want to know","source":"G2 / Glassdoor / Trustpilot / analyst / press","sentiment":"positive or negative"},`+`"salesAngle":"1 sentence: how the seller should use this sentiment context in the discovery conversation"}}`
  );

  // MICRO 4: Solution mapping + contacts — shows after strategy
  const p4 = callAI(base+
    `Return ONLY raw JSON (start with {) for solution fit and contacts:\n`+
    `Apply Dunford (Obviously Awesome) positioning and Osterwalder (Value Proposition Canvas) to map seller solutions to ${co}.\n`+`ASSUME ${co} universally wants to: grow revenue, expand, stay compliant, reduce fraud/risk, satisfy investors, and make customers happy.\n`+`For each solution: (1) which universal imperative does it serve? (2) what job does it do? (3) what pain does it relieve? (4) what gain does it create?\n`+`{"solutionMapping":[`+
    `{"product":"Specific ${sellerUrl} offering","fit":"Job-to-be-done it performs (Osterwalder) → specific pain it relieves → gain it creates for ${co}. Grounded in a real signal."},`+
    `{"product":"Second offering if applicable","fit":""},`+
    `{"product":"Third offering if applicable","fit":""}],`+
    `"caseStudies":[{"title":"Relevant case study or named customer","customer":"","relevance":"Why relevant to ${co}"},{"title":"","customer":"","relevance":""}],`+
    `"keyContacts":[{"name":"VP/Director NOT C-suite — real name if known","title":"Full title","initials":"XX","angle":"Why they feel this pain daily and how to reach them"},{"name":"","title":"","initials":"","angle":""}],`+
    `"techStack":{"crm":"if known","erp":"if known","hris":"if known","marketing":"if known","payments":"if known","analytics":"if known","infrastructure":"if known","other":[]},`+
    `"processMaturity":{"dmiacStage":"Define|Measure|Analyze|Improve|Control","maturityNote":"1 sentence: where they are and what it means for seller entry","processGaps":["Gap 1","Gap 2"]}}`
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
          tools:[{type:"web_search_20250305",name:"web_search",max_uses:4}],
          messages:[{role:"user",content:prompt},{role:"assistant",content:"{"}],
        }),
      });
      const d=await r.json();
      if(d.error) return null;
      const raw=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      return safeParseJSON(raw.startsWith("{")?raw:"{"+raw);
    }catch(e){console.warn("Live search failed:",e.message);return null;}
  })();

  // ── Await Micro 1 first — show overview card immediately ─────────────────
  const r1 = await p1;
  const brief = (r1&&typeof r1==="object")
    ? r1
    : {...BLANK_BRIEF,companySnapshot:co+" — "+member.ind+". Edit fields below.",_error:"Brief generation failed — try Regenerate."};

  onStatus("");

  // ── Return brief + a promise that merges the rest as they complete ────────
  const mergePromise = (async()=>{
    // Merge each micro-result as it resolves — user sees sections fill in
    const results = await Promise.allSettled([p2,p3,p4,p5]);
    return (prev)=>{
      if(!prev) return prev;
      const next={...prev};

      // Micro 2: executives
      const r2 = results[0].status==="fulfilled"?results[0].value:null;
      if(r2?.keyExecutives?.length) next.keyExecutives=r2.keyExecutives;
      if(r2?.sellerSnapshot) next.sellerSnapshot=r2.sellerSnapshot;

      // Micro 3: strategy
      const r3 = results[1].status==="fulfilled"?results[1].value:null;
      if(r3?.strategicTheme) next.strategicTheme=r3.strategicTheme;
      if(r3?.sellerOpportunity) next.sellerOpportunity=r3.sellerOpportunity;
      if(r3?.openingAngle) next.openingAngle=r3.openingAngle;
      if(r3?.publicSentiment?.onlineSentiment||r3?.publicSentiment?.glassdoorRating){
        next.publicSentiment={...next.publicSentiment,...r3.publicSentiment};
      }

      // Micro 4: solutions + contacts
      const r4 = results[2].status==="fulfilled"?results[2].value:null;
      if(r4?.solutionMapping?.some(s=>s?.product)) next.solutionMapping=r4.solutionMapping;
      if(r4?.caseStudies?.some(c=>c?.title)) next.caseStudies=r4.caseStudies;
      if(r4?.keyContacts?.some(c=>c?.name||c?.title)) next.keyContacts=r4.keyContacts;
      if(r4?.techStack) next.techStack=r4.techStack;
      if(r4?.processMaturity?.dmiacStage) next.processMaturity=r4.processMaturity;

      // Micro 5: live search
      const r5 = results[3].status==="fulfilled"?results[3].value:null;
      if(r5){
        const errorWords=["unable","cannot","search failed","not available","web search"];
        const cleanHL=(r5.recentHeadlines||[]).filter(h=>{
          const t=(h?.headline||"").toLowerCase();
          return h?.headline&&h.headline.length>10&&!errorWords.some(w=>t.includes(w));
        });
        if(cleanHL.length) next.recentHeadlines=cleanHL;
        if(r5.openRoles?.summary) next.openRoles=r5.openRoles;
        if(r5.recentSignals?.some(s=>s)) next.recentSignals=r5.recentSignals;
        if(r5.growthSignals?.some(s=>s)) next.growthSignals=r5.growthSignals;
        const snapOk=r5.companySnapshot?.length>50&&!errorWords.some(w=>r5.companySnapshot.toLowerCase().includes(w));
        if(snapOk) next.companySnapshot=r5.companySnapshot;
        // Merge workforce, culture, incumbents from live search
        if(r5.workforceProfile) next.workforceProfile=r5.workforceProfile;
        if(r5.cultureProfile) next.cultureProfile=r5.cultureProfile;
        if(r5.incumbentVendors) next.incumbentVendors=r5.incumbentVendors;
        // Merge live sentiment scores — enrich what training knowledge returned
        if(r5.sentimentScores){
          const ss=r5.sentimentScores;
          next.publicSentiment={...next.publicSentiment,
            glassdoorRating:ss.glassdoorRating||next.publicSentiment?.glassdoorRating||"",
            g2Rating:ss.g2Rating||"",
            trustpilotRating:ss.trustpilotRating||"",
            npsSignal:ss.npsSignal||"",
            employeeScore:ss.employeeScore||"",
            standoutReview:ss.standoutReview?.text?ss.standoutReview:next.publicSentiment?.standoutReview||{},
          };
        }
      }

      return next;
    };
  })();

  return {_brief:brief, _phase2Promise:mergePromise};
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
      <div style={{height:3,background:"#F0EDE6",borderRadius:2,overflow:"hidden",margin:"14px 0"}}>
        <div style={{height:"100%",background:"linear-gradient(90deg,#8B6F47,#1B3A6B,#2E6B2E,#8B6F47)",backgroundSize:"300% 100%",animation:"shimmer 2.5s linear infinite",borderRadius:2}}/>
      </div>
      <div style={{
        fontSize:12,color:"#8B6F47",textAlign:"center",fontStyle:"italic",
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

// ── PASSWORD GATE ─────────────────────────────────────────────────────────────

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

  if(verifying) return(
    <div className="pw-gate"><style>{FONTS}</style>
    <div className="pw-card" style={{textAlign:"center"}}>
      <div style={{fontSize:32,marginBottom:12}}>📬</div>
      <div className="pw-logo">Check your email</div>
      <div className="pw-sub" style={{marginBottom:16}}>We sent a verification link to <strong>{email}</strong></div>
      <div style={{fontSize:13,color:"#777",lineHeight:1.6,marginBottom:20}}>Click the link in the email, then come back and sign in.</div>
      <button className="btn btn-secondary" onClick={()=>{setVerifying(false);setMode("signin");}}>← Sign In</button>
    </div></div>
  );

  const inp={width:"100%",padding:"11px 14px",borderRadius:8,border:"1.5px solid #E8E6DF",fontFamily:"DM Sans,sans-serif",fontSize:14,color:"#1a1a18",boxSizing:"border-box",outline:"none",marginBottom:10,display:"block"};
  return(
    <div className="pw-gate"><style>{FONTS}</style>
    <div className="pw-card" style={{maxWidth:400}}>
      <div className="pw-logo">Cambrian <span>Catalyst</span></div>
      <div className="pw-sub">Revenue Playbook Engine · Private Beta</div>
      <div style={{display:"flex",background:"#F0EDE6",borderRadius:10,padding:3,marginBottom:20,marginTop:16}}>
        {[["signup","Create Account"],["signin","Sign In"]].map(([m,label])=>(
          <button key={m} onClick={()=>{setMode(m);setErr("");}}
            style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,
              background:mode===m?"#fff":"transparent",color:mode===m?"#1a1a18":"#999",
              boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.10)":"none",transition:"all 0.15s"}}>
            {label}
          </button>
        ))}
      </div>
      {mode==="signup"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
          <input style={inp} placeholder="First name" value={first} onChange={e=>setFirst(e.target.value)} autoFocus/>
          <input style={inp} placeholder="Last name" value={last} onChange={e=>setLast(e.target.value)}/>
        </div>
      )}
      <input style={inp} type="email" placeholder="Email (Gmail or work)" value={email} onChange={e=>setEmail(e.target.value)} autoFocus={mode==="signin"} onKeyDown={e=>e.key==="Enter"&&pw&&submit()}/>
      <input style={inp} type="password" placeholder={mode==="signup"?"Password (8+ characters)":"Password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
      {err&&<div style={{fontSize:12,color:"#9B2C2C",marginBottom:10,padding:"8px 10px",background:"#FDE8E8",borderRadius:6}}>{err}</div>}
      <button className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center",opacity:loading?0.7:1}}
        onClick={submit}
        disabled={loading||!email||!pw||(mode==="signup"&&(!first||!last))}>
        {loading?((mode==="signup"?"Creating account...":"Signing in...")):(mode==="signup"?"Create Account →":"Sign In →")}
      </button>
      <div style={{textAlign:"center",marginTop:16}}>
        <button onClick={()=>setGuestOk(true)}
          style={{background:"none",border:"none",fontSize:12,color:"#aaa",cursor:"pointer",textDecoration:"underline"}}>
          Continue as guest (work won't be saved)
        </button>
      </div>
    </div></div>
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

  const hasACV    = cohort.members.some(m=>m.acv>0);
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

          {/* ACV distribution — only if populated */}
          {hasACV&&(
            <div style={{marginBottom:12}}>
              <div className="field-label" style={{marginBottom:6}}>ACV Distribution</div>
              <div style={{display:"flex",gap:2,height:20,borderRadius:4,overflow:"hidden"}}>
                {cohort.members.filter(m=>m.acv>0).sort((a,b)=>a.acv-b.acv).map((m,i,arr)=>(
                  <div key={i} title={`${m.company}: $${m.acv.toLocaleString()}`}
                    style={{flex:1,background:cohort.color,opacity:0.3+0.7*(i/Math.max(arr.length-1,1)),cursor:"pointer"}}
                    onClick={()=>onPickAccount&&onPickAccount(m)}/>
                ))}
              </div>
            </div>
          )}

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
                  <td style={{fontWeight:600,color:"#1a1a18"}}>
                    {m.company}
                    {m.company_url&&<div style={{fontSize:11,color:"#aaa",fontWeight:400}}>🌐 {m.company_url}</div>}
                  </td>
                  <td style={{color:"#555"}}>{m.ind||"—"}</td>
                  <td style={{color:"#555",fontSize:12}}>{m.employees||"—"}</td>
                  <td style={{fontSize:12}}>
                    {m.publicPrivate?(()=>{
                      const ot=(fitScores[m.company]?.ownershipType)||"";
                      const c=ot==="public"?"#1B3A6B":ot==="pe"?"#6B3A3A":ot==="vc"?"#2E6B2E":"#555";
                      const bg=ot==="public"?"#EEF5F9":ot==="pe"?"#FDE8E8":ot==="vc"?"#EEF5EE":"#F8F6F1";
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
          <div style={{fontFamily:"Lora,serif",fontSize:14,fontWeight:600,color:"#1a1a18"}}>{label}</div>
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
          <div style={{background:"#FDE8E8",border:"1px solid #9B2C2C",borderRadius:12,padding:24}}>
            <div style={{fontSize:16,fontWeight:700,color:"#9B2C2C",marginBottom:8}}>Render Error</div>
            <div style={{fontSize:13,color:"#555",marginBottom:16}}>{this.state.error?.message||"Unknown error"}</div>
            <button onClick={()=>this.setState({hasError:false,error:null})}
              style={{background:"#1a1a18",color:"#fff",border:"none",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13}}>
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
    setHeaders(hdrs);setRows(SAMPLE_ROWS);setFileName("sample_25_accounts.csv");
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
    // Score in batches of 20 so ALL accounts get scored regardless of list size
    const BATCH=20;
    const batches=[];
    for(let i=0;i<members.length;i+=BATCH) batches.push(members.slice(i,i+BATCH));
    const allMap={};
    const allMemberUpdates={};
    for(const batch of batches){
    const companies = batch.map(m=>`${m.company}|${m.ind||"Unknown industry"}|${m.company_url||""}`).join("\n");
    const prompt =
      `You are a B2B sales strategist trained in product-market fit assessment.\n`+`UNIVERSAL ASSUMPTION: Every company on this list — regardless of industry — wants to grow, expand, comply, reduce fraud/risk, satisfy investors, and make customers happy. Score fit based on how directly the seller addresses these imperatives for each account.\n`+`For each company below:\n`+`1. Score ICP fit (0-100) using Olsen's PMF Pyramid: Target Customer fit → Underserved Need fit → Value Proposition fit\n`+`2. Identify their Moore adoption profile: are they Innovators, Early Adopters, Early Majority, or Late Majority?\n`+`3. Provide firmographic data (org size, ownership)\n\n`+`SCORING HEURISTICS FROM 6,045,880-PERMUTATION ANALYSIS (4,634 YC Companies × Fortune 1000 + Top 500 Private):\n`+`\n`+`TIER 1 TARGETS — HIGHEST FIT FOR STARTUP SELLERS:\n`+`- Large Private Insurance/Finance (State Farm, TIAA, Nationwide, Northwestern Mutual): 65.2% avg — #1 overall\n`+`- Large Private Tech/Data/Media (Bloomberg, Valve, SAS, Koch Industries): 64.5% avg\n`+`- Large Private Professional Services (Deloitte US, EY, KPMG, Booz Allen): 63.3% avg\n`+`- Insurance P&C/Life/Specialty (Allstate, Progressive, Travelers, Hartford): 62.5% avg\n`+`- CPG HPC/Beauty/Consumer (P&G, Kimberly-Clark, Estee Lauder, SC Johnson): 61.9% avg\n`+`- Real Estate Commercial/REIT (CBRE, JLL, Prologis): 60.0% avg\n`+`- Regional/Community Banks (85 companies): 59.5% avg — vs Tier 1 Banks at 12.6%\n`+`- Healthcare IT / Digital Health Services: 54.9% avg\n`+`\n`+`THE WALL — INDUSTRIES WHERE 100% OF STARTUP SCENARIOS ARE POOR FIT:\n`+`- Aerospace & Defense Prime (Boeing/Lockheed/Raytheon): 5.8% avg — ITAR, clearance, FedRAMP required\n`+`- Automotive/Manufacturing (GM/Ford): 5.9% avg — 65% union, incumbent ERP impossible to displace\n`+`- Telecom (AT&T/Verizon): 6.1% avg — 50% union, 5-deep incumbent stack\n`+`- Energy Oil & Gas (ExxonMobil/Chevron): 11.3% avg — culture mismatch, union risk\n`+`- Energy Utilities: 13.4% avg — 60% union, regulatory lock-in\n`+`- Mass Market Retail >100K employees (Walmart/Target/Kroger): 13.6% avg — procurement wall\n`+`- Tier 1 Banking (JPM/BAC/Wells Fargo): 12.6% avg — incumbent depth 5/5, RFP-only\n`+`\n`+`STAGE THRESHOLDS (from 6M+ permutations):\n`+`- Seed: 23.7% avg across all F1000 — zero viable direct enterprise paths\n`+`- Series A: 33.6% avg — only specific niche targeting viable; no Tier 1 banks, no defense\n`+`- Series B: 41.8% avg — departmental landing in Insurance, Healthcare, Private companies\n`+`- Series C: 49.0% avg — first stage with real enterprise traction in top-tier targets\n`+`- Series D+: 55.6% avg — 35% of scenarios are strong fit; full enterprise motion viable\n`+`\n`+`CPG SPLIT: HPC/Beauty (P&G, Kimberly-Clark) = 61.9% avg; Food/Beverage (PepsiCo, Kraft) = 49.0% avg\n`+`Insurance insight: most underserved sector — YC companies rarely pitch insurance, yet avg 62.5% fit\n`+`Private company advantage: +5-8% fit vs public equivalents — faster decisions, no procurement theater\n`+`INDUSTRY SWEET SPOTS FOR STARTUP SELLERS:\n`+`- Healthcare (10-100K employees): avg 65% fit — best target for most B2B SaaS (low union, tech-forward, compliance urgency)\n`+`- Insurance companies: underserved, avg ~60% fit — high compliance need, receptive to modern SaaS\n`+`- Retail/Home Improvement mid-market: avg ~50% fit — departmental landing in ecomm/finance works\n`+`- CPG mid-market (10-50K employees): avg ~58% fit — finance and marketing tech lands well\n`+`- Financial Services (F500): avg 32% fit for startups — extreme incumbent entrenchment (Oracle, SAP, Amex)\n`+`- Automotive (GM, Ford): avg 31% — high union exposure, most workforce out of scope\n`+`- Defense/Aerospace: avg 36% — very high security/compliance bar, usually requires FedRAMP\n`+`- Retail giants (Walmart, Target 2M+ employees): avg 27% — procurement impossible for Series A-C\n`+`STAGE THRESHOLDS (from scenario scoring):\n`+`- Companies with >200K employees: avg fit ~30% for Series A-C sellers (procurement bar too high)\n`+`- Companies with >50% union/hourly workforce: avg fit ~25% for SaaS sellers (out-of-scope workforce)\n`+`- Series B selling to Fortune 500: restrict to departmental landing — score down 15pts for enterprise-wide\n`+`- Private companies (State Farm, Publix): score +5-8% vs public — faster decisions, less committee\n`+`- Recent funding (<12 months) = strong buying signal — add 5-10 points\n`+`- PE-backed target: 60-90 day budget cycles; VC-backed = faster decisions\n`+`- Hiring "Digital Transformation" → Early Majority; "Innovation/R&D" → Early Adopter; "Efficiency" → Late Majority\n`+`PE SELLER × SMB/MID-MARKET DYNAMICS (3,366 scenarios, 102 PE-acquired sellers × 33 SMB/mid-market segments):\n`+`- High EBITDA pressure PE sellers → SMB new logos: 51.3% avg fit — reps chase ACV not fit; SMBs oversold churn in year 2\n`+`- Vertical SaaS PE + matched vertical SMB (insurance PE → agencies, healthcare PE → practices): 95% fit\n`+`- Wealth Mgmt/RIA: 64.9% avg — RIAs are SMB-sized with enterprise compliance/reporting budget; underserved by PE sellers\n`+`- Healthcare SMB practices: 59.8% avg — #1 PE SMB vertical; founder-owned, compliance-urgent, fast decisions\n`+`- Insurance agencies SMB: 55.6% avg; carrier connectivity is the critical integration; carrier reference closes deals\n`+`- Behavioral Health SMB: 56.3% avg — ACA + mental health parity tailwinds; Netsmart can't serve sub-50-employee clinics\n`+`- MSP channel preferred for high-EBITDA PE sellers targeting SMB — MSPs aggregate SMBs, handle implementation\n\n`+icpContext+`\n`+
      `SELLER PROFILE:\n${sellerCtx}\n\n`+
      `SCORING CRITERIA:\n`+
      `1. Product/industry fit — do the seller's offerings make sense for this company?\n`+
      `2. Size fit — does this company's scale match the seller's typical customer profile?\n`+
      `3. Similar customers — would this company fit the seller's existing customer base?\n\n`+
      `For ownership: identify if Public (with ticker), Private, PE-backed (name the PE firm if known), or VC-backed (Series A/B/C/D/E, note lead investor if known).\n`+
      `For orgSize: provide approximate employee count range (e.g. "~200K", "5K-10K", "500-1K").\n\n`+
      `COMPANIES (Name|Industry|URL):\n${companies}\n\n`+
      `Return ONLY raw JSON, start with {:\n`+
      `{"scores":[{"company":"exact name","score":85,"label":"Strong Fit","reason":"1 sentence why","orgSize":"~200K employees","ownership":"Public (NYSE:MCD)","ownershipType":"public"},`+
      `{"company":"","score":40,"label":"Poor Fit","reason":"","orgSize":"500-1K employees","ownership":"PE-backed (Thoma Bravo)","ownershipType":"pe"},`+
      `{"company":"","score":60,"label":"Potential Fit","reason":"","orgSize":"~5K employees","ownership":"Series C ($180M, Sequoia)","ownershipType":"vc"}]}`;

    const result = await callAI(prompt);
    if(result?.scores){
      const map = {};
      const memberUpdates = {};
      result.scores.forEach(s=>{
        const color = s.score>=75?"#2E6B2E":s.score>=50?"#BA7517":"#9B2C2C";
        const bg    = s.score>=75?"#EEF5EE":s.score>=50?"#FEF6E4":"#FDE8E8";
        // Ownership badge color
        const ownerColor = s.ownershipType==="public"?"#1B3A6B":s.ownershipType==="pe"?"#6B3A3A":s.ownershipType==="vc"?"#2E6B2E":"#555";
        map[s.company] = {...s, color, bg, ownerColor, adoptionProfile:s.adoptionProfile||""};
        memberUpdates[s.company] = {orgSize:s.orgSize||"", ownership:s.ownership||"", ownershipType:s.ownershipType||""};
      });
      Object.assign(allMap, map);
      Object.assign(allMemberUpdates, memberUpdates);
    } // end forEach
    } // end batch loop
    if(Object.keys(allMap).length){
      setFitScores(prev=>({...prev,...allMap}));
      // Push orgSize + ownership back into cohort members
      setCohorts(prev=>prev.map(c=>({
        ...c,
        members:c.members.map(m=>allMemberUpdates[m.company]
          ? {...m,
              employees:m.employees||allMemberUpdates[m.company].orgSize,
              publicPrivate:m.publicPrivate||allMemberUpdates[m.company].ownership}
          : m)
      })));
    }
    setFitScoring(false);
  };

  // ── BUILD SELLER ICP FROM URL ────────────────────────────────────────────
  // Fires when seller URL is entered. Uses training knowledge + web search
  // to understand who this seller actually sells to.
  const buildSellerICP = async(rawUrl) => {
    const url = rawUrl.trim().replace(/^https?:\/\//,"").replace(/\/$/,"");
    setIcpLoading(true);

    // Phase 1 — web search to gather seller intelligence
    const researchPrompt =
      `Search for information about the B2B company at ${url}:\n`+
      `1. What do they sell? Who are their target customers?\n`+
      `2. Look for: customer case studies, testimonials, customer logos, pricing tiers, partner pages\n`+
      `3. Look for: job postings mentioning target industries or company sizes\n`+
      `4. Any known enterprise customers, verticals served, or use cases\n`+
      `Return ONLY raw JSON, start with {:\n`+
      `{"companyName":"","tagline":"","products":["product 1","product 2"],"targetCustomers":"who they sell to in plain language","knownCustomers":["logo 1","logo 2","logo 3"],"industries":["vertical 1","vertical 2","vertical 3"],"companySize":"typical customer size","pricingHint":"any pricing signals found","useCases":["use case 1","use case 2"],"competitors":["competitor 1","competitor 2"]}`;

    let researchCtx = "";
    try{
      const r1 = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:800,
          messages:[{role:"user",content:researchPrompt},{role:"assistant",content:"{"}],
        }),
      });
      const d1 = await r1.json();
      if(!d1.error){
        const raw1=(d1.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
        researchCtx = raw1.slice(0,1500);
      }
    }catch(e){ console.warn("ICP research failed:",e.message); }

    // Phase 2 — build full ICP using research + training knowledge
    const icpPrompt =
      `You are a senior B2B ICP strategist. Build the Ideal Customer Profile for the seller at: ${url}.\n`+
      (researchCtx?`RESEARCH:\n${researchCtx.slice(0,800)}\n\n`:"")+
      `Seller stage: ${sellerStage||"unknown"}. Be specific and confident — no placeholders.\n\n`+
      `Return ONLY raw JSON starting with {:\n`+
      `{"sellerName":"","sellerDescription":"2 sentences on what they sell","marketCategory":"specific category","icp":{"industries":["Primary","Second","Third"],"companySize":"e.g. 500-10K employees","revenueRange":"e.g. $50M-$2B","ownershipTypes":["most common"],"geographies":["Primary"],"adoptionProfile":"Early Adopter or Early Majority","buyerPersonas":["Economic buyer","Champion","Technical evaluator"],"priorityInitiative":"what triggers them to act NOW","successFactors":"what winning looks like","perceivedBarriers":"top objections","decisionCriteria":"top 2-3 evaluation factors","buyerJourney":"awareness to decision","customerJobs":["Functional job","Emotional job","Social job"],"topPains":["Pain 1","Pain 2","Pain 3"],"topGains":["Gain 1","Gain 2","Gain 3"],"competitiveAlternatives":["Status quo","Competitor","Build in-house"],"uniqueDifferentiators":["Differentiator 1","Differentiator 2"],"disqualifiers":["Not a fit: 1","Not a fit: 2"],"techSignals":["Signal 1","Signal 2"],"tractionChannels":["Channel 1","Channel 2","Channel 3"],"dealSize":"typical ACV","salesCycle":"typical length","customerExamples":["Customer 1","Customer 2","Customer 3"]}}`;

    try{
      const r2 = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:6000,
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
          if(parsed.sellerName||parsed.icp) setSellerICP(parsed);
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
          max_tokens:6000,
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
    const cohort={id:"qe",name:"Quick Entry",color:"#8B6F47",size:entries.length,pct:100,avgACV:0,topInd:[],topSrc:["Quick Entry"],topOut:[],
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

  const pickAccount=async member=>{
    setSelectedAccount(member);
    setBrief(null);
    setBriefLoading(true);
    setBriefError("");
    setBriefStatus("Researching "+member.company+"...");
    setGateAnswers({});setGateNotes({});setRiverData({});setDiscoveryQs(null);setDealValue("");setDealClassification("");setNotes("");setPostCall(null);setContactRole("");setCustomOutcome("");
    setStep(5);

    const {_brief,_phase2Promise} = await generateBrief(
      member, sellerUrl, sellerDocs, products,
      selectedCohort, selectedOutcomes, productPageUrl,
      (msg)=>setBriefStatus(msg),
      productUrls
    );

    if(_brief._error) setBriefError(_brief._error);
    setBrief(_brief);
    setBriefLoading(false);
    setBriefStatus("");

    // Both fire in background while rep reads the brief
    Promise.resolve().then(()=>buildRiverHypo(_brief, member));
    Promise.resolve().then(()=>generateDiscoveryQs(_brief, member));

    _phase2Promise.then(updater=>{
      if(typeof updater==="function") setBrief(prev=>updater(prev));
      console.log("Brief enriched with Part B + live search");
    }).catch(e=>console.warn("Brief merge failed:",e.message));
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
      "JOLT EFFECT (Dixon/McKenna): Indecision kills 40-60% of B2B deals. FOMU (Fear of Messing Up) > FOMO. Route stage MUST include: J=Judge the indecision explicitly, O=Offer YOUR recommendation (one clear POV, not options), L=Limit exploration (narrow scope), T=Take risk off the table (pilot, SLA, phased rollout, reference customer).\n" +
      "CHALLENGER CUSTOMER (CEB/Gartner): Identify the MOBILIZER — not the Talker or Blocker. Only 13% of stakeholders are Mobilizers. They ask 'how do we make this happen?'. Teach an insight to the ORGANIZATION through the Mobilizer. The teaching angle must challenge a widely-held assumption about their industry.\n" +
      "QUALIFICATION SIGNALS: referral/partner deals close 30%+ higher; funding <12 months = 18-month buying window; single-threaded prospect = 3x churn risk; SMB 30-45 day cycles, Mid-market 60-90, Enterprise 90-180; Ellis 40% must-have test is the critical qualifier.\n" +
      "TIER 1 TARGET RULES:\n" +
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
      `You are a senior B2B discovery coach trained in customer development and product-market fit validation.\n`+`UNIVERSAL TRUTH: Every company — regardless of industry — universally wants to grow, expand, stay compliant, reduce fraud/risk, satisfy investors, and make customers happy. Root discovery questions in which of these six the seller can address. Every question should ultimately connect to one or more of these imperatives.\n`+`Apply Mom Test (Fitzpatrick): ask about their PAST BEHAVIOR and REAL PROBLEMS, never about your product or hypothetical futures.\n`+`Apply Blank customer development: validate the problem EXISTS and MATTERS before mentioning solutions.\n`+`Apply Olsen PMF Pyramid: questions should surface Target Customer fit → Underserved Need → Value Prop resonance.\n`+`Apply Sean Ellis 40% Rule: include at least one question that tests if this is a must-have (not nice-to-have). E.g. "If you had to go back to how you handled this 18 months ago, what would that mean for your team?"\n`+`Apply churn-inverse signals: ask who owns this problem (single-threaded = risk), how many stakeholders are involved, and whether there is executive sponsorship.\n`+
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
  .summary-box { background: #F8F6F1; border-left: 3px solid #8B6F47; border-radius: 0 8px 8px 0; padding: 14px 16px; font-size: 14px; line-height: 1.7; color: #333; }

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
  .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #E8E6DF; display: flex; justify-content: space-between; align-items: center; }
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

  const STEPS=["Session","ICP","Import","Accounts","Account Review","Brief","Hypothesis","In-Call","Post-Call","Solution Fit"];
  const routeClass=postCall?.dealRoute==="FAST_TRACK"?"route-fast":postCall?.dealRoute==="NURTURE"?"route-nurture":"route-disq";
  const routeLabel=postCall?.dealRoute==="FAST_TRACK"?"Fast Track →":postCall?.dealRoute==="NURTURE"?"Nurture":"Disqualify";

  if(!authed) return <PasswordGate onAuth={(u,tok)=>{setAuthed(true);setSbUser(u);setSbToken(tok);}}/>;

  return(
    <>
      <style>{FONTS}{css}</style>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <div className="logo">Cambrian <span>Catalyst</span></div>
            <div style={{fontSize:9,letterSpacing:"0.6px",color:"#aaa",fontWeight:600,textTransform:"uppercase",paddingLeft:2}}>
              R·eality &nbsp;I·mpact &nbsp;V·ision &nbsp;E·ntry &nbsp;R·oute
            </div>
          </div>
          <div className="stepper">
            {STEPS.map((s,i)=>{
              // Determine if step is reachable
              const canNav = (()=>{
                if(i===step) return false; // already here
                if(i===0) return true; // session always
                if(i===1) return !!sellerUrl; // ICP needs URL
                if(i===2) return !!sellerUrl; // import needs session
                if(i===3) return cohorts.length>0; // accounts needs import
                if(i===4) return cohorts.length>0; // account review needs accounts
                if(i===5) return !!brief; // brief needs account picked
                if(i===6) return !!brief; // hypothesis needs brief
                if(i===6) return !!riverHypo; // in-call needs hypothesis
                if(i===7) return !!postCall; // post-call needs in-call
                if(i===8) return !!solutionFit; // solution fit needs post-call
                return step>i;
              })();
              return(
                <div key={i} style={{display:"flex",alignItems:"center"}}>
                  {i>0&&<div className="step-div"/>}
                  <div
                    className={`step-item ${step===i?"active":step>i?"done":""}`}
                    style={{cursor:canNav?"pointer":"default",opacity:(!canNav&&step<i)?0.4:1,transition:"opacity 0.15s"}}
                    title={canNav?`Go to ${s}`:step===i?s:"Complete earlier steps first"}
                    onClick={()=>canNav&&setStep(i)}>
                    <div className="step-num">{step>i?"✓":i+1}</div>{s}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {step===7&&<div className="live-badge"><div className="live-dot"/>Live Call</div>}
            {step>0&&(
              <button onClick={saveSession}
                style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:8,cursor:"pointer",
                  border:"1.5px solid "+(sbUser?"#2E6B2E":"#BA7517"),
                  background:saveStatus==="saved"?"#EEF5EE":sbUser?"#fff":"#FEF6E4",
                  color:sbUser?(saveStatus==="saved"?"#2E6B2E":"#2E6B2E"):"#7A5010"}}>
                {!sbUser?"🔒 Save":saveStatus==="saving"?"⏳":saveStatus==="saved"?"✓":"💾"} {saveStatus==="saved"?"Saved":"Save"}
              </button>
            )}
            {sbUser&&<button onClick={()=>{loadSessions();setShowSessions(s=>!s);}}
              style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:8,border:"1.5px solid #E8E6DF",background:"#fff",color:"#555",cursor:"pointer"}}>
              📂 {savedSessions.length>0?savedSessions.length+" Sessions":"Sessions"}
            </button>}
            {sbUser&&<button onClick={()=>{localStorage.removeItem('sb_token');window.location.reload();}}
              style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:8,border:"1.5px solid #E8E6DF",background:"#fff",color:"#aaa",cursor:"pointer"}}>
              {sbUser.user_metadata?.first_name||sbUser.email?.split('@')[0]} · Sign out
            </button>}
          </div>
        </header>

        {/* GUEST BANNER */}
        {!sbUser&&step>0&&(
          <div style={{background:"#FEF6E4",borderBottom:"1px solid #BA751744",padding:"7px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div style={{fontSize:12,color:"#7A5010"}}>👤 <strong>Guest mode</strong> — your work is not being saved.</div>
            <button onClick={()=>{setAuthed(false);}}
              style={{fontSize:12,fontWeight:700,padding:"4px 14px",borderRadius:8,background:"#1a1a18",color:"#fff",border:"none",cursor:"pointer"}}>
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
                style={{width:"100%",padding:"13px 0",borderRadius:10,background:"#1a1a18",color:"#fff",fontFamily:"DM Sans,sans-serif",fontSize:15,fontWeight:700,border:"none",cursor:"pointer",marginBottom:10}}>
                Create Free Account →
              </button>
              <button onClick={()=>setShowSavePrompt(false)}
                style={{width:"100%",padding:"11px 0",borderRadius:10,background:"#fff",color:"#777",fontFamily:"DM Sans,sans-serif",fontSize:14,border:"1.5px solid #E8E6DF",cursor:"pointer"}}>
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
              <div style={{padding:"18px 18px 12px",borderBottom:"1px solid #E8E6DF",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
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
                    style={{padding:"10px 12px",borderRadius:10,border:"1.5px solid "+(s.id===currentSessionId?"#1a1a18":"#E8E6DF"),background:s.id===currentSessionId?"#FAF8F4":"#fff",marginBottom:8,cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                        <div style={{fontSize:11,color:"#8B6F47"}}>{s.seller_url}</div>
                        <div style={{fontSize:10,color:"#aaa"}}>{new Date(s.updated_at).toLocaleDateString()}</div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();deleteSession(s.id);}} style={{background:"none",border:"none",color:"#ccc",cursor:"pointer",fontSize:14}}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:12,borderTop:"1px solid #E8E6DF"}}>
                <input value={sessionName} onChange={e=>setSessionName(e.target.value)} placeholder={sellerUrl||"Session name..."} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid #E8E6DF",fontSize:13,marginBottom:8,boxSizing:"border-box"}}/>
                <button onClick={saveSession} style={{width:"100%",padding:"10px",borderRadius:8,background:"#1a1a18",color:"#fff",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:700,border:"none",cursor:"pointer"}}>
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
              <span style={{fontSize:10,color:"#8B6F47",fontWeight:600}}>
                {products.filter(p=>p.name.trim()).length} product{products.filter(p=>p.name.trim()).length>1?"s":""} loaded
              </span>
            )}
            {productPageUrl&&(
            <span style={{fontSize:10,color:"#8B6F47",display:"flex",alignItems:"center",gap:4}}>
              🔗 {productPageUrl.replace(/^https?:\/\//,"").slice(0,30)}
            </span>
          )}
          {sellerDocs.length>0&&(
              <>{sellerDocs.map((d,i)=>(
                <div key={i} className="session-doc-chip">📄 {d.label}</div>
              ))}</>
            )}
            {sellerICP?.icp?.industries?.length>0&&(
              <span style={{fontSize:10,color:"#6B3A7A",fontWeight:600,background:"#F3EEF9",border:"1px solid #6B3A7A44",borderRadius:10,padding:"2px 8px"}}>
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
              <label style={{fontSize:10,color:"#8B6F47",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                <input type="file" accept=".pdf,.docx,.doc,.txt,.md,.pptx,.csv" multiple style={{display:"none"}} onChange={e=>{handleDocFiles(e.target.files);e.target.value="";}}/>
                + Add Docs
              </label>
              {sellerDocs.length>0&&<span style={{fontSize:10,color:"#aaa"}}>{sellerDocs.length} doc{sellerDocs.length>1?"s":""}</span>}
              <button style={{fontSize:10,color:"#9B2C2C",fontWeight:600,background:"none",border:"1px solid #9B2C2C44",borderRadius:6,padding:"2px 8px",cursor:"pointer"}}
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
              <div style={{fontFamily:"Lora,serif",fontSize:13,color:"#8B6F47",textAlign:"center",marginBottom:8,fontStyle:"italic",letterSpacing:"0.3px"}}>Revenue Playbook Engine · RIVER Framework</div>
              <div style={{textAlign:"center",marginBottom:10}}>
                <span style={{display:"inline-block",background:"#2E6B2E",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 12px",borderRadius:20,letterSpacing:"0.4px",textTransform:"uppercase"}}>Private Beta</span>
              </div>
              <div style={{textAlign:"center",marginBottom:24,padding:"0 8px"}}>
                <div style={{fontSize:17,fontWeight:600,color:"#1a1a18",lineHeight:1.5,marginBottom:8,fontFamily:"Lora,serif"}}>Be the most informed seller in the room.</div>
                <div style={{fontSize:14,color:"#666",lineHeight:1.7}}>Walk into every call knowing exactly what keeps your prospect up at night — their strategy, gaps, hiring signals, and the precise angle that opens doors. Powered by live research and five proven sales frameworks.</div>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:24,flexWrap:"wrap"}}>
                {[["⚡","Brief in seconds"],["🎯","5 sales frameworks"],["🔍","Live web research"],["📋","RIVER hypothesis"]].map(([icon,label])=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#777"}}>
                    <span style={{fontSize:15}}>{icon}</span><span>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{height:1,background:"#E8E6DF",marginBottom:20}}/>

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
                        style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid "+(sellerStage===stage?"#1a1a18":"#E8E6DF"),
                          background:sellerStage===stage?"#1a1a18":"#fff",color:sellerStage===stage?"#fff":"#555",
                          fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.13s"}}>
                        {stage}
                      </button>
                    ))}
                  </div>
                  {sellerStage&&(
                    <div style={{fontSize:11,color:"#8B6F47",marginTop:6}}>
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
              <div style={{height:1,background:"#E8E6DF",margin:"18px 0 16px"}}/>

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
                  <div style={{fontSize:11,color:"#2E6B2E",marginTop:8,display:"flex",alignItems:"center",gap:5}}>
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
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#F8F6F1",borderRadius:8,marginBottom:10}}>
                    <div className="load-spin" style={{width:14,height:14,borderWidth:2}}/>
                    <span style={{fontSize:13,color:"#8B6F47"}}>Scanning {sellerInput} for product pages...</span>
                  </div>
                )}

                {/* Found pages — confirm prompt */}
                {urlScanStatus==="found"&&!urlScanConfirmed&&(
                  <div style={{background:"#EEF5EE",border:"1.5px solid #2E6B2E",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#2E6B2E",marginBottom:8}}>
                      🔍 Found {productUrls.filter(u=>u.url).length} product page{productUrls.filter(u=>u.url).length!==1?"s":""}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                      {productUrls.filter(u=>u.url).map((u,i)=>(
                        <div key={i} style={{fontSize:12,color:"#333",display:"flex",alignItems:"center",gap:6}}>
                          <span style={{color:"#2E6B2E",fontSize:14}}>🔗</span>
                          <span style={{fontWeight:600,color:"#2E6B2E",marginRight:4}}>{u.label||"Page "+(i+1)}</span>
                          <span style={{color:"#777",fontFamily:"monospace",fontSize:11}}>{u.url.replace(/^https?:\/\//,"").slice(0,50)}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:13,fontWeight:600,color:"#1a1a18",marginBottom:10}}>Are these the right product pages?</div>
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
                      <div style={{fontSize:12,color:"#2E6B2E",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
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
                            <span style={{fontSize:10,color:"#8B6F47",cursor:"pointer",flexShrink:0}}
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
              <div style={{height:1,background:"#E8E6DF",margin:"20px 0 16px"}}/>

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
                  <div style={{fontSize:11,color:"#2E6B2E",marginTop:8,display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
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
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#2E6B2E",padding:"6px 0",marginTop:8}}>
                  <span>✓</span> ICP ready — you'll review it on the next step
                </div>
              )}
              {false&&(
                <div style={{marginTop:16}}>
                  <div style={{height:1,background:"#E8E6DF",marginBottom:16}}/>
                  <div style={{fontSize:12,fontWeight:700,color:"#1a1a18",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:10}}>
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
                          <div style={{background:"#F8F6F1",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Target Industries</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                              {sellerICP.icp.industries.map((ind,i)=>(
                                <span key={i} style={{fontSize:11,background:"#E8E6DF",borderRadius:10,padding:"2px 8px",color:"#555"}}>{ind}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {sellerICP.icp.buyerPersonas?.length>0&&(
                          <div style={{background:"#F8F6F1",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#1B3A6B",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Buyer Personas</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                              {sellerICP.icp.buyerPersonas.slice(0,3).map((p,i)=>(
                                <span key={i} style={{fontSize:11,background:"#EEF5F9",borderRadius:10,padding:"2px 8px",color:"#1B3A6B"}}>{p}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {(sellerICP.icp.companySize||sellerICP.icp.dealSize)&&(
                          <div style={{background:"#F8F6F1",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#2E6B2E",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>Sweet Spot</div>
                            {sellerICP.icp.companySize&&<div style={{fontSize:12,color:"#333"}}>{sellerICP.icp.companySize}</div>}
                            {sellerICP.icp.dealSize&&<div style={{fontSize:11,color:"#777",marginTop:2}}>{sellerICP.icp.dealSize}</div>}
                          </div>
                        )}
                        {sellerICP.icp.disqualifiers?.length>0&&(
                          <div style={{background:"#FDE8E8",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#9B2C2C",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Not a Fit</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                              {sellerICP.icp.disqualifiers.slice(0,2).map((d,i)=>(
                                <span key={i} style={{fontSize:11,background:"#FDE8E8",borderRadius:10,padding:"2px 8px",color:"#9B2C2C"}}>{d}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {sellerICP.icp.painPoints?.length>0&&(
                        <div style={{background:"#F8F6F1",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"#6B3A7A",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Top Pains We Solve</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                            {(sellerICP.icp.topPains||sellerICP.icp.painPoints||[]).filter(Boolean).map((p,i)=>(
                              <span key={i} style={{fontSize:11,background:"#F3EEF9",border:"1px solid #6B3A7A44",borderRadius:10,padding:"2px 8px",color:"#6B3A7A"}}>{p}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {sellerICP.icp.priorityInitiative&&(
                        <div style={{background:"#FEF6E4",border:"1px solid #BA751744",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"#BA7517",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>⚡ Trigger to Buy (Revella)</div>
                          <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{sellerICP.icp.priorityInitiative}</div>
                        </div>
                      )}
                      {sellerICP.icp.perceivedBarriers&&(
                        <div style={{background:"#FDE8E8",border:"1px solid #9B2C2C44",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"#9B2C2C",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>🚧 Perceived Barriers (Revella)</div>
                          <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{sellerICP.icp.perceivedBarriers}</div>
                        </div>
                      )}
                      {sellerICP.icp.adoptionProfile&&(
                        <div style={{background:"#EEF5F9",border:"1px solid #1B3A6B44",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"#1B3A6B",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>📊 Buyer Adoption Profile</div>
                          <div style={{fontSize:12,color:"#555"}}>{sellerICP.icp.adoptionProfile}</div>
                        </div>
                      )}
                      {sellerICP.icp.uniqueDifferentiators?.filter(Boolean).length>0&&(
                        <div style={{background:"#EEF5EE",border:"1px solid #2E6B2E44",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"#2E6B2E",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>✦ Why We Win (Dunford)</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                            {sellerICP.icp.uniqueDifferentiators.filter(Boolean).map((d,i)=>(
                              <span key={i} style={{fontSize:11,background:"#fff",border:"1px solid #2E6B2E44",borderRadius:10,padding:"2px 8px",color:"#2E6B2E"}}>{d}</span>
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

              <div style={{height:1,background:"#E8E6DF",margin:"20px 0"}}/>
              <button className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center"}}
                onClick={()=>{if(sellerInput.trim()){setSellerUrl(sellerInput.trim());setStep(1);}}}
                disabled={!sellerInput.trim()}>Start Session →</button>
            </div>
          </div>
        )}

        {/* ── STEP 1: ICP REVIEW ── */}
        {step===1&&(
          <div className="page">
            <div className="page-title">Your Ideal Customer Profile</div>
            <div className="page-sub">Built from <strong>{sellerUrl}</strong> — your ideal customer profile, refined. Review and edit before scoring accounts.</div>

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

            {sellerICP?.icp&&(
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
                          <span key={i} style={{background:"#EEF5EE",border:"1px solid #2E6B2E44",borderRadius:20,padding:"3px 10px",fontSize:12,color:"#2E6B2E",display:"flex",alignItems:"center",gap:4}}>
                            {d}
                            <button onClick={()=>setSellerICP(p=>({...p,icp:{...p.icp,uniqueDifferentiators:p.icp.uniqueDifferentiators.filter((_,j)=>j!==i)}}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#2E6B2E",padding:0}}>✕</button>
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
                          <span key={i} style={{background:"#E8E6DF",borderRadius:20,padding:"3px 10px",fontSize:12,color:"#555",display:"flex",alignItems:"center",gap:4}}>
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
                          <span key={i} style={{background:"#FDE8E8",border:"1px solid #9B2C2C33",borderRadius:20,padding:"3px 10px",fontSize:12,color:"#9B2C2C"}}>{d}</span>
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
                      <div key={i} style={{background:"#EEF5F9",border:"1px solid #1B3A6B33",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:20}}>{"💼👷🔧"[i]||"👤"}</span>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:"#1B3A6B"}}>{p}</div>
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
                      {key:"priorityInitiative",label:"⚡ Ring 1 — Priority Initiative",sub:"What triggers them to act NOW",color:"#BA7517",bg:"#FEF6E4"},
                      {key:"successFactors",label:"✓ Ring 2 — Success Factors",sub:"What winning looks like for them",color:"#2E6B2E",bg:"#EEF5EE"},
                      {key:"perceivedBarriers",label:"🚧 Ring 3 — Perceived Barriers",sub:"What makes them hesitate or walk away",color:"#9B2C2C",bg:"#FDE8E8"},
                      {key:"decisionCriteria",label:"⚖️ Ring 4 — Decision Criteria",sub:"How they evaluate and compare options",color:"#1B3A6B",bg:"#EEF5F9"},
                      {key:"buyerJourney",label:"🗺 Ring 5 — Buyer Journey",sub:"How they move from awareness to decision",color:"#6B3A7A",bg:"#F3EEF9"},
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
                        <div key={i} style={{fontSize:12,color:"#555",padding:"4px 0",borderBottom:"1px solid #F0EDE6"}}>• {p}</div>
                      ))}
                    </div>
                    <div>
                      <div className="field-label" style={{marginBottom:6}}>Top Gains We Create</div>
                      {(sellerICP.icp.topGains||[]).filter(Boolean).map((g,i)=>(
                        <div key={i} style={{fontSize:12,color:"#555",padding:"4px 0",borderBottom:"1px solid #F0EDE6"}}>• {g}</div>
                      ))}
                    </div>
                    <div style={{gridColumn:"1/-1"}}>
                      <div className="field-label" style={{marginBottom:6}}>Customer Jobs-to-be-Done</div>
                      {(sellerICP.icp.customerJobs||[]).filter(Boolean).map((j,i)=>(
                        <div key={i} style={{fontSize:12,color:"#555",padding:"4px 0",borderBottom:"1px solid #F0EDE6"}}>
                          <span style={{fontSize:10,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",marginRight:6}}>{["Functional","Emotional","Social"][i]||""}</span>{j}
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
                          <span key={i} style={{background:"#F8F6F1",border:"1px solid #E8E6DF",borderRadius:20,padding:"3px 10px",fontSize:12,color:"#555"}}>{c}</span>
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



            <div style={{display:"flex",justifyContent:"space-between",marginTop:16,paddingTop:16,borderTop:"1px solid #E8E6DF"}}>
              <button className="btn btn-secondary" onClick={()=>setStep(0)}>← Back</button>
              <button className="btn btn-primary btn-lg"
                onClick={()=>setStep(2)}
                disabled={!sellerICP&&!icpLoading}>
                {icpLoading&&!sellerICP?"Building ICP...":"Continue to Import →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: IMPORT ── */}
        {step===2&&(
          <div className="page">
            <div className="page-title">Add Your Accounts</div>
            <div className="page-sub">Upload a CRM export, or type in companies directly — great for conferences, warm intros, or quick meeting prep.</div>

            {/* Mode switcher */}
            <div style={{display:"flex",gap:0,marginBottom:24,background:"#F0EDE6",borderRadius:10,padding:3,width:"fit-content"}}>
              {[["csv","📂  Upload CSV"],["quick","⚡  Quick Entry"]].map(([mode,label])=>(
                <button key={mode} onClick={()=>setImportMode(mode)}
                  style={{padding:"8px 20px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                    background:importMode===mode?"#fff":"transparent",
                    color:importMode===mode?"#1a1a18":"#999",
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
                    setHeaders(hdrs);setRows(SAMPLE_ROWS);setFileName("sample_25_accounts.csv");
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
                  }}>Load Sample Data (25 accounts)</button>
                </div>
              </>
            )}

            {/* ── Quick Entry Mode ── */}
            {importMode==="quick"&&(
              <div>
                <div style={{background:"#F8F6F1",border:"1px solid #E8E6DF",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{fontSize:18,flexShrink:0}}>💡</div>
                  <div style={{fontSize:13,color:"#555",lineHeight:1.6}}>
                    <strong>Website URLs give the best results.</strong> Paste any of: company website, LinkedIn company page, or just type the company name.
                    Name-only entries use training knowledge — great for well-known companies.
                  </div>
                </div>

                {quickEntries.map((entry,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"#1a1a18",color:"#8B6F47",fontFamily:"Lora,serif",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
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
                  {fitScoring&&<div style={{fontSize:12,color:"#8B6F47"}}>⏳ Evaluating fit...</div>}
                  {Object.keys(fitScores).length>0&&!fitScoring&&<div style={{fontSize:12,color:"#2E6B2E"}}>✓ Fit scores ready</div>}
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
              <div className="tbl-wrap" style={{maxHeight:"480px",overflowY:"scroll",border:"1px solid #F0EDE6",borderRadius:8}}>
                <table className="tbl" style={{fontSize:13}}>
                  <thead style={{position:"sticky",top:0,zIndex:10,background:"#fff"}}>
                    <tr>
                      <th>Company</th>
                      <th>Industry</th>
                      <th>Org Size</th>
                      <th>Ownership</th>
                      <th>ACV</th>
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
                        <tr key={i} style={{cursor:"pointer",background:inQueue?"#FAF8F4":"",transition:"background 0.1s"}}
                          onClick={()=>setAccountQueue(prev=>{
                            if(prev.some(q=>q.company===m.company)) return prev.filter(q=>q.company!==m.company);
                            if(prev.length>=5) return prev;
                            return [...prev,{...m}];
                          })}>
                          <td style={{fontWeight:600,color:"#1a1a18"}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{width:20,height:20,borderRadius:4,border:"2px solid "+(inQueue?"#1a1a18":"#ddd"),background:inQueue?"#1a1a18":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,color:"#8B6F47",fontWeight:700}}>
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
                              const c=low.includes("public")?"#1B3A6B":low.includes("pe-backed")||low.includes("pe backed")?"#6B3A3A":low.includes("vc")||low.includes("backed")?"#2E6B2E":low.includes("private")?"#555":"#555";
                              const bg=low.includes("public")?"#EEF5F9":low.includes("pe-backed")||low.includes("pe backed")?"#FDE8E8":low.includes("vc")||low.includes("backed")?"#EEF5EE":"#F8F6F1";
                              return<span style={{background:bg,color:c,border:"1px solid "+c+"44",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{pp}</span>;
                            })()}
                          </td>
                          <td style={{fontSize:12,color:"#8B6F47",fontWeight:600}}>{m.acv>0?"$"+Number(m.acv).toLocaleString():m.acv?"$"+m.acv:"—"}</td>
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
                              onClick={e=>{e.stopPropagation();setSelectedCohort(m._cohort);pickAccount(m);}}>
                              Brief →
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

        {/* ── STEP 3: ACCOUNT + OUTCOMES ── */}
        {step===4&&selectedCohort&&(
          <div className="page">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4,flexWrap:"wrap"}}>
              <div className="page-title" style={{margin:0}}>
                {accountQueue.length>1?`Account ${queueIdx+1} of ${accountQueue.length}`:selectedAccount?selectedAccount.company:"Select Account"}
              </div>
              {accountQueue.length>1&&(
                <div style={{display:"flex",gap:6}}>
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
            <div className="page-sub" style={{marginBottom:20}}>
              {accountQueue.length>1
                ? `Reviewing ${accountQueue.map(a=>a.company).join(", ")} — pick outcomes for each, then build briefs.`
                : "Choose an account, pick your target outcomes, then build the brief."}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20,alignItems:"start"}}>

              {/* Left: Account list */}
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:10}}>
                  {accountQueue.length>1?`${accountQueue.length} selected accounts`:selectedCohort.name}
                </div>
                <div className="account-list">
                  {(accountQueue.length>0
                    ? accountQueue
                    : selectedCohort.members
                  ).sort((a,b)=>{
                    const sa=fitScores[a.company]?.score??50;
                    const sb=fitScores[b.company]?.score??50;
                    return sb-sa;
                  }).map((m,i)=>{
                    const isSelected = selectedAccount?.company===m.company;
                    return(
                      <div key={i}
                        className={`account-item ${isSelected?"selected":""} ${!m.company_url?"no-url":""}`}
                        style={{
                          border:isSelected?"2px solid #1a1a18":"1px solid #E8E6DF",
                          background:isSelected?"#FAF8F4":"#fff",
                          cursor:"pointer",
                        }}
                        onClick={()=>{setSelectedAccount(m);setSelectedOutcomes([]);}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid "+(isSelected?"#1a1a18":"#ccc"),background:isSelected?"#1a1a18":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              {isSelected&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                            </div>
                            <div className="account-name" style={{fontSize:15}}>{m.company}</div>
                          </div>
                          <div className="account-meta" style={{marginLeft:26}}>{m.ind}{m.src?" · "+m.src:""}</div>
                          {m.company_url&&<div style={{fontSize:11,color:"#aaa",marginTop:1,marginLeft:26}}>🌐 {m.company_url}</div>}
                        </div>
                        <div style={{flexShrink:0}}>
                          {fitScores[m.company]?(
                            <div title={fitScores[m.company].reason} style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:fitScores[m.company].bg,color:fitScores[m.company].color,border:"1px solid "+fitScores[m.company].color+"44",whiteSpace:"nowrap"}}>
                              {fitScores[m.company].score}% · {fitScores[m.company].label}
                            </div>
                          ):fitScoring?<div style={{fontSize:11,color:"#aaa"}}>Scoring...</div>:null}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {(Object.keys(fitScores).length>0||fitScoring)&&(
                  <div style={{display:"flex",gap:12,alignItems:"center",marginTop:10,flexWrap:"wrap"}}>
                    {[["#2E6B2E","75+: Strong"],["#BA7517","50-74: Potential"],["#9B2C2C","<50: Poor"]].map(([c,l])=>(
                      <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:11}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:c}}/><span style={{color:"#777"}}>{l}</span>
                      </div>
                    ))}
                    {fitScoring&&<span style={{fontSize:11,color:"#8B6F47"}}>⏳ scoring...</span>}
                  </div>
                )}
              </div>

              {/* Right: Sticky outcomes + build panel */}
              <div style={{position:"sticky",top:72}}>
                {selectedAccount?(
                  <div className="card" style={{border:"2px solid #1a1a18"}}>
                    {/* Selected account summary */}
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingBottom:14,borderBottom:"1px solid #E8E6DF"}}>
                      <div style={{width:40,height:40,borderRadius:"50%",background:"#1a1a18",color:"#8B6F47",fontFamily:"Lora,serif",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {selectedAccount.company.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{fontSize:15,fontWeight:700,color:"#1a1a18"}}>{selectedAccount.company}</div>
                        <div style={{fontSize:12,color:"#777"}}>{selectedAccount.ind}</div>
                      </div>
                    </div>

                    {/* Deal Health Signals */}
                    {fitScores[selectedAccount?.company]&&(
                      <div style={{marginBottom:12,padding:"10px 14px",borderRadius:10,
                        border:"1px solid "+(fitScores[selectedAccount.company].score>=75?"#2E6B2E":fitScores[selectedAccount.company].score>=50?"#BA7517":"#9B2C2C")+"44",
                        background:fitScores[selectedAccount.company].bg}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                          <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.4px",color:fitScores[selectedAccount.company].color}}>
                            PMF Fit Assessment
                          </div>
                          <div style={{fontSize:13,fontWeight:700,color:fitScores[selectedAccount.company].color}}>
                            {fitScores[selectedAccount.company].score}% · {fitScores[selectedAccount.company].label}
                          </div>
                        </div>
                        {fitScores[selectedAccount.company].reason&&(
                          <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{fitScores[selectedAccount.company].reason}</div>
                        )}
                        {fitScores[selectedAccount.company].adoptionProfile&&(
                          <div style={{marginTop:6,display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:10,color:"#aaa",fontWeight:600}}>MOORE:</span>
                            <span style={{fontSize:11,fontWeight:700,background:"#EEF5F9",color:"#1B3A6B",borderRadius:10,padding:"2px 8px"}}>{fitScores[selectedAccount.company].adoptionProfile}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ICP Match Card */}
                    {sellerICP?.icp&&(
                      <div style={{background:"#F8F6F1",borderRadius:10,padding:"12px 14px",marginBottom:16,borderBottom:"1px solid #E8E6DF",paddingBottom:16}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                          <div style={{fontSize:10,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.4px"}}>
                            ICP Match — {sellerICP.sellerName||sellerUrl}
                          </div>
                          {fitScores[selectedAccount.company]&&(
                            <div style={{fontSize:12,fontWeight:700,padding:"2px 10px",borderRadius:20,
                              background:fitScores[selectedAccount.company].bg,
                              color:fitScores[selectedAccount.company].color,
                              border:"1px solid "+fitScores[selectedAccount.company].color+"44"}}>
                              {fitScores[selectedAccount.company].score}% Fit
                            </div>
                          )}
                        </div>

                        {/* Industry match */}
                        {sellerICP.icp.industries?.length>0&&(
                          <div style={{marginBottom:8}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:"0.3px",marginBottom:4}}>Target Industries</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                              {sellerICP.icp.industries.map((ind,i)=>{
                                const acctInd=(selectedAccount.ind||"").toLowerCase();
                                const match=acctInd&&(ind.toLowerCase().includes(acctInd.split(" ")[0])||acctInd.includes(ind.toLowerCase().split(" ")[0]));
                                return(
                                  <span key={i} style={{fontSize:11,borderRadius:10,padding:"2px 8px",
                                    background:match?"#2E6B2E":"#E8E6DF",
                                    color:match?"#fff":"#777",
                                    fontWeight:match?700:400}}>
                                    {match?"✓ ":""}{ind}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Buyer personas */}
                        {sellerICP.icp.buyerPersonas?.length>0&&(
                          <div style={{marginBottom:8}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:"0.3px",marginBottom:4}}>Key Buyers to Target</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                              {sellerICP.icp.buyerPersonas.filter(Boolean).map((p,i)=>(
                                <span key={i} style={{fontSize:11,background:"#EEF5F9",border:"1px solid #1B3A6B33",borderRadius:10,padding:"2px 8px",color:"#1B3A6B"}}>{p}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Trigger to buy */}
                        {sellerICP.icp.priorityInitiative&&(
                          <div style={{marginBottom:8}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#BA7517",textTransform:"uppercase",letterSpacing:"0.3px",marginBottom:3}}>⚡ Trigger to Buy</div>
                            <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{sellerICP.icp.priorityInitiative}</div>
                          </div>
                        )}

                        {/* Perceived barriers */}
                        {sellerICP.icp.perceivedBarriers&&(
                          <div style={{marginBottom:8}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#9B2C2C",textTransform:"uppercase",letterSpacing:"0.3px",marginBottom:3}}>🚧 Watch for</div>
                            <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{sellerICP.icp.perceivedBarriers}</div>
                          </div>
                        )}

                        {/* Decision criteria */}
                        {sellerICP.icp.decisionCriteria&&(
                          <div style={{marginBottom:8}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.3px",marginBottom:3}}>⚖️ Decision Criteria</div>
                            <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{sellerICP.icp.decisionCriteria}</div>
                          </div>
                        )}

                        {/* Adoption profile from fit scores */}
                        {fitScores[selectedAccount.company]?.adoptionProfile&&(
                          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6,paddingTop:8,borderTop:"1px solid #E8E6DF"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.3px"}}>Adoption Profile:</div>
                            <span style={{fontSize:11,fontWeight:700,background:"#EEF5F9",color:"#1B3A6B",borderRadius:10,padding:"2px 8px"}}>
                              {fitScores[selectedAccount.company].adoptionProfile}
                            </span>
                          </div>
                        )}

                        {/* Fit score reason */}
                        {fitScores[selectedAccount.company]?.reason&&(
                          <div style={{fontSize:11,color:"#777",lineHeight:1.5,marginTop:6,fontStyle:"italic"}}>
                            {fitScores[selectedAccount.company].reason}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Deal Value */}
                    <div style={{marginBottom:14}}>
                      <div className="field-label" style={{marginBottom:6}}>Estimated Deal Value <span style={{color:"#aaa",fontWeight:400,fontSize:11,textTransform:"none",letterSpacing:0}}>(1-year contract)</span></div>
                      <select value={dealValue} onChange={e=>setDealValue(e.target.value)} style={{width:"100%",fontSize:14}}>
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

                    {/* Deal Classification */}
                    <div style={{marginBottom:16,paddingBottom:14,borderBottom:"1px solid #E8E6DF"}}>
                      <div className="field-label" style={{marginBottom:6}}>Revenue Classification</div>
                      <select value={dealClassification} onChange={e=>setDealClassification(e.target.value)} style={{width:"100%",fontSize:14}}>
                        <option value="">— Select classification —</option>
                        <option>Top-Line Revenue (TCV)</option>
                        <option>Contribution Margin</option>
                        <option>Gross Profit</option>
                        <option>Net New ARR</option>
                        <option>Expansion Revenue</option>
                        <option>Professional Services</option>
                      </select>
                    </div>

                    {/* Outcomes */}
                    <div style={{fontSize:12,fontWeight:700,color:"#1a1a18",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:10}}>Customer's Target Outcomes</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                      {OUTCOMES.map(o=>{
                        const sel=selectedOutcomes.includes(o.title);
                        return(
                          <div key={o.id}
                            onClick={()=>setSelectedOutcomes(p=>p.includes(o.title)?p.filter(x=>x!==o.title):[...p,o.title])}
                            style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,border:"1.5px solid "+(sel?"#1a1a18":"#E8E6DF"),background:sel?"#1a1a18":"#fff",cursor:"pointer",transition:"all 0.15s"}}>
                            <div style={{fontSize:16,flexShrink:0}}>{o.icon}</div>
                            <div>
                              <div style={{fontSize:13,fontWeight:600,color:sel?"#fff":"#1a1a18"}}>{o.title}</div>
                              <div style={{fontSize:11,color:sel?"#aaa":"#999"}}>{o.sub}</div>
                            </div>
                            {sel&&<div style={{marginLeft:"auto",fontSize:14,color:"#8B6F47"}}>✓</div>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Free-form custom outcome */}
                    <div style={{marginBottom:12,paddingTop:8,borderTop:"1px solid #E8E6DF"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Or describe a specific outcome</div>
                      <div style={{display:"flex",gap:6}}>
                        <input
                          type="text"
                          placeholder="e.g. Increase franchise marketing ROI..."
                          value={customOutcome}
                          style={{flex:1,fontSize:13,borderRadius:8,border:"1.5px solid #E8E6DF",padding:"8px 12px"}}
                          onChange={e=>setCustomOutcome(e.target.value)}
                          onKeyDown={e=>{
                            if(e.key==="Enter"&&customOutcome.trim()){
                              setSelectedOutcomes(p=>p.includes(customOutcome.trim())?p:[...p,customOutcome.trim()]);
                              setCustomOutcome("");
                            }
                          }}
                        />
                        <button
                          className="btn btn-secondary btn-sm"
                          disabled={!customOutcome.trim()}
                          onClick={()=>{
                            if(customOutcome.trim()){
                              setSelectedOutcomes(p=>p.includes(customOutcome.trim())?p:[...p,customOutcome.trim()]);
                              setCustomOutcome("");
                            }
                          }}>
                          Add
                        </button>
                      </div>
                      {selectedOutcomes.filter(o=>!OUTCOMES.find(x=>x.title===o)).map((custom,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginTop:6,padding:"6px 10px",background:"#1a1a18",borderRadius:8}}>
                          <span style={{fontSize:13,color:"#fff",flex:1}}>{custom}</span>
                          <button onClick={()=>setSelectedOutcomes(p=>p.filter(o=>o!==custom))}
                            style={{background:"none",border:"none",color:"#8B6F47",cursor:"pointer",fontSize:14,padding:0}}>✕</button>
                        </div>
                      ))}
                    </div>

                    <button
                      className="btn btn-primary btn-lg"
                      style={{width:"100%",justifyContent:"center"}}
                      disabled={selectedOutcomes.length===0}
                      onClick={()=>pickAccount(selectedAccount)}>
                      Build Brief → {selectedOutcomes.length>0&&`(${selectedOutcomes.length} outcome${selectedOutcomes.length>1?"s":""})`}
                    </button>
                    {selectedOutcomes.length===0&&<div style={{fontSize:11,color:"#aaa",textAlign:"center",marginTop:6}}>Select at least one outcome above</div>}
                  </div>
                ):(
                  <div style={{background:"#F8F6F1",border:"1.5px dashed #C8C4BB",borderRadius:12,padding:24,textAlign:"center"}}>
                    <div style={{fontSize:24,marginBottom:8}}>👈</div>
                    <div style={{fontSize:14,fontWeight:600,color:"#555",marginBottom:4}}>Select an account</div>
                    <div style={{fontSize:12,color:"#aaa"}}>Choose from the list to set outcomes and build your brief</div>
                  </div>
                )}
              </div>
            </div>

            <div className="actions-row">
              <button className="btn btn-secondary" onClick={()=>setStep(3)}>← Back</button>
            </div>
          </div>
        )}

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
                  <div style={{background:"#FDE8E8",border:"1.5px solid #9B2C2C",borderRadius:10,padding:"14px 16px",marginBottom:16}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#9B2C2C",marginBottom:8}}>⚠ Research Error — Action Required</div>
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
                      <button className="btn btn-green btn-lg" onClick={()=>{if(!riverHypo&&!riverHypoLoading&&brief)buildRiverHypo(brief,selectedAccount);setStep(5);}}>Review Hypothesis →</button>
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
                          <span style={{background:"#2E6B2E",color:"#fff",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>REVENUE</span>Annual Revenue / ARR
                        </div>
                        <EF value={brief.revenue||""} onChange={v=>patchBrief(b=>{b.revenue=v;})} single placeholder="e.g. $18.8B annual revenue (FY2025)"/>
                      </div>
                      <div>
                        <div className="field-label" style={{marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                          <span style={{background:"#1B3A6B",color:"#fff",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>OWNERSHIP</span>Public / Private
                        </div>
                        <EF value={brief.publicPrivate||""} onChange={v=>patchBrief(b=>{b.publicPrivate=v;})} single placeholder="e.g. Public (NYSE: ARMK)"/>
                      </div>
                      <div>
                        <div className="field-label" style={{marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                          <span style={{background:"#8B6F47",color:"#fff",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>EMPLOYEES</span>Employee Count
                        </div>
                        <EF value={brief.employeeCount||""} onChange={v=>patchBrief(b=>{b.employeeCount=v;})} single placeholder="e.g. ~270,000 globally"/>
                      </div>
                      <div>
                        <div className="field-label" style={{marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                          <span style={{background:"#6B3A7A",color:"#fff",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>HQ</span>HQ · Founded
                        </div>
                        <EF value={(brief.headquarters||(brief.founded?" · Founded "+brief.founded:""))||""} onChange={v=>patchBrief(b=>{b.headquarters=v;})} single placeholder="e.g. Philadelphia, PA · Founded 1959"/>
                      </div>
                    </div>

                    {/* Website + LinkedIn */}
                    {(brief.website||brief.linkedIn)&&(
                      <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
                        {brief.website&&(
                          <a href={"https://"+brief.website.replace(/^https?:\/\//,"")} target="_blank" rel="noopener noreferrer"
                            style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#1B3A6B",textDecoration:"none",background:"#EEF5F9",border:"1px solid #1B3A6B44",borderRadius:16,padding:"4px 12px",fontWeight:600}}>
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
                    <div style={{marginTop:10,padding:"12px 14px",background:"#F8F6F1",border:"1px solid #E8E6DF",borderRadius:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                        <div className="field-label" style={{margin:0}}>Funding & Ownership</div>
                        {(()=>{
                          const fp=(brief.fundingProfile||"").toLowerCase();
                          const isPE=fp.includes("pe-backed")||fp.includes("private equity")||fp.includes("portfolio company")||fp.includes("acquired by");
                          const isSeries=fp.match(/series [a-e]/i);
                          const isPublic=fp.includes("nyse:")||fp.includes("nasdaq:")||fp.includes("public (");
                          const label=isPE?"🏦 PE-Backed":isSeries?"🚀 VC-Backed ("+isSeries[0]+")":isPublic?"📈 Public Company":null;
                          const lColor=isPE?"#9B2C2C":isSeries?"#2E6B2E":isPublic?"#1B3A6B":"";
                          const lBg=isPE?"#FDE8E8":isSeries?"#EEF5EE":isPublic?"#EEF5F9":"";
                          const recent=fp.includes("2024")||fp.includes("2025")||fp.includes("2026")||fp.includes("recently");
                          return(<span style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                            {label&&<span style={{background:lBg,color:lColor,border:"1px solid "+lColor+"44",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{label}</span>}
                            {recent&&isSeries&&<span style={{background:"#2E6B2E",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>⚡ 18-mo buy window</span>}
                            {isPE&&<span style={{background:"#BA7517",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>60-90 day budget cycle</span>}
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
                            <div style={{fontSize:15,fontWeight:700,color:"#1a1a18"}}>{ex.name}</div>
                            <div style={{fontSize:13,color:"#777",marginBottom:4}}>{ex.title}</div>
                            {ex.background&&<div style={{fontSize:13,color:"#555",marginBottom:8,fontStyle:"italic"}}>{ex.background}</div>}
                            <div style={{fontSize:11,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>Executive Perspective</div>
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
                          <div key={i} style={{padding:"8px 10px",background:"#FAFAF8",border:"1px solid #E8E6DF",borderRadius:7}}>
                            <div style={{display:"flex",gap:7,alignItems:"flex-start"}}>
                              <div style={{width:5,height:5,borderRadius:"50%",background:"#1B3A6B",flexShrink:0,marginTop:5}}/>
                              <div style={{flex:1}}>
                                <div style={{fontSize:14,fontWeight:600,color:"#1a1a18",marginBottom:relevance?4:0}}>{headline}</div>
                                {relevance&&<div style={{fontSize:12,color:"#8B6F47",fontStyle:"italic",marginTop:2}}>{relevance}</div>}
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
                        <div style={{background:"#FAF8F4",borderLeft:"4px solid #8B6F47",borderRadius:"0 10px 10px 0",padding:"14px 16px",marginBottom:14}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:6}}>
                            <div style={{fontSize:11,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.5px"}}>Strategic Interpretation</div>
                            {(()=>{
                              const txt=(brief.openRoles.summary+" "+(brief.openRoles.roles||[]).map(r=>r.title+" "+r.signal).join(" ")).toLowerCase();
                              const sig=txt.includes("digital transform")||txt.includes("innovation")||txt.includes("r&d")||txt.includes("emerging")?"🔵 Early Adopter":
                                txt.includes("process")||txt.includes("efficiency")||txt.includes("optimization")||txt.includes("cost reduction")?"⚪ Late Majority":
                                txt.includes("growth")||txt.includes("scale")||txt.includes("platform")||txt.includes("moderniz")?"🟢 Early Majority":null;
                              return sig?(
                                <div style={{display:"flex",alignItems:"center",gap:4,background:"#EEF5F9",border:"1px solid #1B3A6B33",borderRadius:20,padding:"2px 10px"}}>
                                  <span style={{fontSize:9,fontWeight:700,color:"#1B3A6B",textTransform:"uppercase",letterSpacing:"0.3px"}}>LinkedIn Graph</span>
                                  <span style={{fontSize:11,fontWeight:700,color:"#1B3A6B"}}>{sig}</span>
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
                            <div key={i} style={{padding:"12px 14px",background:"#fff",border:"1px solid #E8E6DF",borderRadius:10,marginBottom:2}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:role.signal?6:0}}>
                                <div style={{background:"#F0EDE6",color:"#7A5C30",borderRadius:5,padding:"3px 9px",fontSize:10,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,border:"1px solid #D4C4A8"}}>{role.dept||"Open"}</div>
                                <div style={{fontSize:14,fontWeight:700,color:"#1a1a18"}}>{role.title}</div>
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
                              const c=isNaN(n)?"#8B6F47":n>=4?"#2E6B2E":n>=3?"#BA7517":"#9B2C2C";
                              const bg=isNaN(n)?"#F8F6F1":n>=4?"#EEF5EE":n>=3?"#FEF6E4":"#FDE8E8";
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
                        <div style={{background:"#EEF5F9",border:"1px solid #1B3A6B33",borderRadius:8,padding:"10px 14px",marginBottom:12}}>
                          <div style={{fontSize:10,fontWeight:700,color:"#1B3A6B",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>📊 NPS / Customer Loyalty Signal</div>
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
                            const borderColor=isPos?"#2E6B2E":"#9B2C2C";
                            return(
                            <div style={{background:"#FAF8F4",borderLeft:"3px solid "+borderColor,borderRadius:"0 8px 8px 0",padding:"10px 13px"}}>
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
                        <div style={{background:"#F8F6F1",borderLeft:"3px solid #8B6F47",padding:"9px 12px",borderRadius:"0 7px 7px 0"}}>
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
                            <div style={{fontSize:12,fontWeight:600,color:"#1a1a18"}}>{l.name}</div>
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
                      <div key={i} style={{marginBottom:16,paddingBottom:16,borderBottom:i<((brief.solutionMapping||[]).filter(x=>x?.product).length-1)?"1px solid #F0EDE6":"none"}}>
                        {/* Product header + imperative badge */}
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                          <div style={{background:"#F0EDE6",color:"#7A5C30",border:"1px solid #D4C4A8",fontFamily:"Lora,serif",fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:6,whiteSpace:"nowrap"}}>
                            {item.product}
                          </div>
                          {item.imperativeServed&&(
                            <div style={{fontSize:11,fontWeight:700,background:"#EEF5EE",color:"#2E6B2E",border:"1px solid #2E6B2E44",borderRadius:20,padding:"2px 10px"}}>
                              {item.imperativeServed}
                            </div>
                          )}
                          {item.buyerRole&&(
                            <div style={{fontSize:11,fontWeight:600,background:"#EEF5F9",color:"#1B3A6B",border:"1px solid #1B3A6B33",borderRadius:20,padding:"2px 10px"}}>
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
                              <div style={{background:"#F7F6F2",borderRadius:8,padding:"8px 10px"}}>
                                <div style={{fontSize:9,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>Job-to-be-Done</div>
                                <div style={{fontSize:12,color:"#333",lineHeight:1.5}}>{item.jobToBeDone}</div>
                              </div>
                            )}
                            {item.painRelieved&&(
                              <div style={{background:"#FDE8E844",borderRadius:8,padding:"8px 10px",border:"1px solid #9B2C2C22"}}>
                                <div style={{fontSize:9,fontWeight:700,color:"#9B2C2C",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>Pain Relieved</div>
                                <div style={{fontSize:12,color:"#333",lineHeight:1.5}}>{item.painRelieved}</div>
                              </div>
                            )}
                            {item.gainCreated&&(
                              <div style={{background:"#EEF5EE",borderRadius:8,padding:"8px 10px",border:"1px solid #2E6B2E22"}}>
                                <div style={{fontSize:9,fontWeight:700,color:"#2E6B2E",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>Gain Created</div>
                                <div style={{fontSize:12,color:"#333",lineHeight:1.5}}>{item.gainCreated}</div>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Challenger insight */}
                        {item.challengerInsight&&(
                          <div style={{marginTop:8,background:"#1a1a18",borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"flex-start",gap:8}}>
                            <span style={{fontSize:11,color:"#8B6F47",fontWeight:700,flexShrink:0,marginTop:1}}>⚡</span>
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:2}}>Challenger Insight</div>
                              <div style={{fontSize:12,color:"#fff",lineHeight:1.5,fontStyle:"italic"}}>{item.challengerInsight}</div>
                            </div>
                          </div>
                        )}
                        {/* JOLT risk remover */}
                        {item.joltRiskRemover&&(
                          <div style={{marginTop:6,background:"#EEF5EE",borderRadius:8,padding:"7px 10px",display:"flex",alignItems:"flex-start",gap:6}}>
                            <span style={{fontSize:11,flexShrink:0}}>🛡</span>
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"#2E6B2E",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:2}}>Risk Remover (JOLT)</div>
                              <div style={{fontSize:12,color:"#2E6B2E",lineHeight:1.5}}>{item.joltRiskRemover}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Mobilizer Intelligence */}
                    {brief.mobilizer?.description&&(
                      <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #E8E6DF"}}>
                        <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#1B3A6B",marginBottom:10}}>🎯 Mobilizer Intelligence (Challenger Customer)</div>
                        <div style={{background:"#EEF5F9",border:"1px solid #1B3A6B33",borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                          <div style={{fontSize:9,fontWeight:700,color:"#1B3A6B",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>Who Moves Deals — Not Talkers or Blockers</div>
                          <div style={{fontSize:13,color:"#333",lineHeight:1.6,marginBottom:8}}>{brief.mobilizer.description}</div>
                          {brief.mobilizer.identifyingBehavior&&(
                            <div style={{marginBottom:8}}>
                              <div style={{fontSize:9,fontWeight:700,color:"#1B3A6B",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>How to Spot Them in a Meeting</div>
                              <div style={{fontSize:12,color:"#555",lineHeight:1.5,fontStyle:"italic"}}>{brief.mobilizer.identifyingBehavior}</div>
                            </div>
                          )}
                          {brief.mobilizer.teachingAngle&&(
                            <div style={{background:"#1a1a18",borderRadius:7,padding:"8px 12px"}}>
                              <div style={{fontSize:9,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>⚡ Challenger Teaching Angle</div>
                              <div style={{fontSize:12,color:"#fff",lineHeight:1.5,fontStyle:"italic"}}>{brief.mobilizer.teachingAngle}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Relevant Case Studies */}
                    {(brief.caseStudies||[]).filter(c=>c?.title).length>0&&(
                      <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #E8E6DF"}}>
                        <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#8B6F47",marginBottom:10}}>Relevant Case Studies & Customers</div>
                        {(brief.caseStudies||[]).filter(c=>c?.title).map((cs,i)=>(
                          <div key={i} style={{display:"flex",gap:10,marginBottom:10,padding:"9px 12px",background:"#FAF8F4",borderRadius:8,border:"1px solid #E8E6DF"}}>
                            <div style={{fontSize:18,lineHeight:1,flexShrink:0}}>📄</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:14,fontWeight:600,color:"#1a1a18",marginBottom:2}}>{cs.title}</div>
                              {cs.customer&&<div style={{fontSize:12,color:"#8B6F47",fontWeight:600,marginBottom:3}}>{cs.customer}</div>}
                              {cs.result&&(
                                <div style={{fontSize:12,fontWeight:700,color:"#2E6B2E",background:"#EEF5EE",borderRadius:10,padding:"2px 8px",display:"inline-block",marginBottom:4}}>
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
                          <div key={key} style={{display:"flex",alignItems:"center",gap:6,background:"#F0EDE6",border:"1px solid #D4C4A8",borderRadius:20,padding:"4px 12px"}}>
                            <span style={{fontSize:10,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.3px"}}>{label}</span>
                            <span style={{fontSize:13,fontWeight:600,color:"#1a1a18"}}>{brief.techStack[key]}</span>
                          </div>
                        ))}
                        {(brief.techStack.other||[]).filter(Boolean).map((t,i)=>(
                          <div key={i} style={{display:"flex",alignItems:"center",gap:6,background:"#F8F6F1",border:"1px solid #E8E6DF",borderRadius:20,padding:"4px 12px"}}>
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
                          <div style={{background:"#F7F6F2",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>👥 Workforce</div>
                            {brief.workforceProfile.knowledgeWorkerPct&&<div style={{fontSize:12,color:"#333",marginBottom:3}}>Knowledge workers: <strong>{brief.workforceProfile.knowledgeWorkerPct}</strong></div>}
                            {brief.workforceProfile.unionizedPct&&<div style={{fontSize:12,color:"#333",marginBottom:3}}>Unionized: <strong style={{color:brief.workforceProfile.unionizedPct.includes("high")||parseFloat(brief.workforceProfile.unionizedPct)>30?"#9B2C2C":"#333"}}>{brief.workforceProfile.unionizedPct}</strong></div>}
                            {brief.workforceProfile.remotePolicy&&<div style={{fontSize:12,color:"#555"}}>{brief.workforceProfile.remotePolicy}</div>}
                            {brief.workforceProfile.avgTenure&&<div style={{fontSize:11,color:"#aaa",marginTop:3}}>Avg tenure: {brief.workforceProfile.avgTenure}</div>}
                          </div>
                        )}
                        {/* Culture */}
                        {brief.cultureProfile?.coreValues&&(
                          <div style={{background:"#F7F6F2",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#6B3A7A",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>🎭 Culture</div>
                            {brief.cultureProfile.coreValues&&<div style={{fontSize:12,color:"#333",marginBottom:4}}><strong>Values:</strong> {brief.cultureProfile.coreValues}</div>}
                            {brief.cultureProfile.communicationStyle&&<div style={{fontSize:12,color:"#555",marginBottom:2}}><strong>Style:</strong> {brief.cultureProfile.communicationStyle}</div>}
                            {brief.cultureProfile.sellerLanguageHint&&(
                              <div style={{marginTop:6,padding:"5px 8px",background:"#F3EEF9",borderRadius:6,fontSize:11,color:"#6B3A7A",fontStyle:"italic"}}>
                                💬 {brief.cultureProfile.sellerLanguageHint}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Incumbents */}
                        {(brief.incumbentVendors?.hrSystem||brief.incumbentVendors?.financeSystem||brief.incumbentVendors?.crmSystem)&&(
                          <div style={{background:"#FDE8E833",border:"1px solid #9B2C2C33",borderRadius:8,padding:"10px 12px",gridColumn:"1/-1"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#9B2C2C",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>⚔️ Incumbent Vendors — Know What You're Displacing</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                              {[
                                {label:"HR/HCM",val:brief.incumbentVendors.hrSystem},
                                {label:"Finance/ERP",val:brief.incumbentVendors.financeSystem},
                                {label:"CRM",val:brief.incumbentVendors.crmSystem},
                                {label:"Cards",val:brief.incumbentVendors.cardProvider},
                              ].filter(x=>x.val).map((x,i)=>(
                                <div key={i} style={{display:"flex",alignItems:"center",gap:5,background:"#fff",border:"1px solid #9B2C2C33",borderRadius:20,padding:"3px 10px"}}>
                                  <span style={{fontSize:10,fontWeight:700,color:"#9B2C2C",textTransform:"uppercase"}}>{x.label}</span>
                                  <span style={{fontSize:12,fontWeight:700,color:"#1a1a18"}}>{x.val}</span>
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
                              {i>0&&<div style={{width:14,height:2,background:i<=activeIdx?colors[i]+"66":"#E8E6DF",borderRadius:1}}/>}
                              <div style={{padding:"4px 11px",borderRadius:20,fontSize:12,fontWeight:700,
                                background:i===activeIdx?colors[i]:i<activeIdx?colors[i]+"22":"#F0EDE6",
                                color:i===activeIdx?"#fff":i<activeIdx?colors[i]:"#bbb",
                                border:"1.5px solid "+(i<=activeIdx?colors[i]:"#E8E6DF")}}>
                                {stage}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                      <EF value={brief.processMaturity.maturityNote||""} onChange={v=>patchBrief(b=>{if(!b.processMaturity)b.processMaturity={};b.processMaturity.maturityNote=v;})}/>
                      {(brief.processMaturity.processGaps||[]).filter(Boolean).length>0&&(
                        <div style={{marginTop:12}}>
                          <div style={{fontSize:11,fontWeight:700,color:"#BA7517",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Process Gaps</div>
                          {brief.processMaturity.processGaps.filter(Boolean).map((g,i)=>(
                            <div key={i} style={{display:"flex",gap:7,marginBottom:5}}>
                              <div style={{width:5,height:5,borderRadius:"50%",background:"#BA7517",flexShrink:0,marginTop:6}}/>
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
                        <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<((brief.keyContacts||[]).filter(x=>x?.name||x?.title).length-1)?"1px solid #F0EDE6":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                            <div style={{width:30,height:30,borderRadius:"50%",background:"#2E6B2E",color:"#fff",fontFamily:"Lora,serif",fontWeight:700,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              {c.initials||"?"}
                            </div>
                            <div>
                              <div style={{fontSize:14,fontWeight:700,color:"#1a1a18"}}>{c.name||"Unknown"}</div>
                              <div style={{fontSize:12,color:"#2E6B2E",fontWeight:600}}>{c.title||""}</div>
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
                          <div className="sig-dot" style={{background:"#9B2C2C"}}/>
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
                  <button className="btn btn-green btn-lg" onClick={()=>{if(!riverHypo&&!riverHypoLoading&&brief)buildRiverHypo(brief,selectedAccount);setStep(5);}}>Review Hypothesis →</button>
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

            {/* Recommended Solutions — surface at top so rep is anchored */}
            {(brief?.solutionMapping||[]).filter(s=>s?.product).length>0&&(
              <div style={{background:"#1B3A6B",borderRadius:14,padding:"16px 20px",marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:700,color:"#B8CCE4",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>
                  🎯 Solutions You're Selling into {selectedAccount?.company}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {(brief.solutionMapping||[]).filter(s=>s?.product).map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{background:"#2C5282",color:"#fff",fontFamily:"Lora,serif",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:6,whiteSpace:"nowrap",flexShrink:0,marginTop:2}}>
                        {s.product}
                      </div>
                      <div style={{fontSize:13,color:"#C8D8EC",lineHeight:1.6}}>{s.fit}</div>
                    </div>
                  ))}
                </div>
                {brief?.openingAngle&&(
                  <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid #2C5282"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>Opening Angle</div>
                    <div style={{fontSize:13,color:"#fff",lineHeight:1.6,fontStyle:"italic"}}>"{brief.openingAngle}"</div>
                  </div>
                )}
              </div>
            )}

            {riverHypoLoading&&(
              <div className="load-box" style={{marginBottom:20}}>
                <div className="load-status">
                  <div className="load-spin"/>
                  Building RIVER hypothesis...
                </div>
                <div style={{height:3,background:"#F0EDE6",borderRadius:2,overflow:"hidden",marginTop:12}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#8B6F47,#1B3A6B,#2E6B2E,#8B6F47)",backgroundSize:"300% 100%",animation:"shimmer 2.5s linear infinite",borderRadius:2}}/>
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
                  {key:"reality",    label:"R — Reality",      icon:"📍", sub:"Current state", color:"#1B3A6B"},
                  {key:"impact",     label:"I — Impact",       icon:"💥", sub:"Cost of inaction", color:"#9B2C2C"},
                  {key:"vision",     label:"V — Vision",       icon:"🔭", sub:"What success looks like", color:"#2E6B2E"},
                  {key:"entryPoints",label:"E — Entry Points", icon:"🚪", sub:"Decision-makers", color:"#6B3A7A"},
                  {key:"route",      label:"R — Route",        icon:"🗺", sub:"Fastest path to close", color:"#8B6F47"},
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
                      <div style={{background:"#1a1a18",borderRadius:8,padding:"12px 16px"}}>
                        <div style={{fontSize:9,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>The Insight (Challenger Customer)</div>
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
                        {key:"judgeIndecision",label:"J — Judge the Indecision",color:"#BA7517",bg:"#FEF6E4",icon:"🔍"},
                        {key:"recommendation",label:"O — Offer Your Recommendation",color:"#2E6B2E",bg:"#EEF5EE",icon:"🎯"},
                        {key:"limitExploration",label:"L — Limit the Exploration",color:"#1B3A6B",bg:"#EEF5F9",icon:"🔬"},
                        {key:"takeRiskOff",label:"T — Take Risk Off the Table",color:"#6B3A7A",bg:"#F3EEF9",icon:"🛡"},
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
                        <div key={i} style={{borderLeft:"3px solid #8B6F47",paddingLeft:12}}>
                          <div style={{fontSize:10,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>{t.stage}</div>
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
              <div style={{background:"#FAF8F4",border:"1.5px dashed #C8C4BB",borderRadius:12,padding:24,textAlign:"center",color:"#aaa",fontSize:13}}>
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
              <button className="btn btn-green btn-lg" onClick={()=>{setActiveRiver(0);setStep(6);}}>
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
            <div style={{height:4,background:"#F0EDE6",borderRadius:2,marginBottom:24,overflow:"hidden"}}>
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
                      <div style={{display:"flex",gap:8,marginTop:16,paddingTop:14,borderTop:"1px solid #F0EDE6"}}>
                        {si>0&&<button className="btn btn-secondary btn-sm" onClick={()=>setActiveRiver(si-1)}>← {RIVER_STAGES[si-1].label}</button>}
                        {si<RIVER_STAGES.length-1&&<button className="btn btn-gold btn-sm" onClick={()=>setActiveRiver(si+1)}>{RIVER_STAGES[si+1].label} →</button>}
                        {si===RIVER_STAGES.length-1&&<button className="btn btn-green btn-sm" onClick={runPostCall} disabled={postLoading}>{postLoading?"Routing...":"End Call & Route Deal →"}</button>}
                      </div>
                    </div>

                    {/* Discovery Questions — product-specific */}
                    <div className="stage-card">
                      <div style={{fontFamily:"Lora,serif",fontSize:15,fontWeight:600,marginBottom:16,color:"#1a1a18"}}>
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
                          <div key={qi} className="dq-block" style={{borderLeftColor:"#1B3A6B"}}>
                            <div className="dq-framework" style={{color:"#1B3A6B"}}>{dq.framework||"Active Listening"}</div>
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
                    <div style={{background:"#1a1a18",borderRadius:12,padding:"16px 18px",marginBottom:14}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>Talk Track</div>
                      <div style={{fontSize:14,color:"#fff",lineHeight:1.7,fontStyle:"italic"}}>{stage.talkTrack}</div>
                    </div>

                    {/* Objection Handling */}
                    <div className="stage-card">
                      <div style={{fontSize:13,fontWeight:700,color:"#9B2C2C",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>⚡ Objection Handling</div>
                      {stage.objections.map((o,oi)=>(
                        <div key={oi} style={{marginBottom:10}}>
                          <button style={{width:"100%",textAlign:"left",padding:"10px 14px",borderRadius:8,border:"1px solid #E8E6DF",background:"#FDE8E8",cursor:"pointer",fontSize:13,fontWeight:600,color:"#9B2C2C",fontFamily:"DM Sans,sans-serif"}}
                            onClick={()=>setExpandedObjs(s=>({...s,[si+"-"+oi]:!s[si+"-"+oi]}))}>
                            "{o.q}" <span style={{float:"right",color:"#bbb"}}>{expandedObjs[si+"-"+oi]?"▲":"▼"}</span>
                          </button>
                          {expandedObjs[si+"-"+oi]&&(
                            <div style={{padding:"10px 14px",background:"#F8F6F1",borderRadius:"0 0 8px 8px",border:"1px solid #E8E6DF",borderTop:"none",fontSize:13,color:"#333",lineHeight:1.6,fontStyle:"italic"}}>
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
                  <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#8B6F47",marginBottom:8}}>Call Notes</div>
                  <textarea style={{width:"100%",minHeight:160,padding:10,border:"1px solid #E8E6DF",borderRadius:8,fontSize:13,fontFamily:"DM Sans",background:"#FAFAF8",resize:"vertical"}}
                    placeholder="Free-form notes... Tab = timestamp"
                    value={notes} onChange={e=>setNotes(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Tab"){e.preventDefault();const ts=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});const el=e.target;const b=el.value.slice(0,el.selectionStart);const a=el.value.slice(el.selectionStart);el.value=b+"\n["+ts+"] "+a;setNotes(el.value);}}}/>
                  <div style={{fontSize:10,color:"#aaa",marginTop:4}}>Tab inserts timestamp · feeds post-call summary</div>
                </div>

                {/* Opening Angle */}
                {brief?.openingAngle&&(
                  <div className="incall-sidebar" style={{marginBottom:14,borderLeft:"3px solid #8B6F47"}}>
                    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#8B6F47",marginBottom:6}}>Opening Angle</div>
                    <div style={{fontSize:13,color:"#333",lineHeight:1.6,fontStyle:"italic"}}>"{brief.openingAngle}"</div>
                  </div>
                )}

                {/* Solutions quick ref */}
                {(brief?.solutionMapping||[]).filter(s=>s?.product).length>0&&(
                  <div className="incall-sidebar" style={{marginBottom:14}}>
                    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#1B3A6B",marginBottom:8}}>Solutions</div>
                    {(brief.solutionMapping||[]).filter(s=>s?.product).map((s,i)=>(
                      <div key={i} style={{marginBottom:8,paddingBottom:8,borderBottom:i<(brief.solutionMapping.filter(x=>x?.product).length-1)?"1px solid #F0EDE6":"none"}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#1a1a18",marginBottom:2}}>{s.product}</div>
                        <div style={{fontSize:11,color:"#666",lineHeight:1.5}}>{s.fit}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Watch-outs */}
                {(brief?.watchOuts||[]).filter(Boolean).length>0&&(
                  <div className="incall-sidebar">
                    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#9B2C2C",marginBottom:8}}>⚠ Watch-Outs</div>
                    {(brief.watchOuts||[]).filter(Boolean).map((w,i)=>(
                      <div key={i} style={{fontSize:12,color:"#555",paddingBottom:6,marginBottom:6,borderBottom:i<brief.watchOuts.filter(Boolean).length-1?"1px solid #F0EDE6":"none",lineHeight:1.5}}>
                        {w}
                      </div>
                    ))}
                  </div>
                )}

                {brief?.processMaturity?.dmiacStage&&(
                  <div className="incall-sidebar" style={{marginTop:14}}>
                    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#1B3A6B",marginBottom:8}}>⚙️ DMAIC Stage</div>
                    <div style={{display:"flex",gap:3,marginBottom:8,flexWrap:"wrap"}}>
                      {(()=>{
                        const stages=["Define","Measure","Analyze","Improve","Control"];
                        const colors=["#9B2C2C","#BA7517","#1B3A6B","#2E6B2E","#6B3A7A"];
                        const ai=stages.indexOf(brief.processMaturity.dmiacStage);
                        return stages.map((s,i)=>(
                          <span key={s} style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,
                            background:i===ai?colors[i]:i<ai?colors[i]+"22":"#F0EDE6",
                            color:i===ai?"#fff":i<ai?colors[i]:"#aaa",
                            border:"1px solid "+(i<=ai?colors[i]:"#E8E6DF")}}>
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
                    <div style={{fontWeight:600,marginBottom:9,color:"#1a1a18"}}>Subject: {postCall.emailSubject}</div>
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

        {/* ── STEP 8: SOLUTION FIT REVIEW ── */}
        {step===9&&(
          <div className="page">
            <div className="page-title">Solution Architecture Review</div>
            <div className="page-sub">Post-call solution fit re-evaluation for <strong>{selectedAccount?.company}</strong> — aligned to what you actually heard, not just what you assumed.</div>

            {solutionFitLoading&&(
              <div className="card">
                <div style={{fontSize:13,color:"#777",marginBottom:12}}>Applying Solution Architecture framework to your discovery capture...</div>
                  <div className="pulse-wrap">{[70,90,55,80,65,75,50].map((w,i)=><div key={i} className="pulse-line" style={{width:w+"%",animationDelay:(i*0.12)+"s"}}/>)}</div>                <div style={{fontSize:12,color:"#8B6F47",marginTop:12,fontStyle:"italic"}}>
                  Evaluating business alignment, integration complexity, and implementation phasing...
                </div>
              </div>
            )}

            {solutionFit&&!solutionFitLoading&&(
              <>
                {/* PMF Assessment */}
                {solutionFit.pmfAssessment&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginBottom:20}}>
                    {[
                      {label:"Target Customer Fit",val:solutionFit.pmfAssessment.targetCustomerFit},
                      {label:"Underserved Need",val:solutionFit.pmfAssessment.underservedNeedFit},
                      {label:"Value Prop Fit",val:solutionFit.pmfAssessment.valuePropositionFit},
                      {label:"Overall PMF Signal",val:solutionFit.pmfAssessment.overallPMFSignal},
                    ].filter(x=>x.val).map((x,i)=>{
                      const isStrong=x.val?.toLowerCase().includes("strong");
                      const isWeak=x.val?.toLowerCase().includes("weak");
                      const c=isStrong?"#2E6B2E":isWeak?"#9B2C2C":"#BA7517";
                      const bg=isStrong?"#EEF5EE":isWeak?"#FDE8E8":"#FEF6E4";
                      return(
                        <div key={i} style={{background:bg,border:"1px solid "+c+"44",borderRadius:10,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:c,textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>{x.label}</div>
                          <div style={{fontSize:13,fontWeight:700,color:c}}>{x.val}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {solutionFit.adoptionProfile&&(
                  <div style={{background:"#EEF5F9",border:"1px solid #1B3A6B44",borderRadius:10,padding:"12px 16px",marginBottom:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#1B3A6B",textTransform:"uppercase",letterSpacing:"0.4px"}}>📊 Adoption Profile (Moore)</div>
                      <span style={{background:"#1B3A6B",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>{solutionFit.adoptionProfile}</span>
                    </div>
                    {solutionFit.adoptionImplication&&<div style={{fontSize:13,color:"#333",lineHeight:1.6}}>{solutionFit.adoptionImplication}</div>}
                  </div>
                )}

                {solutionFit.dmiacStage&&(
                  <div style={{background:"#F8F6F1",border:"1px solid #E8E6DF",borderRadius:14,padding:"16px 20px",marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,flexWrap:"wrap"}}>
                      <div style={{fontFamily:"Lora,serif",fontSize:15,fontWeight:600,color:"#1a1a18"}}>DMAIC Stage:</div>
                      {(()=>{
                        const map={Define:"#9B2C2C",Measure:"#BA7517",Analyze:"#1B3A6B",Improve:"#2E6B2E",Control:"#6B3A7A"};
                        const bgmap={Define:"#FDE8E8",Measure:"#FEF6E4",Analyze:"#EEF5F9",Improve:"#EEF5EE",Control:"#F3EEF9"};
                        const c=map[solutionFit.dmiacStage]||"#555";
                        const bg=bgmap[solutionFit.dmiacStage]||"#F8F6F1";
                        return<span style={{background:bg,color:c,border:"1.5px solid "+c+"44",borderRadius:20,padding:"4px 16px",fontSize:14,fontWeight:700}}>{solutionFit.dmiacStage}</span>;
                      })()}
                    </div>
                    {solutionFit.dmiacRationale&&<div style={{fontSize:14,color:"#555",lineHeight:1.6,marginBottom:solutionFit.entryStrategy?10:0}}>{solutionFit.dmiacRationale}</div>}
                    {solutionFit.entryStrategy&&(
                      <div style={{background:"#1a1a18",borderRadius:8,padding:"10px 14px"}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>Recommended Entry Strategy</div>
                        <div style={{fontSize:13,color:"#fff",lineHeight:1.6}}>{solutionFit.entryStrategy}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Integration complexity badge */}
                <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
                  <div style={{fontFamily:"Lora,serif",fontSize:16,fontWeight:600,color:"#1a1a18"}}>
                    Integration Complexity:
                  </div>
                  {(()=>{
                    const ic=(solutionFit.integrationComplexity||"").split("/")[0].trim().toLowerCase();
                    const c=ic==="low"?"#2E6B2E":ic==="medium"?"#BA7517":"#9B2C2C";
                    const bg=ic==="low"?"#EEF5EE":ic==="medium"?"#FEF6E4":"#FDE8E8";
                    return<span style={{background:bg,color:c,border:"1px solid "+c+"44",borderRadius:20,padding:"4px 14px",fontSize:14,fontWeight:700}}>
                      {solutionFit.integrationComplexity}
                    </span>;
                  })()}
                </div>

                {/* Confirmed Solutions */}
                {(solutionFit.confirmedSolutions||[]).length>0&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon">✓</div>
                      <div><div className="bb-title">Confirmed Solution Fit</div><div className="bb-sub">Solutions validated by discovery — with SA rationale</div></div>
                    </div>
                    <div className="bb-body">
                      {solutionFit.confirmedSolutions.map((s,i)=>(
                        <div key={i} style={{marginBottom:16,paddingBottom:16,borderBottom:i<solutionFit.confirmedSolutions.length-1?"1px solid #F0EDE6":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                            <div style={{background:"#F0EDE6",color:"#7A5C30",border:"1px solid #D4C4A8",fontFamily:"Lora,serif",fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:6,whiteSpace:"nowrap"}}>
                              {s.product}
                            </div>
                            <div style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,
                              background:s.fitScore>=75?"#EEF5EE":s.fitScore>=50?"#FEF6E4":"#FDE8E8",
                              color:s.fitScore>=75?"#2E6B2E":s.fitScore>=50?"#BA7517":"#9B2C2C",
                              border:"1px solid "+(s.fitScore>=75?"#2E6B2E":s.fitScore>=50?"#BA7517":"#9B2C2C")+"44"}}>
                              {s.fitScore}% · {s.fitLabel}
                            </div>
                            <div style={{fontSize:11,background:"#F8F6F1",border:"1px solid #E8E6DF",borderRadius:10,padding:"2px 10px",color:"#555"}}>
                              {s.implementationPhase}
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                            <div>
                              <div style={{fontSize:11,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>Business Alignment</div>
                              <div style={{fontSize:13,color:"#333",lineHeight:1.6}}>{s.businessAlignment}</div>
                            </div>
                            <div>
                              <div style={{fontSize:11,fontWeight:700,color:"#1B3A6B",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>Architecture Notes</div>
                              <div style={{fontSize:13,color:"#333",lineHeight:1.6}}>{s.architectureNotes}</div>
                            </div>
                          </div>
                          {s.risks&&(
                            <div style={{marginTop:8,padding:"8px 10px",background:"#FDE8E8",borderRadius:6,fontSize:12,color:"#9B2C2C"}}>
                              ⚠ {s.risks}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Revised / Changed Solutions */}
                {(solutionFit.revisedSolutions||[]).length>0&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:14}}>↕</div>
                      <div><div className="bb-title">Revised After Discovery</div><div className="bb-sub">Solutions that changed based on what you actually heard</div></div>
                    </div>
                    <div className="bb-body">
                      {solutionFit.revisedSolutions.map((r,i)=>(
                        <div key={i} style={{display:"flex",gap:10,padding:"10px 12px",background:"#FAF8F4",borderRadius:8,marginBottom:8,border:"1px solid #E8E6DF"}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                              <span style={{fontWeight:700,fontSize:13,color:"#1a1a18"}}>{r.product}</span>
                              <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10,
                                background:r.change==="Upgraded"?"#EEF5EE":r.change==="Removed"?"#FDE8E8":"#FEF6E4",
                                color:r.change==="Upgraded"?"#2E6B2E":r.change==="Removed"?"#9B2C2C":"#BA7517"}}>
                                {r.change}
                              </span>
                            </div>
                            <div style={{fontSize:13,color:"#555",lineHeight:1.5}}>{r.reason}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architecture Gaps */}
                {(solutionFit.architectureGaps||[]).length>0&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:14}}>🔍</div>
                      <div><div className="bb-title">Architecture Gaps</div><div className="bb-sub">Customer needs not fully addressed — recommendations to bridge</div></div>
                    </div>
                    <div className="bb-body">
                      {solutionFit.architectureGaps.map((g,i)=>(
                        <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<solutionFit.architectureGaps.length-1?"1px solid #F0EDE6":"none"}}>
                          <div style={{fontSize:13,fontWeight:600,color:"#9B2C2C",marginBottom:4}}>Gap: {g.gap}</div>
                          <div style={{fontSize:13,color:"#2E6B2E",lineHeight:1.5}}>→ {g.recommendation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Implementation Roadmap */}
                {solutionFit.implementationRoadmap&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:14}}>🗺</div>
                      <div><div className="bb-title">Implementation Roadmap</div><div className="bb-sub">Recommended phasing based on their outcomes and architecture</div></div>
                    </div>
                    <div className="bb-body">
                      <div style={{fontSize:14,color:"#333",lineHeight:1.7}}>{solutionFit.implementationRoadmap}</div>
                    </div>
                  </div>
                )}

                {/* Success Metrics */}
                {(solutionFit.successMetrics||[]).filter(Boolean).length>0&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:14}}>📊</div>
                      <div><div className="bb-title">Success Metrics</div><div className="bb-sub">What winning looks like — measurable, tied to their outcomes</div></div>
                    </div>
                    <div className="bb-body">
                      {solutionFit.successMetrics.filter(Boolean).map((m,i)=>(
                        <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-start"}}>
                          <div style={{width:20,height:20,borderRadius:"50%",background:"#2E6B2E",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                          <div style={{fontSize:14,color:"#333",lineHeight:1.6}}>{m}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SA Recommendation */}
                {solutionFit.saRecommendation&&(
                  <div style={{background:"#1a1a18",borderRadius:14,padding:"20px 22px",marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>🏗 Senior SA Recommendation</div>
                    <div style={{fontSize:15,color:"#fff",lineHeight:1.7,fontStyle:"italic"}}>"{solutionFit.saRecommendation}"</div>
                  </div>
                )}

                <div className="actions-row">
                  <button className="btn btn-secondary" onClick={()=>setStep(8)}>← Post-Call</button>
                  <button className="btn btn-secondary" onClick={()=>{setSolutionFit(null);setSolutionFitLoading(true);setTimeout(buildSolutionFit,100);}}>↻ Regenerate</button>
                  <button className="btn btn-navy" onClick={doExport}>🖨 Save as PDF</button>
                  <button className="btn btn-primary" onClick={()=>{setStep(3);setSelectedAccount(null);setGateAnswers({});setRiverData({});setPostCall(null);setSolutionFit(null);setBrief(null);setNotes("");setContactRole("");}}>Next Account</button>
                </div>
              </>
            )}

            {!solutionFit&&!solutionFitLoading&&(
              <div style={{background:"#FAF8F4",border:"1.5px dashed #C8C4BB",borderRadius:12,padding:32,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:12}}>🏗</div>
                <div style={{fontSize:15,fontWeight:600,color:"#1a1a18",marginBottom:6}}>Solution Architecture Review</div>
                <div style={{fontSize:13,color:"#777",marginBottom:20,maxWidth:400,margin:"0 auto 20px"}}>Re-evaluate solution fit against what you heard in the call. Maps customer needs to your solutions using SA principles.</div>
                <button className="btn btn-primary btn-lg" onClick={buildSolutionFit}>Run Solution Fit Review →</button>
              </div>
            )}
          </div>
        )}

      </div>
      <footer className="footer">
        © 2026 Cambrian Catalyst LLC · Seattle, WA · All rights reserved
      </footer>
    </>
  );
}
