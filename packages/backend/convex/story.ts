import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

// 定义故事状态类型
const StoryStatus = v.union(
  v.literal("draft"),
  v.literal("processing"),
  v.literal("completed"),
  v.literal("error"),
);

// 正确的类型定义
type StoryStatus = "draft" | "processing" | "completed" | "error";

// 更新故事状态的通用函数
export const updateStoryStatus = mutation({
  args: {
    storyId: v.id("story"),
    status: StoryStatus,
  },
  handler: async (ctx, args) => {
    const { storyId, status } = args;
    await ctx.db.patch(storyId, { status });
  },
});

// 获取故事信息的查询
export const getStory = query({
  args: { storyId: v.id("story") },
  handler: async (ctx, args): Promise<Doc<"story"> | null> => {
    return await ctx.db.get(args.storyId);
  },
});

export const updateStoryContent = internalMutation({
  args: {
    storyId: v.id("story"),
    context: v.string(),
  },
  handler: async (ctx, args) => {
    const { storyId, context } = args;
    await ctx.db.patch(storyId, { context });
    return { success: true };
  },
});

export const getStoryInternal = internalQuery({
  args: { storyId: v.id("story") },
  handler: async (ctx, args): Promise<Doc<"story"> | null> => {
    const { storyId } = args;

    const story = await ctx.db.get(storyId);

    if (!story) {
      console.warn(`Story with id ${storyId} not found`);
      return null;
    }

    return story;
  },
});

export const getAllStories = query({
  handler: async (ctx) => {
    const stories = await ctx.db.query("story").collect();
    return stories;
  },
});

export const updateStory = mutation({
  args: {
    storyId: v.id("story"),
    title: v.optional(v.string()),
    isVertical: v.optional(v.boolean()),
    voiceId: v.optional(v.string()),
    includeWatermark: v.optional(v.boolean()),
    isPublic: v.optional(v.boolean()),
    isLaxSpacing: v.optional(v.boolean()),
    includeCaptions: v.optional(v.boolean()),
    captionPosition: v.optional(v.string()),
    highlightColor: v.optional(v.string()),
    status: v.optional(StoryStatus), // 添加状态更新选项
  },
  handler: async (ctx, args) => {
    const { storyId, status, ...updates } = args;
    await ctx.db.patch(storyId, updates);
    if (status) {
      await ctx.runMutation(api.story.updateStoryStatus, { storyId, status });
    }
  },
});

export const reviewStory = mutation({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story) throw new Error("Story not found");

    // 这里添加您的审查逻辑

    await ctx.db.patch(args.storyId, { reviewedAt: new Date().toISOString() });
    await ctx.runMutation(api.story.updateStoryStatus, {
      storyId: args.storyId,
      status: "completed",
    });

    return { success: true };
  },
});

export const fixGrammar = mutation({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story) throw new Error("Story not found");

    // 这里添加您的语法修复逻辑

    await ctx.db.patch(args.storyId, {
      grammarCheckedAt: new Date().toISOString(),
    });
    await ctx.runMutation(api.story.updateStoryStatus, {
      storyId: args.storyId,
      status: "completed",
    });

    return { success: true };
  },
});

export const cloneStory = mutation({
  args: { storyId: v.id("story"), newOrientation: v.boolean() },
  handler: async (ctx, args) => {
    const originalStory = await ctx.db.get(args.storyId);
    if (!originalStory) throw new Error("Original story not found");

    const newStoryId = await ctx.db.insert("story", {
      ...originalStory,
      title: `${originalStory.title} (Clone)`,
      isVertical: args.newOrientation,
      createdAt: new Date().toISOString(),
      reviewedAt: undefined,
      grammarCheckedAt: undefined,
      status: "draft", // 将新克隆的故事状态设置为 "draft"
    });

    const segments = await ctx.db
      .query("segments")
      .filter((q) => q.eq(q.field("storyId"), args.storyId))
      .collect();

    for (const segment of segments) {
      await ctx.db.insert("segments", {
        ...segment,
        storyId: newStoryId,
      });
    }

    return { newStoryId };
  },
});
