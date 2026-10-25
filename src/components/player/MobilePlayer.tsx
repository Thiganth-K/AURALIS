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
          className="md:hidden fixed bottom-16 left-2 right-2 z-40 h-14 bg-[#181818]/95 backdrop-blur-xl border border-white/10 rounded-xl px-3 flex items-center justify-between shadow-2xl cursor-pointer"
        >
          {/* Progress bar line at top edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden rounded-t-xl">
            <div
              className="h-full bg-[#D7FF3F]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSong.artworkUrl}
              alt={currentSong.title}
              className="w-9 h-9 rounded-md object-cover shadow-sm shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {currentSong.title}
              </p>
              <p className="text-[11px] text-[#A1A1AA] truncate">
                {currentSong.artistName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(currentSong.id);
              }}
              className={`p-2 transition-colors ${
                isLiked ? "text-[#D7FF3F]" : "text-[#71717A]"
              }`}
              aria-label="Like"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-8 h-8 rounded-full bg-[#D7FF3F] text-black flex items-center justify-center shadow"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-black stroke-black" />
              ) : (
                <Play className="w-4 h-4 fill-black stroke-black ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN EXPANDED PLAYER MODAL (Mobile + Tablet) */}
      {isExpandedPlayerOpen && (
        <div className="fixed inset-0 z-50 bg-[#090909] flex flex-col p-6 animate-in slide-in-from-bottom duration-300 overflow-y-auto">
          {/* Subtle Ambient Glow */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none filter blur-3xl scale-125"
            style={{
              backgroundImage: `url(${currentSong.artworkUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />

          {/* Top Header */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => setExpandedPlayerOpen(false)}
              className="p-2 -ml-2 text-[#A1A1AA] hover:text-white"
              aria-label="Collapse"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="text-center">
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#71717A]">
                Playing from Library
              </span>
              <p className="text-xs font-semibold text-white">
                {currentSong.albumTitle || "Auralis Hi-Fi"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setExpandedPlayerOpen(false);
                setQueueOpen(true);
              }}
              className="p-2 -mr-2 text-[#A1A1AA] hover:text-white"
              aria-label="Queue"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>

          {/* Main Artwork */}
          <div className="relative z-10 aspect-square max-w-sm mx-auto w-full my-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSong.artworkUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Track Details & Like */}
          <div className="relative z-10 mt-6 mb-4 flex items-center justify-between">
            <div className="min-w-0 pr-4">
              <h2 className="text-xl font-bold text-white truncate">
                {currentSong.title}
              </h2>
              <p className="text-sm text-[#A1A1AA] truncate mt-0.5">
                {currentSong.artistName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleLike(currentSong.id)}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? "text-[#D7FF3F]" : "text-[#71717A] hover:text-white"
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
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
              className="w-full h-1 bg-white/10 accent-[#D7FF3F] rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-[#71717A]">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Full Controls */}
          <div className="relative z-10 flex items-center justify-between mb-8 px-2">
            <button
              type="button"
              onClick={toggleShuffle}
              className={`p-2 rounded-full ${
                isShuffle ? "text-[#D7FF3F]" : "text-[#71717A]"
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={previous}
              className="p-2 text-white hover:text-[#D7FF3F] transition-colors"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-[#D7FF3F] text-black flex items-center justify-center shadow-xl shadow-[#D7FF3F]/20 active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-black stroke-black" />
              ) : (
                <Play className="w-7 h-7 fill-black stroke-black ml-1" />
              )}
            </button>
            <button
              type="button"
              onClick={next}
              className="p-2 text-white hover:text-[#D7FF3F] transition-colors"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
            <button
              type="button"
              onClick={toggleRepeat}
              className={`p-2 rounded-full ${
                repeatMode !== "off" ? "text-[#D7FF3F]" : "text-[#71717A]"
              }`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Volume control bottom row */}
          <div className="relative z-10 flex items-center justify-center gap-3 px-6 pb-4">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[#71717A] hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
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
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-48 h-1 bg-white/10 accent-[#D7FF3F] rounded-full cursor-pointer"
            />
          </div>
        </div>
      )}
    </>
  );
}
