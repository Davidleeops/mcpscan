# Paid Audit Handoff Approval Packet

Status: draft only. Use after Stripe confirms payment and before any customer material is accepted.

## Approval Rule

Do not create a live customer handoff or start delivery until payment is confirmed and this exact packet is approved.

Before running the handoff, verify public-safe payment evidence:

```text
npm run delivery:verify-payment -- --file /path/to/payment-confirmation-evidence.json
```

Use `sales/payment-confirmation-evidence.template.json` as the shape. Save the filled evidence outside the public repo.

## Exact Approval Text

```text
I approve creating this MCPScan paid audit handoff.

Customer: {{customer_company}}
Package: {{package_name}}
Technical contact: {{technical_contact_email_or_secure_url}}
Payment reference: {{stripe_payment_reference_or_receipt_url}}
Date: {{yyyy-mm-dd}}

Approved action:
Create the private customer workspace and first paid audit work order outside the public MCPScan repo. Do not store customer secrets in the public repo.
```

## Command

After approval, save the approved text outside the repo and run:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt
```

Optional output root:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --root "/path/outside/public/repo"
```

## What It Creates

- private customer workspace outside the public repo
- first paid audit work order outside the public repo
- handoff manifest outside the public repo
- private pipeline status JSON and CSV outside the public repo
- customer and package specific output filenames to prevent same-day overwrites

## Stop Conditions

- Do not use this for unpaid prospects.
- Do not use this with template placeholders still present.
- Do not include Stripe secret keys.
- Do not run the handoff until public-safe payment evidence passes verification.
- Do not include production credentials, active tokens, customer data, private source code, or sensitive customer materials.
- Do not start review work until client acceptance, authorization, and safe intake are complete.
