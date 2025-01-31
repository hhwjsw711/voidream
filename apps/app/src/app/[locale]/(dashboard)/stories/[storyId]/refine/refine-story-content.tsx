"use client";

import { debounce } from "@/utils/debounce";
import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { Input } from "@v1/ui/input";
import { toast } from "@v1/ui/use-toast";
import { cn } from "@v1/ui/utils";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Monitor, Smartphone, Wand2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

enum DialogType {
  None = 0,
  Refine = 1,
  GenerateSegments = 2,
}

interface VideoInfo {
  length: string;
  wordCount: number;
  characterCount: number;
}

export function countWordsAndCharacters(text: string) {
  // 匹配英文单词（包括带撇号的单词、数字）
  const englishWords =
    text.match(/\b[A-Za-z0-9]+(?:[''][A-Za-z0-9]+)*\b/g) || [];

  // 匹配中文字符
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];

  // 计算字符数（包含字母、数字、标点符号，但不包含空格和换行符）
  const cleanText = text.replace(/\s+/g, ""); // 只移除空白字符（空格、换行符、制表符等）

  return {
    wordCount: englishWords.length + chineseChars.length,
    characterCount: cleanText.length,
    englishWords,
    chineseChars,
  };
}

export function estimateVideoLength(text: string): VideoInfo {
  const { wordCount, characterCount, englishWords, chineseChars } =
    countWordsAndCharacters(text);

  const SPEEDS = {
    en: 150,
    zh: 200,
  };

  const englishTime = englishWords.length / SPEEDS.en;
  const chineseTime = chineseChars.length / SPEEDS.zh;
  const totalMinutes = englishTime + chineseTime;

  return {
    ...formatDuration(totalMinutes, wordCount),
    characterCount,
  };
}

function formatDuration(minutes: number, wordCount: number) {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return {
      length: `${seconds} second${seconds !== 1 ? "s" : ""}`,
      wordCount,
    };
  }

  if (minutes < 60) {
    const roundedMinutes = Number(minutes.toFixed(1));
    return {
      length: `${roundedMinutes} minute${roundedMinutes !== 1 ? "s" : ""}`,
      wordCount,
    };
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return {
    length: `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${
      remainingMinutes !== 1 ? "s" : ""
    }`,
    wordCount,
  };
}

export function calculateSegmentCredits(text: string): number {
  const { characterCount } = countWordsAndCharacters(text);

  // 每 15 个字符消耗 1 积分
  const CHARS_PER_CREDIT = 15;

  // 向上取整，确保最少 1 积分
  return Math.max(Math.ceil(characterCount / CHARS_PER_CREDIT), 1);
}

export function RefineStoryContent() {
  const params = useParams();
  const storyId = params.storyId as Id<"story">;
  const story = useQuery(api.story.getStory, { storyId });
  const [isVertical, setIsVertical] = useState(true);
  const [openDialog, setOpenDialog] = useState<DialogType>(DialogType.None);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const updateStoryScript = useMutation(
    api.guidedStory.updateStoryScriptPublic,
  );
  const generateSegments = useMutation(
    api.guidedStory.generateSegmentsMutation,
  );
  const lastStatus = useRef(story?.status);

  const [isUnsaved, setIsUnsaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [instructions, setInstructions] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const refineStory = useMutation(api.guidedStory.refineStoryMutation);

  const handleRefine = async () => {
    setIsRefining(true);
    try {
      await refineStory({
        storyId,
        instructions: instructions.trim(),
      });

      toast({
        title: "Starting Story Refinement",
        description:
          "Optimizing story content based on your instructions, please wait...",
      });

      setOpenDialog(DialogType.None);
      setInstructions("");
    } catch (error) {
      console.error("Refinement failed:", error);
      toast({
        title: "Refinement Failed",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const debouncedUpdate = useCallback(
    debounce((newScript: string) => {
      updateStoryScript({ storyId, script: newScript });
      setIsUnsaved(false);
    }, 500),
    [storyId, updateStoryScript],
  );

  const handleScriptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newScript = e.target.value;
      setIsUnsaved(true);
      debouncedUpdate(newScript);
    },
    [debouncedUpdate, setIsUnsaved],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  useEffect(() => {
    if (lastStatus.current === "processing" && story?.status === "completed") {
      if (textareaRef.current) {
        textareaRef.current.value = story.script;
      }
    }
    lastStatus.current = story?.status;
  }, [story?.status, story?.script]);

  const videoInfo = story?.script
    ? estimateVideoLength(story.script)
    : { length: "0 seconds", wordCount: 0, characterCount: 0 };

  const estimatedCredits = story?.script
    ? calculateSegmentCredits(story.script)
    : 1;

  const handleGenerateSegments = useCallback(async () => {
    if (!story) return;
    setIsGenerating(true);
    try {
      await generateSegments({
        storyId,
        isVertical,
      });
      router.push(`/stories/${storyId}`);
    } catch (error) {
      console.error("Error generating segments:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [generateSegments, isVertical, router, story, storyId]);

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="ml-2">Loading story...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          {story.title}
        </h1>

        <div className="space-y-2">
          <div className="h-6">
            <p
              className={cn(
                "text-sm text-gray-600 dark:text-gray-400",
                "transition-opacity duration-200",
                isUnsaved ? "opacity-100" : "opacity-0",
              )}
            >
              Unsaved changes
            </p>
          </div>
          <div className="relative group">
            <textarea
              ref={textareaRef}
              className="w-full min-h-[400px] p-5 resize-none rounded-lg 
                text-gray-900 dark:text-gray-100 
                bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                placeholder-gray-500 dark:placeholder-gray-400 
                focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 
                focus:border-blue-500/50 dark:focus:border-blue-500/50 
                focus:outline-none transition-all duration-200 
                disabled:opacity-60 disabled:cursor-not-allowed 
                font-medium leading-relaxed"
              defaultValue={story.script}
              onChange={handleScriptChange}
              disabled={story.status === "processing"}
              spellCheck={false}
            />
            {story.status === "processing" && (
              <div className="absolute inset-0 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>
            {videoInfo.wordCount} words / {videoInfo.characterCount} characters
          </span>
          <div className="flex items-center gap-2">
            <span>Estimated video length: {videoInfo.length}</span>
          </div>
        </div>

        <div className="flex justify-between space-x-4 mt-4">
          <Button
            className="flex-1 h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
            onClick={() => setOpenDialog(DialogType.Refine)}
          >
            <Wand2 className="h-4 w-4" />
            <span>Refine Story</span>
          </Button>
          <Button
            className="flex-1 h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
            onClick={() => setOpenDialog(DialogType.GenerateSegments)}
          >
            <span>Generate Segments</span>
          </Button>
        </div>
      </div>

      <Dialog
        open={openDialog !== DialogType.None}
        onOpenChange={(open) => !open && setOpenDialog(DialogType.None)}
      >
        <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] max-h-[80vh] overflow-y-auto">
          {openDialog === DialogType.Refine && (
            <>
              <DialogHeader>
                <DialogTitle className="text-md font-bold text-gray-900 dark:text-gray-100 mb-8">
                  Refine Your Story
                </DialogTitle>
                <DialogDescription className="text-gray-900 dark:text-gray-200">
                  Enter your refinement instructions. This will cost 1 credit.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="refine-instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter refinement instructions..."
                    className="col-span-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    disabled={isRefining}
                  />
                </div>
              </div>
              <DialogFooter className="mt-8">
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
                    onClick={() => {
                      setOpenDialog(DialogType.None);
                      setInstructions("");
                    }}
                    disabled={isRefining}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleRefine}
                    disabled={isRefining || !instructions.trim()}
                    className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    Refine (1 credit)
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
          {openDialog === DialogType.GenerateSegments && (
            <>
              <DialogHeader>
                <DialogTitle className="text-md font-bold text-gray-900 dark:text-gray-100 mb-8">
                  Choose Video Orientation
                </DialogTitle>
                <DialogDescription className="text-gray-900 dark:text-gray-200 space-y-2">
                  <span className="block">
                    Vertical videos are ideal for platforms like TikTok and
                    Instagram Reels.
                  </span>
                  <span className="block">
                    Horizontal videos are better suited for YouTube and
                    traditional video players.
                  </span>
                  <span className="block font-bold text-gray-900 dark:text-gray-100">
                    Note: Once set, the orientation cannot be changed without
                    regenerating all images, so choose carefully!
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-between space-x-4 mt-4">
                <Button
                  className={cn(
                    "w-full h-9 px-3 py-2 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2",
                    isVertical
                      ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200",
                  )}
                  onClick={() => setIsVertical(true)}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Vertical</span>
                </Button>
                <Button
                  className={cn(
                    "w-full h-9 px-3 py-2 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2",
                    !isVertical
                      ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200",
                  )}
                  onClick={() => setIsVertical(false)}
                >
                  <Monitor className="h-4 w-4" />
                  <span>Horizontal</span>
                </Button>
              </div>
              <DialogFooter className="mt-8">
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
                    onClick={() => setOpenDialog(DialogType.None)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
                    onClick={handleGenerateSegments}
                    disabled={isGenerating}
                  >
                    {isGenerating
                      ? "Generating..."
                      : `Generate (${estimatedCredits} credits)`}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
