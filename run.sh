#!/usr/bin/env bash
# Runs the Tangent site locally at http://localhost:8080
# Usage: ./run.sh   (or:  bash run.sh)
PORT=8080
cd "$(dirname "$0")"
echo "Serving Tangent at http://localhost:$PORT"
echo "Press Ctrl+C to stop."
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  python -m SimpleHTTPServer "$PORT"
elif command -v npx >/dev/null 2>&1; then
  npx --yes serve -l "$PORT" .
else
  echo "No Python or Node/npx found. Install one, or just double-click index.html."
  exit 1
fi
