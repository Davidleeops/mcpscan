import type { SecurityCheck } from "../../types.js";
import { result, schemaProperties, schemaType, toolText } from "../helpers.js";

const sqlToolPatterns = [/\b(sql|database|db|query|postgres|mysql|sqlite|snowflake|warehouse)\b/i];
const sqlArgumentPatterns = [/\b(sql|query|where|filter|orderBy|having|statement|raw)\b/i];
const rawSqlPatterns = [/\bselect\s+.+\bfrom\b/i, /\binsert\s+into\b/i, /\bupdate\s+\w+\s+set\b/i, /\bdelete\s+from\b/i];

export const sqlInjectionCheck: SecurityCheck = {
  id: "INPUT-002",
  name: "SQL injection via tool arguments",
  category: "INPUT",
  severity: "high",
  async run(server) {
    const riskyTool = server.tools.find((tool) => {
      const text = toolText(tool);
      const databaseTool = sqlToolPatterns.some((pattern) => pattern.test(text));
      const rawQueryArgument = schemaProperties(tool).some((property) => {
        return sqlArgumentPatterns.some((pattern) => pattern.test(property.name)) && schemaType(property.schema) === "string";
      });
      return rawSqlPatterns.some((pattern) => pattern.test(text)) || (databaseTool && rawQueryArgument);
    });

    return result(this, !riskyTool, {
      finding: riskyTool ? "A database-oriented tool appears to accept raw SQL or query fragments." : "No raw SQL argument patterns were detected.",
      evidence: riskyTool ? `Tool "${riskyTool.name}" matched SQL injection heuristics.` : "Checked database tool metadata and input schemas.",
      remediation: "Expose narrow query operations, use parameterized statements, validate filter fields against allowlists, and avoid accepting raw SQL from callers.",
      references: ["OWASP SQL Injection Prevention Cheat Sheet", "CWE-89: SQL Injection", "OWASP MCP Top 10: unsafe tool input"]
    });
  }
};
