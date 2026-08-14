# Approved Send Logging

Use this immediately after the founder manually sends an approved outbound message or approved reply.

## Rule

This flow logs the send only. It does not send email, LinkedIn messages, Slack messages, or contact-form submissions.

## Log A Manual Send

Use the `manifest.json` from a staged outbound or reply packet:

```text
npm run outbound:log-send -- --manifest /path/outside/public/repo/manifest.json
```

Optional explicit send date:

```text
npm run outbound:log-send -- --manifest /path/outside/public/repo/manifest.json --date YYYY-MM-DD
```

By default, the log is written outside the public repo:

```text
~/MCPScan Revenue Logs/
```

## Output

Each send log contains:

- `send-log.json`
- `follow-up-schedule.csv`

The schedule creates follow-up dates at 2, 6, and 12 business days after the manual send.

## Stop Conditions

- Do not log sends for unapproved messages.
- Do not store prospect private data inside the public repo.
- Do not send follow-ups until the exact final follow-up is approved in the same turn.
- Do not send checkout links until Stripe Payment Links are approved and live.
- Do not send from a new mailbox until MX, SPF, DKIM, and DMARC pass.
