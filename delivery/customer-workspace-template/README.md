# MCPScan Customer Workspace Template

Use this folder as the starting point for each paid MCPScan audit. Copy it outside the public repository before adding any customer-specific material.

## Workspace Rule

Do not store customer secrets, active credentials, customer data, private source code, or non-public reports in the public MCPScan repository.

Recommended private workspace path:

```text
~/MCPScan Audits/YYYY-MM-DD_customer-name/
```

## Automated Setup

From the repo, create a private workspace outside the public repository:

```text
npm run delivery:workspace -- --customer CUSTOMER_NAME --date YYYY-MM-DD
```

Preview the target path without creating files:

```text
npm run delivery:workspace -- --customer CUSTOMER_NAME --date YYYY-MM-DD --dry-run
```

Run a full sample delivery rehearsal with no customer data:

```text
npm run delivery:dry-run
```

## Folder Setup

```text
customer-workspace/
  00-intake/
  01-sanitized-configs/
  02-evidence/
  03-scan-output/
  04-report/
  05-delivery/
```

## First Audit Flow

1. Confirm payer, audit owner, security owner, package, and delivery deadline.
2. Confirm scope and exclusions.
3. Confirm secure handoff path.
4. Complete `client-acceptance.md`.
5. Store only sanitized configs unless a private handoff path is approved.
6. Run MCPScan and save raw outputs in `03-scan-output/`.
7. Fill `evidence-register.csv`.
8. Fill `findings-tracker.csv`.
9. Draft `report-template.md`.
10. Complete `redaction-checklist.md` and `qa-signoff.md`.
11. Initialize `retention-and-deletion-log.md`.
12. Deliver the report PDF/Markdown plus the short buyer summary.
13. Schedule the included findings call or re-scan if the package includes it.

## Required Artifacts

- Completed `intake-checklist.md`
- Completed `client-acceptance.md`
- Completed `evidence-register.csv`
- Completed `redaction-checklist.md`
- Completed `qa-signoff.md`
- Completed `retention-and-deletion-log.md`
- Completed `findings-tracker.csv`
- Final report from `report-template.md`
- Delivery note from `delivery-email-cover.md`
- Evidence archive or links, stored outside the public repo
