#!/usr/bin/env node
import fs from "node:fs";
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

function requireDomain(value) {
  if (!value || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
    throw new Error("--domain must be a hostname like getmcpscan.com.");
  }
  return value.toLowerCase();
}

function requireEmail(value) {
  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error("--email must be an email address like security@getmcpscan.com.");
  }
  return value.toLowerCase();
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content);
}

function replaceAll(content, replacements) {
  let next = content;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  return next;
}

function replaceAnchorHrefByText(content, text, href) {
  const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(<a\\b[^>]*\\bhref=")[^"]+("[^>]*>\\s*${escapedText}\\s*<\\/a>)`, "g");
  return content.replace(pattern, `$1${href}$2`);
}

const args = parseArgs(process.argv.slice(2));
const domain = requireDomain(args.domain);
const email = requireEmail(args.email);

if (!email.endsWith(`@${domain}`)) {
  throw new Error("--email must use the approved domain.");
}

const baseUrl = `https://${domain}`;
const mailto = `mailto:${email}?subject=MCPScan%20audit%20scope`;
const urlReplacements = [
  ["https://davidleeops.github.io/mcpscan/sample-report.html", `${baseUrl}/sample-report.html`],
  ["https://davidleeops.github.io/mcpscan/thank-you.html", `${baseUrl}/thank-you.html`],
  ["https://davidleeops.github.io/mcpscan/intake.html", `${baseUrl}/intake.html`],
  ["https://davidleeops.github.io/mcpscan/secure-intake.html", `${baseUrl}/secure-intake.html`],
  ["https://davidleeops.github.io/mcpscan/terms.html", `${baseUrl}/terms.html`],
  ["https://davidleeops.github.io/mcpscan/privacy.html", `${baseUrl}/privacy.html`],
  ["https://davidleeops.github.io/mcpscan/refund.html", `${baseUrl}/refund.html`],
  ["https://davidleeops.github.io/mcpscan/badge.json", `${baseUrl}/badge.json`],
  ["https://davidleeops.github.io/mcpscan/", `${baseUrl}/`]
];

let landing = read("landing/index.html");
landing = replaceAll(landing, [["https://github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20audit%20request", mailto]]);
landing = replaceAnchorHrefByText(landing, "Ask about scope", mailto);
write("landing/index.html", landing);

for (const file of [
  "docs/LAUNCH_CONTROL_ROOM.md",
  "docs/LANDING_PAGE.md",
  "sales/stripe-products.md",
  "sales/one-page-scope.md"
]) {
  write(file, replaceAll(read(file), urlReplacements));
}

write("landing/CNAME", `${domain}\n`);

const security = read("SECURITY.md").replace(
  "Until a dedicated security inbox exists, open a GitHub issue with a high-level description and request a private disclosure path. Do not include exploit details or secrets in public issues.",
  `Report MCPScan vulnerabilities or private disclosure requests to ${email}. Do not include exploit details, secrets, production credentials, or customer data in public issues.`
);
write("SECURITY.md", security);

console.log("Applied domain and mailbox launch values.");
console.log(`Public base URL: ${baseUrl}`);
console.log(`Contact email: ${email}`);
console.log("Stripe checkout links remain pending.");
