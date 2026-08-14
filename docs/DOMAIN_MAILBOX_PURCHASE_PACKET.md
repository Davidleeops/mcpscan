# Domain And Mailbox Purchase Packet

Generated: 2026-08-14

Use this before buying a domain or mailbox. It keeps the purchase lane, spend cap, renewal tradeoff, and post-click values explicit.

## Default Choice

For the current low-cash sprint, use the cheap validation lane unless the founder decides the `.com` trust bump is worth the extra spend.

Near-dollar default:

```text
Domain: mcpscan.site
Primary mailbox: security@mcpscan.site
Aliases: audit@mcpscan.site, hello@mcpscan.site
```

Cheap renewal-friendlier backup:

```text
Domain: getmcpscan.xyz
Primary mailbox: security@getmcpscan.xyz
Aliases: audit@getmcpscan.xyz, hello@getmcpscan.xyz
```

Use the `.com` trust lane if the founder approves spending about `$9` to `$12` for the first-year domain. This is still the best trust-per-dollar choice for a paid B2B security audit.

```text
Domain: trymcpscan.com
Primary mailbox: security@trymcpscan.com
Aliases: audit@trymcpscan.com, hello@trymcpscan.com
```

Use the cheap validation lane only if the founder wants to keep the domain purchase near `$1` to `$3` and accepts the weaker trust signal. Search `.site` first for the lowest first-year total, `.xyz` first for the best cheap renewal tradeoff, then `.online`. Avoid `.shop` as the primary MCPScan domain.

## Current Cart Rules

- Search `trymcpscan.com` first if trust matters more than saving a few dollars.
- Search `mcpscan.site` first if the strict cash cap is near `$1` and the higher renewal is acceptable.
- Search `getmcpscan.xyz` first if the strict cash cap is `$1` to `$3` and you want the cleaner renewal tradeoff.
- If `.xyz` or `.site` jumps in cart pricing, search `mcpscan.online`, `getmcpscan.site`, then `getmcpscan.online`.
- Confirm the renewal price before purchase. `.site` and `.online` can renew near the low `$20s`, while `.xyz` is currently lower.
- Use promo codes only if the cart accepts them. Official Spaceship pages showed `.site` and `.online` at `$0.98` plus the ICANN fee on 2026-08-14, and `.xyz` at `$1.86` with `$12.52` renewal. The Spaceship cart is the final source.
- Buy one Spacemail mailbox only, preferably the Pro one-mailbox plan, then add aliases.
- Create the mailbox inside the same Spaceship or Spacemail account after the domain is in the account, so DNS, aliases, and billing stay together.

## Cart Safety Gate

Before clicking buy, enter the visible Spaceship cart values in `ops/domain-mailbox-purchase-packet.html`.

The packet should show no cart errors for:

- first-year domain price at or below the approved spend cap
- renewal price visible
- one Spacemail mailbox total visible
- zero extra domains
- zero extra mailboxes
- no hosting, site builder, paid SSL, privacy upsell, or other paid add-on

Stop and remove the item if the generated approval does not say the cart has no extra domains, no extra mailboxes, and no paid add-ons.

## Founder Purchase Approval

```text
I approve buying one MCPScan launch domain and one matching mailbox.

Purchase lane:
Domain to buy:
Registrar: Spaceship
Maximum first-year domain spend:
Renewal price acknowledged:
Mailbox plan: Spacemail Pro, one mailbox
Primary mailbox:
Aliases:

Approved action:
Buy one MCPScan launch domain and one matching mailbox. Do not buy extra domains, paid hosting, extra mailboxes, paid SSL add-ons, paid privacy upsells, or site-builder products without separate approval. Keep free included privacy if available.
```

## Click Path

1. Open `ops/domain-mailbox-purchase-packet.html`.
2. Choose the cheap validation lane for the current low-cash sprint, or `.com` trust lane if founder trust is worth the extra spend.
3. Copy the purchase approval message.
4. Buy one domain only in Spaceship.
5. Create one Spacemail mailbox for that domain.
6. Add `audit@` and `hello@` aliases.
7. Copy the generated post-click values into `ops/founder-return-packet.html`.
8. Create Stripe Payment Links.
9. Send the approved return packet to Codex.

## Stop Conditions

- Stop if the domain is premium-priced.
- Stop if the cart includes extra hosting, site builder, paid SSL, multiple domains, or multiple mailboxes.
- Stop if the mailbox is not on the chosen domain.
- Stop if the renewal price is not visible or is unacceptable.
- Do not use the mailbox for outbound until MX, SPF, DKIM, and DMARC pass.
