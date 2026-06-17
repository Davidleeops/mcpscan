# Landing Page Publishing Checklist

The static landing page lives in `landing/index.html`. It is intended for a fast
commercial launch without waiting for a SaaS dashboard.

## Required Updates

Before publishing, replace these placeholders in `landing/index.html`:

- `PLACEHOLDER_SAMPLE_REPORT_URL`: link to a sanitized sample report.
- `PLACEHOLDER_STRIPE_QUICK_AUDIT_URL`: Stripe Payment Link for the $750 MCP
  Quick Audit.
- `PLACEHOLDER_STRIPE_LAUNCH_AUDIT_URL`: Stripe Payment Link for the $1,500 MCP
  Launch Audit.
- `PLACEHOLDER_STRIPE_ENTERPRISE_AUDIT_URL`: Stripe Payment Link for the $3,500
  Enterprise Readiness Audit.
- `PLACEHOLDER_CONTACT_URL`: contact form, email link, or scheduling page for
  buyers who need scope confirmation.

## Domain And Hosting

Choose the production URL before launch, then update any external references to
the landing page. Good first options:

- `https://mcpscan.dev`
- `https://getmcpscan.com`
- A subpath on an existing domain, such as `/mcpscan`

The page is static HTML/CSS only, so it can be hosted on Netlify, Vercel, GitHub
Pages, Cloudflare Pages, S3, or any equivalent static host.

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

Before sending outbound traffic, verify:

- All placeholder links are replaced.
- Pricing matches `docs/GO_TO_MARKET.md`.
- The disclaimer remains visible near pricing.
- The sample CLI command still matches current CLI behavior.
- The page renders on mobile and desktop.
