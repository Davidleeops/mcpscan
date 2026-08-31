#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const repoRoot = process.cwd();

const offers = [
  {
    id: "quick",
    name: "MCP Quick Audit",
    priceUsd: 750,
    deliveryDays: 3,
    scope: "Up to 3 MCP servers in 1 environment",
    description: "A fixed-scope security review of up to 3 MCP servers in 1 environment. Includes MCP server and tool inventory, configuration risk review, secret exposure review, prompt-injection and tool-description risk review, written report, and remediation checklist. Delivered in 3 business days after intake is complete."
  },
  {
    id: "launch",
    name: "MCP Launch Audit",
    priceUsd: 1500,
    deliveryDays: 5,
    scope: "Up to 8 MCP servers across up to 2 environments",
    description: "A practical MCP security audit for teams preparing customer pilots, internal rollout, or launch. Covers up to 8 MCP servers across up to 2 environments. Includes server and tool inventory, permission review, secret exposure review, prompt-injection and tool-description risk review, written report, remediation checklist, 30-minute findings call, and 1 re-scan after fixes. Delivered in 5 business days after intake is complete."
  },
  {
    id: "enterprise",
    name: "MCP Enterprise Readiness Audit",
    priceUsd: 3500,
    deliveryDays: 7,
    scope: "Up to 15 MCP servers across up to 3 environments",
    description: "A deeper MCP security audit for teams preparing enterprise review. Covers up to 15 MCP servers across up to 3 environments. Includes server and tool inventory, configuration and permission review, secret exposure review, prompt-injection and tool-description risk review, executive summary, detailed written report, remediation checklist, 45-minute findings call, buyer-facing security summary, and 1 re-scan after fixes. Delivered in 7 business days after intake is complete."
  }
];

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) values[key] = "true";
    else {
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
  if (resolved === repoRoot || resolved.startsWith(repoRoot + path.sep)) {
    fail("Refusing to create the Stripe payment session inside the public MCPScan repo.");
  }
  return resolved;
}

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function html(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function openerFor(target) {
  if (process.platform === "darwin") return ["open", [target]];
  if (process.platform === "win32") return ["cmd", ["/c", "start", "", target]];
  if (process.platform === "linux") return ["xdg-open", [target]];
  return null;
}

function openTarget(target) {
  const opener = openerFor(target);
  if (!opener) return false;
  const [command, args] = opener;
  const result = spawnSync(command, args, { stdio: "ignore" });
  return !result.error && result.status === 0;
}

function writePrivate(file, content, label) {
  const resolved = path.resolve(file);
  if (resolved === repoRoot || resolved.startsWith(repoRoot + path.sep)) {
    fail(`Refusing to write ${label} inside the public MCPScan repo.`);
  }
  fs.writeFileSync(resolved, content, "utf8");
}

const args = parseArgs(process.argv.slice(2));
const domain = String(args.domain ?? "getmcpscan.xyz").trim().toLowerCase();
const mailProvider = String(args["mail-provider"] ?? "spacemail").trim().toLowerCase();
const primaryMailbox = String(args.mailbox ?? `security@${domain}`).trim().toLowerCase();
const workspaceRoot = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Stripe Payment Session"));
const workspaceDir = path.join(workspaceRoot, "current");
const shouldOpen = args.open !== "false" && args["no-open"] !== "true";

if (!validDomain(domain)) fail("Use --domain with a value like getmcpscan.xyz.");
if (!validEmail(primaryMailbox) || !primaryMailbox.endsWith(`@${domain}`)) fail("Use --mailbox with an email address on the chosen domain.");

fs.mkdirSync(workspaceDir, { recursive: true });

const manifestPath = path.join(workspaceDir, "payment-link-manifest.json");
const qaPath = path.join(workspaceDir, "stripe-checkout-qa-evidence.json");
const returnPacketPath = path.join(workspaceDir, "approved-return-packet.txt");
const setupPacketPath = path.join(workspaceDir, "STRIPE_SETUP_PACKET.md");
const commandsPath = path.join(workspaceDir, "NEXT_COMMANDS.md");
const sessionPath = path.join(workspaceDir, "STRIPE_PAYMENT_SESSION.html");
const publicBaseUrl = `https://${domain}`;
const auditAlias = `audit@${domain}`;
const helloAlias = `hello@${domain}`;

const manifest = {
  generated: new Date().toISOString().slice(0, 10),
  status: "draft",
  domain,
  primaryMailbox,
  auditAlias,
  helloAlias,
  mailProvider,
  publicBaseUrl,
  termsUrl: `${publicBaseUrl}/terms.html`,
  privacyUrl: `${publicBaseUrl}/privacy.html`,
  refundUrl: `${publicBaseUrl}/refund.html`,
  secureIntakeUrl: `${publicBaseUrl}/secure-intake.html`,
  offers: offers.map((offer) => ({
    id: offer.id,
    name: offer.name,
    priceUsd: offer.priceUsd,
    checkoutUrl: `{{${offer.id}_audit_stripe_payment_link}}`,
    deliveryDaysAfterCompleteIntake: offer.deliveryDays,
    scope: offer.scope,
    publicCta: offer.id === "enterprise" ? "Buy Enterprise Audit" : `Buy ${offer.name.replace("MCP ", "")}`
  })),
  rules: [
    "Do not commit Stripe secret keys.",
    "Do not publish checkout URLs until founder approval includes exact live links.",
    "Do not accept customer secrets through GitHub issues.",
    "Do not start delivery until payment and safe intake path are confirmed."
  ]
};

const qaEvidence = {
  generated: new Date().toISOString().slice(0, 10),
  status: "draft",
  domain,
  primaryMailbox,
  mode: "live",
  currency: "USD",
  sameStripeAccountChecked: false,
  noSubscriptionTrialMeteredOrPortal: false,
  quantityAdjustmentDisabled: false,
  promotionCodesDisabled: false,
  shippingAddressCollectionDisabled: false,
  automaticReceiptsEnabled: false,
  customerNameRequired: false,
  customerEmailRequired: false,
  companyCollected: false,
  billingAddressRequired: false,
  primaryTechnicalContactEmailRequired: false,
  confirmationRedirectUrl: `${publicBaseUrl}/thank-you.html`,
  termsUrl: `${publicBaseUrl}/terms.html`,
  privacyUrl: `${publicBaseUrl}/privacy.html`,
  refundUrl: `${publicBaseUrl}/refund.html`,
  secureIntakeUrl: `${publicBaseUrl}/secure-intake.html`,
  links: offers.map((offer) => ({
    id: offer.id,
    name: offer.name,
    priceUsd: offer.priceUsd,
    paymentType: "one-time",
    checkoutUrl: `{{${offer.id}_audit_stripe_payment_link}}`,
    descriptionMentionsIntakeStart: true
  })),
  evidence: {
    liveModeScreenshotOrDashboardChecked: false,
    priceScreenshotOrDashboardChecked: false,
    receiptScreenshotOrDashboardChecked: false,
    fieldScreenshotOrDashboardChecked: false,
    redirectScreenshotOrDashboardChecked: false,
    safetySettingsScreenshotOrDashboardChecked: false
  }
};

const setupPacket = `# MCPScan Stripe Payment Link Session

Create exactly three live-mode one-time Stripe Payment Links.

## Shared Checkout Settings

- Currency: USD.
- Customer name: required.
- Customer email: required.
- Company: collect if Stripe supports it in the selected checkout field set.
- Billing address: required.
- Automatic receipts: enabled.
- Required custom field: Primary technical contact email.
- Optional custom fields: How many MCP servers do you want reviewed? Target delivery date.
- Confirmation redirect: ${publicBaseUrl}/thank-you.html.
- Terms URL: ${publicBaseUrl}/terms.html.
- Privacy URL: ${publicBaseUrl}/privacy.html.
- Refund URL: ${publicBaseUrl}/refund.html.
- Secure intake URL: ${publicBaseUrl}/secure-intake.html.
- Public contact: ${primaryMailbox}.

## Products

${offers.map((offer) => `### ${offer.name}

Price: $${offer.priceUsd.toLocaleString("en-US")} USD, one-time.

Scope: ${offer.scope}.

Description:

\`\`\`text
${offer.description}
\`\`\`
`).join("\n")}
## Stop Conditions

- Stop if Stripe is in test mode.
- Stop if a product is subscription, trial, metered billing, or customer portal based.
- Stop if promotion codes, quantity adjustment, or shipping collection are enabled.
- Stop if the checkout page cannot collect buyer email and primary technical contact email.
- Stop if a page asks Codex to store Stripe secret keys, bank data, account passwords, recovery codes, customer configs, or customer data.
`;

const returnPacket = `Paste the completed Founder Return Packet message here after all three live Stripe Payment Links exist.

Safe values only:
Domain: ${domain}
Mail provider: ${mailProvider}
Primary mailbox: ${primaryMailbox}
Audit alias: ${auditAlias}
Hello alias: ${helloAlias}

Stripe Payment Links:
Quick Audit: {{quick_audit_stripe_payment_link}}
Launch Audit: {{launch_audit_stripe_payment_link}}
Enterprise Readiness: {{enterprise_readiness_stripe_payment_link}}

Do not paste Stripe secret keys, account passwords, recovery codes, card data, customer configs, or customer data.
`;

const commands = `# MCPScan Stripe Payment Session Commands

After creating the three live Payment Links:

\`\`\`text
npm run launch:verify-stripe -- --file "${returnPacketPath}" --update-status
npm run launch:verify-stripe-qa -- --file "${qaPath}" --update-status
npm run launch:verify-return-qa -- --file "${returnPacketPath}" --qa-file "${qaPath}"
npm run launch:post-click-session -- --file "${returnPacketPath}" --cart-file "$HOME/MCPScan Domain And Mailbox Session/current/domain-cart-proof.json" --qa-file "${qaPath}" --apply true --publish true --mail-provider ${mailProvider}
\`\`\`

Keep outbound paused until exact recipients and exact final messages are approved in the same turn.
`;

const sessionHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MCPScan Stripe Payment Session</title>
    <style>
      :root { color-scheme: light; --ink: #12161c; --muted: #5a6370; --line: #d7dde4; --panel: #ffffff; --soft: #f5f7f9; --accent: #635bff; --good: #0f7b4f; --warn: #9a5a00; --danger: #aa2b2b; }
      * { box-sizing: border-box; }
      body { margin: 0; color: var(--ink); background: var(--soft); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      main { width: min(1140px, calc(100% - 32px)); margin: 0 auto; padding: 32px 0 48px; }
      h1, h2, h3, p { margin-top: 0; }
      h1 { font-size: clamp(30px, 5vw, 54px); line-height: 1; margin-bottom: 10px; letter-spacing: 0; }
      h2 { font-size: 18px; margin-bottom: 12px; }
      h3 { font-size: 15px; margin-bottom: 8px; }
      p, li, td { color: var(--muted); line-height: 1.5; }
      .stack { display: grid; gap: 16px; }
      .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
      section, article { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 18px; }
      .wide { grid-column: 1 / -1; }
      .ready { border-left: 4px solid var(--good); background: #f3fbf6; }
      .warn { border-left: 4px solid var(--warn); background: #fff9ec; }
      .danger { border-left: 4px solid var(--danger); background: #fff6f6; }
      .actions { display: flex; flex-wrap: wrap; gap: 8px; }
      a.button, button { display: inline-flex; min-height: 38px; align-items: center; justify-content: center; border: 1px solid var(--accent); border-radius: 7px; padding: 9px 12px; color: var(--accent); background: #ffffff; font-weight: 700; text-decoration: none; cursor: pointer; }
      a.primary { color: #ffffff; background: var(--accent); }
      pre { margin: 10px 0 0; overflow: auto; white-space: pre-wrap; background: #101820; color: #eef6ff; border-radius: 8px; padding: 12px; line-height: 1.45; font-size: 12px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border-top: 1px solid var(--line); padding: 10px 8px; text-align: left; vertical-align: top; }
      th { color: var(--ink); }
      @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .wide { grid-column: auto; } }
    </style>
  </head>
  <body>
    <main class="stack">
      <header>
        <h1>MCPScan Stripe Payment Session</h1>
        <p>Private click cockpit for creating three live one-time Stripe Payment Links and capturing public-safe QA evidence. This command opens pages only. It does not create products, publish links, charge buyers, apply public links, send messages, or create customer files.</p>
        <div class="actions">
          <a class="button primary" href="https://dashboard.stripe.com/payment-links/create" target="_blank" rel="noreferrer">Create Payment Link</a>
          <a class="button" href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noreferrer">Stripe Payment Links</a>
          <a class="button" href="${html(pathToFileURL(path.resolve("ops/stripe-payment-link-qa-console.html")).toString())}">QA builder</a>
          <a class="button" href="${html(pathToFileURL(path.resolve("ops/founder-return-packet.html")).toString())}">Return packet</a>
        </div>
      </header>
      <section class="ready">
        <h2>Selected Launch Values</h2>
        <p><strong>Domain:</strong> ${html(domain)}<br><strong>Mailbox:</strong> ${html(primaryMailbox)}<br><strong>Policy base:</strong> ${html(publicBaseUrl)}</p>
      </section>
      <div class="grid">
        ${offers.map((offer) => `<article>
          <h2>${html(offer.name)}</h2>
          <h3>$${offer.priceUsd.toLocaleString("en-US")} one-time</h3>
          <p>${html(offer.scope)}. Delivered in ${offer.deliveryDays} business days after intake is complete.</p>
          <pre id="${offer.id}-copy">${html(`${offer.name}
$${offer.priceUsd.toLocaleString("en-US")} USD, one-time
${offer.description}`)}</pre>
          <button data-copy="${offer.id}-copy" type="button">Copy product block</button>
        </article>`).join("\n")}
      </div>
      <section class="wide">
        <h2>Private Files</h2>
        <pre id="paths">${html(`Setup packet: ${setupPacketPath}
Payment manifest: ${manifestPath}
Stripe QA evidence: ${qaPath}
Founder return packet: ${returnPacketPath}
Next commands: ${commandsPath}`)}</pre>
        <button data-copy="paths" type="button">Copy paths</button>
      </section>
      <section class="wide warn">
        <h2>Required Checkout Settings</h2>
        <table>
          <tr><th>Setting</th><th>Required value</th></tr>
          <tr><td>Mode</td><td>Live mode only</td></tr>
          <tr><td>Payment type</td><td>One-time payment only</td></tr>
          <tr><td>Currency</td><td>USD</td></tr>
          <tr><td>Fields</td><td>Name, email, company, billing address, primary technical contact email</td></tr>
          <tr><td>Redirect</td><td>${html(publicBaseUrl)}/thank-you.html</td></tr>
          <tr><td>Policies</td><td>Terms, privacy, refund, and secure intake pages on ${html(domain)}</td></tr>
        </table>
      </section>
      <section class="wide">
        <h2>Proof Commands</h2>
        <pre id="commands">${html(commands)}</pre>
        <button data-copy="commands" type="button">Copy commands</button>
      </section>
      <section class="danger">
        <h2>Stop Conditions</h2>
        <ul>
          <li>Stop if Stripe is in test mode.</li>
          <li>Stop if any link is not a live https://buy.stripe.com URL.</li>
          <li>Stop if checkout uses subscriptions, trials, metered billing, customer portal, quantity adjustment, coupons, or shipping.</li>
          <li>Stop if any evidence file contains Stripe secret keys, bank data, account passwords, recovery codes, customer configs, or customer data.</li>
        </ul>
      </section>
    </main>
    <script>
      document.querySelectorAll("[data-copy]").forEach((button) => {
        button.addEventListener("click", async () => {
          const target = document.getElementById(button.dataset.copy);
          await navigator.clipboard.writeText(target.textContent.trim());
          const label = button.textContent;
          button.textContent = "Copied";
          setTimeout(() => { button.textContent = label; }, 1200);
        });
      });
    </script>
  </body>
</html>
`;

writePrivate(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "payment link manifest");
writePrivate(qaPath, `${JSON.stringify(qaEvidence, null, 2)}\n`, "Stripe checkout QA evidence");
writePrivate(returnPacketPath, returnPacket, "founder return packet draft");
writePrivate(setupPacketPath, setupPacket, "Stripe setup packet");
writePrivate(commandsPath, commands, "Stripe next commands");
writePrivate(sessionPath, sessionHtml, "Stripe payment session");

const localTargets = [
  sessionPath,
  setupPacketPath,
  manifestPath,
  qaPath,
  returnPacketPath,
  commandsPath,
  path.resolve("ops/stripe-click-setup.html"),
  path.resolve("ops/stripe-payment-link-qa-console.html"),
  path.resolve("ops/founder-return-packet.html")
];

const externalTargets = [
  "https://dashboard.stripe.com/payment-links/create",
  "https://dashboard.stripe.com/payment-links"
];

console.log("MCPScan Stripe payment session prepared.");
console.log(workspaceDir);
for (const target of localTargets) {
  const url = pathToFileURL(target).toString();
  const opened = shouldOpen ? openTarget(url) : false;
  console.log(`${opened ? "OPENED" : "COPY"} ${target}${opened ? "" : ` ${url}`}`);
}
for (const target of externalTargets) {
  const opened = shouldOpen ? openTarget(target) : false;
  console.log(`${opened ? "OPENED" : "COPY"} ${target}`);
}
console.log("");
console.log("Start here:");
console.log(sessionPath);
console.log("");
console.log("This command opens pages only. It does not create products, publish links, charge buyers, apply public links, send messages, or create customer files.");
