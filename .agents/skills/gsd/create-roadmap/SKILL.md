# GSD: Create Roadmap

**name**: gsd/create-roadmap
**description**: Create a phased roadmap from PROJECT.md, breaking the project into executable phases. Use after project initialization to plan the development journey. Creates ROADMAP.md, STATE.md, and phase directories.

---

## Purpose

Transform the project vision from PROJECT.md into an actionable roadmap with clear phases. Each phase should be completable in 1-3 sessions and result in tangible progress.

## Prerequisites

- `.planning/PROJECT.md` must exist
- `.planning/config.json` must exist

## Workflow

```
1. Read PROJECT.md
   └─ Understand vision, requirements, constraints

2. Identify Natural Phases
   ├─ Foundation (always first)
   ├─ Core functionality
   ├─ Features
   └─ Polish/Launch

3. Create ROADMAP.md
   └─ Phases with objectives and deliverables

4. Create STATE.md
   └─ Session memory and tracking

5. Create Phase Directories
   └─ .planning/phases/XX-name/

6. Git Commit
   └─ "docs: create project roadmap"
```

## Process

### Step 1: Analyze PROJECT.md

Read and understand:
- Must-have requirements (v1 scope)
- Technical constraints
- Success criteria
- What's explicitly out of scope

### Step 2: Design Phases

Apply depth setting from config.json:

| Depth | Typical Phases | Phase Size |
|-------|---------------|------------|
| quick | 2-3 phases | Large, fast |
| standard | 4-6 phases | Balanced |
| comprehensive | 6-10 phases | Small, thorough |

#### Phase Design Principles

1. **Foundation First**: Setup, config, scaffolding
2. **Vertical Slices**: Each phase delivers working functionality
3. **Dependency Order**: Earlier phases enable later ones
4. **Shippable Increments**: Could theoretically ship after each phase

#### Common Phase Patterns

**Web Application:**
```
01-foundation     → Project setup, auth, database schema
02-core-models    → Primary data models and CRUD
03-core-features  → Main user workflows
04-secondary      → Supporting features
05-polish         → UI polish, error handling, edge cases
06-launch         → Deployment, monitoring, documentation
```

**API Service:**
```
01-foundation     → Project setup, database, auth middleware
02-core-endpoints → Primary API routes
03-integrations   → External service integrations
04-hardening      → Rate limiting, validation, error handling
05-deployment     → CI/CD, monitoring, documentation
```

**CLI Tool:**
```
01-foundation     → Project setup, argument parsing, config
02-core-commands  → Primary commands
03-features       → Additional commands, options
04-polish         → Help text, error messages, edge cases
```

### Step 3: Create ROADMAP.md

Use template from [../templates/roadmap.md](../templates/roadmap.md):

```markdown
# Roadmap: [Project Name]

> Generated from PROJECT.md on [date]

## Overview

[2-3 sentence summary of the development journey]

## Phases

### Phase 01: Foundation
**Objective**: [What this phase accomplishes]
**Deliverables**:
- [ ] Deliverable 1
- [ ] Deliverable 2

**Status**: 🔲 Not Started

---

### Phase 02: [Name]
**Objective**: [What this phase accomplishes]
**Deliverables**:
- [ ] Deliverable 1
- [ ] Deliverable 2

**Status**: 🔲 Not Started

---

[Continue for all phases]

## Milestones

| Milestone | Phase | Criteria |
|-----------|-------|----------|
| MVP | Phase 03 | Core workflow functional |
| Beta | Phase 05 | All features, basic polish |
| Launch | Phase 06 | Production ready |

## Dependencies

```
Phase 01 ──→ Phase 02 ──→ Phase 03
                │
                └──→ Phase 04 ──→ Phase 05 ──→ Phase 06
```

## Estimated Timeline

| Phase | Estimated Sessions |
|-------|-------------------|
| 01 | 1-2 |
| 02 | 2-3 |
| ... | ... |
```

### Step 4: Create STATE.md

Use template from [../templates/state.md](../templates/state.md):

```markdown
# Project State

> Last updated: [timestamp]

## Current Position

**Active Phase**: 01-foundation
**Active Plan**: None (not yet planned)
**Status**: Roadmap created, ready to plan first phase

## Progress

| Phase | Status | Plans | Completed |
|-------|--------|-------|-----------|
| 01-foundation | 🔲 Not Started | 0 | 0 |
| 02-core | 🔲 Not Started | 0 | 0 |

## Session Log

### [Date] - Session 1
- Created PROJECT.md
- Created ROADMAP.md
- Ready to plan Phase 01

## Decisions Made

| Date | Decision | Context |
|------|----------|---------|

## Open Issues

| ID | Issue | Priority | Phase |
|----|-------|----------|-------|

## Blockers

None currently.
```

### Step 5: Create Phase Directories

```bash
mkdir -p .planning/phases/01-foundation
mkdir -p .planning/phases/02-core
# ... for each phase
```

### Step 6: Git Commit

```bash
git add .planning/
git commit -m "docs: create project roadmap"
```

## Depth Variations

### Quick Depth
- 2-3 large phases
- Minimal documentation
- Focus on shipping fast
- Good for prototypes, hackathons

### Standard Depth
- 4-6 balanced phases
- Clear deliverables per phase
- Good for most projects

### Comprehensive Depth
- 6-10 detailed phases
- Thorough documentation
- Explicit dependencies
- Good for production systems, team projects

## Roadmap Review

Before finalizing, verify with user:

> "Here's the proposed roadmap:
> 
> 1. **Foundation** - [brief description]
> 2. **Core** - [brief description]
> 3. **Features** - [brief description]
> ...
>
> Does this breakdown make sense? Any phases to add, remove, or reorder?"

## Completion Checklist

- [ ] `.planning/ROADMAP.md` exists with all phases defined
- [ ] `.planning/STATE.md` exists and initialized
- [ ] Phase directories created under `.planning/phases/`
- [ ] Git commit made
- [ ] User understands next step (plan-phase)

## Next Step

After roadmap creation:

> "Roadmap created with [N] phases! Ready to start Phase 01: Foundation.
> Say 'plan phase 01' or load the gsd/plan-phase skill."

## Example Session

```
User: Create roadmap

Agent: I'll read your PROJECT.md and design the roadmap...

       Based on your requirements, I propose 5 phases:

       1. **Foundation** - Auth, database, project structure
       2. **Core Data** - User and task models, basic CRUD
       3. **GitHub Integration** - OAuth, repo sync, issue linking
       4. **Task Workflows** - Kanban board, status updates, filters
       5. **Polish & Launch** - UI polish, notifications, deployment

       This follows your must-have requirements while keeping v1 scope tight.
       
       Does this breakdown work for you?

User: Looks good, but can we combine 4 and 5?

Agent: Absolutely. Revised roadmap:

       1. **Foundation** - Auth, database, project structure
       2. **Core Data** - User and task models, basic CRUD  
       3. **GitHub Integration** - OAuth, repo sync, issue linking
       4. **Workflows & Launch** - Kanban, filters, polish, deploy

       Creating files now...

       ✓ .planning/ROADMAP.md
       ✓ .planning/STATE.md
       ✓ .planning/phases/01-foundation/
       ✓ .planning/phases/02-core-data/
       ✓ .planning/phases/03-github-integration/
       ✓ .planning/phases/04-workflows-launch/

       Committed: "docs: create project roadmap"

       Ready to plan Phase 01? Say "plan phase 01" to continue.
```
