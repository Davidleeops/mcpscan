#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
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

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const offers = [
  {
    id: "quick",
    name: "MCP Quick Audit",
    priceUsd: 750,
    role: "Entry package",
    description: "A fixed-scope security review of up to 3 MCP servers in 1 environment. Includes MCP server and tool inventory, configuration risk review, secret exposure review, prompt-injection and tool-description risk review, written report, and remediation checklist. Delivered in 3 business days after intake is complete."
  },
  {
    id: "launch",
    name: "MCP Launch Audit",
    priceUsd: 1500,
    role: "Default first-revenue package",
    description: "A practical MCP security audit for teams preparing customer pilots, internal rollout, or launch. Covers up to 8 MCP servers across up to 2 environments. Includes server and tool inventory, permission review, secret exposure review, prompt-injection and tool-description risk review, written report, remediation checklist, 30-minute findings call, and 1 re-scan after fixes. Delivered in 5 business days after intake is complete."
  },
  {
    id: "enterprise",
    name: "MCP Enterprise Readiness Audit",
    priceUsd: 3500,
    role: "Enterprise package",
    description: "A deeper MCP security audit for teams preparing enterprise review. Covers up to 15 MCP servers across up to 3 environments. Includes server and tool inventory, configuration and permission review, secret exposure review, prompt-injection and tool-description risk review, executive summary, detailed written report, remediation checklist, 45-minute findings call, buyer-facing security summary, and 1 re-scan after fixes. Delivered in 7 business days after intake is complete."
  }
];

const args = parseArgs(process.argv.slice(2));
const domain = (args.domain ?? "davidleeops.github.io/mcpscan").trim().toLowerCase();
const mailbox = (args.mailbox ?? (domain.includes("/") ? "security@{{chosen_domain}}" : `security@${domain}`)).trim();
const date = args.date ?? today();
const outputRoot = path.resolve(args.output ?? path.join(os.tmpdir(), "mcpscan-stripe-packets"));
const customDomainMode = !domain.includes("/");
const publicBaseUrl = customDomainMode ? `https://${domain}` : `https://${domain}`;

if (customDomainMode && !validDomain(domain)) {
  console.error("Domain must be a hostname like trymcpscan.com or the GitHub Pages path davidleeops.github.io/mcpscan.");
  process.exit(1);
}

if (customDomainMode && (!validEmail(mailbox) || !mailbox.toLowerCase().endsWith(`@${domain}`))) {
  console.error("Mailbox must be an email address on the chosen domain.");
  process.exit(1);
}

const file = path.join(outputRoot, `${date}_${slugify(domain)}_stripe-setup-packet.md`);
const termsUrl = `${publicBaseUrl}/terms.html`;
const privacyUrl = `${publicBaseUrl}/privacy.html`;
const refundUrl = `${publicBaseUrl}/refund.html`;
const secureIntakeUrl = `${publicBaseUrl}/secure-intake.html`;
const thankYouUrl = `${publicBaseUrl}/thank-you.html`;

const packet = [
  `# MCPScan Stripe Setup Packet For ${domain}`,
  "",
  `Generated: ${date}`,
  "",
  "## Rule",
  "",
  "Create exactly three one-time live-mode Stripe Payment Links. Do not create subscriptions, trials, coupons, metered billing, customer portals, or extra products unless separately approved.",
  "",
  "## Shared Checkout Settings",
  "",
  "| Setting | Required Value |",
  "| --- | --- |",
  "| Payment type | One-time payment |",
  "| Currency | USD |",
  "| Mode | Live mode |",
  "| Customer name | Required |",
  "| Customer email | Required |",
  "| Company | Required when available in Stripe checkout fields |",
  "| Billing address | Required |",
  "| Automatic receipts | Enabled |",
  "| Required custom field | Primary technical contact email |",
  "| Optional custom field | How many MCP servers do you want reviewed? |",
  "| Optional custom field | Target delivery date |",
  `| Confirmation redirect | ${thankYouUrl} |`,
  `| Terms URL | ${termsUrl} |`,
  `| Privacy URL | ${privacyUrl} |`,
  `| Refund URL | ${refundUrl} |`,
  `| Secure intake URL | ${secureIntakeUrl} |`,
  `| Public contact | ${mailbox} |`,
  "",
  "## Products",
  "",
  "| Product | Price | Payment Type | Landing Role |",
  "| --- | ---: | --- | --- |",
  ...offers.map((offer) => `| ${offer.name} | $${offer.priceUsd.toLocaleString("en-US")} | One-time | ${offer.role} |`),
  "",
  ...offers.flatMap((offer) => [
    `### ${offer.name}`,
    "",
    "Stripe product name:",
    "",
    "```text",
    offer.name,
    "```",
    "",
    "Price:",
    "",
    "```text",
    `$${offer.priceUsd.toLocaleString("en-US")} USD, one-time`,
    "```",
    "",
    "Description:",
    "",
    "```text",
    offer.description,
    "```",
    ""
  ]),
  "## Evidence To Capture Before Approval",
  "",
  "- Screenshot or dashboard confirmation that each product is live mode.",
  "- Screenshot or dashboard confirmation that each price is one-time USD.",
  "- Screenshot or dashboard confirmation that automatic receipts are enabled.",
  "- Screenshot or dashboard confirmation that required customer fields are configured.",
  "- The three live `https://buy.stripe.com/` URLs.",
  "",
  "## Verify Link Format",
  "",
  "```text",
  "npm run launch:verify-stripe -- --quick QUICK_PAYMENT_LINK --launch LAUNCH_PAYMENT_LINK --enterprise ENTERPRISE_PAYMENT_LINK --update-status",
  "```",
  "",
  "## Founder Approval Text",
  "",
  "```text",
  "I approve applying these exact MCPScan launch values:",
  "",
  `Domain: ${customDomainMode ? domain : "{{chosen_domain}}"}`,
  `Primary mailbox: ${mailbox}`,
  `Audit alias: ${customDomainMode ? `audit@${domain}` : "audit@{{chosen_domain}}"}`,
  `Hello alias: ${customDomainMode ? `hello@${domain}` : "hello@{{chosen_domain}}"}`,
  "",
  "Stripe Payment Links:",
  "Quick Audit: {{quick_audit_stripe_payment_link}}",
  "Launch Audit: {{launch_audit_stripe_payment_link}}",
  "Enterprise Readiness: {{enterprise_readiness_stripe_payment_link}}",
  "",
  "Approved action:",
  "Apply these links to the public landing page, update the public contact email, add the custom domain file, update security/contact references, and run verification. Commit and push require separate approval after verification.",
  "",
  "I also approve keeping outbound paused until I approve exact recipients and exact final messages in a same-turn approval.",
  "```",
  ""
].join("\n");

fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(file, packet, "utf8");

console.log("Created MCPScan Stripe setup packet.");
console.log(file);
