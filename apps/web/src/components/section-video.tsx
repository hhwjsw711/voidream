"use client";

import { Button } from "@v1/ui/button";
import { Icons } from "@v1/ui/icons";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export function SectionVideo() {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setMuted] = useState(true);

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }

    setPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <motion.div
      className="flex flex-col justify-center container pb-20"
      onViewportLeave={() => {
        playerRef.current?.pause();
        setPlaying(false);
      }}
    >
      <div className="relative">
        {isPlaying && (
          <div className="absolute md:top-12 md:right-12 top-4 right-4 space-x-4 items-center justify-center z-30 transition-all">
            <Button
              size="icon"
              className="rounded-full size-10 md:size-14 transition ease-in-out hover:scale-110 hover:bg-white bg-white"
              onClick={toggleMute}
            >
              {isMuted ? (
                <Icons.Mute size={24} className="text-black" />
              ) : (
                <Icons.UnMute size={24} className="text-black" />
              )}
            </Button>
          </div>
        )}

        {!isPlaying && (
          <div className="absolute md:top-12 md:right-12 top-4 right-4 space-x-4 items-center justify-center z-30 transition-all">
            <Button
              size="icon"
              className="rounded-full size-10 md:size-14 transition ease-in-out hover:scale-110 hover:bg-white bg-white"
              onClick={togglePlay}
            >
              <Icons.Play size={24} className="text-black" />
            </Button>
          </div>
        )}

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
          src="/video.mp4"
          autoPlay={false}
          poster="/poster.jpg"
          className="w-full"
          muted={isMuted}
        />
      </div>
    </motion.div>
  );
}
