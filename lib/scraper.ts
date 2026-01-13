import * as cheerio from "cheerio";

const MUNICODE_BASE_URL = "https://fortcollins-co.municodemeetings.com";
const CABLECAST_BASE_URL = "https://reflect-vod-fcgov.cablecast.tv";

export type MeetingType = "regular" | "work_session" | "special";

export interface ScrapedMeeting {
  municodeId: string;
  date: Date;
  title: string;
  type: MeetingType;
  agendaUrl?: string;
  agendaPacketUrl?: string;
  videoPageUrl?: string;
  detailsPath: string;
}

/**
 * Fetch HTML from a URL with error handling
 */
export async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Cicero/1.0; +https://cicero.app)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
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
 * URLs look like: /bc-citycouncil/page/city-council-regular-meeting-72
 * Or agenda URLs have: MEET-Agenda-{meetingId}.pdf
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
  return `unknown-${Date.now()}`;
}

/**
 * Parse date from Municode format: "01/14/2026 - 6:00pm"
 */
function parseMunicodeDate(dateStr: string): Date {
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{1,2}):(\d{2})(am|pm)/i);
  if (!match) {
    return new Date();
  }

  const [, month, day, year, hourStr, minute, ampm] = match;
  let hour = parseInt(hourStr, 10);
  if (ampm.toLowerCase() === "pm" && hour !== 12) {
    hour += 12;
  } else if (ampm.toLowerCase() === "am" && hour === 12) {
    hour = 0;
  }

  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    hour,
    parseInt(minute, 10)
  );
}

/**
 * Scrape City Council meetings from Municode
 */
export async function scrapeMeetings(): Promise<ScrapedMeeting[]> {
  const html = await fetchHtml(MUNICODE_BASE_URL);
  const $ = cheerio.load(html);

  const meetings: ScrapedMeeting[] = [];

  // Find all meeting rows in the table
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
      detailsPath: detailsLink || "",
    });
  });

  return meetings;
}

/**
 * Extract video URL from a Cablecast video page
 * Note: This may need adjustment based on actual page structure
 */
export async function extractVideoUrl(videoPageUrl: string): Promise<string | null> {
  try {
    const html = await fetchHtml(videoPageUrl);
    const $ = cheerio.load(html);

    // Look for video source in various places
    const videoSrc =
      $("video source").attr("src") ||
      $("video").attr("src") ||
      $('meta[property="og:video"]').attr("content") ||
      $('meta[property="og:video:url"]').attr("content");

    if (videoSrc) {
      // Make absolute URL if relative
      if (videoSrc.startsWith("/")) {
        return `${CABLECAST_BASE_URL}${videoSrc}`;
      }
      return videoSrc;
    }

    // Check for m3u8 playlist in script tags
    const scripts = $("script").text();
    const m3u8Match = scripts.match(/(https?:\/\/[^\s"']+\.m3u8)/);
    if (m3u8Match) {
      return m3u8Match[1];
    }

    return null;
  } catch (error) {
    console.error(`Failed to extract video URL from ${videoPageUrl}:`, error);
    return null;
  }
}

/**
 * Fetch and parse PDF agenda (returns raw text)
 * Note: For MVP, we'll use a PDF parsing service or library
 */
export async function fetchAgendaPdf(agendaUrl: string): Promise<Buffer> {
  const response = await fetch(agendaUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch agenda: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}
