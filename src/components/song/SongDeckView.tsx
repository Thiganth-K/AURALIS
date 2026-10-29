"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Song } from "@/types";
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
  ChevronLeft,
  ListMusic,
  Volume2,
  VolumeX,
  Volume1,
  Radio,
  Music2,
  Disc3,
  Calendar,
} from "lucide-react";

interface SongDeckViewProps {
  song: Song;
  playlistContext?: Song[];
}

export function SongDeckView({ song, playlistContext = [] }: SongDeckViewProps) {
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    likedSongIds,
    playSong,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    setQueueOpen,
  } = usePlayer();

  const { user } = useAuth();

  // On mount: if the current playing song is not this song, load and play this song!
  useEffect(() => {
    if (!currentSong || currentSong.id !== song.id) {
      playSong(song, playlistContext.length > 0 ? playlistContext : [song]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.id]);

  const activeTrack = currentSong && currentSong.id === song.id ? currentSong : song;
  const isThisPlaying = currentSong?.id === song.id && isPlaying;
  const isLiked = likedSongIds.has(song.id);
  const activeDuration = duration > 0 ? duration : song.duration || 180;
  const progressPercent = activeDuration > 0 ? (progress / activeDuration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleMainPlay = () => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, playlistContext.length > 0 ? playlistContext : [song]);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between p-3 sm:p-6 select-none font-mono"
      style={{ backgroundColor: "#FAF7EE" }}
    >
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* 1. TOP HEADER CONSOLE */}
      <header
        className="relative z-10 w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-2"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Corner notch brackets */}
        <span className="absolute top-1 left-2 text-xs font-mono leading-none select-none" style={{ color: "#F05A28" }}>
          ┌
        </span>
        <span className="absolute top-1 right-2 text-xs font-mono leading-none select-none" style={{ color: "#F05A28" }}>
          ┐
        </span>
        <span className="absolute bottom-1 left-2 text-xs font-mono leading-none select-none" style={{ color: "#F05A28" }}>
          └
        </span>
        <span className="absolute bottom-1 right-2 text-xs font-mono leading-none select-none" style={{ color: "#F05A28" }}>
          ┘
        </span>

        {/* Left: Back to Home button + AURALIS Logo Pill */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
              color: "#111111",
            }}
            title="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1 cursor-pointer transition-colors hover:bg-[#F6EEDE]"
            style={{
              backgroundColor: "#F6EEDE",
              border: "1.5px solid #111111",
            }}
          >
            <div className="flex items-end gap-[2px] h-3.5 w-3.5">
              <span className="w-1 bg-[#F05A28] h-2.5" />
              <span className="w-1 bg-[#F05A28] h-3.5" />
              <span className="w-1 bg-[#F05A28] h-1.5" />
            </div>
            <span className="font-black text-xs tracking-wider text-[#111111] uppercase">
              AURALIS DECK
            </span>
          </Link>
        </div>

        {/* Center: System Header Tag */}
        <div className="hidden md:flex flex-col items-center">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: "#F05A28" }}>
            // NOW PLAYING
          </span>
          <span className="text-xs font-black tracking-widest text-[#111111] uppercase">
            AURALIS HI-FI • STUDIO DECK
          </span>
        </div>

        {/* Right: Spec Pill & Profile Tag */}
        <div className="flex items-center gap-2.5">
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
              color: "#111111",
            }}
          >
            <Radio className="w-3 h-3 animate-pulse" style={{ color: "#F05A28" }} />
            <span>FLAC // 24-BIT 96kHz</span>
          </div>

          <div
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold uppercase"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
              color: "#111111",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              }
              alt="User"
              className="w-5 h-5 rounded-full object-cover"
              style={{ border: "1px solid #111111" }}
            />
            <span className="text-[10px] hidden sm:inline">{user?.name || "LISTENER"}</span>
          </div>
        </div>
      </header>

      {/* 2. CENTER STAGE: DUAL VU METERS & LARGE ALBUM JACKET */}
      <main className="relative flex-1 flex items-center justify-center my-6 sm:my-8 overflow-hidden">
        <div className="w-full max-w-6xl flex items-center justify-between gap-4 sm:gap-8 px-2">
          {/* Left Visualizer */}
          <div className="hidden md:flex flex-1 justify-end">
            <RetroAudioVisualizer isPlaying={isThisPlaying} side="left" barsCount={18} />
          </div>

          {/* Center: Album Jacket Card */}
          <div className="flex flex-col items-center shrink-0 mx-auto">
            <div
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                boxShadow: "4px 4px 0px #111111",
              }}
            >
              {/* Corner crop marks */}
              <span className="absolute top-1.5 left-2 text-xs font-mono leading-none select-none z-10" style={{ color: "#F05A28" }}>
                ┌
              </span>
              <span className="absolute top-1.5 right-2 text-xs font-mono leading-none select-none z-10" style={{ color: "#F05A28" }}>
                ┐
              </span>
              <span className="absolute bottom-1.5 left-2 text-xs font-mono leading-none select-none z-10" style={{ color: "#F05A28" }}>
                └
              </span>
              <span className="absolute bottom-1.5 right-2 text-xs font-mono leading-none select-none z-10" style={{ color: "#F05A28" }}>
                ┘
              </span>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeTrack.artworkUrl}
                alt={activeTrack.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Metadata Pill */}
            <div
              className="mt-3.5 px-4 py-1.5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#7A7166] flex-wrap justify-center"
              style={{
                backgroundColor: "#F6EEDE",
                border: "1.5px solid #111111",
                boxShadow: "2px 2px 0px #111111",
              }}
            >
              <span>GENRE: <strong className="text-[#111111]">{activeTrack.genre || "ELECTRONIC"}</strong></span>
              <span>•</span>
              <span style={{ color: "#F05A28" }}>MASTER: 24-BIT / 96kHz</span>
              {activeTrack.albumTitle && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Disc3 className="w-3 h-3" /> {activeTrack.albumTitle}</span>
                </>
              )}
              {activeTrack.releaseDate && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(activeTrack.releaseDate).getFullYear()}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Visualizer */}
          <div className="hidden md:flex flex-1 justify-start">
            <RetroAudioVisualizer isPlaying={isThisPlaying} side="right" barsCount={18} />
          </div>
        </div>
      </main>

      {/* 3. BOTTOM CONTROL CONSOLE */}
      <footer className="w-full max-w-5xl mx-auto space-y-3 sm:space-y-4">
        {/* Track Title and Artist Card */}
        <div
          className="relative px-5 py-3 flex items-center justify-between gap-4"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          {/* Corner notch brackets */}
          <span className="absolute top-1 left-2 text-[10px] font-mono leading-none select-none" style={{ color: "#F05A28" }}>┌</span>
          <span className="absolute bottom-1 right-2 text-[10px] font-mono leading-none select-none" style={{ color: "#F05A28" }}>┘</span>

          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "#F05A28",
                border: "1.5px solid #111111",
                color: "#111111",
              }}
            >
              <Music2 className="w-4 h-4 stroke-[2.5]" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-[#111111] uppercase tracking-wide truncate">
                {activeTrack.title}
              </h2>
              <p className="text-xs text-[#7A7166] font-mono truncate mt-0.5">
                {activeTrack.artistName}
                {activeTrack.albumTitle && ` — ${activeTrack.albumTitle}`}
              </p>
            </div>
          </div>

          {/* Like Heart Button */}
          <button
            type="button"
            onClick={() => toggleLike(activeTrack.id)}
            className="w-9 h-9 flex items-center justify-center shrink-0 transition-all cursor-pointer"
            style={{
              backgroundColor: isLiked ? "#FFF0ED" : "#FAF7EE",
              border: isLiked ? "1.5px solid #F05A28" : "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
              color: isLiked ? "#F05A28" : "#111111",
            }}
            title={isLiked ? "Remove from Liked" : "Add to Liked"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Digital Scrubber Bar */}
        <div className="flex items-center gap-3 px-1">
          <span className="text-xs font-bold font-mono text-[#111111] w-12 text-right select-none">
            {formatTime(progress)}
          </span>

          <div className="relative flex-1 flex items-center group h-4">
            <input
              type="range"
              min={0}
              max={activeDuration}
              step={0.1}
              value={progress}
              onChange={handleSeekChange}
              className="absolute inset-0 w-full h-full bg-transparent cursor-pointer appearance-none z-10 opacity-0"
            />
            {/* Scrubber Track */}
            <div
              className="w-full h-2.5 overflow-hidden flex items-center"
              style={{
                backgroundColor: "#F6EEDE",
                border: "1.5px solid #111111",
              }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: "#F05A28",
                }}
              />
            </div>
            {/* Scrubber Knob */}
            <div
              className="absolute w-3.5 h-3.5 pointer-events-none -ml-1.5 transition-all"
              style={{
                left: `${progressPercent}%`,
                backgroundColor: "#111111",
                border: "1.5px solid #FAF7EE",
              }}
            />
          </div>

          <span className="text-xs font-bold font-mono text-[#7A7166] w-12 text-left select-none">
            {formatTime(activeDuration)}
          </span>
        </div>

        {/* Playback Controls Deck */}
        <div
          className="p-3 sm:p-4 flex items-center justify-between gap-2"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          {/* Left mini tools: Shuffle & Repeat */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleShuffle}
              className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
              style={{
                backgroundColor: isShuffle ? "#F6EEDE" : "#FAF7EE",
                color: isShuffle ? "#F05A28" : "#111111",
                border: isShuffle ? "1.5px solid #F05A28" : "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
              }}
              title={isShuffle ? "Shuffle On" : "Shuffle Off"}
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={toggleRepeat}
              className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
              style={{
                backgroundColor: repeatMode !== "off" ? "#F6EEDE" : "#FAF7EE",
                color: repeatMode !== "off" ? "#F05A28" : "#111111",
                border: repeatMode !== "off" ? "1.5px solid #F05A28" : "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
              }}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === "one" ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Center Main Transport: Prev, Big Play/Pause, Next */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={previous}
              className="w-9 h-9 flex items-center justify-center transition-all cursor-pointer"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
                color: "#111111",
              }}
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Giant Brutalist Play/Pause */}
            <button
              type="button"
              onClick={handleMainPlay}
              className="w-12 h-12 flex items-center justify-center transition-all cursor-pointer"
              style={{
                backgroundColor: "#F05A28",
                color: "#111111",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e84e1d";
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = "4px 4px 0px #111111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F05A28";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
              }}
              aria-label={isThisPlaying ? "Pause" : "Play"}
            >
              {isThisPlaying ? (
                <Pause className="w-5 h-5 fill-current stroke-current" />
              ) : (
                <Play className="w-5 h-5 fill-current stroke-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={next}
              className="w-9 h-9 flex items-center justify-center transition-all cursor-pointer"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
                color: "#111111",
              }}
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Right: Volume & Queue */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden sm:flex items-center gap-2 px-2.5 py-1"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
              }}
            >
              <button
                type="button"
                onClick={toggleMute}
                className="text-[#111111] hover:text-[#F05A28] cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#F05A28]" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 accent-[#F05A28] cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => setQueueOpen(true)}
              className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
                color: "#111111",
              }}
              title="Queue"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

