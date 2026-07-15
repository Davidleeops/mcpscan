#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const input = path.join(root, "sales/seed-prospect-list-2026-07-15.csv");
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
  if (record.recommended_offer.includes("Enterprise")) return "MCP readiness review before enterprise rollout";
  if (record.recommended_offer.includes("Quick")) return "Quick MCP access review";
  return "MCP access review before rollout";
}

function emailDraft(record) {
  return `Subject: ${subjectFor(record)}

Hi {{first_name}},

I saw the public ${record.category.toLowerCase()} signal around ${record.account}: ${record.trigger_note}.

The risk pattern is pretty practical: ${record.likely_pain}. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is ${record.recommended_offer}.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}`;
}

function linkedinDraft(record) {
  return `Hi {{first_name}}, saw public MCP/agent activity around ${record.account}. Quick question: has the team reviewed ${record.likely_pain.toLowerCase()} yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?`;
}

const records = toRecords(parseCsv(fs.readFileSync(input, "utf8")));
const selected = records
  .filter((record) => record.priority === "P1")
  .slice(0, 10);

const generatedAt = new Date().toISOString();

const sections = selected.map((record, index) => `## ${index + 1}. ${record.account}

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: ${record.category}
- Trigger URL: ${record.trigger_url}
- Trigger note: ${record.trigger_note}
- Buyer hypothesis: ${record.buyer_hypothesis}
- Likely pain: ${record.likely_pain}
- Recommended offer: ${record.recommended_offer}
- Caveat: ${record.caveat}
- Next action: ${record.next_action}

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

Source: \`sales/seed-prospect-list-2026-07-15.csv\`

Use this queue to pick the first 10 account pools, qualify specific accounts,
then replace placeholders before requesting send approval.

${sections.join("\n")}
`;

fs.writeFileSync(output, markdown);
console.log(`Wrote ${path.relative(root, output)} with ${selected.length} draft items.`);
