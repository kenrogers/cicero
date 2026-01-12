---
description: Push security skills to the secure-claude-skills repository
---

1. bump version: npm version patch --no-git-tag-version --prefix .agents/skills/security
2. commit version bump: git add .agents/skills/security/package.json .agents/skills/security/package-lock.json && git commit -m "Bump security skills package to version X.X.X" && git push
3. push subtree: git subtree push --prefix=.agents/skills/security https://github.com/harperaa/secure-claude-skills.git main
4. pull changes: git -C ../secure-claude-skills-package pull --rebase
5. publish to npm: npm publish ../secure-claude-skills-package
