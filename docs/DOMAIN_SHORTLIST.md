# Domain Shortlist

## Recommendation

If the goal is the fastest credible launch domain, buy:

1. `trymcpscan.com`
2. `getmcpscan.com`
3. `mcpscan.us`

`trymcpscan.com` is the best trust/cost balance if the registrar cart confirms
standard pricing. It keeps the MCPScan brand, uses the highest-trust TLD for
buyers, and avoids the renewal jump that comes with many ultra-cheap TLDs.

Use `mcpscan.us` if you want the cheapest credible option. It is less global than
`.com`, but it is more credible for a B2B security offer than a novelty promo
TLD.

Only buy a `$0.98` `.online` or `.site` domain as a temporary redirect, parking
domain, or cash-conservation launch domain.
For a paid security audit offer, the low first-year price is not worth the lower
trust signal or the renewal jump.

If you choose the about `$1` path anyway, search these in Spaceship:

1. `getmcpscan.site`
2. `getmcpscan.online`
3. `trymcpscan.site`
4. `trymcpscan.online`

## Avoid As Primary Brand

Avoid building the main business around these exact-match names unless you are comfortable with crowded naming:

- `mcpscan.com`, `mcpscan.dev`, or `mcpscan.app`
- `mcpguard.*`
- `mcpaudit.*`
- `mcpwatch.*`
- `mcpsecure.*`

There are already visible MCP scanner/security projects or domains around these names. That does not automatically block use, but it makes differentiation harder.

## Pricing Notes

Current public Spaceship pricing observations:

- `.com`: about $8.88 first year, renews around $9.98.
- `.dev`: about $8.28 first year, renews around $12.42.
- `.app`: about $8.28 first year, renews around $14.49.
- `.tools`: about $7.25 first year, renews around $28.98.
- `.online`: about $0.98 first year plus ICANN fee, renews around $21.38 plus ICANN fee.
- `.site`: about $0.98 first year plus ICANN fee, renews around $21.38 plus ICANN fee.
- `.shop`: about $0.70 first year plus ICANN fee, renews around $31.05 plus ICANN fee.
- `.pro`: can be cheap first year, but renewal can be materially higher than `.com`.
- `.us`: often cheaper than `.com`, with lower renewal risk than many novelty TLDs.
- `.security`: not budget-friendly; current public pricing is far above the launch budget.
- Zoho Mail Lite, Google Workspace, or Spacemail: one mailbox is enough for launch. Confirm the current cart price
  before purchase because public email promos change.

For the complete cost and repo separation decision, use
`docs/LAUNCH_COST_AND_INFRASTRUCTURE_PLAN_2026-08-14.md`.

Always confirm in the Spaceship cart before purchase because promo pricing and ICANN fees can change.

## Setup After Purchase

1. Add the domain to GitHub Pages for `Davidleeops/mcpscan`.
2. Add DNS records in Spaceship.
3. Enable HTTPS in GitHub Pages.
4. Create `security@domain` mailbox with `audit@domain` and `hello@domain` aliases.
5. Replace GitHub issue CTAs in `landing/index.html` with Stripe links and/or `mailto:security@domain`.
6. Verify DNS and mail records with `npm run launch:verify-dns -- --domain domain --mail-provider {{zoho_or_google_or_spacemail}} --update-status`.
