import { query, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

const keyTopicValidator = v.object({
  title: v.string(),
  summary: v.string(),
  sentiment: v.optional(
    v.union(
      v.literal("positive"),
      v.literal("negative"),
      v.literal("neutral"),
      v.literal("controversial")
    )
  ),
});

const decisionValidator = v.object({
  title: v.string(),
  description: v.string(),
  vote: v.optional(v.string()),
});

const actionStepValidator = v.object({
  action: v.string(),
  details: v.string(),
  contactInfo: v.optional(v.string()),
});

export const getSummaryByMeetingId = internalQuery({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      _id: v.id("summaries"),
      transcriptStorageId: v.optional(v.id("_storage")),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const summary = await ctx.db
      .query("summaries")
      .withIndex("byMeetingId", (q) => q.eq("meetingId", args.meetingId))
      .unique();

    if (!summary) return null;

    return {
      _id: summary._id,
      transcriptStorageId: summary.transcriptStorageId,
    };
  },
});

export const updateSummary = internalMutation({
  args: {
    summaryId: v.id("summaries"),
    tldr: v.string(),
    keyTopics: v.array(keyTopicValidator),
    decisions: v.array(decisionValidator),
    actionSteps: v.array(actionStepValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.summaryId, {
      tldr: args.tldr,
      keyTopics: args.keyTopics,
      decisions: args.decisions,
      actionSteps: args.actionSteps,
    });
    return null;
  },
});

export const getMeetingsReadyForSummarization = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("meetings"),
      title: v.string(),
    })
  ),
  handler: async (ctx) => {
    const summaries = await ctx.db.query("summaries").collect();

    const meetingsWithTranscripts = summaries.filter(
      (s) => s.transcriptStorageId && (!s.tldr || s.tldr === "")
    );

    const results: Array<{ _id: typeof meetingsWithTranscripts[0]["meetingId"]; title: string }> = [];

    for (const summary of meetingsWithTranscripts) {
      const meeting = await ctx.db.get(summary.meetingId);
      if (meeting && meeting.status === "processing") {
        results.push({
          _id: meeting._id,
          title: meeting.title,
        });
      }
    }

    return results;
  },
});

export const getByMeetingId = query({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      _id: v.id("summaries"),
      _creationTime: v.number(),
      meetingId: v.id("meetings"),
      tldr: v.string(),
      keyTopics: v.array(keyTopicValidator),
      decisions: v.array(decisionValidator),
      actionSteps: v.array(actionStepValidator),
      transcriptStorageId: v.optional(v.id("_storage")),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const summary = await ctx.db
      .query("summaries")
      .withIndex("byMeetingId", (q) => q.eq("meetingId", args.meetingId))
      .unique();

    return summary;
  },
});
