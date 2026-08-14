# MCPScan Spaceship Cart Proof

Date: August 14, 2026

Status: required before purchase if the founder chooses the cheap Spaceship lane.

## Purpose

This proof keeps the domain purchase cheap and clean. Before buying, put only public-safe cart facts into a JSON file, then run the verifier. Do not include card data, passwords, registrar login details, mailbox passwords, Stripe secrets, or customer data.

## Current Cheap Recommendation

Search `getmcpscan.xyz` first for the cheap validation lane. Official Spaceship pricing on August 14, 2026 showed `.xyz` at `$1.86/yr` before any accepted promo and renewal at `$12.52/yr`.

Use `mcpscan.online` or `mcpscan.site` only if the `.xyz` cart fails or those carts are materially better. They can be cheap in the first year, but renewal posture is materially worse.

Use `getmcpscan.com` if buyer trust matters more than the lowest first-year price.

Avoid `.shop` even though it is cheaper, because it reads like ecommerce rather than a B2B security audit.

## Mailbox Recommendation

For the tightest Spaceship-only checkout, use one Spacemail Pro mailbox if the cart matches the public pricing. Spaceship business email showed Spacemail Pro at `$0.00` for 30 days and `$18.88/2 yr` after trial.

Zoho Mail remains a credible low-cost alternative. Google Workspace is higher-trust but costs more.

## Required Proof

Copy `ops/domain-cart-proof.template.json` outside the public repo or into a temporary local file, fill the final cart values, then run:

```text
npm run launch:verify-cart -- --file /path/to/domain-cart-proof.json
```

The proof passes only when:

- the domain is available
- the registrar is Spaceship
- the first-year domain price is at or below the approved cap
- the renewal price is visible and acknowledged
- one domain is in the cart
- one mailbox is in the cart
- `security@{{chosen_domain}}`, `audit@{{chosen_domain}}`, and `hello@{{chosen_domain}}` are on the approved domain
- no paid hosting, paid SSL, site builder, paid privacy upsell, extra domains, or extra mailboxes are in the cart
- free included privacy is kept when available
- founder approval is captured

## Rehearsal

The sample proof is intentionally public-safe and proves the verifier shape:

```text
npm run launch:verify-cart
```

After the founder return packet exists, prove the returned domain and mailbox values still match the cart proof:

```text
npm run launch:verify-cart -- --file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt
```

## Stop Conditions

Stop before purchase if:

- the domain is premium-priced
- the first-year price exceeds the approved cap
- the renewal price is hidden
- the cart adds hosting, SSL, a site builder, paid privacy, extra domains, or extra mailboxes
- the mailbox cannot support `security@`, `audit@`, and `hello@`
- the founder has not acknowledged the renewal price
- the founder return packet names a different domain, mail provider, mailbox, or alias than the cart proof

## Sources

- Spaceship domain pricing: `https://www.spaceship.com/domains/`
- Spaceship promos: `https://www.spaceship.com/promos/`
- Spaceship business email: `https://www.spaceship.com/business-email/`
- Zoho Mail pricing: `https://www.zoho.com/mail/zohomail-pricing.html`
- Google Workspace pricing: `https://workspace.google.com/pricing`
