# Phase 2: AI Prompt Engineering

## Goal
Update summarization prompts to extract speaker opinions, key moments with timestamps, and enhanced action items from meeting transcripts.

## Context
- Schema already updated in Phase 1 with `speakerOpinions`, `keyMoments`, enhanced `actionSteps`
- Council members seeded: Emily Francis (Mayor), Julie Pignataro (Mayor Pro Tem D2), Chris Conway (D1), Josh Fudge (D3), Melanie Potyondy (D4), Amy Hoeven (D5)
- Current summarizer uses gpt-4o-mini via OpenRouter, truncates at 100k chars, extracts JSON via regex

## Tasks

### Task 1: Update SummaryOutput Interface and Validators
Add TypeScript types and Convex validators for the enhanced output fields.

**Files**: `convex/summarizer.ts`, `convex/summaries.ts`

**Changes**:
- Add `speakerOpinions`, `keyMoments` to SummaryOutput interface
- Update `actionSteps` interface with new fields
- Update `updateSummary` mutation to accept enhanced fields
- Add validators matching schema.ts

**Verify**: `npx convex dev --once --typecheck=enable` passes

---

### Task 2: Update Summarization Prompts
Rewrite SYSTEM_PROMPT and USER_PROMPT to extract richer information.

**Files**: `convex/summarizer.ts`

**Changes**:
- Add council member names to system context
- Request speaker identification with stance/arguments
- Request key moments with approximate timestamps
- Request enriched action items with deadlines/contacts
- Increase max_tokens (1200 → 4000) for richer output

**Key prompt elements**:
1. List known council members for speaker matching
2. Request structured speaker opinions per topic
3. Request key moments with timestamp estimates
4. Request action items with specific deadlines, emails, URLs

---

### Task 3: Update Summary Processing Logic
Update the mutation call to save enhanced fields.

**Files**: `convex/summarizer.ts`, `convex/summaries.ts`

**Changes**:
- Pass new fields to updateSummary mutation
- Handle optional fields gracefully (backwards compatible)
- Map speaker names to councilMember IDs when possible

---

### Task 4: Test with Real Transcript
Process one meeting to verify enhanced extraction works.

**Verification**:
- Run summarization on a meeting with transcript
- Verify speaker opinions are populated
- Verify key moments have timestamps
- Verify action steps have enhanced fields

---

## Success Criteria
- [ ] TypeScript types match new schema
- [ ] Prompts request speaker opinions, key moments, enhanced actions
- [ ] updateSummary mutation accepts all new fields
- [ ] Processing a meeting produces enhanced summary data
- [ ] `npx convex dev --once --typecheck=enable` passes

## Notes
- All new fields are optional for backwards compatibility
- May need to iterate on prompts to get reliable extraction
- Timestamps in transcript are approximate (estimated from context)
