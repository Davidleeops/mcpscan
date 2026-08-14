# MCPScan Post-Purchase Public Proof Packet

Date: August 14, 2026

Use this after the founder buys the domain, creates the mailbox, and creates Stripe Payment Links. The goal is to return only public launch values, never account secrets.

## Return These Public Values

| Gate | Public Value | Cheap Lane Example |
| --- | --- | --- |
| Domain | Purchased domain | `mcpscan.online` |
| Mailbox | Public mailbox | `security@mcpscan.online` |
| Alias | Audit alias | `audit@mcpscan.online` |
| Alias | General alias | `hello@mcpscan.online` |
| Mail | Provider name | `zoho` |
| DNS | DKIM selector if visible | provider-specific selector only |
| Stripe | Quick Audit Payment Link | `https://buy.stripe.com/...` |
| Stripe | Launch Audit Payment Link | `https://buy.stripe.com/...` |
| Stripe | Enterprise Readiness Payment Link | `https://buy.stripe.com/...` |
| Stripe QA | QA evidence file path | `stripe-checkout-qa-evidence.json` |

## Do Not Return These Values

- Registrar password.
- Mailbox password.
- Stripe secret key.
- Stripe dashboard session link.
- Credit card details.
- Recovery codes.
- API keys.
- Customer configs.
- Customer data.
- Private audit evidence.

## One-Screen Return Flow

1. Open `ops/founder-return-packet.html`.
2. Click `Load cheap lane` for `mcpscan.online` or `Load trust lane` for `getmcpscan.com`.
3. Paste the three live Stripe Payment Links.
4. Build and download the approval message.
5. Open `ops/stripe-payment-link-qa-console.html`.
6. Use the same preset, paste the same links, complete the live Stripe checklist, and download `stripe-checkout-qa-evidence.json`.
7. Open `ops/founder-status-console.html`.
8. Use the same preset, mark only the gates that are true, then download `founder-approval-status.json`.
9. Send Codex the approval message, the Stripe QA evidence path, and the public-safe status JSON.
10. Codex runs `npm run launch:post-click-bundle` to create a private handoff bundle before applying public links.

## Codex Apply Command

```text
npm run launch:verify-cart -- --file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt
npm run launch:post-click-bundle -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --mail-provider {{zoho_or_google_or_spacemail}}
npm run launch:simulate-post-click-bundle
npm run launch:verify-status -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --cart-file /path/to/domain-cart-proof.json --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true
npm run launch:publish-pages-fallback -- --wait true
npm run launch:verify -- --domain {{chosen_domain}}
npm run launch:full-proof -- --live true --status-file /path/to/founder-approval-status.json --cart-file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --mail-provider {{zoho_or_google_or_spacemail}}
npm run outbound:send-gates -- --status-file /path/to/founder-approval-status.json --cart-file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json
npm run launch:status:live
npm run launch:open-first-revenue
```

Use `--dkim-selector {{selector}}` only when the provider shows a DKIM selector.

## Acceptance Proof

The post-purchase handoff is ready when:

- `npm run launch:verify-return-packet` passes for the saved return packet shape.
- `npm run launch:verify-cart -- --file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt` passes for the final Spaceship cart if the cheap lane was used.
- `npm run launch:post-click-bundle -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --mail-provider {{zoho_or_google_or_spacemail}}` writes a private bundle outside the public repo.
- `npm run launch:simulate-post-click-bundle` proves the bundle path with temporary QA evidence.
- `npm run launch:verify-status -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json` proves the status tracker matches the approved return packet and Stripe QA evidence.
- `npm run launch:verify-stripe -- --file /path/to/approved-return-packet.txt --update-status` passes.
- `npm run launch:verify-return-qa -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json` passes.
- `npm run launch:verify-stripe-qa -- --file /path/to/stripe-checkout-qa-evidence.json --update-status` passes.
- `npm run launch:verify-dns -- --domain {{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}} --update-status` passes after DNS propagation.
- `npm run launch:verify -- --domain {{chosen_domain}}` has no checkout, custom-domain, or security-contact warnings after apply and publish.
- `npm run launch:full-proof -- --live true --status-file /path/to/founder-approval-status.json --cart-file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --mail-provider {{zoho_or_google_or_spacemail}}` passes before first outbound approval review.
- `npm run outbound:send-gates -- --status-file /path/to/founder-approval-status.json --cart-file /path/to/domain-cart-proof.json --return-file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json` passes before any first-send batch.
