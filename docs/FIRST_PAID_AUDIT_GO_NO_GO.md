# First Paid Audit Go No-Go

Generated: 2026-08-14

Use this before accepting or starting the first paid MCPScan audit.

## Go

Proceed only when all are true:

- Payment is confirmed or an explicit manual exception is approved.
- Package is selected: Quick, Launch, or Enterprise Readiness.
- Customer confirms they are authorized to submit the MCP materials.
- Customer confirms scope and exclusions in writing.
- Secure handoff path is confirmed.
- No production credentials are required to begin.
- Customer understands the delivery clock starts after intake is complete.
- Refund boundary is understood.
- Public trust checklist is complete.
- Private workspace is created outside the public repo.

## No-Go

Do not start when any are true:

- Customer asks for active exploitation, persistence, evasion, or destructive testing.
- Customer sends active credentials through email, public GitHub issues, or ordinary chat.
- Customer wants systems reviewed that they do not own or control.
- Scope exceeds the purchased package and no upgrade is approved.
- Stripe checkout, scope, or contact details are inconsistent.
- There is no private workspace.
- There is no completed client acceptance record.
- There is no retention and deletion plan.

## First Payment Acceptance Rule

Taking payment is acceptable only when the buyer can see:

- what is included
- what is excluded
- turnaround time
- secure intake guidance
- refund policy
- contact mailbox
- checkout price

## Operator Signoff

Before delivery starts, complete:

```text
delivery/customer-workspace-template/client-acceptance.md
delivery/customer-workspace-template/redaction-checklist.md
delivery/customer-workspace-template/qa-signoff.md
delivery/customer-workspace-template/retention-and-deletion-log.md
```

Then run:

```text
npm run delivery:verify
```
