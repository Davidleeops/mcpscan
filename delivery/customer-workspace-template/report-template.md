# MCPScan Readiness Audit Report

Customer: `{{customer_name}}`  
Package: `{{package_name}}`  
Prepared for: `{{buyer_or_team}}`  
Prepared by: MCPScan  
Report date: `{{report_date}}`  
Assessment window: `{{assessment_window}}`  
Decision: `{{approve | approve_with_guardrails | block_until_remediation}}`

## 1. Executive Summary

MCPScan reviewed the MCP servers, tool definitions, configuration materials, and customer-provided context listed in this report. The review focused on whether the current MCP setup is ready for broader use by AI agents that may touch code, tickets, chat, docs, databases, cloud resources, CI/CD, customer records, or internal APIs.

### Readiness Decision

`{{decision_statement}}`

Use one:

- `Approve`: No Critical or High issues remain in the reviewed scope, and required guardrails are documented.
- `Approve with guardrails`: MCP can proceed for a limited rollout after named guardrails are applied.
- `Block until remediation`: MCP should not expand until Critical or High findings are fixed and re-scanned.

### Top Risks

1. `{{top_risk_1}}`
2. `{{top_risk_2}}`
3. `{{top_risk_3}}`

### Required Next Actions

1. `{{next_action_1}}`
2. `{{next_action_2}}`
3. `{{next_action_3}}`

## 2. Scope Reviewed

### In Scope

| Item | Details |
| --- | --- |
| MCP clients / agent tools | `{{clients}}` |
| MCP servers | `{{servers}}` |
| Environments | `{{environments}}` |
| Config sources | `{{config_sources}}` |
| Admin/policy evidence | `{{admin_evidence}}` |
| Business systems touched | `{{business_systems}}` |

### Out Of Scope

- Production exploitation
- Penetration testing
- Social engineering
- Phishing
- Malware analysis
- Remediation implementation
- Compliance certification
- Legal opinion
- Systems, environments, repositories, datasets, and accounts not listed in scope

## 3. Method

MCPScan used a fixed-scope readiness review based on the materials available at assessment time.

Review activities:

- MCP server and tool inventory
- read/write/delete/execute/network capability classification
- command, file, database, API, and workflow risk review
- authentication and secret-handling review
- environment variable and file-path exposure review
- prompt-injection and tool-description risk review
- allowlist, approval, and governance review where evidence was provided
- MCPScan CLI analysis where applicable
- manual prioritization based on business context

## 4. Readiness Decision

Decision: `{{decision}}`

Rationale:

`{{decision_rationale}}`

Approval conditions:

- `{{approval_condition_1}}`
- `{{approval_condition_2}}`
- `{{approval_condition_3}}`

Re-scan trigger:

`{{rescan_trigger}}`

## 5. MCP Server And Tool Inventory

| Server | Owner | Purpose | Data touched | Read | Write | Delete | Execute | Network | Approval state | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `{{server_name}}` | `{{owner}}` | `{{purpose}}` | `{{data}}` | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Approved / Guardrail / Blocked | `{{notes}}` |

## 6. Findings Summary

| Severity | Count | Meaning |
| --- | ---: | --- |
| Critical | `{{critical_count}}` | Must fix before rollout or customer acceptance. |
| High | `{{high_count}}` | Fix before broad rollout. Limited testing only with explicit guardrails. |
| Medium | `{{medium_count}}` | Fix in planned remediation window. Monitor until closed. |
| Low | `{{low_count}}` | Improve as part of hygiene or next release. |
| Informational | `{{info_count}}` | Awareness or evidence note. |

## 7. Detailed Findings

### MCP-001 `{{finding_title}}`

Severity: `{{critical | high | medium | low | informational}}`  
Area: `{{auth | secrets | permissions | input | output | prompt_injection | governance | transport | inventory}}`  
Affected server/tool: `{{server_or_tool}}`  
Status: `{{open | accepted | remediated | needs_rescan}}`

#### Evidence

`{{specific_evidence}}`

#### Business Impact

`{{business_impact}}`

#### Recommendation

`{{recommendation}}`

#### Owner And Target Date

Owner: `{{owner}}`  
Target date: `{{target_date}}`

## 8. Auth And Secrets Review

Summary:

`{{auth_secrets_summary}}`

Observed risks:

- `{{auth_risk_1}}`
- `{{auth_risk_2}}`
- `{{auth_risk_3}}`

Required actions:

- `{{auth_action_1}}`
- `{{auth_action_2}}`
- `{{auth_action_3}}`

## 9. Prompt-Injection And Tool-Description Review

Summary:

`{{prompt_injection_summary}}`

Observed risks:

- `{{prompt_risk_1}}`
- `{{prompt_risk_2}}`
- `{{prompt_risk_3}}`

Required actions:

- `{{prompt_action_1}}`
- `{{prompt_action_2}}`
- `{{prompt_action_3}}`

## 10. Governance Recommendations

| Control | Recommendation | Priority |
| --- | --- | --- |
| Approved server list | `{{approved_server_recommendation}}` | P0/P1/P2 |
| Blocked server list | `{{blocked_server_recommendation}}` | P0/P1/P2 |
| Tool approval rules | `{{tool_approval_recommendation}}` | P0/P1/P2 |
| Secret handling | `{{secret_handling_recommendation}}` | P0/P1/P2 |
| Change review | `{{change_review_recommendation}}` | P0/P1/P2 |
| Logging/audit evidence | `{{logging_recommendation}}` | P0/P1/P2 |

## 11. Remediation Plan

| Priority | Action | Owner | Target date | Evidence needed for closure |
| --- | --- | --- | --- | --- |
| P0 | `{{p0_action}}` | `{{owner}}` | `{{date}}` | `{{evidence}}` |
| P1 | `{{p1_action}}` | `{{owner}}` | `{{date}}` | `{{evidence}}` |
| P2 | `{{p2_action}}` | `{{owner}}` | `{{date}}` | `{{evidence}}` |

## 12. Re-Scan Plan

Included re-scan: `{{yes | no}}`

If included, MCPScan will re-check the named remediated findings after the customer provides sanitized evidence of changes. The re-scan does not expand the original scope unless separately approved.

Re-scan inputs needed:

- updated sanitized MCP configs
- list of findings believed remediated
- screenshots or exports of updated admin settings
- changed server/tool permissions

## 13. Limitations

This audit reflects the materials reviewed at the time of assessment. It is not a penetration test, compliance certification, legal opinion, insurance product, or guarantee of complete security. Future MCP server changes, tool metadata drift, credential changes, client behavior, or new integrations may change the risk posture.

## 14. Appendix

| Evidence | Location / Notes |
| --- | --- |
| Scan command | `{{scan_command}}` |
| Scan output | `{{scan_output_location}}` |
| Config files reviewed | `{{config_files}}` |
| Admin/policy exports reviewed | `{{admin_exports}}` |
| Customer questions | `{{customer_questions}}` |
