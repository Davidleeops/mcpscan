#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
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

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail("Refusing to create the founder click workspace inside the public MCPScan repo.");
  }
  return resolved;
}

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function safeRead(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function writeIfMissing(file, content) {
  if (fs.existsSync(file)) return false;
  fs.writeFileSync(file, content, "utf8");
  return true;
}

const args = parseArgs(process.argv.slice(2));
const domain = String(args.domain ?? "getmcpscan.xyz").trim().toLowerCase();
const mailProvider = String(args["mail-provider"] ?? "spacemail").trim().toLowerCase();
const allowedProviders = new Set(["zoho", "google", "spacemail"]);

if (!validDomain(domain)) fail("Use --domain with a value like getmcpscan.xyz or getmcpscan.com.");
if (!allowedProviders.has(mailProvider)) fail("Use --mail-provider zoho, google, or spacemail.");

const workspaceRoot = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Founder Clicks"));
const workspaceDir = path.join(workspaceRoot, "current");
fs.mkdirSync(workspaceDir, { recursive: true });

const cartProofPath = path.join(workspaceDir, "domain-cart-proof.json");
const returnPacketPath = path.join(workspaceDir, "approved-return-packet.txt");
const qaEvidencePath = path.join(workspaceDir, "stripe-checkout-qa-evidence.json");
const commandsPath = path.join(workspaceDir, "NEXT_COMMANDS.md");
const clickSessionPath = path.join(workspaceDir, "CLICK_SESSION.md");

const cartTemplate = JSON.parse(safeRead("ops/domain-cart-proof.template.json"));
cartTemplate.updatedAt = new Date().toISOString().slice(0, 10);
cartTemplate.domain = domain;
cartTemplate.domainAvailable = false;
cartTemplate.mailProvider = mailProvider;
cartTemplate.primaryMailbox = `security@${domain}`;
cartTemplate.auditAlias = `audit@${domain}`;
cartTemplate.helloAlias = `hello@${domain}`;
cartTemplate.approvalText = "I approve buying the MCPScan launch domain";
cartTemplate.notes = [
  "Public-safe cart proof only.",
  "Fill this from the visible Spaceship cart before purchase.",
  "Do not include card data, account passwords, mailbox passwords, Stripe secrets, or registrar login details."
];

const qaTemplate = JSON.parse(safeRead("sales/stripe-checkout-qa-evidence.template.json"));
qaTemplate.generated = new Date().toISOString().slice(0, 10);
qaTemplate.domain = domain;
qaTemplate.primaryMailbox = `security@${domain}`;
qaTemplate.confirmationRedirectUrl = `https://${domain}/thank-you.html`;
qaTemplate.termsUrl = `https://${domain}/terms.html`;
qaTemplate.privacyUrl = `https://${domain}/privacy.html`;
qaTemplate.refundUrl = `https://${domain}/refund.html`;
qaTemplate.secureIntakeUrl = `https://${domain}/secure-intake.html`;

const returnPacket = [
  "Paste the completed Founder Return Packet message here after domain, mailbox, and Stripe links exist.",
  "",
  "Required source:",
  "ops/founder-return-packet.html",
  "",
  "Safe values only:",
  `Domain: ${domain}`,
  `Mail provider: ${mailProvider}`,
  `Primary mailbox: security@${domain}`,
  `Audit alias: audit@${domain}`,
  `Hello alias: hello@${domain}`,
  "",
  "Do not paste passwords, recovery codes, card data, Stripe secret keys, customer configs, or customer data."
].join("\n");

const commands = [
  "# MCPScan Founder Click Workspace",
  "",
  "Fill these private local files after the founder account clicks are done:",
  "",
  `- Domain cart proof: ${cartProofPath}`,
  `- Founder return packet: ${returnPacketPath}`,
  `- Stripe checkout QA evidence: ${qaEvidencePath}`,
  "- Default click session sheet: $HOME/MCPScan Founder Clicks/current/CLICK_SESSION.md",
  "",
  "## Before Purchase",
  "",
  "```text",
  `npm run launch:verify-cart -- --file "${cartProofPath}"`,
  "```",
  "",
  "## After Domain, Mailbox, And Stripe Links Exist",
  "",
  "```text",
  `npm run launch:verify-cart -- --file "${cartProofPath}" --return-file "${returnPacketPath}"`,
  `npm run launch:post-click-bundle -- --file "${returnPacketPath}" --qa-file "${qaEvidencePath}" --mail-provider ${mailProvider}`,
  `npm run launch:post-click-verify -- --file "${returnPacketPath}" --cart-file "${cartProofPath}" --qa-file "${qaEvidencePath}" --apply true --mail-provider ${mailProvider}`,
  "npm run launch:publish-pages-fallback -- --wait true",
  `npm run launch:full-proof -- --live true --status-file ops/founder-approval-status.json --cart-file "${cartProofPath}" --return-file "${returnPacketPath}" --qa-file "${qaEvidencePath}" --mail-provider ${mailProvider}`,
  "npm run launch:open-first-revenue",
  "```",
  "",
  "## Safety",
  "",
  "- Keep this folder outside the public repo.",
  "- Do not add registrar passwords, mailbox passwords, Stripe secret keys, card data, recovery codes, customer configs, customer data, or private audit evidence.",
  "- Outbound remains paused until exact recipients and exact final messages are approved in the same turn.",
  ""
].join("\n");

const clickSession = [
  "# MCPScan Founder Click Session",
  "",
  "Use this sheet during the founder account session. It contains public-safe values only and does not buy, publish, send, charge, or create customer files by itself.",
  "",
  "## Chosen Lane",
  "",
  `- Domain: ${domain}`,
  `- Registrar: Spaceship`,
  `- Mail provider: ${mailProvider}`,
  `- Primary mailbox: security@${domain}`,
  `- Audit alias: audit@${domain}`,
  `- Hello alias: hello@${domain}`,
  "- Domain spend cap before mailbox: $3 unless the founder explicitly chooses the trust lane",
  "- Do not add hosting, site builder, paid SSL, paid privacy upsells, extra domains, or extra mailboxes",
  "",
  "## Account Pages To Open",
  "",
  `- Spaceship promos: https://www.spaceship.com/promos/`,
  `- Spaceship domain search: https://www.spaceship.com/domain-search/?query=${domain}`,
  "- Spacemail: https://www.spaceship.com/business-email/",
  "- Stripe Payment Links: https://dashboard.stripe.com/payment-links",
  "",
  "## Local Operator Pages",
  "",
  "- Domain purchase packet: ops/domain-mailbox-purchase-packet.html",
  "- Cheap packet console: ops/cheap-launch-packet-console.html",
  "- DNS console: ops/domain-email-dns-console.html",
  "- Stripe setup: ops/stripe-click-setup.html",
  "- Stripe QA: ops/stripe-payment-link-qa-console.html",
  "- Founder return packet: ops/founder-return-packet.html",
  "- Founder status console: ops/founder-status-console.html",
  "",
  "## Files To Fill",
  "",
  `- Cart proof: ${cartProofPath}`,
  `- Founder return packet: ${returnPacketPath}`,
  `- Stripe checkout QA evidence: ${qaEvidencePath}`,
  "",
  "## Click Order",
  "",
  "1. Open the Spaceship promo page and confirm the final cart price for the chosen domain.",
  "2. Open the Spaceship domain search for the chosen domain.",
  "3. Add one domain only if it is available, not premium-priced, at or below the approved cap, and renewal is visible.",
  "4. Add one matching Spacemail mailbox only if the cart is clear.",
  "5. Fill the cart proof file from the visible cart, then run the pre-purchase verifier.",
  "6. Buy only after the cart proof passes and the founder approves the spend.",
  "7. Create the primary mailbox and aliases.",
  "8. Apply the DNS records from the generated packet for the selected provider.",
  "9. Create the three live Stripe Payment Links from the Stripe setup packet.",
  "10. Complete Stripe QA and save the QA evidence file.",
  "11. Build the founder return packet and save the approval message.",
  "12. Build the founder status tracker only with gates that are actually true.",
  "13. Run the post-click verification commands from NEXT_COMMANDS.md.",
  "",
  "## Verification Commands",
  "",
  "```text",
  `npm run launch:verify-cart -- --file "${cartProofPath}"`,
  `npm run launch:verify-cart -- --file "${cartProofPath}" --return-file "${returnPacketPath}"`,
  `npm run launch:verify-return-qa -- --file "${returnPacketPath}" --qa-file "${qaEvidencePath}"`,
  `npm run launch:verify-stripe-qa -- --file "${qaEvidencePath}" --update-status`,
  `npm run launch:post-click-bundle -- --file "${returnPacketPath}" --qa-file "${qaEvidencePath}" --mail-provider ${mailProvider}`,
  `npm run launch:post-click-verify -- --file "${returnPacketPath}" --cart-file "${cartProofPath}" --qa-file "${qaEvidencePath}" --apply true --mail-provider ${mailProvider}`,
  "npm run launch:publish-pages-fallback -- --wait true",
  `npm run launch:full-proof -- --live true --status-file ops/founder-approval-status.json --cart-file "${cartProofPath}" --return-file "${returnPacketPath}" --qa-file "${qaEvidencePath}" --mail-provider ${mailProvider}`,
  "```",
  "",
  "## Stop Conditions",
  "",
  "- Stop if the domain is premium-priced.",
  "- Stop if renewal price is hidden or unacceptable.",
  "- Stop if the cart adds hosting, site builder, paid SSL, paid privacy, extra domains, or extra mailboxes.",
  "- Stop if the mailbox cannot use the chosen domain.",
  "- Stop if Stripe links are test-mode links.",
  "- Stop if any file asks for a password, card number, recovery code, Stripe secret, customer config, or customer data.",
  ""
].join("\n");

const created = [
  [cartProofPath, `${JSON.stringify(cartTemplate, null, 2)}\n`],
  [returnPacketPath, `${returnPacket}\n`],
  [qaEvidencePath, `${JSON.stringify(qaTemplate, null, 2)}\n`],
  [commandsPath, commands],
  [clickSessionPath, clickSession]
].map(([file, content]) => ({ file, created: writeIfMissing(file, content) }));

console.log("MCPScan founder click workspace prepared.");
console.log(workspaceDir);
for (const item of created) {
  console.log(`${item.created ? "CREATED" : "EXISTS"} ${item.file}`);
}
console.log("");
console.log("Open the command packet:");
console.log(commandsPath);
console.log("");
console.log("Use the click session sheet:");
console.log(clickSessionPath);
