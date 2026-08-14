#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      values[key] = "true";
    } else {
      values[key] = next;
      index += 1;
    }
  }
  return values;
}

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

const liveGateRepairSurfaces = [
  "ops/founder-status-console.html",
  "ops/verification-console.html",
  "ops/domain-mailbox-purchase-packet.html",
  "ops/domain-email-dns-console.html",
  "ops/stripe-click-setup.html",
  "ops/stripe-payment-link-qa-console.html",
  "ops/founder-return-packet.html",
  "docs/POST_PURCHASE_PUBLIC_PROOF_PACKET.md",
  "docs/PUBLIC_TRUST_CHECKLIST.md"
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

function runLiveSendGates(args) {
  const gateArgs = [];
  if (args["status-file"]) gateArgs.push("--status-file", args["status-file"]);
  if (args["cart-file"]) gateArgs.push("--cart-file", args["cart-file"]);
  if (args["return-file"]) gateArgs.push("--return-file", args["return-file"]);
  if (args["qa-file"]) gateArgs.push("--qa-file", args["qa-file"]);
  if (gateArgs.length === 0) return { attempted: false, passed: false };

  const result = spawnSync("npm", ["run", "outbound:send-gates", "--", ...gateArgs], { encoding: "utf8" });
  if (result.stdout) console.log(result.stdout.trim());
  if (result.stderr) console.error(result.stderr.trim());
  return { attempted: true, passed: result.status === 0 };
}

const args = parseArgs(process.argv.slice(2));
const liveGateResult = runLiveSendGates(args);
const surfacesToOpen = liveGateResult.attempted && !liveGateResult.passed ? liveGateRepairSurfaces : reviewSurfaces;

console.log("MCPScan first revenue runway launcher");
console.log("");
if (liveGateResult.attempted && liveGateResult.passed) {
  console.log("Live first-send gates passed. Opening first-revenue approval and delivery surfaces:");
} else if (liveGateResult.attempted) {
  console.log("Live first-send gates did not pass. Opening only live-gate repair surfaces:");
} else {
  console.log("Opening first-revenue review surfaces without live evidence gate proof:");
}

for (const page of surfacesToOpen) {
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
