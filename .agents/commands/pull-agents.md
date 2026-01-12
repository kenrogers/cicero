---
description: Force pull latest agents (overwrites local changes)
---

echo "🔍 Checking for local changes in .agents/..."
echo ""

# Check if there are uncommitted changes in the agents folder
if ! git diff --quiet -- .agents/ || ! git diff --cached --quiet -- .agents/; then
  echo "⚠️  WARNING: You have uncommitted changes in .agents/"
  echo ""
  git status -- .agents/
  echo ""
  echo "📋 Review your changes:"
  git diff -- .agents/
  echo ""
  echo "Recommended steps:"
  echo "  1. Commit your changes first:"
  echo "     git add .agents/"
  echo "     git commit -m 'Save local agent customizations'"
  echo ""
  echo "  2. Then run this command again to pull updates"
  echo ""
  echo "⚠️  CONTINUING WILL OVERWRITE YOUR CHANGES!"
  echo ""
  echo "Press Ctrl+C to cancel, or Enter to continue and overwrite..."
  read
fi

echo "📥 Pulling latest agents from origin/main..."
echo ""

git fetch origin && git checkout origin/main -- .agents/

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Agents updated successfully from origin/main!"
  echo "Changes are staged - run 'git commit' to save them"
  echo ""
  echo "💡 Let Amp help you:"
  echo "  Ask: 'Review the updated agents and commit them with a descriptive message'"
else
  echo ""
  echo "❌ Failed to update agents. Check git status for details."
  echo ""
  echo "💡 Let Amp help you:"
  echo "  Ask: 'Review the git status and help me understand what went wrong'"
fi
