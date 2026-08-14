# MCPScan Stripe Setup Packet For mcpscan.online

Generated: 2026-08-14

## Rule

Create exactly three one-time live-mode Stripe Payment Links. Do not create subscriptions, trials, coupons, metered billing, customer portals, or extra products unless separately approved.

## Shared Checkout Settings

| Setting | Required Value |
| --- | --- |
| Payment type | One-time payment |
| Currency | USD |
| Mode | Live mode |
| Customer name | Required |
| Customer email | Required |
| Company | Required when available in Stripe checkout fields |
| Billing address | Required |
| Automatic receipts | Enabled |
| Required custom field | Primary technical contact email |
| Optional custom field | How many MCP servers do you want reviewed? |
| Optional custom field | Target delivery date |
| Confirmation redirect | https://mcpscan.online/thank-you.html |
| Terms URL | https://mcpscan.online/terms.html |
| Privacy URL | https://mcpscan.online/privacy.html |
| Refund URL | https://mcpscan.online/refund.html |
| Secure intake URL | https://mcpscan.online/secure-intake.html |
| Public contact | security@mcpscan.online |

## Products

| Product | Price | Payment Type | Landing Role |
| --- | ---: | --- | --- |
| MCP Quick Audit | $750 | One-time | Entry package |
| MCP Launch Audit | $1,500 | One-time | Default first-revenue package |
| MCP Enterprise Readiness Audit | $3,500 | One-time | Enterprise package |

### MCP Quick Audit

Stripe product name:

```text
MCP Quick Audit
```

Price:

```text
$750 USD, one-time
```

Description:

```text
A fixed-scope security review of up to 3 MCP servers in 1 environment. Includes MCP server and tool inventory, configuration risk review, secret exposure review, prompt-injection and tool-description risk review, written report, and remediation checklist. Delivered in 3 business days after intake is complete.
```

### MCP Launch Audit

Stripe product name:

```text
MCP Launch Audit
```

Price:

```text
$1,500 USD, one-time
```

Description:

```text
A practical MCP security audit for teams preparing customer pilots, internal rollout, or launch. Covers up to 8 MCP servers across up to 2 environments. Includes server and tool inventory, permission review, secret exposure review, prompt-injection and tool-description risk review, written report, remediation checklist, 30-minute findings call, and 1 re-scan after fixes. Delivered in 5 business days after intake is complete.
```

### MCP Enterprise Readiness Audit

Stripe product name:

```text
MCP Enterprise Readiness Audit
```

Price:

```text
$3,500 USD, one-time
```

Description:

```text
A deeper MCP security audit for teams preparing enterprise review. Covers up to 15 MCP servers across up to 3 environments. Includes server and tool inventory, configuration and permission review, secret exposure review, prompt-injection and tool-description risk review, executive summary, detailed written report, remediation checklist, 45-minute findings call, buyer-facing security summary, and 1 re-scan after fixes. Delivered in 7 business days after intake is complete.
```

## Evidence To Capture Before Approval

- Screenshot or dashboard confirmation that each product is live mode.
- Screenshot or dashboard confirmation that each price is one-time USD.
- Screenshot or dashboard confirmation that automatic receipts are enabled.
- Screenshot or dashboard confirmation that required customer fields are configured.
- The three live `https://buy.stripe.com/` URLs.

## Verify Link Format

```text
npm run launch:verify-stripe -- --quick QUICK_PAYMENT_LINK --launch LAUNCH_PAYMENT_LINK --enterprise ENTERPRISE_PAYMENT_LINK --update-status
```

## Founder Approval Text

```text
I approve applying these exact MCPScan launch values:

Domain: mcpscan.online
Primary mailbox: security@mcpscan.online
Audit alias: audit@mcpscan.online
Hello alias: hello@mcpscan.online

Stripe Payment Links:
Quick Audit: {{quick_audit_stripe_payment_link}}
Launch Audit: {{launch_audit_stripe_payment_link}}
Enterprise Readiness: {{enterprise_readiness_stripe_payment_link}}

Approved action:
Apply these links to the public landing page, update the public contact email, add the custom domain file, update security/contact references, and run verification. Commit and push require separate approval after verification.

I also approve keeping outbound paused until I approve exact recipients and exact final messages in a same-turn approval.
```
