# MCPScan Post-Payment Handoff

Use this immediately after Stripe confirms payment. The goal is to move the buyer from checkout to safe intake without collecting sensitive material in the wrong place.

## Owner And SLA

- Owner: founder/operator running the audit.
- First response SLA: within 1 business day of payment.
- Audit clock: starts only after complete, safe intake is received and scope is confirmed.
- Customer data rule: do not accept production credentials, active tokens, customer data, sensitive source code, or private final reports in public GitHub issues or ordinary email.

## Payment Confirmation Checklist

1. Confirm the paid package and customer email from Stripe.
2. Create a private customer workspace outside the public repo.
3. Copy `delivery/customer-workspace-template/` into that private workspace.
4. Record package, delivery target, included findings call/re-scan, and any add-ons.
5. Send the Payment Received / Intake Start message from `sales/customer-communications.md`.
6. If sensitive files are needed, send the Private Handoff Request message before accepting materials.
7. Mark the pipeline row as `Paid`.

## Safe Intake Paths

Preferred order:

1. Customer-owned private repository with time-limited read access.
2. Customer-owned shared folder with time-limited access.
3. Encrypted archive, with the password sent through a separate channel.
4. Sanitized screenshots or config excerpts when full files are not required.

Avoid:

- public GitHub issues for anything sensitive
- ordinary email attachments containing secrets, customer data, private source, or active credentials
- shared links without expiration or access limits
- storing customer material in this public repository

## Buyer Intake Request

Ask for only what is needed:

- package purchased
- company and technical contact
- MCP clients or agent tools in use
- MCP servers/configs in scope
- sanitized MCP configs or customer-approved private handoff path
- target environments
- known launch, security review, or customer deadline
- tools or systems explicitly out of scope
- preferred findings-call windows if included

## Completion Criteria

Intake is complete when:

- scope matches the package or an add-on is approved
- materials are sanitized or safely handed off
- out-of-scope systems are named
- delivery date is confirmed
- findings call/re-scan terms are confirmed
- the private workspace contains the report template and findings tracker

## Escalate Before Starting If

- the buyer sends active credentials or production secrets
- the buyer asks for exploit-style testing not covered by the package
- the scope exceeds the paid package
- the buyer wants compliance certification or legal attestation
- the buyer expects review of customer data or regulated records

## Copy Block

```text
Payment confirmed:
Package:
Customer:
Technical contact:
Stripe link/product:
Private workspace:
Safe intake path:
Scope confirmed:
Delivery target:
Findings call:
Re-scan:
Notes:
```

