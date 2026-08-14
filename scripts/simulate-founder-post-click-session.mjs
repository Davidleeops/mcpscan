#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-post-click-session."));
const workspace = path.join(tempRoot, "current");
const bundleRoot = path.join(tempRoot, "bundles");
fs.mkdirSync(workspace, { recursive: true });

const returnPacket = path.join(root, "ops", "founder-return-packet.sample.txt");
const cartFile = path.join(workspace, "domain-cart-proof.json");
const qaFile = path.join(workspace, "stripe-checkout-qa-evidence.json");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function valueFromInput(label, input) {
  const match = input.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim();
}

function run(args) {
  const result = spawnSync("npm", args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!fs.existsSync(returnPacket)) fail("Missing ops/founder-return-packet.sample.txt.");
const input = fs.readFileSync(returnPacket, "utf8");
const domain = valueFromInput("Domain", input);
const mailbox = valueFromInput("Primary mailbox", input);
const quick = valueFromInput("Quick Audit", input);
const launch = valueFromInput("Launch Audit", input);
const enterprise = valueFromInput("Enterprise Readiness", input);

const cartProof = {
  generatedFor: "MCPScan first revenue launch",
  updatedAt: new Date().toISOString().slice(0, 10),
  domain,
  registrar: "Spaceship",
  domainAvailable: true,
  firstYearDomainUsd: 8.28,
  maxFirstYearDomainUsd: 12,
  renewalDomainUsd: 12.42,
  renewalAcknowledged: true,
  cheapRenewalTradeoffAcknowledged: false,
  domainCount: 1,
  mailProvider: "zoho",
  primaryMailbox: mailbox,
  auditAlias: `audit@${domain}`,
  helloAlias: `hello@${domain}`,
  mailboxCount: 1,
  mailboxUsd: 12,
  mailboxBillingTerm: "annual",
  paidHosting: false,
  paidSsl: false,
  siteBuilder: false,
  extraDomains: false,
  extraMailboxes: false,
  paidPrivacyUpsell: false,
  freePrivacyKept: true,
  founderApproval: true,
  approvalText: "I approve buying the MCPScan launch domain",
  notes: ["Simulation cart proof. No secrets included."]
};

const qa = {
  generated: new Date().toISOString().slice(0, 10),
  status: "simulation",
  domain,
  primaryMailbox: mailbox,
  mode: "live",
  currency: "USD",
  sameStripeAccountChecked: true,
  noSubscriptionTrialMeteredOrPortal: true,
  quantityAdjustmentDisabled: true,
  promotionCodesDisabled: true,
  shippingAddressCollectionDisabled: true,
  automaticReceiptsEnabled: true,
  customerNameRequired: true,
  customerEmailRequired: true,
  companyCollected: true,
  billingAddressRequired: true,
  primaryTechnicalContactEmailRequired: true,
  confirmationRedirectUrl: `https://${domain}/thank-you.html`,
  termsUrl: `https://${domain}/terms.html`,
  privacyUrl: `https://${domain}/privacy.html`,
  refundUrl: `https://${domain}/refund.html`,
  secureIntakeUrl: `https://${domain}/secure-intake.html`,
  links: [
    { id: "quick", name: "MCP Quick Audit", priceUsd: 750, paymentType: "one-time", checkoutUrl: quick, descriptionMentionsIntakeStart: true },
    { id: "launch", name: "MCP Launch Audit", priceUsd: 1500, paymentType: "one-time", checkoutUrl: launch, descriptionMentionsIntakeStart: true },
    { id: "enterprise", name: "MCP Enterprise Readiness Audit", priceUsd: 3500, paymentType: "one-time", checkoutUrl: enterprise, descriptionMentionsIntakeStart: true }
  ],
  evidence: {
    liveModeScreenshotOrDashboardChecked: true,
    priceScreenshotOrDashboardChecked: true,
    receiptScreenshotOrDashboardChecked: true,
    fieldScreenshotOrDashboardChecked: true,
    redirectScreenshotOrDashboardChecked: true,
    safetySettingsScreenshotOrDashboardChecked: true
  }
};

fs.writeFileSync(cartFile, `${JSON.stringify(cartProof, null, 2)}\n`, "utf8");
fs.writeFileSync(qaFile, `${JSON.stringify(qa, null, 2)}\n`, "utf8");

run([
  "run",
  "launch:post-click-session",
  "--",
  "--file",
  returnPacket,
  "--cart-file",
  cartFile,
  "--qa-file",
  qaFile,
  "--bundle-root",
  bundleRoot,
  "--mail-provider",
  "zoho",
  "--apply",
  "false",
  "--skip-dns",
  "true",
  "--skip-launch",
  "true",
  "--no-open"
]);

const created = fs.readdirSync(bundleRoot).filter((entry) => entry.endsWith("_post-click-handoff"));
if (created.length !== 1) fail("Expected exactly one post-click handoff bundle.");

const bundleDir = path.join(bundleRoot, created[0]);
for (const file of ["approved-return-packet.txt", "stripe-checkout-qa-evidence.json", "public-safe-summary.json", "NEXT_COMMANDS.md"]) {
  const full = path.join(bundleDir, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Missing bundle artifact: ${full}`);
}

console.log("");
console.log("Founder post-click session simulation passed.");
console.log(bundleDir);
