import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import MeetingDetail from "./MeetingDetail";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const meeting = await convex.query(api.meetings.getById, {
      id: id as Id<"meetings">,
    });

    if (!meeting) {
      return {
        title: "Meeting Not Found",
      };
    }

    const title = `${meeting.title} - ${formatDate(meeting.date)}`;
    const description = `AI-powered summary of Fort Collins City Council ${meeting.type.replace("_", " ")} on ${formatDate(meeting.date)}. Key decisions, topics, and how to get involved.`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Cicero`,
        description,
        type: "article",
        publishedTime: new Date(meeting.date).toISOString(),
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Cicero`,
        description,
      },
    };
  } catch {
    return {
      title: "Meeting Summary",
      description: "AI-powered summary of Fort Collins City Council meeting.",
    };
  }
}

export default async function MeetingPage({ params }: Props) {
  const { id } = await params;

  try {
    const meeting = await convex.query(api.meetings.getById, {
      id: id as Id<"meetings">,
    });

    if (!meeting) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <MeetingDetail meetingId={id} />
      </div>
    </div>
  );
}
