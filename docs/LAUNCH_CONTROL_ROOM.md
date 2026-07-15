# MCPScan Launch Control Room

Date: July 15, 2026

This is the operator view for getting MCPScan from live demo to first revenue.
Nothing here requires external sending or purchasing without owner approval.

## Live Now

- GitHub repo: <https://github.com/Davidleeops/mcpscan>
- Landing page: <https://davidleeops.github.io/mcpscan/>
- Sample report: <https://davidleeops.github.io/mcpscan/sample-report.html>
- Thank-you page: <https://davidleeops.github.io/mcpscan/thank-you.html>
- Intake checklist: <https://davidleeops.github.io/mcpscan/intake.html>
- Badge endpoint: <https://davidleeops.github.io/mcpscan/badge.json>
- Audit request intake: GitHub Issues template
- CI: passing on `main`
- GitHub Action wrapper: `action.yml`
- Report formats: table, JSON, HTML, Markdown, SARIF
- Scanner coverage: 22 heuristic checks across auth, input, output, transport, tooling, and config
- Sample report generation: `npm run landing:sample-report` after `npm run build`
- Latest GTM research: `docs/GTM_RESEARCH_UPDATE_2026-07-15.md`
- Prospect pools: `sales/prospect-pools-2026-07-15.md`
- Seed prospect CSV: `sales/seed-prospect-list-2026-07-15.csv`
- Outreach approval queue: `sales/outreach-approval-queue.md`
- One-page buyer scope: `sales/one-page-scope.md`
- First audit delivery packet: `docs/FIRST_AUDIT_DELIVERY_PACKET.md`
- Approved links template: `docs/APPROVED_LINKS_TEMPLATE.md`

## Best Current Offer

Lead with the service, not the future SaaS:

**MCP production-readiness audit for teams connecting AI agents to real tools,
credentials, code, customer data, and internal APIs.**

The CLI is the wedge. The paid audit is the first revenue path. The dashboard
can come after demand is proven.

## Buy List

| Item | Pick | Estimated cost | Why |
| --- | --- | ---: | --- |
| Domain | `mcpscanhq.com` | ~$8.88 first year / ~$9.98 renewal | Most credible trust/cost balance |
| Email | Spacemail Pro | ~$14.16 for 2 years | One mailbox plus aliases is enough |
| Payments | Stripe Payment Links | $0 monthly | Fastest checkout path |
| Hosting | GitHub Pages | $0 | Already live |
| Repo | Current GitHub repo | $0 | Public and already deployed |
| npm | `mcpscan` + `@mcpscan/shared` | $0 | Needs owner npm auth/OTP |

Do not buy `.online` as the canonical brand. It is cheap first year but weaker
for a security audit offer and renews higher than `.com`.

## Approval Buttons To Click

1. [Issue #2](https://github.com/Davidleeops/mcpscan/issues/2): buy `mcpscanhq.com` if standard-priced and create `hello@mcpscanhq.com`.
2. [Issue #3](https://github.com/Davidleeops/mcpscan/issues/3): create Stripe one-time Payment Links for:
   - MCP Quick Audit: $750
   - MCP Launch Audit: $1,500
   - MCP Enterprise Readiness Audit: $3,500
3. [Issue #5](https://github.com/Davidleeops/mcpscan/issues/5): run `npm adduser` and provide OTP when publish prompts appear.
4. [Issue #4](https://github.com/Davidleeops/mcpscan/issues/4): replace landing CTAs after domain/email and Stripe links exist.
5. [Issue #6](https://github.com/Davidleeops/mcpscan/issues/6): approve exact recipient and final copy before any external send.

## What Codex Can Do Immediately After Each Click

| Owner click | Codex follow-through |
| --- | --- |
| Domain bought | Configure `CNAME`, prepare DNS records, update canonical URLs |
| Email created | Update landing contact links, security contact, audit intake language |
| Stripe links created | Replace GitHub issue CTAs with payment links, verify all buttons |
| npm auth complete | Publish packages, smoke test `npx mcpscan`, tag release |
| Outreach recipient approved | Send only the exact approved message, then log next action |

## Post-Approval Automation

After domain/email/Stripe links exist, Codex can run:

```bash
npm run launch:apply-links -- \
  --domain mcpscanhq.com \
  --email hello@mcpscanhq.com \
  --quick https://buy.stripe.com/quick-link \
  --launch https://buy.stripe.com/launch-link \
  --enterprise https://buy.stripe.com/enterprise-link
```

That updates landing pricing CTAs, the final scope/contact CTA, public URLs in
launch docs, `landing/CNAME` for GitHub Pages, and `SECURITY.md` contact
language.

After npm auth is complete, Codex can run:

```bash
npm run release:preflight
```

Then publish in order:

```bash
npm publish -w @mcpscan/shared --access public
npm publish -w mcpscan --access public
```

To regenerate the first outbound approval queue:

```bash
npm run outbound:queue
```

## First 10 Revenue Actions

1. Buy `mcpscanhq.com`.
2. Create `hello@mcpscanhq.com`.
3. Create Stripe Payment Links.
4. Run `npm run launch:apply-links -- ...` with approved URLs.
5. Publish `mcpscan` to npm after `npm run release:preflight`.
6. Tag v0.1.0 and make the GitHub Action usable by release tag.
7. Source 20 high-signal prospects from `sales/first-100-prospect-sourcing.md`.
8. Prioritize GitHub/Copilot Enterprise, Slack/Atlassian admin/security, and AI coding-tool communities.
9. Review `sales/outreach-approval-queue.md`, then approve exact recipients and messages.
10. Post one launch/community draft after same-turn approval.

## First Delivery Promise

For the first paid audit, keep scope tight:

- Intake complete before the clock starts.
- No production credentials required.
- Up to the package server/environment limit.
- Deliver written report, risk-ranked findings, and remediation checklist.
- Include re-scan only on Launch and Enterprise packages.
- Use `docs/FIRST_AUDIT_DELIVERY_PACKET.md` for the first paid fulfillment.

## Do Not Claim Yet

- Do not claim certification.
- Do not claim full pentest coverage.
- Do not claim continuous monitoring.
- Do not claim dashboard history until the SaaS exists.
- Do not claim npm install works until packages are published and smoke-tested.
