# Paid Audit Start Automation

Use this immediately after a real payment clears and the exact paid handoff values are approved.

## Rule

The handoff command is run from the MCPScan repo and creates private delivery artifacts outside the public repo. It does not send email, accept customer files, or store customer material in the public repo.

The command refuses to overwrite existing same-day handoff files for the same customer and package.

## Command

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt
```

Use `--root` when you want to choose the private output location:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --root "/path/outside/public/repo"
```

## Private Output

The command creates:

- private customer workspace
- private work order
- private pipeline status JSON and CSV
- draft-only intake start message

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
- Do not start the audit clock until intake materials are complete.
- Do not place customer configs, evidence, reports, credentials, or private messages in the public repo.
