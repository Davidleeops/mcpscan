#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-domain-mailbox-session."));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const result = spawnSync("npm", [
  "run",
  "launch:domain-session",
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
if (result.status !== 0) fail("Domain and mailbox session simulation command failed.");

const workspaceDir = path.join(tempRoot, "current");
const requiredFiles = [
  "domain-cart-proof.json",
  "DOMAIN_MAILBOX_APPROVAL.md",
  "NEXT_COMMANDS.md",
  "DOMAIN_MAILBOX_SESSION.html"
];

for (const file of requiredFiles) {
  const full = path.join(workspaceDir, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Missing domain session artifact: ${full}`);
}

const combined = requiredFiles
  .map((file) => fs.readFileSync(path.join(workspaceDir, file), "utf8"))
  .join("\n");

const requiredMarkers = [
  "MCPScan Domain And Mailbox Session",
  "getmcpscan.xyz",
  "security@getmcpscan.xyz",
  "audit@getmcpscan.xyz",
  "hello@getmcpscan.xyz",
  "I approve buying one MCPScan launch domain and one matching mailbox.",
  "npm run launch:verify-cart",
  "npm run launch:click-session",
  "npm run launch:dns-packet",
  "Do not buy extra domains, paid hosting, extra mailboxes, paid SSL add-ons, paid privacy upsells, or site-builder products without separate approval.",
  "This command opens pages only. It does not buy, publish, send, charge, apply DNS, create mailboxes, or approve cart values.",
  "Refusing to create the domain and mailbox session inside the public MCPScan repo.",
  "Refusing to write ${label} inside the public MCPScan repo."
];

const missing = requiredMarkers.filter((marker) => !combined.includes(marker) && !fs.readFileSync(path.join(root, "scripts/open-domain-mailbox-session.mjs"), "utf8").includes(marker));
if (missing.length > 0) fail(`Missing domain session marker(s): ${missing.join(", ")}`);

const unsafeMarkers = [
  "Stripe secret key:",
  "card number:",
  "password:",
  "recovery code:"
].filter((marker) => combined.toLowerCase().includes(marker.toLowerCase()));

if (unsafeMarkers.length > 0) fail(`Unsafe domain session marker(s): ${unsafeMarkers.join(", ")}`);

console.log("Domain and mailbox session simulation passed.");
console.log(workspaceDir);
