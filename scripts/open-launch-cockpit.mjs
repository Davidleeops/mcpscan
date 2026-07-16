#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const cockpitPath = path.resolve("ops/launch-cockpit.html");
const cockpitUrl = pathToFileURL(cockpitPath).toString();

const platformOpeners = {
  darwin: ["open", [cockpitUrl]],
  win32: ["cmd", ["/c", "start", "", cockpitUrl]],
  linux: ["xdg-open", [cockpitUrl]]
};

const opener = platformOpeners[process.platform];

if (!opener) {
  console.log(cockpitUrl);
  process.exit(0);
}

const [command, args] = opener;
const result = spawnSync(command, args, { stdio: "inherit" });

if (result.error || result.status !== 0) {
  console.log(cockpitUrl);
  process.exit(result.status ?? 1);
}

console.log(`Opened ${cockpitUrl}`);
