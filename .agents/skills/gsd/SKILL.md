# Get Shit Done (GSD) Project Management

**name**: gsd
**description**: Project management system for solo developers using context engineering. Use this skill when starting new projects, creating roadmaps, planning phases, executing plans, or checking progress. Triggers include "new project", "create roadmap", "plan phase", "execute plan", "project status", "GSD", "get shit done", "project planning", "what should I work on".

---

## Overview

GSD is a context engineering system designed for solo developers working with AI assistants. It transforms project planning from documentation into executable prompts that maintain context across sessions.

### Core Philosophy

1. **Plans ARE Prompts** - Not documents transformed into prompts
2. **Aggressive Atomicity** - 2-3 tasks per plan maximum
3. **Context Window Awareness** - Quality degrades at 50%+ usage
4. **Ship Fast** - Velocity over perfection
5. **Atomic Commits** - One commit per task, descriptive messages

## Workflow

### Simple Workflow (Recommended)

Use `/work` as your single entry point:

```
┌─────────────────────────────────────────────────────────────┐
│                        /work                                │
├─────────────────────────────────────────────────────────────┤
│  1. LEARN    - Check lessons for relevant past learnings    │
│  2. DO       - Route to appropriate GSD action              │
│  3. CAPTURE  - Create retrospective lesson when done        │
└─────────────────────────────────────────────────────────────┘
```

### Full Workflow (Manual Control)

```
┌─────────────────┐
│   new-project   │  ← Capture vision, detect brownfield
└────────┬────────┘
         ▼
┌─────────────────┐
│ create-roadmap  │  ← Break into phases
└────────┬────────┘
         ▼
┌─────────────────┐
│   plan-phase    │  ← Create executable PLAN.md (2-3 tasks)
└────────┬────────┘
         ▼
┌─────────────────┐
│  execute-plan   │  ← Run plan, atomic commits, create SUMMARY.md
└────────┬────────┘
         ▼
┌─────────────────┐
│    progress     │  ← Check status, route to next action
└─────────────────┘
```

## Quick Start

### Starting a New Project
```
Load the gsd/new-project skill and initialize my project
```

### Resuming Work
```
Load the gsd/progress skill and show me where we left off
```

### Planning Next Phase
```
Load the gsd/plan-phase skill for phase 02
```

## Sub-Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| [work](./work/SKILL.md) | **Unified workflow loop** | **Start here - combines lessons + GSD + retrospective** |
| [new-project](./new-project/SKILL.md) | Initialize project with deep questioning | Starting fresh or onboarding existing project |
| [create-roadmap](./create-roadmap/SKILL.md) | Break project into phases | After project initialization |
| [plan-phase](./plan-phase/SKILL.md) | Create executable PLAN.md | Before working on a phase |
| [execute-plan](./execute-plan/SKILL.md) | Run a plan with atomic commits | When ready to implement |
| [progress](./progress/SKILL.md) | Check status and next steps | Session start or status check |

## Directory Structure

GSD creates a `.planning/` directory in your project root:

```
.planning/
├── PROJECT.md          # Vision, requirements, constraints
├── ROADMAP.md          # Phase breakdown
├── STATE.md            # Session memory, decisions, issues
├── config.json         # Mode and depth settings
└── phases/
    ├── 01-foundation/
    │   ├── PLAN.md     # Executable plan (2-3 tasks)
    │   └── SUMMARY.md  # Completion record
    ├── 02-core/
    │   └── PLAN.md
    └── ...
```

## Configuration

### Modes

- **interactive** (default): Asks clarifying questions, confirms before major changes
- **yolo**: Minimal interruptions, trusts AI judgment for routine decisions

### Depth Levels

- **quick**: Minimal planning, fast execution (hackathons, prototypes)
- **standard**: Balanced planning and execution (most projects)
- **comprehensive**: Deep planning, thorough documentation (production systems)

## Integration with Lessons

After completing work, capture learnings:

```
Create a lesson from this GSD session in .agents/skills/lessons/
```

Lessons preserve what worked, what failed, and exact approaches for future sessions.

## Templates

All templates are in [./templates/](./templates/):

- `project.md` - PROJECT.md structure
- `roadmap.md` - ROADMAP.md structure
- `state.md` - STATE.md structure
- `plan.md` - PLAN.md with XML task format
- `summary.md` - SUMMARY.md structure
- `config.json` - Configuration options

## References

Detailed guidance in [./references/](./references/):

- `principles.md` - Core GSD philosophy
- `questioning.md` - Deep questioning techniques
- `plan-format.md` - XML task structure
- `git-integration.md` - Commit conventions

## Common Commands

| Command | Action |
|---------|--------|
| "/work" | **Start unified workflow (recommended)** |
| "Start new project" | Load new-project skill |
| "Create roadmap" | Load create-roadmap skill |
| "Plan phase X" | Load plan-phase skill |
| "Execute current plan" | Load execute-plan skill |
| "What's next?" | Load progress skill |
| "Show project status" | Load progress skill |

## Deviation Rules

During execution, the AI follows these rules:

| Situation | Action |
|-----------|--------|
| Bug discovered | Auto-fix and commit |
| Missing dependency | Add and continue |
| Architectural question | Pause and ask user |
| Scope creep detected | Log issue, stay on task |
| Tests failing | Fix before proceeding |
