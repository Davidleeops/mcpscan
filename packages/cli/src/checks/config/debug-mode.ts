import type { SecurityCheck } from "../../types.js";
import { hasAny, result, textBlob } from "../helpers.js";

const debugPatterns = [
  /\bdebug\s*[:=]\s*true\b/i,
  /\bdebug[_-]?mode\b/i,
  /\bverbose[_-]?errors?\s*[:=]\s*true\b/i,
  /\bNODE_ENV\s*[:=]\s*development\b/i,
  /\b--inspect\b/i,
  /\b--debug\b/i,
  /\btrace[_-]?errors?\b/i
];

export const debugModeCheck: SecurityCheck = {
  id: "CONFIG-002",
  name: "Debug mode enabled",
  category: "CONFIG",
  severity: "medium",
  async run(server) {
    const match = hasAny(textBlob(server), debugPatterns);

    return result(this, !match, {
      finding: match ? "Debug or verbose error mode appears enabled." : "No debug-mode indicators were detected.",
      evidence: match ? `Matched pattern ${match.source}` : "Checked command, environment, config text, and tool metadata.",
      remediation:
        "Disable debug and inspector modes in production, return sanitized errors to MCP clients, and keep detailed traces in protected logs only.",
      references: [
        "OWASP MCP Top 10: insecure configuration",
        "CWE-489: Active Debug Code",
        "CWE-209: Generation of Error Message Containing Sensitive Information"
      ]
    });
  }
};
