"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const processOneMeeting = action({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.object({
    meetingId: v.id("meetings"),
    steps: v.object({
      videoExtraction: v.object({
        success: v.boolean(),
        videoUrl: v.optional(v.string()),
        reason: v.optional(v.string()),
      }),
      transcription: v.object({
        success: v.boolean(),
        reason: v.optional(v.string()),
      }),
      summarization: v.object({
        success: v.boolean(),
        tldr: v.optional(v.string()),
        reason: v.optional(v.string()),
      }),
    }),
    overallSuccess: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const result = {
      meetingId: args.meetingId,
      steps: {
        videoExtraction: { success: false } as {
          success: boolean;
          videoUrl?: string;
          reason?: string;
        },
        transcription: { success: false } as {
          success: boolean;
          reason?: string;
        },
        summarization: { success: false } as {
          success: boolean;
          tldr?: string;
          reason?: string;
        },
      },
      overallSuccess: false,
    };

    const videoResult = await ctx.runAction(
      api.videoExtractor.extractVideoUrlForMeeting,
      { meetingId: args.meetingId }
    );

    if (videoResult.success) {
      result.steps.videoExtraction = {
        success: true,
        videoUrl: videoResult.videoUrl,
      };
    } else {
      result.steps.videoExtraction = {
        success: false,
        reason: videoResult.reason,
      };
      return result;
    }

    const transcriptResult = await ctx.runAction(api.transcriber.transcribeMeeting, {
      meetingId: args.meetingId,
    });

    if (transcriptResult.success) {
      result.steps.transcription = { success: true };
    } else {
      result.steps.transcription = {
        success: false,
        reason: transcriptResult.reason,
      };
      return result;
    }

    const summaryResult = await ctx.runAction(api.summarizer.summarizeMeeting, {
      meetingId: args.meetingId,
    });

    if (summaryResult.success) {
      result.steps.summarization = {
        success: true,
        tldr: summaryResult.tldr,
      };
      result.overallSuccess = true;
    } else {
      result.steps.summarization = {
        success: false,
        reason: summaryResult.reason,
      };
    }

    return result;
  },
});

export const processPendingMeetings = action({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.object({
    processed: v.number(),
    successful: v.number(),
    failed: v.number(),
    results: v.array(
      v.object({
        meetingId: v.id("meetings"),
        title: v.string(),
        success: v.boolean(),
        failedStep: v.optional(v.string()),
        reason: v.optional(v.string()),
      })
    ),
  }),
  handler: async (ctx, args) => {
    const meetings: Array<{
      _id: Id<"meetings">;
      title: string;
    }> = await ctx.runQuery(internal.meetings.getMeetingsWithoutVideoUrl);

    const toProcess = args.limit ? meetings.slice(0, args.limit) : meetings;

    const results: Array<{
      meetingId: Id<"meetings">;
      title: string;
      success: boolean;
      failedStep?: string;
      reason?: string;
    }> = [];

    for (const meeting of toProcess) {
      const pipelineResult = await ctx.runAction(api.pipeline.processOneMeeting, {
        meetingId: meeting._id,
      });

      if (pipelineResult.overallSuccess) {
        results.push({
          meetingId: meeting._id,
          title: meeting.title,
          success: true,
        });
      } else {
        let failedStep = "unknown";
        let reason = "Unknown error";

        if (!pipelineResult.steps.videoExtraction.success) {
          failedStep = "videoExtraction";
          reason = pipelineResult.steps.videoExtraction.reason || reason;
        } else if (!pipelineResult.steps.transcription.success) {
          failedStep = "transcription";
          reason = pipelineResult.steps.transcription.reason || reason;
        } else if (!pipelineResult.steps.summarization.success) {
          failedStep = "summarization";
          reason = pipelineResult.steps.summarization.reason || reason;
        }

        results.push({
          meetingId: meeting._id,
          title: meeting.title,
          success: false,
          failedStep,
          reason,
        });
      }
    }

    return {
      processed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  },
});
