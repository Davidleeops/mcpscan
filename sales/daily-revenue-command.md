# MCPScan Daily Revenue Command

Generated: 2026-08-14

Use this as the one-screen operating surface for first revenue.

## Today Status

| Lane | Current State | Next Action | Owner |
| --- | --- | --- | --- |
| Domain | Not purchased | Buy `trymcpscan.com` for the trust lane, or `mcpscan.site` only for the cheap validation lane | Founder |
| Mailbox | Not purchased | Create `security@{{chosen_domain}}` plus `audit@` and `hello@` aliases | Founder |
| Stripe | Payment Links not live | Create three live one-time Payment Links | Founder |
| Landing page | Live with placeholder issue CTAs | Apply approved domain, email, and Stripe links after return packet | Codex |
| GitHub Actions | Account billing lock | Clear billing lock and re-run failed workflows | Founder |
| npm | Ready for auth gate | Authenticate npm, then publish if desired | Founder and Codex |
| Outbound | Exact recipients still need approval | Approve exact recipient and exact final message before any send | Founder |
| Delivery | Templates and dry run exist | Use private workspace after payment | Codex |

## Daily Sequence

1. Check live launch status.
2. Clear any account gates that only the founder can click.
3. Refresh market proof before outbound.
4. Pick 10 recipient candidates.
5. Generate exact messages.
6. Ask for same-turn approval.
7. Stage approved messages outside the public repo.
8. Send manually from authenticated mailbox only after SPF, DKIM, and DMARC pass.
9. Log single manual sends with `npm run outbound:log-send`, or first-10 route batches with `npm run outbound:log-route-batch`.
10. Log replies and use `sales/reply-to-close-packet.md`.
11. Stage approved replies with `npm run outbound:stage-reply`.
12. When payment clears, create the private delivery workspace.

## Command Set

```text
npm run launch:status:live
npm run market:verify
npm run outbound:verify
npm run launch:verify
npm run revenue:snapshot
npm run gtm:verify
```

Before any manual send:

```text
npm run outbound:send-gates
```

After domain and mailbox exist:

```text
npm run launch:verify-dns -- --domain {{chosen_domain}} --update-status
```

After Stripe links exist:

```text
npm run launch:verify-stripe -- --file /path/to/approved-return-packet.txt --update-status
```

After first outbound approval exists:

```text
npm run outbound:stage-approved -- --file /path/to/approved-outbound.txt
npm run outbound:stage-route-packet -- --file /path/to/approved-first-10-route-packet.txt
```

After public launch post approval exists:

```text
npm run launch:stage-public-post -- --file /path/to/approved-public-launch-post.txt
```

After manual send:

```text
npm run outbound:log-send -- --manifest /path/outside/public/repo/manifest.json
```

After a manually sent first-10 route batch:

```text
npm run outbound:log-route-batch -- --batch /path/outside/public/repo/YYYY-MM-DD_first-10-route-approvals
```

When a follow-up is due:

```text
npm run outbound:compose-follow-up -- --file /path/outside/public/repo/send-log.json --step follow-up-1
```

To generate an exact approval packet before staging:

```text
npm run outbound:compose-final -- --account Vapi --recipient "{{name}}" --title "{{title}}" --contact "{{contact_or_profile_url}}" --channel Email --sender "{{sender_name}}"
```

To generate first-10 packets for official contact routes instead of named people:

```text
npm run outbound:compose-contact-routes -- --routes sales/first-10-contact-routes-2026-08-14.csv --sender "{{sender_name}}"
```

To build the repo-tracked founder approval packet:

```text
npm run outbound:route-packet -- --sender "{{sender_name}}"
```

After first payment:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt
```

This creates the private workspace, first paid audit work order, handoff manifest, and private pipeline status files outside the public repo.

Then draft the intake email from the private pipeline status JSON:

```text
npm run delivery:intake-message -- --file /path/outside/public/repo/pipeline-status/YYYY-MM-DD_customer_package_pipeline-status.json
```

Fallback separate commands:

```text
npm run delivery:work-order -- --customer "{{customer_company}}" --package "{{package_name}}" --contact "{{technical_contact}}" --payment "{{stripe_reference}}"
npm run delivery:workspace -- --customer "{{customer_company}}"
```

## Approval Needed Today

Copy this into the founder approval request after exact values are known:

```text
Please approve or revise this MCPScan revenue action.

Gate:
Exact account action:
Exact recipient or URL:
Exact final message or values:
Approved outcome:
```

## Close More Quickly

- Lead with the `$1,500` MCP Launch Audit.
- Offer the `$750` MCP Quick Audit as the lower-friction fallback.
- Do not discuss SaaS subscriptions until a buyer asks for ongoing monitoring.
- Do not imply a vulnerability without authorized testing.
- Keep every reply pointed at scope, checkout, or safe intake.
- Do not send replies until the exact final reply is approved and staged.
