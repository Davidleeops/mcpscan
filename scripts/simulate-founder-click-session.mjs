#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-founder-click-session."));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const result = spawnSync("npm", [
  "run",
  "launch:click-session",
  "--",
  "--domain",
  "getmcpscan.xyz",
  "--mail-provider",
  "spacemail",
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
if (result.status !== 0) fail("Founder click session simulation command failed.");

const workspaceDir = path.join(tempRoot, "current");
const requiredFiles = [
  "domain-cart-proof.json",
  "approved-return-packet.txt",
  "stripe-checkout-qa-evidence.json",
  "NEXT_COMMANDS.md",
  "CLICK_SESSION.md",
  "CLICK_SESSION.html"
];

for (const file of requiredFiles) {
  const full = path.join(workspaceDir, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Missing founder click session artifact: ${full}`);
}

const html = fs.readFileSync(path.join(workspaceDir, "CLICK_SESSION.html"), "utf8");
const commands = fs.readFileSync(path.join(workspaceDir, "NEXT_COMMANDS.md"), "utf8");
const sheet = fs.readFileSync(path.join(workspaceDir, "CLICK_SESSION.md"), "utf8");
const combined = `${html}\n${commands}\n${sheet}`;

const requiredMarkers = [
  "Private browser cockpit",
  "Search domain",
  "Open mailbox",
  "Open Stripe links",
  "Local Consoles",
  "Proof Commands",
  "Copy commands",
  "Stop Conditions",
  "domain-cart-proof.json",
  "approved-return-packet.txt",
  "stripe-checkout-qa-evidence.json",
  "npm run launch:verify-cart",
  "npm run launch:post-click-session",
  "npm run launch:open-first-revenue",
  "It does not buy, publish, send, charge, apply public links, or create customer files."
];

const missing = requiredMarkers.filter((marker) => !combined.includes(marker));
if (missing.length > 0) fail(`Missing founder click session marker(s): ${missing.join(", ")}`);

const unsafeMarkers = [
  "Stripe secret key:",
  "card number:",
  "password:"
].filter((marker) => combined.toLowerCase().includes(marker.toLowerCase()));

if (unsafeMarkers.length > 0) fail(`Unsafe founder click session marker(s): ${unsafeMarkers.join(", ")}`);

console.log("Founder click session simulation passed.");
console.log(workspaceDir);
