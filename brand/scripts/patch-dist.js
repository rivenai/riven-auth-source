#!/usr/bin/env node
// Riven Auth — dist-file patcher
// Replaces Logto branding strings in built JS/CSS/HTML/JSON files without
// breaking JavaScript identifiers or workspace package names.

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/etc/logto';
const ASSET_DIR = path.join(BASE_DIR, 'brand', 'assets');

const PRODUCT_NAME = 'Riven Auth';
const VENDOR_NAME = 'Riven Holdings';
const PRODUCT_URL = 'https://rivenai.io';
const LOGO_LIGHT_URL = 'https://cdn.rivenai.io/v1/brand/riven-wordmark-on-light.svg';
const LOGO_DARK_URL = 'https://cdn.rivenai.io/v1/brand/riven-wordmark-on-dark.svg';

// Safe replacements that do not produce invalid JS when applied to code files.
const codeSafeReplacements = [
  // URLs / domains
  { from: /https:\/\/logto\.io\/logo\.svg/g, to: LOGO_LIGHT_URL },
  { from: /https:\/\/logto\.io\/logo-dark\.svg/g, to: LOGO_DARK_URL },
  { from: /logto\.io/g, to: PRODUCT_URL },
  { from: /logto\.app/g, to: 'rivenai.app' },

  // Vendor signatures
  { from: /Powered by Logto/gi, to: `Powered by ${PRODUCT_NAME}` },
  { from: /Powered By Logto/gi, to: `Powered By ${PRODUCT_NAME}` },
  { from: /Logto Management API/g, to: `${PRODUCT_NAME} Management API` },
  { from: /Logto Config/g, to: `${PRODUCT_NAME} Config` },
  { from: /LogtoError/g, to: 'RivenAuthError' },
  { from: /LogtoRequestError/g, to: 'RivenAuthRequestError' },
  { from: /LogtoClientError/g, to: 'RivenAuthClientError' },
  { from: /LogtoClientClass/g, to: 'RivenAuthClientClass' },
  { from: /Logto requester error/g, to: `${PRODUCT_NAME} requester error` },
  { from: /<LogtoProvider>/g, to: '<RivenAuthProvider>' },
  { from: /Must be used inside <LogtoProvider> context\./g, to: 'Must be used inside <RivenAuthProvider> context.' },
  { from: /Internal admin role for Logto tenant/g, to: `Internal admin role for ${PRODUCT_NAME} tenant` },

  // Specific visible enum/identifier values that are safe to rewrite
  { from: /DataFromLogto/g, to: 'DataFromRivenAuth' },
  { from: /export-user-data-from-logto/g, to: 'export-user-data-from-riven-auth' },

  // Hide the vendor signature in the experience UI
  { from: /hideLogtoBranding:!1/g, to: 'hideLogtoBranding:!0' },

  // CSS class names that may leak into DOM / debugging
  { from: /logto-signature/g, to: 'riven-signature' },
  { from: /logto_signature/g, to: 'riven_signature' },
  { from: /logtoSignatureGuard/g, to: 'rivenSignatureGuard' },
  { from: /logto-signature-icon/g, to: 'riven-signature-icon' },
  { from: /logto-signature-container/g, to: 'riven-signature-container' },
  { from: /logto-signature-text/g, to: 'riven-signature-text' },
  { from: /logto-signature-guard/g, to: 'riven-signature-guard' },
  { from: /logto_branding/g, to: 'riven_branding' },
  { from: /logto_branding-header/g, to: 'riven_branding-header' },
  { from: /logto_page-container/g, to: 'riven_page-container' },
  { from: /logto_main-content/g, to: 'riven_main-content' },
  { from: /logto_custom-content/g, to: 'riven_custom-content' },

  // Internal identifiers that cross the HTTP boundary (scopes, cookies, headers)
  { from: /urn:logto:/g, to: 'urn:riven:' },
  { from: /logto_user_id/g, to: 'riven_user_id' },
  { from: /logto-native-sdk/g, to: 'riven-native-sdk' },
  { from: /Logto-Static-Package/g, to: 'Riven-Static-Package' },
  { from: /Logto-App-Id/g, to: 'Riven-App-Id' },
  { from: /logtoCoreRequestId/g, to: 'rivenCoreRequestId' },
  { from: /x-logto-request-id/g, to: 'x-riven-request-id' },
  { from: /logto-core-request-id/g, to: 'riven-core-request-id' },
  { from: /logtoNativeSdk/g, to: 'rivenNativeSdk' },
  { from: /logtoSsr/g, to: 'rivenSsr' },
  { from: /hideLogtoBranding/g, to: 'hideRivenBranding' },
  { from: /i18nextLogtoUiLng/g, to: 'i18nextRivenUiLng' },
  { from: /\/tmp\/logto\//g, to: '/tmp/riven-auth/' },
];

// Replacements only applied to text files where breaking JS is not a concern.
// The negative lookbehind for '@' preserves workspace package names like '@logto/core'.
const textReplacements = [
  { from: /(?<!@)Logto/g, to: PRODUCT_NAME },
  { from: /logto\.io/g, to: PRODUCT_URL },
  { from: /Silverhand/g, to: VENDOR_NAME },
  { from: /The open source identity solution\./g, to: 'The Riven identity platform.' },
  { from: /contact@silverhand\.io/g, to: PRODUCT_URL },
];

const codeExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.css', '.scss', '.map']);
const textExtensions = new Set(['.html', '.md', '.json', '.txt']);

function patchFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isCode = codeExtensions.has(ext);
  const isText = textExtensions.has(ext);
  if (!isCode && !isText) return false;

  const original = fs.readFileSync(filePath, 'utf8');
  let text = original;

  for (const { from, to } of codeSafeReplacements) {
    text = text.replace(from, to);
  }

  if (isText) {
    for (const { from, to } of textReplacements) {
      text = text.replace(from, to);
    }
  }

  if (text !== original) {
    fs.writeFileSync(filePath, text, 'utf8');
    return true;
  }
  return false;
}

function walk(dir) {
  let patched = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      patched += walk(full);
    } else if (entry.isFile()) {
      if (patchFile(full)) patched++;
    }
  }
  return patched;
}

let total = 0;
for (const pkg of ['experience', 'console', 'account', 'demo-app', 'device-demo-app', 'core']) {
  const pkgDir = path.join(BASE_DIR, 'packages', pkg);
  if (!fs.existsSync(pkgDir)) {
    continue;
  }

  let count = 0;
  for (const subdir of ['dist', 'static']) {
    const dir = path.join(pkgDir, subdir);
    if (fs.existsSync(dir)) {
      count += walk(dir);
    }
  }
  console.log(`  patched ${count} files in packages/${pkg}`);
  total += count;
}

// Also patch root metadata files
const rootFiles = ['README.md', 'package.json', 'THIRDPARTY.md', 'AWESOME.md'].map((f) =>
  path.join(BASE_DIR, f)
);
for (const f of rootFiles) {
  if (fs.existsSync(f) && patchFile(f)) {
    console.log(`  patched root metadata: ${path.basename(f)}`);
    total++;
  }
}

console.log(`Total patched files: ${total}`);
