---
description: Force pull latest commands (overwrites local changes)
---

echo "🔍 Checking for local changes in .agents/commands/..."
echo ""

# Check if there are uncommitted changes in the commands folder
if ! git diff --quiet -- .agents/commands/ || ! git diff --cached --quiet -- .agents/commands/; then
  echo "⚠️  WARNING: You have uncommitted changes in .agents/commands/"
  echo ""
  git status -- .agents/commands/
  echo ""
  echo "📋 Review your changes:"
  git diff -- .agents/commands/
  echo ""
  echo "Recommended steps:"
  echo "  1. Commit your changes first:"
  echo "     git add .agents/commands/"
  echo "     git commit -m 'Save local command customizations'"
  echo ""
  echo "  2. Then run this command again to pull updates"
  echo ""
  echo "⚠️  CONTINUING WILL OVERWRITE YOUR CHANGES!"
  echo ""
  echo "Press Ctrl+C to cancel, or Enter to continue and overwrite..."
  read
fi

echo "📥 Pulling latest commands from origin/main..."
echo ""

git fetch origin && git checkout origin/main -- .agents/commands/

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Commands updated successfully from origin/main!"
  echo "Changes are staged - run 'git commit' to save them"
  echo ""
  echo "💡 Let Amp help you:"
  echo "  Ask: 'Review the updated commands and commit them with a descriptive message'"
else
  echo ""
  echo "❌ Failed to update commands. Check git status for details."
  echo ""
  echo "💡 Let Amp help you:"
  echo "  Ask: 'Review the git status and help me understand what went wrong'"
fi
