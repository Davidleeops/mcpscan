# Domain And Mailbox Purchase Packet

Generated: 2026-08-14

Use this before buying a domain or mailbox. It keeps the purchase lane, spend cap, renewal tradeoff, and post-click values explicit.

## Default Click Choice

For the fastest cheap launch, use this as the default unless you explicitly decide to spend more for trust:

```text
Domain: mcpscan.online
Registrar: Spaceship
Mail provider: Spacemail
Primary mailbox: security@mcpscan.online
Aliases: audit@mcpscan.online, hello@mcpscan.online
Maximum first-year domain spend: $3 before mailbox
```

Buy it only if the Spaceship cart shows the domain is available, the first-year domain price is at or below `$3`, the renewal price is visible, and no paid add-ons are included.

## Escape Lanes

Use these only if the default cart fails or you consciously choose a higher-trust path.

Trust lane:

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

Near-dollar backup:

```text
Domain: mcpscan.online
Primary mailbox: security@mcpscan.online
Aliases: audit@mcpscan.online, hello@mcpscan.online
```

Avoid `.shop` as the primary MCPScan domain.

## Current Cart Rules

- Search `mcpscan.online` first for the default cheap lane.
- Use Spacemail first for one-vendor convenience unless you explicitly choose Zoho Mail Lite for lowest annual mailbox cost or Google Workspace for maximum buyer trust.
- Search `getmcpscan.com` only if you decide trust matters more than the near-dollar domain cap.
- Search `mcpattest.dev` only if you are open to a cleaner security brand.
- Search `mcpscan.site` if the `.online` cart fails, is unavailable, or is materially worse.
- Search `getmcpscan.xyz` if the strict cash cap is `$1` to `$3` and you want the cleaner renewal tradeoff.
- If `.online` or `.site` jumps in cart pricing, search `getmcpscan.site`, then `getmcpscan.online`.
- Confirm the renewal price before purchase. `.site` and `.online` can renew near the low `$20s`, while `.xyz` is currently lower.
- Use promo codes only if the cart accepts them. Official Spaceship pages showed `.site` and `.online` at `$0.98` plus the ICANN fee on 2026-08-14, and `.xyz` at `$1.86` with `$12.52` renewal. The Spaceship cart is the final source.
- Buy the domain at Spaceship if the cart confirms the selected lane.
- Default mailbox path: use Spacemail for one mailbox in the same Spaceship account.
- Cheapest credible email path: use Zoho Mail Lite for one custom-domain mailbox only if the founder wants the lowest annual mailbox cost and accepts a separate provider.
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
Mailbox plan: Zoho Mail Lite one mailbox, Google Workspace one mailbox, or Spacemail one mailbox if one-vendor setup is preferred
Primary mailbox:
Aliases:

Approved action:
Buy one MCPScan launch domain and one matching mailbox. Do not buy extra domains, paid hosting, extra mailboxes, paid SSL add-ons, paid privacy upsells, or site-builder products without separate approval. Keep free included privacy if available.
```

## Click Path

1. Run `npm run launch:prepare-founder-clicks -- --domain mcpscan.online --mail-provider spacemail`.
2. Open `ops/domain-mailbox-purchase-packet.html`.
3. Search `mcpscan.online` in Spaceship.
4. Copy the purchase approval message only if the cart is at or below the cap and has no paid add-ons.
5. Buy one domain only in Spaceship.
6. Create one Spacemail mailbox for that domain.
7. Add `audit@` and `hello@` aliases.
8. Copy the generated post-click values into `ops/founder-return-packet.html`.
9. Create Stripe Payment Links.
10. Send the approved return packet to Codex.

## Stop Conditions

- Stop if the domain is premium-priced.
- Stop if the cart includes extra hosting, site builder, paid SSL, multiple domains, or multiple mailboxes.
- Stop if the mailbox is not on the chosen domain.
- Stop if the renewal price is not visible or is unacceptable.
- Do not use the mailbox for outbound until MX, SPF, DKIM, and DMARC pass.
