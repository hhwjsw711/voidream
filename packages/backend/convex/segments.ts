import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
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

IMPORTANT: Return ONLY the image prompt as plain text, without any JSON formatting or Markdown code blocks. Do not include any explanations or additional text.

Context: ${args.context || "No context provided"}

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
    } catch (error) {
      console.error("Error in generateSegmentImagePrompt:", error);

      // 更新段落状态，标记错误
      await ctx.runMutation(internal.segments.updateSegment, {
        segmentId: args.segment._id,
        isGenerating: false,
        error: error instanceof Error ? error.message : String(error),
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

export const addSegment = mutation({
  args: {
    storyId: v.id("story"),
    text: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { storyId, text, context } = args;

    // 获取当前故事的所有段落
    const existingSegments = await ctx.db
      .query("segments")
      .filter((q) => q.eq(q.field("storyId"), storyId))
      .collect();

    // 计算新段落的顺序
    const newOrder = existingSegments.length;

    // 创建新段落
    const segmentId = await ctx.db.insert("segments", {
      storyId,
      text,
      order: newOrder,
      isGenerating: true,
    });

    // 触发图像生成过程
    await ctx.scheduler.runAfter(
      0,
      internal.segments.generateSegmentImageReplicateInternal,
      {
        segment: {
          text,
          _id: segmentId,
        },
        context: context || "",
      },
    );

    return segmentId;
  },
});
