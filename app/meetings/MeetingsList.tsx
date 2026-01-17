"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMeetingType(type: string): string {
  switch (type) {
    case "regular":
      return "Regular Meeting";
    case "work_session":
      return "Work Session";
    case "special":
      return "Special Meeting";
    default:
      return type;
  }
}

export default function MeetingsList() {
  const meetings = useQuery(api.meetings.list, {});

  if (meetings === undefined) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 w-24 bg-card rounded mb-2" />
            <div className="h-6 w-3/4 bg-card rounded mb-2" />
            <div className="h-4 w-1/2 bg-card rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No meetings found yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Check back soon — we're processing City Council meetings.
        </p>
      </div>
    );
  }

  const completedMeetings = meetings.filter((m) => m.status === "complete");
  const processingMeetings = meetings.filter((m) => m.status !== "complete");

  return (
    <div className="space-y-12">
      {completedMeetings.length > 0 && (
        <div className="space-y-6">
          {completedMeetings.map((meeting) => (
            <Link
              key={meeting._id}
              href={`/meetings/${meeting._id}`}
              className="group block p-6 bg-card rounded-lg hover:bg-card/80 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Date in orange */}
                  <p className="text-primary text-sm font-medium mb-2">
                    {formatDate(meeting.date)}
                  </p>
                  
                  {/* Title */}
                  <h3 className="font-cinzel text-xl mb-2 group-hover:text-primary transition-colors">
                    {meeting.title}
                  </h3>
                  
                  {/* Meeting type as subtle text */}
                  <p className="text-sm text-muted-foreground">
                    {formatMeetingType(meeting.type)}
                  </p>
                </div>
                
                {/* Arrow */}
                <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {processingMeetings.length > 0 && (
        <div>
          <h2 className="text-sm text-muted-foreground uppercase tracking-wide mb-6">
            Processing
          </h2>
          <div className="space-y-4">
            {processingMeetings.map((meeting) => (
              <div
                key={meeting._id}
                className="p-6 bg-card/50 rounded-lg opacity-60"
              >
                <p className="text-muted-foreground text-sm mb-2">
                  {formatDate(meeting.date)}
                </p>
                <h3 className="font-cinzel text-lg text-muted-foreground">
                  {meeting.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatMeetingType(meeting.type)} • Processing...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
