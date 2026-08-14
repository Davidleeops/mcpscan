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
  return /^(pi_|cs_|plink_|ch_|checkout_|receipt_|manual_)/i.test(value) || /^https:\/\/\S*(stripe|receipt|invoice|checkout)\S*$/i.test(value);
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function hasPlaceholder(value) {
  return /\{\{[^}]+\}\}/.test(value);
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
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
const statusRoot = path.join(baseDir, "pipeline-status");
const customerSlug = slugify(customer);
const packageSlug = slugify(packageName);
const outputStem = `${date}_${customerSlug}_${packageSlug}`;

if (!validPackage(packageName)) throw new Error("Package must mention Quick, Launch, or Enterprise.");
if (!validEmail(contact) && !/^https:\/\/\S+$/i.test(contact)) throw new Error("Technical contact must be an email address or HTTPS URL.");
if (!validPayment(payment)) throw new Error("Payment reference must look like a Stripe reference, receipt URL, or approved manual reference.");
if (!validDate(date)) throw new Error("Date must use YYYY-MM-DD.");
if (!customerSlug) throw new Error("Customer must contain usable letters or numbers.");
if (!packageSlug) throw new Error("Package must contain usable letters or numbers.");

for (const [label, value] of Object.entries({ customer, packageName, contact, payment, date })) {
  if (hasPlaceholder(value)) throw new Error(`Replace template placeholder before paid handoff: ${label}.`);
}

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
  pipelineStatusRoot: statusRoot,
  noCustomerSecretsInPublicRepo: true
};

const pipelineStatus = {
  date,
  stage: "Paid",
  account: customer,
  package: packageName,
  technicalContact: contact,
  paymentReference: payment,
  paymentStatus: "Paid",
  deliveryStatus: "Workspace created",
  nextAction: "Send intake start, confirm secure handoff, and complete client acceptance.",
  workspaceRoot,
  workOrderRoot,
  publicRepoSecretStatus: "No customer secrets stored in public repo."
};

const pipelineCsvHeader = [
  "date",
  "stage",
  "account",
  "package",
  "technical_contact",
  "payment_reference",
  "payment_status",
  "delivery_status",
  "next_action",
  "workspace_root",
  "work_order_root",
  "public_repo_secret_status"
];

const pipelineCsvRow = [
  pipelineStatus.date,
  pipelineStatus.stage,
  pipelineStatus.account,
  pipelineStatus.package,
  pipelineStatus.technicalContact,
  pipelineStatus.paymentReference,
  pipelineStatus.paymentStatus,
  pipelineStatus.deliveryStatus,
  pipelineStatus.nextAction,
  pipelineStatus.workspaceRoot,
  pipelineStatus.workOrderRoot,
  pipelineStatus.publicRepoSecretStatus
];

fs.mkdirSync(baseDir, { recursive: true });
fs.mkdirSync(statusRoot, { recursive: true });
fs.writeFileSync(path.join(baseDir, `${outputStem}_handoff-manifest.json`), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(statusRoot, `${outputStem}_pipeline-status.json`), `${JSON.stringify(pipelineStatus, null, 2)}\n`);
fs.writeFileSync(
  path.join(statusRoot, `${outputStem}_pipeline-status.csv`),
  `${pipelineCsvHeader.map(csvCell).join(",")}\n${pipelineCsvRow.map(csvCell).join(",")}\n`
);

console.log("Created paid audit handoff.");
console.log(baseDir);
