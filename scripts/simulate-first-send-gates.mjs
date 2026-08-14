#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "mcpscan-send-gates-"));

function statusFor(mode) {
  const named = mode === "named";
  return {
    generatedFor: "MCPScan first revenue launch",
    updatedAt: "2026-08-14T00:00:00.000Z",
    domain: "trymcpscan.com",
    mailbox: "security@trymcpscan.com",
    auditAlias: "audit@trymcpscan.com",
    helloAlias: "hello@trymcpscan.com",
    domainPurchased: true,
    mailboxCreated: true,
    githubPagesAConfigured: true,
    githubPagesWwwConfigured: true,
    mxConfigured: true,
    spfConfigured: true,
    dkimConfigured: true,
    dmarcConfigured: true,
    stripeQuickAuditLink: "https://buy.stripe.com/quickAuditLive",
    stripeLaunchAuditLink: "https://buy.stripe.com/launchAuditLive",
    stripeEnterpriseReadinessLink: "https://buy.stripe.com/enterpriseReadinessLive",
    stripeLinkFormatVerified: true,
    stripeCheckoutQaConfirmed: true,
    stripeLinksVerified: true,
    founderReturnPacketApproved: true,
    landingLinksApplied: true,
    stagedRouteApprovalCount: named ? 0 : 10,
    firstTenRoutePacketApproved: !named,
    stagedNamedRecipientApprovalCount: named ? 10 : 0,
    firstTenNamedRecipientPacketApproved: named,
    notes: ["Temporary simulation status. Contains no secrets."]
  };
}

function runMode(mode) {
  const statusFile = path.join(sandbox, `${mode}-status.json`);
  fs.writeFileSync(statusFile, `${JSON.stringify(statusFor(mode), null, 2)}\n`, "utf8");
  const result = spawnSync(
    "npm",
    ["run", "outbound:send-gates", "--", "--status-file", statusFile],
    { cwd: root, encoding: "utf8" }
  );

  if (result.stdout.trim()) console.log(result.stdout.trim());
  if (result.stderr.trim()) console.error(result.stderr.trim());
  if (result.status !== 0) process.exit(result.status ?? 1);
}

runMode("route");
runMode("named");
fs.rmSync(sandbox, { recursive: true, force: true });

console.log("First-send gate simulation passed for route and named-recipient approvals.");
