"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Song } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause } from "lucide-react";

interface SongCardProps {
  song: Song;
  playlistContext?: Song[];
}

export function SongCard({ song, playlistContext }: SongCardProps) {
  const router = useRouter();
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

  const handleCardClick = () => {
    if (!isCurrent) {
      playSong(song, playlistContext);
    }
    router.push(`/song/${song.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col p-3 transition-all cursor-pointer select-none font-mono"
      style={{
        backgroundColor: "#FAF7EE",
        border: "2px solid #111111",
        boxShadow: isCurrent ? "4px 4px 0px #111111" : "3px 3px 0px #111111",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-1.5px,-1.5px)";
        e.currentTarget.style.boxShadow = "4px 4px 0px #111111";
        e.currentTarget.style.backgroundColor = "#F6EEDE";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = isCurrent ? "4px 4px 0px #111111" : "3px 3px 0px #111111";
        e.currentTarget.style.backgroundColor = "#FAF7EE";
      }}
    >
      {/* Corner crop ticks */}
      <span className="absolute top-1 left-1.5 text-[10px] font-mono leading-none select-none text-[#F05A28]">
        ┌
      </span>
      <span className="absolute bottom-1 right-1.5 text-[10px] font-mono leading-none select-none text-[#F05A28]">
        ┘
      </span>

      {/* Artwork Container */}
      <div
        className="relative aspect-square w-full overflow-hidden mb-2.5"
        style={{ border: "1.5px solid #111111", backgroundColor: "#F6EEDE" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={song.artworkUrl}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Tactile Retro Square Play Button */}
        <div
          onClick={handlePlayClick}
          className={`absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 transition-all ${
            isCurrentlyPlaying
              ? "opacity-100 scale-100"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
          style={{
            backgroundColor: isCurrentlyPlaying ? "#F05A28" : "#111111",
            color: "#FFFFFF",
            border: "1.5px solid #111111",
            boxShadow: "2px 2px 0px #111111",
          }}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </div>
      </div>

      <div className="flex flex-col min-w-0">
        <h4 className="text-xs font-bold uppercase text-[#111111] group-hover:text-[#F05A28] transition-colors truncate">
          {song.title}
        </h4>
        <p className="text-[11px] text-[#7A7166] font-mono truncate mt-0.5">
          {song.artistName}
        </p>
      </div>
    </div>
  );
}
