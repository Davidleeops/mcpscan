# MCPScan Discovery Call Script

Use this when a prospect replies or asks what the audit includes.

## Goal

Decide whether the buyer needs:

- MCP Quick Audit: small scope, up to 3 MCP servers, 1 environment.
- MCP Launch Audit: main offer, up to 8 MCP servers, up to 2 environments.
- MCP Enterprise Readiness Audit: broader enterprise/security review, up to 15 MCP servers, up to 3 environments.

## Opening

```text
The useful version of this conversation is practical: what MCP access are you trying to enable, what would make AppSec comfortable, and what evidence do you need before rollout?
```

## Questions

1. Which MCP-enabled tools are in scope: Copilot, Claude Code, Cursor, VS Code, Slack, Atlassian/Rovo, internal tools, databases, or something else?
2. How many MCP servers/configs do you already have or expect to approve?
3. Are any tools write-capable, destructive, admin-level, filesystem-level, database-connected, or network-connected?
4. Where do configs live: developer machines, repos, managed settings, admin dashboards, or a gateway?
5. What credentials/auth patterns are involved: OAuth, PATs, API keys, bearer tokens, local env vars, or service accounts?
6. What decision do you need from this audit: approve, approve with guardrails, or block until fixes?
7. Is there a buyer/security deadline, launch date, pilot, or enterprise review date?
8. Who needs the final report: AppSec, platform engineering, IT, legal/compliance, customer security, or executives?
9. Can you provide sanitized configs first?
10. If sensitive evidence is needed, what private handoff path can you use?

## Package Mapping

| Signal | Recommended Offer |
| --- | --- |
| 1-3 MCP servers, one environment, no findings call needed | MCP Quick Audit |
| 4-8 MCP servers, launch/customer pilot/internal rollout | MCP Launch Audit |
| 9-15 MCP servers, multiple environments, executive/buyer-facing summary needed | MCP Enterprise Readiness Audit |
| Production secrets or customer data required | Pause and set private handoff before scope |
| More than 15 servers or remediation implementation requested | Custom scope, do not sell fixed package without review |

## Objections

### We already have native controls.

```text
That helps. MCPScan is not replacing native controls. The audit gives an independent readiness snapshot across the configs, servers, tools, auth patterns, and approval evidence your team is actually using.
```

### Is this a pentest?

```text
No. It is a fixed-scope MCP readiness review. We do not perform live exploitation or destructive testing unless separately scoped.
```

### Can we send production configs?

```text
Start with sanitized configs. If sensitive evidence is unavoidable, we confirm a private handoff path first. Do not send secrets or customer data through public issues or ordinary email.
```

### Why now?

```text
MCP access tends to spread from useful local developer configs into a real approval problem. It is cheaper to classify servers, tool permissions, and auth exposure before broad rollout than after teams depend on it.
```

## Close

```text
Based on that scope, I would recommend {{package}}. The next step is sanitized intake. After intake is complete, the delivery clock starts and you get the readiness report with approve / guardrails / block recommendations.
```

## Follow-Up Rule

Do not send the follow-up note or checkout link until the exact recipient and final content are approved in the same turn.

