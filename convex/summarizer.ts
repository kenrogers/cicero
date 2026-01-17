"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface SummaryOutput {
  tldr: string;
  keyTopics: Array<{
    title: string;
    summary: string;
    sentiment?: "positive" | "negative" | "neutral" | "controversial";
  }>;
  decisions: Array<{
    title: string;
    description: string;
    vote?: string;
  }>;
  actionSteps: Array<{
    action: string;
    details: string;
    contactInfo?: string;
    deadline?: string;
    contactEmail?: string;
    contactPhone?: string;
    submissionUrl?: string;
    relatedAgendaItem?: string;
    relatedOrdinance?: string;
    urgency?: "immediate" | "upcoming" | "ongoing";
  }>;
  speakerOpinions?: Array<{
    speakerName: string;
    topicTitle: string;
    stance: "support" | "oppose" | "undecided" | "mixed";
    summary: string;
    keyArguments: string[];
    quote?: string;
  }>;
  keyMoments?: Array<{
    timestamp: string;
    timestampSeconds: number;
    title: string;
    description: string;
    speakerName?: string;
    momentType: "vote" | "debate" | "public_comment" | "presentation" | "decision" | "key_discussion";
  }>;
}

const SYSTEM_PROMPT = `You are a civic engagement assistant that helps citizens understand what happened in their Fort Collins City Council meetings. Your job is to create comprehensive, actionable summaries that help busy residents stay informed and get involved.

## Fort Collins City Council Members (as of 2026)
- Mayor Emily Francis (At-large) - efrancis@fortcollins.gov
- Mayor Pro Tem Julie Pignataro (District 2) - jpignataro@fortcollins.gov
- Council Member Chris Conway (District 1) - cconway@fortcollins.gov
- Council Member Josh Fudge (District 3) - jfudge@fortcollins.gov
- Council Member Melanie Potyondy (District 4) - mpotyondy@fortcollins.gov
- Council Member Amy Hoeven (District 5) - ahoeven@fortcollins.gov

When analyzing meeting transcripts, focus on:
1. **Speaker attribution**: Who said what, especially council members' positions on key issues
2. **Key moments**: Important votes, debates, presentations, and public comments with timestamps
3. **Decisions and implications**: What was decided and how it affects residents
4. **Civic engagement opportunities**: Specific ways residents can get involved with deadlines and contacts
5. **Controversial topics**: Present multiple perspectives fairly

Always be factual, non-partisan, and include specific details like ordinance numbers, deadlines, and contact information when mentioned.`;

const USER_PROMPT = `Analyze this city council meeting transcript and provide a comprehensive structured summary.

Return your response as valid JSON with this exact structure:
{
  "tldr": "A 2-3 sentence summary of the most important takeaways from this meeting",
  "keyTopics": [
    {
      "title": "Topic name",
      "summary": "What was discussed and any outcomes",
      "sentiment": "positive" | "negative" | "neutral" | "controversial"
    }
  ],
  "decisions": [
    {
      "title": "Decision name",
      "description": "What was decided and what it means for residents",
      "vote": "Vote result (e.g., '6-1 in favor', 'Unanimous')"
    }
  ],
  "actionSteps": [
    {
      "action": "Specific action residents can take",
      "details": "Step-by-step how to take this action",
      "deadline": "Specific deadline if mentioned (e.g., 'January 31, 2026' or 'Before February 4 meeting')",
      "contactEmail": "Email address if mentioned",
      "contactPhone": "Phone number if mentioned",
      "submissionUrl": "URL for feedback form or portal if mentioned",
      "relatedAgendaItem": "Agenda item reference if mentioned (e.g., 'Item 12B')",
      "relatedOrdinance": "Ordinance number if mentioned (e.g., 'Ordinance 2026-001')",
      "urgency": "immediate" | "upcoming" | "ongoing"
    }
  ],
  "speakerOpinions": [
    {
      "speakerName": "Full name with title (e.g., 'Mayor Emily Francis' or 'Council Member Josh Fudge')",
      "topicTitle": "Which keyTopic this relates to",
      "stance": "support" | "oppose" | "undecided" | "mixed",
      "summary": "Brief summary of their position (1-2 sentences)",
      "keyArguments": ["Main points they made", "Another key argument"],
      "quote": "A memorable direct quote if available (optional)"
    }
  ],
  "keyMoments": [
    {
      "timestamp": "Estimated timestamp in H:MM:SS format (e.g., '1:23:45')",
      "timestampSeconds": 5025,
      "title": "Brief title (e.g., 'Vote on Housing Ordinance')",
      "description": "What's happening at this moment",
      "speakerName": "Who is speaking (optional)",
      "momentType": "vote" | "debate" | "public_comment" | "presentation" | "decision" | "key_discussion"
    }
  ]
}

## Guidelines:
- **keyTopics**: 3-5 most significant topics discussed
- **decisions**: All formal votes and decisions made
- **actionSteps**: 2-4 concrete ways residents can engage, with as much detail as available
- **speakerOpinions**: Capture council member positions on controversial or significant topics (aim for 3-6 opinions)
- **keyMoments**: 3-5 important moments worth watching (estimate timestamps based on meeting flow)

For timestamps, estimate based on the meeting's progression. City council meetings typically:
- Start with consent agenda (0:00-0:15)
- Move to public comment (0:15-0:45)
- Main agenda items (0:45-2:00+)
- Votes typically happen after discussion

If exact timestamps aren't clear, provide reasonable estimates based on when topics appear in the transcript.

TRANSCRIPT:
`;

async function callOpenRouter(
  transcript: string
): Promise<SummaryOutput | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable not set");
  }

  const truncatedTranscript =
    transcript.length > 100000 ? transcript.slice(0, 100000) + "..." : transcript;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://cicero.app",
      "X-Title": "Cicero - City Council Summarizer",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT + truncatedTranscript },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content in OpenRouter response");
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not find JSON in response");
  }

  const parsed = JSON.parse(jsonMatch[0]) as SummaryOutput;
  return sanitizeSummaryOutput(parsed);
}

/**
 * Remove null/undefined values from optional fields to satisfy Convex validators.
 * LLMs sometimes return null for optional fields instead of omitting them.
 */
function sanitizeSummaryOutput(output: SummaryOutput): SummaryOutput {
  const removeNulls = <T extends Record<string, unknown>>(obj: T): T => {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        result[key] = value;
      }
    }
    return result as T;
  };

  return {
    tldr: output.tldr,
    keyTopics: output.keyTopics.map(removeNulls),
    decisions: output.decisions.map(removeNulls),
    actionSteps: output.actionSteps.map(removeNulls),
    speakerOpinions: output.speakerOpinions?.map(removeNulls),
    keyMoments: output.keyMoments?.map(removeNulls),
  };
}

export const summarizeMeeting = action({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      tldr: v.string(),
    }),
    v.object({
      success: v.literal(false),
      reason: v.string(),
    })
  ),
  handler: async (
    ctx,
    args
  ): Promise<{ success: true; tldr: string } | { success: false; reason: string }> => {
    const summary: {
      _id: Id<"summaries">;
      transcriptStorageId?: Id<"_storage">;
    } | null = await ctx.runQuery(internal.summaries.getSummaryByMeetingId, {
      meetingId: args.meetingId,
    });

    if (!summary) {
      return { success: false, reason: "No summary record found for this meeting" };
    }

    if (!summary.transcriptStorageId) {
      return {
        success: false,
        reason: "No transcript available for this meeting",
      };
    }

    const transcriptBlob = await ctx.storage.get(summary.transcriptStorageId);
    if (!transcriptBlob) {
      return { success: false, reason: "Could not retrieve transcript from storage" };
    }

    const transcript = await transcriptBlob.text();

    if (!transcript || transcript.length < 100) {
      return { success: false, reason: "Transcript too short to summarize" };
    }

    try {
      const summaryOutput = await callOpenRouter(transcript);

      if (!summaryOutput) {
        return { success: false, reason: "Failed to generate summary" };
      }

      await ctx.runMutation(internal.summaries.updateSummary, {
        summaryId: summary._id,
        tldr: summaryOutput.tldr,
        keyTopics: summaryOutput.keyTopics,
        decisions: summaryOutput.decisions,
        actionSteps: summaryOutput.actionSteps,
        speakerOpinions: summaryOutput.speakerOpinions,
        keyMoments: summaryOutput.keyMoments,
      });

      await ctx.runMutation(internal.meetings.updateStatus, {
        id: args.meetingId,
        status: "complete",
        processedAt: Date.now(),
      });

      return { success: true, tldr: summaryOutput.tldr };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await ctx.runMutation(internal.meetings.updateStatus, {
        id: args.meetingId,
        status: "failed",
        errorMessage,
      });
      return { success: false, reason: errorMessage };
    }
  },
});

export const summarizeMeetingInternal = internalAction({
  args: {
    meetingId: v.id("meetings"),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      tldr: v.string(),
    }),
    v.object({
      success: v.literal(false),
      reason: v.string(),
    })
  ),
  handler: async (
    ctx,
    args
  ): Promise<{ success: true; tldr: string } | { success: false; reason: string }> => {
    const summary: {
      _id: Id<"summaries">;
      transcriptStorageId?: Id<"_storage">;
    } | null = await ctx.runQuery(internal.summaries.getSummaryByMeetingId, {
      meetingId: args.meetingId,
    });

    if (!summary) {
      return { success: false, reason: "No summary record found for this meeting" };
    }

    if (!summary.transcriptStorageId) {
      return {
        success: false,
        reason: "No transcript available for this meeting",
      };
    }

    const transcriptBlob = await ctx.storage.get(summary.transcriptStorageId);
    if (!transcriptBlob) {
      return { success: false, reason: "Could not retrieve transcript from storage" };
    }

    const transcript = await transcriptBlob.text();

    if (!transcript || transcript.length < 100) {
      return { success: false, reason: "Transcript too short to summarize" };
    }

    try {
      const summaryOutput = await callOpenRouter(transcript);

      if (!summaryOutput) {
        return { success: false, reason: "Failed to generate summary" };
      }

      await ctx.runMutation(internal.summaries.updateSummary, {
        summaryId: summary._id,
        tldr: summaryOutput.tldr,
        keyTopics: summaryOutput.keyTopics,
        decisions: summaryOutput.decisions,
        actionSteps: summaryOutput.actionSteps,
        speakerOpinions: summaryOutput.speakerOpinions,
        keyMoments: summaryOutput.keyMoments,
      });

      await ctx.runMutation(internal.meetings.updateStatus, {
        id: args.meetingId,
        status: "complete",
        processedAt: Date.now(),
      });

      return { success: true, tldr: summaryOutput.tldr };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await ctx.runMutation(internal.meetings.updateStatus, {
        id: args.meetingId,
        status: "failed",
        errorMessage,
      });
      return { success: false, reason: errorMessage };
    }
  },
});

export const summarizePendingMeetings = action({
  args: {},
  returns: v.object({
    processed: v.number(),
    successful: v.number(),
    failed: v.number(),
    results: v.array(
      v.object({
        meetingId: v.id("meetings"),
        title: v.string(),
        success: v.boolean(),
        reason: v.optional(v.string()),
      })
    ),
  }),
  handler: async (ctx) => {
    const meetings: Array<{
      _id: Id<"meetings">;
      title: string;
    }> = await ctx.runQuery(internal.summaries.getMeetingsReadyForSummarization);

    const results: Array<{
      meetingId: Id<"meetings">;
      title: string;
      success: boolean;
      reason?: string;
    }> = [];

    for (const meeting of meetings) {
      const result = await ctx.runAction(
        internal.summarizer.summarizeMeetingInternal,
        { meetingId: meeting._id }
      );

      results.push({
        meetingId: meeting._id,
        title: meeting.title,
        success: result.success,
        reason: result.success ? undefined : result.reason,
      });
    }

    return {
      processed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  },
});
