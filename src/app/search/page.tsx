"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search as SearchIcon,
  Music,
  Disc3,
  Mic2,
  ListMusic,
  X,
  Radio,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { Song, Album, Artist, Playlist } from "@/types";
import { SongRow } from "@/components/music/SongRow";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";

const SUGGESTED_QUERIES = [
  "Post Malone",
  "Golden Hour Tape",
  "Sunflower",
  "Electronic",
  "Auralis",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [category, setCategory] = useState<
    "all" | "songs" | "artists" | "albums" | "playlists"
  >("all");

  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = query.trim();
      setDebouncedQuery(trimmed);
      if (trimmed) {
        router.replace(`/search?q=${encodeURIComponent(trimmed)}`, {
          scroll: false,
        });
      } else {
        router.replace("/search", { scroll: false });
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [query, router]);

  // Sync state if URL query param changes from external sources (e.g. TopBar)
  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    if (urlQ !== query && urlQ !== debouncedQuery) {
      setQuery(urlQ);
      setDebouncedQuery(urlQ);
    }
  }, [searchParams]);

  // Execute search API request
  useEffect(() => {
    if (!debouncedQuery) {
      setSongs([]);
      setArtists([]);
      setAlbums([]);
      setPlaylists([]);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCurrent) return;
        if (data.success && data.data) {
          setSongs(data.data.songs || []);
          setArtists(data.data.artists || []);
          setAlbums(data.data.albums || []);
          setPlaylists(data.data.playlists || []);
        }
      })
      .catch((err) => console.error("Search error:", err))
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  const totalResults =
    songs.length + artists.length + albums.length + playlists.length;
  const hasResults = totalResults > 0;

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    router.replace("/search", { scroll: false });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-7 space-y-6 select-none font-mono text-[#111111]">
      {/* ── 1. RETRO SEARCH & FREQUENCY TUNER HERO ── */}
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
          className="absolute top-1.5 left-2 text-sm font-bold select-none"
          style={{ color: "#F05A28" }}
        >
          ┌
        </span>
        <span
          className="absolute top-1.5 right-2 text-sm font-bold select-none"
          style={{ color: "#F05A28" }}
        >
          ┐
        </span>
        <span
          className="absolute bottom-1.5 left-2 text-sm font-bold select-none"
          style={{ color: "#F05A28" }}
        >
          └
        </span>
        <span
          className="absolute bottom-1.5 right-2 text-sm font-bold select-none"
          style={{ color: "#F05A28" }}
        >
          ┘
        </span>

        {/* Background Concentric Radar Arcs (Right side) */}
        <div className="absolute top-0 right-0 bottom-0 w-80 lg:w-96 pointer-events-none overflow-hidden hidden md:block">
          <svg
            className="absolute top-0 right-0 w-full h-full opacity-25"
            viewBox="0 0 380 260"
            fill="none"
          >
            <circle
              cx="380"
              cy="130"
              r="120"
              stroke="#DFD5C0"
              strokeWidth="1"
              strokeDasharray="3 1"
            />
            <circle cx="380" cy="130" r="160" stroke="#DFD5C0" strokeWidth="1" />
            <circle
              cx="380"
              cy="130"
              r="200"
              stroke="#DFD5C0"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <circle cx="380" cy="130" r="240" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="380" cy="130" r="280" stroke="#DFD5C0" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* ── Left Content: Badges, Title, Search Console & Filters ── */}
            <div className="space-y-4 flex-1 min-w-0 max-w-3xl">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 inline-block shrink-0"
                    style={{ backgroundColor: "#F05A28" }}
                  />
                  <span
                    className="text-[10px] font-bold tracking-[0.22em] uppercase"
                    style={{ color: "#F05A28" }}
                  >
                    AURALIS // FREQUENCY TUNER
                  </span>
                </div>

                <div
                  className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                    boxShadow: "1.5px 1.5px 0px #111111",
                  }}
                >
                  <Radio
                    className="w-3 h-3 animate-pulse"
                    style={{ color: "#F05A28" }}
                  />
                  <span>TUNER READY // 96KHZ</span>
                </div>
              </div>

              {/* Headline & Description */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111111] leading-tight">
                  CATALOG SEARCH // FREQUENCY SCANNER
                </h1>
                <p className="text-xs sm:text-[13px] text-[#7A7166] mt-1 max-w-xl leading-relaxed">
                  Scan high-fidelity acoustic transmissions across verified songs,
                  artists, studio albums, and analog cassette tapes.
                </p>
              </div>

              {/* Large Retro Console Input Field */}
              <div className="pt-1">
                <div
                  className="flex items-center gap-3 px-4 py-3 transition-all"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "2px solid #111111",
                    boxShadow: "3px 3px 0px #111111",
                  }}
                >
                  <SearchIcon
                    className="w-5 h-5 shrink-0"
                    style={{ color: "#F05A28" }}
                  />
                  <span
                    className="font-bold text-sm select-none"
                    style={{ color: "#F05A28" }}
                  >
                    &gt;
                  </span>
                  <input
                    type="text"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SEARCH FREQUENCIES... (e.g. POST MALONE, SUNFLOWER, ELECTRONIC)"
                    className="w-full bg-transparent text-xs sm:text-sm text-[#111111] placeholder-[#7A7166]/60 focus:outline-none uppercase font-mono tracking-wider"
                    style={{ caretColor: "#F05A28" }}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1 hover:text-[#F05A28] transition-colors cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Tactical Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111] mr-1">
                  <SlidersHorizontal
                    className="w-3.5 h-3.5"
                    style={{ color: "#F05A28" }}
                  />
                  <span className="text-[10px] tracking-wider uppercase">
                    FILTER:
                  </span>
                </div>

                {(
                  [
                    { key: "all", label: "ALL SIGNALS", count: totalResults },
                    { key: "songs", label: "SONGS", count: songs.length },
                    { key: "artists", label: "ARTISTS", count: artists.length },
                    { key: "albums", label: "ALBUMS", count: albums.length },
                    {
                      key: "playlists",
                      label: "CASSETTES",
                      count: playlists.length,
                    },
                  ] as const
                ).map((cat) => {
                  const isActive = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      className="h-8 px-3 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer font-mono"
                      style={{
                        backgroundColor: isActive ? "#F05A28" : "#FAF7EE",
                        color: isActive ? "#FAF7EE" : "#111111",
                        border: "2px solid #111111",
                        boxShadow: isActive
                          ? "1.5px 1.5px 0px #111111"
                          : "2px 2px 0px #111111",
                        transform: isActive ? "translate(0.5px, 0.5px)" : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "#F6EEDE";
                          e.currentTarget.style.transform = "translate(-1px,-1px)";
                          e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "#FAF7EE";
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
                        }
                      }}
                    >
                      <span>{cat.label}</span>
                      {debouncedQuery && (
                        <span
                          className="px-1.5 py-0.2 text-[9px] font-mono font-bold"
                          style={{
                            backgroundColor: isActive ? "#111111" : "#F6EEDE",
                            color: isActive ? "#FAF7EE" : "#F05A28",
                            border: "1px solid #111111",
                          }}
                        >
                          {cat.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Right: 90's Pixel Zoom Glass with Pixel Music Logo & Pixel Waves ── */}
            <div className="hidden sm:flex items-center gap-3 shrink-0 select-none pt-6 sm:pt-10 lg:pt-12">
              {/* Dancing pixel soundwave bars on left of zoom glass */}
              <div className="flex items-end gap-1 h-28 py-2">
                {[30, 52, 75, 96, 78, 54, 38].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: `${h}%`,
                      backgroundColor: "#F05A28",
                      boxShadow: "0 0 6px rgba(240, 90, 40, 0.5)",
                      animation: `auralisWaveDance 1.1s ease-in-out infinite alternate ${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>

              {/* 90's Pixel Magnifying Glass SVG with Pixel Music Logo */}
              <svg
                width="145"
                height="135"
                viewBox="0 0 145 135"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 drop-shadow-[2px_2px_0px_#111111]"
              >
                {/* ── Pixel Sparkles / Cross-Stars ── */}
                {/* Sparkle 1 (Top-Left) */}
                <rect x="8" y="10" width="4" height="4" fill="#F05A28" opacity="0.9" />
                <rect x="4" y="14" width="12" height="2" fill="#F05A28" opacity="0.5" />
                <rect x="10" y="8" width="2" height="12" fill="#F05A28" opacity="0.5" />

                {/* Sparkle 2 (Top-Right) */}
                <rect x="110" y="6" width="3" height="3" fill="#F05A28" opacity="0.85" />
                <rect x="107" y="9" width="9" height="1" fill="#F05A28" opacity="0.5" />
                <rect x="111" y="5" width="1" height="9" fill="#F05A28" opacity="0.5" />

                {/* Sparkle 3 (Bottom-Left) */}
                <rect x="12" y="92" width="3" height="3" fill="#F05A28" opacity="0.6" />
                <rect x="10" y="95" width="7" height="1" fill="#F05A28" opacity="0.35" />

                {/* Sparkle 4 (Right-Side Tiny) */}
                <rect x="132" y="64" width="3" height="3" fill="#F05A28" opacity="0.75" />
                <rect x="130" y="67" width="7" height="1" fill="#F05A28" opacity="0.4" />

                {/* ── Pixel Lens Shadow (Offset blocky) ── */}
                <rect x="34" y="24" width="58" height="58" rx="29" fill="#111111" opacity="0.15" />

                {/* ── Pixel Magnifying Lens Outer Rim (Stepped 90s Blocky Border) ── */}
                <circle cx="60" cy="50" r="34" fill="#F6EEDE" stroke="#111111" strokeWidth="3" />
                <circle cx="60" cy="50" r="30" stroke="#F05A28" strokeWidth="2" strokeDasharray="3 2" />

                {/* ── Glass Specular Pixel Highlights (Top-Left Reflection Steps) ── */}
                <rect x="38" y="28" width="10" height="4" fill="#FFFFFF" opacity="0.9" />
                <rect x="34" y="32" width="4" height="10" fill="#FFFFFF" opacity="0.9" />
                <rect x="34" y="28" width="4" height="4" fill="#FFFFFF" />
                <rect x="48" y="26" width="6" height="2" fill="#FFFFFF" opacity="0.7" />

                {/* ── Magnified 90's Pixel Music Logo (Inside Lens) ── */}
                {/* Music Note Left Head (Pixel Block) */}
                <rect x="42" y="58" width="12" height="10" rx="1" fill="#F05A28" stroke="#111111" strokeWidth="2" />
                <rect x="45" y="60" width="4" height="3" fill="#FFFFFF" opacity="0.6" />

                {/* Music Note Right Head (Pixel Block) */}
                <rect x="64" y="52" width="12" height="10" rx="1" fill="#F05A28" stroke="#111111" strokeWidth="2" />
                <rect x="67" y="54" width="4" height="3" fill="#FFFFFF" opacity="0.6" />

                {/* Music Stems (Pixel vertical bars) */}
                <rect x="50" y="36" width="4" height="24" fill="#111111" />
                <rect x="72" y="30" width="4" height="24" fill="#111111" />

                {/* Beamed Bridge Bar across the top of notes */}
                <polygon points="50,34 76,28 76,36 50,42" fill="#F05A28" stroke="#111111" strokeWidth="2" />
                {/* Secondary inner beam highlight */}
                <polygon points="52,36 74,31 74,33 52,38" fill="#FFFFFF" opacity="0.4" />

                {/* Mini Pixel Equalizer Pulse under Note */}
                <rect x="44" y="71" width="3" height="4" fill="#111111" opacity="0.6" />
                <rect x="49" y="69" width="3" height="6" fill="#F05A28" />
                <rect x="54" y="68" width="3" height="7" fill="#111111" opacity="0.6" />
                <rect x="59" y="66" width="3" height="9" fill="#F05A28" />
                <rect x="64" y="67" width="3" height="8" fill="#111111" opacity="0.6" />
                <rect x="69" y="65" width="3" height="10" fill="#F05A28" />

                {/* ── Stepped Pixel Handle (Diagonal 45-degree angle) ── */}
                {/* Metal Collar joint */}
                <rect x="83" y="73" width="12" height="12" fill="#111111" transform="rotate(45 83 73)" />
                <rect x="85" y="75" width="8" height="8" fill="#F05A28" transform="rotate(45 85 75)" />

                {/* Handle Body (Beige Retro Grip) */}
                <rect x="91" y="81" width="36" height="10" rx="1" fill="#E8DCC8" stroke="#111111" strokeWidth="2.5" transform="rotate(45 91 81)" />

                {/* Handle Pixel Grip Ribs */}
                <rect x="98" y="81" width="3" height="10" fill="#111111" opacity="0.7" transform="rotate(45 98 81)" />
                <rect x="105" y="81" width="3" height="10" fill="#111111" opacity="0.7" transform="rotate(45 105 81)" />
                <rect x="112" y="81" width="3" height="10" fill="#111111" opacity="0.7" transform="rotate(45 112 81)" />

                {/* Handle End Cap */}
                <rect x="119" y="80" width="8" height="12" fill="#F05A28" stroke="#111111" strokeWidth="2" transform="rotate(45 119 80)" />
              </svg>

              {/* Dancing pixel soundwave bars on right of zoom glass */}
              <div className="flex items-end gap-1 h-28 py-2">
                {[38, 54, 78, 96, 75, 52, 30].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: `${h}%`,
                      backgroundColor: "#F05A28",
                      boxShadow: "0 0 6px rgba(240, 90, 40, 0.5)",
                      animation: `auralisWaveDance 1.1s ease-in-out infinite alternate ${
                        0.56 + i * 0.08
                      }s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. BODY CONTENT: INITIAL, LOADING, EMPTY, OR RESULTS ── */}
      {!debouncedQuery ? (
        /* Initial Ready State with Quick Presets */
        <div
          className="relative p-8 sm:p-12 text-center space-y-6"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          {/* Technical Corner Crop Ticks */}
          <span
            className="absolute top-1.5 left-2 text-sm font-bold select-none"
            style={{ color: "#F05A28" }}
          >
            ┌
          </span>
          <span
            className="absolute top-1.5 right-2 text-sm font-bold select-none"
            style={{ color: "#F05A28" }}
          >
            ┐
          </span>
          <span
            className="absolute bottom-1.5 left-2 text-sm font-bold select-none"
            style={{ color: "#F05A28" }}
          >
            └
          </span>
          <span
            className="absolute bottom-1.5 right-2 text-sm font-bold select-none"
            style={{ color: "#F05A28" }}
          >
            ┘
          </span>

          {/* Equalizer Symbol Indicator */}
          <div className="flex justify-center items-end gap-1 h-6">
            <span
              className="w-1.5 h-3 inline-block"
              style={{ backgroundColor: "#F05A28" }}
            />
            <span
              className="w-1.5 h-6 inline-block"
              style={{ backgroundColor: "#F05A28" }}
            />
            <span
              className="w-1.5 h-4 inline-block"
              style={{ backgroundColor: "#F05A28" }}
            />
            <span
              className="w-1.5 h-5 inline-block"
              style={{ backgroundColor: "#F05A28" }}
            />
            <span
              className="w-1.5 h-2 inline-block"
              style={{ backgroundColor: "#F05A28" }}
            />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base sm:text-lg font-black uppercase text-[#111111] tracking-tight">
              // AURALIS SIGNAL SCANNER READY
            </h3>
            <p className="text-xs text-[#7A7166] leading-relaxed">
              Enter any artist, song title, studio album, or musical genre in
              the console above to initiate frequency search.
            </p>
          </div>

          {/* Suggested Quick Queries */}
          <div className="pt-2 max-w-lg mx-auto">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#7A7166] mb-3">
              RECOMMENDED FREQUENCIES TO EXPLORE
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTED_QUERIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer font-mono"
                  style={{
                    backgroundColor: "#FAF7EE",
                    color: "#111111",
                    border: "1.5px solid #111111",
                    boxShadow: "2px 2px 0px #111111",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F6EEDE";
                    e.currentTarget.style.color = "#F05A28";
                    e.currentTarget.style.transform = "translate(-1px,-1px)";
                    e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FAF7EE";
                    e.currentTarget.style.color = "#111111";
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
                  }}
                >
                  <span>{item}</span>
                  <ArrowRight className="w-3 h-3 text-[#F05A28]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : loading ? (
        /* Loading Scanner State */
        <div
          className="relative p-14 text-center space-y-4"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          {/* Animated Retro Equalizer Wave */}
          <div className="flex items-end justify-center gap-1 h-12 py-1">
            {[20, 45, 75, 95, 60, 30, 80, 50, 90, 40].map((h, i) => (
              <div
                key={i}
                className="w-1.5 sm:w-2"
                style={{
                  height: `${h}%`,
                  backgroundColor: "#F05A28",
                  animation: `auralisWaveDance 0.8s ease-in-out infinite alternate ${
                    i * 0.08
                  }s`,
                }}
              />
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black uppercase tracking-wider text-[#111111]">
              SCANNING AUDIO FREQUENCIES...
            </p>
            <p className="text-xs text-[#7A7166]">
              Querying transmissions matching &quot;{debouncedQuery}&quot;
            </p>
          </div>
        </div>
      ) : !hasResults ? (
        /* No Matches State */
        <div
          className="relative p-10 sm:p-14 text-center space-y-4"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          {/* Corner Ticks */}
          <span
            className="absolute top-1.5 left-2 text-sm font-bold select-none"
            style={{ color: "#F05A28" }}
          >
            ┌
          </span>
          <span
            className="absolute top-1.5 right-2 text-sm font-bold select-none"
            style={{ color: "#F05A28" }}
          >
            ┐
          </span>
          <span
            className="absolute bottom-1.5 left-2 text-sm font-bold select-none"
            style={{ color: "#F05A28" }}
          >
            └
          </span>
          <span
            className="absolute bottom-1.5 right-2 text-sm font-bold select-none"
            style={{ color: "#F05A28" }}
          >
            ┘
          </span>

          <div className="w-12 h-12 mx-auto rounded-none border-2 border-[#111111] bg-[#F6EEDE] flex items-center justify-center shadow-[2px_2px_0px_#111111]">
            <SearchIcon className="w-6 h-6 text-[#F05A28]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-black uppercase text-[#111111] tracking-tight">
              // 0 FREQUENCY SIGNALS DETECTED
            </h3>
            <p className="text-xs text-[#7A7166] leading-relaxed">
              No verified releases or catalog entries matched &quot;{debouncedQuery}&quot;.
              Check spelling or try searching by verified artist name or genre.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
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
              <span>RESET SEARCH FILTER</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Results Directory */
        <div className="space-y-8">
          {/* ── Results Status Header ── */}
          <div className="flex items-center justify-between pb-1 border-b-2 border-[#111111]">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 inline-block shrink-0"
                style={{ backgroundColor: "#F05A28" }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                FOUND {totalResults} RECORD{totalResults === 1 ? "" : "S"} FOR &quot;{debouncedQuery}&quot;
              </span>
            </div>

            <div className="text-[10px] font-bold text-[#7A7166] uppercase tracking-wider">
              [ TRANSMISSION VERIFIED ]
            </div>
          </div>

          {/* ── 2A. SONGS SECTION ── */}
          {(category === "all" || category === "songs") && songs.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#F05A28]" />
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                    SONGS // {songs.length} SIGNALS
                  </h2>
                </div>
              </div>

              <div
                className="p-2 space-y-2"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  boxShadow: "3px 3px 0px #111111",
                }}
              >
                {songs.map((song, index) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={index}
                    playlistContext={songs}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── 2B. ARTISTS SECTION ── */}
          {(category === "all" || category === "artists") &&
            artists.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mic2 className="w-4 h-4 text-[#F05A28]" />
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                    TRANSMITTING ARTISTS // {artists.length} FOUND
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {artists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>
            )}

          {/* ── 2C. ALBUMS SECTION ── */}
          {(category === "all" || category === "albums") &&
            albums.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Disc3 className="w-4 h-4 text-[#F05A28]" />
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                    STUDIO ALBUMS // {albums.length} RECORDS
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {albums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </section>
            )}

          {/* ── 2D. CASSETTES & PLAYLISTS SECTION ── */}
          {(category === "all" || category === "playlists") &&
            playlists.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-[#F05A28]" />
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                    CASSETTES &amp; PLAYLISTS // {playlists.length} TAPES
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </section>
            )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[1440px] mx-auto p-12 text-center space-y-4 font-mono select-none">
          <div className="flex items-end justify-center gap-1 h-8">
            <span className="w-1.5 h-3 bg-[#F05A28]" />
            <span className="w-1.5 h-8 bg-[#F05A28]" />
            <span className="w-1.5 h-5 bg-[#F05A28]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#111111]">
            INITIALIZING FREQUENCY SCANNER...
          </p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
