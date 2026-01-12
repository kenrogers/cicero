# Git Integration for GSD

## Core Philosophy

Every task produces exactly one atomic commit. This creates a clean, bisectable history where each commit represents a complete, working state.

## Commit Strategy

### One Task = One Commit

```
Task 1 → Complete → Verify → Commit
Task 2 → Complete → Verify → Commit
Task 3 → Complete → Verify → Commit
Plan Complete → Commit SUMMARY.md
```

### What Gets Committed

| Commit Type | Contains |
|-------------|----------|
| Task commit | Code changes for that task only |
| Docs commit | SUMMARY.md, STATE.md updates |

### What Doesn't Get Committed

- Partial task work (complete the task first)
- Multiple tasks together (separate commits)
- Unverified changes (verify first)

## Conventional Commits

GSD uses the conventional commits format:

```
type: description

[optional body]

[optional footer]
```

### Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature or capability | `feat: add user authentication` |
| `fix` | Bug fix | `fix: resolve null pointer in task list` |
| `refactor` | Code change without behavior change | `refactor: extract validation logic` |
| `test` | Adding or modifying tests | `test: add auth integration tests` |
| `docs` | Documentation only | `docs: complete phase 01 plan` |
| `chore` | Maintenance, dependencies, config | `chore: update dependencies` |
| `style` | Formatting, no code change | `style: fix indentation` |

### Description Guidelines

- Start with lowercase
- Use imperative mood ("add" not "added")
- No period at end
- Keep under 50 characters
- Be specific but concise

✅ Good:
- `feat: add GitHub OAuth authentication`
- `fix: handle empty task list in dashboard`
- `refactor: extract API client into service`

❌ Bad:
- `feat: Added some auth stuff.`
- `fix: fixed the bug`
- `update code`

## The Final Docs Commit

Every plan ends with a documentation commit:

```bash
git add .planning/
git commit -m "docs: complete phase XX plan"
```

This captures:
- SUMMARY.md for the completed plan
- Updated STATE.md

## Commit Workflow

### Before Starting a Task

```bash
# Ensure clean working state
git status

# Stash if needed
git stash

# Pull latest (if collaborating)
git pull
```

### After Completing a Task

```bash
# Stage all changes
git add -A

# Or stage specific files
git add path/to/file.ts path/to/other.ts

# Commit with message from <done> section
git commit -m "feat: implement task description"
```

### Verification Before Commit

Always verify before committing:

```bash
# Run type check
npm run typecheck

# Run tests
npm run test

# Run linter
npm run lint

# If all pass, commit
git add -A
git commit -m "feat: ..."
```

## Branch Strategy

### Default: Main Branch

Most GSD projects work directly on main:
- Solo developer = no merge conflicts
- Fast iteration
- No PR overhead

### When to Branch

Create branches for:
- Experimental features (might revert)
- Long-running changes (days, not hours)
- When specifically requested

Branch naming:
```
feature/short-description
fix/issue-description
experiment/what-testing
```

## Handling Mistakes

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)

```bash
git reset --hard HEAD~1
```

### Amend Last Commit

```bash
# Add forgotten changes
git add forgotten-file.ts
git commit --amend --no-edit

# Or fix commit message
git commit --amend -m "feat: better message"
```

### Fix Older Commit

Only if not pushed:
```bash
git rebase -i HEAD~3
# Mark commit to edit, make changes, continue
```

## Stashing

### When Interrupted Mid-Task

```bash
# Save work in progress
git stash push -m "WIP: task 2 partial"

# Later, restore
git stash pop
```

### Switching Context

```bash
# Before switching
git stash

# Do other work...

# Return and restore
git stash pop
```

## History Hygiene

### Avoid

- `git commit -m "WIP"`
- `git commit -m "fix"`
- `git commit -m "asdf"`
- Committing broken code
- Giant commits with multiple features

### Embrace

- Descriptive messages
- Atomic changes
- Verified code only
- Consistent formatting

## Integration with STATE.md

Update STATE.md commit count after each task:

```markdown
## Statistics

| Metric | Count |
|--------|-------|
| Commits Made | 5 |  ← Update this
```

## Integration with SUMMARY.md

Record commits in summary:

```markdown
## Commits Made

| Order | Hash | Message | Files |
|-------|------|---------|-------|
| 1 | abc123 | feat: add auth | 5 |
| 2 | def456 | feat: add schema | 3 |
```

Get hash after committing:
```bash
git log --oneline -1
# abc123 feat: add auth
```

## Handling Concurrent Changes

### If Working Across Sessions

```bash
# Start of session
git pull

# End of session (if pushing)
git push
```

### If Conflicts Occur

1. Read conflict markers
2. Choose correct version
3. Test thoroughly
4. Commit resolution

```bash
# After resolving
git add resolved-file.ts
git commit -m "chore: resolve merge conflict in auth"
```

## Example Execution Flow

```
Session Start
├── git status (ensure clean)
├── Read PLAN.md
│
├── Task 1: Add auth
│   ├── Implement changes
│   ├── Verify (npm run typecheck)
│   ├── git add -A
│   └── git commit -m "feat: add Clerk authentication"
│
├── Task 2: Add schema
│   ├── Implement changes
│   ├── Verify (npm run typecheck)
│   ├── git add -A
│   └── git commit -m "feat: create database schema"
│
├── Task 3: Add API
│   ├── Implement changes
│   ├── Verify (npm run typecheck)
│   ├── git add -A
│   └── git commit -m "feat: implement task API endpoints"
│
├── Create SUMMARY.md
├── Update STATE.md
├── git add .planning/
└── git commit -m "docs: complete phase 01 plan"
```

## Troubleshooting

### "Nothing to commit"

Check what's happening:
```bash
git status
git diff
```

Possible causes:
- Changes not saved
- Wrong directory
- Files in .gitignore

### "Untracked files"

```bash
# Add specific files
git add path/to/new/file.ts

# Or add all
git add -A
```

### "Commit message required"

Always use -m with message:
```bash
git commit -m "type: description"
```

### Pre-commit hooks failing

Fix the issues first:
```bash
npm run lint:fix
npm run format
git add -A
git commit -m "..."
```
