# Paid MCP Audit Runbook

## Purpose

This runbook describes how to deliver a paid MCPScan audit using the CLI and a short manual review.

The goal is a practical buyer outcome: a clear list of what is connected, what is risky, and what to fix first.

For the first customer delivery, use `docs/FIRST_AUDIT_DELIVERY_PACKET.md` as
the operator checklist and `sales/one-page-scope.md` as the buyer-facing scope.

## Before Starting

Confirm the customer has paid and the scope matches the purchased package.

Required inputs:

- Customer name.
- Package purchased.
- Delivery deadline.
- MCP config files or exported server definitions.
- Environment names in scope.
- Contact for technical questions.
- Any systems that must not be touched.

Do not begin if:

- The customer has not authorized the review in writing.
- The customer wants active exploitation or penetration testing.
- The provided files contain unrelated secrets that are not needed for the audit.
- The requested scope exceeds the purchased package and has not been approved.

## Workspace Setup

Create a private working folder for each customer:

```bash
mkdir -p audits/customer-name/input audits/customer-name/output audits/customer-name/notes
```

Store customer-provided files under `input/`.

Never commit customer files, scan outputs, reports, screenshots, secrets, or notes to the MCPScan repo.

## Step 1: Confirm Scope

Send a short confirmation before scanning:

- Package.
- Number of MCP servers in scope.
- Environments in scope.
- Expected report delivery date.
- Whether a findings call is included.
- Whether a re-scan is included.

Use `docs/SAMPLE_AUDIT_SCOPE.md` as the baseline.

## Step 2: Prepare Inputs

Review the provided config files and identify:

- MCP server names.
- Server commands and arguments.
- Environment variables.
- File paths.
- Tool descriptions.
- Network or API integrations.
- Credentials or secret references.

If raw secrets are present, pause and ask the customer to rotate or replace them with redacted values unless the secret value is essential to the review.

## Step 3: Run MCPScan CLI

Install or build MCPScan according to the repository README.

Run the CLI against the customer-provided MCP configuration. Use the current CLI help output as the source of truth:

```bash
mcpscan --help
```

Capture the command used in internal notes.

Example pattern:

```bash
mcpscan scan --config audits/customer-name/input/mcp-config.json --output audits/customer-name/output/mcpscan-results.json
```

If the installed command or flags differ, use the equivalent documented command and record the exact version.

## Step 4: Preserve Evidence

Save:

- CLI version.
- Scan command.
- Timestamp.
- Input filenames.
- Raw scan output.
- Any errors or skipped checks.

Do not include raw secrets in the final report. Redact values while keeping enough context to support the finding.

## Step 5: Review Inventory

Create an inventory table:

| Server | Tools Exposed | Environment | External Systems | Notes |
| --- | --- | --- | --- | --- |

Look for:

- Tools that read or write files.
- Tools that execute shell commands.
- Tools that query databases.
- Tools that access source code or tickets.
- Tools that send messages, emails, or web requests.
- Tools with broad permissions.
- Servers running from unpinned packages or remote code.

## Step 6: Review Configuration Risk

Check for:

- Secrets embedded directly in config.
- Overbroad API tokens.
- Production credentials in local development configs.
- File path access to home directories, source repos, SSH keys, cloud credentials, or downloads.
- Unclear server provenance.
- Missing version pinning.
- Commands that fetch or execute code dynamically.
- Servers that can modify external systems without approval.

## Step 7: Review Prompt-Injection Risk

Inspect tool and server descriptions.

Flag descriptions that:

- Encourage the model to ignore prior instructions.
- Hide risky behavior in benign wording.
- Give tools broad authority without clear constraints.
- Mix retrieval, execution, and exfiltration capabilities.
- Allow untrusted content to influence high-impact tool calls.

Where possible, recommend safer wording and permission boundaries.

## Step 8: Assign Severity

Use this severity model:

Critical:

- Direct path to credential theft, arbitrary command execution, destructive production action, or sensitive data exfiltration.

High:

- Broad access to sensitive systems with weak boundaries, risky secrets handling, or high-impact write capability.

Medium:

- Meaningful misconfiguration, unclear provenance, excessive permissions, or prompt-injection exposure requiring remediation.

Low:

- Hardening improvement with limited immediate impact.

Informational:

- Inventory note, documentation gap, or future monitoring recommendation.

## Step 9: Write the Report

Use this structure:

1. Executive summary.
2. Scope and assumptions.
3. MCP server inventory.
4. Risk overview.
5. Findings.
6. Remediation checklist.
7. Re-scan plan.
8. Out-of-scope items.

Keep each finding concrete:

- What was found.
- Where it appears.
- Why it matters.
- What to do next.

Avoid speculative claims. If evidence is incomplete, say so.

## Step 10: Quality Check

Before delivery, verify:

- All customer names are correct.
- No raw secrets appear in the report.
- Every severity has evidence.
- Recommendations are actionable.
- Out-of-scope items are clearly marked.
- The report matches the purchased scope.
- The findings call link is included if applicable.

## Step 11: Deliver

Send:

- PDF or Markdown report.
- Remediation checklist.
- Findings call booking link, if included.
- Re-scan instructions, if included.

Suggested delivery note:

> Your MCP audit report is attached. The highest priority items are listed in the executive summary, and the remediation checklist is ordered by risk. If your package includes a findings call, please use the booking link below so we can walk through the report and agree on next steps.

## Step 12: Findings Call

Agenda:

1. Confirm business context.
2. Walk through Critical and High findings.
3. Explain quick wins.
4. Agree on remediation owners.
5. Confirm re-scan timing, if included.
6. Ask what would make ongoing monitoring useful.

Keep the call focused on decisions, not reading the report aloud.

## Step 13: Re-Scan

For packages with a re-scan:

- Ask the customer to send updated config files or evidence of fixes.
- Re-run the CLI using the same notes structure.
- Update finding statuses as Fixed, Partially Fixed, Accepted Risk, or Still Open.
- Deliver a short re-scan memo.

## Step 14: Closeout

After delivery:

- Ask for a testimonial or referral.
- Ask which finding surprised them most.
- Ask whether they need monthly monitoring.
- Add anonymized recurring patterns to the product backlog.
