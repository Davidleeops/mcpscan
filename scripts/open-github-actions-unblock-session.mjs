#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const repo = "Davidleeops/mcpscan";
const workflowNames = ["CI", "Deploy Landing Page"];

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

function assertOutsideRepo(target) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    throw new Error("Refusing to create the GitHub Actions unblock session inside the public MCPScan repo.");
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

function runJson(args) {
  const raw = execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return JSON.parse(raw);
}

function sampleRuns() {
  return workflowNames.map((workflowName, index) => ({
    workflowName,
    databaseId: 90000000000 + index,
    displayTitle: "Sample failed run",
    headSha: "sample",
    status: "completed",
    conclusion: "failure",
    createdAt: "2026-08-14T00:00:00Z",
    url: `https://github.com/${repo}/actions/runs/${90000000000 + index}`,
    jobs: [
      {
        name: workflowName === "CI" ? "test" : "deploy",
        conclusion: "failure",
        status: "completed",
        steps: []
      }
    ]
  }));
}

function latestFailedRun(workflowName) {
  const runs = runJson([
    "run",
    "list",
    "--repo",
    repo,
    "--branch",
    "main",
    "--workflow",
    workflowName,
    "--limit",
    "5",
    "--json",
    "databaseId,workflowName,displayTitle,headSha,status,conclusion,createdAt,url"
  ]);
  return runs.find((run) => run.status === "completed" && run.conclusion === "failure") ?? null;
}

function viewRun(run) {
  const details = runJson([
    "run",
    "view",
    String(run.databaseId),
    "--repo",
    repo,
    "--json",
    "databaseId,status,conclusion,jobs,url,headSha,displayTitle,workflowName"
  ]);
  return { ...run, ...details };
}

function liveRuns() {
  return workflowNames
    .map((workflowName) => latestFailedRun(workflowName))
    .filter(Boolean)
    .map(viewRun);
}

const args = parseArgs(process.argv.slice(2));
const shouldOpen = args.open !== "false" && args["no-open"] !== "true";
const sessionRoot = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan GitHub Actions Unblock"));
const sessionDir = path.join(sessionRoot, "current");
fs.mkdirSync(sessionDir, { recursive: true });

const runs = args.sample === "true" ? sampleRuns() : liveRuns();
const runsPath = path.join(sessionDir, "ACTIONS_RUNS.json");
const markdownPath = path.join(sessionDir, "ACTIONS_UNBLOCK_SESSION.md");
const htmlPath = path.join(sessionDir, "ACTIONS_UNBLOCK_SESSION.html");
const commandsPath = path.join(sessionDir, "NEXT_COMMANDS.md");

const beforeStepFailures = runs.filter((run) => run.jobs?.some((job) => Array.isArray(job.steps) && job.steps.length === 0 && job.conclusion === "failure"));

const commands = [
  "# MCPScan GitHub Actions Unblock Commands",
  "",
  "Run this before the account click to confirm the target runs:",
  "",
  "```sh",
  "npm run launch:rerun-actions -- --dry-run",
  "```",
  "",
  "Run this after GitHub billing is fixed:",
  "",
  "```sh",
  "npm run launch:rerun-actions",
  "```",
  "",
  "Keep local proof available while GitHub Actions is locked:",
  "",
  "```sh",
  "npm run launch:full-proof",
  "npm run launch:rehearsal",
  "npm run writing:check",
  "```",
  ""
].join("\n");

const markdown = [
  "# MCPScan GitHub Actions Unblock Session",
  "",
  "Private session for the GitHub account-side Actions lock.",
  "",
  "## Current Evidence",
  "",
  `- Failed workflows found: ${runs.length}`,
  `- Failed before project steps: ${beforeStepFailures.length}`,
  `- Run evidence file: ${runsPath}`,
  "",
  "## Founder Clicks",
  "",
  "1. Open GitHub billing for the account or organization that owns Davidleeops/mcpscan.",
  "2. Resolve the billing lock or update the payment method.",
  "3. Open MCPScan Actions.",
  "4. Re-run CI and Deploy Landing Page.",
  "5. If Codex has terminal access after billing is fixed, run npm run launch:rerun-actions.",
  "",
  "## Stop Conditions",
  "",
  "- Do not paste payment card details, billing address details, recovery codes, tokens, or passwords into repo files.",
  "- Do not change repo code to hide the GitHub account lock.",
  "- If a rerun reaches repo steps and then fails, inspect job logs instead of treating it as billing.",
  "",
  "This command opens account pages and local proof only. It does not change billing, rerun workflows, commit code, publish, send, charge, or create customer files.",
  ""
].join("\n");

fs.writeFileSync(runsPath, `${JSON.stringify({ repo, generatedAt: new Date().toISOString(), runs }, null, 2)}\n`, "utf8");
fs.writeFileSync(commandsPath, commands, "utf8");
fs.writeFileSync(markdownPath, markdown, "utf8");

const runRows = runs.length > 0
  ? runs.map((run) => {
    const emptySteps = run.jobs?.some((job) => Array.isArray(job.steps) && job.steps.length === 0 && job.conclusion === "failure");
    return `<tr><td>${escapeHtml(run.workflowName)}</td><td>${escapeHtml(run.conclusion ?? run.status)}</td><td>${escapeHtml(emptySteps ? "failed before steps" : "inspect logs")}</td><td><a href="${escapeHtml(run.url)}" target="_blank" rel="noreferrer">${escapeHtml(String(run.databaseId))}</a></td></tr>`;
  }).join("")
  : `<tr><td colspan="4">No failed main-branch CI or Deploy Landing Page runs were found.</td></tr>`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MCPScan GitHub Actions Unblock Session</title>
    <style>
      :root { color-scheme: light; --ink: #151719; --muted: #5b6470; --line: #d7dde3; --panel: #ffffff; --soft: #f5f7f9; --accent: #0b6bcb; --warn: #9a5a00; --good: #0f7b4f; }
      * { box-sizing: border-box; }
      body { margin: 0; color: var(--ink); background: var(--soft); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      main { width: min(1080px, calc(100% - 32px)); margin: 0 auto; padding: 30px 0 48px; }
      h1 { font-size: 34px; line-height: 1.1; margin: 0 0 8px; letter-spacing: 0; }
      h2 { font-size: 18px; margin: 0 0 12px; letter-spacing: 0; }
      p, li, td, th { color: var(--muted); line-height: 1.5; }
      section { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; margin-top: 16px; padding: 18px; }
      .warn { border-left: 4px solid var(--warn); background: #fff9ec; }
      .ready { border-left: 4px solid var(--good); background: #f3fbf6; }
      .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      a.button, button { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; border: 1px solid var(--accent); border-radius: 7px; padding: 9px 12px; color: var(--accent); background: #ffffff; font-weight: 700; text-decoration: none; cursor: pointer; }
      pre { margin: 10px 0 0; overflow: auto; white-space: pre-wrap; background: #101820; color: #eef6ff; border-radius: 8px; padding: 12px; line-height: 1.45; font-size: 12px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border-bottom: 1px solid var(--line); padding: 8px; text-align: left; vertical-align: top; }
      @media (max-width: 760px) { main { width: min(100% - 20px, 1080px); padding-top: 18px; } table { display: block; overflow-x: auto; } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>GitHub Actions Unblock Session</h1>
        <p>Use this only for the account-side billing lock where GitHub fails CI or deploy before project steps start.</p>
      </header>
      <section class="warn">
        <h2>Founder Clicks</h2>
        <ol>
          <li>Open billing for the account or organization that owns Davidleeops/mcpscan.</li>
          <li>Resolve the billing lock or update the payment method.</li>
          <li>Return to Actions and rerun CI and Deploy Landing Page.</li>
          <li>After billing is fixed, run the rerun command below.</li>
        </ol>
        <div class="actions">
          <a class="button" href="https://github.com/settings/billing" target="_blank" rel="noreferrer">GitHub Billing</a>
          <a class="button" href="https://github.com/Davidleeops/mcpscan/actions" target="_blank" rel="noreferrer">MCPScan Actions</a>
          <a class="button" href="${escapeHtml(localUrl(commandsPath))}" target="_blank" rel="noreferrer">Next Commands</a>
          <a class="button" href="${escapeHtml(localUrl(runsPath))}" target="_blank" rel="noreferrer">Run Evidence</a>
        </div>
      </section>
      <section>
        <h2>Failed Runs</h2>
        <table>
          <thead><tr><th>Workflow</th><th>Conclusion</th><th>Diagnosis</th><th>Run</th></tr></thead>
          <tbody>${runRows}</tbody>
        </table>
      </section>
      <section class="ready">
        <h2>Copy Commands</h2>
        <button data-copy="commands">Copy</button>
        <pre id="commands">${escapeHtml(commands)}</pre>
      </section>
      <section>
        <h2>Stop Conditions</h2>
        <ul>
          <li>Do not paste billing secrets, card details, recovery codes, tokens, or passwords into repo files.</li>
          <li>Do not change project code to mask an account lock.</li>
          <li>If jobs reach repo steps and fail, inspect job logs next.</li>
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

fs.writeFileSync(htmlPath, html, "utf8");

console.log("MCPScan GitHub Actions unblock session");
console.log("");
console.log(`Created private session: ${sessionDir}`);
console.log(`Start here: ${htmlPath}`);
console.log(`Failed workflows found: ${runs.length}`);
console.log(`Failed before project steps: ${beforeStepFailures.length}`);

if (shouldOpen) {
  const localTargets = [
    htmlPath,
    markdownPath,
    commandsPath,
    runsPath,
    path.resolve("ops/github-actions-billing-console.html"),
    path.resolve("docs/GITHUB_ACTIONS_BILLING_UNBLOCK.md")
  ];
  const externalTargets = [
    "https://github.com/settings/billing",
    "https://github.com/Davidleeops/mcpscan/actions",
    ...runs.map((run) => run.url)
  ];
  console.log("");
  console.log("Opening unblock session files and account links:");
  for (const target of localTargets) {
    const url = localUrl(target);
    const opened = openTarget(url);
    console.log(`${opened ? "OPENED" : "COPY"} ${target}${opened ? "" : ` ${url}`}`);
  }
  for (const target of externalTargets) {
    const opened = openTarget(target);
    console.log(`${opened ? "OPENED" : "COPY"} ${target}`);
  }
}

console.log("");
console.log("This command opens account pages and local proof only. It does not change billing, rerun workflows, commit code, publish, send, charge, or create customer files.");
