#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

function run(label, command, args) {
  console.log(`Running ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const root = process.cwd();
const bundleDir = path.join(root, "dist", "mcpscan-static-launch");
const uploadPacket = path.join(bundleDir, "FALLBACK_UPLOAD_PACKET.md");
const manifest = path.join(bundleDir, "manifest.json");

run("static launch bundle build", "npm", ["run", "launch:bundle"]);

const targets = [
  ["upload folder", bundleDir],
  ["upload packet", pathToFileURL(uploadPacket).toString()],
  ["manifest", pathToFileURL(manifest).toString()]
];

console.log("");
console.log("MCPScan static bundle launcher");
for (const [label, target] of targets) {
  const opened = openTarget(target);
  console.log(`${opened ? "OPENED" : "COPY"} ${label}: ${target}`);
}

console.log("");
console.log("Upload every file inside this folder to the static host:");
console.log(bundleDir);
