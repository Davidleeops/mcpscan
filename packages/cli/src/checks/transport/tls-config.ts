import type { SecurityCheck } from "../../types.js";
import { result } from "../helpers.js";

export const tlsConfigCheck: SecurityCheck = {
  id: "TRANSPORT-001",
  name: "TLS/SSL configuration",
  category: "TRANSPORT",
  severity: "medium",
  async run(server) {
    if (!server.url) {
      return result(this, true, {
        finding: "TLS check is not applicable to non-URL targets.",
        evidence: "Target is a config file or local command.",
        remediation: "Use HTTPS with valid certificates for any remote MCP transport.",
        references: ["OWASP MCP Top 10: insecure transport"]
      });
    }

    const isHttps = server.url.startsWith("https://");
    const tls = server.httpProbe?.tls;
    const passed = isHttps && !server.httpProbe?.error && tls?.authorized !== false;
    return result(this, passed, {
      finding: passed ? "HTTPS endpoint responded with an authorized TLS connection." : "Remote endpoint did not pass the TLS probe.",
      evidence: server.httpProbe?.error ?? `protocol=${tls?.protocol ?? "unknown"}, authorized=${String(tls?.authorized ?? false)}`,
      remediation: "Serve MCP endpoints over HTTPS with a valid certificate and modern TLS settings.",
      references: ["OWASP MCP Top 10: transport security", "NSA MCP security advisory: encrypted channels"]
    });
  }
};
