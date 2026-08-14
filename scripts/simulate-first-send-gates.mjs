#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-send-gates-"));
const domain = "getmcpscan.com";
const mailbox = `security@${domain}`;
const auditAlias = `audit@${domain}`;
const helloAlias = `hello@${domain}`;
const quick = "https://buy.stripe.com/quickAuditLive";
const launch = "https://buy.stripe.com/launchAuditLive";
const enterprise = "https://buy.stripe.com/enterpriseReadinessLive";

function statusFor(mode) {
  const named = mode === "named";
  return {
    generatedFor: "MCPScan first revenue launch",
    updatedAt: "2026-08-14T00:00:00.000Z",
    domain,
    mailProvider: "zoho",
    mailbox,
    auditAlias,
    helloAlias,
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
    stagedRouteApprovalCount: named ? 0 : 10,
    firstTenRoutePacketApproved: !named,
    stagedNamedRecipientApprovalCount: named ? 10 : 0,
    firstTenNamedRecipientPacketApproved: named,
    notes: ["Temporary simulation status. Contains no secrets."]
  };
}

const returnFile = path.join(sandbox, "approved-return-packet.txt");
const qaFile = path.join(sandbox, "stripe-checkout-qa-evidence.json");
const cartFile = path.join(sandbox, "domain-cart-proof.json");

fs.writeFileSync(returnFile, [
  "I approve applying these exact MCPScan launch values:",
  "",
  `Domain: ${domain}`,
  "Mail provider: zoho",
  "Mail provider label: Zoho Mail",
  `Primary mailbox: ${mailbox}`,
  `Audit alias: ${auditAlias}`,
  `Hello alias: ${helloAlias}`,
  "",
  "Stripe Payment Links:",
  `Quick Audit: ${quick}`,
  `Launch Audit: ${launch}`,
  `Enterprise Readiness: ${enterprise}`,
  "",
  "Approved action:",
  "Apply these links to the public landing page, update the public contact email, add the custom domain file, update security/contact references, and run verification. Commit and push require a separate explicit approval after verification.",
  "",
  "I also approve keeping outbound paused until I approve exact recipients and exact final messages in a same-turn approval.",
  ""
].join("\n"), "utf8");

fs.writeFileSync(cartFile, `${JSON.stringify({
  generatedFor: "MCPScan first revenue launch",
  updatedAt: "2026-08-14",
  domain,
  registrar: "Spaceship",
  domainAvailable: true,
  firstYearDomainUsd: 8.88,
  maxFirstYearDomainUsd: 12,
  renewalDomainUsd: 9.98,
  renewalAcknowledged: true,
  cheapRenewalTradeoffAcknowledged: false,
  domainCount: 1,
  mailProvider: "zoho",
  primaryMailbox: mailbox,
  auditAlias,
  helloAlias,
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
  notes: ["Temporary simulation cart proof. Contains no secrets."]
}, null, 2)}\n`, "utf8");

fs.writeFileSync(qaFile, `${JSON.stringify({
  generatedFor: "MCPScan Stripe checkout QA evidence",
  updatedAt: "2026-08-14T00:00:00.000Z",
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
    {
      id: "quick",
      name: "MCP Quick Audit",
      priceUsd: 750,
      paymentType: "one-time",
      checkoutUrl: quick,
      descriptionMentionsIntakeStart: true
    },
    {
      id: "launch",
      name: "MCP Launch Audit",
      priceUsd: 1500,
      paymentType: "one-time",
      checkoutUrl: launch,
      descriptionMentionsIntakeStart: true
    },
    {
      id: "enterprise",
      name: "MCP Enterprise Readiness Audit",
      priceUsd: 3500,
      paymentType: "one-time",
      checkoutUrl: enterprise,
      descriptionMentionsIntakeStart: true
    }
  ],
  evidence: {
    liveModeScreenshotOrDashboardChecked: true,
    priceScreenshotOrDashboardChecked: true,
    receiptScreenshotOrDashboardChecked: true,
    fieldScreenshotOrDashboardChecked: true,
    redirectScreenshotOrDashboardChecked: true,
    safetySettingsScreenshotOrDashboardChecked: true
  }
}, null, 2)}\n`, "utf8");

function runMode(mode) {
  const statusFile = path.join(sandbox, `${mode}-status.json`);
  fs.writeFileSync(statusFile, `${JSON.stringify(statusFor(mode), null, 2)}\n`, "utf8");
  const result = spawnSync(
    "npm",
    ["run", "outbound:send-gates", "--", "--status-file", statusFile, "--cart-file", cartFile, "--return-file", returnFile, "--qa-file", qaFile],
    { cwd: root, encoding: "utf8" }
  );

  if (result.stdout.trim()) console.log(result.stdout.trim());
  if (result.stderr.trim()) console.error(result.stderr.trim());
  if (result.status !== 0) process.exit(result.status ?? 1);
}

runMode("route");
runMode("named");
fs.rmSync(sandbox, { recursive: true, force: true });

console.log("First-send gate simulation passed for route and named-recipient approvals.");
