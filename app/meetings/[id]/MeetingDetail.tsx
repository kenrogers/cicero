"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { ExternalLink, Clock, User, Calendar, Mail, Phone, Link as LinkIcon, AlertCircle, ArrowLeft } from "lucide-react";
import { SubscribeForm } from "@/app/(landing)/SubscribeForm";
import { generateTimestampUrl, formatTimestamp } from "@/lib/video-timestamps";

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

function getStanceColor(stance: string): string {
  switch (stance) {
    case "support":
      return "text-green-500";
    case "oppose":
      return "text-red-500";
    case "undecided":
      return "text-yellow-500";
    case "mixed":
      return "text-blue-500";
    default:
      return "text-muted-foreground";
  }
}

function getStanceLabel(stance: string): string {
  switch (stance) {
    case "support":
      return "Supports";
    case "oppose":
      return "Opposes";
    case "undecided":
      return "Undecided";
    case "mixed":
      return "Mixed";
    default:
      return stance;
  }
}

function getMomentTypeLabel(type: string): string {
  switch (type) {
    case "vote":
      return "Vote";
    case "debate":
      return "Debate";
    case "public_comment":
      return "Public Comment";
    case "presentation":
      return "Presentation";
    case "decision":
      return "Decision";
    case "key_discussion":
      return "Discussion";
    default:
      return type;
  }
}

function getUrgencyStyles(urgency?: string): { bg: string; text: string; label: string } {
  switch (urgency) {
    case "immediate":
      return { bg: "bg-red-500/10", text: "text-red-500", label: "Urgent" };
    case "upcoming":
      return { bg: "bg-yellow-500/10", text: "text-yellow-500", label: "Upcoming" };
    case "ongoing":
      return { bg: "bg-blue-500/10", text: "text-blue-500", label: "Ongoing" };
    default:
      return { bg: "", text: "", label: "" };
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

          {/* Key Moments with Video Timestamps */}
          {summary.keyMoments && summary.keyMoments.length > 0 && (
            <section>
              <h2 className="text-primary text-sm font-medium uppercase tracking-wide mb-6">
                Key Moments
              </h2>
              <div className="space-y-4">
                {summary.keyMoments.map((moment, index) => {
                  const timestampUrl = meeting.videoUrl 
                    ? generateTimestampUrl(meeting.videoUrl, moment.timestampSeconds)
                    : null;
                  
                  return (
                    <div key={index} className="p-4 bg-card rounded-lg flex gap-4">
                      {/* Timestamp */}
                      <div className="shrink-0">
                        {timestampUrl ? (
                          <a
                            href={timestampUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded font-mono text-sm hover:bg-primary/20 transition-colors"
                          >
                            <Clock className="size-3.5" />
                            {formatTimestamp(moment.timestampSeconds)}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded font-mono text-sm">
                            <Clock className="size-3.5" />
                            {formatTimestamp(moment.timestampSeconds)}
                          </span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-cinzel text-base">{moment.title}</h3>
                          <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                            {getMomentTypeLabel(moment.momentType)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {moment.description}
                        </p>
                        {moment.speakerName && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <User className="size-3" />
                            {moment.speakerName}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Speaker Opinions */}
          {summary.speakerOpinions && summary.speakerOpinions.length > 0 && (
            <section>
              <h2 className="text-primary text-sm font-medium uppercase tracking-wide mb-6">
                Council Member Positions
              </h2>
              <div className="space-y-6">
                {/* Group opinions by topic */}
                {Array.from(
                  summary.speakerOpinions.reduce((acc, opinion) => {
                    if (!acc.has(opinion.topicTitle)) {
                      acc.set(opinion.topicTitle, []);
                    }
                    acc.get(opinion.topicTitle)!.push(opinion);
                    return acc;
                  }, new Map<string, typeof summary.speakerOpinions>())
                ).map(([topicTitle, opinions]) => (
                  <div key={topicTitle} className="p-6 bg-card rounded-lg">
                    <h3 className="font-cinzel text-lg mb-4">{topicTitle}</h3>
                    <div className="space-y-4">
                      {opinions.map((opinion, index) => (
                        <div key={index} className="border-l-2 border-muted pl-4">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="size-4 text-muted-foreground" />
                            <span className="font-medium">{opinion.speakerName}</span>
                            <span className={`text-sm font-medium ${getStanceColor(opinion.stance)}`}>
                              {getStanceLabel(opinion.stance)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {opinion.summary}
                          </p>
                          {opinion.keyArguments && opinion.keyArguments.length > 0 && (
                            <ul className="text-sm text-muted-foreground list-disc list-inside mb-2">
                              {opinion.keyArguments.map((arg, argIndex) => (
                                <li key={argIndex}>{arg}</li>
                              ))}
                            </ul>
                          )}
                          {opinion.quote && (
                            <blockquote className="text-sm italic border-l-2 border-primary/50 pl-3 text-muted-foreground">
                              "{opinion.quote}"
                            </blockquote>
                          )}
                        </div>
                      ))}
                    </div>
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
                {summary.actionSteps.map((action, index) => {
                  const urgencyStyles = getUrgencyStyles(action.urgency);
                  
                  return (
                    <div key={index} className="p-6 bg-card rounded-lg">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-cinzel text-lg">{action.action}</h3>
                        {action.urgency && (
                          <span className={`text-xs px-2 py-1 rounded font-medium shrink-0 ${urgencyStyles.bg} ${urgencyStyles.text}`}>
                            {urgencyStyles.label}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        {action.details}
                      </p>
                      
                      {/* Metadata row */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {action.deadline && (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-3.5" />
                            {action.deadline}
                          </span>
                        )}
                        
                        {action.relatedAgendaItem && (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <AlertCircle className="size-3.5" />
                            {action.relatedAgendaItem}
                          </span>
                        )}
                      </div>
                      
                      {/* Contact info */}
                      {(action.contactInfo || action.contactEmail || action.contactPhone || action.submissionUrl) && (
                        <div className="mt-4 pt-4 border-t border-muted">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Contact</p>
                          <div className="flex flex-wrap gap-3">
                            {action.contactInfo && !action.contactEmail && !action.contactPhone && (
                              <span className="text-sm text-primary">{action.contactInfo}</span>
                            )}
                            
                            {action.contactEmail && (
                              <a 
                                href={`mailto:${action.contactEmail}`}
                                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                              >
                                <Mail className="size-3.5" />
                                {action.contactEmail}
                              </a>
                            )}
                            
                            {action.contactPhone && (
                              <a 
                                href={`tel:${action.contactPhone}`}
                                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                              >
                                <Phone className="size-3.5" />
                                {action.contactPhone}
                              </a>
                            )}
                            
                            {action.submissionUrl && (
                              <a 
                                href={action.submissionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                              >
                                <LinkIcon className="size-3.5" />
                                Submit Online
                                <ExternalLink className="size-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
