# /work - Unified Work Session

Start a unified work session that combines lessons, GSD workflow, and retrospective into a single loop.

## Workflow

```
/work = /advise → /gsd → /retrospective
```

## Instructions

Load the skill `gsd/work` and follow its complete workflow:

1. **LEARN** - Search `.agents/skills/lessons/` for relevant learnings based on current project context
2. **DO** - Route to appropriate GSD action based on project state:
   - No `.planning/` → Initialize new project
   - No `ROADMAP.md` → Create roadmap
   - No `PLAN.md` for current phase → Create plan
   - Has incomplete `PLAN.md` → Execute plan
3. **CAPTURE** - When work completes, prompt for retrospective to capture learnings

## Quick Commands

| Command | Action |
|---------|--------|
| `continue` | Proceed with suggested action |
| `lessons` | Show applied learnings again |
| `status` | Show current progress |
| `done` | End session, trigger retrospective |

See @.agents/skills/gsd/work/SKILL.md for full implementation details.
