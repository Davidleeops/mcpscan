# MCPScan Release Runbook

Use this runbook to publish the free CLI distribution package.

## Preflight

Confirm package names are still available or owned by the publishing account:

```bash
npm view @mcpscan/shared name version
npm view mcpscan name version
```

Confirm npm authentication and 2FA/token setup:

```bash
npm whoami
```

npm package publishing requires either 2FA during publish or a granular automation token configured to bypass interactive 2FA. For GitHub-based trusted publishing, configure the package on npm and publish from a public GitHub Actions workflow with provenance enabled.

## Local Verification

```bash
npm ci
npm run clean
npm run typecheck
npm run build
npm test
npm audit --omit=dev
npm pack --dry-run -w @mcpscan/shared
npm pack --dry-run -w mcpscan
```

## Manual Publish

Publish the shared package first because the CLI depends on it.

```bash
npm publish -w @mcpscan/shared --access public
npm publish -w mcpscan --access public
```

If the registry prompts for a one-time password, rerun with:

```bash
npm publish -w @mcpscan/shared --access public --otp 123456
npm publish -w mcpscan --access public --otp 123456
```

## Post-Publish Smoke Test

```bash
npx mcpscan scan ./packages/cli/test/fixtures/secure-config.json
npx mcpscan scan ./packages/cli/test/fixtures/commercial-risk-config.json --ci --min-grade B
```

The secure fixture should pass. The commercial-risk fixture should fail CI.

## Version Bump Flow

1. Update both package versions together.
2. Update `@mcpscan/shared` dependency in `packages/cli/package.json`.
3. Run the local verification commands.
4. Tag release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

5. Publish shared, then CLI.

## Future Trusted Publishing

Add a dedicated release workflow after the GitHub repository exists and npm package settings are configured for trusted publishing. Until then, use manual publish with 2FA and the verification steps above.
