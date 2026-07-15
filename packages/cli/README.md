# MCPScan CLI

Security scanner for Model Context Protocol servers.

```bash
npx mcpscan scan ./claude_desktop_config.json
npx mcpscan scan --server "npx -y @modelcontextprotocol/server-filesystem /tmp"
npx mcpscan scan --url https://mcp.example.com/sse
```

The CLI runs locally, produces an A-F grade, and never uploads results unless an explicit upload/API feature is added and requested by the user.

It currently runs 22 heuristic checks across authentication, input handling,
output disclosure, transport, tooling, and configuration. Checks are safe by
default and do not perform active exploitation.
