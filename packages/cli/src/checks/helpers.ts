import type { CheckResult } from "@mcpscan/shared";
import type { McpServerConnection, SecurityCheck, ToolDefinition } from "../types.js";

export interface SchemaProperty {
  path: string;
  name: string;
  schema: Record<string, unknown>;
}

export function result(
  check: Pick<SecurityCheck, "id" | "name" | "category" | "severity">,
  passed: boolean,
  details: Omit<CheckResult, "id" | "name" | "category" | "severity" | "passed">
): CheckResult {
  return {
    id: check.id,
    name: check.name,
    category: check.category,
    severity: check.severity,
    passed,
    ...details
  };
}

export function hasAny(text: string, patterns: RegExp[]): RegExp | undefined {
  return patterns.find((pattern) => pattern.test(text));
}

export function textBlob(server: McpServerConnection): string {
  return [
    server.configText,
    server.command ?? "",
    server.url ?? "",
    ...server.tools.flatMap((tool) => [tool.name, tool.description ?? "", JSON.stringify(tool.inputSchema ?? {})]),
    JSON.stringify(server.env)
  ].join("\n");
}

export function toolText(tool: ToolDefinition): string {
  return [tool.name, tool.description ?? "", JSON.stringify(tool.inputSchema ?? {})].join("\n");
}

export function schemaProperties(tool: ToolDefinition): SchemaProperty[] {
  const properties: SchemaProperty[] = [];

  const visit = (node: unknown, path: string): void => {
    if (!isRecord(node)) return;
    const nested = node.properties;
    if (isRecord(nested)) {
      for (const [name, schema] of Object.entries(nested)) {
        if (isRecord(schema)) {
          const nextPath = path ? `${path}.${name}` : name;
          properties.push({ path: nextPath, name, schema });
          visit(schema, nextPath);
        }
      }
    }

    const items = node.items;
    if (isRecord(items)) visit(items, `${path}[]`);
  };

  visit(tool.inputSchema, "");
  return properties;
}

export function schemaType(schema: Record<string, unknown>): string | undefined {
  const type = schema.type;
  return typeof type === "string" ? type : undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
