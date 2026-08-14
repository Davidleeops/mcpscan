# Founder Return Values Checklist

Use this immediately after the founder account clicks. The goal is to give Codex only the safe public values needed to update the launch, verify the setup, and keep outbound paused until approval.

## Return Only These Values

| Gate | Value To Return | Example |
| --- | --- | --- |
| Domain | Purchased domain | `mcpscan.site` |
| Mailbox | Primary public mailbox | `security@mcpscan.site` |
| Alias | Audit alias | `audit@mcpscan.site` |
| Alias | General alias | `hello@mcpscan.site` |
| Stripe | Quick Audit Payment Link | `https://buy.stripe.com/...` |
| Stripe | Launch Audit Payment Link | `https://buy.stripe.com/...` |
| Stripe | Enterprise Readiness Payment Link | `https://buy.stripe.com/...` |
| Stripe QA | Checkout evidence JSON from the QA console | `stripe-checkout-qa-evidence.json` |
| DNS | Optional DKIM selector if Spacemail shows one | `default` or provider-specific selector |

## Do Not Return These Values

- Domain registrar password.
- Mailbox password.
- Stripe secret key.
- Stripe dashboard session link.
- Credit card details.
- Recovery codes.
- Customer configs.
- Customer data.
- Production secrets.
- Private audit reports.

## Exact Return Flow

1. Open `ops/founder-return-packet.html`.
2. Paste the purchased domain, mailbox, aliases, and three live Stripe Payment Links.
3. Build the approval message.
4. Open `ops/stripe-payment-link-qa-console.html`.
5. Build and download the Stripe QA evidence JSON.
6. Send Codex the approval message and the QA evidence file path.
7. If DNS has propagated, include the DKIM selector if Spacemail shows one.

## Codex Runs After Approval

```text
npm run launch:open-return-review
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true
```

If Spacemail provides a DKIM selector:

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true --dkim-selector {{dkim_selector}}
```

## Acceptance Proof

The return packet is usable when:

- `npm run launch:apply-return-packet -- --file /path/to/approved-return-packet.txt --dry-run true` passes.
- `npm run launch:verify-stripe -- --file /path/to/approved-return-packet.txt --update-status` passes.
- `npm run launch:verify-return-qa -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json` passes.
- `npm run launch:verify-stripe-qa -- --file /path/to/stripe-checkout-qa-evidence.json --update-status` passes.
- `npm run launch:verify-dns -- --domain {{chosen_domain}} --update-status` passes after DNS propagation.
- `npm run launch:verify` has no checkout, custom-domain, or security-contact warnings after apply and deploy.

## Stop Conditions

- Stop if any Stripe URL is not a live `https://buy.stripe.com/` link.
- Stop if the three Stripe links are not unique.
- Stop if the mailbox or aliases are not on the purchased domain.
- Stop if DNS values are not visible in the registrar or Spacemail account.
- Stop if the return packet contains passwords, secret keys, credit card details, or customer material.
