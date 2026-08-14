#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();

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

function requireValue(name, value) {
  if (!value || !String(value).trim()) throw new Error(`Missing required ${name}.`);
  return String(value).trim();
}

function packageDefaults(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("quick")) {
    return { servers: "up to 3 MCP servers in 1 environment", days: "3 business days", call: "not included unless approved separately", rescan: "not included unless approved separately" };
  }
  if (normalized.includes("enterprise")) {
    return { servers: "up to 15 MCP servers across up to 3 environments", days: "7 business days", call: "45-minute findings call included", rescan: "1 re-scan included" };
  }
  return { servers: "up to 8 MCP servers across up to 2 environments", days: "5 business days", call: "30-minute findings call included", rescan: "1 re-scan included" };
}

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    throw new Error("Refusing to write first paid audit work orders inside the public MCPScan repo.");
  }
  return resolved;
}

const args = parseArgs(process.argv.slice(2));
const customer = requireValue("customer", args.customer);
const packageName = requireValue("package", args.package);
const contact = args.contact ?? "{{technical_contact}}";
const payment = args.payment ?? "{{stripe_payment_reference}}";
const date = args.date ?? today();
const baseDir = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Work Orders"));
const details = packageDefaults(packageName);
const workOrderDir = path.join(baseDir, `${date}_${slugify(customer)}_${slugify(packageName)}`);

if (fs.existsSync(workOrderDir)) {
  throw new Error(`Work order already exists: ${workOrderDir}`);
}

fs.mkdirSync(workOrderDir, { recursive: true });

const workOrder = [
  "# MCPScan First Paid Audit Work Order",
  "",
  `Generated: ${date}`,
  `Customer: ${customer}`,
  `Package: ${packageName}`,
  `Technical contact: ${contact}`,
  `Payment reference: ${payment}`,
  "",
  "## Delivery Promise",
  "",
  `- Scope: ${details.servers}`,
  `- Delivery target: ${details.days} after complete safe intake`,
  `- Findings call: ${details.call}`,
  `- Re-scan: ${details.rescan}`,
  "",
  "## Start Gate",
  "",
  "- [ ] Payment confirmed.",
  "- [ ] Client acceptance completed.",
  "- [ ] Customer authorization confirmed.",
  "- [ ] Secure handoff path confirmed.",
  "- [ ] No production credentials received through email or public issues.",
  "- [ ] Private customer workspace created outside the public repo.",
  "- [ ] Retention and deletion log initialized.",
  "",
  "## Workspace Command",
  "",
  "```text",
  `npm run delivery:workspace -- --customer "${customer}" --date ${date}`,
  "```",
  "",
  "## Delivery Checklist",
  "",
  "- [ ] Complete intake checklist.",
  "- [ ] Store sanitized configs.",
  "- [ ] Record evidence in evidence-register.csv.",
  "- [ ] Run MCPScan CLI and save JSON, Markdown, HTML, and SARIF outputs.",
  "- [ ] Fill findings tracker.",
  "- [ ] Draft report.",
  "- [ ] Draft buyer-facing summary if included.",
  "- [ ] Complete redaction checklist.",
  "- [ ] Complete QA signoff.",
  "- [ ] Send delivery cover note through approved path.",
  "",
  "## Kickoff Email",
  "",
  "```text",
  "Subject: MCPScan audit intake",
  "",
  `Hi ${contact.includes("@") ? "there" : contact},`,
  "",
  `Thanks for purchasing ${packageName} for ${customer}.`,
  "",
  "The audit clock starts after intake materials are complete. Please begin with sanitized materials:",
  "",
  "- MCP server/config list",
  "- sanitized MCP configs",
  "- admin policy screenshots or exports",
  "- known launch/security review deadline",
  "- any tools that should be explicitly out of scope",
  "",
  "Please do not send production credentials, active tokens, customer data, or sensitive files through email or public issues. If sensitive evidence is needed, we will confirm a private handoff path first.",
  "",
  "Thanks,",
  "MCPScan",
  "```",
  ""
].join("\n");

const manifest = {
  generated: date,
  customer,
  package: packageName,
  contact,
  payment,
  workOrderDir,
  noCustomerSecrets: true,
  publicRepoWrite: false
};

fs.writeFileSync(path.join(workOrderDir, "FIRST_PAID_AUDIT_WORK_ORDER.md"), workOrder, "utf8");
fs.writeFileSync(path.join(workOrderDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log("Created first paid audit work order.");
console.log(workOrderDir);
