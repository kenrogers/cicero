# GSD: Plan Phase

**name**: gsd/plan-phase
**description**: Create an executable PLAN.md for a specific phase with 2-3 atomic tasks. Use when ready to work on a phase. Creates PLAN.md with XML-structured tasks that serve as prompts for execution.

---

## Purpose

Transform a phase's objectives into an executable plan. Plans are designed to be prompts themselves—not documents that need transformation. Each plan contains 2-3 atomic tasks that can be executed in sequence.

## Prerequisites

- `.planning/ROADMAP.md` must exist
- Phase directory must exist (e.g., `.planning/phases/01-foundation/`)
- No incomplete PLAN.md in target phase (or explicitly replacing)

## Core Principle

> **Plans ARE Prompts**
> 
> The PLAN.md file is designed to be fed directly to an AI assistant. Every task contains everything needed for execution without external context.

## Workflow

```
1. Read Context
   ├─ ROADMAP.md (phase objectives)
   ├─ STATE.md (current position, decisions)
   └─ Previous SUMMARY.md files (what's done)

2. Identify 2-3 Tasks
   └─ Atomic, verifiable, sequential

3. Create PLAN.md
   └─ XML-structured tasks with full context

4. Update STATE.md
   └─ Mark phase as "Planning"

5. Git Commit
   └─ "docs: plan phase XX"
```

## Task Atomicity

### The 2-3 Task Rule

Each plan should have **exactly 2-3 tasks**. This constraint:

- Keeps context window usage low
- Ensures focused execution
- Enables clean atomic commits
- Reduces cognitive load

### What Makes a Good Task?

✅ **Good Tasks:**
- "Create user authentication with Clerk"
- "Set up database schema for tasks table"
- "Implement task CRUD API endpoints"

❌ **Bad Tasks (too large):**
- "Build the entire auth system"
- "Create all API endpoints"

❌ **Bad Tasks (too small):**
- "Create a file"
- "Add an import"

### Task Dependencies

Tasks within a plan execute sequentially. Task 2 can depend on Task 1's output.

## XML Task Structure

Use the format from [../references/plan-format.md](../references/plan-format.md):

```xml
<task id="1">
  <objective>What this task accomplishes</objective>
  <context>
    Relevant background, decisions, constraints.
    Files to modify: path/to/file.ts
    Related patterns: reference existing code if applicable
  </context>
  <action>
    Step-by-step implementation instructions.
    Be specific about what to create/modify.
  </action>
  <verify>
    How to confirm task completion.
    Commands to run, expected outputs.
  </verify>
  <done>
    Commit message for this task.
    Format: type: description
  </done>
</task>
```

### Task Sections Explained

| Section | Purpose | Content |
|---------|---------|---------|
| `objective` | What, not how | Single sentence goal |
| `context` | Everything needed | Files, patterns, decisions, constraints |
| `action` | Step-by-step | Specific implementation steps |
| `verify` | Proof of completion | Commands, expected outputs, checks |
| `done` | Commit message | Conventional commit format |

## PLAN.md Template

Use template from [../templates/plan.md](../templates/plan.md):

```markdown
# Plan: [Phase Name]

> Phase [XX] of [Project Name]
> Created: [date]

## Objective

[What this phase accomplishes - from ROADMAP.md]

## Context

[Relevant state: recent decisions, blockers resolved, dependencies met]

## Tasks

<task id="1">
  <objective>First task objective</objective>
  <context>
    Relevant context for this specific task.
    Files: path/to/files
  </context>
  <action>
    1. First step
    2. Second step
    3. Third step
  </action>
  <verify>
    - [ ] Verification step 1
    - [ ] Verification step 2
  </verify>
  <done>type: commit message</done>
</task>

<task id="2">
  <objective>Second task objective</objective>
  <context>
    Builds on task 1.
    Files: path/to/files
  </context>
  <action>
    1. First step
    2. Second step
  </action>
  <verify>
    - [ ] Verification step
  </verify>
  <done>type: commit message</done>
</task>

## Success Criteria

- [ ] Criterion 1 (maps to phase deliverable)
- [ ] Criterion 2

## Notes

[Any additional context, warnings, or considerations]
```

## Commit Message Conventions

| Type | Use For |
|------|---------|
| `feat` | New feature or functionality |
| `fix` | Bug fix |
| `refactor` | Code restructuring, no behavior change |
| `test` | Adding or modifying tests |
| `docs` | Documentation only |
| `chore` | Maintenance, dependencies, config |
| `style` | Formatting, no code change |

## Process

### Step 1: Gather Context

```bash
# Read phase objectives
cat .planning/ROADMAP.md

# Read current state
cat .planning/STATE.md

# Check previous work
ls .planning/phases/*/SUMMARY.md
cat .planning/phases/01-foundation/SUMMARY.md  # if exists
```

### Step 2: Design Tasks

Consider:
- Phase deliverables from ROADMAP.md
- Open issues from STATE.md
- Decisions already made
- Technical constraints from PROJECT.md

Break the phase into 2-3 atomic tasks that:
1. Build on each other sequentially
2. Each result in a working state
3. Each have clear verification criteria

### Step 3: Write PLAN.md

Create `.planning/phases/XX-name/PLAN.md` with:
- Full context in each task (don't assume prior knowledge)
- Specific file paths
- Exact commands for verification
- Conventional commit messages

### Step 4: Update STATE.md

```markdown
## Current Position

**Active Phase**: XX-name
**Active Plan**: PLAN.md (tasks: 0/N completed)
**Status**: Ready to execute
```

### Step 5: Git Commit

```bash
git add .planning/
git commit -m "docs: plan phase XX-name"
```

## Multiple Plans Per Phase

Large phases may need multiple plans:
- `PLAN.md` → First plan
- `PLAN-02.md` → Second plan (after first completes)
- etc.

Each plan still follows the 2-3 task rule.

## Completion Checklist

- [ ] PLAN.md created with 2-3 tasks
- [ ] Each task has all XML sections filled
- [ ] Verification steps are specific and runnable
- [ ] Commit messages follow conventions
- [ ] STATE.md updated
- [ ] Git commit made

## Next Step

After planning:

> "Phase XX planned with [N] tasks. Ready to execute?
> Say 'execute plan' or load the gsd/execute-plan skill."

## Example Session

```
User: Plan phase 01

Agent: I'll create the plan for Phase 01: Foundation.

       Reading context...
       - Project: Task management app with GitHub integration
       - Phase 01 deliverables: Auth, database, project structure
       - Mode: interactive, Depth: standard

       I'll break this into 3 tasks:

       1. **Project Setup** - Initialize Next.js with TypeScript, configure Convex
       2. **Clerk Auth** - Set up authentication with Clerk
       3. **Database Schema** - Create initial Convex schema for users/tasks

       Each task builds on the previous. Creating PLAN.md...

       ✓ .planning/phases/01-foundation/PLAN.md created
       ✓ STATE.md updated
       
       Committed: "docs: plan phase 01-foundation"

       Ready to execute? Say "execute plan" to start.
```
