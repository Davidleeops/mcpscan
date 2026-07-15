import type { SecurityCheck } from "../../types.js";
import { hasAny, result, textBlob } from "../helpers.js";

const exposedKeyPatterns = [
  /[?&](api[_-]?key|token|access[_-]?token|client[_-]?secret)=/i,
  /\b(api[_-]?key|token|client[_-]?secret)\s*=\s*["']?(sk-[a-z0-9_-]{16,}|[a-z0-9_-]{24,})/i,
  /\b(api[_-]?key|token|client[_-]?secret)\s*[:]\s*["']?(sk-[a-z0-9_-]{16,}|[a-z0-9_-]{24,})/i,
  /\b--(api[_-]?key|token|client[_-]?secret)\s+(sk-[a-z0-9_-]{16,}|[a-z0-9_-]{24,})/i,
  /\b(api[_-]?key|token|client[_-]?secret)\b.*\b(example|demo|test|changeme|password|admin)\b/i
];

export const apiKeyTransportCheck: SecurityCheck = {
  id: "AUTH-003",
  name: "API key exposure in transport",
  category: "AUTH",
  severity: "high",
  async run(server) {
    const match = hasAny(textBlob(server), exposedKeyPatterns);

    return result(this, !match, {
      finding: match ? "API key or token material appears exposed in URL, command, or static configuration." : "No exposed API key transport patterns were detected.",
      evidence: match ? `Matched pattern ${match.source}` : "Checked URL, command arguments, environment values, and config text.",
      remediation:
        "Keep API keys out of URLs and command arguments, use managed secrets or environment references, redact logs, and rotate exposed credentials.",
      references: [
        "OWASP MCP Top 10: credential exposure",
        "NSA MCP security advisory: credential hygiene",
        "CWE-598: Use of GET Request Method With Sensitive Query Strings"
      ]
    });
  }
};
