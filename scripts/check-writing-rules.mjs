#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const banned = [
  { value: "\u2014", name: "em dash" }
];

const scanRoots = [
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

const textExtensions = new Set([
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

function isTextFile(file) {
  return textExtensions.has(path.extname(file));
}

function walk(entry, files = []) {
  const full = path.join(root, entry);
  if (!fs.existsSync(full)) return files;
  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(full)) {
      if (child === "node_modules" || child === ".git" || child === "dist") continue;
      walk(path.join(entry, child), files);
    }
  } else if (stat.isFile() && isTextFile(entry)) {
    files.push(entry);
  }
  return files;
}

const files = scanRoots.flatMap((entry) => walk(entry));
const failures = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const item of banned) {
    let index = text.indexOf(item.value);
    while (index !== -1) {
      const before = text.slice(0, index);
      const line = before.split("\n").length;
      const column = index - before.lastIndexOf("\n");
      failures.push({ file, line, column, name: item.name });
      index = text.indexOf(item.value, index + item.value.length);
    }
  }
}

if (failures.length > 0) {
  console.error("Writing rule check failed.");
  for (const failure of failures) {
    console.error(failure.file + ":" + failure.line + ":" + failure.column + " contains " + failure.name);
  }
  process.exit(1);
}

console.log("Writing rule check passed: " + files.length + " files scanned.");
