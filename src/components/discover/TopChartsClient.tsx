"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Song, Album, Artist, Playlist } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import {
  Play,
  Pause,
  Trophy,
  Flame,
  ArrowUp,
  Radio,
  Filter,
  Sparkles,
  Disc3,
  ArrowRight,
  Music,
} from "lucide-react";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";

interface TopChartsClientProps {
  songs: Song[];
  artists: Artist[];
  playlists: Playlist[];
}

export function TopChartsClient({
  songs,
  artists,
  playlists,
}: TopChartsClientProps) {
  const router = useRouter();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  const filteredSongs = songs.filter((s) => {
    if (selectedGenre === "all") return true;
    return s.genre?.toLowerCase() === selectedGenre.toLowerCase();
  });

  const topSong = filteredSongs[0] || songs[0];

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, filteredSongs);
    }
  };

  const handlePlayAll = () => {
    if (filteredSongs.length > 0) {
      playSong(filteredSongs[0], filteredSongs);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-7 space-y-7 select-none font-mono text-[#111111]">
      {/* ── 1. RETRO HERO BANNER WITH NAV PILLS ── */}
      <div
        className="relative p-6 sm:p-7 overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Technical Corner Crop Ticks */}
        <span
          className="absolute top-1.5 left-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┌
        </span>
        <span
          className="absolute top-1.5 right-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┐
        </span>
        <span
          className="absolute bottom-1.5 left-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          └
        </span>
        <span
          className="absolute bottom-1.5 right-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┘
        </span>

        {/* Concentric Arcs Background */}
        <div className="absolute top-0 right-0 bottom-0 w-80 lg:w-96 pointer-events-none overflow-hidden hidden md:block">
          <svg
            className="absolute top-0 right-0 w-full h-full opacity-20"
            viewBox="0 0 380 260"
            fill="none"
          >
            <circle cx="380" cy="130" r="120" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="3 1" />
            <circle cx="380" cy="130" r="160" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="380" cy="130" r="200" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="380" cy="130" r="240" stroke="#DFD5C0" strokeWidth="1" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl space-y-3">
            {/* Tagline */}
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 inline-block shrink-0"
                style={{ backgroundColor: "#F05A28" }}
              />
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase"
                style={{ color: "#F05A28" }}
              >
                AURALIS // OFFICIAL CHARTS
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111111] leading-tight">
              TOP CHARTS // FREQUENCY LEADERS
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] font-mono leading-relaxed max-w-lg">
              Ranked broadcast transmissions and high-fidelity streams verified across
              the global AURALIS acoustic network.
            </p>

            {/* Three Navigation Buttons: BROWSE CATALOG | TOP CHARTS (active) | NEW RELEASES */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/discover"
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center transition-all cursor-pointer font-mono"
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
                BROWSE CATALOG
              </Link>

              <button
                type="button"
                className="h-9 px-4 text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 font-mono"
                style={{
                  backgroundColor: "#F05A28",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2.5px 2.5px 0px #111111",
                }}
              >
                <span>TOP CHARTS</span>
                <span className="text-xs">▶</span>
              </button>

              <Link
                href="/discover/new-releases"
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center transition-all cursor-pointer font-mono"
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
                NEW RELEASES
              </Link>
            </div>
          </div>

          {/* Trophy & Radio Stat Visual on the Right */}
          <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
            <div
              className="px-3 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "#F6EEDE",
                border: "2px solid #111111",
                boxShadow: "2px 2px 0px #111111",
              }}
            >
              <Trophy className="w-4 h-4 text-[#F05A28]" />
              <span>LEADERBOARD // LIVE</span>
            </div>
            <div className="text-[10px] text-[#7A7166] font-mono tracking-wider">
              TOTAL SIGNALS RANKED: {songs.length}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SPOTLIGHT #1 RECORD (IF AVAILABLE) ── */}
      {topSong && (
        <section
          className="relative p-5 sm:p-6 overflow-hidden"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          {/* Orange corner ticks */}
          <span className="absolute top-1.5 left-2 text-sm font-bold font-mono text-[#F05A28]">┌</span>
          <span className="absolute top-1.5 right-2 text-sm font-bold font-mono text-[#F05A28]">┐</span>
          <span className="absolute bottom-1.5 left-2 text-sm font-bold font-mono text-[#F05A28]">└</span>
          <span className="absolute bottom-1.5 right-2 text-sm font-bold font-mono text-[#F05A28]">┘</span>

          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            {/* Left: #1 Badge + Artwork */}
            <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
              <div
                className="w-14 sm:w-16 h-14 sm:h-16 shrink-0 flex flex-col items-center justify-center font-black"
                style={{
                  backgroundColor: "#F05A28",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                }}
              >
                <span className="text-[10px] tracking-wider uppercase">RANK</span>
                <span className="text-xl sm:text-2xl leading-none">#1</span>
              </div>

              <div
                className="w-20 sm:w-24 h-20 sm:h-24 shrink-0 overflow-hidden"
                style={{
                  border: "2px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={topSong.artworkUrl}
                  alt={topSong.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#F05A28]" />
                  <span className="text-[10px] font-bold tracking-widest text-[#F05A28] uppercase">
                    CHART TOPPER // PEAK #1
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black uppercase text-[#111111] truncate">
                  {topSong.title}
                </h3>
                <p className="text-xs text-[#7A7166] uppercase truncate">
                  {topSong.artistName} {topSong.genre && `• ${topSong.genre}`}
                </p>
              </div>
            </div>

            {/* Right: Quick Play Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => handlePlaySong(topSong)}
                className="px-5 py-2.5 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
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
                {currentSong?.id === topSong.id && isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>PAUSE SPOTLIGHT</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>PLAY SPOTLIGHT</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePlayAll}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
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
                <span>PLAY FULL CHART</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. CHART DIRECTORY TABLE WITH RANKINGS ── */}
      <section className="space-y-3">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
              AURALIS TOP 30 SIGNALS // {filteredSongs.length} RECORDS
            </h2>
          </div>

          {/* Genre Filters */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {["all", "electronic", "hiphop", "pop", "ambient"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(g)}
                className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: selectedGenre === g ? "#111111" : "#FAF7EE",
                  color: selectedGenre === g ? "#FAF7EE" : "#111111",
                  border: "1.5px solid #111111",
                  boxShadow: selectedGenre === g ? "1.5px 1.5px 0px #111111" : "2px 2px 0px #111111",
                }}
              >
                {g === "all" ? "ALL GENRES" : g}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Table */}
        <div
          className="overflow-x-auto"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr
                className="border-b-2 border-[#111111] text-[10px] uppercase font-bold text-[#7A7166]"
                style={{ backgroundColor: "#FAF7EE" }}
              >
                <th className="py-2.5 px-3 sm:px-4 w-12 text-center">RANK</th>
                <th className="py-2.5 px-3 w-12 text-center">TREND</th>
                <th className="py-2.5 px-4">SIGNAL / TITLE</th>
                <th className="py-2.5 px-4 hidden md:table-cell">ARTIST</th>
                <th className="py-2.5 px-4 hidden sm:table-cell">GENRE</th>
                <th className="py-2.5 px-4 text-center">TIME</th>
                <th className="py-2.5 px-4 text-right pr-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DEC9]">
              {filteredSongs.map((song, i) => {
                const rank = i + 1;
                const isCurrent = currentSong?.id === song.id;
                const isThisPlaying = isCurrent && isPlaying;

                return (
                  <tr
                    key={song.id}
                    className="hover:bg-[#F6EEDE] transition-colors cursor-pointer group"
                    onClick={() => router.push(`/song/${song.id}`)}
                    style={{
                      backgroundColor: isCurrent ? "#F6EEDE" : "transparent",
                    }}
                  >
                    {/* Rank Number */}
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-black"
                        style={{
                          backgroundColor: rank <= 3 ? "#F05A28" : "#FAF7EE",
                          color: rank <= 3 ? "#111111" : "#7A7166",
                          border: "1px solid #111111",
                        }}
                      >
                        #{String(rank).padStart(2, "0")}
                      </span>
                    </td>

                    {/* Trend Indicator */}
                    <td className="py-3 px-3 text-center text-[10px] font-bold">
                      <span className="flex items-center justify-center gap-0.5 text-[#247A45]">
                        <ArrowUp className="w-3 h-3" />
                        <span>{rank <= 5 ? "HOT" : "OK"}</span>
                      </span>
                    </td>

                    {/* Artwork + Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 shrink-0 overflow-hidden border border-[#111111] bg-[#F6EEDE]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={song.artworkUrl}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs uppercase text-[#111111] truncate group-hover:text-[#F05A28] transition-colors">
                            {song.title}
                          </p>
                          <p className="text-[11px] text-[#7A7166] md:hidden truncate">
                            {song.artistName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Artist */}
                    <td className="py-3 px-4 hidden md:table-cell uppercase font-bold text-xs text-[#111111]">
                      {song.artistName}
                    </td>

                    {/* Genre */}
                    <td className="py-3 px-4 hidden sm:table-cell">
                      {song.genre ? (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold border border-[#111111] bg-[#FAF7EE]">
                          {song.genre}
                        </span>
                      ) : (
                        <span className="text-[#7A7166]">-</span>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 text-center font-bold text-xs text-[#7A7166]">
                      {song.durationFormatted || formatTime(song.duration)}
                    </td>

                    {/* Play Action */}
                    <td className="py-3 px-4 text-right pr-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySong(song);
                        }}
                        className="w-8 h-8 inline-flex items-center justify-center transition-all cursor-pointer"
                        style={{
                          backgroundColor: "#F05A28",
                          color: "#111111",
                          border: "1.5px solid #111111",
                          boxShadow: "2px 2px 0px #111111",
                        }}
                        title={isThisPlaying ? "Pause" : "Play"}
                      >
                        {isThisPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 4. TOP TRANSMITTING ARTISTS ── */}
      {artists.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                TOP TRANSMITTING ARTISTS
              </h2>
            </div>
            <Link
              href="/library?tab=artists"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
              style={{ color: "#F05A28" }}
            >
              <span>VIEW ALL ARTISTS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artists.slice(0, 6).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* ── 5. TOP CURATED TAPES ── */}
      {playlists.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                TOP CASSETTE TAPES
              </h2>
            </div>
            <Link
              href="/library?tab=playlists"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
              style={{ color: "#F05A28" }}
            >
              <span>BROWSE ALL TAPES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {playlists.slice(0, 6).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

