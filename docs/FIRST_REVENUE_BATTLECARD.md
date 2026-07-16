# MCPScan First Revenue Battlecard

Use this when a prospect replies, asks "why now?", compares MCPScan to scanners, or wants to know what they get for the audit fee.

## One-Line Position

MCPScan is a pre-enablement readiness audit for teams connecting AI agents to code, data, tickets, chat, cloud, and internal tools through MCP.

## Best First Buyer

Prioritize buyers with all three:

- They are enabling Copilot, Claude Code, Cursor, VS Code agent mode, Slack MCP, Atlassian Rovo, or a custom MCP server.
- Their MCP tools touch source code, tickets, Slack, docs, databases, cloud, customer records, CI/CD, or internal APIs.
- They need a fast approval artifact for AppSec, platform, enterprise customers, or leadership.

## Lead With This

Teams are giving agents real tool access before they have a clean inventory, approval model, or evidence packet. MCPScan maps what the setup can access, flags the risky pieces, and gives the team a concrete fix list before rollout expands.

## Do Not Lead With This

- "We are another MCP scanner."
- "We replace Snyk, Cisco, Proofpoint, or your AppSec program."
- "This is compliance certification."
- "This guarantees the environment is secure."

## Why Now

MCP adoption is moving into production workflows while security review is still immature. The question buyers care about is not whether MCP works. It is whether the team can prove which tools are approved, which actions are write-capable or destructive, where credentials can leak, and what needs fixing before broad rollout.

## Proof To Show

- Live landing page: `https://davidleeops.github.io/mcpscan/`
- Sample report: `https://davidleeops.github.io/mcpscan/sample-report.html`
- Secure intake guidance: `https://davidleeops.github.io/mcpscan/secure-intake.html`
- Terms: `https://davidleeops.github.io/mcpscan/terms.html`
- Public repo: `https://github.com/Davidleeops/mcpscan`

## Primary Offer

Recommend `MCP Launch Audit` first.

- Price: `$1,500`
- Scope: up to 8 MCP servers, up to 2 environments
- Delivery: 5 business days after complete intake
- Includes: inventory, permission/read-write/destructive tool review, secrets exposure review, prompt-injection/tool-description review, written report, remediation checklist, 30-minute findings call, and 1 re-scan after fixes

Use `MCP Quick Audit` only when the buyer has a small single setup and low urgency. Use `MCP Enterprise Readiness Audit` when production credentials, multiple environments, enterprise review, customer data, or buyer questionnaires are involved.

## Qualification Questions

Ask these before proposing a package:

1. Which MCP clients or agent tools are currently in use?
2. Which MCP servers are connected today or planned for rollout?
3. Do any tools touch source code, customer data, Slack, tickets, databases, cloud, CI/CD, or internal admin systems?
4. Are the MCP servers centrally approved, locally configured by developers, or both?
5. Is this for internal rollout, customer pilot, enterprise review, or incident-driven review?
6. Who needs to accept the report: CTO, AppSec, platform, IT, customer security, or leadership?
7. What deadline matters?

## Objection Handling

| Objection | Response |
| --- | --- |
| "We already have Snyk/Cisco/other scanners." | Great. This is not trying to replace those. MCPScan is a fast readiness packet around the actual rollout: configs, tools, permissions, secrets, risky descriptions, and the approval evidence a team can act on. |
| "We are not ready for a full security assessment." | That is exactly why the Launch Audit exists. It is bounded, practical, and designed to identify the first issues before MCP usage spreads. |
| "Can we just run the CLI ourselves?" | Yes. The paid audit adds manual review, prioritization, business context, and a report that AppSec or leadership can use. |
| "Is this penetration testing?" | No. It is a fixed-scope MCP readiness audit. It avoids unauthorized exploitation and focuses on evidence, configuration, exposed tools, and remediation. |
| "We only use MCP locally." | Local use is often where secrets and repo access first appear. If the tools touch real code, tokens, files, or business systems, it is still worth reviewing before it becomes the default workflow. |
| "Why pay before we know the risk?" | The audit is designed to answer that quickly. If the setup is low risk, the report proves it. If it is not, the team gets a short fix list before rollout expands. |

## Close Path

1. Confirm the buyer has MCP or agent tool access touching real systems.
2. Pick the package.
3. Send the Stripe Payment Link.
4. After payment, send intake within 1 business day.
5. Confirm scope and delivery date.
6. Deliver report from the private customer workspace.
7. Ask for testimonial, referral, or permission to use anonymized learning.

## Red Lines

- Do not accept secrets, production credentials, private configs, or final reports into the public repo.
- Do not promise compliance certification.
- Do not run exploit-style testing without explicit written authorization.
- Do not send external messages without exact recipient and exact content approval in the same turn.
- Do not start the audit until payment and safe intake path are confirmed.

## First Reply Template

```text
Thanks, this is exactly the kind of setup MCPScan is meant for.

The useful next step is not a broad security assessment. It is a fixed-scope MCP readiness audit: we inventory the MCP servers/tools, classify read/write/destructive actions, check auth and secret exposure, review risky tool descriptions, and return a short remediation report your AppSec/platform team can use.

Before I point you to the right package, can you confirm:

1. Which MCP clients or agent tools are in use?
2. Roughly how many MCP servers are in scope?
3. Do any tools touch source code, customer data, Slack, tickets, databases, cloud, or CI/CD?
4. Is there a rollout/customer/security-review deadline?
```

