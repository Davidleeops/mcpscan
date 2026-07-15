#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const commands = [
  ["npm", ["whoami"]],
  ["npm", ["view", "@mcpscan/shared", "name", "version"]],
  ["npm", ["view", "mcpscan", "name", "version"]],
  ["npm", ["ci"]],
  ["npm", ["run", "clean"]],
  ["npm", ["run", "build"]],
  ["npm", ["run", "typecheck"]],
  ["npm", ["test"]],
  ["npm", ["audit", "--omit=dev"]],
  ["npm", ["pack", "--dry-run", "-w", "@mcpscan/shared"]],
  ["npm", ["pack", "--dry-run", "-w", "mcpscan"]]
];

for (const [cmd, args] of commands) {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: false });
  if (result.status !== 0) {
    if (args[0] === "view") {
      console.log("Continuing after npm view failure; 404 can mean the package name is available.");
      continue;
    }
    process.exit(result.status ?? 1);
  }
}

console.log("\nPreflight complete. Publish order after owner approval/OTP:");
console.log("npm publish -w @mcpscan/shared --access public");
console.log("npm publish -w mcpscan --access public");
