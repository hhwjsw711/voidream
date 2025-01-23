"use client";

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
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

enum DialogType {
  None = 0,
  Refine = 1,
  GenerateSegments = 2,
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return debounced as T & { cancel: () => void };
}

function countWordsAndCharacters(text: string): {
  wordCount: number;
  characterCount: number;
} {
  const words = text.match(/[\u4e00-\u9fa5]|\b[a-z0-9']+\b/gi) || [];
  const characterCount = text.trim().length;
  return { wordCount: words.length, characterCount };
}

function estimateVideoLength(text: string): {
  length: string;
  wordCount: number;
  characterCount: number;
} {
  const { wordCount, characterCount } = countWordsAndCharacters(text);

  const wordsPerMinute: { [key: string]: number } = {
    en: 150,
    zh: 200,
    default: 150,
  };

  function detectLanguage(word: string): string {
    if (/[\u4e00-\u9fa5]/.test(word)) return "zh";
    return "en";
  }

  let totalTime = 0;
  const words = text.match(/[\u4e00-\u9fa5]|\b[a-z0-9']+\b/gi) || [];
  words.forEach((word) => {
    const lang = detectLanguage(word);
    totalTime += 1 / wordsPerMinute[lang];
  });

  const minutes = totalTime;

  let length: string;
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    length = `${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else if (minutes < 60) {
    length = `${minutes.toFixed(1)} minute${minutes !== 1 ? "s" : ""}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    length = `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
  }

  return { length, wordCount, characterCount };
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
        title: "开始优化故事",
        description: "正在根据您的指令优化故事内容，请稍候...",
      });

      setOpenDialog(DialogType.None);
      setInstructions(""); // 清空输入
    } catch (error) {
      console.error("优化失败:", error);
      toast({
        title: "优化失败",
        description: error instanceof Error ? error.message : "请稍后重试",
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

  const {
    length: estimatedVideoLength,
    wordCount,
    characterCount,
  } = estimateVideoLength(story?.script || "");

  const estimatedCredits = Math.ceil(wordCount / 100);

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
        <svg
          width="20"
          height="20"
          fill="currentColor"
          className="mr-2 animate-spin"
          viewBox="0 0 1792 1792"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z" />
        </svg>
        <span className="ml-2">Loading story...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">{story.title}</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <textarea
            ref={textareaRef}
            className="w-full min-h-[400px] resize-none focus:outline-none text-gray-800 bg-gray-50"
            defaultValue={story.script}
            onChange={handleScriptChange}
            disabled={story.status === "processing"}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>
            {wordCount} words / {characterCount} characters
          </span>
          <span>Estimated video length: {estimatedVideoLength}</span>
        </div>
        {isUnsaved && (
          <p className="text-sm text-gray-500 mt-2">Unsaved changes</p>
        )}
        <div className="flex justify-between space-x-4 mt-4">
          <Button
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            variant="outline"
            onClick={() => setOpenDialog(DialogType.Refine)}
          >
            Refine Story
          </Button>
          <Button
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            variant="outline"
            onClick={() => setOpenDialog(DialogType.GenerateSegments)}
          >
            Generate Segments
          </Button>
        </div>
      </div>

      <Dialog
        open={openDialog !== DialogType.None}
        onOpenChange={(open) => !open && setOpenDialog(DialogType.None)}
      >
        <DialogContent className="sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] max-h-[80vh] overflow-y-auto bg-white">
          {openDialog === DialogType.Refine && (
            <>
              <DialogHeader>
                <DialogTitle className="text-md font-bold text-gray-900 mb-8">
                  Refine Your Story
                </DialogTitle>
                <DialogDescription className="text-gray-900">
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
                    className="col-span-4 text-gray-900 placeholder-gray-400 bg-gray-100"
                    disabled={isRefining}
                  />
                </div>
              </div>
              <DialogFooter className="mt-8">
                <Button
                  type="button"
                  variant="secondary"
                  className="text-gray-700 bg-gray-200 hover:bg-gray-300 mr-2"
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
                  className="text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Refine (1 credit)
                </Button>
              </DialogFooter>
            </>
          )}
          {openDialog === DialogType.GenerateSegments && (
            <>
              <DialogHeader>
                <DialogTitle className="text-md font-bold text-gray-900 mb-8">
                  Choose Video Orientation
                </DialogTitle>
                <DialogDescription className="text-gray-900 space-y-2">
                  <span className="block">
                    Vertical videos are ideal for platforms like TikTok and
                    Instagram Reels.
                  </span>
                  <span className="block">
                    Horizontal videos are better suited for YouTube and
                    traditional video players.
                  </span>
                  <span className="block font-bold">
                    Note: Once set, the orientation cannot be changed without
                    regenerating all images, so choose carefully!
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-between space-x-4 mt-4">
                <Button
                  className={cn(
                    "flex-1 px-4 py-2 rounded transition-colors",
                    isVertical
                      ? "text-white bg-blue-600 hover:bg-blue-700"
                      : "text-gray-900 bg-gray-200 hover:bg-gray-300",
                  )}
                  onClick={() => setIsVertical(true)}
                >
                  Vertical
                </Button>
                <Button
                  className={cn(
                    "flex-1 px-4 py-2 rounded transition-colors",
                    isVertical
                      ? "text-gray-900 bg-gray-200 hover:bg-gray-300"
                      : "text-white bg-blue-600 hover:bg-blue-700",
                  )}
                  onClick={() => setIsVertical(false)}
                >
                  Horizontal
                </Button>
              </div>
              <DialogFooter className="mt-8">
                <Button
                  type="button"
                  variant="secondary"
                  className="text-gray-700 bg-gray-200 hover:bg-gray-300 mr-2"
                  onClick={() => setOpenDialog(DialogType.None)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={handleGenerateSegments}
                  disabled={isGenerating}
                >
                  {isGenerating
                    ? "Generating..."
                    : `Generate (${estimatedCredits} credits)`}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
