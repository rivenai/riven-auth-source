#!/usr/bin/env node
// Riven Auth — HTML patcher for static pages (post-logout, etc.)
// Removes or replaces upstream "Powered By" signatures.

const fs = require('fs');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: patch-html.js <html-file>');
  process.exit(1);
}

const PRODUCT_NAME = 'Riven Auth';
const PRODUCT_URL = 'https://rivenai.io';

let html = fs.readFileSync(filePath, 'utf8');

// Remove the entire "Powered By" signature block including the inline SVG logo.
html = html.replace(
  /<div class="signature">[\s\S]*?<\/div>/i,
  `<div class="signature">Secured by <a href="${PRODUCT_URL}">${PRODUCT_NAME}</a></div>`
);

// General string replacements, preserving workspace package names.
html = html
  .replace(/(?<!@)Logto/g, PRODUCT_NAME)
  .replace(/logto\.io/g, PRODUCT_URL)
  .replace(/Silverhand/g, 'Riven Holdings');

fs.writeFileSync(filePath, html, 'utf8');
