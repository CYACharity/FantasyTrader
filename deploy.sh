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
if [ -f .git/index.lock ]; then
  rm -f .git/index.lock && ok "Cleared a stale git lock"
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
say "Pushing to GitHub… (a browser may open to sign you in)"
# HEAD:main = "publish whatever I have right now as the main branch"
if git push -u origin HEAD:main; then
  echo ""
  ok "LIVE — your code is on GitHub"
  echo ""
  echo "═══════════════════════════════════════════"
  echo "  NEXT (only needed the very first time):"
  echo ""
  echo "  1. Open:"
  echo "     https://github.com/CYACharity/FantasyTrader/settings/pages"
  echo "  2. Source → 'Deploy from a branch'"
  echo "  3. Branch: main    Folder: / (root)   → Save"
  echo "  4. Wait 60s → your site is live at:"
  echo "     https://cyacharity.github.io/FantasyTrader/"
  echo ""
  echo "  Then in Supabase → Authentication → URL Configuration,"
  echo "  set Site URL to that address so signup emails work."
  echo "═══════════════════════════════════════════"
  echo ""
else
  echo ""
  die "Push failed — screenshot the message above and send it to Claude."
fi
