# Payment To Delivery SOP

Generated: 2026-08-14

Use this after a Stripe payment clears.

## Step 1: Confirm Payment

Record:

- customer company
- buyer email
- package purchased
- amount paid
- paid Stripe payment intent, charge, invoice, checkout session, receipt URL, or approved manual reference
- purchase timestamp

Do not store Stripe secret keys in the repo or customer workspace.
Do not use a Payment Link as payment evidence. A Payment Link proves checkout exists, not that payment cleared.

Create public-safe payment evidence outside the repo:

```text
npm run delivery:evidence -- --customer "{{customer_company}}" --package "{{package_name}}" --payment "{{paid_stripe_payment_intent_charge_invoice_checkout_session_or_receipt_url}}" --contact "{{technical_contact_email_or_secure_url}}" --safe-intake "/path/outside/public/repo/intake" --operator "{{initials}}" --stripe-dashboard-payment-confirmed true --stripe-paid-object-type "{{payment_intent_charge_invoice_checkout_session_or_receipt}}"
```

If you already have a filled evidence file, verify it:

```text
npm run delivery:verify-payment -- --file /path/to/payment-confirmation-evidence.json
```

This confirms the package, amount, paid transaction evidence, safe intake path, Stripe dashboard confirmation, and no-secret flags before a private workspace is created.

## Step 2: Create Private Workspace And Intake Draft

Use the one-pass handoff command after exact values are approved:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --payment-evidence /path/to/payment-confirmation-evidence.json
```

This verifies the payment evidence again, confirms it matches the approved handoff packet, then creates the private workspace, private work order, private pipeline status, and draft-only intake start message outside the public MCPScan repo. The draft intake message uses the exact approved safe intake path from payment evidence.

Review and approve the exact intake message before sending.

Include:

- package name
- secure intake link
- reminder not to send production credentials or customer data through email or public issues
- note that the delivery clock starts after intake is complete

## Step 3: Review Private Handoff Output

Default one-pass handoff after approval:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --payment-evidence /path/to/payment-confirmation-evidence.json
```

The handoff creates the private workspace, first paid audit work order, handoff manifest, private pipeline status files, and draft-only intake start message outside the public MCPScan repo. It refuses to overwrite existing same-day files for the same customer and package.

If you need to regenerate the post-payment intake message from the private pipeline status JSON:

```text
npm run delivery:intake-message -- --file /path/outside/public/repo/pipeline-status/YYYY-MM-DD_customer_package_pipeline-status.json
```

Do not use a fallback workspace-only command for live paid customers. Live delivery starts from the evidence-backed handoff command so payment proof, approval, workspace, work order, private pipeline status, and draft-only intake stay tied together.

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
