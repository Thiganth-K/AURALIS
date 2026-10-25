"use client";

import React from "react";
import { Song } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause } from "lucide-react";

interface SongCardProps {
  song: Song;
  playlistContext?: Song[];
}

export function SongCard({ song, playlistContext }: SongCardProps) {
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
      className="group relative flex flex-col p-3 rounded-xl bg-[#111111] hover:bg-[#181818] border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer select-none"
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#222222] mb-3 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={song.artworkUrl}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Hover / Active Floating Play Button */}
        <div
          className={`absolute bottom-2 right-2 flex items-center justify-center w-10 h-10 rounded-full bg-[#D7FF3F] text-black shadow-lg shadow-black/60 transition-all duration-200 ${
            isCurrentlyPlaying
              ? "opacity-100 scale-100"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-4 h-4 fill-black stroke-black" />
          ) : (
            <Play className="w-4 h-4 fill-black stroke-black ml-0.5" />
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-col">
        <h4
          className={`text-sm font-semibold truncate ${
            isCurrent ? "text-[#D7FF3F]" : "text-white"
          }`}
        >
          {song.title}
        </h4>
        <p className="text-xs text-[#A1A1AA] truncate mt-0.5">
          {song.artistName}
        </p>
      </div>
    </div>
  );
}
