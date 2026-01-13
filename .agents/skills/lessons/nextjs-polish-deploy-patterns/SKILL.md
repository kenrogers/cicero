# Lesson: Next.js Polish & Deploy Patterns

**name**: nextjs-polish-deploy-patterns
**description**: Patterns for polishing a Next.js 15 + Convex app for production. Covers Next.js loading.tsx and error.tsx boundaries, dynamic metadata with generateMetadata, sitemap.ts and robots.ts generation, Convex rate limiting with a rateLimits table, and deployment documentation. Use when preparing any Next.js app for production, adding SEO, implementing rate limiting in Convex, or creating deployment guides.

---

## Context

Final polish phase for Cicero - an AI-powered civic engagement tool. Needed to add error handling, SEO, rate limiting, and deployment documentation before going to production.

## What Worked ✅

### Next.js Loading & Error Boundaries

**File structure for automatic handling:**
```
app/meetings/
├── loading.tsx      # Shows during page load
├── error.tsx        # Catches errors in this route
├── page.tsx
└── [id]/
    ├── loading.tsx  # Shows during detail page load
    ├── error.tsx    # Catches errors in detail page
    ├── not-found.tsx # Shows for invalid IDs
    └── page.tsx
```

**Error boundary pattern:**
```tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="text-center py-12">
      <h1>Something went wrong</h1>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

**Key insight:** Error boundaries must be client components (`"use client"`).

### Dynamic Metadata with Server-Side Fetch

**Pattern for dynamic OG tags:**
```tsx
import { ConvexHttpClient } from "convex/browser";
import { notFound } from "next/navigation";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const data = await convex.query(api.items.getById, { id });
    if (!data) return { title: "Not Found" };
    
    return {
      title: data.title,
      description: data.description,
      openGraph: { title: `${data.title} | Site Name` },
    };
  } catch {
    return { title: "Item" };
  }
}
```

**Key insight:** Use `ConvexHttpClient` for server-side data fetching in metadata generation.

### Sitemap & Robots Generation

**Dynamic sitemap.ts:**
```tsx
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  
  const items = await convex.query(api.items.list, {});
  
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    ...items.map((item) => ({
      url: `${baseUrl}/items/${item._id}`,
      lastModified: new Date(item._creationTime),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
```

**AI-friendly robots.ts:**
```tsx
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "GPTBot", allow: ["/", "/content/"] },
      { userAgent: "Claude-Web", allow: ["/", "/content/"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### Convex Rate Limiting Pattern

**Schema addition:**
```typescript
rateLimits: defineTable({
  key: v.string(),      // e.g., "subscribe:email@example.com"
  count: v.number(),
  windowStart: v.number(),
}).index("byKey", ["key"]),
```

**Rate limit helper:**
```typescript
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

async function checkRateLimit(ctx: { db: any }, key: string): Promise<boolean> {
  const now = Date.now();
  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("byKey", (q) => q.eq("key", key))
    .unique();

  if (!existing) {
    await ctx.db.insert("rateLimits", { key, count: 1, windowStart: now });
    return true;
  }

  if (now - existing.windowStart > WINDOW_MS) {
    await ctx.db.patch(existing._id, { count: 1, windowStart: now });
    return true;
  }

  if (existing.count < MAX_ATTEMPTS) {
    await ctx.db.patch(existing._id, { count: existing.count + 1 });
    return true;
  }

  return false;
}
```

**Usage in mutation:**
```typescript
const allowed = await checkRateLimit(ctx, `subscribe:${email}`);
if (!allowed) {
  return { success: false, message: "Too many attempts. Try again later." };
}
```

## What Failed ❌

| Attempt | Why It Failed | Fix |
|---------|---------------|-----|
| Using `useQuery` in generateMetadata | Server component can't use hooks | Use `ConvexHttpClient` instead |
| Forgetting `"use client"` on error.tsx | Error boundaries need client-side `reset()` | Add directive |

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skeleton loaders match content | Better perceived performance | Clean UX |
| Rate limit by email, not IP | Convex mutations don't have IP access | Works for spam prevention |
| Comprehensive DEPLOYMENT.md | Reduces deployment errors | Clear checklist |

## Exact Parameters

**Rate limiting:**
- Window: 60 seconds
- Max attempts: 5 per key per window
- Key format: `action:identifier` (e.g., `subscribe:email@example.com`)

**Metadata template:**
```typescript
title: {
  default: "Site Name | Tagline",
  template: "%s | Site Name",  // For child pages
}
```

## Files Created

```
app/meetings/loading.tsx
app/meetings/error.tsx
app/meetings/[id]/loading.tsx
app/meetings/[id]/error.tsx
app/meetings/[id]/not-found.tsx
app/sitemap.ts
app/robots.ts
DEPLOYMENT.md
```

## Lessons Learned

1. **Loading/error files are automatic** - Next.js picks them up by convention, no imports needed
2. **ConvexHttpClient for server-side** - Use it in generateMetadata, sitemap.ts, API routes
3. **Rate limiting needs persistence** - In-memory doesn't work with serverless; use a table
4. **AI crawlers are different** - GPTBot, Claude-Web, Amazonbot have their own user agents
5. **notFound() triggers not-found.tsx** - Clean pattern for invalid IDs

## Related

- [Next.js Loading UI docs](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Next.js Error Handling docs](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Next.js Metadata docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
