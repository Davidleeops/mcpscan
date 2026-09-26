# Outside-In MCP Check

Use this script when a prospect needs a fast public-readiness screen before a scoped MCP Signoff review.

```text
npm run mcp:outside-in -- https://mcp.example.com/mcp "Example Co"
```

The script checks public metadata, unauthenticated initialization behavior, CORS posture, and basic transport headers. It does not use credentials, call tools, fuzz endpoints, or prove that a deployment is secure.

## How It Fits The Offer

This is a quick triage artifact. It helps identify what an enterprise reviewer is likely to ask next, then points to the paid Readiness Pack for evidence that cannot be verified from the outside.

Use it to support:

- A first-response artifact for an inbound lead.
- A preview deliverable for a qualified review request.
- A scope-setting artifact before asking for private configuration or customer materials.

Do not present this as a certification, penetration test, or complete security assessment.
