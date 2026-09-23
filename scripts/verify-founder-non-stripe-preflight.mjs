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

function readJson(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function bool(value) {
  return value === true;
}

function coalesce(...values) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");
}

function emailOnDomain(value, domain) {
  return validEmail(value) && String(value).toLowerCase().endsWith(`@${String(domain).toLowerCase()}`);
}

function compare(results, label, actual, expected) {
  const cleanActual = String(actual ?? "").trim().toLowerCase();
  const cleanExpected = String(expected ?? "").trim().toLowerCase();
  results.push(cleanActual === cleanExpected ? result("pass", label, String(actual)) : result("fail", label, `expected ${expected}, got ${actual}`));
}

function createStatus(values, existing = {}) {
  return {
    generatedFor: existing.generatedFor ?? "MCPScan first revenue launch",
    updatedAt: new Date().toISOString(),
    preStripeFounderPreflight: true,
    domain: values.domain,
    mailProvider: values.mailProvider,
    mailbox: values.mailbox,
    auditAlias: values.auditAlias,
    helloAlias: values.helloAlias,
    domainPurchased: true,
    mailboxCreated: true,
    githubPagesAConfigured: bool(existing.githubPagesAConfigured),
    githubPagesWwwConfigured: bool(existing.githubPagesWwwConfigured),
    mxConfigured: bool(existing.mxConfigured),
    spfConfigured: bool(existing.spfConfigured),
    dkimConfigured: bool(existing.dkimConfigured),
    dmarcConfigured: bool(existing.dmarcConfigured),
    stripeQuickAuditLink: existing.stripeQuickAuditLink ?? "",
    stripeLaunchAuditLink: existing.stripeLaunchAuditLink ?? "",
    stripeEnterpriseReadinessLink: existing.stripeEnterpriseReadinessLink ?? "",
    stripeLinkFormatVerified: bool(existing.stripeLinkFormatVerified),
    stripeCheckoutQaConfirmed: bool(existing.stripeCheckoutQaConfirmed),
    stripeLinksVerified: bool(existing.stripeLinksVerified),
    founderReturnPacketApproved: bool(existing.founderReturnPacketApproved),
    domainMailboxPacketApproved: bool(existing.domainMailboxPacketApproved),
    domainMailboxValuesApplied: bool(existing.domainMailboxValuesApplied),
    landingLinksApplied: bool(existing.landingLinksApplied),
    stagedRouteApprovalCount: existing.stagedRouteApprovalCount ?? 0,
    firstTenRoutePacketApproved: bool(existing.firstTenRoutePacketApproved),
    stagedNamedRecipientApprovalCount: existing.stagedNamedRecipientApprovalCount ?? 0,
    firstTenNamedRecipientPacketApproved: bool(existing.firstTenNamedRecipientPacketApproved),
    notes: [
      "Generated or refreshed by scripts/verify-founder-non-stripe-preflight.mjs.",
      "This is a non-Stripe preflight tracker only. It must not be treated as first-revenue live proof.",
      "Run npm run launch:verify-dns with update status after DNS records propagate.",
      "Run npm run launch:apply-return-packet only after the three live Stripe Payment Links exist.",
      "Keep outbound paused until exact recipients and exact final messages are approved in the same turn."
    ]
  };
}

const args = parseArgs(process.argv.slice(2));
const statusFile = args["status-file"] ?? "ops/founder-approval-status.json";
const statusPath = path.resolve(process.cwd(), statusFile);
const writeStatus = args["write-status"] === "true";
const requireDns = args["require-dns"] === "true";
const strict = args.strict === "true";
const results = [];

let existing = null;
try {
  existing = readJson(statusPath);
} catch {
  results.push(result("fail", "approval status JSON", `invalid JSON in ${statusFile}`));
}

const values = {
  domain: String(coalesce(args.domain, existing?.domain, "")).trim().toLowerCase(),
  mailProvider: String(coalesce(args["mail-provider"], existing?.mailProvider, "zoho")).trim().toLowerCase(),
  mailbox: String(coalesce(args.mailbox, existing?.mailbox, "")).trim(),
  auditAlias: String(coalesce(args["audit-alias"], existing?.auditAlias, "")).trim(),
  helloAlias: String(coalesce(args["hello-alias"], existing?.helloAlias, "")).trim()
};

results.push(validDomain(values.domain) ? result("pass", "domain", values.domain) : result("fail", "domain", "missing or invalid"));
results.push(["zoho", "google", "spacemail"].includes(values.mailProvider) ? result("pass", "mail provider", values.mailProvider) : result("fail", "mail provider", "must be zoho, google, or spacemail"));
results.push(emailOnDomain(values.mailbox, values.domain) ? result("pass", "primary mailbox", values.mailbox) : result("fail", "primary mailbox", "missing or not on domain"));
results.push(emailOnDomain(values.auditAlias, values.domain) ? result("pass", "audit alias", values.auditAlias) : result("fail", "audit alias", "missing or not on domain"));
results.push(emailOnDomain(values.helloAlias, values.domain) ? result("pass", "hello alias", values.helloAlias) : result("fail", "hello alias", "missing or not on domain"));

if (existing) {
  const raw = fs.readFileSync(statusPath, "utf8");
  const strings = flattenStrings(existing);
  results.push(hasSecretLikeValue(raw) ? result("fail", "public-safe status", "secret-like value detected") : result("pass", "public-safe status", "no obvious secrets"));
  results.push(strings.some(hasPlaceholder) ? result("warn", "status placeholders", "template placeholders remain") : result("pass", "status placeholders", "none"));
  compare(results, "status domain", existing.domain, values.domain);
  compare(results, "status mail provider", existing.mailProvider, values.mailProvider);
  compare(results, "status mailbox", existing.mailbox, values.mailbox);
  compare(results, "status audit alias", existing.auditAlias, values.auditAlias);
  compare(results, "status hello alias", existing.helloAlias, values.helloAlias);
} else {
  results.push(writeStatus ? result("warn", "approval status", `${statusFile} will be created`) : result("warn", "approval status", `${statusFile} missing, add --write-status true to create non-Stripe tracker`));
}

if (fs.existsSync("landing/CNAME")) {
  const cname = fs.readFileSync("landing/CNAME", "utf8").trim().toLowerCase();
  results.push(cname === values.domain ? result("pass", "custom domain CNAME", cname) : result("warn", "custom domain CNAME", `expected ${values.domain}, got ${cname || "empty"}`));
} else {
  results.push(result("warn", "custom domain CNAME", "landing/CNAME is not present yet"));
}

if (fs.existsSync("SECURITY.md")) {
  const security = fs.readFileSync("SECURITY.md", "utf8");
  results.push(security.includes(values.mailbox) || security.includes(values.auditAlias) || security.includes(values.helloAlias) ? result("pass", "security contact", "approved mailbox appears in SECURITY.md") : result("warn", "security contact", "approved mailbox or alias is not in SECURITY.md yet"));
} else {
  results.push(result("fail", "security contact", "missing SECURITY.md"));
}

if (existing && requireDns) {
  for (const [field, label] of [
    ["githubPagesAConfigured", "GitHub Pages apex DNS"],
    ["githubPagesWwwConfigured", "GitHub Pages www DNS"],
    ["mxConfigured", "MX"],
    ["spfConfigured", "SPF"],
    ["dkimConfigured", "DKIM"],
    ["dmarcConfigured", "DMARC"]
  ]) {
    results.push(bool(existing[field]) ? result("pass", label) : result("fail", label, "must be true for DNS-ready preflight"));
  }
}

const failuresBeforeWrite = results.filter((item) => item.kind === "fail");
if (writeStatus && failuresBeforeWrite.length === 0) {
  const next = createStatus(values, existing ?? {});
  fs.mkdirSync(path.dirname(statusPath), { recursive: true });
  fs.writeFileSync(statusPath, `${JSON.stringify(next, null, 2)}\n`);
  results.push(result("pass", "approval status write", statusFile));
}

results.push(result("warn", "Stripe deferred", "run launch:apply-return-packet and launch:verify-live only after live Stripe links and QA evidence exist"));

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (failures.length > 0) process.exit(1);
if (strict && warnings.length > 0) process.exit(1);
