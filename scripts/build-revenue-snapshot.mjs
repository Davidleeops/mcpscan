#!/usr/bin/env node
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

function assertOutsideRepo(target, label) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail(`Refusing to read or write ${label} inside the public MCPScan repo.`);
  }
  return resolved;
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function readJsonFiles(start, fileName) {
  const files = [];
  function walk(entry) {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry)) walk(path.join(entry, child));
      return;
    }
    if (stat.isFile() && path.basename(entry) === fileName) files.push(entry);
  }
  walk(start);
  return files.map((file) => ({ file, data: JSON.parse(fs.readFileSync(file, "utf8")) }));
}

function readPipelineStatuses(start) {
  const files = [];
  function walk(entry) {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry)) walk(path.join(entry, child));
      return;
    }
    if (stat.isFile() && entry.endsWith("_pipeline-status.json")) files.push(entry);
  }
  walk(start);
  return files.map((file) => ({ file, data: JSON.parse(fs.readFileSync(file, "utf8")) }));
}

function dueFollowUps(sendLogs, asOf) {
  const due = [];
  for (const item of sendLogs) {
    const log = item.data;
    for (const followUp of log.followUps ?? []) {
      if (followUp.status === "Not sent" && followUp.dueDate <= asOf) {
        due.push({
          account: log.account,
          channel: log.channel,
          recipient: log.recipient,
          contact: log.contact,
          source: log.source,
          followUpStep: followUp.step,
          dueDate: followUp.dueDate,
          sendLog: item.file,
          nextAction: `Compose approval packet for ${followUp.step}.`
        });
      }
    }
  }
  return due.sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.account.localeCompare(b.account));
}

const args = parseArgs(process.argv.slice(2));
const asOf = args.date ?? today();
if (!validDate(asOf)) fail("Snapshot date must use YYYY-MM-DD.");

const sendRoot = assertOutsideRepo(args["send-root"] ?? path.join(os.homedir(), "MCPScan Revenue Logs"), "private revenue logs");
const paidRoot = assertOutsideRepo(args["paid-root"] ?? path.join(os.homedir(), "MCPScan Paid Audits"), "private paid audit logs");
const outputRoot = assertOutsideRepo(args.output ?? path.join(os.homedir(), "MCPScan Revenue Snapshots"), "private revenue snapshots");

const sendLogs = fs.existsSync(sendRoot) ? readJsonFiles(sendRoot, "send-log.json") : [];
const paidStatuses = fs.existsSync(paidRoot) ? readPipelineStatuses(paidRoot) : [];
const due = dueFollowUps(sendLogs, asOf);

const snapshot = {
  generatedAt: new Date().toISOString(),
  asOf,
  sendRoot,
  paidRoot,
  totals: {
    manualSendsLogged: sendLogs.length,
    paidAuditStatuses: paidStatuses.length,
    dueFollowUps: due.length
  },
  dueFollowUps: due,
  paidAudits: paidStatuses.map((item) => ({
    account: item.data.account,
    package: item.data.package,
    paymentStatus: item.data.paymentStatus,
    deliveryStatus: item.data.deliveryStatus,
    nextAction: item.data.nextAction,
    statusFile: item.file
  }))
};

const outputDir = path.join(outputRoot, asOf);
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "revenue-snapshot.json"), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

const dueHeader = ["due_date", "account", "channel", "recipient", "contact", "source", "follow_up_step", "send_log", "next_action"];
const dueRows = due.map((item) => [
  item.dueDate,
  item.account,
  item.channel,
  item.recipient,
  item.contact,
  item.source,
  item.followUpStep,
  item.sendLog,
  item.nextAction
]);

fs.writeFileSync(
  path.join(outputDir, "due-follow-ups.csv"),
  `${dueHeader.map(csvCell).join(",")}\n${dueRows.map((row) => row.map(csvCell).join(",")).join("\n")}${dueRows.length ? "\n" : ""}`,
  "utf8"
);

console.log("Built private revenue snapshot.");
console.log(outputDir);
console.log(`Due follow-ups: ${due.length}`);
console.log(`Paid audit statuses: ${paidStatuses.length}`);
