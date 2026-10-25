"use client";

import React from "react";
import { Song } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Heart } from "lucide-react";

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
  showAlbum = true,
}: SongRowProps) {
  const { currentSong, isPlaying, playSong, togglePlay, likedSongIds, toggleLike } =
    usePlayer();

  const isCurrent = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const isLiked = likedSongIds.has(song.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlistContext);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(song.id);
  };

  return (
    <div
      onClick={handlePlayClick}
      className={`group flex items-center justify-between px-3 py-2 rounded-none transition-all cursor-pointer select-none border ${
        isCurrent
          ? "bg-[#181818] border-[#D7FF3F] text-white shadow-[2px_2px_0px_#000000]"
          : "bg-transparent border-transparent hover:bg-[#141414] hover:border-white/10 hover:shadow-[2px_2px_0px_#000000] text-[#A1A1AA] hover:text-white"
      }`}
    >
      {/* Left: Index / Play Button + Artwork + Title & Artist */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Track Number / Pixel Equalizer / Play indicator */}
        <div className="w-7 flex items-center justify-center shrink-0">
          {isCurrentlyPlaying ? (
            /* Pixel animated equalizer blocks */
            <div className="flex items-end gap-1 h-3.5" title="Playing">
              <span className="w-1 bg-[#D7FF3F] h-3 animate-pulse" />
              <span className="w-1 bg-[#D7FF3F] h-4 animate-bounce" />
              <span className="w-1 bg-[#D7FF3F] h-2 animate-pulse" />
            </div>
          ) : (
            <>
              <span className="text-[11px] font-pixel text-[#71717A] group-hover:hidden">
                {String(index + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handlePlayClick}
                className="hidden group-hover:flex items-center justify-center text-white hover:text-[#D7FF3F] transition-colors"
                aria-label={`Play ${song.title}`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail artwork with pixel border */}
        <div className="relative w-9 h-9 rounded-none overflow-hidden shrink-0 bg-[#222222] border border-black shadow-[1px_1px_0px_rgba(255,255,255,0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={song.artworkUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Song & Artist details */}
        <div className="flex flex-col min-w-0 pr-2">
          <span
            className={`text-xs font-pixel tracking-wide truncate ${
              isCurrent ? "text-[#D7FF3F] font-bold" : "text-white"
            }`}
          >
            {song.title}
          </span>
          <span className="text-[11px] text-[#71717A] truncate group-hover:text-[#A1A1AA] transition-colors">
            {song.artistName}
          </span>
        </div>
      </div>

      {/* Center: Optional Album Title */}
      {showAlbum && song.albumTitle && (
        <div className="hidden md:block flex-1 min-w-0 px-4 text-left">
          <span className="text-xs text-[#71717A] truncate hover:text-white transition-colors block">
            {song.albumTitle}
          </span>
        </div>
      )}

      {/* Right: Heart + Duration */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={handleLikeClick}
          className={`p-1 transition-colors ${
            isLiked
              ? "text-rose-400"
              : "text-[#52525B] hover:text-white opacity-0 group-hover:opacity-100"
          }`}
          aria-label={isLiked ? "Unlike song" : "Like song"}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isLiked ? "fill-current" : ""
            }`}
          />
        </button>

        <span className="text-[11px] font-pixel text-[#71717A] w-12 text-right">
          {song.durationFormatted}
        </span>
      </div>
    </div>
  );
}
