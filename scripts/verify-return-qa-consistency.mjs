#!/usr/bin/env node
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

function fail(message) {
  console.error(message);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function valueFromInput(label, input) {
  const match = input.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim();
}

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validStripeUrl(value) {
  return /^https:\/\/buy\.stripe\.com\/\S+$/i.test(value) && !/test_/i.test(value);
}

function normalize(value) {
  return String(value ?? "").trim();
}

function normalizeUrl(value) {
  return normalize(value).toLowerCase();
}

function linkById(data, id) {
  return Array.isArray(data.links) ? data.links.find((item) => item.id === id) : null;
}

const args = parseArgs(process.argv.slice(2));
if (!args.file) fail("Missing --file path to the approved founder return packet.");
if (!args["qa-file"]) fail("Missing --qa-file path to Stripe checkout QA evidence.");
if (!fs.existsSync(args.file)) fail(`Return packet not found: ${args.file}`);
if (!fs.existsSync(args["qa-file"])) fail(`Stripe QA evidence file not found: ${args["qa-file"]}`);

const input = fs.readFileSync(args.file, "utf8");
const qa = JSON.parse(fs.readFileSync(args["qa-file"], "utf8"));

const packet = {
  domain: normalize(valueFromInput("Domain", input)).toLowerCase(),
  mailbox: normalize(valueFromInput("Primary mailbox", input)),
  quick: normalize(valueFromInput("Quick Audit", input)),
  launch: normalize(valueFromInput("Launch Audit", input)),
  enterprise: normalize(valueFromInput("Enterprise Readiness", input))
};

if (!validDomain(packet.domain)) fail("Return packet domain is missing or invalid.");
if (!validEmail(packet.mailbox)) fail("Return packet primary mailbox is missing or invalid.");
if (!validStripeUrl(packet.quick)) fail("Return packet Quick Audit link is missing or invalid.");
if (!validStripeUrl(packet.launch)) fail("Return packet Launch Audit link is missing or invalid.");
if (!validStripeUrl(packet.enterprise)) fail("Return packet Enterprise Readiness link is missing or invalid.");

if (qa.domain !== packet.domain) fail(`QA evidence domain does not match return packet: ${qa.domain} vs ${packet.domain}.`);
if (qa.primaryMailbox !== packet.mailbox) fail(`QA evidence primary mailbox does not match return packet: ${qa.primaryMailbox} vs ${packet.mailbox}.`);

const expected = [
  ["quick", "Quick Audit", packet.quick],
  ["launch", "Launch Audit", packet.launch],
  ["enterprise", "Enterprise Readiness", packet.enterprise]
];

for (const [id, label, url] of expected) {
  const link = linkById(qa, id);
  if (!link) fail(`QA evidence is missing ${label} link.`);
  if (normalizeUrl(link.checkoutUrl) !== normalizeUrl(url)) {
    fail(`QA evidence ${label} URL does not match return packet.`);
  }
}

pass("return packet and QA evidence domain match");
pass("return packet and QA evidence primary mailbox match");
pass("return packet and QA evidence Stripe links match");
