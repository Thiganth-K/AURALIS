"use client";

import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import {
  Play,
  Pause,
  Heart,
} from "lucide-react";

export function MobilePlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    isExpandedPlayerOpen,
    likedSongIds,
    togglePlay,
    toggleLike,
    setExpandedPlayerOpen,
  } = usePlayer();

  if (!currentSong) return null;

  const isLiked = likedSongIds.has(currentSong.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      {/* FLOATING MINI PLAYER: Visible on mobile (screens < md) above bottom nav */}
      {!isExpandedPlayerOpen && (
        <div
          onClick={() => setExpandedPlayerOpen(true)}
          className="md:hidden fixed bottom-16 left-2 right-2 z-40 h-14 bg-[#08041c] border-2 border-[#5c32c4] rounded-lg px-3 flex items-center justify-between shadow-[0_0_15px_rgba(92,50,196,0.35)] cursor-pointer"
        >
          {/* Progress bar line at top edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#180e38] rounded-t-lg overflow-hidden">
            <div
              className="h-full bg-[#d7ff3f] shadow-[0_0_6px_#d7ff3f]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSong.artworkUrl}
              alt={currentSong.title}
              className="w-9 h-9 rounded border border-[#ff2a85] object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-pixel text-white truncate">
                {currentSong.title}
              </p>
              <p className="text-[11px] font-pixel text-[#00f0ff] truncate">
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
              className={`p-1.5 rounded border transition-colors ${
                isLiked
                  ? "border-[#d7ff3f] text-[#d7ff3f] bg-[#160c3c]"
                  : "border-[#4d2db7] text-[#a79cd0] bg-[#0c0628]"
              }`}
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
              className="w-8 h-8 rounded-md bg-[#d7ff3f] text-black border-2 border-black flex items-center justify-center shadow-[0_0_10px_rgba(215,255,63,0.5)] active:translate-y-0.5"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-black stroke-black" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-black stroke-black ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
