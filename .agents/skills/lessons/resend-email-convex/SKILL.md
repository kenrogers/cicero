# Lesson: Resend Email Integration with Convex

**name**: resend-email-convex
**description**: Integrating Resend email service with Convex for transactional emails and subscriber notifications. Covers Node.js action setup, email templates, subscriber management, unsubscribe flows, and hooking emails to pipeline completion. Use when adding email notifications, building newsletter systems, or integrating Resend with Convex actions.

---

## Context

Building email notifications for Cicero - sending meeting summary alerts to subscribers when new summaries are published. Needed subscribe/unsubscribe flow, HTML email templates, and pipeline integration.

## What Worked ✅

### Resend in Convex Node Actions

**Must use `"use node"` directive:**
```typescript
"use node";

import { internalAction } from "./_generated/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
```

**Simple email sending:**
```typescript
const { error } = await resend.emails.send({
  from: "App Name <notifications@resend.dev>",
  to: args.email,
  subject: "Your Subject",
  html: `<html>...</html>`,
});

if (error) {
  return { success: false, error: error.message };
}
```

### Subscriber Management Pattern

**Upsert pattern for subscribe:**
```typescript
const existing = await ctx.db
  .query("subscribers")
  .withIndex("byEmail", (q) => q.eq("email", email))
  .unique();

if (existing) {
  if (existing.status === "active") {
    return { success: true, message: "Already subscribed" };
  }
  // Reactivate
  await ctx.db.patch(existing._id, { status: "active" });
  return { success: true, message: "Subscription reactivated" };
}

await ctx.db.insert("subscribers", { email, status: "active" });
```

**Schema for subscribers:**
```typescript
subscribers: defineTable({
  email: v.string(),
  status: v.union(v.literal("active"), v.literal("unsubscribed")),
  lastEmailedAt: v.optional(v.number()),
})
  .index("byEmail", ["email"])
  .index("byStatus", ["status"]),
```

### Unsubscribe Flow

**Unsubscribe link in emails:**
```typescript
const unsubscribeUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(args.email)}`;
```

**Unsubscribe page pattern:**
- Read email from URL params
- Call unsubscribe mutation on mount
- Show success/error state
- Wrap in Suspense for useSearchParams()

### Hooking to Pipeline

**Non-blocking email after success:**
```typescript
if (summaryResult.success && summaryResult.tldr) {
  try {
    await ctx.runAction(internal.emailer.notifyAllSubscribers, {
      meetingId: args.meetingId,
      meetingTitle: meeting.title,
      meetingDate: dateStr,
      tldr: summaryResult.tldr,
    });
  } catch (err) {
    console.error("Failed to send email notifications:", err);
    // Don't fail pipeline
  }
}
```

### Email Template Structure

**Clean HTML email:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="font-size: 24px;">Title</h1>
  <div style="background: #f5f5f5; padding: 16px; border-radius: 8px;">
    Content
  </div>
  <a href="${url}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
    CTA Button
  </a>
  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
  <p style="font-size: 12px; color: #999;">
    <a href="${unsubscribeUrl}">Unsubscribe</a>
  </p>
</body>
</html>
```

## What Failed ❌

| Attempt | Why It Failed | Fix |
|---------|---------------|-----|
| Sending to any email with Resend free tier | Can only send to your own verified email | Must verify a domain at resend.com/domains for production |
| Using `notifications@resend.dev` for production | Only works for testing | Use verified domain email |

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Internal actions for email sending | Email is triggered by pipeline, not user directly | Clean separation |
| Don't fail pipeline on email errors | Email is secondary to summarization | Pipeline resilient |
| Store lastEmailedAt | Track when subscribers were last notified | Useful for debugging |
| Lowercase emails before storing | Prevent duplicate subscriptions | Cleaner data |

## Exact Parameters

**Resend setup:**
- Package: `resend` npm
- Env var: `npx convex env set RESEND_API_KEY "re_..."`
- Free tier: Only send to your own email
- Production: Verify domain at resend.com/domains

**Files created:**
```
convex/
├── subscribers.ts    # subscribe, unsubscribe, getActiveSubscribers
├── emailer.ts        # "use node" - sendSummaryNotification, notifyAllSubscribers

app/
├── (landing)/SubscribeForm.tsx  # Client form component
├── unsubscribe/page.tsx         # Unsubscribe handler page
```

## Lessons Learned

1. **Resend free tier is email-restricted** - Can only send to your own verified email. Need domain verification for real users.

2. **Wrap useSearchParams in Suspense** - Next.js 14+ requires Suspense boundary for useSearchParams in client components.

3. **Don't block on email failures** - Wrap email sending in try/catch, log errors, continue pipeline.

4. **Email validation is simple** - Basic regex + lowercase + trim is sufficient for MVP.

5. **Upsert pattern handles resubscription** - Check if exists, reactivate if unsubscribed, insert if new.

6. **Inline styles for emails** - Email clients strip `<style>` tags, must use inline styles.

## Related

- `ai-processing-pipeline-convex` - Pipeline orchestration patterns
- Resend docs: https://resend.com/docs
- Convex Node actions: https://docs.convex.dev/functions/actions

---

**Created**: 2026-01-13
**Session Duration**: ~15 minutes
**Success Rate**: 4/4 tasks completed
