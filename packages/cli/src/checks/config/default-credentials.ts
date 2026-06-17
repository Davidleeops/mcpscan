import type { SecurityCheck } from "../../types.js";
import { hasAny, result, textBlob } from "../helpers.js";

const defaultCredentialPatterns = [
  /["']?password["']?\s*[:=]\s*["']?(admin|password|changeme|test|example)["']?/i,
  /["']?api[_-]?key["']?\s*[:=]\s*["']?(test|example|changeme|demo|placeholder)["']?/i,
  /["']?token["']?\s*[:=]\s*["']?(test|example|changeme|demo|placeholder)["']?/i
];

export const defaultCredentialsCheck: SecurityCheck = {
  id: "CONFIG-003",
  name: "Default or example credentials",
  category: "CONFIG",
  severity: "high",
  async run(server) {
    const match = hasAny(textBlob(server), defaultCredentialPatterns);
    return result(this, !match, {
      finding: match ? "Default, demo, or placeholder credentials were detected." : "No default credential patterns were detected.",
      evidence: match ? `Matched pattern ${match.source}` : "Scanned config text and environment values.",
      remediation: "Rotate credentials and replace example values with managed secrets before deploying the MCP server.",
      references: ["OWASP MCP Top 10: insecure configuration", "NSA MCP security advisory: credential hygiene"]
    });
  }
};
