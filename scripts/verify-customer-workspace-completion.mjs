#!/usr/bin/env node
import fs from "node:fs";
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

function pass(message) {
  console.log(`PASS ${message}`);
}

function resolveOutsideRepo(value, label) {
  if (!value) fail(`Missing required --${label} path.`);
  const resolved = path.resolve(value);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail("Customer workspace completion verification must point outside the public MCPScan repo.");
  }
  if (!fs.existsSync(resolved)) fail(`Workspace path does not exist: ${resolved}`);
  return resolved;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function noPlaceholders(label, text) {
  if (/\{\{[^}]+\}\}/.test(text)) fail(`${label} still contains template placeholders.`);
}

function noUncheckedBoxes(label, text) {
  if (/- \[ \]/.test(text)) fail(`${label} still has unchecked completion boxes.`);
}

function requireText(label, text, markers) {
  const missing = markers.filter((marker) => !text.toLowerCase().includes(marker.toLowerCase()));
  if (missing.length) fail(`${label} missing required markers: ${missing.join(", ")}.`);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted && char === '"' && next === '"') {
      value += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (!quoted && char === ",") {
      row.push(value);
      value = "";
      continue;
    }
    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((field) => field.length > 0)) rows.push(row);
      row = [];
      value = "";
      continue;
    }
    value += char;
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

function toRecords(rows) {
  const [header, ...body] = rows;
  if (!header) return [];
  return body.map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ""])));
}

function file(workspace, name) {
  const direct = path.join(workspace, name);
  if (fs.existsSync(direct)) return direct;
  const report = path.join(workspace, "04-report", name);
  if (fs.existsSync(report)) return report;
  const delivery = path.join(workspace, "05-delivery", name);
  if (fs.existsSync(delivery)) return delivery;
  fail(`Missing completed workspace file: ${name}.`);
}

const args = parseArgs(process.argv.slice(2));
const workspace = resolveOutsideRepo(args.workspace, "workspace");
const packageName = String(args.package ?? "").trim();
if (!/quick|launch|enterprise/i.test(packageName)) fail("Use --package with Quick, Launch, or Enterprise.");

const required = [
  "client-acceptance.md",
  "report-template.md",
  "buyer-facing-summary.md",
  "findings-tracker.csv",
  "evidence-register.csv",
  "redaction-checklist.md",
  "qa-signoff.md",
  "delivery-email-cover.md",
  "retention-and-deletion-log.md"
];

const paths = Object.fromEntries(required.map((name) => [name, file(workspace, name)]));

const acceptance = read(paths["client-acceptance.md"]);
noPlaceholders("client acceptance", acceptance);
noUncheckedBoxes("client acceptance", acceptance);
requireText("client acceptance", acceptance, ["authorized", "secure handoff path is agreed", "refund boundary"]);
pass("client acceptance is complete");

const report = read(paths["report-template.md"]);
noPlaceholders("report", report);
requireText("report", report, ["Readiness Decision", "Scope Reviewed", "Detailed Findings", "Method", "Limitations"]);
pass("report has no placeholders and includes required sections");

const summary = read(paths["buyer-facing-summary.md"]);
noPlaceholders("buyer-facing summary", summary);
requireText("buyer-facing summary", summary, ["Approval Recommendation", "What Was Reviewed", "Key Findings", "Limitations"]);
pass("buyer-facing summary has no placeholders and includes required sections");

const findings = toRecords(parseCsv(read(paths["findings-tracker.csv"])));
if (findings.length === 0) fail("findings tracker must include at least one finding row.");
for (const row of findings) {
  for (const key of ["id", "severity", "status", "area", "finding", "evidence", "risk", "recommendation", "customer_visible"]) {
    if (!String(row[key] ?? "").trim()) fail(`findings tracker row ${row.id || "unknown"} missing ${key}.`);
  }
  if (/draft/i.test(row.status)) fail(`findings tracker row ${row.id} is still Draft.`);
}
pass("findings tracker is filled and not draft");

const evidence = toRecords(parseCsv(read(paths["evidence-register.csv"])));
if (evidence.length === 0) fail("evidence register must include at least one evidence row.");
for (const row of evidence) {
  for (const key of ["id", "finding_id", "evidence_type", "source_file_or_link", "observed_value_summary", "customer_visible"]) {
    if (!String(row[key] ?? "").trim()) fail(`evidence register row ${row.id || "unknown"} missing ${key}.`);
  }
}
pass("evidence register is filled");

const redaction = read(paths["redaction-checklist.md"]);
noPlaceholders("redaction checklist", redaction);
noUncheckedBoxes("redaction checklist", redaction);
requireText("redaction checklist", redaction, ["no active api keys", "no active tokens"]);
pass("redaction checklist is complete");

const qa = read(paths["qa-signoff.md"]);
noPlaceholders("QA signoff", qa);
noUncheckedBoxes("QA signoff", qa);
requireText("QA signoff", qa, ["approved_for_delivery", "severity matches", "methodology and limitations"]);
if (/launch|enterprise/i.test(packageName)) {
  requireText("QA signoff", qa, ["findings call agenda is prepared", "re-scan instructions are prepared"]);
}
pass("QA signoff is complete");

const cover = read(paths["delivery-email-cover.md"]);
noPlaceholders("delivery cover note", cover);
requireText("delivery cover note", cover, ["Subject:", "readiness audit report", "Please do not reply with production credentials"]);
pass("delivery cover note is ready");

const retention = read(paths["retention-and-deletion-log.md"]);
noPlaceholders("retention and deletion log", retention);
requireText("retention and deletion log", retention, ["retention target", "deletion confirmation"]);
pass("retention and deletion log is initialized");

pass("customer workspace completion verification passed");
