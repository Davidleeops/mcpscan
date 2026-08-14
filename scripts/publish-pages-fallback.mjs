#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const repo = "Davidleeops/mcpscan";
const branch = "gh-pages";
const tempBranch = `codex-pages-publish-${Date.now()}`;
const freshnessMarkers = [
  "Free scanners produce signals",
  "customer is authorized to submit",
  "MCP Launch Audit"
];

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

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit"
  });
  if (result.status !== 0) {
    if (options.capture) {
      process.stdout.write(result.stdout ?? "");
      process.stderr.write(result.stderr ?? "");
    }
    fail(`${command} ${args.join(" ")} failed`);
  }
  return result;
}

function output(command, args, cwd = root) {
  return execFileSync(command, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function clearWorktree(target) {
  for (const entry of fs.readdirSync(target)) {
    if (entry === ".git") continue;
    fs.rmSync(path.join(target, entry), { recursive: true, force: true });
  }
}

function verifyLanding() {
  const landing = path.join(root, "landing");
  const index = path.join(landing, "index.html");
  if (!fs.existsSync(index)) fail("landing/index.html is missing.");
  const text = fs.readFileSync(index, "utf8");
  const missing = freshnessMarkers.filter((marker) => !text.includes(marker));
  if (missing.length > 0) fail(`landing/index.html is missing freshness marker(s): ${missing.join(", ")}`);
}

function verifyGhPagesSettings() {
  const raw = output("gh", ["api", `repos/${repo}/pages`]);
  const pages = JSON.parse(raw);
  if (pages.build_type !== "legacy" || pages.source?.branch !== branch || pages.source?.path !== "/") {
    run("gh", ["api", "-X", "PUT", `repos/${repo}/pages`, "-F", "build_type=legacy", "-F", "source[branch]=gh-pages", "-F", "source[path]=/", "--silent"]);
  }
}

function triggerBuild() {
  run("gh", ["api", "-X", "POST", `repos/${repo}/pages/builds`, "--silent"]);
}

function waitForBuild() {
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    const raw = output("gh", ["api", `repos/${repo}/pages/builds`]);
    const builds = JSON.parse(raw);
    const latest = builds[0];
    const status = latest?.status ?? "unknown";
    console.log(`Pages fallback build attempt ${attempt}: ${status}`);
    if (status === "built") return;
    if (status === "errored") fail("Pages fallback build errored.");
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);
  }
  fail("Pages fallback build did not complete in time.");
}

const args = parseArgs(process.argv.slice(2));
const message = args.message ?? "Publish static landing fallback";

verifyLanding();
run("npm", ["run", "writing:check"]);
run("npm", ["run", "launch:bundle"]);

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-gh-pages."));
const worktree = path.join(tempRoot, "worktree");

try {
  run("git", ["worktree", "add", "--detach", worktree, "HEAD"]);
  run("git", ["switch", "--orphan", tempBranch], { cwd: worktree });
  spawnSync("git", ["rm", "-rf", "."], { cwd: worktree, stdio: "ignore" });
  clearWorktree(worktree);
  copyDir(path.join(root, "landing"), worktree);
  fs.writeFileSync(path.join(worktree, ".nojekyll"), "");
  run("git", ["add", "."], { cwd: worktree });

  const diff = spawnSync("git", ["diff", "--cached", "--quiet"], { cwd: worktree });
  if (diff.status === 0) {
    console.log("No gh-pages fallback changes to publish.");
  } else {
    run("git", ["commit", "-m", message], { cwd: worktree });
    run("git", ["push", "--force-with-lease", "origin", `HEAD:${branch}`], { cwd: worktree });
  }

  verifyGhPagesSettings();
  triggerBuild();
  if (args.wait === "true") waitForBuild();
} finally {
  run("git", ["worktree", "remove", worktree, "--force"], { capture: true });
  spawnSync("git", ["branch", "-D", tempBranch], { cwd: root, stdio: "ignore" });
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log("Published MCPScan Pages fallback.");
console.log("https://davidleeops.github.io/mcpscan/");
