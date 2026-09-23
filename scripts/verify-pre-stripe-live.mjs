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

function result(kind, label, detail = "") {
  return { kind, label, detail };
}

function print(results) {
  for (const item of results) {
    const mark = item.kind === "pass" ? "PASS" : item.kind === "warn" ? "WARN" : "FAIL";
    console.log(`${mark} ${item.label}${item.detail ? ` - ${item.detail}` : ""}`);
  }
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
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

const args = parseArgs(process.argv.slice(2));
const statusFile = args["status-file"] ?? "ops/founder-approval-status.json";
const statusPath = path.resolve(root, statusFile);
const requireDns = args["require-dns"] === "true";
const results = [];

if (!fs.existsSync(statusPath)) {
  results.push(result("fail", "founder approval status", `missing ${statusFile}`));
  print(results);
  console.log("");
  console.log("Summary: 0 passed, 0 warnings, 1 failures.");
  process.exit(1);
}

let status;
try {
  status = JSON.parse(fs.readFileSync(statusPath, "utf8"));
} catch {
  results.push(result("fail", "founder approval status", "invalid JSON"));
}

if (status) {
  results.push(validDomain(status.domain) ? result("pass", "domain", status.domain) : result("fail", "domain", "missing or invalid"));
  results.push(status.domainPurchased === true ? result("pass", "domain purchased") : result("fail", "domain purchased", "must be true"));
  results.push(["zoho", "google", "spacemail"].includes(status.mailProvider) ? result("pass", "mail provider", status.mailProvider) : result("fail", "mail provider", "must be zoho, google, or spacemail"));
  results.push(validEmail(status.mailbox) && status.mailbox.endsWith(`@${status.domain}`) ? result("pass", "mailbox", status.mailbox) : result("fail", "mailbox", "missing or not on domain"));
  results.push(validEmail(status.auditAlias) && status.auditAlias.endsWith(`@${status.domain}`) ? result("pass", "audit alias", status.auditAlias) : result("fail", "audit alias", "missing or not on domain"));
  results.push(validEmail(status.helloAlias) && status.helloAlias.endsWith(`@${status.domain}`) ? result("pass", "hello alias", status.helloAlias) : result("fail", "hello alias", "missing or not on domain"));
  results.push(status.mailboxCreated === true ? result("pass", "mailbox created") : result("fail", "mailbox created", "must be true"));
  results.push(status.domainMailboxPacketApproved === true ? result("pass", "domain mailbox packet approved") : result("fail", "domain mailbox packet approved", "must be true"));
  results.push(status.domainMailboxValuesApplied === true ? result("pass", "domain mailbox values applied") : result("fail", "domain mailbox values applied", "must be true"));

  for (const [field, label] of [
    ["githubPagesAConfigured", "GitHub Pages apex DNS configured"],
    ["githubPagesWwwConfigured", "GitHub Pages www DNS configured"],
    ["mxConfigured", "MX configured"],
    ["spfConfigured", "SPF configured"],
    ["dmarcConfigured", "DMARC configured"]
  ]) {
    if (status[field] === true) {
      results.push(result("pass", label));
    } else {
      results.push(result(requireDns ? "fail" : "warn", label, "pending DNS propagation or verification"));
    }
  }

  results.push(status.dkimConfigured === true ? result("pass", "DKIM configured") : result("warn", "DKIM configured", "pending provider selector or verification"));

  const stripeValues = [
    status.stripeQuickAuditLink,
    status.stripeLaunchAuditLink,
    status.stripeEnterpriseReadinessLink
  ];
  const liveStripeValues = stripeValues.filter(validStripeUrl);
  results.push(liveStripeValues.length === 0 ? result("pass", "Stripe held for final step", "no live checkout links applied") : result("warn", "Stripe held for final step", `${liveStripeValues.length} live checkout link value(s) already present`));
  results.push(status.stripeLinksVerified === true ? result("warn", "Stripe verification", "already marked verified") : result("pass", "Stripe verification pending"));
}

if (status && exists("landing/CNAME")) {
  const cname = read("landing/CNAME").trim();
  results.push(cname === status.domain ? result("pass", "custom domain CNAME", cname) : result("fail", "custom domain CNAME", `expected ${status.domain}, got ${cname || "empty"}`));
} else {
  results.push(result("fail", "custom domain CNAME", "missing landing/CNAME"));
}

if (status && exists("SECURITY.md")) {
  const security = read("SECURITY.md");
  const expectedContacts = [status.mailbox, status.auditAlias, status.helloAlias].filter(Boolean);
  const matched = expectedContacts.some((contact) => security.includes(contact));
  results.push(matched ? result("pass", "security contact", "approved mailbox appears in SECURITY.md") : result("fail", "security contact", "approved mailbox or alias is not in SECURITY.md"));
} else {
  results.push(result("fail", "security contact", "missing SECURITY.md"));
}

if (status && exists("landing/index.html")) {
  const landing = read("landing/index.html");
  results.push(landing.includes(`mailto:${status.mailbox}`) ? result("pass", "landing contact email", status.mailbox) : result("fail", "landing contact email", "approved mailbox is not linked"));
  results.push(landing.includes("github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20Launch%20Audit%20request") ? result("pass", "checkout links held", "Stripe checkout placeholder remains for final step") : result("warn", "checkout links held", "Launch Audit placeholder was replaced before Stripe final step"));
} else {
  results.push(result("fail", "landing page", "missing landing/index.html"));
}

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (failures.length > 0) process.exit(1);
if (args.strict === "true" && warnings.length > 0) process.exit(1);
