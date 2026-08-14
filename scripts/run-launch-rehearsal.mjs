#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const steps = [
  ["founder return packet parser", ["run", "launch:verify-return-packet"]],
  ["founder return apply simulation", ["run", "launch:simulate-return-apply"]],
  ["first-10 route staging simulation", ["run", "outbound:simulate-route-staging"]],
  ["first-10 named-recipient staging simulation", ["run", "outbound:simulate-named-staging"]],
  ["first-send gate simulation", ["run", "outbound:simulate-send-gates"]],
  ["private revenue follow-up simulation", ["run", "outbound:simulate-revenue-flow"]],
  ["paid audit delivery dry run", ["run", "delivery:dry-run"]]
];

for (const [label, args] of steps) {
  console.log("");
  console.log(`Rehearsal step: ${label}`);
  const result = spawnSync("npm", args, { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`Launch rehearsal failed at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log("");
console.log("Launch rehearsal passed.");
