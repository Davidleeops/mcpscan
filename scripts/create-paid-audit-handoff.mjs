#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const approvalPhrase = "I approve creating this MCPScan paid audit handoff.";

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

function readInput(file) {
  if (file) return fs.readFileSync(file, "utf8");
  return fs.readFileSync(0, "utf8");
}

function requireMatch(label, text, pattern) {
  const match = text.match(pattern);
  if (!match?.[1]) throw new Error(`Missing ${label} in paid audit handoff packet.`);
  return match[1].trim();
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPackage(value) {
  return /quick|launch|enterprise/i.test(value);
}

function validPayment(value) {
  return /^(pi_|cs_|plink_|ch_|checkout_|receipt_|manual_|\{\{)/i.test(value) || /^https:\/\/\S+$/i.test(value);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    throw new Error("Refusing to write paid audit handoff output inside the public MCPScan repo.");
  }
  return resolved;
}

function runNode(args) {
  const child = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (child.status !== 0) process.exit(child.status ?? 1);
}

const args = parseArgs(process.argv.slice(2));
const input = readInput(args.file);

if (!input.includes(approvalPhrase)) {
  throw new Error(`Missing paid handoff approval phrase: ${approvalPhrase}`);
}

if (!input.includes("Do not store customer secrets in the public repo.")) {
  throw new Error("Missing public-repo secret guardrail.");
}

const customer = requireMatch("customer", input, /^Customer:\s*(.+)$/m);
const packageName = requireMatch("package", input, /^Package:\s*(.+)$/m);
const contact = requireMatch("technical contact", input, /^Technical contact:\s*(.+)$/m);
const payment = requireMatch("payment reference", input, /^Payment reference:\s*(.+)$/m);
const date = args.date ?? input.match(/^Date:\s*(.+)$/m)?.[1]?.trim() ?? today();
const baseDir = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Paid Audits"));
const workspaceRoot = path.join(baseDir, "workspaces");
const workOrderRoot = path.join(baseDir, "work-orders");

if (!validPackage(packageName)) throw new Error("Package must mention Quick, Launch, or Enterprise.");
if (!validEmail(contact) && !/^https:\/\/\S+$/i.test(contact)) throw new Error("Technical contact must be an email address or HTTPS URL.");
if (!validPayment(payment)) throw new Error("Payment reference must look like a Stripe reference, receipt URL, or approved manual reference.");

runNode([
  "scripts/create-customer-workspace.mjs",
  "--customer",
  customer,
  "--date",
  date,
  "--root",
  workspaceRoot
]);

runNode([
  "scripts/create-first-paid-audit-work-order.mjs",
  "--customer",
  customer,
  "--package",
  packageName,
  "--contact",
  contact,
  "--payment",
  payment,
  "--date",
  date,
  "--root",
  workOrderRoot
]);

const manifest = {
  date,
  customer,
  package: packageName,
  contact,
  payment,
  workspaceRoot,
  workOrderRoot,
  noCustomerSecretsInPublicRepo: true
};

fs.mkdirSync(baseDir, { recursive: true });
fs.writeFileSync(path.join(baseDir, `${date}_handoff-manifest.json`), `${JSON.stringify(manifest, null, 2)}\n`);

console.log("Created paid audit handoff.");
console.log(baseDir);
