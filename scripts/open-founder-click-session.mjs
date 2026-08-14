#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

const args = parseArgs(process.argv.slice(2));
const domain = String(args.domain ?? "getmcpscan.xyz").trim().toLowerCase();
const mailProvider = String(args["mail-provider"] ?? "spacemail").trim().toLowerCase();
const workspaceRoot = args.root ? path.resolve(args.root) : path.join(os.homedir(), "MCPScan Founder Clicks");
const shouldOpen = args.open !== "false" && args["no-open"] !== "true";
const clickSessionPath = path.join(workspaceRoot, "current", "CLICK_SESSION.md");
const clickSessionHtmlPath = path.join(workspaceRoot, "current", "CLICK_SESSION.html");
const nextCommandsPath = path.join(workspaceRoot, "current", "NEXT_COMMANDS.md");

console.log("MCPScan founder click session");
console.log("");
console.log(`Preparing private workspace for ${domain} with ${mailProvider}.`);

const prepare = spawnSync(
  "npm",
  [
    "run",
    "launch:prepare-founder-clicks",
    "--",
    "--domain",
    domain,
    "--mail-provider",
    mailProvider,
    "--root",
    workspaceRoot
  ],
  { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
);

if (prepare.stdout) console.log(prepare.stdout.trim());
if (prepare.stderr) console.error(prepare.stderr.trim());
if (prepare.status !== 0) {
  console.error("Founder click workspace preparation failed. Stop before buying anything.");
  process.exit(prepare.status ?? 1);
}

const localTargets = [
  clickSessionHtmlPath,
  clickSessionPath,
  nextCommandsPath,
  path.resolve("ops/founder-click-handoff.html"),
  path.resolve("ops/domain-mailbox-purchase-packet.html"),
  path.resolve("ops/cheap-launch-packet-console.html"),
  path.resolve("ops/domain-email-dns-console.html"),
  path.resolve("ops/stripe-click-setup.html"),
  path.resolve("ops/stripe-payment-link-qa-console.html"),
  path.resolve("ops/founder-return-packet.html"),
  path.resolve("ops/founder-status-console.html")
];

const externalTargets = [
  "https://www.spaceship.com/promos/",
  `https://www.spaceship.com/domain-search/?query=${domain}`,
  "https://www.spaceship.com/business-email/",
  "https://dashboard.stripe.com/payment-links"
];

console.log("");
console.log("Opening founder session files and consoles:");
for (const target of localTargets) {
  const url = pathToFileURL(target).toString();
  const opened = shouldOpen ? openTarget(url) : false;
  console.log(`${opened ? "OPENED" : "COPY"} ${target}${opened ? "" : ` ${url}`}`);
}

console.log("");
console.log("Opening founder account links:");
for (const target of externalTargets) {
  const opened = shouldOpen ? openTarget(target) : false;
  console.log(`${opened ? "OPENED" : "COPY"} ${target}`);
}

console.log("");
console.log("Start here:");
console.log(clickSessionHtmlPath);
console.log("");
console.log("This command does not buy, publish, send, charge, apply public links, or create customer files.");
