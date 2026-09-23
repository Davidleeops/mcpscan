# MCPScan Founder Conversion Video Set

Date: 2026-09-23

Purpose: create an 11-video recording set the founder can record later as short Loom-style conversion assets. These videos support first revenue before the SaaS dashboard exists. They should point buyers toward fixed-scope MCP readiness audits, safe intake, and a clear purchase path.

## Recording Rules

- Keep each video between 45 seconds and 3 minutes unless noted.
- Record the actual public pages, sample report, secure intake page, CLI output, and delivery templates.
- Do not claim compliance certification, penetration testing, legal attestation, complete security, or guaranteed coverage.
- Do not request secrets, production credentials, customer data, private source code, or sensitive configs in a public channel.
- Lead with a buyer decision: approve, approve with guardrails, or block until fixes.
- Use the current product ladder: Quick Audit at $750, Launch Audit at $1,500, Enterprise Readiness at $3,500.
- Use the Launch Audit as the default recommendation for serious buyers preparing pilots, demos, internal rollout, or customer security review.
- Once live Stripe links exist, replace every "purchase link" mention with the relevant checkout link.

## Funnel Placement Map

| Funnel stage | Video |
| --- | --- |
| Cold outbound and founder posts | 1. The 90-second problem |
| Landing page hero | 2. What MCPScan does |
| Landing page proof section | 3. Local scan walkthrough |
| Landing page report section | 4. Sample report walkthrough |
| Buyer comparison page | 5. Why this is not just scanner output |
| Pricing section | 6. Which audit package fits |
| Secure intake page | 7. What to send and what not to send |
| Reply follow-up after interest | 8. What happens after payment |
| Objection handling | 9. Is this a pentest, scanner, or readiness audit |
| Enterprise or AppSec buyer proof | 10. How the report supports approval decisions |
| Post-call close and retargeting | 11. Founder close: what to do next |

## 1. The 90-Second Problem

**Target viewer:** founder, CTO, AI platform lead, security lead, or agency owner using MCP-connected agents.

**Goal:** make the buyer recognize the access problem and click into the landing page or audit page.

**Funnel placement:** cold outbound, LinkedIn founder post, short website embed near the hero, pinned community post.

**Runtime:** 60 to 90 seconds.

**Proof assets to show:**

- `landing/index.html` hero.
- Terminal block showing the local scan example.
- `landing/sample-report.html` executive summary.

**Script:**

```text
If your team is using MCP with Claude, Cursor, Copilot, VS Code, Slack, internal tools, databases, or customer workflows, the real question is not whether the agent can call tools. It is what those tools can reach.

MCP turns useful agent workflows into real access paths: code, files, tickets, chat, credentials, cloud, customer records, and internal APIs.

MCPScan is a fixed-scope readiness audit for that moment. We inventory the MCP servers and tools, classify read and write access, check risky auth and secret exposure patterns, review prompt-facing tool descriptions, and turn the findings into a report your engineering or security team can actually use.

The output is not a broad compliance certificate. It is a practical decision packet: what is in scope, what looks risky, what to fix first, and whether the setup is ready for rollout, buyer review, or a customer pilot.

If your MCP setup touches real systems, start with the sample report or book the Launch Audit.
```

**Screen actions:**

1. Open the MCPScan landing page.
2. Hover over the hero proof strip: A-F grade, reports, CI threshold, governance evidence.
3. Scroll to the terminal example.
4. Open the sample report in a new tab.

**CTA:** "Open the sample report, then choose the Launch Audit if MCP is tied to a real rollout or customer review."

## 2. What MCPScan Does

**Target viewer:** buyer who clicked from outbound and needs a simple product explanation.

**Goal:** convert curiosity into a clear mental model: local scan plus manual readiness audit.

**Funnel placement:** landing page hero, audit page top section, reply to "what is this?"

**Runtime:** 90 seconds.

**Proof assets to show:**

- `landing/index.html`.
- `landing/mcp-security-audit.html`.
- `docs/GO_TO_MARKET.md` offer summary if recording an internal explainer.

**Script:**

```text
MCPScan has two parts.

First, there is a local-first scanner. It looks at MCP configuration and tool exposure patterns, then produces structured output like JSON, HTML, Markdown, and SARIF. It is useful for a fast baseline and for CI-style readiness checks.

Second, there is a fixed-scope paid audit. That is for teams who need more than raw findings. In the audit, the scan output is reviewed against business context: which MCP servers are in scope, which tools can read, write, delete, execute, or call external networks, which auth and secret patterns matter, and which findings should be fixed before rollout.

The report is designed for a practical decision. It tells the team what the MCP setup can access, where the risky paths are, what should be fixed first, and what can be shared safely with engineering, AppSec, leadership, or a customer security reviewer.
```

**Screen actions:**

1. Show the hero claim.
2. Scroll to checks: access and auth, tooling exposure, input and output risk.
3. Open the audit page and show the fixed-scope positioning.

**CTA:** "Run the local scan for a baseline. Buy the audit when someone needs to make a rollout or customer security decision."

## 3. Local Scan Walkthrough

**Target viewer:** technical founder, engineer, platform lead, or security lead.

**Goal:** prove the tool is concrete and not just advisory copy.

**Funnel placement:** landing page proof section, docs, technical reply, community post.

**Runtime:** 2 to 3 minutes.

**Proof assets to show:**

- Landing page terminal example.
- Local CLI README.
- Sample fixture if recording from a development environment.

**Script:**

```text
Here is the fast baseline version of MCPScan.

The scanner runs locally by default. A typical command points MCPScan at a sanitized MCP config, applies a CI threshold if needed, and returns a grade plus findings.

The point is not to replace a full security program. The point is to catch MCP-specific risk patterns early: missing auth signals, unsafe input handling, dangerous tool descriptions, sensitive output patterns, broad permissions, and transport or configuration issues.

The scanner can produce output formats that engineering teams already know how to use: JSON for automation, HTML for review, Markdown for reports, and SARIF for security tooling.

For a small internal check, the CLI may be enough. When the setup is tied to a customer pilot, enterprise review, or production-like workflow, the paid audit adds manual validation, prioritization, and a buyer-safe report.
```

**Screen actions:**

1. Show the command example on the landing page.
2. Show the grade and findings lines.
3. Show report output options in the landing proof strip.
4. If recording from terminal, run a safe fixture only, never customer material.

**CTA:** "Use the CLI for baseline visibility. Use the audit when the result needs to become an approval artifact."

## 4. Sample Report Walkthrough

**Target viewer:** CTO, AppSec reviewer, engineering leader, founder, or customer security contact.

**Goal:** show what a buyer receives and why it is easier to act on than raw scanner output.

**Funnel placement:** sample report page, pricing page, follow-up after interest, retargeting.

**Runtime:** 2 to 3 minutes.

**Proof assets to show:**

- `landing/sample-report.html`.
- `delivery/customer-workspace-template/report-template.md`.
- `delivery/customer-workspace-template/findings-tracker.csv`.

**Script:**

```text
This is the shape of the paid audit deliverable.

At the top, the report gives the reader a quick executive read: grade, score, number of checks, open findings, and the priority items that should be fixed before production use or buyer acceptance.

Then it moves into the details security and engineering need: assessment metadata, severity counts, remediation priorities, and individual findings with evidence and recommended remediation.

This matters because MCP risk is not only a list of alerts. A team needs to know which server or tool is affected, why it matters, which owner should act, and what fix moves the rollout decision forward.

The report is also designed to be sanitized. It should help the team brief leadership, AppSec, or a customer reviewer without exposing raw secrets, private configs, or customer data.
```

**Screen actions:**

1. Open sample report.
2. Point to executive summary and grade.
3. Scroll to severity counts.
4. Scroll to remediation priority.
5. Open one detailed finding and highlight evidence plus recommendation.

**CTA:** "If you need this kind of decision packet for your MCP setup, choose the Launch Audit unless your scope is clearly smaller or broader."

## 5. Why This Is Not Just Scanner Output

**Target viewer:** buyer comparing free tools, internal checks, or generic scanners.

**Goal:** answer the main objection: why pay if a scanner exists?

**Funnel placement:** `#why-paid` section, objection reply, pricing follow-up.

**Runtime:** 90 seconds.

**Proof assets to show:**

- Landing page `why-paid` section.
- `docs/FIRST_REVENUE_BATTLECARD.md` proof-to-show section for internal preparation.
- Sample report remediation priority.

**Script:**

```text
You should run free scanner-style checks. They are useful for a baseline.

The reason to buy the MCPScan audit is the part that happens after the scan. The audit reviews the result against the actual rollout context: which MCP servers are approved, what each tool can access, whether actions are read-only or write-capable, whether secrets or sensitive outputs are exposed, and what evidence the team needs before a pilot or customer review.

Raw findings are easy to ignore or misread. The paid audit turns them into a practical packet: reviewed evidence, remediation priority, business impact, and a buyer-safe summary.

That is the difference. The scanner creates signals. The audit helps the team make a decision.
```

**Screen actions:**

1. Scroll to "Free scanners produce signals. The audit produces a decision packet."
2. Show the three cards: reviewed evidence, remediation priority, buyer-safe summary.
3. Jump to sample report priority list.

**CTA:** "Run the scanner for signal. Buy the audit when someone needs to approve, block, or add guardrails."

## 6. Which Audit Package Fits

**Target viewer:** qualified buyer deciding between packages.

**Goal:** remove pricing confusion and move the buyer toward the correct package.

**Funnel placement:** pricing section, sales replies, discovery call follow-up.

**Runtime:** 2 minutes.

**Proof assets to show:**

- Landing pricing section.
- `sales/one-page-scope.md`.
- `sales/discovery-call-script.md` package mapping.

**Script:**

```text
There are three fixed-scope audit options.

The Quick Audit is $750. It fits one small MCP setup, up to 3 MCP servers, one environment, and a written report in 3 business days.

The Launch Audit is $1,500. This is the default recommendation for most serious early buyers. It covers up to 8 MCP servers, 2 environments, a written report, a findings call, and one re-scan after fixes in 5 business days.

The Enterprise Readiness Audit is $3,500. It fits broader reviews with up to 15 MCP servers, 3 environments, an executive summary, a buyer-facing summary, a findings call, and one re-scan in 7 business days.

If your MCP setup touches source code, customer data, tickets, Slack, cloud, databases, or internal admin systems, do not over-optimize the package. Pick the package that matches the number of servers, environments, and decision makers who need the report.
```

**Screen actions:**

1. Scroll to pricing cards.
2. Highlight Quick, then Launch, then Enterprise.
3. Pause on Launch as the recommended default.
4. Show the disclaimer under pricing.

**CTA:** "Choose Quick for a small readout, Launch for a real rollout decision, and Enterprise Readiness when multiple environments or buyer review are involved."

## 7. What To Send And What Not To Send

**Target viewer:** paid buyer or serious prospect concerned about sensitive material.

**Goal:** reduce intake friction while preventing unsafe submissions.

**Funnel placement:** secure intake page, post-payment email, checkout thank-you page, pre-call reply.

**Runtime:** 2 minutes.

**Proof assets to show:**

- `landing/secure-intake.html`.
- `landing/intake.html`.
- `sales/post-payment-handoff.md`.

**Script:**

```text
Before sending anything for an MCPScan audit, start with sanitized materials whenever possible.

Good first materials include sanitized MCP configs with secrets removed, a list of servers and tools in scope, notes on which tools can read, write, delete, execute, or call external networks, and screenshots or exports of allowlists, registry settings, OAuth settings, or approval policies.

Do not send production credentials, active API keys, bearer tokens, OAuth secrets, SSH keys, customer data, private source code, or sensitive files through public GitHub issues or ordinary email.

If sensitive evidence is unavoidable, we confirm a private handoff path first. The preferred options are a customer-owned private repository, a customer-owned shared folder, or an encrypted archive with the password sent separately.

The audit should only review systems and materials the customer is authorized to submit for the agreed scope.
```

**Screen actions:**

1. Open secure intake page.
2. Show "Safe To Send First."
3. Show "Do Not Send Publicly."
4. Show "Private Handoff Path."
5. Show "Authorization Required."

**CTA:** "Start with sanitized intake. If sensitive evidence is needed, confirm a private handoff path first."

## 8. What Happens After Payment

**Target viewer:** buyer ready to purchase but worried about process.

**Goal:** explain post-payment handoff and reassure the buyer that delivery is bounded.

**Funnel placement:** checkout follow-up, thank-you page, abandoned checkout follow-up, sales reply.

**Runtime:** 90 seconds.

**Proof assets to show:**

- `landing/thank-you.html`.
- `sales/post-payment-handoff.md`.
- `docs/FIRST_AUDIT_DELIVERY_PACKET.md`.

**Script:**

```text
After payment, the next step is not to send a pile of sensitive files.

The first step is scope confirmation. We confirm the package, number of MCP servers, environments, delivery target, whether a findings call is included, and whether a re-scan is included.

Then we collect safe intake: sanitized configs, server and tool list, business context, known concerns, systems out of scope, and any deadline tied to rollout, customer review, or internal approval.

The delivery clock starts after intake is complete and safe. If sensitive evidence is needed, we agree on a private handoff path before reviewing it.

From there, the audit produces the report, remediation checklist, and any included findings call or re-scan.
```

**Screen actions:**

1. Show thank-you page.
2. Show post-payment handoff checklist.
3. Show delivery packet scope confirmation.
4. Show the quality gate list.

**CTA:** "After checkout, complete safe intake and scope confirmation so the delivery clock can start."

## 9. Is This A Pentest, Scanner, Or Readiness Audit

**Target viewer:** skeptical security buyer or engineering leader.

**Goal:** set claim boundaries and build trust.

**Funnel placement:** FAQ, objection reply, discovery call follow-up.

**Runtime:** 90 seconds.

**Proof assets to show:**

- Landing page disclaimer under pricing.
- `docs/FIRST_REVENUE_BATTLECARD.md` red lines.
- Secure intake authorization section.

**Script:**

```text
MCPScan is a readiness audit.

It is not a full penetration test. It is not compliance certification. It is not a legal opinion. It does not guarantee complete security.

The audit focuses on MCP configuration, exposed tools, risky permissions, governance evidence, and scan findings. It looks at the materials and systems the customer is authorized to submit for the agreed scope.

That boundary is useful. For teams adopting MCP quickly, the first decision is often practical: what servers exist, what tools can act, what credentials or data are reachable, what findings matter most, and what needs fixing before rollout or buyer review.

If the team needs exploit-style testing, formal compliance work, or remediation implementation, that should be scoped separately.
```

**Screen actions:**

1. Show pricing disclaimer.
2. Show red lines from the battlecard.
3. Show authorization required on secure intake.

**CTA:** "Use MCPScan when you need a focused readiness decision. Scope separate work if you need testing beyond that boundary."

## 10. How The Report Supports Approval Decisions

**Target viewer:** AppSec, platform engineering, customer security, or leadership.

**Goal:** position the report as an approval artifact, not just a technical artifact.

**Funnel placement:** enterprise follow-up, sample report page, sales call screen share.

**Runtime:** 2 minutes.

**Proof assets to show:**

- Sample report executive summary.
- Sample report remediation priority.
- Delivery report structure in `docs/FIRST_AUDIT_DELIVERY_PACKET.md`.

**Script:**

```text
The best use of this report is an approval decision.

For MCP rollouts, teams usually need one of three outcomes: approve the setup, approve it with guardrails, or block it until specific fixes are complete.

The report is structured for that decision. It starts with the executive summary and scope, then shows the MCP server inventory, risk overview, findings by severity, prioritized remediation checklist, CI or readiness recommendation, re-scan plan, and out-of-scope notes.

Each finding includes the title, severity, affected server or tool, evidence, business impact, remediation, owner suggestion, and status.

That gives engineering a fix list, security a review record, and leadership or customer-facing teams a safer way to explain what changed without exposing raw configs or secrets.
```

**Screen actions:**

1. Show sample report executive summary.
2. Scroll to remediation priority.
3. Show one detailed finding.
4. Open delivery packet report structure.

**CTA:** "If an MCP rollout needs an approve, guardrail, or block decision, the Launch Audit is usually the right starting point."

## 11. Founder Close: What To Do Next

**Target viewer:** warm prospect, retargeted visitor, or buyer after a discovery reply.

**Goal:** make the next step simple and direct.

**Funnel placement:** final CTA, sales follow-up, post-call recap, retargeting.

**Runtime:** 45 to 75 seconds.

**Proof assets to show:**

- Landing final CTA.
- Pricing section.
- Secure intake page.

**Script:**

```text
If your team is connecting agents to real tools through MCP, the next step is simple.

If you just want a fast technical baseline, run the local scan.

If someone has to make a decision about rollout, a customer pilot, enterprise review, or production-like access, choose the audit package that matches your scope.

Quick Audit is for a small setup. Launch Audit is the default for a real rollout decision. Enterprise Readiness is for broader governance or buyer review.

After payment, start with safe intake. Do not send secrets or production credentials publicly. We confirm the scope, review the materials, deliver the report, and use the findings call or re-scan if your package includes them.

The goal is straightforward: know what your MCP setup can access and what to fix first.
```

**Screen actions:**

1. Show final CTA section.
2. Scroll to pricing.
3. Click secure intake.
4. End on the sample report or Launch Audit card.

**CTA:** "Choose the package that matches the scope, then complete safe intake."

## Asset Capture Checklist

Record these supporting screenshots or clips once before recording the founder takes:

- Landing page hero and terminal example.
- Checks section with access/auth, tooling exposure, input/output risk.
- Sample report executive summary.
- Sample report severity counts and remediation priority.
- Sample report detailed finding with evidence and remediation.
- Pricing cards.
- Pricing disclaimer.
- Secure intake safe-to-send section.
- Secure intake do-not-send-publicly section.
- Secure intake private handoff section.
- Thank-you page or post-payment handoff page.

## Suggested Deployment

| Video | Primary placement | Secondary placement |
| --- | --- | --- |
| 1 | LinkedIn founder post | Landing hero embed |
| 2 | Landing hero embed | Audit page |
| 3 | Technical proof section | GitHub README |
| 4 | Sample report page | Pricing follow-up |
| 5 | Why paid section | Objection reply |
| 6 | Pricing section | Discovery follow-up |
| 7 | Secure intake page | Post-payment email |
| 8 | Thank-you page | Abandoned checkout follow-up |
| 9 | FAQ or audit page | Security buyer reply |
| 10 | Enterprise follow-up | Sales call screen share |
| 11 | Final CTA section | Post-call recap |

## Production Priority

Record in this order for fastest conversion coverage:

1. The 90-second problem.
2. Sample report walkthrough.
3. Which audit package fits.
4. What to send and what not to send.
5. Founder close.
6. What MCPScan does.
7. Local scan walkthrough.
8. Why this is not just scanner output.
9. What happens after payment.
10. Is this a pentest, scanner, or readiness audit.
11. How the report supports approval decisions.
