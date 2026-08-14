#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const candidateFile = "sales/recipient-candidates-2026-08-14.csv";
const pipelineFile = "sales/first-account-pipeline-2026-08-14.csv";
const requiredOutboundFiles = [
  "docs/FINAL_OUTBOUND_COMPOSER.md",
  "sales/reply-to-close-packet.md",
  "sales/daily-revenue-command.md",
  "scripts/compose-final-outbound.mjs",
  "scripts/stage-approved-outbound.mjs"
];
const strict = process.argv.includes("--strict");
const allowedChannels = new Set(["Email", "LinkedIn", "Contact form", "Warm intro", "Email or LinkedIn"]);
const allowedApprovalStates = new Set(["Candidate needed", "Ready for founder approval", "Approved to stage", "Staged", "Rejected"]);

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
  return body.map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ""])));
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function readRecords(file) {
  return toRecords(parseCsv(fs.readFileSync(path.join(root, file), "utf8")));
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

function validUrl(value) {
  return /^https?:\/\/\S+$/i.test(value);
}

const results = [];

for (const file of requiredOutboundFiles) {
  results.push(exists(file) ? result("pass", `required outbound file: ${file}`) : result("fail", `required outbound file: ${file}`, "missing"));
}

if (!exists(candidateFile)) {
  results.push(result("fail", candidateFile, "missing"));
  print(results);
  process.exit(1);
}

if (!exists(pipelineFile)) {
  results.push(result("fail", pipelineFile, "missing"));
  print(results);
  process.exit(1);
}

const candidates = readRecords(candidateFile);
const pipeline = readRecords(pipelineFile);
const candidateAccounts = new Set(candidates.map((row) => row.account));
const pipelineAccounts = new Set(pipeline.map((row) => row.account));
const missingCandidateRows = [...pipelineAccounts].filter((account) => !candidateAccounts.has(account));

results.push(candidates.length >= 10 ? result("pass", "recipient candidate rows", `${candidates.length} rows`) : result("warn", "recipient candidate rows", `${candidates.length} rows`));
results.push(missingCandidateRows.length === 0 ? result("pass", "pipeline account coverage", "all first-wave accounts have candidate rows") : result("fail", "pipeline account coverage", missingCandidateRows.join(", ")));

for (const [index, row] of candidates.entries()) {
  const label = `${index + 1}. ${row.account || "missing account"}`;
  if (!row.account) results.push(result("fail", label, "missing account"));
  if (!row.company) results.push(result("fail", label, "missing company"));
  if (!allowedChannels.has(row.channel)) results.push(result("fail", label, `unsupported channel: ${row.channel}`));
  if (!allowedApprovalStates.has(row.approval_status)) results.push(result("fail", label, `unsupported approval status: ${row.approval_status}`));
  if (!validUrl(row.public_evidence_url)) results.push(result("fail", label, "public evidence URL must be HTTP or HTTPS"));
  if (!row.message_id) results.push(result("fail", label, "missing message_id"));

  const hasCandidate = Boolean(row.candidate_name && row.contact_or_profile_url);
  if (row.approval_status === "Candidate needed" && !hasCandidate) {
    results.push(result("warn", label, "still needs exact recipient"));
  }
  if (row.approval_status !== "Candidate needed" && !hasCandidate) {
    results.push(result("fail", label, "approval state requires candidate name and contact or profile URL"));
  }
  if (row.contact_or_profile_url && row.contact_or_profile_url.includes("data-broker")) {
    results.push(result("fail", label, "data broker contact source is not allowed"));
  }
}

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (strict && (failures.length > 0 || warnings.length > 0)) {
  process.exit(1);
}

if (failures.length > 0) {
  process.exit(1);
}
