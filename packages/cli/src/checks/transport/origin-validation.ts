import type { SecurityCheck } from "../../types.js";
import { result, textBlob } from "../helpers.js";

export const originValidationCheck: SecurityCheck = {
  id: "TRANSPORT-003",
  name: "SSE/WebSocket origin validation",
  category: "TRANSPORT",
  severity: "medium",
  async run(server) {
    const isBrowserTransport = server.kind === "url" || /\b(sse|websocket|ws:\/\/|wss:\/\/|eventsource)\b/i.test(textBlob(server));

    if (!isBrowserTransport) {
      return result(this, true, {
        finding: "No SSE/WebSocket transport indicators were detected.",
        evidence: "Checked URL, command, config text, and tool metadata.",
        remediation: "For SSE/WebSocket MCP transports, validate Origin headers and reject untrusted browser origins.",
        references: ["OWASP MCP Top 10: transport and browser-origin controls"]
      });
    }

    const origin = server.httpProbe?.headers["access-control-allow-origin"];
    const credentials = server.httpProbe?.headers["access-control-allow-credentials"];
    const failed = origin === "*" || (origin === "https://evil.example" && credentials === "true") || (!server.httpProbe && server.kind === "url");

    return result(this, !failed, {
      finding: failed ? "SSE/WebSocket origin validation could not be confirmed." : "Origin validation did not allow the test origin.",
      evidence: origin
        ? `access-control-allow-origin=${origin}; access-control-allow-credentials=${credentials ?? "not set"}`
        : server.httpProbe
          ? "No permissive origin response observed during probe."
          : "Remote browser-style transport detected without an HTTP origin probe result.",
      remediation:
        "Reject untrusted Origin headers, avoid credentialed wildcard origins, and bind browser transports to approved application origins.",
      references: [
        "OWASP MCP Top 10: insecure transport configuration",
        "NSA MCP security advisory: browser transport controls",
        "CWE-346: Origin Validation Error"
      ]
    });
  }
};
