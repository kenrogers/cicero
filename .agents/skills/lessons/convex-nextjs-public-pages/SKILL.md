# Lesson: Building Public Pages with Convex and Next.js

**name**: convex-nextjs-public-pages
**description**: Building public-facing pages that display Convex data in Next.js. Covers client components for real-time queries, list/detail page patterns, loading states with Skeleton, badge styling for status/type indicators, and linking between pages with dynamic routes. Use when building public pages that query Convex, creating list/detail views, or implementing real-time data display.

---

## Context

Building public web pages for Cicero that display City Council meeting summaries from Convex. Pages needed to show a list of meetings and detailed summary views.

## What Worked ✅

### Client Components for Convex Queries

Convex queries must run in client components with `"use client"`:

```typescript
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MeetingsList() {
  const meetings = useQuery(api.meetings.list, {});
  
  if (meetings === undefined) {
    return <LoadingSkeleton />;
  }
  // ...
}
```

### List/Detail Page Pattern

**List page structure:**
```
app/meetings/
├── page.tsx         # Server component with metadata
└── MeetingsList.tsx # Client component with useQuery
```

**Detail page structure:**
```
app/meetings/[id]/
├── page.tsx           # Server component, extracts params
└── MeetingDetail.tsx  # Client component with useQuery
```

### Dynamic Route Params in Next.js 15

Next.js 15 requires `await` on params:

```typescript
type Props = {
  params: Promise<{ id: string }>;
};

export default async function MeetingPage({ params }: Props) {
  const { id } = await params;
  return <MeetingDetail meetingId={id} />;
}
```

### Loading States with Skeleton

Always handle `undefined` state (loading):

```typescript
if (meetings === undefined) {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Status Badge Styling

Use semantic colors for status indicators:

```typescript
function getStatusBadge(status: string) {
  switch (status) {
    case "complete":
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Ready</Badge>;
    case "processing":
      return <Badge variant="secondary">Processing...</Badge>;
    case "pending":
      return <Badge variant="outline">Coming Soon</Badge>;
    case "failed":
      return <Badge variant="destructive">Error</Badge>;
  }
}
```

### Type-Safe Convex IDs

Cast string params to Convex ID types:

```typescript
import { Id } from "@/convex/_generated/dataModel";

const meeting = useQuery(api.meetings.getById, {
  id: meetingId as Id<"meetings">,
});
```

## What Failed ❌

| Attempt | Why It Failed | Fix |
|---------|---------------|-----|
| SSG with `generateStaticParams` for Convex data | Convex queries require client-side execution | Accept client-rendering for now; SSG would require server-side Convex client |

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Client components for data pages | Convex `useQuery` requires React context | Works well, real-time updates |
| Separate list and detail components | Clean separation of concerns | Easy to maintain |
| Show processing meetings in separate section | Clear UX for what's available | Users understand status |

## Lessons Learned

1. **Convex queries = client components** - No way around this without server-side Convex client setup
2. **Next.js 15 params are async** - Must `await params` in page components
3. **Always handle undefined** - Convex returns `undefined` while loading, not `null`
4. **Badge colors for semantics** - Green for success, orange for warning, red for error
5. **Skeleton arrays with keys** - Use `[1,2,3].map((i) => <Skeleton key={i} />)` for loading states

## Files Created

```
app/meetings/
├── page.tsx              # List page with metadata
├── MeetingsList.tsx      # Client component for list
└── [id]/
    ├── page.tsx          # Detail page with dynamic route
    └── MeetingDetail.tsx # Client component for detail
```

## Related

- `ai-processing-pipeline-convex` - Where the meeting data comes from
- Convex docs: [Reading Data](https://docs.convex.dev/client/react/reading-data)

---

**Created**: 2026-01-13
**Phase**: 4 - Web Interface
**Success Rate**: 3/3 tasks completed
