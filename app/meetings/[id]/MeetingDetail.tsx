"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Video,
  CheckCircle,
  Vote,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

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

function getSentimentBadge(sentiment?: string) {
  switch (sentiment) {
    case "positive":
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Positive</Badge>;
    case "negative":
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Negative</Badge>;
    case "controversial":
      return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Controversial</Badge>;
    case "neutral":
    default:
      return null;
  }
}

export default function MeetingDetail({ meetingId }: { meetingId: string }) {
  const meeting = useQuery(api.meetings.getById, {
    id: meetingId as Id<"meetings">,
  });
  const summary = useQuery(api.summaries.getByMeetingId, {
    meetingId: meetingId as Id<"meetings">,
  });

  if (meeting === undefined || summary === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (meeting === null) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Meeting Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This meeting doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/meetings">
            <ArrowLeft className="size-4 mr-2" />
            Back to Meetings
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/meetings"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4 mr-1" />
        Back to Meetings
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          {getMeetingTypeBadge(meeting.type)}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" />
            {formatDate(meeting.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4" />
            {formatTime(meeting.date)}
          </span>
        </div>

        {/* External links */}
        <div className="flex flex-wrap gap-3 mt-4">
          {meeting.agendaUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={meeting.agendaUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="size-4 mr-2" />
                View Agenda
                <ExternalLink className="size-3 ml-1" />
              </a>
            </Button>
          )}
          {meeting.videoUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={meeting.videoUrl} target="_blank" rel="noopener noreferrer">
                <Video className="size-4 mr-2" />
                Watch Video
                <ExternalLink className="size-3 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Summary content */}
      {summary ? (
        <div className="space-y-6">
          {/* TLDR */}
          {summary.tldr && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-2">Summary</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {summary.tldr}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Key Topics */}
          {summary.keyTopics && summary.keyTopics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="size-5 text-primary" />
                  Key Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary.keyTopics.map((topic, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium">{topic.title}</h3>
                      {getSentimentBadge(topic.sentiment)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {topic.summary}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Decisions */}
          {summary.decisions && summary.decisions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="size-5 text-primary" />
                  Decisions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary.decisions.map((decision, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium">{decision.title}</h3>
                      {decision.vote && (
                        <Badge variant="outline" className="shrink-0">
                          {decision.vote}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {decision.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Items */}
          {summary.actionSteps && summary.actionSteps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-primary" />
                  How to Get Involved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary.actionSteps.map((action, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium mb-1">{action.action}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {action.details}
                    </p>
                    {action.contactInfo && (
                      <p className="text-sm text-primary">
                        Contact: {action.contactInfo}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Summary not yet available for this meeting.
            </p>
            {meeting.status === "processing" && (
              <p className="text-sm text-muted-foreground mt-2">
                Currently processing - check back soon.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        This summary was generated by AI and may contain errors. For official records, 
        please refer to the city&apos;s official meeting minutes.
      </p>
    </div>
  );
}
