#!/usr/bin/env node
import { spawnSync } from "node:child_process";
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

function runEvidenceCheck(label, command, args) {
  const child = spawnSync(command, args, { stdio: "inherit" });
  if (child.status !== 0) {
    results.push(result("fail", label, `command failed: ${command} ${args.join(" ")}`));
  } else {
    results.push(result("pass", label));
  }
}

const args = parseArgs(process.argv.slice(2));
const statusFile = args["status-file"] ?? "ops/founder-approval-status.json";
const resolvedStatusFile = path.resolve(process.cwd(), statusFile);
const results = [];

if (!fs.existsSync(resolvedStatusFile)) {
  results.push(result("fail", "approval status", `missing ${statusFile}`));
  print(results);
  console.log("");
  console.log("Summary: 0 passed, 0 warnings, 1 failures.");
  process.exit(1);
}

const status = JSON.parse(fs.readFileSync(resolvedStatusFile, "utf8"));
const returnFile = args["return-file"];
const qaFile = args["qa-file"];
const cartFile = args["cart-file"];

if (cartFile || returnFile || qaFile) {
  if (cartFile && returnFile) {
    runEvidenceCheck("cart proof matches return packet", "npm", ["run", "launch:verify-cart", "--", "--file", cartFile, "--return-file", returnFile]);
  } else if (cartFile || returnFile) {
    results.push(result("fail", "cart proof matches return packet", "requires both --cart-file and --return-file"));
  }

  if (returnFile && qaFile) {
    runEvidenceCheck("return packet matches Stripe QA", "npm", ["run", "launch:verify-return-qa", "--", "--file", returnFile, "--qa-file", qaFile]);
    runEvidenceCheck("Stripe checkout QA evidence", "npm", ["run", "launch:verify-stripe-qa", "--", "--file", qaFile]);
    runEvidenceCheck("status matches return packet and Stripe QA", "npm", ["run", "launch:verify-status", "--", "--status-file", statusFile, "--file", returnFile, "--qa-file", qaFile]);
  } else if (returnFile || qaFile) {
    results.push(result("fail", "return packet and Stripe QA evidence", "requires both --return-file and --qa-file"));
  }
}

results.push(validDomain(status.domain) ? result("pass", "domain", status.domain) : result("fail", "domain", "missing or invalid"));
results.push(validEmail(status.mailbox) && status.mailbox.endsWith(`@${status.domain}`) ? result("pass", "mailbox", status.mailbox) : result("fail", "mailbox", "missing or not on approved domain"));
results.push(validEmail(status.auditAlias) && status.auditAlias.endsWith(`@${status.domain}`) ? result("pass", "audit alias", status.auditAlias) : result("fail", "audit alias", "missing or not on approved domain"));
results.push(validEmail(status.helloAlias) && status.helloAlias.endsWith(`@${status.domain}`) ? result("pass", "hello alias", status.helloAlias) : result("fail", "hello alias", "missing or not on approved domain"));

for (const [field, label] of [
  ["domainPurchased", "domain purchased"],
  ["mailboxCreated", "mailbox created"],
  ["githubPagesAConfigured", "GitHub Pages apex configured"],
  ["githubPagesWwwConfigured", "GitHub Pages www configured"],
  ["mxConfigured", "MX configured"],
  ["spfConfigured", "SPF configured"],
  ["dkimConfigured", "DKIM configured"],
  ["dmarcConfigured", "DMARC configured"],
  ["stripeLinkFormatVerified", "Stripe link format verified"],
  ["stripeCheckoutQaConfirmed", "Stripe checkout QA confirmed"],
  ["stripeLinksVerified", "Stripe links verified"],
  ["founderReturnPacketApproved", "founder return packet approved"],
  ["landingLinksApplied", "landing links applied"]
]) {
  results.push(bool(status[field]) ? result("pass", label) : result("fail", label, "must be true before first send"));
}

for (const [field, label] of [
  ["stripeQuickAuditLink", "Quick Audit link"],
  ["stripeLaunchAuditLink", "Launch Audit link"],
  ["stripeEnterpriseReadinessLink", "Enterprise Readiness link"]
]) {
  results.push(validStripeUrl(status[field]) ? result("pass", label, "live Stripe URL") : result("fail", label, "missing or invalid live Stripe URL"));
}

const stagedRouteCount = Number.isInteger(status.stagedRouteApprovalCount) ? status.stagedRouteApprovalCount : 0;
const stagedNamedCount = Number.isInteger(status.stagedNamedRecipientApprovalCount) ? status.stagedNamedRecipientApprovalCount : 0;
const stagedOutboundCount = Math.max(stagedRouteCount, stagedNamedCount);
const firstTenApproved = status.firstTenRoutePacketApproved === true || status.firstTenNamedRecipientPacketApproved === true;

if (Number.isInteger(status.stagedRouteApprovalCount) && Number.isInteger(status.stagedNamedRecipientApprovalCount)) {
  results.push(stagedOutboundCount > 0 ? result("pass", "staged outbound approvals", `${stagedOutboundCount}`) : result("fail", "staged outbound approvals", "must be greater than 0 before first send"));
} else {
  results.push(result("fail", "staged outbound approvals", "route or named-recipient counts not recorded"));
}

if (firstTenApproved) {
  results.push(result("pass", "first 10 outbound packet", status.firstTenNamedRecipientPacketApproved ? "named-recipient batch approved and staged" : "route batch approved and staged"));
} else {
  results.push(result("fail", "first 10 outbound packet", "route or named-recipient batch not approved"));
}

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (failures.length > 0) process.exit(1);
