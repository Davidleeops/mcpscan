import type { SecurityCheck } from "../../types.js";
import { hasAny, result, textBlob } from "../helpers.js";

const errorDisclosurePatterns = [
  /\bstack trace\b/i,
  /\btraceback\b/i,
  /\breturn(s|ing)? raw errors?\b/i,
  /\berror\.stack\b/i,
  /\bexception details\b/i,
  /\bdebug mode\b/i,
  /\bverbose errors?\b/i
];

export const errorDisclosureCheck: SecurityCheck = {
  id: "OUTPUT-003",
  name: "Error message information disclosure",
  category: "OUTPUT",
  severity: "low",
  async run(server) {
    const match = hasAny(textBlob(server), errorDisclosurePatterns);

    return result(this, !match, {
      finding: match ? "Configuration or tool metadata suggests raw debug/error details may be exposed." : "No raw debug or stack-trace disclosure patterns were detected.",
      evidence: match ? `Matched pattern ${match.source}` : "Checked config text, environment, tool names, and descriptions.",
      remediation: "Return stable user-facing error codes, log detailed errors server-side only, and disable debug or verbose exception output in production.",
      references: ["OWASP Error Handling Cheat Sheet", "CWE-209: Information Exposure Through an Error Message", "OWASP API Security: Security Misconfiguration"]
    });
  }
};
