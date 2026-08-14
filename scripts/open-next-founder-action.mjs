#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const reviewSurfaces = [
  "ops/final-founder-click-console.html",
  "ops/founder-click-handoff.html",
  "ops/domain-mailbox-purchase-packet.html",
  "ops/stripe-click-setup.html",
  "ops/stripe-payment-link-qa-console.html",
  "ops/founder-return-packet.html",
  "ops/founder-status-console.html"
];

const externalUrls = [
  "https://www.spaceship.com/promos/",
  "https://www.spaceship.com/domain-search/?query=getmcpscan.xyz",
  "https://www.spaceship.com/domain-search/?query=mcpscan.online",
  "https://dashboard.stripe.com/payment-links"
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
console.log("Opening the narrow founder action path:");

for (const page of reviewSurfaces) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Opening founder account links:");
for (const url of externalUrls) {
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${url}`);
}

console.log("");
console.log("Current launch status:");
runStatus();

console.log("");
console.log("Next action ladder:");
console.log("1. Open Spaceship promos and compare getmcpscan.xyz against mcpscan.online in the final cart.");
console.log("2. Run npm run launch:click-session if the .xyz cart wins.");
console.log("3. Run npm run launch:click-session -- --domain mcpscan.online --mail-provider spacemail if the near-dollar .online cart wins.");
console.log("4. Fill the generated cart proof from the visible Spaceship cart before buying anything.");
console.log("5. Buy one domain only if the cart stays at or below the approved cap and renewal is visible.");
console.log("6. Create one Spacemail mailbox on the chosen domain: security@domain, with audit@ and hello@ aliases.");
console.log("7. Create Stripe Payment Links and checkout QA evidence.");
console.log("8. Paste exact values into the generated founder return packet.");
console.log("9. Run npm run launch:post-click-bundle after return packet and QA evidence exist.");
console.log("10. Run npm run launch:open-return-review after values exist.");
console.log("11. Run npm run launch:publish-pages-fallback -- --wait true after approved values are applied.");
console.log("12. Run npm run launch:full-proof -- --live true with the generated evidence files.");
console.log("13. Run npm run launch:open-public-review before any public post.");
console.log("14. Run npm run outbound:open-send-gates before any outreach.");
console.log("15. Run npm run outbound:open-reply-close after any prospect reply.");
console.log("16. Run npm run delivery:open-handoff after payment clears.");
console.log("17. Clear GitHub billing later so normal CI resumes.");

console.log("");
console.log("Hard rule:");
console.log("Every external post, outbound message, reply, and paid handoff remains approval-gated. This command opens account pages, but it does not buy, publish, send, apply, or create customer files.");
