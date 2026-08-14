#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-named-stage-"));
const approvalFile = path.join(sandbox, "approved-first-10-named-recipient-packet.txt");
const outputRoot = path.join(sandbox, "outbound-approvals");
const packetFile = path.join(root, "sales/first-10-recipient-approval-packet-2026-08-14.md");
const expectedAccounts = ["Vapi", "Retool", "Pipedream", "Composio", "PostHog", "Statsig", "Braintrust", "Granola", "Sentry", "Replit"];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const packet = read(packetFile);
fs.writeFileSync(approvalFile, packet, "utf8");

const result = spawnSync(
  process.execPath,
  [
    path.join(root, "scripts/stage-approved-route-packet.mjs"),
    "--file",
    approvalFile,
    "--root",
    outputRoot,
    "--date",
    "2026-08-14"
  ],
  { cwd: root, encoding: "utf8" }
);

if (result.stdout.trim()) console.log(result.stdout.trim());
if (result.stderr.trim()) console.error(result.stderr.trim());
if (result.status !== 0) process.exit(result.status ?? 1);

const batchDir = path.join(outputRoot, "2026-08-14_first-10-named-approvals");
const manifestPath = path.join(batchDir, "batch-manifest.json");
assert(fs.existsSync(manifestPath), "batch manifest was not created");

const manifest = JSON.parse(read(manifestPath));
assert(manifest.approvalCount === 10, "batch manifest approval count is not 10");
assert(manifest.noAutoSend === true, "batch manifest must preserve no-auto-send status");
assert(manifest.approvalMode === "named", "batch manifest approval mode must be named");
assert(manifest.namedRecipientBased === true, "batch manifest missing namedRecipientBased flag");
assert(manifest.routeBased === false, "batch manifest routeBased flag must be false");
assert(Array.isArray(manifest.accounts), "batch manifest accounts must be an array");

for (const account of expectedAccounts) {
  assert(manifest.accounts.includes(account), `batch manifest missing account: ${account}`);
  const packetDir = path.join(batchDir, slugify(account));
  const packetPath = path.join(packetDir, "APPROVED_ROUTE_OUTBOUND_PACKET.md");
  const accountManifestPath = path.join(packetDir, "manifest.json");
  assert(fs.existsSync(packetPath), `missing staged packet for ${account}`);
  assert(fs.existsSync(accountManifestPath), `missing staged manifest for ${account}`);
  const stagedPacket = read(packetPath);
  const accountManifest = JSON.parse(read(accountManifestPath));
  assert(stagedPacket.includes("Founder approved this exact named recipient and exact final message."), `${account} staged packet missing named-recipient guard`);
  assert(stagedPacket.includes("This packet does not send anything automatically."), `${account} staged packet missing no-auto-send guard`);
  assert(accountManifest.noAutoSend === true, `${account} manifest missing no-auto-send guard`);
  assert(accountManifest.namedRecipientBased === true, `${account} manifest missing namedRecipientBased flag`);
  assert(accountManifest.routeBased === false, `${account} manifest routeBased flag must be false`);
}

fs.rmSync(sandbox, { recursive: true, force: true });

console.log("First-10 named-recipient staging simulation passed.");
