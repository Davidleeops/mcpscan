# MCPScan Buyer-Facing Summary

Customer: `{{customer_name}}`  
Prepared for: `{{audience}}`  
Prepared by: MCPScan  
Date: `{{date}}`  
Decision: `{{approve | approve_with_guardrails | block_until_remediation}}`

## Summary For Reviewers

MCPScan reviewed the MCP servers, tool exposure, configuration evidence, and security controls provided for `{{customer_name}}`. The review focused on whether the current MCP setup is ready for broader use by AI agents that may interact with code, internal systems, customer data, tickets, chat, docs, databases, cloud resources, CI/CD, or other business-critical systems.

## Approval Recommendation

`{{approval_recommendation}}`

Use one:

- Approved for the reviewed scope.
- Approved for limited rollout with the guardrails below.
- Not approved for broader rollout until the remediation items below are complete.

## What Was Reviewed

- MCP clients / agent tools: `{{clients}}`
- MCP servers: `{{servers}}`
- Environments: `{{environments}}`
- High-impact systems touched: `{{systems}}`
- Evidence reviewed: `{{evidence_summary}}`

## Key Findings

| Priority | Finding | Why It Matters | Required Action |
| --- | --- | --- | --- |
| P0 | `{{finding_1}}` | `{{impact_1}}` | `{{action_1}}` |
| P1 | `{{finding_2}}` | `{{impact_2}}` | `{{action_2}}` |
| P2 | `{{finding_3}}` | `{{impact_3}}` | `{{action_3}}` |

## Guardrails Required

- `{{guardrail_1}}`
- `{{guardrail_2}}`
- `{{guardrail_3}}`

## Reviewer Questions Answered

| Question | Answer |
| --- | --- |
| Which MCP servers are in scope? | `{{servers_answer}}` |
| Can tools read sensitive systems? | `{{read_answer}}` |
| Can tools write, delete, execute, or call external systems? | `{{write_execute_answer}}` |
| Are production credentials or secrets exposed? | `{{secrets_answer}}` |
| Is a re-scan needed before approval? | `{{rescan_answer}}` |

## Limitations

This summary is based on the materials reviewed during the agreed MCPScan readiness audit. It is not a penetration test, compliance certification, legal opinion, or guarantee of complete security. Any MCP server, tool, credential, policy, or environment change after the review may require re-assessment.
