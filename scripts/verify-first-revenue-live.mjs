#!/usr/bin/env node
import { spawnSync } from "node:child_process";
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

function bool(value) {
  return value === true;
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

function runCheck(label, command, args, results) {
  const child = spawnSync(command, args, { stdio: "inherit" });
  if (child.status === 0) {
    results.push(result("pass", label));
  } else {
    results.push(result("fail", label, `command failed: ${command} ${args.join(" ")}`));
  }
}

const args = parseArgs(process.argv.slice(2));
const statusFile = args["status-file"] ?? "ops/founder-approval-status.json";
const resolvedStatusFile = path.resolve(root, statusFile);
const results = [];

if (!fs.existsSync(resolvedStatusFile)) {
  results.push(result("fail", "founder approval status", `missing ${statusFile}`));
  print(results);
  console.log("");
  console.log("Summary: 0 passed, 0 warnings, 1 failures.");
  process.exit(1);
}

let status;
try {
  status = JSON.parse(fs.readFileSync(resolvedStatusFile, "utf8"));
} catch {
  results.push(result("fail", "founder approval status", "invalid JSON"));
  print(results);
  process.exit(1);
}

const requiredTrueFields = [
  ["domainPurchased", "domain purchased"],
  ["mailboxCreated", "mailbox created"],
  ["githubPagesAConfigured", "GitHub Pages apex DNS configured"],
  ["githubPagesWwwConfigured", "GitHub Pages www DNS configured"],
  ["mxConfigured", "MX configured"],
  ["spfConfigured", "SPF configured"],
  ["dkimConfigured", "DKIM configured"],
  ["dmarcConfigured", "DMARC configured"],
  ["stripeLinkFormatVerified", "Stripe link format verified"],
  ["stripeCheckoutQaConfirmed", "Stripe checkout QA confirmed"],
  ["stripeLinksVerified", "Stripe links verified"],
  ["founderReturnPacketApproved", "founder return packet approved"],
  ["landingLinksApplied", "landing links applied"]
];

results.push(validDomain(status.domain) ? result("pass", "domain", status.domain) : result("fail", "domain", "missing or invalid"));
results.push(validEmail(status.mailbox) && status.mailbox.endsWith(`@${status.domain}`) ? result("pass", "mailbox", status.mailbox) : result("fail", "mailbox", "missing or not on domain"));
results.push(validEmail(status.auditAlias) && status.auditAlias.endsWith(`@${status.domain}`) ? result("pass", "audit alias", status.auditAlias) : result("fail", "audit alias", "missing or not on domain"));
results.push(validEmail(status.helloAlias) && status.helloAlias.endsWith(`@${status.domain}`) ? result("pass", "hello alias", status.helloAlias) : result("fail", "hello alias", "missing or not on domain"));

for (const [field, label] of requiredTrueFields) {
  results.push(bool(status[field]) ? result("pass", label) : result("fail", label, "must be true before first revenue is live"));
}

for (const [field, label] of [
  ["stripeQuickAuditLink", "Quick Audit Payment Link"],
  ["stripeLaunchAuditLink", "Launch Audit Payment Link"],
  ["stripeEnterpriseReadinessLink", "Enterprise Readiness Payment Link"]
]) {
  results.push(validStripeUrl(status[field]) ? result("pass", label, "live Stripe link") : result("fail", label, "missing or invalid live Stripe link"));
}

if (exists("landing/CNAME")) {
  const cname = read("landing/CNAME").trim();
  results.push(cname === status.domain ? result("pass", "custom domain CNAME", cname) : result("fail", "custom domain CNAME", `expected ${status.domain}, got ${cname || "empty"}`));
} else {
  results.push(result("fail", "custom domain CNAME", "missing landing/CNAME"));
}

if (exists("SECURITY.md")) {
  const security = read("SECURITY.md");
  const expectedContacts = [status.mailbox, status.auditAlias, status.helloAlias].filter(Boolean);
  const matched = expectedContacts.some((contact) => security.includes(contact));
  results.push(matched ? result("pass", "security contact", "approved mailbox appears in SECURITY.md") : result("fail", "security contact", "approved mailbox or alias is not in SECURITY.md"));
} else {
  results.push(result("fail", "security contact", "missing SECURITY.md"));
}

if (exists("landing/index.html")) {
  const landing = read("landing/index.html");
  const links = [status.stripeQuickAuditLink, status.stripeLaunchAuditLink, status.stripeEnterpriseReadinessLink];
  const missingLinks = links.filter((link) => !landing.includes(link));
  const hasIssuePlaceholder = landing.includes("github.com/Davidleeops/mcpscan/issues/new?title=MCPScan");
  results.push(!hasIssuePlaceholder ? result("pass", "landing checkout placeholders", "none found") : result("fail", "landing checkout placeholders", "GitHub issue checkout placeholder remains"));
  results.push(missingLinks.length === 0 ? result("pass", "landing live checkout links", "all approved Stripe links are present") : result("fail", "landing live checkout links", `${missingLinks.length} approved links missing`));
} else {
  results.push(result("fail", "landing page", "missing landing/index.html"));
}

const returnFile = args["return-file"];
const qaFile = args["qa-file"];
const cartFile = args["cart-file"];
if (returnFile || qaFile || cartFile) {
  if (!returnFile || !qaFile || !cartFile) {
    results.push(result("fail", "live evidence files", "requires --return-file, --qa-file, and --cart-file together"));
  } else {
    runCheck("cart proof matches return packet", "npm", ["run", "launch:verify-cart", "--", "--file", cartFile, "--return-file", returnFile], results);
    runCheck("return packet matches Stripe QA", "npm", ["run", "launch:verify-return-qa", "--", "--file", returnFile, "--qa-file", qaFile], results);
    runCheck("Stripe checkout QA evidence", "npm", ["run", "launch:verify-stripe-qa", "--", "--file", qaFile], results);
    runCheck("status matches return packet and Stripe QA", "npm", ["run", "launch:verify-status", "--", "--status-file", statusFile, "--file", returnFile, "--qa-file", qaFile], results);
  }
} else {
  results.push(result("warn", "live evidence files", "not provided, status and public files only"));
}

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (failures.length > 0) process.exit(1);
