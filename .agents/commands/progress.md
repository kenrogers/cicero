---
description: Show GSD project status and route to next action
---

# Project Progress Check

## Step 1: Load State

```bash
cat .planning/STATE.md
cat .planning/config.json
```

**If STATE.md not found**:
```
No project state found.

Run: /gsd to get started
```

## Step 2: Display Status

Show current position and progress:

```markdown
## 📊 Project Status

**Mode**: [interactive/yolo] | **Depth**: [quick/standard/comprehensive]

**Current Position**:
- Phase: [XX-name]
- Plan: [PLAN.md / None]
- Tasks: [N/M completed]

**Progress**:
[████████░░░░░░░░░░░░] 40% (2/5 phases)

| Phase | Status | Summary |
|-------|--------|---------|
| 01-foundation | ✅ | Setup complete |
| 02-core | 🔄 | 2/3 tasks done |
| 03-features | 📋 | Planned |
| 04-polish | 🔲 | Not started |
```

## Step 3: Show Recent Activity

From STATE.md session log, show last 2-3 sessions:

```markdown
## Recent Sessions

**[Date]**: [Focus area] - [Brief outcome]
**[Date]**: [Focus area] - [Brief outcome]
```

## Step 4: Smart Routing

Based on state, recommend next action:

### If Active Plan Exists with Incomplete Tasks
```
**Next Action**: Continue executing current plan

You have [N] tasks remaining in Phase [XX].

Run: /execute
```

### If Phase Has No Plan
```
**Next Action**: Create plan for Phase [XX]

This phase needs a plan before execution.

Run: /plan
```

### If Phase Complete, More Phases Remain
```
**Next Action**: Plan next phase

Phase [XX] is complete. Phase [YY] is next.

Run: /plan
```

### If All Phases Complete
```
🎉 **Project Complete!**

All phases finished.

Consider:
- /retrospective - Capture learnings
- Review deferred items in STATE.md
```

### If Blockers Exist
```
⚠️ **Blockers Found**

The following items are blocking progress:
- [Blocker 1]
- [Blocker 2]

Resolve these before continuing.
```

## Step 5: Show Open Issues (if any)

If STATE.md has open issues:

```markdown
## Open Issues

| Priority | Issue |
|----------|-------|
| P1 | [description] |
| P2 | [description] |
```
