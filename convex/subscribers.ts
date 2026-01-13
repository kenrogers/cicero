import {
  query,
  mutation,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { v } from "convex/values";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limit: 5 attempts per email per minute
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 5;

/**
 * Check and update rate limit for a given key.
 * Returns true if request is allowed, false if rate limited.
 */
async function checkRateLimit(
  ctx: { db: any },
  key: string
): Promise<boolean> {
  const now = Date.now();

  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("byKey", (q: any) => q.eq("key", key))
    .unique();

  if (!existing) {
    await ctx.db.insert("rateLimits", {
      key,
      count: 1,
      windowStart: now,
    });
    return true;
  }

  // Check if window has expired
  if (now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    await ctx.db.patch(existing._id, {
      count: 1,
      windowStart: now,
    });
    return true;
  }

  // Check if under limit
  if (existing.count < RATE_LIMIT_MAX_ATTEMPTS) {
    await ctx.db.patch(existing._id, {
      count: existing.count + 1,
    });
    return true;
  }

  return false;
}

/**
 * Subscribe an email address to notifications.
 * Uses upsert pattern - reactivates if previously unsubscribed.
 * Rate limited to prevent spam.
 */
export const subscribe = mutation({
  args: {
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    if (!EMAIL_REGEX.test(email)) {
      return { success: false, message: "Invalid email format" };
    }

    // Rate limit by email to prevent spam
    const rateLimitKey = `subscribe:${email}`;
    const allowed = await checkRateLimit(ctx, rateLimitKey);
    if (!allowed) {
      return {
        success: false,
        message: "Too many attempts. Please try again in a minute.",
      };
    }

    const existing = await ctx.db
      .query("subscribers")
      .withIndex("byEmail", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      if (existing.status === "active") {
        return { success: true, message: "Already subscribed" };
      }
      await ctx.db.patch(existing._id, { status: "active" });
      return { success: true, message: "Subscription reactivated" };
    }

    await ctx.db.insert("subscribers", {
      email,
      status: "active",
    });

    return { success: true, message: "Successfully subscribed" };
  },
});

/**
 * Unsubscribe an email address from notifications.
 */
export const unsubscribe = mutation({
  args: {
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    const existing = await ctx.db
      .query("subscribers")
      .withIndex("byEmail", (q) => q.eq("email", email))
      .unique();

    if (!existing) {
      return { success: true, message: "Email not found" };
    }

    if (existing.status === "unsubscribed") {
      return { success: true, message: "Already unsubscribed" };
    }

    await ctx.db.patch(existing._id, { status: "unsubscribed" });
    return { success: true, message: "Successfully unsubscribed" };
  },
});

/**
 * Get all active subscribers (internal use only).
 */
export const getActiveSubscribers = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("subscribers"),
      _creationTime: v.number(),
      email: v.string(),
      status: v.literal("active"),
      lastEmailedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx) => {
    const subscribers = await ctx.db
      .query("subscribers")
      .withIndex("byStatus", (q) => q.eq("status", "active"))
      .collect();

    return subscribers.map((s) => ({
      _id: s._id,
      _creationTime: s._creationTime,
      email: s.email,
      status: "active" as const,
      lastEmailedAt: s.lastEmailedAt,
    }));
  },
});

/**
 * Update lastEmailedAt timestamp for a subscriber.
 */
export const updateLastEmailed = internalMutation({
  args: {
    subscriberId: v.id("subscribers"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.subscriberId, {
      lastEmailedAt: Date.now(),
    });
    return null;
  },
});

/**
 * Get subscriber count (for landing page stats).
 */
export const getSubscriberCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const subscribers = await ctx.db
      .query("subscribers")
      .withIndex("byStatus", (q) => q.eq("status", "active"))
      .collect();
    return subscribers.length;
  },
});
