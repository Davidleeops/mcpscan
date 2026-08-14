#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-actions-unblock-session."));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const result = spawnSync("npm", [
  "run",
  "launch:actions-session",
  "--",
  "--sample",
  "true",
  "--root",
  tempRoot,
  "--no-open"
], {
  cwd: root,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});

if (result.stdout) console.log(result.stdout.trim());
if (result.stderr) console.error(result.stderr.trim());
if (result.status !== 0) fail("GitHub Actions unblock session simulation command failed.");

const sessionDir = path.join(tempRoot, "current");
const requiredFiles = [
  "ACTIONS_RUNS.json",
  "ACTIONS_UNBLOCK_SESSION.md",
  "ACTIONS_UNBLOCK_SESSION.html",
  "NEXT_COMMANDS.md"
];

for (const file of requiredFiles) {
  const full = path.join(sessionDir, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Missing GitHub Actions unblock artifact: ${full}`);
}

const combined = requiredFiles.map((file) => fs.readFileSync(path.join(sessionDir, file), "utf8")).join("\n");
const requiredMarkers = [
  "GitHub Actions Unblock Session",
  "Failed before project steps",
  "npm run launch:rerun-actions -- --dry-run",
  "npm run launch:rerun-actions",
  "GitHub Billing",
  "MCPScan Actions",
  "repo files",
  "This command opens account pages and local proof only. It does not change billing, rerun workflows, commit code, publish, send, charge, or create customer files."
];

const missing = requiredMarkers.filter((marker) => !combined.includes(marker));
if (missing.length > 0) fail(`Missing GitHub Actions unblock marker(s): ${missing.join(", ")}`);

const unsafeMarkers = [
  "card number:",
  "password:",
  "token:"
].filter((marker) => combined.toLowerCase().includes(marker.toLowerCase()));

if (unsafeMarkers.length > 0) fail(`Unsafe GitHub Actions unblock marker(s): ${unsafeMarkers.join(", ")}`);

fs.rmSync(tempRoot, { recursive: true, force: true });

console.log("GitHub Actions unblock session simulation passed.");
