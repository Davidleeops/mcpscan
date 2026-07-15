# GitHub Repository And Separation Plan

MCPScan is already live as its own public repository:

- Repository: <https://github.com/Davidleeops/mcpscan>
- Default branch: `main`
- Visibility: public
- Landing page: <https://davidleeops.github.io/mcpscan/>
- License: MIT

## Decision

Keep MCPScan in its own repository under the current GitHub account.

Do not bury it inside an unrelated CapExLayer monorepo if the goal is to sell,
spin out, transfer, or diligence the product later. A separate repo keeps the
asset cleaner while still costing nothing extra on GitHub.

## Why This Is The Right Setup

- Public GitHub repositories are free.
- A standalone repo makes npm publishing, GitHub Actions usage, issues, stars,
  and open-source distribution clearer.
- A future buyer can diligence history, licenses, issues, and releases without
  seeing unrelated private business code.
- The product can still be owned by the same GitHub account today.
- Transfer is simple later: GitHub supports repository transfers to another
  user or organization.

## What To Keep Separate

Keep these out of this repository:

- CapExLayer private code.
- Customer confidential reports.
- Stripe secrets, npm tokens, domain credentials, and mailbox credentials.
- Non-public prospect lists with personal contact data.
- Delivery workpapers that include customer configs or sensitive findings.

Use this repo for:

- CLI source code.
- Public docs.
- Public landing page.
- Sample/sanitized reports.
- Draft launch copy.
- Generic sales and delivery templates.

## Future Spin-Off Checklist

If MCPScan is sold or moved into a separate company/account:

1. Transfer the GitHub repo to the buyer or new org.
2. Transfer npm package ownership for `mcpscan` and `@mcpscan/shared`.
3. Transfer the domain and DNS zone.
4. Transfer Stripe products or recreate Payment Links in the new account.
5. Transfer email aliases/mailbox ownership.
6. Export only non-confidential issues/docs unless customer agreements allow otherwise.
7. Revoke old deploy tokens, npm tokens, and app credentials.
8. Rotate all secrets.
9. Update landing, package metadata, SECURITY.md, and support contacts.
10. Tag the last pre-transfer release.

## Current GitHub Settings

Current live metadata:

- Description: `MCP production-readiness audits and local security scans for Model Context Protocol servers.`
- Homepage: <https://davidleeops.github.io/mcpscan/>
- Topics: `ai-agents`, `mcp`, `model-context-protocol`, `sarif`, `security`, `security-scanner`

Recommended next settings:

- Issues: enabled.
- Discussions: optional, enable after launch if community Q&A grows.
- Wiki: disabled.
- Secret scanning and push protection: enabled if available.
- Branch protection: enable after v0.1.0 release so launch velocity is not blocked by solo-owner workflow.

## Release Tag

Create the first release tag only after npm publish and smoke tests pass:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Then create a GitHub release:

- Title: `MCPScan v0.1.0`
- Summary: first public CLI release.
- Install command: `npm install -g mcpscan`
- Try-now command: `npx mcpscan scan ./claude_desktop_config.json`

