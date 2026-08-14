# Public Launch Post Approval

Use this after the domain, mailbox, and Stripe links are live. These are public awareness posts, not outbound prospect messages.

## Rule

Do not publish public posts until the exact channel and exact final text are approved in the same turn.

## Where To Post First

Use public posts to support the sales motion, not replace it.

Best first channels:

- LinkedIn founder post
- Hacker News Show HN post, only after the public page and sample report are live on the chosen domain
- relevant MCP or AI engineering community post where self-promotion is allowed
- X post only as a lightweight amplification channel

Avoid posting into vulnerability disclosure channels, vendor security inboxes, or customer support forums as public promotion.

## Founder Approval Text

```text
I approve staging this exact MCPScan public launch post.

Channel:
Post title:
Post URL:

Final post:
{{paste exact post}}

Approved action:
Stage this public launch post outside the public repo for manual publishing review. Do not publish automatically.
```

## LinkedIn Founder Post

```text
I built MCPScan around a practical problem I keep seeing with AI agents: teams are connecting tools, code, tickets, docs, SaaS actions, and customer data before they have a clear inventory of what the agent can reach.

The first offer is not a SaaS platform. It is a fixed-scope MCP Launch Audit:

- server and tool inventory
- read, write, and destructive action classification
- auth and secret-handling review
- prompt-injection and tool-description risk review
- remediation checklist
- buyer-safe report

Best fit: teams turning on Copilot, Claude Code, Cursor, VS Code agent mode, Slack MCP, Atlassian Rovo, or custom MCP servers.

The goal is simple: help teams enable MCP with evidence before access becomes unmanaged.

Scope and sample report:
{{public_url}}
```

## Show HN Draft

Title:

```text
Show HN: MCPScan, a fixed-scope readiness audit for Model Context Protocol tools
```

Post:

```text
I built MCPScan as a service-first security audit for teams enabling Model Context Protocol tools.

The scanner helps inventory MCP servers and tools, classify read/write/destructive actions, review auth and secret-handling risks, and produce a buyer-safe remediation report.

I am not positioning this as a compliance certification or complete security assessment. The first offer is a fixed-scope MCP Launch Audit for teams turning on agent access to code, tickets, docs, SaaS tools, cloud workflows, or customer data.

Sample report and scope:
{{public_url}}

I would especially appreciate feedback from people running MCP in production or reviewing MCP usage for an engineering or AppSec team.
```

## Short X Post

```text
MCP is moving from local experiments to real tool access.

I built MCPScan as a fixed-scope readiness audit for teams enabling MCP across code, tickets, docs, SaaS actions, and customer data.

Inventory tools. Classify actions. Review auth and secrets. Ship buyer-safe evidence.

{{public_url}}
```

## Stop Conditions

- Do not claim certification.
- Do not claim guaranteed security.
- Do not imply a target company has a vulnerability.
- Do not publish before the public URL, sample report, terms, privacy, refund policy, and security contact are live.
- Do not post in communities where promotional posts are not allowed.
