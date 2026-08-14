# Payment To Delivery SOP

Generated: 2026-08-14

Use this after a Stripe payment clears.

## Step 1: Confirm Payment

Record:

- customer company
- buyer email
- package purchased
- amount paid
- Stripe receipt URL or payment reference
- purchase timestamp

Do not store Stripe secret keys in the repo or customer workspace.

## Step 2: Send Intake Start

Use `sales/customer-communications.md` and send the Payment Received / Intake Start message.

Include:

- package name
- secure intake link
- reminder not to send production credentials or customer data through email or public issues
- note that the delivery clock starts after intake is complete

## Step 3: Create Private Workspace

Default one-pass handoff after approval:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt
```

The handoff creates the private workspace, first paid audit work order, handoff manifest, and private pipeline status files outside the public MCPScan repo. Output filenames include the date, customer slug, and package slug to prevent same-day customer overwrites.

Draft the post-payment intake message from the private pipeline status JSON:

```text
npm run delivery:intake-message -- --file /path/outside/public/repo/pipeline-status/YYYY-MM-DD_customer_package_pipeline-status.json
```

Fallback workspace-only command:

```text
npm run delivery:workspace -- --customer "{{customer_company}}" --date YYYY-MM-DD
```

## Step 4: Complete Client Acceptance

Fill:

```text
delivery/customer-workspace-template/client-acceptance.md
```

Required confirmations:

- customer is authorized to submit materials
- scope is agreed
- exclusions are agreed
- secure handoff path is agreed
- refund boundary is understood
- delivery clock start is understood

## Step 5: Run Audit

Use:

```text
docs/PAID_AUDIT_RUNBOOK.md
docs/METHODOLOGY_AND_LIMITATIONS.md
docs/SEVERITY_RUBRIC.md
```

Record every evidence item in:

```text
delivery/customer-workspace-template/evidence-register.csv
```

## Step 6: QA Before Delivery

Complete:

```text
delivery/customer-workspace-template/redaction-checklist.md
delivery/customer-workspace-template/qa-signoff.md
```

Verify:

- no raw secrets in final report
- every finding has evidence
- every finding has remediation
- severity matches the rubric
- limitations are stated
- customer names and scope are correct

## Step 7: Deliver

Send:

- final report
- buyer-facing summary if included
- remediation checklist
- findings call link if included
- re-scan instructions if included

## Step 8: Retention and Deletion

Complete:

```text
delivery/customer-workspace-template/retention-and-deletion-log.md
```

Track:

- what was retained
- where it lives
- who can access it
- deletion target date
- deletion confirmation
