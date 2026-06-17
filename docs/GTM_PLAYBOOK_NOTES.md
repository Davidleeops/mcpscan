# GTM Playbook Notes

## Market Reality

There are already MCP security scanner projects and domains in market, including scanner-style products on `mcpscan.dev` and `mcpscan.ai`. Treat MCPScan as a wedge, not a monopoly.

The fastest path is not "build a dashboard first." The fastest path is:

1. Publish a useful CLI.
2. Show a credible sample report.
3. Sell fixed-scope audits.
4. Turn repeated buyer requests into the dashboard.

## Winning Angle

Most buyers do not need another abstract security tool. They need a fast answer to:

- Which MCP servers are risky?
- Which tools can touch files, commands, URLs, databases, or secrets?
- What should we fix before a customer or security reviewer sees this?
- Can we add a CI threshold so the MCP surface does not drift?

## Offer Stack

Lead with the $1,500 Launch Audit.

- The $750 Quick Audit is for low-friction first customers.
- The $1,500 Launch Audit should be the default.
- The $3,500 Enterprise Readiness Audit is for teams preparing customer/security review.

## Distribution Loops

Free CLI loop:

```text
developer finds repo -> runs npx command -> gets grade -> shares report/CI finding -> team asks for remediation help
```

Paid audit loop:

```text
buyer books audit -> receives report -> fixes issues -> requests rescan -> asks about monitoring/dashboard
```

Content loop:

```text
anonymized findings -> short public posts -> inbound from similar teams -> better checks -> stronger sample reports
```

## First 100 Targets

Prioritize:

- MCP server maintainers
- AI agent agencies
- developer-tool startups adding MCP
- startups preparing enterprise pilots
- teams advertising Claude/Cursor/internal-agent workflows

Avoid:

- hobby repos with no money or production surface
- buyers asking for formal compliance certification
- vague "AI security" conversations without a concrete MCP server/config

## Daily Throughput

For the first 10 business days:

- 20 targeted outbound messages/day
- 5 follow-ups/day
- 1 public build/security post/day
- 1 improvement to scanner/report/docs/day

Goal:

- 200 outbound touches
- 10 serious replies
- 3 paid audits booked
- 1 public testimonial or anonymized case study
