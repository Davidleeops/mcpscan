# Domain and Mailbox Decision

Generated: 2026-08-14

## Recommendation

Buy `getmcpscan.com` if Spaceship shows it available near normal `.com` pricing. It costs a few dollars more than a discount TLD, but it is the strongest trust signal for a B2B security buyer.

If you want the cheapest credible option, buy `mcpscan.us` if Spaceship shows it available. It is a legitimate US-founder fallback and avoids the trust penalty of novelty TLDs.

Avoid `.site`, `.online`, `.shop`, and similar near-dollar TLDs for the first paid security buyer. They save a few dollars but weaken trust.

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
| `getmcpscan.com` | Available in prior live check | About $9 to $12 | Best overall pick |
| `trymcpscan.com` | Available in prior live check | About $9 to $12 | Good backup |
| `usemcpscan.com` | Available in prior live check | About $9 to $12 | Good backup |

## Registrar Price Signals

| Option | First-Year Signal | Renewal Signal | Notes |
| --- | --- | --- | --- |
| `.com` at Spaceship | About $8.88 plus ICANN fee on current pricing pages | About $9.98 renewal plus ICANN fee | Best credibility per dollar when the name is available |
| `.dev` at Spaceship | About $8.28 plus ICANN fee | About $12.42 renewal | Best developer-tool signal, but key names checked unavailable |
| `.us` at Spaceship or comparable registrar | Low single digits to about $8 depending on registrar | Lower renewal than most novelty TLDs | Legitimate for a US founder, less SaaS-native than `.com` |
| `.xyz` at Spaceship | About $1 to $2 depending on promo | About $12 to $13 renewal | Cheap and developer-friendly, but the exact short name checked unavailable |
| `.site` or `.online` at Spaceship | About $1 to $2 promo pricing | About $21 to $22 renewal | Cheap first year, weaker trust signal for B2B security |
| Spacemail Pro | About $18.88 for 2 years | Check checkout before purchase | One mailbox with aliases is enough for launch |

Sources checked on 2026-08-14: Spaceship domain pricing, Spaceship promo terms, Spaceship registrar prices on TLD-List, TLDSpy Spaceship pricing, Spacemail pricing, and the live domain availability checker.

## Buying Rule

1. Search `getmcpscan.com` on Spaceship first.
2. If it is available and standard-priced, buy it.
3. If you want the cheapest acceptable option, search and buy `mcpscan.us`.
4. If `getmcpscan.com` is unavailable at checkout, use `trymcpscan.com`.
5. Buy one domain first.
6. Create one mailbox first: `audit@{{chosen_domain}}`.
7. Add aliases for `security@{{chosen_domain}}` and `hello@{{chosen_domain}}`.
8. Do not use the mailbox for outbound until MX, SPF, DKIM, and DMARC pass.

## After Purchase

Update these values before final verification:

```text
DOMAIN={{chosen_domain}}
MAILBOX=audit@{{chosen_domain}}
ALIASES=security@{{chosen_domain}},hello@{{chosen_domain}}
```

Then use `ops/domain-email-dns-console.html` for DNS and mailbox setup.

## DNS Verification

After the domain and mailbox records have time to propagate, run:

```text
npm run launch:verify-dns -- --domain {{chosen_domain}}
```

Use strict mode only when you expect every record to be live:

```text
npm run launch:verify-dns -- --domain {{chosen_domain}} --strict
```
