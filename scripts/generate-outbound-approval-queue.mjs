#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const input = path.join(root, "sales/first-account-pipeline-2026-08-14.csv");
const output = path.join(root, "sales/outreach-approval-queue.md");

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

function subjectFor(record) {
  return record.draft_angle || "MCP readiness check before agent rollout";
}

function categoryFor(record) {
  return record.category || record.contact_channel || "First-wave MCP signal";
}

function emailDraft(record) {
  const trigger = record.trigger.replace(/\.$/, "");
  return `Subject: ${subjectFor(record)}

Hi {{first_name}},

I saw the public MCP signal around ${record.account}: ${trigger}.

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is ${record.recommended_offer}.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}`;
}

function linkedinDraft(record) {
  return `Hi {{first_name}}, saw public MCP activity around ${record.account}. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?`;
}

const records = toRecords(parseCsv(fs.readFileSync(input, "utf8")));
const selected = records
  .filter((record) => record.stage === "Qualified")
  .slice(0, 10);

const generatedAt = new Date().toISOString();

const sections = selected.map((record, index) => `## ${index + 1}. ${record.account}

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: ${categoryFor(record)}
- Trigger URL: ${record.source_url}
- Trigger note: ${record.trigger}
- Buyer hypothesis: ${record.contact_role}
- Score: ${record.score}
- Recommended offer: ${record.recommended_offer}
- Next action: ${record.next_action}
- Approval status: ${record.approval_status}

### Email Draft

\`\`\`text
${emailDraft(record)}
\`\`\`

### LinkedIn Draft

\`\`\`text
${linkedinDraft(record)}
\`\`\`
`);

const markdown = `# Outreach Approval Queue

Generated: ${generatedAt}

Status: draft only. This file is a preparation artifact, not permission to send.
No external messages may be sent until the exact recipient and exact final text
are approved in the same turn.

Source: \`sales/first-account-pipeline-2026-08-14.csv\`

Use this queue to pick exact recipients, then stage the approved message with
\`ops/outbound-recipient-approval-builder.html\`.

${sections.join("\n")}
`;

fs.writeFileSync(output, markdown);
console.log(`Wrote ${path.relative(root, output)} with ${selected.length} draft items.`);
