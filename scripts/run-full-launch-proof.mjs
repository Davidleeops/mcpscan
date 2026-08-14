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

function run(label, scriptName) {
  console.log("");
  console.log(`Running ${label}: npm run ${scriptName}`);
  const result = spawnSync("npm", ["run", scriptName], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error("");
    console.error(`${label} failed.`);
    process.exit(result.status ?? 1);
  }
}

const args = parseArgs(process.argv.slice(2));
const includeMarket = args.market === "true";

console.log("MCPScan full launch proof");
console.log("This command proves the local launch package without buying, publishing, sending, charging, or opening account pages.");

run("objective completion matrix", "objective:verify");
if (includeMarket) run("market source verification", "market:verify");
run("launch readiness", "launch:verify");
run("writing rule", "writing:check");
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
