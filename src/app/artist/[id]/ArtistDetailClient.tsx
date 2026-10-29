"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArtistDTO, SongDTO, AlbumDTO } from "@/types/music";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";
import { SongRow } from "@/components/music/SongRow";
import { AlbumCard } from "@/components/music/AlbumCard";
import {
  Play,
  Pause,
  Shuffle,
  ArrowLeft,
  ArrowUpRight,
  Heart,
  Radio,
  Disc3,
  UserCheck,
  UserPlus,
  Share2,
  Sparkles,
} from "lucide-react";

interface ArtistDetailClientProps {
  artist: ArtistDTO;
  songs: SongDTO[];
  albums: AlbumDTO[];
}

export function ArtistDetailClient({
  artist,
  songs,
  albums,
}: ArtistDetailClientProps) {
  const router = useRouter();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { user } = useAuth();

  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(artist.followerCount || 0);
  const [copied, setCopied] = useState(false);

  const isThisArtistPlaying =
    isPlaying && songs.some((s) => s.id === currentSong?.id);

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    if (isThisArtistPlaying) {
      togglePlay();
    } else {
      playSong(songs[0], songs);
    }
  };

  const handleShuffle = () => {
    if (songs.length === 0) return;
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    playSong(shuffled[0], shuffled);
  };

  const handleToggleFollow = () => {
    setFollowing(!following);
    setFollowerCount((prev) => (following ? Math.max(0, prev - 1) : prev + 1));
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 md:p-8 space-y-6 font-mono select-none">
      {/* ── BREADCRUMB & BACK NAV ── */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-1 font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: "#FAF7EE",
            border: "1.5px solid #111111",
            boxShadow: "1.5px 1.5px 0px #111111",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F6EEDE";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FAF7EE";
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#111111]" />
          <span>BACK</span>
        </button>

        <div className="flex items-center gap-2 tracking-wide">
          <Link href="/home" className="text-[#7A7166] hover:text-[#111111] transition-colors">
            HOME
          </Link>
          <span className="text-[#A3998D]">//</span>
          <Link href="/library?tab=artists" className="text-[#7A7166] hover:text-[#111111] transition-colors">
            ARTISTS
          </Link>
          <span className="text-[#A3998D]">//</span>
          <span className="font-bold text-[#111111] uppercase">{artist.name}</span>
        </div>
      </div>

      {/* ── ARTIST HERO BANNER CARD ── */}
      <div
        className="relative p-6 sm:p-8 overflow-hidden space-y-6"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Technical Corner Crop Marks */}
        <span className="absolute top-1.5 left-2 text-base font-bold text-[#F05A28]">┌</span>
        <span className="absolute top-1.5 right-2 text-base font-bold text-[#F05A28]">┐</span>
        <span className="absolute bottom-1.5 left-2 text-base font-bold text-[#F05A28]">└</span>
        <span className="absolute bottom-1.5 right-2 text-base font-bold text-[#F05A28]">┘</span>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Artist Circular Portrait */}
            <div className="relative group shrink-0">
              <div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 overflow-hidden"
                style={{
                  border: "2.5px solid #111111",
                  boxShadow: "3.5px 3.5px 0px #111111",
                  backgroundColor: "#F2EADB",
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[#FAF7EE]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Verified Badge */}
              <div
                className="absolute -bottom-1 -right-1 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wider flex items-center gap-1"
                style={{
                  backgroundColor: "#F05A28",
                  border: "1.5px solid #111111",
                }}
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>VERIFIED</span>
              </div>
            </div>

            {/* Artist Information */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#F05A28] border-b border-[#F05A28] pb-0.5">
                  TRANSMITTER // SIGNAL ID #{artist.id.slice(-6).toUpperCase()}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#111111] tracking-tight">
                {artist.name}
              </h1>

              {artist.bio && (
                <p className="text-xs text-[#4A433A] leading-relaxed max-w-xl font-mono">
                  {artist.bio}
                </p>
              )}

              {/* Genre Badges */}
              {artist.genres && artist.genres.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {artist.genres.map((genre, i) => (
                    <span
                      key={i}
                      className="text-[9.5px] font-bold uppercase px-2 py-0.5"
                      style={{
                        backgroundColor: "#FFF0ED",
                        color: "#F05A28",
                        border: "1px solid #F05A28",
                      }}
                    >
                      #{genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Transport Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto pt-2 md:pt-0">
            {/* Play All */}
            <button
              type="button"
              onClick={handlePlayAll}
              className="h-10 px-5 text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
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
              {isThisArtistPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE CATALOG</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY SIGNALS</span>
                </>
              )}
            </button>

            {/* Shuffle */}
            <button
              type="button"
              onClick={handleShuffle}
              className="h-10 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
              style={{
                backgroundColor: "#FAF7EE",
                color: "#111111",
                border: "2px solid #111111",
                boxShadow: "2.5px 2.5px 0px #111111",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F6EEDE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FAF7EE";
              }}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>SHUFFLE</span>
            </button>

            {/* Follow / Following */}
            <button
              type="button"
              onClick={handleToggleFollow}
              className="h-10 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
              style={{
                backgroundColor: following ? "#F6EEDE" : "#FAF7EE",
                color: following ? "#F05A28" : "#111111",
                border: following ? "2px solid #F05A28" : "2px solid #111111",
                boxShadow: "2.5px 2.5px 0px #111111",
              }}
            >
              {following ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>FOLLOWING</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>FOLLOW</span>
                </>
              )}
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="h-10 px-3.5 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1 transition-all cursor-pointer font-mono"
              style={{
                backgroundColor: "#FAF7EE",
                color: "#111111",
                border: "2px solid #111111",
                boxShadow: "2.5px 2.5px 0px #111111",
              }}
              title="Share Artist"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{copied ? "COPIED" : "SHARE"}</span>
            </button>
          </div>
        </div>

        {/* ── STATS CHIPS ROW ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3" style={{ borderTop: "1.5px solid rgba(17,17,17,0.15)" }}>
          <div className="p-3" style={{ backgroundColor: "#F6EEDE", border: "1.5px solid #111111" }}>
            <span className="text-[10px] font-bold text-[#7A7166] uppercase block">FOLLOWERS</span>
            <span className="text-base font-black text-[#111111]">
              {followerCount >= 1000 ? `${(followerCount / 1000).toFixed(1)}K` : followerCount}
            </span>
          </div>

          <div className="p-3" style={{ backgroundColor: "#F6EEDE", border: "1.5px solid #111111" }}>
            <span className="text-[10px] font-bold text-[#7A7166] uppercase block">CATALOG SIGNALS</span>
            <span className="text-base font-black text-[#111111]">{songs.length} TRACKS</span>
          </div>

          <div className="p-3" style={{ backgroundColor: "#F6EEDE", border: "1.5px solid #111111" }}>
            <span className="text-[10px] font-bold text-[#7A7166] uppercase block">RELEASES & SLEEVES</span>
            <span className="text-base font-black text-[#111111]">{albums.length} ALBUMS</span>
          </div>

          <div className="p-3" style={{ backgroundColor: "#F6EEDE", border: "1.5px solid #111111" }}>
            <span className="text-[10px] font-bold text-[#7A7166] uppercase block">FIDELITY STANDARD</span>
            <span className="text-base font-black text-[#F05A28]">STUDIO 24-BIT</span>
          </div>
        </div>
      </div>

      {/* ── DISCOGRAPHY / ALBUMS SECTION (IF ANY) ── */}
      {albums.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-[#111111]">
            <span className="w-2 h-2 inline-block bg-[#F05A28]" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
              OFFICIAL ALBUMS & SLEEVES // {albums.length} RELEASES
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}

      {/* ── ARTIST TRACKS DIRECTORY ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#111111]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 inline-block bg-[#F05A28]" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
              POPULAR SIGNALS & TRACK DIRECTORY // {songs.length} TRACKS
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[#7A7166] uppercase">
            STUDIO FLAC 24-BIT 96KHZ
          </span>
        </div>

        {songs.length === 0 ? (
          <div
            className="p-10 text-center space-y-2"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px dashed #C8BFB0",
            }}
          >
            <p className="text-xs font-bold uppercase text-[#7A7166]">
              NO TRANSMITTING SIGNALS ARCHIVED YET.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song, idx) => (
              <SongRow
                key={song.id}
                song={song}
                index={idx + 1}
                playlistContext={songs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
