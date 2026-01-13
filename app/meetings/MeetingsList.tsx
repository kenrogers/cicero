"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Calendar, Clock, FileText, Video } from "lucide-react";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getMeetingTypeBadge(type: string) {
  switch (type) {
    case "regular":
      return <Badge variant="default">Regular Meeting</Badge>;
    case "work_session":
      return <Badge variant="secondary">Work Session</Badge>;
    case "special":
      return <Badge variant="outline">Special Meeting</Badge>;
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "complete":
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Summary Ready</Badge>;
    case "processing":
      return <Badge variant="secondary">Processing...</Badge>;
    case "pending":
      return <Badge variant="outline">Coming Soon</Badge>;
    case "failed":
      return <Badge variant="destructive">Error</Badge>;
    default:
      return null;
  }
}

export default function MeetingsList() {
  const meetings = useQuery(api.meetings.list, {});

  if (meetings === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No meetings found yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back soon - we&apos;re processing City Council meetings.
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedMeetings = meetings.filter((m) => m.status === "complete");
  const upcomingMeetings = meetings.filter((m) => m.status !== "complete");

  return (
    <div className="space-y-8">
      {completedMeetings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Summaries</h2>
          <div className="space-y-4">
            {completedMeetings.map((meeting) => (
              <Link key={meeting._id} href={`/meetings/${meeting._id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getMeetingTypeBadge(meeting.type)}
                          {getStatusBadge(meeting.status)}
                        </div>
                        <h3 className="font-medium text-lg truncate">
                          {meeting.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {formatDate(meeting.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-4" />
                            {formatTime(meeting.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm">
                      {meeting.agendaUrl && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="size-4" />
                          Agenda
                        </span>
                      )}
                      {meeting.videoUrl && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Video className="size-4" />
                          Video
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {upcomingMeetings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Processing</h2>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <Card key={meeting._id} className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getMeetingTypeBadge(meeting.type)}
                        {getStatusBadge(meeting.status)}
                      </div>
                      <h3 className="font-medium text-lg truncate">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          {formatDate(meeting.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {formatTime(meeting.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
