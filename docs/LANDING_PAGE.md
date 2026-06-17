# Landing Page Publishing Checklist

The static landing page lives in `landing/index.html`. It is intended for a fast
commercial launch without waiting for a SaaS dashboard.

## Current Status

The landing page is publishable now with temporary intake links:

- `landing/sample-report.html` contains a sanitized sample paid-audit report.
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

## Domain And Hosting

The fastest free production URL is GitHub Pages:

- `https://davidleeops.github.io/mcpscan/`

Good custom-domain options once purchased:

- `https://getmcpscan.com`
- `https://trymcpscan.com`
- `https://mcpguard.dev`
- `https://shieldmcp.com`

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

Create one Stripe Payment Link for each package in `docs/GO_TO_MARKET.md`.
Confirm that the payment confirmation flow collects or redirects to intake
instructions for:

- Customer contact.
- MCP servers in scope.
- Environment names.
- Sanitized config files or secure transfer instructions.
- Known concerns and requested delivery date.

## Launch Notes

Before sending paid outbound traffic, verify:

- GitHub Pages deploy is green.
- Pricing matches `docs/GO_TO_MARKET.md`.
- Stripe links replace temporary GitHub issue intake links.
- Contact URL routes to a real inbox or form.
- The disclaimer remains visible near pricing.
- The sample CLI command still matches current CLI behavior.
- The page renders on mobile and desktop.
