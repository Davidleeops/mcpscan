#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
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

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail("Refusing to create the first-10 send session inside the public MCPScan repo.");
  }
  return resolved;
}

function copyRequired(source, target) {
  const fullSource = path.join(root, source);
  if (!fs.existsSync(fullSource)) fail(`Missing ${source}.`);
  fs.copyFileSync(fullSource, target);
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
const workspaceRoot = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan First 10 Send Session"));
const workspaceDir = path.join(workspaceRoot, "current");
const shouldOpen = args.open !== "false" && args["no-open"] !== "true";
fs.mkdirSync(workspaceDir, { recursive: true });

const routePacketPath = path.join(workspaceDir, "first-10-route-approval-packet.md");
const namedPacketPath = path.join(workspaceDir, "first-10-named-recipient-approval-packet.md");
const commandsPath = path.join(workspaceDir, "NEXT_COMMANDS.md");
const sessionPath = path.join(workspaceDir, "FIRST_10_SEND_SESSION.md");

copyRequired("sales/first-10-route-approval-packet-2026-08-14.md", routePacketPath);
copyRequired("sales/first-10-recipient-approval-packet-2026-08-14.md", namedPacketPath);

const cartFile = "$HOME/MCPScan Founder Clicks/current/domain-cart-proof.json";
const returnFile = "$HOME/MCPScan Founder Clicks/current/approved-return-packet.txt";
const qaFile = "$HOME/MCPScan Founder Clicks/current/stripe-checkout-qa-evidence.json";
const approvedRoot = "$HOME/MCPScan Outbound Approvals";
const revenueRoot = "$HOME/MCPScan Revenue Logs";
const snapshotRoot = "$HOME/MCPScan Revenue Snapshots";

const commands = [
  "# MCPScan First 10 Send Session Commands",
  "",
  "Run these from the public MCPScan repo after live launch gates pass and the exact first-10 packet is approved.",
  "",
  "## Pre-Send Gate",
  "",
  "```text",
  `npm run outbound:send-gates -- --status-file ops/founder-approval-status.json --cart-file "${cartFile}" --return-file "${returnFile}" --qa-file "${qaFile}"`,
  "```",
  "",
  "## Stage Approved Packets Outside The Public Repo",
  "",
  "Route packet:",
  "",
  "```text",
  `npm run outbound:stage-route-packet -- --file "${routePacketPath}" --root "${approvedRoot}"`,
  "```",
  "",
  "Named-recipient packet:",
  "",
  "```text",
  `npm run outbound:stage-named-first-10 -- --file "${namedPacketPath}" --root "${approvedRoot}"`,
  "```",
  "",
  "## After The Founder Manually Sends The Approved Batch",
  "",
  "```text",
  `npm run outbound:log-first-10-batch -- --batch "${approvedRoot}/YYYY-MM-DD_first-10-route-approvals" --root "${revenueRoot}"`,
  `npm run outbound:log-first-10-batch -- --batch "${approvedRoot}/YYYY-MM-DD_first-10-named-approvals" --root "${revenueRoot}"`,
  `npm run revenue:snapshot -- --send-root "${revenueRoot}" --output "${snapshotRoot}"`,
  "```",
  "",
  "## Safety",
  "",
  "- This session does not send email, LinkedIn messages, Slack messages, or contact-form submissions.",
  "- Do not stage or send until the exact recipients or routes and exact final messages are approved in the same turn.",
  "- Do not send until MX, SPF, DKIM, DMARC, live Stripe links, checkout QA, and public landing links pass.",
  ""
].join("\n");

const session = [
  "# MCPScan First 10 Send Session",
  "",
  "Use this only after the domain, mailbox authentication, Stripe links, public landing links, and first-send gates are live.",
  "",
  "## Review Files",
  "",
  `- Route approval packet: ${routePacketPath}`,
  `- Named-recipient approval packet: ${namedPacketPath}`,
  `- Commands: ${commandsPath}`,
  "",
  "## Same-Turn Approval Phrases",
  "",
  "Route batch:",
  "",
  "```text",
  "I approve staging all 10 exact MCPScan route outbound messages.",
  "Do not send automatically.",
  "```",
  "",
  "Named-recipient batch:",
  "",
  "```text",
  "I approve staging all 10 exact MCPScan named-recipient outbound messages.",
  "Do not send automatically.",
  "```",
  "",
  "## Operating Order",
  "",
  "1. Run the pre-send gate from NEXT_COMMANDS.md.",
  "2. Review either the route packet or named-recipient packet.",
  "3. Get same-turn approval for the exact packet.",
  "4. Stage the approved packet outside the public repo.",
  "5. Manually send only from the authenticated launch mailbox.",
  "6. Log the sent batch outside the public repo.",
  "7. Build the private revenue snapshot.",
  "",
  "## Stop Conditions",
  "",
  "- Stop if live launch gates fail.",
  "- Stop if any recipient, route, channel, or final message is not explicitly approved in the same turn.",
  "- Stop if mailbox authentication fails.",
  "- Stop if the public landing page still has placeholder checkout links.",
  "- Stop if a message asks the prospect for production secrets, active tokens, customer data, or private files over email.",
  ""
].join("\n");

fs.writeFileSync(commandsPath, commands, "utf8");
fs.writeFileSync(sessionPath, session, "utf8");

const openTargets = [
  sessionPath,
  commandsPath,
  routePacketPath,
  namedPacketPath,
  path.resolve("ops/first-10-outbound-approval-console.html"),
  path.resolve("ops/outbound-approval-queue-console.html"),
  path.resolve("ops/outbound-recipient-approval-builder.html"),
  path.resolve("ops/founder-status-console.html"),
  path.resolve("ops/revenue-cadence-console.html")
];

console.log("MCPScan first-10 send session prepared.");
console.log(workspaceDir);
console.log("");
console.log("Opening first-10 send session files and consoles:");
for (const target of openTargets) {
  const url = pathToFileURL(target).toString();
  const opened = shouldOpen ? openTarget(url) : false;
  console.log(`${opened ? "OPENED" : "COPY"} ${target}${opened ? "" : ` ${url}`}`);
}
console.log("");
console.log("Start here:");
console.log(sessionPath);
console.log("");
console.log("This command does not send, post, publish, charge, stage approval, or create customer files.");
