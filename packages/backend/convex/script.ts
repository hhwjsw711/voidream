import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { internalAction, mutation } from "./_generated/server";
import { auth } from "./auth";
import { consumeCreditsHelper } from "./credits";
import { generateContext } from "./guidedStory";

export const generateScriptMutation = mutation({
  args: {
    title: v.string(),
    script: v.string(),
    customContext: v.string(),
    useCustomContext: v.boolean(),
    videoFormat: v.string(),
  },
  async handler(ctx, args) {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("User is not logged in");
    }

    // 使用现有的 story 表
    const storyId = await ctx.db.insert("story", {
      title: args.title,
      userId,
      script: args.script,
      status: "processing",
      isVertical: args.videoFormat === "vertical",
      context: args.useCustomContext ? args.customContext : undefined,
      createdAt: new Date().toISOString(),
    });

    // 计算段落数量
    const segments = args.script.split(/\n{2,}/);
    const imageCredits = segments.length * 10; // 每张图片 10 积分

    // 计算文本积分
    const CHARS_PER_CREDIT = 100;
    const textCredits = Math.max(
      Math.ceil(args.script.length / CHARS_PER_CREDIT),
      1,
    );

    // 总积分
    const requiredCredits = textCredits + imageCredits;

    // 扣除积分
    await consumeCreditsHelper(ctx, userId, requiredCredits);

    // 调度生成任务
    await ctx.scheduler.runAfter(0, internal.script.generateImagesAction, {
      storyId,
      script: args.script,
      customContext: args.customContext,
      useCustomContext: args.useCustomContext,
      userId,
    });

    return storyId;
  },
});

export const generateImagesAction = internalAction({
  args: {
    storyId: v.id("story"),
    script: v.string(),
    customContext: v.string(),
    useCustomContext: v.boolean(),
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    try {
      // 使用自定义上下文或生成新的上下文
      const context = args.useCustomContext
        ? args.customContext
        : await generateContext(args.script);

      // 更新故事上下文
      await ctx.runMutation(internal.story.updateStoryContextInternal, {
        storyId: args.storyId,
        context,
      });

      const segments = args.script.split(/\n{2,}/);

      // 为每个段落创建图像
      await Promise.all(
        segments.map((segment, i) =>
          ctx.runMutation(internal.segments.createSegmentWithImageInternal, {
            storyId: args.storyId,
            text: segment.trim(),
            order: i,
            context,
            userId: args.userId,
          }),
        ),
      );

      // 使用现有的 updateStoryStatus
      await ctx.runMutation(api.story.updateStoryStatus, {
        storyId: args.storyId,
        status: "completed",
      });
    } catch (error) {
      console.error("Error in generateImagesAction:", error);
      await ctx.runMutation(api.story.updateStoryStatus, {
        storyId: args.storyId,
        status: "error",
      });
      throw error;
    }
  },
});
