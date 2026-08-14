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

High-priority source classes to refresh manually before a larger outbound batch:

- official MCP specification and authorization guidance
- GitHub Copilot MCP registry, allowlist, and managed settings docs
- Microsoft IDE and CLI MCP workflow docs
- OpenAI and Anthropic connector, MCP app, workspace admin, and app permission docs
- NSA, CoSAI, OWASP, and CSA MCP security guidance
- OWASP MCP Top 10 and MCP Cheat Sheet
- NVD or vendor writeups for public CVEs and PoCs
- security incident and vulnerability roundups, treated as category-level urgency only
- community threads about approvals, tool-call visibility, registry enforcement, and production use
- AI data governance reports that discuss downstream agent access to enterprise systems

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
- Do not imply a named prospect is vulnerable just because it appears near an MCP risk source.
