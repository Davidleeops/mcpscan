#!/usr/bin/env node
import { spawnSync } from "node:child_process";
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

function valueFromInput(label, input) {
  const match = input.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim();
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

function run(label, command, args, options = {}) {
  console.log("");
  console.log(`Running ${label}`);
  const child = spawnSync(command, args, { cwd: root, stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit", encoding: "utf8" });
  if (child.status !== 0) {
    if (options.capture) {
      if (child.stdout) process.stdout.write(child.stdout);
      if (child.stderr) process.stderr.write(child.stderr);
    }
    process.exit(child.status ?? 1);
  }
  return child;
}

function newestBundle(rootDir) {
  if (!fs.existsSync(rootDir)) return null;
  const entries = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.endsWith("_post-click-handoff"))
    .map((entry) => {
      const full = path.join(rootDir, entry.name);
      return { full, mtimeMs: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
  return entries[0]?.full ?? null;
}

const args = parseArgs(process.argv.slice(2));
const workspaceRoot = args.root ? path.resolve(args.root) : path.join(os.homedir(), "MCPScan Founder Clicks");
const workspaceDir = args.workspace ? path.resolve(args.workspace) : path.join(workspaceRoot, "current");
const returnFile = args.file ? path.resolve(args.file) : path.join(workspaceDir, "approved-return-packet.txt");
const cartFile = args["cart-file"] ? path.resolve(args["cart-file"]) : path.join(workspaceDir, "domain-cart-proof.json");
const qaFile = args["qa-file"] ? path.resolve(args["qa-file"]) : path.join(workspaceDir, "stripe-checkout-qa-evidence.json");
const bundleRoot = args["bundle-root"] ? path.resolve(args["bundle-root"]) : path.join(os.homedir(), "MCPScan Post-Click Bundles");
const apply = args.apply === "true";
const publish = args.publish === "true";
const open = args.open !== "false" && args["no-open"] !== "true";
const strict = args.strict === "true";
const skipDns = args["skip-dns"] === "true";
const skipLaunch = args["skip-launch"] === "true";

if (!fs.existsSync(returnFile)) fail(`Return packet not found: ${returnFile}`);
if (!fs.existsSync(cartFile)) fail(`Domain cart proof file not found: ${cartFile}`);
if (!fs.existsSync(qaFile)) fail(`Stripe checkout QA evidence file not found: ${qaFile}`);

const input = fs.readFileSync(returnFile, "utf8");
const domain = (args.domain ?? valueFromInput("Domain", input) ?? "").toLowerCase();
const mailProvider = (args["mail-provider"] ?? valueFromInput("Mail provider", input) ?? "spacemail").toLowerCase();
if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) fail("Domain is missing or invalid in the founder return packet.");
if (!["zoho", "google", "spacemail"].includes(mailProvider)) fail("Mail provider must be zoho, google, or spacemail.");

console.log("MCPScan founder post-click session");
console.log("");
console.log(`Domain: ${domain}`);
console.log(`Mail provider: ${mailProvider}`);
console.log(`Apply public values: ${apply ? "yes" : "no"}`);
console.log(`Publish Pages fallback: ${publish ? "yes" : "no"}`);

run("cart proof and return packet consistency", "npm", ["run", "launch:verify-cart", "--", "--file", cartFile, "--return-file", returnFile]);
run("post-click handoff bundle", "npm", ["run", "launch:post-click-bundle", "--", "--file", returnFile, "--qa-file", qaFile, "--root", bundleRoot, "--mail-provider", mailProvider]);

const postClickArgs = [
  "run",
  "launch:post-click-verify",
  "--",
  "--file",
  returnFile,
  "--cart-file",
  cartFile,
  "--qa-file",
  qaFile,
  "--apply",
  apply ? "true" : "false",
  "--mail-provider",
  mailProvider
];
if (strict) postClickArgs.push("--strict", "true");
if (skipDns) postClickArgs.push("--skip-dns", "true");
if (skipLaunch) postClickArgs.push("--skip-launch", "true");
if (args["dkim-selector"]) postClickArgs.push("--dkim-selector", args["dkim-selector"]);
run("post-click verification", "npm", postClickArgs);

if (apply && publish) {
  run("Pages fallback publish", "npm", ["run", "launch:publish-pages-fallback", "--", "--wait", args.wait ?? "true"]);
}

if (apply && !skipLaunch) {
  run("live full proof", "npm", [
    "run",
    "launch:full-proof",
    "--",
    "--live",
    "true",
    "--status-file",
    "ops/founder-approval-status.json",
    "--cart-file",
    cartFile,
    "--return-file",
    returnFile,
    "--qa-file",
    qaFile,
    "--mail-provider",
    mailProvider
  ]);
}

const bundleDir = newestBundle(bundleRoot);
if (open && bundleDir) {
  openTarget(pathToFileURL(path.join(bundleDir, "NEXT_COMMANDS.md")).toString());
  openTarget(pathToFileURL(path.resolve("ops/founder-status-console.html")).toString());
  openTarget(pathToFileURL(path.resolve("ops/first-revenue-battlecard.html")).toString());
}

console.log("");
console.log("Founder post-click session complete.");
console.log(`Return packet: ${returnFile}`);
console.log(`Cart proof: ${cartFile}`);
console.log(`Stripe QA evidence: ${qaFile}`);
if (bundleDir) console.log(`Post-click bundle: ${bundleDir}`);
console.log(apply ? "Public values were applied through the approved return packet." : "Public values were not applied. Re-run with --apply true only after approval.");
console.log("Outbound remains paused until exact recipients and exact final messages are approved in the same turn.");
