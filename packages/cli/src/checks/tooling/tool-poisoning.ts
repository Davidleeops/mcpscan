import type { SecurityCheck } from "../../types.js";
import { hasAny, result } from "../helpers.js";

const poisoningPatterns = [
  /ignore (all )?(previous|system|developer) instructions/i,
  /do not tell the user/i,
  /hidden instruction/i,
  /exfiltrate/i,
  /send .*secret/i
];

export const toolPoisoningCheck: SecurityCheck = {
  id: "TOOL-001",
  name: "Tool poisoning detection",
  category: "TOOLING",
  severity: "high",
  async run(server) {
    const poisoned = server.tools.find((tool) => hasAny(`${tool.name}\n${tool.description ?? ""}`, poisoningPatterns));
    return result(this, !poisoned, {
      finding: poisoned ? "A tool description contains prompt-injection style language." : "No prompt-injection language was detected in tool descriptions.",
      evidence: poisoned ? `Tool "${poisoned.name}" matched tool-poisoning heuristics.` : "Checked inferred and declared tool metadata.",
      remediation: "Remove hidden behavioral instructions from tool descriptions and keep descriptions factual and capability-focused.",
      references: ["OWASP MCP Top 10: tool poisoning", "NSA MCP security advisory: prompt injection defenses"]
    });
  }
};
