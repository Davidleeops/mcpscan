# Batch Send Logging

Use this after all 10 approved first-wave route or named-recipient messages have been manually sent from the authenticated mailbox.

## Rule

This command does not send messages. It only converts private staged first-10 manifests into private send logs and follow-up schedules.

## Log A First-10 Batch

```text
npm run outbound:log-first-10-batch -- --batch "/path/to/MCPScan Outbound Approvals/YYYY-MM-DD_first-10-route-approvals"
npm run outbound:log-first-10-batch -- --batch "/path/to/MCPScan Outbound Approvals/YYYY-MM-DD_first-10-named-approvals"
```

Use an explicit send date when needed:

```text
npm run outbound:log-first-10-batch -- --batch "/path/to/MCPScan Outbound Approvals/YYYY-MM-DD_first-10-route-approvals" --date YYYY-MM-DD
```

Custom private revenue-log root:

```text
npm run outbound:log-first-10-batch -- --batch "/path/to/batch" --root "/path/to/MCPScan Revenue Logs"
```

## Output

The command creates one private send log per approved manifest, including:

- `send-log.json`
- `follow-up-schedule.csv`

After logging, run:

```text
npm run revenue:snapshot
```

## Stop Conditions

- Do not run this before the 10 messages are actually sent manually.
- Do not point `--batch` or `--root` at a path inside the public repo.
- Do not commit generated send logs.
- Do not send follow-ups until the exact final follow-up is approved in the same turn.
