"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Music,
  Plus,
  Search,
  Play,
  Pause,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Archive,
  Loader2,
  AlertCircle,
  Radio,
} from "lucide-react";
import { formatTime } from "@/lib/utils";

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

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<AdminSongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
        if (data.success) {
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

  const filtered = songs.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.artist?.name && s.artist.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#242424]">
        <div>
          <h1 className="text-xl sm:text-2xl font-pixel tracking-wide text-white flex items-center gap-2.5">
            <Music className="w-5 h-5 text-[#D7FF3F]" />
            <span>SONG CATALOG // INGESTION</span>
          </h1>
          <p className="text-xs font-sans text-[#A1A1AA] mt-1">
            Authoritative track catalog. Draft uploads are hidden from public stream until published.
          </p>
        </div>
        <Link
          href="/admin/songs/new"
          className="retro-btn-primary px-4 py-2 text-xs font-pixel flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>[ + UPLOAD SIGNAL ]</span>
        </Link>
      </div>

      {actionError && (
        <div className="p-3 bg-red-950/40 border-2 border-red-500/40 text-red-400 text-xs font-pixel flex items-center gap-2 shadow-[2px_2px_0px_#000]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="w-full sm:w-80 flex items-center gap-2 px-3 py-1.5 bg-[#111111] border-2 border-[#262626] shadow-[2px_2px_0px_#000] focus-within:border-[#D7FF3F] text-xs">
          <Search className="w-3.5 h-3.5 text-[#D7FF3F] shrink-0" />
          <input
            type="text"
            placeholder="Search tracks, artists, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent font-pixel text-xs text-white placeholder-[#555] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-pixel text-[#71717A]">FILTER:</span>
          {(["all", "published", "draft", "archived"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-pixel uppercase transition-all border-2 shadow-[2px_2px_0px_#000] active:translate-y-0.5 ${
                statusFilter === st
                  ? "bg-[#D7FF3F] text-black border-black font-bold"
                  : "bg-[#141414] text-[#A1A1AA] border-[#262626] hover:text-white"
              }`}
            >
              [ {st} ]
            </button>
          ))}
        </div>
      </div>

      {/* Songs Table with Hard Retro Borders */}
      <div className="border-2 border-[#262626] bg-[#111111] shadow-[4px_4px_0px_#000] overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
            <span className="text-xs font-pixel text-[#71717A]">FETCHING CATALOG...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#71717A] text-xs font-pixel">
            NO SONGS MATCH THE ACTIVE FILTERS.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] border-b-2 border-[#262626] text-[#71717A] uppercase font-pixel text-[10px]">
                <tr>
                  <th className="py-3 px-3 w-10">CUE</th>
                  <th className="py-3 px-4">TRACK</th>
                  <th className="py-3 px-4">ARTIST</th>
                  <th className="py-3 px-4">ALBUM</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">PLAYS</th>
                  <th className="py-3 px-4">TIME</th>
                  <th className="py-3 px-4 text-right">COMMANDS</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b border-[#222]">
                {filtered.map((song) => {
                  const isPlaying = previewSongId === song.id;
                  return (
                    <tr key={song.id} className="hover:bg-[#161616] transition-colors">
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePreview(song)}
                          className={`w-7 h-7 border border-black flex items-center justify-center transition-colors shadow-[1px_1px_0px_#000] active:translate-y-0.5 ${
                            isPlaying
                              ? "bg-[#D7FF3F] text-black"
                              : "bg-[#181818] border-[#333] text-white hover:border-[#D7FF3F]"
                          }`}
                        >
                          {isPlaying ? (
                            <Pause className="w-3 h-3 fill-current" />
                          ) : (
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={song.artworkUrl}
                            alt={song.title}
                            className="w-9 h-9 border border-black object-cover shrink-0"
                          />
                          <div>
                            <div className="font-pixel text-xs text-white flex items-center gap-1.5">
                              <span>{song.title}</span>
                              {song.explicit && (
                                <span className="text-[9px] font-pixel px-1 bg-[#1c1c1c] border border-[#333] text-[#A1A1AA]">
                                  E
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#71717A] font-pixel">
                              {song.genre}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-sans text-[#A1A1AA]">
                        {song.artist?.name || "Independent"}
                      </td>
                      <td className="py-3 px-4 font-sans text-[#71717A]">
                        {song.album?.title || "Single"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-pixel uppercase font-bold border ${
                            song.status === "published"
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                              : song.status === "draft"
                              ? "bg-amber-950/40 text-amber-400 border-amber-500/30"
                              : "bg-neutral-900 text-neutral-400 border-neutral-700"
                          }`}
                        >
                          {song.status === "published" && <CheckCircle className="w-2.5 h-2.5" />}
                          {song.status === "draft" && <Clock className="w-2.5 h-2.5" />}
                          {song.status === "archived" && <Archive className="w-2.5 h-2.5" />}
                          {song.status === "published" ? "[ LIVE ]" : song.status === "draft" ? "[ DRAFT ]" : "[ ARCHIVED ]"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-pixel text-[#A1A1AA]">
                        {song.playCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-pixel text-[#71717A]">
                        {formatTime(song.duration)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleTogglePublish(song)}
                            title={song.status === "published" ? "Unpublish to draft" : "Publish to live stream"}
                            className={`px-2 py-0.5 text-[10px] font-pixel uppercase font-bold transition-all border shadow-[1px_1px_0px_#000] active:translate-y-0.5 ${
                              song.status === "published"
                                ? "bg-[#161616] border-[#333] text-[#A1A1AA] hover:text-white"
                                : "bg-[#D7FF3F] border-black text-black"
                            }`}
                          >
                            {song.status === "published" ? "[ UNPUBLISH ]" : "[ PUBLISH ]"}
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleDelete(song.id, song.title)}
                            title="Delete song"
                            className="p-1 border border-[#333] bg-[#161616] text-red-400 hover:border-red-500 hover:text-red-300 shadow-[1px_1px_0px_#000] active:translate-y-0.5"
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
