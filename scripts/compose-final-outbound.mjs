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

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
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

function requireValue(name, value) {
  if (!value || !String(value).trim()) throw new Error(`Missing required ${name}.`);
  return String(value).trim();
}

function accountDraft(account) {
  const drafts = {
    Vapi: {
      subject: "MCP readiness review for voice-agent tools",
      body: "I saw Vapi exposes APIs as MCP tools for assistants, phone numbers, and calls. Voice-agent tooling is a high-trust surface because it can touch real customer interactions, phone workflows, and operational actions. MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence. Worth sending the one-page scope?"
    },
    Retool: {
      subject: "MCP readiness review for internal-tool access",
      body: "I saw Retool MCP lets agents manage apps, workflows, users, and org resources from Claude, Cursor, Codex, or Kiro. Internal-tool MCP is exactly where enterprise reviewers tend to ask about scopes, user authority, audit logs, and approval boundaries. MCPScan runs a fixed-scope MCP audit and produces a buyer-safe report with inventory, risky action paths, auth/secrets review, and remediation steps. Open to me sending the one-page scope?"
    },
    Pipedream: {
      subject: "MCP exposure review for broad SaaS tool access",
      body: "I saw Pipedream provides MCP servers across thousands of apps and pre-built tools. That breadth is valuable, but it also makes the review question practical: which tools can act, whose credentials are used, and what should be gated before customer or enterprise rollout? MCPScan runs a fixed-scope MCP Launch Audit for exactly that kind of connected-agent surface. Worth a quick look at the scope?"
    },
    Composio: {
      subject: "MCP trust review for gateway-managed tools",
      body: "I saw Composio is positioning MCP gateway management around managed tools, custom MCP servers, central enable/disable, and team ownership. For gateway products, buyers tend to ask for clear evidence around tool inventory, ownership, auth, and what actions are enabled for which teams. MCPScan runs a focused MCP exposure audit and can produce a buyer-safe summary that supports those conversations. Worth sending the one-page scope?"
    },
    PostHog: {
      subject: "MCP readiness check for analytics and feature-flag tools",
      body: "I saw PostHog MCP supports analytics queries, feature flags, experiments, SQL, CDP destinations, and support-ticket workflows. Because those surfaces can affect product data and rollout behavior, the useful security artifact is a clear map of tool permissions, approval gates, and remediation priorities. MCPScan can deliver that as a fixed-scope audit. Worth sending the one-page scope?"
    },
    Statsig: {
      subject: "MCP readiness check for feature-gate actions",
      body: "I saw Statsig MCP supports both read and write tools for gates, experiments, configs, and bulk changes. Feature gates and experiments are production-control surfaces, so the security review usually comes down to tool scopes, write permissions, approval gates, and audit evidence. MCPScan runs a fixed-scope MCP Launch Audit that turns that surface into a concise remediation report. Open to me sending the one-page scope?"
    },
    Braintrust: {
      subject: "MCP exposure snapshot for eval and log access",
      body: "I saw Braintrust MCP lets AI coding tools query experiments, search docs, and analyze production logs. Evals and logs often include prompts, outputs, traces, and real customer examples, so a lightweight MCP review can help show what data agents can reach and which actions should be approved or gated. MCPScan can run that as a focused exposure snapshot with buyer-safe remediation notes. Worth a quick look?"
    },
    Granola: {
      subject: "MCP exposure snapshot for meeting-note access",
      body: "I saw Granola MCP connects meeting notes to Claude, ChatGPT, Cursor, and other AI tools. Meeting notes can contain sales, legal, hiring, product, and customer-sensitive context, so the useful review is practical: who can connect, what gets exposed, what is logged, and what should be gated. MCPScan runs a focused MCP exposure audit and returns a concise buyer-safe report. Worth sending the one-page scope?"
    },
    Sentry: {
      subject: "MCP readiness review for error and trace access",
      body: "I saw Sentry MCP connects AI assistants to errors, performance data, issue triage, docs, and project management. Error traces and project data can carry sensitive production context, so security reviewers tend to ask what agents can read, what they can change, and how tool calls are attributed. MCPScan runs a fixed-scope MCP Launch Audit and produces a buyer-safe remediation report. Open to me sending the one-page scope?"
    },
    Replit: {
      subject: "MCP exposure review for custom coding-agent tools",
      body: "I saw Replit Agent supports connecting pre-listed and custom MCP servers, with guidance to trust sources and review access. Custom MCP inside a coding environment is powerful, but it creates a practical review need around tool poisoning, credential exposure, workspace access, and unsafe actions. MCPScan runs a fixed-scope exposure audit for that surface and returns a concise remediation plan. Worth sending the one-page scope?"
    }
  };
  return drafts[account];
}

function buildEmail({ row, firstName, senderName }) {
  const draft = accountDraft(row.account);
  if (!draft) throw new Error(`No account draft exists for ${row.account}.`);
  return {
    subject: draft.subject,
    message: [
      `Subject: ${draft.subject}`,
      "",
      `Hi ${firstName},`,
      "",
      draft.body,
      "",
      senderName
    ].join("\n")
  };
}

function buildLinkedIn({ row, firstName }) {
  const draft = accountDraft(row.account);
  if (!draft) throw new Error(`No account draft exists for ${row.account}.`);
  const firstSentence = draft.body.replace(/^I saw /, `Hi ${firstName}, I saw `);
  return {
    subject: draft.subject,
    message: firstSentence
  };
}

const args = parseArgs(process.argv.slice(2));
const account = requireValue("account", args.account);
const recipient = requireValue("recipient", args.recipient);
const title = requireValue("title", args.title);
const contact = requireValue("contact", args.contact);
const channel = args.channel ?? "Email";
const firstName = args["first-name"] ?? recipient.split(/\s+/)[0];
const senderName = args.sender ?? "MCPScan";
const outputDir = args.output ? path.resolve(args.output) : path.join(root, "sales", "generated-outbound");
const date = args.date ?? today();

const rows = parseCsv(read("sales/recipient-candidates-2026-08-14.csv"));
const row = rows.find((item) => item.account.toLowerCase() === account.toLowerCase());
if (!row) throw new Error(`No recipient candidate row found for ${account}.`);

const built = channel.toLowerCase().includes("linkedin")
  ? buildLinkedIn({ row, firstName })
  : buildEmail({ row, firstName, senderName });

const packet = [
  "# MCPScan Final Outbound Approval Packet",
  "",
  `Generated: ${date}`,
  "",
  "Status: draft only. This does not approve or send outreach.",
  "",
  "## Approval Rule",
  "",
  "No external message can be sent until the founder approves the exact recipient and exact final content in the same turn.",
  "",
  "## Candidate",
  "",
  `Account: ${row.account}`,
  `Channel: ${channel}`,
  `Recipient: ${recipient}, ${title}, ${row.company || row.account}`,
  `Contact or profile URL: ${contact}`,
  `Source URL: ${row.public_evidence_url}`,
  `Message ID: ${row.message_id}`,
  "",
  "## Final Message",
  "",
  "```text",
  built.message,
  "```",
  "",
  "## Same-Turn Approval Text",
  "",
  "```text",
  "I approve staging this exact MCPScan outbound message.",
  "",
  `Account: ${row.account}`,
  `Channel: ${channel}`,
  `Recipient: ${recipient}, ${title}, ${row.company || row.account}`,
  `Contact or profile URL: ${contact}`,
  `Source URL: ${row.public_evidence_url}`,
  "",
  "Final message:",
  built.message,
  "",
  "Approved action:",
  "Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.",
  "```",
  "",
  "## Follow-Up 1",
  "",
  "```text",
  `Subject: Re: ${built.subject}`,
  "",
  `Hi ${firstName},`,
  "",
  "Quick follow-up. The useful version of this is not a broad pentest or a generic scanner output. It is a short MCP exposure review that answers: which servers and tools exist, what can read or write, what credentials are involved, what should be gated, and what evidence a buyer or AppSec reviewer can inspect.",
  "",
  "Worth sending the one-page scope?",
  "",
  senderName,
  "```",
  "",
  "## Follow-Up 2",
  "",
  "```text",
  `Subject: Re: ${built.subject}`,
  "",
  `Hi ${firstName},`,
  "",
  "Closing the loop here. If MCP review is not a priority right now, no worries.",
  "",
  "If it is on the roadmap, the small scope I had in mind is a fixed-scope MCP Launch Audit with a server/tool inventory, risky action map, auth and secrets review, approval-gate notes, and a buyer-safe remediation summary.",
  "",
  "Should I send the scope, or circle back later?",
  "",
  senderName,
  "```",
  ""
].join("\n");

fs.mkdirSync(outputDir, { recursive: true });
const file = path.join(outputDir, `${date}_${slugify(row.account)}_${slugify(recipient)}.md`);
fs.writeFileSync(file, packet, "utf8");

console.log("Generated final outbound approval packet.");
console.log(file);
