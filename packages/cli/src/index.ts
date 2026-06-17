#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { Command } from "commander";
import ora from "ora";
import { runScan } from "./scanner.js";
import { renderHtml, renderJson, renderTable, shouldFailCi } from "./reporter.js";
import type { ReportMetadata } from "./reporter.js";
import type { Grade, SecurityCategory, Severity } from "@mcpscan/shared";

const program = new Command();

program
  .name("mcpscan")
  .description("Security scanner for Model Context Protocol servers.")
  .version("0.1.0");

program
  .command("scan")
  .argument("[config-or-server]", "MCP config file path or server command")
  .option("--server <command>", "Scan a local MCP server command")
  .option("--url <url>", "Scan a remote MCP HTTP/SSE endpoint")
  .option("--checks <list>", "Comma-separated categories: auth,input,output,transport,config,tooling")
  .option("--severity <list>", "Comma-separated severities: critical,high,medium,low,info")
  .option("--format <format>", "Output format: table,json,html", "table")
  .option("--output <file>", "Save report to file")
  .option("--ci", "Exit code 1 if grade is below --min-grade")
  .option("--min-grade <grade>", "Minimum passing grade for --ci mode", "B")
  .option("--timeout <seconds>", "Seconds per network probe", "10")
  .option("--verbose", "Show all checks including passed")
  .option("--no-color", "Plain text output")
  .option("--auditor <name>", "Auditor or firm name for HTML reports")
  .option("--customer <name>", "Customer name for HTML reports")
  .option("--engagement <name>", "Engagement name for HTML reports")
  .option("--notes <text>", "Auditor notes for HTML reports")
  .action(async (target: string | undefined, options) => {
    const spinner = options.format === "table" ? ora("Scanning MCP target...").start() : undefined;
    try {
      const metadata = parseReportMetadata(options);
      const report = await runScan(target, {
        url: options.url,
        server: options.server,
        categories: parseCategories(options.checks),
        severities: parseSeverities(options.severity),
        timeoutMs: Number(options.timeout) * 1000
      });
      spinner?.stop();

      const rendered = renderReport(report, options.format, Boolean(options.verbose), options.color, metadata);
      if (options.output) {
        await fs.mkdir(path.dirname(path.resolve(options.output)), { recursive: true });
        await fs.writeFile(options.output, options.format === "html" ? renderHtml(report, metadata) : renderJson(report));
      }
      process.stdout.write(`${rendered}\n`);
      if (options.output) process.stdout.write(`Full report: ${options.output}\n`);

      if (options.ci && shouldFailCi(report, String(options.minGrade).toUpperCase() as Grade)) {
        process.exitCode = 1;
      }
    } catch (error) {
      spinner?.fail("Scan failed");
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  });

program
  .command("report")
  .argument("<report-json>", "Scan report JSON file")
  .option("--format <format>", "Output format: table,json,html", "html")
  .option("--output <file>", "Save formatted report to file")
  .option("--auditor <name>", "Auditor or firm name for HTML reports")
  .option("--customer <name>", "Customer name for HTML reports")
  .option("--engagement <name>", "Engagement name for HTML reports")
  .option("--notes <text>", "Auditor notes for HTML reports")
  .action(async (reportPath: string, options) => {
    const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
    const rendered = renderReport(report, options.format, true, true, parseReportMetadata(options));
    if (options.output) {
      await fs.writeFile(options.output, rendered);
    } else {
      process.stdout.write(`${rendered}\n`);
    }
  });

program.parseAsync();

function renderReport(report: Parameters<typeof renderJson>[0], format: string, verbose: boolean, color: boolean, metadata: ReportMetadata = {}): string {
  if (format === "json") return renderJson(report);
  if (format === "html") return renderHtml(report, metadata);
  return renderTable(report, verbose, color);
}

function parseReportMetadata(options: Record<string, unknown>): ReportMetadata {
  return {
    auditor: optionalString(options.auditor),
    customer: optionalString(options.customer),
    engagement: optionalString(options.engagement),
    notes: optionalString(options.notes)
  };
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseCategories(value?: string): SecurityCategory[] | undefined {
  if (!value) return undefined;
  const map: Record<string, SecurityCategory> = {
    auth: "AUTH",
    input: "INPUT",
    output: "OUTPUT",
    transport: "TRANSPORT",
    config: "CONFIG",
    tooling: "TOOLING"
  };
  return value.split(",").map((item) => map[item.trim().toLowerCase()]).filter(Boolean);
}

function parseSeverities(value?: string): Severity[] | undefined {
  if (!value) return undefined;
  const allowed = new Set(["critical", "high", "medium", "low", "info"]);
  return value.split(",").map((item) => item.trim().toLowerCase()).filter((item) => allowed.has(item)) as Severity[];
}
