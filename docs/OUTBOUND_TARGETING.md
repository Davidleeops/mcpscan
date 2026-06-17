# MCPScan Outbound Targeting

This playbook is designed for founder-led outbound without paid accounts. Use public search, GitHub, LinkedIn, company sites, launch posts, community posts, and a spreadsheet.

## 100-Target Sourcing Method

Build the list in 5 blocks of 20 accounts. Do not spend more than 90 minutes on any block before sending the first messages.

### Block 1: Public MCP Mentions

Goal: 20 companies or maintainers already talking about MCP.

Free sources:

- GitHub search.
- Google search.
- Product launch posts.
- Company blogs.
- X, LinkedIn, Hacker News, and Reddit search.

Search strings:

- `"Model Context Protocol" "MCP server" company`
- `"MCP server" "pricing"`
- `"MCP" "Claude Desktop" "startup"`
- `"MCP" "Cursor" "team"`
- `site:github.com "mcp-server" "README"`
- `site:github.com "Model Context Protocol" "npm install"`

Add only accounts where a company, maintainer, or likely buyer is identifiable.

### Block 2: Developer Tools and AI Coding Products

Goal: 20 companies with code, repo, CI, or IDE access.

Free sources:

- GitHub trending and topic pages.
- Product Hunt.
- YC company directory.
- Vercel/Netlify/Cloudflare launch posts.
- Engineering blogs.

Search strings:

- `"AI coding agent" startup`
- `"AI code review" "MCP"`
- `"developer tools" "AI agent"`
- `"repository" "AI agent" "security"`
- `"Cursor" "MCP" "GitHub"`

Prioritize tools that touch source code, pull requests, terminals, CI, or secrets.

### Block 3: AI Agent Agencies

Goal: 20 agencies selling client implementations.

Free sources:

- LinkedIn search.
- Google Maps for local AI consultancies.
- Agency websites.
- YouTube and webinar descriptions.
- AI automation communities.

Search strings:

- `"AI automation agency" "agents"`
- `"AI agent agency" "workflow"`
- `"custom AI agents" "Claude"`
- `"MCP" "agency"`
- `"build AI workflows for clients"`

Prioritize agencies with case studies in operations, support, sales, finance, data, or engineering.

### Block 4: B2B SaaS Teams With Internal Agent Signals

Goal: 20 startups that likely connect agents to internal systems.

Free sources:

- Company blogs.
- Job posts.
- Founder posts.
- Launch announcements.
- Engineering podcasts and webinars.

Search strings:

- `"internal AI agent" startup`
- `"AI platform engineer" "agents"`
- `"Claude" "internal tools" "startup"`
- `"agentic workflows" "customers"`
- `"AI assistant" "Zendesk" "Jira" "Slack"`

Prioritize teams hiring AI platform, security, or infrastructure roles.

### Block 5: Enterprise Pilot and Security Review Signals

Goal: 20 prospects where security review may be near-term.

Free sources:

- Careers pages.
- SOC 2/trust pages.
- Customer announcement posts.
- Investor/accelerator announcements.
- Case studies.

Search strings:

- `"SOC 2" "AI agent" startup`
- `"enterprise pilot" "AI agent"`
- `"security questionnaire" "AI"`
- `"design partners" "AI agent"`
- `"trust center" "AI assistant"`

Prioritize teams with enterprise logos, pilots, procurement language, or a new trust/security page.

## Account Scoring

Score each account from 0-10 before outreach.

| Signal | Points |
| --- | ---: |
| Public MCP mention | 3 |
| Agent touches code, data, tickets, CRM, cloud, or internal tools | 2 |
| B2B or agency buyer | 2 |
| Enterprise/security review signal | 2 |
| Direct founder/CTO/security contact found | 1 |

Contact accounts scoring 6 or higher first. Keep 4-5 point accounts as backup. Skip anything below 4 unless there is a warm intro.

## Contact Finding Without Paid Tools

Use this order:

1. Company site: About, Team, Contact, Security, Docs, Blog.
2. LinkedIn: founder, CTO, engineering lead, security lead, AI lead.
3. GitHub: maintainers, org members, repo owners.
4. X or personal websites for founders and maintainers.
5. Common email patterns from the company domain.

Preferred contacts:

- Founder or CEO for companies under 30 people.
- CTO or head of engineering for companies under 200 people.
- Security lead or AI platform lead when visible.
- Agency owner or delivery lead for service firms.

## Daily Outbound Operating Cadence

Run this cadence for 10 business days.

### Morning: Source and Prepare

- Add 10 new accounts to the spreadsheet.
- Score each account.
- Find 1-2 contacts per account.
- Capture the specific trigger: repo, blog post, launch, job post, or integration page.
- Draft one custom first line for each account.

### Midday: Send

- Send 10 first-touch emails.
- Send 10 LinkedIn connection notes or DMs.
- Send 5 follow-ups from previous days.
- Log every send immediately.

### Afternoon: Reply Handling

- Reply to all positive or curious responses the same day.
- Move serious replies to `Discovery requested` or `Payment link sent`.
- Send the sample scope and intake questions only after confirming fit.
- Book calls within 48 hours when possible.

### End of Day: Review

- Update statuses.
- Count sends, replies, serious replies, calls booked, and payments.
- Note objections verbatim.
- Rewrite one weak message based on what happened.
- Add tomorrow's follow-ups to the queue.

Daily minimum:

- 10 new accounts sourced.
- 20 outbound touches.
- 5 follow-ups.
- 1 public or semi-public credibility action, such as a short post, comment, sample finding, or repo improvement.

## Follow-Up Sequence

Use 4 touches over 12 business days. Stop immediately if they decline.

### Touch 1: Initial Email

Use the relevant template from `sales/outbound-email.md`.

### Touch 2: Two Business Days Later

Subject: Re: MCP security review

Hi {{first_name}},

Quick follow-up. The reason I reached out is that MCP setups can quietly accumulate access to code, tickets, databases, local files, and internal APIs.

If {{company}} is using MCP with anything beyond test data, I can send a one-page audit scope so you can decide whether it is worth reviewing.

Worth sending?

{{sender_name}}

### Touch 3: Six Business Days Later

Subject: Re: MCP security review

Hi {{first_name}},

One practical question for your team:

Could you list every MCP server in use today, what each tool can access, and which credentials are reachable?

That inventory is usually where our audit starts. If useful, I can share the checklist we use and the fixed-scope options.

{{sender_name}}

### Touch 4: Twelve Business Days Later

Subject: Closing the loop

Hi {{first_name}},

I will close the loop here. If MCP or agent access review becomes timely later, the lightest option is a fixed-scope Quick Audit: inventory, permission risks, secret exposure, prompt-injection/tool-description review, and remediation checklist.

Happy to send the sample scope if useful down the road.

{{sender_name}}

## LinkedIn Follow-Up

After connection acceptance:

Hi {{first_name}}, thanks for connecting. The short version: we help teams using MCP answer "what can this agent actually access, and what should we fix first?" If {{company}} is using MCP with real credentials, I can send the one-page audit scope.

If no reply after 4 business days:

Quick follow-up. A good fit is usually a team connecting MCP to code, tickets, databases, CRM, cloud, or internal APIs. If that is on your roadmap, I can send the sample scope.

## Conversion Tracking Spreadsheet Schema

Create one spreadsheet named `MCPScan Outbound`. Use these columns:

| Column | Purpose |
| --- | --- |
| Account | Company, agency, or project name |
| Website | Main URL |
| Segment | Devtool, AI coding, agency, B2B SaaS, data, security, maintainer, internal platform |
| Score | 0-10 account score |
| Trigger | Specific reason for outreach |
| Trigger URL | Link to repo, post, blog, job, or page |
| Contact Name | Person contacted |
| Title | Role |
| Contact URL | LinkedIn, GitHub, X, or bio page |
| Email | Email if available |
| Channel | Email, LinkedIn, warm intro, community |
| Touch Count | Number of touches sent |
| Last Touch Date | Most recent outreach date |
| Next Follow-Up Date | Date to follow up |
| Status | Sourced, Contacted, Follow-up 1, Follow-up 2, Replied, Discovery requested, Call booked, Payment link sent, Paid, Closed lost, Nurture |
| Objection | Budget, timing, no MCP, internal security, asks for free help, not buyer, other |
| Package Fit | Quick, Launch, Enterprise, Unknown |
| Quoted Price | Dollar amount |
| Payment Link Sent | Yes/no |
| Intake Sent | Yes/no |
| Delivery Due | Date |
| Outcome | Paid, no response, declined, future follow-up, referred |
| Notes | Verbatim reply snippets and next action |

Weekly metrics:

- Accounts sourced.
- First touches sent.
- Follow-ups sent.
- Reply rate.
- Serious reply rate.
- Calls booked.
- Payment links sent.
- Paid audits.
- Most common objection.

## What To Do When Someone Replies Yes

Respond within the same business day.

### If They Ask For The Scope

Reply:

Hi {{first_name}},

Yes. The fixed-scope audit reviews the MCP servers/tools in scope, what they can access, risky permissions, secret exposure, prompt-injection/tool-description risk, and the first remediation steps.

The usual starting point is the MCP Launch Audit: up to 8 MCP servers across 2 environments, written report, 30-minute findings call, and one re-scan after fixes. Delivery is 5 business days after intake is complete.

To confirm fit, can you send:

- Roughly how many MCP servers are in scope?
- Are they connected to code, tickets, databases, customer data, cloud, CRM, or internal APIs?
- Is this for internal rollout, customer pilot, or enterprise review?

If that fits, I can send the payment link and intake checklist.

{{sender_name}}

### If They Want A Call

Book a 20-minute call. Use this call structure:

- 2 minutes: confirm their MCP usage and buyer context.
- 5 minutes: identify connected systems and credentials.
- 5 minutes: confirm scope, environments, and deadline.
- 3 minutes: explain deliverables and turnaround.
- 3 minutes: recommend Quick, Launch, or Enterprise package.
- 2 minutes: confirm payment and intake next step.

End with:

"Based on what you described, I recommend the {{package}}. I will send the payment link and intake checklist. Once intake is complete, delivery is {{turnaround}} business days."

### If They Ask For A Free Review

Reply:

I can share the sample scope and a few self-check questions for free. For reviewing your actual MCP setup, we keep it as a fixed-scope paid audit because it involves handling sensitive configuration and producing a written remediation artifact.

The lightest paid option is the Quick Audit at $750.

### If They Are Not Ready

Move them to `Nurture` with a follow-up date 30-45 days out. Send:

No problem. I will check back later. In the meantime, the best internal question is: "Can we list every MCP server, every exposed tool, and every credential or sensitive system those tools can reach?"

That answer usually tells you when an audit is worth doing.

## Handoff Checklist After Yes

- Confirm package fit.
- Send Stripe payment link.
- Send `sales/customer-intake.md`.
- Create a delivery folder for the customer.
- Log `Payment link sent` and next follow-up date.
- After payment, log `Paid`, `Intake sent`, and `Delivery Due`.
- Do not start review work until payment is confirmed and intake materials are complete.
- If sensitive files are involved, ask for sanitized exports unless full access is explicitly required and agreed.

