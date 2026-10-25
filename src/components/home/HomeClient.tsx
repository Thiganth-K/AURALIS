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
import { Play, Sparkles, Flame, Radio, ArrowRight, Music2, Upload } from "lucide-react";

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

  // Quick access items derived purely from actual database data
  const quickAccessItems = [];
  if (trendingSongs.length > 0) {
    quickAccessItems.push({
      title: "Liked Songs",
      subtitle: "Your acoustic favorites",
      artwork:
        trendingSongs[0]?.artworkUrl ||
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
      action: () => trendingSongs[0] && playSong(trendingSongs[0], trendingSongs),
      href: "/library?tab=liked",
    });
  }
  for (const pl of curatedPlaylists.slice(0, 2)) {
    quickAccessItems.push({
      title: pl.name,
      subtitle: "Curated Playlist",
      artwork:
        pl.artworkUrl ||
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
      action: () => {},
      href: `/playlist/${pl.id}`,
    });
  }
  for (const alb of recentAlbums.slice(0, 3)) {
    quickAccessItems.push({
      title: alb.title,
      subtitle: alb.artistName || "Album",
      artwork:
        alb.artworkUrl ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      action: () => {},
      href: `/album/${alb.id}`,
    });
  }

  const heroTrack = featuredMeta?.featuredSong || trendingSongs[0];
  const isCatalogEmpty = trendingSongs.length === 0 && recentAlbums.length === 0;

  return (
    <div className="px-6 md:px-10 py-8 space-y-12 max-w-7xl mx-auto select-none">
      {/* 1. RETRO CONSOLE HERO & GREETING */}
      <section className="relative p-6 sm:p-8 bg-[#111111] border-2 border-[#262626] shadow-[4px_4px_0px_#000] overflow-hidden">
        {/* Console status ticker bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#222222] text-[10px] font-pixel text-[#71717A]">
          <div className="flex items-center gap-2 text-[#D7FF3F]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>AURALIS DECK // SIGNAL ACTIVE</span>
          </div>
          <span className="hidden sm:inline text-[#A1A1AA]">
            STUDIO FLAC 24-BIT / 96kHz
          </span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <p className="text-xs font-pixel text-[#D7FF3F] tracking-wider uppercase">
            // {greeting}
          </p>

          <h1 className="text-2xl sm:text-4xl font-pixel tracking-wide text-white">
            YOUR MUSIC SYSTEM IS READY
          </h1>

          <p className="text-xs sm:text-sm font-sans text-[#A1A1AA] leading-relaxed max-w-xl">
            {featuredMeta?.subheadline ||
              (isCatalogEmpty
                ? "The audio pipeline is synchronized and ready for new master signals."
                : "Continuous high-fidelity playback engine active. Resume your acoustic sessions or explore newly indexed catalog signals.")}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            {heroTrack && (
              <button
                onClick={() => playSong(heroTrack, trendingSongs)}
                className="retro-btn-primary flex items-center gap-2 px-5 py-2.5 text-xs font-pixel"
              >
                <Play className="w-3.5 h-3.5 fill-black stroke-black" />
                <span>[ ▶ RESUME ]</span>
              </button>
            )}

            {isAdmin && (
              <Link
                href="/admin/songs/new"
                className="retro-btn-primary flex items-center gap-2 px-4 py-2.5 text-xs font-pixel"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>[ + UPLOAD SIGNAL ]</span>
              </Link>
            )}

            <Link
              href="/discover"
              className="retro-btn-secondary flex items-center gap-2 px-4 py-2.5 text-xs font-pixel"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>[ DISCOVER ]</span>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block border-l-2 border-[#222]">
          {heroTrack ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={heroTrack.artworkUrl}
              alt="Hero abstract"
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 className="w-36 h-36 text-white/5" />
            </div>
          )}
        </div>
      </section>

      {/* EMPTY CATALOG ONBOARDING PANEL */}
      {isCatalogEmpty && (
        <section className="p-8 border-2 border-[#262626] bg-[#111111] shadow-[4px_4px_0px_#000] text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-[#181818] border-2 border-[#2e2e2e] flex items-center justify-center mx-auto text-[#D7FF3F] shadow-[2px_2px_0px_#000]">
            <Music2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-pixel text-white">// NO SIGNAL FOUND</h3>
            <p className="text-xs font-sans text-[#A1A1AA] mt-2 max-w-md mx-auto leading-relaxed">
              Your audio archive is waiting for live tracks. Use the Control Room to stream master recordings to Cloudinary and populate MongoDB.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {isAdmin ? (
              <>
                <Link
                  href="/admin/songs/new"
                  className="retro-btn-primary px-4 py-2 text-xs font-pixel"
                >
                  [ UPLOAD MASTER ]
                </Link>
                <Link
                  href="/admin/artists/new"
                  className="retro-btn-secondary px-4 py-2 text-xs font-pixel"
                >
                  [ CREATE ARTIST ]
                </Link>
                <Link
                  href="/admin"
                  className="retro-btn-ghost px-4 py-2 text-xs font-pixel"
                >
                  [ CONTROL ROOM ]
                </Link>
              </>
            ) : (
              <p className="text-xs font-pixel text-[#71717A]">
                WAITING FOR TRANSMISSION BROADCASTS...
              </p>
            )}
          </div>
        </section>
      )}

      {/* 2. QUICK ACCESS CARDS */}
      {quickAccessItems.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-pixel text-[#71717A] tracking-wider">
            // QUICK ACCESS SIGNALS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickAccessItems.map((item, i) => (
              <div
                key={i}
                onClick={item.action}
                className="group relative flex items-center justify-between p-2.5 bg-[#111111] hover:bg-[#181818] border-2 border-[#262626] hover:border-[#D7FF3F] shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.artwork}
                    alt={item.title}
                    className="w-11 h-11 border border-black object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-pixel text-white group-hover:text-[#D7FF3F] transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-sans text-[#71717A] truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Tactile Play Button on hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.action();
                  }}
                  className="w-8 h-8 bg-[#D7FF3F] text-black border border-black opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-opacity shrink-0 mr-1"
                  aria-label={`Play ${item.title}`}
                >
                  <Play className="w-3.5 h-3.5 fill-black stroke-black ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. TRENDING NOW (SONG ROWS) */}
      {trendingSongs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#D7FF3F]" />
              <h2 className="text-sm font-pixel text-white tracking-wide">
                // TRENDING ON AURALIS
              </h2>
            </div>
            <Link
              href="/discover"
              className="text-xs font-pixel text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1"
            >
              <span>[ VIEW ALL ]</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-[#0e0e0e] border-2 border-[#242424] p-2 space-y-1 shadow-[3px_3px_0px_#000]">
            {trendingSongs.slice(0, 5).map((song, idx) => (
              <SongRow
                key={song.id}
                song={song}
                index={idx}
                playlistContext={trendingSongs}
                showAlbum={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. RECENTLY PLAYED / POPULAR TRACKS */}
      {trendingSongs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#222]">
            <h2 className="text-sm font-pixel text-white tracking-wide">
              // RECENT SIGNALS
            </h2>
            <Link
              href="/discover"
              className="text-xs font-pixel text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1"
            >
              <span>[ EXPLORE ]</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trendingSongs.slice(0, 5).map((song) => (
              <SongCard key={song.id} song={song} playlistContext={trendingSongs} />
            ))}
          </div>
        </section>
      )}

      {/* 5. MADE FOR YOU / CURATED PLAYLISTS */}
      {curatedPlaylists.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#222]">
            <div>
              <h2 className="text-sm font-pixel text-white tracking-wide">
                // CASSETTES & PLAYLISTS
              </h2>
            </div>
            <Link
              href="/discover"
              className="text-xs font-pixel text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1"
            >
              <span>[ ALL TAPES ]</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {curatedPlaylists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </section>
      )}

      {/* 6. NEW RELEASES */}
      {recentAlbums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#222]">
            <h2 className="text-sm font-pixel text-white tracking-wide">
              // NEW RELEASES & SLEEVES
            </h2>
            <Link
              href="/discover"
              className="text-xs font-pixel text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1"
            >
              <span>[ BROWSE ]</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* 7. FEATURED ARTISTS */}
      {featuredArtists.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#222]">
            <h2 className="text-sm font-pixel text-white tracking-wide">
              // FEATURED ARTISTS
            </h2>
            <Link
              href="/discover"
              className="text-xs font-pixel text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1"
            >
              <span>[ DISCOVER ]</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
