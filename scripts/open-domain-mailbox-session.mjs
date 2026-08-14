#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const repoRoot = process.cwd();

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
  if (resolved === repoRoot || resolved.startsWith(repoRoot + path.sep)) {
    fail("Refusing to create the domain and mailbox session inside the public MCPScan repo.");
  }
  return resolved;
}

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
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
const workspaceRoot = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Domain And Mailbox Session"));
const workspaceDir = path.join(workspaceRoot, "current");
const shouldOpen = args.open !== "false" && args["no-open"] !== "true";
const allowedProviders = new Set(["spacemail", "zoho", "google"]);

if (!validDomain(domain)) fail("Use --domain with a value like getmcpscan.xyz.");
if (!allowedProviders.has(mailProvider)) fail("Use --mail-provider spacemail, zoho, or google.");

fs.mkdirSync(workspaceDir, { recursive: true });

const cartProofPath = path.join(workspaceDir, "domain-cart-proof.json");
const approvalPath = path.join(workspaceDir, "DOMAIN_MAILBOX_APPROVAL.md");
const commandsPath = path.join(workspaceDir, "NEXT_COMMANDS.md");
const sessionPath = path.join(workspaceDir, "DOMAIN_MAILBOX_SESSION.html");
const chosenMailbox = `security@${domain}`;
const auditAlias = `audit@${domain}`;
const helloAlias = `hello@${domain}`;
const firstYearCap = domain.endsWith(".com") || domain.endsWith(".dev") ? "$12" : "$3";
const renewalNote = domain.endsWith(".xyz")
  ? "$12.52 based on current Spaceship .xyz pricing page"
  : domain.endsWith(".com")
    ? "$9.98 plus ICANN if standard .com"
    : "Use the visible Spaceship cart renewal price";

const cartProof = {
  updatedAt: new Date().toISOString().slice(0, 10),
  domain,
  registrar: "Spaceship",
  domainAvailable: false,
  domainPremiumPriced: false,
  firstYearDomainPrice: "",
  renewalPrice: "",
  mailProvider,
  primaryMailbox: chosenMailbox,
  auditAlias,
  helloAlias,
  extraDomainsInCart: 0,
  extraMailboxesInCart: 0,
  paidHostingAdded: false,
  paidSslAdded: false,
  siteBuilderAdded: false,
  paidPrivacyAdded: false,
  approvalText: "I approve buying the MCPScan launch domain",
  notes: [
    "Fill this from the visible Spaceship cart before purchase.",
    "Keep this file public-safe.",
    "Do not include card data, registrar login details, mailbox passwords, recovery codes, Stripe secrets, customer configs, or customer data."
  ]
};

const approval = `# MCPScan Domain And Mailbox Approval

Use this private approval packet during the registrar click pass.

## Default Call

Buy ${domain} if the final Spaceship cart is available, not premium-priced, at or below ${firstYearCap}, and the renewal price is visible.

## Exact Approval Text

\`\`\`text
I approve buying one MCPScan launch domain and one matching mailbox.

Domain to buy: ${domain}
Registrar: Spaceship
Maximum first-year domain spend: ${firstYearCap}
Renewal price acknowledged: ${renewalNote}
Mailbox provider: ${mailProvider}
Primary mailbox: ${chosenMailbox}
Aliases: ${auditAlias}, ${helloAlias}

Approved action:
Buy one MCPScan launch domain and one matching mailbox. Do not buy extra domains, paid hosting, extra mailboxes, paid SSL add-ons, paid privacy upsells, or site-builder products without separate approval. Keep free included privacy if available.
\`\`\`

## Stop Conditions

- Stop if the domain is premium-priced.
- Stop if the renewal price is hidden.
- Stop if the cart adds hosting, site builder, paid SSL, paid privacy, extra domains, or extra mailboxes.
- Stop if the mailbox cannot use ${domain}.
- Stop if any page asks Codex to store passwords, recovery codes, card data, Stripe secrets, customer configs, or customer data.
`;

const commands = `# MCPScan Domain And Mailbox Session Commands

Before buying anything:

\`\`\`text
npm run launch:verify-cart -- --file "${cartProofPath}"
\`\`\`

After the domain and mailbox exist:

\`\`\`text
npm run launch:click-session -- --domain ${domain} --mail-provider ${mailProvider}
npm run launch:dns-packet -- --domain ${domain} --mailbox ${chosenMailbox} --mail-provider ${mailProvider}
npm run launch:verify-dns -- --domain ${domain} --mail-provider ${mailProvider} --update-status
\`\`\`

Then continue the broader founder click session for Stripe links, public return values, and first revenue gates.
`;

const sessionHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MCPScan Domain And Mailbox Session</title>
    <style>
      :root { color-scheme: light; --ink: #12161c; --muted: #5a6370; --line: #d7dde4; --panel: #ffffff; --soft: #f5f7f9; --accent: #0b6bcb; --good: #0f7b4f; --warn: #9a5a00; --danger: #aa2b2b; }
      * { box-sizing: border-box; }
      body { margin: 0; color: var(--ink); background: var(--soft); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 32px 0 48px; }
      h1, h2, p { margin-top: 0; }
      h1 { font-size: clamp(30px, 5vw, 54px); line-height: 1; margin-bottom: 10px; letter-spacing: 0; }
      h2 { font-size: 18px; margin-bottom: 12px; }
      p, li, td { color: var(--muted); line-height: 1.5; }
      .stack { display: grid; gap: 16px; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
      section { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 18px; }
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
        <h1>MCPScan Domain And Mailbox Session</h1>
        <p>Private click cockpit for buying one domain and one mailbox. This command opens pages only. It does not buy, publish, send, charge, apply DNS, create mailboxes, or approve cart values.</p>
        <div class="actions">
          <a class="button primary" href="https://www.spaceship.com/domain-search/?query=${encodeURIComponent(domain)}" target="_blank" rel="noreferrer">Search ${html(domain)}</a>
          <a class="button" href="https://www.spaceship.com/promos/" target="_blank" rel="noreferrer">Spaceship promos</a>
          <a class="button" href="https://www.spaceship.com/business-email/" target="_blank" rel="noreferrer">Spacemail</a>
          <a class="button" href="https://www.zoho.com/mail/zohomail-pricing.html" target="_blank" rel="noreferrer">Zoho Mail</a>
          <a class="button" href="https://workspace.google.com/pricing" target="_blank" rel="noreferrer">Google Workspace</a>
        </div>
      </header>
      <section class="ready">
        <h2>Buy Rule</h2>
        <p>Buy <strong>${html(domain)}</strong> only if the final cart is available, not premium-priced, at or below <strong>${html(firstYearCap)}</strong>, and renewal is visible. Create one mailbox: <strong>${html(chosenMailbox)}</strong>. Add aliases: <strong>${html(auditAlias)}</strong> and <strong>${html(helloAlias)}</strong>.</p>
      </section>
      <div class="grid">
        <section>
          <h2>Private Files</h2>
          <pre id="files">${html(`Cart proof: ${cartProofPath}
Approval packet: ${approvalPath}
Next commands: ${commandsPath}`)}</pre>
          <button data-copy="files" type="button">Copy paths</button>
        </section>
        <section class="warn">
          <h2>Cart Guard</h2>
          <p>Fill the cart proof from the visible Spaceship cart before purchase. The verifier blocks hidden renewal, premium pricing, extra domains, extra mailboxes, hosting, site builder, paid SSL, and paid privacy upsells.</p>
          <pre id="cart-command">${html(`npm run launch:verify-cart -- --file "${cartProofPath}"`)}</pre>
          <button data-copy="cart-command" type="button">Copy cart check</button>
        </section>
      </div>
      <section class="wide">
        <h2>Domain Options</h2>
        <table>
          <tr><th>Rank</th><th>Domain</th><th>Use when</th></tr>
          <tr><td>1</td><td>getmcpscan.xyz</td><td>Default cheap validation lane if the cart is at or below $3.</td></tr>
          <tr><td>2</td><td>getmcpscan.com</td><td>Trust upgrade if about $9 is worth it for security buyers.</td></tr>
          <tr><td>3</td><td>mcpscan.online</td><td>Backup near-dollar lane only if .xyz fails or jumps.</td></tr>
          <tr><td>4</td><td>getmcpscan.site</td><td>Backup cheap lane if .xyz and .online fail.</td></tr>
          <tr><td>5</td><td>mcpattest.dev</td><td>Cleaner brand lane only if renaming is approved.</td></tr>
        </table>
      </section>
      <section class="wide">
        <h2>Approval Text</h2>
        <pre id="approval">${html(approval)}</pre>
        <button data-copy="approval" type="button">Copy approval</button>
      </section>
      <section class="wide">
        <h2>After Purchase</h2>
        <pre id="commands">${html(commands)}</pre>
        <button data-copy="commands" type="button">Copy next commands</button>
      </section>
      <section class="danger">
        <h2>Stop Conditions</h2>
        <ul>
          <li>Stop if the domain is premium-priced or renewal is hidden.</li>
          <li>Stop if paid add-ons appear.</li>
          <li>Stop if the mailbox cannot use the chosen domain.</li>
          <li>Stop if any evidence would expose secrets or customer material.</li>
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

writePrivate(cartProofPath, `${JSON.stringify(cartProof, null, 2)}\n`, "domain cart proof");
writePrivate(approvalPath, approval, "domain approval packet");
writePrivate(commandsPath, commands, "domain next commands");
writePrivate(sessionPath, sessionHtml, "domain and mailbox session");

const localTargets = [
  sessionPath,
  approvalPath,
  commandsPath,
  path.resolve("ops/domain-mailbox-purchase-packet.html"),
  path.resolve("ops/domain-email-dns-console.html"),
  path.resolve("ops/founder-return-packet.html")
];

const externalTargets = [
  "https://www.spaceship.com/promos/",
  `https://www.spaceship.com/domain-search/?query=${encodeURIComponent(domain)}`,
  "https://www.spaceship.com/business-email/"
];

console.log("MCPScan domain and mailbox session prepared.");
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
console.log("This command opens pages only. It does not buy, publish, send, charge, apply DNS, create mailboxes, or approve cart values.");
