# Final Outbound Composer

Generated: 2026-08-14

Use this to turn an approved account, recipient, and channel into an exact same-turn approval packet.

## Command

```text
npm run outbound:compose-final -- --account Vapi --recipient "Jane Doe" --title "Head of Engineering" --contact "https://example.com/profile" --channel Email --sender "David"
```

The command writes a draft packet to:

```text
sales/generated-outbound/
```

This generated folder is for approval drafts only. Do not send anything until the founder approves the exact recipient and exact final content in the same turn.

## What The Packet Includes

- account
- channel
- recipient
- contact or profile URL
- source URL
- exact first message
- exact follow-up 1
- exact follow-up 2
- parser-ready same-turn approval text

## After Approval

Copy the approval text into a temporary file and stage it outside the public repo:

```text
npm run outbound:stage-approved -- --file /path/to/approved-outbound.txt
```

The staging command does not send automatically.

## Safety Rules

- Use only public signals or founder-provided recipient data.
- Do not imply the target has a vulnerability.
- Do not scan third-party systems without written authorization.
- Do not send outbound until the sending domain has SPF, DKIM, and DMARC passing.
