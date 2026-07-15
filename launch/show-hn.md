# Show HN Draft

Status: draft only. Do not post without same-turn approval.

## Title Options

- Show HN: MCPScan - production-readiness checks for MCP servers
- Show HN: I built a CLI to audit MCP server access before production rollout
- Show HN: MCPScan maps MCP tools, risky permissions, and evidence for review

## Recommended Post

Hi HN,

I built MCPScan, a CLI for teams starting to connect MCP servers to real tools, credentials, repositories, databases, ticketing systems, and internal APIs.

The problem I kept running into: MCP setups can move from local experiment to customer pilot quickly, but the review artifact is often missing. Before an enterprise customer, internal security reviewer, or CTO asks "what can this agent actually access?", the team needs a clean inventory and a short fix list.

MCPScan is aimed at that production-readiness gap. It scans a Claude Desktop style config, a local MCP server command, or a remote HTTPS/SSE endpoint and produces an A-F grade plus findings with evidence and remediation.

The current checks cover:

- Server/tool inventory and risky exposed capabilities.
- Authentication hints.
- Secret and sensitive data patterns.
- URL-fetching and SSRF-style risk.
- Prompt-injection language in tool descriptions.
- TLS and permissive CORS checks for remote targets.
- Default or example credentials.
- JSON, table, HTML, and SARIF output for CI/review workflows.

This is not a claim of complete security or a replacement for a full pentest. The goal is more practical: give teams a reviewer-friendly baseline before MCP is connected to production-like data or shown to customers.

I am also offering a small number of fixed-scope MCP production-readiness audits for teams using MCP in customer pilots or internal rollouts. The audit combines MCPScan output with manual review and delivers an inventory, risk-ranked findings, and a remediation checklist.

Repo: https://github.com/Davidleeops/mcpscan
Sample report: https://davidleeops.github.io/mcpscan/sample-report.html

I would especially appreciate feedback from people running MCP servers in production-like environments:

- What evidence would your security/customer review expect?
- Which MCP risks are hardest to explain internally?
- What checks should be added before this becomes CI-gating?

## Comment Follow-Up If Someone Asks "How Is This Different From A Generic Scanner?"

The emphasis is MCP-specific review evidence, not generic vuln scanning. The report is meant to answer practical governance questions: which MCP servers are installed, which tools they expose, what credentials or systems are reachable, and what should be fixed before a pilot/customer/security review.

## Comment Follow-Up If Someone Asks About False Confidence

That is a fair concern. The CLI should be treated as a baseline and evidence generator, not a complete assurance claim. For production or enterprise review, I would pair it with manual context: what each tool can do, which credentials are in scope, what data is reachable, and whether the runtime controls match the business risk.
