import { Metadata } from "next";
import MeetingsList from "./MeetingsList";

export const metadata: Metadata = {
  title: "Meeting Summaries",
  description:
    "Browse AI-powered summaries of Fort Collins City Council meetings. Key decisions, action items, and topics - all in one place.",
  openGraph: {
    title: "Meeting Summaries | Cicero",
    description:
      "Browse AI-powered summaries of Fort Collins City Council meetings.",
  },
};

export default function MeetingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Meeting Summaries</h1>
          <p className="mt-2 text-muted-foreground">
            Browse AI-powered summaries of Fort Collins City Council meetings.
          </p>
        </div>

        <MeetingsList />
      </div>
    </div>
  );
}
