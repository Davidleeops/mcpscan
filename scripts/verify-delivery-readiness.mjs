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
  "scripts/create-first-paid-audit-work-order.mjs",
  "scripts/create-paid-audit-handoff.mjs",
  "scripts/compose-post-payment-intake.mjs",
  "sales/paid-audit-handoff-approval-packet.md",
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

if (exists("delivery/customer-workspace-template/retention-and-deletion-log.md")) {
  const text = read("delivery/customer-workspace-template/retention-and-deletion-log.md").toLowerCase();
  results.push(text.includes("deletion confirmation") && text.includes("retention target") ? result("pass", "retention and deletion", "retention and deletion fields present") : result("fail", "retention and deletion", "missing retention fields"));
}

const scanRoots = ["docs", "delivery", "scripts"];
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
