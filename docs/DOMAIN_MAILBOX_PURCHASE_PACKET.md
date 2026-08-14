# Domain And Mailbox Purchase Packet

Generated: 2026-08-14

Use this before buying a domain or mailbox. It keeps the purchase lane, spend cap, renewal tradeoff, and post-click values explicit.

## Default Choice

Use the `.com` trust lane if the founder approves spending about `$9` to `$12` for the first year domain.

```text
Domain: trymcpscan.com
Primary mailbox: security@trymcpscan.com
Aliases: audit@trymcpscan.com, hello@trymcpscan.com
```

Use the cheap validation lane only if the founder wants to keep the domain purchase near `$1` to `$3` and accepts the higher renewal.

```text
Domain: mcpscan.site
Primary mailbox: security@mcpscan.site
Aliases: audit@mcpscan.site, hello@mcpscan.site
```

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
Buy one MCPScan launch domain and one matching mailbox. Do not buy extra domains, paid hosting, extra mailboxes, SSL add-ons, privacy add-ons, or site-builder products without separate approval.
```

## Click Path

1. Open `ops/domain-mailbox-purchase-packet.html`.
2. Choose the `.com` trust lane or cheap validation lane.
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
