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
  deadline: v.optional(v.string()),
  contactEmail: v.optional(v.string()),
  contactPhone: v.optional(v.string()),
  submissionUrl: v.optional(v.string()),
  relatedAgendaItem: v.optional(v.string()),
  relatedOrdinance: v.optional(v.string()),
  urgency: v.optional(v.union(
    v.literal("immediate"),
    v.literal("upcoming"),
    v.literal("ongoing")
  )),
});

const speakerOpinionValidator = v.object({
  speakerName: v.string(),
  speakerId: v.optional(v.id("councilMembers")),
  topicTitle: v.string(),
  stance: v.union(
    v.literal("support"),
    v.literal("oppose"),
    v.literal("undecided"),
    v.literal("mixed")
  ),
  summary: v.string(),
  keyArguments: v.array(v.string()),
  quote: v.optional(v.string()),
});

const keyMomentValidator = v.object({
  timestamp: v.string(),
  timestampSeconds: v.number(),
  title: v.string(),
  description: v.string(),
  speakerName: v.optional(v.string()),
  momentType: v.union(
    v.literal("vote"),
    v.literal("debate"),
    v.literal("public_comment"),
    v.literal("presentation"),
    v.literal("decision"),
    v.literal("key_discussion")
  ),
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
    speakerOpinions: v.optional(v.array(speakerOpinionValidator)),
    keyMoments: v.optional(v.array(keyMomentValidator)),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.summaryId, {
      tldr: args.tldr,
      keyTopics: args.keyTopics,
      decisions: args.decisions,
      actionSteps: args.actionSteps,
      speakerOpinions: args.speakerOpinions,
      keyMoments: args.keyMoments,
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
      speakerOpinions: v.optional(v.array(speakerOpinionValidator)),
      keyMoments: v.optional(v.array(keyMomentValidator)),
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
