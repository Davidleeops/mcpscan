# GTM Claim Safety

Generated: 2026-08-14

MCPScan should sell a focused readiness audit, not overstate what exists.

## Allowed Claims

- fixed-scope MCP readiness audit
- server and tool inventory
- read/write/destructive action classification
- auth and secret-handling review
- prompt-injection and tool-description risk review
- remediation checklist
- buyer-safe report
- re-scan when included in the package

## Avoid Claims

- certification
- formal compliance approval
- full penetration-test coverage
- guaranteed security
- continuous monitoring, unless the dashboard exists and is live
- live dashboard, unless the dashboard exists and is live
- vulnerability found at a target company, unless the company authorized testing and the finding is real

## Verification

Run:

```text
npm run gtm:verify
```

This checks core GTM files for approval gates, scope language, mail trust requirements, and forbidden overclaims.
