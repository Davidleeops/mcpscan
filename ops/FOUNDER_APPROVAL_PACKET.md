# MCPScan Founder Approval Packet

This packet summarizes the remaining founder-only clicks. Everything else has been prepared as local consoles, scripts, templates, public pages, and delivery workflows.

Start here:

```text
ops/launch-cockpit.html
```

## Current Reality

MCPScan is a real opportunity, but the strongest wedge is not "generic AI security platform." The strongest first-revenue offer is:

```text
Pre-enablement MCP readiness audit for teams turning on Copilot, Claude Code,
Cursor, VS Code agent mode, Slack MCP, or Atlassian Rovo.
```

The first product to sell is a fixed-scope paid audit. The CLI and public sample report support the audit; the dashboard/SaaS version should wait until repeated customer demand proves the workflow.

## Approval Gates

| Gate | Founder Action | Console | Cost / Risk | Done When |
| --- | --- | --- | --- | --- |
| Domain | Buy `mcpscanhq.com` if standard-priced | `ops/domain-email-dns-console.html` | About $9 first year if available | Domain resolves to GitHub Pages |
| Email | Create `hello@mcpscanhq.com` | `ops/domain-email-dns-console.html` | About $14 for two years after trial | MX, SPF, DKIM pass |
| Stripe | Create 3 Payment Links | `ops/stripe-click-setup.html` | Stripe processing fees only | Quick, Launch, Enterprise links exist |
| Link update | Apply real domain/email/Stripe links | `ops/approved-links-command-builder.html` | No spend | `npm run launch:verify -- --domain mcpscanhq.com` has no checkout/domain warnings |
| npm | Login and publish packages | `ops/npm-publish-console.html` | No fixed fee | `npm view mcpscan name version` returns `0.1.0` |
| Outbound | Approve exact recipients and messages | `ops/outbound-approval-console.html` | Reputation/compliance risk if sloppy | Exact recipient + exact message approved in same turn |
| Delivery | Deliver paid audit from private workspace | `ops/delivery-console.html` | Customer-data handling risk | Report delivered outside public repo |

## Product Prices

| Product | Price | Fit |
| --- | --- | --- |
| MCP Quick Audit | $750 | Up to 3 MCP servers, one environment |
| MCP Launch Audit | $1,500 | Main first-revenue package, up to 8 servers |
| MCP Enterprise Readiness Audit | $3,500 | Up to 15 servers, multiple environments, buyer-facing summary |

## What Is Already Live

- Public landing page: `https://davidleeops.github.io/mcpscan/`
- Sample report: `https://davidleeops.github.io/mcpscan/sample-report.html`
- Secure intake: `https://davidleeops.github.io/mcpscan/secure-intake.html`
- Terms: `https://davidleeops.github.io/mcpscan/terms.html`
- Privacy: `https://davidleeops.github.io/mcpscan/privacy.html`
- Refund policy: `https://davidleeops.github.io/mcpscan/refund.html`

## What Must Not Happen Automatically

- No external email, LinkedIn, Slack, or customer message without same-turn approval of exact recipient and exact final content.
- No customer secrets, private configs, customer data, or final private reports in the public repo.
- No outbound from `hello@mcpscanhq.com` until MX, SPF, and DKIM pass.
- No npm publish until npm login and 2FA/OTP are confirmed.
- No live customer audit begins until sanitized intake or approved private handoff is confirmed.

## Verification

Current public state:

```text
npm run launch:verify
```

After domain and link approval:

```text
npm run launch:verify -- --domain mcpscanhq.com
```

Final strict launch check:

```text
npm run launch:verify -- --domain mcpscanhq.com --strict
```

Current expected warnings before founder clicks:

- Landing checkout CTAs still use placeholders.
- Custom domain CNAME is not active.
- Security contact still uses placeholder flow.

## Suggested Click Order

1. Buy `mcpscanhq.com`.
2. Create `hello@mcpscanhq.com`.
3. Add DNS records and wait for DNS/email authentication.
4. Create Stripe Payment Links.
5. Use the approved-links command builder and publish the updated landing links.
6. Run launch verification.
7. Publish npm if desired.
8. Source and approve the first exact outbound messages.
9. Track interested prospects in the first-revenue pipeline.
10. Deliver paid audits through the private workspace template.

