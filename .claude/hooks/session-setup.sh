#!/usr/bin/env bash
# SessionStart hook — rehydrate tooling in a fresh ephemeral Claude Code container.
# Best-effort and non-fatal: dependency or network failures should not block startup.
set +e
cd "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}" || exit 0

install_node_dir() {
  dir="$1"
  [ -f "$dir/package.json" ] || return 0
  echo "session-setup: installing node deps in $dir (best-effort)" >&2
  (
    cd "$dir" || exit 0
    if [ -f bun.lockb ] || [ -f bun.lock ]; then
      command -v bun >/dev/null 2>&1 && bun install --frozen-lockfile >/dev/null 2>&1 || npm install --no-audit --no-fund >/dev/null 2>&1
    elif [ -f pnpm-lock.yaml ]; then
      command -v corepack >/dev/null 2>&1 && corepack enable >/dev/null 2>&1
      command -v pnpm >/dev/null 2>&1 && pnpm install --frozen-lockfile >/dev/null 2>&1 || npm install --no-audit --no-fund >/dev/null 2>&1
    elif [ -f yarn.lock ]; then
      command -v corepack >/dev/null 2>&1 && corepack enable >/dev/null 2>&1
      command -v yarn >/dev/null 2>&1 && yarn install --frozen-lockfile >/dev/null 2>&1 || npm install --no-audit --no-fund >/dev/null 2>&1
    elif [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
      npm ci --no-audit --no-fund >/dev/null 2>&1 || npm install --no-audit --no-fund >/dev/null 2>&1
    else
      npm install --no-audit --no-fund >/dev/null 2>&1
    fi
  ) || echo "session-setup: node install failed in $dir; continuing" >&2
}
for dir in "." "packages/cli" "packages/shared"; do
  install_node_dir "$dir"
done

echo "session-setup: ready" >&2
exit 0
