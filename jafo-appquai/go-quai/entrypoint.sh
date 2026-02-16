#!/bin/sh
set -e

# Create data/config dirs and default settings.json if missing (replaces init container for Umbrel)
DATA_DIR="${DATA_DIR:-/data}"
CONFIG_DIR="${CONFIG_DIR:-/config}"
SETTINGS_FILE="${CONFIG_DIR}/settings.json"
mkdir -p "$DATA_DIR" "$CONFIG_DIR"
if [ ! -f "$SETTINGS_FILE" ]; then
  cat > "$SETTINGS_FILE" << 'DEFAULT'
{
  "quaiCoinbases": "0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678",
  "qiCoinbases": "0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678",
  "minerPreference": 0.5,
  "coinbaseLockup": 0
}
DEFAULT
fi

# Defaults (mainnet Colosseum, slice [0 0], Stratum enabled)
QUAI_COINBASES="${QUAI_COINBASES:-0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678}"
QI_COINBASES="${QI_COINBASES:-0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678}"
MINER_PREFERENCE="${MINER_PREFERENCE:-0.5}"
COINBASE_LOCKUP="${COINBASE_LOCKUP:-0}"
STRATUM_NAME="${STRATUM_NAME:-appquai-node}"

# Override from settings.json if present
SETTINGS_FILE="${CONFIG_DIR:-/config}/settings.json"
if [ -f "$SETTINGS_FILE" ] && command -v jq >/dev/null 2>&1; then
  tmp=$(jq -r '.quaiCoinbases // empty' "$SETTINGS_FILE"); [ -n "$tmp" ] && QUAI_COINBASES="$tmp"
  tmp=$(jq -r '.qiCoinbases // empty' "$SETTINGS_FILE"); [ -n "$tmp" ] && QI_COINBASES="$tmp"
  tmp=$(jq -r '.minerPreference // empty' "$SETTINGS_FILE"); [ -n "$tmp" ] && MINER_PREFERENCE="$tmp"
  tmp=$(jq -r '.coinbaseLockup // empty' "$SETTINGS_FILE"); [ -n "$tmp" ] && COINBASE_LOCKUP="$tmp"
fi

# Ensure defaults again if empty
QUAI_COINBASES="${QUAI_COINBASES:-0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678}"
QI_COINBASES="${QI_COINBASES:-0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678}"
MINER_PREFERENCE="${MINER_PREFERENCE:-0.5}"
COINBASE_LOCKUP="${COINBASE_LOCKUP:-0}"

# Data dir: use HOME so go-quai uses $HOME/.local/share/go-quai (Linux)
export HOME="${DATA_DIR:-/data}"

exec ./build/bin/go-quai start \
  --node.slices '[0 0]' \
  --node.quai-coinbases "$QUAI_COINBASES" \
  --node.qi-coinbases "$QI_COINBASES" \
  --node.miner-preference "$MINER_PREFERENCE" \
  --node.coinbase-lockup "$COINBASE_LOCKUP" \
  --node.stratum-enabled \
  --node.stratum-sha-addr "0.0.0.0:3333" \
  --node.stratum-scrypt-addr "0.0.0.0:3334" \
  --node.stratum-kawpow-addr "0.0.0.0:3335" \
  --node.stratum-api-addr "0.0.0.0:3336" \
  --node.stratum-name "$STRATUM_NAME"
