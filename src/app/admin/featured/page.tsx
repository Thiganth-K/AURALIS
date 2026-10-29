"use client";

import React, { useEffect, useState } from "react";
import {
  Music,
  Disc3,
  Mic2,
  ListMusic,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Radio,
  Eye,
} from "lucide-react";

interface SongOpt {
  id: string;
  title: string;
  artist?: { name: string };
  album?: { title: string; artworkUrl?: string };
}
interface AlbumOpt {
  id: string;
  title: string;
  artist?: { name: string };
  artworkUrl?: string;
}
interface ArtistOpt {
  id: string;
  name: string;
  image?: string;
  genres?: string[];
}
interface PlaylistOpt {
  id: string;
  name: string;
  artworkUrl?: string;
  songCount?: number;
}

const WIDE_SOUNDWAVE_BARS = [
  8, 12, 17, 24, 30, 38, 46, 54, 60, 65, 70, 74, 76, 74, 70, 65, 60, 54, 46, 38, 30, 24, 17, 12, 8
];

export default function AdminFeaturedPage() {
  const [songs, setSongs] = useState<SongOpt[]>([]);
  const [albums, setAlbums] = useState<AlbumOpt[]>([]);
  const [artists, setArtists] = useState<ArtistOpt[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistOpt[]>([]);

  // Selected values
  const [featuredSongId, setFeaturedSongId] = useState("");
  const [featuredAlbumId, setFeaturedAlbumId] = useState("");
  const [featuredArtistId, setFeaturedArtistId] = useState("");
  const [featuredPlaylistId, setFeaturedPlaylistId] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        const [featRes, sRes, albRes, artRes, plRes] = await Promise.all([
          fetch("/api/admin/featured"),
          fetch("/api/admin/songs?status=published"),
          fetch("/api/admin/albums"),
          fetch("/api/admin/artists"),
          fetch("/api/admin/playlists"),
        ]);

        if (featRes.ok) {
          const fData = await featRes.json();
          if (fData.featured) {
            setFeaturedSongId(fData.featured.featuredSongId?._id || fData.featured.featuredSongId || "");
            setFeaturedAlbumId(fData.featured.featuredAlbumId?._id || fData.featured.featuredAlbumId || "");
            setFeaturedArtistId(fData.featured.featuredArtistId?._id || fData.featured.featuredArtistId || "");
            setFeaturedPlaylistId(fData.featured.featuredPlaylistId?._id || fData.featured.featuredPlaylistId || "");
            setHeadline(fData.featured.headline || "");
            setSubheadline(fData.featured.subheadline || "");
          }
        }
        if (sRes.ok) {
          const s = await sRes.json();
          if (s.success) setSongs(s.songs);
        }
        if (albRes.ok) {
          const a = await albRes.json();
          if (a.success) setAlbums(a.albums);
        }
        if (artRes.ok) {
          const ar = await artRes.json();
          if (ar.success) setArtists(ar.artists);
        }
        if (plRes.ok) {
          const p = await plRes.json();
          if (p.success) setPlaylists(p.playlists);
        }
      } catch (err) {
        console.error("Failed to load featured configuration:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featuredSongId,
          featuredAlbumId,
          featuredArtistId,
          featuredPlaylistId,
          headline,
          subheadline,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "FEATURED SHOWCASE CONFIGURATION SAVED & LIVE ACROSS BROADCAST NETWORK." });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update featured content" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while saving" });
    } finally {
      setSaving(false);
    }
  };

  const selectedSong = songs.find((s) => s.id === featuredSongId);
  const selectedAlbum = albums.find((a) => a.id === featuredAlbumId);
  const selectedArtist = artists.find((ar) => ar.id === featuredArtistId);
  const selectedPlaylist = playlists.find((p) => p.id === featuredPlaylistId);

  return (
    <div className="space-y-6 select-none font-mono">
      {/* ── 1. HERO BANNER ─────────────────────────────────── */}
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          {/* Left Text Column */}
          <div className="max-w-xl">
            {/* Tagline */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 inline-block shrink-0"
                style={{ backgroundColor: "#F05A28" }}
              />
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase"
                style={{ color: "#F05A28" }}
              >
                AURALIS // EDITORIAL SPOTLIGHT
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111] uppercase leading-tight select-text"
              style={{ fontWeight: 900 }}
            >
              FEATURED SHOWCASE // CURATION
            </h1>

            {/* Sub-text (Two Lines) */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] mt-2 font-mono leading-relaxed">
              Control the primary editorial spotlight, hero headline, and curated releases
              <br className="hidden sm:inline" />
              {" "}broadcasted across the public home page discovery carousel.
            </p>
          </div>

          {/* Right Side: Soundwave Bars & Editorial Slogan */}
          <div className="hidden sm:flex items-center gap-4 sm:gap-5 shrink-0">
            {/* Inline Keyframes to guarantee instant rendering */}
            <style>{`
              @keyframes auralisWaveDance {
                0%, 100% {
                  transform: scaleY(0.18);
                  opacity: 0.6;
                }
                50% {
                  transform: scaleY(1.08);
                  opacity: 1;
                }
              }
            `}</style>

            {/* Wide Soundwave bars with smooth up-and-down wave animation */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 h-20 px-2 select-none"
              title="Auralis Live Audio Equalizer Spectrum"
            >
              {WIDE_SOUNDWAVE_BARS.map((height, idx) => (
                <span
                  key={idx}
                  className="bg-[#F05A28]"
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: `${height}px`,
                    borderRadius: "1.5px",
                    transformOrigin: "center",
                    animation: "auralisWaveDance 1.35s ease-in-out infinite",
                    animationDelay: `${(idx * 0.055).toFixed(3)}s`,
                    willChange: "transform",
                  }}
                />
              ))}
            </div>

            {/* Tagline on the Right */}
            <div
              className="text-left text-[10px] font-bold tracking-widest text-[#111111] uppercase leading-tight font-mono pl-4 sm:pl-5 shrink-0"
              style={{ borderLeft: "1.5px solid rgba(17, 17, 17, 0.2)" }}
            >
              <p>BETTER MUSIC</p>
              <p className="my-0.5">BETTER PEOPLE</p>
              <p style={{ color: "#F05A28" }}>AURALIS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className="p-3.5 flex items-center gap-2.5 text-xs font-bold uppercase"
          style={{
            backgroundColor: message.type === "success" ? "#ECFDF5" : "#FFF0ED",
            border: message.type === "success" ? "2px solid #15803D" : "2px solid #D62828",
            color: message.type === "success" ? "#15803D" : "#D62828",
            boxShadow: "2px 2px 0px #111111",
          }}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#F05A28" }} />
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A7166]">
            LOADING EDITORIAL SPOTLIGHTS...
          </span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ── PANEL 1: HERO HEADLINES & LIVE SIMULATION ────── */}
            <div
              className="relative p-6 space-y-5"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
              }}
            >
              {/* Corner ticks */}
              <span
                className="absolute top-1.5 left-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                ┌
              </span>
              <span
                className="absolute top-1.5 right-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                ┐
              </span>
              <span
                className="absolute bottom-1.5 left-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                └
              </span>
              <span
                className="absolute bottom-1.5 right-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                ┘
              </span>

              {/* Panel Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#111111]/15">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 inline-block shrink-0"
                    style={{ backgroundColor: "#F05A28" }}
                  />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    HERO BANNER HEADLINES
                  </h2>
                </div>
                <span className="text-[10px] text-[#7A7166] uppercase font-bold">
                  [ BROADCAST OVERLAY ]
                </span>
              </div>

              {/* Headline Input */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                  <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                  <span>SPOTLIGHT BANNER HEADLINE</span>
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Editorial Radio • FLAC 24-bit"
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none uppercase"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "2px solid #111111",
                    color: "#111111",
                    caretColor: "#F05A28",
                    boxShadow: "2px 2px 0px #111111",
                  }}
                />
              </div>

              {/* Subheadline Input */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                  <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                  <span>SPOTLIGHT SUBHEADLINE</span>
                </label>
                <textarea
                  rows={2}
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="Curated high-fidelity acoustic streams from verified AURALIS artists."
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none resize-none"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "2px solid #111111",
                    color: "#111111",
                    caretColor: "#F05A28",
                    boxShadow: "2px 2px 0px #111111",
                  }}
                />
              </div>

              {/* Live Home Page Banner Simulation */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7166]">
                    LIVE HOME HERO SIMULATION
                  </span>
                </div>
                <div
                  className="p-4 sm:p-5 relative overflow-hidden"
                  style={{
                    backgroundColor: "#F6EEDE",
                    border: "2px solid #111111",
                    boxShadow: "2.5px 2.5px 0px #111111",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: "#FFF0ED",
                        color: "#F05A28",
                        border: "1px solid #F05A28",
                      }}
                    >
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                      LIVE BROADCAST
                    </span>
                    <span className="text-[9px] font-bold text-[#7A7166]">
                      HI-RES 96kHz / 24-BIT
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-[#111111] line-clamp-1">
                    {headline || "EDITORIAL RADIO • FLAC 24-BIT"}
                  </h3>
                  <p className="text-xs text-[#7A7166] mt-1 line-clamp-2">
                    {subheadline ||
                      "Curated high-fidelity acoustic streams from verified AURALIS artists."}
                  </p>

                  {/* Active Song Snippet */}
                  <div
                    className="mt-3.5 p-2.5 flex items-center gap-3"
                    style={{
                      backgroundColor: "#FAF7EE",
                      border: "1.5px solid #111111",
                    }}
                  >
                    <div
                      className="w-9 h-9 flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: "#F05A28",
                        border: "1px solid #111111",
                        boxShadow: "0 2px 8px rgba(240, 90, 40, 0.4)",
                      }}
                    >
                      <Music className="w-4 h-4 text-[#111111]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold uppercase truncate text-[#111111]">
                        {selectedSong ? selectedSong.title : "AUTOMATIC SELECTION"}
                      </div>
                      <div className="text-[9px] text-[#7A7166] uppercase truncate">
                        {selectedSong?.artist?.name || "DYNAMIC HIGH-STREAM TRACK"}
                      </div>
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5"
                      style={{
                        backgroundColor: "#FFF0ED",
                        color: "#F05A28",
                        border: "1px solid #F05A28",
                      }}
                    >
                      SPOTLIGHT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PANEL 2: SPOTLIGHT SELECTORS ────────────────── */}
            <div
              className="relative p-6 space-y-4"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
              }}
            >
              {/* Corner ticks */}
              <span
                className="absolute top-1.5 left-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                ┌
              </span>
              <span
                className="absolute top-1.5 right-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                ┐
              </span>
              <span
                className="absolute bottom-1.5 left-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                └
              </span>
              <span
                className="absolute bottom-1.5 right-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                ┘
              </span>

              {/* Panel Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#111111]/15">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 inline-block shrink-0"
                    style={{ backgroundColor: "#F05A28" }}
                  />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    CURATED DISPATCH SELECTORS
                  </h2>
                </div>
                <span className="text-[10px] text-[#7A7166] uppercase font-bold">
                  [ 4 CHANNELS ]
                </span>
              </div>

              {/* 1. Featured Song Selection */}
              <div className="p-3 bg-[#F6EEDE] border border-[#111111]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
                    <Music className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                    <span>HERO FEATURED TRACK</span>
                  </label>
                  {selectedSong && (
                    <span className="text-[9px] font-bold uppercase text-[#15803D]">
                      [ LINKED ]
                    </span>
                  )}
                </div>
                <select
                  value={featuredSongId}
                  onChange={(e) => setFeaturedSongId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                    color: "#111111",
                  }}
                >
                  <option value="">NONE / AUTOMATIC TRENDING TRACK</option>
                  {songs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} — {s.artist?.name || "ARTIST"}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Featured Album Selection */}
              <div className="p-3 bg-[#F6EEDE] border border-[#111111]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
                    <Disc3 className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                    <span>FEATURED ALBUM SPOTLIGHT</span>
                  </label>
                  {selectedAlbum && (
                    <span className="text-[9px] font-bold uppercase text-[#15803D]">
                      [ LINKED ]
                    </span>
                  )}
                </div>
                <select
                  value={featuredAlbumId}
                  onChange={(e) => setFeaturedAlbumId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                    color: "#111111",
                  }}
                >
                  <option value="">NONE / AUTOMATIC NEW RELEASE</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} — {a.artist?.name || "ARTIST"}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Featured Artist Selection */}
              <div className="p-3 bg-[#F6EEDE] border border-[#111111]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
                    <Mic2 className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                    <span>FEATURED ARTIST SPOTLIGHT</span>
                  </label>
                  {selectedArtist && (
                    <span className="text-[9px] font-bold uppercase text-[#15803D]">
                      [ LINKED ]
                    </span>
                  )}
                </div>
                <select
                  value={featuredArtistId}
                  onChange={(e) => setFeaturedArtistId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                    color: "#111111",
                  }}
                >
                  <option value="">NONE / AUTOMATIC TOP ARTIST</option>
                  {artists.map((ar) => (
                    <option key={ar.id} value={ar.id}>
                      {ar.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Featured Playlist Selection */}
              <div className="p-3 bg-[#F6EEDE] border border-[#111111]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
                    <ListMusic className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                    <span>FEATURED EDITORIAL PLAYLIST</span>
                  </label>
                  {selectedPlaylist && (
                    <span className="text-[9px] font-bold uppercase text-[#15803D]">
                      [ LINKED ]
                    </span>
                  )}
                </div>
                <select
                  value={featuredPlaylistId}
                  onChange={(e) => setFeaturedPlaylistId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                    color: "#111111",
                  }}
                >
                  <option value="">NONE / AUTOMATIC TOP PLAYLIST</option>
                  {playlists.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── 3. BOTTOM COMMAND STRIP ─────────────────────── */}
          <div
            className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "3px 3px 0px #111111",
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#7A7166]">
              <Sparkles className="w-4 h-4" style={{ color: "#F05A28" }} />
              <span>[ SYSTEM STATUS: READY TO BROADCAST SPOTLIGHT CONFIGURATION ]</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
              }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>COMMITTING BROADCAST...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>[ 💾 SAVE SHOWCASE CONFIGURATION ]</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
