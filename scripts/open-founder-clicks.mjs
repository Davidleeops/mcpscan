#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const pages = [
  "ops/founder-click-handoff.html",
  "ops/launch-approval-queue.html",
  "ops/github-actions-billing-console.html",
  "ops/domain-mailbox-purchase-packet.html",
  "ops/cheap-launch-packet-console.html"
];

const externalUrls = [
  "https://github.com/settings/billing",
  "https://github.com/Davidleeops/mcpscan/actions",
  "https://www.spaceship.com/domain-search/?query=mcpscan.site"
];

function openerFor(url) {
  if (process.platform === "darwin") return ["open", [url]];
  if (process.platform === "win32") return ["cmd", ["/c", "start", "", url]];
  if (process.platform === "linux") return ["xdg-open", [url]];
  return null;
}

function openUrl(url) {
  const opener = openerFor(url);
  if (!opener) return false;
  const [command, args] = opener;
  const result = spawnSync(command, args, { stdio: "ignore" });
  return !result.error && result.status === 0;
}

console.log("MCPScan founder click launcher");
console.log("");

try {
  const status = execFileSync("npm", ["run", "launch:status:live"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  console.log(status.trim());
} catch (error) {
  console.log("Live status unavailable. Open the founder handoff and continue with the visible gates.");
  if (error.stderr) console.log(String(error.stderr).trim());
}

console.log("");
console.log("Opening local founder-click pages:");

for (const page of pages) {
  const fileUrl = pathToFileURL(path.resolve(page)).toString();
  const opened = openUrl(fileUrl);
  console.log(`${opened ? "OPENED" : "COPY"} ${page} ${opened ? "" : fileUrl}`.trim());
}

console.log("");
console.log("External founder account links:");
for (const url of externalUrls) console.log(url);
