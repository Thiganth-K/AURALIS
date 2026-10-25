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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Music className="w-6 h-6 text-[#D7FF3F]" />
            <span>Song Catalog & Publishing</span>
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Authoritative track catalog. Draft uploads are hidden from public stream until published.
          </p>
        </div>
        <Link
          href="/admin/songs/new"
          className="px-4 py-2 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Upload New Track</span>
        </Link>
      </div>

      {actionError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="w-full sm:w-80 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs">
          <Search className="w-4 h-4 text-[#71717A] shrink-0" />
          <input
            type="text"
            placeholder="Search tracks, artists, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-[#71717A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-[#71717A]">Filter:</span>
          {(["all", "published", "draft", "archived"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                statusFilter === st
                  ? "bg-white text-black font-semibold"
                  : "bg-white/5 text-[#A1A1AA] hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Table */}
      <div className="rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#71717A] text-xs">
            No songs match the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[#71717A] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold w-10">Preview</th>
                  <th className="py-3.5 px-4 font-semibold">Track</th>
                  <th className="py-3.5 px-4 font-semibold">Artist</th>
                  <th className="py-3.5 px-4 font-semibold">Album</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Plays</th>
                  <th className="py-3.5 px-4 font-semibold">Duration</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((song) => {
                  const isPlaying = previewSongId === song.id;
                  return (
                    <tr key={song.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePreview(song)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                            isPlaying
                              ? "bg-[#D7FF3F] text-black"
                              : "bg-white/5 text-white hover:bg-white/10"
                          }`}
                        >
                          {isPlaying ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={song.artworkUrl}
                            alt={song.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{song.title}</span>
                              {song.explicit && (
                                <span className="text-[9px] font-mono px-1 rounded bg-white/10 text-[#A1A1AA]">
                                  E
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#71717A] font-mono">
                              {song.genre}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#A1A1AA]">
                        {song.artist?.name || "Independent"}
                      </td>
                      <td className="py-3.5 px-4 text-[#71717A]">
                        {song.album?.title || "Single"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                            song.status === "published"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : song.status === "draft"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                          }`}
                        >
                          {song.status === "published" && <CheckCircle className="w-3 h-3" />}
                          {song.status === "draft" && <Clock className="w-3 h-3" />}
                          {song.status === "archived" && <Archive className="w-3 h-3" />}
                          {song.status === "published" ? "LIVE" : song.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#A1A1AA]">
                        {song.playCount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#71717A]">
                        {formatTime(song.duration)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleTogglePublish(song)}
                            title={song.status === "published" ? "Unpublish to draft" : "Publish to live stream"}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-bold transition-all border ${
                              song.status === "published"
                                ? "bg-white/5 border-white/10 text-[#A1A1AA] hover:text-white"
                                : "bg-[#D7FF3F] border-[#D7FF3F] text-black hover:bg-[#cbf531]"
                            }`}
                          >
                            {song.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleDelete(song.id, song.title)}
                            title="Delete song"
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
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
