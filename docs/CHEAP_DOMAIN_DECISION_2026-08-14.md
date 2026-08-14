# MCPScan Cheap Domain Decision

Date: August 14, 2026

Status: founder purchase approval required. Do not buy until the Spaceship cart shows the exact domain, first-year price, renewal price, and mailbox plan.

## Decision

For the near-dollar path, search `mcpscan.online` first. It reads more like a usable product site than `.shop` or `.click`, and official Spaceship pricing showed `.online` at `$0.98/yr` plus the ICANN fee with renewal around `$21.38/yr`.

Use `mcpscan.site` as the cheap backup if `mcpscan.online` is unavailable, premium-priced, or blocked in the final cart. It has the same first-year and renewal posture in the current Spaceship pricing table.

Use `getmcpscan.xyz` if renewal posture matters more than first-year price. It is not as trust-heavy as `.com`, but it renews lower than `.site` or `.online` in the current pricing signals.

Avoid `mcpscan.shop` for the primary launch domain even if it is cheaper. It reads like ecommerce, not B2B security.

## Click Order

1. Open `ops/domain-mailbox-purchase-packet.html`.
2. Select the cheap validation lane.
3. Search `mcpscan.online` in Spaceship.
4. Confirm the first-year price is at or below `$3`.
5. Confirm the renewal price is visible and acceptable.
6. Remove paid hosting, paid SSL, site builder, paid privacy upsells, extra domains, and extra mailboxes.
7. Create one mailbox only: `security@mcpscan.online`.
8. Add aliases: `audit@mcpscan.online` and `hello@mcpscan.online`.
9. Open `ops/cheap-launch-packet-console.html` and use the prebuilt DNS and Stripe packet links.
10. Paste the final public values into `ops/founder-return-packet.html`.

## Cart Limits

Approved if the cart shows:

- one domain only
- first-year domain price at or below `$3`
- renewal price visible
- one mailbox only
- aliases included or available
- no paid add-ons
- free included domain privacy only

Stop if any cart line is unclear. The cart is the final source of truth.

## Sources

- Spaceship domains: `https://www.spaceship.com/domains/`
- Spaceship business email: `https://www.spaceship.com/business-email/`
- TLDSpy Spaceship pricing comparison: `https://tldspy.com/registrar/spaceship`
