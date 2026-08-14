#!/usr/bin/env node
import { spawnSync } from "node:child_process";
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

function assertOutsideRepo(target, label) {
  const resolved = path.resolve(target);
  if (resolved === root || resolved.startsWith(root + path.sep)) {
    fail(`Refusing to read or write ${label} inside the public MCPScan repo.`);
  }
  return resolved;
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function findManifests(start) {
  const manifests = [];
  function walk(entry) {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry)) walk(path.join(entry, child));
      return;
    }
    if (stat.isFile() && path.basename(entry) === "manifest.json") manifests.push(entry);
  }
  walk(start);
  return manifests.sort((a, b) => a.localeCompare(b));
}

function runLogger(manifest, outputRoot, date) {
  const args = [
    "scripts/log-approved-send.mjs",
    "--manifest",
    manifest,
    "--root",
    outputRoot
  ];
  if (date) args.push("--date", date);
  const child = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (child.status !== 0) process.exit(child.status ?? 1);
}

const args = parseArgs(process.argv.slice(2));
if (!args.batch) fail("Missing --batch path to a staged first-10 route approval batch.");

const batchDir = assertOutsideRepo(args.batch, "approved route batch");
const outputRoot = assertOutsideRepo(args.root ?? path.join(os.homedir(), "MCPScan Revenue Logs"), "revenue logs");
const date = args.date;
if (date && !validDate(date)) fail("Send date must use YYYY-MM-DD.");
if (!fs.existsSync(batchDir)) fail(`Batch directory not found: ${batchDir}`);

const manifests = findManifests(batchDir);
if (manifests.length !== 10) {
  fail(`Expected 10 route manifest files in the approved batch, found ${manifests.length}.`);
}

for (const manifest of manifests) runLogger(manifest, outputRoot, date);

console.log("Logged approved first-10 route manual sends.");
console.log(outputRoot);
console.log(`Send logs created: ${manifests.length}`);
