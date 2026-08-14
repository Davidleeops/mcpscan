# Domain And Email Setup

MCPScan can launch on GitHub Pages for free, then move to a custom domain once a domain is purchased.

## Recommended Domain Choice

Avoid choosing a domain only because it costs about $1. A cheap first-year TLD can look less trustworthy for a security product and may renew higher than expected.

Better first choices:

- `getmcpscan.com`
- `trymcpscan.com`
- `mcpscanlab.dev`
- `mcpsecure.app`
- `mcpscan.tools`

Recommended buy: `getmcpscan.com`, if the checkout confirms it is a standard
registration. It is not the cheapest first-year option, but it is the cleanest
brand/trust choice for a security audit offer and the renewal is low.

Current pricing notes from Spaceship research:

- `.com` is closer to $8.88/year first year and renews around $9.98/year.
- `.dev` is around $8.28/year first year and renews around $12.42/year.
- `.app` is around $8.28/year first year and renews around $14.49/year.
- `.online` can be around $0.98 for the first year, but renewal is much higher and the trust signal is weaker.
- `.us` can be cheaper than `.com`, but it has US nexus and registration privacy tradeoffs.
- Spacemail Pro has been seen around $18.88 for 2 years for 1 mailbox, with aliases. Confirm the current cart before purchase.

Full launch cost plan:

```text
docs/LAUNCH_COST_AND_INFRASTRUCTURE_PLAN_2026-08-14.md
```

Public trust checklist:

```text
docs/PUBLIC_TRUST_CHECKLIST.md
```

## Recommended Email

Once the domain is purchased, create:

- `audit@<domain>` for sales and support.
- `security@<domain>` as an alias for disclosure and trust workflows.
- `hello@<domain>` as an alias for general inbound.
- `audits@<domain>` for delivery and report handoff.

Start with one mailbox and aliases:

- mailbox: `audit@<domain>`
- aliases: `security@<domain>`, `hello@<domain>`, `support@<domain>`

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
- Replace contact link with `mailto:audit@<domain>` or a form.
- Add domain to GitHub Pages settings.

## Purchase Stop Point

Domain and mailbox purchase require payment and account access. Do not automate purchase unless the owner is actively present in the Spaceship checkout session.

If buying `.us`, confirm the founder is comfortable with the US nexus requirement and the domain registration privacy tradeoff before purchase.
