# Domain and Mailbox Decision

Generated: 2026-08-14

## Recommendation

For speed and cost, buy the exact brand on `.xyz` if it is available for $1 to $3 in the first year and the renewal is acceptable. For credibility, `.com` is still the safer default if the price is under $10 and the exact cheap domain is not available.

Best order:

1. `mcpscan.xyz` as the cheap launch pick if available at promo pricing.
2. `mcpscanhq.com` as the credibility pick if available at standard pricing.
3. `trymcpscan.com` if the short names are unavailable.
4. `mcpaudit.xyz` if the product name is less important than the service intent.
5. `mcpreadiness.com` only if it is standard-priced, not premium-priced.

## Current Price Signals

| Option | First-Year Signal | Renewal Signal | Notes |
| --- | --- | --- | --- |
| `.xyz` at Spaceship | About $1 to $2 depending on current promo pages | About $12 to $13 | Best cheap but still acceptable developer-market TLD |
| `.site` or `.online` at Spaceship | About $1 to $2 promo pricing | About $21 to $22 | Cheap first year, weaker trust signal for B2B security |
| `.com` at Spaceship | About $9 first year on current Spaceship pricing pages | About $10 renewal plus ICANN fee | Best credibility per dollar if the name is available |
| `.app` at Spaceship | About $8 to $9 first year | About $15 renewal | Credible for software, but less ideal for a scanner service |

Sources checked on 2026-08-14: Spaceship domain pricing, TLD-List Spaceship pricing, TLDSpy Spaceship pricing, Namecheap domain pricing.

## Buying Rule

- Buy only one domain first unless checkout shows a very strong bundle price.
- Avoid premium-priced names.
- Avoid confusing TLDs for security buyers if the renewal is high.
- If `mcpscan.xyz` is available under $3, buy it for the fast launch.
- If the exact `.xyz` is not available or looks weird, buy `mcpscanhq.com` if it is under $10.
- Create one mailbox first: `hello@{{chosen_domain}}`.

## After Purchase

Update these values before final verification:

```text
DOMAIN={{chosen_domain}}
MAILBOX=hello@{{chosen_domain}}
```

Then use `ops/domain-email-dns-console.html` for DNS and mailbox setup.
