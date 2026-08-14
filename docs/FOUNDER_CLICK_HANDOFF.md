# Founder Click Handoff

Generated: 2026-08-14

Use this as the shortest live path from prepared repo to first paid audit.

## Console

```text
ops/founder-click-handoff.html
```

One-command launcher:

```text
npm run launch:open-founder
```

Prepare the private founder evidence workspace before buying anything:

```text
npm run launch:prepare-founder-clicks -- --domain getmcpscan.xyz --mail-provider spacemail
```

Then open the generated click session sheet:

```text
$HOME/MCPScan Founder Clicks/current/CLICK_SESSION.md
```

That sheet is the live founder-account checklist. It includes the account links, chosen domain, mailbox aliases, local files to fill, verification commands, and stop conditions.

Prebuild the cheap-lane DNS and Stripe packets:

```text
npm run launch:prepare-cheap
```

That creates the founder-ready packet set:

```text
ops/cheap-launch-packet-console.html
ops/generated-launch-packets/2026-08-14_getmcpscan-xyz_dns-packet.md
ops/generated-launch-packets/2026-08-14_getmcpscan-xyz_dns-records.csv
ops/generated-launch-packets/2026-08-14_getmcpscan-xyz_stripe-setup-packet.md
ops/generated-launch-packets/2026-08-14_getmcpscan-xyz_stripe-products.csv
```

## Sequence

1. Prepare the private founder evidence workspace and open `CLICK_SESSION.md`.
2. Search `getmcpscan.xyz` in Spaceship.
3. Buy one domain only if the cart is at or below `$3`, renewal is visible, and no paid add-ons appear.
4. Create one Spacemail mailbox: `security@getmcpscan.xyz`, with `audit@getmcpscan.xyz` and `hello@getmcpscan.xyz` aliases.
5. Use the generated DNS packet and DNS records CSV.
6. Use the generated Stripe setup packet and Stripe products CSV.
7. Create three live Stripe Payment Links.
8. Use the Stripe QA console to download the evidence JSON.
9. Use the founder return packet to download the exact approval message.
10. Give the approved return packet and QA evidence JSON to Codex.
11. Codex applies public links and runs verification. Commit and push happen after verification and separate explicit approval.
12. Open the first-revenue runway with `npm run launch:open-first-revenue`.
13. Approve exact outbound recipients and exact final messages.
14. After payment, run the paid audit handoff and deliver from a private workspace.

## Current Next Click Script

```text
1. Run npm run launch:open-founder.
2. Run npm run launch:prepare-founder-clicks -- --domain getmcpscan.xyz --mail-provider spacemail.
3. Open $HOME/MCPScan Founder Clicks/current/CLICK_SESSION.md.
4. Follow that sheet through domain, mailbox, DNS, Stripe, return packet, status tracker, and verification.
5. Download the approval message from ops/founder-return-packet.html after Stripe links exist.
6. Download the QA evidence JSON from ops/stripe-payment-link-qa-console.html after the checklist passes.
```

## Founder-Only Clicks

- GitHub billing unlock.
- Domain purchase.
- Mailbox purchase.
- DNS record entry when registrar access is not connected.
- Stripe Payment Link creation.
- Same-turn approval for final public links.
- Same-turn approval for outbound recipients and final message text.

## Codex-Owned Work

- Generate domain purchase packet.
- Generate DNS packet.
- Generate Stripe setup packet.
- Verify Stripe URL format.
- Verify Stripe checkout QA evidence.
- Apply approved public links.
- Verify launch state.
- Open the first-revenue runway after live gates clear.
- Stage approved outbound without sending.
- Create paid audit handoff after payment.

Canonical post-click verification command:

```text
npm run launch:post-click-verify -- --file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json" --apply true --mail-provider spacemail
```

## Stop Conditions

- Do not buy extra domains or mailboxes without separate approval.
- Do not use the mailbox for outbound until MX, SPF, DKIM, and DMARC pass.
- Do not apply Stripe links until exact live URLs and checkout QA evidence are approved.
- Do not send outbound without exact recipient and exact final content approval in the same turn.
- Do not store customer evidence, configs, credentials, or reports in the public repo.
