#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

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

function result(kind, label, detail = "") {
  return { kind, label, detail };
}

function print(results) {
  for (const item of results) {
    const mark = item.kind === "pass" ? "PASS" : item.kind === "warn" ? "WARN" : "FAIL";
    console.log(`${mark} ${item.label}${item.detail ? ` - ${item.detail}` : ""}`);
  }
}

function valueFromInput(label, input) {
  const match = input.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim();
}

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value ?? "");
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? "");
}

function validStripeUrl(value) {
  return /^https:\/\/buy\.stripe\.com\/\S+$/i.test(value ?? "") && !/test_/i.test(value ?? "");
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function hasPlaceholder(value) {
  return typeof value === "string" && /\{\{[^}]+\}\}/.test(value);
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

function hasSecretLikeValue(text) {
  return [
    /sk_live_[A-Za-z0-9]+/,
    /sk_test_[A-Za-z0-9]+/,
    /rk_live_[A-Za-z0-9]+/,
    /whsec_[A-Za-z0-9]+/,
    /ghp_[A-Za-z0-9_]+/,
    /github_pat_[A-Za-z0-9_]+/,
    /xox[baprs]-[A-Za-z0-9-]+/,
    /-----BEGIN [A-Z ]+PRIVATE KEY-----/
  ].some((pattern) => pattern.test(text));
}

function linkById(data, id) {
  return Array.isArray(data.links) ? data.links.find((item) => item.id === id) : null;
}

function compare(results, label, actual, expected) {
  results.push(normalize(actual) === normalize(expected) ? result("pass", label, String(actual)) : result("fail", label, `expected ${expected}, got ${actual}`));
}

const args = parseArgs(process.argv.slice(2));
const statusFile = args["status-file"] ?? "ops/founder-approval-status.json";
const statusPath = path.resolve(process.cwd(), statusFile);
const results = [];

if (!fs.existsSync(statusPath)) {
  results.push(result("fail", "approval status", `missing ${statusFile}`));
  print(results);
  console.log("");
  console.log("Summary: 0 passed, 0 warnings, 1 failures.");
  process.exit(1);
}

const statusRaw = fs.readFileSync(statusPath, "utf8");
let status;
try {
  status = JSON.parse(statusRaw);
} catch {
  results.push(result("fail", "approval status JSON", "invalid JSON"));
}

if (status) {
  const strings = flattenStrings(status);
  results.push(hasSecretLikeValue(statusRaw) ? result("fail", "public-safe status", "secret-like value detected") : result("pass", "public-safe status", "no obvious secrets"));
  results.push(strings.some(hasPlaceholder) ? result("warn", "status placeholders", "template placeholders remain") : result("pass", "status placeholders", "none"));
  results.push(validDomain(status.domain) ? result("pass", "status domain", status.domain) : result("fail", "status domain", "missing or invalid"));
  results.push(["zoho", "google", "spacemail"].includes(status.mailProvider) ? result("pass", "status mail provider", status.mailProvider) : result("fail", "status mail provider", "must be zoho, google, or spacemail"));

  for (const [field, label] of [
    ["mailbox", "status mailbox"],
    ["auditAlias", "status audit alias"],
    ["helloAlias", "status hello alias"]
  ]) {
    const value = status[field];
    results.push(validEmail(value) && normalize(value).endsWith(`@${normalize(status.domain)}`) ? result("pass", label, value) : result("fail", label, "missing or not on approved domain"));
  }

  for (const [field, label] of [
    ["stripeQuickAuditLink", "status Quick Audit link"],
    ["stripeLaunchAuditLink", "status Launch Audit link"],
    ["stripeEnterpriseReadinessLink", "status Enterprise Readiness link"]
  ]) {
    results.push(validStripeUrl(status[field]) ? result("pass", label, "live Stripe URL") : result("fail", label, "missing or invalid live Stripe URL"));
  }

  const expectedStripeVerified = Boolean(status.stripeLinkFormatVerified && status.stripeCheckoutQaConfirmed);
  results.push(status.stripeLinksVerified === expectedStripeVerified ? result("pass", "status Stripe verification coherence", String(status.stripeLinksVerified)) : result("fail", "status Stripe verification coherence", "stripeLinksVerified must equal format and checkout QA"));
}

if (status && args.file) {
  if (!fs.existsSync(args.file)) {
    results.push(result("fail", "return packet", `missing ${args.file}`));
  } else {
    const input = fs.readFileSync(args.file, "utf8");
    const packet = {
      domain: valueFromInput("Domain", input),
      mailProvider: valueFromInput("Mail provider", input),
      mailbox: valueFromInput("Primary mailbox", input),
      auditAlias: valueFromInput("Audit alias", input),
      helloAlias: valueFromInput("Hello alias", input),
      quick: valueFromInput("Quick Audit", input),
      launch: valueFromInput("Launch Audit", input),
      enterprise: valueFromInput("Enterprise Readiness", input)
    };
    compare(results, "return packet domain matches status", status.domain, packet.domain);
    compare(results, "return packet mail provider matches status", status.mailProvider, packet.mailProvider);
    compare(results, "return packet mailbox matches status", status.mailbox, packet.mailbox);
    compare(results, "return packet audit alias matches status", status.auditAlias, packet.auditAlias);
    compare(results, "return packet hello alias matches status", status.helloAlias, packet.helloAlias);
    compare(results, "return packet Quick Audit link matches status", status.stripeQuickAuditLink, packet.quick);
    compare(results, "return packet Launch Audit link matches status", status.stripeLaunchAuditLink, packet.launch);
    compare(results, "return packet Enterprise Readiness link matches status", status.stripeEnterpriseReadinessLink, packet.enterprise);
  }
}

if (status && args["qa-file"]) {
  if (!fs.existsSync(args["qa-file"])) {
    results.push(result("fail", "Stripe QA evidence", `missing ${args["qa-file"]}`));
  } else {
    let qa;
    try {
      qa = JSON.parse(fs.readFileSync(args["qa-file"], "utf8"));
    } catch {
      results.push(result("fail", "Stripe QA evidence JSON", "invalid JSON"));
    }

    if (qa) {
      compare(results, "Stripe QA domain matches status", status.domain, qa.domain);
      compare(results, "Stripe QA mailbox matches status", status.mailbox, qa.primaryMailbox);
      compare(results, "Stripe QA Quick Audit link matches status", status.stripeQuickAuditLink, linkById(qa, "quick")?.checkoutUrl);
      compare(results, "Stripe QA Launch Audit link matches status", status.stripeLaunchAuditLink, linkById(qa, "launch")?.checkoutUrl);
      compare(results, "Stripe QA Enterprise Readiness link matches status", status.stripeEnterpriseReadinessLink, linkById(qa, "enterprise")?.checkoutUrl);
    }
  }
}

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (failures.length > 0) process.exit(1);
if (args.strict === "true" && warnings.length > 0) process.exit(1);
