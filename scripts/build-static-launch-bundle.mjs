#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "landing");
const outputDir = path.join(root, "dist", "mcpscan-static-launch");
const freshnessMarkers = [
  "Free scanners produce signals",
  "customer is authorized to submit",
  "MCP Launch Audit"
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

if (!fs.existsSync(sourceDir)) {
  fail("landing directory is missing");
}

fs.rmSync(outputDir, { recursive: true, force: true });
copyDir(sourceDir, outputDir);

const files = fs.readdirSync(outputDir).filter((file) => fs.statSync(path.join(outputDir, file)).isFile()).sort();
const indexHtml = fs.readFileSync(path.join(outputDir, "index.html"), "utf8");
const missingFreshnessMarkers = freshnessMarkers.filter((marker) => !indexHtml.includes(marker));
if (missingFreshnessMarkers.length > 0) {
  fail(`Static bundle index.html is missing current buyer-facing marker(s): ${missingFreshnessMarkers.join(", ")}`);
}

const checkoutPlaceholdersRemain = indexHtml.includes("github.com/Davidleeops/mcpscan/issues/new?title=MCPScan");
const cnamePath = path.join(outputDir, "CNAME");
const customDomain = fs.existsSync(cnamePath) ? fs.readFileSync(cnamePath, "utf8").trim() : "";
const manifest = {
  product: "MCPScan",
  generatedAt: new Date().toISOString(),
  source: "landing",
  entrypoint: "index.html",
  staticHostFallback: true,
  currentBuyerCopyVerified: true,
  freshnessMarkers,
  checkoutPlaceholdersRemain,
  customDomain: customDomain || null,
  files
};

fs.writeFileSync(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(
  path.join(outputDir, "BUNDLE_README.txt"),
  [
    "MCPScan static launch bundle",
    "",
    "Upload every file in this folder to a static host.",
    "Set index.html as the site entrypoint.",
    "Keep the folder contents together so policy pages, intake pages, sample report, and badge endpoint resolve correctly.",
    "",
    "Before paid launch:",
    "1. Replace placeholder checkout links with approved Stripe Payment Links.",
    "2. Set the chosen custom domain in the hosting provider.",
    "3. Verify terms.html, privacy.html, refund.html, intake.html, secure-intake.html, thank-you.html, and sample-report.html.",
    "4. Run npm run launch:verify with the chosen domain after DNS is live.",
    "",
    "Freshness proof:",
    ...freshnessMarkers.map((marker) => `- ${marker}`),
    ""
  ].join("\n")
);

fs.writeFileSync(
  path.join(outputDir, "FALLBACK_UPLOAD_PACKET.md"),
  [
    "# MCPScan Static Host Upload Packet",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Use this only if GitHub Pages remains stale or unavailable while a launch change needs to go live.",
    "",
    "## Upload Folder",
    "",
    "Upload every file in this folder:",
    "",
    "```text",
    "dist/mcpscan-static-launch/",
    "```",
    "",
    "## Freshness Proof",
    "",
    "The bundle builder verified these buyer-facing markers in index.html:",
    "",
    ...freshnessMarkers.map((marker) => `- ${marker}`),
    "",
    "## Launch State",
    "",
    `- Checkout placeholders remain: ${checkoutPlaceholdersRemain ? "yes" : "no"}`,
    `- Custom domain in bundle: ${customDomain || "none yet"}`,
    "",
    "## Upload Steps",
    "",
    "1. Upload all files in this folder to a static host.",
    "2. Set index.html as the site entrypoint.",
    "3. Preserve the file names and folder structure exactly.",
    "4. Attach the approved custom domain after DNS is ready.",
    "5. Run the verification command after upload.",
    "",
    "```text",
    "npm run launch:verify -- --domain {{chosen_domain}}",
    "```",
    "",
    "## Stop Conditions",
    "",
    "- Do not upload this as a paid checkout site while placeholder checkout links remain.",
    "- Do not upload customer secrets, customer reports, private configs, or customer workspaces.",
    "- Do not use this fallback to bypass Stripe QA or the founder return packet.",
    "- Do not send outbound until exact recipients and exact final content are approved in the same turn.",
    ""
  ].join("\n")
);

console.log(`Static launch bundle built at ${path.relative(root, outputDir)}`);
console.log(`${files.length + 3} files ready for upload`);
console.log("Freshness markers verified.");
