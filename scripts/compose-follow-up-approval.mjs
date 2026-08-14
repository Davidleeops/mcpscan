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

function assertOutsideRepo(target, label) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail(`Refusing to read or write ${label} inside the public MCPScan repo.`);
  }
  return resolved;
}

function requireValue(label, value) {
  const result = String(value ?? "").trim();
  if (!result) fail(`Missing ${label} in send log.`);
  if (/\{\{[^}]+\}\}/.test(result)) fail(`Replace template placeholder before composing follow-up: ${label}.`);
  return result;
}

function selectFollowUp(log, step) {
  const item = log.followUps?.find((candidate) => candidate.step === step);
  if (!item) fail(`Follow-up step not found in send log: ${step}`);
  return item;
}

function buildMessage(step, account, senderName) {
  if (step === "follow-up-1") {
    return [
      "Quick follow-up. The useful version of this is not a broad pentest or a generic scanner output. It is a short MCP exposure review that answers: which servers and tools exist, what can read or write, what credentials are involved, what should be gated, and what evidence a buyer or AppSec reviewer can inspect.",
      "",
      `Worth sending the one-page scope for ${account}?`,
      "",
      senderName
    ].join("\n");
  }

  if (step === "follow-up-2") {
    return [
      "Circling back once more. If MCP or agent access is moving toward code, tickets, databases, cloud tools, customer data, or internal SaaS actions, a lightweight readiness review can give the team a clean inventory and a practical approve, guardrail, or block recommendation before access expands.",
      "",
      "Should I send the scope, or close the loop for now?",
      "",
      senderName
    ].join("\n");
  }

  if (step === "final-follow-up") {
    return [
      "I will close the loop for now. The best time to revisit is before MCP gets connected to production data, customer-facing workflows, internal tickets, code repositories, CI/CD, or broad SaaS tools.",
      "",
      "If MCP or agent access review becomes timely later, the lightest option is a fixed-scope Quick Audit: inventory, permission risks, secret exposure, prompt-injection and tool-description review, and remediation checklist.",
      "",
      senderName
    ].join("\n");
  }

  fail(`Unsupported follow-up step: ${step}`);
}

const args = parseArgs(process.argv.slice(2));
if (!args.file) fail("Missing --file path to private send-log.json.");

const inputPath = assertOutsideRepo(args.file, "private send logs");
if (!fs.existsSync(inputPath)) fail(`Send log not found: ${inputPath}`);

const log = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const step = args.step ?? "follow-up-1";
const account = requireValue("account", log.account);
const channel = requireValue("channel", log.channel);
const recipient = requireValue("recipient", log.recipient);
const contact = requireValue("contact", log.contact);
const source = requireValue("source", log.source);
const followUp = selectFollowUp(log, step);
const senderName = args.sender ?? "MCPScan";
const message = buildMessage(step, account, senderName);

const packet = [
  "DRAFT ONLY. Do not send until the exact recipient and exact final content are approved in the same turn.",
  "",
  "```text",
  "I approve staging this exact MCPScan outbound message.",
  "",
  `Account: ${account}`,
  `Channel: ${channel}`,
  `Recipient: ${recipient}`,
  `Contact or profile URL: ${contact}`,
  `Source URL: ${source}`,
  `Follow-up step: ${step}`,
  `Due date: ${followUp.dueDate}`,
  "",
  "Final message:",
  message,
  "",
  "Approved action:",
  "Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.",
  "```",
  ""
].join("\n");

if (args.output) {
  const outputPath = assertOutsideRepo(args.output, "private follow-up approval packets");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, packet, "utf8");
  console.log(`Wrote follow-up approval packet: ${outputPath}`);
} else {
  console.log(packet);
}
