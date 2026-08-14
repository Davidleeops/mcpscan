# MCPScan Final Founder Click Path

This is the single founder sequence for turning the prepared MCPScan launch system into first revenue. Each step either costs money, requires account authority, or requires same-turn approval.

Fastest working console: `ops/launch-approval-queue.html`.

After the external account clicks, use `ops/founder-return-packet.html` to paste the purchased domain, mailbox, aliases, and Stripe links into one approval message.

## Rule

Do not send external messages, start a live audit, publish packages, or accept sensitive customer materials until the matching approval gate below is complete.

## Click Order

| Order | Gate | Founder Action | Console | Done When |
| --- | --- | --- | --- | --- |
| 0 | GitHub billing | Clear the account billing lock and re-run failed Actions jobs | `ops/github-actions-billing-console.html` | CI and Pages jobs start and pass |
| 1 | Domain | Buy `getmcpscan.com` if standard-priced, or `mcpscan.us` as the cheapest credible fallback | `ops/domain-email-dns-console.html` | Domain exists in registrar account |
| 2 | Mailbox | Create `audit@{{chosen_domain}}` with `security@` and `hello@` aliases | `ops/domain-email-dns-console.html` | MX, SPF, DKIM, and DMARC pass |
| 3 | Stripe | Create the three Payment Links | `ops/stripe-click-setup.html` | Quick, Launch, and Enterprise checkout links exist |
| 4 | Apply links | Paste real links into the command builder | `ops/approved-links-command-builder.html` | Landing page no longer uses placeholder checkout links |
| 5 | Verify | Run launch verification | `ops/verification-console.html` | `npm run launch:verify -- --domain {{chosen_domain}}` has no domain or checkout warnings |
| 6 | npm | Publish packages if desired | `ops/npm-publish-console.html` | npm shows version `0.1.0` for both packages |
| 7 | Outbound | Approve exact recipients and exact final messages | `ops/outbound-approval-console.html` | Messages are approved in the same turn before send |
| 8 | Paid handoff | Use post-payment handoff after Stripe payment | `ops/post-payment-console.html` | Private workspace exists outside public repo |
| 9 | Delivery | Deliver report and buyer summary from private workspace | `ops/delivery-console.html` | Report is delivered without customer secrets in public repo |

## Current Known Blocker

GitHub Actions is not starting CI or Pages jobs because GitHub reports an account billing lock. This does not mean the repo checks failed. It means GitHub refused to start the jobs.

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

## Stop Conditions

- Do not use the new mailbox for outbound until MX, SPF, DKIM, and DMARC pass.
- Do not send outbound without exact recipient and exact content approval in the same turn.
- Do not start paid delivery until payment and safe intake are confirmed.
- Do not place customer secrets, private configs, customer data, or final reports in the public repo.
- Do not publish npm until npm login and 2FA are confirmed.
