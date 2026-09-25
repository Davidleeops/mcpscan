# MCP Signoff Landing Page

This directory contains a minimal static landing page for MCP Signoff. It is plain
HTML and CSS with no build step.

## Local Preview

Open `landing/index.html` directly in a browser, or serve the repository root:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080/landing/
http://localhost:8080/landing/quiz.html
http://localhost:8080/landing/thank-you.html
http://localhost:8080/landing/intake.html
```

## Fast Deploy Options

Any static host can deploy this directory:

- Netlify: create a site from `landing/` with no build command.
- Vercel: deploy `landing/` as a static project with no framework preset.
- GitHub Pages: the repository includes `.github/workflows/pages.yml`, which
  deploys this directory automatically on pushes to `main`.
- Object storage/CDN: upload `index.html` as the landing page entrypoint.

## Before Publishing

Replace temporary GitHub issue CTAs with Stripe Payment Links before sending
paid traffic. See `docs/LANDING_PAGE.md` for the publishing checklist.

From the repo root, use the launch front door before publishing or sending
traffic:

```bash
npm run launch:next
```

Use `thank-you.html` as the Stripe redirect page after payment and `intake.html`
as the sanitized intake checklist until a private customer portal exists.

## Sample Report

GitHub Pages regenerates `sample-report.html` from the intentionally risky
commercial fixture before deploy. To refresh it locally after building:

```bash
npm run build
npm run landing:sample-report
```

## Review assessment

The conversion flow is five questions, a personalized preview, one email field,
a full decision artifact, and a segment-specific scope request. The server must
confirm durable capture before the full artifact is returned. There is no email
sending claim: delivery is immediate on the page, with text download and print.

Run the local server from the repository root:

```sh
MCPSCAN_PREVIEW_DATA_DIR=/private/tmp/mcpscan-quiz-preview-data node server/preview-server.mjs
```

Open `http://127.0.0.1:8767/quiz.html`. Local test leads are stored outside this
repository. The local service binds only to loopback and is not a production host.
Do not run this on a public interface or commit its data file.

Production capture uses a Supabase Edge Function configured in `quiz-config.js`.
The function stores leads and review requests in dedicated MCP Signoff tables inside
the existing cranegenius Supabase project. GitHub Pages cannot itself accept POSTs,
so the page must keep using the verified HTTPS endpoint. Never treat a mailto link
or a browser variable as captured lead data.

The artifact contains priorities, two decision-specific evidence sections,
a boundary statement, and an explanation of the reviewed work offered next.
The CTA persists a separate review request without authorizing a purchase.
Unknown access routes to inventory first; the next step does not claim an audit
or scanner has verified the environment.

Local `mcpscan:quiz` events distinguish quiz starts, question completion, lead-gate
views, capture success/failure, artifact views/downloads/prints, and review requests.
No external analytics provider is connected. Event payloads exclude email and raw
answers. Measure qualified review requests per visitor and per captured lead, not
completion alone. Captured addresses are explicitly unverified.
