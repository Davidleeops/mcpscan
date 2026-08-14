# MCPScan Severity Rubric

Generated: 2026-08-14

Use this rubric for paid audit findings. Severity should be based on impact, likelihood, exploitability, business context, and compensating controls.

## Critical

Use Critical when a finding creates a direct or highly plausible path to:

- credential theft
- arbitrary command execution
- sensitive data exfiltration
- destructive production action
- unauthorized access to customer records
- uncontrolled write access to business-critical systems

Example:

An MCP server exposes a shell-execution tool to an agent that can receive untrusted content, with no approval gate and access to production credentials.

## High

Use High when a finding creates serious risk but lacks one direct element needed for Critical:

- broad read/write access with weak boundaries
- sensitive system access without clear approval controls
- secrets present in config or environment references
- tool descriptions that create strong prompt-injection exposure
- high-impact actions available without least-privilege scoping

Example:

An MCP tool can update tickets, repos, or cloud resources and is available to broad users without documented approval or allowlist controls.

## Medium

Use Medium when a finding is meaningful and should be fixed, but immediate blast radius is constrained:

- excessive but non-production permissions
- unclear server provenance
- missing version pinning
- incomplete logging or ownership
- potentially risky tool wording
- missing environment separation

Example:

An MCP server runs from an unpinned package and exposes read-only internal documentation, with no current evidence of production write access.

## Low

Use Low for hardening issues with limited immediate impact:

- naming clarity
- documentation gaps
- mild configuration hygiene
- low-risk unused tool exposure

Example:

The team has an MCP owner, but the owner is not listed in the config repository or operational runbook.

## Informational

Use Informational for context, inventory, or future monitoring:

- reviewed items
- assumptions
- non-security notes
- future monitoring recommendations

## Calibration Rules

- Do not inflate severity to make a report look stronger.
- Do not mark a finding Critical without a credible high-impact path.
- If evidence is incomplete, say so and label it Inferred or Not reviewed.
- If compensating controls reduce risk, document them.
- Every customer-visible finding must include evidence and a concrete remediation.
