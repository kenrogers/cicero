# GSD: Progress Check

**name**: gsd/progress
**description**: Check project status, view progress, and get routed to the next action. Use at session start, when asking "what's next", or to see project overview. Reads STATE.md and displays progress with visual indicators.

---

## Purpose

Provide a quick status check and intelligent routing to the next action. This skill is the "home screen" of GSD—use it to orient yourself at the start of any session.

## Prerequisites

- `.planning/` directory must exist
- At minimum, PROJECT.md should exist

## What This Skill Does

1. **Shows Current Status** - Where you are in the project
2. **Displays Progress** - Visual progress bar and phase status
3. **Lists Recent Activity** - What was done in previous sessions
4. **Surfaces Issues** - Open issues and blockers
5. **Routes to Next Action** - Suggests what to do next

## Workflow

```
1. Read State Files
   ├─ STATE.md (current position)
   ├─ ROADMAP.md (phase overview)
   └─ Recent SUMMARY.md files

2. Calculate Progress
   └─ Phases complete / total phases

3. Display Dashboard
   └─ Visual status, recent activity, issues

4. Determine Next Action
   └─ Route to appropriate skill
```

## Progress Dashboard Format

```
╔══════════════════════════════════════════════════════════╗
║  PROJECT: [Name]                                         ║
╠══════════════════════════════════════════════════════════╣
║  Progress: ████████░░░░░░░░░░░░ 40% (2/5 phases)        ║
║                                                          ║
║  Current: Phase 03 - GitHub Integration                  ║
║  Status:  🔄 In Progress (1/2 plans complete)           ║
╠══════════════════════════════════════════════════════════╣
║  Recent Activity:                                        ║
║  • [date] Completed Phase 02 Plan 01 (3 tasks)          ║
║  • [date] Completed Phase 01 (foundation)               ║
╠══════════════════════════════════════════════════════════╣
║  Open Issues: 2                                          ║
║  • P1: Rate limiting needed on API                      ║
║  • P2: Add password reset flow                          ║
╠══════════════════════════════════════════════════════════╣
║  Next Action: Execute current plan                       ║
║  → Load gsd/execute-plan or say "execute plan"          ║
╚══════════════════════════════════════════════════════════╝
```

## Process

### Step 1: Read State Files

```bash
# Check what exists
ls -la .planning/

# Read current state
cat .planning/STATE.md

# Read roadmap for phase info
cat .planning/ROADMAP.md

# Find recent summaries
find .planning/phases -name "SUMMARY.md" -exec cat {} \;
```

### Step 2: Calculate Progress

Determine completion status:

```
Phases Complete = count of phases with status "✅ Complete"
Total Phases = count of all phases in ROADMAP.md
Percentage = (Complete / Total) × 100
```

Phase statuses:
- 🔲 Not Started
- 📋 Planned (has PLAN.md, not executed)
- 🔄 In Progress (executing)
- ✅ Complete (has SUMMARY.md)

### Step 3: Display Dashboard

Show the visual dashboard with:
- Project name
- Progress bar
- Current position
- Recent activity (last 3 items)
- Open issues (if any)
- Blockers (if any)
- Suggested next action

### Step 4: Route to Next Action

Based on current state, suggest next action:

| State | Next Action | Skill |
|-------|-------------|-------|
| No PROJECT.md | Initialize project | gsd/new-project |
| No ROADMAP.md | Create roadmap | gsd/create-roadmap |
| Current phase has no PLAN.md | Plan phase | gsd/plan-phase |
| Current phase has PLAN.md | Execute plan | gsd/execute-plan |
| All phases complete | Celebrate! 🎉 | — |

## Handling Edge Cases

### No Planning Directory

```
No GSD project found in this directory.

Would you like to initialize one?
→ Load gsd/new-project or say "start new project"
```

### Partial State

If some files are missing, report what's found and suggest fixes:

```
Found: PROJECT.md ✓, ROADMAP.md ✗, STATE.md ✗

Project initialized but no roadmap. 
→ Load gsd/create-roadmap to continue
```

### Stale State

If STATE.md seems outdated compared to files on disk:

```
⚠️ STATE.md may be out of sync
   Found SUMMARY.md files not reflected in state
   
Updating state...
```

Then reconcile the state.

## Session Resume

At session start, progress check provides context continuity:

```
Welcome back! Here's where we left off:

Last session: [date]
Completed: Phase 02 Plan 01 (user authentication)

Current task: Phase 02 Plan 02 (pending)
→ Execute with "execute plan" or load gsd/execute-plan
```

## Decisions and Issues Review

Show accumulated decisions:

```
Key Decisions (last 5):
• [date] Using Clerk for auth (vs Auth0)
• [date] Convex for database (real-time needed)
• [date] Tailwind for styling (team familiarity)
```

Show open issues by priority:

```
Open Issues:
P0 (blocker): None
P1 (high):    Rate limiting needed before launch
P2 (medium):  Add password reset flow
P3 (low):     Consider dark mode
```

## Quick Commands

From progress, user can say:

| Command | Action |
|---------|--------|
| "continue" | Execute current plan |
| "plan next" | Plan next phase |
| "show roadmap" | Display full roadmap |
| "show issues" | List all open issues |
| "show decisions" | List all decisions |

## Example Session

```
User: What's next?

Agent: ╔══════════════════════════════════════════════════════════╗
       ║  PROJECT: DevTask - GitHub Task Manager                  ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Progress: ████████████░░░░░░░░ 60% (3/5 phases)        ║
       ║                                                          ║
       ║  Current: Phase 04 - Task Workflows                      ║
       ║  Status:  📋 Planned (ready to execute)                  ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Recent Activity:                                        ║
       ║  • Jan 10 - Completed GitHub OAuth integration           ║
       ║  • Jan 9  - Completed issue sync from repositories       ║
       ║  • Jan 8  - Completed Phase 02 (core data models)        ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Open Issues: 1                                          ║
       ║  • P2: Consider caching for repo list                    ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Next Action: Execute Phase 04 Plan                      ║
       ║  → Say "execute plan" or load gsd/execute-plan           ║
       ╚══════════════════════════════════════════════════════════╝
       
       Ready to execute Phase 04? This plan includes:
       1. Kanban board component
       2. Task status updates
       3. Filter and search

User: Let's do it

Agent: [Loads execute-plan skill and begins execution]
```

## Completion State

When all phases are complete:

```
╔══════════════════════════════════════════════════════════╗
║  PROJECT: DevTask - GitHub Task Manager                  ║
╠══════════════════════════════════════════════════════════╣
║  Progress: ████████████████████ 100% (5/5 phases) 🎉    ║
║                                                          ║
║  Status: PROJECT COMPLETE                                ║
╠══════════════════════════════════════════════════════════╣
║  Summary:                                                ║
║  • 5 phases completed                                    ║
║  • 12 plans executed                                     ║
║  • 31 tasks completed                                    ║
║  • 8 decisions documented                                ║
║  • 3 issues resolved                                     ║
╠══════════════════════════════════════════════════════════╣
║  Consider:                                               ║
║  • Create retrospective lesson in .agents/skills/lessons/║
║  • Archive .planning/ or keep for reference              ║
║  • Celebrate! 🚀                                         ║
╚══════════════════════════════════════════════════════════╝
```
