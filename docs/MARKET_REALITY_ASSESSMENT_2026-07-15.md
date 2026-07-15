# MCPScan Market Reality Assessment

Date: July 15, 2026

## Verdict

This is still a real opportunity, but the original "SSL Labs for MCP" wedge is no longer empty.

The market has moved. MCP security is now active enough to have:

- large-vendor entrants
- open-source scanner saturation
- OWASP MCP-specific guidance
- NSA guidance
- public exploit/writeup activity
- buyer conversations around auth, permissions, tool governance, and auditability

The opportunity is not "another MCP scanner." The stronger opportunity is:

> MCP security review, governance, and audit evidence for teams adopting agent tools in production.

The free CLI is still useful as the distribution wedge. The paid product should be positioned as a combination of:

- MCP inventory
- tool risk review
- CI/security gate
- paid audit report
- remediation workflow
- eventually runtime governance/control

## Market Attractiveness

### Why This Is Real

1. MCP has moved from experimental tooling into enterprise/security discussion.
2. Security concerns are specific and urgent: tool poisoning, overly broad tool permissions, secrets exposure, weak auth, prompt injection becoming tool action, and missing audit trails.
3. Buyers are asking for governance, not just vulnerability lists.
4. Big security vendors have entered, validating budget and urgency.
5. Open-source scanners are noisy/inconsistent, leaving room for evidence quality and workflow.

### Why It Is Risky

1. Basic scanning is crowded.
2. Snyk, Cisco, Proofpoint, Nightfall, Enkrypt, Promptfoo, StackHawk, Ant Group, and others are already active.
3. MCP scanner accuracy/reliability is now a known issue.
4. Buyers may expect this to live inside existing AppSec, DLP, AI gateway, or identity platforms.
5. The `MCPScan` name itself is crowded; `mcpscan.ai` exists and Ant Group has an MCPScan project.

## Competitor Landscape

| Player | Type | Market Meaning |
| --- | --- | --- |
| [Snyk Agent Scan](https://github.com/snyk/agent-scan) / Invariant MCP-Scan | OSS plus Snyk platform | Strongest named incumbent. Validates demand, but makes generic scanner positioning weaker. |
| [Cisco MCP Scanner](https://github.com/cisco-ai-defense/mcp-scanner) | OSS plus Cisco AI Defense | Serious scanner with YARA, LLM-as-judge, behavioral/code scanning, and enterprise motion. |
| [Promptfoo MCP security testing](https://www.promptfoo.dev/docs/red-team/mcp-security-testing/) | Red-team/eval platform | Strong substitute for teams already testing LLM/agent behavior. |
| [Ant Group MCPScan](https://github.com/antgroup/MCPScan) / [MCP Security](https://github.com/antgroup/MCP-Security) | OSS scanner | Credible scanner with static/dynamic analysis. Also creates naming conflict. |
| [MCP Guard](https://github.com/SaravanaGuhan/mcp-guard) and MCPWatch variants | OSS scanners | Shows open-source saturation. Some scanner projects themselves have had security advisories. |
| [Trail of Bits mcp-context-protector](https://github.com/trailofbits/mcp-context-protector) | Runtime wrapper | Important substitute: teams may prefer enforcement over pre-scan reports. |
| [Enkrypt AI MCP Scanner](https://www.enkryptai.com/product/mcp-scanner) | Commercial platform | Close to enterprise governance positioning. |
| [Proofpoint AI MCP Security](https://www.proofpoint.com/us/products/ai-mcp-security) | Commercial platform | Large-vendor enterprise governance motion. |
| [Nightfall MCP Security](https://www.nightfall.ai/products/mcp-security) | Commercial platform | DLP/data-security angle for MCP discovery/cataloging. |
| [StackHawk MCP security testing](https://www.stackhawk.com/use-case/mcp-server-security-testing/) | Commercial DAST | AppSec vendors can absorb MCP as another protocol target. |

GitHub signal as of July 15, 2026:

- `snyk/agent-scan`: about 2.8k stars.
- `cisco-ai-defense/mcp-scanner`: about 1k stars.
- `antgroup/MCPScan`: about 225 stars.

## Standards And Demand Signals

Important standards/source signals:

- [OWASP MCP Top 10](https://owasp.org/www-project-mcp-top-10/) frames protocol-specific security risks.
- [OWASP MCP Tool Poisoning](https://owasp.org/www-community/attacks/MCP_Tool_Poisoning) explains tool metadata as an indirect prompt injection vector.
- [NSA MCP Security Design Considerations](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/4496698/nsa-releases-security-design-considerations-for-ai-driven-automation-leveraging/) is a strong official demand signal.
- [CSA MCP Security Resource Center](https://labs.cloudsecurityalliance.org/mcp/) and [ModelContextProtocol-Security audit-db](https://github.com/ModelContextProtocol-Security/audit-db) show structured audit/compliance activity forming.
- [Microsoft's agent security post](https://www.microsoft.com/en-us/security/blog/2026/06/30/securing-ai-agents-ai-tools-move-from-reading-acting/) captures the core issue: agents do not only read; they act.

## What Buyers Are Actually Talking About

The strongest buyer pain is not "I need a scanner." It is:

- "Can we safely approve MCP for production?"
- "What can this agent actually call?"
- "Which MCP servers/tools are installed across developer machines?"
- "Can we enforce default-deny or least privilege?"
- "Can we attribute tool calls to the human/operator?"
- "Can we show audit evidence to security, compliance, or an enterprise customer?"
- "What happens if a tool description changes after approval?"
- "How do we stop secrets/customer data from leaking through tool calls?"

Useful discussion surfaces:

- MCP spec discussions around [permissions](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2498), [gateway auth](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/804), [authentication](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/64), and [upstream identity](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/1827).
- Reddit r/mcp discussions about production auth, corporate MCP deployment, and tool-call security.
- Hacker News threads around prompt injection, GitHub MCP exploitation, and file/data exfiltration.
- Security vendor blogs from Microsoft, Elastic, Stacklok, TrueFoundry, and others.

## Best Customer Profile

Best first buyers:

1. AI/devtool startups using MCP in a customer-facing product.
2. Internal platform teams allowing Claude/Cursor/Codex-style tools in engineering.
3. Agent agencies building workflows that touch GitHub, Slack, databases, tickets, or customer data.
4. B2B SaaS startups going through enterprise security review.
5. AppSec teams asked to approve MCP servers without a mature checklist.

Avoid first:

- hobby MCP projects
- security buyers needing formal compliance certification
- teams with no credentials/data exposure
- companies already deeply committed to Snyk/Cisco/Proofpoint/Enkrypt for agent security

## Positioning Recommendation

Do not lead with:

> "MCP security scanner."

Lead with:

> "MCP security audit and governance evidence for teams putting agents into production."

Landing page headline should move toward:

> Get a production-readiness report for your MCP servers before agents touch customer data.

Supporting copy:

> MCPScan reviews MCP configs, tools, schemas, metadata, permissions, secrets exposure, and CI readiness, then produces an executive-ready remediation report.

## Product Strategy

### Keep

- Free CLI
- GitHub Action
- HTML/JSON reports
- Sample report
- Paid audit packages
- GitHub Pages landing page

### Add Next

P0:

- SARIF output for GitHub code scanning.
- Markdown report output for PR comments.
- More evidence quality in findings.
- Clear "no runtime exploit without authorization" policy.
- Public demo repo with before/after.

P1:

- Badge endpoint.
- GitHub Action marketplace polish.
- Audit report PDF export.
- Target list of 100 first prospects.
- One technical teardown article.

P2:

- Dashboard only after paid demand.
- Runtime wrapper/gateway experiments.
- Approval registry/trust catalog.
- Drift detection for tool metadata/schema changes.

## Pricing Reality

The earlier $750 / $1,500 / $3,500 audit packaging is good for early validation, but serious buyer pricing can probably move higher if positioned as AppSec/enterprise-readiness work.

Recommended pricing ladder:

- Quick Audit: $750-$1,500
- Launch Audit: $2,500-$5,000
- Enterprise Readiness Audit: $7,500-$15,000

Dashboard later:

- Small team: $199-$499/mo
- Team/organization: $999+/mo
- Enterprise: custom

Reference anchors:

- [Socket pricing](https://socket.dev/pricing)
- [Semgrep pricing](https://semgrep.dev/pricing)
- [GitHub Advanced Security pricing](https://github.com/security/advanced-security)
- [Snyk pricing](https://snyk.io/plans/)

## Where To Put This

Keep this as a standalone public repo and product brand, not buried in the CapExLayer repo.

Best architecture:

- Public repo: CLI, docs, sample report, GitHub Action, landing page.
- Private ops workspace: prospect lists, customer configs, paid reports, Stripe notes.
- Future dashboard repo or app can remain separate if the product is sold.

Current public repo:

- <https://github.com/Davidleeops/mcpscan>

Current landing:

- <https://davidleeops.github.io/mcpscan/>

## Go / No-Go

### Go, if:

- You sell it as audit/governance/evidence, not a generic scanner.
- You use CLI as a wedge.
- You manually close first customers.
- You add SARIF/Markdown/GitHub Action workflow quickly.
- You do not overbuild SaaS before paid signal.

### No-go, if:

- The plan remains "build a scanner and hope people pay."
- You compete directly with Snyk/Cisco/Proofpoint on scanner breadth.
- You avoid outbound/customer development.
- You cannot tolerate manual audit fulfillment.

## Final Recommendation

Proceed, but reposition immediately.

The opportunity is still attractive because MCP security is real, urgent, and under-governed. The scanner alone is not enough. The first revenue path is a productized MCP production-readiness audit using the CLI/report as proof, then using repeated buyer needs to decide whether to build dashboard/governance/runtime controls.
