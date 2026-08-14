#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
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

function run(label, args) {
  const result = spawnSync(process.execPath, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.stderr.write(result.stdout);
    throw new Error(`${label} failed.`);
  }
  const file = result.stdout.trim().split("\n").at(-1);
  return file;
}

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function csvEscape(value) {
  const text = String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function writeCsv(file, rows) {
  fs.writeFileSync(file, rows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n", "utf8");
}

const args = parseArgs(process.argv.slice(2));
const domain = (args.domain ?? "getmcpscan.xyz").trim().toLowerCase();
const mailbox = (args.mailbox ?? `security@${domain}`).trim();
const mailProvider = (args["mail-provider"] ?? "zoho").trim().toLowerCase();
const date = args.date ?? new Date().toISOString().slice(0, 10);
const output = path.resolve(args.output ?? "ops/generated-launch-packets");

const mailProviders = {
  spacemail: {
    label: "Spacemail",
    mx: [
      ["Spacemail", "MX", "@", "mx1.spacemail.com", "0", "Mail exchanger"],
      ["Spacemail", "MX", "@", "mx2.spacemail.com", "0", "Mail exchanger"]
    ],
    spf: ["Spacemail", "TXT", "@", "v=spf1 include:spf.spacemail.com ~all", "", "SPF"],
    dkim: ["Spacemail", "TXT", "{{spacemail_dkim_selector}}._domainkey", "{{spacemail_dkim_value}}", "", "Replace with exact Spacemail DKIM value"]
  },
  zoho: {
    label: "Zoho Mail",
    mx: [
      ["Zoho Mail", "MX", "@", "mx.zoho.com", "10", "Mail exchanger"],
      ["Zoho Mail", "MX", "@", "mx2.zoho.com", "20", "Mail exchanger"],
      ["Zoho Mail", "MX", "@", "mx3.zoho.com", "50", "Mail exchanger"]
    ],
    spf: ["Zoho Mail", "TXT", "@", "v=spf1 include:zohomail.com ~all", "", "SPF"],
    dkim: ["Zoho Mail", "TXT", "{{zoho_dkim_selector}}._domainkey", "{{zoho_dkim_value}}", "", "Replace with exact Zoho DKIM value"]
  },
  google: {
    label: "Google Workspace",
    mx: [["Google Workspace", "MX", "@", "smtp.google.com", "1", "Mail exchanger"]],
    spf: ["Google Workspace", "TXT", "@", "v=spf1 include:_spf.google.com ~all", "", "SPF"],
    dkim: ["Google Workspace", "TXT", "{{google_dkim_selector}}._domainkey", "{{google_dkim_value}}", "", "Replace with exact Google Workspace DKIM value"]
  }
};

if (!validDomain(domain)) {
  console.error("Domain must look like getmcpscan.xyz.");
  process.exit(1);
}

if (!validEmail(mailbox) || !mailbox.toLowerCase().endsWith(`@${domain}`)) {
  console.error("Mailbox must be on the chosen domain.");
  process.exit(1);
}

if (!mailProviders[mailProvider]) {
  console.error("Mail provider must be zoho, google, or spacemail.");
  process.exit(1);
}

fs.mkdirSync(output, { recursive: true });

const dnsPacket = run("DNS packet", [
  "scripts/build-domain-dns-packet.mjs",
  "--domain",
  domain,
  "--mailbox",
  mailbox,
  "--date",
  date,
  "--mail-provider",
  mailProvider,
  "--output",
  output
]);

const stripePacket = run("Stripe packet", [
  "scripts/build-stripe-setup-packet.mjs",
  "--domain",
  domain,
  "--mailbox",
  mailbox,
  "--date",
  date,
  "--output",
  output
]);

const dnsCsvPath = path.join(output, `${date}_${domain.replace(/\./g, "-")}_dns-records.csv`);
const stripeCsvPath = path.join(output, `${date}_${domain.replace(/\./g, "-")}_stripe-products.csv`);
const provider = mailProviders[mailProvider];

writeCsv(dnsCsvPath, [
  ["system", "type", "host", "value", "priority", "notes"],
  ["GitHub Pages", "A", "@", "185.199.108.153", "", "Apex domain"],
  ["GitHub Pages", "A", "@", "185.199.109.153", "", "Apex domain"],
  ["GitHub Pages", "A", "@", "185.199.110.153", "", "Apex domain"],
  ["GitHub Pages", "A", "@", "185.199.111.153", "", "Apex domain"],
  ["GitHub Pages", "AAAA", "@", "2606:50c0:8000::153", "", "Apex domain"],
  ["GitHub Pages", "AAAA", "@", "2606:50c0:8001::153", "", "Apex domain"],
  ["GitHub Pages", "AAAA", "@", "2606:50c0:8002::153", "", "Apex domain"],
  ["GitHub Pages", "AAAA", "@", "2606:50c0:8003::153", "", "Apex domain"],
  ["GitHub Pages", "CNAME", "www", "davidleeops.github.io", "", "www subdomain"],
  ...provider.mx,
  provider.spf,
  [provider.label, "TXT", "_dmarc", `v=DMARC1; p=none; rua=mailto:${mailbox}`, "", "DMARC"],
  provider.dkim
]);

writeCsv(stripeCsvPath, [
  ["product", "price_usd", "payment_type", "role", "delivery", "description"],
  [
    "MCP Quick Audit",
    "750",
    "One-time",
    "Entry package",
    "3 business days after intake is complete",
    "A fixed-scope security review of up to 3 MCP servers in 1 environment. Includes MCP server and tool inventory, configuration risk review, secret exposure review, prompt-injection and tool-description risk review, written report, and remediation checklist."
  ],
  [
    "MCP Launch Audit",
    "1500",
    "One-time",
    "Default first-revenue package",
    "5 business days after intake is complete",
    "A practical MCP security audit for teams preparing customer pilots, internal rollout, or launch. Covers up to 8 MCP servers across up to 2 environments. Includes server and tool inventory, permission review, secret exposure review, prompt-injection and tool-description risk review, written report, remediation checklist, 30-minute findings call, and 1 re-scan after fixes."
  ],
  [
    "MCP Enterprise Readiness Audit",
    "3500",
    "One-time",
    "Enterprise package",
    "7 business days after intake is complete",
    "A deeper MCP security audit for teams preparing enterprise review. Covers up to 15 MCP servers across up to 3 environments. Includes server and tool inventory, configuration and permission review, secret exposure review, prompt-injection and tool-description risk review, executive summary, detailed written report, remediation checklist, 45-minute findings call, buyer-facing security summary, and 1 re-scan after fixes."
  ]
]);

const readme = [
  "# MCPScan Generated Launch Packets",
  "",
  `Generated: ${date}`,
  "",
  "Use these only after the founder buys the matching domain and mailbox.",
  "",
  "## Default Cheap Lane",
  "",
  `Domain: ${domain}`,
  `Primary mailbox: ${mailbox}`,
  `Mail provider: ${provider.label}`,
  `Audit alias: audit@${domain}`,
  `Hello alias: hello@${domain}`,
  "",
  "## Packets",
  "",
  `- DNS packet: ${path.basename(dnsPacket)}`,
  `- Stripe setup packet: ${path.basename(stripePacket)}`,
  `- DNS records CSV: ${path.basename(dnsCsvPath)}`,
  `- Stripe products CSV: ${path.basename(stripeCsvPath)}`,
  "",
  "## Founder Click Order",
  "",
  "1. Clear GitHub billing or account lock.",
  `2. Buy one domain only: ${domain}.`,
  `3. Create one ${provider.label} mailbox: ${mailbox}.`,
  `4. Add aliases: audit@${domain} and hello@${domain}.`,
  "5. Apply only the DNS records in the generated DNS packet.",
  "6. Create only the three live Stripe Payment Links in the generated Stripe packet.",
  "7. Paste the domain, mailbox, aliases, and Stripe links into the founder return packet.",
  "",
  "## Stop Conditions",
  "",
  "- Do not use these packets for a different domain.",
  "- Do not buy extra domains, paid hosting, site builder, paid SSL, or extra mailboxes.",
  "- Keep free included privacy if available.",
  "- Do not send outbound until the pre-send gate passes.",
  ""
].join("\n");

const readmePath = path.join(output, "README.md");
fs.writeFileSync(readmePath, readme, "utf8");

console.log("Prepared MCPScan cheap-lane launch packets.");
console.log(readmePath);
console.log(dnsPacket);
console.log(stripePacket);
console.log(dnsCsvPath);
console.log(stripeCsvPath);
