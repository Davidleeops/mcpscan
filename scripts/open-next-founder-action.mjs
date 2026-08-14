#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const reviewSurfaces = [
  "ops/launch-cockpit.html",
  "ops/final-founder-click-console.html",
  "ops/founder-click-handoff.html",
  "ops/github-actions-billing-console.html",
  "ops/cheap-launch-packet-console.html",
  "ops/founder-return-packet.html",
  "ops/verification-console.html",
  "sales/daily-revenue-command.md",
  "ops/GITHUB_ISSUE_ACTION_BOARD.md"
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

console.log("MCPScan next founder action launcher");
console.log("");
console.log("Opening launch control surfaces:");

for (const page of reviewSurfaces) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Current launch status:");
runStatus();

console.log("");
console.log("Next action ladder:");
console.log("1. Clear GitHub Actions billing or account lock.");
console.log("2. Buy the approved domain and mailbox.");
console.log("3. Create Stripe Payment Links and checkout QA evidence.");
console.log("4. Paste exact values into the founder return packet.");
console.log("5. Run npm run launch:open-return-review after values exist.");
console.log("6. Run npm run launch:open-public-review before any public post.");
console.log("7. Run npm run outbound:open-send-gates before any outreach.");
console.log("8. Run npm run outbound:open-reply-close after any prospect reply.");
console.log("9. Run npm run delivery:open-handoff after payment clears.");

console.log("");
console.log("Hard rule:");
console.log("Every external post, outbound message, reply, and paid handoff remains approval-gated. This command does not publish, send, buy, apply, or create customer files.");
