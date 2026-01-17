# Cicero - Informed Citizens Platform

## Vision

**Citizens completely informed on everything they want in minimal time.**

Transform from meeting summaries → personalized civic engagement platform that makes local government accessible to everyone.

## Problem

Citizens face a paradox: local government decisions affect their daily lives more than national politics, yet they're far less informed. Research shows:

- **70%+** of Americans don't know when local meetings happen
- **60%** of communities are "civic deserts" with few engagement opportunities
- Top barrier: **information overload** + **lack of relevance filtering**
- Meetings are long (2-4 hours), agendas are dense bureaucratic documents
- When people disagree with decisions, they don't know how to take action

**The problem isn't access to information—it's routing the RIGHT information to the RIGHT person at the RIGHT time with CLEAR action steps.**

## What Citizens Want

Based on research (Pew, GovPilot, Granicus, CIRCLE):

- **Relevance**: Only content that affects THEM
- **Timeliness**: Alerts before decisions, not after
- **Clarity**: Plain language, not legalese
- **Actionability**: What to do, who to contact, when
- **Minimal time**: Informed in <5 min/week

**Topics they care about most:**
1. Education/Schools
2. Zoning/Development ("what's being built near me")
3. Public Safety
4. Taxes/Budget
5. Infrastructure
6. Housing

## Solution

Cicero automatically:
1. Monitors local government meetings and decisions
2. Processes agendas, recordings, and documents
3. Generates digestible summaries with AI
4. Routes relevant content to subscribers based on topics + location
5. Provides specific action steps for civic engagement
6. Alerts subscribers when participation windows open

## Target Users

### The Busy Professional
- Works full-time, family obligations
- Wants to be a good citizen but has no time
- Needs: Weekly digest, mobile-friendly, 2-minute summaries

### The Engaged Parent
- Cares deeply about schools, safety, neighborhood
- Attends some meetings but misses most
- Needs: Topic alerts (education, zoning), advance notice

### The Neighborhood Advocate
- Active in community, attends meetings regularly
- Wants comprehensive coverage, not just summaries
- Needs: Full context, voting records, timeline tracking

## MVP Scope (Complete ✓)

### Delivered
- ✅ Fort Collins City Council meeting scraping
- ✅ Agenda PDF parsing + video transcription
- ✅ AI-generated summaries (topics, decisions, actions)
- ✅ Web interface to browse past meetings
- ✅ Email notifications to subscribers
- ✅ Rate limiting, error handling, SEO

### MVP Limitations
- City Council only (no boards, county, schools)
- No personalization (everyone gets everything)
- No location-based filtering
- No participation prompts (deadlines, how to act)

## V2 Scope (Next)

### Phase 0: Foundation
- Topic taxonomy (auto-tag: Housing, Zoning, Budget, etc.)
- Entity extraction (neighborhoods, streets, projects)
- Feedback mechanism ("Was this useful?")
- "Decision + next steps" on every summary

### Phase 1: Participation Radar
- Topic subscriptions (choose what you care about)
- Ingest Planning & Zoning + Transportation Board
- Issue timeline (scheduled → discussed → decided)
- Weekly personalized digest
- Urgent alerts (hearing in 72h, comment deadline)
- Action cards (how to participate, who to contact)

### Phase 2: Location Intelligence
- Address-based personalization
- Development applications/permits pipeline
- Capital improvement projects
- "Near me" routing
- Map view of active issues

### Phase 3: Multi-Source Coverage
- Poudre School District Board
- Larimer County Commissioners
- Representative mapping
- SMS alerts option

### Phase 4: Elections + Accountability
- Election calendar + ballot measures
- Voting record tracking
- Candidate information

## Data Sources

### Tier 1: City of Fort Collins (Current + Expand)
- City Council (✅ done)
- Planning & Zoning Commission
- Transportation Board
- Development applications/permits
- Budget documents

### Tier 2: Larimer County
- County Commissioners
- Public health board

### Tier 3: Education
- Poudre School District Board

### Tier 4: Elections
- Ballot measures
- Candidate information

## Technical Architecture

### Data Flow
```
Multiple Sources → Scrapers → Convex DB
                      ↓
            Normalize to "Issues"
                      ↓
              AI Processing
         (summarize, tag, extract)
                      ↓
            Personalization Engine
         (match users to issues)
                      ↓
            Delivery (email/SMS)
                      ↓
           Web Interface + Actions
```

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Convex
- **Auth**: Clerk
- **AI**: OpenRouter (GPT-4o-mini)
- **Transcription**: AssemblyAI
- **Email**: Resend
- **Scraping**: Cheerio + fetch

## Product Principles

1. **Relevance over comprehensiveness** - Better 3 relevant alerts than 30 generic
2. **Action over awareness** - Every alert answers "what can I do?"
3. **Trust through transparency** - Always cite sources, never editorialize
4. **Respect attention** - Default to digest, urgent alerts only when warranted
5. **Accessibility first** - Plain language, multiple channels, inclusive design

## Success Metrics

### MVP (Achieved)
- ✅ Process real meeting end-to-end
- ✅ Summary is useful/readable
- ✅ Email delivery works

### V2 Goals
- >80% of alerts rated "useful" by recipients
- >20% of users take action per month
- Users feel informed in <5 min/week
- >50% weekly active users after 3 months
- Cover all major local decision-making bodies

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI hallucination | Require citations, quote original text |
| Perceived bias | Present facts + participation, not opinions |
| Alert fatigue | Default weekly digest, strict urgent criteria |
| Privacy concerns | Coarse location storage, transparent controls |
| Scope creep | Phase-gated rollout, prove each layer |

## Constraints

- Video transcription costs - track and optimize
- Source reliability - Municode/city sites may change
- Solo project - prioritize ruthlessly
