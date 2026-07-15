import type { SecurityCheck } from "../../types.js";
import { hasAny, result, textBlob, toolText } from "../helpers.js";

const dangerousCapabilityPatterns = [
  /\b(shell|command|exec|spawn|subprocess|terminal)\b/i,
  /\b(read|write|delete).*(file|filesystem|directory|path)\b/i,
  /\b(fetch|http|url|request|webhook|network)\b/i,
  /\b(database|sql|postgres|mysql|redis|mongo)\b/i
];

const isolationHintPatterns = [
  /\b(sandbox|container|jail|seccomp|firejail|docker|podman|readonly|read-only)\b/i,
  /\ballowlist\b/i,
  /\bdenylist\b/i,
  /\bno-network\b/i,
  /\bnetwork=none\b/i
];

export const stdioIsolationCheck: SecurityCheck = {
  id: "TRANSPORT-002",
  name: "Stdio process isolation",
  category: "TRANSPORT",
  severity: "medium",
  async run(server) {
    if (server.kind === "url") {
      return result(this, true, {
        finding: "The target is remote; stdio process isolation was not applicable.",
        evidence: "Remote URL target.",
        remediation: "For local stdio MCP servers, run risky tools with process, filesystem, and network isolation.",
        references: ["NSA MCP security advisory: sandboxing and least privilege"]
      });
    }

    const capability = server.tools.find((tool) => hasAny(toolText(tool), dangerousCapabilityPatterns));
    const isolationHint = hasAny(textBlob(server), isolationHintPatterns);
    const failed = Boolean(capability && !isolationHint);

    return result(this, !failed, {
      finding: failed
        ? "A local/stdio-style server exposes high-impact capabilities without visible isolation hints."
        : "No unisolated high-impact stdio capability pattern was detected.",
      evidence: failed
        ? `Tool "${capability?.name}" matched high-impact capability heuristics and no sandbox/container/read-only/no-network hint was found.`
        : isolationHint
          ? `Found isolation hint ${isolationHint.source}`
          : "Checked local command and tool metadata.",
      remediation:
        "Run stdio MCP servers in a sandbox/container, restrict filesystem paths, disable network where unnecessary, and split high-impact tools into separate least-privilege servers.",
      references: [
        "NSA MCP security advisory: sandboxing and least privilege",
        "OWASP MCP Top 10: excessive permissions",
        "CWE-250: Execution with Unnecessary Privileges"
      ]
    });
  }
};
