#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const matrixPath = path.join(root, "docs/OBJECTIVE_COMPLETION_MATRIX_2026-08-14.json");

function exists(file) {
  return fs.existsSync(path.join(root, file));
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

function hasCheckoutPlaceholders() {
  return exists("landing/index.html") && fs.readFileSync(path.join(root, "landing/index.html"), "utf8").includes("github.com/Davidleeops/mcpscan/issues/new?title=MCPScan");
}

function hasCustomDomain() {
  return exists("landing/CNAME") && fs.readFileSync(path.join(root, "landing/CNAME"), "utf8").trim().length > 0;
}

function hasSecurityContact() {
  return exists("SECURITY.md") && /audit@|security@|@mcpscan/i.test(fs.readFileSync(path.join(root, "SECURITY.md"), "utf8"));
}

if (!fs.existsSync(matrixPath)) {
  console.error("Missing objective completion matrix.");
  process.exit(1);
}

const matrix = JSON.parse(fs.readFileSync(matrixPath, "utf8"));
const results = [];

results.push(matrix.entryPoint === "npm run launch:day" ? result("pass", "entry point", matrix.entryPoint) : result("fail", "entry point", "expected npm run launch:day"));
results.push(matrix.fullProofCommand === "npm run launch:full-proof" ? result("pass", "full proof command", matrix.fullProofCommand) : result("fail", "full proof command", "expected npm run launch:full-proof"));
results.push(matrix.launchReadinessProof?.passed >= 200 ? result("pass", "readiness pass count", String(matrix.launchReadinessProof.passed)) : result("fail", "readiness pass count", "expected at least 200"));
results.push(matrix.launchReadinessProof?.expectedWarnings === 3 ? result("pass", "expected warning count", "3") : result("fail", "expected warning count", "expected 3"));
results.push(matrix.launchReadinessProof?.failures === 0 ? result("pass", "readiness failures", "0") : result("fail", "readiness failures", "expected 0"));

const requirements = Array.isArray(matrix.requirements) ? matrix.requirements : [];
results.push(requirements.length >= 13 ? result("pass", "requirement count", String(requirements.length)) : result("fail", "requirement count", "expected at least 13"));

for (const item of requirements) {
  if (!item.id || !item.label || !item.status) {
    results.push(result("fail", "requirement shape", JSON.stringify(item)));
    continue;
  }

  if (!Array.isArray(item.evidence) || item.evidence.length === 0) {
    results.push(result("fail", `${item.id} evidence`, "missing evidence list"));
    continue;
  }

  const missing = item.evidence.filter((file) => !exists(file));
  if (item.status === "ready") {
    results.push(missing.length === 0 ? result("pass", `${item.id} prepared evidence`) : result("fail", `${item.id} prepared evidence`, missing.join(", ")));
  } else if (item.status === "founder_click_required") {
    const present = item.evidence.filter((file) => exists(file));
    results.push(present.length > 0 ? result("pass", `${item.id} click packet evidence`, present.join(", ")) : result("fail", `${item.id} click packet evidence`, "no referenced packet exists"));
    results.push(item.remainingAction ? result("pass", `${item.id} remaining action`, item.remainingAction) : result("fail", `${item.id} remaining action`, "missing"));
  } else {
    results.push(result("fail", `${item.id} status`, item.status));
  }
}

const clickRequired = requirements.filter((item) => item.status === "founder_click_required").map((item) => item.id).sort();
const expectedClickRequired = ["custom_domain_live", "mailbox_live", "security_contact_live", "stripe_links_live"].sort();
results.push(JSON.stringify(clickRequired) === JSON.stringify(expectedClickRequired)
  ? result("pass", "founder click boundary", clickRequired.join(", "))
  : result("fail", "founder click boundary", `expected ${expectedClickRequired.join(", ")}, got ${clickRequired.join(", ")}`));

results.push(hasCheckoutPlaceholders() ? result("pass", "checkout warning still expected", "Stripe links remain external-click gated") : result("warn", "checkout warning still expected", "placeholder checkout links no longer found"));
results.push(!hasCustomDomain() ? result("pass", "custom domain warning still expected", "no CNAME until founder buys or connects domain") : result("warn", "custom domain warning still expected", "CNAME exists"));
results.push(!hasSecurityContact() ? result("pass", "security contact warning still expected", "placeholder remains until mailbox exists") : result("warn", "security contact warning still expected", "custom security contact appears configured"));

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (failures.length > 0) process.exit(1);
