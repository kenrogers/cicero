# Lesson: Fort Collins Municode Scraping

**name**: fort-collins-municode-scraping
**description**: Scraping Fort Collins City Council meetings from Municode. Covers URL patterns, meeting ID extraction, date parsing, Cheerio usage in Convex actions, and the two-tier data source architecture (Municode for listings/agendas, Cablecast for videos). Use when scraping government meeting data, working with Municode sites, or building civic tech scrapers.

---

## Context

Building Cicero - an AI-powered civic engagement tool that summarizes Fort Collins City Council meetings. Needed to scrape meeting data from the city's Municode portal.

## Data Sources

| Source | URL | Purpose |
|--------|-----|---------|
| Municode | https://fortcollins-co.municodemeetings.com/ | Meeting listings, agendas, packets |
| Cablecast | https://reflect-vod-fcgov.cablecast.tv/ | Video recordings |

## What Worked ✅

### URL Patterns

**Agenda PDFs** (Azure blob storage):
```
https://mccmeetings.blob.core.usgovcloudapi.net/fortcollco-pubu/MEET-Agenda-{meetingId}.pdf
https://mccmeetings.blob.core.usgovcloudapi.net/fortcollco-pubu/MEET-Packet-{meetingId}.pdf
```

**Meeting ID extraction** from agenda URL:
```typescript
const match = agendaUrl.match(/MEET-(?:Agenda|Packet)-([a-f0-9-]+)\.pdf/i);
// Returns: "6b92f33287e5498795a9f5193c7374d9"
```

**Video pages** (embedded in Municode):
```
https://fortcollins-co.municodemeetings.com/bc-citycouncil/page/city-council-regular-meeting-68
```

### Date Parsing

Municode format: `"01/14/2026 - 6:00pm"`

```typescript
function parseMunicodeDate(dateStr: string): number {
  const match = dateStr.match(
    /(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{1,2}):(\d{2})(am|pm)/i
  );
  // Handle 12-hour to 24-hour conversion
  // Return Unix timestamp
}
```

### Cheerio in Convex Actions

**Must use `"use node"` directive** at top of file:
```typescript
"use node";

import { action } from "./_generated/server";
import * as cheerio from "cheerio";
```

### Scraper Architecture

Pattern that worked well:
1. Action fetches HTML and parses with Cheerio
2. For each meeting, call query to check if exists (by municodeId)
3. If new, call internal mutation to insert
4. Return stats (scraped, new, skipped)

```typescript
// Check exists via query
const exists = await ctx.runQuery(api.meetings.existsByMunicodeId, {
  municodeId: meeting.municodeId,
});

// Insert via internal mutation
await ctx.runMutation(internal.meetings.create, { ... });
```

### Meeting Type Detection

```typescript
function parseMeetingType(title: string): "regular" | "work_session" | "special" {
  const lower = title.toLowerCase();
  if (lower.includes("work session")) return "work_session";
  if (lower.includes("special")) return "special";
  return "regular";
}
```

## What Failed ❌

| Attempt | Why It Failed | Fix |
|---------|---------------|-----|
| Using lib/scraper.ts from Convex action | Can't import non-Convex code into actions easily | Duplicated parsing logic in convex/scraper.ts |
| Relying on video links in main table | Not all meetings have video links in the table | Need to follow detail page links |

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Store municodeId as string | Flexible - handles both UUIDs and slug-style IDs |
| Use internal mutations for inserts | Scraper is trusted, no need for public mutation |
| Return stats from scraper | Helpful for monitoring and debugging |

## Exact Parameters

**Scraped data per meeting:**
- municodeId (string)
- date (Unix timestamp)
- title (string)
- type (regular/work_session/special)
- agendaUrl (optional)
- agendaPacketUrl (optional)
- videoPageUrl (optional)

**Initial scrape results:** 17 City Council meetings

## Lessons Learned

1. **Municode uses Azure blob storage** - Agenda PDFs are on `mccmeetings.blob.core.usgovcloudapi.net`
2. **Meeting IDs vary** - Some are UUIDs from agenda URLs, others are slugs from page paths
3. **Future meetings have no agendas** - Only published when meeting is scheduled
4. **Videos are on separate platform** - Cablecast VOD, will need separate extraction logic
5. **`"use node"` is required** - Cheerio and other Node packages need this directive in Convex

## Files Created

- `convex/schema.ts` - Added meetings, summaries, subscribers tables
- `convex/meetings.ts` - Queries and mutations for meetings
- `convex/scraper.ts` - Action to scrape and store meetings
- `app/api/admin/scrape/route.ts` - Admin endpoint to trigger scraping
- `lib/scraper.ts` - Utility functions (not used by Convex, useful for testing)

## Next Steps (Phase 3)

- Extract actual video URLs from Cablecast pages
- Transcribe videos (Whisper API or AssemblyAI)
- Parse agenda PDFs for context
- Summarize with OpenRouter

---

**Created**: 2026-01-13
**Session Duration**: ~20 minutes
**Success Rate**: 2/2 phases completed
