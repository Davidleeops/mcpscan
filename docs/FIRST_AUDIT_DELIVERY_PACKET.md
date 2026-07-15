# First Audit Delivery Packet

Use this packet to fulfill the first paid MCPScan audit without inventing the
process mid-delivery.

## Delivery Folder

Create a private customer folder outside this public repository:

```bash
mkdir -p ~/MCPScan-Audits/customer-slug/{input,output,notes,delivery}
```

Never commit customer files, configs, reports, notes, screenshots, credentials,
or scan outputs to this repository.

## 1. Scope Confirmation

Send after payment and before reviewing materials.

```text
Subject: MCPScan audit scope confirmation

Thanks for purchasing the {{package_name}}.

Confirmed scope:
- Customer: {{customer}}
- Package: {{package_name}}
- MCP servers in scope: {{server_count}}
- Environments in scope: {{environment_count}}
- Delivery target: {{delivery_date}}
- Findings call included: {{yes_no}}
- Re-scan included: {{yes_no}}

Please do not send raw production credentials, tokens, customer data, or private
configs through public issues. Use sanitized configs unless we agree on a secure
transfer path.

The audit clock starts after intake materials are complete.
```

## 2. Intake Checklist

Collect:

- Customer/project name.
- Package purchased.
- Technical contact.
- Business goal: internal rollout, customer pilot, enterprise review, agency handoff, or other.
- MCP clients in use: Claude Desktop, Claude Code, Cursor, VS Code, Copilot, Goose, Langdock, or other.
- MCP server list.
- Environment list.
- Sanitized MCP configs or safe test target.
- Known sensitive systems reachable by the MCP setup.
- Permission for any live probing, if applicable.
- Report recipients.
- Deadline and meeting constraints.

Reject or pause if the customer provides:

- production secrets
- personal data not needed for the audit
- unrelated source code dumps
- unclear authorization
- a scope that exceeds the package

## 3. Evidence Log

Maintain this in a private notes file:

| Field | Value |
| --- | --- |
| Customer |  |
| Package |  |
| Auditor |  |
| Intake complete at |  |
| Delivery due |  |
| MCPScan version |  |
| Scan command |  |
| Input file names |  |
| Environments |  |
| Skipped checks |  |
| Assumptions |  |

## 4. Scan Commands

Use the current CLI help as source of truth:

```bash
mcpscan --help
```

Typical commands:

```bash
mcpscan scan ./input/sanitized-mcp-config.json --format json --output ./output/mcpscan-results.json
mcpscan scan ./input/sanitized-mcp-config.json --format html --output ./delivery/report.html
mcpscan scan ./input/sanitized-mcp-config.json --format markdown --output ./delivery/findings.md
mcpscan scan ./input/sanitized-mcp-config.json --format sarif --output ./output/mcpscan.sarif
```

If npm is not published yet, use the built local CLI and record the commit SHA.

## 5. Manual Review Checklist

Inventory:

- MCP servers and tools.
- Commands and package names.
- Environment variables and secret references.
- File paths and directory scopes.
- Remote endpoints and transport types.
- External systems touched.

Risk paths:

- file read + network send
- shell execution + untrusted prompt content
- database access + broad credentials
- ticket/doc access + customer or employee data
- deployment tool + production environment
- finance/payment tool + write capability

Configuration:

- direct secrets in config
- unpinned packages
- dynamic code execution
- broad filesystem paths
- production credentials in dev configs
- unclear server provenance

Prompt/tool metadata:

- hidden instructions
- "ignore previous instructions" language
- broad authority in tool descriptions
- untrusted content influencing high-impact tools
- deceptive tool names or collisions

## 6. Report Structure

Use this order:

1. Executive summary.
2. Scope and assumptions.
3. MCP server inventory.
4. Risk overview.
5. Findings by severity.
6. Prioritized remediation checklist.
7. CI/readiness recommendation.
8. Re-scan plan.
9. Out-of-scope items.

Every finding needs:

- ID/title.
- Severity.
- Affected server/tool.
- Evidence.
- Business impact.
- Remediation.
- Owner suggestion.
- Status: Open, Fixed, Partially Fixed, Accepted Risk, or Out of Scope.

## 7. Delivery Email

Prepare only. Do not send externally without same-turn approval.

```text
Subject: MCPScan audit report for {{customer}}

Hi {{first_name}},

Your MCPScan audit report is ready.

The highest-priority items are summarized at the top of the report, followed by
the server/tool inventory, detailed findings, and remediation checklist.

Top priorities:
1. {{priority_1}}
2. {{priority_2}}
3. {{priority_3}}

{{findings_call_sentence}}
{{rescan_sentence}}

Please avoid forwarding raw configs or secrets in this thread. If remediation
evidence includes sensitive material, send a sanitized summary or use the secure
transfer path we agreed on.

Best,
{{sender_name}}
```

Findings call sentence:

```text
Your package includes a findings call; use {{booking_link}} to pick a time.
```

Re-scan sentence:

```text
Your package includes one re-scan within 14 days after fixes are ready.
```

## 8. Quality Gate

Before delivery:

- Customer name and package are correct.
- Report contains no raw secrets.
- Every Critical/High finding has clear evidence.
- Recommendations are actionable.
- Scope limits and out-of-scope items are clear.
- Delivery date matches the package.
- Re-scan terms match the package.
- Any public testimonial request is separated from report delivery.

## 9. Closeout Questions

Ask after delivery:

- Which finding was most useful?
- Which remediation will be hardest?
- Did this help with a buyer, internal security review, or rollout decision?
- Would monthly drift monitoring be valuable?
- Can we use an anonymized version of one finding as a public example?

