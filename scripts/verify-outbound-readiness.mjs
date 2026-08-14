#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const candidateFile = "sales/recipient-candidates-2026-08-14.csv";
const pipelineFile = "sales/first-account-pipeline-2026-08-14.csv";
const contactRouteFile = "sales/first-10-contact-routes-2026-08-14.csv";
const approvalQueueFile = "sales/outreach-approval-queue.md";
const requiredOutboundFiles = [
  "docs/FINAL_OUTBOUND_COMPOSER.md",
  "docs/CONTACT_ROUTE_OUTBOUND_PACKETS.md",
  "docs/APPROVED_REPLY_STAGING.md",
  "docs/APPROVED_SEND_LOGGING.md",
  "docs/BATCH_SEND_LOGGING.md",
  "docs/FOLLOW_UP_APPROVAL_COMPOSER.md",
  "docs/PRIVATE_REVENUE_SNAPSHOT.md",
  "sales/reply-to-close-packet.md",
  "sales/daily-revenue-command.md",
  "sales/outreach-approval-queue.md",
  "sales/first-10-contact-routes-2026-08-14.csv",
  "sales/first-10-route-approval-packet-2026-08-14.md",
  "scripts/compose-final-outbound.mjs",
  "scripts/compose-contact-route-outbound.mjs",
  "scripts/build-first-10-route-approval-packet.mjs",
  "scripts/generate-outbound-approval-queue.mjs",
  "scripts/stage-approved-route-packet.mjs",
  "scripts/stage-approved-outbound.mjs",
  "scripts/open-first-10-outbound-approval.mjs",
  "scripts/open-first-send-readiness.mjs",
  "scripts/open-reply-to-close-review.mjs",
  "scripts/stage-approved-reply.mjs",
  "scripts/log-approved-send.mjs",
  "scripts/log-approved-route-batch-sends.mjs",
  "scripts/compose-follow-up-approval.mjs",
  "scripts/build-revenue-snapshot.mjs",
  "scripts/verify-first-send-gates.mjs"
];
const strict = process.argv.includes("--strict");
const allowedChannels = new Set(["Email", "LinkedIn", "Contact form", "Warm intro", "Email or LinkedIn"]);
const allowedRouteChannels = new Set(["Trust center", "Vulnerability disclosure", "Security inbox", "Contact form", "Trust inbox", "Official contact route"]);
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

function validContactRoute(value) {
  return validUrl(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
const routes = exists(contactRouteFile) ? readRecords(contactRouteFile) : [];
const candidateAccounts = new Set(candidates.map((row) => row.account));
const pipelineAccounts = new Set(pipeline.map((row) => row.account));
const routeAccounts = new Set(routes.map((row) => row.account));
const missingCandidateRows = [...pipelineAccounts].filter((account) => !candidateAccounts.has(account));
const missingRouteRows = [...pipelineAccounts].filter((account) => !routeAccounts.has(account));

results.push(candidates.length >= 10 ? result("pass", "recipient candidate rows", `${candidates.length} rows`) : result("warn", "recipient candidate rows", `${candidates.length} rows`));
results.push(missingCandidateRows.length === 0 ? result("pass", "pipeline account coverage", "all first-wave accounts have candidate rows") : result("fail", "pipeline account coverage", missingCandidateRows.join(", ")));
results.push(routes.length >= 10 ? result("pass", "contact route rows", `${routes.length} rows`) : result("warn", "contact route rows", `${routes.length} rows`));
results.push(missingRouteRows.length === 0 ? result("pass", "contact route coverage", "all first-wave accounts have contact routes") : result("fail", "contact route coverage", missingRouteRows.join(", ")));

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

for (const [index, row] of routes.entries()) {
  const label = `route ${index + 1}. ${row.account || "missing account"}`;
  if (!row.account) results.push(result("fail", label, "missing account"));
  if (!allowedRouteChannels.has(row.channel)) results.push(result("fail", label, `unsupported route channel: ${row.channel}`));
  if (!validContactRoute(row.contact_route_url)) results.push(result("fail", label, "contact route must be an email or HTTP/HTTPS URL"));
  if (!validUrl(row.source_url)) results.push(result("fail", label, "source URL must be HTTP or HTTPS"));
  if (!row.confidence) results.push(result("warn", label, "missing confidence"));
  if (row.contact_route_url && row.contact_route_url.includes("data-broker")) {
    results.push(result("fail", label, "data broker route is not allowed"));
  }
}

if (exists("sales/first-10-route-approval-packet-2026-08-14.md")) {
  const packet = fs.readFileSync(path.join(root, "sales/first-10-route-approval-packet-2026-08-14.md"), "utf8");
  const approvalCount = (packet.match(/I approve staging this exact MCPScan outbound message/g) ?? []).length;
  const noAutoCount = (packet.match(/Do not send automatically/g) ?? []).length;
  const hasAllTenApproval = packet.includes("I approve staging all 10 exact MCPScan route outbound messages.");
  results.push(approvalCount === 10 ? result("pass", "route approval packet approvals", "10 approval blocks") : result("fail", "route approval packet approvals", `${approvalCount} approval blocks`));
  results.push(hasAllTenApproval ? result("pass", "route approval packet all-10 approval", "all-10 approval phrase present") : result("fail", "route approval packet all-10 approval", "missing all-10 approval phrase"));
  results.push(noAutoCount === 11 ? result("pass", "route approval packet no-auto-send", "10 block statements plus all-10 guard") : result("fail", "route approval packet no-auto-send", `${noAutoCount} no-auto-send statements`));
  for (const account of pipelineAccounts) {
    results.push(packet.includes(`## ${account}`) ? result("pass", `route packet account: ${account}`) : result("fail", `route packet account: ${account}`, "missing"));
  }
}

if (exists(approvalQueueFile)) {
  const queue = fs.readFileSync(path.join(root, approvalQueueFile), "utf8");
  const queueItems = (queue.match(/^## \d+\. /gm) ?? []).length;
  const queueNoSendCount = (queue.match(/Do not send without same-turn approval/g) ?? []).length;
  results.push(queueItems === 10 ? result("pass", "outreach approval queue items", "10 draft items") : result("fail", "outreach approval queue items", `${queueItems} draft items`));
  results.push(queueNoSendCount === 10 ? result("pass", "outreach approval queue send guard", "10 draft guards") : result("fail", "outreach approval queue send guard", `${queueNoSendCount} draft guards`));
  results.push(!queue.includes("undefined") ? result("pass", "outreach approval queue fields", "no undefined values") : result("fail", "outreach approval queue fields", "contains undefined"));
  for (const account of pipelineAccounts) {
    results.push(queue.includes(`## ${[...pipelineAccounts].indexOf(account) + 1}. ${account}`) || queue.includes(`. ${account}`) ? result("pass", `queue account: ${account}`) : result("fail", `queue account: ${account}`, "missing"));
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
