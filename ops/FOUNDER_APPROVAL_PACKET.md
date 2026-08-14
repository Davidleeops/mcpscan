# MCPScan Founder Approval Packet

This packet summarizes the remaining founder-only clicks. Everything else has been prepared as local consoles, scripts, templates, public pages, and delivery workflows.

Start here:

```text
ops/launch-cockpit.html
```

Or open it from the repo:

```text
npm run launch:open
```

For the founder-only click path:

```text
npm run launch:open-founder
```

To prebuild the default cheap-lane DNS and Stripe packets:

```text
npm run launch:prepare-cheap
```

That command writes the DNS packet, Stripe setup packet, DNS records CSV, and Stripe products CSV into `ops/generated-launch-packets/` for the default `mcpscan.site` lane. Open `ops/cheap-launch-packet-console.html` to use the generated files from one screen.

After the founder clicks, download the exact approval message from `ops/founder-return-packet.html` and the checkout QA evidence JSON from `ops/stripe-payment-link-qa-console.html`.

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
| GitHub billing | Clear account billing lock and re-run failed Actions jobs | `ops/github-actions-billing-console.html` | Account/payment issue | CI and Pages jobs start and pass |
| Domain | Buy `mcpscan.site` for the near-dollar lane, `getmcpscan.xyz` for cheap renewal balance, or `trymcpscan.com` only if trust is worth the extra spend | `ops/domain-email-dns-console.html` | About $1 to $3 for cheap validation, about $9 for `.com` | Domain resolves to GitHub Pages |
| Email | Create `security@{{chosen_domain}}` with `audit@` and `hello@` aliases | `ops/domain-email-dns-console.html` | About $18.88 for 2 years | MX, SPF, DKIM, and DMARC pass |
| Stripe | Create 3 Payment Links | `ops/stripe-click-setup.html` | Stripe processing fees only | Quick, Launch, Enterprise links exist |
| Link update | Apply real domain/email/Stripe links | `ops/approved-links-command-builder.html` | No spend | `npm run launch:verify -- --domain {{chosen_domain}}` has no checkout/domain warnings |
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
- No outbound from `security@{{chosen_domain}}` until MX, SPF, DKIM, and DMARC pass.
- No npm publish until npm login and 2FA/OTP are confirmed.
- No live customer audit begins until sanitized intake or approved private handoff is confirmed.

## Verification

Current public state:

```text
npm run launch:verify
```

After domain and link approval:

```text
npm run launch:verify -- --domain {{chosen_domain}}
```

Final strict launch check:

```text
npm run launch:verify -- --domain {{chosen_domain}} --strict
```

Current expected warnings before founder clicks:

- Landing checkout CTAs still use placeholders.
- Custom domain CNAME is not active.
- Security contact still uses placeholder flow.

## Final Click Path

```text
docs/FINAL_FOUNDER_CLICK_PATH.md
ops/final-founder-click-console.html
```

## Suggested Click Order

1. Clear the GitHub billing lock and re-run failed Actions jobs.
2. Buy `mcpscan.site` if the cart is near $1 and renewal is accepted, or `getmcpscan.xyz` if renewal matters more.
3. Create the matching `security@` mailbox.
4. Add DNS records and wait for DNS/email authentication.
5. Create Stripe Payment Links.
6. Use the approved-links command builder and publish the updated landing links.
7. Run launch verification.
8. Publish npm if desired.
9. Source and approve the first exact outbound messages.
10. Track interested prospects in the first-revenue pipeline.
11. Deliver paid audits through the private workspace template.
