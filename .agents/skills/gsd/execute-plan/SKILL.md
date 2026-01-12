# GSD: Execute Plan

**name**: gsd/execute-plan
**description**: Execute a PLAN.md file with atomic commits per task. Use when ready to implement a planned phase. Runs tasks sequentially, commits after each, creates SUMMARY.md on completion, and updates STATE.md throughout.

---

## Purpose

Execute the tasks in a PLAN.md file, committing atomically after each task. This skill handles the implementation phase of GSD, maintaining momentum while capturing progress.

## Prerequisites

- Active PLAN.md in current phase directory
- Git working tree clean (or stash pending changes)
- All task dependencies met (previous phases complete)

## Core Principles

### Atomic Commits

One commit per task. The `<done>` section of each task contains the commit message.

```
Task 1 → Execute → Verify → Commit → Task 2 → Execute → Verify → Commit → ...
```

### Deviation Rules

| Situation | Action |
|-----------|--------|
| Bug discovered during task | Auto-fix, include in task commit |
| Missing dependency | Add and continue |
| Minor adjustment needed | Make it, document in SUMMARY.md |
| Architectural question | **STOP** and ask user |
| Scope creep detected | Log issue in STATE.md, stay on task |
| Tests failing | Fix before commit |
| Verification fails | Debug and retry, don't skip |

### Mode Behavior

**Interactive Mode:**
- Confirm before starting each task
- Ask about ambiguous situations
- Review commit message before committing

**YOLO Mode:**
- Execute without confirmation
- Only pause for architectural decisions
- Commit automatically

## Workflow

```
1. Load Plan
   └─ Read PLAN.md, validate structure

2. For Each Task:
   ├─ Read task XML
   ├─ Execute action steps
   ├─ Run verification
   ├─ Git commit with done message
   └─ Update STATE.md

3. Create SUMMARY.md
   └─ What was done, decisions, issues

4. Final Commit
   └─ "docs: complete phase XX plan"

5. Update STATE.md
   └─ Mark plan complete, route to next action
```

## Process

### Step 1: Load and Validate Plan

```bash
# Read the plan
cat .planning/phases/XX-name/PLAN.md

# Check git status
git status

# Stash if needed
git stash  # if uncommitted changes
```

Validate:
- [ ] PLAN.md has valid XML task structure
- [ ] All tasks have required sections
- [ ] Verification steps are actionable

### Step 2: Execute Tasks

For each `<task>`:

#### 2a. Parse Task

Extract from XML:
- `objective`: What we're doing
- `context`: Background needed
- `action`: Steps to follow
- `verify`: How to confirm success
- `done`: Commit message

#### 2b. Execute Action

Follow the action steps precisely. If steps are ambiguous:
- **Interactive mode**: Ask for clarification
- **YOLO mode**: Make reasonable choice, document in SUMMARY.md

#### 2c. Verify Completion

Run verification steps from `<verify>`:

```bash
# Example verifications
npm run typecheck
npm run test
curl http://localhost:3000/api/health
```

**If verification fails:**
1. Debug the issue
2. Fix the problem
3. Re-verify
4. Do NOT skip verification

#### 2d. Commit

```bash
git add -A
git commit -m "feat: implement user authentication"  # from <done>
```

#### 2e. Update STATE.md

```markdown
**Active Plan**: PLAN.md (tasks: 1/3 completed)
```

### Step 3: Create SUMMARY.md

After all tasks complete, create `.planning/phases/XX-name/SUMMARY.md`:

Use template from [../templates/summary.md](../templates/summary.md):

```markdown
# Summary: [Phase Name]

> Completed: [date]
> Duration: [time if tracked]

## Completed Tasks

### Task 1: [Objective]
- **Commit**: [hash] [message]
- **Files Changed**: [list key files]
- **Notes**: [any deviations or decisions]

### Task 2: [Objective]
- **Commit**: [hash] [message]
- **Files Changed**: [list key files]
- **Notes**: [any deviations or decisions]

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| [decision] | [why] |

## Issues Discovered

| Issue | Priority | Action |
|-------|----------|--------|
| [issue] | [P0-P3] | [logged/fixed/deferred] |

## Deviations from Plan

[Any changes from original plan and why]

## Next Steps

[What comes next - next plan in phase, or next phase]
```

### Step 4: Final Commit

```bash
git add .planning/
git commit -m "docs: complete phase XX-name plan"
```

### Step 5: Update STATE.md

```markdown
## Current Position

**Active Phase**: XX-name
**Active Plan**: Complete
**Status**: Ready for next plan or phase

## Progress

| Phase | Status | Plans | Completed |
|-------|--------|-------|-----------|
| 01-foundation | ✅ Complete | 1 | 1 |
```

## Handling Issues During Execution

### Bugs Found

```markdown
# In SUMMARY.md
## Issues Discovered

| Issue | Priority | Action |
|-------|----------|--------|
| Race condition in auth | P1 | Fixed in task 2 commit |
```

### Scope Creep

If you identify work outside the current task:

```markdown
# In STATE.md
## Open Issues

| ID | Issue | Priority | Phase |
|----|-------|----------|-------|
| 1 | Add password reset flow | P2 | 01-foundation |
```

Do NOT implement it. Stay on task.

### Blockers

If blocked:

```markdown
# In STATE.md
## Blockers

- [ ] Need API key for service X (waiting on user)
```

Pause and notify user.

## Commit Message Examples

| Type | Example |
|------|---------|
| feat | `feat: add user authentication with Clerk` |
| fix | `fix: resolve race condition in task creation` |
| refactor | `refactor: extract validation into shared utility` |
| test | `test: add integration tests for auth flow` |
| docs | `docs: complete phase 01 plan` |
| chore | `chore: configure ESLint rules` |

## Completion Checklist

- [ ] All tasks executed and verified
- [ ] Each task has atomic commit
- [ ] SUMMARY.md created
- [ ] Decisions logged
- [ ] Issues captured
- [ ] STATE.md updated
- [ ] Final docs commit made

## Next Step

After execution:

> "Phase XX plan complete! 
> - [N] tasks executed
> - [N] commits made
> - [N] issues logged
>
> Next: [plan next part of phase / plan next phase]
> Check status with 'progress' or continue with 'plan phase XX'"

## Example Session

```
User: Execute plan

Agent: Loading plan for Phase 01: Foundation...

       Plan has 3 tasks:
       1. Project Setup
       2. Clerk Auth  
       3. Database Schema

       Mode: interactive
       
       Starting Task 1: Project Setup
       
       Executing:
       - Initializing Next.js project...
       - Configuring TypeScript...
       - Setting up Convex...
       
       Verifying:
       ✓ npm run typecheck passes
       ✓ npm run dev starts without errors
       
       Committing: "feat: initialize Next.js with Convex"
       
       ---
       
       Task 2: Clerk Auth
       
       Executing:
       - Installing @clerk/nextjs...
       - Creating middleware.ts...
       - Adding ClerkProvider...
       
       Verifying:
       ✓ Sign-in page renders
       ✓ Protected routes redirect
       
       Committing: "feat: add Clerk authentication"
       
       ---
       
       Task 3: Database Schema
       
       Executing:
       - Creating convex/schema.ts...
       - Defining users and tasks tables...
       - Running convex dev...
       
       Verifying:
       ✓ Schema deploys successfully
       ✓ Types generated
       
       Committing: "feat: create initial database schema"
       
       ---
       
       All tasks complete! Creating SUMMARY.md...
       
       ✓ .planning/phases/01-foundation/SUMMARY.md created
       ✓ STATE.md updated
       
       Committed: "docs: complete phase 01-foundation plan"
       
       Phase 01 complete! Ready for Phase 02?
       Say "plan phase 02" to continue.
```
