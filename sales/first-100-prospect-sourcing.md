# First 100 Prospect Sourcing Template

Status: draft-only operating doc. Do not send, post, or message prospects without same-turn approval where a tool would send externally.

Goal: build the first 100-account list for fixed-scope MCP production-readiness audits. The list should prioritize teams with live MCP or agent access risk, not broad AI interest.

Start from `sales/seed-prospect-list-2026-07-15.csv`, then replace pools with
specific qualified accounts before outreach. Do not send to personal contacts
until the exact recipient and message are approved in the same turn.

Generate the first draft-only approval queue with:

```bash
npm run outbound:queue
```

The generated queue lives at `sales/outreach-approval-queue.md`.

## Qualification Rule

Add an account when at least 3 are true:

- Public MCP, agent, Claude Desktop, Cursor, tool-calling, or automation workflow signal.
- Product or workflow touches code, tickets, docs, CRM, databases, cloud, customer data, local files, or internal APIs.
- B2B company, devtool, security tool, data tool, or AI agency.
- Enterprise pilot, procurement, SOC 2, trust center, security questionnaire, or customer rollout signal.
- Reachable buyer exists: founder, CTO, head of engineering, AI platform lead, security lead, agency owner, or maintainer-founder.
- Company size likely supports a fast fixed-scope purchase: roughly 5-200 employees.

Skip personal experiments, toy MCP repos, and hobby projects with no clear buyer.

## Source Blocks

Build 5 blocks of 20 accounts. Send after each block is reasonably complete; do not wait for the perfect list.

### Block 1: Public MCP Mentions

Search queries:

- `"Model Context Protocol" "MCP server" company`
- `"MCP server" "pricing"`
- `"MCP" "Claude Desktop" "startup"`
- `"MCP" "Cursor" "team"`
- `site:github.com "mcp-server" "README"`
- `site:github.com "Model Context Protocol" "npm install"`

Best targets: companies or maintainers already exposing MCP servers, docs, SDKs, connectors, or deployment instructions.

### Block 2: Developer Tools And AI Coding Products

Search queries:

- `"AI coding agent" startup`
- `"AI code review" "MCP"`
- `"developer tools" "AI agent"`
- `"repository" "AI agent" "security"`
- `"Cursor" "MCP" "GitHub"`

Best targets: tools near source code, CI, terminals, pull requests, issue trackers, or secrets.

### Block 3: AI Agent Agencies

Search queries:

- `"AI automation agency" "agents"`
- `"AI agent agency" "workflow"`
- `"custom AI agents" "Claude"`
- `"MCP" "agency"`
- `"build AI workflows for clients"`

Best targets: agencies with case studies in ops, support, sales, finance, data, or engineering automation.

### Block 4: B2B SaaS Teams With Internal Agent Signals

Search queries:

- `"internal AI agent" startup`
- `"AI platform engineer" "agents"`
- `"Claude" "internal tools" "startup"`
- `"agentic workflows" "customers"`
- `"AI assistant" "Zendesk" "Jira" "Slack"`

Best targets: teams likely connecting agents to customer data, internal docs, support tools, CRM, tickets, or databases.

### Block 5: Enterprise Readiness Signals

Search queries:

- `"SOC 2" "AI agent" startup`
- `"enterprise pilot" "AI agent"`
- `"security questionnaire" "AI"`
- `"design partners" "AI agent"`
- `"trust center" "AI assistant"`

Best targets: startups with enterprise logos, trust pages, security hires, procurement language, or customer pilots.

## Account Scoring

Score 0-10 before outreach.

| Signal | Points |
| --- | ---: |
| Public MCP mention | 3 |
| Agent touches code, data, tickets, CRM, cloud, customer systems, or internal tools | 2 |
| B2B or agency buyer | 2 |
| Enterprise/security review signal | 2 |
| Direct buyer contact found | 1 |

Contact 6+ point accounts first. Keep 4-5 point accounts as backup. Skip below 4 unless there is a warm intro.

## Target List Columns

Use these columns in a spreadsheet or CRM:

| Column | Notes |
| --- | --- |
| Account | Company, project, or agency name |
| Website | Primary site |
| Source block | MCP mention / devtool / agency / B2B SaaS / enterprise signal |
| Trigger URL | Repo, launch post, docs page, blog, job post, trust page, or case study |
| Trigger note | One sentence explaining why now |
| Score | 0-10 using the scoring table |
| Buyer 1 | Name and role |
| Buyer 1 contact | Email, LinkedIn, GitHub, or site contact |
| Buyer 2 | Optional backup contact |
| Buyer 2 contact | Optional backup contact |
| Likely pain | Code access / customer data / internal rollout / enterprise review / client handoff |
| Recommended offer | Quick Audit / Launch Audit / Enterprise Readiness Audit |
| First-line angle | Personalized opener tied to the trigger |
| Status | Sourced / contacted / replied / discovery / scope sent / payment sent / won / closed-lost |
| Last touch date | Date |
| Next action date | Date |
| Notes | Objections, context, next step |

## Example Rows

| Account | Source block | Trigger note | Score | Buyer | Likely pain | Recommended offer | First-line angle |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| {{devtool_company}} | Developer tools | Announced MCP server for repo/issue access | 8 | CTO/founder | Code and ticket access | Launch Audit | "Before customers ask, can you show what the MCP integration can access?" |
| {{ai_agency}} | Agency | Publishes client AI workflow case studies | 7 | Agency owner | Client handoff evidence | Quick Audit | "Useful as a white-label security artifact before handing agents to clients." |
| {{b2b_saas}} | Internal agents | Hiring AI platform engineer for internal tools | 6 | VP Eng / AI lead | Internal rollout | Launch Audit | "Worth creating a baseline inventory before more teams connect credentials." |

## Daily Build Cadence

- Source 10 accounts.
- Score each account.
- Find 1-2 buyer contacts.
- Capture the exact trigger URL.
- Write one custom first line.
- Select the matching outbound template from `sales/outbound-email.md` or `sales/linkedin-dm.md`.
- Log every touch and next action date.

Daily minimum for the first 10 business days:

- 10 new accounts sourced.
- 20 outbound touches drafted or sent manually by the owner.
- 5 follow-ups prepared.
- 1 public credibility action drafted, such as a launch post, technical comment, or sample finding.
