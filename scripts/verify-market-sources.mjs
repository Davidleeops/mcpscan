#!/usr/bin/env node
import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const root = process.cwd();
const defaultFiles = [
  "docs/MARKET_SOURCE_PACK_2026-08-14.md",
  "docs/MARKET_REALITY_BRIEF_2026-08-14.md",
  "docs/MARKET_PULSE_REFRESH_2026-08-14.md",
  "sales/buyer-intent-map-2026-08-14.md",
  "sales/first-account-dossier-2026-08-14.md"
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
  return matches.map((url) => url.replace(/[.,;]+$/, ""));
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
