#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const routeApprovalPhrase = "I approve staging all 10 exact MCPScan route outbound messages.";
const namedApprovalPhrase = "I approve staging all 10 exact MCPScan named-recipient outbound messages.";

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

function requireMatch(label, text, pattern) {
  const match = text.match(pattern);
  if (!match?.[1]) throw new Error(`Missing ${label} in approved route block.`);
  return match[1].trim();
}

function extractBlocks(input) {
  const matches = [...input.matchAll(/```text\n(I approve staging this exact MCPScan outbound message\.[\s\S]+?)\n```/g)];
  return matches.map((match) => match[1].trim());
}

function parseBlock(block) {
  const account = requireMatch("account", block, /^Account:\s*(.+)$/m);
  const channel = requireMatch("channel", block, /^Channel:\s*(.+)$/m);
  const recipient = requireMatch("recipient", block, /^Recipient:\s*(.+)$/m);
  const contact = requireMatch("contact", block, /^Contact or profile URL:\s*(.+)$/m);
  const source = requireMatch("source URL", block, /^Source URL:\s*(.+)$/m);
  const message = requireMatch("final message", block, /^Final message:\s*\n([\s\S]+?)\nApproved action:/m);
  if (!/^https?:\/\//i.test(source)) throw new Error(`Source URL for ${account} must be an HTTP or HTTPS URL.`);
  if (message.length < 40) throw new Error(`Final message for ${account} is too short.`);
  if (!block.includes("Do not send automatically")) throw new Error(`No-auto-send phrase is missing for ${account}.`);
  return { account, channel, recipient, contact, source, message };
}

function writePacket(packetDir, date, parsed, mode) {
  const modeLabel = mode === "named" ? "Named Recipient" : "Route";
  const packet = [
    `# Approved MCPScan ${modeLabel} Outbound Packet`,
    "",
    `Date: ${date}`,
    `Account: ${parsed.account}`,
    `Channel: ${parsed.channel}`,
    `Recipient: ${parsed.recipient}`,
    `Contact or profile URL: ${parsed.contact}`,
    `Source URL: ${parsed.source}`,
    "",
    "## Safety Status",
    "",
    mode === "named"
      ? "- Founder approved this exact named recipient and exact final message."
      : "- Founder approved this exact route and exact final message.",
    "- This packet does not send anything automatically.",
    "- Run npm run outbound:send-gates before sending.",
    "",
    "## Final Message",
    "",
    "```text",
    parsed.message.trim(),
    "```",
    ""
  ].join("\n");

  const manifest = {
    date,
    account: parsed.account,
    channel: parsed.channel,
    recipient: parsed.recipient,
    contact: parsed.contact,
    source: parsed.source,
    routeBased: mode === "route",
    namedRecipientBased: mode === "named",
    noAutoSend: true,
    packetPath: packetDir
  };

  fs.writeFileSync(path.join(packetDir, "APPROVED_ROUTE_OUTBOUND_PACKET.md"), packet, "utf8");
  fs.writeFileSync(path.join(packetDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function updateApprovalStatus(count, mode) {
  const file = path.join(root, "ops/founder-approval-status.json");
  if (!fs.existsSync(file)) {
    console.log("INFO approval status - ops/founder-approval-status.json not found, skipping tracker update");
    return;
  }

  const status = JSON.parse(fs.readFileSync(file, "utf8"));
  status.updatedAt = new Date().toISOString();
  if (mode === "named") {
    status.stagedNamedRecipientApprovalCount = count;
    status.firstTenNamedRecipientPacketApproved = count === 10;
  } else {
    status.stagedRouteApprovalCount = count;
    status.firstTenRoutePacketApproved = count === 10;
  }
  fs.writeFileSync(file, `${JSON.stringify(status, null, 2)}\n`);
  console.log("INFO approval status - updated ops/founder-approval-status.json");
}

const args = parseArgs(process.argv.slice(2));
const input = readInput(args.file);

const approvalMode = input.includes(namedApprovalPhrase) ? "named" : input.includes(routeApprovalPhrase) ? "route" : "";
if (!approvalMode) {
  throw new Error(`Missing all-10 approval phrase. Use either: ${routeApprovalPhrase} OR ${namedApprovalPhrase}`);
}

if (!input.includes("Do not send automatically")) {
  throw new Error("No-auto-send phrase is missing.");
}

const blocks = extractBlocks(input);
if (blocks.length !== 10) {
  throw new Error(`Expected 10 approved route blocks, found ${blocks.length}.`);
}

const baseDir = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Outbound Approvals"));
const date = args.date ?? today();
const batchDir = path.join(baseDir, `${date}_first-10-${approvalMode}-approvals`);
if (fs.existsSync(batchDir)) {
  throw new Error(`Approved ${approvalMode} batch already exists: ${batchDir}`);
}

fs.mkdirSync(batchDir, { recursive: true });

const parsedBlocks = blocks.map(parseBlock);
for (const parsed of parsedBlocks) {
  const packetDir = path.join(batchDir, slugify(parsed.account));
  fs.mkdirSync(packetDir, { recursive: true });
  writePacket(packetDir, date, parsed, approvalMode);
}

const batchManifest = {
  date,
  approvalCount: parsedBlocks.length,
  accounts: parsedBlocks.map((item) => item.account),
  approvalMode,
  routeBased: approvalMode === "route",
  namedRecipientBased: approvalMode === "named",
  noAutoSend: true,
  batchPath: batchDir
};

fs.writeFileSync(path.join(batchDir, "batch-manifest.json"), `${JSON.stringify(batchManifest, null, 2)}\n`, "utf8");
updateApprovalStatus(parsedBlocks.length, approvalMode);

console.log(`Staged approved first-10 ${approvalMode} outbound packets.`);
console.log(batchDir);
