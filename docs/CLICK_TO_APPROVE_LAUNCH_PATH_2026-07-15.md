# Click-To-Approve Launch Path

Date: July 15, 2026

This is the shortest path from current state to live, revenue-capable MCPScan without sending external messages automatically.

Workspace rule: all outbound emails, LinkedIn messages, Slack messages, and prospect/vendor/customer communications must remain draft-only until same-turn explicit approval is given for exact recipient and final content.

## Current State

Already live:

- Public GitHub repo: <https://github.com/Davidleeops/mcpscan>
- GitHub Pages landing page: <https://davidleeops.github.io/mcpscan/>
- Sample report: <https://davidleeops.github.io/mcpscan/sample-report.html>
- GitHub issue intake template for audit requests.
- CI is configured.
- Domain shortlist exists.
- First-customer/outbound docs exist.

Not live yet:

- npm packages are not published.
- Stripe Payment Links are not created.
- Custom domain is not purchased.
- Email inbox is not purchased/configured.
- Landing CTAs still point to GitHub issue intake instead of Stripe.

## Approval Step 1: Domain

Recommended domain:

1. `mcpscanhq.com`
2. backup: `mcpscanhq.dev`
3. backup: `mcpscanlab.dev`

Click path:

1. Open Spaceship domain search.
2. Search `mcpscanhq.com`.
3. If available around $8.88 first year and not premium-priced, buy it.
4. If unavailable or premium-priced, search `mcpscanhq.dev`.
5. If unavailable or premium-priced, search `mcpscanlab.dev`.
6. Do not buy `.online` or `.site` as the primary brand unless the only priority is lowest first-year price.

After purchase, give Codex the domain name. Then Codex can:

- add GitHub Pages custom-domain config
- update landing docs
- prepare DNS instructions
- update landing links/copy

## Approval Step 2: Email

Recommended:

- mailbox: `hello@<domain>`
- aliases later: `audits@<domain>`, `security@<domain>`, `support@<domain>`

Click path:

1. In Spaceship, choose Spacemail for the purchased domain.
2. Buy the cheapest mailbox plan only if the checkout total is acceptable.
3. Create `hello@<domain>`.
4. Share only the public email address with Codex, not the password.

After email exists, Codex can:

- update landing contact CTA to `mailto:hello@<domain>`
- update SECURITY.md with disclosure/contact language
- update audit request docs

## Approval Step 3: npm

Blocked on npm auth.

Click path:

```bash
npm adduser
```

Then let Codex run the preflight and publish sequence:

```bash
npm whoami
npm view @mcpscan/shared name version
npm view mcpscan name version
npm ci
npm run build
npm test
npm publish -w @mcpscan/shared --access public
npm publish -w mcpscan --access public
```

After npm publish, Codex can:

- smoke test `npx mcpscan`
- update README install status
- create a release tag
- draft launch posts

## Approval Step 4: Stripe Payment Links

Create three products:

1. MCP Quick Audit
   - Price: $750
   - Use for lower-friction first customers.

2. MCP Launch Audit
   - Price: $1,500
   - Recommended default.

3. MCP Enterprise Readiness Audit
   - Price: $3,500
   - Use for buyer/security review situations.

After Stripe links exist, give Codex the three public Payment Link URLs. Codex can:

- replace GitHub issue CTA links in `landing/index.html`
- push updated landing page
- verify all CTAs
- update sales docs

## Approval Step 5: First Outbound

Codex can prepare drafts and target lists, but cannot send without exact same-turn approval.

Click path:

1. Build 100-target list from `sales/first-100-prospect-sourcing.md`.
2. Pick first 10 targets from `docs/FIRST_10_CUSTOMERS.md`.
3. Use drafts in `sales/outbound-email.md`, `sales/linkedin-dm.md`, and `launch/`.
4. For each outbound, approve exact recipient and final text before sending.

## Approval Dashboard

| Approval | Current best choice | Expected first cost | Owner click needed | Codex does after approval |
| --- | --- | ---: | --- | --- |
| Domain/email | `mcpscanhq.com` + Spacemail Pro | ~$23 total | [Issue #2](https://github.com/Davidleeops/mcpscan/issues/2) | Configure Pages DNS docs, update canonical URLs and contact CTAs |
| Stripe | 3 one-time Payment Links | Stripe fees only | [Issue #3](https://github.com/Davidleeops/mcpscan/issues/3) | Replace CTAs, verify checkout links |
| npm | `mcpscan` + `@mcpscan/shared` | $0 | [Issue #5](https://github.com/Davidleeops/mcpscan/issues/5) | Publish, smoke test, tag release |
| Landing CTAs | Checkout + email | $0 | [Issue #4](https://github.com/Davidleeops/mcpscan/issues/4) | Push updated landing and verify Pages |
| First outbound | 10 highest-score prospects | $0 | [Issue #6](https://github.com/Davidleeops/mcpscan/issues/6) | Send only after same-turn explicit approval |

Minimum credible first-revenue stack:

- GitHub Pages hosting: $0.
- GitHub public repo: $0.
- Domain: about $9 first year.
- Email: about $14 for 2 years.
- Stripe Payment Links: $0 monthly; per-payment processing fees.
- npm publish: $0.

Total new cash needed before first paid audit: roughly $23 plus payment processing fees, assuming no premium domain pricing.

## What Codex Can Still Do Without Your Click

- Improve CLI reports.
- Add SARIF output.
- Add Markdown report output.
- Add badge endpoint/static badge instructions.
- Add demo repo/sample scan artifacts.
- Draft HN/Reddit/LinkedIn launch posts.
- Build target-list templates.
- Prepare Stripe copy.
- Prepare DNS instructions.
- Update docs and landing copy.

## Next Technical Build Priorities

P0:

- SARIF output. Added in CLI; publish npm before external use.
- Markdown output. Added in CLI for PR comments/issues/artifacts.
- GitHub Action marketplace-ready action wrapper. Added as `action.yml`; tag a release after npm publish.
- Public demo repo/report.
- Better report confidence/evidence fields.

P1:

- Static badge endpoint or Shields-compatible JSON.
- PDF export.
- Signed/provenance npm publish.
- Scanner safety policy for no live exploit attempts.

P2:

- Dashboard upload/history.
- Runtime wrapper/gateway experiment.
- MCP trust registry.
- Drift detection.
