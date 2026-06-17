import chalk, { Chalk } from "chalk";
import type { CheckResult, Grade, ScanReport, Severity } from "@mcpscan/shared";

const severityRank: Record<Severity, number> = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
const severities: Severity[] = ["critical", "high", "medium", "low", "info"];

export interface ReportMetadata {
  auditor?: string;
  customer?: string;
  engagement?: string;
  notes?: string;
}

export function renderTable(report: ScanReport, verbose = false, useColor = true): string {
  const c = useColor ? chalk : new Chalk({ level: 0 });
  const visibleResults = report.results
    .filter((result) => verbose || !result.passed)
    .sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

  const lines = [
    "╔══════════════════════════════════════════════╗",
    "║           MCPScan Security Report            ║",
    "╠══════════════════════════════════════════════╣",
    boxLine(`Server: ${truncate(report.target, 34)}`),
    boxLine(`Grade:  ${gradeColor(report.summary.grade, c)}`),
    boxLine(`Score:  ${report.summary.score}/100`),
    boxLine(`Scanned: ${report.summary.totalChecks} checks in ${(report.durationMs / 1000).toFixed(1)}s`),
    "╠══════════════════════════════════════════════╣",
    boxLine(`${report.summary.passed} passed  ${report.summary.warnings} warnings  ${report.summary.failures} failed`),
    "╚══════════════════════════════════════════════╝",
    ""
  ];

  for (const item of visibleResults) {
    const icon = item.passed ? c.green("PASS") : item.severity === "low" || item.severity === "medium" ? c.yellow("WARN") : c.red("FAIL");
    lines.push(`${icon} ${item.severity.toUpperCase()}: ${item.id} - ${item.name}`);
    lines.push(`   ${item.finding}`);
    if (item.evidence) lines.push(`   Evidence: ${item.evidence}`);
    if (item.remediation) lines.push(`   Remediation: ${item.remediation}`);
    if (item.references?.length) lines.push(`   Ref: ${item.references.join("; ")}`);
    lines.push("");
  }

  if (!visibleResults.length) lines.push(c.green("No findings at the selected severity/categories."), "");
  return lines.join("\n");
}

export function renderJson(report: ScanReport): string {
  return JSON.stringify(report, null, 2);
}

export function renderHtml(report: ScanReport, metadata: ReportMetadata = {}): string {
  const failedResults = report.results
    .filter((result) => !result.passed)
    .sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
  const severityCounts = countSeverities(report.results);
  const remediationQueue = failedResults.slice(0, 5);
  const generatedAt = formatDate(report.scannedAt);
  const duration = `${(report.durationMs / 1000).toFixed(1)}s`;
  const executiveSummary = buildExecutiveSummary(report, severityCounts);
  const findings = failedResults.map((result, index) => renderFinding(result, index + 1)).join("\n");
  const engagementDetails = renderEngagementDetails(report, metadata, generatedAt, duration);
  const notes = metadata.notes ? `<section class="panel">
      <h2>Auditor Notes</h2>
      <p>${escapeHtml(metadata.notes)}</p>
    </section>` : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MCPScan Security Assessment - ${escapeHtml(report.target)}</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #17202a;
      --muted: #596775;
      --line: #d9e1e8;
      --panel: #ffffff;
      --page: #f4f7f9;
      --accent: #146c5f;
      --critical: #8f1d2c;
      --high: #bd3b19;
      --medium: #9a6411;
      --low: #246b8f;
      --info: #52606d;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      background: var(--page);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    main { max-width: 1080px; margin: 0 auto; padding: 32px 20px 48px; }
    .cover {
      background: #10233f;
      color: #ffffff;
      border-radius: 8px;
      padding: 34px;
      margin-bottom: 18px;
      border: 1px solid #0d1c33;
    }
    .kicker { margin: 0 0 8px; color: #b8d8d2; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
    h1, h2, h3 { line-height: 1.2; margin: 0; }
    h1 { font-size: clamp(30px, 5vw, 52px); max-width: 780px; }
    h2 { font-size: 22px; margin-bottom: 14px; }
    h3 { font-size: 17px; }
    p { margin: 0; }
    .cover-meta { color: #d8e4ee; display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 18px; }
    .grade-row { display: grid; grid-template-columns: minmax(140px, 220px) 1fr; gap: 24px; align-items: end; margin-top: 32px; }
    .grade { font-size: 92px; line-height: .9; font-weight: 800; }
    .score { font-size: 20px; color: #d8e4ee; margin-top: 8px; }
    .summary-text { max-width: 680px; font-size: 18px; color: #eef5f7; }
    .grid { display: grid; gap: 18px; }
    .grid.two { grid-template-columns: 1.15fr .85fr; }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 18px;
      box-shadow: 0 1px 2px rgba(16, 35, 63, .05);
    }
    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
    .stat { border: 1px solid var(--line); border-radius: 8px; padding: 14px; min-height: 92px; }
    .stat-label { color: var(--muted); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
    .stat-value { display: block; font-size: 28px; font-weight: 800; margin-top: 8px; }
    .meta-table { display: grid; grid-template-columns: 150px 1fr; gap: 10px 18px; }
    .meta-label { color: var(--muted); font-weight: 700; }
    .severity-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; }
    .severity { border-radius: 8px; padding: 12px; color: #ffffff; min-height: 84px; }
    .severity strong { display: block; font-size: 26px; }
    .severity span { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
    .critical { background: var(--critical); }
    .high { background: var(--high); }
    .medium { background: var(--medium); }
    .low { background: var(--low); }
    .info { background: var(--info); }
    .priority-list { margin: 0; padding-left: 20px; }
    .priority-list li { margin: 0 0 10px; }
    .finding {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
      margin-top: 14px;
      background: #fbfcfd;
    }
    .finding-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 10px; }
    .badge { border-radius: 999px; color: #ffffff; display: inline-block; font-size: 12px; font-weight: 800; padding: 4px 10px; text-transform: uppercase; white-space: nowrap; }
    .finding-id { color: var(--muted); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; margin-top: 4px; }
    .detail { margin-top: 10px; }
    .detail strong { color: var(--ink); }
    a { color: #175cd3; overflow-wrap: anywhere; }
    code { background: #edf2f6; padding: 2px 5px; border-radius: 4px; }
    footer { color: var(--muted); font-size: 12px; text-align: center; padding: 12px 0 0; }
    @media (max-width: 760px) {
      main { padding: 18px 12px 32px; }
      .cover, .panel { padding: 20px; }
      .grade-row, .grid.two, .stats, .severity-grid, .meta-table { grid-template-columns: 1fr; }
      .grade { font-size: 72px; }
      .finding-head { display: block; }
      .badge { margin-top: 10px; }
    }
    @media print {
      body { background: #ffffff; }
      main { max-width: none; padding: 0; }
      .cover, .panel, .finding { break-inside: avoid; box-shadow: none; }
      .cover { border-radius: 0; }
    }
  </style>
</head>
<body>
  <main>
    <header class="cover">
      <p class="kicker">MCPScan Security Assessment</p>
      <h1>${escapeHtml(metadata.engagement || "Model Context Protocol Security Report")}</h1>
      <div class="cover-meta">
        <span>Target: ${escapeHtml(report.target)}</span>
        <span>Scanned: ${escapeHtml(generatedAt)}</span>
        ${metadata.customer ? `<span>Customer: ${escapeHtml(metadata.customer)}</span>` : ""}
        ${metadata.auditor ? `<span>Auditor: ${escapeHtml(metadata.auditor)}</span>` : ""}
      </div>
      <div class="grade-row">
        <div>
          <div class="grade">${escapeHtml(report.summary.grade)}</div>
          <div class="score">Score ${report.summary.score}/100</div>
        </div>
        <p class="summary-text">${escapeHtml(executiveSummary)}</p>
      </div>
    </header>

    <section class="panel">
      <h2>Executive Summary</h2>
      <div class="stats">
        <div class="stat"><span class="stat-label">Grade</span><span class="stat-value">${escapeHtml(report.summary.grade)}</span></div>
        <div class="stat"><span class="stat-label">Score</span><span class="stat-value">${report.summary.score}/100</span></div>
        <div class="stat"><span class="stat-label">Checks</span><span class="stat-value">${report.summary.totalChecks}</span></div>
        <div class="stat"><span class="stat-label">Open Findings</span><span class="stat-value">${failedResults.length}</span></div>
      </div>
    </section>

    <div class="grid two">
      <section class="panel">
        <h2>Assessment Details</h2>
        ${engagementDetails}
      </section>
      <section class="panel">
        <h2>Severity Counts</h2>
        <div class="severity-grid">
          ${severities.map((severity) => `<div class="severity ${severity}"><span>${escapeHtml(severity)}</span><strong>${severityCounts[severity]}</strong></div>`).join("\n          ")}
        </div>
      </section>
    </div>

    <section class="panel">
      <h2>Remediation Priority</h2>
      ${renderRemediationPriority(remediationQueue)}
    </section>

    ${notes}

    <section class="panel">
      <h2>Findings</h2>
      ${findings || "<p>No failed checks. Maintain existing controls and rescan after material configuration changes.</p>"}
    </section>
    <footer>Generated by MCPScan. Results are point-in-time and should be validated after remediation.</footer>
  </main>
</body>
</html>`;
}

export function shouldFailCi(report: ScanReport, minGrade: Grade): boolean {
  const order: Grade[] = ["F", "D", "C", "B", "A"];
  return order.indexOf(report.summary.grade) < order.indexOf(minGrade);
}

function renderFinding(result: CheckResult, index: number): string {
  return `<div class="finding">
    <div class="finding-head">
      <div>
        <h3>${index}. ${escapeHtml(result.name)}</h3>
        <div class="finding-id">${escapeHtml(result.id)} · ${escapeHtml(result.category)}</div>
      </div>
      <span class="badge ${escapeHtml(result.severity)}">${escapeHtml(result.severity)}</span>
    </div>
    <p>${escapeHtml(result.finding)}</p>
    ${result.evidence ? `<p class="detail"><strong>Evidence:</strong> ${escapeHtml(result.evidence)}</p>` : ""}
    ${result.remediation ? `<p class="detail"><strong>Recommended remediation:</strong> ${escapeHtml(result.remediation)}</p>` : ""}
    ${result.references?.length ? `<p class="detail"><strong>References:</strong> ${result.references.map(renderReference).join(", ")}</p>` : ""}
  </div>`;
}

function renderEngagementDetails(report: ScanReport, metadata: ReportMetadata, generatedAt: string, duration: string): string {
  const rows = [
    ["Target", report.target],
    ["Scanned At", generatedAt],
    ["Duration", duration],
    ["Checks Run", String(report.summary.totalChecks)],
    ["Passed", String(report.summary.passed)],
    ["Warnings", String(report.summary.warnings)],
    ["Failures", String(report.summary.failures)],
    metadata.customer ? ["Customer", metadata.customer] : undefined,
    metadata.auditor ? ["Auditor", metadata.auditor] : undefined,
    metadata.engagement ? ["Engagement", metadata.engagement] : undefined
  ].filter(Boolean) as string[][];

  return `<div class="meta-table">
    ${rows.map(([label, value]) => `<div class="meta-label">${escapeHtml(label)}</div><div>${escapeHtml(value)}</div>`).join("\n    ")}
  </div>`;
}

function renderRemediationPriority(results: CheckResult[]): string {
  if (!results.length) {
    return "<p>No immediate remediation items were identified by the selected checks.</p>";
  }

  return `<ol class="priority-list">
    ${results.map((result) => `<li><strong>${escapeHtml(result.severity.toUpperCase())}: ${escapeHtml(result.name)}</strong><br>${escapeHtml(result.remediation || result.finding)}</li>`).join("\n    ")}
  </ol>`;
}

function renderReference(reference: string): string {
  const escaped = escapeHtml(reference);
  return /^https?:\/\//i.test(reference) ? `<a href="${escaped}">${escaped}</a>` : escaped;
}

function countSeverities(results: CheckResult[]): Record<Severity, number> {
  return severities.reduce((counts, severity) => {
    counts[severity] = results.filter((result) => !result.passed && result.severity === severity).length;
    return counts;
  }, {} as Record<Severity, number>);
}

function buildExecutiveSummary(report: ScanReport, counts: Record<Severity, number>): string {
  const openFindings = Object.values(counts).reduce((total, count) => total + count, 0);
  if (openFindings === 0) {
    return `The target achieved grade ${report.summary.grade} with no failed checks across ${report.summary.totalChecks} controls.`;
  }

  const urgent = counts.critical + counts.high;
  const riskPhrase = urgent > 0
    ? `${urgent} critical or high severity item${urgent === 1 ? "" : "s"} should be remediated before production use or buyer acceptance.`
    : "No critical or high severity items were identified; address remaining findings through the normal hardening backlog.";
  return `The target achieved grade ${report.summary.grade} with ${openFindings} open finding${openFindings === 1 ? "" : "s"} across ${report.summary.totalChecks} checks. ${riskPhrase}`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
}

function boxLine(value: string): string {
  const plain = value.replace(/\u001b\[[0-9;]*m/g, "");
  const padding = Math.max(0, 44 - plain.length);
  return `║  ${value}${" ".repeat(padding)}║`;
}

function gradeColor(grade: Grade, c: typeof chalk): string {
  if (grade === "A" || grade === "B") return c.green(grade);
  if (grade === "C") return c.yellow(grade);
  return c.red(grade);
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] ?? char));
}
