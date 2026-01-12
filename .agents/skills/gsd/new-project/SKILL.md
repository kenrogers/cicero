# GSD: New Project Initialization

**name**: gsd/new-project
**description**: Initialize a new GSD project with deep questioning to capture vision, requirements, and constraints. Use when starting a new project or onboarding an existing codebase. Creates PROJECT.md, config.json, and .planning directory structure.

---

## Purpose

This skill guides you through comprehensive project initialization using deep questioning techniques. It captures everything needed to maintain context across sessions and creates the foundation for roadmap planning.

## Workflow

```
1. Detect Project Type
   └─ Greenfield (new) or Brownfield (existing)?

2. Deep Questioning (5-7 questions)
   ├─ Vision & Goals
   ├─ Users & Use Cases
   ├─ Technical Constraints
   ├─ Success Criteria
   └─ Timeline & Scope

3. Create Planning Structure
   ├─ .planning/PROJECT.md
   ├─ .planning/config.json
   └─ .planning/ directory

4. Git Commit
   └─ "chore: initialize GSD project planning"
```

## Process

### Step 1: Detect Project Type

First, check if this is a greenfield or brownfield project:

```bash
# Check for existing code indicators
ls -la src/ app/ lib/ 2>/dev/null
cat package.json 2>/dev/null | head -20
cat README.md 2>/dev/null | head -30
```

**If Brownfield (existing code):**
- Offer to map the codebase first
- Identify existing patterns, tech stack, conventions
- Note what's already built vs what needs building
- Document technical debt if visible

**If Greenfield (new project):**
- Focus on vision and requirements
- Capture technical preferences
- Establish conventions early

### Step 2: Deep Questioning

Use the questioning framework from [../references/questioning.md](../references/questioning.md).

#### Required Questions (ask all)

1. **Vision**: "In one sentence, what does this project do when it's done?"

2. **Users**: "Who uses this and what's their primary workflow?"

3. **Success**: "How will you know this project succeeded? What's the must-ship feature?"

4. **Constraints**: "What technical constraints exist? (existing stack, hosting, budget, timeline)"

5. **Scope Control**: "What are you explicitly NOT building in v1?"

#### Contextual Questions (pick 2-3 based on project)

- "What's the deployment target?"
- "Are there existing APIs or services to integrate?"
- "What's the data model look like at a high level?"
- "Any authentication/authorization requirements?"
- "What's the testing strategy?"
- "Are there compliance or security requirements?"

### Step 3: Create Planning Structure

Create the `.planning/` directory and files:

```bash
mkdir -p .planning/phases
```

#### Create PROJECT.md

Use template from [../templates/project.md](../templates/project.md):

```markdown
# Project: [Name]

## Vision
[One sentence description]

## Problem Statement
[What problem does this solve?]

## Users
[Who uses this and how?]

## Requirements

### Must Have (v1)
- [ ] Requirement 1
- [ ] Requirement 2

### Should Have
- [ ] Requirement 3

### Won't Have (v1)
- Item explicitly out of scope

## Technical Constraints
- Constraint 1
- Constraint 2

## Success Criteria
- Measurable outcome 1
- Measurable outcome 2

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|

## Open Questions
- Question 1?
```

#### Create config.json

```json
{
  "mode": "interactive",
  "depth": "standard",
  "created": "YYYY-MM-DD",
  "project_type": "greenfield|brownfield"
}
```

**Mode Options:**
- `interactive`: Asks questions, confirms major changes
- `yolo`: Minimal interruptions, trusts AI judgment

**Depth Options:**
- `quick`: Fast execution, minimal planning
- `standard`: Balanced approach
- `comprehensive`: Thorough planning and documentation

### Step 4: Git Commit

```bash
git add .planning/
git commit -m "chore: initialize GSD project planning"
```

## Brownfield Codebase Mapping

For existing projects, create a codebase map before planning:

```markdown
## Codebase Overview

### Tech Stack
- Frontend: [framework, version]
- Backend: [framework, version]
- Database: [type, version]
- Infrastructure: [hosting, services]

### Directory Structure
```
[Key directories and their purposes]
```

### Existing Patterns
- State management: [pattern]
- API design: [REST/GraphQL/etc]
- Testing: [framework, coverage]
- Styling: [approach]

### Integration Points
- External APIs: [list]
- Auth provider: [if any]
- Payment: [if any]

### Technical Debt
- [Known issues]
- [Outdated dependencies]
- [Missing tests]
```

## Configuration Prompts

Ask the user to configure their preferences:

> "How would you like to work?
> 
> **Mode:**
> - `interactive` - I'll ask before major decisions
> - `yolo` - Minimal questions, maximum velocity
>
> **Depth:**
> - `quick` - Fast and lean (prototypes, hackathons)
> - `standard` - Balanced (most projects)
> - `comprehensive` - Thorough (production systems)"

## Completion Checklist

Before finishing initialization, verify:

- [ ] `.planning/PROJECT.md` exists with all sections filled
- [ ] `.planning/config.json` exists with valid settings
- [ ] `.planning/phases/` directory exists
- [ ] Git commit made
- [ ] User understands next step (create-roadmap)

## Next Step

After initialization, guide user to create roadmap:

> "Project initialized! Next, let's create the roadmap. Say 'create roadmap' or load the gsd/create-roadmap skill."

## Example Session

```
User: Start a new project

Agent: I'll help you initialize a GSD project. Let me check if this is a new 
       or existing codebase...

       [Checks for existing code]

       This looks like a greenfield project. Let's capture your vision.

       **Question 1/5**: In one sentence, what does this project do when it's done?

User: A task management app for developers that integrates with GitHub

Agent: Got it. **Question 2/5**: Who uses this and what's their primary workflow?

[... continues through questions ...]

Agent: I've created:
       - .planning/PROJECT.md (your project vision)
       - .planning/config.json (interactive mode, standard depth)
       - .planning/phases/ (ready for roadmap)

       Committed: "chore: initialize GSD project planning"

       Ready to create your roadmap? Say "create roadmap" to continue.
```
