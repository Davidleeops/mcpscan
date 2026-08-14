# Stripe Payment Link Approval Packet

Date: August 14, 2026

Status: founder click preparation only. This packet does not create Stripe products or publish links.

## Goal

Create three Stripe Payment Links that can be safely placed on the MCPScan landing page and used for first revenue.

## Products To Create

| Product | Price | Payment Type | Landing Role |
| --- | ---: | --- | --- |
| MCP Quick Audit | $750 | One-time | Entry package |
| MCP Launch Audit | $1,500 | One-time | Default package |
| MCP Enterprise Readiness Audit | $3,500 | One-time | Enterprise package |

## Required Checkout Fields

- Customer name.
- Customer email.
- Company.
- Billing address.
- Required custom field: Primary technical contact email.
- Optional custom field: How many MCP servers do you want reviewed?
- Optional custom field: Target delivery date.

## Redirects And Policy Links

Use GitHub Pages URLs until the custom domain is live:

```text
Confirmation redirect: https://davidleeops.github.io/mcpscan/thank-you.html
Terms: https://davidleeops.github.io/mcpscan/terms.html
Privacy: https://davidleeops.github.io/mcpscan/privacy.html
Refund: https://davidleeops.github.io/mcpscan/refund.html
Secure intake: https://davidleeops.github.io/mcpscan/secure-intake.html
```

After the custom domain is active, update these to the chosen domain through the approved links command builder.

## Product Copy

### MCP Quick Audit

```text
A fixed-scope security review of up to 3 MCP servers in 1 environment. Includes MCP server and tool inventory, configuration risk review, secret exposure review, prompt-injection and tool-description risk review, written report, and remediation checklist. Delivered in 3 business days after intake is complete.
```

### MCP Launch Audit

```text
A practical MCP security audit for teams preparing customer pilots, internal rollout, or launch. Covers up to 8 MCP servers across up to 2 environments. Includes server and tool inventory, permission review, secret exposure review, prompt-injection and tool-description risk review, written report, remediation checklist, 30-minute findings call, and 1 re-scan after fixes. Delivered in 5 business days after intake is complete.
```

### MCP Enterprise Readiness Audit

```text
A deeper MCP security audit for teams preparing enterprise review. Covers up to 15 MCP servers across up to 3 environments. Includes server and tool inventory, configuration and permission review, secret exposure review, prompt-injection and tool-description risk review, executive summary, detailed written report, remediation checklist, 45-minute findings call, buyer-facing security summary, and 1 re-scan after fixes. Delivered in 7 business days after intake is complete.
```

## QA Before Publishing Links

Each link must pass every item:

- Product name matches the package exactly.
- Price is correct and one-time.
- Checkout is live mode, not test mode.
- Automatic receipts are enabled.
- Customer name, email, company, and billing address are collected.
- Primary technical contact email is required.
- Confirmation redirects to thank-you page.
- Terms, privacy, refund, and secure intake links are present in the checkout or linked from confirmation flow.
- The description says delivery begins after intake is complete.
- Refund wording matches the public refund policy.

## Apply Links Command

After all three Stripe links pass QA, verify the link format:

```text
npm run launch:verify-stripe -- --quick QUICK_PAYMENT_LINK --launch LAUNCH_PAYMENT_LINK --enterprise ENTERPRISE_PAYMENT_LINK
```

Then use:

```text
npm run launch:apply-links -- --domain getmcpscan.com --email audit@getmcpscan.com --quick QUICK_PAYMENT_LINK --launch LAUNCH_PAYMENT_LINK --enterprise ENTERPRISE_PAYMENT_LINK
```

Then verify:

```text
npm run writing:check
npm run launch:verify -- --domain getmcpscan.com
```

## Founder Approval Prompt

```text
Please approve these Stripe Payment Links for public launch. I will not apply them to the landing page unless you approve the exact URLs in this same turn.

Quick Audit: {{quick_payment_link}}
Launch Audit: {{launch_payment_link}}
Enterprise Audit: {{enterprise_payment_link}}
Domain: {{chosen_domain}}
Email: {{chosen_email}}
```
