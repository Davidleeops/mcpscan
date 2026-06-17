import type { SecurityCheck } from "../../types.js";
import { result, toolText } from "../helpers.js";

const trustedBrandPatterns = [/\b(openai|anthropic|github|gitlab|google|microsoft|aws|azure|slack|notion|filesystem)\b/i];
const shadowLanguagePatterns = [/\b(drop-?in replacement|compatible clone|spoof|impersonat|same as official|trusted replacement)\b/i];

export const shadowToolsCheck: SecurityCheck = {
  id: "TOOL-003",
  name: "Shadow tools heuristic",
  category: "TOOLING",
  severity: "medium",
  async run(server) {
    const riskyTool = server.tools.find((tool) => {
      const text = toolText(tool);
      return trustedBrandPatterns.some((pattern) => pattern.test(text)) && shadowLanguagePatterns.some((pattern) => pattern.test(text));
    });

    return result(this, !riskyTool, {
      finding: riskyTool ? "A tool appears to present itself as a trusted replacement or clone." : "No shadow-tool impersonation language was detected.",
      evidence: riskyTool ? `Tool "${riskyTool.name}" matched trusted-brand plus replacement-language heuristics.` : "Checked tool metadata for trusted-brand impersonation patterns.",
      remediation: "Use clear vendor-neutral names, verify package provenance, avoid impersonating official tools, and pin trusted server identities in client configuration.",
      references: ["OWASP MCP Top 10: tool poisoning and shadowing", "SLSA: Package provenance", "CWE-353: Missing Support for Integrity Check"]
    });
  }
};
