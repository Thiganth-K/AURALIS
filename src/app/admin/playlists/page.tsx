"use client";

import React, { useEffect, useState } from "react";
import {
  ListMusic,
  Plus,
  Search,
  Trash2,
  Edit2,
  Loader2,
  Upload,
  AlertCircle,
  X,
  Music,
  Sparkles,
} from "lucide-react";

interface AdminPlaylistItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  artworkUrl: string;
  isCurated: boolean;
  isPublic: boolean;
  songCount: number;
  owner?: { name: string; email: string };
  createdAt: string;
}

interface SongOption {
  id: string;
  title: string;
  artist?: { name: string };
}

export default function AdminPlaylistsPage() {
  const [playlists, setPlaylists] = useState<AdminPlaylistItem[]>([]);
  const [availableSongs, setAvailableSongs] = useState<SongOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<AdminPlaylistItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formArtworkUrl, setFormArtworkUrl] = useState("");
  const [formIsCurated, setFormIsCurated] = useState(true);
  const [formIsPublic, setFormIsPublic] = useState(true);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, sRes] = await Promise.all([
        fetch("/api/admin/playlists"),
        fetch("/api/admin/songs?status=published"),
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.success) setPlaylists(pData.playlists);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.success) setAvailableSongs(sData.songs);
      }
    } catch (err) {
      console.error("Failed to load playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingPlaylist(null);
    setFormName("");
    setFormDescription("");
    setFormArtworkUrl("");
    setFormIsCurated(true);
    setFormIsPublic(true);
    setSelectedSongIds([]);
    setFormError(null);
    setModalOpen(true);
  };

  const handleArtworkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "artwork");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormArtworkUrl(data.url);
      } else {
        setFormError(data.error || "Failed to upload artwork");
      }
    } catch {
      setFormError("Upload network error");
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleSongSelection = (songId: string) => {
    setSelectedSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Playlist name is required");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      const payload = {
        name: formName.trim(),
        description: formDescription.trim(),
        artworkUrl: formArtworkUrl || undefined,
        isCurated: formIsCurated,
        isPublic: formIsPublic,
        songIds: selectedSongIds,
      };

      const url = editingPlaylist
        ? `/api/admin/playlists/${editingPlaylist.id}`
        : "/api/admin/playlists";
      const method = editingPlaylist ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to save playlist");
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      fetchData();
    } catch {
      setFormError("Network error while saving playlist");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete playlist "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/playlists/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPlaylists((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  const filtered = playlists.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ListMusic className="w-6 h-6 text-[#D7FF3F]" />
            <span>Editorial Playlists</span>
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Curate verified editorial playlists, weekly mixes, and radio stations for the public catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>New Editorial Playlist</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs w-full sm:w-80">
        <Search className="w-4 h-4 text-[#71717A] shrink-0" />
        <input
          type="text"
          placeholder="Filter playlists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-white placeholder-[#71717A] focus:outline-none"
        />
      </div>

      {/* Playlists Table */}
      <div className="rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#71717A] text-xs">
            No playlists found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[#71717A] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Playlist</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Songs</th>
                  <th className="py-3.5 px-4 font-semibold">Visibility</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((pl) => (
                  <tr key={pl.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pl.artworkUrl || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&auto=format&fit=crop&q=80"}
                          alt={pl.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                        />
                        <div>
                          <div className="font-semibold text-white">{pl.name}</div>
                          <div className="text-[11px] text-[#71717A] truncate max-w-xs">
                            {pl.description || `/${pl.slug}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {pl.isCurated ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D7FF3F]/10 text-[#D7FF3F] border border-[#D7FF3F]/20 font-mono text-[10px] uppercase font-bold">
                          <Sparkles className="w-2.5 h-2.5" /> Editorial
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[#A1A1AA] font-mono text-[10px] uppercase">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#A1A1AA]">
                      {pl.songCount} tracks
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                          pl.isPublic
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                        }`}
                      >
                        {pl.isPublic ? "Public" : "Private"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(pl.id, pl.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Editorial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#141414] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 shrink-0">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-[#D7FF3F]" />
                <span>Create Editorial Playlist</span>
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#71717A] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. AURALIS Weekly • Selection 01"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Curator Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="The definitive acoustic selections for late night focus."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Cover Artwork
                </label>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formArtworkUrl || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&auto=format&fit=crop&q=80"}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Cover</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleArtworkUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Add tracks from catalog */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[#A1A1AA]">
                    Include Catalog Songs ({selectedSongIds.length} selected)
                  </label>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-xl bg-[#181818] border border-white/10 p-2.5">
                  {availableSongs.map((song) => {
                    const isSelected = selectedSongIds.includes(song.id);
                    return (
                      <div
                        key={song.id}
                        onClick={() => toggleSongSelection(song.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                          isSelected
                            ? "bg-[#D7FF3F]/15 text-[#D7FF3F] border border-[#D7FF3F]/30"
                            : "hover:bg-white/5 text-[#A1A1AA]"
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-semibold text-white mr-1.5">{song.title}</span>
                          <span className="text-[11px] text-[#71717A]">• {song.artist?.name || "Artist"}</span>
                        </div>
                        <span className="text-[10px] font-mono">
                          {isSelected ? "Included" : "+ Add"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/5 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-5 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Editorial Playlist</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
