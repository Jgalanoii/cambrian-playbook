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
.setup-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 14px; padding: 32px; max-width: 520px; margin: 60px auto 0; }
.setup-logo { font-family: 'Lora', serif; font-size: 22px; color: #1a1a18; margin-bottom: 4px; text-align: center; }
.setup-logo span { color: #8B6F47; }
.setup-url-bar { display: flex; align-items: center; gap: 8px; background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 8px; padding: 4px 12px; margin-bottom: 8px; }
.setup-url-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #aaa; white-space: nowrap; min-width: 80px; }
.setup-url-input { border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1a1a18; outline: none; width: 100%; padding: 6px 0; }
.upload-zone { border: 1.5px dashed #C8C4BB; border-radius: 12px; padding: 40px 24px; text-align: center; cursor: pointer; transition: all 0.2s; background: #fff; }
.upload-zone:hover, .upload-zone.drag { border-color: #8B6F47; background: #FAF8F4; }
.upload-label { font-family: 'Lora', serif; font-size: 15px; color: #1a1a18; margin-bottom: 5px; }
.upload-hint { font-size: 12px; color: #999; margin-bottom: 16px; }
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
.btn-navy { background: #1B3A6B; color: #fff; }
.btn-navy:hover:not(:disabled) { background: #152d54; }
.btn-lg { padding: 12px 22px; font-size: 14px; }
.btn-sm { padding: 5px 11px; font-size: 11px; }
.actions-row { display: flex; gap: 10px; margin-top: 24px; align-items: center; flex-wrap: wrap; }

/* PRODUCT CATALOG */
.prod-entry { display: flex; gap: 10px; padding: 10px 12px; background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 8px; margin-bottom: 7px; align-items: flex-start; }
.prod-num { width: 22px; height: 22px; border-radius: 50%; background: #1a1a18; color: #8B6F47; font-family: 'Lora', serif; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.prod-fields { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.prod-name-input { font-size: 12px; font-weight: 600; padding: 5px 9px; border: 1px solid #E8E6DF; border-radius: 6px; background: #fff; font-family: 'DM Sans', sans-serif; color: #1a1a18; outline: none; }
.prod-name-input:focus { border-color: #8B6F47; }
.prod-desc-input { font-size: 11px; padding: 5px 9px; border: 1px solid #E8E6DF; border-radius: 6px; background: #fff; font-family: 'DM Sans', sans-serif; color: #555; outline: none; resize: vertical; min-height: 48px; }
.prod-desc-input:focus { border-color: #8B6F47; }
.prod-remove { font-size: 11px; color: #ccc; cursor: pointer; background: none; border: none; padding: 2px 4px; line-height: 1; align-self: flex-start; flex-shrink: 0; margin-top: 1px; }
.prod-remove:hover { color: #9B2C2C; }
.prod-chip { display: inline-flex; align-items: center; gap: 5px; background: #F0EDE6; color: #7A5C30; padding: 3px 9px; border-radius: 10px; font-size: 10px; font-weight: 600; margin: 2px; }
.prod-chip-dot { width: 5px; height: 5px; border-radius: 50%; background: #8B6F47; flex-shrink: 0; }

/* COHORT CHARTS & DRILL-DOWN */
.cohort-chart-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.pie-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 16px; }
.pie-title { font-family: 'Lora', serif; font-size: 12px; font-weight: 500; margin-bottom: 10px; color: #1a1a18; }
.pie-wrap { display: flex; align-items: center; gap: 14px; }
.pie-legend { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.pie-legend-item { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #555; }
.pie-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.pie-legend-val { margin-left: auto; font-weight: 700; color: #1a1a18; font-size: 10px; }
.cohort-drill { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.cohort-drill-hdr { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid transparent; transition: border-color 0.15s; }
.cohort-drill-hdr:hover { background: #FAFAF8; }
.cohort-drill-hdr.open { border-bottom-color: #E8E6DF; }
.cohort-drill-left { display: flex; align-items: center; gap: 10px; }
.cohort-drill-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.cohort-drill-name { font-family: 'Lora', serif; font-size: 13px; font-weight: 500; }
.cohort-drill-meta { font-size: 11px; color: #999; margin-top: 1px; }
.cohort-drill-right { display: flex; align-items: center; gap: 12px; }
.cohort-drill-acv { font-family: 'Lora', serif; font-size: 14px; color: #8B6F47; }
.cohort-drill-toggle { font-size: 10px; color: #aaa; font-weight: 700; }
.cohort-drill-body { padding: 0 16px 14px; }
.cohort-member-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
.cohort-member-table th { background: #F5F3EE; padding: 5px 9px; text-align: left; font-weight: 700; font-size: 9px; text-transform: uppercase; letter-spacing: 0.4px; color: #777; white-space: nowrap; }
.cohort-member-table td { padding: 6px 9px; border-top: 1px solid #F0EDE6; color: #333; vertical-align: top; }
.cohort-member-table tr:hover td { background: #FAF8F4; }
.cohort-member-table tr { cursor: pointer; }
.outcome-badge { font-size: 9px; font-weight: 600; padding: 1px 6px; border-radius: 8px; background: #F5EEF5; color: #6B3A7A; white-space: nowrap; }
.card { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 20px; margin-bottom: 14px; }
.card-title { font-family: 'Lora', serif; font-size: 14px; font-weight: 500; margin-bottom: 13px; }
.field-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.field-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.req { color: #8B6F47; }
.field-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
input[type=text], select, textarea { width: 100%; padding: 8px 11px; border: 1px solid #E8E6DF; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1a1a18; background: #FAFAF8; outline: none; transition: border-color 0.15s; resize: vertical; -webkit-appearance: none; }
input[type=text]:focus, select:focus, textarea:focus { border-color: #8B6F47; background: #fff; }
.tbl-wrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: 11px; }
.tbl th { background: #F5F3EE; padding: 6px 10px; text-align: left; font-weight: 600; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; white-space: nowrap; }
.tbl td { padding: 6px 10px; border-top: 1px solid #F0EDE6; color: #333; white-space: nowrap; }
.summary-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
.stat-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 10px; padding: 14px; text-align: center; }
.stat-num { font-family: 'Lora', serif; font-size: 22px; color: #8B6F47; margin-bottom: 2px; }
.stat-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.4px; }
.cohort-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); gap: 11px; margin-bottom: 22px; }
.cohort-card { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 12px; padding: 15px 17px; cursor: pointer; transition: all 0.18s; }
.cohort-card:hover, .cohort-card.selected { border-color: #8B6F47; }
.cohort-card.selected { background: #FAF8F4; }
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
.account-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
.account-item { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 14px; cursor: pointer; transition: all 0.15s; }
.account-item:hover, .account-item.selected { border-color: #8B6F47; background: #FAF8F4; }
.account-name { font-size: 13px; font-weight: 500; color: #1a1a18; }
.account-meta { font-size: 11px; color: #999; margin-top: 2px; }
.account-acv { font-size: 12px; font-weight: 600; color: #8B6F47; }
.outcome-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; }
.outcome-tile { background: #fff; border: 1.5px solid #E8E6DF; border-radius: 9px; padding: 12px; cursor: pointer; transition: all 0.18s; }
.outcome-tile:hover, .outcome-tile.selected { border-color: #8B6F47; }
.outcome-tile.selected { background: #FAF8F4; }
.outcome-icon { font-size: 16px; margin-bottom: 5px; }
.outcome-title { font-size: 11px; font-weight: 600; margin-bottom: 2px; }
.outcome-sub { font-size: 10px; color: #999; line-height: 1.4; }

/* EDITABLE FIELDS */
.ef-wrap { position: relative; }
.ef-wrap:hover .ef-hint { opacity: 1; }
.ef-hint { position: absolute; top: -16px; right: 2px; font-size: 9px; color: #8B6F47; font-weight: 700; opacity: 0; transition: opacity 0.15s; pointer-events: none; text-transform: uppercase; letter-spacing: 0.4px; }
.ef-display { font-size: 12px; color: #333; line-height: 1.65; padding: 6px 8px; border-radius: 6px; border: 1px solid transparent; transition: all 0.15s; min-height: 32px; cursor: text; }
.ef-display:hover { border-color: #E8E6DF; background: #FAFAF8; }
.ef-empty { color: #bbb; font-style: italic; }
.ef-input { font-size: 12px; color: #333; line-height: 1.65; padding: 6px 8px; border-radius: 6px; border: 1.5px solid #8B6F47; background: #fff; width: 100%; font-family: 'DM Sans', sans-serif; outline: none; }
.ef-input-multi { min-height: 60px; resize: vertical; }

/* BRIEF BLOCKS */
.bb { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
.bb-hdr { display: flex; align-items: center; gap: 9px; padding: 11px 16px; background: #F8F6F1; border-bottom: 1px solid #E8E6DF; }
.bb-icon { width: 26px; height: 26px; border-radius: 6px; background: #1a1a18; display: flex; align-items: center; justify-content: center; font-family: 'Lora', serif; font-size: 11px; font-weight: 600; color: #8B6F47; flex-shrink: 0; }
.bb-title { font-family: 'Lora', serif; font-size: 13px; font-weight: 500; }
.bb-sub { font-size: 10px; color: #777; margin-top: 1px; }
.bb-body { padding: 14px 16px; }

.solution-item { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; }
.sol-badge { font-size: 10px; font-weight: 700; background: #1a1a18; color: #8B6F47; padding: 3px 9px; border-radius: 4px; white-space: nowrap; flex-shrink: 0; margin-top: 2px; font-family: 'Lora', serif; }
.signal-row { display: flex; gap: 8px; margin-bottom: 7px; align-items: flex-start; }
.sig-dot { width: 5px; height: 5px; border-radius: 50%; background: #8B6F47; flex-shrink: 0; margin-top: 5px; }
.contact-row { display: flex; gap: 10px; margin-bottom: 8px; background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 12px; align-items: flex-start; }
.contact-av { width: 30px; height: 30px; border-radius: 50%; background: #E8E6DF; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: #666; flex-shrink: 0; }

/* LOADING */
.load-box { background: #fff; border: 1px solid #E8E6DF; border-radius: 12px; padding: 28px; margin-bottom: 14px; }
.load-status { font-size: 12px; color: #8B6F47; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
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
.panel-title { font-family: 'Lora', serif; font-size: 13px; font-weight: 500; }
.panel-body { flex: 1; overflow-y: auto; padding: 16px 18px; }
.river-nav { display: flex; overflow-x: auto; border-bottom: 1px solid #E8E6DF; background: #FAFAF8; flex-shrink: 0; }
.r-tab { padding: 9px 13px; font-size: 10px; font-weight: 700; cursor: pointer; color: #bbb; border-bottom: 2px solid transparent; white-space: nowrap; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 5px; }
.r-tab:hover { color: #1a1a18; }
.r-tab.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #fff; }
.fill-dot { width: 5px; height: 5px; border-radius: 50%; background: #2E6B2E; flex-shrink: 0; }
.gate { background: #FAFAF8; border: 1px solid #E8E6DF; border-radius: 9px; padding: 12px; margin-bottom: 8px; }
.gate.answered { border-color: #2E6B2E; background: #F4FAF4; }
.gate-q { font-size: 12px; font-weight: 500; color: #1a1a18; margin-bottom: 9px; line-height: 1.4; }
.gate-opts { display: flex; flex-direction: column; gap: 5px; }
.gate-opt { display: flex; gap: 9px; align-items: center; padding: 7px 11px; border-radius: 7px; border: 1px solid #E8E6DF; background: #fff; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #333; text-align: left; }
.gate-opt:hover { border-color: #8B6F47; background: #FAF8F4; }
.gate-ans { font-size: 11px; color: #2E6B2E; font-weight: 500; margin-top: 5px; display: flex; align-items: center; gap: 6px; }
.conf-wrap { margin-bottom: 14px; }
.conf-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.conf-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
.conf-score { font-family: 'Lora', serif; font-size: 18px; font-weight: 500; }
.conf-track { height: 5px; background: #E8E6DF; border-radius: 3px; overflow: hidden; }
.conf-fill { height: 100%; border-radius: 3px; transition: width 0.5s, background 0.5s; }
.right-tabs { display: flex; border-bottom: 1px solid #E8E6DF; background: #fff; flex-shrink: 0; }
.rt { padding: 9px 13px; font-size: 10px; font-weight: 700; cursor: pointer; color: #999; border-bottom: 2px solid transparent; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.4px; }
.rt:hover { color: #1a1a18; }
.rt.active { color: #8B6F47; border-bottom-color: #8B6F47; background: #FAFAF8; }
.talk-box { background: #F8F6F1; border-left: 3px solid #8B6F47; border-radius: 0 8px 8px 0; padding: 10px 13px; margin-bottom: 10px; }
.talk-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 4px; }
.talk-txt { font-size: 11px; color: #555; line-height: 1.6; font-style: italic; }
.obj-item { border: 1px solid #E8E6DF; border-radius: 7px; overflow: hidden; background: #fff; margin-bottom: 5px; }
.obj-btn { display: flex; justify-content: space-between; align-items: center; padding: 8px 11px; cursor: pointer; font-size: 11px; font-weight: 500; width: 100%; text-align: left; background: none; border: none; font-family: 'DM Sans', sans-serif; color: #1a1a18; }
.obj-ans { padding: 7px 11px 9px; font-size: 11px; color: #555; line-height: 1.5; font-style: italic; border-top: 1px solid #F0EDE6; }
.hyp-card { background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 10px 12px; margin-bottom: 6px; cursor: pointer; transition: border-color 0.15s; }
.hyp-card:hover { border-color: #8B6F47; }
.hyp-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8B6F47; margin-bottom: 3px; }
.hyp-txt { font-size: 11px; color: #333; line-height: 1.5; }
.post-sec { margin-bottom: 18px; }
.post-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 7px; display: flex; align-items: center; justify-content: space-between; }
.post-content { background: #fff; border: 1px solid #E8E6DF; border-radius: 8px; padding: 13px; font-size: 12px; color: #333; line-height: 1.65; white-space: pre-wrap; }
.copy-btn { font-size: 10px; color: #8B6F47; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; font-weight: 700; padding: 0; }
.copy-btn:hover { text-decoration: underline; }
.route-card { border-radius: 9px; padding: 16px 18px; margin-bottom: 14px; border: 1.5px solid; }
.route-fast { background: #EEF5EE; border-color: #2E6B2E; }
.route-nurture { background: #FEF3E2; border-color: #BA7517; }
.route-disq { background: #FDE8E8; border-color: #9B2C2C; }
.route-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.route-fast .route-lbl { color: #2E6B2E; }
.route-nurture .route-lbl { color: #92540A; }
.route-disq .route-lbl { color: #9B2C2C; }
.route-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; margin-bottom: 5px; }
.route-desc { font-size: 11px; color: #555; line-height: 1.5; }
.notice { background: #F8F6F1; border: 1px solid #E8E6DF; border-radius: 8px; padding: 11px 14px; font-size: 11px; color: #777; line-height: 1.6; margin-bottom: 14px; }
.notice strong { color: #1a1a18; }
.divider { height: 1px; background: #E8E6DF; margin: 16px 0; }
.session-bar { background: #F8F6F1; border-bottom: 1px solid #E8E6DF; padding: 7px 28px; display: flex; align-items: center; gap: 14px; font-size: 11px; color: #777; flex-shrink: 0; flex-wrap: wrap; }
.session-url { color: #8B6F47; font-weight: 500; }
.r-icon { width: 24px; height: 24px; border-radius: 5px; background: #1a1a18; display: flex; align-items: center; justify-content: center; font-family: 'Lora', serif; font-size: 11px; font-weight: 600; color: #8B6F47; flex-shrink: 0; }

/* DOC UPLOAD */
.doc-upload-zone { border: 1.5px dashed #C8C4BB; border-radius: 9px; padding: 18px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s; background: #FAFAF8; flex-wrap: wrap; }
.doc-upload-zone:hover, .doc-upload-zone.drag { border-color: #8B6F47; background: #FAF8F4; }
.doc-upload-icon { width: 32px; height: 32px; border-radius: 8px; background: #F0EDE6; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.doc-upload-text { flex: 1; min-width: 160px; }
.doc-upload-title { font-size: 12px; font-weight: 600; color: #1a1a18; margin-bottom: 2px; }
.doc-upload-hint { font-size: 10px; color: #aaa; }
.doc-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.doc-chip { display: inline-flex; align-items: center; gap: 6px; background: #1a1a18; color: #C8A87A; padding: 4px 10px 4px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; max-width: 200px; }
.doc-chip-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.doc-chip-x { cursor: pointer; color: #777; font-size: 11px; line-height: 1; flex-shrink: 0; }
.doc-chip-x:hover { color: #fff; }
.doc-chip-label { font-size: 9px; background: #333; color: #8B6F47; padding: 1px 5px; border-radius: 10px; white-space: nowrap; }
.session-doc-chip { display: inline-flex; align-items: center; gap: 4px; background: #F0EDE6; color: #7A5C30; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
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
  {company:"Walmart Inc",industry:"Large Employer",acv:"$285,000",lead_source:"Direct Outreach",close_date:"2024-02-14",product:"Employee Rewards Platform",outcome:"reduce turnover across hourly workforce",company_url:"walmart.com"},
  {company:"Target Corporation",industry:"Large Employer",acv:"$195,000",lead_source:"Trade Show",close_date:"2024-03-22",product:"Incentive Engine",outcome:"increase safety and wellness program participation",company_url:"target.com"},
  {company:"Aramark Corporation",industry:"Large Employer",acv:"$210,000",lead_source:"Referral",close_date:"2024-01-18",product:"Employee Rewards Platform",outcome:"drive engagement across distributed hourly workforce",company_url:"aramark.com"},
  {company:"Personify Health",industry:"Health & Wellness SaaS",acv:"$95,000",lead_source:"Referral",close_date:"2024-01-30",product:"Wellness Incentive Engine",outcome:"increase member activation and sustained engagement",company_url:"personifyhealth.com"},
  {company:"Virgin Pulse",industry:"Health & Wellness SaaS",acv:"$120,000",lead_source:"Trade Show",close_date:"2024-03-15",product:"Digital Rewards API",outcome:"power reward fulfillment for employer wellness challenges",company_url:"virginpulse.com"},
  {company:"Rippling",industry:"HR Platform & SaaS",acv:"$225,000",lead_source:"Referral",close_date:"2024-01-12",product:"Employee Rewards Platform",outcome:"embed rewards natively into HR workflow",company_url:"rippling.com"},
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

const BLANK_BRIEF = {
  companySnapshot:"",sellerSnapshot:"",
  revenue:"",publicPrivate:"",employeeCount:"",headquarters:"",founded:"",
  keyExecutives:[],recentHeadlines:[],
  openRoles:{summary:"",roles:[]},
  solutionMapping:[{product:"",fit:""},{product:"",fit:""},{product:"",fit:""}],
  riverHypothesis:{reality:"",impact:"",vision:"",entryPoints:"",route:""},
  openingAngle:"",watchOuts:["","",""],
  keyContacts:[{name:"",title:"",initials:"?",angle:""},{name:"",title:"",initials:"?",angle:""}],
  competitors:[],recentSignals:["","",""],
  fundingProfile:"",strategicTheme:"",growthSignals:[],sellerOpportunity:"",
  publicSentiment:{bbbRating:"",bbbAccredited:null,standoutReview:{text:"",source:"",sentiment:""},onlineSentiment:"",sentimentSummary:""},
};

const RKEYS = ["reality","impact","vision","entryPoints","route"];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function parseACV(v){if(!v)return 0;const n=parseFloat(v.toString().replace(/[$,]/g,"").replace(/k$/i,"000"));return isNaN(n)?0:n;}
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
    const acv=parseACV(get(row,"acv")),band=labelACV(acv),ind=get(row,"industry")||"Other",
      src=get(row,"lead_source")||"Direct",outcome=getOutcomeTheme(row,mapping),
      company=get(row,"company"),product=get(row,"product"),company_url=get(row,"company_url")||"";
    if(!groups[band])groups[band]=[];
    groups[band].push({row,ind,acv,band,src,outcome,company,product,company_url});
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
async function fetchRecentIntel(co, url){
  try{
    const r = await fetch("/api/claude",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-haiku-4-5-20251001",
        max_tokens:2000,
        tools:[{type:"web_search_20250305",name:"web_search",max_uses:3}],
        messages:[{role:"user",content:
          `Search the web for TWO things about "${co}":
1. Most recent news from 2024-2025: any major announcements, acquisitions, leadership changes, product launches, or contracts. Include dates.
2. Current open job postings: search "${co} careers jobs 2025" and list 4-6 specific open role titles and departments.
Be specific and concise.`
        }],
      }),
    });
    const d = await r.json();
    if(d.error){console.warn("fetchRecentIntel error:",d.error.message);return "";}
    return (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim().slice(0,2000);
  }catch(e){console.warn("fetchRecentIntel error:",e.message);return "";}
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
          model:"claude-sonnet-4-20250514",
          max_tokens:5000,
          system:"You are a JSON-only API. You output raw JSON objects only. Never include markdown fences, explanations, or any text outside the JSON object. Start your response with { and end with }.",
          messages:[{role:"user",content:prompt}],
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
      const text=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      console.log("callAI response chars:", text.length, "preview:", text.slice(0,80));
      if(!text) return null;
      // Try 1: direct parse
      try{return JSON.parse(text);}catch{}
      // Try 2: strip markdown fences
      const fence = String.fromCharCode(96,96,96);
      const clean = text.replace(new RegExp("^"+fence+"json\\s*",""),"").replace(new RegExp("^"+fence+"\\s*",""),"").replace(new RegExp(fence+"\\s*$"),"").trim();
      try{return JSON.parse(clean);}catch{}
      // Try 3: find first { to last }
      const first = text.indexOf("{");
      const last  = text.lastIndexOf("}");
      if(first>=0 && last>first){
        try{return JSON.parse(text.slice(first,last+1));}catch(e){
          console.error("JSON parse failed:", e.message, "\nText sample:", text.slice(0,500));
        }
      }
      return null;
    }catch(e){console.error("callAI fetch error:",e);return null;}
  }
  return null;
}

// ── GENERATE BRIEF ────────────────────────────────────────────────────────────
async function generateBrief(member, sellerUrl, sellerDocs, products, selectedCohort, selectedOutcomes, onStatus){
  const co  = member.company;
  const url = member.company_url || co;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ── Phase 1: Single web search for recent news + open roles ──────────────
  onStatus("Searching for recent news & open roles...");
  const recentIntel = await fetchRecentIntel(co, url);
  await sleep(3000);

  const researchBlock = recentIntel
    ? "RECENT NEWS & OPEN ROLES (live web search):\n"+recentIntel
    : "";
  const hasResearch = recentIntel.length > 50;

  // ── Phase 2: Seller and product context ───────────────────────────────────
  const sellerCtx = sellerDocs.length>0
    ? "SELLER DOCS: "+sellerDocs.map(d=>d.label+": "+d.content.slice(0,600)).join(" | ")
    : "Seller: "+sellerUrl;
  const prodCtx = products.filter(p=>p.name.trim()).length>0
    ? "Products available: "+products.filter(p=>p.name.trim()).map(p=>p.name+(p.description?" ("+p.description+")":"")).join("; ")
    : "";

  const schema = JSON.stringify({
    companySnapshot:"4-5 rich sentences: what they do, exact revenue, employee count, public/private, HQ, core customers, one notable recent fact",
    revenue:"Exact figure e.g. $18.8B annual revenue FY2025",
    publicPrivate:"Public (NYSE: ARMK) or Private (PE-backed by X)",
    employeeCount:"e.g. ~270,000 employees globally",
    headquarters:"City, State",
    founded:"Year",
    keyExecutives:[{name:"Full name",title:"CEO",initials:"AB",background:"Prior role or fact",angle:"Why they care about our solution"},{name:"Name",title:"CFO",initials:"CD",background:"Background",angle:"Angle"},{name:"Name",title:"CHRO",initials:"EF",background:"Background",angle:"Angle"}],
    recentHeadlines:[{headline:"Specific headline with month/year",relevance:"Why this matters for the sale"},{headline:"Headline 2",relevance:"Relevance"},{headline:"Headline 3",relevance:"Relevance"}],
    openRoles:{summary:"2-3 sentences on hiring volume and what it signals",roles:[{title:"Job title",dept:"Department",signal:"Strategic meaning"},{title:"Title",dept:"Dept",signal:"Signal"},{title:"Title",dept:"Dept",signal:"Signal"},{title:"Title",dept:"Dept",signal:"Signal"}]},
    publicSentiment:{bbbRating:"A+ or B or NR",bbbAccredited:true,standoutReview:{text:"Specific quote from a real review",source:"Glassdoor or Reddit",sentiment:"positive or negative"},onlineSentiment:"2-3 sentence summary of online themes",sentimentSummary:"One sharp sentence the sales rep can use"},
    sellerSnapshot:"1-2 sentences on most relevant seller offerings",
    fundingProfile:"Ownership, investors, funding history",
    strategicTheme:"2-3 sentences on current direction and pressures",
    sellerOpportunity:"2-3 sentences: exactly why seller is positioned to help NOW",
    solutionMapping:[{product:"Product name",fit:"Why it fits"},{product:"Product",fit:"Why"},{product:"Product",fit:"Why"}],
    riverHypothesis:{reality:"Current state specific to research",impact:"Cost of problem",vision:"What success looks like",entryPoints:"Decision-maker names or likely titles",route:"Fastest path to close"},
    openingAngle:"One sharp question referencing a real finding",
    watchOuts:["Risk 1","Risk 2","Risk 3"],
    keyContacts:[{name:"Name",title:"Title",initials:"AB",angle:"Angle"},{name:"Name",title:"Title",initials:"CD",angle:"Angle"}],
    competitors:["Competitor 1","Competitor 2"],
    growthSignals:["Signal 1","Signal 2","Signal 3"],
    recentSignals:["Top buying signal","Signal 2","Signal 3"],
  });

  const prompt =
    "You are a senior B2B sales strategist with deep knowledge of major companies. Build a complete pre-call brief.\n\n" +
    "PROSPECT: " + co + " | " + member.ind + " | " + url + "\n" +
    "ACV: " + (member.acv>0 ? "$"+member.acv.toLocaleString() : "Unknown") +
    " | Need: " + member.outcome + "\n" +
    (selectedCohort ? "Cohort: "+selectedCohort.name+" | " : "") +
    "Outcomes: " + selectedOutcomes.join(", ") + "\n" +
    sellerCtx + "\n" + (prodCtx ? prodCtx+"\n" : "") +
    "\n== LIVE WEB SEARCH RESULTS ==\n" +
    (hasResearch ? researchBlock.slice(0,3000) : "No live search results.") +
    "\n\n== INSTRUCTIONS ==\n" +
    "You have strong training knowledge about " + co + " — use it confidently for: revenue, employees, executives, HQ, founded, ownership, competitors, BBB rating, strategic direction. " +
    "Use the live web search results above for recent news and open roles. " +
    "Never say not found or unknown — make confident, specific inferences based on what you know. " +
    "Return ONLY the raw JSON object. No markdown, no explanation, start with { end with }:\n\n" +
    schema;

  onStatus("Building RIVER brief...");
  const result = await callAI(prompt);

  if(!result){
    return {
      ...BLANK_BRIEF, _error:"JSON synthesis failed — check console (F12) for details.",
      companySnapshot: recentIntel ? recentIntel.slice(0,600) : co+" — "+member.ind+". Edit fields manually.",
      revenue:"", publicPrivate:"", employeeCount:"", headquarters:"", founded:"",
      keyExecutives:[], recentHeadlines:[], openRoles:{summary:"",roles:[]},
      publicSentiment:{bbbRating:"",bbbAccredited:null,standoutReview:{text:"",source:"",sentiment:""},onlineSentiment:"",sentimentSummary:""},
    };
  }

  return result;
}


// ── EXCEL EXPORT ──────────────────────────────────────────────────────────────

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

function CohortDrillDown({cohort, selected, onSelect, onPickAccount}){
  const [open, setOpen] = useState(selected);
  useEffect(()=>{if(selected)setOpen(true);},[selected]);

  const inds = [...new Set(cohort.members.map(m=>m.ind))];
  const srcs = [...new Set(cohort.members.map(m=>m.src))];
  const indCounts = inds.map(ind=>({label:ind, value:cohort.members.filter(m=>m.ind===ind).length}));
  const srcCounts = srcs.map(src=>({label:src, value:cohort.members.filter(m=>m.src===src).length}));
  const IND_COLORS = ["#4A7A9B","#6B8E6B","#9B6B8E","#7A7A4A","#8B6F47","#4A6B8E","#6B4A6B"];
  const SRC_COLORS = ["#2E6B2E","#8B6F47","#1B3A6B","#6B3A3A","#3A6B6B","#6B6B3A"];

  return(
    <div className={`cohort-drill ${selected?"":""}`}>
      <div className={`cohort-drill-hdr ${open?"open":""}`}
        onClick={()=>{setOpen(o=>!o);onSelect();}}>
        <div className="cohort-drill-left">
          <div className="cohort-drill-dot" style={{background:cohort.color}}/>
          <div>
            <div className="cohort-drill-name">{cohort.name}</div>
            <div className="cohort-drill-meta">{cohort.size} accounts · {cohort.pct}% of base · {cohort.topInd.slice(0,2).join(", ")}</div>
          </div>
        </div>
        <div className="cohort-drill-right">
          <div className="cohort-drill-acv">{cohort.avgACV>0?"$"+(cohort.avgACV/1000).toFixed(0)+"K avg":""}</div>
          <div className="cohort-drill-toggle">{open?"▲ Collapse":"▼ Drill Down"}</div>
        </div>
      </div>

      {open&&(
        <div className="cohort-drill-body">
          {/* Mini charts */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"12px 0"}}>
            <div className="pie-card">
              <div className="pie-title">By Industry</div>
              <div className="pie-wrap">
                <PieChart size={90} data={indCounts.slice(0,7).map((d,i)=>({...d,color:IND_COLORS[i%IND_COLORS.length]}))}/>
                <div className="pie-legend">
                  {indCounts.slice(0,5).map((d,i)=>(
                    <div key={i} className="pie-legend-item">
                      <div className="pie-legend-dot" style={{background:IND_COLORS[i%IND_COLORS.length]}}/>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}>{d.label}</span>
                      <span className="pie-legend-val">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pie-card">
              <div className="pie-title">By Lead Source</div>
              <div className="pie-wrap">
                <PieChart size={90} data={srcCounts.slice(0,6).map((d,i)=>({...d,color:SRC_COLORS[i%SRC_COLORS.length]}))}/>
                <div className="pie-legend">
                  {srcCounts.slice(0,5).map((d,i)=>(
                    <div key={i} className="pie-legend-item">
                      <div className="pie-legend-dot" style={{background:SRC_COLORS[i%SRC_COLORS.length]}}/>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}>{d.label}</span>
                      <span className="pie-legend-val">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ACV distribution bar */}
          <div style={{marginBottom:12}}>
            <div className="field-label" style={{marginBottom:6}}>ACV Distribution</div>
            <div style={{display:"flex",gap:2,height:20,borderRadius:4,overflow:"hidden"}}>
              {cohort.members.filter(m=>m.acv>0).sort((a,b)=>a.acv-b.acv).map((m,i,arr)=>(
                <div key={i} title={`${m.company}: $${m.acv.toLocaleString()}`}
                  style={{flex:1,background:cohort.color,opacity:0.3+0.7*(i/Math.max(arr.length-1,1)),cursor:"pointer"}}
                  onClick={()=>onPickAccount&&onPickAccount(m)}/>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#aaa",marginTop:3}}>
              <span>Min: ${cohort.members.filter(m=>m.acv>0).length?Math.min(...cohort.members.filter(m=>m.acv>0).map(m=>m.acv)).toLocaleString():"—"}</span>
              <span>Avg: ${cohort.avgACV>0?cohort.avgACV.toLocaleString():"—"}</span>
              <span>Max: ${cohort.members.filter(m=>m.acv>0).length?Math.max(...cohort.members.filter(m=>m.acv>0).map(m=>m.acv)).toLocaleString():"—"}</span>
            </div>
          </div>

          {/* Account table */}
          <table className="cohort-member-table">
            <thead>
              <tr>
                <th>Company</th><th>Industry</th><th>ACV</th><th>Lead Source</th><th>Outcome</th><th></th>
              </tr>
            </thead>
            <tbody>
              {cohort.members.sort((a,b)=>b.acv-a.acv).map((m,i)=>(
                <tr key={i} onClick={()=>onPickAccount&&onPickAccount(m)}>
                  <td style={{fontWeight:600,color:"#1a1a18"}}>{m.company}</td>
                  <td>{m.ind}</td>
                  <td style={{color:"#8B6F47",fontWeight:600,whiteSpace:"nowrap"}}>{m.acv>0?"$"+m.acv.toLocaleString():"—"}</td>
                  <td>{m.src}</td>
                  <td><span className="outcome-badge">{m.outcome.slice(0,40)}{m.outcome.length>40?"...":""}</span></td>
                  <td style={{textAlign:"right"}}><span style={{fontSize:10,color:"#8B6F47",fontWeight:600}}>Research →</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

export default function App(){
  const[step,setStep]=useState(0);
  const[sellerUrl,setSellerUrl]=useState("");
  const[sellerInput,setSellerInput]=useState("");
  const[rows,setRows]=useState([]);
  const[headers,setHeaders]=useState([]);
  const[mapping,setMapping]=useState({company:"",industry:"",acv:"",lead_source:"",close_date:"",product:"",outcome:"",company_url:""});
  const[fileName,setFileName]=useState("");
  const[drag,setDrag]=useState(false);
  const[cohorts,setCohorts]=useState([]);
  const[selectedCohort,setSelectedCohort]=useState(null);
  const[selectedOutcomes,setSelectedOutcomes]=useState([]);
  const[selectedAccount,setSelectedAccount]=useState(null);

  // Brief state — always an object or null; never undefined
  const[brief,setBrief]=useState(null);
  const[briefLoading,setBriefLoading]=useState(false);
  const[briefStatus,setBriefStatus]=useState("");
  const[briefError,setBriefError]=useState("");
  const[contactRole,setContactRole]=useState("");

  const[activeRiver,setActiveRiver]=useState(0);
  const[gateAnswers,setGateAnswers]=useState({});
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
    });
    setMapping(am);
  };

  const loadSample=()=>{
    const hdrs=Object.keys(SAMPLE_ROWS[0]);
    setHeaders(hdrs);setRows(SAMPLE_ROWS);setFileName("sample_crm_export.csv");
    const m={};hdrs.forEach(h=>m[h]=h);setMapping(m);
  };
  const onFile=file=>{if(!file)return;setFileName(file.name);const r=new FileReader();r.onload=e=>parseCSV(e.target.result);r.readAsText(file);};
  const handleDrop=useCallback(e=>{e.preventDefault();setDrag(false);onFile(e.dataTransfer.files[0]);},[]);
  const goToCohorts=()=>{const b=buildCohorts(rows,mapping);setCohorts(b);setSelectedCohort(b[0]||null);setStep(2);};
  const goToOutcomes=()=>{if(selectedCohort){setSelectedOutcomes(selectedCohort.topOut.slice(0,2));setStep(3);}};

  const pickAccount=async member=>{
    setSelectedAccount(member);
    setBrief(null);
    setBriefLoading(true);
    setBriefError("");
    setBriefStatus("Researching "+member.company+"...");
    setGateAnswers({});setRiverData({});setNotes("");setPostCall(null);setContactRole("");
    setStep(5);

    const result = await generateBrief(
      member, sellerUrl, sellerDocs, products,
      selectedCohort, selectedOutcomes,
      (msg)=>setBriefStatus(msg)
    );

    if(result._error) setBriefError(result._error);
    setBrief(result);
    setBriefLoading(false);
    setBriefStatus("");
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

  const STEPS=["Session","Import","Cohorts","Outcomes","Account","Brief","In-Call","Post-Call"];
  const routeClass=postCall?.dealRoute==="FAST_TRACK"?"route-fast":postCall?.dealRoute==="NURTURE"?"route-nurture":"route-disq";
  const routeLabel=postCall?.dealRoute==="FAST_TRACK"?"Fast Track →":postCall?.dealRoute==="NURTURE"?"Nurture":"Disqualify";

  return(
    <>
      <style>{FONTS}{css}</style>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="logo">Cambrian <span>Catalyst</span></div>
          <div className="stepper">
            {STEPS.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center"}}>
                {i>0&&<div className="step-div"/>}
                <div className={`step-item ${step===i?"active":step>i?"done":""}`} onClick={()=>{if(step>i&&i>0)setStep(i);}}>
                  <div className="step-num">{step>i?"✓":i+1}</div>{s}
                </div>
              </div>
            ))}
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
            <div className="setup-card" style={{maxWidth:560}}>
              <div className="setup-logo">Cambrian <span>Catalyst</span></div>
              <div style={{fontFamily:"Lora,serif",fontSize:13,color:"#999",textAlign:"center",marginBottom:24,fontStyle:"italic"}}>Revenue Playbook Engine · RIVER Framework</div>

              {/* Seller URL */}
              <div className="field-row">
                <div className="field-label">Your Organization's Website <span className="req">*</span></div>
                <div className="setup-url-bar">
                  <div className="setup-url-label">Seller URL</div>
                  <input className="setup-url-input" type="text" placeholder="e.g. yourcompany.com"
                    value={sellerInput} onChange={e=>setSellerInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"&&sellerInput.trim()&&!sellerDocs.length){setSellerUrl(sellerInput.trim());setStep(1);}}}/>
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
            <div className="page-title">Import Customer Data</div>
            <div className="page-sub">Upload a CRM export CSV. Include a <strong>company_url</strong> column for best research results.</div>
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
              <button className="btn btn-secondary" onClick={loadSample}>Load Sample Data (10 accounts)</button>
            </div>
            {rows.length>0&&(
              <>
                <div className="card">
                  <div className="card-title">Map Your Fields</div>
                  <div className="field-grid-2">
                    {[{key:"company",label:"Company / Account",req:true},{key:"industry",label:"Industry / Vertical",req:true},{key:"acv",label:"Deal Size / ACV",req:true},{key:"lead_source",label:"Lead Source",req:true},{key:"company_url",label:"Company Website URL"},{key:"close_date",label:"Close Date"},{key:"product",label:"Product / Solution"},{key:"outcome",label:"Customer Outcome"},].map(f=>(
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
            <div className="page-sub">{rows.length} accounts segmented into {cohorts.length} cohorts by deal size, industry, and lead source. Click any cohort to drill down — or click an account to start research.</div>

            {/* Summary stats */}
            <div className="summary-grid">
              <div className="stat-card"><div className="stat-num">{rows.length}</div><div className="stat-label">Accounts</div></div>
              <div className="stat-card"><div className="stat-num">{cohorts.length}</div><div className="stat-label">Cohorts</div></div>
              <div className="stat-card"><div className="stat-num">${Math.round(rows.reduce((s,r)=>s+parseACV(mapping.acv?r[mapping.acv]:"0"),0)/1000)}K</div><div className="stat-label">Total ACV</div></div>
            </div>

            {/* Overall pie charts */}
            <div className="cohort-chart-wrap">
              <div className="pie-card">
                <div className="pie-title">ACV by Cohort</div>
                <div className="pie-wrap">
                  <PieChart size={100} data={cohorts.map(c=>({label:c.name,value:c.avgACV*c.size,color:c.color}))}/>
                  <div className="pie-legend">
                    {cohorts.map((c,i)=>(
                      <div key={i} className="pie-legend-item">
                        <div className="pie-legend-dot" style={{background:c.color}}/>
                        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:110}}>{c.name}</span>
                        <span className="pie-legend-val">{c.avgACV>0?"$"+(c.avgACV/1000).toFixed(0)+"K":""}</span>
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
              />
            ))}

            <div className="actions-row">
              <button className="btn btn-secondary" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={goToOutcomes} disabled={!selectedCohort}>
                Map Outcomes → {selectedCohort?`(${selectedCohort.name})`:""}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: OUTCOMES ── */}
        {step===3&&selectedCohort&&(
          <div className="page">
            <div className="page-title">Outcome Mapping</div>
            <div className="page-sub">Select desired outcomes for <strong>{selectedCohort.name}</strong>. These inform RIVER talk tracks and solution mapping.</div>
            <div className="notice"><strong>Industry-agnostic · Revenue-focused.</strong> We drive big outcomes — growth, retention, efficiency, and transformation — regardless of vertical. Select the outcomes most relevant to this cohort to sharpen talk tracks and solution mapping.</div>
            <div className="outcome-grid">
              {OUTCOMES.map(o=>(
                <div key={o.id} className={`outcome-tile ${selectedOutcomes.includes(o.title)?"selected":""}`}
                  onClick={()=>setSelectedOutcomes(p=>p.includes(o.title)?p.filter(x=>x!==o.title):[...p,o.title])}>
                  <div className="outcome-icon">{o.icon}</div><div className="outcome-title">{o.title}</div><div className="outcome-sub">{o.sub}</div>
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
            <div className="page-sub">Click an account to begin. Claude will automatically research and generate your RIVER brief — no form to fill out.</div>
            <div className="notice"><strong>Auto-research on click:</strong> Claude searches both your org's site and the prospect's site, maps your products to their needs, and builds the RIVER hypothesis. Typically takes 15–25 seconds.</div>
            <div className="account-list">
              {selectedCohort.members.map((m,i)=>(
                <div key={i} className={`account-item ${selectedAccount===m?"selected":""}`} onClick={()=>pickAccount(m)}>
                  <div>
                    <div className="account-name">{m.company}</div>
                    <div className="account-meta">{m.ind} · {m.src} · {m.outcome}</div>
                    {m.company_url&&<div style={{fontSize:10,color:"#aaa",marginTop:1}}>{m.company_url}</div>}
                  </div>
                  <div className="account-acv">{m.acv>0?"$"+m.acv.toLocaleString():"—"}</div>
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
            <div className="page-title">RIVER Brief{selectedAccount?` — ${selectedAccount.company}`:""}</div>
            <div className="page-sub">
              {briefLoading?"Searching the web for live company intelligence...":"All fields are editable — click any text to refine before your call."}
            </div>

            {/* Loading — research progress */}
            {briefLoading&&(
              <div className="load-box">
                <div className="load-status">
                  <div className="load-spin"/>
                  {briefStatus||"Starting research..."}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                  {[
                    "Searching for recent news & open roles...",
                    "Building company profile from training knowledge...",
                    "Mapping solutions and RIVER hypothesis...",
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#8B6F47",flexShrink:0,animation:`blink ${1.2+i*0.2}s ease-in-out infinite`,animationDelay:`${i*0.3}s`}}/>
                      <div style={{fontSize:11,color:"#555"}}>{r}</div>
                    </div>
                  ))}
                </div>
                <div style={{height:3,background:"#F0EDE6",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#8B6F47,#1B3A6B,#2E6B2E,#8B6F47)",backgroundSize:"300% 100%",animation:"shimmer 2.5s linear infinite",borderRadius:2}}/>
                </div>
                <div style={{fontSize:11,color:"#aaa",textAlign:"center",marginTop:10}}>
                  Searching {selectedAccount?.company}... (20–40 seconds)
                </div>
              </div>
            )}

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
                      <button className="btn btn-green btn-lg" onClick={()=>{setActiveRiver(0);setRightTab("brief");setStep(6);}}>Start In-Call →</button>
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
                  </div>
                </div>

                {/* Key Executives */}
                {(brief.keyExecutives||[]).filter(e=>e?.name).length>0&&(
                  <div className="bb">
                    <div className="bb-hdr">
                      <div className="bb-icon" style={{fontSize:10}}>👤</div>
                      <div><div className="bb-title">Key Executives</div><div className="bb-sub">Click angles to edit</div></div>
                    </div>
                    <div className="bb-body" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                      {(brief.keyExecutives||[]).filter(e=>e?.name).map((ex,i)=>(
                        <div key={i} className="contact-row" style={{margin:0}}>
                          <div className="contact-av" style={{background:"#1a1a18",color:"#8B6F47",fontFamily:"Lora,serif",fontWeight:700,fontSize:11}}>{ex.initials||ex.name?.split(" ").map(w=>w[0]).join("").slice(0,2)||"?"}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:12,fontWeight:600,color:"#1a1a18"}}>{ex.name}</div>
                            <div style={{fontSize:10,color:"#777",marginBottom:3}}>{ex.title}</div>
                            <EF value={ex.angle||""} onChange={v=>patchBrief(b=>{if(!b.keyExecutives)b.keyExecutives=[];b.keyExecutives[i]={...b.keyExecutives[i],angle:v};})} single placeholder="Engagement angle..."/>
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
                                <div style={{fontSize:12,fontWeight:500,color:"#1a1a18",marginBottom:relevance?3:0}}>{headline}</div>
                                {relevance&&<div style={{fontSize:10,color:"#8B6F47",fontStyle:"italic"}}>{relevance}</div>}
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
                      <div><div className="bb-title">Open Positions</div><div className="bb-sub">Current hiring signals strategic priorities</div></div>
                    </div>
                    <div className="bb-body">
                      {brief.openRoles.summary&&(
                        <div style={{background:"#F8F6F1",border:"1px solid #E8E6DF",borderRadius:8,padding:"10px 12px",marginBottom:12}}>
                          <EF value={brief.openRoles.summary||""} onChange={v=>patchBrief(b=>{if(!b.openRoles)b.openRoles={};b.openRoles.summary=v;})}/>
                        </div>
                      )}
                      {(brief.openRoles.roles||[]).filter(r=>r?.title).length>0&&(
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {(brief.openRoles.roles||[]).filter(r=>r?.title).map((role,i)=>(
                            <div key={i} style={{display:"flex",gap:10,padding:"8px 10px",background:"#FAFAF8",border:"1px solid #E8E6DF",borderRadius:7,alignItems:"flex-start"}}>
                              <div style={{background:"#1a1a18",color:"#8B6F47",borderRadius:4,padding:"2px 7px",fontSize:9,fontWeight:700,whiteSpace:"nowrap",marginTop:2,flexShrink:0}}>{role.dept||"Open"}</div>
                              <div style={{flex:1}}>
                                <div style={{fontSize:12,fontWeight:600,color:"#1a1a18",marginBottom:2}}>{role.title}</div>
                                {role.signal&&<div style={{fontSize:11,color:"#8B6F47",fontStyle:"italic"}}>{role.signal}</div>}
                              </div>
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
                          <div style={{background:brief.publicSentiment.standoutReview.sentiment==="positive"?"#EEF5EE":"#FDE8E8",borderLeft:"3px solid "+(brief.publicSentiment.standoutReview.sentiment==="positive"?"#2E6B2E":"#9B2C2C"),borderRadius:"0 8px 8px 0",padding:"10px 13px"}}>
                            <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:5,color:brief.publicSentiment.standoutReview.sentiment==="positive"?"#2E6B2E":"#9B2C2C"}}>
                              {brief.publicSentiment.standoutReview.sentiment==="positive"?"👍 Positive":"👎 Negative"}{brief.publicSentiment.standoutReview.source?" · "+brief.publicSentiment.standoutReview.source:""}
                            </div>
                            <div style={{fontSize:12,color:"#333",lineHeight:1.6,fontStyle:"italic"}}>"{brief.publicSentiment.standoutReview.text}"</div>
                          </div>
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
                          <div className="contact-av" style={{background:"#1a1a18",color:"#8B6F47",fontSize:11,fontWeight:700}}>{l.initials||"?"}</div>
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
                    {(brief.solutionMapping||[]).map((item,i)=>(
                      item&&<div key={i} className="solution-item">
                        <div className="sol-badge">{item.product||"Product"}</div>
                        <div style={{flex:1}}>
                          <EF value={item.fit||""} onChange={v=>patchBrief(b=>{b.solutionMapping[i]={...b.solutionMapping[i],fit:v};})}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIVER Hypothesis — key fix: direct field access, no dot-path */}
                <div className="bb">
                  <div className="bb-hdr">
                    <div className="bb-icon" style={{fontSize:8,letterSpacing:0}}>RVIR</div>
                    <div><div className="bb-title">RIVER Hypothesis</div><div className="bb-sub">Pre-call — click any stage to edit</div></div>
                  </div>
                  <div className="bb-body">
                    {RIVER_STAGES.map((stage,i)=>{
                      const fk=RKEYS[i]; // "reality" | "impact" | "vision" | "entryPoints" | "route"
                      const val=(brief.riverHypothesis||{})[fk]||"";
                      return(
                        <div key={fk} style={{marginBottom:14}}>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                            <div className="r-icon">{stage.letter}</div>
                            <span style={{fontSize:11,fontFamily:"Lora,serif",fontWeight:500}}>{stage.label}</span>
                            <span style={{fontSize:10,color:"#aaa",marginLeft:2}}>— {stage.sub}</span>
                          </div>
                          <EF
                            value={val}
                            placeholder={`Add ${stage.label} hypothesis...`}
                            onChange={v=>patchBrief(b=>{
                              if(!b.riverHypothesis)b.riverHypothesis={};
                              b.riverHypothesis[fk]=v;
                            })}
                          />
                        </div>
                      );
                    })}
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

                {/* Contacts + Watch-outs */}
                <div className="field-grid-2" style={{gap:12,marginBottom:14}}>
                  <div className="bb" style={{margin:0}}>
                    <div className="bb-hdr"><div className="bb-title" style={{fontSize:12}}>Key Contacts</div></div>
                    <div className="bb-body">
                      {(brief.keyContacts||[]).map((c,i)=>(
                        <div key={i} className="contact-row">
                          <div className="contact-av">{c.initials||"?"}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,fontWeight:600}}>{c.name||"Unknown"}</div>
                            <div style={{fontSize:11,color:"#777"}}>{c.title||""}</div>
                            <EF value={c.angle||""} onChange={v=>patchBrief(b=>{b.keyContacts[i]={...b.keyContacts[i],angle:v};})} single/>
                          </div>
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

        {/* ── STEP 6: IN-CALL NAVIGATOR ── */}
        {step===6&&(
          <div className="call-layout">
            <div className="call-left">
              <div className="panel-hdr">
                <div>
                  <div className="panel-title">{selectedAccount?.company} · RIVER Navigator</div>
                  <div style={{fontSize:10,color:"#999",marginTop:2}}>{contactRole||selectedAccount?.ind} · {selectedCohort?.name}</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={()=>setStep(5)}>← Brief</button>
              </div>
              <div className="river-nav">
                {RIVER_STAGES.map((s,i)=>(
                  <button key={s.id} className={`r-tab ${activeRiver===i?"active":""}`} onClick={()=>setActiveRiver(i)}>
                    {isFilled(s)&&<div className="fill-dot"/>}{s.letter} — {s.label}
                  </button>
                ))}
              </div>
              <div className="panel-body">
                <div className="conf-wrap">
                  <div className="conf-row">
                    <div className="conf-label">Deal Confidence</div>
                    <div className="conf-score" style={{color:confColor(confidence)}}>{confidence}%</div>
                  </div>
                  <div className="conf-track"><div className="conf-fill" style={{width:`${confidence}%`,background:confColor(confidence)}}/></div>
                </div>

                {RIVER_STAGES.map((stage,si)=>si===activeRiver&&(
                  <div key={stage.id}>
                    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:12}}>
                      <div className="r-icon">{stage.letter}</div>
                      <div>
                        <div style={{fontFamily:"Lora,serif",fontSize:14,fontWeight:500}}>{stage.label}</div>
                        <div style={{fontSize:11,color:"#777"}}>{stage.sub}</div>
                      </div>
                    </div>

                    {stage.gates.map(gate=>(
                      <div key={gate.id} className={`gate ${gateAnswers[gate.id]?"answered":""}`}>
                        <div className="gate-q">{gate.q}</div>
                        {!gateAnswers[gate.id]?(
                          <div className="gate-opts">
                            {gate.options.map((opt,oi)=>(
                              <button key={oi} className="gate-opt" onClick={()=>setGateAnswers(a=>({...a,[gate.id]:opt}))}>
                                <span style={{fontSize:9,color:"#aaa",minWidth:12}}>{String.fromCharCode(65+oi)}</span>{opt}
                              </button>
                            ))}
                          </div>
                        ):(
                          <div className="gate-ans">
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
                          <div style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:4,fontStyle:"italic"}}>{prompt.label}</div>
                          <textarea rows={2} placeholder="Capture what you're hearing..." value={riverData[prompt.id]||""} onChange={e=>setRiverData(d=>({...d,[prompt.id]:e.target.value}))}/>
                          <div style={{fontSize:10,color:"#aaa",marginTop:3}}>{prompt.hint}</div>
                        </div>
                      ))}
                    </div>

                    <div className="talk-box" style={{marginTop:12}}>
                      <div className="talk-lbl">Talk Track</div>
                      <div className="talk-txt">{stage.talkTrack}</div>
                    </div>

                    <div style={{marginTop:10}}>
                      <div className="field-label" style={{marginBottom:7}}>Objection Handling</div>
                      {stage.objections.map((o,oi)=>(
                        <div key={oi} className="obj-item">
                          <button className="obj-btn" onClick={()=>setExpandedObjs(s=>({...s,[`${si}-${oi}`]:!s[`${si}-${oi}`]}))}>
                            "{o.q}" <span style={{color:"#aaa"}}>{expandedObjs[`${si}-${oi}`]?"−":"+"}</span>
                          </button>
                          {expandedObjs[`${si}-${oi}`]&&<div className="obj-ans">{o.a}</div>}
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
                  <button key={id} className={`rt ${rightTab===id?"active":""}`} onClick={()=>setRightTab(id)}>{label}</button>
                ))}
              </div>
              <div className="panel-body">
                {rightTab==="brief"&&brief&&(
                  <>
                    <div className="talk-box" style={{marginBottom:14}}>
                      <div className="talk-lbl">Opening Angle</div>
                      <div className="talk-txt">{brief.openingAngle||"—"}</div>
                    </div>
                    <div className="field-label" style={{marginBottom:8}}>RIVER Hypothesis</div>
                    {RIVER_STAGES.map((stage,i)=>(
                      <div key={i} className="hyp-card" style={{borderColor:activeRiver===i?"#8B6F47":"#E8E6DF"}} onClick={()=>setActiveRiver(i)}>
                        <div className="hyp-lbl">{stage.letter} — {stage.label} {isFilled(stage)?"✓":""}</div>
                        <div className="hyp-txt">{(brief.riverHypothesis||{})[RKEYS[i]]||"—"}</div>
                        {riverData[stage.discovery[0]?.id]&&(
                          <div style={{marginTop:5,fontSize:10,color:"#2E6B2E",borderTop:"1px solid #E8E6DF",paddingTop:4}}>
                            Captured: "{riverData[stage.discovery[0].id].slice(0,70)}{riverData[stage.discovery[0].id].length>70?"...":""}"
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {rightTab==="solutions"&&brief&&(
                  <>
                    <div className="field-label" style={{marginBottom:10}}>Solution Mapping</div>
                    <div style={{background:"#F8F6F1",border:"1px solid #E8E6DF",borderRadius:10,padding:14,marginBottom:12}}>
                      <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#8B6F47",marginBottom:10}}>Recommended for {selectedAccount?.company}</div>
                      {(brief.solutionMapping||[]).filter(item=>item?.product).map((item,i)=>(
                        <div key={i} className="solution-item">
                          <div className="sol-badge">{item.product}</div>
                          <div style={{fontSize:11,color:"#444",lineHeight:1.5}}>{item.fit}</div>
                        </div>
                      ))}
                    </div>
                    <div className="field-label" style={{marginBottom:8}}>Key Contacts</div>
                    {(brief.keyContacts||[]).map((c,i)=>(
                      <div key={i} className="contact-row">
                        <div className="contact-av">{c.initials||"?"}</div>
                        <div><div style={{fontSize:12,fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:"#777"}}>{c.title}</div><div style={{fontSize:11,color:"#8B6F47",fontStyle:"italic",marginTop:2}}>{c.angle}</div></div>
                      </div>
                    ))}
                    <div className="field-label" style={{margin:"14px 0 8px"}}>Watch-Outs</div>
                    {(brief.watchOuts||[]).filter(Boolean).map((w,i)=>(
                      <div key={i} className="signal-row" style={{marginBottom:7}}>
                        <div className="sig-dot" style={{background:"#9B2C2C"}}/>
                        <div style={{fontSize:11,color:"#555",lineHeight:1.5}}>{w}</div>
                      </div>
                    ))}
                  </>
                )}
                {rightTab==="notes"&&(
                  <>
                    <div className="field-label" style={{marginBottom:8}}>Call Notes</div>
                    <textarea style={{width:"100%",minHeight:240,padding:10,border:"1px solid #E8E6DF",borderRadius:7,fontSize:12,fontFamily:"DM Sans",background:"#fff",resize:"vertical"}}
                      placeholder="Free-form notes... Tab inserts timestamp" value={notes} onChange={e=>setNotes(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Tab"){e.preventDefault();const ts=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});const el=e.target;const b=el.value.slice(0,el.selectionStart);const a=el.value.slice(el.selectionStart);el.value=b+`\n[${ts}] `+a;setNotes(el.value);}}}/>
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
                  <button className="btn btn-primary" onClick={()=>{setStep(4);setSelectedAccount(null);setGateAnswers({});setRiverData({});setPostCall(null);setBrief(null);setNotes("");setContactRole("");}}>New Account</button>
                  <button className="btn btn-secondary" onClick={()=>{setStep(1);setCohorts([]);setSelectedCohort(null);setSelectedOutcomes([]);setSelectedAccount(null);setGateAnswers({});setRiverData({});setPostCall(null);setBrief(null);setNotes("");setRows([]);setHeaders([]);setFileName("");}}>New Dataset</button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </>
  );
}