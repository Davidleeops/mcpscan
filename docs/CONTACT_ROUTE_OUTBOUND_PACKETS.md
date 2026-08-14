# Contact Route Outbound Packets

Generated: 2026-08-14

Use this when named personal recipients are not ready yet. It creates first-wave approval packets aimed at official contact routes, security inboxes, partner forms, or public company contact forms.

## Command

```text
npm run outbound:compose-contact-routes -- --sender David
```

With exact contact routes:

```text
npm run outbound:compose-contact-routes -- --routes /path/to/contact-routes.csv --sender David
```

Route CSV format:

```text
account,channel,contact_route_url
Vapi,Official contact form,https://example.com/contact
Retool,Security inbox,security@example.com
```

Generated drafts are written to:

```text
sales/generated-outbound/
```

That folder is ignored by git.

## Rule

Do not send anything from generated packets until the founder approves the exact route, exact recipient description, and exact final message in the same turn.

## Why This Exists

This avoids waiting on personal contact sourcing when there is already a useful official route. It also avoids scraped personal data and keeps the first motion clean.
