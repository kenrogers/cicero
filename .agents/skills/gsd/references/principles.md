# GSD Core Principles

## The Solo Developer Focus

GSD is designed for a team of two: you and your AI assistant. This isn't a limitation—it's the design. When you're not coordinating with other humans, you can move faster, make decisions instantly, and maintain flow state.

### What This Means

- No approval workflows
- No ticket systems
- No standups
- Decisions are made, documented, and executed in one motion
- The AI remembers context so you don't have to

## Plans ARE Prompts

The most important principle in GSD: Plans are not documents that get transformed into prompts. **Plans ARE prompts.**

### Traditional Approach (Wrong)
```
Write specification → Transform to tasks → Give tasks to developer → Developer interprets
```

### GSD Approach (Right)
```
Create plan with full context → Feed plan directly to AI → AI executes exactly
```

### Why This Matters

Every transformation step loses information. When a plan IS the prompt:
- No interpretation errors
- Context is preserved
- Execution is deterministic
- Plans are self-contained

### Practical Implication

Each task in a PLAN.md must contain everything needed to execute it. Don't assume the executor knows anything not written in the task.

## Aggressive Atomicity

### The 2-3 Task Rule

Every plan has exactly 2-3 tasks. Not 1 (too small), not 5 (too large).

### Why 2-3?

1. **Context window efficiency**: Large plans consume context rapidly
2. **Atomic commits**: Each task = one commit
3. **Focus**: Fewer tasks = deeper focus on each
4. **Recovery**: If something fails, you only lose 1 task of progress
5. **Momentum**: Completing tasks feels good, more completions = more momentum

### What If Phase Is Large?

Create multiple plans. Phase 02 might have:
- `PLAN.md` (3 tasks)
- `PLAN-02.md` (3 tasks)
- `PLAN-03.md` (2 tasks)

## Context Window Awareness

### The 50% Rule

Quality degrades when context usage exceeds 50%. GSD is designed to prevent this.

### How GSD Manages Context

1. **Small plans**: 2-3 tasks keep plans small
2. **Self-contained tasks**: Each task has its own context section
3. **Summaries**: After execution, key learnings are extracted
4. **State file**: Single source of truth, not scattered notes
5. **Fresh starts**: Each plan execution can start with fresh context

### Symptoms of Context Overload

- AI starts making obvious mistakes
- Responses become repetitive
- AI forgets earlier instructions
- Hallucinations increase

### Recovery

When you notice degradation:
1. Complete or checkpoint current task
2. Start fresh session
3. Load progress skill to restore context

## Ship Fast

### Velocity Over Perfection

Done is better than perfect. Shipping reveals what perfect actually means.

### GSD Velocity Tactics

1. **Make decisions quickly**: Log them, move on
2. **Fix forward**: Don't restart, fix issues as you find them
3. **Defer non-blockers**: Log issues, stay on current task
4. **Verify, don't over-verify**: Meet criteria, don't gold-plate

### When to Slow Down

- Security decisions
- Data model changes
- Public API design
- Irreversible choices

For everything else, ship it.

## Atomic Commits

### One Task, One Commit

Each task in a plan produces exactly one commit.

### Why Atomic?

1. **Bisectable history**: Can find when bugs were introduced
2. **Reviewable changes**: Each commit tells a story
3. **Revertable**: Can undo specific tasks cleanly
4. **Progress tracking**: Commits = completed tasks

### Commit Message Convention

```
type: brief description

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code restructuring
- test: Test changes
- docs: Documentation
- chore: Maintenance
- style: Formatting only
```

### The Final Docs Commit

Each plan ends with:
```
git commit -m "docs: complete phase XX plan"
```

This commits the SUMMARY.md and STATE.md updates.

## State Is Sacred

### Everything Important Goes in STATE.md

- Decisions made
- Issues discovered
- Current position
- Session history

### Why?

1. **Session continuity**: New sessions can pick up where you left off
2. **Decision memory**: "Why did we do it that way?"
3. **Issue tracking**: Nothing gets lost
4. **Progress visibility**: Know where you are

### Update STATE.md

After every significant action:
- Completed a task
- Made a decision
- Discovered an issue
- Hit a blocker

## Deviation Rules

### Know When to Ask

| Situation | Action |
|-----------|--------|
| Bug in current task | Fix it, include in commit |
| Missing import | Add it, continue |
| Typo | Fix it, continue |
| New pattern question | **Ask** |
| Scope addition | **Ask** |
| Architecture change | **Ask** |
| Security concern | **Ask** |

### The Scope Creep Trap

AI assistants love to be helpful. They'll offer to add features you didn't ask for. Resist.

```
Log the idea → Stay on task → Review logged items later
```

## Depth Settings

### Quick
- Minimal planning
- 2-3 phases total
- Perfect for: prototypes, hackathons, explorations

### Standard
- Balanced planning
- 4-6 phases
- Perfect for: most projects

### Comprehensive
- Thorough planning
- 6-10 phases
- Perfect for: production systems, complex projects

Choose based on project importance and timeline, not preference.

## Mode Settings

### Interactive
- AI asks clarifying questions
- Confirms before major changes
- Reviews commit messages
- Best for: learning, complex decisions

### YOLO
- AI makes reasonable choices
- Only asks for architecture/security
- Auto-commits on success
- Best for: experienced developers, straightforward tasks

You can switch modes mid-project. Use interactive for complex phases, YOLO for straightforward ones.

## The GSD Mindset

1. **Clarity over completeness**: A clear half-plan beats a vague full plan
2. **Execution over planning**: Plan enough to start, then start
3. **Decisions over debates**: Make a choice, document it, move on
4. **Progress over perfection**: Ship, learn, iterate
5. **Flow over interruption**: Batch questions, maintain momentum
