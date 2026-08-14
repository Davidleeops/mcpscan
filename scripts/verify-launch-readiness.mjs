#!/usr/bin/env node
import fs from "node:fs";
import https from "node:https";
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

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

const writingRuleRoots = [
  "README.md",
  "SECURITY.md",
  "docs",
  "sales",
  "ops",
  "landing",
  "launch",
  "delivery",
  "scripts"
];

const writingRuleExtensions = new Set([
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml"
]);

function collectTextFiles(entry, files = []) {
  const full = path.join(root, entry);
  if (!fs.existsSync(full)) return files;
  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(full)) {
      if (child === "node_modules" || child === ".git" || child === "dist") continue;
      collectTextFiles(path.join(entry, child), files);
    }
  } else if (stat.isFile() && writingRuleExtensions.has(path.extname(entry))) {
    files.push(entry);
  }
  return files;
}

function checkUrl(url) {
  return new Promise((resolve) => {
    const request = https.request(url, { method: "HEAD", timeout: 8000 }, (response) => {
      const status = response.statusCode ?? 0;
      response.resume();
      if (status >= 300 && status < 400 && response.headers.location) {
        const redirected = new URL(response.headers.location, url).toString();
        resolve(checkUrl(redirected));
        return;
      }
      resolve({ ok: status >= 200 && status < 400, status, url });
    });
    request.on("timeout", () => {
      request.destroy(new Error("timeout"));
    });
    request.on("error", (error) => {
      resolve({ ok: false, status: 0, url, error: error.message });
    });
    request.end();
  });
}

function fetchText(url) {
  return new Promise((resolve) => {
    const request = https.request(url, { method: "GET", timeout: 8000 }, (response) => {
      const status = response.statusCode ?? 0;
      if (status >= 300 && status < 400 && response.headers.location) {
        const redirected = new URL(response.headers.location, url).toString();
        response.resume();
        resolve(fetchText(redirected));
        return;
      }

      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        resolve({ ok: status >= 200 && status < 400, status, url, body });
      });
    });
    request.on("timeout", () => {
      request.destroy(new Error("timeout"));
    });
    request.on("error", (error) => {
      resolve({ ok: false, status: 0, url, body: "", error: error.message });
    });
    request.end();
  });
}

function result(kind, label, detail = "") {
  return { kind, label, detail };
}

function print(results) {
  for (const item of results) {
    const mark = item.kind === "pass" ? "PASS" : item.kind === "warn" ? "WARN" : "FAIL";
    console.log(`${mark} ${item.label}${item.detail ? ` - ${item.detail}` : ""}`);
  }
}

const args = parseArgs(process.argv.slice(2));
const strict = args.strict === "true";
const domain = args.domain;
const baseUrl = domain ? `https://${domain}` : "https://davidleeops.github.io/mcpscan";

const results = [];

const requiredFiles = [
  "landing/index.html",
  "landing/intake.html",
  "landing/thank-you.html",
  "landing/secure-intake.html",
  "landing/terms.html",
  "landing/privacy.html",
  "landing/refund.html",
  "ops/launch-cockpit.html",
  "ops/launch-approval-queue.html",
  "ops/founder-return-packet.html",
  "ops/static-launch-bundle-console.html",
  "ops/market-research-refresh-console.html",
  "ops/GITHUB_ISSUE_ACTION_BOARD.md",
  "ops/founder-click-console.html",
  "ops/founder-click-handoff.html",
  "ops/founder-status-console.html",
  "ops/final-founder-click-console.html",
  "ops/founder-return-packet.sample.txt",
  "ops/domain-mailbox-purchase-packet.html",
  "ops/cheap-launch-packet-console.html",
  "ops/domain-email-dns-console.html",
  "ops/stripe-click-setup.html",
  "ops/stripe-payment-link-qa-console.html",
  "ops/approved-links-command-builder.html",
  "ops/outbound-approval-console.html",
  "ops/outbound-approval-queue-console.html",
  "ops/outbound-recipient-approval-builder.html",
  "ops/first-10-outbound-approval-console.html",
  "ops/first-account-dossier-console.html",
  "ops/recipient-finder-console.html",
  "ops/first-revenue-battlecard.html",
  "ops/post-payment-console.html",
  "ops/paid-audit-handoff-builder.html",
  "ops/revenue-cadence-console.html",
  "ops/github-actions-billing-console.html",
  "ops/npm-publish-console.html",
  "ops/founder-approval-status.template.json",
  "ops/generated-launch-packets/README.md",
  "ops/generated-launch-packets/2026-08-14_mcpscan-site_dns-packet.md",
  "ops/generated-launch-packets/2026-08-14_mcpscan-site_stripe-setup-packet.md",
  "ops/generated-launch-packets/2026-08-14_mcpscan-site_dns-records.csv",
  "ops/generated-launch-packets/2026-08-14_mcpscan-site_stripe-products.csv",
  "ops/delivery-console.html",
  "ops/customer-comms-console.html",
  "ops/discovery-console.html",
  "ops/pipeline-console.html",
  "ops/prospect-sourcing-console.html",
  "ops/gtm-placement-console.html",
  "ops/public-channel-drafts-console.html",
  "docs/FIRST_REVENUE_BATTLECARD.md",
  "docs/FIRST_AUDIT_DELIVERY_PACKET.md",
  "docs/FIRST_PAID_AUDIT_GO_NO_GO.md",
  "docs/FIRST_PAID_AUDIT_WORK_ORDER.md",
  "docs/METHODOLOGY_AND_LIMITATIONS.md",
  "docs/SEVERITY_RUBRIC.md",
  "docs/PAYMENT_TO_DELIVERY_SOP.md",
  "docs/FINAL_OUTBOUND_COMPOSER.md",
  "docs/CONTACT_ROUTE_OUTBOUND_PACKETS.md",
  "docs/GTM_CLAIM_SAFETY.md",
  "docs/APPROVED_OUTBOUND_STAGING.md",
  "docs/APPROVED_REPLY_STAGING.md",
  "docs/APPROVED_SEND_LOGGING.md",
  "docs/BATCH_SEND_LOGGING.md",
  "docs/FOLLOW_UP_APPROVAL_COMPOSER.md",
  "docs/PRIVATE_REVENUE_SNAPSHOT.md",
  "docs/POST_CLICK_VERIFICATION.md",
  "docs/PUBLIC_LAUNCH_POST_APPROVAL.md",
  "docs/PUBLIC_CHANNEL_LAUNCH_DRAFTS_2026-08-14.md",
  "docs/STRIPE_SETUP_PACKET.md",
  "docs/STRIPE_PAYMENT_LINK_VERIFICATION.md",
  "docs/SERVICE_AGREEMENT_APPENDIX.md",
  "docs/SECURE_CUSTOMER_HANDOFF.md",
  "docs/GITHUB_ACTIONS_BILLING_UNBLOCK.md",
  "docs/STATIC_LAUNCH_BUNDLE.md",
  "docs/MARKET_RESEARCH_REFRESH.md",
  "docs/FOUNDER_CLICK_HANDOFF.md",
  "docs/FINAL_FOUNDER_CLICK_PATH.md",
  "docs/FOUNDER_RETURN_VALUES_CHECKLIST.md",
  "docs/DOMAIN_MAILBOX_PURCHASE_PACKET.md",
  "docs/DOMAIN_AND_MAILBOX_DECISION.md",
  "docs/DOMAIN_PURCHASE_SHORTLIST_2026-08-14.md",
  "docs/LAUNCH_COST_AND_INFRASTRUCTURE_PLAN_2026-08-14.md",
  "docs/PUBLIC_TRUST_CHECKLIST.md",
  "docs/MARKET_REALITY_BRIEF_2026-08-14.md",
  "docs/MARKET_PULSE_REFRESH_2026-08-14.md",
  "sales/buyer-intent-map-2026-08-14.md",
  "sales/first-account-dossier-2026-08-14.md",
  "sales/first-account-dossier-2026-08-14.csv",
  "sales/first-account-pipeline-2026-08-14.csv",
  "sales/recipient-candidates-2026-08-14.csv",
  "sales/first-10-contact-routes-2026-08-14.csv",
  "sales/first-10-route-approval-packet-2026-08-14.md",
  "sales/first-10-recipient-approval-packet-2026-08-14.md",
  "sales/recipient-candidate-sources-2026-08-14.md",
  "sales/recipient-approval-packet-2026-08-14.md",
  "sales/stripe-payment-link-approval-packet-2026-08-14.md",
  "sales/payment-link-manifest.template.json",
  "sales/stripe-checkout-qa-evidence.template.json",
  "sales/payment-confirmation-evidence.template.json",
  "sales/reply-to-close-packet.md",
  "sales/daily-revenue-command.md",
  "sales/outreach-approval-queue.md",
  "sales/first-10-outbound-approval-packet.md",
  "sales/first-14-days-operating-cadence.md",
  "sales/post-payment-handoff.md",
  "sales/paid-audit-handoff-approval-packet.md",
  "sales/findings-call-scheduling.md",
  "sales/customer-communications.md",
  "sales/customer-intake.md",
  "sales/discovery-call-script.md",
  "scripts/create-customer-workspace.mjs",
  "scripts/open-paid-audit-handoff.mjs",
  "scripts/run-delivery-dry-run.mjs",
  "scripts/verify-delivery-readiness.mjs",
  "scripts/create-payment-evidence.mjs",
  "scripts/verify-payment-evidence.mjs",
  "scripts/create-first-paid-audit-work-order.mjs",
  "scripts/create-paid-audit-handoff.mjs",
  "scripts/apply-founder-return-packet.mjs",
  "scripts/simulate-founder-return-apply.mjs",
  "scripts/build-domain-dns-packet.mjs",
  "scripts/build-stripe-setup-packet.mjs",
  "scripts/prepare-cheap-launch-packets.mjs",
  "scripts/build-static-launch-bundle.mjs",
  "scripts/open-static-launch-bundle.mjs",
  "scripts/verify-market-sources.mjs",
  "scripts/verify-domain-email-dns.mjs",
  "scripts/verify-stripe-links.mjs",
  "scripts/verify-stripe-checkout-qa.mjs",
  "scripts/run-post-click-verification.mjs",
  "scripts/rerun-github-actions-after-unlock.mjs",
  "scripts/run-launch-rehearsal.mjs",
  "scripts/open-public-launch-review.mjs",
  "scripts/stage-approved-public-launch-post.mjs",
  "scripts/stage-approved-outbound.mjs",
  "scripts/open-first-10-outbound-approval.mjs",
  "scripts/open-first-send-readiness.mjs",
  "scripts/open-reply-to-close-review.mjs",
  "scripts/stage-approved-reply.mjs",
  "scripts/log-approved-send.mjs",
  "scripts/log-approved-route-batch-sends.mjs",
  "scripts/compose-follow-up-approval.mjs",
  "scripts/simulate-first-10-route-staging.mjs",
  "scripts/simulate-first-10-named-recipient-staging.mjs",
  "scripts/simulate-first-send-gates.mjs",
  "scripts/simulate-revenue-follow-up-flow.mjs",
  "scripts/build-revenue-snapshot.mjs",
  "scripts/stage-approved-route-packet.mjs",
  "scripts/compose-final-outbound.mjs",
  "scripts/compose-contact-route-outbound.mjs",
  "scripts/build-first-10-route-approval-packet.mjs",
  "scripts/build-first-10-recipient-approval-packet.mjs",
  "scripts/verify-outbound-readiness.mjs",
  "scripts/verify-gtm-claims.mjs",
  "scripts/show-launch-status.mjs",
  "scripts/open-next-founder-action.mjs",
  "scripts/open-founder-clicks.mjs",
  "scripts/open-founder-return-review.mjs",
  "delivery/customer-workspace-template/report-template.md",
  "delivery/customer-workspace-template/buyer-facing-summary.md",
  "delivery/customer-workspace-template/findings-tracker.csv",
  "delivery/customer-workspace-template/client-acceptance.md",
  "delivery/customer-workspace-template/evidence-register.csv",
  "delivery/customer-workspace-template/redaction-checklist.md",
  "delivery/customer-workspace-template/qa-signoff.md",
  "delivery/customer-workspace-template/retention-and-deletion-log.md"
];

for (const file of requiredFiles) {
  results.push(exists(file) ? result("pass", `required file: ${file}`) : result("fail", `required file: ${file}`, "missing"));
}

const writingRuleMatches = [];
for (const file of writingRuleRoots.flatMap((entry) => collectTextFiles(entry))) {
  const text = read(file);
  const index = text.indexOf("\u2014");
  if (index !== -1) {
    const before = text.slice(0, index);
    const line = before.split("\n").length;
    writingRuleMatches.push(`${file}:${line}`);
  }
}

results.push(
  writingRuleMatches.length === 0
    ? result("pass", "writing rule: no em dash", "all scanned launch artifacts are clean")
    : result("fail", "writing rule: no em dash", writingRuleMatches.join(", "))
);

if (exists("landing/index.html")) {
  const landing = read("landing/index.html");
  const stillIssueCheckout = landing.includes("github.com/Davidleeops/mcpscan/issues/new?title=MCPScan");
  results.push(
    stillIssueCheckout
      ? result("warn", "landing checkout CTAs", "still point to GitHub issue placeholders until Stripe links are approved")
      : result("pass", "landing checkout CTAs", "no GitHub issue checkout placeholders found")
  );
}

if (exists("landing/CNAME")) {
  const cname = read("landing/CNAME").trim();
  results.push(cname ? result("pass", "custom domain CNAME", cname) : result("warn", "custom domain CNAME", "empty"));
} else {
  results.push(result("warn", "custom domain CNAME", "not present until domain is approved"));
}

if (exists("SECURITY.md")) {
  const security = read("SECURITY.md");
  results.push(
    security.includes("audit@") || security.includes("security@") || security.includes("@mcpscan")
      ? result("pass", "security contact", "custom email appears configured")
      : result("warn", "security contact", "still uses public issue/private disclosure placeholder")
  );
}

if (exists("scripts/open-next-founder-action.mjs")) {
  const nextAction = read("scripts/open-next-founder-action.mjs");
  const requiredNextActionUrls = [
    "https://github.com/settings/billing",
    "https://github.com/Davidleeops/mcpscan/actions",
    "https://www.spaceship.com/domain-search/?query=mcpattest.dev",
    "https://www.spaceship.com/domain-search/?query=trymcpscan.com",
    "https://www.spaceship.com/domain-search/?query=mcpscan.site",
    "https://dashboard.stripe.com/payment-links"
  ];
  const missingNextActionUrls = requiredNextActionUrls.filter((url) => !nextAction.includes(url));
  results.push(
    missingNextActionUrls.length === 0
      ? result("pass", "launch next account links", "all founder account links are present")
      : result("fail", "launch next account links", missingNextActionUrls.join(", "))
  );

  const nextActionSafetyMarkers = [
    "approval-gated",
    "does not buy, publish, send, apply, or create customer files"
  ];
  const missingNextActionSafetyMarkers = nextActionSafetyMarkers.filter((marker) => !nextAction.includes(marker));
  results.push(
    missingNextActionSafetyMarkers.length === 0
      ? result("pass", "launch next safety guard", "account pages open without external action")
      : result("fail", "launch next safety guard", missingNextActionSafetyMarkers.join(", "))
  );
}

if (exists("scripts/open-founder-clicks.mjs")) {
  const founderClicks = read("scripts/open-founder-clicks.mjs");
  const requiredFounderClickUrls = [
    "https://www.spaceship.com/domain-search/?query=trymcpscan.com",
    "https://www.spaceship.com/domain-search/?query=mcpattest.dev",
    "https://www.spaceship.com/domain-search/?query=getmcpscan.xyz",
    "https://www.spaceship.com/domain-search/?query=mcpscan.site"
  ];
  const missingFounderClickUrls = requiredFounderClickUrls.filter((url) => !founderClicks.includes(url));
  results.push(
    missingFounderClickUrls.length === 0
      ? result("pass", "founder domain search links", "trust, clean-brand, and cheap fallback searches are present")
      : result("fail", "founder domain search links", missingFounderClickUrls.join(", "))
  );
}

const authorizationFiles = [
  "README.md",
  "landing/index.html",
  "landing/secure-intake.html",
  "docs/FIRST_REVENUE_BATTLECARD.md",
  "docs/SAMPLE_AUDIT_SCOPE.md",
  "ops/customer-comms-console.html",
  "sales/customer-communications.md"
];

const missingAuthorizationLanguage = authorizationFiles.filter((file) => {
  if (!exists(file)) return true;
  const text = read(file).toLowerCase();
  return !text.includes("authorized") && !text.includes("authorization");
});

results.push(
  missingAuthorizationLanguage.length === 0
    ? result("pass", "authorization-only promise", "public and operator artifacts mention authorization")
    : result("fail", "authorization-only promise", missingAuthorizationLanguage.join(", "))
);

const urls = [
  `${baseUrl}/`,
  `${baseUrl}/sample-report.html`,
  `${baseUrl}/intake.html`,
  `${baseUrl}/secure-intake.html`,
  `${baseUrl}/thank-you.html`,
  `${baseUrl}/terms.html`,
  `${baseUrl}/privacy.html`,
  `${baseUrl}/refund.html`
];

const urlChecks = await Promise.all(urls.map(checkUrl));
for (const checked of urlChecks) {
  results.push(
    checked.ok
      ? result("pass", `public URL: ${checked.url}`, `HTTP ${checked.status}`)
      : result("warn", `public URL: ${checked.url}`, checked.error ?? `HTTP ${checked.status}`)
  );
}

const liveHome = await fetchText(`${baseUrl}/`);
if (liveHome.ok) {
  const requiredLiveMarkers = [
    "Free scanners produce signals",
    "customer is authorized to submit",
    "MCP Launch Audit"
  ];
  const missingMarkers = requiredLiveMarkers.filter((marker) => !liveHome.body.includes(marker));
  results.push(
    missingMarkers.length === 0
      ? result("pass", "live landing freshness", "latest buyer-facing copy is deployed")
      : result("warn", "live landing freshness", `missing current marker(s): ${missingMarkers.join(", ")}`)
  );
} else {
  results.push(result("warn", "live landing freshness", liveHome.error ?? `HTTP ${liveHome.status}`));
}

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);
if (strict && (failures.length > 0 || warnings.length > 0)) {
  process.exit(1);
}
if (failures.length > 0) {
  process.exit(1);
}
