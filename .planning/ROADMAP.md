# Cicero Roadmap

## Overview

```
MVP (Complete)     → Meeting summaries + email
Phase 0: Foundation → Taxonomy + feedback loop
Phase 1: Radar      → Topic subscriptions + alerts
Phase 2: Location   → "Near me" + development pipeline  
Phase 3: Coverage   → Schools, County, Boards
Phase 4: Elections  → Voting records, ballot measures
```

## Completed Phases

### Phase 1-6: MVP ✓
**Goal**: Working meeting summary + notification system

**Delivered**:
- Convex schema for meetings, summaries, subscribers
- Scraper for Municode meeting listings
- Video transcription via AssemblyAI
- AI summarization via OpenRouter
- Web interface at /meetings
- Email notifications via Resend
- Rate limiting, error handling, SEO, loading states

---

## Upcoming Phases

### Phase 0: Foundation
**Goal**: Prepare infrastructure for personalization

**Deliverables**:
- Add topic taxonomy to summaries (Housing, Zoning, Budget, Safety, etc.)
- Basic entity extraction (neighborhoods, streets, project names)
- Consistent "decision + next steps" structure
- Unsubscribe/mute controls
- Feedback mechanism ("Was this useful?")

**Verification**: Users can identify what happened and what to do next

**Effort**: Small (1-2 weeks)

---

### Phase 1: Participation Radar
**Goal**: Let users choose topics, alert them when it matters

**Deliverables**:
- Topic subscription system
- Ingest Planning & Zoning Commission + Transportation Board
- "Issue" data model (normalized from sources)
- Issue timeline (scheduled → discussed → decided)
- Weekly personalized digest (only topics you follow)
- Urgent alerts (hearing in 72h, comment deadline in 48h)
- Action cards (what's happening, how to participate)

**Verification**: Fewer emails, higher relevance, users take action

**Effort**: Medium (2-4 weeks)

---

### Phase 2: Location Intelligence
**Goal**: "What's happening near me"

**Deliverables**:
- Address-based personalization (privacy-aware)
- Development applications/permits pipeline
- Capital improvement projects (road work, utilities)
- "Near me" routing
- "What changed" diffs for ongoing projects
- Map view of active issues

**Verification**: Residents discover things before they're decided

**Effort**: Medium-Large (4-8 weeks)

---

### Phase 3: Multi-Source Coverage
**Goal**: Comprehensive local governance monitoring

**Deliverables**:
- Poudre School District Board
- Larimer County Commissioners
- Downtown Development Authority
- Representative mapping (who represents you)
- Expanded action cards per governing body
- SMS alerts option
- Issue deduplication across sources

**Verification**: Cicero = default local politics briefing

**Effort**: Large (1-2 months)

---

### Phase 4: Elections + Accountability
**Goal**: Complete civic engagement lifecycle

**Deliverables**:
- Election calendar integration
- Ballot measure plain-language summaries
- Candidate information aggregation
- Voting record tracking (how reps voted on your issues)
- Issue outcome tracking

**Verification**: Users rely on Cicero for governance AND elections

**Effort**: Large (1-2 months, timed to election cycles)

---

## Dependencies

```
MVP ✓ ──→ Phase 0 ──→ Phase 1 ──→ Phase 2
                           ↘         ↗
                            Phase 3
                               ↓
                            Phase 4
```

Phase 2 and 3 can run in parallel after Phase 1.

## Timeline Estimate

| Phase | Effort | Status |
|-------|--------|--------|
| MVP | Complete | ✓ |
| 0 | 1-2 weeks | Not started |
| 1 | 2-4 weeks | Not started |
| 2 | 4-8 weeks | Not started |
| 3 | 1-2 months | Not started |
| 4 | 1-2 months | Not started |

## Current Status

**Active Phase**: Phase 0 (Foundation)
**Overall Progress**: MVP complete, V2 planning done
