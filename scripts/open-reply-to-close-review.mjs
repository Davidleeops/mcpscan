#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const reviewSurfaces = [
  "sales/reply-to-close-packet.md",
  "docs/APPROVED_REPLY_STAGING.md",
  "ops/customer-comms-console.html",
  "ops/outbound-approval-console.html",
  "ops/verification-console.html",
  "ops/stripe-payment-link-qa-console.html",
  "ops/post-payment-console.html",
  "sales/customer-communications.md",
  "sales/post-payment-handoff.md",
  "docs/APPROVED_SEND_LOGGING.md"
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

console.log("MCPScan reply-to-close review launcher");
console.log("");
console.log("Opening inbound-reply review surfaces:");

for (const page of reviewSurfaces) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Approval rule:");
console.log("Do not send any reply until the exact recipient and exact final reply are approved in the same turn.");
console.log("");
console.log("After approval, stage the reply outside the public repo with:");
console.log("npm run outbound:stage-reply -- --file /path/to/approved-reply.txt");
console.log("");
console.log("Before sending a reply with checkout links, run:");
console.log("npm run outbound:send-gates");
console.log("");
console.log("After the founder manually sends the approved reply, log it with:");
console.log("npm run outbound:log-send -- --manifest /path/outside/public/repo/manifest.json");
