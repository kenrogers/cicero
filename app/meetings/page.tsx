import { Metadata } from "next";
import Link from "next/link";
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="wordmark text-2xl hover:text-primary transition-colors"
          >
            CICERO
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-cinzel text-3xl md:text-4xl mb-4">
          Meeting Summaries
        </h1>
        <p className="text-muted-foreground mb-12">
          AI-powered summaries of Fort Collins City Council meetings.
        </p>

        {/* Orange divider */}
        <div className="w-16 h-px bg-primary mb-12" />

        <MeetingsList />
      </div>
    </div>
  );
}
