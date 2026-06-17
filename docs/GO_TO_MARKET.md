# MCPScan Go-To-Market Plan

## Goal

Generate first revenue by selling fixed-scope MCP security audits before the SaaS dashboard is available.

The launch motion is service-first:

1. Sell a paid audit.
2. Run MCPScan and supporting manual checks.
3. Deliver a concise report and remediation call.
4. Convert repeat demand into dashboard requirements.

## Ideal Customer Profile

Primary ICP:

- AI product teams using MCP servers in production or customer pilots.
- Developer tool companies adding MCP integrations.
- Security-conscious startups preparing enterprise sales conversations.
- Agencies building custom AI workflows for clients.

Best-fit buyer:

- Founder, CTO, head of engineering, security lead, or AI platform lead.
- Already using Claude Desktop, Cursor, custom agents, or internal MCP tools.
- Has at least one MCP server connected to real credentials, customer data, internal systems, code repositories, databases, or third-party APIs.
- Needs a credible review fast, but does not have a mature internal MCP security checklist.

Bad-fit buyer:

- Hobby projects with no sensitive data or credentials.
- Teams only exploring MCP locally with disposable test data.
- Buyers asking for full penetration testing, compliance certification, or legal attestation.

## Core Problem

MCP adoption is moving faster than security review. Teams are connecting AI agents to tools with real authority, but many do not know:

- Which MCP servers are installed.
- Which tools each server exposes.
- Which environment variables, files, and credentials are reachable.
- Whether tool descriptions create prompt-injection or over-permissioning risk.
- Whether an MCP setup is safe enough for enterprise customers, pilots, or internal rollout.

## Offer

### Productized Audit

Positioning:

> A fixed-scope MCP security audit for teams connecting AI agents to internal tools, credentials, and customer data.

Deliverables:

- Inventory of reviewed MCP servers and exposed tools.
- Risk-ranked findings with severity, business impact, and recommended fixes.
- Configuration and secret-exposure review.
- Prompt-injection and tool-description risk review.
- Remediation checklist.
- 30-minute findings call.
- Optional re-scan after fixes for higher tiers.

Primary promise:

> Know what your MCP setup can access, where the risky permissions are, and what to fix first.

## Pricing

Use simple payment links and fixed scopes. Do not quote custom work until there is clear enterprise demand.

| Package | Price | Best For | Scope | Turnaround |
| --- | ---: | --- | --- | --- |
| MCP Quick Audit | $750 | Teams validating one MCP setup | Up to 3 MCP servers, 1 environment, written report | 3 business days |
| MCP Launch Audit | $1,500 | Startups preparing pilots or customer demos | Up to 8 MCP servers, 2 environments, report, findings call, 1 re-scan | 5 business days |
| MCP Enterprise Readiness Audit | $3,500 | Teams preparing enterprise review | Up to 15 MCP servers, 3 environments, deeper manual review, executive summary, findings call, 1 re-scan | 7 business days |

Add-ons:

- Extra MCP server: $150 each.
- Expedited 48-hour delivery: +50%.
- Additional remediation call: $250.
- Custom policy/checklist creation: $1,000.

Discount rule:

- Offer 20% off to the first 5 buyers in exchange for permission to use anonymized learnings in product development.
- Do not discount below that unless the buyer provides a strong testimonial, intro, or public logo.

## Fulfillment Workflow

1. Buyer pays through Stripe Payment Link.
2. Send intake email within 1 business day.
3. Collect:
   - MCP config files or sanitized exports.
   - List of MCP servers in scope.
   - Target environment names.
   - Business context for connected tools.
   - Known concerns or previous incidents.
4. Confirm scope and delivery date.
5. Run MCPScan CLI against provided configuration.
6. Manually review high-risk servers, tools, permissions, secrets, descriptions, and external integrations.
7. Create written report.
8. Send report and remediation checklist.
9. Hold findings call.
10. For eligible packages, run one re-scan after customer fixes.
11. Ask for testimonial, referral, or permission to quote anonymized outcome.

## Report Format

Every report should include:

- Executive summary.
- Scope reviewed.
- Tool and server inventory.
- Findings table.
- Detailed findings.
- Remediation checklist.
- Out-of-scope notes.
- Re-scan eligibility and next steps.

Finding fields:

- ID.
- Title.
- Severity: Critical, High, Medium, Low, Informational.
- Affected MCP server or tool.
- Evidence.
- Business impact.
- Recommendation.
- Owner suggestion.
- Status.

## Launch Channels

Priority order:

1. Founder-led outbound to AI infrastructure and developer tool startups.
2. LinkedIn DMs to CTOs, founders, AI engineers, and security leads.
3. Posts in MCP, AI engineering, and security communities.
4. Warm intros through investors, accelerators, and AI builder groups.
5. Direct outreach to agencies building AI automations.

## First 30 Days

Week 1:

- Publish README selling section and sample scope.
- Create Stripe Payment Links for all 3 packages.
- Build a simple intake form.
- Send 50 targeted emails and 50 LinkedIn DMs.
- Offer 5 discounted founder audits.

Week 2:

- Deliver first paid audit.
- Capture anonymized examples of risk patterns.
- Refine report template and pricing.
- Send 100 more outbound messages.

Week 3:

- Ask first buyers for testimonials, referrals, and objections.
- Publish a short post: "The MCP security issues we keep seeing."
- Contact 20 agencies that build AI agent workflows.

Week 4:

- Package repeat findings into dashboard requirements.
- Decide whether to keep service pricing, raise prices, or add retainer support.
- Aim for 3-5 paid audits completed or booked.

## Success Metrics

Minimum viable traction:

- 150 targeted outbound messages sent.
- 10 sales calls or serious replies.
- 3 paid audits booked.
- 2 reports delivered.
- 1 testimonial or referral.

Strong traction:

- 5+ paid audits booked in 30 days.
- At least 2 buyers ask for ongoing monitoring.
- At least 3 repeated finding categories that justify dashboard automation.

## Sales Notes

Lead with urgency, not fear. The useful message is:

> MCP gives agents real access. We help teams see exactly what that access means before customers, auditors, or incidents force the review.

Avoid claiming:

- Compliance certification.
- Full penetration testing.
- Guaranteed security.
- Complete coverage of every runtime behavior.

Use concrete questions:

- Which MCP servers are connected to production-like credentials?
- Can your agent reach customer data, source code, databases, or ticketing systems?
- Would you be comfortable showing your MCP configuration to an enterprise security reviewer today?

