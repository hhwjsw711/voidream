import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const createSegmentWithImageInternal = internalMutation({
  args: {
    userId: v.id("users"),
    storyId: v.id("story"),
    text: v.string(),
    order: v.number(),
    context: v.string(),
  },
  async handler(ctx, args) {
    const segmentId = await ctx.db.insert("segments", {
      storyId: args.storyId,
      text: args.text,
      order: args.order,
      isGenerating: true,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.segments.generateSegmentImageReplicateInternal,
      {
        segment: {
          text: args.text,
          _id: segmentId,
        },
        context: args.context,
      },
    );
  },
});

export const generateSegmentImageReplicateInternal = internalAction({
  args: {
    context: v.optional(v.string()),
    segment: v.object({
      text: v.string(),
      _id: v.id("segments"),
    }),
  },
  handler: async (ctx, args) => {
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
You are a professional image prompt generator. Create a detailed image prompt based on the given context and text segment for an AI image generation system.

Guidelines:
1. Concise yet descriptive, 50-100 words.
2. Focus on visual elements: scenes, characters, objects, colors, atmosphere.
3. Use specific, vivid language; avoid abstract concepts.
4. Exclude non-visual elements (sounds, smells, tactile sensations).
5. Avoid proprietary names or copyrighted content.
6. No inappropriate or offensive content.
7. If context is provided, incorporate its style elements naturally into the prompt.

IMPORTANT: Return ONLY the image prompt as plain text, without any JSON formatting or Markdown code blocks. Do not include any explanations or additional text.

Context: ${args.context ? `${args.context}, high quality, detailed, sharp, 4k` : "No context provided"}

Generate an image prompt based on the above and the provided text segment.
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

      const result = await chatSession.sendMessage(args.segment.text);
      const prompt = result.response.text().trim();
      console.log("Generated image prompt:", prompt);

      // 使用生成的提示来创建图像
      await ctx.runAction(
        internal.replicate.regenerateSegmentImageUsingPrompt,
        {
          segmentId: args.segment._id,
          prompt,
        },
      );

      // 更新段落状态
      await ctx.runMutation(internal.segments.updateSegment, {
        segmentId: args.segment._id,
        isGenerating: false,
        prompt,
      });

      // 使用 getSegmentInternal 获取当前段落
      const currentSegment = await ctx.runQuery(
        internal.segments.getSegmentInternal,
        {
          segmentId: args.segment._id,
        },
      );

      // 使用 getSegmentsInternal 获取所有段落
      const allSegments = await ctx.runQuery(
        internal.segments.getSegmentsInternal,
        {
          storyId: currentSegment.storyId,
        },
      );

      // 检查是否所有段落都已完成生成
      const allCompleted = allSegments.every((seg) => !seg.isGenerating);

      if (allCompleted) {
        // 如果所有段落都完成了，更新故事状态为 completed
        await ctx.runMutation(api.story.updateStoryStatus, {
          storyId: currentSegment.storyId,
          status: "completed",
        });
      }
    } catch (error) {
      console.error("Error in generateSegmentImagePrompt:", error);

      // 更新段落状态，标记错误
      await ctx.runMutation(internal.segments.updateSegment, {
        segmentId: args.segment._id,
        isGenerating: false,
        error: error instanceof Error ? error.message : String(error),
      });

      // 使用 getSegmentInternal 获取段落信息
      const errorSegment = await ctx.runQuery(
        internal.segments.getSegmentInternal,
        {
          segmentId: args.segment._id,
        },
      );

      // 更新故事状态为错误
      await ctx.runMutation(api.story.updateStoryStatus, {
        storyId: errorSegment.storyId,
        status: "error",
      });

      throw error;
    }
  },
});

export const updateSegment = internalMutation({
  args: {
    segmentId: v.id("segments"),
    isGenerating: v.optional(v.boolean()),
    image: v.optional(v.id("_storage")),
    previewImage: v.optional(v.id("_storage")),
    prompt: v.optional(v.string()),
    error: v.optional(v.string()),
    text: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { segmentId, ...updateFields } = args;

    // 移除所有未定义的字段
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updateFields).filter(([, value]) => value !== undefined),
    );

    // 更新段落
    await ctx.db.patch(segmentId, fieldsToUpdate);

    return { success: true };
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getFirstSegment = query({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    const segment = await ctx.db
      .query("segments")
      .filter((q) => q.eq(q.field("storyId"), args.storyId))
      .order("asc")
      .first();
    return segment;
  },
});

// 添加新的获取预览图片 URL 的函数
export const getAllPreviewImageUrls = query({
  args: {},
  handler: async (ctx): Promise<Record<Id<"story">, string | null>> => {
    const segments = await ctx.db
      .query("segments")
      .filter((q) => q.eq(q.field("order"), 0))
      .collect();

    const previewUrls: Record<Id<"story">, string | null> = {};

    for (const segment of segments) {
      if (segment.image) {
        const url = await ctx.storage.getUrl(segment.image);
        previewUrls[segment.storyId] = url;
      } else {
        previewUrls[segment.storyId] = null;
      }
    }

    return previewUrls;
  },
});

export const getSegmentInternal = internalQuery({
  args: { segmentId: v.id("segments") },
  handler: async (ctx, args) => {
    const { segmentId } = args;

    const segment = await ctx.db.get(segmentId);

    if (!segment) {
      throw new Error(`Segment with id ${segmentId} not found`);
    }

    return segment;
  },
});

export const getSegments = query({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    const segments = await ctx.db
      .query("segments")
      .filter((q) => q.eq(q.field("storyId"), args.storyId))
      .order("asc")
      .collect();
    return segments;
  },
});

// 添加内部版本
export const getSegmentsInternal = internalQuery({
  args: { storyId: v.id("story") },
  handler: async (ctx, args) => {
    const segments = await ctx.db
      .query("segments")
      .filter((q) => q.eq(q.field("storyId"), args.storyId))
      .order("asc")
      .collect();
    return segments;
  },
});

export const addSegment = mutation({
  args: {
    storyId: v.id("story"),
    insertAfterOrder: v.optional(v.number()), // 添加可选的插入位置参数
  },
  handler: async (ctx, args) => {
    const { storyId, insertAfterOrder } = args;

    // 获取当前故事的所有段落
    const existingSegments = await ctx.db
      .query("segments")
      .filter((q) => q.eq(q.field("storyId"), storyId))
      .collect();

    // 计算新段落的顺序
    let newOrder: number;
    if (insertAfterOrder !== undefined) {
      await Promise.all(
        existingSegments
          .filter((segment) => segment.order > insertAfterOrder)
          .map((segment) =>
            ctx.db.patch(segment._id, { order: segment.order + 1 }),
          ),
      );
      newOrder = insertAfterOrder + 1;
    } else {
      newOrder = existingSegments.length;
    }

    // 创建新的空段落
    const segmentId = await ctx.db.insert("segments", {
      storyId,
      text: "", // 空文本
      order: newOrder,
      isGenerating: false, // 初始不生成图片
    });

    return segmentId;
  },
});

export const refineText = mutation({
  args: {
    segmentId: v.id("segments"),
  },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.segmentId);
    if (!segment) throw new Error("Segment not found");

    // 设置生成状态
    await ctx.db.patch(args.segmentId, {
      isGenerating: true,
    });

    // 调用 action 来处理 AI 请求
    await ctx.scheduler.runAfter(0, internal.segments.refineTextAction, {
      segmentId: args.segmentId,
      text: segment.text,
    });

    return { success: true };
  },
});

export const refineTextAction = internalAction({
  args: {
    segmentId: v.id("segments"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    try {
      const result = await model.generateContent(
        `
You are a professional text editor. Please refine and improve the following text while maintaining its original meaning.

Focus on:
1. Enhancing clarity and readability
2. Improving grammar and expression
3. Making the language more engaging
4. Maintaining the original tone and style
5. Ensuring content continuity

Original text:
${args.text}

Return only the refined text without any explanations.
`.trim(),
      );

      const refinedText = result.response.text();

      if (!refinedText) throw new Error("Text refinement failed");

      // 更新文本并重置生成状态
      await ctx.runMutation(internal.segments.updateSegment, {
        segmentId: args.segmentId,
        text: refinedText.trim(),
        isGenerating: false,
      });
    } catch (error) {
      // 发生错误时更新状态和错误信息
      await ctx.runMutation(internal.segments.updateSegment, {
        segmentId: args.segmentId,
        isGenerating: false,
        error:
          error instanceof Error ? error.message : "Text refinement failed",
      });

      throw error;
    }
  },
});

export const regenerateImage = mutation({
  args: {
    segmentId: v.id("segments"),
  },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.segmentId);
    if (!segment) throw new Error("Segment not found");
    if (!segment.prompt) throw new Error("Prompt not found");

    const story = await ctx.db.get(segment.storyId);
    if (!story) throw new Error("Story not found");

    const credits = await ctx.db
      .query("credits")
      .withIndex("userId_index") // 使用正确的索引名称
      .filter((q) => q.eq(q.field("userId"), story.userId))
      .first();

    if (!credits || credits.remaining < 10) {
      throw new Error("Insufficient credits, 10 credits are required");
    }

    await ctx.db.patch(credits._id, {
      remaining: credits.remaining - 10,
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.segmentId, {
      isGenerating: true,
      error: undefined,
    });

    // 直接使用原有的提示词重新生成图片
    await ctx.scheduler.runAfter(
      0,
      internal.replicate.regenerateSegmentImageUsingPrompt,
      {
        segmentId: args.segmentId,
        prompt: segment.prompt,
      },
    );

    return { success: true };
  },
});

export const savePrompt = mutation({
  args: {
    segmentId: v.id("segments"),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.segmentId);
    if (!segment) throw new Error("段落不存在");

    await ctx.db.patch(args.segmentId, {
      prompt: args.prompt,
    });

    return { success: true };
  },
});

// 1. 只更新文本
export const updateSegmentText = mutation({
  args: {
    segmentId: v.id("segments"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.segmentId);
    if (!segment) throw new Error("Segment not found");

    // 只更新文本
    await ctx.db.patch(args.segmentId, {
      text: args.text.trim(),
    });

    return { success: true };
  },
});

export const get = query({
  args: { segmentId: v.id("segments") },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.segmentId);

    if (!segment) {
      throw new Error(`段落不存在 (ID: ${args.segmentId})`);
    }

    return segment;
  },
});

export const deleteSegment = mutation({
  args: {
    segmentId: v.id("segments"),
  },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.segmentId);
    if (!segment) {
      throw new Error("段落不存在");
    }

    // 获取故事信息以检查权限
    const story = await ctx.db.get(segment.storyId);
    if (!story) {
      throw new Error("故事不存在");
    }

    // 获取所有相关段落并按顺序排列
    const allSegments = await ctx.db
      .query("segments")
      .withIndex("by_storyId", (q) => q.eq("storyId", segment.storyId))
      .collect();

    const sortedSegments = allSegments.sort((a, b) => a.order - b.order);
    const deletedOrder = segment.order;

    // 删除段落
    await ctx.db.delete(args.segmentId);

    // 更新后续段落的顺序
    for (const seg of sortedSegments) {
      if (seg._id !== args.segmentId && seg.order > deletedOrder) {
        await ctx.db.patch(seg._id, {
          order: seg.order - 1,
        });
      }
    }

    return { success: true };
  },
});

export const deleteSegmentInternal = internalMutation({
  args: {
    segmentId: v.id("segments"),
  },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.segmentId);
    if (!segment) {
      throw new Error("段落不存在");
    }

    // 获取所有相关段落并按顺序排列
    const allSegments = await ctx.db
      .query("segments")
      .withIndex("by_storyId", (q) => q.eq("storyId", segment.storyId))
      .collect();

    const sortedSegments = allSegments.sort((a, b) => a.order - b.order);
    const deletedOrder = segment.order;

    // 删除段落
    await ctx.db.delete(args.segmentId);

    // 更新后续段落的顺序
    for (const seg of sortedSegments) {
      if (seg._id !== args.segmentId && seg.order > deletedOrder) {
        await ctx.db.patch(seg._id, {
          order: seg.order - 1,
        });
      }
    }

    return { success: true };
  },
});

export const generateImage = mutation({
  args: {
    segmentId: v.id("segments"),
  },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.segmentId);
    if (!segment) throw new Error("Segment not found");
    if (!segment.text) throw new Error("Text is required");

    const story = await ctx.db.get(segment.storyId);
    if (!story) throw new Error("Story not found");

    // 检查积分
    const credits = await ctx.db
      .query("credits")
      .withIndex("userId_index")
      .filter((q) => q.eq(q.field("userId"), story.userId))
      .first();

    if (!credits || credits.remaining < 10) {
      throw new Error("Insufficient credits, 10 credits are required");
    }

    // 扣除积分
    await ctx.db.patch(credits._id, {
      remaining: credits.remaining - 10,
      updatedAt: Date.now(),
    });

    // 更新 segment 状态
    await ctx.db.patch(args.segmentId, {
      isGenerating: true,
      error: undefined,
    });

    // 如果是草稿状态，更新为处理中
    if (story.status === "draft") {
      await ctx.runMutation(api.story.updateStoryStatus, {
        storyId: segment.storyId,
        status: "processing",
      });
    }

    // 使用现有的 generateSegmentImageReplicateInternal
    await ctx.scheduler.runAfter(
      0,
      internal.segments.generateSegmentImageReplicateInternal,
      {
        segment: {
          text: segment.text,
          _id: args.segmentId,
        },
        context: story.context,
      },
    );

    return { success: true };
  },
});
