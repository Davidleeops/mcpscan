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
  return /^(pi_|cs_|ch_|receipt_|manual_)/i.test(value) || /^https:\/\/\S*(stripe|receipt|invoice|checkout)\S*$/i.test(value);
}

function paymentLinkOnly(value) {
  return /^plink_/i.test(value) || /^https:\/\/buy\.stripe\.com\//i.test(value);
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
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

function verifyPaymentEvidence(file) {
  if (!file) {
    throw new Error("Missing required --payment-evidence path. Verify public-safe payment evidence before creating the paid audit handoff.");
  }

  const resolved = assertOutsideRepo(file);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Payment evidence file does not exist: ${resolved}`);
  }

  runNode(["scripts/verify-payment-evidence.mjs", "--file", resolved]);

  let data;
  try {
    data = JSON.parse(fs.readFileSync(resolved, "utf8"));
  } catch {
    throw new Error("Payment evidence file must be valid JSON.");
  }

  return { resolved, data };
}

function assertDoesNotExist(label, target) {
  if (fs.existsSync(target)) {
    throw new Error(`${label} already exists: ${target}`);
  }
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
const commsRoot = path.join(baseDir, "customer-comms");
const customerSlug = slugify(customer);
const packageSlug = slugify(packageName);
const outputStem = `${date}_${customerSlug}_${packageSlug}`;
const manifestPath = path.join(baseDir, `${outputStem}_handoff-manifest.json`);
const pipelineStatusPath = path.join(statusRoot, `${outputStem}_pipeline-status.json`);
const pipelineCsvPath = path.join(statusRoot, `${outputStem}_pipeline-status.csv`);
const intakeDraftPath = path.join(commsRoot, `${outputStem}_intake-start-draft.txt`);

if (!validPackage(packageName)) throw new Error("Package must mention Quick, Launch, or Enterprise.");
if (!validEmail(contact) && !/^https:\/\/\S+$/i.test(contact)) throw new Error("Technical contact must be an email address or HTTPS URL.");
if (paymentLinkOnly(payment)) throw new Error("Payment reference cannot be a Payment Link only. Use paid Stripe transaction evidence or approved manual evidence.");
if (!validPayment(payment)) throw new Error("Payment reference must look like a paid Stripe reference, receipt URL, invoice URL, checkout session, or approved manual reference.");
if (!validDate(date)) throw new Error("Date must use YYYY-MM-DD.");
if (!customerSlug) throw new Error("Customer must contain usable letters or numbers.");
if (!packageSlug) throw new Error("Package must contain usable letters or numbers.");

for (const [label, value] of Object.entries({ customer, packageName, contact, payment, date })) {
  if (hasPlaceholder(value)) throw new Error(`Replace template placeholder before paid handoff: ${label}.`);
}

const paymentEvidence = verifyPaymentEvidence(args["payment-evidence"]);
const evidenceMatches = [
  ["customerCompany", customer],
  ["packageName", packageName],
  ["technicalContact", contact],
  ["paymentReference", payment]
];

for (const [key, expected] of evidenceMatches) {
  if (normalize(paymentEvidence.data[key]) !== normalize(expected)) {
    throw new Error(`Payment evidence ${key} does not match the approved handoff packet.`);
  }
}

assertDoesNotExist("Handoff manifest", manifestPath);
assertDoesNotExist("Pipeline status JSON", pipelineStatusPath);
assertDoesNotExist("Pipeline status CSV", pipelineCsvPath);
assertDoesNotExist("Intake draft", intakeDraftPath);

runNode([
  "scripts/create-customer-workspace.mjs",
  "--called-from-handoff",
  "true",
  "--customer",
  customer,
  "--date",
  date,
  "--root",
  workspaceRoot
]);

runNode([
  "scripts/create-first-paid-audit-work-order.mjs",
  "--called-from-handoff",
  "true",
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
  paymentEvidencePath: paymentEvidence.resolved,
  safeIntakePath: paymentEvidence.data.safeIntakePath,
  workspaceRoot,
  workOrderRoot,
  customerCommsRoot: commsRoot,
  pipelineStatusRoot: statusRoot,
  noCustomerSecretsInPublicRepo: true
};

const intakeRecipient = validEmail(contact) ? contact : "[approve exact recipient email before sending]";
const intakeDraft = [
  "DRAFT ONLY. Do not send until the exact recipient and exact final content are approved in the same turn.",
  "",
  `To: ${intakeRecipient}`,
  "Subject: MCPScan audit intake",
  "",
  "Hi there,",
  "",
  `Thanks for purchasing ${packageName} for ${customer}.`,
  "",
  "The audit clock starts after intake materials are complete. Please begin with sanitized materials:",
  "",
  "- MCP server/config list",
  "- sanitized MCP configs",
  "- admin policy screenshots or exports",
  "- known launch/security review deadline",
  "- any tools that should be explicitly out of scope",
  "",
  "Secure intake guidance:",
  paymentEvidence.data.safeIntakePath,
  "",
  "Please do not send production credentials, active tokens, customer data, or sensitive files through email or public issues. Please only submit systems and materials you are authorized to include in the agreed scope.",
  "",
  "Thanks,",
  "MCPScan",
  "",
  "Private operator note:",
  `Workspace root: ${workspaceRoot}`,
  "Keep customer material outside the public repo.",
  ""
].join("\n");

const pipelineStatus = {
  date,
  stage: "Paid",
  account: customer,
  package: packageName,
  technicalContact: contact,
  paymentReference: payment,
  paymentEvidencePath: paymentEvidence.resolved,
  safeIntakePath: paymentEvidence.data.safeIntakePath,
  paymentStatus: "Paid",
  deliveryStatus: "Workspace created",
  nextAction: "Review and approve the draft-only intake start message, confirm secure handoff, and complete client acceptance before sending.",
  workspaceRoot,
  workOrderRoot,
  intakeDraftPath,
  publicRepoSecretStatus: "No customer secrets stored in public repo."
};

const pipelineCsvHeader = [
  "date",
  "stage",
  "account",
  "package",
  "technical_contact",
  "payment_reference",
  "payment_evidence_path",
  "safe_intake_path",
  "payment_status",
  "delivery_status",
  "next_action",
  "workspace_root",
  "work_order_root",
  "intake_draft_path",
  "public_repo_secret_status"
];

const pipelineCsvRow = [
  pipelineStatus.date,
  pipelineStatus.stage,
  pipelineStatus.account,
  pipelineStatus.package,
  pipelineStatus.technicalContact,
  pipelineStatus.paymentReference,
  pipelineStatus.paymentEvidencePath,
  pipelineStatus.safeIntakePath,
  pipelineStatus.paymentStatus,
  pipelineStatus.deliveryStatus,
  pipelineStatus.nextAction,
  pipelineStatus.workspaceRoot,
  pipelineStatus.workOrderRoot,
  pipelineStatus.intakeDraftPath,
  pipelineStatus.publicRepoSecretStatus
];

fs.mkdirSync(baseDir, { recursive: true });
fs.mkdirSync(statusRoot, { recursive: true });
fs.mkdirSync(commsRoot, { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(pipelineStatusPath, `${JSON.stringify(pipelineStatus, null, 2)}\n`);
fs.writeFileSync(
  pipelineCsvPath,
  `${pipelineCsvHeader.map(csvCell).join(",")}\n${pipelineCsvRow.map(csvCell).join(",")}\n`
);
fs.writeFileSync(intakeDraftPath, intakeDraft, "utf8");

console.log("Created paid audit handoff.");
console.log(baseDir);
console.log(`Draft-only intake message: ${intakeDraftPath}`);
