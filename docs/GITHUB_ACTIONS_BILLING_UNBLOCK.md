# GitHub Actions Billing Unblock

GitHub is currently refusing to start MCPScan CI and Pages jobs because the account is locked due to a billing issue. This is a founder account action, not a code failure.

## What Is Blocked

- CI workflow start
- GitHub Pages deploy workflow start
- Public site updates that depend on Pages deployment
- Automatic proof that future commits pass in GitHub Actions

## What Still Works

- Remote commits can still be published through GitHub API.
- Fresh remote snapshots can still be downloaded and verified locally.
- Local CI-equivalent checks pass from the downloaded remote snapshot.
- Existing public GitHub Pages URLs still respond.
- Static launch bundles can be built and uploaded to another static host if Pages remains stale.

## Founder Action

1. Open GitHub billing settings for the account or organization that owns `Davidleeops/mcpscan`.
2. Resolve the billing lock or update the payment method.
3. Return to the MCPScan Actions tab.
4. Re-run the latest failed CI workflow.
5. Re-run the latest failed Deploy Landing Page workflow if a public landing change was included.

## Acceptance Proof

The unblock is complete when:

- Latest CI run starts and completes successfully.
- Latest Deploy Landing Page run starts and completes successfully.
- `npm run launch:verify` still reports only the expected founder-click warnings.

## Local Fallback Until Billing Is Fixed

Use a fresh remote snapshot and run:

```text
npm ci
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

Static landing fallback:

```text
npm run landing:sample-report
npm run launch:bundle
```

Post-domain DNS proof:

```text
npm run launch:verify-dns -- --domain getmcpscan.com
```
