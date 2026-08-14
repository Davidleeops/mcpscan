#!/usr/bin/env node
import https from "node:https";
import fs from "node:fs";

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

function readInput(file) {
  if (!file) return "";
  return fs.readFileSync(file, "utf8");
}

function valueFromInput(label, input) {
  const match = input.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim();
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

function checkUrl(url) {
  return new Promise((resolve) => {
    const request = https.request(url, { method: "HEAD", timeout: 10000 }, (response) => {
      const status = response.statusCode ?? 0;
      response.resume();
      if (status >= 300 && status < 400 && response.headers.location) {
        const redirected = new URL(response.headers.location, url).toString();
        resolve(checkUrl(redirected));
        return;
      }
      resolve({ ok: status >= 200 && status < 500, status, url });
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

function validatePaymentLink(label, value) {
  const results = [];
  if (!value) {
    results.push(result("fail", label, "missing"));
    return results;
  }
  if (!/^https:\/\/buy\.stripe\.com\/\S+$/i.test(value)) {
    results.push(result("fail", label, "expected https://buy.stripe.com/..."));
  } else {
    results.push(result("pass", label, "Stripe Payment Link format"));
  }
  if (/\/test_|test_/i.test(value)) {
    results.push(result("fail", `${label} live mode`, "appears to be a Stripe test link"));
  } else {
    results.push(result("pass", `${label} live mode`, "no test marker in URL"));
  }
  return results;
}

const args = parseArgs(process.argv.slice(2));
const input = readInput(args.file);
const strict = args.strict === "true";
const shouldCheckHttp = args.http === "true";

const links = {
  "Quick Audit": args.quick ?? valueFromInput("Quick Audit", input),
  "Launch Audit": args.launch ?? valueFromInput("Launch Audit", input),
  "Enterprise Readiness": args.enterprise ?? valueFromInput("Enterprise Readiness", input) ?? valueFromInput("Enterprise Audit", input)
};

const results = Object.entries(links).flatMap(([label, value]) => validatePaymentLink(label, value));

if (shouldCheckHttp) {
  for (const [label, value] of Object.entries(links)) {
    if (!/^https:\/\/buy\.stripe\.com\/\S+$/i.test(value ?? "")) continue;
    const checked = await checkUrl(value);
    results.push(
      checked.ok
        ? result(checked.status >= 400 ? "warn" : "pass", `${label} HTTP check`, `HTTP ${checked.status}`)
        : result("warn", `${label} HTTP check`, checked.error ?? `HTTP ${checked.status}`)
    );
  }
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
