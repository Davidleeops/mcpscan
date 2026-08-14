# First 10 Route Approval Packet

Generated: 2026-08-14

Status: draft only. This packet does not approve or send outreach.

## Approval Rule

No external message can be sent until the founder approves the exact route, recipient description, and final message in the same turn.

## Route Source

Routes: sales/first-10-contact-routes-2026-08-14.csv
Candidates: sales/recipient-candidates-2026-08-14.csv

## How To Stage After Approval

Copy one approved block into a temporary file, then run:

```text
npm run outbound:stage-approved -- --file /path/to/approved-outbound.txt
```

## Vapi

Channel: Trust center
Route: https://security.vapi.ai/
Route source: https://security.vapi.ai/
Public MCP signal: https://docs.vapi.ai/sdk/mcp-server
Confidence: Medium
Note: Use as trust/security review route. Do not submit as a vulnerability report unless there is an authorized finding.

Final message:

```text
Subject: MCP readiness review for voice-agent tools

Hi team,

I saw Vapi exposes APIs as MCP tools for assistants, phone numbers, and calls. Voice-agent tooling is a high-trust surface because it can touch real customer interactions, phone workflows, and operational actions.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: Vapi
Channel: Trust center
Recipient: Security, platform, or engineering owner at Vapi
Contact or profile URL: https://security.vapi.ai/
Source URL: https://docs.vapi.ai/sdk/mcp-server

Final message:
Subject: MCP readiness review for voice-agent tools

Hi team,

I saw Vapi exposes APIs as MCP tools for assistants, phone numbers, and calls. Voice-agent tooling is a high-trust surface because it can touch real customer interactions, phone workflows, and operational actions.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## Retool

Channel: Vulnerability disclosure
Route: https://retool.com/vulnerability-reporting
Route source: https://retool.com/vulnerability-reporting
Public MCP signal: https://retool.com/blog/retool-mcp-server
Confidence: High
Note: Use carefully as security review inquiry, not a vulnerability claim.

Final message:

```text
Subject: MCP readiness review for internal-tool access

Hi team,

I saw Retool MCP lets agents manage apps, workflows, users, and org resources from Claude, Cursor, Codex, or Kiro. Internal-tool MCP is exactly where enterprise reviewers tend to ask about scopes, user authority, audit logs, and approval boundaries.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: Retool
Channel: Vulnerability disclosure
Recipient: Security, platform, or engineering owner at Retool
Contact or profile URL: https://retool.com/vulnerability-reporting
Source URL: https://retool.com/blog/retool-mcp-server

Final message:
Subject: MCP readiness review for internal-tool access

Hi team,

I saw Retool MCP lets agents manage apps, workflows, users, and org resources from Claude, Cursor, Codex, or Kiro. Internal-tool MCP is exactly where enterprise reviewers tend to ask about scopes, user authority, audit logs, and approval boundaries.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## Pipedream

Channel: Security inbox
Route: security@pipedream.com
Route source: https://pipedream.com/docs/privacy-and-security
Public MCP signal: https://pipedream.com/docs/connect/mcp
Confidence: High
Note: Public docs list this for security-related questions and suspected vulnerabilities.

Final message:

```text
Subject: MCP exposure review for broad SaaS tool access

Hi team,

I saw Pipedream provides MCP servers across thousands of apps and pre-built tools. That breadth is valuable, but it also makes the review question practical: which tools can act, whose credentials are used, and what should be gated before customer or enterprise rollout?

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: Pipedream
Channel: Security inbox
Recipient: Security, platform, or engineering owner at Pipedream
Contact or profile URL: security@pipedream.com
Source URL: https://pipedream.com/docs/connect/mcp

Final message:
Subject: MCP exposure review for broad SaaS tool access

Hi team,

I saw Pipedream provides MCP servers across thousands of apps and pre-built tools. That breadth is valuable, but it also makes the review question practical: which tools can act, whose credentials are used, and what should be gated before customer or enterprise rollout?

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## Composio

Channel: Security inbox
Route: security@composio.dev
Route source: https://github.com/ComposioHQ/composio/security
Public MCP signal: https://composio.dev/mcp-gateway
Confidence: High
Note: Public GitHub security policy lists this address.

Final message:

```text
Subject: MCP trust review for gateway-managed tools

Hi team,

I saw Composio is positioning MCP gateway management around managed tools, custom MCP servers, central enable/disable, and team ownership. For gateway products, buyers tend to ask for clear evidence around tool inventory, ownership, auth, and what actions are enabled for which teams.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: Composio
Channel: Security inbox
Recipient: Security, platform, or engineering owner at Composio
Contact or profile URL: security@composio.dev
Source URL: https://composio.dev/mcp-gateway

Final message:
Subject: MCP trust review for gateway-managed tools

Hi team,

I saw Composio is positioning MCP gateway management around managed tools, custom MCP servers, central enable/disable, and team ownership. For gateway products, buyers tend to ask for clear evidence around tool inventory, ownership, auth, and what actions are enabled for which teams.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## PostHog

Channel: Security inbox
Route: security-reports@posthog.com
Route source: https://posthog.com/handbook/company/security-advisories
Public MCP signal: https://posthog.com/docs/model-context-protocol
Confidence: High
Note: Public handbook lists this for security vulnerabilities and related findings.

Final message:

```text
Subject: MCP readiness check for analytics and feature-flag tools

Hi team,

I saw PostHog MCP supports analytics queries, feature flags, experiments, SQL, CDP destinations, and support-ticket workflows. Because those surfaces can affect product data and rollout behavior, the useful security artifact is a clear map of tool permissions, approval gates, and remediation priorities.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: PostHog
Channel: Security inbox
Recipient: Security, platform, or engineering owner at PostHog
Contact or profile URL: security-reports@posthog.com
Source URL: https://posthog.com/docs/model-context-protocol

Final message:
Subject: MCP readiness check for analytics and feature-flag tools

Hi team,

I saw PostHog MCP supports analytics queries, feature flags, experiments, SQL, CDP destinations, and support-ticket workflows. Because those surfaces can affect product data and rollout behavior, the useful security artifact is a clear map of tool permissions, approval gates, and remediation priorities.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## Statsig

Channel: Contact form
Route: https://www.statsig.com/contact/us
Route source: https://www.statsig.com/trust/security
Public MCP signal: https://docs.statsig.com/integrations/mcp/overview
Confidence: Medium
Note: Use contact form unless a better security-review route is founder-provided.

Final message:

```text
Subject: MCP readiness check for feature-gate actions

Hi team,

I saw Statsig MCP supports both read and write tools for gates, experiments, configs, and bulk changes. Feature gates and experiments are production-control surfaces, so the security review usually comes down to tool scopes, write permissions, approval gates, and audit evidence.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: Statsig
Channel: Contact form
Recipient: Security, platform, or engineering owner at Statsig
Contact or profile URL: https://www.statsig.com/contact/us
Source URL: https://docs.statsig.com/integrations/mcp/overview

Final message:
Subject: MCP readiness check for feature-gate actions

Hi team,

I saw Statsig MCP supports both read and write tools for gates, experiments, configs, and bulk changes. Feature gates and experiments are production-control surfaces, so the security review usually comes down to tool scopes, write permissions, approval gates, and audit evidence.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## Braintrust

Channel: Trust inbox
Route: trust@braintrustdata.com
Route source: https://trust.braintrust.dev/
Public MCP signal: https://www.braintrust.dev/docs/integrations/developer-tools/mcp
Confidence: Medium
Note: Trust center lists this as the trust contact.

Final message:

```text
Subject: MCP exposure snapshot for eval and log access

Hi team,

I saw Braintrust MCP lets AI coding tools query experiments, search docs, and analyze production logs. Evals and logs often include prompts, outputs, traces, and real customer examples, so a lightweight MCP review can help show what data agents can reach and which actions should be approved or gated.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: Braintrust
Channel: Trust inbox
Recipient: Security, platform, or engineering owner at Braintrust
Contact or profile URL: trust@braintrustdata.com
Source URL: https://www.braintrust.dev/docs/integrations/developer-tools/mcp

Final message:
Subject: MCP exposure snapshot for eval and log access

Hi team,

I saw Braintrust MCP lets AI coding tools query experiments, search docs, and analyze production logs. Evals and logs often include prompts, outputs, traces, and real customer examples, so a lightweight MCP review can help show what data agents can reach and which actions should be approved or gated.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## Granola

Channel: Security inbox
Route: security@granola.so
Route source: https://docs.granola.ai/help-center/policies/terms-of-service/vulnerability-disclosure-policy
Public MCP signal: https://www.granola.ai/blog/granola-mcp
Confidence: High
Note: Public vulnerability disclosure policy lists this address.

Final message:

```text
Subject: MCP exposure snapshot for meeting-note access

Hi team,

I saw Granola MCP connects meeting notes to Claude, ChatGPT, Cursor, and other AI tools. Meeting notes can contain sales, legal, hiring, product, and customer-sensitive context, so the useful review is practical: who can connect, what gets exposed, what is logged, and what should be gated.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: Granola
Channel: Security inbox
Recipient: Security, platform, or engineering owner at Granola
Contact or profile URL: security@granola.so
Source URL: https://www.granola.ai/blog/granola-mcp

Final message:
Subject: MCP exposure snapshot for meeting-note access

Hi team,

I saw Granola MCP connects meeting notes to Claude, ChatGPT, Cursor, and other AI tools. Meeting notes can contain sales, legal, hiring, product, and customer-sensitive context, so the useful review is practical: who can connect, what gets exposed, what is logged, and what should be gated.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## Sentry

Channel: Security inbox
Route: security@sentry.io
Route source: https://sentry.io/security/
Public MCP signal: https://mcp.sentry.dev/
Confidence: High
Note: Public security page lists this for vulnerability or security concerns.

Final message:

```text
Subject: MCP readiness review for error and trace access

Hi team,

I saw Sentry MCP connects AI assistants to errors, performance data, issue triage, docs, and project management. Error traces and project data can carry sensitive production context, so security reviewers tend to ask what agents can read, what they can change, and how tool calls are attributed.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: Sentry
Channel: Security inbox
Recipient: Security, platform, or engineering owner at Sentry
Contact or profile URL: security@sentry.io
Source URL: https://mcp.sentry.dev/

Final message:
Subject: MCP readiness review for error and trace access

Hi team,

I saw Sentry MCP connects AI assistants to errors, performance data, issue triage, docs, and project management. Error traces and project data can carry sensitive production context, so security reviewers tend to ask what agents can read, what they can change, and how tool calls are attributed.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```

## Replit

Channel: Security inbox
Route: security@replit.com
Route source: https://docs.replit.com/legal-and-security-info/security
Public MCP signal: https://docs.replit.com/build/connect-via-mcp
Confidence: High
Note: Public security docs list this address and subject guidance.

Final message:

```text
Subject: MCP exposure review for custom coding-agent tools

Hi team,

I saw Replit Agent supports connecting pre-listed and custom MCP servers, with guidance to trust sources and review access. Custom MCP inside a coding environment is powerful, but it creates a practical review need around tool poisoning, credential exposure, workspace access, and unsafe actions.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David
```

Same-turn approval text:

```text
I approve staging this exact MCPScan outbound message.

Account: Replit
Channel: Security inbox
Recipient: Security, platform, or engineering owner at Replit
Contact or profile URL: security@replit.com
Source URL: https://docs.replit.com/build/connect-via-mcp

Final message:
Subject: MCP exposure review for custom coding-agent tools

Hi team,

I saw Replit Agent supports connecting pre-listed and custom MCP servers, with guidance to trust sources and review access. Custom MCP inside a coding environment is powerful, but it creates a practical review need around tool poisoning, credential exposure, workspace access, and unsafe actions.

MCPScan runs a fixed-scope MCP Launch Audit that maps servers, tools, read/write actions, auth and secrets exposure, approval gates, and buyer-safe remediation evidence.

Worth sending the one-page scope to the right AppSec, platform, or engineering owner?

David

Approved action:
Stage this approved outbound packet outside the public repo for manual sending review. Do not send automatically.
```
