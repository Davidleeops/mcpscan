import fs from "node:fs/promises";
import https from "node:https";
import { URL } from "node:url";
import type { HttpProbe, McpServerConnection, ToolDefinition } from "./types.js";

interface LoadOptions {
  url?: string;
  server?: string;
  timeoutMs: number;
}

const knownToolWords = [
  "fetch",
  "url",
  "http",
  "file",
  "filesystem",
  "read",
  "write",
  "query",
  "sql",
  "exec",
  "command",
  "shell",
  "search"
];

export async function loadConnection(target: string | undefined, options: LoadOptions): Promise<McpServerConnection> {
  if (options.url) {
    const httpProbe = await probeHttp(options.url, options.timeoutMs);
    return {
      target: options.url,
      kind: "url",
      url: options.url,
      tools: inferToolsFromText(options.url),
      configText: options.url,
      env: {},
      httpProbe
    };
  }

  if (options.server) {
    return {
      target: options.server,
      kind: "command",
      command: options.server,
      tools: inferToolsFromText(options.server),
      configText: options.server,
      env: {}
    };
  }

  if (!target) {
    throw new Error("Provide a config path, --server command, or --url endpoint.");
  }

  const text = await fs.readFile(target, "utf8");
  const rawConfig = JSON.parse(text) as unknown;
  return {
    target,
    kind: "config",
    rawConfig,
    command: extractCommand(rawConfig),
    tools: extractTools(rawConfig, text),
    configText: text,
    env: extractEnv(rawConfig)
  };
}

function extractCommand(rawConfig: unknown): string | undefined {
  const servers = getServers(rawConfig);
  const commands = servers
    .map((server) => [server.command, ...(Array.isArray(server.args) ? server.args : [])].filter(Boolean).join(" "))
    .filter(Boolean);
  return commands.join(" && ") || undefined;
}

function extractEnv(rawConfig: unknown): Record<string, string> {
  const env: Record<string, string> = {};
  for (const server of getServers(rawConfig)) {
    if (server.env && typeof server.env === "object" && !Array.isArray(server.env)) {
      for (const [key, value] of Object.entries(server.env)) {
        env[key] = String(value);
      }
    }
  }
  return env;
}

function extractTools(rawConfig: unknown, text: string): ToolDefinition[] {
  const toolLike = findToolDefinitions(rawConfig);
  if (toolLike.length > 0) return toolLike;
  return inferToolsFromText(text);
}

function getServers(rawConfig: unknown): Array<Record<string, unknown>> {
  if (!rawConfig || typeof rawConfig !== "object") return [];
  const root = rawConfig as Record<string, unknown>;
  const mcpServers = root.mcpServers;
  if (mcpServers && typeof mcpServers === "object" && !Array.isArray(mcpServers)) {
    return Object.entries(mcpServers).map(([name, value]) => ({ name, ...(value as Record<string, unknown>) }));
  }
  return [root];
}

function findToolDefinitions(value: unknown): ToolDefinition[] {
  if (!value || typeof value !== "object") return [];
  const tools: ToolDefinition[] = [];
  const visit = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    const record = node as Record<string, unknown>;
    if (typeof record.name === "string" && ("description" in record || "inputSchema" in record)) {
      tools.push({
        name: record.name,
        description: typeof record.description === "string" ? record.description : undefined,
        inputSchema: record.inputSchema
      });
    }
    for (const item of Object.values(record)) visit(item);
  };
  visit(value);
  return tools;
}

function inferToolsFromText(text: string): ToolDefinition[] {
  const lower = text.toLowerCase();
  return knownToolWords
    .filter((word) => lower.includes(word))
    .map((word) => ({ name: word, description: `Inferred from target text containing "${word}".` }));
}

async function probeHttp(url: string, timeoutMs: number): Promise<HttpProbe> {
  const parsed = new URL(url);
  const headers: Record<string, string> = {};

  return new Promise((resolve) => {
    const request = https.request(
      {
        method: "OPTIONS",
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: `${parsed.pathname}${parsed.search}`,
        timeout: timeoutMs,
        headers: {
          Origin: "https://evil.example",
          "Access-Control-Request-Method": "POST"
        }
      },
      (response) => {
        for (const [key, value] of Object.entries(response.headers)) {
          headers[key.toLowerCase()] = Array.isArray(value) ? value.join(", ") : String(value ?? "");
        }
        const socket = response.socket as unknown as {
          authorized?: boolean;
          authorizationError?: string;
          getProtocol?: () => string;
          getCipher?: () => { name?: string };
          getPeerCertificate?: () => { valid_from?: string; valid_to?: string };
        };
        const cert = socket.getPeerCertificate?.();
        resolve({
          url,
          status: response.statusCode,
          headers,
          tls: {
            authorized: Boolean(socket.authorized),
            protocol: socket.getProtocol?.(),
            cipher: socket.getCipher?.().name,
            validFrom: cert?.valid_from,
            validTo: cert?.valid_to,
            error: socket.authorizationError
          }
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error(`Timed out after ${timeoutMs}ms`));
    });
    request.on("error", (error) => resolve({ url, headers, error: error.message }));
    request.end();
  });
}
