#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-post-click-bundle."));
const returnPacket = path.join(root, "ops", "founder-return-packet.sample.txt");
const qaFile = path.join(tempRoot, "stripe-checkout-qa-evidence.json");
const bundleRoot = path.join(tempRoot, "bundles");
const statusFile = path.join(tempRoot, "founder-approval-status.json");

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

fs.writeFileSync(qaFile, `${JSON.stringify(qa, null, 2)}\n`, "utf8");

const status = {
  generatedFor: "MCPScan first revenue launch",
  updatedAt: new Date().toISOString(),
  domain,
  mailProvider: "zoho",
  mailbox,
  auditAlias: `audit@${domain}`,
  helloAlias: `hello@${domain}`,
  domainPurchased: true,
  mailboxCreated: true,
  githubPagesAConfigured: true,
  githubPagesWwwConfigured: true,
  mxConfigured: true,
  spfConfigured: true,
  dkimConfigured: true,
  dmarcConfigured: true,
  stripeQuickAuditLink: quick,
  stripeLaunchAuditLink: launch,
  stripeEnterpriseReadinessLink: enterprise,
  stripeLinkFormatVerified: true,
  stripeCheckoutQaConfirmed: true,
  stripeLinksVerified: true,
  founderReturnPacketApproved: true,
  landingLinksApplied: true,
  stagedRouteApprovalCount: 0,
  firstTenRoutePacketApproved: false,
  stagedNamedRecipientApprovalCount: 0,
  firstTenNamedRecipientPacketApproved: false,
  notes: ["Simulation status. No secrets included."]
};

fs.writeFileSync(statusFile, `${JSON.stringify(status, null, 2)}\n`, "utf8");

run([
  "run",
  "launch:post-click-bundle",
  "--",
  "--file",
  returnPacket,
  "--qa-file",
  qaFile,
  "--root",
  bundleRoot,
  "--mail-provider",
  "zoho"
]);

run([
  "run",
  "launch:verify-status",
  "--",
  "--status-file",
  statusFile,
  "--file",
  returnPacket,
  "--qa-file",
  qaFile
]);

const created = fs.readdirSync(bundleRoot).filter((entry) => entry.endsWith("_post-click-handoff"));
if (created.length !== 1) fail("Expected exactly one post-click handoff bundle.");

const bundleDir = path.join(bundleRoot, created[0]);
for (const file of ["approved-return-packet.txt", "stripe-checkout-qa-evidence.json", "public-safe-summary.json", "NEXT_COMMANDS.md"]) {
  const full = path.join(bundleDir, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Missing bundle artifact: ${full}`);
}

console.log("");
console.log("Post-click handoff bundle simulation passed.");
console.log(bundleDir);
