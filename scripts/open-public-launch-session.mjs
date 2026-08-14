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

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    throw new Error("Refusing to create the public launch session inside the public MCPScan repo.");
  }
  return resolved;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function localUrl(file) {
  return pathToFileURL(file).toString();
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
const date = args.date ?? today();
const workspaceRoot = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Public Launch Session"));
const sessionDir = path.join(workspaceRoot, "current");
const channel = String(args.channel ?? "LinkedIn founder post").trim();
const postTitle = String(args.title ?? "MCP risk is delegated authority without inspection").trim();
const postUrl = String(args.url ?? "https://www.linkedin.com/").trim();
const publicUrl = String(args["public-url"] ?? "https://davidleeops.github.io/mcpscan/").trim();
const shouldOpen = args.open !== "false" && args["no-open"] !== "true";

fs.mkdirSync(sessionDir, { recursive: true });

const approvalPacketPath = path.join(sessionDir, "approved-public-launch-post.txt");
const sessionMarkdownPath = path.join(sessionDir, "PUBLIC_LAUNCH_SESSION.md");
const sessionHtmlPath = path.join(sessionDir, "PUBLIC_LAUNCH_SESSION.html");
const nextCommandsPath = path.join(sessionDir, "NEXT_COMMANDS.md");

const finalPost = [
  "The MCP risk I keep coming back to is not just prompt injection.",
  "",
  "It is delegated authority without inspection.",
  "",
  "Teams are connecting agents to code, tickets, docs, SaaS actions, internal workflows, and customer data. Before that becomes normal operating procedure, they need a clear answer to a simple question:",
  "",
  "What can this agent actually reach or do?",
  "",
  "I built MCPScan as a fixed-scope MCP Launch Audit:",
  "",
  "- server and tool inventory",
  "- read, write, and destructive action classification",
  "- auth and secret-handling review",
  "- prompt-injection and tool-description risk review",
  "- remediation checklist",
  "- buyer-safe report",
  "",
  "Best fit: teams turning on Copilot, Claude Code, Cursor, VS Code agent mode, Slack MCP, Atlassian Rovo, or custom MCP servers.",
  "",
  `Sample report and scope: ${publicUrl}`
].join("\n");

const approvalPacket = [
  "I approve staging this exact MCPScan public launch post.",
  "",
  `Channel: ${channel}`,
  `Post title: ${postTitle}`,
  `Post URL: ${postUrl}`,
  "",
  "Final post:",
  finalPost,
  "",
  "Approved action:",
  "Stage this public launch post outside the public repo for manual publishing review. Do not publish automatically.",
  ""
].join("\n");

fs.writeFileSync(approvalPacketPath, approvalPacket, "utf8");

const commands = [
  "# MCPScan Public Launch Next Commands",
  "",
  "Before asking for approval:",
  "",
  "```sh",
  "npm run market:verify",
  "npm run gtm:verify",
  "npm run launch:verify",
  "```",
  "",
  "After exact same-turn approval:",
  "",
  "```sh",
  `npm run launch:stage-public-post -- --file "${approvalPacketPath}"`,
  "```",
  "",
  "Before manual publishing:",
  "",
  "```sh",
  "npm run launch:status:live",
  "```",
  ""
].join("\n");

fs.writeFileSync(nextCommandsPath, commands, "utf8");

const localTargets = [
  ["Public drafts console", path.resolve("ops/public-channel-drafts-console.html")],
  ["GTM placement console", path.resolve("ops/gtm-placement-console.html")],
  ["Market research console", path.resolve("ops/market-research-refresh-console.html")],
  ["Verification console", path.resolve("ops/verification-console.html")],
  ["First revenue battlecard", path.resolve("ops/first-revenue-battlecard.html")],
  ["Public post approval guide", path.resolve("docs/PUBLIC_LAUNCH_POST_APPROVAL.md")],
  ["Channel draft pack", path.resolve("docs/PUBLIC_CHANNEL_LAUNCH_DRAFTS_2026-08-14.md")],
  ["Market placement brief", path.resolve("docs/FIRST_REVENUE_CHANNEL_PLACEMENT_2026-08-14.md")],
  ["GTM claim safety", path.resolve("docs/GTM_CLAIM_SAFETY.md")]
];

const externalTargets = [
  ["Public landing", publicUrl],
  ["LinkedIn", "https://www.linkedin.com/"],
  ["Hacker News submit", "https://news.ycombinator.com/submit"],
  ["Reddit r/mcp", "https://www.reddit.com/r/mcp/"],
  ["Product Hunt new post", "https://www.producthunt.com/posts/new"]
];

const markdown = [
  "# MCPScan Public Launch Session",
  "",
  "Private public-launch cockpit for staging one approved public post without publishing.",
  "",
  "## Files Created",
  "",
  `- Approval packet: ${approvalPacketPath}`,
  `- Next commands: ${nextCommandsPath}`,
  `- Session page: ${sessionHtmlPath}`,
  "",
  "## Required Order",
  "",
  "1. Verify market evidence, GTM claims, and launch readiness.",
  "2. Review the exact channel, URL, title, and final post text.",
  "3. Get same-turn approval for the exact post.",
  "4. Stage the post outside the public repo.",
  "5. Publish manually only after live status is acceptable.",
  "",
  "## Stop Conditions",
  "",
  "- Domain, checkout, security contact, terms, privacy, refund policy, or sample report are not live.",
  "- The community does not allow promotion.",
  "- The post claims certification, guaranteed security, complete coverage, or a vulnerability in a named company.",
  "- Exact channel, exact URL, and exact final text are not approved in the same turn.",
  "",
  "This command opens local proof and public channel pages only. It does not post, publish, submit, comment, message, stage approval, charge, or create customer files.",
  ""
].join("\n");

fs.writeFileSync(sessionMarkdownPath, markdown, "utf8");

const localLinks = localTargets.map(([label, target]) => `<a class="button" href="${escapeHtml(localUrl(target))}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`).join("");
const externalLinks = externalTargets.map(([label, target]) => `<a class="button" href="${escapeHtml(target)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`).join("");
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MCPScan Public Launch Session</title>
    <style>
      :root { color-scheme: light; --ink: #172026; --muted: #5f6b74; --line: #d9e2e8; --panel: #ffffff; --soft: #f6f8fb; --accent: #2457c5; --warn: #8a4b05; --good: #0f7b4f; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--soft); }
      main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 30px 0 48px; }
      header { display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; }
      h1 { font-size: 34px; line-height: 1.1; margin: 0 0 8px; letter-spacing: 0; }
      h2 { font-size: 18px; margin: 0 0 12px; letter-spacing: 0; }
      p, li { color: var(--muted); line-height: 1.5; }
      section { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; margin-top: 16px; padding: 18px; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
      .warn { border-left: 4px solid var(--warn); background: #fff9ec; }
      .ready { border-left: 4px solid var(--good); background: #f3fbf6; }
      .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      a.button, button { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; border: 1px solid var(--accent); border-radius: 7px; padding: 9px 12px; color: var(--accent); background: #ffffff; font-weight: 700; text-decoration: none; cursor: pointer; }
      .primary { background: var(--accent); color: #ffffff; }
      pre { margin: 10px 0 0; overflow: auto; white-space: pre-wrap; background: #101820; color: #eef6ff; border-radius: 8px; padding: 12px; line-height: 1.45; font-size: 12px; }
      @media (max-width: 760px) { main { width: min(100% - 20px, 1120px); padding-top: 18px; } header, .grid { display: block; } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <h1>Public Launch Session</h1>
          <p>Stage one approved public post without publishing. Start with the generated approval packet, verify claim safety, then manually publish only after live launch gates pass.</p>
        </div>
        <a class="button primary" href="${escapeHtml(localUrl(approvalPacketPath))}" target="_blank" rel="noreferrer">Approval Packet</a>
      </header>
      <section class="grid">
        <div>
          <h2>Local Proof</h2>
          <div class="actions">
            <a class="button" href="${escapeHtml(localUrl(nextCommandsPath))}" target="_blank" rel="noreferrer">Next Commands</a>
            <a class="button" href="${escapeHtml(localUrl(sessionMarkdownPath))}" target="_blank" rel="noreferrer">Session Sheet</a>
          </div>
          <div class="actions">${localLinks}</div>
        </div>
        <div>
          <h2>Public Channels</h2>
          <div class="actions">${externalLinks}</div>
        </div>
      </section>
      <section class="ready">
        <h2>Copy Commands</h2>
        <button data-copy="commands">Copy</button>
        <pre id="commands">${escapeHtml(commands)}</pre>
      </section>
      <section>
        <h2>Approval Packet</h2>
        <button data-copy="packet">Copy</button>
        <pre id="packet">${escapeHtml(approvalPacket)}</pre>
      </section>
      <section class="warn">
        <h2>Stop Conditions</h2>
        <ul>
          <li>Do not post before domain, checkout, security contact, terms, privacy, refund policy, and sample report are live.</li>
          <li>Do not publish in communities where promotion is not allowed.</li>
          <li>Do not claim certification, guaranteed security, complete coverage, or vulnerabilities in named companies.</li>
          <li>Do not publish without same-turn approval for the exact channel, URL, and final text.</li>
        </ul>
      </section>
    </main>
    <script>
      document.querySelectorAll("[data-copy]").forEach((button) => {
        button.addEventListener("click", async () => {
          const target = document.getElementById(button.dataset.copy);
          await navigator.clipboard.writeText(target.textContent.trim());
          button.textContent = "Copied";
          setTimeout(() => { button.textContent = "Copy"; }, 1200);
        });
      });
    </script>
  </body>
</html>
`;

fs.writeFileSync(sessionHtmlPath, html, "utf8");

console.log("MCPScan public launch session");
console.log("");
console.log(`Created private session: ${sessionDir}`);
console.log(`Start here: ${sessionHtmlPath}`);

if (shouldOpen) {
  const localOpenTargets = [sessionHtmlPath, approvalPacketPath, nextCommandsPath, sessionMarkdownPath, ...localTargets.map(([, target]) => target)];
  console.log("");
  console.log("Opening public launch session files and channel links:");
  for (const target of localOpenTargets) {
    const url = localUrl(target);
    const opened = openTarget(url);
    console.log(`${opened ? "OPENED" : "COPY"} ${target}${opened ? "" : ` ${url}`}`);
  }
  for (const [, target] of externalTargets) {
    const opened = openTarget(target);
    console.log(`${opened ? "OPENED" : "COPY"} ${target}`);
  }
}

console.log("");
console.log("This command opens local proof and public channel pages only. It does not post, publish, submit, comment, message, stage approval, charge, or create customer files.");
