import { useState, useCallback, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #FAFAF8; color: #1a1a18; }
.app { min-height: 100vh; display: flex; flex-direction: column; }

.header { background: #fff; border-bottom: 1px solid #E8E6DF; padding: 0 28px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 200; flex-shrink: 0; }
.logo { font-family: 'Lora', serif; font-size: 16px; color: #1a1a18; white-space: nowrap; }
.logo span { color: #8B6F47; }
.stepper { display: flex; align-items: center; overflow-x: auto; }
.step-item { display: flex; align-items: center; gap: 6px; padding: 0 10px; font-size: 10px; font-weight: 600; color: #bbb; letter-spacing: 0.4px; text-transform: uppercase; cursor: default; white-space: nowrap; }
.step-item.active { color: #1a1a18; }
.step-item.done { color: #8B6F47; cursor: pointer; }
.step-num { width: 19px; height: 19px; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
.step-item.done .step-num { background: #8B6F47; border-color: #8B6F47; color: #fff; }
.step-item.active .step-num { background: #1a1a18; border-color: #1a1a18; color: #fff; }
.step-div { width: 14px; height: 1px; background: #E8E6DF; flex-shrink: 0; }
.live-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; color: #2E6B2E; background: #EEF5EE; padding: 3px 9px; border-radius: 20px; }
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #2E6B2E; animation: blink 1.2s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1}50%{opacity:0.3} }

.page { max-width: 880px; margin: 0 auto; padding: 36px 28px 72px; width: 100%; }
.page-title { font-family: 'Lora', serif; font-size: 24px; font-weight: 500; margin-bottom: 6px; }
.page-sub { font-size: 13px; color: #777; line-height: 1.65; margin-bottom: 28px; max-width: 580px; }

/* SESSION SETUP */
.setup-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 14px; padding: 32px; max-width: 520px; margin: 60px auto 0; }
.setup-logo { font-family: 'Lora', serif; font-size: 22px; color: #1a1a18; margin-bottom: 6px; text-align: center; }
.setup-logo span { color: #8B6F47; }
.setup-sub { font-size: 13px; color: #999; text-align: center; margin-bottom: 28px; line-height: 1.6; }
.setup-divider { height: 1px; background: #E8E6DF; margin: 20px 0; }
.setup-url-bar { display: flex; align-items: center; gap: 8px; background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 8px; padding: 4px 12px; margin-bottom: 10px; }
.setup-url-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #aaa; white-space: nowrap; min-width: 80px; }
.setup-url-input { border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1a1a18; outline: none; width: 100%; padding: 6px 0; }

/* UPLOAD */
.upload-zone { border: 1.5px dashed #C8C4BB; border-radius: 12px; padding: 40px 24px; text-align: center; cursor: pointer; transition: all 0.2s; background: #fff; }
.upload-zone:hover, .upload-zone.drag { border-color: #8B6F47; background: #FAF8F4; }
.upload-label { font-family: 'Lora', serif; font-size: 15px; color: #1a1a18; margin-bottom: 5px; }
.upload-hint { font-size: 12px; color: #999; margin-bottom: 16px; }

/* BUTTONS */
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; border: none; line-height: 1; white-space: nowrap; }
.btn:disabled { opacity: 0.4; cursor: default; }
.btn-primary { background: #1a1a18; color: #fff; }
.btn-primary:hover:not(:disabled) { background: #333; }
.btn-secondary { background: transparent; border: 1.5px solid #C8C4BB; color: #1a1a18; }
.btn-secondary:hover:not(:disabled) { border-color: #8B6F47; color: #8B6F47; }
.btn-gold { background: #8B6F47; color: #fff; }
.btn-gold:hover:not(:disabled) { background: #7A6040; }
.btn-green { background: #2E6B2E; color: #fff; }
.btn-green:hover:not(:disabled) { background: #245424; }
.btn-lg { padding: 12px 22px; font-size: 14px; }
.btn-sm { padding: 5px 11px; font-size: 11px; }
.actions-row { display: flex; gap: 10px; margin-top: 24px; align-items: center; flex-wrap: wrap; }

/* CARDS */
.card { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 20px; margin-bottom: 14px; }
.card-title { font-family: 'Lora', serif; font-size: 14px; font-weight: 500; margin-bottom: 13px; }

/* FORMS */
.field-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.field-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.field-label .req { color: #8B6F47; }
.field-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
input[type=text], select, textarea { width: 100%; padding: 8px 11px; border: 1px solid #E8E6DF; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1a1a18; background: #FAFAF8; outline: none; transition: border-color 0.15s; resize: vertical; appearance: none; }
input[type=text]:focus, select:focus, textarea:focus { border-color: #8B6F47; background: #fff; }

/* TABLE */
.tbl-wrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: 11px; }
.tbl th { background: #F5F3EE; padding: 6px 10px; text-align: left; font-weight: 600; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; white-space: nowrap; }
.tbl td { padding: 6px 10px; border-top: 1px solid #F0EDE6; color: #333; white-space: nowrap; }

/* STATS */
.summary-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
.stat-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 10px; padding: 14px; text-align: center; }
.stat-num { font-family: 'Lora', serif; font-size: 22px; color: #8B6F47; margin-bottom: 2px; }
.stat-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.4px; }

/* COHORT CARDS */
.cohort-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); gap: 11px; margin-bottom: 22px; }
.cohort-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 12px; padding: 15px 17px; cursor: pointer; transition: all 0.18s; }
.cohort-card:hover { border-color: #8B6F47; }
.cohort-card.selected { border-color: #8B6F47; background: #FAF8F4; }
.cohort-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; flex-shrink: 0; }
.cohort-name { font-family: 'Lora', serif; font-size: 13px; font-weight: 500; margin-bottom: 3px; display: flex; align-items: center; }
.cohort-size { font-size: 10px; color: #aaa; margin-bottom: 8px; }
.tag-row { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px; }
.tag { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
.tag-ind { background: #EEF2F8; color: #3A5A8C; }
.tag-size { background: #F3EDE6; color: #7A5C30; }
.tag-src { background: #EEF5EE; color: #2E6B2E; }
.tag-out { background: #F5EEF5; color: #6B3A7A; }
.cohort-stat { font-size: 10px; color: #777; }
.cohort-stat strong { color: #1a1a18; }

/* ACCOUNT LIST */
.account-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
.account-item { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 14px; cursor: pointer; transition: all 0.15s; }
.account-item:hover { border-color: #8B6F47; }
.account-item.selected { border-color: #8B6F47; background: #FAF8F4; }
.account-item.loading { border-color: #8B6F47; background: #FAF8F4; animation: borderPulse 1.5s ease-in-out infinite; }
@keyframes borderPulse { 0%,100%{border-color:#8B6F47}50%{border-color:#C8A87A} }
.account-name { font-size: 13px; font-weight: 500; color: #1a1a18; }
.account-meta { font-size: 11px; color: #999; margin-top: 2px; }
.account-right { display: flex; align-items: center; gap: 10px; }
.account-acv { font-size: 12px; font-weight: 600; color: #8B6F47; }
.research-indicator { font-size: 10px; color: #8B6F47; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.research-dot { width: 5px; height: 5px; border-radius: 50%; background: #8B6F47; animation: blink 1s ease-in-out infinite; }

/* OUTCOME TILES */
.outcome-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; }
.outcome-tile { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 9px; padding: 12px; cursor: pointer; transition: all 0.18s; }
.outcome-tile:hover { border-color: #8B6F47; }
.outcome-tile.selected { border-color: #8B6F47; background: #FAF8F4; }
.outcome-icon { font-size: 16px; margin-bottom: 5px; }
.outcome-title { font-size: 11px; font-weight: 600; margin-bottom: 2px; }
.outcome-sub { font-size: 10px; color: #999; line-height: 1.4; }

/* RIVER BADGE */
.river-badge { display: inline-flex; align-items: center; gap: 5px; background: #1a1a18; border-radius: 7px; padding: 5px 12px; margin-bottom: 20px; flex-wrap: wrap; }
.river-letter { font-family: 'Lora', serif; font-size: 12px; font-weight: 600; color: #8B6F47; }
.river-sep { color: #444; font-size: 10px; }
.river-word { font-size: 10px; color: rgba(255,255,255,0.5); }

/* INLINE EDITABLE FIELDS */
.editable-field { position: relative; cursor: text; }
.editable-field:hover .edit-hint { opacity: 1; }
.edit-hint { position: absolute; top: -18px; right: 0; font-size: 9px; color: #8B6F47; font-weight: 600; opacity: 0; transition: opacity 0.15s; text-transform: uppercase; letter-spacing: 0.4px; pointer-events: none; }
.editable-text { font-size: 12px; color: #333; line-height: 1.6; padding: 6px 8px; border-radius: 6px; border: 1px solid transparent; transition: all 0.15s; min-height: 36px; }
.editable-text:hover { border-color: #E8E6DF; background: #FAFAF8; }
.editable-text:focus { border-color: #8B6F47; background: #fff; outline: none; }
.editable-text[data-empty="true"] { color: #bbb; font-style: italic; }

/* BRIEF SECTIONS */
.brief-section { margin-bottom: 5px; }
.brief-section-header { display: flex; align-items: center; gap: 8px; padding: 10px 14px 6px; }
.brief-icon { width: 26px; height: 26px; border-radius: 6px; background: #1a1a18; display: flex; align-items: center; justify-content: center; font-family: 'Lora', serif; font-size: 12px; font-weight: 600; color: #8B6F47; flex-shrink: 0; }
.brief-section-title { font-family: 'Lora', serif; font-size: 13px; font-weight: 500; }
.brief-section-sub { font-size: 11px; color: #777; }
.brief-content { padding: 0 14px 12px; }

/* SOLUTION MAPPING */
.solution-map { background: #F8F6F1; border: 1px solid #E8E6DF; border-radius: 10px; padding: 14px; margin-bottom: 12px; }
.solution-map-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.solution-map-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; }
.solution-item { display: flex; gap: 10px; margin-bottom: 9px; align-items: flex-start; }
.solution-badge { font-size: 10px; font-weight: 700; background: #1a1a18; color: #8B6F47; padding: 2px 8px; border-radius: 4px; white-space: nowrap; flex-shrink: 0; margin-top: 1px; font-family: 'Lora', serif; }
.solution-text { font-size: 12px; color: #444; line-height: 1.5; }

/* SIGNALS */
.signal-item { display: flex; gap: 8px; margin-bottom: 7px; align-items: flex-start; }
.signal-dot { width: 5px; height: 5px; border-radius: 50%; background: #8B6F47; flex-shrink: 0; margin-top: 5px; }

/* CONTACT CARDS */
.contact-row { display: flex; gap: 10px; margin-bottom: 8px; background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 12px; align-items: flex-start; }
.contact-avatar { width: 30px; height: 30px; border-radius: 50%; background: #E8E6DF; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: #666; flex-shrink: 0; }
.contact-name { font-size: 12px; font-weight: 600; }
.contact-title { font-size: 11px; color: #777; }
.contact-angle { font-size: 11px; color: #8B6F47; font-style: italic; margin-top: 2px; }

/* TALK BOX */
.talk-box { background: #F8F6F1; border-left: 3px solid #8B6F47; border-radius: 0 8px 8px 0; padding: 10px 13px; margin-bottom: 10px; }
.talk-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 4px; }
.talk-text { font-size: 11px; color: #555; line-height: 1.6; font-style: italic; }

/* LOADING */
.loading-pulse { display: flex; flex-direction: column; gap: 7px; }
.pulse-line { height: 10px; background: #F0EDE6; border-radius: 5px; animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%{opacity:1}50%{opacity:0.4}100%{opacity:1} }
.loading-overlay { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 24px; margin-bottom: 14px; }
.loading-status { font-size: 12px; color: #8B6F47; font-weight: 500; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.loading-spinner { width: 12px; height: 12px; border: 2px solid #E8E6DF; border-top-color: #8B6F47; border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }

/* CALL LAYOUT */
.call-layout { display: flex; flex: 1; height: calc(100vh - 56px); overflow: hidden; }
.call-left { width: 55%; border-right: 1px solid #E8E6DF; display: flex; flex-direction: column; background: #fff; overflow: hidden; }
.call-right { width: 45%; display: flex; flex-direction: column; background: #FAFAF8; overflow: hidden; }
.panel-header { padding: 12px 18px; border-bottom: 1px solid #E8E6DF; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: #fff; }
.panel-title { font-family: 'Lora', serif; font-size: 13px; font-weight: 500; }
.panel-body { flex: 1; overflow-y: auto; padding: 16px 18px; }

/* RIVER NAV */
.river-nav { display: flex; overflow-x: auto; border-bottom: 1px solid #E8E6DF; background: #FAFAF8; flex-shrink: 0; }
.river-tab { padding: 9px 13px; font-size: 10px; font-weight: 700; cursor: pointer; color: #bbb; border-bottom: 2px solid transparent; white-space: nowrap; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 5px; }
.river-tab:hover { color: #1a1a18; }
.river-tab.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #fff; }
.fill-dot { width: 5px; height: 5px; border-radius: 50%; background: #2E6B2E; flex-shrink: 0; }

/* GATES */
.gate { background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 9px; padding: 12px; margin-bottom: 8px; }
.gate.answered { border-color: #2E6B2E; background: #F4FAF4; }
.gate-q { font-size: 12px; font-weight: 500; color: #1a1a18; margin-bottom: 9px; line-height: 1.4; }
.gate-options { display: flex; flex-direction: column; gap: 5px; }
.gate-option { display: flex; gap: 9px; align-items: center; padding: 7px 11px; border-radius: 7px; border: 1px solid #E8E6DF; background: #fff; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #333; text-align: left; }
.gate-option:hover { border-color: #8B6F47; background: #FAF8F4; }
.gate-answer { font-size: 11px; color: #2E6B2E; font-weight: 500; margin-top: 5px; display: flex; align-items: center; gap: 6px; }

/* DISCOVERY */
.discovery-prompt { font-size: 11px; font-weight: 600; color: #555; margin-bottom: 4px; font-style: italic; }
.discovery-hint { font-size: 10px; color: #aaa; margin-top: 3px; }

/* CONFIDENCE */
.conf-wrap { margin-bottom: 14px; }
.conf-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.conf-text { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.conf-score { font-family: 'Lora', serif; font-size: 18px; font-weight: 500; }
.conf-track { height: 5px; background: #E8E6DF; border-radius: 3px; overflow: hidden; }
.conf-fill { height: 100%; border-radius: 3px; transition: width 0.5s, background 0.5s; }

/* RIGHT TABS */
.right-tabs { display: flex; border-bottom: 1px solid #E8E6DF; background: #fff; flex-shrink: 0; }
.right-tab { padding: 9px 13px; font-size: 10px; font-weight: 700; cursor: pointer; color: #999; border-bottom: 2px solid transparent; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.4px; }
.right-tab:hover { color: #1a1a18; }
.right-tab.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #FAFAF8; }

/* MISC */
.obj-item { border: 1px solid #E8E6DF; border-radius: 7px; overflow: hidden; background: #fff; margin-bottom: 5px; }
.obj-q-btn { display: flex; justify-content: space-between; align-items: center; padding: 8px 11px; cursor: pointer; font-size: 11px; font-weight: 500; width: 100%; text-align: left; background: none; border: none; font-family: 'DM Sans', sans-serif; color: #1a1a18; }
.obj-a-text { padding: 7px 11px 9px; font-size: 11px; color: #555; line-height: 1.5; font-style: italic; border-top: 1px solid #F0EDE6; }
.hyp-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 12px; margin-bottom: 6px; cursor: pointer; transition: border-color 0.15s; }
.hyp-card:hover { border-color: #8B6F47; }
.hyp-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 3px; }
.hyp-text { font-size: 11px; color: #333; line-height: 1.5; }
.post-section { margin-bottom: 18px; }
.post-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 7px; display: flex; align-items: center; justify-content: space-between; }
.post-content { background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 13px; font-size: 12px; color: #333; line-height: 1.65; white-space: pre-wrap; }
.copy-btn { font-size: 10px; color: #8B6F47; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; font-weight: 700; padding: 0; }
.copy-btn:hover { text-decoration: underline; }
.routing-card { border-radius: 9px; padding: 16px 18px; margin-bottom: 14px; border: 1.5px solid; }
.route-fast { background: #EEF5EE; border-color: #2E6B2E; }
.route-nurture { background: #FEF3E2; border-color: #BA7517; }
.route-disq { background: #FDE8E8; border-color: #9B2C2C; }
.route-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.route-fast .route-label { color: #2E6B2E; }
.route-nurture .route-label { color: #92540A; }
.route-disq .route-label { color: #9B2C2C; }
.route-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; margin-bottom: 5px; }
.route-desc { font-size: 11px; color: #555; line-height: 1.5; }
.notice { background: #F8F6F1; border: 1px solid #E8E6DF; border-radius: 8px; padding: 11px 14px; font-size: 11px; color: #777; line-height: 1.6; margin-bottom: 14px; }
.notice strong { color: #1a1a18; }
.divider { height: 1px; background: #E8E6DF; margin: 16px 0; }
.river-icon { width: 26px; height: 26px; border-radius: 6px; background: #1a1a18; display: flex; align-items: center; justify-content: center; font-family: 'Lora', serif; font-size: 12px; font-weight: 600; color: #8B6F47; flex-shrink: 0; }
.river-header { display: flex; align-items: center; gap: 9px; margin-bottom: 11px; }
.river-section-title { font-family: 'Lora', serif; font-size: 14px; font-weight: 500; }
.river-section-sub { font-size: 11px; color: #777; }
.session-bar { background: #F8F6F1; border-bottom: 1px solid #E8E6DF; padding: 7px 28px; display: flex; align-items: center; gap: 16px; font-size: 11px; color: #777; flex-shrink: 0; }
.session-url { color: #8B6F47; font-weight: 500; }
`;

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const COHORT_COLORS = ["#8B6F47","#4A7A9B","#6B8E6B","#9B6B8E","#7A7A4A"];

const OUTCOMES = [
  {id:"revenue",icon:"↑",title:"Revenue Growth",sub:"Pipeline, new logos, upsell"},
  {id:"efficiency",icon:"⟳",title:"Operational Efficiency",sub:"Automation, cost reduction"},
  {id:"retention",icon:"◎",title:"Customer Retention",sub:"Churn reduction, loyalty"},
  {id:"workforce",icon:"✦",title:"Workforce Management",sub:"Payroll, HR ops"},
  {id:"ai",icon:"◈",title:"Data & AI Adoption",sub:"Analytics, AI tooling"},
  {id:"transformation",icon:"◇",title:"Strategic Transformation",sub:"Org change, M&A"},
];

const SAMPLE_ROWS = [
  {company:"Waste Management Inc",industry:"Large Employer",acv:"$185,000",lead_source:"Trade Show",close_date:"2024-02-14",product:"Employee Rewards Platform",outcome:"reduce employee turnover",company_url:"wm.com"},
  {company:"Republic Services",industry:"Large Employer",acv:"$142,000",lead_source:"Direct Outreach",close_date:"2024-03-22",product:"Incentive Engine",outcome:"increase safety program participation",company_url:"republicservices.com"},
  {company:"Aramark Corporation",industry:"Large Employer",acv:"$210,000",lead_source:"Referral",close_date:"2024-01-18",product:"Employee Rewards Platform",outcome:"drive engagement across distributed workforce",company_url:"aramark.com"},
  {company:"Personify Health",industry:"Health & Wellness SaaS",acv:"$95,000",lead_source:"Referral",close_date:"2024-01-30",product:"Wellness Incentive Engine",outcome:"increase member activation",company_url:"personifyhealth.com"},
  {company:"Rippling",industry:"HR Platform & SaaS",acv:"$225,000",lead_source:"Referral",close_date:"2024-01-12",product:"Employee Rewards Platform",outcome:"embed rewards into HR workflow",company_url:"rippling.com"},
  {company:"Lattice",industry:"HR Platform & SaaS",acv:"$148,000",lead_source:"Trade Show",close_date:"2024-03-01",product:"Digital Rewards API",outcome:"power performance-based reward fulfillment",company_url:"lattice.com"},
  {company:"Deel",industry:"HR Platform & SaaS",acv:"$310,000",lead_source:"Referral",close_date:"2024-01-25",product:"Employee Rewards Platform",outcome:"deliver compliant digital rewards globally",company_url:"deel.com"},
  {company:"Qualtrics",industry:"Market Research",acv:"$135,000",lead_source:"Referral",close_date:"2024-01-08",product:"Survey Reward Engine",outcome:"increase survey completion rates",company_url:"qualtrics.com"},
  {company:"University of Michigan",industry:"University & Higher Ed",acv:"$52,000",lead_source:"Direct Outreach",close_date:"2024-03-10",product:"Research Participant Rewards",outcome:"streamline research incentive disbursement",company_url:"umich.edu"},
];

const RIVER_STAGES = [
  {id:"R1",letter:"R",label:"Reality",sub:"Current state — where are they broken?",
    gates:[
      {id:"r1_current",q:"How is the prospect handling this problem today?",options:["Manual / spreadsheets / no system","Legacy tool they've outgrown","Patchwork of multiple vendors","Competitor solution underperforming","No process at all"]},
      {id:"r1_urgency",q:"What's driving urgency to solve this now?",options:["Executive mandate / top-down pressure","Recent failure or incident","Growth has exposed the gap","Competitive pressure","Budget cycle opening up","No clear urgency yet"]},
    ],
    discovery:[
      {id:"r_pain",label:"In their own words, what is the core pain?",hint:"Capture exact language — use verbatim in proposal"},
      {id:"r_tried",label:"What have they already tried? Why did it fail?",hint:"Understand the graveyard before pitching"},
    ],
    talkTrack:'"Before we get into what we do, walk me through what happens right now when this problem comes up — what does that process actually look like?"',
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
    talkTrack:'"What is this actually costing you — not just process pain, but real dollars? When this problem happens, what\'s the downstream impact?"',
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
    talkTrack:'"If we\'re sitting here 90 days after you sign and everything went perfectly — what has changed? What can you point to?"',
    objections:[
      {q:"Not sure what success looks like",a:'"That\'s the most important thing to define before you sign anything. Can we spend 10 minutes on that?"'},
      {q:"Different stakeholders want different things",a:'"Who has final say on what success means? Is there a shared outcome everyone agrees on?"'},
    ]},
  {id:"E",letter:"E",label:"Entry Points",sub:"Who decides, who influences, what triggers a yes?",
    gates:[
      {id:"e_buyer",q:"Have you identified the economic buyer?",options:["Yes — met or confirmed","Probable — know the role","No — working through layers","Unclear org structure"]},
      {id:"e_process",q:"What does their decision process look like?",options:["Clear — defined steps and timeline","Informal — champion can move it","Committee / consensus required","RFP or formal procurement","Unknown"]},
    ],
    discovery:[
      {id:"e_stakeholders",label:"Map the buying committee: who approves, influences, can kill it?",hint:"Name every stakeholder — flag the ones you haven't met"},
      {id:"e_timeline",label:"Realistic decision timeline? Is there a forcing function?",hint:"Budget cycle, renewal date, board review — find the date"},
    ],
    talkTrack:'"Walk me through what the decision process looks like from here — who else needs to be involved, and what would need to be true to move forward?"',
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
    talkTrack:'"Based on what you\'ve shared, I have a clear picture of where you are. Here\'s what I think the right path looks like — and what I need from you to make it happen quickly."',
    objections:[
      {q:"Not ready to move forward",a:'"What would need to change? Is this timing or something more fundamental?"'},
      {q:"Need to think about it",a:'"What specifically? If I can help you work through it now, it might save us both a few weeks."'},
    ]},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function parseACV(v) {
  if (!v) return 0;
  const n = parseFloat(v.toString().replace(/[$,]/g,"").replace(/k$/i,"000"));
  return isNaN(n) ? 0 : n;
}
function labelACV(v) {
  if (v===0) return "Unknown";
  if (v<25000) return "SMB (<$25K)";
  if (v<100000) return "Mid-Market ($25K–$100K)";
  return "Enterprise ($100K+)";
}
function getOutcomeTheme(row, mapping) {
  const get = k => (mapping[k]?(row[mapping[k]]||""):"").toString().toLowerCase();
  const txt = get("outcome")+get("product");
  if (/revenue|growth|sales|pipeline/.test(txt)) return "Revenue Growth";
  if (/efficien|automat|process|cost/.test(txt)) return "Operational Efficiency";
  if (/churn|retain|loyal/.test(txt)) return "Customer Retention";
  if (/payroll|hr|employ|workforce/.test(txt)) return "Workforce Management";
  if (/ai|ml|data|analytic/.test(txt)) return "Data & AI Adoption";
  return "Strategic Transformation";
}
function buildCohorts(rows, mapping) {
  if (!rows.length) return [];
  const get = (row,key) => (mapping[key]?(row[mapping[key]]||""):"").toString().trim();
  const groups = {};
  rows.forEach(row => {
    const acv = parseACV(get(row,"acv"));
    const band = labelACV(acv);
    const ind = get(row,"industry")||"Other";
    const src = get(row,"lead_source")||"Direct";
    const outcome = getOutcomeTheme(row,mapping);
    const company = get(row,"company");
    const product = get(row,"product");
    const company_url = get(row,"company_url")||"";
    if (!groups[band]) groups[band]=[];
    groups[band].push({row,ind,acv,band,src,outcome,company,product,company_url});
  });
  return Object.entries(groups)
    .sort(([,a],[,b])=>b.length-a.length).slice(0,5)
    .map(([name,members],i)=>({
      id:i,name,color:COHORT_COLORS[i],
      size:members.length,
      pct:Math.round(members.length/rows.length*100),
      avgACV:members.filter(m=>m.acv>0).length?Math.round(members.filter(m=>m.acv>0).reduce((s,m)=>s+m.acv,0)/members.filter(m=>m.acv>0).length):0,
      topInd:[...new Set(members.map(m=>m.ind))].slice(0,3),
      topSrc:[...new Set(members.map(m=>m.src))].slice(0,2),
      topOut:[...new Set(members.map(m=>m.outcome))].slice(0,2),
      members,
    }));
}
function calcConfidence(gateAnswers, riverData) {
  const positive = {
    r1_urgency:["Executive mandate / top-down pressure","Recent failure or incident","Budget cycle opening up"],
    i_cost:["Yes — hard numbers","Partial — sense of it but not exact"],
    v_outcome:["Yes — specific and measurable","Somewhat — directional not specific"],
    v_champion:["Yes — identified and motivated","Potential — needs equipping"],
    e_buyer:["Yes — met or confirmed","Probable — know the role"],
    e_process:["Clear — defined steps and timeline","Informal — champion can move it"],
    r2_fit:["Strong fit — ready to advance","Good fit — a few gaps"],
  };
  let score = 20;
  Object.entries(positive).forEach(([gid,pos])=>{
    if (pos.includes(gateAnswers[gid])) score+=10;
    else if (gateAnswers[gid]) score+=3;
  });
  const filled = RIVER_STAGES.flatMap(s=>s.discovery).filter(p=>riverData[p.id]?.trim().length>10).length;
  score += filled*4;
  return Math.min(score,98);
}
function confColor(s) { return s>=75?"#2E6B2E":s>=50?"#BA7517":"#9B2C2C"; }

async function callAI(prompt, useWebSearch=false) {
  const body = {
    model:"claude-sonnet-4-20250514",
    max_tokens:2000,
    messages:[{role:"user",content:prompt}],
  };
  if (useWebSearch) {
    body.tools=[{type:"web_search_20250305",name:"web_search"}];
  }
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version":"2023-06-01",
      "anthropic-dangerous-direct-browser-access":"true",
    },
    body:JSON.stringify(body),
  });
  const data = await res.json();
  const text = data.content?.filter(b=>b.type==="text").map(b=>b.text||"").join("")||"";
  try { return JSON.parse(text.replace(/```json|```/g,"").trim()); } catch { return null; }
}

// ── EDITABLE FIELD COMPONENT ──────────────────────────────────────────────────

function EditableField({ value, onChange, multiline=true, placeholder="Click to edit..." }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value||"");
  useEffect(()=>{ setVal(value||""); },[value]);
  const commit = () => { setEditing(false); onChange(val); };
  if (editing) {
    return multiline
      ? <textarea className="editable-text" style={{minHeight:60,width:"100%"}} value={val} onChange={e=>setVal(e.target.value)} onBlur={commit} autoFocus/>
      : <input type="text" className="editable-text" value={val} onChange={e=>setVal(e.target.value)} onBlur={commit} autoFocus/>;
  }
  return (
    <div className="editable-field" onClick={()=>setEditing(true)}>
      <div className="edit-hint">Click to edit</div>
      <div className="editable-text" data-empty={(!val).toString()}>{val||placeholder}</div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  // 0=session setup, 1=import, 2=cohorts, 3=outcomes, 4=account-select, 5=brief, 6=in-call, 7=post-call
  const [step, setStep] = useState(0);

  // Session
  const [sellerUrl, setSellerUrl] = useState("");
  const [sellerUrlInput, setSellerUrlInput] = useState("");

  // Data
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({company:"",industry:"",acv:"",lead_source:"",close_date:"",product:"",outcome:"",company_url:""});
  const [fileName, setFileName] = useState("");
  const [drag, setDrag] = useState(false);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Brief
  const [brief, setBrief] = useState(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefStatus, setBriefStatus] = useState("");
  const [contactRole, setContactRole] = useState("");

  // In-call
  const [activeRiver, setActiveRiver] = useState(0);
  const [gateAnswers, setGateAnswers] = useState({});
  const [riverData, setRiverData] = useState({});
  const [expandedObjs, setExpandedObjs] = useState({});
  const [rightTab, setRightTab] = useState("brief");
  const [notes, setNotes] = useState("");

  // Post-call
  const [postCall, setPostCall] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const fileRef = useRef();
  const confidence = calcConfidence(gateAnswers, riverData);

  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    const hdrs = lines[0].split(",").map(h=>h.trim().replace(/^"|"$/g,""));
    const data = lines.slice(1).map(line=>{
      const vals=line.split(",").map(v=>v.trim().replace(/^"|"$/g,""));
      const obj={};
      hdrs.forEach((h,i)=>obj[h]=vals[i]||"");
      return obj;
    }).filter(r=>Object.values(r).some(v=>v));
    setHeaders(hdrs); setRows(data);
    const am={...mapping};
    const n=s=>s.toLowerCase().replace(/[\s_]/g,"");
    hdrs.forEach(h=>{
      const hn=n(h);
      if (hn.includes("company")||hn.includes("account")) am.company=h;
      if (hn.includes("industry")||hn.includes("vertical")) am.industry=h;
      if (hn.includes("acv")||hn.includes("deal")||hn.includes("amount")||hn.includes("value")) am.acv=h;
      if (hn.includes("lead")||hn.includes("source")||hn.includes("channel")) am.lead_source=h;
      if (hn.includes("close")||hn.includes("date")) am.close_date=h;
      if (hn.includes("product")||hn.includes("solution")) am.product=h;
      if (hn.includes("outcome")||hn.includes("goal")) am.outcome=h;
      if (hn.includes("url")||hn.includes("website")||hn.includes("web")) am.company_url=h;
    });
    setMapping(am);
  };

  const loadSample = () => {
    const hdrs=Object.keys(SAMPLE_ROWS[0]);
    setHeaders(hdrs); setRows(SAMPLE_ROWS); setFileName("sample_crm_export.csv");
    const m={}; hdrs.forEach(h=>m[h]=h); setMapping(m);
  };

  const onFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader=new FileReader();
    reader.onload=e=>parseCSV(e.target.result);
    reader.readAsText(file);
  };

  const handleDrop = useCallback(e=>{
    e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]);
  },[]);

  const goToCohorts = () => {
    const built=buildCohorts(rows,mapping);
    setCohorts(built); setSelectedCohort(built[0]||null); setStep(2);
  };

  const goToOutcomes = () => {
    if (selectedCohort) { setSelectedOutcomes(selectedCohort.topOut.slice(0,2)); setStep(3); }
  };

  // Auto-generate brief when account is selected
  const pickAccount = async (member) => {
    setSelectedAccount(member);
    setBrief(null);
    setBriefLoading(true);
    setGateAnswers({}); setRiverData({}); setNotes(""); setPostCall(null);
    setStep(5);

    const companyUrl = member.company_url || member.company;
    const prompt = `You are a senior B2B sales strategist. Research both the prospect company and the selling organization, then generate a comprehensive pre-call RIVER brief that maps the seller's specific products/services to the prospect's likely needs.

PROSPECT:
- Company: ${member.company}
- Website/URL: ${companyUrl}
- Industry: ${member.ind}
- Estimated ACV: ${member.acv>0?`$${member.acv.toLocaleString()}`:"Unknown"}
- Lead source: ${member.src}
- Known outcome/need: ${member.outcome}
- Cohort: ${selectedCohort?.name||""}
- Target outcomes: ${selectedOutcomes.join(", ")||"Unknown"}

SELLING ORGANIZATION:
- Website: ${sellerUrl}

INSTRUCTIONS:
1. Use web_search to research the prospect: recent news, M&A, leadership changes, job postings, tech stack, LinkedIn signals
2. Use web_search to research the selling org at ${sellerUrl}: understand their products, services, differentiators, and positioning
3. Map the seller's specific products/services to the prospect's most likely needs
4. Build a RIVER hypothesis grounded in real research — not generic assumptions
5. Identify real executive names at the prospect if findable

Return ONLY valid JSON:
{
  "companySnapshot": "2-3 sentence overview with specific current details — revenue, headcount, recent news found",
  "sellerSnapshot": "1-2 sentence summary of the selling org's relevant offerings",
  "solutionMapping": [
    {"product": "Specific product/service name from seller", "fit": "Why this maps to the prospect's specific situation — be concrete"},
    {"product": "Specific product/service name from seller", "fit": "Why this maps"},
    {"product": "Specific product/service name from seller", "fit": "Why this maps"}
  ],
  "riverHypothesis": {
    "reality": "Based on research: specific current state — how are they handling this today",
    "impact": "Based on research: specific cost/impact — reference signals found",
    "vision": "Based on research: what success looks like given their current priorities",
    "entryPoints": "Based on research: who makes this decision, org structure, named executives if found",
    "route": "Based on research: fastest likely path to close given company stage and signals"
  },
  "openingAngle": "One sharp, specific opening question referencing something real found in research",
  "watchOuts": ["Specific watch-out based on research", "Specific watch-out 2", "Specific watch-out 3"],
  "keyContacts": [
    {"name": "Real name if found, otherwise likely title", "title": "Title", "initials": "XX", "angle": "Specific engagement angle based on their role and signals"},
    {"name": "Real name if found", "title": "Title", "initials": "XX", "angle": "Specific engagement angle"}
  ],
  "competitors": ["Likely competitor 1", "Likely competitor 2"],
  "recentSignals": [
    "Specific signal: e.g. Posted 14 HR roles in Q1 2025 — signals investment in people ops",
    "Specific signal: e.g. CEO quoted on reducing operational costs — cost efficiency angle",
    "Specific signal: e.g. Recent acquisition — integration complexity creates rewards gap"
  ]
}`;

    setBriefStatus("Researching " + member.company + "...");
    const result = await callAI(prompt, true);
    setBrief(result);
    setBriefLoading(false);
    setBriefStatus("");
  };

  const updateBrief = (path, value) => {
    setBrief(prev => {
      const next = {...prev};
      const keys = path.split(".");
      let obj = next;
      for (let i=0; i<keys.length-1; i++) obj=obj[keys[i]];
      obj[keys[keys.length-1]] = value;
      return next;
    });
  };

  const runPostCall = async () => {
    setPostLoading(true);
    const riverSummary = RIVER_STAGES.map(s=>{
      const gates=s.gates.map(g=>`${g.q}: ${gateAnswers[g.id]||"Not answered"}`).join("; ");
      const disc=s.discovery.map(p=>`${p.label}: ${riverData[p.id]||"Not captured"}`).join("; ");
      return `${s.label}: ${gates} | ${disc}`;
    }).join("\n");

    const result = await callAI(`You are a senior sales coach reviewing a discovery call using the Cambrian Catalyst RIVER framework.

Company: ${selectedAccount?.company} | Industry: ${selectedAccount?.ind} | Role: ${contactRole||"Unknown"} | ACV: ${selectedAccount?.acv>0?`$${selectedAccount.acv.toLocaleString()}`:"Unknown"} | Confidence: ${confidence}%
Cohort: ${selectedCohort?.name} | Outcomes: ${selectedOutcomes.join(", ")}
Solution mapped: ${brief?.solutionMapping?.map(s=>s.product).join(", ")||"Unknown"}

RIVER Capture:
${riverSummary}

Notes: ${notes||"None"}

Return ONLY valid JSON:
{
  "callSummary": "3-4 sentence narrative of what was learned",
  "riverScorecard": {
    "reality": "What was confirmed about current state",
    "impact": "What cost/impact was surfaced",
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
  "emailBody": "Full follow-up email — professional, outcome-focused, references specific things discussed, clear CTA with proposed meeting time"
}`);
    setPostCall(result); setPostLoading(false); setStep(7);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text).then(()=>{ setCopied(key); setTimeout(()=>setCopied(""),2000); });
  };

  const isFilled = s => s.gates.some(g=>gateAnswers[g.id])||s.discovery.some(p=>riverData[p.id]?.trim());

  const STEPS = ["Session","Import","Cohorts","Outcomes","Account","Brief","In-Call","Post-Call"];
  const routeClass = postCall?.dealRoute==="FAST_TRACK"?"route-fast":postCall?.dealRoute==="NURTURE"?"route-nurture":"route-disq";
  const routeLabel = postCall?.dealRoute==="FAST_TRACK"?"Fast Track →":postCall?.dealRoute==="NURTURE"?"Nurture":"Disqualify";

  return (
    <>
      <style>{FONTS}{css}</style>
      <div className="app">

        <header className="header">
          <div className="logo">Cambrian <span>Catalyst</span></div>
          <div className="stepper">
            {STEPS.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center"}}>
                {i>0&&<div className="step-div"/>}
                <div className={`step-item ${step===i?"active":step>i?"done":""}`}
                  onClick={()=>{if(step>i&&i>0)setStep(i);}}>
                  <div className="step-num">{step>i?"✓":i+1}</div>
                  {s}
                </div>
              </div>
            ))}
          </div>
          <div>{step===6&&<div className="live-badge"><div className="live-dot"/>Live Call</div>}</div>
        </header>

        {/* Session URL bar */}
        {step>0&&sellerUrl&&(
          <div className="session-bar">
            <span>Your org:</span>
            <span className="session-url">{sellerUrl}</span>
            {selectedCohort&&<><span>·</span><span>Cohort: <strong>{selectedCohort.name}</strong></span></>}
            {selectedAccount&&<><span>·</span><span>Account: <strong>{selectedAccount.company}</strong></span></>}
          </div>
        )}

        {/* ── STEP 0: SESSION SETUP ── */}
        {step===0&&(
          <div style={{padding:"40px 28px"}}>
            <div className="setup-card">
              <div className="setup-logo">Cambrian <span>Catalyst</span></div>
              <div style={{fontFamily:"Lora,serif",fontSize:13,color:"#999",textAlign:"center",marginBottom:24,fontStyle:"italic"}}>Revenue Playbook Engine</div>

              <div className="field-row">
                <div className="field-label">Your Organization's Website <span className="req">*</span></div>
                <div className="setup-url-bar">
                  <div className="setup-url-label">Seller URL</div>
                  <input className="setup-url-input" type="text" placeholder="e.g. tangocard.com or yourcompany.com"
                    value={sellerUrlInput} onChange={e=>setSellerUrlInput(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter"&&sellerUrlInput.trim()){ setSellerUrl(sellerUrlInput.trim()); setStep(1); } }}/>
                </div>
                <div style={{fontSize:11,color:"#aaa",marginTop:4}}>Claude will research your products and services to map them to each prospect's needs</div>
              </div>

              <div className="setup-divider"/>

              <div style={{fontSize:12,color:"#999",marginBottom:16,lineHeight:1.6}}>
                This session URL is stored for all accounts in this session. You can update it at any time by returning to this screen.
              </div>

              <button className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center"}}
                onClick={()=>{ if(sellerUrlInput.trim()){ setSellerUrl(sellerUrlInput.trim()); setStep(1); } }}
                disabled={!sellerUrlInput.trim()}>
                Start Session →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: IMPORT ── */}
        {step===1&&(
          <div className="page">
            <div className="page-title">Import Customer Data</div>
            <div className="page-sub">Upload a CRM export. Include a <strong>company_url</strong> column for best results — the tool uses it to pull live research on each prospect automatically.</div>
            <div className={`upload-zone ${drag?"drag":""}`}
              onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={handleDrop}
              onClick={()=>fileRef.current.click()}>
              <div className="upload-label">{fileName||"Drop your CSV file here"}</div>
              <div className="upload-hint">{rows.length>0?`${rows.length} records loaded`:"Salesforce · HubSpot · Custom CRM"}</div>
              <button className="btn btn-secondary" onClick={e=>{e.stopPropagation();fileRef.current.click();}}>Browse File</button>
              <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>onFile(e.target.files[0])}/>
            </div>
            <div style={{textAlign:"center",margin:"12px 0",color:"#ccc",fontSize:11}}>— or —</div>
            <div style={{textAlign:"center",marginBottom:22}}>
              <button className="btn btn-secondary" onClick={loadSample}>Load Sample Data</button>
            </div>
            {rows.length>0&&(
              <>
                <div className="card">
                  <div className="card-title">Map Your Fields</div>
                  <div className="field-grid-2">
                    {[
                      {key:"company",label:"Company / Account",req:true},
                      {key:"industry",label:"Industry / Vertical",req:true},
                      {key:"acv",label:"Deal Size / ACV",req:true},
                      {key:"lead_source",label:"Lead Source",req:true},
                      {key:"company_url",label:"Company Website URL"},
                      {key:"close_date",label:"Close Date"},
                      {key:"product",label:"Product / Solution"},
                      {key:"outcome",label:"Customer Outcome"},
                    ].map(f=>(
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
                  <button className="btn btn-primary btn-lg" onClick={goToCohorts}>Build Cohorts →</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 2: COHORTS ── */}
        {step===2&&(
          <div className="page">
            <div className="page-title">Cohort Analysis</div>
            <div className="page-sub">{rows.length} accounts segmented into {cohorts.length} cohorts by deal size, industry, and lead source.</div>
            <div className="summary-grid">
              <div className="stat-card"><div className="stat-num">{rows.length}</div><div className="stat-label">Accounts</div></div>
              <div className="stat-card"><div className="stat-num">{cohorts.length}</div><div className="stat-label">Cohorts</div></div>
              <div className="stat-card"><div className="stat-num">${Math.round(rows.reduce((s,r)=>s+parseACV(mapping.acv?r[mapping.acv]:"0"),0)/1000)}K</div><div className="stat-label">Total ACV</div></div>
            </div>
            <div className="cohort-grid">
              {cohorts.map(c=>(
                <div key={c.id} className={`cohort-card ${selectedCohort?.id===c.id?"selected":""}`} onClick={()=>setSelectedCohort(c)}>
                  <div className="cohort-name"><span className="cohort-dot" style={{background:c.color}}/>{c.name}</div>
                  <div className="cohort-size">{c.size} accounts · {c.pct}% of base</div>
                  <div className="tag-row">
                    {c.topInd.map(t=><span key={t} className="tag tag-ind">{t}</span>)}
                    {c.avgACV>0&&<span className="tag tag-size">${(c.avgACV/1000).toFixed(0)}K avg</span>}
                  </div>
                  <div className="tag-row">
                    {c.topSrc.map(t=><span key={t} className="tag tag-src">{t}</span>)}
                    {c.topOut.map(t=><span key={t} className="tag tag-out">{t}</span>)}
                  </div>
                  <div className="cohort-stat">Avg ACV: <strong>${c.avgACV>0?c.avgACV.toLocaleString():"Unknown"}</strong></div>
                </div>
              ))}
            </div>
            <div className="actions-row">
              <button className="btn btn-secondary" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={goToOutcomes} disabled={!selectedCohort}>Map Outcomes →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: OUTCOMES ── */}
        {step===3&&selectedCohort&&(
          <div className="page">
            <div className="page-title">Outcome Mapping</div>
            <div className="page-sub">Select desired outcomes for <strong>{selectedCohort.name}</strong>. These inform RIVER talk tracks and solution mapping.</div>
            <div className="notice"><strong>Outcome-agnostic · Industry-agnostic.</strong> Outcomes customize language and priority signals — not the underlying RIVER motion.</div>
            <div className="outcome-grid">
              {OUTCOMES.map(o=>(
                <div key={o.id} className={`outcome-tile ${selectedOutcomes.includes(o.title)?"selected":""}`}
                  onClick={()=>setSelectedOutcomes(p=>p.includes(o.title)?p.filter(x=>x!==o.title):[...p,o.title])}>
                  <div className="outcome-icon">{o.icon}</div>
                  <div className="outcome-title">{o.title}</div>
                  <div className="outcome-sub">{o.sub}</div>
                </div>
              ))}
            </div>
            <div className="actions-row">
              <button className="btn btn-secondary" onClick={()=>setStep(2)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={()=>setStep(4)} disabled={selectedOutcomes.length===0}>Select Account →</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: ACCOUNT SELECT ── */}
        {step===4&&selectedCohort&&(
          <div className="page">
            <div className="page-title">Select Account</div>
            <div className="page-sub">Click an account to begin. Claude will automatically research the company and generate your RIVER brief.</div>
            <div className="notice">
              <strong>Auto-research:</strong> Claude will search {sellerUrl} and the prospect's website simultaneously to map your products to their needs — no manual input required.
            </div>
            <div className="account-list">
              {selectedCohort.members.map((m,i)=>(
                <div key={i} className={`account-item ${selectedAccount===m?"selected":""}`} onClick={()=>pickAccount(m)}>
                  <div>
                    <div className="account-name">{m.company}</div>
                    <div className="account-meta">{m.ind} · {m.src} · {m.outcome}</div>
                    {m.company_url&&<div style={{fontSize:10,color:"#aaa",marginTop:1}}>{m.company_url}</div>}
                  </div>
                  <div className="account-right">
                    <div className="account-acv">{m.acv>0?`$${m.acv.toLocaleString()}`:"—"}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="actions-row">
              <button className="btn btn-secondary" onClick={()=>setStep(3)}>← Back</button>
            </div>
          </div>
        )}

        {/* ── STEP 5: RIVER BRIEF ── */}
        {step===5&&(
          <div className="page">
            <div className="page-title">RIVER Brief — {selectedAccount?.company}</div>
            <div className="page-sub">
              {briefLoading
                ? "Researching company and mapping solutions — this takes about 20 seconds..."
                : "All fields are editable — click any text to refine before your call."}
            </div>

            {/* Optional: contact role input */}
            {!briefLoading&&brief&&(
              <div className="card" style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1}}>
                    <div className="field-label" style={{marginBottom:5}}>Primary Contact Role <span style={{color:"#aaa",fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:11}}>(optional — add before call)</span></div>
                    <input type="text" placeholder="e.g. VP Total Rewards, Head of People Ops..." value={contactRole} onChange={e=>setContactRole(e.target.value)}/>
                  </div>
                  <button className="btn btn-green btn-lg" style={{marginTop:18}} onClick={()=>{setActiveRiver(0);setRightTab("brief");setStep(6);}}>
                    Start In-Call →
                  </button>
                </div>
              </div>
            )}

            {/* Loading state */}
            {briefLoading&&(
              <div className="loading-overlay">
                <div className="loading-status">
                  <div className="loading-spinner"/>
                  {briefStatus||"Generating RIVER brief..."}
                </div>
                <div className="loading-pulse">
                  {[80,55,90,45,70,60,85,50,75,40].map((w,i)=>(
                    <div key={i} className="pulse-line" style={{width:`${w}%`,animationDelay:`${i*0.1}s`}}/>
                  ))}
                </div>
              </div>
            )}

            {brief&&!briefLoading&&(
              <>
                {/* Company + Seller snapshot */}
                <div className="card">
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,marginBottom:14}}>
                    <div style={{flex:1}}>
                      <div className="field-label" style={{marginBottom:6}}>Company Snapshot</div>
                      <EditableField value={brief.companySnapshot} onChange={v=>updateBrief("companySnapshot",v)}/>
                    </div>
                  </div>

                  {/* Signals */}
                  {brief.recentSignals?.length>0&&(
                    <>
                      <div className="field-label" style={{marginBottom:8}}>Live Research Signals</div>
                      {brief.recentSignals.map((s,i)=>(
                        <div key={i} className="signal-item">
                          <div className="signal-dot"/>
                          <EditableField value={s} onChange={v=>{ const arr=[...brief.recentSignals]; arr[i]=v; updateBrief("recentSignals",arr); }} multiline={false}/>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Solution Mapping */}
                <div className="card">
                  <div className="card-title">Solution Mapping</div>
                  <div style={{fontSize:11,color:"#777",marginBottom:12}}>{brief.sellerSnapshot}</div>
                  {brief.solutionMapping?.map((item,i)=>(
                    <div key={i} className="solution-item">
                      <div className="solution-badge">{item.product}</div>
                      <EditableField value={item.fit} onChange={v=>{ const arr=[...brief.solutionMapping]; arr[i]={...arr[i],fit:v}; updateBrief("solutionMapping",arr); }}/>
                    </div>
                  ))}
                </div>

                {/* RIVER Hypothesis */}
                <div className="card">
                  <div className="card-title">RIVER Hypothesis</div>
                  <div style={{fontSize:11,color:"#aaa",marginBottom:12}}>Your expected framework before the call. Click any field to refine.</div>
                  {brief.riverHypothesis&&RIVER_STAGES.map((stage,i)=>{
                    const keys=["reality","impact","vision","entryPoints","route"];
                    return (
                      <div key={i} style={{marginBottom:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,paddingLeft:4}}>
                          <div className="river-icon">{stage.letter}</div>
                          <div>
                            <div style={{fontFamily:"Lora,serif",fontSize:12,fontWeight:500}}>{stage.label}</div>
                            <div style={{fontSize:10,color:"#aaa"}}>{stage.sub}</div>
                          </div>
                        </div>
                        <div style={{paddingLeft:4}}>
                          <EditableField value={brief.riverHypothesis[keys[i]]} onChange={v=>updateBrief(`riverHypothesis.${keys[i]}`,v)}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Opening + Contacts + Watch-outs */}
                <div className="card">
                  <div className="card-title">Opening Angle</div>
                  <div className="talk-box">
                    <div className="talk-label">Recommended Opening</div>
                    <EditableField value={brief.openingAngle} onChange={v=>updateBrief("openingAngle",v)}/>
                  </div>
                </div>

                <div className="field-grid-2" style={{gap:12,marginBottom:14}}>
                  <div className="card" style={{margin:0}}>
                    <div className="card-title" style={{fontSize:13}}>Key Contacts</div>
                    {brief.keyContacts?.map((c,i)=>(
                      <div key={i} className="contact-row">
                        <div className="contact-avatar">{c.initials}</div>
                        <div style={{flex:1}}>
                          <div className="contact-name">{c.name}</div>
                          <div className="contact-title">{c.title}</div>
                          <EditableField value={c.angle} onChange={v=>{ const arr=[...brief.keyContacts]; arr[i]={...arr[i],angle:v}; updateBrief("keyContacts",arr); }} multiline={false}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{margin:0}}>
                    <div className="card-title" style={{fontSize:13}}>Watch-Outs</div>
                    {brief.watchOuts?.map((w,i)=>(
                      <div key={i} className="signal-item" style={{marginBottom:8}}>
                        <div className="signal-dot" style={{background:"#9B2C2C"}}/>
                        <EditableField value={w} onChange={v=>{ const arr=[...brief.watchOuts]; arr[i]=v; updateBrief("watchOuts",arr); }} multiline={false}/>
                      </div>
                    ))}
                    {brief.competitors?.length>0&&(
                      <>
                        <div className="field-label" style={{marginTop:12,marginBottom:7}}>Likely Competitors</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                          {brief.competitors.map((c,i)=><span key={i} className="tag tag-ind">{c}</span>)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="actions-row">
                  <button className="btn btn-secondary" onClick={()=>setStep(4)}>← Accounts</button>
                  <button className="btn btn-secondary" onClick={()=>pickAccount(selectedAccount)}>↻ Regenerate</button>
                  <button className="btn btn-green btn-lg" onClick={()=>{setActiveRiver(0);setRightTab("brief");setStep(6);}}>
                    Start In-Call Navigator →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 6: IN-CALL ── */}
        {step===6&&(
          <div className="call-layout">
            <div className="call-left">
              <div className="panel-header">
                <div>
                  <div className="panel-title">{selectedAccount?.company} · RIVER Navigator</div>
                  <div style={{fontSize:10,color:"#999",marginTop:2}}>{contactRole||selectedAccount?.ind} · {selectedCohort?.name}</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={()=>setStep(5)}>← Brief</button>
              </div>
              <div className="river-nav">
                {RIVER_STAGES.map((s,i)=>(
                  <button key={s.id} className={`river-tab ${activeRiver===i?"active":""}`} onClick={()=>setActiveRiver(i)}>
                    {isFilled(s)&&<div className="fill-dot"/>}
                    {s.letter} — {s.label}
                  </button>
                ))}
              </div>
              <div className="panel-body">
                <div className="conf-wrap">
                  <div className="conf-label">
                    <div className="conf-text">Deal Confidence</div>
                    <div className="conf-score" style={{color:confColor(confidence)}}>{confidence}%</div>
                  </div>
                  <div className="conf-track">
                    <div className="conf-fill" style={{width:`${confidence}%`,background:confColor(confidence)}}/>
                  </div>
                </div>

                {RIVER_STAGES.map((stage,si)=>si===activeRiver&&(
                  <div key={stage.id}>
                    <div className="river-header">
                      <div className="river-icon">{stage.letter}</div>
                      <div>
                        <div className="river-section-title">{stage.label}</div>
                        <div className="river-section-sub">{stage.sub}</div>
                      </div>
                    </div>

                    {stage.gates.map(gate=>(
                      <div key={gate.id} className={`gate ${gateAnswers[gate.id]?"answered":""}`}>
                        <div className="gate-q">{gate.q}</div>
                        {!gateAnswers[gate.id]?(
                          <div className="gate-options">
                            {gate.options.map((opt,oi)=>(
                              <button key={oi} className="gate-option" onClick={()=>setGateAnswers(a=>({...a,[gate.id]:opt}))}>
                                <span style={{fontSize:9,color:"#aaa",minWidth:12}}>{String.fromCharCode(65+oi)}</span>{opt}
                              </button>
                            ))}
                          </div>
                        ):(
                          <div className="gate-answer">
                            ✓ {gateAnswers[gate.id]}
                            <button style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",borderRadius:5,border:"1px solid #E8E6DF",background:"transparent",cursor:"pointer",color:"#999",fontFamily:"DM Sans"}}
                              onClick={()=>setGateAnswers(a=>{const n={...a};delete n[gate.id];return n;})}>Undo</button>
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={{marginTop:12}}>
                      <div className="field-label" style={{marginBottom:8}}>Discovery Capture</div>
                      {stage.discovery.map(prompt=>(
                        <div key={prompt.id} style={{marginBottom:10}}>
                          <div className="discovery-prompt">{prompt.label}</div>
                          <textarea rows={2} placeholder="Capture what you're hearing..." value={riverData[prompt.id]||""} onChange={e=>setRiverData(d=>({...d,[prompt.id]:e.target.value}))}/>
                          <div className="discovery-hint">{prompt.hint}</div>
                        </div>
                      ))}
                    </div>

                    <div className="talk-box" style={{marginTop:12}}>
                      <div className="talk-label">Talk Track</div>
                      <div className="talk-text">{stage.talkTrack}</div>
                    </div>

                    <div style={{marginTop:10}}>
                      <div className="field-label" style={{marginBottom:7}}>Objection Handling</div>
                      {stage.objections.map((o,oi)=>(
                        <div key={oi} className="obj-item">
                          <button className="obj-q-btn" onClick={()=>setExpandedObjs(s=>({...s,[`${si}-${oi}`]:!s[`${si}-${oi}`]}))}>
                            "{o.q}" <span style={{color:"#aaa"}}>{expandedObjs[`${si}-${oi}`]?"−":"+"}</span>
                          </button>
                          {expandedObjs[`${si}-${oi}`]&&<div className="obj-a-text">{o.a}</div>}
                        </div>
                      ))}
                    </div>

                    <div style={{display:"flex",gap:7,marginTop:18,paddingTop:14,borderTop:"1px solid #E8E6DF",flexWrap:"wrap"}}>
                      {si>0&&<button className="btn btn-secondary btn-sm" onClick={()=>setActiveRiver(si-1)}>← {RIVER_STAGES[si-1].label}</button>}
                      {si<RIVER_STAGES.length-1&&<button className="btn btn-gold btn-sm" onClick={()=>setActiveRiver(si+1)}>{RIVER_STAGES[si+1].label} →</button>}
                      {si===RIVER_STAGES.length-1&&<button className="btn btn-green btn-sm" onClick={runPostCall} disabled={postLoading}>{postLoading?"Generating...":"End Call & Generate Route →"}</button>}
                    </div>
                    {si<RIVER_STAGES.length-1&&(
                      <div style={{marginTop:10}}>
                        <button className="btn btn-secondary btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={runPostCall} disabled={postLoading}>
                          {postLoading?"Generating...":"End Call Early & Generate Route"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="call-right">
              <div className="right-tabs">
                {[["brief","RIVER Brief"],["solutions","Solutions"],["notes","Notes"]].map(([id,label])=>(
                  <button key={id} className={`right-tab ${rightTab===id?"active":""}`} onClick={()=>setRightTab(id)}>{label}</button>
                ))}
              </div>
              <div className="panel-body">

                {rightTab==="brief"&&brief&&(
                  <>
                    <div className="talk-box" style={{marginBottom:14}}>
                      <div className="talk-label">Opening Angle</div>
                      <div className="talk-text">{brief.openingAngle}</div>
                    </div>
                    <div className="field-label" style={{marginBottom:8}}>RIVER Hypothesis</div>
                    {RIVER_STAGES.map((stage,i)=>{
                      const keys=["reality","impact","vision","entryPoints","route"];
                      return (
                        <div key={i} className="hyp-card" style={{borderColor:activeRiver===i?"#8B6F47":"#E8E6DF"}} onClick={()=>setActiveRiver(i)}>
                          <div className="hyp-label">{stage.letter} — {stage.label} {isFilled(stage)?"✓":""}</div>
                          <div className="hyp-text">{brief.riverHypothesis?.[keys[i]]||"—"}</div>
                          {riverData[stage.discovery[0]?.id]&&(
                            <div style={{marginTop:5,fontSize:10,color:"#2E6B2E",borderTop:"1px solid #E8E6DF",paddingTop:4}}>
                              Captured: "{riverData[stage.discovery[0].id].slice(0,70)}{riverData[stage.discovery[0].id].length>70?"...":""}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}

                {rightTab==="solutions"&&brief&&(
                  <>
                    <div className="field-label" style={{marginBottom:10}}>Solution Mapping</div>
                    <div className="solution-map">
                      <div className="solution-map-header">
                        <div className="solution-map-title">Recommended for {selectedAccount?.company}</div>
                      </div>
                      {brief.solutionMapping?.map((item,i)=>(
                        <div key={i} className="solution-item">
                          <div className="solution-badge">{item.product}</div>
                          <div className="solution-text">{item.fit}</div>
                        </div>
                      ))}
                    </div>
                    <div className="field-label" style={{marginBottom:8}}>Key Contacts</div>
                    {brief.keyContacts?.map((c,i)=>(
                      <div key={i} className="contact-row">
                        <div className="contact-avatar">{c.initials}</div>
                        <div>
                          <div className="contact-name">{c.name}</div>
                          <div className="contact-title">{c.title}</div>
                          <div className="contact-angle">{c.angle}</div>
                        </div>
                      </div>
                    ))}
                    <div className="field-label" style={{margin:"14px 0 8px"}}>Watch-Outs</div>
                    {brief.watchOuts?.map((w,i)=>(
                      <div key={i} className="signal-item" style={{marginBottom:7}}>
                        <div className="signal-dot" style={{background:"#9B2C2C"}}/>
                        <div style={{fontSize:11,color:"#555",lineHeight:1.5}}>{w}</div>
                      </div>
                    ))}
                  </>
                )}

                {rightTab==="notes"&&(
                  <>
                    <div className="field-label" style={{marginBottom:8}}>Call Notes</div>
                    <textarea style={{width:"100%",minHeight:240,padding:10,border:"1px solid #E8E6DF",borderRadius:7,fontSize:12,fontFamily:"DM Sans",background:"#fff",resize:"vertical"}}
                      placeholder="Free-form notes... Tab = timestamp" value={notes} onChange={e=>setNotes(e.target.value)}
                      onKeyDown={e=>{
                        if(e.key==="Tab"){e.preventDefault();
                          const ts=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
                          const el=e.target; const b=el.value.slice(0,el.selectionStart); const a=el.value.slice(el.selectionStart);
                          el.value=b+`\n[${ts}] `+a; setNotes(el.value);
                        }
                      }}
                    />
                    <div style={{fontSize:10,color:"#aaa",marginTop:5}}>Tab = timestamp · Notes feed into post-call summary</div>
                    <div className="divider"/>
                    <div className="field-label" style={{marginBottom:7}}>Gates Logged ({Object.keys(gateAnswers).length})</div>
                    {Object.keys(gateAnswers).length===0&&<div style={{fontSize:11,color:"#bbb"}}>No gates answered yet</div>}
                    {Object.entries(gateAnswers).map(([k,v])=>(
                      <div key={k} style={{fontSize:10,color:"#555",padding:"4px 0",borderBottom:"1px solid #F0EDE6"}}>
                        <span style={{color:"#aaa"}}>{k}</span> → {v}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 7: POST-CALL ── */}
        {step===7&&(
          <div className="page">
            <div className="page-title">Post-Call Route</div>
            <div className="page-sub">RIVER synthesis for <strong>{selectedAccount?.company}</strong> — deal routing, next steps, CRM note, and follow-up email.</div>

            {postLoading&&(
              <div className="card">
                <div style={{fontSize:13,color:"#777",marginBottom:12}}>Synthesizing RIVER capture and generating deal route...</div>
                <div className="loading-pulse">{[80,55,90,45,70,60,85].map((w,i)=><div key={i} className="pulse-line" style={{width:`${w}%`,animationDelay:`${i*0.12}s`}}/>)}</div>
              </div>
            )}

            {postCall&&!postLoading&&(
              <>
                <div className="summary-grid">
                  <div className="stat-card"><div className="stat-num" style={{color:confColor(confidence)}}>{confidence}%</div><div className="stat-label">Deal Confidence</div></div>
                  <div className="stat-card"><div className="stat-num" style={{fontSize:14,paddingTop:4}}>{routeLabel}</div><div className="stat-label">Deal Route</div></div>
                  <div className="stat-card"><div className="stat-num">{selectedAccount?.acv>0?`$${selectedAccount.acv.toLocaleString()}`:"—"}</div><div className="stat-label">Deal Size</div></div>
                </div>

                <div className={`routing-card ${routeClass}`}>
                  <div className="route-label">Deal Route</div>
                  <div className="route-title">{routeLabel}</div>
                  <div className="route-desc">{postCall.dealRouteReason}</div>
                  {postCall.dealRisk&&<div style={{marginTop:7,fontSize:11,color:"#555"}}>⚠ Top risk: {postCall.dealRisk}</div>}
                </div>

                <div className="card">
                  <div className="card-title">RIVER Scorecard</div>
                  {postCall.riverScorecard&&RIVER_STAGES.map((stage,i)=>{
                    const keys=["reality","impact","vision","entryPoints","route"];
                    return (
                      <div key={i} className="hyp-card" style={{cursor:"default"}}>
                        <div className="hyp-label">{stage.letter} — {stage.label}</div>
                        <div className="hyp-text">{postCall.riverScorecard[keys[i]]}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="post-section">
                  <div className="post-label">Next Steps</div>
                  <div className="post-content">{postCall.nextSteps?.map((s,i)=>`${i+1}. ${s}`).join("\n")}</div>
                </div>

                <div className="post-section">
                  <div className="post-label">CRM Note <button className="copy-btn" onClick={()=>copyText(postCall.crmNote,"crm")}>{copied==="crm"?"Copied ✓":"Copy"}</button></div>
                  <div className="post-content">{postCall.crmNote}</div>
                </div>

                <div className="post-section">
                  <div className="post-label">Call Summary <button className="copy-btn" onClick={()=>copyText(postCall.callSummary,"summary")}>{copied==="summary"?"Copied ✓":"Copy"}</button></div>
                  <div className="post-content">{postCall.callSummary}</div>
                </div>

                <div className="post-section">
                  <div className="post-label">Follow-Up Email <button className="copy-btn" onClick={()=>copyText(`Subject: ${postCall.emailSubject}\n\n${postCall.emailBody}`,"email")}>{copied==="email"?"Copied ✓":"Copy Email"}</button></div>
                  <div className="post-content" style={{fontSize:12}}>
                    <div style={{fontWeight:600,marginBottom:9,color:"#1a1a18"}}>Subject: {postCall.emailSubject}</div>
                    {postCall.emailBody}
                  </div>
                </div>

                <div className="actions-row">
                  <button className="btn btn-secondary" onClick={()=>setStep(6)}>← Back to Call</button>
                  <button className="btn btn-gold" onClick={()=>{setPostCall(null);setPostLoading(true);setTimeout(runPostCall,100);}}>Regenerate</button>
                  <button className="btn btn-primary" onClick={()=>{
                    setStep(4);setSelectedAccount(null);setGateAnswers({});setRiverData({});
                    setPostCall(null);setBrief(null);setNotes("");setContactRole("");
                  }}>New Account</button>
                  <button className="btn btn-secondary" onClick={()=>{
                    setStep(1);setCohorts([]);setSelectedCohort(null);setSelectedOutcomes([]);
                    setSelectedAccount(null);setGateAnswers({});setRiverData({});
                    setPostCall(null);setBrief(null);setNotes("");setRows([]);setHeaders([]);setFileName("");
                  }}>New Dataset</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
