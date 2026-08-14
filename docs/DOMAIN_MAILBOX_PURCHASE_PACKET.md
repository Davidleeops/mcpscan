# Domain And Mailbox Purchase Packet

Generated: 2026-08-14

Use this before buying a domain or mailbox. It keeps the purchase lane, spend cap, renewal tradeoff, and post-click values explicit.

## Default Choice

For first revenue, use the `.com` trust lane if Spaceship shows a standard cart price. The extra few dollars are worth it for B2B security trust and cold outbound deliverability.

Trust default:

```text
Domain: getmcpscan.com
Primary mailbox: security@getmcpscan.com
Aliases: audit@getmcpscan.com, hello@getmcpscan.com
```

If `getmcpscan.com` is unavailable or premium-priced, search `trymcpscan.com`, then `mcpscanhq.com`, then `usemcpscan.com`.

Clean-brand option if you are open to moving beyond the MCPScan name:

```text
Domain: mcpattest.dev
Primary mailbox: security@mcpattest.dev
Aliases: audit@mcpattest.dev, hello@mcpattest.dev
```

Cheap renewal-friendlier backup:

```text
Domain: getmcpscan.xyz
Primary mailbox: security@getmcpscan.xyz
Aliases: audit@getmcpscan.xyz, hello@getmcpscan.xyz
```

Near-dollar validation option:

```text
Domain: mcpscan.online
Primary mailbox: security@mcpscan.online
Aliases: audit@mcpscan.online, hello@mcpscan.online
```

Use the cheap validation lane only if the founder wants to keep the domain purchase near `$1` to `$3` and accepts the weaker trust signal. Search `mcpscan.online` first for the current near-dollar lane, `mcpscan.site` second if the .online cart fails, then `getmcpscan.xyz` if renewal posture matters more than the absolute lowest first-year price. Avoid `.shop` as the primary MCPScan domain.

## Current Cart Rules

- Search `getmcpscan.com` first unless the domain budget is strictly capped near `$1` to `$3`.
- Search `mcpattest.dev` first if you are open to a cleaner security brand.
- Search `mcpscan.online` first if the strict cash cap is near `$1` and the higher renewal is acceptable.
- Search `mcpscan.site` if the `.online` cart fails, is unavailable, or is materially worse.
- Search `getmcpscan.xyz` if the strict cash cap is `$1` to `$3` and you want the cleaner renewal tradeoff.
- If `.online` or `.site` jumps in cart pricing, search `getmcpscan.site`, then `getmcpscan.online`.
- Confirm the renewal price before purchase. `.site` and `.online` can renew near the low `$20s`, while `.xyz` is currently lower.
- Use promo codes only if the cart accepts them. Official Spaceship pages showed `.site` and `.online` at `$0.98` plus the ICANN fee on 2026-08-14, and `.xyz` at `$1.86` with `$12.52` renewal. The Spaceship cart is the final source.
- Buy the domain at Spaceship if the cart confirms standard `.com` pricing.
- Cheapest credible email path: use Zoho Mail Lite for one custom-domain mailbox if the founder is comfortable with a separate email provider.
- One-vendor convenience path: use Spacemail for one mailbox if keeping domain and mailbox in Spaceship matters more than the lowest email price.
- Create one mailbox only, then add aliases.

## Cart Safety Gate

Before clicking buy, enter the visible Spaceship cart values in `ops/domain-mailbox-purchase-packet.html`.

The packet should show no cart errors for:

- first-year domain price at or below the approved spend cap
- renewal price visible
- one selected-provider mailbox total visible
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
Mailbox plan: Zoho Mail Lite one mailbox, or Spacemail one mailbox if one-vendor setup is preferred
Primary mailbox:
Aliases:

Approved action:
Buy one MCPScan launch domain and one matching mailbox. Do not buy extra domains, paid hosting, extra mailboxes, paid SSL add-ons, paid privacy upsells, or site-builder products without separate approval. Keep free included privacy if available.
```

## Click Path

1. Open `ops/domain-mailbox-purchase-packet.html`.
2. Choose the `.com` trust lane if the cart is standard-priced, the clean `.dev` lane if you approve a cleaner brand, or the cheap validation lane only if cash cap matters more than trust.
3. Copy the purchase approval message.
4. Buy one domain only in Spaceship.
5. Create one mailbox for that domain through Zoho Mail Lite or Spacemail.
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
