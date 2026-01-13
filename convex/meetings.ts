import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all meetings, sorted by date descending
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("complete"),
        v.literal("failed")
      )
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("meetings"),
      _creationTime: v.number(),
      municodeId: v.string(),
      date: v.number(),
      title: v.string(),
      type: v.union(v.literal("regular"), v.literal("work_session"), v.literal("special")),
      agendaUrl: v.optional(v.string()),
      agendaPacketUrl: v.optional(v.string()),
      videoPageUrl: v.optional(v.string()),
      videoUrl: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("complete"),
        v.literal("failed")
      ),
      errorMessage: v.optional(v.string()),
      processedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    let q = ctx.db.query("meetings").withIndex("byDate").order("desc");

    const meetings = await q.collect();

    // Filter by status if provided
    let filtered = meetings;
    if (args.status) {
      filtered = meetings.filter((m) => m.status === args.status);
    }

    // Apply limit
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

/**
 * Get a single meeting by ID
 */
export const getById = query({
  args: { id: v.id("meetings") },
  returns: v.union(
    v.object({
      _id: v.id("meetings"),
      _creationTime: v.number(),
      municodeId: v.string(),
      date: v.number(),
      title: v.string(),
      type: v.union(v.literal("regular"), v.literal("work_session"), v.literal("special")),
      agendaUrl: v.optional(v.string()),
      agendaPacketUrl: v.optional(v.string()),
      videoPageUrl: v.optional(v.string()),
      videoUrl: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("complete"),
        v.literal("failed")
      ),
      errorMessage: v.optional(v.string()),
      processedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Check if a meeting with a given municodeId already exists
 */
export const getByMunicodeId = query({
  args: { municodeId: v.string() },
  returns: v.union(v.id("meetings"), v.null()),
  handler: async (ctx, args) => {
    const meeting = await ctx.db
      .query("meetings")
      .withIndex("byMunicodeId", (q) => q.eq("municodeId", args.municodeId))
      .unique();
    return meeting?._id ?? null;
  },
});

/**
 * Create a new meeting (internal only - called by scraper)
 */
export const create = internalMutation({
  args: {
    municodeId: v.string(),
    date: v.number(),
    title: v.string(),
    type: v.union(v.literal("regular"), v.literal("work_session"), v.literal("special")),
    agendaUrl: v.optional(v.string()),
    agendaPacketUrl: v.optional(v.string()),
    videoPageUrl: v.optional(v.string()),
  },
  returns: v.id("meetings"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("meetings", {
      ...args,
      status: "pending",
    });
  },
});

/**
 * Update meeting status (internal only)
 */
export const updateStatus = internalMutation({
  args: {
    id: v.id("meetings"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("complete"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    processedAt: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return null;
  },
});

/**
 * Reset meeting to pending status (for retrying failed processing)
 */
export const resetToPending = mutation({
  args: { id: v.id("meetings") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "pending",
      errorMessage: undefined,
    });
    return null;
  },
});

/**
 * Check if meeting exists by municodeId (internal query for scraper)
 */
export const existsByMunicodeId = query({
  args: { municodeId: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const meeting = await ctx.db
      .query("meetings")
      .withIndex("byMunicodeId", (q) => q.eq("municodeId", args.municodeId))
      .first();
    return meeting !== null;
  },
});

/**
 * Internal query to get a meeting by ID (for videoExtractor action)
 */
export const getByIdInternal = internalQuery({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      _id: v.id("meetings"),
      title: v.string(),
      date: v.number(),
      videoUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) return null;
    return {
      _id: meeting._id,
      title: meeting.title,
      date: meeting.date,
      videoUrl: meeting.videoUrl,
    };
  },
});

/**
 * Internal query to get meetings without video URLs (for batch extraction)
 */
export const getMeetingsWithoutVideoUrl = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("meetings"),
      title: v.string(),
      date: v.number(),
    })
  ),
  handler: async (ctx) => {
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("byStatus", (q) => q.eq("status", "pending"))
      .collect();

    return meetings
      .filter((m) => !m.videoUrl)
      .map((m) => ({
        _id: m._id,
        title: m.title,
        date: m.date,
      }));
  },
});

/**
 * Internal mutation to update video URL
 */
export const updateVideoUrl = internalMutation({
  args: {
    meetingId: v.id("meetings"),
    videoUrl: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.meetingId, {
      videoUrl: args.videoUrl,
    });
    return null;
  },
});

/**
 * Internal query to get a meeting by ID for transcription
 */
export const getByIdForTranscription = internalQuery({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      _id: v.id("meetings"),
      title: v.string(),
      videoUrl: v.optional(v.string()),
      status: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) return null;
    return {
      _id: meeting._id,
      title: meeting.title,
      videoUrl: meeting.videoUrl,
      status: meeting.status,
    };
  },
});

/**
 * Internal query to get meetings ready for transcription (have videoUrl, status pending)
 */
export const getMeetingsReadyForTranscription = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("meetings"),
      title: v.string(),
      videoUrl: v.optional(v.string()),
    })
  ),
  handler: async (ctx) => {
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("byStatus", (q) => q.eq("status", "pending"))
      .collect();

    return meetings
      .filter((m) => m.videoUrl)
      .map((m) => ({
        _id: m._id,
        title: m.title,
        videoUrl: m.videoUrl,
      }));
  },
});
