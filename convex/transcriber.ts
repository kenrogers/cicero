"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export const transcribeMeeting = action({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      transcriptId: v.string(),
      text: v.string(),
    }),
    v.object({
      success: v.literal(false),
      reason: v.string(),
    })
  ),
  handler: async (
    ctx,
    args
  ): Promise<
    | { success: true; transcriptId: string; text: string }
    | { success: false; reason: string }
  > => {
    const meeting: {
      _id: Id<"meetings">;
      title: string;
      videoUrl?: string;
      status: string;
    } | null = await ctx.runQuery(internal.meetings.getByIdForTranscription, {
      meetingId: args.meetingId,
    });

    if (!meeting) {
      return { success: false, reason: "Meeting not found" };
    }

    if (!meeting.videoUrl) {
      return {
        success: false,
        reason: "No video URL available for this meeting",
      };
    }

    await ctx.runMutation(internal.meetings.updateStatus, {
      id: args.meetingId,
      status: "processing",
    });

    try {
      const transcript = await client.transcripts.transcribe({
        audio: meeting.videoUrl,
      });

      if (transcript.status === "error") {
        await ctx.runMutation(internal.meetings.updateStatus, {
          id: args.meetingId,
          status: "failed",
          errorMessage: transcript.error || "Transcription failed",
        });
        return {
          success: false,
          reason: transcript.error || "Transcription failed",
        };
      }

      const textContent = transcript.text || "";

      const storageId = await ctx.storage.store(
        new Blob([textContent], { type: "text/plain" })
      );

      await ctx.runMutation(internal.transcriberHelpers.saveTranscriptStorageId, {
        meetingId: args.meetingId,
        storageId,
      });

      return {
        success: true,
        transcriptId: transcript.id,
        text: textContent.slice(0, 500) + (textContent.length > 500 ? "..." : ""),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await ctx.runMutation(internal.meetings.updateStatus, {
        id: args.meetingId,
        status: "failed",
        errorMessage,
      });
      return { success: false, reason: errorMessage };
    }
  },
});

export const transcribeMeetingInternal = internalAction({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      transcriptId: v.string(),
      text: v.string(),
    }),
    v.object({
      success: v.literal(false),
      reason: v.string(),
    })
  ),
  handler: async (
    ctx,
    args
  ): Promise<
    | { success: true; transcriptId: string; text: string }
    | { success: false; reason: string }
  > => {
    const meeting: {
      _id: Id<"meetings">;
      title: string;
      videoUrl?: string;
      status: string;
    } | null = await ctx.runQuery(internal.meetings.getByIdForTranscription, {
      meetingId: args.meetingId,
    });

    if (!meeting) {
      return { success: false, reason: "Meeting not found" };
    }

    if (!meeting.videoUrl) {
      return {
        success: false,
        reason: "No video URL available for this meeting",
      };
    }

    await ctx.runMutation(internal.meetings.updateStatus, {
      id: args.meetingId,
      status: "processing",
    });

    try {
      const transcript = await client.transcripts.transcribe({
        audio: meeting.videoUrl,
      });

      if (transcript.status === "error") {
        await ctx.runMutation(internal.meetings.updateStatus, {
          id: args.meetingId,
          status: "failed",
          errorMessage: transcript.error || "Transcription failed",
        });
        return {
          success: false,
          reason: transcript.error || "Transcription failed",
        };
      }

      const textContent = transcript.text || "";

      const storageId = await ctx.storage.store(
        new Blob([textContent], { type: "text/plain" })
      );

      await ctx.runMutation(internal.transcriberHelpers.saveTranscriptStorageId, {
        meetingId: args.meetingId,
        storageId,
      });

      return {
        success: true,
        transcriptId: transcript.id,
        text: textContent.slice(0, 500) + (textContent.length > 500 ? "..." : ""),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await ctx.runMutation(internal.meetings.updateStatus, {
        id: args.meetingId,
        status: "failed",
        errorMessage,
      });
      return { success: false, reason: errorMessage };
    }
  },
});

export const transcribePendingMeetings = action({
  args: {},
  returns: v.object({
    processed: v.number(),
    successful: v.number(),
    failed: v.number(),
    results: v.array(
      v.object({
        meetingId: v.id("meetings"),
        title: v.string(),
        success: v.boolean(),
        reason: v.optional(v.string()),
      })
    ),
  }),
  handler: async (ctx) => {
    const meetings: Array<{
      _id: Id<"meetings">;
      title: string;
      videoUrl?: string;
    }> = await ctx.runQuery(internal.meetings.getMeetingsReadyForTranscription);

    const results: Array<{
      meetingId: Id<"meetings">;
      title: string;
      success: boolean;
      reason?: string;
    }> = [];

    for (const meeting of meetings) {
      const result = await ctx.runAction(
        internal.transcriber.transcribeMeetingInternal,
        { meetingId: meeting._id }
      );

      results.push({
        meetingId: meeting._id,
        title: meeting.title,
        success: result.success,
        reason: result.success ? undefined : result.reason,
      });
    }

    return {
      processed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  },
});
