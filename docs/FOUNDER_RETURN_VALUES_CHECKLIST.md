# Founder Return Values Checklist

Use this immediately after the founder account clicks. The goal is to give Codex only the safe public values needed to update the launch, verify the setup, and keep outbound paused until approval.

## Return Only These Values

| Gate | Value To Return | Example |
| --- | --- | --- |
| Domain | Purchased domain | `getmcpscan.xyz` or `getmcpscan.com` |
| Mailbox | Primary public mailbox | `security@getmcpscan.xyz` or `security@getmcpscan.com` |
| Alias | Audit alias | `audit@getmcpscan.xyz` or `audit@getmcpscan.com` |
| Alias | General alias | `hello@getmcpscan.xyz` or `hello@getmcpscan.com` |
| Stripe | Quick Audit Payment Link | `https://buy.stripe.com/...` |
| Stripe | Launch Audit Payment Link | `https://buy.stripe.com/...` |
| Stripe | Enterprise Readiness Payment Link | `https://buy.stripe.com/...` |
| Stripe QA | Checkout evidence JSON from the QA console | `stripe-checkout-qa-evidence.json` |
| DNS | Mail provider and optional DKIM selector if the provider shows one | `zoho` and provider-specific selector |

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
2. Use the cheap-lane preset for `getmcpscan.xyz` with `security@getmcpscan.xyz`, or the trust-lane preset for `getmcpscan.com` with `security@getmcpscan.com`.
3. Paste the purchased domain, mailbox, aliases, and three live Stripe Payment Links.
4. Build the approval message.
5. Open `ops/stripe-payment-link-qa-console.html`.
6. Use the same preset and the same Stripe links.
7. Build and download the Stripe QA evidence JSON.
8. Copy the one-paste post-click handoff packet from `ops/founder-return-packet.html`.
9. Send Codex the approval message, the QA evidence file path, and the handoff packet.
10. Confirm the handoff packet includes the chosen mail provider. If DNS has propagated, also include the DKIM selector if the mailbox provider shows one.

## Codex Runs After Approval

```text
npm run launch:open-return-review
npm run launch:verify-cart -- --file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt
npm run launch:post-click-bundle -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --mail-provider {{zoho_or_google_or_spacemail}}
npm run launch:simulate-post-click-bundle
npm run launch:verify-status -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --cart-file /path/to/domain-cart-proof.json --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true
npm run launch:verify-live -- --status-file ops/founder-approval-status.json --cart-file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json
npm run launch:publish-pages-fallback -- --wait true
npm run launch:verify -- --domain {{chosen_domain}}
npm run launch:status:live
npm run launch:open-first-revenue
```

If the mailbox provider provides a DKIM selector:

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true --dkim-selector {{dkim_selector}}
```

## Acceptance Proof

The return packet is usable when:

- `npm run launch:apply-return-packet -- --file /path/to/approved-return-packet.txt --dry-run true` passes.
- `npm run launch:verify-cart -- --file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt` passes for the final Spaceship cart if the cheap lane was used.
- `npm run launch:post-click-bundle -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --mail-provider {{zoho_or_google_or_spacemail}}` writes a private bundle outside the public repo.
- `npm run launch:verify-status -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json` proves the status tracker matches the approved return packet and Stripe QA evidence.
- `npm run launch:verify-stripe -- --file /path/to/approved-return-packet.txt --update-status` passes.
- `npm run launch:verify-return-qa -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json` passes.
- `npm run launch:verify-stripe-qa -- --file /path/to/stripe-checkout-qa-evidence.json --update-status` passes.
- The post-click command reads `Mail provider` from the approved return packet.
- `npm run launch:verify-dns -- --domain {{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}} --update-status` passes after DNS propagation.
- `npm run launch:verify-live -- --status-file ops/founder-approval-status.json --cart-file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json` passes before treating the launch as live for first revenue.
- `npm run launch:verify` has no checkout, custom-domain, or security-contact warnings after apply and deploy.
- `npm run launch:open-first-revenue` opens the public, outbound, reply, payment, and delivery approval path after live gates are clear.

## Stop Conditions

- Stop if any Stripe URL is not a live `https://buy.stripe.com/` link.
- Stop if the three Stripe links are not unique.
- Stop if the mailbox or aliases are not on the purchased domain.
- Stop if DNS values are not visible in the registrar or Spacemail account.
- Stop if the return packet contains passwords, secret keys, credit card details, or customer material.
