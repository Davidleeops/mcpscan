# Paid Audit Start Automation

Use this immediately after a real payment clears and the exact paid handoff values are approved.

## Rule

The handoff command is run from the MCPScan repo and creates private delivery artifacts outside the public repo. It does not send email, accept customer files, or store customer material in the public repo.

The command refuses to overwrite existing same-day handoff files for the same customer and package.

## Command

First create and verify the public-safe payment evidence file outside the repo:

```text
npm run delivery:evidence -- --customer "{{customer_company}}" --package "{{package_name}}" --payment "{{stripe_payment_reference_or_receipt_url}}" --contact "{{technical_contact_email_or_secure_url}}" --safe-intake "/path/outside/public/repo/intake" --operator "{{initials}}"
```

Then run the paid handoff after the exact packet is approved:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --payment-evidence /path/to/payment-confirmation-evidence.json
```

Use `--root` when you want to choose the private output location:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --payment-evidence /path/to/payment-confirmation-evidence.json --root "/path/outside/public/repo"
```

## Private Output

The command creates:

- private customer workspace
- private work order
- private pipeline status JSON and CSV
- draft-only intake start message
- handoff manifest and pipeline status that reference the verified payment evidence path

The draft-only intake message is written under:

```text
MCPScan Paid Audits/customer-comms/
```

## Before Sending Intake

- Review the exact draft.
- Confirm the recipient.
- Confirm the package, payment reference, and delivery scope.
- Get same-turn approval before sending the final customer message.
- Do not request production credentials, active tokens, customer data, private source code, or sensitive files by ordinary email or public issue.

## Stop Conditions

- Do not start delivery without confirmed payment.
- Do not create the private workspace until payment evidence passes verification.
- Do not start the audit clock until intake materials are complete.
- Do not place customer configs, evidence, reports, credentials, or private messages in the public repo.
