import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all active council members
 */
export const listActive = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("councilMembers"),
      _creationTime: v.number(),
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
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("councilMembers")
      .withIndex("byActive", (q) => q.eq("isActive", true))
      .collect();
  },
});

/**
 * Get council member by name (for speaker matching)
 */
export const getByName = query({
  args: { name: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("councilMembers"),
      _creationTime: v.number(),
      name: v.string(),
      role: v.union(
        v.literal("mayor"),
        v.literal("mayor_pro_tem"),
        v.literal("council_member")
      ),
      district: v.optional(v.number()),
      email: v.string(),
      isActive: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("councilMembers")
      .withIndex("byName", (q) => q.eq("name", args.name))
      .first();
  },
});

/**
 * Seed council members - Fort Collins City Council as of January 2026
 */
export const seed = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("councilMembers").first();
    if (existing) {
      console.log("Council members already seeded, skipping");
      return null;
    }

    const members: Array<{
      name: string;
      role: "mayor" | "mayor_pro_tem" | "council_member";
      district?: number;
      email: string;
      isActive: boolean;
    }> = [
      {
        name: "Emily Francis",
        role: "mayor",
        email: "efrancis@fortcollins.gov",
        isActive: true,
      },
      {
        name: "Julie Pignataro",
        role: "mayor_pro_tem",
        district: 2,
        email: "jpignataro@fortcollins.gov",
        isActive: true,
      },
      {
        name: "Chris Conway",
        role: "council_member",
        district: 1,
        email: "cconway@fortcollins.gov",
        isActive: true,
      },
      {
        name: "Josh Fudge",
        role: "council_member",
        district: 3,
        email: "jfudge@fortcollins.gov",
        isActive: true,
      },
      {
        name: "Melanie Potyondy",
        role: "council_member",
        district: 4,
        email: "mpotyondy@fortcollins.gov",
        isActive: true,
      },
      {
        name: "Amy Hoeven",
        role: "council_member",
        district: 5,
        email: "ahoeven@fortcollins.gov",
        isActive: true,
      },
    ];

    for (const member of members) {
      await ctx.db.insert("councilMembers", member);
    }

    console.log(`Seeded ${members.length} council members`);
    return null;
  },
});
