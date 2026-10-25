"use client";

import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";
import { formatTime } from "@/lib/utils";
import { RetroAudioVisualizer } from "@/components/player/RetroAudioVisualizer";
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
  Volume1,
  Minimize2,
  Radio,
  Music2,
} from "lucide-react";

export function ExpandedPlayer() {
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

  const { user } = useAuth();

  if (!isExpandedPlayerOpen || !currentSong) return null;

  const isLiked = likedSongIds.has(currentSong.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#04020c] flex flex-col justify-between p-3 sm:p-5 select-none overflow-y-auto animate-in fade-in duration-200">
      {/* Background Ambient Cyber Grid & Plus Markers */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-12 left-12 text-[#00f0ff] font-mono text-base font-bold">+</div>
        <div className="absolute top-1/2 left-8 text-[#5c32c4] font-mono text-base font-bold">+</div>
        <div className="absolute bottom-32 left-16 text-[#00f0ff] font-mono text-base font-bold">+</div>
        <div className="absolute top-16 right-12 text-[#00f0ff] font-mono text-base font-bold">+</div>
        <div className="absolute top-1/2 right-8 text-[#5c32c4] font-mono text-base font-bold">+</div>
        <div className="absolute bottom-32 right-16 text-[#00f0ff] font-mono text-base font-bold">+</div>
      </div>

      {/* 1. TOP HEADER CONSOLE (exact match to reference) */}
      <header className="relative z-10 w-full rounded-xl bg-[#08041c] border-2 border-[#5c32c4] shadow-[0_0_20px_rgba(92,50,196,0.3)] px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2">
        {/* Corner notch brackets */}
        <span className="absolute top-1 left-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┌</span>
        <span className="absolute top-1 right-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┐</span>
        <span className="absolute bottom-1 left-2 text-[#5c32c4] font-mono text-xs leading-none select-none">└</span>
        <span className="absolute bottom-1 right-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┘</span>

        {/* Left: Collapse button + AURALIS Logo Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setExpandedPlayerOpen(false)}
            className="w-9 h-9 rounded-lg bg-[#0e072b] border border-[#4d2db7] text-white hover:text-[#00f0ff] hover:border-[#00f0ff] flex items-center justify-center transition-all shadow-[0_0_8px_rgba(77,45,183,0.3)] cursor-pointer"
            title="Collapse Player"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#0e072b] border border-[#4d2db7] shadow-[0_0_10px_rgba(77,45,183,0.2)]">
            {/* Equalizer Icon */}
            <div className="flex items-end gap-0.5 h-3.5 w-3.5">
              <span className="w-0.5 bg-[#ff2a85] h-2" />
              <span className="w-0.5 bg-[#a855f7] h-3.5" />
              <span className="w-0.5 bg-[#00f0ff] h-3" />
              <span className="w-0.5 bg-[#d7ff3f] h-2.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-pixel font-bold text-white tracking-widest text-xs leading-none">
                AURALIS
              </span>
              <span className="font-pixel text-[8px] text-[#00f0ff] tracking-wider uppercase leading-none mt-0.5">
                MUSIC SYSTEM
              </span>
            </div>
          </div>
        </div>

        {/* Center: // NOW PLAYING + AURALIS HI-FI */}
        <div className="text-center hidden sm:block">
          <p className="text-[10px] sm:text-xs font-pixel text-[#d7ff3f] tracking-widest uppercase">
            // NOW PLAYING
          </p>
          <p className="text-xs sm:text-sm font-pixel text-white tracking-wide uppercase font-bold">
            {currentSong.albumTitle || "AURALIS HI-FI"}
          </p>
        </div>

        {/* Right: Audio Spec Badge + Profile Pill + Queue Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#02131d] border border-[#00f0ff] text-[11px] font-pixel text-[#00f0ff] rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Radio className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
            <span>FLAC // 24-BIT 96kHz</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-[#0e072b] border border-[#4d2db7] rounded-lg text-white font-pixel text-xs shadow-[0_0_8px_rgba(77,45,183,0.2)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              }
              alt="Avatar"
              className="w-5 h-5 rounded object-cover border border-[#ff2a85]"
            />
            <span className="truncate max-w-[90px]">{user?.name || "Thiganth"}</span>
            <span className="text-[9px] text-[#00f0ff]">▾</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setExpandedPlayerOpen(false);
              setQueueOpen(true);
            }}
            className="w-9 h-9 rounded-lg bg-[#0e072b] border border-[#4d2db7] text-[#00f0ff] hover:border-[#00f0ff] flex items-center justify-center transition-all shadow-[0_0_8px_rgba(77,45,183,0.2)]"
            title="Open Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. CENTER STAGE: RETRO EQUALIZER SPECTRUM + TARGET RETICLE ARTWORK */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-4 sm:my-6 overflow-hidden max-h-[460px]">
        {/* Left Spectrum Visualizer */}
        <div className="hidden lg:flex flex-1 justify-end pr-6">
          <RetroAudioVisualizer isPlaying={isPlaying} side="left" barsCount={22} />
        </div>

        {/* Center Artwork Box with Neon Lime Reticle Brackets */}
        <div className="relative shrink-0">
          {/* Target Corner Reticle Brackets [ ╔ ╗ ╚ ╝ ] */}
          <span className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-[#d7ff3f] rounded-tl-sm pointer-events-none shadow-[0_0_12px_#d7ff3f] z-20" />
          <span className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-[#d7ff3f] rounded-tr-sm pointer-events-none shadow-[0_0_12px_#d7ff3f] z-20" />
          <span className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-[#d7ff3f] rounded-bl-sm pointer-events-none shadow-[0_0_12px_#d7ff3f] z-20" />
          <span className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-[#d7ff3f] rounded-br-sm pointer-events-none shadow-[0_0_12px_#d7ff3f] z-20" />

          {/* Artwork Container */}
          <div className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-xl overflow-hidden bg-[#0c0628] border-2 border-[#5c32c4] shadow-[0_0_40px_rgba(92,50,196,0.45)] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSong.artworkUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
            {/* Subtle scanline overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Spectrum Visualizer */}
        <div className="hidden lg:flex flex-1 justify-start pl-6">
          <RetroAudioVisualizer isPlaying={isPlaying} side="right" barsCount={22} />
        </div>
      </div>

      {/* 3. TRACK INFO CONSOLE BAR (exact match to reference) */}
      <div className="relative z-10 w-full rounded-xl bg-[#08041c] border-2 border-[#5c32c4] shadow-[0_0_20px_rgba(92,50,196,0.25)] px-4 sm:px-6 py-3.5 mb-2.5 flex items-center justify-between">
        {/* Corner notch brackets */}
        <span className="absolute top-1 left-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┌</span>
        <span className="absolute top-1 right-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┐</span>
        <span className="absolute bottom-1 left-2 text-[#5c32c4] font-mono text-xs leading-none select-none">└</span>
        <span className="absolute bottom-1 right-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┘</span>

        {/* Left: Pixel Music Note Icon + Title + Artist */}
        <div className="flex items-center gap-3.5 min-w-0 pr-2">
          <div className="w-8 h-8 rounded bg-[#100730] border border-[#d7ff3f] text-[#d7ff3f] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(215,255,63,0.3)]">
            <Music2 className="w-4 h-4 text-[#d7ff3f]" />
          </div>

          <div className="flex flex-col min-w-0">
            <h2 className="text-xs sm:text-sm md:text-base font-pixel text-white font-bold tracking-wide truncate">
              {currentSong.title}
            </h2>
            <p className="text-[11px] sm:text-xs font-pixel text-[#00f0ff] truncate mt-0.5">
              {currentSong.artistName}
            </p>
          </div>
        </div>

        {/* Right: Tactile Like Button in Lime Bracket Box */}
        <button
          type="button"
          onClick={() => toggleLike(currentSong.id)}
          className={`p-2.5 rounded-lg border transition-all shrink-0 ${
            isLiked
              ? "bg-[#180a2b] border-[#d7ff3f] text-[#d7ff3f] shadow-[0_0_12px_rgba(215,255,63,0.5)]"
              : "bg-[#0e072b] border-[#4d2db7] text-[#a79cd0] hover:border-[#d7ff3f] hover:text-[#d7ff3f]"
          }`}
          aria-label={isLiked ? "Unlike song" : "Like song"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* 4. SCRUBBER PROGRESS BAR CONSOLE (exact match to reference) */}
      <div className="relative z-10 w-full rounded-xl bg-[#08041c] border-2 border-[#5c32c4] shadow-[0_0_20px_rgba(92,50,196,0.25)] px-4 sm:px-6 py-3 mb-2.5 flex items-center gap-4">
        {/* Corner notch brackets */}
        <span className="absolute top-1 left-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┌</span>
        <span className="absolute top-1 right-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┐</span>
        <span className="absolute bottom-1 left-2 text-[#5c32c4] font-mono text-xs leading-none select-none">└</span>
        <span className="absolute bottom-1 right-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┘</span>

        {/* Left timestamp: in neon lime font-pixel */}
        <span className="text-xs sm:text-sm font-pixel text-[#d7ff3f] font-bold w-12 text-left select-none shrink-0">
          {formatTime(progress)}
        </span>

        {/* Center Scrubber Bar */}
        <div className="relative flex-1 flex items-center group h-4">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={progress}
            onChange={handleSeekChange}
            className="absolute inset-0 w-full h-full bg-transparent cursor-pointer appearance-none z-10 opacity-0"
          />
          {/* Groove */}
          <div className="w-full h-2 bg-[#180e38] rounded-full overflow-hidden border border-[#3b1f80] flex items-center">
            <div
              className="h-full bg-[#d7ff3f] shadow-[0_0_10px_#d7ff3f] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Glowing lime thumb */}
          <div
            className="absolute w-4 h-3.5 bg-[#d7ff3f] rounded-full shadow-[0_0_12px_#d7ff3f] pointer-events-none -ml-2 transition-all border border-black"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Right timestamp: in white/cyan font-pixel */}
        <span className="text-xs sm:text-sm font-pixel text-white w-12 text-right select-none shrink-0">
          {formatTime(duration)}
        </span>
      </div>

      {/* 5. BOTTOM CONTROLS DECK CONSOLE (exact match to reference) */}
      <footer className="relative z-10 w-full rounded-xl bg-[#08041c] border-2 border-[#5c32c4] shadow-[0_0_25px_rgba(92,50,196,0.3)] px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
        {/* Corner notch brackets */}
        <span className="absolute top-1 left-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┌</span>
        <span className="absolute top-1 right-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┐</span>
        <span className="absolute bottom-1 left-2 text-[#5c32c4] font-mono text-xs leading-none select-none">└</span>
        <span className="absolute bottom-1 right-2 text-[#5c32c4] font-mono text-xs leading-none select-none">┘</span>

        {/* Left: Mini Artwork + Title (lime) + Artist (cyan) + mini EQ bars */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-1/4 min-w-[140px] sm:min-w-[180px] max-w-[260px]">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded overflow-hidden shrink-0 border border-[#ff2a85] shadow-[0_0_8px_rgba(255,42,133,0.3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSong.artworkUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-xs font-pixel text-[#d7ff3f] font-bold truncate">
              {currentSong.title}
            </span>
            <span className="text-[10px] sm:text-[11px] font-pixel text-[#00f0ff] truncate">
              {currentSong.artistName}
            </span>
          </div>

          {/* Mini animated green EQ bars */}
          <div className="hidden sm:flex items-end gap-0.5 h-3.5 w-3 shrink-0">
            <span className={`w-0.5 bg-[#00ff88] rounded-xs ${isPlaying ? "h-3 animate-pulse" : "h-1.5"}`} />
            <span className={`w-0.5 bg-[#00ff88] rounded-xs ${isPlaying ? "h-3.5 animate-bounce" : "h-2"}`} />
            <span className={`w-0.5 bg-[#00ff88] rounded-xs ${isPlaying ? "h-2 animate-pulse" : "h-1"}`} />
          </div>
        </div>

        {/* Center: Transport Controls [ 🔀 ] [ ⏮ ] [ ⏸ / ▶ ] [ ⏭ ] [ 🔁 ] */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Shuffle */}
          <button
            type="button"
            onClick={toggleShuffle}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border transition-all flex items-center justify-center ${
              isShuffle
                ? "bg-[#160c3c] text-[#d7ff3f] border-[#d7ff3f] shadow-[0_0_8px_rgba(215,255,63,0.4)]"
                : "bg-[#0e072b] border-[#4d2db7] text-white hover:text-[#00f0ff] hover:border-[#00f0ff]"
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={previous}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#4d2db7] bg-[#0e072b] text-white hover:text-[#00f0ff] hover:border-[#00f0ff] flex items-center justify-center active:translate-y-0.5 transition-all"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Giant Neon Lime Play/Pause Button (exact match to screenshot) */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-3 border-[#d7ff3f] bg-[#08041c] text-[#d7ff3f] flex items-center justify-center shadow-[0_0_20px_rgba(215,255,63,0.65)] hover:bg-[#d7ff3f]/10 active:scale-95 transition-all cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-[#d7ff3f] stroke-[#d7ff3f]" />
            ) : (
              <Play className="w-5 h-5 fill-[#d7ff3f] stroke-[#d7ff3f] ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={next}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#4d2db7] bg-[#0e072b] text-white hover:text-[#00f0ff] hover:border-[#00f0ff] flex items-center justify-center active:translate-y-0.5 transition-all"
            title="Next track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={toggleRepeat}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border transition-all flex items-center justify-center ${
              repeatMode !== "off"
                ? "bg-[#160c3c] text-[#d7ff3f] border-[#d7ff3f] shadow-[0_0_8px_rgba(215,255,63,0.4)]"
                : "bg-[#0e072b] border-[#4d2db7] text-white hover:text-[#00f0ff] hover:border-[#00f0ff]"
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

        {/* Right: Volume Deck + Queue + Fullscreen toggle */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5 w-1/4 min-w-[120px] sm:min-w-[180px] max-w-[260px]">
          {/* Volume */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#0e072b] border border-[#4d2db7] rounded-lg px-2.5 py-1 shadow-[0_0_8px_rgba(77,45,183,0.2)]">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[#a79cd0] hover:text-white transition-colors"
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

          {/* Queue Button */}
          <button
            type="button"
            onClick={() => {
              setExpandedPlayerOpen(false);
              setQueueOpen(true);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#4d2db7] bg-[#0e072b] text-white hover:text-[#00f0ff] hover:border-[#00f0ff] flex items-center justify-center transition-all"
            title="Open Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Minimize / Collapse Fullscreen */}
          <button
            type="button"
            onClick={() => setExpandedPlayerOpen(false)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#4d2db7] bg-[#0e072b] text-white hover:text-[#00f0ff] hover:border-[#00f0ff] flex items-center justify-center transition-all"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
