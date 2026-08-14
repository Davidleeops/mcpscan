# First Account Dossier

Date: August 14, 2026

Status: research only. This dossier does not authorize sending any message.

## Approval Rule

No outreach can be sent until the exact recipient and exact final content are approved in the same turn. Do not imply that any account has a vulnerability. The safe angle is readiness, audit evidence, and pre-rollout review.

## What This Dossier Solves

The earlier first-10 list described buyer profiles. This file turns that into concrete first-wave accounts with public signals and safe outreach angles.

Use it to choose the first 10 outreach approvals after domain, mailbox, and Stripe are live.

## Recommended First Wave

| # | Account | Public Signal | Likely Buyer | Risk Angle | Offer Fit | Approval Status |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Vapi | Vapi exposes APIs as MCP tools for assistants, phone numbers, and calls. | Head of Engineering, Security Lead, CTO | Voice agents can touch real calls, phone numbers, workflows, and customer interactions. | MCP Quick Audit | Not approved |
| 2 | Retool | Retool MCP lets agents manage apps, workflows, users, and org resources from Claude, Cursor, Codex, or Kiro. | Product Security Lead, Enterprise Engineering Lead | Admin and internal-tool surfaces need scope, audit, and approval controls. | MCP Quick Audit | Not approved |
| 3 | Pipedream | Pipedream provides MCP servers for thousands of apps and pre-built tools with managed OAuth and credential storage. | Head of Platform, Security Engineering Lead | Broad SaaS integration surfaces need permissions, auth review, inventory, and abuse-path analysis. | MCP Quick Audit | Not approved |
| 4 | Composio | Composio offers centralized MCP server management, managed toolkits, and custom MCP servers behind one gateway. | Founder, CTO, Head of Platform | Gateway products need buyer trust around auth, tool enablement, ownership, and team controls. | MCP Quick Audit plus buyer-safe summary | Not approved |
| 5 | PostHog | PostHog MCP lets agents run analytics queries, manage feature flags and experiments, triage tickets, use SQL, and work with CDP destinations. | Product Security Lead, Head of Engineering | Analytics plus feature flags means agents can read product data and change rollout behavior. | MCP Quick Audit | Not approved |
| 6 | Statsig | Statsig MCP supports read tools and write tools for gates, experiments, configs, and bulk changes. | Product Security Lead, Platform Engineering Lead | Feature gates and experiments are production-control surfaces that need least-privilege checks. | MCP Quick Audit | Not approved |
| 7 | Braintrust | Braintrust MCP lets AI coding tools query experiments, search docs, and analyze production logs. | Security Lead, Head of Product Engineering | Evals, prompts, logs, and traces may contain sensitive production data and customer examples. | MCP Exposure Audit | Not approved |
| 8 | Granola | Granola MCP connects meeting notes to Claude, ChatGPT, Cursor, and other AI tools. | Security Lead, CTO, Head of Enterprise | Meeting notes and transcripts can include sales, legal, hiring, product, and customer secrets. | MCP Exposure Audit | Not approved |
| 9 | Sentry | Sentry MCP connects AI assistants to errors, performance, issue triage, docs, and project management. | Product Security Lead, Developer Platform Lead | Error traces and project data can include secrets, PII, stack details, and production context. | MCP Quick Audit | Not approved |
| 10 | Replit | Replit Agent can connect to pre-listed and custom MCP servers, with guidance to trust sources and review access. | Head of Security, AI Platform Lead | Custom MCP servers inside coding environments create tool-poisoning, credential, workspace, and unsafe execution risks. | Platform Exposure Audit | Not approved |

## Source URLs

| Account | Source |
| --- | --- |
| Vapi | https://docs.vapi.ai/sdk/mcp-server |
| Retool | https://retool.com/blog/retool-mcp-server |
| Pipedream | https://pipedream.com/docs/connect/mcp |
| Composio | https://composio.dev/mcp-gateway |
| PostHog | https://posthog.com/docs/model-context-protocol |
| Statsig | https://docs.statsig.com/integrations/mcp/overview |
| Braintrust | https://www.braintrust.dev/docs/integrations/developer-tools/mcp |
| Granola | https://www.granola.ai/blog/granola-mcp |
| Sentry | https://mcp.sentry.dev/ |
| Replit | https://docs.replit.com/build/connect-via-mcp |

## Outreach Guardrails

- Do not say the account is insecure.
- Do not say MCPScan found a vulnerability.
- Do not scan any third-party system without written authorization.
- Do not mention a named individual unless the founder selects and approves that exact recipient.
- Use public launch or documentation language only.
- Keep the CTA small: ask whether they want the one-page scope or a short readiness review.

## Account-Specific Draft Angles

### Vapi

```text
Subject: MCP readiness review for voice-agent tools

Hi {{first_name}},

I saw Vapi exposes APIs as MCP tools for assistants, phone numbers, and calls. Voice-agent tooling is a high-trust surface because it can touch real customer interactions, phone workflows, and operational actions. MCPScan runs a 72-hour MCP exposure audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence. Worth sending the one-page scope?

{{sender_name}}
```

### Retool

```text
Subject: MCP readiness review for internal-tool access

Hi {{first_name}},

I saw Retool MCP lets agents manage apps, workflows, users, and org resources from Claude, Cursor, Codex, or Kiro. Internal-tool MCP is exactly where enterprise reviewers tend to ask about scopes, user authority, audit logs, and approval boundaries. MCPScan runs a fixed-scope MCP audit and produces a buyer-safe report with inventory, risky action paths, auth/secrets review, and remediation steps. Open to me sending the one-page scope?

{{sender_name}}
```

### Pipedream

```text
Subject: MCP exposure review for broad SaaS tool access

Hi {{first_name}},

I saw Pipedream provides MCP servers across thousands of apps and pre-built tools. That breadth is valuable, but it also makes the review question practical: which tools can act, whose credentials are used, and what should be gated before customer or enterprise rollout? MCPScan runs a 72-hour MCP exposure audit for exactly that kind of connected-agent surface. Worth a quick look at the scope?

{{sender_name}}
```

### PostHog

```text
Subject: MCP readiness check for analytics and feature-flag tools

Hi {{first_name}},

I saw PostHog MCP supports analytics queries, feature flags, experiments, SQL, CDP destinations, and support-ticket workflows. Because those surfaces can affect product data and rollout behavior, the useful security artifact is a clear map of tool permissions, approval gates, and remediation priorities. MCPScan can deliver that as a fixed-scope audit. Worth sending the one-page scope?

{{sender_name}}
```

## Approval Prompt

Use this before any outreach:

```text
Please approve or revise this outreach. I will not send anything unless you approve the exact recipient and exact final content in this same turn.

Account: {{account}}
Channel: {{email_or_linkedin}}
Recipient: {{name}}, {{title}}, {{company}}, {{contact}}
Source URL: {{public_signal_url}}
Final message:
{{paste_exact_message}}
```

## Reserve Accounts

Use these only after the first wave is approved, rejected, or exhausted:

- Partoo, MCP server for platform data and features.
- Coralogix, MCP server for observability data.
- Trigger.dev, MCP server for tasks, deployment, debugging, and runs.
- Dust, Stripe MCP use for payment and financial workflows.
- Visible.vc, AI MCP Server for portfolio data.
- Unity, official MCP Server for editor and project context.
- Getty Images, MCP Server for licensed media access.
- Zendesk, MCP adoption for support data and AI connectivity.
- Front, community demand for an official MCP server.
- Cua, MCP support for computer-use agent functionality.
