# Phase 6: Polish & Deploy

## Goal
Production-ready MVP with error handling, SEO, and deployment to Vercel + Convex production.

## Context
- Pipeline works end-to-end (scrape → transcribe → summarize → email)
- Web interface exists at /meetings with individual meeting pages
- Email system operational with Resend
- Need: error resilience, user feedback, SEO, and production deployment

## Tasks

### Task 1: Error Handling & Loading States
Add user-facing error handling and loading states throughout the app.

**Files to create**:
- `app/meetings/loading.tsx` - Loading skeleton for meetings list
- `app/meetings/[id]/loading.tsx` - Loading skeleton for meeting detail
- `app/meetings/error.tsx` - Error boundary for meetings section
- `app/meetings/[id]/error.tsx` - Error boundary for meeting detail

**Files to modify**:
- `app/meetings/MeetingsList.tsx` - Add empty state, error state
- `app/meetings/[id]/MeetingDetail.tsx` - Add not-found handling, loading states

**Requirements**:
- Skeleton loaders that match content layout
- Friendly error messages (not stack traces)
- "Try again" functionality where applicable
- Empty state when no meetings exist

**Verify**: Navigate to invalid meeting ID, see friendly error. Refresh during load, see skeleton.

---

### Task 2: SEO & Meta Tags
Add proper meta tags, Open Graph, and structured data for search engines and social sharing.

**Files to modify**:
- `app/layout.tsx` - Update default metadata for Cicero branding
- `app/meetings/page.tsx` - Add meetings list metadata
- `app/meetings/[id]/page.tsx` - Dynamic metadata from meeting data

**Files to create**:
- `app/opengraph-image.tsx` - Default OG image (or static in /public)
- `app/sitemap.ts` - Dynamic sitemap including all meetings
- `app/robots.ts` - robots.txt configuration

**Requirements**:
- Title format: "Meeting Title | Cicero"
- OG images for social sharing
- Sitemap includes /meetings and /meetings/[id] pages
- JSON-LD structured data for meetings (Event schema)

**Verify**: Share meeting URL on social media preview tool, see proper card.

---

### Task 3: Rate Limiting on Public Endpoints
Protect public mutations from abuse.

**Files to modify**:
- `convex/subscribers.ts` - Rate limit subscribe mutation
- `convex/scraper.ts` - Rate limit manual scrape trigger (if public)

**Implementation**:
- Use Convex rate limiting pattern (if available) or simple time-based check
- Subscribe: max 5 per IP per minute
- Scrape trigger: admin-only (already protected?)

**Verify**: Rapid subscribe attempts get blocked after limit.

---

### Task 4: Production Environment Setup
Configure production Convex and Vercel deployments.

**Files to create**:
- `DEPLOYMENT.md` - Deployment instructions and checklist

**Environment variables needed in Convex production**:
- `ASSEMBLYAI_API_KEY`
- `OPENROUTER_API_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`

**Vercel environment variables**:
- `NEXT_PUBLIC_CONVEX_URL` (production Convex URL)
- `CONVEX_DEPLOY_KEY` (for CI/CD)
- Clerk keys (production)

**Steps**:
1. Create production Convex deployment
2. Set all environment variables
3. Deploy to Vercel
4. Configure custom domain (if available)
5. Test full pipeline in production

**Verify**: Live site at production URL, can view real meeting summaries.

---

## Success Criteria
- [x] Loading skeletons appear during data fetch
- [x] Errors show friendly messages with recovery options
- [x] Meeting pages have proper OG tags for social sharing
- [x] Sitemap is accessible at /sitemap.xml
- [x] Rate limiting prevents subscribe spam
- [ ] Production deployment live and functional
- [ ] Can process a real meeting end-to-end in production

## Dependencies
- Vercel account
- Custom domain (optional)
- Production API keys for all services

## Notes
- Keep error messages user-friendly, log details server-side
- Test OG images with https://www.opengraph.xyz/
- Consider adding `/admin` route protection before deploy
