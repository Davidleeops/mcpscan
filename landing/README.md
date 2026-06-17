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
```

## Fast Deploy Options

Any static host can deploy this directory:

- Netlify: create a site from `landing/` with no build command.
- Vercel: deploy `landing/` as a static project with no framework preset.
- GitHub Pages: publish the `landing/` directory or copy `index.html` into the
  configured Pages root.
- Object storage/CDN: upload `index.html` as the landing page entrypoint.

## Before Publishing

Replace every `PLACEHOLDER_*` URL in `index.html` before sending traffic to the
page. See `docs/LANDING_PAGE.md` for the publishing checklist.
