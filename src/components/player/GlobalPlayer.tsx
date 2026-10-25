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
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Maximize2,
} from "lucide-react";

export function GlobalPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isQueueOpen,
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
    setQueueOpen,
    setExpandedPlayerOpen,
  } = usePlayer();

  if (!currentSong) return null;

  const isLiked = likedSongIds.has(currentSong.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-[#0c0c0c] border-t-2 border-[#262626] shadow-[0_-4px_0px_#000] px-4 md:px-6 flex items-center justify-between select-none">
      {/* LEFT: Current Track Info with Retro Cassette framing */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[280px]">
        {/* Artwork with pixel border and hard shadow */}
        <div
          onClick={() => setExpandedPlayerOpen(true)}
          className="relative w-12 h-12 bg-[#181818] shrink-0 cursor-pointer group border-2 border-[#2e2e2e] shadow-[2px_2px_0px_#000] hover:border-[#D7FF3F] transition-colors"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSong.artworkUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-3.5 h-3.5 text-[#D7FF3F]" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0 pr-1">
          <span
            onClick={() => setExpandedPlayerOpen(true)}
            className="text-xs font-pixel text-white truncate hover:text-[#D7FF3F] cursor-pointer"
          >
            {currentSong.title}
          </span>
          <span className="text-[11px] font-sans text-[#A1A1AA] truncate">
            {currentSong.artistName}
          </span>
        </div>

        {/* Like Button */}
        <button
          type="button"
          onClick={() => toggleLike(currentSong.id)}
          className={`p-1.5 border border-[#2a2a2a] bg-[#161616] hover:border-[#D7FF3F] transition-colors shrink-0 shadow-[1px_1px_0px_#000] active:translate-y-0.5 ${
            isLiked ? "text-[#D7FF3F] border-[#D7FF3F]" : "text-[#71717A] hover:text-white"
          }`}
          aria-label={isLiked ? "Unlike song" : "Like song"}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* CENTER: Main Controls & Retro LCD Scrubbing */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-2xl px-2">
        {/* Buttons Deck */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Shuffle */}
          <button
            type="button"
            onClick={toggleShuffle}
            className={`w-7 h-7 flex items-center justify-center border border-[#2a2a2a] bg-[#141414] shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-colors ${
              isShuffle ? "text-[#D7FF3F] border-[#D7FF3F]" : "text-[#71717A] hover:text-white"
            }`}
            title={isShuffle ? "Shuffle On" : "Shuffle Off"}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={previous}
            className="w-7 h-7 flex items-center justify-center border border-[#2a2a2a] bg-[#141414] text-[#A1A1AA] hover:text-[#D7FF3F] hover:border-[#444] shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-colors"
            title="Previous track"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Play / Pause Tactile Primary Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 bg-[#D7FF3F] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-y-0.5 hover:bg-[#cbf532] transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black stroke-black" />
            ) : (
              <Play className="w-4 h-4 fill-black stroke-black ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={next}
            className="w-7 h-7 flex items-center justify-center border border-[#2a2a2a] bg-[#141414] text-[#A1A1AA] hover:text-[#D7FF3F] hover:border-[#444] shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-colors"
            title="Next track"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={toggleRepeat}
            className={`w-7 h-7 flex items-center justify-center border border-[#2a2a2a] bg-[#141414] shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-colors ${
              repeatMode !== "off"
                ? "text-[#D7FF3F] border-[#D7FF3F]"
                : "text-[#71717A] hover:text-white"
            }`}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-3.5 h-3.5" />
            ) : (
              <Repeat className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Digital Retro Scrubbing Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-pixel text-[#D7FF3F] w-10 text-right select-none bg-[#141414] px-1 py-0.5 border border-[#222]">
            {formatTime(progress)}
          </span>

          <div className="relative flex-1 flex items-center group h-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={progress}
              onChange={handleSeekChange}
              className="absolute inset-0 w-full h-2 bg-transparent cursor-pointer appearance-none z-10 opacity-0"
            />
            {/* Retro Track Frame */}
            <div className="w-full h-2 bg-[#181818] border border-[#2e2e2e] shadow-[inset_1px_1px_0px_#000] overflow-hidden flex items-center">
              <div
                className="h-full bg-[#D7FF3F] border-r border-black transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber pixel thumb */}
            <div
              className="absolute w-2 h-3.5 bg-white border border-black shadow-[1px_1px_0px_#000] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity -ml-1"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[10px] font-pixel text-[#71717A] w-10 text-left select-none bg-[#141414] px-1 py-0.5 border border-[#222]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT: Volume & Utilities */}
      <div className="flex items-center justify-end gap-2.5 w-1/4 min-w-[180px] max-w-[280px]">
        {/* Queue Toggle */}
        <button
          type="button"
          onClick={() => setQueueOpen(!isQueueOpen)}
          className={`p-1.5 border border-[#2a2a2a] bg-[#141414] shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-colors ${
            isQueueOpen
              ? "text-[#D7FF3F] border-[#D7FF3F]"
              : "text-[#71717A] hover:text-white"
          }`}
          title="Playback Queue"
        >
          <ListMusic className="w-3.5 h-3.5" />
        </button>

        {/* Volume Slider Deck */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#141414] border border-[#242424] px-2 py-1 shadow-[1px_1px_0px_#000]">
          <button
            type="button"
            onClick={toggleMute}
            className="text-[#71717A] hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#D7FF3F]" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1.5 bg-[#222] accent-[#D7FF3F] cursor-pointer"
          />
        </div>

        {/* Fullscreen Player toggle */}
        <button
          type="button"
          onClick={() => setExpandedPlayerOpen(true)}
          className="p-1.5 border border-[#2a2a2a] bg-[#141414] text-[#71717A] hover:text-white shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-colors"
          title="Full Player"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
