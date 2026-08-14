# MCPScan Daily Revenue Command

Generated: 2026-08-14

Use this as the one-screen operating surface for first revenue.

## Today Status

| Lane | Current State | Next Action | Owner |
| --- | --- | --- | --- |
| Domain | Not purchased | Buy `getmcpscan.com` if standard-priced, or `mcpscan.us` after accepting `.us` tradeoffs | Founder |
| Mailbox | Not purchased | Create `audit@{{chosen_domain}}` plus `security@` and `hello@` aliases | Founder |
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
9. Log replies and use `sales/reply-to-close-packet.md`.
10. When payment clears, create the private delivery workspace.

## Command Set

```text
npm run launch:status:live
npm run market:verify
npm run outbound:verify
npm run launch:verify
```

After domain and mailbox exist:

```text
npm run launch:verify-dns -- --domain {{chosen_domain}}
```

After Stripe links exist:

```text
npm run launch:verify-stripe -- --file /path/to/approved-return-packet.txt
```

After first outbound approval exists:

```text
npm run outbound:stage-approved -- --file /path/to/approved-outbound.txt
```

To generate an exact approval packet before staging:

```text
npm run outbound:compose-final -- --account Vapi --recipient "{{name}}" --title "{{title}}" --contact "{{contact_or_profile_url}}" --channel Email --sender "{{sender_name}}"
```

After first payment:

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
