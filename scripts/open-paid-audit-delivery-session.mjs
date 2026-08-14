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

function today() {
  return new Date().toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    throw new Error("Refusing to create the paid delivery session inside the public MCPScan repo.");
  }
  return resolved;
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

function localUrl(file) {
  return pathToFileURL(file).toString();
}

const args = parseArgs(process.argv.slice(2));
const date = args.date ?? today();
const workspaceRoot = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Paid Delivery Sessions"));
const sessionDir = path.join(workspaceRoot, "current");
const customer = String(args.customer ?? "PAID_CUSTOMER_COMPANY").trim();
const packageName = String(args.package ?? "MCP Launch Audit").trim();
const contact = String(args.contact ?? "buyer@example.com").trim();
const paymentReference = String(args.payment ?? "pi_REPLACE_AFTER_STRIPE_CONFIRMS_PAYMENT").trim();
const safeIntakePath = String(args["safe-intake"] ?? path.join(workspaceRoot, "secure-intake", date)).trim();
const operator = String(args.operator ?? "DL").trim();
const shouldOpen = args.open !== "false" && args["no-open"] !== "true";

fs.mkdirSync(sessionDir, { recursive: true });

const packetPath = path.join(sessionDir, "approved-paid-audit-handoff.txt");
const paymentEvidencePath = path.join(sessionDir, "payment-confirmation-evidence.json");
const deliveryOutputRoot = path.join(sessionDir, "private-paid-audit-output");
const sessionMarkdownPath = path.join(sessionDir, "PAID_DELIVERY_SESSION.md");
const sessionHtmlPath = path.join(sessionDir, "PAID_DELIVERY_SESSION.html");
const nextCommandsPath = path.join(sessionDir, "NEXT_COMMANDS.md");

const handoffPacket = [
  "I approve creating this MCPScan paid audit handoff.",
  "",
  `Customer: ${customer}`,
  `Package: ${packageName}`,
  `Technical contact: ${contact}`,
  `Payment reference: ${paymentReference}`,
  `Date: ${date}`,
  "",
  "Approved action:",
  "Create the private customer workspace and first paid audit work order outside the public MCPScan repo. Do not store customer secrets in the public repo.",
  ""
].join("\n");

const paymentEvidence = {
  customerCompany: customer,
  packageName,
  amountUsd: /enterprise/i.test(packageName) ? 3500 : /quick/i.test(packageName) ? 750 : 1500,
  paymentProvider: "Stripe",
  paymentReference,
  paidAt: date,
  technicalContact: contact,
  safeIntakePath,
  paymentConfirmed: true,
  approvedForPrivateWorkspace: true,
  noStripeSecrets: true,
  noProductionSecrets: true,
  noCustomerData: true,
  noPublicRepoStorage: true,
  operatorInitials: operator,
  stripeDashboardPaymentConfirmed: false,
  stripePaidObjectType: "payment_intent"
};

fs.writeFileSync(packetPath, handoffPacket, "utf8");
fs.writeFileSync(paymentEvidencePath, `${JSON.stringify(paymentEvidence, null, 2)}\n`, "utf8");

const commands = [
  "# MCPScan Paid Delivery Next Commands",
  "",
  "1. Replace placeholder buyer values in the handoff packet and payment evidence.",
  "2. Confirm the Stripe dashboard shows a paid object. Set stripeDashboardPaymentConfirmed to true.",
  "3. Run the evidence verifier.",
  "",
  "```sh",
  `npm run delivery:verify-payment -- --file "${paymentEvidencePath}"`,
  "```",
  "",
  "4. Create the private workspace and first work order after the exact packet is approved.",
  "",
  "```sh",
  `npm run delivery:handoff -- --file "${packetPath}" --payment-evidence "${paymentEvidencePath}" --root "${deliveryOutputRoot}"`,
  "```",
  "",
  "5. Review the draft-only intake start message after the handoff creates pipeline status.",
  "",
  "```sh",
  "npm run delivery:intake-message -- --file /path/outside/public/repo/pipeline-status/YYYY-MM-DD_customer_package_pipeline-status.json",
  "```",
  "",
  "6. Run delivery proof before sending a customer report.",
  "",
  "```sh",
  "npm run delivery:verify",
  "npm run delivery:dry-run",
  "```",
  ""
].join("\n");

fs.writeFileSync(nextCommandsPath, commands, "utf8");

const localTargets = [
  ["Post-payment console", path.resolve("ops/post-payment-console.html")],
  ["Paid handoff builder", path.resolve("ops/paid-audit-handoff-builder.html")],
  ["Delivery console", path.resolve("ops/delivery-console.html")],
  ["Customer comms console", path.resolve("ops/customer-comms-console.html")],
  ["Findings call scheduler", path.resolve("ops/findings-call-scheduler.html")],
  ["Approval packet", path.resolve("sales/paid-audit-handoff-approval-packet.md")],
  ["Payment evidence template", path.resolve("sales/payment-confirmation-evidence.template.json")],
  ["Paid audit runbook", path.resolve("docs/PAID_AUDIT_RUNBOOK.md")],
  ["Payment to delivery SOP", path.resolve("docs/PAYMENT_TO_DELIVERY_SOP.md")]
];

const markdown = [
  "# MCPScan Paid Delivery Session",
  "",
  "Private session for the first paid buyer after Stripe payment is confirmed.",
  "",
  "## Files Created",
  "",
  `- Handoff packet: ${packetPath}`,
  `- Payment evidence: ${paymentEvidencePath}`,
  `- Next commands: ${nextCommandsPath}`,
  `- Private output root: ${deliveryOutputRoot}`,
  "",
  "## Required Order",
  "",
  "1. Confirm Stripe payment cleared.",
  "2. Replace placeholder customer, contact, package, payment, and safe intake values.",
  "3. Verify payment evidence.",
  "4. Create the handoff only after exact approval.",
  "5. Send only the approved draft intake message.",
  "6. Keep customer material outside the public repo.",
  "",
  "## Stop Conditions",
  "",
  "- Payment is only a Payment Link.",
  "- Stripe dashboard does not show a paid object.",
  "- Customer asks to send production secrets through email or a public issue.",
  "- Exact recipient and exact final intake content have not been approved.",
  "- Any output path points inside the public MCPScan repo.",
  "",
  "This session does not charge, message, send, create live customer files, or bypass payment evidence.",
  ""
].join("\n");

fs.writeFileSync(sessionMarkdownPath, markdown, "utf8");

const targetLinks = localTargets.map(([label, target]) => `<a class="button" href="${escapeHtml(localUrl(target))}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`).join("");
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MCPScan Paid Delivery Session</title>
    <style>
      :root { color-scheme: light; --ink: #172026; --muted: #5f6b74; --line: #d9e2e8; --panel: #f7fafc; --accent: #0f766e; --accent-dark: #115e59; --warn: #8a4b05; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: #ffffff; }
      main { max-width: 1120px; margin: 0 auto; padding: 28px; }
      header { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; border-bottom: 1px solid var(--line); padding-bottom: 20px; }
      h1 { font-size: 30px; line-height: 1.15; margin: 0 0 8px; letter-spacing: 0; }
      h2 { font-size: 17px; margin: 0 0 12px; letter-spacing: 0; }
      p { color: var(--muted); line-height: 1.5; margin: 0; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 18px; }
      .panel { border: 1px solid var(--line); border-radius: 8px; padding: 16px; background: var(--panel); }
      .actions { display: flex; flex-wrap: wrap; gap: 8px; }
      .button, button { border: 1px solid var(--accent); background: #ffffff; color: var(--accent-dark); border-radius: 6px; padding: 9px 11px; text-decoration: none; font-size: 14px; font-weight: 650; cursor: pointer; }
      .primary { background: var(--accent); color: #ffffff; }
      pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #0f172a; color: #e5edf5; border-radius: 8px; padding: 14px; font-size: 13px; line-height: 1.45; }
      ol, ul { margin: 0; padding-left: 20px; color: var(--ink); line-height: 1.5; }
      li + li { margin-top: 6px; }
      .warn { color: var(--warn); font-weight: 700; }
      @media (max-width: 760px) { main { padding: 18px; } header, .grid { display: block; } .panel { margin-top: 14px; } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <h1>Paid Delivery Session</h1>
          <p>Use this after Stripe confirms payment. It keeps buyer handoff, intake, workspace creation, and proof commands in one private local cockpit.</p>
        </div>
        <a class="button primary" href="${escapeHtml(localUrl(nextCommandsPath))}" target="_blank" rel="noreferrer">Open Commands</a>
      </header>
      <section class="grid">
        <div class="panel">
          <h2>Session Files</h2>
          <div class="actions">
            <a class="button" href="${escapeHtml(localUrl(packetPath))}" target="_blank" rel="noreferrer">Handoff Packet</a>
            <a class="button" href="${escapeHtml(localUrl(paymentEvidencePath))}" target="_blank" rel="noreferrer">Payment Evidence</a>
            <a class="button" href="${escapeHtml(localUrl(sessionMarkdownPath))}" target="_blank" rel="noreferrer">Session Sheet</a>
          </div>
        </div>
        <div class="panel">
          <h2>Delivery Surfaces</h2>
          <div class="actions">${targetLinks}</div>
        </div>
        <div class="panel">
          <h2>Order</h2>
          <ol>
            <li>Confirm Stripe shows a paid object.</li>
            <li>Replace placeholders in the packet and evidence.</li>
            <li>Verify payment evidence.</li>
            <li>Create private handoff after exact approval.</li>
            <li>Review intake and deliver only after workspace QA.</li>
          </ol>
        </div>
        <div class="panel">
          <h2>Stop Conditions</h2>
          <ul>
            <li>Payment reference is only a Payment Link.</li>
            <li>Payment evidence includes secrets or customer data.</li>
            <li>Output path is inside the public MCPScan repo.</li>
            <li>Exact intake recipient and final text are not approved.</li>
          </ul>
        </div>
      </section>
      <section class="panel" style="margin-top:16px">
        <h2>Copy Commands</h2>
        <button data-copy="commands">Copy</button>
        <pre id="commands">${escapeHtml(commands)}</pre>
      </section>
      <p class="warn" style="margin-top:14px">This session does not charge, message, send, create live customer files, or bypass payment evidence.</p>
    </main>
    <script>
      document.querySelectorAll("[data-copy]").forEach((button) => {
        button.addEventListener("click", async () => {
          const target = document.getElementById(button.dataset.copy);
          await navigator.clipboard.writeText(target.textContent);
          button.textContent = "Copied";
          setTimeout(() => { button.textContent = "Copy"; }, 1200);
        });
      });
    </script>
  </body>
</html>
`;

fs.writeFileSync(sessionHtmlPath, html, "utf8");

console.log("MCPScan paid delivery session");
console.log("");
console.log(`Created private session: ${sessionDir}`);
console.log(`Start here: ${sessionHtmlPath}`);

if (shouldOpen) {
  const targets = [sessionHtmlPath, sessionMarkdownPath, nextCommandsPath, ...localTargets.map(([, target]) => target)];
  console.log("");
  console.log("Opening delivery session files and consoles:");
  for (const target of targets) {
    const url = localUrl(target);
    const opened = openTarget(url);
    console.log(`${opened ? "OPENED" : "COPY"} ${target}${opened ? "" : ` ${url}`}`);
  }
}

console.log("");
console.log("This command does not charge, message, send, create live customer files, or bypass payment evidence.");
