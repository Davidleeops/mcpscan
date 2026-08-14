#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";

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

function readInput(file) {
  if (file) return fs.readFileSync(file, "utf8");
  return fs.readFileSync(0, "utf8");
}

function requireMatch(label, text, pattern) {
  const match = text.match(pattern);
  if (!match?.[1]) {
    throw new Error(`Missing ${label} in founder return packet.`);
  }
  return match[1].trim();
}

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validUrl(value) {
  return /^https:\/\/\S+$/i.test(value);
}

function assertValid(label, value, test) {
  if (!test(value)) throw new Error(`Invalid ${label}: ${value}`);
}

const args = parseArgs(process.argv.slice(2));
const input = readInput(args.file);

if (!input.includes("I approve applying these exact MCPScan launch values")) {
  throw new Error("Founder approval phrase is missing.");
}

if (!input.includes("Apply these links to the public landing page")) {
  throw new Error("Approved action phrase is missing.");
}

const domain = requireMatch("domain", input, /^Domain:\s*(.+)$/m).toLowerCase();
const email = requireMatch("primary mailbox", input, /^Primary mailbox:\s*(.+)$/m);
const security = requireMatch("security alias", input, /^Security alias:\s*(.+)$/m);
const hello = requireMatch("hello alias", input, /^Hello alias:\s*(.+)$/m);
const quick = requireMatch("Quick Audit link", input, /^Quick Audit:\s*(.+)$/m);
const launch = requireMatch("Launch Audit link", input, /^Launch Audit:\s*(.+)$/m);
const enterprise = requireMatch("Enterprise Readiness link", input, /^Enterprise Readiness:\s*(.+)$/m);

assertValid("domain", domain, validDomain);
assertValid("primary mailbox", email, validEmail);
assertValid("security alias", security, validEmail);
assertValid("hello alias", hello, validEmail);
assertValid("Quick Audit link", quick, validUrl);
assertValid("Launch Audit link", launch, validUrl);
assertValid("Enterprise Readiness link", enterprise, validUrl);

const child = spawnSync(
  process.execPath,
  [
    "scripts/apply-approved-launch-links.mjs",
    "--domain",
    domain,
    "--email",
    email,
    "--quick",
    quick,
    "--launch",
    launch,
    "--enterprise",
    enterprise
  ],
  { stdio: "inherit" }
);

if (child.status !== 0) {
  process.exit(child.status ?? 1);
}

console.log("Parsed founder return packet.");
console.log(`Security alias: ${security}`);
console.log(`Hello alias: ${hello}`);
