# Stripe Payment Link Verification

Use this after creating Stripe Payment Links and before applying links to the public landing page.

## Verify Directly

```text
npm run launch:verify-stripe -- --quick QUICK_PAYMENT_LINK --launch LAUNCH_PAYMENT_LINK --enterprise ENTERPRISE_PAYMENT_LINK
```

## Verify From An Approval Packet

```text
npm run launch:verify-stripe -- --file /path/to/stripe-approval.txt
```

## Optional HTTP Check

```text
npm run launch:verify-stripe -- --file /path/to/stripe-approval.txt --http
```

## What It Proves

- Each URL uses `https://buy.stripe.com/`.
- Each URL avoids obvious Stripe test-link markers.
- Optional HTTP mode checks that each link responds.

This does not prove Stripe product settings, taxes, receipts, custom fields, or redirect behavior. Those still require the Stripe QA checklist in `ops/stripe-payment-link-qa-console.html`.
