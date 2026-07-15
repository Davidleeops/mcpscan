# First Revenue Pipeline

Use this to track accounts from research through paid delivery.

Template:

```text
sales/first-revenue-pipeline-template.csv
```

## Stages

| Stage | Meaning | Exit Criteria |
| --- | --- | --- |
| Research | Account has a possible MCP trigger. | Trigger source and likely buyer persona captured. |
| Qualified | Account score is 6+ or has a strong named trigger. | Exact recipient and draft angle identified. |
| Approved to contact | User approved exact recipient and exact final message in the same turn. | Message sent manually through approved channel. |
| Interested | Prospect replied or otherwise showed interest. | Checkout/scope link approved and sent. |
| Paid | Payment received. | Secure intake complete and workspace created outside public repo. |
| Delivered | Report delivered. | Findings call/re-scan handled if included. |

## Required Fields Before Outreach

- Account
- Contact name or exact recipient
- Contact role/persona
- Contact channel
- Source URL
- Trigger
- Score
- Recommended offer
- Draft angle
- Approval status

Outbound rule:

```text
No external message is sent until exact recipient and exact final content are approved in the same turn.
```

Customer data rule:

```text
Do not store customer secrets, private configs, customer data, or final private reports in this public repo.
```

