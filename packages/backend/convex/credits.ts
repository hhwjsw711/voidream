import { getAuthUserId } from "@convex-dev/auth/server";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { query } from "./_generated/server";

export async function consumeCreditsHelper(
  ctx: MutationCtx,
  userId: Id<"users">,
  amountToUse: number,
) {
  const credits = await ctx.db
    .query("credits")
    .withIndex("userId_index", (q) => q.eq("userId", userId))
    .first();

  if (!credits) {
    throw new ConvexError("No credits found");
  }

  if (credits.remaining < amountToUse) {
    throw new ConvexError("Insufficient credits");
  }

  await ctx.db.patch(credits._id, {
    remaining: credits.remaining - amountToUse,
  });
}

export const getCredits = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // 查询积分
    return await ctx.db
      .query("credits")
      .withIndex("userId_index", (q) => q.eq("userId", userId))
      .first();
  },
});
