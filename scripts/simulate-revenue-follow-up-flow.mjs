#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-revenue-flow-"));
const approvalFile = path.join(sandbox, "approved-first-10-route-packet.txt");
const approvalRoot = path.join(sandbox, "outbound-approvals");
const revenueRoot = path.join(sandbox, "revenue-logs");
const snapshotRoot = path.join(sandbox, "revenue-snapshots");
const followUpPacket = path.join(sandbox, "follow-up-approval.txt");
const routePacket = path.join(root, "sales/first-10-route-approval-packet-2026-08-14.md");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(label, args) {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: "utf8" });
  if (result.stdout.trim()) console.log(result.stdout.trim());
  if (result.stderr.trim()) console.error(result.stderr.trim());
  if (result.status !== 0) {
    throw new Error(`${label} failed with status ${result.status}`);
  }
}

function findFiles(start, fileName) {
  const files = [];
  function walk(entry) {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry)) walk(path.join(entry, child));
      return;
    }
    if (stat.isFile() && path.basename(entry) === fileName) files.push(entry);
  }
  walk(start);
  return files.sort((a, b) => a.localeCompare(b));
}

fs.writeFileSync(approvalFile, read(routePacket), "utf8");

run("stage first-10 route packet", [
  "scripts/stage-approved-route-packet.mjs",
  "--file",
  approvalFile,
  "--root",
  approvalRoot,
  "--date",
  "2026-08-14"
]);

const batchDir = path.join(approvalRoot, "2026-08-14_first-10-route-approvals");
assert(fs.existsSync(path.join(batchDir, "batch-manifest.json")), "route batch manifest was not created");

run("log first-10 route sends", [
  "scripts/log-approved-route-batch-sends.mjs",
  "--batch",
  batchDir,
  "--root",
  revenueRoot,
  "--date",
  "2026-08-14"
]);

const sendLogs = findFiles(revenueRoot, "send-log.json");
assert(sendLogs.length === 10, `expected 10 send logs, found ${sendLogs.length}`);

run("build revenue snapshot", [
  "scripts/build-revenue-snapshot.mjs",
  "--send-root",
  revenueRoot,
  "--paid-root",
  path.join(sandbox, "paid-audits"),
  "--output",
  snapshotRoot,
  "--date",
  "2026-08-18"
]);

const snapshotFile = path.join(snapshotRoot, "2026-08-18", "revenue-snapshot.json");
assert(fs.existsSync(snapshotFile), "revenue snapshot was not created");
const snapshot = JSON.parse(read(snapshotFile));
assert(snapshot.totals.manualSendsLogged === 10, "snapshot did not count 10 manual sends");
assert(snapshot.totals.dueFollowUps === 10, "snapshot did not find 10 due first follow-ups");
assert(snapshot.dueFollowUps.every((item) => item.followUpStep === "follow-up-1"), "snapshot due list must contain first follow-ups only");

run("compose follow-up approval", [
  "scripts/compose-follow-up-approval.mjs",
  "--file",
  sendLogs[0],
  "--step",
  "follow-up-1",
  "--sender",
  "David",
  "--output",
  followUpPacket
]);

const followUp = read(followUpPacket);
assert(followUp.includes("I approve staging this exact MCPScan outbound message."), "follow-up approval phrase is missing");
assert(followUp.includes("Do not send automatically."), "follow-up no-auto-send guard is missing");
assert(followUp.includes("Follow-up step: follow-up-1"), "follow-up step marker is missing");

fs.rmSync(sandbox, { recursive: true, force: true });

console.log("Revenue follow-up flow simulation passed.");
