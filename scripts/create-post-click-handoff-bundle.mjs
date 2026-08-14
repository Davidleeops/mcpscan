#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();

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

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validStripeUrl(value) {
  return /^https:\/\/buy\.stripe\.com\/\S+$/i.test(value) && !/test_/i.test(value);
}

function validMailProvider(value) {
  return ["zoho", "google", "spacemail"].includes(value);
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail("Refusing to write post-click handoff bundle inside the public MCPScan repo.");
  }
  return resolved;
}

function run(label, args) {
  console.log("");
  console.log(`Running ${label}`);
  const child = spawnSync("npm", args, { cwd: root, stdio: "inherit" });
  if (child.status !== 0) process.exit(child.status ?? 1);
}

const args = parseArgs(process.argv.slice(2));
if (!args.file) fail("Missing --file path to the approved founder return packet.");
if (!args["qa-file"]) fail("Missing --qa-file path to the Stripe checkout QA evidence.");
if (!fs.existsSync(args.file)) fail(`Return packet not found: ${args.file}`);
if (!fs.existsSync(args["qa-file"])) fail(`Stripe QA evidence not found: ${args["qa-file"]}`);

const input = fs.readFileSync(args.file, "utf8");
const qa = JSON.parse(fs.readFileSync(args["qa-file"], "utf8"));
const domain = (args.domain ?? valueFromInput("Domain", input) ?? "").toLowerCase();
const mailProvider = (args["mail-provider"] ?? valueFromInput("Mail provider", input) ?? "zoho").toLowerCase();
const mailbox = valueFromInput("Primary mailbox", input) ?? "";
const auditAlias = valueFromInput("Audit alias", input) ?? "";
const helloAlias = valueFromInput("Hello alias", input) ?? "";
const quick = valueFromInput("Quick Audit", input) ?? "";
const launch = valueFromInput("Launch Audit", input) ?? "";
const enterprise = valueFromInput("Enterprise Readiness", input) ?? "";

if (!input.includes("I approve applying these exact MCPScan launch values")) fail("Founder approval phrase is missing.");
if (!input.includes("Apply these links to the public landing page")) fail("Approved action phrase is missing.");
if (!validDomain(domain)) fail("Domain is missing or invalid.");
if (!validMailProvider(mailProvider)) fail("Mail provider must be zoho, google, or spacemail.");
for (const [label, value] of Object.entries({ mailbox, auditAlias, helloAlias })) {
  if (!validEmail(value) || !value.toLowerCase().endsWith(`@${domain}`)) fail(`${label} must be on the approved domain.`);
}
for (const [label, value] of Object.entries({ quick, launch, enterprise })) {
  if (!validStripeUrl(value)) fail(`${label} must be a live public Stripe Payment Link.`);
}
if (qa.domain !== domain) fail("Stripe QA evidence domain does not match the approved return packet.");

run("return packet dry run", ["run", "launch:apply-return-packet", "--", "--dry-run", "true", "--file", args.file]);
run("Stripe link format verification", ["run", "launch:verify-stripe", "--", "--file", args.file]);
run("return packet and Stripe QA consistency", ["run", "launch:verify-return-qa", "--", "--file", args.file, "--qa-file", args["qa-file"]]);
run("Stripe checkout QA evidence verification", ["run", "launch:verify-stripe-qa", "--", "--file", args["qa-file"]]);

const date = new Date().toISOString().slice(0, 10);
const baseDir = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Post-Click Bundles"));
const bundleDir = path.join(baseDir, `${date}_${slugify(domain)}_post-click-handoff`);
if (fs.existsSync(bundleDir)) fail(`Post-click handoff bundle already exists: ${bundleDir}`);
fs.mkdirSync(bundleDir, { recursive: true });

const returnPacketPath = path.join(bundleDir, "approved-return-packet.txt");
const qaPath = path.join(bundleDir, "stripe-checkout-qa-evidence.json");
const summaryPath = path.join(bundleDir, "public-safe-summary.json");
const commandsPath = path.join(bundleDir, "NEXT_COMMANDS.md");

fs.copyFileSync(args.file, returnPacketPath);
fs.copyFileSync(args["qa-file"], qaPath);

const summary = {
  generatedFor: "MCPScan post-click handoff",
  generatedAt: new Date().toISOString(),
  domain,
  mailProvider,
  mailbox,
  auditAlias,
  helloAlias,
  stripeQuickAuditLink: quick,
  stripeLaunchAuditLink: launch,
  stripeEnterpriseReadinessLink: enterprise,
  returnPacketPath,
  stripeQaEvidencePath: qaPath,
  noSecretsIncluded: true,
  nextAction: "Run the apply and publish commands after confirming the bundle paths."
};

const commands = [
  "# MCPScan Post-Click Handoff Commands",
  "",
  "Review these paths, then run the commands from the public MCPScan repo.",
  "",
  "## Apply And Verify",
  "",
  "```text",
  `npm run launch:post-click-verify -- --file "${returnPacketPath}" --qa-file "${qaPath}" --apply true --mail-provider ${mailProvider}`,
  "npm run launch:publish-pages-fallback -- --wait true",
  `npm run launch:verify -- --domain ${domain}`,
  "npm run launch:status:live",
  "npm run launch:open-first-revenue",
  "```",
  "",
  "## Safety",
  "",
  "- This bundle contains only public launch values and Stripe QA evidence.",
  "- Do not add registrar passwords, mailbox passwords, Stripe secret keys, API keys, recovery codes, customer configs, customer data, or private audit evidence.",
  "- Outbound remains paused until exact recipients and exact final messages are approved in the same turn.",
  ""
].join("\n");

fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
fs.writeFileSync(commandsPath, commands, "utf8");

console.log("");
console.log("Created MCPScan post-click handoff bundle.");
console.log(bundleDir);
console.log(`Next commands: ${commandsPath}`);
