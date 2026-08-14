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

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === "\"" && quoted && next === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function readCsv(file) {
  return parseCsv(fs.readFileSync(path.resolve(root, file), "utf8"));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function accountDraft(account) {
  const drafts = {
    Vapi: ["MCP readiness review for voice-agent tools", "I saw Vapi exposes APIs as MCP tools for assistants, phone numbers, and calls. Voice-agent tooling is a high-trust surface because it can touch real customer interactions, phone workflows, and operational actions."],
    Retool: ["MCP readiness review for internal-tool access", "I saw Retool MCP lets agents manage apps, workflows, users, and org resources from Claude, Cursor, Codex, or Kiro. Internal-tool MCP is exactly where enterprise reviewers tend to ask about scopes, user authority, audit logs, and approval boundaries."],
    Pipedream: ["MCP exposure review for broad SaaS tool access", "I saw Pipedream provides MCP servers across thousands of apps and pre-built tools. That breadth is valuable, but it also makes the review question practical: which tools can act, whose credentials are used, and what should be gated before customer or enterprise rollout?"],
    Composio: ["MCP trust review for gateway-managed tools", "I saw Composio is positioning MCP gateway management around managed tools, custom MCP servers, central enable/disable, and team ownership. For gateway products, buyers tend to ask for clear evidence around tool inventory, ownership, auth, and what actions are enabled for which teams."],
    PostHog: ["MCP readiness check for analytics and feature-flag tools", "I saw PostHog MCP supports analytics queries, feature flags, experiments, SQL, CDP destinations, and support-ticket workflows. Because those surfaces can affect product data and rollout behavior, the useful security artifact is a clear map of tool permissions, approval gates, and remediation priorities."],
    Statsig: ["MCP readiness check for feature-gate actions", "I saw Statsig MCP supports both read and write tools for gates, experiments, configs, and bulk changes. Feature gates and experiments are production-control surfaces, so the security review usually comes down to tool scopes, write permissions, approval gates, and audit evidence."],
    Braintrust: ["MCP exposure snapshot for eval and log access", "I saw Braintrust MCP lets AI coding tools query experiments, search docs, and analyze production logs. Evals and logs often include prompts, outputs, traces, and real customer examples, so a lightweight MCP review can help show what data agents can reach and which actions should be approved or gated."],
    Granola: ["MCP exposure snapshot for meeting-note access", "I saw Granola MCP connects meeting notes to Claude, ChatGPT, Cursor, and other AI tools. Meeting notes can contain sales, legal, hiring, product, and customer-sensitive context, so the useful review is practical: who can connect, what gets exposed, what is logged, and what should be gated."],
    Sentry: ["MCP readiness review for error and trace access", "I saw Sentry MCP connects AI assistants to errors, performance data, issue triage, docs, and project management. Error traces and project data can carry sensitive production context, so security reviewers tend to ask what agents can read, what they can change, and how tool calls are attributed."],
    Replit: ["MCP exposure review for custom coding-agent tools", "I saw Replit Agent supports connecting pre-listed and custom MCP servers, with guidance to trust sources and review access. Custom MCP inside a coding environment is powerful, but it creates a practical review need around tool poisoning, credential exposure, workspace access, and unsafe actions."]
  };
  return drafts[account];
}

function buildMessage({ account, sender }) {
  const [subject, context] = accountDraft(account) ?? [];
  if (!subject || !context) throw new Error(`Missing account draft for ${account}.`);
  const message = [
    `Subject: ${subject}`,
    "",
    "Hi team,",
    "",
    context,
    "",
    "MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.",
    "",
    "Worth sending the one-page scope to the right AppSec, platform, or engineering owner?",
    "",
    sender
  ].join("\n");
  return { subject, message };
}

const args = parseArgs(process.argv.slice(2));
const date = args.date ?? today();
const sender = args.sender ?? "David";
const routesFile = args.routes ?? "sales/first-10-contact-routes-2026-08-14.csv";
const candidatesFile = args.candidates ?? "sales/recipient-candidates-2026-08-14.csv";
const output = path.resolve(root, args.output ?? "sales/first-10-route-approval-packet-2026-08-14.md");
const routes = readCsv(routesFile);
const candidates = readCsv(candidatesFile);
const candidateByAccount = new Map(candidates.map((row) => [row.account.toLowerCase(), row]));

const sections = [];
for (const route of routes) {
  const candidate = candidateByAccount.get(route.account.toLowerCase());
  if (!candidate) throw new Error(`Missing candidate row for ${route.account}.`);
  const built = buildMessage({ account: route.account, sender });
  sections.push([
    `## ${route.account}`,
    "",
    `Channel: ${route.channel}`,
    `Route: ${route.contact_route_url}`,
    `Route source: ${route.source_url}`,
    `Public MCP signal: ${candidate.public_evidence_url}`,
    `Confidence: ${route.confidence}`,
    `Note: ${route.notes}`,
    "",
    "Final message:",
    "",
    "```text",
    built.message,
    "```",
    "",
    "Same-turn approval text:",
    "",
    "```text",
    "I approve staging this exact MCPScan outbound message.",
    "",
    `Account: ${route.account}`,
    `Channel: ${route.channel}`,
    `Recipient: Security, platform, or engineering owner at ${route.account}`,
    `Contact or profile URL: ${route.contact_route_url}`,
    `Source URL: ${candidate.public_evidence_url}`,
    "",
    "Final message:",
    built.message,
    "",
    "Approved action:",
    "Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.",
    "```",
    ""
  ].join("\n"));
}

const packet = [
  "# First 10 Route Approval Packet",
  "",
  `Generated: ${date}`,
  "",
  "Status: draft only. This packet does not approve or send outreach.",
  "",
  "## Approval Rule",
  "",
  "No external message can be sent until the founder approves the exact route, recipient description, and final message in the same turn.",
  "",
  "## Route Source",
  "",
  `Routes: ${routesFile}`,
  `Candidates: ${candidatesFile}`,
  "",
  "## How To Stage After Approval",
  "",
  "Copy one approved block into a temporary file, then run:",
  "",
  "```text",
  "npm run outbound:stage-approved -- --file /path/to/approved-outbound.txt",
  "```",
  "",
  "To approve and stage all 10 route messages outside the public repo in one pass, paste this line above the full packet in the same approved file:",
  "",
  "```text",
  "I approve staging all 10 exact MCPScan route outbound messages.",
  "Do not send automatically.",
  "```",
  "",
  "Then run:",
  "",
  "```text",
  "npm run outbound:stage-route-packet -- --file /path/to/approved-first-10-route-packet.txt",
  "```",
  "",
  ...sections
].join("\n");

fs.writeFileSync(output, packet, "utf8");
console.log("Built first 10 route approval packet.");
console.log(output);
