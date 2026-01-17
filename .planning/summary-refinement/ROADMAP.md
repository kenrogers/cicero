# Meeting Summary Refinement - Roadmap

## Overview

Enhancing Cicero's AI summarization to provide speaker attribution, timestamped moments, and concrete civic engagement actions.

```
Phase 1: Schema & Data Model     → Define enhanced structure
Phase 2: AI Prompt Engineering   → Extract richer information
Phase 3: Video Timestamps        → Link to key moments
Phase 4: UI Enhancement          → Display new data beautifully
```

## Phases

### Phase 1: Schema & Data Model
**Goal**: Define the enhanced data structure for rich summaries

**Deliverables**:
- Updated `summaries` table with speaker opinions
- New `keyMoments` structure with timestamps
- Enhanced `actionSteps` with deadlines and contacts
- Council members reference data

**Verification**: Schema passes typecheck, can insert sample enhanced data

---

### Phase 2: AI Prompt Engineering
**Goal**: Extract speaker opinions, key moments, and rich action items

**Deliverables**:
- Updated summarization prompts
- Speaker identification logic (match names to known council members)
- Timestamp extraction from transcript context
- Action item enrichment (deadlines, contacts, links)
- Test with real meeting transcript

**Verification**: Process one meeting, get properly structured enhanced summary

---

### Phase 3: Video Timestamps
**Goal**: Enable direct links to specific moments in meeting videos

**Deliverables**:
- Research Cablecast video URL timestamp format
- Generate clickable timestamp links
- Map transcript positions to video times
- Handle cases where video doesn't support timestamps

**Verification**: Click timestamp link, video jumps to correct moment

---

### Phase 4: UI Enhancement
**Goal**: Display enhanced summaries with speaker opinions and timestamps

**Deliverables**:
- Speaker opinions section per topic
- Clickable timestamp list with context
- Rich action item cards with CTAs
- Re-process button to update existing meetings

**Verification**: View enhanced meeting page, all new data displays correctly

---

## Dependencies

```
Phase 1 ──→ Phase 2 ──→ Phase 3
                 ↘         ↓
                   Phase 4
```

Phase 3 and 4 can partially overlap after Phase 2.

## Estimated Effort

| Phase | Effort | Notes |
|-------|--------|-------|
| 1 | Small | Schema changes, straightforward |
| 2 | Large | Prompt engineering is iterative |
| 3 | Medium | Depends on Cablecast URL support |
| 4 | Medium | Component updates |

## Risk Areas

1. **Token limits**: Richer extraction needs more context → may need chunking
2. **Speaker identification**: AI may not reliably identify speakers by name
3. **Timestamp accuracy**: Transcript timestamps may not align perfectly with video
4. **Cablecast URLs**: May not support timestamp deep links

## Current Status

**Active Phase**: Not started
**Completed**: None
