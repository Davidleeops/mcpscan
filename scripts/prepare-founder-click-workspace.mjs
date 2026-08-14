#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

function writeGenerated(file, content) {
  fs.writeFileSync(file, content, "utf8");
  return true;
}

function html(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pathToFileUrl(file) {
  return pathToFileURL(file).toString();
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
const clickSessionHtmlPath = path.join(workspaceDir, "CLICK_SESSION.html");

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
  "- Default click browser cockpit: $HOME/MCPScan Founder Clicks/current/CLICK_SESSION.html",
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
  `npm run launch:post-click-session -- --file "${returnPacketPath}" --cart-file "${cartProofPath}" --qa-file "${qaEvidencePath}" --apply true --publish true --mail-provider ${mailProvider}`,
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
  `- Click browser cockpit: ${clickSessionHtmlPath}`,
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
  "13. Run the post-click session command from NEXT_COMMANDS.md after exact approval.",
  "",
  "## Verification Commands",
  "",
  "```text",
  `npm run launch:verify-cart -- --file "${cartProofPath}"`,
  `npm run launch:verify-cart -- --file "${cartProofPath}" --return-file "${returnPacketPath}"`,
  `npm run launch:verify-return-qa -- --file "${returnPacketPath}" --qa-file "${qaEvidencePath}"`,
  `npm run launch:verify-stripe-qa -- --file "${qaEvidencePath}" --update-status`,
  `npm run launch:post-click-session -- --file "${returnPacketPath}" --cart-file "${cartProofPath}" --qa-file "${qaEvidencePath}" --apply true --publish true --mail-provider ${mailProvider}`,
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

const verifyCartCommand = `npm run launch:verify-cart -- --file "${cartProofPath}"`;
const verifyCartReturnCommand = `npm run launch:verify-cart -- --file "${cartProofPath}" --return-file "${returnPacketPath}"`;
const verifyReturnQaCommand = `npm run launch:verify-return-qa -- --file "${returnPacketPath}" --qa-file "${qaEvidencePath}"`;
const verifyStripeQaCommand = `npm run launch:verify-stripe-qa -- --file "${qaEvidencePath}" --update-status`;
const postClickCommand = `npm run launch:post-click-session -- --file "${returnPacketPath}" --cart-file "${cartProofPath}" --qa-file "${qaEvidencePath}" --apply true --publish true --mail-provider ${mailProvider}`;
const firstRevenueCommand = "npm run launch:open-first-revenue";

const clickSessionHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MCPScan Founder Click Session</title>
    <style>
      :root { color-scheme: light; --ink: #12161c; --muted: #5a6370; --line: #d7dde4; --panel: #ffffff; --soft: #f5f7f9; --accent: #0b6bcb; --good: #0f7b4f; --warn: #9a5a00; --danger: #aa2b2b; }
      * { box-sizing: border-box; }
      body { margin: 0; color: var(--ink); background: var(--soft); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      main { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 32px 0 48px; }
      h1, h2, h3, p { margin-top: 0; }
      h1 { font-size: clamp(30px, 5vw, 54px); line-height: 1; margin-bottom: 10px; letter-spacing: 0; }
      h2 { font-size: 18px; margin-bottom: 12px; }
      h3 { font-size: 15px; margin-bottom: 8px; }
      p, li, td { color: var(--muted); line-height: 1.5; }
      .stack { display: grid; gap: 16px; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
      section, article { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 18px; }
      .wide { grid-column: 1 / -1; }
      .ready { border-left: 4px solid var(--good); background: #f3fbf6; }
      .warn { border-left: 4px solid var(--warn); background: #fff9ec; }
      .danger { border-left: 4px solid var(--danger); background: #fff6f6; }
      .actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
      a.button, button.copy { display: inline-flex; min-height: 38px; align-items: center; justify-content: center; border: 1px solid var(--accent); border-radius: 7px; padding: 9px 12px; color: var(--accent); background: #ffffff; font-weight: 700; text-decoration: none; cursor: pointer; }
      a.button.primary { color: #ffffff; background: var(--accent); }
      ol { padding-left: 22px; }
      pre { margin: 10px 0 0; overflow: auto; white-space: pre-wrap; background: #101820; color: #eef6ff; border-radius: 8px; padding: 12px; line-height: 1.45; font-size: 12px; }
      code { color: var(--ink); }
      @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .wide { grid-column: auto; } .actions { justify-content: start; } }
    </style>
  </head>
  <body>
    <main class="stack">
      <header>
        <h1>MCPScan Founder Click Session</h1>
        <p>Private browser cockpit for the live account pass. It opens account pages, local consoles, exact files, and proof commands. It does not buy, publish, send, charge, apply public links, or create customer files.</p>
        <div class="actions">
          <a class="button primary" href="https://www.spaceship.com/domain-search/?query=${encodeURIComponent(domain)}" target="_blank" rel="noreferrer">Search domain</a>
          <a class="button" href="https://www.spaceship.com/business-email/" target="_blank" rel="noreferrer">Open mailbox</a>
          <a class="button" href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noreferrer">Open Stripe links</a>
        </div>
      </header>
      <section class="ready">
        <h2>Chosen Lane</h2>
        <p><strong>Domain:</strong> ${html(domain)}<br><strong>Mail provider:</strong> ${html(mailProvider)}<br><strong>Mailbox:</strong> security@${html(domain)}<br><strong>Aliases:</strong> audit@${html(domain)}, hello@${html(domain)}</p>
      </section>
      <div class="grid">
        <section>
          <h2>Private Files</h2>
          <p>Fill only public-safe evidence. Never paste card data, passwords, Stripe secrets, recovery codes, customer configs, or customer data.</p>
          <pre id="private-files">${html(`Cart proof: ${cartProofPath}
Founder return packet: ${returnPacketPath}
Stripe QA evidence: ${qaEvidencePath}
Command packet: ${commandsPath}
Markdown checklist: ${clickSessionPath}`)}</pre>
          <div class="actions"><button class="copy" data-copy-target="private-files">Copy paths</button></div>
        </section>
        <section>
          <h2>Local Consoles</h2>
          <div class="actions">
            <a class="button" href="${html(pathToFileUrl(path.resolve("ops/domain-mailbox-purchase-packet.html")))}">Domain packet</a>
            <a class="button" href="${html(pathToFileUrl(path.resolve("ops/domain-email-dns-console.html")))}">DNS console</a>
            <a class="button" href="${html(pathToFileUrl(path.resolve("ops/stripe-click-setup.html")))}">Stripe setup</a>
            <a class="button" href="${html(pathToFileUrl(path.resolve("ops/stripe-payment-link-qa-console.html")))}">Stripe QA</a>
            <a class="button" href="${html(pathToFileUrl(path.resolve("ops/founder-return-packet.html")))}">Return packet</a>
            <a class="button" href="${html(pathToFileUrl(path.resolve("ops/founder-status-console.html")))}">Status tracker</a>
          </div>
        </section>
      </div>
      <section class="wide">
        <h2>Click Order</h2>
        <ol>
          <li>Confirm the exact domain price, renewal price, and no add-ons in the visible cart.</li>
          <li>Fill the cart proof file, then run the pre-purchase verifier.</li>
          <li>Buy only after the cart proof passes and founder spend approval is explicit.</li>
          <li>Create one mailbox and the two aliases on the chosen domain.</li>
          <li>Add GitHub Pages and mail DNS records for the selected provider.</li>
          <li>Create the three live Stripe Payment Links.</li>
          <li>Complete Stripe QA and save the QA evidence JSON.</li>
          <li>Build the founder return packet and save the approval message.</li>
          <li>Run the post-click session only after exact approval.</li>
        </ol>
      </section>
      <section class="ready">
        <h2>Proof Commands</h2>
        <pre id="proof-commands">${html(`${verifyCartCommand}
${verifyCartReturnCommand}
${verifyReturnQaCommand}
${verifyStripeQaCommand}
${postClickCommand}
${firstRevenueCommand}`)}</pre>
        <div class="actions"><button class="copy" data-copy-target="proof-commands">Copy commands</button></div>
      </section>
      <section class="danger">
        <h2>Stop Conditions</h2>
        <ul>
          <li>Stop if the domain is premium-priced or renewal is hidden.</li>
          <li>Stop if the cart adds hosting, site builder, paid SSL, paid privacy, extra domains, or extra mailboxes.</li>
          <li>Stop if the mailbox cannot use the chosen domain.</li>
          <li>Stop if any Stripe link is test-mode or not a live buy.stripe.com URL.</li>
          <li>Stop if any evidence file contains secrets or customer material.</li>
        </ul>
      </section>
    </main>
    <script>
      document.querySelectorAll("[data-copy-target]").forEach((button) => {
        button.addEventListener("click", async () => {
          const target = document.getElementById(button.dataset.copyTarget);
          if (!target) return;
          await navigator.clipboard.writeText(target.textContent.trim());
          button.textContent = "Copied";
          setTimeout(() => { button.textContent = "Copy " + (button.dataset.copyTarget === "proof-commands" ? "commands" : "paths"); }, 1200);
        });
      });
    </script>
  </body>
</html>
`;

const created = [
  [cartProofPath, `${JSON.stringify(cartTemplate, null, 2)}\n`],
  [returnPacketPath, `${returnPacket}\n`],
  [qaEvidencePath, `${JSON.stringify(qaTemplate, null, 2)}\n`],
  [commandsPath, commands],
  [clickSessionPath, clickSession]
].map(([file, content]) => ({ file, created: writeIfMissing(file, content) }));

created.push({ file: clickSessionHtmlPath, created: writeGenerated(clickSessionHtmlPath, clickSessionHtml) });

console.log("MCPScan founder click workspace prepared.");
console.log(workspaceDir);
for (const item of created) {
  console.log(`${item.created ? "CREATED" : "EXISTS"} ${item.file}`);
}
console.log("");
console.log("Open the command packet:");
console.log(commandsPath);
console.log("");
console.log("Use the click session browser cockpit:");
console.log(clickSessionHtmlPath);
console.log("");
console.log("Use the click session sheet:");
console.log(clickSessionPath);
