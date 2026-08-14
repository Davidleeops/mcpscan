#!/usr/bin/env node
import { spawnSync } from "node:child_process";
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

function requireValue(name, value) {
  if (!value || !String(value).trim()) throw new Error(`Missing required ${name}.`);
  return String(value).trim();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function defaultAmount(packageName) {
  if (/enterprise/i.test(packageName)) return 3500;
  if (/quick/i.test(packageName)) return 750;
  return 1500;
}

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    throw new Error("Refusing to write payment evidence inside the public MCPScan repo.");
  }
  return resolved;
}

function runVerifier(file) {
  const child = spawnSync(process.execPath, ["scripts/verify-payment-evidence.mjs", "--file", file], { stdio: "inherit" });
  if (child.status !== 0) process.exit(child.status ?? 1);
}

const args = parseArgs(process.argv.slice(2));
const customer = requireValue("customer", args.customer);
const packageName = requireValue("package", args.package);
const paymentReference = requireValue("payment", args.payment);
const technicalContact = requireValue("contact", args.contact);
const safeIntakePath = requireValue("safe-intake", args["safe-intake"]);
const operatorInitials = requireValue("operator", args.operator);
const paidAt = args["paid-at"] ?? args.date ?? today();
const amountUsd = args.amount ? Number(args.amount) : defaultAmount(packageName);
if (!Number.isFinite(amountUsd)) throw new Error("amount must be a number.");

const baseDir = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Paid Audits", "payment-evidence"));
const outputPath = assertOutsideRepo(args.output ?? path.join(baseDir, `${paidAt.slice(0, 10)}_${slugify(customer)}_${slugify(packageName)}_payment-evidence.json`));

if (fs.existsSync(outputPath)) {
  throw new Error(`Payment evidence already exists: ${outputPath}`);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const evidence = {
  customerCompany: customer,
  packageName,
  amountUsd,
  paymentProvider: args.provider ?? "Stripe",
  paymentReference,
  paidAt,
  technicalContact,
  safeIntakePath,
  paymentConfirmed: true,
  approvedForPrivateWorkspace: true,
  noStripeSecrets: true,
  noProductionSecrets: true,
  noCustomerData: true,
  noPublicRepoStorage: true,
  operatorInitials
};

if (evidence.paymentProvider === "Manual approved" || /^manual_/i.test(paymentReference)) {
  evidence.approvedBy = requireValue("approved-by", args["approved-by"]);
  evidence.approvalTimestamp = requireValue("approval-timestamp", args["approval-timestamp"]);
  evidence.approvalSource = requireValue("approval-source", args["approval-source"]);
}

fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
runVerifier(outputPath);

console.log("Created payment evidence.");
console.log(outputPath);
