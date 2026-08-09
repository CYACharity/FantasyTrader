#!/bin/bash
# ============================================================
#  Fantasy Trader — one-command launcher
#  Usage:  bash deploy.sh
#  First run: sets up the repo and pushes to GitHub.
#  Every run after: pushes your latest changes live.
# ============================================================
set -e
cd "$(dirname "$0")"

BLUE='\033[1;34m'; GREEN='\033[1;32m'; YELLOW='\033[1;33m'; RED='\033[1;31m'; NC='\033[0m'
say()  { printf "${BLUE}▸ %s${NC}\n" "$1"; }
ok()   { printf "${GREEN}✓ %s${NC}\n" "$1"; }
warn() { printf "${YELLOW}! %s${NC}\n" "$1"; }
die()  { printf "${RED}✗ %s${NC}\n" "$1"; exit 1; }

echo ""
echo "═══════════════════════════════════════════"
echo "   FANTASY TRADER — DEPLOY"
echo "═══════════════════════════════════════════"
echo ""

# ---- 0. sanity ----
command -v git >/dev/null || die "git isn't installed. Install Xcode tools: xcode-select --install"
[ -f index.html ] || die "Run this from inside the Fantasy Trader folder."

# ---- 1. clear any stale lock from an interrupted commit ----
# git drops several different .lock files (index, HEAD, and one per ref). If a
# previous run was killed part-way through, any of them can be left behind and
# every one of them blocks the next commit. Sweep them all, not just index.lock.
STALE=$(find .git -name '*.lock' -type f 2>/dev/null | wc -l | tr -d ' ')
if [ "$STALE" != "0" ]; then
  find .git -name '*.lock' -type f -delete 2>/dev/null
  ok "Cleared $STALE stale git lock(s)"
fi

# ---- 2. repo exists? ----
# NOTE: we deliberately do NOT switch branches. The files in this folder are the
# real, current site. Whatever branch we're on gets published as "main" on GitHub.
if [ ! -d .git ]; then
  git init -q && ok "Started a new repository"
fi
CUR=$(git branch --show-current 2>/dev/null || echo "main")
[ -z "$CUR" ] && CUR="main"
ok "Publishing this folder (local branch: $CUR)"

# ---- 3. safety: never publish the secret Supabase key ----
if grep -rl --include="*.html" --include="*.js" "service_role" . 2>/dev/null \
     | grep -v "supabase-config.js" | grep -q .; then
  die "A service_role key was found in your files. Remove it before publishing."
fi
ok "Secret-key scan clean"

# ---- 4. commit everything ----
git add -A
if git diff --cached --quiet 2>/dev/null; then
  warn "No new changes to commit"
else
  MSG="${1:-Fantasy Trader update $(date '+%b %d, %-I:%M %p')}"
  git -c user.name="Wyatt Erdmann" -c user.email="swerdmann@icloud.com" \
      commit -q -m "$MSG"
  ok "Committed: $MSG"
fi

# ---- 5. make sure the remote points at Wyatt's repo ----
REPO="https://github.com/CYACharity/FantasyTrader.git"
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO"
else
  git remote add origin "$REPO"
fi
ok "Linked to github.com/CYACharity/FantasyTrader"

# ---- 6. push ----
echo ""
# Big first push? git's 1MB default buffer + HTTP/2 causes "RPC failed; HTTP 400".
# These two settings are the standard cure.
git config http.postBuffer 524288000     # 500MB
git config http.version HTTP/1.1
git config core.compression 0

# GitHub itself commits to the repo sometimes (e.g. it writes a CNAME file when
# you set a custom domain). Pull those down first or the push gets rejected.
if git ls-remote --exit-code --heads origin main >/dev/null 2>&1; then
  say "Syncing with GitHub first…"
  if git pull --rebase origin main >/dev/null 2>&1; then
    ok "Up to date with the remote"
  else
    git rebase --abort >/dev/null 2>&1 || true
    warn "Couldn't auto-sync — attempting push anyway"
  fi
fi

say "Pushing to GitHub… (a browser may open to sign you in)"
# HEAD:main = "publish whatever I have right now as the main branch"
if git push -u origin HEAD:main; then
  echo ""
  # First run needs the GitHub Pages + Supabase setup steps. After that they're
  # done forever, so don't nag about them on every deploy.
  if [ -f .ft-setup-done ]; then
    ok "LIVE — fantasytrader.co updates in about a minute"
    echo ""
  else
    ok "LIVE — your code is on GitHub"
    echo ""
    echo "═══════════════════════════════════════════"
    echo "  ONE-TIME SETUP (only needed right now):"
    echo ""
    echo "  1. Open:"
    echo "     https://github.com/CYACharity/FantasyTrader/settings/pages"
    echo "  2. Source → 'Deploy from a branch'"
    echo "  3. Branch: main    Folder: / (root)   → Save"
    echo "  4. Wait 60s → your site is live"
    echo ""
    echo "  Then in Supabase → Authentication → URL Configuration,"
    echo "  set Site URL to https://fantasytrader.co"
    echo "═══════════════════════════════════════════"
    echo ""
    touch .ft-setup-done
  fi
else
  echo ""
  die "Push failed — screenshot the message above and send it to Claude."
fi
