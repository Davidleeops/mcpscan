import type { CheckResult, SecurityCategory, Severity } from "@mcpscan/shared";

export interface ToolDefinition {
  name: string;
  description?: string;
  inputSchema?: unknown;
}

export interface HttpProbe {
  url: string;
  status?: number;
  headers: Record<string, string>;
  bodySample?: string;
  tls?: {
    authorized: boolean;
    protocol?: string;
    cipher?: string;
    validFrom?: string;
    validTo?: string;
    error?: string;
  };
  error?: string;
}

export interface McpServerConnection {
  target: string;
  kind: "config" | "command" | "url";
  rawConfig?: unknown;
  command?: string;
  url?: string;
  tools: ToolDefinition[];
  configText: string;
  env: Record<string, string>;
  httpProbe?: HttpProbe;
}

export interface SecurityCheck {
  id: string;
  name: string;
  category: SecurityCategory;
  severity: Severity;
  run(server: McpServerConnection): Promise<CheckResult>;
}

export interface ScanOptions {
  categories?: SecurityCategory[];
  severities?: Severity[];
  timeoutMs: number;
}
