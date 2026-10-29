"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Song } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, ListPlus } from "lucide-react";
import { AddToTapeModal } from "./AddToTapeModal";

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
  const router = useRouter();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const [tapeModalOpen, setTapeModalOpen] = useState(false);

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

  const handleRowClick = () => {
    if (!isCurrent) {
      playSong(song, playlistContext);
    }
    router.push(`/song/${song.id}`);
  };

  return (
    <div
      onClick={handleRowClick}
      className="group flex items-center justify-between p-2.5 transition-all cursor-pointer select-none font-mono"
      style={{
        backgroundColor: isCurrent ? "#F6EEDE" : "#FAF7EE",
        border: "2px solid #111111",
        boxShadow: isCurrent ? "3px 3px 0px #111111" : "2px 2px 0px #111111",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#F6EEDE";
        e.currentTarget.style.transform = "translate(-1px,-1px)";
        e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isCurrent ? "#F6EEDE" : "#FAF7EE";
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = isCurrent ? "3px 3px 0px #111111" : "2px 2px 0px #111111";
      }}
    >
      {/* Left: Artwork + Badge + Equalizer + Title & Artist */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Artwork with sharp border */}
        <div
          className="relative w-10 h-10 shrink-0 overflow-hidden"
          style={{ border: "1.5px solid #111111" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={song.artworkUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Index Badge [ 01 ] */}
        <div
          className="px-2 py-0.5 text-xs font-mono font-bold shrink-0 text-[#7A7166]"
          style={{
            backgroundColor: "#FAF7EE",
            border: "1px solid #111111",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Animated Equalizer Bars in Orange */}
        <div className="flex items-end gap-0.5 h-4 w-4 shrink-0" title="Audio Signal">
          <span
            className="w-1 rounded-xs transition-all"
            style={{
              backgroundColor: "#F05A28",
              height: isCurrentlyPlaying ? "12px" : "6px",
              opacity: isCurrentlyPlaying ? 1 : 0.45,
            }}
          />
          <span
            className="w-1 rounded-xs transition-all"
            style={{
              backgroundColor: "#F05A28",
              height: isCurrentlyPlaying ? "16px" : "10px",
              opacity: isCurrentlyPlaying ? 1 : 0.45,
            }}
          />
          <span
            className="w-1 rounded-xs transition-all"
            style={{
              backgroundColor: "#F05A28",
              height: isCurrentlyPlaying ? "9px" : "4px",
              opacity: isCurrentlyPlaying ? 1 : 0.45,
            }}
          />
        </div>

        {/* Song & Artist details */}
        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-bold uppercase text-[#111111] tracking-wide truncate group-hover:text-[#F05A28] transition-colors">
              {song.title}
            </span>
            {song.videoUrl && (
              <span className="shrink-0 px-1 py-0.2 text-[9px] font-black uppercase text-[#F05A28] border border-[#F05A28] bg-[#FFF0ED]">
                🎬 MP4
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#7A7166] font-mono truncate mt-0.5">
            {song.artistName}
          </span>
        </div>
      </div>

      {/* Right: Duration + Add to Tape + Tactile Square Play Button */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <span className="text-xs font-bold text-[#7A7166] font-mono tracking-wider hidden sm:inline">
          {song.durationFormatted}
        </span>

        {/* Record to Tape Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTapeModalOpen(true);
          }}
          className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer group/btn"
          style={{
            backgroundColor: "#FAF7EE",
            color: "#111111",
            border: "1.5px solid #111111",
            boxShadow: "1.5px 1.5px 0px #111111",
          }}
          title="Record signal to cassette tape"
          aria-label="Record signal to cassette tape"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F6EEDE";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FAF7EE";
          }}
        >
          <ListPlus className="w-3.5 h-3.5 group-hover/btn:text-[#F05A28] transition-colors" />
        </button>

        <button
          type="button"
          onClick={handlePlayClick}
          className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
          style={{
            backgroundColor: isCurrentlyPlaying ? "#F05A28" : "#111111",
            color: "#FFFFFF",
            border: "1.5px solid #111111",
            boxShadow: "1.5px 1.5px 0px #111111",
          }}
          aria-label={isCurrentlyPlaying ? "Pause track" : "Play track"}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Add To Tape Modal */}
      {tapeModalOpen && (
        <AddToTapeModal
          song={song}
          isOpen={tapeModalOpen}
          onClose={() => setTapeModalOpen(false)}
        />
      )}
    </div>
  );
}
