import type { SecurityCheck } from "../../types.js";
import { result, schemaProperties, schemaType, toolText } from "../helpers.js";

const commandToolPatterns = [/\b(exec|execute|command|cmd|shell|terminal|process|spawn|run script|subprocess)\b/i];
const commandArgumentPatterns = [/\b(command|cmd|shell|script|args?|argv|executable|binary|process)\b/i];
const interpolationPatterns = [/\$\{/, /\beval\b/i, /\bsh\s+-c\b/i, /\bbash\s+-c\b/i, /child_process/i];

export const commandInjectionCheck: SecurityCheck = {
  id: "INPUT-001",
  name: "Command injection via tool arguments",
  category: "INPUT",
  severity: "critical",
  async run(server) {
    const riskyTool = server.tools.find((tool) => {
      const text = toolText(tool);
      const commandLikeTool = commandToolPatterns.some((pattern) => pattern.test(text));
      const commandLikeArgument = schemaProperties(tool).some((property) => {
        return commandArgumentPatterns.some((pattern) => pattern.test(property.name)) && schemaType(property.schema) === "string";
      });
      return commandLikeTool || commandLikeArgument || interpolationPatterns.some((pattern) => pattern.test(text));
    });

    return result(this, !riskyTool, {
      finding: riskyTool ? "A tool appears to accept command or shell-like input from callers." : "No command-execution argument patterns were detected.",
      evidence: riskyTool ? `Tool "${riskyTool.name}" matched command execution heuristics.` : "Checked tool names, descriptions, and input schemas.",
      remediation: "Avoid passing user input to shells. Use fixed command allowlists, structured argument arrays, strict enums, and per-command sandboxing.",
      references: ["OWASP Command Injection", "OWASP MCP Top 10: unsafe tool input", "CWE-78: OS Command Injection"]
    });
  }
};
