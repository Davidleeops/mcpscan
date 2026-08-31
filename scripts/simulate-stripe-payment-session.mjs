#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-stripe-payment-session."));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const result = spawnSync("npm", [
  "run",
  "launch:stripe-session",
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
if (result.status !== 0) fail("Stripe payment session simulation command failed.");

const workspaceDir = path.join(tempRoot, "current");
const requiredFiles = [
  "payment-link-manifest.json",
  "stripe-checkout-qa-evidence.json",
  "approved-return-packet.txt",
  "STRIPE_SETUP_PACKET.md",
  "NEXT_COMMANDS.md",
  "STRIPE_PAYMENT_SESSION.html"
];

for (const file of requiredFiles) {
  const full = path.join(workspaceDir, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Missing Stripe session artifact: ${full}`);
}

const script = fs.readFileSync(path.join(root, "scripts/open-stripe-payment-session.mjs"), "utf8");
const combined = requiredFiles
  .map((file) => fs.readFileSync(path.join(workspaceDir, file), "utf8"))
  .join("\n");

const requiredMarkers = [
  "MCPScan Stripe Payment Session",
  "MCP Quick Audit",
  "MCP Launch Audit",
  "MCP Enterprise Readiness Audit",
  "https://dashboard.stripe.com/payment-links/create",
  "stripe-checkout-qa-evidence.json",
  "payment-link-manifest.json",
  "approved-return-packet.txt",
  "npm run launch:verify-stripe",
  "npm run launch:verify-stripe-qa",
  "npm run launch:verify-return-qa",
  "live https://buy.stripe.com URL",
  "This command opens pages only. It does not create products, publish links, charge buyers, apply public links, send messages, or create customer files.",
  "Refusing to create the Stripe payment session inside the public MCPScan repo.",
  "Refusing to write ${label} inside the public MCPScan repo."
];

const missing = requiredMarkers.filter((marker) => !combined.includes(marker) && !script.includes(marker));
if (missing.length > 0) fail(`Missing Stripe payment session marker(s): ${missing.join(", ")}`);

const unsafeMarkers = [
  "Stripe secret key:",
  "sk_live",
  "sk_test",
  "card number:",
  "password:",
  "recovery code:"
].filter((marker) => combined.toLowerCase().includes(marker.toLowerCase()));

if (unsafeMarkers.length > 0) fail(`Unsafe Stripe session marker(s): ${unsafeMarkers.join(", ")}`);

console.log("Stripe payment session simulation passed.");
console.log(workspaceDir);
