# MCPScan Customer Workspace Template

Use this folder as the starting point for each paid MCPScan audit. Copy it outside the public repository before adding any customer-specific material.

## Workspace Rule

Do not store customer secrets, active credentials, customer data, private source code, or non-public reports in the public MCPScan repository.

Recommended private workspace path:

```text
~/MCPScan Audits/YYYY-MM-DD_customer-name/
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
4. Store only sanitized configs unless a private handoff path is approved.
5. Run MCPScan and save raw outputs in `03-scan-output/`.
6. Fill `findings-tracker.csv`.
7. Draft `report-template.md`.
8. Run a second review pass for severity, proof, and remediation clarity.
9. Deliver the report PDF/Markdown plus the short buyer summary.
10. Schedule the included findings call or re-scan if the package includes it.

## Required Artifacts

- Completed `intake-checklist.md`
- Completed `findings-tracker.csv`
- Final report from `report-template.md`
- Delivery note from `delivery-email-cover.md`
- Evidence archive or links, stored outside the public repo

