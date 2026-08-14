#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function result(kind, label, detail = "") {
  return { kind, label, detail };
}

function print(results) {
  for (const item of results) {
    const mark = item.kind === "pass" ? "PASS" : item.kind === "warn" ? "WARN" : "FAIL";
    console.log(`${mark} ${item.label}${item.detail ? ` - ${item.detail}` : ""}`);
  }
}

const requiredFiles = [
  "docs/FIRST_PAID_AUDIT_GO_NO_GO.md",
  "docs/FIRST_PAID_AUDIT_WORK_ORDER.md",
  "docs/METHODOLOGY_AND_LIMITATIONS.md",
  "docs/SEVERITY_RUBRIC.md",
  "docs/PAYMENT_TO_DELIVERY_SOP.md",
  "docs/PAID_AUDIT_START_AUTOMATION.md",
  "scripts/create-first-paid-audit-work-order.mjs",
  "scripts/create-paid-audit-handoff.mjs",
  "scripts/create-payment-evidence.mjs",
  "scripts/verify-payment-evidence.mjs",
  "scripts/verify-customer-workspace-completion.mjs",
  "scripts/open-paid-audit-handoff.mjs",
  "scripts/compose-post-payment-intake.mjs",
  "ops/paid-audit-handoff-builder.html",
  "ops/findings-call-scheduler.html",
  "sales/paid-audit-handoff-approval-packet.md",
  "sales/payment-confirmation-evidence.template.json",
  "docs/PAID_AUDIT_RUNBOOK.md",
  "delivery/customer-workspace-template/client-acceptance.md",
  "delivery/customer-workspace-template/evidence-register.csv",
  "delivery/customer-workspace-template/redaction-checklist.md",
  "delivery/customer-workspace-template/qa-signoff.md",
  "delivery/customer-workspace-template/retention-and-deletion-log.md",
  "delivery/customer-workspace-template/report-template.md",
  "delivery/customer-workspace-template/buyer-facing-summary.md",
  "delivery/customer-workspace-template/delivery-email-cover.md",
  "delivery/customer-workspace-template/findings-tracker.csv"
];

const results = [];

for (const file of requiredFiles) {
  results.push(exists(file) ? result("pass", `required file: ${file}`) : result("fail", `required file: ${file}`, "missing"));
}

if (exists("docs/PAID_AUDIT_RUNBOOK.md")) {
  const runbook = read("docs/PAID_AUDIT_RUNBOOK.md");
  results.push(runbook.includes("mcpscan scan --config") ? result("fail", "CLI command syntax", "runbook still uses removed --config pattern") : result("pass", "CLI command syntax", "runbook uses positional config pattern"));
}

if (exists("delivery/customer-workspace-template/redaction-checklist.md")) {
  const text = read("delivery/customer-workspace-template/redaction-checklist.md").toLowerCase();
  results.push(text.includes("no active api keys") && text.includes("no active tokens") ? result("pass", "redaction checklist", "secret checks present") : result("fail", "redaction checklist", "missing secret checks"));
}

if (exists("delivery/customer-workspace-template/qa-signoff.md")) {
  const text = read("delivery/customer-workspace-template/qa-signoff.md").toLowerCase();
  results.push(text.includes("severity matches") && text.includes("methodology and limitations") ? result("pass", "QA signoff", "severity and limitations checks present") : result("fail", "QA signoff", "missing report QA checks"));
}

if (exists("delivery/customer-workspace-template/client-acceptance.md")) {
  const text = read("delivery/customer-workspace-template/client-acceptance.md").toLowerCase();
  results.push(text.includes("authorized") && text.includes("refund boundary") ? result("pass", "client acceptance", "authorization and commercial checks present") : result("fail", "client acceptance", "missing authorization or refund checks"));
}

if (exists("sales/payment-confirmation-evidence.template.json")) {
  const template = read("sales/payment-confirmation-evidence.template.json");
  const requiredPaymentFields = [
    "paymentConfirmed",
    "approvedForPrivateWorkspace",
    "stripeDashboardPaymentConfirmed",
    "stripePaidObjectType",
    "noStripeSecrets",
    "noProductionSecrets",
    "noCustomerData",
    "noPublicRepoStorage",
    "approvedBy",
    "approvalTimestamp",
    "approvalSource"
  ];
  const hasRequiredPaymentFields = requiredPaymentFields.every((field) => template.includes(`"${field}"`));
  results.push(hasRequiredPaymentFields ? result("pass", "payment evidence template", "public-safe confirmation fields present") : result("fail", "payment evidence template", "missing confirmation fields"));
}

if (exists("scripts/verify-payment-evidence.mjs") && exists("scripts/create-payment-evidence.mjs")) {
  const paymentGate = `${read("scripts/verify-payment-evidence.mjs")}\n${read("scripts/create-payment-evidence.mjs")}`;
  const requiredManualPaymentMarkers = [
    "Manual payment evidence missing required field",
    "Payment evidence cannot use a Payment Link only",
    "stripeDashboardPaymentConfirmed",
    "stripePaidObjectType",
    "approvedBy",
    "approvalTimestamp",
    "approvalSource",
    "approved-by",
    "stripe-dashboard-payment-confirmed",
    "stripe-paid-object-type"
  ];
  const missingManualPaymentMarkers = requiredManualPaymentMarkers.filter((marker) => !paymentGate.includes(marker));
  results.push(
    missingManualPaymentMarkers.length === 0
      ? result("pass", "manual payment evidence gate", "manual payment evidence requires approver, timestamp, and source")
      : result("fail", "manual payment evidence gate", missingManualPaymentMarkers.join(", "))
  );
}

if (exists("scripts/create-paid-audit-handoff.mjs")) {
  const handoff = read("scripts/create-paid-audit-handoff.mjs");
  const requiredHandoffMarkers = [
    "Missing required --payment-evidence path",
    "scripts/verify-payment-evidence.mjs",
    "Payment evidence ${key} does not match",
    "paymentEvidencePath",
    "safeIntakePath",
    "Payment reference cannot be a Payment Link only"
  ];
  const missingHandoffMarkers = requiredHandoffMarkers.filter((marker) => !handoff.includes(marker));
  results.push(
    missingHandoffMarkers.length === 0
      ? result("pass", "paid handoff payment gate", "handoff requires verified matching payment evidence")
      : result("fail", "paid handoff payment gate", missingHandoffMarkers.join(", "))
  );
}

if (exists("scripts/compose-post-payment-intake.mjs")) {
  const intakeComposer = read("scripts/compose-post-payment-intake.mjs");
  const requiredComposerMarkers = [
    "recipient-email",
    "safeIntakePath",
    "validEmail(contact) ? contact",
    "To: ${recipient}"
  ];
  const missingComposerMarkers = requiredComposerMarkers.filter((marker) => !intakeComposer.includes(marker));
  results.push(
    missingComposerMarkers.length === 0
      ? result("pass", "post-payment intake composer safety", "URL contacts require an approved recipient email and exact safe intake path")
      : result("fail", "post-payment intake composer safety", missingComposerMarkers.join(", "))
  );
}

if (exists("scripts/run-delivery-dry-run.mjs")) {
  const dryRun = read("scripts/run-delivery-dry-run.mjs");
  results.push(
    dryRun.includes("--payment-evidence") && dryRun.includes("payment-confirmation-evidence.json")
      ? result("pass", "delivery dry run payment gate", "rehearsal exercises evidence-gated handoff")
      : result("fail", "delivery dry run payment gate", "dry run does not pass payment evidence into the handoff")
  );
}

if (exists("scripts/verify-customer-workspace-completion.mjs") && exists("package.json")) {
  const workspaceVerifier = read("scripts/verify-customer-workspace-completion.mjs");
  const packageJson = read("package.json");
  const requiredWorkspaceMarkers = [
    "Customer workspace completion verification must point outside the public MCPScan repo",
    "client acceptance is complete",
    "findings tracker is filled and not draft",
    "evidence register is filled",
    "QA signoff is complete",
    "findings call agenda is prepared",
    "re-scan instructions are prepared"
  ];
  const missingWorkspaceMarkers = requiredWorkspaceMarkers.filter((marker) => !workspaceVerifier.includes(marker));
  results.push(
    missingWorkspaceMarkers.length === 0 && packageJson.includes("\"delivery:verify-workspace\"")
      ? result("pass", "customer workspace completion verifier", "completed private workspace can be checked before delivery")
      : result("fail", "customer workspace completion verifier", missingWorkspaceMarkers.join(", ") || "missing npm script")
  );
}

if (exists("scripts/create-customer-workspace.mjs") && exists("scripts/create-first-paid-audit-work-order.mjs") && exists("scripts/create-paid-audit-handoff.mjs")) {
  const workspace = read("scripts/create-customer-workspace.mjs");
  const workOrder = read("scripts/create-first-paid-audit-work-order.mjs");
  const handoff = read("scripts/create-paid-audit-handoff.mjs");
  const requiredInternalMarkers = [
    "called-from-handoff",
    "Refusing to create a live customer workspace directly.",
    "Refusing to create a live paid audit work order directly.",
    "The private workspace is created by the evidence-backed paid handoff."
  ];
  const combined = `${workspace}\n${workOrder}\n${handoff}`;
  const missingInternalMarkers = requiredInternalMarkers.filter((marker) => !combined.includes(marker));
  results.push(
    missingInternalMarkers.length === 0
      ? result("pass", "handoff-internal delivery builders", "workspace and work-order commands cannot bypass the paid handoff gate")
      : result("fail", "handoff-internal delivery builders", missingInternalMarkers.join(", "))
  );
}

if (exists("delivery/customer-workspace-template/retention-and-deletion-log.md")) {
  const text = read("delivery/customer-workspace-template/retention-and-deletion-log.md").toLowerCase();
  results.push(text.includes("deletion confirmation") && text.includes("retention target") ? result("pass", "retention and deletion", "retention and deletion fields present") : result("fail", "retention and deletion", "missing retention fields"));
}

if (exists("ops/findings-call-scheduler.html")) {
  const text = read("ops/findings-call-scheduler.html");
  const requiredMarkers = [
    "Booking link",
    "Three time windows",
    "Please do not send production credentials",
    "Draft-Only Message"
  ];
  const missingMarkers = requiredMarkers.filter((marker) => !text.includes(marker));
  results.push(missingMarkers.length === 0 ? result("pass", "findings call scheduler", "booking link and manual window paths present") : result("fail", "findings call scheduler", missingMarkers.join(", ")));
}

const scanRoots = ["docs", "delivery", "scripts", "sales", "ops"];
const files = [];
function walk(entry) {
  const full = path.join(root, entry);
  if (!fs.existsSync(full)) return;
  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(full)) {
      if (child === "node_modules" || child === ".git" || child === "dist") continue;
      walk(path.join(entry, child));
    }
    return;
  }
  if (stat.isFile() && [".md", ".csv", ".mjs"].includes(path.extname(entry))) files.push(entry);
}

for (const entry of scanRoots) walk(entry);
const banned = files.filter((file) => read(file).includes("\u2014"));
results.push(banned.length === 0 ? result("pass", "writing rule: no em dash", "delivery artifacts are clean") : result("fail", "writing rule: no em dash", banned.join(", ")));

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (failures.length > 0) process.exit(1);
