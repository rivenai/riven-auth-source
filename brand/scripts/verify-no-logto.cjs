#!/usr/bin/env node
// Fail the build if any upstream Logto identifiers remain in shipped artifacts.
const fs = require('fs');
const path = require('path');

const baseDir = '/etc/logto';
const packages = ['experience', 'console', 'account', 'demo-app', 'device-demo-app', 'core'];
const forbidden = [/@logto[/-]/i, /Logto-Static-Package/i, /Logto-App-Id/i];
const allowed = [/^@logto\/connector-kit$/]; // allow exact upstream connector-kit in node_modules? No, we want none.

const bad = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile()) {
      const ext = path.extname(full).toLowerCase();
      if (!['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.css', '.scss', '.html', '.json', '.map'].includes(ext)) {
        continue;
      }
      const text = fs.readFileSync(full, 'utf8');
      for (const pattern of forbidden) {
        if (pattern.test(text)) {
          bad.push(`${full} matches ${pattern.source}`);
          break;
        }
      }
    }
  }
}

for (const pkg of packages) {
  const pkgDir = path.join(baseDir, 'packages', pkg);
  if (!fs.existsSync(pkgDir)) continue;
  for (const subdir of ['dist', 'static']) {
    const dir = path.join(pkgDir, subdir);
    if (fs.existsSync(dir)) walk(dir);
  }
}

if (bad.length > 0) {
  console.error('ERROR: upstream Logto identifiers found in built artifacts:');
  for (const line of bad.slice(0, 20)) console.error('  ' + line);
  if (bad.length > 20) console.error(`  ... and ${bad.length - 20} more`);
  process.exit(1);
}

console.log('No upstream Logto identifiers found in built artifacts.');
