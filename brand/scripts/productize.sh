#!/bin/sh
# Riven Auth — image-level brand stripping (productize)
# Patches the upstream Logto-based container into Riven Auth.
# Runs inside the Docker build (Alpine Linux).

set -e

BASE_DIR="/etc/logto"
BRAND_DIR="${BASE_DIR}/brand"
ASSET_DIR="${BRAND_DIR}/assets"

LOGO_LIGHT_URL="https://cdn.rivenai.io/v1/brand/riven-wordmark-on-light.svg"
LOGO_DARK_URL="https://cdn.rivenai.io/v1/brand/riven-wordmark-on-dark.svg"
MARK_URL="https://cdn.rivenai.io/v1/brand/riven-mark.svg"

PRODUCT_NAME="Riven Auth"
VENDOR_NAME="Riven Holdings"
PRODUCT_URL="https://rivenai.io"

echo "==> Riven Auth productize starting..."

# -----------------------------------------------------------------------------
# 1. Replace favicon / touch-icon assets
# -----------------------------------------------------------------------------
replace_icon() {
  local target="$1"
  local src="$2"
  if [ -f "$target" ]; then
    cp -f "$src" "$target"
    echo "  replaced: $target"
  fi
}

find "$BASE_DIR/packages" -type f -name 'favicon.ico' | while read -r f; do
  replace_icon "$f" "$ASSET_DIR/favicon.ico"
done

find "$BASE_DIR/packages" -type f -name 'favicon.png' | while read -r f; do
  replace_icon "$f" "$ASSET_DIR/favicon.png"
done

find "$BASE_DIR/packages" -type f -name 'apple-touch-icon.png' | while read -r f; do
  replace_icon "$f" "$ASSET_DIR/apple-touch-icon.png"
done

# Replace the root logo.png that ships with the repo source tree
replace_icon "$BASE_DIR/logo.png" "$ASSET_DIR/logo.png"

# -----------------------------------------------------------------------------
# 2. Patch built JS/CSS/HTML to remove Logto branding
# -----------------------------------------------------------------------------
node "$BRAND_DIR/scripts/patch-dist.js"

# -----------------------------------------------------------------------------
# 3. Patch post-logout page (remove "Powered By" signature entirely)
# -----------------------------------------------------------------------------
POST_LOGOUT="$BASE_DIR/packages/core/static/html/post-logout/index.html"
if [ -f "$POST_LOGOUT" ]; then
  node "$BRAND_DIR/scripts/patch-html.js" "$POST_LOGOUT"
  echo "  patched: $POST_LOGOUT"
fi

# -----------------------------------------------------------------------------
# 4. Patch README / package metadata strings
# -----------------------------------------------------------------------------
find "$BASE_DIR" -maxdepth 1 -type f \( -name 'README.md' -o -name 'package.json' \) | while read -r f; do
  if [ -f "$f" ]; then
    sed -i \
      -e 's#Logto#'"$PRODUCT_NAME"'#g' \
      -e 's#logto\.io#'"$PRODUCT_URL"'#g' \
      -e 's#Silverhand#'"$VENDOR_NAME"'#g' \
      "$f" || true
    echo "  patched metadata: $f"
  fi
done

# Patch the core package metadata
CORE_PKG="$BASE_DIR/packages/core/package.json"
if [ -f "$CORE_PKG" ]; then
  sed -i \
    -e 's#The open source identity solution\.#The Riven identity platform.#g' \
    -e 's#contact@silverhand\.io#'"$PRODUCT_URL"'#g' \
    "$CORE_PKG" || true
  echo "  patched: $CORE_PKG"
fi

echo "==> Riven Auth productize complete."
