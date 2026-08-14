#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-first-10-send-session."));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const result = spawnSync("npm", ["run", "outbound:first-10-session", "--", "--root", tempRoot, "--no-open"], {
  cwd: root,
  stdio: "inherit"
});
if (result.status !== 0) process.exit(result.status ?? 1);

const workspaceDir = path.join(tempRoot, "current");
const required = [
  "FIRST_10_SEND_SESSION.md",
  "NEXT_COMMANDS.md",
  "first-10-route-approval-packet.md",
  "first-10-named-recipient-approval-packet.md"
];

for (const file of required) {
  const full = path.join(workspaceDir, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Missing first-10 session artifact: ${full}`);
}

const session = fs.readFileSync(path.join(workspaceDir, "FIRST_10_SEND_SESSION.md"), "utf8");
const commands = fs.readFileSync(path.join(workspaceDir, "NEXT_COMMANDS.md"), "utf8");
const requiredMarkers = [
  "I approve staging all 10 exact MCPScan route outbound messages.",
  "I approve staging all 10 exact MCPScan named-recipient outbound messages.",
  "Do not send automatically.",
  "npm run outbound:send-gates",
  "npm run outbound:stage-route-packet",
  "npm run outbound:stage-named-first-10",
  "npm run outbound:log-first-10-batch",
  "npm run revenue:snapshot",
  "This session does not send"
];

const combined = `${session}\n${commands}`;
const missing = requiredMarkers.filter((marker) => !combined.includes(marker));
if (missing.length > 0) fail(`Missing first-10 send session marker(s): ${missing.join(", ")}`);

console.log("");
console.log("First-10 send session simulation passed.");
console.log(workspaceDir);
