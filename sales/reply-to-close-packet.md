# MCPScan Reply To Close Packet

Generated: 2026-08-14

Use this after a prospect replies. Do not send any response until the exact recipient and exact final content are approved in the same turn.

## Reply Type: Send Scope

Subject:

```text
MCPScan scope
```

Message:

```text
Hi {{first_name}},

Here is the fixed-scope MCPScan audit menu.

Recommended default: MCP Launch Audit, $1,500 one-time.

It covers up to 8 MCP servers across up to 2 environments and includes:
- MCP server and tool inventory
- read/write/destructive tool classification
- auth and secret-handling review
- prompt-injection and tool-description risk review
- written report
- remediation checklist
- 30-minute findings call
- 1 re-scan after fixes

The audit starts after intake materials are complete. Please do not send production credentials, active tokens, customer data, or sensitive files through email or public issues.

Checkout link:
{{launch_audit_checkout_url}}

Secure intake guidance:
{{secure_intake_url}}

Thanks,
MCPScan
```

## Reply Type: Price

Subject:

```text
MCPScan pricing
```

Message:

```text
Hi {{first_name}},

Pricing is fixed-scope and one-time:

- MCP Quick Audit: $750
- MCP Launch Audit: $1,500
- MCP Enterprise Readiness Audit: $3,500

Most launch teams should use the MCP Launch Audit. It is designed for teams preparing customer pilots, internal rollout, or vendor/security review around MCP-enabled tools.

Checkout link:
{{launch_audit_checkout_url}}

Thanks,
MCPScan
```

## Reply Type: What Do You Need

Subject:

```text
MCPScan intake materials
```

Message:

```text
Hi {{first_name}},

For a first MCPScan audit, sanitized materials are enough to start:

- MCP server or config list
- sanitized MCP config files
- list of tools exposed by each server
- which tools can read, write, delete, send, deploy, or access customer data
- launch or security-review deadline
- any systems that should be explicitly out of scope

Please do not send production credentials, active tokens, customer data, or sensitive files through email or public issues. If sensitive evidence is needed, we will confirm a private handoff path first.

Secure intake guidance:
{{secure_intake_url}}

Thanks,
MCPScan
```

## Reply Type: Is This A Pentest

Subject:

```text
MCPScan audit scope
```

Message:

```text
Hi {{first_name}},

MCPScan is not positioned as a full penetration test or certification.

It is a practical MCP readiness audit for teams connecting AI agents to real tools, credentials, code, docs, tickets, customer data, internal APIs, or SaaS actions.

The deliverable is a risk-ranked report with evidence, remediation priorities, and an approval recommendation. The goal is to help your team decide whether each MCP setup should be approved, approved with guardrails, or blocked until remediation.

If you need formal pentest coverage, we should treat MCPScan as a focused MCP layer review that can sit alongside that work.

Thanks,
MCPScan
```

## Reply Type: Talk To Security

Subject:

```text
MCPScan security review context
```

Message:

```text
Hi {{first_name}},

That makes sense. The right security owner is usually the person responsible for AppSec, platform security, AI tooling governance, or customer trust review.

Short version you can forward:

MCPScan reviews MCP servers before rollout by inventorying exposed tools, classifying read/write/destructive actions, checking auth and secret-handling risks, reviewing prompt-injection and tool-description exposure, and producing a remediation checklist. It does not require production credentials or customer data to begin.

Happy to send the one-page scope if helpful.

Thanks,
MCPScan
```

## Reply Type: Not Now

Subject:

```text
Re: MCPScan
```

Message:

```text
Hi {{first_name}},

Totally fair.

I will close the loop for now. The best time to revisit is before MCP gets connected to production data, customer-facing workflows, internal tickets, code repositories, CI/CD, or broad SaaS tools.

Thanks,
MCPScan
```

## Reply Type: Can You Send Proof

Subject:

```text
MCPScan sample report
```

Message:

```text
Hi {{first_name}},

Yes. Here is the sample report:

{{sample_report_url}}

It shows the format buyers receive: inventory, grade, risk-ranked findings, evidence, remediation steps, and an approval recommendation.

The paid audit uses the same structure, with customer-specific context added after authorized intake.

Thanks,
MCPScan
```

## Approval Template

```text
I approve staging this exact MCPScan reply.

Account: {{account}}
Channel: {{email_or_linkedin_or_contact_form}}
Recipient: {{name}}, {{title}}, {{company}}
Contact or profile URL: {{contact_or_profile_url}}
Source URL: {{public_signal_url}}
Reply type: {{reply_type}}

Final message:
{{paste_exact_message}}

Approved action:
Stage this approved reply outside the public repo for manual sending review. Do not send automatically.
```

After approval, stage the reply packet outside the public repo:

```text
npm run outbound:stage-reply -- --file /path/to/approved-reply.txt
```
