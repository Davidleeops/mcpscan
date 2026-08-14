# Follow-Up Approval Composer

Use this after a manual send has been logged with `npm run outbound:log-send`.

## Rule

This flow drafts an approval packet only. It does not send email, LinkedIn messages, Slack messages, or contact-form submissions.

## Compose A Follow-Up Approval Packet

Use the private `send-log.json` created by approved send logging:

```text
npm run outbound:compose-follow-up -- --file /path/outside/public/repo/send-log.json --step follow-up-1
```

Supported steps:

- `follow-up-1`
- `follow-up-2`
- `final-follow-up`

Optional sender name:

```text
npm run outbound:compose-follow-up -- --file /path/outside/public/repo/send-log.json --step follow-up-2 --sender "{{sender_name}}"
```

Optional private output file:

```text
npm run outbound:compose-follow-up -- --file /path/outside/public/repo/send-log.json --step final-follow-up --output /path/outside/public/repo/final-follow-up-approval.txt
```

## Stage After Approval

After the founder approves the exact follow-up packet in the same turn, stage it outside the public repo:

```text
npm run outbound:stage-approved -- --file /path/to/approved-follow-up.txt
```

## Stop Conditions

- Do not compose from a send log inside the public repo.
- Do not send follow-ups until the exact final follow-up is approved in the same turn.
- Do not send checkout links until Stripe Payment Links are approved and live.
- Do not send from a new mailbox until MX, SPF, DKIM, and DMARC pass.
