#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const targets = [
  "ops/swarm-throughput-console.html",
  "docs/SWARM_THROUGHPUT_OPERATING_MODEL_2026-08-14.md",
  "ops/launch-day-runbook.html",
  "ops/first-10-outbound-approval-console.html",
  "ops/paid-audit-handoff-builder.html",
  "ops/delivery-console.html"
];

function openerFor(target) {
  if (process.platform === "darwin") return ["open", [target]];
  if (process.platform === "win32") return ["cmd", ["/c", "start", "", target]];
  if (process.platform === "linux") return ["xdg-open", [target]];
  return null;
}

function openTarget(target) {
  const opener = openerFor(target);
  if (!opener) return false;
  const [command, args] = opener;
  const result = spawnSync(command, args, { stdio: "ignore" });
  return !result.error && result.status === 0;
}

function runStatus() {
  const result = spawnSync("npm", ["run", "launch:status"], { encoding: "utf8" });
  if (result.stdout) console.log(result.stdout.trim());
  if (result.stderr) console.error(result.stderr.trim());
}

console.log("MCPScan swarm throughput launcher");
console.log("");
console.log("Opening swarm throughput surfaces:");

for (const target of targets) {
  const url = pathToFileURL(path.resolve(target)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${target}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Current launch status:");
runStatus();

console.log("");
console.log("Swarm order:");
console.log("1. Market pulse keeps claims current.");
console.log("2. Domain and mailbox lane clears public identity.");
console.log("3. Stripe and checkout lane creates verified live payment links.");
console.log("4. Public launch lane applies approved public values.");
console.log("5. Outbound prep lane stages exact approved messages without sending.");
console.log("6. Reply-to-close lane handles inbound replies.");
console.log("7. Paid delivery lane creates the private workspace after payment.");
console.log("8. Quality and safety lane runs npm run launch:full-proof.");

console.log("");
console.log("Hard rule:");
console.log("This command opens surfaces only. It does not publish, send, charge, create customer files, or approve work.");
