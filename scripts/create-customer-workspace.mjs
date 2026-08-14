#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const templatePath = path.join(root, "delivery", "customer-workspace-template");

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      values[key] = "true";
    } else {
      values[key] = next;
      index += 1;
    }
  }
  return values;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const args = parseArgs(process.argv.slice(2));
const customer = args.customer;
const date = args.date ?? today();
const baseDir = args.root ?? path.join(os.homedir(), "MCPScan Audits");
const dryRun = args["dry-run"] === "true";
const calledFromHandoff = args["called-from-handoff"] === "true";

if (!customer) {
  console.error("Missing required --customer value.");
  console.error("Use npm run delivery:handoff with verified payment evidence for live paid delivery.");
  console.error("Internal dry-run example: npm run delivery:workspace -- --customer Acme --date 2026-08-14 --dry-run true");
  process.exit(1);
}

if (!calledFromHandoff && !dryRun) {
  console.error("Refusing to create a live customer workspace directly.");
  console.error("Use npm run delivery:handoff -- --file /path/to/approved-paid-audit-handoff.txt --payment-evidence /path/to/payment-confirmation-evidence.json");
  process.exit(1);
}

if (!fs.existsSync(templatePath)) {
  console.error("Missing workspace template: " + templatePath);
  process.exit(1);
}

const slug = slugify(customer);
if (!slug) {
  console.error("Customer value does not contain usable letters or numbers.");
  process.exit(1);
}

const workspaceRoot = path.resolve(baseDir, date + "_" + slug);
const workspacePath = path.join(workspaceRoot, "customer-workspace");

if (workspacePath.startsWith(root + path.sep)) {
  console.error("Refusing to create a customer workspace inside the public MCPScan repo.");
  console.error("Use --root outside this repository.");
  process.exit(1);
}

if (fs.existsSync(workspacePath)) {
  console.error("Workspace already exists: " + workspacePath);
  process.exit(1);
}

const manifest = [
  "# MCPScan Customer Workspace",
  "",
  "Customer: " + customer,
  "Created: " + date,
  "Workspace: " + workspacePath,
  "",
  "## Safety Rule",
  "",
  "Do not move this workspace into the public MCPScan repo. Do not store production credentials, active tokens, customer data, private source code, or final private reports in public issues or ordinary email.",
  "",
  "## Next Steps",
  "",
  "1. Complete intake-checklist.md.",
  "2. Store sanitized configs in 01-sanitized-configs/.",
  "3. Save scan output in 03-scan-output/.",
  "4. Track findings in findings-tracker.csv.",
  "5. Draft report-template.md and buyer-facing-summary.md.",
  "6. Deliver through the approved private customer path.",
  ""
].join("\n");

if (dryRun) {
  console.log("Would create workspace: " + workspacePath);
  process.exit(0);
}

fs.mkdirSync(workspaceRoot, { recursive: true });
fs.cpSync(templatePath, workspacePath, { recursive: true, errorOnExist: true, force: false });
fs.writeFileSync(path.join(workspaceRoot, "WORKSPACE_MANIFEST.md"), manifest, "utf8");

for (const dir of ["00-intake", "01-sanitized-configs", "02-evidence", "03-scan-output", "04-report", "05-delivery"]) {
  fs.mkdirSync(path.join(workspacePath, dir), { recursive: true });
}

console.log("Created MCPScan customer workspace:");
console.log(workspacePath);
