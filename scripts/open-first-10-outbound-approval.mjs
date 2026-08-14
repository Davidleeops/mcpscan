#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const pages = [
  "ops/first-10-outbound-approval-console.html",
  "sales/first-10-route-approval-packet-2026-08-14.md",
  "sales/first-10-contact-routes-2026-08-14.csv",
  "ops/outbound-recipient-approval-builder.html",
  "ops/outbound-approval-queue-console.html"
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

console.log("MCPScan first-10 outbound approval launcher");
console.log("");
console.log("Opening review surfaces:");

for (const page of pages) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Approval rule:");
console.log("No external message can be sent until the exact route, exact recipient description, and exact final message are approved in the same turn.");
console.log("");
console.log("All-10 staging phrase:");
console.log("I approve staging all 10 exact MCPScan route outbound messages.");
console.log("Do not send automatically.");
console.log("");
console.log("After approval, stage outside the public repo with:");
console.log("npm run outbound:stage-route-packet -- --file /path/to/approved-first-10-route-packet.txt");
console.log("");
console.log("Before any manual send, run:");
console.log("npm run outbound:send-gates");
