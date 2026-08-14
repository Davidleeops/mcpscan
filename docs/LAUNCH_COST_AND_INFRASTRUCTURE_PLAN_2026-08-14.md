# MCPScan Launch Cost and Infrastructure Plan

Generated: 2026-08-14

## Recommendation

Use one public repo and one cheap domain for the first revenue push. Do not create a separate GitHub organization, paid repo, dashboard database, or SaaS stack until the first audit sale proves demand.

Best buy path:

1. Buy `trymcpscan.com` if Spaceship shows standard `.com` pricing.
2. If it is unavailable or premium-priced, buy `getmcpscan.com`.
3. If the founder wants a `$1` to `$3` validation domain, buy `mcpscan.site` if Spaceship confirms promo pricing and the renewal tradeoff is accepted.
4. If you want the cheapest credible non-promo fallback, buy `mcpscan.us`, but only after accepting the US nexus and registration privacy tradeoffs.
5. Avoid `.shop` and similar commerce-oriented near-dollar names as the primary security brand.

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
| Domain | `trymcpscan.com` | About $8.88 plus ICANN fee if standard-priced | About $9.98 plus ICANN fee | Yes |
| Cheap validation domain | `mcpscan.site` | About $0.98 plus ICANN fee at Spaceship if promo-priced | About $21.38 plus ICANN fee | Yes, if cash cap is `$1` to `$3` |
| Cheap credible fallback | `mcpscan.us` | About $4.14 | About $6.48 | Only if avoiding `.com` |
| 98-cent promo TLD | `.online` or `.site` | About $0.98 plus ICANN fee | About $21.38 | No |
| Ultra-cheap promo TLD | `.shop` | About $0.70 plus ICANN fee | About $31.05 | No |
| Email | One Spacemail mailbox | About $14 to $19 for the first term, depending on current cart | Confirm in cart | Yes |
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
| `trymcpscan.com` | High | Low | Low | Best primary pick |
| `getmcpscan.com` | High | Low | Low | Good backup |
| `mcpscanhq.com` | High | Low | Low | Good backup |
| `mcpscan.us` | Medium-high | Lower | Low | Cheapest credible fallback |
| `.dev` exact names | High for developers | Low-medium | Medium | Good only if available |
| `.xyz` exact names | Medium | Very low | Medium | Use only if exact and clean |
| `.online` or `.site` | Low-medium | Very low | High | Redirect or test only |
| `.shop` | Low for security | Very low | High | Avoid |
| `.ai` | High in AI | High | High | Not needed for first revenue |

## Purchase Instructions

1. Open Spaceship domain search.
2. Search `trymcpscan.com` first.
3. If it is unavailable or premium-priced, search `getmcpscan.com`.
4. Buy only if it is standard-priced and not premium.
5. If it is not available, use the backup from `docs/DOMAIN_PURCHASE_SHORTLIST_2026-08-14.md`.
6. If the approved budget cap is `$1` to `$3`, search `mcpscan.site`.
7. If the goal is the absolute lowest credible non-promo spend, search `mcpscan.us`.
8. Before buying `.us`, confirm the founder accepts US nexus eligibility and the registration privacy tradeoff.
9. Buy one domain only.
10. Buy one mailbox only.
11. Create `security@{{chosen_domain}}`.
12. Add aliases for `hello@{{chosen_domain}}` and `audit@{{chosen_domain}}`.
13. Do not send outbound until MX, SPF, DKIM, and DMARC pass.

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

- Spaceship domain pricing showed `.com` at about `$8.88` first year and `$9.98` renewal, plus ICANN fee.
- Spaceship domain pricing showed `.online` and `.site` at about `$0.98` first year and about `$21.38` renewal.
- Spaceship domain pricing showed `.shop` at about `$0.70` first year and about `$31.05` renewal.
- Spaceship domain pricing showed `.us` at about `$4.14` first year and about `$6.48` renewal.
- Public search also showed existing MCP scanner brands and domains, including `mcpscan.ai`, which makes a credible modifier such as `getmcpscan.com` safer than chasing novelty TLD cheapness.
- Public `.us` registry and registrar guidance shows `.us` has US nexus and privacy considerations, so it is a fallback rather than the default.

Always confirm final availability and cart pricing inside Spaceship before purchase.
