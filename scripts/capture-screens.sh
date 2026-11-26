#!/usr/bin/env bash
# Captures the current screen of a connected Android device into src/assets/screens/<name>.png
# at 720px wide, status and navigation bars included. Navigate the app to the screen first.
# Usage: scripts/capture-screens.sh <name> [more names, one capture per Enter]
set -euo pipefail

out_dir="$(cd "$(dirname "$0")/.." && pwd)/src/assets/screens"
mkdir -p "$out_dir"

for name in "$@"; do
  read -r -p "Open the '$name' screen on the device and press Enter… "
  tmp="$(mktemp -t volcancito-shot).png"
  adb exec-out screencap -p > "$tmp"
  magick "$tmp" -resize 720x "$out_dir/$name.png"
  rm -f "$tmp"
  echo "Saved $out_dir/$name.png"
done
