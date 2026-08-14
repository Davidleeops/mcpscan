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
| 1 | Partoo | Announced an MCP server opening its platform to AI agents | CTO, product security, AI platform lead | Agents interacting with platform data and features need clear approval evidence | MCP Launch Readiness Audit | Not approved |
| 2 | Coralogix | Announced MCP server access to observability data across environments | CTO, security engineering, observability platform owner | Observability data can include production context and incident evidence | MCP Quick Audit | Not approved |
| 3 | Trigger.dev | Official MCP server can initialize projects, trigger tasks, deploy, debug, and read runs | CTO, founder, developer experience lead | Developer automation and deployment actions need read/write boundaries | MCP Quick Audit | Not approved |
| 4 | Dust | Stripe customer story says Dust uses Stripe MCP to power AI agents with financial data | CTO, security lead, finance operations owner | Payment, refund, invoice, and financial-data actions need strong guardrails | MCP Enterprise Readiness Audit | Not approved |
| 5 | Visible.vc | Offers an AI MCP Server for portfolio data workflows | CTO, product lead, data/security owner | Portfolio and investor data need clean access boundaries and audit evidence | MCP Launch Readiness Audit | Not approved |
| 6 | Unity AI | Unity official MCP Server gives agents access to project runtime state and editor context | Product security, AI tools product lead | Developer environments and project state create approval and data-boundary questions | MCP Enterprise Readiness Audit | Not approved |
| 7 | Getty Images | Launched MCP Server for licensed creative, news, sport, entertainment, and archive content | Product security, platform partnerships, AI product owner | Licensed content and customer-facing AI access need governance proof | MCP Launch Readiness Audit | Not approved |
| 8 | Zendesk | Announced MCP adoption for AI connectivity across support data and workflows | Product security, AI platform, customer trust | Tickets, knowledge bases, and customer information are sensitive AI-agent surfaces | MCP Enterprise Readiness Audit | Not approved |
| 9 | Front | Community thread asks for an official Front MCP server and points to a community implementation | Developer relations, product security, platform lead | Customer communication workflows need a reviewed MCP trust path | MCP Exposure Snapshot | Not approved |
| 10 | Cua | Public launch note says official MCP Server support exposes computer-use agent functionality to Claude Desktop and Cursor | Founder, CTO, product security | Computer-use tools can perform broad actions and need explicit guardrails | MCP Quick Audit | Not approved |

## Source URLs

| Account | Source |
| --- | --- |
| Partoo | https://www.partoo.co/en/company/press/releases/partoo-launches-its-mcp-server-and-opens-its-platform-to-ai-agents/ |
| Coralogix | https://coralogix.com/blog/introducing-coralogixs-mcp-server-helping-customers-build-smarter-ai-agents/ |
| Trigger.dev | https://trigger.dev/launchweek/2/official-mcp-server |
| Trigger.dev update | https://trigger.dev/changelog/mcp-server-2-1 |
| Dust and Stripe | https://stripe.com/ae/customers/dust |
| Visible.vc | https://visible.vc/ai-mcp-server/ |
| Unity | https://unity.com/blog/unity-ai-mcp-how-to-get-started |
| Getty Images | https://newsroom.gettyimages.com/en/getty-images/getty-images-launches-mcp-server-to-connect-creative-and-editorial-content-to-ai-workflows-and-products |
| Zendesk | https://www.techradar.com/pro/zendesk-becomes-the-latest-to-adopt-mcp-to-futureproof-customers-in-the-ai-first-era |
| Front | https://community.front.com/developer-discussion-39/is-anyone-working-on-creating-an-mcp-server-for-frontapp-2309 |
| Cua | https://www.linkedin.com/posts/cua-ai_ai-developertools-startups-activity-7316634917759598592-lTRf |

## Outreach Guardrails

- Do not say the account is insecure.
- Do not say MCPScan found a vulnerability.
- Do not scan any third-party system without written authorization.
- Do not mention a named individual unless the founder selects and approves that exact recipient.
- Use public launch or documentation language only.
- Keep the CTA small: ask whether they want the one-page scope or a short readiness review.

## Account-Specific Draft Angles

### Partoo

```text
Subject: MCP readiness review for agent access

Hi {{first_name}},

I saw Partoo announced MCP server access for AI agents interacting with platform data and features.

I am reaching out with a narrow offer: a 72-hour MCP readiness audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

No assumption that anything is broken. The goal is simply to make the agent-access surface easy to review before customers or internal security teams ask for proof.

Worth sending the one-page scope?

{{sender_name}}
```

### Coralogix

```text
Subject: MCP audit evidence for observability access

Hi {{first_name}},

I saw Coralogix launched an MCP server for AI agents connecting to observability data across environments.

That is exactly the kind of integration where security reviewers tend to ask practical questions: which tools can read production context, what actions are available, how credentials are handled, and what evidence exists for approval.

MCPScan runs a fixed-scope MCP exposure audit and returns a concise report with inventory, risky action paths, auth/secrets review, and remediation steps.

Open to me sending the one-page scope?

{{sender_name}}
```

### Trigger.dev

```text
Subject: MCP readiness check for deploy and task tools

Hi {{first_name}},

I saw Trigger.dev has an official MCP server that can help agents initialize projects, trigger tasks, deploy, debug, and read runs.

For developer automation, the useful security question is not just whether the MCP server works. It is which actions are safe to approve, which should stay gated, and what evidence a customer or AppSec reviewer can inspect.

MCPScan runs a 72-hour MCP exposure audit and produces a buyer-safe remediation report.

Worth a quick look at the scope?

{{sender_name}}
```

### Dust

```text
Subject: MCP readiness review for payment-data agents

Hi {{first_name}},

I saw Stripe describe Dust using Stripe MCP so AI agents can work with financial data and payment workflows.

Payment-data MCP is a high-trust surface. The review question is usually: which actions are read-only, which can mutate billing or refunds, how credentials are scoped, and what audit evidence exists for approval.

MCPScan offers a fixed-scope MCP readiness audit for exactly that kind of agent workflow.

Worth sending the one-page scope?

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

## Next Research Expansion

After this first wave, source 30 more accounts from:

- Public MCP launch announcements.
- GitHub repos with official or commercial MCP servers.
- Cursor and GitHub community threads about MCP approvals.
- Companies hiring for AI platform security, AppSec, developer productivity, or agent infrastructure.
- Agencies building agent workflows that touch client systems.
