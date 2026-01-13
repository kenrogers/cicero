# Lesson: AI Processing Pipeline with Convex

**name**: ai-processing-pipeline-convex
**description**: Building an AI processing pipeline in Convex for video transcription and summarization. Covers Cablecast API integration, AssemblyAI transcription, OpenRouter summarization, Convex action/query separation for Node.js files, storage API usage, and pipeline orchestration patterns. Use when building media processing workflows, integrating external AI APIs in Convex, or chaining multiple async operations.

---

## Context

Building Cicero - an AI-powered civic engagement tool that processes Fort Collins City Council meeting videos into structured summaries. Pipeline: Video URL extraction → Transcription → AI Summarization.

## What Worked ✅

### Cablecast API Integration

**API Endpoint for video search:**
```
GET https://reflect-vod-fcgov.cablecast.tv/cablecastapi/v1/shows?search=city%20council&pageSize=50
```

**Video URL location in response:**
```typescript
// Video URL is in customFields, not a top-level property
const downloadField = show.customFields.find(
  (f) => f.fieldName === "Download VOD" && f.value
);
const videoUrl = downloadField?.value; // e.g., "https://.../vod.mp4"
```

**Matching meetings to Cablecast shows:**
- Match by normalized date (YYYY-MM-DD)
- Match by meeting type (regular, work session, special)
- Future meetings have no VOD yet (returns null)

### AssemblyAI Integration

**Simple transcription from URL:**
```typescript
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

const transcript = await client.transcripts.transcribe({
  audio: videoUrl, // Can be video URL - extracts audio automatically
});

if (transcript.status === "error") {
  throw new Error(transcript.error);
}

const text = transcript.text; // Full transcript text
```

**Key insight:** AssemblyAI handles video URLs directly - no need to extract audio separately.

### OpenRouter Integration

**Structured JSON output with Claude:**
```typescript
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://yourapp.com",
    "X-Title": "Your App Name",
  },
  body: JSON.stringify({
    model: "anthropic/claude-sonnet-4-20250514",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT + transcript },
    ],
    max_tokens: 4000,
    temperature: 0.3, // Lower for more consistent structured output
  }),
});

// Extract JSON from response
const content = data.choices?.[0]?.message?.content;
const jsonMatch = content.match(/\{[\s\S]*\}/);
const parsed = JSON.parse(jsonMatch[0]);
```

### Convex Node.js Action Patterns

**Critical: Separate Node.js files from queries/mutations:**
```
convex/
├── transcriber.ts       # "use node" - actions only
├── transcriberHelpers.ts # No "use node" - mutations/queries
├── summarizer.ts        # "use node" - actions only  
├── summaries.ts         # No "use node" - mutations/queries
```

**Why:** Convex Node.js files can ONLY contain actions. Queries and mutations must be in separate non-Node files.

**Calling between files:**
```typescript
// In transcriber.ts (node file)
await ctx.runMutation(internal.transcriberHelpers.saveTranscriptStorageId, {...});
await ctx.runQuery(internal.meetings.getByIdForTranscription, {...});
```

### TypeScript Circularity Fix

**When calling runQuery in same-file context, add explicit types:**
```typescript
const meeting: {
  _id: Id<"meetings">;
  title: string;
  videoUrl?: string;
} | null = await ctx.runQuery(internal.meetings.getByIdInternal, {
  meetingId: args.meetingId,
});
```

**Handler return type annotation for complex unions:**
```typescript
handler: async (
  ctx,
  args
): Promise<
  { success: true; videoUrl: string } | { success: false; reason: string }
> => {
  // ...
}
```

### Convex Storage for Transcripts

**Storing text content:**
```typescript
const storageId = await ctx.storage.store(
  new Blob([textContent], { type: "text/plain" })
);
```

**Retrieving:**
```typescript
const blob = await ctx.storage.get(storageId);
const text = await blob.text();
```

### Pipeline Orchestration

**Chain actions with early-exit on failure:**
```typescript
const videoResult = await ctx.runAction(api.videoExtractor.extractVideoUrlForMeeting, {...});
if (!videoResult.success) return { ...result, steps: { videoExtraction: videoResult } };

const transcriptResult = await ctx.runAction(api.transcriber.transcribeMeeting, {...});
if (!transcriptResult.success) return { ...result, steps: { transcription: transcriptResult } };

const summaryResult = await ctx.runAction(api.summarizer.summarizeMeeting, {...});
// Continue...
```

## What Failed ❌

| Attempt | Why It Failed | Fix |
|---------|---------------|-----|
| Defining queries in "use node" file | Convex error: "Only actions can be defined in Node.js" | Move queries/mutations to separate non-node file |
| Using `as const` for union returns | TypeScript circularity errors | Use explicit Promise<> return type annotation on handler |
| Expecting video URL on meeting page | Cablecast stores video in API response, not HTML | Use API endpoint instead of scraping HTML |
| `anthropic/claude-sonnet-4-20250514` model ID | Invalid model ID on OpenRouter | Use `openai/gpt-4o-mini` or check current model list |
| Free tier models (`:free` suffix) | Rate-limited heavily, often return 429 errors | Use cheap paid models like `gpt-4o-mini` instead |
| Env vars in `.env.local` for Convex actions | Convex actions run server-side, don't see local env | Must set via `npx convex env set KEY value` |

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| AssemblyAI over Whisper | Simpler API, handles video URLs directly, good for long-form | Works well |
| OpenRouter over direct API | Flexibility to switch models without code changes | Easy to test different models |
| Store transcript in Convex storage | Transcripts too large for document fields | Clean separation |
| Separate pipeline.ts orchestrator | Clean single entry point for full processing | Easy to test/debug |

## Exact Parameters

**AssemblyAI:**
- Package: `assemblyai` npm
- Env var: `ASSEMBLYAI_API_KEY`
- Handles video URLs directly (extracts audio)

**OpenRouter:**
- Model: `openai/gpt-4o-mini` (cheap, reliable, good at structured JSON)
- Temperature: 0.3 (for consistent structured output)
- Max tokens: 1200 (sufficient for structured summary, stays within credits)
- Truncate transcript at 100k chars
- Avoid `:free` models - heavily rate-limited
- Set env var: `npx convex env set OPENROUTER_API_KEY "sk-..."`

**Cablecast API:**
- Base: `https://reflect-vod-fcgov.cablecast.tv/cablecastapi/v1`
- Video URL field: `customFields` → `"Download VOD"`

## Files Created

```
convex/
├── videoExtractor.ts      # Extract video URLs from Cablecast
├── transcriber.ts         # AssemblyAI transcription
├── transcriberHelpers.ts  # Transcript storage mutations
├── summarizer.ts          # OpenRouter summarization
├── summaries.ts           # Summary queries/mutations
├── pipeline.ts            # Orchestration (processOneMeeting, processPendingMeetings)
└── meetings.ts            # Added internal queries for pipeline
```

## Lessons Learned

1. **Convex Node.js files are action-only** - This is a hard constraint. Plan file structure accordingly.

2. **TypeScript circularity requires explicit types** - When functions call each other, add return type annotations.

3. **External APIs need truncation** - Long transcripts hit token limits. Truncate before sending.

4. **Pipeline pattern works well** - Chain actions with early-exit. Return structured result showing which step failed.

5. **AssemblyAI is surprisingly simple** - No audio extraction needed, handles video URLs, synchronous API.

6. **Government video platforms have APIs** - Cablecast has a REST API; don't scrape HTML unnecessarily.

7. **Convex env vars are separate from local env** - Use `npx convex env set` and `npx convex env list` to manage. Local `.env.local` doesn't apply to server-side actions.

8. **OpenRouter free models are unreliable** - `:free` suffix models return 429 rate limits frequently. GPT-4o-mini is cheap enough for testing.

9. **Add a reset mutation for debugging** - `resetToPending` mutation is invaluable for retrying failed pipeline runs during development.

## Related

- `fort-collins-municode-scraping` - Meeting scraping patterns
- Convex docs: [Actions](https://docs.convex.dev/functions/actions)
- AssemblyAI docs: [Transcribe audio](https://www.assemblyai.com/docs/getting-started/transcribe-an-audio-file)

---

**Created**: 2026-01-13
**Updated**: 2026-01-13 (added model selection, env var, and debugging lessons)
**Success Rate**: 3/3 tasks completed
