# MCPScan Market Research Refresh

Use this before outbound batches, landing-page rewrites, pricing changes, or investor/customer conversations where the market claim needs to be current.

## Command

```text
npm run market:verify
```

Strict mode is useful before publishing a refreshed market brief:

```text
npm run market:verify -- --strict
```

## What It Checks

The verifier reads the current market and prospect research files, extracts source URLs, and checks whether each source still responds.

Default files:

- `docs/MARKET_REALITY_BRIEF_2026-08-14.md`
- `sales/buyer-intent-map-2026-08-14.md`
- `sales/first-account-dossier-2026-08-14.md`

## How To Use The Result

- Passes mean the evidence links still resolve.
- Warnings mean a source may be stale, blocked, moved, or temporarily unavailable.
- Failures mean the expected research files or source URL list are missing.

Warnings do not automatically invalidate the opportunity. They trigger a refresh pass before making a stronger public claim.

## Refresh Rule

Keep the first-revenue conclusion conservative:

- Lead with the $1,500 MCP Launch Audit.
- Use the $750 MCP Quick Audit only for small, low-complexity setups.
- Treat the scanner as fulfillment leverage, not the whole sales pitch.
- Do not claim compliance certification or automated coverage beyond what the scanner and manual review can prove.
