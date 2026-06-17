import { summarizeResults, type ScanReport, type SecurityCategory, type Severity } from "@mcpscan/shared";
import { loadConnection } from "./connection.js";
import { checks } from "./checks/index.js";
import type { ScanOptions } from "./types.js";

interface RunScanOptions extends ScanOptions {
  url?: string;
  server?: string;
}

export async function runScan(target: string | undefined, options: RunScanOptions): Promise<ScanReport> {
  const started = Date.now();
  const connection = await loadConnection(target, {
    url: options.url,
    server: options.server,
    timeoutMs: options.timeoutMs
  });

  const selected = checks.filter((check) => {
    const categoryMatch = !options.categories?.length || options.categories.includes(check.category as SecurityCategory);
    const severityMatch = !options.severities?.length || options.severities.includes(check.severity as Severity);
    return categoryMatch && severityMatch;
  });

  const results = await Promise.all(selected.map((check) => check.run(connection)));

  return {
    target: connection.target,
    scannedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    summary: summarizeResults(results),
    results
  };
}
