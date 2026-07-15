import type { SecurityCheck } from "../../types.js";
import { hasAny, result, textBlob } from "../helpers.js";

const staticSessionPatterns = [
  /\bsession[_-]?id["']?\s*[:=]\s*["']?(default|static|shared|test|demo|admin|changeme)\b/i,
  /\brefresh[_-]?token["']?\s*[:=]\s*["']?(default|static|shared|test|demo|admin|changeme)\b/i,
  /\bclient[_-]?id["']?\s*[:=]\s*["']?(default|static|shared|test|demo|admin|changeme)\b/i,
  /\b(single|shared|global)[_-]?(session|token|client)\b/i,
  /\breuse[_-]?(session|token)\s*[:=]\s*true\b/i,
  /\bdisable[_-]?session[_-]?rotation\b/i
];

export const sessionTokenReuseCheck: SecurityCheck = {
  id: "AUTH-004",
  name: "Session fixation and token reuse",
  category: "AUTH",
  severity: "medium",
  async run(server) {
    const match = hasAny(textBlob(server), staticSessionPatterns);

    return result(this, !match, {
      finding: match ? "The configuration suggests static, shared, or reusable session/token material." : "No static session or token reuse patterns were detected.",
      evidence: match ? `Matched pattern ${match.source}` : "Checked config, command, environment values, and tool metadata.",
      remediation:
        "Issue per-client sessions, rotate tokens, bind sessions to authenticated principals, and avoid shared/static MCP client credentials.",
      references: [
        "OWASP MCP Top 10: authentication and authorization failures",
        "CWE-384: Session Fixation",
        "CWE-613: Insufficient Session Expiration"
      ]
    });
  }
};
