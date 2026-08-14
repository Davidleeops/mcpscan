#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
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

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readInput(file) {
  if (file) return fs.readFileSync(file, "utf8");
  return fs.readFileSync(0, "utf8");
}

function requireMatch(label, text, pattern) {
  const match = text.match(pattern);
  if (!match?.[1]) fail(`Missing ${label} in approved public launch post.`);
  return match[1].trim();
}

function assertOutsideRepo(target, label) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail(`Refusing to write ${label} inside the public MCPScan repo.`);
  }
  return resolved;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function validUrl(value) {
  return /^https:\/\/\S+$/i.test(value);
}

const args = parseArgs(process.argv.slice(2));
const input = readInput(args.file);

if (!input.includes("I approve staging this exact MCPScan public launch post.")) {
  fail("Founder public launch post approval phrase is missing.");
}

if (!input.includes("Do not publish automatically")) {
  fail("No-auto-publish phrase is missing.");
}

const channel = requireMatch("channel", input, /^Channel:\s*(.+)$/m);
const title = requireMatch("post title", input, /^Post title:\s*(.+)$/m);
const url = requireMatch("post URL", input, /^Post URL:\s*(.+)$/m);
const post = requireMatch("final post", input, /^Final post:\s*\n([\s\S]+?)\nApproved action:/m);

if (!validUrl(url)) fail("Post URL must be an HTTPS URL.");
if (post.length < 80) fail("Final post is too short to be a real launch post.");
if (/certified compliant|guaranteed secure|full penetration test|we found a vulnerability/i.test(post)) {
  fail("Final post contains a forbidden GTM claim.");
}

const baseDir = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Public Launch Posts"), "public launch post approvals");
const date = args.date ?? today();
const packetDir = path.join(baseDir, `${date}_${slugify(channel)}_${slugify(title)}`);
if (fs.existsSync(packetDir)) fail(`Approved public launch post already exists: ${packetDir}`);

fs.mkdirSync(packetDir, { recursive: true });

const packet = [
  "# Approved MCPScan Public Launch Post",
  "",
  `Date: ${date}`,
  `Channel: ${channel}`,
  `Post title: ${title}`,
  `Post URL: ${url}`,
  "",
  "## Safety Status",
  "",
  "- Founder approved this exact public post.",
  "- This packet does not publish anything automatically.",
  "- Confirm public URL, security contact, terms, privacy, refund policy, and sample report before publishing.",
  "",
  "## Final Post",
  "",
  "```text",
  post.trim(),
  "```",
  ""
].join("\n");

const manifest = {
  date,
  channel,
  title,
  url,
  noAutoPublish: true,
  packetPath: packetDir
};

fs.writeFileSync(path.join(packetDir, "APPROVED_PUBLIC_LAUNCH_POST.md"), packet, "utf8");
fs.writeFileSync(path.join(packetDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log("Staged approved public launch post.");
console.log(packetDir);
