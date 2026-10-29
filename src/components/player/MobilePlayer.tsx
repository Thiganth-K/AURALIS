"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import {
  Play,
  Pause,
  Heart,
  Film,
} from "lucide-react";

export function MobilePlayer() {
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    isExpandedPlayerOpen,
    likedSongIds,
    togglePlay,
    toggleLike,
  } = usePlayer();

  if (!currentSong) return null;

  const isLiked = likedSongIds.has(currentSong.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      {/* FLOATING MINI PLAYER: Visible on mobile (screens < md) above bottom nav */}
      {!isExpandedPlayerOpen && (
        <div
          onClick={() => router.push(`/song/${currentSong.id}`)}
          className="md:hidden fixed bottom-16 left-2 right-2 z-40 h-14 px-3 flex items-center justify-between cursor-pointer font-mono select-none"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          {/* Progress bar line at top edge */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden"
            style={{ backgroundColor: "#F6EEDE" }}
          >
            <div
              className="h-full transition-all"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: "#F05A28",
              }}
            />
          </div>

          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSong.artworkUrl}
              alt={currentSong.title}
              className="w-9 h-9 object-cover shrink-0"
              style={{ border: "1.5px solid #111111" }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <p className="text-xs font-bold text-[#111111] uppercase truncate">
                  {currentSong.title}
                </p>
                {currentSong.videoUrl && (
                  <span className="shrink-0 px-1 py-0.2 text-[8px] font-black uppercase text-[#F05A28] border border-[#F05A28] bg-[#FFF0ED]">
                    🎬 VIDEO
                  </span>
                )}
              </div>
              <p
                className="text-[10px] font-mono truncate mt-0.5"
                style={{ color: "#F05A28" }}
              >
                {currentSong.artistName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(currentSong.id);
              }}
              className="w-7 h-7 flex items-center justify-center transition-all cursor-pointer"
              style={{
                backgroundColor: isLiked ? "#FFF0ED" : "#FAF7EE",
                border: isLiked ? "1.5px solid #F05A28" : "1.5px solid #111111",
                boxShadow: "1px 1px 0px #111111",
                color: isLiked ? "#F05A28" : "#111111",
              }}
              aria-label="Like"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
              style={{
                backgroundColor: isPlaying ? "#F05A28" : "#111111",
                color: "#FFFFFF",
                border: "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
