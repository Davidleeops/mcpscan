# MCPScan Static Launch Bundle

Use this only if GitHub Pages remains stale or unavailable while a launch change needs to go live.

## Build

```text
npm run launch:bundle
```

The generated folder is:

```text
dist/mcpscan-static-launch/
```

Upload the contents of that folder to a static host such as Netlify, Vercel, Cloudflare Pages, object storage, or a registrar-provided static site tool.

## What It Contains

- Buyer landing page.
- Sample report.
- Secure intake page.
- Post-payment thank-you page.
- Terms, privacy, and refund policy pages.
- Badge JSON endpoint.
- `manifest.json` with the generated file list.
- `BUNDLE_README.txt` with handoff instructions.
- `FALLBACK_UPLOAD_PACKET.md` with freshness proof, upload steps, and stop conditions.

The builder verifies these current buyer-facing markers before the bundle is considered upload-ready:

- `Free scanners produce signals`
- `customer is authorized to submit`
- `MCP Launch Audit`

## Launch Rules

- Do not upload placeholder checkout links as the final paid launch unless intentionally running a placeholder-only waitlist.
- Do not include customer secrets, customer reports, private configs, or customer workspaces in this bundle.
- After domain, mailbox, aliases, and Stripe Payment Links are approved, run the return-packet parser before building the bundle.
- After upload, run launch verification against the selected domain.
- If checkout placeholders remain, use the bundle only as a waitlist or preview site. Do not treat it as a paid checkout launch.

```text
npm run launch:verify -- --domain {{chosen_domain}}
```

## Why This Exists

GitHub Actions and Pages can be blocked by account billing or provider-side availability. The static bundle lets MCPScan still ship the public landing site from a clean local artifact while the account issue is handled.
