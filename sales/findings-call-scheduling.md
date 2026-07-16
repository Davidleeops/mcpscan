# MCPScan Findings Call Scheduling

Use this for Launch and Enterprise audits, or any paid add-on that includes a remediation call.

## Scheduling Policy

- Offer the call after report delivery, not before the report is ready.
- Default call length:
  - Launch Audit: 30 minutes.
  - Enterprise Readiness Audit: 45 minutes.
  - Additional remediation call: 45 minutes.
- Attendees:
  - required: technical owner or platform/security owner
  - optional: founder/CTO, AppSec, IT admin, engineering manager
- Recording: only if the customer explicitly agrees.
- Reschedule window: allow one reschedule with at least 24 hours notice when possible.

## Booking Link Placeholder

Use this placeholder until a real scheduling link exists:

```text
{{booking_link}}
```

If no booking tool is live, offer three time windows manually and confirm by email.

## Call Agenda

1. Confirm scope and what was reviewed.
2. Walk through the executive summary.
3. Review Critical and High findings first.
4. Identify remediation owners.
5. Confirm what evidence is needed for re-scan.
6. Agree on next step: re-scan, add-on, or closeout.

## Pre-Call Prep

Before sending a booking link:

- confirm the report is ready
- confirm no sensitive material is being linked publicly
- prepare the top 3 findings
- prepare the recommended approval state: approve, approve with guardrails, or block until remediation
- confirm whether re-scan is included

## Scheduling Email

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

## Manual Fallback Email

Subject: MCPScan findings call times

```text
Hi {{first_name}},

The MCPScan report is ready for review.

I do not want to slow this down with scheduling friction. Do any of these windows work for a findings call?

1. {{window_1}}
2. {{window_2}}
3. {{window_3}}

Suggested attendees: the technical owner for the MCP setup, anyone responsible for AppSec/platform approval, and whoever owns the remediation work.

Thanks,
MCPScan
```

