# Prospect Pools

Date: July 15, 2026

Use this as a sourcing map for the first 100 accounts. Public evidence proves
that the ecosystem has MCP capability or security pressure; it does not prove
that any individual account has deployed MCP internally. Qualify before outreach.

## Best First Channels

1. GitHub/Copilot Enterprise admins and AppSec teams.
2. Slack and Atlassian admin/security communities.
3. AI coding-tool communities: Cursor, Claude Code, Goose, Continue, VS Code MCP users.

## Seed Pools

| Pool | Trigger To Search For | Buyer | Likely Pain | Offer |
| --- | --- | --- | --- | --- |
| Copilot Enterprise orgs | "Copilot coding agent" + MCP + enterprise | AppSec / VP Eng | Autonomous tools, repo/org access | Enterprise Readiness |
| GitHub MCP users | GitHub MCP server, PAT scopes, repo automation | DevSecOps | Token scope and repository access | Launch Audit |
| Slack Enterprise Grid | Slack MCP apps, Slackbot MCP, workspace data | IT/security | Messages, canvases, internal docs | Enterprise Readiness |
| Atlassian Cloud / Rovo | Jira/Confluence/Bitbucket MCP | Atlassian admin / EngOps | Tickets, docs, project workflows | Enterprise Readiness |
| Claude Code teams | Claude Code MCP, internal tools | Eng leadership | Developer machines and credentials | Launch Audit |
| Cursor Teams | Cursor MCP security concerns | AI devtools owner | Shadow MCP configs | Launch Audit |
| Langdock customers | Remote MCP directory adoption | AI platform | Multiple official MCPs | Enterprise Readiness |
| Cloudflare MCP users | Workers/KV/R2 MCP | Platform engineering | Infra write access | Enterprise Readiness |
| Sentry MCP users | Monitoring API access | Observability/AppSec | Incident and error context | Quick Audit |
| Stripe MCP users | Payment/subscription data | Payments/security | Financial data exposure | Enterprise Readiness |
| Supabase MCP users | Project/database management | CTO/platform | Backend and data access | Launch Audit |
| Neon MCP users | Postgres branch management | Infra/DB platform | Database automation | Launch Audit |
| Vercel MCP users | Deploy/manage projects | Frontend platform | Deployment permissions | Launch Audit |
| Netlify MCP users | Project/function automation | DevOps | Deployment permissions | Launch Audit |
| PagerDuty MCP users | Incident workflow automation | SRE/security | Incident actions and schedules | Enterprise Readiness |
| Linear MCP users | Issue/project workflows | EngOps | Roadmap/ticket changes | Quick Audit |
| Notion MCP users | Workspace docs access | IT/knowledge/security | Internal knowledge exposure | Launch Audit |
| PostHog MCP users | Analytics/flags/errors | Product engineering | PII, flags, analytics access | Launch Audit |
| Ramp MCP users | Spend and finance workflows | Finance IT/security | Finance data exposure | Enterprise Readiness |
| Goose community | Local agent extensions | OSS/platform | Local credentials and extensions | Community wedge |

## First-Line Angles

- "Before this MCP setup reaches customer data, can you show what the agent can access?"
- "MCP is moving from local dev into enterprise review; the missing artifact is usually inventory plus remediation owners."
- "A quick readiness audit can catch risky tool chains before a gateway/procurement process starts."
- "This is not a certification or pentest; it is the baseline evidence security reviewers ask for first."

## Qualification Questions

- Which MCP clients are in use: Claude Desktop, Claude Code, Cursor, VS Code, Copilot, Goose, Langdock, or other?
- Which tools can read or write company data?
- Are any credentials, repositories, databases, support systems, finance systems, or deployment systems in scope?
- Is this for internal rollout, customer pilot, enterprise review, or agency client handoff?
- Is the team looking for a one-time report, CI gating, continuous monitoring, or a gateway decision?

