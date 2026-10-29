"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Song, Album, Artist, Playlist } from "@/types";
import { getTimeGreeting } from "@/lib/utils";
import { usePlayer } from "@/context/PlayerContext";
import { SongCard } from "@/components/music/SongCard";
import { SongRow } from "@/components/music/SongRow";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import {
  Play,
  Heart,
  Clock,
  Disc3,
  User,
  ListMusic,
  Compass,
  ArrowRight,
  Upload,
  Radio,
  Flame,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HomeClientProps {
  trendingSongs: Song[];
  recentAlbums: Album[];
  featuredArtists: Artist[];
  curatedPlaylists: Playlist[];
  featuredMeta?: {
    headline?: string;
    subheadline?: string;
    featuredSong?: Song;
  };
}

const WIDE_SOUNDWAVE_BARS = [
  8, 12, 17, 24, 30, 38, 46, 54, 60, 65, 70, 74, 76, 74, 70, 65, 60, 54, 46, 38, 30, 24, 17, 12, 8
];

function VinylRecord() {
  return (
    <svg
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(4px 4px 0px #111111)" }}
    >
      <circle cx="65" cy="65" r="64" fill="#1A1A1A" />
      <circle cx="65" cy="65" r="58" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="52" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="46" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="40" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="34" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="28" fill="none" stroke="#333" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="22" fill="#F05A28" />
      <circle cx="65" cy="65" r="18" fill="#E04C1E" />
      <circle cx="65" cy="65" r="4" fill="#1A1A1A" />
      <rect x="50" y="58" width="30" height="1.5" fill="#FAF7EE" opacity="0.7" rx="0.5" />
      <rect x="54" y="62" width="22" height="1.5" fill="#FAF7EE" opacity="0.5" rx="0.5" />
      <rect x="58" y="66" width="14" height="1.5" fill="#FAF7EE" opacity="0.3" rx="0.5" />
    </svg>
  );
}

function ToneArm() {
  return (
    <svg width="60" height="120" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="10" r="5" fill="#111111" />
      <circle cx="50" cy="10" r="3" fill="#F05A28" />
      <line x1="50" y1="10" x2="12" y2="90" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="6" y="88" width="14" height="6" rx="1" fill="#111111" />
      <line x1="13" y1="94" x2="13" y2="100" stroke="#F05A28" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HomeClient({
  trendingSongs,
  recentAlbums,
  featuredArtists,
  curatedPlaylists,
  featuredMeta,
}: HomeClientProps) {
  const { user, isAdmin } = useAuth();
  const [greeting, setGreeting] = useState("Welcome to AURALIS");
  const { playSong } = usePlayer();

  useEffect(() => {
    const name = user?.name || "Listener";
    setGreeting(getTimeGreeting(name));
  }, [user]);

  const heroTrack = featuredMeta?.featuredSong || trendingSongs[0];

  const quickAccessCards = [
    {
      title: "Liked Songs",
      subtitle: "Your favorites",
      icon: Heart,
      href: "/library?tab=liked",
    },
    {
      title: "Recently Played",
      subtitle: "Continue listening",
      icon: Clock,
      href: "/library?tab=history",
    },
    {
      title: "Albums",
      subtitle: "Explore albums",
      icon: Disc3,
      href: "/library?tab=albums",
    },
    {
      title: "Artists",
      subtitle: "Discover artists",
      icon: User,
      href: "/library?tab=artists",
    },
    {
      title: "Playlists",
      subtitle: "Your collections",
      icon: ListMusic,
      href: "/library?tab=playlists",
    },
  ];

  return (
    <div
      className="px-4 sm:px-8 py-6 space-y-10 max-w-7xl mx-auto select-none font-mono"
      style={{ backgroundColor: "#FAF7EE" }}
    >
      <style>{`
        @keyframes auralisWaveDance {
          0%, 100% {
            transform: scaleY(0.2);
            opacity: 0.6;
          }
          50% {
            transform: scaleY(1.15);
            opacity: 1;
          }
        }
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* 1. HERO SECTION (Warm Paper Retro Brutalist Frame with Spinning Vinyl & Dancing Wave) */}
      <section
        className="relative p-6 sm:p-8 overflow-hidden"
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

        {/* Top Status Bar inside Hero */}
        <div
          className="flex items-center justify-between pb-3 mb-4 text-xs font-bold uppercase tracking-wider"
          style={{ borderBottom: "1.5px solid rgba(17,17,17,0.15)" }}
        >
          <div className="flex items-center gap-2" style={{ color: "#F05A28" }}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="tracking-widest">((•)) AURALIS DECK // SIGNAL ACTIVE</span>
          </div>
          <span className="hidden sm:inline tracking-widest text-[#7A7166]">
            STUDIO FLAC 24-BIT / 96kHz
          </span>
        </div>

        {/* Hero Middle Content */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left Text Column */}
          <div className="max-w-xl space-y-3.5">
            <p
              className="text-xs sm:text-sm font-bold tracking-widest uppercase"
              style={{ color: "#F05A28" }}
            >
              {"//"} {greeting.toUpperCase()}
            </p>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight tracking-tight"
              style={{ fontWeight: 900, color: "#111111" }}
            >
              YOUR MUSIC SYSTEM IS READY
            </h1>

            <p className="text-xs sm:text-sm text-[#7A7166] font-mono leading-relaxed max-w-lg">
              {featuredMeta?.subheadline ||
                "Curated high-fidelity acoustic streams from verified AURALIS artists."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {heroTrack && (
                <button
                  type="button"
                  onClick={() => playSong(heroTrack, trendingSongs)}
                  className="h-11 min-w-[210px] px-5 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2.5 transition-all cursor-pointer font-mono select-none"
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
                >
                  <Play className="w-4 h-4 fill-current stroke-current" />
                  <span>RESUME SESSION</span>
                </button>
              )}

              <Link
                href="/discover"
                className="h-11 min-w-[210px] px-5 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2.5 transition-all cursor-pointer font-mono select-none"
                style={{
                  backgroundColor: "#FAF7EE",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "3px 3px 0px #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F6EEDE";
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                  e.currentTarget.style.boxShadow = "4px 4px 0px #111111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FAF7EE";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
                }}
              >
                <Compass className="w-4 h-4" style={{ color: "#F05A28" }} />
                <span>EXPLORE DISCOVERY</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/songs/new"
                  className="h-11 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
                  style={{
                    backgroundColor: "#F6EEDE",
                    color: "#111111",
                    border: "2px solid #111111",
                    boxShadow: "3px 3px 0px #111111",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-1px,-1px)";
                    e.currentTarget.style.boxShadow = "4px 4px 0px #111111";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
                  }}
                >
                  <Upload className="w-4 h-4" style={{ color: "#F05A28" }} />
                  <span>[ UPLOAD ]</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Visual: Slogan + Dynamic Dancing Waveform + Spinning Vinyl Record on the Right */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {/* Slogan */}
            <div
              className="text-right text-xs sm:text-[13px] font-black tracking-widest text-[#111111] uppercase leading-tight pr-5 shrink-0"
              style={{ borderRight: "2px solid rgba(17,17,17,0.15)" }}
            >
              <p>REAL PEOPLE.</p>
              <p className="my-1">REAL MUSIC.</p>
              <p style={{ color: "#F05A28" }}>AURALIS.</p>
            </div>

            {/* Dynamic Soundwave Dance (Directly on Disk's Left Side) */}
            <div className="flex items-center gap-1 h-18 select-none">
              {WIDE_SOUNDWAVE_BARS.map((h, i) => (
                <span
                  key={i}
                  className="rounded-full"
                  style={{
                    display: "inline-block",
                    width: "3px",
                    height: `${h * 0.8}px`,
                    backgroundColor: "#F05A28",
                    boxShadow: "0 0 8px rgba(240, 90, 40, 0.45)",
                    transformOrigin: "center",
                    animation: "auralisWaveDance 1.25s ease-in-out infinite alternate",
                    animationDelay: `${(i * 0.05).toFixed(3)}s`,
                    willChange: "transform",
                  }}
                />
              ))}
            </div>

            {/* Spinning Vinyl Record + ToneArm (Right Side) */}
            <div className="relative mx-3">
              <div style={{ animation: "vinylSpin 8s linear infinite", transformOrigin: "center" }}>
                <VinylRecord />
              </div>
              <div className="absolute -right-4 -top-2 pointer-events-none">
                <ToneArm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACCESS SECTION (5 Signature Retro Brutalist Category Cards) */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              QUICK ACCESS // DIRECTORIES
            </h2>
          </div>
          <div className="flex-1 h-[1.5px]" style={{ backgroundColor: "rgba(17,17,17,0.15)" }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {quickAccessCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                href={card.href}
                className="relative group p-3.5 flex items-center justify-between cursor-pointer transition-all"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  boxShadow: "3px 3px 0px #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-1.5px,-1.5px)";
                  e.currentTarget.style.boxShadow = "4px 4px 0px #111111";
                  e.currentTarget.style.backgroundColor = "#F6EEDE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
                  e.currentTarget.style.backgroundColor = "#FAF7EE";
                }}
              >
                {/* Corner ticks */}
                <span className="absolute top-1 left-1.5 text-[10px] font-mono leading-none select-none text-[#F05A28]">
                  ┌
                </span>
                <span className="absolute bottom-1 right-1.5 text-[10px] font-mono leading-none select-none text-[#F05A28]">
                  ┘
                </span>

                <div className="flex items-center gap-3 min-w-0 pr-1">
                  <div
                    className="w-8 h-8 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "#F05A28",
                      border: "1.5px solid #111111",
                      color: "#FFFFFF",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold uppercase text-[#111111] truncate group-hover:text-[#F05A28] transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-[10px] text-[#7A7166] font-mono truncate">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold shrink-0" style={{ color: "#F05A28" }}>
                  &gt;
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING ON AURALIS SECTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
              TRENDING SIGNALS // ARCHIVE
            </h2>
          </div>
          <Link
            href="/discover"
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            style={{ color: "#F05A28" }}
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {trendingSongs.length > 0 ? (
          <div className="space-y-2">
            {trendingSongs.slice(0, 5).map((song, idx) => (
              <SongRow
                key={song.id}
                song={song}
                index={idx}
                playlistContext={trendingSongs}
              />
            ))}
          </div>
        ) : (
          <div
            className="p-8 text-center space-y-3"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "3px 3px 0px #111111",
            }}
          >
            <p className="text-xs font-bold uppercase text-[#111111]">{"// NO BROADCAST SIGNALS YET"}</p>
            <p className="text-xs text-[#7A7166] font-mono max-w-md mx-auto">
              Your audio catalog is waiting. Upload your first studio master from the control room.
            </p>
            {isAdmin && (
              <Link
                href="/admin/songs/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: "#F05A28",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                }}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>UPLOAD MASTER TRACK</span>
              </Link>
            )}
          </div>
        )}
      </section>

      {/* 4. RECENT ALBUMS */}
      {recentAlbums.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                NEW RELEASES & SLEEVES
              </h2>
            </div>
            <Link
              href="/discover"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
              style={{ color: "#F05A28" }}
            >
              <span>BROWSE ALL</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentAlbums.slice(0, 5).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* 5. FEATURED ARTISTS */}
      {featuredArtists.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                VERIFIED ARTISTS // SIGNALS
              </h2>
            </div>
            <Link
              href="/discover"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
              style={{ color: "#F05A28" }}
            >
              <span>ALL ARTISTS</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredArtists.slice(0, 5).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* 6. CURATED PLAYLISTS */}
      {curatedPlaylists.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                CURATED PLAYLISTS // TAPES
              </h2>
            </div>
            <Link
              href="/discover"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
              style={{ color: "#F05A28" }}
            >
              <span>ALL PLAYLISTS</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {curatedPlaylists.slice(0, 5).map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </section>
      )}

      {/* 7. TECHNICAL BOTTOM FOOTER */}
      <div
        className="mt-8 pt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#7A7166]"
        style={{ borderTop: "2px solid #111111" }}
      >
        <span>AURALIS // v1.0 • MUSIC BUILT FOR REAL PEOPLE</span>
        <span>24-BIT // 96kHz ///</span>
      </div>
    </div>
  );
}
