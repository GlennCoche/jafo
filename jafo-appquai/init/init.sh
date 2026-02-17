#!/bin/sh
set -e
# Creates QUAI node data dirs and default settings.json (only if missing).
# Persists JWT_SECRET to .env so app_proxy works after SSH restarts (same as willitmod-dev-bch).
# Expects APP_DATA_DIR or /appdata as base (e.g. /appdata from volume mount).

BASE="${APP_DATA_DIR:-/appdata}"
QUAI_DATA="${BASE}/quai-data"
CONFIG_DIR="${BASE}/config"
SETTINGS_FILE="${CONFIG_DIR}/settings.json"

mkdir -p "$QUAI_DATA" "$CONFIG_DIR"

# Persist JWT secret for app_proxy (Umbrel injects JWT_SECRET; without this, SSH restarts can leave it empty)
if [ -n "${JWT_SECRET:-}" ]; then
  envfile="${BASE}/.env"
  tmp="${BASE}/.env.tmp"
  if [ -f "$envfile" ]; then
    grep -v '^JWT_SECRET=' "$envfile" > "$tmp" 2>/dev/null || true
  else
    : > "$tmp"
  fi
  printf 'JWT_SECRET=%s\n' "$JWT_SECRET" >> "$tmp"
  chmod 600 "$tmp" 2>/dev/null || true
  chown 1000:1000 "$tmp" 2>/dev/null || true
  mv "$tmp" "$envfile"
fi

if [ ! -f "$SETTINGS_FILE" ]; then
  cat > "$SETTINGS_FILE" << 'DEFAULT'
{
  "quaiCoinbases": "0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678",
  "qiCoinbases": "0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678",
  "minerPreference": 0.5,
  "coinbaseLockup": 0
}
DEFAULT
  echo "Created default settings.json at $SETTINGS_FILE"
fi

# Ensure writable by app user (1000:1000 typical for Umbrel)
chown -R 1000:1000 "$BASE" 2>/dev/null || true
echo "Init complete: quai-data and config ready."
