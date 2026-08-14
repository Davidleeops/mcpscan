# First Account Dossier

Date: August 14, 2026

Status: research only. This dossier does not authorize sending any message.

## Approval Rule

No outreach can be sent until the exact recipient and exact final content are approved in the same turn. Do not imply that any account has a vulnerability. The safe angle is readiness, audit evidence, and pre-rollout review.

## What This Dossier Solves

The earlier first-10 list described buyer profiles. This file turns that into concrete first-wave accounts with public signals, full account-specific copy, follow-ups, and safe approval language.

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

## Current Buyer Route Status

Use this table to approve the first contact route without guessing. Exact person-level outreach still requires same-turn approval of the exact recipient, route, and final message.

| Account | Exact Approved Route | Buyer Authority Confidence | Source Checked Date | Next Approval Click |
| --- | --- | --- | --- | --- |
| Vapi | Trust center: `https://security.vapi.ai/` | Medium | 2026-08-14 | Approve trust-route message or pick a named security owner |
| Retool | Vulnerability disclosure: `https://retool.com/vulnerability-reporting` | High | 2026-08-14 | Approve security-review wording that avoids vulnerability claims |
| Pipedream | Security inbox: `security@pipedream.com` | High | 2026-08-14 | Approve exact email recipient route and final copy |
| Composio | Security inbox: `security@composio.dev` | High | 2026-08-14 | Approve exact email recipient route and final copy |
| PostHog | Security inbox: `security-reports@posthog.com` | High | 2026-08-14 | Approve exact email recipient route and final copy |
| Statsig | Contact form: `https://www.statsig.com/contact/us` | Medium | 2026-08-14 | Approve form-route message or pick a named security owner |
| Braintrust | Trust inbox: `trust@braintrustdata.com` | Medium | 2026-08-14 | Approve trust-route message or pick a named security owner |
| Granola | Security inbox: `security@granola.so` | High | 2026-08-14 | Approve exact email recipient route and final copy |
| Sentry | Security inbox: `security@sentry.io` | High | 2026-08-14 | Approve exact email recipient route and final copy |
| Replit | Security inbox: `security@replit.com` | High | 2026-08-14 | Approve exact email recipient route and final copy |

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

## Account-Specific Drafts

### Vapi

```text
Subject: MCP readiness review for voice-agent tools

Hi {{first_name}},

I saw Vapi exposes APIs as MCP tools for assistants, phone numbers, and calls. Voice-agent tooling is a high-trust surface because it can touch real customer interactions, phone workflows, and operational actions. MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence. Worth sending the one-page scope?

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

I saw Pipedream provides MCP servers across thousands of apps and pre-built tools. That breadth is valuable, but it also makes the review question practical: which tools can act, whose credentials are used, and what should be gated before customer or enterprise rollout? MCPScan runs a fixed-scope MCP Launch Audit for exactly that kind of connected-agent surface. Worth a quick look at the scope?

{{sender_name}}
```

### Composio

```text
Subject: MCP trust review for gateway-managed tools

Hi {{first_name}},

I saw Composio is positioning MCP gateway management around managed tools, custom MCP servers, central enable/disable, and team ownership. For gateway products, buyers tend to ask for clear evidence around tool inventory, ownership, auth, and what actions are enabled for which teams. MCPScan runs a focused MCP exposure audit and can produce a buyer-safe summary that supports those conversations. Worth sending the one-page scope?

{{sender_name}}
```

### PostHog

```text
Subject: MCP readiness check for analytics and feature-flag tools

Hi {{first_name}},

I saw PostHog MCP supports analytics queries, feature flags, experiments, SQL, CDP destinations, and support-ticket workflows. Because those surfaces can affect product data and rollout behavior, the useful security artifact is a clear map of tool permissions, approval gates, and remediation priorities. MCPScan can deliver that as a fixed-scope audit. Worth sending the one-page scope?

{{sender_name}}
```

### Statsig

```text
Subject: MCP readiness check for feature-gate actions

Hi {{first_name}},

I saw Statsig MCP supports both read and write tools for gates, experiments, configs, and bulk changes. Feature gates and experiments are production-control surfaces, so the security review usually comes down to tool scopes, write permissions, approval gates, and audit evidence. MCPScan runs a fixed-scope MCP Launch Audit that turns that surface into a concise remediation report. Open to me sending the one-page scope?

{{sender_name}}
```

### Braintrust

```text
Subject: MCP exposure snapshot for eval and log access

Hi {{first_name}},

I saw Braintrust MCP lets AI coding tools query experiments, search docs, and analyze production logs. Evals and logs often include prompts, outputs, traces, and real customer examples, so a lightweight MCP review can help show what data agents can reach and which actions should be approved or gated. MCPScan can run that as a focused exposure snapshot with buyer-safe remediation notes. Worth a quick look?

{{sender_name}}
```

### Granola

```text
Subject: MCP exposure snapshot for meeting-note access

Hi {{first_name}},

I saw Granola MCP connects meeting notes to Claude, ChatGPT, Cursor, and other AI tools. Meeting notes can contain sales, legal, hiring, product, and customer-sensitive context, so the useful review is practical: who can connect, what gets exposed, what is logged, and what should be gated. MCPScan runs a focused MCP exposure audit and returns a concise buyer-safe report. Worth sending the one-page scope?

{{sender_name}}
```

### Sentry

```text
Subject: MCP readiness review for error and trace access

Hi {{first_name}},

I saw Sentry MCP connects AI assistants to errors, performance data, issue triage, docs, and project management. Error traces and project data can carry sensitive production context, so security reviewers tend to ask what agents can read, what they can change, and how tool calls are attributed. MCPScan runs a fixed-scope MCP Launch Audit and produces a buyer-safe remediation report. Open to me sending the one-page scope?

{{sender_name}}
```

### Replit

```text
Subject: MCP exposure review for custom coding-agent tools

Hi {{first_name}},

I saw Replit Agent supports connecting pre-listed and custom MCP servers, with guidance to trust sources and review access. Custom MCP inside a coding environment is powerful, but it creates a practical review need around tool poisoning, credential exposure, workspace access, and unsafe actions. MCPScan runs a fixed-scope exposure audit for that surface and returns a concise remediation plan. Worth sending the one-page scope?

{{sender_name}}
```

## Follow-Up Sequence

Use only after the first approved message was sent manually.

### Follow-Up 1, Two Business Days Later

```text
Subject: Re: MCP readiness review

Hi {{first_name}},

Quick follow-up. The useful version of this is not a broad pentest or a generic scanner output. It is a short MCP exposure review that answers: which servers and tools exist, what can read or write, what credentials are involved, what should be gated, and what evidence a buyer or AppSec reviewer can inspect.

Worth sending the one-page scope?

{{sender_name}}
```

### Follow-Up 2, Six Business Days Later

```text
Subject: Re: MCP readiness review

Hi {{first_name}},

Closing the loop here. If MCP review is not a priority right now, no worries.

If it is on the roadmap, the small scope I had in mind is a fixed-scope MCP Launch Audit with a server/tool inventory, risky action map, auth and secrets review, approval-gate notes, and a buyer-safe remediation summary.

Should I send the scope, or circle back later?

{{sender_name}}
```

### Reply Handler, Interested

```text
Thanks, {{first_name}}. The usual starting point is the MCP Launch Audit: fixed scope, 5-business-day review after complete safe intake, and a buyer-safe report. It covers server/tool inventory, read/write/destructive action classification, auth and secrets exposure, approval gates, and a prioritized remediation checklist.

I can send the payment link and secure intake after scope approval. Nothing sensitive should be sent over email.
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
