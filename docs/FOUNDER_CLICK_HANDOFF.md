# Founder Click Handoff

Generated: 2026-08-14

Use this as the shortest live path from prepared repo to first paid audit.

## Console

```text
ops/founder-click-handoff.html
```

## Sequence

1. Clear the GitHub billing lock.
2. Choose the domain lane and approve one domain plus one mailbox.
3. Buy one domain and one Spacemail mailbox.
4. Generate and approve the DNS packet.
5. Generate the Stripe setup packet.
6. Create three live Stripe Payment Links.
7. Use the Stripe QA console to generate the evidence JSON and exact return approval.
8. Give the approved return packet to Codex.
9. Codex applies public links, runs verification, commits, and pushes.
10. Approve exact outbound recipients and exact final messages.
11. After payment, run the paid audit handoff and deliver from a private workspace.

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

## Stop Conditions

- Do not buy extra domains or mailboxes without separate approval.
- Do not use the mailbox for outbound until MX, SPF, DKIM, and DMARC pass.
- Do not apply Stripe links until exact live URLs and checkout QA evidence are approved.
- Do not send outbound without exact recipient and exact final content approval in the same turn.
- Do not store customer evidence, configs, credentials, or reports in the public repo.
