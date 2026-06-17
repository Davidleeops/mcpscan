import type { SecurityCheck } from "../../types.js";
import { hasAny, result, textBlob } from "../helpers.js";

const sensitivePatterns = [
  /sk-[a-zA-Z0-9_-]{20,}/,
  /ghp_[a-zA-Z0-9]{20,}/,
  /xox[baprs]-[a-zA-Z0-9-]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /password\s*[:=]\s*["']?[^"',\s]+/i,
  /api[_-]?key\s*[:=]\s*["']?[a-zA-Z0-9_-]{12,}/i
];

export const sensitiveDataCheck: SecurityCheck = {
  id: "OUTPUT-001",
  name: "Sensitive data in configuration or responses",
  category: "OUTPUT",
  severity: "medium",
  async run(server) {
    const match = hasAny(textBlob(server), sensitivePatterns);
    return result(this, !match, {
      finding: match ? "Potential secret material was found in scanner-visible target data." : "No common secret patterns were detected.",
      evidence: match ? `Matched pattern ${match.source}` : "Scanned config, environment values, tool names, and descriptions.",
      remediation: "Move secrets to a managed secret store, redact tool output, and avoid returning credentials in MCP responses.",
      references: ["OWASP MCP Top 10: sensitive information disclosure", "NSA MCP security advisory: secret handling"]
    });
  }
};
