# GSD: Work Session

**name**: gsd/work
**description**: Unified workflow loop that combines lessons and GSD into a single command. Use at the start of any work session. Automatically checks for relevant learnings, routes to the right GSD action, and prompts for retrospective when work completes. Triggers include "work", "start working", "let's work", "begin session", "work session".

---

## Purpose

Single entry point for the complete developer workflow. Eliminates the need to remember multiple commands by wrapping everything into one loop:

```
/work = /advise → /gsd → /retrospective
```

## The Work Loop

```
╔══════════════════════════════════════════════════════════════╗
║                    /work SESSION LOOP                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  1. LEARN FROM PAST                                     │ ║
║  │     Scan .agents/skills/lessons/ for relevant learnings │ ║
║  │     Apply proven patterns, avoid documented pitfalls    │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  2. DO THE WORK (GSD Loop)                              │ ║
║  │     progress → plan → execute → progress                │ ║
║  │     Repeat until phase/session complete                 │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  3. CAPTURE LEARNINGS                                   │ ║
║  │     Create retrospective lesson for future sessions     │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Workflow

### Phase 1: Learn From Past (Advise)

Before any work begins, automatically search for relevant lessons:

```
1. Determine Work Context
   ├─ If .planning/ exists: Read current phase from STATE.md
   ├─ If new project: Note the project type/domain
   └─ Identify key technologies and patterns involved

2. Search Lessons
   ├─ Scan .agents/skills/lessons/*/SKILL.md
   ├─ Match description fields against current context
   └─ Extract relevant learnings

3. Present Findings (if any)
   ├─ What worked in similar past work
   ├─ What to avoid (documented failures)
   └─ Specific parameters or approaches that succeeded
```

**Output Format:**

```
╔══════════════════════════════════════════════════════════════╗
║  📚 RELEVANT LEARNINGS FOUND                                 ║
╠══════════════════════════════════════════════════════════════╣
║  From: implementing-rate-limiting                            ║
║  • Use Convex's built-in rate limiter, not custom code       ║
║  • Set limits at 100/min for authenticated, 20/min for anon  ║
║  • Cache window: 60 seconds worked well                      ║
╠══════════════════════════════════════════════════════════════╣
║  From: clerk-webhook-debugging                               ║
║  • Webhook secret must match exactly (no trailing spaces)    ║
║  • Test with ngrok locally before deploying                  ║
╚══════════════════════════════════════════════════════════════╝
```

If no relevant lessons found:

```
📚 No relevant lessons found. Proceeding with fresh approach.
   (Tip: Run /retrospective after completing work to build your lessons library)
```

### Phase 2: Do The Work (GSD)

Route to appropriate GSD action based on project state:

```
Check Project State
├─ No .planning/ → Load gsd/new-project
├─ No ROADMAP.md → Load gsd/create-roadmap  
├─ No PLAN.md for current phase → Load gsd/plan-phase
├─ Has PLAN.md, not complete → Load gsd/execute-plan
└─ All phases complete → Phase 3 (retrospective)
```

**Display combined dashboard:**

```
╔══════════════════════════════════════════════════════════════╗
║  🔧 WORK SESSION                                             ║
╠══════════════════════════════════════════════════════════════╣
║  PROJECT: DevTask - GitHub Task Manager                      ║
║  Progress: ████████████░░░░░░░░ 60% (3/5 phases)            ║
║                                                              ║
║  Current: Phase 04 - Task Workflows                          ║
║  Status:  📋 Planned (ready to execute)                      ║
╠══════════════════════════════════════════════════════════════╣
║  📚 Applied Learnings:                                       ║
║  • Using proven Kanban patterns from task-board-lesson       ║
║  • Avoiding state management pitfall from prev session       ║
╠══════════════════════════════════════════════════════════════╣
║  Next Action: Execute Phase 04 Plan                          ║
║  Ready to proceed?                                           ║
╚══════════════════════════════════════════════════════════════╝
```

### Phase 3: Capture Learnings (Retrospective)

Triggered when:
- Phase completes successfully
- User says "done", "finished", or "stop"
- All project phases complete

**Prompt:**

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ PHASE COMPLETE                                           ║
╠══════════════════════════════════════════════════════════════╣
║  Completed: Phase 04 - Task Workflows                        ║
║  Tasks: 3/3 ✓                                                ║
║  Commits: 3                                                  ║
╠══════════════════════════════════════════════════════════════╣
║  📝 CAPTURE LEARNINGS?                                       ║
║                                                              ║
║  Would you like to create a lesson from this work?           ║
║  This helps future sessions avoid pitfalls and reuse         ║
║  what worked.                                                ║
║                                                              ║
║  Options:                                                    ║
║  • "yes" - Create lesson (recommended)                       ║
║  • "skip" - Continue without capturing                       ║
║  • "continue" - Move to next phase                           ║
╚══════════════════════════════════════════════════════════════╝
```

**If user says yes, create lesson:**

```
Creating lesson: .agents/skills/lessons/phase-04-task-workflows/

Capturing:
• What worked: [from session]
• What failed: [from session]  
• Key decisions: [from STATE.md]
• Exact parameters: [from commits]
• Lessons learned: [synthesized]

✓ Lesson created!
```

## Process Steps

### Step 1: Initialize Session

```bash
# Check for lessons directory
ls .agents/skills/lessons/

# Check for planning directory
ls .planning/

# Read current state if exists
cat .planning/STATE.md 2>/dev/null || echo "No project initialized"
```

### Step 2: Search for Relevant Lessons

```bash
# Find all lessons
find .agents/skills/lessons -name "SKILL.md" -exec cat {} \;
```

Parse each lesson's `description` field and match against:
- Current phase name
- Technologies in use (from package.json, Cargo.toml, etc.)
- Task types (auth, database, UI, API, etc.)

### Step 3: Route to GSD

Based on state, load the appropriate sub-skill:
- `gsd/new-project`
- `gsd/create-roadmap`
- `gsd/plan-phase`
- `gsd/execute-plan`

### Step 4: Monitor for Completion

Watch for phase completion signals:
- SUMMARY.md created for current phase
- User indicates "done" or "finished"
- All tasks in PLAN.md completed

### Step 5: Prompt for Retrospective

When work unit completes, offer to capture learnings.

If user agrees, create lesson in `.agents/skills/lessons/[descriptive-name]/SKILL.md`:

```markdown
# Lesson: [Descriptive Name]

**name**: [kebab-case-name]
**description**: [Verbose description with trigger phrases for discovery. Include technologies, patterns, problem types this lesson applies to.]

---

## Context

[What was being built, why, constraints]

## What Worked

- [Specific technique that succeeded]
- [Parameter values that worked]
- [Patterns that proved effective]

## What Failed

- [Approach that didn't work and why]
- [Pitfall encountered]
- [Time wasted on X]

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| [choice] | [why] | [result] |

## Exact Parameters

[Specific values, configurations, commands that worked]

## Lessons Learned

1. [Actionable insight for future]
2. [Another insight]

## Related

- [Links to relevant docs, issues, or other lessons]
```

## Mode Behavior

### Interactive Mode (default)

- Show lessons found and confirm understanding
- Confirm GSD routing decision
- Always prompt for retrospective

### YOLO Mode

- Apply lessons silently (just mention them briefly)
- Route to GSD action automatically
- Only prompt for retrospective on phase completion

## Quick Commands During Session

| Command | Action |
|---------|--------|
| "continue" | Proceed with suggested action |
| "lessons" | Show applied learnings again |
| "status" | Show current progress dashboard |
| "done" | End session, trigger retrospective |
| "skip lesson" | Continue without capturing |

## Example Full Session

```
User: /work

Agent: 🔧 Starting work session...

       Checking for relevant lessons...
       
       ╔══════════════════════════════════════════════════════════╗
       ║  📚 RELEVANT LEARNINGS FOUND                             ║
       ╠══════════════════════════════════════════════════════════╣
       ║  From: convex-schema-patterns                            ║
       ║  • Always add indexes for query patterns                 ║
       ║  • Use v.optional() for nullable fields                  ║
       ╚══════════════════════════════════════════════════════════╝
       
       Checking project state...
       
       ╔══════════════════════════════════════════════════════════╗
       ║  🔧 WORK SESSION                                         ║
       ╠══════════════════════════════════════════════════════════╣
       ║  PROJECT: My App                                         ║
       ║  Progress: ████░░░░░░░░░░░░░░░░ 20% (1/5 phases)        ║
       ║                                                          ║
       ║  Current: Phase 02 - Core Features                       ║
       ║  Status:  📋 Planned (ready to execute)                  ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Next Action: Execute Phase 02 Plan                      ║
       ╚══════════════════════════════════════════════════════════╝
       
       Ready to execute? Say "continue" or ask questions.

User: continue

Agent: [Executes plan with atomic commits...]
       
       ✅ Phase 02 Complete!
       
       ╔══════════════════════════════════════════════════════════╗
       ║  📝 CAPTURE LEARNINGS?                                   ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Would you like to create a lesson from this work?       ║
       ║  • "yes" - Create lesson                                 ║
       ║  • "skip" - Continue to next phase                       ║
       ╚══════════════════════════════════════════════════════════╝

User: yes

Agent: What were the key learnings from this phase?
       (Or I can synthesize from the session - say "auto")

User: auto

Agent: Creating lesson from session...
       
       ✓ Created: .agents/skills/lessons/phase-02-core-features/SKILL.md
       
       Captured:
       • What worked: Query patterns with proper indexing
       • What failed: Initial attempt without created_at index
       • Key insight: Always plan indexes before writing queries
       
       Continue to Phase 03? Say "continue" or "/work" to start fresh.
```

## Benefits

1. **Single Command**: No need to remember `/advise`, `/gsd`, `/progress`, `/retrospective`
2. **Automatic Context**: Lessons applied automatically based on current work
3. **Continuous Improvement**: Each session builds the lessons library
4. **No Lost Learnings**: Prompted to capture before moving on
5. **Flexible Exit**: Can stop at any point, still prompted for retrospective

## Integration Notes

- Works with existing GSD structure (`.planning/` directory)
- Lessons stored in `.agents/skills/lessons/` for cross-project sharing
- Compatible with both interactive and YOLO modes
- Can be interrupted and resumed - state preserved in STATE.md
