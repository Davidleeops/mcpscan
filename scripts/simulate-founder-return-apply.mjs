#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-return-apply-"));

const filesToCopy = [
  "landing/index.html",
  "SECURITY.md",
  "docs/LAUNCH_CONTROL_ROOM.md",
  "docs/LANDING_PAGE.md",
  "sales/stripe-products.md",
  "sales/one-page-scope.md"
];

function copyIntoSandbox(file) {
  const from = path.join(root, file);
  const to = path.join(sandbox, file);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function readSandbox(file) {
  return fs.readFileSync(path.join(sandbox, file), "utf8");
}

function assertIncludes(file, marker) {
  const text = readSandbox(file);
  if (!text.includes(marker)) {
    throw new Error(`${file} is missing expected marker: ${marker}`);
  }
}

function assertNotIncludes(file, marker) {
  const text = readSandbox(file);
  if (text.includes(marker)) {
    throw new Error(`${file} still contains blocked marker: ${marker}`);
  }
}

for (const file of filesToCopy) copyIntoSandbox(file);

const args = [
  path.join(root, "scripts/apply-approved-launch-links.mjs"),
  "--domain",
  "mcpattest.dev",
  "--email",
  "security@mcpattest.dev",
  "--quick",
  "https://buy.stripe.com/mcpscanQuickAuditSample",
  "--launch",
  "https://buy.stripe.com/mcpscanLaunchAuditSample",
  "--enterprise",
  "https://buy.stripe.com/mcpscanEnterpriseReadinessSample"
];

const child = spawnSync(process.execPath, args, { cwd: sandbox, encoding: "utf8" });
if (child.stdout.trim()) console.log(child.stdout.trim());
if (child.stderr.trim()) console.error(child.stderr.trim());
if (child.status !== 0) process.exit(child.status ?? 1);

assertIncludes("landing/index.html", "https://buy.stripe.com/mcpscanQuickAuditSample");
assertIncludes("landing/index.html", "https://buy.stripe.com/mcpscanLaunchAuditSample");
assertIncludes("landing/index.html", "https://buy.stripe.com/mcpscanEnterpriseReadinessSample");
assertIncludes("landing/index.html", "mailto:security@mcpattest.dev?subject=MCPScan%20audit%20scope");
assertNotIncludes("landing/index.html", "github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20Quick%20Audit%20request");
assertNotIncludes("landing/index.html", "github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20Launch%20Audit%20request");
assertNotIncludes("landing/index.html", "github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20Enterprise%20Audit%20request");
assertIncludes("landing/CNAME", "mcpattest.dev");
assertIncludes("SECURITY.md", "security@mcpattest.dev");
assertIncludes("docs/LANDING_PAGE.md", "https://mcpattest.dev/");
assertIncludes("sales/stripe-products.md", "https://mcpattest.dev/");
assertIncludes("sales/one-page-scope.md", "https://mcpattest.dev/");

fs.rmSync(sandbox, { recursive: true, force: true });

console.log("Founder return apply simulation passed.");
