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

const args = parseArgs(process.argv.slice(2));
const domain = (args.domain ?? "").trim().toLowerCase();
const mailbox = (args.mailbox ?? `security@${domain}`).trim();
const mailProvider = (args["mail-provider"] ?? "zoho").trim().toLowerCase();
const dkimSelector = (args["dkim-selector"] ?? `{{${mailProvider}_dkim_selector}}`).trim();
const dkimValue = (args["dkim-value"] ?? `{{${mailProvider}_dkim_value}}`).trim();
const outputRoot = path.resolve(args.output ?? path.join(os.tmpdir(), "mcpscan-dns-packets"));

if (!validDomain(domain)) {
  console.error("Usage: npm run launch:dns-packet -- --domain getmcpscan.com");
  process.exit(1);
}

if (!validEmail(mailbox) || !mailbox.toLowerCase().endsWith(`@${domain}`)) {
  console.error("Mailbox must be an email address on the chosen domain.");
  process.exit(1);
}

const providerRecords = {
  spacemail: {
    label: "Spacemail",
    mx: [
      ["@", "mx1.spacemail.com", "0"],
      ["@", "mx2.spacemail.com", "0"]
    ],
    spf: "v=spf1 include:spf.spacemail.com ~all",
    dkimHost: `${dkimSelector}._domainkey`,
    dkimNote: "Spacemail shows the DKIM record after mailbox creation. Spaceship docs name spacemail._domainkey as the common host, but use the exact host and value shown in the account.",
    sources: [
      "https://www.spaceship.com/knowledgebase/spacemail-dns-records-third-party-domain/",
      "https://www.spaceship.com/blog/spf-dkim-dmarc-explained/"
    ]
  },
  zoho: {
    label: "Zoho Mail",
    mx: [
      ["@", "mx.zoho.com", "10"],
      ["@", "mx2.zoho.com", "20"],
      ["@", "mx3.zoho.com", "50"]
    ],
    spf: "v=spf1 include:zohomail.com ~all",
    dkimHost: `${dkimSelector}._domainkey`,
    dkimNote: "Generate the DKIM selector and TXT value in Zoho Mail Admin Console, then paste the exact value here.",
    sources: [
      "https://www.zoho.com/mail/help/adminconsole/configure-email-delivery.html",
      "https://www.zoho.com/mail/help/adminconsole/spf-configuration.html",
      "https://www.zoho.com/mail/help/adminconsole/dkim-configuration.html"
    ]
  },
  google: {
    label: "Google Workspace",
    mx: [
      ["@", "smtp.google.com", "1"]
    ],
    spf: "v=spf1 include:_spf.google.com ~all",
    dkimHost: `${dkimSelector}._domainkey`,
    dkimNote: "Generate the DKIM record in Google Admin after Gmail is active for the domain, then paste the exact value here.",
    sources: [
      "https://knowledge.workspace.google.com/admin/domains/set-up-mx-records-for-google-workspace",
      "https://knowledge.workspace.google.com/admin/security/set-up-spf",
      "https://knowledge.workspace.google.com/admin/security/set-up-dkim",
      "https://knowledge.workspace.google.com/admin/security/set-up-dmarc"
    ]
  }
};

const provider = providerRecords[mailProvider];
if (!provider) {
  console.error("Mail provider must be zoho, google, or spacemail.");
  process.exit(1);
}

const date = args.date ?? today();
const file = path.join(outputRoot, `${date}_${slugify(domain)}_dns-packet.md`);
const verifyCommand = dkimSelector.includes("{{")
  ? `npm run launch:verify-dns -- --domain ${domain} --mail-provider ${mailProvider} --update-status`
  : `npm run launch:verify-dns -- --domain ${domain} --mail-provider ${mailProvider} --update-status --dkim-selector ${dkimSelector}`;

const mailRows = [
  ...provider.mx.map(([host, value, priority]) => `| MX | ${host} | ${value} | ${priority} |`),
  `| TXT | @ | ${provider.spf} |  |`,
  `| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:${mailbox} |  |`,
  `| TXT | ${provider.dkimHost} | ${dkimValue} |  |`
];

const packet = [
  `# MCPScan DNS Packet For ${domain}`,
  "",
  `Generated: ${date}`,
  "",
  "## Rule",
  "",
  "Apply only these records unless the founder separately approves a change. Do not add hosting, forwarding, site-builder, parking, or paid SSL products from the registrar cart.",
  "",
  "## GitHub Pages Records",
  "",
  "| Type | Host | Value |",
  "| --- | --- | --- |",
  "| A | @ | 185.199.108.153 |",
  "| A | @ | 185.199.109.153 |",
  "| A | @ | 185.199.110.153 |",
  "| A | @ | 185.199.111.153 |",
  "| AAAA | @ | 2606:50c0:8000::153 |",
  "| AAAA | @ | 2606:50c0:8001::153 |",
  "| AAAA | @ | 2606:50c0:8002::153 |",
  "| AAAA | @ | 2606:50c0:8003::153 |",
  "| CNAME | www | davidleeops.github.io |",
  "",
  `## ${provider.label} Records`,
  "",
  "| Type | Host | Value | Priority |",
  "| --- | --- | --- | --- |",
  ...mailRows,
  "",
  "DKIM note:",
  "",
  provider.dkimNote,
  "",
  "Provider sources:",
  "",
  ...provider.sources.map((source) => `- ${source}`),
  "",
  "## GitHub Pages Setting",
  "",
  "```text",
  domain,
  "```",
  "",
  "## Verify After Propagation",
  "",
  "```text",
  verifyCommand,
  "```",
  "",
  "## Approval Text",
  "",
  "```text",
  "I approve applying this exact MCPScan DNS packet.",
  "",
  `Domain: ${domain}`,
  `Primary mailbox: ${mailbox}`,
  `Mail provider: ${provider.label}`,
  `DKIM selector: ${dkimSelector}`,
  "",
  "Approved action:",
  `Apply only the GitHub Pages, ${provider.label} MX, SPF, DKIM, and DMARC records shown in this packet. Do not add hosting, forwarding, paid SSL, parking, extra mailboxes, or site-builder products without separate approval.`,
  "```",
  ""
].join("\n");

fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(file, packet, "utf8");

console.log("Created MCPScan DNS packet.");
console.log(file);
