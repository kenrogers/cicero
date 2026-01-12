---
description: Main GSD orchestrator - routes to the right project management action
---

# Get Shit Done (GSD) Orchestrator

Check project status and route to the appropriate next action.

## Step 1: Check for Planning Directory

Check if `.planning/` directory exists:

```bash
ls -la .planning/ 2>/dev/null
```

## Step 2: Route Based on Status

### If `.planning/` Does NOT Exist

**No project initialized.**

Tell the user:
```
No GSD project found. Let's initialize one.

Run: /new-project
```

### If `.planning/` Exists

Route to progress check:

```
GSD project found. Checking status...

Run: /progress
```

The `/progress` command will analyze STATE.md and route to the appropriate next action (execute, plan, or complete).
