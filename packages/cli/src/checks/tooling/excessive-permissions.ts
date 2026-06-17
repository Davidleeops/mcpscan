import type { SecurityCheck } from "../../types.js";
import { hasAny, result, textBlob, toolText } from "../helpers.js";

const permissionPatterns = [
  /--allow-all/i,
  /--allow\s+all/i,
  /--dangerously-skip-permissions/i,
  /\bprivileged\b/i,
  /\broot access\b/i,
  /\badmin access\b/i,
  /\bfull filesystem\b/i,
  /\bread and write (any|all)\b/i,
  /\bdelete (any|all)\b/i,
  /\bexecute arbitrary\b/i
];

export const excessivePermissionsCheck: SecurityCheck = {
  id: "TOOL-002",
  name: "Excessive tool permissions",
  category: "TOOLING",
  severity: "high",
  async run(server) {
    const match = hasAny(textBlob(server), permissionPatterns);
    const riskyTool = server.tools.find((tool) => hasAny(toolText(tool), permissionPatterns));

    return result(this, !match, {
      finding: match ? "The target appears to request broad tool or process permissions." : "No excessive permission language was detected.",
      evidence: riskyTool ? `Tool "${riskyTool.name}" matched excessive permission heuristics.` : match ? `Matched pattern ${match.source}` : "Checked command, config, environment, and tool metadata.",
      remediation: "Run tools with least privilege, narrow filesystem and network scopes, separate read/write/admin capabilities, and require explicit approval for destructive actions.",
      references: ["Principle of Least Privilege", "CWE-250: Execution with Unnecessary Privileges", "OWASP MCP Top 10: excessive permissions"]
    });
  }
};
