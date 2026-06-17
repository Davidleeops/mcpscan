import { describe, expect, it } from "vitest";
import type { ScanReport } from "@mcpscan/shared";
import { renderHtml, renderJson, renderTable } from "./reporter.js";

const report: ScanReport = {
  target: "https://buyer.example/mcp",
  scannedAt: "2026-06-17T16:30:00.000Z",
  durationMs: 1234,
  summary: {
    grade: "D",
    score: 62,
    totalChecks: 4,
    passed: 1,
    warnings: 1,
    failures: 2
  },
  results: [
    {
      id: "AUTH-001",
      name: "Authentication required",
      category: "AUTH",
      passed: false,
      severity: "critical",
      finding: "The endpoint accepted unauthenticated requests.",
      evidence: "HTTP 200 without credentials",
      remediation: "Require authentication for all MCP transport endpoints.",
      references: ["https://modelcontextprotocol.io"]
    },
    {
      id: "CONFIG-002",
      name: "Restrictive CORS",
      category: "CONFIG",
      passed: false,
      severity: "medium",
      finding: "The endpoint permits broad origins.",
      remediation: "Restrict allowed origins to approved customer domains."
    },
    {
      id: "TRANSPORT-001",
      name: "TLS enforced",
      category: "TRANSPORT",
      passed: true,
      severity: "high",
      finding: "TLS is enabled."
    },
    {
      id: "TOOL-001",
      name: "Tool description integrity",
      category: "TOOLING",
      passed: false,
      severity: "high",
      finding: "A tool description contains untrusted instruction text.",
      remediation: "Review tool descriptions and remove instruction-like content."
    }
  ]
};

describe("reporter", () => {
  it("renders a commercial HTML report with audit metadata and priorities", () => {
    const html = renderHtml(report, {
      auditor: "Acme Audit",
      customer: "BuyerCo",
      engagement: "BuyerCo MCP Audit",
      notes: "Reviewed for acquisition diligence."
    });

    expect(html).toContain("MCPScan Security Assessment");
    expect(html).toContain("BuyerCo MCP Audit");
    expect(html).toContain("Customer: BuyerCo");
    expect(html).toContain("Auditor: Acme Audit");
    expect(html).toContain("Executive Summary");
    expect(html).toContain("Severity Counts");
    expect(html).toContain("Remediation Priority");
    expect(html).toContain("Reviewed for acquisition diligence.");
    expect(html).toContain("critical");
    expect(html).toContain("Require authentication for all MCP transport endpoints.");
  });

  it("keeps JSON output as the raw report", () => {
    expect(JSON.parse(renderJson(report))).toEqual(report);
  });

  it("keeps table output focused on failed checks by default", () => {
    const table = renderTable(report, false, false);
    expect(table).toContain("MCPScan Security Report");
    expect(table).toContain("AUTH-001");
    expect(table).not.toContain("TRANSPORT-001");
  });
});
