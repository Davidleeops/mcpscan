import type { SecurityCheck, ToolDefinition } from "../../types.js";
import { result } from "../helpers.js";

function normalizedName(tool: ToolDefinition): string {
  return tool.name.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

export const toolNameCollisionCheck: SecurityCheck = {
  id: "TOOL-004",
  name: "Tool name collision",
  category: "TOOLING",
  severity: "medium",
  async run(server) {
    const seen = new Map<string, string>();
    let collision: { first: string; second: string } | undefined;

    for (const tool of server.tools) {
      const normalized = normalizedName(tool);
      const previous = seen.get(normalized);
      if (previous && previous !== tool.name) {
        collision = { first: previous, second: tool.name };
        break;
      }
      seen.set(normalized, tool.name);
    }

    return result(this, !collision, {
      finding: collision ? "Two tools have names that normalize to the same identifier." : "No normalized tool name collisions were detected.",
      evidence: collision ? `"${collision.first}" collides with "${collision.second}" after case/separator normalization.` : "Compared tool names after lowercasing and removing separators.",
      remediation: "Give each tool a unique, explicit name and reject duplicate normalized names during server startup or client registration.",
      references: ["OWASP MCP Top 10: tool confusion and shadowing", "CWE-178: Improper Handling of Case Sensitivity", "CWE-180: Incorrect Behavior Order"]
    });
  }
};
