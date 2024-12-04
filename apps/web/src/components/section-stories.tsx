"use client";

import { useScopedI18n } from "@/locales/client";
import { Avatar } from "@v1/ui/avatar";
import { AvatarImageNext } from "@v1/ui/avatar";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@v1/ui/dialog";
import { Icons } from "@v1/ui/icons";
import { useRef, useState } from "react";
import { type Story, StoryCard } from "./story-card";

function Video({ src }: { src: string }) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }

    setPlaying((prev) => !prev);
  };

  return (
    <div className="w-full h-[280px] relative">
      <video
        ref={playerRef}
        onEnded={() => {
          playerRef.current?.load();
          setPlaying(false);
        }}
        onClick={togglePlay}
        onKeyUp={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            togglePlay();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
        src={src}
        autoPlay={false}
        poster="/poster.jpg"
        className="w-full"
        muted={false}
      />

      {!isPlaying && (
        <div className="absolute bottom-4 left-4 space-x-4 items-center justify-center z-30 transition-all">
          <Button
            size="icon"
            type="button"
            className="rounded-full size-10 md:size-14 transition ease-in-out hover:scale-110 hover:bg-white bg-white"
            onClick={togglePlay}
          >
            <Icons.Play size={24} className="text-black" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SectionStories() {
  const t = useScopedI18n("website.stories");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const stories = [
    {
      id: 1,
      title: t("story1.title"),
      description: t("story1.description"),
      name: "Paweł Michalski ",
      company: "VC leaders",
      country: "Poland",
      src: "/stories/pawel.jpeg",
      content: [
        {
          type: "heading",
          content: t("story1.heading"),
        },
        {
          type: "question",
          content: t("story1.question1"),
        },
        {
          type: "paragraph",
          content: t("story1.answer1"),
        },
        {
          type: "question",
          content: t("story1.question2"),
        },
        {
          type: "paragraph",
          content: t("story1.answer2"),
        },
        {
          type: "question",
          content: t("story1.question3"),
        },
        {
          type: "paragraph",
          content: t("story1.answer3"),
        },
      ],
    },
    {
      id: 2,
      title: t("story2.title"),
      name: "Guy Solan",
      company: "Thetis Medical",
      country: "United Kingdom",
      src: "/stories/guy.jpeg",
      video: "/video.mp4",
      content: [
        {
          type: "paragraph",
          content: t("story2.description"),
        },
      ],
    },
    {
      id: 3,
      title: t("story3.title"),
      description: t("story3.description"),
      name: "Facu Montanaro",
      company: "Kundo Studio",
      country: "Argentina",
      src: "/stories/facu.jpeg",
      content: [
        {
          type: "heading",
          content: t("story3.heading"),
        },
        {
          type: "question",
          content: t("story3.question1"),
        },
        {
          type: "paragraph",
          content: t("story3.answer1"),
        },
        {
          type: "question",
          content: t("story3.question2"),
        },
        {
          type: "paragraph",
          content: t("story3.answer2"),
        },
        {
          type: "question",
          content: t("story3.question3"),
        },
        {
          type: "paragraph",
          content: t("story3.answer3"),
        },
      ],
    },
    {
      id: 4,
      title: t("story4.title"),
      description: t("story4.description"),
      name: "Richard Poelderl",
      company: "Conduct.bln",
      country: "Germany",
      src: "/stories/richard.jpeg",
      content: [
        {
          type: "heading",
          content: t("story4.heading"),
        },
        {
          type: "question",
          content: t("story4.question1"),
        },
        {
          type: "paragraph",
          content: t("story4.answer1"),
        },
        {
          type: "question",
          content: t("story4.question2"),
        },
        {
          type: "paragraph",
          content: t("story4.answer2"),
        },
        {
          type: "paragraph",
          content: t("story4.question3"),
        },
        {
          type: "question",
          content: t("story4.answer3"),
        },
      ],
    },
  ];

  return (
    <Dialog>
      <div className="relative mt-20 pb-20">
        <div className="w-full h-full flex items-center flex-col z-10 relative">
          <h2 className="text-[56px] text-center font-medium mt-12">
            {t("title")}
          </h2>
          <div className="flex mt-20 -space-x-4">
            {stories.map((story, index) => (
              <div
                key={story.id}
                className={`transform ${
                  index % 2 === 0 ? "rotate-3" : "-rotate-3"
                } ${
                  index % 2 === 0 ? "translate-y-3" : "-translate-y-3"
                } hover:z-10 hover:-translate-y-5 transition-all duration-300`}
              >
                <DialogTrigger asChild>
                  <div onClick={() => setSelectedStory(story)}>
                    <StoryCard {...story} />
                  </div>
                </DialogTrigger>
              </div>
            ))}
          </div>
        </div>

        <div className="dotted-bg w-[calc(100vw+1400px)] h-full absolute top-0 -left-[1200px] z-0" />
      </div>

      <DialogContent className="max-w-[550px] !p-6 pt-10 max-h-[calc(100vh-200px)] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{selectedStory?.title}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="size-6">
              <AvatarImageNext
                src={selectedStory?.src ?? ""}
                width={24}
                height={24}
                alt={selectedStory?.name ?? ""}
              />
            </Avatar>
            <div>
              <p>{selectedStory?.name}</p>
              <div className="flex items-center gap-2 text-[#878787]">
                <p className="text-sm">{selectedStory?.company}</p>
                {selectedStory?.country && (
                  <>
                    •<p className="text-sm">{selectedStory?.country}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {selectedStory?.video && <Video src={selectedStory?.video} />}

          {selectedStory?.content?.map((item, index) =>
            item.type === "heading" ? (
              <h2 key={index.toString()} className="text-2xl font-medium">
                {item.content}
              </h2>
            ) : (
              <div
                key={index.toString()}
                className={item.type === "question" ? "text-[#878787]" : ""}
              >
                {item.content}
              </div>
            ),
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
