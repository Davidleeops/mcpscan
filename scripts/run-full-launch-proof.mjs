#!/usr/bin/env node
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      values[key] = "true";
    } else {
      values[key] = next;
      index += 1;
    }
  }
  return values;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(label, scriptName, extraArgs = []) {
  console.log("");
  console.log(`Running ${label}: npm run ${scriptName}${extraArgs.length ? ` -- ${extraArgs.join(" ")}` : ""}`);
  const result = spawnSync("npm", ["run", scriptName, ...(extraArgs.length ? ["--", ...extraArgs] : [])], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error("");
    console.error(`${label} failed.`);
    process.exit(result.status ?? 1);
  }
}

const args = parseArgs(process.argv.slice(2));
const includeMarket = args.market === "true";
const includeLive = args.live === "true";

console.log("MCPScan full launch proof");
console.log(
  includeLive
    ? "This command proves the local launch package and live founder-return evidence without buying, publishing, sending, charging, or opening account pages."
    : "This command proves the local launch package without buying, publishing, sending, charging, or opening account pages."
);

run("objective completion matrix", "objective:verify");
if (includeMarket) run("market source verification", "market:verify");
run("GTM claim safety", "gtm:verify");
run("launch readiness", "launch:verify");
run("writing rule", "writing:check");

if (includeLive) {
  const returnFile = args["return-file"];
  const qaFile = args["qa-file"];
  const cartFile = args["cart-file"];
  const statusFile = args["status-file"];
  const mailProvider = args["mail-provider"];
  const dkimSelector = args["dkim-selector"];

  if (!returnFile) fail("Live full proof requires --return-file /path/to/approved-return-packet.txt.");
  if (!qaFile) fail("Live full proof requires --qa-file /path/to/stripe-checkout-qa-evidence.json.");
  if (!cartFile) fail("Live full proof requires --cart-file /path/to/domain-cart-proof.json.");
  if (!statusFile) fail("Live full proof requires --status-file /path/to/founder-approval-status.json.");

  const postClickArgs = [
    "--file",
    returnFile,
    "--cart-file",
    cartFile,
    "--qa-file",
    qaFile,
    "--strict",
    "true"
  ];
  if (mailProvider) postClickArgs.push("--mail-provider", mailProvider);
  if (dkimSelector) postClickArgs.push("--dkim-selector", dkimSelector);

  run("strict live post-click verification", "launch:post-click-verify", postClickArgs);
  run("first revenue live gate", "launch:verify-live", [
    "--status-file",
    statusFile,
    "--cart-file",
    cartFile,
    "--return-file",
    returnFile,
    "--qa-file",
    qaFile
  ]);
  run("first outbound live evidence gates", "outbound:send-gates", [
    "--status-file",
    statusFile,
    "--cart-file",
    cartFile,
    "--return-file",
    returnFile,
    "--qa-file",
    qaFile
  ]);
}

run("launch status", "launch:status");

console.log("");
console.log("Full launch proof complete.");
console.log("");
console.log("Remaining founder-click boundary:");
console.log("- custom_domain_live");
console.log("- mailbox_live");
console.log("- stripe_links_live");
console.log("- security_contact_live");
console.log("");
console.log("Optional current market proof:");
console.log("npm run launch:full-proof -- --market true");
console.log("");
console.log("Live evidence proof after founder clicks:");
console.log('npm run launch:full-proof -- --live true --status-file ops/founder-approval-status.json --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --return-file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json"');
