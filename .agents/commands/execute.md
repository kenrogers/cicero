---
description: Execute current PLAN.md with atomic commits per task
---

# Execute Current Plan

## Step 1: Find Active Plan

```bash
cat .planning/STATE.md
```

Locate the active phase and find its PLAN.md:

```bash
cat .planning/phases/[XX-phase-name]/PLAN.md
```

**If no active plan found**:
```
No active plan to execute.

Run: /plan
```

## Step 2: Determine Resume Point

Check STATE.md for task progress. If tasks were previously completed:
- Skip completed tasks
- Resume from next incomplete task

## Step 3: Execute Tasks Sequentially

For each task in PLAN.md:

### 3a. Read Task Block

Parse the `<task>` XML block:
- `<context>` - Understand what's needed
- `<instructions>` - Follow step by step
- `<verification>` - Know how to verify
- `<commit>` - Know the commit message

### 3b. Implement

Execute the instructions exactly as written. The plan IS the prompt.

### 3c. Verify

Run all verification steps from `<verification>`:
- Run specified commands
- Check expected outputs
- Fix any issues before proceeding

### 3d. Commit (Atomic)

```bash
git add [changed files]
git commit -m "[commit message from task]"
```

One task = one commit. See @.agents/skills/gsd/references/git-integration.md

### 3e. Update STATE.md

After each task:
```markdown
**Task Progress**: [N/total] completed
```

## Step 4: Handle Deviations

| Situation | Action |
|-----------|--------|
| Bug discovered | Fix inline, include in task commit |
| Missing dependency | Add it, continue |
| Scope question | Ask user before proceeding |
| Blocker found | Log in STATE.md, ask user |
| Tests failing | Fix before moving to next task |

**Never skip verification**. If it fails, fix it.

## Step 5: Create SUMMARY.md

After all tasks complete, create `.planning/phases/[XX]/SUMMARY.md`:

Use template from @.agents/skills/gsd/templates/summary.md

Include:
- What was accomplished
- Key decisions made
- Issues encountered
- Lessons learned (brief)
- Files created/modified

## Step 6: Update STATE.md

Mark phase complete:
```markdown
**Active Phase**: [next phase or "Complete"]
**Task Progress**: Complete
**Status**: Phase [XX] finished
```

Update progress table:
```markdown
| [XX]-name | ✅ Complete | 1 | [N] |
```

Add session log entry with summary.

Log any decisions made during execution.

## Step 7: Final Commit

```bash
git add .planning/
git commit -m "docs: complete phase [XX-name]

- All N tasks completed
- SUMMARY.md created
- STATE.md updated"
```

## Step 8: Route to Next Action

Check what comes next:

**If more phases remain**:
```
✅ Phase [XX] complete!

Summary:
- [key accomplishment 1]
- [key accomplishment 2]

Next phase: [YY-name]
Run: /plan
```

**If all phases complete**:
```
🎉 Project complete!

All phases finished. Consider:
- Run /retrospective to capture learnings
- Review STATE.md for any deferred items
- Celebrate!
```

**If plan has more sub-plans (PLAN-02.md, etc.)**:
```
✅ Plan complete!

More plans exist for this phase.
Run: /execute to continue with PLAN-02.md
```
