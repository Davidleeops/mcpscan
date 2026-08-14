#!/usr/bin/env node
import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const root = process.cwd();
const defaultFiles = [
  "docs/MARKET_SOURCE_PACK_2026-08-14.md",
  "docs/MARKET_REALITY_BRIEF_2026-08-14.md",
  "docs/MARKET_PULSE_REFRESH_2026-08-14.md",
  "docs/FIRST_REVENUE_CHANNEL_PLACEMENT_2026-08-14.md",
  "sales/buyer-intent-map-2026-08-14.md",
  "sales/first-account-dossier-2026-08-14.md",
  "sales/first-10-contact-routes-2026-08-14.csv"
];

function parseArgs(argv) {
  const values = { files: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--file") {
      const next = argv[index + 1];
      if (next) {
        values.files.push(next);
        index += 1;
      }
      continue;
    }
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

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function extractUrls(file) {
  if (!fs.existsSync(path.join(root, file))) return [];
  const text = read(file);
  const matches = text.match(/https?:\/\/[^\s)<>"']+/g) ?? [];
  return matches.map((url) => url.replace(/[`.,;]+$/, ""));
}

function unique(values) {
  return [...new Set(values)];
}

function requestUrl(url, method = "HEAD") {
  return new Promise((resolve) => {
    const request = https.request(
      url,
      {
        method,
        timeout: 10000,
        headers: {
          "user-agent": "MCPScan launch verifier"
        }
      },
      (response) => {
        const status = response.statusCode ?? 0;
        if (status >= 300 && status < 400 && response.headers.location) {
          const redirected = new URL(response.headers.location, url).toString();
          response.resume();
          resolve(requestUrl(redirected, method));
          return;
        }
        response.resume();
        resolve({ url, status, ok: status >= 200 && status < 400 });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error("timeout"));
    });
    request.on("error", (error) => {
      resolve({ url, status: 0, ok: false, error: error.message });
    });
    request.end();
  });
}

async function checkUrl(url) {
  const head = await requestUrl(url, "HEAD");
  if (head.ok) return head;
  const get = await requestUrl(url, "GET");
  if (get.ok) return get;
  return get.status || get.error ? get : head;
}

function result(kind, label, detail = "") {
  return { kind, label, detail };
}

function parseCsvRows(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = [];
    let current = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"' && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function print(results) {
  for (const item of results) {
    const mark = item.kind === "pass" ? "PASS" : item.kind === "warn" ? "WARN" : "FAIL";
    console.log(`${mark} ${item.label}${item.detail ? ` - ${item.detail}` : ""}`);
  }
}

const args = parseArgs(process.argv.slice(2));
const strict = args.strict === "true";
const files = args.files.length ? args.files : defaultFiles;
const urls = unique(files.flatMap(extractUrls));
const results = [];

for (const file of files) {
  results.push(fs.existsSync(path.join(root, file)) ? result("pass", `market file: ${file}`) : result("fail", `market file: ${file}`, "missing"));
}

if (fs.existsSync(path.join(root, "sales/first-account-dossier-2026-08-14.md"))) {
  const dossier = read("sales/first-account-dossier-2026-08-14.md");
  const accounts = ["Vapi", "Retool", "Pipedream", "Composio", "PostHog", "Statsig", "Braintrust", "Granola", "Sentry", "Replit"];
  const routeMarkers = ["Current Buyer Route Status", "Exact Approved Route", "Buyer Authority Confidence", "Source Checked Date", "Next Approval Click"];
  const missingMarkers = routeMarkers.filter((marker) => !dossier.includes(marker));
  const missingAccounts = accounts.filter((account) => !dossier.includes(`| ${account} |`));
  const checkedRows = (dossier.match(/\| 2026-08-14 \|/g) ?? []).length;
  results.push(missingMarkers.length === 0 ? result("pass", "buyer route status table", "route, confidence, checked date, and next click fields present") : result("fail", "buyer route status table", missingMarkers.join(", ")));
  results.push(missingAccounts.length === 0 ? result("pass", "buyer route account coverage", "10 accounts") : result("fail", "buyer route account coverage", missingAccounts.join(", ")));
  results.push(checkedRows >= 10 ? result("pass", "buyer route checked dates", `${checkedRows} dated rows`) : result("fail", "buyer route checked dates", "expected 10 rows checked on 2026-08-14"));
}

if (fs.existsSync(path.join(root, "sales/first-10-contact-routes-2026-08-14.csv"))) {
  const rows = parseCsvRows(read("sales/first-10-contact-routes-2026-08-14.csv"));
  const missingRouteFields = rows.filter((row) => !row.account || !row.channel || !row.contact_route_url || !row.source_url || !row.confidence);
  const highOrMedium = rows.filter((row) => ["High", "Medium"].includes(row.confidence)).length;
  results.push(rows.length === 10 ? result("pass", "first-10 contact route rows", "10 rows") : result("fail", "first-10 contact route rows", `${rows.length} rows`));
  results.push(missingRouteFields.length === 0 ? result("pass", "first-10 contact route fields", "all required fields present") : result("fail", "first-10 contact route fields", `${missingRouteFields.length} incomplete rows`));
  results.push(highOrMedium === 10 ? result("pass", "first-10 route confidence", "all routes are High or Medium confidence") : result("fail", "first-10 route confidence", `${highOrMedium}/10 High or Medium`));
}

if (urls.length === 0) {
  results.push(result("fail", "market source URLs", "no URLs found"));
} else {
  results.push(result("pass", "market source URLs", `${urls.length} unique URLs found`));
}

const checks = await Promise.all(urls.map(checkUrl));
for (const checked of checks) {
  results.push(
    checked.ok
      ? result("pass", checked.url, `HTTP ${checked.status}`)
      : result("warn", checked.url, checked.error ?? `HTTP ${checked.status}`)
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
