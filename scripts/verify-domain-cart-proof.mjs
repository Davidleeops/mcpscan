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

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value ?? "");
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? "");
}

function tld(value) {
  return String(value ?? "").split(".").pop()?.toLowerCase() ?? "";
}

function money(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
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
    /-----BEGIN [A-Z ]+PRIVATE KEY-----/
  ].some((pattern) => pattern.test(text));
}

function bool(value) {
  return value === true;
}

const args = parseArgs(process.argv.slice(2));
const file = args.file ?? "ops/domain-cart-proof.sample.json";
const proofPath = path.resolve(process.cwd(), file);
const results = [];

if (!fs.existsSync(proofPath)) {
  results.push(result("fail", "domain cart proof", `missing ${file}`));
  print(results);
  console.log("");
  console.log("Summary: 0 passed, 0 warnings, 1 failures.");
  process.exit(1);
}

const raw = fs.readFileSync(proofPath, "utf8");
let proof;
try {
  proof = JSON.parse(raw);
} catch {
  results.push(result("fail", "domain cart proof JSON", "invalid JSON"));
}

if (proof) {
  const domain = String(proof.domain ?? "").toLowerCase();
  const primaryMailbox = String(proof.primaryMailbox ?? "").toLowerCase();
  const auditAlias = String(proof.auditAlias ?? "").toLowerCase();
  const helloAlias = String(proof.helloAlias ?? "").toLowerCase();
  const firstYear = money(proof.firstYearDomainUsd);
  const renewal = money(proof.renewalDomainUsd);
  const mailboxCost = money(proof.mailboxUsd);
  const maxFirstYear = money(proof.maxFirstYearDomainUsd ?? 3);
  const allowedTlds = new Set(["com", "dev", "xyz", "online", "site", "us", "click"]);
  const cheapTlds = new Set(["xyz", "online", "site", "click"]);
  const strings = flattenStrings(proof);
  const domainTld = tld(domain);

  results.push(hasSecretLikeValue(raw) ? result("fail", "public-safe cart proof", "secret-like value detected") : result("pass", "public-safe cart proof", "no obvious secrets"));
  results.push(strings.some(hasPlaceholder) ? result("fail", "cart proof placeholders", "replace placeholders before approval") : result("pass", "cart proof placeholders", "none"));
  results.push(validDomain(domain) ? result("pass", "domain", domain) : result("fail", "domain", "missing or invalid"));
  results.push(proof.registrar === "Spaceship" ? result("pass", "registrar", "Spaceship") : result("fail", "registrar", "must be Spaceship for this cheap-lane proof"));
  results.push(allowedTlds.has(domainTld) ? result("pass", "TLD", domainTld) : result("fail", "TLD", "not in approved first-revenue list"));
  results.push(proof.domainAvailable === true ? result("pass", "availability", "cart shows available") : result("fail", "availability", "cart must show available"));
  results.push(firstYear !== null && maxFirstYear !== null && firstYear <= maxFirstYear ? result("pass", "first-year domain price", `$${firstYear}`) : result("fail", "first-year domain price", `must be at or below $${maxFirstYear ?? 3}`));
  results.push(renewal !== null && renewal > 0 ? result("pass", "renewal price visible", `$${renewal}`) : result("fail", "renewal price visible", "must be visible before purchase"));
  results.push(bool(proof.renewalAcknowledged) ? result("pass", "renewal acknowledged") : result("fail", "renewal acknowledged", "founder must acknowledge renewal price"));
  results.push(proof.domainCount === 1 ? result("pass", "domain count", "one") : result("fail", "domain count", "buy one domain only"));
  results.push(proof.mailboxCount === 1 ? result("pass", "mailbox count", "one") : result("fail", "mailbox count", "buy one mailbox only"));
  results.push(["spacemail", "zoho", "google"].includes(proof.mailProvider) ? result("pass", "mail provider", proof.mailProvider) : result("fail", "mail provider", "must be spacemail, zoho, or google"));
  results.push(mailboxCost !== null && mailboxCost >= 0 ? result("pass", "mailbox price captured", `$${mailboxCost}`) : result("fail", "mailbox price captured", "must be a number"));

  for (const [value, label] of [
    [primaryMailbox, "primary mailbox"],
    [auditAlias, "audit alias"],
    [helloAlias, "hello alias"]
  ]) {
    results.push(validEmail(value) && value.endsWith(`@${domain}`) ? result("pass", label, value) : result("fail", label, "must be on the approved domain"));
  }

  const addOns = [
    ["paidHosting", "paid hosting"],
    ["paidSsl", "paid SSL"],
    ["siteBuilder", "site builder"],
    ["extraDomains", "extra domains"],
    ["extraMailboxes", "extra mailboxes"],
    ["paidPrivacyUpsell", "paid privacy upsell"]
  ];
  for (const [field, label] of addOns) {
    results.push(proof[field] === false ? result("pass", label, "not in cart") : result("fail", label, "remove before purchase"));
  }

  results.push(bool(proof.freePrivacyKept) ? result("pass", "free privacy kept") : result("warn", "free privacy kept", "keep free included privacy if available"));
  results.push(bool(proof.founderApproval) ? result("pass", "founder approval") : result("fail", "founder approval", "must be true before purchase"));
  results.push(String(proof.approvalText ?? "").includes("I approve buying the MCPScan launch domain") ? result("pass", "approval phrase") : result("fail", "approval phrase", "missing required approval text"));

  if (cheapTlds.has(domainTld) && renewal !== null && renewal > 20) {
    results.push(bool(proof.cheapRenewalTradeoffAcknowledged) ? result("pass", "cheap renewal tradeoff acknowledged", `$${renewal}`) : result("fail", "cheap renewal tradeoff acknowledged", "required for high-renewal promo TLDs"));
  }
}

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (failures.length > 0) process.exit(1);
if (args.strict === "true" && warnings.length > 0) process.exit(1);
