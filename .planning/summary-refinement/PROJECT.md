# Project: Meeting Summary Refinement

## Vision

Transform Cicero's meeting summaries from basic overviews into comprehensive civic engagement tools. Users should feel as informed as if they attended the meeting, with clear paths to get involved.

## Problem Statement

Current summaries provide:
- Generic topic overviews
- Basic decisions list
- Vague action steps

Users need:
- **Who said what** - Council member positions, arguments, and voting rationale
- **Watchable moments** - Timestamped links to key discussion points
- **Concrete actions** - Specific deadlines, contact info, and submission links

## Core Goals

### 1. Speaker Attribution & Opinions
Identify council members and capture:
- Their stance on each topic (support/oppose/undecided)
- Key arguments they made
- Notable quotes
- Voting record on decisions

### 2. Timestamped Key Moments
For important discussion points:
- Timestamp in video
- Direct link to that moment
- Brief context (what's being discussed)
- Who's speaking

### 3. Actionable Civic Engagement
For each relevant topic:
- Public comment deadlines
- How to submit feedback (email, form, meeting)
- Which department/person to contact
- Relevant agenda item or ordinance numbers
- Upcoming related meetings/votes

## Success Criteria

- [ ] Summaries include speaker positions for major topics
- [ ] At least 3-5 timestamped video links per meeting
- [ ] Action items include specific deadlines and contact methods
- [ ] Users can click timestamp and jump to that moment in video
- [ ] Schema supports new structured data
- [ ] Existing meetings can be re-processed with new format

## Technical Approach

### AI Pipeline Enhancement
- Update summarization prompts to extract speaker opinions
- Request timestamps for key moments
- Generate more specific action items with deadlines/contacts

### Schema Updates
- Add `speakerOpinions` to summaries
- Add `keyMoments` with timestamps and video links
- Enhance `actionSteps` with deadlines, links, contacts

### UI Updates
- Display speaker positions per topic
- Clickable timestamp links
- Rich action item cards with CTAs

## Out of Scope (for now)

- Full speaker diarization (who spoke every sentence)
- Real-time meeting tracking
- Automated council member identification from audio
- Integration with city feedback systems

## Dependencies

- Existing Cicero pipeline (transcription, summarization)
- Video URLs with timestamp support (e.g., `?t=3600` for 1 hour mark)
- Council member names list for identification

## Notes

- Council members for Fort Collins can be scraped or maintained manually
- Video timestamp format depends on Cablecast player support
- May need to increase AI context/tokens for richer extraction
