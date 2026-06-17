# Domain And Email Setup

MCPScan can launch on GitHub Pages for free, then move to a custom domain once a domain is purchased.

## Recommended Domain Choice

Avoid choosing a domain only because it costs about $1. A cheap first-year TLD can look less trustworthy for a security product and may renew higher than expected.

Better first choices:

- `trymcpscan.com`
- `getmcpscan.com`
- `mcpscansecurity.com`
- `mcpguard.dev`
- `shieldmcp.com`

Current pricing notes from Spaceship research:

- `.online` can be around $0.98 for the first year, but renewal is much higher.
- `.com` is closer to $8.88/year first year and renews around $9.98/year.
- `.dev` is around $10.35/year first year and renews around $12.42/year.
- Spacemail starts around $0.59/month, billed as a multi-year purchase.

## Recommended Email

Once the domain is purchased, create:

- `hello@<domain>` for sales and support.
- `audits@<domain>` for delivery and report handoff.

If only one mailbox is purchased, use aliases:

- mailbox: `hello@<domain>`
- aliases: `audits@<domain>`, `support@<domain>`, `security@<domain>`

## GitHub Pages DNS

After the domain is purchased:

1. In GitHub repo settings, open Pages.
2. Set the custom domain.
3. In the domain DNS panel, point the domain to GitHub Pages.
4. Enable HTTPS after DNS verifies.

For a `www` subdomain:

```text
Type: CNAME
Host: www
Value: davidleeops.github.io
```

For an apex/root domain, use GitHub Pages' current `A` records from the official GitHub Pages docs.

## Landing Page Updates

After Stripe and email exist, update `landing/index.html`:

- Replace GitHub issue links with Stripe Payment Links.
- Replace contact link with `mailto:hello@<domain>` or a form.
- Add domain to GitHub Pages settings.

## Purchase Stop Point

Domain and mailbox purchase require payment and account access. Do not automate purchase unless the owner is actively present in the Spaceship checkout session.
