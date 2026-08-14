#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const targets = [
  "ops/launch-day-runbook.html",
  "ops/launch-approval-queue.html",
  "ops/domain-mailbox-purchase-packet.html",
  "ops/cheap-launch-packet-console.html",
  "docs/DOMAIN_PURCHASE_SHORTLIST_2026-08-14.md",
  "ops/stripe-click-setup.html",
  "ops/stripe-payment-link-qa-console.html",
  "ops/founder-return-packet.html",
  "ops/founder-status-console.html",
  "ops/swarm-throughput-console.html",
  "ops/verification-console.html",
  "docs/POST_PURCHASE_PUBLIC_PROOF_PACKET.md",
  "sales/daily-revenue-command.md"
];

const externalUrls = [
  "https://www.spaceship.com/domain-search/?query=getmcpscan.com",
  "https://www.spaceship.com/domain-search/?query=getmcpscan.xyz",
  "https://www.spaceship.com/domain-search/?query=mcpscan.online",
  "https://www.spaceship.com/business-email/",
  "https://dashboard.stripe.com/payment-links/create"
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
  const result = spawnSync("npm", ["run", "launch:status:live"], { encoding: "utf8" });
  if (result.stdout) console.log(result.stdout.trim());
  if (result.stderr) console.error(result.stderr.trim());
}

console.log("MCPScan launch day runbook");
console.log("");
console.log("Opening launch day surfaces:");

for (const target of targets) {
  const url = pathToFileURL(path.resolve(target)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${target}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Opening account links:");
for (const url of externalUrls) {
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${url}`);
}

console.log("");
console.log("Current launch status:");
runStatus();

console.log("");
console.log("Launch day order:");
console.log("1. Buy one domain and one mailbox.");
console.log("2. Create three Stripe Payment Links.");
console.log("3. Return only public values through the preset return packet, QA evidence, and status JSON.");
console.log("4. Run post-click verification and publish the Pages fallback after approval.");
console.log("5. Open first revenue runway only after live gates clear.");
console.log("6. Use npm run launch:open-swarm to coordinate the agent lanes after live gates clear.");
