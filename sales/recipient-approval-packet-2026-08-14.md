# Recipient Approval Packet

Date: August 14, 2026

Status: preparation only. This packet does not approve or send outreach.

## Purpose

This packet turns the first-account dossier into exact-recipient approval work. It intentionally uses public searches and founder review instead of scraped private contact data.

## Hard Rule

No outreach can be sent until the exact recipient and exact final content are approved in the same turn.

## First-Wave Recipient Targets

| # | Account | Candidate For Approval | Public Signal | Draft Subject | Status |
| ---: | --- | --- | --- | --- | --- |
| 1 | Vapi | Nikhil Gupta, Founder and CTO | https://docs.vapi.ai/sdk/mcp-server | MCP readiness review for voice-agent tools | Ready for founder approval |
| 2 | Retool | David Hsu, Co-founder and CEO | https://retool.com/blog/retool-mcp-server | MCP readiness review for internal-tool access | Ready for founder approval |
| 3 | Pipedream | Tod Sacerdoti, CEO and Founder | https://pipedream.com/docs/connect/mcp | MCP exposure review for broad SaaS tool access | Ready for founder approval |
| 4 | Composio | Soham Ganatra, Founder | https://composio.dev/mcp-gateway | MCP trust review for gateway-managed tools | Ready for founder approval |
| 5 | PostHog | James Hawkins, Co-founder and Co-CEO | https://posthog.com/docs/model-context-protocol | MCP readiness check for analytics and feature-flag tools | Ready for founder approval |
| 6 | Statsig | Vijaye Raji, Founder and former CEO | https://docs.statsig.com/integrations/mcp/overview | MCP readiness check for feature-gate actions | Ready for founder approval |
| 7 | Braintrust | Ankur Goyal, Founder and CEO | https://www.braintrust.dev/docs/integrations/developer-tools/mcp | MCP exposure snapshot for eval and log access | Ready for founder approval |
| 8 | Granola | Christopher Pedregal, Co-founder and CEO | https://www.granola.ai/blog/granola-mcp | MCP exposure snapshot for meeting-note access | Ready for founder approval |
| 9 | Sentry | David Cramer, Co-founder and CPO | https://mcp.sentry.dev/ | MCP readiness review for error and trace access | Ready for founder approval |
| 10 | Replit | Ertan Dogrultan, Platform Engineering Lead | https://docs.replit.com/build/connect-via-mcp | MCP exposure review for custom coding-agent tools | Ready for founder approval |

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
