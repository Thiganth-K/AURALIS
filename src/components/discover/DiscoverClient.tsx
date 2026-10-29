"use client";
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
  Search,
  Filter,
  ArrowRight,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

interface DiscoverClientProps {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}

// 28-bar smooth curve for dynamic orange light wave
const ORANGE_WAVE_HEIGHTS = [
  14, 18, 24, 32, 42, 56, 72, 84, 92, 88, 76, 64, 56, 68, 80, 90, 96, 90, 82,
  70, 58, 46, 36, 26, 18, 14, 12, 10,
];

export function DiscoverClient({
  songs,
  albums,
  artists,
  playlists,
}: DiscoverClientProps) {
  const router = useRouter();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"catalog" | "charts" | "new">("catalog");

  // Filter songs by search query
  const filteredSongs = songs.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.artistName.toLowerCase().includes(q) ||
      (s.genre && s.genre.toLowerCase().includes(q)) ||
      (s.albumTitle && s.albumTitle.toLowerCase().includes(q))
    );
  });

  const featuredPlaylist =
    playlists.find((p) => p.name.toLowerCase().includes("golden hour")) ||
    playlists[0];

  const featuredArtist =
    artists.find((a) => a.name.toLowerCase().includes("post malone")) ||
    artists[0];

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, filteredSongs);
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    router.push(`/playlist/${encodeURIComponent(playlist.name || playlist.id)}`);
  };

  const handlePlayArtist = (artist: Artist) => {
    const artistSongs = songs.filter(
      (s) => s.artistName.toLowerCase() === artist.name.toLowerCase()
    );
    if (artistSongs.length > 0) {
      playSong(artistSongs[0], artistSongs);
    } else if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-7 space-y-6 select-none font-mono text-[#111111]">
      {/* ── 1. PAGE HERO BANNER WITH DYNAMIC ORANGE LIGHT WAVE ── */}
      <div
        className="relative p-6 sm:p-7 overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Technical Corner Crop Ticks (in Orange #F05A28) */}
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

        {/* ── BACKGROUND CONCENTRIC GROOVE ARCS (RIGHT SIDE) ── */}
        <div className="absolute top-0 right-0 bottom-0 w-96 lg:w-[480px] pointer-events-none overflow-hidden hidden md:block">
          <svg
            className="absolute top-0 right-0 w-full h-full opacity-35"
            viewBox="0 0 480 320"
            fill="none"
          >
            <circle cx="460" cy="160" r="140" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="3 1" />
            <circle cx="460" cy="160" r="180" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="460" cy="160" r="220" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="460" cy="160" r="260" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="460" cy="160" r="300" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="460" cy="160" r="350" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="5 2" />
            <circle cx="460" cy="160" r="400" stroke="#DFD5C0" strokeWidth="1" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left Column: Title & Description & 3 Action Buttons */}
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
                AURALIS // DISCOVER
              </span>
            </div>

            {/* Giant Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111111] leading-tight">
              EXPLORE // DISCOVER SIGNALS
            </h1>

            {/* Subtitle / Description (2 lines) */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] font-mono leading-relaxed max-w-lg">
              Curated playlists, timeless albums, and new releases
              <br />
              from across the AURALIS universe.
            </p>

            {/* Three Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Button 1: BROWSE CATALOG ▶ */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("catalog");
                  const el = document.getElementById("transmitting-signals");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-9 px-4 text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
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
                <span>BROWSE CATALOG</span>
                <span className="text-xs">▶</span>
              </button>

              {/* Button 2: TOP CHARTS */}
              <Link
                href="/discover/top-charts"
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
                TOP CHARTS
              </Link>

              {/* Button 3: NEW RELEASES */}
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

          {/* ── 90s PIXEL MIC + PIXEL SOUND WAVE BARS (TOP RIGHT) ── */}
          <div className="hidden xl:flex items-end gap-1.5 shrink-0 select-none" style={{ height: 140 }}>
            {/* ── LEFT wave bars ── */}
            {[28, 42, 58, 72, 86, 96, 100, 90, 74].map((h, i) => (
              <div
                key={`l${i}`}
                style={{
                  width: 8,
                  height: `${h}%`,
                  backgroundColor: "#F05A28",
                  boxShadow: "0 0 8px rgba(240,90,40,0.55)",
                  animation: `auralisWaveDance 1.1s ease-in-out infinite alternate ${i * 0.07}s`,
                  alignSelf: "flex-end",
                }}
              />
            ))}

            {/* ── 90s PIXEL MIC SVG ── */}
            <svg
              width="110"
              height="140"
              viewBox="0 0 68 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              {/* Pixel stars */}
              <rect x="4"  y="4"  width="4" height="4" fill="#F05A28" opacity="0.9"/>
              <rect x="0"  y="8"  width="12" height="2" fill="#F05A28" opacity="0.5"/>
              <rect x="6"  y="2"  width="2" height="12" fill="#F05A28" opacity="0.5"/>
              <rect x="54" y="6"  width="4" height="4" fill="#F05A28" opacity="0.8"/>
              <rect x="50" y="10" width="12" height="2" fill="#F05A28" opacity="0.45"/>
              <rect x="56" y="4"  width="2" height="12" fill="#F05A28" opacity="0.45"/>
              <rect x="28" y="2"  width="3" height="3" fill="#F05A28" opacity="0.6"/>
              <rect x="26" y="5"  width="7" height="1" fill="#F05A28" opacity="0.3"/>
              <rect x="29" y="0"  width="1" height="7" fill="#F05A28" opacity="0.3"/>
              <rect x="10" y="90" width="3" height="3" fill="#F05A28" opacity="0.5"/>
              <rect x="8"  y="93" width="7" height="1" fill="#F05A28" opacity="0.28"/>
              <rect x="58" y="86" width="3" height="3" fill="#F05A28" opacity="0.5"/>
              <rect x="56" y="89" width="7" height="1" fill="#F05A28" opacity="0.28"/>

              {/* ── Pixel mic head (SM58 bullet) ── */}
              <rect x="22" y="14" width="24" height="4" fill="#F05A28"/>
              <rect x="18" y="18" width="32" height="4" fill="#F05A28"/>
              <rect x="16" y="22" width="36" height="4" fill="#F05A28"/>
              <rect x="20" y="23" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="28" y="23" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="36" y="23" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="44" y="23" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="14" y="26" width="40" height="4" fill="#F05A28"/>
              <rect x="18" y="27" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="26" y="27" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="34" y="27" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="42" y="27" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="14" y="30" width="40" height="4" fill="#F05A28"/>
              <rect x="16" y="31" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="24" y="31" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="32" y="31" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="40" y="31" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="16" y="34" width="36" height="4" fill="#F05A28"/>
              <rect x="18" y="35" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="26" y="35" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="34" y="35" width="4" height="2" fill="#111111" opacity="0.35"/>
              <rect x="18" y="38" width="32" height="4" fill="#F05A28"/>
              {/* collar */}
              <rect x="18" y="42" width="32" height="3" fill="#111111"/>
              {/* barrel */}
              <rect x="22" y="45" width="24" height="28" fill="#E8DCC8"/>
              <rect x="22" y="45" width="24" height="28" fill="none" stroke="#111111" strokeWidth="2"/>
              <rect x="22" y="52" width="24" height="2" fill="#111111" opacity="0.15"/>
              <rect x="22" y="60" width="24" height="2" fill="#111111" opacity="0.15"/>
              <rect x="22" y="68" width="24" height="2" fill="#111111" opacity="0.15"/>
              {/* grip ring */}
              <rect x="20" y="73" width="28" height="5" fill="#111111"/>
              {/* handle */}
              <rect x="24" y="78" width="20" height="14" fill="#D4C9B0"/>
              <rect x="24" y="78" width="20" height="14" fill="none" stroke="#111111" strokeWidth="2"/>
              {/* XLR */}
              <rect x="27" y="92" width="14" height="8" fill="#C0B49A"/>
              <rect x="27" y="92" width="14" height="8" fill="none" stroke="#111111" strokeWidth="1.5"/>
              <rect x="30" y="95" width="2" height="4" fill="#111111" opacity="0.5"/>
              <rect x="34" y="95" width="2" height="4" fill="#111111" opacity="0.5"/>
              <rect x="38" y="95" width="2" height="4" fill="#111111" opacity="0.5"/>
            </svg>

            {/* ── RIGHT wave bars ── */}
            {[74, 90, 100, 96, 86, 72, 58, 42, 28].map((h, i) => (
              <div
                key={`r${i}`}
                style={{
                  width: 8,
                  height: `${h}%`,
                  backgroundColor: "#F05A28",
                  boxShadow: "0 0 8px rgba(240,90,40,0.55)",
                  animation: `auralisWaveDance 1.1s ease-in-out infinite alternate ${0.63 + i * 0.07}s`,
                  alignSelf: "flex-end",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. SEARCH & FILTER TOOLBAR (EXPANDED DROPDOWN WIDTHS) ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Search Input Box */}
        <div
          className="flex-1 max-w-lg flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "2.5px 2.5px 0px #111111",
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
          <input
            type="text"
            placeholder="Search by name, artist, genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#111111] placeholder-[#7A7166] focus:outline-none text-xs font-mono"
            style={{ caretColor: "#F05A28" }}
          />
        </div>

        {/* Filters on Right with Increased Width & No Chevron Overlap */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
            <Filter className="w-4 h-4" style={{ color: "#F05A28" }} />
            <span className="text-[10px] tracking-wider uppercase">FILTER:</span>
          </div>

          {/* Role / Genre Dropdown */}
          <div
            className="relative"
            style={{ minWidth: 148 }}
          >
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full appearance-none text-xs font-black uppercase tracking-wider text-[#111111] cursor-pointer font-mono"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                boxShadow: "2px 2px 0px #111111",
                padding: "9px 40px 9px 14px",
                lineHeight: "1",
              }}
            >
              <option value="all">ALL ROLES</option>
              <option value="electronic">ELECTRONIC</option>
              <option value="hiphop">HIP-HOP</option>
              <option value="ambient">AMBIENT</option>
            </select>
            {/* Chevron — perfectly centered in the right padding zone */}
            <span
              className="absolute pointer-events-none flex items-center justify-center"
              style={{
                right: 0,
                top: 0,
                bottom: 0,
                width: 36,
                color: "#111111",
              }}
            >
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
            </span>
          </div>

          {/* Status Dropdown */}
          <div
            className="relative"
            style={{ minWidth: 160 }}
          >
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none text-xs font-black uppercase tracking-wider text-[#111111] cursor-pointer font-mono"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                boxShadow: "2px 2px 0px #111111",
                padding: "9px 40px 9px 14px",
                lineHeight: "1",
              }}
            >
              <option value="all">ALL STATUSES</option>
              <option value="active">ACTIVE</option>
              <option value="curated">CURATED</option>
            </select>
            <span
              className="absolute pointer-events-none flex items-center justify-center"
              style={{
                right: 0,
                top: 0,
                bottom: 0,
                width: 36,
                color: "#111111",
              }}
            >
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. TRANSMITTING SIGNALS // TRACKS DIRECTORY ── */}
      <section id="transmitting-signals" className="space-y-2.5">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 inline-block shrink-0"
              style={{ backgroundColor: "#F05A28" }}
            />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
              TRANSMITTING SIGNALS // {filteredSongs.length} TRACKS
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-[#111111] uppercase tracking-wider">
            <span>[ {filteredSongs.length} RECORD FOUND ]</span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#F05A28] transition-colors">
              <span>A-Z</span>
              <ArrowUpDown className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Table Container Card */}
        <div
          className="overflow-hidden"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          {filteredSongs.length === 0 ? (
            <div className="p-12 text-center space-y-3 font-mono">
              <p className="text-sm font-bold uppercase text-[#111111]">
                NO SIGNALS FOUND MATCHING CRITERIA
              </p>
              <p className="text-xs text-[#7A7166]">
                Try clearing filters or search queries.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr
                    className="border-b-2 border-[#111111] text-[10px] uppercase font-bold text-[#7A7166]"
                    style={{ backgroundColor: "#FAF7EE" }}
                  >
                    <th className="py-2.5 px-4 w-12 text-center">#</th>
                    <th className="py-2.5 px-4"></th>
                    <th className="py-2.5 px-4 w-1/3"></th>
                    <th className="py-2.5 px-4 text-center">ARTIST</th>
                    <th className="py-2.5 px-4 text-center">DURATION</th>
                    <th className="py-2.5 px-4 w-20 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/15">
                  {filteredSongs.map((song) => {
                    const isThisPlaying =
                      currentSong?.id === song.id && isPlaying;

                    return (
                      <tr
                        key={song.id}
                        className="group transition-colors hover:bg-[#F6EEDE] cursor-pointer"
                        onClick={() => handlePlaySong(song)}
                      >
                        {/* Left Play Box [ ▶ ] */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaySong(song);
                            }}
                            className="w-8 h-8 inline-flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
                            style={{
                              backgroundColor: isThisPlaying
                                ? "#F05A28"
                                : "#FAF7EE",
                              color: "#111111",
                              border: "2px solid #111111",
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

                        {/* Artwork Square */}
                        <td className="py-3 px-2 w-14">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={song.artworkUrl}
                            alt={song.title}
                            className="w-11 h-11 object-cover shrink-0"
                            style={{ border: "1.5px solid #111111" }}
                          />
                        </td>

                        {/* Title & Artist Subtext */}
                        <td className="py-3 px-4">
                          <div className="min-w-0">
                            <Link
                              href={`/song/${song.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-bold text-[#111111] hover:text-[#F05A28] uppercase truncate block transition-colors tracking-wide text-xs"
                            >
                              {song.title}
                            </Link>
                            <span className="text-[11px] text-[#7A7166] uppercase truncate block mt-0.5">
                              {song.artistName}
                            </span>
                          </div>
                        </td>

                        {/* Artist Column */}
                        <td className="py-3 px-4 text-center font-bold text-xs uppercase text-[#111111]">
                          {song.artistName}
                        </td>

                        {/* Duration Column */}
                        <td className="py-3 px-4 text-center font-mono text-xs font-bold text-[#111111]">
                          {formatTime(song.duration)}
                        </td>

                        {/* Right Orange Action Box [ ▶ ] */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaySong(song);
                            }}
                            className="w-10 h-10 inline-flex items-center justify-center transition-all cursor-pointer"
                            style={{
                              backgroundColor: "#F05A28",
                              color: "#111111",
                              border: "2px solid #111111",
                              boxShadow: "2px 2px 0px #111111",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#e84e1d";
                              e.currentTarget.style.transform =
                                "translate(-1px,-1px)";
                              e.currentTarget.style.boxShadow =
                                "3px 3px 0px #111111";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#F05A28";
                              e.currentTarget.style.transform = "";
                              e.currentTarget.style.boxShadow =
                                "2px 2px 0px #111111";
                            }}
                            title={isThisPlaying ? "Pause" : "Play"}
                          >
                            {isThisPlaying ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
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
      </section>

      {/* ── 4. CURATED CASSETTE TAPES SECTION ── */}
      {featuredPlaylist && (
        <section className="space-y-2.5">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 inline-block shrink-0"
                style={{ backgroundColor: "#F05A28" }}
              />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                CURATED CASSETTE TAPES
              </h2>
            </div>
            <Link
              href="/library?tab=playlists"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors hover:opacity-75"
              style={{ color: "#111111" }}
            >
              <span>BROWSE ALL TAPES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── Cassette Card: photo | info | cassette SVG, diagonal stripe bg ── */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => handlePlayPlaylist(featuredPlaylist)}
            style={{
              backgroundColor: "#F2E8D8",
              border: "2px solid #111111",
              boxShadow: "3px 3px 0px #111111",
            }}
          >
            {/* Diagonal orange stripe background */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ opacity: 0.13 }}
            >
              <defs>
                <pattern
                  id="cassetteDiag"
                  x="0" y="0"
                  width="20" height="20"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(35)"
                >
                  <line x1="0" y1="0" x2="0" y2="20" stroke="#F05A28" strokeWidth="5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cassetteDiag)" />
            </svg>

            {/* Orange L-bracket corners */}
            <span className="absolute top-0 left-0 pointer-events-none" style={{ width: 20, height: 20, borderTop: "3px solid #F05A28", borderLeft: "3px solid #F05A28" }} />
            <span className="absolute top-0 right-0 pointer-events-none" style={{ width: 20, height: 20, borderTop: "3px solid #F05A28", borderRight: "3px solid #F05A28" }} />
            <span className="absolute bottom-0 left-0 pointer-events-none" style={{ width: 20, height: 20, borderBottom: "3px solid #F05A28", borderLeft: "3px solid #F05A28" }} />
            <span className="absolute bottom-0 right-0 pointer-events-none" style={{ width: 20, height: 20, borderBottom: "3px solid #F05A28", borderRight: "3px solid #F05A28" }} />

            {/* ── 3-column content: photo | info | cassette ── */}
            <div className="relative z-10 flex flex-row items-center gap-0">

              {/* COL 1: Playlist artwork photo */}
              <div
                className="shrink-0 self-stretch"
                style={{ width: 300, minHeight: 170, borderRight: "2px solid #111111" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    featuredPlaylist.artworkUrl ||
                    "https://res.cloudinary.com/dvgllw3rq/image/upload/v1793273289/auralis/artwork/qclsrhggy4iytsp0drhq.jpg"
                  }
                  alt={featuredPlaylist.name}
                  className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
                  style={{ display: "block", height: "100%", minHeight: 170 }}
                />
              </div>

              {/* COL 2: Playlist info + PLAY TAPE btn */}
              <div className="flex-1 min-w-0 px-5 py-5 space-y-2">
                {/* AURALIS TAPE label */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 shrink-0" style={{ backgroundColor: "#F05A28", display: "inline-block" }} />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono" style={{ color: "#F05A28" }}>
                    AURALIS TAPE
                  </span>
                </div>

                {/* Playlist name */}
                <h3 className="text-lg sm:text-xl font-black uppercase text-[#111111] tracking-tight leading-tight font-mono">
                  {featuredPlaylist.name}
                </h3>

                {/* Track count */}
                <div className="text-[10px] font-bold uppercase text-[#7A7166] font-mono tracking-wider">
                  {featuredPlaylist.songCount || 1} TRACKS
                </div>

                {/* Description */}
                <p className="text-[11px] text-[#7A7166] font-mono leading-relaxed max-w-xs">
                  {featuredPlaylist.description || "A warm selection of timeless tracks for golden hours."}
                </p>

                {/* PLAY TAPE button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPlaylist(featuredPlaylist);
                    }}
                    className="px-4 py-2 text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
                    style={{
                      backgroundColor: "#FAF7EE",
                      color: "#111111",
                      border: "2px solid #111111",
                      boxShadow: "2px 2px 0px #111111",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translate(-1px,-1px)";
                      e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
                    }}
                  >
                    <span>PLAY TAPE</span>
                    <span>▶</span>
                  </button>
                </div>
              </div>

              {/* COL 3: Cassette tape SVG illustration */}
              <div
                className="shrink-0 hidden md:flex items-center justify-center self-stretch px-5"
                style={{ borderLeft: "2px solid #111111", minWidth: 360 }}
              >
                <svg
                  width="310"
                  height="140"
                  viewBox="0 0 260 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Cassette outer body */}
                  <rect x="6" y="8" width="248" height="118" rx="8" fill="#F5F2EA" stroke="#111111" strokeWidth="2.5" />

                  {/* Top label area */}
                  <rect x="22" y="16" width="216" height="50" rx="4" fill="#EDEAE0" stroke="#111111" strokeWidth="1.5" />

                  {/* Equalizer icon bars */}
                  <rect x="40" y="32" width="3.5" height="10" rx="1" fill="#F05A28" />
                  <rect x="46" y="28" width="3.5" height="14" rx="1" fill="#F05A28" />
                  <rect x="52" y="34" width="3.5" height="8" rx="1" fill="#F05A28" />

                  {/* AURALIS text */}
                  <text x="62" y="42" fontFamily="'Space Mono', monospace" fontSize="12" fontWeight="900" fill="#111111" letterSpacing="3">AURALIS</text>

                  {/* Orange stripe — top band */}
                  <rect x="6" y="68" width="248" height="11" fill="#F05A28" />
                  {/* Orange stripe — bottom band */}
                  <rect x="6" y="88" width="248" height="11" fill="#F05A28" />

                  {/* Tape window between bands */}
                  <rect x="82" y="78" width="96" height="10" rx="1" fill="#C8BEAA" />

                  {/* Left spool */}
                  <circle cx="78" cy="108" r="22" fill="#E2D9C4" stroke="#111111" strokeWidth="2" />
                  <circle cx="78" cy="108" r="13" fill="#CEC5AE" stroke="#111111" strokeWidth="1.5" />
                  <circle cx="78" cy="108" r="5" fill="#111111" />
                  <line x1="78" y1="95" x2="78" y2="102" stroke="#111111" strokeWidth="1.5" />
                  <line x1="78" y1="114" x2="78" y2="121" stroke="#111111" strokeWidth="1.5" />
                  <line x1="65" y1="108" x2="72" y2="108" stroke="#111111" strokeWidth="1.5" />
                  <line x1="84" y1="108" x2="91" y2="108" stroke="#111111" strokeWidth="1.5" />

                  {/* Right spool */}
                  <circle cx="182" cy="108" r="22" fill="#E2D9C4" stroke="#111111" strokeWidth="2" />
                  <circle cx="182" cy="108" r="13" fill="#CEC5AE" stroke="#111111" strokeWidth="1.5" />
                  <circle cx="182" cy="108" r="5" fill="#111111" />
                  <line x1="182" y1="95" x2="182" y2="102" stroke="#111111" strokeWidth="1.5" />
                  <line x1="182" y1="114" x2="182" y2="121" stroke="#111111" strokeWidth="1.5" />
                  <line x1="169" y1="108" x2="176" y2="108" stroke="#111111" strokeWidth="1.5" />
                  <line x1="188" y1="108" x2="195" y2="108" stroke="#111111" strokeWidth="1.5" />

                  {/* Tape arc between spools */}
                  <path d="M100 105 Q130 95 160 105" stroke="#111111" strokeWidth="1.5" fill="none" />

                  {/* Bottom center notch */}
                  <rect x="119" y="122" width="22" height="7" rx="2" fill="#CEC5AE" stroke="#111111" strokeWidth="1.5" />
                  {/* Bottom side notches */}
                  <rect x="14" y="120" width="14" height="7" rx="1" fill="#CEC5AE" stroke="#111111" strokeWidth="1.5" />
                  <rect x="232" y="120" width="14" height="7" rx="1" fill="#CEC5AE" stroke="#111111" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. TRANSMITTING ARTISTS SECTION ── */}
      {featuredArtist && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 inline-block shrink-0"
                style={{ backgroundColor: "#F05A28" }}
              />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                TRANSMITTING ARTISTS
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

          {/* Artist Card */}
          <div
            className="p-3.5 flex items-center justify-between cursor-pointer group"
            onClick={() => handlePlayArtist(featuredArtist)}
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "3px 3px 0px #111111",
            }}
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Circular Avatar */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  featuredArtist.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                }
                alt={featuredArtist.name}
                className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-[#111111]"
              />

              <div className="min-w-0 space-y-1">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#111111] truncate">
                  {featuredArtist.name}
                </h3>
                <span
                  className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: "#FFF0ED",
                    color: "#F05A28",
                    border: "1px solid #F05A28",
                  }}
                >
                  ARTIST
                </span>
              </div>
            </div>

            {/* Play Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayArtist(featuredArtist);
              }}
              className="w-9 h-9 inline-flex items-center justify-center transition-all cursor-pointer shrink-0"
              style={{
                backgroundColor: "#FAF7EE",
                color: "#111111",
                border: "2px solid #111111",
                boxShadow: "2px 2px 0px #111111",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F6EEDE";
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FAF7EE";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
              }}
              title="Play Artist"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>
        </section>
      )}

      {/* ── 6. FOOTER TECHNICAL FIDELITY BAR ── */}
      <div className="pt-4 flex items-center justify-between text-[10px] font-mono font-bold text-[#7A7166] uppercase tracking-wider">
        <span>AURALIS // v1.0</span>
        <span style={{ color: "#F05A28" }}>24-BIT / 96kHz ///</span>
      </div>
    </div>
  );
}
