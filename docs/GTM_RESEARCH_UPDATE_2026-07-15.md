# GTM Research Update

Date: July 15, 2026

## Reality Check

MCP security is still a real opportunity, but the simple scanner lane is crowded.
The market now has:

- lightweight open-source scanners
- enterprise MCP gateways and control planes
- broader AI security posture platforms

MCPScan should not sell as "another MCP scanner." The strongest first-revenue
position is:

> MCPScan turns MCP discovery and scan findings into a fixed-price
> production-readiness report with inventory, attack-path prioritization,
> remediation owners, and governance evidence.

The CLI remains the wedge. The paid audit is the fastest monetization path. A
dashboard should follow repeated demand rather than lead the launch.

## Category Signals

- GitHub Copilot enterprise docs describe MCP server configuration for Copilot
  agents and warn that configured tools may run autonomously.
- Slack documents MCP apps that can search, read, send messages, and create
  canvases inside Slack.
- Atlassian has an official MCP server for Jira, Confluence, JSM, Bitbucket,
  and Compass.
- Claude Code, Cursor, Goose, Langdock, and similar agent environments make MCP
  easy to connect to real tools.
- The NSA recommends scanning for unauthenticated, vulnerable, unauthorized, and
  internet-connected MCP servers and improving logging, filtering, auditing, and
  vulnerability tracking.

## Competitor Landscape

| Player | Positioning | Gap MCPScan Can Exploit |
| --- | --- | --- |
| Snyk Agent Scan / Invariant MCP-scan | Installed agent component and MCP scanning, prompt injection, sensitive data handling, hidden malware | Strong scanner/security-tool brand, but not packaged as a fast fixed-price readiness report |
| mcp-audit | Free offline scanner for MCP configs, OWASP mapping, attack paths, Semgrep rules | Free substitute; MCPScan needs better buyer-facing reporting and managed remediation |
| MCPhound | One-command scanner for attack paths, poisoning, typosquats, CVEs, trust scores | Scanner-centric; MCPScan can own governance-ready report delivery |
| Microsoft Agent Governance Toolkit MCP Scan CLI | Inspects configs/tools/resources/prompts and CI signals | Validates category; toolkit-oriented rather than service-led |
| MCP Manager by Usercentrics | Gateway/governance: registry, provisioning, audit logs, RBAC, PII filtering, SSO/SCIM | Heavy platform sale; MCPScan can be the pre-gateway assessment |
| Proofpoint AI MCP Security | Shadow MCP discovery, authorization, inspection, policy enforcement, audit logging | Enterprise-suite motion; MCPScan can target teams before procurement |
| Runlayer | MCP/agent control plane for unmanaged MCPs, skills, plugins, AI client configs | Platform sale; MCPScan can sell readiness in days |
| Portkey MCP Gateway | Governed/observable MCP gateway with auth, RBAC, policy, PII redaction, logging | Broader gateway; MCPScan can be specialist and vendor-neutral |
| MintMCP | Enterprise MCP governance platform, managed/VPC/self-hosted, SOC 2 positioning | Enterprise-only feel; MCPScan can serve SMB/midmarket readiness |
| SandboxAQ AQtive Guard | AI-powered MCP server codebase security auditor, enterprise marketplace positioning | High-end AI-SPM; MCPScan can be narrower and dramatically cheaper |
| Workato MCP | Integration-platform governance layer for enterprise actions | Workato-centric; MCPScan can assess mixed MCP environments |
| MCP Security Scan GitHub Actions | CI/SARIF developer workflow | CI-only; MCPScan can own executive reporting and remediation plans |

## Prospect Pools

| Pool | Public Signal | Buyer Hypothesis | First Offer |
| --- | --- | --- | --- |
| GitHub Enterprise / Copilot orgs | MCP configuration for Copilot agents | VP Eng, AppSec, AI platform | Enterprise Readiness |
| GitHub MCP Server users | Repo/org actions through MCP clients | DevSecOps, platform engineering | Launch Audit |
| Slack Enterprise Grid | MCP apps can act on Slack workspace data | IT, security, collaboration admins | Enterprise Readiness |
| Atlassian Cloud / Rovo | Official Jira/Confluence/Bitbucket MCP server | Atlassian admins, EngOps | Enterprise Readiness |
| Claude Code enterprise users | MCP connects code agents to databases, APIs, tools | Eng leadership, AppSec | Launch Audit |
| Cursor Teams / Enterprise | MCP usage and security concerns in community | AI devtools owner, AppSec | Launch Audit |
| Langdock customers | Directory of official remote MCP servers | AI platform admins | Enterprise Readiness |
| Cloudflare developers | MCP can manage Workers, KV, R2, bindings | Platform engineering, cloud security | Enterprise Readiness |
| Sentry users | MCP exposes monitoring and incident context | Observability, AppSec | Quick or Launch Audit |
| Stripe users | MCP can expose payment/subscription data | Payments engineering, security | Enterprise Readiness |
| Supabase users | MCP can manage projects/backend state | Startup CTO, platform engineering | Launch Audit |
| Neon users | MCP can manage Postgres branches | Infra/DB platform | Launch Audit |
| Vercel users | MCP can manage deployments and functions | Frontend platform, DevOps | Launch Audit |
| Netlify users | MCP can manage projects and functions | DevOps, web platform | Launch Audit |
| PagerDuty users | MCP can touch incident workflows | SRE leadership, security | Enterprise Readiness |
| Linear users | MCP handles issue/project workflows | EngOps, startup CTO | Quick or Launch Audit |
| Notion admins | MCP can access docs and workspace content | IT, knowledge management, security | Launch Audit |
| PostHog users | MCP exposes analytics, flags, error tracking | Product engineering, data governance | Launch Audit |
| Ramp / finance ops users | MCP can touch spend and finance data | Finance IT, security, compliance | Enterprise Readiness |
| Goose / open-source agent community | Local agents and extensions | OSS maintainers, platform teams | Community wedge / Quick Audit |

## Top Channels

1. GitHub/Copilot Enterprise admins and AppSec teams.
2. Slack and Atlassian admin/security communities.
3. AI coding-tool communities: Cursor, Claude Code, Goose, Continue, VS Code MCP users.

## Positioning To Use

Primary:

> MCPScan is the fast MCP readiness assessment for security teams adopting AI
> agents. It discovers shadow MCP usage, maps risky tool chains, flags poisoning
> and supply-chain exposure, and produces an audit-ready remediation plan before
> agents touch production data.

Sharper revenue wedge:

> Know which MCP servers your agents can trust before you connect them to
> company data.

Category contrast:

> Open-source scanners find MCP issues. MCPScan turns them into an enterprise
> readiness score, prioritized attack paths, owner-level remediation, and
> evidence security leaders can act on.

First offer:

> Fixed-price MCP Security Readiness Assessment: inventory every MCP server in
> use, identify critical cross-tool attack paths, rank remediation by business
> risk, and deliver a governance-ready report in 48 hours.

## Sources

- GitHub Copilot MCP configuration: <https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers>
- GitHub MCP Server docs: <https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/use-the-github-mcp-server>
- Slack MCP guide: <https://slack.com/help/articles/48855576908307-Guide-to-Model-Context-Protocol-in-Slack>
- Atlassian MCP server: <https://github.com/atlassian/atlassian-mcp-server>
- Claude Code MCP docs: <https://code.claude.com/docs/en/mcp>
- Cursor MCP docs: <https://cursor.com/docs/mcp>
- Cursor security forum signal: <https://forum.cursor.com/t/enhance-mcp-and-native-tool-security/76324>
- Langdock MCP directory: <https://docs.langdock.com/en/using-langdock/integrations/mcp-directory>
- Goose repository: <https://github.com/aaif-goose/goose>
- NSA MCP security guidance: <https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf>
- MCP enterprise-managed auth: <https://blog.modelcontextprotocol.io/posts/enterprise-managed-auth/>
- Snyk Agent Scan: <https://github.com/snyk/agent-scan>
- Snyk and Invariant announcement: <https://labs.snyk.io/resources/snyk-labs-invariant-labs/>
- mcp-audit: <https://appsecsanta.com/mcp-audit>
- MCPhound: <https://github.com/tayler-id/mcphound>
- Microsoft Agent Governance Toolkit MCP scan CLI: <https://github.com/microsoft/agent-governance-toolkit/blob/main/docs/tutorials/27-mcp-scan-cli.md>
- MCP Manager pricing: <https://mcpmanager.ai/pricing-plans/>
- Proofpoint AI MCP Security: <https://www.proofpoint.com/us/products/ai-mcp-security>
- Runlayer IT security: <https://www.runlayer.com/solutions/it-security>
- Portkey MCP: <https://portkey.ai/features/mcp>
- Portkey pricing/info: <https://portkey.ai/portkey-ai-info-page>
- MintMCP and Portkey: <https://www.mintmcp.com/blog/portkey-with-mcp>
- SandboxAQ AQtive Guard scanner: <https://www.aqtiveguard.com/blogs/mcp-server-security-scanner>
- AQtive Guard AWS Marketplace: <https://aws.amazon.com/marketplace/pp/prodview-ccwrhqfeekqwk>
- Workato MCP governance: <https://www.workato.com/the-connector/mcp-security-governance/>
- MCP Security Scan GitHub Action: <https://github.com/marketplace/actions/mcp-security-scan>
- AgentAuditKit GitHub Action: <https://github.com/marketplace/actions/agentauditkit-mcp-security-scan>

