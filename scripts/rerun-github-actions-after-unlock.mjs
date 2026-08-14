#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";

const repo = "Davidleeops/mcpscan";
const workflows = ["CI", "Deploy Landing Page"];
const dryRun = process.argv.includes("--dry-run");
const wait = !process.argv.includes("--no-wait");

function runJson(args) {
  const raw = execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return JSON.parse(raw);
}

function runGh(args) {
  const result = spawnSync("gh", args, { encoding: "utf8" });
  if (result.stdout.trim()) console.log(result.stdout.trim());
  if (result.stderr.trim()) console.error(result.stderr.trim());
  if (result.status !== 0) {
    throw new Error(`gh ${args.join(" ")} failed`);
  }
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
    "10",
    "--json",
    "databaseId,workflowName,displayTitle,headSha,status,conclusion,createdAt,url"
  ]);
  return runs.find((run) => run.status === "completed" && run.conclusion === "failure") || null;
}

function latestRunForWorkflow(workflowName, previousId) {
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
  return runs.find((run) => run.databaseId !== previousId) || runs[0] || null;
}

function viewRun(id) {
  return runJson([
    "run",
    "view",
    String(id),
    "--repo",
    repo,
    "--json",
    "databaseId,status,conclusion,jobs,url,headSha,displayTitle,workflowName"
  ]);
}

function summarizeRun(run) {
  const view = viewRun(run.databaseId);
  const failedBeforeSteps = view.jobs?.some((job) => job.conclusion === "failure" && Array.isArray(job.steps) && job.steps.length === 0);
  const failedWithSteps = view.jobs?.some((job) => job.conclusion === "failure" && Array.isArray(job.steps) && job.steps.length > 0);
  console.log("");
  console.log(`${view.workflowName}: ${view.status} ${view.conclusion || "pending"}`);
  console.log(view.url);
  if (failedBeforeSteps) console.log("Result: failed before repo steps started. GitHub account or billing lock is still likely active.");
  if (failedWithSteps) console.log("Result: workflow reached repo steps. Inspect failing job logs next.");
  if (view.conclusion === "success") console.log("Result: passed.");
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function waitForWorkflow(workflowName, previousId) {
  const startedAt = Date.now();
  const timeoutMs = 15 * 60 * 1000;
  let seen = null;
  while (Date.now() - startedAt < timeoutMs) {
    const run = latestRunForWorkflow(workflowName, previousId);
    if (run) seen = run;
    if (run && run.status === "completed") return run;
    const status = run ? `${run.status} ${run.conclusion || ""}`.trim() : "waiting for new run";
    console.log(`${workflowName}: ${status}`);
    sleep(15000);
  }
  if (seen) return seen;
  throw new Error(`Timed out waiting for ${workflowName}`);
}

const targets = [];
for (const workflow of workflows) {
  const run = latestFailedRun(workflow);
  if (!run) {
    console.log(`${workflow}: no failed main-branch run found to re-run.`);
    continue;
  }
  targets.push(run);
  console.log(`${workflow}: latest failed run ${run.databaseId} ${run.url}`);
}

if (targets.length === 0) {
  console.log("No failed GitHub Actions runs found.");
  process.exit(0);
}

if (dryRun) {
  console.log("");
  console.log("Dry run only. No workflows were re-run.");
  process.exit(0);
}

for (const run of targets) {
  console.log("");
  console.log(`Re-running ${run.workflowName} run ${run.databaseId}`);
  runGh(["run", "rerun", String(run.databaseId), "--repo", repo]);
}

if (!wait) {
  console.log("");
  console.log("Re-runs requested. Use npm run launch:status:live to check later.");
  process.exit(0);
}

for (const target of targets) {
  const completed = waitForWorkflow(target.workflowName, target.databaseId);
  summarizeRun(completed);
}
