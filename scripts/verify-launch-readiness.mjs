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
  "ops/founder-click-console.html",
  "ops/domain-email-dns-console.html",
  "ops/stripe-click-setup.html",
  "ops/approved-links-command-builder.html",
  "ops/outbound-approval-console.html",
  "ops/npm-publish-console.html",
  "ops/delivery-console.html",
  "delivery/customer-workspace-template/report-template.md",
  "delivery/customer-workspace-template/findings-tracker.csv"
];

for (const file of requiredFiles) {
  results.push(exists(file) ? result("pass", `required file: ${file}`) : result("fail", `required file: ${file}`, "missing"));
}

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
    security.includes("hello@") || security.includes("@mcpscan")
      ? result("pass", "security contact", "custom email appears configured")
      : result("warn", "security contact", "still uses public issue/private disclosure placeholder")
  );
}

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

