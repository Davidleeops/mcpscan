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

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function requireValue(label, value) {
  const result = String(value ?? "").trim();
  if (!result) fail(`Missing ${label} in staged manifest.`);
  if (/\{\{[^}]+\}\}/.test(result)) fail(`Replace template placeholder before send logging: ${label}.`);
  return result;
}

function addBusinessDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  let remaining = days;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return date.toISOString().slice(0, 10);
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

const args = parseArgs(process.argv.slice(2));
if (!args.manifest) fail("Missing --manifest path to a staged outbound or reply manifest.");

const manifestPath = assertOutsideRepo(args.manifest, "customer or prospect send manifests");
if (!fs.existsSync(manifestPath)) fail(`Manifest not found: ${manifestPath}`);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const account = requireValue("account", manifest.account);
const channel = requireValue("channel", manifest.channel);
const recipient = requireValue("recipient", manifest.recipient);
const contact = requireValue("contact", manifest.contact);
const source = requireValue("source", manifest.source);
const sentDate = args.date ?? new Date().toISOString().slice(0, 10);
if (!validDate(sentDate)) fail("Send date must use YYYY-MM-DD.");

const baseDir = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Revenue Logs"), "revenue logs");
const logDir = path.join(baseDir, `${sentDate}_${slugify(account)}_${slugify(recipient)}`);
if (fs.existsSync(logDir)) fail(`Send log already exists: ${logDir}`);

const followUps = [
  { step: "follow-up-1", dueDate: addBusinessDays(sentDate, 2), status: "Not sent" },
  { step: "follow-up-2", dueDate: addBusinessDays(sentDate, 6), status: "Not sent" },
  { step: "final-follow-up", dueDate: addBusinessDays(sentDate, 12), status: "Not sent" }
];

const sendLog = {
  generatedAt: new Date().toISOString(),
  sentDate,
  account,
  channel,
  recipient,
  contact,
  source,
  replyType: manifest.replyType ?? "",
  stagedPacketPath: manifest.packetPath ?? path.dirname(manifestPath),
  noAutoSend: true,
  followUps,
  nextAction: `Send ${followUps[0].step} on ${followUps[0].dueDate} if no reply.`
};

const csvHeader = ["sent_date", "account", "channel", "recipient", "contact", "source", "reply_type", "follow_up_step", "due_date", "status", "next_action"];
const csvRows = followUps.map((item) => [
  sentDate,
  account,
  channel,
  recipient,
  contact,
  source,
  sendLog.replyType,
  item.step,
  item.dueDate,
  item.status,
  sendLog.nextAction
]);

fs.mkdirSync(logDir, { recursive: true });
fs.writeFileSync(path.join(logDir, "send-log.json"), `${JSON.stringify(sendLog, null, 2)}\n`, "utf8");
fs.writeFileSync(
  path.join(logDir, "follow-up-schedule.csv"),
  `${csvHeader.map(csvCell).join(",")}\n${csvRows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`,
  "utf8"
);

console.log("Logged approved manual send.");
console.log(logDir);
