import type { SecurityCheck } from "../../types.js";
import { result } from "../helpers.js";

export const corsCheck: SecurityCheck = {
  id: "CONFIG-001",
  name: "Overly permissive CORS",
  category: "CONFIG",
  severity: "medium",
  async run(server) {
    const origin = server.httpProbe?.headers["access-control-allow-origin"];
    const credentials = server.httpProbe?.headers["access-control-allow-credentials"];
    const failed = origin === "*" || (origin === "https://evil.example" && credentials === "true");
    return result(this, !failed, {
      finding: failed ? "The remote endpoint appears to allow broad cross-origin access." : "No overly permissive CORS behavior was detected.",
      evidence: origin ? `access-control-allow-origin=${origin}` : "No permissive CORS header observed during OPTIONS probe.",
      remediation: "Restrict CORS origins to trusted application domains and avoid credentialed wildcard access.",
      references: ["OWASP MCP Top 10: insecure configuration", "NSA MCP security advisory: browser transport controls"]
    });
  }
};
