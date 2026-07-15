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
    expect(failedIds).toContain("AUTH-004");
    expect(failedIds).toContain("CONFIG-002");
    expect(failedIds).toContain("TRANSPORT-002");
    expect(failedIds).toContain("TOOL-002");
    expect(failedIds).toContain("TOOL-003");
    expect(failedIds).toContain("TOOL-004");

    for (const result of report.results.filter((result) => failedIds.includes(result.id))) {
      expect(result.remediation).toBeTruthy();
      expect(result.references?.length).toBeGreaterThan(0);
    }
  });

  it("runs the full prompt-aligned check set", async () => {
    const report = await runScan(fixture("secure-config.json"), { timeoutMs: 1000 });
    expect(report.summary.totalChecks).toBe(22);
    expect(report.results.map((result) => result.id)).toEqual([
      "AUTH-001",
      "AUTH-002",
      "AUTH-003",
      "AUTH-004",
      "INPUT-001",
      "INPUT-002",
      "INPUT-003",
      "INPUT-004",
      "INPUT-005",
      "OUTPUT-001",
      "OUTPUT-002",
      "OUTPUT-003",
      "TRANSPORT-001",
      "TRANSPORT-002",
      "TRANSPORT-003",
      "TOOL-001",
      "TOOL-002",
      "TOOL-003",
      "TOOL-004",
      "CONFIG-001",
      "CONFIG-002",
      "CONFIG-003"
    ]);
  });
});
