# MCPScan Redaction Checklist

Complete before any customer-facing report leaves the private workspace.

## Secrets

- [ ] No active API keys.
- [ ] No active tokens.
- [ ] No passwords.
- [ ] No private keys.
- [ ] No session cookies.
- [ ] No unrelated environment variables.

## Customer Data

- [ ] No customer records.
- [ ] No personal data that is not needed for the finding.
- [ ] No private source code excerpts unless explicitly approved.
- [ ] No unrelated screenshots.
- [ ] No internal hostnames beyond what is needed to support a finding.

## Evidence Quality

- [ ] Every finding has evidence.
- [ ] Every finding labels evidence as Observed, Inferred, Customer-stated, CLI heuristic, or Not reviewed.
- [ ] Every redaction preserves enough context to understand the risk.
- [ ] Every recommendation is actionable.

## Delivery

- [ ] Final report is stored outside the public repo.
- [ ] Delivery path is customer-approved.
- [ ] Report does not include materials outside the agreed scope.
