import { gradeThresholds, severityWeights } from "./constants.js";
import type { CheckResult, Grade, ScanSummary } from "./types.js";

export function calculateScore(results: CheckResult[]): number {
  let score = 100;

  for (const result of results) {
    if (!result.passed) {
      score -= severityWeights[result.severity];
    }
  }

  if (results.some((result) => !result.passed && result.severity === "critical")) {
    score = Math.min(score, 59);
  }

  return Math.max(0, score);
}

export function calculateGrade(results: CheckResult[]): Grade {
  const score = calculateScore(results);
  return gradeThresholds.find(([minimum]) => score >= minimum)?.[1] ?? "F";
}

export function summarizeResults(results: CheckResult[]): ScanSummary {
  const failures = results.filter((result) => !result.passed && ["critical", "high"].includes(result.severity)).length;
  const warnings = results.filter((result) => !result.passed && ["medium", "low"].includes(result.severity)).length;
  const passed = results.filter((result) => result.passed).length;

  return {
    grade: calculateGrade(results),
    score: calculateScore(results),
    totalChecks: results.length,
    passed,
    warnings,
    failures
  };
}
