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

function info(message) {
  console.log("");
  console.log(message);
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
const applyReturnPacket = args.apply === "true";
const qaFile = args["qa-file"];
const skipDns = args["skip-dns"] === "true";
const skipLaunch = args["skip-launch"] === "true";

if (applyReturnPacket) {
  run("founder return packet apply", "npm", ["run", "launch:apply-return-packet", "--", "--file", args.file]);
} else {
  info("Skipping apply step. Pass --apply true to apply approved links and write the status tracker.");
}

const stripeArgs = ["run", "launch:verify-stripe", "--", "--file", args.file, "--update-status"];
if (strict) stripeArgs.push("--strict", "true");
run("Stripe Payment Link verification", "npm", stripeArgs);

if (qaFile) {
  if (!fs.existsSync(qaFile)) fail(`Stripe QA evidence file not found: ${qaFile}`);
  run("Stripe checkout QA evidence verification", "npm", ["run", "launch:verify-stripe-qa", "--", "--file", qaFile, "--update-status"]);
} else if (strict) {
  fail("Strict post-click verification requires --qa-file /path/to/stripe-checkout-qa-evidence.json.");
} else {
  info("Skipping Stripe checkout QA evidence. Pass --qa-file after the dashboard evidence JSON exists.");
}

if (skipDns) {
  info("Skipping DNS and mailbox verification because --skip-dns true was provided.");
} else {
  const dnsArgs = ["run", "launch:verify-dns", "--", "--domain", domain, "--update-status"];
  if (dkimSelector) dnsArgs.push("--dkim-selector", dkimSelector);
  if (strict) dnsArgs.push("--strict", "true");
  run("DNS and mailbox verification", "npm", dnsArgs);
}

run("writing rule check", "npm", ["run", "writing:check"]);

if (skipLaunch) {
  info("Skipping launch verification because --skip-launch true was provided.");
} else {
  const launchArgs = ["run", "launch:verify", "--", "--domain", domain];
  if (strict) launchArgs.push("--strict", "true");
  run("launch verification", "npm", launchArgs);
}

run("launch status", "npm", ["run", "launch:status"]);

console.log("");
console.log("Post-click verification complete.");
console.log(`Domain checked: ${domain}`);
console.log(applyReturnPacket ? "Return packet apply step ran." : "Return packet apply step was skipped.");
console.log(qaFile ? `Stripe QA evidence checked: ${qaFile}` : "Stripe QA evidence was not checked.");
