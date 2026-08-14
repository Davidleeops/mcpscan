# GitHub Issue Action Board

This board maps each open launch-blocker issue to the local click console that resolves it.

Start here:

```text
npm run launch:next
```

This opens the current founder action stack, live status, issue board, GitHub billing, GitHub Actions, Spaceship domain search, Stripe Payment Links, and next commands without buying, publishing, sending, applying links, or creating customer files.

Current market proof:

```text
docs/MARKET_REALITY_BRIEF_2026-08-14.md
sales/buyer-intent-map-2026-08-14.md
sales/first-account-dossier-2026-08-14.md
ops/first-account-dossier-console.html
ops/recipient-finder-console.html
sales/recipient-approval-packet-2026-08-14.md
```

Public-safe founder gate tracker:

```text
ops/founder-approval-status.template.json
```

The filled local tracker is ignored by git and is written by:

```text
npm run launch:apply-return-packet -- --file /path/to/approved-return-packet.txt
```

## Open Gates

| Issue | Gate | Console | Completion Proof |
| --- | --- | --- | --- |
| [#7](https://github.com/Davidleeops/mcpscan/issues/7) | Clear GitHub Actions billing lock | `ops/github-actions-billing-console.html` | CI and Pages jobs start and pass |
| [#2](https://github.com/Davidleeops/mcpscan/issues/2) | Buy domain and create mailbox | `ops/domain-email-dns-console.html`, `docs/DOMAIN_AND_MAILBOX_DECISION.md` | Domain resolves, mailbox exists, MX/SPF/DKIM pass |
| [#3](https://github.com/Davidleeops/mcpscan/issues/3) | Create Stripe Payment Links | `ops/stripe-click-setup.html`, `ops/stripe-payment-link-qa-console.html` | Three live Stripe Payment Links exist |
| [#4](https://github.com/Davidleeops/mcpscan/issues/4) | Replace landing CTAs and contact links | `ops/approved-links-command-builder.html` | `npm run launch:verify -- --domain {{chosen_domain}}` has no checkout/custom-domain warnings |
| [#5](https://github.com/Davidleeops/mcpscan/issues/5) | Optional package release: authenticate npm and publish v0.1.0 | `ops/npm-publish-console.html` | `npm view @mcpscan/shared name version` and `npm view mcpscan name version` return `0.1.0` |
| [#6](https://github.com/Davidleeops/mcpscan/issues/6) | Approve first outbound messages | `ops/first-10-outbound-approval-console.html`, `ops/outbound-approval-console.html` | Exact recipients and exact final content approved in the same turn |

## Verification

Current public launch state:

```text
npm run launch:next
npm run writing:check
npm run launch:verify
```

Custom-domain launch state, after domain/DNS:

```text
npm run launch:verify -- --domain CHOSEN_DOMAIN
```

Strict final launch check:

```text
npm run launch:verify -- --domain CHOSEN_DOMAIN --strict
```

## Hard Rules

- Do not send external messages without same-turn approval of exact recipient and exact content.
- Do not store customer secrets, private configs, customer data, or final private reports in the public repo.
- Do not send outbound from `security@{{chosen_domain}}` until MX, SPF, DKIM, and DMARC pass.
- Do not wait on npm publishing before selling the paid audit.
- Do not publish npm packages until npm login and 2FA/OTP are confirmed.
