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
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-[#060317] border-t-2 border-[#5c32c4] shadow-[0_-4px_25px_rgba(92,50,196,0.35)] px-4 md:px-6 flex items-center justify-between select-none">
      {/* Decorative corner notch brackets */}
      <span className="absolute top-1.5 left-2 text-[#5c32c4] font-mono text-xs leading-none select-none">
        ┌
      </span>
      <span className="absolute top-1.5 right-2 text-[#5c32c4] font-mono text-xs leading-none select-none">
        ┐
      </span>

      {/* LEFT: Current Track Info with Synthwave Framing */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[300px]">
        {/* Artwork with glowing pink border */}
        <div
          onClick={() => setExpandedPlayerOpen(true)}
          className="relative w-11 h-11 rounded bg-[#0e072b] shrink-0 cursor-pointer group border border-[#ff2a85] shadow-[0_0_10px_rgba(255,42,133,0.35)] hover:border-[#00f0ff] transition-all overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSong.artworkUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-3.5 h-3.5 text-[#00f0ff]" />
          </div>
        </div>

        {/* Animated Green/Cyan Equalizer Bars */}
        <div className="flex items-end gap-0.5 h-4 w-3.5 shrink-0" title="Audio Stream Active">
          <span
            className={`w-1 bg-[#00ff88] rounded-xs transition-all ${
              isPlaying ? "h-3.5 animate-pulse" : "h-2 opacity-50"
            }`}
          />
          <span
            className={`w-1 bg-[#00f0ff] rounded-xs transition-all ${
              isPlaying ? "h-4 animate-bounce" : "h-3 opacity-50"
            }`}
          />
          <span
            className={`w-1 bg-[#d7ff3f] rounded-xs transition-all ${
              isPlaying ? "h-2.5 animate-pulse" : "h-1.5 opacity-50"
            }`}
          />
        </div>

        {/* Title and Artist */}
        <div className="flex flex-col min-w-0 pr-1">
          <span
            onClick={() => setExpandedPlayerOpen(true)}
            className="text-xs font-pixel text-white font-bold truncate hover:text-[#00f0ff] cursor-pointer"
          >
            {currentSong.title}
          </span>
          <span className="text-[11px] font-pixel text-[#00f0ff] truncate">
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
            className={`w-7 h-7 flex items-center justify-center rounded border transition-all ${
              isShuffle
                ? "bg-[#160c3c] text-[#d7ff3f] border-[#d7ff3f] shadow-[0_0_8px_rgba(215,255,63,0.4)]"
                : "bg-[#0c0628] border-[#4d2db7] text-[#a79cd0] hover:text-[#00f0ff] hover:border-[#00f0ff]"
            }`}
            title={isShuffle ? "Shuffle On" : "Shuffle Off"}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={previous}
            className="w-7 h-7 flex items-center justify-center rounded border border-[#4d2db7] bg-[#0c0628] text-[#a79cd0] hover:text-white hover:border-[#00f0ff] active:translate-y-0.5 transition-all"
            title="Previous track"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Play / Pause Tactile Neon Lime Primary Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 rounded-md bg-[#d7ff3f] text-black border-2 border-black flex items-center justify-center shadow-[0_0_15px_rgba(215,255,63,0.55)] active:translate-y-0.5 hover:bg-[#cbf532] transition-transform"
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
            className="w-7 h-7 flex items-center justify-center rounded border border-[#4d2db7] bg-[#0c0628] text-[#a79cd0] hover:text-white hover:border-[#00f0ff] active:translate-y-0.5 transition-all"
            title="Next track"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={toggleRepeat}
            className={`w-7 h-7 flex items-center justify-center rounded border transition-all ${
              repeatMode !== "off"
                ? "bg-[#160c3c] text-[#d7ff3f] border-[#d7ff3f] shadow-[0_0_8px_rgba(215,255,63,0.4)]"
                : "bg-[#0c0628] border-[#4d2db7] text-[#a79cd0] hover:text-[#00f0ff] hover:border-[#00f0ff]"
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
          <span className="text-[11px] font-pixel text-white w-10 text-right select-none">
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
            <div className="w-full h-1.5 bg-[#180e38] rounded-full overflow-hidden flex items-center border border-[#2d1b69]">
              <div
                className="h-full bg-[#d7ff3f] shadow-[0_0_8px_#d7ff3f] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber Knob */}
            <div
              className="absolute w-2.5 h-2.5 bg-[#d7ff3f] rounded-full shadow-[0_0_10px_#d7ff3f] pointer-events-none -ml-1 transition-all"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[11px] font-pixel text-white w-10 text-left select-none">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT: Volume & Utilities */}
      <div className="flex items-center justify-end gap-2.5 w-1/4 min-w-[180px] max-w-[300px]">
        {/* Volume Slider Deck */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#0c0628] border border-[#4d2db7] rounded-lg px-2.5 py-1 shadow-[0_0_8px_rgba(77,45,183,0.2)]">
          <button
            type="button"
            onClick={toggleMute}
            className="text-[#a79cd0] hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#00f0ff]" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1.5 bg-[#180e38] accent-[#d7ff3f] cursor-pointer"
          />
        </div>

        {/* Queue Toggle */}
        <button
          type="button"
          onClick={() => setQueueOpen(!isQueueOpen)}
          className={`p-2 rounded-lg border transition-all ${
            isQueueOpen
              ? "bg-[#160c3c] text-[#d7ff3f] border-[#d7ff3f] shadow-[0_0_8px_rgba(215,255,63,0.4)]"
              : "bg-[#0c0628] border-[#4d2db7] text-[#a79cd0] hover:text-[#00f0ff] hover:border-[#00f0ff]"
          }`}
          title="Playback Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Fullscreen Player toggle */}
        <button
          type="button"
          onClick={() => setExpandedPlayerOpen(true)}
          className="p-2 rounded-lg border border-[#4d2db7] bg-[#0c0628] text-[#a79cd0] hover:text-[#00f0ff] hover:border-[#00f0ff] active:translate-y-0.5 transition-all"
          title="Full Player"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
