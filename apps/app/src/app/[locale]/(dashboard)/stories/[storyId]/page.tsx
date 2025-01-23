"use client";

import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import type { Doc } from "@v1/backend/convex/_generated/dataModel";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@v1/ui/dropdown-menu";
import { Input } from "@v1/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { toast } from "@v1/ui/use-toast";
import { useAction, useMutation, useQuery } from "convex/react";
import { PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useMemo, useRef, useState } from "react";

type Segment = Doc<"segments">;

export default function StoryOverview() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.storyId as Id<"story">;

  const story = useQuery(api.story.getStory, { storyId: storyId });
  const segments =
    useQuery(api.segments.getSegments, { storyId: storyId }) || [];

  if (story === undefined) {
    return <LoadingState />;
  }

  if (story === null) {
    return <div>Story not found</div>;
  }

  const isVertical = story.isVertical ?? false;

  return (
    <div className="min-h-screen p-4 space-y-8 py-32">
      <div className="container mx-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <Button
              onClick={() => router.push("/stories")}
              variant="ghost"
              className="mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Your Stories
            </Button>
            <div className="flex items-center gap-4 flex-grow justify-center">
              <StoryTitle title={story.title} storyId={storyId} />
              <OrientationBadge isVertical={isVertical} />
            </div>
            <EditImageContextButton />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {segments.map((segment: Segment, index: number) => (
              <SegmentCard key={segment._id} segment={segment} index={index} />
            ))}
            <AddSegmentButton storyId={storyId} />
          </div>
        </div>
        <ActionButtons storyId={storyId} isVertical={isVertical} />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen p-4 space-y-8 py-32">
      <div className="container mx-auto">
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
      </div>
    </div>
  );
}

function StoryTitle({
  title,
  storyId,
}: {
  title: string;
  storyId: Id<"story">;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const updateStory = useMutation(api.story.updateStory);

  const handleSave = async () => {
    await updateStory({ storyId, title: newTitle });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="relative inline-block">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="bg-white flex h-9 w-full rounded-md border border-input shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-2xl p-2"
          placeholder="Enter story title..."
          style={{ minWidth: "200px" }}
        />
        <div className="text-sm text-white h-5 absolute -bottom-5 right-0">
          {/* You can add a character count or error message here if needed */}
        </div>
      </div>
    );
  }

  return (
    <h1 className="text-2xl font-bold">
      <button
        type="button"
        className="cursor-pointer w-full text-left"
        onClick={() => setIsEditing(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsEditing(true);
          }
        }}
        aria-label="Edit title"
      >
        {title}
      </button>
    </h1>
  );
}

function OrientationBadge({ isVertical }: { isVertical: boolean }) {
  return (
    <span className="inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-xs py-1 px-2 rounded-full bg-purple-700/50 text-purple-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3 h-3 mr-1"
      >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
      {isVertical ? "Vertical" : "Horizontal"}
    </span>
  );
}

function EditImageContextButton() {
  return (
    <Button
      variant="outline"
      className="bg-white text-blue-800 border border-blue-500 hover:bg-blue-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 mr-2"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
      Edit Image Context
    </Button>
  );
}

function SegmentCard({
  segment,
  index,
}: {
  segment: Doc<"segments">;
  index: number;
}) {
  const previewImageUrl = useQuery(
    api.segments.getImageUrl,
    segment.previewImage ? { storageId: segment.previewImage } : "skip",
  );

  return (
    <div className="rounded-xl border text-card-foreground flex flex-col mb-8 bg-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="space-y-1.5 p-6 flex flex-row items-center justify-between bg-gray-50 py-2 px-4">
        <h3 className="tracking-tight text-sm font-medium text-gray-700">
          Segment {index + 1}
        </h3>
        <SegmentOptionsMenu segmentId={segment._id} />
      </div>
      <div className="p-0 bg-white">
        <div className="relative">
          <div className="border text-card-foreground shadow rounded-none relative flex-shrink-0 w-full h-64 bg-gray-50 overflow-hidden">
            {previewImageUrl ? (
              <Image
                src={previewImageUrl}
                alt={`Segment ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <Button disabled>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0036C11.5543 13 12 12.5538 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0036 14H3.99635C2.89381 14 2 13.104 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                  Generate Image (10 credits)
                </Button>
              </div>
            )}
          </div>
          <div className="bg-white">
            <div className="text-card-foreground flex-grow h-44 bg-white border-2 border-blue-200 shadow-md shadow-blue-100 rounded-lg rounded-t-none">
              <div className="relative w-full h-full">
                <textarea
                  className="flex min-h-[60px] rounded-md text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full h-full resize-none bg-transparent text-gray-900 p-4 rounded-t-none"
                  maxLength={750}
                  value={segment.text}
                  readOnly
                />
                <div className="text-xs absolute bottom-2 right-2 text-gray-400">
                  {segment.text.split(/\s+/).length} / 750
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SegmentOptionsMenu({ segmentId }: { segmentId: Id<"segments"> }) {
  void segmentId;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
          <span className="sr-only">Segment Options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit Segment</DropdownMenuItem>
        <DropdownMenuItem>Regenerate Image</DropdownMenuItem>
        <DropdownMenuItem>Delete Segment</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AddSegmentButton({ storyId }: { storyId: Id<"story"> }) {
  const addSegment = useMutation(api.segments.addSegment);

  const handleAddSegment = async () => {
    await addSegment({ storyId, text: "New segment text" });
  };

  return (
    <Button
      onClick={handleAddSegment}
      className="z-40 absolute -right-3 top-1/2 transform -translate-y-1/2"
      variant="default"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
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

  return (
    <div className="rounded-xl border text-card-foreground bg-white shadow-lg mt-8">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
          <Button onClick={() => setIsReviewDialogOpen(true)} variant="outline">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
            >
              <path
                d="M13.5 7.5L10.5 10.75M13.5 7.5L10.5 4.5M13.5 7.5L4 7.5M8 13.5L1.5 7.5L8 1.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Review Story
          </Button>
          <Button
            onClick={() => setIsGrammarDialogOpen(true)}
            variant="outline"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
            >
              <path
                d="M3.5 7.5L7.5 3.5M3.5 7.5L7.5 11.5M3.5 7.5H11.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Fix Grammar & Spelling
          </Button>
          <Button onClick={() => setIsReadDialogOpen(true)} variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 mr-2"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Read Full Story
          </Button>
          <Button onClick={() => setIsCloneDialogOpen(true)} variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 mr-2"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            Clone to {isVertical ? "Horizontal" : "Vertical"}
          </Button>
          <Button onClick={() => setIsVideoDialogOpen(true)} variant="default">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-2"
            >
              <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
              <rect x="2" y="6" width="14" height="12" rx="2" />
            </svg>
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

// Implement the dialog components (ReviewDialog, GrammarDialog, ReadDialog, CloneDialog, VideoDialog) here
// Each dialog component should use the Dialog, DialogContent, DialogHeader, DialogTitle, and DialogFooter components

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
  const [isReviewing, setIsReviewing] = useState(false);
  const reviewStory = useMutation(api.story.reviewStory);

  const handleReview = async () => {
    setIsReviewing(true);
    try {
      await reviewStory({ storyId });
      setIsOpen(false);
    } catch (error) {
      console.error("Error reviewing story:", error);
    } finally {
      setIsReviewing(false);
    }
  };

  if (!story) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Story: {story.title}</DialogTitle>
        </DialogHeader>
        <p>This will review your story for content and structure.</p>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleReview} disabled={isReviewing}>
            {isReviewing ? "Reviewing..." : "Review Story"}
          </Button>
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

  const handleFixGrammar = async () => {
    setIsFixing(true);
    try {
      await fixGrammar({ storyId });
      setIsOpen(false);
    } catch (error) {
      console.error("Error fixing grammar:", error);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fix Grammar & Spelling</DialogTitle>
        </DialogHeader>
        <p>
          This will check and fix grammar and spelling issues in your story.
        </p>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleFixGrammar} disabled={isFixing}>
            {isFixing ? "Fixing..." : "Fix Grammar & Spelling"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReadDialog({
  isOpen,
  setIsOpen,
  storyId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  storyId: Id<"story">;
}) {
  const story = useQuery(api.story.getStory, { storyId });
  const segments = useQuery(api.segments.getSegments, { storyId }) || [];

  if (!story) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{story.title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">
          {segments.map((segment: Segment) => (
            <div key={segment._id} className="mb-4">
              <p>{segment.text}</p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

  const handleClone = async () => {
    setIsCloning(true);
    try {
      await cloneStory({ storyId, newOrientation: !isVertical });
      setIsOpen(false);
    } catch (error) {
      console.error("Error cloning story:", error);
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clone Story</DialogTitle>
        </DialogHeader>
        <p>
          This will create a new {isVertical ? "horizontal" : "vertical"}{" "}
          version of your story.
        </p>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleClone} disabled={isCloning}>
            {isCloning
              ? "Cloning..."
              : `Clone to ${isVertical ? "Horizontal" : "Vertical"}`}
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
  const [voiceId, setVoiceId] = useState(voiceOptions[0]?.id);
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
