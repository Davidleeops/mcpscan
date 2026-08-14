#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "sales/first-10-outbound-approval-packet.md",
  "sales/first-account-dossier-2026-08-14.md",
  "sales/reply-to-close-packet.md",
  "sales/daily-revenue-command.md",
  "docs/METHODOLOGY_AND_LIMITATIONS.md",
  "docs/PUBLIC_TRUST_CHECKLIST.md",
  "docs/FIRST_PAID_AUDIT_GO_NO_GO.md"
];

const scanRoots = ["sales", "launch", "landing", "docs"];
const textExtensions = new Set([".html", ".json", ".md", ".txt"]);
const forbiddenClaims = [
  "certified compliant",
  "guaranteed secure",
  "guarantee complete security",
  "full penetration test",
  "we found a vulnerability",
  "your mcp is insecure",
  "continuous monitoring is live",
  "dashboard is live"
];
const allowedNegativeMarkers = ["not", "do not", "does not", "is not", "not a", "avoid", "do not claim", "no claims"];
const allowedContextMarkers = ["not included", "bad-fit buyer", "avoid claiming", "limitations", "mcpScan is not".toLowerCase(), "does not include"];

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function walk(entry, files = []) {
  const full = path.join(root, entry);
  if (!fs.existsSync(full)) return files;
  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(full)) {
      if (child === "node_modules" || child === ".git" || child === "dist" || child === "generated-outbound") continue;
      walk(path.join(entry, child), files);
    }
  } else if (stat.isFile() && textExtensions.has(path.extname(entry))) {
    files.push(entry);
  }
  return files;
}

function result(kind, label, detail = "") {
  return { kind, label, detail };
}

function print(results) {
  for (const item of results) {
    const mark = item.kind === "pass" ? "PASS" : item.kind === "warn" ? "WARN" : "FAIL";
    console.log(`${mark} ${item.label}${item.detail ? ` - ${item.detail}` : ""}`);
  }
}

const results = [];

for (const file of requiredFiles) {
  results.push(exists(file) ? result("pass", `required GTM file: ${file}`) : result("fail", `required GTM file: ${file}`, "missing"));
}

if (exists("sales/first-10-outbound-approval-packet.md")) {
  const text = read("sales/first-10-outbound-approval-packet.md");
  results.push(text.includes("No external message can be sent") ? result("pass", "outbound approval gate", "same-turn approval rule present") : result("fail", "outbound approval gate", "missing same-turn approval rule"));
  results.push(text.includes("$1,500") && text.includes("MCP Launch Audit") ? result("pass", "default paid offer", "$1,500 MCP Launch Audit present") : result("fail", "default paid offer", "missing $1,500 launch audit offer"));
}

if (exists("docs/METHODOLOGY_AND_LIMITATIONS.md")) {
  const text = read("docs/METHODOLOGY_AND_LIMITATIONS.md").toLowerCase();
  results.push(text.includes("not") && text.includes("penetration test") && text.includes("compliance certification") ? result("pass", "limitations", "pentest and certification limits present") : result("fail", "limitations", "missing pentest or certification limits"));
}

if (exists("docs/PUBLIC_TRUST_CHECKLIST.md")) {
  const text = read("docs/PUBLIC_TRUST_CHECKLIST.md").toLowerCase();
  results.push(text.includes("spf") && text.includes("dkim") && text.includes("dmarc") ? result("pass", "mail trust checks", "SPF, DKIM, and DMARC required") : result("fail", "mail trust checks", "missing email authentication checks"));
}

const files = scanRoots.flatMap((entry) => walk(entry));
for (const file of files) {
  const lines = read(file).toLowerCase().split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const context = lines.slice(Math.max(0, index - 4), index + 1).join("\n");
    for (const claim of forbiddenClaims) {
      const negativeLine = allowedNegativeMarkers.some((marker) => line.includes(marker));
      const negativeContext = allowedContextMarkers.some((marker) => context.includes(marker));
      if (line.includes(claim) && !negativeLine && !negativeContext) {
        results.push(result("fail", `forbidden GTM claim: ${file}:${index + 1}`, claim));
      }
    }
  }
}

results.push(result("pass", "GTM files scanned", `${files.length} files`));

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (failures.length > 0) process.exit(1);
