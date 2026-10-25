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
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-[#111111]/95 backdrop-blur-md border-t border-white/10 px-4 md:px-6 flex items-center justify-between select-none">
      {/* LEFT: Current Track Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[280px]">
        {/* Artwork with subtle glow */}
        <div
          onClick={() => setExpandedPlayerOpen(true)}
          className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#181818] shrink-0 cursor-pointer group shadow-sm border border-white/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSong.artworkUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0 pr-1">
          <span
            onClick={() => setExpandedPlayerOpen(true)}
            className="text-sm font-semibold text-white truncate hover:underline cursor-pointer"
          >
            {currentSong.title}
          </span>
          <span className="text-xs text-[#A1A1AA] truncate">
            {currentSong.artistName}
          </span>
        </div>

        {/* Like Button */}
        <button
          type="button"
          onClick={() => toggleLike(currentSong.id)}
          className={`p-1.5 rounded-full transition-colors shrink-0 ${
            isLiked ? "text-[#D7FF3F]" : "text-[#71717A] hover:text-white"
          }`}
          aria-label={isLiked ? "Unlike song" : "Like song"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* CENTER: Main Controls & Progress Bar */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-2xl px-2">
        {/* Buttons */}
        <div className="flex items-center gap-5">
          {/* Shuffle */}
          <button
            type="button"
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-colors ${
              isShuffle ? "text-[#D7FF3F]" : "text-[#71717A] hover:text-white"
            }`}
            title={isShuffle ? "Shuffle On" : "Shuffle Off"}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={previous}
            className="p-1.5 text-[#A1A1AA] hover:text-white transition-colors"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-[#D7FF3F] text-black hover:bg-[#c5ea33] flex items-center justify-center shadow-lg shadow-[#D7FF3F]/15 transition-transform active:scale-95"
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
            className="p-1.5 text-[#A1A1AA] hover:text-white transition-colors"
            title="Next track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full transition-colors relative ${
              repeatMode !== "off"
                ? "text-[#D7FF3F]"
                : "text-[#71717A] hover:text-white"
            }`}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Scrubbing Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#71717A] w-9 text-right select-none">
            {formatTime(progress)}
          </span>

          <div className="relative flex-1 flex items-center group h-4">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={progress}
              onChange={handleSeekChange}
              className="absolute inset-0 w-full h-1 bg-transparent cursor-pointer appearance-none z-10 opacity-0 group-hover:opacity-100"
            />
            {/* Track Background */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#D7FF3F] transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber thumb indicator */}
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all -ml-1"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-[#71717A] w-9 text-left select-none">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT: Volume & Utilities */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px] max-w-[280px]">
        {/* Queue Toggle */}
        <button
          type="button"
          onClick={() => setQueueOpen(!isQueueOpen)}
          className={`p-2 rounded-lg transition-colors ${
            isQueueOpen
              ? "text-[#D7FF3F] bg-white/10"
              : "text-[#71717A] hover:text-white"
          }`}
          title="Playback Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume Slider */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 text-[#71717A] hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-white/10 accent-[#D7FF3F] rounded-full cursor-pointer"
          />
        </div>

        {/* Fullscreen Player toggle */}
        <button
          type="button"
          onClick={() => setExpandedPlayerOpen(true)}
          className="p-2 text-[#71717A] hover:text-white transition-colors"
          title="Full Player"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
