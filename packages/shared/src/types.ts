export type SecurityCategory =
  | "AUTH"
  | "INPUT"
  | "OUTPUT"
  | "TRANSPORT"
  | "CONFIG"
  | "TOOLING";

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type Grade = "A" | "B" | "C" | "D" | "F";

export interface CheckResult {
  id: string;
  name: string;
  category: SecurityCategory;
  passed: boolean;
  severity: Severity;
  finding: string;
  evidence?: string;
  remediation?: string;
  references?: string[];
}

export interface ScanSummary {
  grade: Grade;
  score: number;
  totalChecks: number;
  passed: number;
  warnings: number;
  failures: number;
}

export interface ScanReport {
  target: string;
  scannedAt: string;
  durationMs: number;
  summary: ScanSummary;
  results: CheckResult[];
}
