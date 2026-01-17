# Cicero Project State

## Current Status

**Active Phase**: Phase 0 - Foundation
**Phase Status**: Not started
**Overall Progress**: MVP complete, V2 roadmap defined

## Quick Context

Building an AI-powered civic engagement platform for Fort Collins. V2 transforms from "meeting summaries" to "personalized civic engagement" - routing the right info to the right person at the right time.

## Key Decisions

| Decision | Choice | Rationale | Date |
|----------|--------|-----------|------|
| AI Provider | OpenRouter | Flexibility to switch models | 2026-01-12 |
| Email Service | Resend | Good DX, reasonable pricing | 2026-01-12 |
| Transcription | AssemblyAI | Better for long-form, simpler API | 2026-01-13 |
| Scraping | Cheerio | Sufficient for static HTML | 2026-01-12 |
| LLM Model | openai/gpt-4o-mini | Cheap, reliable, good at JSON | 2026-01-13 |
| V2 Direction | Personalization | Research shows relevance is key | 2026-01-17 |

## V2 Research Insights

**What citizens want:**
- Relevance - only content that affects THEM
- Timeliness - alerts before decisions, not after
- Clarity - plain language, not legalese
- Actionability - what to do, who to contact
- Minimal time - informed in <5 min/week

**Topics they care about most:**
1. Education/Schools
2. Zoning/Development
3. Public Safety
4. Taxes/Budget
5. Infrastructure
6. Housing

## Data Sources

### Active
- **Municode**: https://fortcollins-co.municodemeetings.com/ (City Council)

### Planned
- Planning & Zoning Commission
- Transportation Board
- Development applications
- Poudre School District
- Larimer County Commissioners

## Blockers

None currently.

## Next Actions

1. Create Phase 0 plan (Foundation)
2. Add topic taxonomy to existing summaries
3. Implement feedback mechanism
4. Add entity extraction for personalization prep

## Session Notes

### 2026-01-17
- V2 research and planning complete
- Updated PROJECT.md and ROADMAP.md with new vision
- Core insight: problem is routing, not access
- Phase 0 focuses on taxonomy foundation

### 2026-01-12 - 2026-01-16
- MVP phases 1-6 completed
- Full pipeline working: scrape → transcribe → summarize → email
- Web interface live at /meetings
- Ready for production deployment
