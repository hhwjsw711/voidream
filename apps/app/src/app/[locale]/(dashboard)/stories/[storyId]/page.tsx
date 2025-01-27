"use client";

import { debounce } from "@/utils/debounce";
import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import type { Doc } from "@v1/backend/convex/_generated/dataModel";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@v1/ui/dropdown-menu";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { Textarea } from "@v1/ui/textarea";
import { toast } from "@v1/ui/use-toast";
import { cn } from "@v1/ui/utils";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  ImageIcon,
  Loader2,
  Monitor,
  MoreVertical,
  PauseIcon,
  Pencil,
  PlayIcon,
  Plus,
  Smartphone,
  Sparkles,
  SpellCheck,
  Trash,
  TriangleAlert,
  Video,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import ReactMarkdown from "react-markdown";
import { StepIndicator } from "../../_components/step-indicator";
import { countWordsAndCharacters } from "./refine/refine-story-content";

interface StoryTitleProps {
  title: string;
  storyId: Id<"story">;
}

interface SegmentCardProps {
  segment: Doc<"segments">;
  isVertical: boolean;
}

interface EditImageContextProps {
  context: string;
  onContextUpdate: (newContext: string) => Promise<void>;
}

interface EditImagePromptFormProps {
  segmentId: Id<"segments">;
  onSuccess?: () => void;
}

export default function StoryOverview() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.storyId as Id<"story">;

  const story = useQuery(api.story.getStory, { storyId: storyId });
  const segments =
    useQuery(api.segments.getSegments, { storyId: storyId }) || [];

  const sortedSegments = useMemo(() => {
    return [...segments].sort((a, b) => a.order - b.order);
  }, [segments]);

  const updateStoryContext = useMutation(api.story.updateStoryContext);
  const handleContextUpdate = async (newContext: string) => {
    await updateStoryContext({
      storyId,
      context: newContext,
    });
  };

  const steps = [
    { number: 1, text: "Select Mode" },
    { number: 2, text: "Prompt" },
    { number: 3, text: "Refine" },
    { number: 4, text: "Customize" },
  ];
  const currentStep = 4;

  if (story === undefined) {
    return <LoadingState />;
  }

  if (story === null) {
    return <div>Story not found</div>;
  }

  const isVertical = story.isVertical ?? false;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-8 sm:pt-12 pb-6 space-y-6 sm:space-y-8 px-4">
        <h1 className="font-medium text-center text-3xl sm:text-4xl lg:text-5xl text-primary/80">
          Customize Your Story
        </h1>

        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>
      <div className="flex-1 px-4 py-6 space-y-8">
        <div className="container mx-auto">
          <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="w-full">
                <Button
                  onClick={() => router.push("/stories")}
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-primary/60 hover:text-primary hover:bg-primary/5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Your Stories
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex flex-wrap items-center gap-2 flex-grow min-w-0">
                  <StoryTitle title={story.title} storyId={storyId} />
                  <OrientationBadge isVertical={isVertical} />
                </div>
                <div className="w-full sm:w-auto">
                  <EditImageContext
                    context={story?.context ?? ""}
                    onContextUpdate={handleContextUpdate}
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                {sortedSegments.map((segment) => (
                  <div key={segment._id} className="relative">
                    <SegmentCard
                      segment={segment}
                      isVertical={story.isVertical ?? false}
                    />
                    <div className="absolute right-[-16px] top-1/3 -translate-y-1/2 z-10">
                      <AddSegmentButton
                        storyId={storyId}
                        insertAfterOrder={segment.order}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ActionButtons storyId={storyId} isVertical={isVertical} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-primary/60">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/60 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium animate-pulse">Loading story...</p>
      </div>
    </div>
  );
}

function StoryTitle({ title, storyId }: StoryTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const updateStory = useMutation(api.story.updateStory);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const trimmedTitle = newTitle.trim();
    if (trimmedTitle && trimmedTitle !== title) {
      await updateStory({ storyId, title: trimmedTitle });
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="group relative inline-flex items-center gap-2">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setNewTitle(title);
              setIsEditing(false);
            }
          }}
          className="min-w-[200px] h-9 text-2xl font-bold bg-transparent border-none px-0 hover:bg-gray-50/50"
          placeholder="Please enter a title"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-2xl font-bold hover:text-primary/80 flex items-center gap-2"
        >
          <span>{title}</span>
          <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}
    </div>
  );
}

function OrientationBadge({ isVertical }: { isVertical: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-purple-700/50 text-purple-200">
      {isVertical ? (
        <Smartphone className="h-3 w-3" />
      ) : (
        <Monitor className="h-3 w-3" />
      )}
      {isVertical ? "Vertical" : "Horizontal"}
    </span>
  );
}

function EditImageContext({ context, onContextUpdate }: EditImageContextProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editedContext, setEditedContext] = useState(context);

  const handleSave = () => {
    if (!onContextUpdate) return;

    startTransition(async () => {
      try {
        await onContextUpdate(editedContext);
        toast({
          title: "Success",
          description: "Image context updated successfully",
          variant: "default",
          className:
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100",
        });
        setIsOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to update context",
          variant: "destructive",
          className:
            "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
        });
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <Pencil className="h-4 w-4 mr-2" />
        <span>Edit Image Context</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Edit Image Generation Context
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              This context helps guide the AI in generating images that match
              your story's atmosphere and style.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="context"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Context
              </Label>
              <Textarea
                id="context"
                value={editedContext}
                onChange={(e) => setEditedContext(e.target.value)}
                placeholder="Enter context for image generation..."
                className="min-h-[200px] resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The context includes key scenes, main characters, overall
                atmosphere, visual elements, and emotional tone of your story.
              </p>
            </div>
          </div>

          <DialogFooter className="sm:flex-row gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending || editedContext === context}
              className="w-full sm:w-auto bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SegmentCard({ segment, isVertical }: SegmentCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [currentText, setCurrentText] = useState(segment.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateSegment = useMutation(api.segments.updateSegmentText);

  const generateImage = useMutation(api.segments.generateImage);

  const handleGenerateImage = useCallback(async () => {
    try {
      await generateImage({
        segmentId: segment._id,
      });
      toast({
        title: "开始生成",
        description: "AI 正在为您生成图片",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "生成图片失败",
        variant: "destructive",
      });
    }
  }, [generateImage, segment._id]);

  useEffect(() => {
    setCurrentText(segment.text);
    if (textareaRef.current) {
      textareaRef.current.value = segment.text;
    }
  }, [segment.text]);

  const previewImageUrl = useQuery(
    api.segments.getImageUrl,
    segment.previewImage ? { storageId: segment.previewImage } : "skip",
  );

  const currentWordCount = useMemo(() => {
    return countWordsAndCharacters(currentText).wordCount;
  }, [currentText]);

  const debouncedUpdate = useCallback(
    debounce(async (text: string) => {
      try {
        if (text === segment.text) return;
        setIsSaving(true);
        await updateSegment({
          segmentId: segment._id,
          text,
        });
      } catch (error) {
        toast({
          title: "错误",
          description: error instanceof Error ? error.message : "保存失败",
          variant: "destructive",
          duration: 3000,
        });
        // 恢复到服务器的值
        setCurrentText(segment.text);
        if (textareaRef.current) {
          textareaRef.current.value = segment.text;
        }
      } finally {
        setIsSaving(false);
      }
    }, 500),
    [segment._id, segment.text, updateSegment],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      if (text.length <= 750) {
        setCurrentText(text); // 立即更新当前文本
        debouncedUpdate(text); // 触发延迟保存
      }
    },
    [debouncedUpdate],
  );

  return (
    <div className="relative rounded-xl border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200 dark:border-gray-700">
      {segment.isGenerating && (
        <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/20 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-gray-900 dark:text-gray-100">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm font-medium">AI is generating...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Segment {segment.order + 1}
        </h3>
        <SegmentOptionsMenu
          segmentId={segment._id}
          hasImage={!!segment.previewImage}
        />
      </div>

      <div className="relative h-64 bg-gray-50 dark:bg-gray-900">
        {previewImageUrl ? (
          <div
            className={cn(
              "relative h-full flex items-center justify-center",
              isVertical ? "px-12" : "px-4 py-6",
            )}
          >
            <div
              className={cn(
                "relative",
                isVertical ? "h-full aspect-[9/16]" : "w-full aspect-[16/9]",
              )}
            >
              <Image
                src={previewImageUrl}
                alt={`Segment ${segment.order + 1} image`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={segment.order < 3}
              />
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 dark:bg-white/20 rounded text-white dark:text-gray-100 text-xs">
              {isVertical ? "9:16" : "16:9"}
            </div>
          </div>
        ) : (
          <ImageGeneratingState
            onGenerate={segment.isGenerating ? undefined : handleGenerateImage}
            disabled={!currentText.trim()}
          />
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <textarea
            ref={textareaRef}
            className="w-full h-44 p-4 text-sm bg-transparent border rounded-lg resize-none text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
            defaultValue={segment.text}
            onChange={handleTextChange}
            placeholder="输入段落内容..."
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs">
            {isSaving && (
              <span className="text-blue-500 dark:text-blue-400 flex items-center">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                保存中...
              </span>
            )}
            <span
              className={`${
                currentWordCount > 750
                  ? "text-red-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {currentWordCount} / 750
            </span>
          </div>
        </div>
      </div>

      {segment.error && (
        <div className="p-4 border-t border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{segment.error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageGeneratingState({
  onGenerate,
  disabled,
}: {
  onGenerate?: () => void;
  disabled?: boolean;
}) {
  // 如果没有 onGenerate，说明是生成中状态
  const isGenerating = !onGenerate;

  return (
    <div className="flex items-center justify-center h-full">
      <Button
        variant="outline"
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className="gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>正在生成图片...</span>
          </>
        ) : (
          <>
            <ImageIcon className="h-4 w-4" />
            <span>Generate Image (10 credits)</span>
          </>
        )}
      </Button>
    </div>
  );
}

interface SegmentOptionsMenuProps {
  segmentId: Id<"segments">;
  hasImage: boolean;
}

function SegmentOptionsMenu({ segmentId, hasImage }: SegmentOptionsMenuProps) {
  const [isPending, startTransition] = useTransition();
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);

  const deleteSegment = useMutation(api.segments.deleteSegment);
  const regenerateImage = useMutation(api.segments.regenerateImage);
  const refineText = useMutation(api.segments.refineText);

  const handleRefineText = () => {
    startTransition(async () => {
      try {
        await refineText({ segmentId });
        toast({
          title: "Success",
          description: "Refine Text Success",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Refine Text Failed",
          variant: "destructive",
        });
      }
    });
  };

  const handleRegenerate = () => {
    startTransition(async () => {
      try {
        await regenerateImage({ segmentId });
        toast({
          title: "Success",
          description: "Image Regenerate Request Sent",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Image Regenerate Failed",
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteSegment({ segmentId });
        toast({
          title: "Success",
          description: "Segment Deleted",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Delete Segment Failed",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            aria-label="Segment Options"
            className="h-8 w-8 p-0 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[350px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <DropdownMenuItem
            onClick={handleRefineText}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            disabled={isPending}
          >
            <Pencil className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Refine Text</span>
          </DropdownMenuItem>

          {hasImage && (
            <>
              <DropdownMenuItem
                onClick={handleRegenerate}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                disabled={isPending}
              >
                <Wand2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  Auto Regenerate Image (10 credits)
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setIsPromptDialogOpen(true)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                disabled={isPending}
              >
                <ImageIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Change Image Prompt</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-600 dark:focus:text-red-400 text-sm"
            disabled={isPending}
          >
            <Trash className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Delete Segment</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Change Prompt</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Modify the prompt used for generating your segment image.
            </DialogDescription>
          </DialogHeader>
          <EditImagePromptForm
            segmentId={segmentId}
            onSuccess={() => setIsPromptDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditImagePromptForm({
  segmentId,
  onSuccess,
}: EditImagePromptFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const savePrompt = useMutation(api.segments.savePrompt);
  const regenerateImage = useMutation(api.segments.regenerateImage);
  const segment = useQuery(api.segments.get, { segmentId });

  const handleRegenerate = useCallback(() => {
    startTransition(async () => {
      try {
        await regenerateImage({
          segmentId,
        });
        toast({
          title: "成功",
          description: "正在重新生成图片",
          duration: 3000,
        });
        onSuccess?.();
      } catch (error) {
        toast({
          title: "错误",
          description:
            error instanceof Error ? error.message : "重新生成图片失败",
          variant: "destructive",
          duration: 5000,
        });
      }
    });
  }, [regenerateImage, segmentId, onSuccess]);

  const debouncedUpdate = useCallback(
    debounce(async (value: string) => {
      if (value === segment?.prompt) return;
      try {
        setIsSaving(true); // 移到这里
        await savePrompt({
          segmentId,
          prompt: value,
        });
      } catch (error) {
        toast({
          title: "错误",
          description: "提示词保存失败，请重试",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsSaving(false);
      }
    }, 800),
    [segmentId, savePrompt, segment?.prompt],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      debouncedUpdate(e.target.value); // 移除这里的 setIsSaving
    },
    [debouncedUpdate],
  );

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <label
              htmlFor="prompt"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Prompt
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              描述你想要生成的图片内容和风格
            </p>
          </div>
          {isSaving && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              保存中...
            </span>
          )}
        </div>
        <Textarea
          id="prompt"
          className="min-h-[100px] resize-y bg-white dark:bg-gray-800 
            border-gray-200 dark:border-gray-700 
            text-gray-900 dark:text-gray-100
            focus:ring-blue-500 dark:focus:ring-blue-400
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
          disabled={isPending}
          defaultValue={segment?.prompt ?? ""}
          onChange={handlePromptChange}
        />
      </div>

      <DialogFooter className="sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleRegenerate}
          disabled={isPending || !segment?.prompt || isSaving}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Regenerate (10 credits)
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

function AddSegmentButton({
  storyId,
  insertAfterOrder,
}: {
  storyId: Id<"story">;
  insertAfterOrder: number;
}) {
  const addSegment = useMutation(api.segments.addSegment);
  const [isPending, startTransition] = useTransition();

  const handleAddSegment = () => {
    startTransition(async () => {
      try {
        await addSegment({
          storyId,
          insertAfterOrder, // 传入顺序
        });
        toast({
          title: "成功",
          description: "已添加新段落，请输入内容",
        });
      } catch (error) {
        toast({
          title: "错误",
          description: error instanceof Error ? error.message : "添加段落失败",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Button
      onClick={handleAddSegment}
      disabled={isPending}
      className="z-40 h-7 w-7 rounded-full p-0
        bg-blue-600 dark:bg-blue-500
        hover:bg-blue-700 dark:hover:bg-blue-600
        text-white
        shadow-sm hover:shadow-md
        transition-all duration-200
        border border-white dark:border-gray-800"
      aria-label="添加新段落"
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}

function ActionButtons({
  storyId,
  isVertical,
}: {
  storyId: Id<"story">;
  isVertical: boolean;
}) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isGrammarDialogOpen, setIsGrammarDialogOpen] = useState(false);
  const [isReadDialogOpen, setIsReadDialogOpen] = useState(false);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  const buttonBaseClass = `
    bg-white dark:bg-gray-800 
    text-gray-800 dark:text-gray-200 
    border-gray-200 dark:border-gray-700
    hover:bg-gray-100 dark:hover:bg-gray-700
    hover:text-gray-900 dark:hover:text-gray-100
    transition-colors duration-200
  `;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg mt-8">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
          <Button
            onClick={() => setIsReviewDialogOpen(true)}
            variant="outline"
            className={buttonBaseClass}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Review Story
          </Button>
          <Button
            onClick={() => setIsGrammarDialogOpen(true)}
            variant="outline"
            className={buttonBaseClass}
          >
            <SpellCheck className="w-4 h-4 mr-2" />
            Quick Grammar Check
          </Button>
          <Button
            onClick={() => setIsReadDialogOpen(true)}
            variant="outline"
            className={buttonBaseClass}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Read Full Story
          </Button>
          <Button
            onClick={() => setIsCloneDialogOpen(true)}
            variant="outline"
            className={buttonBaseClass}
          >
            <Copy className="w-4 h-4 mr-2" />
            Clone to {isVertical ? "Horizontal" : "Vertical"}
          </Button>
          <Button
            onClick={() => setIsVideoDialogOpen(true)}
            variant="default"
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white border-transparent"
          >
            <Video className="w-4 h-4 mr-2" />
            Generate Video
          </Button>
        </div>
      </div>
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        setIsOpen={setIsReviewDialogOpen}
        storyId={storyId}
      />
      <GrammarDialog
        isOpen={isGrammarDialogOpen}
        setIsOpen={setIsGrammarDialogOpen}
        storyId={storyId}
      />
      <ReadDialog
        isOpen={isReadDialogOpen}
        setIsOpen={setIsReadDialogOpen}
        storyId={storyId}
      />
      <CloneDialog
        isOpen={isCloneDialogOpen}
        setIsOpen={setIsCloneDialogOpen}
        storyId={storyId}
        isVertical={isVertical}
      />
      <VideoDialog
        isOpen={isVideoDialogOpen}
        setIsOpen={setIsVideoDialogOpen}
        storyId={storyId}
      />
    </div>
  );
}

function ReviewDialog({
  isOpen,
  setIsOpen,
  storyId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  storyId: Id<"story">;
}) {
  const story = useQuery(api.story.getStory, { storyId });
  const review = useQuery(api.story.getReview, { storyId });
  const [isReviewing, setIsReviewing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const reviewStory = useMutation(api.story.reviewStory);
  const applyRevisions = useMutation(api.story.applyRevisions);

  const isProcessing =
    isReviewing || isApplying || story?.status === "processing";

  const handleReview = async () => {
    setIsReviewing(true);
    try {
      await reviewStory({ storyId });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      setIsReviewing(false);
    }
  };

  const handleApplyRevisions = async () => {
    if (!review) return;

    setIsApplying(true);
    try {
      await applyRevisions({ storyId });
      toast({
        title: "Applying Revisions",
        description: "AI is improving your story based on the review...",
      });
    } catch (error) {
      toast({
        title: "Failed to Apply Revisions",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      setIsApplying(false);
    }
  };

  useEffect(() => {
    if (story?.status === "completed") {
      // 清除所有加载状态
      setIsReviewing(false);
      setIsApplying(false);

      // 根据之前的状态显示对应的成功提示
      if (isApplying) {
        toast({
          title: "Revisions Applied",
          description: "Your story has been successfully updated",
        });
      }
    }

    if (story?.status === "error") {
      setIsReviewing(false);
      setIsApplying(false);
      toast({
        title: "Error",
        description: "Failed to process the story",
        variant: "destructive",
      });
    }
  }, [story?.status]);

  if (!story) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Story Review
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Use AI to review your story and get feedback
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="font-medium text-lg">
                  {isApplying ? "Applying Revisions" : "Analyzing Your Story"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isApplying
                    ? "AI is improving your story based on the review..."
                    : "Our AI reviewer is carefully evaluating your story..."}
                </p>
                <div className="text-xs text-muted-foreground/70 animate-pulse">
                  This may take a minute
                </div>
              </div>
            </div>
          ) : review ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-6 mb-4 text-primary">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mt-8 mb-3 border-b border-border pb-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => {
                      const text = String(children);
                      const hasScore = text.includes("/10");
                      return (
                        <h3
                          className={`text-lg font-medium mt-6 mb-2 flex items-center gap-2 ${hasScore ? "text-primary" : ""}`}
                        >
                          {hasScore ? (
                            <>
                              <span>{text.split(" (")[0]}</span>
                              <span className="text-primary font-bold">
                                ({text.split(" (")[1]}
                              </span>
                            </>
                          ) : (
                            children
                          )}
                        </h3>
                      );
                    },
                    ul: ({ children }) => (
                      <ul className="space-y-2 my-3">{children}</ul>
                    ),
                    li: ({ children }) => {
                      const text = String(children);
                      if (text.startsWith("✓")) {
                        return (
                          <li className="flex items-baseline gap-3 text-emerald-500 dark:text-emerald-400">
                            <span className="flex-shrink-0">
                              {text.slice(0, 1)}
                            </span>
                            <span>{text.slice(1)}</span>
                          </li>
                        );
                      }
                      if (text.startsWith("△")) {
                        return (
                          <li className="flex items-baseline gap-3 text-amber-500 dark:text-amber-400">
                            <span className="flex-shrink-0">
                              {text.slice(0, 1)}
                            </span>
                            <span>{text.slice(1)}</span>
                          </li>
                        );
                      }
                      if (text.startsWith("•")) {
                        return (
                          <li className="flex items-baseline gap-3 ml-4">
                            <span className="flex-shrink-0">
                              {text.slice(0, 1)}
                            </span>
                            <span className="text-muted-foreground">
                              {text.slice(1)}
                            </span>
                          </li>
                        );
                      }
                      return (
                        <li className="flex items-baseline gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {children}
                          </span>
                        </li>
                      );
                    },
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-3 mt-4">
                        {children}
                      </ol>
                    ),
                    p: ({ children }) => (
                      <p className="my-3 text-muted-foreground leading-relaxed">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {review}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <TriangleAlert className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-1">No Review Available</h3>
              <p className="text-sm text-muted-foreground">
                Click the "Generate Review" button to generate feedback
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-end gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            disabled={isProcessing}
          >
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleReview}
              disabled={isProcessing}
              className="min-w-[140px]"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Review
              <span className="ml-1 text-xs opacity-70">(1 credit)</span>
            </Button>
            <Button
              onClick={handleApplyRevisions}
              disabled={isProcessing || !review}
              className="min-w-[140px]"
              variant="default"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Apply Revisions
              <span className="ml-1 text-xs opacity-70">(10 credits)</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GrammarDialog({
  isOpen,
  setIsOpen,
  storyId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  storyId: Id<"story">;
}) {
  const [isFixing, setIsFixing] = useState(false);
  const fixGrammar = useMutation(api.story.fixGrammar);
  const story = useQuery(api.story.getStory, { storyId });

  // 监听故事状态
  useEffect(() => {
    if (story?.status === "completed" && isFixing) {
      setIsFixing(false);
      setIsOpen(false);
      toast({
        description: "Grammar and spelling have been corrected",
      });
    } else if (story?.status === "error" && isFixing) {
      setIsFixing(false);
      toast({
        description: "Failed to fix grammar and spelling",
        variant: "destructive",
      });
    }
  }, [story?.status, isFixing]);

  const handleFixGrammar = async () => {
    try {
      setIsFixing(true);
      await fixGrammar({ storyId });
      // 不要立即关闭对话框，等待状态更新
    } catch (error) {
      setIsFixing(false);
      toast({
        description: "Failed to start grammar check",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isFixing && setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Grammar Check</DialogTitle>
          <DialogDescription>
            Automatically correct basic spelling and grammar errors in all
            segments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-muted-foreground text-sm">
          <p>This quick fix will:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Fix spelling mistakes</li>
            <li>Correct basic grammar errors</li>
            <li>Fix punctuation issues</li>
          </ul>
          <div className="text-xs space-y-2">
            <p className="italic">
              Note: For more comprehensive improvements, use the "Review &
              Apply" feature.
            </p>
            <p className="text-yellow-500">This action requires 2 credits.</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            disabled={isFixing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFixGrammar}
            disabled={isFixing || story?.status === "processing"}
            className="gap-2"
          >
            {isFixing || story?.status === "processing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {story?.status === "processing"
                  ? "Processing..."
                  : "Starting..."}
              </>
            ) : (
              <>
                <SpellCheck className="h-4 w-4" />
                Quick Fix
              </>
            )}
            <span className="ml-1 text-xs opacity-70">(2 credits)</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ReadDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  storyId: Id<"story">;
}

function ReadDialog({ isOpen, setIsOpen, storyId }: ReadDialogProps) {
  const story = useQuery(api.story.getStory, { storyId });
  const segments = useQuery(api.segments.getSegments, { storyId }) || [];
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = segments.map((segment) => segment.text).join("\n\n");
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      toast({
        description: "Content copied to clipboard",
      });
      // 短暂显示成功状态后重置
      setTimeout(() => setHasCopied(false), 1000);
    } catch (error) {
      toast({
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  if (!story) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={cn("max-w-4xl", story.isVertical && "sm:max-w-2xl")}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {story.title}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {segments.map((segment) => (
              <SegmentContent
                key={segment._id}
                segment={segment}
                isVertical={story.isVertical}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleCopy}
          >
            {hasCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {hasCopied ? "Copied!" : "Copy to Clipboard"}
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SegmentContent({
  segment,
  isVertical,
}: {
  segment: Doc<"segments">;
  isVertical?: boolean;
}) {
  const imageUrl = useQuery(
    api.segments.getImageUrl,
    segment.previewImage ? { storageId: segment.previewImage } : "skip",
  );

  return (
    <div className="mb-6 leading-relaxed">
      <p className="text-base">{segment.text}</p>
      {imageUrl && (
        <div
          className={cn(
            "mt-4 rounded-lg overflow-hidden",
            isVertical && "flex justify-center",
          )}
        >
          <Image
            src={imageUrl}
            alt={segment.text.slice(0, 50)}
            width={isVertical ? 450 : 800}
            height={isVertical ? 800 : 450}
            className={cn(
              "object-cover rounded-lg",
              isVertical ? "max-w-[450px] w-full" : "w-full",
            )}
          />
        </div>
      )}
    </div>
  );
}

function CloneDialog({
  isOpen,
  setIsOpen,
  storyId,
  isVertical,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  storyId: Id<"story">;
  isVertical: boolean;
}) {
  const [isCloning, setIsCloning] = useState(false);
  const cloneStory = useMutation(api.story.cloneStory);
  const segments = useQuery(api.segments.getSegments, { storyId });
  const credits = useQuery(api.credits.getCredits); // [新增] 获取积分信息
  const router = useRouter();

  // [新增] 计算积分和检查状态
  const requiredCredits = segments?.length ? segments.length * 10 : 0;
  const hasEnoughCredits = !!credits && credits.remaining >= requiredCredits;

  const handleClone = async () => {
    if (!hasEnoughCredits) {
      // [新增] 积分检查
      toast({
        description: "Insufficient credits",
        variant: "destructive",
      });
      return;
    }

    setIsCloning(true);
    try {
      const { newStoryId } = await cloneStory({
        storyId,
        newOrientation: !isVertical,
      });

      // [新增] 成功提示更详细
      toast({
        description:
          "Story cloned successfully! Redirecting to the new story...",
      });

      setIsOpen(false);
      router.push(`/stories/${newStoryId}`);
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "Failed to clone story",
        variant: "destructive",
      });
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isCloning && setIsOpen(open)} // 防止处理中关闭
    >
      <DialogContent className="sm:max-w-md">
        {" "}
        {/* [新增] 限制宽度 */}
        <DialogHeader>
          <DialogTitle>Clone Story</DialogTitle>
          <DialogDescription>
            Create a new {isVertical ? "horizontal" : "vertical"} version while
            keeping all content.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-muted-foreground text-sm">
          <p>This will:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Create a new story with {isVertical ? "16:9" : "9:16"} ratio
            </li>
            <li>Copy all text content</li>
            <li>
              Generate new images optimized for{" "}
              {isVertical ? "horizontal" : "vertical"} layout
            </li>
          </ul>

          {/* [新增] 积分显示优化 */}
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Required Credits:</p>
              <p className="text-sm">{requiredCredits}</p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm font-medium">Your Credits:</p>
              <p
                className={cn(
                  "text-sm",
                  !hasEnoughCredits && "text-destructive",
                )}
              >
                {credits?.remaining || 0}
              </p>
            </div>
            {!hasEnoughCredits && (
              <p className="text-destructive text-xs mt-2">
                Insufficient credits. You need{" "}
                {requiredCredits - (credits?.remaining || 0)} more credits.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            disabled={isCloning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleClone}
            disabled={isCloning || !hasEnoughCredits} // [修改] 添加积分检查
            className="gap-2"
          >
            {isCloning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Clone...
              </>
            ) : !hasEnoughCredits ? ( // [新增] 积分不足状态
              <>
                <AlertCircle className="h-4 w-4" />
                Insufficient Credits
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Clone to {isVertical ? "Horizontal" : "Vertical"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const voiceOptions = [
  {
    id: "male-qn-qingse",
    name: "青涩青年音色",
    samplePath: "/audio-samples/male-qn-qingse.mp3",
  },
  {
    id: "male-qn-jingying",
    name: "精英青年音色",
    samplePath: "/audio-samples/male-qn-jingying.mp3",
  },
  {
    id: "male-qn-badao",
    name: "霸道青年音色",
    samplePath: "/audio-samples/male-qn-badao.mp3",
  },
  {
    id: "male-qn-daxuesheng",
    name: "青年大学生音色",
    samplePath: "/audio-samples/male-qn-daxuesheng.mp3",
  },
];

interface VideoDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  storyId: Id<"story">;
}

export function VideoDialog({ isOpen, setIsOpen, storyId }: VideoDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceId, setVoiceId] = useState(voiceOptions[0]?.id || "");
  const [includeWatermark, setIncludeWatermark] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isLaxSpacing, setIsLaxSpacing] = useState(false);
  const [includeCaptions, setIncludeCaptions] = useState(true);
  const [captionPosition, setCaptionPosition] = useState("bottom");
  const [highlightColor, setHighlightColor] = useState("yellow");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudioPreview = () => {
    const selectedVoice = voiceOptions.find((voice) => voice.id === voiceId);
    if (!selectedVoice) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = selectedVoice.samplePath;
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const generateAudioAndTranscription = useAction(
    api.videos.generateAudioAndTranscription,
  );

  const router = useRouter();

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAudioAndTranscription({
        storyId,
        voiceId,
      });
      setIsOpen(false); // 关闭对话框
      // 重定向到视频生成进度页面
      router.push(`/videos/${storyId}`);
    } catch (error) {
      console.error("Audio generation failed:", error);
      toast({
        title: "Audio generation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 计算所需的信用点数
  const calculateCredits = useMemo(() => {
    const basePrice = 100;
    return includeWatermark ? Math.round(basePrice * 0.2) : basePrice; // 80% off if watermark is included
  }, [includeWatermark]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white border-2 border-gray-200 shadow-lg text-black max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Generate Video</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Select value={voiceId} onValueChange={setVoiceId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="icon" onClick={playAudioPreview}>
              {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <audio
            ref={audioRef}
            onEnded={handleAudioEnded}
            style={{ display: "none" }}
          />

          <div className="flex items-center justify-between">
            <label
              htmlFor="includeWatermark"
              className="text-sm font-medium leading-none"
            >
              Include a watermark to help promote us for 80% off
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={includeWatermark}
              onClick={() => setIncludeWatermark(!includeWatermark)}
              className={`peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                includeWatermark ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  includeWatermark ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="isPublic"
              className="text-sm font-medium leading-none"
            >
              Make video public
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              onClick={() => setIsPublic(!isPublic)}
              className={`peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                isPublic ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  isPublic ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="isLaxSpacing"
              className="text-sm font-medium leading-none"
            >
              Use lax spacing
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={isLaxSpacing}
              onClick={() => setIsLaxSpacing(!isLaxSpacing)}
              className={`peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                isLaxSpacing ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  isLaxSpacing ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="includeCaptions"
              className="text-sm font-medium leading-none"
            >
              Include captions
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={includeCaptions}
              onClick={() => setIncludeCaptions(!includeCaptions)}
              className={`peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                includeCaptions ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  includeCaptions ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {includeCaptions && (
            <>
              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Caption Position
                </label>
                <Select
                  value={captionPosition}
                  onValueChange={setCaptionPosition}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select caption position" />
                  </SelectTrigger>
                  <SelectContent>
                    {["top", "mid upper", "mid lower", "bottom"].map(
                      (position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Highlight Color
                </label>
                <Select
                  value={highlightColor}
                  onValueChange={setHighlightColor}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select highlight color" />
                  </SelectTrigger>
                  <SelectContent>
                    {["yellow", "blue", "red", "green"].map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerateVideo}
            disabled={isGenerating}
            className="items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-9 py-2 flex gap-2 justify-center px-3"
          >
            {isGenerating
              ? "Generating..."
              : `Generate (${calculateCredits} credits)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
