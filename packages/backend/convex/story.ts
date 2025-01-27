import { getAuthUserId } from "@convex-dev/auth/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { consumeCreditsHelper } from "./credits";
import { generateContext } from "./guidedStory";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

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

export const updateStoryContext = mutation({
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

// 添加内部版本
export const updateStoryContextInternal = internalMutation({
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

    // 检查积分
    const credits = await ctx.db
      .query("credits")
      .withIndex("userId_index")
      .filter((q) => q.eq(q.field("userId"), story.userId))
      .first();

    if (!credits || credits.remaining < 1) {
      throw new Error("Insufficient credits");
    }

    // 扣除积分
    await ctx.db.patch(credits._id, {
      remaining: credits.remaining - 1,
      updatedAt: Date.now(),
    });

    // 更新故事状态为处理中
    await ctx.runMutation(api.story.updateStoryStatus, {
      storyId: args.storyId,
      status: "processing",
    });

    // 触发 review 生成
    await ctx.scheduler.runAfter(
      0,
      internal.story.generateStoryReviewInternal,
      {
        storyId: args.storyId,
      },
    );

    return { success: true };
  },
});

export const fixGrammar = mutation({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story) throw new Error("Story not found");

    // 检查积分
    const credits = await ctx.db
      .query("credits")
      .withIndex("userId_index")
      .filter((q) => q.eq(q.field("userId"), story.userId))
      .first();

    if (!credits || credits.remaining < 2) {
      throw new Error("Insufficient credits, 2 credits required");
    }

    // 扣除积分
    await ctx.db.patch(credits._id, {
      remaining: credits.remaining - 2,
      updatedAt: Date.now(),
    });

    // 更新故事状态为处理中
    await ctx.db.patch(args.storyId, {
      status: "processing",
    });

    // 调度 action
    await ctx.scheduler.runAfter(0, internal.story.fixGrammarAction, args);
  },
});

export const fixGrammarAction = internalAction({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const segments = await ctx.runQuery(
        internal.segments.getSegmentsInternal,
        {
          storyId: args.storyId,
        },
      );

      for (const segment of segments) {
        const prompt = `Fix any grammar or spelling errors in this text. Keep the meaning and style unchanged:

"${segment.text}"

Return only the corrected text.`;

        const result = await model.generateContent(prompt);
        const correctedText = result.response.text().trim();

        await ctx.runMutation(internal.segments.updateSegment, {
          segmentId: segment._id,
          text: correctedText,
          isGenerating: false, // 添加状态更新
        });
      }

      // 更新故事状态
      await ctx.runMutation(api.story.updateStoryStatus, {
        storyId: args.storyId,
        status: "completed",
      });
    } catch (error) {
      // 发生错误时更新状态
      await ctx.runMutation(api.story.updateStoryStatus, {
        storyId: args.storyId,
        status: "error",
      });
      throw error;
    }
  },
});

export const cloneStory = mutation({
  args: { storyId: v.id("story"), newOrientation: v.boolean() },
  handler: async (ctx, args) => {
    // 1. 验证当前用户
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // 2. 获取原始故事
    const originalStory = await ctx.db.get(args.storyId);
    if (!originalStory) throw new Error("Original story not found");

    // 3. 检查故事所有权
    if (originalStory.userId !== userId) {
      throw new Error("Not authorized to clone this story");
    }

    // 4. 获取段落
    const segments = await ctx.db
      .query("segments")
      .filter((q) => q.eq(q.field("storyId"), args.storyId))
      .collect();

    const requiredCredits = segments.length * 10;

    // 5. 检查并扣除积分（使用当前用户ID）
    await consumeCreditsHelper(ctx, userId, requiredCredits);

    // 6. 创建新故事（移除 _id 和 _creationTime）
    const { _id, _creationTime, ...storyData } = originalStory;
    const newStoryId = await ctx.db.insert("story", {
      ...storyData,
      userId, // 使用当前用户ID
      title: `${originalStory.title} (Clone)`,
      isVertical: args.newOrientation,
      createdAt: new Date().toISOString(),
    });

    // 7. 并行创建所有段落并生成图片
    await Promise.all(
      segments.map((segment, i) =>
        ctx.runMutation(internal.segments.createSegmentWithImageInternal, {
          userId,
          storyId: newStoryId,
          text: segment.text,
          order: i,
          context: originalStory.context || "",
        }),
      ),
    );

    return { newStoryId };
  },
});

export const getReview = query({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story) return null;

    // 如果有 review，返回 review 内容
    if (story.review && story.reviewedAt) {
      return story.review;
    }
    return null;
  },
});

export const generateStoryReviewInternal = internalAction({
  args: {
    storyId: v.id("story"),
  },
  handler: async (ctx, args) => {
    const story = await ctx.runQuery(internal.story.getStoryInternal, {
      storyId: args.storyId,
    });
    if (!story) throw new Error("Story not found");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
    });

    const systemInstruction = `
You are a professional story reviewer. Provide clear, constructive feedback for the following story.

# Story Review

## Overall Impression
[2-3 sentences about the story's core concept and main strengths]

## Scoring Breakdown

### Plot (X/10)
✓ Strengths
• [Key positive point about the plot]
• [Another positive aspect]

△ Areas for Growth
• [Main suggestion for plot improvement]
• [Additional plot development suggestion]

### Character Development (X/10)
✓ Strengths
• [Key positive point about characters]
• [Another positive aspect]

△ Areas for Growth
• [Main suggestion for character improvement]
• [Additional character development suggestion]

### Atmosphere & Setting (X/10)
✓ Strengths
• [Key positive point about atmosphere]
• [Another positive aspect]

△ Areas for Growth
• [Main suggestion for atmosphere improvement]
• [Additional atmosphere enhancement suggestion]

### Writing Style (X/10)
✓ Strengths
• [Key positive point about writing]
• [Another positive aspect]

△ Areas for Growth
• [Main suggestion for style improvement]
• [Additional writing enhancement suggestion]

## Key Recommendations
1. [Most important improvement suggestion with brief explanation]
2. [Second priority improvement with brief explanation]
3. [Third priority improvement with brief explanation]

## Final Thoughts
[Encouraging closing paragraph about the story's potential]

Story Title: ${story.title}
${story.context ? `Context: ${story.context}\n` : ""}
Story Content:
${story.script}

IMPORTANT: 
- Keep feedback specific and actionable
- Use "✓" for strengths and "△" for areas of growth
- Maintain consistent formatting
- Be encouraging but honest
`.trim();

    try {
      const chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemInstruction }],
          },
        ],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
        },
      });

      const result = await chatSession.sendMessage(story.script);
      const review = result.response.text().trim();
      console.log("Generated story review:", review);

      // 更新故事的 review
      await ctx.runMutation(internal.story.updateStoryReview, {
        storyId: args.storyId,
        review,
      });
    } catch (error) {
      console.error("Error in generateStoryReview:", error);
      await ctx.runMutation(api.story.updateStoryStatus, {
        storyId: args.storyId,
        status: "error",
      });
      throw error;
    }
  },
});

// 更新 review 的 mutation
export const updateStoryReview = internalMutation({
  args: {
    storyId: v.id("story"),
    review: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.storyId, {
      review: args.review,
      reviewedAt: new Date().toISOString(),
      status: "completed",
    });
  },
});

export const applyRevisions = mutation({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story) throw new Error("故事未找到");
    if (!story.review) throw new Error("请先生成评审");

    // 检查积分
    const credits = await ctx.db
      .query("credits")
      .withIndex("userId_index")
      .filter((q) => q.eq(q.field("userId"), story.userId))
      .first();

    if (!credits || credits.remaining < 10) {
      throw new Error("积分不足，需要 10 积分");
    }

    // 扣除积分
    await ctx.db.patch(credits._id, {
      remaining: credits.remaining - 10,
      updatedAt: Date.now(),
    });

    // 更新故事状态为处理中
    await ctx.runMutation(api.story.updateStoryStatus, {
      storyId: args.storyId,
      status: "processing",
    });

    // 触发异步处理
    await ctx.scheduler.runAfter(0, internal.story.applyRevisionsInternal, {
      storyId: args.storyId,
    });

    return { success: true };
  },
});

export const applyRevisionsInternal = internalAction({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    try {
      // 1. 获取故事信息
      const story = await ctx.runQuery(internal.story.getStoryInternal, {
        storyId: args.storyId,
      });
      if (!story) throw new Error("故事未找到");

      // 2. 获取现有段落数量
      const existingSegments = await ctx.runQuery(
        internal.segments.getSegmentsInternal,
        {
          storyId: args.storyId,
        },
      );

      // 3. 使用 AI 重写故事
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
        },
      });

      const prompt = `As a professional story editor, revise the following story based on the review feedback. 

Important: The revised story MUST have exactly ${existingSegments.length} paragraphs, same as the original.

Focus on:
1. Addressing all review comments
2. Improving clarity and readability
3. Maintaining the story's core message and tone
4. Ensuring natural paragraph transitions
5. Keeping each paragraph's relative length similar to the original

Original Story:
${story.script}

Review Comments:
${story.review}

Return only the revised story with exactly ${existingSegments.length} paragraphs, separated by blank lines. No additional formatting or explanations.`;

      // 4. 生成新故事
      const result = await model.generateContent(prompt);
      const improvedStory = result.response.text().trim();

      // 5. 生成 context（在 action 中是可以的）
      const newContext = await generateContext(improvedStory);

      // 6. 更新故事内容
      await ctx.runMutation(internal.story.updateStoryScript, {
        storyId: args.storyId,
        script: improvedStory,
        context: newContext,
        status: "completed",
      });
    } catch (error) {
      console.error("应用修改时出错:", error);
      await ctx.runMutation(api.story.updateStoryStatus, {
        storyId: args.storyId,
        status: "error",
      });
      throw error;
    }
  },
});

export const updateStoryScript = internalMutation({
  args: {
    storyId: v.id("story"),
    script: v.string(),
    context: v.string(),
    status: StoryStatus,
  },
  handler: async (ctx, args) => {
    const { storyId, script, context, status } = args;

    // 更新故事内容和状态
    await ctx.db.patch(storyId, {
      script,
      context,
      status,
    });

    // 获取现有段落并按顺序排列
    const existingSegments = await ctx.db
      .query("segments")
      .withIndex("by_storyId", (q) => q.eq("storyId", storyId))
      .collect();

    const sortedSegments = existingSegments.sort((a, b) => a.order - b.order);

    // 更新每个段落的内容
    const segments = script.split(/\n{2,}/);
    for (let i = 0; i < sortedSegments.length; i++) {
      const text = segments[i]?.trim() || sortedSegments[i].text;
      await ctx.db.patch(sortedSegments[i]._id, {
        text,
        isGenerating: status !== "completed",
      });
    }

    return { success: true };
  },
});
