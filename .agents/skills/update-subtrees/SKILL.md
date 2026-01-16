# Update Subtrees Skill

Update external skills that are managed via git subtree.

## Registered Subtrees

| Name | Prefix | Remote | Branch |
|------|--------|--------|--------|
| vercel-skills | `.agents/skills/vercel-skills` | `vercel-skills` | `main` |

## Update Commands

### Update All Subtrees

```bash
# Vercel Agent Skills
git subtree pull --prefix=.agents/skills/vercel-skills vercel-skills main --squash
```

### Update a Specific Subtree

```bash
git subtree pull --prefix=<prefix> <remote> <branch> --squash
```

## Adding New Subtrees

When adding a new subtree-based skill:

1. Add the remote:
   ```bash
   git remote add <name> <repo-url>
   ```

2. Add the subtree:
   ```bash
   git subtree add --prefix=.agents/skills/<name> <remote> <branch> --squash
   ```

3. **Update this file** to register the new subtree in the table above.

## Troubleshooting

### "Working tree has modifications"
Commit or stash changes before pulling subtree updates.

### Merge conflicts
Resolve conflicts manually, then commit. The subtree pull is just a merge operation.

### Remote not found
Re-add the remote:
```bash
git remote add vercel-skills https://github.com/vercel-labs/agent-skills.git
```
