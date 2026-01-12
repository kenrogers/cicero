---
description: Create an executable PLAN.md with 2-3 atomic tasks for the next phase
---

# Plan Next Phase

## Step 1: Auto-Detect Phase

Read STATE.md to find the next phase needing a plan:

```bash
cat .planning/STATE.md
cat .planning/ROADMAP.md
```

Find the first phase that is either:
- "Not Started" with no PLAN.md
- "In Progress" with incomplete tasks

**Or accept argument**: User can specify phase number (e.g., `/plan 02`)

## Step 2: Validate Phase Directory

```bash
ls .planning/phases/[XX-phase-name]/
```

If PLAN.md already exists and is complete, move to next phase.

## Step 3: Gather Context

Read relevant files:
- ROADMAP.md for phase deliverables
- Previous phase's SUMMARY.md (if exists)
- PROJECT.md for constraints
- Any existing code referenced in the phase

## Step 4: Create PLAN.md

Use template from @.agents/skills/gsd/templates/plan.md

**Critical Rules** (see @.agents/skills/gsd/references/plan-format.md):
- Exactly 2-3 tasks
- Each task uses XML format with full context
- Tasks are self-contained (no assumed knowledge)
- Each task = one atomic commit

**Task XML Structure**:
```xml
<task id="1">
  <title>Brief title</title>
  <context>
    Everything needed to understand and execute this task.
    Include file paths, function names, specific requirements.
  </context>
  <instructions>
    1. Step-by-step implementation instructions
    2. Be specific about what to create/modify
    3. Include expected outcomes
  </instructions>
  <verification>
    - How to verify this task is complete
    - Commands to run
    - Expected output
  </verification>
  <commit>type: message</commit>
</task>
```

## Step 5: Include Verification Section

At the end of PLAN.md, add:

```markdown
## Verification Checklist

Before marking this plan complete:
- [ ] All tasks have passing verification
- [ ] Each task has exactly one commit
- [ ] No lint/type errors introduced
- [ ] SUMMARY.md created
```

## Step 6: Update STATE.md

Update the phase status:
```markdown
**Active Phase**: [XX-name]
**Active Plan**: PLAN.md
**Task Progress**: 0/N completed
**Status**: Ready for execution
```

Add session log entry:
```markdown
### [Date] - Session N
**Focus**: Planning phase [XX]
**Completed**: Created PLAN.md with N tasks
**Next**: Execute plan
```

## Step 7: Commit

```bash
git add .planning/
git commit -m "docs: create plan for phase [XX-name]

Tasks:
1. [task 1 title]
2. [task 2 title]
3. [task 3 title if exists]

Ready for execution"
```

## Step 8: Next Steps

Tell user:
```
✅ Plan created for Phase [XX]!

Tasks:
1. [task 1 title]
2. [task 2 title]
3. [task 3 title if exists]

💡 Tip: Consider starting a fresh thread for execution.

Next step: Execute the plan
Run: /execute
```
