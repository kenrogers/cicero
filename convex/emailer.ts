"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Resend } from "resend";
import { Id } from "./_generated/dataModel";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Cicero <notifications@resend.dev>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cicero.foco.dev";

/**
 * Send a summary notification email to one subscriber.
 */
export const sendSummaryNotification = internalAction({
  args: {
    subscriberId: v.id("subscribers"),
    email: v.string(),
    meetingTitle: v.string(),
    meetingDate: v.string(),
    tldr: v.string(),
    meetingUrl: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const unsubscribeUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(args.email)}`;

    try {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: args.email,
        subject: `New City Council Summary: ${args.meetingTitle}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h1 style="font-size: 24px; margin-bottom: 8px;">New Meeting Summary</h1>
  <p style="color: #666; margin-top: 0;">${args.meetingTitle} • ${args.meetingDate}</p>
  
  <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 24px 0;">
    <h2 style="font-size: 16px; margin: 0 0 8px 0; color: #333;">TL;DR</h2>
    <p style="margin: 0; line-height: 1.6;">${args.tldr}</p>
  </div>
  
  <a href="${args.meetingUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
    Read Full Summary
  </a>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
  
  <p style="font-size: 12px; color: #999;">
    You're receiving this because you subscribed to Cicero updates.<br>
    <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a>
  </p>
</body>
</html>
        `,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      await ctx.runMutation(internal.subscribers.updateLastEmailed, {
        subscriberId: args.subscriberId,
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

/**
 * Notify all active subscribers about a new meeting summary.
 */
export const notifyAllSubscribers = internalAction({
  args: {
    meetingId: v.id("meetings"),
    meetingTitle: v.string(),
    meetingDate: v.string(),
    tldr: v.string(),
  },
  returns: v.object({
    sent: v.number(),
    failed: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const subscribers: Array<{
      _id: Id<"subscribers">;
      email: string;
    }> = await ctx.runQuery(internal.subscribers.getActiveSubscribers);

    const meetingUrl = `${BASE_URL}/meetings/${args.meetingId}`;

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
      const result = await ctx.runAction(internal.emailer.sendSummaryNotification, {
        subscriberId: subscriber._id,
        email: subscriber.email,
        meetingTitle: args.meetingTitle,
        meetingDate: args.meetingDate,
        tldr: args.tldr,
        meetingUrl,
      });

      if (result.success) {
        sent++;
      } else {
        failed++;
        if (result.error) {
          errors.push(`${subscriber.email}: ${result.error}`);
        }
      }
    }

    return { sent, failed, errors };
  },
});
