import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runScan } from "./scanner.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) => path.resolve(dirname, "../test/fixtures", name);

describe("scanner", () => {
  it("finds expected issues in a vulnerable config", async () => {
    const report = await runScan(fixture("vulnerable-config.json"), { timeoutMs: 1000 });
    expect(["D", "F"]).toContain(report.summary.grade);
    expect(report.results.some((result) => result.id === "TOOL-001" && !result.passed)).toBe(true);
    expect(report.results.some((result) => result.id === "CONFIG-003" && !result.passed)).toBe(true);
  });

  it("keeps a basic secure config above failing grades", async () => {
    const report = await runScan(fixture("secure-config.json"), { timeoutMs: 1000 });
    expect(["A", "B", "C"]).toContain(report.summary.grade);
    expect(report.results.find((result) => result.id === "CONFIG-003")?.passed).toBe(true);
  });

  it("detects commercially relevant input, output, and tooling risks", async () => {
    const report = await runScan(fixture("commercial-risk-config.json"), { timeoutMs: 1000 });
    const failedIds = report.results.filter((result) => !result.passed).map((result) => result.id);

    expect(failedIds).toContain("INPUT-001");
    expect(failedIds).toContain("INPUT-002");
    expect(failedIds).toContain("INPUT-003");
    expect(failedIds).toContain("INPUT-005");
    expect(failedIds).toContain("OUTPUT-002");
    expect(failedIds).toContain("OUTPUT-003");
    expect(failedIds).toContain("TOOL-002");
    expect(failedIds).toContain("TOOL-003");
    expect(failedIds).toContain("TOOL-004");

    for (const result of report.results.filter((result) => failedIds.includes(result.id))) {
      expect(result.remediation).toBeTruthy();
      expect(result.references?.length).toBeGreaterThan(0);
    }
  });
});
