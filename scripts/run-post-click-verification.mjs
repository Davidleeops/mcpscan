#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";

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

function valueFromInput(label, input) {
  const match = input.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim();
}

function run(label, command, args) {
  console.log("");
  console.log(`Running ${label}`);
  const child = spawnSync(command, args, { stdio: "inherit" });
  if (child.status !== 0) process.exit(child.status ?? 1);
}

const args = parseArgs(process.argv.slice(2));
if (!args.file) fail("Missing --file path to the approved founder return packet.");
if (!fs.existsSync(args.file)) fail(`Return packet not found: ${args.file}`);

const input = fs.readFileSync(args.file, "utf8");
const domain = (args.domain ?? valueFromInput("Domain", input) ?? "").toLowerCase();
if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
  fail("Missing or invalid domain. Use --domain or include Domain: in the return packet.");
}

const strict = args.strict === "true";
const dkimSelector = args["dkim-selector"];

const stripeArgs = ["run", "launch:verify-stripe", "--", "--file", args.file, "--update-status"];
if (strict) stripeArgs.push("--strict", "true");
run("Stripe Payment Link verification", "npm", stripeArgs);

const dnsArgs = ["run", "launch:verify-dns", "--", "--domain", domain, "--update-status"];
if (dkimSelector) dnsArgs.push("--dkim-selector", dkimSelector);
if (strict) dnsArgs.push("--strict", "true");
run("DNS and mailbox verification", "npm", dnsArgs);

run("writing rule check", "npm", ["run", "writing:check"]);

const launchArgs = ["run", "launch:verify", "--", "--domain", domain];
if (strict) launchArgs.push("--strict", "true");
run("launch verification", "npm", launchArgs);

run("launch status", "npm", ["run", "launch:status"]);

console.log("");
console.log("Post-click verification complete.");
console.log(`Domain checked: ${domain}`);
