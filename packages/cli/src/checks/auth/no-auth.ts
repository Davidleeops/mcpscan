import type { SecurityCheck } from "../../types.js";
import { result, textBlob } from "../helpers.js";

export const noAuthCheck: SecurityCheck = {
  id: "AUTH-001",
  name: "No authentication required",
  category: "AUTH",
  severity: "high",
  async run(server) {
    const text = textBlob(server);
    const authHints = /(authorization|bearer|api[_-]?key|oauth|client[_-]?secret|token)/i.test(text);
    return result(this, authHints, {
      finding: authHints
        ? "Authentication material or auth configuration was detected."
        : "No authentication configuration was detected in the target.",
      evidence: authHints ? "Found auth-related keys or token references." : "No bearer token, API key, OAuth, or authorization hints found.",
      remediation: "Require authentication for remote MCP servers and validate every client request before tool execution.",
      references: ["OWASP MCP Top 10: authentication and authorization failures", "NSA MCP security advisory: access control guidance"]
    });
  }
};
