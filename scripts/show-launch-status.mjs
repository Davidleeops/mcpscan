#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const repo = "Davidleeops/mcpscan";
const live = process.argv.includes("--live");

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function line(label, state, detail) {
  const suffix = detail ? " | " + detail : "";
  console.log(state.padEnd(8) + label + suffix);
}

function hasCheckoutPlaceholders() {
  return exists("landing/index.html") && read("landing/index.html").includes("github.com/Davidleeops/mcpscan/issues/new?title=MCPScan");
}

function hasCustomDomain() {
  return exists("landing/CNAME") && read("landing/CNAME").trim().length > 0;
}

function hasSecurityContact() {
  return exists("SECURITY.md") && /audit@|security@|@mcpscan/i.test(read("SECURITY.md"));
}

function hasBannedPunctuation() {
  const scanRoots = ["README.md", "SECURITY.md", "docs", "sales", "ops", "landing", "launch", "delivery", "scripts"];
  const extensions = new Set([".css", ".csv", ".html", ".js", ".json", ".md", ".mjs", ".ts", ".tsx", ".txt", ".yml", ".yaml"]);
  const files = [];
  function walk(entry) {
    const full = path.join(root, entry);
    if (!fs.existsSync(full)) return;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(full)) {
        if (child === "node_modules" || child === ".git" || child === "dist") continue;
        walk(path.join(entry, child));
      }
      return;
    }
    if (stat.isFile() && extensions.has(path.extname(entry))) files.push(entry);
  }
  for (const entry of scanRoots) walk(entry);
  return files.some((file) => read(file).includes("\u2014"));
}

function hasRecipientCandidates() {
  return exists("sales/recipient-candidates-2026-08-14.csv");
}

function hasContactRoutes() {
  return exists("sales/first-10-contact-routes-2026-08-14.csv");
}

function parseJson(file) {
  try {
    return JSON.parse(read(file));
  } catch {
    return null;
  }
}

function hasFilledApprovalStatus() {
  if (!exists("ops/founder-approval-status.json")) return false;
  const status = parseJson("ops/founder-approval-status.json");
  if (!status) return false;
  const requiredBooleans = [
    "domainPurchased",
    "mailboxCreated",
    "githubPagesAConfigured",
    "githubPagesWwwConfigured",
    "mxConfigured",
    "spfConfigured",
    "dkimConfigured",
    "dmarcConfigured",
    "stripeLinkFormatVerified",
    "stripeCheckoutQaConfirmed",
    "stripeLinksVerified",
    "founderReturnPacketApproved",
    "landingLinksApplied",
    "stagedRouteApprovalCount",
    "firstTenRoutePacketApproved"
  ];
  const hasBooleans = requiredBooleans.filter((key) => key !== "stagedRouteApprovalCount").every((key) => typeof status[key] === "boolean");
  return hasBooleans && typeof status.stagedRouteApprovalCount === "number";
}

function getApprovalStatusState() {
  if (hasFilledApprovalStatus()) return { state: "READY", detail: "ops/founder-approval-status.json is present and structurally valid" };
  return { state: "INFO", detail: "copy template after founder clicks if you want a public-safe tracker" };
}

function approvalTrackerGates(status) {
  if (!status || !hasFilledApprovalStatus()) return [];
  const pagesReady = status.githubPagesAConfigured && status.githubPagesWwwConfigured;
  const mailReady = status.mxConfigured && status.spfConfigured && status.dkimConfigured && status.dmarcConfigured;
  return [
    gate("Tracker Stripe format", status.stripeLinkFormatVerified, status.stripeLinkFormatVerified ? "Stripe Payment Link format verified" : "run npm run launch:verify-stripe with --update-status"),
    gate("Tracker Stripe QA", status.stripeCheckoutQaConfirmed, status.stripeCheckoutQaConfirmed ? "Stripe checkout QA confirmed" : "run npm run launch:verify-stripe-qa with --update-status"),
    gate("Tracker GitHub Pages DNS", pagesReady, pagesReady ? "apex and www records verified" : "run npm run launch:verify-dns with --update-status after DNS propagates"),
    gate("Tracker mailbox auth", mailReady, mailReady ? "MX, SPF, DKIM, and DMARC verified" : "MX, SPF, DKIM, or DMARC still not verified"),
    gate("Tracker first-10 approval", status.firstTenRoutePacketApproved, status.firstTenRoutePacketApproved ? "10 route packets staged for manual sending review" : `${status.stagedRouteApprovalCount || 0}/10 route packets staged`)
  ];
}

function getLiveActionsState() {
  if (!live) return null;
  try {
    const raw = execFileSync("gh", ["run", "list", "--repo", repo, "--limit", "6", "--json", "databaseId,conclusion,status,workflowName,displayTitle"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    const runs = JSON.parse(raw);
    if (runs.length === 0) return { state: "INFO", detail: "no recent workflow runs found" };
    const active = runs.find((run) => run.status !== "completed");
    if (active) return { state: "INFO", detail: "workflow still running: " + active.workflowName };
    for (const run of runs.filter((item) => item.conclusion === "failure")) {
      const view = execFileSync("gh", ["run", "view", String(run.databaseId), "--repo", repo], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      if (view.includes("account is locked due to a billing issue")) {
        return { state: "WAIT", detail: "GitHub billing lock is still blocking workflow startup" };
      }
    }
    const latestFailed = runs.find((run) => run.conclusion === "failure");
    if (latestFailed) return { state: "WAIT", detail: "latest workflow failure needs review: " + latestFailed.workflowName };
    return { state: "READY", detail: "recent GitHub Actions runs have no failures" };
  } catch (error) {
    return { state: "INFO", detail: "live GitHub check unavailable: " + error.message };
  }
}

function getNpmAuthState() {
  try {
    const whoami = execFileSync("npm", ["whoami"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    return { state: "READY", detail: whoami ? "logged in as " + whoami : "npm login detected" };
  } catch {
    return { state: "INFO", detail: "not logged in, only needed for optional npm publish" };
  }
}

function gate(label, ready, detail) {
  return { label, state: ready ? "READY" : "WAIT", detail };
}

const checkoutPlaceholders = hasCheckoutPlaceholders();
const customDomain = hasCustomDomain();
const securityContact = hasSecurityContact();
const liveActions = getLiveActionsState();
const npmAuth = getNpmAuthState();
const approvalStatus = getApprovalStatusState();
const filledApprovalStatus = exists("ops/founder-approval-status.json") ? parseJson("ops/founder-approval-status.json") : null;

const gates = [
  gate("Writing rule", !hasBannedPunctuation(), "no em dash in scanned launch artifacts"),
  gate("Launch cockpit", exists("ops/launch-cockpit.html"), "local operator hub exists"),
  gate("Founder click handoff", exists("ops/founder-click-handoff.html") && exists("docs/FOUNDER_CLICK_HANDOFF.md"), "single founder click sequence exists"),
  gate("Final click path", exists("ops/final-founder-click-console.html") && exists("docs/FINAL_FOUNDER_CLICK_PATH.md"), "founder sequence exists"),
  gate("Cost plan", exists("docs/LAUNCH_COST_AND_INFRASTRUCTURE_PLAN_2026-08-14.md"), "domain, mailbox, repo, and infra cost plan exists"),
  gate("Public trust checklist", exists("docs/PUBLIC_TRUST_CHECKLIST.md"), "pre-outbound public trust checklist exists"),
  gate("Approval status template", exists("ops/founder-approval-status.template.json"), "public-safe founder gate tracker template exists"),
  gate("Founder status console", exists("ops/founder-status-console.html"), "public-safe tracker can be inspected or rebuilt after founder clicks"),
  { label: "Filled approval status", state: approvalStatus.state, detail: approvalStatus.detail },
  ...approvalTrackerGates(filledApprovalStatus),
  gate("Billing unblock path", exists("ops/github-actions-billing-console.html") && exists("docs/GITHUB_ACTIONS_BILLING_UNBLOCK.md"), "GitHub billing guide exists"),
  ...(liveActions ? [{ label: "GitHub Actions live", state: liveActions.state, detail: liveActions.detail }] : []),
  gate("Market source verifier", exists("scripts/verify-market-sources.mjs") && exists("ops/market-research-refresh-console.html"), "npm run market:verify available before outbound"),
  gate("Domain purchase packet", exists("ops/domain-mailbox-purchase-packet.html") && exists("docs/DOMAIN_MAILBOX_PURCHASE_PACKET.md"), "founder can approve one domain and one mailbox"),
  gate("DNS packet generator", exists("scripts/build-domain-dns-packet.mjs"), "npm run launch:dns-packet creates domain-specific records"),
  gate("Stripe setup packet", exists("scripts/build-stripe-setup-packet.mjs") && exists("docs/STRIPE_SETUP_PACKET.md"), "npm run launch:stripe-packet creates exact product setup"),
  gate("Stripe verifier", exists("scripts/verify-stripe-links.mjs"), "npm run launch:verify-stripe available after Payment Links exist"),
  gate("Stripe QA verifier", exists("scripts/verify-stripe-checkout-qa.mjs") && exists("sales/stripe-checkout-qa-evidence.template.json"), "npm run launch:verify-stripe-qa verifies checkout evidence"),
  gate("Post-click verifier", exists("scripts/run-post-click-verification.mjs") && exists("docs/POST_CLICK_VERIFICATION.md"), "one command verifies domain, mailbox, Stripe, writing, and launch after founder clicks"),
  gate("Stripe links", !checkoutPlaceholders, checkoutPlaceholders ? "placeholder checkout links remain" : "live checkout links appear applied"),
  gate("Custom domain", customDomain, customDomain ? read("landing/CNAME").trim() : "no CNAME yet"),
  gate("Security contact", securityContact, securityContact ? "custom contact appears configured" : "placeholder contact remains"),
  gate("DNS verifier", exists("scripts/verify-domain-email-dns.mjs"), "npm run launch:verify-dns available after domain purchase"),
  gate("Static bundle fallback", exists("scripts/build-static-launch-bundle.mjs") && exists("ops/static-launch-bundle-console.html"), "static host fallback is available"),
  gate("Delivery workspace", exists("scripts/create-customer-workspace.mjs"), "npm run delivery:workspace available"),
  gate("Delivery work order", exists("scripts/create-first-paid-audit-work-order.mjs"), "npm run delivery:work-order available after first payment"),
  gate("Paid handoff", exists("scripts/create-paid-audit-handoff.mjs") && exists("sales/paid-audit-handoff-approval-packet.md") && exists("ops/paid-audit-handoff-builder.html"), "builder and command create workspace, work order, and private pipeline status after payment"),
  gate("Delivery verifier", exists("scripts/verify-delivery-readiness.mjs"), "npm run delivery:verify checks first paid audit gates"),
  gate("Delivery dry run", exists("scripts/run-delivery-dry-run.mjs"), "npm run delivery:dry-run proves the first audit workflow"),
  gate("Outbound staging", exists("scripts/stage-approved-outbound.mjs") && exists("ops/outbound-recipient-approval-builder.html"), "approved messages can be staged outside the public repo"),
  gate("Outbound approval queue", exists("scripts/generate-outbound-approval-queue.mjs") && exists("ops/outbound-approval-queue-console.html") && exists("sales/outreach-approval-queue.md"), "first-wave queue can be regenerated before exact recipient approval"),
  gate("Outbound send gates", exists("scripts/verify-first-send-gates.mjs"), "npm run outbound:send-gates blocks sends until launch, DNS, Stripe, and approvals are ready"),
  gate("Send logging", exists("scripts/log-approved-send.mjs") && exists("docs/APPROVED_SEND_LOGGING.md"), "manual sends can create private follow-up schedules"),
  gate("Batch send logging", exists("scripts/log-approved-route-batch-sends.mjs") && exists("docs/BATCH_SEND_LOGGING.md"), "first-10 route sends can be logged in one private batch"),
  gate("Follow-up composer", exists("scripts/compose-follow-up-approval.mjs") && exists("docs/FOLLOW_UP_APPROVAL_COMPOSER.md"), "private send logs can draft follow-up approval packets"),
  gate("Revenue snapshot", exists("scripts/build-revenue-snapshot.mjs") && exists("docs/PRIVATE_REVENUE_SNAPSHOT.md"), "private logs can produce daily due-follow-up snapshots"),
  gate("Outbound composer", exists("scripts/compose-final-outbound.mjs"), "npm run outbound:compose-final creates exact approval packets"),
  gate("Contact-route composer", exists("scripts/compose-contact-route-outbound.mjs"), "npm run outbound:compose-contact-routes creates first-10 route packets"),
  gate("Route approval packet", exists("sales/first-10-route-approval-packet-2026-08-14.md"), "first-10 route approval packet is ready for same-turn review"),
  gate("GTM claim verifier", exists("scripts/verify-gtm-claims.mjs"), "npm run gtm:verify checks overclaim risk"),
  gate("Public launch post staging", exists("scripts/stage-approved-public-launch-post.mjs") && exists("docs/PUBLIC_LAUNCH_POST_APPROVAL.md"), "approved public launch posts can be staged without publishing"),
  gate("Reply-to-close packet", exists("sales/reply-to-close-packet.md"), "approved reply templates exist for inbound prospect responses"),
  gate("Reply staging", exists("scripts/stage-approved-reply.mjs") && exists("docs/APPROVED_REPLY_STAGING.md"), "approved replies can be staged outside the public repo"),
  gate("Daily revenue command", exists("sales/daily-revenue-command.md"), "one-screen revenue operating surface exists"),
  gate("Payment link manifest", exists("sales/payment-link-manifest.template.json"), "non-secret checkout source template exists"),
  { label: "npm auth", state: npmAuth.state, detail: npmAuth.detail },
  gate("Recipient candidates", hasRecipientCandidates(), "npm run outbound:verify checks candidate readiness"),
  gate("Contact routes", hasContactRoutes(), "official first-10 contact routes exist for route-based approvals"),
  gate("Buyer summary", exists("delivery/customer-workspace-template/buyer-facing-summary.md"), "customer deliverable exists")
];

console.log("MCPScan Launch Status" + (live ? " (live)" : ""));
console.log("");
for (const item of gates) {
  line(item.label, item.state, item.detail);
}

const waiting = gates.filter((item) => item.state === "WAIT");
console.log("");
if (waiting.length === 0) {
  console.log("Next action: run strict launch verification and start approved outbound.");
} else {
  console.log("Next founder clicks:");
  for (const item of waiting) console.log("- " + item.label + ": " + item.detail);
}
