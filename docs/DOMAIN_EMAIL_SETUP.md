# Domain And Email Setup

MCPScan can launch on GitHub Pages for free, then move to a custom domain once a domain is purchased.

## Recommended Domain Choice

Avoid choosing a domain only because it costs about $1. A cheap first-year TLD can look less trustworthy for a security product and may renew higher than expected.

Better first choices:

- `mcpscanhq.com`
- `mcpscanhq.dev`
- `mcpscanlab.dev`
- `mcpsecure.app`
- `mcpscan.tools`

Recommended buy: `mcpscanhq.com`, if the checkout confirms it is a standard
registration. It is not the cheapest first-year option, but it is the cleanest
brand/trust choice for a security audit offer and the renewal is low.

Current pricing notes from Spaceship research:

- `.com` is closer to $8.88/year first year and renews around $9.98/year.
- `.dev` is around $8.28/year first year and renews around $12.42/year.
- `.app` is around $8.28/year first year and renews around $14.49/year.
- `.online` can be around $0.98 for the first year, but renewal is much higher and the trust signal is weaker.
- Spacemail Pro is around $14.16 for 2 years after trial for 1 mailbox, with aliases.

## Recommended Email

Once the domain is purchased, create:

- `hello@<domain>` for sales and support.
- `audits@<domain>` for delivery and report handoff.

Start with one mailbox and aliases:

- mailbox: `hello@<domain>`
- aliases: `audits@<domain>`, `support@<domain>`, `security@<domain>`

This is enough for first revenue. Add separate mailboxes only after inbound
volume or delivery operations justify it.

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
