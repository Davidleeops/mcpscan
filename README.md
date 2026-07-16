# MCPScan

[![MCP readiness: sample](https://img.shields.io/endpoint?url=https%3A%2F%2Fdavidleeops.github.io%2Fmcpscan%2Fbadge.json)](docs/BADGE.md)

Scan your MCP servers in 30 seconds and collect production-readiness evidence.

MCPScan is a free CLI security scanner and audit-readiness toolkit for Model Context Protocol servers. Point it at a Claude Desktop style MCP config, a local server command, or a remote HTTPS/SSE endpoint and get an A-F grade with actionable findings, remediation notes, and CI-friendly evidence.

## Launch / First Revenue

The first-revenue motion is a fixed-scope MCP readiness audit, supported by the CLI, public sample report, intake pages, and local launch consoles.

Start here:

- [Founder approval packet](ops/FOUNDER_APPROVAL_PACKET.md)
- [Launch cockpit](ops/launch-cockpit.html)
- [GitHub issue action board](ops/GITHUB_ISSUE_ACTION_BOARD.md)
- [Public landing page](https://davidleeops.github.io/mcpscan/)
- [Sample report](https://davidleeops.github.io/mcpscan/sample-report.html)
- [Secure intake guidance](https://davidleeops.github.io/mcpscan/secure-intake.html)

Current launch verification:

```bash
npm run launch:verify
```

Expected pre-approval warnings are checkout links, custom domain, and custom security email until the founder-only clicks are complete.

```bash
npx mcpscan scan ./claude_desktop_config.json
npx mcpscan scan --server "npx -y @modelcontextprotocol/server-filesystem /tmp"
npx mcpscan scan --url https://mcp.example.com/sse
npx mcpscan report ./scan-results.json --format html --output report.html
npx mcpscan scan ./mcp-config.json --format sarif --output mcpscan.sarif
```

## What It Checks Today

This MVP ships the CLI first:

- `AUTH-001`: no authentication hints detected
- `AUTH-002`: bearer/API token validation cannot be confirmed
- `AUTH-003`: API key exposure in URL, command, or static config
- `AUTH-004`: static session or token reuse indicators
- `INPUT-001`: command-injection prone tool arguments
- `INPUT-002`: SQL-injection prone tool arguments
- `INPUT-003`: path-traversal prone file arguments
- `INPUT-004`: URL-fetching tool SSRF risk
- `INPUT-005`: weak argument-shape constraints
- `OUTPUT-001`: secret and sensitive data patterns
- `OUTPUT-002`: excessive data exposure
- `OUTPUT-003`: error disclosure and stack-trace indicators
- `TRANSPORT-001`: TLS probe for remote HTTPS targets
- `TRANSPORT-002`: stdio process-isolation heuristics
- `TRANSPORT-003`: SSE/WebSocket origin validation heuristics
- `TOOL-001`: tool description prompt-injection language
- `TOOL-002`: excessive permission language
- `TOOL-003`: shadow-tool impersonation language
- `TOOL-004`: tool-name collision detection
- `CONFIG-001`: overly permissive CORS for URL targets
- `CONFIG-002`: debug-mode indicators
- `CONFIG-003`: default or example credentials

Each finding includes evidence, remediation, and MCP security references.

## CLI

```bash
mcpscan scan <config-or-server>
  --checks auth,input,output
  --severity critical,high
  --format json|table|html|markdown|sarif
  --output ./report.json
  --ci
  --min-grade B
  --timeout 30
  --verbose
  --no-color
```

## CI

```yaml
name: MCP Security Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Davidleeops/mcpscan@main
        with:
          target: ./mcp-config.json
          min-grade: B
```

See `docs/GITHUB_ACTION.md` for SARIF/code-scanning upload examples.

## Landing Page

A minimal static commercial landing page is available in `landing/`. See
`landing/README.md` for local preview and deployment options, and
`docs/LANDING_PAGE.md` for the pre-publish checklist.

## Why Now

MCP adoption is accelerating, but many servers expose powerful tools through weak auth, broad filesystem/network access, and unsafe prompt-facing tool metadata. MCPScan is built to become the independent, developer-friendly path from local MCP scans to production-readiness audits, OWASP MCP Top 10 coverage, NSA advisory alignment, and buyer-facing governance evidence.

## Comparison

| Tool | A-F grade | Free local CLI | Dashboard-ready reports | CI threshold |
| --- | --- | --- | --- | --- |
| MCPScan | Yes | Yes | JSON/HTML/Markdown/SARIF now, SaaS later | Yes |
| Snyk Agent Scan | Enterprise-focused | Limited | Yes | Yes |
| Cisco mcp-scanner | No | Yes | No | Basic |
| Promptfoo | Eval-focused | Yes | Eval reports | Partial |

## Development

```bash
npm install
npm test
npm run build
node packages/cli/dist/index.js scan packages/cli/test/fixtures/vulnerable-config.json
```

The CLI does not send scan results anywhere. The future dashboard should only receive reports through an explicit upload/API action.
