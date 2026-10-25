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
    <div className="px-6 md:px-10 py-8 space-y-12 max-w-7xl mx-auto">
      {/* 1. EDITORIAL HERO & GREETING */}
      <section className="relative rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[#181818] via-[#121212] to-[#090909] border border-white/5 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#D7FF3F]">
            <Radio className="w-3 h-3 text-[#D7FF3F] animate-pulse" />
            <span>{featuredMeta?.headline || "AURALIS Live Platform • Studio Quality"}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            {greeting}
          </h1>

          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            {featuredMeta?.subheadline ||
              (isCatalogEmpty
                ? "Your database and Cloudinary asset pipeline are connected. The catalog is ready for fresh music uploads."
                : "Your personalized acoustic stream is tuned to high-fidelity audio. Discover fresh electronic landscapes and late-night neo-soul.")}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {heroTrack && (
              <button
                onClick={() => playSong(heroTrack, trendingSongs)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D7FF3F] text-black font-semibold text-xs hover:bg-[#c5ea33] transition-colors shadow-lg shadow-[#D7FF3F]/15"
              >
                <Play className="w-3.5 h-3.5 fill-black stroke-black" />
                <span>Play Featured</span>
              </button>
            )}

            {isAdmin && (
              <Link
                href="/admin/songs/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D7FF3F] text-black font-semibold text-xs hover:bg-[#c5ea33] transition-colors shadow-lg shadow-[#D7FF3F]/15"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Song</span>
              </Link>
            )}

            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white font-medium text-xs hover:bg-white/10 transition-colors border border-white/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>Explore Catalog</span>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none hidden md:block">
          {heroTrack ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={heroTrack.artworkUrl}
              alt="Hero abstract"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 className="w-48 h-48 text-white/5" />
            </div>
          )}
        </div>
      </section>

      {/* EMPTY CATALOG ONBOARDING PANEL */}
      {isCatalogEmpty && (
        <section className="rounded-2xl p-8 border border-white/10 bg-[#121212]/80 backdrop-blur-xl text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 flex items-center justify-center mx-auto text-[#D7FF3F]">
            <Music2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Music Catalog is Clean</h3>
            <p className="text-xs text-[#A1A1AA] mt-1 max-w-md mx-auto leading-relaxed">
              All previous mock and test audio tracks have been completely cleared. You can now use the Admin Portal to upload real audio files to Cloudinary and populate MongoDB.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {isAdmin ? (
              <>
                <Link
                  href="/admin/songs/new"
                  className="px-4 py-2 rounded-xl bg-[#D7FF3F] text-black text-xs font-semibold hover:bg-[#c5ea33] transition-colors"
                >
                  Upload First Track
                </Link>
                <Link
                  href="/admin/artists/new"
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-medium hover:bg-white/15 transition-colors"
                >
                  Create Artist
                </Link>
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A1A1AA] hover:text-white text-xs font-medium transition-colors"
                >
                  Admin Dashboard
                </Link>
              </>
            ) : (
              <p className="text-xs text-[#71717A]">
                Check back soon as tracks and albums are published.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 2. QUICK ACCESS CARDS */}
      {quickAccessItems.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickAccessItems.map((item, i) => (
              <div
                key={i}
                onClick={item.action}
                className="group relative flex items-center justify-between p-2 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-all cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.artwork}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#D7FF3F] transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#71717A] truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Play Button on hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.action();
                  }}
                  className="w-9 h-9 rounded-full bg-[#D7FF3F] text-black opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg shadow-black/50 transition-all transform translate-x-1 group-hover:translate-x-0 shrink-0 mr-1"
                  aria-label={`Play ${item.title}`}
                >
                  <Play className="w-4 h-4 fill-black stroke-black ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. TRENDING NOW (SONG ROWS) */}
      {trendingSongs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#D7FF3F]" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Trending on Auralis
              </h2>
            </div>
            <Link
              href="/discover"
              className="text-xs text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1 font-medium"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#111111] rounded-2xl p-2 sm:p-3 border border-white/5 space-y-1">
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

      {/* 4. RECENTLY PLAYED */}
      {trendingSongs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Popular Tracks
            </h2>
            <Link
              href="/discover"
              className="text-xs text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Playlists
              </h2>
              <p className="text-xs text-[#71717A] mt-0.5">
                Curated acoustic frequency mixes based on your listening habits
              </p>
            </div>
            <Link
              href="/discover"
              className="text-xs text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1 font-medium"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">
              New Releases
            </h2>
            <Link
              href="/discover"
              className="text-xs text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Browse releases</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Featured Artists
            </h2>
            <Link
              href="/discover"
              className="text-xs text-[#A1A1AA] hover:text-[#D7FF3F] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Discover more</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
