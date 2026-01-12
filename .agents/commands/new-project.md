---
description: Initialize a new GSD project with deep questioning and brownfield detection
---

# Initialize New GSD Project

## Step 1: Check for Existing Project

```bash
ls .planning/PROJECT.md 2>/dev/null
```

**If PROJECT.md exists**: Stop and tell user:
```
⚠️ Project already exists at .planning/PROJECT.md

To start over, first delete the .planning/ directory:
  rm -rf .planning/

Or check project status with: /progress
```

## Step 2: Brownfield Detection

Check if this is an existing codebase:

```bash
# Check for existing code indicators
ls -la package.json pyproject.toml Cargo.toml go.mod requirements.txt 2>/dev/null
ls -la src/ app/ lib/ 2>/dev/null | head -20
```

**If brownfield** (existing code found):
- Note existing technologies
- Identify current structure
- Factor into questioning

## Step 3: Deep Questioning

Ask the user 5-7 focused questions. See @.agents/skills/gsd/references/questioning.md for technique.

**Core Questions** (ask all):
1. What are you building in one sentence?
2. Who is the primary user?
3. What's the #1 must-have feature for MVP?

**Conditional Questions** (pick 2-4 based on context):
- What's your deadline/timeline?
- Any technical constraints or requirements?
- What existing systems must this integrate with?
- What's explicitly out of scope?
- What does success look like?

**For brownfield projects**, also ask:
- What's working well in the current codebase?
- What problems are you trying to solve?

## Step 4: Choose Configuration

Ask user:
```
## Configuration

**Mode** (how I'll work):
1. Interactive (default) - I'll ask clarifying questions
2. YOLO - Minimal interruptions, I'll make reasonable choices

**Depth** (planning thoroughness):
1. Quick - 2-3 phases, minimal planning (prototypes, hackathons)
2. Standard - 4-6 phases, balanced (most projects)
3. Comprehensive - 6-10 phases, thorough (production systems)

Which mode and depth?
```

## Step 5: Create Project Files

Create the `.planning/` directory structure:

```bash
mkdir -p .planning/phases
```

### Create PROJECT.md

Use template from @.agents/skills/gsd/templates/project.md

Fill in based on user answers:
- Vision and goals
- Primary user
- MVP requirements
- Technical constraints
- Out of scope items
- Success criteria

### Create config.json

```json
{
  "mode": "interactive",
  "depth": "standard",
  "created": "[ISO timestamp]"
}
```

## Step 6: Commit

```bash
git add .planning/
git commit -m "docs: initialize GSD project

- Created PROJECT.md with vision and requirements
- Set mode: [mode], depth: [depth]
- Ready for roadmap creation"
```

## Step 7: Next Steps

Tell user:
```
✅ Project initialized!

Created:
- .planning/PROJECT.md - Your project vision
- .planning/config.json - Configuration

Next step: Create your roadmap
Run: /roadmap
```
