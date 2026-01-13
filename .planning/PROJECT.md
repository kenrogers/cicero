# Cicero MVP

## Vision

AI-powered civic engagement tool that makes Fort Collins City Council meetings accessible to everyone. Automatically monitors for new meetings, processes agendas and recordings, and delivers easy-to-digest summaries with actionable next steps.

## Problem

- City council meetings are long (2-4 hours)
- Agendas are dense bureaucratic documents
- Most citizens don't have time to stay informed
- When people disagree with decisions, they don't know how to take action

## Solution

Cicero automatically:
1. Monitors for new City Council meetings
2. Downloads and reads the agenda
3. Transcribes the meeting recording
4. Generates a digestible summary
5. Provides specific action steps for civic engagement
6. Emails subscribers when new summaries are ready

## Target User

Fort Collins residents who want to stay informed about local government but don't have hours to watch meetings.

## MVP Scope

### In Scope
- Fort Collins City Council meetings only (Regular + Work Sessions)
- Web interface to browse past meeting summaries
- Email signup for automatic notifications
- AI-generated summaries with action steps
- Manual trigger for processing (automated monitoring in v2)

### Out of Scope (v2+)
- Other boards/commissions
- Paid tier
- Automated monitoring/scheduling
- Other cities
- Mobile app

## Technical Architecture

### Data Flow
```
Municode Site → Scraper → Convex DB
                    ↓
           Agenda PDF → AI Summary
                    ↓
        Video URL → Transcription → AI Summary
                    ↓
              Combined Summary + Actions
                    ↓
           Store in Convex → Email Subscribers
                    ↓
              Display on Web Interface
```

### Data Sources
- **Meeting listings**: https://fortcollins-co.municodemeetings.com/
- **Agendas**: Azure blob storage PDFs via Municode
- **Videos**: https://reflect-vod-fcgov.cablecast.tv/

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Convex
- **Auth**: Clerk
- **AI**: OpenRouter (summarization)
- **Transcription**: Whisper API or AssemblyAI
- **Email**: Resend
- **Scraping**: Cheerio + fetch

## Key Entities

### Meeting
- id, date, title, type (Regular/Work Session)
- agendaUrl, agendaPacketUrl, videoUrl
- status: pending | processing | complete | failed
- createdAt, processedAt

### Summary
- id, meetingId
- tldr (2-3 sentences)
- keyTopics[] (title, summary, sentiment)
- decisions[] (what was decided)
- actionSteps[] (how to engage)
- fullTranscript (stored separately)

### Subscriber
- id, email, status (active/unsubscribed)
- createdAt, lastEmailedAt

## Success Metrics

MVP success = 
- Can process a real meeting end-to-end
- Summary is actually useful/readable
- Email delivery works
- 10 beta subscribers

## Constraints

- Video transcription can be expensive - need to track costs
- Meetings are 2-4 hours = ~30-60min of transcription time
- Rate limit AI calls appropriately
