# Buyer Intent Map

Date: August 14, 2026

Purpose: give MCPScan a current, practical list of where buyers are showing pain and what to do with each signal.

## Ranked Demand Signals

| Rank | Signal | Where To Look | Buyer | Outreach Angle |
| ---: | --- | --- | --- | --- |
| 1 | Enterprise admins want MCP allowlists and registry controls | GitHub Copilot enterprise MCP controls and GitHub Community discussions | AppSec, VP Engineering, platform security | Ask whether they have inventoried approved MCP servers before broad Copilot rollout |
| 2 | Developers cannot always inspect tool-call arguments clearly enough | Cursor forum threads on MCP approval and call arguments | AI devtools owner, AppSec | Offer a review of write-capable tools and approval evidence |
| 3 | Teams want default-deny policies for local and remote MCP servers | GitHub MCP registry and managed settings docs | Platform engineering, security engineering | Offer managed-settings and allowlist readiness review |
| 4 | Security guidance names auth, consent, tokens, and confused deputy risk | MCP security best practices and authorization spec | Product security, identity architect | Offer auth and trust-boundary review for MCP servers |
| 5 | Tool poisoning is now documented by OWASP and security researchers | OWASP, Invariant, Microsoft, Unit 42, TrueFoundry | AppSec, AI security lead | Offer tool-description and metadata poisoning review |
| 6 | Gateways are becoming a category | Tyk, Kong, Portkey, Citrix, Cloudflare | Security architecture, infrastructure | Offer pre-gateway assessment before buying or deploying a control plane |
| 7 | Open-source scanners are noisy and fragmented | Hacker News and GitHub scanner threads | CTO, security engineer | Offer expert-reviewed findings and buyer-safe reporting |
| 8 | Slack, Atlassian, Stripe, Cloudflare, Supabase, Vercel, PagerDuty MCP tools touch high-value data and actions | Vendor docs and MCP directories | IT admin, platform lead, payments/security, SRE | Offer critical-tool lane audit by connected system |
| 9 | Audit trails are now part of the buyer conversation | Compliance and identity vendors discussing MCP auditability | Compliance, security operations | Offer audit-ready evidence packet and remediation tracker |
| 10 | Job posts mention MCP server security and AI integration review | AI platform/security engineer openings | Hiring manager, CTO | Offer quick external audit while the team hires |

## Where To Find The First Prospects

| Place | Search Pattern | What To Capture |
| --- | --- | --- |
| GitHub | `mcp.json`, `managed-settings.json`, `github mcp server`, `claude_desktop_config`, `cursor mcp` | Public repo using MCP, owner, likely system touched, risk level |
| GitHub Community | MCP allowlist, MCP registry, MCP permissions, Copilot MCP security | Commenter organization if public, buyer role, pain language |
| Cursor Forum | MCP approval, tool args, auto approval, subagent tool control, session approval | Thread URL, user role if public, exact feature pain |
| Vendor docs and changelogs | Copilot MCP, Slack MCP, Atlassian MCP, Stripe MCP, Cloudflare MCP, Supabase MCP, PagerDuty MCP | Newly enabled tool surface and likely buyer |
| LinkedIn | MCP server, agent tooling, AI platform, Copilot rollout, Claude Code, Cursor enterprise | Founder or engineering leader with public rollout signal |
| Job boards | MCP security, AI platform security, agent security, tool governance | Company with hiring pain and likely budget |
| Hacker News | MCP security scanner, MCP gateway, MCP server risk | Objections, competitor mentions, early adopter comments |
| Reddit | r/cybersecurity, r/mcp, r/sysadmin, r/programming MCP threads | Buyer language and practical control needs |

## Message Matrix

| Buyer | Pain | Best Offer | First CTA |
| --- | --- | --- | --- |
| CTO at AI startup | Need to ship quickly without surprising customers | MCP Exposure Snapshot | Want me to send the one-page scope? |
| Devtool founder | Public MCP server could become trust objection | MCP Launch Audit | Worth a fixed-scope pre-review before wider rollout? |
| AppSec lead | Asked to approve MCP without inventory | MCP Quick Audit | Want a fixed-scope review of servers, tools, auth, and secrets exposure? |
| Platform engineering lead | Needs allowlist and managed settings | MCP Launch Readiness Audit | Want an approval map before rollout? |
| IT or Slack admin | Internal docs/messages may be exposed | MCP Enterprise Readiness Audit | Useful to map read/write boundaries before enabling? |
| Payments/security lead | Stripe or finance actions exposed to agents | MCP Enterprise Readiness Audit | Want a risk review before agent access touches payment workflows? |
| SRE lead | PagerDuty or deploy actions exposed | MCP Launch Readiness Audit | Want to see which incident actions agents can trigger? |
| Security consultancy | Needs a sellable MCP add-on | Partner audit packet | Want a white-label fixed-scope MCP audit add-on? |

## First 10 Account Qualification Rules

A prospect is worth first-10 approval only if at least two are true:

- Public MCP or agent-tool signal exists.
- The system touches source code, customer data, internal docs, cloud infrastructure, payments, incidents, or production workflow.
- Buyer has enterprise customers, regulated customers, or active customer security reviews.
- Buyer is hiring for AI platform, security engineering, AppSec, or agent infrastructure.
- Buyer recently launched or announced agent functionality.
- Buyer likely lacks a dedicated AI security platform.

## Do Not Automate Without Founder Approval

- Cold email sends.
- LinkedIn messages.
- Vulnerability disclosures.
- Third-party scanning.
- Customer intake requests.
- Refunds or pricing changes.
- Any claim that a named company has a security flaw.

## Sources To Recheck Before Each Outreach Batch

- https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/restrict-based-on-registry
- https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/mcp-allowlist-enforcement
- https://github.com/orgs/community/discussions/169533
- https://forum.cursor.com/t/can-not-see-call-args-in-mcp-tool-calls/165328/22
- https://forum.cursor.com/t/context-aware-mcp-tool-auto-approval-via-plan-documents/159726
- https://modelcontextprotocol.io/specification/draft/basic/security_best_practices
- https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
- https://owasp.org/www-community/attacks/MCP_Tool_Poisoning
- https://github.com/snyk/agent-scan
- https://github.com/marketplace/actions/mcp-security-scan
- https://tyk.io/learning-center/enterprise-mcp-gateway-key-considerations/
- https://www.nightfall.ai/blog/ai-agent-security-posture-management
- https://www.reddit.com/r/mcp/comments/1nldx5m/anyone_using_mcp_in_production_curious_about/
