import type { SecurityCheck } from "../../types.js";
import { result, schemaProperties, schemaType, toolText } from "../helpers.js";

const fileToolPatterns = [/\b(file|filesystem|path|directory|folder|read|write|upload|download|delete)\b/i];
const pathArgumentPatterns = [/\b(path|file|filename|filepath|dir|directory|folder|destination|source)\b/i];

export const pathTraversalCheck: SecurityCheck = {
  id: "INPUT-003",
  name: "Path traversal via file-related tools",
  category: "INPUT",
  severity: "high",
  async run(server) {
    const riskyTool = server.tools.find((tool) => {
      const text = toolText(tool);
      const fileLikeTool = fileToolPatterns.some((pattern) => pattern.test(text));
      return schemaProperties(tool).some((property) => {
        const acceptsPath = pathArgumentPatterns.some((pattern) => pattern.test(property.name));
        const hasGuardrail = typeof property.schema.pattern === "string" || Array.isArray(property.schema.enum);
        return fileLikeTool && acceptsPath && schemaType(property.schema) === "string" && !hasGuardrail;
      });
    });

    return result(this, !riskyTool, {
      finding: riskyTool ? "A file-related tool accepts caller-controlled paths without visible schema constraints." : "No unconstrained file path arguments were detected.",
      evidence: riskyTool ? `Tool "${riskyTool.name}" matched file path traversal heuristics.` : "Checked file-oriented tool names, descriptions, and path-like schema properties.",
      remediation: "Resolve paths against an approved workspace root, reject '..' segments and absolute paths, and enforce schema patterns or enums for allowed locations.",
      references: ["OWASP Path Traversal", "CWE-22: Improper Limitation of a Pathname", "OWASP MCP Top 10: unsafe tool input"]
    });
  }
};
