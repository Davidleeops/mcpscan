# MCPScan Operating Plan

MCPScan should reach revenue before the dashboard exists. The first commercial product is a paid security audit delivered with the CLI, a polished report, and a remediation walkthrough.

## Objective

Ship a credible MCP security scanner and sell the first paid audits as a productized service.

Primary offer:

- MCP Quick Audit: $750, 3 business day turnaround, up to 3 MCP servers in 1 environment, written report, remediation checklist.
- MCP Launch Audit: $1,500, 5 business day turnaround, up to 8 MCP servers across 2 environments, written report, 30-minute findings call, 1 re-scan.
- MCP Enterprise Readiness Audit: $3,500, 7 business day turnaround, up to 15 MCP servers across 3 environments, executive summary, buyer-facing security summary, findings call, 1 re-scan.

## Throughput Model

The CLI is the leverage layer. Human time should only be used for:

- interpreting ambiguous findings
- prioritizing business impact
- packaging evidence
- walking customers through remediation

Everything else should be automated or templated.

## Build Tracks

### Track 1: Scanner Credibility

Target: 22 checks with clear evidence and remediation.

Required before paid launch:

- authentication/config checks
- bearer/API token validation heuristics
- session/token reuse heuristics
- tool metadata poisoning checks
- broad filesystem/network permission heuristics
- URL/SSRF risk checks
- stdio isolation and browser-origin transport checks
- secret leakage checks
- stack trace/error disclosure checks
- CI threshold support

Definition of done:

- vulnerable fixture grades F
- secure fixture grades A/B
- every failing check includes evidence, remediation, and references
- all checks work offline for config/stdio scans

### Track 2: Paid Report

Target: a report a buyer would forward internally.

Required before paid launch:

- executive summary
- grade and score
- finding counts by severity
- prioritized remediation
- customer/auditor metadata
- timestamp and target
- clean HTML output

Definition of done:

- one command produces a buyer-ready HTML report
- JSON remains machine-readable
- CI output remains concise

### Track 3: Launch And Sales

Target: accept money before SaaS.

Required before paid launch:

- landing page or README-backed checkout page
- Stripe Payment Links for the three service tiers
- sample report
- outbound scripts
- audit scope document
- fulfillment runbook

Definition of done:

- prospect can buy without a sales call
- buyer knows what is included
- delivery process is repeatable

### Track 4: Distribution

Target: make the free CLI easy to try and trust.

Required before paid launch:

- npm package published
- GitHub repo public
- CI workflow green
- release process documented
- package provenance or trusted publishing path documented

Definition of done:

- `npx mcpscan scan ./config.json` works from npm
- repo has README, sample fixtures, and CI
- release can be repeated safely

## First-Revenue Sequence

1. Finish scanner checks and report polish.
2. Publish npm package.
3. Generate one sample vulnerable report and one clean report.
4. Create Stripe Payment Links.
5. Publish a single-page offer.
6. Send 100 targeted outbound messages.
7. Deliver first paid audit manually.
8. Turn first delivery into the public sample and testimonial request.
9. Add the dashboard only after repeat demand appears.

## Fulfillment Workflow

1. Customer submits MCP config, command, repo link, or remote URL.
2. Run local scan.
3. Review findings manually for false positives.
4. Add auditor notes and business impact.
5. Export HTML report and JSON evidence.
6. Add CI workflow snippet customized to customer threshold.
7. Send report and remediation summary.
8. Offer walkthrough call.
9. Follow up after remediation for rescan.

## Dashboard Gate

Do not build full SaaS until at least one of these happens:

- 5 paid audit customers
- 100 GitHub stars
- 500 npm downloads
- 3 customers ask for ongoing monitoring

Dashboard v1 should only include:

- uploaded scan history
- shareable report link
- badge SVG
- API key
- Stripe subscription status

## Immediate Backlog

P0:

- keep the 22-check set stable and reduce false positives
- polished HTML report
- release workflow
- sample report
- Stripe offer copy

P1:

- landing page
- badge generator stub
- PDF export
- GitHub Action marketplace packaging
- public comparison page

P2:

- Supabase dashboard
- scheduled scans
- Slack/Discord webhooks
- team seats
- compliance PDF templates
