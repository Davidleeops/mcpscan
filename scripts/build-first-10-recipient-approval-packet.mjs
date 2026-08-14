#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const candidateFile = "sales/recipient-candidates-2026-08-14.csv";
const outputFile = "sales/first-10-recipient-approval-packet-2026-08-14.md";

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

function firstName(value) {
  return value.trim().split(/\s+/)[0] || "there";
}

function messageFor(row) {
  const draft = drafts[row.account];
  if (!draft) throw new Error(`Missing draft for ${row.account}.`);
  return [
    `Subject: ${draft.subject}`,
    "",
    `Hi ${firstName(row.candidate_name)},`,
    "",
    draft.body,
    "",
    "MCPScan"
  ].join("\n");
}

const rows = toRecords(parseCsv(fs.readFileSync(path.join(root, candidateFile), "utf8")));
if (rows.length < 10) throw new Error("Expected at least 10 recipient candidates.");

const blocks = rows.map((row, index) => {
  if (row.approval_status !== "Ready for founder approval") {
    throw new Error(`${row.account} is not ready for founder approval.`);
  }
  if (!row.candidate_name || !row.contact_or_profile_url) {
    throw new Error(`${row.account} is missing candidate name or contact/profile URL.`);
  }
  const message = messageFor(row);
  return [
    `## ${index + 1}. ${row.account}`,
    "",
    `Candidate: ${row.candidate_name}, ${row.title}, ${row.company}`,
    `Channel: ${row.channel}`,
    `Contact or profile URL: ${row.contact_or_profile_url}`,
    `Source URL: ${row.public_evidence_url}`,
    `Confidence: ${row.confidence}`,
    `Message ID: ${row.message_id}`,
    "",
    "### Final Message",
    "",
    "```text",
    message,
    "```",
    "",
    "### Same-Turn Approval Block",
    "",
    "```text",
    "I approve staging this exact MCPScan outbound message.",
    "",
    `Account: ${row.account}`,
    `Channel: ${row.channel}`,
    `Recipient: ${row.candidate_name}, ${row.title}, ${row.company}`,
    `Contact or profile URL: ${row.contact_or_profile_url}`,
    `Source URL: ${row.public_evidence_url}`,
    "",
    "Final message:",
    message,
    "",
    "Approved action:",
    "Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.",
    "```",
    ""
  ].join("\n");
});

const packet = [
  "# First 10 Named Recipient Approval Packet",
  "",
  "Generated: 2026-08-14",
  "",
  "Status: approval required. This packet does not approve or send outreach.",
  "",
  "## Hard Rule",
  "",
  "No external message can be sent until the exact recipient and exact final content are approved in the same turn.",
  "",
  "## All-10 Review Note",
  "",
  "Use one approval block at a time unless the founder explicitly approves all 10 named-recipient packets in the same turn. Route-based packets remain available as a safer fallback when a named recipient is uncertain.",
  "",
  ...blocks
].join("\n");

fs.writeFileSync(path.join(root, outputFile), packet, "utf8");
console.log(`Wrote ${outputFile}`);
