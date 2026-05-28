#!/usr/bin/env node
// scripts/nightly-backup.mjs — Nightly backup of all Supabase tables + knowledge layers
// Run: node scripts/nightly-backup.mjs
// Cron: 0 2 * * * cd /Users/joe/Desktop/cambrian-playbook && node scripts/nightly-backup.mjs
//
// Requires: SUPABASE_SERVICE_KEY env var (NOT the anon key — needs full read access)
// Set it: export SUPABASE_SERVICE_KEY="your-service-role-key"
// Find it: Supabase Dashboard → Settings → API → service_role key

import { writeFileSync, mkdirSync, existsSync, readdirSync, statSync, unlinkSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

const SB_URL = "https://xtnidawfuaxwwwcnkewu.supabase.co";
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const BACKUP_DIR = join(process.cwd(), "backups");
const RETENTION_DAYS = 30;

if (!SB_KEY) {
  console.error("SUPABASE_SERVICE_KEY not set. Get it from Supabase Dashboard → Settings → API → service_role key.");
  console.error("export SUPABASE_SERVICE_KEY='eyJ...'");
  process.exit(1);
}

const stamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const dayDir = join(BACKUP_DIR, stamp);
if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
if (!existsSync(dayDir)) mkdirSync(dayDir, { recursive: true });

// ── Tables to backup (ordered by criticality) ──
const TABLES = [
  // Core user/org data
  { name: "users", query: "users?select=*" },
  { name: "orgs", query: "orgs?select=*" },
  { name: "invitations", query: "invitations?select=*" },
  { name: "sessions", query: "sessions?select=*&order=updated_at.desc&limit=5000" },
  // Intelligence outputs
  { name: "account_outputs", query: "account_outputs?select=*&order=created_at.desc&limit=10000" },
  { name: "rfp_intel_signals", query: "rfp_intel_signals?select=*&order=created_at.desc&limit=10000" },
  // Data science tables
  { name: "prospect_events", query: "prospect_events?select=*&order=created_at.desc&limit=50000" },
  { name: "competitor_intel", query: "competitor_intel?select=*" },
  { name: "kl_effectiveness", query: "kl_effectiveness?select=*&order=created_at.desc&limit=10000" },
  { name: "brief_quality_signals", query: "brief_quality_signals?select=*&order=created_at.desc&limit=10000" },
  { name: "discovery_signals", query: "discovery_signals?select=*&order=created_at.desc&limit=5000" },
  { name: "session_journey", query: "session_journey?select=*&order=created_at.desc&limit=10000" },
  { name: "model_accuracy_log", query: "model_accuracy_log?select=*" },
  { name: "seller_profiles", query: "seller_profiles?select=*" },
  // Usage & billing
  { name: "api_usage_log", query: "api_usage_log?select=*&order=created_at.desc&limit=50000" },
  // Auth-adjacent (HubSpot tokens — encrypted, but backup the records)
  { name: "hubspot_tokens", query: "hubspot_tokens?select=*" },
  // Edit history
  { name: "icp_edit_log", query: "icp_edit_log?select=*&order=created_at.desc&limit=10000" },
];

async function backupTable(table) {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${table.query}`, {
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`  [WARN] ${table.name}: ${res.status} — ${text.slice(0, 100)}`);
      return { name: table.name, rows: 0, error: res.status };
    }
    const data = await res.json();
    const path = join(dayDir, `${table.name}.json`);
    writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`  [OK]   ${table.name}: ${data.length} rows → ${path}`);
    return { name: table.name, rows: data.length, error: null };
  } catch (e) {
    console.error(`  [ERR]  ${table.name}: ${e.message}`);
    return { name: table.name, rows: 0, error: e.message };
  }
}

async function backupKnowledgeLayers() {
  const dataDir = join(process.cwd(), "src", "data");
  const klDir = join(dayDir, "knowledge-layers");
  if (!existsSync(klDir)) mkdirSync(klDir, { recursive: true });
  try {
    execSync(`cp ${dataDir}/*.js "${klDir}/"`);
    const files = readdirSync(klDir).filter(f => f.endsWith(".js"));
    console.log(`  [OK]   knowledge-layers: ${files.length} files copied`);
    return files.length;
  } catch (e) {
    console.warn(`  [WARN] knowledge-layers: ${e.message}`);
    return 0;
  }
}

function backupMigrations() {
  const migDir = join(process.cwd(), "supabase", "migrations");
  const destDir = join(dayDir, "migrations");
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
  try {
    execSync(`cp ${migDir}/*.sql "${destDir}/"`);
    const files = readdirSync(destDir).filter(f => f.endsWith(".sql"));
    console.log(`  [OK]   migrations: ${files.length} SQL files copied`);
    return files.length;
  } catch (e) {
    console.warn(`  [WARN] migrations: ${e.message}`);
    return 0;
  }
}

function backupEnvTemplate() {
  // Save variable NAMES only (not values) for disaster recovery reference
  const envPath = join(process.cwd(), ".env.local");
  try {
    const content = require("fs").readFileSync(envPath, "utf8");
    const names = content.split("\n")
      .filter(l => l.includes("=") && !l.startsWith("#"))
      .map(l => l.split("=")[0].trim() + "=<REDACTED>");
    writeFileSync(join(dayDir, "env-template.txt"), names.join("\n"));
    console.log(`  [OK]   env-template: ${names.length} variables (values redacted)`);
  } catch {
    console.warn("  [WARN] env-template: .env.local not found");
  }
}

function pruneOldBackups() {
  if (!existsSync(BACKUP_DIR)) return;
  const cutoff = Date.now() - RETENTION_DAYS * 86400000;
  const dirs = readdirSync(BACKUP_DIR).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
  let pruned = 0;
  for (const d of dirs) {
    const dirPath = join(BACKUP_DIR, d);
    const stat = statSync(dirPath);
    if (stat.mtimeMs < cutoff) {
      execSync(`rm -rf "${dirPath}"`);
      pruned++;
    }
  }
  if (pruned > 0) console.log(`  [OK]   Pruned ${pruned} backups older than ${RETENTION_DAYS} days`);
}

// ── Main ──
async function main() {
  console.log(`\n=== CAMBRIAN CATALYST NIGHTLY BACKUP ===`);
  console.log(`Date:   ${stamp}`);
  console.log(`Target: ${dayDir}\n`);

  // 1. Database tables
  console.log("--- DATABASE TABLES ---");
  const results = [];
  for (const table of TABLES) {
    results.push(await backupTable(table));
  }

  // 2. Knowledge layers
  console.log("\n--- KNOWLEDGE LAYERS ---");
  const klCount = await backupKnowledgeLayers();

  // 3. Migrations
  console.log("\n--- MIGRATIONS ---");
  const migCount = backupMigrations();

  // 4. Env template
  console.log("\n--- ENV TEMPLATE ---");
  backupEnvTemplate();

  // 5. Prune old backups
  console.log("\n--- RETENTION ---");
  pruneOldBackups();

  // Summary
  const totalRows = results.reduce((sum, r) => sum + r.rows, 0);
  const errors = results.filter(r => r.error);
  console.log(`\n=== BACKUP COMPLETE ===`);
  console.log(`Tables: ${results.length} (${totalRows.toLocaleString()} total rows)`);
  console.log(`KL files: ${klCount}`);
  console.log(`Migrations: ${migCount}`);
  console.log(`Errors: ${errors.length}${errors.length ? " — " + errors.map(e => e.name).join(", ") : ""}`);
  console.log(`Location: ${dayDir}`);

  // Write manifest
  writeFileSync(join(dayDir, "manifest.json"), JSON.stringify({
    timestamp: new Date().toISOString(),
    tables: results,
    knowledgeLayers: klCount,
    migrations: migCount,
    errors: errors.length,
  }, null, 2));
}

main().catch(e => { console.error("Backup failed:", e); process.exit(1); });
