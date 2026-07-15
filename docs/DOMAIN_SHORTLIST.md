# Domain Shortlist

## Recommendation

If the goal is the fastest credible launch domain, buy:

1. `mcpscanhq.com`
2. `mcpscanhq.dev`
3. `mcpscanlab.dev`

`mcpscanhq.com` is the best trust/cost balance if the registrar cart confirms
standard pricing. It keeps the MCPScan brand, uses the highest-trust TLD for
buyers, and avoids the renewal jump that comes with many ultra-cheap TLDs.

Use `mcpscanhq.dev` if you want the clearest developer-tool signal and are fine
with a non-`.com` primary domain. `.dev` requires HTTPS, which is fine for GitHub
Pages but should be enabled before public launch.

Only buy a `$0.98` `.online` or `.site` domain as a temporary redirect or test.
For a paid security audit offer, the low first-year price is not worth the lower
trust signal.

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
- `.online`: about $0.98 first year, renews around $21.38.
- `.pro`: can be cheap first year, but renewal can be materially higher than `.com`.
- `.security`: not budget-friendly; current public pricing is far above the launch budget.
- Spacemail Pro: about $14.16 for two years after trial, renews around $18.88 for two years.

Always confirm in the Spaceship cart before purchase because promo pricing and ICANN fees can change.

## Setup After Purchase

1. Add the domain to GitHub Pages for `Davidleeops/mcpscan`.
2. Add DNS records in Spaceship.
3. Enable HTTPS in GitHub Pages.
4. Create `hello@domain` mailbox or alias.
5. Replace GitHub issue CTAs in `landing/index.html` with Stripe links and/or `mailto:hello@domain`.
