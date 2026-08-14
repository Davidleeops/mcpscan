#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const reviewSurfaces = [
  "docs/PUBLIC_LAUNCH_POST_APPROVAL.md",
  "docs/PUBLIC_CHANNEL_LAUNCH_DRAFTS_2026-08-14.md",
  "ops/public-channel-drafts-console.html",
  "ops/gtm-placement-console.html",
  "docs/FIRST_REVENUE_CHANNEL_PLACEMENT_2026-08-14.md",
  "docs/MARKET_REALITY_BRIEF_2026-08-14.md",
  "docs/PUBLIC_TRUST_CHECKLIST.md",
  "docs/GTM_CLAIM_SAFETY.md",
  "ops/market-research-refresh-console.html",
  "ops/first-revenue-battlecard.html",
  "ops/verification-console.html",
  "landing/index.html",
  "landing/sample-report.html",
  "landing/terms.html",
  "landing/privacy.html",
  "landing/refund.html"
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

console.log("MCPScan public launch review launcher");
console.log("");
console.log("Opening public launch review surfaces:");

for (const page of reviewSurfaces) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Approval rule:");
console.log("Do not publish any public post until the exact channel, exact URL, and exact final text are approved in the same turn.");
console.log("");
console.log("Before asking for approval, verify market evidence and claim safety:");
console.log("npm run market:verify");
console.log("npm run gtm:verify");
console.log("");
console.log("After approval, stage the public post outside the public repo with:");
console.log("npm run launch:stage-public-post -- --file /path/to/approved-public-launch-post.txt");
console.log("");
console.log("Before publishing manually, verify launch status:");
console.log("npm run launch:status:live");
