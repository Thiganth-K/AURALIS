"use client";

import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ChevronDown,
  ListMusic,
  Volume2,
  VolumeX,
} from "lucide-react";

export function MobilePlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isExpandedPlayerOpen,
    likedSongIds,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    setExpandedPlayerOpen,
    setQueueOpen,
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
          className="md:hidden fixed bottom-16 left-2 right-2 z-40 h-14 bg-[#111111] border-2 border-[#2e2e2e] px-3 flex items-center justify-between shadow-[3px_3px_0px_#000] cursor-pointer"
        >
          {/* Progress bar line at top edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#222222] overflow-hidden">
            <div
              className="h-full bg-[#D7FF3F]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSong.artworkUrl}
              alt={currentSong.title}
              className="w-9 h-9 border border-black object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-pixel text-white truncate">
                {currentSong.title}
              </p>
              <p className="text-[11px] font-sans text-[#A1A1AA] truncate">
                {currentSong.artistName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(currentSong.id);
              }}
              className={`p-1.5 border border-[#2a2a2a] bg-[#161616] transition-colors ${
                isLiked ? "text-[#D7FF3F] border-[#D7FF3F]" : "text-[#71717A]"
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
              className="w-8 h-8 bg-[#D7FF3F] text-black border border-black flex items-center justify-center shadow-[1px_1px_0px_#000] active:translate-y-0.5"
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

      {/* FULLSCREEN EXPANDED PLAYER MODAL (Mobile + Tablet) */}
      {isExpandedPlayerOpen && (
        <div className="fixed inset-0 z-50 bg-[#090909] flex flex-col p-6 animate-in slide-in-from-bottom duration-200 overflow-y-auto">
          {/* Top Console Header */}
          <div className="relative z-10 flex items-center justify-between pb-3 mb-6 border-b-2 border-[#222]">
            <button
              type="button"
              onClick={() => setExpandedPlayerOpen(false)}
              className="p-1.5 border border-[#2e2e2e] bg-[#141414] text-[#A1A1AA] hover:text-white shadow-[1px_1px_0px_#000]"
              aria-label="Collapse"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-[9px] tracking-wider uppercase font-pixel text-[#D7FF3F]">
                {"// NOW PLAYING"}
              </span>
              <p className="text-xs font-pixel text-white">
                {currentSong.albumTitle || "AURALIS HI-FI"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setExpandedPlayerOpen(false);
                setQueueOpen(true);
              }}
              className="p-1.5 border border-[#2e2e2e] bg-[#141414] text-[#A1A1AA] hover:text-[#D7FF3F] shadow-[1px_1px_0px_#000]"
              aria-label="Queue"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>

          {/* Main Artwork with Pixel Frame */}
          <div className="relative z-10 aspect-square max-w-xs mx-auto w-full my-auto border-4 border-[#222222] shadow-[6px_6px_0px_#000] bg-[#141414]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSong.artworkUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Track Details & Like */}
          <div className="relative z-10 mt-6 mb-4 flex items-center justify-between bg-[#111111] border-2 border-[#242424] p-3 shadow-[2px_2px_0px_#000]">
            <div className="min-w-0 pr-3">
              <h2 className="text-base font-pixel text-white truncate">
                {currentSong.title}
              </h2>
              <p className="text-xs font-sans text-[#A1A1AA] truncate mt-0.5">
                {currentSong.artistName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleLike(currentSong.id)}
              className={`p-2 border border-[#2a2a2a] bg-[#161616] shadow-[1px_1px_0px_#000] active:translate-y-0.5 ${
                isLiked ? "text-[#D7FF3F] border-[#D7FF3F]" : "text-[#71717A] hover:text-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Scrubber */}
          <div className="relative z-10 space-y-1 mb-6">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-2 bg-[#181818] border border-[#2e2e2e] accent-[#D7FF3F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-pixel text-[#71717A]">
              <span className="text-[#D7FF3F]">{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Full Retro Controls */}
          <div className="relative z-10 flex items-center justify-between mb-8 px-2">
            <button
              type="button"
              onClick={toggleShuffle}
              className={`w-9 h-9 flex items-center justify-center border border-[#2e2e2e] bg-[#141414] shadow-[1px_1px_0px_#000] ${
                isShuffle ? "text-[#D7FF3F] border-[#D7FF3F]" : "text-[#71717A]"
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={previous}
              className="w-10 h-10 flex items-center justify-center border border-[#2e2e2e] bg-[#141414] text-white hover:text-[#D7FF3F] shadow-[2px_2px_0px_#000] active:translate-y-0.5"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="w-14 h-14 bg-[#D7FF3F] text-black border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-black stroke-black" />
              ) : (
                <Play className="w-6 h-6 fill-black stroke-black ml-1" />
              )}
            </button>
            <button
              type="button"
              onClick={next}
              className="w-10 h-10 flex items-center justify-center border border-[#2e2e2e] bg-[#141414] text-white hover:text-[#D7FF3F] shadow-[2px_2px_0px_#000] active:translate-y-0.5"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button
              type="button"
              onClick={toggleRepeat}
              className={`w-9 h-9 flex items-center justify-center border border-[#2e2e2e] bg-[#141414] shadow-[1px_1px_0px_#000] ${
                repeatMode !== "off" ? "text-[#D7FF3F] border-[#D7FF3F]" : "text-[#71717A]"
              }`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Volume control bottom row */}
          <div className="relative z-10 flex items-center justify-center gap-3 px-4 py-2 bg-[#111111] border border-[#222]">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[#71717A] hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#D7FF3F]" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-44 h-1.5 bg-[#222] accent-[#D7FF3F] cursor-pointer"
            />
          </div>
        </div>
      )}
    </>
  );
}
