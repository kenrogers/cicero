# Plan: [Phase Name]

> Phase [XX] of [Project Name]
> Created: [date]
> Plan: [01 | 02 | etc. if multiple plans per phase]

## Objective

[What this plan accomplishes - directly from phase objectives in ROADMAP.md]

## Context

[Relevant state going into this plan]
- Recent decisions: [any from STATE.md]
- Dependencies met: [what previous work enables this]
- Constraints: [anything to keep in mind]

## Tasks

<task id="1">
  <objective>
    [Single sentence: what this task accomplishes]
  </objective>
  <context>
    [Everything needed to execute this task without external context]
    
    Files to modify:
    - path/to/file1.ts
    - path/to/file2.ts
    
    Related patterns:
    - Reference existing code: path/to/similar.ts
    
    Decisions:
    - [Any relevant decisions from STATE.md]
  </context>
  <action>
    1. First step - be specific
    2. Second step - include file paths
    3. Third step - include expected outcomes
    4. Fourth step - if needed
  </action>
  <verify>
    - [ ] Verification step 1 (e.g., npm run typecheck passes)
    - [ ] Verification step 2 (e.g., page renders at /path)
    - [ ] Verification step 3 (e.g., API returns expected response)
  </verify>
  <done>type: descriptive commit message</done>
</task>

<task id="2">
  <objective>
    [Single sentence: what this task accomplishes]
  </objective>
  <context>
    [Context for this task, can reference task 1 output]
    
    Files to modify:
    - path/to/file.ts
    
    Builds on:
    - Task 1 created [what]
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
  <done>type: descriptive commit message</done>
</task>

<task id="3">
  <objective>
    [Single sentence: what this task accomplishes]
  </objective>
  <context>
    [Context for this task]
    
    Files to modify:
    - path/to/file.ts
  </context>
  <action>
    1. First step
    2. Second step
  </action>
  <verify>
    - [ ] Verification step
  </verify>
  <done>type: descriptive commit message</done>
</task>

## Success Criteria

[Maps to phase deliverables - how we know this plan succeeded]

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Notes

[Any warnings, gotchas, or additional context]

## Deviation Rules

For this plan:
- Auto-fix: [bugs, typos, missing imports]
- Ask first: [architectural changes, new dependencies, scope additions]

---

## Execution Log

[Filled in during execution]

| Task | Started | Completed | Commit |
|------|---------|-----------|--------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
