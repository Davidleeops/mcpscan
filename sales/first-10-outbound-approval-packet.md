# First 10 Outbound Approval Packet

Generated: 2026-08-14

Status: draft only. This packet does not authorize sending any message.

## Same-Turn Approval Rule

No external message can be sent until the founder approves the exact recipient and exact final content in the same turn. Approval must name the channel, recipient, company, and final text.

Approved format:

```text
Approved to send:
1. Channel: Email
2. Recipient: {{name}}, {{title}}, {{company}}, {{email}}
3. Message: {{paste exact final message}}
```

## Revenue Goal

Book the first paid MCP Launch Audit at $1,500. The first close should be a fixed-scope service with a clear 48-hour delivery promise, not a broad SaaS sale.

## Offer Ladder

| Offer | Price | Best Fit | Delivery Promise |
| --- | --- | --- | --- |
| MCP Quick Audit | $750 | Smaller startup or one MCP client | One-page risk snapshot and priority fixes |
| MCP Launch Audit | $1,500 | Team enabling coding agents or one high-risk MCP integration | 48-hour readiness report, tool risk map, and remediation checklist |
| MCP Enterprise Readiness Audit | $3,500 | Multi-tool rollout across code, docs, tickets, cloud, Slack, or Atlassian | Executive summary, control map, evidence appendix, and rollout guardrails |

Default ask: MCP Launch Audit at $1,500.

## First 10 Lanes

| # | Lane | Buyer | Why Now | Offer | Approval State |
| --- | --- | --- | --- | --- | --- |
| 1 | GitHub Copilot Enterprise MCP admins | AppSec, VP Engineering | Copilot MCP allowlists and server controls are active rollout questions | MCP Enterprise Readiness Audit | Needs exact account and recipient |
| 2 | GitHub MCP Server users | DevSecOps, platform engineering | Repo and issue workflows may be exposed through local or managed MCP clients | MCP Launch Audit | Needs exact account and recipient |
| 3 | Slack Enterprise Grid MCP users | IT security, collaboration admin | Slack MCP can touch internal messages, search, and workspace actions | MCP Enterprise Readiness Audit | Needs exact account and recipient |
| 4 | Atlassian Cloud or Rovo users | Atlassian admin, EngOps | Jira, Confluence, Bitbucket, and JSM actions need approval boundaries | MCP Enterprise Readiness Audit | Needs exact account and recipient |
| 5 | Claude Code enterprise teams | Engineering leadership, AppSec | Local MCP configs can expose developer machine credentials and internal tools | MCP Launch Audit | Needs exact account and recipient |
| 6 | Cursor Teams or Enterprise users | AI devtools owner, AppSec | Shadow MCP configs can spread before security gets a clean inventory | MCP Launch Audit | Needs exact account and recipient |
| 7 | Cloudflare MCP users | Platform engineering, cloud security | MCP can manage Workers, KV, R2, bindings, and deployment surfaces | MCP Enterprise Readiness Audit | Needs exact account and recipient |
| 8 | Stripe MCP users | Payments engineering, security | Payment and subscription workflows need strict read/write boundaries | MCP Enterprise Readiness Audit | Needs exact account and recipient |
| 9 | Supabase MCP users | Startup CTO, platform engineering | Database and backend authority can move into AI coding workflows | MCP Launch Audit | Needs exact account and recipient |
| 10 | PagerDuty MCP users | SRE leadership, security | Incident actions, schedules, and escalations are high-trust workflow surfaces | MCP Enterprise Readiness Audit | Needs exact account and recipient |

## Qualification Checklist

Use this before asking for approval to send.

- The company has a public signal tied to MCP, AI coding agents, AI platform rollout, Slack/Atlassian AI, or internal developer tooling.
- The recipient has authority over AppSec, platform engineering, DevSecOps, security engineering, IT administration, SRE, or engineering leadership.
- The message references only public signals or generic risk patterns. Do not imply private knowledge.
- The CTA asks permission to send scope, compare notes, or run a short review. It does not pressure or overclaim.
- The exact final text is pasted for same-turn founder approval before sending.

## Default Email

```text
Subject: MCP readiness check before agent rollout

Hi {{first_name}},

I am reaching out because teams enabling MCP for {{tool_or_platform}} are starting to hit the same security question: which servers and tools are safe enough to approve before access expands?

MCPScan runs a fixed-scope readiness audit for that moment. We inventory MCP servers and configs, classify read/write/destructive tools, check auth and secrets exposure, review approval drift, and deliver an AppSec-ready report with practical remediation steps.

The usual fit is a 48-hour MCP Launch Audit at $1,500.

Worth sending the one-page scope so you can decide if this is relevant for {{company}}?

{{sender_name}}
```

## Default LinkedIn

```text
Hi {{first_name}}, quick note because teams enabling MCP for {{tool_or_platform}} are running into a practical AppSec question: which servers and tools are safe enough to approve before rollout? MCPScan does fixed-scope readiness audits that inventory MCP configs, classify risky tools, check auth/secrets exposure, and deliver a remediation checklist. Open to me sending the one-page scope?
```

## Seven-Day Throughput Plan

| Day | Work | Output |
| --- | --- | --- |
| 1 | Clear gates and approve first 10 messages | Domain, email, Stripe links, first 10 approvals |
| 2 | Send first 10 and qualify 20 more | 10 sent, 20 staged, replies tracked |
| 3 | Follow up and post useful public proof | Follow-up copy, short technical post, one buyer call target |
| 4 | Run discovery calls and close first audit | Payment link sent, intake sent after payment |
| 5 | Deliver first paid report or demo sample | Private workspace, buyer-facing report, findings tracker |
| 6 | Convert report into proof asset without private data | Redacted sample, better landing proof, stronger outbound |
| 7 | Repeat with next 20 prospects | New approvals, refined copy, pipeline status |

## Founder Approval Prompt

Use this when ready to send:

```text
Please approve or revise these first outbound messages. I will not send anything unless you approve the exact recipient and exact final text in this same turn.

1. {{channel}} to {{recipient}}, {{title}}, {{company}}, {{contact}}
{{exact_message}}

2. {{channel}} to {{recipient}}, {{title}}, {{company}}, {{contact}}
{{exact_message}}
```

## Stop Conditions

- Stop if a recipient cannot be tied to a credible public or founder-provided signal.
- Stop if copy would imply the company has a security problem without evidence.
- Stop if email authentication is not live for the sending mailbox.
- Stop if the founder has not approved exact recipient and exact final copy in the same turn.
- Stop if a prospect tries to send sensitive configs before payment and safe intake are ready.
