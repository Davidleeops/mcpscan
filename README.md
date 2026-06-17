# MCPScan

Scan your MCP servers in 30 seconds.

MCPScan is a free CLI security scanner for Model Context Protocol servers. Point it at a Claude Desktop style MCP config, a local server command, or a remote HTTPS/SSE endpoint and get an A-F grade with actionable findings.

```bash
npx mcpscan scan ./claude_desktop_config.json
npx mcpscan scan --server "npx -y @modelcontextprotocol/server-filesystem /tmp"
npx mcpscan scan --url https://mcp.example.com/sse
npx mcpscan report ./scan-results.json --format html --output report.html
```

## What It Checks Today

This MVP ships the CLI first:

- `AUTH-001`: no authentication hints detected
- `INPUT-004`: URL-fetching tool SSRF risk
- `OUTPUT-001`: secret and sensitive data patterns
- `TRANSPORT-001`: TLS probe for remote HTTPS targets
- `TOOL-001`: tool description prompt-injection language
- `CONFIG-001`: overly permissive CORS for URL targets
- `CONFIG-003`: default or example credentials

Each finding includes evidence, remediation, and MCP security references.

## CLI

```bash
mcpscan scan <config-or-server>
  --checks auth,input,output
  --severity critical,high
  --format json|table|html
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
      - run: npx mcpscan scan ./mcp-config.json --ci --min-grade B
```

## Why Now

MCP adoption is accelerating, but many servers expose powerful tools through weak auth, broad filesystem/network access, and unsafe prompt-facing tool metadata. MCPScan is built to become the independent, developer-friendly scanner for MCP server security audits, OWASP MCP Top 10 coverage, NSA advisory alignment, and EU AI Act documentation workflows.

## Comparison

| Tool | A-F grade | Free local CLI | Dashboard-ready reports | CI threshold |
| --- | --- | --- | --- | --- |
| MCPScan | Yes | Yes | JSON/HTML now, SaaS later | Yes |
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
