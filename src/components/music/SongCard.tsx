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
      className={`group relative flex flex-col p-2.5 rounded-none bg-[#121212] border-2 transition-all cursor-pointer select-none ${
        isCurrent
          ? "border-[#D7FF3F] shadow-[3px_3px_0px_#D7FF3F]"
          : "border-black shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] hover:-translate-y-0.5 hover:border-white/20"
      }`}
    >
      {/* Artwork Container with Pixel Border */}
      <div className="relative aspect-square w-full rounded-none overflow-hidden bg-[#1c1c1c] border border-black mb-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={song.artworkUrl}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Tactile Retro Square Play Button */}
        <div
          className={`absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 rounded-none bg-[#D7FF3F] text-black border border-black shadow-[2px_2px_0px_#000] transition-all ${
            isCurrentlyPlaying
              ? "opacity-100 scale-100"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-black stroke-black" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-black stroke-black ml-0.5" />
          )}
        </div>
      </div>

      {/* Cartridge Metadata */}
      <div className="flex flex-col min-w-0">
        <h4
          className={`text-xs font-pixel tracking-wide truncate transition-colors ${
            isCurrent ? "text-[#D7FF3F] font-bold" : "text-white group-hover:text-[#D7FF3F]"
          }`}
        >
          {song.title}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-[#71717A] mt-0.5">
          <span className="truncate group-hover:text-[#A1A1AA] transition-colors">
            {song.artistName}
          </span>
          <span className="font-pixel text-[10px] shrink-0 ml-1 text-[#52525B]">
            {song.durationFormatted}
          </span>
        </div>
      </div>
    </div>
  );
}
