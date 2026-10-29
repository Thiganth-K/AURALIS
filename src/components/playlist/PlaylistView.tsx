"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlaylistDTO, SongDTO } from "@/types/music";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import {
  Play,
  Pause,
  Shuffle,
  ArrowLeft,
  ArrowUpRight,
  Heart,
  Music2,
  Radio,
} from "lucide-react";

interface PlaylistViewProps {
  playlist: PlaylistDTO;
  songs: SongDTO[];
}

export function PlaylistView({ playlist, songs }: PlaylistViewProps) {
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    likedSongIds,
    playSong,
    togglePlay,
    toggleLike,
    isShuffle,
    toggleShuffle,
  } = usePlayer();

  const [copied, setCopied] = useState(false);

  // Split playlist name into words for stacked title (e.g., "GOLDEN", "HOUR", "TAPE")
  const nameWords = playlist.name ? playlist.name.split(" ") : ["PLAYLIST"];

  // Total runtime calculation
  const totalSeconds = songs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const runtimeFormatted = `${totalMinutes}M ${remainingSeconds.toString().padStart(2, "0")}S`;

  const isCurrentPlaylistPlaying =
    isPlaying && songs.some((s) => s.id === currentSong?.id);

  const activeDuration = duration > 0 ? duration : 180;
  const progressRatio = isCurrentPlaylistPlaying && activeDuration > 0
    ? Math.min(Math.max(progress / activeDuration, 0), 1)
    : 0.22; // default analog tape position indicator ~22%

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playSong(songs[0], songs);
    }
  };

  const handleShufflePlay = () => {
    if (songs.length === 0) return;
    if (!isShuffle) {
      toggleShuffle();
    }
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex], songs);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 space-y-4 select-none font-mono text-[#111111]">
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── TOP BREADCRUMB & BACK NAV ── */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="flex items-center gap-1.5 px-3 py-1 font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: "#FAF7EE",
            border: "1.5px solid #111111",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F6EEDE";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FAF7EE";
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#111111]" />
          <span className="text-[#111111] font-bold text-xs">Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono tracking-wide">
          <Link
            href="/home"
            className="text-[#7A7166] hover:text-[#111111] transition-colors"
          >
            Home
          </Link>
          <span className="text-[#A3998D]">//</span>
          <span className="text-[#7A7166]">Playlist</span>
          <span className="text-[#A3998D]">//</span>
          <span className="font-bold text-[#111111]">{playlist.name}</span>
        </div>
      </div>

      {/* ── 1. HERO BANNER CARD ── */}
      <div
        className="relative p-6 sm:p-7 overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "2.5px 2.5px 0px #111111",
        }}
      >
        {/* Corner Crop Marks in Orange (#F05A28) */}
        <span
          className="absolute top-1.5 right-2 text-xl font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┐
        </span>
        <span
          className="absolute bottom-1.5 right-2 text-xl font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┘
        </span>

        {/* ── CONCENTRIC GROOVE LINES & VINYL RECORD (RIGHT SIDE) ── */}
        <div className="absolute top-0 right-0 bottom-0 w-80 lg:w-96 pointer-events-none overflow-hidden hidden md:block">
          {/* Subtle Concentric Radiating Groove Arcs */}
          <svg
            className="absolute top-0 right-0 w-full h-full opacity-60"
            viewBox="0 0 400 360"
            fill="none"
          >
            <circle cx="380" cy="180" r="120" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="3 1" />
            <circle cx="380" cy="180" r="150" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="380" cy="180" r="180" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="380" cy="180" r="210" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="380" cy="180" r="240" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="380" cy="180" r="270" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="5 2" />
            <circle cx="380" cy="180" r="300" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="380" cy="180" r="330" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="380" cy="180" r="360" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="6 3" />
            <circle cx="380" cy="180" r="390" stroke="#DFD5C0" strokeWidth="1" />
          </svg>

          {/* Vinyl Record Platter peeking in from right */}
          <div
            className="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full overflow-hidden"
            style={{
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              border: "2px solid #111111",
              animation: isCurrentPlaylistPlaying ? "vinylSpin 8s linear infinite" : "none",
            }}
          >
            {/* Outer Disc Body with Grooves */}
            <div
              className="w-full h-full rounded-full relative flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle, #252525 0%, #151515 50%, #0d0d0d 85%, #050505 100%)",
              }}
            >
              {/* Subtle Grooves Texture */}
              <div
                className="absolute inset-3 rounded-full border border-white/5 pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 0 6px rgba(255,255,255,0.02), inset 0 0 0 14px rgba(0,0,0,0.4), inset 0 0 0 22px rgba(255,255,255,0.03), inset 0 0 0 32px rgba(0,0,0,0.5), inset 0 0 0 42px rgba(255,255,255,0.03)",
                }}
              />

              {/* Light Sheen */}
              <div
                className="absolute inset-0 pointer-events-none rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, rgba(255,255,255,0.06) 60%, transparent 100%)",
                }}
              />

              {/* Orange Center Label */}
              <div
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center relative border border-[#111111] z-10"
                style={{
                  backgroundColor: "#F05A28",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                }}
              >
                {/* Center Spindle Hole */}
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                  }}
                >
                  <div className="w-1 h-1 rounded-full bg-[#111111]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT (LEFT CARD + CENTER DETAILS) ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8 relative z-10">
          {/* ── LEFT: CASSETTE / VINYL CARD ── */}
          <div
            className="w-56 sm:w-60 md:w-64 shrink-0 overflow-hidden"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            {/* Pristine Clean Artwork Image (No cluttering text overlays) */}
            <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-[#181818]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  playlist.artworkUrl ||
                  "https://res.cloudinary.com/dvgllw3rq/image/upload/v1793273289/auralis/artwork/qclsrhggy4iytsp0drhq.jpg"
                }
                alt={playlist.name}
                className="w-full h-full object-cover block"
              />
            </div>

            {/* Bottom Scrubber Compartment */}
            <div
              className="h-10 px-3 flex items-center justify-between gap-3"
              style={{
                backgroundColor: "#FAF7EE",
                borderTop: "1.5px solid #111111",
              }}
            >
              {/* Play Trigger (Outline Play Triangle ▷) */}
              <button
                type="button"
                onClick={handlePlayAll}
                className="cursor-pointer transition-transform hover:scale-110 flex items-center justify-center p-0.5"
                title={isCurrentPlaylistPlaying ? "Pause" : "Play"}
              >
                {isCurrentPlaylistPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-[#111111]" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-[#111111] fill-none stroke-[2]" />
                )}
              </button>

              {/* Progress Line with Orange Scrubber Knob */}
              <div className="flex-1 relative flex items-center">
                <div className="w-full h-[1.5px] bg-[#C8BFB0] relative">
                  <div
                    className="h-full bg-[#F05A28]"
                    style={{ width: `${progressRatio * 100}%` }}
                  />
                  {/* Scrubber Knob */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#111111]"
                    style={{
                      left: `calc(${progressRatio * 100}% - 4px)`,
                      backgroundColor: "#F05A28",
                    }}
                  />
                </div>
              </div>

              {/* Tape Spool Icon ⊙ */}
              <div className="w-3 h-3 rounded-full border border-[#111111] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
              </div>
            </div>
          </div>

          {/* ── CENTER: TITLE, DESCRIPTION, BUTTONS & STATS ── */}
          <div className="flex-1 min-w-0 space-y-3.5 max-w-xl">
            {/* Category / Subtitle with orange underline */}
            <div>
              <span className="text-[11px] font-black tracking-[0.25em] uppercase text-[#F05A28] border-b-2 border-[#F05A28] pb-0.5 inline-block">
                AURALIS
              </span>
            </div>

            {/* Giant Stacked Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-[#111111] tracking-tight leading-[1.05]">
              {nameWords.map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </h1>

            {/* Description */}
            <p className="text-xs text-[#4A433A] font-mono leading-relaxed max-w-md">
              {playlist.description ||
                "Sunlit downtempo rhythms pressed through analog warmth. A high-fidelity soundtrack for golden hours and evening drift."}
            </p>

            {/* Action Buttons Row: PLAY CASSETTE, SHUFFLE, SHARE */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* PLAY CASSETTE */}
              <button
                type="button"
                onClick={handlePlayAll}
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: "#F05A28",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2.5px 2.5px 0px #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e84e1d";
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                  e.currentTarget.style.boxShadow = "3.5px 3.5px 0px #111111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F05A28";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111";
                }}
              >
                {isCurrentPlaylistPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>PAUSE CASSETTE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY CASSETTE</span>
                  </>
                )}
              </button>

              {/* SHUFFLE */}
              <button
                type="button"
                onClick={handleShufflePlay}
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: "#FAF7EE",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2.5px 2.5px 0px #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F6EEDE";
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                  e.currentTarget.style.boxShadow = "3.5px 3.5px 0px #111111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FAF7EE";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111";
                }}
              >
                <Shuffle className="w-3.5 h-3.5 text-[#111111]" />
                <span>SHUFFLE</span>
              </button>

              {/* SHARE */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: "#FAF7EE",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2.5px 2.5px 0px #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F6EEDE";
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                  e.currentTarget.style.boxShadow = "3.5px 3.5px 0px #111111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FAF7EE";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111";
                }}
                title="Copy Playlist Share Link"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-[#111111]" />
                <span>{copied ? "COPIED!" : "SHARE"}</span>
              </button>
            </div>

            {/* Connected Metadata Stats Boxes */}
            <div
              className="inline-flex items-stretch mt-3 font-mono"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1px solid #111111",
              }}
            >
              {/* Box 1: Track Count */}
              <div
                className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center text-[#111111]"
                style={{ borderRight: "1px solid #111111" }}
              >
                {songs.length} {songs.length === 1 ? "TRACK" : "TRACKS"}
              </div>

              {/* Box 2: Runtime */}
              <div
                className="px-3.5 py-1 flex flex-col justify-center leading-tight"
                style={{ borderRight: "1px solid #111111" }}
              >
                <span className="text-[9px] font-bold tracking-wider text-[#7A7166] uppercase">
                  RUNTIME:
                </span>
                <span className="text-xs font-bold text-[#111111] uppercase tracking-wider mt-0.5">
                  {runtimeFormatted}
                </span>
              </div>

              {/* Box 3: Curator */}
              <div className="px-3.5 py-1 flex flex-col justify-center leading-tight">
                <span
                  className="text-[9px] font-bold tracking-wider uppercase"
                  style={{ color: "#F05A28" }}
                >
                  CURATOR:
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-wider mt-0.5"
                  style={{ color: "#F05A28" }}
                >
                  {playlist.ownerName?.toUpperCase() || "AURALIS ADMIN"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. CASSETTE TRACK DIRECTORY // SIGNALS TABLE ── */}
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "2.5px 2.5px 0px #111111",
        }}
      >
        {/* Table Top Header Bar */}
        <div
          className="px-4 py-2.5 flex items-center justify-between border-b-2 border-[#111111]"
          style={{ backgroundColor: "#FAF7EE" }}
        >
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#F05A28]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              CASSETTE TRACK DIRECTORY // {songs.length} SIGNALS
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[#111111] uppercase tracking-wider">
            STUDIO FLAC 24-BIT
          </span>
        </div>

        {songs.length === 0 ? (
          <div className="p-10 text-center space-y-3 font-mono">
            <Music2 className="w-8 h-8 mx-auto text-[#7A7166]" />
            <p className="text-sm font-bold uppercase text-[#111111]">
              NO TRACKS LOADED ONTO THIS CASSETTE
            </p>
            <p className="text-xs text-[#7A7166]">
              Add songs from the catalog or explore discovery streams.
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase mt-2"
              style={{
                backgroundColor: "#F05A28",
                color: "#111111",
                border: "2px solid #111111",
                boxShadow: "2px 2px 0px #111111",
              }}
            >
              EXPLORE DISCOVERY
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr
                  className="border-b-2 border-[#111111] text-[10px] uppercase font-bold text-[#7A7166]"
                  style={{ backgroundColor: "#F4EDE0" }}
                >
                  <th className="py-2 px-4 w-14 text-center">#</th>
                  <th className="py-2 px-4">TITLE & ARTIST</th>
                  <th className="py-2 px-4 hidden md:table-cell">ALBUM</th>
                  <th className="py-2 px-4 hidden sm:table-cell text-center">GENRE</th>
                  <th className="py-2 px-4 w-24 text-right">TIME</th>
                  <th className="py-2 px-4 w-20 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/15">
                {songs.map((song) => {
                  const isThisPlaying = currentSong?.id === song.id && isPlaying;
                  const isCurrentSelected = currentSong?.id === song.id;
                  const isLiked = likedSongIds.has(song.id);

                  return (
                    <tr
                      key={song.id}
                      className="group transition-colors cursor-pointer"
                      style={{
                        backgroundColor: isCurrentSelected ? "#FFF0ED" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrentSelected) {
                          e.currentTarget.style.backgroundColor = "#F6EEDE";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrentSelected) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {/* Play Action / Triangle Indicator */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (isThisPlaying) {
                                togglePlay();
                              } else {
                                playSong(song, songs);
                              }
                            }}
                            className="w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-[11px] transition-all cursor-pointer"
                            style={{
                              backgroundColor: isThisPlaying ? "#F05A28" : "#FAF7EE",
                              color: isThisPlaying ? "#FAF7EE" : "#111111",
                              border: "1.5px solid #111111",
                            }}
                            title={isThisPlaying ? "Pause" : "Play"}
                          >
                            {isThisPlaying ? (
                              <Pause className="w-2.5 h-2.5 fill-current" />
                            ) : (
                              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                            )}
                          </button>

                          {/* Orange Play Triangle Indicator */}
                          <span
                            className="text-xs font-black select-none"
                            style={{ color: "#F05A28" }}
                          >
                            ▶
                          </span>
                        </div>
                      </td>

                      {/* Title & Artist */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={song.artworkUrl}
                            alt={song.title}
                            className="w-9 h-9 object-cover shrink-0"
                            style={{ border: "1.5px solid #111111" }}
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/song/${song.id}`}
                              className="font-bold text-[#111111] hover:text-[#F05A28] uppercase truncate block transition-colors tracking-wide text-xs"
                            >
                              {song.title}
                            </Link>
                            <span className="text-[11px] text-[#7A7166] uppercase truncate block mt-0.5">
                              {song.artistName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Album Column */}
                      <td className="py-2.5 px-4 hidden md:table-cell text-[#111111] uppercase truncate max-w-xs font-bold text-xs">
                        {playlist.name}
                      </td>

                      {/* Genre Column (Pill Box) */}
                      <td className="py-2.5 px-4 hidden sm:table-cell text-center">
                        <span
                          className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider inline-block"
                          style={{
                            backgroundColor: "#FAF7EE",
                            border: "1px solid #111111",
                            color: "#111111",
                          }}
                        >
                          {song.genre?.toUpperCase() || "ELECTRONIC"}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-2.5 px-4 text-right font-mono text-xs font-bold text-[#111111]">
                        {formatTime(song.duration)}
                      </td>

                      {/* Like Action */}
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(song.id);
                          }}
                          className="p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title={isLiked ? "Unlike track" : "Like track"}
                        >
                          <Heart
                            className="w-4 h-4 transition-transform hover:scale-110"
                            style={{
                              color: isLiked ? "#D62828" : "#7A7166",
                              fill: isLiked ? "#D62828" : "none",
                            }}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
