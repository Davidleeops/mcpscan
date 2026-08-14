# MCPScan Launch Cockpit

Open this first:

```text
/Users/lemueldavidleejr/Desktop/05_OPS 2/Scripts_and_Code/Codex folder/mcpscan/ops/launch-cockpit.html
```

Or from the repo:

```text
npm run launch:open
```

For the founder-only click path:

```text
npm run launch:open-founder
```

For the current next action stack:

```text
npm run launch:next
```

To prebuild the default cheap-lane DNS and Stripe packets:

```text
npm run launch:prepare-cheap
```

The generated packet folder includes the DNS packet, Stripe setup packet, DNS records CSV, and Stripe products CSV for the default `mcpscan.online` lane. Open `ops/cheap-launch-packet-console.html` for one page that links all of them.

After the founder clicks, use `ops/founder-return-packet.html` to download the approved return message and `ops/stripe-payment-link-qa-console.html` to download the QA evidence JSON.

It points to every founder click gate:

1. Domain and email DNS console
2. Stripe Payment Link console
3. Approved-link command builder: `approved-links-command-builder.html`
4. Pipeline console, prospect sourcing console, outbound approval console, discovery console, and customer comms console
5. npm publish console
6. Paid-audit delivery console
7. Verification console: `verification-console.html`
8. Cost and infrastructure plan: `docs/LAUNCH_COST_AND_INFRASTRUCTURE_PLAN_2026-08-14.md`
9. Daily revenue command: `sales/daily-revenue-command.md`
10. Reply-to-close packet: `sales/reply-to-close-packet.md`
11. Public-safe founder status tracker: `ops/founder-approval-status.template.json`

GitHub issue action board:

```text
ops/GITHUB_ISSUE_ACTION_BOARD.md
```

Founder approval packet:

```text
ops/FOUNDER_APPROVAL_PACKET.md
```

Founder approval status template:

```text
ops/founder-approval-status.template.json
```

The filled local tracker is written automatically by:

```text
npm run launch:apply-return-packet -- --file /path/to/approved-return-packet.txt
```

Hard rules:

- Do not send external messages without same-turn approval of exact recipient and exact final content.
- Do not store customer secrets, private configs, customer data, or final private reports in the public repo.
- Do not send outbound from `security@{{chosen_domain}}` until MX, SPF, DKIM, and DMARC pass.
- Do not publish npm packages until npm login and 2FA/OTP are confirmed.
- Do not buy a novelty promo TLD as the primary security brand unless this is
  intentionally only a temporary redirect.
- Do not send replies from `sales/reply-to-close-packet.md` until exact final
  content is approved in the same turn.

Positioning:

```text
MCPScan is a pre-enablement MCP readiness audit for teams turning on Copilot,
Claude Code, Cursor, VS Code agent mode, Slack MCP, or Atlassian Rovo.
```
