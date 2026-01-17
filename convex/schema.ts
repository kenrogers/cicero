import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { paymentAttemptSchemaValidator } from "./paymentAttemptTypes";

export default defineSchema({
    // ============================================
    // CICERO: City Council Meeting Summaries
    // ============================================

    councilMembers: defineTable({
      name: v.string(),
      role: v.union(
        v.literal("mayor"),
        v.literal("mayor_pro_tem"),
        v.literal("council_member")
      ),
      district: v.optional(v.number()),
      email: v.string(),
      isActive: v.boolean(),
    })
      .index("byName", ["name"])
      .index("byActive", ["isActive"]),

    meetings: defineTable({
      // Municode meeting ID (e.g., "6b92f33287e5498795a9f5193c7374d9")
      municodeId: v.string(),
      date: v.number(), // Unix timestamp
      title: v.string(),
      type: v.union(v.literal("regular"), v.literal("work_session"), v.literal("special")),
      agendaUrl: v.optional(v.string()),
      agendaPacketUrl: v.optional(v.string()),
      videoPageUrl: v.optional(v.string()),
      videoUrl: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("complete"),
        v.literal("failed")
      ),
      errorMessage: v.optional(v.string()),
      processedAt: v.optional(v.number()),
    })
      .index("byMunicodeId", ["municodeId"])
      .index("byStatus", ["status"])
      .index("byDate", ["date"]),

    summaries: defineTable({
      meetingId: v.id("meetings"),
      tldr: v.string(),
      keyTopics: v.array(
        v.object({
          title: v.string(),
          summary: v.string(),
          sentiment: v.optional(v.union(
            v.literal("positive"),
            v.literal("negative"),
            v.literal("neutral"),
            v.literal("controversial")
          )),
        })
      ),
      decisions: v.array(
        v.object({
          title: v.string(),
          description: v.string(),
          vote: v.optional(v.string()),
        })
      ),
      actionSteps: v.array(
        v.object({
          action: v.string(),
          details: v.string(),
          contactInfo: v.optional(v.string()),
          deadline: v.optional(v.string()),
          contactEmail: v.optional(v.string()),
          contactPhone: v.optional(v.string()),
          submissionUrl: v.optional(v.string()),
          relatedAgendaItem: v.optional(v.string()),
          relatedOrdinance: v.optional(v.string()),
          urgency: v.optional(v.union(
            v.literal("immediate"),
            v.literal("upcoming"),
            v.literal("ongoing")
          )),
        })
      ),
      transcriptStorageId: v.optional(v.id("_storage")),
      // Enhanced fields for refined summaries
      speakerOpinions: v.optional(v.array(
        v.object({
          speakerName: v.string(),
          speakerId: v.optional(v.id("councilMembers")),
          topicTitle: v.string(),
          stance: v.union(
            v.literal("support"),
            v.literal("oppose"),
            v.literal("undecided"),
            v.literal("mixed")
          ),
          summary: v.string(),
          keyArguments: v.array(v.string()),
          quote: v.optional(v.string()),
        })
      )),
      keyMoments: v.optional(v.array(
        v.object({
          timestamp: v.string(),
          timestampSeconds: v.number(),
          title: v.string(),
          description: v.string(),
          speakerName: v.optional(v.string()),
          momentType: v.union(
            v.literal("vote"),
            v.literal("debate"),
            v.literal("public_comment"),
            v.literal("presentation"),
            v.literal("decision"),
            v.literal("key_discussion")
          ),
        })
      )),
    })
      .index("byMeetingId", ["meetingId"]),

    subscribers: defineTable({
      email: v.string(),
      status: v.union(v.literal("active"), v.literal("unsubscribed")),
      lastEmailedAt: v.optional(v.number()),
    })
      .index("byEmail", ["email"])
      .index("byStatus", ["status"]),

    // Rate limiting for public endpoints
    rateLimits: defineTable({
      key: v.string(), // e.g., "subscribe:email@example.com" or "subscribe:ip:1.2.3.4"
      count: v.number(),
      windowStart: v.number(), // Unix timestamp
    })
      .index("byKey", ["key"]),

    // ============================================
    // STARTER KIT: Users & Security
    // ============================================

    users: defineTable({
      name: v.string(),
      // this the Clerk ID, stored in the subject JWT field
      externalId: v.string(),
      // Primary email from Clerk
      email: v.optional(v.string()),
    })
      .index("byExternalId", ["externalId"])
      .index("byEmail", ["email"]),

    paymentAttempts: defineTable(paymentAttemptSchemaValidator)
      .index("byPaymentId", ["payment_id"])
      .index("byUserId", ["userId"])
      .index("byPayerUserId", ["payer.user_id"]),

    // Security monitoring table
    // userId is optional to allow logging violations from unauthenticated requests
    securityEvents: defineTable({
      userId: v.optional(v.id("users")),
      eventType: v.union(
        v.literal("origin_mismatch"),
        v.literal("rate_limit_exceeded"),
        v.literal("invalid_api_key"),
        v.literal("fingerprint_change"),
        v.literal("suspicious_activity"),
        v.literal("jwt_validation_failed"),
        v.literal("unauthorized_access"),
        v.literal("input_validation_failed"),
        v.literal("replay_detected"),
        v.literal("not_found_enumeration"),
        v.literal("jwt_algorithm_attack"),
        v.literal("tenant_isolation_attack"),
        v.literal("jwt_replay_attack"),
        v.literal("xss_attempt"),
        v.literal("fingerprint_manipulation"),
        v.literal("http_origin_blocked"),
        v.literal("prompt_injection_attempt"),
        v.literal("ai_response_validation_failed"),
        v.literal("csrf_validation_failed")
      ),
      severity: v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      ),
      metadata: v.object({
        origin: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
        fingerprint: v.optional(v.string()),
        endpoint: v.optional(v.string()),
        errorMessage: v.optional(v.string()),
        endUserEmail: v.optional(v.string()),
        endUserName: v.optional(v.string()),
        endUserId: v.optional(v.string()),
        actionType: v.optional(v.string()),
        requestPayload: v.optional(v.string()),
      }),
      timestamp: v.number(),
      isRead: v.boolean(),
    })
      .index("byUser", ["userId", "timestamp"])
      .index("bySeverity", ["userId", "severity", "timestamp"])
      .index("byUnread", ["userId", "isRead", "timestamp"]),
  });