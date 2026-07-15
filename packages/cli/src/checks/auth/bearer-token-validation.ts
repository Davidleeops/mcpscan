import type { SecurityCheck } from "../../types.js";
import { hasAny, result, textBlob } from "../helpers.js";

const authHintPatterns = [/\bauthorization\b/i, /\bbearer\b/i, /\boauth\b/i, /\btoken\b/i, /\bapi[_-]?key\b/i];
const weakValidationPatterns = [
  /\baccept[_-]?any[_-]?token\b/i,
  /\bskip[_-]?auth\b/i,
  /\bdisable[_-]?auth\b/i,
  /\bno[_-]?verify\b/i,
  /\bverify[_-]?token\s*[:=]\s*false\b/i,
  /\bvalidate[_-]?token\s*[:=]\s*false\b/i,
  /\ballow[_-]?anonymous\b/i
];

export const bearerTokenValidationCheck: SecurityCheck = {
  id: "AUTH-002",
  name: "Bearer token validation",
  category: "AUTH",
  severity: "high",
  async run(server) {
    const text = textBlob(server);
    const hasAuthHint = Boolean(hasAny(text, authHintPatterns));
    const weakValidation = hasAny(text, weakValidationPatterns);
    const remoteUnauthenticated = server.kind === "url" && server.httpProbe?.status && server.httpProbe.status < 400;
    const failed = Boolean(weakValidation || remoteUnauthenticated || !hasAuthHint);

    return result(this, !failed, {
      finding: failed
        ? "Bearer/API token validation could not be confirmed for the target."
        : "Authentication and token-validation hints were detected.",
      evidence: weakValidation
        ? `Matched weak validation pattern ${weakValidation.source}`
        : remoteUnauthenticated
          ? `Remote endpoint responded with HTTP ${server.httpProbe?.status} to an unauthenticated probe.`
          : hasAuthHint
            ? "Found auth-related configuration without weak validation markers."
            : "No bearer token, API key, OAuth, or authorization validation hints found.",
      remediation:
        "Validate bearer/API tokens on every request, reject missing/expired/invalid tokens, and avoid bypass flags in production MCP servers.",
      references: [
        "OWASP MCP Top 10: authentication and authorization failures",
        "NSA MCP security advisory: access control guidance",
        "CWE-287: Improper Authentication"
      ]
    });
  }
};
