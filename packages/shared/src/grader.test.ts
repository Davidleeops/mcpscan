import { describe, expect, it } from "vitest";
import { calculateGrade, calculateScore } from "./grader.js";
import type { CheckResult } from "./types.js";

const result = (passed: boolean, severity: CheckResult["severity"]): CheckResult => ({
  id: "TEST-001",
  name: "Test",
  category: "CONFIG",
  passed,
  severity,
  finding: "Test finding"
});

describe("grader", () => {
  it("returns A for all passing checks", () => {
    expect(calculateScore([result(true, "critical"), result(true, "high")])).toBe(100);
    expect(calculateGrade([result(true, "critical")])).toBe("A");
  });

  it("caps critical findings at C or below", () => {
    expect(calculateScore([result(false, "critical")])).toBe(59);
    expect(calculateGrade([result(false, "critical")])).toBe("D");
  });

  it("deducts by severity", () => {
    const results = [result(false, "high"), result(false, "medium"), result(false, "low")];
    expect(calculateScore(results)).toBe(74);
    expect(calculateGrade(results)).toBe("C");
  });
});
