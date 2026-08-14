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

function pass(message) {
  console.log(`PASS ${message}`);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPaymentReference(value) {
  return /^(pi_|cs_|plink_|ch_|checkout_|receipt_|in_|manual_)/i.test(value) || /^https:\/\/\S*(stripe|receipt|invoice|checkout)\S*$/i.test(value);
}

function validDateOrTimestamp(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value.slice(0, 10));
}

function hasPlaceholder(value) {
  return typeof value === "string" && /\{\{[^}]+\}\}/.test(value);
}

function hasRequiredBool(data, key) {
  return data[key] === true;
}

function expectedFloor(packageName) {
  if (/enterprise/i.test(packageName)) return 3500;
  if (/launch/i.test(packageName)) return 1500;
  if (/quick/i.test(packageName)) return 750;
  return null;
}

function flattenStrings(value, parts = []) {
  if (typeof value === "string") parts.push(value);
  if (Array.isArray(value)) {
    for (const item of value) flattenStrings(item, parts);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) flattenStrings(item, parts);
  }
  return parts;
}

function assertNoSecretLikeValues(text) {
  const secretPatterns = [
    /sk_live_[A-Za-z0-9]+/,
    /sk_test_[A-Za-z0-9]+/,
    /rk_live_[A-Za-z0-9]+/,
    /whsec_[A-Za-z0-9]+/,
    /ghp_[A-Za-z0-9_]+/,
    /github_pat_[A-Za-z0-9_]+/,
    /xox[baprs]-[A-Za-z0-9-]+/,
    /-----BEGIN [A-Z ]+PRIVATE KEY-----/
  ];

  for (const pattern of secretPatterns) {
    if (pattern.test(text)) fail("Payment evidence appears to contain a secret, token, or private key.");
  }
}

function assertOutsideRepoIfPath(value) {
  if (!value || /^https:\/\/\S+$/i.test(value) || validEmail(value)) return;
  const resolved = path.resolve(value);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail("Safe intake path must not point inside the public MCPScan repo.");
  }
}

const args = parseArgs(process.argv.slice(2));
if (!args.file) fail("Usage: node scripts/verify-payment-evidence.mjs --file /path/to/payment-evidence.json");

const raw = fs.readFileSync(args.file, "utf8");
assertNoSecretLikeValues(raw);

let data;
try {
  data = JSON.parse(raw);
} catch {
  fail("Payment evidence must be valid JSON.");
}

const requiredStrings = [
  "customerCompany",
  "packageName",
  "paymentProvider",
  "paymentReference",
  "paidAt",
  "technicalContact",
  "safeIntakePath",
  "operatorInitials"
];

for (const key of requiredStrings) {
  if (typeof data[key] !== "string" || data[key].trim().length === 0) fail(`Payment evidence missing required field: ${key}.`);
  if (hasPlaceholder(data[key])) fail(`Replace template placeholder before using payment evidence: ${key}.`);
}

for (const value of flattenStrings(data)) {
  if (hasPlaceholder(value)) fail("Payment evidence still contains a template placeholder.");
}

if (data.paymentProvider !== "Stripe" && data.paymentProvider !== "Manual approved") {
  fail("Payment provider must be Stripe or Manual approved.");
}

if (!validPaymentReference(data.paymentReference)) {
  fail("Payment reference must look like a Stripe reference, receipt URL, invoice URL, checkout URL, or approved manual reference.");
}

if (!validDateOrTimestamp(data.paidAt)) fail("paidAt must be YYYY-MM-DD or an ISO timestamp.");
if (!validEmail(data.technicalContact) && !/^https:\/\/\S+$/i.test(data.technicalContact)) fail("Technical contact must be an email address or HTTPS URL.");
if (!/^https:\/\/\S+$/i.test(data.safeIntakePath) && !path.isAbsolute(data.safeIntakePath)) fail("Safe intake path must be an HTTPS URL or absolute private path.");
assertOutsideRepoIfPath(data.safeIntakePath);

if (typeof data.amountUsd !== "number" || !Number.isFinite(data.amountUsd) || data.amountUsd <= 0) {
  fail("amountUsd must be a positive number.");
}

const floor = expectedFloor(data.packageName);
if (floor === null) fail("Package name must mention Quick, Launch, or Enterprise.");
if (data.amountUsd < floor) fail(`amountUsd is below the expected floor for ${data.packageName}: ${floor}.`);

const boolFields = [
  "paymentConfirmed",
  "approvedForPrivateWorkspace",
  "noStripeSecrets",
  "noProductionSecrets",
  "noCustomerData",
  "noPublicRepoStorage"
];

for (const key of boolFields) {
  if (!hasRequiredBool(data, key)) fail(`Payment evidence must confirm ${key}.`);
}

pass("payment evidence is structurally valid");
pass("payment reference is usable without storing Stripe secrets");
pass("package and amount meet the configured floor");
pass("private workspace and safe intake gates are approved");
pass("payment evidence is clear of obvious secret patterns");
