#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "landing");
const outputDir = path.join(root, "dist", "mcpscan-static-launch");

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
const manifest = {
  product: "MCPScan",
  generatedAt: new Date().toISOString(),
  source: "landing",
  entrypoint: "index.html",
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
    ""
  ].join("\n")
);

console.log(`Static launch bundle built at ${path.relative(root, outputDir)}`);
console.log(`${files.length + 2} files ready for upload`);
