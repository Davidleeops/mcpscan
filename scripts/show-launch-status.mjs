#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function line(label, status, detail) {
  const suffix = detail ? " | " + detail : "";
  console.log(status.padEnd(8) + label + suffix);
}

function hasCheckoutPlaceholders() {
  return exists("landing/index.html") && read("landing/index.html").includes("github.com/Davidleeops/mcpscan/issues/new?title=MCPScan");
}

function hasCustomDomain() {
  return exists("landing/CNAME") && read("landing/CNAME").trim().length > 0;
}

function hasSecurityContact() {
  return exists("SECURITY.md") && /hello@|@mcpscan/i.test(read("SECURITY.md"));
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

const gates = [
  { label: "Writing rule", ready: !hasBannedPunctuation(), detail: "no em dash in scanned launch artifacts" },
  { label: "Launch cockpit", ready: exists("ops/launch-cockpit.html"), detail: "local operator hub exists" },
  { label: "Final click path", ready: exists("ops/final-founder-click-console.html") && exists("docs/FINAL_FOUNDER_CLICK_PATH.md"), detail: "founder sequence exists" },
  { label: "Billing unblock path", ready: exists("ops/github-actions-billing-console.html") && exists("docs/GITHUB_ACTIONS_BILLING_UNBLOCK.md"), detail: "GitHub billing guide exists" },
  { label: "Stripe links", ready: !hasCheckoutPlaceholders(), detail: hasCheckoutPlaceholders() ? "placeholder checkout links remain" : "live checkout links appear applied" },
  { label: "Custom domain", ready: hasCustomDomain(), detail: hasCustomDomain() ? read("landing/CNAME").trim() : "no CNAME yet" },
  { label: "Security contact", ready: hasSecurityContact(), detail: hasSecurityContact() ? "custom contact appears configured" : "placeholder contact remains" },
  { label: "Delivery workspace", ready: exists("scripts/create-customer-workspace.mjs"), detail: "npm run delivery:workspace available" },
  { label: "Buyer summary", ready: exists("delivery/customer-workspace-template/buyer-facing-summary.md"), detail: "customer deliverable exists" }
];

console.log("MCPScan Launch Status");
console.log("");
for (const gate of gates) {
  line(gate.label, gate.ready ? "READY" : "WAIT", gate.detail);
}

const waiting = gates.filter((gate) => !gate.ready);
console.log("");
if (waiting.length === 0) {
  console.log("Next action: run strict launch verification and start approved outbound.");
} else {
  console.log("Next founder clicks:");
  for (const gate of waiting) console.log("- " + gate.label + ": " + gate.detail);
}
