# Approved Outbound Staging

Use this after the founder approves one exact recipient and one exact final message in the same turn.

## Rule

This flow stages the outbound packet only. It does not send email, LinkedIn messages, Slack messages, or contact-form submissions.

## Approval Message

Use `ops/outbound-recipient-approval-builder.html` to build the exact approval message.

The required approval phrase is:

```text
I approve staging this exact MCPScan outbound message
```

The required no-send phrase is:

```text
Do not send automatically
```

## Stage The Packet

After approval, save the approved message to a temporary file and run:

```text
npm run outbound:stage-approved -- --file /path/to/approved-outbound.txt
```

Before requesting approval, check candidate readiness:

```text
npm run outbound:verify
```

Before any manual send from the launch mailbox, run:

```text
npm run outbound:send-gates
```

That command checks the private founder approval tracker for live domain, mailbox DNS, Stripe QA, landing link, and approval gates. Do not send if it fails.

By default, the packet is written outside the public repo:

```text
~/MCPScan Outbound Approvals/
```

## Output

Each staged packet contains:

- `APPROVED_OUTBOUND_PACKET.md`
- `manifest.json`

## Stop Conditions

- Do not stage unapproved recipients.
- Do not stage messages with scraped or unverified personal data.
- Do not send until the founder separately approves the send action or performs the send.
- Do not send from a new mailbox until MX, SPF, DKIM, and DMARC are live.
- Do not send checkout links until Stripe Payment Links are approved and live.
