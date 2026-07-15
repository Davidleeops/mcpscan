# Outreach Approval Queue

Generated: 2026-07-15T11:50:36.327Z

Status: draft only. This file is a preparation artifact, not permission to send.
No external messages may be sent until the exact recipient and exact final text
are approved in the same turn.

Source: `sales/seed-prospect-list-2026-07-15.csv`

Use this queue to pick the first 10 account pools, qualify specific accounts,
then replace placeholders before requesting send approval.

## 1. GitHub Copilot Enterprise customers

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: Platform pool
- Trigger URL: https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers
- Trigger note: GitHub documents MCP server configuration for Copilot agents and autonomous tool execution
- Buyer hypothesis: AppSec or VP Engineering
- Likely pain: Autonomous agent tools with repo/org access
- Recommended offer: MCP Enterprise Readiness Audit
- Caveat: Pool requires account-level qualification
- Next action: Find companies publicly discussing Copilot coding agent rollout

### Email Draft

```text
Subject: MCP readiness review before enterprise rollout

Hi {{first_name}},

I saw the public platform pool signal around GitHub Copilot Enterprise customers: GitHub documents MCP server configuration for Copilot agents and autonomous tool execution.

The risk pattern is pretty practical: Autonomous agent tools with repo/org access. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Enterprise Readiness Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around GitHub Copilot Enterprise customers. Quick question: has the team reviewed autonomous agent tools with repo/org access yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

## 2. GitHub MCP Server users

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: Developer-tool pool
- Trigger URL: https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/use-the-github-mcp-server
- Trigger note: GitHub MCP can expose repository and issue workflows through MCP clients
- Buyer hypothesis: DevSecOps or platform engineering
- Likely pain: PAT scope and repository access review
- Recommended offer: MCP Launch Audit
- Caveat: GitHub also has native controls
- Next action: Search public repos/docs mentioning GitHub MCP server usage

### Email Draft

```text
Subject: MCP access review before rollout

Hi {{first_name}},

I saw the public developer-tool pool signal around GitHub MCP Server users: GitHub MCP can expose repository and issue workflows through MCP clients.

The risk pattern is pretty practical: PAT scope and repository access review. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Launch Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around GitHub MCP Server users. Quick question: has the team reviewed pat scope and repository access review yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

## 3. Slack Enterprise Grid MCP users

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: Collaboration/security pool
- Trigger URL: https://slack.com/help/articles/48855576908307-Guide-to-Model-Context-Protocol-in-Slack
- Trigger note: Slack MCP apps can search/read/send messages and create canvases
- Buyer hypothesis: IT security or collaboration admin
- Likely pain: Internal messages and workspace data exposure
- Recommended offer: MCP Enterprise Readiness Audit
- Caveat: Large accounts may use Salesforce/Slack advisory
- Next action: Search Slack admin/security community posts about MCP apps

### Email Draft

```text
Subject: MCP readiness review before enterprise rollout

Hi {{first_name}},

I saw the public collaboration/security pool signal around Slack Enterprise Grid MCP users: Slack MCP apps can search/read/send messages and create canvases.

The risk pattern is pretty practical: Internal messages and workspace data exposure. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Enterprise Readiness Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around Slack Enterprise Grid MCP users. Quick question: has the team reviewed internal messages and workspace data exposure yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

## 4. Atlassian Cloud / Rovo users

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: EngOps/security pool
- Trigger URL: https://github.com/atlassian/atlassian-mcp-server
- Trigger note: Official server connects Jira, Confluence, JSM, Bitbucket, and Compass to AI clients
- Buyer hypothesis: Atlassian admin or EngOps leader
- Likely pain: Jira, Confluence, and Bitbucket write actions from agents
- Recommended offer: MCP Enterprise Readiness Audit
- Caveat: Best fit for multi-tool enterprises
- Next action: Search for companies adopting Atlassian Rovo plus AI agents

### Email Draft

```text
Subject: MCP readiness review before enterprise rollout

Hi {{first_name}},

I saw the public engops/security pool signal around Atlassian Cloud / Rovo users: Official server connects Jira, Confluence, JSM, Bitbucket, and Compass to AI clients.

The risk pattern is pretty practical: Jira, Confluence, and Bitbucket write actions from agents. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Enterprise Readiness Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around Atlassian Cloud / Rovo users. Quick question: has the team reviewed jira, confluence, and bitbucket write actions from agents yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

## 5. Claude Code enterprise users

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: AI coding pool
- Trigger URL: https://code.claude.com/docs/en/mcp
- Trigger note: Claude Code connects to tools, databases, and APIs via MCP
- Buyer hypothesis: Engineering leadership or AppSec
- Likely pain: Developer machine credentials and internal tool access
- Recommended offer: MCP Launch Audit
- Caveat: Anthropic guidance overlaps
- Next action: Search launch posts/job posts mentioning Claude Code MCP

### Email Draft

```text
Subject: MCP access review before rollout

Hi {{first_name}},

I saw the public ai coding pool signal around Claude Code enterprise users: Claude Code connects to tools, databases, and APIs via MCP.

The risk pattern is pretty practical: Developer machine credentials and internal tool access. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Launch Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around Claude Code enterprise users. Quick question: has the team reviewed developer machine credentials and internal tool access yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

## 6. Cursor Teams / Enterprise users

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: AI coding pool
- Trigger URL: https://cursor.com/docs/mcp
- Trigger note: Cursor supports MCP and community has MCP tool security concerns
- Buyer hypothesis: AI devtools owner or AppSec
- Likely pain: Shadow MCP configs on developer machines
- Recommended offer: MCP Launch Audit
- Caveat: Forum signal does not prove deployment
- Next action: Search Cursor forum/GitHub mentions for MCP rollout pain

### Email Draft

```text
Subject: MCP access review before rollout

Hi {{first_name}},

I saw the public ai coding pool signal around Cursor Teams / Enterprise users: Cursor supports MCP and community has MCP tool security concerns.

The risk pattern is pretty practical: Shadow MCP configs on developer machines. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Launch Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around Cursor Teams / Enterprise users. Quick question: has the team reviewed shadow mcp configs on developer machines yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

## 7. Cloudflare MCP users

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: Cloud platform pool
- Trigger URL: https://docs.langdock.com/en/using-langdock/integrations/mcp-directory
- Trigger note: Cloudflare MCP can manage Workers, KV, R2, and bindings
- Buyer hypothesis: Platform engineering or cloud security
- Likely pain: Agent infra write permissions
- Recommended offer: MCP Enterprise Readiness Audit
- Caveat: Product-level evidence
- Next action: Search public MCP configs mentioning Cloudflare Workers

### Email Draft

```text
Subject: MCP readiness review before enterprise rollout

Hi {{first_name}},

I saw the public cloud platform pool signal around Cloudflare MCP users: Cloudflare MCP can manage Workers, KV, R2, and bindings.

The risk pattern is pretty practical: Agent infra write permissions. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Enterprise Readiness Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around Cloudflare MCP users. Quick question: has the team reviewed agent infra write permissions yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

## 8. Stripe MCP users

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: Payments/security pool
- Trigger URL: https://docs.langdock.com/en/using-langdock/integrations/mcp-directory
- Trigger note: Stripe MCP can touch payment and subscription data
- Buyer hypothesis: Payments engineering or security
- Likely pain: Financial data and payment workflow exposure
- Recommended offer: MCP Enterprise Readiness Audit
- Caveat: Many teams may keep access read-only
- Next action: Search public docs/posts about Stripe MCP in agent workflows

### Email Draft

```text
Subject: MCP readiness review before enterprise rollout

Hi {{first_name}},

I saw the public payments/security pool signal around Stripe MCP users: Stripe MCP can touch payment and subscription data.

The risk pattern is pretty practical: Financial data and payment workflow exposure. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Enterprise Readiness Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around Stripe MCP users. Quick question: has the team reviewed financial data and payment workflow exposure yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

## 9. Supabase MCP users

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: Startup/backend pool
- Trigger URL: https://docs.langdock.com/en/using-langdock/integrations/mcp-directory
- Trigger note: Supabase MCP can manage backend projects and data
- Buyer hypothesis: Startup CTO or platform engineering
- Likely pain: Database/backend authority in AI coding workflows
- Recommended offer: MCP Launch Audit
- Caveat: SMB price sensitivity
- Next action: Search GitHub for Supabase MCP configs in startups

### Email Draft

```text
Subject: MCP access review before rollout

Hi {{first_name}},

I saw the public startup/backend pool signal around Supabase MCP users: Supabase MCP can manage backend projects and data.

The risk pattern is pretty practical: Database/backend authority in AI coding workflows. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Launch Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around Supabase MCP users. Quick question: has the team reviewed database/backend authority in ai coding workflows yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

## 10. Vercel MCP users

Status: draft only. Do not send without same-turn approval for exact recipient and final content.

- Category: Deployment platform pool
- Trigger URL: https://docs.langdock.com/en/using-langdock/integrations/mcp-directory
- Trigger note: Vercel MCP can deploy, manage, and monitor projects and functions
- Buyer hypothesis: Frontend platform or DevOps
- Likely pain: Deployment permissions in agent workflows
- Recommended offer: MCP Launch Audit
- Caveat: Vercel has strong first-party docs
- Next action: Search public project docs mentioning Vercel MCP

### Email Draft

```text
Subject: MCP access review before rollout

Hi {{first_name}},

I saw the public deployment platform pool signal around Vercel MCP users: Vercel MCP can deploy, manage, and monitor projects and functions.

The risk pattern is pretty practical: Deployment permissions in agent workflows. MCP setups can move from local agent workflow to real company access before there is a clean inventory of what the agent can reach.

MCPScan runs a fixed-scope readiness audit covering MCP server/tool inventory, risky permissions, secret exposure, prompt-injection/tool-description risk, and a prioritized remediation checklist.

For this kind of setup, the likely fit is MCP Launch Audit.

Worth sending the one-page scope so you can decide if it is relevant?

{{sender_name}}
```

### LinkedIn Draft

```text
Hi {{first_name}}, saw public MCP/agent activity around Vercel MCP users. Quick question: has the team reviewed deployment permissions in agent workflows yet? MCPScan does fixed-scope readiness audits that map MCP servers, tools, permissions, secret exposure, and remediation priorities before rollout. Open to me sending the one-page scope?
```

