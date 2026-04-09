import React, { useState, useCallback, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #FAFAF8; color: #1a1a18; font-size: 18px; }
.app { min-height: 100vh; display: flex; flex-direction: column; }
.header { background: #fff; border-bottom: 1px solid #E8E6DF; padding: 0 28px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 200; flex-shrink: 0; }
.logo { font-family: 'Lora', serif; font-size: 18px; color: #1a1a18; white-space: nowrap; }
.logo span { color: #8B6F47; }
.stepper { display: flex; align-items: center; overflow-x: auto; }
.step-item { display: flex; align-items: center; gap: 6px; padding: 0 10px; font-size: 13px; font-weight: 600; color: #bbb; letter-spacing: 0.4px; text-transform: uppercase; cursor: default; white-space: nowrap; }
.step-item.active { color: #1a1a18; }
.step-item.done { color: #8B6F47; cursor: pointer; }
.step-num { width: 19px; height: 19px; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; }
.step-item.done .step-num { background: #8B6F47; border-color: #8B6F47; color: #fff; }
.step-item.active .step-num { background: #1a1a18; border-color: #1a1a18; color: #fff; }
.step-div { width: 14px; height: 1px; background: #E8E6DF; flex-shrink: 0; }
.live-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #2E6B2E; background: #EEF5EE; padding: 3px 9px; border-radius: 20px; }
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #2E6B2E; animation: blink 1.2s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1}50%{opacity:0.3} }
.page { max-width: 880px; margin: 0 auto; padding: 36px 28px 72px; width: 100%; }
.page-title { font-family: 'Lora', serif; font-size: 34px; font-weight: 600; margin-bottom: 6px; }
.page-sub { font-size: 17px; color: #555; line-height: 1.65; margin-bottom: 28px; max-width: 580px; }
.setup-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 14px; padding: 32px; max-width: 520px; margin: 60px auto 0; }
.setup-logo { font-family: 'Lora', serif; font-size: 25px; color: #1a1a18; margin-bottom: 4px; text-align: center; }
.setup-logo span { color: #8B6F47; }
.setup-url-bar { display: flex; align-items: center; gap: 8px; background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 8px; padding: 4px 12px; margin-bottom: 8px; }
.setup-url-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #aaa; white-space: nowrap; min-width: 80px; }
.setup-url-input { border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1a1a18; outline: none; width: 100%; padding: 6px 0; }
.upload-zone { border: 1.5px dashed #C8C4BB; border-radius: 12px; padding: 40px 24px; text-align: center; cursor: pointer; transition: all 0.2s; background: #fff; }
.upload-zone:hover, .upload-zone.drag { border-color: #8B6F47; background: #FAF8F4; }
.upload-label { font-family: 'Lora', serif; font-size: 17px; color: #1a1a18; margin-bottom: 5px; }
.upload-hint { font-size: 14px; color: #999; margin-bottom: 16px; }
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.15s; border: none; line-height: 1; white-space: nowrap; }
.btn:disabled { opacity: 0.4; cursor: default; }
.btn-primary { background: #1a1a18; color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.18); }
.btn-primary:hover:not(:disabled) { background: #2d2d2b; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.22); }
.btn-secondary { background: transparent; border: 1.5px solid #C8C4BB; color: #1a1a18; }
.btn-secondary:hover:not(:disabled) { border-color: #8B6F47; color: #8B6F47; }
.btn-gold { background: #8B6F47; color: #fff; box-shadow: 0 2px 6px rgba(139,111,71,0.3); }
.btn-gold:hover:not(:disabled) { background: #7A6040; transform: translateY(-1px); }
.btn-green { background: #2E6B2E; color: #fff; box-shadow: 0 2px 6px rgba(46,107,46,0.3); }
.btn-green:hover:not(:disabled) { background: #245424; transform: translateY(-1px); }
.btn-navy { background: #1B3A6B; color: #fff; box-shadow: 0 2px 6px rgba(27,58,107,0.3); }
.btn-navy:hover:not(:disabled) { background: #152d54; transform: translateY(-1px); }
.btn-lg { padding: 12px 22px; font-size: 16px; }
.btn-sm { padding: 5px 11px; font-size: 13px; }
.actions-row { display: flex; gap: 10px; margin-top: 24px; align-items: center; flex-wrap: wrap; }
.footer { text-align: center; padding: 24px 28px; font-size: 12px; color: #bbb; border-top: 1px solid #E8E6DF; margin-top: auto; background: #fff; }
.footer a { color: #bbb; text-decoration: none; }

/* IN-CALL v2 */
.incall-wrap { max-width: 960px; margin: 0 auto; padding: 24px 28px 72px; width: 100%; }
.incall-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
.incall-title { font-family: 'Lora', serif; font-size: 20px; font-weight: 600; color: #1a1a18; }
.incall-meta { font-size: 13px; color: #999; margin-top: 2px; }
.river-pills { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.river-pill { display: flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 30px; border: 2px solid #E8E6DF; background: #fff; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #999; transition: all 0.15s; white-space: nowrap; }
.river-pill:hover { border-color: #8B6F47; color: #8B6F47; }
.river-pill.active { background: #1a1a18; border-color: #1a1a18; color: #fff; }
.river-pill.filled { border-color: #2E6B2E; color: #2E6B2E; }
.river-pill.filled.active { background: #2E6B2E; border-color: #2E6B2E; color: #fff; }
.river-pill-letter { font-family: 'Lora', serif; font-size: 15px; font-weight: 700; }
.river-pill-dot { width: 7px; height: 7px; border-radius: 50%; background: #2E6B2E; flex-shrink: 0; }
.stage-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 16px; }
.stage-card-hdr { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.stage-letter-big { width: 44px; height: 44px; border-radius: 50%; background: #1a1a18; color: #8B6F47; font-family: 'Lora', serif; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stage-name { font-family: 'Lora', serif; font-size: 18px; font-weight: 600; color: #1a1a18; }
.stage-sub { font-size: 13px; color: #777; margin-top: 2px; }
.gate-block { margin-bottom: 20px; }
.gate-question { font-size: 15px; font-weight: 600; color: #1a1a18; margin-bottom: 12px; line-height: 1.5; }
.gate-choices { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.gate-choice { padding: 8px 16px; border-radius: 20px; border: 1.5px solid #E8E6DF; background: #FAFAF8; cursor: pointer; font-size: 13px; font-weight: 500; color: #555; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
.gate-choice:hover { border-color: #8B6F47; color: #8B6F47; background: #FAF8F4; }
.gate-choice.selected { background: #1a1a18; border-color: #1a1a18; color: #fff; }
.gate-note { width: 100%; padding: 10px 12px; border: 1px solid #E8E6DF; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #333; background: #FAFAF8; resize: vertical; min-height: 60px; outline: none; transition: border-color 0.15s; }
.gate-note:focus { border-color: #8B6F47; background: #fff; }
.gate-note-lbl { font-size: 11px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.dq-block { margin-bottom: 16px; background: #F8F6F1; border-radius: 12px; padding: 16px; border-left: 3px solid #8B6F47; }
.dq-framework { font-size: 10px; font-weight: 700; color: #8B6F47; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.dq-question { font-size: 14px; font-weight: 600; color: #1a1a18; margin-bottom: 10px; line-height: 1.5; font-style: italic; }
.dq-note { width: 100%; padding: 9px 12px; border: 1px solid #E8E6DF; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; background: #fff; resize: vertical; min-height: 56px; outline: none; }
.dq-note:focus { border-color: #8B6F47; }
.incall-sidebar { background: #fff; border: 1px solid #E8E6DF; border-radius: 14px; padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.conf-bar-wrap { margin-bottom: 16px; }
.conf-pct { font-family: 'Lora', serif; font-size: 28px; font-weight: 600; line-height: 1; }
.incall-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
@media(max-width: 800px){ .incall-grid { grid-template-columns: 1fr; } }

/* PRODUCT CATALOG */
.prod-entry { display: flex; gap: 10px; padding: 10px 12px; background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 8px; margin-bottom: 7px; align-items: flex-start; }
.prod-num { width: 22px; height: 22px; border-radius: 50%; background: #1a1a18; color: #8B6F47; font-family: 'Lora', serif; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.prod-fields { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.prod-name-input { font-size: 14px; font-weight: 600; padding: 5px 9px; border: 1px solid #E8E6DF; border-radius: 6px; background: #fff; font-family: 'DM Sans', sans-serif; color: #1a1a18; outline: none; }
.prod-name-input:focus { border-color: #8B6F47; }
.prod-desc-input { font-size: 13px; padding: 5px 9px; border: 1px solid #E8E6DF; border-radius: 6px; background: #fff; font-family: 'DM Sans', sans-serif; color: #555; outline: none; resize: vertical; min-height: 48px; }
.prod-desc-input:focus { border-color: #8B6F47; }
.prod-remove { font-size: 13px; color: #ccc; cursor: pointer; background: none; border: none; padding: 2px 4px; line-height: 1; align-self: flex-start; flex-shrink: 0; margin-top: 1px; }
.prod-remove:hover { color: #9B2C2C; }
.prod-chip { display: inline-flex; align-items: center; gap: 5px; background: #F0EDE6; color: #7A5C30; padding: 3px 9px; border-radius: 10px; font-size: 12px; font-weight: 600; margin: 2px; }
.prod-chip-dot { width: 5px; height: 5px; border-radius: 50%; background: #8B6F47; flex-shrink: 0; }

/* COHORT CHARTS & DRILL-DOWN */
.cohort-chart-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.pie-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 16px; }
.pie-title { font-family: 'Lora', serif; font-size: 14px; font-weight: 500; margin-bottom: 10px; color: #1a1a18; }
.pie-wrap { display: flex; align-items: center; gap: 14px; }
.pie-legend { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.pie-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #555; }
.pie-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.pie-legend-val { margin-left: auto; font-weight: 700; color: #1a1a18; font-size: 12px; }
.cohort-drill { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.cohort-drill-hdr { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid transparent; transition: border-color 0.15s; }
.cohort-drill-hdr:hover { background: #FAFAF8; }
.cohort-drill-hdr.open { border-bottom-color: #E8E6DF; }
.cohort-drill-left { display: flex; align-items: center; gap: 10px; }
.cohort-drill-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.cohort-drill-name { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; }
.cohort-drill-meta { font-size: 13px; color: #999; margin-top: 1px; }
.cohort-drill-right { display: flex; align-items: center; gap: 12px; }
.cohort-drill-acv { font-family: 'Lora', serif; font-size: 16px; color: #8B6F47; }
.cohort-drill-toggle { font-size: 12px; color: #aaa; font-weight: 700; }
.cohort-drill-body { padding: 0 16px 14px; }
.cohort-member-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
.cohort-member-table th { background: #F5F3EE; padding: 5px 9px; text-align: left; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; color: #777; white-space: nowrap; }
.cohort-member-table td { padding: 6px 9px; border-top: 1px solid #F0EDE6; color: #333; vertical-align: top; }
.cohort-member-table tr:hover td { background: #FAF8F4; }
.cohort-member-table tr { cursor: pointer; }
.outcome-badge { font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 8px; background: #F5EEF5; color: #6B3A7A; white-space: nowrap; }
.pw-gate { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #FAFAF8; }
.pw-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 16px; padding: 40px; width: 100%; max-width: 380px; text-align: center; }
.pw-logo { font-family: 'Lora', serif; font-size: 25px; color: #1a1a18; margin-bottom: 4px; }
.pw-logo span { color: #8B6F47; }
.pw-sub { font-size: 15px; color: #999; margin-bottom: 28px; }
.pw-input { width: 100%; padding: 11px 14px; border: 1.5px solid #E8E6DF; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 16px; outline: none; text-align: center; letter-spacing: 2px; margin-bottom: 12px; }
.pw-input:focus { border-color: #8B6F47; }
.pw-error { font-size: 14px; color: #9B2C2C; margin-bottom: 10px; min-height: 18px; }
.card { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 20px; margin-bottom: 14px; }
.card-title { font-family: 'Lora', serif; font-size: 18px; font-weight: 600; margin-bottom: 13px; }
.field-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.field-label { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.req { color: #8B6F47; }
.field-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
input[type=text], select, textarea { width: 100%; padding: 9px 12px; border: 1px solid #E8E6DF; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 16px; color: #1a1a18; background: #FAFAF8; outline: none; transition: border-color 0.15s; resize: vertical; -webkit-appearance: none; }
input[type=text]:focus, select:focus, textarea:focus { border-color: #8B6F47; background: #fff; }
.tbl-wrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
.tbl th { background: #F5F3EE; padding: 6px 10px; text-align: left; font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; white-space: nowrap; }
.tbl td { padding: 6px 10px; border-top: 1px solid #F0EDE6; color: #333; white-space: nowrap; }
.summary-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
.stat-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 10px; padding: 14px; text-align: center; }
.stat-num { font-family: 'Lora', serif; font-size: 28px; color: #8B6F47; margin-bottom: 2px; }
.stat-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.4px; }
.cohort-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); gap: 11px; margin-bottom: 22px; }
.cohort-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 12px; padding: 15px 17px; cursor: pointer; transition: all 0.18s; }
.cohort-card:hover, .cohort-card.selected { border-color: #8B6F47; }
.cohort-card.selected { background: #FAF8F4; }
.cohort-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; flex-shrink: 0; }
.cohort-name { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; margin-bottom: 3px; display: flex; align-items: center; }
.cohort-size { font-size: 12px; color: #aaa; margin-bottom: 8px; }
.tag-row { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px; }
.tag { font-size: 13px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
.tag-ind { background: #EEF2F8; color: #3A5A8C; }
.tag-size { background: #F3EDE6; color: #7A5C30; }
.tag-src { background: #EEF5EE; color: #2E6B2E; }
.tag-out { background: #F5EEF5; color: #6B3A7A; }
.cohort-stat { font-size: 12px; color: #777; }
.cohort-stat strong { color: #1a1a18; }
.account-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
.account-item { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 14px; cursor: pointer; transition: all 0.15s; }
.account-item:hover, .account-item.selected { border-color: #8B6F47; background: #FAF8F4; }
.account-name { font-size: 17px; font-weight: 500; color: #1a1a18; }
.account-meta { font-size: 13px; color: #999; margin-top: 2px; }
.account-acv { font-size: 14px; font-weight: 600; color: #8B6F47; }
.outcome-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; }
.outcome-tile { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 9px; padding: 12px; cursor: pointer; transition: all 0.18s; }
.outcome-tile:hover, .outcome-tile.selected { border-color: #8B6F47; }
.outcome-tile.selected { background: #FAF8F4; }
.outcome-icon { font-size: 18px; margin-bottom: 5px; }
.outcome-title { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
.outcome-sub { font-size: 12px; color: #999; line-height: 1.4; }

/* EDITABLE FIELDS */
.ef-wrap { position: relative; }
.ef-wrap:hover .ef-hint { opacity: 1; }
.ef-hint { position: absolute; top: -16px; right: 2px; font-size: 10px; color: #8B6F47; font-weight: 700; opacity: 0; transition: opacity 0.15s; pointer-events: none; text-transform: uppercase; letter-spacing: 0.4px; }
.ef-display { font-size: 17px; color: #333; line-height: 1.65; padding: 6px 8px; border-radius: 6px; border: 1px solid transparent; transition: all 0.15s; min-height: 32px; cursor: text; }
.ef-display:hover { border-color: #E8E6DF; background: #FAFAF8; }
.ef-empty { color: #bbb; font-style: italic; }
.ef-input { font-size: 14px; color: #333; line-height: 1.65; padding: 6px 8px; border-radius: 6px; border: 1.5px solid #8B6F47; background: #fff; width: 100%; font-family: 'DM Sans', sans-serif; outline: none; }
.ef-input-multi { min-height: 60px; resize: vertical; }

/* BRIEF BLOCKS */
.bb { background: #fff; border: 1px solid #E8E6DF; border-radius: 14px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.bb-hdr { display: flex; align-items: center; gap: 9px; padding: 11px 16px; background: #F8F6F1; border-bottom: 1px solid #E8E6DF; }
.bb-icon { width: 26px; height: 26px; border-radius: 6px; background: #1a1a18; display: flex; align-items: center; justify-content: center; font-family: 'Lora', serif; font-size: 13px; font-weight: 600; color: #8B6F47; flex-shrink: 0; }
.bb-title { font-family: 'Lora', serif; font-size: 17px; font-weight: 500; }
.bb-sub { font-size: 14px; color: #777; margin-top: 1px; }
.bb-body { padding: 14px 16px; }

.solution-item { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; }
.sol-badge { font-size: 13px; font-weight: 700; background: #F0EDE6; color: #7A5C30; border: 1px solid #D4C4A8; padding: 4px 12px; border-radius: 6px; white-space: nowrap; flex-shrink: 0; margin-top: 2px; font-family: 'Lora', serif; }
.signal-row { display: flex; gap: 8px; margin-bottom: 7px; align-items: flex-start; }
.sig-dot { width: 5px; height: 5px; border-radius: 50%; background: #8B6F47; flex-shrink: 0; margin-top: 5px; }
.contact-row { display: flex; gap: 10px; margin-bottom: 8px; background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 12px; align-items: flex-start; }
.contact-av { width: 30px; height: 30px; border-radius: 50%; background: #E8E6DF; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #666; flex-shrink: 0; }

/* LOADING */
.load-box { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 28px; margin-bottom: 14px; }
.load-status { font-size: 14px; color: #8B6F47; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.load-spin { width: 12px; height: 12px; border: 2px solid #E8E6DF; border-top-color: #8B6F47; border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.pulse-wrap { display: flex; flex-direction: column; gap: 7px; }
.pulse-line { height: 10px; background: #F0EDE6; border-radius: 5px; animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%{opacity:1}50%{opacity:0.4}100%{opacity:1} }
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

/* IN-CALL LAYOUT */
.call-layout { display: flex; flex: 1; height: calc(100vh - 56px); overflow: hidden; }
.call-left { width: 55%; border-right: 1px solid #E8E6DF; display: flex; flex-direction: column; background: #fff; overflow: hidden; }
.call-right { width: 45%; display: flex; flex-direction: column; background: #FAFAF8; overflow: hidden; }
.panel-hdr { padding: 12px 18px; border-bottom: 1px solid #E8E6DF; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: #fff; }
.panel-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; }
.panel-body { flex: 1; overflow-y: auto; padding: 16px 18px; }
.river-nav { display: flex; overflow-x: auto; border-bottom: 1px solid #E8E6DF; background: #FAFAF8; flex-shrink: 0; }
.r-tab { padding: 9px 13px; font-size: 12px; font-weight: 700; cursor: pointer; color: #bbb; border-bottom: 2px solid transparent; white-space: nowrap; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 5px; }
.r-tab:hover { color: #1a1a18; }
.r-tab.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #fff; }
.fill-dot { width: 5px; height: 5px; border-radius: 50%; background: #2E6B2E; flex-shrink: 0; }
.gate { background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 9px; padding: 12px; margin-bottom: 8px; }
.gate.answered { border-color: #2E6B2E; background: #F4FAF4; }
.gate-q { font-size: 14px; font-weight: 500; color: #1a1a18; margin-bottom: 9px; line-height: 1.4; }
.gate-opts { display: flex; flex-direction: column; gap: 5px; }
.gate-opt { display: flex; gap: 9px; align-items: center; padding: 7px 11px; border-radius: 7px; border: 1px solid #E8E6DF; background: #fff; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #333; text-align: left; }
.gate-opt:hover { border-color: #8B6F47; background: #FAF8F4; }
.gate-ans { font-size: 13px; color: #2E6B2E; font-weight: 500; margin-top: 5px; display: flex; align-items: center; gap: 6px; }
.conf-wrap { margin-bottom: 14px; }
.conf-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.conf-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.conf-score { font-family: 'Lora', serif; font-size: 21px; font-weight: 500; }
.conf-track { height: 5px; background: #E8E6DF; border-radius: 3px; overflow: hidden; }
.conf-fill { height: 100%; border-radius: 3px; transition: width 0.5s, background 0.5s; }
.right-tabs { display: flex; border-bottom: 1px solid #E8E6DF; background: #fff; flex-shrink: 0; }
.rt { padding: 9px 13px; font-size: 12px; font-weight: 700; cursor: pointer; color: #999; border-bottom: 2px solid transparent; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.4px; }
.rt:hover { color: #1a1a18; }
.rt.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #FAFAF8; }
.talk-box { background: #F8F6F1; border-left: 3px solid #8B6F47; border-radius: 0 8px 8px 0; padding: 10px 13px; margin-bottom: 10px; }
.talk-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 4px; }
.talk-txt { font-size: 13px; color: #555; line-height: 1.6; font-style: italic; }
.obj-item { border: 1px solid #E8E6DF; border-radius: 7px; overflow: hidden; background: #fff; margin-bottom: 5px; }
.obj-btn { display: flex; justify-content: space-between; align-items: center; padding: 8px 11px; cursor: pointer; font-size: 13px; font-weight: 500; width: 100%; text-align: left; background: none; border: none; font-family: 'DM Sans', sans-serif; color: #1a1a18; }
.obj-ans { padding: 7px 11px 9px; font-size: 13px; color: #555; line-height: 1.5; font-style: italic; border-top: 1px solid #F0EDE6; }
.hyp-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 12px; margin-bottom: 6px; cursor: pointer; transition: border-color 0.15s; }
.hyp-card:hover { border-color: #8B6F47; }
.hyp-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 3px; }
.hyp-txt { font-size: 13px; color: #333; line-height: 1.5; }
.post-sec { margin-bottom: 18px; }
.post-lbl { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 7px; display: flex; align-items: center; justify-content: space-between; }
.post-content { background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 13px; font-size: 14px; color: #333; line-height: 1.65; white-space: pre-wrap; }
.copy-btn { font-size: 12px; color: #8B6F47; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; font-weight: 700; padding: 0; }
.copy-btn:hover { text-decoration: underline; }
.route-card { border-radius: 9px; padding: 16px 18px; margin-bottom: 14px; border: 1.5px solid; }
.route-fast { background: #EEF5EE; border-color: #2E6B2E; }
.route-nurture { background: #FEF3E2; border-color: #BA7517; }
.route-disq { background: #FDE8E8; border-color: #9B2C2C; }
.route-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.route-fast .route-lbl { color: #2E6B2E; }
.route-nurture .route-lbl { color: #92540A; }
.route-disq .route-lbl { color: #9B2C2C; }
.route-title { font-family: 'Lora', serif; font-size: 17px; font-weight: 500; margin-bottom: 5px; }
.route-desc { font-size: 13px; color: #555; line-height: 1.5; }
.notice { background: #F8F6F1; border: 1px solid #E8E6DF; border-radius: 8px; padding: 11px 14px; font-size: 13px; color: #777; line-height: 1.6; margin-bottom: 14px; }
.notice strong { color: #1a1a18; }
.divider { height: 1px; background: #E8E6DF; margin: 16px 0; }
.session-bar { background: #F8F6F1; border-bottom: 1px solid #E8E6DF; padding: 7px 28px; display: flex; align-items: center; gap: 14px; font-size: 13px; color: #777; flex-shrink: 0; flex-wrap: wrap; }
.session-url { color: #8B6F47; font-weight: 500; }
.r-icon { width: 24px; height: 24px; border-radius: 5px; background: #1a1a18; display: flex; align-items: center; justify-content: center; font-family: 'Lora', serif; font-size: 13px; font-weight: 600; color: #8B6F47; flex-shrink: 0; }

/* DOC UPLOAD */
.doc-upload-zone { border: 1.5px dashed #C8C4BB; border-radius: 9px; padding: 18px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s; background: #FAFAF8; flex-wrap: wrap; }
.doc-upload-zone:hover, .doc-upload-zone.drag { border-color: #8B6F47; background: #FAF8F4; }
.doc-upload-icon { width: 32px; height: 32px; border-radius: 8px; background: #F0EDE6; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.doc-upload-text { flex: 1; min-width: 160px; }
.doc-upload-title { font-size: 14px; font-weight: 600; color: #1a1a18; margin-bottom: 2px; }
.doc-upload-hint { font-size: 12px; color: #aaa; }
.doc-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.doc-chip { display: inline-flex; align-items: center; gap: 6px; background: #1a1a18; color: #C8A87A; padding: 4px 10px 4px 8px; border-radius: 20px; font-size: 12px; font-weight: 600; max-width: 200px; }
.doc-chip-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.doc-chip-x { cursor: pointer; color: #777; font-size: 13px; line-height: 1; flex-shrink: 0; }
.doc-chip-x:hover { color: #fff; }
.doc-chip-label { font-size: 10px; background: #333; color: #8B6F47; padding: 1px 5px; border-radius: 10px; white-space: nowrap; }
.session-doc-chip { display: inline-flex; align-items: center; gap: 4px; background: #F0EDE6; color: #7A5C30; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 600; }
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
  // ── QSR (Quick Service Restaurant) ──────────────────────────────────────
  {company:"McDonald's Corporation",     industry:"QSR",          acv:"$340,000",  lead_source:"Conference",      close_date:"2026-06-30", product:"Employee Rewards Platform",    outcome:"Reduce crew turnover and improve shift fill rates",               company_url:"mcdonalds.com"},
  {company:"Chick-fil-A",               industry:"QSR",          acv:"$185,000",  lead_source:"Referral",        close_date:"2026-05-15", product:"Franchisee Incentive Program", outcome:"Increase franchisee performance and brand consistency",            company_url:"chick-fil-a.com"},
  {company:"Chipotle Mexican Grill",    industry:"QSR",          acv:"$220,000",  lead_source:"Direct Outreach", close_date:"2026-07-31", product:"Employee Recognition Suite",   outcome:"Improve retention of restaurant managers and crew leads",          company_url:"chipotle.com"},
  {company:"Yum! Brands",              industry:"QSR",          acv:"$410,000",  lead_source:"Partner Referral",close_date:"2026-08-15", product:"Multi-Brand Rewards Platform", outcome:"Unify incentive programs across KFC, Pizza Hut, Taco Bell",       company_url:"yum.com"},
  {company:"Darden Restaurants",       industry:"QSR",          acv:"$160,000",  lead_source:"Inbound",         close_date:"2026-06-15", product:"Hourly Worker Recognition",    outcome:"Reduce time-to-hire and improve employee NPS scores",             company_url:"darden.com"},

  // ── Blue Chip / Large Enterprise ─────────────────────────────────────────
  {company:"Johnson & Johnson",         industry:"Healthcare / Blue Chip", acv:"$525,000",  lead_source:"Direct Outreach", close_date:"2026-09-30", product:"Global Rewards & Recognition", outcome:"Modernize legacy employee rewards across 140 countries",       company_url:"jnj.com"},
  {company:"FedEx Corporation",         industry:"Logistics / Blue Chip",  acv:"$390,000",  lead_source:"Conference",      close_date:"2026-07-31", product:"Driver & Team Incentives",     outcome:"Improve on-time performance and reduce driver attrition",     company_url:"fedex.com"},
  {company:"General Mills",             industry:"CPG / Blue Chip",        acv:"$210,000",  lead_source:"Referral",        close_date:"2026-05-31", product:"Sales Incentive Platform",     outcome:"Drive distributor engagement and sales rep performance",       company_url:"generalmills.com"},
  {company:"Aramark Corporation",       industry:"Food Services / Blue Chip",acv:"0", lead_source:"Direct Outreach",close_date:"2026-08-30", product:"Workforce Rewards Suite",     outcome:"Reduce turnover across 270,000 hourly food service employees", company_url:"aramark.com"},
  {company:"Sodexo",                    industry:"Facilities / Blue Chip",  acv:"$355,000",  lead_source:"Partner Referral",close_date:"2026-10-31", product:"Employee Recognition Platform", outcome:"Improve engagement scores and reduce absenteeism globally",  company_url:"sodexo.com"},

  // ── FinTech ───────────────────────────────────────────────────────────────
  {company:"Stripe",                    industry:"FinTech / Payments",     acv:"$145,000",  lead_source:"Inbound",         close_date:"2026-04-30", product:"Sales & Engineering Rewards",  outcome:"Retain top engineering and GTM talent in a competitive market",  company_url:"stripe.com"},
  {company:"Marqeta",                   industry:"FinTech / Issuer",       acv:"$98,000",   lead_source:"Direct Outreach", close_date:"2026-05-15", product:"Customer Incentive Program",   outcome:"Increase card activation and transaction volume with rewards",   company_url:"marqeta.com"},
  {company:"Brex",                      industry:"FinTech / Corporate Spend",acv:"0", lead_source:"Conference",      close_date:"2026-06-30", product:"Partner & Channel Rewards",    outcome:"Drive referral and reseller channel growth with incentives",     company_url:"brex.com"},
  {company:"Klarna",                    industry:"FinTech / BNPL",         acv:"$175,000",  lead_source:"Referral",        close_date:"2026-07-15", product:"Consumer Loyalty Platform",    outcome:"Increase repeat purchase rate and reduce churn among shoppers",   company_url:"klarna.com"},
  {company:"Plaid",                     industry:"FinTech / Infrastructure",acv:"0", lead_source:"Inbound",         close_date:"2026-05-31", product:"Developer & Partner Rewards",  outcome:"Grow API usage and deepen bank partnership engagement",          company_url:"plaid.com"},

  // ── Series A / B ──────────────────────────────────────────────────────────
  {company:"Ramp",                      industry:"FinTech / Series C (prev B)",acv:"0",lead_source:"Conference",   close_date:"2026-04-30", product:"Sales Team Incentives",        outcome:"Accelerate pipeline growth and SDR ramp time",                  company_url:"ramp.com"},
  {company:"Lattice",                   industry:"HR Tech / Series D",     acv:"$58,000",   lead_source:"Inbound",         close_date:"2026-05-15", product:"Manager Excellence Rewards",   outcome:"Increase platform adoption and reduce HR software churn",         company_url:"lattice.com"},
  {company:"Rippling",                  industry:"HR / Workforce Tech",    acv:"$92,000",   lead_source:"Direct Outreach", close_date:"2026-06-15", product:"Employee Milestone Program",   outcome:"Improve onboarding completion and 90-day retention rates",       company_url:"rippling.com"},
  {company:"Persona",                   industry:"Identity / Series B",    acv:"$44,000",   lead_source:"Referral",        close_date:"2026-05-31", product:"Go-To-Market Incentives",      outcome:"Drive partner referrals and accelerate enterprise sales cycles",  company_url:"withpersona.com"},
  {company:"Finix",                     industry:"Payments Infra / Series B",acv:"0", lead_source:"Conference",      close_date:"2026-07-31", product:"Customer Milestone Rewards",   outcome:"Increase payment volume activation among platform customers",    company_url:"finix.io"},

  // ── Hospitality & Universities ────────────────────────────────────────────
  {company:"Marriott International",    industry:"Hospitality",            acv:"$285,000",  lead_source:"Direct Outreach", close_date:"2026-08-31", product:"Associate Recognition Platform",outcome:"Reduce hotel staff turnover and improve guest satisfaction scores",company_url:"marriott.com"},
  {company:"Hyatt Hotels Corporation",  industry:"Hospitality",            acv:"$198,000",  lead_source:"Referral",        close_date:"2026-07-15", product:"Property Incentive Program",   outcome:"Drive upsell performance and front desk engagement",             company_url:"hyatt.com"},
  {company:"University of Washington",  industry:"Higher Education",       acv:"$78,000",   lead_source:"Inbound",         close_date:"2026-05-31", product:"Staff Recognition Suite",      outcome:"Improve staff retention and engagement across 30,000 employees", company_url:"uw.edu"},
  {company:"Ohio State University",     industry:"Higher Education",       acv:"$92,000",   lead_source:"Direct Outreach", close_date:"2026-06-30", product:"Faculty & Staff Rewards",      outcome:"Modernize recognition programs and reduce administrative burden", company_url:"osu.edu"},
  {company:"Purdue University",         industry:"Higher Education",       acv:"$67,000",   lead_source:"Conference",      close_date:"2026-07-31", product:"Student & Staff Incentives",   outcome:"Drive research participation and improve employee satisfaction",  company_url:"purdue.edu"},
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

const BLANK_BRIEF = {
  companySnapshot:"",sellerSnapshot:"",
  revenue:"",publicPrivate:"",employeeCount:"",headquarters:"",founded:"",website:"",linkedIn:"",
  keyExecutives:[],recentHeadlines:[],
  openRoles:{summary:"",roles:[]},
  solutionMapping:[{product:"",fit:""},{product:"",fit:""},{product:"",fit:""}],
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
    ? "SELLER DOCS:\n"+sellerDocs.map(d=>d.label+": "+d.content.slice(0,600)).join("\n")
    : "Seller: "+sellerUrl+(activeProductUrls.length?" | Product pages: "+activeProductUrls.join(", "):"");
  const prodCtx = products.filter(p=>p.name.trim()).length>0
    ? "\nPRODUCTS: "+products.filter(p=>p.name.trim()).map(p=>p.name+(p.description?" - "+p.description:"")).join("; ")
    : "";
  const dealCtx = `${selectedCohort?.name||""} cohort | Industry: ${member.ind||""} | Industry: ${member.ind||""} | Outcomes: ${(selectedOutcomes||[]).join(", ")||"Not set"}`;

  const schema =
    `{"companySnapshot":"3-4 sentences: what they do, revenue scale, employee count, HQ, recent strategic direction",`+
    `"revenue":"e.g. $2.4B ARR (FY2024)","publicPrivate":"e.g. Public (NYSE:TGT)","employeeCount":"e.g. ~47,000","headquarters":"City, State","founded":"Year","website":"e.g. darden.com","linkedIn":"e.g. linkedin.com/company/darden-restaurants",`+
    `"keyExecutives":[`+
    `{"name":"Real name","title":"CEO","initials":"AB","background":"Prior role + known priority","angle":"What personally drives them — their board priority, their career ambition, what specific gap keeps them up at night (2 sentences max)"},`+
    `{"name":"Real name","title":"CHRO or CPO","initials":"CD","background":"People/HR focus","angle":"Success in their terms — retention improvement, culture wins, HR tech ROI, or team productivity gains (2 sentences max)"},`+
    `{"name":"Real name","title":"CFO or COO","initials":"EF","background":"Financial/operational focus","angle":"How they evaluate spend decisions — ROI lens, risk reduction, operational efficiency, or cost avoidance (2 sentences max)"}],`+
    `"recentHeadlines":[{"headline":"Headline + date","relevance":"Why this matters for the sale"},{"headline":"","relevance":""},{"headline":"","relevance":""},{"headline":"","relevance":""}],`+
    `"openRoles":{"summary":"What the hiring pattern reveals about strategic priorities and current pain","roles":[{"title":"","dept":"","signal":"Strategic meaning"},{"title":"","dept":"","signal":""},{"title":"","dept":"","signal":""}]},`+
    `"publicSentiment":{"bbbRating":"","standoutReview":{"text":"Most relevant review found","source":"Glassdoor/BBB/LinkedIn","sentiment":"positive or negative"}},`+
    `"sellerSnapshot":"2-3 sentences on sellers most relevant offerings for this prospect",`+
    `"fundingProfile":"CRITICAL: This is about ${co} (the PROSPECT), NOT the seller. What is ${co}'s ownership structure? If PE-backed name the PE firm and year acquired. If VC-backed list the series (A/B/C/D/E), total raised, lead investors, and most recent round. If public list the exchange and ticker. If private only, note estimated revenue or valuation if known.",`+
    `"strategicTheme":"2-3 sentences on their current strategic direction",`+
    `"sellerOpportunity":"2-3 sentences: why the seller is well-positioned right now - the why-you-why-now that opens doors",`+
    `"solutionMapping":[{"product":"Specific offering from seller","fit":"SA rationale: how this maps to their business need, what architecture complexity exists, and what outcome it drives"},{"product":"","fit":"SA rationale for second solution"},{"product":"","fit":"SA rationale for third solution"}],`+`"caseStudies":[`+`{"title":"Case study or customer name from seller website","customer":"Customer company name","relevance":"Why this is relevant to this prospect specifically"},`+`{"title":"Second relevant case study or named customer","customer":"","relevance":""},`+`{"title":"Third case study if applicable","customer":"","relevance":""}],`+
    `"openingAngle":"Sharp statement not a question referencing something real. Format: Most [industry] companies [assumption]. What the data shows is [reframe]. Is that showing up for you?",`+
    `"watchOuts":["Specific risk","Competitive risk","Budget or stakeholder risk"],`+
    `"keyContacts":[`+`{"name":"Real name if findable","title":"VP or Director or Manager-level title — NOT C-suite","initials":"AB","angle":"Why they feel this pain daily and how to get their attention"},`+`{"name":"Real name if findable","title":"Another mid-level champion — HR Tech, Total Rewards, Benefits, Ops","initials":"CD","angle":"Their specific problem and what a win looks like for them"},`+`{"name":"Real name if findable","title":"Third in-road — procurement, IT, or functional lead","initials":"EF","angle":"How they influence the decision and what they care about"}],`+
    `"competitors":["Competitor 1","Competitor 2","Competitor 3"],`+
    `"recentSignals":["Top buying signal","Second signal","Third signal"],`+
    `"growthSignals":["Growth indicator with evidence","Second signal","Third signal"],`+`"processMaturity":{"dmiacStage":"Define|Measure|Analyze|Improve|Control",`+`"maturityNote":"Where they are in improvement cycle and seller entry implication (1 sentence)",`+`"processGaps":["Gap 1","Gap 2"],`+`"bottlenecks":["Bottleneck 1","Bottleneck 2"]}}`;

  // Phase 1: Training-knowledge brief - no web search, shows in ~6-8s
  onStatus("Building brief for "+co+"...");
  // Slim phase1 prompt — rich but concise, avoids token waste on instructions
  const phase1Prompt =
    `Senior B2B sales strategist. Build a pre-call brief about the TARGET PROSPECT "${co}" for a seller.\n`+`CRITICAL JSON RULES: ASCII punctuation only. No curly quotes. No em-dashes. No trailing commas. No newlines inside strings.\n`+
    `Apply: Gap Selling (quantify gaps), Challenger Sale (teach something new), Carnegie (their interests).\n`+`Apply DMAIC lens to processMaturity: Define=knows problem but unmeasured, Measure=has anecdotal data, Analyze=diagnosing root cause, Improve=evaluating solutions (prime selling moment), Control=sustaining/scaling.\n`+
    `ASCII punctuation only. Real facts only. Return raw JSON starting with {:\n`+
    `SELLER (context only — do NOT write the brief about the seller):\n${sellerCtx}${prodCtx}\n`+
    `PROSPECT TO RESEARCH: ${co} (${dealCtx})\n`+
    `ALL fields below are about ${co}, not the seller.\n\n`+schema;

  // Phase 2: Live enrichment - fires in parallel, merges when ready
  const phase2Prompt =
    `Search for the most recent 2024-2025 news about "${co}" (domain: ${url}).\n`+
    `Find: headlines, M&A, hiring signals, leadership changes, funding news.\n`+
    `Return ONLY raw JSON, start with {:\n`+
    `{"recentHeadlines":[{"headline":"Specific headline + source + date","relevance":"Why this matters for a sale"},{"headline":"","relevance":""},{"headline":"","relevance":""},{"headline":"","relevance":""}],`+
    `"openRoles":{"summary":"What hiring reveals about priorities","roles":[{"title":"","dept":"","signal":""},{"title":"","dept":"","signal":""},{"title":"","dept":"","signal":""}]},`+
    `"fundingProfile":"Latest funding info found",`+
    `"recentSignals":["Most actionable buying signal","Second","Third"],`+
    `"growthSignals":["Growth signal with evidence","Second","Third"],`+
    `"companySnapshot":"Updated 3-4 sentence snapshot with any new facts found"}`;

  // Fire both simultaneously
  const phase1Promise = callAI(phase1Prompt);
  const phase2Promise = (async()=>{
    try{
      const r = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:2000,
          tools:[{type:"web_search_20250305",name:"web_search",max_uses:2}],
          messages:[{role:"user",content:phase2Prompt},{role:"assistant",content:"{"}],
        }),
      });
      const d=await r.json();
      if(d.error)return null;
      const raw=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      return safeParseJSON(raw.startsWith("{")?raw:"{"+raw);
    }catch(e){console.warn("Phase 2 failed:",e.message);return null;}
  })();

  // Await phase 1 only - user sees brief immediately
  const phase1Result = await phase1Promise;
  const brief = (phase1Result&&typeof phase1Result==="object")
    ? phase1Result
    : {...BLANK_BRIEF,companySnapshot:co+" - "+member.ind+". Edit fields below.",_error:"Brief generation failed - try Regenerate."};

  onStatus("");
  return {_brief:brief,_phase2Promise:phase2Promise};
}


function exportToExcel(brief,gateAnswers,riverData,postCall,account,cohort,outcomes,sellerUrl,confidence){
  const ts=new Date().toISOString().slice(0,10);
  const co=account?.company||"Account";
  const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const H="font-family:Arial;font-size:11pt;font-weight:bold;background:#1a1a18;color:#ffffff;padding:5px 8px;";
  const C="font-family:Arial;font-size:10pt;padding:5px 8px;vertical-align:top;";
  const S="font-family:Arial;font-size:10pt;font-weight:bold;color:#8B6F47;padding:5px 8px;";
  const mkRow=(cells,isHeader)=>`<tr>${(Array.isArray(cells)?cells:[cells]).map((c,i)=>`<td style="${isHeader&&i===0?H:typeof c==="string"&&c&&c===c.toUpperCase()&&i===0&&c.length>2&&!/[a-z]/.test(c)?S:C}">${esc(c)}</td>`).join("")}</tr>`;
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
  "Bribing the hamsters to run faster...",
  "Enhance. Enhance. Enhance.",
  "Building your map to success...",
  "Connecting dots you didn't know existed...",
  "Reading their annual report so you don't have to...",
  "Turning raw data into genuine expertise...",
  "Figuring out what keeps their CHRO up at night...",
  "Triangulating your path to yes...",
  "Becoming the most prepared person in the room...",
  "Translating their world into your opportunity...",
  "Warming up the problem-solving engine...",
  "Finding the signal in the noise...",
  "Mapping their priorities to your solutions...",
  "Asking the data nicely...",
  "Doing the homework so you can ask better questions...",
  "Turning intelligence into insight...",
  "Getting you to expert status in 15 seconds...",
  "Identifying the problem. Quantifying the impact. Building the case.",
  "Building a brief worthy of their time...",
  "Almost there — this is the good part...",
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
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  // Password is baked into the bundle via Vite env var
  // Set VITE_APP_PASSWORD in Vercel environment variables
  const CORRECT = "Crow2026";

  // Check sessionStorage for existing auth
  useEffect(() => {
    if (sessionStorage.getItem("cambrian_auth") === "1") onAuth();
  }, []);

  const submit = () => {
    if (!pw.trim()) return;
    if (pw.trim() === CORRECT) {
      sessionStorage.setItem("cambrian_auth", "1");
      onAuth();
    } else {
      setError("Incorrect password. Try again.");
      setPw("");
    }
  };

  return (
    <div className="pw-gate">
      <style>{FONTS}</style>
      <div className="pw-card">
        <div className="pw-logo">Cambrian <span>Catalyst</span></div>
        <div className="pw-sub">Revenue Playbook Engine · Private Beta</div>
        <input
          className="pw-input"
          type="password"
          placeholder="Enter password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          autoFocus
        />
        <div className="pw-error">{error}</div>
        <button
          className="btn btn-primary btn-lg"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={submit}
          disabled={!pw.trim()}
        >
          Enter →
        </button>
      </div>
    </div>
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

function CohortDrillDown({cohort, selected, onSelect, onPickAccount, fitScores={}, fitScoring=false}){
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
  const[_step,_setStep]=useState(0);
  const step=_step;
  const setStep=(n)=>{_setStep(n);window.scrollTo({top:0,behavior:"smooth"});};
  const[sellerUrl,setSellerUrl]=useState("");
  const[sellerInput,setSellerInput]=useState("");
  const[productPageUrl,setProductPageUrl]=useState(""); // kept for backward compat
  const[productUrls,setProductUrls]=useState([{url:"",label:""}]); // up to 5
  const[urlScanStatus,setUrlScanStatus]=useState(""); // "scanning"|"found"|"none"|""
  const[urlScanConfirmed,setUrlScanConfirmed]=useState(false);
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
    const companies = members.slice(0,30).map(m=>`${m.company}|${m.ind||"Unknown industry"}|${m.company_url||""}`).join("\n");
    const prompt =
      `You are a B2B sales strategist. For each company below, score fit AND provide key firmographic data from your training knowledge.\n\n`+
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
        map[s.company] = {...s, color, bg, ownerColor};
        memberUpdates[s.company] = {orgSize:s.orgSize||"", ownership:s.ownership||"", ownershipType:s.ownershipType||""};
      });
      setFitScores(map);
      // Push orgSize + ownership back into cohort members so table shows them
      setCohorts(prev=>prev.map(c=>({
        ...c,
        members:c.members.map(m=>memberUpdates[m.company]
          ? {...m,
              employees:m.employees||memberUpdates[m.company].orgSize,
              publicPrivate:m.publicPrivate||memberUpdates[m.company].ownership}
          : m)
      })));
    }
    setFitScoring(false);
  };

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
          max_tokens:1200,
          tools:[{type:"web_search_20250305",name:"web_search",max_uses:3}],
          messages:[{role:"user",content:prompt}],
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

  const goToCohorts=()=>{
    const b=buildCohorts(rows,mapping);
    setCohorts(b);
    setSelectedCohort(b[0]||null);
    setStep(2);
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
  const goToOutcomes=()=>{if(selectedCohort){setSelectedOutcomes(selectedCohort.topOut.slice(0,2));setStep(3);}};

  const pickAccount=async member=>{
    setSelectedAccount(member);
    setBrief(null);
    setBriefLoading(true);
    setBriefError("");
    setBriefStatus("Researching "+member.company+"...");
    setGateAnswers({});setGateNotes({});setRiverData({});setDiscoveryQs(null);setDealValue("");setDealClassification("");setNotes("");setPostCall(null);setContactRole("");
    setStep(4);

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

    _phase2Promise.then(enrichment=>{
      if(!enrichment) return;
      setBrief(prev=>{
        if(!prev) return prev;
        const next={...prev};
        if(enrichment.recentHeadlines?.some(h=>h?.headline)) next.recentHeadlines=enrichment.recentHeadlines;
        if(enrichment.openRoles?.summary) next.openRoles=enrichment.openRoles;
        if(enrichment.fundingProfile) next.fundingProfile=enrichment.fundingProfile;
        if(enrichment.recentSignals?.some(s=>s)) next.recentSignals=enrichment.recentSignals;
        if(enrichment.growthSignals?.some(s=>s)) next.growthSignals=enrichment.growthSignals;
        // Only update companySnapshot if it looks like real data (not a search error)
        const snapOk = enrichment.companySnapshot?.length>50 &&
          !enrichment.companySnapshot.includes("Search failed") &&
          !enrichment.companySnapshot.includes("cannot filter") &&
          !enrichment.companySnapshot.includes("web search tool") &&
          !enrichment.companySnapshot.includes("visit ") &&
          !enrichment.companySnapshot.includes("check news");
        if(snapOk) next.companySnapshot=enrichment.companySnapshot;
        return next;
      });
      console.log("Brief enriched with live research");
    }).catch(e=>console.warn("Enrichment failed:",e.message));
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
      "CRITICAL CONSTRAINT: This hypothesis must ONLY reference things the SELLER can deliver. Do NOT suggest the prospect fix food waste, labor costs, or anything outside the seller's scope.\n\n" +
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
      "Every field must be grounded in what " + sellerUrl + " specifically sells. Do not stray into general consulting.\n" +
      "Apply DMAIC lens: Reality=Define+Measure, Impact=Analyze, Vision=Improve, Route=Control.\n" +
      "Return ONLY raw JSON, ASCII punctuation only:\n" +
      JSON.stringify({
        reality:"The specific problem " + co + " faces that "+sellerUrl+" can directly solve — not generic ops issues. Tie to their signals and what the seller's products address.",
        impact:"Cost of this problem in terms the seller's solution resolves — revenue, efficiency, or brand impact. Reference a specific signal.",
        vision:"What "+co+" looks like when "+sellerUrl+"'s solution is working — measurable outcomes in their language.",
        entryPoints:"Decision-maker at "+co+" who owns the problem the seller solves — specific names or titles from the brief.",
        route:"Step-by-step path from today to a signed deal, using "+sellerUrl+"'s sales motion — pilot, POC, or direct.",
        openingAngle:"One sharp insight that connects a real signal about "+co+" to a specific capability of "+sellerUrl+". Statement, not a question.",
        talkTracks:[
          {stage:"Opening",line:"Reference something specific about "+co+" that connects to "+sellerUrl+"'s work"},
          {stage:"Discovery",line:"Best gap-finding question scoped to what "+sellerUrl+" can actually fix"},
          {stage:"Impact",line:"Quantify the cost of the gap in terms "+sellerUrl+"'s solution resolves"},
          {stage:"Vision",line:"Paint the future state using "+sellerUrl+"'s specific capabilities"},
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
      `You are a senior B2B discovery coach trained in active listening and human-centered selling.\n`+
      `Frameworks you apply: Gap Selling, Challenger Sale, plus the following listening principles:\n`+
      `- Active Listening (Heather Younger): listen for what is NOT said; reflect back what you hear\n`+
      `- Just Listen (Mark Goulston): make the other person feel heard before advancing your agenda\n`+
      `- How to Know a Person (David Brooks): witness their reality with openness; ask about their world not your product\n`+
      `- We Need to Talk (Celeste Headlee): no multitasking, no assumptions, be present and curious\n`+
      `- The Charisma Myth (Olivia Fox Cabane): project presence, power, and warmth — make them feel seen\n\n`+
      `SELLER: ${seller} | PRODUCTS: ${products_ctx}\n`+
      `PROSPECT: ${co} | SNAPSHOT: ${snapshot} | STRATEGIC THEME: ${theme}\n\n`+
      `Generate 3 discovery questions per RIVER stage. Each question must:\n`+
      `- Be product-specific (tie to what the seller actually sells)\n`+
      `- Make the prospect feel seen and heard, not interrogated\n`+
      `- Surface a gap or create an insight they hadn't articulated\n`+
      `- Be conversational, not clinical\n\n`+
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
      `- Shrivastav: identify AI/ML, cloud-native, or legacy modernization signals — which products fit best?\n\n`+
      `Return ONLY raw JSON, start with {:\n`+
      `{"dmiacStage":"Define or Measure or Analyze or Improve or Control",`+`"dmiacRationale":"Why this stage, and what it means for the selling approach and timing",`+`"entryStrategy":"Given their DMAIC stage: Quick Win Pilot, Diagnostic Workshop, Full Deployment, or Expansion and Scale - and why",`+`"confirmedSolutions":[{"product":"solution name","fitScore":85,"fitLabel":"Strong Fit","businessAlignment":"How it maps to their stated business need","architectureNotes":"Integration complexity, scale requirements, tech stack considerations","implementationPhase":"Phase 1 (Immediate) or Phase 2 (3-6mo) or Phase 3 (6-12mo)","risks":"Specific technical or organizational risks"}],`+
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

    setPostCall(result||{callSummary:"Unable to generate synthesis. Review your discovery notes and try again.",riverScorecard:{reality:"",impact:"",vision:"",entryPoints:"",route:""},dealRoute:"NURTURE",dealRouteReason:"Insufficient data captured to route definitively.",dealRisk:"Incomplete discovery",nextSteps:["Schedule follow-up call","Share relevant case study","Confirm economic buyer"],crmNote:"Call completed. Review notes for next steps.",emailSubject:`Following up — ${selectedAccount?.company}`,emailBody:"Hi,\n\nThank you for your time today. I'll follow up with next steps shortly.\n\nBest,"});
    setPostLoading(false);
    setStep(7);
  };

  const copyText=(t,k)=>{navigator.clipboard.writeText(t).then(()=>{setCopied(k);setTimeout(()=>setCopied(""),2000);});};
  const isFilled=s=>s.gates.some(g=>gateAnswers[g.id])||s.discovery.some(p=>riverData[p.id]?.trim());
  const doExport=()=>exportToExcel(brief,gateAnswers,riverData,postCall,selectedAccount,selectedCohort,selectedOutcomes,sellerUrl,confidence);

  const STEPS=["Session","Import","Accounts","Account Review","Brief","Hypothesis","In-Call","Post-Call","Solution Fit"];
  const routeClass=postCall?.dealRoute==="FAST_TRACK"?"route-fast":postCall?.dealRoute==="NURTURE"?"route-nurture":"route-disq";
  const routeLabel=postCall?.dealRoute==="FAST_TRACK"?"Fast Track →":postCall?.dealRoute==="NURTURE"?"Nurture":"Disqualify";

  if(!authed) return <PasswordGate onAuth={()=>setAuthed(true)}/>;

  return(
    <>
      <style>{FONTS}{css}</style>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="logo">Cambrian <span>Catalyst</span></div>
          <div className="stepper">
            {STEPS.map((s,i)=>{
              // Determine if step is reachable
              const canNav = (()=>{
                if(i===step) return false; // already here
                if(i===0) return true; // session always
                if(i===1) return !!sellerUrl; // import needs session
                if(i===2) return cohorts.length>0; // accounts needs import
                if(i===3) return cohorts.length>0; // account review needs accounts
                if(i===4) return !!brief; // brief needs account picked
                if(i===5) return !!brief; // hypothesis needs brief
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
          <div>{step===6&&<div className="live-badge"><div className="live-dot"/>Live Call</div>}</div>
        </header>

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
            {selectedCohort&&<><span>·</span><span>Cohort: <strong>{selectedCohort.name}</strong></span></>}
            {selectedAccount&&<><span>·</span><span>Account: <strong>{selectedAccount.company}</strong></span></>}
            <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
              <label style={{fontSize:10,color:"#8B6F47",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                <input type="file" accept=".pdf,.docx,.doc,.txt,.md,.pptx,.csv" multiple style={{display:"none"}} onChange={e=>{handleDocFiles(e.target.files);e.target.value="";}}/>
                + Add Docs
              </label>
              {sellerDocs.length>0&&<span style={{fontSize:10,color:"#aaa"}}>{sellerDocs.length} doc{sellerDocs.length>1?"s":""}</span>}
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
                    onBlur={()=>{if(sellerInput.trim()&&!urlScanConfirmed&&urlScanStatus!=="scanning") scanSellerUrl(sellerInput.trim());}}
                  />
                </div>
                <div style={{fontSize:11,color:"#aaa",marginTop:4}}>Claude will research your products and services to map them to each prospect's needs. Stored for the entire session.</div>
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

              <div style={{height:1,background:"#E8E6DF",margin:"20px 0"}}/>
              <button className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center"}}
                onClick={()=>{if(sellerInput.trim()){setSellerUrl(sellerInput.trim());setStep(1);}}}
                disabled={!sellerInput.trim()}>Start Session →</button>
            </div>
          </div>
        )}

        {/* ── STEP 1: IMPORT ── */}
        {step===1&&(
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
                  <button className="btn btn-secondary" onClick={loadSample}>Load Sample Data (25 accounts)</button>
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
        {step===2&&(
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
                            setStep(3);
                          } else {
                            setQueueIdx(0);
                            setSelectedCohort(accountQueue[0]._cohort);
                            setSelectedAccount(accountQueue[0]);
                            setSelectedOutcomes([]);
                            setStep(3);
                          }
                        }}>
                        Continue with {accountQueue.length} account{accountQueue.length>1?"s":""} →
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="tbl-wrap">
                <table className="tbl" style={{fontSize:13}}>
                  <thead>
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
                            {m.publicPrivate?(()=>{
                              const ot=(fitScores[m.company]?.ownershipType)||"";
                              const c=ot==="public"?"#1B3A6B":ot==="pe"?"#6B3A3A":ot==="vc"?"#2E6B2E":"#555";
                              const bg=ot==="public"?"#EEF5F9":ot==="pe"?"#FDE8E8":ot==="vc"?"#EEF5EE":"#F8F6F1";
                              return<span style={{background:bg,color:c,border:"1px solid "+c+"44",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{m.publicPrivate}</span>;
                            })():"—"}
                          </td>
                          <td onClick={e=>e.stopPropagation()}>
                            {fitScores[m.company]?(
                              <div style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,background:fitScores[m.company].bg,color:fitScores[m.company].color,border:"1px solid "+fitScores[m.company].color+"44",display:"inline-block",whiteSpace:"nowrap"}}
                                title={fitScores[m.company].reason}>
                                {fitScores[m.company].score}% · {fitScores[m.company].label}
                              </div>
                            ):fitScoring?<span style={{fontSize:11,color:"#aaa"}}>scoring…</span>:<span style={{fontSize:11,color:"#ccc"}}>—</span>}
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
              <button className="btn btn-secondary" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={()=>{if(selectedCohort){setSelectedOutcomes([]);setSelectedAccount(null);setStep(3);}}} disabled={!selectedCohort}>
                Select Account → {selectedCohort?`(${selectedCohort.name})`:""}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: ACCOUNT + OUTCOMES ── */}
        {step===3&&selectedCohort&&(
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
                  {selectedCohort.name} · {selectedCohort.members.length} accounts
                </div>
                <div className="account-list">
                  {[...selectedCohort.members].sort((a,b)=>{
                    const sa=fitScores[a.company]?.score??50;
                    const sb=fitScores[b.company]?.score??50;
                    return sb-sa;
                  }).map((m,i)=>{
                    const isSelected = selectedAccount===m;
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
              <button className="btn btn-secondary" onClick={()=>setStep(2)}>← Back</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: RIVER BRIEF ── */}
        {step===4&&(
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
                      <button className="btn btn-navy" onClick={doExport}>↓ Export RIVER</button>
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
                          return label&&<span style={{background:lBg,color:lColor,border:"1px solid "+lColor+"44",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{label}</span>;
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
                      {(brief.recentHeadlines||[]).filter(h=>h?.headline||typeof h==="string").map((h,i)=>{
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
                          <div style={{fontSize:11,fontWeight:700,color:"#8B6F47",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>Strategic Interpretation</div>
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
                {brief.publicSentiment&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:11}}>💬</div>
                      <div><div className="bb-title">Public Sentiment</div><div className="bb-sub">BBB · reviews · Reddit / LinkedIn / social</div></div>
                    </div>
                    <div className="bb-body">
                      <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap",alignItems:"flex-start"}}>
                        <div style={{background:"#F8F6F1",border:"1px solid #E8E6DF",borderRadius:8,padding:"12px 16px",textAlign:"center",minWidth:100,flexShrink:0}}>
                          <div className="field-label" style={{marginBottom:6,display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                            <span style={{background:"#1B3A6B",color:"#fff",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>BBB</span>Rating
                          </div>
                          <div style={{fontFamily:"Lora,serif",fontSize:28,fontWeight:600,lineHeight:1,color:
                            !brief.publicSentiment.bbbRating?"#ccc":
                            brief.publicSentiment.bbbRating.startsWith("A")?"#2E6B2E":
                            brief.publicSentiment.bbbRating.startsWith("B")?"#BA7517":"#9B2C2C"}}>
                            {brief.publicSentiment.bbbRating||"—"}
                          </div>
                          {brief.publicSentiment.bbbAccredited!==null&&(
                            <div style={{fontSize:9,marginTop:5,fontWeight:700,color:brief.publicSentiment.bbbAccredited?"#2E6B2E":"#9B2C2C"}}>
                              {brief.publicSentiment.bbbAccredited?"✓ Accredited":"✗ Not Accredited"}
                            </div>
                          )}
                        </div>
                        <div style={{flex:1,minWidth:180}}>
                          <div className="field-label" style={{marginBottom:5}}>Online Sentiment</div>
                          <EF value={brief.publicSentiment.onlineSentiment||""} onChange={v=>patchBrief(b=>{if(!b.publicSentiment)b.publicSentiment={};b.publicSentiment.onlineSentiment=v;})} placeholder="What customers, employees, and communities are saying..."/>
                        </div>
                      </div>
                      {brief.publicSentiment.standoutReview?.text&&(
                        <div style={{marginBottom:12}}>
                          <div className="field-label" style={{marginBottom:6}}>Standout Review</div>
                          {(()=>{const s=brief.publicSentiment.standoutReview;return(
                          <div style={{background:"#FAF8F4",borderLeft:"3px solid #8B6F47",borderRadius:"0 8px 8px 0",padding:"10px 13px"}}>
                            {s.source&&<div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:5,color:"#8B6F47"}}>
                              {s.source}
                            </div>}
                            <div style={{fontSize:13,color:"#333",lineHeight:1.6,fontStyle:"italic"}}>"{s.text}"</div>
                          </div>
                          )})()}
                        </div>
                      )}
                      {brief.publicSentiment.sentimentSummary&&(
                        <div style={{background:"#F8F6F1",borderLeft:"3px solid #8B6F47",padding:"9px 12px",borderRadius:"0 7px 7px 0"}}>
                          <div className="field-label" style={{marginBottom:4}}>Sales Angle</div>
                          <EF value={brief.publicSentiment.sentimentSummary||""} onChange={v=>patchBrief(b=>{if(!b.publicSentiment)b.publicSentiment={};b.publicSentiment.sentimentSummary=v;})} single placeholder="How to reference this in your conversation..."/>
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
                      <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<((brief.solutionMapping||[]).filter(x=>x?.product).length-1)?"1px solid #F0EDE6":"none"}}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                          <div style={{background:"#F0EDE6",color:"#7A5C30",border:"1px solid #D4C4A8",fontFamily:"Lora,serif",fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:6,whiteSpace:"nowrap",flexShrink:0,marginTop:2}}>
                            {item.product}
                          </div>
                          <div style={{flex:1}}>
                            <EF value={item.fit||""} onChange={v=>patchBrief(b=>{b.solutionMapping[i]={...b.solutionMapping[i],fit:v};})} placeholder="Why this fits..."/>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Relevant Case Studies */}
                    {(brief.caseStudies||[]).filter(c=>c?.title).length>0&&(
                      <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #E8E6DF"}}>
                        <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#8B6F47",marginBottom:10}}>Relevant Case Studies & Customers</div>
                        {(brief.caseStudies||[]).filter(c=>c?.title).map((cs,i)=>(
                          <div key={i} style={{display:"flex",gap:10,marginBottom:10,padding:"9px 12px",background:"#FAF8F4",borderRadius:8,border:"1px solid #E8E6DF"}}>
                            <div style={{fontSize:18,lineHeight:1,flexShrink:0}}>📄</div>
                            <div>
                              <div style={{fontSize:14,fontWeight:600,color:"#1a1a18",marginBottom:2}}>{cs.title}</div>
                              {cs.customer&&<div style={{fontSize:12,color:"#8B6F47",fontWeight:600,marginBottom:3}}>{cs.customer}</div>}
                              <div style={{fontSize:13,color:"#555",lineHeight:1.5}}>{cs.relevance}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

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
                  <button className="btn btn-navy" onClick={doExport}>↓ Export RIVER</button>
                  <button className="btn btn-green btn-lg" onClick={()=>{setActiveRiver(0);setRightTab("brief");setStep(6);}}>Start In-Call →</button>
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
        {step===5&&(
          <ErrorBoundary><div className="page">
            <div className="page-title">RIVER Hypothesis — {selectedAccount?.company||"Account"}</div>
            <div className="page-sub">
              {riverHypoLoading
                ? "Building your hypothesis — usually ready before you finish reading the brief..."
                : riverHypo
                  ? "Your pre-call hypothesis is ready. Edit any field before going live."
                  : "Generate your RIVER hypothesis below."}
            </div>

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

                {/* Talk Tracks */}
                {(riverHypo.talkTracks||[]).length>0&&(
                  <div className="bb" style={{marginBottom:10}}>
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:14}}>💬</div>
                      <div><div className="bb-title">Talk Tracks</div><div className="bb-sub">Stage-by-stage language guides</div></div>
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
              <button className="btn btn-secondary" onClick={()=>setStep(4)}>← Back to Brief</button>
              <button className="btn btn-secondary" onClick={()=>buildRiverHypo(brief,selectedAccount)} disabled={riverHypoLoading}>
                ↻ Regenerate
              </button>
              <button className="btn btn-green btn-lg" onClick={()=>{
                if(!riverHypo&&!riverHypoLoading&&brief) buildRiverHypo(brief,selectedAccount);
                setStep(5);
              }}>
                Review Hypothesis →
              </button>
            </div>
          </div></ErrorBoundary>
        )}

        {/* ── STEP 6: IN-CALL NAVIGATOR ── */}
        {step===6&&(
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
              <div style={{height:"100%",width:`${confidence}%`,background:confColor(confidence),borderRadius:2,transition:"width 0.4s"}}/>
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
                            onClick={()=>setExpandedObjs(s=>({...s,[`${si}-${oi}`]:!s[`${si}-${oi}`]}))}>
                            "{o.q}" <span style={{float:"right",color:"#bbb"}}>{expandedObjs[`${si}-${oi}`]?"▲":"▼"}</span>
                          </button>
                          {expandedObjs[`${si}-${oi}`]&&(
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
        {step===7&&(
          <div className="page">
            <div className="page-title">Post-Call Route</div>
            <div className="page-sub">RIVER synthesis for <strong>{selectedAccount?.company}</strong> — deal routing, next steps, CRM note, and follow-up email.</div>
            {postLoading&&(
              <div className="card">
                <div style={{fontSize:13,color:"#777",marginBottom:12}}>Synthesizing RIVER capture and generating deal route...</div>
                <div className="pulse-wrap">{[80,55,90,45,70,60,85].map((w,i)=><div key={i} className="pulse-line" style={{width:`${w}%`,animationDelay:`${i*0.12}s`}}/>)}</div>
              </div>
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
                <div className="post-sec"><div className="post-lbl">Next Steps</div><div className="post-content">{postCall.nextSteps?.map((s,i)=>`${i+1}. ${s}`).join("\n")}</div></div>
                <div className="post-sec"><div className="post-lbl">CRM Note <button className="copy-btn" onClick={()=>copyText(postCall.crmNote,"crm")}>{copied==="crm"?"Copied ✓":"Copy"}</button></div><div className="post-content">{postCall.crmNote}</div></div>
                <div className="post-sec"><div className="post-lbl">Call Summary <button className="copy-btn" onClick={()=>copyText(postCall.callSummary,"summary")}>{copied==="summary"?"Copied ✓":"Copy"}</button></div><div className="post-content">{postCall.callSummary}</div></div>
                <div className="post-sec">
                  <div className="post-lbl">Follow-Up Email <button className="copy-btn" onClick={()=>copyText(`Subject: ${postCall.emailSubject}\n\n${postCall.emailBody}`,"email")}>{copied==="email"?"Copied ✓":"Copy Email"}</button></div>
                  <div className="post-content" style={{fontSize:12}}>
                    <div style={{fontWeight:600,marginBottom:9,color:"#1a1a18"}}>Subject: {postCall.emailSubject}</div>
                    {postCall.emailBody}
                  </div>
                </div>
                <div className="actions-row">
                  <button className="btn btn-secondary" onClick={()=>setStep(6)}>← Back to Call</button>
                  <button className="btn btn-navy" onClick={doExport}>↓ Export Full RIVER</button>
                  <button className="btn btn-gold" onClick={()=>{setPostCall(null);setPostLoading(true);setTimeout(runPostCall,100);}}>Regenerate</button>
                  <button className="btn btn-green btn-lg" onClick={()=>{buildSolutionFit();setStep(8);}}>
                    Solution Fit Review →
                  </button>
                  <button className="btn btn-primary" onClick={()=>{setStep(3);setSelectedAccount(null);setGateAnswers({});setRiverData({});setPostCall(null);setBrief(null);setNotes("");setContactRole("");}}>New Account</button>
                  <button className="btn btn-secondary" onClick={()=>{setStep(1);setCohorts([]);setSelectedCohort(null);setSelectedOutcomes([]);setSelectedAccount(null);setGateAnswers({});setRiverData({});setPostCall(null);setBrief(null);setNotes("");setRows([]);setHeaders([]);setFileName("");}}>New Dataset</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 8: SOLUTION FIT REVIEW ── */}
        {step===8&&(
          <div className="page">
            <div className="page-title">Solution Architecture Review</div>
            <div className="page-sub">Post-call solution fit re-evaluation for <strong>{selectedAccount?.company}</strong> — aligned to what you actually heard, not just what you assumed.</div>

            {solutionFitLoading&&(
              <div className="card">
                <div style={{fontSize:13,color:"#777",marginBottom:12}}>Applying Solution Architecture framework to your discovery capture...</div>
                <div className="pulse-wrap">{[70,90,55,80,65,75,50].map((w,i)=><div key={i} className="pulse-line" style={{width:`${w}%`,animationDelay:`${i*0.12}s`}}/>)}</div>
                <div style={{fontSize:12,color:"#8B6F47",marginTop:12,fontStyle:"italic"}}>
                  Evaluating business alignment, integration complexity, and implementation phasing...
                </div>
              </div>
            )}

            {solutionFit&&!solutionFitLoading&&(
              <>
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
                  <button className="btn btn-secondary" onClick={()=>setStep(7)}>← Post-Call</button>
                  <button className="btn btn-secondary" onClick={()=>{setSolutionFit(null);setSolutionFitLoading(true);setTimeout(buildSolutionFit,100);}}>↻ Regenerate</button>
                  <button className="btn btn-navy" onClick={doExport}>↓ Export RIVER</button>
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
