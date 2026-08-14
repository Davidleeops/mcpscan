#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const reviewSurfaces = [
  "ops/founder-return-packet.html",
  "ops/stripe-payment-link-qa-console.html",
  "ops/founder-status-console.html",
  "ops/verification-console.html",
  "ops/final-founder-click-console.html",
  "docs/FINAL_FOUNDER_CLICK_PATH.md",
  "docs/POST_CLICK_VERIFICATION.md",
  "docs/STRIPE_PAYMENT_LINK_VERIFICATION.md"
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

console.log("MCPScan founder return review launcher");
console.log("");
console.log("Opening post-click review surfaces:");

for (const page of reviewSurfaces) {
  const url = pathToFileURL(path.resolve(page)).toString();
  const opened = openTarget(url);
  console.log(`${opened ? "OPENED" : "COPY"} ${page}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Approval rule:");
console.log("Run the apply step only after the founder approves the exact return packet and Stripe checkout QA evidence.");
console.log("");
console.log("After approval, apply and verify with:");
console.log("npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true --mail-provider {{zoho_or_google_or_spacemail}}");
console.log("npm run launch:publish-pages-fallback -- --wait true");
console.log("npm run launch:verify -- --domain getmcpscan.com");
console.log("npm run launch:status:live");
console.log("");
console.log("If DNS is still propagating, use the same command with:");
console.log("--skip-dns true");
console.log("");
console.log("Before outbound, run:");
console.log("npm run outbound:send-gates");
