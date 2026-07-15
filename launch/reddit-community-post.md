# Reddit / Community Post Draft

Status: draft only. Do not post without same-turn approval.

Primary targets: r/mcp, security engineering communities, devtools communities, AI engineering communities.

## Title Options

- Looking for feedback: MCP production-readiness audit checklist and CLI
- How are you reviewing MCP server access before production rollout?
- MCPScan: mapping MCP tools, permissions, secrets, and reviewer evidence

## r/mcp Version

I am working on MCPScan, a small CLI and audit workflow for teams moving MCP from local experiments into production-like use.

The wedge is not "another generic scanner." It is the review artifact teams need once MCP servers start touching real systems: code, tickets, databases, CRM, cloud accounts, customer data, local files, or internal APIs.

The CLI currently scans a Claude Desktop style config, local server command, or remote HTTPS/SSE endpoint and produces findings with evidence/remediation. The first checks cover auth hints, secret patterns, URL-fetching/SSRF-style risk, prompt-injection language in tool descriptions, TLS/CORS for remote targets, default/example credentials, and report outputs for HTML/JSON/SARIF.

The audit framing is:

- Which MCP servers are installed?
- Which tools do they expose?
- What can those tools access or change?
- Which credentials, files, APIs, or data stores are reachable?
- Which findings need to be fixed before customer pilots, internal rollout, or enterprise review?

I am trying to make this useful as production-readiness/governance evidence, not just a local scan result.

Repo: https://github.com/Davidleeops/mcpscan
Sample report: https://davidleeops.github.io/mcpscan/sample-report.html

Questions for people building or operating MCP servers:

- What would make this credible enough to attach to an internal review?
- Which MCP-specific checks would you want before CI gating?
- Are there risk categories you see in real deployments that most scanners miss?

## Security / Devtools Version

I am looking for feedback on a narrow security problem: MCP servers are being connected to agents, code, tickets, databases, and internal APIs faster than teams are creating review evidence for them.

MCPScan is a CLI and fixed-scope audit workflow for MCP production-readiness. The goal is to help a team answer: "What can this agent actually access, and what should we fix before this reaches customers or internal users?"

The current CLI checks MCP configs, local server commands, and remote HTTPS/SSE endpoints. It produces JSON/table/HTML/SARIF findings with evidence and remediation. The first checks cover auth hints, exposed secrets, URL-fetching/SSRF-style risk, prompt-injection language in tool descriptions, TLS/CORS for remote targets, and default/example credentials.

This is deliberately not positioned as full pentesting or compliance certification. It is baseline governance evidence: inventory, permissions, reachable sensitive systems, risk-ranked findings, and a remediation checklist.

Repo: https://github.com/Davidleeops/mcpscan
Sample report: https://davidleeops.github.io/mcpscan/sample-report.html

I would appreciate critique from people who review developer tools, AI agent systems, or internal automation:

- What evidence would you expect before approving MCP in a production-like environment?
- What checks should be added first?
- Where would a scanner create false confidence unless the report is framed carefully?

## Short Comment Reply If Asked To Sell Less

Fair point. The useful framing is not "trust this scanner." It is "start with a concrete inventory and evidence trail before MCP tools get connected to real authority." I am trying to make the output honest about scope and useful for the next review conversation.
