# MCPScan Final Founder Click Path

This is the single founder sequence for turning the prepared MCPScan launch system into first revenue. Each step either costs money, requires account authority, or requires same-turn approval.

Fastest working console: `ops/launch-approval-queue.html`.

GitHub Pages fallback console: `ops/static-launch-bundle-console.html`.

Cost and infrastructure decision: `docs/LAUNCH_COST_AND_INFRASTRUCTURE_PLAN_2026-08-14.md`.

Public trust checklist: `docs/PUBLIC_TRUST_CHECKLIST.md`.

After the external account clicks, use `ops/founder-return-packet.html` to paste the purchased domain, mailbox, aliases, and Stripe links into one approval message.

After that message is approved, Codex can run `npm run launch:apply-return-packet -- --file /path/to/approved-return-packet.txt`.

Optional status tracker: copy `ops/founder-approval-status.template.json` to `ops/founder-approval-status.json` after the founder clicks and fill only public-safe values. The filled tracker is ignored by git by default. Do not add passwords, API keys, mailbox credentials, Stripe secret keys, or customer data.

## Rule

Do not send external messages, start a live audit, publish packages, or accept sensitive customer materials until the matching approval gate below is complete.

First revenue does not require npm publishing. Sell and deliver the `$1,500` MCP Launch Audit first, then publish npm when the owner is logged in and ready for OTP prompts.

## Click Order

| Order | Gate | Founder Action | Console | Done When |
| --- | --- | --- | --- | --- |
| 0 | GitHub billing | Clear the account billing lock and re-run failed Actions jobs | `ops/github-actions-billing-console.html` | CI and Pages jobs start and pass |
| 1 | Domain | Buy `getmcpscan.com` if standard-priced, or `mcpscan.us` as the cheapest credible fallback after accepting `.us` tradeoffs | `ops/domain-email-dns-console.html` | Domain exists in registrar account |
| 2 | Mailbox | Create `audit@{{chosen_domain}}` with `security@` and `hello@` aliases | `ops/domain-email-dns-console.html` | MX, SPF, DKIM, and DMARC pass |
| 3 | Stripe | Create the three Payment Links and verify their format | `ops/stripe-click-setup.html` | Quick, Launch, and Enterprise checkout links exist and `npm run launch:verify-stripe` passes |
| 4 | Apply links | Paste real links into the command builder | `ops/approved-links-command-builder.html` | Landing page no longer uses placeholder checkout links |
| 5 | Verify | Run launch verification | `ops/verification-console.html` | `npm run launch:verify -- --domain {{chosen_domain}}` has no domain or checkout warnings |
| 6 | npm | Optional: publish packages if desired | `ops/npm-publish-console.html` | npm shows version `0.1.0` for both packages |
| 7 | Outbound | Refresh market sources, then approve exact recipients and exact final messages | `ops/outbound-recipient-approval-builder.html` | Approved messages are staged outside the public repo before any send |
| 8 | Paid handoff | Use post-payment handoff after Stripe payment | `ops/post-payment-console.html` | Private workspace exists outside public repo |
| 9 | Delivery | Deliver report and buyer summary from private workspace | `ops/delivery-console.html` | Report is delivered without customer secrets in public repo |

## Current Known Blocker

GitHub Actions is not starting CI or Pages jobs because GitHub reports an account billing lock. This does not mean the repo checks failed. It means GitHub refused to start the jobs.

If Pages stays stale after a launch update, build the static launch bundle and upload `dist/mcpscan-static-launch/` to a static host.

```text
npm run landing:sample-report
npm run launch:bundle
```

After DNS records exist, verify the custom domain and mailbox records:

```text
npm run launch:verify-dns -- --domain {{chosen_domain}}
```

After Stripe links exist, verify them before applying public links:

```text
npm run launch:verify-stripe -- --file /path/to/approved-return-packet.txt
```

After founder clicks exist, track public-safe approval status:

```text
cp ops/founder-approval-status.template.json ops/founder-approval-status.json
npm run launch:status
```

Before outbound, refresh the market source proof:

```text
npm run market:verify
```

After exact recipient and message approval, stage the send packet outside the public repo:

```text
npm run outbound:stage-approved -- --file /path/to/approved-outbound.txt
```

## Current Local Proof Until Billing Is Fixed

Fresh remote snapshot verification passes with:

```text
npm run writing:check
npm run launch:verify
npm run clean
npm run build
npm run typecheck
npm test
npm audit --omit=dev
npm pack --dry-run -w @mcpscan/shared
npm pack --dry-run -w mcpscan
```

## First Revenue Target

Default sale: MCP Launch Audit at `$1,500`.

Best buyer: a team enabling Copilot, Claude Code, Cursor, VS Code agent mode, Slack MCP, Atlassian Rovo, or a custom MCP server that touches code, tickets, docs, data, cloud, CI/CD, or customer records.

Do not wait for npm to sell this. The paid audit deliverable, report template, buyer summary, delivery dry run, outbound packet, and post-payment handoff are already the revenue path.

Spend ceiling before first revenue: about `$19` to `$31` for domain plus one mailbox. Do not add paid dashboard infrastructure before the first paid audit.

## Stop Conditions

- Do not use the new mailbox for outbound until MX, SPF, DKIM, and DMARC pass.
- Do not send outbound without exact recipient and exact content approval in the same turn.
- Do not start paid delivery until payment and safe intake are confirmed.
- Do not place customer secrets, private configs, customer data, or final reports in the public repo.
- Do not publish npm until npm login and 2FA are confirmed.
