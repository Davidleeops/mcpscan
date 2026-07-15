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

function requireUrl(name, value) {
  if (!value || !/^https:\/\/\S+$/i.test(value)) {
    throw new Error(`Missing or invalid --${name}; expected an https:// URL.`);
  }
  return value;
}

function optionalDomain(value) {
  if (!value) return undefined;
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
    throw new Error("--domain must be a hostname like mcpscanhq.com.");
  }
  return value.toLowerCase();
}

function optionalEmail(value) {
  if (!value) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error("--email must be an email address like hello@mcpscanhq.com.");
  }
  return value;
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

function publicBaseUrl(domain) {
  return domain ? `https://${domain}` : "https://davidleeops.github.io/mcpscan";
}

const args = parseArgs(process.argv.slice(2));
const quick = requireUrl("quick", args.quick);
const launch = requireUrl("launch", args.launch);
const enterprise = requireUrl("enterprise", args.enterprise);
const domain = optionalDomain(args.domain);
const email = optionalEmail(args.email);
const baseUrl = publicBaseUrl(domain);

const mailto = email ? `mailto:${email}?subject=MCPScan%20audit%20scope` : "https://github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20audit%20request";

const landingFile = "landing/index.html";
const landing = replaceAll(read(landingFile), [
  ["https://github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20Quick%20Audit%20request", quick],
  ["https://github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20Launch%20Audit%20request", launch],
  ["https://github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20Enterprise%20Audit%20request", enterprise],
  ["https://github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20audit%20request", mailto]
]);
write(landingFile, landing);

const urlReplacements = [
  ["https://davidleeops.github.io/mcpscan/sample-report.html", `${baseUrl}/sample-report.html`],
  ["https://davidleeops.github.io/mcpscan/thank-you.html", `${baseUrl}/thank-you.html`],
  ["https://davidleeops.github.io/mcpscan/intake.html", `${baseUrl}/intake.html`],
  ["https://davidleeops.github.io/mcpscan/badge.json", `${baseUrl}/badge.json`],
  ["https://davidleeops.github.io/mcpscan/", `${baseUrl}/`]
];

for (const file of [
  "docs/LAUNCH_CONTROL_ROOM.md",
  "docs/LANDING_PAGE.md",
  "sales/stripe-products.md",
  "sales/one-page-scope.md"
]) {
  write(file, replaceAll(read(file), urlReplacements));
}

if (domain) {
  write("landing/CNAME", `${domain}\n`);
}

if (email) {
  const security = read("SECURITY.md").replace(
    "Until a dedicated security inbox exists, open a GitHub issue with a high-level description and request a private disclosure path. Do not include exploit details or secrets in public issues.",
    `Report MCPScan vulnerabilities or private disclosure requests to ${email}. Do not include exploit details, secrets, production credentials, or customer data in public issues.`
  );
  write("SECURITY.md", security);
}

console.log("Applied approved launch links.");
console.log(`Landing CTAs: quick=${quick}, launch=${launch}, enterprise=${enterprise}`);
console.log(`Public base URL: ${baseUrl}`);
if (email) console.log(`Contact email: ${email}`);
