"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const CABLECAST_API_BASE =
  "https://reflect-vod-fcgov.cablecast.tv/cablecastapi/v1";

interface CablecastShow {
  id: number;
  title: string;
  eventDate: string;
  customFields: Array<{
    fieldName: string;
    value: string | null;
  }>;
  hasCaptions: boolean;
}

interface CablecastResponse {
  shows: CablecastShow[];
}

function extractVideoUrl(show: CablecastShow): string | null {
  const downloadField = show.customFields.find(
    (f) => f.fieldName === "Download VOD" && f.value
  );
  if (downloadField?.value) {
    return downloadField.value;
  }
  return null;
}

function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
}

export const extractVideoUrlForMeeting = action({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      videoUrl: v.string(),
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
    { success: true; videoUrl: string } | { success: false; reason: string }
  > => {
    const meeting: {
      _id: Id<"meetings">;
      title: string;
      date: number;
      videoUrl?: string;
    } | null = await ctx.runQuery(internal.meetings.getByIdInternal, {
      meetingId: args.meetingId,
    });

    if (!meeting) {
      return { success: false, reason: "Meeting not found" };
    }

    if (meeting.videoUrl) {
      return { success: true, videoUrl: meeting.videoUrl };
    }

    const meetingDate = normalizeDate(new Date(meeting.date).toISOString());
    const searchResponse = await fetch(
      `${CABLECAST_API_BASE}/shows?search=city%20council&pageSize=50`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cicero/1.0 (+https://cicero.app)",
        },
      }
    );

    if (!searchResponse.ok) {
      return {
        success: false,
        reason: `Cablecast API error: ${searchResponse.status}`,
      };
    }

    const data: CablecastResponse = await searchResponse.json();

    const matchingShow = data.shows.find((show) => {
      const showDate = normalizeDate(show.eventDate);
      const titleLower = show.title.toLowerCase();
      const meetingTitleLower = meeting.title.toLowerCase();

      const dateMatches = showDate === meetingDate;
      const typeMatches =
        (meetingTitleLower.includes("regular") &&
          titleLower.includes("regular")) ||
        (meetingTitleLower.includes("work session") &&
          titleLower.includes("work session")) ||
        (meetingTitleLower.includes("special") &&
          titleLower.includes("special"));

      return dateMatches && typeMatches;
    });

    if (!matchingShow) {
      return {
        success: false,
        reason: `No matching Cablecast show found for ${meeting.title} on ${meetingDate}`,
      };
    }

    const videoUrl = extractVideoUrl(matchingShow);

    if (!videoUrl) {
      return {
        success: false,
        reason: `Cablecast show found but no video URL available yet (show ID: ${matchingShow.id})`,
      };
    }

    await ctx.runMutation(internal.meetings.updateVideoUrl, {
      meetingId: args.meetingId,
      videoUrl,
    });

    return { success: true, videoUrl };
  },
});

export const extractVideoUrlsForPendingMeetings = action({
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
        videoUrl: v.optional(v.string()),
        reason: v.optional(v.string()),
      })
    ),
  }),
  handler: async (ctx) => {
    const meetings = await ctx.runQuery(
      internal.meetings.getMeetingsWithoutVideoUrl
    );

    const results: Array<{
      meetingId: Id<"meetings">;
      title: string;
      success: boolean;
      videoUrl?: string;
      reason?: string;
    }> = [];

    for (const meeting of meetings) {
      const result = await ctx.runAction(
        internal.videoExtractor.extractVideoUrlForMeetingInternal,
        {
          meetingId: meeting._id,
        }
      );

      if (result.success) {
        results.push({
          meetingId: meeting._id,
          title: meeting.title,
          success: true,
          videoUrl: result.videoUrl,
        });
      } else {
        results.push({
          meetingId: meeting._id,
          title: meeting.title,
          success: false,
          reason: result.reason,
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

export const extractVideoUrlForMeetingInternal = internalAction({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      videoUrl: v.string(),
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
    { success: true; videoUrl: string } | { success: false; reason: string }
  > => {
    const meeting: {
      _id: Id<"meetings">;
      title: string;
      date: number;
      videoUrl?: string;
    } | null = await ctx.runQuery(internal.meetings.getByIdInternal, {
      meetingId: args.meetingId,
    });

    if (!meeting) {
      return { success: false, reason: "Meeting not found" };
    }

    if (meeting.videoUrl) {
      return { success: true, videoUrl: meeting.videoUrl };
    }

    const meetingDate = normalizeDate(new Date(meeting.date).toISOString());
    const searchResponse = await fetch(
      `${CABLECAST_API_BASE}/shows?search=city%20council&pageSize=50`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cicero/1.0 (+https://cicero.app)",
        },
      }
    );

    if (!searchResponse.ok) {
      return {
        success: false,
        reason: `Cablecast API error: ${searchResponse.status}`,
      };
    }

    const data: CablecastResponse = await searchResponse.json();

    const matchingShow = data.shows.find((show) => {
      const showDate = normalizeDate(show.eventDate);
      const titleLower = show.title.toLowerCase();
      const meetingTitleLower = meeting.title.toLowerCase();

      const dateMatches = showDate === meetingDate;
      const typeMatches =
        (meetingTitleLower.includes("regular") &&
          titleLower.includes("regular")) ||
        (meetingTitleLower.includes("work session") &&
          titleLower.includes("work session")) ||
        (meetingTitleLower.includes("special") &&
          titleLower.includes("special"));

      return dateMatches && typeMatches;
    });

    if (!matchingShow) {
      return {
        success: false,
        reason: `No matching Cablecast show found for ${meeting.title} on ${meetingDate}`,
      };
    }

    const videoUrl = extractVideoUrl(matchingShow);

    if (!videoUrl) {
      return {
        success: false,
        reason: `Cablecast show found but no video URL available yet (show ID: ${matchingShow.id})`,
      };
    }

    await ctx.runMutation(internal.meetings.updateVideoUrl, {
      meetingId: args.meetingId,
      videoUrl,
    });

    return { success: true, videoUrl };
  },
});
