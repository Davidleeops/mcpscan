# MCPScan Landing Page

This directory contains a minimal static landing page for MCPScan. It is plain
HTML and CSS with no build step.

## Local Preview

Open `landing/index.html` directly in a browser, or serve the repository root:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080/landing/
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

Use `thank-you.html` as the Stripe redirect page after payment and `intake.html`
as the sanitized intake checklist until a private customer portal exists.
