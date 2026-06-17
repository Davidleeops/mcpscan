# npm Launch Checklist

Use this checklist for the first public npm release of MCPScan.

## Release Packages

Publish in this order:

1. `@mcpscan/shared`
2. `mcpscan`

The CLI package depends on `@mcpscan/shared`, so publishing `mcpscan` first can produce a broken install.

## 1. Account and Auth Preflight

Confirm the publishing account:

```bash
npm whoami
npm profile get name
npm profile get email
```

Confirm 2FA status:

```bash
npm profile get tfa
```

Expected setup:

- Use an npm account controlled by the same owner operating the GitHub repository.
- Enable 2FA for authorization and publishing before launch.
- Have an authenticator app ready for one-time passwords.
- Do not publish from a shared terminal session or a token copied into shell history.

If using an automation token instead of an interactive publish, create a granular npm token restricted to these packages and keep it out of the repository.

## 2. Package Name Availability

Check whether the package names are available or already owned by the publishing account:

```bash
npm view @mcpscan/shared name version
npm view mcpscan name version
```

Interpretation:

- `npm ERR! 404` means the package name is currently unclaimed.
- A returned package name and version means the name already exists.
- If the package exists, confirm the publishing account has maintainer access:

```bash
npm owner ls @mcpscan/shared
npm owner ls mcpscan
```

Also check the public package pages in a browser before launch:

- `https://www.npmjs.com/package/@mcpscan/shared`
- `https://www.npmjs.com/package/mcpscan`

## 3. Fallback if `mcpscan` Is Unavailable

If `mcpscan` is unavailable and the owner will not transfer it:

1. Keep `@mcpscan/shared` only if the `@mcpscan` scope is controlled by the project owner.
2. Choose a scoped CLI package name: `@mcpscan/cli`.
3. Update package metadata in a separate implementation pass:
   - `packages/cli/package.json` `name`
   - README install and `npx` examples
   - release docs and smoke commands
4. Publish with:

```bash
npm publish -w @mcpscan/shared --access public
npm publish -w @mcpscan/cli --access public
```

5. Use scoped run commands after publish:

```bash
npx @mcpscan/cli scan ./packages/cli/test/fixtures/secure-config.json
npm exec @mcpscan/cli -- scan ./packages/cli/test/fixtures/secure-config.json
```

If the `@mcpscan` scope itself is unavailable, choose a new project-owned scope before publishing anything, then update both package names together in a separate implementation pass.

## 4. Local Release Verification

From the repository root:

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

Inspect the dry-run output:

- `@mcpscan/shared` includes `dist/index.js` and `dist/index.d.ts`.
- `mcpscan` includes `dist/index.js` and its package README.
- No secrets, local fixtures with credentials, logs, or source maps appear unexpectedly.
- Package versions match: `0.1.0` for both packages.

## 5. Publish

Publish `@mcpscan/shared` first:

```bash
npm publish -w @mcpscan/shared --access public
```

If npm prompts for a one-time password, rerun with:

```bash
npm publish -w @mcpscan/shared --access public --otp 123456
```

Wait until npm shows the package page, then publish the CLI:

```bash
npm publish -w mcpscan --access public
```

If npm prompts for a one-time password, rerun with:

```bash
npm publish -w mcpscan --access public --otp 123456
```

Confirm both packages are visible:

```bash
npm view @mcpscan/shared name version dist-tags.latest
npm view mcpscan name version dist-tags.latest bin engines
```

Expected latest version for both packages: `0.1.0`.

## 6. Post-Publish Smoke Tests

Run these from a clean temporary directory, not from inside the repository:

```bash
mkdir -p /tmp/mcpscan-smoke
cd /tmp/mcpscan-smoke
npm cache verify
npx mcpscan --help
npx mcpscan scan /Users/lemueldavidleejr/Desktop/05_OPS/Scripts_and_Code/Codex\ folder/mcpscan/packages/cli/test/fixtures/secure-config.json
npx mcpscan scan /Users/lemueldavidleejr/Desktop/05_OPS/Scripts_and_Code/Codex\ folder/mcpscan/packages/cli/test/fixtures/commercial-risk-config.json --ci --min-grade B
```

Expected results:

- `npx mcpscan --help` prints CLI help.
- The secure fixture completes successfully.
- The commercial-risk fixture exits non-zero with `--ci --min-grade B`.

Also verify global install and uninstall:

```bash
npm install -g mcpscan
mcpscan --help
npm uninstall -g mcpscan
```

## 7. Launch Status Checks

Before posting announcements:

- GitHub repository is public.
- README install command works from a clean directory.
- npm package page for `mcpscan` shows the correct README.
- npm package page for `@mcpscan/shared` shows version `0.1.0`.
- GitHub release tag exists if using a tagged launch.
- No known critical install, runtime, or packaging issue remains open.

## 8. Launch Announcement Skeleton

Short version:

```text
MCPScan is live: a free CLI security scanner for Model Context Protocol servers.

Install:
npx mcpscan scan ./claude_desktop_config.json

It checks for auth gaps, SSRF-prone tools, sensitive output patterns, TLS issues, risky tool descriptions, permissive CORS, and default credentials, then returns an A-F grade with actionable findings.

GitHub: https://github.com/mcpscan/mcpscan
npm: https://www.npmjs.com/package/mcpscan
Feedback welcome.
```

Long version:

```text
MCPScan v0.1.0 is now available.

MCPScan is a free local CLI security scanner for Model Context Protocol servers. It can scan Claude Desktop-style MCP configs, local server commands, and remote HTTPS/SSE endpoints, then produce an A-F grade with findings and remediation guidance.

Try it:
npx mcpscan scan ./claude_desktop_config.json
npx mcpscan scan --server "npx -y @modelcontextprotocol/server-filesystem /tmp"
npx mcpscan scan --url https://mcp.example.com/sse

This first release checks for missing auth signals, SSRF-prone URL tools, sensitive output patterns, TLS issues, prompt-injection language in tool descriptions, permissive CORS, and default credentials.

GitHub: https://github.com/mcpscan/mcpscan
npm: https://www.npmjs.com/package/mcpscan

I would love feedback from MCP builders, security reviewers, and teams starting to inventory MCP server risk.
```

## 9. If Something Goes Wrong

If a package was published with a broken README, missing files, or a runtime issue:

1. Do not unpublish unless the package contains secrets or legally sensitive material.
2. Fix the issue in a separate commit.
3. Bump both package versions together.
4. Run the full local verification checklist.
5. Publish `@mcpscan/shared` first, then `mcpscan`.
6. Update the GitHub release notes with the corrected version.

If a secret was published, revoke it immediately before any package cleanup.
