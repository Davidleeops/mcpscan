#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const date = new Date().toISOString().slice(0, 10);
const dryRunRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-delivery-dry-run."));
const customer = "Sample Buyer Co";
const packageName = "MCP Launch Audit";
const fixture = path.join(root, "packages", "cli", "test", "fixtures", "commercial-risk-config.json");
const cli = path.join(root, "packages", "cli", "dist", "index.js");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit"
  });
  if (result.status !== 0) {
    if (options.capture) {
      process.stdout.write(result.stdout ?? "");
      process.stderr.write(result.stderr ?? "");
    }
    fail(`${command} ${args.join(" ")} failed`);
  }
  return result;
}

function assertFile(file) {
  if (!fs.existsSync(file)) fail(`Expected file was not created: ${file}`);
  const stat = fs.statSync(file);
  if (stat.size === 0) fail(`Expected file is empty: ${file}`);
}

if (!fs.existsSync(fixture)) {
  fail("Commercial risk fixture is missing.");
}

if (!fs.existsSync(cli)) {
  run("npm", ["run", "build"]);
}

const packet = path.join(dryRunRoot, "approved-paid-audit-handoff.txt");
const paymentEvidence = path.join(dryRunRoot, "payment-confirmation-evidence.json");
const privateOutput = path.join(dryRunRoot, "private-output");

fs.writeFileSync(
  packet,
  [
    "I approve creating this MCPScan paid audit handoff.",
    "",
    `Customer: ${customer}`,
    `Package: ${packageName}`,
    "Technical contact: buyer@example.com",
    "Payment reference: pi_dry_run_12345",
    `Date: ${date}`,
    "",
    "Approved action:",
    "Create the private customer workspace and first paid audit work order outside the public MCPScan repo. Do not store customer secrets in the public repo.",
    ""
  ].join("\n"),
  "utf8"
);

fs.writeFileSync(
  paymentEvidence,
  `${JSON.stringify({
    customerCompany: customer,
    packageName,
    amountUsd: 1500,
    paymentProvider: "Stripe",
    paymentReference: "pi_dry_run_12345",
    paidAt: date,
    technicalContact: "buyer@example.com",
    safeIntakePath: path.join(privateOutput, "secure-intake"),
    paymentConfirmed: true,
    approvedForPrivateWorkspace: true,
    noStripeSecrets: true,
    noProductionSecrets: true,
    noCustomerData: true,
    noPublicRepoStorage: true,
    operatorInitials: "DR"
  }, null, 2)}\n`,
  "utf8"
);

run("node", [
  "scripts/verify-payment-evidence.mjs",
  "--file",
  paymentEvidence
]);

run("node", [
  "scripts/create-paid-audit-handoff.mjs",
  "--file",
  packet,
  "--root",
  privateOutput
]);

const outputStem = `${date}_sample-buyer-co_mcp-launch-audit`;
const workspace = path.join(privateOutput, "workspaces", `${date}_sample-buyer-co`, "customer-workspace");
const workOrder = path.join(privateOutput, "work-orders", outputStem, "FIRST_PAID_AUDIT_WORK_ORDER.md");
const handoffManifest = path.join(privateOutput, `${outputStem}_handoff-manifest.json`);
const pipelineStatusJson = path.join(privateOutput, "pipeline-status", `${outputStem}_pipeline-status.json`);
const pipelineStatusCsv = path.join(privateOutput, "pipeline-status", `${outputStem}_pipeline-status.csv`);
const sanitizedConfig = path.join(workspace, "01-sanitized-configs", "sanitized-mcp-config.json");
const jsonReport = path.join(workspace, "03-scan-output", "mcpscan-results.json");
const sarifReport = path.join(workspace, "03-scan-output", "mcpscan-results.sarif");
const htmlReport = path.join(workspace, "04-report", "report.html");
const markdownReport = path.join(workspace, "04-report", "findings.md");
const proof = path.join(workspace, "05-delivery", "dry-run-delivery-proof.md");
const intake = path.join(workspace, "00-intake", "dry-run-intake.md");

fs.copyFileSync(fixture, sanitizedConfig);
fs.writeFileSync(
  intake,
  [
    "# Dry-Run Intake",
    "",
    "Customer: Sample Buyer Co",
    "Package: MCP Launch Audit",
    "Scope: commercial-risk-config fixture only",
    "Authorization: internal dry run using repository fixture",
    "Customer data: none",
    "Production secrets: none",
    ""
  ].join("\n"),
  "utf8"
);

const baseScanArgs = [
  cli,
  "scan",
  sanitizedConfig,
  "--customer",
  customer,
  "--auditor",
  "MCPScan Audit Desk",
  "--engagement",
  "Dry-Run Launch Audit",
  "--notes",
  "Internal delivery rehearsal using the intentionally risky commercial fixture. No customer data is present."
];

run("node", [...baseScanArgs, "--format", "json", "--output", jsonReport], { capture: true });
run("node", [...baseScanArgs, "--format", "sarif", "--output", sarifReport], { capture: true });
run("node", [...baseScanArgs, "--format", "html", "--output", htmlReport], { capture: true });
run("node", [...baseScanArgs, "--format", "markdown", "--output", markdownReport], { capture: true });

for (const file of [paymentEvidence, workOrder, handoffManifest, pipelineStatusJson, pipelineStatusCsv, sanitizedConfig, intake, jsonReport, sarifReport, htmlReport, markdownReport]) {
  assertFile(file);
}

const parsed = JSON.parse(fs.readFileSync(jsonReport, "utf8"));
const status = JSON.parse(fs.readFileSync(pipelineStatusJson, "utf8"));
if (parsed.summary.totalChecks !== 22) {
  fail(`Expected 22 checks, got ${parsed.summary.totalChecks}`);
}

if (status.deliveryStatus !== "Workspace created" || status.paymentStatus !== "Paid") {
  fail("Pipeline status does not confirm paid workspace creation.");
}

if (!fs.readFileSync(htmlReport, "utf8").includes("Dry-Run Launch Audit")) {
  fail("HTML report does not include dry-run engagement metadata.");
}

fs.writeFileSync(
  proof,
  [
    "# MCPScan Delivery Dry-Run Proof",
    "",
    `Date: ${date}`,
    "Customer: Sample Buyer Co",
    "Package: MCP Launch Audit",
    "Input: repository commercial-risk-config fixture",
    "Customer data: none",
    "",
    "## Generated Artifacts",
    "",
    "- 00-intake/dry-run-intake.md",
    "- 01-sanitized-configs/sanitized-mcp-config.json",
    "- 03-scan-output/mcpscan-results.json",
    "- 03-scan-output/mcpscan-results.sarif",
    "- 04-report/report.html",
    "- 04-report/findings.md",
    "- private handoff manifest",
    "- public-safe payment evidence verification",
    "- private pipeline status JSON",
    "- private pipeline status CSV",
    "- first paid audit work order",
    "",
    "## Verification",
    "",
    `- Checks run: ${parsed.summary.totalChecks}`,
    `- Grade: ${parsed.summary.grade}`,
    `- Score: ${parsed.summary.score}/100`,
    "- Workspace was created outside the public repo.",
    "- No customer secrets or customer data were used.",
    ""
  ].join("\n"),
  "utf8"
);

assertFile(proof);

console.log("MCPScan delivery dry run passed.");
console.log(`Workspace: ${workspace}`);
console.log(`Proof: ${proof}`);
