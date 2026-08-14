# MCPScan Methodology and Limitations

Generated: 2026-08-14

MCPScan is a fixed-scope MCP readiness audit. It helps teams decide whether an MCP setup should be approved, approved with guardrails, or blocked until remediation.

## Methodology

MCPScan reviews customer-authorized materials, including:

- MCP server lists
- sanitized MCP configs
- server and tool metadata
- exposed tool capabilities
- environment and permission boundaries
- authentication and secret-handling evidence
- admin policy screenshots or exports
- MCPScan CLI output where applicable
- customer-provided business context

The audit looks for:

- exposed read, write, delete, execute, send, deploy, or network actions
- broad filesystem or cloud access
- credential and secret-handling risk
- risky server provenance or unpinned runtime behavior
- prompt-injection and tool-description exposure
- insufficient approval or allowlist controls
- unclear ownership, logging, monitoring, or rollback paths

## Evidence Types

Use these labels in reports:

| Label | Meaning |
| --- | --- |
| Observed | Directly visible in provided config, output, screenshot, or policy export |
| Inferred | Reasonable conclusion from available evidence, but not directly proven |
| Customer-stated | Provided by the customer, not independently verified |
| CLI heuristic | Detected by MCPScan CLI logic and manually reviewed |
| Not reviewed | Outside the agreed scope or not provided |

## Limitations

MCPScan is not:

- a full penetration test
- a compliance certification
- legal advice
- a guarantee of complete security
- a review of systems outside the agreed scope
- approval for production launch after later changes

Any material change to MCP servers, tools, credentials, policies, clients, environments, or connected systems may require re-assessment.

## Customer Data Rule

MCPScan should not need production credentials, active tokens, unrelated customer data, or private source code for the first review. If sensitive evidence is required, pause and confirm a private handoff path before receiving it.
