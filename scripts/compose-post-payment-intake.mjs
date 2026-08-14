#!/usr/bin/env node
import fs from "node:fs";
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

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(file) {
  const resolved = path.resolve(file);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail("Refusing to read customer pipeline status from inside the public MCPScan repo.");
  }
  if (!fs.existsSync(resolved)) fail(`Pipeline status file not found: ${resolved}`);
  return JSON.parse(fs.readFileSync(resolved, "utf8"));
}

function value(name, input) {
  const result = String(input ?? "").trim();
  if (!result) fail(`Missing pipeline status value: ${name}.`);
  if (/\{\{[^}]+\}\}/.test(result)) fail(`Replace template placeholder before composing intake: ${name}.`);
  return result;
}

function displayName(args, contact) {
  if (args["first-name"]) return args["first-name"].trim();
  if (contact.includes("@")) return "there";
  return contact;
}

const args = parseArgs(process.argv.slice(2));
if (!args.file) {
  fail("Missing --file path to private pipeline status JSON.");
}

const status = readJson(args.file);
const contact = value("technicalContact", status.technicalContact);
const firstName = displayName(args, contact);
const packageName = value("package", status.package);
const account = value("account", status.account);
const workspaceRoot = value("workspaceRoot", status.workspaceRoot);

const draft = [
  "DRAFT ONLY. Do not send until the exact recipient and exact final content are approved in the same turn.",
  "",
  `To: ${contact}`,
  "Subject: MCPScan audit intake",
  "",
  `Hi ${firstName},`,
  "",
  `Thanks for purchasing ${packageName} for ${account}.`,
  "",
  "The audit clock starts after intake materials are complete. Please begin with sanitized materials:",
  "",
  "- MCP server/config list",
  "- sanitized MCP configs",
  "- admin policy screenshots or exports",
  "- known launch/security review deadline",
  "- any tools that should be explicitly out of scope",
  "",
  "Secure intake guidance:",
  "https://davidleeops.github.io/mcpscan/secure-intake.html",
  "",
  "Please do not send production credentials, active tokens, customer data, or sensitive files through email or public issues. Please only submit systems and materials you are authorized to include in the agreed scope.",
  "",
  "Thanks,",
  "MCPScan",
  "",
  "Private operator note:",
  `Workspace root: ${workspaceRoot}`,
  "Keep customer material outside the public repo.",
  ""
].join("\n");

if (args.output) {
  const output = path.resolve(args.output);
  if (output === root || output.startsWith(root + path.sep)) {
    fail("Refusing to write customer intake draft inside the public MCPScan repo.");
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, draft, "utf8");
  console.log(`Wrote draft-only intake message: ${output}`);
} else {
  console.log(draft);
}
