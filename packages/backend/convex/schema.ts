import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { type Infer, v } from "convex/values";

export const CURRENCIES = {
  USD: "usd",
  EUR: "eur",
} as const;
export const currencyValidator = v.union(
  v.literal(CURRENCIES.USD),
  v.literal(CURRENCIES.EUR),
);
export type Currency = Infer<typeof currencyValidator>;

export const INTERVALS = {
  MONTH: "month",
  YEAR: "year",
} as const;
export const intervalValidator = v.union(
  v.literal(INTERVALS.MONTH),
  v.literal(INTERVALS.YEAR),
);
export type Interval = Infer<typeof intervalValidator>;

export const PLANS = {
  FREE: "free",
  PRO: "pro",
} as const;
export const planKeyValidator = v.union(
  v.literal(PLANS.FREE),
  v.literal(PLANS.PRO),
);
export type PlanKey = Infer<typeof planKeyValidator>;

const priceValidator = v.object({
  polarId: v.string(),
  amount: v.number(),
});
const pricesValidator = v.object({
  [CURRENCIES.USD]: priceValidator,
});

export default defineSchema({
  ...authTables,
  users: defineTable({
    // Convex Auth fields
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    // custom fields
    username: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    polarId: v.optional(v.string()),
    polarSubscriptionPendingId: v.optional(v.id("_scheduled_functions")),
  })
    .index("email", ["email"])
    .index("polarId", ["polarId"]),
  plans: defineTable({
    key: planKeyValidator,
    polarProductId: v.string(),
    name: v.string(),
    description: v.string(),
    prices: v.object({
      [INTERVALS.MONTH]: v.optional(pricesValidator),
      [INTERVALS.YEAR]: v.optional(pricesValidator),
    }),
  })
    .index("key", ["key"])
    .index("polarProductId", ["polarProductId"]),
  subscriptions: defineTable({
    userId: v.id("users"),
    planId: v.id("plans"),
    polarId: v.string(),
    polarPriceId: v.string(),
    currency: currencyValidator,
    interval: intervalValidator,
    status: v.string(),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  })
    .index("userId", ["userId"])
    .index("polarId", ["polarId"]),
  credits: defineTable({
    userId: v.id("users"),
    remaining: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("userId_index", ["userId"]),
  story: defineTable({
    title: v.string(),
    userId: v.id("users"),
    script: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error"), // 添加 "error" 状态
    ),
    isVertical: v.optional(v.boolean()),
    context: v.optional(v.string()),
    reviewedAt: v.optional(v.string()),
    grammarCheckedAt: v.optional(v.string()),
    createdAt: v.string(),
    // 保留这些字段，因为它们是生成选项而不是结果
    voiceId: v.optional(v.string()),
    includeWatermark: v.optional(v.boolean()),
    isPublic: v.optional(v.boolean()),
    isLaxSpacing: v.optional(v.boolean()),
    includeCaptions: v.optional(v.boolean()),
    captionPosition: v.optional(v.string()),
    highlightColor: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  segments: defineTable({
    storyId: v.id("story"),
    text: v.string(),
    order: v.number(),
    isGenerating: v.boolean(),
    image: v.optional(v.id("_storage")),
    previewImage: v.optional(v.id("_storage")),
    prompt: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
});
