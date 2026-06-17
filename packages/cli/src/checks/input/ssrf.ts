import type { SecurityCheck } from "../../types.js";
import { result } from "../helpers.js";

export const ssrfCheck: SecurityCheck = {
  id: "INPUT-004",
  name: "SSRF via URL-accepting tools",
  category: "INPUT",
  severity: "high",
  async run(server) {
    const riskyTool = server.tools.find((tool) => /(url|fetch|http|request|web|search)/i.test(`${tool.name} ${tool.description ?? ""}`));
    return result(this, !riskyTool, {
      finding: riskyTool ? "A tool appears to accept or fetch arbitrary URLs." : "No URL-fetching tools were inferred.",
      evidence: riskyTool ? `Tool "${riskyTool.name}" matched URL-fetching heuristics.` : "Tool names and descriptions did not match URL fetch patterns.",
      remediation: "Add URL allowlists, block private/link-local ranges, reject file:// URLs, and set outbound request timeouts.",
      references: ["OWASP MCP Top 10: SSRF and unsafe tool input", "NSA MCP security advisory: network egress restrictions"]
    });
  }
};
