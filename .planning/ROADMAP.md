# Cicero MVP Roadmap

## Overview

Building the MVP in 6 phases, each delivering testable functionality.

```
Phase 1: Data Foundation     → Schema + scraper basics
Phase 2: Meeting Scraper     → Fetch & store real meetings
Phase 3: AI Processing       → Transcription + summarization
Phase 4: Web Interface       → Browse summaries
Phase 5: Email System        → Subscriber signup + notifications
Phase 6: Polish & Deploy     → Error handling, testing, launch
```

## Phases

### Phase 1: Data Foundation
**Goal**: Set up Convex schema and basic scraping infrastructure

**Deliverables**:
- Convex schema for meetings, summaries, subscribers
- Scraping utility functions (fetch HTML, parse with Cheerio)
- Environment variables for external services

**Verification**: `npx convex dev --once --typecheck=enable` passes

---

### Phase 2: Meeting Scraper
**Goal**: Scrape real City Council meetings from Municode

**Deliverables**:
- Scraper that fetches City Council meetings list
- Parser for meeting details (date, title, agenda URLs, video URL)
- Convex action to run scraper and store meetings
- Admin endpoint to trigger scraping

**Verification**: Run scraper, see meetings in Convex dashboard

---

### Phase 3: AI Processing Pipeline
**Goal**: Process a meeting into a summary

**Deliverables**:
- Video URL extraction from Cablecast pages
- Audio transcription via Whisper/AssemblyAI
- Agenda PDF parsing (extract text)
- OpenRouter integration for summarization
- Summary generation with topics, decisions, action steps
- Status tracking (pending → processing → complete)

**Verification**: Process one real meeting, get usable summary

---

### Phase 4: Web Interface
**Goal**: Public site to browse meeting summaries

**Deliverables**:
- Landing page explaining Cicero
- Meetings list page (past summaries)
- Individual meeting page (full summary, actions)
- Email signup form (stores in Convex)
- Basic navigation and layout

**Verification**: Can browse real summaries on localhost

---

### Phase 5: Email System
**Goal**: Notify subscribers when new summaries are ready

**Deliverables**:
- Resend integration
- Email template for meeting summaries
- Send notification when summary completes
- Unsubscribe link handling
- Double opt-in (optional but recommended)

**Verification**: Receive test email with real summary

---

### Phase 6: Polish & Deploy
**Goal**: Production-ready MVP

**Deliverables**:
- Error handling throughout pipeline
- Rate limiting on public endpoints
- Loading states and error pages
- SEO basics (meta tags, OG images)
- Deploy to Vercel
- Production Convex deployment

**Verification**: Live site processing real meetings

---

## Dependencies

```
Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4
                              ↘     ↗
                               Phase 5
                                  ↓
                              Phase 6
```

Phase 4 and 5 can run in parallel after Phase 3.

## Estimated Timeline

| Phase | Effort | Notes |
|-------|--------|-------|
| 1 | Small | Schema + utilities |
| 2 | Medium | Scraping can be tricky |
| 3 | Large | Video processing is complex |
| 4 | Medium | Standard Next.js pages |
| 5 | Small | Resend is straightforward |
| 6 | Medium | Depends on issues found |

## Risk Areas

1. **Video extraction**: Cablecast may not have direct URLs, might need browser automation
2. **Transcription costs**: Long videos = expensive. May need to chunk or use cheaper service
3. **Scraping reliability**: Municode HTML structure could change
4. **AI quality**: Summary usefulness depends on prompt engineering

## Current Status

**Active Phase**: Not started
**Completed**: None
