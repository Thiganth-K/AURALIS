"use client";

import React from "react";
import { Song } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, Heart, MoreHorizontal } from "lucide-react";

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
      className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer select-none ${
        isCurrent
          ? "bg-[#181818] text-white"
          : "hover:bg-[#151515] text-[#A1A1AA] hover:text-white"
      }`}
    >
      {/* Left: Index / Play Button + Artwork + Title & Artist */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Track Number / Equalizer / Play indicator */}
        <div className="w-6 flex items-center justify-center shrink-0">
          {isCurrentlyPlaying ? (
            /* Mini animated equalizer bars */
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-0.5 bg-[#D7FF3F] animate-pulse h-3" />
              <span className="w-0.5 bg-[#D7FF3F] animate-pulse h-4" />
              <span className="w-0.5 bg-[#D7FF3F] animate-pulse h-2" />
            </div>
          ) : (
            <>
              <span className="text-xs font-mono text-[#71717A] group-hover:hidden">
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

        {/* Thumbnail artwork */}
        <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-[#222222]">
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
            className={`text-sm font-medium truncate ${
              isCurrent ? "text-[#D7FF3F]" : "text-white"
            }`}
          >
            {song.title}
          </span>
          <span className="text-xs text-[#71717A] truncate group-hover:text-[#A1A1AA] transition-colors">
            {song.artistName}
          </span>
        </div>
      </div>

      {/* Middle: Album Name (Desktop) */}
      {showAlbum && (
        <div className="hidden md:block flex-1 max-w-xs text-xs text-[#71717A] truncate group-hover:text-[#A1A1AA] transition-colors px-4">
          {song.albumTitle || "—"}
        </div>
      )}

      {/* Right: Like Button + Duration + Context Menu */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={handleLikeClick}
          className={`p-1.5 rounded-full transition-colors ${
            isLiked
              ? "text-[#D7FF3F]"
              : "text-[#71717A] opacity-0 group-hover:opacity-100 hover:text-white"
          }`}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <Heart
            className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
          />
        </button>

        <span className="text-xs font-mono text-[#71717A] w-10 text-right">
          {song.durationFormatted}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="p-1 rounded text-[#71717A] opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
