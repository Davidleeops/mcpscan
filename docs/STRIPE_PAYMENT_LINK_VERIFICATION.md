# Stripe Payment Link Verification

Use this after creating Stripe Payment Links and before applying links to the public landing page.

Generate the setup packet first so product settings are not copied from scattered docs:

```text
npm run launch:stripe-packet -- --domain {{chosen_domain}} --mailbox security@{{chosen_domain}}
```

## Verify Directly

```text
npm run launch:verify-stripe -- --quick QUICK_PAYMENT_LINK --launch LAUNCH_PAYMENT_LINK --enterprise ENTERPRISE_PAYMENT_LINK --update-status
```

This verifies URL format only and updates `stripeLinkFormatVerified`.

## Verify From An Approval Packet

```text
npm run launch:verify-stripe -- --file /path/to/stripe-approval.txt --update-status
```

## Optional HTTP Check

```text
npm run launch:verify-stripe -- --file /path/to/stripe-approval.txt --http --update-status
```

## What It Proves

- Each URL uses `https://buy.stripe.com/`.
- Each URL avoids obvious Stripe test-link markers.
- Optional HTTP mode checks that each link responds.

## Checkout QA Evidence

Use `ops/stripe-payment-link-qa-console.html` to generate the QA evidence JSON and founder approval prompt from the exact live Stripe links. As a fallback, copy `sales/stripe-checkout-qa-evidence.template.json` outside the repo and fill the final values from Stripe dashboard evidence.

Then run:

```text
npm run launch:verify-stripe-qa -- --file /path/to/stripe-checkout-qa-evidence.json --update-status
```

That verifies product names, prices, live mode, unique checkout URLs, one-time payment type, same-account evidence, no subscription/trial settings, no quantity adjustment, no promotion codes, no shipping collection, receipts, required fields, redirects, policy URLs, and evidence confirmations. It updates `stripeCheckoutQaConfirmed`.

`stripeLinksVerified` is true only when both URL format and checkout QA are verified.
