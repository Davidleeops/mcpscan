# MCPScan Prospect Qualification Scorecard

Use this before approving outbound. Prioritize accounts with visible MCP rollout pressure and a reachable security/platform owner.

## Scoring

| Signal | Points | What Counts |
| --- | --- | --- |
| Active MCP rollout | 3 | Public docs, issues, job posts, forum posts, or product/admin references show current MCP usage. |
| Security owner visible | 2 | AppSec, platform, security engineering, DevSecOps, IT admin, or developer productivity owner can be identified. |
| High-risk tools | 2 | GitHub, Slack, Jira, Confluence, database, filesystem, CI/CD, cloud, or internal admin tools are in scope. |
| Launch pressure | 2 | Copilot/Claude/Cursor rollout, enterprise review, customer pilot, or AI platform initiative appears time-bound. |
| Regulated or enterprise buyer | 1 | Fintech, health-adjacent, B2B SaaS, infra, security, or enterprise-heavy customer base. |

Score guide:

- 8-10: approve for first-wave outreach if recipient and message are ready.
- 6-7: good target, personalize before approval.
- 4-5: keep researching.
- 0-3: skip unless a stronger trigger appears.

## Capture Template

```text
Account:
Contact/persona:
Source URL:
Trigger:
Likely MCP surface:
Pain:
Score:
Recommended offer:
Draft angle:
Approval status: Not approved to send
```

## Best First Angles

- GitHub/Copilot Enterprise: MCP allowlist readiness and repo/org tool exposure.
- Claude Code/Cursor/VS Code: shadow MCP configs and developer-machine credential exposure.
- Slack/Atlassian: internal data access, read/write boundaries, OAuth, and permission-aware approvals.
- Platform/AppSec: independent evidence report before broad MCP enablement.

Outbound rule:

No external message is sent until exact recipient and exact final content are approved in the same turn.

