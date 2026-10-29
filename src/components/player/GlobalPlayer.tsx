"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
  ListMusic,
  Maximize2,
} from "lucide-react";

export function GlobalPlayer() {
  const router = useRouter();
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
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setQueueOpen,
    setExpandedPlayerOpen,
  } = usePlayer();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 h-20 px-4 md:px-6 flex items-center justify-between select-none font-mono"
      style={{
        backgroundColor: "#FAF7EE",
        borderTop: "2px solid #111111",
        boxShadow: "0 -2px 0px #111111",
      }}
    >
      {/* Decorative corner notch brackets */}
      <span
        className="absolute top-1.5 left-2 font-mono text-xs leading-none select-none"
        style={{ color: "#F05A28" }}
      >
        ┌
      </span>
      <span
        className="absolute top-1.5 right-2 font-mono text-xs leading-none select-none"
        style={{ color: "#F05A28" }}
      >
        ┐
      </span>

      {/* LEFT: Current Track Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[300px]">
        {/* Artwork with sharp border */}
        <div
          onClick={() => router.push(`/song/${currentSong.id}`)}
          className="relative w-11 h-11 shrink-0 cursor-pointer group transition-all overflow-hidden"
          style={{
            border: "1.5px solid #111111",
            boxShadow: "1.5px 1.5px 0px #111111",
            backgroundColor: "#F6EEDE",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSong.artworkUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Animated Equalizer Bars */}
        <div className="flex items-end gap-0.5 h-4 w-3.5 shrink-0" title="Audio Stream Active">
          <span
            className="w-1 rounded-xs transition-all"
            style={{
              backgroundColor: "#F05A28",
              height: isPlaying ? "14px" : "6px",
              opacity: isPlaying ? 1 : 0.5,
            }}
          />
          <span
            className="w-1 rounded-xs transition-all"
            style={{
              backgroundColor: "#F05A28",
              height: isPlaying ? "16px" : "10px",
              opacity: isPlaying ? 1 : 0.5,
            }}
          />
          <span
            className="w-1 rounded-xs transition-all"
            style={{
              backgroundColor: "#F05A28",
              height: isPlaying ? "10px" : "4px",
              opacity: isPlaying ? 1 : 0.5,
            }}
          />
        </div>

        {/* Title and Artist */}
        <div className="flex flex-col min-w-0 pr-1">
          <span
            onClick={() => router.push(`/song/${currentSong.id}`)}
            className="text-xs font-bold uppercase text-[#111111] truncate hover:text-[#F05A28] cursor-pointer"
          >
            {currentSong.title}
          </span>
          <span className="text-[10px] text-[#7A7166] font-mono truncate">
            {currentSong.artistName}
          </span>
        </div>
      </div>

      {/* CENTER: Main Controls & Retro Scrubber */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-2xl px-2">
        {/* Buttons Deck */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Shuffle */}
          <button
            type="button"
            onClick={toggleShuffle}
            className="w-7 h-7 flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: isShuffle ? "#F6EEDE" : "#FAF7EE",
              color: isShuffle ? "#F05A28" : "#111111",
              border: isShuffle ? "1.5px solid #F05A28" : "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
            }}
            title={isShuffle ? "Shuffle On" : "Shuffle Off"}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={previous}
            className="w-7 h-7 flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
              color: "#111111",
            }}
            title="Previous track"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Play / Pause Tactile Primary Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: "#F05A28",
              color: "#111111",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e84e1d";
              e.currentTarget.style.transform = "translate(-1px,-1px)";
              e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F05A28";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current stroke-current" />
            ) : (
              <Play className="w-4 h-4 fill-current stroke-current ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={next}
            className="w-7 h-7 flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
              color: "#111111",
            }}
            title="Next track"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={toggleRepeat}
            className="w-7 h-7 flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: repeatMode !== "off" ? "#F6EEDE" : "#FAF7EE",
              color: repeatMode !== "off" ? "#F05A28" : "#111111",
              border: repeatMode !== "off" ? "1.5px solid #F05A28" : "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
            }}
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
          <span className="text-[11px] font-mono font-bold text-[#111111] w-10 text-right select-none">
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
            {/* Scrubber Track Background */}
            <div
              className="w-full h-2 overflow-hidden flex items-center"
              style={{
                backgroundColor: "#F6EEDE",
                border: "1px solid #111111",
              }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: "#F05A28",
                }}
              />
            </div>
            {/* Scrubber Knob */}
            <div
              className="absolute w-2.5 h-2.5 pointer-events-none -ml-1 transition-all"
              style={{
                left: `${progressPercent}%`,
                backgroundColor: "#111111",
                border: "1px solid #FAF7EE",
              }}
            />
          </div>

          <span className="text-[11px] font-mono font-bold text-[#7A7166] w-10 text-left select-none">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT: Volume & Utilities */}
      <div className="flex items-center justify-end gap-2.5 w-1/4 min-w-[180px] max-w-[300px]">
        {/* Volume Slider Deck */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1"
          style={{
            backgroundColor: "#FAF7EE",
            border: "1.5px solid #111111",
            boxShadow: "1.5px 1.5px 0px #111111",
          }}
        >
          <button
            type="button"
            onClick={toggleMute}
            className="text-[#111111] hover:text-[#F05A28] transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#F05A28]" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1.5 accent-[#F05A28] cursor-pointer"
          />
        </div>

        {/* Queue Toggle */}
        <button
          type="button"
          onClick={() => setQueueOpen(!isQueueOpen)}
          className="p-2 transition-all cursor-pointer"
          style={{
            backgroundColor: isQueueOpen ? "#F05A28" : "#FAF7EE",
            color: isQueueOpen ? "#FAF7EE" : "#111111",
            border: "1.5px solid #111111",
            boxShadow: "1.5px 1.5px 0px #111111",
          }}
          title="Playback Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Fullscreen Player toggle */}
        <button
          type="button"
          onClick={() => router.push(`/song/${currentSong.id}`)}
          className="p-2 transition-all cursor-pointer"
          style={{
            backgroundColor: "#FAF7EE",
            border: "1.5px solid #111111",
            boxShadow: "1.5px 1.5px 0px #111111",
            color: "#111111",
          }}
          title="Full Player"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
