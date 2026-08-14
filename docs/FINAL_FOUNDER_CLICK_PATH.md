# MCPScan Final Founder Click Path

This is the single founder sequence for turning the prepared MCPScan launch system into first revenue. Each step either costs money, requires account authority, or requires same-turn approval.

Fastest working console: `ops/launch-approval-queue.html`.

Single handoff console: `ops/founder-click-handoff.html`.

GitHub Pages fallback console: `ops/static-launch-bundle-console.html`.

Cost and infrastructure decision: `docs/LAUNCH_COST_AND_INFRASTRUCTURE_PLAN_2026-08-14.md`.

Public trust checklist: `docs/PUBLIC_TRUST_CHECKLIST.md`.

Before the external account clicks, use the one-command founder session launcher:

```text
npm run launch:click-session
```

This prepares the private local evidence workspace, opens the generated click session browser cockpit, opens the generated Markdown backup sheet, opens the local founder consoles, and opens Spaceship, Spacemail, and Stripe account pages. It does not buy, publish, send, charge, apply public links, or create customer files.

For a prepare-only path without opening account pages, run:

```text
npm run launch:prepare-founder-clicks -- --domain {{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}}
```

This creates local files under `$HOME/MCPScan Founder Clicks/current/` for the domain cart proof, founder return packet, Stripe checkout QA evidence, command packet, guided browser cockpit, and Markdown backup sheet. Keep that folder outside the public repo.

Open this generated browser cockpit during the founder account session:

```text
$HOME/MCPScan Founder Clicks/current/CLICK_SESSION.html
```

Use this generated Markdown file as the backup checklist:

```text
$HOME/MCPScan Founder Clicks/current/CLICK_SESSION.md
```

Use `CLICK_SESSION.html` as the live checklist for account pages, exact public values, files to fill, verification commands, copy buttons, and stop conditions.

After the external account clicks, use `ops/founder-return-packet.html` to paste the purchased domain, mailbox, aliases, and Stripe links into one approval message.

Use `docs/FOUNDER_RETURN_VALUES_CHECKLIST.md` before pasting values back. Return only public launch values and Stripe QA evidence. Do not return passwords, secret keys, credit card details, recovery codes, customer configs, customer data, or production secrets.

After that message is approved, Codex can run the full post-click handoff:

```text
npm run launch:open-return-review
npm run launch:verify-cart -- --file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --return-file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt"
npm run launch:post-click-session -- --file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json" --apply true --publish true --mail-provider {{zoho_or_google_or_spacemail}}
```

The approved return-packet command writes `ops/founder-approval-status.json` automatically. The filled tracker is ignored by git by default. Do not add passwords, API keys, mailbox credentials, Stripe secret keys, or customer data.

## Rule

Do not send external messages, start a live audit, publish packages, or accept sensitive customer materials until the matching approval gate below is complete.

First revenue does not require npm publishing. Sell and deliver the `$1,500` MCP Launch Audit first, then publish npm when the owner is logged in and ready for OTP prompts.

## First Revenue Blocking Gates

| Order | Gate | Founder Action | Console | Done When |
| --- | --- | --- | --- | --- |
| 1 | Domain | Buy `getmcpscan.xyz` if Spaceship shows first-year domain pricing at or below `$3`, visible renewal, and no paid add-ons. Use `getmcpscan.com` only if you consciously choose trust over the tight cash cap | `ops/domain-mailbox-purchase-packet.html` | Domain exists in registrar account |
| 2 | Mailbox | Create Spacemail mailbox `security@getmcpscan.xyz` with `audit@getmcpscan.xyz` and `hello@getmcpscan.xyz` aliases. Use another provider only if you intentionally switch lanes | `ops/domain-email-dns-console.html` | MX, SPF, DKIM, and DMARC pass for the selected provider |
| 3 | Stripe | Generate setup packet, create three Payment Links, verify format and checkout QA evidence | `ops/stripe-click-setup.html`, `ops/stripe-payment-link-qa-console.html` | Quick, Launch, and Enterprise checkout links exist, `npm run launch:verify-stripe` passes, and `npm run launch:verify-stripe-qa` passes |
| 4 | Apply links | Approve exact return packet values | `ops/founder-return-packet.html` | Landing page no longer uses placeholder checkout links |
| 5 | Verify | Run launch verification | `ops/verification-console.html` | `npm run launch:verify -- --domain {{chosen_domain}}` has no domain or checkout warnings |
| 6 | Outbound | Refresh market sources, then approve exact recipients and exact final messages | `ops/outbound-recipient-approval-builder.html` | Approved messages are staged outside the public repo before any send |
| 7 | Paid handoff | Use the paid handoff builder after Stripe payment | `ops/paid-audit-handoff-builder.html`, `ops/post-payment-console.html` | Private workspace exists outside public repo |
| 8 | Delivery | Deliver report and buyer summary from private workspace | `ops/delivery-console.html` | Report is delivered without customer secrets in public repo |

## Operational Cleanup Gates

These are important, but they do not block first revenue while the GitHub Pages fallback remains live and the static bundle can publish.

| Gate | Founder Action | Console | Done When |
| --- | --- | --- | --- |
| GitHub billing | Clear the account billing lock and re-run failed Actions jobs | `ops/github-actions-billing-console.html` | CI and Pages jobs start and pass |
| npm | Optional: publish packages if desired | `ops/npm-publish-console.html` | npm shows version `0.1.0` for both packages |

## Current Known Blocker

GitHub Actions is not starting CI or Pages jobs because GitHub reports an account billing lock. This does not mean the repo checks failed. It means GitHub refused to start the jobs.

If Pages stays stale after a launch update, build the static launch bundle and upload `dist/mcpscan-static-launch/` to a static host.

```text
npm run landing:sample-report
npm run launch:bundle
npm run launch:publish-pages-fallback -- --wait true
```

After DNS records exist, verify the custom domain and mailbox records:

```text
npm run launch:dns-packet -- --domain {{chosen_domain}} --mailbox security@{{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}}
npm run launch:verify-dns -- --domain {{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}} --update-status
```

If the email provider provides a DKIM selector, include it:

```text
npm run launch:verify-dns -- --domain {{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}} --update-status --dkim-selector {{dkim_selector}}
```

After Stripe links exist, verify them before applying public links:

```text
npm run launch:verify-stripe -- --file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --update-status
npm run launch:verify-stripe-qa -- --file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json" --update-status
```

After founder clicks exist, apply the return packet, verify Stripe QA evidence, verify DNS, and refresh public-safe approval status:

```text
npm run launch:open-return-review
npm run launch:verify-cart -- --file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --return-file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt"
npm run launch:post-click-session -- --file "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt" --cart-file "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json" --qa-file "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json" --apply true --publish true --mail-provider {{zoho_or_google_or_spacemail}}
npm run launch:status
```

Before outbound, refresh the market source proof:

```text
npm run market:verify
npm run outbound:send-gates
```

After the live gates are clear, open the full first-revenue runway:

```text
npm run launch:open-first-revenue
```

After exact recipient and message approval, stage the send packet outside the public repo:

```text
npm run outbound:stage-approved -- --file /path/to/approved-outbound.txt
```

After all 10 exact route messages are approved in the same turn, stage the whole batch outside the public repo:

```text
npm run outbound:stage-route-packet -- --file /path/to/approved-first-10-route-packet.txt
```

After first payment clears and exact handoff values are approved:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --payment-evidence /path/to/payment-confirmation-evidence.json
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

Spend ceiling before first revenue: about `$27` to `$40` if using the `.com` trust lane, about `$26` to `$40` if using the clean `.dev` lane, or about `$20` to `$22` if using the prepared `.xyz` cheap lane with the current Spacemail Pro cart. Do not add paid dashboard infrastructure before the first paid audit.

## Stop Conditions

- Do not use the new mailbox for outbound until MX, SPF, DKIM, and DMARC pass.
- Do not send outbound without exact recipient and exact content approval in the same turn.
- Do not start paid delivery until payment and safe intake are confirmed.
- Do not place customer secrets, private configs, customer data, or final reports in the public repo.
- Do not publish npm until npm login and 2FA are confirmed.
