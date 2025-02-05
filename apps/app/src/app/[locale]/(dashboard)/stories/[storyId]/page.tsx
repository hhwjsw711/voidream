"use client";

import { useScopedI18n } from "@/locales/client";
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
import { toast, useToast } from "@v1/ui/use-toast";
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
  RotateCcw,
  Save,
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
  const t = useScopedI18n("story.overview");
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
    { number: 1, text: t("steps.step1") },
    { number: 2, text: t("steps.step2") },
    { number: 3, text: t("steps.step3") },
    { number: 4, text: t("steps.step4") },
  ];
  const currentStep = 4;

  if (story === undefined) {
    return <LoadingState />;
  }

  if (story === null) {
    return <div>{t("notFound")}</div>;
  }

  const isVertical = story.isVertical ?? false;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-8 sm:pt-12 pb-6 space-y-6 sm:space-y-8 px-4">
        <h1 className="font-medium text-center text-3xl sm:text-4xl lg:text-5xl text-primary/80">
          {t("title")}
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
                  {t("backToStories")}
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
  const t = useScopedI18n("story.overview");
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-primary/60">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/60 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium animate-pulse">{t("loading")}</p>
      </div>
    </div>
  );
}

function StoryTitle({ title, storyId }: StoryTitleProps) {
  const t = useScopedI18n("story.overview.storyTitle");
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const updateStory = useMutation(api.story.updateStory);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const trimmedTitle = newTitle.trim();
    if (trimmedTitle && trimmedTitle !== title) {
      try {
        await updateStory({ storyId, title: trimmedTitle });
        toast({
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });
      } catch (error) {
        toast({
          title: t("toast.error.title"),
          description: t("toast.error.description"),
          variant: "destructive",
        });
        setNewTitle(title); // 恢复原标题
      }
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
          placeholder={t("placeholder")}
          aria-label={t("edit")}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-2xl font-bold hover:text-primary/80 flex items-center gap-2"
          aria-label={t("edit")}
        >
          <span>{title}</span>
          <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}
    </div>
  );
}

function OrientationBadge({ isVertical }: { isVertical: boolean }) {
  const t = useScopedI18n("story.orientation");

  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-purple-700/50 text-purple-200">
      {isVertical ? (
        <Smartphone className="h-3 w-3" />
      ) : (
        <Monitor className="h-3 w-3" />
      )}
      {isVertical ? t("vertical") : t("horizontal")}
    </span>
  );
}

function EditImageContext({ context, onContextUpdate }: EditImageContextProps) {
  const t = useScopedI18n("story.imageContext");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editedContext, setEditedContext] = useState(context);

  const handleSave = () => {
    if (!onContextUpdate) return;

    startTransition(async () => {
      try {
        await onContextUpdate(editedContext);
        toast({
          title: t("toast.success.title"),
          description: t("toast.success.description"),
          variant: "default",
          className:
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100",
        });
        setIsOpen(false);
      } catch (error) {
        toast({
          title: t("toast.error.title"),
          description:
            error instanceof Error
              ? error.message
              : t("toast.error.description"),
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
        <span>{t("button")}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t("dialog.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              {t("dialog.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="context"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("dialog.label")}
              </Label>
              <Textarea
                id="context"
                value={editedContext}
                onChange={(e) => setEditedContext(e.target.value)}
                placeholder={t("dialog.placeholder")}
                className="min-h-[200px] resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("dialog.help")}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <div className="flex space-x-4">
              <Button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {t("dialog.buttons.cancel")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isPending || editedContext === context}
                className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2 min-w-[140px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("dialog.buttons.saving")}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t("dialog.buttons.save")}
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SegmentCard({ segment, isVertical }: SegmentCardProps) {
  const t = useScopedI18n("story.segment.card");
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
        title: t("image.generate.toast.start.title"),
        description: t("image.generate.toast.start.description"),
      });
    } catch (error) {
      toast({
        title: t("image.generate.toast.error.title"),
        description:
          error instanceof Error
            ? error.message
            : t("image.generate.toast.error.description"),
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
          title: t("text.toast.error.title"),
          description:
            error instanceof Error
              ? error.message
              : t("text.toast.error.description"),
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
    [segment._id, segment.text, updateSegment, t],
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
      } else {
        toast({
          title: t("text.toast.error.title"),
          description: t("text.maxLength"),
          variant: "destructive",
        });
      }
    },
    [debouncedUpdate, t],
  );

  return (
    <div className="relative rounded-xl border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200 dark:border-gray-700">
      {segment.isGenerating && (
        <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/20 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-gray-900 dark:text-gray-100">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm font-medium">{t("generating")}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {t("title", { order: segment.order + 1 })}
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
                alt={t("image.alt", { order: segment.order + 1 })}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={segment.order < 3}
              />
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 dark:bg-white/20 rounded text-white dark:text-gray-100 text-xs">
              {isVertical
                ? t("aspectRatio.vertical")
                : t("aspectRatio.horizontal")}
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
            placeholder={t("placeholder")}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs">
            {isSaving && (
              <span className="text-blue-500 dark:text-blue-400 flex items-center">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                {t("saving")}
              </span>
            )}
            <span
              className={cn(
                currentWordCount > 750
                  ? "text-red-500"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              {t("wordCount", { count: currentWordCount })}
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
  const t = useScopedI18n("story.segment.imageGeneration");
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
            <span>{t("button.generating")}</span>
          </>
        ) : (
          <>
            <ImageIcon className="h-4 w-4" />
            <span>{t("button.generate")}</span>
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
  const t = useScopedI18n("story.segment.menu");
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
          title: t("items.refineText.toast.success.title"),
          description: t("items.refineText.toast.success.description"),
        });
      } catch (error) {
        toast({
          title: t("items.refineText.toast.error.title"),
          description:
            error instanceof Error
              ? error.message
              : t("items.refineText.toast.error.description"),
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
          title: t("items.regenerateImage.toast.success.title"),
          description: t("items.regenerateImage.toast.success.description"),
        });
      } catch (error) {
        toast({
          title: t("items.regenerateImage.toast.error.title"),
          description:
            error instanceof Error
              ? error.message
              : t("items.regenerateImage.toast.error.description"),
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
          title: t("items.delete.toast.success.title"),
          description: t("items.delete.toast.success.description"),
        });
      } catch (error) {
        toast({
          title: t("items.delete.toast.error.title"),
          description:
            error instanceof Error
              ? error.message
              : t("items.delete.toast.error.description"),
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
            aria-label={t("trigger.label")}
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
            <span className="truncate">{t("items.refineText.label")}</span>
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
                  {t("items.regenerateImage.label")}
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setIsPromptDialogOpen(true)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                disabled={isPending}
              >
                <ImageIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {t("items.changePrompt.label")}
                </span>
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
            <span className="truncate">{t("items.delete.label")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>{t("items.changePrompt.dialog.title")}</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {t("items.changePrompt.dialog.description")}
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
  const t = useScopedI18n("story.segment.promptForm");
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
          title: t("toast.regenerate.success.title"),
          description: t("toast.regenerate.success.description"),
          duration: 3000,
        });
        onSuccess?.();
      } catch (error) {
        toast({
          title: t("toast.regenerate.error.title"),
          description:
            error instanceof Error
              ? error.message
              : t("toast.regenerate.error.description"),
          variant: "destructive",
          duration: 5000,
        });
      }
    });
  }, [regenerateImage, segmentId, onSuccess, t]);

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
          title: t("toast.save.error.title"),
          description: t("toast.save.error.description"),
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsSaving(false);
      }
    }, 800),
    [segmentId, savePrompt, segment?.prompt, t],
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
              {t("label")}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("description")}
            </p>
          </div>
          {isSaving && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              {t("saving")}
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

      <DialogFooter className="mt-8">
        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={() => onSuccess?.()}
            disabled={isPending}
            className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleRegenerate}
            disabled={isPending || !segment?.prompt || isSaving}
            className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("buttons.regenerate.pending")}
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                {t("buttons.regenerate.default")}
                <span className="ml-1 text-xs opacity-70">
                  (10 {t("buttons.regenerate.credits")})
                </span>
              </>
            )}
          </Button>
        </div>
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
  const t = useScopedI18n("story.segment.addButton");
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
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });
      } catch (error) {
        toast({
          title: t("toast.error.title"),
          description:
            error instanceof Error
              ? error.message
              : t("toast.error.description"),
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
      aria-label={t("label")}
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
  const t = useScopedI18n("story.actions");
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
            {t("review.label")}
          </Button>
          <Button
            onClick={() => setIsGrammarDialogOpen(true)}
            variant="outline"
            className={buttonBaseClass}
          >
            <SpellCheck className="w-4 h-4 mr-2" />
            {t("grammar.label")}
          </Button>
          <Button
            onClick={() => setIsReadDialogOpen(true)}
            variant="outline"
            className={buttonBaseClass}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {t("read.label")}
          </Button>
          <Button
            onClick={() => setIsCloneDialogOpen(true)}
            variant="outline"
            className={buttonBaseClass}
          >
            <Copy className="w-4 h-4 mr-2" />
            {isVertical
              ? t("clone.label.toHorizontal")
              : t("clone.label.toVertical")}
          </Button>
          <Button
            onClick={() => setIsVideoDialogOpen(true)}
            variant="default"
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white border-transparent"
          >
            <Video className="w-4 h-4 mr-2" />
            {t("video.label")}
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
  const t = useScopedI18n("story.actions.review.dialog");
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
        title: t("toast.generate.error.title"),
        description:
          error instanceof Error
            ? error.message
            : t("toast.generate.error.description"),
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
        title: t("toast.apply.start.title"),
        description: t("toast.apply.start.description"),
      });
    } catch (error) {
      toast({
        title: t("toast.apply.error.title"),
        description:
          error instanceof Error
            ? error.message
            : t("toast.apply.error.description"),
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
          title: t("toast.apply.success.title"),
          description: t("toast.apply.success.description"),
        });
      }
    }

    if (story?.status === "error") {
      setIsReviewing(false);
      setIsApplying(false);
      toast({
        title: t("toast.process.error.title"),
        description: t("toast.process.error.description"),
        variant: "destructive",
      });
    }
  }, [story?.status, isApplying, t]);

  if (!story) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sm:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-gray-900 dark:text-gray-100 mb-8">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-gray-900 dark:text-gray-200">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-gray-400 dark:text-gray-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-ping" />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                  {isApplying
                    ? t("loading.applying.title")
                    : t("loading.analyzing.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isApplying
                    ? t("loading.applying.description")
                    : t("loading.analyzing.description")}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500 animate-pulse">
                  {t("loading.wait")}
                </div>
              </div>
            </div>
          ) : review ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
              <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-6 mb-4 text-blue-600 dark:text-blue-500">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mt-8 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => {
                      const text = String(children);
                      const hasScore = text.includes("/10");
                      return (
                        <h3
                          className={cn(
                            "text-lg font-medium mt-6 mb-2 flex items-center gap-2",
                            hasScore
                              ? "text-blue-600 dark:text-blue-500"
                              : "text-gray-900 dark:text-gray-100",
                          )}
                        >
                          {hasScore ? (
                            <>
                              <span>{text.split(" (")[0]}</span>
                              <span className="text-blue-600 dark:text-blue-500 font-bold">
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
                      <ul className="space-y-2 my-3 text-gray-700 dark:text-gray-300">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => {
                      const text = String(children);
                      if (text.startsWith("✓")) {
                        return (
                          <li className="flex items-baseline gap-3 text-emerald-600 dark:text-emerald-500">
                            <span className="flex-shrink-0">
                              {text.slice(0, 1)}
                            </span>
                            <span>{text.slice(1)}</span>
                          </li>
                        );
                      }
                      if (text.startsWith("△")) {
                        return (
                          <li className="flex items-baseline gap-3 text-amber-600 dark:text-amber-500">
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
                            <span className="text-gray-600 dark:text-gray-400">
                              {text.slice(1)}
                            </span>
                          </li>
                        );
                      }
                      return (
                        <li className="flex items-baseline gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mt-2 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {children}
                          </span>
                        </li>
                      );
                    },
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-3 mt-4 text-gray-700 dark:text-gray-300">
                        {children}
                      </ol>
                    ),
                    p: ({ children }) => (
                      <p className="my-3 text-gray-600 dark:text-gray-400 leading-relaxed">
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
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-4">
                <TriangleAlert className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="font-medium text-lg mb-1 text-gray-900 dark:text-gray-100">
                {t("empty.title")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("empty.description")}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-8">
          <div className="flex space-x-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
              disabled={isProcessing}
            >
              {t("buttons.close")}
            </Button>
            <div className="flex space-x-4">
              <Button
                onClick={handleReview}
                disabled={isProcessing}
                className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2 min-w-[140px]"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {t("buttons.generate.label")}
                <span className="ml-1 text-xs opacity-70">
                  (1 {t("buttons.generate.credits")})
                </span>
              </Button>
              <Button
                onClick={handleApplyRevisions}
                disabled={isProcessing || !review}
                className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2 min-w-[140px]"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t("buttons.apply.label")}
                <span className="ml-1 text-xs opacity-70">
                  (10 {t("buttons.apply.credits")})
                </span>
              </Button>
            </div>
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
  const t = useScopedI18n("story.actions.grammar.dialog");
  const [isFixing, setIsFixing] = useState(false);
  const fixGrammar = useMutation(api.story.fixGrammar);
  const story = useQuery(api.story.getStory, { storyId });

  // 监听故事状态
  useEffect(() => {
    if (story?.status === "completed" && isFixing) {
      setIsFixing(false);
      setIsOpen(false);
      toast({
        description: t("toast.success.description"),
      });
    } else if (story?.status === "error" && isFixing) {
      setIsFixing(false);
      toast({
        description: t("toast.error.process.description"),
        variant: "destructive",
      });
    }
  }, [story?.status, isFixing, t]);

  const handleFixGrammar = async () => {
    try {
      setIsFixing(true);
      await fixGrammar({ storyId });
      // 不要立即关闭对话框，等待状态更新
    } catch (error) {
      setIsFixing(false);
      toast({
        description: t("toast.error.start.description"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isFixing && setIsOpen(open)}>
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-gray-900 dark:text-gray-100 mb-8">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-gray-900 dark:text-gray-200">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
          <p>{t("content.intro")}</p>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("content.items.spelling")}</li>
            <li>{t("content.items.grammar")}</li>
            <li>{t("content.items.punctuation")}</li>
          </ul>
          <div className="text-xs space-y-2">
            <p className="italic text-gray-600 dark:text-gray-400">
              {t("content.note")}
            </p>
            <p className="text-yellow-600 dark:text-yellow-500">
              {t("content.credits")}
            </p>
          </div>
        </div>

        <DialogFooter className="mt-8">
          <div className="flex space-x-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
              disabled={isFixing}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              onClick={handleFixGrammar}
              disabled={isFixing || story?.status === "processing"}
              className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {isFixing || story?.status === "processing" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {story?.status === "processing"
                    ? t("buttons.fix.processing")
                    : t("buttons.fix.starting")}
                </>
              ) : (
                <>
                  <SpellCheck className="h-4 w-4" />
                  {t("buttons.fix.default")}
                </>
              )}
              <span className="ml-1 text-xs opacity-70">
                (2 {t("buttons.fix.credits")})
              </span>
            </Button>
          </div>
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
  const t = useScopedI18n("story.actions.read.dialog");
  const story = useQuery(api.story.getStory, { storyId });
  const segments = useQuery(api.segments.getSegments, { storyId }) || [];
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = segments.map((segment) => segment.text).join("\n\n");
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      toast({
        description: t("toast.copy.success.description"),
      });
      // 短暂显示成功状态后重置
      setTimeout(() => setHasCopied(false), 1000);
    } catch (error) {
      toast({
        description: t("toast.copy.error.description"),
        variant: "destructive",
      });
    }
  };

  if (!story) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={cn(
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          "max-w-4xl",
          story.isVertical && "sm:max-w-2xl",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-gray-900 dark:text-gray-100 mb-8">
            {story.title}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            {segments.map((segment) => (
              <SegmentContent
                key={segment._id}
                segment={segment}
                isVertical={story.isVertical}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="mt-8">
          <div className="flex justify-between w-full">
            <Button
              className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
              onClick={handleCopy}
            >
              {hasCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {hasCopied ? t("buttons.copy.copied") : t("buttons.copy.default")}
            </Button>
          </div>
          <div className="flex-1 flex justify-end">
            <Button
              className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              {t("buttons.close")}
            </Button>
          </div>
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
            alt={`Segment ${segment.order + 1} image`}
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
  const t = useScopedI18n("story.actions.clone.dialog");
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
        description: t("toast.error.credits.description"),
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
        description: t("toast.success.description"),
      });

      setIsOpen(false);
      router.push(`/stories/${newStoryId}`);
    } catch (error) {
      toast({
        description:
          error instanceof Error
            ? error.message
            : t("toast.error.clone.description"),
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
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-gray-900 dark:text-gray-100 mb-8">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-gray-900 dark:text-gray-200">
            {isVertical
              ? t("description.toHorizontal")
              : t("description.toVertical")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
          <p>{t("content.intro")}</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              {isVertical
                ? t("content.items.ratio.toHorizontal")
                : t("content.items.ratio.toVertical")}
            </li>
            <li>{t("content.items.text")}</li>
            <li>
              {isVertical
                ? t("content.items.images.toHorizontal")
                : t("content.items.images.toVertical")}
            </li>
          </ul>

          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("content.credits.required")}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {requiredCredits}
              </p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("content.credits.available")}
              </p>
              <p
                className={cn(
                  "text-sm",
                  hasEnoughCredits
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-red-600 dark:text-red-500",
                )}
              >
                {credits?.remaining || 0}
              </p>
            </div>
            {!hasEnoughCredits && (
              <p className="text-red-600 dark:text-red-500 text-xs mt-2">
                {t("content.credits.insufficient.notice")}{" "}
                {t("content.credits.insufficient.detail").replace(
                  "{amount}",
                  String(requiredCredits - (credits?.remaining || 0)),
                )}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-8">
          <div className="flex space-x-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
              disabled={isCloning}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              onClick={handleClone}
              disabled={isCloning || !hasEnoughCredits} // [修改] 添加积分检查
              className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {isCloning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("buttons.clone.creating")}
                </>
              ) : !hasEnoughCredits ? ( // [新增] 积分不足状态
                <>
                  <AlertCircle className="h-4 w-4" />
                  {t("buttons.clone.insufficient")}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {isVertical
                    ? t("buttons.clone.default.toHorizontal")
                    : t("buttons.clone.default.toVertical")}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const voiceOptions = [
  {
    id: "Chinese (Mandarin)_Refreshing_Young_Man",
    name: "舒朗男声",
    samplePath: "/audio-samples/Chinese (Mandarin)_Refreshing_Young_Man.mp3",
  },
  {
    id: "Chinese (Mandarin)_Reliable_Executive",
    name: "软软女孩",
    samplePath: "/audio-samples/Chinese (Mandarin)_Reliable_Executive.mp3",
  },
];

interface VideoDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  storyId: Id<"story">;
}

export function VideoDialog({ isOpen, setIsOpen, storyId }: VideoDialogProps) {
  const t = useScopedI18n("story.actions.video.dialog");
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceId, setVoiceId] = useState(voiceOptions[0]?.id || "");
  const [includeWatermark, setIncludeWatermark] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isLaxSpacing, setIsLaxSpacing] = useState(false);
  const [includeCaptions, setIncludeCaptions] = useState(true);
  const [captionPosition, setCaptionPosition] = useState("bottom");
  const [highlightColor, setHighlightColor] = useState("yellow");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudioPreview = async () => {
    const selectedVoice = voiceOptions.find((voice) => voice.id === voiceId);
    if (!selectedVoice || !audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      setIsLoading(true);

      // 检查音频文件是否存在
      const response = await fetch(selectedVoice.samplePath);
      if (!response.ok) {
        throw new Error(`音频文件不存在 (${response.status})`);
      }

      // 重置音频状态
      audioRef.current.currentTime = 0;
      audioRef.current.src = selectedVoice.samplePath;

      // 预加载音频
      await audioRef.current.load();

      // 播放音频
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("音频播放失败:", error);
      toast({
        title: "音频播放失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

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
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-gray-900 dark:text-gray-100 mb-8">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Select value={voiceId} onValueChange={setVoiceId}>
              <SelectTrigger className="w-[180px] h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder={t("voice.label")} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {voiceOptions.map((voice) => (
                  <SelectItem
                    key={voice.id}
                    value={voice.id}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="icon"
              onClick={playAudioPreview}
              disabled={isLoading}
              className="h-9 w-9 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              {isLoading ? (
                <RotateCcw className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <PauseIcon
                  className="h-4 w-4"
                  title={t("voice.preview.pause")}
                />
              ) : (
                <PlayIcon className="h-4 w-4" title={t("voice.preview.play")} />
              )}
            </Button>
          </div>

          <audio
            ref={audioRef}
            onEnded={handleAudioEnded}
            onError={(e) => {
              console.error("音频加载错误:", e);
              setIsPlaying(false);
              setIsLoading(false);
              toast({
                title: "音频加载失败",
                description: "请检查音频文件是否存在",
                variant: "destructive",
              });
            }}
            preload="none"
            style={{ display: "none" }}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("options.watermark.label")}
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={includeWatermark}
                onClick={() => setIncludeWatermark(!includeWatermark)}
                className={cn(
                  "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  includeWatermark
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                    includeWatermark ? "translate-x-4" : "translate-x-0",
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("options.public.label")}
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={isPublic}
                onClick={() => setIsPublic(!isPublic)}
                className={cn(
                  "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  isPublic
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                    isPublic ? "translate-x-4" : "translate-x-0",
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("options.spacing.label")}
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={isLaxSpacing}
                onClick={() => setIsLaxSpacing(!isLaxSpacing)}
                className={cn(
                  "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  isLaxSpacing
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                    isLaxSpacing ? "translate-x-4" : "translate-x-0",
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("options.captions.label")}
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={includeCaptions}
                onClick={() => setIncludeCaptions(!includeCaptions)}
                className={cn(
                  "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  includeCaptions
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                    includeCaptions ? "translate-x-4" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </div>

          {includeCaptions && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 block">
                  {t("options.captions.position.label")}
                </label>
                <Select
                  value={captionPosition}
                  onValueChange={setCaptionPosition}
                >
                  <SelectTrigger className="w-full h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue
                      placeholder={t("options.captions.position.label")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {["top", "mid upper", "mid lower", "bottom"].map(
                      (position) => (
                        <SelectItem
                          key={position}
                          value={position}
                          className="text-gray-900 dark:text-gray-100"
                        >
                          {t(`options.captions.position.options.${position}`)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 block">
                  {t("options.captions.highlight.label")}
                </label>
                <Select
                  value={highlightColor}
                  onValueChange={setHighlightColor}
                >
                  <SelectTrigger className="w-full h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue
                      placeholder={t("options.captions.highlight.label")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {["yellow", "blue", "red", "green"].map((color) => (
                      <SelectItem
                        key={color}
                        value={color}
                        className="text-gray-900 dark:text-gray-100"
                      >
                        {t(`options.captions.highlight.options.${color}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="mt-8">
          <div className="flex space-x-4">
            <Button
              className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {isGenerating
                ? t("buttons.generate.generating")
                : `${t("buttons.generate.default")} (${calculateCredits} ${t("buttons.generate.credits")})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
