# Outreach Approval Queue

Generated: 2026-08-14T15:09:49.591Z

Status: draft only. This file is a preparation artifact, not permission to send.
No external messages may be sent until the exact recipient and exact final text
are approved in the same turn.

Source: `sales/first-account-pipeline-2026-08-14.csv`

Use this queue to pick exact recipients, then stage the approved message with
`ops/outbound-recipient-approval-builder.html`.

## 1. Vapi

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://docs.vapi.ai/sdk/mcp-server
- Trigger note: Vapi exposes APIs as MCP tools for assistants, phone numbers, and calls.
- Buyer hypothesis: Head of Engineering, Security Lead, CTO
- Score: 9
- Recommended offer: MCP Quick Audit
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP readiness review for voice-agent tools

Hi {{first_name}},

I saw the public MCP signal around Vapi: Vapi exposes APIs as MCP tools for assistants, phone numbers, and calls..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Quick Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around Vapi. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

## 2. Retool

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://retool.com/blog/retool-mcp-server
- Trigger note: Retool MCP lets agents manage apps, workflows, users, and org resources from Claude, Cursor, Codex, or Kiro.
- Buyer hypothesis: Product Security Lead, Enterprise Engineering Lead
- Score: 10
- Recommended offer: MCP Quick Audit
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP readiness review for internal-tool access

Hi {{first_name}},

I saw the public MCP signal around Retool: Retool MCP lets agents manage apps, workflows, users, and org resources from Claude, Cursor, Codex, or Kiro..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Quick Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around Retool. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

## 3. Pipedream

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://pipedream.com/docs/connect/mcp
- Trigger note: Pipedream provides MCP servers for thousands of apps and pre-built tools with managed OAuth and credential storage.
- Buyer hypothesis: Head of Platform, Security Engineering Lead
- Score: 10
- Recommended offer: MCP Quick Audit
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP exposure review for broad SaaS tool access

Hi {{first_name}},

I saw the public MCP signal around Pipedream: Pipedream provides MCP servers for thousands of apps and pre-built tools with managed OAuth and credential storage..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Quick Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around Pipedream. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

## 4. Composio

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://composio.dev/mcp-gateway
- Trigger note: Composio offers centralized MCP server management, managed toolkits, and custom MCP servers behind one gateway.
- Buyer hypothesis: Founder, CTO, Head of Platform
- Score: 9
- Recommended offer: MCP Quick Audit plus buyer-safe summary
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP trust review for gateway-managed tools

Hi {{first_name}},

I saw the public MCP signal around Composio: Composio offers centralized MCP server management, managed toolkits, and custom MCP servers behind one gateway..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Quick Audit plus buyer-safe summary.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around Composio. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

## 5. PostHog

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://posthog.com/docs/model-context-protocol
- Trigger note: PostHog MCP lets agents run analytics queries, manage feature flags and experiments, triage tickets, use SQL, and work with CDP destinations.
- Buyer hypothesis: Product Security Lead, Head of Engineering
- Score: 9
- Recommended offer: MCP Quick Audit
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP readiness check for analytics and feature-flag tools

Hi {{first_name}},

I saw the public MCP signal around PostHog: PostHog MCP lets agents run analytics queries, manage feature flags and experiments, triage tickets, use SQL, and work with CDP destinations..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Quick Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around PostHog. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

## 6. Statsig

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://docs.statsig.com/integrations/mcp/overview
- Trigger note: Statsig MCP supports read tools and write tools for gates, experiments, configs, and bulk changes.
- Buyer hypothesis: Product Security Lead, Platform Engineering Lead
- Score: 9
- Recommended offer: MCP Quick Audit
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP readiness check for feature-gate actions

Hi {{first_name}},

I saw the public MCP signal around Statsig: Statsig MCP supports read tools and write tools for gates, experiments, configs, and bulk changes..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Quick Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around Statsig. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

## 7. Braintrust

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://www.braintrust.dev/docs/integrations/developer-tools/mcp
- Trigger note: Braintrust MCP lets AI coding tools query experiments, search docs, and analyze production logs.
- Buyer hypothesis: Security Lead, Head of Product Engineering
- Score: 8
- Recommended offer: MCP Exposure Audit
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP exposure snapshot for eval and log access

Hi {{first_name}},

I saw the public MCP signal around Braintrust: Braintrust MCP lets AI coding tools query experiments, search docs, and analyze production logs..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Exposure Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around Braintrust. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

## 8. Granola

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://www.granola.ai/blog/granola-mcp
- Trigger note: Granola MCP connects meeting notes to Claude, ChatGPT, Cursor, and other AI tools.
- Buyer hypothesis: Security Lead, CTO, Head of Enterprise
- Score: 8
- Recommended offer: MCP Exposure Audit
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP exposure snapshot for meeting-note access

Hi {{first_name}},

I saw the public MCP signal around Granola: Granola MCP connects meeting notes to Claude, ChatGPT, Cursor, and other AI tools..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Exposure Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around Granola. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

## 9. Sentry

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://mcp.sentry.dev/
- Trigger note: Sentry MCP connects AI assistants to errors, performance, issue triage, docs, and project management.
- Buyer hypothesis: Product Security Lead, Developer Platform Lead
- Score: 9
- Recommended offer: MCP Quick Audit
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP readiness review for error and trace access

Hi {{first_name}},

I saw the public MCP signal around Sentry: Sentry MCP connects AI assistants to errors, performance, issue triage, docs, and project management..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Quick Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around Sentry. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

## 10. Replit

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: undefined
- Trigger URL: https://docs.replit.com/build/connect-via-mcp
- Trigger note: Replit Agent can connect to pre-listed and custom MCP servers, with guidance to trust sources and review access.
- Buyer hypothesis: Head of Security, AI Platform Lead
- Score: 9
- Recommended offer: Platform Exposure Audit
- Next action: Select exact recipient and request same-turn approval
- Approval status: Not approved

### Email Draft

```text
Subject: MCP exposure review for custom coding-agent tools

Hi {{first_name}},

I saw the public MCP signal around Replit: Replit Agent can connect to pre-listed and custom MCP servers, with guidance to trust sources and review access..

The risk pattern is practical: MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is Platform Exposure Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP activity around Replit. Quick question: has the team reviewed what the connected tools can read, write, or change before rollout expands? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities. Open to me sending the one-page scope?
```

