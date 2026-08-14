# Recipient Approval Packet

Date: August 14, 2026

Status: preparation only. This packet does not approve or send outreach.

## Purpose

This packet turns the first-account dossier into exact-recipient approval work. It intentionally uses public searches and founder review instead of scraped private contact data.

## Hard Rule

No outreach can be sent until the exact recipient and exact final content are approved in the same turn.

## First-Wave Recipient Targets

| # | Account | Preferred Recipient Role | Public Signal | Draft Subject | Status |
| ---: | --- | --- | --- | --- | --- |
| 1 | Vapi | Head of Engineering, Security Lead, CTO | https://docs.vapi.ai/sdk/mcp-server | MCP readiness review for voice-agent tools | Needs exact recipient |
| 2 | Retool | Product Security Lead, Enterprise Engineering Lead | https://retool.com/blog/retool-mcp-server | MCP readiness review for internal-tool access | Needs exact recipient |
| 3 | Pipedream | Head of Platform, Security Engineering Lead | https://pipedream.com/docs/connect/mcp | MCP exposure review for broad SaaS tool access | Needs exact recipient |
| 4 | Composio | Founder, CTO, Head of Platform | https://composio.dev/mcp-gateway | MCP trust review for gateway-managed tools | Needs exact recipient |
| 5 | PostHog | Product Security Lead, Head of Engineering | https://posthog.com/docs/model-context-protocol | MCP readiness check for analytics and feature-flag tools | Needs exact recipient |
| 6 | Statsig | Product Security Lead, Platform Engineering Lead | https://docs.statsig.com/integrations/mcp/overview | MCP readiness check for feature-gate actions | Needs exact recipient |
| 7 | Braintrust | Security Lead, Head of Product Engineering | https://www.braintrust.dev/docs/integrations/developer-tools/mcp | MCP exposure snapshot for eval and log access | Needs exact recipient |
| 8 | Granola | Security Lead, CTO, Head of Enterprise | https://www.granola.ai/blog/granola-mcp | MCP exposure snapshot for meeting-note access | Needs exact recipient |
| 9 | Sentry | Product Security Lead, Developer Platform Lead | https://mcp.sentry.dev/ | MCP readiness review for error and trace access | Needs exact recipient |
| 10 | Replit | Head of Security, AI Platform Lead | https://docs.replit.com/build/connect-via-mcp | MCP exposure review for custom coding-agent tools | Needs exact recipient |

## Recipient Qualification

A recipient is approval-ready only when all of these are true:

- The person appears publicly connected to the account.
- Their role plausibly owns product security, engineering, platform, AI tooling, developer experience, customer trust, or technical leadership.
- The channel is founder-approved, such as direct email, LinkedIn, warm intro, or contact form.
- The final message references only the public signal and does not imply a vulnerability.
- The exact final text is pasted into the approval request.

## Search Flow

1. Open `ops/recipient-finder-console.html`.
2. Pick one account.
3. Use the public searches to identify a likely owner.
4. Paste the recipient into the approval prompt.
5. Paste the account-specific draft from `ops/first-account-dossier-console.html`.
6. Ask for same-turn approval before sending.
7. After approval, use `ops/outbound-recipient-approval-builder.html` to create the parser-ready packet.
8. Stage the approved packet outside the public repo with `npm run outbound:stage-approved`.

## Approval Request Template

```text
I approve staging this exact MCPScan outbound message.

Account: {{account}}
Channel: {{email_or_linkedin_or_contact_form}}
Recipient: {{name}}, {{title}}, {{company}}
Contact or profile URL: {{contact_or_profile_url}}
Source URL: {{public_signal_url}}

Final message:
{{paste_exact_message}}

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## Do Not Use

- Unverified personal emails from data broker pages.
- Private phone numbers.
- Automated LinkedIn sending.
- Any vulnerability wording unless the account has authorized testing and the finding is real.
- Any customer data or private configs in the public repo.
