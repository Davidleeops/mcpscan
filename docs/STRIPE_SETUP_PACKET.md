# Stripe Setup Packet

Generated: 2026-08-14

Use this after the domain and mailbox lane are chosen and before creating live Stripe Payment Links.

## Command

```text
npm run launch:stripe-packet -- --domain {{chosen_domain}} --mailbox security@{{chosen_domain}}
```

Until the custom domain is purchased, generate a GitHub Pages packet:

```text
npm run launch:stripe-packet
```

## What It Creates

The packet contains:

- exact product names
- exact one-time prices
- exact product descriptions
- shared checkout fields
- redirect and policy URLs
- evidence to capture before approval
- exact founder approval text for the final live Stripe URLs

## Stripe Products

Create exactly three one-time live-mode Payment Links:

| Product | Price | Role |
| --- | ---: | --- |
| MCP Quick Audit | `$750` | Entry package |
| MCP Launch Audit | `$1,500` | Default first-revenue package |
| MCP Enterprise Readiness Audit | `$3,500` | Enterprise package |

## Stop Conditions

- Do not create subscriptions.
- Do not create coupons or discounts without separate approval.
- Do not publish test-mode Payment Links.
- Do not apply checkout links to the public landing page until the exact live URLs are approved.
- Do not store Stripe secret keys in the repo.
