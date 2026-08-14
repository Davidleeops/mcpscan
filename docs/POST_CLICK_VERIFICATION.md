# Post-Click Verification

Use this after the founder has bought the domain and mailbox, created Stripe Payment Links, pasted values into the return packet, and approved applying those exact launch values.

## Rule

This command verifies the launch state. It does not buy domains, create Stripe links, send outbound, or start customer delivery.

## Standard Run

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt
```

If Spacemail gives you a DKIM selector:

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --dkim-selector {{dkim_selector}}
```

Use strict mode only after DNS has propagated and the custom domain is expected to be fully live:

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --dkim-selector {{dkim_selector}} --strict true
```

## What It Runs

- Stripe Payment Link verification
- DNS and mailbox verification
- writing rule check
- launch verification against the chosen domain
- launch status

## Stop Conditions

- Do not run strict mode before DNS has propagated.
- Do not use test Stripe links on the public landing page.
- Do not send outbound until mailbox authentication passes and exact messages are approved.
- Do not put mailbox passwords, Stripe secret keys, or customer data in the return packet.
