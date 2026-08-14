# Post-Click Verification

Use this after the founder has bought the domain and mailbox, created Stripe Payment Links, pasted values into the return packet, and approved applying those exact launch values.

## Rule

This command verifies the launch state. It does not buy domains, create Stripe links, send outbound, or start customer delivery.

Open the full return review packet before applying live values:

```text
npm run launch:open-return-review
```

## Standard Run

After the founder has approved the exact return packet and the Stripe QA evidence JSON exists, use the full apply and QA command:

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true
```

If GitHub Actions remains blocked, publish the verified landing folder through the branch fallback:

```text
npm run launch:publish-pages-fallback -- --wait true
```

If Spacemail gives you a DKIM selector:

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true --dkim-selector {{dkim_selector}}
```

Use strict mode only after DNS has propagated and the custom domain is expected to be fully live:

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --qa-file /path/to/stripe-checkout-qa-evidence.json --apply true --dkim-selector {{dkim_selector}} --strict true
```

## Diagnostic Runs Only

```text
npm run launch:verify-return-packet
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt
```

The sample diagnostic command verifies parser and link format with `ops/founder-return-packet.sample.txt`. It does not apply landing links and does not prove checkout QA.

Use this parser-only check for a real approved return packet before applying:

```text
npm run launch:apply-return-packet -- --file /path/to/approved-return-packet.txt --dry-run true
```

## What It Runs

- optional return-packet apply step
- Stripe Payment Link verification
- return packet and Stripe checkout QA consistency verification when `--qa-file` is provided
- Stripe checkout QA evidence verification when `--qa-file` is provided
- DNS and mailbox verification, unless explicitly skipped
- writing rule check
- launch verification against the chosen domain, unless explicitly skipped
- launch status

## Partial Checks

Use these only while waiting for DNS propagation or while testing the handoff parser. They are not launch-complete checks.

```text
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --skip-dns true
npm run launch:post-click-verify -- --file /path/to/approved-return-packet.txt --skip-dns true --skip-launch true
```

Strict mode requires Stripe QA evidence and should not be used with missing live DNS.

## Stop Conditions

- Do not run strict mode before DNS has propagated.
- Do not use `--apply true` until the founder has approved the exact return packet.
- Do not use test Stripe links on the public landing page.
- Do not send outbound until mailbox authentication passes and exact messages are approved.
- Do not put mailbox passwords, Stripe secret keys, or customer data in the return packet.
