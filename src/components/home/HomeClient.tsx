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
import { SynthwaveHeroIllustration } from "@/components/home/SynthwaveHeroIllustration";
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
  const isCatalogEmpty = trendingSongs.length === 0 && recentAlbums.length === 0;

  // 5 Signature Quick Access Categories matching the reference design
  const quickAccessCards = [
    {
      title: "Liked Songs",
      subtitle: "Your favorites",
      icon: Heart,
      href: "/library?tab=liked",
      borderColor: "border-[#ff2a85]",
      glowColor: "rgba(255,42,133,0.3)",
      bgColor: "bg-[#14041b]",
      accentColor: "text-[#ff2a85]",
      cornerColor: "text-[#ff2a85]",
    },
    {
      title: "Recently Played",
      subtitle: "Continue listening",
      icon: Clock,
      href: "/library?tab=history",
      borderColor: "border-[#00f0ff]",
      glowColor: "rgba(0,240,255,0.3)",
      bgColor: "bg-[#021422]",
      accentColor: "text-[#00f0ff]",
      cornerColor: "text-[#00f0ff]",
    },
    {
      title: "Albums",
      subtitle: "Explore albums",
      icon: Disc3,
      href: "/library?tab=albums",
      borderColor: "border-[#8b5cf6]",
      glowColor: "rgba(139,92,246,0.3)",
      bgColor: "bg-[#0e072b]",
      accentColor: "text-[#8b5cf6]",
      cornerColor: "text-[#8b5cf6]",
    },
    {
      title: "Artists",
      subtitle: "Discover artists",
      icon: User,
      href: "/library?tab=artists",
      borderColor: "border-[#ff9e00]",
      glowColor: "rgba(255,158,0,0.3)",
      bgColor: "bg-[#1a0e03]",
      accentColor: "text-[#ff9e00]",
      cornerColor: "text-[#ff9e00]",
    },
    {
      title: "Playlists",
      subtitle: "Your collections",
      icon: ListMusic,
      href: "/library?tab=playlists",
      borderColor: "border-[#00f59b]",
      glowColor: "rgba(0,245,155,0.3)",
      bgColor: "bg-[#021a12]",
      accentColor: "text-[#00f59b]",
      cornerColor: "text-[#00f59b]",
    },
  ];

  return (
    <div className="px-4 sm:px-8 py-6 space-y-10 max-w-7xl mx-auto select-none">
      {/* 1. HERO SECTION (Cyberpunk Notched Frame with Synthwave Mic Illustration) */}
      <section className="relative p-6 sm:p-8 rounded-xl bg-[#08041c] border-2 border-[#5c32c4] shadow-[0_0_25px_rgba(92,50,196,0.3)] overflow-hidden">
        {/* Decorative corner notch brackets */}
        <span className="absolute top-2 left-2 text-[#5c32c4] font-mono text-sm leading-none select-none">
          ┌
        </span>
        <span className="absolute top-2 right-2 text-[#5c32c4] font-mono text-sm leading-none select-none">
          ┐
        </span>
        <span className="absolute bottom-2 left-2 text-[#5c32c4] font-mono text-sm leading-none select-none">
          └
        </span>
        <span className="absolute bottom-2 right-2 text-[#5c32c4] font-mono text-sm leading-none select-none">
          ┘
        </span>

        {/* Top Status Bar inside Hero */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2d1b69] text-xs font-pixel text-[#00f0ff]">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
            <span className="tracking-wider">((•)) AURALIS DECK // SIGNAL ACTIVE</span>
          </div>
          <span className="hidden sm:inline tracking-wider">
            STUDIO FLAC 24-BIT / 96kHz
          </span>
        </div>

        {/* Hero Content Left */}
        <div className="relative z-10 max-w-xl space-y-4">
          <p className="text-xs sm:text-sm font-pixel text-[#ff2a85] tracking-widest uppercase">
            {"//"} {greeting.toUpperCase()}
          </p>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-pixel tracking-wide text-white uppercase leading-tight">
            YOUR MUSIC SYSTEM IS READY
          </h1>

          <p className="text-xs sm:text-sm font-sans text-[#a79cd0] leading-relaxed max-w-lg">
            {featuredMeta?.subheadline ||
              "Curated high-fidelity acoustic streams from verified AURALIS artists."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {heroTrack && (
              <button
                type="button"
                onClick={() => playSong(heroTrack, trendingSongs)}
                className="bg-[#d7ff3f] text-black font-pixel font-bold px-6 py-2.5 rounded-lg border-2 border-black flex items-center gap-2.5 shadow-[0_0_15px_rgba(215,255,63,0.45)] hover:bg-[#cbf532] active:translate-y-0.5 transition-all text-xs sm:text-sm"
              >
                <Play className="w-4 h-4 fill-black stroke-black" />
                <span>RESUME SESSION</span>
              </button>
            )}

            <Link
              href="/discover"
              className="border border-[#4d2db7] bg-[#0c0628] text-white hover:border-[#00f0ff] hover:text-[#00f0ff] font-pixel px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_10px_rgba(77,45,183,0.25)] active:translate-y-0.5 transition-all text-xs sm:text-sm"
            >
              <Compass className="w-4 h-4 text-[#00f0ff]" />
              <span>EXPLORE DISCOVERY</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin/songs/new"
                className="border border-[#ff2a85] bg-[#14041b] text-[#ff2a85] hover:bg-[#ff2a85] hover:text-white font-pixel px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_10px_rgba(255,42,133,0.25)] active:translate-y-0.5 transition-all text-xs sm:text-sm"
              >
                <Upload className="w-4 h-4" />
                <span>[ UPLOAD ]</span>
              </Link>
            )}
          </div>
        </div>

        {/* Hero Visual Right: Synthwave Mic & Sun Illustration */}
        <SynthwaveHeroIllustration className="absolute right-2 top-0 bottom-0 w-1/2 opacity-95 hidden md:flex" />
      </section>

      {/* 2. QUICK ACCESS SECTION (5 Glowing Bracket Cards) */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[#ff2a85] font-pixel text-xs tracking-wider flex items-center gap-1.5 shrink-0">
            <span>✦</span>
            <span>QUICK ACCESS</span>
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[#ff2a85]/50 via-[#5c32c4]/40 to-transparent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickAccessCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                href={card.href}
                className={`relative group p-3.5 rounded-lg border-2 ${card.borderColor} ${card.bgColor} flex items-center justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5`}
                style={{
                  boxShadow: `0 0 12px ${card.glowColor}`,
                }}
              >
                {/* Bracket corners */}
                <span className={`absolute top-1 left-1.5 text-[10px] font-mono leading-none ${card.cornerColor} opacity-75`}>
                  ┌
                </span>
                <span className={`absolute bottom-1 right-1.5 text-[10px] font-mono leading-none ${card.cornerColor} opacity-75`}>
                  ┘
                </span>

                <div className="flex items-center gap-3 min-w-0 pr-1">
                  <div className={`p-2 rounded-md bg-[#000000]/30 ${card.accentColor} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-pixel text-white font-bold truncate group-hover:text-white transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-[10px] font-sans text-[#a79cd0] truncate">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-bold ${card.accentColor} group-hover:translate-x-0.5 transition-transform shrink-0`}>
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
            <Flame className="w-4 h-4 text-[#ff2a85]" />
            <h2 className="text-xs sm:text-sm font-pixel text-white tracking-wider uppercase">
              TRENDING ON AURALIS
            </h2>
          </div>
          <Link
            href="/discover"
            className="text-xs font-pixel text-[#00f0ff] hover:text-[#d7ff3f] transition-colors flex items-center gap-1.5"
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
          <div className="p-8 rounded-lg bg-[#0c0628] border border-[#4d2db7] text-center space-y-3">
            <p className="text-xs font-pixel text-white">{"// NO BROADCAST SIGNALS YET"}</p>
            <p className="text-xs font-sans text-[#a79cd0] max-w-md mx-auto">
              Your audio catalog is waiting. Upload your first FLAC or MP3 studio master from the control room.
            </p>
            {isAdmin && (
              <Link
                href="/admin/songs/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d7ff3f] text-black font-pixel text-xs font-bold shadow-[0_0_10px_rgba(215,255,63,0.4)]"
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
            <h2 className="text-xs sm:text-sm font-pixel text-white tracking-wider uppercase">
              NEW RELEASES & SLEEVES
            </h2>
            <Link
              href="/discover"
              className="text-xs font-pixel text-[#00f0ff] hover:text-[#d7ff3f] transition-colors flex items-center gap-1"
            >
              <span>BROWSE</span>
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
            <h2 className="text-xs sm:text-sm font-pixel text-white tracking-wider uppercase">
              FEATURED ARTISTS
            </h2>
            <Link
              href="/discover"
              className="text-xs font-pixel text-[#00f0ff] hover:text-[#d7ff3f] transition-colors flex items-center gap-1"
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
            <h2 className="text-xs sm:text-sm font-pixel text-white tracking-wider uppercase">
              CURATED PLAYLISTS
            </h2>
            <Link
              href="/discover"
              className="text-xs font-pixel text-[#00f0ff] hover:text-[#d7ff3f] transition-colors flex items-center gap-1"
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
    </div>
  );
}
