#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const steps = [
  ["founder return packet parser", ["run", "launch:verify-return-packet"]],
  ["domain and mailbox session simulation", ["run", "launch:simulate-domain-session"]],
  ["founder click session simulation", ["run", "launch:simulate-click-session"]],
  ["founder return apply simulation", ["run", "launch:simulate-return-apply"]],
  ["founder post-click session simulation", ["run", "launch:simulate-post-click-session"]],
  ["GitHub Actions unblock session simulation", ["run", "launch:simulate-actions-session"]],
  ["public launch session simulation", ["run", "launch:simulate-public-session"]],
  ["first-10 route staging simulation", ["run", "outbound:simulate-route-staging"]],
  ["first-10 named-recipient staging simulation", ["run", "outbound:simulate-named-staging"]],
  ["first-10 send session simulation", ["run", "outbound:simulate-first-10-session"]],
  ["first-send gate simulation", ["run", "outbound:simulate-send-gates"]],
  ["private revenue follow-up simulation", ["run", "outbound:simulate-revenue-flow"]],
  ["paid delivery session simulation", ["run", "delivery:simulate-session"]],
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
