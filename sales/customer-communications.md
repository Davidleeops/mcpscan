# MCPScan Customer Communications

These are draft-only templates. Do not send any external message until the exact recipient and exact final content are approved in the same turn.

## Scope/Checkout Follow-Up

Subject: MCPScan scope and checkout next step

```text
Hi {{first_name}},

Based on the scope you described, I recommend {{package}}.

The audit will focus on:
- MCP server/tool inventory
- read/write/destructive tool classification
- auth and secret-handling review
- approval recommendation: approve, approve with guardrails, or block until remediation
- prioritized remediation steps

Checkout/scope link: {{approved_link}}

Please do not send production credentials, active tokens, customer data, or sensitive files through email or public issues. If sensitive evidence is needed, we will confirm a private handoff path first.

Thanks,
MCPScan
```

## Payment Received / Intake Start

Subject: MCPScan audit intake

```text
Hi {{first_name}},

Thanks for purchasing {{package}}.

The audit clock starts after intake materials are complete. Please begin with sanitized materials:

- MCP server/config list
- sanitized MCP configs
- admin policy screenshots or exports
- known launch/security review deadline
- any tools that should be explicitly out of scope

Secure intake guidance:
https://davidleeops.github.io/mcpscan/secure-intake.html

Please do not send production credentials, active tokens, customer data, or sensitive files through email or public issues.

Thanks,
MCPScan
```

## Private Handoff Request

Subject: Private handoff path for MCPScan materials

```text
Hi {{first_name}},

Some of the materials you mentioned may be sensitive. Before we review them, let's use a private handoff path.

Preferred options:

1. Customer-owned private repository with time-limited read access.
2. Customer-owned shared folder with time-limited access.
3. Encrypted archive, with the password sent through a separate channel.

Please do not send active credentials, production secrets, customer data, or private source code through public GitHub issues or ordinary email.

Thanks,
MCPScan
```

## Intake Complete / Audit Started

Subject: MCPScan audit started

```text
Hi {{first_name}},

Intake is complete and the MCPScan audit has started.

Confirmed scope:
- Package: {{package}}
- MCP servers/configs in scope: {{scope_summary}}
- Delivery target: {{delivery_date}}
- Findings call/re-scan: {{included_items}}

I will flag any scope blockers quickly if something looks unsafe to review or outside the purchased package.

Thanks,
MCPScan
```

## Report Delivery

Subject: MCPScan readiness audit report

```text
Hi {{first_name}},

Attached is the MCPScan readiness audit report for {{company}}.

The report includes:
- MCP server/tool inventory
- risk-ranked findings
- auth and secret-handling review
- approval recommendation
- remediation priorities
- re-scan or findings-call next steps, if included in your package

Please do not reply with production credentials, active tokens, customer data, or sensitive files over email. If follow-up evidence is needed, we will confirm a private handoff path first.

Thanks,
MCPScan
```

## Re-Scan Request

Subject: MCPScan re-scan materials

```text
Hi {{first_name}},

For the included re-scan, please send sanitized evidence for the fixes you want reviewed.

Helpful materials:
- updated sanitized MCP configs
- list of remediated findings
- screenshots or exports of updated admin settings
- any changed server/tool permissions

Please do not send production credentials, active tokens, customer data, or sensitive files through email or public issues.

Thanks,
MCPScan
```

## Findings Call Scheduling

Subject: MCPScan findings call

```text
Hi {{first_name}},

The MCPScan report is ready for review.

For the findings call, please use this link to choose a time:
{{booking_link}}

Suggested attendees: the technical owner for the MCP setup, anyone responsible for AppSec/platform approval, and whoever owns the remediation work.

Agenda:
1. scope reviewed
2. executive summary
3. Critical/High findings
4. remediation owners
5. re-scan evidence and next steps

Please do not send production credentials, active tokens, customer data, or sensitive files in the calendar invite or email thread.

Thanks,
MCPScan
```

## Testimonial / Referral Ask

Subject: Quick MCPScan feedback

```text
Hi {{first_name}},

Glad we could get the MCP readiness review delivered.

If the report was useful, would you be open to either:

1. a short private quote I can use with future prospects, or
2. an intro to another AppSec/platform team currently working through MCP approval?

No pressure either way.

Thanks,
MCPScan
```
