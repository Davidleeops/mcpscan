#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const targets = [
  "ops/market-research-refresh-console.html",
  "ops/gtm-placement-console.html",
  "ops/recipient-finder-console.html",
  "docs/MARKET_REALITY_BRIEF_2026-08-14.md",
  "docs/MARKET_SOURCE_PACK_2026-08-14.md",
  "docs/MARKET_PULSE_REFRESH_2026-08-14.md",
  "docs/FIRST_REVENUE_CHANNEL_PLACEMENT_2026-08-14.md",
  "sales/buyer-intent-map-2026-08-14.md",
  "sales/first-account-dossier-2026-08-14.md",
  "sales/recipient-candidate-sources-2026-08-14.md"
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

function runMarketVerify() {
  const result = spawnSync("npm", ["run", "market:verify"], { encoding: "utf8" });
  if (result.stdout) console.log(result.stdout.trim());
  if (result.stderr) console.error(result.stderr.trim());
  if (result.status !== 0) {
    console.log("");
    console.log("Market verification did not complete cleanly. Refresh warned sources before approving stronger public claims.");
  }
}

console.log("MCPScan market research launcher");
console.log("");
console.log("Opening market, buyer, and GTM surfaces:");

for (const target of targets) {
  const url = pathToFileURL(path.resolve(target)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${target}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Current market source verification:");
runMarketVerify();

console.log("");
console.log("Market order:");
console.log("1. Read the reality brief before changing positioning.");
console.log("2. Check the source pack before making public claims.");
console.log("3. Use the channel placement map before outbound.");
console.log("4. Use the buyer intent map to match pain to channel.");
console.log("5. Use the recipient finder before any first-wave outreach approval.");
console.log("6. Run npm run gtm:verify before public posts or outbound copy changes.");

console.log("");
console.log("Hard rule:");
console.log("This command opens surfaces and checks sources only. It does not post, message, send, publish, or approve claims.");
