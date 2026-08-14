#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const reviewSurfaces = [
  "ops/domain-mailbox-purchase-packet.html",
  "docs/DOMAIN_MAILBOX_PURCHASE_PACKET.md",
  "docs/DOMAIN_PURCHASE_SHORTLIST_2026-08-14.md",
  "docs/CHEAP_DOMAIN_DECISION_2026-08-14.md",
  "docs/DOMAIN_AND_MAILBOX_DECISION.md",
  "ops/domain-email-dns-console.html",
  "ops/cheap-launch-packet-console.html",
  "ops/founder-return-packet.html",
  "docs/POST_PURCHASE_PUBLIC_PROOF_PACKET.md"
];

const accountLinks = [
  "https://www.spaceship.com/domain-search/?query=getmcpscan.com",
  "https://www.spaceship.com/domain-search/?query=mcpattest.dev",
  "https://www.spaceship.com/domain-search/?query=getmcpscan.xyz",
  "https://www.spaceship.com/domain-search/?query=mcpscan.online",
  "https://www.spaceship.com/domain-search/?query=mcpscan.site",
  "https://www.spaceship.com/business-email/",
  "https://www.zoho.com/mail/zohomail-pricing.html"
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
  const result = spawnSync("npm", ["run", "launch:status"], { encoding: "utf8" });
  if (result.stdout) console.log(result.stdout.trim());
  if (result.stderr) console.error(result.stderr.trim());
}

console.log("MCPScan domain purchase path");
console.log("");
console.log("Opening domain and mailbox review surfaces:");

for (const page of reviewSurfaces) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Opening registrar and mailbox links:");
for (const url of accountLinks) {
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${url}`);
}

console.log("");
console.log("Current launch status:");
runStatus();

console.log("");
console.log("Domain order:");
console.log("1. Search getmcpscan.com first if MCPScan stays the name and trust matters.");
console.log("2. Search mcpattest.dev first only if a cleaner security brand is approved.");
console.log("3. Search getmcpscan.xyz first if the hard cash cap is near $1 to $3.");
console.log("4. Use mcpscan.online only if the .xyz cart fails or the final cart is materially better.");
console.log("5. Avoid .shop for the primary security brand even if it is cheaper.");
console.log("6. Buy one domain only after the cart shows first-year price, renewal price, and no paid add-ons.");
console.log("7. Create one security@ mailbox and aliases for audit@ and hello@.");
console.log("8. Paste only public values into the founder return packet.");
console.log("9. Run npm run launch:verify-dns after DNS records propagate.");

console.log("");
console.log("Hard rule:");
console.log("This command opens account pages only. It does not buy, publish, send, apply DNS, create mailboxes, or approve cart values.");
