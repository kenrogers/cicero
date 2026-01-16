# GSD: Work Session

**name**: gsd/work
**description**: Unified workflow loop that combines lessons, Oracle planning, Librarian research, and TDD into a single command. All feature work uses TDD (Red-Green-Refactor) by default. Automatically checks for relevant learnings, leverages Oracle for planning/debugging, routes to GSD actions, and prompts for retrospective when work completes. Triggers include "work", "start working", "let's work", "begin session", "work session".

---

## Purpose

Single entry point for the complete developer workflow. Eliminates the need to remember multiple commands by wrapping everything into one intelligent loop:

```
/work = /advise → Oracle Review → TDD Execution → Oracle Retrospective
```

**All feature work uses TDD by default.** Every implementation follows the Red-Green-Refactor cycle.

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
║  │     🔮 Librarian: Research similar OSS patterns         │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  2. PLAN WITH ORACLE                                    │ ║
║  │     Before execution, Oracle reviews plan quality       │ ║
║  │     Catches architectural issues, missing edge cases    │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  3. DO THE WORK (TDD Loop)                              │ ║
║  │     For each feature:                                   │ ║
║  │     🔴 RED: Write failing test first                    │ ║
║  │     🟢 GREEN: Minimal code to pass                      │ ║
║  │     🔵 REFACTOR: Clean up, tests must pass              │ ║
║  │     🌐 BROWSER: Test UI in browser (if UI relevant)     │ ║
║  │     ✓ COMMIT: Test + implementation together            │ ║
║  │     🔮 Oracle: Debug failures, review changes           │ ║
║  │     📚 Librarian: Research APIs, find patterns          │ ║
║  │     🔄 HANDOFF: Fresh context after each task           │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  4. VERIFY UI (if applicable)                           │ ║
║  │     🌐 agent-browser: Open page, snapshot, verify       │ ║
║  │     Only commit after browser test passes               │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  5. CAPTURE LEARNINGS                                   │ ║
║  │     🔮 Oracle: Synthesize insights from session         │ ║
║  │     Create retrospective lesson for future sessions     │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Oracle & Librarian Integration

### When to Use Oracle (GPT-5 Reasoning)

| Trigger | Action |
|---------|--------|
| **Plan created** | Review plan for quality, missing edge cases, architectural issues |
| **Test failures** | Debug with full context of failing tests and related files |
| **Complex multi-file changes** | Get architecture guidance before making changes |
| **Stuck > 2 attempts** | Ask Oracle for debugging help with accumulated context |
| **Retrospective** | Synthesize session learnings into actionable insights |

**Oracle Invocation Pattern:**
```
"I'm going to consult the Oracle to [review this plan / debug this failure / analyze this architecture]..."
```

### When to Use Librarian (Multi-Repo Research)

| Trigger | Action |
|---------|--------|
| **New external library** | "How does [library] handle [pattern]?" |
| **Unfamiliar API** | Research implementation patterns in library source |
| **Architecture question** | "How does [OSS project] structure their [feature]?" |
| **Best practices** | Find battle-tested patterns from established projects |

**Librarian Invocation Pattern:**
```
"I'm going to ask the Librarian to research how [project] implements [feature]..."
```

### Decision Matrix

```
┌─────────────────────────────────────────────────────────────┐
│  WHICH TOOL TO USE?                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Need to PLAN or DEBUG?                                     │
│  ├─ Yes → Use ORACLE                                        │
│  │        (reviews, analyzes, reasons about YOUR code)      │
│  │                                                          │
│  Need to RESEARCH external code?                            │
│  ├─ Yes → Use LIBRARIAN                                     │
│  │        (reads GitHub repos, finds patterns, explains)    │
│  │                                                          │
│  Need to SEARCH local codebase?                             │
│  ├─ Yes → Use finder/Grep                                   │
│  │        (fast local search)                               │
│  │                                                          │
│  Need to READ docs online?                                  │
│  └─ Yes → Use web_search/read_web_page                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Workflow

### Phase 1: Learn From Past (Advise + Librarian)

Before any work begins, automatically search for relevant lessons and research patterns:

```
1. Determine Work Context
   ├─ If .planning/ exists: Read current phase from STATE.md
   ├─ If new project: Note the project type/domain
   └─ Identify key technologies and patterns involved

2. Search Local Lessons
   ├─ Scan .agents/skills/lessons/*/SKILL.md
   ├─ Match description fields against current context
   └─ Extract relevant learnings

3. Research External Patterns (Librarian) - Optional
   ├─ If working with unfamiliar library/framework
   ├─ Ask Librarian: "How does [library] implement [pattern]?"
   └─ Extract best practices from established OSS projects

4. Present Findings (if any)
   ├─ What worked in similar past work
   ├─ What to avoid (documented failures)
   ├─ Specific parameters or approaches that succeeded
   └─ Patterns from OSS projects (if researched)
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

### Phase 2: Plan with Oracle Review

Before executing any plan, have Oracle review it for quality:

```
1. Check if PLAN.md exists for current phase
   ├─ If no plan → Create plan first (gsd/plan-phase)
   └─ If plan exists → Proceed to review

2. Oracle Plan Review
   ├─ Pass PLAN.md and relevant context files to Oracle
   ├─ Ask: "Review this plan for quality, missing edge cases, and architectural issues"
   └─ Oracle identifies potential problems BEFORE execution

3. Present Review Findings
   ├─ Architectural concerns
   ├─ Missing edge cases
   ├─ Suggested improvements
   └─ Risk assessment
```

**Oracle Review Output:**

```
╔══════════════════════════════════════════════════════════════╗
║  🔮 ORACLE PLAN REVIEW                                       ║
╠══════════════════════════════════════════════════════════════╣
║  Plan: Phase 03 - Authentication System                      ║
║                                                              ║
║  ✅ Strengths:                                               ║
║  • Good separation of concerns                               ║
║  • Proper use of Clerk patterns                              ║
║                                                              ║
║  ⚠️  Concerns:                                               ║
║  • Missing rate limiting on auth endpoints                   ║
║  • No error handling for webhook failures                    ║
║                                                              ║
║  💡 Suggestions:                                             ║
║  • Add task for rate limiting middleware                     ║
║  • Include webhook retry logic                               ║
╚══════════════════════════════════════════════════════════════╝
```

### Phase 3: Do The Work (TDD Execution)

Route to appropriate GSD action based on project state:

```
Check Project State
├─ No .planning/ → Load gsd/new-project
├─ No ROADMAP.md → Load gsd/create-roadmap  
├─ No PLAN.md for current phase → Load gsd/plan-phase
├─ Has PLAN.md, not complete → Execute with TDD
└─ All phases complete → Phase 4 (retrospective)
```

#### Domain-Specific Skills

**Load specialized skills based on task context:**

| Task Type | Skill to Load | Triggers |
|-----------|---------------|----------|
| **UI/Frontend** | `frontend-design` | design, UI, mockup, landing page, dashboard, component, beautify, style, layout |
| **Security** | `security-architecture-overview` | auth, CSRF, rate limiting, input validation, security |
| **Payments** | `payment-security-clerk-billing-stripe` | payment, Stripe, billing, subscription |

**UI Work Flow:**
When executing tasks involving UI components, pages, or visual design:
1. Load `frontend-design` skill first
2. Use `painter` tool to explore visual concepts before coding
3. Implement code following the skill's design guidelines
4. Verify in browser before committing

#### TDD Execution Flow (Default for All Features)

**Every feature follows Red-Green-Refactor.** This is non-negotiable.

```
╔══════════════════════════════════════════════════════════════╗
║  TDD EXECUTION PER TASK                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🔴 RED PHASE                                                ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  1. Write test describing expected behavior             │ ║
║  │  2. DO NOT think about implementation yet               │ ║
║  │  3. Run test → Confirm it FAILS                         │ ║
║  │  4. Document: "Test fails because [X] doesn't exist"    │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  🟢 GREEN PHASE                                              ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  1. Write MINIMAL code to make test pass                │ ║
║  │  2. No optimization, no extras                          │ ║
║  │  3. "Fake it till you make it" is valid                 │ ║
║  │  4. Run test → Confirm it PASSES                        │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  🔵 REFACTOR PHASE                                           ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  1. Evaluate: Does code need cleanup?                   │ ║
║  │  2. If yes: Extract utilities, improve naming           │ ║
║  │  3. If no: Skip (valid decision)                        │ ║
║  │  4. Run test → Confirm still PASSES                     │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  🌐 BROWSER TEST (if UI relevant)                            ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  1. Determine if task affects UI (pages, components)    │ ║
║  │  2. If YES: Run agent-browser verification              │ ║
║  │     a. Open affected page in browser                    │ ║
║  │     b. Get interactive snapshot                         │ ║
║  │     c. Verify expected elements exist                   │ ║
║  │     d. Test key interactions                            │ ║
║  │  3. If test fails: Debug with Oracle, fix, re-test      │ ║
║  │  4. If NO UI impact: Skip browser test                  │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ✓ COMMIT (only after browser test passes)                   ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  git add -A                                             │ ║
║  │  git commit -m "feat: [feature] with tests"             │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  🔄 HANDOFF (fresh context for next task)                    ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  After each atomic task completion:                     │ ║
║  │  "Handoff and continue with next task in PLAN.md"       │ ║
║  │  → Starts fresh thread with relevant context            │ ║
║  │  → Prevents context degradation over long sessions      │ ║
║  │  → New thread automatically continues execution         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Output During TDD:**

```
╔══════════════════════════════════════════════════════════════╗
║  🔴 RED: Writing test for user profile display               ║
╠══════════════════════════════════════════════════════════════╣
║  Test: should display user name and email                    ║
║  File: app/profile/page.test.tsx                             ║
║  Running... ❌ FAIL (expected)                               ║
║  Error: Cannot find element with text "John Doe"             ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║  🟢 GREEN: Implementing minimal solution                     ║
╠══════════════════════════════════════════════════════════════╣
║  Created: app/profile/page.tsx                               ║
║  Running tests... ✓ PASS                                     ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║  🔵 REFACTOR: Evaluating code quality                        ║
╠══════════════════════════════════════════════════════════════╣
║  Improvements:                                               ║
║  • Integrated Clerk useUser() hook                           ║
║  • Added loading skeleton                                    ║
║  Running tests... ✓ PASS                                     ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║  🌐 BROWSER TEST: User Profile Page                          ║
╠══════════════════════════════════════════════════════════════╣
║  Page: http://localhost:3000/profile                         ║
║                                                              ║
║  Verifying elements:                                         ║
║  ✓ User name displayed (@e1)                                 ║
║  ✓ Email displayed (@e2)                                     ║
║  ✓ Avatar loaded (@e3)                                       ║
║  ✓ Loading skeleton renders correctly                        ║
║                                                              ║
║  Result: ✅ PASS                                             ║
╚══════════════════════════════════════════════════════════════╝

✓ Committed: "feat: add user profile page with tests"
```

#### Oracle, Librarian & Browser Testing During TDD

```
BROWSER TEST TRIGGERS:
├─ Task modifies app/ pages or routes → Run browser test
├─ Task modifies components/ UI components → Run browser test
├─ Task adds user-facing features → Run browser test
├─ Task changes styling or layout → Run browser test
├─ Backend-only change (convex/) → Skip browser test
├─ Config/docs only → Skip browser test

BROWSER TEST COMMANDS:
├─ agent-browser open http://localhost:3000/[page]
├─ agent-browser snapshot -i    (get interactive elements)
├─ agent-browser click @e[n]    (click element by ref)
├─ agent-browser fill @e[n] "text"  (fill input)
├─ agent-browser is visible "[selector]"
├─ agent-browser screenshot [path]

ORACLE TRIGGERS:
├─ Browser test fails → "Consulting Oracle to debug UI issue..."
├─ Test fails after GREEN phase → "Consulting Oracle to debug..."
├─ TypeScript errors persist → "Asking Oracle to analyze..."
├─ Unclear how to test something → "Oracle: how should I test this?"
└─ Stuck on implementation → "Let me consult the Oracle..."

LIBRARIAN TRIGGERS:
├─ New testing pattern needed → "How does [library] test this?"
├─ Unfamiliar API to test → "Researching test patterns for [API]..."
└─ Best practice question → "How do established projects test this?"

HANDOFF TRIGGERS:
├─ After EVERY atomic task + commit → Handoff to continue with next task
├─ Preserves fresh context for each task
└─ Prevents quality degradation in long sessions
```

#### Intelligent Handoff After Each Task

**Every atomic task completion triggers a handoff.** This is a key feature:

```
Task Complete → Commit → Handoff → New Thread Continues
```

After committing, the agent says:
```
"Handoff and continue with next task [N] in PLAN.md: [task description]"
```

**Why handoff after each task?**
- Context window fills up during long sessions
- Quality degrades at 50%+ context usage
- Fresh thread = fresh reasoning capability
- Each task gets full attention without accumulated noise

**What gets preserved in handoff:**
- Current phase and task progress (from STATE.md)
- Applied lessons from this session
- Commit history for the phase
- Any unresolved issues or notes

**Handoff pattern examples:**
```
"Handoff and continue with Task 2: implement user profile query"
"Handoff and execute next task in Phase 03"
"Handoff and verify the UI changes we just made"
```

#### Test-First Principles

| Principle | Why |
|-----------|-----|
| **Test behavior, not implementation** | Tests survive refactoring |
| **See test fail first** | Proves test actually tests something |
| **Minimal GREEN code** | Avoids over-engineering |
| **Refactor is optional** | Sometimes code is already clean |
| **Test + impl in one commit** | Atomic, reviewable units |

See `.agents/skills/tdd/SKILL.md` for full TDD documentation and test patterns.

#### Atomic Commits

**Every TDD cycle ends with a git commit.** This is non-negotiable.

```
TDD Task Flow:
┌─────────────────────────────────────────────────────────┐
│  1. 🔴 Write failing test                               │
│  2. 🟢 Write minimal implementation                     │
│  3. 🔵 Refactor if needed                               │
│  4. Run all tests + typecheck                           │
│  5. git add -A                                          │
│  4. git commit -m "[message from <done> section]"       │
│  5. Update STATE.md with commit count                   │
│  6. Move to next task                                   │
└─────────────────────────────────────────────────────────┘
```

**Never:**
- Skip commits between tasks
- Batch multiple tasks into one commit
- Commit unverified code
- Move to next task without committing

**Commit Message Format:**
```
type: description

Types: feat, fix, refactor, test, docs, chore
Example: feat: add user authentication with Clerk
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

### Phase 4: Capture Learnings (Oracle-Enhanced Retrospective)

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
║  Oracle will synthesize insights from the session.           ║
║                                                              ║
║  Options:                                                    ║
║  • "yes" - Create lesson with Oracle synthesis (recommended) ║
║  • "skip" - Continue without capturing                       ║
║  • "continue" - Move to next phase                           ║
╚══════════════════════════════════════════════════════════════╝
```

**If user says yes, use Oracle to synthesize:**

```
1. Gather Session Context
   ├─ Read STATE.md for decisions made
   ├─ Review git log for commits in this phase
   ├─ Collect any error messages encountered
   └─ Note which approaches worked/failed

2. Oracle Synthesis
   ├─ Pass full session context to Oracle
   ├─ Ask: "Analyze this work session and extract actionable insights"
   └─ Oracle produces structured learnings

3. Create Lesson
   ├─ .agents/skills/lessons/[phase-name]/SKILL.md
   └─ Include Oracle's synthesized insights
```

**Oracle Synthesis Output:**

```
╔══════════════════════════════════════════════════════════════╗
║  🔮 ORACLE SESSION ANALYSIS                                  ║
╠══════════════════════════════════════════════════════════════╣
║  Session: Phase 04 - Task Workflows                          ║
║                                                              ║
║  📈 What Worked:                                             ║
║  • Using Convex indexes for query performance                ║
║  • Breaking state updates into smaller mutations             ║
║                                                              ║
║  📉 What Failed:                                             ║
║  • Initial approach without optimistic updates (slow UX)     ║
║  • First schema design missed edge cases                     ║
║                                                              ║
║  💡 Key Insights:                                            ║
║  • Always design indexes before writing queries              ║
║  • Test with realistic data volumes early                    ║
║                                                              ║
║  🎯 Actionable for Next Time:                                ║
║  • Start with data model, not UI                             ║
║  • Add loading states from the beginning                     ║
╚══════════════════════════════════════════════════════════════╝

Creating lesson: .agents/skills/lessons/phase-04-task-workflows/

✓ Lesson created with Oracle-synthesized insights!
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
       
       I'm going to ask the Librarian about Convex patterns for 
       this type of feature...
       
       ╔══════════════════════════════════════════════════════════╗
       ║  📚 LIBRARIAN RESEARCH                                   ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Query: "How does Convex handle optimistic updates?"     ║
       ║  Source: convex-dev/convex-helpers                       ║
       ║  • Use useOptimisticMutation hook                        ║
       ║  • Return optimistic data shape from mutation            ║
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
       ║  Next Action: Oracle Plan Review → Execute Phase 02      ║
       ╚══════════════════════════════════════════════════════════╝
       
       I'm going to consult the Oracle to review this plan...
       
       ╔══════════════════════════════════════════════════════════╗
       ║  🔮 ORACLE PLAN REVIEW                                   ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Plan: Phase 02 - Core Features                          ║
       ║                                                          ║
       ║  ✅ Strengths: Good task breakdown, proper atomicity     ║
       ║  ⚠️  Concern: No loading state handling in Task 3        ║
       ║  💡 Suggestion: Add error boundary to UI integration     ║
       ╚══════════════════════════════════════════════════════════╝
       
       Ready to execute with these insights? Say "continue".

User: continue

Agent: Executing Task 1: Add core feature component...
       ✓ Component created
       ✓ Verification passed (npx tsc --noEmit)
       ✓ Committed: abc1234 "feat: add core feature component"
       
       🔄 Handoff and continue with Task 2: implement data layer...
       
--- NEW THREAD ---

Agent: Continuing work session from handoff...
       Reading STATE.md for current progress...
       
       Executing Task 2: Implement data layer...
       ✗ TypeScript error: Property 'createdAt' does not exist
       
       Consulting Oracle to debug this type error...
       
       ╔══════════════════════════════════════════════════════════╗
       ║  🔮 ORACLE DEBUG                                         ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Issue: Missing _creationTime in return type             ║
       ║  Fix: Use Convex system field _creationTime, not custom  ║
       ╚══════════════════════════════════════════════════════════╝
       
       Applying fix...
       ✓ Schema updated with correct field
       ✓ Verification passed (npx tsc --noEmit)
       ✓ Committed: def5678 "feat: implement feature data layer"
       
       🔄 Handoff and continue with Task 3: add UI integration...
       
--- NEW THREAD ---

Agent: Continuing work session from handoff...
       
       Executing Task 3: Add UI integration...
       (Applying Oracle suggestion: adding error boundary)
       ✓ Pages connected with error handling
       ✓ Verification passed (npx tsc --noEmit)
       ✓ Committed: ghi9012 "feat: integrate feature UI with error boundary"
       
       Creating SUMMARY.md...
       ✓ Committed: jkl3456 "docs: complete phase 02 plan"
       
       ✅ Phase 02 Complete!
       
       ╔══════════════════════════════════════════════════════════╗
       ║  📝 CAPTURE LEARNINGS?                                   ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Would you like to create a lesson from this work?       ║
       ║  Oracle will synthesize insights from the session.       ║
       ║  • "yes" - Create lesson with Oracle synthesis           ║
       ║  • "skip" - Continue to next phase                       ║
       ╚══════════════════════════════════════════════════════════╝

User: yes

Agent: I'm going to consult the Oracle to synthesize learnings...
       
       ╔══════════════════════════════════════════════════════════╗
       ║  🔮 ORACLE SESSION ANALYSIS                              ║
       ╠══════════════════════════════════════════════════════════╣
       ║  📈 What Worked:                                         ║
       ║  • Atomic commits kept changes reversible                ║
       ║  • Oracle pre-review caught error boundary gap           ║
       ║                                                          ║
       ║  📉 What Failed:                                         ║
       ║  • Used custom createdAt instead of _creationTime        ║
       ║                                                          ║
       ║  🎯 Actionable:                                          ║
       ║  • Always use Convex system fields when available        ║
       ║  • Add error boundaries proactively, not reactively      ║
       ╚══════════════════════════════════════════════════════════╝
       
       ✓ Created: .agents/skills/lessons/phase-02-core-features/SKILL.md
       
       Continue to Phase 03? Say "continue" or "/work" to start fresh.
```

## Benefits

1. **Single Command**: No need to remember `/advise`, `/gsd`, `/progress`, `/retrospective`
2. **Automatic Context**: Lessons applied automatically based on current work
3. **Intelligent Tooling**: Oracle and Librarian invoked at optimal moments
4. **Pre-emptive Review**: Oracle catches issues BEFORE execution, not after
5. **Research Integration**: Librarian provides OSS patterns when entering unfamiliar territory
6. **Continuous Improvement**: Each session builds the lessons library with Oracle-synthesized insights
7. **No Lost Learnings**: Prompted to capture before moving on
8. **Flexible Exit**: Can stop at any point, still prompted for retrospective
9. **Fresh Context Per Task**: Intelligent handoff after each atomic commit prevents context degradation

## Quick Commands During Session

| Command | Action |
|---------|--------|
| "continue" | Proceed with suggested action |
| "lessons" | Show applied learnings again |
| "status" | Show current progress dashboard |
| "done" | End session, trigger retrospective |
| "skip lesson" | Continue without capturing |
| "ask oracle" | Manually invoke Oracle for current context |
| "ask librarian" | Manually invoke Librarian for research |
| "review plan" | Re-run Oracle plan review |
| "handoff" | Manually trigger handoff to fresh thread |

## Integration Notes

- Works with existing GSD structure (`.planning/` directory)
- Lessons stored in `.agents/skills/lessons/` for cross-project sharing
- Compatible with both interactive and YOLO modes
- Can be interrupted and resumed - state preserved in STATE.md
- Oracle is GPT-5 based - best for planning, debugging, and analysis
- Librarian reads GitHub repos - best for external pattern research
- Handoff after each task uses Amp's intelligent handoff feature (see https://ampcode.com/news/ask-to-handoff)
