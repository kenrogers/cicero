# Phase 3: AI Processing Pipeline

## Goal
Process a meeting into a summary by extracting video URLs, transcribing audio, parsing agendas, and generating AI summaries.

## Context
- Schema already has `summaries` table with keyTopics, decisions, actionSteps
- Meetings have `videoPageUrl` (Cablecast page) but need actual video URL
- Using OpenRouter for AI (decision in STATE.md)
- Transcription: Whisper API or AssemblyAI (TBD this phase)

## Tasks

### Task 1: Video URL Extraction from Cablecast
Extract the actual video URL from Cablecast VOD pages.

**Files to create**:
- `convex/videoExtractor.ts` - Action to extract video URL from Cablecast page

**Logic**:
1. Fetch the videoPageUrl HTML
2. Parse to find the actual video source URL (likely in a video player embed)
3. Update meeting with extracted videoUrl
4. Handle cases where video isn't available yet

**Verify**: Extract video URL from one real meeting, confirm it's a playable video URL

---

### Task 2: Transcription with AssemblyAI
Transcribe meeting video audio using AssemblyAI (better for long-form than Whisper).

**Files to create**:
- `convex/transcriber.ts` - Action to submit video for transcription and retrieve result

**Logic**:
1. Submit video URL to AssemblyAI
2. Poll for completion (or use webhook callback)
3. Store transcript in Convex storage
4. Update meeting status to "processing" → "transcribed"

**Environment variables needed**:
- `ASSEMBLYAI_API_KEY`

**Verify**: Transcribe one meeting, get readable text output

---

### Task 3: AI Summarization with OpenRouter
Generate structured summary from transcript + agenda context.

**Files to create**:
- `convex/summarizer.ts` - Action to generate summary via OpenRouter

**Logic**:
1. Load transcript from storage
2. Optionally fetch agenda PDF and extract text
3. Call OpenRouter with structured prompt
4. Parse response into keyTopics, decisions, actionSteps
5. Store summary in summaries table
6. Update meeting status to "complete"

**Environment variables needed**:
- `OPENROUTER_API_KEY`

**Prompt structure**:
- System: "You are a civic engagement assistant..."
- User: Transcript + agenda context
- Output: JSON matching summaries schema

**Verify**: Generate summary for one transcribed meeting

---

## Success Criteria
- [x] Can extract video URL from Cablecast page
- [x] Can transcribe a meeting video
- [x] Can generate structured summary
- [x] Meeting status progresses: pending → processing → complete
- [ ] Summary appears in Convex dashboard with all fields populated (requires testing)

## Dependencies
- AssemblyAI account + API key
- OpenRouter account + API key

## Notes
- Phase 3 is marked "Large" in roadmap - may need to split further
- Start with one meeting end-to-end before batch processing
- PDF parsing can be basic for MVP (may enhance later)
