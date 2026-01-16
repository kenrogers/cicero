---
name: template-update
description: Update project from the Vibe Coders Starter Kit template. Use when user says "update from template", "sync with template", "pull template changes", or "get latest template updates".
---

# Template Update

Helps users update their project with the latest changes from the Vibe Coders Starter Kit template.

## Quick Update

Run the update script:

```bash
./scripts/update-from-template.sh
```

## Manual Process

If the script isn't available or you prefer manual control:

### 1. Add Template Remote (first time only)

```bash
git remote add template https://github.com/kenrogers/vibe-coders-starter-kit.git
```

### 2. Fetch Latest Changes

```bash
git fetch template
```

### 3. Preview Changes

```bash
git log HEAD..template/main --oneline
git diff HEAD..template/main --stat
```

### 4. Merge or Cherry-Pick

**Option A: Merge all changes**
```bash
git merge template/main --allow-unrelated-histories
```

**Option B: Cherry-pick specific commits**
```bash
git cherry-pick <commit-hash>
```

### 5. Resolve Conflicts

If conflicts occur:
1. Open conflicted files
2. Look for `<<<<<<<`, `=======`, `>>>>>>>` markers
3. Keep the code you want
4. Stage resolved files: `git add <file>`
5. Continue: `git commit`

## What Gets Updated

Template updates may include:
- Security middleware improvements
- New skills and lessons
- Bug fixes and dependency updates
- Documentation improvements

## What's Preserved

Your customizations are preserved:
- `.env` and `.env.local` files
- Custom components and pages
- Your Convex schema changes
- Any files you've modified (merged, not overwritten)
