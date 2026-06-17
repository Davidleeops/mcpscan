# Sample MCP Audit Scope

## Summary

This is a fixed-scope review of MCP servers, tools, and configuration risk for a defined customer environment.

The audit is designed to answer:

- What MCP servers and tools are connected?
- What can those tools access or change?
- Where are credentials, file paths, or permissions too broad?
- Which issues should be fixed before broader rollout or customer review?

## Included

MCP inventory:

- List of MCP servers in scope.
- Tools exposed by each server.
- Basic description of connected systems.
- Environment or workspace where each server is used.

Configuration review:

- MCP config files supplied by the customer.
- Server commands, arguments, environment variables, and file paths.
- Secret references and obvious secret exposure.
- Version pinning and server provenance where visible.

Permission and access review:

- Tools that read files, write files, execute commands, query databases, call APIs, send messages, or modify external systems.
- Broad or unclear permissions.
- Risky use of production credentials.
- Access to customer data, source code, tickets, internal docs, or infrastructure.

Prompt-injection and tool-description review:

- Tool descriptions that encourage unsafe model behavior.
- Descriptions that obscure sensitive capabilities.
- Workflows where untrusted content can influence high-impact tool calls.

Deliverables:

- Written report.
- Risk-ranked findings.
- Remediation checklist.
- Findings call if included in the purchased package.
- One re-scan if included in the purchased package.

## Not Included

This audit does not include:

- Full penetration testing.
- Exploit development.
- Social engineering.
- Phishing.
- Malware analysis.
- Source code review outside MCP-related configuration and tool behavior.
- Compliance certification.
- Legal opinion.
- Cloud account hardening unrelated to MCP usage.
- Continuous monitoring.
- Production traffic inspection.
- Runtime observability setup.
- Incident response.
- Secret rotation performed on behalf of the customer.
- Remediation implementation unless separately agreed.

## Customer Responsibilities

The customer must provide:

- Written authorization for the review.
- MCP configuration files or exports.
- List of environments in scope.
- Business context for connected systems.
- A technical contact for questions.
- Redacted or test credentials unless raw values are explicitly needed.

The customer is responsible for:

- Backing up configuration files.
- Rotating any exposed secrets.
- Implementing remediation.
- Validating changes in their own environment.

## Assumptions

- The audit is based on provided files and information.
- Findings reflect the reviewed snapshot, not future changes.
- MCPScan CLI output is one input to the audit, not the entire review.
- Manual review is limited to the purchased scope.
- Any environment not listed in the scope is excluded.

## Standard Package Scopes

### MCP Quick Audit

Price: $750

Includes:

- Up to 3 MCP servers.
- 1 environment.
- Written report.
- Remediation checklist.

Does not include:

- Findings call.
- Re-scan.
- Custom policy creation.

### MCP Launch Audit

Price: $1,500

Includes:

- Up to 8 MCP servers.
- Up to 2 environments.
- Written report.
- Remediation checklist.
- 30-minute findings call.
- 1 re-scan after fixes.

### MCP Enterprise Readiness Audit

Price: $3,500

Includes:

- Up to 15 MCP servers.
- Up to 3 environments.
- Written report.
- Executive summary.
- Remediation checklist.
- 45-minute findings call.
- 1 re-scan after fixes.
- Buyer-facing summary suitable for internal security review.

## Change Control

Scope changes require written approval before work continues.

Common changes:

- Additional MCP server: $150 each.
- Expedited 48-hour delivery: +50%.
- Additional remediation call: $250.
- Custom MCP security checklist or internal policy: $1,000.

## Sample Authorization Language

> Customer authorizes MCPScan to review the MCP configuration files, server definitions, tool descriptions, and related materials provided for the agreed audit scope. The review is limited to identifying configuration, permission, secret exposure, and prompt-injection risks. The audit does not include exploitation, penetration testing, social engineering, or remediation implementation unless separately agreed in writing.

