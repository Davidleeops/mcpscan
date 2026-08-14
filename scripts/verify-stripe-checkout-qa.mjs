#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const expectedLinks = new Map([
  ["quick", { name: "MCP Quick Audit", priceUsd: 750 }],
  ["launch", { name: "MCP Launch Audit", priceUsd: 1500 }],
  ["enterprise", { name: "MCP Enterprise Readiness Audit", priceUsd: 3500 }]
]);

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
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validStripeUrl(value) {
  return /^https:\/\/buy\.stripe\.com\/\S+$/i.test(value) && !/test_/i.test(value);
}

function bool(value) {
  return value === true;
}

function updateApprovalStatus(data, passed) {
  const file = path.join(process.cwd(), "ops/founder-approval-status.json");
  if (!fs.existsSync(file)) {
    console.log("INFO approval status - ops/founder-approval-status.json not found, skipping tracker update");
    return;
  }

  const status = JSON.parse(fs.readFileSync(file, "utf8"));
  status.updatedAt = new Date().toISOString();
  status.stripeCheckoutQaConfirmed = passed;
  status.stripeLinksVerified = Boolean(status.stripeLinkFormatVerified && status.stripeCheckoutQaConfirmed);
  if (data.domain && validDomain(data.domain)) status.domain = data.domain;
  if (data.primaryMailbox && validEmail(data.primaryMailbox)) status.mailbox = data.primaryMailbox;
  fs.writeFileSync(file, `${JSON.stringify(status, null, 2)}\n`);
  console.log("INFO approval status - updated ops/founder-approval-status.json");
}

const args = parseArgs(process.argv.slice(2));
if (!args.file) {
  console.error("Usage: npm run launch:verify-stripe-qa -- --file /path/to/stripe-checkout-qa-evidence.json");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(args.file, "utf8"));
const updateStatus = args["update-status"] === "true";
const results = [];

results.push(validDomain(data.domain) ? result("pass", "domain", data.domain) : result("fail", "domain", "missing or invalid"));
results.push(validEmail(data.primaryMailbox) && data.primaryMailbox.endsWith(`@${data.domain}`) ? result("pass", "primary mailbox", data.primaryMailbox) : result("fail", "primary mailbox", "must be on the chosen domain"));
results.push(data.mode === "live" ? result("pass", "Stripe mode", "live") : result("fail", "Stripe mode", "must be live"));
results.push(data.currency === "USD" ? result("pass", "currency", "USD") : result("fail", "currency", "must be USD"));

for (const [field, label] of [
  ["sameStripeAccountChecked", "same Stripe account"],
  ["noSubscriptionTrialMeteredOrPortal", "no subscription, trial, metered billing, or portal"],
  ["quantityAdjustmentDisabled", "quantity adjustment disabled"],
  ["promotionCodesDisabled", "promotion codes disabled"],
  ["shippingAddressCollectionDisabled", "shipping address collection disabled"],
  ["automaticReceiptsEnabled", "automatic receipts"],
  ["customerNameRequired", "customer name required"],
  ["customerEmailRequired", "customer email required"],
  ["companyCollected", "company collected"],
  ["billingAddressRequired", "billing address required"],
  ["primaryTechnicalContactEmailRequired", "technical contact required"]
]) {
  results.push(bool(data[field]) ? result("pass", label) : result("fail", label, "must be true"));
}

for (const [field, suffix] of [
  ["confirmationRedirectUrl", "/thank-you.html"],
  ["termsUrl", "/terms.html"],
  ["privacyUrl", "/privacy.html"],
  ["refundUrl", "/refund.html"],
  ["secureIntakeUrl", "/secure-intake.html"]
]) {
  const expected = `https://${data.domain}${suffix}`;
  results.push(data[field] === expected ? result("pass", field, expected) : result("fail", field, `expected ${expected}`));
}

const links = Array.isArray(data.links) ? data.links : [];
results.push(links.length === 3 ? result("pass", "link count", "3") : result("fail", "link count", `${links.length}`));
const checkoutUrls = links.map((item) => typeof item.checkoutUrl === "string" ? item.checkoutUrl.toLowerCase() : "");
results.push(new Set(checkoutUrls).size === checkoutUrls.length ? result("pass", "unique checkout URLs") : result("fail", "unique checkout URLs", "each product must have its own Payment Link"));

for (const [id, expected] of expectedLinks.entries()) {
  const link = links.find((item) => item.id === id);
  if (!link) {
    results.push(result("fail", `link ${id}`, "missing"));
    continue;
  }
  results.push(link.name === expected.name ? result("pass", `${id} product name`, link.name) : result("fail", `${id} product name`, `expected ${expected.name}`));
  results.push(link.priceUsd === expected.priceUsd ? result("pass", `${id} price`, `$${expected.priceUsd}`) : result("fail", `${id} price`, `expected ${expected.priceUsd}`));
  results.push(link.paymentType === "one-time" ? result("pass", `${id} payment type`, "one-time") : result("fail", `${id} payment type`, "must be one-time"));
  results.push(validStripeUrl(link.checkoutUrl) ? result("pass", `${id} checkout URL`, "live-format Stripe URL") : result("fail", `${id} checkout URL`, "must be a live https://buy.stripe.com/... URL"));
  results.push(bool(link.descriptionMentionsIntakeStart) ? result("pass", `${id} intake wording`) : result("fail", `${id} intake wording`, "description must mention delivery starts after intake"));
}

for (const [field, label] of [
  ["liveModeScreenshotOrDashboardChecked", "live mode evidence"],
  ["priceScreenshotOrDashboardChecked", "price evidence"],
  ["receiptScreenshotOrDashboardChecked", "receipt evidence"],
  ["fieldScreenshotOrDashboardChecked", "field evidence"],
  ["redirectScreenshotOrDashboardChecked", "redirect evidence"],
  ["safetySettingsScreenshotOrDashboardChecked", "safety settings evidence"]
]) {
  results.push(bool(data.evidence?.[field]) ? result("pass", label) : result("fail", label, "must be true"));
}

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (updateStatus) {
  updateApprovalStatus(data, failures.length === 0 && warnings.length === 0);
}

if (failures.length > 0) process.exit(1);
