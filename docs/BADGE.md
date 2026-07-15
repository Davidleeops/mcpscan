# MCPScan Badge

The landing page publishes a simple static Shields-compatible endpoint at:

```text
https://davidleeops.github.io/mcpscan/badge.json
```

Use it with Shields.io:

```markdown
[![MCP readiness: sample](https://img.shields.io/endpoint?url=https%3A%2F%2Fdavidleeops.github.io%2Fmcpscan%2Fbadge.json)](https://davidleeops.github.io/mcpscan/)
```

Rendered badge:

[![MCP readiness: sample](https://img.shields.io/endpoint?url=https%3A%2F%2Fdavidleeops.github.io%2Fmcpscan%2Fbadge.json)](https://davidleeops.github.io/mcpscan/)

## What It Means

This badge is a sample MCP readiness marker for teams that want to show they are
using MCPScan materials or preparing for an MCP security review. It does not mean
that MCPScan has certified, endorsed, audited, or continuously monitored the
project.

For customer-specific audit outcomes, use the written report and remediation
summary delivered for that engagement instead of this public sample badge.

## Self-Hosting

To publish a project-specific badge, copy the JSON shape and host it from your
own repository or static site:

```json
{
  "schemaVersion": 1,
  "label": "MCP readiness",
  "message": "sample",
  "color": "blue"
}
```

Then replace the `url=` value in the Shields endpoint badge with the
URL-encoded location of your JSON file.
