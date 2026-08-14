# MCPScan Launch Cost and Infrastructure Plan

Generated: 2026-08-14

## Recommendation

Use one public repo and one low-cost credible domain for the first revenue push. Do not create a separate GitHub organization, paid repo, dashboard database, or SaaS stack until the first audit sale proves demand.

Best buy path:

1. Buy `getmcpscan.com` if Spaceship shows standard `.com` pricing.
2. If it is unavailable or premium-priced, search `trymcpscan.com`, then `mcpscanhq.com`, then `usemcpscan.com`.
3. Buy `mcpattest.dev` if you approve a cleaner product name and Spaceship shows standard `.dev` pricing.
4. If the hard cash cap matters more than buyer trust, buy `getmcpscan.xyz` if Spaceship confirms standard cheap pricing and the name is clean.
5. Use `mcpscan.site` only if the final cart is near `$1` and the higher renewal is accepted.
6. If you want the cheapest credible non-promo fallback, buy `mcpscan.us`, but only after accepting the US nexus and registration privacy tradeoffs.
7. Avoid `.shop` and similar commerce-oriented near-dollar names as the primary security brand.
8. Do not pay for hosting. GitHub Pages plus a domain and one mailbox is enough before first revenue.

## Why This Is The Right Cost Posture

The current product is a revenue-first wedge, not a full SaaS yet. The fastest path to first revenue is:

- public landing page
- credible audit mailbox
- Stripe Payment Links
- productized service delivery
- targeted outbound
- private customer workspace outside the public repo

That avoids paying for infrastructure before there is proof that buyers want the audit.

## Current Cost Table

| Item | Recommended Pick | Expected Launch Cost | Renewal or Ongoing Cost | Needed Now |
| --- | --- | ---: | ---: | --- |
| GitHub repo | Existing public repo | $0 | $0 | Yes |
| GitHub Pages | Existing Pages site | $0 | $0 | Yes |
| Domain | `getmcpscan.com` | About $8.88 plus ICANN fee if standard-priced before any coupon | About $9.98 plus ICANN fee | Yes, only if founder trust matters more than the lowest spend |
| Cheapest validation domain | `mcpscan.site` | About $0.98 plus ICANN fee at Spaceship if promo-priced | About $21.38 plus ICANN fee | Yes, current lowest cash path |
| Cheap renewal-friendlier domain | `getmcpscan.xyz` | About $1.86 at Spaceship before any coupon | About $12.52 | Yes, if choosing the cheap lane |
| Cheap low-renewal fallback | `.click` name | About $1.04 plus ICANN fee | About $10.35 plus ICANN fee | No, weaker buyer trust |
| Cheap credible fallback | `mcpscan.us` | About $4.14 | About $6.48 | Only if avoiding `.com` |
| Near-dollar promo TLD | `.online` or `.site` | About $0.98 plus ICANN fee | About $21.38 | No |
| Ultra-cheap promo TLD | `.shop` | About $0.70 plus ICANN fee | About $31.05 | No |
| Email | Zoho Mail Lite, Google Workspace, or Spacemail | About $12 to $84 per year depending on provider choice and cart | Confirm in cart | Yes |
| Stripe Payment Links | Stripe account | $0 monthly | Processing fees per payment | Yes |
| npm publish | npm public packages | $0 | $0 | Useful |
| Database | None for launch | $0 | $0 | No |
| Dashboard hosting | None for launch | $0 | $0 | No |
| CRM | Repo CSVs and GitHub issues | $0 | $0 | Yes |

## Repo Structure Decision

It is okay to keep MCPScan in the same GitHub account as CapexLayer. It should not be mixed into the same product repo if the goal is to sell or spin off MCPScan later.

Use this structure:

```text
Davidleeops/mcpscan
  landing/
  packages/
  docs/
  sales/
  ops/
  delivery/customer-workspace-template/
```

Keep these outside the public repo:

```text
customer workspaces
customer configs
customer reports
private scan evidence
live credentials
mailbox credentials
Stripe secrets
```

This gives you the cleanest split-off story:

- MCPScan has its own repo history.
- MCPScan has its own domain and mailbox.
- MCPScan has its own Stripe products and Payment Links.
- CapexLayer is not required to understand or deliver the product.
- Customer materials are never entangled with public source code.

## Why Not Put This Inside CapexLayer

Putting MCPScan inside a CapexLayer repo would create avoidable sale friction:

- buyers or acquirers would have to separate unrelated IP
- public repo visitors would see mixed positioning
- customer data guardrails would be harder to explain
- valuation would be muddier if MCPScan becomes a standalone asset

Using the same GitHub account is fine. Using the same repo is the part to avoid.

## Domain Decision Matrix

| Domain Type | Buyer Trust | First-Year Cost | Renewal Risk | Recommendation |
| --- | --- | ---: | ---: | --- |
| `getmcpscan.com` | High | Low | Low | Best primary pick |
| `trymcpscan.com` | High | Low | Low | Good backup |
| `mcpscanhq.com` | High | Low | Low | Good backup |
| `mcpscan.us` | Medium-high | Lower | Low | Cheapest credible fallback |
| `.dev` exact names | High for developers | Low-medium | Medium | Good only if available |
| `.xyz` exact names | Medium | Very low | Medium | Best cheap validation lane if clean |
| `.online` or `.site` | Low-medium | Very low | High | Redirect or test only |
| `.shop` | Low for security | Very low | High | Avoid |
| `.ai` | High in AI | High | High | Not needed for first revenue |

## Purchase Instructions

1. Open Spaceship domain search.
2. Search `getmcpscan.com` first.
3. Buy it only if it is standard-priced, not premium, and the renewal is acknowledged.
4. If it is unavailable or premium-priced, search `trymcpscan.com`, then `mcpscanhq.com`, then `usemcpscan.com`.
5. Search `mcpattest.dev` if the founder approves the cleaner brand.
6. Search `getmcpscan.xyz` if the approved budget cap is `$1` to `$3` and renewal tradeoff matters more than buyer trust.
7. Search `mcpscan.site` only if the approved budget cap is near `$1`.
8. If `.site` or `.xyz` is unavailable or cart pricing jumps, search `mcpscan.online`, `getmcpscan.site`, then `getmcpscan.online`.
9. If the goal is the absolute lowest credible non-promo spend, search `mcpscan.us`.
10. Before buying `.us`, confirm the founder accepts US nexus eligibility and the registration privacy tradeoff.
11. Buy one domain only.
12. Buy one mailbox only.
13. Create `security@{{chosen_domain}}`.
14. Add aliases for `hello@{{chosen_domain}}` and `audit@{{chosen_domain}}`.
15. Do not send outbound until MX, SPF, DKIM, and DMARC pass.

## After Purchase

Paste the bought values into:

```text
ops/founder-return-packet.html
```

Then Codex can apply the launch values with:

```text
npm run launch:apply-return-packet -- --file /path/to/approved-return-packet.txt
```

Verification:

```text
npm run launch:verify-dns -- --domain {{chosen_domain}} --update-status
npm run launch:verify-stripe -- --file /path/to/approved-return-packet.txt --update-status
npm run launch:verify -- --domain {{chosen_domain}}
```

## Spend Ceiling Before First Revenue

Target maximum spend before the first paid audit:

```text
Domain: $5 to $12
Mailbox: $14 to $19
Stripe: $0 monthly
GitHub Pages: $0
npm: $0
Total before payment processing: about $19 to $31
```

Do not add paid database, SaaS hosting, analytics, CRM, or dashboard infrastructure before the first sale.

## Current Source Notes

Public pricing signals checked on 2026-08-14:

- Official Spaceship pricing showed `.com` at `$8.88` first year and `$9.98` renewal, plus ICANN fee, before any accepted coupon.
- Official Spaceship pricing showed `.xyz` at `$1.86` first year and `$12.52` renewal.
- Official Spaceship pricing showed `.online` and `.site` at `$0.98` first year and about `$21.38` renewal, plus ICANN fee.
- Spaceship domain pricing showed `.shop` at about `$0.70` first year and about `$31.05` renewal.
- Spaceship domain pricing showed `.us` at about `$4.14` first year and about `$6.48` renewal.
- Spaceship promo terms say offers can change, apply to first-year registrations, and exclude premium names.
- Spacemail public pricing shows business email from `$0.79/mo`, with Pro one-mailbox pricing around `$18.88` for 2 years after trial.
- Public search also showed existing MCP scanner brands and domains, including `mcpscan.ai`, which makes a credible modifier such as `getmcpscan.com` safer than chasing novelty TLD cheapness.
- Public `.us` registry and registrar guidance shows `.us` has US nexus and privacy considerations, so it is a fallback rather than the default.

Always confirm final availability and cart pricing inside Spaceship before purchase.
