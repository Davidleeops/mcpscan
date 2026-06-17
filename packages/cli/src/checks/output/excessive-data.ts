import type { SecurityCheck } from "../../types.js";
import { result, toolText } from "../helpers.js";

const excessiveOutputPatterns = [
  /\b(return|dump|export|list|read|show)\b.*\b(all|entire|full|raw|complete)\b/i,
  /\b(all|entire|full|raw|complete)\b.*\b(records|database|table|users|customers|files|environment|env|secrets|logs)\b/i,
  /\b(no pagination|without pagination|unredacted|unsanitized)\b/i
];

export const excessiveDataExposureCheck: SecurityCheck = {
  id: "OUTPUT-002",
  name: "Excessive data exposure",
  category: "OUTPUT",
  severity: "medium",
  async run(server) {
    const riskyTool = server.tools.find((tool) => excessiveOutputPatterns.some((pattern) => pattern.test(toolText(tool))));

    return result(this, !riskyTool, {
      finding: riskyTool ? "A tool appears able to return broad or unredacted datasets." : "No broad data-return patterns were detected.",
      evidence: riskyTool ? `Tool "${riskyTool.name}" matched excessive output heuristics.` : "Checked tool names and descriptions for broad export/dump language.",
      remediation: "Return the minimum fields needed, paginate large results, enforce caller authorization, and redact secrets or personal data before responding.",
      references: ["OWASP API Security: Excessive Data Exposure", "CWE-200: Exposure of Sensitive Information", "OWASP MCP Top 10: sensitive information disclosure"]
    });
  }
};
