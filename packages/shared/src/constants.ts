import type { Grade, Severity } from "./types.js";

export const severityWeights: Record<Severity, number> = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
  info: 0
};

export const gradeThresholds: Array<[number, Grade]> = [
  [90, "A"],
  [80, "B"],
  [65, "C"],
  [50, "D"],
  [0, "F"]
];
