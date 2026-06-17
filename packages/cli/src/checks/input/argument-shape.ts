import type { SecurityCheck } from "../../types.js";
import { result, schemaProperties, schemaType } from "../helpers.js";

const riskyFreeformNames = [/\b(input|payload|data|content|body|text|prompt|json|options|params|args)\b/i];

export const argumentShapeCheck: SecurityCheck = {
  id: "INPUT-005",
  name: "Argument type confusion or oversized input risk",
  category: "INPUT",
  severity: "medium",
  async run(server) {
    const riskyTool = server.tools.find((tool) => {
      const properties = schemaProperties(tool);
      return properties.some((property) => {
        const type = schemaType(property.schema);
        if (!type) return true;
        if (type === "string") return typeof property.schema.maxLength !== "number" && riskyFreeformNames.some((pattern) => pattern.test(property.name));
        if (type === "array") return typeof property.schema.maxItems !== "number";
        if (type === "object") return property.schema.additionalProperties !== false;
        return false;
      });
    });

    return result(this, !riskyTool, {
      finding: riskyTool ? "A tool schema allows ambiguous or potentially oversized arguments." : "Tool schemas include basic type and size constraints.",
      evidence: riskyTool ? `Tool "${riskyTool.name}" has missing, free-form, or unbounded argument constraints.` : "Checked schema property types, maxLength, maxItems, and additionalProperties.",
      remediation: "Declare explicit JSON Schema types, reject unknown object keys, and add maxLength, maxItems, numeric bounds, or enums for caller-controlled fields.",
      references: ["JSON Schema Validation", "OWASP Input Validation Cheat Sheet", "CWE-20: Improper Input Validation"]
    });
  }
};
