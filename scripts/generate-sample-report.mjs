#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const fixture = "packages/cli/test/fixtures/commercial-risk-config.json";
const output = "landing/sample-report.html";

if (!fs.existsSync(path.join(root, "packages/cli/dist/index.js"))) {
  console.error("Missing packages/cli/dist/index.js. Run npm run build first.");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  [
    "packages/cli/dist/index.js",
    "scan",
    fixture,
    "--format",
    "html",
    "--output",
    output,
    "--customer",
    "Sample AI Co",
    "--auditor",
    "MCPScan Audit Desk",
    "--engagement",
    "Sample Launch Audit",
    "--notes",
    "This sample report uses an intentionally risky fixture to demonstrate the paid audit deliverable."
  ],
  {
    cwd: root,
    encoding: "utf8"
  }
);

if (result.status !== 0) {
  process.stderr.write(result.stderr);
  process.stdout.write(result.stdout);
  process.exit(result.status ?? 1);
}

const html = fs.readFileSync(path.join(root, output), "utf8");
if (!html.includes("Checks</span><span class=\"stat-value\">22</span>") && !html.includes("<div class=\"meta-label\">Checks Run</div><div>22</div>")) {
  console.error("Generated sample report did not include 22 checks.");
  process.exit(1);
}

console.log(`Generated ${output} from ${fixture}.`);
