# MCPScan Post-Purchase Public Proof Packet

Date: August 14, 2026

Use this after the founder buys the domain, creates the mailbox, and creates Stripe Payment Links. The goal is to return only public launch values, never account secrets.

## Return These Public Values

| Gate | Public Value | Cheap Lane Example |
| --- | --- | --- |
| Domain | Purchased domain | `getmcpscan.xyz` or `getmcpscan.com` |
| Mailbox | Public mailbox | `security@getmcpscan.xyz` or `security@getmcpscan.com` |
| Alias | Audit alias | `audit@getmcpscan.xyz` or `audit@getmcpscan.com` |
| Alias | General alias | `hello@getmcpscan.xyz` or `hello@getmcpscan.com` |
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
2. Click `Load cheap lane` for `getmcpscan.xyz`, or click `Load trust lane` for `getmcpscan.com`.
3. Paste the three live Stripe Payment Links.
4. Build and download the approval message.
5. Open `ops/stripe-payment-link-qa-console.html`.
6. Use the same preset, paste the same links, complete the live Stripe checklist, and download `stripe-checkout-qa-evidence.json`.
7. Open `ops/founder-status-console.html`.
8. Use the same preset, mark only the gates that are true, then download `founder-approval-status.json`.
9. Send Codex the approval message, the Stripe QA evidence path, and the public-safe status JSON.
10. Codex runs `npm run launch:post-click-session` to create a private handoff bundle, apply approved values, publish the fallback, and run proof.

## Codex Apply Command

```text
npm run launch:verify-cart -- --file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --return-file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt"
npm run launch:post-click-session -- --file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json" --apply true --publish true --mail-provider {{zoho_or_google_or_spacemail}}
npm run launch:simulate-post-click-bundle
npm run launch:simulate-post-click-session
npm run outbound:send-gates -- --status-file ops/founder-approval-status.json --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --return-file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json"
npm run launch:status:live
npm run launch:open-first-revenue
```

Use `--dkim-selector {{selector}}` only when the provider shows a DKIM selector.

## Acceptance Proof

The post-purchase handoff is ready when:

- `npm run launch:verify-return-packet` passes for the saved return packet shape.
- `npm run launch:verify-cart -- --file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --return-file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt"` passes for the final Spaceship cart if the cheap lane was used.
- `npm run launch:post-click-session -- --file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json" --apply true --publish true --mail-provider {{zoho_or_google_or_spacemail}}` writes a private bundle outside the public repo, applies approved values, publishes fallback, and runs proof.
- `npm run launch:simulate-post-click-session` proves the one-command post-click path with temporary QA and cart evidence.
- `npm run launch:verify-status -- --file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json"` proves the status tracker matches the approved return packet and Stripe QA evidence.
- `npm run launch:verify-stripe -- --file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --update-status` passes.
- `npm run launch:verify-return-qa -- --file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json"` passes.
- `npm run launch:verify-stripe-qa -- --file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json" --update-status` passes.
- `npm run launch:verify-dns -- --domain {{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}} --update-status` passes after DNS propagation.
- `npm run launch:verify-live -- --status-file ops/founder-approval-status.json --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --return-file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json"` passes before treating the launch as live for first revenue.
- `npm run launch:verify -- --domain {{chosen_domain}}` has no checkout, custom-domain, or security-contact warnings after apply and publish.
- `npm run launch:full-proof -- --live true --status-file ops/founder-approval-status.json --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --return-file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json" --mail-provider {{zoho_or_google_or_spacemail}}` passes before first outbound approval review.
- `npm run outbound:send-gates -- --status-file ops/founder-approval-status.json --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --return-file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json"` passes before any first-send batch.
