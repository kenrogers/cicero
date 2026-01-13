import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save transcript storage ID to summaries table (creates placeholder if needed)
 */
export const saveTranscriptStorageId = internalMutation({
  args: {
    meetingId: v.id("meetings"),
    storageId: v.id("_storage"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingSummary = await ctx.db
      .query("summaries")
      .withIndex("byMeetingId", (q) => q.eq("meetingId", args.meetingId))
      .unique();

    if (existingSummary) {
      await ctx.db.patch(existingSummary._id, {
        transcriptStorageId: args.storageId,
      });
    } else {
      await ctx.db.insert("summaries", {
        meetingId: args.meetingId,
        tldr: "",
        keyTopics: [],
        decisions: [],
        actionSteps: [],
        transcriptStorageId: args.storageId,
      });
    }

    return null;
  },
});
