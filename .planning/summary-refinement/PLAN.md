# Phase 1: Schema & Data Model

## Goal
Define enhanced data structures for rich meeting summaries with speaker opinions, timestamped moments, and actionable civic engagement steps.

## Context
- Current `summaries` table has basic `keyTopics`, `decisions`, `actionSteps`
- Need to capture who said what, timestamps to video, and concrete involvement paths
- Council members list now available (6 members + mayor)

## Tasks

### Task 1: Add Council Members Reference Data
Create a reference table for council members to enable speaker identification.

**Schema addition**:
```typescript
councilMembers: defineTable({
  name: v.string(),
  role: v.union(v.literal("mayor"), v.literal("mayor_pro_tem"), v.literal("council_member")),
  district: v.optional(v.number()), // 1-6, null for mayor
  email: v.string(),
  isActive: v.boolean(),
})
  .index("byName", ["name"])
  .index("byActive", ["isActive"]),
```

**Seed data**: Current 7 council members from STATE.md

**Verify**: `npx convex dev --once --typecheck=enable` passes, can query council members

<done>feat: add councilMembers table with current roster</done>

---

### Task 2: Enhance Summaries Schema - Speaker Opinions
Add speaker positions and arguments to the summaries table.

**Schema addition** to `summaries`:
```typescript
speakerOpinions: v.optional(v.array(
  v.object({
    speakerName: v.string(),           // "Mayor Emily Francis"
    speakerId: v.optional(v.id("councilMembers")),
    topicTitle: v.string(),            // Which topic this relates to
    stance: v.union(
      v.literal("support"),
      v.literal("oppose"),
      v.literal("undecided"),
      v.literal("mixed")
    ),
    summary: v.string(),               // Brief summary of their position
    keyArguments: v.array(v.string()), // Notable points they made
    quote: v.optional(v.string()),     // Memorable direct quote
  })
)),
```

**Verify**: Schema typechecks, can insert sample speaker opinion data

<done>feat: add speakerOpinions to summaries schema</done>

---

### Task 3: Enhance Summaries Schema - Key Moments
Add timestamped video links for important discussion points.

**Schema addition** to `summaries`:
```typescript
keyMoments: v.optional(v.array(
  v.object({
    timestamp: v.string(),             // "1:23:45" format
    timestampSeconds: v.number(),      // 5025 (for URL generation)
    title: v.string(),                 // "Vote on Housing Ordinance"
    description: v.string(),           // Brief context
    speakerName: v.optional(v.string()), // Who's speaking at this moment
    momentType: v.union(
      v.literal("vote"),
      v.literal("debate"),
      v.literal("public_comment"),
      v.literal("presentation"),
      v.literal("decision"),
      v.literal("key_discussion")
    ),
  })
)),
```

**Verify**: Schema typechecks, can insert sample key moments

<done>feat: add keyMoments with timestamps to summaries schema</done>

---

### Task 4: Enhance Action Steps Schema
Enrich action items with deadlines, contacts, and links.

**Update `actionSteps`** in summaries:
```typescript
actionSteps: v.array(
  v.object({
    action: v.string(),                // "Submit public comment on zoning change"
    details: v.string(),               // Full description
    deadline: v.optional(v.string()),  // "January 31, 2026" or "Before next council meeting"
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    submissionUrl: v.optional(v.string()), // Link to feedback form
    relatedAgendaItem: v.optional(v.string()), // "Agenda Item 12B"
    relatedOrdinance: v.optional(v.string()), // "Ordinance 2026-001"
    urgency: v.optional(v.union(
      v.literal("immediate"),          // Deadline within 1 week
      v.literal("upcoming"),           // Deadline within 1 month  
      v.literal("ongoing")             // No specific deadline
    )),
  })
),
```

**Verify**: Schema typechecks, backwards compatible with existing data

<done>feat: enhance actionSteps with deadlines, contacts, and links</done>

---

## Success Criteria
- [ ] `councilMembers` table exists with current roster
- [ ] `summaries.speakerOpinions` field defined
- [ ] `summaries.keyMoments` field defined
- [ ] `summaries.actionSteps` enhanced with new fields
- [ ] All new fields are optional (backwards compatible)
- [ ] `npx convex dev --once --typecheck=enable` passes

## Notes
- All new fields must be optional (`v.optional()`) for backwards compatibility
- Existing summaries should continue to work
- Will need migration strategy for re-processing old meetings (Phase 2)
