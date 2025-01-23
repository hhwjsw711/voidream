import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  type QueryCtx,
  internalAction,
  internalMutation,
  mutation,
} from "./_generated/server";
import { auth } from "./auth";
import { consumeCreditsHelper } from "./credits";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a professional writer tasked with creating a short story for a voice over based on a given description. The story should be a story that is 10,000 characters max length. DO NOT TITLE ANY SEGMENT. JUST RETURN THE TEXT OF THE ENTIRE STORY. THIS IS FOR A VOICE OVER, ONLY INCLUDE THE SPOKEN WORDS.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const generateGuidedStoryMutation = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  async handler(ctx, args) {
    const userId = await auth.getUserId(ctx);
    console.log("User ID from getAuthUserId:", userId);

    if (userId === null) {
      throw new Error("User is not logged in");
    }

    const storyId = await ctx.db.insert("story", {
      title: args.title,
      userId: userId,
      script: "",
      status: "processing",
      createdAt: new Date().toISOString(), // 添加这一行
    });

    console.log("Created story with ID:", storyId);
    const createdStory = await ctx.db.get(storyId);
    console.log("Created story object:", createdStory);

    await consumeCreditsHelper(ctx, userId, 1);

    await ctx.scheduler.runAfter(
      0,
      internal.guidedStory.generateGuidedStoryAction,
      {
        storyId,
        description: args.description,
        userId,
      },
    );
    return storyId;
  },
});

export const generateGuidedStoryAction = internalAction({
  args: {
    storyId: v.id("story"),
    description: v.string(),
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: args.description,
            },
          ],
        },
      ],
    });

    const story = await chatSession.sendMessage(args.description);
    if (!story) throw new Error("Failed to generate story");
    console.log(story.response.text());

    await ctx.runMutation(internal.guidedStory.updateStoryScript, {
      storyId: args.storyId,
      script: story.response.text(),
      status: "completed",
    });
  },
});

export const updateStoryScript = internalMutation({
  args: {
    storyId: v.id("story"),
    script: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error"),
    ),
  },
  handler: async (ctx, args) => {
    const { storyId, script, status } = args;
    await ctx.db.patch(storyId, {
      script,
      status,
    });
  },
});

export const generateSegmentsMutation = mutation({
  args: {
    storyId: v.id("story"),
    isVertical: v.boolean(),
  },
  handler: async (ctx, args) => {
    console.log(
      `Starting generateSegmentsMutation for storyId: ${args.storyId}`,
    );
    try {
      const { storyId, isVertical } = args;

      console.log("Verifying story owner");
      const accessObj = await verifyStoryOwnerHelper(ctx, storyId);
      if (!accessObj) throw new Error("You don't have access to this story");
      console.log("Story owner verified");

      const story = accessObj.story;
      console.log(`Story found: ${story.title}`);

      const CHARS_PER_CREDIT = 15;
      const characterCount = story.script.length;
      const requiredCredits = Math.max(
        Math.ceil(characterCount / CHARS_PER_CREDIT),
        1,
      );

      console.log(`Updating story with isVertical: ${isVertical}`);
      await ctx.db.patch(storyId, { isVertical });

      console.log(
        `Consuming ${requiredCredits} credits for ${characterCount} characters`,
      );
      await consumeCreditsHelper(ctx, accessObj.userId, requiredCredits);

      console.log("Scheduling generateSegmentsAction");
      await ctx.scheduler.runAfter(
        0,
        internal.guidedStory.generateSegmentsAction,
        {
          storyId,
          script: story.script,
          userId: accessObj.userId,
        },
      );
      console.log("generateSegmentsAction scheduled successfully");

      return { success: true };
    } catch (error) {
      console.error(`Error in generateSegmentsMutation: ${error}`);
      throw error;
    }
  },
});

export const generateSegmentsAction = internalAction({
  args: {
    storyId: v.id("story"),
    script: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    /* const context = await generateContext(args.script);
    if (!context) throw new Error("Failed to generate context"); */

    const context = `${args.script.slice(0, 100)}...`;
    console.log("Temporary context:", context);

    const segments = args.script.split(/\n{2,}/);

    await ctx.runMutation(internal.story.updateStoryContent, {
      storyId: args.storyId,
      context,
    });

    for (let i = 0; i < segments.length; i++) {
      await ctx.runMutation(internal.segments.createSegmentWithImageInternal, {
        storyId: args.storyId,
        text: segments[i],
        order: i,
        context,
        userId: args.userId,
      });
    }
  },
});

export const updateStoryScriptPublic = mutation({
  args: {
    storyId: v.id("story"),
    script: v.string(),
  },
  handler: async (ctx, args) => {
    const { storyId, script } = args;
    const existingStory = await ctx.db.get(storyId);
    if (!existingStory) {
      throw new Error("Story not found");
    }
    await ctx.db.patch(storyId, { script });

    return { success: true };
  },
});

export async function verifyStoryOwnerHelper(
  ctx: QueryCtx,
  storyId: Id<"story">,
) {
  const userId = await auth.getUserId(ctx);
  console.log("User ID from auth.getUserId:", userId);

  if (userId === null) {
    console.log("No user ID found");
    return null;
  }

  const story = await ctx.db.get(storyId);
  console.log("Story:", story);

  if (!story) {
    console.log("Story not found");
    return null;
  }

  console.log("Story user ID:", story.userId);
  if (story.userId !== userId) {
    console.log("User ID does not match story user ID");
    return null;
  }

  return { userId, story };
}

export const refineStoryMutation = mutation({
  args: {
    storyId: v.id("story"),
    instructions: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(`Starting refineStoryMutation for storyId: ${args.storyId}`);
    try {
      const { storyId, instructions } = args;

      console.log("Verifying story owner");
      const accessObj = await verifyStoryOwnerHelper(ctx, storyId);
      if (!accessObj) throw new Error("You don't have access to this story");
      console.log("Story owner verified");

      console.log("Consuming credits - userId:", accessObj.userId);
      await consumeCreditsHelper(ctx, accessObj.userId, 1);
      console.log("Credits consumed successfully");

      console.log("Updating story status to processing");
      await ctx.db.patch(storyId, { status: "processing" });

      console.log("Scheduling refineStoryAction");
      await ctx.scheduler.runAfter(0, internal.guidedStory.refineStoryAction, {
        storyId,
        instructions,
        userId: accessObj.userId,
      });
      console.log("refineStoryAction scheduled successfully");

      return storyId;
    } catch (error) {
      console.error(`Error in refineStoryMutation: ${error}`);
      throw error;
    }
  },
});

export const refineStoryAction = internalAction({
  args: {
    storyId: v.id("story"),
    instructions: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { storyId, instructions } = args;
    console.log(`Starting refineStoryAction for storyId: ${storyId}`);

    const story = await ctx.runQuery(internal.story.getStoryInternal, {
      storyId,
    });
    if (!story) throw new Error("Story not found");

    try {
      console.log("Calling Gemini API");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `You are a professional story editor. Please optimize the following story with these requirements:
1. Keep it within 130 words
2. Maintain 5 short paragraphs
3. Ensure a catchy hook/intro
4. Keep the clear main learning point
5. Include actionable advice
6. Return only the optimized content without any additional text

Original Story:
${story.script}

Optimization Instructions:
${instructions}

Return only the optimized content without any titles or explanations.`;

      const result = await model.generateContent(prompt);
      const refinedScript = result.response.text();
      console.log("Successfully generated refined story");

      await ctx.runMutation(internal.guidedStory.updateStoryScript, {
        storyId,
        script: refinedScript,
        status: "completed",
      });
      console.log("Story updated successfully");
    } catch (error) {
      console.error("Error in refineStoryAction:", error);

      await ctx.runMutation(internal.guidedStory.updateStoryScript, {
        storyId,
        script: story.script,
        status: "error",
      });
      throw error;
    }
  },
});
