# MCPScan Service Agreement Appendix

This appendix is a buyer-ready operating agreement for fixed-scope MCP readiness audits. It is not a substitute for legal advice or a negotiated master services agreement. Use it to clarify authorization, scope, data handling, deliverables, and boundaries before work starts.

## Parties

- Provider: MCPScan
- Customer: `{{customer_name}}`
- Package: `{{package_name}}`
- Effective date: `{{effective_date}}`
- Technical contact: `{{technical_contact}}`
- Billing contact: `{{billing_contact}}`

## Authorized Review

Customer authorizes MCPScan to review the MCP configuration files, server definitions, tool descriptions, permissions, policy exports, screenshots, and related materials provided by Customer for the agreed audit scope.

The review is limited to identifying MCP-related configuration, permission, secret exposure, tool-description, prompt-injection, approval, and governance risks. MCPScan will not perform live exploitation, penetration testing, social engineering, phishing, destructive testing, malware deployment, credential stuffing, or remediation implementation unless separately agreed in writing.

## Scope

The audit is limited to the package and materials approved at intake.

| Package | Standard Scope | Delivery Target |
| --- | --- | --- |
| MCP Quick Audit | Up to 3 MCP servers, 1 environment, written report | 3 business days after complete intake |
| MCP Launch Audit | Up to 8 MCP servers, up to 2 environments, report, findings call, 1 re-scan | 5 business days after complete intake |
| MCP Enterprise Readiness Audit | Up to 15 MCP servers, up to 3 environments, executive summary, report, findings call, 1 re-scan, buyer-facing summary | 7 business days after complete intake |

Scope changes require written approval before work continues. Common changes include additional MCP servers, expedited delivery, additional remediation calls, custom policies, or review of systems outside the package.

## Customer Responsibilities

Customer is responsible for:

- having authority to submit all reviewed materials
- providing accurate scope, environment, and business-context information
- sanitizing configs and screenshots where possible
- avoiding production credentials, active tokens, customer data, and unrelated source code unless an approved private handoff path is used
- backing up configuration files before making changes
- implementing remediation
- rotating any exposed secrets
- validating changes in Customer's environment

## Safe Material Handoff

Preferred handoff methods:

1. Customer-owned private repository with time-limited read access.
2. Customer-owned shared folder with time-limited access.
3. Encrypted archive, with the password sent through a separate channel.
4. Sanitized screenshots or config excerpts when full files are not required.

Do not use public GitHub issues or ordinary email for active credentials, production secrets, customer data, private source code, regulated records, or final private reports.

## Confidentiality

MCPScan will use Customer materials only to perform the agreed audit and will not knowingly disclose non-public Customer materials except as needed to deliver the service, comply with law, or respond to security/legal obligations.

Customer should mark sensitive materials clearly and should not provide materials outside the agreed scope. MCPScan may use anonymized, aggregated learnings to improve its methodology, but will not identify Customer publicly without written permission.

## Deliverables

Deliverables may include:

- MCP server and tool inventory
- risk-ranked findings
- evidence and business impact
- auth, permission, and secret-handling review
- prompt-injection and tool-description review
- approval recommendation: approve, approve with guardrails, or block until remediation
- remediation checklist
- findings call, if included
- re-scan, if included
- buyer-facing summary, if included

Findings reflect the reviewed snapshot and materials available at the time of assessment.

## Refund Boundary

Payment is due before audit work begins unless otherwise agreed. A full refund is available before intake begins. After intake begins, refunds are discretionary because delivery work has started.

The delivery clock starts after complete intake, not at checkout.

## No Guarantee

MCPScan audits are not compliance certifications, legal opinions, security guarantees, insurance, full penetration tests, or proof that an environment is secure. The audit is a focused readiness review based on the agreed scope.

## Liability Boundary

To the fullest extent allowed by applicable law, MCPScan's aggregate liability for a fixed-scope audit is limited to the amount paid for that audit. MCPScan is not responsible for indirect, incidental, consequential, special, exemplary, lost-profit, lost-revenue, business-interruption, data-loss, or remediation-cost damages.

## Customer Acceptance

Use this acceptance block when a buyer needs written acknowledgement before work starts.

```text
Customer authorizes MCPScan to perform the fixed-scope MCP readiness audit described above.

Customer:
Authorized signer:
Title:
Date:
Package:
Scope notes:
Out-of-scope systems:
Private handoff path:
```

