# MCPScan Quiz Funnel Segmentation

## Purpose

The quiz exists to turn cold or semi-warm traffic into a useful path before the visitor sees a generic purchase choice. It follows the quiz-funnel pattern from the supplied video:

- Ask about the visitor first.
- Use answers to identify the decision, rollout stage, access risk, tool authority, and timing.
- Return a tailored result page instead of one sales page for everyone.
- Route buyers to the right audit scope while giving non-buyers a useful self-serve step.
- Collect email before revealing the result, then generate a segment-specific follow-up packet.

## Segments

| Segment | Buyer state | Primary offer | Buyer-facing angle |
| --- | --- | --- | --- |
| Enterprise proof | Customer security, compliance, procurement, or leadership needs evidence | Enterprise Readiness or scoped Launch Audit | Buyer-safe evidence, authorization boundaries, sanitized reporting |
| Launch readiness | Team is close to pilot, demo, internal rollout, or production-like MCP use | MCP Launch Audit | Fast decision packet, risk-ranked findings, re-scan after fixes |
| Agency delivery | Operator builds AI workflows for clients | Quick Audit or Launch Audit | Client trust, safe intake, repeatable handoff language |
| Self-serve scanner | Engineer or maintainer wants technical proof first | Free CLI and sample report | Local scan, CI threshold, SARIF, proof before paid review |

## Segment Artifacts

| Segment | Artifact | Right move |
| --- | --- | --- |
| Enterprise proof | Enterprise MCP proof packet | Email result to MCPScan and request Enterprise Readiness or a scoped Launch Audit |
| Launch readiness | MCP launch readiness plan | Email result to MCPScan and request Launch Audit scope |
| Agency delivery | Agency handoff safety checklist | Email result to MCPScan and start with Quick Audit or Launch Audit |
| Self-serve scanner | Self-serve scanner starter | Open the sample report, run the CLI, then escalate when sensitive systems are involved |

## Questions

1. Decision the visitor needs to make.
2. MCP rollout stage.
3. Most sensitive access involved.
4. Whether connected tools can make changes.
5. Timeline for the next decision.

After the fifth answer, the page asks for email. The static page reveals the result locally and builds a prefilled email to `security@getmcpscan.xyz` so the lead can send the result packet without pasting secrets or private configuration.

## Routing Rules

The quiz uses additive scoring across four segment keys:

- `enterprise`
- `launch`
- `agency`
- `selfServe`

The highest score controls the result. Ties are acceptable because adjacent segments still receive a relevant next step. The order of questions intentionally starts with the visitor's decision, then moves into rollout stage, access, authority, and timing.

## Why This Fits MCPScan

MCPScan buyers are not separated only by company size. The better segmentation signal is the decision they need to make:

- Can we launch this MCP setup?
- Can we show a customer or security reviewer credible evidence?
- Can we hand off a client workflow safely?
- Can I run the scanner myself first?

That structure keeps the funnel consultative and filters out low-fit visitors without hiding the free CLI.
