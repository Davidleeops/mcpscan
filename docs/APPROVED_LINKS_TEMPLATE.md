# Approved Launch Links Template

Fill this only after the owner has approved the public values. Do not put API
keys, passwords, npm tokens, Stripe secret keys, or mailbox passwords here.

```text
DOMAIN=mcpscanhq.com
EMAIL=hello@mcpscanhq.com
STRIPE_QUICK=https://buy.stripe.com/...
STRIPE_LAUNCH=https://buy.stripe.com/...
STRIPE_ENTERPRISE=https://buy.stripe.com/...
```

Then Codex can run:

```bash
npm run launch:apply-links -- \
  --domain "$DOMAIN" \
  --email "$EMAIL" \
  --quick "$STRIPE_QUICK" \
  --launch "$STRIPE_LAUNCH" \
  --enterprise "$STRIPE_ENTERPRISE"
```

Expected changes:

- `landing/index.html` pricing buttons point to Stripe.
- `landing/index.html` scope/contact button points to `mailto:`.
- `landing/CNAME` is created for GitHub Pages.
- public URLs in launch docs point to the custom domain.
- terms, privacy, and refund policy URLs point to the custom domain.
- `SECURITY.md` uses the public email contact.
