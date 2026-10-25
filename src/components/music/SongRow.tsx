"use client";

import React from "react";
import { Song } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause } from "lucide-react";

interface SongRowProps {
  song: Song;
  index: number;
  playlistContext?: Song[];
  showAlbum?: boolean;
}

export function SongRow({
  song,
  index,
  playlistContext,
}: SongRowProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const isCurrent = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlistContext);
    }
  };

  return (
    <div
      onClick={handlePlayClick}
      className={`group flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer select-none border ${
        isCurrent
          ? "bg-[#140a3d] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          : "bg-[#0c0628] border-[#4d2db7] hover:border-[#00f0ff] hover:bg-[#140a3d] shadow-[0_0_10px_rgba(77,45,183,0.15)]"
      }`}
    >
      {/* Left: Artwork + Badge + Equalizer + Title & Artist */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Artwork with glowing pink border */}
        <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 border border-[#ff2a85] shadow-[0_0_8px_rgba(255,42,133,0.3)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={song.artworkUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Index Badge [ 01 ] */}
        <div className="px-2 py-0.5 rounded bg-[#160c3c] border border-[#5c32c4] text-white text-xs font-pixel shrink-0">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Animated Neon Equalizer Bars */}
        <div className="flex items-end gap-0.5 h-4 w-4 shrink-0" title="Audio Signal">
          <span
            className={`w-1 bg-[#00ff88] rounded-xs transition-all ${
              isCurrentlyPlaying ? "h-3 animate-pulse" : "h-2 opacity-60"
            }`}
          />
          <span
            className={`w-1 bg-[#00f0ff] rounded-xs transition-all ${
              isCurrentlyPlaying ? "h-4 animate-bounce" : "h-3.5 opacity-60"
            }`}
          />
          <span
            className={`w-1 bg-[#d7ff3f] rounded-xs transition-all ${
              isCurrentlyPlaying ? "h-2.5 animate-pulse" : "h-1.5 opacity-60"
            }`}
          />
        </div>

        {/* Song & Artist details */}
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-xs sm:text-sm font-pixel text-white font-bold tracking-wide truncate group-hover:text-[#00f0ff] transition-colors">
            {song.title}
          </span>
          <span className="text-[11px] font-pixel text-[#00f0ff] truncate mt-0.5">
            {song.artistName}
          </span>
        </div>
      </div>

      {/* Right: Duration + Tactile Square Play Button */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-xs font-pixel text-white tracking-wider">
          {song.durationFormatted}
        </span>

        <button
          type="button"
          onClick={handlePlayClick}
          className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${
            isCurrentlyPlaying
              ? "bg-[#d7ff3f] text-black border-[#d7ff3f] shadow-[0_0_10px_rgba(215,255,63,0.5)]"
              : "bg-[#160c3c] border-[#5c32c4] text-white hover:bg-[#ff2a85] hover:border-[#ff2a85] hover:shadow-[0_0_10px_rgba(255,42,133,0.5)]"
          }`}
          aria-label={isCurrentlyPlaying ? "Pause track" : "Play track"}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
