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

const args = parseArgs(process.argv.slice(2));
const domain = (args.domain ?? "mcpscan.site").trim().toLowerCase();
const mailbox = (args.mailbox ?? `security@${domain}`).trim();
const date = args.date ?? new Date().toISOString().slice(0, 10);
const output = path.resolve(args.output ?? "ops/generated-launch-packets");

if (!validDomain(domain)) {
  console.error("Domain must look like mcpscan.site.");
  process.exit(1);
}

if (!validEmail(mailbox) || !mailbox.toLowerCase().endsWith(`@${domain}`)) {
  console.error("Mailbox must be on the chosen domain.");
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
  `Audit alias: audit@${domain}`,
  `Hello alias: hello@${domain}`,
  "",
  "## Packets",
  "",
  `- DNS packet: ${path.basename(dnsPacket)}`,
  `- Stripe setup packet: ${path.basename(stripePacket)}`,
  "",
  "## Founder Click Order",
  "",
  "1. Clear GitHub billing or account lock.",
  `2. Buy one domain only: ${domain}.`,
  `3. Create one Spacemail mailbox: ${mailbox}.`,
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
