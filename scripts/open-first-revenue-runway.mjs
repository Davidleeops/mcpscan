#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const reviewSurfaces = [
  "docs/FIRST_REVENUE_CHANNEL_PLACEMENT_2026-08-14.md",
  "ops/market-research-refresh-console.html",
  "ops/gtm-placement-console.html",
  "ops/public-channel-drafts-console.html",
  "ops/swarm-throughput-console.html",
  "ops/first-10-outbound-approval-console.html",
  "ops/outbound-approval-queue-console.html",
  "ops/outbound-recipient-approval-builder.html",
  "ops/founder-status-console.html",
  "ops/verification-console.html",
  "ops/customer-comms-console.html",
  "ops/post-payment-console.html",
  "ops/paid-audit-handoff-builder.html",
  "sales/daily-revenue-command.md",
  "sales/first-account-dossier-2026-08-14.md",
  "sales/first-10-recipient-approval-packet-2026-08-14.md",
  "sales/first-10-route-approval-packet-2026-08-14.md",
  "sales/reply-to-close-packet.md",
  "sales/paid-audit-handoff-approval-packet.md",
  "docs/APPROVED_SEND_LOGGING.md",
  "docs/PRIVATE_REVENUE_SNAPSHOT.md",
  "docs/PAYMENT_TO_DELIVERY_SOP.md"
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
  if (result.status !== 0) {
    console.log("");
    console.log("Live status command did not complete cleanly. Continue with the opened consoles and run npm run launch:status locally.");
  }
}

console.log("MCPScan first revenue runway launcher");
console.log("");
console.log("Opening first-revenue approval and delivery surfaces:");

for (const page of reviewSurfaces) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Current launch status:");
runStatus();

console.log("");
console.log("Runway order:");
console.log("1. Confirm domain, mailbox, Stripe links, and security contact are live.");
console.log("2. Open market research with npm run market:open and verify current evidence with npm run market:verify.");
console.log("3. Open the swarm throughput console to split work into agent lanes.");
console.log("4. Approve exact public post or first-10 outbound packet.");
console.log("5. Stage the approved packet outside the public repo. Do not send automatically.");
console.log("6. Run npm run outbound:send-gates before any manual send.");
console.log("7. Log every manual send outside the public repo.");
console.log("8. Use the reply-to-close packet after any prospect reply.");
console.log("9. After payment clears, build payment evidence and paid audit handoff.");
console.log("10. Create the private customer workspace outside the public repo.");
console.log("11. Verify delivery before sending any customer-facing report.");

console.log("");
console.log("Hard rule:");
console.log("This command opens surfaces only. It does not publish, message, send, charge, create customer files, or start delivery without exact approval.");
