# Domain and Mailbox Decision

Generated: 2026-08-14

## Recommendation

Buy `trymcpscan.com` if Spaceship shows it available near normal `.com` pricing. It costs a few dollars more than a discount TLD, but it is the strongest trust-to-cost path for a B2B security buyer.

If `trymcpscan.com` is unavailable or premium-priced, buy `getmcpscan.com`. If both are unavailable, search `mcpscanhq.com`, then `usemcpscan.com`.

If the founder wants the `$1` to `$3` launch lane, buy `mcpscan.site` if the Spaceship cart confirms promo pricing. Treat it as a fast validation domain and acknowledge the higher renewal before purchase.

If you want the cheapest credible option, buy `mcpscan.us` if Spaceship shows it available. It is a legitimate US-founder fallback and avoids the trust penalty of novelty TLDs.

If the only goal is to spend about `$1` today, use `getmcpscan.site` or `getmcpscan.online` as a temporary redirect or parking domain. Do not make either one the main buyer-facing domain unless cash conservation matters more than trust on the first paid security sale.

Avoid `.shop` and similar near-dollar TLDs for the first paid security buyer. They save a few dollars up front, but they weaken trust and often renew for more than `.com` or `.us`.

Important `.us` caveat: use `.us` only if the founder is comfortable with US nexus eligibility and the registration privacy tradeoff. It is still the cheapest credible fallback, but `.com` is cleaner for global B2B security buyers.

## Live Availability Snapshot

Checked through the domain availability tool on 2026-08-14:

| Domain | Live Availability | First-Year Price Signal | Decision |
| --- | --- | --- | --- |
| `mcpscan.dev` | Not available | N/A | Skip |
| `mcpscan.com` | Not available | N/A | Skip |
| `scanmcp.dev` | Not available | N/A | Skip |
| `mcpguard.dev` | Not available | N/A | Skip |
| `mcpaudit.dev` | Not available | N/A | Skip |
| Exact short `.xyz` name | Not available in live check | N/A | Skip unless Spaceship directly shows otherwise |
| `mcpscan.us` | Available in prior live check | Low single digits to about $8 | Cheapest credible fallback |
| `trymcpscan.com` | Likely available in current RDAP signal | About $9 to $12 | Best overall pick |
| `getmcpscan.com` | Available in prior live check | About $9 to $12 | Strong backup |
| `mcpscanhq.com` | Likely available in current RDAP signal | About $9 to $12 | Backup trust pick |
| `usemcpscan.com` | Available in prior live check | About $9 to $12 | Backup trust pick |
| `mcpscan.site` | Available in current availability signal | About $0.98 plus ICANN fee at Spaceship, about $1.99 in availability tool | Best cheap launch lane |
| `getmcpscan.site` | Available in current availability signal | About $0.98 plus ICANN fee at Spaceship, about $1.99 in availability tool | Cheapest backup launch lane |
| `mcpscan.online` | Available in current availability signal | About $0.98 plus ICANN fee at Spaceship, about $1.99 in availability tool | Cheapest backup launch lane |
| `getmcpscan.online` | Available in current availability signal | About $0.98 plus ICANN fee at Spaceship, about $1.99 in availability tool | Cheapest backup launch lane |

## Registrar Price Signals

| Option | First-Year Signal | Renewal Signal | Notes |
| --- | --- | --- | --- |
| `.com` at Spaceship | About $8.88 plus ICANN fee on current pricing pages | About $9.98 renewal plus ICANN fee | Best credibility per dollar when the name is available |
| `.dev` at Spaceship | About $8.28 plus ICANN fee | About $12.42 renewal | Best developer-tool signal, but key names checked unavailable |
| `.us` at Spaceship or comparable registrar | Low single digits to about $8 depending on registrar | Lower renewal than most novelty TLDs | Legitimate for a US founder, less SaaS-native than `.com` |
| `.xyz` at Spaceship | About $1 to $2 depending on promo | About $12 to $13 renewal | Cheap and developer-friendly, but the exact short name checked unavailable |
| `.online` at Spaceship | About $0.98 plus ICANN fee | About $21.38 renewal plus ICANN fee | Cheapest visible promo option, weaker trust signal for B2B security |
| `.site` at Spaceship | About $0.98 plus ICANN fee | About $21.38 renewal plus ICANN fee | Cheapest visible promo option, weaker trust signal for B2B security |
| `.shop` at Spaceship | About $0.70 plus ICANN fee | About $31.05 renewal plus ICANN fee | Lowest visible first-year price, not a good fit for a security audit brand |
| Spacemail Pro | About $18.88 for 2 years | Check checkout before purchase | One mailbox with aliases is enough for launch |

Sources checked on 2026-08-14: Spaceship domain pricing, Spaceship promo terms, Spaceship registrar prices on TLD-List, TLDSpy Spaceship pricing, Spacemail pricing, and the live domain availability checker.

The full launch cost and infrastructure decision lives in `docs/LAUNCH_COST_AND_INFRASTRUCTURE_PLAN_2026-08-14.md`.

The public trust launch checklist lives in `docs/PUBLIC_TRUST_CHECKLIST.md`.

## Buying Rule

1. Search `trymcpscan.com` on Spaceship first.
2. If it is available and standard-priced, buy it.
3. If it is unavailable or premium-priced, search and buy `getmcpscan.com`.
4. If both are unavailable, search `mcpscanhq.com`, then `usemcpscan.com`.
5. If you want the cheapest credible option, search and buy `mcpscan.us`.
6. If you want the absolute cheapest today, search `mcpscan.site`, `getmcpscan.site`, `mcpscan.online`, and `getmcpscan.online`, then buy one only if the cart is around `$1` to `$3` and you accept the renewal tradeoff.
7. Buy one domain first.
8. Create one mailbox first: `security@{{chosen_domain}}`.
9. Add aliases for `audit@{{chosen_domain}}` and `hello@{{chosen_domain}}`.
10. Do not use the mailbox for outbound until MX, SPF, DKIM, and DMARC pass.

## After Purchase

Update these values before final verification:

```text
DOMAIN={{chosen_domain}}
MAILBOX=security@{{chosen_domain}}
ALIASES=audit@{{chosen_domain}},hello@{{chosen_domain}}
```

Then use `ops/domain-email-dns-console.html` for DNS and mailbox setup.

Use `docs/DOMAIN_PURCHASE_SHORTLIST_2026-08-14.md` for the current approval-ready shortlist.

## DNS Verification

After the domain and mailbox records have time to propagate, run:

```text
npm run launch:verify-dns -- --domain {{chosen_domain}} --update-status
```

Use strict mode only when you expect every record to be live:

```text
npm run launch:verify-dns -- --domain {{chosen_domain}} --update-status --strict
```
