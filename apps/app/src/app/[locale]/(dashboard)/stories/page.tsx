"use client";

import { useScopedI18n } from "@/locales/client";
import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Card, CardContent } from "@v1/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@v1/ui/tabs";
import { useQuery } from "convex/react";
import { Globe, Pen, Plus, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";

type WorkflowType = "draft" | "video" | "published";
type CollectionType = "all" | "unassigned";

export default function StoriesPage() {
  const t = useScopedI18n("story.list");
  const storiesQuery = useQuery(api.story.getAllStories);
  const [selectedCollection, setSelectedCollection] = useState<CollectionType>(
    "unassigned" as CollectionType,
  );
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType>(
    "draft" as WorkflowType,
  );

  // 筛选逻辑
  const filteredStories = useMemo(() => {
    if (!storiesQuery) return [];

    return storiesQuery.filter((story) => {
      // 首先按工作流程筛选
      const matchesWorkflow = (() => {
        switch (selectedWorkflow) {
          case "draft":
            return story.status === "draft" || story.status === "processing";
          case "video":
            return story.status === "completed" && !story.isPublic;
          case "published":
            return story.status === "completed" && story.isPublic === true;
          default:
            return true;
        }
      })();

      const matchesCollection =
        selectedCollection === "all" || selectedCollection === "unassigned";

      return matchesWorkflow && matchesCollection;
    });
  }, [storiesQuery, selectedWorkflow, selectedCollection]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {t("title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{t("description")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
          <CollectionSelector
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
          />
          <WorkflowSelector
            selectedWorkflow={selectedWorkflow}
            setSelectedWorkflow={setSelectedWorkflow}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storiesQuery === undefined ? (
            [...Array(6)].map((_, i) => <StoryCardSkeleton key={i} />)
          ) : filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <StoryCard key={story._id} storyId={story._id} />
            ))
          ) : (
            <NoStoriesPlaceholder workflow={selectedWorkflow} />
          )}
        </div>
      </div>
    </div>
  );
}

// 添加骨架屏组件
function StoryCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 animate-pulse" />
      <CardContent className="p-4 space-y-4">
        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-2/3" />
        </div>
        <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

interface CollectionSelectorProps {
  selectedCollection: "all" | "unassigned";
  setSelectedCollection: (value: "all" | "unassigned") => void;
}

function CollectionSelector({
  selectedCollection,
  setSelectedCollection,
}: CollectionSelectorProps) {
  const t = useScopedI18n("story.list.collection");
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("label")}
      </label>
      <div className="flex items-center gap-4">
        <Select
          value={selectedCollection}
          onValueChange={setSelectedCollection}
        >
          <SelectTrigger className="w-[200px] h-9 bg-blue-50/50 dark:bg-blue-900/20 border border-gray-200 dark:border-gray-700">
            <SelectValue placeholder={t("placeholder")} />
          </SelectTrigger>
          <SelectContent className="bg-blue-50/50 dark:bg-blue-900/20 border border-gray-200 dark:border-gray-700">
            <SelectItem
              value="unassigned"
              className="focus:bg-blue-100/50 dark:focus:bg-blue-800/20"
            >
              {t("options.unassigned")}
            </SelectItem>
            <SelectItem
              value="all"
              className="focus:bg-blue-100/50 dark:focus:bg-blue-800/20"
            >
              {t("options.all")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          asChild
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-0"
        >
          <Link href="/generate">
            <Plus className="w-4 h-4 mr-2" />
            {t("newStory")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface WorkflowSelectorProps {
  selectedWorkflow: WorkflowType;
  setSelectedWorkflow: (value: WorkflowType) => void;
}

function WorkflowSelector({
  selectedWorkflow,
  setSelectedWorkflow,
}: WorkflowSelectorProps) {
  const t = useScopedI18n("story.list.workflow");

  // 添加类型转换函数
  const handleValueChange = (value: string) => {
    if (value === "draft" || value === "video" || value === "published") {
      setSelectedWorkflow(value);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("label")}
      </label>
      <Tabs
        value={selectedWorkflow}
        onValueChange={handleValueChange}
        className="w-full md:w-auto"
      >
        <TabsList className="h-9 bg-blue-50/50 dark:bg-blue-900/20 border border-gray-200 dark:border-gray-700">
          <TabsTrigger
            value="draft"
            className="data-[state=active]:bg-blue-100/50 dark:data-[state=active]:bg-blue-800/20"
          >
            <Pen className="w-4 h-4 mr-2" />
            {t("tabs.draft")}
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="data-[state=active]:bg-blue-100/50 dark:data-[state=active]:bg-blue-800/20"
          >
            <Video className="w-4 h-4 mr-2" />
            {t("tabs.video")}
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="data-[state=active]:bg-blue-100/50 dark:data-[state=active]:bg-blue-800/20"
          >
            <Globe className="w-4 h-4 mr-2" />
            {t("tabs.published")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

// 优化空状态显示
function NoStoriesPlaceholder({ workflow }: { workflow: string }) {
  const t = useScopedI18n("story.list.empty");
  const ct = useScopedI18n("story.list.collection");

  const getEmptyStateContent = () => {
    switch (workflow) {
      case "draft":
        return {
          icon: <Pen className="h-6 w-6 text-gray-400" />,
          title: t("draft.title"),
          description: t("draft.description"),
          showButton: true,
        };
      case "video":
        return {
          icon: <Video className="h-6 w-6 text-gray-400" />,
          title: t("video.title"),
          description: t("video.description"),
          showButton: false,
        };
      case "published":
        return {
          icon: <Globe className="h-6 w-6 text-gray-400" />,
          title: t("published.title"),
          description: t("published.description"),
          showButton: false,
        };
      default:
        return {
          icon: <Plus className="h-6 w-6 text-gray-400" />,
          title: t("default.title"),
          description: t("default.description"),
          showButton: true,
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="col-span-full">
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="rounded-full p-4 bg-gray-50 dark:bg-gray-900">
            {content.icon}
          </div>
          <div className="text-center space-y-1">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {content.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {content.description}
            </p>
          </div>
          {content.showButton && (
            <Button
              asChild
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-0"
            >
              <Link href="/generate">
                <Plus className="w-4 h-4 mr-2" />
                {ct("newStory")}
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StoryCard({ storyId }: { storyId: Id<"story"> }) {
  const t = useScopedI18n("story.list.card");
  const story = useQuery(api.story.getStory, { storyId });
  const firstSegment = useQuery(api.segments.getFirstSegment, { storyId });
  const previewImageUrl = useQuery(
    api.segments.getImageUrl,
    firstSegment?.previewImage
      ? { storageId: firstSegment.previewImage }
      : "skip",
  );

  if (!story) return null;

  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="relative aspect-video">
        {previewImageUrl ? (
          <Image
            src={previewImageUrl}
            alt={story.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">
              {t("noPreview")}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-black/75 text-white dark:bg-white/75 dark:text-black"
        >
          {t(`status.${story.status.toLowerCase()}`)}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
          {story.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {firstSegment?.text}
        </p>
        <Button
          asChild
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
        >
          <Link href={`/stories/${storyId}`}>{t("viewStory")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
