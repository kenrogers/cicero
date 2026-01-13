"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import * as cheerio from "cheerio";

const MUNICODE_BASE_URL = "https://fortcollins-co.municodemeetings.com";

type MeetingType = "regular" | "work_session" | "special";

interface ScrapedMeeting {
  municodeId: string;
  date: number;
  title: string;
  type: MeetingType;
  agendaUrl?: string;
  agendaPacketUrl?: string;
  videoPageUrl?: string;
}

/**
 * Parse meeting type from title
 */
function parseMeetingType(title: string): MeetingType {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("work session")) {
    return "work_session";
  }
  if (lowerTitle.includes("special")) {
    return "special";
  }
  return "regular";
}

/**
 * Extract municode meeting ID from URL
 */
function extractMunicodeId(agendaUrl?: string, detailsPath?: string): string {
  if (agendaUrl) {
    const match = agendaUrl.match(/MEET-(?:Agenda|Packet)-([a-f0-9-]+)\.pdf/i);
    if (match) {
      return match[1];
    }
  }
  if (detailsPath) {
    const match = detailsPath.match(/\/page\/(.+)$/);
    if (match) {
      return match[1];
    }
  }
  return `unknown-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Parse date from Municode format: "01/14/2026 - 6:00pm"
 */
function parseMunicodeDate(dateStr: string): number {
  const match = dateStr.match(
    /(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{1,2}):(\d{2})(am|pm)/i
  );
  if (!match) {
    return Date.now();
  }

  const [, month, day, year, hourStr, minute, ampm] = match;
  let hour = parseInt(hourStr, 10);
  if (ampm.toLowerCase() === "pm" && hour !== 12) {
    hour += 12;
  } else if (ampm.toLowerCase() === "am" && hour === 12) {
    hour = 0;
  }

  const date = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    hour,
    parseInt(minute, 10)
  );

  return date.getTime();
}

/**
 * Scrape meetings from Municode HTML
 */
function parseMeetingsFromHtml(html: string): ScrapedMeeting[] {
  const $ = cheerio.load(html);
  const meetings: ScrapedMeeting[] = [];

  $("table tr").each((_, row) => {
    const $row = $(row);
    const cells = $row.find("td");

    if (cells.length < 2) return;

    const dateCell = $(cells[0]).text().trim();
    const meetingCell = $(cells[1]).text().trim();

    // Only process City Council meetings
    if (!meetingCell.toLowerCase().includes("city council")) {
      return;
    }

    // Extract links
    const agendaLink = $row.find('a[href*="MEET-Agenda"]').attr("href");
    const packetLink = $row.find('a[href*="MEET-Packet"]').attr("href");
    const detailsLink = $row.find('a[href*="/page/"]').attr("href");
    const videoLink = $row.find('a[title*="Video"]').attr("href");

    if (!dateCell || !meetingCell) return;

    const date = parseMunicodeDate(dateCell);
    const type = parseMeetingType(meetingCell);
    const municodeId = extractMunicodeId(agendaLink, detailsLink);

    meetings.push({
      municodeId,
      date,
      title: meetingCell,
      type,
      agendaUrl: agendaLink || undefined,
      agendaPacketUrl: packetLink || undefined,
      videoPageUrl: videoLink ? `${MUNICODE_BASE_URL}${videoLink}` : undefined,
    });
  });

  return meetings;
}

/**
 * Scrape City Council meetings from Municode and store new ones
 */
export const scrapeAndStoreMeetings = action({
  args: {},
  returns: v.object({
    scraped: v.number(),
    newMeetings: v.number(),
    skipped: v.number(),
  }),
  handler: async (ctx) => {
    // Fetch the Municode page
    const response = await fetch(MUNICODE_BASE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Cicero/1.0; +https://cicero.app)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Municode: ${response.status}`);
    }

    const html = await response.text();
    const scrapedMeetings = parseMeetingsFromHtml(html);

    let newMeetings = 0;
    let skipped = 0;

    for (const meeting of scrapedMeetings) {
      // Check if meeting already exists
      const exists = await ctx.runQuery(api.meetings.existsByMunicodeId, {
        municodeId: meeting.municodeId,
      });

      if (exists) {
        skipped++;
        continue;
      }

      // Insert new meeting
      await ctx.runMutation(internal.meetings.create, {
        municodeId: meeting.municodeId,
        date: meeting.date,
        title: meeting.title,
        type: meeting.type,
        agendaUrl: meeting.agendaUrl,
        agendaPacketUrl: meeting.agendaPacketUrl,
        videoPageUrl: meeting.videoPageUrl,
      });

      newMeetings++;
    }

    return {
      scraped: scrapedMeetings.length,
      newMeetings,
      skipped,
    };
  },
});
