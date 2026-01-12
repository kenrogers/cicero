---
description: Create project roadmap with phases from PROJECT.md requirements
---

# Create Project Roadmap

## Step 1: Validate Prerequisites

Check PROJECT.md exists:

```bash
cat .planning/PROJECT.md
```

**If not found**: Stop and tell user:
```
⚠️ No PROJECT.md found. Initialize project first.

Run: /new-project
```

Also read config:
```bash
cat .planning/config.json
```

## Step 2: Analyze Requirements

From PROJECT.md, extract:
- MVP requirements
- Technical constraints
- Success criteria
- Out of scope items

## Step 3: Design Phases

Based on depth setting, create phases:

| Depth | Phases | Focus |
|-------|--------|-------|
| quick | 2-3 | Core functionality only |
| standard | 4-6 | Core + polish |
| comprehensive | 6-10 | Full lifecycle |

**Typical Phase Pattern**:
1. Foundation (setup, structure, dependencies)
2. Core (primary feature implementation)
3. Features (secondary features)
4. Integration (connections, APIs)
5. Polish (UX, error handling)
6. Launch (deployment, documentation)

Adjust based on project specifics.

## Step 4: Create ROADMAP.md

Use template from @.agents/skills/gsd/templates/roadmap.md

Include for each phase:
- Phase number and name (e.g., `01-foundation`)
- 2-3 sentence description
- Key deliverables (3-5 bullet points)
- Dependencies on previous phases

## Step 5: Create STATE.md

Use template from @.agents/skills/gsd/templates/state.md

Initialize with:
- Active Phase: 01-[name]
- All phases listed as "Not Started"
- Empty session log
- Empty decisions table

## Step 6: Create Phase Directories

```bash
mkdir -p .planning/phases/01-foundation
mkdir -p .planning/phases/02-core
# ... for each phase
```

## Step 7: Commit

```bash
git add .planning/
git commit -m "docs: create project roadmap

Phases:
- 01-foundation: [brief]
- 02-core: [brief]
- [... list all phases]

Ready for phase planning"
```

## Step 8: Next Steps

Tell user:
```
✅ Roadmap created!

Created:
- .planning/ROADMAP.md - [N] phases defined
- .planning/STATE.md - Progress tracking initialized
- .planning/phases/ - Phase directories

Next step: Plan your first phase
Run: /plan
```
