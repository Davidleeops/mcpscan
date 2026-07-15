# Landing Page Publishing Checklist

The static landing page lives in `landing/index.html`. It is intended for a fast
commercial launch without waiting for a SaaS dashboard.

## Current Status

The landing page is publishable now with temporary intake links:

- `landing/sample-report.html` contains a sanitized sample paid-audit report.
- `landing/thank-you.html` is ready as a Stripe post-payment redirect page.
- `landing/intake.html` is ready as a sanitized intake checklist.
- Pricing CTAs currently open GitHub issue request URLs.
- GitHub Pages deploys the `landing/` directory.

## Required Updates Before Paid Traffic

Replace temporary GitHub issue links in `landing/index.html` once account assets
exist:

- Stripe Payment Link for the $750 MCP Quick Audit.
- Stripe Payment Link for the $1,500 MCP Launch Audit.
- Stripe Payment Link for the $3,500 MCP Enterprise Readiness Audit.
- Contact form, email link, or scheduling page for buyers who need scope
  confirmation.
- Stripe post-payment redirect to `/thank-you.html`.

## Domain And Hosting

The fastest free production URL is GitHub Pages:

- `https://davidleeops.github.io/mcpscan/`

Good custom-domain options once purchased:

- `https://mcpscanhq.com`
- `https://mcpscanhq.dev`
- `https://mcpscanlab.dev`

The page is static HTML/CSS only, so it can also be hosted on Netlify, Vercel,
Cloudflare Pages, S3, or any equivalent static host.

## Sample Report

The sample report should be sanitized and buyer-facing. It should show:

- Executive summary.
- Scope reviewed.
- MCP server and tool inventory.
- Risk-ranked findings table.
- Evidence and remediation guidance.
- Out-of-scope notes.
- Re-scan expectations.

Do not include real customer names, credentials, internal hostnames, private
repository paths, tokens, or proprietary MCP configuration.

## Stripe Links

Create one Stripe Payment Link for each package in `sales/stripe-products.md`.
Confirm that the payment confirmation flow collects or redirects to intake
instructions for:

- Customer contact.
- MCP servers in scope.
- Environment names.
- Sanitized config files or secure transfer instructions.
- Known concerns and requested delivery date.

Recommended redirect URL before custom domain:

```text
https://davidleeops.github.io/mcpscan/thank-you.html
```

Recommended intake URL before custom domain:

```text
https://davidleeops.github.io/mcpscan/intake.html
```

## Launch Notes

Before sending paid outbound traffic, verify:

- GitHub Pages deploy is green.
- Pricing matches `docs/GO_TO_MARKET.md`.
- Stripe links replace temporary GitHub issue intake links.
- Contact URL routes to a real inbox or form.
- The disclaimer remains visible near pricing.
- The sample CLI command still matches current CLI behavior.
- The page renders on mobile and desktop.
