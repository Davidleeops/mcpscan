# MCPScan Public Trust Checklist

Generated: 2026-08-14

Use this before pointing paid outreach or community launch traffic at MCPScan.

## Required Before Paid Outbound

| Check | Required State | Proof |
| --- | --- | --- |
| Custom domain | `getmcpscan.com`, `trymcpscan.com`, or approved fallback resolves to the landing page | Browser visit plus `npm run launch:verify -- --domain {{chosen_domain}}` |
| HTTPS | HTTPS is enforced on the public site | Browser lock icon and GitHub Pages setting |
| Primary mailbox | `security@{{chosen_domain}}` receives email | Test inbound email |
| Security mailbox | `security@{{chosen_domain}}` reaches the monitored launch inbox | Test inbound email |
| Audit alias | `audit@{{chosen_domain}}` reaches the same monitored inbox | Test inbound email |
| General alias | `hello@{{chosen_domain}}` reaches the same mailbox or monitored inbox | Test inbound email |
| SPF | Domain includes the selected mail provider in SPF | `npm run launch:verify-dns -- --domain {{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}} --update-status` |
| DKIM | Mail provider DKIM is configured | Provider DNS check |
| DMARC | `_dmarc.{{chosen_domain}}` exists | `npm run launch:verify-dns -- --domain {{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}} --update-status` |
| Stripe links | All three live Payment Links exist | `npm run launch:verify-stripe -- --file /path/to/approved-return-packet.txt --update-status` |
| Terms | Terms page is reachable from the landing page | Browser visit |
| Privacy | Privacy page is reachable from the landing page | Browser visit |
| Refund policy | Refund policy is reachable from the landing page | Browser visit |
| Sample report | Sample report is reachable and readable | Browser visit |
| Secure intake | Intake page tells buyers not to paste secrets into the public repo | Browser visit |
| Contact consistency | Landing, security policy, and sales docs use `security@{{chosen_domain}}` as the primary public mailbox | `npm run launch:verify -- --domain {{chosen_domain}}` |
| No customer data | Public repo contains no customer configs, reports, secrets, or private scan artifacts | `npm run launch:verify` plus manual review |

## Required Before Taking Payment

- Fixed offer scope is visible.
- Buyer can see what is included.
- Buyer can see what is excluded.
- Buyer can see turnaround time.
- Buyer can reach support.
- Customer intake tells them not to send secrets through GitHub issues.
- Delivery workspace is created outside the public repo.
- Refund policy is published.

## Domain Trust Rules

- Prefer `.com` when it is standard-priced.
- Use `.us` only when the founder is comfortable with the US nexus and registration privacy tradeoffs.
- Use novelty promo TLDs only as redirects or temporary tests.
- Do not use a 98-cent TLD as the main paid security audit brand.
- Do not buy more than one domain before first revenue unless there is a clear brand-protection reason.

## Final Pre-Outbound Command Set

```text
npm run writing:check
npm run market:verify
npm run launch:verify -- --domain {{chosen_domain}}
npm run launch:verify-dns -- --domain {{chosen_domain}} --mail-provider {{zoho_or_google_or_spacemail}} --update-status
npm run outbound:verify
```

If Stripe links were just created:

```text
npm run launch:verify-stripe -- --file /path/to/approved-return-packet.txt --update-status
```

## Stop Conditions

- Do not send outbound if DKIM is missing.
- Do not send outbound if DMARC is missing.
- Do not accept payment if Stripe links have not been verified.
- Do not ask customers to paste secrets into GitHub issues.
- Do not claim certification, formal compliance approval, or full penetration-test coverage.
