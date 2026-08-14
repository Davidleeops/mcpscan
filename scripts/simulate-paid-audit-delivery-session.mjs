#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-paid-delivery-session."));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const result = spawnSync("npm", [
  "run",
  "delivery:session",
  "--",
  "--customer",
  "Sample Buyer Co",
  "--package",
  "MCP Launch Audit",
  "--contact",
  "buyer@example.com",
  "--payment",
  "pi_paid_session_12345",
  "--safe-intake",
  path.join(tempRoot, "secure-intake"),
  "--root",
  tempRoot,
  "--date",
  "2026-08-14",
  "--no-open"
], {
  cwd: root,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});

if (result.stdout) console.log(result.stdout.trim());
if (result.stderr) console.error(result.stderr.trim());
if (result.status !== 0) fail("Paid delivery session simulation command failed.");

const sessionDir = path.join(tempRoot, "current");
const requiredFiles = [
  "approved-paid-audit-handoff.txt",
  "payment-confirmation-evidence.json",
  "NEXT_COMMANDS.md",
  "PAID_DELIVERY_SESSION.md",
  "PAID_DELIVERY_SESSION.html"
];

for (const file of requiredFiles) {
  const full = path.join(sessionDir, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Missing paid delivery session artifact: ${full}`);
}

const combined = requiredFiles.map((file) => fs.readFileSync(path.join(sessionDir, file), "utf8")).join("\n");
const requiredMarkers = [
  "Private session for the first paid buyer",
  "Payment reference: pi_paid_session_12345",
  "stripeDashboardPaymentConfirmed",
  "delivery:verify-payment",
  "delivery:handoff",
  "delivery:intake-message",
  "delivery:dry-run",
  "Post-payment console",
  "Paid handoff builder",
  "Payment is only a Payment Link",
  "public MCPScan repo",
  "This session does not charge, message, send, create live customer files, or bypass payment evidence."
];

const missing = requiredMarkers.filter((marker) => !combined.includes(marker));
if (missing.length > 0) fail(`Missing paid delivery session marker(s): ${missing.join(", ")}`);

const unsafeMarkers = [
  "Stripe secret key:",
  "password:",
  "production secret:"
].filter((marker) => combined.toLowerCase().includes(marker.toLowerCase()));

if (unsafeMarkers.length > 0) fail(`Unsafe paid delivery session marker(s): ${unsafeMarkers.join(", ")}`);

fs.rmSync(tempRoot, { recursive: true, force: true });

console.log("Paid delivery session simulation passed.");
