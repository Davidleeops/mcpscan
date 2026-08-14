# MCPScan Domain Purchase Shortlist

Generated: 2026-08-14

Status: approval required. Do not purchase a domain or mailbox until the founder approves the exact domain, registrar cart price, renewal price, and mailbox plan.

## Recommendation

If the goal is to spend `$1` to `$3` now and move fast, buy `mcpscan.site` if the Spaceship cart confirms promo pricing. It is direct, readable, and good enough for a fast first-revenue sprint.

If buyer trust matters more than saving about `$8`, buy `getmcpscan.com`. It is the stronger outbound and B2B security choice.

## Current Availability Signal

Checked through the domain availability tool on 2026-08-14:

| Domain | Availability Signal | Price Signal From Availability Tool | Role |
| --- | --- | ---: | --- |
| `mcpscan.com` | Not available | N/A | Skip |
| `getmcpscan.com` | Available | `$11.25` for 1 year | Best trust pick |
| `mcpscan.site` | Available | `$1.99` for 1 year | Best cheap launch pick |
| `getmcpscan.site` | Available | `$1.99` for 1 year | Backup cheap launch pick |
| `mcpscan.online` | Available | `$1.99` for 1 year | Backup cheap launch pick |
| `getmcpscan.online` | Available | `$1.99` for 1 year | Backup cheap launch pick |
| `mcpscan.xyz` | Not available | N/A | Skip |
| `getmcpscan.xyz` | Available | `$1.99` for 1 year | Developer-friendly backup |
| `mcpscan.shop` | Available | `$2.99` for 1 year | Avoid for security brand |
| `getmcpscan.shop` | Available | `$2.99` for 1 year | Avoid for security brand |

The availability tool is useful for availability signal. Use the Spaceship cart as the final source for purchase price.

## Spaceship Price Signals

Public Spaceship pricing checked on 2026-08-14:

| TLD | First-Year Signal | Renewal Signal | Decision |
| --- | ---: | ---: | --- |
| `.site` | `$0.98` plus ICANN fee | About `$21.38` plus ICANN fee | Best cheap launch lane |
| `.online` | `$0.98` plus ICANN fee | About `$21.38` plus ICANN fee | Good cheap backup |
| `.xyz` | `$1.86` plus ICANN fee on public pricing, lower promo may appear | About `$12.52` plus ICANN fee | Good only if clean name |
| `.click` | `$1.04` plus ICANN fee | About `$10.35` plus ICANN fee | Cheap, less premium |
| `.shop` | `$0.70` plus ICANN fee | About `$31.05` plus ICANN fee | Avoid for MCPScan |
| `.com` | `$8.88` plus ICANN fee | About `$9.98` plus ICANN fee | Best trust per dollar |

Spacemail pricing checked on 2026-08-14: one-mailbox plans start around `$0.98` per month or about `$18.88` for 2 years depending on plan term shown in cart. Buy one mailbox first, then use aliases.

## Buy Rule

1. Search `mcpscan.site` in Spaceship.
2. If it is available and the cart is about `$1` to `$3`, buy it if the founder approves the renewal tradeoff.
3. If `mcpscan.site` is unavailable, search `getmcpscan.site`.
4. If the founder prefers trust over the cheapest cart, search and buy `getmcpscan.com` if standard-priced.
5. Buy one domain only unless the founder explicitly approves a protective second domain.
6. Create one mailbox only, preferably `audit@{{chosen_domain}}`.
7. Add aliases for `hello@{{chosen_domain}}` and `security@{{chosen_domain}}`.
8. Do not send outbound until MX, SPF, DKIM, and DMARC pass.

## Founder Approval Text

```text
I approve buying the MCPScan launch domain.

Domain:
Registrar:
Maximum first-year domain spend:
Renewal price acknowledged:
Mailbox plan approved:
Primary site or redirect:

Approved action:
Buy one MCPScan launch domain and one matching mailbox. Do not buy extra domains, paid hosting, or extra mailboxes without a separate approval.
```

## Sources Checked

- Spaceship domain pricing: `https://www.spaceship.com/domains/`
- Spaceship promos: `https://www.spaceship.com/promos/`
- Spaceship business email: `https://www.spaceship.com/business-email/`
- Spacemail pricing: `https://www.spacemail.com/`
