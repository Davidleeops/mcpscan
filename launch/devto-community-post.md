# Dev.to / Community Article Draft

Status: draft only. Do not publish without same-turn approval.

## Title Options

- MCP Needs Production-Readiness Evidence, Not Just Local Experiments
- What To Review Before MCP Servers Touch Real Credentials
- A Practical MCP Production-Readiness Checklist

## Article

Model Context Protocol adoption is moving quickly. That is good for developer experience, but it creates a review problem once MCP servers move beyond local experiments.

An MCP server connected to disposable test data is one thing. An MCP setup connected to repositories, tickets, databases, customer records, cloud accounts, CRM, or internal APIs is another.

At that point, the team needs to answer a direct question:

What can this agent actually access?

That answer should not live only in someone's head or in a half-remembered config file. It should be a small review artifact that engineering, security, leadership, or an enterprise customer can inspect.

## The Production-Readiness Questions

Before MCP is used in a production-like environment, I would want evidence for:

- Which MCP servers are installed.
- Which tools each server exposes.
- What each tool can read, write, change, or trigger.
- Which credentials, files, APIs, databases, tickets, docs, and customer systems are reachable.
- Whether authentication and transport assumptions are acceptable.
- Whether tool descriptions contain prompt-injection bait or unsafe instructions.
- Whether secrets or sensitive values appear in config, output, logs, or reports.
- Which findings must be fixed before rollout.

This is governance work, but it should feel useful to developers. The goal is not paperwork. The goal is to make risk visible while the setup is still easy to change.

## Why A Generic Scanner Is Not Enough

MCP risk is partly technical and partly contextual.

A scanner can detect useful signals: default credentials, missing auth hints, suspicious tool descriptions, URL-fetching behavior, permissive CORS, TLS issues, secret patterns, or reportable finding evidence.

But the most important review question is often about authority:

- Can this tool read source code?
- Can it write to a ticketing system?
- Can it query production data?
- Can it call internal APIs?
- Can it trigger customer-visible actions?
- Can it see credentials that let it do more than intended?

That is why MCP review should combine automated checks with a short manual inventory of what the tool can actually access.

## What I Am Building

I am building MCPScan, a CLI and audit workflow for MCP production-readiness.

The CLI can scan a Claude Desktop style MCP config, a local MCP server command, or a remote HTTPS/SSE endpoint. It produces findings with evidence and remediation, and can output JSON, table, HTML, or SARIF for CI and review workflows.

The current checks include:

- Authentication hints.
- Secret and sensitive data patterns.
- URL-fetching and SSRF-style risk.
- Prompt-injection language in tool descriptions.
- TLS checks for remote HTTPS targets.
- Permissive CORS checks.
- Default or example credentials.

The larger goal is not just "scan and grade." It is to help teams create a credible review artifact:

- Server/tool inventory.
- Risk-ranked findings.
- Evidence.
- Business impact.
- Remediation checklist.
- Re-scan after fixes when needed.

## Where This Fits

MCPScan is not a full pentest, compliance certification, or guarantee that an agent is safe.

It is meant to be the first baseline before:

- Customer pilots.
- Internal agent rollouts.
- Enterprise security review.
- Procurement questionnaires.
- Agency client handoff.
- CI gating for MCP configs.

If the MCP setup touches real credentials or production-like data, the team should be able to show what was reviewed and what was fixed.

## Feedback Wanted

I am looking for feedback from developers, security engineers, AI platform teams, and founders building with MCP.

Repo: https://github.com/Davidleeops/mcpscan
Sample report: https://davidleeops.github.io/mcpscan/sample-report.html

The questions I am trying to answer next:

- What evidence would make an MCP review artifact useful inside your company?
- Which checks should be mandatory before CI gating?
- Where are the biggest gaps between local MCP experiments and production-ready MCP usage?
- What risks are easy to miss when a tool looks harmless in isolation?

If you are already using MCP in a customer pilot, internal workflow, or production-like environment, I would be glad to compare notes.
