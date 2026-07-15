# LinkedIn Founder Post Draft

Status: draft only. Do not post without same-turn approval.

## Post

MCP is crossing a line that security teams care about.

It starts as a local developer workflow. Then the same pattern gets connected to repositories, tickets, docs, databases, CRM, cloud accounts, customer data, and internal APIs.

At that point, the important question is not "did we scan it?"

It is:

What can this agent actually access?

That is the problem I am working on with MCPScan.

MCPScan is a CLI and audit workflow for MCP production-readiness. It helps teams create a clean review artifact before an internal rollout, customer pilot, enterprise security review, or procurement conversation.

The first version focuses on evidence a reviewer can actually use:

- MCP server and tool inventory.
- Risky permissions and exposed capabilities.
- Secret and sensitive data patterns.
- Auth, TLS, and CORS checks where applicable.
- Prompt-injection risk in tool descriptions.
- Remediation steps and CI-friendly report output.

This is not a replacement for a full security program or pentest. It is a practical baseline for teams asking: "Are we comfortable connecting this MCP setup to real systems?"

I am looking for a small number of teams using MCP in production-like environments, customer pilots, or internal agent rollouts who want a fixed-scope readiness audit.

Good fit:

- AI product teams adding MCP integrations.
- Devtool startups with agents near code or CI.
- Agencies handing MCP workflows to clients.
- B2B SaaS teams connecting agents to internal data.
- Security-conscious teams preparing for enterprise review.

The deliverable is simple: inventory, risk-ranked findings, remediation checklist, and a short findings walkthrough.

If MCP is becoming part of your product or internal platform, the review artifact should exist before the customer asks for it.

## First Comment

Repo/sample report: https://github.com/Davidleeops/mcpscan / https://davidleeops.github.io/mcpscan/sample-report.html

I am especially interested in what evidence buyers, security reviewers, and platform teams would expect before approving MCP-connected tools.
