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

function readInput(file) {
  if (file) return fs.readFileSync(file, "utf8");
  return fs.readFileSync(0, "utf8");
}

function requireMatch(label, text, pattern) {
  const match = text.match(pattern);
  if (!match?.[1]) throw new Error(`Missing ${label} in approved outbound packet.`);
  return match[1].trim();
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    throw new Error("Refusing to write approved outbound packets inside the public MCPScan repo.");
  }
  return resolved;
}

const args = parseArgs(process.argv.slice(2));
const input = readInput(args.file);

if (!input.includes("I approve staging this exact MCPScan outbound message")) {
  throw new Error("Founder outbound approval phrase is missing.");
}

if (!input.includes("Do not send automatically")) {
  throw new Error("No-auto-send phrase is missing.");
}

const account = requireMatch("account", input, /^Account:\s*(.+)$/m);
const channel = requireMatch("channel", input, /^Channel:\s*(.+)$/m);
const recipient = requireMatch("recipient", input, /^Recipient:\s*(.+)$/m);
const contact = requireMatch("contact", input, /^Contact or profile URL:\s*(.+)$/m);
const source = requireMatch("source URL", input, /^Source URL:\s*(.+)$/m);
const message = requireMatch("final message", input, /^Final message:\s*\n([\s\S]+?)\nApproved action:/m);

if (!/^https?:\/\//i.test(source)) throw new Error("Source URL must be an HTTP or HTTPS URL.");
if (message.length < 40) throw new Error("Final message is too short to be a real approved outbound message.");

const baseDir = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Outbound Approvals"));
const date = args.date ?? today();
const packetDir = path.join(baseDir, `${date}_${slugify(account)}_${slugify(recipient)}`);
if (fs.existsSync(packetDir)) {
  throw new Error(`Approved outbound packet already exists: ${packetDir}`);
}

fs.mkdirSync(packetDir, { recursive: true });

const packet = [
  "# Approved MCPScan Outbound Packet",
  "",
  `Date: ${date}`,
  `Account: ${account}`,
  `Channel: ${channel}`,
  `Recipient: ${recipient}`,
  `Contact or profile URL: ${contact}`,
  `Source URL: ${source}`,
  "",
  "## Safety Status",
  "",
  "- Founder approved exact recipient and exact final message.",
  "- This packet does not send anything automatically.",
  "- Confirm domain, mailbox authentication, and Stripe links before sending.",
  "",
  "## Final Message",
  "",
  "```text",
  message.trim(),
  "```",
  ""
].join("\n");

const manifest = {
  date,
  account,
  channel,
  recipient,
  contact,
  source,
  noAutoSend: true,
  packetPath: packetDir
};

fs.writeFileSync(path.join(packetDir, "APPROVED_OUTBOUND_PACKET.md"), packet, "utf8");
fs.writeFileSync(path.join(packetDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log("Staged approved outbound packet.");
console.log(packetDir);
