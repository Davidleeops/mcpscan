# GitHub Repository Setup Checklist

Use this checklist to create and push the public GitHub repository under the same GitHub account that will own MCPScan.

## Inputs

- GitHub owner: `mcpscan`
- Repository name: `mcpscan`
- Repository URL: `https://github.com/mcpscan/mcpscan`
- Default branch: `main`
- Visibility: public
- License: MIT
- Node version: 20 or newer

The package metadata currently points at `github.com/mcpscan/mcpscan`. If the repository must live under a personal account or a different organization instead, replace every `mcpscan` owner value below with that GitHub username or organization before running commands, then update package metadata in a separate implementation pass.

## 1. Create the Repository

Create the empty repository in GitHub before pushing:

1. Sign in to the GitHub account that should own the project.
2. Create a new repository named `mcpscan`.
3. Set visibility to `Public`.
4. Do not initialize with a README, license, `.gitignore`, or sample workflow.
5. Confirm the new repository URL is `https://github.com/mcpscan/mcpscan`.

Optional GitHub CLI flow:

```bash
gh auth status
gh repo create mcpscan/mcpscan --public --description "Free CLI security scanner for Model Context Protocol servers." --disable-wiki
```

To create the repository under the currently authenticated GitHub account without hard-coding an owner:

```bash
OWNER="$(gh api user --jq .login)"
gh repo create "$OWNER/mcpscan" --public --description "Free CLI security scanner for Model Context Protocol servers." --disable-wiki
```

## 2. Prepare the Local Repository

From the project root:

```bash
pwd
npm ci
npm run clean
npm run typecheck
npm run build
npm test
```

Confirm the repository is clean except for intended release documentation changes:

```bash
git status --short
```

If this folder is not already a Git repository, initialize it:

```bash
git init
git branch -M main
git add README.md docs package.json package-lock.json packages tsconfig.json
git commit -m "Initial MCPScan release"
```

If it is already a Git repository, commit the launch-ready state normally:

```bash
git add README.md docs package.json package-lock.json packages tsconfig.json
git commit -m "Prepare MCPScan launch"
```

## 3. Connect the Remote

Check whether `origin` already exists:

```bash
git remote -v
```

If no `origin` exists:

```bash
git remote add origin git@github.com:mcpscan/mcpscan.git
```

If `origin` points somewhere else, update it only after confirming the old remote is not needed:

```bash
git remote set-url origin git@github.com:mcpscan/mcpscan.git
```

## 4. Push the Default Branch

```bash
git push -u origin main
```

Confirm the pushed repository renders correctly:

1. Open `https://github.com/mcpscan/mcpscan`.
2. Confirm the README headline, CLI examples, and development commands render.
3. Confirm package directories are present: `packages/cli` and `packages/shared`.
4. Confirm release docs are present under `docs/`.
5. Confirm GitHub shows the MIT license.

## 5. Configure Repository Settings

Set these before launch:

- About description: `Free CLI security scanner for Model Context Protocol servers.`
- Website: npm package page after publish, or leave blank until publish completes.
- Topics: `mcp`, `model-context-protocol`, `security`, `scanner`, `cli`, `ai-security`, `owasp`
- Issues: enabled
- Discussions: optional; enable if community Q&A is desired at launch.
- Wiki: disabled unless documentation will be maintained there.
- Default branch protection: require pull request review before merging after launch.
- Secret scanning and push protection: enabled if available for the account.

## 6. Optional Release Tag

Create the first release tag only after local verification and npm package availability checks pass:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Then create a GitHub release from `v0.1.0` with:

- Title: `MCPScan v0.1.0`
- Summary: first public CLI release.
- Install command: `npm install -g mcpscan`
- Try-now command: `npx mcpscan scan ./claude_desktop_config.json`

## 7. Before npm Trusted Publishing

Manual npm publish can happen without a release workflow. For trusted publishing later:

1. Keep the GitHub repository public.
2. Add a dedicated publish workflow under `.github/workflows/`.
3. Configure each npm package to trust that workflow.
4. Publish with provenance from GitHub Actions.

Do not add the workflow until the npm package settings and release owner are finalized.
