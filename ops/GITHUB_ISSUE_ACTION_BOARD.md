# GitHub Issue Action Board

This board maps each open launch-blocker issue to the local click console that resolves it.

Start here:

```text
ops/launch-cockpit.html
```

## Open Gates

| Issue | Gate | Console | Completion Proof |
| --- | --- | --- | --- |
| [#2](https://github.com/Davidleeops/mcpscan/issues/2) | Buy domain and create mailbox | `ops/domain-email-dns-console.html` | Domain resolves, mailbox exists, MX/SPF/DKIM pass |
| [#3](https://github.com/Davidleeops/mcpscan/issues/3) | Create Stripe Payment Links | `ops/stripe-click-setup.html` | Three live Stripe Payment Links exist |
| [#4](https://github.com/Davidleeops/mcpscan/issues/4) | Replace landing CTAs and contact links | `ops/approved-links-command-builder.html` | `npm run launch:verify -- --domain mcpscanhq.com` has no checkout/custom-domain warnings |
| [#5](https://github.com/Davidleeops/mcpscan/issues/5) | Authenticate npm and publish v0.1.0 | `ops/npm-publish-console.html` | `npm view @mcpscan/shared name version` and `npm view mcpscan name version` return `0.1.0` |
| [#6](https://github.com/Davidleeops/mcpscan/issues/6) | Approve first outbound messages | `ops/outbound-approval-console.html` | Exact recipients and exact final content approved in the same turn |

## Verification

Current public launch state:

```text
npm run launch:verify
```

Custom-domain launch state, after domain/DNS:

```text
npm run launch:verify -- --domain mcpscanhq.com
```

Strict final launch check:

```text
npm run launch:verify -- --domain mcpscanhq.com --strict
```

## Hard Rules

- Do not send external messages without same-turn approval of exact recipient and exact content.
- Do not store customer secrets, private configs, customer data, or final private reports in the public repo.
- Do not send outbound from `hello@mcpscanhq.com` until MX, SPF, and DKIM pass.
- Do not publish npm packages until npm login and 2FA/OTP are confirmed.

