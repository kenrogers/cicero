"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SubscribeForm } from "@/app/(landing)/SubscribeForm";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
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

export default function MeetingDetail({ meetingId }: { meetingId: string }) {
  const meeting = useQuery(api.meetings.getById, {
    id: meetingId as Id<"meetings">,
  });
  const summary = useQuery(api.summaries.getByMeetingId, {
    meetingId: meetingId as Id<"meetings">,
  });

  if (meeting === undefined || summary === undefined) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-card rounded" />
        <div className="h-8 w-3/4 bg-card rounded" />
        <div className="h-48 w-full bg-card rounded" />
      </div>
    );
  }

  if (meeting === null) {
    return (
      <div className="text-center py-16">
        <h1 className="font-cinzel text-2xl mb-4">Meeting Not Found</h1>
        <p className="text-muted-foreground mb-8">
          This meeting doesn't exist or has been removed.
        </p>
        <Link
          href="/meetings"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Meetings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header with breadcrumb */}
      <div>
        <Link 
          href="/" 
          className="wordmark text-2xl hover:text-primary transition-colors"
        >
          CICERO
        </Link>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/meetings" className="hover:text-foreground transition-colors">
          Meetings
        </Link>
        <span>/</span>
        <span className="text-foreground">{formatDate(meeting.date)}</span>
      </nav>

      {/* Title section */}
      <div>
        <p className="text-primary text-sm font-medium mb-3">
          {formatDate(meeting.date)} • {formatMeetingType(meeting.type)}
        </p>
        <h1 className="font-cinzel text-3xl md:text-4xl">
          {meeting.title}
        </h1>

        {/* External links */}
        {(meeting.agendaUrl || meeting.videoUrl) && (
          <div className="flex flex-wrap gap-4 mt-6">
            {meeting.agendaUrl && (
              <a
                href={meeting.agendaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View Agenda
                <ExternalLink className="size-3" />
              </a>
            )}
            {meeting.videoUrl && (
              <a
                href={meeting.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Watch Video
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Orange divider */}
      <div className="w-16 h-px bg-primary" />

      {/* Summary content */}
      {summary ? (
        <div className="space-y-12">
          {/* TLDR / Summary */}
          {summary.tldr && (
            <section>
              <h2 className="text-primary text-sm font-medium uppercase tracking-wide mb-4">
                Summary
              </h2>
              <p className="text-lg leading-relaxed">
                {summary.tldr}
              </p>
            </section>
          )}

          {/* Key Topics */}
          {summary.keyTopics && summary.keyTopics.length > 0 && (
            <section>
              <h2 className="text-primary text-sm font-medium uppercase tracking-wide mb-6">
                Key Topics
              </h2>
              <div className="space-y-6">
                {summary.keyTopics.map((topic, index) => (
                  <div key={index} className="p-6 bg-card rounded-lg">
                    <h3 className="font-cinzel text-lg mb-2">{topic.title}</h3>
                    <p className="text-muted-foreground">
                      {topic.summary}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Decisions */}
          {summary.decisions && summary.decisions.length > 0 && (
            <section>
              <h2 className="text-primary text-sm font-medium uppercase tracking-wide mb-6">
                Key Decisions
              </h2>
              <div className="space-y-6">
                {summary.decisions.map((decision, index) => (
                  <div key={index} className="p-6 bg-card rounded-lg">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-cinzel text-lg">{decision.title}</h3>
                      {decision.vote && (
                        <span className="text-sm text-primary shrink-0">
                          {decision.vote}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {decision.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Action Items */}
          {summary.actionSteps && summary.actionSteps.length > 0 && (
            <section>
              <h2 className="text-primary text-sm font-medium uppercase tracking-wide mb-6">
                Action Items
              </h2>
              <div className="space-y-6">
                {summary.actionSteps.map((action, index) => (
                  <div key={index} className="p-6 bg-card rounded-lg">
                    <h3 className="font-cinzel text-lg mb-2">{action.action}</h3>
                    <p className="text-muted-foreground mb-2">
                      {action.details}
                    </p>
                    {action.contactInfo && (
                      <p className="text-sm text-primary">
                        Contact: {action.contactInfo}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Summary not yet available for this meeting.
          </p>
          {meeting.status === "processing" && (
            <p className="text-sm text-muted-foreground mt-2">
              Currently processing — check back soon.
            </p>
          )}
        </div>
      )}

      {/* Orange divider */}
      <div className="w-16 h-px bg-primary" />

      {/* Email signup CTA */}
      <section className="text-center">
        <h2 className="font-cinzel text-xl mb-3">
          Stay Informed
        </h2>
        <p className="text-muted-foreground mb-6">
          Get notified when new meeting summaries are published.
        </p>
        <SubscribeForm />
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        This summary was generated by AI and may contain errors. For official records, 
        please refer to the city's official meeting minutes.
      </p>
    </div>
  );
}
