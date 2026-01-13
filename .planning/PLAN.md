# Phase 4: Web Interface

## Goal
Build the public-facing web interface for browsing City Council meeting summaries and subscribing for email updates.

## Context
- Existing landing page in `app/(landing)/` with starter kit content - needs Cicero-focused replacement
- Convex queries exist: `meetings.list`, `meetings.getById`, `summaries.getByMeetingId`
- SSG important for AI crawler discoverability (from llm-seo lesson)
- UI components available in `components/ui/`, `components/magicui/`, etc.

## Tasks

### Task 1: Cicero Landing Page
Replace starter kit landing page content with Cicero-focused messaging.

**Files to modify**:
- `app/(landing)/hero-section.tsx` - Cicero headline, value prop, CTA
- `app/(landing)/features-section.tsx` - Key features (summaries, action items, email alerts)
- `app/(landing)/workflow-section.tsx` - How it works (scrape → transcribe → summarize → notify)
- `app/(landing)/call-to-action.tsx` - Email signup CTA
- `app/(landing)/faqs.tsx` - Cicero-specific FAQs

**Keep minimal**: Focus on clarity over polish. Can enhance in Phase 6.

**Verify**: Landing page clearly explains Cicero's purpose

---

### Task 2: Meetings List Page
Display all meetings with summaries, sorted by date.

**Files to create**:
- `app/meetings/page.tsx` - List of meetings with status badges
- `app/meetings/MeetingsList.tsx` - Client component for Convex query

**Requirements**:
- Show meeting title, date, type (badge), status
- Link completed meetings to detail page
- Show "Coming soon" for pending/processing
- Use existing `meetings.list` query with `status: "complete"` filter

**Verify**: Can see list of processed meetings

---

### Task 3: Meeting Detail Page
Show full summary for a single meeting.

**Files to create**:
- `app/meetings/[id]/page.tsx` - Meeting detail with summary
- `app/meetings/[id]/MeetingDetail.tsx` - Client component

**Requirements**:
- Display: title, date, type, TLDR
- Key Topics section (with sentiment badges if present)
- Decisions section (with vote results)
- Action Steps section (with contact info)
- Link to original agenda PDF if available
- Back link to meetings list

**SSG**: Use `generateStaticParams` for completed meetings (AI crawler discoverability)

**Verify**: Can view full summary for a processed meeting

---

## Success Criteria
- [x] Landing page explains Cicero clearly
- [x] Meetings list shows all completed summaries
- [x] Meeting detail page shows full summary with all sections
- [x] Navigation between pages works
- [ ] Pages render server-side for AI crawlers (partial - detail page is client-rendered)

## Dependencies
- At least one meeting with status "complete" and summary populated

## Notes
- Email signup form moved to Phase 5 (with full email system)
- Skip fancy animations for MVP - can add in Phase 6
- Keep styling consistent with existing UI components
