# Private Revenue Snapshot

Use this to turn private send logs and paid audit status files into a daily operator snapshot.

## Rule

This flow reads and writes private revenue artifacts only. It does not send messages, change public files, or store prospect or customer activity in the public repo.

## Build Snapshot

Default private roots:

```text
npm run revenue:snapshot
```

Custom roots:

```text
npm run revenue:snapshot -- --send-root "/path/to/MCPScan Revenue Logs" --paid-root "/path/to/MCPScan Paid Audits" --output "/path/to/MCPScan Revenue Snapshots"
```

Explicit date:

```text
npm run revenue:snapshot -- --date YYYY-MM-DD
```

## Output

Each dated snapshot contains:

- `revenue-snapshot.json`
- `due-follow-ups.csv`

The snapshot includes:

- manual sends logged
- due follow-ups
- private paid audit status files
- next actions

## Stop Conditions

- Do not point the command at a path inside the public repo.
- Do not commit generated revenue snapshots.
- Do not send follow-ups until the exact final follow-up is approved in the same turn.
- Do not put customer secrets, private configs, customer data, or final private reports in the public repo.
