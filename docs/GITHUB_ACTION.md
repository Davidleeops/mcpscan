# MCPScan GitHub Action

MCPScan includes a composite GitHub Action for fast CI adoption.

## Basic Workflow

```yaml
name: MCP Security Scan

on: [push, pull_request]

jobs:
  mcpscan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Davidleeops/mcpscan@main
        with:
          target: ./mcp-config.json
          min-grade: B
```

## Markdown Artifact

```yaml
- uses: Davidleeops/mcpscan@main
  with:
    target: ./mcp-config.json
    min-grade: B
    format: markdown
    output: mcpscan-report.md
```

## GitHub Code Scanning SARIF Upload

Repository code scanning must be enabled for SARIF uploads.

```yaml
name: MCP Security Scan

on: [push, pull_request]

permissions:
  contents: read
  security-events: write

jobs:
  mcpscan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Davidleeops/mcpscan@main
        with:
          target: ./mcp-config.json
          min-grade: B
          upload-sarif: "true"
```

## Local Equivalent

```bash
npx mcpscan scan ./mcp-config.json --ci --min-grade B --format markdown --output mcpscan-report.md
npx mcpscan scan ./mcp-config.json --format sarif --output mcpscan.sarif
```

## Notes

- The action currently uses `npx mcpscan`, so npm publishing must be complete before external users rely on it.
- Until a versioned release exists, examples use `@main`. Switch to semver tags such as `@v0.1.0` after release.
- For paid audits, keep sanitized configs in CI and exchange sensitive materials through a private channel.
