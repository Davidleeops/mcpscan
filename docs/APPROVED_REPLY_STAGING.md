# Approved Reply Staging

Use this after a prospect replies and the founder approves one exact recipient and one exact final reply in the same turn.

## Rule

This flow stages the reply packet only. It does not send email, LinkedIn messages, Slack messages, or contact-form submissions.

## Approval Message

Use `sales/reply-to-close-packet.md` to choose the right response and fill the approval template.

The required approval phrase is:

```text
I approve staging this exact MCPScan reply.
```

The required no-send phrase is:

```text
Do not send automatically
```

## Stage The Reply

After approval, save the approved reply message to a temporary file and run:

```text
npm run outbound:stage-reply -- --file /path/to/approved-reply.txt
```

By default, the packet is written outside the public repo:

```text
~/MCPScan Reply Approvals/
```

## Output

Each staged reply contains:

- `APPROVED_REPLY_PACKET.md`
- `manifest.json`

## Stop Conditions

- Do not stage unapproved replies.
- Do not stage replies with template placeholders still present.
- Do not send until the founder separately approves the send action or performs the send.
- Do not send checkout links until Stripe Payment Links are approved and live.
- Do not send from a new mailbox until MX, SPF, DKIM, and DMARC pass.
