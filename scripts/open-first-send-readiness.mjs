#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const reviewSurfaces = [
  "ops/founder-status-console.html",
  "ops/first-10-outbound-approval-console.html",
  "ops/outbound-approval-queue-console.html",
  "ops/outbound-recipient-approval-builder.html",
  "ops/verification-console.html",
  "sales/first-10-route-approval-packet-2026-08-14.md",
  "docs/APPROVED_SEND_LOGGING.md",
  "docs/BATCH_SEND_LOGGING.md",
  "docs/PRIVATE_REVENUE_SNAPSHOT.md",
  "sales/daily-revenue-command.md"
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

console.log("MCPScan first-send readiness launcher");
console.log("");
console.log("Opening pre-send review surfaces:");

for (const page of reviewSurfaces) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Approval rule:");
console.log("Do not send any external message until the exact recipient or route and exact final content are approved in the same turn.");
console.log("");
console.log("Before any manual send from the launch mailbox, run:");
console.log("npm run outbound:send-gates");
console.log("");
console.log("After same-turn approval, stage the first-10 route packet outside the public repo with:");
console.log("npm run outbound:stage-route-packet -- --file /path/to/approved-first-10-route-packet.txt");
console.log("");
console.log("After the founder manually sends the approved batch, log it with:");
console.log("npm run outbound:log-route-batch -- --batch /path/outside/public/repo/YYYY-MM-DD_first-10-route-approvals");
console.log("");
console.log("Then build the private revenue snapshot with:");
console.log("npm run revenue:snapshot");
