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

Prebuild the cheap-lane DNS and Stripe packets:

```text
npm run launch:prepare-cheap
```

That creates the founder-ready packet set:

```text
ops/generated-launch-packets/2026-08-14_mcpscan-site_dns-packet.md
ops/generated-launch-packets/2026-08-14_mcpscan-site_dns-records.csv
ops/generated-launch-packets/2026-08-14_mcpscan-site_stripe-setup-packet.md
ops/generated-launch-packets/2026-08-14_mcpscan-site_stripe-products.csv
```

## Sequence

1. Clear the GitHub billing lock.
2. Choose the domain lane and approve one domain plus one mailbox. For the current low-cash sprint, search `mcpscan.site` first, `getmcpscan.xyz` second, and `trymcpscan.com` only if the trust bump is worth the extra spend.
3. Buy one domain and one Spacemail mailbox.
4. Use the generated DNS packet and DNS records CSV.
5. Use the generated Stripe setup packet and Stripe products CSV.
6. Create three live Stripe Payment Links.
7. Use the Stripe QA console to generate the evidence JSON and exact return approval.
8. Give the approved return packet to Codex.
9. Codex applies public links and runs verification. Commit and push happen after verification and separate explicit approval.
10. Approve exact outbound recipients and exact final messages.
11. After payment, run the paid audit handoff and deliver from a private workspace.

## Current Next Click Script

```text
1. Run npm run launch:open-founder.
2. Open the GitHub billing guide and clear the account lock.
3. Open the near-dollar Spaceship search for mcpscan.site.
4. If the cart is near $1 and renewal is acceptable, buy one domain only.
5. If the cart jumps or the renewal feels too high, search getmcpscan.xyz.
6. Create one Spacemail mailbox: security@chosen-domain.
7. Add aliases: audit@chosen-domain and hello@chosen-domain.
8. Paste the bought domain and mailbox values into ops/founder-return-packet.html after Stripe links exist.
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
- Stage approved outbound without sending.
- Create paid audit handoff after payment.

Canonical post-click verification command:

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true
```

## Stop Conditions

- Do not buy extra domains or mailboxes without separate approval.
- Do not use the mailbox for outbound until MX, SPF, DKIM, and DMARC pass.
- Do not apply Stripe links until exact live URLs and checkout QA evidence are approved.
- Do not send outbound without exact recipient and exact final content approval in the same turn.
- Do not store customer evidence, configs, credentials, or reports in the public repo.
