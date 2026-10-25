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
      className={`group relative flex flex-col p-3 rounded-lg bg-[#0c0628] border transition-all cursor-pointer select-none ${
        isCurrent
          ? "border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.35)]"
          : "border-[#4d2db7] shadow-[0_0_10px_rgba(77,45,183,0.2)] hover:border-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:-translate-y-0.5"
      }`}
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded overflow-hidden bg-[#180e38] border border-[#ff2a85] mb-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={song.artworkUrl}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Tactile Retro Square Play Button */}
        <div
          className={`absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 rounded bg-[#d7ff3f] text-black border-2 border-black shadow-[0_0_10px_rgba(215,255,63,0.5)] transition-all ${
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

      {/* Track Metadata */}
      <div className="flex flex-col min-w-0">
        <h4
          className={`text-xs font-pixel tracking-wide truncate transition-colors ${
            isCurrent ? "text-[#00f0ff] font-bold" : "text-white group-hover:text-[#00f0ff]"
          }`}
        >
          {song.title}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-[#a79cd0] mt-0.5">
          <span className="truncate group-hover:text-white transition-colors">
            {song.artistName}
          </span>
          <span className="font-pixel text-[10px] shrink-0 ml-1 text-[#ff2a85]">
            {song.durationFormatted}
          </span>
        </div>
      </div>
    </div>
  );
}
