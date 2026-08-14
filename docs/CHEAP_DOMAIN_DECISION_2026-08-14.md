# MCPScan Cheap Domain Decision

Date: August 14, 2026

Status: founder purchase approval required. Do not buy until the Spaceship cart shows the exact domain, first-year price, renewal price, and mailbox plan.

## Decision

For the cheap validation path, search `getmcpscan.xyz` first. The current official Spaceship pricing page shows `.xyz` at `$1.86/yr` before final cart confirmation, with renewal around `$12.52/yr`. That is still under the `$3` cheap-lane cap and has a better renewal posture than the near-dollar novelty options. The final Spaceship cart is the source of truth.

Use `mcpscan.online` or `mcpscan.site` only as backups if `getmcpscan.xyz` is unavailable, premium-priced, or blocked in the final cart. Current official Spaceship pricing shows `.online` and `.site` at `$0.98/yr` before ICANN fee, with renewal around `$21.38/yr`. They are useful for a near-dollar validation lane, but their renewal posture and buyer-trust signal are materially weaker.

Use `getmcpscan.com` if you decide the extra credibility is worth a higher first-year cost. Current official Spaceship pricing shows `.com` at `$8.88/yr` before ICANN fee, with renewal around `$9.98/yr`. That is still the best buyer-trust choice if the exact name is available and not premium-priced.

Avoid `mcpscan.shop` for the primary launch domain even if it is cheaper. Current official Spaceship pricing shows `.shop` at `$0.70/yr`, but renewal is around `$31.05/yr` and the extension reads like ecommerce, not B2B security.

## Current Official Spaceship Price Signals

Checked on August 14, 2026. These are pricing-page signals, not purchase approval. The cart must still show the exact name, renewal price, add-ons, mailbox plan, and final total before buying.

| TLD | First-Year Signal | Renewal Signal | Use |
| --- | ---: | ---: | --- |
| `.shop` | `$0.70` plus ICANN fee | about `$31.05` plus ICANN fee | Avoid for security brand |
| `.online` | `$0.98` plus ICANN fee | about `$21.38` plus ICANN fee | Near-dollar backup |
| `.site` | `$0.98` plus ICANN fee | about `$21.38` plus ICANN fee | Near-dollar backup |
| `.click` | `$1.04` plus ICANN fee | about `$10.35` plus ICANN fee | Emergency fallback only |
| `.xyz` | `$1.86` plus ICANN fee | about `$12.52` plus ICANN fee | Best cheap validation lane |
| `.com` | `$8.88` plus ICANN fee | about `$9.98` plus ICANN fee | Best trust lane |

My current call: buy `getmcpscan.xyz` if the exact final cart is at or below `$3`, not premium-priced, and the renewal is acknowledged. Buy `mcpscan.online` or `mcpscan.site` only if the absolute lowest first-year checkout matters more than trust and renewal. Buy `getmcpscan.com` if you want the best buyer trust per dollar.

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
