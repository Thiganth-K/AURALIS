"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Play,
  Pause,
  Trash2,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";

interface AdminSongItem {
  id: string;
  title: string;
  slug: string;
  artist?: { _id: string; name: string; image: string };
  album?: { _id: string; title: string; artworkUrl: string };
  audioUrl: string;
  artworkUrl: string;
  duration: number;
  genre: string;
  playCount: number;
  explicit: boolean;
  status: "draft" | "published" | "archived";
  createdAt: string;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<AdminSongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Lightweight preview player inside admin
  const [previewSongId, setPreviewSongId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/songs");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.songs)) {
          setSongs(data.songs);
        }
      }
    } catch (err) {
      console.error("Failed to load songs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
    return () => {
      if (previewAudio) {
        previewAudio.pause();
      }
    };
  }, []);

  const handleTogglePreview = (song: AdminSongItem) => {
    if (previewSongId === song.id) {
      previewAudio?.pause();
      setPreviewSongId(null);
      return;
    }

    if (previewAudio) {
      previewAudio.pause();
    }

    const audio = new Audio(song.audioUrl);
    audio.play().catch((e) => console.warn("Preview playback failed:", e));
    audio.onended = () => setPreviewSongId(null);
    setPreviewAudio(audio);
    setPreviewSongId(song.id);
  };

  const handleTogglePublish = (song: AdminSongItem) => {
    setActionError(null);
    const newStatus = song.status === "published" ? "draft" : "published";

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/songs/${song.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          setSongs((prev) =>
            prev.map((s) => (s.id === song.id ? { ...s, status: newStatus } : s))
          );
        } else {
          const err = await res.json();
          setActionError(err.error || "Failed to update publish state");
        }
      } catch {
        setActionError("Network error while updating song");
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete song "${title}"?`)) return;

    setActionError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/songs/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          if (previewSongId === id && previewAudio) {
            previewAudio.pause();
            setPreviewSongId(null);
          }
          setSongs((prev) => prev.filter((s) => s.id !== id));
        } else {
          const err = await res.json();
          setActionError(err.error || "Failed to delete song");
        }
      } catch {
        setActionError("Network error while deleting song");
      }
    });
  };

  // Distinct genres from loaded songs
  const uniqueGenres = Array.from(new Set(songs.map((s) => s.genre).filter(Boolean)));

  const filtered = songs.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.artist?.name && s.artist.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === "all" || s.genre.toLowerCase() === genreFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none font-mono">
      {/* ── 1. HERO BANNER (MATCHES USER SPEC EXACTLY) ──────── */}
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
                AURALIS // TRACK CATALOG
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              SONG CATALOG // INGESTION
            </h1>

            {/* Sub-text (Two Lines) */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] mt-2 font-mono leading-relaxed">
              Authoritative track catalog. Draft uploads are hidden from public stream
              <br className="hidden sm:inline" />
              {" "}until published.
            </p>
          </div>

          {/* Right Side: Soundwave Bars & Editorial Slogan */}
          <div className="hidden sm:flex items-center gap-5 shrink-0">
            {/* Center Soundwave Graphic in Vivid Orange */}
            <div className="flex items-center gap-[3px] h-12 px-2">
              <span className="w-[3px] bg-[#F05A28] h-3 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-5 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-8 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-11 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-12 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-9 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-7 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-4 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-2 rounded-xs" />
            </div>

            {/* Tagline on the Right */}
            <div
              className="text-left text-[10px] font-bold tracking-widest text-[#111111] uppercase leading-tight font-mono pl-5"
              style={{ borderLeft: "1px solid rgba(17, 17, 17, 0.15)" }}
            >
              <p>BETTER MUSIC</p>
              <p className="my-0.5">BETTER PEOPLE</p>
              <p style={{ color: "#F05A28" }}>AURALIS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {actionError && (
        <div
          className="p-3.5 flex items-center gap-2.5 text-xs font-bold uppercase"
          style={{
            backgroundColor: "#FFF0ED",
            border: "2px solid #D62828",
            color: "#D62828",
            boxShadow: "2px 2px 0px #111111",
          }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* ── 2. SEARCH & FILTERS BAR (EXACT SPEC) ─────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3.5 justify-between">
        {/* Search input with bold offset box */}
        <div
          className="flex-1 max-w-lg flex items-center gap-3 px-3.5 py-2.5 text-xs"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "2.5px 2.5px 0px #111111",
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
          <input
            type="text"
            placeholder="SEARCH TRACKS, ARTISTS, GENRES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#111111] placeholder-[#7A7166] focus:outline-none font-mono text-xs uppercase tracking-wide"
            style={{ caretColor: "#F05A28" }}
          />
        </div>

        {/* Filter Section on Right */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
            <Filter className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
            <span className="tracking-wider">FILTER:</span>
          </div>

          {/* Genre / Roles Dropdown */}
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <option value="all">ALL ROLES</option>
            {uniqueGenres.map((g) => (
              <option key={g} value={g}>
                {g.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <option value="all">ALL STATUSES</option>
            <option value="published">LIVE</option>
            <option value="draft">DRAFT</option>
            <option value="archived">ARCHIVED</option>
          </select>

          {/* Action: Upload Signal */}
          <Link
            href="/admin/songs/new"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            style={{
              backgroundColor: "#F05A28",
              color: "#FFFFFF",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
            title="Upload a new signal"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>[ + INGEST ]</span>
          </Link>
        </div>
      </div>

      {/* ── 3. INGESTED SIGNALS DIRECTORY TABLE CONTAINER ────── */}
      <div
        className="relative overflow-visible"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Outer Corner Crop Ticks (in Orange #F05A28) */}
        <span
          className="absolute -top-1 -left-1 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┌
        </span>
        <span
          className="absolute -top-1 -right-1 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┐
        </span>
        <span
          className="absolute -bottom-1 -left-1 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          └
        </span>
        <span
          className="absolute -bottom-1 -right-1 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┘
        </span>

        {/* Table Header Bar */}
        <div
          className="px-5 py-3.5 flex items-center justify-between"
          style={{ borderBottom: "2px solid #111111" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 inline-block shrink-0"
              style={{ backgroundColor: "#F05A28" }}
            />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              INGESTED SIGNALS DIRECTORY
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7166]">
            [ {filtered.length} RECORDS FOUND ]
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#F05A28" }} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A7166]">
              FETCHING TRACK CATALOG...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#7A7166] text-xs font-bold uppercase tracking-wider">
            NO SONGS MATCH THE CURRENT CRITERIA.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead
                className="text-[#7A7166] uppercase font-bold text-[10px] tracking-wider"
                style={{
                  backgroundColor: "#F6EEDE",
                  borderBottom: "1.5px solid #111111",
                }}
              >
                <tr>
                  <th className="py-3 px-4 w-12 text-center">CUE</th>
                  <th className="py-3 px-4">TRACK</th>
                  <th className="py-3 px-4">ARTIST</th>
                  <th className="py-3 px-4">ALBUM</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">TIME</th>
                  <th className="py-3 px-5 text-right">COMMANDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/15">
                {filtered.map((song) => {
                  const isPlaying = previewSongId === song.id;

                  // Status badge helper
                  let statusBadge = (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: "#ECFDF5",
                        color: "#15803D",
                        border: "1px solid #16A34A",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                      <span>[ LIVE ]</span>
                    </span>
                  );

                  if (song.status === "draft") {
                    statusBadge = (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: "#FEF3C7",
                          color: "#B45309",
                          border: "1px solid #B45309",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                        <span>[ DRAFT ]</span>
                      </span>
                    );
                  } else if (song.status === "archived") {
                    statusBadge = (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: "#FAF7EE",
                          color: "#7A7166",
                          border: "1px solid #111111",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7A7166]" />
                        <span>[ ARCHIVED ]</span>
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={song.id}
                      className="hover:bg-[#F6EEDE] transition-colors"
                    >
                      {/* CUE Column: Retro Boxed Play/Pause button */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePreview(song)}
                          className="w-8 h-8 inline-flex items-center justify-center transition-all cursor-pointer"
                          style={{
                            backgroundColor: isPlaying ? "#F05A28" : "#FAF7EE",
                            color: isPlaying ? "#FFFFFF" : "#111111",
                            border: "1.5px solid #111111",
                            boxShadow: "1.5px 1.5px 0px #111111",
                          }}
                          title={isPlaying ? "Pause preview" : "Cue track preview"}
                        >
                          {isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                      </td>

                      {/* TRACK Column: Thumbnail + Bold Title + Genre */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={song.artworkUrl}
                            alt={song.title}
                            className="w-9 h-9 object-cover shrink-0"
                            style={{ border: "1.5px solid #111111" }}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-[#111111] flex items-center gap-1.5 uppercase truncate text-xs tracking-wide">
                              <span>{song.title}</span>
                              {song.explicit && (
                                <span
                                  className="text-[8px] font-bold px-1"
                                  style={{
                                    backgroundColor: "#FFF0ED",
                                    color: "#F05A28",
                                    border: "1px solid #F05A28",
                                  }}
                                >
                                  EXP
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#7A7166] font-mono truncate mt-0.5">
                              {song.genre}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ARTIST Column */}
                      <td className="py-3.5 px-4 font-bold text-[#111111] uppercase tracking-wide">
                        {song.artist?.name || "POST MALONE"}
                      </td>

                      {/* ALBUM Column */}
                      <td className="py-3.5 px-4 text-[#7A7166] uppercase font-mono">
                        {song.album?.title || "SINGLE"}
                      </td>

                      {/* STATUS Column */}
                      <td className="py-3.5 px-4">{statusBadge}</td>

                      {/* TIME Column */}
                      <td className="py-3.5 px-4 text-[#7A7166] font-mono">
                        {formatDuration(song.duration)}
                      </td>

                      {/* COMMANDS Column: [ UNPUBLISH / PUBLISH ] + [ 🗑 ] */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleTogglePublish(song)}
                            title={
                              song.status === "published"
                                ? "Unpublish to draft"
                                : "Publish to live stream"
                            }
                            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                            style={{
                              backgroundColor:
                                song.status === "published" ? "#FAF7EE" : "#F05A28",
                              color: song.status === "published" ? "#111111" : "#FFFFFF",
                              border: "1.5px solid #111111",
                              boxShadow: "1.5px 1.5px 0px #111111",
                            }}
                          >
                            {song.status === "published" ? "UNPUBLISH" : "PUBLISH"}
                          </button>

                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleDelete(song.id, song.title)}
                            title="Delete song"
                            className="p-1.5 transition-all cursor-pointer"
                            style={{
                              backgroundColor: "#FAF7EE",
                              border: "1.5px solid #D62828",
                              color: "#D62828",
                              boxShadow: "1.5px 1.5px 0px #111111",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#FFF0ED";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#FAF7EE";
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
