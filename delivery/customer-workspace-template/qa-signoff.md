# MCPScan QA Signoff

Customer: `{{customer_name}}`  
Package: `{{package_name}}`  
Reviewer: `{{reviewer_name}}`  
Date: `{{date}}`

## Scope QA

- [ ] Customer name is correct.
- [ ] Package is correct.
- [ ] Systems in scope match the client acceptance record.
- [ ] Exclusions are listed.
- [ ] Delivery date is correct.

## Finding QA

- [ ] Severity matches `docs/SEVERITY_RUBRIC.md`.
- [ ] Every finding has evidence.
- [ ] Every finding has business impact.
- [ ] Every finding has remediation.
- [ ] Inferred findings are labeled as inferred.
- [ ] Out-of-scope observations are clearly marked.

## Safety QA

- [ ] Redaction checklist is complete.
- [ ] No customer secrets appear in the final report.
- [ ] No unrelated customer data appears in the final report.
- [ ] No claims of certification or full penetration-test coverage.
- [ ] Methodology and limitations are included.

## Delivery QA

- [ ] Delivery cover note is prepared.
- [ ] Findings call agenda is prepared if included.
- [ ] Re-scan instructions are prepared if included.
- [ ] Retention and deletion log is initialized.

## Signoff

Decision:

```text
{{approved_for_delivery | needs_revision | do_not_deliver}}
```

Notes:

```text
{{qa_notes}}
```
