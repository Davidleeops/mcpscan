#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const pages = [
  "ops/post-payment-console.html",
  "ops/paid-audit-handoff-builder.html",
  "sales/paid-audit-handoff-approval-packet.md",
  "docs/PAID_AUDIT_RUNBOOK.md",
  "docs/PAID_AUDIT_START_AUTOMATION.md",
  "docs/PAYMENT_TO_DELIVERY_SOP.md",
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

console.log("MCPScan paid audit handoff launcher");
console.log("");
console.log("Opening delivery review surfaces:");

for (const page of pages) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Approval rule:");
console.log("Run this only after Stripe payment clears and the exact paid audit handoff packet is approved.");
console.log("");
console.log("After approval, create the private workspace and work order outside the public repo with:");
console.log("npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --payment-evidence /path/to/payment-confirmation-evidence.json");
console.log("");
console.log("Then compose or review the draft-only intake message with:");
console.log("npm run delivery:intake-message -- --file /path/outside/public/repo/pipeline-status/YYYY-MM-DD_customer_package_pipeline-status.json");
console.log("");
console.log("Before delivery, verify:");
console.log("npm run delivery:verify");
