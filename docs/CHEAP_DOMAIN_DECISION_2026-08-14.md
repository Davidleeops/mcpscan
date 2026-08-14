# MCPScan Cheap Domain Decision

Date: August 14, 2026

Status: founder purchase approval required. Do not buy until the Spaceship cart shows the exact domain, first-year price, renewal price, and mailbox plan.

## Decision

For the near-dollar path, search `getmcpscan.xyz` first. Spaceship's current promo page showed `.xyz` at `$0.75/yr` with promo code `XYZ52`, while the live `.xyz` pricing page showed `$1.86/yr` before any accepted cart promo. The cart is the source of truth.

Use `mcpscan.online` or `mcpscan.site` only as backups if `getmcpscan.xyz` is unavailable, premium-priced, or blocked in the final cart. They can be cheap in the first year, but renewal posture is materially worse.

Use `getmcpscan.com` if you decide the extra credibility is worth a small extra first-year cost. Spaceship's current promo page showed `.com` at `$3.72/yr` with promo code `COM67`. That is still cheap enough for the trust lane if the exact name is available and not premium-priced.

Avoid `mcpscan.shop` for the primary launch domain even if it is cheaper. It reads like ecommerce, not B2B security.

Before purchase, create a public-safe cart proof and run:

```text
npm run launch:verify-cart -- --file /path/to/domain-cart-proof.json
```

Use `ops/domain-cart-proof.template.json` as the fill-in shape. The sample can be rehearsed with `npm run launch:verify-cart`.

## Click Order

1. Open `ops/domain-mailbox-purchase-packet.html`.
2. Select the cheap validation lane.
3. Search `getmcpscan.xyz` in Spaceship.
4. Confirm the first-year price is at or below `$3`.
5. Confirm the renewal price is visible and acceptable.
6. Fill the cart proof and run `npm run launch:verify-cart -- --file /path/to/domain-cart-proof.json`.
7. Remove paid hosting, paid SSL, site builder, paid privacy upsells, extra domains, and extra mailboxes.
8. Create one mailbox only: `security@getmcpscan.xyz`.
9. Add aliases: `audit@getmcpscan.xyz` and `hello@getmcpscan.xyz`.
10. Open `ops/cheap-launch-packet-console.html` and use the prebuilt DNS and Stripe packet links.
11. Paste the final public values into `ops/founder-return-packet.html`.

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
- Spaceship promos: `https://www.spaceship.com/promos/`
- Spaceship `.xyz` pricing: `https://www.spaceship.com/domains/gtld/xyz/`
- Spaceship business email: `https://www.spaceship.com/business-email/`
- Cart proof: `docs/SPACESHIP_CART_PROOF_2026-08-14.md`
- TLDSpy Spaceship pricing comparison: `https://tldspy.com/registrar/spaceship`
