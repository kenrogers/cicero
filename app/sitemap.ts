import { MetadataRoute } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cicero.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/meetings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const meetings = await convex.query(api.meetings.list, {});

    const meetingPages: MetadataRoute.Sitemap = meetings
      .filter((m) => m.status === "complete")
      .map((meeting) => ({
        url: `${baseUrl}/meetings/${meeting._id}`,
        lastModified: meeting.processedAt
          ? new Date(meeting.processedAt)
          : new Date(meeting._creationTime),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    return [...staticPages, ...meetingPages];
  } catch {
    return staticPages;
  }
}
