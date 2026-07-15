# Stripe Product Setup

Create one Stripe Payment Link per package. Keep the product names concrete and buyer-readable.

## Product 1

Product name:

MCP Quick Audit

Price:

$750 one-time

Payment Link headline:

MCP Quick Audit

Payment Link description:

A fixed-scope security review of up to 3 MCP servers in 1 environment. Includes MCP server and tool inventory, configuration risk review, secret exposure review, prompt-injection and tool-description risk review, written report, and remediation checklist. Delivered in 3 business days after intake is complete.

Checkout confirmation copy:

Thanks for purchasing the MCP Quick Audit. You will receive an intake email within 1 business day requesting your MCP configuration files, servers in scope, and business context.

Internal fulfillment note:

No findings call or re-scan included unless purchased separately.

## Product 2

Product name:

MCP Launch Audit

Price:

$1,500 one-time

Payment Link headline:

MCP Launch Audit

Payment Link description:

A practical MCP security audit for teams preparing customer pilots, internal rollout, or launch. Covers up to 8 MCP servers across up to 2 environments. Includes server and tool inventory, permission review, secret exposure review, prompt-injection and tool-description risk review, written report, remediation checklist, 30-minute findings call, and 1 re-scan after fixes. Delivered in 5 business days after intake is complete.

Checkout confirmation copy:

Thanks for purchasing the MCP Launch Audit. You will receive an intake email within 1 business day. After the report is delivered, we will schedule your findings call and coordinate one included re-scan after fixes.

Internal fulfillment note:

This should be the default recommended package.

## Product 3

Product name:

MCP Enterprise Readiness Audit

Price:

$3,500 one-time

Payment Link headline:

MCP Enterprise Readiness Audit

Payment Link description:

A deeper MCP security audit for teams preparing enterprise review. Covers up to 15 MCP servers across up to 3 environments. Includes server and tool inventory, configuration and permission review, secret exposure review, prompt-injection and tool-description risk review, executive summary, detailed written report, remediation checklist, 45-minute findings call, buyer-facing security summary, and 1 re-scan after fixes. Delivered in 7 business days after intake is complete.

Checkout confirmation copy:

Thanks for purchasing the MCP Enterprise Readiness Audit. You will receive an intake email within 1 business day to confirm scope, collect MCP materials, and set the delivery timeline.

Internal fulfillment note:

Use this package for teams with enterprise customers, production credentials, multiple environments, or buyer security questionnaires.

## Optional Add-Ons

### Extra MCP Server

Price:

$150 one-time

Description:

Adds review coverage for 1 additional MCP server beyond the package limit.

### Expedited Delivery

Price:

50% of selected package price

Description:

Moves delivery target to 48 hours after intake is complete, subject to scope confirmation.

### Additional Remediation Call

Price:

$250 one-time

Description:

One additional 45-minute call to review remediation questions after report delivery.

### Custom MCP Security Checklist

Price:

$1,000 one-time

Description:

A customer-specific MCP security checklist or internal review policy based on the audit findings and the customer environment.

## Stripe Settings

Recommended settings:

- Collect customer name, email, company, and billing address.
- Add a required custom field: "Primary technical contact email".
- Add an optional custom field: "How many MCP servers do you want reviewed?"
- Add an optional custom field: "Target delivery date".
- Enable automatic receipt.
- Redirect to `https://davidleeops.github.io/mcpscan/thank-you.html` until a custom domain is live.
- Include terms that the audit starts after intake materials are complete.
- Link terms: `https://davidleeops.github.io/mcpscan/terms.html`
- Link privacy policy: `https://davidleeops.github.io/mcpscan/privacy.html`
- Link refund policy: `https://davidleeops.github.io/mcpscan/refund.html`
- Link secure intake guidance: `https://davidleeops.github.io/mcpscan/secure-intake.html`

Post-payment intake page:

```text
https://davidleeops.github.io/mcpscan/intake.html
```

Secure intake guidance:

```text
https://davidleeops.github.io/mcpscan/secure-intake.html
```

Refund note:

Offer a full refund before intake begins. After intake begins, refunds are discretionary because delivery work has started.
