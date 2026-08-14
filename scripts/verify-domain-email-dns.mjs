#!/usr/bin/env node
import dns from "node:dns/promises";
import fs from "node:fs";
import path from "node:path";

const githubA = new Set(["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"]);
const githubAaaa = new Set(["2606:50c0:8000::153", "2606:50c0:8001::153", "2606:50c0:8002::153", "2606:50c0:8003::153"]);

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

function normalizeTxt(records) {
  return records.map((parts) => parts.join(""));
}

function result(kind, label, detail = "") {
  return { kind, label, detail };
}

function isPass(results, label) {
  return results.some((item) => item.label === label && item.kind === "pass");
}

function updateApprovalStatus(domain, results) {
  const file = path.join(process.cwd(), "ops/founder-approval-status.json");
  if (!fs.existsSync(file)) {
    console.log("INFO approval status - ops/founder-approval-status.json not found, skipping tracker update");
    return;
  }

  const status = JSON.parse(fs.readFileSync(file, "utf8"));
  status.updatedAt = new Date().toISOString();
  status.domain = status.domain || domain;
  status.githubPagesAConfigured = isPass(results, "apex A records");
  status.githubPagesWwwConfigured = isPass(results, "www CNAME");
  status.mxConfigured = isPass(results, "Spacemail MX");
  status.spfConfigured = isPass(results, "Spacemail SPF");
  if (results.some((item) => item.label === "Spacemail DKIM")) {
    status.dkimConfigured = isPass(results, "Spacemail DKIM");
  }
  status.dmarcConfigured = isPass(results, "DMARC");

  fs.writeFileSync(file, `${JSON.stringify(status, null, 2)}\n`);
  console.log("INFO approval status - updated ops/founder-approval-status.json");
}

function print(results) {
  for (const item of results) {
    const mark = item.kind === "pass" ? "PASS" : item.kind === "warn" ? "WARN" : "FAIL";
    console.log(`${mark} ${item.label}${item.detail ? ` - ${item.detail}` : ""}`);
  }
}

async function resolveRecord(type, name) {
  try {
    if (type === "A") return { ok: true, values: await dns.resolve4(name) };
    if (type === "AAAA") return { ok: true, values: await dns.resolve6(name) };
    if (type === "CNAME") return { ok: true, values: await dns.resolveCname(name) };
    if (type === "MX") return { ok: true, values: await dns.resolveMx(name) };
    if (type === "TXT") return { ok: true, values: normalizeTxt(await dns.resolveTxt(name)) };
  } catch (error) {
    return { ok: false, values: [], error: error.code ?? error.message };
  }
  return { ok: false, values: [], error: `unsupported record type: ${type}` };
}

function validDomain(value) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

const args = parseArgs(process.argv.slice(2));
const domain = (args.domain ?? "").toLowerCase();
const strict = args.strict === "true";
const updateStatus = args["update-status"] === "true";
const dkimSelector = args["dkim-selector"];

if (!validDomain(domain)) {
  console.error("Usage: npm run launch:verify-dns -- --domain getmcpscan.com");
  process.exit(1);
}

const results = [];

const a = await resolveRecord("A", domain);
if (a.ok) {
  const missing = [...githubA].filter((value) => !a.values.includes(value));
  results.push(missing.length === 0 ? result("pass", "apex A records", a.values.join(", ")) : result("warn", "apex A records", `missing GitHub Pages value(s): ${missing.join(", ")}`));
} else {
  results.push(result("warn", "apex A records", a.error));
}

const aaaa = await resolveRecord("AAAA", domain);
if (aaaa.ok) {
  const missing = [...githubAaaa].filter((value) => !aaaa.values.includes(value));
  results.push(missing.length === 0 ? result("pass", "apex AAAA records", aaaa.values.join(", ")) : result("warn", "apex AAAA records", `missing GitHub Pages value(s): ${missing.join(", ")}`));
} else {
  results.push(result("warn", "apex AAAA records", aaaa.error));
}

const www = await resolveRecord("CNAME", `www.${domain}`);
if (www.ok) {
  const normalized = www.values.map((value) => value.replace(/\.$/, "").toLowerCase());
  results.push(normalized.includes("davidleeops.github.io") ? result("pass", "www CNAME", www.values.join(", ")) : result("warn", "www CNAME", `expected davidleeops.github.io, got ${www.values.join(", ")}`));
} else {
  results.push(result("warn", "www CNAME", www.error));
}

const mx = await resolveRecord("MX", domain);
if (mx.ok) {
  const exchanges = mx.values.map((record) => record.exchange.replace(/\.$/, "").toLowerCase());
  const hasSpaceMail = exchanges.some((exchange) => exchange === "mx1.spacemail.com" || exchange === "mx2.spacemail.com");
  results.push(hasSpaceMail ? result("pass", "Spacemail MX", exchanges.join(", ")) : result("warn", "Spacemail MX", `expected mx1.spacemail.com or mx2.spacemail.com, got ${exchanges.join(", ")}`));
} else {
  results.push(result("warn", "Spacemail MX", mx.error));
}

const txt = await resolveRecord("TXT", domain);
if (txt.ok) {
  const spf = txt.values.find((value) => value.toLowerCase().startsWith("v=spf1"));
  results.push(spf?.toLowerCase().includes("include:spf.spacemail.com") ? result("pass", "Spacemail SPF", spf) : result("warn", "Spacemail SPF", spf ? `SPF does not include spacemail: ${spf}` : "no SPF TXT found"));
} else {
  results.push(result("warn", "Spacemail SPF", txt.error));
}

if (dkimSelector) {
  const dkim = await resolveRecord("TXT", `${dkimSelector}._domainkey.${domain}`);
  if (dkim.ok) {
    const record = dkim.values.find((value) => value.toLowerCase().startsWith("v=dkim1"));
    results.push(record ? result("pass", "Spacemail DKIM", `${dkimSelector}._domainkey.${domain}`) : result("warn", "Spacemail DKIM", "no v=DKIM1 TXT found"));
  } else {
    results.push(result("warn", "Spacemail DKIM", dkim.error));
  }
}

const dmarc = await resolveRecord("TXT", `_dmarc.${domain}`);
if (dmarc.ok) {
  const record = dmarc.values.find((value) => value.toLowerCase().startsWith("v=dmarc1"));
  results.push(record ? result("pass", "DMARC", record) : result("warn", "DMARC", "no v=DMARC1 TXT found"));
} else {
  results.push(result("warn", "DMARC", dmarc.error));
}

print(results);

const failures = results.filter((item) => item.kind === "fail");
const warnings = results.filter((item) => item.kind === "warn");

console.log("");
console.log(`Summary: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);

if (updateStatus) {
  updateApprovalStatus(domain, results);
}

if (strict && (failures.length > 0 || warnings.length > 0)) {
  process.exit(1);
}

if (failures.length > 0) {
  process.exit(1);
}
