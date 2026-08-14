#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-public-launch-session."));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const result = spawnSync("npm", [
  "run",
  "launch:public-session",
  "--",
  "--root",
  tempRoot,
  "--no-open",
  "--date",
  "2026-08-14",
  "--public-url",
  "https://getmcpscan.xyz/"
], {
  cwd: root,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});

if (result.stdout) console.log(result.stdout.trim());
if (result.stderr) console.error(result.stderr.trim());
if (result.status !== 0) fail("Public launch session simulation command failed.");

const sessionDir = path.join(tempRoot, "current");
const requiredFiles = [
  "approved-public-launch-post.txt",
  "NEXT_COMMANDS.md",
  "PUBLIC_LAUNCH_SESSION.md",
  "PUBLIC_LAUNCH_SESSION.html"
];

for (const file of requiredFiles) {
  const full = path.join(sessionDir, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Missing public launch session artifact: ${full}`);
}

const combined = requiredFiles.map((file) => fs.readFileSync(path.join(sessionDir, file), "utf8")).join("\n");
const requiredMarkers = [
  "I approve staging this exact MCPScan public launch post.",
  "Do not publish automatically",
  "npm run market:verify",
  "npm run gtm:verify",
  "npm run launch:stage-public-post",
  "Public drafts console",
  "GTM placement console",
  "LinkedIn",
  "Hacker News submit",
  "Reddit r/mcp",
  "Product Hunt new post",
  "This command opens local proof and public channel pages only. It does not post, publish, submit, comment, message, stage approval, charge, or create customer files."
];

const missing = requiredMarkers.filter((marker) => !combined.includes(marker));
if (missing.length > 0) fail(`Missing public launch session marker(s): ${missing.join(", ")}`);

const forbiddenClaims = [
  "certified compliant",
  "guaranteed secure",
  "full penetration test",
  "we found a vulnerability"
].filter((marker) => combined.toLowerCase().includes(marker));

if (forbiddenClaims.length > 0) fail(`Forbidden public launch claim(s): ${forbiddenClaims.join(", ")}`);

fs.rmSync(tempRoot, { recursive: true, force: true });

console.log("Public launch session simulation passed.");
