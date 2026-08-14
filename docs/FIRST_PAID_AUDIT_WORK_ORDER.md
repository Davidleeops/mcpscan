# First Paid Audit Work Order

Generated: 2026-08-14

Use this after payment clears to create the operator packet for the first paid audit.

Default one-pass command:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --payment-evidence /path/to/payment-confirmation-evidence.json
```

## Command

Fallback work-order-only command:

```text
npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --payment-evidence /path/to/payment-confirmation-evidence.json
```

By default, the command writes outside the public repo:

```text
~/MCPScan Work Orders/
```

## Output

- `FIRST_PAID_AUDIT_WORK_ORDER.md`
- `manifest.json`

The work order includes:

- delivery promise
- start gate
- workspace command
- delivery checklist
- kickoff email

## Safety Rules

- Do not write customer work orders into the public repo.
- Do not include customer secrets in the work order.
- Do not start delivery until client acceptance, secure handoff, and private workspace are confirmed.
